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
        const msg = input.toLowerCase();
        // Switch-case cho các bệnh
        switch (true) {
            case msg.includes('bệnh cong thân'):
                return 'Bệnh cong thân ở tôm:\n- Thường do virus hoặc môi trường bị ô nhiễm.\n- Tôm cong thân, bơi yếu, giảm ăn.\n- Xử lý: cách ly ao bệnh, tăng cường vệ sinh, bổ sung vitamin, khoáng chất, men vi sinh.\n- Tham khảo ý kiến chuyên gia về điều trị.';
            case msg.includes('bệnh mềm vỏ'):
                return 'Bệnh mềm vỏ ở tôm:\n- Vỏ tôm mềm, dễ bị tổn thương, tôm giảm ăn.\n- Nguyên nhân do thiếu khoáng chất, đặc biệt là canxi và magie.\n- Xử lý: bổ sung khoáng chất, thay nước một phần, tăng cường vệ sinh ao.';
            case msg.includes('bệnh hoại tử cơ'):
                return 'Bệnh hoại tử cơ ở tôm:\n- Cơ tôm chuyển màu trắng, tôm bơi yếu, giảm ăn.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu, thiếu oxy.\n- Xử lý: thay nước, tăng cường sục khí, bổ sung men vi sinh, khoáng chất.';
            case msg.includes('bệnh sưng ruột'):
                return 'Bệnh sưng ruột ở tôm:\n- Ruột tôm phình to, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do vi khuẩn, thức ăn kém chất lượng.\n- Xử lý: thay nước, bổ sung men vi sinh, dùng thức ăn chất lượng cao.';
            case msg.includes('bệnh đốm nâu'):
                return 'Bệnh đốm nâu ở tôm:\n- Xuất hiện các đốm nâu trên vỏ tôm, tôm giảm ăn.\n- Nguyên nhân do vi khuẩn, môi trường nước ô nhiễm.\n- Xử lý: tăng cường vệ sinh ao, thay nước, bổ sung men vi sinh.';
            case msg.includes('bệnh rụng râu'):
                return 'Bệnh rụng râu ở tôm:\n- Tôm bị rụng râu, giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước xấu, thiếu khoáng chất.\n- Xử lý: thay nước, bổ sung khoáng chất, men vi sinh.';
            case msg.includes('bệnh đứt đuôi'):
                return 'Bệnh đứt đuôi ở tôm:\n- Đuôi tôm bị đứt, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do vi khuẩn, môi trường nước ô nhiễm.\n- Xử lý: tăng cường vệ sinh ao, thay nước, bổ sung men vi sinh.';
            case msg.includes('bệnh lở loét'):
                return 'Bệnh lở loét ở tôm:\n- Xuất hiện vết loét trên thân tôm, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu.\n- Xử lý: thay nước, tăng cường vệ sinh ao, bổ sung men vi sinh, khoáng chất.';
            case msg.includes('bệnh đục mắt'):
                return 'Bệnh đục mắt ở tôm:\n- Mắt tôm chuyển màu trắng đục, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do sốc môi trường, thiếu khoáng chất.\n- Xử lý: kiểm tra và điều chỉnh các chỉ số nước, bổ sung khoáng chất.';
            case msg.includes('bệnh phù thân'):
                return 'Bệnh phù thân ở tôm:\n- Thân tôm sưng to, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu.\n- Xử lý: thay nước, bổ sung men vi sinh, khoáng chất.';
            case msg.includes('bệnh đen đầu'):
                return 'Bệnh đen đầu ở tôm:\n- Đầu tôm chuyển màu đen, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước ô nhiễm, nhiều chất hữu cơ.\n- Xử lý: thay nước, tăng cường sục khí, bổ sung men vi sinh, khoáng chất.';
            case msg.includes('bệnh đốm trắng'):
                return 'Bệnh đốm trắng (White Spot):\n- Cách ly ao bị bệnh, không lấy nước từ ao này sang ao khác.\n- Tăng cường vệ sinh, loại bỏ tôm chết khỏi ao.\n- Bổ sung vitamin C, khoáng chất, men vi sinh.\n- Giảm stress cho tôm bằng cách giữ môi trường ổn định.\n- Tham khảo ý kiến chuyên gia về sử dụng hóa chất hoặc kháng sinh phù hợp.';
            case msg.includes('bệnh phân trắng'):
                return 'Bệnh phân trắng:\n- Giảm lượng thức ăn, tránh dư thừa.\n- Bổ sung men vi sinh, khoáng chất.\n- Kiểm tra và điều chỉnh chất lượng nước, đặc biệt là độ kiềm và pH.\n- Tăng cường vệ sinh ao, loại bỏ phân trắng khỏi mặt nước.\n- Theo dõi sức khỏe tôm, nếu nặng cần liên hệ chuyên gia.';
            case msg.includes('bệnh đỏ thân'):
                return 'Bệnh đỏ thân ở tôm:\n- Nguyên nhân thường do vi khuẩn hoặc môi trường nước xấu.\n- Tôm có dấu hiệu đỏ thân, bơi lờ đờ, giảm ăn.\n- Xử lý: thay nước một phần, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao.\n- Có thể dùng kháng sinh theo hướng dẫn chuyên gia.';
            case msg.includes('bệnh hoại tử gan tụy'):
                return 'Bệnh hoại tử gan tụy:\n- Tôm có gan tụy nhạt màu, teo nhỏ, giảm ăn, chết rải rác.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu, thức ăn kém chất lượng.\n- Xử lý: thay nước, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao, dùng thức ăn chất lượng cao.';
            case msg.includes('bệnh đục cơ'):
                return 'Bệnh đục cơ ở tôm:\n- Tôm có phần cơ chuyển màu trắng đục, bơi yếu, giảm ăn.\n- Nguyên nhân do sốc môi trường, thiếu khoáng, thiếu oxy.\n- Xử lý: kiểm tra và điều chỉnh các chỉ số nước, bổ sung khoáng chất, tăng cường sục khí.';
            case msg.includes('bệnh vàng thân'):
                return 'Bệnh vàng thân ở tôm:\n- Tôm chuyển màu vàng, giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước ô nhiễm, thiếu khoáng chất.\n- Xử lý: thay nước, bổ sung khoáng chất, men vi sinh, tăng cường vệ sinh ao.';
            case msg.includes('bệnh phù đầu'):
                return 'Bệnh phù đầu ở tôm:\n- Đầu tôm sưng to, tôm bơi yếu, giảm ăn.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu.\n- Xử lý: thay nước, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao.';
            case msg.includes('bệnh đen mang'):
                return 'Bệnh đen mang ở tôm:\n- Mang tôm chuyển màu đen, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước ô nhiễm, nhiều chất hữu cơ.\n- Xử lý: thay nước, tăng cường sục khí, bổ sung men vi sinh, khoáng chất.';
        }
        // Các trường hợp còn lại dùng if-else như cũ
        if (msg.includes('cân bằng ph') || msg.includes('xử lý ph') || msg.includes('ổn định ph'))
            return 'Giải pháp cân bằng và ổn định pH ao tôm:\n- Kiểm tra pH hàng ngày vào sáng và chiều.\n- Nếu pH thấp (<7.5), bón vôi dolomite hoặc vôi tôi với liều lượng phù hợp.\n- Nếu pH cao (>8.5), thay nước một phần, hạn chế bón vôi, tăng cường men vi sinh.\n- Bổ sung khoáng chất, đặc biệt sau mưa lớn hoặc khi thay nước.\n- Tránh bón phân hữu cơ khi pH cao.\n- Theo dõi màu nước, nếu nước chuyển màu lạ cần kiểm tra lại pH.';
        if (msg.includes('xử lý khí độc') || msg.includes('khí độc') || msg.includes('nh3') || msg.includes('h2s'))
            return 'Giải pháp xử lý khí độc (NH3, H2S) trong ao tôm:\n- Kiểm tra nồng độ NH3, H2S định kỳ, đặc biệt sau khi cho ăn nhiều hoặc thời tiết thay đổi.\n- Tăng cường sục khí để giảm khí độc.\n- Thay nước một phần nếu nồng độ khí độc cao.\n- Bổ sung men vi sinh, chế phẩm sinh học để phân hủy chất hữu cơ.\n- Bón vôi dolomite để ổn định pH, giảm sự phát sinh khí độc.\n- Giảm lượng thức ăn khi phát hiện khí độc cao.\n- Theo dõi sức khỏe tôm, nếu có dấu hiệu nổi đầu, giảm ăn cần xử lý ngay.';
        if (msg.includes('xử lý tảo') || msg.includes('tảo xanh') || msg.includes('tảo đỏ') || msg.includes('tảo phát triển quá mức'))
            return 'Biện pháp xử lý tảo trong ao nuôi tôm:\n- Kiểm tra mật độ tảo thường xuyên, đặc biệt vào buổi sáng.\n- Nếu tảo phát triển quá mức, thay nước một phần để giảm mật độ tảo.\n- Sử dụng chế phẩm sinh học, men vi sinh để cân bằng hệ vi sinh vật.\n- Bổ sung khoáng chất, đặc biệt là vôi dolomite để ổn định pH và hạn chế tảo.\n- Hạn chế bón phân hữu cơ khi tảo nhiều.\n- Nếu xuất hiện tảo đỏ, cần thay nước và tăng cường sục khí ngay.';
        if (msg.includes('ban đêm') || msg.includes('quản lý ban đêm') || msg.includes('xử lý ban đêm'))
            return 'Quản lý ao nuôi tôm vào ban đêm:\n- Tăng cường sục khí để tránh thiếu oxy do tảo tiêu thụ oxy mạnh vào ban đêm.\n- Kiểm tra oxy hòa tan vào đầu đêm và sáng sớm.\n- Không bón phân hoặc cho ăn nhiều vào buổi tối.\n- Theo dõi tôm nổi đầu, nếu có cần tăng sục khí và kiểm tra các chỉ số nước.\n- Nếu tảo phát triển mạnh ban ngày, cần đặc biệt chú ý oxy ban đêm.';
        // ...existing code...
        if (msg.includes('chào') || msg.includes('hello')) return 'Xin chào! Bạn cần hỗ trợ gì?';
        if (msg.includes('giá') || msg.includes('báo giá')) return 'Vui lòng để lại thông tin, chúng tôi sẽ liên hệ báo giá chi tiết.';
        if (msg.includes('liên hệ')) return 'Bạn có thể liên hệ qua email shrimptech.vhu.hutech@gmail.com hoặc số +84 0835749407, +84 0826529739.';
        if (msg.includes('sản phẩm')) return 'Bạn muốn biết về sản phẩm nào? Chúng tôi có các kit cảm biến, giải pháp IoT, thiết bị đo môi trường, v.v.';
        if (msg.includes('tư vấn')) return 'Chúng tôi luôn sẵn sàng tư vấn miễn phí cho bạn! Bạn cần tư vấn về vấn đề gì?';
        if (msg.includes('cảm ơn')) return 'Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin, hãy hỏi nhé.';
        if (msg.includes('phân tích nước')) return 'Phân tích nước giúp kiểm soát chất lượng ao nuôi, giảm rủi ro và tăng năng suất. Bạn muốn biết về chỉ số nào?';
        if (msg.includes('kỹ thuật nuôi')) return 'Bạn cần tư vấn kỹ thuật nuôi tôm? Hãy mô tả vấn đề cụ thể để AI hỗ trợ tốt nhất.';
        if (msg.includes('phòng bệnh')) return 'Phòng bệnh tôm cần kiểm soát môi trường và phát hiện sớm các dấu hiệu bất thường. Bạn có triệu chứng nào cần chẩn đoán không?';
        if (msg.includes('tối ưu chi phí') || msg.includes('lợi nhuận')) return 'Quản lý chi phí hiệu quả giúp tối đa hóa lợi nhuận cho trại tôm. Bạn muốn tối ưu khoản nào?';
        if (msg.includes('hướng dẫn iot') || msg.includes('thiết bị iot')) return 'Bạn cần hướng dẫn cài đặt hoặc vận hành thiết bị IoT nào? Vui lòng nêu tên thiết bị.';
        if (msg.includes('bảo mật')) return 'Hệ thống của chúng tôi sử dụng bảo mật end-to-end, đảm bảo an toàn dữ liệu cho khách hàng.';
        if (msg.includes('cảm biến')) return 'Các loại cảm biến phổ biến gồm cảm biến nhiệt độ, pH, oxy hòa tan, độ mặn... Bạn cần thông tin về loại nào?';
        if (msg.includes('thời tiết')) return 'Thời tiết ảnh hưởng lớn đến môi trường ao nuôi. Bạn nên kiểm tra nhiệt độ, độ ẩm và dự báo mưa thường xuyên.';
        if (msg.includes('môi trường')) return 'Kiểm soát môi trường ao nuôi là yếu tố then chốt để phòng bệnh và tăng năng suất.';
        if (msg.includes('hỗ trợ')) return 'Bạn cần hỗ trợ về vấn đề gì? Đội ngũ ShrimpTech luôn sẵn sàng giúp bạn.';
        if (msg.includes('báo cáo')) return 'Bạn muốn nhận báo cáo định kỳ về môi trường ao nuôi? Vui lòng để lại email để nhận báo cáo tự động.';
        if (msg.includes('đặt hàng') || msg.includes('mua')) return 'Bạn muốn đặt hàng sản phẩm nào? Vui lòng cung cấp tên sản phẩm và thông tin liên hệ.';
        if (msg.includes('demo') || msg.includes('thử nghiệm')) return 'Bạn muốn đăng ký demo sản phẩm? Vui lòng để lại thông tin để chúng tôi liên hệ.';
        if (msg.includes('đội ngũ') || msg.includes('nhân sự')) return 'Đội ngũ ShrimpTech gồm các chuyên gia IoT, AI và kỹ thuật nuôi tôm giàu kinh nghiệm.';
        if (msg.includes('đối tác')) return 'ShrimpTech hợp tác với nhiều đơn vị trong và ngoài nước để phát triển công nghệ nuôi tôm thông minh.';
        if (msg.includes('giải pháp')) return 'Chúng tôi cung cấp giải pháp IoT, AI, phân tích dữ liệu và cảnh báo sớm cho ngành nuôi tôm.';
        if (msg.includes('mẹo') || msg.includes('xử lý') || msg.includes('ứng phó') || msg.includes('cách xử lý'))
            return 'Mẹo xử lý khi nuôi tôm: \n- Kiểm tra chất lượng nước (pH, nhiệt độ, oxy, độ mặn) ít nhất 2 lần/ngày.\n- Duy trì pH từ 7.5-8.5, oxy hòa tan >4mg/l.\n- Khi tôm nổi đầu, giảm lượng thức ăn, tăng cường sục khí.\n- Bổ sung khoáng chất, vitamin C, men vi sinh định kỳ.\n- Khi thời tiết thay đổi, giảm 30-50% lượng thức ăn, kiểm tra nước sau mưa.\n- Quan sát màu nước, nếu chuyển màu lạ cần thay nước một phần và kiểm tra lại các chỉ số.';
        if (msg.includes('tôm chết') || msg.includes('tôm yếu'))
            return 'Xử lý khi tôm yếu hoặc chết:\n1. Kiểm tra ngay các chỉ số nước: pH, nhiệt độ, oxy hòa tan, độ mặn.\n2. Nếu oxy thấp, tăng cường sục khí.\n3. Nếu pH bất thường, thay nước một phần và bổ sung khoáng.\n4. Giảm lượng thức ăn, tránh dư thừa.\n5. Bổ sung vitamin C, men vi sinh để tăng sức đề kháng.\n6. Nếu không cải thiện, lấy mẫu tôm gửi phòng xét nghiệm hoặc liên hệ chuyên gia.';
        if (msg.includes('thời tiết xấu') || msg.includes('mưa lớn'))
            return 'Ứng phó thời tiết xấu/mưa lớn:\n- Giảm lượng thức ăn 30-50%.\n- Kiểm tra pH, oxy hòa tan sau mưa.\n- Bổ sung khoáng chất, men vi sinh để ổn định môi trường.\n- Che chắn ao nuôi nếu có thể.\n- Theo dõi sức khỏe tôm sát sao, tăng cường sục khí.';
        if (msg.includes('nắng nóng') || msg.includes('trời nóng'))
            return 'Xử lý khi trời nắng nóng:\n- Tăng cường sục khí, kiểm tra oxy hòa tan thường xuyên.\n- Che chắn ao nuôi bằng lưới hoặc vật liệu phù hợp để giảm nhiệt độ nước.\n- Giảm lượng thức ăn vào buổi trưa, tăng vào sáng và chiều mát.\n- Bổ sung vitamin C, khoáng chất để tăng sức đề kháng cho tôm.\n- Theo dõi màu nước, nếu nước quá xanh cần thay nước một phần.';
        if (msg.includes('trời lạnh') || msg.includes('nhiệt độ thấp'))
            return 'Xử lý khi trời lạnh/nhiệt độ thấp:\n- Giảm lượng thức ăn, ưu tiên cho ăn vào thời điểm ấm trong ngày.\n- Tăng cường sục khí để tránh thiếu oxy.\n- Bổ sung vitamin, khoáng chất để tăng sức đề kháng.\n- Theo dõi tôm nổi đầu, nếu có cần kiểm tra oxy và nhiệt độ nước ngay.';
        if (msg.includes('chuyển mùa') || msg.includes('giao mùa'))
            return 'Ứng phó khi chuyển mùa/giao mùa:\n- Kiểm tra các chỉ số nước thường xuyên, đặc biệt là pH và nhiệt độ.\n- Giảm lượng thức ăn, tăng cường men vi sinh để ổn định môi trường.\n- Bổ sung khoáng chất, vitamin để tăng sức đề kháng cho tôm.\n- Theo dõi sát sức khỏe tôm, phát hiện sớm các dấu hiệu bất thường.';
        if (msg.includes('bão') || msg.includes('gió lớn'))
            return 'Xử lý khi có bão/gió lớn:\n- Che chắn ao nuôi, bảo vệ hệ thống điện và thiết bị.\n- Giảm lượng thức ăn trước và sau bão.\n- Kiểm tra chất lượng nước sau bão, đặc biệt là pH và oxy hòa tan.\n- Bổ sung khoáng chất, men vi sinh để phục hồi môi trường ao.';
        if (msg.includes('stress') || msg.includes('sốc môi trường'))
            return 'Tôm bị stress/sốc môi trường:\n- Giảm lượng thức ăn, tránh thay đổi môi trường đột ngột.\n- Bổ sung vitamin, khoáng chất, men vi sinh.\n- Kiểm tra lại các chỉ số nước, duy trì ổn định.\n- Hạn chế di chuyển, phân loại tôm khi chưa cần thiết.';
        return 'Cảm ơn bạn đã liên hệ. Đội ngũ ShrimpTech sẽ phản hồi sớm nhất!';
        if (input.includes('chào') || input.includes('hello')) return 'Xin chào! Bạn cần hỗ trợ gì?';
        if (input.includes('giá') || input.includes('báo giá')) return 'Vui lòng để lại thông tin, chúng tôi sẽ liên hệ báo giá chi tiết.';
        if (input.includes('liên hệ')) return 'Bạn có thể liên hệ qua email shrimptech.vhu.hutech@gmail.com hoặc số 0901 234 567.';
        if (input.includes('sản phẩm')) return 'Bạn muốn biết về sản phẩm nào? Chúng tôi có các kit cảm biến, giải pháp IoT, thiết bị đo môi trường, v.v.';
        if (input.includes('tư vấn')) return 'Chúng tôi luôn sẵn sàng tư vấn miễn phí cho bạn! Bạn cần tư vấn về vấn đề gì?';
        if (input.includes('cảm ơn')) return 'Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin, hãy hỏi nhé.';
        if (input.includes('phân tích nước')) return 'Phân tích nước giúp kiểm soát chất lượng ao nuôi, giảm rủi ro và tăng năng suất. Bạn muốn biết về chỉ số nào?';
        if (input.includes('kỹ thuật nuôi')) return 'Bạn cần tư vấn kỹ thuật nuôi tôm? Hãy mô tả vấn đề cụ thể để AI hỗ trợ tốt nhất.';
        if (input.includes('phòng bệnh')) return 'Phòng bệnh tôm cần kiểm soát môi trường và phát hiện sớm các dấu hiệu bất thường. Bạn có triệu chứng nào cần chẩn đoán không?';
        if (input.includes('tối ưu chi phí') || input.includes('lợi nhuận')) return 'Quản lý chi phí hiệu quả giúp tối đa hóa lợi nhuận cho trại tôm. Bạn muốn tối ưu khoản nào?';
        if (input.includes('hướng dẫn iot') || input.includes('thiết bị iot')) return 'Bạn cần hướng dẫn cài đặt hoặc vận hành thiết bị IoT nào? Vui lòng nêu tên thiết bị.';
        if (input.includes('bảo mật')) return 'Hệ thống của chúng tôi sử dụng bảo mật end-to-end, đảm bảo an toàn dữ liệu cho khách hàng.';
        if (input.includes('cảm biến')) return 'Các loại cảm biến phổ biến gồm cảm biến nhiệt độ, pH, oxy hòa tan, độ mặn... Bạn cần thông tin về loại nào?';
        if (input.includes('thời tiết')) return 'Thời tiết ảnh hưởng lớn đến môi trường ao nuôi. Bạn nên kiểm tra nhiệt độ, độ ẩm và dự báo mưa thường xuyên.';
        if (input.includes('môi trường')) return 'Kiểm soát môi trường ao nuôi là yếu tố then chốt để phòng bệnh và tăng năng suất.';
        if (input.includes('hỗ trợ')) return 'Bạn cần hỗ trợ về vấn đề gì? Đội ngũ ShrimpTech luôn sẵn sàng giúp bạn.';
        if (input.includes('báo cáo')) return 'Bạn muốn nhận báo cáo định kỳ về môi trường ao nuôi? Vui lòng để lại email để nhận báo cáo tự động.';
        if (input.includes('đặt hàng') || input.includes('mua')) return 'Bạn muốn đặt hàng sản phẩm nào? Vui lòng cung cấp tên sản phẩm và thông tin liên hệ.';
        if (input.includes('demo') || input.includes('thử nghiệm')) return 'Bạn muốn đăng ký demo sản phẩm? Vui lòng để lại thông tin để chúng tôi liên hệ.';
        if (input.includes('đội ngũ') || input.includes('nhân sự')) return 'Đội ngũ ShrimpTech gồm các chuyên gia IoT, AI và kỹ thuật nuôi tôm giàu kinh nghiệm.';
        if (input.includes('đối tác')) return 'ShrimpTech hợp tác với nhiều đơn vị trong và ngoài nước để phát triển công nghệ nuôi tôm thông minh.';
        if (input.includes('giải pháp')) return 'Chúng tôi cung cấp giải pháp IoT, AI, phân tích dữ liệu và cảnh báo sớm cho ngành nuôi tôm.';
        if (input.includes('mẹo') || input.includes('xử lý') || input.includes('ứng phó') || input.includes('cách xử lý'))
            return 'Mẹo xử lý khi nuôi tôm: \n- Kiểm tra chất lượng nước (pH, nhiệt độ, oxy, độ mặn) ít nhất 2 lần/ngày.\n- Duy trì pH từ 7.5-8.5, oxy hòa tan >4mg/l.\n- Khi tôm nổi đầu, giảm lượng thức ăn, tăng cường sục khí.\n- Bổ sung khoáng chất, vitamin C, men vi sinh định kỳ.\n- Khi thời tiết thay đổi, giảm 30-50% lượng thức ăn, kiểm tra nước sau mưa.\n- Quan sát màu nước, nếu chuyển màu lạ cần thay nước một phần và kiểm tra lại các chỉ số.';
        if (input.includes('tôm chết') || input.includes('tôm yếu'))
            return 'Xử lý khi tôm yếu hoặc chết:\n1. Kiểm tra ngay các chỉ số nước: pH, nhiệt độ, oxy hòa tan, độ mặn.\n2. Nếu oxy thấp, tăng cường sục khí.\n3. Nếu pH bất thường, thay nước một phần và bổ sung khoáng.\n4. Giảm lượng thức ăn, tránh dư thừa.\n5. Bổ sung vitamin C, men vi sinh để tăng sức đề kháng.\n6. Nếu không cải thiện, lấy mẫu tôm gửi phòng xét nghiệm hoặc liên hệ chuyên gia.';
        if (input.includes('bệnh đốm trắng'))
            return 'Bệnh đốm trắng (White Spot):\n- Cách ly ao bị bệnh, không lấy nước từ ao này sang ao khác.\n- Tăng cường vệ sinh, loại bỏ tôm chết khỏi ao.\n- Bổ sung vitamin C, khoáng chất, men vi sinh.\n- Giảm stress cho tôm bằng cách giữ môi trường ổn định.\n- Tham khảo ý kiến chuyên gia về sử dụng hóa chất hoặc kháng sinh phù hợp.';
        if (input.includes('bệnh phân trắng'))
            return 'Bệnh phân trắng:\n- Giảm lượng thức ăn, tránh dư thừa.\n- Bổ sung men vi sinh, khoáng chất.\n- Kiểm tra và điều chỉnh chất lượng nước, đặc biệt là độ kiềm và pH.\n- Tăng cường vệ sinh ao, loại bỏ phân trắng khỏi mặt nước.\n- Theo dõi sức khỏe tôm, nếu nặng cần liên hệ chuyên gia.';
        if (input.includes('bệnh đỏ thân'))
            return 'Bệnh đỏ thân ở tôm:\n- Nguyên nhân thường do vi khuẩn hoặc môi trường nước xấu.\n- Tôm có dấu hiệu đỏ thân, bơi lờ đờ, giảm ăn.\n- Xử lý: thay nước một phần, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao.\n- Có thể dùng kháng sinh theo hướng dẫn chuyên gia.';
        if (input.includes('bệnh cong thân'))
            return 'Bệnh cong thân ở tôm:\n- Thường do virus hoặc môi trường bị ô nhiễm.\n- Tôm cong thân, bơi yếu, giảm ăn.\n- Xử lý: cách ly ao bệnh, tăng cường vệ sinh, bổ sung vitamin, khoáng chất, men vi sinh.\n- Tham khảo ý kiến chuyên gia về điều trị.';
        if (input.includes('bệnh hoại tử gan tụy'))
            return 'Bệnh hoại tử gan tụy:\n- Tôm có gan tụy nhạt màu, teo nhỏ, giảm ăn, chết rải rác.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu, thức ăn kém chất lượng.\n- Xử lý: thay nước, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao, dùng thức ăn chất lượng cao.';
        if (input.includes('bệnh đục cơ'))
            return 'Bệnh đục cơ ở tôm:\n- Tôm có phần cơ chuyển màu trắng đục, bơi yếu, giảm ăn.\n- Nguyên nhân do sốc môi trường, thiếu khoáng, thiếu oxy.\n- Xử lý: kiểm tra và điều chỉnh các chỉ số nước, bổ sung khoáng chất, tăng cường sục khí.';
        if (input.includes('bệnh vàng thân'))
            return 'Bệnh vàng thân ở tôm:\n- Tôm chuyển màu vàng, giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước ô nhiễm, thiếu khoáng chất.\n- Xử lý: thay nước, bổ sung khoáng chất, men vi sinh, tăng cường vệ sinh ao.';
        if (input.includes('bệnh phù đầu'))
            return 'Bệnh phù đầu ở tôm:\n- Đầu tôm sưng to, tôm bơi yếu, giảm ăn.\n- Nguyên nhân do vi khuẩn, môi trường nước xấu.\n- Xử lý: thay nước, bổ sung men vi sinh, khoáng chất, tăng cường vệ sinh ao.';
        if (input.includes('bệnh đen mang'))
            return 'Bệnh đen mang ở tôm:\n- Mang tôm chuyển màu đen, tôm giảm ăn, bơi yếu.\n- Nguyên nhân do môi trường nước ô nhiễm, nhiều chất hữu cơ.\n- Xử lý: thay nước, tăng cường sục khí, bổ sung men vi sinh, khoáng chất.';
        if (input.includes('thời tiết xấu') || input.includes('mưa lớn'))
            return 'Ứng phó thời tiết xấu/mưa lớn:\n- Giảm lượng thức ăn 30-50%.\n- Kiểm tra pH, oxy hòa tan sau mưa.\n- Bổ sung khoáng chất, men vi sinh để ổn định môi trường.\n- Che chắn ao nuôi nếu có thể.\n- Theo dõi sức khỏe tôm sát sao, tăng cường sục khí.';
        if (input.includes('nắng nóng') || input.includes('trời nóng'))
            return 'Xử lý khi trời nắng nóng:\n- Tăng cường sục khí, kiểm tra oxy hòa tan thường xuyên.\n- Che chắn ao nuôi bằng lưới hoặc vật liệu phù hợp để giảm nhiệt độ nước.\n- Giảm lượng thức ăn vào buổi trưa, tăng vào sáng và chiều mát.\n- Bổ sung vitamin C, khoáng chất để tăng sức đề kháng cho tôm.\n- Theo dõi màu nước, nếu nước quá xanh cần thay nước một phần.';
        if (input.includes('trời lạnh') || input.includes('nhiệt độ thấp'))
            return 'Xử lý khi trời lạnh/nhiệt độ thấp:\n- Giảm lượng thức ăn, ưu tiên cho ăn vào thời điểm ấm trong ngày.\n- Tăng cường sục khí để tránh thiếu oxy.\n- Bổ sung vitamin, khoáng chất để tăng sức đề kháng.\n- Theo dõi tôm nổi đầu, nếu có cần kiểm tra oxy và nhiệt độ nước ngay.';
        if (input.includes('chuyển mùa') || input.includes('giao mùa'))
            return 'Ứng phó khi chuyển mùa/giao mùa:\n- Kiểm tra các chỉ số nước thường xuyên, đặc biệt là pH và nhiệt độ.\n- Giảm lượng thức ăn, tăng cường men vi sinh để ổn định môi trường.\n- Bổ sung khoáng chất, vitamin để tăng sức đề kháng cho tôm.\n- Theo dõi sát sức khỏe tôm, phát hiện sớm các dấu hiệu bất thường.';
        if (input.includes('bão') || input.includes('gió lớn'))
            return 'Xử lý khi có bão/gió lớn:\n- Che chắn ao nuôi, bảo vệ hệ thống điện và thiết bị.\n- Giảm lượng thức ăn trước và sau bão.\n- Kiểm tra chất lượng nước sau bão, đặc biệt là pH và oxy hòa tan.\n- Bổ sung khoáng chất, men vi sinh để phục hồi môi trường ao.';
        if (input.includes('stress') || input.includes('sốc môi trường'))
            return 'Tôm bị stress/sốc môi trường:\n- Giảm lượng thức ăn, tránh thay đổi môi trường đột ngột.\n- Bổ sung vitamin, khoáng chất, men vi sinh.\n- Kiểm tra lại các chỉ số nước, duy trì ổn định.\n- Hạn chế di chuyển, phân loại tôm khi chưa cần thiết.';
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
