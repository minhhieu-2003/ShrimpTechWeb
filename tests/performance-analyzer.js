/**
 * Website Performance Analyzer for ShrimpTech
 * Phân tích và tối ưu hóa performance của website
 */

class ShrimpTechPerformanceAnalyzer {
    constructor() {
        this.analysisResults = [];
        this.performanceMetrics = {};
        this.optimizationSuggestions = [];
    }
    
    /**
     * Analyze page load performance
     */
    async analyzePageLoad() {
        console.log('⚡ Analyzing page load performance...');
        
        if (typeof window === 'undefined') {
            console.warn('Performance analysis requires browser environment');
            return;
        }
        
        try {
            // Get performance timing data
            const perfData = performance.getEntriesByType('navigation')[0];
            const timing = performance.timing;
            
            const metrics = {
                // Core Web Vitals approximation
                domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
                loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart,
                
                // Detailed timing
                dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
                tcpConnection: timing.connectEnd - timing.connectStart,
                serverResponse: timing.responseEnd - timing.requestStart,
                domProcessing: timing.domContentLoadedEventStart - timing.responseEnd,
                resourceLoading: timing.loadEventStart - timing.domContentLoadedEventEnd,
                
                // Total times
                totalLoadTime: timing.loadEventEnd - timing.navigationStart,
                timeToFirstByte: timing.responseStart - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart
            };
            
            this.performanceMetrics.pageLoad = metrics;
            
            // Analyze results
            const issues = [];
            const suggestions = [];
            
            if (metrics.totalLoadTime > 3000) {
                issues.push('Slow page load time');
                suggestions.push('Optimize images and enable compression');
            }
            
            if (metrics.timeToFirstByte > 1000) {
                issues.push('Slow server response');
                suggestions.push('Optimize server configuration or use CDN');
            }
            
            if (metrics.domProcessing > 1000) {
                issues.push('Slow DOM processing');
                suggestions.push('Minimize JavaScript execution and DOM manipulation');
            }
            
            this.analysisResults.push({
                test: 'Page Load Performance',
                status: issues.length === 0 ? 'good' : issues.length <= 2 ? 'warning' : 'poor',
                metrics: metrics,
                issues: issues,
                suggestions: suggestions
            });
            
            console.log(`✅ Page load analysis complete: ${metrics.totalLoadTime}ms total`);
            
        } catch (error) {
            console.error('❌ Page load analysis failed:', error);
            this.analysisResults.push({
                test: 'Page Load Performance',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Analyze resource sizes and optimization
     */
    async analyzeResources() {
        console.log('📦 Analyzing resource sizes...');
        
        if (typeof window === 'undefined') {
            console.warn('Resource analysis requires browser environment');
            return;
        }
        
        try {
            const resources = performance.getEntriesByType('resource');
            const resourceAnalysis = {
                totalResources: resources.length,
                totalSize: 0,
                byType: {},
                largestResources: [],
                slowestResources: []
            };
            
            resources.forEach(resource => {
                const size = resource.transferSize || 0;
                const loadTime = resource.responseEnd - resource.startTime;
                const type = this.getResourceType(resource.name);
                
                resourceAnalysis.totalSize += size;
                
                if (!resourceAnalysis.byType[type]) {
                    resourceAnalysis.byType[type] = { count: 0, size: 0, avgLoadTime: 0 };
                }
                
                resourceAnalysis.byType[type].count++;
                resourceAnalysis.byType[type].size += size;
                resourceAnalysis.byType[type].avgLoadTime += loadTime;
                
                // Track largest resources
                if (size > 100000) { // > 100KB
                    resourceAnalysis.largestResources.push({
                        name: resource.name,
                        size: size,
                        type: type
                    });
                }
                
                // Track slowest resources
                if (loadTime > 1000) { // > 1 second
                    resourceAnalysis.slowestResources.push({
                        name: resource.name,
                        loadTime: loadTime,
                        type: type
                    });
                }
            });
            
            // Calculate averages
            Object.keys(resourceAnalysis.byType).forEach(type => {
                const typeData = resourceAnalysis.byType[type];
                typeData.avgLoadTime = typeData.avgLoadTime / typeData.count;
            });
            
            // Sort largest and slowest
            resourceAnalysis.largestResources.sort((a, b) => b.size - a.size);
            resourceAnalysis.slowestResources.sort((a, b) => b.loadTime - a.loadTime);
            
            this.performanceMetrics.resources = resourceAnalysis;
            
            // Generate suggestions
            const suggestions = [];
            
            if (resourceAnalysis.totalSize > 2000000) { // > 2MB
                suggestions.push('Total page size is large - consider lazy loading and compression');
            }
            
            if (resourceAnalysis.byType.image?.size > 1000000) { // > 1MB images
                suggestions.push('Optimize images: compress, use WebP format, implement lazy loading');
            }
            
            if (resourceAnalysis.byType.script?.size > 500000) { // > 500KB JS
                suggestions.push('Minify and bundle JavaScript files');
            }
            
            if (resourceAnalysis.byType.stylesheet?.size > 200000) { // > 200KB CSS
                suggestions.push('Minify CSS and remove unused styles');
            }
            
            this.analysisResults.push({
                test: 'Resource Analysis',
                status: suggestions.length === 0 ? 'good' : suggestions.length <= 2 ? 'warning' : 'poor',
                metrics: resourceAnalysis,
                suggestions: suggestions
            });
            
            console.log(`✅ Resource analysis complete: ${resourceAnalysis.totalResources} resources, ${(resourceAnalysis.totalSize / 1024 / 1024).toFixed(2)}MB total`);
            
        } catch (error) {
            console.error('❌ Resource analysis failed:', error);
            this.analysisResults.push({
                test: 'Resource Analysis',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Analyze JavaScript performance
     */
    async analyzeJavaScript() {
        console.log('🔧 Analyzing JavaScript performance...');
        
        if (typeof window === 'undefined') {
            console.warn('JavaScript analysis requires browser environment');
            return;
        }
        
        try {
            const jsMetrics = {
                scriptsCount: document.querySelectorAll('script').length,
                inlineScripts: document.querySelectorAll('script:not([src])').length,
                externalScripts: document.querySelectorAll('script[src]').length,
                errorCount: 0,
                consoleErrors: [],
                performanceIssues: []
            };
            
            // Check for common performance issues
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            scripts.forEach(script => {
                const src = script.src;
                
                // Check for duplicate scripts
                const duplicates = scripts.filter(s => s.src === src);
                if (duplicates.length > 1) {
                    jsMetrics.performanceIssues.push(`Duplicate script: ${src}`);
                }
                
                // Check for missing async/defer
                if (!script.async && !script.defer && !src.includes('inline')) {
                    jsMetrics.performanceIssues.push(`Script blocking render: ${src}`);
                }
            });
            
            // Check for inline scripts
            if (jsMetrics.inlineScripts > 5) {
                jsMetrics.performanceIssues.push(`Too many inline scripts: ${jsMetrics.inlineScripts}`);
            }
            
            // Monitor console errors
            const originalError = console.error;
            console.error = function(...args) {
                jsMetrics.consoleErrors.push(args.join(' '));
                originalError.apply(console, args);
            };
            
            this.performanceMetrics.javascript = jsMetrics;
            
            const suggestions = [];
            
            if (jsMetrics.performanceIssues.length > 0) {
                suggestions.push('Fix identified JavaScript performance issues');
            }
            
            if (jsMetrics.inlineScripts > 3) {
                suggestions.push('Consider moving inline scripts to external files');
            }
            
            if (jsMetrics.externalScripts > 10) {
                suggestions.push('Bundle JavaScript files to reduce HTTP requests');
            }
            
            this.analysisResults.push({
                test: 'JavaScript Performance',
                status: suggestions.length === 0 ? 'good' : suggestions.length <= 2 ? 'warning' : 'poor',
                metrics: jsMetrics,
                suggestions: suggestions
            });
            
            console.log(`✅ JavaScript analysis complete: ${jsMetrics.scriptsCount} total scripts`);
            
        } catch (error) {
            console.error('❌ JavaScript analysis failed:', error);
            this.analysisResults.push({
                test: 'JavaScript Performance',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Analyze CSS performance
     */
    async analyzeCSS() {
        console.log('🎨 Analyzing CSS performance...');
        
        if (typeof window === 'undefined') {
            console.warn('CSS analysis requires browser environment');
            return;
        }
        
        try {
            const cssMetrics = {
                stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
                inlineStyles: document.querySelectorAll('style').length,
                totalRules: 0,
                unusedRules: 0,
                largeFiles: []
            };
            
            // Analyze stylesheets
            const styleSheets = Array.from(document.styleSheets);
            styleSheets.forEach(sheet => {
                try {
                    if (sheet.cssRules) {
                        cssMetrics.totalRules += sheet.cssRules.length;
                    }
                } catch (e) {
                    // Cross-origin stylesheet
                }
            });
            
            this.performanceMetrics.css = cssMetrics;
            
            const suggestions = [];
            
            if (cssMetrics.stylesheets > 5) {
                suggestions.push('Consider combining CSS files to reduce HTTP requests');
            }
            
            if (cssMetrics.inlineStyles > 3) {
                suggestions.push('Move inline styles to external CSS files');
            }
            
            if (cssMetrics.totalRules > 1000) {
                suggestions.push('Review and remove unused CSS rules');
            }
            
            this.analysisResults.push({
                test: 'CSS Performance',
                status: suggestions.length === 0 ? 'good' : suggestions.length <= 2 ? 'warning' : 'poor',
                metrics: cssMetrics,
                suggestions: suggestions
            });
            
            console.log(`✅ CSS analysis complete: ${cssMetrics.stylesheets} stylesheets, ${cssMetrics.totalRules} rules`);
            
        } catch (error) {
            console.error('❌ CSS analysis failed:', error);
            this.analysisResults.push({
                test: 'CSS Performance',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Analyze images optimization
     */
    async analyzeImages() {
        console.log('🖼️ Analyzing image optimization...');
        
        if (typeof window === 'undefined') {
            console.warn('Image analysis requires browser environment');
            return;
        }
        
        try {
            const images = Array.from(document.querySelectorAll('img'));
            const imageMetrics = {
                totalImages: images.length,
                optimizedImages: 0,
                largeImages: [],
                missingAlt: [],
                lazyLoadCandidates: [],
                formats: { jpg: 0, png: 0, gif: 0, svg: 0, webp: 0, other: 0 }
            };
            
            images.forEach((img, index) => {
                const src = img.src;
                const alt = img.alt;
                
                // Check alt text
                if (!alt || alt.trim() === '') {
                    imageMetrics.missingAlt.push(src);
                }
                
                // Check format
                const format = this.getImageFormat(src);
                imageMetrics.formats[format]++;
                
                // Check for lazy loading candidates (images below fold)
                const rect = img.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    imageMetrics.lazyLoadCandidates.push(src);
                }
                
                // Check if already optimized (approximate)
                if (src.includes('.webp') || img.loading === 'lazy') {
                    imageMetrics.optimizedImages++;
                }
            });
            
            this.performanceMetrics.images = imageMetrics;
            
            const suggestions = [];
            
            if (imageMetrics.missingAlt.length > 0) {
                suggestions.push(`Add alt text to ${imageMetrics.missingAlt.length} images for accessibility`);
            }
            
            if (imageMetrics.lazyLoadCandidates.length > 0) {
                suggestions.push(`Implement lazy loading for ${imageMetrics.lazyLoadCandidates.length} below-fold images`);
            }
            
            if (imageMetrics.formats.jpg + imageMetrics.formats.png > imageMetrics.formats.webp) {
                suggestions.push('Convert images to WebP format for better compression');
            }
            
            if (imageMetrics.totalImages > 20) {
                suggestions.push('Consider image sprite sheets or lazy loading for many images');
            }
            
            this.analysisResults.push({
                test: 'Image Optimization',
                status: suggestions.length === 0 ? 'good' : suggestions.length <= 2 ? 'warning' : 'poor',
                metrics: imageMetrics,
                suggestions: suggestions
            });
            
            console.log(`✅ Image analysis complete: ${imageMetrics.totalImages} images analyzed`);
            
        } catch (error) {
            console.error('❌ Image analysis failed:', error);
            this.analysisResults.push({
                test: 'Image Optimization',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Check Core Web Vitals
     */
    async checkCoreWebVitals() {
        console.log('🎯 Checking Core Web Vitals...');
        
        if (typeof window === 'undefined') {
            console.warn('Core Web Vitals check requires browser environment');
            return;
        }
        
        try {
            const vitals = {
                lcp: null, // Largest Contentful Paint
                fid: null, // First Input Delay
                cls: null, // Cumulative Layout Shift
                fcp: null, // First Contentful Paint
                ttfb: null // Time to First Byte
            };
            
            // TTFB from navigation timing
            if (performance.timing) {
                vitals.ttfb = performance.timing.responseStart - performance.timing.navigationStart;
            }
            
            // FCP from paint timing
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
                vitals.fcp = fcpEntry.startTime;
            }
            
            // Try to get LCP (requires PerformanceObserver)
            if ('PerformanceObserver' in window) {
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        vitals.lcp = lastEntry.startTime;
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    console.warn('LCP measurement not available');
                }
            }
            
            this.performanceMetrics.coreWebVitals = vitals;
            
            const issues = [];
            const suggestions = [];
            
            if (vitals.ttfb && vitals.ttfb > 600) {
                issues.push('Poor TTFB (Time to First Byte)');
                suggestions.push('Optimize server response time');
            }
            
            if (vitals.fcp && vitals.fcp > 1800) {
                issues.push('Poor FCP (First Contentful Paint)');
                suggestions.push('Optimize critical rendering path');
            }
            
            if (vitals.lcp && vitals.lcp > 2500) {
                issues.push('Poor LCP (Largest Contentful Paint)');
                suggestions.push('Optimize largest content element loading');
            }
            
            this.analysisResults.push({
                test: 'Core Web Vitals',
                status: issues.length === 0 ? 'good' : issues.length <= 1 ? 'warning' : 'poor',
                metrics: vitals,
                issues: issues,
                suggestions: suggestions
            });
            
            console.log('✅ Core Web Vitals check complete');
            
        } catch (error) {
            console.error('❌ Core Web Vitals check failed:', error);
            this.analysisResults.push({
                test: 'Core Web Vitals',
                status: 'error',
                error: error.message
            });
        }
    }
    
    /**
     * Run comprehensive performance analysis
     */
    async runCompleteAnalysis() {
        console.log('🚀 Starting comprehensive performance analysis...\n');
        console.log('=' .repeat(60));
        
        // Reset results
        this.analysisResults = [];
        this.performanceMetrics = {};
        
        // Run all analyses
        await this.analyzePageLoad();
        await this.analyzeResources();
        await this.analyzeJavaScript();
        await this.analyzeCSS();
        await this.analyzeImages();
        await this.checkCoreWebVitals();
        
        // Generate overall score and report
        this.generatePerformanceScore();
        this.displayResults();
        
        return this.getPerformanceReport();
    }
    
    /**
     * Generate overall performance score
     */
    generatePerformanceScore() {
        const scores = this.analysisResults.map(result => {
            switch (result.status) {
                case 'good': return 100;
                case 'warning': return 70;
                case 'poor': return 40;
                case 'error': return 0;
                default: return 50;
            }
        });
        
        const overallScore = scores.length > 0 ? 
            Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
        
        this.performanceMetrics.overallScore = overallScore;
        this.performanceMetrics.grade = this.getPerformanceGrade(overallScore);
    }
    
    /**
     * Get performance grade
     */
    getPerformanceGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
    
    /**
     * Display analysis results
     */
    displayResults() {
        console.log('\n📊 Performance Analysis Results:');
        console.log('=' .repeat(60));
        
        this.analysisResults.forEach(result => {
            const statusIcon = {
                'good': '✅',
                'warning': '⚠️',
                'poor': '❌',
                'error': '💥'
            }[result.status] || '❓';
            
            console.log(`\n${statusIcon} ${result.test}: ${result.status.toUpperCase()}`);
            
            if (result.issues && result.issues.length > 0) {
                console.log('   Issues:');
                result.issues.forEach(issue => console.log(`   - ${issue}`));
            }
            
            if (result.suggestions && result.suggestions.length > 0) {
                console.log('   Suggestions:');
                result.suggestions.forEach(suggestion => console.log(`   - ${suggestion}`));
            }
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log(`🏆 Overall Performance Score: ${this.performanceMetrics.overallScore}/100 (Grade: ${this.performanceMetrics.grade})`);
        
        if (this.performanceMetrics.overallScore < 80) {
            console.log('\n🔧 Priority Optimizations:');
            this.generatePriorityOptimizations().forEach((opt, index) => {
                console.log(`${index + 1}. ${opt}`);
            });
        }
    }
    
    /**
     * Generate priority optimizations
     */
    generatePriorityOptimizations() {
        const optimizations = [];
        
        this.analysisResults.forEach(result => {
            if (result.status === 'poor' || result.status === 'error') {
                if (result.suggestions) {
                    optimizations.push(...result.suggestions);
                }
            }
        });
        
        // Add general optimizations if score is low
        if (this.performanceMetrics.overallScore < 70) {
            optimizations.push(
                'Enable Gzip compression on server',
                'Implement browser caching headers',
                'Use a Content Delivery Network (CDN)',
                'Minify HTML, CSS, and JavaScript files'
            );
        }
        
        return [...new Set(optimizations)]; // Remove duplicates
    }
    
    /**
     * Get complete performance report
     */
    getPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            overallScore: this.performanceMetrics.overallScore,
            grade: this.performanceMetrics.grade,
            analysisResults: this.analysisResults,
            detailedMetrics: this.performanceMetrics,
            priorityOptimizations: this.generatePriorityOptimizations(),
            summary: {
                testsRun: this.analysisResults.length,
                passed: this.analysisResults.filter(r => r.status === 'good').length,
                warnings: this.analysisResults.filter(r => r.status === 'warning').length,
                failed: this.analysisResults.filter(r => r.status === 'poor' || r.status === 'error').length
            }
        };
    }
    
    /**
     * Utility methods
     */
    getResourceType(url) {
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(css)$/i)) return 'stylesheet';
        if (url.match(/\.(js)$/i)) return 'script';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
        return 'other';
    }
    
    getImageFormat(url) {
        if (url.includes('.jpg') || url.includes('.jpeg')) return 'jpg';
        if (url.includes('.png')) return 'png';
        if (url.includes('.gif')) return 'gif';
        if (url.includes('.svg')) return 'svg';
        if (url.includes('.webp')) return 'webp';
        return 'other';
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ShrimpTechPerformanceAnalyzer = ShrimpTechPerformanceAnalyzer;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShrimpTechPerformanceAnalyzer;
}