# CLAUDE.md

## Project overview

Personal website and minimal static site generator. Node.js only (no Python dependency).

## Key structure

```
blogs/          # Source markdown files (write here)
projects/       # Generated static HTML (do not edit manually)
views/          # EJS templates: index.ejs (homepage), blog.ejs (posts)
resources/      # Static assets served at root: CSS, images, game/
scripts/
  build.js      # Builds all posts + metadata + RSS (or single file if arg given)
  watcher.js    # Watches blogs/ and triggers build.js on changes
app.js          # Express server
blogmetadata.json  # Generated — do not edit manually
rss/rss.xml        # Generated — do not edit manually
```

## Build system

Single script handles everything:

```bash
node ./scripts/build.js           # Build all posts + metadata + RSS
node ./scripts/build.js blogs/x.md  # Rebuild one post only (fast)
```

- Uses `gray-matter` for YAML front matter parsing
- Uses `markdown-it` + `highlight.js` for markdown → HTML
- Uses `ejs` to render `views/blog.ejs` template
- Generates `blogmetadata.json` sorted by date descending
- Generates RSS feed for 10 most recent posts

## Adding a blog post

1. Create `blogs/my-post.md` with front matter (`title`, `date`, `description`)
2. Run `npm run build` (or let the watcher do it in dev mode)

## Game overlay

An interactive game (`resources/game/`) runs as a fixed overlay on all pages (z-index 9000+). It's included via `views/blog.ejs` and `views/index.ejs`. Asset paths in `game/game.js` and `game/sword.js` must use absolute paths (`/game/assets/...`) to work correctly across all page routes.

## npm scripts

- `npm run dev` — server + watcher (concurrently)
- `npm run build` — full build
- `npm start` — server only
