import {
  createState, canSpawn, onSpawn, onPop,
  onDetonatorSpawn, onDetonatorPop, isRoundOver, resetRound
} from './state.js'
import { spawnAndWalk } from './movement.js'
import { spawnConfetti } from './confetti.js'
import { spawnSword } from './sword.js'

if (typeof gsap === 'undefined') {
  throw new Error('game.js requires GSAP global. Load gsap CDN script before this module.')
}

// --- State ---
const state = createState()
const animals = []      // { id, element, tweens: { walk, waddle } }
let detonator = null    // { element, tweens: { walk, waddle } }
let sword = null
let nextId = 0

// --- Overlay ---
const overlay = document.createElement('div')
overlay.id = 'game-overlay'
document.body.appendChild(overlay)

// --- House ---
const house = document.createElement('img')
house.src = '/game/assets/house.svg'
house.id = 'game-house'
overlay.appendChild(house)

house.addEventListener('click', handleHouseClick)

// --- Mobile toggle button ---
const toggleBtn = document.createElement('button')
toggleBtn.id = 'game-toggle'
document.body.appendChild(toggleBtn)

toggleBtn.addEventListener('click', () => {
  overlay.classList.toggle('game-visible')
  toggleBtn.classList.toggle('game-active')
})

// --- House click ---
function handleHouseClick() {
  if (!canSpawn(state)) return

  const shouldSpawnDetonator = onSpawn(state)
  setTimeout(() => { state.spawnLocked = false }, 150)

  if (shouldSpawnDetonator) {
    spawnDetonatorSprite()
    onDetonatorSpawn(state)
  } else {
    spawnAnimalSprite()
  }
}

// --- Spawn animal ---
function spawnAnimalSprite() {
  const el = document.createElement('img')
  el.src = '/game/assets/animal.svg'
  el.className = 'game-sprite'
  overlay.appendChild(el)

  const id = nextId++
  const houseRect = house.getBoundingClientRect()
  const startX = houseRect.right - 125
  const startY = houseRect.top + houseRect.height * 0.3

  const tweens = spawnAndWalk(el, overlay, startX, startY)
  animals.push({ id, element: el, tweens })

  el.addEventListener('click', () => handleAnimalClick(id))
}

// --- Pop animal (click) ---
function handleAnimalClick(id) {
  const idx = animals.findIndex(a => a.id === id)
  if (idx === -1) return

  const animal = animals[idx]

  if (animal.tweens.walk) animal.tweens.walk.kill()
  if (animal.tweens.waddle) animal.tweens.waddle.kill()
  gsap.set(animal.element, { rotation: 0 })

  const rect = animal.element.getBoundingClientRect()
  spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, overlay)

  animal.element.remove()
  animals.splice(idx, 1)
  onPop(state)

  // If sword is active it manages round-clear — skip auto-reset
  if (sword) return

  if (isRoundOver(state)) {
    clearDetonatorIfPresent()
    resetRound(state)
  }
}

// --- Remove animal without round-reset (used by sword) ---
function removeAnimalNoReset(id) {
  const idx = animals.findIndex(a => a.id === id)
  if (idx === -1) return
  animals.splice(idx, 1)
  onPop(state)
}

// --- Detonator ---
function spawnDetonatorSprite() {
  const el = document.createElement('img')
  el.src = '/game/assets/detonator.svg'
  el.id = 'game-detonator'
  el.className = 'game-sprite'
  overlay.appendChild(el)

  const houseRect = house.getBoundingClientRect()
  const startX = houseRect.right - 125
  const startY = houseRect.top + houseRect.height * 0.3

  const tweens = spawnAndWalk(el, overlay, startX, startY)
  detonator = { element: el, tweens }

  el.addEventListener('click', handleDetonatorClick)

  // Spawn sword 1.5s after detonator starts walking out
  setTimeout(spawnSwordSprite, 600)
}

function handleDetonatorClick() {
  if (!detonator) return
  massPopAnimals()
  popDetonatorElement()
  onDetonatorPop(state)

  if (sword) {
    sword.fallAndRemove()  // sword handles resetRound via onSwordGone
  } else {
    resetRound(state)
  }
}

// --- Sword triggers this when it slices the detonator ---
// Animals are NOT blown up — sword can continue slicing them individually.
function triggerDetonatorFromSword() {
  if (!detonator) return
  popDetonatorElement()
  state.detonatorOut = false
  // sword.js calls checkRoundClear after this; sword falls only when animals are also gone
}

function massPopAnimals() {
  animals.forEach(animal => {
    if (animal.tweens.walk) animal.tweens.walk.kill()
    if (animal.tweens.waddle) animal.tweens.waddle.kill()
    gsap.set(animal.element, { rotation: 0 })
    const rect = animal.element.getBoundingClientRect()
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, overlay)
    animal.element.remove()
  })
  animals.length = 0
}

function popDetonatorElement() {
  if (!detonator) return
  const detRect = detonator.element.getBoundingClientRect()
  spawnConfetti(detRect.left + detRect.width / 2, detRect.top + detRect.height / 2, overlay)
  if (detonator.tweens.walk) detonator.tweens.walk.kill()
  if (detonator.tweens.waddle) detonator.tweens.waddle.kill()
  detonator.element.remove()
  detonator = null
}

// --- Sword ---
function spawnSwordSprite() {
  sword = spawnSword(overlay, house, {
    getAnimals: () => animals,
    removeAnimal: removeAnimalNoReset,
    getDetonator: () => detonator,
    triggerDetonator: triggerDetonatorFromSword,
    spawnConfetti: (x, y) => spawnConfetti(x, y, overlay),
    onSwordGone: () => {
      sword = null
      resetRound(state)
    },
  })
}

function clearDetonatorIfPresent() {
  if (!detonator) return
  if (detonator.tweens.walk) detonator.tweens.walk.kill()
  if (detonator.tweens.waddle) detonator.tweens.waddle.kill()
  detonator.element.remove()
  detonator = null
}
