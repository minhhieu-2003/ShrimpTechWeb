/**
 * Performance Monitor Component
 * Giám sát hiệu suất và tối ưu hóa
 */
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - (window.perfStart || 0);
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

// Export for use in other modules
window.PerformanceMonitor = PerformanceMonitor;
