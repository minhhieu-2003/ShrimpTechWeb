// SHRIMP TECH Website - Main JavaScript (CLEANED VERSION - NO DUPLICATES)
// All duplicate classes removed - use individual module files instead

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
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navigation (if class exists from module)
    if (typeof Navigation !== 'undefined') {
        new Navigation();
    }
    
    // Initialize Button Animations (if class exists from module)
    if (typeof ButtonAnimations !== 'undefined') {
        new ButtonAnimations();
    }
    
    // Initialize Loading Animations (if class exists from module)
    if (typeof LoadingAnimations !== 'undefined') {
        new LoadingAnimations();
    }
    
    // Initialize Scroll Animations (if class exists from module)
    if (typeof ScrollAnimations !== 'undefined') {
        new ScrollAnimations();
    }
    
    // Initialize Image Quality Enhancer (if class exists from module)
    if (typeof ImageQualityEnhancer !== 'undefined') {
        new ImageQualityEnhancer();
    }
    
    // Always initialize performance monitor
    new PerformanceMonitor();
    
    // Register Service Worker (only in production)
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🚧 Service Worker disabled in development mode');
        // Unregister any existing service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister();
                    console.log('🗑️ Unregistered service worker:', registration.scope);
                }
            });
        }
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

// Initialize chatbot if available
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SHRIMPTECH Main JS loaded (No duplicates version)');
    
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