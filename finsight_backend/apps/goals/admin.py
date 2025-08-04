from django.contrib import admin
from .models import Goal, GoalContribution, GoalMilestone, GoalCategory, GoalTemplate


class GoalMilestoneInline(admin.TabularInline):
    model = GoalMilestone
    extra = 1


class GoalContributionInline(admin.TabularInline):
    model = GoalContribution
    extra = 1


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'goal_type', 'target_amount', 'current_amount', 
                   'target_date', 'status', 'is_active')
    list_filter = ('goal_type', 'status', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [GoalMilestoneInline, GoalContributionInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'description', 'goal_type')
        }),
        ('Financial Details', {
            'fields': ('target_amount', 'current_amount', 'target_date')
        }),
        ('Status', {
            'fields': ('status', 'is_active')
        }),
        ('Auto-contribution', {
            'fields': ('auto_contribute', 'contribution_amount', 'contribution_frequency')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(GoalContribution)
class GoalContributionAdmin(admin.ModelAdmin):
    list_display = ('goal', 'amount', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('goal__name', 'description')
    readonly_fields = ('created_at',)


@admin.register(GoalMilestone)
class GoalMilestoneAdmin(admin.ModelAdmin):
    list_display = ('goal', 'name', 'target_percentage', 'is_achieved', 'achieved_at')
    list_filter = ('is_achieved', 'created_at')
    search_fields = ('goal__name', 'name', 'description')
    readonly_fields = ('achieved_at', 'created_at')


@admin.register(GoalCategory)
class GoalCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_system_template')
    list_filter = ('is_system_template', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(GoalTemplate)
class GoalTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'goal_type', 'default_target_amount', 'is_system_template', 'usage_count')
    list_filter = ('goal_type', 'is_system_template')
    search_fields = ('name', 'description')
    readonly_fields = ('usage_count', 'created_at', 'updated_at')
