// SHRIMP TECH Website - Main JavaScript (CLEANED VERSION)
// Removed all duplicates and optimized for performance

// Performance monitoring
const perfStart = performance.now();

// Preload critical resources
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const prefetchLinks = [
            '/pages/solutions.html',
            '/pages/products.html',
            '/pages/partners.html'
        ];
        
        prefetchLinks.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    });
}

// Prevent flash of unstyled content on reload
if (document.readyState === 'loading') {
    document.documentElement.style.visibility = 'hidden';
    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.visibility = 'visible';
    });
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        window.addEventListener('scroll', () => this.handleScroll());
        this.setupSmoothScrolling();
    }
    
    toggleMobileMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        this.hamburger.setAttribute('aria-expanded', !isExpanded);
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        this.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    }
}

// Button animations and interactions
class ButtonAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.createRipple);
        });
        
        document.querySelectorAll('.overview-card, .feature-item, .product-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover);
            card.addEventListener('mouseleave', this.handleCardLeave);
        });
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    }
}

// Loading animations
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.animateOnLoad();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        setTimeout(() => {
            document.querySelector('.hero-content')?.classList.add('animate-in');
        }, 300);
        
        setTimeout(() => {
            document.querySelector('.hero-visual')?.classList.add('animate-in');
        }, 600);
    }
}

// Form handling
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm);
        }
        
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm);
        }
        
        this.setupFormValidation();
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    handleNewsletterForm(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Cảm ơn bạn đã đăng ký nhận tin!');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    setupFormValidation() {
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField);
            field.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        let errorMessage = '';
        
        if (!value && field.hasAttribute('required')) {
            errorMessage = 'Trường này là bắt buộc';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            errorMessage = 'Email không hợp lệ';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            errorMessage = 'Số điện thoại không hợp lệ';
        }
        
        if (errorMessage) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearValidationError(e) {
        const field = e.target;
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[0-9+\-\s\(\)]{10,15}$/.test(phone);
    }
}

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - perfStart;
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            if (loadTime > 3000) {
                console.warn('Slow page load detected. Consider optimizing resources.');
            }
        });
        
        this.optimizeF5Refresh();
        this.monitorResources();
    }
    
    optimizeF5Refresh() {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        });
        
        window.addEventListener('load', () => {
            const scrollPos = sessionStorage.getItem('scrollPosition');
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos));
                sessionStorage.removeItem('scrollPosition');
            }
        });
        
        if (performance.navigation.type === 1) {
            console.log('Page refreshed (F5)');
            document.body.classList.add('fast-reload');
            
            setTimeout(() => {
                document.body.classList.remove('fast-reload');
            }, 1000);
        }
    }
    
    monitorResources() {
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.error('Resource failed to load:', e.target.src || e.target.href);
                
                if (e.target.tagName === 'LINK' && e.target.rel === 'stylesheet') {
                    setTimeout(() => {
                        e.target.href = e.target.href + '?retry=' + Date.now();
                    }, 1000);
                }
            }
        }, true);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => this.observer.observe(el));
    }
}

// Utility functions
class Utils {
    static throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navigation
    if (typeof Navigation !== 'undefined') {
        new Navigation();
    }
    
    // Initialize Image Quality Enhancer
    if (typeof ImageQualityEnhancer !== 'undefined') {
        new ImageQualityEnhancer();
    }
    
    // Initialize other modules
    new ButtonAnimations();
    new LoadingAnimations();
    new FormHandler();
    new ScrollAnimations();
    new PerformanceMonitor();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Add CSS for animations
    if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }
            
            .error-message {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
            
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            body.fast-reload * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            /* Responsive improvements */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-description {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .hero-buttons {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    width: 100% !important;
                }
                
                .hero-buttons .btn {
                    width: 100% !important;
                    justify-content: center !important;
                    padding: 12px 20px !important;
                }
            }
            
            @media (max-width: 480px) {
                .hero {
                    padding: 80px 0 40px !important;
                }
                
                .hero-title {
                    font-size: 1.8rem !important;
                    margin-bottom: 0.8rem !important;
                }
                
                .hero-image img {
                    max-width: 240px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SHRIMPTECH Main JS loaded');
    
    // Initialize chatbot if available
    if (typeof Chatbot !== 'undefined') {
        try {
            new Chatbot();
            console.log('✅ Chatbot initialized successfully');
        } catch (error) {
            console.warn('⚠️ Chatbot initialization failed:', error);
        }
    }
    
    // Performance logging
    const perfEnd = performance.now();
    console.log(`⚡ Page loaded in ${(perfEnd - perfStart).toFixed(2)}ms`);
});