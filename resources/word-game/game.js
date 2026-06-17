// resources/word-game/game.js
import {
  fetchLevels, groupByConcept, getConceptList,
  pickRandom, pickByConcept, scorePairs,
} from './levels.js'
import {
  showLoading, hideLoading,
  renderBoard, showResults, showConceptModal,
} from './ui.js'

const LEVELS_URL = '/word-game/levels.json'

let allLevels    = []
let conceptMap   = new Map()
let conceptList  = []
let currentLevel = null

async function init() {
  const container = document.getElementById('word-game-container')
  if (!container) return

  showLoading(container)

  try {
    allLevels   = await fetchLevels(LEVELS_URL)
    conceptMap  = groupByConcept(allLevels)
    conceptList = getConceptList(conceptMap)
  } catch (err) {
    container.innerHTML = `<p style="color:#FF0000;font-weight:bold">Failed to load game data.</p>`
    return
  }

  hideLoading(container)
  playLevel(pickRandom(allLevels))
}

function playLevel(level) {
  const container = document.getElementById('word-game-container')
  if (!container) return
  currentLevel = level

  renderBoard(container, level, {
    onSubmit(playerWords) {
      const result = scorePairs(playerWords, level.words)
      showResults(container, result, level, playerWords).then(() => {
        playLevel(nextLevel(level))
      })
    },
    onCogClick() {
      showConceptModal(conceptList, key => {
        playLevel(pickByConcept(conceptMap, key))
      })
    },
    onPrev() { playLevel(prevLevel(level)) },
    onNext() { playLevel(nextLevel(level)) },
  })
}

// Advance to the next run of the same concept pair, wrapping at 100
function nextLevel(level) {
  const key  = `${level.pole_a},${level.pole_b}`
  const runs = conceptMap.get(key)
  const idx  = runs.findIndex(l => l.run === level.run)
  return runs[(idx + 1) % runs.length]
}

function prevLevel(level) {
  const key  = `${level.pole_a},${level.pole_b}`
  const runs = conceptMap.get(key)
  const idx  = runs.findIndex(l => l.run === level.run)
  return runs[(idx - 1 + runs.length) % runs.length]
}

init()
