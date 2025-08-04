# Learning Views - API Endpoints for Learning Management System
from rest_framework import generics, viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta, date

from .models import (
    Course, Lesson, UserCourseProgress, UserLessonProgress,
    Achievement, UserAchievement, DailyChallenge, UserChallengeAttempt,
    LearningStreak
)
from .serializers import (
    CourseSerializer, LessonSerializer, UserCourseProgressSerializer,
    UserLessonProgressSerializer, AchievementSerializer, UserAchievementSerializer,
    DailyChallengeSerializer, UserChallengeAttemptSerializer,
    LearningStreakSerializer, LearningAnalyticsSerializer
)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for courses - read only as courses are managed by admin"""
    queryset = Course.objects.filter(status='published').order_by('order')
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Enroll user in a course"""
        course = self.get_object()
        user_progress, created = UserCourseProgress.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'status': 'in_progress'}
        )
        
        if created:
            # Create progress records for all lessons
            lessons = course.lessons.all()
            for lesson in lessons:
                UserLessonProgress.objects.get_or_create(
                    user=request.user,
                    lesson=lesson,
                    course_progress=user_progress
                )
            
            return Response({
                'message': 'Successfully enrolled in course',
                'progress': UserCourseProgressSerializer(user_progress).data
            })
        else:
            return Response({
                'message': 'Already enrolled in course',
                'progress': UserCourseProgressSerializer(user_progress).data
            })
    
    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """Get user's progress for a specific course"""
        course = self.get_object()
        try:
            user_progress = UserCourseProgress.objects.get(user=request.user, course=course)
            return Response(UserCourseProgressSerializer(user_progress).data)
        except UserCourseProgress.DoesNotExist:
            return Response({'message': 'Not enrolled in this course'}, status=404)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lessons"""
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return Lesson.objects.filter(course_id=course_id).order_by('order')
        return Lesson.objects.all().order_by('course__order', 'order')
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start or resume a lesson"""
        lesson = self.get_object()
        
        # Get or create course progress first
        course_progress, _ = UserCourseProgress.objects.get_or_create(
            user=request.user,
            course=lesson.course,
            defaults={'status': 'in_progress'}
        )
        
        # Get or create lesson progress
        lesson_progress, created = UserLessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            course_progress=course_progress,
            defaults={'status': 'in_progress'}
        )
        
        if lesson_progress.status == 'not_started':
            lesson_progress.status = 'in_progress'
            lesson_progress.started_at = timezone.now()
            lesson_progress.save()
        
        lesson_progress.last_accessed = timezone.now()
        lesson_progress.save()
        
        # Update course progress current lesson
        if not course_progress.current_lesson or lesson.order < course_progress.current_lesson.order:
            course_progress.current_lesson = lesson
            course_progress.last_accessed = timezone.now()
            course_progress.save()
        
        return Response({
            'message': 'Lesson started',
            'progress': UserLessonProgressSerializer(lesson_progress).data
        })
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a lesson with score and time"""
        lesson = self.get_object()
        score = request.data.get('score', 0)
        time_spent = request.data.get('time_spent_minutes', 0)
        user_responses = request.data.get('user_responses', {})
        notes = request.data.get('notes', '')
        
        try:
            lesson_progress = UserLessonProgress.objects.get(
                user=request.user,
                lesson=lesson
            )
            
            lesson_progress.status = 'completed'
            lesson_progress.score = score
            lesson_progress.time_spent_minutes += time_spent
            lesson_progress.attempts += 1
            lesson_progress.completed_at = timezone.now()
            lesson_progress.last_accessed = timezone.now()
            lesson_progress.user_responses = user_responses
            lesson_progress.notes = notes
            
            # Check if lesson is passed
            if lesson.passing_score and score >= lesson.passing_score:
                lesson_progress.passed = True
            
            lesson_progress.save()
            
            # Update course progress
            course_progress = lesson_progress.course_progress
            course_progress.lessons_completed = course_progress.lesson_progress.filter(
                status='completed'
            ).count()
            course_progress.total_time_spent_minutes += time_spent
            course_progress.last_accessed = timezone.now()
            
            # Calculate average score
            scores = course_progress.lesson_progress.filter(score__gt=0).values_list('score', flat=True)
            if scores:
                course_progress.average_score = sum(scores) / len(scores)
            
            # Check if course is completed
            total_lessons = course_progress.course.lessons.count()
            if course_progress.lessons_completed >= total_lessons:
                course_progress.status = 'completed'
                course_progress.completed_at = timezone.now()
            
            course_progress.save()
            
            # Update learning streak
            self._update_learning_streak(request.user)
            
            # Check for achievements
            self._check_achievements(request.user, lesson, course_progress)
            
            return Response({
                'message': 'Lesson completed',
                'lesson_progress': UserLessonProgressSerializer(lesson_progress).data,
                'course_progress': UserCourseProgressSerializer(course_progress).data
            })
            
        except UserLessonProgress.DoesNotExist:
            return Response({'error': 'Lesson progress not found'}, status=404)
    
    def _update_learning_streak(self, user):
        """Update user's learning streak"""
        streak, created = LearningStreak.objects.get_or_create(user=user)
        today = date.today()
        
        if streak.last_activity_date == today:
            return  # Already updated today
        
        if streak.last_activity_date == today - timedelta(days=1):
            # Continue streak
            streak.current_streak += 1
            if streak.current_streak > streak.longest_streak:
                streak.longest_streak = streak.current_streak
        elif not streak.last_activity_date or streak.last_activity_date < today - timedelta(days=1):
            # Reset streak
            streak.current_streak = 1
        
        streak.last_activity_date = today
        streak.save()
    
    def _check_achievements(self, user, lesson, course_progress):
        """Check and award achievements"""
        # First lesson completion
        if UserLessonProgress.objects.filter(user=user, status='completed').count() == 1:
            self._award_achievement(user, 'first_lesson')
        
        # Course completion
        if course_progress.status == 'completed':
            self._award_achievement(user, 'course_completion')
        
        # Streak achievements
        streak = LearningStreak.objects.get(user=user)
        if streak.current_streak == 7:
            self._award_achievement(user, 'week_streak')
        elif streak.current_streak == 30:
            self._award_achievement(user, 'month_streak')
    
    def _award_achievement(self, user, achievement_type):
        """Award achievement to user"""
        try:
            achievement = Achievement.objects.get(achievement_type=achievement_type)
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement,
                defaults={'points_earned': achievement.points_awarded}
            )
            return created
        except Achievement.DoesNotExist:
            return False

class UserProgressView(generics.ListAPIView):
    """View for user's course progress"""
    serializer_class = UserCourseProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserCourseProgress.objects.filter(user=self.request.user).order_by('-last_accessed')

class AchievementListView(generics.ListAPIView):
    """View for achievements"""
    queryset = Achievement.objects.all().order_by('achievement_type')
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserAchievementListView(generics.ListAPIView):
    """View for user's earned achievements"""
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user).order_by('-earned_at')

class DailyChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for daily challenges"""
    serializer_class = DailyChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        today = date.today()
        return DailyChallenge.objects.filter(date_available=today)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def attempt(self, request, pk=None):
        """Submit answer for daily challenge"""
        challenge = self.get_object()
        user_answer = request.data.get('answer')
        
        # Check if already attempted
        if UserChallengeAttempt.objects.filter(user=request.user, challenge=challenge).exists():
            return Response({'error': 'Challenge already attempted today'}, status=400)
        
        # Determine if answer is correct
        is_correct = str(user_answer).strip().lower() == str(challenge.correct_answer).strip().lower()
        points_earned = challenge.points_reward if is_correct else 0
        
        # Record attempt
        attempt = UserChallengeAttempt.objects.create(
            user=request.user,
            challenge=challenge,
            user_answer=user_answer,
            is_correct=is_correct,
            points_earned=points_earned
        )
        
        # Update learning streak if correct
        if is_correct:
            lesson_view = LessonViewSet()
            lesson_view._update_learning_streak(request.user)
        
        return Response({
            'message': 'Challenge completed',
            'is_correct': is_correct,
            'points_earned': points_earned,
            'explanation': challenge.explanation,
            'attempt': UserChallengeAttemptSerializer(attempt).data
        })

class LearningAnalyticsView(generics.RetrieveAPIView):
    """View for user learning analytics"""
    serializer_class = LearningAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        
        # Calculate analytics
        total_courses_enrolled = UserCourseProgress.objects.filter(user=user).count()
        total_courses_completed = UserCourseProgress.objects.filter(
            user=user, status='completed'
        ).count()
        total_lessons_completed = UserLessonProgress.objects.filter(
            user=user, status='completed'
        ).count()
        
        total_time_minutes = UserCourseProgress.objects.filter(
            user=user
        ).aggregate(total=Sum('total_time_spent_minutes'))['total'] or 0
        total_time_hours = total_time_minutes / 60
        
        total_points_earned = UserAchievement.objects.filter(
            user=user
        ).aggregate(total=Sum('points_earned'))['total'] or 0
        
        # Add challenge points
        challenge_points = UserChallengeAttempt.objects.filter(
            user=user
        ).aggregate(total=Sum('points_earned'))['total'] or 0
        total_points_earned += challenge_points
        
        # Streak information
        try:
            streak = LearningStreak.objects.get(user=user)
            current_streak = streak.current_streak
            longest_streak = streak.longest_streak
        except LearningStreak.DoesNotExist:
            current_streak = 0
            longest_streak = 0
        
        # Recent achievements
        recent_achievements = UserAchievement.objects.filter(
            user=user
        ).order_by('-earned_at')[:5]
        
        # Course progress
        course_progress = UserCourseProgress.objects.filter(
            user=user
        ).order_by('-last_accessed')
        
        return {
            'total_courses_enrolled': total_courses_enrolled,
            'total_courses_completed': total_courses_completed,
            'total_lessons_completed': total_lessons_completed,
            'total_time_spent_hours': round(total_time_hours, 2),
            'total_points_earned': total_points_earned,
            'current_streak': current_streak,
            'longest_streak': longest_streak,
            'recent_achievements': recent_achievements,
            'course_progress': course_progress
        }
