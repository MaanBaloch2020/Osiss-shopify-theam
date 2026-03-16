/* ══════════════════════════════════════════════════════════════
   OSISS™ — theme.js
   Shopify OS 2.0 Theme JavaScript
   Brand: Osiss | Dermatology-Driven Skincare | Pakistan
══════════════════════════════════════════════════════════════ */
'use strict';

/* ══ CONSTANTS ══════════════════════════════════════════════ */
const FREE_SHIP = 2000;
const STD_SHIP  = 250;
const WA_NUM    = '923021345111';
const CURRENCY  = 'PKR';

/* ══ CART STATE ══════════════════════════════════════════════ */
let cartItems   = [];
let wishlist    = [];
let activePromo = null;

const PROMOS = {
  'OSISS10':  { type:'pct',  value:10,  label:'10% off' },
  'WELCOME':  { type:'flat', value:200, label:'PKR 200 off' },
  'FREESHIP': { type:'ship', value:0,   label:'Free Shipping' },
};

/* ══ UTILITY HELPERS ════════════════════════════════════════ */
function fmt(n) { return CURRENCY + ' ' + n.toLocaleString(); }
function pad(n) { return String(n).padStart(2,'0'); }

/* ══ DRAWER NAV ══════════════════════════════════════════════ */
function openDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  const panel   = document.getElementById('drawerPanel');
  const btn     = document.getElementById('burgerBtn');
  if (!overlay || !panel) return;
  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  const panel   = document.getElementById('drawerPanel');
  const btn     = document.getElementById('burgerBtn');
  if (!overlay || !panel) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  panel.classList.remove('open');
  document.body.style.overflow = '';
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleDrawerCat(id) {
  const sub = document.getElementById(id);
  const btn = sub ? sub.previousElementSibling : null;
  if (!sub) return;
  const isOpen = sub.classList.contains('open');
  document.querySelectorAll('.drawer-subcat').forEach(el => {
    el.classList.remove('open');
    el.hidden = true;
  });
  document.querySelectorAll('.drawer-cat-btn').forEach(el => {
    el.classList.remove('open');
    el.setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    sub.classList.add('open');
    sub.hidden = false;
    if (btn) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }
}

/* ══ CART PANEL ══════════════════════════════════════════════ */
function openCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel   = document.getElementById('cartPanel');
  if (!overlay || !panel) return;
  overlay.classList.add('open');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel   = document.getElementById('cartPanel');
  if (!overlay || !panel) return;
  overlay.classList.remove('open');
  panel.classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(productId, name, sub, price, svgHtml) {
  const existing = cartItems.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ id: productId, name, sub, price, svg: svgHtml, qty: 1 });
  }
  updateCartBadge();
  openCart();
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(i => i.id !== productId);
  updateCartBadge();
  renderCart();
}

function changeQty(productId, delta) {
  const item = cartItems.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  badge.textContent = total;
  badge.classList.toggle('show', total > 0);
}

function cartSubtotal() {
  return cartItems.reduce((s, i) => s + i.price * i.qty, 0);
}

function renderCart() {
  const body    = document.getElementById('cartBody');
  const foot    = document.getElementById('cartFoot');
  const prog    = document.getElementById('shipProg');
  if (!body) return;

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg class="cart-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p class="cart-empty-txt">Your cart is empty</p>
        <p class="cart-empty-sub">Add some products to get started</p>
      </div>`;
    if (foot) foot.style.display = 'none';
    if (prog) prog.style.display = 'none';
    return;
  }

  body.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">${item.svg || '<svg width="30" height="30"><use href="#ico-bag"/></svg>'}</div>
      <div class="cart-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-sub">${item.sub}</p>
        <p class="ci-price">${fmt(item.price * item.qty)}</p>
        <div class="qty-ctrl">
          <button class="qbtn" onclick="changeQty('${item.id}',-1)" aria-label="Decrease quantity">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span class="qnum" aria-live="polite">${item.qty}</span>
          <button class="qbtn" onclick="changeQty('${item.id}',1)" aria-label="Increase quantity">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      <button class="cart-rm" onclick="removeFromCart('${item.id}')" aria-label="Remove ${item.name}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');

  const sub  = cartSubtotal();
  let discount = 0;
  let shipFee  = sub >= FREE_SHIP ? 0 : STD_SHIP;

  if (activePromo) {
    if (activePromo.type === 'pct')  discount = Math.round(sub * activePromo.value / 100);
    if (activePromo.type === 'flat') discount = Math.min(activePromo.value, sub);
    if (activePromo.type === 'ship') shipFee  = 0;
  }

  const total = sub - discount + shipFee;

  if (foot) {
    foot.style.display = 'block';
    document.getElementById('cartSubtotal').textContent = fmt(sub);
    document.getElementById('cartShipping').textContent = shipFee === 0 ? 'FREE' : fmt(shipFee);
    document.getElementById('cartTotal').textContent    = fmt(total);
  }

  if (prog) {
    prog.style.display = 'block';
    const remaining = Math.max(0, FREE_SHIP - sub);
    const pct = Math.min(100, (sub / FREE_SHIP) * 100);
    const fill = document.getElementById('progFill');
    const msg  = document.getElementById('progMsg');
    if (fill) fill.style.width = pct + '%';
    if (msg) {
      if (remaining === 0) {
        msg.textContent = '🎉 You\'ve unlocked FREE SHIPPING!';
        msg.classList.add('unlocked');
        if (fill) fill.classList.add('done');
      } else {
        msg.textContent = `Add ${fmt(remaining)} more for FREE SHIPPING`;
        msg.classList.remove('unlocked');
        if (fill) fill.classList.remove('done');
      }
    }
  }
}/* ══ WISHLIST ════════════════════════════════════════════════ */
function openWishlist() {
  const ov    = document.getElementById('wlOverlay');
  const panel = document.getElementById('wlPanel');
  if (!ov || !panel) return;
  ov.classList.add('open');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderWishlist();
}

function closeWishlist() {
  const ov    = document.getElementById('wlOverlay');
  const panel = document.getElementById('wlPanel');
  if (!ov || !panel) return;
  ov.classList.remove('open');
  panel.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleWishlist(productId, name, price, svgHtml) {
  const idx = wishlist.findIndex(i => i.id === productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push({ id: productId, name, price, svg: svgHtml });
  }
}

function renderWishlist() {
  const body = document.getElementById('wlBody');
  if (!body) return;
  if (wishlist.length === 0) {
    body.innerHTML = `<div style="padding:40px 0;text-align:center">
      <p style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#aaa;text-transform:uppercase">Your wishlist is empty</p>
      <p style="font-size:10px;color:#ccc;margin-top:8px">Save products you love here</p>
    </div>`;
    return;
  }
  body.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">${item.svg || ''}</div>
      <div class="cart-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">${fmt(item.price)}</p>
        <button class="btn-atc" style="margin:6px 0 0;width:auto;padding:7px 16px" onclick="addToCart('${item.id}','${item.name}','',${item.price},'${item.svg || ''}')">ADD TO CART</button>
      </div>
      <button class="cart-rm" onclick="wishlist=wishlist.filter(i=>i.id!=='${item.id}');renderWishlist()" aria-label="Remove from wishlist">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

/* ══ REVIEWS SLIDER ══════════════════════════════════════════ */
function initSlider(trackId, dotsId, prevId, nextId, perView) {
  const track = document.getElementById(trackId);
  const dotsEl = document.getElementById(dotsId);
  if (!track) return;
  const cards    = Array.from(track.children);
  const total    = cards.length;
  if (total === 0) return;
  let current    = 0;
  const visible  = perView || (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - visible));
    const cardW = cards[0].offsetWidth + 14;
    track.style.transform = `translateX(-${current * cardW}px)`;
    if (dotsEl) {
      Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }

  if (dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= total - visible; i++) {
      const d = document.createElement('button');
      d.className = 'sl-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
}

/* ══ SALE COUNTDOWN ══════════════════════════════════════════ */
function initSaleCountdown() {
  const SALE_KEY = 'osiss_sale_end';
  let saleEnd = parseInt(sessionStorage.getItem(SALE_KEY) || '0');
  const now = Date.now();
  if (!saleEnd || saleEnd < now) {
    saleEnd = now + (47 * 3600 + 59 * 60) * 1000;
    sessionStorage.setItem(SALE_KEY, saleEnd);
  }

  function tickSale() {
    const diff = Math.max(0, saleEnd - Date.now());
    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    const hhEl = document.getElementById('saleHH');
    const mmEl = document.getElementById('saleMM');
    const ssEl = document.getElementById('saleSS');
    if (!hhEl) return;
    if (hhEl.textContent !== pad(hh)) {
      hhEl.textContent = pad(hh);
      hhEl.classList.add('flip');
      setTimeout(() => hhEl.classList.remove('flip'), 300);
    }
    if (mmEl.textContent !== pad(mm)) {
      mmEl.textContent = pad(mm);
      mmEl.classList.add('flip');
      setTimeout(() => mmEl.classList.remove('flip'), 300);
    }
    if (ssEl) ssEl.textContent = pad(ss);
    if (diff <= 0) {
      saleEnd = Date.now() + (47 * 3600 + 59 * 60) * 1000;
      sessionStorage.setItem(SALE_KEY, saleEnd);
    }
  }
  tickSale();
  setInterval(tickSale, 1000);
}/* ══ SHOPIFY AJAX CART INTEGRATION ══════════════════════════ */
function initShopifyCart() {
  document.querySelectorAll('[data-type="add-to-cart-form"]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-atc');
      if (btn) { btn.textContent = 'ADDING...'; btn.disabled = true; }

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (!response.ok) throw new Error('Cart add failed');
        await refreshShopifyCart();
        openCart();
      } catch (err) {
        console.error('Add to cart error:', err);
        if (btn) btn.textContent = 'ERROR — TRY AGAIN';
      } finally {
        if (btn) { btn.textContent = 'ADD TO CART'; btn.disabled = false; }
      }
    });
  });
}

async function refreshShopifyCart() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    updateShopifyCartUI(cart);
  } catch (err) {
    console.error('Cart refresh error:', err);
  }
}

function updateShopifyCartUI(cart) {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cart.item_count;
    badge.classList.toggle('show', cart.item_count > 0);
  }

  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body) return;

  if (cart.items.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <svg class="cart-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      <p class="cart-empty-txt">Your cart is empty</p>
    </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  body.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">
        ${item.image ? `<img src="${item.image}" alt="${item.product_title}" loading="lazy">` : ''}
      </div>
      <div class="cart-info">
        <p class="ci-name">${item.product_title}</p>
        <p class="ci-sub">${item.variant_title !== 'Default Title' ? item.variant_title : ''}</p>
        <p class="ci-price">${CURRENCY} ${(item.final_line_price / 100).toLocaleString()}</p>
        <div class="qty-ctrl">
          <button class="qbtn" onclick="shopifyChangeQty(${item.variant_id}, ${item.quantity - 1})" aria-label="Decrease quantity">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span class="qnum">${item.quantity}</span>
          <button class="qbtn" onclick="shopifyChangeQty(${item.variant_id}, ${item.quantity + 1})" aria-label="Increase quantity">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      <button class="cart-rm" onclick="shopifyChangeQty(${item.variant_id}, 0)" aria-label="Remove item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');

  const subtotal = cart.total_price / 100;
  const shipFee  = subtotal >= FREE_SHIP ? 0 : STD_SHIP;
  const total    = subtotal + shipFee;

  if (foot) {
    foot.style.display = 'block';
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl    = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = `${CURRENCY} ${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipFee === 0 ? 'FREE' : `${CURRENCY} ${shipFee}`;
    if (totalEl)    totalEl.textContent    = `${CURRENCY} ${total.toLocaleString()}`;
  }

  const prog = document.getElementById('shipProg');
  if (prog) {
    prog.style.display = 'block';
    const remaining = Math.max(0, FREE_SHIP - subtotal);
    const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);
    const fill = document.getElementById('progFill');
    const msg  = document.getElementById('progMsg');
    if (fill) { fill.style.width = pct + '%'; fill.classList.toggle('done', remaining === 0); }
    if (msg) {
      msg.textContent = remaining === 0
        ? "🎉 You've unlocked FREE SHIPPING!"
        : `Add ${CURRENCY} ${remaining.toLocaleString()} more for FREE SHIPPING`;
      msg.classList.toggle('unlocked', remaining === 0);
    }
  }
}

async function shopifyChangeQty(variantId, qty) {
  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: qty })
    });
    await refreshShopifyCart();
  } catch (err) {
    console.error('Qty change error:', err);
  }
}

/* ══ DOM INIT ════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  /* Drawer */
  const burgerBtn = document.getElementById('burgerBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  if (burgerBtn)     burgerBtn.addEventListener('click', openDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  /* Cart */
  const cartOpenBtn    = document.getElementById('cartOpenBtn');
  const cartCloseBtn   = document.getElementById('cartCloseBtn');
  const cartContinueBtn = document.getElementById('cartContinueBtn');
  const cartOverlay    = document.getElementById('cartOverlay');
  const checkoutBtn    = document.getElementById('checkoutBtn');
  if (cartOpenBtn)     cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn)    cartCloseBtn.addEventListener('click', closeCart);
  if (cartContinueBtn) cartContinueBtn.addEventListener('click', closeCart);
  if (cartOverlay)     cartOverlay.addEventListener('click', closeCart);
  if (checkoutBtn)     checkoutBtn.addEventListener('click', () => { window.location.href = '/checkout'; });

  /* Wishlist */
  const wishlistBtn = document.getElementById('wishlistBtn');
  const wlOverlay   = document.getElementById('wlOverlay');
  const wlClose     = document.getElementById('wlClose');
  if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlist);
  if (wlOverlay)   wlOverlay.addEventListener('click', closeWishlist);
  if (wlClose)     wlClose.addEventListener('click', closeWishlist);

  /* ESC key closes all panels */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCart();
      closeDrawer();
      closeWishlist();
    }
  });

  /* Sale Countdown */
  initSaleCountdown();

  /* Sliders */
  initSlider('rvTrack', 'rvDots', 'rvPrev', 'rvNext');

  /* Shopify AJAX Cart */
  initShopifyCart();

  /* Load initial Shopify cart state */
  refreshShopifyCart();

});/* ══════════════════════════════════════════════════════════════
   ADDITIONAL JS — Quick View · Blog/BNA Sliders · Concern Row
══════════════════════════════════════════════════════════════ */

/* ══ QUICK VIEW ══════════════════════════════════════════════ */
let qvQty = 1;
let qvVariantId = null;

function openQuickView(productHandle) {
  const overlay = document.getElementById('qvOverlay');
  const content = document.getElementById('qvContent');
  const loading = document.getElementById('qvLoading');
  if (!overlay) return;

  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  qvQty = 1;

  if (content) content.style.display = 'none';
  if (loading) loading.style.display = 'flex';

  fetch(`/products/${productHandle}.js`)
    .then(r => r.json())
    .then(product => populateQuickView(product))
    .catch(err => {
      console.error('Quick view load error:', err);
      if (loading) loading.innerHTML = '<p style="color:#e44">Could not load product.</p>';
    });
}

function populateQuickView(product) {
  const content = document.getElementById('qvContent');
  const loading = document.getElementById('qvLoading');
  if (!content) return;

  const variant = product.variants[0];
  qvVariantId   = variant.id;

  const imgWrap = document.getElementById('qvImgWrap');
  if (imgWrap && product.images.length > 0) {
    imgWrap.innerHTML = `<img src="${product.images[0]}" alt="${product.title}" style="width:100%;height:100%;object-fit:contain">`;
  }

  const thumbs = document.getElementById('qvThumbs');
  if (thumbs && product.images.length > 1) {
    thumbs.innerHTML = product.images.slice(0, 6).map((img, i) =>
      `<div class="qv-thumb ${i === 0 ? 'active' : ''}" onclick="qvSelectImg(this, '${img}')">
        <img src="${img}" alt="Product image ${i+1}" loading="lazy">
      </div>`
    ).join('');
  }

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('qvType',  product.type || '');
  setEl('qvTitle', product.title);
  setEl('qvPrice', `PKR ${(variant.price / 100).toLocaleString()}`);

  if (variant.compare_at_price > variant.price) {
    setEl('qvOrigPrice', `PKR ${(variant.compare_at_price / 100).toLocaleString()}`);
    const pct = Math.round((variant.compare_at_price - variant.price) / variant.compare_at_price * 100);
    setEl('qvSavings', `${pct}% OFF`);
  }

  const descEl = document.getElementById('qvDesc');
  if (descEl) descEl.innerHTML = product.description.substring(0, 300) + (product.description.length > 300 ? '…' : '');

  const variantsEl = document.getElementById('qvVariants');
  if (variantsEl && product.variants.length > 1) {
    variantsEl.innerHTML = product.variants.map(v =>
      `<button class="qv-variant-btn ${v.id === qvVariantId ? 'active' : ''}"
        onclick="qvSelectVariant(this, ${v.id}, ${v.price})">${v.title}</button>`
    ).join('');
  }

  const viewFull = document.getElementById('qvViewFull');
  if (viewFull) viewFull.href = `/products/${product.handle}`;

  document.getElementById('qvQtyMinus')?.addEventListener('click', () => {
    if (qvQty > 1) { qvQty--; setEl('qvQtyNum', qvQty); }
  });
  document.getElementById('qvQtyPlus')?.addEventListener('click', () => {
    qvQty++;
    setEl('qvQtyNum', qvQty);
  });

  const atcBtn = document.getElementById('qvAtcBtn');
  if (atcBtn) {
    atcBtn.onclick = async () => {
      atcBtn.textContent = 'ADDING...';
      atcBtn.disabled = true;
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: qvVariantId, quantity: qvQty })
        });
        await refreshShopifyCart();
        closeQuickView();
        setTimeout(openCart, 200);
      } catch(e) { atcBtn.textContent = 'ERROR'; }
      finally { atcBtn.textContent = 'ADD TO CART'; atcBtn.disabled = false; }
    };
  }

  if (loading) loading.style.display = 'none';
  content.style.display = 'block';
}

function qvSelectImg(el, imgSrc) {
  const wrap = document.getElementById('qvImgWrap');
  if (wrap) wrap.innerHTML = `<img src="${imgSrc}" alt="Product image" style="width:100%;height:100%;object-fit:contain">`;
  document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function qvSelectVariant(el, variantId, price) {
  qvVariantId = variantId;
  document.querySelectorAll('.qv-variant-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const priceEl = document.getElementById('qvPrice');
  if (priceEl) priceEl.textContent = `PKR ${(price / 100).toLocaleString()}`;
}

function closeQuickView() {
  const overlay = document.getElementById('qvOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ══ INIT ALL SLIDERS ON PAGE LOAD ══════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initSlider('bnaTrack', 'bnaDots', 'bnaPrev', 'bnaNext');
  initSlider('blogTrack', 'blogDots', 'blogPrev', 'blogNext');

  const qvOv = document.getElementById('qvOverlay');
  if (qvOv) {
    qvOv.addEventListener('click', function(e) {
      if (e.target === this) closeQuickView();
    });
  }
  const qvClose = document.getElementById('qvClose');
  if (qvClose) qvClose.addEventListener('click', closeQuickView);
});
