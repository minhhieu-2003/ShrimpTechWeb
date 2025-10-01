/**
 * Security Audit Script for SHRIMPTECH
 * Automated security vulnerability scanner and compliance checker
 */

class SecurityAuditor {
    constructor() {
        this.vulnerabilities = [];
        this.warnings = [];
        this.compliances = [];
        this.config = {
            enableDetailedLogging: true,
            checkExternalResources: true,
            validateFormSecurity: true,
            checkCORSPolicies: true
        };
    }

    // Main audit function
    async runFullAudit() {
        console.log('🔒 SHRIMPTECH Security Audit Starting...');
        console.log('='.repeat(50));
        
        this.vulnerabilities = [];
        this.warnings = [];
        this.compliances = [];

        // Run all security checks
        await Promise.all([
            this.checkSecurityHeaders(),
            this.validateCSP(),
            this.checkFormSecurity(),
            this.auditExternalResources(),
            this.checkCORSConfiguration(),
            this.validateInputSanitization(),
            this.checkServiceWorkerSecurity(),
            this.auditDataStorage(),
            this.checkHTTPSConfiguration(),
            this.validateAuthenticationSecurity()
        ]);

        // Generate report
        this.generateReport();
        
        return {
            vulnerabilities: this.vulnerabilities,
            warnings: this.warnings,
            compliances: this.compliances,
            score: this.calculateSecurityScore()
        };
    }

    // Check HTTP security headers
    checkSecurityHeaders() {
        console.log('🛡️ Checking security headers...');
        
        const requiredHeaders = [
            'Content-Security-Policy',
            'X-Frame-Options', 
            'X-Content-Type-Options',
            'X-XSS-Protection',
            'Referrer-Policy',
            'Permissions-Policy'
        ];

        const metaTags = document.querySelectorAll('meta[http-equiv]');
        const presentHeaders = Array.from(metaTags).map(meta => meta.httpEquiv);

        requiredHeaders.forEach(header => {
            if (presentHeaders.includes(header)) {
                this.compliances.push(`✅ ${header} header present`);
            } else {
                this.vulnerabilities.push(`❌ Missing ${header} header`);
            }
        });

        // Check HTTPS enforcement
        if (location.protocol === 'https:') {
            this.compliances.push('✅ HTTPS protocol enforced');
        } else if (location.hostname !== 'localhost') {
            this.vulnerabilities.push('❌ Site not served over HTTPS');
        }
    }

    // Validate Content Security Policy
    validateCSP() {
        console.log('📋 Validating Content Security Policy...');
        
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        
        if (!cspMeta) {
            this.vulnerabilities.push('❌ No CSP meta tag found');
            return;
        }

        const csp = cspMeta.content;
        const directives = csp.split(';').map(d => d.trim());

        // Check for essential directives
        const essentialDirectives = [
            'default-src',
            'script-src', 
            'style-src',
            'img-src',
            'connect-src'
        ];

        essentialDirectives.forEach(directive => {
            if (directives.some(d => d.startsWith(directive))) {
                this.compliances.push(`✅ CSP ${directive} directive present`);
            } else {
                this.warnings.push(`⚠️ CSP ${directive} directive missing`);
            }
        });

        // Check for unsafe directives
        if (csp.includes("'unsafe-inline'")) {
            this.warnings.push("⚠️ CSP allows 'unsafe-inline' - consider using nonces");
        }

        if (csp.includes("'unsafe-eval'")) {
            this.vulnerabilities.push("❌ CSP allows 'unsafe-eval' - high risk");
        }

        // Check for wildcard sources
        if (csp.includes('*')) {
            this.warnings.push('⚠️ CSP contains wildcard (*) sources');
        }
    }

    // Check form security implementation
    checkFormSecurity() {
        console.log('📝 Checking form security...');
        
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            // Check for CSRF protection
            const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
            if (!csrfToken) {
                this.warnings.push(`⚠️ Form ${index + 1} lacks CSRF protection`);
            }

            // Check for autocomplete settings
            const sensitiveFields = form.querySelectorAll('input[type="password"], input[name*="credit"], input[name*="ssn"]');
            sensitiveFields.forEach(field => {
                if (field.autocomplete !== 'off') {
                    this.warnings.push(`⚠️ Sensitive field allows autocomplete: ${field.name || field.type}`);
                }
            });

            // Check for validation
            const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
            if (requiredFields.length === 0) {
                this.warnings.push(`⚠️ Form ${index + 1} has no required field validation`);
            }

            // Check for proper input types
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (!field.pattern && !field.validity) {
                    this.warnings.push(`⚠️ Email field lacks validation pattern: ${field.name}`);
                }
            });
        });

        if (forms.length === 0) {
            this.warnings.push('⚠️ No forms found to audit');
        }
    }

    // Audit external resources
    async auditExternalResources() {
        console.log('🌐 Auditing external resources...');
        
        const externalResources = [];
        
        // Check scripts
        document.querySelectorAll('script[src]').forEach(script => {
            if (!script.src.startsWith(location.origin)) {
                externalResources.push({
                    type: 'script',
                    url: script.src,
                    hasIntegrity: !!script.integrity,
                    hasCrossorigin: !!script.crossOrigin
                });
            }
        });

        // Check stylesheets
        document.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
            if (!link.href.startsWith(location.origin)) {
                externalResources.push({
                    type: 'stylesheet',
                    url: link.href,
                    hasIntegrity: !!link.integrity,
                    hasCrossorigin: !!link.crossOrigin
                });
            }
        });

        // Audit external resources
        externalResources.forEach(resource => {
            if (!resource.hasIntegrity) {
                this.warnings.push(`⚠️ External ${resource.type} lacks integrity check: ${new URL(resource.url).hostname}`);
            } else {
                this.compliances.push(`✅ External ${resource.type} has integrity check: ${new URL(resource.url).hostname}`);
            }

            // Check for HTTPS
            if (!resource.url.startsWith('https:')) {
                this.vulnerabilities.push(`❌ Insecure external ${resource.type}: ${resource.url}`);
            }
        });

        console.log(`📊 Found ${externalResources.length} external resources`);
    }

    // Check CORS configuration
    checkCORSConfiguration() {
        console.log('🔄 Checking CORS configuration...');
        
        // This would typically be checked on the server side
        // For client-side, we can check for potential issues
        
        if (window.ShrimpTechSecurity && window.ShrimpTechSecurity.getCORSConfig) {
            const corsConfig = window.ShrimpTechSecurity.getCORSConfig();
            
            if (corsConfig.origin.includes('*')) {
                this.vulnerabilities.push('❌ CORS allows all origins (*)');
            } else {
                this.compliances.push('✅ CORS has restricted origins');
            }

            if (corsConfig.credentials) {
                this.warnings.push('⚠️ CORS allows credentials - ensure origins are trusted');
            }
        } else {
            this.warnings.push('⚠️ Unable to verify CORS configuration');
        }
    }

    // Validate input sanitization
    validateInputSanitization() {
        console.log('🧹 Validating input sanitization...');
        
        if (window.ShrimpTechValidator) {
            this.compliances.push('✅ Input validation library present');
            
            // Test validation with sample malicious inputs
            const maliciousInputs = [
                '<script>alert("xss")</script>',
                'javascript:alert("xss")',
                '<img src=x onerror=alert("xss")>',
                'eval("malicious code")',
                '"><script>alert("xss")</script>'
            ];

            const validator = window.ShrimpTechValidator;
            let allBlocked = true;

            maliciousInputs.forEach(input => {
                const result = validator.validate(input, { type: 'text', required: true });
                if (result.valid || !validator.detectXSS(input)) {
                    allBlocked = false;
                }
            });

            if (allBlocked) {
                this.compliances.push('✅ Input validation blocks XSS attempts');
            } else {
                this.vulnerabilities.push('❌ Input validation may allow XSS');
            }
        } else {
            this.vulnerabilities.push('❌ No input validation library found');
        }
    }

    // Check service worker security
    checkServiceWorkerSecurity() {
        console.log('⚙️ Checking service worker security...');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length > 0) {
                    this.compliances.push('✅ Service worker registered');
                    
                    // Check if SW handles security headers
                    registrations.forEach(registration => {
                        if (registration.scope === location.origin + '/') {
                            this.compliances.push('✅ Service worker has proper scope');
                        }
                    });
                } else {
                    this.warnings.push('⚠️ No service worker found');
                }
            });
        } else {
            this.warnings.push('⚠️ Service worker not supported');
        }
    }

    // Audit data storage security
    auditDataStorage() {
        console.log('💾 Auditing data storage security...');
        
        // Check localStorage usage
        let localStorageItems = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('shrimptech_')) {
                localStorageItems++;
            }
        }

        if (localStorageItems > 0) {
            this.compliances.push(`✅ Found ${localStorageItems} namespaced localStorage items`);
        }

        // Check for sensitive data in localStorage
        const sensitiveKeys = ['password', 'token', 'secret', 'api_key', 'auth'];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                this.vulnerabilities.push(`❌ Potentially sensitive data in localStorage: ${key}`);
            }
        }

        // Check sessionStorage
        if (sessionStorage.length > 0) {
            this.warnings.push(`⚠️ SessionStorage contains ${sessionStorage.length} items - verify no sensitive data`);
        }
    }

    // Check HTTPS configuration
    checkHTTPSConfiguration() {
        console.log('🔐 Checking HTTPS configuration...');
        
        if (location.protocol === 'https:') {
            this.compliances.push('✅ Site served over HTTPS');
            
            // Check for mixed content
            const insecureResources = [];
            document.querySelectorAll('img, script, link, iframe').forEach(element => {
                const src = element.src || element.href;
                if (src && src.startsWith('http://')) {
                    insecureResources.push(src);
                }
            });

            if (insecureResources.length > 0) {
                this.vulnerabilities.push(`❌ Mixed content detected: ${insecureResources.length} insecure resources`);
            } else {
                this.compliances.push('✅ No mixed content detected');
            }
        } else if (location.hostname !== 'localhost') {
            this.vulnerabilities.push('❌ Site not served over HTTPS in production');
        }
    }

    // Validate authentication security
    validateAuthenticationSecurity() {
        console.log('🔑 Validating authentication security...');
        
        // Check for login forms
        const loginForms = document.querySelectorAll('form[action*="login"], form input[type="password"]');
        
        if (loginForms.length > 0) {
            loginForms.forEach(form => {
                const passwordField = form.querySelector('input[type="password"]');
                if (passwordField) {
                    if (passwordField.autocomplete === 'off') {
                        this.compliances.push('✅ Password field disables autocomplete');
                    } else {
                        this.warnings.push('⚠️ Password field allows autocomplete');
                    }
                }
            });
        }

        // Check for JWT tokens in localStorage (potential security issue)
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (value && (key.includes('token') || value.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/))) {
                this.warnings.push(`⚠️ Potential JWT token in localStorage: ${key}`);
            }
        }
    }

    // Calculate security score
    calculateSecurityScore() {
        const totalChecks = this.vulnerabilities.length + this.warnings.length + this.compliances.length;
        if (totalChecks === 0) return 0;
        
        const score = (this.compliances.length / totalChecks) * 100;
        return Math.round(score);
    }

    // Generate comprehensive report
    generateReport() {
        const score = this.calculateSecurityScore();
        
        console.log('\n🔒 SHRIMPTECH SECURITY AUDIT REPORT');
        console.log('='.repeat(50));
        console.log(`📊 Security Score: ${score}%`);
        console.log(`🔴 Vulnerabilities: ${this.vulnerabilities.length}`);
        console.log(`🟡 Warnings: ${this.warnings.length}`);
        console.log(`🟢 Compliances: ${this.compliances.length}`);
        console.log('='.repeat(50));

        if (this.vulnerabilities.length > 0) {
            console.log('\n🔴 VULNERABILITIES (Fix Immediately):');
            this.vulnerabilities.forEach(vuln => console.log(`  ${vuln}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n🟡 WARNINGS (Review & Fix):');
            this.warnings.forEach(warning => console.log(`  ${warning}`));
        }

        if (this.compliances.length > 0) {
            console.log('\n🟢 COMPLIANCES (Working Well):');
            this.compliances.forEach(compliance => console.log(`  ${compliance}`));
        }

        console.log('\n📋 RECOMMENDATIONS:');
        if (score < 70) {
            console.log('  🚨 Critical: Immediate security improvements required');
        } else if (score < 85) {
            console.log('  ⚠️ Moderate: Several security improvements recommended');
        } else {
            console.log('  ✅ Good: Minor improvements or monitoring recommended');
        }

        console.log('\n🔒 Security audit completed');
        console.log('='.repeat(50));

        return {
            score,
            vulnerabilities: this.vulnerabilities,
            warnings: this.warnings,
            compliances: this.compliances
        };
    }

    // Export report to file
    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            domain: location.hostname,
            score: this.calculateSecurityScore(),
            vulnerabilities: this.vulnerabilities,
            warnings: this.warnings,
            compliances: this.compliances,
            recommendations: this.generateRecommendations()
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shrimptech-security-audit-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.vulnerabilities.length > 0) {
            recommendations.push('Fix all identified vulnerabilities immediately');
        }
        
        if (this.warnings.length > 5) {
            recommendations.push('Review and address warning items');
        }
        
        recommendations.push('Regular security audits (monthly)');
        recommendations.push('Keep dependencies updated');
        recommendations.push('Implement security monitoring');
        
        return recommendations;
    }
}

// Initialize global security auditor
window.ShrimpTechSecurityAuditor = new SecurityAuditor();

// Auto-run audit in development
if (location.hostname === 'localhost' || location.hostname.includes('dev')) {
    setTimeout(() => {
        window.ShrimpTechSecurityAuditor.runFullAudit();
    }, 2000);
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityAuditor;
}

console.log('🔒 Security Auditor loaded and ready');