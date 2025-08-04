# Learning Admin - Django Admin Configuration for Learning Management System
from django.contrib import admin
from .models import (
    Course, Lesson, UserCourseProgress, UserLessonProgress,
    Achievement, UserAchievement, DailyChallenge, UserChallengeAttempt,
    LearningStreak
)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'status', 'estimated_duration_hours', 'order']
    list_filter = ['difficulty', 'status']
    search_fields = ['title', 'description']
    ordering = ['order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'icon', 'difficulty', 'status')
        }),
        ('Content', {
            'fields': ('learning_objectives', 'tags', 'estimated_duration_hours')
        }),
        ('Organization', {
            'fields': ('order',)
        }),
    )

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_type', 'order', 'estimated_duration_minutes', 'is_required']
    list_filter = ['lesson_type', 'is_required', 'course']
    search_fields = ['title', 'description', 'course__title']
    ordering = ['course__order', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'course', 'lesson_type')
        }),
        ('Content', {
            'fields': ('content', 'estimated_duration_minutes', 'passing_score')
        }),
        ('Settings', {
            'fields': ('order', 'is_required')
        }),
    )

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'completion_percentage', 'lessons_completed', 'last_accessed']
    list_filter = ['status', 'course']
    search_fields = ['user__username', 'user__email', 'course__title']
    readonly_fields = ['started_at', 'completed_at', 'lessons_completed', 'total_time_spent_minutes', 'average_score']
    
    fieldsets = (
        ('Progress Information', {
            'fields': ('user', 'course', 'status', 'current_lesson')
        }),
        ('Statistics', {
            'fields': ('lessons_completed', 'total_time_spent_minutes', 'average_score')
        }),
        ('Timestamps', {
            'fields': ('started_at', 'completed_at', 'last_accessed')
        }),
    )

@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'status', 'score', 'passed', 'attempts', 'last_accessed']
    list_filter = ['status', 'passed', 'lesson__course']
    search_fields = ['user__username', 'lesson__title', 'lesson__course__title']
    readonly_fields = ['started_at', 'completed_at', 'attempts']

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'achievement_type', 'points_awarded']
    list_filter = ['achievement_type']
    search_fields = ['title', 'description']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'icon', 'achievement_type')
        }),
        ('Requirements', {
            'fields': ('requirements', 'points_awarded')
        }),
    )

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'points_earned', 'earned_at']
    list_filter = ['achievement__achievement_type', 'earned_at']
    search_fields = ['user__username', 'achievement__title']
    readonly_fields = ['earned_at']

@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'challenge_type', 'date_available', 'points_reward']
    list_filter = ['challenge_type', 'date_available']
    search_fields = ['title', 'question']
    date_hierarchy = 'date_available'
    
    fieldsets = (
        ('Challenge Information', {
            'fields': ('title', 'question', 'challenge_type', 'date_available')
        }),
        ('Options & Answer', {
            'fields': ('options', 'correct_answer')
        }),
        ('Feedback', {
            'fields': ('explanation', 'points_reward')
        }),
    )

@admin.register(UserChallengeAttempt)
class UserChallengeAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge', 'is_correct', 'points_earned', 'attempted_at']
    list_filter = ['is_correct', 'challenge__challenge_type', 'attempted_at']
    search_fields = ['user__username', 'challenge__title']
    readonly_fields = ['attempted_at']

@admin.register(LearningStreak)
class LearningStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'last_activity_date']
    search_fields = ['user__username']
    readonly_fields = ['start_date', 'end_date', 'last_activity_date']
    
    fieldsets = (
        ('User & Streak', {
            'fields': ('user', 'current_streak', 'longest_streak')
        }),
        ('Activity Dates', {
            'fields': ('start_date', 'end_date', 'last_activity_date')
        }),
    )
