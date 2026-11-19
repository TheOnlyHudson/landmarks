/**
 * The Hermitage, Andrew Jackson's house, Hermitage, Nashville (1819–21,
 * rebuilt 1831 and 1835–37 in its Greek Revival form): procedural, CC0-1.0.
 * bun generators/nash-hermitage.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the OSM walls run
 * 0.5°/90.5°). Origin: the area centroid of OSM way/433258649
 * (-86.6129907, 36.2150147). y = 0 is the lawn (lidar ground, flat within
 * 0.3 m round the house).
 *
 * Form (photos, lidar): a two-storey brick house, its main block 20.8 m
 * wide, with a two-storey portico of six fluted Corinthian columns across
 * front (south) and back (north), each with a gallery at the upper floor.
 * The FRONT is painted white (walls, columns, entablature) and its portico
 * has a flat entablature, no pediment; the BACK is bare red brick and its
 * portico carries a pediment. One-storey wings each side, white on the
 * front, brick behind; a low hipped main roof; four tall brick chimneys
 * on the side walls; dark green shutters.
 *
 * OSM: way/433258649 "The Hermitage", building=yes, no heights or parts:
 * main block x -9.4..11.4 (porticoes included, y -11.5..10.7), west wing
 * x -15.4..-9.4 (with a north room to y 14.6), east wing x 11.4..17.4.
 * Separate small buildings north (way/433258648, the kitchen) and north-east
 * (way/433258660) are not part of this model.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, 0.5 m grid, read with
 * tools/lidar_frame.py: main block and porticoes 11–12 above y = 0 to
 * the roof top (front portico roof 12 at y -12; back 12 to y 9.5); west
 * wing 5–7; east wing 6–7, falling to 5 at its east edge.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-hermitage/photos):
 *  Bowen "The Hermitage by Jim Bowen.jpg", Jim Bowen, CC BY 2.0: the front,
 *      frontal: white walls, six fluted Corinthian columns (~0.9 m), the
 *      gallery, the door with fanlight and sidelights, shutters, the wings'
 *      white fronts and their big windows. Storey heights scaled from it.
 *  2022c "The Hermitage mansion 2022c.jpg", Antony-22, CC BY-SA 4.0: front.
 *  2022e "The Hermitage mansion 2022e.jpg", Antony-22, CC BY-SA 4.0: the
 *      back: red brick, the pedimented portico, gallery, stone footings.
 *  2022d "The Hermitage mansion 2022d.jpg", Antony-22, CC BY-SA 4.0: back
 *      from the north-west, the west wing.
 *  2022g "The Hermitage mansion 2022g.jpg", Antony-22, CC BY-SA 4.0: a side
 *      wing's end: door with transom, windows, the main block's chimneys.
 *  TheHermitage "TheHermitage.jpg", J. Williams (JW1805), public domain:
 *      front corner: the wing's white front, brick sides, chimneys.
 *  NAIP (USDA, public domain, 0.1 m): pale grey roofs, the walk to the
 *      south front.
 *
 * Estimated (photos scaled to the lidar): porch floors 1.0; columns 1.0 to
 * 8.6 (r 0.45); entablature to 10.2, cornice 10.6; main roof hip to 12.0;
 * back pediment apex 12.9 (2.3 m over the cornice in 2022e); galleries at
 * 4.7 (a 0.7 m white band for the railing); portico depth 3 m; wings 6.0;
 * chimneys to 14.3; window and door sizes.
 * Left out: railings (the galleries carry a solid white band), capitals'
 * carving (a plain square block), the stone footings' colour, gutters.
 * Doors take the brick colour (the real doors are dark red-brown wood); the
 * white front wall under the portico is a shaded white, as in every photo,
 * so the columns read against it.
 * Night: windows are `window`; the house is not floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, rect, prism, capRing, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { triO, quadO, box, column } from './nash-tennessee-state-capitol'

// main block (OSM) and porticoes
const X0 = -9.4, X1 = 11.4, XC = (X0 + X1) / 2
const YF = -8.5, YB = 7.5 // the main block's front and back walls
const PED = 12.9 // the back pediment's apex (photo 2022e: 2.3 m over the cornice)
const FLOOR = 1.0, COL = 8.6, ENT = 10.2, CORN = 10.6, RIDGE = 12.0
const GAL = 4.7 // the galleries' floor
const WING = 6.0
const COLS = [-8.6, -5.16, -1.72, 1.72, 5.16, 8.6].map((d) => XC + d)

/** A vertical wall a→b with its outside on the right (counter-clockwise ring), z0..z1. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  quadO(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [b[1] - a[1], a[0] - b[0], 0])
}

/** A hipped roof over an axis-aligned rectangle, ridge along its longer side. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, l = y1 - y0
  if (w >= l) {
    const h = l / 2, ym = (y0 + y1) / 2
    const A: V3 = [x0 + h, ym, zr], B: V3 = [x1 - h, ym, zr]
    quadO(p, [x0, y0, ze], [x1, y0, ze], B, A, [0, -1, 1])
    quadO(p, [x1, y1, ze], [x0, y1, ze], A, B, [0, 1, 1])
    triO(p, [x1, y0, ze], [x1, y1, ze], B, [1, 0, 1])
    triO(p, [x0, y1, ze], [x0, y0, ze], A, [-1, 0, 1])
  } else {
    const h = w / 2, xm = (x0 + x1) / 2
    const A: V3 = [xm, y0 + h, zr], B: V3 = [xm, y1 - h, zr]
    quadO(p, [x1, y0, ze], [x1, y1, ze], B, A, [1, 0, 1])
    quadO(p, [x0, y1, ze], [x0, y0, ze], A, B, [-1, 0, 1])
    triO(p, [x0, y0, ze], [x1, y0, ze], A, [0, -1, 1])
    triO(p, [x1, y1, ze], [x0, y1, ze], B, [0, 1, 1])
  }
}

type K = { brick: Part; white: Part; roof: Part; win: Part; shut: Part; door: Part; shade: Part }

/** A shuttered window on face f, centred at s: glass w wide, z0..z1, shutters each side. */
function windowAt(k: K, f: Face, s: number, w: number, z0: number, z1: number, shutters = true) {
  flatShape(k.win, f, [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]], 0.06)
  if (!shutters) return
  for (const d of [-1, 1]) {
    const a = s + d * (w / 2 + 0.05), b = s + d * (w / 2 + 0.6)
    flatShape(k.shut, f, [[Math.min(a, b), z0], [Math.max(a, b), z0], [Math.max(a, b), z1], [Math.min(a, b), z1]], 0.08)
  }
}

/** A door on face f centred at s: leaves z0..z1, a glazed fanlight above, a white surround. */
function doorAt(k: K, f: Face, s: number, w: number, z0: number, z1: number, fan: number) {
  flatShape(k.white, f, [[s - w / 2 - 0.35, z0], [s + w / 2 + 0.35, z0], [s + w / 2 + 0.35, z1 + fan + 0.3], [s - w / 2 - 0.35, z1 + fan + 0.3]], 0.04)
  flatShape(k.door, f, [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]], 0.08)
  flatShape(k.win, f, [[s - w / 2, z1 + 0.08], [s + w / 2, z1 + 0.08], [s + w / 2, z1 + fan], [s - w / 2, z1 + fan]], 0.08)
}

/** A portico: porch floor, six columns, gallery, entablature; s = -1 front (south), +1 back (north). */
function portico(k: K, s: number) {
  const yw = s < 0 ? YF : YB, yo = yw + s * 3.0, yc = yw + s * 2.4
  const y0 = Math.min(yw, yo), y1 = Math.max(yw, yo)
  const xa = COLS[0] - 0.75, xb = COLS[5] + 0.75
  box(k.white, xa, y0, xb, y1, 0, FLOOR, k.white, 0.1)
  for (const x of COLS) column(k.white, k.white, x, yc, 0.45, FLOOR, COL, { capH: 0.55, base: 0.3, ax: 1.15, ay: 1.15 })
  // the gallery: a floor slab between the columns and a solid white band for its railing
  box(k.white, xa + 0.4, y0, xb - 0.4, y1, GAL - 0.22, GAL, k.white)
  const ye = yc - s * 0.1
  box(k.white, xa + 0.4, Math.min(ye, ye + s * 0.12), xb - 0.4, Math.max(ye, ye + s * 0.12), GAL, GAL + 0.7, k.white)
  // entablature and cornice over the columns, back to the wall
  box(k.white, xa, y0, xb, y1 + (s > 0 ? 0 : 0), COL, ENT, null)
  capRing(k.white, rect(xa, y0, xb, y1), COL, false)
  box(k.white, xa - 0.25, s < 0 ? y0 - 0.25 : y0, xb + 0.25, s < 0 ? y1 : y1 + 0.25, ENT, CORN, s < 0 ? k.white : null, 0.1)
  if (s < 0) return
  // the back portico's pediment: a gable from the main roof out over the porch
  const xm = (xa + xb) / 2, hw = (xb - xa) / 2 + 0.25, yE = y1 + 0.25, yS = YB - 2.5
  quadO(k.roof, [xa - 0.25, yS, CORN], [xa - 0.25, yE, CORN], [xm, yE, PED], [xm, yS, PED], [-1, 0, 2])
  quadO(k.roof, [xb + 0.25, yE, CORN], [xb + 0.25, yS, CORN], [xm, yS, PED], [xm, yE, PED], [1, 0, 2])
  triO(k.white, [xm - hw, yE, CORN], [xm + hw, yE, CORN], [xm, yE, PED], [0, 1, 0])
  triO(k.white, [xm - hw, yE, CORN], [xm + hw, yE, CORN], [xm, yE, PED], [0, -1, 0])
}

function build() {
  const brick = new Part()
  const k: K = { brick, white: new Part(), roof: new Part(), win: new Part(), shut: new Part(), door: brick, shade: new Part() }

  // ------------------------------------------------------------ the wings (white fronts, brick elsewhere)
  const wings: XY[][] = [
    [[-15.4, -6.2], [-13.0, -10.1], [X0, -10.1], [X0, 10.7], [-8.5, 10.7], [-8.5, 14.5], [-15.2, 14.6]],
    [[X1, -10.1], [17.4, -10.1], [17.4, 6.0], [X1, 6.0]],
  ]
  for (const w of wings) {
    for (let i = 0; i < w.length; i++) {
      const a = w[i], b = w[(i + 1) % w.length]
      const front = b[1] < a[1] + 0.01 && Math.min(a[1], b[1]) < -5 && !(a[0] === b[0]) // faces looking south
      if (a[0] === b[0] && (a[0] === X0 || a[0] === X1)) continue // against the main block
      wall(front ? k.white : k.brick, a, b, 0, WING - 0.6)
      wall(k.white, a, b, WING - 0.6, WING)
    }
    capRing(k.roof, w, WING)
  }
  // the wings' windows: a big window on each white front, windows and a door on the ends
  windowAt(k, { o: [-11.4, -10.1, 0], n: [0, -1] }, 0, 1.9, 1.4, 3.8, false)
  windowAt(k, { o: [14.4, -10.1, 0], n: [0, -1] }, 0, 1.9, 1.4, 3.8, false)
  const eastEnd: Face = { o: [17.4, -2.0, 0], n: [1, 0] }
  doorAt(k, eastEnd, 0, 1.2, 0.4, 2.7, 0.5)
  windowAt(k, eastEnd, -4.2, 1.1, 1.3, 3.4)
  windowAt(k, eastEnd, 4.2, 1.1, 1.3, 3.4)
  const westEnd: Face = { o: [-15.3, 4.0, 0], n: [-1, 0] }
  for (const s of [-6.5, 0, 6.5]) windowAt(k, westEnd, s, 1.1, 1.3, 3.4)
  for (const s of [-3, 3]) windowAt(k, { o: [-11.8, 14.55, 0], n: [0, 1] }, s * 0.5, 1.0, 1.3, 3.2)
  windowAt(k, { o: [14.4, 6.0, 0], n: [0, 1] }, 0, 1.1, 1.3, 3.4)

  // ------------------------------------------------------------ the main block
  const main: XY[] = rect(X0, YF, X1, YB)
  for (let i = 0; i < 4; i++) {
    const a = main[i], b = main[(i + 1) % 4]
    wall(i === 0 ? k.shade : k.brick, a, b, 0, ENT - 0.6) // the front wall, in the portico's shade
  }
  prism(k.white, null, rect(X0 - 0.2, YF - 0.2, X1 + 0.2, YB + 0.2), ENT - 0.6, CORN)
  capRing(k.white, rect(X0 - 0.2, YF - 0.2, X1 + 0.2, YB + 0.2), ENT - 0.6, false)
  hip(k.roof, X0 - 0.2, YF - 0.2, X1 + 0.2, YB + 0.2, CORN, RIDGE)
  // four chimneys on the side walls, rising through the roof's edge
  for (const x of [X0 + 0.5, X1 - 0.5]) for (const y of [-3.6, 2.6]) {
    box(k.brick, x - 0.55, y - 0.85, x + 0.55, y + 0.85, ENT - 1, 14.0, null)
    box(k.brick, x - 0.7, y - 1.0, x + 0.7, y + 1.0, 14.0, 14.3, k.brick)
  }
  portico(k, -1)
  portico(k, 1)

  // ------------------------------------------------------------ doors and windows, five bays front and back
  const bays = [-6.8, -3.5, 3.5, 6.8]
  const F: Face = { o: [XC, YF, 0], n: [0, -1] }
  const B: Face = { o: [XC, YB, 0], n: [0, 1] }
  for (const f of [F, B]) {
    for (const s of bays) {
      windowAt(k, f, s, 1.2, FLOOR + 0.6, FLOOR + 3.2)
      windowAt(k, f, s, 1.2, GAL + 0.8, GAL + 3.0)
    }
    doorAt(k, f, 0, 1.5, FLOOR, FLOOR + 2.7, 0.6)
    doorAt(k, f, 0, 1.3, GAL + 0.95, GAL + 3.0, 0.4)
  }
  // the main block's sides above the wings: one upper window each
  windowAt(k, { o: [X0, 0, 0], n: [-1, 0] }, 0.5, 1.1, GAL + 1.6, GAL + 3.4)
  windowAt(k, { o: [X1, 0, 0], n: [1, 0] }, -0.5, 1.1, GAL + 1.6, GAL + 3.4)

  return finishGlb('The Hermitage', [
    { part: k.brick, material: finish('hermitage-brick', 0xb3705f) },
    { part: k.white, material: finish('hermitage-white', 0xf3ece0) },
    { part: k.roof, material: PALETTE.roof },
    { part: k.win, material: PALETTE.window },
    { part: k.shut, material: finish('hermitage-shutter', 0x4b6a5a) },
    { part: k.shade, material: finish('hermitage-white-shade', 0xc2b9a8) },
  ], { bearing: 0, height: 14.3, replaces: ['way/433258649'] }, 5000)
}

if (import.meta.main) await writeModel('nash-hermitage', build())
