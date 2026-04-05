from django.urls import path
from .views import HomeView, ProductListView, ProductDetailView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('shop/', ProductListView.as_view(), name='product_list'),
    path('product/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
]
