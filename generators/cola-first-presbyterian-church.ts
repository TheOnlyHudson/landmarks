/**
 * First Presbyterian Church, 1324 Marion Street, Columbia, SC (1853,
 * Gothic Revival, stuccoed brick, west tower and spire): procedural,
 * CC0-1.0.
 * bun generators/cola-first-presbyterian-church.ts [out.glb]
 *
 * Uses the shared church helpers in cola-trinity-cathedral.ts.
 *
 * Identity: OSM way/108351425 (building=church, First Presbyterian Church,
 * wikidata Q5453553). The church's other buildings (way/510854912 and
 * neighbours) are separate ways and stay as the map draws them.
 *
 * Map frame: x toward 160°, y toward 70° (bearing 70, OSM edges at 70° /
 * 160°), z up, metres. Origin: the outline's centroid (-81.030591,
 * 34.004014). The tower front (Marion Street) faces -y.
 *
 * Plan (OSM, in this frame): nave x -9.1…9.0, y -18.6…20.0; tower
 * x -3.7…2.8, projecting to y -21.7; a small porch on the south-east
 * flank x 9…10.4, y -17.7…-13.9.
 *
 * Heights: USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m
 * grid, local ground 0.9 m above the crop minimum (measured): eaves 10.6,
 * ridge 17.0, tower stage with its gables ~19–22, belfry top ~29.5, spire
 * to 51.5 (the highest return; tip estimated 52.0, cross to 53.0).
 * Stage heights between those from photos p2 and p3 against the 6.5 m
 * tower (estimated): door 0.6–4.8, tower lancet 6.6–16.0, square stage
 * to 19.5 with a gable on each face to 22.0, octagonal belfry 19.5–29.5
 * with louvred lancets 22.8–27.8, front corner pinnacles to 19.5.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/cola/work/cola-first-presbyterian-church/photos):
 *  p1 "First Presbyterian Church - Columbia, South Carolina.jpg",
 *     Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_-_Columbia,_South_Carolina.jpg
 *     — tower and south-east flank from the west-south-west, close.
 *  p2 "FirstPresbyterianColaSC.jpg", Abductive, CC0,
 *     https://commons.wikimedia.org/wiki/File:FirstPresbyterianColaSC.jpg
 *     — the tower front, frontal.
 *  p3 "First Presbyterian Church Columbia, SC Back View.jpg", Thomas
 *     Kirchel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_Columbia,_SC_Back_View.jpg
 *     — the east gable (crenellated, rose window) and the north-west flank.
 *
 * Left out: the tower's corbelled arcading and crockets, the spire's
 * lucarne bands (drawn as four gablets), hood moulds, railings.
 * Doubts: the bay count (six) and the flank lancets from p1 and p3, the
 * east end's lower windows simplified; the roof colour is unphotographed
 * (grey). Colours: stucco 0xe3b3a0 (salmon, p1–p3 in sun, pulled light);
 * spire slate 0x8e9893 (grey-green, p1, p2).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, ccw, flatShape, extrudeShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './nash-tennessee-state-capitol'
import { prismY, roofY } from './ral-holy-name-of-jesus-cathedral'
import { boxFaces, gablet, spire, crenels, spike, lancet } from './cola-trinity-cathedral'

const X0 = -9.1, X1 = 9.0, XC = (X0 + X1) / 2, HW = (X1 - X0) / 2
const Y0 = -18.6, Y1 = 20.0
const EAVE = 10.6, RIDGE = 17.0
const TX = -0.45, TH = 3.25, TY0 = -21.7, TY1 = -15.2 // tower centre x, half width, y range
const SQ = 19.5, BEL = 29.5, TIP = 52.0

/** Merlons stepping up a gable's rake from (s0, z0) to (s1, z1) on face f. */
function rakeCrenels(p: Part, f: Face, s0: number, z0: number, s1: number, z1: number, n: number, d = 0.3) {
  for (let k = 0; k < n; k++) {
    const t = (k + 0.5) / n, s = s0 + (s1 - s0) * t, z = z0 + (z1 - z0) * t
    const w = Math.abs(s1 - s0) / n * 0.5
    extrudeShape(p, f, [[s - w / 2, z - 0.3], [s + w / 2, z - 0.3], [s + w / 2, z + 0.65], [s - w / 2, z + 0.65]], -d, 0)
  }
}

function build() {
  const stucco = new Part(), roof = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // ============================================================ nave: walls with a parapet, gable ends raised above the roof
  box(stucco, X0, Y0, X1, Y1, 0, EAVE + 0.6, null)
  for (const [ya, yb] of [[Y0, Y0 + 0.6], [Y1 - 0.6, Y1]]) prismY(stucco, ya, yb, [[X0, EAVE], [X1, EAVE], [X1, EAVE + 0.6], [XC, RIDGE + 0.6], [X0, EAVE + 0.6]])
  roofY(roof, Y0 + 0.6, Y1 - 0.6, XC, HW - 0.4, EAVE + 0.35, RIDGE + 0.1, 0, 0.25)
  const front: Face = { o: [XC, Y0, 0], n: [0, -1] }, back: Face = { o: [XC, Y1, 0], n: [0, 1] }
  for (const f of [front, back]) {
    // crenellated rakes (p1, p3)
    const sg = f === front ? 1 : -1
    rakeCrenels(stucco, f, -HW * sg + 1.0 * sg, EAVE + 1.3, -0.6 * sg, RIDGE + 0.3, 6)
    rakeCrenels(stucco, f, HW * sg - 1.0 * sg, EAVE + 1.3, 0.6 * sg, RIDGE + 0.3, 6)
  }
  // flank parapet merlons and buttresses with pinnacles, six bays
  const bay = (Y1 - Y0) / 6
  for (const [x, n] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const f: Face = { o: [x, (Y0 + Y1) / 2, 0], n: [n, 0] }
    crenels(stucco, f, -(Y1 - Y0) / 2 + 0.8, (Y1 - Y0) / 2 - 0.8, EAVE + 0.6, 0.6, 0.6, 0.7, 0.3)
    for (let k = 0; k <= 6; k++) {
      const y = Y0 + k * bay, a = k === 0 || k === 6 ? 1.1 : 0.8
      const bx = x + n * 0.45
      box(stucco, bx - 0.45, y - a / 2, bx + 0.45, y + a / 2, 0, EAVE + 1.0)
      spike(stucco, stucco, bx - n * 0.1, y, k === 0 || k === 6 ? 0.8 : 0.6, EAVE + 1.0, EAVE + 2.6, k === 0 ? 19.5 : k === 6 ? 17.5 : EAVE + 4.4)
    }
    for (let k = 0; k < 6; k++) lancet(win, null, { o: [x, Y0 + (k + 0.5) * bay, 0], n: [n, 0] }, 0, 1.8, 2.4, 7.4)
  }

  // ============================================================ the east gable: rose window, lancets, vent
  flatShape(win, back, arc(0, 10.4, 1.7, 0, 360, 16).slice(0, -1), 0.06)
  for (const s of [-4.6, 4.6]) lancet(win, null, back, s, 1.5, 3.2, 6.6)
  lancet(door, null, back, 0, 0.9, 13.2, 14.3)
  // front gable lancets either side of the tower
  for (const s of [-6.3, 6.3]) lancet(win, null, front, s, 1.5, 2.6, 7.2)

  // ============================================================ the tower
  const x0 = TX - TH, x1 = TX + TH
  box(stucco, x0, TY0, x1, TY1, 0, SQ)
  const tf = boxFaces(x0, TY0, x1, TY1)
  // clasping buttresses at the front corners, with pinnacles at the stage top
  for (const x of [x0, x1]) for (const y of [TY0]) {
    box(stucco, x - 0.55, y - 0.55, x + 0.55, y + 0.55, 0, SQ - 0.5)
    spike(stucco, stucco, x, y, 0.8, SQ - 0.5, SQ + 1.6, SQ + 4.2)
  }
  for (const x of [x0, x1]) spike(stucco, stucco, x, TY1, 0.7, SQ - 0.5, SQ + 1.4, SQ + 3.6)
  // a gable on each face of the square stage, its back running into the belfry
  for (const f of tf) gablet(stucco, f, 0, TH * 2 - 0.4, SQ, 2.5, -1.4, 0.05)
  // door and the tall lancet over it (p2)
  {
    const f = tf[0]
    extrudeShape(stucco, f, [[-1.6, 0.5], [1.6, 0.5], [1.6, 4.0], [0.8, 5.2], [0, 5.6], [-0.8, 5.2], [-1.6, 4.0]], 0, 0.25)
    flatShape(door, { o: [TX, TY0 - 0.25, 0], n: [0, -1] }, [[-1.1, 0.5], [1.1, 0.5], [1.1, 3.7], [0.55, 4.6], [0, 4.9], [-0.55, 4.6], [-1.1, 3.7]], 0.05)
    lancet(win, stucco, f, 0, 2.2, 6.6, 14.6, 2)
    for (const g of [tf[1], tf[3]]) lancet(win, null, g, -0.8, 1.0, 9.5, 13.0)
  }
  // octagonal belfry, louvred lancets on the cardinal faces, pinnacles at its corners
  const R = 3.0, ap = R * Math.cos(Math.PI / 8), tc = (TY0 + TY1) / 2
  lathe(stucco, TX, tc, [[R, SQ], [R, BEL]], 8, 22.5, 382.5)
  lathe(stucco, TX, tc, [[R + 0.2, BEL], [R + 0.2, BEL + 0.5], [R - 0.1, BEL + 0.5]], 8, 22.5, 382.5)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, n: [number, number] = [Math.cos(a), Math.sin(a)]
    lancet(slate, null, { o: [TX + n[0] * ap, tc + n[1] * ap, 0], n }, 0, 1.2, 22.8, 26.8)
  }
  for (let k = 0; k < 8; k++) {
    const a = ((22.5 + k * 45) * Math.PI) / 180
    spike(stucco, stucco, TX + Math.cos(a) * (R - 0.15), tc + Math.sin(a) * (R - 0.15), 0.45, BEL + 0.5, BEL + 1.3, BEL + 3.0)
  }
  // the spire, with four small gablets at its foot and a finial cross
  spire(slate, door, TX, tc, R - 0.55, BEL + 0.5, TIP, 1.2)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, n: [number, number] = [Math.cos(a), Math.sin(a)]
    const d = (R - 0.3) * Math.cos(Math.PI / 8) * 0.82
    gablet(stucco, { o: [TX + n[0] * d, tc + n[1] * d, 0], n }, 0, 1.1, BEL + 1.6, 1.6, -0.8, 0.25)
  }

  // ============================================================ the side porch
  box(stucco, X1, -17.7, 10.4, -13.9, 0, 4.0, roof)

  return finishGlb('First Presbyterian Church', [
    { part: stucco, material: finish('fpc-stucco', 0xe3b3a0) },
    { part: roof, material: PALETTE.roof },
    { part: slate, material: finish('fpc-slate', 0x8e9893) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('fpc-wood', 0x6a5546) },
  ], { bearing: 70, height: TIP + 1.2, replaces: ['way/108351425'] }, 5000)
}

if (import.meta.main) await writeModel('cola-first-presbyterian-church', build())
