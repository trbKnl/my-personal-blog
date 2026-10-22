import { test, before, after } from 'node:test'
import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
const { start, reload, injectReload, clientCount } = createRequire(import.meta.url)('./serve.js')

const DIST = path.join(import.meta.dirname, '../dist')
const FIXTURE = path.join(DIST, '__test.html')
let server, base

before(async () => {
  fs.mkdirSync(DIST, { recursive: true })
  fs.writeFileSync(FIXTURE, '<html><body><p>hi</p></body></html>')
  server = start(0)
  await new Promise(resolve => server.once('listening', resolve))
  base = `http://localhost:${server.address().port}`
})

after(() => {
  fs.rmSync(FIXTURE, { force: true })
  server.close()
})

test('injectReload puts the script right before </body>', () => {
  assert.equal(injectReload('<body>x</body>'),
    "<body>x<script>new EventSource('/__reload').onmessage=()=>location.reload()</script></body>")
})

test('injectReload appends when there is no </body>', () => {
  assert.equal(injectReload('x'),
    "x<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>")
})

test('HTML responses carry the reload script', async () => {
  const res = await fetch(`${base}/__test.html`)
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type'), /^text\/html/)
  assert.match(await res.text(), /EventSource\('\/__reload'\)/)
})

test('path traversal is refused', async () => {
  const res = await fetch(`${base}/..%2Fpackage.json`)
  assert.ok([403, 404].includes(res.status), `status ${res.status}`)
  assert.doesNotMatch(await res.text(), /"name"/)
})

test('reload() reaches open clients and forgets closed ones', async () => {
  const req = http.get(`${base}/__reload`)
  const res = await new Promise(resolve => req.once('response', resolve))
  while (clientCount() === 0) await new Promise(r => setTimeout(r, 5))
  const received = new Promise(resolve => res.on('data', chunk => {
    if (String(chunk).includes('data: reload')) resolve()
  }))
  reload()
  await received

  req.destroy()
  while (clientCount() > 0) await new Promise(r => setTimeout(r, 5))
  assert.doesNotThrow(() => reload())
})
