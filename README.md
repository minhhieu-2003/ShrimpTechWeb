# SHRIMP TECH Website

## Tổng quan
Website chuyên nghiệp cho SHRIMP TECH - Hệ thống giám sát quản lý tự động ao tôm tích hợp Deep Learning.

## Tính năng chính

### 🎨 Thiết kế hiện đại
- **Responsive Design**: Tương thích mọi thiết bị (desktop, tablet, mobile)
- **Modern UI/UX**: Thiết kế gradient, animations mượt mà
- **Professional Layout**: Layout chuyên nghiệp như các công ty công nghệ hàng đầu

### 📱 Các phần chính
1. **Hero Section**: Giới thiệu chính với animation và stats
2. **Solutions**: 3 giải pháp core (AI/Deep Learning, IoT, Mobile App)
3. **Technology**: Công nghệ tiên tiến với interactive diagram
4. **Products**: 3 gói sản phẩm (Starter, Professional, Enterprise)
5. **About**: Giới thiệu công ty và team
6. **Contact**: Form liên hệ với validation

### ⚡ Tính năng tương tác
- **Smooth scrolling navigation**
- **Mobile hamburger menu**
- **Typing animation** cho hero title
- **Counter animation** cho statistics
- **Parallax effects**
- **Intersection Observer** cho scroll animations
- **Form validation** với notification system
- **Floating cards animation**

### 🛠️ Công nghệ sử dụng
- **HTML5**: Semantic markup
- **CSS3**: 
  - Flexbox & Grid Layout
  - CSS Animations & Transitions
  - Custom Properties (CSS Variables)
  - Responsive Design
- **Vanilla JavaScript**: 
  - ES6+ features
  - Intersection Observer API
  - Form handling & validation
  - Dynamic animations

## Cấu trúc file

```
website-main/
├── index.html          # Trang chủ chính
├── styles.css          # CSS styles và animations chính
├── package.json        # Cấu hình project
├── README.md           # Documentation này
├── .vscode/            # VS Code configuration
│   ├── tasks.json      # Build tasks
│   └── launch.json     # Debug configuration
├── assets/             # Hình ảnh và tài nguyên
│   ├── Logo.jpg        # Logo công ty
│   ├── hero-dashboard.svg  # Hero image
│   └── ... (các file SVG và hình ảnh khác)
├── js/                 # JavaScript files
│   └── main.js         # JavaScript functionality chính
├── styles/             # CSS files bổ sung
│   └── pages.css       # CSS cho các trang phụ
└── pages/              # Các trang HTML
    ├── solutions.html  # Trang giải pháp
    ├── products.html   # Trang sản phẩm
    ├── partners.html   # Trang đối tác
    ├── team.html       # Trang đội ngũ
    └── contact.html    # Trang liên hệ
```

## Hướng dẫn chạy

### 1. Cách đơn giản
Mở file `index.html` trực tiếp trong trình duyệt.

### 2. Sử dụng Live Server (Khuyến nghị)
```bash
# Cài đặt Live Server global
npm install -g live-server

# Chạy trong thư mục website
live-server
```

### 3. Sử dụng Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Sau đó truy cập: http://localhost:8000

## Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ffeaa7;
}
```

### Thay đổi nội dung
- **Thông tin công ty**: Chỉnh sửa trong `index.html`
- **Giá sản phẩm**: Cập nhật section `#products`
- **Thông tin liên hệ**: Cập nhật section `#contact`

### Thêm hình ảnh
1. Thêm file vào thư mục `assets/`
2. Cập nhật đường dẫn trong HTML
3. Tối ưu hình ảnh cho web (WebP format khuyến nghị)

## Tính năng nâng cao có thể thêm

### 🔮 Giai đoạn 2
- [ ] **Blog section** với CMS
- [ ] **Case studies** với khách hàng thực tế
- [ ] **Live chat** integration
- [ ] **Multi-language** support (EN/VI)
- [ ] **Dark mode** toggle
- [ ] **3D animations** với Three.js

### 📊 Analytics & SEO
- [ ] Google Analytics integration
- [ ] SEO optimization
- [ ] Open Graph meta tags
- [ ] Schema markup
- [ ] Sitemap generation

### 🚀 Performance
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Service Worker cho offline
- [ ] CDN integration
- [ ] Minification & compression

## Triển khai Production

### 1. Static Hosting (Khuyến nghị)
- **Netlify**: Drag & drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Miễn phí với GitHub repo

### 2. Traditional Hosting
- Upload toàn bộ thư mục `website/` lên web server
- Đảm bảo file `index.html` ở root directory

### 3. Domain & SSL
- Mua domain từ các nhà cung cấp
- Cấu hình DNS pointing
- SSL certificate (Let's Encrypt miễn phí)

## Hỗ trợ Browser
- ✅ Chrome 80+
- ✅ Firefox 75+  
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ IE 11 (limited support)

## Performance Metrics
- **Lighthouse Score**: 90+ (tất cả categories)
- **Load Time**: < 3 seconds
- **FCP**: < 1.5 seconds
- **CLS**: < 0.1

## Contact & Support
Để được hỗ trợ hoặc tùy chỉnh thêm, vui lòng liên hệ team development.

---

**SHRIMP TECH** - Cách mạng hóa nuôi trồng thủy sản với AI & IoT 🦐🤖
