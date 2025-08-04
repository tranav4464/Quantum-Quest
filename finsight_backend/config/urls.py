"""
finsight_backend URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_health(request):
    return JsonResponse({
        'status': 'healthy',
        'version': '1.0.0',
        'message': 'FinSight Backend API is running'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health, name='api_health'),
    
    # Core API endpoints - ACTIVE
    path('api/', include('apps.core.urls')),
    
    # Learning Management System - ACTIVE
    path('api/learning/', include('apps.learning.urls')),
    
    # AI Services - Active
    path('api/ai/', include('apps.ai.urls_simple')),
    
    # Additional API endpoints
    path('api/auth/', include('apps.authentication.urls')),
    # path('api/v1/transactions/', include('apps.transactions.urls')),
    # path('api/v1/budgets/', include('apps.budgets.urls')),
    path('api/v1/goals/', include('apps.goals.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
