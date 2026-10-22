// Local preview of dist/ with live reload — production is served by GitHub Pages
const http = require('http')
const fs = require('fs')
const path = require('path')

const DIST_DIR = path.join(__dirname, '../dist')
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.wasm': 'application/wasm', '.csv': 'text/csv'
}
const RELOAD_SCRIPT = "<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>"

// Open /__reload event streams
const clients = new Set()

function injectReload(html) {
  const i = html.lastIndexOf('</body>')
  return i === -1 ? html + RELOAD_SCRIPT : html.slice(0, i) + RELOAD_SCRIPT + html.slice(i)
}

function reload() {
  for (const res of clients) res.write('data: reload\n\n')
}

function clientCount() {
  return clients.size
}

function start(port = 8080) {
  return http.createServer((req, res) => {
    if (req.url === '/__reload') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' })
      res.flushHeaders()
      clients.add(res)
      req.on('close', () => clients.delete(res))
      return
    }
    let file = path.join(DIST_DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!file.startsWith(DIST_DIR)) return res.writeHead(403).end()
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    fs.readFile(file, (err, data) => {
      if (err) return res.writeHead(404).end('Not found')
      const ext = path.extname(file)
      res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' })
      res.end(ext === '.html' ? injectReload(data.toString()) : data)
    })
  }).listen(port)
}

module.exports = { start, reload, injectReload, clientCount }
