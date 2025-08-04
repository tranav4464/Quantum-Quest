from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal

User = get_user_model()


class Budget(models.Model):
    """
    Budget model for tracking spending limits
    """
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='budgets',
        help_text="User who owns this budget"
    )
    
    name = models.CharField(
        max_length=100,
        help_text="Budget name"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Budget description"
    )
    
    # Budget configuration
    period = models.CharField(
        max_length=20,
        choices=PERIOD_CHOICES,
        default='monthly',
        help_text="Budget period"
    )
    
    total_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Total budget amount"
    )
    
    # Date range
    start_date = models.DateField(
        help_text="Budget start date"
    )
    
    end_date = models.DateField(
        help_text="Budget end date"
    )
    
    # Status and settings
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this budget is active"
    )
    
    # Alert settings
    alert_at_percentage = models.IntegerField(
        default=80,
        help_text="Alert when spending reaches this percentage"
    )
    
    alert_enabled = models.BooleanField(
        default=True,
        help_text="Whether alerts are enabled"
    )
    
    # Auto-renewal
    auto_renew = models.BooleanField(
        default=False,
        help_text="Whether to automatically renew this budget"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budgets'
        verbose_name = 'Budget'
        verbose_name_plural = 'Budgets'
        ordering = ['-created_at']
        unique_together = ['user', 'name', 'start_date']
    
    def __str__(self):
        return f"{self.name} ({self.period})"
    
    @property
    def spent_amount(self):
        """Calculate total spent amount for this budget"""
        from apps.transactions.models import Transaction
        
        spent = Transaction.objects.filter(
            user=self.user,
            transaction_type='expense',
            transaction_date__gte=self.start_date,
            transaction_date__lte=self.end_date,
            budget=self
        ).aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0')
        
        return spent
    
    @property
    def remaining_amount(self):
        """Calculate remaining budget amount"""
        return self.total_amount - self.spent_amount
    
    @property
    def spent_percentage(self):
        """Calculate percentage of budget spent"""
        if self.total_amount > 0:
            return (self.spent_amount / self.total_amount) * 100
        return 0
    
    @property
    def is_over_budget(self):
        """Check if budget is exceeded"""
        return self.spent_amount > self.total_amount
    
    @property
    def should_alert(self):
        """Check if alert should be triggered"""
        return self.spent_percentage >= self.alert_at_percentage


class BudgetCategory(models.Model):
    """
    Category-specific budget allocations
    """
    budget = models.ForeignKey(
        Budget,
        on_delete=models.CASCADE,
        related_name='category_allocations'
    )
    
    category = models.ForeignKey(
        'transactions.Category',
        on_delete=models.CASCADE,
        related_name='budget_allocations'
    )
    
    allocated_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Amount allocated to this category"
    )
    
    # Alert settings for category
    alert_at_percentage = models.IntegerField(
        default=80,
        help_text="Alert when category spending reaches this percentage"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Notes about this category allocation"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budget_categories'
        verbose_name = 'Budget Category'
        verbose_name_plural = 'Budget Categories'
        unique_together = ['budget', 'category']
    
    def __str__(self):
        return f"{self.budget.name} - {self.category.name}"
    
    @property
    def spent_amount(self):
        """Calculate amount spent in this category for the budget period"""
        from apps.transactions.models import Transaction
        
        spent = Transaction.objects.filter(
            user=self.budget.user,
            transaction_type='expense',
            category=self.category,
            transaction_date__gte=self.budget.start_date,
            transaction_date__lte=self.budget.end_date
        ).aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0')
        
        return spent
    
    @property
    def remaining_amount(self):
        """Calculate remaining amount for this category"""
        return self.allocated_amount - self.spent_amount
    
    @property
    def spent_percentage(self):
        """Calculate percentage of category budget spent"""
        if self.allocated_amount > 0:
            return (self.spent_amount / self.allocated_amount) * 100
        return 0
    
    @property
    def is_over_budget(self):
        """Check if category budget is exceeded"""
        return self.spent_amount > self.allocated_amount


class BudgetAlert(models.Model):
    """
    Budget alerts and notifications
    """
    ALERT_TYPES = [
        ('budget_threshold', 'Budget Threshold'),
        ('category_threshold', 'Category Threshold'),
        ('budget_exceeded', 'Budget Exceeded'),
        ('category_exceeded', 'Category Exceeded'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('acknowledged', 'Acknowledged'),
        ('dismissed', 'Dismissed'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='budget_alerts'
    )
    
    budget = models.ForeignKey(
        Budget,
        on_delete=models.CASCADE,
        related_name='alerts'
    )
    
    category = models.ForeignKey(
        'transactions.Category',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='budget_alerts'
    )
    
    alert_type = models.CharField(
        max_length=30,
        choices=ALERT_TYPES
    )
    
    title = models.CharField(
        max_length=255,
        help_text="Alert title"
    )
    
    message = models.TextField(
        help_text="Alert message"
    )
    
    threshold_percentage = models.IntegerField(
        null=True,
        blank=True,
        help_text="Threshold percentage that triggered the alert"
    )
    
    current_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Current spending percentage when alert was created"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'budget_alerts'
        verbose_name = 'Budget Alert'
        verbose_name_plural = 'Budget Alerts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.alert_type}: {self.title}"
    
    def mark_as_sent(self):
        """Mark alert as sent"""
        from django.utils import timezone
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save()
    
    def mark_as_acknowledged(self):
        """Mark alert as acknowledged"""
        from django.utils import timezone
        self.status = 'acknowledged'
        self.acknowledged_at = timezone.now()
        self.save()


class BudgetReport(models.Model):
    """
    Generated budget reports
    """
    REPORT_TYPES = [
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('yearly', 'Yearly Report'),
        ('custom', 'Custom Period Report'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='budget_reports'
    )
    
    budget = models.ForeignKey(
        Budget,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    
    report_type = models.CharField(
        max_length=20,
        choices=REPORT_TYPES
    )
    
    title = models.CharField(
        max_length=255,
        help_text="Report title"
    )
    
    # Report period
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Report data (JSON)
    report_data = models.JSONField(
        default=dict,
        help_text="Generated report data in JSON format"
    )
    
    # Report file
    report_file = models.FileField(
        upload_to='budget_reports/',
        null=True,
        blank=True,
        help_text="Generated report file (PDF, etc.)"
    )
    
    # Status
    is_generated = models.BooleanField(
        default=False,
        help_text="Whether the report has been generated"
    )
    
    generated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the report was generated"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budget_reports'
        verbose_name = 'Budget Report'
        verbose_name_plural = 'Budget Reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.budget.name}"
