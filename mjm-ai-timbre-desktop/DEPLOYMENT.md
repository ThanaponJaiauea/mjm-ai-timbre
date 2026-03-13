# 📥 วิธีเผยแพร่ Desktop App ให้ผู้ใช้ดาวน์โหลด

## ไฟล์ที่ Build แล้ว

ไฟล์ ZIP สำหรับ Windows อยู่ที่:
```
dist/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip
```

ขนาดไฟล์: ~106 MB

---

## วิธีที่ 1: GitHub Releases (แนะนำ - ฟรี)

### ขั้นตอน:

1. **สร้าง Release ใหม่บน GitHub**
   - ไปที่: `https://github.com/YOUR_USERNAME/mjm-ai-timbre/releases`
   - คลิก "Create a new release"
   - Tag version: `v1.0.0`
   - Release title: `v1.0.0 - Desktop App`
   - กด "Publish release"

2. **อัพโหลดไฟล์ ZIP**
   - คลิก "Attach binaries by dropping them here or selecting them"
   - ลากไฟล์ `MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip` ไปวาง
   - รออัพโหลดเสร็จ

3. **Copy Download URL**
   - หลังจากอัพโหลดเสร็จ จะได้ URL แบบนี้:
   ```
   https://github.com/YOUR_USERNAME/mjm-ai-timbre/releases/download/v1.0.0/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip
   ```

4. **แก้ URL ใน Web App**
   - เปิดไฟล์: `src/components/instruments/Arpeggiator.tsx`
   - หาบรรทัดที่มี `const downloadUrl = ...`
   - แก้ URL ให้ตรงกับที่ได้จาก GitHub

5. **Deploy Web App ใหม่**
   ```bash
   npm run build
   npm run deploy
   ```

---

## วิธีที่ 2: Google Drive

### ขั้นตอน:

1. **อัพโหลดไฟล์ขึ้น Google Drive**
   - ไปที่: `https://drive.google.com`
   - อัพโหลดไฟล์ `MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip`

2. **ตั้งค่า Sharing**
   - คลิกขวาที่ไฟล์ → Share
   - เลือก "Anyone with the link"
   - Copy link

3. **แก้ URL ใน Web App**
   - เปิดไฟล์: `src/components/instruments/Arpeggiator.tsx`
   - แก้ `downloadUrl` เป็น link จาก Google Drive
   - ⚠️ หมายเหตุ: Google Drive link อาจต้องแปลงเป็น direct download link
   - ใช้เครื่องมือเช่น: https://sites.google.com/site/gdocs2direct/

---

## วิธีที่ 3: Web Server ของคุณ

### ขั้นตอน:

1. **อัพโหลดไฟล์ขึ้น Server**
   ```bash
   # ใช้ FTP/SFTP หรือ SCP
   scp dist/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip user@your-server:/var/www/html/downloads/
   ```

2. **URL จะได้เป็น**
   ```
   https://your-domain.com/downloads/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip
   ```

3. **แก้ URL ใน Web App**
   - เปิดไฟล์: `src/components/instruments/Arpeggiator.tsx`
   - แก้ `downloadUrl` ให้ชี้ไปที่ server ของคุณ

---

## วิธีทดสอบการดาวน์โหลด

1. **เปิด Web App**
2. **กดปุ่ม "🖥️ Download Desktop"**
3. **ตรวจสอบว่า:**
   - Modal เด้งขึ้นมา
   - กดปุ่ม "⬇ DOWNLOAD"
   - ไฟล์ ZIP เริ่มดาวน์โหลด
   - ขนาดไฟล์ ~106 MB

---

## วิธีใช้ Desktop App (สำหรับผู้ใช้)

1. **ดาวน์โหลดไฟล์ ZIP**
2. **แตกไฟล์** (คลิกขวา → Extract All)
3. **รันไฟล์** `MJM-AI-Timbre-Arpeggiator.exe`
4. **กดปุ่ม "🔍 SCAN VST"** เพื่อสแกน VST plugins

---

## การ Build เวอร์ชันใหม่

เมื่อมีการแก้ไขโค้ด:

1. **แก้โค้ด** ใน `mjm-ai-timbre-desktop/`
2. **Build ใหม่**
   ```bash
   cd mjm-ai-timbre-desktop
   npm run dist:win
   ```
3. **อัพเดท version** ใน `package.json`
4. **อัพโหลดไฟล์ ZIP ใหม่** ขึ้น Server/GitHub
5. **แก้ URL** ใน Web App

---

## 📝 หมายเหตุ

- ไฟล์ ZIP มีขนาด ~106 MB เพราะรวม Electron runtime
- ผู้ใช้ไม่จำเป็นต้องติดตั้งโปรแกรมเสริม
- รันได้ทันทีบน Windows 10/11 (64-bit)
- ถ้าต้องการ build สำหรับ macOS หรือ Linux ใช้คำสั่ง:
  ```bash
  npm run dist:mac
  npm run dist:linux
  ```
