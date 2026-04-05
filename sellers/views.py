from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from products.models import Product
from orders.models import OrderItem

class SellerRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_seller

class SellerDashboardView(SellerRequiredMixin, TemplateView):
    template_name = 'sellers/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        seller = self.request.user.seller_profile
        context['products'] = Product.objects.filter(seller=seller)
        context['recent_orders'] = OrderItem.objects.filter(seller=seller).order_by('-order__created_at')[:10]
        context['total_earnings'] = sum(item.total_price for item in OrderItem.objects.filter(seller=seller, order__status='PAID'))
        return context
