/**
 * HTTPS Configuration Module for ShrimpTech
 * Handles SSL/TLS setup and secure server configuration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class HTTPSManager {
    constructor(options = {}) {
        this.sslDir = options.sslDir || path.join(__dirname, '../ssl');
        this.keyFile = options.keyFile || 'private-key.pem';
        this.certFile = options.certFile || 'certificate.pem';
        this.environment = process.env.NODE_ENV || 'development';
        
        console.log('🔐 HTTPS Manager initialized');
        console.log(`SSL Directory: ${this.sslDir}`);
        console.log(`Environment: ${this.environment}`);
    }

    /**
     * Check if SSL certificates exist
     */
    checkSSLCertificates() {
        const keyPath = path.join(this.sslDir, this.keyFile);
        const certPath = path.join(this.sslDir, this.certFile);
        
        const keyExists = fs.existsSync(keyPath);
        const certExists = fs.existsSync(certPath);
        
        console.log(`🔍 SSL Certificate Check:`);
        console.log(`   Key file (${this.keyFile}): ${keyExists ? '✅ Found' : '❌ Missing'}`);
        console.log(`   Cert file (${this.certFile}): ${certExists ? '✅ Found' : '❌ Missing'}`);
        
        return {
            available: keyExists && certExists,
            keyPath,
            certPath,
            keyExists,
            certExists
        };
    }

    /**
     * Get SSL options for HTTPS server
     */
    getSSLOptions() {
        const certCheck = this.checkSSLCertificates();
        
        if (!certCheck.available) {
            console.log('⚠️  SSL certificates not available');
            return null;
        }

        try {
            const options = {
                key: fs.readFileSync(certCheck.keyPath),
                cert: fs.readFileSync(certCheck.certPath)
            };
            
            console.log('✅ SSL options loaded successfully');
            return options;
        } catch (error) {
            console.error('❌ Error loading SSL certificates:', error.message);
            return null;
        }
    }

    /**
     * Create HTTPS server
     */
    createHTTPSServer(app, port = 443) {
        const sslOptions = this.getSSLOptions();
        
        if (!sslOptions) {
            console.log('⚠️  Cannot create HTTPS server - SSL certificates not available');
            return null;
        }

        try {
            const server = https.createServer(sslOptions, app);
            console.log(`✅ HTTPS server created for port ${port}`);
            return server;
        } catch (error) {
            console.error('❌ Error creating HTTPS server:', error.message);
            return null;
        }
    }

    /**
     * SSL redirect middleware for production
     */
    sslRedirectMiddleware() {
        return (req, res, next) => {
            // Only redirect in production
            if (this.environment === 'production') {
                // Check if request is not secure
                if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
                    const httpsUrl = `https://${req.get('Host')}${req.url}`;
                    console.log(`🔀 Redirecting to HTTPS: ${httpsUrl}`);
                    return res.redirect(301, httpsUrl);
                }
            }
            next();
        };
    }

    /**
     * Enhanced security headers middleware
     */
    securityHeadersMiddleware() {
        return (req, res, next) => {
            // Strict Transport Security
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            
            // Content Security Policy - DISABLED to prevent API blocking
            // res.setHeader('Content-Security-Policy', [
            //     "default-src 'self'",
            //     "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://unpkg.com https://shrimptech-c6e93.web.app",
            //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
            //     "img-src 'self' data: https: blob:",
            //     "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
            //     "connect-src 'self' https://shrimptech.vn https://api.shrimptech.vn https://formspree.io",
            //     "frame-src 'none'",
            //     "frame-ancestors 'none'",
            //     "base-uri 'self'",
            //     "form-action 'self' https://formspree.io",
            //     "upgrade-insecure-requests"
            // ].join('; '));
            
            // Additional security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
            
            // Cache control for better F5/Ctrl+Shift+R sync
            const url = req.url;
            if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
                // Static assets with revalidation for better sync
                res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
                res.setHeader('ETag', `"${Date.now()}"`);
            } else if (url.match(/\.html?$/)) {
                // HTML files should always check for updates
                res.setHeader('Cache-Control', 'no-cache, must-revalidate');
                res.setHeader('ETag', `"${Date.now()}"`);
            } else {
                // Default cache behavior
                res.setHeader('Cache-Control', 'no-cache');
            }
            
            next();
        };
    }

    /**
     * Create SSL directory if it doesn't exist
     */
    ensureSSLDirectory() {
        if (!fs.existsSync(this.sslDir)) {
            try {
                fs.mkdirSync(this.sslDir, { recursive: true });
                console.log(`✅ Created SSL directory: ${this.sslDir}`);
                return true;
            } catch (error) {
                console.error(`❌ Error creating SSL directory: ${error.message}`);
                return false;
            }
        }
        return true;
    }

    /**
     * Generate self-signed certificates for development
     */
    generateDevelopmentCertificates() {
        this.ensureSSLDirectory();
        
        const { exec } = require('child_process');
        const keyPath = path.join(this.sslDir, this.keyFile);
        const certPath = path.join(this.sslDir, this.certFile);
        
        return new Promise((resolve, reject) => {
            const opensslCmd = `openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost"`;
            
            console.log('🔧 Generating self-signed SSL certificates...');
            exec(opensslCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Error generating certificates:', error.message);
                    console.log('💡 Please install OpenSSL or use mkcert for development certificates');
                    reject(error);
                } else {
                    console.log('✅ Self-signed certificates generated successfully');
                    resolve({ keyPath, certPath });
                }
            });
        });
    }

    /**
     * Setup instructions for SSL certificates
     */
    getSSLSetupInstructions() {
        return `
🔐 SSL Certificate Setup Instructions

For Development:
================

Option 1: Generate self-signed certificates
-------------------------------------------
1. Install OpenSSL if not available
2. Run: node -e "require('./config/https-manager').generateDevelopmentCertificates()"

Option 2: Use mkcert (recommended for development)
-------------------------------------------------
1. Install mkcert: npm install -g mkcert
2. Install local CA: mkcert -install
3. Generate certificates:
   mkcert -key-file ${this.sslDir}/${this.keyFile} -cert-file ${this.sslDir}/${this.certFile} localhost 127.0.0.1

For Production:
===============

Option 1: Let's Encrypt (Free)
------------------------------
1. Install Certbot
2. Run: certbot certonly --standalone -d shrimptech.vn -d www.shrimptech.vn
3. Copy certificates to ${this.sslDir}/

Option 2: Commercial SSL Certificate
-----------------------------------
1. Purchase SSL certificate from trusted CA
2. Download certificate files
3. Place in ${this.sslDir}/ directory

Current SSL Directory: ${this.sslDir}
Required files:
- ${this.keyFile} (Private key)
- ${this.certFile} (Certificate)
        `;
    }

    /**
     * Start secure server with both HTTP and HTTPS
     */
    startSecureServer(app, httpPort = 3001, httpsPort = 3443) {
        console.log('\n🚀 Starting ShrimpTech Secure Server...');
        
        // Apply security middleware
        app.use(this.sslRedirectMiddleware());
        app.use(this.securityHeadersMiddleware());
        
        // Start HTTP server
        const httpServer = app.listen(httpPort, () => {
            console.log(`🌐 HTTP Server running on port ${httpPort}`);
            console.log(`   URL: http://localhost:${httpPort}`);
        });
        
        // Try to start HTTPS server
        const httpsServer = this.createHTTPSServer(app, httpsPort);
        if (httpsServer) {
            httpsServer.listen(httpsPort, () => {
                console.log(`🔒 HTTPS Server running on port ${httpsPort}`);
                console.log(`   URL: https://localhost:${httpsPort}`);
            });
        } else {
            console.log('\n' + this.getSSLSetupInstructions());
        }
        
        return { httpServer, httpsServer };
    }
}

const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || ''
    }
};

module.exports = { HTTPSManager, emailConfig };