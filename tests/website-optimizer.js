/**
 * ShrimpTech Website Optimizer
 * Tự động tối ưu hóa performance cho website
 */

class ShrimpTechOptimizer {
    constructor() {
        this.optimizations = [];
        this.currentOptimizations = 0;
        this.totalOptimizations = 0;
    }
    
    /**
     * Optimize images for better performance
     */
    async optimizeImages() {
        console.log('🖼️ Starting image optimization...');
        
        try {
            const images = document.querySelectorAll('img');
            let optimizedCount = 0;
            
            images.forEach((img, index) => {
                // Add lazy loading
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                    optimizedCount++;
                }
                
                // Add proper alt text if missing
                if (!img.alt || img.alt.trim() === '') {
                    img.alt = `Image ${index + 1}`;
                    optimizedCount++;
                }
                
                // Add responsive image attributes
                if (!img.hasAttribute('sizes')) {
                    img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
                }
            });
            
            this.optimizations.push({
                type: 'Image Optimization',
                description: `Optimized ${optimizedCount} images with lazy loading and alt text`,
                impact: 'High',
                status: 'completed'
            });
            
            console.log(`✅ Optimized ${optimizedCount} images`);
            return optimizedCount;
            
        } catch (error) {
            console.error('❌ Image optimization failed:', error);
            this.optimizations.push({
                type: 'Image Optimization',
                description: 'Failed to optimize images',
                impact: 'High',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Minify CSS inline
     */
    async optimizeCSS() {
        console.log('🎨 Starting CSS optimization...');
        
        try {
            const styleSheets = document.querySelectorAll('style');
            let optimizedRules = 0;
            
            styleSheets.forEach(styleSheet => {
                if (styleSheet.textContent) {
                    // Basic CSS minification
                    const original = styleSheet.textContent;
                    const minified = original
                        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                        .replace(/\s+/g, ' ') // Collapse whitespace
                        .replace(/;\s*}/g, '}') // Remove last semicolon
                        .replace(/\s*{\s*/g, '{') // Clean braces
                        .replace(/\s*}\s*/g, '}')
                        .replace(/\s*;\s*/g, ';')
                        .replace(/\s*:\s*/g, ':')
                        .trim();
                    
                    if (minified.length < original.length) {
                        styleSheet.textContent = minified;
                        optimizedRules++;
                    }
                }
            });
            
            this.optimizations.push({
                type: 'CSS Optimization',
                description: `Minified ${optimizedRules} inline stylesheets`,
                impact: 'Medium',
                status: 'completed'
            });
            
            console.log(`✅ Optimized ${optimizedRules} CSS stylesheets`);
            return optimizedRules;
            
        } catch (error) {
            console.error('❌ CSS optimization failed:', error);
            this.optimizations.push({
                type: 'CSS Optimization',
                description: 'Failed to optimize CSS',
                impact: 'Medium',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Optimize JavaScript execution
     */
    async optimizeJavaScript() {
        console.log('🔧 Starting JavaScript optimization...');
        
        try {
            const scripts = document.querySelectorAll('script[src]');
            let optimizedScripts = 0;
            
            scripts.forEach(script => {
                // Add async/defer if not present
                if (!script.async && !script.defer) {
                    // Use defer for scripts that don't need immediate execution
                    if (!script.src.includes('critical') && !script.src.includes('inline')) {
                        script.defer = true;
                        optimizedScripts++;
                    }
                }
            });
            
            // Remove duplicate scripts
            const scriptSources = new Set();
            const duplicates = [];
            
            scripts.forEach(script => {
                if (scriptSources.has(script.src)) {
                    duplicates.push(script);
                } else {
                    scriptSources.add(script.src);
                }
            });
            
            duplicates.forEach(script => {
                script.remove();
                optimizedScripts++;
            });
            
            this.optimizations.push({
                type: 'JavaScript Optimization',
                description: `Added defer to ${optimizedScripts} scripts and removed ${duplicates.length} duplicates`,
                impact: 'High',
                status: 'completed'
            });
            
            console.log(`✅ Optimized ${optimizedScripts} JavaScript files`);
            return optimizedScripts;
            
        } catch (error) {
            console.error('❌ JavaScript optimization failed:', error);
            this.optimizations.push({
                type: 'JavaScript Optimization',
                description: 'Failed to optimize JavaScript',
                impact: 'High',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Enable browser caching headers (meta tags)
     */
    async enableCaching() {
        console.log('💾 Enabling browser caching...');
        
        try {
            const head = document.head;
            let cacheHeaders = 0;
            
            // Add cache control meta tags
            const cacheMetaTags = [
                { httpEquiv: 'Cache-Control', content: 'public, max-age=31536000' },
                { httpEquiv: 'Expires', content: new Date(Date.now() + 31536000000).toUTCString() },
                { httpEquiv: 'Pragma', content: 'cache' }
            ];
            
            cacheMetaTags.forEach(tag => {
                const existing = document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`);
                if (!existing) {
                    const meta = document.createElement('meta');
                    meta.httpEquiv = tag.httpEquiv;
                    meta.content = tag.content;
                    head.appendChild(meta);
                    cacheHeaders++;
                }
            });
            
            this.optimizations.push({
                type: 'Browser Caching',
                description: `Added ${cacheHeaders} cache control headers`,
                impact: 'Medium',
                status: 'completed'
            });
            
            console.log(`✅ Added ${cacheHeaders} cache headers`);
            return cacheHeaders;
            
        } catch (error) {
            console.error('❌ Caching optimization failed:', error);
            this.optimizations.push({
                type: 'Browser Caching',
                description: 'Failed to enable caching',
                impact: 'Medium',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Optimize fonts loading
     */
    async optimizeFonts() {
        console.log('🔤 Optimizing font loading...');
        
        try {
            const fontLinks = document.querySelectorAll('link[href*="fonts"]');
            let optimizedFonts = 0;
            
            fontLinks.forEach(link => {
                // Add font-display: swap for better loading
                if (!link.hasAttribute('rel') || link.rel !== 'preload') {
                    // Add preload for critical fonts
                    if (link.href.includes('primary') || link.href.includes('main')) {
                        link.rel = 'preload';
                        link.as = 'font';
                        link.crossOrigin = '';
                        optimizedFonts++;
                    }
                }
            });
            
            // Add font-display CSS
            const fontCSS = document.createElement('style');
            fontCSS.textContent = `
                @font-face {
                    font-display: swap;
                }
                * {
                    font-display: swap;
                }
            `;
            document.head.appendChild(fontCSS);
            optimizedFonts++;
            
            this.optimizations.push({
                type: 'Font Optimization',
                description: `Optimized ${optimizedFonts} font resources with preload and font-display`,
                impact: 'Medium',
                status: 'completed'
            });
            
            console.log(`✅ Optimized ${optimizedFonts} font resources`);
            return optimizedFonts;
            
        } catch (error) {
            console.error('❌ Font optimization failed:', error);
            this.optimizations.push({
                type: 'Font Optimization',
                description: 'Failed to optimize fonts',
                impact: 'Medium',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Add Service Worker for caching
     */
    async enableServiceWorker() {
        console.log('⚙️ Setting up Service Worker...');
        
        try {
            if ('serviceWorker' in navigator) {
                // Check if SW already exists
                const registration = await navigator.serviceWorker.getRegistration();
                
                if (!registration) {
                    // Create basic service worker
                    const swCode = `
                        const CACHE_NAME = 'shrimptech-v1';
                        const urlsToCache = [
                            '/',
                            '/styles.css',
                            '/js/main.js',
                            '/assets/Logo.jpg'
                        ];
                        
                        self.addEventListener('install', event => {
                            event.waitUntil(
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.addAll(urlsToCache))
                            );
                        });
                        
                        self.addEventListener('fetch', event => {
                            event.respondWith(
                                caches.match(event.request)
                                    .then(response => {
                                        return response || fetch(event.request);
                                    })
                            );
                        });
                    `;
                    
                    // Create blob URL for service worker
                    const swBlob = new Blob([swCode], { type: 'application/javascript' });
                    const swUrl = URL.createObjectURL(swBlob);
                    
                    await navigator.serviceWorker.register(swUrl);
                    
                    this.optimizations.push({
                        type: 'Service Worker',
                        description: 'Enabled Service Worker for offline caching',
                        impact: 'High',
                        status: 'completed'
                    });
                    
                    console.log('✅ Service Worker registered successfully');
                    return 1;
                } else {
                    this.optimizations.push({
                        type: 'Service Worker',
                        description: 'Service Worker already active',
                        impact: 'High',
                        status: 'already_optimized'
                    });
                    
                    console.log('ℹ️ Service Worker already registered');
                    return 0;
                }
            } else {
                throw new Error('Service Worker not supported');
            }
            
        } catch (error) {
            console.error('❌ Service Worker setup failed:', error);
            this.optimizations.push({
                type: 'Service Worker',
                description: 'Failed to setup Service Worker',
                impact: 'High',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Optimize DOM structure
     */
    async optimizeDOM() {
        console.log('🏗️ Optimizing DOM structure...');
        
        try {
            let optimizations = 0;
            
            // Remove empty elements
            const emptyElements = document.querySelectorAll('div:empty, span:empty, p:empty');
            emptyElements.forEach(el => {
                if (!el.hasChildNodes() && !el.textContent.trim()) {
                    el.remove();
                    optimizations++;
                }
            });
            
            // Add missing meta tags for SEO
            const head = document.head;
            const requiredMetas = [
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
                { name: 'description', content: 'ShrimpTech - Professional Web Solutions' },
                { name: 'robots', content: 'index, follow' }
            ];
            
            requiredMetas.forEach(meta => {
                const existing = document.querySelector(`meta[name="${meta.name}"]`);
                if (!existing) {
                    const metaEl = document.createElement('meta');
                    metaEl.name = meta.name;
                    metaEl.content = meta.content;
                    head.appendChild(metaEl);
                    optimizations++;
                }
            });
            
            // Optimize table structures
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                if (!table.querySelector('thead') && table.querySelector('th')) {
                    const thead = document.createElement('thead');
                    const firstRow = table.querySelector('tr');
                    if (firstRow && firstRow.querySelectorAll('th').length > 0) {
                        thead.appendChild(firstRow);
                        table.insertBefore(thead, table.firstChild);
                        optimizations++;
                    }
                }
            });
            
            this.optimizations.push({
                type: 'DOM Optimization',
                description: `Cleaned ${optimizations} DOM elements and added meta tags`,
                impact: 'Low',
                status: 'completed'
            });
            
            console.log(`✅ Optimized ${optimizations} DOM elements`);
            return optimizations;
            
        } catch (error) {
            console.error('❌ DOM optimization failed:', error);
            this.optimizations.push({
                type: 'DOM Optimization',
                description: 'Failed to optimize DOM',
                impact: 'Low',
                status: 'failed',
                error: error.message
            });
            return 0;
        }
    }
    
    /**
     * Run comprehensive optimization
     */
    async runFullOptimization() {
        console.log('🚀 Starting comprehensive website optimization...\n');
        console.log('=' .repeat(60));
        
        // Reset optimization results
        this.optimizations = [];
        this.currentOptimizations = 0;
        this.totalOptimizations = 7; // Number of optimization methods
        
        const results = {
            images: 0,
            css: 0,
            javascript: 0,
            caching: 0,
            fonts: 0,
            serviceWorker: 0,
            dom: 0
        };
        
        try {
            // Run all optimizations
            results.images = await this.optimizeImages();
            this.currentOptimizations++;
            
            results.css = await this.optimizeCSS();
            this.currentOptimizations++;
            
            results.javascript = await this.optimizeJavaScript();
            this.currentOptimizations++;
            
            results.caching = await this.enableCaching();
            this.currentOptimizations++;
            
            results.fonts = await this.optimizeFonts();
            this.currentOptimizations++;
            
            results.serviceWorker = await this.enableServiceWorker();
            this.currentOptimizations++;
            
            results.dom = await this.optimizeDOM();
            this.currentOptimizations++;
            
            // Generate optimization report
            this.generateOptimizationReport(results);
            
        } catch (error) {
            console.error('❌ Optimization process failed:', error);
        }
        
        return this.getOptimizationReport();
    }
    
    /**
     * Generate optimization report
     */
    generateOptimizationReport(results) {
        console.log('\n📊 Optimization Results:');
        console.log('=' .repeat(60));
        
        const totalOptimizations = Object.values(results).reduce((sum, val) => sum + val, 0);
        
        this.optimizations.forEach(opt => {
            const statusIcon = {
                'completed': '✅',
                'failed': '❌',
                'already_optimized': 'ℹ️'
            }[opt.status] || '❓';
            
            console.log(`${statusIcon} ${opt.type}: ${opt.description}`);
            
            if (opt.error) {
                console.log(`   Error: ${opt.error}`);
            }
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log(`🎯 Total Optimizations Applied: ${totalOptimizations}`);
        
        // Performance impact summary
        const highImpact = this.optimizations.filter(opt => opt.impact === 'High' && opt.status === 'completed').length;
        const mediumImpact = this.optimizations.filter(opt => opt.impact === 'Medium' && opt.status === 'completed').length;
        const lowImpact = this.optimizations.filter(opt => opt.impact === 'Low' && opt.status === 'completed').length;
        
        console.log(`📈 Performance Impact:`);
        console.log(`   High Impact: ${highImpact} optimizations`);
        console.log(`   Medium Impact: ${mediumImpact} optimizations`);
        console.log(`   Low Impact: ${lowImpact} optimizations`);
        
        // Recommendations
        console.log('\n🔧 Additional Recommendations:');
        console.log('1. Enable Gzip compression on server');
        console.log('2. Use a Content Delivery Network (CDN)');
        console.log('3. Implement HTTP/2 for multiplexing');
        console.log('4. Optimize server response times');
        console.log('5. Consider using WebP images for better compression');
    }
    
    /**
     * Get optimization report
     */
    getOptimizationReport() {
        const completed = this.optimizations.filter(opt => opt.status === 'completed').length;
        const failed = this.optimizations.filter(opt => opt.status === 'failed').length;
        const alreadyOptimized = this.optimizations.filter(opt => opt.status === 'already_optimized').length;
        
        return {
            timestamp: new Date().toISOString(),
            totalOptimizations: this.optimizations.length,
            completed: completed,
            failed: failed,
            alreadyOptimized: alreadyOptimized,
            successRate: Math.round((completed / this.optimizations.length) * 100),
            optimizations: this.optimizations,
            summary: {
                highImpact: this.optimizations.filter(opt => opt.impact === 'High' && opt.status === 'completed').length,
                mediumImpact: this.optimizations.filter(opt => opt.impact === 'Medium' && opt.status === 'completed').length,
                lowImpact: this.optimizations.filter(opt => opt.impact === 'Low' && opt.status === 'completed').length
            },
            recommendations: [
                'Enable Gzip compression on server',
                'Use a Content Delivery Network (CDN)',
                'Implement HTTP/2 for multiplexing',
                'Optimize server response times',
                'Consider using WebP images for better compression'
            ]
        };
    }
    
    /**
     * Get progress percentage
     */
    getProgress() {
        return Math.round((this.currentOptimizations / this.totalOptimizations) * 100);
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ShrimpTechOptimizer = ShrimpTechOptimizer;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShrimpTechOptimizer;
}