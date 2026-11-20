/**
 * Molly Brown House Museum, 1340 Pennsylvania Street, Denver (1889,
 * William A. Lang; Queen Anne) — original procedural geometry, CC0-1.0.
 * bun generators/den-molly-brown-house.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin on the ground
 * at the anchor, the area centroid of OSM way/131551278 (-104.9807614,
 * 39.7375109). The front faces west onto Pennsylvania Street (-x).
 *
 * Identity, in order (photos below):
 *  1. steep gables with decorative woodwork in the gable fields, painted
 *     dark green-black today (salmon in older photos): the big west gable
 *     over the front, a north cross gable, the main east–west roof.
 *                                              (mauer, apw, highs, onetwo)
 *  2. the deep front porch across the west front, on turned posts, with a
 *     small gable over the steps.                        (highs, onetwo, apw)
 *  3. rough-faced grey-brown rhyolite walls with red sandstone round
 *     arches and lintels over the windows; tall chimneys.  (mauer, onetwo)
 *
 * Plan: OSM way/131551278 (20.1 × 13 m, a north bay 6.5 m wide, a rear wing
 * to the south-east), used as drawn.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid. y = 0
 * is 1613.3 m, the lowest ground at the west front (the house stands on a
 * terrace about 1.2 m above the street, which the terrain carries; the
 * east side is 1.2 m higher). Measured: main ridge 14.2; the north gable's
 * peak 14.1; the west gable 13.0; eaves about 7.7; the rear wing 8.7; the
 * porch roof 4.7–5.2. The porch's gable over the steps is placed near the
 * middle of the front, as in the highs photo.
 *
 * Estimated from the photos: storeys (a raised basement to 1.3, floors at
 * 1.3 and 4.6), window sizes, the porch posts and its 2.9 m depth (the
 * lidar's porch roof runs 2.9 m beyond OSM's outline), the chimneys.
 * Left out: the balustrades, the stone lions and the terrace walls (ground),
 * fish-scale shingles, the stained glass.
 *
 * Photos (Wikimedia Commons, evidence):
 *  mauer   "Molly Brown House exterior.png", Jonathan Mauer, CC BY-SA 4.0
 *          (front and north side, from the north-west)
 *  apw     "MollyBrownHouseMuseum exterior.jpg", Apw250, CC0 (front from the
 *          south-west, dark trim)
 *  highs   "The Molly Brown House Museum in Denver, Colorado
 *          LCCN2015633624.tif", Carol M. Highsmith, public domain (west front)
 *  onetwo  "Mollybrownhouse.JPG", Onetwo1 at English Wikipedia, CC BY-SA 3.0
 *          (front from the south-west)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east (back) side is not photographed; it is drawn plain.
 * The trim colour changed between photos; the current dark scheme is used.
 *
 * Night: windows glow; nothing is floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, gableRoof, hipRoof, rectShape, save } from './atl-tech-tower'
import { faces, onFace, roundArch, tri } from './den-cathedral-basilica'

const stone = new Part(), sand = new Part(), roof = new Part(), dark = new Part(), win = new Part()

const X0 = -10.7, X1 = 9.4, Y0 = -5.2, Y1 = 6.2, EAVE = 7.7

// ── Masses ──
box(stone, X0, X1, Y0, Y1, 0, EAVE, null, 0)
box(sand, X0 - 0.12, X1 + 0.12, Y0 - 0.12, Y1 + 0.12, 0, 1.3, null, 0.05) // basement course
gableRoof(roof, dark, -4.0, X1, Y0, Y1, EAVE, 14.2, 'x', 0.45, 0.35)
gableRoof(roof, dark, X0, -3.6, Y0 + 0.4, Y1 - 0.4, EAVE, 13.0, 'x', 0.45, 0.45)
// the north bay and its cross gable
box(stone, -4.7, 1.8, Y1 - 0.1, 8.1, 0, EAVE, null, 0)
gableRoof(roof, dark, -4.7, 1.8, 0.5, 8.1, EAVE, 14.1, 'y', 0.45, 0.4)
// the rear wing to the south-east
box(stone, 4.7, X1, -8.8, Y0 + 0.1, 0, 6.6, null, 0)
hipRoof(roof, 4.7, X1, -8.8, Y0 + 0.6, 6.6, 8.7, 0.4)
// chimneys: south wall, west of centre, and on the east ridge
for (const [x, y, top] of [[-6.0, Y0 - 0.2, 15.6], [6.0, -1.0, 15.8]] as [number, number, number][]) {
  box(sand, x - 0.55, x + 0.55, y - 0.45, y + 0.45, 6.0, top, sand, 0.06)
  box(dark, x - 0.7, x + 0.7, y - 0.6, y + 0.6, top - 0.35, top, dark, 0.05)
}

// ── Gable fields: dark woodwork bands and a window ──
{
  const W = faces(X0, -3.6, Y0 + 0.4, Y1 - 0.4).W
  const mid = 0.5
  onFace(dark, W, tri(Y1 - 0.4 - 0.15, Y0 + 0.4 + 0.15, EAVE + 0.15, 12.85), 0.1)
  onFace(win, W, roundArch(mid - 0.75, 1.0, 9.0, 10.2, 6), 0.16)
  onFace(win, W, roundArch(mid + 0.75, 1.0, 9.0, 10.2, 6), 0.16)
  onFace(stone, W, rectShape(mid - 2.2, mid + 2.2, 8.6, 8.8), 0.15)
  const N = faces(-4.7, 1.8, 0.5, 8.1).N
  onFace(dark, N, tri(1.65, -4.55, EAVE + 0.15, 13.95), 0.1)
  onFace(win, N, roundArch(-1.45, 1.3, 9.0, 10.6, 6), 0.16)
}

// ── Windows: sandstone arches and lintels on rhyolite ──
function opening(f: ReturnType<typeof faces>[keyof ReturnType<typeof faces>], s: number, w: number, z0: number, zs: number, arched: boolean) {
  if (arched) {
    onFace(sand, f, roundArch(s, w + 0.7, z0 - 0.25, zs, 8), 0.04)
    onFace(win, f, roundArch(s, w, z0, zs, 8), 0.08)
  } else {
    onFace(sand, f, rectShape(s - w / 2 - 0.3, s + w / 2 + 0.3, zs, zs + 0.45), 0.06)
    onFace(sand, f, rectShape(s - w / 2 - 0.15, s + w / 2 + 0.15, z0 - 0.2, z0), 0.06)
    onFace(win, f, rectShape(s - w / 2, s + w / 2, z0, zs), 0.08)
  }
}
const F = faces(X0, X1, Y0, Y1)
// west front: the door and parlour windows behind the porch, two upstairs
opening(F.W, 3.0, 1.5, 1.6, 4.0, false)
opening(F.W, 7.8, 1.1, 1.6, 3.6, true) // the front door's glazed head
opening(F.W, 9.5, 1.3, 1.6, 4.0, false)
opening(F.W, 3.2, 1.3, 5.2, 6.8, true)
opening(F.W, 8.2, 1.3, 5.2, 6.8, false)
// south side
for (const [s, arched] of [[-8.5, true], [-1.5, false], [2.5, false]] as [number, boolean][]) {
  opening(F.S, s, 1.3, 1.8, 3.8, arched)
  opening(F.S, s, 1.2, 5.0, 6.8, !arched)
}
// north side and its bay
const NB = faces(-4.7, 1.8, 0.5, 8.1)
opening(NB.N, -2.5, 1.5, 1.8, 3.8, true)
opening(NB.N, -0.4, 1.0, 1.8, 3.8, false)
opening(NB.N, -2.5, 1.5, 5.0, 6.6, false)
opening(NB.N, -0.4, 1.0, 5.0, 6.6, false)
opening(F.N, -8.0, 1.2, 1.8, 3.8, false)
opening(F.N, -8.0, 1.2, 5.0, 6.8, false)
opening(F.N, 5.5, 1.2, 1.8, 3.8, false)
opening(F.N, 5.5, 1.2, 5.0, 6.8, true)
// east (rear), plain
opening(F.E, 2.0, 1.1, 1.8, 3.8, false)
opening(F.E, 2.0, 1.1, 5.0, 6.8, false)
// band courses
for (const k of ['W', 'S', 'N', 'E'] as const) {
  const lo = k === 'W' || k === 'E' ? Y0 : X0, hi = k === 'W' || k === 'E' ? Y1 : X1
  onFace(sand, F[k], rectShape(lo, hi, 4.45, 4.7), 0.05)
}

// ── The front porch: floor, posts, roof, the gable over the steps ──
{
  const PX0 = X0 - 2.9, PY0 = -4.2, PY1 = 5.9, FL = 1.3, PT = 4.0
  box(stone, PX0, X0, PY0, PY1, 0, FL, dark, 0.05)
  for (const y of [PY0 + 0.25, -2.2, 4.3, PY1 - 0.25]) box(dark, PX0 + 0.1, PX0 + 0.4, y - 0.15, y + 0.15, FL, PT, null, 0)
  box(dark, PX0, X0, PY0, PY1, PT, PT + 0.45, null, 0)
  // a low hipped roof against the wall
  const a: V3 = [PX0 - 0.3, PY0 - 0.3, PT + 0.45], b: V3 = [X0, PY0 - 0.3, 5.1], c: V3 = [X0, PY1 + 0.3, 5.1], d: V3 = [PX0 - 0.3, PY1 + 0.3, PT + 0.45]
  roof.quad(a, b, c, d)
  roof.tri(a, [X0, PY0 - 0.3, PT + 0.45], b)
  roof.tri(d, c, [X0, PY1 + 0.3, PT + 0.45])
  // the gable over the steps, facing west near the south end
  gableRoof(roof, dark, PX0 - 0.2, X0, -0.3, 2.7, PT + 0.45, 6.2, 'x', 0.15, 0.2)
  box(dark, PX0 - 0.2, PX0 + 0.1, -0.3, 0.0, FL, PT + 0.45, null, 0)
  box(dark, PX0 - 0.2, PX0 + 0.1, 2.4, 2.7, FL, PT + 0.45, null, 0)
  // railings as a low dark band between posts
  box(dark, PX0 + 0.12, PX0 + 0.35, PY0 + 0.4, -0.4, FL, FL + 0.8, null, 0)
  box(dark, PX0 + 0.12, PX0 + 0.35, 2.8, PY1 - 0.4, FL, FL + 0.8, null, 0)
}

await save('den-molly-brown-house', 'Molly Brown House Museum', [
  { part: stone, material: finish('mollybrown-rhyolite', 0xb3a597) },
  { part: sand, material: finish('mollybrown-sandstone', 0xb97c63) },
  { part: roof, material: finish('mollybrown-shingle', 0x6f6866) },
  { part: dark, material: finish('mollybrown-trim', 0x50574f) },
  { part: win, material: PALETTE.window },
], { height: 15.8, anchor: [39.7375109, -104.9807614], bearing: 0 })
