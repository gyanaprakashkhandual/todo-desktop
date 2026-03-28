# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please do not open a public GitHub issue.

Report it privately by emailing the maintainer directly via the contact listed on the
[GitHub profile](https://github.com/gyanaprakashkhandual).

Please include:

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix if available

You can expect an acknowledgement within 48 hours and a resolution or update within 7 days.

## Security Practices

This project follows Electron security best practices:

- `contextIsolation` is enabled
- `nodeIntegration` is disabled in the renderer process
- All renderer-to-main communication goes through the `contextBridge` preload API
- A strict Content Security Policy is applied to all windows
