from django.urls import path
from . import views_simple

app_name = 'ai'

urlpatterns = [
    path('chat/', views_simple.chat_message, name='chat_message'),
    path('categorize/', views_simple.categorize_expense, name='categorize_expense'),
    path('test/', views_simple.test_ai_connection, name='test_ai_connection'),
]
