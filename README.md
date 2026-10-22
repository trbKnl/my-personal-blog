# niekdeschipper.nl

Personal website / minimal static site generator. Write markdown in `blogs/`, get a static site in `dist/`, served by GitHub Pages. Node.js only.

## Setup

```
npm install
```

## Usage

```bash
npm run dev    # Build, serve http://localhost:8080, rebuild + live reload on changes
npm run build  # Build the whole site into dist/
npm test       # Run tests
```

## Writing a post

Create `blogs/my-post.md`:

```markdown
---
title: My Post Title
date: 2025-01-01
description: Short description shown on the homepage
---

Content here. Markdown and raw HTML both work.
```

Link to assets with root-absolute paths (`/my-image.png`); they're rewritten for the site's base path at build time.

## Releasing

Commit and push to `main`. The GitHub Actions workflow runs the tests, builds `dist/` and deploys it to GitHub Pages. If anything fails, the live site stays as it was.

One-time setup: repo Settings → Pages → Source: **GitHub Actions**.

The site is served at `https://trbknl.github.io/my-personal-blog/` until a custom domain is set in Settings → Pages. The base path comes from the Pages configuration, so switching to a custom domain needs no code change, but the base path is baked in at build time: right after setting the domain, re-run the workflow (Actions → Deploy to GitHub Pages → Run workflow), otherwise the live pages keep pointing at `/my-personal-blog/…` and assets 404.

Paths are rewritten only in double-quoted `src="/…"` and `href="/…"` attributes. Inline scripts in posts must use paths relative to `/projects/` (e.g. `../worker.js`).
