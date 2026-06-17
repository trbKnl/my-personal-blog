// resources/word-game/ui.js
import gsap from 'gsap'
import { spawnConfetti } from '../house-game/confetti.js'

// ─── Loading screen ───────────────────────────────────────────────────────────

export function showLoading(container) {
  container.innerHTML = `
    <div id="wg-loading">
      <div class="wg-spinner"></div>
      <div id="wg-loading-text">Loading levels…</div>
    </div>
  `
}

export function hideLoading(container) {
  const el = container.querySelector('#wg-loading')
  if (el) el.remove()
}

// ─── Game board ───────────────────────────────────────────────────────────────

// Renders the game board for a level.
// Returns a teardown function that removes event listeners.
// onSubmit(playerWords) — called when player clicks Submit
// onNext()             — called when player clicks Next Level
// onCogClick()         — called when player clicks the cog
export function renderBoard(container, level, { onSubmit, onCogClick, onPrev, onNext }) {
  const runLabel  = `Level ${level.run}/100`
  const conceptLabel = `${level.pole_a.toUpperCase()} ↔ ${level.pole_b.toUpperCase()}`

  // Shuffle words for display (don't reveal the answer order)
  const shuffled = shuffleArray(level.words.map(w => w.word))

  container.innerHTML = `
    <div id="wg-topbar">
      <button id="wg-cog-btn" title="Choose concept">⚙</button>
      <div id="wg-level-nav">
        <button id="wg-prev-btn" title="Previous level">←</button>
        <div id="wg-level-info">${runLabel}</div>
        <button id="wg-next-nav-btn" title="Next level">→</button>
      </div>
    </div>

    <div id="wg-axis-area">
      <div id="wg-poles">
        <span class="wg-pole">${level.pole_a.toUpperCase()}</span>
        <span class="wg-pole">${level.pole_b.toUpperCase()}</span>
      </div>
      <div id="wg-axis-labels"></div>
      <div id="wg-axis-bar-wrap">
        <div id="wg-axis-line"></div>
      </div>
    </div>

    <div id="wg-order-hint">← ${level.pole_a.toUpperCase()} ················· ${level.pole_b.toUpperCase()} →</div>

    <div id="wg-cards">
      ${shuffled.map(w => `<div class="word-card" data-word="${w}">${w}</div>`).join('')}
    </div>

    <button id="wg-submit">Submit</button>

    <div id="wg-score-panel"></div>
  `

  const submitBtn = container.querySelector('#wg-submit')
  submitBtn.disabled = false
  const cogBtn    = container.querySelector('#wg-cog-btn')
  const cardsEl   = container.querySelector('#wg-cards')

  // Track player order — updated on every drag
  let playerOrder = shuffled.slice()

  enableDragSort(cardsEl, newOrder => { playerOrder = newOrder })

  submitBtn.addEventListener('click', () => {
    submitBtn.disabled = true
    onSubmit(playerOrder.slice())
  })

  cogBtn.addEventListener('click', onCogClick)
  container.querySelector('#wg-prev-btn').addEventListener('click', onPrev)
  container.querySelector('#wg-next-nav-btn').addEventListener('click', onNext)
}

// ─── Results ─────────────────────────────────────────────────────────────────

// Shows score panel and true-position dots on axis.
// result = { correct, total, percent }
// level  = { pole_a, pole_b, words: [{word, t}] }
export function showResults(container, result, level, playerOrder) {
  const scorePanel = container.querySelector('#wg-score-panel')
  const axisWrap   = container.querySelector('#wg-axis-bar-wrap')
  const cardsEl    = container.querySelector('#wg-cards')
  const trueOrder   = [...level.words].sort((a, b) => a.t - b.t).map(w => w.word)

  // Color the cards green/red
  cardsEl.querySelectorAll('.word-card').forEach(card => {
    const word     = card.dataset.word
    const trueIdx  = trueOrder.indexOf(word)
    const playerIdx = playerOrder.indexOf(word)

    // A card is "correct" if all words that should be before it ARE before it
    // We use a simpler visual: correct if it's in the exact right position
    card.classList.add(trueIdx === playerIdx ? 'correct' : 'wrong')
  })

  // Place true-position dots on axis
  const axisWidth = axisWrap.querySelector('#wg-axis-line').offsetWidth
  level.words.forEach(({ word, t }) => {
    const playerIdx = playerOrder.indexOf(word)
    const trueIdx   = trueOrder.indexOf(word)
    const isCorrect = playerIdx === trueIdx

    const dot = document.createElement('div')
    dot.className = `wg-true-dot ${isCorrect ? 'correct' : 'wrong'}`
    dot.title     = word
    dot.style.left = `${t * 100}%`
    axisWrap.appendChild(dot)
    gsap.from(dot, { scale: 0, duration: 0.3, ease: 'back.out(2)', delay: 0.1 })
  })

  // Word labels above axis dots — staggered into two lanes by sorted order
  const labelsEl = container.querySelector('#wg-axis-labels')
  const sortedWords = [...level.words].sort((a, b) => a.t - b.t)
  sortedWords.forEach(({ word, t }, i) => {
    const playerIdx = playerOrder.indexOf(word)
    const isCorrect = playerIdx === trueOrder.indexOf(word)

    const label = document.createElement('div')
    label.className = 'wg-axis-label' + (i % 2 === 1 ? ' lane-1' : '')
    label.textContent = word
    label.style.left = `${t * 100}%`
    label.style.color = isCorrect ? '#008000' : '#FF0000'
    labelsEl.appendChild(label)
    gsap.from(label, { opacity: 0, y: 6, duration: 0.3, ease: 'power2.out', delay: 0.05 * i })
  })

  // Score panel
  scorePanel.style.display = 'block'
  scorePanel.innerHTML = `
    <div id="wg-score-main">${result.percent}% — ${result.correct}/${result.total} pairs correct</div>
    <div id="wg-score-detail">${result.percent >= 80 ? '🎉 Great job!' : 'Keep trying!'}</div>
    <button id="wg-next-btn">Next Level →</button>
  `
  gsap.from(scorePanel, { opacity: 0, y: 10, duration: 0.3 })

  // Confetti if ≥ 80%
  if (result.percent >= 80) {
    const rect = container.getBoundingClientRect()
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, document.body)
  }

  scorePanel.querySelector('#wg-next-btn').addEventListener('click', () => {
    container.querySelector('#wg-submit').disabled = false
    scorePanel.style.display = 'none'
  })

  return new Promise(resolve => {
    scorePanel.querySelector('#wg-next-btn').addEventListener('click', resolve)
  })
}

// ─── Concept selector modal ───────────────────────────────────────────────────

export function showConceptModal(conceptList, onSelect) {
  const backdrop = document.createElement('div')
  backdrop.id    = 'wg-modal-backdrop'

  const buttons = conceptList.map(key => {
    const [a, b] = key.split(',')
    return `<button class="wg-concept-btn" data-key="${key}">${a.toUpperCase()} ↔ ${b.toUpperCase()}</button>`
  }).join('')

  backdrop.innerHTML = `
    <div id="wg-modal">
      <div id="wg-modal-header">
        <span id="wg-modal-title">Choose a concept (${conceptList.length})</span>
        <button id="wg-modal-close">✕</button>
      </div>
      <div id="wg-modal-list">${buttons}</div>
    </div>
  `

  document.body.appendChild(backdrop)
  gsap.from(backdrop.querySelector('#wg-modal'), { y: -20, opacity: 0, duration: 0.2 })

  function close() { backdrop.remove() }

  backdrop.querySelector('#wg-modal-close').addEventListener('click', close)
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close() })

  backdrop.querySelectorAll('.wg-concept-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      close()
      onSelect(btn.dataset.key)
    })
  })
}

// ─── Drag-to-reorder ──────────────────────────────────────────────────────────

function enableDragSort(container, onOrderChange) {
  let drag = null  // { card, startX }

  container.addEventListener('pointerdown', e => {
    const card = e.target.closest('.word-card')
    if (!card) return
    e.preventDefault()
    container.setPointerCapture(e.pointerId)
    drag = { card, startX: e.clientX }
    gsap.set(card, { zIndex: 10, scale: 1.05 })
  })

  container.addEventListener('pointermove', e => {
    if (!drag) return
    const dx = e.clientX - drag.startX
    gsap.set(drag.card, { x: dx })

    const cards  = [...container.children]
    const myIdx  = cards.indexOf(drag.card)
    const myRect = drag.card.getBoundingClientRect()
    const myCenter = myRect.left + myRect.width / 2

    for (let i = 0; i < cards.length; i++) {
      if (i === myIdx) continue
      const r           = cards[i].getBoundingClientRect()
      const otherCenter = r.left + r.width / 2
      const crossed = (myIdx < i && myCenter > otherCenter) ||
                      (myIdx > i && myCenter < otherCenter)
      if (crossed) {
        // Briefly animate the displaced neighbor
        const nudge = myIdx < i ? -myRect.width * 0.25 : myRect.width * 0.25
        gsap.fromTo(cards[i], { x: nudge }, { x: 0, duration: 0.12, ease: 'power2.out' })
        // Swap in DOM
        if (myIdx < i) container.insertBefore(cards[i], drag.card)
        else           container.insertBefore(drag.card, cards[i])
        // Reset translation so card snaps to new natural slot under pointer
        drag.startX = e.clientX
        gsap.set(drag.card, { x: 0 })
        break
      }
    }
  })

  container.addEventListener('pointerup', () => {
    if (!drag) return
    gsap.to(drag.card, { x: 0, scale: 1, zIndex: '', duration: 0.1 })
    onOrderChange([...container.children].map(c => c.dataset.word))
    drag = null
  })

  container.addEventListener('pointercancel', () => {
    if (!drag) return
    gsap.set(drag.card, { x: 0, scale: 1, zIndex: '' })
    drag = null
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
