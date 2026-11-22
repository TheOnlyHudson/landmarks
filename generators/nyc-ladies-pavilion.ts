/**
 * Ladies' Pavilion, Central Park, on Hernshead at the west edge of the Lake
 * (1871, Jacob Wrey Mould; cast iron; first a trolley shelter at Columbus
 * Circle, moved here in 1912, restored 1973 and later) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-ladies-pavilion.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 37.6° (the outline's short sides run at 37.6°), so the long
 * sides run along model x (127.6°). Anchor: the centroid of OSM
 * way/221918229 (building=roof, "Ladies' Pavilion"), which this model
 * replaces; no other building ways lie within 40 m.
 *
 * Plan (OSM, model frame): a rectangle x ±3.1, y ±2.3 (6.2 × 4.6 m), taken
 * as the roof's eaves; the posts stand ~0.5 m inside it.
 *
 * Heights. y = 0 is the lowest ground under the footprint.
 * - Estimated from the photos, scaled on the 4.6 m short side and the
 *   railing (~0.8 m): a stone platform 0.45 m with two steps, posts 2.3 m
 *   to the brackets, the pierced frieze to 3.0, the hipped roof (eaves
 *   3.05, ridge 3.85, ~23°) and the ridge cresting with its finials to ~4.5.
 *   No lidar: the trees over Hernshead hide the roof.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-ladies-pavilion/photos):
 * - Jet Lowe (HAER/HABS, Library of Congress), "Central Park New York City
 *   New York 22.jpg", public domain,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_22.jpg
 *   (three-quarter view: five bays by three, the lattice railing with its
 *   cross panels, the arched brackets and frieze, the hipped roof and
 *   cresting, the platform and steps)
 * - SavidgeMichael, "Rediscovering the Solitude of the Ladies Pavilion, or
 *   The Ladies Pavilion Brought Back for the Commons.jpg", CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Rediscovering_the_Solitude_of_the_Ladies_Pavilion,_or_The_Ladies_Pavilion_Brought_Back_for_the_Commons.jpg
 *   (from across the Lake: today's colours, pale grey-blue ironwork and a
 *   tan standing-seam roof)
 * - "View of Ladies Pavilion looking south" (HABS), public domain,
 *   https://commons.wikimedia.org/wiki/File:View_of_Ladies_Pavilion_looking_south_-_Central_Park,_Ladies%27_Pavilion,_Central_Park,_West_side_of_Lake,_New_York,_New_York_County,_NY_HABS_NY,31-NEYO,207B-2.tif
 *   (looked at only for the plan)
 *
 * The assignment called the roof gabled; every photo shows a low hipped
 * roof with cresting along a short ridge, so that is what is drawn.
 *
 * Doubts: which side the steps are on is a guess (the middle bay of the
 * model's south side); the ironwork's filigree is drawn as bold arched
 * brackets, a frieze band and lattice crosses.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { board, box, archPts, type P2 } from './nyc-cp-dairy'
import { hipRoof } from './nyc-loeb-boathouse'

const iron = new Part(), shade = new Part(), roof = new Part(), stone = new Part()

const PX = 2.6, PY = 1.8 // post lines
const BASE = 0.45, BRK = 2.3, FRIEZE = 3.0
const NX = 5, NY = 3 // bays

// Platform and steps.
box(stone, -PX - 0.35, -PY - 0.35, PX + 0.35, PY + 0.35, 0, BASE)
box(stone, -0.8, -PY - 0.95, 0.8, -PY - 0.35, 0, BASE * 0.5)

// Posts: square shafts with a collar and a capital block.
const posts: P2[] = []
for (let i = 0; i <= NX; i++) for (const y of [-PY, PY]) posts.push([-PX + (2 * PX * i) / NX, y])
for (let j = 1; j < NY; j++) for (const x of [-PX, PX]) posts.push([x, -PY + (2 * PY * j) / NY])
for (const [x, y] of posts) {
  box(iron, x - 0.09, y - 0.09, x + 0.09, y + 0.09, BASE, FRIEZE)
  box(iron, x - 0.15, y - 0.15, x + 0.15, y + 0.15, BASE, BASE + 0.25)
  box(iron, x - 0.17, y - 0.17, x + 0.17, y + 0.17, BRK - 0.2, BRK)
}

// Each side: arched brackets between the posts, a pierced frieze above, and
// the lattice railing below (left open over the steps).
type Side = { a: V3; d: V3; n: V3; len: number; bays: number }
const sides: Side[] = [
  { a: [-PX, -PY, 0], d: [1, 0, 0], n: [0, -1, 0], len: 2 * PX, bays: NX },
  { a: [PX, PY, 0], d: [-1, 0, 0], n: [0, 1, 0], len: 2 * PX, bays: NX },
  { a: [PX, -PY, 0], d: [0, 1, 0], n: [1, 0, 0], len: 2 * PY, bays: NY },
  { a: [-PX, PY, 0], d: [0, -1, 0], n: [-1, 0, 0], len: 2 * PY, bays: NY },
]
for (const [si, s] of sides.entries()) {
  const at = (u: number, z: number): V3 => [s.a[0] + s.d[0] * u, s.a[1] + s.d[1] * u, z]
  const bw = s.len / s.bays
  // frieze: a solid band with a dark pierced strip
  board(iron, [[0, FRIEZE - 0.12], [s.len, FRIEZE - 0.12], [s.len, FRIEZE + 0.05], [0, FRIEZE + 0.05]], at, s.n, 0.1)
  board(iron, [[0, BRK], [s.len, BRK], [s.len, BRK + 0.12], [0, BRK + 0.12]], at, s.n, 0.1)
  board(shade, [[0, BRK + 0.12], [s.len, BRK + 0.12], [s.len, FRIEZE - 0.12], [0, FRIEZE - 0.12]], (u, z) => { const p = at(u, z); return [p[0] - s.n[0] * 0.04, p[1] - s.n[1] * 0.04, z] }, s.n, 0.04)
  for (let k = 0; k < s.bays; k++) {
    const u0 = k * bw, u1 = u0 + bw, uc = (u0 + u1) / 2
    // vertical bars dividing the pierced frieze
    for (const f of [0.25, 0.5, 0.75]) board(iron, [[u0 + f * bw - 0.04, BRK + 0.12], [u0 + f * bw + 0.04, BRK + 0.12], [u0 + f * bw + 0.04, FRIEZE - 0.12], [u0 + f * bw - 0.04, FRIEZE - 0.12]], at, s.n, 0.06)
    // arched bracket under the beam
    const w = bw - 0.18, top = BRK, spring = BRK - 0.55
    const arch = archPts(w, spring, 0.45, 5).slice(1, -1).map(([x, z]): P2 => [uc + x, z])
    board(iron, [[uc - w / 2, spring], [uc - w / 2, top], [uc + w / 2, top], [uc + w / 2, spring], ...arch], at, s.n, 0.07)
    // railing, except over the steps (the south side's middle bay)
    if (si === 0 && k === Math.floor(s.bays / 2)) continue
    const r0 = BASE + 0.05, r1 = BASE + 0.85
    board(iron, [[u0 + 0.09, r1 - 0.1], [u1 - 0.09, r1 - 0.1], [u1 - 0.09, r1], [u0 + 0.09, r1]], at, s.n, 0.08)
    board(iron, [[u0 + 0.09, r0], [u1 - 0.09, r0], [u1 - 0.09, r0 + 0.08], [u0 + 0.09, r0 + 0.08]], at, s.n, 0.08)
    board(shade, [[u0 + 0.09, r0 + 0.08], [u1 - 0.09, r0 + 0.08], [u1 - 0.09, r1 - 0.1], [u0 + 0.09, r1 - 0.1]], (u, z) => { const p = at(u, z); return [p[0] - s.n[0] * 0.03, p[1] - s.n[1] * 0.03, z] }, s.n, 0.03)
    // the lattice: an X and a diamond of bars
    const zl = r0 + 0.08, zh = r1 - 0.1, zm = (zl + zh) / 2, ua = u0 + 0.12, ub = u1 - 0.12
    const bar = (p: P2, q: P2) => {
      const dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz), ox = (-dz / l) * 0.04, oz = (dx / l) * 0.04
      board(iron, [[p[0] - ox, p[1] - oz], [q[0] - ox, q[1] - oz], [q[0] + ox, q[1] + oz], [p[0] + ox, p[1] + oz]], at, s.n, 0.05, false)
    }
    bar([ua, zl], [ub, zh]); bar([ua, zh], [ub, zl])
    bar([uc, zl], [ub, zm]); bar([ub, zm], [uc, zh]); bar([uc, zh], [ua, zm]); bar([ua, zm], [uc, zl])
  }
}

// Ceiling under the roof, then the low hipped roof and its ridge cresting.
box(shade, -PX - 0.1, -PY - 0.1, PX + 0.1, PY + 0.1, FRIEZE + 0.05, FRIEZE + 0.1)
hipRoof(roof, -PX - 0.05, -PY - 0.05, PX + 0.05, PY + 0.05, FRIEZE + 0.05, 3.85, 0.55, 0.12)
const ridgeHalf = PX - PY
board(iron, [[-ridgeHalf, 3.95], [ridgeHalf, 3.95], [ridgeHalf, 4.25], [-ridgeHalf, 4.25]], (u, z) => [u, 0, z], [0, 1, 0], 0.06)
for (const x of [-ridgeHalf, ridgeHalf]) { box(iron, x - 0.07, -0.07, x + 0.07, 0.07, 3.85, 4.5); box(iron, x - 0.12, -0.12, x + 0.12, 0.12, 4.3, 4.4) }

finishModel("Ladies' Pavilion", 'nyc-ladies-pavilion', [
  { part: iron, material: { name: 'iron-paint', color: 0xdfe5e0, roughness: 0.7 } },
  { part: shade, material: { name: 'shadow', color: 0x66706e, roughness: 0.9 } },
  { part: roof, material: { name: 'roof-tan', color: 0xb5a185, roughness: 0.75 } },
  { part: stone, material: { name: 'stone', color: 0xa9a59c, roughness: 0.9 } },
], { bearing: 37.6, osm: 'way/221918229', height: 4.5 }, 5000)
