/**
 * Hilbert Circle Theatre (1916, Rubush & Hunter; the Circle Theatre, home
 * of the Indianapolis Symphony Orchestra), 45 Monument Circle,
 * Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-hilbert-circle-theatre.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, built in the circle frame of
 * indy-circle-tower.ts (metres from the Soldiers' and Sailors' Monument's
 * axis, turned 1.5 degrees with the downtown grid). The origin is the area
 * centroid of OSM way/340965640, (78.98, -73.65) in that frame
 * (-86.1571448, 39.7678349); bearing 1.5. y = 0 is the street.
 *
 * Identity (from the photos below):
 *  1. The white glazed-terracotta front on the curve of the Circle, wider
 *     than it is tall: a low pediment over the middle three-fifths, urns on
 *     the cornice, a frieze band.
 *  2. The green marquee over the central doors, with the tall picture
 *     window over it, and a big window over a shopfront in each side bay.
 *  3. The plain brick auditorium behind, with its low hipped roof, and the
 *     taller stage house at the far (south) end.
 *
 * Sources
 * - OSM (ODbL): way/340965640 (building=office, no height): the outline,
 *   the front on the Circle at r 75.5..75.7 m from the monument (75.5 used).
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid in the circle frame, heights above the street (218.0 m).
 *   Measured: the front block's roof 9.2..9.7, its front edge 11.3..12.5
 *   (cornice and pediment); a foyer strip x 60..67, y -57..-72 at 14.3;
 *   the auditorium x 67..100.6, y -54..-90, its roof 18.7 at the north
 *   falling to 16.3 at the south with a low ridge near x 84; the stage
 *   house x 67..100.5, y -90..-101.3 at 21.3, a loft x 84..90 to 23.4; an
 *   east strip to x 102.5 at 11.
 * - Published (Wikipedia, "Hilbert Circle Theatre"; NRHP as the Circle
 *   Theatre, 1980): opened 1916, neoclassical, terracotta front; restored
 *   1984 for the symphony.
 * - Photos (Wikimedia Commons):
 *   "Circle Theater.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Circle_Theater.jpg), the front
 *   square on: every facade proportion below is scaled from it against the
 *   21.4 m width of the OSM front;
 *   "Hilbert Circle Theatre - Jan 2012.jpg" (Richie Diesterheft, CC BY-SA
 *   2.0, https://commons.wikimedia.org/wiki/File:Hilbert_Circle_Theatre_-_Jan_2012.jpg),
 *   from the north-west: the marquee's depth, the brick auditorium behind;
 *   "Circle Theatre - Indianapolis.jpg" (Paul Sableman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Circle_Theatre_-_Indianapolis.jpg).
 *
 * Estimated (from "Circle Theater.jpg" and the Jan 2012 photo, ±0.3 m):
 *   cornice 10.4; the low pediment spans all but 1.3 m at each end of the
 *   front, apex 13.1 (the lidar's 12.5 is a 1 m cell blurring the thin
 *   gable); urns at the ends and on the rakes; side windows 5.2..7.8,
 *   4.4 m wide; the picture window 6.5..8.3, 6.6 m wide; the marquee 3.9..6.4,
 *   9.8 m wide, 3 m deep; doors and shopfronts to 3.7.
 * Note: the brief described a big central arched opening and columns; no
 *   photo shows either on today's front (the opening is square-headed and
 *   the bays are framed by flat pilasters), so the model follows the photos.
 * Left out: the frieze's relief figures, the pilasters' panels, the signs
 *   and posters. The auditorium's east and south walls are not photographed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, prism, chamfer, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { circlePts, shifter } from './indy-circle-tower'

const AX = 78.98, AY = -73.65
const S = shifter(AX, AY)
const terra = new Part(), brick = new Part(), roof = new Part(), win = new Part(), door = new Part(), green = new Part()

const R = 75.5
const A0 = (Math.atan2(-57.7, 49.0) * 180) / Math.PI, A1 = (Math.atan2(-41.6, 63.0) * 180) / Math.PI
const AM = (A0 + A1) / 2
const W2 = ((A1 - A0) * Math.PI * R) / 360 // half the front's length along the curve
const D2R = Math.PI / 180
const PH = W2 - 1.3, PZ = 13.1 // the pediment's half-width and apex

/** A point on the front at u metres along the curve from its middle (u > 0 to the north end), d metres out towards the monument. */
const fr = (u: number, d = 0): XY => {
  const a = (AM + u / R / D2R) * D2R, r = R - d
  return [r * Math.cos(a) - AX, r * Math.sin(a) - AY]
}
/** The outward normal (towards the monument) at u. */
const fn = (u: number): XY => { const a = (AM + u / R / D2R) * D2R; return [-Math.cos(a), -Math.sin(a)] }
/** A flat shape on the front at u, in local (s, z) about u. */
const onFront = (part: Part, u: number, poly: XY[], d = 0.06) => { const p = fr(u); flatShape(part, { o: [p[0], p[1], 0], n: fn(u) }, poly, d) }
/** A box tangent to the front at u: s from s0..s1, out d0..d1 towards the monument, z0..z1. */
const tanBox = (wall: Part, top: Part | null, u: number, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, bev = 0) => {
  const n = fn(u), t: XY = [-n[1], n[0]], o = fr(u)
  const P = (s: number, d: number): XY => [o[0] + t[0] * s + n[0] * d, o[1] + t[1] * s + n[1] * d]
  const r = ccw([P(s0, d0), P(s1, d0), P(s1, d1), P(s0, d1)])
  prism(wall, top, bev ? chamfer(r, bev) : r, z0, z1)
}

// ---------------------------------------------------- the masses
// the front block (the lobby), the OSM outline west of the auditorium
const front: XY[] = [...circlePts(R, A0, A1, 8), [67.1, -44.7], [67.1, -88.6]]
prism(terra, roof, S(front), 0, 9.5)
// the facade's own depth, to the cornice
const slab: XY[] = [...circlePts(R, A0, A1, 8), ...circlePts(R + 3.0, A1, A0, 8)]
prism(terra, roof, S(slab), 9.5, 10.0)
// the cornice, projecting
const corn: XY[] = [...circlePts(R - 0.35, A0 - 0.25, A1 + 0.25, 8), ...circlePts(R + 3.0, A1 + 0.25, A0 - 0.25, 8)]
prism(terra, terra, S(corn), 10.0, 10.6)
prism(terra, roof, S([...circlePts(R + 0.1, A0, A1, 8), ...circlePts(R + 2.6, A1, A0, 8)]), 10.6, 11.1)
// the foyer behind, brick
prism(brick, roof, S([[60.0, -72.0], [67.1, -72.0], [67.1, -57.0], [60.0, -57.0]]), 9.5, 14.3)
// the auditorium: brick walls and a low hipped roof
const AUD: XY[] = [[67.1, -90.0], [100.6, -90.0], [100.6, -54.0], [67.1, -54.0]]
prism(brick, null, S(AUD), 0, 16.6)
{
  const r = S(AUD), [x0, y0] = r[0], [x1, y1] = r[2], z0 = 16.6, z1 = 18.8, cx = (x0 + x1) / 2
  const inset = (x1 - x0) / 2
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const rs: V3 = [cx, y0 + inset * 0.6, z1], rn: V3 = [cx, y1 - inset * 0.6, z1]
  roof.tri(a, b, rs); roof.quad(b, c, rn, rs); roof.tri(c, d, rn); roof.quad(d, a, rs, rn)
}
// the stage house at the south end, and its loft
prism(brick, roof, chamfer(S([[67.1, -101.3], [100.5, -101.3], [100.5, -90.0], [67.1, -90.0]]), 0.3), 0, 21.5)
prism(brick, roof, S([[84.0, -99.0], [90.0, -99.0], [90.0, -92.0], [84.0, -92.0]]), 21.5, 23.4)
// the narrow strip on the east
prism(brick, roof, S([[100.6, -82.8], [102.5, -82.8], [102.5, -67.8], [100.6, -67.8]]), 0, 11.0)

// ---------------------------------------------------- the front
// the pediment, low and nearly the full width of the front, on the chord of the front, with a raking cornice
{
  const n = fn(0), t: XY = [-n[1], n[0]], o = fr(0, 0.3)
  const P = (s: number, d: number, z: number): V3 => [o[0] + t[0] * s - n[0] * d, o[1] + t[1] * s - n[1] * d, z]
  const half = PH, zb = 11.1, za = PZ, dep = 1.6
  // front and back gable faces, the two sloping tops
  terra.tri(P(-half, 0, zb), P(half, 0, zb), P(0, 0, za))
  terra.tri(P(half, dep, zb), P(-half, dep, zb), P(0, dep, za))
  terra.quad(P(half, 0, zb), P(half, dep, zb), P(0, dep, za), P(0, 0, za))
  terra.quad(P(-half, dep, zb), P(-half, 0, zb), P(0, 0, za), P(0, dep, za))
  // the tympanum, a shade in from the rake
  flatShape(terra, { o: P(0, 0, 0), n }, [[-half + 1.2, zb + 0.3], [half - 1.2, zb + 0.3], [0, za - 0.45]], 0.0)
  // an acroterion at the apex
  lathe(terra, ...(fr(0, 0.9)), [[0.35, za - 0.2], [0.45, za + 0.25], [0.2, za + 0.7], [0.001, za + 0.8]], 8)
}
// urns at the corners and at the pediment's ends
for (const u of [-W2 + 0.7, -5.2, 5.2, W2 - 0.7]) {
  const [x, y] = fr(u, 0.6), z = Math.abs(u) > PH ? 11.1 : 11.1 + (PZ - 11.1) * (1 - Math.abs(u) / PH) - 0.1
  lathe(terra, x, y, [[0.45, z], [0.45, z + 0.25], [0.25, z + 0.4], [0.55, z + 0.7], [0.5, z + 1.2], [0.2, z + 1.4], [0.001, z + 1.45]], 8)
}
// the pilasters framing the bays, standing a little proud
for (const u of [-W2 + 0.6, -4.7, 4.7, W2 - 0.6]) tanBox(terra, terra, u, -0.6, 0.6, -0.2, 0.25, 0, 10.0, 0.1)
// the frieze band under the cornice
for (const u of [-7.6, 0, 7.6]) onFront(terra, u, u === 0 ? [[-4.0, 8.9], [4.0, 8.9], [4.0, 9.75], [-4.0, 9.75]] : [[-2.7, 8.9], [2.7, 8.9], [2.7, 9.75], [-2.7, 9.75]], 0.12)
// the side bays: a big window over a shopfront
for (const u of [-7.4, 7.4]) {
  onFront(win, u, [[-2.2, 5.2], [2.2, 5.2], [2.2, 7.8], [-2.2, 7.8]])
  onFront(win, u, [[-2.2, 0.4], [2.2, 0.4], [2.2, 3.7], [-2.2, 3.7]])
  // a band of green framing at the shopfront's base and head
  onFront(green, u, [[-2.3, 3.7], [2.3, 3.7], [2.3, 4.0], [-2.3, 4.0]])
}
// the middle bay: the picture window, the doors, the marquee
onFront(win, 0, [[-3.3, 6.5], [3.3, 6.5], [3.3, 8.3], [-3.3, 8.3]])
onFront(door, 0, [[-3.4, 0], [3.4, 0], [3.4, 3.6], [-3.4, 3.6]])
tanBox(green, green, 0, -4.9, 4.9, 0.1, 3.0, 3.9, 6.0, 0.15)
tanBox(green, green, 0, -4.7, 4.7, 0.3, 2.8, 6.0, 6.4)

const built = finishGlb('Hilbert Circle Theatre', [
  { part: terra, material: finish('indy-hilbert-terracotta', 0xf3efe6) },
  { part: brick, material: finish('indy-hilbert-brick', 0xb98e7c) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0xd9c9a0 } },
  { part: green, material: finish('indy-hilbert-marquee', 0x5e8170) },
], { bearing: 1.5, height: 23.4, replaces: ['way/340965640'] }, 5000)
await writeModel('indy-hilbert-circle-theatre', built)
