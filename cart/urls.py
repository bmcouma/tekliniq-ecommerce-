from django.urls import path
from .views import cart_detail, add_to_cart, remove_from_cart, update_cart_qty

urlpatterns = [
    path('', cart_detail, name='cart_detail'),
    path('add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('remove/<int:item_id>/', remove_from_cart, name='remove_from_cart'),
    path('update/<int:item_id>/', update_cart_qty, name='update_cart_qty'),
]
