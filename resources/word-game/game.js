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

  const idx = allLevels.indexOf(level)
  const key = `${level.pole_a},${level.pole_b}`
  const runs = conceptMap.get(key)

  renderBoard(container, level, {
    levelIndex: idx + 1,
    levelTotal: allLevels.length,
    conceptIndex: runs.indexOf(level) + 1,
    conceptTotal: runs.length,
    onSubmit(playerWords) {
      const result = scorePairs(playerWords, level.words)
      showResults(container, result, level, playerWords).then(() => {
        playLevel(allLevels[(idx + 1) % allLevels.length])
      })
    },
    onCogClick() {
      showConceptModal(conceptList, key => {
        playLevel(pickByConcept(conceptMap, key))
      })
    },
    onPrev() { playLevel(allLevels[(idx - 1 + allLevels.length) % allLevels.length]) },
    onNext() { playLevel(allLevels[(idx + 1) % allLevels.length]) },
  })
}

init()
