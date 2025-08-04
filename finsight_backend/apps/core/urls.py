# Core URLs Configuration
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'accounts', views.AccountViewSet, basename='account')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'budgets', views.BudgetViewSet, basename='budget')
router.register(r'goals', views.GoalViewSet, basename='goal')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/demo-token/', views.get_demo_token, name='demo_token'),
    path('auth/me/', views.user_profile, name='user_profile'),
    
    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # API routes
    path('', include(router.urls)),
]
