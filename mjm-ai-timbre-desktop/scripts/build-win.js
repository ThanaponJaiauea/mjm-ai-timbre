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

// Step 2.5: Copy vsthost folder to the packaged app
const appDir = path.join(__dirname, '..', 'dist', 'mjm-ai-timbre-desktop-win32-x64');
const vstHostSource = path.join(__dirname, '..', 'vsthost');
const vstHostDest = path.join(appDir, 'vsthost');

if (fs.existsSync(vstHostSource)) {
  console.log('\n📦 Copying vsthost folder...');
  fs.cpSync(vstHostSource, vstHostDest, { recursive: true });
  console.log(`✅ vsthost folder copied to: ${vstHostDest}`);

  // List the files in vsthost folder
  const vstFiles = fs.readdirSync(vstHostDest);
  const exeFiles = vstFiles.filter(f => f.endsWith('.exe'));
  const batFiles = vstFiles.filter(f => f.endsWith('.bat'));
  const psFiles = vstFiles.filter(f => f.endsWith('.ps1'));
  
  console.log('\n📁 vsthost folder contents:');
  console.log('   EXE files:', exeFiles.length > 0 ? exeFiles.join(', ') : '⚠️ NONE');
  console.log('   BAT scripts:', batFiles.length > 0 ? batFiles.join(', ') : 'NONE');
  console.log('   PS1 scripts:', psFiles.length > 0 ? psFiles.join(', ') : 'NONE');
  
  // Verify critical files
  const hasVSTHost = exeFiles.some(f => f.toLowerCase().includes('vsthost'));
  const hasSaviHost = exeFiles.some(f => f.toLowerCase().includes('savihost'));
  
  console.log('\n✅ VST Host Status:');
  console.log(`   VSTHost.exe: ${hasVSTHost ? '✅ Included' : '❌ MISSING'}`);
  console.log(`   SaviHost.exe: ${hasSaviHost ? '✅ Included' : '⚠️ Optional (requires Visual C++)'}`);
  
  if (!hasVSTHost) {
    console.warn('\n⚠️  WARNING: VSTHost.exe not found!');
    console.warn('   Please add VSTHost.exe to the vsthost/ folder before building');
    console.warn('   Download from: https://www.hermannseib.com/english/vsthost.htm\n');
  }
} else {
  console.warn('\n⚠️  Warning: vsthost folder not found!');
  console.warn('   Creating empty vsthost folder...\n');
  fs.mkdirSync(vstHostDest, { recursive: true });
}

// Step 3: Create ZIP file
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
