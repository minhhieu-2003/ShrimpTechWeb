const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔐 SHRIMPTECH - Verify New SMTP App Password');
console.log('='.repeat(60));

// Display configuration (mask password)
console.log('\n📋 Current Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '587');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (aewb xgdn jlfv alcc)' : '❌ NOT SET');

if (!process.env.SMTP_PASS) {
    console.error('\n❌ ERROR: SMTP_PASS not found in .env file');
    console.log('Please add: SMTP_PASS=aewb xgdn jlfv alcc');
    process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true,
    logger: true
});

console.log('\n🔌 Testing SMTP Connection...');

transporter.verify((error, success) => {
    if (error) {
        console.log('\n❌ SMTP Verification FAILED:');
        console.error('Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Verify App Password: aewb xgdn jlfv alcc');
        console.log('2. Check 2FA is enabled: https://myaccount.google.com/security');
        console.log('3. Generate new App Password: https://myaccount.google.com/apppasswords');
        console.log('4. Update .env file with new password');
        process.exit(1);
    } else {
        console.log('\n✅ SMTP Verification SUCCESSFUL!');
        console.log('Server is ready to send emails');
        
        // Send test email
        sendTestEmail();
    }
});

async function sendTestEmail() {
    console.log('\n📧 Sending Test Email...');
    
    try {
        const info = await transporter.sendMail({
            from: `"SHRIMPTECH Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: '✅ SHRIMPTECH - New SMTP Password Verified',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🦐 SHRIMPTECH</h1>
                        <p style="color: white; margin: 10px 0 0;">SMTP Auto Mail System</p>
                    </div>
                    <div style="padding: 30px; background: white;">
                        <h2 style="color: #0066cc;">✅ New App Password Verified Successfully!</h2>
                        
                        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
                            <p style="margin: 0;"><strong>✅ Verification Results:</strong></p>
                            <ul style="margin: 10px 0 0;">
                                <li>New App Password: <code>aewb xgdn jlfv alcc</code></li>
                                <li>SMTP Connection: OK</li>
                                <li>Email Sending: OK</li>
                                <li>Auto Mail System: OPERATIONAL</li>
                            </ul>
                        </div>
                        
                        <p><strong>Test Time:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                        <p><strong>SMTP Server:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</p>
                        <p><strong>Email Account:</strong> ${process.env.SMTP_USER}</p>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Hệ thống email tự động của ShrimpTech đang hoạt động bình thường với App Password mới.
                        </p>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #999;">
                            © 2024 SHRIMPTECH - Auto Mail System v2.2
                        </p>
                    </div>
                </div>
            `
        });
        
        console.log('\n✅ Test Email Sent Successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('\n📬 Check your inbox:', process.env.SMTP_USER);
        console.log('\n🎉 New App Password is working correctly!');
        
        process.exit(0);
        
    } catch (error) {
        console.log('\n❌ Test Email Failed:');
        console.error('Error:', error.message);
        process.exit(1);
    }
}
