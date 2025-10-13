# 🌐 HƯỚNG DẪN SETUP CUSTOM DOMAIN SHRIMPTECH.VN

## 📋 Các bước thực hiện

### 1. **Thêm custom domain vào Firebase Hosting**

```bash
# Đăng nhập Firebase (nếu chưa)
firebase login

# Chọn project
firebase use shrimptech-c6e93

# Thêm custom domain
firebase hosting:domain:create shrimptech.vn
firebase hosting:domain:create www.shrimptech.vn
```

### 2. **Cấu hình DNS Records**

Sau khi chạy lệnh trên, Firebase sẽ cung cấp các DNS records cần setup:

#### Tại nhà cung cấp domain (ví dụ: GoDaddy, Namecheap, CloudFlare):

```
# A Record cho domain chính
Type: A
Name: @
Value: [IP được Firebase cung cấp]
TTL: 3600

# CNAME cho www subdomain  
Type: CNAME
Name: www
Value: shrimptech-c6e93.web.app
TTL: 3600

# TXT Record để verify ownership
Type: TXT
Name: @
Value: [TXT value được Firebase cung cấp]
TTL: 3600
```

### 3. **Kiểm tra trạng thái domain**

```bash
# Kiểm tra trạng thái domain setup
firebase hosting:domain:list

# Output sẽ hiển thị:
# shrimptech.vn - PENDING hoặc CONNECTED
# www.shrimptech.vn - PENDING hoặc CONNECTED
```

### 4. **Chờ DNS propagation**

- DNS thường mất **15 phút - 48 giờ** để propagate
- Có thể kiểm tra bằng: https://dnschecker.org
- Firebase sẽ tự động issue SSL certificate khi DNS đã propagate

### 5. **Verify domain hoạt động**

```bash
# Test domain
curl -I https://shrimptech.vn
curl -I https://www.shrimptech.vn

# Hoặc mở trình duyệt:
# https://shrimptech.vn
# https://www.shrimptech.vn
```

---

## 🔧 Lệnh Firebase CLI chi tiết

### Thêm domain:
```bash
firebase hosting:domain:create shrimptech.vn
```

### Xem danh sách domains:
```bash
firebase hosting:domain:list
```

### Xóa domain (nếu cần):
```bash
firebase hosting:domain:delete shrimptech.vn
```

---

## ⚠️ Lưu ý quan trọng

### 1. **Ownership Verification**
- Firebase yêu cầu verify ownership qua DNS TXT record
- TXT record phải được thêm trước khi domain có thể activate

### 2. **SSL Certificate**
- Firebase tự động tạo SSL certificate miễn phí
- SSL được issue sau khi DNS verification thành công
- Certificate tự động renew

### 3. **WWW Redirect**
- Firebase tự động redirect www.shrimptech.vn → shrimptech.vn
- Hoặc ngược lại tùy cấu hình

### 4. **Propagation Time**
- DNS changes có thể mất tới 48h để hoàn toàn propagate
- Thường chỉ mất 15-30 phút cho hầu hết regions

---

## 🧪 Commands để test

```bash
# Test DNS resolution
nslookup shrimptech.vn
nslookup www.shrimptech.vn

# Test HTTP response
curl -I https://shrimptech.vn
curl -I https://www.shrimptech.vn

# Test SSL certificate
openssl s_client -connect shrimptech.vn:443 -servername shrimptech.vn
```

---

## 📱 Mobile testing

Sau khi setup xong, test trên:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Different networks (WiFi, 4G, VPN)

---

## 🎯 Expected Results

Khi setup thành công:

✅ **https://shrimptech.vn** → Hiển thị website  
✅ **https://www.shrimptech.vn** → Redirect về shrimptech.vn  
✅ **SSL Certificate** → Valid và trusted  
✅ **Firebase Console** → Domain status "CONNECTED"  

---

## 🆘 Troubleshooting

### Domain không connect:
1. Kiểm tra DNS records đã đúng chưa
2. Chờ thêm thời gian cho DNS propagation  
3. Xóa và tạo lại domain trong Firebase

### SSL không hoạt động:
1. Chờ DNS propagation hoàn tất
2. Firebase cần 15-30 phút để issue SSL
3. Kiểm tra domain ownership verification

### Website không load:
1. Verify DNS với `nslookup shrimptech.vn`
2. Check Firebase deployment: `firebase hosting:sites:list`
3. Test trực tiếp Firebase URL để isolate issue

---

*Sau khi hoàn tất, website sẽ accessible tại **https://shrimptech.vn** với SSL certificate tự động!*