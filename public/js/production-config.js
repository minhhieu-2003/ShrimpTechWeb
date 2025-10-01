/**
 * Production Configuration for SHRIMPTECH
 * Cấu hình cho môi trường production trên shrimptech.vn
 */

// Environment Configuration
const PRODUCTION_CONFIG = {
    // Domain configuration
    DOMAIN: 'shrimptech.vn',
    PROTOCOL: 'https',
    
    // API Endpoints
    API_BASE_URL: '/api',
    API_FULL_URL: 'https://shrimptech.vn/api',
    
    // Available endpoints
    ENDPOINTS: {
        CONTACT: '/contact',
        NEWSLETTER: '/newsletter',
        STATUS: '/status',
        HEALTH: '/health'
    },
    
    // CORS Configuration
    ALLOWED_ORIGINS: [
        'https://shrimptech.vn',
        'https://www.shrimptech.vn',
        'https://shrimptech-c6e93.web.app'
    ],
    
    // Email Configuration
    EMAIL: {
        PROJECT_EMAIL: 'shrimptech.vhu.hutech@gmail.com',
        SMTP_SERVICE: 'Gmail',
        SMTP_CONFIG: {
            HOST: 'smtp.gmail.com',
            PORT: 587,
            SECURE: false
        },
        // Formspree Configuration
        FORMSPREE: {
            ENDPOINT: 'https://formspree.io/f/xrbgbvpe'
        }
    },
    
    // Server Configuration
    SERVER: {
        PORT: (typeof process !== 'undefined' && process.env && process.env.PORT) || 3001,
        NODE_ENV: 'production'
    },
    
    // Feature Flags
    FEATURES: {
        SERVICE_WORKER: true,
        EMAIL_FALLBACK: true,
        ANALYTICS: true,
        CACHING: true
    },
    
    // Content Security Policy Configuration
    CSP: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://kit.fontawesome.com"
        ],
        styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://kit.fontawesome.com"
        ],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://use.fontawesome.com",
            "https://kit.fontawesome.com",
            "data:",
            "blob:"
        ],
        connectSrc: [
            "'self'",
            "https://shrimptech.vn",
            "https://www.shrimptech.vn",
            "https://api.shrimptech.vn",
            "https://shrimptech-backend.fly.dev",
            "https://formspree.io",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: [
            "'self'"
        ],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"]
    }
};

// Export for both Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRODUCTION_CONFIG;
} else if (typeof window !== 'undefined') {
    window.PRODUCTION_CONFIG = PRODUCTION_CONFIG;
}

console.log('📋 Production configuration loaded for shrimptech.vn');