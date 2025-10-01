/**
 * Environment Configuration for SHRIMPTECH
 * Unified configuration to prevent conflicts between dev/prod
 */

// Detect environment
const isProduction = window.location.hostname === 'shrimptech.vn' || window.location.hostname === 'www.shrimptech.vn';
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Base configuration
const CONFIG = {
    // Environment
    ENVIRONMENT: isProduction ? 'production' : (isDevelopment ? 'development' : 'staging'),
    
    // Contact Information (consistent across all environments)
    CONTACT: {
        EMAIL: 'shrimptech.vhu.hutech@gmail.com',
        PHONE: '0835749407',
        WORKING_HOURS: 'T2-T6: 8:00-17:00',
        ZALO: '0835749407'
    },
    
    // Form Configuration
    FORMS: {
        CONTACT_FORM_ID: '#contactForm',
        NEWSLETTER_FORM_ID: '#newsletterForm',
        SUBMISSION_ENDPOINT: 'https://formspree.io/f/xrbgbvpe'
    },
    
    // Email Service Configuration
    EMAIL_SERVICE: {
        PRIMARY: 'formspree',
        FORMSPREE_ENDPOINT: 'https://formspree.io/f/xrbgbvpe'
    },
    
    // Security Configuration
    SECURITY: {
        USE_CSP_HEADERS: false, // CSP completely disabled to prevent API blocking
        USE_META_CSP: false,   // Disabled to prevent conflicts
        RATE_LIMIT: {
            REQUESTS_PER_MINUTE: 10,
            REQUESTS_PER_HOUR: 50
        }
    },
    
    // Domain Configuration
    DOMAINS: {
        PRODUCTION: 'https://shrimptech.vn',
        DEVELOPMENT: 'http://localhost:3000',
        ALLOWED_ORIGINS: [
            'https://shrimptech.vn',
            'https://www.shrimptech.vn',
            'https://shrimptech-c6e93.web.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ]
    },
    
    // API Configuration
    API: {
        BASE_URL: isProduction ? 'https://shrimptech.vn/api' : 'http://localhost:3001/api',
        ENDPOINTS: {
            CONTACT: '/contact',
            NEWSLETTER: '/newsletter',
            STATUS: '/status'
        }
    },
    
    // Feature Flags
    FEATURES: {
        ANALYTICS: isProduction,
        SERVICE_WORKER: isProduction,
        DEBUG_MODE: isDevelopment,
        ERROR_REPORTING: isProduction
    }
};

// Validation function
CONFIG.validate = function() {
    const issues = [];
    
    if (!this.CONTACT.EMAIL.includes('@')) {
        issues.push('Invalid email format');
    }
    
    if (!this.FORMS.CONTACT_FORM_ID.startsWith('#')) {
        issues.push('Form ID must start with #');
    }
    
    if (!this.EMAIL_SERVICE.FORMSPREE_ENDPOINT.startsWith('https://')) {
        issues.push('Formspree endpoint must use HTTPS');
    }
    
    return {
        isValid: issues.length === 0,
        issues: issues
    };
};

// Helper functions
CONFIG.getContactEmail = () => CONFIG.CONTACT.EMAIL;
CONFIG.getContactPhone = () => CONFIG.CONTACT.PHONE;
CONFIG.getFormEndpoint = () => CONFIG.EMAIL_SERVICE.FORMSPREE_ENDPOINT;
CONFIG.isProduction = () => CONFIG.ENVIRONMENT === 'production';
CONFIG.isDevelopment = () => CONFIG.ENVIRONMENT === 'development';

// Auto-validation on load
document.addEventListener('DOMContentLoaded', function() {
    const validation = CONFIG.validate();
    if (!validation.isValid) {
        console.warn('Configuration issues detected:', validation.issues);
    } else {
        console.log('✅ Configuration validated successfully');
        console.log(`🌍 Environment: ${CONFIG.ENVIRONMENT}`);
    }
});

// Export for global use
window.SHRIMPTECH_CONFIG = CONFIG;

// Freeze configuration to prevent modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.CONTACT);
Object.freeze(CONFIG.FORMS);
Object.freeze(CONFIG.EMAIL_SERVICE);
Object.freeze(CONFIG.SECURITY);
Object.freeze(CONFIG.DOMAINS);
Object.freeze(CONFIG.API);
Object.freeze(CONFIG.FEATURES);