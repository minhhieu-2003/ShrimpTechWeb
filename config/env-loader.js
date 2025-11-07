/**
 * Environment Loader - Centralized .env Configuration
 * Tải và validate các biến môi trường từ .env file
 */

const path = require('path');
const fs = require('fs');

// Load dotenv
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * Kiểm tra biến môi trường bắt buộc
 */
function validateRequiredEnvVars() {
    const required = [
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_HOST',
        'SMTP_PORT'
    ];

    const missing = [];
    
    required.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    if (missing.length > 0) {
        console.warn('⚠️  WARNING: Missing required environment variables:');
        missing.forEach(varName => {
            console.warn(`   - ${varName}`);
        });
        console.warn('\n📝 Please check your .env file and add missing variables.');
        console.warn('📄 See .env.example for reference.\n');
        return false;
    }

    return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Load và export environment configuration
 */
const config = {
    // Node environment
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',

    // Server config
    port: parseInt(process.env.PORT) || 3001,

    // SMTP Configuration
    smtp: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
    },

    // Admin config
    admin: {
        email: process.env.ADMIN_EMAIL || process.env.SMTP_USER
    },

    // CORS config
    cors: {
        origins: process.env.CORS_ORIGINS 
            ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
            : [
                'http://localhost:3000',
                'http://localhost:3001',
                'https://shrimptech.vn'
            ]
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    // Security
    security: {
        sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production'
    }
};

/**
 * Validate configuration
 */
function validateConfig() {
    const errors = [];

    // Validate SMTP user email
    if (config.smtp.user && !validateEmail(config.smtp.user)) {
        errors.push('SMTP_USER is not a valid email address');
    }

    // Validate admin email
    if (config.admin.email && !validateEmail(config.admin.email)) {
        errors.push('ADMIN_EMAIL is not a valid email address');
    }

    // Check SMTP password in production
    if (config.isProduction && !config.smtp.pass) {
        errors.push('SMTP_PASS is required in production mode');
    }

    // Check session secret in production
    if (config.isProduction && config.security.sessionSecret === 'change-me-in-production') {
        errors.push('SESSION_SECRET must be changed in production mode');
    }

    if (errors.length > 0) {
        console.error('❌ Configuration validation errors:');
        errors.forEach(error => {
            console.error(`   - ${error}`);
        });
        return false;
    }

    return true;
}

/**
 * Display configuration summary (without sensitive data)
 */
function displayConfigSummary() {
    console.log('\n📋 Environment Configuration Summary:');
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   SMTP Host: ${config.smtp.host}:${config.smtp.port}`);
    console.log(`   SMTP User: ${config.smtp.user || 'NOT SET'}`);
    console.log(`   SMTP Password: ${config.smtp.pass ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`   Admin Email: ${config.admin.email}`);
    console.log(`   CORS Origins: ${config.cors.origins.join(', ')}`);
    console.log('');
}

/**
 * Initialize configuration
 */
function initConfig() {
    console.log('🔧 Loading environment configuration...\n');

    // Check if .env file exists
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.warn('⚠️  WARNING: .env file not found!');
        console.warn('📝 Please create .env file from .env.example\n');
        console.warn('   Run: cp .env.example .env\n');
    }

    // Validate required variables
    validateRequiredEnvVars();

    // Validate configuration
    validateConfig();

    // Display summary
    displayConfigSummary();

    return config;
}

// Export config and utilities
module.exports = {
    config: initConfig(),
    validateRequiredEnvVars,
    validateConfig,
    displayConfigSummary,
    
    // Helper functions
    getSmtpConfig: () => config.smtp,
    getAdminEmail: () => config.admin.email,
    getCorsOrigins: () => config.cors.origins,
    isProduction: () => config.isProduction,
    isDevelopment: () => config.isDevelopment
};
