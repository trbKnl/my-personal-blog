import { createState, canSpawn, onSpawn, onPop, onDetonatorSpawn, onDetonatorPop, isRoundOver, resetRound } from './state.js'

let passed = 0, failed = 0

function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++ }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed')
}

console.log('\nGame State Tests\n')

test('createState returns initial state', () => {
  const s = createState()
  assert(s.animalCount === 0, 'animalCount should be 0')
  assert(s.detonatorOut === false, 'detonatorOut should be false')
  assert(s.spawnLocked === false, 'spawnLocked should be false')
})

test('canSpawn returns true for fresh state', () => {
  const s = createState()
  assert(canSpawn(s) === true)
})

test('canSpawn returns false when spawnLocked', () => {
  const s = createState()
  s.spawnLocked = true
  assert(canSpawn(s) === false)
})

test('canSpawn returns false when detonatorOut', () => {
  const s = createState()
  s.detonatorOut = true
  assert(canSpawn(s) === false)
})

test('onSpawn increments animalCount and locks spawn', () => {
  const s = createState()
  onSpawn(s)
  assert(s.animalCount === 1)
  assert(s.spawnLocked === true)
})

test('onSpawn returns false before count reaches 10', () => {
  const s = createState()
  const result = onSpawn(s)
  assert(result === false, 'should not spawn detonator at count 1')
})

test('onSpawn returns true when count reaches 10', () => {
  const s = createState()
  for (let i = 0; i < 9; i++) onSpawn(s)
  const result = onSpawn(s)
  assert(s.animalCount === 10)
  assert(result === true, 'should spawn detonator at count 10')
})

test('onPop decrements animalCount', () => {
  const s = createState()
  onSpawn(s)
  onPop(s)
  assert(s.animalCount === 0)
})

test('isRoundOver returns true when animalCount is 0', () => {
  const s = createState()
  assert(isRoundOver(s) === true)
})

test('isRoundOver returns false when animals remain', () => {
  const s = createState()
  onSpawn(s)
  assert(isRoundOver(s) === false)
})

test('onDetonatorSpawn sets detonatorOut', () => {
  const s = createState()
  onDetonatorSpawn(s)
  assert(s.detonatorOut === true)
})

test('onDetonatorPop clears all state', () => {
  const s = createState()
  s.animalCount = 10
  s.detonatorOut = true
  onDetonatorPop(s)
  assert(s.animalCount === 0)
  assert(s.detonatorOut === false)
})

test('resetRound clears all state', () => {
  const s = createState()
  s.animalCount = 5
  s.detonatorOut = true
  s.spawnLocked = true
  resetRound(s)
  assert(s.animalCount === 0)
  assert(s.detonatorOut === false)
  assert(s.spawnLocked === false)
})

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
