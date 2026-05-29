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

fs.mkdirSync(PROJECTS_DIR, { recursive: true })
fs.mkdirSync(RSS_DIR, { recursive: true })

function renderPost(file) {
  const { data, content } = matter(fs.readFileSync(path.join(BLOGS_DIR, file)))
  const html = ejs.render(TEMPLATE, {
    title: data.title,
    description: data.description,
    content: md.render(content)
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
      <link>https://niekdeschipper.com/projects/${file}</link>
      <guid isPermaLink="true">https://niekdeschipper.com/projects/${file}</guid>
      <description>${escapeXml(data.description)}</description>
      <pubDate>${new Date(data.date).toUTCString()}</pubDate>
    </item>`).join('')

  fs.writeFileSync(path.join(RSS_DIR, 'rss.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>niekdeschipper.com</title>
    <link>https://niekdeschipper.com/rss/rss.xml</link>
    <description>RSS feed of niekdeschipper.com</description>
    <language>en</language>${items}
  </channel>
</rss>`)

  console.log('Built: blogmetadata.json + rss.xml')
}

const args = process.argv.slice(2)
if (args.length > 0) {
  renderPost(path.basename(args[0]))
} else {
  fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md')).forEach(renderPost)
  buildMetadata()
}
