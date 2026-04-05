from django.urls import path
from .views import SellerDashboardView

urlpatterns = [
    path('dashboard/', SellerDashboardView.as_view(), name='seller_dashboard'),
]
