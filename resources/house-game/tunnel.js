import * as THREE from 'three'
import gsap from 'gsap'

// ─── Pure function — testable without DOM ─────────────────────────────────────

export function isColliding(a, b, radius = 1.5) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius
}

// ─── Scene builders ───────────────────────────────────────────────────────────

function createTunnelPath() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(  0,  0,   0),
    new THREE.Vector3(  3,  2,  -25),
    new THREE.Vector3( -3, -1,  -50),
    new THREE.Vector3(  2, -3,  -75),
    new THREE.Vector3( -2,  2, -100),
    new THREE.Vector3(  3,  1, -125),
    new THREE.Vector3( -1, -2, -150),
    new THREE.Vector3(  0,  0, -175),
    new THREE.Vector3(  0,  0, -200),
  ])
}

function createTunnelMesh(path, radius) {
  const NUM_SPIRALS = 3
  const TURNS       = 7
  const SAMPLES     = 1200

  const group = new THREE.Group()

  // Solid tube interior — the candy cane base
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.BackSide })
  group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 400, radius, 20, false), tubeMat))

  // Spiral stripes — the candy cane bands
  const frames    = path.computeFrenetFrames(SAMPLES, false)
  const stripeMat = new THREE.LineBasicMaterial({ color: 0x000000 })
  const r         = radius * 0.99   // slightly inside the wall

  for (let s = 0; s < NUM_SPIRALS; s++) {
    const positions = new Float32Array((SAMPLES + 1) * 3)
    for (let i = 0; i <= SAMPLES; i++) {
      const t     = i / SAMPLES
      const pt    = path.getPoint(t)
      const angle = t * TURNS * Math.PI * 2 + (s / NUM_SPIRALS) * Math.PI * 2
      const n     = frames.normals[i]
      const b     = frames.binormals[i]
      positions[i * 3]     = pt.x + r * (Math.cos(angle) * n.x + Math.sin(angle) * b.x)
      positions[i * 3 + 1] = pt.y + r * (Math.cos(angle) * n.y + Math.sin(angle) * b.y)
      positions[i * 3 + 2] = pt.z + r * (Math.cos(angle) * n.z + Math.sin(angle) * b.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    group.add(new THREE.Line(geo, stripeMat))
  }

  return group
}

function createSpacecraft() {
  const group = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 1.6, 8),
    new THREE.MeshBasicMaterial({ color: 0x222222 }),
  )
  body.rotation.x = -Math.PI / 2
  group.add(body)

  const wings = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.07, 0.6),
    new THREE.MeshBasicMaterial({ color: 0x444444 }),
  )
  wings.position.z = 0.45
  group.add(wings)

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x0d6efd }),
  )
  nose.position.z = 0.95
  group.add(nose)

  return group
}

// ─── Controls ─────────────────────────────────────────────────────────────────

function setupKeyboard(craftTarget) {
  const keys = { w: false, a: false, s: false, d: false }

  function onKeyDown(e) {
    const k = e.key.toLowerCase()
    if (k === 'w' || k === 'arrowup')    keys.w = true
    if (k === 's' || k === 'arrowdown')  keys.s = true
    if (k === 'a' || k === 'arrowleft')  keys.a = true
    if (k === 'd' || k === 'arrowright') keys.d = true
  }
  function onKeyUp(e) {
    const k = e.key.toLowerCase()
    if (k === 'w' || k === 'arrowup')    keys.w = false
    if (k === 's' || k === 'arrowdown')  keys.s = false
    if (k === 'a' || k === 'arrowleft')  keys.a = false
    if (k === 'd' || k === 'arrowright') keys.d = false
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup',   onKeyUp)

  return {
    update() {
      const SPEED = 0.05, MAX = 3.0
      if (keys.w) craftTarget.y = Math.min(craftTarget.y + SPEED,  MAX)
      if (keys.s) craftTarget.y = Math.max(craftTarget.y - SPEED, -MAX)
      if (keys.a) craftTarget.x = Math.max(craftTarget.x - SPEED, -MAX)
      if (keys.d) craftTarget.x = Math.min(craftTarget.x + SPEED,  MAX)
    },
    cleanup() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup',   onKeyUp)
    },
  }
}

function setupTouch(canvas, craftTarget) {
  const MAX = 3.0

  function onTouchMove(e) {
    e.preventDefault()
    // Map touch position across the screen to craft offset range [-MAX, MAX]
    const tx = e.touches[0].clientX / canvas.width  * 2 - 1   // -1 to 1
    const ty = e.touches[0].clientY / canvas.height * 2 - 1   // -1 to 1
    craftTarget.x =  tx * MAX
    craftTarget.y = -ty * MAX
  }

  canvas.addEventListener('touchmove', onTouchMove, { passive: false })

  return {
    cleanup() {
      canvas.removeEventListener('touchmove', onTouchMove)
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function spawnConfetti3D(position, scene, forwardDir) {
  const COLORS = [0xff0000, 0xffff00, 0x0000ff, 0x008000, 0xffffff, 0x000000]
  // How far forward the confetti carries (matches plane speed feel)
  const FORWARD_BIAS = 8
  for (let i = 0; i < 24; i++) {
    const mat  = new THREE.MeshBasicMaterial({
      color:       COLORS[Math.floor(Math.random() * COLORS.length)],
      side:        THREE.DoubleSide,
      transparent: true,
    })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.02), mat)
    mesh.position.copy(position)
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    scene.add(mesh)

    const fwd = forwardDir ? forwardDir : new THREE.Vector3(0, 0, -1)
    gsap.to(mesh.position, {
      x: position.x + (Math.random() - 0.5) * 6 + fwd.x * FORWARD_BIAS,
      y: position.y + Math.random() * 3 + 0.5   + fwd.y * FORWARD_BIAS,
      z: position.z + (Math.random() - 0.5) * 6 + fwd.z * FORWARD_BIAS,
      duration: 1.5,
      ease: 'power2.out',
    })
    gsap.to(mesh.rotation, {
      x: mesh.rotation.x + (Math.random() - 0.5) * 12,
      y: mesh.rotation.y + (Math.random() - 0.5) * 12,
      z: mesh.rotation.z + (Math.random() - 0.5) * 12,
      duration: 1.5,
    })
    gsap.to(mat, {
      opacity: 0,
      duration: 0.6,
      delay: 0.9,
      onComplete: () => {
        scene.remove(mesh)
        mesh.geometry.dispose()
        mat.dispose()
      },
    })
  }
}

function spawnTunnelAnimals(path, scene, tunnelRadius) {
  const loader  = new THREE.TextureLoader()
  const texNorm = loader.load('/house-game/assets/animal.svg')
  const texFlip = texNorm.clone()
  texFlip.repeat.set(-1, 1)
  texFlip.offset.set(1, 0)
  texFlip.needsUpdate = true

  // Pre-compute Frenet frames so we can offset along the tube's local axes
  const FRAME_SAMPLES = 400
  const frames = path.computeFrenetFrames(FRAME_SAMPLES, false)

  const animals = []

  for (let i = 0; i < 80; i++) {
    const t     = 0.15 + Math.random() * 0.75
    const pos   = path.getPoint(t)
    const angle = Math.random() * Math.PI * 2
    const maxR  = tunnelRadius - 1.2           // leave room for sprite half-width
    const r     = 0.4 + Math.random() * (maxR - 0.4)

    // Offset along local normal/binormal instead of world X/Y
    const fi = Math.round(t * FRAME_SAMPLES)
    const n  = frames.normals[fi]
    const b  = frames.binormals[fi]
    pos.x += (Math.cos(angle) * n.x + Math.sin(angle) * b.x) * r
    pos.y += (Math.cos(angle) * n.y + Math.sin(angle) * b.y) * r
    pos.z += (Math.cos(angle) * n.z + Math.sin(angle) * b.z) * r

    const tex    = Math.random() < 0.5 ? texFlip : texNorm
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 }))
    sprite.position.copy(pos)
    sprite.scale.set(1.6, 1.6, 1)
    scene.add(sprite)
    const animal = { sprite, alive: false }
    gsap.to(sprite.material, { opacity: 1, duration: 0.8, delay: i * 0.15, onComplete: () => { animal.alive = true } })
    animals.push(animal)
  }

  return animals
}

// ─── Phase 1: Intro ───────────────────────────────────────────────────────────
//
// Canvas fades in while the camera glides from outside toward the tunnel
// entrance and the craft rises from below into view. No user control.
// Camera ends at path.getPoint(0) so the handoff to the flight loop is seamless.

function runIntroPhase(refs, canvas, onDone) {
  const { renderer, scene, camera, craft, path } = refs

  canvas.classList.add('tunnel-active')
  gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.inOut' })

  const camStart = new THREE.Vector3(0, 0, 18)
  const camEnd   = path.getPoint(0)   // (0, 0, 0) — tunnel entrance

  // Compute the exact world position that runFlightSequence will place the
  // craft at t=0 (camera-relative, using the path tangent at the entrance).
  // Using this as craftEnd means the intro lands exactly where the flight
  // loop picks up — no jump, no blend needed.
  camera.position.copy(camEnd)
  camera.lookAt(path.getPoint(0.02))
  camera.updateMatrixWorld()
  const _fw = new THREE.Vector3()
  const _rt = new THREE.Vector3()
  const _up = new THREE.Vector3()
  camera.getWorldDirection(_fw)
  _rt.setFromMatrixColumn(camera.matrixWorld, 0)
  _up.setFromMatrixColumn(camera.matrixWorld, 1)
  const craftEnd = camEnd.clone()
    .addScaledVector(_fw, 3)
    .addScaledVector(_up, -0.5)   // craftTarget.y initial value

  const craftStart = new THREE.Vector3(0, -8, 14)

  const DURATION = 4.0
  let startTime  = null
  let animId     = null

  function tick(timestamp) {
    if (!startTime) startTime = timestamp
    const t     = Math.min((timestamp - startTime) / 1000 / DURATION, 1)
    // ease-out: rushes toward tunnel then decelerates at the entrance
    const eased = 1 - (1 - t) * (1 - t)

    camera.position.lerpVectors(camStart, camEnd, eased)
    camera.lookAt(path.getPoint(0.02))   // identical to flight loop's first lookAt

    craft.position.lerpVectors(craftStart, craftEnd, eased)
    craft.lookAt(craft.position.clone().addScaledVector(_fw, 10))

    renderer.render(scene, camera)

    if (t >= 1) {
      cancelAnimationFrame(animId)
      onDone()
      return
    }
    animId = requestAnimationFrame(tick)
  }

  animId = requestAnimationFrame(tick)
}

// ─── Phase 2: Flight ──────────────────────────────────────────────────────────
//
// Camera rides the tunnel path for FLIGHT_DURATION seconds.
// User controls are active from the first frame.
// Animals are passed in as a live array — caller populates it after a delay
// so the player has a moment to get used to the controls first.

const FLIGHT_DURATION = 16

function runFlightSequence(refs, canvas, confettiOverlay, onDone) {
  const { renderer, scene, camera, path, craft, animals } = refs

  const craftTarget = { x: 0, y: -0.5 }
  const keyboard    = setupKeyboard(craftTarget)
  const touch       = setupTouch(canvas, craftTarget)
  let prevCraftX    = craftTarget.x
  let currentBank   = 0

  let startTime = null
  let animId    = null
  let done      = false

  const right   = new THREE.Vector3()
  const up      = new THREE.Vector3()
  const forward = new THREE.Vector3()

  function tick(timestamp) {
    if (done) return
    if (!startTime) startTime = timestamp
    const elapsed = (timestamp - startTime) / 1000
    const t       = Math.min(elapsed / FLIGHT_DURATION, 1)

    const camPos = path.getPoint(t)
    camera.position.copy(camPos)
    camera.lookAt(path.getPoint(Math.min(t + 0.02, 1)))
    camera.updateMatrixWorld()

    keyboard.update()
    right.setFromMatrixColumn(camera.matrixWorld, 0)
    up.setFromMatrixColumn(camera.matrixWorld, 1)
    camera.getWorldDirection(forward)

    craft.position.copy(camPos)
      .addScaledVector(forward, 3)
      .addScaledVector(right, craftTarget.x)
      .addScaledVector(up, craftTarget.y)

    craft.lookAt(craft.position.clone().addScaledVector(forward, 10))

    // Bank into turns: smoothly lerp bank toward velocity-based target
    const MAX_BANK   = 0.5
    const dx         = craftTarget.x - prevCraftX
    const targetBank = -Math.sign(dx) * Math.min(Math.abs(dx) / 0.05, 1) * MAX_BANK
    currentBank      = currentBank + (targetBank - currentBank) * 0.1
    craft.rotateZ(currentBank)
    prevCraftX = craftTarget.x

    // animals is a live array; it starts empty and gets populated after a delay
    animals.forEach(animal => {
      if (!animal.alive) return
      if (isColliding(craft.position, animal.sprite.position)) {
        animal.alive          = false
        animal.sprite.visible = false
        spawnConfetti3D(animal.sprite.position, scene, forward)
      }
    })

    renderer.render(scene, camera)

    if (t >= 1) {
      done = true
      keyboard.cleanup()
      touch.cleanup()
      onDone()
      return
    }
    animId = requestAnimationFrame(tick)
  }

  animId = requestAnimationFrame(tick)
}

// ─── Phase 3: Exit ────────────────────────────────────────────────────────────
//
// Camera stays fixed. Craft accelerates away from wherever it currently is,
// shrinking into the distance. No teleport — craft starts from its exact
// last position including any steering offset.

function runSpaceExit(refs, onDone) {
  const { renderer, scene, camera, craft } = refs

  const exitPos    = craft.position.clone()
  const camForward = new THREE.Vector3()
  camera.getWorldDirection(camForward)

  const DURATION = 1.5
  let startTime  = null
  let animId     = null

  function tick(timestamp) {
    if (!startTime) startTime = timestamp
    const t     = Math.min((timestamp - startTime) / 1000 / DURATION, 1)
    const eased = t * t   // ease-in: craft accelerates away

    craft.position.copy(exitPos).addScaledVector(camForward, eased * 50)
    craft.lookAt(craft.position.clone().addScaledVector(camForward, 10))

    renderer.render(scene, camera)

    if (t >= 1) {
      cancelAnimationFrame(animId)
      onDone()
      return
    }
    animId = requestAnimationFrame(tick)
  }

  animId = requestAnimationFrame(tick)
}

// ─── Exit transition ──────────────────────────────────────────────────────────

function playExitTransition(renderer, canvas, confettiOverlay, onComplete) {
  gsap.to(canvas, {
    opacity:  0,
    duration: 0.7,
    onComplete: () => {
      canvas.classList.remove('tunnel-active')
      canvas.remove()
      confettiOverlay.remove()
      renderer.dispose()
      onComplete()
    },
  })
}

// ─── DOM ──────────────────────────────────────────────────────────────────────

function createDOMElements() {
  const canvas = document.createElement('canvas')
  canvas.id    = 'tunnel-canvas'
  document.documentElement.appendChild(canvas)

  const confettiOverlay = document.createElement('div')
  confettiOverlay.id    = 'tunnel-confetti-overlay'
  document.documentElement.appendChild(confettiOverlay)

  return { canvas, confettiOverlay }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function startTunnelSequence(onComplete) {
  const { canvas, confettiOverlay } = createDOMElements()

  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(canvas.width, canvas.height)
  renderer.setClearColor(0xffffff)

  const scene        = new THREE.Scene()
  const aspect       = canvas.width / canvas.height
  const fov          = aspect < 1 ? 100 : 75   // wider FOV on portrait/mobile = everything looks smaller
  const camera       = new THREE.PerspectiveCamera(fov, aspect, 0.1, 200)

  const path         = createTunnelPath()
  const tunnelRadius = aspect < 1 ? 3.5 : 5   // narrower on portrait/mobile
  const tunnelMesh   = createTunnelMesh(path, tunnelRadius)
  scene.add(tunnelMesh)

  const craft  = createSpacecraft()
  scene.add(craft)

  // animals starts empty — populated 3 seconds into the flight phase
  // so the player has time to get familiar with the controls first
  const animals = []
  const refs    = { renderer, scene, camera, path, tunnelMesh, craft, animals }

  runIntroPhase(refs, canvas, () => {
    // Spawn animals 2 seconds after user takes control
    setTimeout(() => {
      spawnTunnelAnimals(path, scene, tunnelRadius).forEach(a => animals.push(a))
    }, 3000)

    runFlightSequence(refs, canvas, confettiOverlay, () => {
      runSpaceExit(refs, () => {
        playExitTransition(renderer, canvas, confettiOverlay, onComplete)
      })
    })
  })
}
