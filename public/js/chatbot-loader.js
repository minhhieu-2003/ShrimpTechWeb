/**
 * Chatbot Loader - Dynamically loads chatbot component
 */

class ChatbotLoader {
    constructor() {
        this.loadChatbot();
    }

    async loadChatbot() {
        try {
            // Load chatbot HTML template
            const response = await fetch('components/chatbot.html');
            if (!response.ok) {
                throw new Error(`Failed to load chatbot: ${response.status}`);
            }
            
            const chatbotHTML = await response.text();
            
            // Create a container for the chatbot
            const chatbotContainer = document.createElement('div');
            chatbotContainer.innerHTML = chatbotHTML;
            
            // Append to body
            document.body.appendChild(chatbotContainer);
            
            // Initialize chatbot functionality after DOM is ready
            setTimeout(() => {
                this.initializeChatbot();
            }, 100);
            
            console.log('✅ Chatbot loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load chatbot:', error);
            
            // Fallback: Create basic chatbot structure
            this.createFallbackChatbot();
        }
    }

    initializeChatbot() {
        // Initialize chatbot functionality
        if (window.Chatbot) {
            const chatbot = new window.Chatbot();
            
            // Store chatbot instance globally for access
            window.chatbotInstance = chatbot;
            
            console.log('✅ Chatbot initialized successfully');
        } else {
            console.warn('⚠️ Chatbot class not found, loading class file...');
            this.loadChatbotClass();
        }
    }
    
    loadChatbotClass() {
        // Load chatbot class file
        const script = document.createElement('script');
        script.src = 'js/chatbot-class.js';
        script.onload = () => {
            console.log('✅ Chatbot class loaded');
            setTimeout(() => this.initializeChatbot(), 100);
        };
        script.onerror = () => {
            console.error('❌ Failed to load chatbot class');
            this.createFallbackChatbot();
        };
        document.head.appendChild(script);
    }

    createFallbackChatbot() {
        const chatbotHTML = `
            <div id="chatbot-widget" class="chatbot-widget">
                <div id="chatbot-toggle" class="chatbot-toggle" aria-label="Mở chat hỗ trợ SHRIMP TECH">
                    <div class="toggle-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                </div>
                <div id="chatbot-container" class="chatbot-container">
                    <div class="chatbot-header">
                        <div class="header-content">
                            <div class="chatbot-info">
                                <h4 class="chatbot-title">SHRIMP TECH Assistant</h4>
                                <p class="chatbot-status">Đang trực tuyến - Hỗ trợ 24/7</p>
                            </div>
                        </div>
                        <button id="chatbot-close" class="action-btn close-btn">×</button>
                    </div>
                    <div id="chatbot-messages" class="chatbot-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                <p>🐟 Xin chào! Tôi là AI Assistant của SHRIMP TECH</p>
                                <p>Tôi có thể hỗ trợ bạn về kỹ thuật nuôi tôm thông minh.</p>
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-quick-replies">
                        <div class="quick-replies-grid">
                            <button class="quick-reply" data-message="Tôi muốn tìm hiểu về sản phẩm IoT">
                                <span>Sản phẩm IoT</span>
                            </button>
                            <button class="quick-reply" data-message="Phân tích chất lượng nước ao tôm">
                                <span>Phân tích nước</span>
                            </button>
                            <button class="quick-reply" data-message="Tư vấn kỹ thuật nuôi tôm thông minh">
                                <span>Tư vấn kỹ thuật</span>
                            </button>
                        </div>
                    </div>
                    <div class="chatbot-input-section">
                        <div class="chatbot-input">
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    id="chatbot-input-field" 
                                    class="message-input"
                                    placeholder="Nhập câu hỏi về nuôi tôm..."
                                    maxlength="500"
                                >
                                <button id="chatbot-send" class="send-btn">Gửi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Initialize chatbot functionality
        setTimeout(() => this.initializeChatbot(), 100);
        
        console.log('✅ Fallback chatbot created');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotLoader();
});