# Learning Models - Educational Content and Progress Tracking
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime, timedelta
import uuid

User = get_user_model()

class Course(models.Model):
    """Learning course model"""
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='📚')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    estimated_duration_hours = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    prerequisites = models.ManyToManyField('self', blank=True, symmetrical=False)
    order = models.IntegerField(default=0)
    
    # Content
    learning_objectives = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_courses')
    
    class Meta:
        ordering = ['order', 'title']
    
    def __str__(self):
        return self.title
    
    @property
    def total_lessons(self):
        return self.lessons.count()
    
    @property
    def estimated_duration_formatted(self):
        if self.estimated_duration_hours == 1:
            return "1 hour"
        elif self.estimated_duration_hours < 1:
            return f"{int(self.estimated_duration_hours * 60)} minutes"
        else:
            return f"{self.estimated_duration_hours} hours"

class Lesson(models.Model):
    """Individual lesson within a course"""
    LESSON_TYPES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('quiz', 'Quiz'),
        ('interactive', 'Interactive'),
        ('assignment', 'Assignment'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES, default='article')
    order = models.IntegerField(default=0)
    
    # Content
    content = models.JSONField(default=dict)  # Flexible content storage
    estimated_duration_minutes = models.IntegerField(default=15)
    
    # Requirements
    is_required = models.BooleanField(default=True)
    passing_score = models.IntegerField(default=70, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['course', 'order']
        unique_together = ['course', 'order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class UserCourseProgress(models.Model):
    """Track user progress through courses"""
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Progress tracking
    lessons_completed = models.IntegerField(default=0)
    total_time_spent_minutes = models.IntegerField(default=0)
    current_lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Dates
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    
    # Scores
    average_score = models.FloatField(default=0.0)
    completion_percentage = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ['user', 'course']
    
    def __str__(self):
        return f"{self.user.username} - {self.course.title} ({self.status})"
    
    def update_progress(self):
        """Update completion percentage and status"""
        total_lessons = self.course.lessons.count()
        if total_lessons > 0:
            self.completion_percentage = (self.lessons_completed / total_lessons) * 100
            
            if self.completion_percentage >= 100:
                self.status = 'completed'
                if not self.completed_at:
                    self.completed_at = datetime.now()
            elif self.completion_percentage > 0:
                self.status = 'in_progress'
                if not self.started_at:
                    self.started_at = datetime.now()
        
        self.save()

class UserLessonProgress(models.Model):
    """Track user progress through individual lessons"""
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('skipped', 'Skipped'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    course_progress = models.ForeignKey(UserCourseProgress, on_delete=models.CASCADE, related_name='lesson_progress')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    score = models.FloatField(null=True, blank=True)
    time_spent_minutes = models.IntegerField(default=0)
    
    # Attempt tracking
    attempts = models.IntegerField(default=0)
    passed = models.BooleanField(default=False)
    
    # Dates
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    
    # User responses/notes
    user_responses = models.JSONField(default=dict)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.status})"

class Achievement(models.Model):
    """Learning achievements and badges"""
    ACHIEVEMENT_TYPES = [
        ('course_completion', 'Course Completion'),
        ('streak', 'Learning Streak'),
        ('score', 'High Score'),
        ('time', 'Time-based'),
        ('special', 'Special'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🏆')
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES, default='course_completion')
    
    # Requirements
    requirements = models.JSONField(default=dict)
    points_awarded = models.IntegerField(default=100)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class UserAchievement(models.Model):
    """Track user achievements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    
    earned_at = models.DateTimeField(auto_now_add=True)
    points_earned = models.IntegerField()
    
    class Meta:
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.title}"

class DailyChallenge(models.Model):
    """Daily learning challenges"""
    CHALLENGE_TYPES = [
        ('quiz', 'Quiz Question'),
        ('calculation', 'Calculation'),
        ('scenario', 'Scenario'),
        ('definition', 'Definition'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    question = models.TextField()
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPES, default='quiz')
    
    # Question data
    options = models.JSONField(default=list)  # For multiple choice
    correct_answer = models.JSONField(default=dict)
    explanation = models.TextField(blank=True)
    
    # Rewards
    points_reward = models.IntegerField(default=50)
    
    # Scheduling
    date_available = models.DateField()
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_challenges')
    
    class Meta:
        unique_together = ['date_available']
    
    def __str__(self):
        return f"Challenge {self.date_available}: {self.title}"

class UserChallengeAttempt(models.Model):
    """Track user attempts at daily challenges"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenge_attempts')
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE, related_name='user_attempts')
    
    user_answer = models.JSONField(default=dict)
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)
    time_taken_seconds = models.IntegerField(default=0)
    
    attempted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'challenge']
    
    def __str__(self):
        return f"{self.user.username} - Challenge {self.challenge.date_available}"

class LearningStreak(models.Model):
    """Track user learning streaks"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learning_streaks')
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    
    last_activity_date = models.DateField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - Streak: {self.current_streak} days"
