import gsap from 'gsap'
import {
  createState, canSpawn, onSpawn, onPop,
  onDetonatorSpawn, onDetonatorPop, isRoundOver, resetRound
} from './state.js'
import { spawnAndWalk } from './movement.js'
import { spawnConfetti } from './confetti.js'
import { startTunnelSequence } from './tunnel.js'

// --- State ---
const state = createState()
const animals = []      // { id, element, tweens: { walk, waddle } }
let detonator = null    // { element, tweens: { walk, waddle } }
let portal = null
let nextId = 0

// --- Overlay ---
const overlay = document.createElement('div')
overlay.id = 'game-overlay'
document.body.appendChild(overlay)

// --- House ---
const house = document.createElement('img')
house.src = '/house-game/assets/house.svg'
house.id = 'game-house'
gsap.set(house, { y: 120 })
overlay.appendChild(house)

house.addEventListener('load', () => {
  gsap.to(house, { y: 0, duration: 0.6, ease: 'back.out(1.4)' })
})

house.addEventListener('click', handleHouseClick)

// --- Mobile toggle button ---
const toggleBtn = document.createElement('button')
toggleBtn.id = 'game-toggle'
document.body.appendChild(toggleBtn)

toggleBtn.addEventListener('click', () => {
  overlay.classList.toggle('game-visible')
  toggleBtn.classList.toggle('game-active')
})

// --- Portal ---
function spawnPortalSprite() {
  const el = document.createElement('img')
  el.src = '/house-game/assets/portal.svg'
  el.id = 'game-portal'
  el.className = 'game-sprite'
  overlay.appendChild(el)

  const houseRect = house.getBoundingClientRect()
  const startX = houseRect.right - 125
  const startY = houseRect.top + houseRect.height * 0.3

  const tweens = spawnAndWalk(el, overlay, startX, startY)
  portal = { element: el, tweens }

  el.addEventListener('click', handlePortalClick)
}

function handlePortalClick() {
  clearPortalIfPresent()
  clearDetonatorIfPresent()
  massPopAnimals()
  startTunnelSequence(() => {
    resetRound(state)
  })
}

function clearPortalIfPresent() {
  if (!portal) return
  if (portal.tweens.walk) portal.tweens.walk.kill()
  if (portal.tweens.waddle) portal.tweens.waddle.kill()
  portal.element.remove()
  portal = null
}

// --- House click ---
function handleHouseClick() {
  if (!canSpawn(state)) return

  const shouldSpawnDetonator = onSpawn(state)
  setTimeout(() => { state.spawnLocked = false }, 150)

  if (shouldSpawnDetonator) {
    spawnDetonatorSprite()
    onDetonatorSpawn(state)
    spawnPortalSprite()
  } else {
    spawnAnimalSprite()
  }
}

// --- Spawn animal ---
function spawnAnimalSprite() {
  const el = document.createElement('img')
  el.src = '/house-game/assets/animal.svg'
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

  if (isRoundOver(state)) {
    clearDetonatorIfPresent()
    clearPortalIfPresent()
    resetRound(state)
  }
}

// --- Detonator ---
function spawnDetonatorSprite() {
  const el = document.createElement('img')
  el.src = '/house-game/assets/detonator.svg'
  el.id = 'game-detonator'
  el.className = 'game-sprite'
  overlay.appendChild(el)

  const houseRect = house.getBoundingClientRect()
  const startX = houseRect.right - 125
  const startY = houseRect.top + houseRect.height * 0.3

  const tweens = spawnAndWalk(el, overlay, startX, startY)
  detonator = { element: el, tweens }

  el.addEventListener('click', handleDetonatorClick)
}

function handleDetonatorClick() {
  if (!detonator) return
  massPopAnimals()
  popDetonatorElement()
  clearPortalIfPresent()
  onDetonatorPop(state)
  resetRound(state)
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

function clearDetonatorIfPresent() {
  if (!detonator) return
  if (detonator.tweens.walk) detonator.tweens.walk.kill()
  if (detonator.tweens.waddle) detonator.tweens.waddle.kill()
  detonator.element.remove()
  detonator = null
}
