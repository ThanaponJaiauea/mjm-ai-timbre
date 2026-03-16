const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // VST Scanner
  scanVst: () => ipcRenderer.invoke('scan-vst'),
  selectVstFolder: () => ipcRenderer.invoke('select-vst-folder'),

  // VST Loader
  loadVst: (vstPath) => ipcRenderer.invoke('load-vst', vstPath),
  unloadVst: () => ipcRenderer.invoke('unload-vst'),
  getLoadedVst: () => ipcRenderer.invoke('get-loaded-vst'),

  // VST Host (Open VST UI)
  openVstWindow: (vstPath) => ipcRenderer.invoke('open-vst-window', vstPath),
  downloadVstHost: () => ipcRenderer.invoke('download-vsthost'),

  // App Info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Platform check helpers
  isWindows: () => ipcRenderer.invoke('get-platform').then(p => p === 'win32'),
  isMac: () => ipcRenderer.invoke('get-platform').then(p => p === 'darwin'),
  isLinux: () => ipcRenderer.invoke('get-platform').then(p => p === 'linux'),

  // Listen for main process logs
  onMainLog: (callback) => ipcRenderer.on('main-log', (event, message) => callback(message)),
});

// Expose electron indicator
contextBridge.exposeInMainWorld('electron', {
  isDesktop: true
});

// Type definitions for the exposed API
/**
 * @typedef {Object} VstPlugin
 * @property {string} name - Plugin filename
 * @property {string} path - Full path to plugin
 * @property {string} folder - Folder containing the plugin
 */

/**
 * @typedef {Object} ElectronAPI
 * @property {() => Promise<VstPlugin[]>} scanVst - Scan default VST folders
 * @property {() => Promise<VstPlugin[]>} selectVstFolder - Open folder picker
 * @property {() => Promise<string>} getAppVersion - Get app version
 * @property {() => Promise<string>} getPlatform - Get OS platform
 * @property {() => Promise<boolean>} isWindows - Check if Windows
 * @property {() => Promise<boolean>} isMac - Check if macOS
 * @property {() => Promise<boolean>} isLinux - Check if Linux
 */
