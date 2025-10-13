/**
 * Email Template Optimizer & Validator
 * Tối ưu hóa và kiểm tra email templates cho ShrimpTech
 */

class EmailTemplateOptimizer {
    constructor() {
        this.templateChecks = [];
        this.optimizationSuggestions = [];
        
        // Load template configurations
        this.templates = {
            contact: {
                id: 'template_contact',
                purpose: 'Contact form submission to admin',
                requiredFields: ['from_name', 'from_email', 'message', 'phone', 'company'],
                optionalFields: ['farm_type', 'subject_type', 'newsletter']
            },
            confirmation: {
                id: 'template_shrimptech_confirm',
                purpose: 'Auto-confirmation email to user',
                requiredFields: ['user_name', 'user_email', 'submission_time'],
                optionalFields: ['user_phone', 'user_company', 'confirmation_message']
            },
            followUp: {
                id: 'template_shrimptech_followup',
                purpose: 'Follow-up email after initial contact',
                requiredFields: ['user_name', 'user_email', 'follow_up_message'],
                optionalFields: ['previous_contact_date', 'next_steps']
            },
            newsletter: {
                id: 'template_shrimptech_newsletter',
                purpose: 'Newsletter subscription confirmation',
                requiredFields: ['subscriber_name', 'subscriber_email'],
                optionalFields: ['subscription_date', 'newsletter_type']
            }
        };
    }
    
    /**
     * Validate template structure
     */
    validateTemplateStructure(templateName) {
        const template = this.templates[templateName];
        if (!template) {
            this.templateChecks.push({
                template: templateName,
                check: 'Structure',
                status: 'error',
                message: `❌ Template '${templateName}' not found in configuration`
            });
            return false;
        }
        
        // Check template ID format
        const idValid = /^template_[a-z_]+$/.test(template.id);
        this.templateChecks.push({
            template: templateName,
            check: 'ID Format',
            status: idValid ? 'success' : 'error',
            message: idValid ? 
                `✅ Template ID '${template.id}' has valid format` :
                `❌ Template ID '${template.id}' has invalid format`
        });
        
        // Check required fields
        const hasRequiredFields = template.requiredFields && template.requiredFields.length > 0;
        this.templateChecks.push({
            template: templateName,
            check: 'Required Fields',
            status: hasRequiredFields ? 'success' : 'warning',
            message: hasRequiredFields ?
                `✅ Has ${template.requiredFields.length} required fields` :
                `⚠️ No required fields defined`
        });
        
        return idValid && hasRequiredFields;
    }
    
    /**
     * Check template content optimization
     */
    analyzeTemplateContent(templateName) {
        const template = this.templates[templateName];
        
        // Check for common email best practices
        const optimizations = [];
        
        // Mobile responsiveness check
        optimizations.push({
            category: 'Mobile Responsive',
            priority: 'high',
            suggestion: 'Ensure template uses responsive design with max-width: 600px',
            implementation: 'Use media queries and flexible layouts'
        });
        
        // Subject line optimization
        optimizations.push({
            category: 'Subject Line',
            priority: 'high',
            suggestion: 'Keep subject line under 50 characters for better mobile display',
            implementation: 'Test subject line length and preview text'
        });
        
        // Personalization
        optimizations.push({
            category: 'Personalization',
            priority: 'medium',
            suggestion: 'Use dynamic fields like {{user_name}} for better engagement',
            implementation: `Include fields: ${template.requiredFields.join(', ')}`
        });
        
        // Call-to-action
        if (templateName === 'confirmation') {
            optimizations.push({
                category: 'Call-to-Action',
                priority: 'medium',
                suggestion: 'Include clear next steps and contact information',
                implementation: 'Add prominent buttons and contact details'
            });
        }
        
        // Branding consistency
        optimizations.push({
            category: 'Branding',
            priority: 'medium',
            suggestion: 'Maintain consistent ShrimpTech branding and colors',
            implementation: 'Use brand colors: #0066cc, #004499, #28a745'
        });
        
        this.optimizationSuggestions.push({
            template: templateName,
            optimizations: optimizations
        });
        
        return optimizations;
    }
    
    /**
     * Generate improved template structure
     */
    generateOptimizedTemplate(templateName) {
        const template = this.templates[templateName];
        
        let optimizedHTML = '';
        
        switch (templateName) {
            case 'contact':
                optimizedHTML = this.generateContactTemplate();
                break;
            case 'confirmation':
                optimizedHTML = this.generateConfirmationTemplate();
                break;
            case 'followUp':
                optimizedHTML = this.generateFollowUpTemplate();
                break;
            case 'newsletter':
                optimizedHTML = this.generateNewsletterTemplate();
                break;
        }
        
        return {
            templateId: template.id,
            htmlContent: optimizedHTML,
            recommendations: this.optimizationSuggestions.find(s => s.template === templateName)?.optimizations || []
        };
    }
    
    /**
     * Generate optimized contact template
     */
    generateContactTemplate() {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liên hệ mới - ShrimpTech</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
            <p style="color: #cce6ff; margin: 5px 0 0; font-size: 14px;">Liên hệ mới từ website</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <h2 style="color: #0066cc; margin: 0 0 20px; font-size: 20px;">📞 Thông tin liên hệ mới</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; width: 30%;">Tên:</td>
                        <td style="padding: 8px 0; color: #666;">{{from_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
                        <td style="padding: 8px 0; color: #666;">{{from_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Điện thoại:</td>
                        <td style="padding: 8px 0; color: #666;">{{phone}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Công ty:</td>
                        <td style="padding: 8px 0; color: #666;">{{company}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Loại trang trại:</td>
                        <td style="padding: 8px 0; color: #666;">{{farm_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Chủ đề:</td>
                        <td style="padding: 8px 0; color: #666;">{{subject_type}}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #0066cc; margin: 0 0 10px; font-size: 16px;">📝 Nội dung tin nhắn:</h3>
                <div style="background: white; border: 1px solid #dee2e6; padding: 15px; border-radius: 4px; line-height: 1.6;">
                    {{message}}
                </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; font-size: 14px; color: #0066cc;">
                    <strong>Newsletter:</strong> {{newsletter}}
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 12px; color: #666;">
                Email được gửi tự động từ website ShrimpTech<br>
                Thời gian: {{submission_time}}
            </p>
        </div>
    </div>
</body>
</html>`;
    }
    
    /**
     * Generate optimized confirmation template
     */
    generateConfirmationTemplate() {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận liên hệ - ShrimpTech</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🦐 SHRIMPTECH</h1>
            <p style="color: #cce6ff; margin: 10px 0 0; font-size: 16px;">Công nghệ nuôi tôm thông minh</p>
        </div>
        
        <!-- Success Banner -->
        <div style="background: #28a745; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 18px;">
            ✅ LIÊN HỆ THÀNH CÔNG
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
            <h2 style="color: #0066cc; margin-top: 0;">Xin chào {{user_name}}!</h2>
            <p style="line-height: 1.6; font-size: 16px;">
                Cảm ơn bạn đã liên hệ với <strong>SHRIMPTECH</strong>. Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong vòng <strong>24 giờ</strong>.
            </p>
            
            <!-- Contact Info Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0066cc; margin: 0 0 15px; font-size: 18px;">📋 Thông tin đã gửi:</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> {{user_email}}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Thời gian:</strong> {{submission_time}}</p>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0;">
                <h3 style="color: #0066cc; margin: 0 0 10px; font-size: 16px;">🚀 Bước tiếp theo:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.6;">
                    <li>Chúng tôi sẽ xem xét yêu cầu của bạn</li>
                    <li>Liên hệ lại trong vòng 24 giờ làm việc</li>
                    <li>Cung cấp giải pháp phù hợp nhất</li>
                </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://shrimptech.vn" style="display: inline-block; background: #0066cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    🌐 Khám phá thêm về ShrimpTech
                </a>
            </div>
            
            <!-- Contact Info -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin: 0 0 10px; font-size: 16px;">📞 Thông tin liên hệ:</h3>
                <p style="margin: 5px 0; color: #856404;"><strong>Email:</strong> shrimptech.vhu.hutech@gmail.com</p>
                <p style="margin: 5px 0; color: #856404;"><strong>Website:</strong> https://shrimptech.vn</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #666;">
                <strong>ShrimpTech</strong> - Công nghệ nuôi tôm thông minh
            </p>
            <p style="margin: 0; font-size: 12px; color: #999;">
                Email này được gửi tự động. Vui lòng không trả lời email này.
            </p>
        </div>
    </div>
</body>
</html>`;
    }
    
    /**
     * Generate follow-up template
     */
    generateFollowUpTemplate() {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Follow-up - ShrimpTech</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH</h1>
            <p style="color: #cce6ff; margin: 5px 0 0; font-size: 14px;">Follow-up về liên hệ của bạn</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <h2 style="color: #0066cc; margin-top: 0;">Xin chào {{user_name}}!</h2>
            
            <div style="line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                {{follow_up_message}}
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:shrimptech.vhu.hutech@gmail.com" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    📧 Phản hồi ngay
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 12px; color: #666;">
                ShrimpTech - Công nghệ nuôi tôm thông minh
            </p>
        </div>
    </div>
</body>
</html>`;
    }
    
    /**
     * Generate newsletter template
     */
    generateNewsletterTemplate() {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter - ShrimpTech</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🦐 SHRIMPTECH NEWSLETTER</h1>
            <p style="color: #cce6ff; margin: 5px 0 0; font-size: 14px;">Cập nhật công nghệ nuôi tôm</p>
        </div>
        
        <!-- Success Banner -->
        <div style="background: #28a745; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 16px;">
            ✅ ĐĂNG KÝ THÀNH CÔNG
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <h2 style="color: #0066cc; margin-top: 0;">Chào mừng {{subscriber_name}}!</h2>
            <p style="line-height: 1.6; font-size: 16px;">
                Cảm ơn bạn đã đăng ký nhận bản tin từ <strong>ShrimpTech</strong>. 
                Bạn sẽ nhận được những cập nhật mới nhất về công nghệ nuôi tôm thông minh.
            </p>
            
            <!-- Benefits -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0066cc; margin: 0 0 15px;">📬 Bạn sẽ nhận được:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                    <li>Tin tức công nghệ mới nhất</li>
                    <li>Hướng dẫn kỹ thuật nuôi tôm</li>
                    <li>Cập nhật sản phẩm và dịch vụ</li>
                    <li>Ưu đãi dành riêng cho khách hàng</li>
                </ul>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 12px; color: #666;">
                ShrimpTech - Đăng ký ngày: {{subscription_date}}
            </p>
        </div>
    </div>
</body>
</html>`;
    }
    
    /**
     * Run comprehensive template optimization
     */
    async runTemplateOptimization() {
        console.log('🎨 Starting Email Template Optimization...\n');
        console.log('=' .repeat(60));
        
        // Reset results
        this.templateChecks = [];
        this.optimizationSuggestions = [];
        
        // Analyze all templates
        Object.keys(this.templates).forEach(templateName => {
            console.log(`\n📋 Analyzing template: ${templateName}`);
            this.validateTemplateStructure(templateName);
            this.analyzeTemplateContent(templateName);
        });
        
        // Display results
        this.displayOptimizationResults();
        
        return this.getOptimizationSummary();
    }
    
    /**
     * Display optimization results
     */
    displayOptimizationResults() {
        console.log('\n📊 Template Optimization Results:');
        console.log('=' .repeat(60));
        
        // Group checks by template
        const templateGroups = {};
        this.templateChecks.forEach(check => {
            if (!templateGroups[check.template]) {
                templateGroups[check.template] = [];
            }
            templateGroups[check.template].push(check);
        });
        
        Object.entries(templateGroups).forEach(([template, checks]) => {
            console.log(`\n${template.toUpperCase()} Template:`);
            console.log('-'.repeat(30));
            
            checks.forEach(check => {
                console.log(`${check.message}`);
                console.log(`   Check: ${check.check}`);
                console.log('');
            });
        });
        
        // Display optimization suggestions
        console.log('\n🚀 Optimization Suggestions:');
        console.log('=' .repeat(60));
        
        this.optimizationSuggestions.forEach(suggestion => {
            console.log(`\n${suggestion.template.toUpperCase()} Template Optimizations:`);
            console.log('-'.repeat(30));
            
            suggestion.optimizations.forEach(opt => {
                console.log(`📌 ${opt.category} (Priority: ${opt.priority})`);
                console.log(`   Suggestion: ${opt.suggestion}`);
                console.log(`   Implementation: ${opt.implementation}`);
                console.log('');
            });
        });
    }
    
    /**
     * Get optimization summary
     */
    getOptimizationSummary() {
        const totalChecks = this.templateChecks.length;
        const successChecks = this.templateChecks.filter(c => c.status === 'success').length;
        const totalSuggestions = this.optimizationSuggestions.reduce((sum, s) => sum + s.optimizations.length, 0);
        
        return {
            templates_analyzed: Object.keys(this.templates).length,
            total_checks: totalChecks,
            successful_checks: successChecks,
            check_success_rate: totalChecks > 0 ? ((successChecks / totalChecks) * 100).toFixed(1) : 0,
            total_suggestions: totalSuggestions,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Export optimized templates
     */
    exportOptimizedTemplates() {
        const optimizedTemplates = {};
        
        Object.keys(this.templates).forEach(templateName => {
            optimizedTemplates[templateName] = this.generateOptimizedTemplate(templateName);
        });
        
        const report = {
            timestamp: new Date().toISOString(),
            optimization_summary: this.getOptimizationSummary(),
            template_checks: this.templateChecks,
            optimization_suggestions: this.optimizationSuggestions,
            optimized_templates: optimizedTemplates
        };
        
        console.log('📤 Exporting optimized templates...');
        console.log(JSON.stringify(report, null, 2));
        
        return report;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.EmailTemplateOptimizer = EmailTemplateOptimizer;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailTemplateOptimizer;
}