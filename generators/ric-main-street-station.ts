/**
 * Main Street Station, 1520 East Main Street, Shockoe Bottom, Richmond,
 * Virginia (1901, Wilson, Harris & Richards; train shed 1901, enclosed as
 * an event hall 2018) — original procedural geometry, CC0-1.0.
 * bun generators/ric-main-street-station.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 37.11: the long sides of OSM way/113030476 run at
 * 37.1°, so +y runs up the train shed to the north-east and the head house
 * stands at -y, its front (with the steps) facing Main Street to the
 * south-west. Anchor = the outline's centroid, -77.4288081, 37.5349541.
 *
 * Identity (from the photos below):
 *  1. The head house: a five-storey Beaux-Arts / French Renaissance block in
 *     orange-red brick on a rusticated buff stone base, with a very steep
 *     red tile hipped roof carrying two rows of dormers and copper ridge
 *     finials, a stone cornice and balustrade, five-arched loggia over a
 *     five-arched ground floor on the Main Street front.
 *  2. The clock tower at the front west corner: square brick shaft, a
 *     corbelled balcony, the clock stage with a clock on each face, and a
 *     domed red tile cap with a copper lantern spike.
 *  3. The long train shed behind it on the elevated tracks: a low hipped
 *     roof with a raised clerestory monitor down its middle, the monitor's
 *     gable standing over the hipped north end (HABS photo), glass walls
 *     since 2018.
 *
 * Plan (OSM, in the turned frame): outline way/113030476 x -22.2..22.1,
 * y -99.6..88.6; head house part way/366226941 x -15.0..15.6,
 * y -99.6..-79.6; tower part way/366226942 x -14.9..-8.7, y -99.6..-92.7;
 * between them a lower brick connector (y -80..-60) widening to the shed.
 * The model draws the whole outline, so `replaces` lists all three ways.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 1 m grid, read in this frame with tools/lidar_frame.py. y = 0 is the
 * Main Street pavement at the front (3.3 above ground_min; the side yards
 * are 4.4). Measured above y = 0: head house balustrade 18.4–19.5, tile
 * ridge 33.0 (running x -8..6 at y ≈ -89.5), tower cap 40.5; connector
 * flat roof 14.5 (with a 17.5 bump); shed eaves 14.2 at x ±22, aisle roofs
 * up to 18.3 at x ±9, monitor eaves 21.2, monitor ridge 24.5; the track
 * deck beside the shed 6.9. OSM's part heights (18, 20.3) are the walls,
 * not the roof or tower, and are not used.
 * Estimated from the photos: storey heights and openings on the front
 * (Schützenpanzer, Mobilus In Mobili), the tower stages, the dormers
 * (two rows: four large and six small a slope on the long faces), the
 * chimney, the finials, the shed's columns and glass walls.
 *
 * Ground: Mapterhorn and lidar fall ~1 m from the shed yards to the Main
 * Street front; elevation 0.
 *
 * Night: the head house and tower are floodlit; windows and the shed's
 * glass walls glow.
 *
 * Photos (all EVIDENCE):
 *  - Richmond Main Street Station.jpg, Schützenpanzer, CC BY-SA 4.0 (front,
 *    from the south-west under I-95)
 *    https://commons.wikimedia.org/wiki/File:Richmond_Main_Street_Station.jpg
 *  - Main Street Station Richmond Virginia April 2015 (17082469216).jpg,
 *    Mobilus In Mobili, CC BY 2.0 (front elevation)
 *    https://commons.wikimedia.org/wiki/File:Main_Street_Station_Richmond_Virginia_April_2015_(17082469216).jpg
 *  - Richmond Main Street Station from I-95 in Virginia.JPG, DanTD, CC BY-SA
 *    3.0 (the west roof slope and the tower cap)
 *    https://commons.wikimedia.org/wiki/File:Richmond_Main_Street_Station_from_I-95_in_Virginia.JPG
 *  - VIEW OF TRAINSHED FROM EAST - Main Street Station, Trainshed, HABS
 *    VA,44-RICH,97-A-1, public domain (the shed roof and monitor)
 *    https://commons.wikimedia.org/wiki/File:VIEW_OF_TRAINSHED_FROM_EAST_-_Main_Street_Station,_Trainshed,_1520_East_Main_Street,_Richmond,_Independent_City,_VA_HABS_VA,44-RICH,97-A-1.tif
 *  - Richmond - Richmond Main Street Station - 20230322124237.jpg,
 *    Adamiglehart, CC BY-SA 4.0 (the enclosed shed inside: glass walls)
 *    https://commons.wikimedia.org/wiki/File:Richmond_-_Richmond_Main_Street_Station_-_20230322124237.jpg
 *  - USGS NAIP orthoimagery (public domain): plan, roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north-east and south-east faces of the head house are seen
 * only obliquely; their openings mirror the front's rhythm. The space under
 * the shed's track deck is drawn as a recessed dark base. The shed's
 * north end details beyond the HABS photo are estimated. Lidar is 2014,
 * before the 2018 enclosure (roof unchanged).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, hipRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, prism, save } from './atl-flatiron-building'

const brick = new Part(), stone = new Part(), tile = new Part(), steel = new Part(), win = new Part(), cu = new Part()

// ── Plan ──
const HX0 = -15.0, HX1 = 15.5, HY0 = -99.6, HY1 = -79.6 // head house
const TX0 = -15.3, TX1 = -8.7, TY0 = -99.9, TY1 = -92.7 // clock tower (a little proud of the front)
const BASE = 7.5, CORN = 17.5, PARA = 19.0, RIDGE = 33.0

/** A face from a to b with its outside on the right. */
type F = [XY, XY]
const FRONT: F = [[HX0, HY0], [HX1, HY0]]
const EASTF: F = [[HX1, HY0], [HX1, HY1]]
const WESTF: F = [[HX0, HY1], [HX0, HY0]]
const BACK: F = [[HX1, HY1], [HX0, HY1]]

function arched(f: F, p: Part, s: number, w: number, z0: number, zs: number, sur = 0.35, surP: Part = stone) {
  if (sur > 0) onWall(surP, f[0], f[1], archShape(s, w + sur * 2, z0 - sur * 0.5, zs, 10), 0.05)
  onWall(p, f[0], f[1], archShape(s, w, z0, zs, 10), 0.1)
}
function rectWin(f: F, s: number, w: number, z0: number, z1: number, sur = 0.25) {
  if (sur > 0) onWall(stone, f[0], f[1], rectShape(s - w / 2 - sur, s + w / 2 + sur, z0 - sur, z1 + sur), 0.05)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.1)
}

// ── Head house body ──
box(stone, HX0, HX1, HY0, HY1, 0, BASE, null, 0)
box(brick, HX0, HX1, HY0, HY1, BASE, CORN, null, 0)
box(stone, HX0 - 0.15, HX1 + 0.15, HY0 - 0.15, HY1 + 0.15, BASE - 0.5, BASE, stone, 0.1) // belt course
// cornice and balustrade
box(stone, HX0 - 0.6, HX1 + 0.6, HY0 - 0.6, HY1 + 0.6, CORN, CORN + 0.8, stone, 0.3)
box(stone, HX0 - 0.35, HX1 + 0.35, HY0 - 0.35, HY1 + 0.35, CORN + 0.8, PARA, stone, 0.1)
box(stone, HX0 - 0.3, HX1 + 0.3, HY0 - 0.3, HY1 + 0.3, BASE + 6.4, BASE + 6.7, stone, 0.05) // string course under the top floor
// the tile roof: hipped, very steep, its ridge along x
hipRoof(tile, HX0 + 0.1, HX1 - 0.1, HY0 + 0.1, HY1 - 0.1, PARA - 0.3, RIDGE, 0)
const RC: XY = [(HX0 + HX1) / 2, (HY0 + HY1) / 2]
const half = (HY1 - HY0) / 2 - 0.1
const ridgeHalf = (HX1 - HX0) / 2 - 0.1 - half
for (const sx of [-1, 1]) revolve(cu, [RC[0] + sx * ridgeHalf, RC[1]], [[0.35, RIDGE - 0.4], [0.3, RIDGE + 0.6], [0.18, RIDGE + 1.2], [0.06, RIDGE + 3.4], [0, RIDGE + 3.6]], 6, 0, true, true)
box(cu, RC[0] - ridgeHalf, RC[0] + ridgeHalf, RC[1] - 0.15, RC[1] + 0.15, RIDGE - 0.2, RIDGE + 0.25, cu, 0) // ridge cresting
// chimney at the east end
box(brick, 12.3, 13.6, -88.0, -86.6, 22, 30.5, stone, 0.1)

/** A convex planar polygon, wound to face `out`. */
function face(p: Part, pts: V3[], out: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/**
 * A gabled dormer on a roof slope: `e` is the point on the eave line under
 * it, `n` the slope's outward direction, `slope` the roof's rise per metre
 * inward from the eave at `ze`.
 */
function dormer(e: XY, n: XY, ze: number, slope: number, z0: number, z1: number, w: number, big = false) {
  const t: XY = [-n[1], n[0]]
  const fIn = (z0 - ze) / slope + 0.15 // front face where the roof reaches its sill
  const zr = z1 + w * 0.55
  const back = (zr - ze) / slope + 0.4
  const P = (s: number, d: number, z: number): V3 => [e[0] + t[0] * s - n[0] * d, e[1] + t[1] * s - n[1] * d, z]
  const h = w / 2
  const wall = big ? stone : brick
  const N3: V3 = [n[0], n[1], 0]
  // the box: front, cheeks (the back is buried in the roof)
  face(wall, [P(-h, fIn, z0), P(h, fIn, z0), P(h, fIn, z1), P(-h, fIn, z1)], N3)
  face(wall, [P(-h, fIn, z1), P(h, fIn, z1), P(0, fIn, zr)], N3)
  for (const k of [-1, 1]) face(wall, [P(k * h, fIn, z0), P(k * h, back, z0), P(k * h, back, z1), P(k * h, fIn, z1)], [t[0] * k, t[1] * k, 0])
  // roof
  const ov = 0.15
  for (const k of [-1, 1]) {
    const a = P(k * (h + ov), fIn - ov, z1 - ov * 0.55), b = P(0, fIn - ov, zr), c = P(0, back, zr), d = P(k * (h + ov), back, z1 - ov * 0.55)
    face(tile, [a, b, c, d], [t[0] * k, t[1] * k, 1])
  }
  // the window, a touch proud of the front
  const ww = w * 0.55
  const Q = (s: number, z: number): V3 => P(s, fIn - 0.06, z)
  face(win, [Q(-ww / 2, z0 + 0.35), Q(ww / 2, z0 + 0.35), Q(ww / 2, z1 - 0.25), Q(-ww / 2, z1 - 0.25)], N3)
}
// roof slopes: rise per metre inward
const sFB = (RIDGE - (PARA - 0.3)) / half
const sEW = (RIDGE - (PARA - 0.3)) / ((HX1 - HX0) / 2 - 0.1 - ridgeHalf)
for (const [y, ny] of [[HY0 + 0.1, -1], [HY1 - 0.1, 1]] as [number, number][]) {
  for (const x of [-4.8, 0.6, 6.0, 11.4]) dormer([x, y], [0, ny], PARA - 0.3, sFB, 20.0, 23.2, x === 0.6 || x === 6.0 ? 2.6 : 2.0, x === 0.6 || x === 6.0)
  for (const x of [-2.4, 3.3, 9.0]) dormer([x, y], [0, ny], PARA - 0.3, sFB, 25.4, 27.4, 1.5)
}
for (const [x, nx] of [[HX0 + 0.1, -1], [HX1 - 0.1, 1]] as [number, number][]) {
  if (nx < 0) continue // the west slope is mostly behind the tower; the east slope carries the side dormers
  for (const y of [-93.0, -86.2]) dormer([x, y], [nx, 0], PARA - 0.3, sEW, 20.0, 23.0, 2.0)
}
for (const y of [-89.6]) dormer([HX0 + 0.1, y], [-1, 0], PARA - 0.3, sEW, 20.0, 23.0, 2.0)

// ── Front: ground arcade, loggia, top-floor windows ──
{
  const s = (x: number) => x - HX0
  const arches = [-3.4, 0, 3.4, 6.8, 10.2]
  for (const x of arches) {
    arched(FRONT, win, s(x), 2.4, 2.6, 5.6, 0.3)
    arched(FRONT, win, s(x), 2.9, BASE + 0.6, BASE + 4.1, 0.35)
  }
  // loggia balustrade
  onWall(stone, FRONT[0], FRONT[1], rectShape(s(-5.3), s(12.1), BASE + 0.5, BASE + 1.4), 0.25)
  for (const x of [-6.9, 13.7]) {
    arched(FRONT, win, s(x), 1.9, 3.0, 5.8, 0.3)
    rectWin(FRONT, s(x), 1.3, BASE + 1.2, BASE + 4.4)
    onWall(stone, FRONT[0], FRONT[1], archShape(s(x), 2.2, BASE + 4.7, BASE + 4.8, 8), 0.07) // the carved pediment over it
  }
  for (let k = 0; k < 11; k++) rectWin(FRONT, s(-7.4 + k * 2.1), 1.1, BASE + 7.0, BASE + 9.4, 0.18)
  // the steps up to the arcade
  for (let k = 0; k < 4; k++) box(stone, -6.5 + k * 0.3, 13.3 - k * 0.3, HY0 - 3.2 + k * 0.8, HY0, 0, 0.65 * (k + 1), stone, 0)
}
// Sides and back
for (const f of [EASTF, WESTF]) {
  const L = HY1 - HY0
  const ss = f === WESTF ? [3.2, 7.2, 11.2] : [3.6, 7.8, 12.0, 16.2]
  for (const s of ss) {
    if (f === WESTF && s > L - (TY1 - HY0) - 0.5) continue // behind the tower
    arched(f, win, s, 1.9, 2.6, 5.4, 0.3)
    arched(f, win, s, 2.0, BASE + 1.0, BASE + 4.0, 0.3)
    rectWin(f, s, 1.2, BASE + 7.0, BASE + 9.4, 0.18)
  }
}
for (let k = 0; k < 10; k++) rectWin(BACK, 2.0 + k * 2.95, 1.1, 15.0, 16.9, 0.15)

// ── Clock tower ──
{
  const SHAFT = 27.0, CL0 = 28.0, CL1 = 34.4
  const cx = (TX0 + TX1) / 2, cy = (TY0 + TY1) / 2, hx = (TX1 - TX0) / 2, hy = (TY1 - TY0) / 2
  box(stone, TX0, TX1, TY0, TY1, 0, BASE, null, 0)
  box(brick, TX0, TX1, TY0, TY1, BASE, SHAFT, null, 0)
  box(stone, TX0 - 0.15, TX1 + 0.15, TY0 - 0.15, TY1 + 0.15, CORN, CORN + 0.8, stone, 0.2) // the main cornice carried round
  // corbelled balcony
  box(stone, TX0 - 0.5, TX1 + 0.5, TY0 - 0.5, TY1 + 0.5, SHAFT, CL0, stone, 0.25)
  // clock stage, a little narrower, with corner piers
  box(brick, cx - hx + 0.3, cx + hx - 0.3, cy - hy + 0.3, cy + hy - 0.3, CL0, CL1, null, 0)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(stone, cx + sx * (hx - 0.3) - 0.45, cx + sx * (hx - 0.3) + 0.45, cy + sy * (hy - 0.3) - 0.45, cy + sy * (hy - 0.3) + 0.45, CL0, CL1, null, 0.1)
  box(stone, TX0 - 0.35, TX1 + 0.35, TY0 - 0.35, TY1 + 0.35, CL1, CL1 + 0.9, stone, 0.3)
  // clocks on all four faces
  const hx2 = hx - 0.3, hy2 = hy - 0.3
  const faces: F[] = [
    [[cx - hx2, cy - hy2], [cx + hx2, cy - hy2]], [[cx + hx2, cy - hy2], [cx + hx2, cy + hy2]],
    [[cx + hx2, cy + hy2], [cx - hx2, cy + hy2]], [[cx - hx2, cy + hy2], [cx - hx2, cy - hy2]],
  ]
  const ring = (s: number, z: number, r: number, n = 16) => Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
  for (const f of faces) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
    onWall(win, f[0], f[1], ring(L / 2, 31.3, 2.0), 0.06)
    onWall(stone, f[0], f[1], ring(L / 2, 31.3, 1.7), 0.1)
  }
  // shaft windows on the two street faces
  const TF: F = [[TX0, TY0], [TX1, TY0]], TW: F = [[TX0, TY1], [TX0, TY0]]
  for (const f of [TF, TW]) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    arched(f, win, m, 1.8, 2.8, 5.6, 0.3)
    for (const z of [9.0, 13.2]) for (const d of [-1, 1]) rectWin(f, m + d * 0.95, 0.8, z, z + 2.4, 0.15)
    for (const d of [-1.3, 0, 1.3]) rectWin(f, m + d, 0.8, 18.8, 21.4, 0.15)
    for (const d of [-1, 1]) arched(f, win, m + d * 0.95, 0.9, 22.8, 25.0, 0.15)
  }
  // the domed tile cap and the copper lantern spike
  const r = (h: number) => h * Math.SQRT2
  const z = CL1 + 0.9, H = 3.4
  revolve(tile, [cx, cy], [[r(H), z], [r(H - 0.2), z + 1.2], [r(H - 0.9), z + 2.9], [r(H - 1.9), z + 4.1], [r(H - 2.9), z + 4.7], [0.0, z + 5.0]], 4, Math.PI / 4, true, true)
  revolve(cu, [cx, cy], [[0.55, z + 4.6], [0.55, z + 5.6], [0.75, z + 5.8], [0.3, z + 6.6], [0.18, z + 8.6], [0, z + 9.4]], 8, 0, true, true)
}

// ── Connector between the head house and the shed ──
{
  const ring: XY[] = [[-12.08, -79.6], [12.32, -79.6], [11.93, -69.18], [22.11, -60.13], [-22.18, -59.99], [-12.67, -69.16]]
  prism(steel, ring, 0, 10.0, steel, 0.2) // the low platform roofs either side
  prism(brick, [[-12.08, -79.6], [12.32, -79.6], [12.1, -60.5], [-12.4, -60.5]], 0, 14.5, steel, 0.3)
  box(brick, 4.5, 10.5, -76, -70, 14.5, 17.4, steel, 0.2) // the stair bulkhead
  for (const [a, b] of [[[-12.67, -69.16], [-12.08, -79.6]], [[12.32, -79.6], [11.93, -69.18]]] as F[]) {
    for (const s of [2.5, 5.2, 7.9]) rectWin([a, b], s, 1.3, 8.6, 12.6, 0.15)
  }
}

// ── Train shed ──
{
  const X = 22.12, Y0 = -60.0, Y1 = 88.4, DECK = 6.9, EAVE = 14.2, AISLE = 18.3, MX = 9.0, MEAVE = 21.2, MRIDGE = 24.5
  const WX = 20.0 // glass walls under the eaves
  // dark base under the track deck, the deck's stone edge, glass walls with steel columns
  box(steel, -WX + 1.2, WX - 1.2, Y0, Y1 - 2.5, 0, DECK - 0.5, null, 0)
  box(stone, -WX - 0.3, WX + 0.3, Y0, Y1 - 1.5, DECK - 0.6, DECK, stone, 0.1)
  box(steel, -WX, WX, Y0, Y1 - 1.8, DECK, EAVE, null, 0)
  const bays = 16, step = (Y1 - 1.8 - Y0) / bays
  for (const sx of [-1, 1]) {
    const f: F = sx > 0 ? [[WX, Y0], [WX, Y1 - 1.8]] : [[-WX, Y1 - 1.8], [-WX, Y0]]
    for (let k = 0; k < bays; k++) {
      const s0 = k * step + 0.35, s1 = (k + 1) * step - 0.35
      onWall(win, f[0], f[1], rectShape(s0, s1, DECK + 0.4, EAVE - 0.5), 0.06)
    }
  }
  {
    const f: F = [[WX, Y1 - 1.8], [-WX, Y1 - 1.8]]
    for (let k = 0; k < 5; k++) onWall(win, f[0], f[1], rectShape(0.6 + k * 7.9, 7.6 + k * 7.9, DECK + 0.4, EAVE - 0.5), 0.06)
  }
  // the low hipped aisle roof, open over the monitor
  const hip = (MX / X) * 0 + (X - MX) // run of the hip at the north end (45° in plan)
  const yi = Y1 - hip
  const eave = (x: number, y: number): V3 => [x, y, EAVE]
  const inner = (x: number, y: number): V3 => [x, y, AISLE]
  for (const sx of [-1, 1]) {
    const a = eave(sx * X, Y0), b = eave(sx * X, Y1), c = inner(sx * MX, yi), d = inner(sx * MX, Y0)
    face(steel, [a, b, c, d], [sx, 0, 3])
  }
  face(steel, [eave(X, Y1), eave(-X, Y1), inner(-MX, yi), inner(MX, yi)], [0, 1, 3])
  face(steel, [eave(-X, Y0), eave(X, Y0), eave(X, Y1), eave(-X, Y1)], [0, 0, -1]) // soffit
  // fascia
  for (const sx of [-1, 1]) {
    const f: V3[] = [[sx * X, Y0, EAVE - 0.5], [sx * X, Y1, EAVE - 0.5], [sx * X, Y1, EAVE], [sx * X, Y0, EAVE]]
    face(steel, f, [sx, 0, 0])
  }
  face(steel, [[X, Y1, EAVE - 0.5], [-X, Y1, EAVE - 0.5], [-X, Y1, EAVE], [X, Y1, EAVE]], [0, 1, 0])
  // south end of the aisle roofs, against the connector
  for (const sx of [-1, 1]) {
    const p: V3[] = [[sx * X, Y0, EAVE], [sx * MX, Y0, EAVE], [sx * MX, Y0, AISLE]]
    face(steel, p, [0, -1, 0])
  }
  // the clerestory monitor: louvred walls, gabled roof
  box(steel, -MX, MX, Y0, yi, EAVE, MEAVE, null, 0)
  for (const sx of [-1, 1]) {
    const f: F = sx > 0 ? [[MX, Y0], [MX, yi]] : [[-MX, yi], [-MX, Y0]]
    const L = yi - Y0, n = 12, w = L / n
    for (let k = 0; k < n; k++) onWall(win, f[0], f[1], rectShape(k * w + 0.5, (k + 1) * w - 0.5, AISLE + 0.4, MEAVE - 0.3), 0.06)
  }
  const MO = 0.6
  const m = (x: number, y: number, z: number): V3 => [x, y, z]
  const yA = Y0, yB = yi + 0.8
  face(steel, [m(MX + MO, yA, MEAVE - 0.1), m(MX + MO, yB, MEAVE - 0.1), m(0, yB, MRIDGE), m(0, yA, MRIDGE)], [1, 0, 2])
  face(steel, [m(-MX - MO, yB, MEAVE - 0.1), m(-MX - MO, yA, MEAVE - 0.1), m(0, yA, MRIDGE), m(0, yB, MRIDGE)], [-1, 0, 2])
  face(steel, [m(-MX - MO, yA, MEAVE - 0.1), m(MX + MO, yA, MEAVE - 0.1), m(MX + MO, yB, MEAVE - 0.1), m(-MX - MO, yB, MEAVE - 0.1)], [0, 0, -1]) // soffit
  // gable ends of the monitor
  face(steel, [m(MX, yi, MEAVE), m(0, yi, MRIDGE - 0.1), m(-MX, yi, MEAVE)], [0, 1, 0])
  face(steel, [m(-MX, Y0, MEAVE), m(0, Y0, MRIDGE - 0.1), m(MX, Y0, MEAVE)], [0, -1, 0])
  face(steel, [m(MX, yi, EAVE), m(MX, yi, MEAVE), m(-MX, yi, MEAVE), m(-MX, yi, EAVE)], [0, 1, 0])
}

const lit = (p: V3) => (p[1] < -79 ? 0.85 : 0)
await save('ric-main-street-station', 'Main Street Station', [
  { part: brick, material: { ...finish('mss-brick', 0xc5805e), floodlight: lit } },
  { part: stone, material: { ...finish('mss-stone', 0xe3d7c0), floodlight: lit } },
  { part: tile, material: { ...finish('mss-tile', 0xa65a4b), floodlight: lit } },
  { part: steel, material: finish('mss-shed-roof', 0x7f878f) },
  { part: win, material: PALETTE.window },
  { part: cu, material: PALETTE.patina },
], { height: 44.3, anchor: [37.5349541, -77.4288081], bearing: 37.11 })
