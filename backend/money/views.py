# ==========================================
# 🔹 Django Imports
# ==========================================
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.core.mail import send_mail, EmailMultiAlternatives
from django.db.models import Sum,Count
from django.utils import timezone

# ==========================================
# 🔹 Django REST Framework Imports
# ==========================================
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

# ==========================================
# 🔹 Project Imports
# ==========================================
from .models import Expense, Category, Userdetails
from .serializers import *

# ==========================================
# 🔹 Python Standard Library
# ==========================================
import os
import random
import calendar
import pandas as pd
from io import BytesIO
from datetime import datetime, timedelta

# ==========================================
# 🔹 ReportLab (PDF Generation)
# ==========================================
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image
)
from reportlab.pdfgen import canvas

# ==========================================
# 🔹 Matplotlib (Graphs)
# ==========================================
import matplotlib
matplotlib.use('Agg')  # ✅ Use non-GUI backend for Django
import matplotlib.pyplot as plt




@api_view(['POST'])
def signup(request):
    try:
        fullname = request.data.get("FullName")
        email = request.data.get("Email")
        password = request.data.get("Password")

        if Userdetails.objects.filter(Email=email).exists():
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = Userdetails.objects.create(
            FullName=fullname,
            Email=email,
            Password=password
        )
        serializer = UserdetailsSerializer(user)
        return Response({'message': 'User registered successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    email = request.data.get("Email")
    password = request.data.get("Password")

    try:
        user = Userdetails.objects.get(Email=email, Password=password)
        return Response({
            'message': 'Login Successful',
            'userId': user.id,
            'username': user.FullName
        }, status=status.HTTP_200_OK)
    except Userdetails.DoesNotExist:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_or_update_expense(request):
    user_id = request.data.get("userId")
    expense_id = request.data.get("expenseId", None)
    user = get_object_or_404(Userdetails, id=user_id)
    title = request.data.get("title", "Miscellaneous Expense")
    amount = request.data.get("amount", 0.00)
    category_name = request.data.get("category", "Other")
    payment_mode = request.data.get("payment_mode", "CASH")
    note = request.data.get("note", "")
    expense_date = request.data.get("expense_date", datetime.now().date())

    # ✅ Create or get category
    category, _ = Category.objects.get_or_create(name=category_name)

    if expense_id:
        # 🔁 Update existing expense
        expense = get_object_or_404(Expense, id=expense_id, user=user)
        expense.title = title
        expense.amount = amount
        expense.category = category
        expense.payment_mode = payment_mode
        expense.note = note
        expense.expense_date = expense_date
        expense.save()
        message = "Expense updated successfully!"
    else:
        # ➕ Add new expense
        expense = Expense.objects.create(
            user=user,
            title=title,
            amount=amount,
            category=category,
            payment_mode=payment_mode,
            note=note,
            expense_date=expense_date
        )
        message = "Expense added successfully!"

    serializer = ExpenseSerializer(expense)
    return Response({'message': message, 'expense': serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getexpense(request, user_Id):
    user = get_object_or_404(Userdetails, id=user_Id)
    expenses = Expense.objects.filter(user=user).select_related("category")
    serializer = ExpenseSerializer(expenses, many=True)
    return Response({"success": True, "expenses": serializer.data}, status=status.HTTP_200_OK)

@api_view(["POST"])
def forget_password(request):
    email = request.data.get("email")
    try:
        user = Userdetails.objects.get(Email=email)
    except Userdetails.DoesNotExist:
        return Response({'sucess':False,'message':'user not found'},status=status.HTTP_401_UNAUTHORIZED)
    otp = str(random.randint(100000,999999))
    user.otp = otp
    user.otp_created_at = timezone.now()
    user.save()
    
    subject = "🔒 Password Reset Request - Expense Tracker"
    text_content = f"Hi {user.FullName}, your OTP for password reset is {otp}. It will expire soon."

    # ✨ Beautiful HTML template
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
      <table align="center" width="100%" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h2 style="color: #4CAF50;">Expense Tracker</h2>
            <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
            <p style="font-size: 16px; color: #333;">Hi <b>{user.FullName}</b>,</p>
            <p style="font-size: 15px; color: #555;">
              You recently requested to reset your password. Please use the OTP below to proceed:
            </p>
            <div style="font-size: 28px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
              {otp}
            </div>
            <p style="font-size: 14px; color: #777;">
              This OTP is valid for the next <b>10 minutes</b>. If you didn’t request a password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
            <p style="font-size: 13px; color: #aaa;">© 2025 Expense Tracker. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    # 🧠 Create both text and HTML email versions
    msg = EmailMultiAlternatives(subject, text_content, 'noreply@yourexpensetracker.com', [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=False)

    return Response({'sucess':True,'message':'otp sent to mail sucessfully'})

@api_view(["POST"])
def reset_verify_opt(request):
    email = request.data.get("Email", "").strip()
    otp = request.data.get("otp")
    password = request.data.get("Password")

    try:
        user = Userdetails.objects.get(Email=email)
    except Userdetails.DoesNotExist:
        return Response({'success': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    if user.otp != otp:
        return Response({'success': False, 'message': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.otp_created_at:
        return Response({'success': False, 'message': 'OTP timestamp missing. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    expiry_time = user.otp_created_at + timezone.timedelta(minutes=5)
    if timezone.now() > expiry_time:
        return Response({'success': False, 'message': 'OTP expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    user.Password = password
    user.otp = None
    user.otp_created_at = None
    user.save()

    return Response({'success': True, 'message': 'Password reset successful.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def edit_profile(request):
    user_id = request.data.get("userId")

    if not user_id:
        return Response(
            {"success": False, "message": "User ID is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = Userdetails.objects.get(id=user_id)
    except Userdetails.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = UserProfileSerializer(
        user, data=request.data, partial=True, context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()

        # 🖼️ Generate proper absolute image URL
        profile_image_url = None
        if user.profile_image and hasattr(user.profile_image, 'url'):
            profile_image_url = request.build_absolute_uri(user.profile_image.url)

        return Response({
            'success': True,
            'message': 'Profile updated successfully!',
            'data': serializer.data,
            'profile_image_url': profile_image_url
        }, status=status.HTTP_200_OK)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_profile(request, user_id):
    try:
        user = Userdetails.objects.get(id=user_id)
    except Userdetails.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = UserProfileSerializer(user, context={'request': request})

    # 🖼️ Ensure proper absolute image URL
    profile_image_url = None
    if user.profile_image and hasattr(user.profile_image, 'url'):
        profile_image_url = request.build_absolute_uri(user.profile_image.url)

    return Response({
        'success': True,
        'profile': serializer.data,
        'profile_image_url': profile_image_url
    }, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def bulk_upload_expenses(request):
    try:
        file = request.FILES.get('file')
        user_id = request.data.get('userId')

        if not file:
            return Response({'success': False, 'message': 'No file uploaded'}, status=400)
        if not user_id:
            return Response({'success': False, 'message': 'User ID required'}, status=400)

        import json
        data = json.load(file)
        print("📄 JSON content:", type(data), len(data) if isinstance(data, list) else "not list")  # <-- DEBUG

        user = get_object_or_404(Userdetails, id=user_id)
        created_count = 0

        # ✅ Handle case if your JSON file has {"expenses": [...]} instead of [...]
        if isinstance(data, dict) and "expenses" in data:
            data = data["expenses"]

        for entry in data:
            print("🧾 Entry:", entry)  # <-- DEBUG check

            category_name = entry.get("category", "Other")
            category, _ = Category.objects.get_or_create(name=category_name)

            Expense.objects.create(
                user=user,
                title=entry.get("title", "Miscellaneous"),
                amount=entry.get("amount", 0),
                category=category,
                payment_mode=entry.get("payment_mode", "CASH"),
                note=entry.get("note", ""),
                expense_date=entry.get("expense_date")
            )
            created_count += 1

        print(f"✅ Created {created_count} records")  # <-- DEBUG

        return Response({
            'success': True,
            'message': f'{created_count} expenses uploaded successfully!'
        }, status=201)

    except Exception as e:
        print("❌ Error:", e)
        return Response({'success': False, 'error': str(e)}, status=500)
    
@api_view(['GET'])
def expense_summary(request, user_id):
    try:
        user = Userdetails.objects.get(id=user_id)
    except Userdetails.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    today = timezone.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)
    start_of_year = today.replace(month=1, day=1)

    expenses = Expense.objects.filter(user=user)

    def get_total(qs):
        return qs.aggregate(total=Sum('amount'))['total'] or 0

    def category_summary(qs):
        return list(
            qs.values('category__name')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

    def payment_summary(qs):
        return list(
            qs.values('payment_mode')
            .annotate(
                total_amount=Sum('amount'),
                count=Count('id')
            )
            .order_by('-total_amount')
        )

    # Filters by time period
    today_expenses = expenses.filter(expense_date=today)
    yesterday_expenses = expenses.filter(expense_date=today - timedelta(days=1))
    weekly_expenses = expenses.filter(expense_date__gte=start_of_week)
    monthly_expenses = expenses.filter(expense_date__gte=start_of_month)
    yearly_expenses = expenses.filter(expense_date__gte=start_of_year)

    data = {
        "success": True,
        "summary": {
            "today": get_total(today_expenses),
            "yesterday": get_total(yesterday_expenses),
            "weekly": get_total(weekly_expenses),
            "monthly": get_total(monthly_expenses),
            "yearly": get_total(yearly_expenses),
            "total": get_total(expenses),
        },
        "by_category": {
            "today": category_summary(today_expenses),
            "yesterday": category_summary(yesterday_expenses),
            "weekly": category_summary(weekly_expenses),
            "monthly": category_summary(monthly_expenses),
            "yearly": category_summary(yearly_expenses),
            "overall": category_summary(expenses),
        },
        "by_payment_mode": {
            "today": payment_summary(today_expenses),
            "yesterday": payment_summary(yesterday_expenses),
            "weekly": payment_summary(weekly_expenses),
            "monthly": payment_summary(monthly_expenses),
            "yearly": payment_summary(yearly_expenses),
            "overall": payment_summary(expenses),
        }
    }

    return Response(data, status=status.HTTP_200_OK)

# ✅ Footer for every page
def footer(canvas_obj, doc):
    canvas_obj.saveState()
    footer_text = "@Expense Tracker — Confidential Report"
    canvas_obj.setFont("Helvetica-Oblique", 9)
    canvas_obj.drawCentredString(A4[0] / 2, 0.5 * inch, footer_text)
    canvas_obj.restoreState()


@api_view(['GET'])
def download_expense_report(request, user_id):
    try:
        user = get_object_or_404(Userdetails, id=user_id)
        category_id = request.GET.get("category_id")

        # 🔹 Filter expenses
        expenses = Expense.objects.filter(user=user)
        if category_id:
            expenses = expenses.filter(category_id=category_id)

        if not expenses.exists():
            return Response({
                "success": False,
                "message": "No expenses found for this user/category."
            }, status=status.HTTP_404_NOT_FOUND)

        # 🔹 Prepare PDF
        buffer = BytesIO()
        pdf = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=50,
            rightMargin=50,
            topMargin=70,
            bottomMargin=50
        )

        # 🔹 Styles
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name="ReportTitleCustom", fontSize=22, leading=28, alignment=1,
                                  spaceAfter=15, textColor=colors.HexColor("#1F4E79")))
        styles.add(ParagraphStyle(name="SectionHeaderCustom", fontSize=14, leading=18, spaceAfter=10,
                                  textColor=colors.HexColor("#154360")))
        styles.add(ParagraphStyle(name="BulletCustom", fontSize=11.5, leading=15, leftIndent=25, spaceAfter=6))
        styles.add(ParagraphStyle(name="NormalTextCustom", fontSize=11.5, leading=14, spaceAfter=10))

        content = []

        # 🧾 Title
        report_title = f"Expense Report — {user.FullName}"
        if category_id:
            cat_name = Category.objects.get(id=category_id).name
            report_title += f" ({cat_name})"
        content.append(Paragraph(report_title, styles["ReportTitleCustom"]))
        content.append(Spacer(1, 5))
        content.append(Paragraph("<hr width='100%' color='#1F4E79'/>", styles["NormalTextCustom"]))
        content.append(Spacer(1, 20))

        # 🧮 Data prep
        df = pd.DataFrame(list(expenses.values("title", "amount", "expense_date", "category__name")))
        df["month_year"] = pd.to_datetime(df["expense_date"]).dt.strftime("%b %Y")

        total_expense = df["amount"].sum()
        avg_expense = df["amount"].mean()
        max_expense = df["amount"].max()
        min_expense = df["amount"].min()
        num_expenses = len(df)

        # 📘 Summary
        content.append(Paragraph("📘 Executive Summary", styles["SectionHeaderCustom"]))
        summary_points = [
            f"• Total Spending Recorded: <b>Rs {total_expense:,.2f}</b>",
            f"• Average Expense per Entry: <b>Rs {avg_expense:,.2f}</b>",
            f"• Highest Single Expense: <b>Rs {max_expense:,.2f}</b>",
            f"• Lowest Expense Recorded: <b>Rs {min_expense:,.2f}</b>",
            f"• Total Transactions: <b>{num_expenses}</b>",
        ]
        if category_id:
            summary_points.append(f"• Report focused on Category: <b>{cat_name}</b>")
        else:
            summary_points.append("• Report includes all categories.")
        for line in summary_points:
            content.append(Paragraph(line, styles["BulletCustom"]))
        content.append(Spacer(1, 25))

        # 📅 Monthly summary table
        monthly_totals = df.groupby("month_year")["amount"].sum().to_dict()
        sorted_months = sorted(
            monthly_totals.items(),
            key=lambda x: (
                int(x[0].split()[1]),  # Year
                list(calendar.month_abbr).index(x[0].split()[0])  # Month order
            )
        )

        content.append(Paragraph("📅 Monthly Expense Summary", styles["SectionHeaderCustom"]))
        month_data = [["Month", "Total (Rs.)"]]
        for month, total in sorted_months:
            month_data.append([month, f"Rs {total:,.2f}"])

        month_table = Table(month_data, colWidths=[260, 230])
        month_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F618D")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTSIZE", (0, 0), (-1, -1), 11),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("TOPPADDING", (0, 0), (-1, 0), 8),
        ]))
        content.append(month_table)
        content.append(Spacer(1, 25))

        # 📊 Bar Chart (centered & larger)
        months, totals = zip(*sorted_months)
        plt.figure(figsize=(8, 4))  # ✅ Bigger width for full-page center alignment
        plt.bar(months, totals, color="#2874A6", width=0.6)
        plt.title("Monthly Expense Trend", fontsize=14, fontweight='bold', pad=15)
        plt.xlabel("Month", fontsize=11)
        plt.ylabel("Total (Rs)", fontsize=11)
        plt.xticks(rotation=45, ha="center")
        plt.grid(axis="y", linestyle="--", alpha=0.6)

        chart_buffer = BytesIO()
        plt.tight_layout()
        plt.savefig(chart_buffer, format="png", bbox_inches='tight')
        plt.close()
        chart_buffer.seek(0)
        chart = Image(chart_buffer, width=500, height=300)  # ✅ Wider chart for visual balance
        content.append(chart)
        content.append(Spacer(1, 20))

        # 🔹 Monthly difference analysis (below graph)
        content.append(Paragraph("📈 Month-over-Month Analysis", styles["SectionHeaderCustom"]))
        diff_texts = []
        for i in range(1, len(sorted_months)):
            prev_month, prev_total = sorted_months[i - 1]
            curr_month, curr_total = sorted_months[i]
            diff = curr_total - prev_total
            direction = "increased" if diff > 0 else "decreased"
            diff_texts.append(
                f"• From <b>{prev_month}</b> to <b>{curr_month}</b>, expenses {direction} by <b>Rs {abs(diff):,.2f}</b>."
            )
        if not diff_texts:
            diff_texts.append("• Only one month of data available, no comparison possible.")
        for line in diff_texts:
            content.append(Paragraph(line, styles["BulletCustom"]))
        content.append(Spacer(1, 25))

        # 🥧 Pie Chart — only if NOT category-filtered
        if not category_id:
            cat_totals = df.groupby("category__name")["amount"].sum()
            plt.figure(figsize=(5.5, 5.5))
            plt.pie(cat_totals, labels=cat_totals.index, autopct="%1.1f%%", startangle=140)
            plt.title("Expenses by Category", fontsize=13, fontweight='bold')
            pie_buffer = BytesIO()
            plt.savefig(pie_buffer, format="png")
            plt.close()
            pie_buffer.seek(0)
            pie_chart = Image(pie_buffer, width=350, height=350)
            content.append(pie_chart)
            content.append(Spacer(1, 25))

        # 📑 Detailed Expense Records (start new page)
        content.append(PageBreak())
        content.append(Paragraph("📑 Detailed Expense Records", styles["SectionHeaderCustom"]))

        detail_data = [["Title", "Category", "Date", "Amount (Rs.)"]]
        for exp in expenses:
            detail_data.append([
                exp.title,
                exp.category.name if exp.category else "N/A",
                exp.expense_date.strftime("%d-%b-%Y"),
                f"Rs {exp.amount:,.2f}",
            ])

        detail_table = Table(detail_data, colWidths=[220, 140, 100, 90])
        detail_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#154360")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTSIZE", (0, 0), (-1, -1), 10.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
        ]))
        content.append(detail_table)

        # 🔹 Footer
        def footer(canvas, doc):
            canvas.saveState()
            canvas.setFont("Helvetica-Oblique", 8)
            canvas.drawCentredString(A4[0] / 2, 30, "@Expense Tracker — Confidential Report")
            canvas.restoreState()

        pdf.build(content, onFirstPage=footer, onLaterPages=footer)
        buffer.seek(0)

        return FileResponse(buffer, as_attachment=True, filename=f"Expense_Report_{user.FullName}.pdf")

    except Exception as e:
        return Response({"success": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = Userdetails.objects.get(id=user_id)
        user.delete()
        return Response({
            "success": True,
            "message": "User deleted successfully!"
        })
    except Userdetails.DoesNotExist:
        return Response({
            "success": False,
            "message": "User not found!"
        }, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['DELETE'])
def delete_expense(request, id):
    try:
        expense = Expense.objects.get(id=id)
        expense.delete()
        return Response({"message": "Expense deleted successfully!"}, status=status.HTTP_200_OK)
    except Expense.DoesNotExist:
        return Response({"error": "Expense not found."}, status=status.HTTP_404_NOT_FOUND)
