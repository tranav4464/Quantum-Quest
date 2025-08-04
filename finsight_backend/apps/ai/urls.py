from django.urls import path
from . import views

app_name = 'ai'

urlpatterns = [
    # Chat endpoints
    path('chat/message/', views.chat_message, name='chat_message'),
    path('chat/history/', views.conversation_history, name='conversation_history'),
    
    # AI services
    path('categorize/', views.categorize_expense, name='categorize_expense'),
    path('insights/', views.financial_insights, name='financial_insights'),
    path('quick-question/', views.quick_question, name='quick_question'),
    
    # Feedback and training
    path('feedback/', views.feedback, name='feedback'),
    
    # Testing
    path('test/', views.test_ai_connection, name='test_ai_connection'),
]
