/**
 * Colorado State Capitol, Denver (1886–1894, Elijah E. Myers; dome gilded
 * 1908) — original procedural geometry, CC0-1.0.
 * bun generators/den-colorado-state-capitol.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint (the west front), on the dome's axis. Bearing 0: the
 * OSM walls run north–south and east–west. Anchor -104.9848635, 39.7392332,
 * the dome's centre in the lidar (0.5 m east and 0.8 m south of the centre
 * of OSM's dome parts).
 *
 * Identity (from the photos below):
 *  1. The gold-leafed dome on a tall grey drum: a plain lower drum with
 *     small arched windows, a ring of Corinthian columns, a balustraded
 *     walk, an attic of arched windows, the gilded ribbed dome with one
 *     row of small dormers, and a tall grey lantern.   (soloviev, dome, x343)
 *  2. Light grey Colorado granite throughout; the drum and lantern are
 *     painted metal, a little bluer.                    (soloviev, x855)
 *  3. A cross plan: a long north–south block whose east and west arms
 *     carry the main porticoes (giant columns in antis on an arched ground
 *     storey, under a pediment); a smaller portico on the north and south
 *     ends.                                         (soloviev, south, x855)
 *  4. Corner pavilions with small pediments and low dark hip roofs.
 *                                                      (soloviev, south)
 *  5. Granite steps up to every portico.              (x855, soloviev)
 *
 * Plan: OSM way/34008043 and way/530828379 (the main block, 25 m, hipped),
 * moved into this frame (x + 0.3, y + 8.55 from OSM's raw local metres)
 * and mirrored north–south about the dome (OSM's halves differ by under a
 * metre). East and west are kept as drawn: the east arm reaches 40.3 m and
 * the west 37.4 m, which the lidar confirms (about 41.5 and 38.5 m to
 * the step tops). The steps follow OSM's porch parts (way/530756915 and
 * the other 4.3–7.3 m parts) at the heights the lidar shows.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020, 1 m grid, read with
 * tools/lidar_frame.py; ground_min 1601.9 m, y = 0 here is 5.0 m above it
 * (the lowest ground along the west front; the east lawn is 1.1 m higher).
 * Measured (model metres): eaves 27.5; the cross-gabled roof's ridges 32
 * (north–south) and 31.5 (east–west); corner pavilion roofs about 30;
 * drum radius 12.5 to the balustrade at 47.8; attic radius 9.5 to about
 * 56; gold dome radius about 8, springing near 58, crown 67; lantern radius
 * 2 to 72.8; top of the finial 77.5 (lidar 82.5 above ground_min, against
 * the published 272 ft / 82.9 m measured from the street on the west). Step
 * landings: west 2.8, east 3.6, north 3.5, south 2.7.
 *
 * Estimated: the drum's tiers between the lidar's steps (column base 37.9,
 * entablature 46), the dome's profile, read from the soloviev photo scaled
 * to the lidar; window rows and bays (four storeys: a raised basement and
 * three floors, from the soloviev and south photos); the portico columns
 * (six each, pairs at the ends); the arched doors; the pediments' rise.
 * The north and south porticoes are drawn like the south one in "south".
 * Left out: balustrades, the drum's paired columns and small pediments, the
 * dome's ribs, chimneys, the lamp posts, the Civil War statue.
 *
 * Photos (evidence, Wikimedia Commons):
 *  soloviev "Colorado State Capitol building.jpg", Quintin Soloviev,
 *           CC BY 4.0 (east front from above)
 *  x855     "Colorado State Capitol - 54046380855.jpg", xiquinhosilva,
 *           CC BY 2.0 (west front)
 *  x343     "Colorado State Capitol - 54046185343.jpg", xiquinhosilva,
 *           CC BY 2.0 (the dome)
 *  south    "Colorado State Capitol, Denver. View from south.jpg" (south
 *           front; licence as listed by tools/photos.py: evidence)
 *  lund     "Colorado State Capitol, Denver, Colorado.jpg", Ken Lund,
 *           CC BY-SA 2.0 (from the north-west)
 *  april    "Colorado State Capitol - April 2025.jpg", RuralResurrection,
 *           CC BY 4.0 (from the south-west)
 *  night    "Colorado State Capitol Building (4183402503).jpg", Brian
 *           Papantonio, CC BY 2.0 (west front at night)
 *  aerial   "Aerial view of Denver's Capitol region LCCN2017885204.tif",
 *           Carol M. Highsmith, public domain
 * No look-only sources. No commercial imagery.
 *
 * Roof: the balustrade is drawn as a solid band 1.4 m over the cornice, and
 * the low hips (ridges 31.3 and 30.8, eaves inside the balustrade) are a
 * light grey, so from the street the roof hides as it does in the photos.
 * The porticoes' loggias (the wall behind the columns) are drawn as one
 * dark panel, the shadow the photos show, with the columns standing 1.1 m
 * clear of it.
 *
 * Night (night photo): the centre porticoes, the drum and the gold dome are
 * floodlit strongest, the wings only faintly. The centre's windows, the
 * loggias and the arched doors are `window` and glow; the wings' windows are
 * a separate unlit finish of the same colour, as most are dark at night.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, gableRoof, hipRoof, offset, onWall, prism, rectShape, revolve, save, band, wall, type XY } from './atl-tech-tower'
import { capPoly, ledge } from './atl-flatiron-building'

// `win` is the centre's windows, the porticoes' shadowed loggias and doors and
// the drum's windows, which are lit at night; `wingWin` the wings' windows,
// mostly dark at night in the night photo.
const granite = new Part(), paint = new Part(), gold = new Part(), roof = new Part(), win = new Part(), wingWin = new Part()
const door = win

const EAVE = 27.5, BASE = 8
// The north half of the outline, east to west; the south half mirrors it.
// Portico fronts stand back to the wall behind their columns.
const north: XY[] = [[37.6, 0], [37.6, 8], [37.1, 8], [37.1, 14.7], [19.6, 14.7], [19.6, 30.7], [24.6, 30.7], [24.6, 44.8], [10.2, 44.8], [10.2, 47.2], [7.2, 47.2], [7.2, 49.2], [-7.4, 49.2], [-7.4, 47.2], [-11.5, 47.2], [-11.5, 44.8], [-25.8, 44.8], [-25.8, 30.7], [-21, 30.7], [-21, 14.7], [-34.3, 14.7], [-34.3, 8], [-34.7, 8], [-34.7, 0]]
const south = north.slice(1, -1).map(([x, y]) => [x, -y] as XY).reverse()
const plan = ccw([...north, ...south])

// ── Massing ──
// The walls rise to the top of the balustrade (drawn solid, 1.4 m over the
// cornice); the roof starts just above the cornice, behind it.
const PARA = EAVE + 1.4
prism(granite, plan, 0, PARA, null, 0.2)
band(granite, plan, BASE, 0.5, 0.15, granite)
cornice(granite, plan, EAVE - 1.6, 1.3, 0.55, null)
band(granite, plan, PARA - 0.25, 0.25, 0.12, granite)
const inner = offset(plan, -0.5)
wall(granite, [...inner].reverse(), EAVE, PARA)
ledge(granite, plan, inner, PARA)
capPoly(roof, inner, EAVE, true)

// Roofs: low hips over the long block and the cross arms, ridges as low as
// the lidar allows away from the drum, their eaves inside the balustrade;
// hips on the four corner pavilions.
hipRoof(roof, -20.5, 19.1, -44.3, 44.3, EAVE + 0.2, 31.3, 0)
hipRoof(roof, -33.8, 36.6, -14.2, 14.2, EAVE + 0.2, 30.8, 0)
const pavs: [number, number, number, number][] = [[-25.8, -11.5, 30.7, 44.8], [10.2, 24.6, 30.7, 44.8], [-25.8, -11.5, -44.8, -30.7], [10.2, 24.6, -44.8, -30.7]]
for (const [x0, x1, y0, y1] of pavs) {
  hipRoof(roof, x0, x1, y0, y1, PARA - 0.2, 30.8, 0.3)
  // small pediments on the two outer faces
  const xo = x0 < 0 ? x0 : x1, yo = y0 < 0 ? y0 : y1
  const ex: [XY, XY] = xo < 0 ? [[xo, y1], [xo, y0]] : [[xo, y0], [xo, y1]]
  const ey: [XY, XY] = yo < 0 ? [[x0, yo], [x1, yo]] : [[x1, yo], [x0, yo]]
  for (const [a, b] of [ex, ey]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(granite, a, b, [[0.6, PARA - 0.3], [L - 0.6, PARA - 0.3], [L / 2, PARA + 2.2]], 0.6)
  }
}

// ── Porticoes: arched ground storey, six giant columns, entablature, pediment ──
type Portico = { a: XY; b: XY; front: number; land: number; back: number } // a→b along the wall behind the columns (outside to the right)
const porticoes: Portico[] = [
  { a: [37.6, -8], b: [37.6, 8], front: 2.7, land: 3.6, back: 26.6 }, // east
  { a: [-34.7, 8], b: [-34.7, -8], front: 2.7, land: 2.8, back: 23.7 }, // west
  { a: [7.2, 49.2], b: [-7.4, 49.2], front: 2.8, land: 3.5, back: 38.2 }, // north
  { a: [-7.4, -49.2], b: [7.2, -49.2], front: 2.8, land: 2.7, back: 38.2 }, // south
]
for (const { a, b, front, land, back } of porticoes) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, d: number): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
  const quad = (d0: number, d1: number): XY[] => ccw([P(0, d0), P(L, d0), P(L, d1), P(0, d1)])
  // the arcaded ground storey, out to the columns' line
  prism(granite, quad(-0.1, front), 0, BASE + 0.5, granite, 0.3)
  const fa = P(0, front), fb = P(L, front)
  for (const s of [L / 2 - 3.6, L / 2, L / 2 + 3.6]) {
    onWall(door, fa, fb, rectShape(s - 1.1, s + 1.1, land, land + 3.4), 0.05)
    onWall(win, fa, fb, archShape(s, 2.2, land + 3.4, land + 3.4, 6).slice(2), 0.05)
  }
  // the loggia: the wall behind the columns in shadow, between the end piers
  onWall(win, a, b, rectShape(1.6, L - 1.6, BASE + 0.5, EAVE - 2.6), 0.03)
  for (const s of [0.8, L - 0.8]) prism(granite, ccw([P(s - 0.8, 0), P(s + 0.8, 0), P(s + 0.8, front - 0.2), P(s - 0.8, front - 0.2)]), BASE + 0.5, EAVE - 2.6, null, 0.1)
  // six pale columns standing clear of it: pairs at the ends, two between
  for (const s of [2.4, 3.9, L / 2 - 1.9, L / 2 + 1.9, L - 3.9, L - 2.4]) {
    revolve(granite, P(s, front - 0.8), [[0.68, BASE + 0.5], [0.58, EAVE - 2.6]], 12, 0, false, false)
  }
  // entablature with a projecting cornice, then the pediment, its roof
  // running back to the drum
  prism(granite, quad(-0.1, front + 0.1), EAVE - 2.6, EAVE, null, 0.2)
  cornice(granite, quad(-0.1, front + 0.1), EAVE - 0.9, 0.9, 0.6, granite)
  const g0 = P(0, -back), g1 = P(L, front + 0.4)
  gableRoof(roof, granite, Math.min(g0[0], g1[0]), Math.max(g0[0], g1[0]), Math.min(g0[1], g1[1]), Math.max(g0[1], g1[1]), EAVE, EAVE + 4, Math.abs(t[0]) > 0.5 ? 'y' : 'x', 0.6, 0.5)
}

// ── Steps up to the porticoes ──
// A flight in n tiers along x or y, from the landing at s0 (by the
// portico) out to s1, across c0..c1.
function steps(axis: 'x' | 'y', s0: number, s1: number, c0: number, c1: number, top: number, bottom: number, n = 5) {
  for (let i = 0; i < n; i++) {
    const s = s0 + ((s1 - s0) * i) / n, h = top - ((top - bottom) * i) / n
    const [lo, hi] = [Math.min(s, s1), Math.max(s, s1)]
    if (axis === 'x') box(granite, lo, hi, c0, c1, 0, h, granite, 0.15)
    else box(granite, c0, c1, lo, hi, 0, h, granite, 0.15)
  }
}
steps('x', 40.3, 50.4, -8, 8, 3.6, 1.1)
steps('x', -37.4, -47.5, -8, 8, 2.8, 0.2)
steps('y', 52, 62.4, -7.6, 7.4, 3.5, 1)
steps('y', -52, -62.4, -7.6, 7.4, 2.7, 0.8)

// ── Windows: four rows on every face, a panel per bay ──
const ROWS: [number, number][] = [[3.6, 6.4], [10, 14.6], [16.2, 20], [21.8, 24.6]]
const isPorticoWall = (a: XY, b: XY) => (Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[0] - 37.6) < 0.01) || (Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[0] + 34.7) < 0.01) || (Math.abs(a[1] - b[1]) < 0.01 && Math.abs(Math.abs(a[1]) - 49.2) < 0.01)
for (let i = 0; i < plan.length; i++) {
  const a = plan[i], b = plan[(i + 1) % plan.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.floor(L / 3.5)
  if (k < 1) continue
  if (isPorticoWall(a, b)) continue // the loggia, drawn above
  for (let j = 0; j < k; j++) {
    const s = ((j + 0.5) * L) / k
    const m: XY = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L]
    const part = Math.abs(m[0]) < 12 || Math.abs(m[1]) < 15 ? win : wingWin
    for (const [z0, z1] of ROWS) onWall(part, a, b, rectShape(s - 0.75, s + 0.75, z0, z1))
  }
}

// ── The dome ──
const N = 16, PH = Math.PI / N, DC: XY = [0, 0]
// lower drum, colonnade core, entablature and walk, attic, dome base
revolve(paint, DC, [[12.5, 29], [12.5, 37.9]], N, PH, true, false)
revolve(paint, DC, [[12.5, 37.9], [10.6, 37.9], [10.6, 46], [12.8, 46], [12.8, 47.2], [12.4, 47.4], [12.4, 47.8], [9.5, 47.8]], N, PH, true, false)
revolve(paint, DC, [[9.5, 47.8], [9.5, 55.4], [10, 55.6], [10, 56.3], [8.4, 56.3], [8.4, 58], [7.9, 58]], N, PH, true, false)
const domeProf: [number, number][] = Array.from({ length: 7 }, (_, i) => {
  const r = 7.9 - (i / 6) * (7.9 - 1.9)
  return [r, 58 + 9.6 * Math.pow(1 - (r / 7.9) ** 2.6, 0.5)]
})
revolve(gold, DC, domeProf, N, PH, false, false)
revolve(paint, DC, [[1.9, 67.2], [2, 67.2], [2, 72.6], [2.3, 72.8], [2.3, 73.3], [1.8, 73.4], [1.3, 74.8], [0.5, 75.6], [0.42, 76], [0.6, 76.5], [0.25, 77.1], [0, 77.5]], 8, Math.PI / 8, true, true)
// columns round the drum
for (let i = 0; i < 24; i++) {
  const a = (i / 24) * Math.PI * 2 + PH
  revolve(paint, [12 * Math.cos(a), 12 * Math.sin(a)], [[0.45, 37.9], [0.4, 46]], 6, 0, true, false)
}
// windows on the drum's faces
const face = (r: number, i: number): [XY, XY] => {
  const a0 = PH + (i / N) * Math.PI * 2, a1 = PH + ((i + 1) / N) * Math.PI * 2
  return [[r * Math.cos(a0), r * Math.sin(a0)], [r * Math.cos(a1), r * Math.sin(a1)]]
}
for (let i = 0; i < N; i++) {
  const w = 2 * Math.sin(PH)
  onWall(win, ...face(12.5, i), archShape(w * 12.5 / 2, 1.5, 33.2, 35.6, 6))
  onWall(win, ...face(10.6, i), archShape(w * 10.6 / 2, 2, 39.4, 43.2, 6))
  onWall(win, ...face(9.5, i), archShape(w * 9.5 / 2, 1.7, 49.4, 53.2, 6))
  if (i % 2 === 0) onWall(win, ...face(2, i), archShape(w * 2 / 2, 0.55, 68.6, 71.2, 4), 0.04)
}
// the row of dormers on the gold dome, on the dome's vertex lines
for (let i = 0; i < N; i++) {
  const a = (i / N) * Math.PI * 2 + PH * 2
  const zr = (z: number) => 7.9 * Math.pow(1 - ((z - 58) / 9.6) ** 2, 1 / 2.6) + 0.06
  const c: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
  const P = (s: number, z: number): V3 => [c[0] * zr(z) + t[0] * s, c[1] * zr(z) + t[1] * s, z]
  win.quad(P(-0.45, 60.4), P(0.45, 60.4), P(0.45, 62.2), P(-0.45, 62.2))
}

await save('den-colorado-state-capitol', 'Colorado State Capitol', [
  { part: granite, material: { ...finish('capitol-granite', 0xd2d4d2), floodlight: (p, n) => (n[2] < 0.5 ? (Math.abs(p[0]) < 12 || Math.abs(p[1]) < 10 ? 0.75 : 0.2) : 0.05) } },
  { part: paint, material: { ...finish('capitol-drum', 0xbcc8d2), floodlight: (p, n) => (n[2] < 0.9 ? 1 : 0.4) } },
  { part: gold, material: { ...finish('capitol-gold', 0xedd07e, 0.45), floodlight: () => 1 } },
  { part: roof, material: finish('capitol-roof', 0xb8bdc1) },
  { part: win, material: PALETTE.window },
  { part: wingWin, material: finish('capitol-wing-windows', 0x64798a, 0.35) },
], { height: 77.5, anchor: [39.7392332, -104.9848635], bearing: 0 }, 6500)
