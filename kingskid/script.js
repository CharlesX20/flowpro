/* ============================================================
   KINGS KID PEDIATRIC DENTISTRY - MAIN SCRIPTS
   Smooth animations, scroll effects, and interactive features
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ========== DOM ELEMENT REFERENCES ==========
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const allSections = document.querySelectorAll('section[id]');
  const heroSection = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');

  // Elements to animate on scroll
  const animateElements = document.querySelectorAll(
    '.about-card, .service-item, .pricing-category, .doctor-profile, ' +
    '.testimonial-card, .faq-item, .contact-info-block, .hours-image-wrapper, ' +
    '.about-image-row, .team-support-staff, .contact-form-col'
  );

  // Stagger children containers
  const staggerContainers = document.querySelectorAll(
    '.about-grid, .services-grid, .pricing-grid, .testimonials-grid, .faq-grid'
  );

  // ========== INITIAL SETUP ==========

  // Add animation classes to elements
  animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
  });

  // Set up stagger containers
  staggerContainers.forEach(container => {
    container.classList.add('stagger-children');
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = (index * 0.08) + 's';
    });
  });

  // Activate hero section immediately
  if (heroText) {
    heroText.style.opacity = '1';
    heroText.style.transform = 'translateY(0)';
  }

  // Ensure header is always visible and sticky
  header.style.transform = 'translateY(0)';
  header.style.position = 'sticky';
  header.style.top = '0';

  // ========== HEADER SCROLL EFFECT (Background & Shadow only) ==========
  function updateHeader() {
    const currentScrollY = window.scrollY;

    // Add scrolled class for background/shadow change when scrolled down
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ========== ACTIVE NAV LINK BASED ON SCROLL POSITION ==========
  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    allSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === currentSectionId) {
        link.classList.add('active');
      }
    });

    // If at the very top, activate home
    if (window.scrollY < 200) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }

  // ========== SCROLL ANIMATIONS (Intersection Observer) ==========
  function setupScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
      });
      document.querySelectorAll('.stagger-children > *').forEach(el => {
        el.classList.add('animated');
      });
      return;
    }

    // Observer for individual animated elements
    const elementObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a tiny random delay for natural feel
          const delay = Math.random() * 80;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, delay);
          elementObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe individual elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      elementObserver.observe(el);
    });

    // Observer for stagger containers
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animated');
            }, index * 70);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    // Observe stagger containers
    document.querySelectorAll('.stagger-children').forEach(container => {
      staggerObserver.observe(container);
    });
  }

  // ========== SMOOTH SCROLL FOR NAV LINKS ==========
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        // Skip if it's just "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Calculate offset for sticky header
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 15;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========== PARALLAX EFFECT FOR HERO BACKGROUND ==========
  function setupParallax() {
    const heroBg = document.querySelector('.hero-bg-image');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

      if (scrollPosition < heroHeight) {
        const parallaxValue = scrollPosition * 0.35;
        heroBg.style.transform = `translateY(${parallaxValue}px) scale(1.04)`;
      }
    }, { passive: true });
  }

  // ========== COUNTER ANIMATION FOR HERO STATS ==========
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.hero-stat-number');
    if (statNumbers.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat);
            }, index * 250);
          });
          counterObserver.disconnect();
        }
      });
    }, observerOptions);

    const firstStat = statNumbers[0].closest('.hero-stats-row') || statNumbers[0];
    counterObserver.observe(firstStat);
  }

  function animateCounter(element) {
    const text = element.textContent.trim();
    const hasPlus = text.includes('+');
    const hasComma = text.includes(',');
    const cleanText = text.replace(/[+,]/g, '');
    const targetNumber = parseFloat(cleanText);

    if (isNaN(targetNumber)) return;

    const isFloat = cleanText.includes('.');
    const duration = 2200;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetNumber - startValue) * easeOut;

      let displayValue;
      if (isFloat) {
        displayValue = currentValue.toFixed(1);
      } else {
        displayValue = Math.floor(currentValue);
        if (hasComma && displayValue >= 1000) {
          displayValue = displayValue.toLocaleString('en-US');
        }
      }

      element.textContent = hasPlus ? displayValue + '+' : displayValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is exact
        let finalValue;
        if (isFloat) {
          finalValue = targetNumber.toFixed(1);
        } else {
          finalValue = targetNumber;
          if (hasComma && finalValue >= 1000) {
            finalValue = finalValue.toLocaleString('en-US');
          }
        }
        element.textContent = hasPlus ? finalValue + '+' : finalValue;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // ========== FAQ ACCORDION INTERACTION ==========
  function setupFaqInteraction() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Add click indicator styling
      question.style.cursor = 'pointer';
      question.style.position = 'relative';
      question.style.userSelect = 'none';

      // Add a subtle indicator icon
      const indicator = document.createElement('span');
      indicator.innerHTML = '&#x25BC;';
      indicator.style.cssText = `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.65rem;
        color: #5a9eaf;
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      `;
      question.appendChild(indicator);

      // Set initial state (all open)
      answer.style.maxHeight = answer.scrollHeight + 60 + 'px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.4s ease, padding-top 0.4s ease';
      answer.style.opacity = '1';
      answer.style.marginTop = '1rem';

      let isOpen = true;

      question.addEventListener('click', () => {
        isOpen = !isOpen;

        if (isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 60 + 'px';
          answer.style.opacity = '1';
          answer.style.marginTop = '1rem';
          indicator.style.transform = 'translateY(-50%) rotate(0deg)';
          item.style.boxShadow = 'var(--shadow-md)';
          item.style.borderColor = 'var(--blue-light)';
        } else {
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
          answer.style.marginTop = '0';
          answer.style.paddingTop = '0';
          indicator.style.transform = 'translateY(-50%) rotate(-90deg)';
          item.style.boxShadow = 'var(--shadow-xs)';
          item.style.borderColor = 'var(--gray-lighter)';
        }
      });

      // Add subtle hover effect on the whole FAQ item
      item.addEventListener('mouseenter', () => {
        if (!isOpen) {
          item.style.borderColor = 'var(--blue-light)';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!isOpen) {
          item.style.borderColor = 'var(--gray-lighter)';
        }
      });
    });
  }

  // ========== FORM SUBMISSION HANDLING ==========
  function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let allValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = '#d4887a';
          field.style.backgroundColor = '#fef9f8';
          setTimeout(() => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
          }, 2000);
        }
      });

      if (!allValid) return;

      // Get submit button
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;

      // Visual feedback - loading state
      submitBtn.textContent = 'Sending Your Request...';
      submitBtn.style.opacity = '0.8';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.letterSpacing = '0.03em';

      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent! We\'ll Be In Touch Soon.';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '#3d8b6e';
        submitBtn.style.borderColor = '#3d8b6e';
        submitBtn.style.letterSpacing = '0.02em';

        // Reset form fields
        contactForm.reset();

        // Reset button after a few seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.pointerEvents = 'auto';
          submitBtn.style.letterSpacing = '';
        }, 3500);
      }, 1800);
    });
  }

  // ========== PRICING ROW HOVER EFFECT ==========
  function setupPricingHover() {
    const pricingRows = document.querySelectorAll('.pricing-row');

    pricingRows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        this.style.borderRadius = '8px';
        this.style.padding = '0.5rem 0.7rem';
        this.style.margin = '0 -0.7rem';
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.style.boxShadow = '0 2px 8px rgba(26, 58, 74, 0.06)';
      });

      row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
        this.style.borderRadius = '';
        this.style.padding = '';
        this.style.margin = '';
        this.style.boxShadow = '';
      });
    });
  }

  // ========== IMAGE REVEAL ON SCROLL ==========
  function setupImageReveal() {
    const images = document.querySelectorAll('img');

    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '60px'
    });

    images.forEach(img => {
      // Don't apply to hero background image
      if (!img.closest('.hero-background')) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.96)';
        img.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        imageObserver.observe(img);
      }
    });
  }

  // ========== TESTIMONIAL CARDS INTERACTIVE EFFECT ==========
  function setupTestimonialHighlight() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        testimonialCards.forEach(c => {
          if (c !== card) {
            c.style.opacity = '0.55';
            c.style.transform = 'scale(0.97)';
            c.style.filter = 'blur(1px)';
            c.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          }
        });
        this.style.transform = 'translateY(-10px) scale(1.03)';
        this.style.boxShadow = '0 16px 40px rgba(26, 58, 74, 0.16)';
        this.style.filter = 'blur(0)';
        this.style.borderColor = '#5a9eaf';
      });

      card.addEventListener('mouseleave', function() {
        testimonialCards.forEach(c => {
          c.style.opacity = '1';
          c.style.transform = '';
          c.style.boxShadow = '';
          c.style.filter = '';
          c.style.borderColor = '';
        });
      });
    });
  }

  // ========== NAV LINK ENHANCED HOVER ==========
  function setupNavHover() {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      link.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.2s ease';
      });
    });
  }

  // ========== KEYBOARD NAVIGATION ==========
  function setupKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      // Escape key to blur active elements
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
    });
  }

  // ========== RESIZE HANDLER (Debounced) ==========
  let resizeTimer;
  function setupResizeHandler() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Update FAQ answer heights
        document.querySelectorAll('.faq-answer').forEach(answer => {
          if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
            answer.style.maxHeight = answer.scrollHeight + 60 + 'px';
          }
        });
      }, 300);
    });
  }

  // ========== SECTION REVEAL ON SCROLL (Subtle) ==========
  function setupSectionReveal() {
    const sections = document.querySelectorAll('section');

    if (!('IntersectionObserver' in window)) return;

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.04,
      rootMargin: '0px'
    });

    sections.forEach(section => {
      // Skip hero section
      if (section.id !== 'home') {
        section.style.opacity = '0.99';
        section.style.transition = 'opacity 0.5s ease';
        sectionObserver.observe(section);
      }
    });
  }

  // ========== COMBINED SCROLL HANDLER (Throttled with rAF) ==========
  let ticking = false;
  function scrollHandler() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ========== INITIALIZE ALL FUNCTIONS ==========
  function init() {
    setupScrollAnimations();
    setupSmoothScroll();
    setupParallax();
    animateCounters();
    setupFaqInteraction();
    setupFormHandling();
    setupPricingHover();
    setupImageReveal();
    setupTestimonialHighlight();
    setupNavHover();
    setupKeyboardNav();
    setupResizeHandler();
    setupSectionReveal();

    // Attach scroll event listeners
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Trigger initial states
    updateHeader();
    updateActiveNavLink();

    // Welcome message
    console.log(
      '%c\u2728 Kings Kid Pediatric Dentistry %c Ready for Smiles ',
      'background: #1a3a4a; color: #ffffff; padding: 10px 14px; border-radius: 6px 0 0 6px; font-weight: 700; font-size: 13px;',
      'background: #5a9eaf; color: #ffffff; padding: 10px 14px; border-radius: 0 6px 6px 0; font-weight: 500; font-size: 13px;'
    );
  }

  // ========== START EVERYTHING ==========
  init();

});