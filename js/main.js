/**
 * mpowerio.ai - Main JavaScript
 * "Quality Inputs producing Quantum Outputs"
 */

(function() {
  'use strict';

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('nav--open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // Scroll Reveal Animation
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => {
      el.classList.add('revealed');
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================
  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
        header.style.borderBottomColor = 'rgba(0, 180, 216, 0.2)';
      } else {
        header.style.background = 'rgba(10, 10, 15, 0.8)';
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      }

      lastScroll = currentScroll;
    });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // Contact Form Handling
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        console.log('Form submitted:', data);

        // Show success message
        contactForm.innerHTML = `
          <div style="text-align: center; padding: var(--space-2xl);">
            <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-lg); color: var(--bg-primary); font-size: 32px;">✓</div>
            <h3 style="margin-bottom: var(--space-md); color: var(--text-primary);">Message Sent!</h3>
            <p style="color: var(--text-muted);">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          </div>
        `;
      }, 1500);
    });
  }

  // ==========================================================================
  // Checkout Page - Plan Selection
  // ==========================================================================
  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    const tier = urlParams.get('tier');

    // Product pricing data
    const products = {
      'phone-agents': {
        name: 'AI Phone Agents',
        tiers: {
          starter: { price: '$299', period: '/mo', priceId: 'price_phone_starter' },
          growth: { price: '$599', period: '/mo', priceId: 'price_phone_growth' }
        }
      },
      'voice-clones': {
        name: 'Voice Clones',
        tiers: {
          basic: { price: '$199', period: '', priceId: 'price_voice_basic' },
          pro: { price: '$499', period: '', priceId: 'price_voice_pro' }
        }
      },
      'avatars': {
        name: 'VirtualU Avatars',
        tiers: {
          starter: { price: '$399', period: '/mo', priceId: 'price_avatar_starter' },
          business: { price: '$799', period: '/mo', priceId: 'price_avatar_business' }
        }
      }
    };

    // Update order summary if product/tier provided
    if (product && tier && products[product] && products[product].tiers[tier]) {
      const selectedProduct = products[product];
      const selectedTier = selectedProduct.tiers[tier];

      const productNameEl = document.getElementById('order-product-name');
      const tierNameEl = document.getElementById('order-tier-name');
      const priceEl = document.getElementById('order-price');
      const totalEl = document.getElementById('order-total');

      if (productNameEl) productNameEl.textContent = selectedProduct.name;
      if (tierNameEl) tierNameEl.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);
      if (priceEl) priceEl.textContent = selectedTier.price + selectedTier.period;
      if (totalEl) totalEl.textContent = selectedTier.price + selectedTier.period;
    }

    // Handle form submission
    checkoutForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(checkoutForm);
      const data = Object.fromEntries(formData);

      // Basic validation
      if (!data.name || !data.email) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show loading state
      const submitBtn = document.getElementById('checkout-button');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      try {
        // Get the price ID based on URL params
        let priceId = 'price_default';
        let mode = 'payment';

        if (product && tier && products[product] && products[product].tiers[tier]) {
          priceId = products[product].tiers[tier].priceId;
          // Subscriptions for phone-agents and avatars
          if (product === 'phone-agents' || product === 'avatars') {
            mode = 'subscription';
          }
        }

        // Create Stripe Checkout Session via backend
        const response = await fetch('php/checkout.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: priceId,
            mode: mode,
            customerEmail: data.email,
            customerName: data.name,
            company: data.company || '',
            successUrl: window.location.origin + '/success.html',
            cancelUrl: window.location.href
          })
        });

        const session = await response.json();

        if (session.error) {
          throw new Error(session.error);
        }

        // Redirect to Stripe Checkout
        if (session.url) {
          window.location.href = session.url;
        }

      } catch (error) {
        console.error('Checkout error:', error);
        alert('There was an error processing your request. Please try again or contact support.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==========================================================================
  // Year in Footer (Auto-update)
  // ==========================================================================
  document.querySelectorAll('.footer__bottom p').forEach(p => {
    if (p.textContent.includes('2024')) {
      p.textContent = p.textContent.replace('2024', new Date().getFullYear());
    }
  });

  // ==========================================================================
  // 11Labs Widget Placeholder Click Handler
  // ==========================================================================
  const widgetPlaceholder = document.querySelector('.hero__widget-placeholder');

  if (widgetPlaceholder) {
    widgetPlaceholder.style.cursor = 'pointer';
    widgetPlaceholder.addEventListener('click', function() {
      // If 11Labs widget is not yet integrated, show a message
      alert('AI voice demo coming soon! Contact us to schedule a live demo.');
    });
  }

})();
