/**
 * Ball Arena (opened 1999 as the Pepsi Center; HOK Sport), Denver — original
 * procedural geometry, CC0-1.0.
 * bun generators/den-ball-arena.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -105.0075777,
 * 39.7486962, the centroid of OSM way/25312645 (the outline, "Ball Arena",
 * wikidata Q795470). Bearing 0: the plan is OSM's as drawn; the bowl is an
 * ellipse whose long axis runs at 71.4° (ENE–WSW).
 *
 * Identity (from the photos below):
 *  1. A big elliptical drum of red brick with a flat, very shallow domed
 *     white roof and a thick dark brim overhanging the wall all round.
 *                                            (newnham, migl2, bartle, mauno)
 *  2. Thin white precast lines over the brick, and on the north-east a row
 *     of tall narrow window columns in the brick.            (migl2, mauno)
 *  3. Lower pinkish-beige precast rings hugging the drum: a solid grooved
 *     one on the west with balconies at its west end, and a colonnade of
 *     beige piers and glass on the south-east.   (newnham, ext2022, herrera)
 *  4. The main entrance: a tall glass wedge on the south-south-west, its
 *     west face five glass bays between dark fins, each topped by a dark
 *     cap tilted up outward, beige piers and a dark canopy over the doors.
 *     A smaller glass entrance block on the east.   (entrance, ext2022, migl2,
 *     barera, mauno)
 *  5. Narrow glass stair towers where the brick meets the beige rings.
 *                                                  (ext2022, migl2, mauno)
 *
 * Plan: the drum is an ellipse fitted to the lidar roof edge (semi-axes
 * 75.5 × 60.5 m, axis 71.4°, centre (-2.4, -3.3)) and to OSM's wall part
 * way/539007389 (74.7 × 59.6, same axis): wall at 74.6 × 59.6, the brim
 * out to 76 × 61. The annexes follow OSM's parts in ellipse coordinates
 * (angle round the ellipse, distance out from it): west ring
 * way/539015596, south-east colonnade way/539012763, main entrance wedge
 * way/539009889 (its tip and faces as drawn, its east edge moved to where
 * the lidar's 27 m roof ends), east entrance way/539012764, stair towers
 * way/539014392 and way/539014393, the north service annex
 * ways/539015600, 539017912 and 539018531, re-cut to the lidar's roofs.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid;
 * ground_min 1580.09 m. y = 0 here is 0.8 m above it, the lowest ground
 * under the footprint (the north loading yard); the east and south
 * plazas are 1.2 m higher (lidar ground 2.0), the west 0.4 m higher. All
 * heights below are model metres (lidar - 0.8), measured:
 *  roof edge 32.7 all round; dome crown 41.4 (profile read every 15° from
 *  the edge inward); entrance wedge 26.2; east entrance 24.8 (lower SE
 *  corner 19.2, drawn at 24.8); west ring 25, its balcony ledge 15.2;
 *  colonnade 23.2; stair towers 25.5; north annex blocks 35.2 and 39.3,
 *  a north-west tower 39.4, its low wing 28.5, a block at 26.8, loading
 *  docks 8.
 * OSM's heights (17–22 m on every part) are well under the lidar and were
 * not used.
 * Estimated from photos scaled to those heights: brim depth 3.7 m and
 * overhang 1.4 m; beige base band 5.5 m; the white lines on the brick; the
 * window columns (8, 2.6 m wide, 9–27.5 m); entrance bays, piers (to
 * 11 m), canopy (5.2–5.8 m), doors; colonnade pier rhythm; balcony band.
 *
 * Photos (evidence, Wikimedia Commons):
 *  ext2022  "Ball Arena exterior 2022.jpg", Troutfarm27, CC BY-SA 4.0
 *           (main entrance and west ring from the south-west)
 *  newnham  "Denver Pepsi Center 1.jpg", KM Newnham, CC BY-SA 2.5
 *           (from the south-west: west ring, brick, main entrance)
 *  migl1    "Denver Pepsi Center IMG 20180416 174616.jpg", Alexander Migl,
 *           CC BY-SA 4.0 (main entrance, south-west)
 *  migl2    "Denver Pepsi Center IMG 20180416 174741.jpg", Alexander Migl,
 *           CC BY-SA 4.0 (main entrance, colonnade beyond)
 *  migl3    "Denver Pepsi Center IMG 20180416 175242.jpg", Alexander Migl,
 *           CC BY-SA 4.0 (far, from the south-west parking)
 *  herrera  "Pepsi Center, Denver.jpg", David Herrera, CC BY 2.0
 *  bartle   "Pepsi Center 2006.jpg", Chris Bartle, CC BY 2.0 (from a tower
 *           to the east, looking west)
 *  mauno    "Pepsi Center 2013.jpg", mark6mauno, CC BY 2.0 (the east
 *           entrance and north-east brick, from the east)
 *  barera   "Pepsi Center July 2007.jpg", Michael Barera, CC BY-SA 4.0
 *           (east entrance)
 *  entrance "Pepsi Center entrance - panoramio.jpg", Alen Ištoković,
 *           CC BY 3.0 (the main entrance's five bays, face on)
 * USGS NAIP orthophoto for the roof colour and the plan. No look-only
 * sources. No commercial imagery.
 *
 * Doubts: which photo looks from which side was worked out from the order
 * of features in each (beige ring - stair tower - brick - main entrance -
 * colonnade) against the OSM plan; mauno and barera could be from the
 * south-east rather than the east. The north service side has no close
 * photo (only bartle, far): its blocks are lidar boxes in plain precast.
 * The west ring's grooves, the signs ("Ball Arena"), the colonnade's
 * trellis brackets and the entrance's glazing grid are left out.
 *
 * Night: the glass entrances, the window columns and the doors are
 * `window` and glow; the brick and brim stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, capPoly, smoothWall, offset, save, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const brick = new Part(), precast = new Part(), dome = new Part(), dark = new Part(), win = new Part(), roof = new Part()

// ── The ellipse: point at angle t (degrees, clockwise from the long axis's
// ENE end) and distance k out from the 72 × 57 reference ellipse.
const C: XY = [-2.6, -3.5], A = 72, B = 57
const br = (71.4 * Math.PI) / 180
const U: XY = [Math.sin(br), Math.cos(br)], W: XY = [Math.sin(br + Math.PI / 2), Math.cos(br + Math.PI / 2)]
const E = (t: number, k: number): XY => {
  const r = (t * Math.PI) / 180, a = (A + k) * Math.cos(r), b = (B + k) * Math.sin(r)
  return [C[0] + a * U[0] + b * W[0], C[1] + a * U[1] + b * W[1]]
}
const tOf = (p: XY) => {
  const dx = p[0] - C[0], dy = p[1] - C[1]
  return (((Math.atan2((dx * W[0] + dy * W[1]) / B, (dx * U[0] + dy * U[1]) / A) * 180) / Math.PI) + 360) % 360
}
const KW = 2.6, KB = 4.4 // wall and brim
const N = 72
const ring = (k: number): XY[] => ccw(Array.from({ length: N }, (_, i) => E((i * 360) / N, k)))
const arc = (t0: number, t1: number, k: (t: number) => number, step = 3): XY[] => {
  const n = Math.max(1, Math.ceil(Math.abs(t1 - t0) / step))
  return Array.from({ length: n + 1 }, (_, i) => { const t = t0 + ((t1 - t0) * i) / n; return E(t, k(t)) })
}
const lin = (pts: [number, number][]) => (t: number) => {
  if (t <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [a, p] = pts[i - 1], [b, q] = pts[i]; return p + ((q - p) * (t - a)) / (b - a) }
  return pts[pts.length - 1][1]
}
/** An annex ring between angles t0..t1, from inside the wall out to kOut(t). */
function sector(p: Part, t0: number, t1: number, kOut: (t: number) => number, z1: number, top: Part | null = roof, kIn = -1) {
  const r = ccw([...arc(t0, t1, kOut), ...arc(t1, t0, () => kIn)])
  prism(p, r, 0, z1, top, 0.3)
  return r
}
/** Chord a→b along the outside of the arc at k between t0 and t1 (outside to the right). */
const chord = (t0: number, t1: number, k: number): [XY, XY] => [E(Math.max(t0, t1), k), E(Math.min(t0, t1), k)]
const L2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ── The drum: beige base, brick, a dark recess under the brim ──
const wallR = ring(KW)
smoothWall(precast, wallR, 0, 5.5)
smoothWall(brick, wallR, 5.5, 28.4)
// the brim: sloped soffit, deep dark fascia
const brimR = ring(KB)
dark.loft([wallR.map(([x, y]) => [x, y, 28.4] as V3), brimR.map(([x, y]) => [x, y, 30.0] as V3)])
smoothWall(dark, brimR, 30.0, 32.7)

// ── The roof: a very shallow dome, smooth-shaded, lidar profile ──
const PROF: [number, number][] = [[1, 32.7], [0.96, 33.2], [0.9, 34.1], [0.8, 36.0], [0.66, 38.0], [0.48, 39.9], [0.26, 41.0], [0, 41.4]]
{
  const a = A + KB, b = B + KB
  const P = (l: number, t: number, z: number): V3 => { const r = (t * Math.PI) / 180; return [C[0] + l * (a * Math.cos(r) * U[0] + b * Math.sin(r) * W[0]), C[1] + l * (a * Math.cos(r) * U[1] + b * Math.sin(r) * W[1]), z] }
  const Nrm = (k: number, t: number): V3 => {
    const [l, z] = PROF[k], kk = Math.min(k, PROF.length - 2), dl = PROF[kk + 1][0] - PROF[kk][0], dz = PROF[kk + 1][1] - PROF[kk][1]
    const r = (t * Math.PI) / 180
    const Tl: V3 = [a * Math.cos(r) * U[0] + b * Math.sin(r) * W[0], a * Math.cos(r) * U[1] + b * Math.sin(r) * W[1], dz / dl]
    const Tt: V3 = [l * (-a * Math.sin(r) * U[0] + b * Math.cos(r) * W[0]), l * (-a * Math.sin(r) * U[1] + b * Math.cos(r) * W[1]), 0]
    if (l < 1e-6) return [0, 0, 1]
    let n: V3 = [Tl[1] * Tt[2] - Tl[2] * Tt[1], Tl[2] * Tt[0] - Tl[0] * Tt[2], Tl[0] * Tt[1] - Tl[1] * Tt[0]]
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    const m = Math.hypot(...n); void z
    return [n[0] / m, n[1] / m, n[2] / m]
  }
  for (let k = 0; k < PROF.length - 1; k++) {
    for (let i = 0; i < N; i++) {
      const t0 = (i * 360) / N, t1 = ((i + 1) * 360) / N
      const a0 = P(PROF[k][0], t0, PROF[k][1]), a1 = P(PROF[k][0], t1, PROF[k][1])
      const b0 = P(PROF[k + 1][0], t0, PROF[k + 1][1]), b1 = P(PROF[k + 1][0], t1, PROF[k + 1][1])
      const n = [Nrm(k, t0), Nrm(k, t1), Nrm(k + 1, t1), Nrm(k + 1, t0)]
      dome.tri(a0, a1, b1, undefined, undefined, undefined, [n[0], n[1], n[2]])
      if (PROF[k + 1][0] > 1e-6) dome.tri(a0, b1, b0, undefined, undefined, undefined, [n[0], n[2], n[3]])
    }
  }
}

// ── West ring: solid beige, a row of ground-floor windows, balconies ──
const westR = sector(precast, 142, 247, () => 5.5, 25)
for (let t = 142; t < 247; t += 6) {
  if (t >= 160 && t < 222) continue
  const [a, b] = chord(t, t + 6, 5.5)
  onWall(win, a, b, rectShape(0.8, L2(a, b) - 0.8, 1.0, 4.0))
}
void westR
sector(precast, 162, 222, () => 8, 15.2)
for (let t = 162; t < 222; t += 6) {
  const [a, b] = chord(t, t + 6, 8)
  onWall(win, a, b, rectShape(0.8, L2(a, b) - 0.8, 11.4, 14.4))
  onWall(win, a, b, rectShape(0.8, L2(a, b) - 0.8, 1.0, 4.0))
}

// ── South-east colonnade: beige piers, glass between, dark trellis edge ──
const kSE = lin([[33, 7.5], [43, 10], [51, 12], [56, 13.6], [63, 15.6], [66, 21.4], [75, 22.7], [86, 23.8], [92, 19], [100, 18]])
sector(precast, 33, 100, kSE, 23.2)
for (let t = 33; t < 100; t += 3) {
  const a = E(t + 3, kSE(t + 3)), b = E(t, kSE(t)), L = L2(a, b)
  onWall(win, a, b, rectShape(0.7, L - 0.7, 1.4, 21.4))
  onWall(dark, a, b, rectShape(0, L, 21.8, 23.2), 0.08)
}

// ── Glass bays with dark fins and tilted caps (the entrances) ──
function glassFace(a: XY, b: XY, bays: number, top: number, ground: number, opts: { piers?: number; canopy?: boolean } = {}) {
  const L = L2(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, d: number): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
  const w = L / bays, glass0 = opts.canopy ? 5.8 : ground + 1
  for (let i = 0; i < bays; i++) {
    const s0 = i * w + 0.35, s1 = (i + 1) * w - 0.35
    onWall(win, a, b, rectShape(s0, s1, glass0, top - 0.2))
    if (opts.canopy) onWall(win, a, b, rectShape(s0 + 0.5, s1 - 0.5, ground, ground + 3.4))
    // the cap: a dark slab tilted up outward over the bay
    const f0 = P(s0, 0.5), f1 = P(s1, 0.5), r0 = P(s0, -3), r1 = P(s1, -3)
    dark.quad([f0[0], f0[1], top + 1.5], [r0[0], r0[1], top], [r1[0], r1[1], top], [f1[0], f1[1], top + 1.5])
    dark.quad([f1[0], f1[1], top + 1.5], [r1[0], r1[1], top], [r0[0], r0[1], top], [f0[0], f0[1], top + 1.5])
    onWall(dark, a, b, rectShape(s0, s1, top - 0.1, top + 1.5), 0.5)
  }
  for (let i = 0; i <= bays; i++) {
    const s = i * w, pierTop = opts.piers ?? 0
    if (pierTop && i > 0 && i < bays) prism(precast, ccw([P(s - 0.8, -0.2), P(s + 0.8, -0.2), P(s + 0.8, 0.9), P(s - 0.8, 0.9)]), 0, pierTop, precast, 0.2)
    const s0 = Math.max(0, s - 0.3), s1 = Math.min(L, s + 0.3)
    prism(dark, ccw([P(s0, -0.2), P(s1, -0.2), P(s1, 0.8), P(s0, 0.8)]), pierTop || ground, top + 1.9, dark, 0.1)
  }
  if (opts.canopy) prism(dark, ccw([P(0.8, 0), P(L - 0.8, 0), P(L - 0.8, 3.2), P(0.8, 3.2)]), 5.2, 5.8, dark, 0.15, true)
}

// ── Main entrance wedge (south-south-west) ──
{
  const W1: XY = [-25.2, -72.6], W2: XY = [-15.3, -103.1], W3: XY = [8.0, -79.2], W4: XY = [16, -77.5], W5: XY = [29, -63]
  const t5 = tOf(W5), t1 = tOf(W1)
  const r = ccw([W1, W2, W3, W4, W5, ...arc(t5, t1, () => -3)])
  prism(precast, r, 0, 26.2, roof, 0.3)
  glassFace(W1, W2, 5, 24.4, 1.2, { piers: 11, canopy: true })
  glassFace(W2, W3, 5, 24.4, 1.2, { piers: 11, canopy: true })
  onWall(win, W4, W5, rectShape(1, L2(W4, W5) - 1, 23.6, 25.4))
}

// ── East entrance block ──
{
  const pts: XY[] = [[69.3, -7.4], [69.4, 6.7], [71.9, 6.7], [72.2, 4.4], [90.4, 4.4], [80.5, -6.1], [81.7, -7.3], [70.9, -19.1], [65.0, -21.8], [63.9, -22.9]]
  const r = ccw(pts)
  prism(precast, r, 0, 24.8, roof, 0.3)
  // the glazed faces: the north face and the two long south-east faces
  glassFace([90.4, 4.4], [72.2, 4.4], 3, 23.2, 1.2)
  glassFace([80.5, -6.1], [90.4, 4.4], 2, 23.2, 1.2)
  glassFace([70.9, -19.1], [81.7, -7.3], 3, 23.2, 1.2)
}

// ── Glass stair towers where the brick meets the beige ──
for (const [t0, t1, k, h] of [[136.5, 142.5, 8.6, 25.5], [327.5, 334.5, 6.8, 25.5]] as const) {
  const r = ccw([...arc(t0, t1, () => k, 2), ...arc(t1, t0, () => 0, 2)])
  prism(win, r, 0, h, dark, 0.2)
}

// ── North service annex (lidar boxes, plain precast) ──
const docks: XY[] = [[23.3, 88.9], [33.1, 85.2], [33.2, 83.3], [36.1, 81.6], [52.7, 72.2], [56.2, 69.2], [60.2, 65.8], [43.3, 60.1], [41.0, 55.5], [37.2, 57.3], [33.0, 58.8], [26.1, 61.0], [20.7, 61.6], [15.6, 76.3], [8.9, 77.9], [-0.5, 78.8], [-11.8, 78.5], [-24.9, 76.2], [-26.2, 83.8], [-3.0, 87.3], [-4.7, 92.7], [10.9, 91.6]]
prism(precast, ccw(docks), 0, 8, roof, 0.3)
prism(precast, ccw([[20.7, 61.6], [26.1, 61], [37.2, 57.3], [41, 55.5], [50.7, 49.5], [47.5, 46.6], [38.4, 52.2], [24.3, 57]]), 0, 8, roof, 0.3)
prism(precast, ccw([[3, 57], [20, 57], [34, 54], [36, 59.5], [22, 62], [20, 77], [10, 77.6], [3, 78.2]]), 0, 26.8, roof, 0.3)
const nHigh: XY[] = ccw([[-38, 62], [-36, 73], [-26, 77], [-12, 79.5], [-4, 80], [3, 78.5], [3, 58], [-12, 55], [-36, 48]])
prism(precast, nHigh, 0, 35.2, roof, 0.3)
prism(precast, ccw([[-13, 63], [1, 63], [1, 79], [-13, 79]]), 35.2, 39.3, roof, 0.3)
sector(precast, 247, 262, () => 13, 28.5)
prism(precast, ccw([[-43, 43], [-34, 43], [-36, 61], [-41, 62], [-45, 57], [-44.5, 47]]), 0, 39.4, roof, 0.3)

// ── The brick's face: window columns on the north-east, louvres, white lines ──
const COLS = Array.from({ length: 8 }, (_, i) => 333.5 + i * 5.4)
const colHalf = 1.6 // degrees ≈ 1.7 m
for (const tc of COLS) {
  const [a, b] = chord(tc - colHalf, tc + colHalf, KW)
  const L = L2(a, b)
  onWall(win, a, b, rectShape(0, L, 10.4, 17.4))
  onWall(win, a, b, rectShape(0, L, 18.0, 25.0))
  onWall(dark, a, b, rectShape(0, L, 1.4, 9.4))
}
for (let t = 121; t < 136; t += 3) {
  const [a, b] = chord(t, t + 3, KW)
  onWall(dark, a, b, rectShape(0.6, L2(a, b) - 0.6, 1.4, 4.8))
}
const inCol = (t: number) => COLS.some((c) => Math.abs(((t - c + 540) % 360) - 180) < colHalf + 0.2)
for (const [t0, t1] of [[318, 375], [100, 137]]) {
  for (let t = t0; t < t1; t += 1.5) {
    if (inCol(t + 0.75)) continue
    const [a, b] = chord(t, t + 1.5, KW)
    for (const z of [12.2, 18.3, 24.4]) onWall(precast, a, b, rectShape(-0.02, L2(a, b) + 0.02, z, z + 0.45), 0.08)
  }
}
void offset; void capPoly

await save('den-ball-arena', 'Ball Arena', [
  { part: brick, material: finish('ball-brick', 0xb2634f) },
  { part: precast, material: finish('ball-precast', 0xe6cfc0) },
  { part: dome, material: finish('ball-roof', 0xd5d8da) },
  { part: dark, material: finish('ball-brim', 0x4f4e4b) },
  { part: win, material: { ...PALETTE.window, color: 0x5b7b7c } },
  { part: roof, material: PALETTE.roof },
], { height: 41.4, anchor: [39.7486962, -105.0075777], bearing: 0 }, 5000)
