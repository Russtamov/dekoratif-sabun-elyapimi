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

    // Performance optimizations with smoother scroll handling
    this.scrollThrottle = this.throttle(this.handleScroll.bind(this), 8);
    this.lastScrollTop = 0;
    this.scrollDirection = "down";
    this.resizeThrottle = this.throttle(this.handleResize.bind(this), 250);

    // Initialize mobile menu state
    this.mobileMenuOpen = false;

    console.log("🌸 Dekoratif Çiçek Site Initialized");
  }

  bindEvents() {
    // Scroll events with mobile optimization
    window.addEventListener("scroll", this.scrollThrottle, { passive: true });
    window.addEventListener("resize", this.resizeThrottle, { passive: true });

    // Mobile-specific touch event optimizations
    if ("ontouchstart" in window) {
      document.body.addEventListener("touchstart", () => {}, { passive: true });
      document.body.addEventListener("touchmove", () => {}, { passive: true });
    }

    // Enhanced image loading for mobile
    this.setupImageLoading();

    // Optimize WhatsApp button for mobile scroll
    this.optimizeWhatsAppButton();

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

    // Determine scroll direction for smoother animations
    this.scrollDirection = scrollTop > this.lastScrollTop ? "down" : "up";
    this.lastScrollTop = scrollTop;

    // Enhanced header background effect with smooth transition zones
    if (!this.header) return;

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      if (scrollTop > 50) {
        if (!this.header.classList.contains("scrolled")) {
          this.header.classList.add("scrolled");
        }
      } else {
        if (this.header.classList.contains("scrolled")) {
          this.header.classList.remove("scrolled");
        }
      }
    });

    // Optimized parallax effect for hero section
    const heroSection = document.querySelector(".hero");
    if (heroSection && scrollTop < window.innerHeight) {
      requestAnimationFrame(() => {
        const scrolled = scrollTop * 0.3; // Reduced parallax intensity for smoother effect
        heroSection.style.transform = `translate3d(0, ${scrolled}px, 0)`;
      });
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
    // Mobile-optimized intersection observer
    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add smooth transition for better performance
            entry.target.style.willChange = "opacity, transform";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            // Clean up will-change after animation
            setTimeout(() => {
              entry.target.style.willChange = "auto";
            }, 600);

            // Don't unobserve on mobile for bi-directional scrolling
            if (!isMobile) {
              observer.unobserve(entry.target);
            }
          } else if (isMobile && entry.boundingClientRect.bottom < 0) {
            // Re-hide elements that scroll out of view on mobile (upward scroll)
            entry.target.style.opacity = "0.3";
            entry.target.style.transform = "translateY(20px)";
          }
        });
      },
      {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? "50px 0px 50px 0px" : "0px 0px -50px 0px",
      }
    );

    // Enhanced image lazy loading with Intersection Observer
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            img.style.opacity = "1";
            imageObserver.unobserve(img);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px 0px 100px 0px", // Preload images earlier
      }
    );

    // Observe all animated elements
    document
      .querySelectorAll(".product-card, .feature, .about-text")
      .forEach((el) => {
        observer.observe(el);
      });

    // Observe all lazy-loaded images
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Utility functions with mobile optimization
  throttle(func, limit) {
    let inThrottle;
    const isMobile = window.innerWidth <= 768;
    const adjustedLimit = isMobile ? Math.max(limit, 32) : limit; // Slower throttle on mobile

    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), adjustedLimit);
      }
    };
  }

  // Mobile-specific debounce for expensive operations
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  setupImageLoading() {
    // Enhanced image loading for mobile devices
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.onload = () => {
        img.classList.add("loaded");
        img.style.opacity = "1";
      };

      img.onerror = () => {
        console.warn("Image failed to load:", img.src);
        img.style.opacity = "0.5";
        // Try to reload the image once
        setTimeout(() => {
          img.src = img.src;
        }, 1000);
      };

      // Force immediate loading if image is in viewport on page load
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        img.style.opacity = "1";
      }
    });
  }

  optimizeWhatsAppButton() {
    const whatsappButton = document.querySelector(".whatsapp-float");
    if (!whatsappButton) return;

    // Force WhatsApp button to always stay visible and positioned
    const ensureButtonVisibility = () => {
      whatsappButton.style.position = "fixed";
      whatsappButton.style.right =
        window.innerWidth <= 480
          ? "15px"
          : window.innerWidth <= 768
          ? "20px"
          : "30px";
      whatsappButton.style.bottom =
        window.innerWidth <= 480
          ? "15px"
          : window.innerWidth <= 768
          ? "20px"
          : "30px";
      whatsappButton.style.left = "auto";
      whatsappButton.style.top = "auto";
      whatsappButton.style.visibility = "visible";
      whatsappButton.style.display = "flex";
      whatsappButton.style.opacity = "1";
      whatsappButton.style.zIndex = "2147483647";
      whatsappButton.style.pointerEvents = "auto";
      whatsappButton.style.margin = "0";
      whatsappButton.style.transform =
        whatsappButton.style.transform || "translateZ(0)";
    };

    // Ensure button visibility on load and during scroll
    ensureButtonVisibility();

    // Force position fixed immediately
    setTimeout(() => {
      ensureButtonVisibility();
      console.log("WhatsApp button forced to fixed position");
    }, 100);

    // Additional safety check
    setInterval(() => {
      if (whatsappButton.style.position !== "fixed") {
        ensureButtonVisibility();
        console.log("WhatsApp button position corrected");
      }
    }, 1000);

    // Enhanced scroll handling for WhatsApp button
    let scrollTimeout;
    const handleScroll = () => {
      // Ensure visibility during scroll
      ensureButtonVisibility();

      // Add a subtle emphasis during scroll
      whatsappButton.style.transform = "scale(1.02) translateZ(0)";

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        whatsappButton.style.transform = "translateZ(0)";
      }, 150);
    };

    // Listen to scroll events for WhatsApp button visibility
    window.addEventListener("scroll", this.throttle(handleScroll, 16), {
      passive: true,
    });

    // Ensure the button is always clickable and properly positioned
    whatsappButton.style.pointerEvents = "auto";
    whatsappButton.style.touchAction = "manipulation";

    // Add accessibility for better mobile interaction
    whatsappButton.addEventListener(
      "touchstart",
      (e) => {
        ensureButtonVisibility();
        e.currentTarget.style.transform = "scale(0.95) translateZ(0)";
      },
      { passive: true }
    );

    whatsappButton.addEventListener(
      "touchend",
      (e) => {
        ensureButtonVisibility();
        e.currentTarget.style.transform = "translateZ(0)";
      },
      { passive: true }
    );

    // Monitor for any DOM changes that might affect button visibility
    const observer = new MutationObserver(() => {
      ensureButtonVisibility();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Ensure visibility on window resize and orientation change
    window.addEventListener("resize", ensureButtonVisibility, {
      passive: true,
    });
    window.addEventListener("orientationchange", ensureButtonVisibility, {
      passive: true,
    });
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
