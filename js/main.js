/* ============================================
   TEKLINIQ — UI Controller
   by Teklini Technologies
   
   Only file that touches the DOM.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new TekliniqEngine();

  // --- Utility ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function showToast(message, type = 'success') {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast visible ' + type;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.className = 'toast';
    }, 2800);
  }

  // --- Navigation ---
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Cart Drawer ---
  const cartToggle = $('#cartToggle');
  const cartDrawer = $('#cartDrawer');
  const cartOverlay = $('#cartOverlay');
  const cartClose = $('#cartClose');

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // --- Cart Badge ---
  function updateCartBadge() {
    const count = engine.getCartCount();
    const badge = $('#cartCount');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  // --- Cart Rendering ---
  function renderCart() {
    const itemsContainer = $('#cartItems');
    const emptyState = $('#cartEmpty');
    const footer = $('#cartFooter');
    const totalEl = $('#cartTotal');

    if (!itemsContainer) return;

    const cart = engine.getCart();

    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.add('visible');
      if (footer) footer.classList.remove('visible');
      return;
    }

    if (emptyState) emptyState.classList.remove('visible');
    if (footer) footer.classList.add('visible');

    itemsContainer.innerHTML = cart.map(item => {
      const product = engine.getProductById(item.id);
      if (!product) return '';
      return `
        <div class="cart-item" data-id="${product.id}">
          <div class="cart-item__image">${product.initial}</div>
          <div class="cart-item__details">
            <div class="cart-item__name">${product.name}</div>
            <div class="cart-item__price">$${product.price}</div>
            <div class="cart-item__controls">
              <button class="cart-item__qty-btn" data-action="decrease" data-id="${product.id}">−</button>
              <span class="cart-item__qty">${item.qty}</span>
              <button class="cart-item__qty-btn" data-action="increase" data-id="${product.id}">+</button>
              <button class="cart-item__remove" data-action="remove" data-id="${product.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (totalEl) totalEl.textContent = '$' + engine.getCartTotal().toFixed(2);

    // Attach events
    itemsContainer.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (action === 'increase') engine.updateQty(id, 1);
        else if (action === 'decrease') engine.updateQty(id, -1);
        else if (action === 'remove') engine.removeFromCart(id);

        renderCart();
        updateCartBadge();
      });
    });
  }

  // --- Checkout ---
  const checkoutBtn = $('#cartCheckout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = engine.getCart();
      if (cart.length === 0) return;
      engine.clearCart();
      renderCart();
      updateCartBadge();
      closeCart();
      showToast('Order placed! Thank you for shopping with TEKLINIQ.', 'success');
    });
  }

  // --- Product Card Builder ---
  function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.transitionDelay = (index * 0.08) + 's';

    card.innerHTML = `
      <div class="product-card__image">
        <div class="product-card__image-placeholder">${product.initial}</div>
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-card__info">
        <div class="product-card__category">${product.category}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <div class="product-card__price">
          <span class="product-card__price-current">$${product.price}</span>
          ${product.originalPrice ? `<span class="product-card__price-original">$${product.originalPrice}</span>` : ''}
        </div>
        <button class="product-card__add" data-product-id="${product.id}">Add to Cart</button>
      </div>
    `;

    // Add to cart click
    card.querySelector('.product-card__add').addEventListener('click', () => {
      engine.addToCart(product.id);
      updateCartBadge();
      renderCart();
      showToast(`${product.name} added to cart`, 'success');

      // Pulse animation on cart icon
      if (cartToggle) {
        cartToggle.classList.add('cart-pulse');
        setTimeout(() => cartToggle.classList.remove('cart-pulse'), 300);
      }
    });

    // Stagger entrance
    requestAnimationFrame(() => {
      setTimeout(() => card.classList.add('visible'), 50 + index * 80);
    });

    return card;
  }

  // --- Home Page: Featured Grid ---
  const featuredGrid = $('#featuredGrid');
  if (featuredGrid) {
    const featured = engine.fetchFeatured();
    featured.forEach((product, i) => {
      featuredGrid.appendChild(createProductCard(product, i));
    });
  }

  // --- Products Page: Full Grid + Filters ---
  const productGrid = $('#productGrid');
  if (productGrid) {
    function renderProducts(category) {
      productGrid.innerHTML = '';
      const products = engine.fetchByCategory(category);
      products.forEach((product, i) => {
        productGrid.appendChild(createProductCard(product, i));
      });
    }

    renderProducts('all');

    const filterBtns = $$('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');
        renderProducts(btn.dataset.category);
      });
    });
  }

  // --- Hero Slider ---
  const heroSlides = $$('.hero__slide');
  const heroDots = $$('.hero__dot');

  if (heroSlides.length > 1) {
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      heroSlides.forEach(s => s.classList.remove('hero__slide--active'));
      heroDots.forEach(d => d.classList.remove('hero__dot--active'));
      heroSlides[index].classList.add('hero__slide--active');
      heroDots[index].classList.add('hero__dot--active');
      currentSlide = index;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }

    function startSlider() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(parseInt(dot.dataset.dot));
        startSlider();
      });
    });

    startSlider();
  }

  // --- Scroll Reveal ---
  const revealElements = $$('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Contact Form ---
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#contactName');
      const email = $('#contactEmail');
      const subject = $('#contactSubject');
      const message = $('#contactMessage');

      let valid = true;

      // Reset errors
      $$('.form-error').forEach(el => el.textContent = '');
      $$('.form-input').forEach(el => el.classList.remove('error'));

      if (name.value.trim().length < 2) {
        $('#nameError').textContent = 'Please enter your name';
        name.classList.add('error');
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        $('#emailError').textContent = 'Please enter a valid email';
        email.classList.add('error');
        valid = false;
      }

      if (message.value.trim().length < 10) {
        $('#messageError').textContent = 'Message must be at least 10 characters';
        message.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      showToast('Message sent! We will get back to you shortly.', 'success');
      contactForm.reset();
    });
  }

  // --- Newsletter Form ---
  const newsletterForm = $('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! Welcome to TEKLINIQ.', 'success');
      newsletterForm.reset();
    });
  }

  // --- Init ---
  updateCartBadge();
  renderCart();
});
