import json
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from apps.ai.services import GeminiAIService, FinancialContextBuilder
from apps.ai.models import AIConversation, AIMessage
import uuid

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time AI chat functionality.
    Handles user questions about finances and provides AI-powered responses.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ai_service = GeminiAIService()
        self.room_group_name = None
        self.conversation = None
        self.user = None
    
    async def connect(self):
        """
        Handle WebSocket connection.
        """
        try:
            # Get user from token or session
            self.user = self.scope.get('user')
            
            if not self.user or not self.user.is_authenticated:
                await self.close()
                return
            
            # Create room group name
            self.room_group_name = f'chat_{self.user.id}'
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # Accept the WebSocket connection
            await self.accept()
            
            # Create or get active conversation
            self.conversation = await self.get_or_create_conversation()
            
            # Send welcome message
            await self.send_ai_message(
                "Hello! I'm your AI financial assistant. How can I help you with your finances today?"
            )
            
            logger.info(f"Chat connection established for user {self.user.username}")
            
        except Exception as e:
            logger.error(f"Error in chat connection: {e}")
            await self.close()
    
    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        """
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        
        logger.info(f"Chat disconnected for user {self.user.username if self.user else 'Unknown'}")
    
    async def receive(self, text_data):
        """
        Handle incoming messages from WebSocket.
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')
            
            if message_type == 'message':
                await self.handle_user_message(data)
            elif message_type == 'feedback':
                await self.handle_feedback(data)
            elif message_type == 'new_conversation':
                await self.handle_new_conversation()
            else:
                logger.warning(f"Unknown message type: {message_type}")
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await self.send_error("Invalid message format")
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            await self.send_error("Error processing your message")
    
    async def handle_user_message(self, data):
        """
        Process user message and generate AI response.
        """
        try:
            user_message = data.get('message', '').strip()
            
            if not user_message:
                await self.send_error("Empty message received")
                return
            
            # Save user message
            await self.save_message(
                role='user',
                content=user_message,
                message_type='text'
            )
            
            # Echo user message back to confirm receipt
            await self.send(text_data=json.dumps({
                'type': 'user_message',
                'message': user_message,
                'timestamp': self.get_timestamp(),
                'message_id': str(uuid.uuid4())
            }))
            
            # Show typing indicator
            await self.send_typing_indicator(True)
            
            # Build financial context
            financial_context = await self.build_financial_context()
            
            # Generate AI response
            ai_response = await self.generate_ai_response(user_message, financial_context)
            
            # Hide typing indicator
            await self.send_typing_indicator(False)
            
            # Save AI message
            await self.save_message(
                role='assistant',
                content=ai_response,
                message_type='text'
            )
            
            # Send AI response
            await self.send_ai_message(ai_response)
            
        except Exception as e:
            logger.error(f"Error handling user message: {e}")
            await self.send_typing_indicator(False)
            await self.send_error("Sorry, I couldn't process your message right now.")
    
    async def generate_ai_response(self, user_message: str, financial_context: str) -> str:
        """
        Generate AI response using Gemini service.
        """
        try:
            # Run AI service in thread pool to avoid blocking
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                self.ai_service.generate_financial_response,
                user_message,
                financial_context
            )
            return response
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return "I'm having trouble processing your request right now. Please try again in a moment."
    
    async def send_ai_message(self, message: str):
        """
        Send AI message to WebSocket client.
        """
        await self.send(text_data=json.dumps({
            'type': 'ai_message',
            'message': message,
            'timestamp': self.get_timestamp(),
            'message_id': str(uuid.uuid4())
        }))
    
    async def send_error(self, error_message: str):
        """
        Send error message to client.
        """
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message,
            'timestamp': self.get_timestamp()
        }))
    
    async def send_typing_indicator(self, is_typing: bool):
        """
        Send typing indicator status.
        """
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'is_typing': is_typing,
            'timestamp': self.get_timestamp()
        }))
    
    @database_sync_to_async
    def get_or_create_conversation(self):
        """
        Get or create active conversation for user.
        """
        try:
            # Get the most recent active conversation
            conversation = AIConversation.objects.filter(
                user=self.user,
                is_active=True
            ).first()
            
            if not conversation:
                conversation = AIConversation.objects.create(
                    user=self.user,
                    title="New Chat Session"
                )
            
            return conversation
        except Exception as e:
            logger.error(f"Error getting/creating conversation: {e}")
            raise
    
    @database_sync_to_async
    def save_message(self, role: str, content: str, message_type: str = 'text'):
        """
        Save message to database.
        """
        try:
            return AIMessage.objects.create(
                conversation=self.conversation,
                role=role,
                content=content,
                message_type=message_type
            )
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            raise
    
    @database_sync_to_async
    def build_financial_context(self) -> str:
        """
        Build financial context for AI responses.
        """
        try:
            return FinancialContextBuilder.build_user_context(self.user)
        except Exception as e:
            logger.error(f"Error building financial context: {e}")
            return "Financial data is currently unavailable."
    
    async def handle_feedback(self, data):
        """
        Handle user feedback on AI responses.
        """
        try:
            message_id = data.get('message_id')
            feedback = data.get('feedback')  # 'helpful', 'not_helpful', 'partially_helpful'
            feedback_text = data.get('feedback_text', '')
            
            # Save feedback to training data
            await self.save_feedback(message_id, feedback, feedback_text)
            
            # Send confirmation
            await self.send(text_data=json.dumps({
                'type': 'feedback_received',
                'message': 'Thank you for your feedback!',
                'timestamp': self.get_timestamp()
            }))
            
        except Exception as e:
            logger.error(f"Error handling feedback: {e}")
    
    @database_sync_to_async
    def save_feedback(self, message_id: str, feedback: str, feedback_text: str):
        """
        Save user feedback to training data.
        """
        try:
            from apps.ai.models import AITrainingData
            
            # Find the message
            message = AIMessage.objects.filter(id=message_id).first()
            if not message:
                return
            
            # Create training data entry
            AITrainingData.objects.create(
                user=self.user,
                input_text=message.content if message.role == 'user' else '',
                ai_response=message.content if message.role == 'assistant' else '',
                user_feedback=feedback,
                feedback_text=feedback_text
            )
            
        except Exception as e:
            logger.error(f"Error saving feedback: {e}")
    
    async def handle_new_conversation(self):
        """
        Start a new conversation.
        """
        try:
            # Mark current conversation as inactive
            if self.conversation:
                await self.mark_conversation_inactive()
            
            # Create new conversation
            self.conversation = await self.get_or_create_conversation()
            
            # Send confirmation
            await self.send(text_data=json.dumps({
                'type': 'new_conversation',
                'conversation_id': str(self.conversation.id),
                'message': 'Started new conversation',
                'timestamp': self.get_timestamp()
            }))
            
        except Exception as e:
            logger.error(f"Error starting new conversation: {e}")
    
    @database_sync_to_async
    def mark_conversation_inactive(self):
        """
        Mark current conversation as inactive.
        """
        try:
            if self.conversation:
                self.conversation.is_active = False
                self.conversation.save()
        except Exception as e:
            logger.error(f"Error marking conversation inactive: {e}")
    
    def get_timestamp(self):
        """
        Get current timestamp for messages.
        """
        from django.utils import timezone
        return timezone.now().isoformat()


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for AI-generated notifications and insights.
    """
    
    async def connect(self):
        """
        Handle WebSocket connection for notifications.
        """
        self.user = self.scope.get('user')
        
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = f'notifications_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        logger.info(f"Notification connection established for user {self.user.username}")
    
    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        """
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def send_notification(self, event):
        """
        Send notification to client.
        """
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['data']
        }))
