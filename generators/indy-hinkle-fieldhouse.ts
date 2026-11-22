/**
 * Hinkle Fieldhouse (1928, Fermor Spencer Cannon; National Historic
 * Landmark 1987), Butler University, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-hinkle-fieldhouse.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/218977026 (-86.1673981, 39.8435922); the outline's
 * long walls run within 0.4 degrees of east-west, so the model is drawn
 * square and placed at bearing 0.
 *
 * Identity (from the photos below):
 *  1. A long red-brick hall under a low barrel roof running east-west, with
 *     a continuous glazed monitor along its crown.             (S, SE, lidar)
 *  2. The end walls: great segmental-arched brick gables, divided by brick
 *     pilasters whose limestone caps step up over the arch, with tall
 *     multi-pane windows rising under the arch.                     (SE, SW)
 *  3. The long side walls in pilastered bays, each capped with a pale
 *     limestone gablet above the parapet; paired windows; a stone sill
 *     course; three arched windows over the south entrance.           (S)
 *  4. The lower two-storey annex against the west gable.          (SW, lidar)
 *
 * Sources
 * - OSM (ODbL): way/218977026 (building=university, "Hinkle Fieldhouse"):
 *   the hall x -38.2..64.6, y -30.6..32.2; the annex x -69.7..-38.2,
 *   y -28.1..28.3.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame (tools/lidar_frame.py), ground
 *   15.2 m over the grid minimum, flat. Measured: the side parapets 13.3 to
 *   14.3 m; the roof rising to about 23.3 m some 15 m in from each wall; the
 *   monitor's crown 26.3 m at its edges to 27.0 m on the axis; the annex
 *   9.5 m, its middle block (x -56..-38, y -22..25) 13.1 m.
 * - Published (NRHP nomination / Wikipedia "Hinkle Fieldhouse"): 1928,
 *   brick and limestone, steel arched-truss roof; once the largest
 *   basketball arena in the US.
 * - Photos:
 *   "Hinkle Fieldhouse - 01-2012.jpg" (Richie Diesterheft, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Hinkle_Fieldhouse_-_01-2012.jpg),
 *   the south side and west gable over the annex from the south-west: bays,
 *   windows, the entrance arches, the monitor, the annex;
 *   "The Field House, Butler University, Indianapolis, Indiana (74725).jpg"
 *   (Tichnor Brothers postcard, public domain,
 *   https://commons.wikimedia.org/wiki/File:The_Field_House,_Butler_University,_Indianapolis,_Indiana_(74725).jpg),
 *   the east gable from the south-east: pilasters, the tall windows.
 *
 * Estimated (from the photos against the lidar heights): the gable arch's
 *   apex 28.0 m (it stands about a metre over the monitor in both photos);
 *   15 bays of 6.9 m on the long walls, 8 bays on the gables; every window's
 *   size and height; the sill course 4.6 m. The north side is unphotographed
 *   and drawn like the south, without the entrance.
 * Left out: the roof lettering, the entrance canopies' arches (an open
 *   slab on posts here), plaques, lamps, the ticket booths.
 * Night: windows and the monitor glow; the doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, flatShape, extrudeShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, ringBand } from './indy-world-war-memorial'

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

const X0 = -38.2, X1 = 64.6, Y0 = -30.6, Y1 = 32.2
const YC = (Y0 + Y1) / 2, HW = (Y1 - Y0) / 2
const EAVE = 14.2, APEX = 28.0
const SAG = APEX - EAVE, R = (HW * HW + SAG * SAG) / (2 * SAG), ZC = EAVE - (R - SAG)
/** The gable arch's height at s across the end wall. */
const archZ = (s: number) => ZC + Math.sqrt(Math.max(0, R * R - s * s))

// ---------------------------------------------------- the hall's walls
prism(brick, null, rect(X0, Y0, X1, Y1), 0, EAVE)
ringBand(stone, X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, EAVE - 0.1, EAVE + 0.3, 0.8)
// the plinth and the sill course
prism(stone, null, rect(X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1), 0, 0.8)
prism(stone, null, rect(X0 - 0.08, Y0 - 0.08, X1 + 0.08, Y1 + 0.08), 4.4, 4.8)

// ---------------------------------------------------- the long walls
const NB = 15, BAY = (X1 - X0) / NB
for (const [y, sg] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
  const f: Face = { o: [0, y, 0], n: [0, sg] }
  const S = (x: number) => (sg < 0 ? x : -x)
  for (let k = 0; k <= NB; k++) {
    const x = X0 + k * BAY, corner = k === 0 || k === NB
    const w = corner ? 1.6 : 1.0, d = corner ? 0.6 : 0.45
    const xa = k === 0 ? X0 - d : k === NB ? X1 + d - w : x - w / 2
    const ya = sg < 0 ? y - d : y, yb = sg < 0 ? y : y + d
    box(brick, null, xa, ya, xa + w, yb, 0, EAVE + 0.6)
    // the limestone cap, a little gablet over the parapet
    box(stone, stone, xa - 0.15, ya - (sg < 0 ? 0.15 : 0), xa + w + 0.15, yb + (sg > 0 ? 0.15 : 0), EAVE + 0.6, EAVE + 1.2)
    const fy = sg < 0 ? ya - 0.15 : yb + 0.15
    extrudeShape(stone, { o: [0, fy, 0], n: [0, sg] }, [[S(xa - 0.15), EAVE + 1.2], [S(xa + w + 0.15), EAVE + 1.2], [S(xa + w / 2), EAVE + 2.0]], -(d + 0.3), 0)
  }
  for (let k = 0; k < NB; k++) {
    const xc = X0 + (k + 0.5) * BAY, s = S(xc)
    const entrance = sg < 0 && k === 2
    for (const o of [-1.0, 1.0]) flatShape(win, f, rect(s + o - 0.6, 8.2, s + o + 0.6, 10.8), 0.06)
    if (entrance) {
      // three arched windows over the doors
      for (const o of [-2.0, 0, 2.0]) {
        flatShape(win, f, archShape(s + o, 1.5, 4.9, 6.3, 8), 0.06)
        flatShape(door, f, rect(s + o - 0.75, 0.8, s + o + 0.75, 3.4), 0.06)
      }
    } else for (const o of [-1.0, 1.0]) flatShape(win, f, rect(s + o - 0.6, 1.5, s + o + 0.6, 3.5), 0.06)
    // a raised parapet panel with a plaque over every other bay
    if (k % 2 === 1) flatShape(stone, f, rect(s - 0.5, EAVE - 1.6, s + 0.5, EAVE - 0.6), 0.08)
  }
  // the south entrance's canopy: a slab on posts
  if (sg < 0) {
    const xc = X0 + 2.5 * BAY
    box(roof, roof, xc - 3.4, y - 3.2, xc + 3.4, y, 3.4, 3.7)
    for (const dx of [-3.1, 3.1]) box(roof, null, xc + dx - 0.12, y - 3.0, xc + dx + 0.12, y - 2.76, 0, 3.4)
  }
}

// ---------------------------------------------------- the gables
const GB = 8, GBAY = (2 * HW) / GB
for (const [x, sg] of [[X1, 1], [X0, -1]] as [number, number][]) {
  const f: Face = { o: [x, YC, 0], n: [sg, 0] }
  const back: Face = { o: [x - sg * 0.9, YC, 0], n: [-sg, 0] }
  // the gable wall above the eaves, front and back
  const outline: XY[] = [[-HW, EAVE - 0.2], [HW, EAVE - 0.2], ...arc(0, ZC, R, Math.acos(HW / R) * 180 / Math.PI, 180 - Math.acos(HW / R) * 180 / Math.PI, 16).slice(1, -1)]
  extrudeShape(brick, f, outline, -0.9, 0)
  flatShape(brick, back, outline.map(([s, z]) => [-s, z] as XY), 0)
  // the stone coping along the arch
  {
    const a0 = Math.acos(HW / R) * 180 / Math.PI, a1 = 180 - a0
    const band: XY[] = [...arc(0, ZC, R + 0.45, a0, a1, 16), ...arc(0, ZC, R - 0.05, a1, a0, 16)]
    extrudeShape(stone, f, band, -1.05, 0.15)
    flatShape(stone, back, band.map(([s, z]) => [-s, z] as XY), 0.15)
  }
  // pilasters, their caps stepping up over the arch
  for (let k = 1; k < GB; k++) {
    const s = -HW + k * GBAY, top = archZ(Math.abs(s) + 0.5) + 0.7
    const y = sg > 0 ? YC + s : YC - s
    const xa = sg > 0 ? x : x - 0.45, xb = sg > 0 ? x + 0.45 : x
    box(brick, null, xa, y - 0.5, xb, y + 0.5, 0, top)
    box(stone, stone, xa - (sg < 0 ? 0.15 : 0), y - 0.65, xb + (sg > 0 ? 0.15 : 0), y + 0.65, top, top + 0.7)
  }
  // windows: two low rows in every bay, tall windows rising under the arch
  for (let k = 0; k < GB; k++) {
    const s0 = -HW + k * GBAY, sc = s0 + GBAY / 2, outer = Math.max(Math.abs(s0), Math.abs(s0 + GBAY))
    const edge = k === 0 || k === GB - 1, hw = edge ? 1.5 : 2.0
    if (sg > 0) {
      flatShape(win, f, rect(sc - 2.0, 1.5, sc + 2.0, 3.5), 0.06)
      flatShape(win, f, rect(sc - 2.0, 5.6, sc + 2.0, 7.4), 0.06)
    }
    const top = edge ? 11.8 : archZ(outer) - 1.8, bot = sg > 0 ? 9.6 : 14.0
    if (top - bot > 1.5) {
      flatShape(win, f, rect(sc - hw, bot, sc + hw, top), 0.06)
      // the eaves' stone band runs across the tall lights as a transom
    }
  }
}

// ---------------------------------------------------- the barrel roof and its monitor
{
  const XR0 = X0 + 0.3, XR1 = X1 - 0.3
  // half profile from the wall to the axis: [distance from the axis, z]
  const half: [number, number][] = [[HW - 0.6, 13.7], [HW - 4, 15.8], [HW - 8, 18.4], [HW - 12, 21.3], [HW - 15.5, 23.2], [11.0, 23.5]]
  const top: [number, number][] = [[11.0, 26.2], [7.5, 26.6], [3.8, 26.9], [0, 27.0]]
  const strip = (part: Part, a: [number, number], b: [number, number], sg: number) => {
    const A0: V3 = [XR0, YC + sg * a[0], a[1]], A1: V3 = [XR1, YC + sg * a[0], a[1]]
    const B0: V3 = [XR0, YC + sg * b[0], b[1]], B1: V3 = [XR1, YC + sg * b[0], b[1]]
    // outward: up and away from the axis
    const n: V3 = [0, sg * (b[1] - a[1]), -(b[0] - a[0])]
    const up: V3 = n[2] < 0 ? [-n[0], -n[1], -n[2]] : n
    roofQuad(part, A0, A1, B1, B0, up)
  }
  for (const sg of [-1, 1]) {
    for (let i = 0; i + 1 < half.length; i++) strip(roof, half[i], half[i + 1], sg)
    // the monitor's glazed side, facing out
    const a = half[half.length - 1], b = top[0]
    roofQuad(win, [XR0, YC + sg * a[0], a[1]], [XR1, YC + sg * a[0], a[1]], [XR1, YC + sg * b[0], b[1]], [XR0, YC + sg * b[0], b[1]], [0, sg, 0])
    // its piers: a mullion every bay
    for (let k = 1; k < NB; k++) {
      const x = X0 + k * BAY
      box(roof, null, x - 0.25, YC + sg * a[0] - 0.25, x + 0.25, YC + sg * a[0] + 0.25, a[1], b[1])
    }
    for (let i = 0; i + 1 < top.length; i++) strip(roof, top[i], top[i + 1], sg)
  }
}
function roofQuad(part: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const g: V3 = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0) part.quad(d, c, b, a)
  else part.quad(a, b, c, d)
}

// ---------------------------------------------------- the west annex
{
  const AX0 = -69.7, AY0 = -28.1, AY1 = 28.3, AH = 9.5
  box(brick, roof, AX0, AY0, X0, AY1, 0, AH)
  ringBand(stone, AX0 - 0.12, AY0 - 0.12, X0, AY1 + 0.12, AH - 0.1, AH + 0.4, 0.5)
  prism(stone, null, rect(AX0 - 0.1, AY0 - 0.1, X0, AY1 + 0.1), 0, 0.8)
  // its middle block, higher
  box(brick, roof, -56.0, -22.0, X0, 25.0, AH, 13.1)
  prism(stone, roof, rect(-56.15, -22.15, X0, 25.15), 12.8, 13.3)
  // big multi-pane windows: three on each long side, four on the west
  for (const [y, sg] of [[AY0, -1], [AY1, 1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sg] }
    const S = (x: number) => (sg < 0 ? x : -x)
    for (const xc of [-64.0, -54.0, -44.0]) {
      flatShape(win, f, rect(S(xc) - 2.4, 2.0, S(xc) + 2.4, 7.4), 0.06)
      flatShape(stone, f, rect(S(xc) - 2.4, 4.6, S(xc) + 2.4, 4.8), 0.08)
    }
    for (const x of [AX0 + 0.3, -59.0, -49.0, X0 - 0.4]) box(brick, stone, x - 0.4, sg < 0 ? y - 0.35 : y, x + 0.4, sg < 0 ? y : y + 0.35, 0, AH + 0.7)
  }
  {
    const f: Face = { o: [AX0, 0, 0], n: [-1, 0] }
    for (const yc of [-20.0, -7.0, 7.0, 20.0]) flatShape(win, f, rect(-yc - 2.2, 2.0, -yc + 2.2, 7.4), 0.06)
  }
  // the middle block's small windows
  for (const [y, sg] of [[-22.0, -1], [25.0, 1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sg] }
    for (const xc of [-52.0, -47.0, -42.0]) flatShape(win, f, rect((sg < 0 ? xc : -xc) - 0.7, 10.6, (sg < 0 ? xc : -xc) + 0.7, 12.0), 0.06)
  }
}

const built = finishGlb('Hinkle Fieldhouse', [
  { part: brick, material: finish('indy-hinkle-brick', 0xa95e48) },
  { part: stone, material: finish('indy-hinkle-limestone', 0xe8e1d2) },
  { part: roof, material: finish('indy-hinkle-roof', 0xa3a7aa) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('entrance', 0x8a6a4c) },
], { bearing: 0, height: APEX + 0.8, replaces: ['way/218977026'] }, 5000)
await writeModel('indy-hinkle-fieldhouse', built)
