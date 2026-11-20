/**
 * Denver Central Library (1995 addition by Michael Graves with Klipp Colussy
 * Jenks DuBois, joined to Burnham Hoyt's 1956 library) — original
 * procedural geometry, CC0-1.0.
 * bun generators/den-central-library.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.988249, 39.737442,
 * the centroid of OSM way/315707015; bearing 0 (the walls run with the
 * street grid).
 *
 * Identity (photos below):
 *  1. The salmon-pink rotunda on 13th Avenue, ringed with square windows,
 *     under a huge dark overhanging canopy roof on splayed struts.
 *                                                     (s, yassie, hart, w13)
 *  2. Pale limestone wings either side, square windows above a tall
 *     colonnade of square piers with terracotta-red lintels.  (yassie, s)
 *  3. Coloured blocks stacked behind: a grey slate block, a long rust-red
 *     block, the tall red tower on the east and a slim grey cylinder at the
 *     south-west corner.                                (mcg, se, yassie)
 *  4. The low 1956 Hoyt library behind, in pale stone.          (aerial)
 *
 * Plan: OSM way/315707015 and its parts (way/591851595 rotunda, way/591850551
 * and way/591850552 wings, way/591836848 slate block, way/591826339 red
 * block, way/591828670 east tower, way/591830182 west tower, way/591836844
 * cylinder, way/591709414 and way/591825155 Hoyt building, way/591709121
 * reading room, way/591720532), simplified to rectangles and circles.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid.
 * ground_min 1597.44 m; y = 0 is 1.0 m above it (the lowest ground along the
 * north side; 13th Avenue is about 0.3 m higher). Measured (model metres):
 * the canopy's top 42.3; the wings 22.3; the slate block 35.5; the red block
 * 31.3 and its central rise 34.5; the east tower 36.5; the west tower's
 * body about 35 and its pyramid 44.0; the cylinder 26; Hoyt 11.5 with a
 * raised middle of 14.8 and a slate stair box of 26; the reading room 8.5.
 * OSM's 41.2 overall and part heights are 1–8 m under the lidar for the
 * upper blocks; the lidar was used.
 * Estimated: the canopy's underside (from 33 m, the drum's top, from the
 * photos scaled to the lidar) and its splay; storey and window rows (four
 * floors over a two-storey colonnade, from yassie); the colonnade's piers.
 * Doubt: the west tower and its pyramid are seen in no photo here; drawn
 * in slate with the canopy's dark roof, as OSM tags them.
 *
 * Photos (evidence, Wikimedia Commons):
 *  s      "Denver Central Library. View from south.jpg", Sarbjit Bahga,
 *         CC BY-SA 4.0
 *  se     "Denver Central Library. View from south-east.jpg", Sarbjit
 *         Bahga, CC BY-SA 4.0
 *  w13    "Denver Central Library. View from W 13th Ave.jpg", Sarbjit Bahga,
 *         CC BY-SA 4.0
 *  bahga  "Denver Central Library.jpg", Sarbjit Bahga, CC BY-SA 4.0
 *  hart   "Denver Central Library (54940569058).jpg", Daniel Hartwig,
 *         CC BY 4.0 (south front)
 *  mcg    "Denver Central Library 2017.jpg", McGhiever, CC BY 4.0
 *         (from the south-east)
 *  yassie "DenverCentralLibrary 30Sep2017.jpg", Yassie, CC BY-SA 4.0
 *         (from the south-west)
 *  newn   "Denver Public Library 1 straighten.jpg", KM Newnham, CC BY-SA 4.0
 *  aerial USGS NAIP orthophoto (public domain)
 * No look-only sources. No commercial imagery.
 *
 * Night: the windows and the colonnade glow; the rotunda's drum is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { circle, smoothWall, wall, at } from './atl-flatiron-building'

const lime = new Part(), pink = new Part(), red = new Part(), slate = new Part(), dark = new Part(), win = new Part()

/** Window columns on a wall a→b: one panel per bay per storey group. */
function bays(a: XY, b: XY, bay: number, rows: [number, number][], w = 0.5, p: Part = win) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round((L - 2) / bay)), s = (L - 2) / n
  for (let k = 0; k < n; k++) {
    const m = 1 + (k + 0.5) * s, h = (s * w) / 2
    for (const [z0, z1] of rows) onWall(p, a, b, rectShape(m - h, m + h, z0, z1), 0.06)
  }
}
/** The colonnade: dark openings between square piers, red lintels over them. */
function colonnade(a: XY, b: XY, bay = 4.2) {
  bays(a, b, bay, [[0.4, 8.0]], 0.62)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(red, a, b, rectShape(0.4, L - 0.4, 8.0, 9.4), 0.1)
}
const WIN_ROWS: [number, number][] = [[10.6, 13.6], [14.4, 17.4], [18.2, 20.6]]

// ── The limestone wings on 13th Avenue ──
const wings: [number, number, number, number][] = [[-30, -12.7, -52.3, -24], [21.7, 44, -52.2, -25]]
for (const [x0, x1, y0, y1] of wings) {
  box(lime, x0, x1, y0, y1, 0, 22.3, lime, 0.4)
  const sides: [XY, XY][] = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x0, y1], [x0, y0]]]
  for (const [a, b] of sides) {
    colonnade(a, b)
    bays(a, b, 3.6, WIN_ROWS, 0.52)
  }
  // a pale cornice band
  box(lime, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1, 21.4, 22.3, lime, 0.25)
}

// ── The rotunda and its canopy ──
const RC: XY = [4.5, -37], R = 13.5
smoothWall(pink, circle(RC, R, 28), 0, 33)
capPoly(pink, circle(RC, R, 28), 33, true)
for (let i = 0; i < 16; i++) {
  const t = ((i + 0.5) / 16) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t)
  if (s > 0.55) continue // the north side is hidden in the blocks
  const tx = -s, ty = c, h = 1.25, rr = R + 0.07
  for (const [z0, z1] of [[13, 15.4], [17.5, 19.9], [22, 24.4], [26.5, 28.9]] as [number, number][]) {
    const P = (u: number, z: number): V3 => [RC[0] + c * rr + tx * u, RC[1] + s * rr + ty * u, z]
    win.quad(P(-h, z0), P(h, z0), P(h, z1), P(-h, z1))
  }
  if (s < 0) {
    // the colonnade under the drum, and its red lintel
    const P = (u: number, z: number, r2 = rr): V3 => [RC[0] + c * r2 + tx * u, RC[1] + s * r2 + ty * u, z]
    win.quad(P(-1.6, 0.4), P(1.6, 0.4), P(1.6, 8.0), P(-1.6, 8.0))
  }
}
{
  const ring = circle(RC, R + 0.12, 28)
  wall(red, ring, 8.0, 9.4)
}
// the canopy: an inverted, splayed square roof on struts, drawn solid
{
  const C: XY = [5, -38.5]
  const bot: XY[] = [[C[0] - 11, C[1] - 10.5], [C[0] + 11, C[1] - 10.5], [C[0] + 11, C[1] + 10.5], [C[0] - 11, C[1] + 10.5]]
  const top: XY[] = [[C[0] - 16, C[1] - 14.5], [C[0] + 16, C[1] - 14.5], [C[0] + 16, C[1] + 14.5], [C[0] - 16, C[1] + 14.5]]
  dark.loft([at(bot, 33), at(top, 41.3), at(top, 42.3)])
  capPoly(dark, bot, 33, false)
  capPoly(dark, top, 42.3, true)
  // the struts' pink infill between them shows as a lighter band on the drum
  smoothWall(pink, circle(RC, R - 1.5, 20), 33, 37)
}

// ── The blocks behind ──
box(slate, -30, 38, -32, -15, 0, 35.5, slate, 0.4)
box(red, -36.1, 44, -20, 1.6, 0, 31.3, red, 0.4)
box(red, -6, 14, -15, -6, 31, 34.5, red, 0.3)
bays([44, 1.6], [-36.1, 1.6], 4.5, [[13, 19], [21, 27]], 0.45)
for (const [a, b] of [[[-30, -32], [-30, -20]], [[38, -20], [38, -32]]] as [XY, XY][]) bays(a, b, 4, [[23.5, 29], [30, 33.5]], 0.45)
bays([-12.7, -32], [21.7, -32], 4.2, [[23.5, 29], [30, 33.5]], 0.4)
// the tall east tower with its stacked window bays
box(red, 44, 55, -17, -6, 0, 36.5, red, 0.4)
for (const [a, b] of [[[44, -17], [55, -17]], [[55, -17], [55, -6]], [[55, -6], [44, -6]]] as [XY, XY][]) bays(a, b, 3.6, [[3, 9], [11, 17], [19, 25], [27, 33]], 0.42)
// the west tower and its pyramid
box(slate, -48.1, -36.1, -17, -5.3, 0, 35, slate, 0.4)
{
  const c: XY = [-42.1, -11.15], h = 6.6
  const base: XY[] = [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]]
  for (let i = 0; i < 4; i++) {
    const a = base[i], b = base[(i + 1) % 4]
    dark.tri([a[0], a[1], 35], [b[0], b[1], 35], [c[0], c[1], 44])
  }
}
for (const [a, b] of [[[-48.1, -17], [-36.1, -17]], [[-48.1, -5.3], [-48.1, -17]]] as [XY, XY][]) bays(a, b, 3.6, [[6, 12], [15, 21], [24, 30]], 0.4)
// the grey cylinder at the south-west corner
{
  const c: XY = [-34.3, -28.2]
  smoothWall(slate, circle(c, 4.2, 14), 0, 26)
  capPoly(slate, circle(c, 4.2, 14), 26, true)
  for (let i = 0; i < 5; i++) {
    const t = Math.PI * (1.05 + i * 0.2), cc = Math.cos(t), s = Math.sin(t)
    for (let z = 4; z < 24; z += 4.5) {
      const P = (u: number, zz: number): V3 => [c[0] + cc * 4.27 - s * u, c[1] + s * 4.27 + cc * u, zz]
      win.quad(P(-0.5, z), P(0.5, z), P(0.5, z + 2.2), P(-0.5, z + 2.2))
    }
  }
}

// ── The 1956 Hoyt library ──
box(lime, -18.4, 44, 1.6, 33.2, 0, 11.5, lime, 0.4)
box(lime, -11.5, 37.7, 1.6, 26.8, 11.5, 14.8, lime, 0.3)
box(slate, -6, 14, 2, 8, 14.8, 26, slate, 0.3)
bays([44, 33.2], [-18.4, 33.2], 4.5, [[1.5, 4.5], [6, 9.5]], 0.6)
bays([44, 1.6], [44, 33.2], 4.5, [[1.5, 4.5], [6, 9.5]], 0.6)
{
  const rr: XY[] = ccw([[18.83, 33.22], [41.04, 33.26], [41.02, 43.78], [40.47, 45.94], [39.69, 47.97], [37.55, 50.86], [36.06, 52.06], [34.37, 53.0], [31.9, 53.78], [29.33, 53.95], [26.78, 53.53], [24.57, 52.64], [22.6, 51.29], [21.13, 49.75], [19.98, 47.96], [19.23, 45.92], [18.82, 43.75]])
  prism(win, rr, 0, 7.6, null, 0)
  prism(lime, rr, 7.6, 8.5, lime, 0.3)
}
prism(red, ccw([[-25.38, 11.23], [-25.38, 14.8], [-21.73, 14.8], [-21.75, 19.67], [-25.48, 19.67], [-25.48, 23.31], [-30.38, 23.31], [-30.38, 19.72], [-33.93, 19.72], [-33.93, 14.86], [-30.24, 14.86], [-30.24, 11.23]]), 0, 8, red, 0.3)

await save('den-central-library', 'Denver Central Library', [
  { part: lime, material: finish('library-limestone', 0xe4d6c2) },
  { part: pink, material: finish('library-rotunda', 0xd39b86) },
  { part: red, material: PALETTE.terracotta },
  { part: slate, material: finish('library-slate', 0xa3a59b) },
  { part: dark, material: finish('library-canopy', 0x4f5458) },
  { part: win, material: PALETTE.window },
], { height: 44.0, anchor: [39.737442, -104.988249], bearing: 0 }, 6500)
