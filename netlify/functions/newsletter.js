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

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const { email } = JSON.parse(event.body);
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Email không hợp lệ'
                })
            };
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

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những tin tức mới nhất về dự án.'
            })
        };

    } catch (error) {
        console.error('Newsletter error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
            })
        };
    }
};
