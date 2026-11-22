/**
 * Salt Lake City Public Library, Main Library (2003, Moshe Safdie with
 * VCBO Architecture), 210 E 400 S, Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-public-library.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of OSM way/33194160 (-111.8844382, 40.7599917). The plan
 * is written in OSM coordinates about (-111.88412, 40.75994) and shifted by
 * (+26.83, -5.72) at the end. y = 0 is the lowest ground the building
 * touches, the 200 East sidewalk on the west (lidar ground 4.1 m above the
 * crop's minimum); Library Square's plaza, east of it, is 3.2 m higher
 * (lidar), so everything facing the plaza starts at z = 3.2.
 *
 * Form, from the OSM parts (way/1319653044 to 1319653056), NAIP and the
 * photos:
 *  - the six-storey west block along 200 East, a stone grid of punched
 *    windows;
 *  - the triangular main library behind it, its long south-east side the
 *    curved glass "lens" wall facing the plaza, its roof a garden;
 *  - the glass-roofed atrium (the "urban room") along its north-east side;
 *  - the crescent wall wrapping the plaza, a stone frame of storey-high
 *    openings whose top slopes from the roof garden at the north-west end
 *    down to the plaza at the south tip (the walkable ramp);
 *  - the low grey drum with the dipped (butterfly) roof outside the
 *    crescent to the north-east.
 *
 * Heights, lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013, after
 * the 2003 opening), above the 200 East sidewalk: west block 30.9; the
 * strips between it and the triangle 23.9; the main triangle's roof garden
 * 27.9, its lens edge 23.4; the atrium roof 25-27; the crescent's top from
 * 28.9 at the north-west end down to about 8.5 at the south tip (measured
 * along the arc); the drum 7.9 in the middle, 10.9 at its raised ends.
 * Storey lines every 4.6 m on the crescent and lens (estimated from p3 and
 * p1). Left out: the rooftop railings, the stair tower's diagonal bracing,
 * the café fronts in the crescent's base.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Library_(1).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (an end of the west block with the stair
 *     tower and the atrium's glass end; which end is not certain)
 *  p2 https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Library_(2).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the crescent's outer face beside the drum)
 *  p3 https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Library_(3).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the crescent and the drum's dipped roof, from the north-east)
 *  pL https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Public_Library_(43837696972).jpg
 *     Ben P L from Provo, CC BY-SA 2.0 (the lens and the crescent's inner face, from the plaza)
 * Doubts: the triangle's roof garden terraces are drawn as one level; the
 * west block's west face is unphotographed (drawn like its south end).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { poly, prism, opening, ngon, type XY } from './slc-cathedral-of-the-madeleine'

const stone = new Part(), win = new Part(), lens = new Part(), glass = new Part(), drum = new Part(), garden = new Part()
const P0 = 3.2

/** Flat panels along a polyline face, between z0 and z1, one per bay of about `bay` metres. */
function bandPanels(p: Part, pts: XY[], out: 1 | -1, z0: number, z1: number, bay: number, gap = 0.9) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], L = Math.hypot(bx - ax, by - ay)
    const t: XY = [(bx - ax) / L, (by - ay) / L], n: XY = [out * t[1], -out * t[0]]
    const k = Math.max(1, Math.round(L / bay)), w = L / k
    for (let j = 0; j < k; j++) opening(p, [ax + t[0] * (j + 0.5) * w, ay + t[1] * (j + 0.5) * w], t, n, w - gap, z0, z1, 'flat', 0.06)
  }
}
const resample = (pts: XY[], n: number): XY[] => {
  const d = [0]
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    const s = (k / (n - 1)) * d[d.length - 1]
    let i = 1
    while (i < d.length - 1 && d[i] < s) i++
    const u = (s - d[i - 1]) / (d[i] - d[i - 1])
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u])
  }
  return out
}

// ---------------------------------------------------- the west block ---
prism(stone, [[-73.2, -32.6], [-62.3, -32.4], [-62.3, 26.2], [-62.4, 30.1], [-73.4, 29.9]], 0, 30.9, false)
poly(PART_ROOF(), [[-73.2, -32.6, 30.9], [-62.3, -32.4, 30.9], [-62.4, 30.1, 30.9], [-73.4, 29.9, 30.9]], [0, 0, 1])
for (const z of [[4.0, 12.6], [13.6, 21.4], [22.4, 29.6]]) {
  bandPanels(win, [[-73.4, 29.9], [-73.2, -32.6]], 1, z[0], z[1], 3.6, 1.2)
  bandPanels(win, [[-73.2, -32.6], [-62.3, -32.4]], 1, z[0] + P0 * 0, z[1], 3.6, 1.2)
  bandPanels(win, [[-62.4, 30.1], [-73.4, 29.9]], 1, z[0], z[1], 3.6, 1.2)
}
// the strips between it and the triangle (four storeys)
for (const ring of [
  [[-62.3, -32.4], [-57.8, -32.3], [-58.8, 24.6], [-59.8, 26.2], [-62.2, 26.2]],
  [[-58.8, 24.6], [-45.5, 32.8], [-50.6, 35.6], [-60.2, 40.6], [-59.8, 26.2]],
] as XY[][]) {
  prism(stone, ring, 0, 23.9, false)
  poly(PART_ROOF(), ring.map(([x, y]) => [x, y, 23.9] as V3), [0, 0, 1])
}
bandPanels(win, [[-62.3, -32.4], [-57.8, -32.3]], 1, P0 + 1, 22.6, 4.5, 0.6)

// ------------------------------------------------ the main triangle ---
// the curved lens wall, south-west to north-east
const LENS: XY[] = [[-57.8, -32.3], [-50.7, -30.4], [-43.8, -28.2], [-37.5, -25.4], [-32.2, -22.8], [-27.5, -20.2], [-22.3, -17.2], [-16.8, -13.6], [-11.5, -9.5], [-6.5, -4.9], [-1.5, 0.0], [2.7, 4.6], [3.9, 5.5]]
{
  const tri: XY[] = [[-58.8, 24.6], ...LENS, [-45.5, 32.8]]
  prism(stone, tri, 0, 23.4, false)
  // the lens: light reflective glass with pale floor lines
  bandPanels(lens, LENS, 1, P0 + 0.2, 23.0, 30, 0.0)
  for (let z = P0 + 4.6; z < 23; z += 4.6) bandPanels(stone, LENS, 1, z - 0.18, z + 0.18, 30, 0.0)
  poly(stone, tri.map(([x, y]) => [x, y, 23.4] as V3), [0, 0, 1])
  // the higher roof garden, set back about 10 m from the lens
  const inner: XY[] = [[-58.5, 24.6], [-56.0, -20.0], [-40.0, -15.5], [-25.0, -7.5], [-12.0, 3.0], [-3.0, 11.0], [-45.5, 32.8]]
  prism(stone, inner, 23.4, 27.9, false)
  poly(garden, inner.map(([x, y]) => [x, y, 27.9] as V3), [0, 0, 1])
  bandPanels(lens, inner.slice(1, 6), 1, 23.8, 27.4, 30, 0.0)
}

// --------------------------------------------------- the atrium roof ---
{
  // glazed, sloping down from the triangle (27) to the crescent (25)
  const A: XY[] = [[8.6, 10.1], [4.5, 15.7], [-1.3, 21.7], [-6.3, 25.6], [-9.6, 28.3], [-17.4, 33.4], [-27.1, 38.0], [-34.2, 40.8], [-40.8, 42.4], [-49.9, 44.3]]
  const B: XY[] = [[3.9, 5.5], [-3.0, 11.0], [-12.0, 18.0], [-22.7, 20.2], [-32.7, 25.7], [-45.5, 32.8], [-50.6, 35.6]]
  const a = resample(A, 12), b = resample(B, 12)
  for (let i = 0; i < 11; i++) {
    const q: V3[] = [[b[i][0], b[i][1], 26.8], [b[i + 1][0], b[i + 1][1], 26.8], [a[i + 1][0], a[i + 1][1], 25.0], [a[i][0], a[i][1], 25.0]]
    poly(glass, q, [0, 0, 1])
  }
  // its glass ends: the south-east one beside the lens, above the plaza
  poly(lens, [[3.9, 5.5, P0], [8.6, 10.1, P0], [8.6, 10.1, 25.0], [3.9, 5.5, 26.8]], [1, -1, 0])
}

// ------------------------------------------------ the crescent wall ---
{
  const OUT: XY[] = [[-54.6, 49.9], [-43.1, 48.4], [-32.2, 45.6], [-21.5, 41.9], [-11.2, 37.1], [-2.1, 31.2], [5.0, 25.3], [10.9, 19.3], [15.9, 14.0], [20.1, 8.0], [23.8, 0.4], [28.9, -11.9], [31.8, -23.4], [33.7, -35.2], [34.0, -39.9], [34.0, -44.3], [32.8, -55.9], [30.4, -66.1], [28.2, -71.9], [26.0, -77.8], [20.0, -88.8]]
  const IN: XY[] = [[-55.0, 44.5], [-49.9, 44.3], [-40.8, 42.4], [-34.2, 40.8], [-27.1, 38.0], [-17.4, 33.4], [-9.6, 28.3], [-6.3, 25.6], [-1.3, 21.7], [4.5, 15.7], [8.6, 10.1], [13.3, 4.1], [17.1, -2.6], [19.6, -7.5], [22.1, -13.5], [24.3, -19.8], [26.0, -26.3], [27.1, -33.0], [27.6, -39.3], [27.7, -44.3], [27.7, -49.1], [26.7, -59.0], [24.7, -68.3], [21.5, -77.1], [16.4, -86.5]]
  const N = 34, o = resample(OUT, N), i_ = resample(IN, N)
  const top = (k: number) => 28.9 - (28.9 - 8.5) * (k / (N - 1))
  const zb = (k: number) => (k < 6 ? 0 : P0) // the north-west end stands on the lower street
  for (let k = 0; k < N - 1; k++) {
    const [ao, bo, ai, bi] = [o[k], o[k + 1], i_[k], i_[k + 1]]
    const z0 = top(k), z1 = top(k + 1)
    poly(stone, [[ao[0], ao[1], 0], [bo[0], bo[1], 0], [bo[0], bo[1], z1], [ao[0], ao[1], z0]], [-(bo[1] - ao[1]), bo[0] - ao[0], 0])
    poly(stone, [[bi[0], bi[1], 0], [ai[0], ai[1], 0], [ai[0], ai[1], z0], [bi[0], bi[1], z1]], [bi[1] - ai[1], -(bi[0] - ai[0]), 0])
    // the walkable top
    poly(stone, [[ao[0], ao[1], z0], [bo[0], bo[1], z1], [bi[0], bi[1], z1], [ai[0], ai[1], z0]], [0, 0, 1])
    // storey-high openings in the stone frame, two to a bay, on both faces
    for (const [a, b, s] of [[ao, bo, 1], [bi, ai, 1]] as [XY, XY, 1][]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-s * t[1], s * t[0]]
      const zt = Math.min(z0, z1) - 1.2
      for (let z = (a === ao ? zb(k) : P0) + 0.6; z + 3.4 < zt; z += 4.6) {
        for (const f of [0.27, 0.73]) opening(win, [a[0] + t[0] * L * f, a[1] + t[1] * L * f], t, n, L * 0.42, z, z + 3.6, 'flat', 0.06)
      }
    }
  }
  // the two ends
  const e0: V3[] = [[o[0][0], o[0][1], 0], [i_[0][0], i_[0][1], 0], [i_[0][0], i_[0][1], top(0)], [o[0][0], o[0][1], top(0)]]
  poly(stone, e0, [-1, 0, 0])
  const e1: V3[] = [[o[N - 1][0], o[N - 1][1], 0], [i_[N - 1][0], i_[N - 1][1], 0], [i_[N - 1][0], i_[N - 1][1], top(N - 1)], [o[N - 1][0], o[N - 1][1], top(N - 1)]]
  poly(stone, e1, [-0.3, -1, 0])
}

// --------------------------------------------------------- the drum ---
{
  const cx = 16.9, cy = 30.9, r = 11.3, n = 16
  const ring = ngon(cx, cy, r, 0, n, 0)
  const zt = (p: V3) => {
    const a = Math.atan2(p[1] - cy, p[0] - cx) - (3 * Math.PI) / 4
    return P0 + 3.6 + 4.9 * Math.abs(Math.cos(a)) ** 1.5
  }
  for (let k = 0; k < n; k++) {
    const a = ring[k], b = ring[(k + 1) % n]
    drum.quad(a, b, [b[0], b[1], zt(b)], [a[0], a[1], zt(a)])
  }
  // the dipped roof: a ridge-less saddle, as a fan from the centre at the low line
  const c: V3 = [cx, cy, P0 + 4.4]
  for (let k = 0; k < n; k++) {
    const a = ring[k], b = ring[(k + 1) % n]
    poly(drum, [c, [a[0], a[1], zt(a)], [b[0], b[1], zt(b)]], [0, 0, 1])
  }
  // the link to the crescent
  prism(stone, [[10.9, 19.3], [12.4, 20.9], [6.6, 26.7], [5.0, 25.3]], 0, P0 + 4.5, true)
}

// ---------------------------------------------------- shift and output ---
function PART_ROOF() { return stone }
const parts = [stone, win, lens, glass, drum, garden]
for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += 26.83; p.pos[i + 2] += 5.72 }
const out = [
  { part: stone, material: finish('slcpl-stone', 0xd8ccb8) },
  { part: win, material: PALETTE.window },
  { part: lens, material: windowVariant(2, 0xa9bfd1) },
  { part: glass, material: PALETTE.glass },
  { part: drum, material: finish('slcpl-grey-panels', 0xbfc3c6) },
  { part: garden, material: finish('slcpl-roof-garden', 0xa3b08f) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Salt Lake City Public Library', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 30.9,
})
await Bun.write(new URL('../models/slc-public-library.glb', import.meta.url), glb)
console.log(`slc-public-library.glb: ${triangles} triangles, ${glb.length} bytes`)
