/**
 * Brown Palace Hotel, Denver (1892, Frank E. Edbrooke) — original
 * procedural geometry, CC0-1.0.
 * bun generators/den-brown-palace-hotel.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin on the ground
 * at the anchor, the area centroid of OSM way/458038539
 * (-104.9877848, 39.7441115).
 *
 * Identity, in order:
 *  1. the triangular "flatiron" plan between 17th Street (south-west),
 *     Tremont Place (north-west) and Broadway (east), with rounded corners
 *     and a narrow rounded prow at the west.        (pelster, westc, racem)
 *  2. one warm red sandstone (and red granite base) all over. (all photos)
 *  3. the facade's arcade: bays of windows stacked over floors 3–6 under a
 *     round arch at the 7th floor, then two plainer floors and a heavy
 *     cornice.                                          (westc, pelster)
 *  4. the rusticated two-storey base with a row of green awnings.
 *                                                (westc, racem, pelster)
 *
 * Plan: three straight lines through OSM's long edges (way/458038539),
 * meeting at a right angle at the west and 45° at the north and south;
 * the north and south corners rounded at 2.5 m radius (OSM's arcs are
 * 2.0–2.8 m), the west prow at 4.5 m so that it shows as a narrow rounded
 * face one bay wide, as in the pelster photo (OSM cuts it 2.8 m across).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py. ground_min 1593.29 m; the street round the
 * hotel is 0.8–1.3 m above it (Mapterhorn: 0.6 m of slope across the
 * site), y = 0 here 0.9 m above ground_min. Measured above y = 0: the
 * cornice top all round 34.9–35.0; the roof inside the parapet 33.6–34.1;
 * an inner roof 6–8 m in from the walls at 37.8; the atrium's skylight
 * peaking about 36.6 in a well inside that; a plant box to 44.9 north of
 * the atrium; flagpoles at the west and north corners (left out). OSM's
 * height=44 is too high: the lidar parapet is 35 m. Published: nine
 * storeys (OSM building:levels=9; Wikipedia "Brown Palace Hotel").
 *
 * Estimated from the photos (westc, pelster), scaled by the 35 m cornice:
 * base storeys 0–8.8, floors 3–7 3.9 m each (3–5 grouped, 6–7 under the
 * arches, springing at 26.4), the string course at 28.6, the top two floors 29–33.6, the cornice
 * 33.6–35 projecting 0.7; bays about 5.4 m. The awnings 3.0–4.2 m, 1.2 m
 * deep. Simplified: the skylight is drawn as a low glass pyramid on the
 * inner roof rather than down in its well; the roof's other plant is left
 * out, and so are the medallions between the arches and the entrance
 * porches' detail.
 *
 * Photos (Wikimedia Commons, evidence):
 *  westc    "Brown Palace Hotel, west corner.jpg", Xnatedawgx, CC BY-SA 3.0
 *           (the 17th Street face from the west)
 *  pelster  "Brown-Palace-Hotel Denver.jpg", Patrick Pelster,
 *           CC BY-SA 3.0 de (the west prow, both street faces)
 *  racem    "The Brown Palace Hotel.JPG", Racemanryan, CC BY-SA 3.0
 *           (the Tremont Place face from the north-west)
 *  highsmith "The historic Brown Palace Hotel in Denver, one of the first
 *           to employ an "atrium style" ... LCCN2017885320.tif", Carol M.
 *           Highsmith, public domain (the prow from the west)
 *  wilson06 "20250727 06 Brown Palace Hotel, Denver, Colorado.jpg", David
 *           Wilson, CC BY 4.0 (the atrium from an upper gallery)
 *  rural1   "Brown Palace Hotel and Spa 01.jpg", RuralResurrection, CC BY 4.0
 *           (the lobby)
 * NAIP (USGS, public domain) for the roof: pale grey with plant.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the Broadway face is not in any photo used; drawn like the
 * other two. The bay count per face is from the 5.4 m rhythm, not counted
 * bay by bay.
 *
 * Night: the windows glow (window); the stone is lightly floodlit at the
 * base, where the awnings' lamps are.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { capPoly, ledge, offset, split, wall } from './atl-flatiron-building'

const stone = new Part(), win = new Part(), roof = new Part(), awning = new Part(), glass = new Part()

// ── Plan: three lines and filleted corners ──
type Line = [XY, XY]
const SW: Line = [[-31.35, -1.15], [12.01, -44.7]]
const E: Line = [[15.66, -43.88], [17.15, 41.85]]
const NW: Line = [[12.39, 43.62], [-31.05, 1.66]]
function meet(a: Line, b: Line): XY {
  const [p, q] = a, [r, s] = b
  const d1: XY = [q[0] - p[0], q[1] - p[1]], d2: XY = [s[0] - r[0], s[1] - r[1]]
  const den = d1[0] * d2[1] - d1[1] * d2[0]
  const t = ((r[0] - p[0]) * d2[1] - (r[1] - p[1]) * d2[0]) / den
  return [p[0] + d1[0] * t, p[1] + d1[1] * t]
}
const unit = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
/** Arc points rounding corner C (from incoming dir u to outgoing v) at radius r, CCW ring. */
function fillet(C: XY, u: XY, v: XY, r: number, n: number): XY[] {
  const th = Math.acos(-(u[0] * v[0] + u[1] * v[1])) // interior angle
  const t = r / Math.tan(th / 2)
  const T1: XY = [C[0] - u[0] * t, C[1] - u[1] * t]
  const c: XY = [T1[0] - u[1] * r, T1[1] + u[0] * r]
  const a0 = Math.atan2(T1[1] - c[1], T1[0] - c[0]), turn = Math.PI - th
  return Array.from({ length: n + 1 }, (_, i) => [c[0] + r * Math.cos(a0 + (turn * i) / n), c[1] + r * Math.sin(a0 + (turn * i) / n)] as XY)
}
const W = meet(NW, SW), S = meet(SW, E), N = meet(E, NW)
const uSW = unit(W, S), uE = unit(S, N), uNW = unit(N, W)
const arcW = fillet(W, uNW, uSW, 4.5, 6), arcS = fillet(S, uSW, uE, 2.5, 5), arcN = fillet(N, uE, uNW, 2.5, 5)
const plan = ccw([...arcW, ...arcS, ...arcN])
// the three long faces, outside to the right
const faces: [XY, XY][] = [[arcW[arcW.length - 1], arcS[0]], [arcS[arcS.length - 1], arcN[0]], [arcN[arcN.length - 1], arcW[0]]]
const arcs = [arcW, arcS, arcN]

// ── Massing ──
const CORN = 33.6, TOP = 35.0
prism(stone, split(plan, 4.8), 0, CORN, null, 0)
cornice(stone, plan, CORN, TOP - CORN, 0.7, null)
const inner = offset(plan, -0.6)
ledge(stone, offset(plan, 0.45), inner, TOP)
wall(stone, [...inner].reverse(), 33.9, TOP)
capPoly(roof, inner, 33.9, true)
// band over the base, string course over the arches
for (const [z, h] of [[8.6, 0.6], [28.4, 0.5]] as const) {
  const o = offset(plan, 0.15)
  wall(stone, o, z, z + h)
  stone.loft([plan.map(([x, y]) => [x, y, z] as V3), o.map(([x, y]) => [x, y, z] as V3)])
  stone.loft([o.map(([x, y]) => [x, y, z + h] as V3), plan.map(([x, y]) => [x, y, z + h] as V3)])
}
// inner roof, 6.5 m in from the walls, and the atrium skylight on it
const core = offset(ccw([W, S, N]), -6.5)
prism(roof, core, 33.9, 37.8, roof, 0.3)
{
  const c: XY = [-3.4, -0.5], r = 8.9 // OSM way/587859917, a square at 45°
  const sq: XY[] = [[c[0], c[1] - r], [c[0] + r, c[1]], [c[0], c[1] + r], [c[0] - r, c[1]]]
  const apex: V3 = [c[0], c[1], 39.6]
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4]
    glass.tri([a[0], a[1], 37.85], [b[0], b[1], 37.85], apex)
  }
}
box(roof, -10, -4, 18, 24, 37.8, 44.9, roof, 0.3)

// ── Facades ──
const BAY = 5.4
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.round((L - 1) / BAY), w = (L - 1) / n
  const t = unit(a, b), nn: XY = [t[1], -t[0]]
  for (let k = 0; k < n; k++) {
    const m = 0.5 + (k + 0.5) * w, hw = (w - 1.5) / 2, gw = 1.5
    // base: shop window and mezzanine
    onWall(win, a, b, rectShape(m - hw, m + hw, 0.9, 3.0), 0.06)
    onWall(win, a, b, rectShape(m - gw, m + gw, 5.2, 7.6), 0.06)
    // floors 3–5 in one panel, floors 6–7 under the round arch: the
    // tripled windows take a little over half the bay
    onWall(win, a, b, rectShape(m - gw, m + gw, 10.0, 19.6), 0.06)
    onWall(win, a, b, archShape(m, 2 * gw, 20.8, 26.4, 10), 0.06)
    // floors 8–9: a narrower pair
    onWall(win, a, b, rectShape(m - 1.1, m + 1.1, 29.6, 32.8), 0.06)
    // the awning: a sloped slab out from the wall
    const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + nn[0] * d, a[1] + t[1] * s + nn[1] * d, z]
    const s0 = m - hw - 0.1, s1 = m + hw + 0.1
    awning.quad(P(s0, 0.02, 4.2), P(s0, 1.2, 3.3), P(s1, 1.2, 3.3), P(s1, 0.02, 4.2))
    awning.quad(P(s0, 1.2, 3.3), P(s0, 1.2, 2.9), P(s1, 1.2, 2.9), P(s1, 1.2, 3.3))
    awning.quad(P(s1, 0.02, 4.2), P(s1, 1.2, 3.3), P(s0, 1.2, 3.3), P(s0, 0.02, 4.2))
  }
}
// the rounded corners: a column of windows round the middle of each arc
for (const arc of arcs) {
  const k0 = arc.length > 6 ? 2 : 1, k1 = arc.length - 1 - k0
  for (let i = k0; i < k1; i++) {
    const a = arc[i], b = arc[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [z0, z1] of [[5.2, 7.6], [10.0, 19.6], [20.8, 27.4], [29.6, 32.8]]) onWall(win, a, b, rectShape(0, L, z0, z1), 0.06)
  }
}

await save('den-brown-palace-hotel', 'Brown Palace Hotel', [
  { part: stone, material: { ...finish('brown-palace-sandstone', 0xc4826a), floodlight: (p, n) => (n[2] < 0.5 ? (p[2] < 10 ? 0.6 : 0.15) : 0) } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('brown-palace-roof', 0xc4c6c6) },
  { part: awning, material: finish('brown-palace-awning', 0x4f7a5c) },
  { part: glass, material: PALETTE.glass },
], { height: 44.9, anchor: [39.7441115, -104.9877848], bearing: 0 })
