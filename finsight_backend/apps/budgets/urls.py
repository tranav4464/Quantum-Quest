from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'budgets', views.BudgetViewSet)
router.register(r'budget-categories', views.BudgetCategoryViewSet)
router.register(r'budget-alerts', views.BudgetAlertViewSet)
router.register(r'budget-reports', views.BudgetReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Budget management
    path('templates/', views.BudgetTemplatesView.as_view(), name='budget_templates'),
    path('copy/', views.CopyBudgetView.as_view(), name='copy_budget'),
    path('performance/', views.BudgetPerformanceView.as_view(), name='budget_performance'),
    
    # Budget analytics
    path('overview/', views.BudgetOverviewView.as_view(), name='budget_overview'),
    path('recommendations/', views.BudgetRecommendationsView.as_view(), name='budget_recommendations'),
    path('analytics/overview/', views.BudgetAnalyticsOverviewView.as_view(), name='budget_analytics_overview'),
    path('spending-trends/', views.SpendingTrendsView.as_view(), name='spending_trends'),
    path('analytics/trends/', views.BudgetTrendsView.as_view(), name='budget_trends'),
    
    # Alerts
    path('alerts/check/', views.CheckBudgetAlertsView.as_view(), name='check_budget_alerts'),
    path('alerts/acknowledge/', views.AcknowledgeBudgetAlertView.as_view(), name='acknowledge_budget_alert'),
]
