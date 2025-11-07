/**
 * Configuration Conflict Checker
 * Kiểm tra xung đột trong cấu hình dự án
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SHRIMPTECH - Configuration Conflict Checker\n');
console.log('='.repeat(70) + '\n');

let hasIssues = false;

// 1. Check CORS configuration
console.log('📋 Checking CORS configuration...');
try {
    const serverJs = fs.readFileSync('server.js', 'utf8');
    const allowedOriginsMatch = serverJs.match(/const allowedOrigins = \[([\s\S]*?)\];/);
    
    if (allowedOriginsMatch) {
        const origins = allowedOriginsMatch[1]
            .split('\n')
            .filter(line => line.trim().startsWith("'"))
            .map(line => line.trim().replace(/[',]/g, ''));
        
        console.log('✅ CORS Origins found in server.js:');
        origins.forEach(origin => console.log(`   - ${origin}`));
        
        // Check for Vercel domain
        const hasVercelDomain = origins.some(o => o.includes('vercel.app'));
        if (hasVercelDomain) {
            console.log('✅ Vercel domain found in CORS origins');
        } else {
            console.log('⚠️  WARNING: No Vercel domain in CORS origins');
            hasIssues = true;
        }
    } else {
        console.log('❌ CORS configuration not found!');
        hasIssues = true;
    }
} catch (error) {
    console.log('❌ Error reading server.js:', error.message);
    hasIssues = true;
}

// 2. Check environment variables
console.log('\n📋 Checking environment variables...');
try {
    if (fs.existsSync('.env.example')) {
        const envExample = fs.readFileSync('.env.example', 'utf8');
        const requiredVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_HOST', 'SMTP_PORT'];
        
        console.log('✅ Required variables in .env.example:');
        requiredVars.forEach(varName => {
            if (envExample.includes(varName)) {
                console.log(`   ✓ ${varName}`);
            } else {
                console.log(`   ✗ ${varName} - MISSING!`);
                hasIssues = true;
            }
        });
    } else {
        console.log('⚠️  .env.example not found');
    }
} catch (error) {
    console.log('❌ Error checking environment variables:', error.message);
    hasIssues = true;
}

// 3. Check port configurations
console.log('\n📋 Checking port configurations...');
const files = ['server.js', 'vercel.json', 'package.json'];
const portConfigs = [];

files.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const portMatches = content.match(/PORT['":\s]*=?\s*['"]?\d{4}/gi);
            if (portMatches) {
                console.log(`\n${file}:`);
                portMatches.forEach(match => {
                    console.log(`   ${match}`);
                    portConfigs.push({ file, match });
                });
            }
        } catch (error) {
            console.log(`   Error reading ${file}: ${error.message}`);
        }
    }
});

// 4. Check API endpoints in form-handler
console.log('\n📋 Checking API endpoint configurations...');
try {
    const formHandler = fs.readFileSync('public/js/form-handler.js', 'utf8');
    const endpointMatches = formHandler.match(/'https?:\/\/[^']+'/g);
    
    if (endpointMatches) {
        const uniqueEndpoints = [...new Set(endpointMatches)].map(e => e.replace(/'/g, ''));
        console.log('✅ Endpoints in form-handler.js:');
        uniqueEndpoints.forEach(endpoint => {
            console.log(`   - ${endpoint}`);
        });
        
        // Check for Vercel production endpoint
        const hasVercelEndpoint = uniqueEndpoints.some(e => e.includes('shrimp-tech2.vercel.app'));
        if (hasVercelEndpoint) {
            console.log('✅ Vercel production endpoint found');
        } else {
            console.log('⚠️  WARNING: No Vercel production endpoint found');
            hasIssues = true;
        }
    }
} catch (error) {
    console.log('❌ Error checking form-handler.js:', error.message);
    hasIssues = true;
}

// 5. Check SMTP configuration
console.log('\n📋 Checking SMTP configuration...');
try {
    const serverJs = fs.readFileSync('server.js', 'utf8');
    
    if (serverJs.includes('nodemailer.createTransport')) {
        console.log('✅ Nodemailer transporter configured');
    } else {
        console.log('❌ Nodemailer transporter not found');
        hasIssues = true;
    }
    
    if (serverJs.includes('process.env.SMTP_USER') && serverJs.includes('process.env.SMTP_PASS')) {
        console.log('✅ SMTP uses environment variables');
    } else {
        console.log('⚠️  SMTP might have hardcoded credentials');
        hasIssues = true;
    }
} catch (error) {
    console.log('❌ Error checking SMTP config:', error.message);
    hasIssues = true;
}

// 6. Check vercel.json
console.log('\n📋 Checking Vercel configuration...');
try {
    if (fs.existsSync('vercel.json')) {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        if (vercelConfig.builds && vercelConfig.builds.length > 0) {
            console.log('✅ Vercel builds configured:');
            vercelConfig.builds.forEach(build => {
                console.log(`   - ${build.src} → ${build.use}`);
            });
        }
        
        if (vercelConfig.routes && vercelConfig.routes.length > 0) {
            console.log('✅ Vercel routes configured');
        }
    } else {
        console.log('⚠️  vercel.json not found');
        hasIssues = true;
    }
} catch (error) {
    console.log('❌ Error checking vercel.json:', error.message);
    hasIssues = true;
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70) + '\n');

if (hasIssues) {
    console.log('⚠️  Some issues or warnings found. Please review above.\n');
    process.exit(1);
} else {
    console.log('✅ No critical issues found! Configuration looks good.\n');
    console.log('📝 Next steps:');
    console.log('   1. Make sure environment variables are set on Vercel');
    console.log('   2. Test locally: npm start');
    console.log('   3. Deploy: git push origin main');
    console.log('   4. Test deployment: npm run vercel-health\n');
    process.exit(0);
}
