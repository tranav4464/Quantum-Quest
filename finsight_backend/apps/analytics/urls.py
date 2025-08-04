# Analytics URLs Configuration
from django.urls import path
from . import views

urlpatterns = [
    # Prediction endpoints
    path('financial-health-forecast/', views.financial_health_forecast, name='financial_health_forecast'),
    path('spending-forecast/', views.spending_forecast, name='spending_forecast'),
    path('investment-outlook/', views.investment_outlook, name='investment_outlook'),
    path('market-insights/', views.market_insights, name='market_insights'),
    path('generate-forecast/', views.generate_forecast, name='generate_forecast'),
]
