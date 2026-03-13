# MJM AI Timbre - Arpeggiator Desktop App

A desktop application for the MJM AI Timbre Arpeggiator with VST plugin support.

## Features

- 🎹 **Full Arpeggiator Controls** - BPM, Pattern, Waveform, Key & Scale
- 🔌 **VST Plugin Support** - Scan and use VST2/VST3 plugins from your system
- 🎼 **Genre Presets** - Trance, Synthwave, Techno, Ambient, and more
- 💾 **Offline Mode** - Works without a browser connection
- 🖥️ **Native Performance** - Built with Electron for cross-platform support

## Installation

### From Pre-built Installer (Recommended)

1. Download the latest installer from [Releases](https://github.com/your-username/mjm-ai-timbre/releases)
   - **Windows**: `mjm-ai-timbre-setup.exe`
   - **macOS**: `mjm-ai-timbre.dmg`
   - **Linux**: `mjm-ai-timbre.AppImage`

2. Run the installer and follow the on-screen instructions

3. Launch the application from your applications folder

### Build from Source

#### Prerequisites

- Node.js 18+ and npm
- Git

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mjm-ai-timbre.git
   cd mjm-ai-timbre/mjm-ai-timbre-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   # Build for current platform
   npm run dist

   # Or specify platform
   npm run dist:win    # Windows
   npm run dist:mac    # macOS
   npm run dist:linux  # Linux
   ```

## Usage

### Scanning VST Plugins

1. Launch the application
2. Click the **SCAN VST** button
3. The app will automatically search default VST folders:
   - **Windows**: `C:\Program Files\VstPlugins`, `C:\Program Files\Steinberg\VstPlugins`, etc.
   - **macOS**: `/Library/Audio/VST`, `/Library/Audio/VST3`
   - **Linux**: `/usr/lib/vst`, `/usr/lib/lxvst`

4. If no plugins are found, you'll be prompted to select a custom folder

### Using VST Plugins

After scanning, your VST plugins will be listed. You can:
- View all detected plugins
- See the full path to each plugin
- Use them within the arpeggiator

### Arpeggiator Controls

- **PLAY/STOP**: Start/stop the arpeggiator
- **BPM**: Adjust tempo (40-240 BPM)
- **VOLUME**: Master output volume
- **OCTAVES**: Number of octaves to span
- **GATE**: Note gate length
- **PATTERN**: Up, Down, UpDown, or Random
- **WAVEFORM**: Sine, Square, Sawtooth, or Triangle
- **KEY**: Root note for the arpeggio
- **SCALE**: Musical scale (Major, Minor, etc.)

### Genre Presets

Quick-load preset configurations for different music genres:
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

## Default VST Folders

### Windows
```
C:\Program Files\VstPlugins
C:\Program Files\Steinberg\VstPlugins
C:\Program Files\Common Files\VST2
C:\Program Files\Common Files\VST3
C:\Program Files (x86)\VstPlugins
%USERPROFILE%\AppData\Local\Programs\Common\VST3
```

### macOS
```
/Library/Audio/VST
/Library/Audio/VST3
~/Library/Audio/VST
~/Library/Audio/VST3
```

### Linux
```
/usr/lib/vst
/usr/lib/lxvst
/usr/local/lib/vst
~/.vst
~/.lxvst
```

## Troubleshooting

### No VST Plugins Found

1. Make sure VST plugins are installed on your system
2. Check if plugins are in the default folders listed above
3. Use the "Select Custom Folder" option to manually locate your VST folder
4. Ensure plugins are VST2 (.dll, .vst) or VST3 (.vst3) format

### App Won't Start

1. Make sure you have the latest version
2. Check system requirements
3. Try running as administrator (Windows)
4. Check console logs for errors

### Audio Issues

1. Check your audio output device settings
2. Try adjusting the buffer size in audio settings
3. Close other audio applications

## Development

### Project Structure

```
mjm-ai-timbre-desktop/
├── main.js              # Electron main process
├── preload.js           # Bridge between main and renderer
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite bundler configuration
├── tsconfig.json        # TypeScript configuration
├── src/
│   ├── Arpeggiator.tsx  # Main React component
│   └── arp.css          # Styles
└── renderer/
    ├── index.tsx        # Renderer entry point
    └── index.css        # Global styles
```

### Available Scripts

- `npm start` - Launch the app (production mode)
- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build the renderer
- `npm run dist` - Build distributable app
- `npm run dist:win` - Build for Windows
- `npm run dist:mac` - Build for macOS
- `npm run dist:linux` - Build for Linux

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please visit:
https://github.com/your-username/mjm-ai-timbre/issues

## Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
