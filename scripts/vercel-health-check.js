/**
 * Vercel Deployment Health Check
 * Test all endpoints after deployment
 */

const https = require('https');

// Configuration
const VERCEL_DOMAINS = [
    'https://shrimp-tech2.vercel.app',
    // Add your custom domain here when available
    // 'https://shrimptech.vn'
];

const ENDPOINTS = [
    { path: '/', method: 'GET', name: 'Homepage', expectStatus: 200 },
    { path: '/api/status', method: 'GET', name: 'API Status', expectStatus: 200 },
    { path: '/api/health', method: 'GET', name: 'Health Check', expectStatus: 200 },
    { path: '/styles.css', method: 'GET', name: 'Static CSS', expectStatus: 200 },
    { path: '/js/main.js', method: 'GET', name: 'Static JS', expectStatus: 200 },
];

console.log('🔍 SHRIMPTECH - Vercel Deployment Health Check\n');
console.log('='.repeat(70));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Make HTTP request
 */
function makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: method,
            headers: {
                'User-Agent': 'ShrimpTech-HealthCheck/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Test a single endpoint
 */
async function testEndpoint(domain, endpoint) {
    totalTests++;
    const url = `${domain}${endpoint.path}`;
    
    try {
        const response = await makeRequest(url, endpoint.method);
        
        if (response.statusCode === endpoint.expectStatus) {
            passedTests++;
            console.log(`✅ ${endpoint.name.padEnd(20)} - ${url}`);
            console.log(`   Status: ${response.statusCode} (Expected: ${endpoint.expectStatus})`);
            
            // Try to parse JSON for API endpoints
            if (endpoint.path.startsWith('/api/')) {
                try {
                    const json = JSON.parse(response.body);
                    console.log(`   Response: ${JSON.stringify(json).substring(0, 100)}...`);
                } catch (e) {
                    // Not JSON, that's OK
                }
            }
            return true;
        } else {
            failedTests++;
            console.log(`❌ ${endpoint.name.padEnd(20)} - ${url}`);
            console.log(`   Status: ${response.statusCode} (Expected: ${endpoint.expectStatus})`);
            return false;
        }
    } catch (error) {
        failedTests++;
        console.log(`❌ ${endpoint.name.padEnd(20)} - ${url}`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

/**
 * Test all endpoints for a domain
 */
async function testDomain(domain) {
    console.log(`\n🌐 Testing domain: ${domain}`);
    console.log('-'.repeat(70));
    
    for (const endpoint of ENDPOINTS) {
        await testEndpoint(domain, endpoint);
        console.log('');
    }
}

/**
 * Main test function
 */
async function runHealthCheck() {
    console.log(`\n📋 Testing ${ENDPOINTS.length} endpoints across ${VERCEL_DOMAINS.length} domain(s)\n`);
    
    for (const domain of VERCEL_DOMAINS) {
        try {
            await testDomain(domain);
        } catch (error) {
            console.error(`\n❌ Error testing ${domain}:`, error.message);
        }
    }
    
    // Summary
    console.log('='.repeat(70));
    console.log('\n📊 HEALTH CHECK SUMMARY\n');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);
    
    if (failedTests === 0) {
        console.log('🎉 All tests passed! Deployment is healthy.\n');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed. Please check the logs above.\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    console.log('⏳ Starting health check in 3 seconds...\n');
    setTimeout(() => {
        runHealthCheck().catch(error => {
            console.error('💥 Health check failed:', error);
            process.exit(1);
        });
    }, 3000);
}

module.exports = { runHealthCheck, testEndpoint };
