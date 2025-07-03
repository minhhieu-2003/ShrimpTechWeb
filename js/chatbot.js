// Test cases cho chatbot
const testCases = [
    'kiểm tra ph nước',
    'cách cho tôm ăn',
    'phòng bệnh đốm trắng',
    'quản lý đáy ao',
    'mật độ thả nuôi',
    'xử lý khi tôm thiếu oxy'
];

// Khởi tạo chatbot
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chatbot-input-field');
    const sendButton = document.getElementById('chatbot-send');
    const messagesContainer = document.getElementById('chatbot-messages');
    const quickReplies = document.querySelectorAll('.quick-reply');

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

    // Hiển thị tin nhắn của bot
    function displayBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="bot-avatar">
                    <img src="assets/Logo.jpg" alt="SHRIMP TECH" class="avatar-img">
                </div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">AI Assistant</span>
                    <span class="message-time">vừa xong</span>
                </div>
                <div class="message-body">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hiển thị tin nhắn của người dùng
    function displayUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Bạn</span>
                    <span class="message-time">vừa xong</span>
                </div>
                <div class="message-body">
                    ${message}
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Xử lý tin nhắn từ người dùng
    function processUserMessage(message) {
        message = message.toLowerCase();
        let foundAdvice = false;

        // Tìm kiếm trong kho kiến thức
        for (const category in shrimpFarmingKnowledge) {
            for (const item of shrimpFarmingKnowledge[category]) {
                if (item.trigger.some(t => message.includes(t))) {
                    displayBotMessage(item.advice);
                    foundAdvice = true;
                    break;
                }
            }
            if (foundAdvice) break;
        }

        // Nếu không tìm thấy lời khuyên cụ thể
        if (!foundAdvice) {
            displayBotMessage(`Xin lỗi, tôi chưa có thông tin cụ thể về câu hỏi này. Bạn có thể thử hỏi về:\n
- Chất lượng nước (pH, oxy, độ mặn)\n
- Dinh dưỡng và cho ăn\n
- Phòng và trị bệnh\n
- Quản lý ao nuôi\n
- Kỹ thuật nuôi tôm\n
- Xử lý tình huống khẩn cấp\n
Hoặc chọn một trong các chủ đề gợi ý bên dưới.`);
        }
    }

    // Xử lý sự kiện gửi tin nhắn
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            displayUserMessage(message);
            processUserMessage(message);
            chatInput.value = '';
        }
    }

    // Sự kiện click nút gửi
    sendButton.addEventListener('click', handleSendMessage);

    // Sự kiện nhấn Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Xử lý quick replies
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            displayUserMessage(message);
            processUserMessage(message);
        });
    });

    // Xử lý đóng/mở chatbot
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    // Thêm hàm test
    function runTests() {
        console.log('Bắt đầu kiểm tra chatbot...');
        testCases.forEach(testCase => {
            console.log(`\nTest case: "${testCase}"`);
            processUserMessage(testCase);
        });
    }

    // Chạy test sau khi trang load
    setTimeout(runTests, 1000);
});
