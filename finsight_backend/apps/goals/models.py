from django.db import models
from django.utils import timezone
from django.conf import settings
import uuid
from decimal import Decimal


class GoalCategory(models.Model):
    """
    Categories for financial goals (e.g., Savings, Retirement, Education)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='goal_categories'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, blank=True)
    is_system_template = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Goal Category"
        verbose_name_plural = "Goal Categories"


class Goal(models.Model):
    """
    Financial goals set by users
    """
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='goals_extended'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    goal_type = models.CharField(max_length=100, default='savings')
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Auto-contribution settings
    auto_contribute = models.BooleanField(default=False)
    contribution_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    contribution_frequency = models.CharField(max_length=20, default='monthly')
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"
    
    def add_contribution(self, amount, description=''):
        """
        Add a contribution to this goal and update the current amount
        """
        contribution = GoalContribution.objects.create(
            goal=self,
            amount=amount,
            description=description
        )
        
        self.current_amount += Decimal(amount)
        self.save()
        
        # Check if any milestones are achieved
        milestones = GoalMilestone.objects.filter(goal=self, is_achieved=False)
        for milestone in milestones:
            milestone.check_achievement()
        
        # Check if goal is now complete
        if self.current_amount >= self.target_amount and self.status != 'completed':
            self.mark_completed()
        
        return contribution
    
    def mark_completed(self):
        """
        Mark this goal as completed
        """
        self.status = 'completed'
        self.is_active = False
        self.save()
        
        # Mark all milestones as achieved
        milestones = GoalMilestone.objects.filter(goal=self, is_achieved=False)
        for milestone in milestones:
            milestone.is_achieved = True
            milestone.achieved_at = timezone.now()
            milestone.save()
    
    def get_progress_percentage(self):
        """
        Calculate the progress percentage of this goal
        """
        if self.target_amount > 0:
            return (self.current_amount / self.target_amount) * 100
        return 0


class GoalContribution(models.Model):
    """
    Contributions made towards a goal
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.goal.name} - {self.amount}"


class GoalMilestone(models.Model):
    """
    Milestones for tracking progress towards a goal
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    is_achieved = models.BooleanField(default=False)
    achieved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.goal.name} - {self.name} ({self.target_percentage}%)"
    
    @property
    def target_amount(self):
        """
        Calculate the target amount for this milestone
        """
        return self.goal.target_amount * (self.target_percentage / 100)
    
    def check_achievement(self):
        """
        Check if this milestone has been achieved and update if necessary
        """
        if not self.is_achieved and self.goal.current_amount >= self.target_amount:
            self.is_achieved = True
            self.achieved_at = timezone.now()
            self.save()
            return True
        return False


class GoalTemplate(models.Model):
    """
    Templates for common financial goals
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='goal_templates'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    goal_type = models.CharField(max_length=100, default='savings')
    default_target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=1000)
    suggested_duration_days = models.IntegerField(default=365)
    icon = models.CharField(max_length=50, blank=True)
    is_system_template = models.BooleanField(default=False)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
