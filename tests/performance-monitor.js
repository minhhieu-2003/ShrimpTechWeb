/**
 * ShrimpTech Performance Monitor
 * Real-time performance monitoring và alerting system
 */

class ShrimpTechPerformanceMonitor {
    constructor() {
        this.isMonitoring = false;
        this.metrics = {
            pageLoad: [],
            userInteractions: [],
            resourceUsage: [],
            errors: [],
            alerts: []
        };
        this.thresholds = {
            pageLoadTime: 3000, // 3 seconds
            firstContentfulPaint: 1800, // 1.8 seconds
            largestContentfulPaint: 2500, // 2.5 seconds
            cumulativeLayoutShift: 0.1,
            firstInputDelay: 100, // 100ms
            memoryUsage: 100 * 1024 * 1024, // 100MB
            errorRate: 0.05 // 5%
        };
        this.monitoringInterval = null;
        this.alertCallbacks = [];
    }
    
    /**
     * Start performance monitoring
     */
    startMonitoring() {
        if (this.isMonitoring) {
            console.warn('⚠️ Monitoring already active');
            return;
        }
        
        console.log('🔍 Starting performance monitoring...');
        this.isMonitoring = true;
        
        // Initialize performance observers
        this.initializeObservers();
        
        // Start periodic monitoring
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
        }, 5000); // Collect metrics every 5 seconds
        
        // Monitor user interactions
        this.monitorUserInteractions();
        
        // Monitor errors
        this.monitorErrors();
        
        console.log('✅ Performance monitoring started');
    }
    
    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        if (!this.isMonitoring) {
            console.warn('⚠️ Monitoring not active');
            return;
        }
        
        console.log('🛑 Stopping performance monitoring...');
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        // Disconnect observers
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        console.log('✅ Performance monitoring stopped');
    }
    
    /**
     * Initialize performance observers
     */
    initializeObservers() {
        if (typeof window === 'undefined' || !window.PerformanceObserver) {
            console.warn('⚠️ PerformanceObserver not available');
            return;
        }
        
        try {
            // Observe Core Web Vitals
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.processPerformanceEntry(entry);
                }
            });
            
            // Observe multiple entry types
            const entryTypes = ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'];
            entryTypes.forEach(type => {
                try {
                    this.performanceObserver.observe({ entryTypes: [type] });
                } catch (e) {
                    console.warn(`⚠️ Cannot observe ${type}:`, e.message);
                }
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize performance observers:', error);
        }
    }
    
    /**
     * Process performance entry
     */
    processPerformanceEntry(entry) {
        const timestamp = Date.now();
        
        switch (entry.entryType) {
            case 'navigation':
                this.metrics.pageLoad.push({
                    timestamp,
                    loadTime: entry.loadEventEnd - entry.loadEventStart,
                    domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                    timeToFirstByte: entry.responseStart - entry.requestStart,
                    domComplete: entry.domComplete - entry.navigationStart
                });
                
                // Check thresholds
                const totalLoadTime = entry.loadEventEnd - entry.navigationStart;
                if (totalLoadTime > this.thresholds.pageLoadTime) {
                    this.triggerAlert('Slow page load', {
                        metric: 'Page Load Time',
                        value: totalLoadTime,
                        threshold: this.thresholds.pageLoadTime,
                        severity: 'warning'
                    });
                }
                break;
                
            case 'paint':
                if (entry.name === 'first-contentful-paint') {
                    const fcp = entry.startTime;
                    this.metrics.pageLoad.push({
                        timestamp,
                        firstContentfulPaint: fcp
                    });
                    
                    if (fcp > this.thresholds.firstContentfulPaint) {
                        this.triggerAlert('Slow First Contentful Paint', {
                            metric: 'First Contentful Paint',
                            value: fcp,
                            threshold: this.thresholds.firstContentfulPaint,
                            severity: 'warning'
                        });
                    }
                }
                break;
                
            case 'largest-contentful-paint':
                const lcp = entry.startTime;
                this.metrics.pageLoad.push({
                    timestamp,
                    largestContentfulPaint: lcp
                });
                
                if (lcp > this.thresholds.largestContentfulPaint) {
                    this.triggerAlert('Poor Largest Contentful Paint', {
                        metric: 'Largest Contentful Paint',
                        value: lcp,
                        threshold: this.thresholds.largestContentfulPaint,
                        severity: 'error'
                    });
                }
                break;
                
            case 'first-input':
                const fid = entry.processingStart - entry.startTime;
                this.metrics.userInteractions.push({
                    timestamp,
                    firstInputDelay: fid,
                    inputType: entry.name
                });
                
                if (fid > this.thresholds.firstInputDelay) {
                    this.triggerAlert('High First Input Delay', {
                        metric: 'First Input Delay',
                        value: fid,
                        threshold: this.thresholds.firstInputDelay,
                        severity: 'warning'
                    });
                }
                break;
                
            case 'layout-shift':
                if (!entry.hadRecentInput) {
                    this.metrics.pageLoad.push({
                        timestamp,
                        layoutShift: entry.value
                    });
                    
                    if (entry.value > this.thresholds.cumulativeLayoutShift) {
                        this.triggerAlert('High Layout Shift', {
                            metric: 'Cumulative Layout Shift',
                            value: entry.value,
                            threshold: this.thresholds.cumulativeLayoutShift,
                            severity: 'warning'
                        });
                    }
                }
                break;
        }
    }
    
    /**
     * Collect system metrics
     */
    collectMetrics() {
        const timestamp = Date.now();
        
        // Memory usage
        if (performance.memory) {
            const memoryUsage = {
                timestamp,
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            this.metrics.resourceUsage.push(memoryUsage);
            
            // Check memory threshold
            if (memoryUsage.usedJSHeapSize > this.thresholds.memoryUsage) {
                this.triggerAlert('High memory usage', {
                    metric: 'Memory Usage',
                    value: memoryUsage.usedJSHeapSize,
                    threshold: this.thresholds.memoryUsage,
                    severity: 'warning'
                });
            }
        }
        
        // Resource timing
        const resources = performance.getEntriesByType('resource');
        const recentResources = resources.filter(r => r.startTime > timestamp - 5000);
        
        if (recentResources.length > 0) {
            this.metrics.resourceUsage.push({
                timestamp,
                resourceCount: recentResources.length,
                totalSize: recentResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                avgLoadTime: recentResources.reduce((sum, r) => sum + (r.responseEnd - r.startTime), 0) / recentResources.length
            });
        }
    }
    
    /**
     * Monitor user interactions
     */
    monitorUserInteractions() {
        const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                if (!this.isMonitoring) return;
                
                const timestamp = Date.now();
                const interactionData = {
                    timestamp,
                    type: eventType,
                    target: event.target.tagName,
                    targetId: event.target.id,
                    targetClass: event.target.className
                };
                
                this.metrics.userInteractions.push(interactionData);
                
                // Measure interaction responsiveness
                requestAnimationFrame(() => {
                    const responseTime = Date.now() - timestamp;
                    if (responseTime > 16) { // > 1 frame at 60fps
                        this.metrics.userInteractions.push({
                            timestamp: Date.now(),
                            type: 'slow_interaction',
                            responseTime: responseTime,
                            originalEvent: eventType
                        });
                    }
                });
            }, { passive: true });
        });
    }
    
    /**
     * Monitor errors
     */
    monitorErrors() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            if (!this.isMonitoring) return;
            
            const errorData = {
                timestamp: Date.now(),
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            };
            
            this.metrics.errors.push(errorData);
            
            // Check error rate
            this.checkErrorRate();
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (!this.isMonitoring) return;
            
            const errorData = {
                timestamp: Date.now(),
                type: 'promise_rejection',
                reason: event.reason,
                promise: event.promise
            };
            
            this.metrics.errors.push(errorData);
            this.checkErrorRate();
        });
        
        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (!this.isMonitoring) return;
            
            if (event.target !== window) {
                const errorData = {
                    timestamp: Date.now(),
                    type: 'resource_error',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href
                };
                
                this.metrics.errors.push(errorData);
                this.checkErrorRate();
            }
        }, true);
    }
    
    /**
     * Check error rate
     */
    checkErrorRate() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        const recentErrors = this.metrics.errors.filter(error => error.timestamp > oneMinuteAgo);
        const recentInteractions = this.metrics.userInteractions.filter(interaction => interaction.timestamp > oneMinuteAgo);
        
        if (recentInteractions.length > 0) {
            const errorRate = recentErrors.length / recentInteractions.length;
            
            if (errorRate > this.thresholds.errorRate) {
                this.triggerAlert('High error rate', {
                    metric: 'Error Rate',
                    value: errorRate,
                    threshold: this.thresholds.errorRate,
                    severity: 'error'
                });
            }
        }
    }
    
    /**
     * Trigger alert
     */
    triggerAlert(message, details) {
        const alert = {
            timestamp: Date.now(),
            message: message,
            details: details,
            id: this.generateAlertId()
        };
        
        this.metrics.alerts.push(alert);
        
        console.warn(`🚨 Performance Alert: ${message}`, details);
        
        // Call registered callbacks
        this.alertCallbacks.forEach(callback => {
            try {
                callback(alert);
            } catch (error) {
                console.error('❌ Alert callback failed:', error);
            }
        });
    }
    
    /**
     * Register alert callback
     */
    onAlert(callback) {
        if (typeof callback === 'function') {
            this.alertCallbacks.push(callback);
        }
    }
    
    /**
     * Get performance summary
     */
    getPerformanceSummary() {
        const now = Date.now();
        const oneHourAgo = now - 3600000;
        
        // Filter recent data
        const recentPageLoad = this.metrics.pageLoad.filter(m => m.timestamp > oneHourAgo);
        const recentInteractions = this.metrics.userInteractions.filter(m => m.timestamp > oneHourAgo);
        const recentResourceUsage = this.metrics.resourceUsage.filter(m => m.timestamp > oneHourAgo);
        const recentErrors = this.metrics.errors.filter(m => m.timestamp > oneHourAgo);
        const recentAlerts = this.metrics.alerts.filter(m => m.timestamp > oneHourAgo);
        
        // Calculate averages
        const avgMetrics = {
            pageLoadTime: this.calculateAverage(recentPageLoad, 'loadTime'),
            firstContentfulPaint: this.calculateAverage(recentPageLoad, 'firstContentfulPaint'),
            largestContentfulPaint: this.calculateAverage(recentPageLoad, 'largestContentfulPaint'),
            firstInputDelay: this.calculateAverage(recentInteractions, 'firstInputDelay'),
            memoryUsage: this.calculateAverage(recentResourceUsage, 'usedJSHeapSize')
        };
        
        return {
            timestamp: now,
            period: 'Last Hour',
            metrics: avgMetrics,
            counts: {
                pageLoads: recentPageLoad.length,
                userInteractions: recentInteractions.length,
                errors: recentErrors.length,
                alerts: recentAlerts.length
            },
            alerts: recentAlerts,
            status: this.getOverallStatus(avgMetrics, recentAlerts)
        };
    }
    
    /**
     * Calculate average for metric
     */
    calculateAverage(data, metric) {
        const values = data.map(item => item[metric]).filter(val => val !== undefined && val !== null);
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
    }
    
    /**
     * Get overall performance status
     */
    getOverallStatus(metrics, alerts) {
        const criticalAlerts = alerts.filter(alert => alert.details.severity === 'error');
        const warningAlerts = alerts.filter(alert => alert.details.severity === 'warning');
        
        if (criticalAlerts.length > 0) {
            return 'critical';
        } else if (warningAlerts.length > 2) {
            return 'warning';
        } else if (
            (metrics.pageLoadTime && metrics.pageLoadTime > this.thresholds.pageLoadTime) ||
            (metrics.largestContentfulPaint && metrics.largestContentfulPaint > this.thresholds.largestContentfulPaint)
        ) {
            return 'warning';
        } else {
            return 'good';
        }
    }
    
    /**
     * Get real-time metrics
     */
    getRealTimeMetrics() {
        const now = Date.now();
        const fiveMinutesAgo = now - 300000;
        
        return {
            timestamp: now,
            pageLoad: this.metrics.pageLoad.filter(m => m.timestamp > fiveMinutesAgo),
            userInteractions: this.metrics.userInteractions.filter(m => m.timestamp > fiveMinutesAgo),
            resourceUsage: this.metrics.resourceUsage.filter(m => m.timestamp > fiveMinutesAgo),
            errors: this.metrics.errors.filter(m => m.timestamp > fiveMinutesAgo),
            alerts: this.metrics.alerts.filter(m => m.timestamp > fiveMinutesAgo)
        };
    }
    
    /**
     * Clear old metrics to prevent memory issues
     */
    cleanupOldMetrics() {
        const now = Date.now();
        const twentyFourHoursAgo = now - 86400000; // 24 hours
        
        this.metrics.pageLoad = this.metrics.pageLoad.filter(m => m.timestamp > twentyFourHoursAgo);
        this.metrics.userInteractions = this.metrics.userInteractions.filter(m => m.timestamp > twentyFourHoursAgo);
        this.metrics.resourceUsage = this.metrics.resourceUsage.filter(m => m.timestamp > twentyFourHoursAgo);
        this.metrics.errors = this.metrics.errors.filter(m => m.timestamp > twentyFourHoursAgo);
        this.metrics.alerts = this.metrics.alerts.filter(m => m.timestamp > twentyFourHoursAgo);
    }
    
    /**
     * Export metrics to JSON
     */
    exportMetrics() {
        return {
            exportTime: new Date().toISOString(),
            monitoringStatus: this.isMonitoring,
            thresholds: this.thresholds,
            metrics: this.metrics,
            summary: this.getPerformanceSummary()
        };
    }
    
    /**
     * Generate unique alert ID
     */
    generateAlertId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Update thresholds
     */
    updateThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        console.log('✅ Performance thresholds updated:', this.thresholds);
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ShrimpTechPerformanceMonitor = ShrimpTechPerformanceMonitor;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShrimpTechPerformanceMonitor;
}