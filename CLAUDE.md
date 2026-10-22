# CLAUDE.md

## Project overview

Personal website and minimal static site generator. Node.js only (no Python dependency). Hosted on GitHub Pages; there is no server.

## Key structure

```
blogs/          # Source markdown files (write here)
views/          # EJS templates: index.ejs (homepage), blog.ejs (posts)
resources/      # Static assets copied to the site root: CSS, images, games
  house-game/   # Three.js/GSAP overlay game (sources bundled by esbuild)
  word-game/    # Word embedding game + explainer (sources bundled by esbuild)
scripts/
  build.js      # Builds the whole site into dist/; --dev adds serve + watch + live reload
  serve.js      # Local static server for dist/ with /__reload (SSE)
.github/workflows/deploy.yml  # Push to main → test, build, deploy to Pages
dist/           # Generated — gitignored, never edit
```

## Build system

```bash
node scripts/build.js        # Full build into dist/
node scripts/build.js --dev  # Build, serve :8080, watch, live reload
```

- Uses `gray-matter` for YAML front matter, `markdown-it` + `highlight.js` for markdown → HTML, `ejs` for templates
- Posts → `dist/projects/<name>.html`, homepage → `dist/index.html`, RSS (10 most recent) → `dist/rss/rss.xml`
- `resources/word-game/level_candidates.csv` → `dist/word-game/levels.json`
- esbuild bundles `house-game/game.js`, `word-game/game.js`, `word-game/explainer.js`
- Game sources, tests and the CSV are not copied to `dist/`

## Base path

The site may live under a subpath (`/my-personal-blog`) or at a domain root. `BASE_PATH` and `SITE_URL` env vars (set in CI from `actions/configure-pages`) control this:

- In posts and templates, write root-absolute paths (`/x.png`); `withBase` rewrites `src="/…"` / `href="/…"` at build time
- In game JS, prefix asset URLs with `(process.env.BASE_PATH || '')`; esbuild substitutes it
- Inline scripts in posts can't be rewritten: use paths relative to `/projects/` (e.g. `../worker.js`)

## Adding a blog post

1. Create `blogs/my-post.md` with front matter (`title`, `date`, `description`)
2. Preview with `npm run dev`, release by pushing to `main`

## Game overlay

The house game (`resources/house-game/`) runs as a fixed overlay (z-index 9000+), included via `views/index.ejs`.

## npm scripts

- `npm run dev` — build + serve + watch + live reload
- `npm run build` — full build into `dist/`
- `npm test` — `node --test`
