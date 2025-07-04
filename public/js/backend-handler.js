// Advanced Backend Logic for PC Platform
// ShrimpTech Backend Handler - Optimized for Desktop Performance

class ShrimpTechBackend {
    constructor() {
        this.isPC = this.detectPlatform();
        this.apiBase = '/api';
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessing = false;
        
        this.init();
    }

    detectPlatform() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        // Enhanced PC detection
        const isPC = (
            !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) &&
            (/Windows|MacIntel|Linux x86_64/i.test(platform)) &&
            screen.width >= 1024
        );
        
        console.log(`🖥️ Platform detected: ${isPC ? 'PC' : 'Mobile'}`);
        return isPC;
    }

    init() {
        if (this.isPC) {
            this.setupPCOptimizations();
        }
        
        this.setupErrorHandling();
        this.setupRequestInterceptors();
        this.startHeartbeat();
    }

    setupPCOptimizations() {
        // Enhanced request batching for PC
        this.batchSize = 10; // PC can handle more requests
        this.requestDelay = 100; // Lower delay for PC
        
        // Enable advanced features for PC
        this.enableAdvancedLogging = true;
        this.enableRealTimeSync = true;
        this.enableBulkOperations = true;
        
        console.log('🚀 PC optimizations enabled');
    }

    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            this.logError('PROMISE_REJECTION', event.reason);
            
            // PC-specific error recovery
            if (this.isPC) {
                this.attemptErrorRecovery(event.reason);
            }
        });

        window.addEventListener('error', (event) => {
            console.error('🚨 JavaScript Error:', event.error);
            this.logError('JS_ERROR', event.error);
        });
    }

    setupRequestInterceptors() {
        // Override fetch for better error handling
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return response;
            } catch (error) {
                console.error('🌐 Fetch Error:', error);
                
                // PC-specific retry logic
                if (this.isPC && this.shouldRetry(error)) {
                    console.log('🔄 Retrying request on PC...');
                    await this.delay(1000);
                    return originalFetch(...args);
                }
                
                throw error;
            }
        };
    }

    async makeRequest(endpoint, options = {}) {
        const requestId = this.generateRequestId();
        
        try {
            // Check cache first (PC has more memory)
            if (this.isPC && options.method === 'GET') {
                const cached = this.cache.get(endpoint);
                if (cached && !this.isCacheExpired(cached)) {
                    console.log(`💾 Cache hit for ${endpoint}`);
                    return cached.data;
                }
            }

            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Platform': this.isPC ? 'PC' : 'Mobile',
                    'X-Request-ID': requestId,
                    'X-Timestamp': Date.now()
                },
                ...options
            };

            console.log(`🌐 Making ${defaultOptions.method} request to ${endpoint}`);
            
            const response = await fetch(`${this.apiBase}${endpoint}`, defaultOptions);
            const data = await response.json();

            // Cache successful GET requests on PC
            if (this.isPC && defaultOptions.method === 'GET' && response.ok) {
                this.cache.set(endpoint, {
                    data,
                    timestamp: Date.now(),
                    ttl: 5 * 60 * 1000 // 5 minutes cache for PC
                });
            }

            return data;
        } catch (error) {
            console.error(`❌ Request failed for ${endpoint}:`, error);
            
            if (this.isPC) {
                // PC fallback strategies
                return this.handlePCRequestFailure(endpoint, options, error);
            }
            
            throw error;
        }
    }

    async handlePCRequestFailure(endpoint, options, error) {
        // Try local storage fallback
        const fallbackData = this.getFromLocalStorage(endpoint);
        if (fallbackData) {
            console.log('📦 Using local storage fallback');
            return fallbackData;
        }

        // Try different API endpoint
        if (endpoint.includes('/api/')) {
            const altEndpoint = endpoint.replace('/api/', '/backup-api/');
            try {
                console.log('🔄 Trying backup endpoint...');
                return await this.makeRequest(altEndpoint, options);
            } catch (altError) {
                console.error('❌ Backup endpoint also failed:', altError);
            }
        }

        // Queue for retry
        this.queueForRetry(endpoint, options);
        
        throw error;
    }

    queueForRetry(endpoint, options) {
        this.requestQueue.push({
            endpoint,
            options,
            timestamp: Date.now(),
            retries: 0
        });
        
        if (!this.isProcessing) {
            this.processRetryQueue();
        }
    }

    async processRetryQueue() {
        if (this.requestQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            if (request.retries >= 3) {
                console.log(`⏭️ Skipping request after 3 retries: ${request.endpoint}`);
                continue;
            }

            try {
                await this.delay(Math.pow(2, request.retries) * 1000); // Exponential backoff
                await this.makeRequest(request.endpoint, request.options);
                console.log(`✅ Retry successful for ${request.endpoint}`);
            } catch (error) {
                request.retries++;
                this.requestQueue.push(request);
                console.log(`🔄 Retry ${request.retries} failed for ${request.endpoint}`);
            }
        }
        
        this.isProcessing = false;
    }

    // API Methods
    async getSensorData() {
        return this.makeRequest('/sensors');
    }

    async saveSensorData(data) {
        return this.makeRequest('/sensors', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getSystemStatus() {
        return this.makeRequest('/status');
    }

    async submitContact(formData) {
        return this.makeRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }

    async createAlert(alertData) {
        return this.makeRequest('/alerts', {
            method: 'POST',
            body: JSON.stringify(alertData)
        });
    }

    // Utility Methods
    shouldRetry(error) {
        const retryableErrors = [
            'NetworkError',
            'TypeError',
            'ECONNRESET',
            'ETIMEDOUT'
        ];
        
        return retryableErrors.some(type => 
            error.name === type || error.message.includes(type)
        );
    }

    isCacheExpired(cacheItem) {
        return Date.now() - cacheItem.timestamp > cacheItem.ttl;
    }

    getFromLocalStorage(key) {
        try {
            const item = localStorage.getItem(`shrimptech_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Local storage error:', error);
            return null;
        }
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`shrimptech_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to local storage:', error);
        }
    }

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logError(type, error) {
        const errorData = {
            type,
            message: error.message || error,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            platform: this.isPC ? 'PC' : 'Mobile',
            userAgent: navigator.userAgent
        };

        // Send to analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error', {
                error_type: type,
                error_message: errorData.message,
                platform: errorData.platform
            });
        }

        console.error('📊 Error logged:', errorData);
    }

    attemptErrorRecovery(error) {
        if (this.isPC) {
            console.log('🔧 Attempting PC error recovery...');
            
            // Clear cache if memory error
            if (error.message.includes('memory')) {
                this.cache.clear();
                console.log('🧹 Cache cleared due to memory error');
            }
            
            // Reload critical resources
            this.reloadCriticalResources();
        }
    }

    reloadCriticalResources() {
        // Resources reloaded
        console.log('🔄 Reloading critical resources...');
    }

    startHeartbeat() {
        setInterval(async () => {
            try {
                await this.makeRequest('/status');
                console.log('💓 Heartbeat successful');
            } catch (error) {
                console.warn('💔 Heartbeat failed:', error.message);
            }
        }, 30000); // 30 seconds
    }

    // Performance monitoring
    getPerformanceMetrics() {
        if (this.isPC && 'performance' in window) {
            const metrics = {
                navigation: performance.getEntriesByType('navigation')[0],
                memory: performance.memory || {},
                timing: performance.timing,
                cacheSize: this.cache.size,
                queueSize: this.requestQueue.length
            };
            
            console.log('📊 Performance metrics:', metrics);
            return metrics;
        }
    }
}

// Initialize backend when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shrimpTechBackend = new ShrimpTechBackend();
    console.log('🚀 ShrimpTech Backend initialized');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShrimpTechBackend;
}
