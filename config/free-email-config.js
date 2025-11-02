const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Free Email Service Configuration
 * Supports multiple free email providers:
 * 1. Brevo (Sendinblue) - 300 emails/day
 * 2. Mailjet - 200 emails/day  
 * 3. Gmail SMTP - 100-500 emails/day
 * 4. Mailgun - 5000 emails/month (first month)
 */

// Email provider configurations
const emailProviders = {
    // Brevo (Sendinblue) - Recommended free option
    brevo: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER || '', // Your Brevo SMTP login
            pass: process.env.BREVO_PASS || ''  // Your Brevo SMTP password
        }
    },
    
    // Mailjet - Alternative free option
    mailjet: {
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILJET_API_KEY || '',    // Mailjet API Key
            pass: process.env.MAILJET_SECRET_KEY || ''  // Mailjet Secret Key
        }
    },
    
    // Gmail SMTP - Fallback option
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER || 'shrimptech.vhu.hutech@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD
        }
    },
    
    // Mailgun SMTP
    mailgun: {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILGUN_SMTP_USER || '',
            pass: process.env.MAILGUN_SMTP_PASS || ''
        }
    }
};

// Create transporter with fallback support
const createFreeEmailTransporter = () => {
    // Determine which provider to use based on environment variables
    let provider = 'gmail'; // Default fallback
    
    if (process.env.BREVO_USER && process.env.BREVO_PASS) {
        provider = 'brevo';
        console.log('📧 Using Brevo (Sendinblue) SMTP');
    } else if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
        provider = 'mailjet';
        console.log('📧 Using Mailjet SMTP');
    } else if (process.env.MAILGUN_SMTP_USER && process.env.MAILGUN_SMTP_PASS) {
        provider = 'mailgun';
        console.log('📧 Using Mailgun SMTP');
    } else {
        console.log('📧 Using Gmail SMTP (fallback)');
    }
    
    const config = emailProviders[provider];
    
    return nodemailer.createTransport({
        ...config,
        // Enhanced settings for better deliverability
        tls: {
            rejectUnauthorized: false
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
    });
};

// Create beautiful HTML email template
const createContactEmailHTML = (formData, clientIP) => {
    const { name, email, phone, company, farmType, subject, message, newsletter } = formData;
    
    // Convert codes to readable text
    const farmTypeText = {
        'pond-small': 'Ao tròn nổi (50-700m²)',
        'pond-medium': 'Ao lót bạt đáy (700–1.000m²)',
        'pond-large': 'Ao siêu thâm canh tổng hợp (1.000–3.000m² mỗi ao)',
        'research': 'Nghiên cứu/Học thuật',
        'other': 'Khác'
    }[farmType] || farmType;
    
    const subjectText = {
        'product-info': 'Thông tin sản phẩm',
        'consultation': 'Tư vấn hệ thống',
        'technical': 'Tư vấn kỹ thuật',
        'installation': 'Lắp đặt & bảo trì',
        'partnership': 'Hợp tác đại lý',
        'research': 'Hợp tác nghiên cứu',
        'other': 'Khác'
    }[subject] || subject;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SHRIMPTECH - Liên hệ mới</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🦐 SHRIMPTECH</h1>
                    <p style="color: #cce6ff; margin: 10px 0 0; font-size: 16px;">Công nghệ nuôi tôm thông minh</p>
                </div>
                
                <!-- Alert Badge -->
                <div style="background: #ff6b35; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 18px;">
                    🔔 LIÊN HỆ MỚI TỪ WEBSITE
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <h2 style="color: #0066cc; margin-top: 0; border-bottom: 2px solid #e6f3ff; padding-bottom: 10px;">
                        📋 Thông tin khách hàng
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold; width: 30%;">👤 Họ tên:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">📧 Email:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">📱 Điện thoại:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="tel:${phone}" style="color: #0066cc; text-decoration: none;">${phone}</a></td>
                        </tr>
                        ${company ? `
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">🏢 Công ty:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${company}</td>
                        </tr>` : ''}
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">🐟 Loại ao:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${farmTypeText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">📝 Chủ đề:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${subjectText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">📬 Newsletter:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${newsletter ? '✅ Có đăng ký' : '❌ Không đăng ký'}</td>
                        </tr>
                    </table>
                    
                    <h3 style="color: #0066cc; margin-bottom: 15px;">💬 Tin nhắn:</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #0066cc; margin-bottom: 25px; line-height: 1.6;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="mailto:${email}?subject=Re: ${subjectText} - SHRIMPTECH" 
                           style="background: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">
                            ✉️ Trả lời Email
                        </a>
                        <a href="tel:${phone}" 
                           style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">
                            📞 Gọi điện
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">
                        <strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}<br>
                        <strong>IP:</strong> ${clientIP}<br>
                        <strong>Nguồn:</strong> Website ShrimpTech.vn
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Create confirmation email for customer
const createConfirmationEmailHTML = (formData) => {
    const { name } = formData;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SHRIMPTECH - Xác nhận liên hệ</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🦐 SHRIMPTECH</h1>
                    <p style="color: #cce6ff; margin: 10px 0 0; font-size: 16px;">Công nghệ nuôi tôm thông minh</p>
                </div>
                
                <!-- Success Badge -->
                <div style="background: #28a745; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 18px;">
                    ✅ LIÊN HỆ THÀNH CÔNG
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <h2 style="color: #0066cc; margin-top: 0;">Xin chào ${name}!</h2>
                    <p style="line-height: 1.6; font-size: 16px;">
                        Cảm ơn bạn đã liên hệ với <strong>SHRIMPTECH</strong>. Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong vòng <strong>24 giờ</strong>.
                    </p>
                    
                    <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">📞 Liên hệ khẩn cấp:</h3>
                        <p style="margin: 10px 0; font-size: 16px;">
                            <strong>Hotline:</strong> <a href="tel:0835749407" style="color: #0066cc;">0835749407</a> | <a href="tel:0826529739" style="color: #0066cc;">0826529739</a><br>
                            <strong>Email:</strong> <a href="mailto:shrimptech.vhu.hutech@gmail.com" style="color: #0066cc;">shrimptech.vhu.hutech@gmail.com</a>
                        </p>
                    </div>
                    
                    <p style="line-height: 1.6; font-size: 16px;">
                        Trong thời gian chờ đợi, bạn có thể tìm hiểu thêm về các sản phẩm và dịch vụ của chúng tôi tại website.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://shrimptech.vn" 
                           style="background: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            🌐 Truy cập Website
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">
                        © 2024 SHRIMPTECH - Công nghệ nuôi tôm thông minh<br>
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Create contact email object
const createContactEmail = (formData, clientIP) => {
    const { name, email, subject } = formData;
    
    const subjectText = {
        'product-info': 'Thông tin sản phẩm',
        'consultation': 'Tư vấn hệ thống',
        'technical': 'Tư vấn kỹ thuật',
        'installation': 'Lắp đặt & bảo trì',
        'partnership': 'Hợp tác đại lý',
        'research': 'Hợp tác nghiên cứu',
        'other': 'Khác'
    }[subject] || subject;
    
    return {
        from: {
            name: 'SHRIMPTECH Contact System',
            address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'shrimptech.vhu.hutech@gmail.com'
        },
        to: process.env.ADMIN_EMAIL || 'shrimptech.vhu.hutech@gmail.com',
        replyTo: {
            name: name,
            address: email
        },
        subject: `🦐 SHRIMPTECH - Liên hệ mới: ${name} (${subjectText})`,
        html: createContactEmailHTML(formData, clientIP),
        headers: {
            'Message-ID': `<contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@shrimptech.vn>`,
            'X-Mailer': 'SHRIMPTECH Contact System v3.0',
            'X-Priority': '2',
            'Importance': 'High'
        }
    };
};

// Create confirmation email object
const createConfirmationEmail = (formData) => {
    const { name, email } = formData;
    
    return {
        from: {
            name: 'SHRIMPTECH',
            address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'shrimptech.vhu.hutech@gmail.com'
        },
        to: email,
        subject: '✅ SHRIMPTECH - Xác nhận liên hệ thành công',
        html: createConfirmationEmailHTML(formData),
        headers: {
            'Message-ID': `<confirmation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@shrimptech.vn>`,
            'X-Mailer': 'SHRIMPTECH Confirmation System v3.0'
        }
    };
};

// Newsletter email
const createNewsletterEmail = (email) => {
    return {
        from: {
            name: 'SHRIMPTECH Newsletter',
            address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'shrimptech.vhu.hutech@gmail.com'
        },
        to: process.env.ADMIN_EMAIL || 'shrimptech.vhu.hutech@gmail.com',
        subject: '🦐 SHRIMPTECH - Đăng ký Newsletter mới',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">🦐 SHRIMPTECH Newsletter</h2>
                </div>
                <div style="background: white; padding: 20px; border: 1px solid #dee2e6;">
                    <h3 style="color: #0066cc;">📬 Đăng ký Newsletter mới</h3>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0066cc;">${email}</a></p>
                    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
                    <p><strong>Nguồn:</strong> Website Newsletter Form</p>
                </div>
            </div>
        `,
        headers: {
            'Message-ID': `<newsletter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@shrimptech.vn>`,
            'X-Mailer': 'SHRIMPTECH Newsletter System v3.0'
        }
    };
};

module.exports = {
    createFreeEmailTransporter,
    createContactEmail,
    createConfirmationEmail,
    createNewsletterEmail,
    emailProviders
};
