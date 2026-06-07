// ===== DOM ELEMENTS =====
const header = document.querySelector('.site-header');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const openQuoteModal = document.getElementById('openQuoteModal');
const closeModal = document.getElementById('closeModal');
const quoteModal = document.getElementById('quoteModal');
const quoteForm = document.getElementById('quoteForm');
const modalQuoteForm = document.getElementById('modalQuoteForm');
const newsletterForm = document.getElementById('newsletterForm');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // Initial check

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
  mobileMenuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  
  const isExpanded = mobileMenuToggle.classList.contains('active');
  mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = isExpanded ? 'hidden' : '';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update active nav link
      updateActiveNavLink(targetId);
    }
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
function updateActiveNavLink(sectionId) {
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === sectionId) {
      link.classList.add('active');
    }
  });
}

// Update active link based on scroll position
function handleActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + header.offsetHeight + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = '#' + section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      updateActiveNavLink(sectionId);
    }
  });
}

window.addEventListener('scroll', handleActiveNavOnScroll);

// ===== QUOTE MODAL =====
function openModal() {
  quoteModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus first input in modal
  setTimeout(() => {
    const firstInput = modalQuoteForm.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeModalFunction() {
  quoteModal.classList.remove('active');
  document.body.style.overflow = '';
}

openQuoteModal.addEventListener('click', (e) => {
  e.preventDefault();
  openModal();
});

closeModal.addEventListener('click', closeModalFunction);

// Close modal when clicking outside
quoteModal.addEventListener('click', (e) => {
  if (e.target === quoteModal) {
    closeModalFunction();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
    closeModalFunction();
  }
});

// ===== FORM SUBMISSIONS =====
function handleFormSubmit(e, formType) {
  e.preventDefault();
  
  // Simple form validation
  const form = e.target;
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#EF4444';
      
      // Remove error styling after user types
      input.addEventListener('input', function() {
        this.style.borderColor = '';
      }, { once: true });
    }
  });
  
  if (!isValid) {
    // Shake animation for invalid form
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      form.style.animation = '';
    }, 500);
    return;
  }
  
  // Simulate form submission
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    submitButton.textContent = '✓ Sent Successfully!';
    submitButton.style.background = 'linear-gradient(135deg, #059669, #10B981)';
    
    // Show success message
    showToast('Thank you! We\'ll contact you shortly.');
    
    // Reset form
    form.reset();
    
    // Reset button after delay
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.background = '';
      
      // Close modal if it was the modal form
      if (formType === 'modal') {
        closeModalFunction();
      }
    }, 2000);
  }, 1500);
}

// Main contact form
quoteForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));

// Modal form
modalQuoteForm.addEventListener('submit', (e) => handleFormSubmit(e, 'modal'));

// Newsletter form
newsletterForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = this.querySelector('input[type="email"]');
  
  if (!emailInput.value.trim()) {
    emailInput.style.borderColor = '#EF4444';
    return;
  }
  
  const submitButton = this.querySelector('button');
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Subscribing...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    submitButton.textContent = '✓ Subscribed!';
    showToast('Welcome to our newsletter!');
    this.reset();
    
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  }, 1000);
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--green-800, #2E7D32);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    z-index: 3000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
  
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(toastStyles);

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe service cards
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Observe review cards
  document.querySelectorAll('.review-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
  });
}

// Add animation styles and run observer
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .service-card.in-view,
  .review-card.in-view {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(animationStyles);

// Run on load
window.addEventListener('load', observeElements);

// ===== COUNTER ANIMATION FOR STATS =====
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const hasPlus = text.includes('+');
    const hasDecimal = text.includes('.');
    
    // Store original text as data attribute
    stat.dataset.value = text;
    stat.textContent = '0' + (hasPlus ? '+' : '');
    
    const targetValue = parseFloat(text.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = targetValue * easeOutQuart;
      
      if (hasDecimal) {
        stat.textContent = currentValue.toFixed(1);
      } else {
        stat.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '');
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stat.textContent = stat.dataset.value;
      }
    }
    
    requestAnimationFrame(update);
  });
}

// Trigger stat animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroObserver.observe(heroSection);
}

// ===== PARALLAX EFFECT FOR HERO =====
function handleParallax() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  
  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.15;
  
  heroVisual.style.transform = `translateY(${rate}px)`;
}

window.addEventListener('scroll', handleParallax);

// ===== CURRENT YEAR FOR FOOTER =====
function updateFooterYear() {
  const footerText = document.querySelector('.footer-bottom p');
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = footerText.textContent.replace('2025', currentYear);
  }
}

updateFooterYear();

// ===== PREVENT FORM RESUBMISSION ON REFRESH =====
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

console.log('🚿 FlowPro Plumbing - Modern website initialized successfully!');
console.log('💧 Professional green & white styling active');
console.log('🔧 All interactive features ready');