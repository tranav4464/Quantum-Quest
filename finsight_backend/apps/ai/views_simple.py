from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging
from apps.ai.services_simple import GeminiAIService

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def chat_message(request):
    """Handle chat messages with AI."""
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Generate AI response
        ai_service = GeminiAIService()
        ai_response = ai_service.generate_financial_response(
            user_message, 
            "User is asking about personal finance through FinSight app."
        )
        
        return JsonResponse({
            'user_message': user_message,
            'ai_response': ai_response,
            'timestamp': '2025-01-02T12:00:00Z'
        })
        
    except Exception as e:
        logger.error(f"Error in chat_message: {e}")
        return JsonResponse({'error': 'Failed to process message'}, status=500)

@csrf_exempt  
@require_http_methods(["POST"])
def categorize_expense(request):
    """AI-powered expense categorization."""
    try:
        data = json.loads(request.body)
        description = data.get('description', '').strip()
        
        if not description:
            return JsonResponse({'error': 'Description is required'}, status=400)
        
        ai_service = GeminiAIService()
        category = ai_service.categorize_expense(description)
        
        return JsonResponse({
            'description': description,
            'category': category,
            'confidence': 0.8
        })
        
    except Exception as e:
        logger.error(f"Error in categorize_expense: {e}")
        return JsonResponse({'error': 'Failed to categorize expense'}, status=500)

@require_http_methods(["GET"])
def test_ai_connection(request):
    """Test endpoint to verify AI service is working."""
    try:
        ai_service = GeminiAIService()
        
        # Test basic response
        test_response = ai_service.generate_response("Hello, how can you help me with my finances?")
        
        # Test categorization
        test_category = ai_service.categorize_expense("Coffee at Starbucks")
        
        return JsonResponse({
            'status': 'success',
            'ai_response': test_response[:100] + "..." if len(test_response) > 100 else test_response,
            'categorization_test': {
                'description': 'Coffee at Starbucks',
                'category': test_category
            },
            'message': 'AI service is working correctly!'
        })
        
    except Exception as e:
        logger.error(f"Error in test_ai_connection: {e}")
        return JsonResponse({'error': str(e)}, status=500)
