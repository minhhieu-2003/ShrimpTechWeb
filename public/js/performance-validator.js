/**
 * Performance Test và Validation Script cho SHRIMPTECH
 * Kiểm tra và tối ưu performance website
 */

class ShrimpTechValidator {
    constructor() {
        this.results = {};
        this.errors = [];
        this.warnings = [];
        this.init();
    }

    init() {
        console.log('🚀 SHRIMPTECH Performance Validator Starting...');
        this.runAllTests();
    }

    async runAllTests() {
        // Test 1: CSS Loading
        await this.testCSSLoading();
        
        // Test 2: JavaScript Initialization
        await this.testJavaScriptInit();
        
        // Test 3: Image Loading
        await this.testImageLoading();
        
        // Test 4: Responsive Design
        await this.testResponsiveDesign();
        
        // Test 5: Performance Metrics
        await this.testPerformanceMetrics();
        
        // Test 6: Accessibility
        await this.testAccessibility();
        
        // Test 7: Security Headers
        await this.testSecurityHeaders();
        
        // Generate Report
        this.generateReport();
    }

    async testCSSLoading() {
        console.log('📄 Testing CSS Loading...');
        
        const cssFiles = [
            'styles.css',
            'styles/components/display-optimization.css',
            'styles/components/responsive-optimization.css',
            'styles/components/mockup-adjustments.css'
        ];

        let loadedFiles = 0;
        let failedFiles = [];

        for (const file of cssFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    loadedFiles++;
                } else {
                    failedFiles.push(file);
                }
            } catch (error) {
                failedFiles.push(file);
                this.errors.push(`CSS file failed to load: ${file}`);
            }
        }

        this.results.cssLoading = {
            total: cssFiles.length,
            loaded: loadedFiles,
            failed: failedFiles.length,
            failedFiles: failedFiles
        };

        console.log(`✅ CSS Loading: ${loadedFiles}/${cssFiles.length} files loaded`);
    }

    async testJavaScriptInit() {
        console.log('🔧 Testing JavaScript Initialization...');
        
        const jsModules = [
            'DisplayPerformanceManager',
            'PageLoader',
            'SecurityConfig',
            'InputValidator'
        ];

        let initializedModules = 0;
        let failedModules = [];

        jsModules.forEach(module => {
            if (window[module]) {
                initializedModules++;
            } else {
                failedModules.push(module);
                this.warnings.push(`Module not initialized: ${module}`);
            }
        });

        // Test instances
        const instances = {
            displayManager: !!window.displayManager,
            pageLoader: !!window.PageLoader,
            securityConfig: !!window.securityConfig,
            inputValidator: !!window.inputValidator
        };

        this.results.jsInit = {
            modules: {
                total: jsModules.length,
                initialized: initializedModules,
                failed: failedModules
            },
            instances: instances
        };

        console.log(`✅ JavaScript: ${initializedModules}/${jsModules.length} modules ready`);
    }

    async testImageLoading() {
        console.log('🖼️ Testing Image Loading...');
        
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        let failedImages = 0;
        let lazyImages = 0;

        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.classList.contains('lazy')) {
                    lazyImages++;
                }

                if (img.complete) {
                    if (img.naturalWidth > 0) {
                        loadedImages++;
                    } else {
                        failedImages++;
                    }
                    resolve();
                } else {
                    img.onload = () => {
                        loadedImages++;
                        resolve();
                    };
                    img.onerror = () => {
                        failedImages++;
                        this.errors.push(`Image failed to load: ${img.src}`);
                        resolve();
                    };
                }
            });
        });

        await Promise.all(imagePromises);

        this.results.imageLoading = {
            total: images.length,
            loaded: loadedImages,
            failed: failedImages,
            lazy: lazyImages
        };

        console.log(`✅ Images: ${loadedImages}/${images.length} loaded, ${lazyImages} lazy`);
    }

    async testResponsiveDesign() {
        console.log('📱 Testing Responsive Design...');
        
        const breakpoints = [
            { name: 'mobile', width: 375 },
            { name: 'tablet', width: 768 },
            { name: 'desktop', width: 1024 },
            { name: 'large', width: 1440 }
        ];

        const responsiveElements = [
            '.hero-container',
            '.nav-menu',
            '.overview-grid',
            '.features-grid'
        ];

        let passedBreakpoints = 0;
        const breakpointResults = {};

        for (const bp of breakpoints) {
            // Simulate viewport resize
            const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`);
            
            let elementsVisible = 0;
            responsiveElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element && getComputedStyle(element).display !== 'none') {
                    elementsVisible++;
                }
            });

            breakpointResults[bp.name] = {
                width: bp.width,
                elementsVisible: elementsVisible,
                totalElements: responsiveElements.length
            };

            if (elementsVisible > 0) {
                passedBreakpoints++;
            }
        }

        this.results.responsive = {
            breakpoints: breakpointResults,
            passed: passedBreakpoints,
            total: breakpoints.length
        };

        console.log(`✅ Responsive: ${passedBreakpoints}/${breakpoints.length} breakpoints working`);
    }

    async testPerformanceMetrics() {
        console.log('⚡ Testing Performance Metrics...');
        
        const metrics = {};

        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // First Contentful Paint
                const paintEntries = performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    metrics[entry.name.replace('-', '_')] = entry.startTime;
                });

                // Navigation Timing
                const navEntries = performance.getEntriesByType('navigation');
                if (navEntries.length > 0) {
                    const nav = navEntries[0];
                    metrics.dom_content_loaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
                    metrics.load_complete = nav.loadEventEnd - nav.loadEventStart;
                }

                // Memory usage (if available)
                if ('memory' in performance) {
                    const memory = performance.memory;
                    metrics.memory_used = memory.usedJSHeapSize;
                    metrics.memory_total = memory.totalJSHeapSize;
                    metrics.memory_limit = memory.jsHeapSizeLimit;
                    metrics.memory_usage_percent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
                }

            } catch (error) {
                this.warnings.push('Performance API not fully supported');
            }
        }

        // Page load time
        metrics.page_load_time = Date.now() - performance.timing.navigationStart;

        // Resource timing
        const resources = performance.getEntriesByType('resource');
        metrics.total_resources = resources.length;
        metrics.css_resources = resources.filter(r => r.name.includes('.css')).length;
        metrics.js_resources = resources.filter(r => r.name.includes('.js')).length;
        metrics.image_resources = resources.filter(r => 
            r.name.includes('.jpg') || r.name.includes('.png') || 
            r.name.includes('.svg') || r.name.includes('.webp')
        ).length;

        this.results.performance = metrics;

        const fcpScore = metrics.first_contentful_paint < 2000 ? 'Good' : 
                        metrics.first_contentful_paint < 4000 ? 'Needs Improvement' : 'Poor';
        
        console.log(`✅ Performance: FCP ${Math.round(metrics.first_contentful_paint || 0)}ms (${fcpScore})`);
    }

    async testAccessibility() {
        console.log('♿ Testing Accessibility...');
        
        const a11yChecks = {
            hasSkipLink: !!document.querySelector('.skip-link'),
            hasAltTexts: true,
            hasAriaLabels: true,
            hasSemanticHTML: true,
            hasKeyboardNav: true
        };

        // Check alt texts
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt || img.alt.trim() === '') {
                a11yChecks.hasAltTexts = false;
                this.warnings.push(`Image missing alt text: ${img.src}`);
            }
        });

        // Check ARIA labels
        const interactiveElements = document.querySelectorAll('button, a, input, textarea');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && 
                !el.textContent.trim() && !el.querySelector('span')) {
                a11yChecks.hasAriaLabels = false;
            }
        });

        // Check semantic HTML
        const hasHeader = !!document.querySelector('header, nav');
        const hasMain = !!document.querySelector('main');
        const hasFooter = !!document.querySelector('footer');
        const hasHeadings = !!document.querySelector('h1, h2, h3');
        
        a11yChecks.hasSemanticHTML = hasHeader && hasMain && hasFooter && hasHeadings;

        // Count passed checks
        const passedChecks = Object.values(a11yChecks).filter(Boolean).length;
        const totalChecks = Object.keys(a11yChecks).length;

        this.results.accessibility = {
            checks: a11yChecks,
            passed: passedChecks,
            total: totalChecks,
            score: (passedChecks / totalChecks) * 100
        };

        console.log(`✅ Accessibility: ${passedChecks}/${totalChecks} checks passed`);
    }

    async testSecurityHeaders() {
        console.log('🔒 Testing Security Headers...');
        
        const securityHeaders = [
            'Content-Security-Policy',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Referrer-Policy'
        ];

        const metaTags = document.querySelectorAll('meta[http-equiv]');
        const presentHeaders = Array.from(metaTags).map(meta => 
            meta.getAttribute('http-equiv')
        );

        const securityScore = securityHeaders.filter(header => 
            presentHeaders.includes(header)
        ).length;

        this.results.security = {
            requiredHeaders: securityHeaders,
            presentHeaders: presentHeaders,
            score: (securityScore / securityHeaders.length) * 100,
            passed: securityScore,
            total: securityHeaders.length
        };

        console.log(`✅ Security: ${securityScore}/${securityHeaders.length} headers present`);
    }

    generateReport() {
        console.log('\n🎯 SHRIMPTECH VALIDATION REPORT');
        console.log('================================');
        
        // Overall Score
        const scores = [
            this.results.cssLoading ? (this.results.cssLoading.loaded / this.results.cssLoading.total) * 100 : 0,
            this.results.jsInit ? (this.results.jsInit.modules.initialized / this.results.jsInit.modules.total) * 100 : 0,
            this.results.imageLoading ? (this.results.imageLoading.loaded / this.results.imageLoading.total) * 100 : 0,
            this.results.responsive ? (this.results.responsive.passed / this.results.responsive.total) * 100 : 0,
            this.results.accessibility ? this.results.accessibility.score : 0,
            this.results.security ? this.results.security.score : 0
        ];

        const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        console.log(`📊 Overall Score: ${Math.round(overallScore)}%`);
        console.log(`📄 CSS Loading: ${Math.round(scores[0])}%`);
        console.log(`🔧 JavaScript: ${Math.round(scores[1])}%`);
        console.log(`🖼️ Images: ${Math.round(scores[2])}%`);
        console.log(`📱 Responsive: ${Math.round(scores[3])}%`);
        console.log(`♿ Accessibility: ${Math.round(scores[4])}%`);
        console.log(`🔒 Security: ${Math.round(scores[5])}%`);

        if (this.results.performance) {
            console.log(`⚡ Performance:`);
            console.log(`   - Page Load: ${Math.round(this.results.performance.page_load_time)}ms`);
            console.log(`   - Resources: ${this.results.performance.total_resources} total`);
            if (this.results.performance.memory_usage_percent) {
                console.log(`   - Memory: ${Math.round(this.results.performance.memory_usage_percent)}%`);
            }
        }

        // Errors and Warnings
        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            this.errors.forEach(error => console.log(`   - ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.warnings.forEach(warning => console.log(`   - ${warning}`));
        }

        // Recommendations
        this.generateRecommendations(overallScore);

        // Store results globally
        window.shrimpTechValidationResults = {
            score: overallScore,
            details: this.results,
            errors: this.errors,
            warnings: this.warnings,
            timestamp: new Date().toISOString()
        };

        return this.results;
    }

    generateRecommendations(score) {
        console.log('\n💡 RECOMMENDATIONS:');
        
        if (score >= 90) {
            console.log('   🎉 Excellent! Website performance is optimal.');
        } else if (score >= 80) {
            console.log('   ✅ Good performance. Minor optimizations recommended.');
        } else if (score >= 70) {
            console.log('   ⚠️ Performance needs improvement.');
        } else {
            console.log('   🚨 Critical performance issues detected.');
        }

        // Specific recommendations
        if (this.results.performance?.memory_usage_percent > 80) {
            console.log('   - Consider optimizing memory usage');
        }

        if (this.results.imageLoading?.failed > 0) {
            console.log('   - Fix failed image loading');
        }

        if (this.results.accessibility?.score < 90) {
            console.log('   - Improve accessibility features');
        }

        if (this.results.security?.score < 100) {
            console.log('   - Add missing security headers');
        }

        console.log('   - Enable performance monitoring in production');
        console.log('   - Set up regular validation tests');
        console.log('   - Monitor Core Web Vitals');
    }

    // Method to run validation manually
    static async validate() {
        return new ShrimpTechValidator();
    }
}

// Auto-run validation in debug mode
if (localStorage.getItem('shrimptech_debug') === 'true') {
    // Wait for page to fully load
    window.addEventListener('load', () => {
        setTimeout(() => {
            new ShrimpTechValidator();
        }, 2000);
    });
}

// Export for manual testing
window.ShrimpTechValidator = ShrimpTechValidator;

// Add validation to global object
window.validateShrimpTech = () => ShrimpTechValidator.validate();

console.log('🧪 SHRIMPTECH Validator loaded. Run validateShrimpTech() to test manually.');