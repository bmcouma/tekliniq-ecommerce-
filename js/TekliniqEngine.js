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
        price: 289,
        originalPrice: 350,
        badge: 'Sale',
        description: 'Precision-crafted matte black timepiece with sapphire crystal face.',
        initial: 'OC'
      },
      {
        id: 'p002',
        name: 'Noir Leather Tote',
        category: 'bags',
        price: 195,
        originalPrice: null,
        badge: null,
        description: 'Full-grain leather tote in deep charcoal. Unlined interior.',
        initial: 'NT'
      },
      {
        id: 'p003',
        name: 'Meridian Sneakers',
        category: 'footwear',
        price: 165,
        originalPrice: 210,
        badge: 'Sale',
        description: 'Italian leather low-tops with vulcanized soles. Cloud white.',
        initial: 'MS'
      },
      {
        id: 'p004',
        name: 'Cashmere Overcoat',
        category: 'apparel',
        price: 450,
        originalPrice: null,
        badge: 'New',
        description: 'Double-faced cashmere coat in heather grey. Notch lapels.',
        initial: 'CO'
      },
      {
        id: 'p005',
        name: 'Titanium Card Holder',
        category: 'accessories',
        price: 78,
        originalPrice: null,
        badge: null,
        description: 'Brushed titanium card case. Holds 6 cards. RFID blocking.',
        initial: 'TC'
      },
      {
        id: 'p006',
        name: 'Silk-Blend Shirt',
        category: 'apparel',
        price: 135,
        originalPrice: 175,
        badge: 'Sale',
        description: 'Relaxed-fit silk-cotton blend. Mother-of-pearl buttons.',
        initial: 'SS'
      },
      {
        id: 'p007',
        name: 'Structured Weekender',
        category: 'bags',
        price: 320,
        originalPrice: null,
        badge: 'New',
        description: 'Canvas and leather weekend bag. Brass hardware. 42L capacity.',
        initial: 'SW'
      },
      {
        id: 'p008',
        name: 'Suede Chelsea Boots',
        category: 'footwear',
        price: 245,
        originalPrice: null,
        badge: null,
        description: 'Italian suede chelsea boots. Blake-stitched sole. Tobacco.',
        initial: 'CB'
      },
      {
        id: 'p009',
        name: 'Onyx Sunglasses',
        category: 'accessories',
        price: 189,
        originalPrice: 230,
        badge: 'Sale',
        description: 'Acetate frames with polarized lenses. UV400 protection.',
        initial: 'OS'
      },
      {
        id: 'p010',
        name: 'Wool Tailored Trousers',
        category: 'apparel',
        price: 165,
        originalPrice: null,
        badge: null,
        description: 'High-twist wool trousers. Flat front. Charcoal.',
        initial: 'WT'
      },
      {
        id: 'p011',
        name: 'Minimalist Backpack',
        category: 'bags',
        price: 175,
        originalPrice: null,
        badge: null,
        description: 'Water-resistant nylon. Padded laptop sleeve. Matte black.',
        initial: 'MB'
      },
      {
        id: 'p012',
        name: 'Leather Derby Shoes',
        category: 'footwear',
        price: 285,
        originalPrice: 340,
        badge: 'Sale',
        description: 'Hand-polished calfskin derbies. Goodyear welt. Espresso.',
        initial: 'LD'
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
