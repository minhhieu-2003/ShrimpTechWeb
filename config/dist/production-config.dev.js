"use strict";

/**
 * Production Configuration for SHRIMPTECH
 * Cấu hình cho môi trường production trên shrimptech.vn
 */
// Environment Configuration
var PRODUCTION_CONFIG = {
  // Domain configuration
  DOMAIN: 'shrimptech.vn',
  PROTOCOL: 'https',
  // API Endpoints
  API_BASE_URL: 'https://shrimptech-backend.fly.dev',
  API_FULL_URL: 'https://shrimptech-backend.fly.dev/api',
  // Available endpoints
  ENDPOINTS: {
    CONTACT: '/contact',
    NEWSLETTER: '/newsletter',
    STATUS: '/status',
    HEALTH: '/health'
  },
  // CORS Configuration
  ALLOWED_ORIGINS: ['https://shrimptech2.web.app', 'https://shrimptech2.firebaseapp.com', 'https://shrimptech.vn', 'https://www.shrimptech.vn', 'https://shrimptech-c6e93.web.app'],
  // Email Configuration
  EMAIL: {
    PROJECT_EMAIL: 'shrimptech.vhu.hutech@gmail.com',
    SMTP_SERVICE: 'Gmail',
    FORMSPREE: {
      ENDPOINT: 'https://formspree.io/f/xrbgbvpe',
      API_BASE: 'https://formspree.io'
    }
  },
  // Server Configuration
  SERVER: {
    PORT: typeof process !== 'undefined' && process.env && process.env.PORT || 3001,
    NODE_ENV: 'production'
  },
  // Feature Flags
  FEATURES: {
    SERVICE_WORKER: true,
    EMAIL_FALLBACK: true,
    ANALYTICS: true,
    CACHING: true
  },
  // Content Security Policy Configuration - DISABLED
  CSP: null // CSP đã được tắt để tránh blocking issues

}; // Export for both Node.js and Browser

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTION_CONFIG;
} else if (typeof window !== 'undefined') {
  window.PRODUCTION_CONFIG = PRODUCTION_CONFIG;
}

console.log('📋 Production configuration loaded for shrimptech.vn');