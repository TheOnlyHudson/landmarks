/**
 * Greek Theater and the Colonnade of Civic Benefactors, Civic Center Park,
 * Denver (1919, Marean & Norton) — original procedural geometry, CC0-1.0.
 * bun generators/den-greek-theater.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint (the open-air bowl north of the stage), at the
 * centroid of OSM's outline. Bearing 0: the theatre is symmetric about a
 * north–south axis, the stage opening to the north.
 *
 * Identity (from the photos below):
 *  1. A semicircular colonnade of pale Ionic columns, two rows deep, under
 *     a plain entablature, sweeping round the north-facing bowl.
 *                                                      (d202, habscol)
 *  2. The stage at its centre: a tall open pavilion with a deep plain attic
 *     over a wide flat-headed opening, heavy corner piers, a warm ochre
 *     ceiling inside, curved steps down to the bowl.     (d202, habscol)
 *  3. Square open pavilions at the two ends, columns clustered at their
 *     corners, with a stepped block on top.                 (d202, d216)
 *  4. Low walls with gabled piers running north from the end pavilions.
 *
 * Plan: OSM way/316471209 and its parts. The colonnade's platform edges are
 * circles fitted to OSM's arcs (inner: centre 28.08 m north of the anchor,
 * radius 31.03; outer: 24.73 m north, radius 34.24); the two rows of
 * columns follow OSM's column parts (inner row: 6 a side on a circle 29.16
 * north, radius 32.8; outer row: 5 a side, 24.36 north, radius 33.43).
 * Pavilions x ±24.2..31.9, y 0.9..8.8 and the stage x ±9, y -12.4..0.1
 * are OSM's, mirrored about x = 0 (OSM's halves differ by under 0.5 m).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid;
 * ground_min 1595.2 m; y = 0 here is 0.9 m above it (the bowl in front of
 * the stage). The terrace south of the colonnade is 2.7 m above the bowl;
 * the colonnade's floor is drawn there. Measured: the colonnade's
 * entablature 11.5 (lidar 12.2–12.4), the end pavilions' stepped tops
 * 13.9, the stage's stepped top 15.1. OSM's heights (11.6 m and parts 2–11.8 m) are relative to a
 * lower base and were not used directly; their stepped attic tiers were
 * kept as tiers.
 * Estimated from "d202" scaled to the lidar (20 px a metre at the
 * colonnade): column tops 9.4, radius 0.38; the stage opening's lintel at
 * 9.9 and the front attic's top at 12.6 (the lidar's 15.1 is the stepped
 * top set back behind it); the pavilions' corner columns. The low walls north of the
 * pavilions are OSM's (1 m) with OSM's 5 m gabled piers.
 *
 * Photos (evidence, Wikimedia Commons):
 *  d202     "Greek Theater - Civic Center Park, Denver - DSC01202.jpg",
 *           Daderot, CC0 (from the north, the stage and the east wing)
 *  d216     "Greek Theater - Civic Center Park, Denver - DSC01216.jpg",
 *           Daderot, CC0 (the west pavilion and the low wall with its
 *           gabled fountain pier, from the north-east)
 *  habscol  "Colonade of Civic Benefactors, which is the southern boundary
 *           of civic center ... HABS COLO,16-DENV,..." (HABS CO-68-2), public
 *           domain (from the north-west)
 * No look-only sources. No commercial imagery.
 * Left out: the balusters (drawn as a low solid parapet), the inscriptions,
 * the murals inside the stage, the statues and urns.
 *
 * Night: the colonnade is floodlit softly; the stage's ochre ceiling is not
 * lit as a window.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, ccw, prism, save, type XY } from './atl-tech-tower'
import { arcPts, freeColumn } from './den-city-and-county-building'

const stone = new Part(), ochre = new Part()

const FLOOR = 2.7, COLTOP = 9.4, ENT = 11.5
const deg = (a: number) => (a * 180) / Math.PI

// The platform band between two circles about the axis, from x = xa to xb
// (east half; mirrored for the west).
const IN = { c: [0, 28.08] as XY, r: 31.03 }, OUT = { c: [0, 24.73] as XY, r: 34.24 }
const angAt = (C: { c: XY; r: number }, x: number) => deg(Math.atan2(-Math.sqrt(C.r ** 2 - x ** 2), x))
function band(xa: number, xb: number, dIn: number, dOut: number, n = 8): XY[] {
  const inner = arcPts(IN.c, IN.r - dIn, angAt({ c: IN.c, r: IN.r - dIn }, xa), angAt({ c: IN.c, r: IN.r - dIn }, xb), n)
  const outer = arcPts(OUT.c, OUT.r + dOut, angAt({ c: OUT.c, r: OUT.r + dOut }, xb), angAt({ c: OUT.c, r: OUT.r + dOut }, xa), n)
  return ccw([...inner, ...outer])
}
const mirror = (ring: XY[]): XY[] => ccw(ring.map(([x, y]) => [-x, y] as XY))

// ── The two colonnades ──
const inRow = { c: [0, 29.16] as XY, r: 32.8 }, outRow = { c: [0, 24.36] as XY, r: 33.43 }
const inX = [9.6, 13.35, 16.6, 19.5, 22.05, 24.45], outX = [9.6, 14.0, 17.6, 20.5, 23.0]
const onCircle = (C: { c: XY; r: number }, x: number): XY => [x, C.c[1] - Math.sqrt(C.r ** 2 - x ** 2)]
for (const s of [1, -1]) {
  const M = (r: XY[]) => (s > 0 ? r : mirror(r))
  // platform (split into short pieces for the terrain), entablature
  for (let k = 0; k < 3; k++) {
    const xa = 8.7 + (15.2 * k) / 3, xb = 8.7 + (15.2 * (k + 1)) / 3
    prism(stone, M(band(xa, xb, 0, 0, 3)), 0, FLOOR, stone, 0.1)
  }
  prism(stone, M(band(8.9, 24.2, -0.6, -0.6, 10)), COLTOP, ENT, stone, 0.2)
  // a projecting cornice on the entablature
  prism(stone, M(band(8.9, 24.2, 0.0, 0.0, 10)).map(([x, y]) => [x, y] as XY), ENT - 0.7, ENT - 0.25, null, 0)
  for (const x of inX) freeColumn(stone, onCircle(inRow, s * x), 0.38, FLOOR, COLTOP, 8, 1.5)
  for (const x of outX) freeColumn(stone, onCircle(outRow, s * x), 0.38, FLOOR, COLTOP, 8, 1.5)
  // a low parapet along the back, between the outer columns
  prism(stone, M(band(9.2, 23.6, -6.2, -0.1, 8)), FLOOR, FLOOR + 1.0, stone, 0.08)
}

// ── The end pavilions: open, columns clustered at the corners, stepped tops ──
for (const s of [1, -1]) {
  const x0 = s > 0 ? 24.2 : -31.9, x1 = s > 0 ? 31.9 : -24.2, y0 = 0.9, y1 = 8.8
  box(stone, x0, x1, y0, y1, 0, FLOOR, stone, 0.1)
  for (const [cx, cy, dx, dy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x1, y1, -1, -1], [x0, y1, 1, -1]]) {
    const c: XY = [cx + dx * 0.55, cy + dy * 0.55]
    freeColumn(stone, c, 0.4, FLOOR, COLTOP, 8, 1.5)
    freeColumn(stone, [c[0] + dx * 1.1, c[1]], 0.38, FLOOR, COLTOP, 8, 1.5)
    freeColumn(stone, [c[0], c[1] + dy * 1.15], 0.38, FLOOR, COLTOP, 8, 1.5)
  }
  box(stone, x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1, COLTOP, ENT, null, 0, true)
  box(stone, x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4, ENT - 0.7, ENT - 0.2, stone, 0.1, true)
  // OSM's four stepped tiers, brought up to the lidar's 13.9
  ;[[0.6, 12.3], [1.0, 13.0], [1.4, 13.5], [1.8, 13.9]].reduce((z0, [d, z1]) => {
    box(stone, x0 + d, x1 - d, y0 + d, y1 - d, z0, z1, stone, 0.12)
    return z1
  }, ENT - 0.2)
  // the low wall north to the street, with its gabled pier
  const wx0 = s > 0 ? 31.6 : -34.2, wx1 = s > 0 ? 34.0 : -31.9
  for (let k = 0; k < 4; k++) box(stone, wx0 + 0.6, wx1 - 0.6, 8.8 + k * 5.1, 8.8 + (k + 1) * 5.1, 0, FLOOR + 1.0, stone, 0.1)
  box(stone, wx0, wx1, 10.4, 13.9, 0, FLOOR + 3.0, stone, 0.15)
  const xm = (wx0 + wx1) / 2
  const g = (y: number): V3[] => [[wx0, y, FLOOR + 3.0], [wx1, y, FLOOR + 3.0], [xm, y, FLOOR + 3.8]]
  const a = g(10.4), b = g(13.9)
  stone.tri(a[0], a[2], a[1]); stone.tri(b[0], b[1], b[2])
  stone.quad(a[1], a[2], b[2], b[1]); stone.quad(a[2], a[0], b[0], b[2])
}

// ── The stage: corner piers, the attic over the opening ──
const SX = 9.0, SY0 = -12.4, SY1 = 0.1, LINTEL = 9.9, ATTIC = 12.6
box(stone, -SX, SX, SY0, SY1, 0, FLOOR, stone, 0.1)
for (const [x0, x1] of [[-SX, -6.3], [6.3, SX]]) {
  box(stone, x0, x1, SY1 - 2.7, SY1, FLOOR, LINTEL, null, 0)
  box(stone, x0, x1, SY0, SY0 + 2.7, FLOOR, LINTEL, null, 0)
  // the pairs of columns on the piers' faces toward the bowl
  for (const x of [x0 + 0.6, x1 - 0.6]) freeColumn(stone, [x, SY1 + 0.15], 0.42, FLOOR, LINTEL - 0.4, 8, 1.4)
}
// the attic all round, with the ochre ceiling under it, then the tiers
box(stone, -SX - 0.2, SX + 0.2, SY0 - 0.2, SY1 + 0.2, LINTEL, ATTIC, null, 0.15, false)
ochre.quad([-6.3, SY1, LINTEL - 0.02], [6.3, SY1, LINTEL - 0.02], [6.3, SY0, LINTEL - 0.02], [-6.3, SY0, LINTEL - 0.02])
// a low screen wall at the back (the photos see through the stage above it)
box(stone, -6.3, 6.3, SY0, SY0 + 0.8, FLOOR, FLOOR + 3.2, stone, 0.08)
;[[1.0, 13.4], [2.2, 14.3], [3.4, 15.1]].reduce((z0, [d, z1]) => {
  box(stone, -SX + d, SX - d, SY0 + d, SY1 - d, z0, z1, stone, 0.12)
  return z1
}, ATTIC)
// close the attic's top under the first tier
box(stone, -SX - 0.2, SX + 0.2, SY0 - 0.2, SY1 + 0.2, ATTIC - 0.01, ATTIC, stone, 0)
// the curved apron steps down to the bowl
for (let i = 0; i < 4; i++) {
  const r = 9.0 - i * 0.3, h = (FLOOR * (i + 1)) / 4, yy = SY1 + 5.5 - i * 1.3
  const ring = ccw([[-SX, SY1 - 0.5], [SX, SY1 - 0.5], ...arcPts([0, SY1 - 0.5], r, 0, 180, 10).slice(1, -1).map(([x, y]) => [x, SY1 - 0.5 + (y - SY1 + 0.5) * ((yy - SY1 + 0.5) / r)] as XY)])
  prism(stone, ring, 0, h, stone, 0.06)
}

await save('den-greek-theater', 'Greek Theater', [
  { part: stone, material: { ...finish('greek-sandstone', 0xdcd7cb), floodlight: (_p, n) => (n[2] > 0.8 ? 0.1 : 0.55) } },
  { part: ochre, material: finish('greek-ochre', 0xc99f6f) },
], { height: 15.1, anchor: [39.7382286, -104.9888508], bearing: 0 }, 5000)
