from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .demo_views import DemoAuthToken, get_demo_token, user_profile

router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Demo/Testing Authentication endpoints
    path('demo-token/', get_demo_token, name='demo_token'),
    path('demo-login/', DemoAuthToken.as_view(), name='demo_login'),
    path('me/', user_profile, name='user_profile'),
    
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Profile endpoints
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/', views.UpdateProfileView.as_view(), name='update_profile'),
    path('profile/delete/', views.DeleteAccountView.as_view(), name='delete_account'),
]
