import { isColliding } from './tunnel.js'

let passed = 0, failed = 0

function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++ }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed')
}

console.log('\nTunnel Tests\n')

test('isColliding returns true when positions are within radius', () => {
  assert(isColliding({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1.5) === true)
})

test('isColliding returns false when positions are outside radius', () => {
  assert(isColliding({ x: 0, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, 1.5) === false)
})

test('isColliding uses default radius of 1.5', () => {
  assert(isColliding({ x: 0, y: 0, z: 0 }, { x: 1.4, y: 0, z: 0 }) === true)
  assert(isColliding({ x: 0, y: 0, z: 0 }, { x: 1.6, y: 0, z: 0 }) === false)
})

test('isColliding checks all three axes', () => {
  assert(isColliding({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, 2) === true)
  assert(isColliding({ x: 2, y: 2, z: 2 }, { x: 0, y: 0, z: 0 }, 2) === false)
})

test('isColliding returns true when positions are identical', () => {
  assert(isColliding({ x: 5, y: 3, z: -10 }, { x: 5, y: 3, z: -10 }, 1.5) === true)
})

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
