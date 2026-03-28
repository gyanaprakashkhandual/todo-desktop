import { contextBridge, ipcRenderer } from 'electron';

// Everything exposed here becomes available as window.electronAPI in React
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke('get-app-version'),

  getPlatform: (): Promise<string> =>
    ipcRenderer.invoke('get-platform'),
});