# Core Models - Complete Implementation
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import uuid
from datetime import datetime

class User(AbstractUser):
    """Extended User model with financial profile"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Financial Profile
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=3, default='USD')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Preferences
    notification_preferences = models.JSONField(default=dict)
    privacy_settings = models.JSONField(default=dict)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'

class Account(models.Model):
    """Financial accounts (bank, credit card, investment, etc.)"""
    
    ACCOUNT_TYPES = [
        ('checking', 'Checking Account'),
        ('savings', 'Savings Account'),
        ('credit', 'Credit Card'),
        ('investment', 'Investment Account'),
        ('loan', 'Loan Account'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    # Bank details
    bank_name = models.CharField(max_length=100, blank=True)
    account_number_last4 = models.CharField(max_length=4, blank=True)
    routing_number = models.CharField(max_length=20, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_primary = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accounts'
        ordering = ['-is_primary', 'name']

class Category(models.Model):
    """Transaction categories"""
    
    CATEGORY_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=50)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    color = models.CharField(max_length=7, default='#4F46E5')  # Hex color
    icon = models.CharField(max_length=50, default='💰')
    is_system = models.BooleanField(default=False)  # System-created categories
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        unique_together = ['user', 'name', 'category_type']
        ordering = ['category_type', 'name']

class Transaction(models.Model):
    """Financial transactions"""
    
    TRANSACTION_TYPES = [
        ('debit', 'Debit'),
        ('credit', 'Credit'),
        ('transfer', 'Transfer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    
    # Transaction details
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    
    # Transfer details (if applicable)
    transfer_to_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transfer_ins')
    
    # External data
    external_id = models.CharField(max_length=100, blank=True)  # Bank transaction ID
    merchant_name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    
    # Dates
    transaction_date = models.DateTimeField()
    posted_date = models.DateTimeField(null=True, blank=True)
    
    # Status and flags
    is_pending = models.BooleanField(default=False)
    is_recurring = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    
    # AI/ML fields
    confidence_score = models.FloatField(default=1.0, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    ai_categorized = models.BooleanField(default=False)
    ai_analysis = models.JSONField(default=dict)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-transaction_date']
        indexes = [
            models.Index(fields=['user', 'transaction_date']),
            models.Index(fields=['account', 'transaction_date']),
            models.Index(fields=['category']),
        ]

class Budget(models.Model):
    """Budget management"""
    
    BUDGET_PERIODS = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='budgets')
    
    # Budget details
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.CharField(max_length=20, choices=BUDGET_PERIODS)
    
    # Period dates
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Settings
    alert_threshold = models.FloatField(default=0.8, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    is_active = models.BooleanField(default=True)
    rollover_unused = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budgets'
        unique_together = ['user', 'category', 'start_date', 'end_date']

class Goal(models.Model):
    """Financial goals"""
    
    GOAL_TYPES = [
        ('savings', 'Savings Goal'),
        ('debt_payoff', 'Debt Payoff'),
        ('investment', 'Investment Target'),
        ('expense', 'Expense Reduction'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    
    # Goal details
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    target_amount = models.DecimalField(max_digits=15, decimal_places=2)
    current_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    
    # Timeline
    target_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Settings
    is_active = models.BooleanField(default=True)
    auto_contribute = models.BooleanField(default=False)
    contribution_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    class Meta:
        db_table = 'goals'
        ordering = ['target_date']

class FinancialHealthScore(models.Model):
    """Financial health scoring history"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_scores')
    
    # Overall score
    overall_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    grade = models.CharField(max_length=2)  # A+, A, B+, B, C+, C, D, F
    
    # Component scores
    debt_to_income_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    savings_rate_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    budget_adherence_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    credit_utilization_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    emergency_fund_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    investment_diversity_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Raw metrics
    debt_to_income_ratio = models.FloatField()
    savings_rate = models.FloatField()
    budget_variance = models.FloatField()
    credit_utilization_ratio = models.FloatField()
    emergency_fund_months = models.FloatField()
    
    # Metadata
    calculated_at = models.DateTimeField(auto_now_add=True)
    calculation_data = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'financial_health_scores'
        ordering = ['-calculated_at']

class AIInsight(models.Model):
    """AI-generated financial insights"""
    
    INSIGHT_TYPES = [
        ('spending_pattern', 'Spending Pattern'),
        ('budget_alert', 'Budget Alert'),
        ('savings_opportunity', 'Savings Opportunity'),
        ('investment_suggestion', 'Investment Suggestion'),
        ('anomaly_detection', 'Anomaly Detection'),
        ('goal_progress', 'Goal Progress'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_insights')
    
    # Insight details
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # AI metadata
    confidence_score = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    ai_model_version = models.CharField(max_length=50, default='gemini-1.5')
    
    # User interaction
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    user_feedback = models.CharField(max_length=20, blank=True)  # helpful, not_helpful, etc.
    
    # Related objects
    related_transactions = models.ManyToManyField(Transaction, blank=True)
    related_categories = models.ManyToManyField(Category, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ai_insights'
        ordering = ['-created_at']

class SyncOperation(models.Model):
    """Sync operations for offline-first architecture"""
    
    SYNC_ACTIONS = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    ]
    
    SYNC_STATUS = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sync_operations')
    
    # Operation details
    action = models.CharField(max_length=10, choices=SYNC_ACTIONS)
    entity_type = models.CharField(max_length=50)  # Transaction, Account, etc.
    entity_id = models.UUIDField()
    data = models.JSONField()
    
    # Sync metadata
    device_id = models.CharField(max_length=100)
    client_timestamp = models.DateTimeField()
    server_timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=SYNC_STATUS, default='PENDING')
    priority = models.IntegerField(default=1)  # 1=HIGH, 2=MEDIUM, 3=LOW
    
    # Conflict resolution
    conflict_resolution = models.CharField(max_length=50, blank=True)
    checksum = models.CharField(max_length=64)
    
    # Results
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'sync_operations'
        ordering = ['priority', 'client_timestamp']
