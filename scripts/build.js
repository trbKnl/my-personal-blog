const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const ejs = require('ejs')
const hljs = require('highlight.js')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try { return hljs.highlight(str, { language: lang }).value } catch (_) {}
    }
    return ''
  }
})

const ROOT = path.join(__dirname, '..')
const BLOGS_DIR = path.join(ROOT, 'blogs')
const VIEWS_DIR = path.join(ROOT, 'views')
const RESOURCES_DIR = path.join(ROOT, 'resources')
const DIST = path.join(ROOT, 'dist')
const BASE_PATH = process.env.BASE_PATH || ''
const SITE_URL = process.env.SITE_URL || 'http://localhost:8080'
const PORT = Number(process.env.PORT) || 8080

const esbuildOptions = {
  entryPoints: {
    'house-game/game.bundle': path.join(RESOURCES_DIR, 'house-game/game.js'),
    'word-game/game.bundle': path.join(RESOURCES_DIR, 'word-game/game.js'),
    'word-game-explainer.bundle': path.join(RESOURCES_DIR, 'word-game/explainer.js'),
  },
  outdir: DIST,
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  define: { 'process.env.BASE_PATH': JSON.stringify(BASE_PATH) },
}

function write(rel, content) {
  const out = path.join(DIST, rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, content, 'utf8')
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function rss(posts) {
  const items = posts.slice(0, 10).map(([file, data]) => `
    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${SITE_URL}/projects/${file}</link>
      <guid isPermaLink="true">${SITE_URL}/projects/${file}</guid>
      <description>${escapeXml(data.description)}</description>
      <pubDate>${new Date(data.date).toUTCString()}</pubDate>
    </item>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>niekdeschipper.nl</title>
    <link>${SITE_URL}/</link>
    <description>RSS feed of niekdeschipper.nl</description>
    <language>en</language>${items}
  </channel>
</rss>`
}

// Everything except wiping dist/ and bundling the games
function buildSite() {
  fs.cpSync(RESOURCES_DIR, DIST, {
    recursive: true,
    filter: src => shouldCopy(path.relative(RESOURCES_DIR, src).split(path.sep).join('/'))
  })

  const csv = fs.readFileSync(path.join(RESOURCES_DIR, 'word-game/level_candidates.csv'), 'utf8')
  write('word-game/levels.json', JSON.stringify(buildLevels(csv)))

  const blogTemplate = fs.readFileSync(path.join(VIEWS_DIR, 'blog.ejs'), 'utf8')
  const posts = []
  for (const file of fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'))) {
    const { data, content } = matter(fs.readFileSync(path.join(BLOGS_DIR, file)))
    const name = path.basename(file, '.md') + '.html'
    write(`projects/${name}`, withBase(ejs.render(blogTemplate, {
      title: data.title,
      description: data.description,
      content: md.render(content),
      game: !!data.game,
      siteUrl: SITE_URL
    }), BASE_PATH))
    posts.push([name, data])
  }
  posts.sort(([, a], [, b]) => new Date(b.date) - new Date(a.date))

  const indexTemplate = fs.readFileSync(path.join(VIEWS_DIR, 'index.ejs'), 'utf8')
  write('index.html', withBase(ejs.render(indexTemplate, {
    metadata: Object.fromEntries(posts),
    siteUrl: SITE_URL
  }), BASE_PATH))
  write('rss/rss.xml', rss(posts))
  console.log(`Built: ${posts.length} posts, index.html, rss.xml`)
}

// Prefix root-absolute src/href (not protocol-relative //) with the base path
function withBase(html, base) {
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`)
}

// Word substrings of each other count as overlapping
function hasOverlap(a, b) {
  return a.length >= 3 && b.length >= 3 && (a.includes(b) || b.includes(a))
}

// level_candidates.csv text -> levels with exactly 5 distinct words, no word reused within a game
function buildLevels(csv) {
  const lines = csv.trim().split('\n')
  lines.shift()  // remove header

  // Group rows by (pole_a, pole_b, run)
  const groups = new Map()
  for (const line of lines) {
    const [pole_a, pole_b, run, word, t] = line.split(',')
    const key = `${pole_a}|${pole_b}|${run}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ word, t: parseFloat(t) })
  }

  const levels = []
  for (const [key, words] of groups) {
    const [pole_a, pole_b, run] = key.split('|')
    const poles = [pole_a.toLowerCase(), pole_b.toLowerCase()]

    // Remove very short words and words overlapping with poles
    let filtered = words.filter(({ word }) => {
      if (word.length < 3) return false
      const w = word.toLowerCase()
      return !poles.some(p => hasOverlap(w, p))
    })

    // Remove words overlapping with each other
    filtered = filtered.filter(({ word: w1 }) => {
      const a = w1.toLowerCase()
      return !filtered.some(({ word: w2 }) => {
        const b = w2.toLowerCase()
        return a !== b && hasOverlap(a, b)
      })
    })

    if (filtered.length !== 5) continue
    filtered.sort((a, b) => a.t - b.t)
    levels.push({ pole_a, pole_b, run: parseInt(run), words: filtered })
  }

  // Deduplicate: no word may appear twice within the same game
  const gameGroups = new Map()
  for (const level of levels) {
    const gk = `${level.pole_a}|${level.pole_b}`
    if (!gameGroups.has(gk)) gameGroups.set(gk, [])
    gameGroups.get(gk).push(level)
  }

  const deduped = []
  for (const [, gameLevels] of gameGroups) {
    gameLevels.sort((a, b) => a.run - b.run)
    const usedWords = new Set()
    for (const level of gameLevels) {
      const lowerWords = level.words.map(w => w.word.toLowerCase())
      if (lowerWords.every(w => !usedWords.has(w))) {
        deduped.push(level)
        lowerWords.forEach(w => usedWords.add(w))
      }
    }
  }
  return deduped
}

// relPath is relative to resources/; game sources and tests are bundled, not copied
function shouldCopy(relPath) {
  if (relPath.endsWith('level_candidates.csv')) return false
  return !/^(house-game|word-game)\/[^/]+\.m?js$/.test(relPath)
}

module.exports = { withBase, buildLevels, shouldCopy, buildSite, esbuildOptions }

// Wipe dist/ and build pages; bundles are left to the caller
function cleanBuild() {
  fs.rmSync(DIST, { recursive: true, force: true })
  try {
    buildSite()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

if (require.main === module) {
  if (process.argv.includes('--dev')) dev()
  else {
    cleanBuild()
    require('esbuild').build(esbuildOptions)
      .then(() => console.log('Built: game bundles'))
      .catch(() => process.exit(1))
  }
}

// Serve dist/, rebuild on change, reload open tabs
async function dev() {
  const serve = require('./serve')
  const chokidar = require('chokidar')

  // Claim the port before touching dist/, so a second instance can't wipe the first one's output
  const server = serve.start(PORT)
  try {
    await new Promise((resolve, reject) => server.once('listening', resolve).once('error', reject))
  } catch (err) {
    console.error(err.code === 'EADDRINUSE'
      ? `Port ${PORT} is already in use — is npm run dev already running?`
      : err.message)
    process.exit(1)
  }
  cleanBuild()
  console.log(`Local: http://localhost:${PORT}`)

  // esbuild watches the game sources itself
  const ctx = await require('esbuild').context({
    ...esbuildOptions,
    plugins: [{ name: 'reload', setup: b => b.onEnd(r => { if (!r.errors.length) serve.reload() }) }]
  })
  await ctx.watch()

  let timer
  chokidar.watch([BLOGS_DIR, VIEWS_DIR, RESOURCES_DIR], {
    ignoreInitial: true,
    ignored: p => /(house-game|word-game)\/[^/]+\.m?js$/.test(p)
  }).on('all', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        buildSite()
        serve.reload()
      } catch (err) {
        console.error(err.message)
      }
    }, 100)
  })
}
