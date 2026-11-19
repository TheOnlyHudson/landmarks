/**
 * Indiana Statehouse (1878–1888, Edwin May and Adolph Scherrer),
 * Indianapolis: procedural, CC0-1.0.
 * bun generators/ind-indiana-statehouse.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the dome's axis,
 * the centre of OSM's dome part way/1457577517 (-86.1626461, 39.7686304),
 * which the lidar confirms; y = 0 is the lawn round the building, which is
 * nearly level (within 0.3 m). The OSM plan and the lidar both turn about
 * 1.5 degrees clockwise from true north (the downtown grid), so the model is
 * drawn square and placed at bearing 1.5.
 *
 * Identity (from the photos below):
 *  1. The copper dome on its tall drum over the crossing: a square base, a
 *     drum of round-headed windows, a cornice, an attic of small windows,
 *     the green-grey dome and a lantern.                 (aerial, dome, night)
 *  2. The cross plan: a long north–south range (151 m) and a shorter
 *     east–west wing, all four storeys of pale Indiana limestone over a
 *     rusticated base storey, under green copper gable roofs. (aerial, lidar)
 *  3. Four corner pavilions at the ends of the long range, taller, with
 *     pediments on their outer faces, an attic and a low copper dome with a
 *     little lantern each.                                   (aerial, north)
 *  4. The east portico on Capitol Avenue: six giant Corinthian columns,
 *     paired at the ends, over the rusticated base with its three doors,
 *     under a pediment.                                   (aerial, east x2)
 *  5. The north, south and west fronts: centre pavilions with six engaged
 *     columns and a tall attic.                             (north, west)
 *
 * Sources
 * - OSM (ODbL): outline way/339985770 and its 25 building:parts
 *   (way/1457577514..23, 1457578880..84, 1457580626/27, 1457580866..70,
 *   1457581216/17, 1457581621, 1457583428): the cross plan, the corner
 *   pavilions, the dome, the east portico's six columns (y -11.7..7.2).
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018, read in the
 *   model frame with tools/lidar_frame.py, ground 2.0 m over the grid's
 *   minimum. Measured: the range runs y -74.5..76 and x -21.5..21.5, the
 *   east-west wing y -20.5..18 and x -41..41 (+ the portico to 46.5); the
 *   corner pavilions x ±11..29, y 50..70 and -54..-74.5. OSM's outline is
 *   about 4 m shorter north-south; the lidar's 151 m agrees with the
 *   building's published 496 ft length. Heights: wing cornices 23.2 m,
 *   gable ridges 30.8 m; corner pavilions' attics 30.3 m, their domes 37.8
 *   and lanterns 39.3 m; end pavilions' attics 31.5 m; the east pediment
 *   28.8 m; the dome's drum cornice r 12.5 at about 47.5 m, the dome from
 *   r 11.6 at 49.4 m to its crown about 60.5 m, the lantern to about 72 m
 *   and the flagpole to 82 m.
 * - Published (Wikipedia, "Indiana Statehouse"; NRHP 1975): cross plan,
 *   four storeys, completed 1888; the pinnacle 256 ft (78 m).
 * - Photos (Wikimedia Commons): "StateCapitolIndiana.jpg" (Daniel Schwen,
 *   CC BY-SA 3.0, from high to the east-south-east: the plan, the roofs,
 *   the pavilions, the east portico and the dome); "Indiana Statehouse -
 *   January 2012 02.jpg" (Richie Diesterheft, CC BY-SA 2.0, the east front);
 *   "Indiana Statehouse - ca 1984 01.jpg" and "ca 1984 03" (Gary Todd, CC0,
 *   the west front and an oblique); "Indiana Statehouse - June 2019 -
 *   Tristan Loper 02" and "03" (CC BY-SA 2.0, an end front with its six
 *   engaged columns and attic, and the dome);
 *   "Indiana Statehouse - 2011-7-26.jpg" (Jim Bowen, CC BY 2.0, the dome);
 *   "Indiana Statehouse at night.jpg" (Presidentman, CC BY-SA 4.0).
 *
 * Estimated: the storey heights (base 6.6, cornice 21.5..23.2) and the
 *   window bays (4.4 m), from the photos against the lidar heights; the
 *   drum's tiers within the lidar profile; the south front, which no photo
 *   here shows square on (drawn like the north); the west and north doors.
 *   The model is a little larger than OSM's outline (it follows the lidar).
 * Left out: balustrades, the chimneys, the statues on the attics and the
 *   eagle, pilasters, the pediment sculpture, window surrounds and heads,
 *   the ribs on the dome, the flagpole, the skylights in the roofs, the
 *   Morton statue and the plaza in front of the east steps.
 * Night: the stone is floodlit, the drum and dome brightest; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, chamfer, flatShape, lathe, archShape, capRing, finishGlb, writeModel, outward, type Face } from './sea-tacoma-union-station'

const BASE = 6.6, CORN = 21.5, CTOP = 23.2, RIDGE = 30.8
const PCORN = 26.0 // pavilions' cornice

const stone = new Part(), trim = new Part(), copper = new Part(), roofs = new Part(), win = new Part(), door = new Part()

/** Offset a rectilinear ring outward by d (mitred at the right-angle corners). */
function offset(r: XY[], d: number): XY[] {
  return r.map((q, i) => {
    const p = r[(i - 1 + r.length) % r.length], s = r[(i + 1) % r.length]
    const a = outward(p, q), b = outward(q, s)
    return [q[0] + (a[0] + b[0]) * d, q[1] + (a[1] + b[1]) * d]
  })
}
/** Window panels along edge a→b of a counter-clockwise ring, in bays of about `bay`, one per row. */
function bays(a: XY, b: XY, rows: [number, number][], bay = 4.4, margin = 1.6, w = 1.5, part = win) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < margin * 2 + w) return
  const n = Math.max(1, Math.round((L - 2 * margin) / bay))
  const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn = outward(a, b)
  for (let k = 0; k < n; k++) {
    const s = margin + ((L - 2 * margin) * (k + 0.5)) / n
    const P = (u: number, z: number): V3 => [a[0] + t[0] * u + nn[0] * 0.06, a[1] + t[1] * u + nn[1] * 0.06, z]
    for (const [z0, z1] of rows) part.quad(P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1))
  }
}
const ROWS: [number, number][] = [[1.9, 4.7], [8.0, 12.2], [13.6, 16.8], [18.0, 20.4]]

/** A hipped roof over a rectangle, ridge along its longer side. */
function hipRoof(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const copper = roofs
  const hx = (x1 - x0) / 2, hy = (y1 - y0) / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  if (hx >= hy) {
    const r0: V3 = [x0 + hy, cy, z1], r1: V3 = [x1 - hy, cy, z1]
    copper.quad([x0, y0, z0], [x1, y0, z0], r1, r0)
    copper.quad([x1, y1, z0], [x0, y1, z0], r0, r1)
    copper.tri([x1, y0, z0], [x1, y1, z0], r1)
    copper.tri([x0, y1, z0], [x0, y0, z0], r0)
  } else {
    const r0: V3 = [cx, y0 + hx, z1], r1: V3 = [cx, y1 - hx, z1]
    copper.quad([x1, y0, z0], [x1, y1, z0], r1, r0)
    copper.quad([x0, y1, z0], [x0, y0, z0], r0, r1)
    copper.tri([x0, y0, z0], [x1, y0, z0], r0)
    copper.tri([x1, y1, z0], [x0, y1, z0], r1)
  }
}
/** A flat triangular pediment on a face: centre (cx, cy), outward normal n, base width w, z0..z1, standing d out. */
function pediment(cx: number, cy: number, n: XY, w: number, z0: number, z1: number, d = 0.7) {
  const t: XY = [-n[1], n[0]]
  const P = (s: number, z: number, o: number): V3 => [cx + t[0] * s + n[0] * o, cy + t[1] * s + n[1] * o, z]
  // the raking cornice as a shallow prism: front, two sloping tops, the base
  trim.tri(P(-w / 2, z0, d), P(w / 2, z0, d), P(0, z1, d))
  trim.quad(P(w / 2, z0, d), P(w / 2, z0, 0), P(0, z1, 0), P(0, z1, d))
  trim.quad(P(0, z1, d), P(0, z1, 0), P(-w / 2, z0, 0), P(-w / 2, z0, d))
}
/** Engaged columns standing in front of a face: centre (cx, cy), normal n, at offsets s, from z0 to z1. */
function columns(cx: number, cy: number, n: XY, offs: number[], z0: number, z1: number, r = 0.75, out = 0.45) {
  const t: XY = [-n[1], n[0]]
  for (const s of offs) {
    const x = cx + t[0] * s + n[0] * out, y = cy + t[1] * s + n[1] * out
    lathe(trim, x, y, [[r * 1.15, z0], [r * 1.15, z0 + 0.8], [r, z0 + 0.9], [r * 0.88, z1 - 1.0], [r * 1.2, z1 - 0.3], [r * 1.2, z1]], 8)
  }
}
const face = (cx: number, cy: number, n: XY): Face => ({ o: [cx, cy, 0], n })

// ------------------------------------------------------------ the plan
// Counter-clockwise from the south-west pavilion; lidar-measured extents.
const PLAN: XY[] = [
  [-29, -74.5], [29, -74.5], [29, -54], [21.5, -54], [21.5, -20.5], [30, -20.5], [30, -12.5], [41, -12.5],
  [41, 11.5], [30, 11.5], [30, 18], [21.5, 18], [21.5, 50], [29, 50], [29, 70], [11, 70], [11, 76], [-11, 76],
  [-11, 70], [-29, 70], [-29, 50], [-21.5, 50], [-21.5, 18], [-30, 18], [-30, 11.5], [-41, 11.5], [-41, -12.5],
  [-30, -12.5], [-30, -20.5], [-21.5, -20.5], [-21.5, -54], [-29, -54],
]
// the rusticated base storey, its band, the walls, the main cornice
prism(stone, null, PLAN, 0, CORN)
prism(trim, null, offset(PLAN, 0.18), BASE - 0.5, BASE)
prism(trim, null, offset(PLAN, 0.6), CORN, CTOP)
capRing(trim, offset(PLAN, 0.6), CTOP)
PLAN.forEach((a, i) => {
  const b = PLAN[(i + 1) % PLAN.length]
  // the east end's centre bays are behind the portico: doors there instead
  if (Math.abs(a[0]) === 41 && a[0] === b[0]) return
  bays(a, b, ROWS)
})

// ------------------------------------------------------------ the copper roofs
hipRoof(-21.5, -54, 21.5, 50, CTOP, RIDGE)
hipRoof(-30, -20.5, 30, 18, CTOP, RIDGE)

// ------------------------------------------------------------ corner pavilions
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const x0 = sx < 0 ? -29 : 11, x1 = sx < 0 ? -11 : 29
  const y0 = sy < 0 ? -74.5 : 50, y1 = sy < 0 ? -54 : 70
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const body = rect(x0, y0, x1, y1)
  prism(stone, null, body, CTOP, PCORN)
  prism(trim, trim, chamfer(rect(x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5), 0.3), PCORN, PCORN + 1.0)
  // the attic with its row of small windows
  const ax0 = x0 + 0.6, ax1 = x1 - 0.6, ay0 = y0 + 0.6, ay1 = y1 - 0.6
  prism(stone, null, rect(ax0, ay0, ax1, ay1), PCORN + 1.0, 30.3)
  const A = rect(ax0, ay0, ax1, ay1)
  A.forEach((p, i) => bays(p, A[(i + 1) % 4], [[PCORN + 1.6, PCORN + 2.6]], 2.4, 1.2, 0.9))
  // the low copper dome over the rectangle, rising 7.5 m, and its lantern
  const hx = (ax1 - ax0) / 2, hy = (ay1 - ay0) / 2
  const rings: V3[][] = []
  for (let k = 0; k <= 5; k++) {
    const th = (k / 5) * (Math.PI / 2) * 0.86
    const s = Math.cos(th), z = 30.3 + 7.5 * Math.sin(th) / Math.sin((Math.PI / 2) * 0.86)
    const c = Math.min(hx, hy) * s * 0.45
    rings.push(chamfer(rect(cx - hx * s, cy - hy * s, cx + hx * s, cy + hy * s), c).map(([x, y]) => [x, y, z] as V3))
  }
  copper.loft(rings)
  const top = rings[rings.length - 1]
  copper.cap(top, true)
  lathe(trim, cx, cy, [[1.5, 37.6], [1.5, 38.8], [1.8, 38.8], [1.8, 39.1], [0.9, 39.4], [0.01, 39.9]], 8)
  // the pediments on the two outer faces, standing over the cornice
  pediment(cx, sy < 0 ? y0 : y1, [0, sy], 13.0, PCORN + 1.0, PCORN + 4.6)
  pediment(sx < 0 ? x0 : x1, cy, [sx, 0], 12.0, PCORN + 1.0, PCORN + 4.4)
}

// ------------------------------------------------------------ end pavilions: north, south and west fronts
/** A centre pavilion: block to the cornice, an attic, six engaged columns on its face. */
function endPavilion(r: XY[], n: XY, fc: XY, wFace: number, attic: number) {
  prism(stone, null, r, CTOP, PCORN)
  const [x0, y0] = r[0], [x1, y1] = r[2]
  prism(trim, null, chamfer(rect(x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5), 0.3), PCORN, PCORN + 1.0)
  prism(stone, trim, rect(x0 + 0.4, y0 + 0.4, x1 - 0.4, y1 - 0.4), PCORN + 1.0, attic)
  const half = wFace / 2 - 1.2
  columns(fc[0], fc[1], n, [-half, -half * 0.6, -half * 0.2, half * 0.2, half * 0.6, half], BASE, CORN)
}
endPavilion(rect(-11, 70, 11, 76), [0, 1], [0, 76], 22, 31.0)
endPavilion(rect(-11, -74.5, 11, -70), [0, -1], [0, -74.5], 22, 31.0)
endPavilion(rect(-41, -12.5, -30, 11.5), [-1, 0], [-41, -0.5], 24, 31.5)
// the east pavilion behind the portico: block and attic, no engaged columns
prism(stone, null, rect(30, -12.5, 41, 11.5), CTOP, PCORN)
prism(trim, null, chamfer(rect(29.5, -13, 41.5, 12), 0.3), PCORN, PCORN + 1.0)
prism(stone, trim, rect(30.4, -12.1, 40.6, 11.1), PCORN + 1.0, 31.5)
// doors: three in the west front's base storey
for (const s of [-3.5, 0, 3.5]) flatShape(door, face(-41, -0.5, [-1, 0]), [[s - 1.1, 0.4], [s + 1.1, 0.4], [s + 1.1, 4.4], [s - 1.1, 4.4]], 0.08)
// the west front's windows above the base storey (its doors below)
bays([-41, 11.5], [-41, -12.5], ROWS.slice(1), 4.0, 1.4, 1.5)

// ------------------------------------------------------------ the east portico
{
  const X0 = 41, X1 = 46.5, Y0 = -12.6, Y1 = 8.1, PH = 20.6, ENT = 22.6, APEX = 28.8
  // the rusticated base the columns stand on, with its three doors
  prism(stone, trim, chamfer(rect(X0 - 0.2, Y0, X1, Y1), 0.3), 0, BASE)
  prism(trim, null, rect(X0 - 0.2, Y0 - 0.15, X1 + 0.15, Y1 + 0.15), BASE - 0.5, BASE)
  for (const s of [-5.0, -2.25, 0.5]) flatShape(door, face(X1, s, [1, 0]), [[-1.0, 1.6], [1.0, 1.6], [1.0, 5.0], [-1.0, 5.0]], 0.08)
  // the steps up to the doors, between two cheek blocks
  {
    const xs0 = X1, xs1 = X1 + 5.5, w0 = -7.6, w1 = 3.1, zt = 1.5
    trim.quad([xs1, w0, 0], [xs1, w1, 0], [xs0, w1, zt], [xs0, w0, zt])
    for (const y of [w0 - 1.6, w1]) prism(stone, trim, rect(xs0, y, xs1 - 0.6, y + 1.6), 0, 2.4)
  }
  // the six giant columns, paired at the ends (OSM's column parts)
  for (const y of [7.2, 5.6, 0.4, -4.9, -10.2, -11.7]) lathe(trim, X1 - 0.9, y, [[0.95, BASE], [0.95, BASE + 0.7], [0.8, BASE + 0.8], [0.7, PH - 1.0], [0.95, PH - 0.3], [0.95, PH]], 10)
  // the windows of the pavilion behind the columns
  bays([X0, Y0], [X0, Y1], ROWS.slice(1), 5.0, 2.0, 1.6)
  // entablature, pediment and its copper roof
  prism(trim, null, rect(X0, Y0, X1 + 0.3, Y1), PH, ENT)
  const cy = (Y0 + Y1) / 2
  const A: V3 = [X1 + 0.3, Y0, ENT], B: V3 = [X1 + 0.3, Y1, ENT], C: V3 = [X1 + 0.3, cy, APEX]
  trim.tri(A, B, C)
  const A0: V3 = [X0 - 1, Y0, ENT], B0: V3 = [X0 - 1, Y1, ENT], C0: V3 = [X0 - 1, cy, APEX]
  roofs.quad(A0, A, C, C0)
  roofs.quad(B, B0, C0, C)
}

// ------------------------------------------------------------ the dome
{
  // the square base rising from the roofs, chamfered at the corners
  prism(stone, trim, chamfer(rect(-13.8, -13.8, 13.8, 13.8), 3.0), CTOP, 33.5)
  // the drum and its round-headed windows
  const DR = 12.6
  lathe(stone, 0, 0, [[DR, 33.5], [DR, 45.0]], 24)
  lathe(trim, 0, 0, [[DR, 33.5], [DR + 0.3, 33.5], [DR + 0.3, 34.3], [DR, 34.3]], 24)
  for (let k = 0; k < 16; k++) {
    const a = ((k + 0.5) / 16) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    flatShape(win, { o: [c * DR, s * DR, 0], n: [c, s] }, archShape(0, 1.9, 36.0, 41.8, 6), 0.08)
  }
  // the cornice, the attic of small windows
  lathe(trim, 0, 0, [[DR, 45.0], [DR + 0.6, 45.4], [DR + 0.6, 46.4], [12.0, 46.4]], 24)
  lathe(stone, 0, 0, [[12.0, 46.4], [12.0, 49.0], [12.3, 49.0], [12.3, 49.4], [11.6, 49.4]], 24)
  for (let k = 0; k < 16; k++) {
    const a = ((k + 0.5) / 16) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    flatShape(win, { o: [c * 12.0, s * 12.0, 0], n: [c, s] }, [[-0.5, 47.0], [0.5, 47.0], [0.5, 48.3], [-0.5, 48.3]], 0.08)
  }
  // the copper dome: very nearly a hemisphere, to its crown ring
  const R = 11.6, H = 11.1, Z0 = 49.4, RING = 2.9
  const tEnd = Math.acos(RING / R)
  const prof: [number, number][] = []
  for (let k = 0; k <= 9; k++) { const t = (tEnd * k) / 9; prof.push([R * Math.cos(t), Z0 + H * Math.sin(t)]) }
  lathe(copper, 0, 0, prof, 24)
  const zr = prof[prof.length - 1][1]
  // the lantern: a ring of openings round a core, its cap, the ball and finial
  lathe(trim, 0, 0, [[RING + 0.2, zr - 0.2], [RING + 0.2, zr + 1.0], [2.6, zr + 1.0], [2.6, zr + 7.0], [3.0, zr + 7.0], [3.0, zr + 7.8], [2.2, zr + 7.8]], 12)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    flatShape(win, { o: [c * 2.6, s * 2.6, 0], n: [c, s] }, archShape(0, 0.9, zr + 1.6, zr + 5.6, 4), 0.06)
  }
  lathe(copper, 0, 0, [[2.2, zr + 7.8], [1.9, zr + 9.0], [1.0, zr + 10.0], [0.45, zr + 10.4]], 12)
  lathe(trim, 0, 0, [[0.45, zr + 10.4], [0.6, zr + 10.9], [0.6, zr + 11.6], [0.25, zr + 12.0], [0.15, zr + 14.2], [0.01, zr + 15.5]], 8)
}

// ------------------------------------------------------------ materials
// Floodlit at night from the grounds: the walls, brightest low and on the
// drum and dome; faces looking up catch little.
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.25 : 1) * (p[2] < CTOP ? 0.8 : 0.95)
const domeLit = (p: V3, n: V3): number => (p[2] > 40 ? (n[2] > 0.9 ? 0.6 : 0.95) : 0.2)
// Named first: `finishGlb` takes plain swatches, and a floodlight rides along.
const limestone = { ...finish('ind-statehouse-limestone', 0xe8e1d2), floodlight: lit }
const trimLit = { ...PALETTE.trim, floodlight: lit }
const domeCopper = { ...PALETTE.copper, floodlight: domeLit }
const built = finishGlb('Indiana Statehouse', [
  { part: stone, material: limestone },
  { part: trim, material: trimLit },
  { part: copper, material: domeCopper },
  { part: roofs, material: finish('ind-statehouse-roof', 0xa2bcae) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 1.5, height: 76.0, replaces: ['way/339985770'] }, 6500)

if (import.meta.main) await writeModel('ind-indiana-statehouse', built)
