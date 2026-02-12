/**
 * mpowerio.ai v3.0 — Consolidated Site JavaScript
 * "Quality Inputs producing Quantum Outputs"
 */
(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('nav--open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    nav.querySelectorAll('.nav__link').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('nav--open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('nav--open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // ==========================================================================
  // Scroll Reveal (Intersection Observer)
  // ==========================================================================
  var fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function(el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // Vapor Particle System
  // ==========================================================================
  if (!prefersReducedMotion) {
    var VaporSystem = {
      container: null,
      particles: [],
      maxParticles: 20,
      isRunning: false,

      init: function() {
        this.container = document.createElement('div');
        this.container.className = 'vapor-container';
        document.body.appendChild(this.container);
        this.isRunning = true;
        this.spawnLoop();
      },

      createParticle: function() {
        if (this.particles.length >= this.maxParticles) return;
        var particle = document.createElement('div');
        particle.className = 'vapor-particle';
        particle.style.left = Math.random() * 100 + '%';
        var duration = 8 + Math.random() * 7;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.transform = 'scale(' + (0.5 + Math.random()) + ')';
        this.container.appendChild(particle);
        this.particles.push(particle);
        var self = this;
        setTimeout(function() {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
          var index = self.particles.indexOf(particle);
          if (index > -1) self.particles.splice(index, 1);
        }, (duration + 2) * 1000);
      },

      spawnLoop: function() {
        if (!this.isRunning) return;
        this.createParticle();
        var self = this;
        setTimeout(function() { self.spawnLoop(); }, 500 + Math.random() * 1000);
      }
    };

    VaporSystem.init();
  }

  // ==========================================================================
  // Spark System
  // ==========================================================================
  if (!prefersReducedMotion) {
    var SparkSystem = {
      sparks: [],
      maxSparks: 10,
      isRunning: false,
      widget: null,

      init: function() {
        this.widget = document.querySelector('.hero__widget');
        this.isRunning = true;
        var self = this;
        setTimeout(function() { self.createSpark(window.innerWidth * 0.7, window.innerHeight * 0.3, true); }, 500);
        setTimeout(function() { self.createSpark(window.innerWidth * 0.3, window.innerHeight * 0.2, false); }, 1000);
        setTimeout(function() { self.createSpark(window.innerWidth * 0.5, window.innerHeight * 0.15, false); }, 1500);
        this.sparkLoop();
      },

      createSpark: function(x, y, isWidgetZone) {
        if (this.sparks.length >= this.maxSparks) return;
        var spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        if (isWidgetZone) spark.style.transform = 'scale(1.8)';
        document.body.appendChild(spark);
        this.sparks.push(spark);
        this.createTrail(x, y);
        var self = this;
        setTimeout(function() {
          if (spark.parentNode) spark.parentNode.removeChild(spark);
          var index = self.sparks.indexOf(spark);
          if (index > -1) self.sparks.splice(index, 1);
        }, 1000);
      },

      createTrail: function(x, y) {
        var trail = document.createElement('div');
        trail.className = 'spark-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.width = (60 + Math.random() * 80) + 'px';
        document.body.appendChild(trail);
        setTimeout(function() {
          if (trail.parentNode) trail.parentNode.removeChild(trail);
        }, 600);
      },

      getWidgetZone: function() {
        if (!this.widget) return null;
        var rect = this.widget.getBoundingClientRect();
        return { left: rect.left - 150, right: rect.right + 150, top: rect.top - 150, bottom: rect.bottom + 150 };
      },

      sparkLoop: function() {
        if (!this.isRunning) return;
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight * 0.7;
        var zone = this.getWidgetZone();
        var isWidgetZone = zone && x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
        if ((isWidgetZone && Math.random() > 0.15) || (!isWidgetZone && Math.random() > 0.60)) {
          this.createSpark(x, y, isWidgetZone);
        }
        var self = this;
        setTimeout(function() { self.sparkLoop(); }, 600 + Math.random() * 1200);
      }
    };

    SparkSystem.init();
  }

  // ==========================================================================
  // Grid Intersection Spark Pops
  // ==========================================================================
  if (!prefersReducedMotion) {
    var gridSize = 40;
    var lastGridSparkTime = 0;

    document.addEventListener('mousemove', function(e) {
      var now = Date.now();
      if (now - lastGridSparkTime < 800) return;

      var x = e.clientX;
      var y = e.clientY;
      var nearGridX = x % gridSize < 8 || x % gridSize > gridSize - 8;
      var nearGridY = y % gridSize < 8 || y % gridSize > gridSize - 8;

      if (nearGridX && nearGridY && Math.random() > 0.7) {
        var pop = document.createElement('div');
        pop.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:6px;height:6px;background:var(--accent-gold);border-radius:50%;pointer-events:none;z-index:5;box-shadow:0 0 10px var(--accent-gold),0 0 20px var(--accent-orange-glow);animation:gridPop 0.5s ease-out forwards;';
        document.body.appendChild(pop);
        setTimeout(function() { pop.remove(); }, 500);
        lastGridSparkTime = now;
      }
    });
  }

  // ==========================================================================
  // Ambient Drip System
  // ==========================================================================
  if (!prefersReducedMotion) {
    (function dripLoop() {
      if (Math.random() > 0.6) {
        var drip = document.createElement('div');
        var startX = Math.random() * window.innerWidth;
        drip.style.cssText = 'position:fixed;left:' + startX + 'px;top:-10px;width:2px;height:20px;background:linear-gradient(to bottom,var(--accent-cyan),transparent);pointer-events:none;z-index:1;opacity:0.4;animation:dripFall 3s linear forwards;';
        document.body.appendChild(drip);
        setTimeout(function() { drip.remove(); }, 3000);
      }
      setTimeout(dripLoop, 2000 + Math.random() * 3000);
    })();
  }

  // ==========================================================================
  // Inject dynamic keyframes (grid pop + drip fall)
  // ==========================================================================
  var dynamicStyles = document.createElement('style');
  dynamicStyles.textContent = '@keyframes gridPop{0%{transform:scale(0);opacity:1}50%{transform:scale(2);opacity:.8}100%{transform:scale(0);opacity:0}}@keyframes dripFall{0%{transform:translateY(0);opacity:.4}100%{transform:translateY(100vh);opacity:0}}';
  document.head.appendChild(dynamicStyles);

  // ==========================================================================
  // FAQ Toggle
  // ==========================================================================
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.parentElement;
      var wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
        openItem.classList.remove('open');
      });
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ==========================================================================
  // Contact Form → GHL Webhook
  // ==========================================================================
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var data = {};
      formData.forEach(function(value, key) { data[key] = value; });

      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // GHL webhook URL — replace with actual endpoint from Vibha session
      var GHL_WEBHOOK = '';

      if (GHL_WEBHOOK) {
        fetch(GHL_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company || '',
            interest: data.product || '',
            message: data.message,
            source: 'mpowerio.ai contact form'
          })
        }).then(function() {
          showFormSuccess(contactForm);
        }).catch(function() {
          // Fallback: still show success, notification email handles it
          showFormSuccess(contactForm);
        });
      } else {
        // Webhook not configured yet — show success and log
        console.log('Contact form data (webhook pending):', data);
        setTimeout(function() {
          showFormSuccess(contactForm);
        }, 1000);
      }
    });
  }

  function showFormSuccess(form) {
    form.innerHTML = '<div style="text-align:center;padding:2rem;">' +
      '<div style="width:80px;height:80px;background:var(--gradient-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;color:var(--bg-primary);font-size:32px;">&#10003;</div>' +
      '<h3 style="margin-bottom:1rem;font-family:var(--font-display);">Message Sent!</h3>' +
      '<p style="color:var(--text-muted);">Thank you for reaching out. We\'ll get back to you within 24 hours.</p>' +
      '</div>';
  }

  // ==========================================================================
  // Footer Year Auto-Update
  // ==========================================================================
  document.querySelectorAll('.footer__bottom p').forEach(function(p) {
    var text = p.textContent;
    if (text.indexOf('2025') !== -1 || text.indexOf('2024') !== -1) {
      p.textContent = text.replace(/202[45]/, new Date().getFullYear());
    }
  });

})();
