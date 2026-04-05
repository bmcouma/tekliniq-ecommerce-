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

  // --- Modal Logic ---
  const modal = $('#productModal');
  const modalClose = $('#modalClose');
  const modalOverlay = $('#modalOverlay');

  function openModal(productId) {
    const product = engine.getProductById(productId);
    if (!product || !modal) return;

    $('#modalImage').src = product.image;
    $('#modalImage').alt = product.name;
    $('#modalCategory').textContent = product.category;
    $('#modalTitle').textContent = product.name;
    $('#modalPrice').textContent = '$' + product.price;
    $('#modalDesc').textContent = product.description;

    const addBtn = $('#modalAddToCart');
    addBtn.onclick = () => {
      engine.addToCart(product.id);
      updateCartBadge();
      renderCart();
      showToast(`${product.name} added to cart`);
      closeModal();
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

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
        <div class="cart-item">
          <div class="cart-item__image">
            <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
          </div>
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

    if (totalEl) totalEl.textContent = '$' + engine.getCartTotal().toLocaleString();

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

  // --- Product Card Builder ---
  function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.transitionDelay = (index * 0.05) + 's';

    card.innerHTML = `
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-card__overlay">
          <button class="product-card__quick-view" data-view-id="${product.id}">Quick View</button>
        </div>
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

    // Quick view click
    card.querySelector('[data-view-id]').addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(product.id);
    });

    // Add to cart click
    card.querySelector('.product-card__add').addEventListener('click', (e) => {
      e.stopPropagation();
      engine.addToCart(product.id);
      updateCartBadge();
      renderCart();
      showToast(`${product.name} added to cart`);
      
      if (cartToggle) {
        cartToggle.classList.add('cart-pulse');
        setTimeout(() => cartToggle.classList.remove('cart-pulse'), 300);
      }
    });

    return card;
  }

  // --- Grid Management (Filter, Search, Sort) ---
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';

  function updateGrid() {
    const grid = $('#productGrid') || $('#featuredGrid');
    if (!grid) return;

    let products = engine.fetchByCategory(currentCategory);

    // Search
    if (searchQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (currentSort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'newest') {
      products.sort((a, b) => b.id.localeCompare(a.id));
    }

    grid.innerHTML = '';
    products.forEach((p, i) => {
      grid.appendChild(createProductCard(p, i));
    });

    // Re-trigger scroll reveal since content is new
    initReveal();
  }

  // --- Event Listeners ---
  const searchInput = $('#searchProducts');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateGrid();
    });
  }

  const sortSelect = $('#sortProducts');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      updateGrid();
    });
  }

  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      currentCategory = btn.dataset.category;
      updateGrid();
    });
  });

  // --- Scroll Reveal ---
  function initReveal() {
    const revealElements = $$('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
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

    function nextSlide() { goToSlide((currentSlide + 1) % heroSlides.length); }
    function startSlider() { slideInterval = setInterval(nextSlide, 5000); }

    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(parseInt(dot.dataset.dot));
        startSlider();
      });
    });

    startSlider();
  }

  // --- Contact & Newsletter ---
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Inquiry received. A TEKLINIQ specialist will contact you shortly.', 'success');
      contactForm.reset();
    });
  }

  const newsletterForm = $('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to the inner circle.', 'success');
      newsletterForm.reset();
    });
  }

  // --- Init ---
  updateGrid();
  updateCartBadge();
  renderCart();
  initReveal();
});
