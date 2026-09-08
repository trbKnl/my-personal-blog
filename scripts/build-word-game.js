// scripts/build-word-game.js
const fs   = require('fs')
const path = require('path')

// ─── Step 1: CSV → levels.json ───────────────────────────────────────────────

const CSV_PATH    = path.join(__dirname, '../resources/word-game/level_candidates.csv')
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

// Filter words that are substrings of a pole or of each other, then keep groups with exactly 5
function hasOverlap(a, b) {
  return a.length >= 3 && b.length >= 3 && (a.includes(b) || b.includes(a))
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

// ─── Deduplicate: no word may appear twice within the same game ──────────────
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

fs.writeFileSync(LEVELS_PATH, JSON.stringify(deduped))
console.log(`Wrote ${deduped.length} levels to ${LEVELS_PATH} (from ${levels.length} before dedup)`)

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
