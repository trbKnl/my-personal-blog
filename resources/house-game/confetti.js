// MS Paint style confetti: hard-edged colored squares, no blur or shadows.
// x, y are viewport-relative coordinates (use getBoundingClientRect() center).
import gsap from 'gsap'

const COLORS = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#FFFFFF', '#000000']
const SQUARE_SIZE = 8
const COUNT_MIN = 20
const COUNT_MAX = 30

export function spawnConfetti(x, y, overlay) {
  const count = COUNT_MIN + Math.floor(Math.random() * (COUNT_MAX - COUNT_MIN + 1))

  for (let i = 0; i < count; i++) {
    const sq = document.createElement('div')
    sq.className = 'confetti-square'
    sq.style.left = (x - SQUARE_SIZE / 2) + 'px'
    sq.style.top  = (y - SQUARE_SIZE / 2) + 'px'
    sq.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
    overlay.appendChild(sq)

    const dx       = (Math.random() - 0.5) * 220
    const kickUp   = -(Math.random() * 160 + 60)
    const spin     = (Math.random() - 0.5) * 720

    // Phase 1: burst outward and upward
    gsap.to(sq, {
      x: dx,
      y: kickUp,
      rotation: spin,
      duration: 0.3 + Math.random() * 0.15,
      ease: 'power2.out',
      onComplete: () => {
        // Phase 2: gravity — fall off the bottom of the screen
        const fallDistance = window.innerHeight - y + Math.abs(kickUp) + 100
        gsap.to(sq, {
          y: '+=' + fallDistance,
          duration: 0.7 + Math.random() * 0.6,
          ease: 'power2.in',
          onComplete: () => sq.remove(),
        })
      },
    })
  }
}
