# 📥 วิธีติดตั้ง VST Host สำหรับ MJM AI Timbre Arpeggiator

## ⚠️ ทำไมต้องติดตั้ง VST Host?

แอป **MJM AI Timbre Arpeggiator** ต้องการ VST Host เพื่อเปิด VST plugins

มี 2 ตัวเลือก:

| Host | ข้อดี | ข้อเสีย |
|------|------|--------|
| **🎯 SaviHost** (แนะนำ) | เปิด VST อัตโนมัติ! | - |
| **VSTHost** | ยอดนิยม | ต้องโหลด VST เอง |

---

## 🚀 วิธีที่ 1: ดาวน์โหลด SaviHost (แนะนำ!)

### ขั้นตอนที่ 1: ดาวน์โหลด

1. ไปที่: **https://www.hermannseib.com/english/savihost.htm**
2. ดาวน์โหลดไฟล์ ZIP (ฟรี)

### ขั้นตอนที่ 2: แตกไฟล์

แตกไฟล์ ZIP คุณจะได้:
- `SaviHost.exe` ← สำหรับ VST 32-bit
- `SaviHost64.exe` ← สำหรับ VST 64-bit (แนะนำ!)

### ขั้นตอนที่ 3: คัดลอกไฟล์

คัดลอกไฟล์ไปไว้ที่โฟลเดอร์ติดตั้งแอป:

**สำหรับ Installer:**
```
C:\Program Files\MJM AI Timbre Arpeggiator\vsthost\SaviHost.exe
C:\Program Files\MJM AI Timbre Arpeggiator\vsthost\SaviHost64.exe
```

**สำหรับ Portable:**
```
[โฟลเดอร์ที่แตกไฟล์แอป]\vsthost\SaviHost.exe
[โฟลเดอร์ที่แตกไฟล์แอป]\vsthost\SaviHost64.exe
```

### ขั้นตอนที่ 4: เปิดแอปใหม่

1. ปิดแอป (ถ้าเปิดอยู่)
2. เปิดแอปใหม่
3. กดปุ่ม **🔍 SCAN VST**
4. กดปุ่ม **🖥️** หลัง VST ที่ต้องการ
5. **VST จะเปิดขึ้นมาทันที!** ✅

---

## 🔄 วิธีที่ 2: ดาวน์โหลด VSTHost (ทางเลือก)

### ขั้นตอนที่ 1: ดาวน์โหลด

1. ไปที่: **https://www.hermannseib.com/english/vsthost.htm**
2. ดาวน์โหลดไฟล์ ZIP (ฟรี)

### ขั้นตอนที่ 2: แตกไฟล์

แตกไฟล์ ZIP คุณจะได้:
- `VSTHost.exe` ← ไฟล์หลัก
- `VSTHostBridge64.exe`
- `VSTHostBridge.exe`

### ขั้นตอนที่ 3: คัดลอกไฟล์

คัดลอก `VSTHost.exe` ไปไว้ที่:
```
[โฟลเดอร์แอป]\vsthost\VSTHost.exe
```

### ขั้นตอนที่ 4: เปิด VST (ต้องโหลดเอง!)

1. เปิดแอป **MJM AI Timbre Arpeggiator**
2. กดปุ่ม **🖥️** หลัง VST ที่ต้องการ
3. **VSTHost จะเปิดขึ้นมา** (แต่ยังไม่มี VST)
4. ใน VSTHost: **File > Open VST Plugin**
5. เลือกไฟล์ VST ที่ต้องการ
6. VST UI จะปรากฏขึ้น!

---

## ❓ วิธีเช็คว่าติดตั้งสำเร็จ

### สำหรับ SaviHost:
1. เปิดแอป
2. กด **🔍 SCAN VST**
3. กด **🖥️** หลัง VST
4. ถ้า VST เปิดขึ้นมาทันที = ✅ สำเร็จ!

### สำหรับ VSTHost:
1. เปิดแอป
2. กด **🔍 SCAN VST**
3. กด **🖥️** หลัง VST
4. ถ้า VSTHost เปิดขึ้นมา = ✅ สำเร็จ!
5. โหลด VST เองผ่านเมนู File > Open

---

## 📝 หมายเหตุ

- **SaviHost / VSTHost เป็นฟรีแวร์** - ดาวน์โหลดได้ฟรี
- **ไม่ต้องติดตั้ง** - แค่แตกไฟล์และคัดลอก
- **รองรับทั้ง VST2 และ VST3**
- **ใช้ได้กับ Windows 10/11 (64-bit)**

---

## 🆘 แก้ปัญหา

### ❌ เปิดแล้วไม่มีอะไรเกิดขึ้น

- เช็คว่าวางไฟล์ `.exe` ถูกที่หรือยัง
- ลองรันแอปใหม่
- ตรวจสอบว่า VST เป็น 64-bit หรือ 32-bit ให้ตรงกับ Host

### ❌ ขึ้น Error "VST Host not found"

- กดปุ่ม **"📥 Download"** ในแอป
- ดาวน์โหลดและติดตั้งตามวิธีที่ 1

### ❌ VST ไม่เปิด UI (VSTHost)

- ใน VSTHost: **Options > Visuals**
- ทำเครื่องหมาย ✓ **"Show GUI"**
- โหลด VST ใหม่

### ❌ VST เปิดแต่ไม่มีเสียง

- ตรวจสอบว่า VST ถูกโหลดถูกต้อง
- ตรวจสอบ audio output ใน VSTHost
- ลอง VST อื่นดู

---

## 🔗 ลิงก์ดาวน์โหลด

| Host | ลิงก์ |
|------|------|
| **🎯 SaviHost** (แนะนำ) | https://www.hermannseib.com/english/savihost.htm |
| VSTHost | https://www.hermannseib.com/english/vsthost.htm |

