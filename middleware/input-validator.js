/**
 * Input Validation and Sanitization Middleware
 * Provides comprehensive input validation and XSS protection
 */

class InputValidator {
    constructor() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: 'Tên chỉ được chứa chữ cái và khoảng trắng'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                maxLength: 255,
                message: 'Email không hợp lệ'
            },
            phone: {
                required: true,
                pattern: /^[0-9+\-\s()]+$/,
                minLength: 10,
                maxLength: 15,
                message: 'Số điện thoại không hợp lệ'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Tin nhắn phải có từ 10-1000 ký tự'
            },
            company: {
                required: false,
                maxLength: 200,
                pattern: /^[a-zA-ZÀ-ỹ0-9\s\.,\-&]+$/,
                message: 'Tên công ty chứa ký tự không hợp lệ'
            }
        };

        this.xssPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
            /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
            /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
            /<link[\s\S]*?>/gi,
            /<meta[\s\S]*?>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi,
            /expression\s*\(/gi,
            /url\s*\(/gi,
            /&\#/gi,
            /<[^>]*[\s"']*(?:src|href|action|formaction|data|background)\s*=[\s"']*javascript:/gi
        ];

        this.sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
            /(;|\||&|\$|<|>|`|!|\*|'|"|{|}|\[|\]|%)/g,
            /('|('')|(\|\|)|(\/\*)|(\*\/)|(\-\-)|(\#))/gi
        ];
    }

    /**
     * Validate single field
     */
    validateField(fieldName, value, rules = null) {
        const rule = rules || this.validationRules[fieldName];
        if (!rule) return { isValid: true };

        const errors = [];

        // Required check
        if (rule.required && (!value || value.toString().trim() === '')) {
            errors.push(`${fieldName} là bắt buộc`);
            return { isValid: false, errors };
        }

        // Skip other validations if field is empty and not required
        if (!rule.required && (!value || value.toString().trim() === '')) {
            return { isValid: true };
        }

        const stringValue = value.toString().trim();

        // Length checks
        if (rule.minLength && stringValue.length < rule.minLength) {
            errors.push(`${fieldName} phải có ít nhất ${rule.minLength} ký tự`);
        }

        if (rule.maxLength && stringValue.length > rule.maxLength) {
            errors.push(`${fieldName} không được vượt quá ${rule.maxLength} ký tự`);
        }

        // Pattern check
        if (rule.pattern && !rule.pattern.test(stringValue)) {
            errors.push(rule.message || `${fieldName} không đúng định dạng`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate contact form data
     */
    validateContactForm(data) {
        const errors = [];
        const fields = ['name', 'email', 'phone', 'message'];
        
        // Validate required fields
        for (const field of fields) {
            const validation = this.validateField(field, data[field]);
            if (!validation.isValid) {
                errors.push(...validation.errors);
            }
        }

        // Validate optional company field
        if (data.company) {
            const companyValidation = this.validateField('company', data.company);
            if (!companyValidation.isValid) {
                errors.push(...companyValidation.errors);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate email for newsletter
     */
    validateEmail(email) {
        return this.validateField('email', email);
    }

    /**
     * Sanitize input to prevent XSS
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        return input
            .trim()
            // Remove HTML tags
            .replace(/<[^>]*>/g, '')
            // Encode special characters
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            // Remove potential script content
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            // Remove null bytes
            .replace(/\0/g, '');
    }

    /**
     * Check for XSS patterns
     */
    hasXSS(input) {
        if (typeof input !== 'string') return false;
        
        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Check for SQL injection patterns
     */
    hasSQLInjection(input) {
        if (typeof input !== 'string') return false;
        
        return this.sqlPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Comprehensive security validation
     */
    validateSecurity(input) {
        const issues = [];

        if (this.hasXSS(input)) {
            issues.push('Phát hiện mã độc XSS');
        }

        if (this.hasSQLInjection(input)) {
            issues.push('Phát hiện SQL injection');
        }

        return {
            isSafe: issues.length === 0,
            issues
        };
    }

    /**
     * Express middleware for input validation
     */
    validateContactMiddleware() {
        return (req, res, next) => {
            try {
                const validation = this.validateContactForm(req.body);
                
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: validation.errors[0],
                        errors: validation.errors
                    });
                }

                // Security validation
                for (const [key, value] of Object.entries(req.body)) {
                    if (typeof value === 'string') {
                        const securityCheck = this.validateSecurity(value);
                        if (!securityCheck.isSafe) {
                            return res.status(400).json({
                                success: false,
                                message: `Nội dung không an toàn trong trường ${key}: ${securityCheck.issues[0]}`
                            });
                        }
                    }
                }

                // Sanitize inputs
                const sanitizedBody = {};
                for (const [key, value] of Object.entries(req.body)) {
                    sanitizedBody[key] = typeof value === 'string' ? this.sanitizeInput(value) : value;
                }

                req.body = sanitizedBody;
                req.validatedData = sanitizedBody;
                
                next();
            } catch (error) {
                console.error('Validation middleware error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi xử lý dữ liệu'
                });
            }
        };
    }

    /**
     * Express middleware for newsletter validation
     */
    validateNewsletterMiddleware() {
        return (req, res, next) => {
            try {
                const { email } = req.body;
                const validation = this.validateEmail(email);
                
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: validation.errors[0]
                    });
                }

                // Security validation
                const securityCheck = this.validateSecurity(email);
                if (!securityCheck.isSafe) {
                    return res.status(400).json({
                        success: false,
                        message: `Email chứa nội dung không an toàn: ${securityCheck.issues[0]}`
                    });
                }

                // Sanitize email
                req.body.email = this.sanitizeInput(email);
                req.validatedData = { email: req.body.email };
                
                next();
            } catch (error) {
                console.error('Newsletter validation error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi xử lý email'
                });
            }
        };
    }

    /**
     * Rate limiting configuration
     */
    createRateLimitConfig() {
        return {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // limit each IP to 5 requests per windowMs
            message: {
                success: false,
                message: 'Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau 15 phút.'
            },
            standardHeaders: true,
            legacyHeaders: false,
            // Skip successful requests
            skipSuccessfulRequests: true,
            // Skip failed requests
            skipFailedRequests: false
        };
    }
}

module.exports = InputValidator;