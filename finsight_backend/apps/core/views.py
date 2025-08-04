# Core API Views - Complete Implementation
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import login, logout
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta, date
from decimal import Decimal
import json

from .models import User, Account, Category, Transaction, Budget, Goal, FinancialHealthScore, AIInsight, SyncOperation
from .serializers import *

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Create default categories
        create_default_categories(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Update last login IP
        user.last_login_ip = request.META.get('REMOTE_ADDR')
        user.save()
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'})
    except:
        return Response({'message': 'Logout completed'})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_demo_token(request):
    """Get a demo token for testing without credentials"""
    try:
        # Get or create admin user
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if created:
            user.set_password('admin123')
            user.save()
            # Create default categories for new user
            create_default_categories(user)
        
        # Get or create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """Get current user profile (requires authentication)"""
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    })

# Core ViewSets
class UserViewSet(viewsets.ModelViewSet):
    """User management viewset"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountViewSet(viewsets.ModelViewSet):
    """Account management viewset"""
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    """Transaction management viewset"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-transaction_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    """Category management viewset"""
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).order_by('category_type', 'name')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    """Budget management viewset"""
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalViewSet(viewsets.ModelViewSet):
    """Goal management viewset"""
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user).order_by('target_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Analytics Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    """Enhanced dashboard data with comprehensive financial overview"""
    user = request.user
    
    # Basic financial data
    accounts = Account.objects.filter(user=user, is_active=True)
    total_balance = accounts.aggregate(total=Sum('balance'))['total'] or Decimal('0.00')
    
    # Monthly income and expenses
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    monthly_income = Transaction.objects.filter(
        user=user,
        category__category_type='income',
        transaction_date__month=current_month,
        transaction_date__year=current_year
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    
    monthly_expenses = Transaction.objects.filter(
        user=user,
        category__category_type='expense',
        transaction_date__month=current_month,
        transaction_date__year=current_year
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    
    # Calculate savings rate
    savings_rate = 0.0
    if monthly_income > 0:
        savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
    
    # Recent transactions (last 10)
    recent_transactions = Transaction.objects.filter(
        user=user
    ).select_related('account', 'category').order_by('-transaction_date')[:10]
    
    # Active budgets with progress
    active_budgets = Budget.objects.filter(
        user=user,
        is_active=True,
        end_date__gte=timezone.now().date()
    ).select_related('category')
    
    # Active goals with progress
    active_goals = Goal.objects.filter(
        user=user,
        is_active=True
    ).order_by('target_date')
    
    # Financial health score (simplified calculation)
    financial_health_score = calculate_financial_health_score(user)
    
    # Pending AI insights
    pending_insights = AIInsight.objects.filter(
        user=user,
        is_read=False,
        is_dismissed=False
    ).order_by('-created_at')[:5]
    
    # Spending analysis by category
    category_spending = {}
    for category in Category.objects.filter(user=user, category_type='expense'):
        spent = Transaction.objects.filter(
            user=user,
            category=category,
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        category_spending[category.name] = float(spent)
    
    return Response({
        'total_balance': total_balance,
        'account_count': accounts.count(),
        'monthly_income': monthly_income,
        'monthly_expenses': monthly_expenses,
        'savings_rate': savings_rate,
        'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
        'active_budgets': BudgetSerializer(active_budgets, many=True).data,
        'active_goals': GoalSerializer(active_goals, many=True).data,
        'financial_health_score': financial_health_score,
        'pending_insights': AIInsightSerializer(pending_insights, many=True).data,
        'category_spending': category_spending,
        'user_currency': user.currency,
        'user_timezone': user.timezone,
    })

# Utility functions
def calculate_financial_health_score(user):
    """Calculate financial health score (0-100)"""
    score = 50  # Base score
    
    try:
        # Get current month data
        current_month = timezone.now().month
        current_year = timezone.now().year
        
        # Calculate monthly income and expenses
        monthly_income = Transaction.objects.filter(
            user=user,
            category__category_type='income',
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        monthly_expenses = Transaction.objects.filter(
            user=user,
            category__category_type='expense',
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # Savings rate bonus (up to +20 points)
        if monthly_income > 0:
            savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
            if savings_rate >= 20:
                score += 20
            elif savings_rate >= 10:
                score += 15
            elif savings_rate >= 5:
                score += 10
            elif savings_rate >= 0:
                score += 5
        
        # Account diversity bonus (up to +15 points)
        account_count = Account.objects.filter(user=user, is_active=True).count()
        if account_count >= 3:
            score += 15
        elif account_count >= 2:
            score += 10
        elif account_count >= 1:
            score += 5
        
        # Budget adherence bonus (up to +15 points)
        active_budgets = Budget.objects.filter(
            user=user,
            is_active=True,
            end_date__gte=timezone.now().date()
        ).count()
        if active_budgets >= 3:
            score += 15
        elif active_budgets >= 1:
            score += 10
        
        # Goal progress bonus (up to +10 points)
        active_goals = Goal.objects.filter(user=user, is_active=True).count()
        if active_goals >= 2:
            score += 10
        elif active_goals >= 1:
            score += 5
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
    except Exception as e:
        print(f"Error calculating financial health score: {e}")
        score = 50  # Default score on error
    
    return score

def create_default_categories(user):
    """Create default categories for new user"""
    default_categories = [
        ('Food & Dining', 'expense', '#EF4444', '🍽️'),
        ('Transportation', 'expense', '#F97316', '🚗'),
        ('Shopping', 'expense', '#8B5CF6', '🛍️'),
        ('Bills & Utilities', 'expense', '#06B6D4', '⚡'),
        ('Salary', 'income', '#10B981', '💰'),
        ('Transfer', 'transfer', '#6B7280', '↔️'),
    ]
    
    for name, category_type, color, icon in default_categories:
        Category.objects.get_or_create(
            user=user,
            name=name,
            category_type=category_type,
            defaults={
                'color': color,
                'icon': icon,
                'is_system': True
            }
        )
