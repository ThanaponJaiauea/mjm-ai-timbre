# 📚 MJM AI Timbre Desktop - Complete Documentation

# คู่มือการใช้งาน MJM AI Timbre Desktop แบบครบวงจร

---

## Table of Contents | สารบัญ

1. [Overview | ภาพรวม](#1-overview--ภาพรวม)
2. [Features | ฟีเจอร์](#2-features--ฟีเจอร์)
3. [System Requirements | ความต้องการของระบบ](#3-system-requirements--ความต้องการของระบบ)
4. [Installation | การติดตั้ง](#4-installation--การติดตั้ง)
5. [VST Host Setup | การติดตั้ง VST Host](#5-vst-host-setup--การติดตั้ง-vst-host)
6. [Using the Application | วิธีใช้งาน](#6-using-the-application--วิธีใช้งาน)
7. [Project Structure | โครงสร้างโปรเจกต์](#7-project-structure--โครงสร้างโปรเจกต์)
8. [Development Guide | คู่มือสำหรับนักพัฒนา](#8-development-guide--คู่มือสำหรับนักพัฒนา)
9. [Building & Deployment | การ Build และเผยแพร่](#9-building--deployment--การ-build-และเผยแพร่)
10. [Troubleshooting | แก้ปัญหา](#10-troubleshooting--แก้ปัญหา)
11. [FAQ | คำถามที่พบบ่อย](#11-faq--คำถามที่พบบ่อย)

---

## 1. Overview | ภาพรวม

### 🇬🇧 English

**MJM AI Timbre Desktop** is a cross-platform desktop application for music production, featuring a powerful arpeggiator with VST plugin support. Built with Electron, React, and TypeScript, it provides a native desktop experience for musicians and producers.

The application allows you to:
- Create arpeggiated melodies with customizable parameters
- Load and control VST plugins for sound generation
- Use genre-specific presets for quick setup
- Work offline without a browser connection

### 🇹🇭 ไทย

**MJM AI Timbre Desktop** เป็นแอปพลิเคชันเดสก์ท็อปข้ามแพลตฟอร์มสำหรับการผลิตดนตรี มาพร้อม arpeggiator ทรงพลังที่รองรับ VST plugin สร้างด้วย Electron, React และ TypeScript ให้ประสบการณ์การใช้งานแบบ native สำหรับนักดนตรีและโปรดิวเซอร์

แอปพลิเคชันช่วยให้คุณ:
- สร้างทำนอง arpeggiated ด้วยพารามิเตอร์ที่ปรับแต่งได้
- โหลดและควบคุม VST plugins สำหรับสร้างเสียง
- ใช้ preset ตามประเภทเพลงเพื่อตั้งค่ารวดเร็ว
- ทำงานแบบ offline ไม่ต้องเชื่อมต่อเบราว์เซอร์

---

## 2. Features | ฟีเจอร์

### 🎹 Arpeggiator Controls | การควบคุม Arpeggiator

| Parameter | Description (EN) | คำอธิบาย (TH) |
|-----------|------------------|---------------|
| **PLAY/STOP** | Start/stop the arpeggiator | เริ่ม/หยุด arpeggiator |
| **BPM** | Tempo control (40-240 BPM) | ควบคุมจังหวะ (40-240 BPM) |
| **VOLUME** | Master output volume | ระดับเสียงหลัก |
| **OCTAVES** | Number of octaves to span | จำนวนช่วงอ็อกเทฟ |
| **GATE** | Note gate length | ความยาวโน้ต |
| **PATTERN** | Up, Down, UpDown, Random | รูปแบบ: ขึ้น, ลง, ขึ้น-ลง, สุ่ม |
| **WAVEFORM** | Sine, Square, Sawtooth, Triangle | รูปคลื่น: ซายน์, สแควร์, ซอว์, ไทรแองเกิล |
| **KEY** | Root note for arpeggio | โน้ตหลักของ arpeggio |
| **SCALE** | Musical scale (Major, Minor, etc.) | สเกลดนตรี (เมเจอร์, ไมเนอร์, ฯลฯ) |

### 🔌 VST Plugin Support | รองรับ VST Plugin

- **VST2 & VST3** support
- **Auto-scan** default VST folders
- **Custom folder** selection
- **One-click launch** in VSTHost

### 🎼 Genre Presets | Preset ตามประเภทเพลง

- TRANCE
- SYNTHWAVE
- TECHNO
- AMBIENT
- CHIPTUNE
- DEEP HOUSE
- DNB (Drum & Bass)
- LO-FI
- CYBERPUNK
- CLASSICAL
- FREESTYLE

### 💻 Platform Support | รองรับแพลตฟอร์ม

- ✅ Windows 10/11 (64-bit)
- ✅ macOS (Intel & Apple Silicon)
- ✅ Linux (x64)

---

## 3. System Requirements | ความต้องการของระบบ

### Minimum Requirements | ความต้องการขั้นต่ำ

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10 / macOS 10.15 / Linux (Ubuntu 20.04+) |
| **CPU** | Intel Core i3 or equivalent |
| **RAM** | 4 GB |
| **Storage** | 500 MB free space |
| **Audio** | Any audio output device |

### Recommended Requirements | ความต้องการแนะนำ

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 11 / macOS 12+ / Linux (Ubuntu 22.04+) |
| **CPU** | Intel Core i5 or equivalent |
| **RAM** | 8 GB or more |
| **Storage** | 1 GB free space (SSD recommended) |
| **Audio** | ASIO driver (Windows) or Core Audio (macOS) |

### Additional Requirements | ความต้องการเพิ่มเติม

- **VST Host**: SaviHost or VSTHost (for VST plugin UI)
- **VST Plugins**: Your own VST2/VST3 plugins
- **Visual C++ Redistributable**: For SaviHost (Windows)

---

## 4. Installation | การติดตั้ง

### 4.1 From Pre-built Installer (Recommended) | จาก Installer สำเร็จรูป (แนะนำ)

#### 🇬🇧 English

1. **Download the installer**
   - Windows: `MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe`
   - macOS: `MJM-AI-Timbre-Arpeggiator.dmg`
   - Linux: `MJM-AI-Timbre-Arpeggiator.AppImage`

2. **Run the installer**
   - Windows: Double-click the `.exe` file
   - macOS: Drag to Applications folder
   - Linux: Make executable and run

3. **Launch the application**
   - Find it in your Applications/Start Menu

#### 🇹🇭 ไทย

1. **ดาวน์โหลด installer**
   - Windows: `MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe`
   - macOS: `MJM-AI-Timbre-Arpeggiator.dmg`
   - Linux: `MJM-AI-Timbre-Arpeggiator.AppImage`

2. **รัน installer**
   - Windows: ดับเบิ้ลคลิกไฟล์ `.exe`
   - macOS: ลากไปไว้ที่โฟลเดอร์ Applications
   - Linux: ทำให้เป็น executable แล้วรัน

3. **เปิดแอปพลิเคชัน**
   - หาได้ใน Applications/Start Menu

### 4.2 Portable Version (Windows) | เวอร์ชัน Portable (Windows)

#### 🇬🇧 English

1. Download: `MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip`
2. Extract the ZIP file to any folder
3. Run: `MJM-AI-Timbre-Arpeggiator.exe`
4. No installation required!

#### 🇹🇭 ไทย

1. ดาวน์โหลด: `MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip`
2. แตกไฟล์ ZIP ไปยังโฟลเดอร์ใดๆ
3. รัน: `MJM-AI-Timbre-Arpeggiator.exe`
4. ไม่ต้องติดตั้ง!

### 4.3 Build from Source | Build จาก Source Code

See [Development Guide](#8-development-guide--คู่มือสำหรับนักพัฒนา) for detailed instructions.

---

## 5. VST Host Setup | การติดตั้ง VST Host

> ⚠️ **IMPORTANT | สำคัญ**: A VST Host is required to open VST plugin interfaces.

> ⚠️ **สำคัญ**: ต้องมี VST Host เพื่อเปิดหน้าต่างควบคุมของ VST plugin

### 5.1 Recommended: SaviHost | แนะนำ: SaviHost

#### 🇬🇧 English

**Why SaviHost?**
- ✅ Auto-loads VST plugins via command-line
- ✅ Lightweight and fast
- ✅ Free for personal use

**Installation Steps:**

1. **Download SaviHost**
   - URL: https://www.hermannseib.com/english/savihost.htm
   - Download the ZIP file

2. **Extract the ZIP**
   - You'll get: `SaviHost.exe`, `SaviHost64.exe`, `readme.txt`

3. **Copy to vsthost folder**
   - **Installed App**: `C:\Program Files\MJM AI Timbre Arpeggiator\vsthost\`
   - **Portable App**: `[extracted-folder]\vsthost\`
   - **Development**: `mjm-ai-timbre-desktop\vsthost\`

4. **Restart the app**

5. **Test**: Click 🖥️ next to any VST - it should open automatically!

#### 🇹🇭 ไทย

**ทำไมต้อง SaviHost?**
- ✅ โหลด VST plugins อัตโนมัติผ่าน command-line
- ✅ เบาและเร็ว
- ✅ ฟรีสำหรับการใช้งานส่วนตัว

**ขั้นตอนการติดตั้ง:**

1. **ดาวน์โหลด SaviHost**
   - URL: https://www.hermannseib.com/english/savihost.htm
   - ดาวน์โหลดไฟล์ ZIP

2. **แตกไฟล์ ZIP**
   - จะได้: `SaviHost.exe`, `SaviHost64.exe`, `readme.txt`

3. **คัดลอกไปโฟลเดอร์ vsthost**
   - **แอปที่ติดตั้ง**: `C:\Program Files\MJM AI Timbre Arpeggiator\vsthost\`
   - **แอป Portable**: `[โฟลเดอร์ที่แตก]\vsthost\`
   - **Development**: `mjm-ai-timbre-desktop\vsthost\`

4. **รีสตาร์ทแอป**

5. **ทดสอบ**: คลิก 🖥️ ข้าง VST ใดๆ - ควรเปิดอัตโนมัติ!

### 5.2 Alternative: VSTHost | ทางเลือก: VSTHost

#### 🇬🇧 English

**Note**: VSTHost requires manual VST loading.

**Installation Steps:**

1. **Download VSTHost**
   - URL: https://www.hermannseib.com/english/vsthost.htm

2. **Extract and copy**
   - Copy `VSTHost.exe` to the `vsthost\` folder

3. **Usage**
   - Click 🖥️ next to a VST
   - VSTHost opens (without VST loaded)
   - Go to: **File > Open VST Plugin**
   - Select your VST manually

#### 🇹🇭 ไทย

**หมายเหตุ**: VSTHost ต้องโหลด VST ด้วยตนเอง

**ขั้นตอนการติดตั้ง:**

1. **ดาวน์โหลด VSTHost**
   - URL: https://www.hermannseib.com/english/vsthost.htm

2. **แตกไฟล์และคัดลอก**
   - คัดลอก `VSTHost.exe` ไปโฟลเดอร์ `vsthost\`

3. **วิธีใช้**
   - คลิก 🖥️ ข้าง VST
   - VSTHost จะเปิด (โดยยังไม่ได้โหลด VST)
   - ไปที่: **File > Open VST Plugin**
   - เลือก VST ด้วยตนเอง

### 5.3 VST Host Folder Structure | โครงสร้างโฟลเดอร์ VST Host

```
mjm-ai-timbre-desktop/
└── vsthost/
    ├── SaviHost.exe      ← Recommended (auto-load)
    ├── SaviHost64.exe    ← For 64-bit VSTs
    ├── VSTHost.exe       ← Alternative (manual load)
    ├── LoadVST.bat       ← Helper script
    ├── LoadVST.ps1       ← PowerShell script
    └── README.md         ← This documentation
```

### 5.4 Troubleshooting VST Host | แก้ปัญหา VST Host

| Problem | Solution |
|---------|----------|
| "VST Host not found" | Copy SaviHost.exe to `vsthost\` folder |
| SaviHost won't start | Install Visual C++ Redistributable |
| VST UI not showing | Check Options > Visuals > Show GUI |
| Wrong architecture | Match VST (32/64-bit) with host |

---

## 6. Using the Application | วิธีใช้งาน

### 6.1 First Launch | การเปิดใช้ครั้งแรก

#### 🇬🇧 English

1. **Launch the application**
2. **Install VST Host** (if not already done)
   - Follow [Section 5](#5-vst-host-setup--การติดตั้ง-vst-host)
3. **Scan for VST plugins**
   - Click **🔍 SCAN VST** button
4. **Select a VST** to load
5. **Click 🖥️** to open the VST interface

#### 🇹🇭 ไทย

1. **เปิดแอปพลิเคชัน**
2. **ติดตั้ง VST Host** (ถ้ายังไม่ได้ทำ)
   - ดู [หัวข้อ 5](#5-vst-host-setup--การติดตั้ง-vst-host)
3. **สแกนหา VST plugins**
   - คลิกปุ่ม **🔍 SCAN VST**
4. **เลือก VST** เพื่อโหลด
5. **คลิก 🖥️** เพื่อเปิดหน้าต่างควบคุม VST

### 6.2 Scanning VST Plugins | การสแกน VST Plugins

#### Default Scan Paths | เส้นทางสแกนเริ่มต้น

**Windows:**
```
C:\Program Files\VstPlugins
C:\Program Files\Steinberg\VstPlugins
C:\Program Files\Common Files\VST2
C:\Program Files\Common Files\VST3
C:\Program Files (x86)\VstPlugins
%USERPROFILE%\AppData\Local\Programs\Common\VST3
```

**macOS:**
```
/Library/Audio/VST
/Library/Audio/VST3
~/Library/Audio/VST
~/Library/Audio/VST3
```

**Linux:**
```
/usr/lib/vst
/usr/lib/lxvst
/usr/local/lib/vst
~/.vst
~/.lxvst
```

#### Custom Folder Selection | เลือกโฟลเดอร์เอง

If no plugins are found:
1. Click **📁 Select Custom Folder**
2. Navigate to your VST folder
3. Click **Select Folder**
4. Plugins will be scanned from that location

### 6.3 Loading and Using VSTs | การโหลดและใช้งาน VSTs

#### 🇬🇧 English

1. **Load a VST**
   - Click on a plugin name in the list
   - It will be marked as "loaded" (✅)

2. **Open VST Interface**
   - Click the **🖥️** button next to the plugin
   - With SaviHost: VST opens automatically!
   - With VSTHost: Manually load via File > Open

3. **Adjust Parameters**
   - Use the VST's own interface
   - Control arpeggiator parameters separately

4. **Unload VST**
   - Click the plugin name again to unload

#### 🇹🇭 ไทย

1. **โหลด VST**
   - คลิกที่ชื่อ plugin ในรายการ
   - จะถูกทำเครื่องหมายว่า "loaded" (✅)

2. **เปิดหน้าต่างควบคุม VST**
   - คลิกปุ่ม **🖥️** ข้าง plugin
   - ด้วย SaviHost: VST เปิดอัตโนมัติ!
   - ด้วย VSTHost: โหลดเองผ่าน File > Open

3. **ปรับพารามิเตอร์**
   - ใช้หน้าต่างควบคุมของ VST เอง
   - ควบคุมพารามิเตอร์ arpeggiator แยกต่างหาก

4. **ปล่อย VST**
   - คลิกที่ชื่อ plugin อีกครั้งเพื่อปล่อย

### 6.4 Arpeggiator Controls | การควบคุม Arpeggiator

#### Pattern Types | ประเภท Pattern

| Pattern | Description | คำอธิบาย |
|---------|-------------|----------|
| **Up** | Notes play from low to high | โน้ตเล่นจากต่ำไปสูง |
| **Down** | Notes play from high to low | โน้ตเล่นจากสูงไปต่ำ |
| **UpDown** | Notes play up then down | โน้ตเล่นขึ้นแล้วลง |
| **Random** | Notes play in random order | โน้ตเล่นแบบสุ่ม |

#### Waveform Types | ประเภทรูปคลื่น

| Waveform | Sound Character | ลักษณะเสียง |
|----------|-----------------|-------------|
| **Sine** | Smooth, pure tone | นุ่มนวล, เสียงบริสุทธิ์ |
| **Square** | Bright, hollow | สว่าง, กลวง |
| **Sawtooth** | Bright, buzzy | สว่าง, ก้อง |
| **Triangle** | Soft, mellow | อ่อนนุ่ม, นุ่มนวล |

### 6.5 Using Genre Presets | การใช้ Preset ตามประเภทเพลง

#### 🇬🇧 English

1. Click on a genre preset button
2. Settings will auto-adjust:
   - BPM
   - Pattern
   - Waveform
   - Gate
   - Octaves
3. Fine-tune as needed

#### 🇹🇭 ไทย

1. คลิกปุ่ม preset ประเภทเพลง
2. การตั้งค่าจะปรับอัตโนมัติ:
   - BPM
   - Pattern
   - Waveform
   - Gate
   - Octaves
3. ปรับแต่งเพิ่มเติมตามต้องการ

---

## 7. Project Structure | โครงสร้างโปรเจกต์

```
mjm-ai-timbre-desktop/
│
├── 📄 main.js                 # Electron main process | กระบวนการหลักของ Electron
├── 📄 preload.js              # Bridge between main & renderer | สะพานเชื่อมระหว่างหลักและ renderer
├── 📄 index.html              # HTML entry point | จุดเริ่มต้น HTML
├── 📄 package.json            # Dependencies & scripts | Dependencies และสคริปต์
├── 📄 vite.config.ts          # Vite bundler config | การตั้งค่า Vite
├── 📄 tsconfig.json           # TypeScript config | การตั้งค่า TypeScript
├── 📄 tailwind.config.js      # Tailwind CSS config | การตั้งค่า Tailwind
├── 📄 postcss.config.js       # PostCSS config | การตั้งค่า PostCSS
│
├── 📁 src/                    # Source code | ซอร์สโค้ด
│   ├── Arpeggiator.tsx       # Main React component | คอมโพเนนต์ React หลัก
│   ├── arp.css               # Component styles | สไตล์คอมโพเนนต์
│   ├── hooks/                # Custom React hooks | React hooks แบบกำหนดเอง
│   └── ui/                   # UI components | คอมโพเนนต์ UI
│
├── 📁 renderer/               # Renderer process | กระบวนการ Renderer
│   ├── index.tsx             # Entry point | จุดเริ่มต้น
│   └── index.css             # Global styles | สไตล์ทั่วโลก
│
├── 📁 vsthost/                # VST Host folder | โฟลเดอร์ VST Host
│   ├── SaviHost.exe          # (User-provided) | (ผู้ใช้จัดหา)
│   ├── VSTHost.exe           # (User-provided) | (ผู้ใช้จัดหา)
│   ├── LoadVST.bat           # Helper script | สคริปต์ช่วย
│   ├── LoadVST.ps1           # PowerShell script | สคริปต์ PowerShell
│   └── README.md             # VST Host docs | เอกสาร VST Host
│
├── 📁 scripts/                # Build scripts | สคริปต์ Build
│   ├── create-installer.js   # Inno Setup installer | Installer Inno Setup
│   └── build-win.js          # Windows portable build | Build Portable Windows
│
├── 📁 dist/                   # Build output | ผลลัพธ์ Build
│   ├── index.html            # Built HTML | HTML ที่ Build แล้ว
│   └── [vite-assets]/        # Bundled assets | Assets ที่ Bundle แล้ว
│
├── 📁 dist-installer/         # Installer output | ผลลัพธ์ Installer
│   └── MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe
│
├── 📁 installer-temp/         # Temporary installer files | ไฟล์ Installer ชั่วคราว
│
├── 🖼️ icon.png                # App icon (PNG) | ไอคอนแอป (PNG)
├── 🖼️ icon.ico                # App icon (ICO) | ไอคอนแอป (ICO)
├── 📄 installer.iss           # Inno Setup script | สคริปต์ Inno Setup
└── 📄 .electronignore         # Files to exclude from build | ไฟล์ที่ไม่รวมในการ Build
```

### Key Files Explained | คำอธิบายไฟล์สำคัญ

| File | Purpose | วัตถุประสงค์ |
|------|---------|--------------|
| `main.js` | Electron main process, IPC handlers, VST scanning | กระบวนการหลักของ Electron, จัดการ IPC, สแกน VST |
| `preload.js` | Secure bridge between main & renderer | สะพานเชื่อมที่ปลอดภัยระหว่างหลักและ renderer |
| `Arpeggiator.tsx` | Main UI component with all controls | คอมโพเนนต์ UI หลักที่มีการควบคุมทั้งหมด |
| `create-installer.js` | Creates Windows installer with Inno Setup | สร้าง installer Windows ด้วย Inno Setup |
| `build-win.js` | Creates portable Windows ZIP | สร้าง ZIP แบบ Portable สำหรับ Windows |

---

## 8. Development Guide | คู่มือสำหรับนักพัฒนา

### 8.1 Prerequisites | ความต้องการเบื้องต้น

#### 🇬🇧 English

**Required:**
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

**Optional (for building installers):**
- Inno Setup 6+ (Windows)
- electron-packager

#### 🇹🇭 ไทย

**จำเป็น:**
- Node.js 18+ และ npm
- Git
- โปรแกรมแก้ไขโค้ด (แนะนำ VS Code)

**เพิ่มเติม (สำหรับการสร้าง installer):**
- Inno Setup 6+ (Windows)
- electron-packager

### 8.2 Getting Started | เริ่มต้นใช้งาน

#### 🇬🇧 English

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mjm-ai-timbre.git
cd mjm-ai-timbre/mjm-ai-timbre-desktop

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run dev

# 4. Open browser to http://localhost:5173
# The app will auto-reload on changes
```

#### 🇹🇭 ไทย

```bash
# 1. Clone repository
git clone https://github.com/your-username/mjm-ai-timbre.git
cd mjm-ai-timbre/mjm-ai-timbre-desktop

# 2. ติดตั้ง dependencies
npm install

# 3. รันในโหมด development
npm run dev

# 4. เปิดเบราว์เซอร์ไปที่ http://localhost:5173
# แอปจะ reload อัตโนมัติเมื่อมีการเปลี่ยนแปลง
```

### 8.3 Development Mode | โหมด Development

#### Available Scripts | สคริปต์ที่มี

```bash
# Start Vite dev server + Electron with hot reload
npm run dev:electron

# Start Vite dev server only
npm run dev

# Start Electron (production mode)
npm start
```

#### 🇬🇧 English

**Recommended workflow:**
1. Run `npm run dev:electron` in terminal
2. Edit files in `src/` or `renderer/`
3. Changes auto-reload in the Electron window
4. Use DevTools for debugging (opens automatically in dev mode)

#### 🇹🇭 ไทย

**ขั้นตอนการทำงานที่แนะนำ:**
1. รัน `npm run dev:electron` ใน terminal
2. แก้ไขไฟล์ใน `src/` หรือ `renderer/`
3. การเปลี่ยนแปลงจะ reload อัตโนมัติในหน้าต่าง Electron
4. ใช้ DevTools สำหรับ debugging (เปิดอัตโนมัติในโหมด dev)

### 8.4 Architecture Overview | ภาพรวมสถาปัตยกรรม

#### 🇬🇧 English

**Electron Architecture:**

```
┌─────────────────────────────────────────────────┐
│                  Main Process                    │
│  (main.js - Node.js, file system, VST scanning) │
└────────────────────┬────────────────────────────┘
                     │ IPC (Inter-Process Communication)
┌────────────────────▼────────────────────────────┐
│               Preload Script                     │
│         (preload.js - Secure bridge)            │
└────────────────────┬────────────────────────────┘
                     │ Context Bridge
┌────────────────────▼────────────────────────────┐
│              Renderer Process                    │
│  (React UI - Arpeggiator.tsx, VST list, etc.)  │
└─────────────────────────────────────────────────┘
```

**Key Concepts:**
- **Main Process**: Handles file system, VST scanning, launching VSTHost
- **Renderer Process**: Displays UI, handles user interactions
- **Preload Script**: Securely exposes main process APIs to renderer
- **IPC**: Communication channel between processes

#### 🇹🇭 ไทย

**สถาปัตยกรรม Electron:**

```
┌─────────────────────────────────────────────────┐
│                  Main Process                    │
│  (main.js - Node.js, ระบบไฟล์, สแกน VST)       │
└────────────────────┬────────────────────────────┘
                     │ IPC (การสื่อสารระหว่างกระบวนการ)
┌────────────────────▼────────────────────────────┘
│               Preload Script                     │
│         (preload.js - สะพานเชื่อมปลอดภัย)       │
└────────────────────┬────────────────────────────┘
                     │ Context Bridge
┌────────────────────▼────────────────────────────┐
│              Renderer Process                    │
│  (React UI - Arpeggiator.tsx, รายการ VST, ฯลฯ) │
└─────────────────────────────────────────────────┘
```

**แนวคิดหลัก:**
- **Main Process**: จัดการระบบไฟล์, สแกน VST, เปิด VSTHost
- **Renderer Process**: แสดง UI, จัดการการโต้ตอบของผู้ใช้
- **Preload Script**: เปิดเผย APIs ของ main process อย่างปลอดภัยให้ renderer
- **IPC**: ช่องทางการสื่อสารระหว่างกระบวนการ

### 8.5 Adding New Features | การเพิ่มฟีเจอร์ใหม่

#### Example: Adding a New Arpeggiator Control

#### 🇬🇧 English

```tsx
// 1. Add state in Arpeggiator.tsx
const [newParam, setNewParam] = useState(50);

// 2. Add IPC handler in main.js
ipcMain.handle('set-new-param', async (event, value) => {
  // Handle the parameter
  return { success: true };
});

// 3. Expose in preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  setNewParam: (value) => ipcRenderer.invoke('set-new-param', value),
});

// 4. Add UI component
<button onClick={() => window.electronAPI.setNewParam(newParam)}>
  Set Parameter
</button>
```

#### 🇹🇭 ไทย

```tsx
// 1. เพิ่ม state ใน Arpeggiator.tsx
const [newParam, setNewParam] = useState(50);

// 2. เพิ่ม IPC handler ใน main.js
ipcMain.handle('set-new-param', async (event, value) => {
  // จัดการพารามิเตอร์
  return { success: true };
});

// 3. เปิดเผยใน preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  // ... APIs ที่มีอยู่
  setNewParam: (value) => ipcRenderer.invoke('set-new-param', value),
});

// 4. เพิ่มคอมโพเนนต์ UI
<button onClick={() => window.electronAPI.setNewParam(newParam)}>
  ตั้งค่าพารามิเตอร์
</button>
```

### 8.6 Debugging | การ Debug

#### 🇬🇧 English

**Renderer Process (React UI):**
- DevTools opens automatically in dev mode
- Or press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)

**Main Process (Node.js):**
- Add `console.log()` statements in `main.js`
- Logs appear in the terminal where you started the app
- Logs are also sent to renderer (visible in DevTools console)

**Debugging VST Scanning:**
```javascript
// Add to main.js
ipcMain.handle('scan-vst', async () => {
  console.log('🔍 Starting VST scan...');
  const plugins = scanVstPlugins();
  console.log(`✅ Found ${plugins.length} plugins`);
  return plugins;
});
```

#### 🇹🇭 ไทย

**Renderer Process (React UI):**
- DevTools เปิดอัตโนมัติในโหมด dev
- หรือกด `Ctrl+Shift+I` (Windows/Linux) หรือ `Cmd+Option+I` (macOS)

**Main Process (Node.js):**
- เพิ่มคำสั่ง `console.log()` ใน `main.js`
- Logs ปรากฏใน terminal ที่คุณเริ่มแอป
- Logs ยังถูกส่งไปยัง renderer (เห็นได้ใน DevTools console)

**Debugging การสแกน VST:**
```javascript
// เพิ่มใน main.js
ipcMain.handle('scan-vst', async () => {
  console.log('🔍 เริ่มสแกน VST...');
  const plugins = scanVstPlugins();
  console.log(`✅ พบ ${plugins.length} plugins`);
  return plugins;
});
```

---

## 9. Building & Deployment | การ Build และเผยแพร่

### 9.1 Build Commands | คำสั่ง Build

| Command | Description | คำอธิบาย |
|---------|-------------|----------|
| `npm run build` | Build React app with Vite | Build แอป React ด้วย Vite |
| `npm run start` | Run production build | รัน build สำหรับ production |
| `npm run dev` | Run development server | รันเซิร์ฟเวอร์ development |
| `npm run dev:electron` | Dev with Electron hot reload | Dev พร้อม Electron hot reload |
| `npm run dist:win` | Build Windows portable ZIP | Build ZIP แบบ Portable สำหรับ Windows |
| `npm run dist:win:installer` | Build Windows installer (.exe) | Build installer Windows (.exe) |
| `npm run dist:mac` | Build macOS app | Build แอป macOS |
| `npm run dist:linux` | Build Linux app | Build แอป Linux |

### 9.2 Building for Windows (Portable) | Build สำหรับ Windows (Portable)

#### 🇬🇧 English

```bash
# 1. Navigate to desktop folder
cd mjm-ai-timbre-desktop

# 2. Install dependencies (if not done)
npm install

# 3. Build portable version
npm run dist:win

# Output: dist/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip
```

**What it does:**
1. Builds React app with Vite
2. Packages with Electron
3. Copies vsthost folder
4. Creates ZIP archive (~106 MB)

#### 🇹🇭 ไทย

```bash
# 1. ไปที่โฟลเดอร์ desktop
cd mjm-ai-timbre-desktop

# 2. ติดตั้ง dependencies (ถ้ายังไม่ได้ทำ)
npm install

# 3. Build เวอร์ชัน portable
npm run dist:win

# ผลลัพธ์: dist/MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip
```

**สิ่งที่ทำ:**
1. Build แอป React ด้วย Vite
2. Package ด้วย Electron
3. คัดลอกโฟลเดอร์ vsthost
4. สร้างไฟล์ ZIP (~106 MB)

### 9.3 Building Windows Installer | Build Windows Installer

#### 🇬🇧 English

**Prerequisites:**
- Inno Setup 6+ installed
- Download from: https://jrsoftware.org/isdl.php

```bash
# Build installer
npm run dist:win:installer

# Output: dist-installer/MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe
```

**What it does:**
1. Builds React app
2. Packages with Electron
3. Creates Inno Setup script
4. Compiles installer (.exe)
5. Copies to `public/` folder for web distribution

#### 🇹🇭 ไทย

**ความต้องการเบื้องต้น:**
- ติดตั้ง Inno Setup 6+
- ดาวน์โหลดจาก: https://jrsoftware.org/isdl.php

```bash
# Build installer
npm run dist:win:installer

# ผลลัพธ์: dist-installer/MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe
```

**สิ่งที่ทำ:**
1. Build แอป React
2. Package ด้วย Electron
3. สร้างสคริปต์ Inno Setup
4. Compile installer (.exe)
5. คัดลอกไปโฟลเดอร์ `public/` เพื่อเผยแพร่ทางเว็บ

### 9.4 Building for macOS | Build สำหรับ macOS

#### 🇬🇧 English

```bash
# Build macOS app
npm run dist:mac

# Output: dist/MJM-AI-Timbre-Arpeggiator-darwin-x64/
```

**Optional: Create DMG**
```bash
# Install electron-builder
npm install --save-dev electron-builder

# Build DMG
npx electron-builder --mac
```

#### 🇹🇭 ไทย

```bash
# Build แอป macOS
npm run dist:mac

# ผลลัพธ์: dist/MJM-AI-Timbre-Arpeggiator-darwin-x64/
```

**เพิ่มเติม: สร้าง DMG**
```bash
# ติดตั้ง electron-builder
npm install --save-dev electron-builder

# Build DMG
npx electron-builder --mac
```

### 9.5 Building for Linux | Build สำหรับ Linux

#### 🇬🇧 English

```bash
# Build Linux app
npm run dist:linux

# Output: dist/MJM-AI-Timbre-Arpeggiator-linux-x64/
```

**Optional: Create AppImage**
```bash
npx electron-builder --linux appimage
```

#### 🇹🇭 ไทย

```bash
# Build แอป Linux
npm run dist:linux

# ผลลัพธ์: dist/MJM-AI-Timbre-Arpeggiator-linux-x64/
```

**เพิ่มเติม: สร้าง AppImage**
```bash
npx electron-builder --linux appimage
```

### 9.6 Distribution | การเผยแพร่

#### 🇬🇧 English

**Option 1: GitHub Releases (Recommended)**

1. Create release on GitHub
2. Upload built files (ZIP or installer)
3. Share download link with users

**Option 2: Web Server**

1. Upload to your web server
2. Update download link in web app
3. Users download directly

**Option 3: Cloud Storage**

1. Upload to Google Drive, Dropbox, etc.
2. Share public link
3. Note: May require link conversion for direct download

#### 🇹🇭 ไทย

**ทางเลือกที่ 1: GitHub Releases (แนะนำ)**

1. สร้าง release บน GitHub
2. อัพโหลดไฟล์ที่ build แล้ว (ZIP หรือ installer)
3. แชร์ลิงก์ดาวน์โหลดให้ผู้ใช้

**ทางเลือกที่ 2: Web Server**

1. อัพโหลดขึ้น web server ของคุณ
2. อัพเด็ทลิงก์ดาวน์โหลดใน web app
3. ผู้ใช้ดาวน์โหลดโดยตรง

**ทางเลือกที่ 3: Cloud Storage**

1. อัพโหลดขึ้น Google Drive, Dropbox, ฯลฯ
2. แชร์ลิงก์สาธารณะ
3. หมายเหตุ: อาจต้องแปลงลิงก์เพื่อดาวน์โหลดโดยตรง

### 9.7 Version Management | การจัดการเวอร์ชัน

#### 🇬🇧 English

**Update version before building:**

1. Edit `package.json`:
```json
{
  "version": "1.0.1"  // Update this
}
```

2. Update version in build scripts if needed

3. Rebuild:
```bash
npm run dist:win
```

4. New file: `MJM-AI-Timbre-Arpeggiator-v1.0.1-Windows.zip`

#### 🇹🇭 ไทย

**อัพเดทเวอร์ชันก่อน build:**

1. แก้ไข `package.json`:
```json
{
  "version": "1.0.1"  // อัพเดทตรงนี้
}
```

2. อัพเดทเวอร์ชันใน build scripts ถ้าจำเป็น

3. Build ใหม่:
```bash
npm run dist:win
```

4. ไฟล์ใหม่: `MJM-AI-Timbre-Arpeggiator-v1.0.1-Windows.zip`

---

## 10. Troubleshooting | แก้ปัญหา

### 10.1 Common Issues | ปัญหาที่พบบ่อย

#### ❌ VST Host Not Found | ไม่พบ VST Host

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Download SaviHost from hermannseib.com<br>2. Copy `.exe` to `vsthost\` folder<br>3. Restart app |
| 🇹🇭 TH | 1. ดาวน์โหลด SaviHost จาก hermannseib.com<br>2. คัดลอก `.exe` ไปโฟลเดอร์ `vsthost\`<br>3. รีสตาร์ทแอป |

#### ❌ VST Won't Open | VST ไม่เปิด

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Check VST architecture (32/64-bit)<br>2. Match with VSTHost architecture<br>3. Try running as Administrator<br>4. Install Visual C++ Redistributable |
| 🇹🇭 TH | 1. ตรวจสอบ architecture ของ VST (32/64-bit)<br>2. ให้ตรงกับ architecture ของ VSTHost<br>3. ลองรันเป็น Administrator<br>4. ติดตั้ง Visual C++ Redistributable |

#### ❌ VST UI Not Showing | ไม่แสดงหน้าต่าง VST

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. In VSTHost: Options > Visuals > Show GUI<br>2. Check if window is behind others (Alt+Tab)<br>3. Reload the VST plugin |
| 🇹🇭 TH | 1. ใน VSTHost: Options > Visuals > Show GUI<br>2. ตรวจสอบว่าหน้าต่างอยู่ข้างหลังอื่นหรือไม่ (Alt+Tab)<br>3. โหลด VST plugin ใหม่ |

#### ❌ No VST Plugins Found | ไม่พบ VST Plugins

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Verify VSTs are installed<br>2. Check default VST folders<br>3. Use "Select Custom Folder" option<br>4. Ensure VST2 (.dll) or VST3 (.vst3) format |
| 🇹🇭 TH | 1. ตรวจสอบว่าติดตั้ง VSTs แล้ว<br>2. ตรวจสอบโฟลเดอร์ VST เริ่มต้น<br>3. ใช้ตัวเลือก "Select Custom Folder"<br>4. ตรวจสอบว่าเป็นรูปแบบ VST2 (.dll) หรือ VST3 (.vst3) |

#### ❌ App Won't Start | แอปไม่เริ่มทำงาน

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Run as Administrator (Windows)<br>2. Check system requirements<br>3. Reinstall the application<br>4. Check console logs for errors |
| 🇹🇭 TH | 1. รันเป็น Administrator (Windows)<br>2. ตรวจสอบความต้องการของระบบ<br>3. ติดตั้งแอปใหม่<br>4. ตรวจสอบ console logs เพื่อหาข้อผิดพลาด |

#### ❌ Audio Issues | ปัญหาเสียง

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Check audio output device<br>2. Close other audio applications<br>3. Adjust buffer size in audio settings<br>4. Update audio drivers |
| 🇹🇭 TH | 1. ตรวจสอบอุปกรณ์ส่งออกเสียง<br>2. ปิดแอปพลิเคชันเสียงอื่น<br>3. ปรับ buffer size ในการตั้งค่าเสียง<br>4. อัพเดทไดรเวอร์เสียง |

#### ❌ SaviHost Won't Start | SaviHost ไม่เริ่มทำงาน

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | **Missing Visual C++ Redistributable**<br>1. Download: https://aka.ms/vs/17/release/vc_redist.x64.exe<br>2. Install and restart<br><br>**Alternative**: Use VSTHost instead |
| 🇹🇭 TH | **ขาด Visual C++ Redistributable**<br>1. ดาวน์โหลด: https://aka.ms/vs/17/release/vc_redist.x64.exe<br>2. ติดตั้งและรีสตาร์ท<br><br>**ทางเลือก**: ใช้ VSTHost แทน |

#### ❌ Build Fails | Build ล้มเหลว

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Run `npm install` to fix dependencies<br>2. Delete `node_modules` and reinstall<br>3. Check Node.js version (18+)<br>4. Run as Administrator (for installer) |
| 🇹🇭 TH | 1. รัน `npm install` เพื่อแก้ไข dependencies<br>2. ลบ `node_modules` และติดตั้งใหม่<br>3. ตรวจสอบเวอร์ชัน Node.js (18+)<br>4. รันเป็น Administrator (สำหรับ installer) |

#### ❌ Inno Setup Not Found | ไม่พบ Inno Setup

| Language | Solution |
|----------|----------|
| 🇬🇧 EN | 1. Download Inno Setup 6: https://jrsoftware.org/isdl.php<br>2. Install to default location<br>3. Run build command again<br>4. Or use portable ZIP build instead |
| 🇹🇭 TH | 1. ดาวน์โหลด Inno Setup 6: https://jrsoftware.org/isdl.php<br>2. ติดตั้งที่ตำแหน่งเริ่มต้น<br>3. รันคำสั่ง build อีกครั้ง<br>4. หรือใช้ portable ZIP build แทน |

### 10.2 Debug Mode | โหมด Debug

#### 🇬🇧 English

**Enable verbose logging:**

```javascript
// In main.js, add detailed logging
const isDev = process.argv.includes('--dev');
if (isDev) {
  console.log('🔍 Debug mode enabled');
  // Add more console.log statements
}
```

**View logs:**
- Main process: Terminal where app was started
- Renderer: DevTools Console (Ctrl+Shift+I)

#### 🇹🇭 ไทย

**เปิดใช้งาน logging แบบละเอียด:**

```javascript
// ใน main.js, เพิ่ม logging แบบละเอียด
const isDev = process.argv.includes('--dev');
if (isDev) {
  console.log('🔍 เปิดโหมด debug');
  // เพิ่มคำสั่ง console.log เพิ่มเติม
}
```

**ดู logs:**
- Main process: Terminal ที่เริ่มแอป
- Renderer: DevTools Console (Ctrl+Shift+I)

---

## 11. FAQ | คำถามที่พบบ่อย

### Q1: Do I need to pay for VSTHost?
### Q1: ต้องจ่ายเงินสำหรับ VSTHost หรือไม่?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| No! Both SaviHost and VSTHost are free for personal use. | ไม่! ทั้ง SaviHost และ VSTHost ฟรีสำหรับการใช้งานส่วนตัว |

### Q2: Can I use this without VST plugins?
### Q2: ใช้ได้หรือไม่ถ้าไม่มี VST plugins?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Yes! The built-in arpeggiator works without VSTs. VSTs are optional for additional sounds. | ได้! Arpeggiator ในตัวใช้งานได้โดยไม่ต้องมี VSTs VSTs เป็นตัวเลือกสำหรับเสียงเพิ่มเติม |

### Q3: Why won't my VST open automatically?
### Q3: ทำไม VST ของฉันไม่เปิดอัตโนมัติ?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Make sure you're using SaviHost (not VSTHost). SaviHost supports command-line auto-loading. VSTHost requires manual loading. | ตรวจสอบว่าคุณกำลังใช้ SaviHost (ไม่ใช่ VSTHost) SaviHost รองรับ command-line auto-loading ส่วน VSTHost ต้องโหลดด้วยตนเอง |

### Q4: Can I use VST3 plugins?
### Q4: ใช้ VST3 plugins ได้หรือไม่?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Yes! Both VST2 (.dll, .vst) and VST3 (.vst3) formats are supported. | ได้! รองรับทั้งรูปแบบ VST2 (.dll, .vst) และ VST3 (.vst3) |

### Q5: How do I update the app?
### Q5: จะอัพเดทแอปได้อย่างไร?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| **Installed version**: Download new installer and run it<br>**Portable version**: Download new ZIP and replace old folder | **เวอร์ชันที่ติดตั้ง**: ดาวน์โหลด installer ใหม่และรัน<br>**เวอร์ชัน Portable**: ดาวน์โหลด ZIP ใหม่และแทนที่โฟลเดอร์เก่า |

### Q6: Can I customize the arpeggiator patterns?
### Q6: ปรับแต่ง pattern ของ arpeggiator ได้หรือไม่?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Currently: Up, Down, UpDown, Random. Custom patterns can be added by modifying the source code. | ปัจจุบัน: Up, Down, UpDown, Random สามารถเพิ่ม pattern เองได้โดยการแก้ไข source code |

### Q7: Does it work on Mac/Linux?
### Q7: ใช้บน Mac/Linux ได้หรือไม่?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Yes! The app is cross-platform. VSTHost support varies by platform (best on Windows). | ได้! แอปเป็น cross-platform การรองรับ VSTHost แตกต่างกันตามแพลตฟอร์ม (ดีที่สุดบน Windows) |

### Q8: How large is the installation?
### Q8: การติดตั้งมีขนาดใหญ่แค่ไหน?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| ~106 MB (includes Electron runtime). No additional dependencies required. | ~106 MB (รวม Electron runtime) ไม่ต้องมี dependencies เพิ่มเติม |

### Q9: Can I redistribute this app?
### Q9: แจกจ่ายแอปนี้ต่อได้หรือไม่?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Check the LICENSE file. Generally MIT licensed code can be redistributed with attribution. | ตรวจสอบไฟล์ LICENSE โดยทั่วไปโค้ดที่ใบอนุญาต MIT สามารถแจกจ่ายใหม่ได้พร้อมการอ้างอิง |

### Q10: Where are my settings saved?
### Q10: การตั้งค่าของฉันบันทึกไว้ที่ไหน?

| 🇬🇧 EN | 🇹🇭 TH |
|--------|--------|
| Settings are stored in the app's data folder:<br>- Windows: `%APPDATA%\mjm-ai-timbre-desktop`<br>- macOS: `~/Library/Application Support/mjm-ai-timbre-desktop`<br>- Linux: `~/.config/mjm-ai-timbre-desktop` | การตั้งค่าเก็บในโฟลเดอร์ข้อมูลของแอป:<br>- Windows: `%APPDATA%\mjm-ai-timbre-desktop`<br>- macOS: `~/Library/Application Support/mjm-ai-timbre-desktop`<br>- Linux: `~/.config/mjm-ai-timbre-desktop` |

---

## Appendix A: Quick Reference | ภาคผนวก ก: ข้อมูลอ้างอิงด่วน

### Command Cheat Sheet | ชีทคำสั่งลัด

```bash
# Development | การพัฒนา
npm run dev              # Start Vite dev server
npm run dev:electron     # Start dev with Electron
npm start                # Run production build

# Building | การ Build
npm run build            # Build React app
npm run dist:win         # Build Windows portable
npm run dist:win:installer  # Build Windows installer
npm run dist:mac         # Build macOS
npm run dist:linux       # Build Linux

# Utilities | ยูทิลิตี้
npm run preview          # Preview production build
```

### VST Host Download Links | ลิงก์ดาวน์โหลด VST Host

| Host | URL | Auto-load |
|------|-----|-----------|
| **SaviHost** (Recommended) | https://www.hermannseib.com/english/savihost.htm | ✅ Yes |
| **VSTHost** | https://www.hermannseib.com/english/vsthost.htm | ❌ No (manual) |

### Default VST Folders | โฟลเดอร์ VST เริ่มต้น

**Windows:**
```
C:\Program Files\VstPlugins
C:\Program Files\Steinberg\VstPlugins
C:\Program Files\Common Files\VST2
C:\Program Files\Common Files\VST3
```

**macOS:**
```
/Library/Audio/VST
/Library/Audio/VST3
```

**Linux:**
```
/usr/lib/vst
/usr/lib/lxvst
```

---

## Appendix B: Changelog | ภาคผนวก ข: บันทึกการเปลี่ยนแปลง

### Version 1.0.0

**Features:**
- ✅ Full arpeggiator with all controls
- ✅ VST plugin scanning and loading
- ✅ VSTHost integration (SaviHost & VSTHost)
- ✅ Genre presets (11 styles)
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Portable and installer builds

**Known Issues:**
- ⚠️ SaviHost requires Visual C++ Redistributable (Windows)
- ⚠️ VSTHost requires manual VST loading

---

## Support & Contact | การสนับสนุนและติดต่อ

### 🇬🇧 English

**Issues & Feature Requests:**
- GitHub Issues: https://github.com/your-username/mjm-ai-timbre/issues

**Documentation:**
- This file: `DOCUMENTATION.md`
- VST Host Guide: `vsthost/README.md`

### 🇹🇭 ไทย

**รายงานปัญหาและขอฟีเจอร์:**
- GitHub Issues: https://github.com/your-username/mjm-ai-timbre/issues

**เอกสาร:**
- ไฟล์นี้: `DOCUMENTATION.md`
- คู่มือ VST Host: `vsthost/README.md`

---

## License | ใบอนุญาต

MIT License - See LICENSE file for details.

---

<div align="center">

**Made with ❤️ for musicians and producers**

**สร้างด้วย ❤️ สำหรับนักดนตรีและโปรดิวเซอร์**

---

**MJM AI Timbre Desktop v1.0.0**

</div>
