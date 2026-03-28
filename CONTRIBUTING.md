# Contributing

Thank you for your interest in contributing to todo-desktop. All contributions are welcome.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/todo-desktop.git
cd todo-desktop
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Making Changes

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Keep branches focused on a single change. Avoid mixing unrelated changes in one pull request.

## Commit Messages

Use clear, concise commit messages in the imperative mood:

```
Add keyboard shortcut for completing todos
Fix crash when todo title is empty
Update README with build instructions
```

## Pull Requests

Before submitting:

- Ensure the app builds and runs without errors (`npm run build`)
- Test your changes on the platform you developed on
- Keep the PR description brief but clear — explain what changed and why

Submit your pull request against the `main` branch.

## Reporting Issues

When opening a bug report, include:

- Your operating system and version
- Node.js version (`node -v`)
- Steps to reproduce the issue
- What you expected vs what actually happened

## Code Style

- All code must be written in TypeScript
- React components go in `src/components/`
- Electron main process code goes in `electron/`
- Keep components small and focused on a single responsibility

## Questions

Open a GitHub Discussion or comment on the relevant issue if you have questions
before starting larger changes.
