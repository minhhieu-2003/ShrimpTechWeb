/**
 * Form Handler Component - SMTP + Node.js Only
 * Xử lý form submission chỉ dùng Node.js backend với SMTP
 */
class FormHandler {
    constructor() {
        this.init();
        this.retryAttempts = 2; // Reduced from 3 to 2 for faster response
        this.retryDelay = 1000; // Reduced from 2000ms to 1000ms
    }
    
    init() {
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
        }
        
        // Form validation
        this.setupFormValidation();
        
        // Test SMTP connection on page load
        this.testSMTPConnection();
    }
    
    async testSMTPConnection() {
        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ SMTP Server status:', result.smtp ? 'Connected' : 'Disconnected');
            }
        } catch (error) {
            console.log('⚠️ Could not check SMTP server status');
        }
    }
    
    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            phone: formData.get('phone')?.trim(),
            message: formData.get('message')?.trim()
        };
        
        // Enhanced validation
        const validation = ValidationService.validateContactData(data);
        if (!validation.isValid) {
            this.showMessage(validation.errors.join('<br>'), 'error');
            return;
        }
        
        // Show loading state with progress
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        this.setLoadingState(submitBtn, 'Đang gửi email...');
        
        try {
            const result = await this.submitWithRetry(data, 'contact');
            
            if (result.success) {
                this.showMessage(
                    '✅ Email đã được gửi thành công!<br>' +
                    '📧 Chúng tôi sẽ phản hồi trong vòng 24 giờ.<br>' +
                    '📩 Vui lòng kiểm tra email xác nhận.', 
                    'success'
                );
                form.reset();
                this.trackFormSubmission('contact', true);
            } else {
                this.showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
                this.trackFormSubmission('contact', false);
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            
            // Fallback mailto khi tất cả endpoints fail
            this.openMailtoFallback(data);
            
            this.showMessage(
                '⚠️ Hệ thống email tạm thời gặp sự cố.<br>' +
                '📧 Đã mở ứng dụng email mặc định với thông tin của bạn.<br>' +
                '✉️ Hoặc gửi trực tiếp tới: <a href="mailto:shrimptech.vhu.hutech@gmail.com">shrimptech.vhu.hutech@gmail.com</a>', 
                'warning'
            );
            this.trackFormSubmission('contact', false);
        } finally {
            this.resetLoadingState(submitBtn, originalText);
        }
    }

    async handleNewsletterForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            email: formData.get('email')?.trim()
        };
        
        // Validate email
        if (!data.email || !ValidationService.isValidEmail(data.email)) {
            this.showMessage('Vui lòng nhập email hợp lệ', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        this.setLoadingState(submitBtn, 'Đang đăng ký...');
        
        try {
            const result = await this.submitWithRetry(data, 'newsletter');
            
            if (result.success) {
                this.showMessage(
                    '✅ Đăng ký newsletter thành công!<br>' +
                    '📧 Cảm ơn bạn đã theo dõi ShrimpTech!', 
                    'success'
                );
                form.reset();
                this.trackFormSubmission('newsletter', true);
            } else {
                this.showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
                this.trackFormSubmission('newsletter', false);
            }
            
        } catch (error) {
            console.error('Newsletter form error:', error);
            this.showMessage('❌ Không thể đăng ký newsletter. Vui lòng thử lại sau.', 'error');
            this.trackFormSubmission('newsletter', false);
        } finally {
            this.resetLoadingState(submitBtn, originalText);
        }
    }
    
    async submitWithRetry(data, type) {
        // Get submit button for progress updates
        const form = document.querySelector(`#${type}Form`);
        const submitBtn = form?.querySelector('button[type="submit"]');
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`📤 Attempt ${attempt}/${this.retryAttempts} for ${type} form`);
                
                // Update button text with progress
                if (submitBtn) {
                    const progressText = type === 'contact' ? 'Đang gửi' : 'Đang đăng ký';
                    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${progressText}... (${attempt}/${this.retryAttempts})`;
                }
                
                // Detect environment and submit
                const isProduction = window.location.hostname === 'shrimptech.vn' || 
                                   (window.location.hostname !== 'localhost' && 
                                    window.location.hostname !== '127.0.0.1');
                
                let result;
                if (isProduction) {
                    result = await this.submitToDeployedBackend(data, type);
                } else {
                    result = await this.submitToNodeJSAPI(data, type);
                }
                
                if (result.success) {
                    console.log(`✅ ${type} form submitted successfully on attempt ${attempt}`);
                    return result;
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
                
            } catch (error) {
                console.log(`❌ Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw error; // Last attempt failed
                }
                
                // Wait before retry
                console.log(`⏳ Waiting ${this.retryDelay}ms before retry...`);
                await this.delay(this.retryDelay);
                this.retryDelay *= 1.5; // Exponential backoff
            }
        }
    }
    
    async submitToDeployedBackend(data, type = 'contact') {
        const endpoints = {
            contact: [
                // Production Vercel endpoint (ƯU TIÊN)
                'https://shrimp-tech2.vercel.app/api/contact',
                // Fallback to same domain (works for both local and deployed)
                '/api/contact'
            ],
            newsletter: [
                'https://shrimp-tech2.vercel.app/api/newsletter',
                '/api/newsletter'
            ]
        };
        
        // Detect if running on localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        let backendUrls = endpoints[type] || endpoints.contact;
        
        // Only add localhost endpoint when developing locally
        if (isLocalhost) {
            backendUrls = [
                'http://localhost:3001/api/' + type,
                ...backendUrls
            ];
        }
        
        console.log(`🌐 Trying ${backendUrls.length} SMTP backends for ${type}...`);
        
        for (const url of backendUrls) {
            try {
                console.log(`📤 Trying SMTP backend: ${url}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify(data),
                    credentials: 'omit',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ SMTP email sent successfully via:', url);
                    return result;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.warn(`⚠️ SMTP Backend ${url} returned ${response.status}:`, errorData.message || 'Unknown error');
                    
                    // If this is the last URL and server returned fallback email, use it
                    if (url === backendUrls[backendUrls.length - 1] && errorData.fallback) {
                        console.log('📧 Using mailto fallback:', errorData.fallback);
                        this.openMailtoFallback(data, errorData.fallback);
                        throw new Error('Email service unavailable, opened mailto link');
                    }
                    
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ SMTP Backend ${url} error:`, error.message);
                if (url === backendUrls[backendUrls.length - 1]) {
                    throw error; // Last URL failed
                }
            }
        }
    }
    
    async submitToNodeJSAPI(data, type = 'contact') {
        const endpoints = {
            contact: [
                'http://localhost:3001/api/contact',
                'http://127.0.0.1:3001/api/contact',
                '/api/contact'
            ],
            newsletter: [
                'http://localhost:3001/api/newsletter',
                'http://127.0.0.1:3001/api/newsletter',
                '/api/newsletter'
            ]
        };
        
        const apiUrls = endpoints[type] || endpoints.contact;
        console.log(`🌐 Using local Node.js SMTP API for ${type}...`);
        
        for (const apiUrl of apiUrls) {
            try {
                console.log(`📤 Trying SMTP API: ${apiUrl}`);
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log(`✅ SMTP Success with API: ${apiUrl}`);
                    return result;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ SMTP API ${apiUrl} error:`, error.message);
                if (apiUrl === apiUrls[apiUrls.length - 1]) {
                    // If all local APIs failed, try deployed backends
                    console.log('🔄 All local SMTP APIs failed, trying deployed backends...');
                    return await this.submitToDeployedBackend(data, type);
                }
            }
        }
    }
    
    setLoadingState(button, message) {
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    }
    
    resetLoadingState(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    trackFormSubmission(type, success) {
        // Track form submissions for analytics
        console.log(`📊 Form submission tracked: ${type} - ${success ? 'Success' : 'Failed'}`);
        
        // Optional: Send analytics to Google Analytics or other services
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_type': type,
                'success': success,
                'page_url': window.location.href
            });
        }
    }
    
    // Fallback method khi tất cả endpoints fail
    openMailtoFallback(data, fallbackEmail = 'shrimptech.vhu.hutech@gmail.com') {
        const subject = encodeURIComponent('[SHRIMPTECH] Liên hệ từ website');
        const body = encodeURIComponent(
            `Tên: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Điện thoại: ${data.phone || 'Không có'}\n\n` +
            `Tin nhắn:\n${data.message}\n\n` +
            `---\n` +
            `Gửi từ: ${window.location.href}\n` +
            `Thời gian: ${new Date().toLocaleString()}`
        );
        
        const mailtoUrl = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
        
        try {
            // ✅ FIX: Dùng window.location.href thay vì window.open để tránh bị Chrome block
            window.location.href = mailtoUrl;
            console.log('📧 Opened mailto fallback:', fallbackEmail);
            
            // Show confirmation message
            this.showMessage(
                `📧 Đã mở ứng dụng email. Nếu không tự động mở, vui lòng gửi email đến: ${fallbackEmail}`,
                'info'
            );
        } catch (error) {
            console.error('Failed to open mailto:', error);
            
            // Ultimate fallback: Copy email to clipboard
            this.copyToClipboard(fallbackEmail);
        }
    }
    
    // Helper: Copy text to clipboard
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage(
                    `📋 Đã copy email vào clipboard: ${text}\nVui lòng dán vào ứng dụng email của bạn.`,
                    'info'
                );
                console.log('✅ Email copied to clipboard:', text);
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.showEmailManually(text);
            });
        } else {
            // Fallback for older browsers
            this.showEmailManually(text);
        }
    }
    
    // Show email address in alert as last resort
    showEmailManually(email) {
        alert(`Vui lòng gửi email đến:\n\n${email}\n\nHoặc gọi hotline: 0835 749 407`);
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message with better styling
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <div class="message-text">${message}</div>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to form with animation
        const form = document.querySelector('#contactForm') || document.querySelector('#newsletterForm');
        if (form) {
            form.appendChild(messageDiv);
            
            // Animate in
            setTimeout(() => messageDiv.classList.add('show'), 100);
            
            // Auto remove after 8 seconds for success, 10 seconds for error
            const timeout = type === 'error' ? 10000 : 8000;
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.classList.add('fade-out');
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, timeout);
        }
    }
    
    setupFormValidation() {
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', this.validateField.bind(this));
            field.addEventListener('input', this.clearValidationError.bind(this));
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate
        let errorMessage = '';
        
        if (!value && field.hasAttribute('required')) {
            errorMessage = 'Trường này là bắt buộc';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            errorMessage = 'Email không hợp lệ';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            errorMessage = 'Số điện thoại không hợp lệ';
        }
        
        if (errorMessage) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearValidationError(e) {
        const field = e.target;
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[0-9+\-\s\(\)]{10,15}$/.test(phone);
    }
}

// Enhanced validation service
class ValidationService {
    static validateContactData(data) {
        const errors = [];
        
        // Name validation
        if (!data.name || data.name.length < 2) {
            errors.push('Tên phải có ít nhất 2 ký tự');
        } else if (data.name.length > 50) {
            errors.push('Tên không được quá 50 ký tự');
        }
        
        // Email validation
        if (!data.email) {
            errors.push('Email là bắt buộc');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Email không hợp lệ');
        }
        
        // Phone validation (optional)
        if (data.phone && !this.isValidVietnamesePhone(data.phone)) {
            errors.push('Số điện thoại Việt Nam không hợp lệ (VD: 0901234567)');
        }
        
        // Message validation
        if (!data.message || data.message.length < 10) {
            errors.push('Tin nhắn phải có ít nhất 10 ký tự');
        } else if (data.message.length > 1000) {
            errors.push('Tin nhắn không được quá 1000 ký tự');
        }
        
        return { isValid: errors.length === 0, errors };
    }
    
    static validateNewsletterData(data) {
        const errors = [];
        
        if (!data.email) {
            errors.push('Email là bắt buộc');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Email không hợp lệ');
        }
        
        return { isValid: errors.length === 0, errors };
    }
    
    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    static isValidVietnamesePhone(phone) {
        // Vietnamese phone regex - supports various formats
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(cleanPhone);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
    console.log('✅ FormHandler initialized with SMTP support');
    console.log('🌐 Environment:', window.location.hostname);
});

// Thay phần khởi tạo endpoints bằng đoạn sau (hoặc chỉnh logic tương ứng trong EmailService)
const host = window.location.hostname;
const isFirebaseHost = host.endsWith('.web.app') || host.endsWith('.firebaseapp.com');

if (isFirebaseHost) {
    // Khi chạy trên Firebase hosting: KHÔNG dùng relative '/api' (sẽ bị rewrite về index.html)
    window.API_BACKENDS = [
        'https://shrimptech-api.railway.app/api/contact',
        'https://shrimptech-web.vercel.app/api/contact',
        'https://shrimptech-web.netlify.app/.netlify/functions/contact'
    ];
} else {
    // Local / dev: ưu tiên localhost, có thể dùng relative '/api' khi backend cùng host
    window.API_BACKENDS = [
        'http://localhost:3002/api/contact',
        'http://localhost:3001/api/contact',
        '/api/contact' // chỉ dùng làm fallback trên local/dev
    ];
}

// Export for use in other modules
window.FormHandler = FormHandler;
window.ValidationService = ValidationService;