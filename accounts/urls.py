from django.urls import path
from .views import AccountDashboardView

urlpatterns = [
    path('dashboard/', AccountDashboardView.as_view(), name='account_dashboard'),
]
