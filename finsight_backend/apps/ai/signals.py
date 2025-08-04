"""
AI app signals for FinSight Backend
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AIConversation, AIMessage

@receiver(post_save, sender=AIMessage)
def ai_message_created(sender, instance, created, **kwargs):
    """
    Signal handler for when a new AI message is created
    """
    if created:
        # Update conversation's last_activity timestamp
        conversation = instance.conversation
        conversation.save()  # This will update the updated_at timestamp
        
        # You can add additional logic here like:
        # - Sending notifications
        # - Triggering analytics
        # - Caching responses
        pass
