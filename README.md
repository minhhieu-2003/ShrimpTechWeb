# SHRIMP TECH - Hệ thống IoT thông minh cho nuôi tôm

🦐 **Dự án nghiên cứu sinh viên VHU & HUTECH**

## Giới thiệu

SHRIMP TECH là dự án nghiên cứu từ sinh viên **Đại học Văn Hiến (VHU)** và **Đại học Công nghệ TP.HCM (HUTECH)** với sự tư vấn từ **AHTP TP.HCM**. Dự án ứng dụng công nghệ IoT & AI để tự động hóa và tối ưu hệ thống nuôi tôm Việt Nam.

## Tính năng chính

- 🌊 **Giám sát thông số nước**: pH, nhiệt độ, độ mặn, oxy hòa tan
- 🤖 **Tự động hóa 95%**: Điều khiển thiết bị thông minh
- 📱 **Ứng dụng mobile**: Giám sát 24/7 từ xa
- 🧠 **AI & Machine Learning**: Dự đoán và cảnh báo sớm
- ☁️ **Cloud-based**: Lưu trữ và xử lý dữ liệu
- 🔒 **Bảo mật cao**: Mã hóa dữ liệu end-to-end

## Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Font Awesome 6.0.0
- Responsive Design

### Backend
- RESTful API
- Apache/Nginx

### IoT & Hardware
- ESP32/Arduino
- Sensors: pH, nhiệt độ, DO, độ mặn
- WiFi/LoRa Communication
- Solar Power System

## Cài đặt và Deployment

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/shrimptech/shrimptech-iot.git
   cd shrimptech-iot
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

### Development

```bash
# Chạy local development server
npm start
```

### Deployment

```bash
# Build project
npm run build
```

### Deployment với script tự động

Trên Windows:
```cmd
deploy.bat
```

## Cấu trúc dự án

```
shrimptech/
├── public/                 # Web files
│   ├── index.html         # Trang chủ
│   ├── pages/             # Các trang con
│   ├── assets/            # Hình ảnh, icons
│   ├── styles/            # CSS files
│   └── js/                # JavaScript files
├── src/                   # Source files
└── README.md             # Documentation
```

## API Endpoints

### Sensor Data
- `GET /api/sensors` - Lấy dữ liệu cảm biến
- `POST /api/sensors` - Gửi dữ liệu cảm biến
- `PUT /api/sensors` - Cập nhật dữ liệu

### Alerts
- `POST /api/alerts` - Tạo cảnh báo
- `GET /api/status` - Trạng thái hệ thống

### Contact
- `POST /api/contact` - Gửi form liên hệ

## Đội ngũ phát triển

### Sinh viên nghiên cứu (5 thành viên)
- **VHU**: Chuyên ngành Điện tử viễn thông
- **HUTECH**: Chuyên ngành Thương mại điện tử

### Mentor & Tư vấn
- **AHTP TP.HCM**: Hỗ trợ kỹ thuật và định hướng

## Đối tác

- 🏫 **Đại học Văn Hiến (VHU)**
- 🏫 **Đại học Công nghệ TP.HCM (HUTECH)**
- 🏢 **AHTP TP.HCM**
- 🤝 **3+ đối tác tiềm năng**

## Liên hệ

- 📧 **Email**: shrimptech.vhu.hutech@gmail.com
- 📱 **Hotline**: 0835749407
- 🏢 **Địa chỉ**: VHU & HUTECH, TP.HCM
- ⏰ **Giờ làm việc**: T2-T6: 8:00-17:00

## License

MIT License - Dự án nghiên cứu sinh viên VHU & HUTECH

---

**© 2025 SHRIMPTECH - Dự án nghiên cứu sinh viên VHU & HUTECH. All rights reserved.**
