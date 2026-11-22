/**
 * Eagle Gate (1963 arch, Grant R. Fairbanks's eagle after the 1859
 * original), spanning State Street at South Temple, Salt Lake City.
 * Procedural, CC0-1.0. bun generators/slc-eagle-gate.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (State Street runs
 * north-south). Origin: OSM node/376253778 (-111.88827, 40.76960), the
 * middle of the street under the keystone. y = 0 is the lowest ground
 * under the model.
 *
 * Form, from the photos: four tall dark metal legs, two on each sidewalk,
 * tapering wider toward the top. On each side a curved trough-shaped beam
 * joins the two legs' heads, its ends kicked up past them like horns; from
 * each leg head a long curved arm, also a trough open on top, sweeps up and
 * inward to the square keystone over the middle of the street (stars on
 * its faces, left out). On the keystone, a beehive, and on that the bronze
 * eagle with spread, raised wings.
 *
 * Numbers: the arch span "75 feet" (Wikipedia, the 1961 approved design),
 * drawn as 23.5 m between leg centres (p2 scaled by the eagle's wingspan).
 * The eagle: wingspan 20 ft (6.1 m), length 10 ft (3.0 m), height 5 ft 4 in
 * (1.63 m), published (Wikipedia). Leg height 7.8 m (p1, against the
 * bollards), keystone 11.6-13.2 m, beehive 1.0 m (p2, scaled by the
 * wingspan), all estimated. The legs' north-south spacing (9 m) is
 * estimated from p1. Troughs about 1.3 m wide (p3).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Eagle_Gate,_north_side_-_Salt_Lake_City,_Utah_-_5_September_2016.jpg
 *     Beneathtimp, CC0 (from the north-west, looking south)
 *  p2 https://commons.wikimedia.org/wiki/File:Eagle_Gate_5251.jpg (or the same
 *     author's Eagle_Gate_(5-17-24)_5225.jpg; both 6000 x 4000)
 *     Chris Light, CC BY-SA 4.0 (from the south on State Street, looking north)
 *  p3 https://commons.wikimedia.org/wiki/File:Eagle_Gate.jpg
 *     David Jay Fullmer, CC BY-SA 4.0 (a leg and the troughs from below)
 * Lidar: not used.
 * Doubts: the legs' real section is a three-pointed (chevron) shape, drawn as
 * a tapered box; the eagle is a simple bold mass, not the sculpture.
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, poly } from './slc-beehive-house'

const metal = new Part(), bronze = new Part(), base = new Part()
const LX = 11.75, LY = 4.5, ZL = 7.8, ZK0 = 11.6, ZK1 = 13.2

const norm = (a: V3): V3 => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l] }
// the trough section in (lateral, up): a U, 0.2 m thick, open on top
const U_SECTION: [number, number][] = [[-0.65, 0.2], [-0.48, -0.3], [0.48, -0.3], [0.65, 0.2], [0.45, 0.2], [0.33, -0.1], [-0.33, -0.1], [-0.45, 0.2]]
/** Sweep the trough along a path of points. */
function trough(path: V3[]) {
  const rings: V3[][] = path.map((p, k) => {
    const a = path[Math.max(0, k - 1)], b = path[Math.min(path.length - 1, k + 1)]
    const T = norm(sub(b, a))
    const L = norm(cross([0, 0, 1], T)) // L = up x T, so L x U = T
    const Up = cross(T, L)
    return U_SECTION.map(([l, u]) => [p[0] + L[0] * l + Up[0] * u, p[1] + L[1] * l + Up[1] * u, p[2] + L[2] * l + Up[2] * u] as V3)
  })
  metal.loft(rings)
  // end caps: the U as three quads
  for (const [r, s] of [[rings[0], -1], [rings[rings.length - 1], 1]] as [V3[], number][]) {
    const k = path.length - 1, T = norm(sub(path[s < 0 ? 1 : k], path[s < 0 ? 0 : k - 1]))
    const n: V3 = [T[0] * s, T[1] * s, T[2] * s]
    poly(metal, [r[0], r[1], r[6], r[7]], n)
    poly(metal, [r[1], r[2], r[5], r[6]], n)
    poly(metal, [r[2], r[3], r[4], r[5]], n)
  }
}

// the legs: tapered boxes, wider toward the head, on round concrete footings
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = sx * LX, y = sy * LY
  const ring = (hx: number, hy: number, z: number): V3[] => [[x - hx, y - hy, z], [x + hx, y - hy, z], [x + hx, y + hy, z], [x - hx, y + hy, z]]
  metal.loft([ring(0.4, 0.4, 0.5), ring(0.5, 0.45, 4.0), ring(0.85, 0.65, ZL)])
  metal.cap(ring(0.85, 0.65, ZL), true)
  const foot = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI
    return [x + r * Math.cos(a), y + r * Math.sin(a), z] as V3
  })
  base.loft([foot(0.75, 0), foot(0.75, 0.5)])
  base.cap(foot(0.75, 0.5), true)
}
// the side beams joining each side's two legs, with kicked-up ends
for (const sx of [-1, 1]) {
  const pts: V3[] = []
  for (let k = 0; k <= 12; k++) {
    const t = -1.25 + (2.5 * k) / 12 // legs at t = -1, 1
    const z = ZL + 0.1 + 0.25 * t * t + (Math.abs(t) > 1 ? 0.8 * (Math.abs(t) - 1) : 0)
    pts.push([sx * LX, t * LY, z])
  }
  trough(pts)
}
// the four arms, curving up to the keystone (concave up, flat at the leg)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const pts: V3[] = []
  const x0 = sx * LX, y0 = sy * LY, x1 = sx * 0.75, y1 = sy * 0.3
  for (let k = -1; k <= 12; k++) {
    const t = k / 12
    const z = ZL + 0.15 + (ZK0 + 0.5 - ZL - 0.15) * Math.max(0, t) ** 1.25 + (t < 0 ? 3 * t * t : 0)
    pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z])
  }
  trough(pts)
}
// the keystone, flaring a little toward the top
{
  const ring = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  metal.loft([ring(0.65, ZK0), ring(0.8, ZK1 - 0.2)])
  metal.cap(ring(0.65, ZK0), false)
  box(metal, -0.9, -0.9, 0.9, 0.9, ZK1 - 0.2, ZK1, true)
}
// the beehive: stacked rings to a dome
{
  const ring = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI
    return [r * Math.cos(a), r * Math.sin(a), z] as V3
  })
  const prof: [number, number][] = [[0.62, 0], [0.7, 0.25], [0.66, 0.5], [0.56, 0.72], [0.4, 0.9], [0.18, 1.0]]
  bronze.loft(prof.map(([r, z]) => ring(r, ZK1 + z)))
  bronze.cap(ring(0.18, ZK1 + 1.0), true)
}
// the eagle: body along north-south facing south, wings spread east-west
{
  const z0 = ZK1 + 0.95
  // body: a tapered box from tail (north) to breast (south), with the head
  const sec = (y: number, w: number, h: number, zc: number): V3[] => [[-w, y, zc - h], [w, y, zc - h], [w, y, zc + h], [-w, y, zc + h]]
  const rings = [sec(1.5, 0.15, 0.08, z0 + 0.55), sec(0.6, 0.38, 0.3, z0 + 0.5), sec(-0.4, 0.45, 0.4, z0 + 0.55), sec(-1.1, 0.3, 0.3, z0 + 0.75)]
  // loft expects rings counter-clockwise looking back along travel: travel is -y, so reverse
  bronze.loft(rings.map((r) => [...r].reverse()))
  poly(bronze, rings[0], [0, 1, 0])
  poly(bronze, rings[3], [0, -1, 0])
  // head and beak
  box(bronze, -0.2, -1.5, 0.2, -1.05, z0 + 0.65, z0 + 1.05)
  box(bronze, -0.08, -1.7, 0.08, -1.5, z0 + 0.7, z0 + 0.85)
  // wings: raised in a shallow V, swept back a little
  for (const s of [-1, 1]) {
    const root: V3[] = [[s * 0.35, -0.6, z0 + 0.75], [s * 0.35, 0.7, z0 + 0.75]]
    const tip: V3[] = [[s * 3.05, 0.1, z0 + 1.6], [s * 3.05, 0.75, z0 + 1.55]]
    const top: V3[] = [root[0], tip[0], tip[1], root[1]].map((p) => [p[0], p[1], p[2] + 0.08] as V3)
    const bot: V3[] = [root[0], tip[0], tip[1], root[1]].map((p) => [p[0], p[1], p[2] - 0.08] as V3)
    poly(bronze, top, [0, 0, 1])
    poly(bronze, bot, [0, 0, -1])
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const m = norm(cross(sub(top[j], top[i]), [0, 0, 1]))
      poly(bronze, [bot[i], bot[j], top[j], top[i]], [m[0] * s, m[1] * s, 0])
    }
  }
  // the legs and talons down to the hive
  box(bronze, -0.3, -0.2, 0.3, 0.2, ZK1 + 0.85, z0 + 0.3)
}

// ---------------------------------------------------------------- output ---
// Colours from p1-p3: dark weathered metal with a green-grey cast (pulled
// to charcoal, the darkest allowed), darker bronze eagle and hive,
// pale concrete footings.
const parts = [
  { part: metal, material: finish('eagle-gate-metal', 0x555c5b) },
  { part: bronze, material: finish('eagle-gate-bronze', 0x5f5a4c) },
  { part: base, material: PALETTE.stone },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Eagle Gate', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ZK1 + 2.6,
})
await Bun.write(new URL('../models/slc-eagle-gate.glb', import.meta.url), glb)
console.log(`slc-eagle-gate.glb: ${triangles} triangles, ${glb.length} bytes`)
