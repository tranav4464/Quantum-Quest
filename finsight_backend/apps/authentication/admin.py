from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'email', 'first_name', 'last_name', 'is_active', 
        'is_staff', 'date_joined', 'financial_health_score_display'
    )
    list_filter = (
        'is_active', 'is_staff', 'is_superuser', 
        'date_joined', 'last_login'
    )
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Personal info', {
            'fields': (
                'first_name', 'last_name', 'phone_number', 
                'date_of_birth', 'profile_picture'
            )
        }),
        ('Financial Profile', {
            'fields': (
                'financial_health_score', 'monthly_income', 
                'primary_currency', 'timezone'
            )
        }),
        ('Preferences', {
            'fields': (
                'notification_preferences', 'privacy_settings',
                'theme_preference', 'language_preference'
            )
        }),
        ('Verification', {
            'fields': (
                'two_factor_enabled',
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 
                'groups', 'user_permissions'
            )
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined', 'onboarding_completed_at')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')
    
    def financial_health_score_display(self, obj):
        score = obj.financial_health_score
        if score >= 80:
            color = 'green'
        elif score >= 60:
            color = 'orange'
        else:
            color = 'red'
        return format_html(
            '<span style="color: {};">{}</span>',
            color, score
        )
    financial_health_score_display.short_description = 'Health Score'
