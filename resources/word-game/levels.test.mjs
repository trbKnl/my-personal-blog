// resources/word-game/levels.test.mjs
import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { groupByConcept, pickRandom, scorePairs, getConceptList } from './levels.js'

const SAMPLE_LEVELS = [
  { pole_a: 'happy', pole_b: 'sad', run: 1, words: [
    { word: 'joyful',    t: 0.1 },
    { word: 'content',   t: 0.3 },
    { word: 'neutral',   t: 0.5 },
    { word: 'gloomy',    t: 0.7 },
    { word: 'miserable', t: 0.9 },
  ]},
  { pole_a: 'happy', pole_b: 'sad', run: 2, words: [
    { word: 'elated',  t: 0.1 },
    { word: 'pleased', t: 0.35 },
    { word: 'meh',     t: 0.5 },
    { word: 'sullen',  t: 0.75 },
    { word: 'wretched',t: 0.95 },
  ]},
  { pole_a: 'fast', pole_b: 'slow', run: 1, words: [
    { word: 'sprint', t: 0.1 },
    { word: 'jog',    t: 0.4 },
    { word: 'walk',   t: 0.6 },
    { word: 'amble',  t: 0.8 },
    { word: 'crawl',  t: 0.95 },
  ]},
]

test('groupByConcept groups by pole pair key', () => {
  const map = groupByConcept(SAMPLE_LEVELS)
  assert.equal(map.size, 2)
  assert.equal(map.get('happy,sad').length, 2)
  assert.equal(map.get('fast,slow').length, 1)
})

test('pickRandom returns a level from the array', () => {
  const level = pickRandom(SAMPLE_LEVELS)
  assert.ok(SAMPLE_LEVELS.includes(level))
})

test('getConceptList returns sorted unique concept keys', () => {
  const map = groupByConcept(SAMPLE_LEVELS)
  const list = getConceptList(map)
  assert.deepEqual(list, ['fast,slow', 'happy,sad'])
})

test('scorePairs: perfect order scores 10/10', () => {
  const level = SAMPLE_LEVELS[0]
  const playerOrder = level.words.map(w => w.word)  // correct order
  const result = scorePairs(playerOrder, level.words)
  assert.equal(result.correct, 10)
  assert.equal(result.total, 10)
  assert.equal(result.percent, 100)
})

test('scorePairs: reversed order scores 0/10', () => {
  const level = SAMPLE_LEVELS[0]
  const playerOrder = [...level.words].reverse().map(w => w.word)
  const result = scorePairs(playerOrder, level.words)
  assert.equal(result.correct, 0)
  assert.equal(result.total, 10)
  assert.equal(result.percent, 0)
})

test('scorePairs: one swap reduces score', () => {
  const level = SAMPLE_LEVELS[0]
  // Swap first two words — breaks 1 pair (joyful vs content)
  const playerOrder = ['content', 'joyful', 'neutral', 'gloomy', 'miserable']
  const result = scorePairs(playerOrder, level.words)
  assert.equal(result.correct, 9)
  assert.equal(result.total, 10)
})
