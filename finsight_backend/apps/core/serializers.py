# Core API Serializers - Complete Implementation
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Account, Category, Transaction, Budget, Goal, FinancialHealthScore, AIInsight, SyncOperation
from decimal import Decimal

class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 
                 'phone', 'date_of_birth', 'monthly_income', 'currency', 'timezone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 
                 'date_of_birth', 'monthly_income', 'currency', 'timezone',
                 'notification_preferences', 'privacy_settings', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class LoginSerializer(serializers.Serializer):
    """Login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password')

class AccountSerializer(serializers.ModelSerializer):
    """Account serializer"""
    balance_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Account
        fields = ['id', 'name', 'account_type', 'balance', 'balance_display', 'credit_limit',
                 'bank_name', 'account_number_last4', 'is_active', 'is_primary', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_balance_display(self, obj):
        return f"${obj.balance:,.2f}"

class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    transaction_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_type', 'color', 'icon', 'is_system', 
                 'parent', 'transaction_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'is_system', 'created_at', 'updated_at']

    def get_transaction_count(self, obj):
        return obj.transactions.count()

class TransactionSerializer(serializers.ModelSerializer):
    """Transaction serializer"""
    account_name = serializers.CharField(source='account.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    amount_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'account', 'account_name', 'category', 'category_name', 
                 'amount', 'amount_display', 'transaction_type', 'description', 'notes',
                 'transfer_to_account', 'merchant_name', 'location', 'transaction_date',
                 'posted_date', 'is_pending', 'is_recurring', 'is_hidden',
                 'confidence_score', 'ai_categorized', 'ai_analysis', 'created_at', 'updated_at']
        read_only_fields = ['id', 'ai_categorized', 'ai_analysis', 'created_at', 'updated_at']

    def get_amount_display(self, obj):
        sign = '+' if obj.transaction_type == 'credit' else '-'
        return f"{sign}${obj.amount:,.2f}"

class BudgetSerializer(serializers.ModelSerializer):
    """Budget serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'name', 'amount', 'period',
                 'start_date', 'end_date', 'alert_threshold', 'is_active', 'rollover_unused',
                 'spent_amount', 'remaining_amount', 'progress_percentage', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_spent_amount(self, obj):
        # Calculate spent amount for this budget period
        transactions = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            transaction_date__range=[obj.start_date, obj.end_date],
            transaction_type='debit'
        )
        return sum(t.amount for t in transactions)

    def get_remaining_amount(self, obj):
        spent = self.get_spent_amount(obj)
        return max(obj.amount - spent, Decimal('0.00'))

    def get_progress_percentage(self, obj):
        spent = self.get_spent_amount(obj)
        if obj.amount > 0:
            return min((spent / obj.amount) * 100, 100)
        return 0

class GoalSerializer(serializers.ModelSerializer):
    """Goal serializer"""
    progress_percentage = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal
        fields = ['id', 'name', 'description', 'goal_type', 'target_amount', 'current_amount',
                 'target_date', 'is_active', 'auto_contribute', 'contribution_amount',
                 'progress_percentage', 'remaining_amount', 'days_remaining', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_progress_percentage(self, obj):
        if obj.target_amount > 0:
            return (obj.current_amount / obj.target_amount) * 100
        return 0

    def get_remaining_amount(self, obj):
        return max(obj.target_amount - obj.current_amount, Decimal('0.00'))

    def get_days_remaining(self, obj):
        from datetime import date
        return (obj.target_date - date.today()).days

class FinancialHealthScoreSerializer(serializers.ModelSerializer):
    """Financial health score serializer"""
    
    class Meta:
        model = FinancialHealthScore
        fields = ['id', 'overall_score', 'grade', 'debt_to_income_score', 'savings_rate_score',
                 'budget_adherence_score', 'credit_utilization_score', 'emergency_fund_score',
                 'investment_diversity_score', 'debt_to_income_ratio', 'savings_rate',
                 'budget_variance', 'credit_utilization_ratio', 'emergency_fund_months',
                 'calculated_at', 'calculation_data']
        read_only_fields = ['id', 'calculated_at']

class AIInsightSerializer(serializers.ModelSerializer):
    """AI insight serializer"""
    
    class Meta:
        model = AIInsight
        fields = ['id', 'insight_type', 'title', 'content', 'confidence_score',
                 'ai_model_version', 'is_read', 'is_dismissed', 'user_feedback',
                 'related_transactions', 'related_categories', 'created_at', 'expires_at']
        read_only_fields = ['id', 'created_at', 'ai_model_version']

class SyncOperationSerializer(serializers.ModelSerializer):
    """Sync operation serializer"""
    
    class Meta:
        model = SyncOperation
        fields = ['id', 'action', 'entity_type', 'entity_id', 'data', 'device_id',
                 'client_timestamp', 'server_timestamp', 'status', 'priority',
                 'conflict_resolution', 'checksum', 'error_message', 'retry_count']
        read_only_fields = ['id', 'server_timestamp', 'status', 'error_message', 'retry_count']

# Analytics Serializers
class DashboardSerializer(serializers.Serializer):
    """Dashboard data serializer"""
    total_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    monthly_income = serializers.DecimalField(max_digits=15, decimal_places=2)
    monthly_expenses = serializers.DecimalField(max_digits=15, decimal_places=2)
    savings_rate = serializers.FloatField()
    
    # Recent transactions
    recent_transactions = TransactionSerializer(many=True)
    
    # Budget status
    active_budgets = BudgetSerializer(many=True)
    
    # Goals progress
    active_goals = GoalSerializer(many=True)
    
    # Financial health
    financial_health_score = serializers.IntegerField()
    health_grade = serializers.CharField()
    
    # AI insights
    pending_insights = AIInsightSerializer(many=True)

class SpendingAnalysisSerializer(serializers.Serializer):
    """Spending analysis serializer"""
    period = serializers.CharField()
    total_spending = serializers.DecimalField(max_digits=15, decimal_places=2)
    category_breakdown = serializers.DictField()
    month_over_month_change = serializers.FloatField()
    top_merchants = serializers.ListField()
    spending_trends = serializers.ListField()

class CashFlowPredictionSerializer(serializers.Serializer):
    """Cash flow prediction serializer"""
    prediction_date = serializers.DateField()
    predicted_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    confidence_score = serializers.FloatField()
    factors = serializers.ListField()
    scenarios = serializers.DictField()
