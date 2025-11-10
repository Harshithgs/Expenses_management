from rest_framework import serializers
from .models import Userdetails, Expense, Category

class UserdetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userdetails
        fields = ['id', 'FullName', 'Email', 'Password', 'RegDate']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Expense
        fields = [
            'id', 'user', 'title', 'amount', 'category', 'category_name',
            'payment_mode', 'note', 'expense_date', 'created_at'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Userdetails
        fields = [
            'id',
            'FullName',
            'Email',
            'bio',
            'currency',
            'monthly_income',
            'phone_number',
            'monthly_budget',
            'savings_goal',
            'profile_image',        # ✅ Add this line
            'profile_image_url',
        ]

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url)
        return request.build_absolute_uri('/media/profile_images/default.png')
