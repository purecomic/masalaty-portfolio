/* ============================================================
   KINGSLEY WEB STUDIO — Main Site Script
   ============================================================ */

(() => {
  'use strict';

  /* ── Navbar scroll glass ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── Active nav on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll('.section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pricing-card, .project-card, .skill-item, .contact-item').forEach((el, i) => {
          el.style.transitionDelay = `${i * 0.08}s`;
          el.classList.add('reveal', 'visible');
        });
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(s => revealObserver.observe(s));

  /* ── Parallax shapes ── */
  const shapes = document.querySelectorAll('.shape');
  const isDesktop = window.innerWidth >= 900;
  if (isDesktop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      shapes.forEach((shape, i) => {
        shape.style.transform = `translateY(${window.scrollY * (i % 2 === 0 ? 0.07 : 0.04) * (i + 1)}px)`;
      });
    }, { passive: true });
  }

  /* ── Contact form → WhatsApp ── */
  window.handleContactForm = function(e) {
    e.preventDefault();
    const form    = e.target;
    const name    = form.querySelector('input[type="text"]').value;
    const phone   = form.querySelector('input[type="tel"]').value;
    const service = form.querySelector('select').value;
    const details = form.querySelector('textarea').value;

    const wa = localStorage.getItem('kws_whatsapp') || '2348024531430';
    const msg = `Hi Kingsley! I found you on your portfolio.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A%0A*Project Details:*%0A${encodeURIComponent(details)}`;
    window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
  };

  /* ── Load admin content edits from localStorage ── */
  const saved = {
    about_title: localStorage.getItem('kws_about_title'),
    bio1:        localStorage.getItem('kws_bio1'),
    bio2:        localStorage.getItem('kws_bio2'),
    whatsapp:    localStorage.getItem('kws_whatsapp'),
  };

  if (saved.about_title) {
    const el = document.getElementById('about-title');
    if (el) el.textContent = saved.about_title;
  }
  if (saved.bio1) {
    const el = document.getElementById('about-bio');
    if (el) el.textContent = saved.bio1;
  }
  if (saved.bio2) {
    const el = document.getElementById('about-bio2');
    if (el) el.textContent = saved.bio2;
  }

  /* Load saved services */
  const savedServices = localStorage.getItem('kws_services');
  if (savedServices) {
    try {
      const services = JSON.parse(savedServices);
      const grid = document.getElementById('pricing-grid');
      if (grid) {
        grid.innerHTML = services.map((s, i) => `
          <div class="pricing-card ${i === 1 ? 'pricing-popular' : ''}">
            ${i === 1 ? '<div class="popular-badge">Most Popular</div>' : ''}
            <div class="pricing-icon">${s.icon}</div>
            <h3 class="pricing-name">${s.name}</h3>
            <p class="pricing-desc">${s.desc}</p>
            <div class="pricing-price"><span class="price-currency">₦</span>${Number(s.price).toLocaleString()}<span class="price-suffix">+</span></div>
            <ul class="pricing-features">${s.features.split('\n').filter(f=>f.trim()).map(f=>`<li>✓ ${f.trim()}</li>`).join('')}</ul>
            <a href="#contact" class="btn ${i===1?'btn-primary':'btn-outline'}" style="width:100%;justify-content:center;">Get Started</a>
          </div>
        `).join('');
      }
    } catch(e) {}
  }

  /* Load saved projects */
  const savedProjects = localStorage.getItem('kws_projects');
  if (savedProjects) {
    try {
      const projects = JSON.parse(savedProjects);
      const grid = document.getElementById('projects-grid');
      if (grid) {
        grid.innerHTML = projects.map(p => `
          <div class="project-card">
            <div class="project-img-wrap">
              <div class="project-placeholder" style="background:linear-gradient(135deg,${p.color1||'#1e3a5f'},${p.color2||'#3B82F6'})">
                <span>${p.icon||'💻'}</span>
              </div>
            </div>
            <div class="project-body">
              <span class="project-tag">${p.tag}</span>
              <h3 class="project-name">${p.name}</h3>
              <p class="project-desc">${p.desc}</p>
              <div class="project-links">
                ${p.live ? `<a href="${p.live}" target="_blank" class="btn btn-primary btn-sm">Live Site</a>` : ''}
                ${p.github ? `<a href="${p.github}" target="_blank" class="btn btn-outline btn-sm">GitHub</a>` : ''}
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch(e) {}
  }

  console.log('%c Kingsley Web Studio ', 'background:#3B82F6;color:#fff;font-size:14px;font-weight:700;padding:4px 10px;border-radius:4px;');
})();
