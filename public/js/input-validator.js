/**
 * Input Validation and Sanitization Library
 * Comprehensive security validation for SHRIMPTECH forms and inputs
 */

class InputValidator {
    constructor() {
        this.securityConfig = window.ShrimpTechSecurity;
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^[+]?[\d\s\-\(\)]{10,15}$/,
            name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            alphanumeric: /^[a-zA-Z0-9\s]+$/,
            numeric: /^\d+$/,
            slug: /^[a-z0-9-]+$/,
            ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        };
        
        this.xssPatterns = [
            /<script[^>]*>[\s\S]*?<\/script>/gi,
            /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
            /<object[^>]*>[\s\S]*?<\/object>/gi,
            /<embed[^>]*>/gi,
            /<form[^>]*>[\s\S]*?<\/form>/gi,
            /on\w+\s*=\s*["\']?[^"\'>\s]+["\']?/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /data:/gi,
            /<link[^>]*>/gi,
            /<meta[^>]*>/gi
        ];
    }

    // Main validation function
    validate(value, rules = {}) {
        const result = {
            valid: true,
            errors: [],
            sanitized: value,
            warnings: []
        };

        // Handle null/undefined
        if (value === null || value === undefined) {
            value = '';
        }

        // Convert to string
        value = String(value);
        
        // Check required
        if (rules.required && this.isEmpty(value)) {
            result.valid = false;
            result.errors.push('This field is required');
            return result;
        }

        // Skip validation for empty non-required fields
        if (!rules.required && this.isEmpty(value)) {
            result.sanitized = '';
            return result;
        }

        // Sanitize input
        result.sanitized = this.sanitize(value, rules.type || 'text');

        // Length validation
        if (rules.minLength && result.sanitized.length < rules.minLength) {
            result.valid = false;
            result.errors.push(`Minimum length is ${rules.minLength} characters`);
        }

        if (rules.maxLength && result.sanitized.length > rules.maxLength) {
            result.valid = false;
            result.errors.push(`Maximum length is ${rules.maxLength} characters`);
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(result.sanitized)) {
            result.valid = false;
            result.errors.push('Invalid format');
        }

        // Type-specific validation
        if (rules.type) {
            const typeValidation = this.validateType(result.sanitized, rules.type);
            if (!typeValidation.valid) {
                result.valid = false;
                result.errors.push(...typeValidation.errors);
            }
            if (typeValidation.warnings) {
                result.warnings.push(...typeValidation.warnings);
            }
        }

        // Custom validator
        if (rules.validator && typeof rules.validator === 'function') {
            const customResult = rules.validator(result.sanitized);
            if (!customResult.valid) {
                result.valid = false;
                result.errors.push(...customResult.errors);
            }
        }

        // XSS detection
        if (this.detectXSS(value)) {
            result.valid = false;
            result.errors.push('Potentially malicious content detected');
            result.warnings.push('Input contains suspicious patterns');
        }

        return result;
    }

    // Sanitization methods
    sanitize(input, type = 'text') {
        if (typeof input !== 'string') {
            input = String(input);
        }

        // Basic HTML encoding
        let sanitized = this.htmlEncode(input);

        // Type-specific sanitization
        switch (type) {
            case 'email':
                sanitized = this.sanitizeEmail(sanitized);
                break;
            case 'name':
                sanitized = this.sanitizeName(sanitized);
                break;
            case 'phone':
                sanitized = this.sanitizePhone(sanitized);
                break;
            case 'url':
                sanitized = this.sanitizeURL(sanitized);
                break;
            case 'number':
                sanitized = this.sanitizeNumber(sanitized);
                break;
            case 'text':
            default:
                sanitized = this.sanitizeText(sanitized);
                break;
        }

        return sanitized.trim();
    }

    htmlEncode(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    sanitizeEmail(email) {
        return email.toLowerCase()
            .replace(/[^\w@.-]/g, '')
            .substring(0, 254);
    }

    sanitizeName(name) {
        return name.replace(/[^a-zA-ZÀ-ỹ\s'-]/g, '')
            .replace(/\s+/g, ' ')
            .substring(0, 50);
    }

    sanitizePhone(phone) {
        return phone.replace(/[^\d\s\-\(\)\+]/g, '')
            .substring(0, 15);
    }

    sanitizeURL(url) {
        try {
            const urlObj = new URL(url);
            if (['http:', 'https:'].includes(urlObj.protocol)) {
                return urlObj.href;
            }
        } catch (e) {
            // Invalid URL
        }
        return '';
    }

    sanitizeNumber(num) {
        return num.replace(/[^\d.-]/g, '');
    }

    sanitizeText(text) {
        // Remove potential script tags and suspicious content
        let sanitized = text;
        this.xssPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        return sanitized.substring(0, 1000);
    }

    // Type validation
    validateType(value, type) {
        const result = { valid: true, errors: [], warnings: [] };

        switch (type) {
            case 'email':
                if (!this.patterns.email.test(value)) {
                    result.valid = false;
                    result.errors.push('Invalid email format');
                }
                break;

            case 'phone':
                if (!this.patterns.phone.test(value)) {
                    result.valid = false;
                    result.errors.push('Invalid phone number format');
                }
                break;

            case 'name':
                if (!this.patterns.name.test(value)) {
                    result.valid = false;
                    result.errors.push('Name can only contain letters and spaces');
                }
                break;

            case 'url':
                if (!this.patterns.url.test(value)) {
                    result.valid = false;
                    result.errors.push('Invalid URL format');
                }
                break;

            case 'number':
                if (isNaN(value) || !isFinite(value)) {
                    result.valid = false;
                    result.errors.push('Must be a valid number');
                }
                break;

            case 'ip':
                if (!this.patterns.ip.test(value)) {
                    result.valid = false;
                    result.errors.push('Invalid IP address format');
                }
                break;
        }

        return result;
    }

    // XSS Detection
    detectXSS(input) {
        if (typeof input !== 'string') return false;

        // Check for common XSS patterns
        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    // Utility methods
    isEmpty(value) {
        return value === null || 
               value === undefined || 
               value === '' || 
               (typeof value === 'string' && value.trim() === '');
    }

    // Form validation
    validateForm(formData, rules) {
        const results = {};
        let isValid = true;

        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const fieldRules = rules[field];
            
            results[field] = this.validate(value, fieldRules);
            
            if (!results[field].valid) {
                isValid = false;
            }
        });

        return {
            valid: isValid,
            fields: results,
            sanitizedData: Object.keys(results).reduce((acc, field) => {
                acc[field] = results[field].sanitized;
                return acc;
            }, {})
        };
    }

    // Real-time validation for form fields
    setupRealtimeValidation(form, rules) {
        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const errorContainer = this.createErrorContainer(field);
            
            field.addEventListener('blur', () => {
                this.validateAndDisplayErrors(field, rules[fieldName], errorContainer);
            });

            field.addEventListener('input', () => {
                // Clear errors on input
                this.clearErrors(errorContainer);
                
                // Sanitize on input
                const sanitized = this.sanitize(field.value, rules[fieldName].type);
                if (sanitized !== field.value) {
                    field.value = sanitized;
                }
            });
        });
    }

    validateAndDisplayErrors(field, rules, errorContainer) {
        const result = this.validate(field.value, rules);
        
        this.clearErrors(errorContainer);
        
        if (!result.valid) {
            field.classList.add('invalid');
            this.displayErrors(errorContainer, result.errors);
        } else {
            field.classList.remove('invalid');
            if (result.warnings.length > 0) {
                this.displayWarnings(errorContainer, result.warnings);
            }
        }
        
        // Update field with sanitized value
        if (result.sanitized !== field.value) {
            field.value = result.sanitized;
        }
    }

    createErrorContainer(field) {
        let container = field.parentNode.querySelector('.validation-errors');
        if (!container) {
            container = document.createElement('div');
            container.className = 'validation-errors';
            field.parentNode.appendChild(container);
        }
        return container;
    }

    displayErrors(container, errors) {
        container.innerHTML = errors.map(error => 
            `<div class="error-message">${error}</div>`
        ).join('');
        container.style.display = 'block';
    }

    displayWarnings(container, warnings) {
        container.innerHTML = warnings.map(warning => 
            `<div class="warning-message">${warning}</div>`
        ).join('');
        container.style.display = 'block';
    }

    clearErrors(container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }

    // Predefined validation rules for common forms
    getContactFormRules() {
        return {
            name: {
                type: 'name',
                required: true,
                minLength: 2,
                maxLength: 50
            },
            email: {
                type: 'email',
                required: true,
                maxLength: 254
            },
            phone: {
                type: 'phone',
                required: false,
                maxLength: 15
            },
            company: {
                type: 'text',
                required: false,
                maxLength: 100,
                pattern: /^[a-zA-ZÀ-ỹ0-9\s\-\.]*$/
            },
            message: {
                type: 'text',
                required: true,
                minLength: 10,
                maxLength: 1000
            }
        };
    }

    getNewsletterRules() {
        return {
            email: {
                type: 'email',
                required: true,
                maxLength: 254
            },
            name: {
                type: 'name',
                required: false,
                maxLength: 50
            }
        };
    }
}

// Initialize global validator
window.ShrimpTechValidator = new InputValidator();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
}