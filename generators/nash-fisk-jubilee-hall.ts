/**
 * Jubilee Hall, Fisk University, Nashville (1873–76, Stephen Hatch;
 * National Historic Landmark) — original procedural geometry, CC0-1.0.
 * bun generators/nash-fisk-jubilee-hall.ts
 *
 *
 * Map frame: x, y, z up, metres, turned to bearing 151.6, so +y points out
 * of the south front (south-south-east) and +x runs along it toward the
 * west end. Anchor = area centroid of OSM way/759701057, 36.168996,
 * -86.804997. y = 0 is the lowest ground under the footprint (the north
 * end, lidar 1.8 m above the box's ground_min); the ground rises ~3.3 m
 * to the south front, so the limestone basement shows as a full storey at
 * the back and only ~1 m at the front.
 *
 * Identity, in order: the L plan of red brick banded with pale stone
 * string courses; the tower on the south-east corner pavilion (steep slate
 * pyramid, a dark octagonal base, the open white belfry, a ring of gablets
 * and the tall octagonal spire); the steep wall gables on every pavilion
 * face; the slate mansards with gabled dormers and tall banded chimneys;
 * three storeys of segmental-headed windows over a rusticated limestone
 * basement; the columned south porch with its balcony.
 *
 * Evidence:
 *  - plan: OSM way/759701057 (no building:part inside it), simplified to
 *    two wings and five shallow projecting bays. The lidar outline sits
 *    ~1.5 m north-north-west of OSM; the OSM outline is kept.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid in
 *    the model frame (above y = 0): wall-top cornice 17.4, mansard flat top
 *    23.1 (the flat strip is ~6 m wide, so the mansard slopes run ~4.6 m
 *    in), chimneys ~24, pavilion roofs/gables ~23-24, tower spire still
 *    ~1 m wide at 37.9 at (-9, 13). Measured. Spire tip 38.9 and finial
 *    39.9 estimated from the spire's taper.
 *  - storey, window and band heights, tower stages, bay rhythm: scaled
 *    from the HABS south front (TN-19 7A-1) against the lidar eave; bays
 *    counted on the HABS views (estimated).
 *  - colours: orange-red brick and grey-brown roofs from Fhaywood25's
 *    colour aerial (pulled to the palette), pale limestone dressings, the
 *    belfry white, the spire and the tower base dark (the aerial shows
 *    them dark brown; HABS 1970s shows the base pale).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - HABS TN-19 (Historic American Buildings Survey, public domain):
 *    7A-1 South front, 7A-2 North and west sides, 7A-3 West side and
 *    south front, 7A-6 Detail tower from east (Jack Boucher); 7A-13 East
 *    side and north (rear) elevations, 7A-15 south-east corner tower
 *    detail (Gilford Photography).
 *    https://commons.wikimedia.org/wiki/File:South_front_-_Fisk_University,_Jubilee_Hall,_Seventeenth_Avenue,_North,_Nashville,_Davidson_County,_TN_HABS_TENN,19-NASH,7A-1.tif
 *  - JubileeHallFiskU.jpg, Fhaywood25, CC BY-SA 4.0 (colour aerial from
 *    the south-east) https://commons.wikimedia.org/wiki/File:JubileeHallFiskU.jpg
 *  - USGS NAIP (public domain): plan and roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the door is `entrance`; the belfry and spire carry
 * floodlight (assumed; no night photo found).
 *
 * Left out: carving and corbel tables (a plain cornice band), cresting,
 * iron balconies, the porch balustrade, gablet pinnacles, the belfry's
 * arches and fretwork, the zigzag band on the tower base.
 *
 * Doubts: the inner (courtyard) faces and the north end are drawn from
 * oblique views only; dormer and chimney positions on the rear wing are
 * approximate; the west porch's size is estimated from one view.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, offset, save, type XY } from './atl-westin-peachtree-plaza'
import { face, prismV, block, quadH, triH, type Face } from './nash-ryman-auditorium'
import { wf, rect, chamfered, taper, type Side } from './nash-downtown-presbyterian'

/** A flat convex shape (s, z outline) on a face, wound to face out whatever the outline's order. */
function shape(p: Part, f: Face, o: XY[], out = 0.06) {
  const c = o.reduce<XY>((m, q) => [m[0] + q[0] / o.length, m[1] + q[1] / o.length], [0, 0])
  const C = f.P(c[0], c[1], out), hint: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; triH(p, C, f.P(a[0], a[1], out), f.P(b[0], b[1], out), hint) }
}

const brick = new Part(), stone = new Part(), slate = new Part(), flat = new Part(), win = new Part(), door = new Part()

// ── Levels (model z, metres above the lowest ground, the rear north end) ──
const EAVE = 17.4 // lidar: wall-top cornice 19.2 above the box's ground_min, less 1.8
const MTOP = 23.0 // mansard flat top: lidar 24.9 above ground_min, less 1.8
const MIN = 4.6 // mansard inset at its top: lidar shows a flat strip ~6 m wide on 15.5 m wings
const WT = 4.25 // top of the limestone basement (front ground 3.3 + ~1)
const ROWS: [number, number][] = [[4.5, 7.0], [9.6, 12.1], [13.8, 15.7]] // sill, springing of the three storeys
const BASEROW: [number, number] = [1.3, 3.1] // basement windows, where the ground falls away
const BANDS = [6.95, 9.3, 12.05, 13.5, 15.65] // pale stone string courses
const RISE = 0.42 // segmental window heads

/** Outline (s, z), ccw from outside, of a window with a segmental head of `rise`. */
function seg(sc: number, w: number, z0: number, zs: number, rise = RISE, n = 3): XY[] {
  const h = w / 2, R = (h * h + rise * rise) / (2 * rise), zc = zs + rise - R, a0 = Math.atan2(zs - zc, h)
  const pts: XY[] = [[sc - h, z0], [sc + h, z0], [sc + h, zs]]
  for (let i = 1; i < n; i++) { const a = a0 + ((Math.PI - 2 * a0) * i) / n; pts.push([sc + R * Math.cos(a), zc + R * Math.sin(a)]) }
  pts.push([sc - h, zs])
  return pts
}
/** A window: pale stone surround and segmental hood, the glass as one light or a pair. */
function win1(f: Face, s: number, z0: number, zs: number, pair = false, out = 0) {
  const w = pair ? 2.0 : 1.15
  shape(stone, f, seg(s, w + 0.42, z0 - 0.16, zs, RISE + 0.2), out + 0.04)
  if (!pair) shape(win, f, seg(s, w, z0, zs), out + 0.08)
  else for (const k of [-0.5, 0.5]) shape(win, f, seg(s + k, 0.82, z0, zs, 0.3), out + 0.08)
}
type Bay = [number, 's' | 'p']
/** Windows on a wall face: bays at world coordinates along it, three storeys (and the basement). */
function facade(dir: Side, c: number, lo: number, hi: number, bays: Bay[], base = false) {
  const { f, s } = wf(dir, c, lo, hi)
  for (const [u, k] of bays) {
    for (const [z0, zs] of ROWS) win1(f, s(u), z0, zs, k === 'p')
    if (base) win1(f, s(u), BASEROW[0], BASEROW[1], k === 'p')
  }
}
/** Walls of a block: brick to the eaves, the limestone basement, string courses and the corbelled cornice. */
function walls(ring: XY[]) {
  prism(brick, ring, 0, EAVE, brick, 0.05)
  prism(stone, offset(ring, 0.07), 0, WT, stone, 0.1)
  for (let i = 0; i < ring.length; i++) {
    const f = face(ring[i], ring[(i + 1) % ring.length])
    for (const z of BANDS) shape(stone, f, [[0, z], [f.L, z], [f.L, z + 0.24], [0, z + 0.24]], 0.03)
  }
  prism(brick, offset(ring, 0.3), EAVE - 0.6, EAVE + 0.05, brick, 0.15)
}
/** A mansard: steep slate slopes from the eaves to a flat (metal) top. */
function mansard(x0: number, y0: number, x1: number, y1: number) {
  const a = rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), b = rect(x0 + MIN, y0 + MIN, x1 - MIN, y1 - MIN)
  taper(slate, a, b, EAVE + 0.05, MTOP, flat)
}
/** A steep hipped pavilion roof, from the eaves to a small flat top. */
function hip(x0: number, y0: number, x1: number, y1: number, zt: number, inset: number) {
  const a = rect(x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35)
  const i = Math.min(inset + 0.35, (Math.min(x1 - x0, y1 - y0) + 0.7) / 2 - 0.1)
  taper(slate, a, rect(x0 - 0.35 + i, y0 - 0.35 + i, x1 + 0.35 - i, y1 + 0.35 - i), EAVE + 0.05, zt, slate)
}
/**
 * A wall gable on a face (flush with it), `w` wide, from the eaves to `peak`,
 * its slate roof running `depth` back into the roof behind; a paired
 * window in it.
 */
function gable(dir: Side, c: number, u: number, w: number, peak: number, depth = 3.2) {
  const prof: XY[] = [[u - w / 2, EAVE - 0.6], [u + w / 2, EAVE - 0.6], [u + w / 2, EAVE], [u, peak], [u - w / 2, EAVE]]
  const sgn = dir === 'N' || dir === 'E' ? 1 : -1
  const near = c + sgn * 0.12, far = c - sgn * depth
  if (dir === 'N' || dir === 'S') prismV(brick, prof, [1, 0], [0, 0], Math.min(near, far), Math.max(near, far), slate)
  else prismV(brick, prof, [0, 1], [0, 0], Math.min(-near, -far), Math.max(-near, -far), slate)
  // stone coping on the rakes
  const { f, s } = wf(dir, c + sgn * 0.12, u - w / 2, u + w / 2)
  const sc = s(u), hw = w / 2, k = (peak - EAVE) / hw
  for (const sx of [-1, 1]) {
    const p = [[sc + sx * (hw + 0.25), EAVE - 0.1], [sc + sx * (hw - 0.2), EAVE - 0.1], [sc, peak - 0.2 * k], [sc, peak + 0.3]] as XY[]
    shape(stone, f, p, 0.04)
  }
  win1(f, sc, EAVE + 1.0, EAVE + 3.0, w > 4)
}
/** A gabled brick dormer standing on the mansard behind face `dir`, at world coordinate u along it. */
function dormer(dir: Side, c: number, lo: number, hi: number, u: number) {
  const { f, s } = wf(dir, c, lo, hi)
  const sc = s(u), hw = 0.95, z0 = EAVE - 0.1, z1 = EAVE + 2.5, zp = EAVE + 3.7, o0 = -0.35, o1 = -2.7
  const P = (a: number, z: number, o: number) => f.P(sc + a, z, o)
  const n: V3 = [f.n[0], f.n[1], 0], t: V3 = [f.t[0], f.t[1], 0]
  quadH(brick, P(-hw, z0, o0), P(hw, z0, o0), P(hw, z1, o0), P(-hw, z1, o0), n)
  triH(brick, P(-hw - 0.12, z1, o0 + 0.1), P(hw + 0.12, z1, o0 + 0.1), P(0, zp, o0 + 0.1), n)
  quadH(brick, P(-hw, z0, o0), P(-hw, z0, o1), P(-hw, z1, o1), P(-hw, z1, o0), [-t[0], -t[1], 0])
  quadH(brick, P(hw, z0, o0), P(hw, z0, o1), P(hw, z1, o1), P(hw, z1, o0), t)
  for (const sx of [-1, 1]) {
    quadH(slate, P(sx * (hw + 0.12), z1, o0 + 0.1), P(0, zp, o0 + 0.1), P(0, zp, o1), P(sx * (hw + 0.12), z1, o1), [sx * t[0] * 0.6, sx * t[1] * 0.6, 0.8])
  }
  shape(stone, f, [[sc - 0.62, z0 + 0.25], [sc + 0.62, z0 + 0.25], [sc + 0.62, z1 - 0.1], [sc - 0.62, z1 - 0.1]], o0 + 0.04)
  shape(win, f, [[sc - 0.45, z0 + 0.4], [sc + 0.45, z0 + 0.4], [sc + 0.45, z1 - 0.25], [sc - 0.45, z1 - 0.25]], o0 + 0.08)
}
/** A tall brick chimney with a pale band and a stone cap. */
function chimney(x: number, y: number, hx: number, hy: number, z0: number, z1: number) {
  prism(brick, rect(x - hx, y - hy, x + hx, y + hy), z0, z1 - 0.5, brick, 0.04)
  block(stone, x - hx - 0.03, x + hx + 0.03, y - hy - 0.03, y + hy + 0.03, z1 - 2.6, z1 - 2.2)
  prism(stone, rect(x - hx - 0.15, y - hy - 0.15, x + hx + 0.15, y + hy + 0.15), z1 - 0.5, z1, stone, 0.08)
}
/**
 * The corner tower over the south-east pavilion: a steep slate pyramid
 * rising from the pavilion's eaves into a pale octagonal base with a
 * zigzag band, the open belfry (eight posts round a dark core), a ring of
 * gablets and the tall octagonal slate spire.
 */
function tower(cx: number, cy: number, pav: [number, number, number, number]) {
  const oct = (r: number) => chamfered(cx, cy, r, r, r * 0.586)
  const [x0, y0, x1, y1] = pav
  const sq = chamfered((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.35, (y1 - y0) / 2 + 0.35, 0.02)
  const T0 = 23.3, T1 = 25.8, B1 = 29.3, G0 = 29.9, GP = 31.4, TIP = 38.9, FIN = 39.9
  taper(slate, sq, oct(2.5), EAVE + 0.05, T0, null)
  // octagonal base: painted dark like the spire today (pale in the 1970s HABS views)
  taper(slate, oct(2.5), oct(2.5), T0, T1 - 0.35, null)
  taper(stone, oct(2.75), oct(2.75), T1 - 0.35, T1, stone)
  // belfry: low parapet, posts, dark core, entablature
  taper(stone, oct(2.3), oct(2.3), T1, T1 + 0.75, null)
  taper(slate, oct(1.45), oct(1.45), T1, B1, null)
  for (const [x, y] of oct(2.15)) block(stone, x - 0.2, x + 0.2, y - 0.2, y + 0.2, T1, B1)
  taper(stone, oct(2.45), oct(2.45), B1, G0, stone)
  // gablets, one on each face of the octagon
  const ring = oct(2.35)
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    prismV(stone, [[0.05, G0 - 0.05], [L - 0.05, G0 - 0.05], [L / 2, GP]], t, a, -0.12, 0.9, slate)
  }
  // the spire and its finial
  taper(slate, oct(2.15), oct(0.1), G0 - 0.05, TIP, null)
  taper(stone, oct(0.26), oct(0.05), TIP - 0.6, FIN, null)
  return FIN
}

function build() {
  // ── Plan (model frame: +y out of the south front, bearing 151.6; +x toward the west end) ──
  const FRONT = rect(-13.6, 1.5, 23.2, 17.0) // front (south) wing
  const REAR = rect(-13.6, -26.4, -0.2, 1.5) // long east wing, running north
  const projections = [
    rect(-15.3, 7.6, -13.6, 16.0), // the corner pavilion's east bay
    rect(23.2, 6.7, 24.9, 15.2), // west end bay
    rect(-15.3, -26.5, -13.6, -17.8), // north pavilion, east bay
    rect(-0.2, -26.2, 1.3, -18.0), // north pavilion, west bay
    rect(-13.5, -28.1, -4.7, -26.4), // north end bay
  ]
  for (const r of [FRONT, REAR, ...projections]) walls(r)

  // ── Roofs: mansards on the wings, steep hips on the end pavilions, the tower on the corner ──
  mansard(-7.5, 1.5, 18.0, 17.0)
  mansard(-13.6, -20.0, -0.2, 9.0)
  hip(16.0, 1.5, 23.2, 17.0, 23.4, 3.0)
  hip(-15.3, -26.4, 1.3, -17.8, 23.4, 3.0)
  const PEAK = 23.7
  gable('N', 17.0, -10.4, 5.0, PEAK) // corner pavilion, south
  gable('W', -15.3, 12.0, 5.0, PEAK) // corner pavilion, east
  gable('N', 17.0, 19.6, 5.0, PEAK) // west pavilion, south
  gable('E', 24.9, 10.95, 5.6, PEAK) // west end
  gable('N', 17.0, 5.0, 3.6, 22.0, 2.6) // centre, over the porch
  gable('S', -28.1, -9.1, 5.6, PEAK) // north end
  gable('W', -15.3, -22.1, 5.0, PEAK) // north pavilion, east
  gable('E', 1.3, -22.1, 5.0, PEAK) // north pavilion, west
  const top = tower(-10.4, 12.3, [-15.3, 7.6, -5.5, 17.0])

  // ── Windows ──
  const S: 's' = 's', Pr: 'p' = 'p'
  // south front: corner pavilion, seven bays with the paired centre, west pavilion
  facade('N', 17.0, -15.3, 24.9, [[-13.0, S], [-7.8, S], [-4.0, S], [-1.0, S], [2.0, S], [8.0, S], [11.0, S], [14.0, S], [16.9, S], [19.6, Pr], [22.3, S]])
  {
    const { f, s } = wf('N', 17.0, -15.3, 24.9)
    for (const [z0, zs] of ROWS.slice(1)) win1(f, s(5.0), z0, zs, true)
    win1(f, s(-10.4), ROWS[0][0], ROWS[0][1], true)
    win1(f, s(-10.4), ROWS[1][0], ROWS[1][1], true)
    win1(f, s(-10.4), ROWS[2][0], ROWS[2][1], true)
  }
  // west end
  facade('E', 24.9, 6.7, 15.2, [[8.6, S], [10.95, Pr], [13.3, S]])
  facade('E', 23.2, 1.5, 6.7, [[4.1, S]])
  // back of the front wing, facing the courtyard
  facade('S', 1.5, -0.2, 23.2, [[2.2, S], [5.3, S], [8.4, S], [11.5, S], [14.6, S], [17.7, S], [20.8, S]], true)
  // long east front of the rear wing, the corner and north pavilions
  facade('W', -13.6, -17.8, 7.6, [[-15.6, S], [-12.4, S], [-9.2, S], [-6.0, S], [-2.8, S], [0.4, S], [3.6, S]], true)
  facade('W', -15.3, 7.6, 16.0, [[9.4, S], [12.0, Pr], [14.6, S]])
  facade('W', -15.3, -26.5, -17.8, [[-24.6, S], [-22.1, Pr], [-19.6, S]], true)
  // west side of the rear wing and its pavilion
  facade('E', -0.2, -18.0, 1.5, [[-15.6, S], [-12.2, S], [-8.8, S], [-5.4, S], [-2.0, S]], true)
  facade('E', 1.3, -26.2, -18.0, [[-24.4, S], [-22.1, Pr], [-19.8, S]], true)
  // north end
  facade('S', -28.1, -13.5, -4.7, [[-11.6, S], [-9.1, Pr], [-6.6, S]], true)
  facade('S', -26.4, -4.7, 1.3, [[-1.7, S]], true)

  // ── Dormers on the mansards ──
  for (const u of [-4.0, 2.0, 8.0, 14.0]) dormer('N', 17.0, -15.3, 24.9, u)
  for (const u of [3.8, 10.0, 16.2]) dormer('S', 1.5, -0.2, 23.2, u)
  for (const u of [-14.0, -7.6, -1.2]) dormer('W', -13.6, -17.8, 7.6, u)
  for (const u of [-14.0, -7.0, -0.4]) dormer('E', -0.2, -18.0, 1.5, u)

  // ── Chimneys (banded brick, stone caps) ──
  chimney(-2.5, 16.5, 0.65, 0.5, EAVE - 1.5, 24.2)
  chimney(12.5, 16.5, 0.65, 0.5, EAVE - 1.5, 24.2)
  chimney(-13.1, -4.4, 0.5, 0.65, EAVE - 1.5, 24.2)
  chimney(-13.1, -10.8, 0.5, 0.65, EAVE - 1.5, 24.2)
  chimney(-0.7, -10.5, 0.5, 0.65, EAVE - 1.5, 24.2)
  chimney(2.2, 2.0, 0.65, 0.5, EAVE - 1.5, 24.2)

  // ── South porch: columns carrying a balcony, steps up to the door ──
  {
    const PX0 = 2.4, PX1 = 7.6, PY = 20.0, FL = 4.3
    prism(stone, rect(PX0, 17.0, PX1, PY), 0, FL, stone, 0.08)
    for (const x of [2.8, 3.6, 6.4, 7.2]) prism(stone, chamfered(x, PY - 0.35, 0.22, 0.22, 0.08), FL, 8.0, stone, 0.02)
    prism(stone, rect(PX0 - 0.15, 17.0, PX1 + 0.15, PY + 0.15), 8.0, 8.75, stone, 0.1)
    for (let i = 0; i < 3; i++) block(stone, 3.4, 6.6, PY, PY + 0.8 * (i + 1), 0, FL - 0.35 * (i + 1) - 0.1)
    const { f, s } = wf('N', 17.0, -15.3, 24.9)
    shape(door, f, [[s(5.0) - 0.85, FL], [s(5.0) + 0.85, FL], [s(5.0) + 0.85, 6.9], [s(5.0) - 0.85, 6.9]], 0.09)
    shape(win, f, seg(s(5.0), 1.7, 6.95, 7.3, 0.5), 0.09)
  }

  // ── West porch at the north end of the west face: stone, round-arched openings ──
  {
    prism(stone, rect(23.2, 2.1, 25.9, 6.1), 0, 6.4, stone, 0.12)
    const { f, s } = wf('E', 25.9, 2.1, 6.1)
    shape(win, f, seg(s(4.1), 1.5, 2.3, 4.6, 0.75, 4), 0.05)
    const g = wf('N', 6.1, 23.2, 25.9)
    shape(win, g.f, seg(g.s(24.55), 1.2, 2.3, 4.4, 0.6, 4), 0.05)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[2] > 23 ? 0.85 : 0)
  return {
    top,
    parts: [
      { part: brick, material: finish('jubilee-brick', 0xb86a4e) },
      { part: stone, material: { ...finish('jubilee-limestone', 0xe6ddcb), floodlight: flood } },
      { part: slate, material: finish('jubilee-slate', 0x6c6762) },
      { part: flat, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: door, material: { ...PALETTE.entrance, color: 0x7a5a44 } },
    ],
  }
}

if (import.meta.main) {
  const { top, parts } = build()
  await save('nash-fisk-jubilee-hall', 'Jubilee Hall', parts, { height: top, anchor: [36.168996, -86.804997], bearing: 151.6 }, 6500)
}
