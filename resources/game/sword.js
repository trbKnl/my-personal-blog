// Sword: walks out after detonator, drag to slice animals/detonator, falls when round clears.
// Relies on global `gsap` loaded via CDN.

import { spawnAndWalk } from './movement.js'

if (typeof gsap === 'undefined') {
  throw new Error('sword.js requires GSAP global. Load gsap CDN script before this module.')
}

const SWORD_HEIGHT = 80   // px — rendered height of sword img

export function spawnSword(overlay, houseEl, api) {
  const { getAnimals, removeAnimal, getDetonator, triggerDetonator, spawnConfetti, onSwordGone } = api

  // --- Spawn ---
  const el = document.createElement('img')
  el.src = '/game/assets/sword.svg'
  el.style.position = 'absolute'
  el.style.height = SWORD_HEIGHT + 'px'
  el.style.width = 'auto'
  el.style.pointerEvents = 'none'
  el.style.cursor = 'grab'
  el.style.zIndex = '9003'
  el.style.transformOrigin = 'center bottom'
  overlay.appendChild(el)

  const houseRect = houseEl.getBoundingClientRect()
  const startX = houseRect.right - 125
  const startY = houseRect.top + houseRect.height * 0.3

  const walkTweens = spawnAndWalk(el, overlay, startX, startY)

  let dragActive = false
  let lastX = 0
  const sliced = new Set()  // ids of already-sliced targets

  // Enable drag once emerge animation completes (300px / 150px/s = 2s)
  el.style.pointerEvents = 'none'
  setTimeout(() => {
    el.style.pointerEvents = 'auto'
    el.addEventListener('pointerdown', onPointerDown)
  }, 2100)

  function onPointerDown(e) {
    e.preventDefault()
    // Kill walk animation so drag takes over immediately
    if (walkTweens.walk) walkTweens.walk.kill()
    if (walkTweens.waddle) walkTweens.waddle.kill()
    gsap.set(el, { rotation: 0 })
    dragActive = true
    sliced.clear()
    lastX = e.clientX
    el.style.cursor = 'grabbing'
    el.setPointerCapture(e.pointerId)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
  }

  function onPointerMove(e) {
    if (!dragActive) return

    // Move sword to follow pointer
    const rect = el.getBoundingClientRect()
    const newLeft = parseFloat(el.style.left) + (e.clientX - rect.left - rect.width / 2)
    const newTop  = parseFloat(el.style.top)  + (e.clientY - rect.top  - rect.height / 2)
    gsap.set(el, { left: newLeft, top: newTop })

    // Sway based on horizontal velocity
    const velocity = e.clientX - lastX
    lastX = e.clientX
    gsap.set(el, { rotation: velocity * 0.4 })

    checkCollisions()
  }

  function onPointerUp() {
    dragActive = false
    el.style.cursor = 'grab'
    gsap.to(el, { rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    setTimeout(checkRoundClear, 50)
  }

  function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
  }

  function checkCollisions() {
    const swordRect = el.getBoundingClientRect()

    for (const animal of getAnimals()) {
      if (sliced.has(animal.id)) continue
      if (rectsOverlap(swordRect, animal.element.getBoundingClientRect())) {
        sliced.add(animal.id)
        sliceAnimal(animal)
        setTimeout(checkRoundClear, 50)
      }
    }

    const det = getDetonator()
    if (det && !sliced.has('detonator')) {
      if (rectsOverlap(swordRect, det.element.getBoundingClientRect())) {
        sliced.add('detonator')
        sliceTarget(det.element)
        triggerDetonator()
        setTimeout(checkRoundClear, 50)
      }
    }
  }

  function sliceAnimal(animal) {
    if (animal.tweens.walk) animal.tweens.walk.kill()
    if (animal.tweens.waddle) animal.tweens.waddle.kill()

    const rect = animal.element.getBoundingClientRect()
    animal.element.remove()
    removeAnimal(animal.id)

    spawnSliceHalves(animal.element.src, rect)
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, overlay)
  }

  function sliceTarget(element) {
    const rect = element.getBoundingClientRect()
    spawnSliceHalves(element.src, rect)
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, overlay)
  }

  function spawnSliceHalves(src, rect) {
    function makeHalf(clipPath) {
      const img = document.createElement('img')
      img.src = src
      img.style.position = 'absolute'
      img.style.left = rect.left + 'px'
      img.style.top = rect.top + 'px'
      img.style.width = rect.width + 'px'
      img.style.height = rect.height + 'px'
      img.style.clipPath = clipPath
      img.style.pointerEvents = 'none'
      img.style.zIndex = '9002'
      overlay.appendChild(img)
      return img
    }

    if (Math.random() < 0.5) {
      // Horizontal slice: top flies up, bottom falls down
      const topHalf = makeHalf('inset(0 0 50% 0)')
      const botHalf = makeHalf('inset(50% 0 0 0)')
      gsap.to(topHalf, { y: -180, rotation: -20, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => topHalf.remove() })
      gsap.to(botHalf, { y: 350, opacity: 0, duration: 0.9, ease: 'power2.in', onComplete: () => botHalf.remove() })
    } else {
      // Vertical slice: left flies left, right flies right
      const leftHalf  = makeHalf('inset(0 50% 0 0)')
      const rightHalf = makeHalf('inset(0 0 0 50%)')
      gsap.to(leftHalf,  { x: -200, rotation: -15, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => leftHalf.remove() })
      gsap.to(rightHalf, { x:  200, rotation:  15, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => rightHalf.remove() })
    }
  }

  function checkRoundClear() {
    if (getAnimals().length === 0 && !getDetonator()) {
      fallAndRemove()
    }
  }

  function fallAndRemove() {
    el.style.pointerEvents = 'none'
    el.removeEventListener('pointerdown', onPointerDown)
    gsap.to(el, {
      y: '+=' + (window.innerHeight + 200),
      rotation: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        el.remove()
        onSwordGone()
      },
    })
  }

  return { fallAndRemove }
}
