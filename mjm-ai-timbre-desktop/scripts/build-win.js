const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const APP_NAME = 'MJM-AI-Timbre-Arpeggiator';
const VERSION = '1.0.0';

console.log('🚀 Building Windows Portable App...');

// Step 1: Build Vite
console.log('📦 Building Vite...');
execSync('npm run build', { stdio: 'inherit' });

// Step 2: Package with electron-packager
console.log('📦 Packaging with Electron...');
execSync(`npx electron-packager . --platform=win32 --arch=x64 --out=dist --overwrite --prune`, { 
  stdio: 'inherit' 
});

// Step 3: Create ZIP file
const appDir = path.join(__dirname, '..', 'dist', 'mjm-ai-timbre-desktop-win32-x64');
const zipFileName = `${APP_NAME}-v${VERSION}-Windows.zip`;
const zipPath = path.join(__dirname, '..', 'dist', zipFileName);

console.log(`📦 Creating ZIP: ${zipFileName}...`);

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Build complete!`);
  console.log(`📦 ZIP file: ${zipPath}`);
  console.log(`📊 Size: ${sizeMB} MB`);
  console.log(`\n🌐 Upload this file to your server and update the download link in Web App`);
});

archive.on('error', (err) => {
  console.error('❌ Error creating ZIP:', err);
  throw err;
});

archive.pipe(output);
archive.directory(appDir, false);
archive.finalize();
