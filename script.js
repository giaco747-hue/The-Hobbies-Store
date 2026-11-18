/* ===================================================
   THE HOBBIES STORE – script.js
   Hamburger menu · Login modal · Shopping cart
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HAMBURGER MENU (OFF-CANVAS DRAWER) ---------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu      = document.getElementById('nav-menu');

  // Auto-create or get overlay
  let navOverlay = document.getElementById('nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.id = 'nav-overlay';
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  if (hamburgerBtn && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('nav-open');
      navMenu.classList.toggle('nav-open', isOpen);
      hamburgerBtn.classList.toggle('hamburger-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      if (navOverlay) {
        navOverlay.classList.toggle('overlay-open', isOpen);
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close button inside drawer
    navMenu.querySelectorAll('.drawer-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(false);
      });
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        toggleMenu(false);
      });
    }

    // Handle clicks on menu links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        if (!targetHref) return;

        // In-page anchor (e.g. #contacto)
        if (targetHref.startsWith('#')) {
          e.preventDefault();
          toggleMenu(false);
          const el = document.querySelector(targetHref);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // For page links, check if user clicked the page they are already on
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const targetPage = targetHref.split('/').pop().split('#')[0];

        if (currentPath.toLowerCase() === targetPage.toLowerCase()) {
          // Already on this page -> close the drawer
          toggleMenu(false);
        } else {
          // Navigating to another page: ensure body scroll is restored immediately
          document.body.style.overflow = '';
          // Let the browser follow the link naturally without interrupting
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('nav-open') &&
          !navMenu.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
        toggleMenu(false);
      }
    });
  }

  /* ---------- LOGIN MODAL ---------- */
  const loginBtn      = document.getElementById('login-btn');
  const loginModal    = document.getElementById('login-modal');
  const loginClose    = document.getElementById('login-close');
  const loginForm     = document.getElementById('login-form');
  const registerForm  = document.getElementById('register-form');
  const showRegister  = document.getElementById('show-register');
  const showLogin     = document.getElementById('show-login');
  const logoutBtn     = document.getElementById('logout-btn');
  const userNameSpan  = document.getElementById('user-name');

  function updateLoginUI() {
    const user = JSON.parse(localStorage.getItem('ths_user'));
    if (user && loginBtn) {
      loginBtn.innerHTML = '<i class="bi bi-person-check-fill"></i>';
      loginBtn.title = user.name;
      if (userNameSpan) userNameSpan.textContent = user.name;
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else if (loginBtn) {
      loginBtn.innerHTML = '<i class="bi bi-person-circle"></i>';
      loginBtn.title = 'Iniciar sesión';
      if (userNameSpan) userNameSpan.textContent = '';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('ths_user'));
      if (user) return; // already logged in
      loginModal.classList.add('modal-open');
    });

    loginClose.addEventListener('click', () => {
      loginModal.classList.remove('modal-open');
    });

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.classList.remove('modal-open');
    });
  }

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }

  // Register
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass  = document.getElementById('reg-pass').value;

      if (!name || !email || !pass) return alert('Completa todos los campos');

      // Save users list
      const users = JSON.parse(localStorage.getItem('ths_users') || '[]');
      if (users.find(u => u.email === email)) return alert('Este correo ya está registrado');
      users.push({ name, email, pass });
      localStorage.setItem('ths_users', JSON.stringify(users));

      // Auto-login
      localStorage.setItem('ths_user', JSON.stringify({ name, email }));
      loginModal.classList.remove('modal-open');
      updateLoginUI();
      alert('¡Cuenta creada exitosamente! Bienvenido, ' + name);
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value;

      const users = JSON.parse(localStorage.getItem('ths_users') || '[]');
      const user  = users.find(u => u.email === email && u.pass === pass);

      if (!user) return alert('Correo o contraseña incorrectos');

      localStorage.setItem('ths_user', JSON.stringify({ name: user.name, email: user.email }));
      loginModal.classList.remove('modal-open');
      updateLoginUI();
      alert('¡Bienvenido de nuevo, ' + user.name + '!');
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ths_user');
      updateLoginUI();
      alert('Sesión cerrada');
    });
  }

  updateLoginUI();

  /* ---------- SHOPPING CART ---------- */
  const cartBtn   = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotal = document.getElementById('cart-total');
  const cartClear = document.getElementById('cart-clear');

  function getCart() {
    return JSON.parse(localStorage.getItem('ths_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('ths_cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = total;
      cartBadge.style.display = total > 0 ? 'flex' : 'none';
    }
  }

  function renderCart() {
    if (!cartItems) return;
    const cart = getCart();

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
      if (cartTotal) cartTotal.textContent = '';
      return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <span>\$${item.price.toFixed(2)} x ${item.qty}</span>
          </div>
          <div class="cart-item-actions">
            <button class="cart-qty-btn" data-action="minus" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="cart-qty-btn" data-action="plus" data-index="${index}">+</button>
            <button class="cart-remove-btn" data-index="${index}">✕</button>
          </div>
        </div>`;
    });

    cartItems.innerHTML = html;
    if (cartTotal) cartTotal.textContent = `Total: \$${total.toFixed(2)}`;

    // Quantity buttons
    cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart();
        const idx  = parseInt(btn.dataset.index);
        if (btn.dataset.action === 'plus') {
          cart[idx].qty++;
        } else {
          cart[idx].qty--;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
      });
    });

    // Remove buttons
    cartItems.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart();
        cart.splice(parseInt(btn.dataset.index), 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  if (cartBtn && cartPanel) {
    cartBtn.addEventListener('click', () => {
      cartPanel.classList.add('cart-open');
      renderCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', () => {
      cartPanel.classList.remove('cart-open');
    });
  }

  if (cartClear) {
    cartClear.addEventListener('click', () => {
      localStorage.removeItem('ths_cart');
      updateCartBadge();
      renderCart();
    });
  }

  // Close cart panel on outside click
  if (cartPanel) {
    document.addEventListener('click', (e) => {
      if (cartPanel.classList.contains('cart-open') &&
          !cartPanel.contains(e.target) &&
          !e.target.closest('#cart-btn')) {
        cartPanel.classList.remove('cart-open');
      }
    });
  }

  updateCartBadge();

  /* ---------- ADD TO CART (buy buttons) ---------- */
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card-rc') || btn.closest('.featured-card');
      if (!card) return;

      const name  = card.querySelector('h2')?.textContent.trim() || 'Producto';
      const priceEl = card.querySelector('.product-price');
      const price = priceEl ? parseFloat(priceEl.dataset.price) : 99.99;

      const cart = getCart();
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      saveCart(cart);

      // Visual feedback
      btn.textContent = '✓ Agregado';
      btn.style.background = '#00c853';
      setTimeout(() => {
        btn.textContent = 'Comprar';
        btn.style.background = '';
      }, 1200);
    });
  });

});
