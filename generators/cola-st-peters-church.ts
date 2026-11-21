/**
 * Saint Peter's Catholic Church (Basilica of Saint Peter), 1529 Assembly
 * Street, Columbia, SC (begun 1906, dedicated 1909; Gothic Revival, red
 * brick with cream stone trim, central front tower and slate spire), with
 * the parish hall OSM draws in the same outline: procedural, CC0-1.0.
 * bun generators/cola-st-peters-church.ts [out.glb]
 *
 * Uses the shared church helpers in cola-trinity-cathedral.ts.
 *
 * Identity: OSM way/513681742 (building=church, wikidata Q7591423). The
 * way outlines the church, a link block and the gabled parish hall west
 * of it as one building, so the model draws all three; the courtyard
 * between them (inside the OSM outline, lidar at ground) is left open.
 *
 * Map frame: x toward 160°, y toward 70° (bearing 70, OSM edges at 70° /
 * 160°), z up, metres. Origin: the outline's centroid (-81.037996,
 * 34.005589). The tower front faces +y.
 *
 * Plan and heights: USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019
 * flight), 1 m grid, read in this frame (measured). Church ground is
 * ~1.0 m above the hall's, so every church height below is +1.0:
 *  - nave x 15.5…26.5, clerestory eaves 14.5, ridge 17.4; aisles to
 *    x 11.0 and 30.1 (OSM east wall), roofs 8.5…10.3;
 *  - transept x 9.5…33.0, y -7…5, ridge 17.6; chancel to y -13, ridge 15;
 *  - tower ~7 m square centred on the nave axis (lidar; OSM's tower bump
 *    sits ~3 m west of the lidar tower and of the nave axis, taken as an
 *    OSM offset), lidar top 32.2 on the spire's flank;
 *  - parish hall x -24.3…-1.1, y -33.9…23.0, eaves 6.5, ridge 9.7.
 * Tower stages from photo p3 (frontal) scaled to the 7 m tower
 * (estimated): stage string courses 18.8 and 23.9, great window
 * 11.3–16.4 (3.1 wide), three round-headed windows 19.5–22.5, belfry
 * louvres 24.5–28.5 under gablets to 32.3, corner turrets to 30.2
 * with pinnacles to 32.4, spire
 * 29.0–38.5, cross to 40.8 (lidar's highest return 32.2 is on the spire).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/cola/work/cola-st-peters-church/photos):
 *  p1 "St. Peter's Catholic Church - Columbia, South Carolina 01.jpg",
 *     Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:St._Peter%27s_Catholic_Church_-_Columbia,_South_Carolina_01.jpg
 *     — the portal: stone surround, gable with niche, great window.
 *  p2 "St. Peter's Catholic Church - Columbia, South Carolina 02.jpg",
 *     Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:St._Peter%27s_Catholic_Church_-_Columbia,_South_Carolina_02.jpg
 *     — tower and flank: aisle windows, clerestory, corbel tables.
 *  p3 "St peters columbia sc 10-9-11.jpg", Vitugglan, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:St_peters_columbia_sc_10-9-11.jpg
 *     — the front, frontal.
 *  p4 "St. Peter's Roman Catholic Church (Columbia, South Carolina).JPG",
 *     KudzuVine, public domain,
 *     https://commons.wikimedia.org/wiki/File:St._Peter%27s_Roman_Catholic_Church_(Columbia,_South_Carolina).JPG
 *     — from the courtyard: transept end with rose window, clerestory, belfry.
 *
 * Left out: corbel tables, the statue niche, tracery beyond mullions, the
 * arcade and its green metal roof in the courtyard, the hall's details.
 * Doubts: the chancel end and the east flank are unphotographed (drawn
 * like the west); the hall's windows are generic bands.
 * Colours: brick 0xb06a56 (red brick, p1–p3, pulled light); stone trim
 * (palette trim); spire slate 0x4f5862 (dark, p3, a defining feature).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, ccw, flatShape, extrudeShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'
import { boxFaces, gablet, spire, spike, lancet, wingWindows } from './cola-trinity-cathedral'

const G = 1.0 // church ground above the lowest ground
const XC = 21.0, NX0 = 15.5, NX1 = 26.5, AX0 = 11.0, AX1 = 30.1
const NY0 = -7.0, NY1 = 23.2
const NEAVE = 14.5 + G, NRIDGE = 17.4 + G, AEAVE = 8.5 + G, ATOP = 10.3 + G
const TRX0 = 9.5, TRX1 = 33.0, TRY0 = -7.0, TRY1 = 5.0, TREAVE = 13.5 + G, TRRIDGE = 17.6 + G
const T = 3.5, TY0 = 19.4, TY1 = 26.4 // tower half width, y range
const S1 = 18.8 + G, S2 = 23.9 + G, SP0 = 29.0 + G, TIP = 38.5 + G

/** A round-headed window panel. */
function roundWin(p: Part, f: Face, s: number, w: number, z0: number, z1: number) {
  const r = w / 2
  flatShape(p, f, [[s - r, z0], [s + r, z0], ...arc(s, z1 - r, r, 0, 180, 8)], 0.06)
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // ============================================================ nave, aisles, transept, chancel
  prismY(brick, NY0, NY1, [[NX0, 0], [NX1, 0], [NX1, NEAVE], [XC, NRIDGE], [NX0, NEAVE]])
  roofY(roof, NY0, NY1 + 0.3, XC, (NX1 - NX0) / 2, NEAVE + 0.1, NRIDGE + 0.1, 0.35, 0.25)
  for (const [xa, xb, outer] of [[AX0, NX0, AX0], [NX1, AX1, AX1]] as [number, number, number][]) {
    box(brick, xa, NY0 + 0.01, xb, NY1, 0, AEAVE, null)
    const inner = outer === AX0 ? xb : xa, o = outer + Math.sign(outer - inner) * 0.3
    prismY(roof, NY0 + 0.01, NY1 + 0.2, [[o, AEAVE - 0.1], [inner, ATOP], [inner, ATOP - 0.25], [o, AEAVE - 0.35]])
    // stone band under the eaves (the corbel table, p2)
    box(trim, Math.min(xa, xb) - (outer === AX0 ? 0.12 : 0), NY0 + 0.01, Math.max(xa, xb) + (outer === AX1 ? 0.12 : 0), NY1 + 0.12, AEAVE - 0.6, AEAVE - 0.3, null)
  }
  prismX(brick, TRX0, TRX1, [[TRY0, 0], [TRY1, 0], [TRY1, TREAVE], [(TRY0 + TRY1) / 2, TRRIDGE], [TRY0, TREAVE]])
  roofX(roof, TRX0 - 0.35, TRX1 + 0.35, (TRY0 + TRY1) / 2, (TRY1 - TRY0) / 2, TREAVE + 0.1, TRRIDGE + 0.1, 0.35, 0.25)
  prismY(brick, -13.0, NY0 + 0.5, [[16.0, 0], [26.0, 0], [26.0, 12.0 + G], [XC, 15.0 + G], [16.0, 12.0 + G]])
  roofY(roof, -13.3, NY0, XC, 5.0, 12.1 + G, 15.1 + G, 0.3, 0.25)
  for (const [xa, xb] of [[12.0, 16.0], [26.0, 30.0]]) box(brick, xa, -12.5, xb, NY0, 0, 5.5 + G, roof)

  // windows: aisle bays with big pointed windows, round-headed clerestory pairs (p2, p4)
  const bays = [8.0, 11.8, 15.6, 19.4]
  for (const y of bays) {
    lancet(win, trim, { o: [AX0, y, 0], n: [-1, 0] }, 0, 1.9, 2.4 + G, 6.4 + G, 2)
    lancet(win, trim, { o: [AX1, y, 0], n: [1, 0] }, 0, 1.9, 2.4 + G, 6.4 + G, 2)
    for (const [x, n] of [[NX0, -1], [NX1, 1]] as [number, number][]) for (const d of [-0.75, 0.75]) roundWin(win, { o: [x, y, 0], n: [n, 0] }, d, 0.9, 11.2 + G, 13.4 + G)
  }
  // transept ends: a rose window over two tall lancets (p4)
  for (const [x, n] of [[TRX0, -1], [TRX1, 1]] as [number, number][]) {
    const f: Face = { o: [x, (TRY0 + TRY1) / 2, 0], n: [n, 0] }
    flatShape(trim, f, arc(0, 12.2 + G, 3.0, 0, 360, 16).slice(0, -1), 0.05)
    flatShape(win, f, arc(0, 12.2 + G, 2.6, 0, 360, 16).slice(0, -1), 0.08)
    for (const s of [-2.2, 2.2]) lancet(win, trim, f, s, 1.8, 1.6 + G, 7.0 + G, 2)
  }
  for (const y of [-11.0, -9.0]) for (const [x, n] of [[16.0, -1], [26.0, 1]] as [number, number][]) lancet(win, null, { o: [x, y, 0], n: [n, 0] }, 0, 1.2, 6.4 + G, 9.6 + G)

  // the front either side of the tower: aisle ends and the nave gable
  for (const s of [-7.7, 7.7]) lancet(win, trim, { o: [XC, NY1, 0], n: [0, 1] }, -s, 1.4, 2.2 + G, 5.6 + G)

  // ============================================================ the tower
  const x0 = XC - T, x1 = XC + T
  box(brick, x0, TY0, x1, TY1, 0, SP0)
  for (const z of [S1, S2]) box(trim, x0 - 0.15, TY0, x1 + 0.15, TY1 + 0.15, z - 0.35, z, trim)
  box(trim, x0 - 0.15, TY0, x1 + 0.15, TY1 + 0.15, 0, 0.9 + G, trim)
  // corner buttresses up the lower stages
  for (const x of [x0, x1]) box(brick, x - 0.45, TY1 - 0.45, x + 0.45, TY1 + 0.45, 0, S2 - 0.4)
  const tf = boxFaces(x0, TY0, x1, TY1)
  const front = tf[2]
  // portal: stone surround, doors and a glazed pointed head, the steep stone gable over it (p1)
  extrudeShape(trim, front, [[-2.2, 0], [2.2, 0], [2.2, 4.0 + G], [1.2, 6.2 + G], [0, 6.9 + G], [-1.2, 6.2 + G], [-2.2, 4.0 + G]], 0, 0.5)
  const pf: Face = { o: [XC, TY1 + 0.5, 0], n: [0, 1] }
  flatShape(door, pf, [[-1.3, 0.9 + G], [1.3, 0.9 + G], [1.3, 3.9 + G], [-1.3, 3.9 + G]], 0.05)
  flatShape(win, pf, [[-1.3, 3.9 + G], [1.3, 3.9 + G], [0.8, 5.0 + G], [0, 5.5 + G], [-0.8, 5.0 + G]], 0.05)
  gablet(trim, front, 0, 5.0, 6.6 + G, 3.8, 0, 0.35)
  // great window and stage-two windows on every face, louvred belfry lancets under gablets
  for (const f of tf) {
    if (f === front) lancet(win, trim, f, 0, 3.1, 11.3 + G, 14.8 + G, 3)
    else if (f !== tf[0]) lancet(win, null, f, 0, 1.3, 11.6 + G, 15.0 + G)
    for (const s of [-1.6, 0, 1.6]) roundWin(win, f, s, 0.85, 19.5 + G, 22.5 + G)
    lancet(slate, trim, f, 0, 1.5, 24.5 + G, 27.6 + G, 2)
    gablet(trim, f, 0, 4.0, SP0 - 0.6, 3.4, -1.8, 0.12)
  }
  // cream stone corner turrets with pinnacles (p3, p4)
  for (const x of [x0, x1]) for (const y of [TY0, TY1]) spike(trim, trim, x, y, 1.3, S2, 30.2 + G, 32.4 + G)
  // the slate spire and its cross
  spire(slate, trim, XC, (TY0 + TY1) / 2, 2.7, SP0, TIP, 2.3)

  // ============================================================ the parish hall and the link block (plain)
  const hall: XY[] = [[-24.3, -33.9], [-1.1, -33.9], [-1.1, 23.0], [-24.3, 23.0]]
  const hx = (hall[0][0] + hall[1][0]) / 2, hhw = (hall[1][0] - hall[0][0]) / 2
  prismY(brick, -33.9, 23.0, [[-24.3, 0], [-1.1, 0], [-1.1, 6.5], [hx, 9.7], [-24.3, 6.5]])
  roofY(roof, -34.2, 23.3, hx, hhw, 6.6, 9.8, 0.3, 0.25)
  box(brick, -13.3, 23.0, -8.8, 26.4, 0, 7.0, roof)
  box(brick, -1.1, 14.6, 9.9, 23.0, 0, 6.5, roof)
  wingWindows(win, ccw(hall), [[1.0, 2.8], [3.8, 5.6]], 3.6, 2.0, 6)
  for (const s of [-3, 0, 3]) panel(win, { o: [4.4, 23.0, 0], n: [0, 1] }, s, 2.0, 1.2, 5.0)

  return finishGlb("Saint Peter's Catholic Church", [
    { part: brick, material: finish('stpeter-brick', 0xb06a56) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: slate, material: finish('stpeter-slate', 0x4f5862) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('stpeter-wood', 0x8a6a4a) },
  ], { bearing: 70, height: TIP + 2.3, replaces: ['way/513681742'] }, 5000)
}

if (import.meta.main) await writeModel('cola-st-peters-church', build())
