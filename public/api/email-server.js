/**
 * Email API Handler - Node.js Backend
 * Xử lý việc gửi email từ form contact và newsletter
 */
require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000', 
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://shrimptech.com',
        'http://localhost',
        'file://'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Email configuration
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password' // App password, not regular password
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Email server connection failed:', error);
    } else {
        console.log('✅ Email Server is ready to take our messages');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        console.log('📧 Processing contact form...', {
            body: req.body,
            headers: req.headers['content-type'],
            origin: req.headers.origin
        });
        
        const { name, email, phone, company, farmType, subject, message, newsletter } = req.body;
        
        // Debug log
        console.log('Extracted data:', { name, email, phone, company, farmType, subject, message, newsletter });
        
        // Validate required fields
        if (!name || !email || !phone || !message) {
            console.log('❌ Missing required fields:', { name: !!name, email: !!email, phone: !!phone, message: !!message });
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format:', email);
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        console.log('✅ Validation passed, preparing email...');

        // Prepare email content
        const emailContent = prepareContactEmail({
            name, email, phone, company, farmType, subject, message, newsletter
        });

        console.log('📤 Sending email to admin...');
        // Send email to admin
        await transporter.sendMail(emailContent.toAdmin);
        console.log('✅ Admin notification sent');

        // Send confirmation email to customer
        try {
            const confirmationEmail = prepareConfirmationEmail(email, name);
            console.log('📤 Sending confirmation to customer...');
            await transporter.sendMail(confirmationEmail);
            console.log('✅ Customer confirmation sent');
        } catch (confirmError) {
            console.warn('⚠️ Customer confirmation failed:', confirmError.message);
            // Don't fail the whole process if confirmation fails
        }

        console.log('🎉 Contact form processed successfully');
        res.json({
            success: true,
            message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
        });
    }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
    try {
        console.log('📬 Processing newsletter subscription...', req.body);
        
        const { email } = req.body;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        // Prepare newsletter email
        const newsletterEmail = prepareNewsletterEmail(email);
        
        // Send notification to admin
        await transporter.sendMail(newsletterEmail);
        console.log('✅ Newsletter notification sent');

        res.json({
            success: true,
            message: 'Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những tin tức mới nhất về dự án.'
        });

    } catch (error) {
        console.error('❌ Newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
        });
    }
});

// Test endpoint
app.post('/api/test-email', async (req, res) => {
    try {
        const testEmail = {
            from: emailConfig.auth.user,
            to: emailConfig.auth.user,
            subject: '[SHRIMPTECH] Test Email',
            html: `
                <h2>🧪 Test Email</h2>
                <p>This is a test email from SHRIMPTECH system.</p>
                <p>Time: ${new Date().toLocaleString('vi-VN')}</p>
            `
        };

        await transporter.sendMail(testEmail);
        
        res.json({
            success: true,
            message: 'Test email sent successfully!'
        });
    } catch (error) {
        console.error('❌ Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Test email failed: ' + error.message
        });
    }
});

// Health check endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'SHRIMPTECH Email API'
    });
});

// Helper functions
function prepareContactEmail(data) {
    const subject = `[SHRIMPTECH] Liên hệ mới từ ${data.name}`;
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
                <p style="color: #e6f2ff; margin: 5px 0 0 0;">Liên hệ mới từ website</p>
            </div>
            
            <div style="padding: 30px 20px;">
                <h2 style="color: #0066cc; margin-bottom: 20px;">📞 Thông tin liên hệ</h2>
                
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
                        ${data.company ? `<tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">🏢 Công ty:</td>
                            <td style="padding: 8px 0; color: #666;">${data.company}</td>
                        </tr>` : ''}
                        ${data.farmType ? `<tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">🔷 Loại ao:</td>
                            <td style="padding: 8px 0; color: #666;">${getFarmTypeText(data.farmType)}</td>
                        </tr>` : ''}
                        ${data.subject ? `<tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #333;">📋 Chủ đề:</td>
                            <td style="padding: 8px 0; color: #666;">${getSubjectText(data.subject)}</td>
                        </tr>` : ''}
                    </table>
                </div>
                
                <h3 style="color: #0066cc; margin-bottom: 15px;">💬 Nội dung tin nhắn</h3>
                <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc;">
                    <p style="margin: 0; line-height: 1.6; color: #333;">${data.message.replace(/\n/g, '<br>')}</p>
                </div>
                
                ${data.newsletter ? `
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0; color: #2d5a2d;">✅ Khách hàng đã đăng ký nhận tin tức dự án</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #888; font-size: 14px;">
                        📅 Thời gian: ${new Date().toLocaleString('vi-VN')}<br>
                        🌐 Nguồn: Website SHRIMPTECH
                    </p>
                </div>
            </div>
        </div>
    `;

    return {
        toAdmin: {
            from: emailConfig.auth.user,
            to: 'shrimptech.vhu.hutech@gmail.com',
            subject: subject,
            html: htmlContent,
            replyTo: data.email
        }
    };
}

function prepareConfirmationEmail(customerEmail, customerName) {
    const subject = 'Cảm ơn bạn đã liên hệ với SHRIMPTECH!';
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
                <p style="color: #e6f2ff; margin: 5px 0 0 0;">Hệ thống IoT thông minh cho nuôi tôm</p>
            </div>
            
            <div style="padding: 30px 20px;">
                <h2 style="color: #0066cc; margin-bottom: 20px;">Xin chào ${customerName}! 👋</h2>
                
                <p style="color: #333; line-height: 1.6;">
                    Cảm ơn bạn đã quan tâm và liên hệ với dự án <strong>SHRIMPTECH</strong>!
                </p>
                
                <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc; margin: 20px 0;">
                    <p style="margin: 0; color: #333;">
                        ✅ Chúng tôi đã nhận được thông tin liên hệ của bạn<br>
                        ⏰ Đội ngũ kỹ thuật sẽ phản hồi trong vòng <strong>24 giờ</strong><br>
                        📱 Hotline hỗ trợ: <strong>0835749407</strong> hoặc <strong>0826529739</strong>
                    </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666;">
                        📧 Email: shrimptech.vhu.hutech@gmail.com<br>
                        📱 Hotline: 0835749407 - 0826529739<br>
                        🏫 VHU & HUTECH, TP.HCM
                    </p>
                </div>
            </div>
        </div>
    `;

    return {
        from: emailConfig.auth.user,
        to: customerEmail,
        subject: subject,
        html: htmlContent
    };
}

function prepareNewsletterEmail(email) {
    const subject = '[SHRIMPTECH] Đăng ký newsletter mới';
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
                <p style="color: #e6f2ff; margin: 5px 0 0 0;">Đăng ký newsletter mới</p>
            </div>
            
            <div style="padding: 30px 20px;">
                <h2 style="color: #0066cc; margin-bottom: 20px;">📧 Đăng ký newsletter</h2>
                
                <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 18px; color: #333;">
                        Email: <strong style="color: #0066cc;">${email}</strong>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #888; font-size: 14px;">
                        📅 Thời gian đăng ký: ${new Date().toLocaleString('vi-VN')}
                    </p>
                </div>
            </div>
        </div>
    `;

    return {
        from: emailConfig.auth.user,
        to: 'shrimptech.vhu.hutech@gmail.com',
        subject: subject,
        html: htmlContent
    };
}

function getFarmTypeText(farmType) {
    const types = {
        'pond-small': 'Ao tròn nổi (50-700m²)',
        'pond-medium': 'Ao lót bạt đáy (700–1.000m²)',
        'pond-large': 'Ao siêu thâm canh tổng hợp (1.000–3.000m² mỗi ao)',
        'research': 'Nghiên cứu/Học thuật',
        'other': 'Khác'
    };
    return types[farmType] || farmType;
}

function getSubjectText(subject) {
    const subjects = {
        'product-info': 'Thông tin sản phẩm',
        'consultation': 'Tư vấn hệ thống',
        'technical': 'Tư vấn kỹ thuật',
        'installation': 'Lắp đặt & bảo trì',
        'partnership': 'Hợp tác đại lý',
        'research': 'Hợp tác nghiên cứu',
        'other': 'Khác'
    };
    return subjects[subject] || subject;
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 SHRIMPTECH Email API server running on port ${PORT}`);
    console.log(`🌐 Available at: http://localhost:${PORT}`);
    console.log(`📧 Email system ready for: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
