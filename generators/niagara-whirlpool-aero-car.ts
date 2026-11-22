/**
 * Whirlpool Aero Car, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-whirlpool-aero-car.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3.4 so +y
 * runs along the cables from Colt's Point (south) to Thompson's Point
 * (north). The origin is the midpoint of OSM's aerialway=cable_car
 * way/87441146 between its two aerialway=station nodes (node/1016751014
 * and node/1016751008, 542 m apart); y = 0 is the Niagara Whirlpool's
 * surface, the lowest ground under the plan, as the map stands it.
 *
 * Leonardo Torres Quevedo's aerial ferry (1916): six track cables slung
 * across the Whirlpool between two stations on the Canadian bank; a yellow
 * carriage of sheaves under a half-round lattice cage runs on them, and
 * the red open gondola hangs below it.
 *
 * Terrain: the map's Mapterhorn DEM (z15), sampled on 3 m grids at both
 * stations and baked in below (heights above the water, 83.4 m ASL in the
 * DEM). The rims stand 83.4 m (south) and 81.1 m (north) above the water;
 * the south station's OSM outline (way/272966194) runs from the rim 15 m
 * out over the cliff, so its landward block stands on the rim and its
 * gorge end is a deck on steel legs. Every foot runs down to the DEM, so
 * the map drapes both stations onto its own cliffs.
 *
 * Published: 539 m of cable (Niagara Parks; Wikipedia), six track cables,
 * 35 passengers standing.
 * From photos: the gondola about 6 x 4.2 m with a red lattice half-wall,
 *   posts and a flat red roof on four hangers; the carriage 7.5 m long
 *   with three sheaves a side on each group of three cables (Chicken4War's
 *   view from above), the half-round cage about 7 m across; the cables in
 *   two groups of three, 5 m apart; the south station's red curved roofs
 *   and red platform roof (Larry Koester), the north station a grey
 *   concrete tower on the cliff edge (Dough4872).
 * Estimated: the cable heights at the saddles (south gantry 89.2, north
 *   tower 90.2) and the 30 m sag (no published figure; the car runs well
 *   below the rims in every photo); the station block's height, its two
 *   barrel roofs' direction, the gantry, the legs and the north tower's
 *   size. The car is drawn at mid-span. Cables are drawn 0.3 m thick (about
 *   twice their real diameter), as STYLE.md asks.
 * Left out: the haul rope, the sheaves' detail, railings, the
 *   ticket-office interior, signs. The water is the map's.
 *
 * Night: none lit (the ride runs by day).
 *
 * Photos (Wikimedia Commons):
 * - "Niagara Whirlpool with aerocar.JPG", Ad Meskens, CC BY-SA 3.0 (side view of the car)
 * - "Whirlpool Aero Car from station.jpeg", Dough4872, CC BY-SA 4.0 (cables, car, north station)
 * - "Whirlpool Aero Car, Niagara Falls 2026.jpg", Chicken4War, CC BY-SA 4.0 (carriage and gondola from above)
 * - "Whirlpool Aero Car (21964914820).jpg", Larry Koester, CC BY 2.0 (south station, the cage)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const concrete = new Part()
const red = new Part()
const yellow = new Part()
const steel = new Part() // cables, legs, gantry
const glassy = new Part() // the station's windows

function poly(p: Part, pts: V3[], hint: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = dot(n, hint) >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A square bar from a to b, w across. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const ax = unit(sub(b, a))
  const s1 = unit(Math.abs(ax[2]) > 0.9 ? cross(ax, [1, 0, 0]) : cross(ax, [0, 0, 1])), s2 = unit(cross(s1, ax))
  const c = (o: V3, u: number, v: number): V3 => add(add(o, mul(s1, (u * w) / 2)), mul(s2, (v * w) / 2))
  const k = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  const r0 = k.map(([u, v]) => c(a, u, v)), r1 = k.map(([u, v]) => c(b, u, v))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = unit(add(add(mul(s1, k[i][0] + k[j][0]), mul(s2, k[i][1] + k[j][1])), [0, 0, 0]))
    poly(p, [r0[i], r0[j], r1[j], r1[i]], n)
  }
  poly(p, r0, mul(ax, -1))
  poly(p, r1, ax)
}

// ------------------------------------------------- the DEM at both ends ---
type Grid = { y0: number; x0: number; step: number; z: number[][] }
const SOUTH: Grid = {"y0":-284,"x0":-12,"step":3,"z":[[83.6,83.4,83.3,83.3,83.3,83.4,83.4,83.4,83.4],[83.5,83.4,83.4,83.4,83.4,83.4,83.4,83.4,83.1],[83.5,83.5,83.4,83.1,83.2,83.4,83.4,83.3,82.7],[83.5,83.4,83.1,81.7,82.3,83.4,83.4,81.9,82.0],[83.1,82.8,81.7,80.1,80.4,83.0,83.2,81.2,80.6],[81.6,81.5,80.1,78.1,78.1,80.4,80.4,79.3,79.3],[78.1,77.6,76.6,74.6,74.5,73.8,73.4,73.3,73.0],[70.6,70.2,69.3,67.3,66.7,66.0,65.7,65.7,65.4],[63.0,63.4,62.6,60.9,60.4,59.9,59.8,59.7,60.0],[59.2,59.4,58.8,57.4,56.8,56.5,56.4,56.4,56.7],[55.9,55.6,55.2,54.3,53.6,53.0,52.9,52.7,52.7],[51.9,51.4,51.4,51.0,50.5,49.9,49.7,49.0,48.2],[47.7,46.7,47.4,47.9,47.7,47.1,46.9,46.0,44.7]]}
const NORTH: Grid = {"y0":256,"x0":-12,"step":3,"z":[[61.7,63.6,65.4,66.4,68.0,67.2,65.6,63.9,62.7],[66.1,69.7,71.1,70.4,70.7,70.7,70.6,68.7,65.6],[71.1,76.0,76.7,72.8,72.7,73.3,76.9,73.9,68.0],[76.5,79.0,79.4,78.4,79.1,79.8,80.3,78.1,72.2],[79.2,79.7,80.0,80.8,81.1,81.0,79.8,79.5,75.6],[79.6,80.0,80.4,80.9,81.1,81.1,80.2,79.8,78.0],[79.8,80.2,80.7,81.1,81.1,81.1,80.8,79.9,79.4],[80.0,80.4,80.8,81.1,81.1,81.1,80.8,80.2,79.8],[80.1,80.4,80.7,80.8,80.8,80.9,80.7,80.4,80.1],[80.1,80.4,80.7,80.8,80.8,80.9,80.7,80.4,80.1]]}
// (Note: rows run south to north, columns west to east.)
function dem(x: number, y: number): number {
  const g = y < 0 ? SOUTH : NORTH
  const fx = Math.max(0, Math.min(g.z[0].length - 1.001, (x - g.x0) / g.step))
  const fy = Math.max(0, Math.min(g.z.length - 1.001, (y - g.y0) / g.step))
  const i = Math.floor(fy), j = Math.floor(fx), u = fx - j, v = fy - i
  const z = g.z
  return (z[i][j] * (1 - u) + z[i][j + 1] * u) * (1 - v) + (z[i + 1][j] * (1 - u) + z[i + 1][j + 1] * u) * v
}
/** Walls round a ring, each corner running down to the DEM (0.3 m into it). */
function footedWalls(p: Part, ring: [number, number][], top: number) {
  for (let i = 0; i < ring.length; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % ring.length]
    const out: V3 = [by - ay, -(bx - ax), 0]
    poly(p, [[ax, ay, dem(ax, ay) - 0.3], [bx, by, dem(bx, by) - 0.3], [bx, by, top], [ax, ay, top]], out)
  }
}
/** A leg from the DEM up to z. */
const leg = (p: Part, x: number, y: number, z: number, w: number) => box(p, x - w / 2, x + w / 2, y - w / 2, y + w / 2, dem(x, y) - 0.3, z)

// ------------------------------------------------------- south station ---
// The landward block, on the rim (the outline's part south of y -268).
{
  const ring: [number, number][] = [[-3.6, -279.9], [2.5, -280.0], [2.6, -274.4], [8.7, -274.4], [8.8, -267.9], [-3.5, -267.9]]
  const TOP = 87.0
  footedWalls(concrete, ring, TOP)
  concrete.cap(ring.map(([x, y]) => [x, y, TOP] as V3).slice(0, 3).concat([[-3.6 + 0, -274.4, TOP]]), true)
  concrete.cap([[-3.6, -274.4, TOP], [8.7, -274.4, TOP], [8.8, -267.9, TOP], [-3.5, -267.9, TOP]], true)
  // Window bands on its east and west faces.
  poly(glassy, [[8.74, -274.0, 84.6], [8.82, -268.3, 84.6], [8.82, -268.3, 86.2], [8.74, -274.0, 86.2]], [1, 0, 0])
  poly(glassy, [[-3.64, -279.5, 84.6], [-3.54, -268.3, 84.6], [-3.54, -268.3, 86.2], [-3.64, -279.5, 86.2]], [-1, 0, 0])
  // Two red barrel roofs running along the block.
  for (const [x0, x1, y0, y1] of [[-3.6, 2.5, -279.9, -268.2], [2.6, 8.7, -274.4, -268.2]]) {
    const r = (x1 - x0) / 2, cx = (x0 + x1) / 2, K = 8
    const arc = (y: number): V3[] => Array.from({ length: K + 1 }, (_, i) => {
      const a = Math.PI - (i / K) * Math.PI
      return [cx + r * Math.cos(a), y, TOP + 0.75 * r * Math.sin(a)] as V3
    })
    const A = arc(y0), B = arc(y1)
    for (let i = 0; i < K; i++) {
      const m = (A[i][0] + A[i + 1][0]) / 2 - cx
      poly(red, [A[i], A[i + 1], B[i + 1], B[i]], [m, 0, 1])
    }
    poly(red, A, [0, -1, 0])
    poly(red, B, [0, 1, 0])
  }
}
// The berth: a deck on steel legs out over the cliff, under a red roof, and
// the gantry whose saddles carry the cables.
const DECK = 81.0, CANOPY = 86.2, SADDLE_S = 89.2, SADDLE_N = 90.2
const YS = -254.0, YN = 268.0
{
  box(concrete, -3.4, 5.9, -268.0, -253.2, DECK - 0.6, DECK)
  for (const x of [-3.0, 5.5]) for (const y of [-266.5, -260.5, -254.0]) leg(steel, x, y, DECK - 0.6, 0.45)
  box(red, -3.8, 6.2, -268.0, -255.5, CANOPY, CANOPY + 0.35)
  for (const x of [-3.4, 5.8]) for (const y of [-267.5, -256.0]) box(steel, x - 0.15, x + 0.15, y - 0.15, y + 0.15, DECK, CANOPY)
  for (const x of [-4.0, 4.0]) box(steel, x - 0.3, x + 0.3, YS - 0.3, YS + 0.3, DECK, SADDLE_S + 0.2)
  box(steel, -4.3, 4.3, YS - 0.35, YS + 0.35, SADDLE_S - 0.6, SADDLE_S)
}
// ------------------------------------------------------- north station ---
{
  const ring: [number, number][] = [[-4.5, 268.5], [4.5, 268.5], [4.5, 276.0], [-4.5, 276.0]]
  const TOP = 91.0
  footedWalls(concrete, ring, TOP)
  concrete.cap(ring.map(([x, y]) => [x, y, TOP] as V3), true)
  // Its open face toward the gorge, where the cables come in.
  poly(glassy, [[-2.6, 268.44, 85.0], [2.6, 268.44, 85.0], [2.6, 268.44, 89.0], [-2.6, 268.44, 89.0]], [0, -1, 0])
  box(concrete, -3.0, 3.0, 276.0, 283.5, dem(0, 280) - 0.3, dem(0, 280) + 1.2) // the cables' anchor block
}

// --------------------------------------------------------------- cables ---
const SAG = 30
const cableZ = (y: number): number => {
  const t = (y - YS) / (YN - YS)
  return SADDLE_S + (SADDLE_N - SADDLE_S) * t - 4 * SAG * t * (1 - t)
}
const OFFS = [-3.1, -2.6, -2.1, 2.1, 2.6, 3.1]
for (const x of OFFS) {
  const N = 22
  for (let i = 0; i < N; i++) {
    // Denser where the curve bends most, at the ends.
    const t0 = i / N, t1 = (i + 1) / N
    const y0 = YS + (YN - YS) * t0, y1 = YS + (YN - YS) * t1
    bar(steel, [x, y0, cableZ(y0) + 0.15], [x, y1, cableZ(y1) + 0.15], 0.3)
  }
  // Backstays over the saddles to the anchors.
  bar(steel, [x, YS, SADDLE_S + 0.15], [x * 0.6, -279.0, 87.15], 0.3)
  bar(steel, [x, YN, SADDLE_N + 0.15], [x * 0.6, 283.0, dem(0, 280) + 1.35], 0.3)
}

// ------------------------------------------------------ the car at mid-span ---
{
  const Y = (YS + YN) / 2, Z = cableZ(Y) // cables' running height here
  // The carriage: a beam along the cables with sheave blocks on both groups.
  box(yellow, -1.6, 1.6, Y - 3.75, Y + 3.75, Z - 0.7, Z - 0.1)
  for (const s of [-1, 1]) for (const e of [-1, 1]) box(yellow, s * 3.4, s * 1.6, Y + e * 3.0 - 0.6, Y + e * 3.0 + 0.6, Z - 0.5, Z + 0.4)
  // The half-round lattice cage: two rims, spokes, and bars across.
  const R = 3.6, K = 10
  const rim = (x: number) => Array.from({ length: K + 1 }, (_, i) => {
    const a = (i / K) * Math.PI
    return [x, Y + R * Math.cos(a), Z - 0.1 + R * Math.sin(a)] as V3
  })
  for (const x of [-1.5, 1.5]) {
    const r = rim(x)
    for (let i = 0; i < K; i++) bar(yellow, r[i], r[i + 1], 0.22)
    for (let i = 1; i < K; i += 2) bar(yellow, [x, Y, Z - 0.1], r[i], 0.14)
  }
  const r0 = rim(-1.5), r1 = rim(1.5)
  for (let i = 1; i < K; i += 3) bar(yellow, r0[i], r1[i], 0.16)
  bar(yellow, r0[5], r1[5], 0.16)
  // Hangers and the gondola.
  const ROOF = Z - 2.3, FLOOR = Z - 4.7
  for (const x of [-1.4, 1.4]) for (const e of [-1, 1]) bar(yellow, [x, Y + e * 2.2, Z - 0.7], [x * 1.2, Y + e * 2.6, ROOF + 0.3], 0.14)
  box(red, -2.3, 2.3, Y - 3.25, Y + 3.25, ROOF, ROOF + 0.3)
  box(red, -2.1, 2.1, Y - 3.0, Y + 3.0, FLOOR - 0.3, FLOOR)
  for (const [x0, x1, y0, y1] of [[-2.1, 2.1, -3.0, -2.85], [-2.1, 2.1, 2.85, 3.0], [-2.1, -1.95, -3.0, 3.0], [1.95, 2.1, -3.0, 3.0]]) box(red, x0, x1, Y + y0, Y + y1, FLOOR, FLOOR + 1.1)
  for (const x of [-2.0, 2.0]) for (const y of [-2.9, 0, 2.9]) box(red, x - 0.09, x + 0.09, Y + y - 0.09, Y + y + 0.09, FLOOR + 1.1, ROOF)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: concrete, material: finish('aerocar-concrete', 0xd6d0c4) },
  { part: red, material: finish('aerocar-red', 0xc85a4c) },
  { part: yellow, material: finish('aerocar-yellow', 0xe8c94a) },
  { part: steel, material: finish('aerocar-steel', 0x6e7379) },
  { part: glassy, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Whirlpool Aero Car', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 3.4, elevation: 0,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/niagara-whirlpool-aero-car.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
