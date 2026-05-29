// Two-phase GSAP walk: emerge from house door growing to full size, then roam to random spot.
import gsap from 'gsap'

const HOUSE_SAFE_ZONE = {
  maxLeft: 220,  // house left (20px) + house width (80px) + emergence buffer (120px)
  minTop: 0.75,  // avoid bottom 25% of screen (where house lives)
}
const WALK_SPEED_MIN = 150   // px per second (slowest)
const WALK_SPEED_MAX = 350   // px per second (fastest)
const EMERGE_DISTANCE = 300  // px to walk right before roaming
const SPRITE_SIZE = 60       // sprite dimensions in px (used for spawn bounds)
const EMERGE_START_SCALE = 0.15  // start at door size, grow to 1 during emergence

export function spawnAndWalk(element, overlay, startX, startY) {
  element.style.left = startX + 'px'
  element.style.top = startY + 'px'

  // Start tiny — will grow to full size during emergence
  gsap.set(element, { scaleX: EMERGE_START_SCALE, scaleY: EMERGE_START_SCALE })

  const walkSpeed = WALK_SPEED_MIN + Math.random() * (WALK_SPEED_MAX - WALK_SPEED_MIN)
  const tweens = { walk: null, waddle: null }

  function startWaddle() {
    tweens.waddle = gsap.to(element, {
      rotation: 5,
      duration: 0.15,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }

  function stopWaddle() {
    if (tweens.waddle) {
      tweens.waddle.kill()
      tweens.waddle = null
    }
    gsap.set(element, { rotation: 0 })
  }

  function setFacing(targetX, currentX) {
    // Use GSAP scaleX so it composes correctly with other GSAP-managed transforms.
    // CSS class transforms are overridden by GSAP inline styles.
    gsap.set(element, { scaleX: targetX < currentX ? -1 : 1 })
  }

  function pickRandomDest() {
    const w = overlay.clientWidth
    const h = overlay.clientHeight
    let left, top
    // Retry until outside house safe zone
    do {
      left = randomBetween(SPRITE_SIZE, w - SPRITE_SIZE * 2)
      top  = randomBetween(SPRITE_SIZE, h - SPRITE_SIZE * 2)
    } while (left < HOUSE_SAFE_ZONE.maxLeft && top > h * HOUSE_SAFE_ZONE.minTop)
    return { left, top }
  }

  // Phase 1: emerge right from house door, growing from tiny to full size
  const phase1TargetX = startX + EMERGE_DISTANCE
  gsap.set(element, { scaleX: EMERGE_START_SCALE })  // face right, start tiny
  startWaddle()

  tweens.walk = gsap.to(element, {
    left: phase1TargetX,
    scaleX: 1,   // grow to full width while walking out
    scaleY: 1,   // grow to full height while walking out
    duration: EMERGE_DISTANCE / walkSpeed,
    ease: 'none',
    onComplete: () => {
      stopWaddle()

      // Phase 2: walk to random destination
      const dest = pickRandomDest()
      const currentLeft = parseFloat(element.style.left)
      const currentTop  = parseFloat(element.style.top)
      const distance = Math.hypot(dest.left - currentLeft, dest.top - currentTop)
      const duration = Math.max(0.5, distance / walkSpeed)

      setFacing(dest.left, currentLeft)
      startWaddle()

      tweens.walk = gsap.to(element, {
        left: dest.left,
        top: dest.top,
        duration,
        ease: 'none',
        onComplete: () => {
          stopWaddle()
          // Keep facing the direction they arrived from — no reset
        },
      })
    },
  })

  return tweens
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
