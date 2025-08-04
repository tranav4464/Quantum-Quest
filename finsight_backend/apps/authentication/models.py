import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Extended User model with additional fields for financial profile
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Unique identifier for the user"
    )
    
    # Personal Information
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        help_text="User's date of birth"
    )
    
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        help_text="User's phone number"
    )
    
    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        help_text="User's profile picture"
    )
    
    # Onboarding and Financial Profile
    onboarding_completed = models.BooleanField(
        default=False,
        help_text="Whether the user has completed the onboarding process"
    )
    
    financial_profile = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON field containing financial preferences and profile data"
    )
    
    # Financial Health Score
    financial_health_score = models.IntegerField(
        default=0,
        help_text="Calculated financial health score (0-100)"
    )
    
    # Preferences
    currency = models.CharField(
        max_length=3,
        default='USD',
        help_text="User's preferred currency"
    )
    
    timezone = models.CharField(
        max_length=50,
        default='UTC',
        help_text="User's timezone"
    )
    
    # Privacy Settings
    data_sharing_consent = models.BooleanField(
        default=False,
        help_text="User consent for data sharing for analytics"
    )
    
    marketing_emails = models.BooleanField(
        default=True,
        help_text="User preference for marketing emails"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the user account was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the user account was last updated"
    )
    
    # Verification
    email_verified = models.BooleanField(
        default=False,
        help_text="Whether the user's email has been verified"
    )
    
    phone_verified = models.BooleanField(
        default=False,
        help_text="Whether the user's phone has been verified"
    )

    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        """Return the user's full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_initials(self):
        """Get user initials for display"""
        if self.first_name and self.last_name:
            return f"{self.first_name[0]}{self.last_name[0]}".upper()
        elif self.first_name:
            return self.first_name[0].upper()
        else:
            return self.username[0].upper() if self.username else "U"
    
    def update_financial_health_score(self):
        """Calculate and update the user's financial health score"""
        # This would contain complex logic to calculate the score
        # For now, we'll implement a basic placeholder
        score = 50  # Base score
        
        # Add points for completed profile
        if self.onboarding_completed:
            score += 10
        
        # Add points for verified contact info
        if self.email_verified:
            score += 5
        if self.phone_verified:
            score += 5
        
        # Additional scoring logic would go here based on:
        # - Transaction history
        # - Budget adherence
        # - Goal progress
        # - Debt-to-income ratio
        # - Emergency fund status
        
        self.financial_health_score = min(score, 100)
        self.save(update_fields=['financial_health_score'])
        
        return self.financial_health_score


class UserProfile(models.Model):
    """
    Extended profile information for users
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    # Employment Information
    employment_status = models.CharField(
        max_length=20,
        choices=[
            ('employed', 'Employed'),
            ('self_employed', 'Self Employed'),
            ('unemployed', 'Unemployed'),
            ('student', 'Student'),
            ('retired', 'Retired'),
        ],
        blank=True
    )
    
    annual_income = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Annual income in user's preferred currency"
    )
    
    # Financial Goals
    primary_financial_goal = models.CharField(
        max_length=50,
        choices=[
            ('emergency_fund', 'Build Emergency Fund'),
            ('debt_payoff', 'Pay Off Debt'),
            ('save_for_home', 'Save for Home'),
            ('retirement', 'Retirement Planning'),
            ('investment', 'Investment Growth'),
            ('education', 'Education Fund'),
        ],
        blank=True
    )
    
    risk_tolerance = models.CharField(
        max_length=20,
        choices=[
            ('conservative', 'Conservative'),
            ('moderate', 'Moderate'),
            ('aggressive', 'Aggressive'),
        ],
        default='moderate'
    )
    
    # Financial Experience
    investment_experience = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
        default='beginner'
    )
    
    # Notification Preferences
    budget_alerts = models.BooleanField(
        default=True,
        help_text="Receive alerts when approaching budget limits"
    )
    
    goal_reminders = models.BooleanField(
        default=True,
        help_text="Receive reminders about financial goals"
    )
    
    weekly_reports = models.BooleanField(
        default=True,
        help_text="Receive weekly financial reports"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
