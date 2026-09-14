/* =========================================================
   Vimal Prasad — portfolio interactions
   Vanilla JS, no dependencies.
   Performance rules followed throughout:
     - IntersectionObserver instead of scroll listeners for reveals
     - the one scroll listener is rAF-throttled and passive
     - animations touch only transform / opacity / custom props
     - everything degrades gracefully if JS fails
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = $('#themeToggle');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- 2. Mobile menu ---------- */
  var burger = $('#burger');
  var navLinks = $('#navLinks');

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  var revealEls = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObs.unobserve(entry.target); // fire once, then stop watching
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });

    /* Safety net. A threshold-based observer can miss elements that are
       already on screen at load, that are taller than the viewport, or
       that are scrolled past during a programmatic / restored scroll.
       Anything at or above the fold is force-revealed so content can
       never be left stuck at opacity:0. */
    var sweep = function () {
      var vh = window.innerHeight || 0;
      revealEls.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95) {
          el.classList.add('is-in');
          revealObs.unobserve(el);
        }
      });
    };
    /* Run immediately on the next frame (covers deep links, restored
       scroll positions and anything already on screen at parse time),
       then again on load and shortly after for late layout shifts. */
    requestAnimationFrame(sweep);
    window.addEventListener('load', sweep);
    setTimeout(sweep, 400);

    /* Last-resort guarantee: whatever happens with observer timing,
       transitions or an unexpected browser quirk, all content is
       visible within 2.5s of load. Marketing copy must never be
       hidden behind an animation that did not fire. */
    setTimeout(function () {
      root.classList.add('reveals-off');
    }, 2500);
  }

  /* ---------- 4. Animated counters ---------- */
  var counters = $$('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) { el.textContent = target + suffix; return; }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- 5. Skill bars ---------- */
  var bars = $$('.bar i');
  if ('IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.getAttribute('data-w') + '%';
        barObs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barObs.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
  }

  /* ---------- 6. Card cursor glow ----------
     Writes two CSS custom properties. No layout reads in the
     handler: the rect is cached on pointerenter, not per-move. */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.card').forEach(function (card) {
      var rect = null;
      card.addEventListener('pointerenter', function () {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('pointermove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
      card.addEventListener('pointerleave', function () { rect = null; });
    });
  }

  /* ---------- 7. Portfolio filters ---------- */
  var filters = $$('.filter');
  var works = $$('.work');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');

      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      works.forEach(function (w) {
        var show = cat === 'all' || w.getAttribute('data-cat') === cat;
        w.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- 8. Testimonial rotator ---------- */
  var quotes = $$('.quote');
  var qdots  = $$('.qdot');
  var qIndex = 0;
  var qTimer = null;

  function showQuote(i) {
    qIndex = i;
    quotes.forEach(function (q, n) { q.classList.toggle('is-active', n === i); });
    qdots.forEach(function (d, n) { d.classList.toggle('is-active', n === i); });
  }

  function startQuotes() {
    if (reduceMotion || quotes.length < 2) return;
    stopQuotes();
    qTimer = setInterval(function () {
      showQuote((qIndex + 1) % quotes.length);
    }, 6500);
  }
  function stopQuotes() { if (qTimer) { clearInterval(qTimer); qTimer = null; } }

  qdots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { showQuote(i); startQuotes(); });
  });

  var quotesWrap = $('.quotes');
  if (quotesWrap) {
    quotesWrap.addEventListener('pointerenter', stopQuotes);
    quotesWrap.addEventListener('pointerleave', startQuotes);
  }

  // Pause the rotator when the tab is hidden — no background work.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopQuotes(); else startQuotes();
  });
  startQuotes();

  /* ---------- 9. Scroll-driven UI (rAF-throttled, passive) ---------- */
  var nav = $('#nav');
  var progress = $('#navProgress');
  var toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle('is-stuck', y > 20);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 10. Active nav link ---------- */
  var sections = $$('main section[id]');
  var navAnchors = $$('.nav__links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ---------- 11. Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
