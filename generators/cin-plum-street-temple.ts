/**
 * Plum Street Temple (Isaac M. Wise Temple), Eighth and Plum Streets,
 * Cincinnati (1866, James Keys Wilson, Moorish/Byzantine Revival) —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-plum-street-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 349.2, the street grid: the front faces Plum
 * Street at -x (west), the long sides run east along y.
 * Anchor = centroid of OSM way/46136621, -84.518266, 39.103678.
 *
 * Identity (from the photos below):
 *  1. Two slender brick minarets with stone balcony rings and small
 *     cupolas, rising over the corners of the tall central front bay.
 *  2. The three-bay front of red brick framed in pale stone: a tall
 *     central bay with a great pointed arch round a white rose window,
 *     lower side bays each with a pointed arch, a small rose and a door.
 *  3. A pale stone cornice and arcaded parapet round the aisles and the
 *     clerestory; small domes on the roof (three on the nave, one on each
 *     side of the east end, from the NAIP aerial).
 *
 * Plan: the lidar and the NAIP aerial put the building about 5.5 m north
 * of OSM way/46136621 in this frame (OSM's south edge runs to the garage
 * wall, where the lidar shows an open strip 8 m wide), so the walls are
 * drawn from the lidar: body x -18.5..19, y -4.5..18.5; nave and front
 * centre bay y 1..13; east-end side blocks x 7..19 out to y -10 and 23.
 * OSM way/78292248, mapped over the north aisle, is listed in `replaces`.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (2021), 1 m grid, read in
 * this frame, less the 2.0 m from the grid's ground_min to the street at
 * the temple (Mapterhorn is flat here to 0.6 m). Measured: aisle parapets
 * 14.2, nave and front-bay parapets 23.7, nave domes to 25.6, east domes
 * to 15.9, minarets to about 40.7 (1 m grid; the finial tip estimated).
 * Estimated from the photos: the arch, rose and door sizes, cornice and
 * parapet heights, the minaret rings and cupola, window rows.
 *
 * Night: windows and the rose glow; the doors are oak.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Isaac M. Wise Temple 02.jpg, Farragutful, CC BY-SA 4.0 (front and
 *    south side from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Isaac_M._Wise_Temple_02.jpg
 *  - Plum Street Temple 1.jpg, Niagara66, CC BY-SA 4.0 (front and north
 *    side from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Plum_Street_Temple_1.jpg
 *  - USGS NAIP orthophoto (public domain): the roof and its domes.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east end is not in any photo; it is drawn plain with the
 * side windows carried round. The domes are read from the aerial only.
 * OSM's outline is offset from the building (above); worth correcting in
 * OSM.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { faceLen, faces, type Face } from './cin-city-hall'

/** A pointed (equilateral) arch outline: width w centred at s, from z0, springing at zs. */
export function pointedShape(s: number, w: number, z0: number, zs: number, seg = 6): [number, number][] {
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  // right half: arc centred on the left springer, radius w
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 3)
    pts.push([s - w / 2 + w * Math.cos(a), zs + w * Math.sin(a)])
  }
  for (let i = seg - 1; i >= 0; i--) {
    const a = (i / seg) * (Math.PI / 3)
    pts.push([s + w / 2 - w * Math.cos(a), zs + w * Math.sin(a)])
  }
  return pts
}
const disc = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

if (import.meta.main) {
  const brick = new Part(), stone = new Part(), win = new Part(), oak = new Part(), roof = new Part()

  const X0 = -18.5, X1 = 19, Y0 = -4.5, Y1 = 18.5, NY0 = 1, NY1 = 13
  const AISLE = 14.2, CLER = 23.7

  /** A brick block with a stone cornice and a pale arcaded parapet, the arcade in shadow. */
  function block(x0: number, x1: number, y0: number, y1: number, top: number, arcade: Face[]) {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    box(brick, x0, x1, y0, y1, 0, top - 1.8, null, 0)
    cornice(stone, r, top - 2.4, 0.6, 0.35, null)
    box(stone, x0, x1, y0, y1, top - 1.8, top, roof, 0.12)
    for (const f of arcade) {
      const L = faceLen(f), n = Math.floor(L / 1.5)
      for (let k = 0; k < n; k++) onWall(roof, f[0], f[1], archShape((L / n) * (k + 0.5), 0.7, top - 1.55, top - 0.75, 4), 0.04)
    }
  }
  const body = faces(X0, X1, Y0, Y1), nave = faces(X0, X1, NY0, NY1)
  block(X0, X1, Y0, Y1, AISLE, [body.S, body.N, body.E])
  block(X0, X1, NY0, NY1, CLER, [nave.S, nave.N, nave.E, nave.W])
  const se = faces(7, X1, -10, Y0), ne = faces(7, X1, Y1, 23)
  block(7, X1, -10, Y0, AISLE, [se.S, se.W, se.E])
  block(7, X1, Y1, 23, AISLE, [ne.N, ne.W, ne.E])

  // ── Domes ──
  for (const x of [-8, 2, 12]) revolve(roof, [x, 7], [[3.0, CLER - 0.4], [2.85, CLER + 0.5], [2.2, CLER + 1.4], [1.2, CLER + 1.85], [0, CLER + 1.95]], 14, 0, false, false)
  for (const y of [-5.2, 20.5]) revolve(roof, [13, y], [[2.4, AISLE - 0.3], [2.25, AISLE + 0.4], [1.7, AISLE + 1.2], [0.9, AISLE + 1.6], [0, AISLE + 1.7]], 12, 0, false, false)

  // ── Side and east windows: paired round-headed lights per bay below, single lights in the clerestory ──
  const pairRow = (f: Face, s0: number, s1: number, pitch: number) => {
    const L = s1 - s0, n = Math.max(1, Math.round(L / pitch)), st = L / n
    for (let k = 0; k < n; k++) {
      const s = s0 + st * (k + 0.5)
      onWall(stone, f[0], f[1], archShape(s, 2.6, 3.2, 9.3, 8), 0.04)
      for (const d of [-0.62, 0.62]) onWall(win, f[0], f[1], archShape(s + d, 1.0, 3.5, 9.3, 6), 0.08)
    }
  }
  const clerRow = (f: Face, s0: number, s1: number, pitch: number) => {
    const L = s1 - s0, n = Math.max(1, Math.round(L / pitch)), st = L / n
    for (let k = 0; k < n; k++) {
      const s = s0 + st * (k + 0.5)
      onWall(stone, f[0], f[1], archShape(s, 1.9, 16.6, 19.8, 8), 0.04)
      onWall(win, f[0], f[1], archShape(s, 1.4, 16.9, 19.8, 8), 0.08)
    }
  }
  // south aisle x -13..7 (s from X0), north aisle (runs east→west, s from X1)
  pairRow(body.S, 5.5, 25.5, 4.6)
  pairRow(body.N, 12, 32, 4.6)
  pairRow(se.S, 0.5, 11.5, 4.6)
  pairRow(ne.N, 0.5, 11.5, 4.6)
  pairRow(se.E, 0.5, 5, 4.6)
  pairRow(ne.E, 0.5, 4, 4.6)
  pairRow(body.E, 0.5, 5.5, 4.6)
  pairRow(body.E, 17.5, 23, 4.6)
  clerRow(nave.S, 6, 37.5, 4.6)
  clerRow(nave.N, 0, 31.5, 4.6)
  clerRow(nave.E, 1, 11, 4.0)
  pairRow(nave.E, 1, 11, 4.0)

  // ── The front (west, x = X0): faces run north→south, s = Y1 - y ──
  const W = body.W
  const sOf = (y: number) => Y1 - y
  // stone pilasters framing the three bays
  for (const y of [Y1, NY1, NY0, Y0]) {
    const s = sOf(y), w = 1.1
    const s0 = Math.max(0, s - w / 2), s1 = Math.min(faceLen(W), s + w / 2)
    const top = y === Y1 || y === Y0 ? AISLE - 2.4 : CLER - 2.4
    onWall(stone, W[0], W[1], rectShape(s0, s1, 0, top), 0.12)
  }
  {
    // centre bay: the great pointed arch round the rose
    const s = sOf((NY0 + NY1) / 2)
    onWall(stone, W[0], W[1], pointedShape(s, 10.0, 0.8, 12.5, 8), 0.05)
    onWall(brick, W[0], W[1], pointedShape(s, 8.6, 1.0, 12.5, 8), 0.09)
    onWall(stone, W[0], W[1], disc(s, 16.0, 2.7, 18), 0.12)
    onWall(win, W[0], W[1], disc(s, 16.0, 2.3, 18), 0.15)
    // the rose's tracery: four bold bars across it
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI, c = Math.cos(a), sn = Math.sin(a), h = 0.1, R = 2.3
      onWall(stone, W[0], W[1], [[s - R * c - h * sn, 16 - R * sn + h * c], [s - R * c + h * sn, 16 - R * sn - h * c], [s + R * c + h * sn, 16 + R * sn - h * c], [s + R * c - h * sn, 16 + R * sn + h * c]], 0.18)
    }
    onWall(stone, W[0], W[1], disc(s, 16.0, 0.55, 10), 0.19)
    // the portal: a stone frame with a pointed doorway and an arcaded window over it
    onWall(stone, W[0], W[1], rectShape(s - 2.6, s + 2.6, 0, 10.2), 0.13)
    onWall(oak, W[0], W[1], pointedShape(s, 2.6, 0.4, 4.4, 6), 0.17)
    for (const d of [-1.5, -0.5, 0.5, 1.5]) onWall(win, W[0], W[1], archShape(s + d, 0.7, 7.4, 9.2, 6), 0.17)
  }
  for (const [ya, yb] of [[NY1, Y1], [Y0, NY0]]) {
    // side bays: pointed arch, small rose, door
    const s = sOf((ya + yb) / 2)
    onWall(stone, W[0], W[1], pointedShape(s, 4.4, 0.8, 7.2, 6), 0.05)
    onWall(brick, W[0], W[1], pointedShape(s, 3.5, 1.0, 7.2, 6), 0.09)
    onWall(stone, W[0], W[1], disc(s, 9.0, 0.95, 12), 0.12)
    onWall(win, W[0], W[1], disc(s, 9.0, 0.75, 12), 0.15)
    onWall(stone, W[0], W[1], rectShape(s - 1.5, s + 1.5, 0, 6.6), 0.13)
    onWall(oak, W[0], W[1], pointedShape(s, 1.9, 0.4, 3.8, 6), 0.17)
  }

  // ── Minarets ──
  for (const y of [1.7, 12.3]) {
    const c: XY = [-14.4, y]
    revolve(brick, c, [[1.35, AISLE], [1.35, 38.2]], 8, Math.PI / 8, true, false)
    const ring = (z: number, r: number, h: number) => revolve(stone, c, [[1.35, z], [r, z + 0.15], [r, z + h], [1.35, z + h + 0.15]], 8, Math.PI / 8, true, false)
    ring(CLER, 1.85, 1.0)
    ring(30.6, 1.8, 0.75)
    ring(35.9, 1.75, 0.7)
    // narrow arched lights in the shaft
    for (const [z0, z1] of [[26.2, 29.2], [32.0, 34.8]]) for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2, R = 1.35 * Math.cos(Math.PI / 8)
      const p0: XY = [c[0] + R * Math.cos(a) - 0.6 * Math.sin(a), c[1] + R * Math.sin(a) + 0.6 * Math.cos(a)]
      const p1: XY = [c[0] + R * Math.cos(a) + 0.6 * Math.sin(a), c[1] + R * Math.sin(a) - 0.6 * Math.cos(a)]
      onWall(win, p1, p0, archShape(0.6, 0.45, z0, z1, 4), 0.05)
    }
    // cupola: stone gallery, lantern, ogee cap and finial
    revolve(stone, c, [[1.35, 38.2], [1.8, 38.4], [1.8, 39.0], [1.15, 39.1], [1.15, 40.0], [1.3, 40.1], [1.0, 40.6], [0.45, 41.0], [0.12, 41.5], [0, 42.0]], 8, Math.PI / 8, true, true)
  }

  await save('cin-plum-street-temple', 'Plum Street Temple', [
    { part: brick, material: finish('pst-brick', 0xb06a52) },
    { part: stone, material: finish('pst-stone', 0xe6dccb) },
    { part: win, material: PALETTE.window },
    { part: oak, material: finish('pst-oak', 0x8d5c3c) },
    { part: roof, material: PALETTE.roof },
  ], { height: 42, anchor: [39.103678, -84.518266], bearing: 349.2 })
}
