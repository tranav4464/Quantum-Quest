from rest_framework import viewsets, permissions
from .models import Transaction, Category, RecurringTransaction
from .serializers import TransactionSerializer, CategorySerializer, RecurringTransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class RecurringTransactionViewSet(viewsets.ModelViewSet):
    queryset = RecurringTransaction.objects.all()
    serializer_class = RecurringTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

from rest_framework.views import APIView
from rest_framework.response import Response

class RecentTransactionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        transactions = [
            { "name": "Netflix Subscription", "category": "Entertainment", "amount": -15.99, "date": "Today" },
            { "name": "Grocery Store", "category": "Food", "amount": -85.20, "date": "Yesterday" },
            { "name": "Gas Station", "category": "Transportation", "amount": -45.00, "date": "2 days ago" },
            { "name": "Salary Deposit", "category": "Income", "amount": 3200.00, "date": "3 days ago" },
        ]
        return Response(transactions)
