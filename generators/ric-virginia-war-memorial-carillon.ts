/**
 * Virginia War Memorial Carillon, Byrd Park, Richmond, Virginia (1932,
 * Cram and Ferguson with Carneal, Johnston & Wright; Georgian Revival in red
 * brick and limestone) — original procedural geometry, CC0-1.0.
 * bun generators/ric-virginia-war-memorial-carillon.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 22 (OSM way/527243391's walls run at 22° and 112°).
 * Anchor = the centroid of way/527243391, -77.483461, 37.540866.
 *
 * Identity (from the photos below):
 *  1. A tall, slender square red-brick shaft with limestone corner strips,
 *     on a limestone base storey with a round-headed window and balcony.
 *  2. The limestone belfry stage: corner pilasters, one tall arched opening
 *     a face with a balcony, a heavy entablature and a balustrade with urns
 *     at the corners.
 *  3. Above it an octagonal limestone lantern of arched openings, a smaller
 *     octagonal stage, and a little lead dome with a finial.
 *  4. The low one-storey hall wrapped round the tower's foot.
 *
 * Plan: OSM way/527243391 (the hall, limestone, building:part way/527243393, one storey
 * over a basement) and the tower, way/527243392, 10.1 × 10.1 m, centred at
 * (-0.2, -1.5) in this frame.
 *
 * Heights: published 240 ft (73.2 m) to the top (OSM height=240', DHR
 * 127-0387). OSM gives the tower part height 60, taken as the top of the
 * belfry stage's balustrade (62.2 here). Stage heights estimated from the
 * Doug Kerr and SDudley photos, scaled to 73.2 m: stone base to 10, brick
 * shaft to 50, belfry stage to 59, entablature to 61, balustrade to 62.2,
 * lantern stages 62.2–67.6 and 67.6–70.6, dome to 72.5, finial to 73.2. The
 * hall's height (5.5) is estimated from photos; not measured (no lidar used).
 *
 * Ground: Mapterhorn rises ~1 m to the middle of the site from its edges;
 * elevation 0.
 *
 * Night: the tower is floodlit, most of all its stone belfry and lantern.
 *
 * Photos (EVIDENCE):
 *  - Virginia War Memorial Carillon 2024.jpg, SDudley, public domain
 *    https://commons.wikimedia.org/wiki/File:Virginia_War_Memorial_Carillon_2024.jpg
 *  - Richmond Carillon 2010.JPG, Morgan Riley, CC BY-SA 3.0 (the belfry,
 *    balustrade, urns and lantern up close)
 *    https://commons.wikimedia.org/wiki/File:Richmond_Carillon_2010.JPG
 *  - World War I Memorial Carillon.jpg, Bacmomaji, CC0
 *    https://commons.wikimedia.org/wiki/File:World_War_I_Memorial_Carillon.jpg
 *  - Richmond, Virginia (8127345788).jpg, Doug Kerr, CC BY-SA 2.0 (the
 *    whole tower in elevation)
 *    https://commons.wikimedia.org/wiki/File:Richmond,_Virginia_(8127345788).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the hall round the base is seen only in glimpses; its height,
 * windows and flat roof are estimates. The lantern's openings are counted
 * from the photos (eight arches, a smaller ring above).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, cornice, prism, save } from './atl-flatiron-building'

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), lead = new Part()
type F = [XY, XY]

// ── The hall round the foot of the tower ──
const HALL = ccw([[-4.3, 14.4], [-7.1, 13.8], [-9.2, 11.6], [-9.6, 9.2], [-11.5, 9.1], [-16.4, 9.1], [-16.4, -11.9], [-1.5, -12.1], [-1.5, -13.1], [1.2, -13.1], [1.3, -12.1], [16.6, -12.2], [16.5, 9.0], [11.8, 8.9], [9.8, 8.9], [9.3, 11.6], [7.5, 13.7], [4.8, 14.3]])
prism(stone, HALL, 0, 5.5, roof, 0.15)
cornice(stone, HALL, 4.7, 0.8, 0.35, null)
{
  // limestone plinth and the hall's windows on the long walls
  for (let i = 0; i < HALL.length; i++) {
    const a = HALL[i], b = HALL[(i + 1) % HALL.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(stone, a, b, rectShape(0, L, 0, 1.3), 0.06)
    if (L < 9) continue
    const n = Math.round(L / 4)
    for (let k = 0; k < n; k++) {
      const s = (L / n) * (k + 0.5)
      onWall(stone, a, b, archShape(s, 1.7, 1.5, 3.5, 6), 0.05)
      onWall(win, a, b, archShape(s, 1.3, 1.7, 3.5, 6), 0.09)
    }
  }
}

// ── The tower ──
const C: XY = [-0.2, -1.5], H = 5.05
const sq = (h: number, z0: number, z1: number, p: Part, bev = 0.12, bottom = false) => box(p, C[0] - h, C[0] + h, C[1] - h, C[1] + h, z0, z1, p, bev, bottom)
const faces = (h: number): F[] => [
  [[C[0] - h, C[1] - h], [C[0] + h, C[1] - h]], [[C[0] + h, C[1] - h], [C[0] + h, C[1] + h]],
  [[C[0] + h, C[1] + h], [C[0] - h, C[1] + h]], [[C[0] - h, C[1] + h], [C[0] - h, C[1] - h]],
]
// limestone base storey, with its round-headed window and balcony
sq(H + 0.2, 0, 10, stone, 0)
sq(H + 0.45, 9.6, 10.4, stone, 0.15, true)
for (const [a, b] of faces(H + 0.2)) {
  onWall(win, a, b, archShape(H + 0.2, 1.8, 6.4, 8.6, 8), 0.07)
  onWall(stone, a, b, rectShape(H + 0.2 - 1.6, H + 0.2 + 1.6, 6.0, 6.4), 0.35)
}
// brick shaft with stone corner strips and a few small windows
sq(H, 10.4, 50, brick, 0)
for (const [a, b] of faces(H)) {
  onWall(stone, a, b, rectShape(0, 1.2, 10.4, 50), 0.05)
  onWall(stone, a, b, rectShape(2 * H - 1.2, 2 * H, 10.4, 50), 0.05)
  for (const z of [22, 36]) onWall(win, a, b, rectShape(H - 0.45, H + 0.45, z, z + 1.8), 0.06)
}
// limestone belfry stage: corner pilasters, one tall arch a face, a balcony
sq(H + 0.1, 50, 59, stone, 0)
sq(H + 0.4, 49.6, 50.4, stone, 0.12, true)
for (const [a, b] of faces(H + 0.1)) {
  const L = 2 * (H + 0.1)
  onWall(brick, a, b, rectShape(1.9, L - 1.9, 50.4, 58.2), 0.04)
  onWall(stone, a, b, archShape(L / 2, 3.5, 51.0, 55.6, 10), 0.07)
  onWall(win, a, b, archShape(L / 2, 2.8, 51.2, 55.6, 10), 0.11)
  onWall(stone, a, b, rectShape(L / 2 - 2.0, L / 2 + 2.0, 50.9, 51.9), 0.4) // balcony
}
// entablature, cornice, balustrade with corner urns
sq(H + 0.3, 59, 60.2, stone, 0.1)
sq(H + 0.75, 60.2, 61.0, stone, 0.2, true)
sq(H + 0.45, 61.0, 62.2, stone, 0.08)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [C[0] + sx * (H + 0.1), C[1] + sy * (H + 0.1)]
  revolve(stone, c, [[0.45, 62.2], [0.55, 62.8], [0.3, 63.5], [0.15, 63.9], [0, 64.0]], 8, 0)
}
// octagonal lantern: eight arched openings, cornice, smaller stage, dome
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => [C[0] + r * Math.cos(((i + 0.5) / 8) * Math.PI * 2), C[1] + r * Math.sin(((i + 0.5) / 8) * Math.PI * 2)] as XY)
function octStage(r: number, z0: number, z1: number, aw: number, az0: number, azs: number) {
  const o = oct(r)
  prism(stone, o, z0, z1, null, 0)
  for (let i = 0; i < 8; i++) {
    const a = o[i], b = o[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(L / 2, aw, az0, azs, 6), 0.08)
  }
}
octStage(3.6, 62.2, 67.0, 1.6, 63.0, 65.6)
prism(stone, oct(4.0), 67.0, 67.6, stone, 0.15, true)
octStage(2.5, 67.6, 70.2, 1.0, 68.1, 69.4)
prism(stone, oct(2.8), 70.2, 70.6, null, 0.1, true)
revolve(lead, C, [[2.6, 70.6], [2.4, 71.3], [1.8, 72.0], [0.9, 72.45], [0.35, 72.6], [0.2, 72.6]], 12, 0)
revolve(lead, C, [[0.2, 72.6], [0.2, 72.9], [0.3, 73.0], [0, 73.2]], 6, 0)

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] > 48 ? 1 : p[2] > 10 ? 0.65 : 0.3)
await save('ric-virginia-war-memorial-carillon', 'Virginia War Memorial Carillon', [
  { part: brick, material: { ...finish('carillon-brick', 0xb87a62), floodlight: lit } },
  { part: stone, material: { ...finish('carillon-limestone', 0xece3d2), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: lead, material: finish('carillon-lead', 0xa9aaa6) },
], { height: 73.2, anchor: [37.540866, -77.483461], bearing: 22 })
