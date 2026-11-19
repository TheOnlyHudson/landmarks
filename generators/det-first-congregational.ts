/**
 * First Congregational Church of Detroit (33 East Forest Avenue at
 * Woodward; 1891, John Lyman Faxon, Romanesque and Byzantine Revival, red
 * sandstone): procedural, CC0-1.0.
 * bun generators/det-first-congregational.ts
 *
 * Map frame: x, y, z up, metres, turned to the church: +y runs along bearing
 * 64 (east-north-east), +x along 154 (towards Forest Avenue). The Woodward
 * front faces -y. The anchor is the centroid of the OSM outline
 * way/69139629: 42.3552929, -83.0625955.
 *
 * Identity, in order: the tall square red sandstone campanile with three
 * stages of round-arched openings over corbel tables, its green copper
 * pyramid roof and the gilded-green Angel Gabriel on top; the Woodward
 * gable front, its arched lunette window group, over the arcaded entrance
 * porch (five round arches, the middle three wide) at the top of a broad
 * stair; the dark slate roofs; the south transept's gable with its rose
 * window; the flat-roofed brick church house behind.
 *
 * Evidence:
 *  - plan: OSM way/69139629 (building=church, Q5452798 per the brief); the
 *    church house is inside the same outline.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; heights over the ground behind the church (0.5 m over the
 *    box minimum; Woodward 0.5 m higher). Measured: the porch's flat roof
 *    6.9; the ridges about 17.8; the tower's corbelled top 27.8 at
 *    (14.5, -16), its pyramid to about 31.7; the church house 10.2. The dark
 *    slate roofs return few points, so the eaves are from the photo.
 *  - photos (all EVIDENCE):
 *    - First Congressional Church of Christ, Detroit, Michigan.tif, Carol M.
 *      Highsmith, public domain (Library of Congress; the Woodward front
 *      square on): porch arches, gable, lunette, tower stages, scaled
 *      0.0289 m/px to the porch's lidar width.
 *      https://commons.wikimedia.org/wiki/File:First_Congressional_Church_of_Christ,_Detroit,_Michigan.tif
 *    - First Congregational Church (Detroit, Michigan).jpg, Andrew Jameson,
 *      CC BY-SA 3.0 (from Woodward and Forest: the south side, the
 *      transept's rose window, the tower).
 *      https://commons.wikimedia.org/wiki/File:First_Congregational_Church_(Detroit,_Michigan).jpg
 *    - First Congregational Church Angel.jpg, Andrew Jameson, CC BY-SA 3.0
 *      (the tower's top, the angel).
 *      https://commons.wikimedia.org/wiki/File:First_Congregational_Church_Angel.jpg
 *    - First Congregational Church 1903.jpg, Detroit Publishing Company,
 *      public domain (front and tower from the north-west).
 *  - published: 1891, Faxon; NRHP 79001169 (Wikipedia, "First
 *    Congregational Church (Detroit)").
 *  Estimated: eaves 8.2 and gable apex 16.8 (photo), the tower's stage
 *  heights (photo, scaled to its lidar top), the angel (2 m).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side and the east end are not photographed; the north
 * transept arm and the chancel are plain. The church house's windows are
 * estimated. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { flatShape, extrudeShape, archShape, arc, lathe } from './sea-tacoma-union-station'
import { bbox, box, gable, pyramid, face, panels, arches, side, sOf, R, spread, saveModel, type Mat } from './det-detroit-institute-of-arts'

const NX0 = 1.0, NX1 = 15.2, XM = (NX0 + NX1) / 2 // the nave and its axis
const FY = -29.5, PY = -33.5 // the gable front and the porch front
const EAVE = 8.2, RIDGE = 16.8
const TX0 = 12.3, TX1 = 17.4, TY0 = -18.7, TY1 = -13.6, TT = 27.8 // the tower
const z = (py: number) => (1000 - py) * 0.0289 // Highsmith photo row to height
const tz = (py: number) => TT - (py - 235) * 0.0375 // the tower's own scale in that photo

function build(): Mat[] {
  const sand = new Part(), slate = new Part(), cu = new Part(), win = new Part(), trim = new Part(), brick = new Part()

  // ---------------------------------------------------------------- nave, transept, chancel block
  box(sand, null, NX0, FY, NX1, 22, 0, EAVE)
  gable(slate, sand, NX0, FY, NX1, 22, EAVE, RIDGE, 'y', 0.4)
  box(sand, null, -6.5, -8, 17.4, 2, 0, EAVE)
  gable(slate, sand, -6.5, -8, 17.4, 2, EAVE, RIDGE, 'x', 0.4)
  box(sand, null, NX1, 4.5, 20.2, 23.9, 0, 6.5)
  gable(slate, sand, NX1, 4.5, 20.2, 23.9, 6.5, 9.5, 'y', 0.3)
  // side windows along the nave, round-headed, in pairs
  for (const y of [-25.5, -22, 6, 11, 16]) arches(win, 'w', NX0, [y - 0.7, y + 0.7], 0.9, 3.0, 5.6, 0.05, 6)
  for (const y of [-25.5, -22]) arches(win, 'e', NX1, [y - 0.7, y + 0.7], 0.9, 3.0, 5.6, 0.05, 6)
  // the south transept's gable: a rose window over three arched lights
  {
    const f = side('e', 17.4), c = -3
    flatShape(trim, f, arc(c, 10.0, 2.55, 0, 360, 16).slice(0, 16), 0.04)
    flatShape(win, f, arc(c, 10.0, 2.2, 0, 360, 16).slice(0, 16), 0.07)
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 4, dx = Math.cos(a), dz = Math.sin(a), b = 0.09; flatShape(trim, f, [[c - dx * 2.2 - dz * b, 10 - dz * 2.2 + dx * b], [c + dx * 2.2 - dz * b, 10 + dz * 2.2 + dx * b], [c + dx * 2.2 + dz * b, 10 + dz * 2.2 - dx * b], [c - dx * 2.2 + dz * b, 10 - dz * 2.2 - dx * b]], 0.1) }
    for (const d of [-1.6, 0, 1.6]) flatShape(win, f, archShape(c + d, 1.0, 2.8, 6.0, 6), 0.06)
    const fw = side('w', -6.5)
    flatShape(win, fw, arc(sOf('w', -3), 10.0, 1.8, 0, 360, 12).slice(0, 12), 0.06)
  }

  // ---------------------------------------------------------------- the Woodward front
  {
    const f = side('s', FY)
    const S = (x: number) => sOf('s', x)
    // the lunette: a semicircle of glass over five arched lights, in a pale ring
    flatShape(trim, f, [...arc(S(XM), z(760), 2.9, 0, 180, 10)], 0.04)
    flatShape(win, f, [...arc(S(XM), z(760), 2.5, 0, 180, 10)], 0.07)
    for (let k = -2; k <= 2; k++) flatShape(win, f, archShape(S(XM + k * 0.95), 0.75, z(760) - 2.1, z(760) - 0.4, 5), 0.07)
    flatShape(trim, f, R(S(XM) - 2.8, z(760) - 0.25, S(XM) + 2.8, z(760)), 0.1)
    // the small window high in the gable, and a cross on the apex
    flatShape(win, f, archShape(S(XM), 0.7, z(560), z(520), 5), 0.06)
    box(trim, trim, XM - 0.14, FY - 0.25, XM + 0.14, FY + 0.15, RIDGE - 0.3, RIDGE + 1.5)
    box(trim, trim, XM - 0.55, FY - 0.25, XM + 0.55, FY + 0.15, RIDGE + 0.75, RIDGE + 1.05)
  }
  // the porch: five round arches (the middle three wide), a carved band, a flat roof
  {
    const PX0 = -0.5, PX1 = 17.4, PT = 6.9, FL = 1.6
    bbox(sand, sand, PX0, PY, PX1, FY + 0.2, 0, PT, 0.2)
    bbox(trim, null, PX0 - 0.15, PY - 0.15, PX1 + 0.15, FY + 0.2, PT - 1.9, PT - 1.2, 0.08)
    const f = side('s', PY)
    for (const [x, w] of [[1.43, 1.2], [4.26, 2.2], [8.16, 2.2], [12.0, 2.2], [15.2, 1.2]] as [number, number][]) {
      flatShape(trim, f, archShape(sOf('s', x), w + 0.7, FL, FL + (w > 2 ? 2.2 : 1.9), 8), 0.04)
      flatShape(win, f, archShape(sOf('s', x), w, FL, FL + (w > 2 ? 2.2 : 1.9), 8), 0.08)
    }
    // the stair up to it
    for (let k = 0; k < 4; k++) box(sand, sand, PX0 - 0.6, PY - 0.6 - k * 0.55, PX1 + 0.6, PY, 0, FL - k * 0.4)
  }

  // ---------------------------------------------------------------- the campanile
  {
    const xm = (TX0 + TX1) / 2, ym = (TY0 + TY1) / 2
    bbox(sand, null, TX0, TY0, TX1, TY1, 0, TT - 1.2, 0.1)
    // corbel tables under each stage, a corbelled parapet at the top
    for (const zb of [tz(485), tz(385), tz(290)]) bbox(trim, null, TX0 - 0.15, TY0 - 0.15, TX1 + 0.15, TY1 + 0.15, zb - 0.45, zb, 0.08)
    bbox(sand, sand, TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35, TT - 1.2, TT, 0.15)
    for (const [dir, c, m] of [['s', TY0, xm], ['n', TY1, xm], ['e', TX1, ym], ['w', TX0, ym]] as ['s' | 'n' | 'e' | 'w', number, number][]) {
      arches(win, dir, c, [m - 1.45, m, m + 1.45], 0.95, tz(365), tz(320), 0.06, 6)
      arches(win, dir, c, [m - 1.1, m, m + 1.1], 0.8, tz(465), tz(425), 0.06, 6)
      arches(win, dir, c, [m - 0.8, m + 0.8], 0.75, tz(565), tz(530), 0.06, 6)
      panels(win, dir, c, [m], 0.6, 9.5, 12.0, 0.06)
    }
    // the copper pyramid and the angel
    pyramid(cu, TX0 + 0.5, TY0 + 0.5, TX1 - 0.5, TY1 - 0.5, TT, TT + 3.9)
    const top = TT + 3.9
    lathe(cu, xm, ym, [[0.35, top - 0.3], [0.35, top + 0.2], [0.001, top + 0.3]], 8)
    lathe(cu, xm, ym, [[0.22, top + 0.2], [0.3, top + 1.0], [0.18, top + 1.6], [0.12, top + 1.9], [0.001, top + 2.0]], 8)
    // the wings, swept up and back, facing Woodward
    for (const s of [-1, 1]) face(cu, [[xm + s * 0.15, ym, top + 1.0], [xm + s * 0.7, ym + 0.2, top + 1.3], [xm + s * 0.35, ym + 0.1, top + 2.3]], [0, -1, 0.2])
    for (const s of [-1, 1]) face(cu, [[xm + s * 0.15, ym, top + 1.0], [xm + s * 0.35, ym + 0.1, top + 2.3], [xm + s * 0.7, ym + 0.2, top + 1.3]], [0, 1, 0.2])
  }
  // the aisle between the porch and the tower, under the tower's flank
  box(sand, sand, NX1, FY, TX1, TY0, 0, 6.5)

  // ---------------------------------------------------------------- the church house
  bbox(brick, brick, -24.1, -13, NX0, 23.9, 0, 10.2, 0.2)
  for (const [dir, c, a, b] of [['w', -24.1, -12, 23], ['s', -13, -23, -7], ['n', 23.9, -23, 0]] as ['s' | 'n' | 'w', number, number, number][]) {
    const at = spread(a, b, Math.max(2, Math.round((b - a) / 3.4)))
    panels(win, dir, c, at, 1.4, 1.4, 3.6, 0.05)
    panels(win, dir, c, at, 1.4, 5.8, 8.4, 0.05)
  }
  void extrudeShape

  return [
    { part: sand, material: { ...finish('first-cong-sandstone', 0xb87562), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : p[0] > 11 && p[1] < -12 && p[1] > -20 ? 1 : 0.15) } },
    { part: slate, material: finish('first-cong-slate', 0x6f7176) },
    { part: cu, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('first-cong-trim', 0xd9ab95) },
    { part: brick, material: finish('first-cong-brick', 0xa86a58) },
  ]
}

if (import.meta.main) await saveModel('det-first-congregational', 'First Congregational Church', [42.3552929, -83.0625955], 64, build(), 5000)
