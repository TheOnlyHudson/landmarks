/**
 * The Athenaeum (Das Deutsche Haus, 1893–1898, Vonnegut & Bohn), 401 East
 * Michigan Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-athenaeum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/339788130 (-86.1501608, 39.7735898); the plan is
 * turned 2.3 degrees clockwise from true north (the outline's walls agree),
 * so the building is drawn square and placed at bearing 2.3. Michigan
 * Street runs along the north face (y 22.6), New Jersey Street along the
 * west face (x -23.1).
 *
 * Identity (from the photos below):
 *  1. The tall hall wing on New Jersey Street under a steep hipped slate
 *     roof with a flat crest and small dormers, red brick banded with
 *     limestone, round-headed windows above.               (NW, S, lidar)
 *  2. Its north end on Michigan Street: a stepped German Renaissance gable
 *     with pinnacles, a great three-light window and the arched stone
 *     entrance below.                                                 (NW)
 *  3. The three-storey Michigan Street wing: big round-headed windows on a
 *     rusticated limestone base, a steep slate mansard with gables, and
 *     round corner towers with conical caps.                    (N, NW)
 *  4. The lower hip-roofed block behind (the gymnasium end) with its row of
 *     round windows.                                              (S, lidar)
 *
 * Sources
 * - OSM (ODbL): way/339788130 (building=retail, "The Athenaeum"): the hall
 *   wing x -23.1..2.2, y -34..22.6; the Michigan wing x 1.3..38.6, y 1.8
 *   (12 east of x 18.2)..22.6; the rear block x 18.2..37.6, y -14.9..12;
 *   the round north-east tower (the outline's bulge about (36.3, 21.8));
 *   low annexes to the south (x -17.4..-1.7, y -38.4..-34; x 1.3..6.4,
 *   y -37.5..-28).
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame (tools/lidar_frame.py), ground
 *   0.5 m over the grid minimum. Measured: the hall wing's eaves 15.5 m,
 *   its roof rising at about 47 degrees to a flat crest 24.9 m on x -10.5,
 *   hipped at the south, a gable at the north; the Michigan wing's flat top
 *   14.7 m behind a steep front slope; the rear block's walls 10 m, ridge
 *   13.4 m on x 28.5; the south annexes 6.5 m and 4.5 m.
 * - Published (NRHP 1973; Wikipedia "Athenæum (Indianapolis)"): built
 *   1893–94 (east part) and 1897–98 (west part), German Renaissance Revival,
 *   red brick and limestone.
 * - Photos (Wikimedia Commons):
 *   "Athenæum, Das Deutsche Haus, front.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Athen%C3%A6um,_Das_Deutsche_Haus,_front.jpg),
 *   the corner of Michigan and New Jersey from the north-west;
 *   "Athenæum, Das Deutsche Haus, rear.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Athen%C3%A6um,_Das_Deutsche_Haus,_rear.jpg),
 *   the hall wing's south end and the rear block from the south;
 *   "Athenæum (Das Deutsche Haus).jpg" (LeeHarveyKennedy, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Athen%C3%A6um_(Das_Deutsche_Haus).jpg),
 *   a street panorama of the Michigan Street front.
 *
 * Estimated (from the photos against the lidar heights): the stepped
 *   gable's top 27 m and its steps; the towers (walls 15 m, caps to 20 and
 *   22 m); the window rows and sizes; the Michigan wing's gables and their
 *   places; the dormers. The east and south faces are drawn from the rear
 *   photo only roughly.
 * Left out: carving, cartouches, balconies and balustrades, the Rathskeller
 *   canopy, the beer garden in the courtyard (outside the outline).
 * Night: windows glow; the doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, lathe, flatShape, extrudeShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { poly, gable, ringOnFace } from './indy-st-john-the-evangelist'
import { box } from './indy-world-war-memorial'

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), door = new Part()

// ---------------------------------------------------- the hall wing (New Jersey Street)
const WX0 = -23.1, WX1 = 2.2, WY0 = -34.0, WY1 = 22.6
const WE = 15.5, WTOP = 24.9, XC = (WX0 + WX1) / 2, CR = 3.0 // half-width of the flat crest
{
  prism(brick, null, rect(WX0, WY0, WX1, WY1), 0, WE)
  // the limestone base and the banding of the lower storey, the cornice
  prism(stone, null, rect(WX0 - 0.1, WY0 - 0.1, WX1 + 0.1, WY1 + 0.1), 0, 1.4)
  for (const z of [2.6, 3.8, 5.0]) prism(stone, null, rect(WX0 - 0.05, WY0 - 0.05, WX1 + 0.05, WY1 + 0.05), z - 0.35, z)
  prism(stone, null, rect(WX0 - 0.08, WY0 - 0.08, WX1 + 0.08, WY1 + 0.08), 8.6, 9.0)
  prism(stone, null, rect(WX0 - 0.4, WY0 - 0.4, WX1 + 0.4, WY1 + 0.4), WE - 0.6, WE)
  // the roof: hipped to the south, gabled to the north, flat on the crest
  const o = 0.4, ze = WE, k = (WTOP - WE) / (XC - CR - WX0)
  const ys = WY0 + (WTOP - WE) / k
  const A: V3 = [WX0 - o, WY0 - o, ze], B: V3 = [WX1 + o, WY0 - o, ze], C: V3 = [WX1 + o, WY1, ze], D: V3 = [WX0 - o, WY1, ze]
  const P: V3 = [XC - CR, ys, WTOP], Q: V3 = [XC + CR, ys, WTOP], R: V3 = [XC + CR, WY1, WTOP], S: V3 = [XC - CR, WY1, WTOP]
  poly(slate, [A, P, S, D], [-1, 0, 1])
  poly(slate, [B, C, R, Q], [1, 0, 1])
  poly(slate, [A, B, Q, P], [0, -1, 1])
  poly(slate, [P, Q, R, S], [0, 0, 1])
  // the north end wall under the roof (behind the stepped gable)
  poly(brick, [[WX0, WY1, ze], [WX1, WY1, ze], [XC + CR, WY1, WTOP], [XC - CR, WY1, WTOP]], [0, 1, 0])
  // a small cupola on the crest at the south end
  box(slate, slate, XC - 0.8, ys + 0.6, XC + 0.8, ys + 2.2, WTOP, WTOP + 1.4)
  lathe(slate, XC, ys + 1.4, [[0.6, WTOP + 1.4], [0.001, WTOP + 3.2]], 8)

  // the west face: banded ground storey, square windows, round-headed windows above, dormers
  const f: Face = { o: [WX0, 0, 0], n: [-1, 0] }
  const bays = [-30.0, -24.5, -19.0, -13.5, -8.0, -2.5, 3.0, 8.5]
  for (const y of bays) {
    const s = -y
    flatShape(win, f, rect(s - 0.8, 1.9, s + 0.8, 4.4), 0.06)
    flatShape(win, f, rect(s - 0.8, 5.8, s + 0.8, 8.2), 0.06)
    flatShape(win, f, archShape(s, 2.0, 9.6, 12.6, 8), 0.06)
    // a dormer over every other bay
    if (Math.round((y + 30) / 5.5) % 2 === 0) {
      const x0 = WX0 + 0.8
      box(brick, null, x0, y - 0.8, x0 + 1.8, y + 0.8, WE - 0.2, WE + 2.2)
      gable(brick, slate, x0 + 0.9, y, 1.8, 1.6, 0, WE + 2.2, WE + 3.3, 0.15)
      flatShape(win, { o: [x0, y, 0], n: [-1, 0] }, rect(-0.45, WE + 0.3, 0.45, WE + 1.8), 0.06)
    }
  }
  // the east face, toward the courtyard
  const fe: Face = { o: [WX1, 0, 0], n: [1, 0] }
  for (const y of [-26.0, -20.0, -14.0, -8.0]) {
    flatShape(win, fe, archShape(y, 2.0, 9.6, 12.6, 8), 0.06)
    flatShape(win, fe, rect(y - 0.8, 5.8, y + 0.8, 8.2), 0.06)
  }
  // the south end: a row of round windows, small windows below
  const fs: Face = { o: [XC, WY0, 0], n: [0, -1] }
  for (const s of [-8.0, -4.0, 0, 4.0, 8.0]) {
    ringOnFace(stone, fs, s, 11.6, 0.55, 0.8, 10, 0.08)
    flatShape(win, fs, arc(s, 11.6, 0.58, 0, 360, 10).slice(0, -1), 0.06)
    flatShape(win, fs, rect(s - 0.6, 8.0, s + 0.6, 9.8), 0.06)
  }
}

// ---------------------------------------------------- the stepped gable on Michigan Street
{
  const GX0 = -18.4, GX1 = -3.4, gc = (GX0 + GX1) / 2, hw = (GX1 - GX0) / 2, y = WY1 + 0.6
  box(brick, null, GX0, WY1, GX1, y, 0, WE)
  const f: Face = { o: [gc, y, 0], n: [0, 1] }
  // the stepped outline, in three stages, a finial on top
  const steps: XY[] = [[-hw, WE], [hw, WE], [hw, 18.0], [hw - 2.0, 18.0], [hw - 2.0, 21.0], [hw - 4.0, 21.0], [hw - 4.0, 24.0], [2.0, 24.0], [2.0, 26.2], [-2.0, 26.2], [-2.0, 24.0], [-hw + 4.0, 24.0], [-hw + 4.0, 21.0], [-hw + 2.0, 21.0], [-hw + 2.0, 18.0], [-hw, 18.0]]
  extrudeShape(brick, f, steps, -0.9, 0)
  flatShape(brick, { o: [gc, y - 0.9, 0], n: [0, -1] }, steps.map(([s, z]) => [-s, z] as XY), 0)
  // stone copings on each step and pinnacles at the corners
  for (const [s0, s1, z] of [[-hw, -hw + 2.0, 18.0], [hw - 2.0, hw, 18.0], [-hw + 2.0, -hw + 4.0, 21.0], [hw - 4.0, hw - 2.0, 21.0], [-hw + 4.0, -2.0, 24.0], [2.0, hw - 4.0, 24.0], [-2.0, 2.0, 26.2]] as [number, number, number][]) {
    const x0 = gc - s1, x1 = gc - s0 // s runs westward on a north face
    box(stone, stone, x0 - 0.1, y - 1.0, x1 + 0.1, y + 0.15, z, z + 0.35)
  }
  for (const s of [-hw + 0.35, hw - 0.35, -hw + 2.35, hw - 2.35]) {
    const x = gc - s, z0 = Math.abs(s) > hw - 1 ? 18.35 : 21.35
    box(stone, stone, x - 0.3, y - 0.3, x + 0.3, y + 0.3, z0, z0 + 1.2)
  }
  lathe(stone, gc, y - 0.4, [[0.35, 26.55], [0.35, 27.4], [0.001, 28.4]], 8)
  // stone pilasters up the gable front
  for (const s of [-hw + 0.5, -2.6, 2.6, hw - 0.5]) box(stone, null, gc - s - 0.45, y, gc - s + 0.45, y + 0.3, 1.4, WE)
  // the arched stone entrance, the great window, the gable's windows
  extrudeShape(stone, f, archShape(0, 4.4, 0, 3.6, 10), 0, 0.35)
  flatShape(door, f, archShape(0, 2.8, 0, 3.2, 10), 0.38)
  extrudeShape(stone, f, rect(-2.2, 8.8, 2.2, 14.2), 0, 0.12)
  for (const s of [-1.4, 0, 1.4]) flatShape(win, f, rect(s - 0.55, 9.2, s + 0.55, 13.8), 0.16)
  for (const s of [-4.8, 4.8]) {
    flatShape(win, f, rect(s - 0.7, 6.0, s + 0.7, 8.2), 0.06)
    flatShape(win, f, rect(s - 0.7, 10.0, s + 0.7, 13.2), 0.06)
    ringOnFace(stone, f, s, 16.4, 0.5, 0.75, 10, 0.08)
    flatShape(win, f, arc(s, 16.4, 0.52, 0, 360, 10).slice(0, -1), 0.06)
  }
  flatShape(win, f, archShape(0, 1.6, 17.6, 19.4, 6), 0.06)
  flatShape(win, f, rect(-0.5, 21.8, 0.5, 23.2), 0.06)
}

// ---------------------------------------------------- the Michigan Street wing
{
  const MX0 = WX1, MX1 = 38.6, MY0 = 1.8, MY1 = 22.6, MH = 12.5, MTOP = 14.7, SET = 2.4
  const fp: XY[] = [[MX0, MY0], [18.2, MY0], [18.2, 12.0], [MX1, 12.0], [MX1, MY1], [MX0, MY1]]
  prism(brick, null, fp, 0, MH)
  // the base and cornice, pushed out on every face (the west end abuts the hall wing)
  const grow = (d: number): XY[] => [[MX0, MY0 - d], [18.2 + d, MY0 - d], [18.2 + d, 12.0 - d], [MX1 + d, 12.0 - d], [MX1 + d, MY1 + d], [MX0, MY1 + d]]
  prism(stone, null, grow(0.12), 0, 3.0)
  prism(stone, null, grow(0.3), MH - 0.5, MH)
  // the flat top behind a steep slate front
  const back: XY[] = [[MX0, MY0], [18.2, MY0], [18.2, 12.0], [MX1, 12.0], [MX1, MY1 - SET], [MX0, MY1 - SET]]
  prism(brick, slate, back, MH, MTOP)
  poly(slate, [[MX0, MY1 + 0.3, MH], [MX1 + 0.3, MY1 + 0.3, MH], [MX1, MY1 - SET, MTOP], [MX0, MY1 - SET, MTOP]], [0, 1, 1])
  poly(slate, [[MX1 + 0.3, MY1 + 0.3, MH], [MX1 + 0.3, MY1 - SET, MH], [MX1, MY1 - SET, MTOP]], [1, 0, 0])
  // the front: two tiers of round-headed windows over a limestone base
  const f: Face = { o: [0, MY1, 0], n: [0, 1] }
  for (const x of [7.5, 12.5, 17.5, 22.5]) {
    flatShape(win, f, archShape(-x, 2.6, 4.2, 6.8, 8), 0.06)
    flatShape(win, f, archShape(-x, 2.6, 8.4, 10.8, 8), 0.06)
    flatShape(win, f, rect(-x - 1.0, 1.0, -x + 1.0, 2.4), 0.06)
  }
  for (const x of [28.0, 31.5]) {
    flatShape(win, f, rect(-x - 0.7, 4.4, -x + 0.7, 6.8), 0.06)
    flatShape(win, f, archShape(-x, 1.4, 8.4, 10.6, 6), 0.06)
  }
  // two gables in the slate front, with a window each (their copings left out)
  for (const [x, w, h] of [[29.8, 6.4, 18.0], [5.5, 3.2, 16.2]] as [number, number, number][]) {
    const pts: XY[] = [[-x - w / 2, MH], [-x + w / 2, MH], [-x + w / 2, h - 1.6], [-x, h], [-x - w / 2, h - 1.6]]
    extrudeShape(brick, f, pts, -SET, 0)
    flatShape(brick, { o: [0, MY1 - SET, 0], n: [0, -1] }, pts.map(([u, z]) => [-u, z] as XY), 0)
    flatShape(win, f, archShape(-x, Math.min(1.8, w / 2.5), MH + 0.6, h - 3.0, 6), 0.06)
  }
  // the east face
  const fe: Face = { o: [MX1, 17.3, 0], n: [1, 0] }
  for (const s of [-3.0, 0.5]) flatShape(win, fe, archShape(s, 1.6, 8.4, 10.6, 6), 0.06)
}

// ---------------------------------------------------- the round towers
for (const [x, y, r, h, top] of [[36.3, 21.8, 2.5, 15.2, 22.0], [3.6, 22.4, 2.1, 15.0, 20.2]] as [number, number, number, number, number][]) {
  lathe(brick, x, y, [[r, 0], [r, h]], 12)
  lathe(stone, x, y, [[r + 0.12, 0], [r + 0.12, 3.0]], 12)
  lathe(stone, x, y, [[r + 0.1, h - 0.6], [r + 0.3, h - 0.3], [r + 0.3, h], [r + 0.05, h]], 12)
  lathe(slate, x, y, [[r + 0.3, h], [0.001, top]], 12)
  lathe(slate, x, y, [[0.12, top], [0.08, top + 1.2], [0.001, top + 1.3]], 4)
  for (const a of [40, 90, 140]) {
    const t = (a * Math.PI) / 180, f: Face = { o: [x + r * Math.cos(t), y + r * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }
    for (const [z0, z1] of [[4.6, 6.8], [8.6, 10.8], [12.0, 13.8]]) flatShape(win, f, rect(-0.5, z0, 0.5, z1), 0.06)
  }
}

// ---------------------------------------------------- the rear block (the gymnasium's end)
{
  const RX0 = 18.2, RX1 = 37.6, RY0 = -14.9, RY1 = 12.0, RH = 10.0, RR = 13.4, rc = 28.5
  prism(brick, null, rect(RX0, RY0, RX1, RY1), 0, RH)
  prism(stone, null, rect(RX0 - 0.25, RY0 - 0.25, RX1 + 0.25, RY1), RH - 0.4, RH)
  const o = 0.3, hx = (RX1 - RX0) / 2 + o
  const A: V3 = [RX0 - o, RY0 - o, RH], B: V3 = [RX1 + o, RY0 - o, RH], C: V3 = [RX1 + o, RY1, RH], D: V3 = [RX0 - o, RY1, RH]
  const P: V3 = [rc, RY0 - o + hx, RR], Q: V3 = [rc, RY1, RR]
  poly(slate, [A, P, Q, D], [-1, 0, 1])
  poly(slate, [B, C, Q, P], [1, 0, 1])
  poly(slate, [A, B, P], [0, -1, 1])
  // round windows along the east and south, square windows below
  const fe: Face = { o: [RX1, (RY0 + RY1) / 2, 0], n: [1, 0] }
  for (const s of [-10.5, -6.0, -1.5, 3.0, 7.5, 11.5]) {
    ringOnFace(stone, fe, s, 7.6, 0.55, 0.8, 10, 0.08)
    flatShape(win, fe, arc(s, 7.6, 0.58, 0, 360, 10).slice(0, -1), 0.06)
    flatShape(win, fe, rect(s - 0.6, 3.0, s + 0.6, 4.8), 0.06)
  }
  const fs: Face = { o: [rc, RY0, 0], n: [0, -1] }
  for (const s of [-6.0, -2.0, 2.0, 6.0]) {
    ringOnFace(stone, fs, s, 7.6, 0.55, 0.8, 10, 0.08)
    flatShape(win, fs, arc(s, 7.6, 0.58, 0, 360, 10).slice(0, -1), 0.06)
  }
}

// ---------------------------------------------------- the low south annexes
{
  box(brick, null, -17.4, -38.4, -1.7, WY0, 0, 5.4)
  prism(stone, null, rect(-17.6, -38.6, -1.5, WY0), 5.0, 5.4)
  gable(null, slate, -9.55, -36.2, 16.3, 4.8, 0, 5.4, 6.8, 0.3)
  const f: Face = { o: [-9.55, -38.4, 0], n: [0, -1] }
  for (const s of [-4.5, 0, 4.5]) flatShape(win, f, rect(s - 1.3, 1.4, s + 1.3, 3.6), 0.06)
  box(brick, slate, 1.3, -37.5, 6.4, -28.1, 0, 4.5)
  box(brick, slate, WX1, -28.1, 4.4, -16.4, 0, 3.6)
}

const built = finishGlb('The Athenaeum', [
  { part: brick, material: finish('indy-athenaeum-brick', 0xab604b) },
  { part: stone, material: finish('indy-athenaeum-limestone', 0xe6ddcb) },
  { part: slate, material: finish('indy-athenaeum-slate', 0x7e858c) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('entrance', 0x8a6a4c) },
], { bearing: 2.3, height: 28.4, replaces: ['way/339788130'] }, 5000)
await writeModel('indy-athenaeum', built)
