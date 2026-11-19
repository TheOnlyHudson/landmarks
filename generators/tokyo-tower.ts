/**
 * Tokyo Tower (東京タワー, officially 日本電波塔), Shiba Park, Minato, Tokyo:
 * procedural, CC0-1.0.
 * bun generators/tokyo-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/tokyo-tower.glb, the low model: solid lattice legs, the shaft as
 *   an open frame of corner columns, belts and X-bracing, the decks, the
 *   mast and FootTown;
 * - models/tokyo-tower.detail.glb, drawn from zoom 16: the same tower with
 *   the frame at twice the density and thinner members.
 *
 * Map frame: x east, y north, z up, metres. Built with its faces on the
 * axes; the placement's bearing (34) turns the legs to OSM's footings at
 * bearings 79, 169, 259 and 348 from the centre. Origin: the centre of the
 * four leg footings, 35.6585914 N, 139.7454504 E; y = 0 is the ground.
 *
 * Completed 1958 (Tachū Naitō with Nikken Sekkei). A 333 m self-supporting
 * steel lattice tower on four legs, painted in aviation white and
 * international orange, with the two-storey Main Deck (floor 125 m above
 * the ground; "150 m" is its height above sea level) and the Top Deck
 * (223.55 m; "250 m" above sea level), standing over the four-storey
 * FootTown building.
 *
 * Identity, in order: the orange-and-white banding (all orange below the
 * Main Deck; above it seven equal bands, orange-white-orange-white-orange-
 * white-orange, from the deck to the tip, as aviation rules require since
 * 1986); the Eiffel-like concave taper on four widely splayed legs with an
 * arch on each face; the broad white Main Deck box; the small Top Deck, the
 * white antenna drum and its orange cap; the slender mast; the warm orange
 * "Landmark Light" at night.
 *
 * Sources:
 *  - OSM (ODbL): the tower and FootTown share one outline, way/30526374,
 *    used by both relation/4247312 (東京タワー, man_made=tower, height 21)
 *    and relation/4247313 (FootTown, 4 levels, height 20), so FootTown is in
 *    the model. The building relation/3915931 groups the parts: the shaft
 *    (way/315657519, 27 m square), the Main Deck (way/313815246, 35 m
 *    across), the Top Deck (way/313815247, 12.4 m across) and the upper
 *    parts way/1244966979-1244966990 (to 332.6 m), way/1245337009-11; the
 *    leg footings way/1244967004-07 (9.5 m pads), 57.5 m from the centre at
 *    bearings 79/169/259/348; the legs and bracing as skillion roofs
 *    (way/1244967008-09, way/1245318714-43) and pyramidal roof relations
 *    (relation/17133569-78). All are in `replaces`.
 *  - Japanese Wikipedia "東京タワー" (read 2026-11): "塔脚の中心を基準とした
 *    塔脚の間隔は88.0メートル" (the legs are 88.0 m apart, centre to centre);
 *    observation decks "地上125メートル（海抜約150メートル）と223.55メートル
 *    （海抜約250メートル）"; the four legs joined in an arch at 40 m above
 *    ground; the cylindrical antenna housing over the Top Deck 13 m across
 *    and 11 m tall; the bands "11等分 ... 1986年に7等分に変更".
 *  - English Wikipedia "Tokyo Tower" (read 2026-11): 333 m architectural,
 *    the antenna 90 m long; Main Deck "150 m" and Top Deck "249.6 m" (the
 *    sea-level figures, as above).
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * 2020_Tokyo_Tower.jpg, Kakidai, CC BY-SA 4.0: distant and level,
 *      nearly face on: the proportions (below).
 *    * Tokyo_Tower_20190406.jpg, Suicasmo, CC BY-SA 4.0: closer, from the
 *      street: the legs, arches and storey belts, the drum and cap.
 *    * Tokyo_Tower_during_daytime.jpg, Laitr Keiows, CC BY-SA 3.0: from the
 *      north-west, slightly above: the bands and decks.
 *    * Tokyo_Tower_as_seen_from_Mori_Tower.jpg, Daniel L. Lu, CC BY-SA 4.0:
 *      from the north-west, far: the silhouette and leg spread.
 *    * Tokyo_Tower_seen_from_Tokyo_Tower-dori_street.jpg and ..._lower_part
 *      ..., Ymblanter, CC BY-SA 4.0: from below: the arches, the bracing.
 *    * Tokyo_Tower,_Tokyo,_20240821_1724_5273.jpg, Jakub Hałun, CC BY 4.0:
 *      FootTown's dark mauve-brown walls.
 *    * Tokyo_Tower_aerial_(52995481796).jpg, Raita Futo, CC BY 2.0, and
 *      Tokyo_Tower_at_night_2.JPG, Kakidai, CC BY-SA 3.0: the Landmark Light.
 *  - No lidar (outside the US). No Google, Apple, Bing or Mapbox imagery,
 *    Street View or 3D tiles were used. No look-only references.
 *
 * Measured on Kakidai's level photo (2.9 px/m; tip at 333 m, Main Deck
 * centre at ~124 m), widths across the face, outer edge to outer edge:
 *    z (m)    25   60   94   118  142  173  204  225 | deck  drum  mast
 *    width   75   48   32   23   20   17   14   12  |  38    14.5  7.5->4
 *  as ratios of the 333 m height: width at 25 m 0.23; at the Main Deck 0.07
 *  (lattice) / 0.11 (deck box); at the Top Deck 0.036; the legs' curve
 *  flattens into the straight upper taper at the Main Deck (~0.37 of the
 *  height); antenna housing and mast from 0.73 of the height (244 m) up,
 *  the thin antenna from 314 m. Band edges in the photo (white 163-197,
 *  orange 250-266, white 266-304, orange 304-333) agree with seven equal
 *  bands of 28.9 m from the deck roof at 131 m.
 *
 * Numbers in the model:
 *  - Published: 333 m; leg centres 88 m apart (outer corner at ±49.5 m,
 *    legs 11 m wide at the foot); Main Deck box 116-131 m round the 125 m
 *    floor; Top Deck 220-232 m round the 223.55 m floor; drum 13 m across,
 *    232-244 m; arches peaking at 40 m.
 *  - Fitted: the half-width to the deck, 45.5 e^(-z/70) + 4 m (49.5 at the
 *    ground, 35.8 at 25 m, 23.2 at 60, 15.9 at 94, 11 at 131: within a metre
 *    of the photo's 37.5/24/16/11.5); above the deck a straight taper from
 *    11 m to 6 m at the Top Deck.
 *  - OSM: deck sizes (the photo's 38 m deck used, OSM 35), FootTown's
 *    outline and 20 m height, the footings' size.
 *  - Estimated from photos: the legs part below 45 m (a belt over the
 *    arches); the arches spring at 8 m; the storey spacing of the frame
 *    (the real one is finer); member sizes (drawn heavier than real so the
 *    frame reads); the orange cap (244-250 m) and mast radii; the lamps;
 *    the footings drawn 4 m high; FootTown's glazed ground floor. OSM's
 *    footings sit 3 m inside the published leg spacing; the published
 *    spacing is used.
 *
 * Night: the Landmark Light, sodium lamps set on the frame, makes the
 * whole lattice glow orange-gold from within (aerial and Kakidai's night
 * photos). The orange steel is `neon-international-orange` and glows in its
 * own colour (a warm `floodlight` on it read a dim brick red); the white
 * steel carries a full warm `floodlight`, which washes it gold rather than
 * white; and the lamps themselves are `lamp-landmark-light` beads at every
 * storey's corners and up the legs, drawn by the map as warm points (by
 * day, in readers that draw them, they are the frame's orange). Deck
 * glazing is `window`; FootTown's windows glow.
 *
 * Doubts:
 *  - The lattice is far simpler than the real one (no secondary bracing,
 *    no antenna dishes or the white spheres on the frame).
 *  - FootTown is a plain mauve-brown block with a glazed ground floor.
 *  - Main and Top Deck heights follow the Japanese article's above-ground
 *    figures; the English "150 m" and "249.6 m" are above sea level.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const TIP = 333
/** Main Deck box (floors at ~120 and 125 m), Top Deck (floor 223.55 m) and the antenna drum. */
const DECK0 = 116, DECK1 = 131, TOP0 = 220, TOP1 = 232, DRUM1 = 244, CAP1 = 250
/**
 * Corner coordinate (half the face width, to the legs' outer edge) at height
 * z. Below the Main Deck a concave exponential fitted to Kakidai's level
 * photo and the published 88 m leg spacing; above it a straight taper.
 */
function H(z: number) {
  if (z <= DECK1) return 45.5 * Math.exp(-z / 70) + 4
  return Math.max(6, 11 - ((z - DECK1) * 5) / (TOP0 - DECK1))
}
/** Above the Main Deck: seven equal bands from its roof to the tip, orange first. */
const BAND0 = DECK1, BAND = (TIP - BAND0) / 7
const isWhite = (z: number) => z > BAND0 && Math.floor((z - BAND0) / BAND) % 2 === 1

type LOD = { legSplit: number; lower: number[]; upperPerBand: number; col: number; beam: number; diag: number; sides: number; k: number; mid: boolean }
const LOW: LOD = { legSplit: 45, lower: [45, 60, 74, 88, 102, 116], upperPerBand: 2, col: 1.5, beam: 0.9, diag: 0.75, sides: 3, k: 16, mid: false }
const DETAIL: LOD = { legSplit: 45, lower: [45, 52.5, 60, 67, 74, 81, 88, 95, 102, 109, 116], upperPerBand: 4, col: 1.1, beam: 0.6, diag: 0.5, sides: 4, k: 24, mid: true }

/** A quad wound to face `out`, with per-corner normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}

/** A straight member from a to b: an open prism of `sides` faces, radius r. */
function member(p: Part, a: V3, b: V3, r: number, sides: number) {
  const t = unit(sub(b, a))
  const m = mul(add(a, b), 0.5)
  let u = sub(unit([m[0], m[1], 0.0001]), mul(t, dot(unit([m[0], m[1], 0.0001]), t)))
  if (Math.hypot(...u) < 1e-6) u = Math.abs(t[2]) < 0.9 ? cross(t, [0, 0, 1]) : cross(t, [1, 0, 0])
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => { const g = (k / sides) * 2 * Math.PI + Math.PI / sides; return add(mul(u, r * Math.cos(g)), mul(v, r * Math.sin(g))) }
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1)
    const g = (q: V3): V3 => [q[0], q[1], Math.max(0, q[2])]
    face(p, [g(add(a, o0)), g(add(a, o1)), g(add(b, o1)), g(add(b, o0))], [unit(o0), unit(o1), unit(o1), unit(o0)])
  }
}

/** A closed prism over a ccw ring from z0 to z1 with top and bottom caps; walls picked by height band. */
function prism(ring: XY[], z0: number, z1: number, pick: (zMid: number) => Part, top: Part | null, bottom: Part | null, cuts: number[] = [], smooth = false) {
  const n = ring.length
  const out = ring.map((p, i) => { const q = ring[(i + 1) % n], l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[1] - p[1]) / l, -(q[0] - p[0]) / l] as XY })
  const vn = (i: number, e: number): V3 => {
    if (!smooth) return [out[e][0], out[e][1], 0]
    const a = out[(i - 1 + n) % n], b = out[i], s = Math.hypot(a[0] + b[0], a[1] + b[1])
    return [(a[0] + b[0]) / s, (a[1] + b[1]) / s, 0]
  }
  const zs = [z0, ...cuts.filter((z) => z > z0 + 0.01 && z < z1 - 0.01), z1]
  for (let k = 0; k < zs.length - 1; k++) {
    const part = pick((zs[k] + zs[k + 1]) / 2)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = ring[i], b = ring[j], na = vn(i, i), nb = vn(j, i)
      part.tri([a[0], a[1], zs[k]], [b[0], b[1], zs[k]], [b[0], b[1], zs[k + 1]], undefined, undefined, undefined, [na, nb, nb])
      part.tri([a[0], a[1], zs[k]], [b[0], b[1], zs[k + 1]], [a[0], a[1], zs[k + 1]], undefined, undefined, undefined, [na, nb, na])
    }
  }
  if (top) for (let i = 1; i < n - 1; i++) top.tri([ring[0][0], ring[0][1], z1], [ring[i][0], ring[i][1], z1], [ring[i + 1][0], ring[i + 1][1], z1])
  if (bottom) for (let i = 1; i < n - 1; i++) bottom.tri([ring[0][0], ring[0][1], z0], [ring[i + 1][0], ring[i + 1][1], z0], [ring[i][0], ring[i][1], z0])
}

const circle = (r: number, n: number): XY[] => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n)] as XY)
/** A square of half-width h with corners chamfered by c, ccw. */
const chamfered = (h: number, c: number): XY[] => [[h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h]]

/** A tapering round section (frustum) with colour by band, no caps. */
function frustum(pick: (z: number) => Part, r0: number, r1: number, z0: number, z1: number, n: number, cuts: number[]) {
  const zs = [z0, ...cuts.filter((z) => z > z0 && z < z1), z1]
  for (let k = 0; k < zs.length - 1; k++) {
    const ra = r0 + ((r1 - r0) * (zs[k] - z0)) / (z1 - z0), rb = r0 + ((r1 - r0) * (zs[k + 1] - z0)) / (z1 - z0)
    const part = pick((zs[k] + zs[k + 1]) / 2)
    const nz = (ra - rb) / (z1 - z0)
    for (let s = 0; s < n; s++) {
      const a0 = (2 * Math.PI * s) / n, a1 = (2 * Math.PI * (s + 1)) / n
      const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
      const N = (a: number): V3 => unit([Math.cos(a), Math.sin(a), nz])
      part.tri(P(ra, a0, zs[k]), P(ra, a1, zs[k]), P(rb, a1, zs[k + 1]), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      if (rb > 1e-6) part.tri(P(ra, a0, zs[k]), P(rb, a1, zs[k + 1]), P(rb, a0, zs[k + 1]), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
}

// FootTown: OSM way/30526374 in the model frame (turned -34°).
const FOOTTOWN: XY[] = [[37.7, 22.3], [-38.5, 21.8], [-38.9, -23.8], [16.2, -23.9], [16.2, -27.3], [19.6, -30.2], [37.6, -29.8]]

function build(s: LOD) {
  const orange = new Part(), white = new Part(), glass = new Part(), roof = new Part(), base = new Part(), lamp = new Part()
  const steel = (z: number) => (isWhite(z) ? white : orange)
  const bandCuts = Array.from({ length: 6 }, (_, i) => BAND0 + BAND * (i + 1))
  const C = [[1, 1], [-1, 1], [-1, -1], [1, -1]] as const // corners ccw from NE

  // The legs below the split: solid tapering lattice columns, each from the
  // outer corner in by its own width (11 m at the foot, 8 m at the split).
  const legW = (z: number) => 11 - (3 * z) / s.legSplit
  const steps = s.k >= 24 ? 8 : 5
  for (const [sx, sy] of C) {
    const rings: V3[][] = []
    for (let k = 0; k <= steps; k++) {
      const z = (s.legSplit * k) / steps, o = H(z), i = o - legW(z)
      let r: V3[] = [[i * sx, i * sy, z], [o * sx, i * sy, z], [o * sx, o * sy, z], [i * sx, o * sy, z]]
      if (sx * sy < 0) r = r.reverse()
      rings.push(r)
    }
    orange.loft(rings)
    orange.cap(rings[steps], true)
    // the footing under it (OSM way/1244967004-07)
    const fx = 44 * sx, fy = 44 * sy
    prism([[fx - 4.75, fy - 4.75], [fx + 4.75, fy - 4.75], [fx + 4.75, fy + 4.75], [fx - 4.75, fy + 4.75]], 0, 4, () => base, base, null)
  }
  // An arch on each face between the legs, and the belt over it.
  for (let f = 0; f < 4; f++) {
    const rot = (f * Math.PI) / 2
    const place = (t: number, z: number, inset: number): V3 => { const d = H(z) - inset; return [d * Math.cos(rot) - t * Math.sin(rot), d * Math.sin(rot) + t * Math.cos(rot), z] }
    const SEG = s.k >= 24 ? 14 : 10, SPRING = 8, APEX = 40
    const span = H(SPRING) - legW(SPRING) + 0.5
    const sec: V3[][] = []
    for (let k = 0; k <= SEG; k++) {
      const a = (Math.PI * k) / SEG, t = -Math.cos(a) * span, z = SPRING + Math.sin(a) * (APEX - SPRING)
      const half = 1.3
      sec.push([place(t, z - half, 2.6), place(t, z - half, 0.4), place(t, z + half, 0.4), place(t, z + half, 2.6)])
    }
    orange.sweep(sec)
  }

  // The shaft above the split: corner columns, a belt at every storey and
  // X-bracing in every face; a centre post and mid-height struts in detail.
  const corner = (c: readonly [number, number], z: number): V3 => [c[0] * H(z), c[1] * H(z), z]
  const midFace = (f: number, z: number, t = 0): V3 => {
    const a = C[f], b = C[(f + 1) % 4], h = H(z)
    return [((a[0] + b[0]) / 2 + ((b[0] - a[0]) / 2) * t) * h, ((a[1] + b[1]) / 2 + ((b[1] - a[1]) / 2) * t) * h, z]
  }
  const storeys = (lv: number[]) => {
    for (let k = 0; k < lv.length - 1; k++) {
      const z0 = lv[k], z1 = lv[k + 1], part = steel((z0 + z1) / 2)
      for (let f = 0; f < 4; f++) {
        const a = C[f], b = C[(f + 1) % 4]
        member(part, corner(a, z0), corner(a, z1), s.col, 4)
        member(steel(z1), corner(a, z1), corner(b, z1), s.beam, s.sides)
        member(part, corner(a, z0), corner(b, z1), s.diag, s.sides)
        member(part, corner(b, z0), corner(a, z1), s.diag, s.sides)
        if (s.mid) member(part, midFace(f, z0), midFace(f, z1), s.diag, s.sides)
      }
    }
  }
  // the belt at the split, tying the legs
  for (let f = 0; f < 4; f++) member(orange, corner(C[f], s.legSplit), corner(C[(f + 1) % 4], s.legSplit), s.beam * 1.4, s.sides)
  storeys(s.lower)
  // the frame under the Main Deck, between the deck's floor and its roof
  storeys([DECK0, DECK1])
  const upper: number[] = [DECK1]
  for (let z = DECK1 + BAND / s.upperPerBand; z < TOP0 - 2; z += BAND / s.upperPerBand) upper.push(z)
  upper.push(TOP0)
  storeys(upper)

  // The Landmark Light's lamps: a bead just inside each corner of the frame
  // at every storey, and up the legs' inner edges. (The elevator shafts are
  // left out: drawn as a core they read as a pole the photos don't show.)
  const bead = (q: V3, r: number) => {
    const P: V3[] = [[q[0] + r, q[1], q[2]], [q[0], q[1] + r, q[2]], [q[0] - r, q[1], q[2]], [q[0], q[1] - r, q[2]], [q[0], q[1], q[2] + r], [q[0], q[1], q[2] - r]]
    for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; lamp.tri(a, b, P[4]); lamp.tri(b, a, P[5]) }
  }
  const inset = (c: readonly [number, number], z: number, d: number): V3 => [c[0] * (H(z) - d), c[1] * (H(z) - d), z]
  for (const z of [...s.lower, ...upper]) for (const c of C) bead(inset(c, z, 2.2), 1.6)
  for (const z of [10, 22, 34]) for (const c of C) bead(inset(c, z, legW(z) + 0.9), 1.6)

  // Main Deck (OSM way/313815246, 35 m; the photo 38 m): a white frame
  // round two glass storeys.
  prism(chamfered(18, 4.5), DECK0, DECK1, (z) => (z > DECK0 + 2.5 && z < DECK1 - 2 ? glass : white), roof, white, [DECK0 + 2.5, DECK1 - 2])
  // Top Deck (OSM way/313815247, 12.4 m), glazed, and over it the white
  // antenna drum (13 m across, 11 m tall) under its orange cap.
  prism(chamfered(6.6, 1.6), TOP0, TOP1, (z) => (z > TOP0 + 1.5 && z < TOP1 - 1.5 ? glass : white), null, white, [TOP0 + 1.5, TOP1 - 1.5])
  prism(circle(6.5, s.k), TOP1, DRUM1, () => white, null, white, [], true)
  prism(circle(6.8, s.k), DRUM1, CAP1, () => orange, roof, orange, [], true)

  // The mast (photo: ~7.5 m wide at its foot, 4 m at 300 m), in its bands,
  // then the thin antenna from 314 m.
  frustum(steel, 3.7, 2.0, CAP1, 314, Math.max(8, s.k / 2), bandCuts)
  prism(circle(2.0, Math.max(8, s.k / 2)), 314, 314.4, () => orange, orange, null, [], true)
  frustum(() => orange, 0.7, 0.15, 314, TIP, 8, [])

  // FootTown, the four-storey building under the tower: dark mauve-brown
  // walls (Hałun's photo; OSM building:colour #AB6B83), glazed at street level.
  prism(FOOTTOWN, 0, 20, (z) => (z < 5 ? glass : base), roof, null, [5])

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: orange, material: finish('neon-international-orange', 0xea6a36, 0.7) },
    { part: white, material: { ...finish('aviation-white', 0xf3f0ea, 0.7), floodlight: () => 0.95 } },
    { part: lamp, material: finish('lamp-landmark-light', 0xd9663c, 0.7) },
    { part: glass, material: { ...PALETTE.window, color: 0x9aabb9 } },
    { part: roof, material: PALETTE.roof },
    { part: base, material: finish('foottown-brown', 0x9a7c80) },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tokyo Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 34, elevation: 0, height: TIP,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')}), ${glb.length} bytes`)
}

await write('tokyo-tower.glb', build(LOW), 6500, 250_000)
await write('tokyo-tower.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
