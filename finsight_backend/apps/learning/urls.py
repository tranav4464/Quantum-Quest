# Learning URLs - API Routes for Learning Management System
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, LessonViewSet, DailyChallengeViewSet,
    UserProgressView, AchievementListView, UserAchievementListView,
    LearningAnalyticsView
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'daily-challenges', DailyChallengeViewSet, basename='daily-challenge')

app_name = 'learning'

urlpatterns = [
    # Router URLs (courses, lessons, daily-challenges)
    path('api/', include(router.urls)),
    
    # Additional API endpoints
    path('api/progress/', UserProgressView.as_view(), name='user-progress'),
    path('api/achievements/', AchievementListView.as_view(), name='achievements'),
    path('api/my-achievements/', UserAchievementListView.as_view(), name='user-achievements'),
    path('api/analytics/', LearningAnalyticsView.as_view(), name='learning-analytics'),
]
