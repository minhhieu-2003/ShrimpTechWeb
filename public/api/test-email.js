/**
 * Test Email Functionality
 * Run this file to test email sending capabilities
 */
const nodemailer = require('nodemailer');
require('dotenv').config();

const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
    }
};

async function testEmail() {
    console.log('🧪 Testing SHRIMPTECH Email System...');
    console.log('Configuration:', {
        host: emailConfig.host,
        port: emailConfig.port,
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass ? '***configured***' : '***NOT SET***'
    });

    try {
        // Create transporter
        const transporter = nodemailer.createTransport(emailConfig);

        // Verify connection
        console.log('🔗 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        // Test email content
        const testEmail = {
            from: emailConfig.auth.user,
            to: emailConfig.auth.user, // Send to self for testing
            subject: '[SHRIMPTECH] 🧪 Test Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
                        <p style="color: #e6f2ff; margin: 5px 0 0 0;">Email System Test</p>
                    </div>
                    
                    <div style="padding: 30px 20px;">
                        <h2 style="color: #0066cc;">🧪 Test Email</h2>
                        <p>This is a test email from the SHRIMPTECH email system.</p>
                        
                        <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #333;">
                                ✅ Email system is working correctly<br>
                                📅 Test time: ${new Date().toLocaleString('vi-VN')}<br>
                                🌐 From: SHRIMPTECH Website API
                            </p>
                        </div>
                        
                        <p>If you received this email, the email system is configured correctly!</p>
                    </div>
                    
                    <div style="background: #f8f9ff; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            SHRIMPTECH - IoT System for Smart Shrimp Farming
                        </p>
                    </div>
                </div>
            `,
            text: `
SHRIMPTECH Email System Test

This is a test email from the SHRIMPTECH email system.

✅ Email system is working correctly
📅 Test time: ${new Date().toLocaleString('vi-VN')}
🌐 From: SHRIMPTECH Website API

If you received this email, the email system is configured correctly!

SHRIMPTECH - IoT System for Smart Shrimp Farming
            `
        };

        // Send test email
        console.log('📧 Sending test email...');
        const result = await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', result.messageId);
        console.log('📬 Check your inbox:', emailConfig.auth.user);

        // Test contact form email
        console.log('\n🧪 Testing contact form email...');
        const contactTestData = {
            name: 'Nguyễn Văn A',
            email: 'test@example.com',
            phone: '0835749407',
            company: 'Trang trại tôm ABC',
            farmType: 'pond-large',
            subject: 'technical',
            message: 'Tôi muốn tư vấn về hệ thống IoT cho trang trại tôm của mình. Diện tích khoảng 2 hecta với 10 ao nuôi.',
            newsletter: true
        };

        const contactEmail = prepareContactEmail(contactTestData);
        await transporter.sendMail(contactEmail);
        console.log('✅ Contact form test email sent!');

        console.log('\n🎉 All email tests passed successfully!');
        console.log('📋 Next steps:');
        console.log('   1. Check your email inbox');
        console.log('   2. Start the API server: npm start');
        console.log('   3. Test from the website form');
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your .env file configuration');
        console.log('   2. Make sure you\'re using an App Password, not your regular Gmail password');
        console.log('   3. Enable 2-factor authentication on Gmail');
        console.log('   4. Generate App Password: https://myaccount.google.com/apppasswords');
    }
}

// Helper function to prepare contact email (same as in main server)
function prepareContactEmail(data) {
    const subject = `[SHRIMPTECH] Liên hệ test từ ${data.name}`;
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
                <p style="color: #e6f2ff; margin: 5px 0 0 0;">Test Contact Form</p>
            </div>
            
            <div style="padding: 30px 20px;">
                <h2 style="color: #0066cc; margin-bottom: 20px;">📞 Thông tin liên hệ (TEST)</h2>
                
                <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333; width: 140px;">👤 Họ và tên:</td>
                            <td style="padding: 8px 0; color: #666;">${data.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">📧 Email:</td>
                            <td style="padding: 8px 0; color: #666;">${data.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">📱 Điện thoại:</td>
                            <td style="padding: 8px 0; color: #666;">${data.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">🏢 Công ty:</td>
                            <td style="padding: 8px 0; color: #666;">${data.company}</td>
                        </tr>
                    </table>
                </div>
                
                <h3 style="color: #0066cc; margin-bottom: 15px;">💬 Nội dung tin nhắn</h3>
                <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc;">
                    <p style="margin: 0; line-height: 1.6; color: #333;">${data.message}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0; color: #2d5a2d;">🧪 Đây là email test - hệ thống hoạt động bình thường!</p>
                </div>
            </div>
        </div>
    `;

    return {
        from: emailConfig.auth.user,
        to: emailConfig.auth.user,
        subject: subject,
        html: htmlContent
    };
}

// Run the test
if (require.main === module) {
    testEmail();
}

module.exports = testEmail;
