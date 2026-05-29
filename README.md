# niekdeschipper.com

Personal website / minimal static site generator. Write markdown in `blogs/`, get HTML out. Node.js only.

## How it works

1. Write blog posts as markdown in `blogs/` (with YAML front matter)
2. `npm run build` converts them to HTML in `projects/`, and generates `blogmetadata.json` + `rss/rss.xml`
3. Express serves the static files and renders the homepage from the metadata

## Setup

```
npm install
```

## Usage

```bash
npm run dev    # Express server + file watcher (auto-rebuilds on changes)
npm run build  # Build all posts, metadata, and RSS feed
npm start      # Just run the server
```

## Docker

```bash
# Build the image
docker build -t website .

# Run the container
docker run -p 8080:8080 website

# Build and run with a custom tag
docker build -t website:latest . && docker run --rm -p 8080:8080 website:latest
```

The site will be available at http://localhost:8080.

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
