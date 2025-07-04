// Chatbot logic nâng cấp UX/UI
window.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotToggle || !chatbotWidget) return;

    // Focus input khi mở chat
    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.style.display = 'flex';
        chatbotToggle.style.display = 'none';
        setTimeout(() => chatbotInput.focus(), 200);
    });
    chatbotClose.addEventListener('click', () => {
        chatbotWidget.style.display = 'none';
        chatbotToggle.style.display = 'flex';
    });

    // Gửi tin nhắn với Enter, Shift+Enter xuống dòng
    chatbotInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatbotForm.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
        }
    });

    chatbotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMsg = chatbotInput.value.trim();
        if (!userMsg) return;
        appendMessage(userMsg, 'user');
        chatbotInput.value = '';
        chatbotInput.focus();
        // Hiệu ứng loading bot trả lời
        const loadingMsg = appendMessage('Đang trả lời...', 'loading');
        setTimeout(() => {
            loadingMsg.remove();
            appendMessage(simpleBotReply(userMsg), 'bot');
        }, 700);
    });

    function appendMessage(msg, sender) {
        const div = document.createElement('div');
        div.className = 'chatbot-message ' + sender;
        if(sender === 'bot') {
            div.innerHTML = `<span style="margin-right:8px;vertical-align:middle;"><img src='assets/chatbot.png' alt='Bot' width='22' height='22' style='border-radius:50%;background:#fff;box-shadow:0 1px 4px #cce0ff55;vertical-align:middle;'></span>` + msg;
        } else {
            div.textContent = msg;
        }
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return div;
    }
    function simpleBotReply(input) {
        input = input.toLowerCase();
        if (input.includes('chào') || input.includes('hello')) return 'Xin chào! Bạn cần hỗ trợ gì?';
        if (input.includes('giá') || input.includes('báo giá')) return 'Vui lòng để lại thông tin, chúng tôi sẽ liên hệ báo giá chi tiết.';
        if (input.includes('liên hệ')) return 'Bạn có thể liên hệ qua email shrimptech.vhu.hutech@gmail.com hoặc số 0901 234 567.';
        if (input.includes('sản phẩm')) return 'Bạn muốn biết về sản phẩm nào? Chúng tôi có các kit cảm biến, giải pháp IoT, v.v.';
        if (input.includes('tư vấn')) return 'Chúng tôi luôn sẵn sàng tư vấn miễn phí cho bạn!';
        if (input.includes('cảm ơn')) return 'Rất vui được hỗ trợ bạn!';
        return 'Cảm ơn bạn đã liên hệ. Đội ngũ ShrimpTech sẽ phản hồi sớm nhất!';
    }

    // Avatar bot ở header
    const headerSpan = chatbotWidget.querySelector('.chatbot-header span');
    if(headerSpan && !headerSpan.querySelector('.chatbot-avatar')) {
        const avatar = document.createElement('span');
        avatar.className = 'chatbot-avatar';
        avatar.innerHTML = "<img src='assets/chatbot.png' alt='Bot' width='28' height='28'>";
        headerSpan.prepend(avatar);
    }
});
