// scripts/build-word-game.js
const fs   = require('fs')
const path = require('path')

// ─── Step 1: CSV → levels.json ───────────────────────────────────────────────

const CSV_PATH    = '/home/turbo/pythontest/word2vecgame_embeddings/level_candidates.csv'
const OUTPUT_DIR  = path.join(__dirname, '../resources/word-game')
const LEVELS_PATH = path.join(OUTPUT_DIR, 'levels.json')

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n')
lines.shift()  // remove header

// Group rows by (pole_a, pole_b, run)
const groups = new Map()
for (const line of lines) {
  const [pole_a, pole_b, run, word, t, relevance] = line.split(',')
  const key = `${pole_a}|${pole_b}|${run}`
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push({ word, t: parseFloat(t) })
}

// Keep only complete groups of exactly 5 words
const levels = []
for (const [key, words] of groups) {
  if (words.length !== 5) continue
  const [pole_a, pole_b, run] = key.split('|')
  words.sort((a, b) => a.t - b.t)
  levels.push({ pole_a, pole_b, run: parseInt(run), words })
}

fs.writeFileSync(LEVELS_PATH, JSON.stringify(levels))
console.log(`Wrote ${levels.length} levels to ${LEVELS_PATH}`)

// ─── Step 2: esbuild bundle ───────────────────────────────────────────────────

const esbuild = require('esbuild')

esbuild.build({
  entryPoints: [path.join(OUTPUT_DIR, 'game.js')],
  bundle:      true,
  minify:      true,
  outfile:     path.join(OUTPUT_DIR, 'game.bundle.js'),
  format:      'iife',
  platform:    'browser',
}).then(() => {
  console.log('Word game bundle built successfully')
}).catch(err => {
  console.error(err)
  process.exit(1)
})
