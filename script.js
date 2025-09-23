// Modern JavaScript for Dekoratif Kokulu Sabunlar Website
// Production-ready with ES6+ features, performance optimizations, and accessibility
// Version: 1.0.0 - Production Release

class DekoratifCicekSite {
  constructor() {
    this.init();
    this.bindEvents();
    this.initAnimations();
    this.initTestimonialCarousel();
    this.initIntersectionObserver();
  }

  init() {
    // Cache DOM elements for performance
    this.header = document.querySelector(".header");
    this.navToggle = document.querySelector(".nav-toggle");
    this.navMenu = document.querySelector(".nav-menu");
    this.productCards = document.querySelectorAll(".product-card");
    this.testimonials = document.querySelectorAll(".testimonial");
    this.testimonialDots = document.querySelectorAll(".dot");
    this.prevBtn = document.querySelector(".testimonial-btn.prev");
    this.nextBtn = document.querySelector(".testimonial-btn.next");
    // İletişim formu kaldırıldı - WhatsApp butonu kullanılıyor

    // Testimonial carousel state
    this.currentTestimonial = 0;
    this.testimonialInterval = null;

    // Performance optimizations
    this.scrollThrottle = this.throttle(this.handleScroll.bind(this), 16);
    this.resizeThrottle = this.throttle(this.handleResize.bind(this), 250);

    // Initialize mobile menu state
    this.mobileMenuOpen = false;

    console.log("🌸 Dekoratif Çiçek Site Initialized");
  }

  bindEvents() {
    // Scroll events
    window.addEventListener("scroll", this.scrollThrottle, { passive: true });
    window.addEventListener("resize", this.resizeThrottle, { passive: true });

    // Navigation events
    this.navToggle?.addEventListener("click", this.toggleMobileMenu.bind(this));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", this.smoothScroll.bind(this));
    });

    // Product card interactions - Detay Gör butonları kaldırıldı
    // Artık ürün kartlarında modal açma fonksiyonu yok

    // Testimonial carousel events
    this.prevBtn?.addEventListener("click", () =>
      this.changeTestimonial("prev")
    );
    this.nextBtn?.addEventListener("click", () =>
      this.changeTestimonial("next")
    );

    this.testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToTestimonial(index));
    });

    // İletişim formu kaldırıldı - WhatsApp ile iletişim kullanılıyor

    // Keyboard navigation for accessibility
    document.addEventListener(
      "keydown",
      this.handleKeyboardNavigation.bind(this)
    );

    // Product card hover effects
    this.productCards.forEach((card) => {
      card.addEventListener("mouseenter", this.handleCardHover.bind(this));
      card.addEventListener("mouseleave", this.handleCardLeave.bind(this));
    });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header background effect
    if (scrollTop > 100) {
      this.header?.classList.add("scrolled");
    } else {
      this.header?.classList.remove("scrolled");
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      const scrolled = scrollTop * 0.5;
      heroSection.style.transform = `translateY(${scrolled}px)`;
    }
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Reinitialize animations on resize
    this.initAnimations();
  }

  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenuOpen = true;
    this.navMenu?.classList.add("active");
    this.navToggle?.classList.add("active");
    this.navToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    // Animate menu items
    const menuItems = this.navMenu?.querySelectorAll("li");
    menuItems?.forEach((item, index) => {
      item.style.animation = `fadeInLeft 0.3s ease-out ${index * 0.1}s both`;
    });
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.navMenu?.classList.remove("active");
    this.navToggle?.classList.remove("active");
    this.navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed header

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  // handleProductView ve showProductModal fonksiyonları kaldırıldı
  // Artık Detay Gör butonu olmadığı için modal fonksiyonalitesi gerekmiyor

  initTestimonialCarousel() {
    if (this.testimonials.length === 0) return;

    // Auto-play carousel
    this.startTestimonialAutoplay();

    // Pause on hover
    const carousel = document.querySelector(".testimonials-carousel");
    carousel?.addEventListener("mouseenter", () =>
      this.pauseTestimonialAutoplay()
    );
    carousel?.addEventListener("mouseleave", () =>
      this.startTestimonialAutoplay()
    );
  }

  startTestimonialAutoplay() {
    this.testimonialInterval = setInterval(() => {
      this.changeTestimonial("next");
    }, 5000);
  }

  pauseTestimonialAutoplay() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }
  }

  changeTestimonial(direction) {
    if (direction === "next") {
      this.currentTestimonial =
        (this.currentTestimonial + 1) % this.testimonials.length;
    } else {
      this.currentTestimonial =
        this.currentTestimonial === 0
          ? this.testimonials.length - 1
          : this.currentTestimonial - 1;
    }
    this.updateTestimonialDisplay();
  }

  goToTestimonial(index) {
    this.currentTestimonial = index;
    this.updateTestimonialDisplay();
    this.pauseTestimonialAutoplay();
    setTimeout(() => this.startTestimonialAutoplay(), 3000);
  }

  updateTestimonialDisplay() {
    // Hide all testimonials
    this.testimonials.forEach((testimonial) => {
      testimonial.classList.remove("active");
    });

    // Show current testimonial
    this.testimonials[this.currentTestimonial]?.classList.add("active");

    // Update dots
    this.testimonialDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentTestimonial);
    });
  }

  // handleFormSubmission kaldırıldı - WhatsApp ile iletişim kullanılıyor

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Bildirimi kapat">&times;</button>
            </div>
        `;

    // Add notification styles
    const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                animation: notificationSlideIn 0.3s ease-out;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-content {
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification i {
                color: #28a745;
                font-size: 1.2rem;
            }
            
            .notification span {
                flex: 1;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background 0.2s;
            }
            
            .notification-close:hover {
                background: #f0f0f0;
            }
            
            @keyframes notificationSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes notificationSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;

    // Add styles if not exists
    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = notificationStyles;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    const removeNotification = () => {
      notification.style.animation = "notificationSlideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    };

    notification
      .querySelector(".notification-close")
      .addEventListener("click", removeNotification);
    setTimeout(removeNotification, 5000);
  }

  handleKeyboardNavigation(e) {
    // Escape key to close modals/menus
    if (e.key === "Escape") {
      if (this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    }

    // Arrow keys for testimonial navigation
    if (document.activeElement?.closest(".testimonials-carousel")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.changeTestimonial("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.changeTestimonial("next");
      }
    }
  }

  handleCardHover(e) {
    const card = e.currentTarget;
    const image = card.querySelector(".product-image img");

    // Add subtle animation
    card.style.transform = "translateY(-5px)";
    image.style.transform = "scale(1.05)";
  }

  handleCardLeave(e) {
    const card = e.currentTarget;
    const image = card.querySelector(".product-image img");

    // Reset animation
    card.style.transform = "";
    image.style.transform = "";
  }

  initAnimations() {
    // Add entrance animations to elements when they come into view
    const animatedElements = document.querySelectorAll(
      ".product-card, .feature, .about-text, .contact-info"
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "all 0.6s ease-out";
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  initIntersectionObserver() {
    // Observe elements for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all animated elements
    document
      .querySelectorAll(".product-card, .feature, .about-text, .contact-info")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  trackEvent(eventName, data = {}) {
    // Analytics tracking (replace with your analytics service)
    console.log(`📊 Event: ${eventName}`, data);

    // Example: Google Analytics 4
    // gtag('event', eventName, data);

    // Example: Facebook Pixel
    // fbq('track', eventName, data);
  }
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add loading animation
  document.body.classList.add("loading");

  // Initialize site after a brief delay for smooth loading
  setTimeout(() => {
    new DekoratifCicekSite();
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 500);
});

// Add loading and loaded states CSS
const loadingStyles = `
    .loading {
        overflow: hidden;
    }
    
    .loading * {
        animation-play-state: paused !important;
    }
    
    .loaded {
        animation: siteLoaded 1s ease-out;
    }
    
    @keyframes siteLoaded {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: min(300px, 80vw);
            height: 100vh;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 5rem 2rem 2rem;
            transition: right 0.3s ease-out;
            z-index: 999;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu ul {
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .nav-menu a {
            font-size: 1.1rem;
            padding: 0.75rem 0;
            display: block;
            word-wrap: break-word;
        }
        
        .nav-toggle {
            display: flex;
            z-index: 1000;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    @media (max-width: 480px) {
        .nav-menu {
            width: min(280px, 90vw);
            padding: 4rem 1.5rem 2rem;
        }
        
        .nav-menu a {
            font-size: 1rem;
            padding: 0.6rem 0;
        }
    }
`;

// Add loading styles to head
const loadingStyleSheet = document.createElement("style");
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);

// Enhanced error handling
window.addEventListener("error", (e) => {
  console.error("🚨 Site Error:", e.error);
  // Could send to error tracking service
});

// Performance monitoring
window.addEventListener("load", () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  console.log("🚀 Site Performance:", {
    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
    domContentLoaded:
      perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    totalTime: perfData.loadEventEnd - perfData.fetchStart,
  });
});
