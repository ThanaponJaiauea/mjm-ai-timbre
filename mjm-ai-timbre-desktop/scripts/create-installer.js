const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const APP_NAME = 'MJM-AI-Timbre-Arpeggiator';
const VERSION = '1.0.0';

// กำหนดตัวแปรตั้งแต่ต้น
const appDir = path.join(__dirname, '..', 'dist', 'mjm-ai-timbre-desktop-win32-x64');

async function main() {
  console.log('🚀 Building Windows Installer using Inno Setup...\n');

  // Step 1: Build Vite
  console.log('📦 Building Vite...');
  execSync('npm run build', { stdio: 'inherit' });

// Step 2: ลบโฟลเดอร์ installer-temp เก่าก่อน (เพื่อป้องกันไฟล์ซ้ำซ้อน)
const installerTempDir = path.join(__dirname, '..', 'installer-temp');
if (fs.existsSync(installerTempDir)) {
  console.log('\n🗑️  Removing old installer-temp folder...');
  fse.removeSync(installerTempDir);
}

// Step 0: Ensure we have icon.ico and it is square
const iconPngPath = path.join(__dirname, '..', 'icon.png');
const iconIcoPath = path.join(__dirname, '..', 'icon.ico');
const squarePngPath = path.join(__dirname, '..', 'icon-square.png');

async function ensureIconExists() {
  if (!fs.existsSync(iconPngPath)) {
    console.log('⚠️ icon.png not found, skipping icon conversion');
    return false;
  }

  if (fs.existsSync(iconIcoPath)) {
    console.log('✅ icon.ico already exists');
    return true;
  }

  console.log('🔄 Converting icon.png to icon.ico...');
  try {
    const sharp = require('sharp');

    // Get image metadata
    const metadata = await sharp(iconPngPath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Get max dimension for square
    const size = Math.max(width, height);

    // 1. Resize to fit within 256x256 while maintaining aspect ratio
    let sharpImage = sharp(iconPngPath).resize(256, 256, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });

    // Save square PNG
    await sharpImage.toFile(squarePngPath);
    console.log('✅ icon-square.png created (256x256)');

    // 2. Convert square png to ico
    const pngToIcoModule = require('png-to-ico');
    const pngToIco = typeof pngToIcoModule === 'function' ? pngToIcoModule : pngToIcoModule.default;

    const buf = await pngToIco(squarePngPath);
    fs.writeFileSync(iconIcoPath, buf);
    console.log('✅ icon.ico created successfully (256x256)');
    return true;
  } catch(e) {
    console.log('⚠️ Could not convert icon.png to icon.ico:', e.message);
    return false;
  }
}

await ensureIconExists();

// Copy icon.ico to source folder BEFORE packaging (for electron-packager)
const sourceIconDest = path.join(__dirname, '..', 'icon-build.ico');
if (fs.existsSync(iconIcoPath)) {
  fse.copySync(iconIcoPath, sourceIconDest);
  console.log('✅ icon.ico copied to source folder for electron-packager');
}

// Step 3: Package with electron-packager
console.log('\n📦 Packaging with Electron...');
let packagerCommand = `npx electron-packager . --platform=win32 --arch=x64 --out=dist --overwrite --prune`;

// Add icon to the built .exe (use the copied icon)
if (fs.existsSync(sourceIconDest)) {
  packagerCommand += ` --icon="${sourceIconDest}"`;
} else if (fs.existsSync(iconIcoPath)) {
  packagerCommand += ` --icon="${iconIcoPath}"`;
} else if (fs.existsSync(iconPngPath)) {
  packagerCommand += ` --icon="${iconPngPath}"`;
}

execSync(packagerCommand, {
  stdio: 'inherit'
});

// Step 3: ตรวจสอบว่า Inno Setup ติดตั้งหรือยัง
const innoSetupPaths = [
  'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe',
  'C:\\Program Files\\Inno Setup 6\\ISCC.exe',
  process.env.LOCALAPPDATA + '\\Programs\\Inno Setup 6\\ISCC.exe',
  process.env.APPDATA + '\\..\\Local\\Programs\\Inno Setup 6\\ISCC.exe',
];

let isccExe = null;
for (const innoPath of innoSetupPaths) {
  if (fs.existsSync(innoPath)) {
    isccExe = innoPath;
    console.log(`✅ Found Inno Setup at: ${innoPath}`);
    break;
  }
}

if (!isccExe) {
  console.log('\n⚠️  Inno Setup not found!');
  console.log('\n📥 Please download and install Inno Setup:');
  console.log('   https://jrsoftware.org/isdl.php#stable\n');
  console.log('💡 After installation, run this command again:\n');
  console.log('   npm run dist:win:installer\n');

  // สร้างไฟล์ ZIP แทน
  console.log('\n📦 Creating portable ZIP instead...\n');
  createPortableZip();
  process.exit(0);
}

// Step 4: สร้างโฟลเดอร์สำหรับ installer
const installerDir = path.join(__dirname, '..', 'installer-temp');
const outputDir = path.join(__dirname, '..', 'dist-installer');

console.log('\n📁 Preparing installer files...');

// ลบโฟลเดอร์เก่าถ้ามี
if (fs.existsSync(installerDir)) {
  fse.removeSync(installerDir);
}
if (fs.existsSync(outputDir)) {
  fse.removeSync(outputDir);
}
fse.ensureDirSync(installerDir);
fse.ensureDirSync(outputDir);

// คัดลอกไฟล์แอพ (เฉพาะไฟล์ที่จำเป็น)
const appDest = path.join(installerDir, 'app');

// ใช้วิธีคัดลอกเฉพาะไฟล์ที่ต้องการโดยตรง
const filesToCopy = [
  'mjm-ai-timbre-desktop.exe',
  'resources.pak',
  'icudtl.dat',
  'snapshot_blob.bin',
  'v8_context_snapshot.bin',
  'version',
  'LICENSE',
  'LICENSES.chromium.html',
  'chrome_100_percent.pak',
  'chrome_200_percent.pak',
  'd3dcompiler_47.dll',
  'ffmpeg.dll',
  'libEGL.dll',
  'libGLESv2.dll',
  'vk_swiftshader.dll',
  'vk_swiftshader_icd.json',
  'vulkan-1.dll'
];

// คัดลอกไฟล์หลัก
for (const file of filesToCopy) {
  const src = path.join(appDir, file);
  const dest = path.join(appDest, file);
  if (fs.existsSync(src)) {
    fse.copySync(src, dest);
  }
}

// คัดลอกโฟลเดอร์ locales
const localesSrc = path.join(appDir, 'locales');
const localesDest = path.join(appDest, 'locales');
if (fs.existsSync(localesSrc)) {
  fse.copySync(localesSrc, localesDest);
}

// คัดลอกโฟลเดอร์ resources/app (ไม่รวม dist, node_modules และ dist-installer)
const resourcesSrc = path.join(appDir, 'resources', 'app');
const resourcesDest = path.join(appDest, 'resources', 'app');
if (fs.existsSync(resourcesSrc)) {
  // คัดลอกเฉพาะไฟล์ที่จำเป็น ไม่รวม dist และ node_modules
  const files = fs.readdirSync(resourcesSrc);
  files.forEach(file => {
    if (file !== 'dist' && file !== 'node_modules' && file !== 'dist-installer') {
      const srcPath = path.join(resourcesSrc, file);
      const destPath = path.join(resourcesDest, file);
      if (fs.statSync(srcPath).isDirectory()) {
        fse.copySync(srcPath, destPath);
      } else {
        fse.copySync(srcPath, destPath);
      }
    }
  });
  console.log('✅ resources/app copied (excluding dist, node_modules, dist-installer)');
}

// คัดลอกโฟลเดอร์ dist (ไฟล์ที่ build จาก Vite)
const distSrc = path.join(__dirname, '..', 'dist');
const distDest = path.join(appDest, 'resources', 'app', 'dist');
if (fs.existsSync(distSrc)) {
  // Be careful to not copy the packaged output to itself
  const files = fs.readdirSync(distSrc);
  if (!fs.existsSync(distDest)) {
    fs.mkdirSync(distDest, { recursive: true });
  }
  files.forEach(file => {
    // Only copy vite build outputs, avoid the electron build folder
    if (!file.startsWith('mjm-ai-timbre-desktop-win32')) {
      fse.copySync(path.join(distSrc, file), path.join(distDest, file));
    }
  });
  console.log('✅ dist folder copied (excluding packaged app)');
}

// คัดลอกไฟล์ icon.png และ icon.ico
const iconPngSrc = path.join(__dirname, '..', 'icon.png');
const iconPngDest = path.join(appDest, 'icon.png');
if (fs.existsSync(iconPngSrc)) {
  fse.copySync(iconPngSrc, iconPngDest);
  console.log('✅ Icon PNG copied');
}

const iconDestIco = path.join(appDest, 'icon.ico');
if (fs.existsSync(iconIcoPath)) {
  fse.copySync(iconIcoPath, iconDestIco);
  console.log('✅ Icon ICO copied to app installer temp');
}

console.log('✅ App files copied');

// สร้างไฟล์ script สำหรับ Inno Setup
const installerIconIcoPath = path.join(installerDir, 'app', 'icon.ico');
const hasValidIco = fs.existsSync(installerIconIcoPath) && fs.statSync(installerIconIcoPath).size > 0;

// Use double quotes and escape backslashes for Inno Setup
const escapePath = (p) => p.replace(/\\/g, '\\\\');
const resolvedInstallerDir = escapePath(path.resolve(installerDir));

// Icon path for Inno Setup wizard
const iconForWizard = hasValidIco ? `${resolvedInstallerDir}\\\\app\\\\icon.ico` : '';

const issContent = `
[Setup]
AppName=MJM AI Timbre Arpeggiator
AppVersion=${VERSION}
AppPublisher=MJM AI Timbre
DefaultDirName={autopf}\\MJM AI Timbre Arpeggiator
DefaultGroupName=MJM AI Timbre Arpeggiator
OutputDir=${escapePath(path.resolve(outputDir))}
OutputBaseFilename=${APP_NAME}-Setup-${VERSION}
Compression=zip
SolidCompression=no
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=admin
${iconForWizard ? `SetupIconFile=${iconForWizard}` : ''}
UninstallDisplayIcon={app}\\mjm-ai-timbre-desktop.exe

[Files]
Source: "${resolvedInstallerDir}\\app\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\MJM AI Timbre Arpeggiator"; Filename: "{app}\\mjm-ai-timbre-desktop.exe"
Name: "{autodesktop}\\MJM AI Timbre Arpeggiator"; Filename: "{app}\\mjm-ai-timbre-desktop.exe"; IconIndex: 0
Name: "{userprograms}\\MJM AI Timbre Arpeggiator"; Filename: "{app}\\mjm-ai-timbre-desktop.exe"

[Run]
Filename: "{app}\\mjm-ai-timbre-desktop.exe"; Description: "{cm:LaunchProgram,MJM AI Timbre Arpeggiator}"; Flags: nowait postinstall skipifsilent
`;

fs.writeFileSync(path.join(installerDir, 'installer.iss'), issContent);
console.log('✅ Inno Setup script created');

// Step 5: รัน Inno Setup Compiler
console.log('\n🔨 Compiling installer with Inno Setup...\n');

try {
  execSync(`"${isccExe}" "${path.join(installerDir, 'installer.iss')}"`, { 
    stdio: 'inherit' 
  });

  console.log('\n✅ Installer created successfully!');

  // หาไฟล์ .exe ที่สร้าง
  const files = fs.readdirSync(outputDir);
  const installerFile = files.find(f => f.endsWith('.exe'));

  if (installerFile) {
    const sizeMB = (fs.statSync(path.join(outputDir, installerFile)).size / 1024 / 1024).toFixed(2);
    console.log(`\n📦 File: dist-installer\\${installerFile}`);
    console.log(`📊 Size: ${sizeMB} MB`);
    
    // คัดลอกไฟล์ installer ไปยัง public folder ของโปรเจกต์หลัก
    const publicDir = path.join(__dirname, '..', '..', 'public');
    if (fs.existsSync(publicDir)) {
      const publicDest = path.join(publicDir, installerFile);
      fse.copySync(path.join(outputDir, installerFile), publicDest);
      console.log(`\n📥 Copied installer to public folder: ../../public/${installerFile}`);
    }
    
    console.log(`\n🎯 Users can now double-click this .exe to install the app!`);
    console.log(`\n💾 To distribute:`);
    console.log(`   1. Copy the .exe file to your server`);
    console.log(`   2. Update download link in Web App`);
    console.log(`   3. Users download → run installer → app installed!`);
  }
  } catch (error) {
    console.error('\n❌ Error compiling installer:', error.message);
    console.log('\n💡 Try running this script as Administrator');
    process.exit(1);
  }
}

function createPortableZip() {
  const archiver = require('archiver');
  const zipFileName = `${APP_NAME}-v${VERSION}-Windows.zip`;
  const zipPath = path.join(__dirname, '..', 'dist', zipFileName);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`✅ Portable ZIP created: ${zipPath} (${sizeMB} MB)`);
  });

  archive.on('error', (err) => {
    console.error('❌ Error creating ZIP:', err);
    throw err;
  });

  archive.pipe(output);
  archive.directory(appDir, false);
  archive.finalize();
}
main().catch(e => {
  console.error('Fatal Error:', e);
  process.exit(1);
});
