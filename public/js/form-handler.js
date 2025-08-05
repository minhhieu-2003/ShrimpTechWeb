/**
 * Form Handler Component
 * Xử lý form submission và validation với email service
 */
class FormHandler {
    constructor() {
        this.backendHandler = window.shrimpTechBackend || null;
        this.isMobile = this.detectMobile();
        this.init();
    }
    
    detectMobile() {
        return (
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            navigator.maxTouchPoints > 1 ||
            window.innerWidth < 768
        );
    }
    
    init() {
        // Contact form
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
            
            // Mobile-specific enhancements
            if (this.isMobile) {
                this.setupMobileFormEnhancements(contactForm);
            }
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
        }
        
        // Form validation
        this.setupFormValidation();
        
        // Mobile viewport handling
        if (this.isMobile) {
            this.setupMobileViewport();
        }
    }
    
    setupMobileFormEnhancements(form) {
        // Prevent double submission on mobile
        let isSubmitting = false;
        form.addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
        });
        
        // Handle mobile input focus
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Small delay to ensure keyboard is visible
                setTimeout(() => {
                    input.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 300);
            });
            
            // Add mobile-friendly input styling
            input.style.fontSize = '16px'; // Prevent zoom on iOS
        });
        
        // Enhanced checkbox handling for mobile
        this.setupMobileCheckboxes(form);
    }
    
    setupMobileCheckboxes(form) {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.closest('.checkbox-label');
            if (!label) return;
            
            // Enhance mobile touch handling
            label.addEventListener('touchstart', (e) => {
                // Add visual feedback
                label.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
                label.style.borderRadius = '4px';
            });
            
            label.addEventListener('touchend', (e) => {
                // Remove visual feedback
                setTimeout(() => {
                    label.style.backgroundColor = '';
                    label.style.borderRadius = '';
                }, 150);
            });
            
            // Handle checkbox state changes
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });
    }
    
    handleCheckboxChange(checkbox) {
        const formGroup = checkbox.closest('.form-group');
        const label = checkbox.closest('.checkbox-label');
        
        // Clear any previous validation errors
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
        
        // Add checked state styling
        if (checkbox.checked) {
            label.classList.add('checked');
        } else {
            label.classList.remove('checked');
        }
        
        // Special handling for terms checkbox
        if (checkbox.id === 'terms') {
            this.validateTermsCheckbox(checkbox);
        }
    }
    
    validateTermsCheckbox(termsCheckbox) {
        const formGroup = termsCheckbox.closest('.form-group');
        
        if (!termsCheckbox.checked) {
            // Show error if terms not accepted
            if (formGroup && !formGroup.querySelector('.error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Bạn phải đồng ý với điều khoản sử dụng';
                formGroup.appendChild(errorDiv);
                formGroup.classList.add('error');
            }
            return false;
        }
        
        return true;
    }
    
    setupMobileViewport() {
        // Handle mobile viewport changes (keyboard show/hide)
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = initialViewportHeight - currentHeight;
            
            // If height decreased by more than 150px, keyboard is likely visible
            if (heightDiff > 150) {
                document.body.classList.add('keyboard-visible');
            } else {
                document.body.classList.remove('keyboard-visible');
            }
        });
    }
    
    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            farmType: formData.get('farmType'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on'
        };
        
        // Validate required fields
        if (!data.name || !data.email || !data.phone || !data.message) {
            this.showMessage('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
            return;
        }

        // Validate terms checkbox with enhanced mobile handling
        const termsCheckbox = form.querySelector('#terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            if (this.isMobile) {
                // Enhanced mobile terms validation
                this.showMessage('Vui lòng đồng ý với điều khoản sử dụng để tiếp tục.', 'error');
                
                // Scroll to terms checkbox and highlight it
                const termsGroup = termsCheckbox.closest('.checkbox-group');
                if (termsGroup) {
                    termsGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    termsGroup.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                    termsGroup.style.borderRadius = '8px';
                    termsGroup.style.padding = '8px';
                    
                    setTimeout(() => {
                        termsGroup.style.backgroundColor = '';
                        termsGroup.style.borderRadius = '';
                        termsGroup.style.padding = '';
                    }, 3000);
                }
            } else {
                this.showMessage('Vui lòng đồng ý với điều khoản sử dụng.', 'error');
            }
            return;
        }
        
        // Show loading state with mobile optimization
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        if (this.isMobile) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
            submitBtn.style.minHeight = '44px'; // Maintain touch target size
        } else {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        }
        
        submitBtn.disabled = true;
        
        try {
            let result;
            if (this.backendHandler) {
                // Sử dụng backend handler với email service
                result = await this.backendHandler.handleContactForm(data);
            } else {
                // Fallback: gửi trực tiếp qua API
                result = await this.submitToAPI(data);
            }
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                form.reset();
                
                // Clear validation states and checkbox states
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error', 'success');
                });
                
                document.querySelectorAll('.checkbox-label').forEach(label => {
                    label.classList.remove('checked');
                });
                
                // Mobile: scroll to success message
                if (this.isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                this.showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            const errorMessage = this.isMobile ? 
                'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.' :
                'Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.';
            this.showMessage(errorMessage, 'error');
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

    async submitNewsletterToAPI(email) {
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
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
        
        // Create new message with mobile optimization
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        
        // Mobile-specific styling
        const mobileStyles = this.isMobile ? `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ` : '';
        
        messageDiv.innerHTML = `
            <div class="message-content" style="${mobileStyles}">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${message}</span>
                ${this.isMobile ? '<button class="close-message" style="margin-left: auto; background: none; border: none; color: inherit; font-size: 18px;">×</button>' : ''}
            </div>
        `;
        
        // Add to appropriate container
        const container = this.isMobile ? document.body : document.querySelector('#contactForm') || document.body;
        container.appendChild(messageDiv);
        
        // Mobile close button
        if (this.isMobile) {
            const closeBtn = messageDiv.querySelector('.close-message');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => messageDiv.remove());
            }
        }
        
        // Auto remove with different timing for mobile
        const removeDelay = this.isMobile ? 7000 : 5000;
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, removeDelay);
        
        // Mobile: scroll to show message
        if (this.isMobile) {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    async handleNewsletterForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            this.showMessage('Vui lòng nhập email', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Email không hợp lệ', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        try {
            let result;
            if (this.backendHandler) {
                result = await this.backendHandler.handleNewsletterForm(email);
            } else {
                // Fallback
                result = await this.submitNewsletterToAPI(email);
            }
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                form.reset();
            } else {
                this.showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            this.showMessage('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
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

// Export for use in other modules
window.FormHandler = FormHandler;
