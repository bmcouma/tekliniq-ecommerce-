/* ============================================
   TekliniqEngine — Data & Logic Layer
   by Teklini Technologies
   
   Zero DOM awareness. Returns data only.
   ============================================ */

class TekliniqEngine {
  constructor() {
    this.CART_KEY = 'tekliniq_cart';
    this.products = this._initProducts();
  }

  // --- Product Catalog ---
  _initProducts() {
    return [
      {
        id: 'p001',
        name: 'Obsidian Chronograph',
        category: 'accessories',
        price: 850,
        originalPrice: 1200,
        badge: 'New',
        description: 'Meticulously crafted with a brushed titanium case and sapphire crystal. Water-resistant to 100m. Swiss-made movement.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p002',
        name: 'Gilded Fountain Pen',
        category: 'accessories',
        price: 245,
        originalPrice: null,
        badge: 'Limited',
        description: '24k gold-plated nib with a sleek onyx barrel. The perfect instrument for visionary thoughts.',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p003',
        name: 'Noir Leather Tote',
        category: 'bags',
        price: 495,
        originalPrice: null,
        badge: null,
        description: 'Full-grain Italian calfskin. Hand-stitched seams and a reinforced base for enduring structure.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p004',
        name: 'The Weekender II',
        category: 'bags',
        price: 720,
        originalPrice: 850,
        badge: 'Sale',
        description: 'Waxed canvas paired with heritage leather accents. Spaciously designed for the modern nomad.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p005',
        name: 'Midnight Chelsea Boots',
        category: 'footwear',
        price: 380,
        originalPrice: null,
        badge: 'Top Pick',
        description: 'Sleek, silhouette-focused boots with a premium suede finish. Goodyear welted for a lifetime of wear.',
        image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p006',
        name: 'Aileron Sneakers',
        category: 'footwear',
        price: 215,
        originalPrice: 280,
        badge: null,
        description: 'Ultra-lightweight performance sneakers with a minimalist, futuristic design language.',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p007',
        name: 'Monolith Headphones',
        category: 'tech',
        price: 549,
        originalPrice: null,
        badge: 'Elite',
        description: 'Active noise cancellation with 40mm beryllium drivers. Studio-grade sound in a carbon-fiber shell.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p008',
        name: 'Titanium Mechanical Keyboard',
        category: 'tech',
        price: 320,
        originalPrice: null,
        badge: 'New',
        description: 'Programmable RGB backlighting under artisan-carved titanium keycaps. The apex of workspace peripheral design.',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p009',
        name: 'Alpine Cashmere Scarf',
        category: 'apparel',
        price: 185,
        originalPrice: 220,
        badge: 'Winter Wear',
        description: '100% pure Himalayan cashmere. Unmatched softness and warmth for the coldest expeditions.',
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p010',
        name: 'Stealth Bomber Jacket',
        category: 'apparel',
        price: 450,
        originalPrice: null,
        badge: null,
        description: 'Water-repellent technical fabric with a matte black finish. Windproof and temperature-regulating.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p011',
        name: 'Carbon Fiber Wallet',
        category: 'accessories',
        price: 125,
        originalPrice: 150,
        badge: 'Sale',
        description: 'Ultra-slim, RFID-blocking wallet forged from aerospace-grade carbon fiber.',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p012',
        name: 'Velocette Sunglasses',
        category: 'accessories',
        price: 295,
        originalPrice: null,
        badge: 'Limited',
        description: 'Hand-polished acetate frames with polarized obsidian lenses. Engineered for clarity.',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'
      }
    ];
  }

  fetchProducts() {
    return [...this.products];
  }

  fetchFeatured() {
    return this.products.slice(0, 4);
  }

  fetchByCategory(category) {
    if (category === 'all') return this.fetchProducts();
    return this.products.filter(p => p.category === category);
  }

  getProductById(id) {
    return this.products.find(p => p.id === id) || null;
  }

  // --- Cart Operations ---
  _readCart() {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  _writeCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  getCart() {
    return this._readCart();
  }

  getCartCount() {
    return this._readCart().reduce((sum, item) => sum + item.qty, 0);
  }

  getCartTotal() {
    const cart = this._readCart();
    return cart.reduce((sum, item) => {
      const product = this.getProductById(item.id);
      return product ? sum + product.price * item.qty : sum;
    }, 0);
  }

  addToCart(productId) {
    const product = this.getProductById(productId);
    if (!product) return null;

    const cart = this._readCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }

    this._writeCart(cart);
    return { product, cart };
  }

  removeFromCart(productId) {
    let cart = this._readCart();
    cart = cart.filter(item => item.id !== productId);
    this._writeCart(cart);
    return cart;
  }

  updateQty(productId, delta) {
    const cart = this._readCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return cart;

    item.qty += delta;
    if (item.qty <= 0) {
      return this.removeFromCart(productId);
    }

    this._writeCart(cart);
    return cart;
  }

  clearCart() {
    this._writeCart([]);
    return [];
  }
}
