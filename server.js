const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: [
        'https://shrimptech.vn',
        'https://www.shrimptech.vn', 
        'https://shrimptech-web.web.app',
        'https://shrimptech-web.firebaseapp.com',
        'http://localhost:3000',
        'http://localhost:5500'
    ],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Email configuration
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || 'dcnruttjfxapqdyb'
    }
};

const transporter = nodemailer.createTransport(emailConfig);

// Contact endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, company, farmType, subject, message, newsletter } = req.body;
        
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        const emailContent = {
            from: emailConfig.auth.user,
            to: 'shrimptech.vhu.hutech@gmail.com',
            subject: `[SHRIMPTECH] Liên hệ mới từ ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🦐 SHRIMPTECH</h1>
                        <p style="color: #e6f2ff;">Liên hệ mới từ website</p>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Họ tên:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Điện thoại:</strong> ${phone}</p>
                        <p><strong>Công ty:</strong> ${company || 'Không có'}</p>
                        <p><strong>Nội dung:</strong><br>${message.replace(/\n/g, '<br>')}</p>
                        <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    </div>
                </div>
            `,
            replyTo: email
        };

        await transporter.sendMail(emailContent);

        res.json({
            success: true,
            message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
        });
    }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        const newsletterEmail = {
            from: emailConfig.auth.user,
            to: 'shrimptech.vhu.hutech@gmail.com',
            subject: '[SHRIMPTECH] Đăng ký newsletter mới',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>🦐 SHRIMPTECH - Đăng ký newsletter</h2>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                </div>
            `
        };

        await transporter.sendMail(newsletterEmail);

        res.json({
            success: true,
            message: 'Cảm ơn bạn đã đăng ký!'
        });

    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đăng ký.'
        });
    }
});

// Health check
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'SHRIMPTECH Production API'
    });
});

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/contact.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 SHRIMPTECH Production API running on port ${PORT}`);
});

module.exports = app;
