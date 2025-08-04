from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    GoalViewSet,
    GoalContributionViewSet,
    GoalMilestoneViewSet,
    GoalCategoryViewSet,
    GoalTemplateViewSet,
    CreateGoalFromTemplateView,
    GoalProgressView,
    GoalRecommendationsView,
    GoalAnalyticsOverviewView,
    GoalPerformanceView,
    AddGoalContributionView,
    SetupAutoContributionView,
    CheckMilestonesView
)

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'goal-contributions', GoalContributionViewSet, basename='goal-contribution')
router.register(r'goal-milestones', GoalMilestoneViewSet, basename='goal-milestone')
router.register(r'goal-categories', GoalCategoryViewSet, basename='goal-category')
router.register(r'goal-templates', GoalTemplateViewSet, basename='goal-template')

urlpatterns = [
    path('', include(router.urls)),
    path('create-from-template/', CreateGoalFromTemplateView.as_view(), name='create-from-template'),
    path('progress/', GoalProgressView.as_view(), name='goal-progress'),
    path('recommendations/', GoalRecommendationsView.as_view(), name='goal-recommendations'),
    path('analytics/overview/', GoalAnalyticsOverviewView.as_view(), name='goal-analytics-overview'),
    path('performance/', GoalPerformanceView.as_view(), name='goal-performance'),
    path('add-contribution/', AddGoalContributionView.as_view(), name='add-goal-contribution'),
    path('setup-auto-contribution/', SetupAutoContributionView.as_view(), name='setup-auto-contribution'),
    path('check-milestones/', CheckMilestonesView.as_view(), name='check-milestones'),
]
