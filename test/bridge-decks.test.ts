import { expect, test } from 'bun:test'
import { clipLine, CLEARANCE, DeckGraph, EXTENT, solveDecks, STACK, WATER_CLEARANCE, type Piece } from '../web/bridge-decks'

/** One metre per tile unit keeps the arithmetic readable. */
const piece = (points: [number, number][], layer = 1, id = 1): Piece => ({ id, cls: 'primary', ramp: false, layer, points })
const flat = (h: number) => ({ ground: () => h, water: () => false, open: () => false })

function heightsAlong(g: DeckGraph, heights: Map<number, number>, y = 0) {
  return g.x.map((x, n) => [x, n] as const).filter(([, n]) => g.y[n] === y).sort((a, b) => a[0] - b[0]).map(([x, n]) => [x, heights.get(n)!] as const)
}

test('a line is clipped to the tile, not its buffer', () => {
  expect(clipLine([[-64, 100], [EXTENT + 64, 100]], 0, EXTENT)).toEqual([[[0, 100], [EXTENT, 100]]])
  expect(clipLine([[10, 10], [20, 20]], 0, EXTENT)).toEqual([[[10, 10], [20, 20]]])
  expect(clipLine([[-10, -10], [-5, -5]], 0, EXTENT)).toEqual([])
})

test('ways that share a vertex, including across a tile edge, are one bridge', () => {
  const g = new DeckGraph([piece([[0, 0], [EXTENT, 0]]), piece([[EXTENT + 0.6, 0.4], [EXTENT + 100, 0]], 1, 2)], 1)
  expect(g.components()).toHaveLength(1)
  // Its landings are only the two outer ends.
  expect(g.x.filter((_, n) => g.end[n] && g.adj[n].length === 1).sort((a, b) => a - b)).toEqual([0, EXTENT + 100])
})

test('a short bridge runs on a straight grade between its landings', () => {
  // 60 m from ground at 10 m to ground at 13 m, over ground that stays clear below it.
  const g = new DeckGraph([piece([[0, 0], [60, 0]])], 1)
  const heights = solveDecks(g, { ground: n => (g.x[n] === 0 ? 10 : g.x[n] === 60 ? 13 : 0), water: () => false, open: () => false })
  const along = heightsAlong(g, heights)
  expect(along[0][1]).toBeCloseTo(10)
  expect(along[along.length - 1][1]).toBeCloseTo(13)
  for (const [x, h] of along) expect(h).toBeGreaterThanOrEqual(10 + (3 * x) / 60 - 1e-6)
  // The crest on 60 m is under half a metre.
  for (const [x, h] of along) expect(h - (10 + (3 * x) / 60)).toBeLessThan(0.5)
})

test('a long bridge has a gentle crest, capped', () => {
  const g = new DeckGraph([piece([[0, 0], [2000, 0]])], 1)
  const heights = solveDecks(g, { ground: n => (g.x[n] === 0 || g.x[n] === 2000 ? 50 : 0), water: () => false, open: () => false })
  const mid = heightsAlong(g, heights).reduce((best, p) => (Math.abs(p[0] - 1000) < Math.abs(best[0] - 1000) ? p : best))
  expect(mid[1]).toBeCloseTo(56, 0)
})

test('the deck keeps its clearance over the ground and more over water, lifting away from the landings', () => {
  // Landings at 0 m over a 20 m hump in the middle of a 200 m bridge.
  const g = new DeckGraph([piece([[0, 0], [200, 0]])], 1)
  const ground = (n: number) => (Math.abs(g.x[n] - 100) < 30 ? 20 : 0)
  const land = solveDecks(g, { ground, water: () => false, open: () => false })
  const wet = solveDecks(g, { ground, water: n => Math.abs(g.x[n] - 100) < 30, open: () => false })
  for (const [x, h] of heightsAlong(g, land)) if (Math.abs(x - 100) < 30) expect(h).toBeGreaterThanOrEqual(20 + CLEARANCE - 1e-6)
  for (const [x, h] of heightsAlong(g, wet)) if (Math.abs(x - 100) < 30) expect(h).toBeGreaterThanOrEqual(20 + WATER_CLEARANCE - 1e-6)
  const ends = heightsAlong(g, land)
  expect(ends[0][1]).toBeCloseTo(0)
  expect(ends[ends.length - 1][1]).toBeCloseTo(0)
})

test('a higher-layer bridge clears the one it crosses', () => {
  // Layer 1 east–west, layer 2 north–south over its middle, both landing at 0 m.
  const g = new DeckGraph([piece([[0, 0], [400, 0]], 1, 1), piece([[200, -200], [200, 200]], 2, 2)], 1)
  const heights = solveDecks(g, flat(0))
  const lowerMid = Math.max(...g.x.map((x, n) => (g.layer[n] === 1 && g.y[n] === 0 && Math.abs(x - 200) < 13 ? heights.get(n)! : -Infinity)))
  const upperMid = Math.max(...g.y.map((y, n) => (g.layer[n] === 2 && g.x[n] === 200 && Math.abs(y) < 13 ? heights.get(n)! : -Infinity)))
  expect(upperMid).toBeGreaterThanOrEqual(lowerMid + STACK - 0.5)
})

test('a bridge without a landing in reach is left flat', () => {
  const g = new DeckGraph([piece([[0, 0], [100, 0]])], 1)
  expect(solveDecks(g, { ...flat(5), open: () => true }).size).toBe(0)
  expect(solveDecks(g, { ...flat(5), ground: () => null }).size).toBe(0)
})
