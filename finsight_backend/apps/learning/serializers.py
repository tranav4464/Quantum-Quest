# Learning Serializers - API Data Serialization
from rest_framework import serializers
from .models import (
    Course, Lesson, UserCourseProgress, UserLessonProgress,
    Achievement, UserAchievement, DailyChallenge, UserChallengeAttempt,
    LearningStreak
)

class LessonSerializer(serializers.ModelSerializer):
    """Serializer for lessons"""
    estimated_duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'lesson_type', 'order',
            'content', 'estimated_duration_minutes', 'estimated_duration_formatted',
            'is_required', 'passing_score'
        ]
    
    def get_estimated_duration_formatted(self, obj):
        if obj.estimated_duration_minutes < 60:
            return f"{obj.estimated_duration_minutes} min"
        else:
            hours = obj.estimated_duration_minutes // 60
            minutes = obj.estimated_duration_minutes % 60
            if minutes == 0:
                return f"{hours}h"
            return f"{hours}h {minutes}m"

class CourseSerializer(serializers.ModelSerializer):
    """Serializer for courses"""
    lessons = LessonSerializer(many=True, read_only=True)
    total_lessons = serializers.ReadOnlyField()
    estimated_duration_formatted = serializers.ReadOnlyField()
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'icon', 'difficulty',
            'estimated_duration_hours', 'estimated_duration_formatted',
            'status', 'learning_objectives', 'tags', 'order',
            'lessons', 'total_lessons', 'user_progress'
        ]
    
    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = UserCourseProgress.objects.get(user=request.user, course=obj)
                return UserCourseProgressSerializer(progress).data
            except UserCourseProgress.DoesNotExist:
                return None
        return None

class UserLessonProgressSerializer(serializers.ModelSerializer):
    """Serializer for user lesson progress"""
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = UserLessonProgress
        fields = [
            'id', 'lesson', 'lesson_title', 'status', 'score',
            'time_spent_minutes', 'attempts', 'passed',
            'started_at', 'completed_at', 'last_accessed',
            'user_responses', 'notes'
        ]

class UserCourseProgressSerializer(serializers.ModelSerializer):
    """Serializer for user course progress"""
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_icon = serializers.CharField(source='course.icon', read_only=True)
    lesson_progress = UserLessonProgressSerializer(many=True, read_only=True)
    current_lesson_title = serializers.CharField(source='current_lesson.title', read_only=True)
    
    class Meta:
        model = UserCourseProgress
        fields = [
            'id', 'course', 'course_title', 'course_icon', 'status',
            'lessons_completed', 'total_time_spent_minutes', 'current_lesson',
            'current_lesson_title', 'started_at', 'completed_at', 'last_accessed',
            'average_score', 'completion_percentage', 'lesson_progress'
        ]

class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements"""
    is_earned = serializers.SerializerMethodField()
    earned_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'description', 'icon', 'achievement_type',
            'requirements', 'points_awarded', 'is_earned', 'earned_date'
        ]
    
    def get_is_earned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserAchievement.objects.filter(user=request.user, achievement=obj).exists()
        return False
    
    def get_earned_date(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                user_achievement = UserAchievement.objects.get(user=request.user, achievement=obj)
                return user_achievement.earned_at
            except UserAchievement.DoesNotExist:
                return None
        return None

class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for user achievements"""
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at', 'points_earned']

class DailyChallengeSerializer(serializers.ModelSerializer):
    """Serializer for daily challenges"""
    user_attempt = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyChallenge
        fields = [
            'id', 'title', 'question', 'challenge_type', 'options',
            'explanation', 'points_reward', 'date_available',
            'user_attempt', 'is_completed'
        ]
    
    def get_user_attempt(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                attempt = UserChallengeAttempt.objects.get(user=request.user, challenge=obj)
                return UserChallengeAttemptSerializer(attempt).data
            except UserChallengeAttempt.DoesNotExist:
                return None
        return None
    
    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserChallengeAttempt.objects.filter(user=request.user, challenge=obj).exists()
        return False

class UserChallengeAttemptSerializer(serializers.ModelSerializer):
    """Serializer for user challenge attempts"""
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    
    class Meta:
        model = UserChallengeAttempt
        fields = [
            'id', 'challenge', 'challenge_title', 'user_answer',
            'is_correct', 'points_earned', 'time_taken_seconds', 'attempted_at'
        ]

class LearningStreakSerializer(serializers.ModelSerializer):
    """Serializer for learning streaks"""
    class Meta:
        model = LearningStreak
        fields = [
            'id', 'start_date', 'end_date', 'current_streak',
            'longest_streak', 'last_activity_date'
        ]

class LearningAnalyticsSerializer(serializers.Serializer):
    """Serializer for learning analytics"""
    total_courses_enrolled = serializers.IntegerField()
    total_courses_completed = serializers.IntegerField()
    total_lessons_completed = serializers.IntegerField()
    total_time_spent_hours = serializers.FloatField()
    total_points_earned = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    recent_achievements = UserAchievementSerializer(many=True)
    course_progress = UserCourseProgressSerializer(many=True)
