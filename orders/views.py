from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from cart.models import Cart
from .models import Order, OrderItem

@login_required
def checkout(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    if not cart.items.exists():
        return redirect('product_list')

    if request.method == 'POST':
        # Create Order
        order = Order.objects.create(
            buyer=request.user,
            total_amount=cart.total_price + 500, # Subtotal + Shipping
            full_name=request.POST.get('full_name'),
            email=request.POST.get('email'),
            phone_number=request.POST.get('phone_number'),
            address=request.POST.get('address'),
            city=request.POST.get('city'),
            payment_method=request.POST.get('payment_method', 'MPESA')
        )

        # Create Order Items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                seller=item.product.seller,
                price=item.product.price,
                quantity=item.quantity
            )
            # Update Stock
            item.product.stock -= item.quantity
            item.product.save()

        # Clear Cart
        cart.items.all().delete()

        return render(request, 'orders/success.html', {'order': order})

    return render(request, 'orders/checkout.html', {'cart': cart})
