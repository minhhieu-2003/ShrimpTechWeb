const nodemailer = require('nodemailer');
const cors = require('cors');

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5500',
        'https://shrimp-tech2-lhohw9gzp-tranminh-hieus-projects.vercel.app',
        'https://shrimptech2.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Email configuration
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Configuration Error:', error);
    } else {
        console.log('✅ SMTP Server ready to send emails');
    }
});

// Email templates
const emailTemplates = {
    // Customer confirmation email
    customerConfirmation: (data) => ({
        subject: '🦐 Cảm ơn bạn đã liên hệ SHRIMP TECH - Xác nhận đã nhận thông tin',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #00b4d8, #0077b6); padding: 30px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #00b4d8; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
                .shrimp-emoji { font-size: 24px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="shrimp-emoji">🦐</div>
                    <h1>SHRIMP TECH</h1>
                    <p>Công nghệ IoT thông minh cho nuôi tôm</p>
                </div>
                <div class="content">
                    <h2>Xin chào ${data.name}!</h2>
                    <p>Cảm ơn bạn đã quan tâm và liên hệ với SHRIMP TECH. Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>👤 Họ tên:</strong><br>${data.name}
                        </div>
                        <div class="info-item">
                            <strong>📧 Email:</strong><br>${data.email}
                        </div>
                        <div class="info-item">
                            <strong>📱 Điện thoại:</strong><br>${data.phone}
                        </div>
                        <div class="info-item">
                            <strong>🏢 Công ty:</strong><br>${data.company || 'Không có'}
                        </div>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <strong>💬 Nội dung tin nhắn:</strong><br>
                        ${data.message}
                    </div>
                    
                    <p><strong>📞 Liên hệ khẩn cấp:</strong></p>
                    <ul>
                        <li>Hotline 1: <strong>0835 749 407</strong></li>
                        <li>Hotline 2: <strong>0826 529 739</strong></li>
                        <li>Email: <strong>shrimptech.vhu.hutech@gmail.com</strong></li>
                    </ul>
                </div>
                <div class="footer">
                    <p>© 2025 SHRIMP TECH - Nâng tầm ngành nuôi tôm Việt Nam với công nghệ IoT</p>
                    <p>🌐 Website: <a href="https://shrimptech.com">shrimptech.com</a></p>
                </div>
            </div>
        </body>
        </html>
        `
    }),

    // Admin notification email
    adminNotification: (data) => ({
        subject: `🚨 [SHRIMP TECH] Liên hệ mới từ ${data.name} - ${data.email}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); padding: 20px; text-align: center; color: white; }
                .content { padding: 30px; }
                .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .customer-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .actions { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 LIÊN HỆ MỚI - SHRIMP TECH</h1>
                    <p>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
                </div>
                <div class="content">
                    <div class="urgent">
                        <strong>⚡ THÔNG TIN KHÁCH HÀNG MỚI</strong><br>
                        Vui lòng phản hồi trong vòng 2 giờ để đảm bảo chất lượng dịch vụ.
                    </div>
                    
                    <div class="customer-info">
                        <h3>👤 Thông tin liên hệ:</h3>
                        <p><strong>Họ tên:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        <p><strong>Điện thoại:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                        <p><strong>Công ty:</strong> ${data.company || 'Không có thông tin'}</p>
                        <p><strong>Nguồn:</strong> ${data.source || 'Website'}</p>
                    </div>
                    
                    <div style="background: #f1f3f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>💬 Nội dung tin nhắn:</h3>
                        <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00b4d8;">${data.message}</p>
                    </div>
                    
                    <div class="actions">
                        <h3>🎯 Hành động cần thực hiện:</h3>
                        <ul>
                            <li>✅ Phản hồi email khách hàng</li>
                            <li>📞 Gọi điện tư vấn (nếu cần)</li>
                            <li>📝 Cập nhật CRM system</li>
                            <li>📊 Phân tích nhu cầu khách hàng</li>
                        </ul>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `
    })
};

// Main handler function
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { name, email, phone, company, message, source } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Tin nhắn)'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        // Phone validation (Vietnamese format)
        const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
        if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại không hợp lệ'
            });
        }

        const contactData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : '',
            company: company ? company.trim() : '',
            message: message.trim(),
            source: source || 'Website',
            timestamp: new Date().toISOString()
        };

        // Send customer confirmation email
        const customerEmail = emailTemplates.customerConfirmation(contactData);
        await transporter.sendMail({
            from: `"SHRIMP TECH Support" <${emailConfig.auth.user}>`,
            to: contactData.email,
            subject: customerEmail.subject,
            html: customerEmail.html
        });

        // Send admin notification email
        const adminEmail = emailTemplates.adminNotification(contactData);
        await transporter.sendMail({
            from: `"SHRIMP TECH System" <${emailConfig.auth.user}>`,
            to: emailConfig.auth.user,
            subject: adminEmail.subject,
            html: adminEmail.html
        });

        console.log('✅ Emails sent successfully:', {
            customer: contactData.email,
            admin: emailConfig.auth.user,
            timestamp: new Date().toISOString()
        });

        // Success response
        return res.status(200).json({
            success: true,
            message: '🦐 Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
            data: {
                name: contactData.name,
                email: contactData.email,
                timestamp: contactData.timestamp
            }
        });

    } catch (error) {
        console.error('❌ Email sending error:', error);

        // Return appropriate error response
        if (error.code === 'EAUTH') {
            return res.status(500).json({
                success: false,
                message: 'Lỗi xác thực email. Vui lòng thử lại sau.',
                error: 'Authentication failed'
            });
        }

        if (error.code === 'ECONNECTION') {
            return res.status(500).json({
                success: false,
                message: 'Lỗi kết nối email server. Vui lòng thử lại sau.',
                error: 'Connection failed'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.',
            error: error.message
        });
    }
};

// Health check endpoint
module.exports.health = async (req, res) => {
    try {
        await transporter.verify();
        return res.status(200).json({
            success: true,
            message: 'Email service is healthy',
            smtp: {
                host: emailConfig.host,
                port: emailConfig.port,
                secure: emailConfig.secure
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Email service is down',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};