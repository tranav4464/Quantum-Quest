from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class AIConversation(models.Model):
    """
    Represents an AI chat conversation with a user.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_conversations')
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-updated_at']
        db_table = 'ai_conversations'
    
    def __str__(self):
        return f"Conversation {self.id} - {self.user.username}"
    
    def get_message_count(self):
        return self.messages.count()
    
    def get_last_message(self):
        return self.messages.order_by('-created_at').first()


class AIMessage(models.Model):
    """
    Individual message in an AI conversation.
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'AI Assistant'),
        ('system', 'System'),
    ]
    
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text Message'),
        ('suggestion', 'Suggestion'),
        ('insight', 'Financial Insight'),
        ('alert', 'Alert'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='text')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
        db_table = 'ai_messages'
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class AIInsight(models.Model):
    """
    AI-generated financial insights for users.
    """
    INSIGHT_TYPE_CHOICES = [
        ('spending_pattern', 'Spending Pattern'),
        ('budget_alert', 'Budget Alert'),
        ('goal_progress', 'Goal Progress'),
        ('saving_opportunity', 'Saving Opportunity'),
        ('investment_tip', 'Investment Tip'),
        ('general_advice', 'General Advice'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_insights')
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    is_actionable = models.BooleanField(default=True)
    action_taken = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'ai_insights'
    
    def __str__(self):
        return f"{self.insight_type}: {self.title}"
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class AIUserProfile(models.Model):
    """
    AI-specific user preferences and learning data.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_profile')
    preferred_communication_style = models.CharField(
        max_length=20,
        choices=[
            ('formal', 'Formal'),
            ('casual', 'Casual'),
            ('encouraging', 'Encouraging'),
            ('direct', 'Direct'),
        ],
        default='casual'
    )
    financial_experience_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='beginner'
    )
    interests = models.JSONField(default=list, blank=True)  # Financial topics of interest
    goals_focus = models.JSONField(default=list, blank=True)  # Primary financial goals
    notification_preferences = models.JSONField(default=dict, blank=True)
    ai_interaction_count = models.PositiveIntegerField(default=0)
    last_interaction = models.DateTimeField(null=True, blank=True)
    personalization_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_user_profiles'
    
    def __str__(self):
        return f"AI Profile for {self.user.username}"
    
    def increment_interaction_count(self):
        self.ai_interaction_count += 1
        self.last_interaction = timezone.now()
        self.save(update_fields=['ai_interaction_count', 'last_interaction'])


class ExpenseCategory(models.Model):
    """
    AI-learned expense categories and patterns.
    """
    name = models.CharField(max_length=100, unique=True)
    keywords = models.JSONField(default=list, blank=True)  # Keywords that trigger this category
    patterns = models.JSONField(default=list, blank=True)  # Regex patterns for categorization
    confidence_threshold = models.FloatField(default=0.7)
    is_active = models.BooleanField(default=True)
    usage_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        db_table = 'expense_categories'
    
    def __str__(self):
        return self.name
    
    def increment_usage(self):
        self.usage_count += 1
        self.save(update_fields=['usage_count'])


class AITrainingData(models.Model):
    """
    Store training data for improving AI responses.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_training_data')
    input_text = models.TextField()
    ai_response = models.TextField()
    user_feedback = models.CharField(
        max_length=20,
        choices=[
            ('helpful', 'Helpful'),
            ('not_helpful', 'Not Helpful'),
            ('partially_helpful', 'Partially Helpful'),
        ],
        null=True, blank=True
    )
    feedback_text = models.TextField(blank=True)
    context_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'ai_training_data'
    
    def __str__(self):
        return f"Training data: {self.input_text[:50]}"
