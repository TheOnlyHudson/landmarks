/**
 * Shore Theater, 1301 Surf Avenue at Stillwell Avenue, Coney Island
 * (Reilly & Hall, 1925; built as Loew's Coney Island; NYC landmark 2010) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-shore-theater.ts
 *
 * An eight-storey office tower on the corner, Renaissance Revival in tan
 * brick over a two-storey limestone base with round-arched windows, a pale
 * band storey and cornice, and an attic of arched windows under a green
 * cornice; behind it, along Stillwell Avenue, the painted stucco auditorium
 * with its yellow fire escapes and the stage house at the north end.
 *
 * Map frame: x = east, y = north, z up, metres, built in the building's own
 * frame and placed at bearing 351.2 (its long walls along Stillwell
 * Avenue). Anchor: area centroid of OSM way/248496346 (-73.9816773,
 * 40.5759446). The outline is OSM's, turned into that frame: Surf Avenue is
 * the south edge (the west 9 m of it 2.2 m further back), Stillwell Avenue
 * the east edge, the north-east corner cut on a diagonal.
 *
 * Evidence
 * - OSM: way/248496346 (building=yes, abandoned=yes, height 33.0), 31 m
 *   on Surf Avenue × 49 m on Stillwell Avenue (57 m overall). No parts.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m grid, read in the model's
 *   frame (tools/lidar_frame.py, bearing 351.2). Heights above the lowest
 *   ground: tower 16 m deep (y −27.2 to −11); its roof 34.3 m, the edge
 *   along Surf Avenue 32–33 m; a lower strip 30.6 m along the Stillwell
 *   side (the attic is set back there); a bulkhead at the north-west
 *   corner of the tower to 38 m. Auditorium from the tower to y 17: walls
 *   19.5 m, a low gable roof rising to 23.6 m at x ≈ 1. Stage house from y
 *   17 to the north wall, flat at 22.5 m.
 * - Terrain (Mapterhorn): flat within 1.4 m; the Surf Avenue sidewalk is
 *   about 1 m over the lowest ground inside the footprint (FG).
 * - Published: Wikipedia "Shore Theater" and the LPC designation report
 *   (2010): 1925, Reilly & Hall; seven-storey office tower (eight with the
 *   attic) on a limestone base; 2,400-seat auditorium; closed since the
 *   1970s, vacant.
 * - Photos (Wikimedia Commons):
 *   - "Coney Island Shore Theater.jpg", Vanz, CC BY-SA 3.0 (2008): the
 *     corner from the south-east — base arches on both streets, the brick
 *     shaft, the attic, the auditorium and its fire escape behind
 *   - "2008-05-17 Coney Island, Long Island 007 Coney Island, Surf Avenue
 *     (2677823359).jpg", Allie_Caulfield, CC BY 2.0: the same corner, the
 *     attic's arched windows and balcony, the cornice lines
 *   - "Coney Island Surf Av 01.jpg", Tdorante10, CC BY-SA 4.0 (2017): the
 *     Surf Avenue front square on, the green top cornice, the loggia
 *   - "Coney Island Shore Theater Sep 2019 01–09.jpg", Epicgenius,
 *     CC BY-SA 4.0: all sides under scaffolding; the auditorium wall on
 *     Stillwell Avenue, its fire escape, the stepped parapet
 *   - "Coney Island Brooklyn July 2024.jpg", Kidfly182, CC BY 4.0: the
 *     auditorium's east wall and stage house
 *
 * Storeys (from the 2008 photos, scaled to the lidar's 34.3 m roof): base
 * to 9.8 m with its arches springing at 6.4 m; brick shaft 10.4–26.0 m
 * (five storeys); band storey to 30.0 m, cornice to 30.8 m; attic to
 * 33.6 m, green cornice to 34.4 m. Estimated: bay counts (8 on Surf, 6 on
 * Stillwell), the fire escape's flights (from the 2019 photos), the
 * balcony's width. The west wall above the neighbours and the north wall
 * are not photographed and are drawn plain.
 *
 * The fire escape is drawn in the brick's tan, the nearest of the model's
 * six materials to its ochre-yellow paint.
 *
 * Left out: the vertical SHORE blade sign at the corner, which the 2008
 * photos show and the 2017 photo no longer does; the sidewalk sheds.
 *
 * Night: the building has been vacant since the 1970s, so its windows use
 * an unlit glazing colour (`shore-glazing`) rather than `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, insetRing, type XY } from './nyc-570-lexington'

const brick = new Part(), stone = new Part(), glaze = new Part(), roof = new Part(), paint = new Part(), copper = new Part()

const FG = 1.0
const S = -27.2, E = 14.49, TN = -11, W = -16.6, WN = -8.48, AW = -12.72, SW = -24.97, SX = -7.47
const BASE = 9.8, COURSE = 10.4, SHAFT = 26.0, BAND = 30.0, CORNICE = 30.8, ATTIC = 33.6, TOP = 34.4
const AUD_EAVE = 19.5, AUD_RIDGE = 23.6, RIDGE_X = 0.9, STAGE = 22.6, STAGE_Y = 17

const TOWER: XY[] = [[SX, S], [E, S], [E, TN], [AW, TN], [AW, WN], [W, WN], [W, SW], [SX, SW]]

/** A frame along a wall a→b (counter-clockwise), d outward. */
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at, u, n }
}
type At = (s: number, z: number, d?: number) => V3
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
/** A round-headed panel. */
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  for (let k = 0; k < 8; k++) {
    const a0 = (Math.PI * k) / 8, a1 = (Math.PI * (k + 1)) / 8
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}
/** A semicircular band of width t outside radius r. */
function archivolt(p: Part, at: At, c: number, r: number, t: number, spring: number, d: number) {
  for (let k = 0; k < 8; k++) {
    const a0 = (Math.PI * k) / 8, a1 = (Math.PI * (k + 1)) / 8
    const P = (a: number, rr: number) => at(c + rr * Math.cos(a), spring + rr * Math.sin(a), d)
    p.quad(P(a1, r), P(a0, r), P(a0, r + t), P(a1, r + t))
  }
}
/** A convex flat polygon facing `n` (winding fixed to agree with it). */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A box from (x0,y0,z0) to (x1,y1,z1), walls and top. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bevel = 0.2) {
  prism({ wall: p, win: null, roof: p, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel })
}
/** Panels across a wall: `count` bays in s0..s1, each w wide, z0..z1. */
function bays(p: Part, at: At, s0: number, s1: number, count: number, w: number, z0: number, z1: number, d = 0.06) {
  const pitch = (s1 - s0) / count
  for (let k = 0; k < count; k++) {
    const c = s0 + pitch * (k + 0.5)
    rect(p, at, c - w / 2, c + w / 2, z0, z1, d)
  }
}
/** A horizontal band standing out from a ring of walls: a ledge with a top. */
function ledge(p: Part, ring: XY[], z0: number, z1: number, out: number) {
  const r = offset(ring, out)
  prism({ wall: p, win: null, roof: p, ring: r, z0, z1, facade: null, bevel: Math.min(0.25, (z1 - z0) / 2) })
}
/** Offset a counter-clockwise ring outward by d. */
const offset = (ring: XY[], d: number): XY[] => insetRing(ring, -d)

// ---------------------------------------------------------------------------
// The tower: limestone base, string course, brick shaft, band storey,
// cornice, attic, green cornice; the stair bulkhead at its north-west corner.
// ---------------------------------------------------------------------------
prism({ wall: stone, win: null, roof: null, ring: TOWER, z0: 0, z1: BASE, facade: null, bevel: 0.3 })
ledge(stone, TOWER, BASE, COURSE, 0.2)
prism({ wall: brick, win: null, roof: null, ring: TOWER, z0: COURSE, z1: SHAFT, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof: null, ring: TOWER, z0: SHAFT, z1: BAND, facade: null, bevel: 0.3 })
ledge(stone, TOWER, BAND, CORNICE, 0.55)
// The roof terraces at the cornice (the attic is set back from Stillwell
// Avenue and a little from the other fronts).
capPoly(roof, offset(TOWER, 0.3), CORNICE + 0.01)
const ATTIC_RING: XY[] = [[-7.0, S + 0.6], [11.5, S + 0.6], [11.5, TN - 0.4], [W + 0.6, TN - 0.4], [W + 0.6, SW + 0.6], [-7.0, SW + 0.6]]
prism({ wall: brick, win: null, roof: null, ring: ATTIC_RING, z0: CORNICE, z1: ATTIC, facade: null, bevel: 0.25 })
ledge(copper, ATTIC_RING, ATTIC, TOP, 0.35)
capPoly(roof, offset(ATTIC_RING, 0.2), TOP + 0.01)
box(brick, W + 0.6, TN - 2.0, CORNICE, AW - 0.2, WN - 0.3, 38.0, 0.2)

// The tower's windows, face by face.
type Face = { a: XY; b: XY; arches: number; shaft: number; base: boolean }
const faces: Face[] = [
  { a: [SX, S], b: [E, S], arches: 6, shaft: 8, base: true }, // Surf Avenue
  { a: [W, SW], b: [SX, SW], arches: 2, shaft: 3, base: true }, // Surf Avenue, set back
  { a: [E, S], b: [E, TN], arches: 4, shaft: 6, base: true }, // Stillwell Avenue
  { a: [W, WN], b: [W, SW], arches: 0, shaft: 5, base: false }, // west, over the neighbours
]
for (const f of faces) {
  const F = along(f.a, f.b), m = 0.9
  if (f.base) {
    const pitch = (F.L - 2 * m) / f.arches, w = Math.min(2.9, pitch * 0.74), r = w / 2, spring = 6.4
    for (let k = 0; k < f.arches; k++) {
      const c = m + pitch * (k + 0.5)
      arched(glaze, F.at, c, w, FG + 0.6, spring, 0.06)
      archivolt(stone, F.at, c, r, 0.35, spring, 0.12)
    }
  }
  // Brick shaft: five storeys of punched windows (3.12 m storeys, 1.85 m
  // windows, so the brick reads between them as it does in the photos).
  for (let k = 0; k < 5; k++) bays(glaze, F.at, m, F.L - m, f.shaft, 1.45, COURSE + 0.75 + 3.12 * k, COURSE + 2.6 + 3.12 * k)
  // Band storey windows.
  bays(glaze, F.at, m, F.L - m, f.shaft, 1.1, 27.0, 29.2)
}
// The attic: arched windows all round its street fronts, a loggia balcony
// on Surf Avenue.
{
  const A = along(ATTIC_RING[0], ATTIC_RING[1])
  const n = 7, pitch = (A.L - 1.6) / n
  for (let k = 0; k < n; k++) arched(glaze, A.at, 0.8 + pitch * (k + 0.5), 1.4, CORNICE + 0.5, 32.3, 0.06)
  // Balcony across the middle five bays, on brackets.
  const s0 = 0.8 + pitch * 1, s1 = 0.8 + pitch * 6
  const p0 = A.at(s0, 0, 0), p1 = A.at(s1, 0, 1.3)
  box(stone, Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), CORNICE - 0.1, Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1]), CORNICE + 0.35, 0.1)
  box(stone, Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]) , CORNICE + 0.35, Math.max(p0[0], p1[0]), Math.min(p0[1], p1[1]) + 0.25, CORNICE + 1.3, 0.05)
  const Bk = along(ATTIC_RING[1], ATTIC_RING[2])
  const nb = 5, pb = (Bk.L - 1.2) / nb
  for (let k = 0; k < nb; k++) arched(glaze, Bk.at, 0.6 + pb * (k + 0.5), 1.4, CORNICE + 0.5, 32.3, 0.06)
  const Wk = along(ATTIC_RING[3], ATTIC_RING[4])
  // Clear of the stair bulkhead at the north end.
  const nw = 4, w0 = 2.4, pw = (Wk.L - w0 - 0.6) / nw
  for (let k = 0; k < nw; k++) arched(glaze, Wk.at, w0 + pw * (k + 0.5), 1.4, CORNICE + 0.5, 32.3, 0.06)
}

// ---------------------------------------------------------------------------
// The auditorium: painted walls to 19.5 m under a low gable roof, and the
// stage house at the north end.
// ---------------------------------------------------------------------------
const AUD: XY[] = [[AW, TN], [E, TN], [E, STAGE_Y], [AW, STAGE_Y]]
prism({ wall: paint, win: null, roof: null, ring: AUD, z0: 0, z1: AUD_EAVE, facade: null, bevel: 0.3 })
{
  // Roof planes, east and west of the ridge.
  const r = (x: number, y: number, z: number): V3 => [x, y, z]
  const nE: V3 = [AUD_RIDGE - AUD_EAVE, 0, E - RIDGE_X], nW: V3 = [-(AUD_RIDGE - AUD_EAVE), 0, RIDGE_X - AW]
  face(roof, [r(E, TN, AUD_EAVE), r(E, STAGE_Y, AUD_EAVE), r(RIDGE_X, STAGE_Y, AUD_RIDGE), r(RIDGE_X, TN, AUD_RIDGE)], nE)
  face(roof, [r(AW, TN, AUD_EAVE), r(RIDGE_X, TN, AUD_RIDGE), r(RIDGE_X, STAGE_Y, AUD_RIDGE), r(AW, STAGE_Y, AUD_EAVE)], nW)
  // The gable end over the stage house, facing north.
  face(paint, [r(AW, STAGE_Y, AUD_EAVE), r(E, STAGE_Y, AUD_EAVE), r(RIDGE_X, STAGE_Y, AUD_RIDGE)], [0, 1, 0])
}
const STAGE_RING: XY[] = [[E, STAGE_Y], [E, 22.17], [10.71, 22.17], [10.71, 25.7], [-1.41, 30.18], [AW, 30.2], [AW, STAGE_Y]]
prism({ wall: paint, win: null, roof, ring: STAGE_RING, z0: 0, z1: STAGE, facade: null, bevel: 0.3 })

// The Stillwell Avenue wall: a few high windows, and the fire escape — three
// flights with landings, stepping down northwards from the tower.
{
  const F = along([E, TN], [E, STAGE_Y])
  bays(glaze, F.at, 2, F.L - 2, 4, 1.2, 16.0, 17.6)
  const flights: [number, number, number][] = [[1.0, 17.0, 13.0], [8.5, 13.0, 9.0], [16.0, 9.0, 5.0]]
  for (const [s0, zTop, zBot] of flights) {
    // Landing at the top of the flight, with its canopy.
    const l0 = s0, l1 = s0 + 1.8
    const P = (s: number, z: number, d: number) => F.at(s, z, d)
    for (const [z0, z1] of [[zTop - 0.3, zTop], [zTop + 2.4, zTop + 2.65]]) {
      const a = P(l0, 0, 0.05), b = P(l1, 0, 1.45)
      box(brick, Math.min(a[0], b[0]), Math.min(a[1], b[1]), z0, Math.max(a[0], b[0]), Math.max(a[1], b[1]), z1, 0.05)
    }
    // Posts at the landing's outer corners.
    for (const s of [l0 + 0.1, l1 - 0.1]) {
      const c = P(s, 0, 1.35)
      prism({ wall: brick, win: null, roof: null, ring: [[c[0] - 0.08, c[1] - 0.08], [c[0] + 0.08, c[1] - 0.08], [c[0] + 0.08, c[1] + 0.08], [c[0] - 0.08, c[1] + 0.08]], z0: zTop, z1: zTop + 2.4, facade: null, bevel: 0 })
    }
    // The flight: a sloped band (stair stringer and rail) standing off the wall.
    const f0 = l1, f1 = l1 + 5.6
    const nOut: V3 = [F.n[0], F.n[1], 0]
    face(brick, [P(f0, zTop - 0.4, 1.45), P(f1, zBot - 0.4, 1.45), P(f1, zBot + 1.3, 1.45), P(f0, zTop + 1.3, 1.45)], nOut)
    face(brick, [P(f0, zTop - 0.4, 1.4), P(f0, zTop + 1.3, 1.4), P(f1, zBot + 1.3, 1.4), P(f1, zBot - 0.4, 1.4)], [-nOut[0], -nOut[1], 0])
    // Treads, seen from above, as one sloped plane.
    const up: V3 = [0, 0, 1]
    face(brick, [P(f0, zTop - 0.25, 0.1), P(f0, zTop - 0.25, 1.4), P(f1, zBot - 0.25, 1.4), P(f1, zBot - 0.25, 0.1)], up)
    face(brick, [P(f0, zTop - 0.35, 0.1), P(f1, zBot - 0.35, 0.1), P(f1, zBot - 0.35, 1.4), P(f0, zTop - 0.35, 1.4)], [0, 0, -1])
  }
}

finishModel('Shore Theater', 'nyc-shore-theater', [
  { part: brick, material: finish('shore-brick', 0xcfae78) },
  { part: stone, material: finish('shore-limestone', 0xe9e3d6) },
  { part: glaze, material: finish('shore-glazing', 0x64798a, 0.35) },
  { part: roof, material: PALETTE.roof },
  { part: paint, material: finish('shore-paint', 0xe8d8a8) },
  { part: copper, material: PALETTE.copper },
], { bearing: 351.2, osm: 'way/248496346', height: 38.0 })
