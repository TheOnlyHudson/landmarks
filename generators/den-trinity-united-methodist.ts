/**
 * Trinity United Methodist Church, Denver (1888, Robert S. Roeschlaub) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-trinity-united-methodist.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the church follows
 * Broadway's north–south grid). Origin on the ground at the anchor, the
 * area centroid of OSM way/52957908 (-104.9870051, 39.7451219). Broadway is
 * the west front (-x), East 18th Avenue the south side (-y).
 *
 * Identity, in order:
 *  1. the tall stone spire on the square tower at the south-west corner:
 *     corner buttresses, a belfry of paired lancets, four corner pinnacles,
 *     an octagonal spire with gabled lucarnes, a cross.  (c2, zirkel, nyttend)
 *  2. rough-faced rhyolite, pinkish grey, all over; dark slate roofs.
 *  3. steep cross gables: the Broadway gable with a great pointed window
 *     over an arcaded porch; rose windows in the south and north gables;
 *     a big hipped roof over the auditorium behind.  (c2, zirkel, north)
 *  4. small turrets with steep pointed roofs at the north-west and
 *     south-east.                                          (c2, nyttend)
 *
 * Plan: OSM way/52957908 (37.1 × 27.4 m with a 9.7 m wide bay out to the
 * north at the east end), used as drawn. Not Trinity Place (way/52957912)
 * to the east.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py. ground_min 1590.11 m is a pit; the ground on
 * Broadway is 3.7 m above it and 4.9 m on the east side (1.2 m of slope;
 * Mapterhorn agrees), so y = 0 here is ground_min + 3.7. Measured above
 * y = 0: spire top 51.1 (published 183 ft / 55.8 m to the cross's top,
 * Wikipedia "Trinity United Methodist Church (Denver, Colorado)"; the
 * lidar misses the cross and likely the very tip, so the stone tip is put
 * at 51.5 and the cross over it to 53.5); tower corners and pinnacles
 * 25–28.5; walls 14–16 at the eaves; the auditorium roof a low hip to
 * about 21 with a small pyramid peaking at 25.0 near the middle; the
 * gables' ridges: west 21, south 22.5, north bay 20, east 20.3; a low
 * south-east wing at 10.5–11; turret tops about 18.5 (north-west) and
 * 22.5 (south-east).
 *
 * Estimated from the photos (c2, zirkel), scaled to the lidar: eaves 14;
 * tower 7 m square, its top 25.5, the belfry lancets 18.5–24.2; the spire
 * an octagon of radius 3.3 at 25.5; lucarnes 2 m wide to 31; pinnacles
 * 1.2 m square to 29.5; the great west window 4.6 m wide, 8–17.5; the
 * rose windows 5.4 m across centred 14; the porch arcade four arches 2.4 m
 * wide to 5.4; turrets 4.4 m across. Left out: tracery other than the
 * window bars, the louvres, the rough-face texture, railings, gutters.
 *
 * Photos (Wikimedia Commons, evidence):
 *  c2      "Trinity United Methodist Church (Denver, Colorado) (2).JPG",
 *          Chris06, CC BY-SA 4.0 (from the south-west)
 *  zirkel  "Trinity United Methodist Church Denver.jpg", Kenneth C. Zirkel,
 *          CC BY-SA 4.0 (from the south-west, closer)
 *  nyttend "Trinity United Methodist Church, Denver.jpg", Nyttend, public
 *          domain (south front and tower)
 *  c1      "Trinity United Methodist Church (Denver, Colorado) (1).JPG",
 *          Chris06, CC BY-SA 4.0 (from the south-west, far)
 *  north   "Trinity United Methodist Church, northside.jpg", Xnatedawgx,
 *          CC BY-SA 3.0 (north side, rose window)
 *  c3      "Trinity United Methodist Church (Denver, Colorado) (3).JPG",
 *          Chris06, CC BY-SA 4.0 (from the south-east, far)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east side is seen only far off (c3): its gable is drawn from
 * the lidar ridge, plain. The turrets' exact spots are from the lidar's
 * high points and the photos, about a metre either way.
 *
 * Colour: the rhyolite reads a mottled pinkish brown-grey in every photo,
 * drawn as a muted rose-brown at the palette's lightness (warmer and darker
 * than Holy Ghost's tan); roofs dark slate.
 *
 * Night: the windows glow (window); the tower and spire are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, gableRoof, hipRoof, onWall, prism, pyramid, rectShape, save, type XY } from './atl-tech-tower'
import { split } from './atl-flatiron-building'

const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part()
const tower = stone

/** A pointed (equilateral) arch outline, width w centred at s, from z0, springing at zs. */
function lancet(s: number, w: number, z0: number, zs: number, seg = 5): [number, number][] {
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(a), zs + w * Math.sin(a)]) }
  for (let i = 1; i <= seg; i++) { const a = Math.PI * 2 / 3 + (i / seg) * (Math.PI / 3); pts.push([s + w / 2 + w * Math.cos(a), zs + w * Math.sin(a)]) }
  return pts
}
const disc = (s: number, z: number, r: number, n = 14): [number, number][] => Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)])
/** Tracery bars, flush on a window: vertical mullions at the given offsets. */
function bars(a: XY, b: XY, ss: number[], z0: number, z1: number, out = 0.1) {
  for (const s of ss) onWall(trim, a, b, rectShape(s - 0.09, s + 0.09, z0, z1), out)
}

// ── Plan (OSM way/52957908, in this frame) ──
// The outline, with the low south-east wing (about 11 m in the lidar) cut
// out of the main block and drawn on its own.
const plan = ccw([[-18.52, 13.54], [-18.51, -13.84], [12.5, -13.83], [12.5, -6.5], [18.63, -6.5], [18.62, 9.74], [14.24, 9.74], [14.25, 15.95], [4.57, 15.93], [4.58, 13.55], [0.42, 13.55]])
const X0 = -18.52, X1 = 18.63, Y0 = -13.83, Y1 = 13.55, EAVE = 14

prism(stone, split(plan, 4.8), 0, EAVE, roof, 0)
box(stone, 12.5, X1, Y0, -6.5, 0, 10.6, roof, 0.3)
// the auditorium roof: a low hip peaking near the middle, a small
// pyramidal lantern on top
hipRoof(roof, X0, 12.5, Y0, Y1, EAVE, 21.0, 0.4)
pyramid(roof, [-4, 0.8], 3.4, 20.0, 25.0, 4)
// steep cross gables, ridges running in from each face
gableRoof(roof, stone, X0, -4, -6, 7, EAVE, 21.2, 'x', 0.4, 0.3) // west (Broadway)
gableRoof(roof, stone, 3.5, 12.5, Y0, -3, EAVE, 22.5, 'y', 0.4, 0.3) // south
gableRoof(roof, stone, 4.58, 14.24, 3, 15.94, EAVE, 20.0, 'y', 0.4, 0.3) // north bay
gableRoof(roof, stone, 2, X1, -6.5, 8, EAVE, 20.3, 'x', 0.4, 0.3) // east

// ── Turrets: round-cornered squares with steep pyramids ──
for (const [c, top] of [[[-15.9, 11.0], 18.5], [[14.8, -8.8], 22.5]] as [XY, number][]) {
  box(stone, c[0] - 2.2, c[0] + 2.2, c[1] - 2.2, c[1] + 2.2, 0, top - 6.5, null, 0.2)
  pyramid(roof, c, 2.6, top - 6.5, top, 8, Math.PI / 8)
  for (const [a, b] of [[[c[0] - 2.2, c[1] - 2.2], [c[0] + 2.2, c[1] - 2.2]], [[c[0] + 2.2, c[1] - 2.2], [c[0] + 2.2, c[1] + 2.2]], [[c[0] + 2.2, c[1] + 2.2], [c[0] - 2.2, c[1] + 2.2]], [[c[0] - 2.2, c[1] + 2.2], [c[0] - 2.2, c[1] - 2.2]]] as [XY, XY][]) {
    onWall(win, a, b, lancet(2.2, 0.9, top - 10.5, top - 8.8), 0.06)
  }
}

// ── The west front: great window over an arcaded porch ──
{
  const a: XY = [X0, 6.5], b: XY = [X0, -5.5] // wall seen from the west, s along a→b (north to south)
  onWall(win, a, b, lancet(6, 4.6, 7.6, 14.0, 7), 0.06)
  bars(a, b, [4.85, 6, 7.15], 7.6, 16.6)
  onWall(trim, a, b, rectShape(3.7, 8.3, 11.2, 11.4), 0.1)
  // the porch: four pointed arches across the front, under a pale band
  const pa: XY = [X0, 9], pb: XY = [X0, -7]
  onWall(trim, pa, pb, rectShape(1.6, 14.4, 5.6, 6.4), 0.12)
  for (const s of [3.4, 6.4, 9.4, 12.4]) onWall(win, pa, pb, lancet(s, 2.4, 0, 3.4), 0.06)
  // lancets either side, two storeys
  for (const s of [-1.6, 13.6]) for (const z of [3, 8.5]) onWall(win, a, b, lancet(s, 1.2, z, z + 2.4), 0.06)
}
// ── South and north gables: rose windows over lancets ──
const roses: [XY, XY, number][] = [[[3.5, Y0], [12.5, Y0], 4.5], [[14.24, 15.94], [4.58, 15.94], 4.83]]
for (const [a, b, m] of roses) {
  onWall(trim, a, b, disc(m, 14.0, 3.0, 16), 0.04)
  onWall(win, a, b, disc(m, 14.0, 2.6, 16), 0.08)
  onWall(trim, a, b, rectShape(m - 0.1, m + 0.1, 11.5, 16.5), 0.12)
  onWall(trim, a, b, rectShape(m - 2.5, m + 2.5, 13.9, 14.1), 0.12)
  for (const d of [-3, -1, 1, 3]) onWall(win, a, b, lancet(m + d, 1.3, 3.5, 8.2), 0.06)
}
// ── Side walls: paired lancets, two storeys, in the plain stretches ──
const walls: [XY, XY, number[]][] = [
  [[-12.2, Y0], [2, Y0], [2.6, 6.2, 10.4]], // south, between tower and gable
  [[12.5, Y0], [18.63, Y0], [3.1]],
  [[18.63, -6.5], [18.63, 9.74], [4, 12.2]], // east
  [[0.42, 13.55], [-18.52, 13.54], [5, 9.5, 14]], // north, west part
  [[X0, 13.54], [X0, 9], [2.2]],
]
for (const [a, b, ss] of walls) for (const s of ss) for (const z of a[1] === Y0 && a[0] > 12 ? [2.8] : [2.8, 8.2]) {
  onWall(win, a, b, lancet(s - 0.75, 1.1, z, z + 2.6), 0.06)
  onWall(win, a, b, lancet(s + 0.75, 1.1, z, z + 2.6), 0.06)
}

// ── The tower and spire ──
const TX0 = -19.3, TX1 = -12.3, TY0 = -14.6, TY1 = -7.6, TT = 25.5
const tc: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
box(tower, TX0, TX1, TY0, TY1, 0, TT, tower, 0.3)
// corner buttresses, stepping in twice
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = sx < 0 ? TX0 : TX1, cy = sy < 0 ? TY0 : TY1
  for (const [d, z1] of [[0.6, 9], [0.35, 18]]) box(tower, cx - (sx < 0 ? d : 0.8), cx + (sx > 0 ? d : 0.8), cy - (sy < 0 ? d : 0.8), cy + (sy > 0 ? d : 0.8), 0, z1, tower, 0.25)
  // corner pinnacles
  const pc: XY = [cx - sx * 0.6, cy - sy * 0.6]
  box(tower, pc[0] - 0.6, pc[0] + 0.6, pc[1] - 0.6, pc[1] + 0.6, TT, TT + 1.0, null, 0.1)
  pyramid(tower, pc, 0.6, TT + 1.0, 29.5, 4)
}
// a string course, the belfry's paired lancets, a lancet below, a door
const tring = ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]])
for (let i = 0; i < 4; i++) {
  const a = tring[i], b = tring[(i + 1) % 4], m = 3.5
  for (const d of [-1.0, 1.0]) onWall(win, a, b, lancet(m + d, 1.3, 18.5, 23.1), 0.06)
  onWall(trim, a, b, rectShape(0.4, 6.6, 17.6, 17.9), 0.08)
  if (i === 0 || i === 3) onWall(win, a, b, lancet(m, 1.4, 9.5, 12.6), 0.06)
}
onWall(win, tring[0], tring[1], lancet(3.5, 2.0, 0, 2.6), 0.06) // the south door
// the octagonal spire
{
  const R = 3.3, n = 8, ph = Math.PI / 8
  const ring: V3[] = Array.from({ length: n }, (_, i) => [tc[0] + R * Math.cos(ph + (i / n) * Math.PI * 2), tc[1] + R * Math.sin(ph + (i / n) * Math.PI * 2), TT])
  const apex: V3 = [tc[0], tc[1], 51.5]
  for (let i = 0; i < n; i++) tower.tri(ring[i], ring[(i + 1) % n], apex)
  // gabled lucarnes on the four cardinal faces
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    const out = R * Math.cos(Math.PI / 8) + 0.2, w = 1.0
    const c: XY = [tc[0] + dx * out, tc[1] + dy * out], t: XY = [-dy, dx]
    const P = (s: number, d: number, z: number): V3 => [c[0] + t[0] * s - dx * d, c[1] + t[1] * s - dy * d, z]
    // front gable and two roof slopes running back into the spire
    tower.quad(P(-w, 0, TT), P(w, 0, TT), P(w, 0, 29.2), P(-w, 0, 29.2))
    tower.tri(P(-w, 0, 29.2), P(w, 0, 29.2), P(0, 0, 31.0))
    tower.quad(P(w, 0, 29.2), P(w, 2.2, 29.2), P(0, 2.2, 31.0), P(0, 0, 31.0))
    tower.quad(P(0, 0, 31.0), P(0, 2.2, 31.0), P(-w, 2.2, 29.2), P(-w, 0, 29.2))
    tower.quad(P(w, 0, TT), P(w, 2.2, TT), P(w, 2.2, 29.2), P(w, 0, 29.2))
    tower.quad(P(-w, 2.2, TT), P(-w, 0, TT), P(-w, 0, 29.2), P(-w, 2.2, 29.2))
    const L = 2 * w, a: XY = [c[0] - t[0] * w, c[1] - t[1] * w], b: XY = [c[0] + t[0] * w, c[1] + t[1] * w]
    void L
    onWall(win, a, b, lancet(w, 0.8, TT + 0.8, 28.4), 0.05)
  }
  // the cross
  box(trim, tc[0] - 0.15, tc[0] + 0.15, tc[1] - 0.15, tc[1] + 0.15, 51.0, 53.5, trim, 0.05)
  box(trim, tc[0] - 0.7, tc[0] + 0.7, tc[1] - 0.15, tc[1] + 0.15, 52.3, 52.6, trim, 0.05)
}

await save('den-trinity-united-methodist', 'Trinity United Methodist Church', [
  { part: stone, material: { ...finish('trinity-rhyolite', 0xaa918a), floodlight: (p, n) => (p[0] < -11.5 && p[1] < -6.8 ? (n[2] < 0.9 ? 0.9 : 0.5) : n[2] < 0.5 ? 0.35 : 0) } },
  { part: roof, material: finish('trinity-slate', 0x6a7078) },
  { part: win, material: PALETTE.window },
  { part: trim, material: finish('trinity-trim', 0xe2d2c6) },
], { height: 53.5, anchor: [39.7451219, -104.9870051], bearing: 0 })
