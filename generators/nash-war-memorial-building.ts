/**
 * War Memorial Building and Auditorium, Nashville (1925, Edward Dougherty
 * with McKim, Mead & White as consultants): procedural, CC0-1.0.
 * bun generators/nash-war-memorial-building.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332.3: +y is
 * the building's long axis (the OSM walls run at 152.3°/62.3°), +x faces the
 * plaza on the 6th Avenue side, where the pedimented portico is. Origin: the
 * centroid of the outer ring of OSM relation/1762286 (-86.7837531,
 * 36.1643448), the middle of the building; the plan is symmetric about
 * y = 0, as the real one is.
 * y = 0 is the lowest ground under the footprint: the plaza on the east
 * side (Mapterhorn 159.5 m; lidar 12.3 m above its ground_min of 147.24 m).
 * The street on the west (7th Avenue) is 1.1–2.4 m higher.
 *
 * OSM: relation/1762286 "War Memorial Auditorium" (Q7968470), a
 * multipolygon: outer way/130913041, 35.4 × 117.6 m; inner way/130913057,
 * the open court, about 16 × 31 m. No building:part, no heights. The
 * portico and its steps stand east of the outline (lidar and photos);
 * nothing else in OSM lies under them.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, tools/lidar_frame.py at
 * bearing 332.3, above y = 0: wing parapets 17.1; wing roofs rising to 18.1
 * on their centre lines (a low hip); the court's floor 3.6; the ranges round
 * the court (west range, the bands at the wings' court ends, the screens
 * beside the portico) 15.9; the portico's ridge 21.1 at y = 0, its eaves
 * 18.2, its front about 3.5 m east of the outline (x 21.2), over y ±11.
 *
 * Court deck height: estimated from photo w10 (the portico frontal, from
 * the plaza): the steps take 100 px against 570 px from the plaza to the
 * portico's cornice top (lidar 18.2, the plaza 0.9 above y = 0), so the
 * portico floor and court deck stand 3.0 m above the plaza, 3.9 above
 * y = 0. Lidar reads the court's paving at 3.6; drawn at 3.8.
 * Same scaling: portico columns 11.7 m (3.8 → 15.5), entablature 2.6 m.
 * Wings, from w01 and w02 against the lidar parapet: podium storey to 3.8,
 * columns to 13.0, entablature to 15.2, plain attic to 17.1; window rows in
 * each bay 4.3–7.4, 8.2–10.3, 11.3–12.9 (w01).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-war-memorial-building/photos):
 *  w02, w03, w05, w06, w07, w09: "War Memorial Building, Legislative Plaza,
 *      Nashville, TN" (Flickr 54385244619, 54385289438, 54385052711,
 *      54384173347, 54385289553, 54385249614), Warren LeMay, CC BY-SA 2.0,
 *      2025, after the plaza's rebuilding: the wings' colonnades in antis
 *      (eight columns on each long side, six on each end), the attic, the
 *      portico (six Doric columns, pediment with a roundel and acroteria),
 *      the court seen through it, the steps.
 *  w01 "War Memorial Building Nashville 2022.jpg", Antony-22, CC BY-SA 4.0:
 *      a six-column face with three window rows per bay.
 *  w10, w11 "War Memorial Auditorium Nashville TN 2013-07-20 003/004.jpg",
 *      Thomas R Machnitzki, CC BY 3.0: the portico frontal (before the
 *      plaza's rebuilding; the portico and steps are unchanged).
 *  w12 postcard "War Memorial Building, Nashville, Tenn (74056).jpg",
 *      public domain: the whole east front, wing colonnades either side.
 *  NAIP (USGS, public domain): the plan, the court, grey roofs.
 *
 * Estimated: the column spacing (from the counts), the solid corner
 * piers (6.4 m on the long sides, 6.1 m on the ends, from w02/w05), the colonnade recesses
 * (1.6 m), the court colonnades (Doric, on the court's west, north and
 * south sides, as w06 and w10 show through the portico), the portico's
 * depth (it runs back to the court, w06) and return columns, the steps.
 * Doubts: the west face of the middle range (7th Avenue) is drawn with six
 * columns in antis like the ends; w01 may show it, but the photo's side is
 * not certain. Which wing holds the auditorium does not change the outside.
 * Left out: triglyphs, the pediment's roundel and sculpture, the
 * inscription, the Victory statue in the court, lamps, railings.
 * Night: no night photo found, so the stone stays unlit and only the
 * windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, slabRing, panel, column, gable, quadO, triO } from './nash-tennessee-state-capitol'

/** A part that turns and moves everything drawn into it, then hands it on. */
class Moved extends Part {
  constructor(private target: Part, private f: (p: V3) => V3, private g: (n: V3) => V3) { super() }
  override tri(a: V3, b: V3, c: V3, ua?: number[], ub?: number[], uc?: number[], n?: V3[]) {
    this.target.tri(this.f(a), this.f(b), this.f(c), ua, ub, uc, n?.map(this.g))
  }
}

const HX = 17.7, HY = 58.8 // OSM outer ring
const CX = 7.8, CY = 15.2 // the court and middle ranges (OSM inner ring, lidar)
const DECK = 3.8, COL = 13.0, CORN = 14.5, ENT = 15.2, PARA = 17.1, HIP = 18.1
const MID = 15.9 // the ranges round the court (lidar)
const PX = 21.2, PY = 11.0, PCOL = 15.5, PENT = 18.2, PRIDGE = 21.1 // portico
const REC = 1.6 // depth of the colonnade recesses

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shade = new Part()
  const back = (f: Face, s0: number, s1: number, z0: number, z1: number) => flatShape(shade, f, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], 0.03)
  const doric = (x: number, y: number, r = 0.75, z0 = DECK, z1 = COL) => column(trim, trim, x, y, r, z0, z1, { base: 0, capH: 0.55, ax: r * 2.5, ay: r * 2.5, segs: 10 })
  /** A row of bays in a recess: windows (three rows) on the recessed wall. */
  const bays = (f: Face, s0: number, s1: number, n: number) => {
    back(f, s0, s1, DECK, COL)
    const w = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + w * (k + 0.5)
      panel(win, f, s, 1.6, 4.3, 7.4)
      panel(win, f, s, 1.6, 8.2, 10.3)
      panel(win, f, s, 1.6, 11.3, 12.9)
    }
  }

  // ---------------------------------------------------------- the two wings
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? CY : -HY, y1 = s > 0 ? HY : -CY
    const yIn = s * CY, yOut = s * HY
    const full = rect(-HX, y0, HX, y1)
    // podium storey, with a band at the deck
    prism(stone, null, full, 0, DECK - 0.35)
    prism(trim, null, chamfer(rect(-HX - 0.12, y0 - (s < 0 ? 0.12 : 0), HX + 0.12, y1 + (s > 0 ? 0.12 : 0)), 0.15), DECK - 0.35, DECK)
    // the recessed core and the solid piers framing each colonnade
    const ry0 = s > 0 ? CY + 2.4 : -HY + 6.4, ry1 = s > 0 ? HY - 6.4 : -CY - 2.4 // long-side recess
    prism(stone, null, rect(-HX + REC, s > 0 ? y0 : y0 + REC, HX - REC, s > 0 ? y1 - REC : y1), DECK, COL)
    for (const sx of [-1, 1]) {
      const xa = sx > 0 ? HX - REC : -HX, xb = sx > 0 ? HX : -HX + REC
      box(stone, xa, y0, xb, ry0, DECK, COL, null)
      box(stone, xa, ry1, xb, y1, DECK, COL, null)
      // the end's corner piers
      const ex0 = sx > 0 ? 11.6 : -HX, ex1 = sx > 0 ? HX : -11.6
      box(stone, ex0, s > 0 ? HY - REC : -HY, ex1, s > 0 ? HY : -HY + REC, DECK, COL, null)
      // long side: eight columns, windows behind
      const f: Face = { o: [sx * (HX - REC), 0, 0], n: [sx, 0] }
      const sA = sx > 0 ? ry0 : -ry1, sB = sx > 0 ? ry1 : -ry0
      bays(f, sA, sB, 8)
      for (let k = 0; k < 8; k++) doric(sx * (HX - 0.85), ry0 + ((ry1 - ry0) * (k + 0.5)) / 8)
    }
    // the end: six columns in antis
    const fe: Face = { o: [0, s * (HY - REC), 0], n: [0, s] }
    bays(fe, -11.6, 11.6, 6)
    for (let k = 0; k < 6; k++) doric(-11.6 + (23.2 * (k + 0.5)) / 6, s * (HY - 0.85))
    // podium windows under the bays on the east (plaza) side, where the podium shows
    for (let k = 0; k < 8; k++) panel(win, { o: [HX, 0, 0], n: [1, 0] }, ry0 + ((ry1 - ry0) * (k + 0.5)) / 8, 1.4, 1.4, 2.8)
    // entablature, cornice, attic, coping, the low hipped roof
    slabRing(stone, full, COL, CORN, null)
    const corn = chamfer(rect(-HX - 0.4, y0 - (s < 0 ? 0.4 : 0), HX + 0.4, y1 + (s > 0 ? 0.4 : 0)), 0.25)
    prism(trim, trim, corn, CORN, ENT)
    capRing(trim, corn, CORN, false)
    prism(stone, null, rect(-HX + 0.2, y0 + (s < 0 ? 0.2 : 0), HX - 0.2, y1 - (s > 0 ? 0.2 : 0)), ENT, PARA - 0.3)
    const cope = rect(-HX + 0.1, y0 + (s < 0 ? 0.1 : 0), HX - 0.1, y1 - (s > 0 ? 0.1 : 0))
    prism(trim, null, cope, PARA - 0.3, PARA)
    // roof behind the parapet: flat edge, then a low hip to the centre line
    const rx = HX - 0.6, ra = y0 + (s < 0 ? 0.6 : 0), rb = y1 - (s > 0 ? 0.6 : 0), zr = PARA - 0.4
    for (const sx of [-1, 1]) {
      quadO(roof, [sx * rx, ra, zr], [sx * rx, rb, zr], [0, rb - (s > 0 ? rx : 0), HIP], [0, ra + (s < 0 ? rx : 0), HIP], [sx * (HIP - zr), 0, rx])
    }
    triO(roof, [-rx, yOut - s * 0.6, zr], [rx, yOut - s * 0.6, zr], [0, yOut - s * (0.6 + rx), HIP], [0, s, 1])
    // the court end is a straight gable-less edge, closed by a wall up to the hip
    triO(stone, [-rx, yIn, zr], [rx, yIn, zr], [0, yIn, HIP], [0, -s, 0])
    // inner (court) face of the wing: a colonnade along the court
    for (let k = 0; k < 4; k++) doric(-CX + (2 * CX * (k + 0.5)) / 4, s * (CY - 1.2), 0.6, DECK, COL)
    back({ o: [0, yIn, 0], n: [0, -s] }, -CX, CX, DECK, COL)
    for (let k = 0; k < 4; k++) panel(win, { o: [0, yIn, 0], n: [0, -s] }, -CX + (2 * CX * (k + 0.5)) / 4 + CX / 4, 1.6, 4.6, 10.0)
    slabRing(trim, rect(-CX, s > 0 ? CY - 2.0 : -CY, CX, s > 0 ? CY : -CY + 2.0), COL, MID - 0.6, null)
  }

  // ---------------------------------------------------------- the middle: court, west range, screens
  // court floor (the raised deck) and its retaining walls
  prism(stone, stone, rect(-CX, -CY, CX, CY), 0, DECK)
  // west range
  prism(stone, null, rect(-HX, -CY, -CX, CY), 0, DECK - 0.35)
  prism(trim, null, rect(-HX - 0.12, -CY, -CX, CY), DECK - 0.35, DECK)
  prism(stone, null, rect(-HX + REC, -CY, -CX, CY), DECK, COL)
  box(stone, -HX, -CY, -HX + REC, -11.0, DECK, COL, null)
  box(stone, -HX, 11.0, -HX + REC, CY, DECK, COL, null)
  bays({ o: [-HX + REC, 0, 0], n: [-1, 0] }, -11.0, 11.0, 6)
  for (let k = 0; k < 6; k++) doric(-HX + 0.85, -11.0 + (22 * (k + 0.5)) / 6)
  slabRing(stone, rect(-HX, -CY, -CX, CY), COL, MID - 0.9, null)
  prism(trim, trim, chamfer(rect(-HX - 0.35, -CY, -CX, CY), 0.2), MID - 0.9, MID)
  // its court face: a colonnade in front of the wall
  back({ o: [-CX, 0, 0], n: [1, 0] }, -CY + 2, CY - 2, DECK, COL)
  for (let k = 0; k < 6; k++) doric(-CX + 1.2, -CY + 2 + ((2 * CY - 4) * (k + 0.5)) / 6, 0.6)
  slabRing(trim, rect(-CX, -CY + 2.0, -CX + 2.0, CY - 2.0), COL, MID - 0.6, null)
  // east screens between the portico and the wings, each with a tall opening and a column
  for (const s of [-1, 1]) {
    const ya = s > 0 ? PY : -CY, yb = s > 0 ? CY : -PY
    prism(stone, null, rect(CX, ya, HX, yb), 0, DECK)
    prism(stone, null, rect(CX, ya, HX - REC, yb), DECK, COL)
    back({ o: [HX - REC, 0, 0], n: [1, 0] }, ya + 0.4, yb - 0.4, DECK, COL)
    doric(HX - 0.85, (ya + yb) / 2)
    slabRing(stone, rect(CX, ya, HX, yb), COL, MID - 0.9, null)
    prism(trim, trim, chamfer(rect(CX, ya, HX + 0.35, yb), 0.2), MID - 0.9, MID)
  }

  // ---------------------------------------------------------- the portico
  prism(stone, null, rect(CX, -PY, PX, PY), 0, DECK - 0.35)
  slabRing(trim, rect(CX, -PY - 0.1, PX + 0.1, PY + 0.1), DECK - 0.35, DECK)
  const pcY = Array.from({ length: 6 }, (_, k) => -PY + 1.4 + (k * (2 * PY - 2.8)) / 5)
  for (const y of pcY) doric(PX - 1.0, y, 0.85, DECK, PCOL)
  for (const x of [PX - 5.2, PX - 9.4]) for (const s of [-1, 1]) doric(x, s * pcY[5], 0.85, DECK, PCOL)
  // entablature over the columns (open underneath), then the pediment and roof
  slabRing(stone, rect(CX, -PY, PX, PY), PCOL, PENT - 0.7)
  const pc = chamfer(rect(CX, -PY - 0.35, PX + 0.35, PY + 0.35), 0.2)
  prism(trim, trim, pc, PENT - 0.7, PENT)
  capRing(trim, pc, PENT - 0.7, false)
  // the gable runs east–west: draw it in a frame turned a quarter
  const m = (p: Part) => new Moved(p, ([x, y, z]) => [CX + (PX + 0.35 - CX) / 2 + y, -x, z], ([x, y, z]) => [y, -x, z])
  const half = (PX + 0.35 - CX) / 2
  gable(m(roof), m(trim), m(stone), PY + 0.35, -half, half, PENT, PRIDGE, [-1, 1], 0.7, 0.5)
  // acroteria: a block at the apex and at each corner of the east pediment
  box(trim, PX - 0.2, -0.5, PX + 0.4, 0.5, PRIDGE - 0.3, PRIDGE + 0.9)
  for (const s of [-1, 1]) box(trim, PX - 0.3, s * (PY + 0.35) - 0.4, PX + 0.4, s * (PY + 0.35) + 0.4, PENT, PENT + 0.8)
  // doors and windows on the court's east edge are open; the steps up from the plaza
  {
    const x0 = PX + 0.1, x1 = PX + 4.6, hw = PY - 1.6
    // the flight, ending on a 0.7 m bottom riser so its foot stays above the plaza's terrain
    const F = 0.7
    quadO(stone, [x1, -hw, F], [x1, hw, F], [x0, hw, DECK], [x0, -hw, DECK], [DECK - F, 0, x1 - x0])
    quadO(stone, [x1, -hw, 0], [x1, hw, 0], [x1, hw, F], [x1, -hw, F], [1, 0, 0])
    for (const s of [-1, 1]) {
      const y = s * hw, yo = s * (hw + 1.1)
      // cheek walls
      quadO(stone, [x0, yo, 0], [x1, yo, 0], [x1, yo, 1.0], [x0, yo, DECK + 0.6], [0, s, 0])
      quadO(stone, [x0, y, DECK], [x1, y, F], [x1, y, 1.0], [x0, y, DECK + 0.6], [0, -s, 0])
      quadO(trim, [x0, y, DECK + 0.6], [x1, y, 1.0], [x1, yo, 1.0], [x0, yo, DECK + 0.6], [DECK - 0.4, 0, x1 - x0])
      quadO(stone, [x1, y, 0], [x1, yo, 0], [x1, yo, 1.0], [x1, y, 1.0], [1, 0, 0])
      quadO(stone, [x0, y, 0], [x1, y, 0], [x1, y, F], [x0, y, DECK], [0, -s, 0])
    }
  }

  const buff = finish('wm-limestone', 0xe7dbc2)
  return finishGlb('War Memorial Building', [
    { part: stone, material: buff },
    { part: trim, material: finish('wm-limestone-trim', 0xf4ecda) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('wm-colonnade-shade', 0xc6bba4) },
  ], { bearing: 332.3, height: PRIDGE + 0.9, replaces: ['relation/1762286'] }, 6500)
}

if (import.meta.main) await writeModel('nash-war-memorial-building', build())
