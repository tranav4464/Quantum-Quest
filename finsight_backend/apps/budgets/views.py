from rest_framework import viewsets, permissions
from .models import Budget, BudgetCategory, BudgetAlert, BudgetReport
from .serializers import BudgetSerializer, BudgetCategorySerializer, BudgetAlertSerializer, BudgetReportSerializer

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class BudgetCategoryViewSet(viewsets.ModelViewSet):
    queryset = BudgetCategory.objects.all()
    serializer_class = BudgetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(budget__user=self.request.user)

class BudgetAlertViewSet(viewsets.ModelViewSet):
    queryset = BudgetAlert.objects.all()
    serializer_class = BudgetAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class BudgetReportViewSet(viewsets.ModelViewSet):
    queryset = BudgetReport.objects.all()
    serializer_class = BudgetReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

from rest_framework.views import APIView
from rest_framework.response import Response

class BudgetOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # For simplicity, we'll just get the first active budget for the user
        budget = Budget.objects.filter(user=user, is_active=True).first()
        if not budget:
            return Response({"error": "No active budget found"}, status=404)

        categories = BudgetCategory.objects.filter(budget=budget)
        serializer = BudgetCategorySerializer(categories, many=True)
        return Response(serializer.data)

class BudgetRecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        recommendations = [
            {
                "icon": "💡",
                "title": "Reduce Entertainment",
                "description": "You're $50 over budget. Consider home entertainment options.",
            },
            {
                "icon": "🎯",
                "title": "Food Savings",
                "description": "Great job! You're under budget. You can save $200 this month.",
            },
            {
                "icon": "📊",
                "title": "Housing Efficiency",
                "description": "You have $300 left. Consider energy-saving improvements.",
            },
        ]
        return Response(recommendations)

class SpendingTrendsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = [
            { "name": "Jan", "spent": 4000 },
            { "name": "Feb", "spent": 3000 },
            { "name": "Mar", "spent": 2000 },
            { "name": "Apr", "spent": 2780 },
            { "name": "May", "spent": 1890 },
            { "name": "Jun", "spent": 2390 },
            { "name": "Jul", "spent": 3490 },
        ]
        return Response(data)
