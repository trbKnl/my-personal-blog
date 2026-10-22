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
const PROJECTS_DIR = path.join(ROOT, 'projects')
const RSS_DIR = path.join(ROOT, 'rss')
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'views/blog.ejs'), 'utf-8')

function renderPost(file) {
  const { data, content } = matter(fs.readFileSync(path.join(BLOGS_DIR, file)))
  const html = ejs.render(TEMPLATE, {
    title: data.title,
    description: data.description,
    content: md.render(content),
    game: !!data.game
  })
  const out = path.join(PROJECTS_DIR, path.basename(file, path.extname(file)) + '.html')
  fs.writeFileSync(out, html, 'utf8')
  console.log('Built:', out)
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildMetadata() {
  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'))
  const meta = {}
  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(BLOGS_DIR, file)))
    meta[path.basename(file, '.md') + '.html'] = data
  }

  const sorted = Object.entries(meta).sort(([, a], [, b]) =>
    new Date(b.date) - new Date(a.date)
  )

  fs.writeFileSync(path.join(ROOT, 'blogmetadata.json'), JSON.stringify(Object.fromEntries(sorted), null, 2))

  const items = sorted.slice(0, 10).map(([file, data]) => `
    <item>
      <title>${escapeXml(data.title)}</title>
      <link>https://niekdeschipper.nl/projects/${file}</link>
      <guid isPermaLink="true">https://niekdeschipper.nl/projects/${file}</guid>
      <description>${escapeXml(data.description)}</description>
      <pubDate>${new Date(data.date).toUTCString()}</pubDate>
    </item>`).join('')

  fs.writeFileSync(path.join(RSS_DIR, 'rss.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>niekdeschipper.nl</title>
    <link>https://niekdeschipper.nl/rss/rss.xml</link>
    <description>RSS feed of niekdeschipper.nl</description>
    <language>en</language>${items}
  </channel>
</rss>`)

  console.log('Built: blogmetadata.json + rss.xml')
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

module.exports = { withBase, buildLevels, shouldCopy }

if (require.main === module) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true })
  fs.mkdirSync(RSS_DIR, { recursive: true })
  const args = process.argv.slice(2)
  if (args.length > 0) {
    renderPost(path.basename(args[0]))
  } else {
    fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md')).forEach(renderPost)
    buildMetadata()
  }
}
