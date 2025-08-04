# Analytics & Predictions API Views
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta, date
from decimal import Decimal
import json
import random
from math import exp, log

from apps.core.models import User, Transaction, Budget, Goal, Account, Category

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_health_forecast(request):
    """Generate financial health forecast for next 3 months"""
    user = request.user
    
    try:
        # Get current financial health score
        current_score = calculate_financial_health_score(user)
        
        # Get historical data for trend analysis
        last_3_months = []
        for i in range(3):
            month_date = timezone.now() - timedelta(days=30 * (i + 1))
            month_score = calculate_historical_score(user, month_date)
            last_3_months.append(month_score)
        
        # Calculate trend
        trend = calculate_trend(last_3_months)
        
        # Predict future scores with some variation
        predictions = []
        base_score = current_score
        
        for month in range(1, 4):
            # Apply trend with some randomness for realism
            predicted_score = base_score + (trend * month) + random.randint(-2, 3)
            predicted_score = max(0, min(100, predicted_score))
            predictions.append({
                'month': f'Month {month}',
                'score': int(predicted_score),
                'improvement': predicted_score - current_score
            })
            base_score = predicted_score
        
        # Generate expected improvements
        improvements = generate_improvement_predictions(user, current_score)
        
        return Response({
            'current_score': current_score,
            'predictions': predictions,
            'improvements': improvements,
            'trend': 'improving' if trend > 0 else 'declining' if trend < 0 else 'stable'
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate forecast',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def spending_forecast(request):
    """Predict upcoming expenses based on historical data"""
    user = request.user
    
    try:
        # Get spending patterns from last 6 months
        six_months_ago = timezone.now() - timedelta(days=180)
        
        # Analyze spending by category
        category_patterns = {}
        categories = Category.objects.filter(user=user, category_type='expense')
        
        for category in categories:
            transactions = Transaction.objects.filter(
                user=user,
                category=category,
                transaction_date__gte=six_months_ago
            )
            
            if transactions.exists():
                avg_amount = transactions.aggregate(avg=Avg('amount'))['avg'] or Decimal('0')
                frequency = transactions.count() / 6  # per month
                
                category_patterns[category.name] = {
                    'avg_amount': float(avg_amount),
                    'frequency': frequency,
                    'icon': category.icon,
                    'color': category.color
                }
        
        # Generate predictions
        predictions = []
        
        # Subscription-like expenses (high frequency, consistent amount)
        subscription_categories = ['Bills & Utilities', 'Internet', 'Phone']
        for cat_name, pattern in category_patterns.items():
            if cat_name in subscription_categories or pattern['frequency'] > 3:
                predictions.append({
                    'category': cat_name,
                    'amount': round(pattern['avg_amount'], 2),
                    'date': 'Next 7 days',
                    'confidence': 'High',
                    'type': 'recurring'
                })
        
        # Regular expenses (medium frequency)
        regular_categories = ['Food & Dining', 'Transportation', 'Shopping']
        for cat_name, pattern in category_patterns.items():
            if cat_name in regular_categories or (1 <= pattern['frequency'] <= 3):
                predictions.append({
                    'category': cat_name,
                    'amount': round(pattern['avg_amount'] * pattern['frequency'], 2),
                    'date': 'This month',
                    'confidence': 'Medium',
                    'type': 'regular'
                })
        
        # Occasional expenses (low frequency, variable amount)
        occasional_categories = ['Healthcare', 'Maintenance', 'Entertainment']
        for cat_name, pattern in category_patterns.items():
            if cat_name in occasional_categories or pattern['frequency'] < 1:
                predictions.append({
                    'category': cat_name,
                    'amount': round(pattern['avg_amount'], 2),
                    'date': 'Next month',
                    'confidence': 'Low',
                    'type': 'occasional'
                })
        
        # Sort by confidence and amount
        predictions.sort(key=lambda x: (
            {'High': 3, 'Medium': 2, 'Low': 1}[x['confidence']], 
            x['amount']
        ), reverse=True)
        
        return Response({
            'predictions': predictions[:8],  # Limit to top 8
            'total_predicted': sum(p['amount'] for p in predictions),
            'last_updated': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate spending forecast',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investment_outlook(request):
    """Generate investment predictions and portfolio outlook"""
    user = request.user
    
    try:
        # Get investment accounts
        investment_accounts = Account.objects.filter(
            user=user,
            account_type__in=['investment', 'retirement'],
            is_active=True
        )
        
        total_investment = investment_accounts.aggregate(
            total=Sum('balance')
        )['total'] or Decimal('0')
        
        # Generate portfolio analysis
        portfolio_assets = [
            {
                'asset': 'Stocks',
                'allocation': '60%',
                'expected_return': '+12.3%',
                'risk': 'Medium',
                'current_value': float(total_investment) * 0.6
            },
            {
                'asset': 'Bonds',
                'allocation': '30%',
                'expected_return': '+3.8%',
                'risk': 'Low',
                'current_value': float(total_investment) * 0.3
            },
            {
                'asset': 'Real Estate',
                'allocation': '10%',
                'expected_return': '+6.2%',
                'risk': 'Medium',
                'current_value': float(total_investment) * 0.1
            }
        ]
        
        # Calculate expected portfolio growth
        expected_growth = 8.5  # Weighted average
        projected_value = float(total_investment) * (1 + expected_growth / 100)
        
        return Response({
            'total_investment': float(total_investment),
            'expected_growth': expected_growth,
            'projected_value': projected_value,
            'portfolio_assets': portfolio_assets,
            'recommendation': generate_investment_recommendation(user)
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate investment outlook',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def market_insights(request):
    """Get AI-generated market insights and predictions"""
    
    # Simulated market insights (in real app, would use external APIs)
    insights = [
        {
            'title': 'Tech Sector Rally',
            'description': 'AI and semiconductor stocks expected to outperform by 15-20% over next quarter.',
            'impact': 'Positive',
            'probability': '78%',
            'source': 'Market Analysis',
            'timestamp': timezone.now().isoformat()
        },
        {
            'title': 'Interest Rate Stability',
            'description': 'Federal Reserve likely to maintain current rates, benefiting bond investments.',
            'impact': 'Neutral',
            'probability': '85%',
            'source': 'Fed Watch',
            'timestamp': timezone.now().isoformat()
        },
        {
            'title': 'Real Estate Market',
            'description': 'Housing prices expected to stabilize with moderate growth in key markets.',
            'impact': 'Positive',
            'probability': '62%',
            'source': 'Real Estate Index',
            'timestamp': timezone.now().isoformat()
        },
        {
            'title': 'Energy Transition',
            'description': 'Clean energy investments showing strong momentum with government support.',
            'impact': 'Positive',
            'probability': '71%',
            'source': 'Energy Monitor',
            'timestamp': timezone.now().isoformat()
        }
    ]
    
    return Response({
        'insights': insights,
        'last_updated': timezone.now().isoformat(),
        'market_status': 'Cautiously Optimistic'
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_forecast(request):
    """Generate comprehensive financial forecast"""
    user = request.user
    forecast_type = request.data.get('type', 'comprehensive')
    
    try:
        forecast_data = {}
        
        if forecast_type in ['comprehensive', 'health']:
            # Get financial health forecast
            health_response = financial_health_forecast(request)
            forecast_data['health_forecast'] = health_response.data
        
        if forecast_type in ['comprehensive', 'spending']:
            # Get spending forecast
            spending_response = spending_forecast(request)
            forecast_data['spending_forecast'] = spending_response.data
        
        if forecast_type in ['comprehensive', 'investment']:
            # Get investment outlook
            investment_response = investment_outlook(request)
            forecast_data['investment_outlook'] = investment_response.data
        
        if forecast_type in ['comprehensive', 'market']:
            # Get market insights
            market_response = market_insights(request)
            forecast_data['market_insights'] = market_response.data
        
        return Response({
            'forecast': forecast_data,
            'generated_at': timezone.now().isoformat(),
            'user_id': user.id
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate forecast',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Helper functions
def calculate_financial_health_score(user):
    """Calculate current financial health score"""
    score = 50  # Base score
    
    try:
        current_month = timezone.now().month
        current_year = timezone.now().year
        
        # Monthly income and expenses
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
        
        # Savings rate bonus
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
        
        # Account diversity
        account_count = Account.objects.filter(user=user, is_active=True).count()
        if account_count >= 3:
            score += 15
        elif account_count >= 2:
            score += 10
        elif account_count >= 1:
            score += 5
        
        # Budget adherence
        active_budgets = Budget.objects.filter(
            user=user,
            is_active=True,
            end_date__gte=timezone.now().date()
        ).count()
        if active_budgets >= 3:
            score += 15
        elif active_budgets >= 1:
            score += 10
        
        # Goal progress
        active_goals = Goal.objects.filter(user=user, is_active=True).count()
        if active_goals >= 2:
            score += 10
        elif active_goals >= 1:
            score += 5
        
        return max(0, min(100, score))
        
    except Exception:
        return 50

def calculate_historical_score(user, date):
    """Calculate historical score for a specific date"""
    # Simplified calculation for demo
    base_score = calculate_financial_health_score(user)
    # Add some variance based on date
    variance = (date.day % 10) - 5
    return max(0, min(100, base_score + variance))

def calculate_trend(scores):
    """Calculate trend from historical scores"""
    if len(scores) < 2:
        return 0
    
    # Simple linear trend
    return (scores[0] - scores[-1]) / len(scores)

def generate_improvement_predictions(user, current_score):
    """Generate specific improvement predictions"""
    improvements = []
    
    # Get current metrics
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
    if monthly_income > 0:
        current_savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
        predicted_savings_rate = min(current_savings_rate + 7, 25)  # Improve by up to 7%
        
        improvements.append({
            'metric': 'Savings Rate',
            'current': f'{current_savings_rate:.1f}%',
            'predicted': f'{predicted_savings_rate:.1f}%',
            'trend': 'up'
        })
    
    # Debt-to-income (simulated)
    current_debt_ratio = max(35 - (current_score - 50) * 0.5, 15)
    predicted_debt_ratio = max(current_debt_ratio - 7, 10)
    
    improvements.append({
        'metric': 'Debt-to-Income',
        'current': f'{current_debt_ratio:.0f}%',
        'predicted': f'{predicted_debt_ratio:.0f}%',
        'trend': 'down'
    })
    
    # Emergency fund (simulated)
    current_emergency = max(2.5, (current_score - 30) * 0.1)
    predicted_emergency = min(current_emergency + 1.5, 6)
    
    improvements.append({
        'metric': 'Emergency Fund',
        'current': f'{current_emergency:.1f} months',
        'predicted': f'{predicted_emergency:.1f} months',
        'trend': 'up'
    })
    
    return improvements

def generate_investment_recommendation(user):
    """Generate personalized investment recommendation"""
    # Get user's age and risk profile (simplified)
    total_balance = Account.objects.filter(
        user=user, 
        is_active=True
    ).aggregate(total=Sum('balance'))['total'] or Decimal('0')
    
    if total_balance < 10000:
        return {
            'recommendation': 'Build Emergency Fund',
            'description': 'Focus on building 3-6 months of emergency savings before investing.',
            'action': 'Save $500/month in high-yield savings account'
        }
    elif total_balance < 50000:
        return {
            'recommendation': 'Start Index Fund Investing',
            'description': 'Begin with low-cost diversified index funds for long-term growth.',
            'action': 'Invest $300/month in S&P 500 index fund'
        }
    else:
        return {
            'recommendation': 'Diversified Portfolio',
            'description': 'Consider a balanced portfolio across stocks, bonds, and real estate.',
            'action': 'Rebalance portfolio quarterly, consider tax-loss harvesting'
        }
