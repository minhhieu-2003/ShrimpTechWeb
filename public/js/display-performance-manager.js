/**
 * Display Performance Manager
 * Quản lý tối ưu hiển thị và performance cho SHRIMPTECH
 */

class DisplayPerformanceManager {
    constructor() {
        this.isInitialized = false;
        this.performanceMetrics = {};
        this.optimizationSettings = {
            lazyLoadThreshold: 50,
            intersectionThreshold: 0.1,
            debounceDelay: 100,
            animationDuration: 300
        };
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Detect device capabilities
        this.detectDeviceCapabilities();
        
        // Initialize optimizations
        this.initLazyLoading();
        this.initResponsiveImages();
        this.initAnimationOptimization();
        this.initScrollOptimization();
        this.initMemoryOptimization();
        
        // Performance monitoring
        this.startPerformanceMonitoring();
        
        this.isInitialized = true;
        console.log('✅ Display Performance Manager khởi tạo thành công');
    }

    /**
     * Phát hiện khả năng thiết bị
     */
    detectDeviceCapabilities() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        this.deviceInfo = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowEnd: this.detectLowEndDevice(),
            connectionSpeed: connection ? connection.effectiveType : 'unknown',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            screenSize: {
                width: window.screen.width,
                height: window.screen.height
            },
            memoryInfo: 'memory' in performance ? performance.memory : null
        };

        // Apply device-specific optimizations
        this.applyDeviceOptimizations();
        
        console.log('📱 Device capabilities detected:', this.deviceInfo);
    }

    /**
     * Phát hiện thiết bị cấu hình thấp
     */
    detectLowEndDevice() {
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const memoryGB = navigator.deviceMemory || 2;
        
        return hardwareConcurrency <= 2 || memoryGB <= 2;
    }

    /**
     * Áp dụng tối ưu theo thiết bị
     */
    applyDeviceOptimizations() {
        const { isMobile, isLowEnd, connectionSpeed, reducedMotion } = this.deviceInfo;

        document.body.classList.toggle('mobile-device', isMobile);
        document.body.classList.toggle('low-end-device', isLowEnd);
        document.body.classList.toggle('slow-connection', connectionSpeed === 'slow-2g' || connectionSpeed === '2g');
        document.body.classList.toggle('reduced-motion', reducedMotion);
        document.body.classList.toggle('keyboard-nav', false);

        // Detect keyboard navigation
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-nav');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /**
     * Khởi tạo lazy loading
     */
    initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.optimizationSettings.intersectionThreshold,
            rootMargin: `${this.optimizationSettings.lazyLoadThreshold}px`
        });

        // Observe lazy images
        document.querySelectorAll('img[data-src], img.lazy').forEach(img => {
            imageObserver.observe(img);
        });

        // Observe lazy components
        const componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadComponent(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('[data-lazy-component]').forEach(component => {
            componentObserver.observe(component);
        });
    }

    /**
     * Load hình ảnh với tối ưu
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;

        // Create a new image element to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('lazy');
            
            // Apply fade-in animation
            if (!this.deviceInfo.reducedMotion) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            }
        };

        imageLoader.onerror = () => {
            img.classList.add('error');
            console.warn('Failed to load image:', src);
        };

        imageLoader.src = src;
    }

    /**
     * Load component với animation
     */
    loadComponent(component) {
        component.classList.add('component-loaded');
        
        // Trigger any component-specific loading logic
        const loadEvent = new CustomEvent('componentLoaded', {
            detail: { component }
        });
        component.dispatchEvent(loadEvent);
    }

    /**
     * Load tất cả hình ảnh (fallback)
     */
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    /**
     * Khởi tạo responsive images
     */
    initResponsiveImages() {
        // WebP support detection
        const webpSupported = this.supportsWebP();
        document.body.classList.toggle('webp', webpSupported);
        document.body.classList.toggle('no-webp', !webpSupported);

        // Update source sets based on device pixel ratio
        this.updateImageSources();
    }

    /**
     * Kiểm tra hỗ trợ WebP
     */
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * Cập nhật image sources
     */
    updateImageSources() {
        const pixelRatio = window.devicePixelRatio || 1;
        const isRetina = pixelRatio > 1;

        document.querySelectorAll('img[data-src-2x]').forEach(img => {
            if (isRetina) {
                img.dataset.src = img.dataset.src2x;
            }
        });
    }

    /**
     * Tối ưu animation
     */
    initAnimationOptimization() {
        // Reduce animations on slow devices
        if (this.deviceInfo.isLowEnd || this.deviceInfo.reducedMotion) {
            document.body.classList.add('reduce-animations');
        }

        // Pause animations when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Optimize scroll-triggered animations
        this.initScrollAnimations();
    }

    /**
     * Tạm dừng animations
     */
    pauseAnimations() {
        document.querySelectorAll('[style*="animation"]').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    /**
     * Tiếp tục animations
     */
    resumeAnimations() {
        document.querySelectorAll('[style*="animation"]').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    /**
     * Khởi tạo scroll animations
     */
    initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.fade-in, .slide-up, [data-animate]').forEach(element => {
            animationObserver.observe(element);
        });
    }

    /**
     * Tối ưu scroll performance
     */
    initScrollOptimization() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollElements();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Debounced scroll handler
        window.addEventListener('scroll', this.debounce(handleScroll, this.optimizationSettings.debounceDelay), {
            passive: true
        });

        // Optimize navbar scroll behavior
        this.initNavbarScrollOptimization();
    }

    /**
     * Cập nhật elements theo scroll
     */
    updateScrollElements() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 50);
        }

        // Update scroll progress
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const progress = scrollTop / (docHeight - winHeight);
            scrollProgress.style.width = `${progress * 100}%`;
        }
    }

    /**
     * Tối ưu navbar scroll
     */
    initNavbarScrollOptimization() {
        let lastScrollTop = 0;
        let delta = 5;
        let navbarHeight = 70;

        const handleNavbarScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                // Scroll down
                navbar.classList.add('nav-up');
            } else {
                // Scroll up
                navbar.classList.remove('nav-up');
            }

            lastScrollTop = scrollTop;
        };

        window.addEventListener('scroll', this.debounce(handleNavbarScroll, 100), {
            passive: true
        });
    }

    /**
     * Tối ưu memory
     */
    initMemoryOptimization() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000); // Check every 30 seconds
        }

        // Clean up unused event listeners
        this.cleanupEventListeners();

        // Optimize image cache
        this.optimizeImageCache();
    }

    /**
     * Kiểm tra memory usage
     */
    checkMemoryUsage() {
        if (!('memory' in performance)) return;

        const memory = performance.memory;
        const usedPercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;

        if (usedPercent > 80) {
            console.warn('⚠️ High memory usage detected:', usedPercent.toFixed(2) + '%');
            this.triggerMemoryCleanup();
        }

        this.performanceMetrics.memory = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            usedPercent: usedPercent
        };
    }

    /**
     * Kích hoạt memory cleanup
     */
    triggerMemoryCleanup() {
        // Remove unused images from DOM
        document.querySelectorAll('img.loaded:not([src])').forEach(img => {
            if (img.offsetParent === null) { // Not visible
                img.remove();
            }
        });

        // Clear cached data
        if (window.pageCache) {
            window.pageCache.clear();
        }

        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Cleanup event listeners
     */
    cleanupEventListeners() {
        // Store references to event listeners for cleanup
        this.eventListeners = new Map();
        
        // Override addEventListener to track listeners
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (!this._eventListeners) this._eventListeners = [];
            this._eventListeners.push({ type, listener, options });
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    /**
     * Tối ưu image cache
     */
    optimizeImageCache() {
        // Preload critical images
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            this.preloadImage(img.src || img.dataset.src);
        });

        // Remove unused images from cache periodically
        setInterval(() => {
            this.cleanImageCache();
        }, 300000); // Every 5 minutes
    }

    /**
     * Preload image
     */
    preloadImage(src) {
        if (!src) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }

    /**
     * Clean image cache
     */
    cleanImageCache() {
        // Remove preload links for images no longer visible
        document.querySelectorAll('link[rel="preload"][as="image"]').forEach(link => {
            const img = document.querySelector(`img[src="${link.href}"]`);
            if (!img || img.offsetParent === null) {
                link.remove();
            }
        });
    }

    /**
     * Bắt đầu performance monitoring
     */
    startPerformanceMonitoring() {
        if (!('PerformanceObserver' in window)) return;

        // Monitor paint metrics
        this.observePaintMetrics();
        
        // Monitor layout shifts
        this.observeLayoutShifts();
        
        // Monitor long tasks
        this.observeLongTasks();

        // Display performance monitor if debug mode
        if (localStorage.getItem('shrimptech_debug') === 'true') {
            this.showPerformanceMonitor();
        }
    }

    /**
     * Observe paint metrics
     */
    observePaintMetrics() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.performanceMetrics[entry.name] = entry.startTime;
                });
            });
            observer.observe({ entryTypes: ['paint'] });
        } catch (error) {
            console.warn('Paint metrics observation not supported');
        }
    }

    /**
     * Observe layout shifts
     */
    observeLayoutShifts() {
        try {
            const observer = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.warn('Layout shift observation not supported');
        }
    }

    /**
     * Observe long tasks
     */
    observeLongTasks() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry.duration + 'ms');
                        this.performanceMetrics.longTasks = (this.performanceMetrics.longTasks || 0) + 1;
                    }
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (error) {
            console.warn('Long task observation not supported');
        }
    }

    /**
     * Hiển thị performance monitor
     */
    showPerformanceMonitor() {
        const monitor = document.createElement('div');
        monitor.className = 'perf-monitor show';
        monitor.innerHTML = `
            <div>FCP: <span id="fcp-value">-</span>ms</div>
            <div>LCP: <span id="lcp-value">-</span>ms</div>
            <div>CLS: <span id="cls-value">-</span></div>
            <div>Memory: <span id="memory-value">-</span>%</div>
        `;
        document.body.appendChild(monitor);

        // Update monitor every second
        setInterval(() => {
            this.updatePerformanceMonitor();
        }, 1000);
    }

    /**
     * Cập nhật performance monitor
     */
    updatePerformanceMonitor() {
        const fcpElement = document.getElementById('fcp-value');
        const lcpElement = document.getElementById('lcp-value');
        const clsElement = document.getElementById('cls-value');
        const memoryElement = document.getElementById('memory-value');

        if (fcpElement && this.performanceMetrics['first-contentful-paint']) {
            fcpElement.textContent = Math.round(this.performanceMetrics['first-contentful-paint']);
        }

        if (lcpElement && this.performanceMetrics['largest-contentful-paint']) {
            lcpElement.textContent = Math.round(this.performanceMetrics['largest-contentful-paint']);
        }

        if (clsElement && this.performanceMetrics.cls !== undefined) {
            clsElement.textContent = this.performanceMetrics.cls.toFixed(3);
        }

        if (memoryElement && this.performanceMetrics.memory) {
            memoryElement.textContent = this.performanceMetrics.memory.usedPercent.toFixed(1);
        }
    }

    /**
     * Debounce utility
     */
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

    /**
     * Lấy performance metrics
     */
    getMetrics() {
        return {
            ...this.performanceMetrics,
            deviceInfo: this.deviceInfo,
            timestamp: Date.now()
        };
    }

    /**
     * Export performance report
     */
    exportPerformanceReport() {
        const report = {
            metrics: this.getMetrics(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            settings: this.optimizationSettings
        };

        console.log('📊 Performance Report:', report);
        return report;
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Cleanup event listeners
        this.eventListeners?.forEach((listeners, element) => {
            listeners.forEach(({ type, listener, options }) => {
                element.removeEventListener(type, listener, options);
            });
        });

        // Remove performance monitor
        const monitor = document.querySelector('.perf-monitor');
        if (monitor) {
            monitor.remove();
        }

        this.isInitialized = false;
        console.log('🗑️ Display Performance Manager destroyed');
    }
}

// Global initialization
window.DisplayPerformanceManager = DisplayPerformanceManager;

// Auto-initialize when DOM is ready - with coordination
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for PageLoader to initialize first
        setTimeout(() => {
            if (!window.displayManager) {
                window.displayManager = new DisplayPerformanceManager();
            }
        }, 100);
    });
} else {
    // Check if not already initialized by PageLoader
    setTimeout(() => {
        if (!window.displayManager) {
            window.displayManager = new DisplayPerformanceManager();
        }
    }, 100);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayPerformanceManager;
}