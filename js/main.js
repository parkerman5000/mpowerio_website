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
  // Header Scroll Effect
  // ==========================================================================
  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = 'none';
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
        // In production, you would send this to your server or a service like Formspree
        console.log('Form submitted:', data);

        // Show success message
        contactForm.innerHTML = `
          <div style="text-align: center; padding: var(--space-2xl);">
            <div style="width: 60px; height: 60px; background: var(--nature-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-lg); color: white; font-size: 24px;">✓</div>
            <h3 style="margin-bottom: var(--space-md);">Message Sent!</h3>
            <p style="color: var(--muted-text);">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          </div>
        `;
      }, 1500);
    });
  }

  // ==========================================================================
  // Checkout Page Functionality
  // ==========================================================================
  const checkoutForm = document.getElementById('checkout-form');
  const planRadios = document.querySelectorAll('input[name="plan"]');

  // Plan details
  const plans = {
    retainer: {
      name: 'Monthly Retainer',
      price: '$2,000',
      priceAmount: 2000,
      period: '/mo',
      priceId: 'price_retainer', // Replace with actual Stripe Price ID
      mode: 'subscription',
      features: [
        '20 hours of consulting',
        'Priority response time',
        'Monthly strategy calls',
        'Email & Slack support'
      ]
    },
    starter: {
      name: 'Starter Package',
      price: '$750',
      priceAmount: 750,
      period: '',
      priceId: 'price_starter', // Replace with actual Stripe Price ID
      mode: 'payment',
      features: [
        '10 hours of consulting',
        'Valid for 30 days',
        'Email support',
        'Kickoff strategy call'
      ]
    },
    workshop: {
      name: 'AI Workshop',
      price: '$500',
      priceAmount: 500,
      period: '',
      priceId: 'price_workshop', // Replace with actual Stripe Price ID
      mode: 'payment',
      features: [
        'Half-day workshop',
        'Up to 10 participants',
        'Custom curriculum',
        'Materials included'
      ]
    }
  };

  // Update order summary when plan changes
  if (planRadios.length > 0) {
    function updateOrderSummary() {
      const selectedPlan = document.querySelector('input[name="plan"]:checked')?.value || 'retainer';
      const plan = plans[selectedPlan];

      // Update plan cards styling
      document.querySelectorAll('[id^="plan-"][id$="-card"]').forEach(card => {
        card.style.borderColor = 'var(--light-border)';
      });
      const selectedCard = document.getElementById(`plan-${selectedPlan}-card`);
      if (selectedCard) {
        selectedCard.style.borderColor = 'var(--tech-blue)';
      }

      // Update order summary
      const planName = document.getElementById('order-plan-name');
      const planPrice = document.getElementById('order-plan-price');
      const orderTotal = document.getElementById('order-total');
      const orderPeriod = document.getElementById('order-period');
      const orderFeatures = document.getElementById('order-features');

      if (planName) planName.textContent = plan.name;
      if (planPrice) planPrice.textContent = plan.price;
      if (orderTotal) orderTotal.innerHTML = plan.price + `<span style="font-size: var(--text-sm); font-weight: 400; color: var(--muted-text);" id="order-period">${plan.period}</span>`;
      if (orderFeatures) {
        orderFeatures.innerHTML = plan.features.map(f => `<li style="margin-bottom: var(--space-xs);">&#10003; ${f}</li>`).join('');
      }
    }

    planRadios.forEach(radio => {
      radio.addEventListener('change', updateOrderSummary);
    });

    // Initialize
    updateOrderSummary();

    // Check URL params for pre-selected plan
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedPlan = urlParams.get('plan');
    if (preselectedPlan && plans[preselectedPlan]) {
      const planInput = document.getElementById(`plan-${preselectedPlan}`);
      if (planInput) {
        planInput.checked = true;
        updateOrderSummary();
      }
    }
  }

  // Handle checkout form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(checkoutForm);
      const data = Object.fromEntries(formData);
      const selectedPlan = document.querySelector('input[name="plan"]:checked')?.value || 'retainer';
      const plan = plans[selectedPlan];

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
        // Create Stripe Checkout Session via backend
        const response = await fetch('php/checkout.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            mode: plan.mode,
            customerEmail: data.email,
            customerName: data.name,
            company: data.company || '',
            successUrl: window.location.origin + '/success.html',
            cancelUrl: window.location.origin + '/checkout.html?plan=' + selectedPlan
          })
        });

        const session = await response.json();

        if (session.error) {
          throw new Error(session.error);
        }

        // Redirect to Stripe Checkout
        if (session.url) {
          window.location.href = session.url;
        } else if (session.sessionId) {
          // If using Stripe.js redirect
          const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your key
          await stripe.redirectToCheckout({ sessionId: session.sessionId });
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
  // Animation on Scroll (Simple Intersection Observer)
  // ==========================================================================
  const animateElements = document.querySelectorAll('.card, .pricing-card, .about-content > div');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
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

})();
