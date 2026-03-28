# todo-desktop

A cross-platform desktop todo application built with Electron, React, and TypeScript. Runs on Windows and macOS.

## Tech Stack

- Electron
- React
- TypeScript
- Vite

## Requirements

- Node.js v18 or higher
- npm v9 or higher

## Getting Started

Clone the repository:

```bash
git clone https://github.com/gyanaprakashkhandual/todo-desktop.git
cd todo-desktop
```

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

## Build

```bash
# Production build
npm run build

# Package for macOS
npm run package:mac

# Package for Windows
npm run package:win
```

Packaged output will be in the `release/` directory.

## Project Structure

```
todo-desktop/
├── electron/
│   ├── main.ts          Main process
│   └── preload.ts       IPC bridge
├── src/
│   ├── main.tsx         React entry point
│   ├── App.tsx          Root component
│   └── components/      UI components
├── vite.config.ts
└── tsconfig.json
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE.md](./LICENSE.md).
