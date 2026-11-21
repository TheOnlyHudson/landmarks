/**
 * Trinity Episcopal Cathedral, 1100 Sumter Street, Columbia, SC (1847,
 * Edward Brickell White; Gothic Revival after York Minster's west front,
 * stuccoed brick), with the parish buildings OSM draws in the same
 * relation: procedural, CC0-1.0.
 * bun generators/cola-trinity-cathedral.ts [out.glb]
 *
 * Also holds helpers shared by the other Columbia churches
 * (cola-first-presbyterian-church, cola-first-baptist-church,
 * cola-st-peters-church, cola-main-street-umc): merge this one first.
 *
 * Identity: OSM relation/18539487 (building=church, wikidata Q2453562).
 * The relation is one multipolygon of two outers: way/1350536194 is the
 * cathedral joined to its parish complex south-east and east of it (with
 * courtyards as inners), way/1350536200 a separate flat-roofed 3-storey
 * block 60 m to the north-east. Replacing the relation hides all of it,
 * so the model draws the cathedral in full and the rest as plain masses.
 *
 * Map frame: x toward 160°, y toward 70° (bearing 70: every OSM edge runs
 * at 70° / 160°), z up, metres. Origin: the cathedral's crossing,
 * (-81.03116, 34.00118); the west front (on Sumter Street) faces -y.
 *
 * Heights: USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m
 * grid, read in this frame (measured, local ground ~1.8 m above the crop
 * minimum): tower parapets 21.6, nave ridge 12.7 over a clerestory 8.4 m
 * wide, aisle roofs ~7, transept and chancel ridges ~12.3; parish complex
 * 8.5–10.5 (one height 9.5 used); north block 13.3.
 * Front proportions from photo p1 (frontal, little convergence), scaled
 * to the OSM front width (20 m, x -9.5…10.4): towers 6.7 m wide, centre
 * bay 6.6 m; string courses 7.3 and 12.1; lancets 2.2–5.8, 7.5–11.2,
 * belfry louvres 14.5–18.6; great west window 3.8 wide, 5.7–10.9; centre
 * gable 13.0 at the eaves, 14.0 at the apex, cross to 17.6; corner
 * pinnacles to 26.5 (estimated, photo-scaled; lidar's thin tips read 23.7).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/cola/work/cola-trinity-cathedral/photos):
 *  p1 "Trinity Episcopal Cathedral, Columbia SC, West view 20160702 1.jpg",
 *     DXR, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Trinity_Episcopal_Cathedral,_Columbia_SC,_West_view_20160702_1.jpg
 *  p2 "Trinity Episcopal Cathedral - Columbia, South Carolina.jpg",
 *     Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Trinity_Episcopal_Cathedral_-_Columbia,_South_Carolina.jpg
 *  p3 "Trinity Episcopal Cathedral (Columbia, SC).jpg", Thomas Kirchel,
 *     CC BY 4.0, https://commons.wikimedia.org/wiki/File:Trinity_Episcopal_Cathedral_(Columbia,_SC).jpg
 * Aerial: USGS NAIP (public domain): cross plan, pale grey roofs, towers.
 *
 * Left out: the blind lancet panels on the buttresses, the hood moulds,
 * the porch's gate piers and lanterns, the railings, the finials' crockets.
 * Doubts: every photo shows the west front; the flanks, transept ends and
 * chancel are unphotographed and drawn plain from lidar and NAIP (aisle
 * lancets, one three-light window per transept end, invented). The
 * parish complex is one plain height with window bands; its pitched
 * chapel roofs are flattened. The north block's identity is uncertain
 * (OSM puts it in the cathedral's relation).
 * Colours: stucco 0xe3d2b8 (warm sand, p1 in sun); roof grey (NAIP);
 * parish buildings orange-brown brick 0xc9a58a (p3, right edge).
 */
import clipping from 'polygon-clipping'
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, ccw, triangulate, prism, rect, flatShape, extrudeShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'
import { lancet, pinnacle, wingWindows } from './ral-first-baptist-church'

// ============================================================ shared helpers (Columbia churches)

/** A flat-topped mass over a ring with courtyards: walls out and in, roof with holes (cut into hole-free strips at each courtyard's middle). */
export function holedPrism(wall: Part, roof: Part, outer: XY[], holes: XY[][], z0: number, z1: number) {
  const o = ccw(outer)
  prism(wall, null, o, z0, z1)
  for (const h of holes) prism(wall, null, [...ccw(h)].reverse(), z0, z1)
  const cuts = holes.map((h) => h.reduce((s, p) => s + p[0], 0) / h.length).sort((a, b) => a - b)
  const xs = [-1e4, ...cuts, 1e4]
  const poly: [number, number][][] = [o.map((p) => [p[0], p[1]] as [number, number]), ...holes.map((h) => ccw(h).map((p) => [p[0], p[1]] as [number, number]))]
  for (let k = 0; k + 1 < xs.length; k++) {
    const band: [number, number][][] = [[[xs[k], -1e4], [xs[k + 1], -1e4], [xs[k + 1], 1e4], [xs[k], 1e4]]]
    for (const piece of clipping.intersection(poly as any, band as any)) {
      const r = ccw(piece[0].map((p) => [p[0], p[1]] as XY))
      for (const [a, b, c] of triangulate(r)) roof.tri([r[a][0], r[a][1], z1], [r[b][0], r[b][1], z1], [r[c][0], r[c][1], z1])
    }
  }
}
/** The four faces of an axis-aligned box, outward, origins at each face centre (s runs along the face). */
export function boxFaces(x0: number, y0: number, x1: number, y1: number): Face[] {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  return [
    { o: [cx, y0, 0], n: [0, -1] },
    { o: [x1, cy, 0], n: [1, 0] },
    { o: [cx, y1, 0], n: [0, 1] },
    { o: [x0, cy, 0], n: [-1, 0] },
  ]
}
/** A small gablet (triangle) standing proud of a face. */
export function gablet(p: Part, f: Face, s: number, w: number, z: number, h: number, d0: number, d1: number) {
  extrudeShape(p, f, [[s - w / 2, z], [s + w / 2, z], [s, z + h]], d0, d1)
}
/** An octagonal spire from radius r (across the corners) at z0 to a point at z1, with a cross. */
export function spire(p: Part, cross: Part, cx: number, cy: number, r: number, z0: number, z1: number, crossH = 0) {
  lathe(p, cx, cy, [[r, z0], [r * 0.04, z1]], 8, 22.5, 382.5)
  if (crossH <= 0) return
  const t = Math.max(0.16, crossH * 0.09)
  box(cross, cx - t / 2, cy - t / 2, cx + t / 2, cy + t / 2, z1 - 0.2, z1 + crossH)
  box(cross, cx - crossH * 0.3, cy - t / 2, cx + crossH * 0.3, cy + t / 2, z1 + crossH * 0.58, z1 + crossH * 0.58 + t)
}
/** Merlons along a face's top edge from s0 to s1 (crenellated parapet). */
export function crenels(p: Part, f: Face, s0: number, s1: number, z: number, h: number, w = 0.6, gap = 0.6, d = 0.35) {
  const n = Math.max(1, Math.floor((s1 - s0 + gap) / (w + gap)))
  const used = n * w + (n - 1) * gap, start = s0 + (s1 - s0 - used) / 2
  for (let k = 0; k < n; k++) {
    const s = start + k * (w + gap)
    extrudeShape(p, f, [[s, z], [s + w, z], [s + w, z + h], [s, z + h]], -d, 0)
  }
}
/** A slender pinnacle: a square shaft (side a) z0..z1 in `shaft`, a thin square spike to z2 in `tip`. */
export function spike(shaft: Part, tip: Part, x: number, y: number, a: number, z0: number, z1: number, z2: number) {
  box(shaft, x - a / 2, y - a / 2, x + a / 2, y + a / 2, z0, z1)
  lathe(tip, x, y, [[a * 0.62, z1], [0.02, z2]], 4, 45, 405)
}
export { lancet, pinnacle, wingWindows }

// ============================================================ dimensions
const XC = 0.45 // the front's centre line
const FY = -23.0 // tower fronts
const TW = 6.7, TD = 6.9 // tower width, depth
const TCX = [XC - 6.65, XC + 6.65]
const PAR = 21.6 // tower parapet cornice
const NY0 = -16.1, NY1 = -3.0 // nave
const NHW = 4.2, AX0 = -8.4, AX1 = 8.7 // clerestory half width, aisle walls
const NEAVE = 11.0, NRIDGE = 12.7, AEAVE = 6.0, ATOP = 7.2
const TY0 = -3.0, TY1 = 10.0, TX0 = -13.7, TX1 = 13.6, TEAVE = 9.5, TRIDGE = 12.5 // transepts
const CX0 = -6.5, CX1 = 7.4, CY1 = 17.5 // chancel

// the parish complex: way/1350536194 east of the cathedral, closed along x = 13.6
const COMPLEX: XY[] = [[13.6, 19.4], [14.2, 19.4], [14.2, 27.7], [14.9, 27.7], [14.9, 33.0], [14.8, 34.9], [-0.5, 34.8], [-1.4, 35.7], [-1.5, 42.7], [-9.6, 42.5], [-9.6, 38.5], [-17.8, 38.4], [-17.9, 40.6], [-26.4, 40.5], [-26.7, 62.8], [-27.5, 63.6], [-27.6, 65.1], [-26.6, 66.1], [-26.6, 69.2], [-17.4, 69.2], [-17.4, 72.1], [-16.6, 73.1], [-14.9, 73.0], [-14.3, 72.2], [-14.3, 70.8], [-10.6, 70.9], [-10.6, 82.9], [8.7, 83.0], [8.7, 83.5], [9.6, 84.5], [12.2, 84.5], [13.0, 83.5], [13.0, 82.8], [17.3, 82.8], [17.4, 45.9], [43.3, 46.1], [43.3, 46.5], [50.7, 46.5], [50.8, 36.1], [45.5, 36.0], [45.5, 30.8], [50.7, 30.8], [50.7, 11.9], [43.5, 11.9], [43.6, 10.1], [39.9, 10.1], [39.9, 11.9], [17.4, 11.8], [17.4, 7.0], [19.6, 7.0], [19.6, 3.9], [13.6, 3.9]]
const COURTS: XY[][] = [
  [[13.9, 46.2], [13.7, 67.3], [-3.6, 67.0], [-3.4, 46.4], [-1.4, 46.5], [-0.8, 47.1], [0.5, 47.2], [1.8, 46.1]], // way/1350536199
  [[23.8, 33.5], [27.9, 33.5], [27.9, 35.4], [37.7, 35.5], [37.7, 30.8], [23.8, 30.7]], // way/1350536198
]
// the north block, way/1350536200
const NORTH: XY[] = [[-36.3, 47.1], [-36.4, 70.5], [-34.8, 70.5], [-34.8, 79.4], [-36.3, 79.4], [-36.3, 91.8], [-49.8, 91.7], [-49.8, 93.4], [-54.6, 93.4], [-54.6, 91.7], [-62.1, 91.6], [-63.2, 92.9], [-65.7, 92.9], [-66.6, 91.8], [-67.3, 91.8], [-67.3, 83.3], [-68.5, 83.3], [-68.4, 71.6], [-69.6, 70.5], [-69.5, 68.3], [-68.4, 67.4], [-68.4, 55.2], [-67.1, 55.2], [-67.1, 46.9]]

function build() {
  const stucco = new Part(), roof = new Part(), win = new Part(), dark = new Part(), brick = new Part()

  // ============================================================ the twin towers
  for (const cx of TCX) {
    const x0 = cx - TW / 2, x1 = cx + TW / 2, y0 = FY, y1 = FY + TD
    box(stucco, x0, y0, x1, y1, 0, PAR)
    // string courses and the parapet band
    for (const [z, t] of [[7.3, 0.3], [12.1, 0.3], [PAR, 0.7]] as [number, number][]) box(stucco, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, z, z + t, stucco)
    // clasping corner buttresses, stepping in twice, each step under a gablet (p1)
    const steps: [number, number, number][] = [[0, 6.9, 0.75], [6.9, 12.5, 0.55], [12.5, 17.2, 0.4]]
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const px = sx < 0 ? x0 : x1, py = sy < 0 ? y0 : y1
      for (const [z0, z1, a] of steps) box(stucco, px - a, py - a, px + a, py + a, z0, z1)
    }
    const faces = boxFaces(x0, y0, x1, y1)
    for (const f of faces) {
      const half = (f.n[0] === 0 ? TW : TD) / 2
      for (const s of [-half, half]) for (const [, z1, a] of steps) gablet(stucco, f, s, a * 2 + 0.1, z1, 0.9, -0.1, a)
      // corner and mid-face pinnacles on the parapet
      spike(stucco, dark, f.o[0] + f.n[0] * -0.35, f.o[1] + f.n[1] * -0.35, 0.5, PAR + 0.7, PAR + 1.7, PAR + 3.9)
    }
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const px = (sx < 0 ? x0 : x1) - sx * 0.45, py = (sy < 0 ? y0 : y1) - sy * 0.45
      spike(stucco, dark, px, py, 0.7, PAR + 0.7, PAR + 2.2, PAR + 4.9)
    }
    // the three tiers of lancets on the front and the outer side (p1, p2)
    const outer = cx < XC ? faces[3] : faces[1]
    for (const f of [faces[0], outer]) {
      lancet(win, null, f, 0, 1.45, 2.2, 4.8)
      lancet(win, null, f, 0, 1.45, 7.6, 10.2)
      lancet(dark, null, f, 0, 1.4, 14.5, 17.6)
    }
    // belfry louvres on the inner and back faces too
    for (const f of [faces[2], cx < XC ? faces[1] : faces[3]]) lancet(dark, null, f, 0, 1.4, 14.5, 17.6)
  }

  // ============================================================ the centre bay: gable, great window, porch
  {
    const x0 = TCX[0] + TW / 2, x1 = TCX[1] - TW / 2, y = -20.5
    prismY(stucco, y, NY0 + 0.5, [[x0, 0], [x1, 0], [x1, 13.0], [XC, 14.0], [x0, 13.0]])
    const f: Face = { o: [XC, y, 0], n: [0, -1] }
    lancet(win, stucco, f, 0, 3.8, 5.7, 8.9, 4)
    // the cross on the gable (p1)
    box(dark, XC - 0.14, y + 0.2, XC + 0.14, y + 0.5, 14.0, 17.6)
    box(dark, XC - 0.95, y + 0.2, XC + 0.95, y + 0.5, 16.1, 16.4)
    // porch: a shallow roofed bay across the centre, the door in a pointed stone surround
    box(stucco, x0, -22.6, x1, y, 0, 0.8)
    box(roof, x0 - 0.1, -23.2, x1 + 0.1, y, 5.2, 5.5)
    for (const sx of [x0 + 0.35, x1 - 0.35]) box(stucco, sx - 0.3, -23.0, sx + 0.3, -22.4, 0, 5.2)
    extrudeShape(stucco, f, [[-1.6, 0.8], [1.6, 0.8], [1.6, 3.4], [0.9, 4.5], [0, 4.9], [-0.9, 4.5], [-1.6, 3.4]], 0, 0.2)
    flatShape(dark, { o: [XC, y - 0.2, 0], n: [0, -1] }, [[-1.0, 0.8], [1.0, 0.8], [1.0, 3.3], [0.5, 4.0], [0, 4.25], [-0.5, 4.0], [-1.0, 3.3]], 0.05)
  }

  // ============================================================ nave and aisles
  prismY(stucco, NY0, NY1, [[XC - NHW, 0], [XC + NHW, 0], [XC + NHW, NEAVE], [XC, NRIDGE], [XC - NHW, NEAVE]])
  roofY(roof, NY0, NY1, XC, NHW, NEAVE + 0.1, NRIDGE + 0.1, 0.3, 0.25)
  for (const [xa, xb] of [[AX0, XC - NHW], [XC + NHW, AX1]]) {
    box(stucco, xa, NY0, xb, NY1, 0, AEAVE, null)
    const outerX = xa === AX0 ? xa : xb, innerX = xa === AX0 ? xb : xa
    prismY(roof, NY0, NY1, [[outerX - Math.sign(innerX - outerX) * 0.3, AEAVE - 0.05], [innerX, ATOP], [innerX, ATOP - 0.25], [outerX - Math.sign(innerX - outerX) * 0.3, AEAVE - 0.3]])
  }
  // aisle bays: buttresses and lancets; small clerestory lancets above
  for (let k = 0; k < 4; k++) {
    const y = NY0 + 1.64 + k * 3.27
    for (const [x, n] of [[AX0, -1], [AX1, 1]] as [number, number][]) {
      lancet(win, null, { o: [x, y, 0], n: [n, 0] }, 0, 1.3, 1.6, 4.3)
      lancet(win, null, { o: [XC + n * NHW, y, 0], n: [n, 0] }, 0, 1.0, 7.8, 9.6)
    }
    if (k < 3) for (const x of [AX0 - 0.55, AX1]) box(stucco, x, y + 1.35, x + 0.55, y + 1.9, 0, AEAVE + 0.3)
  }

  // ============================================================ transepts and chancel
  prismX(stucco, TX0, TX1, [[TY0, 0], [TY1, 0], [TY1, TEAVE], [(TY0 + TY1) / 2, TRIDGE], [TY0, TEAVE]])
  roofX(roof, TX0 - 0.3, TX1 + 0.3, (TY0 + TY1) / 2, (TY1 - TY0) / 2, TEAVE + 0.1, TRIDGE + 0.1, 0.3, 0.25)
  for (const [x, n] of [[TX0, -1], [TX1, 1]] as [number, number][]) {
    lancet(win, stucco, { o: [x, (TY0 + TY1) / 2, 0], n: [n, 0] }, 0, 3.0, 2.6, 7.0, 3)
    for (const yy of [TY0, TY1]) box(stucco, x - 0.4, yy - 0.4, x + 0.4, yy + 0.4, 0, TEAVE + 0.6)
  }
  for (const y of [TY0, TY1]) for (const x of [TX0 + 2.6, TX1 - 2.6]) lancet(win, null, { o: [x, y, 0], n: [0, y === TY0 ? -1 : 1] }, 0, 1.4, 2.0, 6.0)
  const chw = (CX1 - CX0) / 2, ccx = (CX0 + CX1) / 2
  prismY(stucco, TY1 - 0.5, CY1, [[CX0, 0], [CX1, 0], [CX1, TEAVE], [ccx, 12.3], [CX0, TEAVE]])
  roofY(roof, TY1, CY1 + 0.3, ccx, chw, TEAVE + 0.1, 12.4, 0.3, 0.25)
  prism(stucco, roof, ccw([[-3.6, CY1], [3.8, CY1], [2.9, 18.9], [1.2, 19.8], [-0.9, 19.8], [-3.0, 18.9]]), 0, 8.0)
  for (const y of [11.8, 15.4]) for (const [x, n] of [[CX0, -1], [CX1, 1]] as [number, number][]) lancet(win, null, { o: [x, y, 0], n: [n, 0] }, 0, 1.2, 7.0, 8.4)
  // vestry and sacristy blocks beside the chancel
  box(stucco, -8.6, TY1, CX0, 22.0, 0, 7.5, roof)
  box(stucco, -3.9, CY1, -3.6, 22.0, 0, 7.5, roof)
  box(stucco, CX1, TY1, 13.6, 19.4, 0, 6.5, roof)
  box(stucco, 3.8, CY1, 7.7, 19.4, 0, 6.5, roof)
  panel(win, { o: [-8.6, 16, 0], n: [-1, 0] }, 0, 1.4, 1.5, 5.0)

  // ============================================================ the parish complex and the north block
  // CHURCH_ONLY=1 leaves these out, for close-up renders against the photos
  if (!process.env.CHURCH_ONLY) {
  holedPrism(brick, roof, COMPLEX, COURTS, 0, 9.5)
  wingWindows(win, ccw(COMPLEX), [[1.2, 3.6], [5.0, 7.8]], 3.8, 2.2, 6)
  holedPrism(brick, roof, NORTH, [], 0, 13.3)
  wingWindows(win, ccw(NORTH), [[1.2, 3.6], [5.0, 7.6], [8.8, 11.6]], 3.8, 2.2, 6)
  }

  return finishGlb('Trinity Episcopal Cathedral', [
    { part: stucco, material: finish('trinity-stucco', 0xe3d2b8) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('trinity-wood', 0x6a5546) },
    { part: brick, material: finish('trinity-brick', 0xc9a58a) },
  ], { bearing: 70, height: PAR + 4.9, replaces: ['relation/18539487'] }, 6500)
}

if (import.meta.main) await writeModel('cola-trinity-cathedral', build())
