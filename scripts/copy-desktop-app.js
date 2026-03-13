const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'mjm-ai-timbre-desktop', 'dist', 'MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip');
const dest = path.join(__dirname, '..', 'public', 'MJM-AI-Timbre-Arpeggiator-v1.0.0-Windows.zip');

if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    const sizeMB = (fs.statSync(dest).size / 1024 / 1024).toFixed(2);
    console.log(`✅ Copied Desktop App to public folder (${sizeMB} MB)`);
} else {
    console.error('❌ Desktop App ZIP not found!');
    console.error('   Please build the desktop app first:');
    console.error('   cd mjm-ai-timbre-desktop && npm run dist:win');
    process.exit(1);
}
