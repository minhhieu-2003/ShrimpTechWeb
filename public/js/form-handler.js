/**
 * Form Handler Component
 * Xử lý form submission và validation
 */
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Contact form
        const contactForm = document.querySelector('#contact-form');
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
    }
    
    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            this.showMessage('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        try {
            // Gửi form chỉ qua API, không dùng Firebase nữa
            const result = await this.submitToAPI(data);
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                form.reset();
            } else {
                this.showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showMessage('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async submitToAPI(data) {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to form
        const form = document.querySelector('#contact-form');
        if (form) {
            form.appendChild(messageDiv);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
    
    handleNewsletterForm(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Cảm ơn bạn đã đăng ký nhận tin!');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
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

// Export for use in other modules
window.FormHandler = FormHandler;
