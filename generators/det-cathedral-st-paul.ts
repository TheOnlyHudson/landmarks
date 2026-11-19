/**
 * Cathedral Church of St. Paul, Episcopal (4800 Woodward Avenue; 1908-11,
 * Ralph Adams Cram, Gothic Revival, limestone): procedural, CC0-1.0.
 * bun generators/det-cathedral-st-paul.ts
 *
 * Map frame: x, y, z up, metres, turned to the church: +y runs along bearing
 * 64 (east-north-east, the liturgical east), +x along 154 (towards Hancock
 * Street). The west front faces -y, onto Woodward. The anchor is the
 * centroid of the OSM outline way/68935841: 42.3562370, -83.0632739.
 *
 * Identity, in order: the west front on Woodward, its gable with a cross,
 * flanked by two square turrets that end in tall open pinnacles, the great
 * rose window over the deep pointed portal; the long nave under a grey
 * slate roof (grey in the Jameson photo; changed from green copper in review), its clerestory over buttressed aisles with low grey-metal
 * lean-to roofs and paired lancets; the squat square crossing tower (the
 * spire was never built); the transepts' gables with tall traceried windows;
 * the chancel beyond.
 *
 * Evidence:
 *  - plan: OSM way/68935841 (building=church, Q5052217 per the brief).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; heights over the ground on Woodward (2.5 m over the box
 *    minimum). Measured: the nave's ridge 21.7 on x = 0; the aisles' roofs
 *    11.0 at x = +-6..8; the crossing tower 25.7; the transept ridges about
 *    21; the west gable 23.3; the chancel's ridge 21.7, its south chapel
 *    10.2.
 *  - photo (EVIDENCE): Cathedral Church of Saint Paul.jpg, Andrew Jameson,
 *    CC BY-SA 3.0 (the west front and the south side from Woodward and
 *    Hancock): every opening, the turrets and pinnacles, the roofs' colours.
 *    https://commons.wikimedia.org/wiki/File:Cathedral_Church_of_Saint_Paul.jpg
 *  - published: Cram, Goodhue & Ferguson; consecrated 1911; the central
 *    tower was meant to carry a spire (Wikipedia, "Cathedral Church of St.
 *    Paul (Detroit)"; NRHP 82002912).
 *  Estimated from the photo scaled to the lidar: the nave's eaves (17.0),
 *  the rose window (radius 3.0, centre 14.2), the portal, the pinnacles (to
 *  27.5), window sizes.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only one licensed exterior photo exists (from the south-west);
 * the north side mirrors the south without its porch, and the chancel and
 * east end are drawn plainly from the lidar. The cathedral house and school
 * on the north are separate OSM buildings, left out. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY } from './chi-aon-center'
import { flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'
import { bbox, box, gable, pyramid, face, panels, side, sOf, R, saveModel, type Mat } from './det-detroit-institute-of-arts'

/** A pointed (equilateral) arch: jambs from z0, springing at zs. */
export function pointed(sc: number, w: number, z0: number, zs: number, segs = 4): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
const ptTop = (w: number, zs: number, d: number) => zs + Math.sqrt(Math.max(0, w * w - (Math.abs(d) + w / 2) ** 2))
type Dir = 's' | 'n' | 'e' | 'w'
/** A traceried lancet on a side: pale surround, window, n lights. */
export function lancet(trim: Part, win: Part, dir: Dir, c: number, at: number, w: number, z0: number, zs: number, n = 1, sur = 0.22) {
  const f = side(dir, c), sc = sOf(dir, at)
  if (sur > 0) flatShape(trim, f, pointed(sc, w + 2 * sur, Math.max(0, z0 - sur), zs), 0.03)
  flatShape(win, f, pointed(sc, w, z0, zs), 0.06)
  for (let k = 1; k < n; k++) { const d = -w / 2 + (w * k) / n; flatShape(trim, f, R(sc + d - 0.09, z0, sc + d + 0.09, ptTop(w, zs, d) - 0.15), 0.09) }
}

const NW = 4.2, AW = 8.8 // nave and aisle half-widths
const FY = -30.2, XY0 = 2.3, XY1 = 12.3, EY = 30.4 // front, crossing, east end
const NE = 17.0, NR = 21.7, AE = 11.2, AR = 12.8

function build(): Mat[] {
  const stone = new Part(), cu = new Part(), roof = new Part(), win = new Part(), trim = new Part(), door = new Part()

  // ---------------------------------------------------------------- nave, aisles, chancel
  box(stone, null, -NW, FY, NW, EY, 0, NE)
  gable(cu, null, -NW, FY + 1.5, NW, EY, NE, NR, 'y', 0.4)
  for (const s of [-1, 1]) {
    // aisles: walls, lean-to roofs from the outer eaves up to the clerestory
    const xo = s * AW, xi = s * NW
    box(stone, null, Math.min(xo, xi), FY, Math.max(xo, xi), XY0, 0, AE)
    face(roof, [[xo + s * 0.3, FY, AE - 0.2], [xo + s * 0.3, XY0, AE - 0.2], [xi, XY0, AR], [xi, FY, AR]], [s, 0, 1])
    face(stone, [[xo, FY, AE], [xi, FY, AE], [xi, FY, AR]], [0, -1, 0])
    // the chancel aisles, shorter, to y = 22
    box(stone, null, Math.min(s * 6.7, xi), XY1, Math.max(s * 6.7, xi), 22, 0, AE)
    face(roof, [[s * 7.0, XY1, AE - 0.2], [s * 7.0, 22, AE - 0.2], [xi, 22, AR - 1], [xi, XY1, AR - 1]], [s, 0, 1])
    // buttresses between the bays, with sloped tops; aisle and clerestory lancets
    const dir: Dir = s > 0 ? 'e' : 'w'
    for (let k = 0; k <= 6; k++) {
      const y = FY + 1.2 + k * 4.45
      const x0 = s > 0 ? AW : -AW - 1.3, x1 = s > 0 ? AW + 1.3 : -AW
      box(stone, null, x0, y - 0.5, x1, y + 0.5, 0, AE - 1.6)
      face(stone, [[s * (AW + 1.3), y - 0.5, AE - 1.6], [s * (AW + 1.3), y + 0.5, AE - 1.6], [s * AW, y + 0.5, AE + 0.4], [s * AW, y - 0.5, AE + 0.4]], [s, 0, 1])
      face(stone, [[s * AW, y - 0.5, AE + 0.4], [s * (AW + 1.3), y - 0.5, AE - 1.6], [s * AW, y - 0.5, AE - 1.6]], [0, -1, 0])
      face(stone, [[s * AW, y + 0.5, AE + 0.4], [s * (AW + 1.3), y + 0.5, AE - 1.6], [s * AW, y + 0.5, AE - 1.6]], [0, 1, 0])
      // clerestory buttresses (flying in reality), as piers on the aisle roof
      box(stone, stone, s > 0 ? NW : -NW - 0.8, y - 0.35, s > 0 ? NW + 0.8 : -NW, y + 0.35, AR - 0.3, NE - 0.6)
      if (k < 6) {
        const yc = y + 2.22
        lancet(trim, win, dir, s * AW, yc, 1.9, 2.4, 6.2, 2)
        lancet(trim, win, dir, s * NW, yc, 1.7, AR + 0.6, 14.9, 2, 0)
      }
    }
  }
  // the south door with its pointed hood, and the side porch near the front
  lancet(trim, door, 'e', AW, FY + 7.8, 1.5, 0, 2.7, 1, 0.45)
  box(stone, null, AW, FY + 14.4, AW + 2.8, FY + 18.6, 0, 6.4)
  gable(roof, stone, AW, FY + 14.4, AW + 3.1, FY + 18.6, 6.4, 8.6, 'x', 0.2)
  lancet(trim, door, 'e', AW + 2.8, FY + 16.5, 1.4, 0, 2.6, 1, 0.35)

  // ---------------------------------------------------------------- the transepts and the crossing tower
  box(stone, null, -13.6, XY0, 14.0, XY1, 0, NE)
  gable(cu, stone, -13.6, XY0, 14.0, XY1, NE, NR - 0.6, 'x', 0.4)
  for (const [dir, c] of [['e', 14.0], ['w', -13.6]] as [Dir, number][]) {
    lancet(trim, win, dir, c, 7.3, 3.4, 4.0, 13.2, 3, 0.3)
    panels(win, dir, c, [5.4, 9.2], 1.0, 1.2, 3.0, 0.05)
  }
  {
    const T0 = 4.9, TT = 25.7
    bbox(stone, stone, -T0, XY0 + 0.1, T0, XY1 - 0.1, NE, TT - 0.6, 0.15)
    bbox(trim, stone, -T0 - 0.25, XY0 - 0.15, T0 + 0.25, XY1 + 0.15, TT - 0.6, TT, 0.15)
    for (const [dir, c, m] of [['s', XY0 + 0.1, 0], ['n', XY1 - 0.1, 0], ['e', T0, 7.3], ['w', -T0, 7.3]] as [Dir, number, number][]) {
      for (const d of [-1.3, 1.3]) lancet(trim, win, dir, c, m + d, 0.9, 20.4, 23.0, 1, 0.12)
    }
  }
  // the east end: a gable over the chancel, a tall window
  face(stone, [[-NW, EY, NE], [NW, EY, NE], [0, EY, NR]], [0, 1, 0])
  lancet(trim, win, 'n', EY, 0, 3.0, 6.0, 13.5, 3, 0.25)
  // the south chapel
  box(stone, roof, NW, 12.3, 12.5, 21.0, 0, 10.2)
  for (const y of [14.5, 18.8]) lancet(trim, win, 'e', 12.5, y, 1.4, 3.0, 7.0, 2)

  // ---------------------------------------------------------------- the west front
  {
    const f = side('s', FY - 0.6)
    // the gable rising over the nave roof, with a cross
    box(stone, null, -NW - 0.6, FY - 0.6, NW + 0.6, FY + 1.5, 0, NE + 1.0)
    face(stone, [[-NW - 0.6, FY - 0.6, NE + 1.0], [NW + 0.6, FY - 0.6, NE + 1.0], [0, FY - 0.6, 23.3]], [0, -1, 0])
    face(stone, [[-NW - 0.6, FY + 1.5, NE + 1.0], [NW + 0.6, FY + 1.5, NE + 1.0], [0, FY + 1.5, 23.3]], [0, 1, 0])
    for (const s of [-1, 1]) face(stone, [[s * (NW + 0.6), FY - 0.6, NE + 1.0], [0, FY - 0.6, 23.3], [0, FY + 1.5, 23.3], [s * (NW + 0.6), FY + 1.5, NE + 1.0]], [s, 0, 1])
    box(stone, stone, -0.15, FY - 0.3, 0.15, FY + 0.3, 23.2, 25.3)
    box(stone, stone, -0.75, FY - 0.3, 0.75, FY + 0.3, 24.2, 24.55)
    // the rose window in its deep pointed arch, the portal beneath
    flatShape(trim, f, pointed(0, 7.6, 9.6, 13.6, 6), 0.05)
    flatShape(stone, f, pointed(0, 6.8, 9.6, 13.6, 6), 0.0)
    const ring = arc(0, 14.2, 3.0, 0, 360, 16).slice(0, 16)
    flatShape(win, f, ring, 0.08)
    for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3, dx = Math.cos(a), dz = Math.sin(a), b = 0.13; flatShape(trim, f, [[-dx * 3 - dz * b, 14.2 - dz * 3 + dx * b], [dx * 3 - dz * b, 14.2 + dz * 3 + dx * b], [dx * 3 + dz * b, 14.2 + dz * 3 - dx * b], [-dx * 3 + dz * b, 14.2 - dz * 3 - dx * b]], 0.11) }
    flatShape(trim, f, arc(0, 14.2, 0.9, 0, 360, 8).slice(0, 8), 0.12)
    // the portal: a deep pointed arch with a gabled hood and the doors
    box(stone, null, -3.6, FY - 2.2, 3.6, FY - 0.6, 0, 8.6)
    face(stone, [[-3.6, FY - 2.2, 8.6], [3.6, FY - 2.2, 8.6], [0, FY - 2.2, 10.6]], [0, -1, 0])
    for (const s of [-1, 1]) face(stone, [[s * 3.6, FY - 2.2, 8.6], [0, FY - 2.2, 10.6], [0, FY - 0.6, 10.6], [s * 3.6, FY - 0.6, 8.6]], [s, 0, 1])
    const pf = side('s', FY - 2.2)
    flatShape(trim, pf, pointed(0, 4.8, 0, 5.2, 5), 0.04)
    flatShape(win, pf, pointed(0, 3.6, 0, 4.8, 5), 0.08)
    // the corner buttresses, stepped
    for (const s of [-1, 1]) {
      const x0 = s > 0 ? AW - 1.4 : -AW, x1 = s > 0 ? AW : -AW + 1.4
      box(stone, stone, x0, FY - 1.8, x1, FY, 0, 7.0)
      face(stone, [[x0, FY - 1.8, 7.0], [x1, FY - 1.8, 7.0], [x1, FY, 9.0], [x0, FY, 9.0]], [0, -1, 1])
      lancet(trim, win, 's', FY, s * 6.6, 1.0, 3.6, 6.4, 1, 0.12)
    }
    // the two turrets: square shafts to 20.5, an open belfry stage, tall pinnacles
    for (const s of [-1, 1]) {
      const cx = s * (NW + 0.9), x0 = cx - 1.3, x1 = cx + 1.3, y0 = FY - 0.8, y1 = FY + 1.8
      bbox(stone, stone, x0, y0, x1, y1, 0, 20.5, 0.15)
      bbox(stone, null, x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, 20.5, 23.0, 0.1)
      panels(win, 's', y0 + 0.2, [cx], 0.9, 20.9, 22.6, 0.04)
      pyramid(stone, x0 + 0.1, y0 + 0.1, x1 - 0.1, y1 - 0.1, 23.0, 27.5)
      lathe(stone, cx, (y0 + y1) / 2, [[0.12, 27.4], [0.12, 28.3]], 4)
      box(stone, stone, cx - 0.4, (y0 + y1) / 2 - 0.08, cx + 0.4, (y0 + y1) / 2 + 0.08, 27.9, 28.1)
    }
    // the parapet band across the front over the rose
    extrudeShape(trim, f, R(-NW - 0.6, NE + 0.6, NW + 0.6, NE + 1.0), 0, 0.25)
  }

  return [
    { part: stone, material: { ...finish('st-paul-limestone', 0xd6c9bb), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : p[1] < -28 && n[1] < -0.5 ? 1 : 0.2) } },
    { part: cu, material: finish('st-paul-slate', 0x80868c) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('st-paul-trim', 0xeadfd2) },
    { part: door, material: finish('st-paul-red-door', 0xa8463c) },
  ]
}

if (import.meta.main) await saveModel('det-cathedral-st-paul', 'Cathedral Church of St. Paul', [42.356237, -83.0632739], 64, build(), 5000)
