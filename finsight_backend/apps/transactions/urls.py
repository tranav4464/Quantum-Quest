from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'recurring-transactions', views.RecurringTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Transaction management
    path('import/', views.ImportTransactionsView.as_view(), name='import_transactions'),
    path('export/', views.ExportTransactionsView.as_view(), name='export_transactions'),
    path('search/', views.SearchTransactionsView.as_view(), name='search_transactions'),
    path('bulk-update/', views.BulkUpdateTransactionsView.as_view(), name='bulk_update_transactions'),
    path('bulk-delete/', views.BulkDeleteTransactionsView.as_view(), name='bulk_delete_transactions'),
    
    # Category management
    path('categories/hierarchy/', views.CategoryHierarchyView.as_view(), name='category_hierarchy'),
    path('categories/merge/', views.MergeCategoriesView.as_view(), name='merge_categories'),
    
    # Transaction attachments
    path('attachments/', views.TransactionAttachmentView.as_view(), name='transaction_attachments'),
    
    # Recurring transactions
    path('recent/', views.RecentTransactionsView.as_view(), name='recent_transactions'),
    path('recurring/process/', views.ProcessRecurringTransactionsView.as_view(), name='process_recurring'),
]
