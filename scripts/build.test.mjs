import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import net from 'node:net'
const { withBase, buildLevels, shouldCopy } = createRequire(import.meta.url)('./build.js')

test('withBase prefixes root-absolute src and href', () => {
  assert.equal(withBase('<a href="/projects/x.html"><img src="/a.png">', '/b'),
    '<a href="/b/projects/x.html"><img src="/b/a.png">')
  assert.equal(withBase('<a href="/">', '/b'), '<a href="/b/">')
})

test('withBase leaves other URLs alone', () => {
  const html = '<script src="//cdn.x/y.js"></script><a href="https://x.nl/r">r</a><a href="#blog">b</a><link href="bootstrap.min.css">'
  assert.equal(withBase(html, '/b'), html)
})

test('withBase with empty base is identity', () => {
  assert.equal(withBase('<img src="/a.png">', ''), '<img src="/a.png">')
})

test('buildLevels keeps groups with exactly 5 non-overlapping words, dedups across runs', () => {
  const rows = ['pole_a,pole_b,run,word,t,relevance']
  for (const [run, words] of [[1, ['joyful', 'content', 'neutral', 'gloomy', 'miserable']],
                              [2, ['joyful', 'elated', 'calm', 'dreary', 'wretched']],
                              [3, ['elated', 'calm', 'okay', 'dreary', 'wretched']]])
    words.forEach((w, i) => rows.push(`happy,sad,${run},${w},${i / 4},1`))
  const levels = buildLevels(rows.join('\n'))
  assert.deepEqual(levels.map(l => l.run), [1, 3])   // run 2 reuses "joyful"
  assert.deepEqual(levels[0].words.map(w => w.word), ['joyful', 'content', 'neutral', 'gloomy', 'miserable'])
})

test('shouldCopy skips game sources, tests and the CSV', () => {
  for (const p of ['house-game/game.js', 'house-game/state.test.mjs', 'word-game/levels.js',
                   'word-game/explainer.js', 'word-game/level_candidates.csv'])
    assert.equal(shouldCopy(p), false, p)
  for (const p of ['house-game/game.css', 'house-game/assets/house.svg', 'worker.js',
                   'opencv.js', 'icons/rss.svg', 'bootstrap.min.css', 'house-game', ''])
    assert.equal(shouldCopy(p), true, p)
})

test('--dev with the port taken exits with a clear message and leaves dist/ alone', async () => {
  const blocker = net.createServer().listen(0)
  await new Promise(resolve => blocker.once('listening', resolve))
  const sentinel = path.join(import.meta.dirname, '../dist/__sentinel')
  fs.mkdirSync(path.dirname(sentinel), { recursive: true })
  fs.writeFileSync(sentinel, 'x')
  try {
    const r = spawnSync(process.execPath, [path.join(import.meta.dirname, 'build.js'), '--dev'], {
      env: { ...process.env, PORT: String(blocker.address().port) },
      encoding: 'utf8',
      timeout: 20000
    })
    assert.equal(r.status, 1)
    assert.match(r.stderr, /already in use/)
    assert.ok(fs.existsSync(sentinel), 'dist/ was wiped')
  } finally {
    fs.rmSync(sentinel, { force: true })
    blocker.close()
  }
})
