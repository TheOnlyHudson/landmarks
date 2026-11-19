/**
 * Music City Center (201 Rep. John Lewis Way South / 5th Avenue South),
 * Nashville (2013, tvsdesign with Moody Nolan and Tuck-Hinton) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nash-music-city-center.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Map frame: x, y in plan, z up, metres; origin at the anchor on the lowest
 * ground under the footprint (the 5th Avenue end; the ground rises ~17 m to
 * 8th Avenue). Anchor = area centroid of OSM way/107627729 (36.1568429,
 * -86.7784512). Bearing 62.6°: +y runs along the building's 338 m length
 * toward 5th Avenue (the main front, y = 169); -x faces Demonbreun Street
 * (332°), +x faces Korean Veterans Blvd (152°); -y is the 8th Avenue end.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the vast, gently undulating roof over the exhibit halls: a heightfield
 *   taken from the lidar (waves ~2.5 m high, ~70 m apart, rising along the
 *   Demonbreun concourse), with the green roof laid on it as three big
 *   zigzag fields (hourglass shapes between pale triangles of membrane), as
 *   the aerial shows, and the concourse skylight strip along its north edge;
 * - the 5th Avenue front: a thick roof canopy (pale metal fascia, warm wood
 *   soffit) overhanging the lobby on pairs of tall tan columns, its edge
 *   sweeping down along the Korean Veterans Blvd side;
 * - the copper-clad oval ballroom drum standing under the canopy and rising
 *   through it, its roof covered in solar panels;
 * - the glass lobby and the pale limestone block at the Demonbreun corner.
 *
 * Evidence
 * - OSM: outline way/107627729 (building=commercial, "Music City Center",
 *   wikidata Q6941476), a 170 x 338 m rectangle in this frame; part
 *   way/464660188 (building:part, the oval ballroom, x -56..73, y 64..147).
 *   No other building or part lies inside the outline. The Loading Dock
 *   (way/464660192) is a separate building outside the +x side, not drawn.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 1 m grid, read in
 *   this frame (median over ±4 m per sample). Base = lowest ground, at 5th
 *   Ave, 1.0 m above the box's ground_min. Measured above it: exhibit-hall
 *   roof 31-37 m with the waves, concourse strip up to 47 m; canopy 40-44 m;
 *   the ballroom drum 48 m; the skylight trench along x = -47.
 * - NAIP (USDA, public domain), read in this frame: the green-roof fields
 *   (x -44..63, y -163..53) and their zigzag edges, the skylight strip, the
 *   solar panels on the drum.
 * - Published: opened 2013, 2.1 million sq ft, a ~4-acre green roof and an
 *   acre of solar panels (Wikipedia "Music City Center").
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Music City Center 2022a.png, Antony-22, CC BY-SA 4.0 (the 5th Ave front
 *     looking south: canopy, columns, glass, copper drum, the sweep);
 *   Music City Center (Northeast corner) 1.JPG, Michael Rivera, CC BY-SA 4.0
 *     (the corner: limestone block, glass lobby, column pairs);
 *   Music City Center (Northeast face) 2.JPG, Michael Rivera, CC BY-SA 4.0
 *     (the copper drum under the canopy);
 *   Music City Center (looking Southwest).JPG, Michael Rivera, CC BY-SA 4.0;
 *   Music City Center in Nashville, TN 2013-12-03 19-31.jpg, Pjgdds,
 *     CC BY-SA 3.0 (the canopy edge sweeping down along the side);
 *   Music City Center - acre of solar panels.jpg, Rex Hammock, CC BY-SA 2.0
 *     (the pale roof membrane).
 *   Street-level, Mapillary (CC BY-SA 4.0), all EVIDENCE: Mapillary contributor
 *     390040802122156 (2019-12, the 6th Ave S portal from across Demonbreun St: an opening
 *     spanning the road and both sidewalks, a dark lit passage, the far end in daylight);
 *     967122520764473 (2019-06, inside the passage looking back out the portal: ceiling,
 *     clearance); 322191466015589 (2020-01, the 7th Ave S entrance: a garage mouth signed
 *     "Clearance 8'-2"", under the glazed concourse).
 *   No look-only sources were used. No commercial imagery.
 * - 6th Avenue South passes through the halls (OSM way/471353808, tunnel=yes, layer=-1,
 *   y 42-44, x -86.5..113.4, running on under the Loading Dock past X1; tunnel sidewalks
 *   way/471353811 and way/471353810, y ~34 and 51-57). The Demonbreun wall is cut at y 31..57
 *   from the road (lidar 8.3 m above the base at the portal; 4.0 m at x 118, east of the
 *   Loading Dock) to ~6 m above it, and the passage is lined right through the hollow hall in
 *   the dark slate: inward-facing side walls, a soffit, and a dark end at X1. The road inside
 *   is taken as a straight grade between the two lidar readings. The 7th Ave S service road
 *   (way/986034740) ends at the wall at node 9115300946, amenity=parking_entrance,
 *   maxheight 8'2" (2.5 m): a car-park entrance, not a loading dock or truck entrance, so the
 *   wall is not cut there.
 * - Colours from those photos and NAIP, pulled to the palette: pale
 *   limestone and membrane, copper-orange cladding, warm wood soffit and tan
 *   columns, olive green roof, dark solar panels.
 * - Night: the glass lobby and concourse glow (window); the rest is unlit.
 *
 * Estimated: the overhang (the glass line at y ~146, ~23 m behind the roof
 *   edge, from the photos: the drum's front is that line); the soffit's tilt
 *   (11.5 m thick at the glass, meeting it at ~32 m, to a 1 m edge at ~44 m: ~25°) and the edge's lift at the front
 *   corners (3 m), from Antony-22's and Rivera's photos; column
 *   positions (paired, ~25 m apart, from the photos); the side and 8th Ave
 *   facades (few photos: drawn as limestone with grouped glazing on the
 *   Demonbreun concourse and a glazed band elsewhere).
 *   The passage's clearance (~6 m, from the street photos against the signal poles and
 *   people); the passage's lining (the real one is pale stone and a lit ceiling, drawn dark
 *   so it reads as an opening).
 * Doubts: the 8th Ave (west) end and the Korean Veterans Blvd side have no
 *   photo here; the zigzag edges are read from a 1 m aerial (±2 m). ground(y), used only
 *   to place the glazing, runs ~1.5-2 m under the lidar's street along Demonbreun (8.3 m at
 *   the portal against its 6.4), so the lowest glazing starts partly below the street; left
 *   as approved. The road's profile inside the halls is not measured.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { PALETTE } from './palette'
import { type XY, at, poly, ccw, rect, bevel, prism, walls, cap, save, type Layer } from './nash-pinnacle'

// --- lidar heightfields (metres above the base), rows along y, columns along x ---
// exhibit halls: x = -81 + 18i (i 0..9), y = -165 + 12j (j 0..19); column x = -45 is the skylight trench, filled below
const HB: number[][] = [
  [32,33,34,35,36,37,37,37,37,37], [33,33,33,35,35,36,36,36,36,36], [35,33,33,34,35,35,35,36,36,35],
  [36,34,27,33,34,34,35,35,35,35], [37,34,32,33,33,33,34,34,34,34], [37,35,31,32,32,33,33,33,33,33],
  [37,35,29,31,32,32,32,32,32,32], [36,34,31,31,31,32,32,32,32,33], [35,33,27,32,32,33,33,34,34,35],
  [34,33,27,32,33,33,34,35,36,37], [34,32,29,32,33,34,34,35,36,37], [34,33,31,32,32,33,34,35,35,36],
  [37,34,29,31,32,32,33,33,33,34], [40,36,31,31,31,32,32,32,32,33], [43,39,31,32,32,32,33,34,34,35],
  [46,41,29,32,33,33,34,35,36,37], [47,42,31,32,33,34,34,35,36,37], [47,42,31,32,32,33,34,35,36,36],
  [45,42,27,31,32,32,33,34,34,35], [43,41,37,37,37,36,36,36,36,35],
].map((r) => r.map((v, i) => (i === 2 ? (r[1] + r[3]) / 2 : v)))
// the canopy: x = -83 + 18.44i, y = 69 + 14j (j 0..7); the drum's cells (> 45) set to the canopy's 44
const HA: number[][] = [
  [43,41,38,48,48,38,39,48,42,36], [42,41,48,49,48,48,48,48,45,40], [44,43,46,49,49,49,49,49,45,42],
  [44,43,48,49,49,49,49,49,45,43], [44,42,48,49,49,49,49,48,45,44], [43,42,48,48,48,48,48,48,44,43],
  [41,41,41,43,38,41,41,43,43,42], [40,41,42,43,43,43,43,42,42,41],
].map((r) => r.map((v) => (v > 45 ? 44 : Math.max(v, 36))))

/** Bilinear lookup in a grid with origin (x0, y0) and steps dx, dy, clamped. */
function grid(H: number[][], x0: number, dx: number, y0: number, dy: number) {
  return (x: number, y: number) => {
    const fi = Math.min(Math.max((x - x0) / dx, 0), H[0].length - 1.001), fj = Math.min(Math.max((y - y0) / dy, 0), H.length - 1.001)
    const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j
    return (H[j][i] * (1 - u) + H[j][i + 1] * u) * (1 - v) + (H[j + 1][i] * (1 - u) + H[j + 1][i + 1] * u) * v
  }
}
const hB = grid(HB, -81, 18, -165, 12)
const hA = grid(HA, -83, 18.44, 69, 14)
/** The ground above the base along the length (lidar: 0 at 5th Ave, ~17 m at 8th Ave). */
const ground = (y: number) => Math.max(0, 8.5 - 0.0503 * y)

const X0 = -85, X1 = 85, Y0 = -169, YM = 66, Y1 = 169

// 6th Avenue South's passage through the halls (OSM way/471353808, tunnel=yes, layer=-1, at
// y 42-44, its tunnel sidewalks way/471353811 at y ~34 and way/471353810 at y 51-57): the opening
// spans y 31..57. Its road (lidar, above the base) is 8.3 m at the Demonbreun portal (x -86.5) and
// 4.0 m at x 118 past the Loading Dock, taken as a straight grade between; the clearance is ~6 m
// (Mapillary street photos of the portal, estimated).
const PY0 = 31, PY1 = 57, CLEAR = 6.0
const roadZ = (x: number) => 8.3 - ((8.3 - 4.0) * (x + 86.5)) / (118 + 86.5)

// the green-roof fields (NAIP), each split into convex pieces: [x, y]
const GREEN: XY[][] = [
  [[-44, -163], [-16, -163], [-16, -117], [-44, -102]],
  [[-16, -163], [63, -163], [63, -98], [-16, -117]],
  [[-44, -85], [18, -72], [18, -39], [-44, -22]],
  [[18, -72], [63, -84], [63, -25], [18, -39]],
  [[-44, -8], [0, 0], [0, 31], [-44, 51]],
  [[0, 0], [63, -12], [63, 52], [0, 31]],
]

// the ballroom drum (OSM way/464660188, simplified): [x, y]
const DRUM: XY[] = [
  [-55.4, 115.6], [-50.4, 135.4], [-39.2, 145.3], [-23.7, 146.8], [-11.2, 142.7], [1.9, 139.7], [18.3, 139.8], [33.3, 143.6],
  [45.5, 145.5], [53.2, 145.4], [60.5, 142.5], [65.9, 137.8], [70.4, 125.4], [72.5, 109.0], [71.9, 94.3], [70.1, 82.8],
  [65.6, 72.7], [56.5, 66.9], [44.5, 66.0], [32.6, 68.3], [24.1, 71.1], [15.2, 72.1], [3.7, 71.7], [-10.6, 68.3],
  [-26.0, 63.7], [-37.2, 65.4], [-47.8, 73.2], [-53.6, 86.2], [-55.7, 108.5],
]

/** Clip a convex ring to the rectangle [x0,x1] x [y0,y1]. */
function clipRect(r: XY[], x0: number, x1: number, y0: number, y1: number): XY[] {
  const cut = (p: XY[], inside: (q: XY) => boolean, hit: (a: XY, b: XY) => XY) => {
    const out: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      if (inside(a)) out.push(a)
      if (inside(a) !== inside(b)) out.push(hit(a, b))
    }
    return out
  }
  const hx = (X: number) => (a: XY, b: XY): XY => [X, a[1] + ((X - a[0]) / (b[0] - a[0])) * (b[1] - a[1])]
  const hy = (Y: number) => (a: XY, b: XY): XY => [a[0] + ((Y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), Y]
  let p = cut(r, (q) => q[0] >= x0, hx(x0))
  p = cut(p, (q) => q[0] <= x1, hx(x1))
  p = cut(p, (q) => q[1] >= y0, hy(y0))
  return cut(p, (q) => q[1] <= y1, hy(y1))
}

/** Lay a convex ring on the surface h (+ lift), cut into cells so it follows the waves; up or down facing. */
function drape(part: Part, r: XY[], h: (x: number, y: number) => number, lift: number, cx: number, cy: number, up = true) {
  const w = ccw(r)
  const xs = w.map((p) => p[0]), ys = w.map((p) => p[1])
  const gx0 = Math.floor(Math.min(...xs) / cx) * cx, gy0 = Math.floor(Math.min(...ys) / cy) * cy
  for (let x = gx0; x < Math.max(...xs); x += cx) for (let y = gy0; y < Math.max(...ys); y += cy) {
    const c = clipRect(w, x, x + cx, y, y + cy)
    if (c.length < 3) continue
    const v = (p: XY): V3 => [p[0], p[1], h(p[0], p[1]) + lift]
    for (let i = 1; i < c.length - 1; i++) {
      if (up) part.tri(v(c[0]), v(c[i]), v(c[i + 1]))
      else part.tri(v(c[0]), v(c[i + 1]), v(c[i]))
    }
  }
}

/** A wall along a→b from z0(p) to z1(p), in pieces about `step` long, facing outward (to the right of a→b on a ccw ring). */
function wall(part: Part, a: XY, b: XY, z0: (p: XY) => number, z1: (p: XY) => number, step = 12) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step))
  const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
  for (let k = 0; k < n; k++) {
    const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
    const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
    poly(part, [at(p, z0(p)), at(q, z0(q)), at(q, z1(q)), at(p, z1(p))], out)
  }
}

/** Glazed panels on the wall a→b in bays about `bay` wide, each from lo(p) to hi(p), 0.05 m proud. */
function bays(part: Part, a: XY, b: XY, lo: (p: XY) => number, hi: (p: XY) => number, bay: number, pier: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / bay)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nn: XY = [u[1] * 0.05, -u[0] * 0.05], out: V3 = [u[1], -u[0], 0]
  for (let k = 0; k < n; k++) {
    const t0 = (k * L) / n + pier / 2, t1 = ((k + 1) * L) / n - pier / 2
    const p: XY = [a[0] + u[0] * t0 + nn[0], a[1] + u[1] * t0 + nn[1]], q: XY = [a[0] + u[0] * t1 + nn[0], a[1] + u[1] * t1 + nn[1]]
    const m: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], z0 = lo(m), z1 = hi(m)
    if (z1 - z0 > 1.5) poly(part, [at(p, z0), at(q, z0), at(q, z1), at(p, z1)], out)
  }
}

/** A round column (8 sides) of radius r at c, z0..z1. */
function column(part: Part, c: XY, r: number, z0: number, z1: number) {
  const ring: XY[] = Array.from({ length: 8 }, (_, i) => [c[0] + r * Math.cos((i * Math.PI) / 4 + Math.PI / 8), c[1] + r * Math.sin((i * Math.PI) / 4 + Math.PI / 8)])
  walls(part, ring, z0, z1)
}

function build(): Layer[] {
  const stone = new Part()   // limestone walls, the pale roof membrane, the canopy fascia
  const glass = new Part()   // glazing: concourse, lobby (glows at night)
  const copper = new Part()  // the ballroom drum's cladding
  const wood = new Part()    // the canopy soffit and the tan columns
  const green = new Part()   // the green roof
  const dark = new Part()    // solar panels and skylights (dark at night)
  const zero = () => 0

  // --- the exhibit halls: walls up to the waving roof ---
  const hall = ccw(rect(X0, Y0, X1, YM))
  const roof = (p: XY) => hB(p[0], p[1])
  for (let i = 0; i < 4; i++) {
    const a = hall[i], b = hall[(i + 1) % 4]
    if (a[0] !== X0 || b[0] !== X0) { wall(stone, a, b, zero, roof); continue }
    // the Demonbreun wall, cut where 6th Avenue South and its sidewalks pass through
    const [n, f] = a[1] > b[1] ? [PY1, PY0] : [PY0, PY1]
    wall(stone, a, [X0, n], zero, roof)
    wall(stone, [X0, n], [X0, f], zero, () => roadZ(X0) - 0.3)
    wall(stone, [X0, n], [X0, f], () => roadZ(X0) + CLEAR, roof, 30)
    wall(stone, [X0, f], b, zero, roof)
  }
  // the passage, lined right through the hollow hall: side walls facing in, a soffit, and a
  // dark end at X1, where the road runs on under the separate Loading Dock building
  {
    const z0 = (p: XY) => Math.max(0, roadZ(p[0]) - 3), z1 = (p: XY) => roadZ(p[0]) + CLEAR
    wall(dark, [X1, PY0], [X0, PY0], z0, z1, 30)
    wall(dark, [X0, PY1], [X1, PY1], z0, z1, 30)
    poly(dark, [[X0, PY0, z1([X0, 0])], [X1, PY0, z1([X1, 0])], [X1, PY1, z1([X1, 0])], [X0, PY1, z1([X0, 0])]], [0, 0, -1])
    wall(dark, [X1 - 0.2, PY1], [X1 - 0.2, PY0], z0, z1, 30)
  }
  drape(stone, rect(X0, Y0, X1, YM), hB, 0, 17, 11.75)
  for (const g of GREEN) drape(green, g, hB, 0.35, 17, 11.75)
  drape(dark, rect(-50, -163, -44, 55), hB, 0.35, 6, 11.75)
  // glazing: the Demonbreun concourse in two tiers; a ground-floor band on the other sides
  const gz = (p: XY) => ground(p[1])
  const overPortal = (p: XY) => p[1] > PY0 - 4.5 && p[1] < PY1 + 4.5
  bays(glass, [X0, YM], [X0, Y0], (p) => (overPortal(p) ? 99 : gz(p) + 1.2), (p) => gz(p) + 11, 9, 1.6)
  bays(glass, [X0, YM], [X0, Y0], (p) => gz(p) + 12.5, (p) => hB(p[0], p[1]) - 5, 9, 1.6)
  bays(glass, [X1, Y0], [X1, YM], (p) => gz(p) + 1.2, (p) => gz(p) + 7, 12, 4)
  bays(glass, [X0, Y0], [X1, Y0], (p) => gz(p) + 1.2, (p) => gz(p) + 7, 12, 4)

  // --- the 5th Avenue canopy: a deep overhang (~23 m past the glass on the front, ~12 m on the
  // sides), its wood soffit tilting up from ~11.5 m thick at the glass line to a 1 m pale edge,
  // the edge lifting toward the two front corners ---
  const edgeD = (p: XY) => Math.min(Y1 - p[1], p[0] - X0, X1 - p[0])
  const lift = (p: XY) => 3.0 * (Math.abs(p[0]) / 85) ** 2 * Math.max(0, (p[1] - 120) / 49)
  const top = (p: XY) => hA(p[0], p[1]) + lift(p)
  const soffit = (p: XY) => top(p) - (1.0 + 10.5 * Math.min(edgeD(p) / 23, 1))
  const tf = (x: number, y: number) => top([x, y]), sf = (x: number, y: number) => soffit([x, y])
  drape(stone, rect(X0, YM, X1, Y1), tf, 0, 8.5, 8.6)
  drape(wood, rect(X0, YM, X1, Y1), sf, 0, 8.5, 8.6, false)
  const can = ccw(rect(X0, YM, X1, Y1))
  for (let i = 0; i < 4; i++) {
    const a = can[i], b = can[(i + 1) % 4]
    const back = a[1] === YM && b[1] === YM
    wall(stone, a, b, back ? (p) => Math.min(hB(p[0], YM) - 1, soffit(p)) : soffit, top, 8.5)
  }

  // --- under the canopy ---
  // the copper ballroom drum, glazed at its foot, its roof of solar panels rising through the canopy
  const drum = ccw(DRUM)
  walls(glass, drum, 0, 6)
  walls(copper, drum, 6, 48)
  cap(stone, drum, 48)
  {
    const cx = drum.reduce((s, p) => s + p[0], 0) / drum.length, cy = drum.reduce((s, p) => s + p[1], 0) / drum.length
    const inner = drum.map(([x, y]) => [cx + (x - cx) * 0.62, cy + (y - cy) * 0.6] as XY)
    cap(dark, inner, 48.3)
  }
  // the limestone block at the Demonbreun corner and the glass lobby beside it, set back under the
  // overhang on the drum's front line (~y 146), as in the photos
  prism(stone, bevel(rect(-75, 116, -58, 146), 0.4), 0, 33, stone)
  prism(glass, rect(-58, 100, -18, 145), 0, 33, stone)
  // glazing along the Korean Veterans Blvd side, behind the drum
  prism(glass, rect(60, 70, 74, 138), 0, 31, stone)
  // the tan columns, in pairs, along the front and both sides
  for (const x of [-72, -48, -24, 0, 24, 48, 72]) for (const d of [-1.5, 1.5]) column(wood, [x + d, 159], 0.75, 0, soffit([x, 159]))
  for (const sx of [-79, 79]) for (const y of [80, 104, 128, 152]) for (const d of [-1.5, 1.5]) column(wood, [sx, y + d], 0.75, 0, soffit([sx, y]))

  return [
    { part: stone, material: finish('mcc-limestone', 0xddd6c9) },
    { part: glass, material: { ...PALETTE.window, color: 0x8ea6b8 } },
    { part: copper, material: finish('mcc-copper', 0xcf8550) },
    { part: wood, material: finish('mcc-wood', 0x9e6c45) },
    { part: green, material: finish('mcc-green-roof', 0x8f9a6c) },
    { part: dark, material: { ...PALETTE.glass, color: 0x67778a } },
  ]
}

if (import.meta.main) {
  await save('nash-music-city-center', 'Music City Center', build(), {
    bearing: 62.6, height: 48.3, replaces: ['way/107627729', 'way/464660188'],
  }, 6500)
}
