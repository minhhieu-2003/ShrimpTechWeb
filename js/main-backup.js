// SHRIMP TECH Website - Main JavaScript
// Optimized for smooth F5 refresh and performance

// Performance monitoring
const perfStart = performance.now();

// Preload critical resources
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload next likely pages
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
        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
    }
    
    toggleMobileMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', !isExpanded);
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Update ARIA attributes
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
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.createRipple);
        });
        
        // Hover effects for cards
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
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initial animations
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
        
        // Observe elements
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        // Animate hero content
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
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm);
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm);
        }
        
        // Form validation
        this.setupFormValidation();
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate form submission
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
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField);
            field.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate
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
    new Navigation();
    new ButtonAnimations();
    new LoadingAnimations();
    new FormHandler();
    new ScrollAnimations();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, prompt user to refresh
                                    if (confirm('Có phiên bản mới của website. Bạn có muốn cập nhật không?')) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Handle page visibility changes (for F5 optimization)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, check for updates
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'CHECK_UPDATE'
                });
            }
        }
    });
    
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
            
            /* F5 Refresh Optimization */
            body.fast-reload * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) */
            html[style*="visibility: hidden"] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            
            html[style*="visibility: visible"] {
                opacity: 1;
            }
            
            /* Team Grid Responsive Layout */
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .team-member {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .team-member:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .member-avatar {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0066cc, #3385d6);
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .team-member h4 {
                color: #0066cc;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .team-member p {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .team-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .team-member {
                    padding: 1rem;
                }
                
                .member-avatar {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
            
            /* Hero Section Responsive Improvements */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-break {
                    display: block !important;
                }
                
                .hero-description {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .hero-stats {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    margin-bottom: 2rem !important;
                }
                
                .hero-stat {
                    text-align: center !important;
                    min-width: auto !important;
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
                
                .hero-container {
                    grid-template-columns: 1fr !important;
                    gap: 2rem !important;
                    text-align: center !important;
                }
                
                .hero-visual {
                    order: -1 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 280px !important;
                    height: auto !important;
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
                
                .hero-description {
                    font-size: 0.9rem !important;
                    margin-bottom: 1.2rem !important;
                }
                
                .hero-badge {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 240px !important;
                }
                
                .feature-pill {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - perfStart;
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            // Report slow loads
            if (loadTime > 3000) {
                console.warn('Slow page load detected. Consider optimizing resources.');
            }
        });
        
        // Handle F5 refresh optimization
        this.optimizeF5Refresh();
        
        // Monitor resource loading
        this.monitorResources();
    }
    
    optimizeF5Refresh() {
        // Store scroll position before unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        });
        
        // Restore scroll position after load
        window.addEventListener('load', () => {
            const scrollPos = sessionStorage.getItem('scrollPosition');
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos));
                sessionStorage.removeItem('scrollPosition');
            }
        });
        
        // Fast refresh detection
        if (performance.navigation.type === 1) { // Reload
            console.log('Page refreshed (F5)');
            document.body.classList.add('fast-reload');
            
            // Remove fast-reload class after animations
            setTimeout(() => {
                document.body.classList.remove('fast-reload');
            }, 1000);
        }
    }
    
    monitorResources() {
        // Monitor failed resource loads
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.error('Resource failed to load:', e.target.src || e.target.href);
                
                // Retry loading critical resources
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
        // Create intersection observer for scroll animations
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
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => this.observer.observe(el));
    }
}

// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.widget = document.getElementById('chatbot-widget');
        this.toggle = document.getElementById('chatbot-toggle');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('chatbot-send');
        this.notification = document.getElementById('chat-notification');
        this.quickReplies = document.querySelectorAll('.quick-reply');
        
        this.init();
    }
    
    init() {
        if (!this.widget) return;
        
        // Make chatbot globally accessible for smart suggestions
        window.chatbot = this;
        
        // Enhanced accessibility setup
        this.setupAccessibility();
        
        // Event listeners
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup smart input with auto-complete
        this.setupSmartInput();
        
        // Quick replies with AI enhancement
        this.quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendUserMessage(message);
            });
        });
        
        // Auto-focus input when chat opens with better UX
        this.setupFocusManagement();
        
        // Show notification after 5 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 5000);
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    setupAccessibility() {
        // Enhanced ARIA labels and descriptions
        this.toggle.setAttribute('aria-label', 'Mở chatbot hỗ trợ SHRIMP TECH');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.container.setAttribute('role', 'dialog');
        this.container.setAttribute('aria-labelledby', 'chatbot-title');
        this.messagesContainer.setAttribute('role', 'log');
        this.messagesContainer.setAttribute('aria-live', 'polite');
        this.inputField.setAttribute('aria-label', 'Nhập câu hỏi cho chatbot');
        
        // Screen reader announcements
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(this.announcer);
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard support
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            } else if (e.key === 'Escape') {
                this.closeChat();
            } else if (e.key === 'ArrowUp' && this.inputField.value === '') {
                // Navigate to last message for editing
                const lastUserMessage = this.getLastUserMessage();
                if (lastUserMessage) {
                    this.inputField.value = lastUserMessage;
                }
            }
        });
        
        // Tab navigation for quick replies
        this.quickReplies.forEach((btn, index) => {
            btn.setAttribute('tabindex', '0');
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }
    
    setupFocusManagement() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('open')) {
                    // Improved focus management
                    requestAnimationFrame(() => {
                        this.inputField.focus();
                        this.announceToScreenReader('Chatbot đã mở. Bạn có thể nhập câu hỏi.');
                        
                        // Show welcome AI message with delay
                        setTimeout(() => {
                            this.showAIWelcomeMessage();
                        }, 500);
                    });
                }
            });
        });
        
        observer.observe(this.container, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor response times
        this.performanceData = {
            responses: [],
            startTime: performance.now()
        };
        
        // Track memory usage if available
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    timestamp: Date.now()
                };
                
                // Alert if memory usage is too high
                if (memoryInfo.used > memoryInfo.total * 0.8) {
                    console.warn('⚠️ High memory usage detected in chatbot');
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    getLastUserMessage() {
        const messages = this.messagesContainer.querySelectorAll('.user-message .message-body');
        if (messages.length > 0) {
            return messages[messages.length - 1].textContent.trim();
        }
        return null;
    }
}

// Loading animations
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initial animations
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
        
        // Observe elements
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        // Animate hero content
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
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm);
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm);
        }
        
        // Form validation
        this.setupFormValidation();
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate form submission
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
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField);
            field.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate
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
    new Navigation();
    new ButtonAnimations();
    new LoadingAnimations();
    new FormHandler();
    new ScrollAnimations();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, prompt user to refresh
                                    if (confirm('Có phiên bản mới của website. Bạn có muốn cập nhật không?')) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Handle page visibility changes (for F5 optimization)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, check for updates
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'CHECK_UPDATE'
                });
            }
        }
    });
    
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
            
            /* F5 Refresh Optimization */
            body.fast-reload * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) */
            html[style*="visibility: hidden"] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            
            html[style*="visibility: visible"] {
                opacity: 1;
            }
            
            /* Team Grid Responsive Layout */
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .team-member {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .team-member:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .member-avatar {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0066cc, #3385d6);
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .team-member h4 {
                color: #0066cc;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .team-member p {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .team-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .team-member {
                    padding: 1rem;
                }
                
                .member-avatar {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
            
            /* Hero Section Responsive Improvements */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-break {
                    display: block !important;
                }
                
                .hero-description {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .hero-stats {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    margin-bottom: 2rem !important;
                }
                
                .hero-stat {
                    text-align: center !important;
                    min-width: auto !important;
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
                
                .hero-container {
                    grid-template-columns: 1fr !important;
                    gap: 2rem !important;
                    text-align: center !important;
                }
                
                .hero-visual {
                    order: -1 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 280px !important;
                    height: auto !important;
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
                
                .hero-description {
                    font-size: 0.9rem !important;
                    margin-bottom: 1.2rem !important;
                }
                
                .hero-badge {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 240px !important;
                }
                
                .feature-pill {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - perfStart;
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            // Report slow loads
            if (loadTime > 3000) {
                console.warn('Slow page load detected. Consider optimizing resources.');
            }
        });
        
        // Handle F5 refresh optimization
        this.optimizeF5Refresh();
        
        // Monitor resource loading
        this.monitorResources();
    }
    
    optimizeF5Refresh() {
        // Store scroll position before unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        });
        
        // Restore scroll position after load
        window.addEventListener('load', () => {
            const scrollPos = sessionStorage.getItem('scrollPosition');
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos));
                sessionStorage.removeItem('scrollPosition');
            }
        });
        
        // Fast refresh detection
        if (performance.navigation.type === 1) { // Reload
            console.log('Page refreshed (F5)');
            document.body.classList.add('fast-reload');
            
            // Remove fast-reload class after animations
            setTimeout(() => {
                document.body.classList.remove('fast-reload');
            }, 1000);
        }
    }
    
    monitorResources() {
        // Monitor failed resource loads
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.error('Resource failed to load:', e.target.src || e.target.href);
                
                // Retry loading critical resources
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
        // Create intersection observer for scroll animations
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
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => this.observer.observe(el));
    }
}

// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.widget = document.getElementById('chatbot-widget');
        this.toggle = document.getElementById('chatbot-toggle');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('chatbot-send');
        this.notification = document.getElementById('chat-notification');
        this.quickReplies = document.querySelectorAll('.quick-reply');
        
        this.init();
    }
    
    init() {
        if (!this.widget) return;
        
        // Make chatbot globally accessible for smart suggestions
        window.chatbot = this;
        
        // Enhanced accessibility setup
        this.setupAccessibility();
        
        // Event listeners
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup smart input with auto-complete
        this.setupSmartInput();
        
        // Quick replies with AI enhancement
        this.quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendUserMessage(message);
            });
        });
        
        // Auto-focus input when chat opens with better UX
        this.setupFocusManagement();
        
        // Show notification after 5 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 5000);
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    setupAccessibility() {
        // Enhanced ARIA labels and descriptions
        this.toggle.setAttribute('aria-label', 'Mở chatbot hỗ trợ SHRIMP TECH');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.container.setAttribute('role', 'dialog');
        this.container.setAttribute('aria-labelledby', 'chatbot-title');
        this.messagesContainer.setAttribute('role', 'log');
        this.messagesContainer.setAttribute('aria-live', 'polite');
        this.inputField.setAttribute('aria-label', 'Nhập câu hỏi cho chatbot');
        
        // Screen reader announcements
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(this.announcer);
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard support
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            } else if (e.key === 'Escape') {
                this.closeChat();
            } else if (e.key === 'ArrowUp' && this.inputField.value === '') {
                // Navigate to last message for editing
                const lastUserMessage = this.getLastUserMessage();
                if (lastUserMessage) {
                    this.inputField.value = lastUserMessage;
                }
            }
        });
        
        // Tab navigation for quick replies
        this.quickReplies.forEach((btn, index) => {
            btn.setAttribute('tabindex', '0');
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }
    
    setupFocusManagement() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('open')) {
                    // Improved focus management
                    requestAnimationFrame(() => {
                        this.inputField.focus();
                        this.announceToScreenReader('Chatbot đã mở. Bạn có thể nhập câu hỏi.');
                        
                        // Show welcome AI message with delay
                        setTimeout(() => {
                            this.showAIWelcomeMessage();
                        }, 500);
                    });
                }
            });
        });
        
        observer.observe(this.container, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor response times
        this.performanceData = {
            responses: [],
            startTime: performance.now()
        };
        
        // Track memory usage if available
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    timestamp: Date.now()
                };
                
                // Alert if memory usage is too high
                if (memoryInfo.used > memoryInfo.total * 0.8) {
                    console.warn('⚠️ High memory usage detected in chatbot');
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    getLastUserMessage() {
        const messages = this.messagesContainer.querySelectorAll('.user-message .message-body');
        if (messages.length > 0) {
            return messages[messages.length - 1].textContent.trim();
        }
        return null;
    }
}

// Loading animations
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initial animations
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
        
        // Observe elements
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        // Animate hero content
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
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm);
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm);
        }
        
        // Form validation
        this.setupFormValidation();
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate form submission
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
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField);
            field.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate
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
    new Navigation();
    new ButtonAnimations();
    new LoadingAnimations();
    new FormHandler();
    new ScrollAnimations();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, prompt user to refresh
                                    if (confirm('Có phiên bản mới của website. Bạn có muốn cập nhật không?')) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Handle page visibility changes (for F5 optimization)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, check for updates
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'CHECK_UPDATE'
                });
            }
        }
    });
    
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
            
            /* F5 Refresh Optimization */
            body.fast-reload * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) */
            html[style*="visibility: hidden"] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            
            html[style*="visibility: visible"] {
                opacity: 1;
            }
            
            /* Team Grid Responsive Layout */
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .team-member {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .team-member:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .member-avatar {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0066cc, #3385d6);
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .team-member h4 {
                color: #0066cc;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .team-member p {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .team-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .team-member {
                    padding: 1rem;
                }
                
                .member-avatar {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
            
            /* Hero Section Responsive Improvements */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-break {
                    display: block !important;
                }
                
                .hero-description {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .hero-stats {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    margin-bottom: 2rem !important;
                }
                
                .hero-stat {
                    text-align: center !important;
                    min-width: auto !important;
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
                
                .hero-container {
                    grid-template-columns: 1fr !important;
                    gap: 2rem !important;
                    text-align: center !important;
                }
                
                .hero-visual {
                    order: -1 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 280px !important;
                    height: auto !important;
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
                
                .hero-description {
                    font-size: 0.9rem !important;
                    margin-bottom: 1.2rem !important;
                }
                
                .hero-badge {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 240px !important;
                }
                
                .feature-pill {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - perfStart;
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            // Report slow loads
            if (loadTime > 3000) {
                console.warn('Slow page load detected. Consider optimizing resources.');
            }
        });
        
        // Handle F5 refresh optimization
        this.optimizeF5Refresh();
        
        // Monitor resource loading
        this.monitorResources();
    }
    
    optimizeF5Refresh() {
        // Store scroll position before unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        });
        
        // Restore scroll position after load
        window.addEventListener('load', () => {
            const scrollPos = sessionStorage.getItem('scrollPosition');
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos));
                sessionStorage.removeItem('scrollPosition');
            }
        });
        
        // Fast refresh detection
        if (performance.navigation.type === 1) { // Reload
            console.log('Page refreshed (F5)');
            document.body.classList.add('fast-reload');
            
            // Remove fast-reload class after animations
            setTimeout(() => {
                document.body.classList.remove('fast-reload');
            }, 1000);
        }
    }
    
    monitorResources() {
        // Monitor failed resource loads
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.error('Resource failed to load:', e.target.src || e.target.href);
                
                // Retry loading critical resources
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
        // Create intersection observer for scroll animations
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
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => this.observer.observe(el));
    }
}

// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.widget = document.getElementById('chatbot-widget');
        this.toggle = document.getElementById('chatbot-toggle');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('chatbot-send');
        this.notification = document.getElementById('chat-notification');
        this.quickReplies = document.querySelectorAll('.quick-reply');
        
        this.init();
    }
    
    init() {
        if (!this.widget) return;
        
        // Make chatbot globally accessible for smart suggestions
        window.chatbot = this;
        
        // Enhanced accessibility setup
        this.setupAccessibility();
        
        // Event listeners
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup smart input with auto-complete
        this.setupSmartInput();
        
        // Quick replies with AI enhancement
        this.quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendUserMessage(message);
            });
        });
        
        // Auto-focus input when chat opens with better UX
        this.setupFocusManagement();
        
        // Show notification after 5 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 5000);
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    setupAccessibility() {
        // Enhanced ARIA labels and descriptions
        this.toggle.setAttribute('aria-label', 'Mở chatbot hỗ trợ SHRIMP TECH');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.container.setAttribute('role', 'dialog');
        this.container.setAttribute('aria-labelledby', 'chatbot-title');
        this.messagesContainer.setAttribute('role', 'log');
        this.messagesContainer.setAttribute('aria-live', 'polite');
        this.inputField.setAttribute('aria-label', 'Nhập câu hỏi cho chatbot');
        
        // Screen reader announcements
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(this.announcer);
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard support
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            } else if (e.key === 'Escape') {
                this.closeChat();
            } else if (e.key === 'ArrowUp' && this.inputField.value === '') {
                // Navigate to last message for editing
                const lastUserMessage = this.getLastUserMessage();
                if (lastUserMessage) {
                    this.inputField.value = lastUserMessage;
                }
            }
        });
        
        // Tab navigation for quick replies
        this.quickReplies.forEach((btn, index) => {
            btn.setAttribute('tabindex', '0');
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }
    
    setupFocusManagement() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('open')) {
                    // Improved focus management
                    requestAnimationFrame(() => {
                        this.inputField.focus();
                        this.announceToScreenReader('Chatbot đã mở. Bạn có thể nhập câu hỏi.');
                        
                        // Show welcome AI message with delay
                        setTimeout(() => {
                            this.showAIWelcomeMessage();
                        }, 500);
                    });
                }
            });
        });
        
        observer.observe(this.container, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor response times
        this.performanceData = {
            responses: [],
            startTime: performance.now()
        };
        
        // Track memory usage if available
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    timestamp: Date.now()
                };
                
                // Alert if memory usage is too high
                if (memoryInfo.used > memoryInfo.total * 0.8) {
                    console.warn('⚠️ High memory usage detected in chatbot');
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    getLastUserMessage() {
        const messages = this.messagesContainer.querySelectorAll('.user-message .message-body');
        if (messages.length > 0) {
            return messages[messages.length - 1].textContent.trim();
        }
        return null;
    }
}

// Loading animations
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initial animations
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
        
        // Observe elements
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        // Animate hero content
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
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm);
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm);
        }
        
        // Form validation
        this.setupFormValidation();
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate form submission
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
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField);
            field.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate
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
        }