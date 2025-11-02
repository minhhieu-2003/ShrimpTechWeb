const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS // ✅ From environment variable
    }
});

// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Test Failed:', error);
    } else {
        console.log('✅ SMTP Test Successful - Server ready to send emails');
        console.log('📧 Using email:', process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com');
    }
});

// Test send email
async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: '"SHRIMP TECH Test" <shrimptech.vhu.hutech@gmail.com>',
            to: 'shrimptech.vhu.hutech@gmail.com',
            subject: '🦐 SMTP Test - ' + new Date().toLocaleString('vi-VN'),
            html: `
                <h2>🦐 SHRIMP TECH - SMTP Test Email</h2>
                <p>✅ Email configuration is working correctly!</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            `
        });
        console.log('✅ Test email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Test email failed:', error);
    }
}

testEmail();