# 📥 VST Host สำหรับ MJM AI Timbre Arpeggiator

## ⚠️ สำคัญ: ต้องดาวน์โหลด VST Host แยก

โฟลเดอร์นี้ **ไม่มีไฟล์ .exe** มาให้เนื่องจากข้อจำกัดด้านลิขสิทธิ์

คุณต้องดาวน์โหลดแยกต่างหาก

---

## 🚀 วิธีติดตั้ง (แนะนำ: SaviHost)

### 🎯 ทำไมต้อง SaviHost?

**SaviHost** เปิด VST ได้ทันทีผ่าน command-line (ไม่ต้องโหลดด้วยตนเอง!)

### ขั้นตอนที่ 1: ดาวน์โหลด SaviHost

ไปที่: **https://www.hermannseib.com/english/savihost.htm**

ดาวน์โหลดไฟล์ ZIP (ฟรี)

### ขั้นตอนที่ 2: แตกไฟล์

แตกไฟล์ ZIP ที่ดาวน์โหลดมา คุณจะได้:
- `SaviHost.exe` ← **ไฟล์หลัก (ต้องมี!)**
- `SaviHost64.exe` ← สำหรับ VST 64-bit (แนะนำ)
- `readme.txt`

### ขั้นตอนที่ 3: คัดลอกไฟล์

คัดลอกไฟล์ทั้งหมดมาไว้ที่โฟลเดอร์นี้:

```
mjm-ai-timbre-desktop/vsthost/
├── SaviHost.exe         ← ต้องมี!
├── SaviHost64.exe       ← แนะนำ (สำหรับ VST 64-bit)
└── README.md
```

### ขั้นตอนที่ 4: Build Installer

```bash
cd mjm-ai-timbre-desktop
npm run dist:win
```

Installer ที่สร้างจะรวม SaviHost ไปโดยอัตโนมัติ! ✅

---

## 🔄 ทางเลือก: VSTHost

ถ้าต้องการใช้ **VSTHost** แทน (ต้องโหลด VST ด้วยตนเอง):

1. ดาวน์โหลด: https://www.hermannseib.com/english/vsthost.htm
2. แตกไฟล์
3. คัดลอก `VSTHost.exe` มาไว้ที่โฟลเดอร์นี้

**หมายเหตุ**: VSTHost ไม่รองรับ command-line loading ต้องโหลด VST เองผ่านเมนู File > Open

---

## 📂 โครงสร้างหลังติดตั้ง

เมื่อผู้ใช้ติดตั้งแอป:

```
C:\Program Files\MJM AI Timbre Arpeggiator\
├── MJM AI Timbre Arpeggiator.exe
├── resources\
│   └── vsthost\
│       ├── SaviHost.exe   ← เปิด VST อัตโนมัติ!
│       └── ...
└── ...
```

---

## 🎯 วิธีใช้

1. เปิดแอป **MJM AI Timbre Arpeggiator**
2. กดปุ่ม **🔍 SCAN VST** เพื่อสแกน VST plugins
3. กดปุ่ม **🖥️** หลังชื่อ VST ที่ต้องการ
4. **SaviHost** จะเปิดขึ้นมาพร้อม VST plugin ทันที! ✅

---

## 📝 หมายเหตุ

- SaviHost / VSTHost เป็นฟรีแวร์ โดย Hermann Seib
- ห้ามแจกจ่ายเชิงพาณิชย์โดยไม่ได้รับอนุญาต
- ดูรายละเอียด: https://www.hermannseib.com/english/

---

## 🆘 แก้ปัญหา

ดูคู่มือแก้ไขปัญหาที่: [`INSTALL-VSTHOST.md`](INSTALL-VSTHOST.md)
