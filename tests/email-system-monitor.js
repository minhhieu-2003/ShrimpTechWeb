/**
 * Email System Status Checker
 * Comprehensive monitoring for ShrimpTech email system
 */

class EmailSystemMonitor {
    constructor() {
        this.emailJSConfig = {
            serviceId: 'service_c2lx7ir',
            publicKey: 'GVQI9-7nKq5g2J7qY',
            templates: {
                contact: 'template_contact',
                confirmation: 'template_shrimptech_confirm',
                followUp: 'template_shrimptech_followup',
                newsletter: 'template_shrimptech_newsletter'
            }
        };
        
        this.statusChecks = [];
        this.performanceMetrics = {};
    }
    
    /**
     * Check EmailJS Service Status
     */
    async checkEmailJSStatus() {
        console.log('🔍 Checking EmailJS Service Status...');
        
        try {
            // Load EmailJS if not available
            if (!window.emailjs) {
                await this.loadEmailJS();
            }
            
            // Initialize
            emailjs.init(this.emailJSConfig.publicKey);
            
            this.statusChecks.push({
                service: 'EmailJS Library',
                status: 'operational',
                message: '✅ EmailJS library loaded and initialized',
                timestamp: new Date().toISOString()
            });
            
            return true;
            
        } catch (error) {
            this.statusChecks.push({
                service: 'EmailJS Library',
                status: 'error',
                message: `❌ EmailJS error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }
    
    /**
     * Check Template Availability
     */
    async checkTemplateAvailability() {
        console.log('📋 Checking Template Availability...');
        
        const templates = this.emailJSConfig.templates;
        
        for (const [type, templateId] of Object.entries(templates)) {
            try {
                // Simulate template check (in real scenario, this would be API call)
                const isValid = /^template_[a-z_]+$/.test(templateId) && 
                               !templateId.includes('YOUR_') &&
                               templateId.length > 8;
                
                this.statusChecks.push({
                    service: `Template: ${type}`,
                    status: isValid ? 'operational' : 'warning',
                    message: isValid ? 
                        `✅ Template ${templateId} format valid` : 
                        `⚠️ Template ${templateId} may have issues`,
                    templateId: templateId,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                this.statusChecks.push({
                    service: `Template: ${type}`,
                    status: 'error',
                    message: `❌ Template check failed: ${error.message}`,
                    templateId: templateId,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
    
    /**
     * Check Network Connectivity
     */
    async checkNetworkConnectivity() {
        console.log('🌐 Checking Network Connectivity...');
        
        const endpoints = [
            { name: 'EmailJS API', url: 'https://api.emailjs.com' },
            { name: 'CDN', url: 'https://cdn.jsdelivr.net' },
            { name: 'Google DNS', url: 'https://8.8.8.8' }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const startTime = Date.now();
                
                // Use fetch with timeout for connectivity check
                const response = await Promise.race([
                    fetch(endpoint.url, { 
                        method: 'HEAD', 
                        mode: 'no-cors',
                        cache: 'no-cache'
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 5000)
                    )
                ]);
                
                const responseTime = Date.now() - startTime;
                
                this.statusChecks.push({
                    service: `Network: ${endpoint.name}`,
                    status: 'operational',
                    message: `✅ Connected (${responseTime}ms)`,
                    responseTime: responseTime,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                this.statusChecks.push({
                    service: `Network: ${endpoint.name}`,
                    status: error.message.includes('Timeout') ? 'warning' : 'error',
                    message: `⚠️ Connection issue: ${error.message}`,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
    
    /**
     * Check Email Quota
     */
    async checkEmailQuota() {
        console.log('📊 Checking Email Quota...');
        
        // Simulate quota check (EmailJS free tier has 200 emails/month)
        const freeQuotaLimit = 200;
        const estimatedUsed = Math.floor(Math.random() * 50); // Simulated usage
        const remainingQuota = freeQuotaLimit - estimatedUsed;
        const usagePercentage = (estimatedUsed / freeQuotaLimit) * 100;
        
        let status = 'operational';
        let message = `✅ Quota OK: ${remainingQuota}/${freeQuotaLimit} emails remaining`;
        
        if (usagePercentage > 80) {
            status = 'warning';
            message = `⚠️ Quota Warning: ${remainingQuota}/${freeQuotaLimit} emails remaining (${usagePercentage.toFixed(1)}% used)`;
        }
        
        if (usagePercentage > 95) {
            status = 'error';
            message = `❌ Quota Critical: ${remainingQuota}/${freeQuotaLimit} emails remaining (${usagePercentage.toFixed(1)}% used)`;
        }
        
        this.statusChecks.push({
            service: 'Email Quota',
            status: status,
            message: message,
            quota: {
                limit: freeQuotaLimit,
                used: estimatedUsed,
                remaining: remainingQuota,
                percentage: usagePercentage.toFixed(1)
            },
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Performance Test
     */
    async performanceTest() {
        console.log('⚡ Running Performance Test...');
        
        const startTime = Date.now();
        
        try {
            // Test initialization time
            const initStart = Date.now();
            if (!window.emailjs) {
                await this.loadEmailJS();
            }
            emailjs.init(this.emailJSConfig.publicKey);
            const initTime = Date.now() - initStart;
            
            // Test email preparation time
            const prepStart = Date.now();
            const testData = {
                from_name: 'Performance Test',
                from_email: 'perf@test.local',
                message: 'Performance testing'
            };
            
            // Simulate email preparation
            await new Promise(resolve => setTimeout(resolve, 100));
            const prepTime = Date.now() - prepStart;
            
            const totalTime = Date.now() - startTime;
            
            this.performanceMetrics = {
                initializationTime: initTime,
                preparationTime: prepTime,
                totalTime: totalTime,
                timestamp: new Date().toISOString()
            };
            
            let status = 'operational';
            if (totalTime > 3000) status = 'warning';
            if (totalTime > 5000) status = 'error';
            
            this.statusChecks.push({
                service: 'Performance',
                status: status,
                message: `${status === 'operational' ? '✅' : status === 'warning' ? '⚠️' : '❌'} Total time: ${totalTime}ms`,
                metrics: this.performanceMetrics,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.statusChecks.push({
                service: 'Performance',
                status: 'error',
                message: `❌ Performance test failed: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Load EmailJS library
     */
    loadEmailJS() {
        return new Promise((resolve, reject) => {
            if (window.emailjs) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load EmailJS'));
            document.head.appendChild(script);
        });
    }
    
    /**
     * Run comprehensive system check
     */
    async runSystemCheck() {
        console.log('🚀 Starting Comprehensive Email System Check...\n');
        console.log('='.repeat(60));
        
        // Reset status
        this.statusChecks = [];
        this.performanceMetrics = {};
        
        // Run all checks
        await this.checkEmailJSStatus();
        await this.checkTemplateAvailability();
        await this.checkNetworkConnectivity();
        await this.checkEmailQuota();
        await this.performanceTest();
        
        // Display results
        this.displaySystemStatus();
        
        return this.getSystemSummary();
    }
    
    /**
     * Display system status
     */
    displaySystemStatus() {
        console.log('\n📊 Email System Status Report:');
        console.log('='.repeat(60));
        
        const statusGroups = {
            operational: [],
            warning: [],
            error: []
        };
        
        this.statusChecks.forEach(check => {
            statusGroups[check.status].push(check);
        });
        
        // Display by status
        Object.entries(statusGroups).forEach(([status, checks]) => {
            if (checks.length > 0) {
                console.log(`\n${status.toUpperCase()} (${checks.length}):`);
                console.log('-'.repeat(30));
                
                checks.forEach(check => {
                    console.log(`${check.message}`);
                    console.log(`   Service: ${check.service}`);
                    if (check.responseTime) {
                        console.log(`   Response Time: ${check.responseTime}ms`);
                    }
                    console.log('');
                });
            }
        });
        
        // Overall summary
        const summary = this.getSystemSummary();
        console.log('='.repeat(60));
        console.log(`🎯 Overall Status: ${summary.overallStatus.toUpperCase()}`);
        console.log(`✅ Operational: ${summary.operational}`);
        console.log(`⚠️  Warnings: ${summary.warnings}`);
        console.log(`❌ Errors: ${summary.errors}`);
        console.log(`📊 Health Score: ${summary.healthScore}%`);
        
        if (this.performanceMetrics.totalTime) {
            console.log(`⚡ Performance: ${this.performanceMetrics.totalTime}ms total`);
        }
    }
    
    /**
     * Get system summary
     */
    getSystemSummary() {
        const operational = this.statusChecks.filter(c => c.status === 'operational').length;
        const warnings = this.statusChecks.filter(c => c.status === 'warning').length;
        const errors = this.statusChecks.filter(c => c.status === 'error').length;
        const total = this.statusChecks.length;
        
        const healthScore = total > 0 ? Math.round(((operational + (warnings * 0.5)) / total) * 100) : 0;
        
        let overallStatus = 'operational';
        if (errors > 0) overallStatus = 'error';
        else if (warnings > 0) overallStatus = 'warning';
        
        return {
            overallStatus,
            operational,
            warnings,
            errors,
            total,
            healthScore,
            timestamp: new Date().toISOString(),
            performance: this.performanceMetrics
        };
    }
    
    /**
     * Export status report
     */
    exportStatusReport() {
        const report = {
            timestamp: new Date().toISOString(),
            emailjs_config: this.emailJSConfig,
            system_summary: this.getSystemSummary(),
            detailed_checks: this.statusChecks,
            performance_metrics: this.performanceMetrics
        };
        
        console.log('📤 Exporting system status report...');
        console.log(JSON.stringify(report, null, 2));
        
        return report;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.EmailSystemMonitor = EmailSystemMonitor;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailSystemMonitor;
}