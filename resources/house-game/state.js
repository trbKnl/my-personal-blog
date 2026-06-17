// Game state — pure functions, no DOM. Testable with Node.

export function createState() {
  return {
    animalCount: 0,
    detonatorOut: false,
    spawnLocked: false,
  }
}

// Returns true if the house click should be processed
export function canSpawn(state) {
  return !state.spawnLocked && !state.detonatorOut
}

// Call on house click. Returns true if the 10th animal was just added (spawn detonator instead).
export function onSpawn(state) {
  state.animalCount++
  state.spawnLocked = true
  return state.animalCount >= 10
}

// Call when an animal is popped by clicking
export function onPop(state) {
  state.animalCount--
}

// Call after detonator sprite is created
export function onDetonatorSpawn(state) {
  state.detonatorOut = true
}

// Call when detonator is clicked — clears everything
export function onDetonatorPop(state) {
  state.animalCount = 0
  state.detonatorOut = false
}

// Round is over when no animals remain (detonator cleared separately by caller)
export function isRoundOver(state) {
  return state.animalCount === 0
}

// Full reset — call after round ends
export function resetRound(state) {
  state.animalCount = 0
  state.detonatorOut = false
  state.spawnLocked = false
}
