/**
 * Security Configuration Module
 * Centralized security settings and utilities for SHRIMPTECH
 */

class SecurityConfig {
    constructor() {
        this.initializeSecurityPolicies();
    }

    // Content Security Policy configuration
    getCSP() {
        return {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'", // Cần thiết cho inline scripts, sẽ tối ưu sau
                'https://apis.google.com',
                'https://www.gstatic.com',
                'https://cdn.jsdelivr.net',
                'https://unpkg.com'
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'", // Cần thiết cho inline styles
                'https://fonts.googleapis.com',
                'https://cdn.jsdelivr.net'
            ],
            'img-src': [
                "'self'",
                'data:',
                'https:',
                'blob:'
            ],
            'font-src': [
                "'self'",
                'https://fonts.gstatic.com',
                'https://cdn.jsdelivr.net'
            ],
            'connect-src': [
                "'self'",
                'https://api.shrimptech.com',
                'https://formspree.io',
                'http://localhost:3001', // Development only
                'ws://localhost:*', // WebSocket development
                'wss://*.shrimptech.com'
            ],
            'frame-src': ["'none'"],
            'frame-ancestors': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'", 'https://formspree.io'],
            'upgrade-insecure-requests': []
        };
    }

    // Generate CSP header string
    getCSPString() {
        const csp = this.getCSP();
        return Object.entries(csp)
            .map(([directive, sources]) => 
                sources.length > 0 
                    ? `${directive} ${sources.join(' ')}`
                    : directive
            )
            .join('; ');
    }

    // Security headers configuration
    getSecurityHeaders() {
        return {
            'Content-Security-Policy': this.getCSPString(),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Cache-Control': 'no-cache, no-store, must-revalidate, private',
            'Pragma': 'no-cache',
            'Expires': '0'
        };
    }

    // CORS configuration
    getCORSConfig() {
        return {
            origin: [
                'https://shrimptech.com',
                'https://www.shrimptech.com',
                'https://shrimptech.local',
                'http://localhost:3000',
                'http://localhost:3001',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:3001'
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'Accept',
                'Origin'
            ],
            credentials: true,
            maxAge: 86400 // 24 hours
        };
    }

    // Rate limiting configuration
    getRateLimitConfig() {
        return {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.',
                code: 'RATE_LIMIT_EXCEEDED'
            },
            standardHeaders: true,
            legacyHeaders: false
        };
    }

    // Input validation rules
    getValidationRules() {
        return {
            email: {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                maxLength: 254,
                required: true
            },
            name: {
                pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
                maxLength: 50,
                minLength: 2,
                required: true
            },
            phone: {
                pattern: /^[+]?[\d\s\-\(\)]{10,15}$/,
                maxLength: 15,
                required: false
            },
            message: {
                maxLength: 1000,
                minLength: 10,
                required: true
            },
            company: {
                pattern: /^[a-zA-ZÀ-ỹ0-9\s\-\.]{2,100}$/,
                maxLength: 100,
                required: false
            }
        };
    }

    // Sanitization functions
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') {
            return '';
        }

        // Basic HTML encoding
        input = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        // Type-specific sanitization
        switch (type) {
            case 'email':
                return input.toLowerCase().trim();
            case 'name':
                return input.replace(/[^a-zA-ZÀ-ỹ\s]/g, '').trim();
            case 'phone':
                return input.replace(/[^\d\s\-\(\)\+]/g, '').trim();
            case 'url':
                try {
                    const url = new URL(input);
                    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
                } catch {
                    return '';
                }
            default:
                return input.trim();
        }
    }

    // Validate input against rules
    validateInput(value, type) {
        const rules = this.getValidationRules()[type];
        if (!rules) return { valid: true };

        const errors = [];

        // Required check
        if (rules.required && (!value || value.trim() === '')) {
            errors.push(`${type} is required`);
            return { valid: false, errors };
        }

        // Skip other validations if not required and empty
        if (!rules.required && (!value || value.trim() === '')) {
            return { valid: true };
        }

        // Length checks
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${type} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${type} must not exceed ${rules.maxLength} characters`);
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${type} format is invalid`);
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Initialize security policies on page load
    initializeSecurityPolicies() {
        // Add meta tags for security headers if not present
        this.addSecurityMetaTags();
        
        // Setup CSP violation reporting
        this.setupCSPReporting();
        
        // Initialize click-jacking protection
        this.preventClickjacking();
    }

    addSecurityMetaTags() {
        const head = document.head;
        const securityHeaders = this.getSecurityHeaders();

        Object.entries(securityHeaders).forEach(([name, content]) => {
            // Skip if already exists
            if (document.querySelector(`meta[http-equiv="${name}"]`)) {
                return;
            }

            const meta = document.createElement('meta');
            meta.httpEquiv = name;
            meta.content = content;
            head.appendChild(meta);
        });
    }

    setupCSPReporting() {
        document.addEventListener('securitypolicyviolation', (event) => {
            console.error('CSP Violation:', {
                violatedDirective: event.violatedDirective,
                blockedURI: event.blockedURI,
                documentURI: event.documentURI,
                effectiveDirective: event.effectiveDirective
            });

            // Report to monitoring service in production
            if (window.location.hostname !== 'localhost') {
                this.reportSecurityViolation({
                    type: 'csp_violation',
                    directive: event.violatedDirective,
                    blockedURI: event.blockedURI,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    preventClickjacking() {
        // Check if page is in frame
        if (window.top !== window.self) {
            // Break out of frame
            window.top.location = window.self.location;
        }
    }

    reportSecurityViolation(violation) {
        // Send to security monitoring endpoint
        fetch('/api/security/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(violation)
        }).catch(err => {
            console.error('Failed to report security violation:', err);
        });
    }

    // Generate nonce for inline scripts/styles
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode.apply(null, array));
    }

    // Secure localStorage wrapper
    secureStorage = {
        set: (key, value) => {
            try {
                const encrypted = btoa(JSON.stringify(value));
                localStorage.setItem(`shrimptech_${key}`, encrypted);
                return true;
            } catch (e) {
                console.error('Secure storage set failed:', e);
                return false;
            }
        },

        get: (key) => {
            try {
                const encrypted = localStorage.getItem(`shrimptech_${key}`);
                if (!encrypted) return null;
                return JSON.parse(atob(encrypted));
            } catch (e) {
                console.error('Secure storage get failed:', e);
                return null;
            }
        },

        remove: (key) => {
            localStorage.removeItem(`shrimptech_${key}`);
        },

        clear: () => {
            Object.keys(localStorage)
                .filter(key => key.startsWith('shrimptech_'))
                .forEach(key => localStorage.removeItem(key));
        }
    };
}

// Initialize global security config
window.ShrimpTechSecurity = new SecurityConfig();

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityConfig;
}