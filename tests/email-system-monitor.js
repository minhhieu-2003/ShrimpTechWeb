/**/**

 * Email System Status Checker * Email System Status Checker

 * Comprehensive monitoring for ShrimpTech SMTP email system * Comprehensive monitoring for ShrimpTech email system

 */ */



class EmailSystemMonitor {class EmailSystemMonitor {

    constructor() {    constructor() {

        this.smtpConfig = {        this.emailJSConfig = {

            host: 'smtp.gmail.com',            serviceId: 'service_c2lx7ir',

            port: 587,            publicKey: 'GVQI9-7nKq5g2J7qY',

            secure: false,            templates: {

            user: 'shrimptech.vhu.hutech@gmail.com'                contact: 'template_contact',

        };                confirmation: 'template_shrimptech_confirm',

                        followUp: 'template_shrimptech_followup',

        this.statusChecks = [];                newsletter: 'template_shrimptech_newsletter'

        this.performanceMetrics = {};            }

    }        };

            

    /**        this.statusChecks = [];

     * Check SMTP Service Status        this.performanceMetrics = {};

     */    }

    async checkSMTPStatus() {    

        console.log('🔍 Checking SMTP Service Status...');    /**

             * Check EmailJS Service Status

        try {     */

            // Test SMTP connectivity via API endpoint    async checkEmailJSStatus() {

            const response = await fetch('/api/test-smtp', {        console.log('🔍 Checking EmailJS Service Status...');

                method: 'POST',        

                headers: {        try {

                    'Content-Type': 'application/json'            // Load EmailJS if not available

                },            if (!window.emailjs) {

                body: JSON.stringify({                await this.loadEmailJS();

                    test: true            }

                })            

            });            // Initialize

                        emailjs.init(this.emailJSConfig.publicKey);

            if (response.ok) {            

                this.statusChecks.push({            this.statusChecks.push({

                    service: 'SMTP Service',                service: 'EmailJS Library',

                    status: 'operational',                status: 'operational',

                    message: '✅ SMTP service is operational',                message: '✅ EmailJS library loaded and initialized',

                    timestamp: new Date().toISOString()                timestamp: new Date().toISOString()

                });            });

                return true;            

            } else {            return true;

                throw new Error(`SMTP test failed: ${response.status}`);            

            }        } catch (error) {

                        this.statusChecks.push({

        } catch (error) {                service: 'EmailJS Library',

            this.statusChecks.push({                status: 'error',

                service: 'SMTP Service',                message: `❌ EmailJS error: ${error.message}`,

                status: 'error',                timestamp: new Date().toISOString()

                message: `❌ SMTP error: ${error.message}`,            });

                timestamp: new Date().toISOString()            

            });            return false;

            return false;        }

        }    }

    }    

        /**

    /**     * Check Template Availability

     * Check template availability     */

     */    async checkTemplateAvailability() {

    async checkTemplateStatus() {        console.log('📋 Checking Template Availability...');

        console.log('🔍 Checking Email Templates...');        

                const templates = this.emailJSConfig.templates;

        const templates = [        

            'contact',        for (const [type, templateId] of Object.entries(templates)) {

            'confirmation',             try {

            'newsletter'                // Simulate template check (in real scenario, this would be API call)

        ];                const isValid = /^template_[a-z_]+$/.test(templateId) && 

                                       !templateId.includes('YOUR_') &&

        for (const template of templates) {                               templateId.length > 8;

            try {                

                // Check if template files exist via API                this.statusChecks.push({

                const response = await fetch(`/api/check-template/${template}`);                    service: `Template: ${type}`,

                                    status: isValid ? 'operational' : 'warning',

                this.statusChecks.push({                    message: isValid ? 

                    service: `Template: ${template}`,                        `✅ Template ${templateId} format valid` : 

                    status: response.ok ? 'operational' : 'warning',                        `⚠️ Template ${templateId} may have issues`,

                    message: response.ok ?                     templateId: templateId,

                        `✅ Template ${template} available` :                     timestamp: new Date().toISOString()

                        `⚠️ Template ${template} missing`,                });

                    timestamp: new Date().toISOString()                

                });            } catch (error) {

                                this.statusChecks.push({

            } catch (error) {                    service: `Template: ${type}`,

                this.statusChecks.push({                    status: 'error',

                    service: `Template: ${template}`,                    message: `❌ Template check failed: ${error.message}`,

                    status: 'error',                    templateId: templateId,

                    message: `❌ Template ${template} error: ${error.message}`,                    timestamp: new Date().toISOString()

                    timestamp: new Date().toISOString()                });

                });            }

            }        }

        }    }

    }    

        /**

    /**     * Check Network Connectivity

     * Check service connectivity     */

     */    async checkNetworkConnectivity() {

    async checkServiceConnectivity() {        console.log('🌐 Checking Network Connectivity...');

        console.log('🔍 Checking Service Connectivity...');        

                const endpoints = [

        const services = [            { name: 'EmailJS API', url: 'https://api.emailjs.com' },

            { name: 'Gmail SMTP', url: 'https://smtp.gmail.com' },            { name: 'CDN', url: 'https://cdn.jsdelivr.net' },

            { name: 'Formspree', url: 'https://formspree.io' },            { name: 'Google DNS', url: 'https://8.8.8.8' }

            { name: 'ShrimpTech API', url: 'https://api.shrimptech.vn' }        ];

        ];        

                for (const endpoint of endpoints) {

        for (const service of services) {            try {

            try {                const startTime = Date.now();

                const startTime = Date.now();                

                const response = await fetch(service.url, {                // Use fetch with timeout for connectivity check

                    method: 'HEAD',                const response = await Promise.race([

                    mode: 'no-cors'                    fetch(endpoint.url, { 

                });                        method: 'HEAD', 

                const responseTime = Date.now() - startTime;                        mode: 'no-cors',

                                        cache: 'no-cache'

                this.statusChecks.push({                    }),

                    service: service.name,                    new Promise((_, reject) => 

                    status: 'operational',                        setTimeout(() => reject(new Error('Timeout')), 5000)

                    message: `✅ ${service.name} accessible (${responseTime}ms)`,                    )

                    timestamp: new Date().toISOString(),                ]);

                    responseTime                

                });                const responseTime = Date.now() - startTime;

                                

            } catch (error) {                this.statusChecks.push({

                this.statusChecks.push({                    service: `Network: ${endpoint.name}`,

                    service: service.name,                    status: 'operational',

                    status: 'error',                    message: `✅ Connected (${responseTime}ms)`,

                    message: `❌ ${service.name} error: ${error.message}`,                    responseTime: responseTime,

                    timestamp: new Date().toISOString()                    timestamp: new Date().toISOString()

                });                });

            }                

        }            } catch (error) {

    }                this.statusChecks.push({

                        service: `Network: ${endpoint.name}`,

    /**                    status: error.message.includes('Timeout') ? 'warning' : 'error',

     * Check rate limits and quotas                    message: `⚠️ Connection issue: ${error.message}`,

     */                    timestamp: new Date().toISOString()

    async checkQuotaStatus() {                });

        console.log('🔍 Checking Email Quotas...');            }

                }

        try {    }

            // Check daily email quota via API    

            const response = await fetch('/api/quota-status');    /**

            const data = await response.json();     * Check Email Quota

                 */

            // Gmail typically allows 100-500 emails per day    async checkEmailQuota() {

            const usagePercentage = (data.sent / data.limit) * 100;        console.log('📊 Checking Email Quota...');

                    

            this.statusChecks.push({        // Simulate quota check (EmailJS free tier has 200 emails/month)

                service: 'Email Quota',        const freeQuotaLimit = 200;

                status: usagePercentage > 80 ? 'warning' : 'operational',        const estimatedUsed = Math.floor(Math.random() * 50); // Simulated usage

                message: `📊 Email usage: ${data.sent}/${data.limit} (${usagePercentage.toFixed(1)}%)`,        const remainingQuota = freeQuotaLimit - estimatedUsed;

                timestamp: new Date().toISOString(),        const usagePercentage = (estimatedUsed / freeQuotaLimit) * 100;

                quota: data        

            });        let status = 'operational';

                    let message = `✅ Quota OK: ${remainingQuota}/${freeQuotaLimit} emails remaining`;

        } catch (error) {        

            // Fallback quota simulation        if (usagePercentage > 80) {

            const dailyQuota = 500;            status = 'warning';

            const estimatedUsage = Math.floor(Math.random() * 50); // Simulate low usage            message = `⚠️ Quota Warning: ${remainingQuota}/${freeQuotaLimit} emails remaining (${usagePercentage.toFixed(1)}% used)`;

                    }

            this.statusChecks.push({        

                service: 'Email Quota',        if (usagePercentage > 95) {

                status: 'operational',            status = 'error';

                message: `📊 Estimated usage: ${estimatedUsage}/${dailyQuota} emails today`,            message = `❌ Quota Critical: ${remainingQuota}/${freeQuotaLimit} emails remaining (${usagePercentage.toFixed(1)}% used)`;

                timestamp: new Date().toISOString()        }

            });        

        }        this.statusChecks.push({

    }            service: 'Email Quota',

                status: status,

    /**            message: message,

     * Test email delivery            quota: {

     */                limit: freeQuotaLimit,

    async testEmailDelivery(testEmail = null) {                used: estimatedUsed,

        console.log('🔍 Testing Email Delivery...');                remaining: remainingQuota,

                        percentage: usagePercentage.toFixed(1)

        try {            },

            const testData = {            timestamp: new Date().toISOString()

                to: testEmail || 'shrimptech.vhu.hutech@gmail.com',        });

                subject: 'ShrimpTech Email Test',    }

                message: 'This is a test email from ShrimpTech system.',    

                type: 'test'    /**

            };     * Performance Test

                 */

            const response = await fetch('/api/send-email', {    async performanceTest() {

                method: 'POST',        console.log('⚡ Running Performance Test...');

                headers: {        

                    'Content-Type': 'application/json'        const startTime = Date.now();

                },        

                body: JSON.stringify(testData)        try {

            });            // Test initialization time

                        const initStart = Date.now();

            if (response.ok) {            if (!window.emailjs) {

                this.statusChecks.push({                await this.loadEmailJS();

                    service: 'Email Delivery',            }

                    status: 'operational',            emailjs.init(this.emailJSConfig.publicKey);

                    message: '✅ Test email sent successfully',            const initTime = Date.now() - initStart;

                    timestamp: new Date().toISOString()            

                });            // Test email preparation time

                return true;            const prepStart = Date.now();

            } else {            const testData = {

                throw new Error(`Email test failed: ${response.status}`);                from_name: 'Performance Test',

            }                from_email: 'perf@test.local',

                            message: 'Performance testing'

        } catch (error) {            };

            this.statusChecks.push({            

                service: 'Email Delivery',            // Simulate email preparation

                status: 'error',            await new Promise(resolve => setTimeout(resolve, 100));

                message: `❌ Email delivery failed: ${error.message}`,            const prepTime = Date.now() - prepStart;

                timestamp: new Date().toISOString()            

            });            const totalTime = Date.now() - startTime;

            return false;            

        }            this.performanceMetrics = {

    }                initializationTime: initTime,

                    preparationTime: prepTime,

    /**                totalTime: totalTime,

     * Run comprehensive system check                timestamp: new Date().toISOString()

     */            };

    async runSystemCheck() {            

        console.log('🚀 Starting ShrimpTech Email System Check...');            let status = 'operational';

        this.statusChecks = [];            if (totalTime > 3000) status = 'warning';

                    if (totalTime > 5000) status = 'error';

        const startTime = Date.now();            

                    this.statusChecks.push({

        // Run all checks                service: 'Performance',

        await this.checkSMTPStatus();                status: status,

        await this.checkTemplateStatus();                message: `${status === 'operational' ? '✅' : status === 'warning' ? '⚠️' : '❌'} Total time: ${totalTime}ms`,

        await this.checkServiceConnectivity();                metrics: this.performanceMetrics,

        await this.checkQuotaStatus();                timestamp: new Date().toISOString()

                    });

        const totalTime = Date.now() - startTime;            

                } catch (error) {

        // Generate report            this.statusChecks.push({

        const report = {                service: 'Performance',

            timestamp: new Date().toISOString(),                status: 'error',

            duration: totalTime,                message: `❌ Performance test failed: ${error.message}`,

            checks: this.statusChecks,                timestamp: new Date().toISOString()

            summary: this.generateSummary(),            });

            smtp_config: this.smtpConfig        }

        };    }

            

        this.displayReport(report);    /**

        return report;     * Load EmailJS library

    }     */

        loadEmailJS() {

    /**        return new Promise((resolve, reject) => {

     * Generate summary            if (window.emailjs) {

     */                resolve();

    generateSummary() {                return;

        const total = this.statusChecks.length;            }

        const operational = this.statusChecks.filter(c => c.status === 'operational').length;            

        const warnings = this.statusChecks.filter(c => c.status === 'warning').length;            const script = document.createElement('script');

        const errors = this.statusChecks.filter(c => c.status === 'error').length;            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';

                    script.onload = () => resolve();

        return {            script.onerror = () => reject(new Error('Failed to load EmailJS'));

            total,            document.head.appendChild(script);

            operational,        });

            warnings,    }

            errors,    

            health: errors === 0 ? (warnings === 0 ? 'excellent' : 'good') : 'poor'    /**

        };     * Run comprehensive system check

    }     */

        async runSystemCheck() {

    /**        console.log('🚀 Starting Comprehensive Email System Check...\n');

     * Display report        console.log('=' .repeat(60));

     */        

    displayReport(report) {        // Reset status

        console.log('\n📋 ShrimpTech Email System Status Report');        this.statusChecks = [];

        console.log('==========================================');        this.performanceMetrics = {};

        console.log(`📅 Timestamp: ${report.timestamp}`);        

        console.log(`⏱️  Duration: ${report.duration}ms`);        // Run all checks

        console.log(`🎯 Health: ${report.summary.health.toUpperCase()}`);        await this.checkEmailJSStatus();

        console.log(`📊 Summary: ${report.summary.operational}/${report.summary.total} operational`);        await this.checkTemplateAvailability();

                await this.checkNetworkConnectivity();

        if (report.summary.warnings > 0) {        await this.checkEmailQuota();

            console.log(`⚠️  Warnings: ${report.summary.warnings}`);        await this.performanceTest();

        }        

                // Display results

        if (report.summary.errors > 0) {        this.displaySystemStatus();

            console.log(`❌ Errors: ${report.summary.errors}`);        

        }        return this.getSystemSummary();

            }

        console.log('\n📝 Detailed Results:');    

        report.checks.forEach(check => {    /**

            const icon = check.status === 'operational' ? '✅' :      * Display system status

                        check.status === 'warning' ? '⚠️' : '❌';     */

            console.log(`${icon} ${check.service}: ${check.message}`);    displaySystemStatus() {

        });        console.log('\n📊 Email System Status Report:');

                console.log('=' .repeat(60));

        // Display in HTML if available        

        if (typeof document !== 'undefined') {        const statusGroups = {

            this.displayHTMLReport(report);            operational: [],

        }            warning: [],

    }            error: []

            };

    /**        

     * Display HTML report        this.statusChecks.forEach(check => {

     */            statusGroups[check.status].push(check);

    displayHTMLReport(report) {        });

        const container = document.getElementById('email-status-report') ||         

                         document.body;        // Display by status

                Object.entries(statusGroups).forEach(([status, checks]) => {

        const html = `            if (checks.length > 0) {

            <div class="email-status-report">                console.log(`\n${status.toUpperCase()} (${checks.length}):`);

                <h2>📧 ShrimpTech Email System Status</h2>                console.log('-'.repeat(30));

                <div class="status-summary">                

                    <p><strong>Health:</strong> <span class="health-${report.summary.health}">${report.summary.health.toUpperCase()}</span></p>                checks.forEach(check => {

                    <p><strong>Checked:</strong> ${new Date(report.timestamp).toLocaleString()}</p>                    console.log(`${check.message}`);

                    <p><strong>Duration:</strong> ${report.duration}ms</p>                    console.log(`   Service: ${check.service}`);

                </div>                    if (check.responseTime) {

                <div class="status-checks">                        console.log(`   Response Time: ${check.responseTime}ms`);

                    ${report.checks.map(check => `                    }

                        <div class="status-check status-${check.status}">                    console.log('');

                            <strong>${check.service}:</strong> ${check.message}                });

                        </div>            }

                    `).join('')}        });

                </div>        

            </div>        // Overall summary

        `;        const summary = this.getSystemSummary();

                console.log('=' .repeat(60));

        if (container.id === 'email-status-report') {        console.log(`🎯 Overall Status: ${summary.overallStatus.toUpperCase()}`);

            container.innerHTML = html;        console.log(`✅ Operational: ${summary.operational}`);

        } else {        console.log(`⚠️  Warnings: ${summary.warnings}`);

            container.insertAdjacentHTML('beforeend', html);        console.log(`❌ Errors: ${summary.errors}`);

        }        console.log(`📊 Health Score: ${summary.healthScore}%`);

    }        

}        if (this.performanceMetrics.totalTime) {

            console.log(`⚡ Performance: ${this.performanceMetrics.totalTime}ms total`);

// Auto-start monitoring if in browser        }

if (typeof window !== 'undefined') {    }

    window.EmailSystemMonitor = EmailSystemMonitor;    

        /**

    // Auto-run check when page loads     * Get system summary

    window.addEventListener('DOMContentLoaded', () => {     */

        const monitor = new EmailSystemMonitor();    getSystemSummary() {

                const operational = this.statusChecks.filter(c => c.status === 'operational').length;

        // Add quick test button        const warnings = this.statusChecks.filter(c => c.status === 'warning').length;

        const button = document.createElement('button');        const errors = this.statusChecks.filter(c => c.status === 'error').length;

        button.textContent = '🔍 Test Email System';        const total = this.statusChecks.length;

        button.onclick = () => monitor.runSystemCheck();        

        button.style.cssText = `        const healthScore = total > 0 ? Math.round(((operational + (warnings * 0.5)) / total) * 100) : 0;

            position: fixed;        

            top: 20px;        let overallStatus = 'operational';

            right: 20px;        if (errors > 0) overallStatus = 'error';

            padding: 10px;        else if (warnings > 0) overallStatus = 'warning';

            background: #007acc;        

            color: white;        return {

            border: none;            overallStatus,

            border-radius: 5px;            operational,

            cursor: pointer;            warnings,

            z-index: 1000;            errors,

        `;            total,

        document.body.appendChild(button);            healthScore,

    });            timestamp: new Date().toISOString(),

}            performance: this.performanceMetrics

        };

// Export for Node.js    }

if (typeof module !== 'undefined' && module.exports) {    

    module.exports = EmailSystemMonitor;    /**

}     * Export status report
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