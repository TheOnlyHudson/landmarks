/**
 * St. John's Episcopal Cathedral, 256 East Church Street, Jacksonville, FL
 * (1903–1906, Snelling Grant & Co., Gothic Revival, buff limestone, steep
 * slate roofs, square tower with a parapet raised at its corners), with the
 * parish buildings that share its OSM outline: procedural, CC0-1.0.
 * bun generators/jax-st-johns-cathedral.ts [out.glb]
 *
 * Identity: OSM way/497151843 (building=church, "Saint Johns Episcopal
 * Cathedral", wikidata Q7588585). The outline holds the whole block's
 * complex: the cruciform cathedral, the gabled parish hall along the north
 * and the flat-roofed offices and link on the east and west. The domed
 * octagonal chapel south-east of the tower is a separate building and is
 * left to the map.
 *
 * Map frame: x toward 104°, y toward 14° (bearing 14, the outline's edges),
 * z up, metres. Origin: the outline's area centroid (-81.65336,
 * 30.328879). The cathedral's west front on Market Street faces -x.
 *
 * Plan (OSM, in this frame): nave x -27.6…4.4, y -23.6…-7.6; transepts
 * x -6.9…4.4, y -31.8…1.9; chancel x 4.4…17.1, y -21.1…-9.2; tower
 * x 4.4…10.4, y -27.6…-21.2 (its y extent from lidar, OSM folds it into
 * the transept); parish hall x -27.3…5.5, y 11.5…24.2; east offices
 * x 5.5…32.5 (to y 11.3 on the east, x 19.5…32.5, down to y -5.8);
 * west link x -27.6…-20.5, y -7.6…11.5. The south porch near the west
 * front (x -26.5…-21.5, y -27…-23.6) is not in OSM; from lidar and p1.
 *
 * Heights: USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (2018 flight),
 * 1 m grid, read in this frame, street 1.7 m above the crop minimum
 * (measured): nave eaves 7.6, ridge 15.2; transept and chancel eaves ~7,
 * ridges 12.3; tower parapet ~19.5–20.2 (corners highest); parish hall
 * eaves ~10, ridge 13.7; offices 7.4 (north-east) and ~11 (east); west
 * link 4.4; porch 6.3. Estimated from photos against those: west window
 * and doors, tower louvres 11–16.5, cornice 17.2, corner turrets to 20.6,
 * hall pinnacles to 16.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/jax/work/jax-st-johns-cathedral/photos):
 *  p1 "St. John's Cathedral, Jacksonville FL, West view 20160706 1.jpg",
 *     DXR, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:St._John%27s_Cathedral,_Jacksonville_FL,_West_view_20160706_1.jpg
 *     — the west front, the south porch and the tower beyond.
 *  p2 "Jax FL St Johns Church01.jpg", Ebyabe, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Jax_FL_St_Johns_Church01.jpg
 *     — the parish hall's west gable and the cathedral's west front.
 *  p3 "Jax FL St Johns Church03.jpg", Ebyabe, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Jax_FL_St_Johns_Church03.jpg
 *     — the west front from the south-west.
 *  p4 "StJohnsCathedralJaxTower.PNG", Mgreason, public domain,
 *     https://commons.wikimedia.org/wiki/File:StJohnsCathedralJaxTower.PNG
 *     — the tower's upper stage, close.
 * Plan and roof colours also from USGS NAIP (public domain).
 *
 * Left out: the tower's eagle and gargoyles, crockets, hood moulds, the
 * rose window's tracery (a plain disc with a cross of bars). Doubts: the
 * east end, the transept gables and the offices are unphotographed
 * (generic windows); the hall's roof pitch is from lidar and looks lower
 * than p2 suggests. Colours: stone 0xe9dfcc (buff, p1–p3), slate 0x737b86
 * (p1, pulled light), doors 0x8a5a3c (p1, p3).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, flatShape, extrudeShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'
import { lancet, pointedShape } from './ral-first-baptist-church'
import { boxFaces, crenels, spike } from './cola-trinity-cathedral'

// nave
const NX0 = -27.6, NX1 = 4.4, NY0 = -23.6, NY1 = -7.6, NYC = (NY0 + NY1) / 2, NHW = (NY1 - NY0) / 2
const NE = 7.6, NR = 15.2
// transepts and chancel
const TX0 = -6.9, TX1 = 4.4, TXC = (TX0 + TX1) / 2, THW = (TX1 - TX0) / 2, TY0 = -31.8, TY1 = 1.9
const CX1 = 17.1, CY0 = -21.1, CY1 = -9.2, CYC = (CY0 + CY1) / 2, CHW = (CY1 - CY0) / 2
const LE = 7.0, LR = 12.3
// tower
const WX0 = 4.4, WX1 = 10.4, WY0 = -27.6, WY1 = -21.2, CORN = 17.2

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part(), flat = new Part()

  // ============================================================ nave, transepts, chancel
  const gableY = (y0: number, y1: number, ze: number, zr: number) => { const c = (y0 + y1) / 2; return [[y0, 0], [y1, 0], [y1, ze], [c, zr], [y0, ze]] as [number, number][] }
  const gableX = (x0: number, x1: number, ze: number, zr: number) => { const c = (x0 + x1) / 2; return [[x0, 0], [x1, 0], [x1, ze], [c, zr], [x0, ze]] as [number, number][] }
  prismX(stone, NX0, NX1, gableY(NY0, NY1, NE, NR))
  roofX(slate, NX0 + 0.6, NX1, NYC, NHW, NE, NR + 0.05, 0.4, 0.3)
  prismY(stone, TY0, TY1, gableX(TX0, TX1, LE, LR))
  roofY(slate, TY0 + 0.6, TY1 - 0.6, TXC, THW, LE, LR + 0.05, 0.4, 0.3)
  prismX(stone, TX1, CX1, gableY(CY0, CY1, LE, LR))
  roofX(slate, TX1, CX1 - 0.6, CYC, CHW, LE, LR + 0.05, 0.4, 0.3)
  // gable parapets with copings: west front, transept ends, east end
  const lift = (sec: [number, number][], ze: number, zr: number, a: number, b: number) => [[a, ze - 0.4], [b, ze - 0.4], [b, ze + 0.6], [(a + b) / 2, zr + 0.8], [a, ze + 0.6]] as [number, number][]
  prismX(stone, NX0, NX0 + 0.6, lift([], NE, NR, NY0, NY1))
  prismX(stone, CX1 - 0.6, CX1, lift([], LE, LR, CY0, CY1))
  for (const [a, b] of [[TY0, TY0 + 0.6], [TY1 - 0.6, TY1]]) prismY(stone, a, b, lift([], LE, LR, TX0, TX1))
  // finials: the west front's big cross, smaller crosses on the other gables
  cross(stone, NX0 + 0.3, NYC, NR + 0.8, 2.4, 1.4, 0.4)
  cross(stone, CX1 - 0.3, CYC, LR + 0.8, 1.6, 1.0, 0.3)
  for (const y of [TY0 + 0.3, TY1 - 0.3]) cross(stone, TXC, y, LR + 0.8, 1.6, 1.0, 0.3)

  // ============================================================ the west front (p1, p3)
  const west: Face = { o: [NX0, NYC, 0], n: [-1, 0] } // s = -(y - NYC): + to the south
  // the great west window: a pointed head holding a wheel over two lights (p1, p3)
  lancet(win, trim, west, 0.2, 3.4, 6.8, 10.6, 2)
  for (let k = 0; k < 12; k++) {
    const a0 = (2 * Math.PI * k) / 12, a1 = (2 * Math.PI * (k + 1)) / 12, ring = (r: number, a: number) => [0.2 + r * Math.cos(a), 11.4 + r * Math.sin(a)] as [number, number]
    flatShape(trim, west, [ring(1.15, a0), ring(1.35, a0), ring(1.35, a1), ring(1.15, a1)], 0.09)
    if (k % 3 === 0) flatShape(trim, west, [ring(0.15, a0 - 0.06), ring(1.15, a0 - 0.06), ring(1.15, a0 + 0.06), ring(0.15, a0 + 0.06)], 0.09)
  }
  flatShape(trim, west, [[-1.5, 9.95], [1.9, 9.95], [1.9, 10.15], [-1.5, 10.15]], 0.09)
  // tall two-light lancet to the south of the door, the door with a small two-light window over it to the north
  lancet(win, trim, west, 2.4, 1.9, 1.6, 6.0, 2)
  extrudeShape(stone, west, [[-3.4, 0], [-0.4, 0], [-0.4, 4.0], [-1.9, 5.2], [-3.4, 4.0]], 0, 0.45)
  const wd: Face = { o: [NX0 - 0.45, NYC, 0], n: [-1, 0] }
  flatShape(door, wd, pointedShape(-1.9, 2.0, 0.5, 3.2, 0.8), 0.04)
  lancet(win, trim, west, -1.9, 1.5, 5.4, 6.6, 2)
  // clasping buttresses at the front corners with set-offs and pinnacle stubs, two more framing the window
  for (const y of [NY0, NY1]) {
    box(stone, NX0 - 0.9, y - 0.6, NX0 + 0.6, y + 0.6, 0, 5.2, stone, 0.12)
    box(stone, NX0 - 0.6, y - 0.45, NX0 + 0.45, y + 0.45, 5.2, NE + 1.6, stone, 0.1)
    spike(stone, stone, NX0 - 0.1, y, 0.8, NE + 1.6, NE + 2.2, NE + 3.6)
  }
  for (const s of [-3.9, 3.9]) box(stone, NX0 - 0.6, NYC - s - 0.4, NX0, NYC - s + 0.4, 0, 5.8, stone, 0.1)

  // ============================================================ flanks: buttresses and lancets
  for (const [y, n] of [[NY0, -1], [NY1, 1]] as [number, -1 | 1][]) {
    const f: Face = { o: [0, y, 0], n: [0, n] } // s = x (n=-1) or -x (n=1)
    for (let k = 0; k < 4; k++) {
      const x = NX0 + 2.6 + k * 5.0
      if (n < 0 && x > -24 && x < -20) continue // the porch
      lancet(win, null, f, n < 0 ? x + 2.5 : -(x + 2.5), 1.5, 2.0, 5.4)
      box(stone, x - 0.4, y + n * 0.4 - 0.4, x + 0.4, y + n * 0.4 + 0.4, 0, NE - 0.4, stone, 0.1)
    }
  }
  // transept gable windows and chancel east window
  for (const [y, n] of [[TY0, -1], [TY1, 1]] as [number, -1 | 1][]) {
    const f: Face = { o: [TXC, y, 0], n: [0, n] }
    lancet(win, trim, f, 0, 3.4, 2.4, 7.2, 3)
    lancet(win, null, { o: [TX0, 0, 0], n: [-1, 0] }, -(y - n * 3.2), 1.3, 2.2, 5.2)
  }
  lancet(win, trim, { o: [CX1, CYC, 0], n: [1, 0] }, 0, 3.4, 2.6, 7.0, 3)
  for (const x of [8.6, 13.6]) lancet(win, null, { o: [0, CY1, 0], n: [0, 1] }, -x, 1.4, 2.2, 5.2)
  for (const x of [12.0, 15.0]) lancet(win, null, { o: [0, CY0, 0], n: [0, -1] }, x, 1.4, 2.2, 5.2)

  // ============================================================ the south porch: crenellated gable, pinnacles, a door
  const PX0 = -26.5, PX1 = -21.5, PY0 = -27.0
  box(stone, PX0, PY0, PX1, NY0, 0, 5.2)
  prismY(stone, PY0, NY0, [[PX0, 0], [PX1, 0], [PX1, 5.2], [(PX0 + PX1) / 2, 6.6], [PX0, 5.2]])
  const pf: Face = { o: [0, PY0, 0], n: [0, -1] }
  crenels(stone, pf, PX0 + 0.5, PX1 - 0.5, 6.0, 0.6, 0.5, 0.45, 0.25)
  for (const x of [PX0, PX1]) spike(stone, stone, x, PY0, 0.9, 0, 6.8, 8.6)
  flatShape(door, pf, pointedShape((PX0 + PX1) / 2, 2.0, 0.4, 3.0, 0.8), 0.06)

  // ============================================================ the tower (p1, p4)
  box(stone, WX0, WY0, WX1, WY1, 0, CORN)
  const tf = boxFaces(WX0, WY0, WX1, WY1)
  for (const [x, y] of [[WX0, WY0], [WX1, WY0], [WX1, WY1], [WX0, WY1]]) {
    box(stone, x - 0.55, y - 0.55, x + 0.55, y + 0.55, 0, 9.5, stone, 0.12)
    box(stone, x - 0.4, y - 0.4, x + 0.4, y + 0.4, 9.5, CORN - 0.4, stone, 0.1)
  }
  box(stone, WX0 - 0.35, WY0 - 0.35, WX1 + 0.35, WY1 + 0.35, CORN, CORN + 0.6, stone, 0.15)
  box(stone, WX0 + 0.05, WY0 + 0.05, WX1 - 0.05, WY1 - 0.05, CORN + 0.6, CORN + 1.6)
  for (const f of tf) {
    const half = Math.abs(f.n[0]) ? (WY1 - WY0) / 2 : (WX1 - WX0) / 2
    // the big louvred opening, its head a shallow point
    flatShape(win, f, pointedShape(0, 1.9, 11.0, 14.8, 1.2), 0.06)
    for (let k = 1; k <= 4; k++) flatShape(trim, f, [[-0.95, 11.0 + k * 0.9], [0.95, 11.0 + k * 0.9], [0.95, 11.16 + k * 0.9], [-0.95, 11.16 + k * 0.9]], 0.09)
    lancet(win, null, f, 0, 0.9, 6.0, 7.6)
    // raised centre piece on each face between the corner turrets
    extrudeShape(stone, f, [[-1.1, CORN + 1.6], [1.1, CORN + 1.6], [1.1, CORN + 2.6], [0, CORN + 3.1], [-1.1, CORN + 2.6]], -0.7, 0)
    void half
  }
  // corner turrets standing above the parapet, each with a small open lancet
  for (const [x, y] of [[WX0, WY0], [WX1, WY0], [WX1, WY1], [WX0, WY1]]) {
    const cx = x + Math.sign((WX0 + WX1) / 2 - x) * 0.7, cy = y + Math.sign((WY0 + WY1) / 2 - y) * 0.7
    box(stone, cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75, CORN + 0.6, CORN + 3.4, stone, 0.08)
    box(stone, cx - 0.85, cy - 0.85, cx + 0.85, cy + 0.85, CORN + 3.4, CORN + 3.7, stone, 0.08)
    for (const f of boxFaces(cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75)) lancet(win, null, f, 0, 0.5, CORN + 1.7, CORN + 2.6)
  }

  // ============================================================ the parish hall (p2) and the flat-roofed offices
  const HX0 = -27.3, HX1 = 5.5, HY0 = 11.5, HY1 = 24.2, HYC = (HY0 + HY1) / 2, HHW = (HY1 - HY0) / 2
  prismX(stone, HX0, HX1, gableY(HY0, HY1, 9.8, 13.7))
  roofX(slate, HX0 + 0.6, HX1, HYC, HHW, 9.8, 13.75, 0.35, 0.3)
  prismX(stone, HX0, HX0 + 0.6, lift([], 9.8, 13.7, HY0, HY1))
  cross(stone, HX0 + 0.3, HYC, 14.5, 1.6, 1.0, 0.3)
  const hf: Face = { o: [HX0, HYC, 0], n: [-1, 0] }
  lancet(win, trim, hf, 0, 4.4, 4.6, 9.6, 4)
  extrudeShape(stone, hf, [[-1.4, 0], [1.4, 0], [1.4, 3.2], [0, 4.2], [-1.4, 3.2]], 0, 0.35)
  flatShape(door, { o: [HX0 - 0.35, HYC, 0], n: [-1, 0] }, pointedShape(0, 1.8, 0.5, 2.8, 0.8), 0.04)
  for (const s of [-3.6, 3.6]) lancet(win, trim, hf, s, 1.3, 1.5, 3.6, 2)
  for (const y of [HY0, HY1]) {
    box(stone, HX0 - 0.5, y - 0.6, HX0 + 0.7, y + 0.6, 0, 9.8, stone, 0.12)
    spike(stone, stone, HX0 + 0.1, y, 0.9, 9.8, 12.4, 16.0)
  }
  for (const [y, n] of [[HY0, -1], [HY1, 1]] as [number, -1 | 1][]) {
    for (let k = 0; k < 6; k++) {
      const x = HX0 + 3.6 + k * 5.0
      lancet(win, null, { o: [0, y, 0], n: [0, n] }, n < 0 ? x : -x, 1.8, 4.0, 7.6)
    }
  }
  // north-east offices (7.4) and the east wing (11), with a parapet; west link (4.4)
  box(stone, HX1, 11.3, 19.5, 23.2, 0, 7.4, flat)
  box(stone, 19.5, -5.8, 32.5, 23.2, 0, 11.0, flat)
  box(stone, NX0, NY1, -20.5, HY0, 0, 4.4, flat)
  box(stone, 19.3, -6.0, 32.7, -5.6, 11.0, 11.7)
  for (const [x0, x1, y0, y1, zb] of [[19.5, 32.5, -5.8, 23.2, 11.0], [HX1, 19.5, 11.3, 23.2, 7.4], [NX0, -20.5, NY1, HY0, 4.4]] as number[][]) {
    box(stone, x0, y0, x1, y0 + 0.35, zb, zb + 0.6)
    box(stone, x0, y1 - 0.35, x1, y1, zb, zb + 0.6)
  }
  for (let k = 0; k < 7; k++) {
    const y = -3.6 + k * 3.9
    panel(win, { o: [32.5, 0, 0], n: [1, 0] }, y, 2.2, 1.6, 4.6)
    panel(win, { o: [32.5, 0, 0], n: [1, 0] }, y, 2.2, 6.2, 9.4)
  }
  for (let k = 0; k < 3; k++) panel(win, { o: [19.5, -5.8, 0], n: [0, -1] }, 1.8 + k * 3.9 + 0.5, 2.2, 6.2, 9.4)
  for (let k = 0; k < 4; k++) lancet(win, null, { o: [NX0, 0, 0], n: [-1, 0] }, -(-5.2 + k * 4.6), 1.4, 1.0, 2.8)
  void lathe

  return finishGlb("St. John's Episcopal Cathedral", [
    { part: stone, material: finish('sjc-stone', 0xe9dfcc) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('sjc-slate', 0x737b86) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('sjc-oak', 0x8a5a3c) },
    { part: flat, material: PALETTE.roof },
  ], { bearing: 14, height: CORN + 3.7, replaces: ['way/497151843'] }, 5000)
}

function circle(s: number, z: number, r: number, n: number): [number, number][] {
  return Array.from({ length: n }, (_, k) => [s + r * Math.cos((2 * Math.PI * k) / n), z + r * Math.sin((2 * Math.PI * k) / n)] as [number, number])
}

/** A latin cross standing at (x, y, z), arms along y. */
function cross(p: Part, x: number, y: number, z: number, h: number, arm: number, t: number) {
  box(p, x - t / 2, y - t / 2, x + t / 2, y + t / 2, z, z + h)
  box(p, x - t / 2, y - arm / 2, x + t / 2, y + arm / 2, z + h * 0.6, z + h * 0.6 + t)
}

if (import.meta.main) await writeModel('jax-st-johns-cathedral', build())
