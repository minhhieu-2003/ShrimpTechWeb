// Chatbot Advanced UI Logic
window.addEventListener('DOMContentLoaded', function() {
  const widget = document.getElementById('chatbot-widget');
  const toggle = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const container = document.getElementById('chatbot-container');
  const input = document.getElementById('chatbot-input-field-2');
  const sendBtn = document.getElementById('chatbot-send-2');
  const messages = document.getElementById('chatbot-messages');
  const quickReplies = widget.querySelectorAll('.quick-reply');
  const typingUsers = document.getElementById('typing-users');
  const notification = document.getElementById('chat-notification');
  const emojiBtn = widget.querySelector('.emoji-btn');
  const attachmentBtn = widget.querySelector('.attachment-btn');

  // Toggle open/close
  function openChat() {
    widget.classList.add('open');
    if(notification) notification.style.display = 'none';
    setTimeout(() => input.focus(), 200);
  }
  function closeChat() {
    widget.classList.remove('open');
  }
  toggle.addEventListener('click', function() {
    if(widget.classList.contains('open')) closeChat();
    else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  // Send message
  function sendMessage(text, sender = 'user') {
    if(!text) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerHTML = `
      <div class="message-avatar">${sender==='user'?'<img src="/assets/Logo.jpg" class="avatar-img" width="28" height="28">':'<div class="bot-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6"></path><path d="m15.14 7.14-4.28 4.28"></path><path d="m9.14 16.86-4.28-4.28"></path><path d="m15.14 16.86-4.28-4.28"></path><path d="m9.14 7.14-4.28 4.28"></path></svg></div>'}
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="sender-name">${sender==='user'?'Bạn':'AI Assistant'}</span>
          <span class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
        </div>
        <div class="message-body">${text}</div>
      </div>
    `;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Handle send
  function handleSend() {
    const text = input.value.trim();
    if(!text) return;
    sendMessage(text, 'user');
    input.value = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      sendMessage(simpleBotReply(text), 'bot');
    }, 900);
  }
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', function(e) {
    if(e.key==='Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Quick replies
  quickReplies.forEach(btn => {
    btn.addEventListener('click', function() {
      input.value = btn.getAttribute('data-message');
      handleSend();
    });
  });

  // Typing indicator
  function showTyping() { typingUsers.style.display = 'flex'; }
  function hideTyping() { typingUsers.style.display = 'none'; }

  // Emoji picker (simple demo)
  if(emojiBtn) {
    emojiBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Simple emoji picker popup
      let picker = document.getElementById('emoji-picker-popup');
      if(!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker-popup';
        picker.style.position = 'absolute';
        picker.style.bottom = '60px';
        picker.style.right = '60px';
        picker.style.background = '#fff';
        picker.style.border = '1px solid #cce0ff';
        picker.style.borderRadius = '10px';
        picker.style.boxShadow = '0 2px 8px #cce0ff55';
        picker.style.padding = '8px 10px';
        picker.style.zIndex = 10002;
        picker.style.display = 'flex';
        picker.style.gap = '8px';
        picker.style.flexWrap = 'wrap';
        picker.innerHTML = ['😊','😂','😍','👍','🦐','💡','⚠️','📱','💰','🔬','📊','🏥'].map(e=>`<span style="font-size:1.3rem;cursor:pointer;">${e}</span>`).join('');
        document.body.appendChild(picker);
        picker.addEventListener('click', function(ev) {
          if(ev.target.tagName==='SPAN') {
            input.value += ev.target.textContent;
            input.focus();
            picker.remove();
          }
        });
        // Click outside to close
        setTimeout(()=>{
          document.addEventListener('mousedown', function docHandler(ev) {
            if(!picker.contains(ev.target) && ev.target!==emojiBtn) {
              picker.remove();
              document.removeEventListener('mousedown', docHandler);
            }
          });
        }, 10);
      }
    });
  }

  // Attachment button (demo)
  if(attachmentBtn) {
    attachmentBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Tính năng đính kèm file sẽ sớm ra mắt!');
    });
  }

  // Simple bot reply
  function removeVietnameseTones(str) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }
  function simpleBotReply(input) {
    let raw = input;
    input = input.toLowerCase();
    let inputNoTone = removeVietnameseTones(input);
    // Từ khóa đặc biệt dạng cụm
    const cases = [
      { keywords: ['tảo bùng phát'], reply: 'Tảo bùng phát làm giảm oxy, tăng nguy cơ tôm bị sốc. Nên giảm bón phân, tăng sục khí, thay nước và sử dụng chế phẩm sinh học để kiểm soát tảo.' },
      { keywords: ['tảo tàn'], reply: 'Tảo tàn đột ngột làm giảm oxy, tăng độc tố. Nên tăng cường sục khí, thay nước, bổ sung khoáng và vitamin C cho tôm.' },
      { keywords: ['nước đục'], reply: 'Nước ao đục có thể do tảo phát triển quá mức hoặc do chất hữu cơ lơ lửng. Bạn nên kiểm tra lại mật độ tảo, giảm cho ăn, tăng cường sục khí và thay một phần nước ao.' },
      { keywords: ['nước xanh'], reply: 'Nước ao xanh thường do tảo lam phát triển mạnh. Cần kiểm tra pH, giảm bón phân, tăng cường sục khí và thay nước nếu cần.' },
      { keywords: ['nước có mùi','nước hoi','nước thoi','nước tanh'], reply: 'Nước ao có mùi lạ (hôi, tanh, thối) là dấu hiệu môi trường xấu. Nên thay một phần nước, tăng cường sục khí, kiểm tra đáy ao và bổ sung chế phẩm sinh học.' },
      { keywords: ['tôm yếu','tom yeu','tôm bị stress','tom bi stress'], reply: 'Tôm yếu hoặc stress có thể do sốc môi trường, thiếu oxy, dịch bệnh. Nên kiểm tra các chỉ số nước, tăng sục khí, bổ sung vitamin C và khoáng chất.' },
      { keywords: ['tôm chết rải rác','tom chet rai rac','tôm chết','tom chet'], reply: 'Tôm chết rải rác có thể do môi trường xấu hoặc bệnh. Nên kiểm tra pH, DO, NH3, kiểm tra dấu hiệu bệnh và liên hệ chuyên gia nếu cần.' },
      { keywords: ['tôm nổi đầu','tom noi dau'], reply: 'Tôm nổi đầu thường do thiếu oxy hoặc sốc môi trường. Nên tăng cường sục khí, kiểm tra DO, thay nước nếu cần.' },
      { keywords: ['tôm chậm lớn','tom cham lon'], reply: 'Tôm chậm lớn có thể do mật độ nuôi cao, thức ăn kém chất lượng, môi trường không ổn định. Nên kiểm tra lại chế độ cho ăn, chất lượng nước và mật độ thả.' },
      { keywords: ['tôm lột xác','tom lot xac'], reply: 'Khi tôm lột xác, cần hạn chế thay nước, tăng cường khoáng chất, bổ sung vitamin C và kiểm tra độ kiềm, độ mặn.' },
      { keywords: ['sốc môi trường','soc moi truong','sốc nhiệt','soc nhiet'], reply: 'Sốc môi trường/thay đổi nhiệt độ đột ngột dễ làm tôm yếu, chết. Nên thay nước từ từ, bổ sung vitamin C, tăng sục khí và che chắn ao.' },
      { keywords: ['tôm bị bệnh','tom bi benh'], reply: 'Nếu tôm có dấu hiệu bệnh (đốm trắng, đỏ thân, phân trắng...), nên cách ly, giảm mật độ, tăng cường sục khí, bổ sung vitamin và liên hệ chuyên gia để xác định bệnh.' },
      { keywords: ['tôm bị cong thân','tom cong than'], reply: 'Tôm bị cong thân thường do virus hoặc môi trường nước không ổn định. Nên kiểm tra lại các chỉ số nước, giảm mật độ nuôi và liên hệ chuyên gia.' },
      { keywords: ['tôm bơi lờ đờ','tom boi lo do'], reply: 'Tôm bơi lờ đờ có thể do thiếu oxy, sốc môi trường hoặc nhiễm bệnh. Nên tăng cường sục khí, kiểm tra DO và quan sát các dấu hiệu khác.' },
      { keywords: ['tôm đổi màu','tom doi mau'], reply: 'Tôm đổi màu có thể do thiếu khoáng, thiếu oxy hoặc nhiễm bệnh. Nên bổ sung khoáng, kiểm tra môi trường nước và theo dõi sức khỏe tôm.' },
      { keywords: ['tôm bị đốm trắng','tom dom trang'], reply: 'Tôm bị đốm trắng là dấu hiệu bệnh nguy hiểm. Nên cách ly, giảm mật độ, tăng cường sục khí và liên hệ chuyên gia để xác định bệnh.' },
      { keywords: ['tôm bị đỏ thân','tom do than'], reply: 'Tôm bị đỏ thân có thể do sốc môi trường hoặc nhiễm khuẩn. Nên kiểm tra các chỉ số nước, tăng cường sục khí và bổ sung vitamin.' },
      { keywords: ['tôm bị phân trắng','tom phan trang'], reply: 'Tôm bị phân trắng thường do vi khuẩn hoặc ký sinh trùng. Nên bổ sung men vi sinh, kiểm tra thức ăn và vệ sinh ao nuôi.' },
      { keywords: ['tôm bị đóng rong','tom dong rong'], reply: 'Tôm bị đóng rong do môi trường nước nhiều tảo, vệ sinh kém. Nên thay nước, vệ sinh ao và bổ sung chế phẩm sinh học.' },
      { keywords: ['tôm bị mềm vỏ','tom mem vo'], reply: 'Tôm bị mềm vỏ do thiếu khoáng hoặc thay nước đột ngột. Nên bổ sung khoáng, hạn chế thay nước và kiểm tra độ kiềm.' },
      { keywords: ['tôm bị thiếu khoáng','tom thieu khoang'], reply: 'Tôm thiếu khoáng sẽ chậm lớn, vỏ mềm. Nên bổ sung khoáng định kỳ và kiểm tra độ kiềm, độ mặn.' },
      { keywords: ['tôm bị nổi bọt nước','tom noi bot nuoc'], reply: 'Nước ao nổi bọt có thể do dư thừa hữu cơ, tảo phát triển mạnh. Nên giảm cho ăn, tăng cường sục khí và thay một phần nước.' },
      { keywords: ['kiểm tra ph','kiem tra ph'], reply: 'Bạn nên kiểm tra pH nước ao mỗi ngày vào sáng và chiều, giữ pH ổn định 7.5-8.5.' },
      { keywords: ['kiểm tra do','kiem tra do'], reply: 'DO (oxy hòa tan) nên duy trì trên 4 mg/l. Kiểm tra sáng, chiều và tăng cường sục khí khi cần.' },
      { keywords: ['kiểm tra nh3','kiem tra nh3'], reply: 'NH3 (amoniac) là chất độc cho tôm, nên kiểm tra định kỳ và giữ dưới 0.1 mg/l.' },
      { keywords: ['kiểm soát dịch bệnh','kiem soat dich benh'], reply: 'Nên kiểm tra sức khỏe tôm thường xuyên, vệ sinh ao, bổ sung men vi sinh và liên hệ chuyên gia khi phát hiện dấu hiệu bất thường.' },
      { keywords: ['kiểm soát thức ăn','kiem soat thuc an'], reply: 'Cho ăn vừa đủ, tránh dư thừa, kiểm tra thức ăn chìm nổi và điều chỉnh lượng phù hợp với sức ăn của tôm.' },
      { keywords: ['dự án', 'du an', 'shrimptech'], reply: 'SHRIMPTECH là dự án ứng dụng IoT & AI vào nuôi tôm, giúp bà con tối ưu hóa sản xuất, giảm rủi ro và tăng lợi nhuận. Bạn muốn tìm hiểu về công nghệ, đội ngũ hay kết quả thực tế?' },
      { keywords: ['iot', 'thiết bị iot', 'thiet bi iot'], reply: 'Các thiết bị IoT của SHRIMPTECH giúp giám sát nước, điều khiển thiết bị ao nuôi từ xa, cảnh báo sớm các rủi ro. Bạn quan tâm đến loại cảm biến, bộ điều khiển hay giải pháp tổng thể?' },
      { keywords: ['sản phẩm', 'san pham'], reply: 'Chúng tôi cung cấp các bộ kit cảm biến nước, thiết bị IoT, phần mềm quản lý ao nuôi và dịch vụ tư vấn kỹ thuật. Bạn muốn biết chi tiết về sản phẩm nào?' },
      { keywords: ['liên hệ', 'lien he', 'hỗ trợ', 'ho tro'], reply: 'Bạn có thể liên hệ đội ngũ SHRIMPTECH qua email shrimptech.vhu.hutech@gmail.com hoặc số 0901 234 567. Chúng tôi luôn sẵn sàng hỗ trợ!' },
      { keywords: ['cảm ơn', 'cam on', 'thanks', 'thank you'], reply: 'Rất vui được hỗ trợ bạn! Nếu còn thắc mắc, hãy hỏi tiếp nhé.' },
      { keywords: ['xin chào', 'chào', 'hello', 'hi'], reply: 'Xin chào! Tôi là trợ lý AI của SHRIMPTECH. Bạn cần tư vấn về nuôi tôm, IoT hay giải pháp kỹ thuật nào?' },
      { keywords: ['báo giá', 'giá', 'bao gia'], reply: 'Bạn vui lòng cho biết sản phẩm hoặc dịch vụ quan tâm, chúng tôi sẽ gửi báo giá chi tiết và ưu đãi tốt nhất.' },
      { keywords: ['hướng dẫn', 'huong dan'], reply: 'Bạn cần hướng dẫn về thiết bị IoT, phân tích nước hay kỹ thuật nuôi tôm? Hãy mô tả cụ thể để tôi hỗ trợ chi tiết hơn.' },
      { keywords: ['phân tích nước', 'phan tich nuoc'], reply: 'Chúng tôi có thể phân tích các chỉ số nước như pH, DO, nhiệt độ, độ mặn... Bạn muốn kiểm tra chỉ số nào?' },
      { keywords: ['phòng bệnh', 'phong benh'], reply: 'Bạn nên kiểm tra môi trường nước thường xuyên, bổ sung men vi sinh và liên hệ chuyên gia khi phát hiện dấu hiệu bất thường.' },
      { keywords: ['tối ưu chi phí', 'toi uu chi phi', 'lợi nhuận', 'loi nhuan'], reply: 'Để tối ưu chi phí và tăng lợi nhuận, hãy kiểm soát lượng thức ăn, theo dõi môi trường nước bằng IoT và áp dụng các khuyến nghị kỹ thuật từ SHRIMPTECH.' },
      { keywords: ['kỹ thuật nuôi', 'ky thuat nuoi'], reply: 'Bạn muốn tư vấn về kỹ thuật nuôi tôm giai đoạn nào? Tôi có thể hỗ trợ về chọn giống, quản lý nước, phòng bệnh, cho ăn...' },
      // ...existing code...
    ];
    // Ưu tiên cụm từ khóa dài trước
    cases.sort((a, b) => Math.max(...b.keywords.map(k=>k.length)) - Math.max(...a.keywords.map(k=>k.length)));
    let matchedReplies = [];
    let matchedKeywords = new Set();
    for (let c of cases) {
      for (let k of c.keywords) {
        if ((input.includes(k) || inputNoTone.includes(removeVietnameseTones(k))) && !matchedKeywords.has(k)) {
          matchedReplies.push(c.reply);
          c.keywords.forEach(kw => matchedKeywords.add(kw));
          break; // Chỉ lấy 1 reply cho mỗi case
        }
      }
    }
    if (matchedReplies.length > 1) {
      return matchedReplies.map((r,i)=>`• ${r}`).join('<br>');
    } else if (matchedReplies.length === 1) {
      return matchedReplies[0];
    }
    // Các trường hợp chào hỏi, thông tin chung
    if (/(chào|hello|hi|xin chao)/.test(inputNoTone)) return 'Xin chào! Tôi có thể giúp gì cho bạn?';
    if (/(giá|bao gia)/.test(inputNoTone)) return 'Vui lòng để lại thông tin, chúng tôi sẽ liên hệ báo giá chi tiết.';
    if (/(liên hệ|lien he)/.test(inputNoTone)) return 'Bạn có thể liên hệ qua email shrimptech.vhu.hutech@gmail.com hoặc số 0901 234 567.';
    if (/(sản phẩm|san pham)/.test(inputNoTone)) return 'Bạn muốn biết về sản phẩm nào? Chúng tôi có các kit cảm biến, giải pháp IoT, v.v.';
    if (/(tư vấn|tu van)/.test(inputNoTone)) return 'Chúng tôi luôn sẵn sàng tư vấn miễn phí cho bạn!';
    if (/(cảm ơn|cam on)/.test(inputNoTone)) return 'Rất vui được hỗ trợ bạn!';
    if (/(phân tích nước|phan tich nuoc)/.test(inputNoTone)) return 'Chúng tôi có thể phân tích các chỉ số nước như pH, DO, nhiệt độ, độ mặn...';
    if (/(phòng bệnh|phong benh)/.test(inputNoTone)) return 'Bạn nên kiểm tra môi trường nước thường xuyên và sử dụng các biện pháp phòng bệnh chủ động.';
    if (/(hướng dẫn iot|huong dan iot)/.test(inputNoTone)) return 'Bạn cần hướng dẫn về thiết bị IoT nào? Vui lòng nêu rõ hơn.';
    // Tổng hợp mẹo nếu có nhiều từ khóa liên quan
    const generalKeywords = ['thời tiết','mua','nắng','nang','nhiệt độ','nhiet do','bão','bao','lạnh','lanh','gió','gio','mẹo','meo','lời khuyên','loi khuyen','nước ao','nuoc ao','tảo','tao','tôm','tom'];
    let found = generalKeywords.filter(k => input.includes(k) || inputNoTone.includes(removeVietnameseTones(k)));
    if (found.length > 0) {
      return `Một số mẹo ứng phó thời tiết và tình huống thực tế cho nuôi tôm:
- Khi trời mưa lớn: Giảm cho ăn, kiểm tra và điều chỉnh pH, tăng cường sục khí, che chắn ao tránh nước mưa trực tiếp.
- Khi nắng nóng: Tăng mực nước ao, bổ sung nước mới vào sáng sớm hoặc chiều mát, tăng cường sục khí, tránh thay nước đột ngột.
- Khi trời lạnh: Che chắn gió, tăng độ sâu ao, hạn chế thay nước, bổ sung vitamin C vào thức ăn để tăng sức đề kháng cho tôm.
- Khi có bão: Gia cố bờ ao, kiểm tra hệ thống điện, sục khí dự phòng, chuẩn bị máy phát điện nếu có.
- Khi nước ao bất thường (đục, xanh, có mùi...): Thay một phần nước, tăng sục khí, bổ sung chế phẩm sinh học, kiểm tra các chỉ số môi trường.
- Khi tôm yếu, nổi đầu, chết rải rác: Kiểm tra DO, pH, NH3, tăng sục khí, bổ sung vitamin C, liên hệ chuyên gia nếu cần.
- Luôn theo dõi các chỉ số môi trường (pH, nhiệt độ, DO, độ mặn) bằng thiết bị IoT để kịp thời điều chỉnh.
Nếu bạn cần lời khuyên chi tiết cho tình huống cụ thể, hãy mô tả rõ hơn nhé!`;
    }
    // Nếu không rõ ý định, hỏi lại người dùng
    return 'Bạn có thể mô tả rõ hơn về vấn đề hoặc câu hỏi của mình không? Tôi sẽ hỗ trợ chi tiết nhất!';
  }

  // Notification dot demo (ẩn khi mở chat)
  if(notification) notification.style.display = 'block';
  // Ẩn typing indicator mặc định
  hideTyping();
});
