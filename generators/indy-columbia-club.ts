/**
 * The Columbia Club (1925, Rubush & Hunter), 121 Monument Circle,
 * Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-columbia-club.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the club's own axis.
 * The club stands on the north-east of the Circle, square to it: its front
 * faces south-west to the Soldiers' and Sailors' Monument. Measured in the
 * circle frame of indy-circle-tower.ts, the axis into the building runs
 * (0.6, 0.8), so bearing = 1.5 + 36.87 = 38.37. Here u (model x) runs along
 * the front, v (model y) back from it, from (45.65, 60.3) in the circle
 * frame; the origin is the area centroid of OSM way/338986230, (63.35,
 * 79.74) in the circle frame, (u 2.5, v 26.2), at (-86.1572805, 39.7692254).
 * The front follows the Circle: radius 76.3 about the monument's axis,
 * which sits at (u -0.34, v -75.63). y = 0 is the street (flat).
 *
 * Identity (from the photos below):
 *  1. A ten-storey limestone front on the Circle, Tudor Gothic: a central
 *     bay of grouped mullioned windows (a two-storey hall window low down,
 *     five storeys of grid above, a balcony on top), plain side bays of
 *     paired windows, corner piers rising to finials.
 *  2. The green-copper mansard across the front with one long central
 *     dormer and a small dormer each side, and cresting on top.
 *  3. Red-brown brick on the south-east side and the rear; limestone on the
 *     north-west side over Christ Church; lower 16 m wings behind.
 *
 * Sources
 * - OSM (ODbL): way/338986230 (building=office, building:levels=10): the
 *   outline; the front at r 76.2..76.7 from the monument.
 * - USGS 3DEP lidar: USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016) has a hole over the back half, so the rear is read from
 *   USGS_LPC_IN_MarionCo_2011_LAS_2016 (flown 2011); both 1 m, heights above
 *   the street (218.0). Measured: the main roof flat at 36.8..37.4 over
 *   u -11..12.6, v 0..53, with roof structures to 38.8..39.8; the mansard's
 *   foot at the front edge 31.3 (a cell straddling it); the north-west wing
 *   u -11.3..-6.5, v 12..41 at 15.9..17.8; the south-east wing u 12.6..16.7,
 *   v 20..53 at 14..17.
 * - Published (Wikipedia, "Columbia Club"): built 1925 for the Republican
 *   club, ten storeys, Tudor Gothic Revival, limestone front.
 * - Photos (Wikimedia Commons):
 *   "Columbia Club, Indy.JPG" (Xnatedawgx, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Columbia_Club,_Indy.JPG),
 *   the front square on from the monument: every facade proportion below
 *   is scaled from it against the 22.6 m front;
 *   "The Columbia Club - Monument Circle - Indianapolis.jpg" (Paul
 *   Sableman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:The_Columbia_Club_-_Monument_Circle_-_Indianapolis.jpg),
 *   from the south-west: the brick south-east side, the mansard's ends;
 *   "The Columbia Club - 2012.jpg" (Richie Diesterheft, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:The_Columbia_Club_-_2012.jpg),
 *   from the west: the limestone north-west side.
 *
 * Estimated (from "Columbia Club, Indy.JPG", ±0.4 m): the cornice 32.8
 *   (0.885 of the mansard top), the mansard 1.8 m deep, the central dormer
 *   9.2 m wide to 36.6, the side dormers 1.6 m to 35.8, all standing at the
 *   mansard's foot; the central bay 11.2 m
 *   wide; the window groups and bands as drawn. Left out: the carved
 *   spandrel panels, the oriel's tracery, the flagpoles, the red awning.
 * Doubts: the rear and the wings' walls are not photographed (drawn plain
 *   brick with grouped windows).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, prism, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { prism2, panels } from './indy-circle-tower'

const UA = 2.5, VA = 26.2
const M = (r: XY[]): XY[] => ccw(r.map(([u, v]) => [u - UA, v - VA] as XY))
const stone = new Part(), brick = new Part(), copper = new Part(), roof = new Part(), win = new Part(), door = new Part()

// the front on the Circle
const CU = -0.34, CV = -75.63, R = 76.3
const AM = Math.atan2(R, -CU) // the front's middle (radians), about the monument
const ang = (s: number, d = 0) => AM - s / (R + d)
/** A point on the front at s metres along it (s > 0 to the south-east end), d metres back into the building. */
const fr = (s: number, d = 0): XY => { const a = ang(s, d); return [CU + (R + d) * Math.cos(a) - UA, CV + (R + d) * Math.sin(a) - VA] }
const fn = (s: number): XY => { const a = ang(s); return [-Math.cos(a), -Math.sin(a)] }
const frontPts = (s0: number, s1: number, d: number, n: number): [number, number][] =>
  Array.from({ length: n + 1 }, (_, k) => { const p = fr(s0 + ((s1 - s0) * k) / n, d); return [p[0] + UA, p[1] + VA] })
const onFront = (part: Part, s: number, poly: XY[], dd = 0.06) => { const p = fr(s); flatShape(part, { o: [p[0], p[1], 0], n: fn(s) }, poly, dd) }
/** A box tangent to the front at s: along t0..t1, out o0..o1 towards the monument (negative is inside), z0..z1. */
const tanBox = (wall: Part, top: Part | null, s: number, t0: number, t1: number, o0: number, o1: number, z0: number, z1: number) => {
  const n = fn(s), t: XY = [-n[1], n[0]], o = fr(s)
  const P = (a: number, b: number): XY => [o[0] + t[0] * a + n[0] * b, o[1] + t[1] * a + n[1] * b]
  prism(wall, top, ccw([P(t0, o0), P(t1, o0), P(t1, o1), P(t0, o1)]), z0, z1)
}

const W = 11.3 // half the front
const ZC = 32.8, ZT = 37.0, MD = 1.8 // cornice, mansard top, mansard depth
const rear: [number, number][] = [[11.7, 2.8], [12.6, 18.0], [12.6, 53.5], [6.3, 53.8], [-6.5, 44.4], [-6.5, 12.0], [-W, 12.0]]
const main = M([...frontPts(-W, W, 0, 6), ...rear])
const upper = M([...frontPts(-W + 0.1, W - 0.1, MD, 6), ...rear])
const nwWing = M([[-W, 12.0], [-6.5, 12.0], [-6.5, 44.4], [-W, 40.9]])
const seWing = M([[12.6, 18.0], [14.0, 18.0], [16.6, 34.6], [16.7, 53.3], [12.6, 53.5]])
// brick wherever a wall faces east of the axis or the rear; the front and the north-west side are limestone
const isBrick = (n: XY) => n[0] > 0.3 || n[1] > 0.5
const isFront = (n: XY) => n[1] < -0.8

prism2(stone, brick, roof, main, 0, ZC, isBrick)
prism2(stone, brick, roof, upper, ZC, ZT, isBrick)
prism2(stone, brick, roof, nwWing, 0, 16.2, isBrick)
prism2(stone, brick, roof, seWing, 0, 15.5, isBrick)

// the mansard: copper from the cornice up and back to the flat roof, closed at the ends
{
  const lo = frontPts(-W, W, 0, 6).map(([u, v]) => [u - UA, v - VA] as XY), hi = frontPts(-W + 0.1, W - 0.1, MD, 6).map(([u, v]) => [u - UA, v - VA] as XY)
  for (let i = 0; i < lo.length - 1; i++) {
    const a: V3 = [lo[i][0], lo[i][1], ZC], b: V3 = [lo[i + 1][0], lo[i + 1][1], ZC], c: V3 = [hi[i + 1][0], hi[i + 1][1], ZT], d: V3 = [hi[i][0], hi[i][1], ZT]
    copper.quad(a, b, c, d)
  }
  const e0 = lo[0], f0 = hi[0], e1 = lo[lo.length - 1], f1 = hi[hi.length - 1]
  stone.tri([e0[0], e0[1], ZC], [f0[0], f0[1], ZT], [f0[0], f0[1], ZC])
  brick.tri([e1[0], e1[1], ZC], [f1[0], f1[1], ZC], [f1[0], f1[1], ZT])
  // cresting along the top
  const crest = ccw([...hi, ...frontPts(-W + 0.1, W - 0.1, MD + 0.35, 6).map(([u, v]) => [u - UA, v - VA] as XY).reverse()])
  prism(copper, copper, crest, ZT, ZT + 0.45)
}
// the cornice
prism(stone, stone, ccw([...frontPts(-W, W, -0.45, 6), ...frontPts(-W, W, 0.3, 6).reverse()].map(([u, v]) => [u - UA, v - VA] as XY)), ZC - 0.6, ZC)
// dormers: one long one in the middle, a small one each side
tanBox(copper, copper, 0, -4.6, 4.6, -0.2, -2.6, ZC, 36.6)
onFront(win, 0, [[-4.2, 33.4], [4.2, 33.4], [4.2, 36.0], [-4.2, 36.0]], -0.14)
for (const s of [-8.3, 8.3]) {
  tanBox(copper, copper, s, -0.8, 0.8, -0.2, -2.2, ZC, 35.8)
  onFront(win, s, [[-0.45, 33.6], [0.45, 33.6], [0.45, 35.2], [-0.45, 35.2]], -0.14)
}
// the corner piers rising to finials, and the piers framing the central bay
for (const s of [-W + 0.45, W - 0.45]) {
  tanBox(stone, stone, s, -0.45, 0.45, -0.1, 0.25, 0, ZC + 2.0)
  const [x, y] = fr(s, -0.07)
  lathe(stone, x, y, [[0.4, ZC + 2.0], [0.4, ZC + 2.4], [0.001, ZT + 1.0]], 4, 45, 405)
}
for (const s of [-6.0, 6.0]) tanBox(stone, stone, s, -0.35, 0.35, -0.1, 0.2, 6.1, 29.0)
// the base band and the balcony over the central bay
tanBox(stone, stone, 0, -W, W, -0.1, 0.18, 5.6, 6.1)
tanBox(stone, stone, 0, -6.2, 6.2, -0.1, 0.7, 28.0, 29.0)

// ---------------------------------------------------- the front's windows
// ground floor: the arched entrance, arched windows either side, wide windows in the side bays
onFront(door, 0, [[-1.3, 0], [1.3, 0], [1.3, 3.2], [0.7, 3.9], [0, 4.1], [-0.7, 3.9], [-1.3, 3.2]])
for (const s of [-4.4, -2.6, 2.6, 4.4]) onFront(win, s, [[-0.7, 1.0], [0.7, 1.0], [0.7, 3.6], [0, 4.4], [-0.7, 3.6]])
for (const s of [-8.6, 8.6]) onFront(win, s, [[-1.4, 1.0], [1.4, 1.0], [1.4, 4.5], [-1.4, 4.5]])
// the central bay: three window groups across, in storey bands
const cRows: [number, number][] = [[7.0, 9.2], [10.2, 15.2], [16.2, 21.4], [22.6, 27.4], [29.6, 31.6]]
for (const [z0, z1] of cRows) for (const s of [-3.7, 0, 3.7]) onFront(win, s, [[-1.45, z0], [1.45, z0], [1.45, z1], [-1.45, z1]])
// the side bays: paired windows, two storeys to a group
const sRows: [number, number][] = [[7.0, 9.2], [10.6, 15.2], [16.4, 21.0], [22.4, 27.0], [28.4, 31.4]]
for (const [z0, z1] of sRows) for (const s of [-8.6, 8.6]) onFront(win, s, [[-1.0, z0], [1.0, z0], [1.0, z1], [-1.0, z1]])

// ---------------------------------------------------- the sides and the rear
const notFront = (n: XY) => !isFront(n)
for (const [z0, z1] of [[17.0, 22.6], [23.4, 29.0], [29.8, 32.2]] as [number, number][]) panels(win, main, z0, z1, { bay: 3.4, w: 1.9, margin: 1.4, keep: notFront })
for (const [z0, z1] of [[6.8, 9.4], [10.4, 15.6]] as [number, number][]) panels(win, main, z0, z1, { bay: 3.4, w: 1.9, margin: 1.4, keep: (n, p) => notFront(n) && n[0] > 0.3 && p[1] + VA < 17 })
for (const [z0, z1] of [[3.4, 8.8], [9.8, 15.0]] as [number, number][]) {
  panels(win, nwWing, z0, z1, { bay: 3.4, w: 1.9, margin: 1.4, keep: (n) => n[0] < -0.5 })
  panels(win, seWing, z0, z1, { bay: 3.4, w: 1.9, margin: 1.4, keep: (n) => n[0] > 0.5 })
}

const built = finishGlb('The Columbia Club', [
  { part: stone, material: finish('indy-columbia-limestone', 0xe4dccb) },
  { part: brick, material: finish('indy-columbia-brick', 0x9c5c48) },
  { part: copper, material: finish('indy-columbia-copper', 0x8fc2ab) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 38.37, height: ZT + 1.0, replaces: ['way/338986230'] }, 5000)
await writeModel('indy-columbia-club', built)
