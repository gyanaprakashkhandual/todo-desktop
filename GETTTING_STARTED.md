# Electron + React + TypeScript + Vite — Project Setup

> No raw HTML. The entire UI is React + TypeScript.
> Vite handles the renderer build. TypeScript compiles the main process.

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- VS Code (recommended)

---

## Step 1 — Scaffold the Project

```bash
mkdir my-electron-app
cd my-electron-app
npm init -y
```

---

## Step 2 — Install All Dependencies

### Runtime

```bash
npm install react react-dom
```

### Dev dependencies

```bash
npm install --save-dev \
  electron \
  electron-builder \
  vite \
  @vitejs/plugin-react \
  typescript \
  @types/react \
  @types/react-dom \
  @types/node \
  concurrently \
  wait-on \
  cross-env
```

---

## Step 3 — Final Folder Structure

```
my-electron-app/
├── electron/
│   ├── main.ts              ← Electron main process
│   └── preload.ts           ← IPC bridge (main ↔ renderer)
├── src/
│   ├── App.tsx              ← Root React component
│   ├── main.tsx             ← React entry point (replaces index.html script)
│   ├── vite-env.d.ts        ← Vite type declarations
│   └── components/          ← Your React components go here
│       └── Counter.tsx
├── dist/
│   ├── electron/            ← Compiled main + preload (tsc output)
│   └── renderer/            ← Compiled React app (vite output)
├── tsconfig.json            ← Shared base config
├── tsconfig.electron.json   ← Config for main process only
├── vite.config.ts           ← Vite config for renderer
├── index.html               ← Minimal Vite entry (one line, no real HTML logic)
├── package.json
└── .gitignore
```

> `index.html` is only needed as a Vite entry point — it contains a single
> `<div id="root">` and a script tag. All real UI lives in React.

---

## Step 4 — TypeScript Configs

### `tsconfig.json` — base config (renderer / React)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "outDir": "./dist/renderer",
    "types": ["vite/client"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "electron"]
}
```

### `tsconfig.electron.json` — main process only

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist/electron",
    "jsx": "react",
    "types": ["node"]
  },
  "include": ["electron/**/*"],
  "exclude": ["node_modules", "dist", "src"]
}
```

---

## Step 5 — Vite Config

### `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./", // Required for Electron file:// protocol
  root: ".",
  build: {
    outDir: "dist/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
```

---

## Step 6 — Minimal Vite Entry Point

### `index.html`

This is the only file with any HTML — it is just a mount point.
All real UI is in React.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self' 'unsafe-inline' http://localhost:5173; script-src 'self' 'unsafe-inline' http://localhost:5173"
    />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Step 7 — Electron Source Files

### `electron/main.ts` — Main Process

```typescript
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: "hiddenInset", // Clean native macOS look
    show: false,
  });

  if (isDev) {
    // In dev: load from Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // In prod: load built React app
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ── IPC Handlers ──────────────────────────────────────────────────
ipcMain.handle("get-app-version", () => app.getVersion());
ipcMain.handle("get-platform", () => process.platform);
```

---

### `electron/preload.ts` — IPC Bridge

```typescript
import { contextBridge, ipcRenderer } from "electron";

// Everything exposed here becomes available as window.electronAPI in React
contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke("get-app-version"),

  getPlatform: (): Promise<string> => ipcRenderer.invoke("get-platform"),
});
```

---

## Step 8 — React Source Files

### `src/main.tsx` — React Entry Point

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### `src/vite-env.d.ts` — Vite + Electron Type Declarations

```typescript
/// <reference types="vite/client" />

// Extend Window to include our Electron API
interface Window {
  electronAPI: {
    getAppVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
  };
}
```

---

### `src/App.tsx` — Root Component

```tsx
import React, { useEffect, useState } from "react";
import Counter from "./components/Counter";

const App: React.FC = () => {
  const [version, setVersion] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    window.electronAPI.getAppVersion().then(setVersion);
    window.electronAPI.getPlatform().then(setPlatform);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Electron App</h1>
      <p style={styles.meta}>
        v{version} — {platform}
      </p>
      <Counter />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
  },
  meta: {
    fontSize: "0.9rem",
    opacity: 0.5,
  },
};

export default App;
```

---

### `src/components/Counter.tsx` — Example Component

```tsx
import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div style={styles.wrapper}>
      <p style={styles.count}>{count}</p>
      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <button style={styles.btn} onClick={() => setCount((c) => c + 1)}>
          +
        </button>
        <button
          style={{ ...styles.btn, opacity: 0.5 }}
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  count: {
    fontSize: "3rem",
    fontWeight: 700,
    minWidth: "80px",
    textAlign: "center",
  },
  buttons: {
    display: "flex",
    gap: "0.75rem",
  },
  btn: {
    padding: "0.5rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#cdd6f4",
    cursor: "pointer",
  },
};

export default Counter;
```

---

## Step 9 — Configure package.json

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Electron + React + TypeScript + Vite",
  "main": "dist/electron/main.js",
  "scripts": {
    "dev:vite": "vite",
    "dev:electron": "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .",
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
    "build:renderer": "vite build",
    "build:electron": "tsc -p tsconfig.electron.json",
    "build": "npm run build:renderer && npm run build:electron",
    "package:mac": "npm run build && electron-builder --mac",
    "package:win": "npm run build && electron-builder --win"
  },
  "build": {
    "appId": "com.yourname.myelectronapp",
    "productName": "My Electron App",
    "directories": {
      "output": "release"
    },
    "files": ["dist/**/*"],
    "mac": {
      "target": "dmg",
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": "nsis"
    }
  }
}
```

---

## Step 10 — .gitignore

```
node_modules/
dist/
release/
*.js.map
.DS_Store
```

---

## Step 11 — Run the App

```bash
# Start dev mode (Vite + Electron together, hot reload)
npm run dev
```

```bash
# Production build
npm run build

# Package for macOS
npm run package:mac

# Package for Windows
npm run package:win
```

---

## How It All Connects

```
npm run dev
  │
  ├── Vite dev server  →  http://localhost:5173  (React app, hot reload)
  │
  └── Electron main.ts
        │
        ├── Creates BrowserWindow
        │     └── loads http://localhost:5173  (in dev)
        │         or  dist/renderer/index.html (in prod)
        │
        └── preload.ts
              └── exposes window.electronAPI to React safely
```

---

## Architecture Summary

| File                  | Process             | Role                                           |
| --------------------- | ------------------- | ---------------------------------------------- |
| `electron/main.ts`    | Main (Node.js)      | Window creation, OS access, IPC handlers       |
| `electron/preload.ts` | Isolated bridge     | Exposes safe APIs to React via `contextBridge` |
| `src/main.tsx`        | Renderer (Chromium) | Mounts React into `#root`                      |
| `src/App.tsx`         | Renderer            | Root React component                           |
| `src/components/`     | Renderer            | All your UI components in TSX                  |
| `vite.config.ts`      | Build tool          | Bundles React for Electron renderer            |

---

## Adding More npm Scripts (Optional)

| Need                 | Install                                            |
| -------------------- | -------------------------------------------------- |
| Global styles        | `npm install styled-components` or use CSS modules |
| Routing              | `npm install react-router-dom`                     |
| State management     | `npm install zustand` (lightweight)                |
| UI component library | `npm install @radix-ui/react-*` or `shadcn/ui`     |
| Icons                | `npm install lucide-react`                         |
