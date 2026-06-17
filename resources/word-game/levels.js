// resources/word-game/levels.js

export async function fetchLevels(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load levels: ${res.status}`)
  return res.json()
}

export function groupByConcept(levels) {
  const map = new Map()
  for (const level of levels) {
    const key = `${level.pole_a},${level.pole_b}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(level)
  }
  return map
}

export function getConceptList(conceptMap) {
  return [...conceptMap.keys()].sort()
}

export function pickRandom(levels) {
  return levels[Math.floor(Math.random() * levels.length)]
}

export function pickByConcept(conceptMap, key) {
  const runs = conceptMap.get(key)
  return runs[Math.floor(Math.random() * runs.length)]
}

// playerWords: array of word strings in player's order (index 0 = closest to pole_a)
// levelWords:  array of { word, t } objects (will be sorted by t to get true order)
export function scorePairs(playerWords, levelWords) {
  const trueOrder = [...levelWords].sort((a, b) => a.t - b.t).map(w => w.word)
  let correct = 0
  const total = 10  // C(5,2)
  for (let i = 0; i < trueOrder.length; i++) {
    for (let j = i + 1; j < trueOrder.length; j++) {
      const pi = playerWords.indexOf(trueOrder[i])
      const pj = playerWords.indexOf(trueOrder[j])
      if (pi < pj) correct++
    }
  }
  return { correct, total, percent: Math.round(correct / total * 100) }
}
