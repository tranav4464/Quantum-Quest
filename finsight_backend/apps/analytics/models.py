from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid

User = get_user_model()


class FinancialSnapshot(models.Model):
    """
    Periodic financial snapshots for tracking financial health over time
    """
    SNAPSHOT_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='financial_snapshots'
    )
    
    snapshot_type = models.CharField(
        max_length=20,
        choices=SNAPSHOT_TYPES,
        help_text="Type of snapshot"
    )
    
    snapshot_date = models.DateField(
        help_text="Date of the snapshot"
    )
    
    # Financial metrics
    total_income = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total income for the period"
    )
    
    total_expenses = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total expenses for the period"
    )
    
    net_income = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Net income (income - expenses)"
    )
    
    # Account balances
    total_assets = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total assets value"
    )
    
    total_liabilities = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total liabilities value"
    )
    
    net_worth = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Net worth (assets - liabilities)"
    )
    
    # Savings and investments
    total_savings = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total savings amount"
    )
    
    total_investments = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total investments value"
    )
    
    # Goals progress
    total_goal_progress = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total progress towards goals"
    )
    
    # Budget performance
    total_budget_allocated = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total budget allocated"
    )
    
    total_budget_spent = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total budget spent"
    )
    
    # Financial health score
    financial_health_score = models.IntegerField(
        default=0,
        help_text="Financial health score (0-100)"
    )
    
    # Snapshot data (JSON for detailed breakdown)
    snapshot_data = models.JSONField(
        default=dict,
        help_text="Detailed snapshot data in JSON format"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'financial_snapshots'
        verbose_name = 'Financial Snapshot'
        verbose_name_plural = 'Financial Snapshots'
        ordering = ['-snapshot_date']
        unique_together = ['user', 'snapshot_type', 'snapshot_date']
    
    def __str__(self):
        return f"{self.user.email} - {self.snapshot_type} - {self.snapshot_date}"
    
    @property
    def savings_rate(self):
        """Calculate savings rate percentage"""
        if self.total_income > 0:
            savings = self.total_income - self.total_expenses
            return (savings / self.total_income) * 100
        return 0
    
    @property
    def expense_ratio(self):
        """Calculate expense to income ratio"""
        if self.total_income > 0:
            return (self.total_expenses / self.total_income) * 100
        return 0


class SpendingPattern(models.Model):
    """
    Analysis of spending patterns and trends
    """
    PATTERN_TYPES = [
        ('category_trend', 'Category Spending Trend'),
        ('monthly_pattern', 'Monthly Spending Pattern'),
        ('seasonal_pattern', 'Seasonal Pattern'),
        ('day_of_week', 'Day of Week Pattern'),
        ('merchant_frequency', 'Merchant Frequency'),
        ('amount_distribution', 'Amount Distribution'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='spending_patterns'
    )
    
    pattern_type = models.CharField(
        max_length=30,
        choices=PATTERN_TYPES,
        help_text="Type of spending pattern"
    )
    
    # Analysis period
    analysis_start_date = models.DateField(
        help_text="Start date of analysis period"
    )
    
    analysis_end_date = models.DateField(
        help_text="End date of analysis period"
    )
    
    # Pattern data
    pattern_data = models.JSONField(
        default=dict,
        help_text="Pattern analysis data in JSON format"
    )
    
    # Key insights
    insights = models.JSONField(
        default=list,
        help_text="Key insights from the pattern analysis"
    )
    
    # Confidence score
    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Confidence score for the pattern (0-100)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'spending_patterns'
        verbose_name = 'Spending Pattern'
        verbose_name_plural = 'Spending Patterns'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.get_pattern_type_display()}"


class FinancialInsight(models.Model):
    """
    AI-generated financial insights and recommendations
    """
    INSIGHT_TYPES = [
        ('spending_alert', 'Spending Alert'),
        ('savings_opportunity', 'Savings Opportunity'),
        ('budget_recommendation', 'Budget Recommendation'),
        ('goal_suggestion', 'Goal Suggestion'),
        ('investment_tip', 'Investment Tip'),
        ('debt_strategy', 'Debt Strategy'),
        ('financial_milestone', 'Financial Milestone'),
        ('trend_analysis', 'Trend Analysis'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='financial_insights'
    )
    
    insight_type = models.CharField(
        max_length=30,
        choices=INSIGHT_TYPES,
        help_text="Type of financial insight"
    )
    
    title = models.CharField(
        max_length=255,
        help_text="Insight title"
    )
    
    description = models.TextField(
        help_text="Detailed insight description"
    )
    
    # Priority and actionability
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_LEVELS,
        default='medium'
    )
    
    is_actionable = models.BooleanField(
        default=True,
        help_text="Whether this insight has actionable recommendations"
    )
    
    # Recommended actions
    recommended_actions = models.JSONField(
        default=list,
        help_text="List of recommended actions"
    )
    
    # Data source
    data_sources = models.JSONField(
        default=list,
        help_text="Data sources used to generate this insight"
    )
    
    # Impact estimation
    potential_savings = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Potential savings from this insight"
    )
    
    impact_score = models.IntegerField(
        default=0,
        help_text="Impact score (0-100)"
    )
    
    # User interaction
    is_viewed = models.BooleanField(
        default=False,
        help_text="Whether user has viewed this insight"
    )
    
    is_dismissed = models.BooleanField(
        default=False,
        help_text="Whether user has dismissed this insight"
    )
    
    is_acted_upon = models.BooleanField(
        default=False,
        help_text="Whether user has acted on this insight"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    dismissed_at = models.DateTimeField(null=True, blank=True)
    acted_upon_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'financial_insights'
        verbose_name = 'Financial Insight'
        verbose_name_plural = 'Financial Insights'
        ordering = ['-priority', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    def mark_as_viewed(self):
        """Mark insight as viewed"""
        from django.utils import timezone
        self.is_viewed = True
        self.viewed_at = timezone.now()
        self.save()
    
    def mark_as_dismissed(self):
        """Mark insight as dismissed"""
        from django.utils import timezone
        self.is_dismissed = True
        self.dismissed_at = timezone.now()
        self.save()
    
    def mark_as_acted_upon(self):
        """Mark insight as acted upon"""
        from django.utils import timezone
        self.is_acted_upon = True
        self.acted_upon_at = timezone.now()
        self.save()


class CategoryAnalytics(models.Model):
    """
    Analytics for transaction categories
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='category_analytics'
    )
    
    category = models.ForeignKey(
        'transactions.Category',
        on_delete=models.CASCADE,
        related_name='analytics'
    )
    
    # Analysis period
    analysis_month = models.DateField(
        help_text="Month being analyzed (YYYY-MM-01)"
    )
    
    # Spending metrics
    total_spent = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total amount spent in this category"
    )
    
    transaction_count = models.IntegerField(
        default=0,
        help_text="Number of transactions in this category"
    )
    
    average_transaction_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Average transaction amount"
    )
    
    # Comparisons
    previous_month_spent = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Amount spent in previous month"
    )
    
    percentage_change = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Percentage change from previous month"
    )
    
    # Budget comparison
    budgeted_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Budgeted amount for this category"
    )
    
    budget_variance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Variance from budget (positive = over budget)"
    )
    
    # Frequency analysis
    most_frequent_merchant = models.CharField(
        max_length=255,
        blank=True,
        help_text="Most frequent merchant in this category"
    )
    
    merchant_frequency_count = models.IntegerField(
        default=0,
        help_text="Number of transactions with most frequent merchant"
    )
    
    # Timing analysis
    peak_spending_day = models.CharField(
        max_length=20,
        blank=True,
        help_text="Day of week with highest spending"
    )
    
    peak_spending_time = models.TimeField(
        null=True,
        blank=True,
        help_text="Time of day with highest spending"
    )
    
    # Trend data
    trend_data = models.JSONField(
        default=dict,
        help_text="Detailed trend analysis data"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'category_analytics'
        verbose_name = 'Category Analytics'
        verbose_name_plural = 'Category Analytics'
        ordering = ['-analysis_month']
        unique_together = ['user', 'category', 'analysis_month']
    
    def __str__(self):
        return f"{self.category.name} - {self.analysis_month.strftime('%Y-%m')}"


class FinancialReport(models.Model):
    """
    Generated financial reports
    """
    REPORT_TYPES = [
        ('monthly_summary', 'Monthly Summary'),
        ('spending_analysis', 'Spending Analysis'),
        ('budget_performance', 'Budget Performance'),
        ('goal_progress', 'Goal Progress'),
        ('net_worth_statement', 'Net Worth Statement'),
        ('cash_flow', 'Cash Flow Report'),
        ('investment_summary', 'Investment Summary'),
        ('tax_summary', 'Tax Summary'),
        ('custom', 'Custom Report'),
    ]
    
    FORMATS = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
    ]
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='financial_reports'
    )
    
    report_type = models.CharField(
        max_length=30,
        choices=REPORT_TYPES,
        help_text="Type of financial report"
    )
    
    title = models.CharField(
        max_length=255,
        help_text="Report title"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Report description"
    )
    
    # Report period
    period_start = models.DateField(
        help_text="Report period start date"
    )
    
    period_end = models.DateField(
        help_text="Report period end date"
    )
    
    # Report configuration
    report_config = models.JSONField(
        default=dict,
        help_text="Report configuration parameters"
    )
    
    # Generated data
    report_data = models.JSONField(
        default=dict,
        help_text="Generated report data"
    )
    
    # File storage
    report_format = models.CharField(
        max_length=10,
        choices=FORMATS,
        default='pdf'
    )
    
    report_file = models.FileField(
        upload_to='financial_reports/',
        null=True,
        blank=True,
        help_text="Generated report file"
    )
    
    # Status
    is_generated = models.BooleanField(
        default=False,
        help_text="Whether the report has been generated"
    )
    
    generation_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('generating', 'Generating'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    
    error_message = models.TextField(
        blank=True,
        help_text="Error message if generation failed"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    generated_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'financial_reports'
        verbose_name = 'Financial Report'
        verbose_name_plural = 'Financial Reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    def mark_as_generated(self):
        """Mark report as successfully generated"""
        from django.utils import timezone
        self.is_generated = True
        self.generation_status = 'completed'
        self.generated_at = timezone.now()
        self.save()
    
    def mark_as_failed(self, error_message):
        """Mark report generation as failed"""
        self.generation_status = 'failed'
        self.error_message = error_message
        self.save()
