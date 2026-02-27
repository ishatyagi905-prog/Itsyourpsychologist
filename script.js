/* ═══════════════════════════════════════════════════
   ITSYOURPSYCHOLOGIST – ISHA
   Antigravity Mindspace  |  script.js v4.0
   ═══════════════════════════════════════════════════ */
'use strict';

/* ───────────────────────────────
   1. DARK MODE TOGGLE
─────────────────────────────── */
(function () {
  const html = document.documentElement;
  const btn = document.getElementById('darkToggle');
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);

  btn && btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ───────────────────────────────
   2. NAVBAR – shadow + mobile
─────────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    tickScrollTop();
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks && navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ───────────────────────────────
   3. SMOOTH SCROLL
─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});

/* ───────────────────────────────
   4. SCROLL REVEAL
─────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

/* ───────────────────────────────
   5. PARTICLE CANVAS (Hero)
─────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 60;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 3.5 + 1;
      this.vx = (Math.random() - .5) * .4;
      this.vy = -(Math.random() * .6 + .2);
      this.alpha = Math.random() * .55 + .1;
      this.hue = Math.random() > .5 ? '#B76E79' : '#E8B7B1';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= .0006;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.hue;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // spread initially
    particles.push(p);
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
})();

/* ───────────────────────────────
   6. SCROLL TO TOP BUTTON
─────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

const tickScrollTop = () => {
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
};

scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ───────────────────────────────
   7. TESTIMONIAL SLIDER
─────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!cards.length) return;

  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'slider-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap && dotsWrap.appendChild(d);
  });

  const dots = () => dotsWrap ? dotsWrap.querySelectorAll('.slider-dot') : [];

  const goTo = (idx) => {
    cards[current].classList.remove('active');
    cards[current].classList.add('exit');
    setTimeout(() => cards[current].classList.remove('exit'), 600);
    current = (idx + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots().forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  nextBtn && nextBtn.addEventListener('click', () => { clearInterval(autoTimer); next(); autoTimer = setInterval(next, 5000); });
  prevBtn && prevBtn.addEventListener('click', () => { clearInterval(autoTimer); prev(); autoTimer = setInterval(next, 5000); });

  autoTimer = setInterval(next, 5000);

  // Pause on hover
  const slider = document.getElementById('testimonialsSlider');
  slider && slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider && slider.addEventListener('mouseleave', () => { autoTimer = setInterval(next, 5000); });

  // Adjust track height to tallest card
  const setHeight = () => {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    let max = 0;
    cards.forEach(c => { c.style.position = 'static'; const h = c.offsetHeight; c.style.position = ''; max = Math.max(max, h); });
    track.style.minHeight = max + 'px';
    const ctrl = document.querySelector('.slider-controls');
    if (ctrl) ctrl.style.marginTop = (max + 32) + 'px';
  };
  window.addEventListener('load', setHeight);
  window.addEventListener('resize', setHeight);
})();

/* ───────────────────────────────
   8. BOOKING FORM VALIDATION + POPUP
─────────────────────────────── */
(function () {
  const form = document.getElementById('bookingForm');
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  if (!form) return;

  // Set min date
  const dateEl = document.getElementById('preferredDate');
  if (dateEl) dateEl.min = new Date().toISOString().split('T')[0];

  const validators = {
    fullName: v => !v.trim() ? 'Please enter your full name.' : v.trim().length < 2 ? 'At least 2 characters.' : '',
    email: v => !v.trim() ? 'Please enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Invalid email address.' : '',
    phone: v => { const d = v.replace(/\D/g, ''); return !d ? 'Please enter your phone number.' : d.length !== 10 ? 'Enter a valid 10-digit number.' : ''; },
    sessionType: v => !v ? 'Please select a service.' : '',
    preferredDate: v => { if (!v) return 'Please select a date.'; const s = new Date(v), t = new Date(); t.setHours(0, 0, 0, 0); return s < t ? 'Please select a future date.' : ''; },
  };

  const showErr = (el, msg) => {
    const errEl = document.getElementById(el.id + 'Error') || el.closest('.form-group')?.querySelector('.field-error');
    if (errEl) errEl.textContent = msg;
    el.classList.toggle('error', !!msg);
  };

  const validateField = el => {
    const fn = validators[el.id];
    if (!fn) return true;
    const msg = fn(el.value);
    showErr(el, msg);
    return !msg;
  };

  Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(el); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(validators).forEach(id => {
      const el = document.getElementById(id);
      if (el && !validateField(el)) valid = false;
    });
    if (!valid) {
      const firstErr = form.querySelector('.error');
      if (firstErr) window.scrollTo({ top: firstErr.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      return;
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    form.reset();
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  });

  const closePopup = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };
  closeBtn && closeBtn.addEventListener('click', closePopup);
  overlay && overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
})();

/* ───────────────────────────────
   9. NEWSLETTER FORM
─────────────────────────────── */
(function () {
  const form = document.getElementById('newsletterForm');
  const thanks = document.getElementById('newsletterThanks');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = document.getElementById('nlEmail');
    if (!emailEl.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.style.borderColor = '#e07070';
      setTimeout(() => emailEl.style.borderColor = '', 2000);
      return;
    }
    form.style.display = 'none';
    if (thanks) thanks.classList.add('show');
  });
})();

/* ───────────────────────────────
   10. FREE RESOURCE POPUP
─────────────────────────────── */
window.showResourceThankYou = function (e) {
  e.preventDefault();
  const popup = document.getElementById('resourcePopup');
  if (!popup) return;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3500);
};

/* ───────────────────────────────
   11. BLOG CATEGORY FILTER
─────────────────────────────── */
(function () {
  const buttons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.blog-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

/* ───────────────────────────────
   12. ACTIVE NAV LINK on SCROLL
─────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 110) cur = sec.id; });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });
})();

/* ───────────────────────────────
   13. COOKIE BAR
─────────────────────────────── */
(function () {
  const bar = document.getElementById('cookieBar');
  const accept = document.getElementById('cookieAccept');
  if (!bar) return;
  if (!localStorage.getItem('cookieAccepted')) {
    setTimeout(() => bar.classList.add('show'), 1500);
  }
  accept && accept.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', '1');
    bar.classList.remove('show');
  });
})();

/* ───────────────────────────────
   14. BUTTON MICRO-INTERACTIONS
─────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', function () {
    this.style.transform = 'scale(0.96) translateY(0)';
  });
  btn.addEventListener('mouseup', function () { this.style.transform = ''; });
  btn.addEventListener('mouseleave', function () { this.style.transform = ''; });
});
