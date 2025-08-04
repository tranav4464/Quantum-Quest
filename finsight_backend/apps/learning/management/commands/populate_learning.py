# Management Command - Populate Learning System with Sample Data
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.learning.models import Course, Lesson, Achievement, DailyChallenge
from datetime import date, timedelta
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate learning system with sample courses, lessons, and achievements'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate learning system...'))
        
        # Get existing admin user
        try:
            admin_user = User.objects.get(username='admin')
        except User.DoesNotExist:
            admin_user = User.objects.create_user(
                username='learning_admin',
                email='learning@finsight.com',
                first_name='Learning',
                last_name='Admin',
                is_staff=True,
                is_superuser=True
            )
        
        # Create sample courses
        self.create_courses(admin_user)
        
        # Create achievements
        self.create_achievements()
        
        # Create daily challenges
        self.create_daily_challenges(admin_user)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated learning system!'))

    def create_courses(self, admin_user):
        """Create sample courses and lessons"""
        courses_data = [
            {
                'title': 'Financial Fundamentals',
                'description': 'Master the basics of personal finance, budgeting, and saving strategies.',
                'icon': '📚',
                'difficulty': 'beginner',
                'estimated_duration_hours': 8,
                'learning_objectives': [
                    'Understand basic financial concepts',
                    'Create and manage a budget',
                    'Develop saving strategies',
                    'Learn about different types of accounts'
                ],
                'tags': ['budgeting', 'saving', 'basics'],
                'order': 1,
                'lessons': [
                    {
                        'title': 'Introduction to Personal Finance',
                        'description': 'Learn the fundamental concepts of personal finance.',
                        'lesson_type': 'video',
                        'content': {
                            'video_url': 'https://example.com/video1',
                            'key_points': ['Income vs Expenses', 'Assets vs Liabilities', 'Net Worth'],
                            'quiz': [
                                {
                                    'question': 'What is the difference between an asset and a liability?',
                                    'options': ['Assets make money, liabilities cost money', 'No difference', 'Assets are physical, liabilities are not'],
                                    'correct': 0
                                }
                            ]
                        },
                        'estimated_duration_minutes': 30,
                        'order': 1
                    },
                    {
                        'title': 'Creating Your First Budget',
                        'description': 'Step-by-step guide to creating a personal budget.',
                        'lesson_type': 'interactive',
                        'content': {
                            'steps': [
                                'Track your income',
                                'List all expenses',
                                'Categorize expenses',
                                'Set spending limits',
                                'Review and adjust'
                            ],
                            'exercises': ['Budget calculator worksheet', 'Expense tracking challenge']
                        },
                        'estimated_duration_minutes': 45,
                        'order': 2
                    }
                ]
            },
            {
                'title': 'Investment Strategies',
                'description': 'Learn about different investment options and strategies for building wealth.',
                'icon': '📈',
                'difficulty': 'intermediate',
                'estimated_duration_hours': 12,
                'learning_objectives': [
                    'Understand different investment types',
                    'Learn risk management principles',
                    'Develop investment strategies',
                    'Understand market dynamics'
                ],
                'tags': ['investing', 'stocks', 'bonds', 'portfolio'],
                'order': 2,
                'lessons': [
                    {
                        'title': 'Investment Basics',
                        'description': 'Introduction to stocks, bonds, and other investment vehicles.',
                        'lesson_type': 'reading',
                        'content': {
                            'sections': [
                                'What are stocks?',
                                'Understanding bonds',
                                'Mutual funds and ETFs',
                                'Risk vs Return'
                            ],
                            'reading_time': 25
                        },
                        'estimated_duration_minutes': 40,
                        'order': 1
                    }
                ]
            },
            {
                'title': 'Retirement Planning',
                'description': 'Plan for your financial future with comprehensive retirement strategies.',
                'icon': '🏖️',
                'difficulty': 'advanced',
                'estimated_duration_hours': 10,
                'learning_objectives': [
                    'Calculate retirement needs',
                    'Understand retirement accounts',
                    'Develop retirement timeline',
                    'Learn about Social Security'
                ],
                'tags': ['retirement', '401k', 'IRA', 'planning'],
                'order': 3,
                'lessons': [
                    {
                        'title': 'Retirement Account Types',
                        'description': 'Learn about different retirement savings accounts.',
                        'lesson_type': 'video',
                        'content': {
                            'video_url': 'https://example.com/retirement-video',
                            'topics': ['401(k) plans', 'Traditional IRA', 'Roth IRA', 'Employer matching']
                        },
                        'estimated_duration_minutes': 35,
                        'order': 1
                    }
                ]
            }
        ]
        
        for course_data in courses_data:
            lessons_data = course_data.pop('lessons', [])
            
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults={
                    **course_data,
                    'created_by': admin_user,
                    'status': 'published'  # Make courses published so they appear in API
                }
            )
            
            if created:
                self.stdout.write(f'Created course: {course.title}')
                
                # Create lessons for this course
                for lesson_data in lessons_data:
                    lesson = Lesson.objects.create(
                        course=course,
                        **lesson_data
                    )
                    self.stdout.write(f'  Created lesson: {lesson.title}')

    def create_achievements(self):
        """Create sample achievements"""
        achievements_data = [
            {
                'title': 'First Steps',
                'description': 'Complete your first lesson',
                'icon': '🎯',
                'achievement_type': 'first_lesson',
                'requirements': {'lessons_completed': 1},
                'points_awarded': 10
            },
            {
                'title': 'Course Completion',
                'description': 'Complete your first course',
                'icon': '🏆',
                'achievement_type': 'course_completion',
                'requirements': {'courses_completed': 1},
                'points_awarded': 50
            },
            {
                'title': 'Week Warrior',
                'description': 'Maintain a 7-day learning streak',
                'icon': '🔥',
                'achievement_type': 'week_streak',
                'requirements': {'streak_days': 7},
                'points_awarded': 25
            },
            {
                'title': 'Monthly Master',
                'description': 'Maintain a 30-day learning streak',
                'icon': '💎',
                'achievement_type': 'month_streak',
                'requirements': {'streak_days': 30},
                'points_awarded': 100
            },
            {
                'title': 'Quiz Champion',
                'description': 'Score 100% on 5 quizzes',
                'icon': '🧠',
                'achievement_type': 'quiz_champion',
                'requirements': {'perfect_scores': 5},
                'points_awarded': 30
            }
        ]
        
        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                title=achievement_data['title'],
                defaults=achievement_data
            )
            
            if created:
                self.stdout.write(f'Created achievement: {achievement.title}')

    def create_daily_challenges(self, admin_user):
        """Create sample daily challenges"""
        challenges_data = [
            {
                'title': "Today's Financial Tip",
                'question': 'What percentage of your income should you ideally save each month?',
                'challenge_type': 'multiple_choice',
                'options': ['10%', '20%', '30%', '50%'],
                'correct_answer': '20%',
                'explanation': 'Financial experts recommend saving 20% of your income - this includes both emergency funds and long-term savings goals.',
                'points_reward': 5,
                'date_available': date.today()
            },
            {
                'title': "Tomorrow's Challenge",
                'question': 'Which investment typically offers the highest potential returns but also the highest risk?',
                'challenge_type': 'multiple_choice',
                'options': ['Savings Account', 'Government Bonds', 'Stock Market', 'Certificate of Deposit'],
                'correct_answer': 'Stock Market',
                'explanation': 'Stocks have historically provided the highest returns over the long term, but they also come with the highest volatility and risk.',
                'points_reward': 5,
                'date_available': date.today() + timedelta(days=1)
            }
        ]
        
        for challenge_data in challenges_data:
            challenge, created = DailyChallenge.objects.get_or_create(
                date_available=challenge_data['date_available'],
                defaults={
                    **challenge_data,
                    'created_by': admin_user
                }
            )
            
            if created:
                self.stdout.write(f'Created daily challenge: {challenge.title}')
