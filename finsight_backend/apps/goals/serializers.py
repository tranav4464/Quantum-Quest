from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import Goal, GoalContribution, GoalMilestone, GoalCategory, GoalTemplate


class GoalMilestoneSerializer(serializers.ModelSerializer):
    target_amount = serializers.SerializerMethodField()
    is_achieved = serializers.SerializerMethodField()
    
    class Meta:
        model = GoalMilestone
        fields = ['id', 'goal', 'name', 'description', 'target_percentage', 
                  'target_amount', 'is_achieved', 'achieved_at']
        read_only_fields = ['achieved_at', 'is_achieved']
    
    def get_target_amount(self, obj):
        if obj.goal and obj.goal.target_amount:
            return obj.goal.target_amount * (obj.target_percentage / 100)
        return 0
    
    def get_is_achieved(self, obj):
        return obj.is_achieved


class GoalContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalContribution
        fields = ['id', 'goal', 'amount', 'description', 'created_at']
        read_only_fields = ['created_at']


class GoalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_system_template']
        read_only_fields = ['is_system_template']


class GoalTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalTemplate
        fields = ['id', 'name', 'description', 'goal_type', 'default_target_amount',
                  'suggested_duration_days', 'icon', 'is_system_template', 'usage_count']
        read_only_fields = ['is_system_template', 'usage_count']


class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    milestones = GoalMilestoneSerializer(many=True, read_only=True, source='goalmilestone_set')
    contributions = GoalContributionSerializer(many=True, read_only=True, source='goalcontribution_set')
    
    class Meta:
        model = Goal
        fields = ['id', 'name', 'description', 'goal_type', 'target_amount', 
                  'current_amount', 'target_date', 'created_at', 'updated_at',
                  'is_active', 'status', 'auto_contribute', 'contribution_amount',
                  'contribution_frequency', 'progress_percentage', 'remaining_amount',
                  'days_remaining', 'milestones', 'contributions']
        read_only_fields = ['created_at', 'updated_at', 'current_amount', 'status']
    
    def get_progress_percentage(self, obj):
        if obj.target_amount and obj.target_amount > 0:
            return (obj.current_amount / obj.target_amount) * 100
        return 0
    
    def get_remaining_amount(self, obj):
        return max(obj.target_amount - obj.current_amount, 0)
    
    def get_days_remaining(self, obj):
        if obj.target_date:
            today = timezone.now().date()
            if obj.target_date > today:
                return (obj.target_date - today).days
        return 0
    
    def validate_target_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Target amount must be greater than zero")
        return value
    
    def validate_target_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Target date cannot be in the past")
        return value
    
    def create(self, validated_data):
        # Set default status to 'active'
        if 'status' not in validated_data:
            validated_data['status'] = 'active'
        
        # Set current_amount to 0 if not provided
        if 'current_amount' not in validated_data:
            validated_data['current_amount'] = 0
        
        return super().create(validated_data)