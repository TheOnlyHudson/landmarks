/**
 * Old City Hall, 1001 East Broad Street, Richmond, Virginia (1887–1894,
 * Elijah E. Myers; High Victorian Gothic in grey Virginia granite) —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-old-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 126.17: the long sides of OSM way/113023444 run at
 * 126.2°, so +y runs along Broad Street to the east-south-east (toward 11th
 * Street) and +x runs to the south-south-west; the Broad Street front is
 * the -x face, Capitol Street the +x face, 10th Street -y, 11th Street +y.
 * Anchor = the outline's centroid, -77.4328036, 37.5397081.
 *
 * Identity (from the photos below):
 *  1. The clock tower at the Broad and 10th Street corner: a tall square
 *     granite shaft with stacked arcades, a balcony, paired belfry arches,
 *     corner pinnacles, a gabled clock on each face and a steep slate
 *     pyramid spire with a copper finial.
 *  2. The other corners: a steep slate pyramid-roofed pavilion at Broad and
 *     11th, another at Capitol and 10th, a round turret with a green conical
 *     cap at Capitol and 11th.
 *  3. Pale grey rock-faced granite walls of four storeys with round- and
 *     pointed-arched windows grouped in pairs and threes, steep stone wall
 *     gables rising through the eaves, steep slate roofs, the arched portal
 *     with its gable and steps on Broad Street.
 *
 * Plan: OSM way/113023444 (height=29), x -21.5..21.5, y -27.7..27.7; tower
 * part way/366062335 (height 50) x -21.5..-14.2, y -27.5..-18.9; the
 * Broad/11th pavilion part way/366224820 (height 35) x -21.5..-15.0,
 * y 20.5..27.7.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame (max per 3 m cell). y = 0 is the lowest
 * ground, at the 11th Street side; Broad Street at the tower is 2.4 up.
 * Measured above y = 0: the eaves about 26.5 (cells 26–29 along the
 * walls), the roof's centre 30–35.7 (drawn as a flat top at 30.8 with the
 * court skylight to 33.6, lower than the 35.7 lidar peak so the stone
 * gables keep the skyline, as in the photos), the wall gables 31–34,
 * the tower's pinnacle level 46.5, the spire 56.0 (lidar max, so the
 * finial tip may be a little higher), the Broad/11th pavilion 41.7, the
 * Capitol Street corners 34–35.5.
 * Estimated from the photos: storey heights and window rhythm (four
 * storeys, about 4.3 m bays), the tower's stages, the clock gables, the
 * gable count on each face, the portal.
 *
 * Ground: Mapterhorn and lidar fall ~2.4 m from Broad and 10th to Capitol
 * and 11th; elevation 0.
 *
 * Night: the granite and the tower are floodlit; windows glow.
 *
 * Photos (all EVIDENCE, Wikimedia Commons):
 *  - Old City Hall, Richmond 01–06.jpg, Smash the Iron Cage, CC BY-SA 4.0:
 *    02 and 03 from Broad and 10th (the tower and both street fronts),
 *    04 the Capitol Street side with the round turret and pyramid pavilion,
 *    05 the turret's cone, 06 the Broad Street portal, 01 from up Broad St.
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_02.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_03.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_04.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_05.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_06.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Richmond_01.jpg
 *  - USGS NAIP orthoimagery (public domain): roof plan.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the roof between the gables is drawn as a steep slate mansard
 * round a flat top with the court's glass skylight ridge, from the lidar;
 * the real roof is a busier set of slopes. Which corner carries the round
 * turret and which the pyramid pavilion on the Capitol Street side is read
 * from photo 04 alone. The window rhythm is regularised; the real openings
 * vary bay to bay. Dormers in the slate are left out.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, hipRoof, onWall, pyramid, rectShape, revolve, type XY } from './atl-tech-tower'
import { at, box, capPoly, ccw, offset, save, wall } from './atl-flatiron-building'

const granite = new Part(), slate = new Part(), win = new Part(), cu = new Part(), glass = new Part()

/** A convex planar polygon, wound to face `out`. */
function fc(p: Part, pts: V3[], out: V3) {
  const u = sub(pts[1], pts[0]), v = sub(pts[2], pts[0]), g = cross(u, v)
  const q = g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** Wound to face away from `inside`. */
const away = (p: Part, pts: V3[], inside: V3) => {
  const c = pts.reduce((a, b) => [a[0] + b[0] / pts.length, a[1] + b[1] / pts.length, a[2] + b[2] / pts.length] as V3, [0, 0, 0] as V3)
  fc(p, pts, sub(c, inside))
}

const X0 = -21.5, X1 = 21.5, Y0 = -27.7, Y1 = 27.7, EAVE = 26.5
type F = [XY, XY]
/** Ground above y = 0 at a plan point, from the lidar: high at Broad/10th, low at Capitol/11th. */
const gnd = (x: number, y: number) => Math.max(0, 1.2 - 0.022 * x - 0.022 * y)

// ── Main block ──
const R: XY[] = ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]])
wall(granite, R, 0, EAVE)
// a heavy cornice and a belt over the ground storey
for (const [z, h, o] of [[EAVE - 0.6, 0.8, 0.45], [6.6, 0.45, 0.2]] as [number, number, number][]) {
  const Ro = offset(R, o)
  wall(granite, Ro, z, z + h)
  granite.loft([at(R, z), at(Ro, z)])
  granite.loft([at(Ro, z + h), at(R, z + h)])
}
// mansard slate round a flat top, the court's skylight ridge on it
const TOP = 30.8
const inner = offset(R, -5.5)
slate.loft([at(offset(R, 0.2), EAVE + 0.2), at(inner, TOP)])
capPoly(slate, inner, TOP, true)
{
  const x0 = -3.2, x1 = 3.2, y0 = -12, y1 = 12, z0 = TOP, z1 = 33.6
  const I: V3 = [0, 0, z0 + 0.5]
  away(glass, [[x0, y0, z0], [x0, y1, z0], [0, y1, z1], [0, y0, z1]], I)
  away(glass, [[x1, y1, z0], [x1, y0, z0], [0, y0, z1], [0, y1, z1]], I)
  away(glass, [[x1, y0, z0], [x0, y0, z0], [0, y0, z1]], I)
  away(glass, [[x0, y1, z0], [x1, y1, z0], [0, y1, z1]], I)
}

// ── Faces (a→b with the outside on the right) ──
const BROAD: F = [[X0, Y1], [X0, Y0]] // -x, runs from 11th to 10th
const CAPITOL: F = [[X1, Y0], [X1, Y1]]
const TENTH: F = [[X0, Y0], [X1, Y0]]
const ELEVENTH: F = [[X1, Y1], [X0, Y1]]

/** A steep stone wall gable standing on a face through the eaves, with a window group in it. */
function gable(f: F, s: number, w: number, apex: number, depth = 1.6) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  const t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  const P = (ds: number, d: number, z: number): V3 => [f[0][0] + t[0] * (s + ds) + n[0] * d, f[0][1] + t[1] * (s + ds) + n[1] * d, z]
  const h = w / 2, o = 0.35, back = -depth
  // the gable as a thick triangular prism standing proud of the wall by `o`
  const z0 = EAVE - 1.2
  const fr = [P(-h, o, z0), P(h, o, z0), P(h, o, EAVE), P(0, o, apex), P(-h, o, EAVE)]
  const I = P(0, (o + back) / 2, (z0 + EAVE) / 2)
  away(granite, fr, I)
  const bk = [P(-h, back, z0), P(h, back, z0), P(h, back, EAVE), P(0, back, apex), P(-h, back, EAVE)]
  for (let i = 0; i < 5; i++) {
    const j = (i + 1) % 5
    away(granite, [fr[j], fr[i], bk[i], bk[j]], I)
  }
  // slate roof behind it, running into the mansard
  const r = 0.25
  // the gable's own roof dies back into the mansard at its top
  const zb = TOP + 0.3, db = back - 5.0
  away(slate, [P(-h - r, back - 0.1, EAVE - 0.2), P(0, back - 0.1, apex - 0.3), P(0, db, zb), P(-h - r, db, EAVE - 0.2)], P(0, back - 2, EAVE - 3))
  away(slate, [P(h + r, db, EAVE - 0.2), P(0, db, zb), P(0, back - 0.1, apex - 0.3), P(h + r, back - 0.1, EAVE - 0.2)], P(0, back - 2, EAVE - 3))
  // pinnacle at the apex
  revolve(granite, [P(0, o * 0.5, 0)[0], P(0, o * 0.5, 0)[1]], [[0.3, apex - 0.4], [0.3, apex + 0.3], [0, apex + 1.4]], 4, Math.PI / 4, true, false)
  // a pair of tall arched windows in the gable
  for (const d of [-0.75, 0.75]) onWall(win, f[0], f[1], archShape(s + d, 0.95, EAVE - 0.6, EAVE + 1.6, 8), o + 0.06)
  void L
}

/** Grouped arched windows in bays along a face, four storeys, skipping covered spans. */
function bays(f: F, from: number, to: number, n: number) {
  const w = (to - from) / n
  for (let k = 0; k < n; k++) {
    const s = from + (k + 0.5) * w
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), u = s / L
    const g = gnd(f[0][0] + (f[1][0] - f[0][0]) * u, f[0][1] + (f[1][1] - f[0][1]) * u)
    // ground storey: one broad round-headed window
    onWall(win, f[0], f[1], archShape(s, 1.7, g + 1.6, g + 4.6, 8), 0.06)
    // second storey: a pair; third: a pair, taller; fourth: three small arches
    for (const d of [-0.6, 0.6]) onWall(win, f[0], f[1], archShape(s + d, 0.85, 8.4, 11.4, 6), 0.06)
    for (const d of [-0.6, 0.6]) onWall(win, f[0], f[1], archShape(s + d, 0.85, 13.6, 16.9, 6), 0.06)
    for (const d of [-0.85, 0, 0.85]) onWall(win, f[0], f[1], archShape(s + d, 0.62, 19.2, 22.0, 6), 0.06)
  }
}
// Broad Street: tower at s 0..8.7 from 10th end; pavilion at 11th end
const L_BROAD = Y1 - Y0
bays(BROAD, 7.6, L_BROAD - 9.8, 9)
bays(CAPITOL, 7.0, L_BROAD - 7.0, 9)
bays(TENTH, 7.6, (X1 - X0) - 7.0, 6)
bays(ELEVENTH, 7.0, (X1 - X0) - 7.6, 6)
// wall gables
for (const s of [L_BROAD - 17.2, L_BROAD / 2 + 0.5]) gable(BROAD, s, 6.0, 34.5)
gable(BROAD, 15.3, 5.2, 33.4)
for (const s of [L_BROAD / 2 - 9.5, L_BROAD / 2 + 9.5]) gable(CAPITOL, s, 5.2, 33.2)
gable(CAPITOL, L_BROAD / 2, 6.2, 34.6)
for (const s of [17.5, 26.5]) { gable(TENTH, s, 5.4, 33.6); gable(ELEVENTH, s, 5.4, 33.6) }

// ── The Broad Street portal ──
{
  const f = BROAD, s = L_BROAD / 2 + 0.5, g = gnd(X0, 0.5)
  box(granite, X0 - 2.6, X0, -2.4 + 0.5, 2.4 + 0.5, 0, g + 6.4, null, 0.2)
  // gabled top of the porch
  const P = (y: number, z: number, x: number): V3 => [x, y + 0.5, z]
  for (const x of [X0 - 2.6]) {
    fc(granite, [P(2.4, g + 6.4, x), P(-2.4, g + 6.4, x), P(0, g + 9.4, x)], [-1, 0, 0])
  }
  away(slate, [P(-2.6, g + 6.3, X0 - 2.75), P(-2.6, g + 6.3, X0), P(0, g + 9.5, X0), P(0, g + 9.5, X0 - 2.75)], P(0, g + 5, X0 - 1.3))
  away(slate, [P(0, g + 9.5, X0 - 2.75), P(0, g + 9.5, X0), P(2.6, g + 6.3, X0), P(2.6, g + 6.3, X0 - 2.75)], P(0, g + 5, X0 - 1.3))
  const pf: F = [[X0 - 2.6, 2.9], [X0 - 2.6, -1.9]]
  onWall(win, pf[0], pf[1], archShape(2.4, 2.8, g + 1.2, g + 4.0, 10), 0.05)
  for (let k = 0; k < 4; k++) box(granite, X0 - 2.6 - 0.45 * (k + 1), X0 - 2.6, -2.8 + 0.5 - k * 0.25, 2.8 + 0.5 + k * 0.25, 0, g + 1.2 - k * 0.3, granite, 0)
  void f; void s
}

// ── Corner pavilions ──
// Broad and 11th: a square pavilion with a tall slate pyramid
box(granite, X0 - 0.3, -15.0, 20.5, Y1 + 0.3, EAVE - 1, 29.5, null, 0.2)
pyramid(slate, [(X0 - 0.3 - 15.0) / 2, (20.5 + Y1 + 0.3) / 2], 3.75, 29.4, 41.4)
revolve(cu, [(X0 - 0.3 - 15.0) / 2, (20.5 + Y1 + 0.3) / 2], [[0.2, 41.0], [0.1, 42.6], [0, 43.0]], 6, 0, true, false)
// Capitol and 10th: a lower pyramid pavilion
box(granite, 15.0, X1 + 0.3, Y0 - 0.3, -21.0, EAVE - 1, 28.5, null, 0.2)
pyramid(slate, [(15.0 + X1 + 0.3) / 2, (Y0 - 0.3 - 21.0) / 2], 3.5, 28.4, 35.4)
revolve(cu, [(15.0 + X1 + 0.3) / 2, (Y0 - 0.3 - 21.0) / 2], [[0.18, 35.0], [0.08, 36.4], [0, 36.7]], 6, 0, true, false)
// Capitol and 11th: a round corbelled turret with a green cone
{
  const c: XY = [X1 - 2.4, Y1 - 2.4]
  revolve(granite, c, [[1.6, 12.0], [2.9, 15.0], [2.9, 29.0], [3.15, 29.0], [3.15, 29.6]], 14, 0, false, true)
  revolve(cu, c, [[3.3, 29.5], [2.2, 32.0], [0.9, 34.2], [0, 35.3]], 14, 0, false, true)
  revolve(cu, c, [[0.12, 35.1], [0.05, 36.3], [0, 36.5]], 6, 0, true, false)
  for (let i = 0; i < 4; i++) {
    const a = Math.PI * 0.25 + (i - 1.5) * 0.55 - Math.PI * 0.75 + Math.PI
    const p: XY = [c[0] + Math.cos(a) * 2.95, c[1] + Math.sin(a) * 2.95], tt: XY = [-Math.sin(a), Math.cos(a)]
    const a2: XY = [p[0] - tt[0] * 0.5, p[1] - tt[1] * 0.5], b2: XY = [p[0] + tt[0] * 0.5, p[1] + tt[1] * 0.5]
    for (const z of [17.0, 22.5]) onWall(win, a2, b2, archShape(0.5, 0.8, z, z + 2.6, 6), 0.03)
  }
}

// ── Clock tower ──
{
  const tx0 = X0 - 0.4, tx1 = -14.0, ty0 = Y0 - 0.4, ty1 = -19.0
  const cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2, hx = (tx1 - tx0) / 2, hy = (ty1 - ty0) / 2
  const SH = 43.0
  box(granite, tx0, tx1, ty0, ty1, 0, SH, null, 0)
  // corner buttresses ending in pinnacles
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const px = cx + sx * (hx - 0.1), py = cy + sy * (hy - 0.1)
    box(granite, px - 0.7, px + 0.7, py - 0.7, py + 0.7, 0, SH + 0.6, null, 0.15)
    revolve(granite, [px, py], [[0.6, SH + 0.6], [0.6, SH + 1.4], [0.45, SH + 1.6], [0, SH + 4.0]], 4, Math.PI / 4, true, false)
  }
  // string courses and the balcony
  for (const [z, o] of [[26.0, 0.25], [31.6, 0.55], [36.0, 0.25], [SH - 0.5, 0.35]] as [number, number][]) box(granite, tx0 - o, tx1 + o, ty0 - o, ty1 + o, z, z + 0.55, granite, 0.15)
  const faces: F[] = [
    [[tx0, ty1], [tx0, ty0]], [[tx0, ty0], [tx1, ty0]], [[tx1, ty0], [tx1, ty1]], [[tx1, ty1], [tx0, ty1]],
  ]
  for (const f of faces) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    for (const d of [-1.1, 0, 1.1]) onWall(win, f[0], f[1], archShape(m + d, 0.8, 27.2, 30.0, 6), 0.06)
    for (const d of [-1.15, 0, 1.15]) onWall(win, f[0], f[1], archShape(m + d, 0.85, 32.6, 34.9, 6), 0.06)
    for (const d of [-1.0, 1.0]) onWall(win, f[0], f[1], archShape(m + d, 1.5, 37.0, 40.6, 8), 0.06)
    for (const z of [8.4, 13.6, 19.2]) for (const d of [-0.6, 0.6]) onWall(win, f[0], f[1], archShape(m + d, 0.8, z, z + 2.8, 6), 0.06)
  }
  // the steep slate spire, with a clock gable on each face
  const SP = 55.6
  pyramid(slate, [cx, cy], Math.min(hx, hy) - 0.9, SH, SP)
  revolve(cu, [cx, cy], [[0.35, SP - 0.6], [0.25, SP + 0.4], [0.08, SP + 1.4], [0, SP + 1.8]], 6, 0, true, false)
  const ring = (s: number, z: number, r: number, n = 14) => Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
  for (const f of faces) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    const t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
    const P = (ds: number, d: number, z: number): V3 => [f[0][0] + t[0] * (m + ds) + n[0] * d, f[0][1] + t[1] * (m + ds) + n[1] * d, z]
    const w = 2.0, zt = SH + 2.6, ap = SH + 5.6, dp = 0.2
    // gablet: front face, two roof slopes back into the spire
    const fr = [P(-w, dp, SH), P(w, dp, SH), P(w, dp, zt), P(0, dp, ap), P(-w, dp, zt)]
    const I = P(0, -1.5, SH + 1.5)
    away(granite, fr, I)
    for (const k of [-1, 1]) {
      away(granite, [P(k * w, dp, SH), P(k * w, dp, zt), P(k * w, -3.0, zt), P(k * w, -3.0, SH)], I)
      away(slate, [P(k * (w + 0.2), dp + 0.15, zt - 0.1), P(0, dp + 0.15, ap + 0.05), P(0, -3.0, ap + 0.05), P(k * (w + 0.2), -3.0, zt - 0.1)], I)
    }
    const cRing = ring(0, 0, 1.15).map(([a, b]) => [m + a, SH + 2.4 + b] as [number, number])
    const fRing = ring(0, 0, 0.95).map(([a, b]) => [m + a, SH + 2.4 + b] as [number, number])
    onWall(win, f[0], f[1], cRing, dp + 0.04)
    onWall(granite, f[0], f[1], fRing, dp + 0.08)
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] < 46 ? 0.7 : 0.4)
await save('ric-old-city-hall', 'Old City Hall', [
  { part: granite, material: { ...finish('och-granite', 0xd6d3cd), floodlight: lit } },
  { part: slate, material: finish('och-slate', 0x7d8689) },
  { part: win, material: PALETTE.window },
  { part: cu, material: PALETTE.patina },
  { part: glass, material: PALETTE.glass },
], { height: 57.4, anchor: [37.5397081, -77.4328036], bearing: 126.17 }, 6500)
