from django.db import models
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.apps import apps

class Userdetails(models.Model):
    FullName = models.CharField(max_length=255)
    Email = models.EmailField(max_length=255, unique=True)
    Password = models.CharField(max_length=50)
    RegDate = models.DateTimeField(auto_now_add=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default="INR")
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    savings_goal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    profile_image = models.ImageField(
        upload_to='profile_images/',
        null=True,
        blank=True,
        default='profile_images/default_profile.png'  # ✅ default image
    )



    def __str__(self):
        return self.FullName


class Category(models.Model):
    DEFAULT_CHOICES = [
        ("FOOD", "Food & Dining"),
        ("CLOTHES", "Clothing & Fashion"),
        ("FURNITURE", "Furniture & Home"),
        ("ONLINE_DELIVERY", "Online Delivery"),
        ("ENTERTAINMENT", "Entertainment"),
        ("TRANSPORT", "Transport"),
        ("UTILITIES", "Utilities & Bills"),
        ("MEDICAL", "Medical & Health"),
        ("OTHER", "Other"),
    ]

    name = models.CharField(max_length=100, unique=True)
    is_custom = models.BooleanField(default=False)
    created_by = models.ForeignKey('Userdetails', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name


class Expense(models.Model):
    PAYMENT_MODES = [
        ("CASH", "Cash"),
        ("CARD", "Credit/Debit Card"),
        ("UPI", "UPI / Online Payment"),
        ("BANK_TRANSFER", "Bank Transfer"),
        ("WALLET", "Digital Wallet"),
        ("OTHER", "Other"),
    ]

    user = models.ForeignKey('Userdetails', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255, default="Miscellaneous Expense")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    expense_date = models.DateField(default=timezone.now)
    payment_mode = models.CharField(max_length=50, choices=PAYMENT_MODES, default="CASH")
    note = models.TextField(blank=True, null=True, default="")
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        # ✅ If no category is chosen, use 'Other' by default
        if not self.category:
            try:
                other_category = Category.objects.get(name="Other")
                self.category = other_category
            except Category.DoesNotExist:
                self.category = None  # fallback
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - ₹{self.amount} ({self.get_payment_mode_display()})"


def create_default_categories(sender, **kwargs):
    Category = apps.get_model('money', 'Category')
    defaults = [choice[1] for choice in Category.DEFAULT_CHOICES]
    for cat in defaults:
        Category.objects.get_or_create(name=cat, is_custom=False)


post_migrate.connect(create_default_categories)
