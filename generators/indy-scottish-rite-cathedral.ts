/**
 * Scottish Rite Cathedral (1927–1929, George F. Schreiber), 650 North
 * Meridian Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-scottish-rite-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/201717690 (-86.1582733, 39.7761750); the plan is
 * turned 1.88 degrees anticlockwise from true north, so the model is drawn
 * square and placed at bearing -1.88. y = 0 is the ground round the
 * building, which is level (lidar ground 3.8 m over the grid minimum).
 *
 * Identity (from the photos below):
 *  1. The tall square tower (212 ft), with clasping buttresses, a great
 *     traceried window low down, tall paired lancets in its upper stage, and
 *     an openwork parapet of pinnacles at the top.        (S, tower, lidar)
 *  2. The south front: a big pointed window over the arched portal and its
 *     steps, between two octagonal turrets with pierced lanterns. (S, lidar)
 *  3. The long, lower body in pale Indiana limestone with flat roofs and
 *     pierced parapets, lower corner pavilions, a taller north block with
 *     its own turrets, and the west wing.                   (S, lidar, OSM)
 *
 * Sources
 * - OSM (ODbL): way/201717690 (building=yes, height 65): the outline, the
 *   west wing (x -24..-13.6, y -9..7) and the four corner pavilions.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame. Measured (above the ground):
 *   the tower x 4..16, y -8..6, its roof 58.0 m and corner pinnacles 64.5 m
 *   (OSM's 65 and the published 212 ft = 64.6 m agree); the body x
 *   -13.6..15 at 21.8 m with a low ridge 24.4 m; the corner pavilions 17 m;
 *   the south block (y -45..-30) 26.6 m, its turrets at x -10 and 6 to
 *   30.3 m; the north block (y 20..42) 29.3 m, turrets at x -9 and 11 to
 *   about 33 m; the west wing 27.3 m.
 *   The tower stands in the east half of the plan, not on the west
 *   (Meridian) front: OSM and the lidar agree on this.
 * - Published (Wikipedia, "Scottish Rite Cathedral (Indianapolis)"): Tudor
 *   Gothic, Indiana limestone, the tower 212 ft with a 54-bell carillon.
 * - Photos (Wikimedia Commons):
 *   "Catedral de tradición escocesa, Indianápolis, Estados Unidos,
 *   2012-10-22, DD 02.jpg" (Diego Delso, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Catedral_de_tradici%C3%B3n_escocesa,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_02.jpg),
 *   the south front with the tower behind;
 *   "Scottish Rite Cathedral - 2438857401 03.jpg" (Paul J Everett, CC BY
 *   2.0, https://commons.wikimedia.org/wiki/File:Scottish_Rite_Cathedral_-_2438857401_03.jpg),
 *   the top of the tower and the pierced parapets;
 *   "Scottish Rite Cathedral - Indianapolis, IN.jpg" (Paul Sableman, CC BY
 *   2.0, https://commons.wikimedia.org/wiki/File:Scottish_Rite_Cathedral_-_Indianapolis,_IN.jpg).
 *
 * Estimated: window sizes and sill heights, from the south photo against
 *   the lidar heights; the tower's stages (great window 26..36 m, lancets
 *   41..54 m); the east and north faces, which no photo here shows square
 *   on, are drawn in the same manner as the south.
 * Left out: the pierced tracery of the parapets (drawn as solid bands with
 *   small pinnacles), carved ornament, the flagpole, the steps' railings.
 * Night: floodlit limestone; windows glow; the portal is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, chamfer, lathe, flatShape, ccw, finishGlb, writeModel, arc, type Face } from './sea-tacoma-union-station'
import { windowRow, box, stairs, wallLit, ringBand } from './indy-world-war-memorial'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

/** A pointed (two-centred) arch outline: jambs from z0, springing at zs. */
function pointed(sc: number, w: number, z0: number, zs: number, segs = 5): XY[] {
  const r = w * 0.8, aTop = Math.acos((r - w / 2) / r)
  const pts: XY[] = [[sc - w / 2, z0], [sc + w / 2, z0]]
  for (let k = 0; k <= segs; k++) { const a = (k / segs) * aTop; pts.push([sc + w / 2 - r + r * Math.cos(a), zs + r * Math.sin(a)]) }
  for (let k = segs - 1; k >= 0; k--) { const a = (k / segs) * aTop; pts.push([sc - w / 2 + r - r * Math.cos(a), zs + r * Math.sin(a)]) }
  return pts
}
const face = (x: number, y: number, n: XY): Face => ({ o: [x, y, 0], n })
/** A solid parapet band with small square pinnacles along a rectangle's edge. */
function parapet(x0: number, y0: number, x1: number, y1: number, z: number, h = 1.3, every = 4.5) {
  ringBand(trim, x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25, z - 0.5, z + h, 0.6)
  const r = rect(x0, y0, x1, y1)
  for (let k = 0; k < 4; k++) {
    const a = r[k], b = r[(k + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / every))
    for (let i = 0; i < n; i++) {
      const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
      box(trim, trim, x - 0.3, y - 0.3, x + 0.3, y + 0.3, z + h, z + h + 1.0)
    }
  }
}
/** An octagonal turret with a pierced lantern stage and pinnacles. */
function turret(x: number, y: number, r: number, z1: number) {
  const oct = (rr: number): XY[] => arc(x, y, rr, 22.5, 382.5, 8).slice(0, 8)
  prism(stone, null, oct(r), 0, z1 - 4.0)
  prism(trim, null, oct(r + 0.25), z1 - 4.4, z1 - 3.9)
  prism(stone, null, oct(r - 0.15), z1 - 3.9, z1 - 0.6)
  for (let k = 0; k < 8; k++) {
    const a = ((k * 45 + 45) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), d = (r - 0.15) * Math.cos(Math.PI / 8)
    flatShape(win, face(x + c * d, y + s * d, [c, s]), pointed(0, r * 0.55, z1 - 3.4, z1 - 1.9, 2), 0.05)
  }
  prism(trim, trim, oct(r + 0.2), z1 - 0.6, z1)
  for (const p of oct(r)) box(trim, trim, p[0] - 0.3, p[1] - 0.3, p[0] + 0.3, p[1] + 0.3, z1, z1 + 1.4)
}

// ------------------------------------------------------------ the outline: lower walls everywhere
const RING: XY[] = ccw([[21.0, 43.6], [17.4, 43.7], [13.8, 40.7], [-5.8, 41.5], [-9.4, 45.3], [-14.0, 45.7], [-16.3, 43.5], [-16.5, 40.0], [-13.6, 36.8], [-13.6, 6.5], [-23.9, 6.8], [-24.2, -8.9], [-13.6, -10.2], [-14.7, -34.3], [-19.5, -34.2], [-21.5, -37.1], [-21.9, -41.9], [-18.5, -45.4], [-14.7, -45.5], [-11.6, -41.3], [9.5, -44.1], [11.3, -46.4], [15.3, -46.5], [18.6, -43.7], [18.6, -38.6], [16.1, -36.3], [11.2, -35.6], [12.2, -10.2], [20.0, -10.0], [21.3, 8.9], [16.0, 9.1], [17.5, 34.2], [21.5, 34.9], [23.9, 37.2], [24.0, 41.2]])
const LOW = 17.0
prism(stone, roof, RING, 0, LOW)
prism(trim, null, RING.map(([x, y]) => [x * 1.006, y * 1.004] as XY), LOW - 0.6, LOW + 0.7)
// windows round the lower walls: one row of tall lights in the upper storey, one below
RING.forEach((a, i) => {
  const b = RING[(i + 1) % RING.length]
  windowRow(win, a, b, 9.5, 14.5, 4.2, 1.5, 1.4)
  windowRow(win, a, b, 3.0, 6.5, 4.2, 1.4, 1.4)
})

// ------------------------------------------------------------ the main body
box(stone, roof, -13.6, -34, 15.0, 30, LOW, 21.8)
parapet(-13.6, -34, 15.0, 30, 21.8, 1.0, 5)
// the low gable along the body
roof.quad([-6, -30, 22.3], [8, -30, 22.3], [8, 26, 22.3], [-6, 26, 22.3])
box(roof, roof, -1.5, -30, 3.5, 26, 22.3, 24.4)
windowRow(win, [-13.6, -10.2], [-13.6, -34], 17.6, 20.8, 3.6, 1.3, 1.2)
windowRow(win, [15, -34], [15, -10], 17.6, 20.8, 3.6, 1.3, 1.2)
windowRow(win, [15, 9], [15, 30], 17.6, 20.8, 3.6, 1.3, 1.2)
windowRow(win, [-13.6, 30], [-13.6, 6.5], 17.6, 20.8, 3.6, 1.3, 1.2)

// ------------------------------------------------------------ the south front
{
  const X0 = -13.5, X1 = 9.0, Y0 = -43.6, Y1 = -30, Z = 26.6, SC = -2.2
  box(stone, roof, X0, Y0, X1, Y1, 0, Z)
  parapet(X0, Y0, X1, Y1, Z, 1.2, 4)
  turret(-11.0, Y0 + 2.2, 2.6, 30.3)
  turret(6.6, Y0 + 2.2, 2.6, 30.3)
  const f = face(SC, Y0, [0, -1])
  // the great pointed window with its tracery bars, the pale surround
  flatShape(trim, f, pointed(0, 8.4, 9.0, 17.0, 6), 0.05)
  flatShape(win, f, pointed(0, 7.0, 9.6, 17.0, 6), 0.1)
  for (const s of [-1.75, 0, 1.75]) flatShape(trim, f, [[s - 0.1, 9.6], [s + 0.1, 9.6], [s + 0.1, 18.6], [s - 0.1, 18.6]], 0.14)
  flatShape(trim, f, [[-3.5, 13.2], [3.5, 13.2], [3.5, 13.45], [-3.5, 13.45]], 0.14)
  // the arched portal and its doors, the steps
  flatShape(trim, f, pointed(0, 6.6, 1.2, 5.0, 5), 0.05)
  flatShape(door, f, pointed(0, 5.0, 1.2, 4.6, 5), 0.1)
  stairs(trim, SC - 6, Y0 - 4.5, SC + 6, Y0, 's', 0.15, 1.2, 6)
  windowRow(win, [X0, Y0], [-8, Y0], 19.5, 23.5, 3, 1.2, 1.2)
  windowRow(win, [3.6, Y0], [X1, Y0], 19.5, 23.5, 3, 1.2, 1.2)
}
// ------------------------------------------------------------ the north block
{
  const X0 = -12.5, X1 = 14.0, Y0 = 30, Y1 = 41.0, Z = 29.0
  box(stone, roof, X0, Y0, X1, Y1, 0, Z)
  box(stone, roof, -6.5, 20, 7.5, Y0, LOW, 29.3)
  parapet(X0, Y0, X1, Y1, Z, 1.2, 4)
  turret(-10.0, Y1 - 2.0, 2.4, 33.0)
  turret(11.5, Y1 - 2.0, 2.4, 33.0)
  const f = face(0.8, Y1, [0, 1])
  flatShape(trim, f, pointed(0, 7.6, 10.0, 18.5, 6), 0.05)
  flatShape(win, f, pointed(0, 6.4, 10.6, 18.5, 6), 0.1)
  for (const s of [-1.6, 0, 1.6]) flatShape(trim, f, [[s - 0.1, 10.6], [s + 0.1, 10.6], [s + 0.1, 20.0], [s - 0.1, 20.0]], 0.14)
  flatShape(door, f, pointed(0, 3.6, 0.2, 3.4, 4), 0.1)
}
// ------------------------------------------------------------ the west wing on Meridian Street
{
  const X0 = -24.0, X1 = -13.6, Y0 = -5.2, Y1 = 6.6, Z = 27.3
  box(stone, roof, X0, Y0, X1, Y1, LOW, Z)
  parapet(X0, Y0, X1, Y1, Z, 1.0, 4)
  const f = face(X0, 0.7, [-1, 0])
  flatShape(trim, f, pointed(0, 7.0, 12.0, 19.5, 6), 0.05)
  flatShape(win, f, pointed(0, 5.8, 12.6, 19.5, 6), 0.1)
  for (const s of [-1.45, 1.45]) flatShape(trim, f, [[s - 0.1, 12.6], [s + 0.1, 12.6], [s + 0.1, 21.5], [s - 0.1, 21.5]], 0.14)
  flatShape(door, f, pointed(0, 3.4, 0.4, 3.2, 4), 0.1)
}

// ------------------------------------------------------------ the tower
{
  const CX = 10.0, CY = -1.0, HX = 6.0, HY = 7.0, ROOF = 58.0
  const T = (x0: number, y0: number, x1: number, y1: number) => rect(CX + x0, CY + y0, CX + x1, CY + y1)
  prism(stone, null, chamfer(T(-HX, -HY, HX, HY), 0.3), LOW, 38.0)
  prism(trim, null, chamfer(T(-HX - 0.25, -HY - 0.25, HX + 0.25, HY + 0.25), 0.3), 37.6, 38.4)
  prism(stone, null, chamfer(T(-HX + 0.4, -HY + 0.4, HX - 0.4, HY - 0.4), 0.3), 38.4, ROOF - 1.6)
  // clasping buttresses at the corners, stepping in at the stage line
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = CX + sx * (HX - 0.4), y = CY + sy * (HY - 0.4)
    box(stone, trim, x - 1.3, y - 1.3, x + 1.3, y + 1.3, LOW, 38.0, 0.2)
    box(stone, trim, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 38.0, ROOF + 0.4, 0.2)
    // the tall corner pinnacles
    box(trim, null, x - 0.8, y - 0.8, x + 0.8, y + 0.8, ROOF + 0.4, ROOF + 3.8, 0.15)
    lathe(trim, x, y, [[0.75, ROOF + 3.8], [0.3, ROOF + 6.2], [0.001, ROOF + 6.6]], 4, 45, 405)
  }
  // the openwork parapet with its pinnacles, the roof
  ringBand(trim, CX - HX + 0.3, CY - HY + 0.3, CX + HX - 0.3, CY + HY - 0.3, ROOF - 1.6, ROOF + 1.6, 0.5)
  roof.cap([[CX - HX + 0.3, CY - HY + 0.3, ROOF], [CX + HX - 0.3, CY - HY + 0.3, ROOF], [CX + HX - 0.3, CY + HY - 0.3, ROOF], [CX - HX + 0.3, CY + HY - 0.3, ROOF]] as V3[], true)
  for (const [x, y] of [[CX, CY - HY + 0.4], [CX, CY + HY - 0.4], [CX - HX + 0.4, CY], [CX + HX - 0.4, CY]]) {
    box(trim, trim, x - 0.35, y - 0.35, x + 0.35, y + 0.35, ROOF + 1.6, ROOF + 4.0)
  }
  // windows on the four faces: a great traceried window, then the paired belfry lancets
  for (const [n, w, cx, cy] of [[[0, -1], HX * 2, CX, CY - HY + 0.4], [[0, 1], HX * 2, CX, CY + HY - 0.4], [[-1, 0], HY * 2, CX - HX + 0.4, CY], [[1, 0], HY * 2, CX + HX - 0.4, CY]] as [XY, number, number, number][]) {
    const f = face(cx, cy, n)
    if (n[0] === 0 || n[0] > 0) {
      flatShape(win, f, pointed(0, 4.6, 27.0, 33.0, 5), 0.06)
      flatShape(trim, f, [[-0.09, 27.0], [0.09, 27.0], [0.09, 35.0], [-0.09, 35.0]], 0.1)
    }
    for (const s of [-1.6, 1.6]) flatShape(win, f, pointed(s, 2.0, 41.5, 52.0, 4), 0.06)
    flatShape(win, f, pointed(0, 0.9, 54.0, 55.0, 2), 0.06)
    void w
  }
}

const limestone = { ...finish('indy-src-limestone', 0xe5e0d4), floodlight: wallLit }
const built = finishGlb('Scottish Rite Cathedral', [
  { part: stone, material: limestone },
  { part: trim, material: { ...PALETTE.trim, floodlight: wallLit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('entrance', 0xa77b4f) },
], { bearing: -1.88, height: 64.6, replaces: ['way/201717690'] }, 6500)

if (import.meta.main) await writeModel('indy-scottish-rite-cathedral', built)
