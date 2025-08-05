const nodemailer = require('nodemailer');

const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || 'dcnruttjfxapqdyb'
    }
};

const transporter = nodemailer.createTransporter(emailConfig);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🦐 SHRIMPTECH</h1>
                        <p style="color: #e6f2ff; margin: 5px 0 0 0;">Đăng ký newsletter mới</p>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(newsletterEmail);

        res.status(200).json({
            success: true,
            message: 'Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những tin tức mới nhất về dự án.'
        });

    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
        });
    }
}
