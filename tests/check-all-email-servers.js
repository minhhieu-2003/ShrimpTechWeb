const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 SHRIMPTECH - Check All Email Servers');
console.log('='.repeat(60));

// Test configurations
const configs = [
    {
        name: 'Primary Gmail SMTP (Port 587)',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    {
        name: 'Gmail SSL (Port 465)',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
];

async function testConfig(config) {
    console.log(`\n📧 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Secure: ${config.secure}`);
    
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });
    
    try {
        await transporter.verify();
        console.log(`   ✅ Status: ONLINE`);
        return true;
    } catch (error) {
        console.log(`   ❌ Status: OFFLINE`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

(async () => {
    console.log('\n🔐 App Password: Configured in .env');
    console.log('📧 Email Account:', process.env.SMTP_USER);
    
    const results = [];
    for (const config of configs) {
        const result = await testConfig(config);
        results.push({ name: config.name, success: result });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    results.forEach(r => {
        console.log(`   ${r.success ? '✅' : '❌'} ${r.name}`);
    });
    
    const allSuccess = results.every(r => r.success);
    if (allSuccess) {
        console.log('\n🎉 All email servers are operational!');
        process.exit(0);
    } else {
        console.log('\n⚠️ Some servers are offline. Check configuration.');
        process.exit(1);
    }
})();
