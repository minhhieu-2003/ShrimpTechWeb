// Advanced Backend Logic for PC Platform
// ShrimpTech Backend Handler - Optimized for Desktop Performance

class ShrimpTechBackend {
    constructor() {
        this.isPC = this.detectPlatform();
        this.apiBase = '/api';
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessing = false;
        this.emailService = new EmailService();
        
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
        } else {
            this.setupMobileOptimizations();
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

    setupMobileOptimizations() {
        // Optimized settings for mobile
        this.batchSize = 3; // Mobile handles fewer concurrent requests
        this.requestDelay = 300; // Higher delay for mobile
        
        // Mobile-specific features
        this.enableAdvancedLogging = false; // Reduce mobile console spam
        this.enableRealTimeSync = false; // Save mobile battery
        this.enableBulkOperations = false; // Prevent mobile overload
        this.useOfflineCache = true; // Enable offline capability
        
        // Mobile touch optimizations
        this.setupMobileTouchHandlers();
        
        console.log('📱 Mobile optimizations enabled');
    }

    setupMobileTouchHandlers() {
        // Prevent double-tap zoom on form buttons
        document.addEventListener('touchend', (e) => {
            if (e.target.type === 'submit' || e.target.classList.contains('btn')) {
                e.preventDefault();
                e.target.click();
            }
        });

        // Handle mobile form focus issues
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Scroll input into view on mobile
                setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }

    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            this.logError('PROMISE_REJECTION', event.reason);
            
            // Platform-specific error recovery
            if (this.isPC) {
                this.attemptErrorRecovery(event.reason);
            } else {
                this.attemptMobileErrorRecovery(event.reason);
            }
        });

        window.addEventListener('error', (event) => {
            console.error('🚨 JavaScript Error:', event.error);
            this.logError('JS_ERROR', event.error);
        });

        // Mobile-specific error handling
        if (!this.isPC) {
            this.setupMobileErrorHandling();
        }
    }

    setupMobileErrorHandling() {
        // Handle mobile network issues
        window.addEventListener('online', () => {
            console.log('📶 Mobile connection restored');
            this.retryFailedRequests();
        });

        window.addEventListener('offline', () => {
            console.log('📵 Mobile connection lost');
            this.handleOfflineMode();
        });

        // Handle mobile memory issues
        window.addEventListener('pagehide', () => {
            this.clearMobileCache();
        });
    }

    attemptMobileErrorRecovery(error) {
        // Simplified error recovery for mobile
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            console.log('📱 Attempting mobile network recovery...');
            this.showMobileOfflineMessage();
        }
    }

    showMobileOfflineMessage() {
        if (!this.isPC) {
            const message = document.createElement('div');
            message.className = 'mobile-offline-message';
            message.innerHTML = `
                <div style="
                    position: fixed; 
                    top: 20px; 
                    left: 20px; 
                    right: 20px; 
                    background: #ff6b35; 
                    color: white; 
                    padding: 12px; 
                    border-radius: 8px; 
                    text-align: center; 
                    z-index: 10000;
                    font-size: 14px;
                ">
                    📵 Mất kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.
                </div>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 5000);
        }
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

    // Email handling methods
    async handleContactForm(formData) {
        try {
            console.log('📧 Processing contact form...', formData);
            
            // Validate dữ liệu với logic tối ưu cho từng platform
            const validationResult = this.isPC ? 
                this.validateContactData(formData) : 
                this.validateContactDataMobile(formData);
                
            if (!validationResult.isValid) {
                return {
                    success: false,
                    message: validationResult.message
                };
            }

            // Gửi email thông báo cho admin
            const result = await this.emailService.sendContactEmail(formData);
            
            console.log('✅ Contact email sent successfully');

            // Lưu vào cache theo platform
            if (this.isPC) {
                this.cache.set(`contact_${Date.now()}`, formData);
            } else {
                // Mobile: chỉ lưu thông tin cơ bản
                this.cache.set(`mobile_contact_${Date.now()}`, {
                    name: formData.name,
                    email: formData.email,
                    timestamp: Date.now()
                });
            }

            return {
                success: true,
                message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.'
            };

        } catch (error) {
            console.error('❌ Contact form error:', error);
            this.logError('contact_form', error);
            
            // Mobile-specific error message
            const errorMessage = this.isPC ? 
                'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.' :
                'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại sau.';
            
            return {
                success: false,
                message: errorMessage
            };
        }
    }

    // Alias method for newsletter subscription (compatibility)
    async subscribeNewsletter(data) {
        return await this.handleNewsletterForm(data.email);
    }

    async handleNewsletterForm(email) {
        try {
            console.log('📬 Processing newsletter subscription...', email);
            
            // Validate email
            if (!this.isValidEmail(email)) {
                return {
                    success: false,
                    message: 'Email không hợp lệ'
                };
            }

            // Gửi thông báo đăng ký mới
            await this.emailService.sendNewsletterEmail(email);

            // Cache cho PC
            if (this.isPC) {
                const newsletters = this.cache.get('newsletters') || [];
                newsletters.push({ email, timestamp: new Date().toISOString() });
                this.cache.set('newsletters', newsletters);
            }

            return {
                success: true,
                message: 'Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những tin tức mới nhất về dự án.'
            };

        } catch (error) {
            console.error('❌ Newsletter error:', error);
            this.logError('newsletter', error);
            
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
            };
        }
    }

    // Mobile-specific utility methods
    clearMobileCache() {
        if (!this.isPC && this.cache.size > 5) {
            // Clear older entries to free mobile memory
            const entries = Array.from(this.cache.entries());
            entries.slice(0, -3).forEach(([key]) => {
                this.cache.delete(key);
            });
            console.log('📱 Mobile cache cleared');
        }
    }

    retryFailedRequests() {
        if (!this.isPC && this.failedRequests && this.failedRequests.length > 0) {
            console.log('📱 Retrying failed mobile requests...');
            this.failedRequests.forEach(async (request) => {
                try {
                    await this.makeRequest(request.endpoint, request.options);
                } catch (error) {
                    console.log('📱 Retry failed:', error);
                }
            });
            this.failedRequests = [];
        }
    }

    handleOfflineMode() {
        if (!this.isPC) {
            this.failedRequests = this.failedRequests || [];
            console.log('📱 Mobile offline mode activated');
        }
    }

    // Enhanced mobile detection
    isMobileDevice() {
        return (
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            navigator.maxTouchPoints > 1 ||
            screen.width < 768
        );
    }

    // Mobile-optimized form validation
    validateContactDataMobile(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Họ tên phải có ít nhất 2 ký tự');
        }
        
        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Email không hợp lệ');
        }
        
        if (!formData.phone || formData.phone.length < 10) {
            errors.push('Số điện thoại phải có ít nhất 10 số');
        }
        
        if (!formData.message || formData.message.trim().length < 10) {
            errors.push('Nội dung tin nhắn phải có ít nhất 10 ký tự');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            message: errors.length > 0 ? errors[0] : null
        };
    }

    validateContactData(data) {
        const required = ['name', 'email', 'phone', 'message'];
        
        for (const field of required) {
            if (!data[field] || !data[field].toString().trim()) {
                return {
                    isValid: false,
                    message: `Vui lòng điền ${this.getFieldName(field)}`
                };
            }
        }

        // Validate email format
        if (!this.isValidEmail(data.email)) {
            return {
                isValid: false,
                message: 'Email không hợp lệ'
            };
        }

        // Validate phone format
        if (!this.isValidPhone(data.phone)) {
            return {
                isValid: false,
                message: 'Số điện thoại không hợp lệ'
            };
        }

        return { isValid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Hỗ trợ format Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx
        const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    getFieldName(field) {
        const fieldNames = {
            name: 'họ và tên',
            email: 'email',
            phone: 'số điện thoại',
            message: 'nội dung tin nhắn',
            company: 'tên công ty',
            farmType: 'loại ao nuôi',
            subject: 'chủ đề quan tâm'
        };
        return fieldNames[field] || field;
    }

    // Send test email (for debugging)
    async sendTestEmail() {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '0123456789',
            message: 'Đây là tin nhắn test từ hệ thống SHRIMPTECH',
            company: 'Test Company',
            farmType: 'pond-small',
            subject: 'product-info'
        };

        try {
            const result = await this.handleContactForm(testData);
            console.log('🧪 Test email result:', result);
            return result;
        } catch (error) {
            console.error('❌ Test email error:', error);
            return { success: false, message: error.message };
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
