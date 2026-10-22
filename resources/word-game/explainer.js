import * as THREE from 'three'
import { gsap }  from 'gsap'

// ── DOM setup ─────────────────────────────────────────────────────────────────
const root = document.getElementById('wge-root')
if (!root) throw new Error('No #wge-root element found')

const canvasWrap = document.createElement('div')
canvasWrap.style.cssText = 'position:relative;width:100%;'
root.appendChild(canvasWrap)

const nav = document.createElement('div')
nav.style.cssText = 'display:flex;justify-content:center;gap:16px;margin-top:12px;align-items:center;'
const prevBtn   = document.createElement('button')
const nextBtn   = document.createElement('button')
const stageInfo = document.createElement('span')
prevBtn.textContent     = '← Prev'
nextBtn.textContent     = 'Next →'
stageInfo.style.cssText = 'font-family:sans-serif;font-size:13px;color:#666;min-width:80px;text-align:center;'
nav.appendChild(prevBtn)
nav.appendChild(stageInfo)
nav.appendChild(nextBtn)
root.appendChild(nav)

;[prevBtn, nextBtn].forEach(btn => {
  btn.style.cssText = 'padding:6px 18px;font-size:14px;cursor:pointer;border:2px solid #000;background:#fff;font-family:sans-serif;'
  btn.onmouseenter = () => { btn.style.background = '#000'; btn.style.color = '#fff' }
  btn.onmouseleave = () => { btn.style.background = '#fff'; btn.style.color = '#000' }
})

// ── Three.js setup ────────────────────────────────────────────────────────────
const W = canvasWrap.clientWidth || 800
const H = 700

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(W, H)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xffffff, 1)
canvasWrap.appendChild(renderer.domElement)

const scene   = new THREE.Scene()
const camera  = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
const LOOK_AT = new THREE.Vector3(0, 0, 0)

// ── Word data ─────────────────────────────────────────────────────────────────
const WORD_DATA = [
  { label: 'happy',  pos: [ 1.0,  0.2,  0.3], css: '#FF0000', hex: 0xFF0000 },
  { label: 'joyful', pos: [ 0.7,  0.7, -0.4], css: '#B8A000', hex: 0xB8A000 },
  { label: 'meh',    pos: [ 0.0, -0.3,  0.9], css: '#0000FF', hex: 0x0000FF },
  { label: 'gloomy', pos: [-0.5,  0.6, -0.5], css: '#008000', hex: 0x008000 },
  { label: 'sad',    pos: [-0.9, -0.3,  0.1], css: '#333333', hex: 0x333333 },
]

const words = WORD_DATA.map(d => ({ ...d, vec: new THREE.Vector3(...d.pos) }))
const poleA = words[0].vec   // happy
const poleB = words[4].vec   // sad

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeLabel(text, cssColor, scale = 1) {
  const canvas  = document.createElement('canvas')
  canvas.width  = 512
  canvas.height = 128
  const ctx     = canvas.getContext('2d')
  ctx.fillStyle = cssColor
  ctx.font      = 'bold 48px sans-serif'
  ctx.fillText(text, 8, 88)
  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })
  const spr = new THREE.Sprite(mat)
  spr.scale.set(0.7 * scale, 0.175 * scale, 1)
  return spr
}

function makeArrow(from, to, color) {
  const dir = new THREE.Vector3().subVectors(to, from)
  const len = dir.length()
  return new THREE.ArrowHelper(dir.normalize(), from, len, color, len * 0.12, len * 0.07)
}

function makeLine(from, to, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()])
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color }))
}

function projectPoint(point, lineStart, lineEnd) {
  const ab = new THREE.Vector3().subVectors(lineEnd, lineStart)
  const ap = new THREE.Vector3().subVectors(point, lineStart)
  const t  = ap.dot(ab) / ab.dot(ab)
  return new THREE.Vector3().addVectors(lineStart, ab.clone().multiplyScalar(t))
}

// ── Scene objects ─────────────────────────────────────────────────────────────

// Stage 1 — coordinate axes
const axesGroup = new THREE.Group()
const AXIS_LEN  = 1.5
;[
  { dir: [1,0,0], lbl: 'x' },
  { dir: [0,1,0], lbl: 'y' },
  { dir: [0,0,1], lbl: 'z' },
].forEach(({ dir, lbl }) => {
  const d = new THREE.Vector3(...dir)
  axesGroup.add(new THREE.ArrowHelper(d, new THREE.Vector3(), AXIS_LEN, 0x999999, 0.1, 0.06))
  const sp = makeLabel(lbl, '#999999')
  sp.position.copy(d.clone().multiplyScalar(AXIS_LEN + 0.2))
  axesGroup.add(sp)
})
axesGroup.add(new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
))
scene.add(axesGroup)

// Stage 2 — word vectors
const wordsGroup = new THREE.Group()
words.forEach(w => {
  wordsGroup.add(makeArrow(new THREE.Vector3(), w.vec, w.hex))
  const sp = makeLabel(w.label, w.css)
  sp.position.copy(w.vec.clone().multiplyScalar(1.22))
  wordsGroup.add(sp)
})
scene.add(wordsGroup)

// Stage 3 — semantic axis (plain line, no arrowhead)
const semAxisGroup = new THREE.Group()
semAxisGroup.add(makeLine(poleA, poleB, 0x000000))
const axisLblSp = makeLabel('semantic axis', '#000000', 1.3)
axisLblSp.position.copy(
  poleA.clone().add(poleB).multiplyScalar(0.5).add(new THREE.Vector3(0.05, -0.28, 0))
)
semAxisGroup.add(axisLblSp)
scene.add(semAxisGroup)

// Stage 4 — projections; same objects transition into stage 5
// projLines  hidden in stage 5 (projection lines drop away)
// projLabels shown  in stage 5 (word labels appear above dots on the axis)
const projGroup  = new THREE.Group()
const projLines  = []
const projLabels = []

words.forEach((w, i) => {
  const proj = projectPoint(w.vec, poleA, poleB)

  const geo  = new THREE.BufferGeometry().setFromPoints([w.vec.clone(), proj.clone()])
  const mat  = new THREE.LineDashedMaterial({ color: w.hex, dashSize: 0.04, gapSize: 0.025 })
  const line = new THREE.Line(geo, mat)
  line.computeLineDistances()
  projGroup.add(line)
  projLines.push(line)

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 16),
    new THREE.MeshBasicMaterial({ color: w.hex })
  )
  dot.position.copy(proj)
  projGroup.add(dot)

  // Label above projection dot — only revealed in stage 5
  const yOffset = i % 2 === 0 ? 0.22 : 0.42
  const lbl = makeLabel(w.label, w.css)
  lbl.position.copy(proj.clone().add(new THREE.Vector3(0, yOffset, 0)))
  lbl.visible = false
  projGroup.add(lbl)
  projLabels.push(lbl)
})
scene.add(projGroup)

// ── Camera waypoints ──────────────────────────────────────────────────────────
const CAM_3D   = { x: 3.2, y: 2.0, z: 4.0 }
const CAM_FLAT = { x: 0.0, y: 0.2, z: 5.5 }

// camera.up for stage 5: computed so the semantic axis projects perfectly horizontal.
// up = normalize(camForward × axisDir) — perpendicular to both, making axis lie on screen's x-axis.
const CAM_DEFAULT_UP = new THREE.Vector3(0, 1, 0)
const CAM_FLAT_UP = new THREE.Vector3().crossVectors(
  new THREE.Vector3(-CAM_FLAT.x, -CAM_FLAT.y, -CAM_FLAT.z).normalize(),
  new THREE.Vector3().subVectors(poleB, poleA).normalize()
).normalize()
let targetUp = CAM_DEFAULT_UP.clone()

// ── Stage definitions ─────────────────────────────────────────────────────────
const STAGES = [
  {
    info: '1 / 5 — 3D space',
    enter() {
      targetUp.copy(CAM_DEFAULT_UP)
      axesGroup.visible    = true
      wordsGroup.visible   = false
      semAxisGroup.visible = false
      projGroup.visible    = false
      gsap.to(camera.position, { ...CAM_3D, duration: 0.8, ease: 'power2.out' })
    },
  },
  {
    info: '2 / 5 — word vectors',
    enter() {
      targetUp.copy(CAM_DEFAULT_UP)
      axesGroup.visible    = true
      wordsGroup.visible   = true
      semAxisGroup.visible = false
      projGroup.visible    = false
      gsap.to(camera.position, { ...CAM_3D, duration: 0.8, ease: 'power2.out' })
    },
  },
  {
    info: '3 / 5 — semantic axis',
    enter() {
      targetUp.copy(CAM_DEFAULT_UP)
      axesGroup.visible    = true
      wordsGroup.visible   = true
      semAxisGroup.visible = true
      projGroup.visible    = false
      gsap.to(camera.position, { ...CAM_3D, duration: 0.8, ease: 'power2.out' })
    },
  },
  {
    info: '4 / 5 — projections',
    enter() {
      targetUp.copy(CAM_DEFAULT_UP)
      axesGroup.visible    = true
      wordsGroup.visible   = true
      semAxisGroup.visible = true
      projGroup.visible    = true
      projLines.forEach(l  => { l.visible = true })
      projLabels.forEach(l => { l.visible = false })
      gsap.to(camera.position, { ...CAM_3D, duration: 0.8, ease: 'power2.out' })
    },
  },
  {
    // Same objects as stage 4 — camera pulls to front, lines drop, labels appear.
    // The dots on the semantic axis are the exact same dots from stage 4.
    info: '5 / 5 — collapse to 1D',
    enter() {
      targetUp.copy(CAM_FLAT_UP)
      axesGroup.visible    = false
      wordsGroup.visible   = false
      semAxisGroup.visible = true
      projGroup.visible    = true
      projLines.forEach(l  => { l.visible = false })
      projLabels.forEach(l => { l.visible = true })
      gsap.to(camera.position, { ...CAM_FLAT, duration: 1.5, ease: 'power2.inOut' })
    },
  },
]

// ── Stage machine ─────────────────────────────────────────────────────────────
let stage = 0

function goToStage(n) {
  gsap.killTweensOf(camera.position)
  stage = Math.max(0, Math.min(STAGES.length - 1, n))
  STAGES[stage].enter()
  prevBtn.disabled      = stage === 0
  nextBtn.disabled      = stage === STAGES.length - 1
  stageInfo.textContent = STAGES[stage].info
}

prevBtn.addEventListener('click', () => goToStage(stage - 1))
nextBtn.addEventListener('click', () => goToStage(stage + 1))

// ── Render loop ───────────────────────────────────────────────────────────────
camera.position.set(CAM_3D.x, CAM_3D.y, CAM_3D.z)

function animate() {
  requestAnimationFrame(animate)
  camera.up.lerp(targetUp, 0.06)
  camera.lookAt(LOOK_AT)
  renderer.render(scene, camera)
}

axesGroup.visible    = false
wordsGroup.visible   = false
semAxisGroup.visible = false
projGroup.visible    = false

goToStage(0)
animate()
