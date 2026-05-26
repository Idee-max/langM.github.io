/* ============================================================
   script.js — 个人网站交互逻辑（含双语切换）
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════
     1. LANGUAGE SWITCH  中文 ⇄ English
     ══════════════════════════════════════════════════ */
  let currentLang = 'cn';

  const btnCn  = document.getElementById('btnCn');
  const btnEn  = document.getElementById('btnEn');
  const htmlEl = document.getElementById('htmlRoot');
  const pageTitleEl = document.getElementById('pageTitle');
  const metaDescEl  = document.getElementById('metaDesc');

  const META = {
    cn: {
      title: '明朗 | 哲学博士候选人',
      desc:  '明朗（Lang Ming）的个人学术主页。斯图加特大学与雅典大学联合哲学博士候选人。',
    },
    en: {
      title: 'Lang Ming | PhD Candidate in Philosophy',
      desc:  'Personal academic website of Lang Ming (明朗). Joint PhD Candidate in Philosophy, University of Stuttgart & University of Athens.',
    },
  };

  function setLang(lang) {
    currentLang = lang;

    // ── html[lang] attribute
    htmlEl.lang = lang === 'cn' ? 'zh-CN' : 'en';

    // ── page title & meta description
    if (pageTitleEl) pageTitleEl.textContent = META[lang].title;
    if (metaDescEl)  metaDescEl.content      = META[lang].desc;

    // ── inline spans: .lang-cn / .lang-en
    document.querySelectorAll('.lang-cn, .lang-en').forEach(el => {
      const isCnEl = el.classList.contains('lang-cn');
      const show   = (lang === 'cn') ? isCnEl : !isCnEl;

      // Preserve the correct display type (inline vs block)
      if (show) {
        const tag = el.tagName.toLowerCase();
        const blockTags = ['div','p','ul','ol','section','header','footer'];
        el.style.display = blockTags.includes(tag) ? 'block' : 'inline';
      } else {
        el.style.display = 'none';
      }
    });

    // ── sections that only exist in Chinese
    document.querySelectorAll('.cn-only').forEach(el => {
      el.style.display = lang === 'cn' ? '' : 'none';
    });

    // ── active button state
    btnCn.classList.toggle('active', lang === 'cn');
    btnEn.classList.toggle('active', lang === 'en');

    // ── update form placeholders
    document.querySelectorAll('[data-placeholder-cn]').forEach(el => {
      el.placeholder = lang === 'cn'
        ? el.dataset.placeholderCn
        : el.dataset.placeholderEn;
    });

    // ── save preference
    try { localStorage.setItem('lang', lang); } catch(e) {}
  }

  btnCn.addEventListener('click', () => setLang('cn'));
  btnEn.addEventListener('click', () => setLang('en'));

  // Restore saved preference (default: cn)
  let savedLang = 'cn';
  try { savedLang = localStorage.getItem('lang') || 'cn'; } catch(e) {}
  setLang(savedLang);


  /* ══════════════════════════════════════════════════
     2. NAVBAR — scroll effect & active link
     ══════════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightNav();
  }

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ══════════════════════════════════════════════════
     3. MOBILE NAV TOGGLE
     ══════════════════════════════════════════════════ */
  const navToggle  = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });


  /* ══════════════════════════════════════════════════
     4. ANIMATE ON SCROLL (AOS)
     ══════════════════════════════════════════════════ */
  const animatedEls = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  animatedEls.forEach(el => observer.observe(el));

  // Failsafe: force visible after 3.5s
  setTimeout(() => animatedEls.forEach(el => el.classList.add('visible')), 3500);


  /* ══════════════════════════════════════════════════
     5. HERO ENTRANCE ANIMATION
     ══════════════════════════════════════════════════ */
  const heroEls = [
    '.hero-label',
    '.hero-name',
    '.hero-institution',
    '.hero-bio',
    '.hero-actions',
  ].map(sel => document.querySelector(sel)).filter(Boolean);

  heroEls.forEach((el, i) => {
    el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity .9s cubic-bezier(0.22,1,0.36,1),transform .9s cubic-bezier(0.22,1,0.36,1);';
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 150);
  });

  const photoWrap = document.querySelector('.hero-photo-wrap');
  if (photoWrap) {
    photoWrap.style.cssText += 'opacity:0;transition:opacity 1.2s ease;';
    setTimeout(() => { photoWrap.style.opacity = '1'; }, 200);
  }


  /* ══════════════════════════════════════════════════
     7. HERO PHOTO FALLBACK (SVG avatar if no image)
     ══════════════════════════════════════════════════ */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', () => {
      heroPhoto.style.display = 'none';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 200 200');
      svg.setAttribute('width',  '200');
      svg.setAttribute('height', '200');
      svg.style.cssText = 'border-radius:50%;border:1px solid rgba(201,169,110,0.3);';
      svg.innerHTML = `
        <circle cx="100" cy="100" r="100" fill="#1a1a1d"/>
        <circle cx="100" cy="82"  r="32"  fill="#2a2a2d"/>
        <ellipse cx="100" cy="160" rx="55" ry="40" fill="#2a2a2d"/>
        <text x="100" y="95" text-anchor="middle" font-family="Georgia,serif"
              font-size="36" fill="#c9a96e" font-weight="500">明</text>
      `;
      heroPhoto.parentElement.prepend(svg);
    });
  }

  /* ══════════════════════════════════════════════════
     8. THEME SWITCHER
     ══════════════════════════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // Restore saved theme (default: dark)
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch(e) {}
  setTheme(savedTheme);

});
