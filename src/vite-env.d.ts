/// <reference types="vite/client" />

// Extend Window to include our Electron API
interface Window {
  electronAPI: {
    getAppVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
  };
}
