# SteamForge Hub — Project Overview

This repository contains a small static website used as an index for Steam manifests (AppIDs). It also contains a local-only screenshots feature and a disclaimer page with VirusTotal reporting guidance.

## File structure

- `index.html` — Main landing page: search/manifests UI and download links.
- `disclaimer.html` — Disclaimer and VirusTotal section; static screenshots gallery lives here (owner-managed).
- `main.css` — Extracted CSS for the site.
- `main.js` — Extracted JS; includes manifest logic and static gallery + VirusTotal local save.
- `sw.js` — Service Worker for precaching and offline-first fetching.
- `favicon.png` — Site favicon (static asset).
 - `assets/screenshots/` — static warning screenshots to show on the `disclaimer.html` page. Owner adds images here and updates `assets/screenshots/screenshots.json`.

## Design & Performance

- Fonts: Using system fonts to avoid external font requests and reduce latency.
- Icons: Inline SVGs to avoid CDN requests for icon fonts.
- CSS/JS externalized for caching and future minification.
- Reduced heavy visual effects (lower blur & shadow values) to improve rendering performance on low-end machines.

## Security recommendations

Some security features are applied in the repo; others must be configured on the server.

Client-side changes included:
- Content Security Policy meta tag added (practical policy permitting inline styles for compatibility). Consider enforcing stricter CSP with nonces if you remove inline styles.
- Service Worker registration is restricted to secure origins (HTTPS or localhost).
- Inputs validated client-side (AppID numeric check). File uploads accept only images and are stored locally.

Server-side recommended headers (configure in your web server):
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (if using HTTPS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade` or stricter
- `Content-Security-Policy` as response header (stronger than meta tag)
- Serve compressed assets (`gzip` or `brotli`) and add `Cache-Control` for static assets.

## Local testing

Start a local server and open `http://localhost:5500`:

```powershell
python -m http.server 5500
```

Then open DevTools to check Service Worker registration and caching.

## Future improvements (options)

- Add a build pipeline (esbuild/rollup) to minify and hash assets for cache-busting.
- Host fonts locally (`.woff2`) and use `font-display:swap`.
- Harden CSP to remove `'unsafe-inline'` and use nonces for styles/scripts.
- Add server endpoints for optional server-side screenshot storage (requires backend).
- Add automated tests and CI for linting/style checks.

If you want, I can implement a minimal build pipeline (`package.json` + `esbuild`) or scaffold a tiny Node.js backend for uploads. Which do you prefer next?

## How to add owner screenshots (disclaimer gallery)

1. Put image files (SVG/PNG/JPG) into `assets/screenshots/`.
2. Edit `assets/screenshots/screenshots.json` and list the filenames in order, for example:

```json
["steamtools-warning.svg", "example2.png"]
```

The site will display those images on `disclaimer.html`. This ensures only you (the owner) control what appears to users.
