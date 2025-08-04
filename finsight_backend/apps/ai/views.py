from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging
from apps.ai.services import GeminiAIService, FinancialContextBuilder
from apps.ai.models import AIConversation, AIMessage, AIInsight
from apps.transactions.models import Transaction
import uuid

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_message(request):
    """
    Handle individual chat messages with AI.
    """
    try:
        data = request.data
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return Response(
                {'error': 'Message is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create conversation
        conversation_id = data.get('conversation_id')
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(
                    id=conversation_id,
                    user=request.user
                )
            except AIConversation.DoesNotExist:
                conversation = AIConversation.objects.create(
                    user=request.user,
                    title="New Chat Session"
                )
        else:
            conversation = AIConversation.objects.create(
                user=request.user,
                title="New Chat Session"
            )
        
        # Save user message
        user_msg = AIMessage.objects.create(
            conversation=conversation,
            role='user',
            content=user_message,
            message_type='text'
        )
        
        # Build financial context
        financial_context = FinancialContextBuilder.build_user_context(request.user)
        
        # Generate AI response
        ai_service = GeminiAIService()
        ai_response = ai_service.generate_financial_response(user_message, financial_context)
        
        # Save AI message
        ai_msg = AIMessage.objects.create(
            conversation=conversation,
            role='assistant',
            content=ai_response,
            message_type='text'
        )
        
        return Response({
            'conversation_id': str(conversation.id),
            'user_message': {
                'id': str(user_msg.id),
                'content': user_message,
                'timestamp': user_msg.created_at.isoformat()
            },
            'ai_response': {
                'id': str(ai_msg.id),
                'content': ai_response,
                'timestamp': ai_msg.created_at.isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error in chat_message: {e}")
        return Response(
            {'error': 'Failed to process message'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_history(request):
    """
    Get conversation history for the user.
    """
    try:
        conversations = AIConversation.objects.filter(
            user=request.user
        ).prefetch_related('messages')[:10]
        
        conversation_data = []
        for conv in conversations:
            messages = []
            for msg in conv.messages.all():
                messages.append({
                    'id': str(msg.id),
                    'role': msg.role,
                    'content': msg.content,
                    'message_type': msg.message_type,
                    'timestamp': msg.created_at.isoformat()
                })
            
            conversation_data.append({
                'id': str(conv.id),
                'title': conv.title,
                'created_at': conv.created_at.isoformat(),
                'updated_at': conv.updated_at.isoformat(),
                'message_count': len(messages),
                'messages': messages
            })
        
        return Response({'conversations': conversation_data})
        
    except Exception as e:
        logger.error(f"Error in conversation_history: {e}")
        return Response(
            {'error': 'Failed to fetch conversation history'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def categorize_expense(request):
    """
    AI-powered expense categorization.
    """
    try:
        data = request.data
        description = data.get('description', '').strip()
        
        if not description:
            return Response(
                {'error': 'Description is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use AI service to categorize
        ai_service = GeminiAIService()
        category = ai_service.categorize_expense(description)
        
        return Response({
            'description': description,
            'category': category,
            'confidence': 0.8  # Default confidence score
        })
        
    except Exception as e:
        logger.error(f"Error in categorize_expense: {e}")
        return Response(
            {'error': 'Failed to categorize expense'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_insights(request):
    """
    Get AI-generated financial insights for the user.
    """
    try:
        # Get user's financial data
        from apps.budgets.models import Budget
        from apps.goals.models import Goal
        from django.utils import timezone
        from django.db.models import Sum
        
        # Calculate current month spending
        current_month = timezone.now().replace(day=1)
        monthly_spending = Transaction.objects.filter(
            user=request.user,
            date__gte=current_month,
            transaction_type='expense'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Get budget data
        budgets = Budget.objects.filter(user=request.user, is_active=True)
        budget_data = []
        for budget in budgets:
            spent = budget.calculate_spent()
            budget_data.append({
                'category': budget.category,
                'allocated': float(budget.allocated_amount),
                'spent': float(spent),
                'remaining': float(budget.allocated_amount - spent)
            })
        
        # Get goal data
        goals = Goal.objects.filter(user=request.user, status='active')
        goal_data = []
        for goal in goals:
            progress = (goal.current_amount / goal.target_amount) * 100 if goal.target_amount > 0 else 0
            goal_data.append({
                'title': goal.title,
                'current': float(goal.current_amount),
                'target': float(goal.target_amount),
                'progress': round(progress, 1)
            })
        
        # Get recent transactions
        recent_transactions = Transaction.objects.filter(
            user=request.user
        ).order_by('-date')[:20]
        
        transaction_data = []
        for transaction in recent_transactions:
            transaction_data.append({
                'description': transaction.description,
                'amount': float(transaction.amount),
                'category': transaction.category,
                'date': transaction.date.isoformat()
            })
        
        # Build financial data for AI analysis
        financial_data = {
            'monthly_spending': float(monthly_spending),
            'budgets': budget_data,
            'goals': goal_data,
            'recent_transactions': transaction_data
        }
        
        # Generate insights using AI
        ai_service = GeminiAIService()
        insights = ai_service.generate_insights(financial_data)
        
        # Save insights to database
        saved_insights = []
        for insight in insights:
            ai_insight = AIInsight.objects.create(
                user=request.user,
                insight_type='general_advice',
                title=f"AI Insight #{len(saved_insights) + 1}",
                content=insight,
                priority='medium'
            )
            saved_insights.append({
                'id': str(ai_insight.id),
                'title': ai_insight.title,
                'content': insight,
                'type': ai_insight.insight_type,
                'priority': ai_insight.priority,
                'created_at': ai_insight.created_at.isoformat()
            })
        
        return Response({
            'insights': saved_insights,
            'financial_summary': {
                'monthly_spending': float(monthly_spending),
                'total_budgets': len(budget_data),
                'active_goals': len(goal_data),
                'recent_transactions_count': len(transaction_data)
            }
        })
        
    except Exception as e:
        logger.error(f"Error in financial_insights: {e}")
        return Response(
            {'error': 'Failed to generate insights'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quick_question(request):
    """
    Handle quick financial questions without conversation history.
    """
    try:
        data = request.data
        question = data.get('question', '').strip()
        
        if not question:
            return Response(
                {'error': 'Question is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build financial context
        financial_context = FinancialContextBuilder.build_user_context(request.user)
        
        # Generate AI response
        ai_service = GeminiAIService()
        response = ai_service.generate_financial_response(question, financial_context)
        
        return Response({
            'question': question,
            'answer': response,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in quick_question: {e}")
        return Response(
            {'error': 'Failed to process question'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback(request):
    """
    Submit feedback on AI responses.
    """
    try:
        data = request.data
        message_id = data.get('message_id')
        feedback_type = data.get('feedback')  # 'helpful', 'not_helpful', 'partially_helpful'
        feedback_text = data.get('feedback_text', '')
        
        if not message_id or not feedback_type:
            return Response(
                {'error': 'Message ID and feedback type are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find the message
        try:
            message = AIMessage.objects.get(id=message_id, conversation__user=request.user)
        except AIMessage.DoesNotExist:
            return Response(
                {'error': 'Message not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Save feedback
        from apps.ai.models import AITrainingData
        AITrainingData.objects.create(
            user=request.user,
            input_text=message.content if message.role == 'user' else '',
            ai_response=message.content if message.role == 'assistant' else '',
            user_feedback=feedback_type,
            feedback_text=feedback_text
        )
        
        return Response({
            'message': 'Feedback saved successfully',
            'message_id': message_id
        })
        
    except Exception as e:
        logger.error(f"Error in feedback: {e}")
        return Response(
            {'error': 'Failed to save feedback'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_ai_connection(request):
    """
    Test endpoint to verify AI service is working.
    """
    try:
        ai_service = GeminiAIService()
        
        # Test basic response
        test_response = ai_service.generate_response("Hello, how can you help me with my finances?")
        
        # Test categorization
        test_category = ai_service.categorize_expense("Coffee at Starbucks")
        
        return Response({
            'status': 'success',
            'ai_response': test_response[:100] + "..." if len(test_response) > 100 else test_response,
            'categorization_test': {
                'description': 'Coffee at Starbucks',
                'category': test_category
            },
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in test_ai_connection: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
