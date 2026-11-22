/**
 * The Met Cloisters, Fort Tryon Park, Manhattan (Charles Collens of Allen,
 * Collens & Willis, 1934–38, built around medieval European fragments) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-cloisters.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 20°, the axis of the OSM outline (182 m of its edges run at
 * 20° ± 1°), so +y is NNE toward the Fuentidueña apse and +x is ESE.
 * Anchor: the centroid of the outer way of OSM relation/6424088
 * (building=yes, "The Cloisters", height=33.4, ele=54), way/285900676.
 * The model also covers way/285900671 (building=yes, "Fuentidueña Chapel",
 * height=33.4), which is the chapel's nave and apse.
 *
 * Plan (OSM, model frame, rotated from the API's map call): the relation's
 * outer ring as drawn, and its four inner rings, which are the open garths:
 * Cuxa x −11.1..2.7, y −4.2..12.0 (upper level); Bonnefont x −15.1..−1.0,
 * y −36..−23 and Trie x 7.8..17.2, y −33.8..−21.3 (lower level); and the
 * Saint-Guilhem cloister x −15..−7.7, y 30..39.6, which is roofed with a
 * skylight (grey glazing in the NAIP aerial) and is drawn as a low glazed
 * hip. The courtyard ground is the map's; the model draws the arcades round
 * each garth and the walks' lean-to tile roofs, never the garth surface.
 * Ranges, ridge directions and the tower position read from USGS NAIP
 * (public domain, 0.21 m/px) rotated into this frame: gabled ranges west,
 * south and east of Cuxa with ridges along the ranges, the Fuentidueña nave
 * N–S with its apse to the NNE, an E–W entrance wing to the ESE, and the
 * tower NE of the Cuxa garth, at the north end of the east range (placed
 * by the lidar).
 *
 * Heights below are measured from the terrace outside the south front,
 * ≈ 54.3 m NAVD88 (lidar). The map puts y = 0 on the lowest Mapterhorn
 * ground over the plan extent, 51.15 m (`bun tools/terrain.ts check`), at
 * the south-west corner off the west ramparts, so the generator lifts
 * everything but the wall feet by LIFT = 3.1 m at the end: the walls run
 * down into the hill, and the levels and tower (apex 44.3 above y = 0)
 * land at their real heights. elevation stays 0.
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017 flight), 1 m grid
 *   centred on the anchor, read in this frame (DSM above y = 0): tower
 *   ≈ 11 m square at x 5..16, y 17..28, eaves +38.4, apex +41.2; east range
 *   ridge +20.2; north range +20.7; Fuentidueña nave +21.1; west range
 *   +17.3; south range +15.7; Cuxa walks' lean-tos +12.7..14.1; Saint-
 *   Guilhem skylight +17.5; the block east of the chapel +16.1; entrance
 *   wing ≈ +19 stepping to ≈ +14 at its east end; Trie walks +9.8; the
 *   Bonnefont ramparts +5; the low outer east range ≈ +7.7; the west
 *   terrace +7.7. Garths: Cuxa +8.6, Bonnefont +4.2, Trie +4.5.
 * - OSM height=33.4 matches the tower apex measured from the drive on the
 *   north (≈ +8), not from the lowest ground.
 * - Estimated from photo 1: the tower's stage heights (a 6 m belfry stage,
 *   three of ≈ 4 m below), window sizes and rows; eave heights where the
 *   lidar shows only a ridge (pitch read from the DSM's fall across the
 *   range); walk depths ≈ 2.7–4 m.
 * - Mapterhorn terrain under the site falls ≈ 4 m to the south edge and
 *   ≈ 5 m to the drive on the north; the map's ground in the garths is a
 *   smoothed fill, so the arcades run down to y = 0 and sink into it.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-cloisters/photos):
 * 1. Beyond My Ken, "2013 The Cloisters from Linden Terrace in Fort Tryon
 *    Park.jpg", CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:2013_The_Cloisters_from_Linden_Terrace_in_Fort_Tryon_Park.jpg
 *    (from the SSE: the tower's stages, paired round-headed belfry lights,
 *    string courses and low red pyramid; the long red-tiled ranges stepping
 *    up behind one another; the Gothic chapel's bellcote gable to the left)
 * 2. Beyond My Ken, "2017 The Cloisters Bonnefont and Trie Cloisters from
 *    Fort Tryon Park.jpg", CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:2017_The_Cloisters_Bonnefont_and_Trie_Cloisters_from_Fort_Tryon_Park.jpg
 *    (from below the south rampart: the parapet, a lean-to arcade walk,
 *    the Gothic chapel's tall gable with lancets, buttresses, grey granite
 *    ashlar and Spanish tile)
 * Colours from those photos: warm grey-buff granite, pale limestone
 * dressings, orange-red Spanish tile, pulled to the palette's lightness.
 *
 * Left out: the walls and round bastions of the entrance drive north of the
 * building (OSM barrier=wall ways 320731227, 320731231, 320731234), which
 * stand 30–80 m out on ground 3–5 m lower; the model keeps the terrace
 * ramparts on the west (ways 320731223, 320731225, 320731232).
 *
 * Doubts: only two sides are photographed (SSE and SW); the west and
 * north faces, the walk depths and the window rhythm are estimates. The
 * Bonnefont arcades are drawn on its N and E sides and ramparts with a walk
 * on its W and S strips, from the lidar (+5 on the strips, lean-to heights
 * on the N and E) and photo 2. The Gothic chapel is taken to be the west
 * range's south end, whose gable carries the bellcote seen in photo 1. The
 * Trie walks' roofs read flat at +9.8 on the 1 m lidar; they are drawn as
 * low tile lean-tos, as the aerial's colour suggests.
 */
import { Part, type V3 } from './mesh'
import { finishModel, spire, type XY } from './nyc-570-lexington'
import { board, poly, opening, slabUp, box, archPts, type P2, type Map2 } from './nyc-cp-dairy'

const stone = new Part(), trim = new Part(), tile = new Part(), win = new Part(), flat = new Part(), shade = new Part()

const LO = 4.2, UP = 8.6 // floor levels: lower cloisters, Cuxa (lidar garths)

const M = (axis: 'x' | 'y', u: number, v: number, z: number): V3 => (axis === 'x' ? [u, v, z] : [v, u, z])
const AX = (axis: 'x' | 'y'): V3 => (axis === 'x' ? [1, 0, 0] : [0, 1, 0])

/**
 * A gabled range along `axis` (u0..u1 along the ridge, v0..v1 across):
 * granite walls from the ground to the eave, gables, a Spanish-tile roof
 * at pitch `k` overhanging `oh`, and a pale eave course.
 */
function range(axis: 'x' | 'y', u0: number, u1: number, v0: number, v1: number, eave: number, k = 0.5, oh = 0.45, ends: [boolean, boolean] = [true, true]) {
  const vc = (v0 + v1) / 2, half = (v1 - v0) / 2, ridge = eave + half * k, t = 0.3
  board(stone, [[v0, 0], [v1, 0], [v1, eave], [v0, eave]], (s, z) => M(axis, (u0 + u1) / 2, s, z), AX(axis), u1 - u0)
  board(stone, [[v0, eave], [v1, eave], [vc, ridge - 0.05]], (s, z) => M(axis, (u0 + u1) / 2, s, z), AX(axis), u1 - u0)
  const U0 = u0 - (ends[0] ? oh * 0.6 : 0), U1 = u1 + (ends[1] ? oh * 0.6 : 0), um = (U0 + U1) / 2
  board(tile, [[v0 - oh, eave - oh * k], [vc, ridge], [vc, ridge + t], [v0 - oh, eave - oh * k + t]], (s, z) => M(axis, um, s, z), AX(axis), U1 - U0)
  board(tile, [[v1 + oh, eave - oh * k], [v1 + oh, eave - oh * k + t], [vc, ridge + t], [vc, ridge]], (s, z) => M(axis, um, s, z), AX(axis), U1 - U0)
  board(trim, [[v0 - 0.12, eave - 0.45], [v1 + 0.12, eave - 0.45], [v1 + 0.12, eave - 0.15], [v0 - 0.12, eave - 0.15]], (s, z) => M(axis, (u0 + u1) / 2, s, z), AX(axis), u1 - u0 + 0.24)
  return ridge
}

/** A lean-to walk roof along `axis`: low edge at vLow (the garth side), high at vHigh. */
function leanTo(axis: 'x' | 'y', u0: number, u1: number, vLow: number, vHigh: number, zLow: number, zHigh: number) {
  const d = Math.sign(vHigh - vLow), k = (zHigh - zLow) / Math.abs(vHigh - vLow), oh = 0.45, t = 0.25
  const a: P2 = [vLow - d * oh, zLow - oh * k], b: P2 = [vHigh, zHigh]
  board(tile, [a, b, [b[0], b[1] + t], [a[0], a[1] + t]], (s, z) => M(axis, (u0 + u1) / 2, s, z), AX(axis), u1 - u0)
}

/** Openings in a row along the wall a→b, outward normal n, centred `count` of them. */
function row(p: Part, a: XY, b: XY, n: XY, count: number, w: number, z0: number, z1: number, rise: number, pair = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  for (let i = 0; i < count; i++) {
    const s = (L * (i + 0.5)) / count
    for (const o of pair ? [-pair / 2, pair / 2] : [0]) opening(p, a[0] + ux * (s + o), a[1] + uy * (s + o), n[0], n[1], w, z0, z1, rise, 0.06)
  }
}

/**
 * An arcade on a garth edge a→b, facing the garth (normal n): a granite
 * wall `th` thick behind the line from the ground to `top`, a limestone
 * sill course, and round-headed openings `w` wide from `floor` to `head`.
 */
function arcade(a: XY, b: XY, n: XY, floor: number, head: number, top: number, w: number, count: number) {
  const th = 0.6, L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const at: Map2 = (s, z) => [a[0] + ux * s - n[0] * th / 2, a[1] + uy * s - n[1] * th / 2, z]
  board(stone, [[0, 0], [L, 0], [L, top], [0, top]], at, [n[0], n[1], 0], th)
  const atS: Map2 = (s, z) => [a[0] + ux * s + n[0] * 0.1, a[1] + uy * s + n[1] * 0.1, z]
  board(trim, [[0, floor - 0.35], [L, floor - 0.35], [L, floor], [0, floor]], atS, [n[0], n[1], 0], 0.2)
  row(shade, a, b, n, count, w, floor, head, w / 2)
}


/** A flat-topped block (a rampart walk): granite to z, a pale stone deck, a parapet on the open edges. */
function terrace(x0: number, y0: number, x1: number, y1: number, z: number, edges: boolean[] = [true, true, true, true], deck: Part = trim) {
  box(stone, x0, y0, x1, y1, 0, z)
  slabUp(deck, [[x0 + 0.05, y0 + 0.05], [x1 - 0.05, y0 + 0.05], [x1 - 0.05, y1 - 0.05], [x0 + 0.05, y1 - 0.05]], z, z + 0.08)
  const p = 0.35, h = 0.9
  if (edges[0]) box(trim, x0, y0, x1, y0 + p, z, z + h)
  if (edges[1]) box(trim, x1 - p, y0, x1, y1, z, z + h)
  if (edges[2]) box(trim, x0, y1 - p, x1, y1, z, z + h)
  if (edges[3]) box(trim, x0, y0, x0 + p, y1, z, z + h)
}

// ===========================================================================
// The upper level: the ranges round the Cuxa cloister (lidar ridges).
// ===========================================================================
const CX0 = -11.1, CX1 = 2.7, CY0 = -4.2, CY1 = 12.0
const WX1 = -15.1, EX0 = 7.5, SY1 = -7.4, NY0 = 15.6 // inner faces of the ranges
range('y', -27.6, NY0, -24.6, WX1, 15.2, 0.42)                                        // west range, ridge 17.3; its south end is the Gothic chapel
range('x', WX1, EX0, -20.3, SY1, 14.0, 0.27, 0.45, [false, false])                    // south range, ridge 15.7
range('y', -21.3, 17.2, EX0, 16.5, 18.0, 0.5)                                         // east range, ridge 20.2
range('x', -24.6, EX0, NY0, 26.4, 18.6, 0.38, 0.45, [true, false])                    // north range, ridge 20.7
range('y', -21.3, 17.2, 16.5, 22.6, 6.8, 0.45)                                        // the low outer range to the ESE
range('y', 18.5, 26.0, -30.6, -24.6, 12.0, 0.5)                                       // the pavilion off the north-west corner

// Cuxa arcades: round-headed openings on all four sides of the garth, the walks' lean-tos above (lidar 12.7–14.1).
const CH = UP + 3.0, CT = UP + 3.8
arcade([CX1, CY0], [CX1, CY1], [-1, 0], UP, CH, CT, 1.5, 6)
arcade([CX0, CY1], [CX0, CY0], [1, 0], UP, CH, CT, 1.5, 6)
arcade([CX0, CY0], [CX1, CY0], [0, 1], UP, CH, CT, 1.5, 5)
arcade([CX1, CY1], [CX0, CY1], [0, -1], UP, CH, CT, 1.5, 5)
leanTo('y', SY1, NY0, CX0, WX1, CT, 13.9)
leanTo('y', SY1, NY0, CX1, EX0, CT, 14.6)
leanTo('x', CX0, CX1, CY0, SY1, CT, 13.6)
leanTo('x', CX0, CX1, CY1, NY0, CT, 13.6)
for (const [x, y] of [[CX0, CY0], [CX1, CY0], [CX0, CY1], [CX1, CY1]] as XY[]) box(stone, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, CT + 0.3)

// Buttresses on the west face, where OSM draws them.
for (const y of [-25.2, -20.0, -14.6]) {
  box(stone, -25.5, y - 0.55, -24.6, y + 0.55, 0, 11.0)
  slabUp(trim, [[-25.6, y - 0.6], [-24.6, y - 0.6], [-24.6, y + 0.6], [-25.6, y + 0.6]], 11.0, 11.3)
}

// Round-headed windows on the outer faces of the upper ranges.
row(win, [-24.6, -12.0], [-24.6, NY0], [-1, 0], 6, 1.2, 10.8, 13.6, 0.6)
row(win, [-30.6, 18.5], [-30.6, 26.0], [-1, 0], 1, 1.1, 8.0, 10.2, 0.55)
row(win, [16.5, -21.3], [16.5, 15.0], [1, 0], 7, 0.9, 13.6, 16.2, 0.45, 1.3)       // east range above the low one, paired
row(win, [22.6, -21.3], [22.6, 17.2], [1, 0], 9, 1.0, 4.2, 5.6, 0)              // low range: square windows
row(shade, [22.6, -21.3], [22.6, 17.2], [1, 0], 9, 1.8, 0.6, 2.9, 0.9)          // and an arcade under them
row(win, [WX1, -20.3], [EX0, -20.3], [0, -1], 5, 1.0, 11.0, 13.2, 0.5, 1.4)     // south range over the Bonnefont walk
row(win, [-24.6, 26.4], [-17.7, 26.4], [0, 1], 2, 1.1, 12.5, 15.0, 0.55)

// ===========================================================================
// The lower level (garths at +4.2 by lidar): Bonnefont (SW) and Trie (SE).
// ===========================================================================
const LH = LO + 2.6, LT = LO + 3.2
// Bonnefont: ramparts with a walk on top along its W and S sides (lidar +5),
// arcaded walks with lean-tos on its N and E sides.
const BX0 = -15.1, BX1 = -1.0, BY0 = -36.0, BY1 = -23.0, OX = -19.2, OY = -39.2, BE = 1.2
terrace(OX, OY, BX0, BY1, LO + 0.1, [false, false, false, true])
terrace(BX0, OY, BE, BY0, LO + 0.1, [true, false, false, false])
arcade([BX1, BY1], [BX0, BY1], [0, -1], LO, LH, LT, 1.3, 5)
arcade([BX1, BY0], [BX1, BY1], [-1, 0], LO, LH, LT, 1.3, 5)
leanTo('x', BX0, BX1, BY1, -20.3, LT, 9.8)
leanTo('y', BY0, BY1, BX1, BE, LT, 8.2)
box(stone, BX1 - 0.4, BY1 - 0.4, BX1 + 0.4, BY1 + 0.4, 0, LT + 0.3)
// The Gothic chapel fills the west range's south end: its gable over the
// Bonnefont garden has three tall lancets and carries the bellcote.
row(win, [-15.1, -27.6], [-24.6, -27.6], [0, -1], 3, 0.85, 6.0, 12.6, 0.8)
for (const x of [-24.6, -15.1]) box(stone, x - 0.4, -28.4, x + 0.4, -27.6, 0, 12.0)
{
  const rz = 15.2 + 4.75 * 0.42, xc = (-24.6 + WX1) / 2
  board(stone, [[-1.1, rz - 0.8], [1.1, rz - 0.8], [1.1, rz + 1.4], [0, rz + 2.3], [-1.1, rz + 1.4]], (s, z) => [xc + s, -27.3, z], [0, 1, 0], 0.6)
  opening(shade, xc, -27.6, 0, -1, 0.7, rz - 0.1, rz + 1.3, 0.35, 0.04)
}

// Trie: walks on three sides (lidar +9.8 over them) under low lean-tos of
// tile falling to the garth, round arches on every garth face.
const TX0 = 7.8, TX1 = 17.2, TY0 = -33.8, TY1 = -21.3, TZ = 9.0
box(stone, BE, OY, TX0, TY1, 0, TZ)
box(stone, TX0, OY, TX1, TY0, 0, TZ)
box(stone, TX1, OY, 22.6, TY1, 0, TZ)
leanTo('y', OY, TY1, TX0, BE, TZ, TZ + 1.1)
leanTo('x', TX0, TX1, TY0, OY, TZ, TZ + 1.1)
leanTo('y', OY, TY1, TX1, 22.6, TZ, TZ + 1.1)
row(shade, [TX0, TY1], [TX0, TY0], [1, 0], 5, 1.3, LO, LH, 0.65)
row(shade, [TX0, TY0], [TX1, TY0], [0, 1], 4, 1.3, LO, LH, 0.65)
row(shade, [TX1, TY0], [TX1, TY1], [-1, 0], 5, 1.3, LO, LH, 0.65)
row(shade, [TX1, TY1], [TX0, TY1], [0, -1], 4, 1.3, LO, LH, 0.65)
for (const [a, b, n] of [[[TX0, TY1], [TX0, TY0], [1, 0]], [[TX0, TY0], [TX1, TY0], [0, 1]], [[TX1, TY0], [TX1, TY1], [-1, 0]]] as [XY, XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  board(trim, [[0, LO - 0.35], [L, LO - 0.35], [L, LO], [0, LO]], (s, z) => [a[0] + ux * s + n[0] * 0.1, a[1] + uy * s + n[1] * 0.1, z], [n[0], n[1], 0], 0.2)
  board(trim, [[0, LT - 0.2], [L, LT - 0.2], [L, LT + 0.15], [0, LT + 0.15]], (s, z) => [a[0] + ux * s + n[0] * 0.1, a[1] + uy * s + n[1] * 0.1, z], [n[0], n[1], 0], 0.2)
}
// Windows along the south front, over the terrace walls.
row(win, [22.6, OY], [BE, OY], [0, -1], 6, 1.0, 5.6, 7.4, 0)

// ===========================================================================
// The north: entrance wing, Fuentidueña chapel, Saint-Guilhem (lidar heights).
// ===========================================================================
range('y', 28.2, 39.0, 4.7, 19.1, 15.2, 0.2, 0.45, [false, true])              // the block east of the chapel (lidar +16.1)
range('x', 16.2, 28.5, 17.4, 28.4, 17.0, 0.36, 0.45, [false, false])          // entrance wing, the tall part (ridge 19)
range('x', 28.5, 36.9, 17.4, 28.4, 12.0, 0.36, 0.45, [false, true])           // and its lower east end
// The entrance arch on the east end, facing the drive (ground there ≈ +4.3).
box(trim, 36.9, 20.9, 37.2, 24.9, 4.3, 9.4)
opening(shade, 37.2, 22.9, 1, 0, 2.8, 4.3, 8.6, 1.4, 0.04)
row(win, [16.2, 17.4], [36.9, 17.4], [0, -1], 5, 1.0, 9.5, 11.3, 0.5)
row(win, [36.9, 28.4], [19.1, 28.4], [0, 1], 4, 1.0, 9.5, 11.3, 0.5)

// The Fuentidueña chapel: a tall nave, a lower chancel and a round apse to the NNE.
const NX0 = -5.9, NX1 = 4.7, AXC = -0.45, AYC = 48.2, AR = 4.45, AE = 16.0
range('y', 26.4, 44.8, NX0, NX1, 19.2, 0.37, 0.45, [false, true])
range('y', 44.8, AYC, AXC - AR, AXC + AR, 16.5, 0.4, 0.3, [false, false])
{
  const n = 8, ring: XY[] = Array.from({ length: n + 1 }, (_, i) => { const a = (i * Math.PI) / n; return [AXC + AR * Math.cos(a), AYC + AR * Math.sin(a)] as XY })
  slabUp(stone, ring, 0, AE)
  slabUp(trim, ring.map(([x, y]) => [AXC + (x - AXC) * 1.03, AYC + (y - AYC) * 1.03] as XY), AE - 0.45, AE - 0.15)
  const apex: V3 = [AXC, AYC, AE + AR * 0.4 + 0.3], R = AR + 0.4
  for (let i = 0; i < n; i++) {
    const a0 = (i * Math.PI) / n, a1 = ((i + 1) * Math.PI) / n
    const p0: V3 = [AXC + R * Math.cos(a0), AYC + R * Math.sin(a0), AE - 0.16], p1: V3 = [AXC + R * Math.cos(a1), AYC + R * Math.sin(a1), AE - 0.16]
    tile.tri(p0, p1, apex)
    tile.tri(p1, p0, [AXC, AYC, AE - 0.4])
  }
  for (const a of [Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75]) opening(win, AXC + AR * Math.cos(a), AYC + AR * Math.sin(a), Math.cos(a), Math.sin(a), 0.8, 10.0, 13.4, 0.4, 0.08)
}
row(win, [NX1, 39.0], [NX1, 44.8], [1, 0], 1, 0.9, 14.6, 17.6, 0.45)
row(win, [NX0, 44.8], [NX0, 26.4], [-1, 0], 3, 0.9, 16.0, 18.4, 0.45)

// Saint-Guilhem: a block round its skylit cloister (lidar +13.7 at the edge,
// +17.5 on the glazing), the skylight a low grey glazed ridge.
const SX0 = -17.7, SX1 = NX0
box(stone, SX0, 26.4, SX1, 43.7, 0, 15.2)
slabUp(flat, [[SX0 + 0.3, 26.7], [SX1, 26.7], [SX1, 43.4], [SX0 + 0.3, 43.4]], 15.2, 15.3)
box(trim, SX0, 26.4, SX0 + 0.35, 43.7, 15.2, 15.9)
box(trim, SX0, 43.35, SX1, 43.7, 15.2, 15.9)
{
  const gx0 = -15.0, gx1 = -7.7, gy0 = 30.0, gy1 = 39.6, xm = (gx0 + gx1) / 2
  board(flat, [[gy0, 15.3], [gy1, 15.3], [gy1, 15.9], [gy0, 15.9]], (s, z) => [xm, s, z], [1, 0, 0], gx1 - gx0)
  board(flat, [[gx0, 15.9], [xm, 17.6], [gx1, 15.9]], (s, z) => [s, (gy0 + gy1) / 2, z], [0, 1, 0], gy1 - gy0)
}
row(win, [SX0, 43.7], [SX0, 26.4], [-1, 0], 3, 1.0, 11.0, 13.6, 0.5)
row(win, [SX1, 43.7], [SX0, 43.7], [0, 1], 2, 1.0, 11.0, 13.6, 0.5)

// ===========================================================================
// The tower (after Saint-Michel-de-Cuxa), lidar: ≈ 11 m square, eaves
// +38.4, apex +41.2. Stages from photo 1: a tall belfry stage and three
// lower ones, string courses between, paired round-headed lights in the top
// two, single lights below, and a low overhanging pyramid of red tile.
// ===========================================================================
const TWX0 = 5.2, TWX1 = 16.2, TWY0 = 17.2, TWY1 = 28.2, TOP = 38.4, APEX = 41.2
box(stone, TWX0, TWY0, TWX1, TWY1, 0, TOP)
const sq = (d: number): XY[] => [[TWX0 - d, TWY0 - d], [TWX1 + d, TWY0 - d], [TWX1 + d, TWY1 + d], [TWX0 - d, TWY1 + d]]
for (const z of [19.9, 24.0, 28.1, 32.2]) slabUp(trim, sq(0.18), z - 0.4, z)
slabUp(trim, sq(0.35), TOP - 0.5, TOP)
spire(tile, sq(0.85), TOP - 0.3, [(TWX0 + TWX1) / 2, (TWY0 + TWY1) / 2, APEX])
slabUp(tile, sq(0.85), TOP - 0.45, TOP - 0.3)
{
  const faces: [XY, XY, XY][] = [
    [[TWX0, TWY0], [TWX1, TWY0], [0, -1]], [[TWX1, TWY0], [TWX1, TWY1], [1, 0]],
    [[TWX1, TWY1], [TWX0, TWY1], [0, 1]], [[TWX0, TWY1], [TWX0, TWY0], [-1, 0]],
  ]
  for (const [a, b, n] of faces) {
    row(win, a, b, n, 2, 0.8, 33.4, 35.9, 0.4, 1.25)   // belfry: two pairs a face
    row(win, a, b, n, 2, 0.75, 29.2, 31.6, 0.375, 1.15)
    row(win, a, b, n, 2, 0.75, 24.6, 26.3, 0.375)
    row(win, a, b, n, 2, 0.7, 20.6, 22.2, 0.35)
  }
}

// ===========================================================================
// Ramparts: the terrace walls off the west side (OSM barrier=wall ways
// 320731225, 320731223, 320731232), plain granite with a pale coping; the
// terrace inside them is at +7.7 (lidar).
// ===========================================================================
function wall(pts: XY[], top: number, th = 0.9) {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, e = th / 2
    const at: Map2 = (s, z) => [a[0] + ux * s, a[1] + uy * s, z]
    board(stone, [[-e, 0], [L + e, 0], [L + e, top], [-e, top]], at, [-uy, ux, 0], th)
    board(trim, [[-e, top], [L + e, top], [L + e, top + 0.3], [-e, top + 0.3]], at, [-uy, ux, 0], th + 0.2)
  }
}
wall([[-24.6, 14.9], [-35.8, 14.6], [-35.8, 26.7], [-35.7, 32.2], [-30.9, 32.0], [-24.4, 31.6]], 8.6)
wall([[-24.4, 31.6], [-24.1, 43.5], [-25.5, 45.3], [-25.4, 47.4], [-24.3, 48.9], [-22.6, 49.5], [-20.8, 49.1], [-19.7, 48.0], [-17.6, 47.9], [-17.7, 43.7]], 8.6)

// The map stands the model on the lowest Mapterhorn ground over its plan
// extent, 51.15 m, at the south-west corner off the west ramparts, 3.1 m
// below the south terrace (54.3 m by lidar) that every height above is
// measured from. Lift everything but the wall feet by that much, so the
// walls run down into the hill and the levels land at their real heights.
const LIFT = 3.1
for (const part of [stone, trim, tile, win, flat, shade]) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 1e-6) part.pos[i] += LIFT

finishModel('The Met Cloisters', 'nyc-cloisters', [
  { part: stone, material: { name: 'granite', color: 0xd2c7b1, roughness: 0.9 } },
  { part: trim, material: { name: 'trim', color: 0xece3d0, roughness: 0.85 } },
  { part: tile, material: { name: 'tile', color: 0xb5654c, roughness: 0.9 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: flat, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
  { part: shade, material: { name: 'arcade-shade', color: 0x6e6a63, roughness: 0.9 } },
], { bearing: 20, osm: 'relation/6424088', height: APEX + LIFT }, 6500)
