# Chatbot Component

## Tổng quan
Component chatbot được tách riêng để dễ quản lý và tái sử dụng trên nhiều trang khác nhau.

## Cấu trúc files
```
components/
├── chatbot.html          # HTML template của chatbot widget
js/
├── chatbot-loader.js     # Script tự động load chatbot component
├── main.js              # Logic chính của chatbot (class Chatbot)
```

## Cách hoạt động

### 1. Auto-loading System
- `chatbot-loader.js` tự động load `chatbot.html` qua fetch API
- Chèn chatbot widget vào cuối `<body>` của trang
- Tự động khởi tạo chatbot functionality

### 2. Integration
Trong file HTML chính, chỉ cần thêm:
```html
<script src="js/chatbot-loader.js"></script>
<script src="js/main.js"></script>
```

### 3. Chatbot Class
Chatbot functionality được quản lý bởi class `Chatbot` trong `main.js`:
- Xử lý mở/đóng chat
- Quản lý tin nhắn
- Quick replies
- Responsive design

## Sử dụng trên các trang khác

### Cách 1: Auto-load (Khuyến nghị)
```html
<script src="../js/chatbot-loader.js"></script>
<script src="../js/main.js"></script>
```

### Cách 2: Manual include
```html
<div id="chatbot-placeholder"></div>
<script>
    fetch('../components/chatbot.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('chatbot-placeholder').innerHTML = html;
            if (typeof initChatbot === 'function') {
                initChatbot();
            }
        });
</script>
```

## Customization

### Thay đổi nội dung
Chỉnh sửa file `components/chatbot.html` để thay đổi:
- Tin nhắn chào mừng
- Quick reply buttons
- Avatar và branding

### Thay đổi styling
Chatbot CSS nằm trong file CSS chính với class prefix `.chatbot-*`

### Thay đổi logic
Chỉnh sửa class `Chatbot` trong `js/main.js`

## Browser Support
- Modern browsers với fetch API support
- Fallback cho browsers cũ có thể cần polyfill

## Benefits của việc tách component
1. **Maintainability**: Dễ sửa đổi và cập nhật
2. **Reusability**: Sử dụng lại trên nhiều trang
3. **Performance**: Load chatbot khi cần thiết
4. **Clean Code**: HTML chính gọn gàng hơn
5. **Modularity**: Tách biệt concerns
