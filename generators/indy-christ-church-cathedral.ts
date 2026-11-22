/**
 * Christ Church Cathedral (1857, William Tinsley; Episcopal), 125 Monument
 * Circle, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-christ-church-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, built in the circle frame of
 * indy-circle-tower.ts (metres from the Soldiers' and Sailors' Monument's
 * axis, turned 1.5 degrees with the downtown grid). The origin is the area
 * centroid of OSM way/338986227, (36.04, 90.67) in that frame
 * (-86.1575962, 39.7693307); bearing 1.5. y = 0 is the street (flat).
 *
 * Identity (from the photos below):
 *  1. A small grey-limestone Gothic Revival church on the north-west of the
 *     Circle: a steep slate nave running east-west, its west gable on
 *     Meridian Street.
 *  2. The square tower at the south-west corner, with corner buttresses,
 *     paired lancets in the belfry, a gable on each face with corner
 *     pinnacles, and the tall octagonal green-copper spire with a cross.
 *  3. The gabled stone porch at the tower's foot, the nave's south wall of
 *     buttresses and paired lancets, and the taller gable of the east block
 *     facing the Circle, with a triple lancet.
 *  4. The low flat-roofed parish house to the east, against the Columbia
 *     Club.
 *
 * Sources
 * - OSM (ODbL): way/338986227 (building=cathedral, no height): the outline.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid in the circle frame, heights above the street (218.0 m).
 *   Measured: the nave x 15..31, y 84.3..98.4, eaves 7.8..8.6, ridge
 *   16.5..18.0 on y 91.5; the tower x 15..19.5, y 83.6..88.5 (inside the
 *   outline's south-west corner, not on its little south lobe), its gables
 *   22..24, the spire's highest return 41.4; the east block x 31..40, ridge
 *   16.4..16.6 running north-south on x 35.5, eaves about 9; the parish
 *   house east of x 40 flat at 8.2, with a low gable to 13 near y 92;
 *   a low porch (5..6) south of the tower, where the outline's lobe is.
 * - Published (Wikipedia, "Christ Church Cathedral (Indianapolis)"; NRHP
 *   1973): built 1857-59, the oldest building on the Circle; Gothic
 *   Revival in limestone; the spire added 1869.
 * - Photos (Wikimedia Commons), every proportion below is scaled from them:
 *   "Catedral iglesia de Cristo, Indianápolis, Estados Unidos, 2012-10-22,
 *   DD 01.jpg" (Diego Delso, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Catedral_iglesia_de_Cristo,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_01.jpg),
 *   from the south-west: the tower's stages, the porch, the west gable;
 *   "A view of Christ Church Cathedral Indianapolis on Monument Circle.jpg"
 *   (bob, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:A_view_of_Christ_Church_Cathedral_Indianapolis_on_Monument_Circle.jpg),
 *   from the south-east: the nave's south wall, the east gable, the parish
 *   house; "Christ Church Cathedral, Indianapolis - Jan 2012.jpg" (Richie
 *   Diesterheft, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_Indianapolis_-_Jan_2012.jpg),
 *   from the south-west: the slate roof, the buttresses, the porch.
 *
 * Estimated (from the photos against the lidar's 5 m tower): the tower's
 *   stages (buttresses stepping at 7 and 13 m, belfry lancets 14.2..18.6,
 *   eaves 20, gables to 23.8, pinnacles to 24.6), the spire's base (4.1 m
 *   across), the lancets (0.55..1.3 m wide), the porch (eaves 3.4, ridge 7.8:
 *   as steep as the photos show; the lidar's 5..6 there is tree-blurred),
 *   the cross (1.6 m).
 * Left out: the tracery, the crockets, the ridge cresting, the bell
 *   louvres' detail, the steps.
 * Doubts: the north and east walls are not photographed (drawn plain with
 *   the south wall's windows); the parish house is only seen in cc2.
 */
import { Part, type V3, cross, sub } from './mesh'
import { finish } from './palette'
import { PALETTE } from './palette'
import { type XY, prism, rect, flatShape, extrudeShape, lathe, finishGlb, writeModel, type Face } from './sea-tacoma-union-station'
import { shifter } from './indy-circle-tower'

const AX = 36.04, AY = 90.67
const S = shifter(AX, AY)
const P = (x: number, y: number): XY => [x - AX, y - AY]
const stone = new Part(), slate = new Part(), copper = new Part(), win = new Part(), door = new Part(), roof = new Part()

/** A planar polygon, wound to face `out`. */
function face(part: Part, pts: V3[], out: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const p = g[0] * out[0] + g[1] * out[1] + g[2] * out[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}
/** A gabled block on x0..x1, y0..y1 (circle frame): walls to zE, gable ends, a roof to zR with overhang ov. */
function gabled(wall: Part, top: Part, x0: number, y0: number, x1: number, y1: number, zE: number, zR: number, alongX: boolean, ov = 0.35, z0 = 0) {
  prism(wall, null, S(rect(x0, y0, x1, y1)), z0, zE)
  const [a0, b0] = P(x0, y0), [a1, b1] = P(x1, y1)
  const roofs = (pl: V3[], up: V3) => { face(top, pl, up); face(top, pl, [-up[0], -up[1], -up[2]]) }
  if (alongX) {
    const m = (b0 + b1) / 2, e = (ov * (zR - zE)) / ((b1 - b0) / 2)
    face(wall, [[a0, b0, zE], [a0, b1, zE], [a0, m, zR]], [-1, 0, 0])
    face(wall, [[a1, b0, zE], [a1, b1, zE], [a1, m, zR]], [1, 0, 0])
    roofs([[a0 - ov, b0 - ov, zE - e], [a1 + ov, b0 - ov, zE - e], [a1 + ov, m, zR], [a0 - ov, m, zR]], [0, -1, 1])
    roofs([[a0 - ov, b1 + ov, zE - e], [a1 + ov, b1 + ov, zE - e], [a1 + ov, m, zR], [a0 - ov, m, zR]], [0, 1, 1])
  } else {
    const m = (a0 + a1) / 2, e = (ov * (zR - zE)) / ((a1 - a0) / 2)
    face(wall, [[a0, b0, zE], [a1, b0, zE], [m, b0, zR]], [0, -1, 0])
    face(wall, [[a0, b1, zE], [a1, b1, zE], [m, b1, zR]], [0, 1, 0])
    roofs([[a0 - ov, b0 - ov, zE - e], [a0 - ov, b1 + ov, zE - e], [m, b1 + ov, zR], [m, b0 - ov, zR]], [-1, 0, 1])
    roofs([[a1 + ov, b0 - ov, zE - e], [a1 + ov, b1 + ov, zE - e], [m, b1 + ov, zR], [m, b0 - ov, zR]], [1, 0, 1])
  }
}
/** A pointed (equilateral) lancet's outline about s = c: jambs from z0 to the springing zs. */
function lancet(c: number, w: number, z0: number, zs: number): XY[] {
  const out: XY[] = [[c - w / 2, z0], [c + w / 2, z0]]
  for (const a of [0, 20, 40]) { const t = (a * Math.PI) / 180; out.push([c - w / 2 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  out.push([c, zs + (w * Math.sqrt(3)) / 2])
  for (const a of [40, 20, 0]) { const t = (a * Math.PI) / 180; out.push([c + w / 2 - w * Math.cos(t), zs + w * Math.sin(t)]) }
  return out
}
/** A face on the wall x = const or y = const (circle frame), outward normal n. */
const wallFace = (x: number, y: number, n: XY): Face => { const [a, b] = P(x, y); return { o: [a, b, 0], n } }
const box = (wall: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => prism(wall, wall, S(rect(x0, y0, x1, y1)), z0, z1)

// ---------------------------------------------------- the nave, the east block, the parish house
const NY0 = 84.3, NY1 = 98.4
gabled(stone, slate, 15.0, NY0, 31.0, NY1, 8.2, 17.2, true)
gabled(stone, slate, 31.0, 82.5, 40.0, 99.6, 9.0, 16.6, false)
prism(stone, roof, S([[40.0, 76.2], [43.4, 76.1], [61.2, 99.8], [40.0, 99.8]]), 0, 8.2)
gabled(stone, slate, 40.0, 88.6, 47.0, 95.6, 8.2, 12.8, true, 0.2, 8.2)
// buttresses along the nave's south and north walls, and windows between them
for (const x of [20.6, 24.0, 27.4, 30.6]) {
  box(stone, x - 0.3, NY0 - 0.7, x + 0.3, NY0, 0, x > 30 ? 7.6 : 6.6)
  box(stone, x - 0.3, NY1, x + 0.3, NY1 + 0.7, 0, 6.6)
}
for (const x of [22.3, 25.7, 29.0]) {
  for (const [y, n] of [[NY0, [0, -1]], [NY1, [0, 1]]] as [number, XY][]) {
    const f = wallFace(x, y, n), sg = n[1] < 0 ? 1 : -1
    flatShape(win, f, lancet(-0.42 * sg, 0.6, 2.6, 5.6), 0.05)
    flatShape(win, f, lancet(0.42 * sg, 0.6, 2.6, 5.6), 0.05)
  }
}
// the west gable on Meridian Street: a triple lancet and a round window
{
  const f = wallFace(15.0, 93.5, [-1, 0])
  flatShape(win, f, lancet(0, 1.2, 2.4, 7.6), 0.05)
  flatShape(win, f, lancet(-1.5, 0.9, 2.4, 6.6), 0.05)
  flatShape(win, f, lancet(1.5, 0.9, 2.4, 6.6), 0.05)
  const ring: XY[] = Array.from({ length: 10 }, (_, k) => [0.75 * Math.cos((k * Math.PI) / 5), 11.6 + 0.75 * Math.sin((k * Math.PI) / 5)] as XY)
  flatShape(win, f, ring, 0.05)
}
// the east block's gables, to the Circle and to the alley
for (const [y, n] of [[82.5, [0, -1]], [99.6, [0, 1]]] as [number, XY][]) {
  const f = wallFace(35.5, y, n)
  flatShape(win, f, lancet(0, 1.3, 2.4, 8.2), 0.05)
  flatShape(win, f, lancet(-1.7, 1.0, 2.4, 7.2), 0.05)
  flatShape(win, f, lancet(1.7, 1.0, 2.4, 7.2), 0.05)
  const ring: XY[] = Array.from({ length: 10 }, (_, k) => [0.8 * Math.cos((k * Math.PI) / 5), 12.4 + 0.8 * Math.sin((k * Math.PI) / 5)] as XY)
  flatShape(win, f, ring, 0.05)
}
for (const x of [31.0, 40.0]) box(stone, x - 0.35, 81.8, x + 0.35, 82.5, 0, 8.4)
// the parish house: an arched door and windows to the Circle
{
  const f = wallFace(41.7, 76.15, [0, -1])
  flatShape(door, f, lancet(0, 1.5, 0, 2.4), 0.05)
  flatShape(win, f, [[-1.3, 4.4], [1.3, 4.4], [1.3, 6.6], [-1.3, 6.6]], 0.05)
}

// ---------------------------------------------------- the porch at the tower's foot
gabled(stone, slate, 15.6, 79.4, 20.4, 83.6, 3.4, 7.8, false, 0.25)
flatShape(door, wallFace(18.0, 79.4, [0, -1]), lancet(0, 2.4, 0, 2.2), 0.05)
for (const x of [16.0, 20.0]) flatShape(door, wallFace(x, 81.5, [x < 18 ? -1 : 1, 0]), lancet(0, 1.6, 0.6, 2.2), 0.05)

// ---------------------------------------------------- the tower
const TX0 = 14.9, TX1 = 19.9, TY0 = 83.6, TY1 = 88.6, TE = 20.0, TA = 23.8
const tcx = (TX0 + TX1) / 2, tcy = (TY0 + TY1) / 2
prism(stone, null, S(rect(TX0, TY0, TX1, TY1)), 0, TE)
// corner buttresses, stepping back at 7 and 13 m
for (const [x, y, sx, sy] of [[TX0, TY0, -1, -1], [TX1, TY0, 1, -1], [TX1, TY1, 1, 1], [TX0, TY1, -1, 1]] as [number, number, number, number][]) {
  for (const [d, z1] of [[0.8, 7.0], [0.5, 13.0], [0.3, 17.5]] as [number, number][]) {
    // one on each face at the corner
    const bx0 = sx < 0 ? x - d : x, bx1 = sx < 0 ? x : x + d
    box(stone, bx0, sy < 0 ? y : y - 0.8, bx1, sy < 0 ? y + 0.8 : y, 0, z1)
    const by0 = sy < 0 ? y - d : y, by1 = sy < 0 ? y : y + d
    box(stone, sx < 0 ? x : x - 0.8, by0, sx < 0 ? x + 0.8 : x, by1, 0, z1)
  }
}
// the faces: belfry lancets, a small lancet below, the west door, a gable with a little triple lancet
const faces: [Face, number][] = [
  [wallFace(tcx, TY0, [0, -1]), TX1 - TX0], [wallFace(TX1, tcy, [1, 0]), TY1 - TY0],
  [wallFace(tcx, TY1, [0, 1]), TX1 - TX0], [wallFace(TX0, tcy, [-1, 0]), TY1 - TY0],
]
for (const [f, w] of faces) {
  flatShape(win, f, lancet(-0.6, 0.8, 14.2, 17.6), 0.05)
  flatShape(win, f, lancet(0.6, 0.8, 14.2, 17.6), 0.05)
  flatShape(win, f, lancet(0, 0.45, 9.2, 10.6), 0.05)
  extrudeShape(stone, f, [[-w / 2, TE], [w / 2, TE], [0, TA]], -0.6, 0.0)
  flatShape(win, f, lancet(0, 0.4, 20.5, 21.6), 0.05)
  flatShape(win, f, lancet(-0.65, 0.35, 20.4, 21.1), 0.05)
  flatShape(win, f, lancet(0.65, 0.35, 20.4, 21.1), 0.05)
  // a band under the belfry
  extrudeShape(stone, f, [[-w / 2, 13.0], [w / 2, 13.0], [w / 2, 13.4], [-w / 2, 13.4]], 0, 0.15, false)
}
flatShape(door, wallFace(TX0, tcy, [-1, 0]), lancet(0, 1.4, 0, 2.6), 0.05)
// the hidden roof between the gables
{
  const [a0, b0] = P(TX0, TY0), [a1, b1] = P(TX1, TY1), c: V3 = [(a0 + a1) / 2, (b0 + b1) / 2, TA - 0.6]
  face(stone, [[a0, b0, TE], [a1, b0, TE], c], [0, -1, 1]); face(stone, [[a1, b0, TE], [a1, b1, TE], c], [1, 0, 1])
  face(stone, [[a1, b1, TE], [a0, b1, TE], c], [0, 1, 1]); face(stone, [[a0, b1, TE], [a0, b0, TE], c], [-1, 0, 1])
}
// pinnacles at the corners
for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]) {
  const [px, py] = P(x, y)
  lathe(stone, px, py, [[0.42, TE - 0.6], [0.42, TA - 0.6], [0.001, TA + 0.8]], 4, 45, 405)
}
// the spire: octagonal green copper, with small louvres and a cross
{
  const [sx, sy] = P(tcx, tcy)
  lathe(copper, sx, sy, [[2.05, TE + 0.3], [1.95, 22.4], [0.09, 40.6], [0.001, 40.8]], 8, 22.5, 382.5)
  for (const [f] of faces) {
    const g: Face = { o: [sx + f.n[0] * 1.62, sy + f.n[1] * 1.62, 0], n: f.n }
    flatShape(win, g, lancet(0, 0.55, 26.4, 27.6), 0.12)
  }
  const cs = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => prism(copper, copper, [[sx + x0, sy + y0], [sx + x1, sy + y0], [sx + x1, sy + y1], [sx + x0, sy + y1]], z0, z1)
  cs(-0.08, -0.08, 0.08, 0.08, 40.6, 42.4)
  cs(-0.5, -0.08, 0.5, 0.08, 41.5, 41.7)
}

const stoneM = finish('indy-christ-church-limestone', 0xc4beb2)
const built = finishGlb('Christ Church Cathedral', [
  { part: stone, material: stoneM },
  { part: slate, material: finish('indy-christ-church-slate', 0x707479) },
  { part: copper, material: finish('indy-christ-church-copper', 0x86b9a2) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 1.5, height: 42.4, replaces: ['way/338986227'] }, 5000)
await writeModel('indy-christ-church-cathedral', built)
