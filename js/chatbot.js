// Test cases cho chatbot
const testCases = [
    'kiểm tra ph nước',
    'cách cho tôm ăn',
    'phòng bệnh đốm trắng',
    'quản lý đáy ao',
    'mật độ thả nuôi',
    'xử lý khi tôm thiếu oxy'
];

// Kho kiến thức và lời khuyên về nuôi tôm
const shrimpFarmingKnowledge = {
        'chất_lượng_nước': [
            {
                trigger: ['ph nước', 'độ ph', 'kiểm tra ph', 'đo ph', 'nước ao', 'nước chua', 'nước kiềm'],
                advice: 'Kiểm soát pH nước ao:\n- pH lý tưởng: 7.5-8.5\n- Đo pH 2 lần/ngày (sáng sớm và chiều tối)\n- Nếu pH < 7.5: Dùng vôi CaCO3 với liều 10-15kg/1000m²\n- Nếu pH > 8.5: Thay nước 20-30%, bổ sung chế phẩm vi sinh'
            },
            {
                trigger: ['oxy', 'thiếu oxy', 'hàm lượng oxy', 'oxy hòa tan', 'do', 'sục khí', 'quạt nước', 'tôm ngoi đầu'],
                advice: 'Duy trì oxy hòa tan (DO):\n- Mức DO tối thiểu: 4mg/L\n- Lắp đặt quạt nước 4-6 chiếc/1000m²\n- Chạy quạt liên tục trong đêm\n- Bổ sung men vi sinh để phân hủy chất đáy\n- Nếu tôm ngoi đầu: Tăng cường quạt nước ngay lập tức'
            },
            {
                trigger: ['độ mặn', 'nồng độ muối', 'điều chỉnh độ mặn', 'nước ngọt', 'nước mặn', 'nước lợ'],
                advice: 'Quản lý độ mặn:\n- Độ mặn thích hợp: 10-25‰\n- Điều chỉnh độ mặn từ từ (2-3‰/ngày)\n- Pha loãng nước biển với nước ngọt để giảm độ mặn\n- Theo dõi độ mặn sau mưa lớn'
            }
        ],
        'dinh_dưỡng': [
            {
                trigger: ['cho ăn', 'thức ăn', 'khẩu phần', 'cách cho ăn', 'tôm không ăn', 'tôm ăn ít', 'cho tôm ăn', 'khay ăn'],
                advice: 'Quản lý cho ăn khoa học:\n- Cho ăn 4-6 lần/ngày\n- Kiểm tra khay ăn sau 2 giờ\n- Điều chỉnh khẩu phần nếu thức ăn thừa > 30%\n- Tăng/giảm 10% lượng thức ăn mỗi lần điều chỉnh\n- Ngưng cho ăn trước khi thay nước 2-3 giờ'
            },
            {
                trigger: ['vitamin', 'khoáng chất', 'bổ sung dinh dưỡng', 'dinh dưỡng', 'thức ăn bổ sung'],
                advice: 'Bổ sung dinh dưỡng:\n- Vitamin C: 2-3g/kg thức ăn\n- Men tiêu hóa: Theo hướng dẫn nhà sản xuất\n- Khoáng vi lượng: 1 lần/tuần\n- Tăng cường miễn dịch vào giai đoạn thay vỏ'
            }
        ],
        'phòng_bệnh': [
            {
                trigger: ['đốm trắng', 'bệnh đốm trắng', 'phòng đốm trắng'],
                advice: 'Phòng bệnh đốm trắng:\n- Sử dụng tôm giống sạch bệnh có chứng nhận\n- Kiểm tra PCR định kỳ\n- Bổ sung vitamin C và beta-glucan\n- Duy trì nhiệt độ ổn định 28-30°C\n- Thay nước sạch định kỳ 5-7 ngày/lần'
            },
            {
                trigger: ['hoại tử gan tụy', 'ehp', 'gan tụy'],
                advice: 'Phòng bệnh hoại tử gan tụy (EHP):\n- Xử lý nước bằng chlorine 30ppm\n- Bổ sung probiotic định kỳ\n- Quản lý chất đáy ao tốt\n- Tránh cho ăn dư thừa\n- Loại bỏ tôm bệnh kịp thời'
            },
            {
                trigger: ['phòng bệnh', 'dấu hiệu bệnh', 'triệu chứng'],
                advice: 'Các dấu hiệu cảnh báo bệnh:\n- Tôm bỏ ăn đột ngột\n- Tôm nổi đầu, bơi lờ đờ\n- Có đốm trắng trên vỏ\n- Gan tụy nhạt màu\n- Thân tôm có màu đỏ\nKhi phát hiện: Ngưng cho ăn, kiểm tra mẫu và tham khảo chuyên gia'
            }
        ],
        'quản_lý_ao': [
            {
                trigger: ['quản lý ao', 'đáy ao', 'xử lý đáy'],
                advice: 'Quản lý đáy ao hiệu quả:\n- Vệ sinh đáy ao sau mỗi vụ\n- Phơi đáy 7-10 ngày\n- Rải vôi CaO 100kg/1000m²\n- Xử lý nước trước thả 7-10 ngày\n- Kiểm tra độ dày lớp bùn đáy định kỳ'
            },
            {
                trigger: ['thay nước', 'cấp nước', 'xử lý nước'],
                advice: 'Quy trình thay nước ao nuôi:\n- Thay 20-30% mỗi đợt\n- Thay nước vào lúc trời mát\n- Lọc nước qua túi lọc 2 lớp\n- Xử lý nước mới bằng chlorine\n- Bổ sung chế phẩm vi sinh sau thay nước'
            }
        ],
        'kỹ_thuật': [
            {
                trigger: ['mật độ', 'thả giống', 'con giống'],
                advice: 'Mật độ thả nuôi phù hợp:\n- Thâm canh: 100-120 con/m²\n- Bán thâm canh: 40-60 con/m²\n- Quảng canh cải tiến: 20-30 con/m²\n- Chọn con giống PCR âm tính\n- Thả giống buổi sáng sớm hoặc chiều mát'
            },
            {
                trigger: ['sử dụng probiotics', 'men vi sinh', 'chế phẩm sinh học'],
                advice: 'Sử dụng probiotics hiệu quả:\n- Tuần 1-2: 3-4kg/1000m²/tuần\n- Tuần 3-4: 4-5kg/1000m²/tuần\n- Từ tuần 5: 5-6kg/1000m²/tuần\n- Chia liều sử dụng làm 2-3 lần/tuần\n- Sử dụng vào buổi sáng sớm'
            }
        ],
        'khẩn_cấp': [
            {
                trigger: ['tôm chết', 'chết hàng loạt', 'tôm nổi đầu'],
                advice: 'Xử lý khẩn cấp khi tôm chết:\n1. Ngưng cho ăn ngay lập tức\n2. Tăng cường sục khí tối đa\n3. Thay nước 30-50%\n4. Thu mẫu tôm gửi xét nghiệm\n5. Liên hệ chuyên gia tư vấn\n6. KHÔNG sử dụng kháng sinh khi chưa có kết quả xét nghiệm'
            },
            {
                trigger: ['thiếu oxy', 'tôm ngoi đầu', 'khẩn cấp'],
                advice: 'Xử lý thiếu oxy khẩn cấp:\n1. Bật tất cả quạt nước\n2. Giảm độ sâu của ao\n3. Ngưng cho ăn\n4. Bổ sung các chế phẩm cấp oxy\n5. Theo dõi DO liên tục\n6. Chuẩn bị máy phát điện dự phòng'
            }
        ]
    };

    /**
     * Chatbot Class - Main chatbot functionality
     */
    class Chatbot {
        constructor() {
            this.isInitialized = false;
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeElements());
            } else {
                this.initializeElements();
            }
        }

        initializeElements() {
            // Get DOM elements
            this.chatbotToggle = document.getElementById('chatbot-toggle');
            this.chatbotContainer = document.getElementById('chatbot-container');
            this.chatbotClose = document.getElementById('chatbot-close');
            this.chatInput = document.getElementById('chatbot-input-field');
            this.sendButton = document.getElementById('chatbot-send');
            this.messagesContainer = document.getElementById('chatbot-messages');
            this.quickReplies = document.querySelectorAll('.quick-reply');
            this.emojiBtn = document.querySelector('.emoji-btn');
            this.attachmentBtn = document.querySelector('.attachment-btn');

            if (!this.chatbotToggle || !this.chatbotContainer) {
                console.warn('⚠️ Chatbot elements not found, retrying...');
                setTimeout(() => this.initializeElements(), 500);
                return;
            }

            this.bindEvents();
            this.isInitialized = true;
            console.log('✅ Chatbot initialized successfully');
        }

        bindEvents() {
            // Toggle chatbot
            if (this.chatbotToggle) {
                this.chatbotToggle.addEventListener('click', () => {
                    this.chatbotContainer.classList.toggle('active');
                    this.updateToggleIcon();
                });
            }

            // Close chatbot
            if (this.chatbotClose) {
                this.chatbotClose.addEventListener('click', () => {
                    this.chatbotContainer.classList.remove('active');
                    this.updateToggleIcon();
                });
            }

            // Send message
            if (this.sendButton) {
                this.sendButton.addEventListener('click', () => this.sendMessage());
            }

            // Enter key to send
            if (this.chatInput) {
                this.chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }

            // Quick replies with proper data-message handling
            this.bindQuickReplies();

            // Emoji button functionality
            if (this.emojiBtn) {
                this.emojiBtn.addEventListener('click', () => this.showEmojiPicker());
            }

            // Attachment button functionality
            if (this.attachmentBtn) {
                this.attachmentBtn.addEventListener('click', () => this.handleFileAttachment());
            }
        }

        showEmojiPicker() {
            const emojis = ['😊', '👍', '❤️', '😂', '🤔', '👏', '🙏', '💪', '🔥', '✨', '🎉', '💡', '🚀', '📊', '💰', '🐟'];
            
            // Create emoji picker if it doesn't exist
            let emojiPicker = document.querySelector('.emoji-picker');
            if (!emojiPicker) {
                emojiPicker = document.createElement('div');
                emojiPicker.className = 'emoji-picker';
                emojiPicker.style.cssText = `
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    padding: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    z-index: 1000;
                    max-width: 200px;
                `;
                
                emojis.forEach(emoji => {
                    const emojiBtn = document.createElement('button');
                    emojiBtn.textContent = emoji;
                    emojiBtn.style.cssText = `
                        border: none;
                        background: transparent;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 4px;
                        transition: background 0.2s ease;
                    `;
                    emojiBtn.addEventListener('click', () => {
                        if (this.chatInput) {
                            this.chatInput.value += emoji;
                            this.chatInput.focus();
                        }
                        emojiPicker.remove();
                    });
                    emojiBtn.addEventListener('mouseenter', () => {
                        emojiBtn.style.background = '#f0f0f0';
                    });
                    emojiBtn.addEventListener('mouseleave', () => {
                        emojiBtn.style.background = 'transparent';
                    });
                    emojiPicker.appendChild(emojiBtn);
                });
                
                this.emojiBtn.parentElement.style.position = 'relative';
                this.emojiBtn.parentElement.appendChild(emojiPicker);
                
                // Close picker when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', (e) => {
                        if (!emojiPicker.contains(e.target) && e.target !== this.emojiBtn) {
                            emojiPicker.remove();
                        }
                    }, { once: true });
                }, 100);
            }
        }

        handleFileAttachment() {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // For demo purposes, just show a message
                    this.addMessage(`📎 Đã đính kèm file: ${file.name}`, 'user');
                    
                    // Simulate processing
                    setTimeout(() => {
                        this.addMessage('🤖 Cảm ơn bạn đã gửi file! Đội ngũ kỹ thuật sẽ xem xét và phản hồi sớm nhất.', 'bot');
                    }, 1000);
                }
                fileInput.remove();
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
        }

        bindQuickReplies() {
            // Wait for DOM to be ready and re-bind quick replies
            setTimeout(() => {
                const quickReplies = document.querySelectorAll('.quick-reply');
                quickReplies.forEach(reply => {
                    reply.addEventListener('click', (e) => {
                        const message = e.currentTarget.getAttribute('data-message') || e.currentTarget.textContent.trim();
                        if (message) {
                            this.processUserMessage(message);
                        }
                    });
                });
                console.log(`✅ Bound ${quickReplies.length} quick reply buttons`);
            }, 200);
        }

        updateToggleIcon() {
            if (this.chatbotToggle) {
                const isActive = this.chatbotContainer.classList.contains('active');
                this.chatbotToggle.classList.toggle('active', isActive);
            }
        }

        sendMessage() {
            const message = this.chatInput ? this.chatInput.value.trim() : '';
            if (message) {
                this.processUserMessage(message);
                if (this.chatInput) {
                    this.chatInput.value = '';
                }
            }
        }

        processUserMessage(message) {
            // Add user message to chat
            this.addMessage(message, 'user');
            
            // Show typing indicator
            this.showTypingIndicator(true);
            
            // Process message and get response
            const response = this.getResponse(message);
            
            // Add bot response with delay for better UX
            setTimeout(() => {
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }

        addMessage(message, type) {
            if (!this.messagesContainer) return;

            // Remove typing indicator if exists
            this.showTypingIndicator(false);

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            
            // Format message with proper line breaks
            const formattedMessage = message.replace(/\n/g, '<br>');
            
            // Create avatar
            const avatar = type === 'bot' ? 
                `<div class="message-avatar">
                    <div class="bot-avatar">🤖</div>
                 </div>` : 
                `<div class="message-avatar">
                    <div class="user-avatar"></div>
                 </div>`;
            
            // Create message structure
            const messageContent = `
                ${avatar}
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${type === 'bot' ? 'AI Assistant' : 'Bạn'}</span>
                        <span class="message-time">${new Date().toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}</span>
                    </div>
                    <div class="message-body">
                        <p>${formattedMessage}</p>
                    </div>
                </div>
            `;
            
            messageDiv.innerHTML = messageContent;
            this.messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom with smooth behavior
            this.messagesContainer.scrollTo({
                top: this.messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }

        showTypingIndicator(show = true) {
            // Remove existing typing indicator
            const existingIndicator = this.messagesContainer.querySelector('.typing-indicator-message');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            if (show) {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'message bot-message typing-indicator-message';
                typingDiv.innerHTML = `
                    <div class="message-avatar">
                        <div class="bot-avatar">🤖</div>
                    </div>
                    <div class="message-content">
                        <div class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                `;
                this.messagesContainer.appendChild(typingDiv);
                
                // Scroll to bottom
                this.messagesContainer.scrollTo({
                    top: this.messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }

        getResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Handle specific quick reply messages
            if (lowerMessage.includes('sản phẩm iot') || lowerMessage.includes('tìm hiểu về sản phẩm')) {
                return `🛠️ **Sản phẩm IoT của SHRIMP TECH:**

**📦 Gói Starter** - Phù hợp ao nhỏ (500-1000m²)
- 3 cảm biến cơ bản (pH, DO, nhiệt độ)
- App mobile cơ bản
- Giá: 15-20 triệu VND

**📦 Gói Professional** - Ao trung bình (1000-3000m²)
- 6 cảm biến nâng cao + camera AI
- Dashboard web + mobile
- Cảnh báo thông minh
- Giá: 35-50 triệu VND

**📦 Gói Enterprise** - Ao lớn (3000m²+)
- Hệ thống IoT đầy đủ
- AI dự đoán + phân tích
- Hỗ trợ 24/7
- Giá: Liên hệ tư vấn

Bạn muốn tìm hiểu gói nào cụ thể?`;
            }
            
            if (lowerMessage.includes('phân tích nước') || lowerMessage.includes('chất lượng nước')) {
                return `🔬 **Phân tích chất lượng nước ao tôm:**

**Các thông số quan trọng:**
- **pH**: 7.5-8.5 (lý tưởng)
- **DO (Oxy hòa tan)**: >4mg/L
- **Độ mặn**: 10-25‰
- **Nhiệt độ**: 28-30°C
- **NH3 (Amoniac)**: <0.1mg/L
- **H2S**: <0.05mg/L

**Hệ thống IoT sẽ:**
✅ Giám sát 24/7 tự động
✅ Cảnh báo khi vượt ngưỡng
✅ Gợi ý xử lý kịp thời
✅ Lưu trữ dữ liệu phân tích

Bạn có thông số nào bất thường cần tư vấn không?`;
            }
            
            if (lowerMessage.includes('tư vấn kỹ thuật') || lowerMessage.includes('nuôi tôm thông minh')) {
                return `📊 **Tư vấn kỹ thuật nuôi tôm thông minh:**

**🎯 Quy trình tối ưu:**
1. **Chuẩn bị ao** - Xử lý đáy, khử trùng
2. **Thả giống** - Mật độ phù hợp, con giống sạch
3. **Quản lý thức ăn** - Theo dõi FCR, khay ăn
4. **Kiểm soát môi trường** - Nước, khí hậu
5. **Phòng bệnh** - Sử dụng probiotic, vitamin

**🤖 Công nghệ AI hỗ trợ:**
- Dự đoán tăng trưởng
- Tối ưu khẩu phần ăn
- Cảnh báo bệnh sớm
- Phân tích hiệu quả kinh tế

Bạn đang gặp khó khăn ở giai đoạn nào?`;
            }
            
            // Search through existing knowledge base
            for (const category in shrimpFarmingKnowledge) {
                for (const item of shrimpFarmingKnowledge[category]) {
                    if (item.trigger.some(trigger => lowerMessage.includes(trigger))) {
                        return item.advice;
                    }
                }
            }
            
            // Default response
            return `🤖 **Cảm ơn bạn đã liên hệ SHRIMP TECH!**

Tôi hiểu bạn đang quan tâm đến: "${message}"

Đội ngũ kỹ thuật sẽ hỗ trợ bạn chi tiết hơn qua:
📧 Email: shrimptech.vhu.hutech@gmail.com
📞 Hotline: 0901 234 567
🕐 Thời gian: T2-T6, 8:00-17:00

Hoặc bạn có thể thử các câu hỏi phổ biến bên dưới! 👇`;
        }
    }

    // Make Chatbot available globally
    window.Chatbot = Chatbot;
