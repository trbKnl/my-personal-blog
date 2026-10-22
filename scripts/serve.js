// Local preview of dist/ — production is served by GitHub Pages
const http = require('http')
const fs = require('fs')
const path = require('path')

const DIST_DIR = path.join(__dirname, '../dist')
const PORT = 8080
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.wasm': 'application/wasm', '.csv': 'text/csv'
}

http.createServer((req, res) => {
  let file = path.join(DIST_DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!file.startsWith(DIST_DIR)) return res.writeHead(403).end()
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end('Not found')
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(PORT, () => console.log(`Local: http://localhost:${PORT}`))
