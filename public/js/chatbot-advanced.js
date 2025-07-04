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
      { keywords: ['dự án shrimptech','du an shrimptech','shrimptech là gì','shrimptech la gi','giới thiệu dự án','gioi thieu du an','thông tin dự án','thong tin du an','shrimptech project'], reply: 'SHRIMPTECH là dự án nghiên cứu của sinh viên Đại học Văn Hiến (VHU) & Đại học Công nghệ TP.HCM (HUTECH), hợp tác cùng chuyên gia AHTP TP.HCM. Dự án phát triển hệ thống IoT & AI thông minh giúp tối ưu hóa quy trình nuôi tôm, nâng cao năng suất, giảm rủi ro và bảo vệ môi trường.' },
      { keywords: ['đội ngũ','doi ngu','mentor','giảng viên hướng dẫn','giang vien huong dan'], reply: 'Đội ngũ SHRIMPTECH gồm 5 sinh viên đa ngành từ VHU & HUTECH, được mentor bởi các chuyên gia AHTP TP.HCM và các giảng viên giàu kinh nghiệm.' },
      { keywords: ['mục tiêu dự án','muc tieu du an','ý nghĩa dự án','y nghia du an','sứ mệnh dự án','su menh du an'], reply: 'Mục tiêu của SHRIMPTECH là ứng dụng công nghệ IoT & AI vào nuôi tôm, giúp người nông dân Việt Nam tiếp cận giải pháp hiện đại, tăng năng suất, giảm chi phí và bảo vệ môi trường.' },
      { keywords: ['trường đại học','truong dai hoc','vhu','hutech'], reply: 'Dự án SHRIMPTECH do sinh viên Đại học Văn Hiến (VHU) và Đại học Công nghệ TP.HCM (HUTECH) thực hiện, với sự hỗ trợ từ các chuyên gia và mentor của AHTP TP.HCM.' },
      { keywords: ['đối tác','doi tac','ahtp','chuyên gia ahtp','chuyen gia ahtp'], reply: 'Đối tác chuyên môn của dự án là AHTP TP.HCM, nơi cung cấp tư vấn kỹ thuật, mentor và hỗ trợ nghiên cứu phát triển sản phẩm.' },
      { keywords: ['công nghệ','cong nghe','iot','ai','trí tuệ nhân tạo','tri tue nhan tao'], reply: 'SHRIMPTECH ứng dụng công nghệ IoT (Internet of Things) để giám sát, điều khiển thiết bị ao nuôi và AI (trí tuệ nhân tạo) để phân tích, dự báo, cảnh báo sớm các rủi ro trong nuôi tôm.' },
      { keywords: ['ý nghĩa','y nghia','lợi ích','loi ich','giá trị','gia tri'], reply: 'Dự án mang lại giá trị thực tiễn cho người nuôi tôm: tăng năng suất, giảm rủi ro, tiết kiệm chi phí, bảo vệ môi trường và nâng cao trình độ ứng dụng công nghệ trong nông nghiệp.' },
    ];
    for (let c of cases) {
      for (let k of c.keywords) {
        if (input.includes(k) || inputNoTone.includes(removeVietnameseTones(k))) return c.reply;
      }
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
    return 'Cảm ơn bạn đã liên hệ. Đội ngũ ShrimpTech sẽ phản hồi sớm nhất!';
  }

  // Notification dot demo (ẩn khi mở chat)
  if(notification) notification.style.display = 'block';
  // Ẩn typing indicator mặc định
  hideTyping();
});
