from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal

User = get_user_model()


class Category(models.Model):
    """
    Categories for organizing transactions
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Category description"
    )
    
    color = models.CharField(
        max_length=7,
        default='#6366F1',
        help_text="Hex color code for the category"
    )
    
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="Icon identifier for the category"
    )
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories',
        help_text="Parent category for creating hierarchy"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this category is active"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def full_name(self):
        """Return full category name including parent"""
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class Transaction(models.Model):
    """
    Financial transactions model
    """
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions',
        help_text="User who owns this transaction"
    )
    
    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES,
        help_text="Type of transaction"
    )
    
    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Transaction amount"
    )
    
    description = models.CharField(
        max_length=255,
        help_text="Transaction description"
    )
    
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
        help_text="Transaction category"
    )
    
    transaction_date = models.DateField(
        help_text="Date when the transaction occurred"
    )
    
    # Location and merchant information
    merchant = models.CharField(
        max_length=255,
        blank=True,
        help_text="Merchant or vendor name"
    )
    
    location = models.CharField(
        max_length=255,
        blank=True,
        help_text="Transaction location"
    )
    
    # Additional metadata
    notes = models.TextField(
        blank=True,
        help_text="Additional notes about the transaction"
    )
    
    receipt_image = models.ImageField(
        upload_to='receipts/',
        blank=True,
        null=True,
        help_text="Receipt image"
    )
    
    # Budget and goal tracking
    budget = models.ForeignKey(
        'budgets.Budget',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
        help_text="Associated budget"
    )
    
    goal = models.ForeignKey(
        'goals.Goal',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
        help_text="Associated goal"
    )
    
    # Transaction metadata
    is_recurring = models.BooleanField(
        default=False,
        help_text="Whether this is a recurring transaction"
    )
    
    recurring_frequency = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        blank=True,
        help_text="Frequency of recurring transaction"
    )
    
    is_verified = models.BooleanField(
        default=True,
        help_text="Whether the transaction has been verified"
    )
    
    # External integration
    external_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="External system ID (e.g., bank transaction ID)"
    )
    
    plaid_transaction_id = models.CharField(
        max_length=255,
        blank=True,
        unique=True,
        null=True,
        help_text="Plaid transaction ID for bank integrations"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the transaction was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the transaction was last updated"
    )
    
    class Meta:
        db_table = 'transactions'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-transaction_date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'transaction_date']),
            models.Index(fields=['user', 'transaction_type']),
            models.Index(fields=['user', 'category']),
        ]
    
    def __str__(self):
        return f"{self.transaction_type.title()}: {self.amount} - {self.description}"
    
    @property
    def signed_amount(self):
        """Return amount with appropriate sign based on transaction type"""
        if self.transaction_type == 'expense':
            return -self.amount
        return self.amount
    
    def save(self, *args, **kwargs):
        """Override save to perform validation and calculations"""
        # Ensure positive amount
        if self.amount < 0:
            self.amount = abs(self.amount)
        
        super().save(*args, **kwargs)


class TransactionAttachment(models.Model):
    """
    File attachments for transactions
    """
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    
    file = models.FileField(
        upload_to='transaction_attachments/',
        help_text="Attached file"
    )
    
    filename = models.CharField(
        max_length=255,
        help_text="Original filename"
    )
    
    file_type = models.CharField(
        max_length=50,
        help_text="File type/extension"
    )
    
    file_size = models.PositiveIntegerField(
        help_text="File size in bytes"
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transaction_attachments'
        verbose_name = 'Transaction Attachment'
        verbose_name_plural = 'Transaction Attachments'
    
    def __str__(self):
        return f"Attachment for {self.transaction}: {self.filename}"


class RecurringTransaction(models.Model):
    """
    Template for recurring transactions
    """
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recurring_transactions'
    )
    
    name = models.CharField(
        max_length=255,
        help_text="Name for this recurring transaction"
    )
    
    transaction_type = models.CharField(
        max_length=20,
        choices=Transaction.TRANSACTION_TYPES
    )
    
    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    description = models.CharField(max_length=255)
    
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES
    )
    
    start_date = models.DateField(
        help_text="When to start creating transactions"
    )
    
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="When to stop creating transactions (optional)"
    )
    
    next_due_date = models.DateField(
        help_text="Next date to create a transaction"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this recurring transaction is active"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recurring_transactions'
        verbose_name = 'Recurring Transaction'
        verbose_name_plural = 'Recurring Transactions'
        ordering = ['next_due_date']
    
    def __str__(self):
        return f"{self.name} ({self.frequency})"
    
    def create_next_transaction(self):
        """Create the next transaction from this template"""
        from datetime import timedelta
        from dateutil.relativedelta import relativedelta
        
        # Create the transaction
        transaction = Transaction.objects.create(
            user=self.user,
            transaction_type=self.transaction_type,
            amount=self.amount,
            description=f"{self.description} (Auto)",
            category=self.category,
            transaction_date=self.next_due_date,
            is_recurring=True,
            recurring_frequency=self.frequency
        )
        
        # Calculate next due date
        if self.frequency == 'daily':
            self.next_due_date += timedelta(days=1)
        elif self.frequency == 'weekly':
            self.next_due_date += timedelta(weeks=1)
        elif self.frequency == 'monthly':
            self.next_due_date += relativedelta(months=1)
        elif self.frequency == 'quarterly':
            self.next_due_date += relativedelta(months=3)
        elif self.frequency == 'yearly':
            self.next_due_date += relativedelta(years=1)
        
        # Check if we should deactivate
        if self.end_date and self.next_due_date > self.end_date:
            self.is_active = False
        
        self.save()
        return transaction
