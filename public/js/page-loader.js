/**
 * Page Loader và Display Optimizer cho SHRIMPTECH
 * Xử lý loading screen và tối ưu hiển thị trang
 */

class PageLoader {
    constructor() {
        this.loadingOverlay = null;
        this.mainContent = null;
        this.loadStartTime = Date.now();
        this.minLoadingTime = 2000; // Tối thiểu 2 giây để thấy animation
        this.init();
    }

    init() {
        // Khởi tạo elements
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.mainContent = document.querySelector('.main-content');
        
        // Bắt đầu loading process
        this.startLoading();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    startLoading() {
        console.log('🚀 SHRIMPTECH: Bắt đầu tải trang...');
        
        // Hiện loading overlay
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
        }
        
        // Ẩn main content
        if (this.mainContent) {
            this.mainContent.classList.remove('loaded');
        }
        
        // Cập nhật loading text động
        this.updateLoadingText();
    }

    updateLoadingText() {
        const loadingTexts = [
            'Khởi tạo hệ thống IoT...',
            'Đang kết nối sensors...',
            'Chuẩn bị dashboard...',
            'Tải hoàn tất!'
        ];
        
        const loadingSubtitle = document.querySelector('.loading-subtitle');
        if (!loadingSubtitle) return;
        
        let currentIndex = 0;
        const textInterval = setInterval(() => {
            if (currentIndex < loadingTexts.length) {
                loadingSubtitle.textContent = loadingTexts[currentIndex];
                currentIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 800);
    }

    preloadCriticalResources() {
        const criticalResources = [
            'assets/Logo.jpg',
            'assets/hero-dashboard.svg',
            'styles.css',
            'js/main.js'
        ];

        const promises = criticalResources.map(resource => {
            return new Promise((resolve, reject) => {
                if (resource.endsWith('.css')) {
                    // Check if CSS is already loaded
                    const link = document.querySelector(`link[href="${resource}"]`);
                    if (link) {
                        link.onload = resolve;
                        link.onerror = reject;
                    } else {
                        resolve();
                    }
                } else if (resource.endsWith('.js')) {
                    // Check if JS is already loaded
                    const script = document.querySelector(`script[src="${resource}"]`);
                    if (script) {
                        script.onload = resolve;
                        script.onerror = reject;
                    } else {
                        resolve();
                    }
                } else {
                    // Preload images
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = resource;
                }
            });
        });

        Promise.allSettled(promises).then(() => {
            console.log('✅ Critical resources preloaded');
            this.checkReadyToShow();
        });
    }

    setupEventListeners() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📄 DOM Content Loaded');
                this.checkReadyToShow();
            });
        } else {
            this.checkReadyToShow();
        }

        // Window Load
        window.addEventListener('load', () => {
            console.log('🎯 Window fully loaded');
            this.checkReadyToShow();
        });

        // Fallback timeout
        setTimeout(() => {
            console.log('⏰ Loading timeout - showing page');
            this.showPage();
        }, 8000); // 8 giây timeout
    }

    checkReadyToShow() {
        const isReady = document.readyState === 'complete' || 
                       document.readyState === 'interactive';
        
        if (isReady) {
            this.ensureMinimumLoadingTime();
        }
    }

    ensureMinimumLoadingTime() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.loadStartTime;
        
        if (elapsedTime >= this.minLoadingTime) {
            this.showPage();
        } else {
            const remainingTime = this.minLoadingTime - elapsedTime;
            setTimeout(() => this.showPage(), remainingTime);
        }
    }

    showPage() {
        console.log('✨ Hiển thị trang SHRIMPTECH');
        
        // Fade out loading overlay
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('fade-out');
            
            setTimeout(() => {
                this.loadingOverlay.style.display = 'none';
            }, 500);
        }
        
        // Fade in main content
        if (this.mainContent) {
            setTimeout(() => {
                this.mainContent.classList.add('loaded');
            }, 250);
        }
        
        // Trigger các animations khác
        this.triggerPageAnimations();
        
        // Log performance
        this.logPerformance();
    }

    triggerPageAnimations() {
        // Trigger hero animations
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.animationDelay = '0.3s';
        }
        
        // Trigger scroll animations nếu có
        if (window.ScrollAnimations) {
            window.ScrollAnimations.refreshAnimations();
        }
        
        // Trigger navigation animations
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('navbar-loaded');
        }
    }

    logPerformance() {
        const loadTime = Date.now() - this.loadStartTime;
        console.log(`📊 Page load completed in ${loadTime}ms`);
        
        // Performance API nếu có
        if (window.performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log(`📈 DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
                console.log(`📈 Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            }
        }
    }
}

// Display Optimizer Class
class DisplayOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.optimizeAnimations();
        this.setupLazyLoading();
        this.optimizeForMobile();
    }

    optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // WebP support check
        this.checkWebPSupport();
    }

    checkWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const support = webP.height === 2;
            document.documentElement.classList.toggle('webp', support);
            document.documentElement.classList.toggle('no-webp', !support);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    optimizeAnimations() {
        // Respect user preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }

        // Optimize CSS animations
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="fade"], [class*="slide"]');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }

    setupLazyLoading() {
        // Lazy load components
        const lazyComponents = document.querySelectorAll('[data-lazy-component]');
        
        if ('IntersectionObserver' in window) {
            const componentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const component = entry.target;
                        const componentName = component.dataset.lazyComponent;
                        this.loadComponent(componentName, component);
                        componentObserver.unobserve(component);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyComponents.forEach(component => {
                componentObserver.observe(component);
            });
        }
    }

    loadComponent(componentName, element) {
        console.log(`🔄 Loading component: ${componentName}`);
        
        switch (componentName) {
            case 'chatbot':
                this.loadChatbot(element);
                break;
            case 'analytics':
                this.loadAnalytics(element);
                break;
            default:
                console.warn(`Unknown component: ${componentName}`);
        }
    }

    loadChatbot(element) {
        // Load chatbot script dynamically
        const script = document.createElement('script');
        script.src = 'js/chatbot.js';
        script.onload = () => {
            element.classList.add('component-loaded');
        };
        document.head.appendChild(script);
    }

    optimizeForMobile() {
        // Mobile-specific optimizations
        if (window.innerWidth <= 768) {
            // Reduce animation complexity on mobile
            document.documentElement.classList.add('mobile-device');
            
            // Touch optimizations
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
    }
}

// Progressive Enhancement
class ProgressiveEnhancer {
    constructor() {
        this.enhance();
    }

    enhance() {
        this.enhanceAccessibility();
        this.enhancePerformance();
        this.enhanceUserExperience();
    }

    enhanceAccessibility() {
        // Skip links
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.documentElement.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.documentElement.classList.remove('keyboard-nav');
        });
    }

    enhancePerformance() {
        // Connection-aware loading
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.documentElement.classList.add('slow-connection');
            }
        }

        // Memory-aware optimizations
        if ('deviceMemory' in navigator) {
            if (navigator.deviceMemory < 4) {
                document.documentElement.classList.add('low-memory');
            }
        }
    }

    enhanceUserExperience() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Focus management
        this.manageFocus();
    }

    manageFocus() {
        // Focus trapping for modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
            });
        });
    }

    closeModal(modal) {
        modal.style.display = 'none';
        // Return focus to trigger element
        const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all optimizers
    window.PageLoader = new PageLoader();
    window.DisplayOptimizer = new DisplayOptimizer();
    window.ProgressiveEnhancer = new ProgressiveEnhancer();
    
    console.log('🎯 SHRIMPTECH Display Optimization initialized');
});

// Export for other modules
window.ShrimpTechLoader = {
    PageLoader,
    DisplayOptimizer,
    ProgressiveEnhancer
};