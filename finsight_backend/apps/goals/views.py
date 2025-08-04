from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from decimal import Decimal

from .models import Goal, GoalContribution, GoalMilestone, GoalCategory, GoalTemplate
from .serializers import (GoalSerializer, GoalContributionSerializer, 
                         GoalMilestoneSerializer, GoalCategorySerializer,
                         GoalTemplateSerializer)


class GoalViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing financial goals
    """
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Goal.objects.filter(user=user)
        
        # Apply filters if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(goal_type=category)
            
        completed = self.request.query_params.get('completed', None)
        if completed is not None:
            is_completed = completed.lower() == 'true'
            queryset = queryset.filter(status='completed' if is_completed else ~Q(status='completed'))
            
        # Default ordering
        return queryset.order_by('target_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_contribution(self, request, pk=None):
        goal = self.get_object()
        amount = Decimal(request.data.get('amount', 0))
        description = request.data.get('description', '')
        
        if amount <= 0:
            return Response(
                {'error': 'Contribution amount must be greater than zero'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contribution = goal.add_contribution(amount, description)
        serializer = GoalContributionSerializer(contribution)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        goal = self.get_object()
        goal.mark_completed()
        serializer = self.get_serializer(goal)
        return Response(serializer.data)


class GoalContributionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing goal contributions
    """
    serializer_class = GoalContributionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GoalContribution.objects.filter(goal__user=self.request.user)
    
    def perform_create(self, serializer):
        goal = get_object_or_404(Goal, pk=serializer.validated_data['goal'].pk)
        
        # Ensure the goal belongs to the current user
        if goal.user != self.request.user:
            return Response(
                {'error': 'You do not have permission to add contributions to this goal'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()
        
        # Update the goal's current amount
        goal.current_amount += serializer.validated_data['amount']
        goal.save()


class GoalMilestoneViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing goal milestones
    """
    serializer_class = GoalMilestoneSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GoalMilestone.objects.filter(goal__user=self.request.user)
    
    def perform_create(self, serializer):
        goal = get_object_or_404(Goal, pk=serializer.validated_data['goal'].pk)
        
        # Ensure the goal belongs to the current user
        if goal.user != self.request.user:
            return Response(
                {'error': 'You do not have permission to add milestones to this goal'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()


class GoalCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing goal categories
    """
    serializer_class = GoalCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GoalCategory.objects.filter(
            Q(user=self.request.user) | Q(is_system_template=True)
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GoalTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing goal templates
    """
    serializer_class = GoalTemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GoalTemplate.objects.filter(
            Q(is_system_template=True) | Q(user=self.request.user)
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CreateGoalFromTemplateView(APIView):
    """
    Create a new goal from a template
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        template_id = request.data.get('template_id')
        if not template_id:
            return Response(
                {'error': 'Template ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        template = get_object_or_404(GoalTemplate, pk=template_id)
        
        # Create goal from template
        goal_data = {
            'name': request.data.get('name', template.name),
            'description': request.data.get('description', template.description),
            'goal_type': template.goal_type,
            'target_amount': request.data.get('target_amount', template.default_target_amount),
            'current_amount': request.data.get('current_amount', 0),
            'target_date': request.data.get('target_date'),
            'user': request.user,
        }
        
        goal = Goal.objects.create(**goal_data)
        
        # Increment template usage count
        template.usage_count += 1
        template.save()
        
        serializer = GoalSerializer(goal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GoalProgressView(APIView):
    """
    Get progress statistics for user's goals
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        goals = Goal.objects.filter(user=user)
        
        total_goals = goals.count()
        active_goals = goals.filter(status='active').count()
        completed_goals = goals.filter(status='completed').count()
        
        total_target = goals.aggregate(total=Sum('target_amount'))['total'] or 0
        total_current = goals.aggregate(total=Sum('current_amount'))['total'] or 0
        
        overall_progress = (total_current / total_target * 100) if total_target > 0 else 0
        
        # Goals by category
        goals_by_category = {}
        for goal in goals:
            category = goal.goal_type
            if category not in goals_by_category:
                goals_by_category[category] = {
                    'count': 0,
                    'target_amount': 0,
                    'current_amount': 0
                }
            
            goals_by_category[category]['count'] += 1
            goals_by_category[category]['target_amount'] += goal.target_amount
            goals_by_category[category]['current_amount'] += goal.current_amount
        
        return Response({
            'total_goals': total_goals,
            'active_goals': active_goals,
            'completed_goals': completed_goals,
            'total_target_amount': float(total_target),
            'total_current_amount': float(total_current),
            'overall_progress': float(overall_progress),
            'goals_by_category': goals_by_category
        })


class GoalRecommendationsView(APIView):
    """
    Get personalized goal recommendations
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user's existing goals
        existing_goals = Goal.objects.filter(user=user)
        existing_goal_types = set(existing_goals.values_list('goal_type', flat=True))
        
        # Get templates that the user hasn't used yet
        recommended_templates = GoalTemplate.objects.filter(
            is_system_template=True
        ).exclude(
            goal_type__in=existing_goal_types
        ).order_by('-usage_count')[:5]
        
        serializer = GoalTemplateSerializer(recommended_templates, many=True)
        return Response(serializer.data)


class GoalAnalyticsOverviewView(APIView):
    """
    Get analytics overview for goals
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        goals = Goal.objects.filter(user=user)
        
        # Monthly contribution stats
        current_month = timezone.now().month
        current_year = timezone.now().year
        
        monthly_contributions = GoalContribution.objects.filter(
            goal__user=user,
            created_at__month=current_month,
            created_at__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Goal completion rate
        total_goals_ever = goals.count()
        completed_goals = goals.filter(status='completed').count()
        completion_rate = (completed_goals / total_goals_ever * 100) if total_goals_ever > 0 else 0
        
        # Average goal progress
        active_goals = goals.filter(status='active')
        progress_values = []
        for goal in active_goals:
            if goal.target_amount > 0:
                progress = (goal.current_amount / goal.target_amount) * 100
                progress_values.append(progress)
        
        avg_progress = sum(progress_values) / len(progress_values) if progress_values else 0
        
        return Response({
            'monthly_contributions': float(monthly_contributions),
            'completion_rate': float(completion_rate),
            'average_progress': float(avg_progress),
            'total_goals': total_goals_ever,
            'active_goals': active_goals.count(),
            'completed_goals': completed_goals
        })


class GoalPerformanceView(APIView):
    """
    Get detailed performance metrics for a specific goal
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        goal_id = request.query_params.get('goal_id')
        if not goal_id:
            return Response(
                {'error': 'Goal ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        goal = get_object_or_404(Goal, pk=goal_id, user=request.user)
        
        # Get contribution history
        contributions = GoalContribution.objects.filter(goal=goal).order_by('created_at')
        contribution_data = []
        
        running_total = 0
        for contrib in contributions:
            running_total += contrib.amount
            contribution_data.append({
                'date': contrib.created_at.strftime('%Y-%m-%d'),
                'amount': float(contrib.amount),
                'running_total': float(running_total)
            })
        
        # Calculate time-based metrics
        days_active = (timezone.now().date() - goal.created_at.date()).days
        avg_contribution = goal.current_amount / days_active if days_active > 0 else 0
        
        # Milestone progress
        milestones = GoalMilestone.objects.filter(goal=goal).order_by('target_percentage')
        milestone_data = []
        
        for milestone in milestones:
            milestone_data.append({
                'name': milestone.name,
                'target_percentage': milestone.target_percentage,
                'target_amount': float(milestone.target_amount),
                'is_achieved': milestone.is_achieved,
                'achieved_at': milestone.achieved_at.strftime('%Y-%m-%d') if milestone.achieved_at else None
            })
        
        return Response({
            'goal_id': str(goal.id),
            'name': goal.name,
            'target_amount': float(goal.target_amount),
            'current_amount': float(goal.current_amount),
            'progress_percentage': float(goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0,
            'days_active': days_active,
            'average_daily_contribution': float(avg_contribution),
            'contribution_history': contribution_data,
            'milestones': milestone_data
        })


class AddGoalContributionView(APIView):
    """
    Add a contribution to a goal
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        goal_id = request.data.get('goal_id')
        amount = request.data.get('amount')
        description = request.data.get('description', '')
        
        if not goal_id or not amount:
            return Response(
                {'error': 'Goal ID and amount are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = Decimal(amount)
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except (ValueError, TypeError):
            return Response(
                {'error': 'Amount must be a positive number'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        goal = get_object_or_404(Goal, pk=goal_id, user=request.user)
        contribution = goal.add_contribution(amount, description)
        
        # Check if any milestones were achieved
        milestones = GoalMilestone.objects.filter(goal=goal, is_achieved=False)
        achieved_milestones = []
        
        for milestone in milestones:
            if milestone.check_achievement():
                achieved_milestones.append({
                    'id': str(milestone.id),
                    'name': milestone.name,
                    'target_percentage': milestone.target_percentage
                })
        
        # Check if goal is now complete
        is_completed = False
        if goal.current_amount >= goal.target_amount and goal.status != 'completed':
            goal.mark_completed()
            is_completed = True
        
        return Response({
            'contribution': GoalContributionSerializer(contribution).data,
            'goal_progress': {
                'current_amount': float(goal.current_amount),
                'target_amount': float(goal.target_amount),
                'progress_percentage': float(goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0
            },
            'achieved_milestones': achieved_milestones,
            'goal_completed': is_completed
        }, status=status.HTTP_201_CREATED)


class SetupAutoContributionView(APIView):
    """
    Set up automatic contributions for a goal
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        goal_id = request.data.get('goal_id')
        amount = request.data.get('amount')
        frequency = request.data.get('frequency', 'monthly')  # weekly, monthly
        
        if not goal_id or not amount:
            return Response(
                {'error': 'Goal ID and amount are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = Decimal(amount)
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except (ValueError, TypeError):
            return Response(
                {'error': 'Amount must be a positive number'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        goal = get_object_or_404(Goal, pk=goal_id, user=request.user)
        
        # Update goal with auto-contribution settings
        goal.auto_contribute = True
        goal.contribution_amount = amount
        goal.contribution_frequency = frequency
        goal.save()
        
        return Response({
            'goal_id': str(goal.id),
            'auto_contribute': goal.auto_contribute,
            'contribution_amount': float(goal.contribution_amount),
            'contribution_frequency': frequency
        })


class CheckMilestonesView(APIView):
    """
    Check and update milestone achievements for a goal
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        goal_id = request.data.get('goal_id')
        
        if not goal_id:
            return Response(
                {'error': 'Goal ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        goal = get_object_or_404(Goal, pk=goal_id, user=request.user)
        milestones = GoalMilestone.objects.filter(goal=goal, is_achieved=False)
        
        achieved_milestones = []
        for milestone in milestones:
            if milestone.check_achievement():
                achieved_milestones.append({
                    'id': str(milestone.id),
                    'name': milestone.name,
                    'target_percentage': milestone.target_percentage,
                    'target_amount': float(milestone.target_amount)
                })
        
        return Response({
            'goal_id': str(goal.id),
            'current_amount': float(goal.current_amount),
            'target_amount': float(goal.target_amount),
            'progress_percentage': float(goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0,
            'achieved_milestones': achieved_milestones
        })
