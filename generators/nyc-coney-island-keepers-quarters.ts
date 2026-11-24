/**
 * Keeper's Quarters, Coney Island Light Station, Sea Gate, Brooklyn — the
 * light keeper's house beside the Coney Island Light (U.S. Lighthouse
 * Board; Frank Schubert lived here 1960–2003) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-coney-island-keepers-quarters.ts
 *
 * Map frame: x = east, y = north, z up, metres, built in the house's own
 * frame and placed at bearing 50.7: its walls run 50.7° / 140.7°, like the
 * Sea Gate street grid and nyc-coney-island-light. Model north (+y) is
 * compass 50.7° (north-east); the porch front faces model south
 * (south-west); the garage wing is to model east (south-east).
 * Anchor: area centroid of OSM way/248352853 (-74.0116924, 40.5764670).
 *
 * Evidence
 * - OSM way/248352853 "Keeper's Quarters", building=house, height 8.8,
 *   NYC BIN 3329336. In this frame: main block x -7.39…2.35, y -4.27…4.42
 *   (9.7 × 8.7 m); a 1.9 m connector x 2.35…4.31, y -2.17…0.88; the
 *   garage wing x 4.31…8.90, y -3.22…3.16.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid, read in this
 *   frame. Ground +0.6 over ground_min; ridge 8.1 m above ground, running
 *   the long (x) way at y ≈ 0.8; back (north-east) eave ≈ 4.6 m, front
 *   eave ≈ 3.3 m; the front-left bay roof ≈ 6.5 m on its slope (its
 *   apex is drawn at 7.6 m, nearly ridge height as in "01", plus a
 *   finial); chimney return 9.3 m at x -2.2, y 2.2; garage wing
 *   hipped, peak ≈ 4.1 m at x ≈ 6.6. The OSM 8.8 m is the ridge plus
 *   some of the chimney; the lidar ridge is used.
 * - Photos (Wikimedia Commons):
 *   - "Coney Island Lighthouse 01.JPG", Jeffrey Lewis Riehle, CC BY-SA 3.0:
 *     the porch front (from the south-west) and the garage wing; scaled at
 *     about 76 px/m on the ground floor. The front-left bay with its own
 *     pointed hip and finial, the paired windows in it, the recessed porch
 *     with its white balustrade, the front dormer, the window right of the
 *     porch, the green door and garage door, and both gable ends seen
 *     edge-on, are from this photo.
 *   - "Coney Island Lighthouse 02.JPG", Jeffrey Lewis Riehle, CC BY-SA 3.0:
 *     the back (north-east) and north-west gable end. The whitewashed brick
 *     ground floor under dark weathered cedar shingle, the two back
 *     dormers, the tall brick chimney, the shingled gable wall with two
 *     upper windows and the ground-floor bay window are from this photo.
 *   - "US Coast Guard Established in 1890.JPG", Jeffrey Lewis Riehle,
 *     CC BY-SA 3.0: the back slope, dormers and chimney behind the tower.
 *   - "Coney Island Light.jpg", Oleg Yunakov, CC BY-SA 4.0, and
 *     "Nortons Point Light jeh.JPG", Jim.henderson, public domain: the
 *     shingled house and its roofs at a distance.
 *   - "CONEY ISLAND LIGHTHOUSE 1 150 500.jpg", Skip Willits, public domain:
 *     an older view with the roof then painted red; today's roof is the
 *     dark weathered shingle of the 2008+ photos, which is followed.
 * - Mapillary was not used (no access token on this machine).
 * - Terrain (Mapterhorn): flat, the lawn of the light station.
 *
 * Colours from the daylight photos: whitewashed brick (white), weathered
 * cedar shingle (grey-brown, pulled light), dark roof shingle (pulled to
 * charcoal, no darker than STYLE.md allows), red-brown chimney brick, the
 * green garage and porch doors.
 *
 * Estimates and doubts: window and dormer positions are scaled from the
 * two photos, so to about ±0.3 m; the east gable is mostly hidden by the
 * garage wing and its one window is assumed. The garage doors are put on
 * the wing's south-east face: in "01" the face with the doors is wider
 * than the wing's 4.6 m south-west face and runs parallel to the roof's
 * ridge, which the lidar puts along y; but the photo sees the main
 * front almost square-on, so the doors could be on the south-west face.
 * The connector's roof is assumed to be a low hip like the garage's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel } from './nyc-570-lexington'

const white = new Part(), shingle = new Part(), roof = new Part(), win = new Part(), brick = new Part(), door = new Part()

// Plan (see header).
const W = -7.39, E = 2.35, S = -4.27, N = 4.42
const CX0 = E, CX1 = 4.31, CY0 = -2.17, CY1 = 0.88
const GX0 = 4.31, GX1 = 8.9, GY0 = -3.22, GY1 = 3.16
// Heights.
const GF = 3.0 // top of the whitewashed ground floor
const EAVE_F = 3.3, EAVE_B = 4.6, RIDGE_Y = 0.8, RIDGE = 8.1
const OVER = 0.3, ROOF_T = 0.16

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat convex polygon, wound so it faces `out`. */
function face(p: Part, pts: V3[], out: V3) {
  const n = crs(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = dot(n, out) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** An axis-aligned box, all six faces (or without its bottom). */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  face(p, [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]], [0, 1, 0])
  face(p, [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], [-1, 0, 0])
  face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  face(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (bottom) face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
}

/** A roof plate: the top polygon (convex, sloped) and a soffit ROOF_T below, with edges. */
function plate(p: Part, top: V3[]) {
  const bot = top.map(([x, y, z]) => [x, y, z - ROOF_T] as V3)
  face(p, top, [0, 0, 1])
  face(p, bot, [0, 0, -1])
  const cx = top.reduce((s, v) => s + v[0], 0) / top.length, cy = top.reduce((s, v) => s + v[1], 0) / top.length
  for (let i = 0; i < top.length; i++) {
    const j = (i + 1) % top.length
    const mx = (top[i][0] + top[j][0]) / 2 - cx, my = (top[i][1] + top[j][1]) / 2 - cy
    face(p, [top[i], top[j], bot[j], bot[i]], [mx, my, 0])
  }
}

/** A hipped roof over a rectangle, ridge along x (or y), eaves overhanging by `o`. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, zE: number, zR: number, alongX: boolean, o = OVER) {
  const run = alongX ? (y1 - y0) / 2 : (x1 - x0) / 2, slope = (zR - zE) / run, z = zE - o * slope
  const X0 = x0 - o, X1 = x1 + o, Y0 = y0 - o, Y1 = y1 + o
  if (alongX) {
    const ym = (y0 + y1) / 2, r0: V3 = [x0 + run, ym, zR], r1: V3 = [x1 - run, ym, zR]
    plate(p, [[X0, Y0, z], [X1, Y0, z], r1, r0])
    plate(p, [[X1, Y1, z], [X0, Y1, z], r0, r1])
    plate(p, [[X0, Y1, z], [X0, Y0, z], r0])
    plate(p, [[X1, Y0, z], [X1, Y1, z], r1])
  } else {
    const xm = (x0 + x1) / 2, r0: V3 = [xm, y0 + run, zR], r1: V3 = [xm, y1 - run, zR]
    plate(p, [[X1, Y0, z], [X1, Y1, z], r1, r0])
    plate(p, [[X0, Y1, z], [X0, Y0, z], r0, r1])
    plate(p, [[X0, Y0, z], [X1, Y0, z], r0])
    plate(p, [[X1, Y1, z], [X0, Y1, z], r1])
  }
}

/** A window (or door) panel 0.05 m proud of a wall facing `side`. */
function panel(p: Part, side: 'n' | 's' | 'e' | 'w', at: number, a: number, b: number, z0: number, z1: number) {
  const d = 0.05
  if (side === 's') face(p, [[a, at - d, z0], [b, at - d, z0], [b, at - d, z1], [a, at - d, z1]], [0, -1, 0])
  if (side === 'n') face(p, [[a, at + d, z0], [b, at + d, z0], [b, at + d, z1], [a, at + d, z1]], [0, 1, 0])
  if (side === 'w') face(p, [[at - d, a, z0], [at - d, b, z0], [at - d, b, z1], [at - d, a, z1]], [-1, 0, 0])
  if (side === 'e') face(p, [[at + d, a, z0], [at + d, b, z0], [at + d, b, z1], [at + d, a, z1]], [1, 0, 0])
}

// ---------------------------------------------------------------------------
// Main block: whitewashed brick ground floor with the porch cut into its
// front, shingled upper walls and gable ends.
// ---------------------------------------------------------------------------
const PX0 = -3.9, PX1 = -0.1, PY = -2.5 // the recessed porch
{
  // Ground floor walls, counter-clockwise, with the porch notch.
  const ring: [number, number][] = [[W, S], [PX0, S], [PX0, PY], [PX1, PY], [PX1, S], [E, S], [E, N], [W, N]]
  for (let i = 0; i < ring.length; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % ring.length]
    const out: V3 = [by - ay, -(bx - ax), 0]
    face(white, [[ax, ay, 0], [bx, by, 0], [bx, by, GF], [ax, ay, GF]], out)
  }
  // Porch ceiling, so the recess reads from below.
  face(white, [[PX0, S, GF], [PX1, S, GF], [PX1, PY, GF], [PX0, PY, GF]], [0, 0, -1])
}
// Upper walls: front band under the low front eave, back wall to the high
// back eave, and the two shingled gable ends up to the ridge.
const roofZ = (y: number) => y <= RIDGE_Y
  ? EAVE_F + (y - S) * (RIDGE - EAVE_F) / (RIDGE_Y - S)
  : EAVE_B + (N - y) * (RIDGE - EAVE_B) / (N - RIDGE_Y)
face(shingle, [[W, S, GF], [E, S, GF], [E, S, EAVE_F], [W, S, EAVE_F]], [0, -1, 0])
face(shingle, [[E, N, GF], [W, N, GF], [W, N, EAVE_B], [E, N, EAVE_B]], [0, 1, 0])
for (const [x, s] of [[W, -1], [E, 1]] as [number, number][]) {
  face(shingle, [[x, S, GF], [x, N, GF], [x, N, EAVE_B], [x, RIDGE_Y, RIDGE], [x, S, EAVE_F]], [s, 0, 0])
}
// Main roof: two plates, overhanging the eaves and the gables.
{
  const sF = (RIDGE - EAVE_F) / (RIDGE_Y - S), sB = (RIDGE - EAVE_B) / (N - RIDGE_Y)
  const x0 = W - OVER, x1 = E + OVER
  const zf = EAVE_F - OVER * sF, zb = EAVE_B - OVER * sB
  plate(roof, [[x0, S - OVER, zf], [x1, S - OVER, zf], [x1, RIDGE_Y, RIDGE], [x0, RIDGE_Y, RIDGE]])
  plate(roof, [[x1, N + OVER, zb], [x0, N + OVER, zb], [x0, RIDGE_Y, RIDGE], [x1, RIDGE_Y, RIDGE]])
}

// The front-left bay: shingled to 5.2 m, its own pointed hip with a finial.
{
  const x0 = W, x1 = -4.0, y0 = S, y1 = -1.2, zE = 5.2, apex = 7.6
  face(shingle, [[x0, y0, GF], [x1, y0, GF], [x1, y0, zE], [x0, y0, zE]], [0, -1, 0])
  face(shingle, [[x0, y1, GF], [x0, y0, GF], [x0, y0, zE], [x0, y1, zE]], [-1, 0, 0])
  face(shingle, [[x1, y0, GF], [x1, y1, GF], [x1, y1, zE], [x1, y0, zE]], [1, 0, 0])
  const o = 0.25, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const zo = zE - o * (apex - zE) / ((x1 - x0) / 2)
  const c: V3[] = [[x0 - o, y0 - o, zo], [x1 + o, y0 - o, zo], [x1 + o, y1 + o, zo], [x0 - o, y1 + o, zo]]
  const top: V3 = [cx, cy, apex]
  for (let i = 0; i < 4; i++) plate(roof, [c[i], c[(i + 1) % 4], top])
  // Finial: a slim spike over the apex.
  const f = 0.12
  for (const [a, b] of [[[-f, -f], [f, -f]], [[f, -f], [f, f]], [[f, f], [-f, f]], [[-f, f], [-f, -f]]] as [number, number][][]) {
    face(roof, [[cx + a[0], cy + a[1], apex - 0.1], [cx + b[0], cy + b[1], apex - 0.1], [cx, cy, apex + 0.6]], [a[0] + b[0], a[1] + b[1], 0.3])
  }
  // Paired windows: ground floor and upper storey.
  panel(win, 's', S, -7.1, -5.75, 1.2, 2.7)
  panel(win, 's', S, -7.1, -5.75, 3.8, 4.9)
}

// Dormers: one hipped dormer on the front slope, two on the back.
function dormer(x: number, w: number, front: boolean) {
  const x0 = x - w / 2, x1 = x + w / 2
  const yf = front ? -3.7 : 3.85, yb = front ? -1.4 : 1.8
  const z0 = roofZ(yf) - 0.3, z1 = z0 + 1.35
  const out: V3 = [0, front ? -1 : 1, 0]
  face(shingle, [[x0, yf, z0], [x1, yf, z0], [x1, yf, z1], [x0, yf, z1]], out)
  for (const [xx, s] of [[x0, -1], [x1, 1]] as [number, number][]) face(shingle, [[xx, yf, z0], [xx, yb, z0], [xx, yb, z1], [xx, yf, z1]], [s, 0, 0])
  // Hipped at the front only; the ridge runs back into the main roof
  // (which is higher than zr at yb), so nothing humps over it.
  const zr = z1 + 0.6, o = 0.18, d = front ? -1 : 1, xm = (x0 + x1) / 2
  const run = w / 2, ze = z1 - o * (zr - z1) / run, yo = yf + d * o, yr = yf - d * run
  plate(roof, [[x0 - o, yo, ze], [x0 - o, yb, ze], [xm, yb, zr], [xm, yr, zr]])
  plate(roof, [[x1 + o, yb, ze], [x1 + o, yo, ze], [xm, yr, zr], [xm, yb, zr]])
  plate(roof, [[x0 - o, yo, ze], [x1 + o, yo, ze], [xm, yr, zr]])
  face(win, [[x0 + 0.25, yf + d * 0.05, z0 + 0.25], [x1 - 0.25, yf + d * 0.05, z0 + 0.25], [x1 - 0.25, yf + d * 0.05, z1 - 0.2], [x0 + 0.25, yf + d * 0.05, z1 - 0.2]], out)
}
dormer(-2.05, 1.5, true)
dormer(-0.7, 1.6, false)
dormer(1.45, 1.6, false)

// The porch: floor, two posts, a low balustrade, the door and a window.
box(white, PX0, S, 0, PX1, PY, 0.55)
for (const x of [PX0 + 0.14, PX1 - 0.14]) box(white, x - 0.13, S + 0.01, 0.55, x + 0.13, S + 0.27, GF)
box(white, -3.05, S + 0.05, 0.55, PX1 - 0.27, S + 0.2, 1.45)
face(door, [[-3.55, PY - 0.05, 0.55], [-2.65, PY - 0.05, 0.55], [-2.65, PY - 0.05, 2.65], [-3.55, PY - 0.05, 2.65]], [0, -1, 0])
panel(win, 's', PY, -1.9, -1.0, 1.2, 2.6)

// Ground-floor and upper windows on the other faces.
panel(win, 's', S, 0.35, 1.1, 1.3, 2.75)
panel(win, 'n', N, -5.1, -4.25, 1.0, 2.6)
panel(win, 'n', N, -2.9, -2.05, 1.0, 2.6)
panel(win, 'n', N, 0.3, 1.15, 1.0, 2.6)
panel(win, 'w', W, -2.4, -1.6, 3.6, 4.8)
panel(win, 'w', W, 1.6, 2.4, 3.6, 4.8)
panel(win, 'w', W, -3.4, -2.6, 1.0, 2.6)
panel(win, 'e', E, -0.4, 0.4, 5.0, 6.0)
// The north-west gable's ground-floor bay window: a shallow box.
box(white, W - 0.45, -1.0, 0.55, W, 1.0, 2.85)
panel(win, 'w', W - 0.45, -0.8, 0.8, 0.95, 2.55)
face(roof, [[W - 0.6, -1.15, 2.85], [W, -1.15, 3.0], [W, 1.15, 3.0], [W - 0.6, 1.15, 2.85]], [0, 0, 1])

// The tall brick chimney on the back slope, rising past the ridge.
box(brick, -2.65, 1.65, roofZ(2.4) - 0.3, -1.75, 2.35, 9.4)
box(brick, -2.75, 1.55, 9.4, -1.65, 2.45, 9.6)

// ---------------------------------------------------------------------------
// The connector and the garage wing: shingled, low hipped roofs, green doors.
// ---------------------------------------------------------------------------
{
  const zE = 2.6
  face(shingle, [[CX0, CY0, 0], [CX1, CY0, 0], [CX1, CY0, zE], [CX0, CY0, zE]], [0, -1, 0])
  face(shingle, [[CX1, CY1, 0], [CX0, CY1, 0], [CX0, CY1, zE], [CX1, CY1, zE]], [0, 1, 0])
  hipRoof(roof, CX0, CY0, CX1 + 0.6, CY1, zE, 3.4, true, 0.2)
  // Garage.
  face(shingle, [[GX0, GY0, 0], [GX1, GY0, 0], [GX1, GY0, zE], [GX0, GY0, zE]], [0, -1, 0])
  face(shingle, [[GX1, GY1, 0], [GX0, GY1, 0], [GX0, GY1, zE], [GX1, GY1, zE]], [0, 1, 0])
  face(shingle, [[GX1, GY0, 0], [GX1, GY1, 0], [GX1, GY1, zE], [GX1, GY0, zE]], [1, 0, 0])
  for (const [a, b] of [[GY0, CY0], [CY1, GY1]]) face(shingle, [[GX0, b, 0], [GX0, a, 0], [GX0, a, zE], [GX0, b, zE]], [-1, 0, 0])
  hipRoof(roof, GX0, GY0, GX1, GY1, zE, 4.1, false)
  // The doors face south-east (+x): "01" sees this face, not the south one.
  panel(door, 'e', GX1, -2.6, -1.75, 0, 2.1)
  panel(door, 'e', GX1, -0.7, 2.4, 0, 2.3)
}

finishModel("Keeper's Quarters, Coney Island Light", 'nyc-coney-island-keepers-quarters', [
  { part: white, material: finish('whitewash', 0xf1eee6) },
  { part: shingle, material: finish('cedar-shingle', 0x84776a) },
  { part: roof, material: finish('shingle-roof', 0x5f6166) },
  { part: win, material: PALETTE.window },
  { part: brick, material: finish('chimney-brick', 0xa3655a) },
  { part: door, material: finish('door-green', 0x5f7a68) },
], { bearing: 50.7, osm: 'way/248352853', height: 9.6 })
