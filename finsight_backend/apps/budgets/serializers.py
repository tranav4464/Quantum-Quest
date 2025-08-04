from rest_framework import serializers
from .models import Budget, BudgetCategory, BudgetAlert, BudgetReport

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'

class BudgetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCategory
        fields = '__all__'

class BudgetAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetAlert
        fields = '__all__'

class BudgetReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetReport
        fields = '__all__'
