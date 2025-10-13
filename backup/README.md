# 🦐 ShrimpTech Backup System

Hệ thống backup tự động cho dự án ShrimpTech IoT.

## 📁 Cấu trúc

```
backup/
├── daily/              # Backup tự động hàng ngày
├── database/           # Backup dữ liệu cảm biến
└── *.zip              # Manual backup files
```

## 🛠️ Scripts có sẵn

### Windows Batch Scripts

- `backup-project.bat` - Backup toàn bộ dự án
- `backup-database.bat` - Backup chỉ dữ liệu
- `restore-project.bat` - Khôi phục từ backup
- `auto-backup.bat` - Backup tự động hàng ngày

### Node.js Script

- `backup.js` - Backup system với Node.js

## 🚀 Cách sử dụng

### 1. Manual Backup

```cmd
# Windows
cd scripts
backup-project.bat

# Hoặc với Node.js
node backup.js create manual
```

### 2. Database Backup

```cmd
cd scripts
backup-database.bat
```

### 3. Auto Daily Backup

```cmd
cd scripts
auto-backup.bat
```

### 4. Restore Project

```cmd
cd scripts
restore-project.bat
```

### 5. List Backups

```cmd
node scripts/backup.js list
```

## ⚙️ Cấu hình

### Backup bao gồm:
- ✅ Source code (`public/`, `config/`, `scripts/`, `docs/`, `tests/`)
- ✅ Configuration files (`package.json`, `server.js`, etc.)
- ✅ Documentation (`README.md`, `docs/`)
- ✅ Environment file (`.env`) - **Cẩn thận với thông tin nhạy cảm**
- ✅ Database files (`data/`)
### Giới hạn:
- **Tự động dọn dẹp**: Giữ 7 backup gần nhất (daily)
- **Manual backup**: Giữ 10 backup gần nhất
- **Định dạng**: ZIP compression với level 9

## 📅 Lịch trình đề xuất

### Hàng ngày
```cmd
# Tạo scheduled task Windows
schtasks /create /tn "ShrimpTech Daily Backup" /tr "D:\ReactNative_Project\ShrimpTech2\scripts\auto-backup.bat" /sc daily /st 23:00
```

### Hàng tuần
```cmd
# Manual backup quan trọng
backup-project.bat
```

### Trước deployment
```cmd
# Backup trước khi deploy
backup-project.bat
backup-database.bat
```

## 🔐 Bảo mật

### ⚠️ Lưu ý quan trọng:
1. **Environment Variables**: File `.env` chứa thông tin nhạy cảm
2. **Database Credentials**: Kiểm tra backup database
3. **API Keys**: Đảm bảo không public backup chứa keys
4. **Storage Location**: Lưu backup ở vị trí an toàn

### 🛡️ Best Practices:
- Encrypt backup files quan trọng
- Lưu trữ backup offline/cloud riêng biệt  
- Kiểm tra backup định kỳ
- Test restore process

## 🚨 Emergency Recovery

### Khôi phục nhanh:
1. Chạy `restore-project.bat`
2. Chọn backup file
3. Chạy `npm install` sau khi restore
4. Kiểm tra file `.env` và cấu hình

### Data Recovery:
1. Restore database từ `backup/database/`
2. Kiểm tra sensor data integrity
3. Verify API connections

## 📞 Hỗ trợ

Nếu có vấn đề với backup system:
1. Kiểm tra logs trong terminal
2. Verify file permissions
3. Liên hệ team ShrimpTech: shrimptech.vhu.hutech@gmail.com
