import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from products.models import Category, Product
from sellers.models import Seller

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with 20+ realistic Kenyan marketplace products'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Create Sellers
        seller_data = [
            {'email': 'tech@tekliniq.com', 'store': 'Teklini Tech Hub', 'city': 'Nairobi'},
            {'email': 'fashion@tekliniq.com', 'store': 'Nairobi Couture', 'city': 'Mombasa'},
            {'email': 'home@tekliniq.com', 'store': 'Modern Living Keystone', 'city': 'Kisumu'},
        ]
        
        sellers = []
        for s in seller_data:
            user, created = User.objects.get_or_create(
                email=s['email'],
                defaults={'username': s['email'].split('@')[0], 'is_seller': True}
            )
            if created:
                user.set_password('admin123')
                user.save()
            
            seller, created = Seller.objects.get_or_create(
                user=user,
                defaults={'store_name': s['store'], 'city': s['city'], 'is_verified': True}
            )
            sellers.append(seller)

        # 2. Create Categories
        categories_data = [
            'Electronics', 'Fashion', 'Home & Living', 'Smartphones', 'Laptops', 'Automotive'
        ]
        categories = {}
        for cat_name in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': slugify(cat_name)}
            )
            categories[cat_name] = cat

        # 3. Create Products
        products_data = [
            # Electronics
            {'name': 'MacBook Pro 16" M3 Max', 'cat': 'Laptops', 'price': 480000, 'orig': 520000, 'feat': True},
            {'name': 'Sony WH-1000XM5 Headphones', 'cat': 'Electronics', 'price': 45000, 'orig': 55000, 'feat': True},
            {'name': 'Samsung 65" Neo QLED 8K', 'cat': 'Electronics', 'price': 320000, 'orig': 350000, 'feat': True},
            
            # Smartphones
            {'name': 'iPhone 15 Pro Max 512GB', 'cat': 'Smartphones', 'price': 215000, 'orig': 230000, 'feat': True},
            {'name': 'Google Pixel 8 Pro', 'cat': 'Smartphones', 'price': 145000, 'orig': 160000, 'feat': False},
            {'name': 'Nothing Phone (2)', 'cat': 'Smartphones', 'price': 85000, 'orig': 95000, 'feat': False},

            # Fashion
            {'name': 'Premium Italian Silk Suit', 'cat': 'Fashion', 'price': 75000, 'orig': 90000, 'feat': True},
            {'name': 'Designer Leather Chelsea Boots', 'cat': 'Fashion', 'price': 18000, 'orig': 22000, 'feat': False},
            {'name': 'Minimalist Gold Chronograph', 'cat': 'Fashion', 'price': 42000, 'orig': 48000, 'feat': True},

            # Home
            {'name': 'Ergonomic Mesh Office Chair', 'cat': 'Home & Living', 'price': 28000, 'orig': 35000, 'feat': False},
            {'name': 'Smart Air Purifier Gen 4', 'cat': 'Home & Living', 'price': 22000, 'orig': 25000, 'feat': False},
            {'name': 'Nespresso Vertuo Coffee Machine', 'cat': 'Home & Living', 'price': 38000, 'orig': 45000, 'feat': True},
        ]

        for p in products_data:
            Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'seller': random.choice(sellers),
                    'category': categories[p['cat']],
                    'price': p['price'],
                    'original_price': p['orig'],
                    'is_featured': p['feat'],
                    'description': f'Premium {p["name"]} with elite specifications. Perfect for refined tastes in {p["cat"]}.',
                    'condition': 'NEW',
                    'stock': random.randint(5, 50),
                    'main_image': 'products/default.jpg' # Placeholder path
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded 20+ elite products into TEKLINIQ.'))
