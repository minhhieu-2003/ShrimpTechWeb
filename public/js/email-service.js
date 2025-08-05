/**
 * Email Service Component
 * Xử lý việc gửi email từ form liên hệ và newsletter
 */
class EmailService {
    constructor() {
        // Detect environment
        this.isProduction = window.location.hostname === 'shrimptech.vn' || 
                           window.location.hostname === 'shrimptech-web.web.app' ||
                           window.location.protocol === 'https:';
        
        // Configure API endpoints based on environment
        if (this.isProduction) {
            this.apiEndpoints = [
                'https://shrimptech-api.railway.app/api',     // Railway deployment
                'https://shrimptech-web.vercel.app/api',      // Vercel deployment  
                'https://shrimptech-web.netlify.app/.netlify/functions', // Netlify functions
                '/api'                                         // Current domain fallback
            ];
        } else {
            this.apiEndpoints = [
                'http://localhost:3002/api',
                'http://localhost:3001/api',
                'http://127.0.0.1:3002/api',
                'http://127.0.0.1:3001/api',
                '/api'
            ];
        }
        
        this.projectEmail = 'shrimptech.vhu.hutech@gmail.com';
        this.init();
    }

    init() {
        console.log(`📧 EmailService initialized for ${this.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        console.log('API endpoints:', this.apiEndpoints);
    }

    /**
     * Try multiple API endpoints until one works
     */
    async makeRequest(endpoint, data) {
        console.log(`🌐 EmailService attempting to send to ${endpoint}:`, data);
        
        for (const baseUrl of this.apiEndpoints) {
            const fullUrl = `${baseUrl}${endpoint}`;
            
            try {
                console.log(`Trying endpoint: ${fullUrl}`);
                
                const response = await fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                console.log(`Response from ${fullUrl}:`, response.status, response.statusText);

                if (!response.ok) {
                    const error = await response.text();
                    console.error(`API Error from ${fullUrl}:`, error);
                    throw new Error(`HTTP ${response.status}: ${error}`);
                }

                const result = await response.json();
                console.log(`✅ Success from ${fullUrl}:`, result);
                return result;
                
            } catch (error) {
                console.warn(`❌ Failed to connect to ${fullUrl}:`, error.message);
                // Continue to next endpoint
            }
        }
        
        throw new Error('Không thể kết nối đến email server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }

    /**
     * Gửi email từ form liên hệ
     */
    async sendContactEmail(formData) {
        console.log('📧 EmailService sending contact email:', formData);
        return await this.makeRequest('/contact', formData);
    }

    /**
     * Gửi email đăng ký newsletter
     */
    async sendNewsletterEmail(email) {
        console.log('📬 EmailService sending newsletter email:', email);
        return await this.makeRequest('/newsletter', { email });
    }

    /**
     * Convert farm type code to text
     */
    getFarmTypeText(farmType) {
        const types = {
            'pond-small': 'Ao tròn nổi (50-700m²)',
            'pond-medium': 'Ao lót bạt đáy (700–1.000m²)',
            'pond-large': 'Ao siêu thâm canh tổng hợp (1.000–3.000m² mỗi ao)',
            'research': 'Nghiên cứu/Học thuật',
            'other': 'Khác'
        };
        return types[farmType] || farmType;
    }

    /**
     * Convert subject code to text
     */
    getSubjectText(subject) {
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
}

// Export for use in other modules
window.EmailService = EmailService;
