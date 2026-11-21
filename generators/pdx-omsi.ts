/**
 * Oregon Museum of Science and Industry (1992, Zimmer Gunsul Frasca, round
 * the 1940s Station L power plant), Portland, Oregon: procedural, CC0-1.0,
 * no textures.
 * bun generators/pdx-omsi.ts
 *
 * The museum on the east bank of the Willamette: long, flat-roofed blocks of
 * buff brick round a paved entrance plaza, with four things that mark it
 * from far off: the glass entrance cube under its grey pyramid roof at the
 * hinge of the two wings, the drum of the OMNIMAX theatre with its ribbed
 * grey dome in the south wing, the buff brick drum of the Kendall
 * Planetarium in the north wing, and the red-painted smokestack of Station
 * L, whose turbine hall runs along the river side under a pitched roof with
 * a red monitor along its ridge.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/57903098. z = 0 is the lowest ground in the plan's
 * box, at the river bank; the plaza and the building's ground are 8.8 m
 * higher (Mapterhorn, `tools/terrain.ts check`), and every height below is
 * measured from the plaza and lifted by that much.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/57903098 (height 36.6,
 *   taken as the smokestack's top). The plan of the parts inside it (the
 *   turbine hall, the planetarium, the stack, the entrance cube, the
 *   OMNIMAX drum) is read from the NAIP orthophoto.
 * - USGS NAIP orthophoto (public domain): the plan and roof colours.
 * - Photos (evidence, Wikimedia Commons):
 *   - M.O. Stevens, "OMSI entrance outside - Portland, Oregon.JPG",
 *     CC BY-SA 3.0 (the glass cube and pyramid, the brick wings, windows):
 *     https://commons.wikimedia.org/wiki/File:OMSI_entrance_outside_-_Portland,_Oregon.JPG
 *   - Gary Halvorson, Oregon State Archives, "Oregon Museum of Science and
 *     Industry, Willamette River, Portland - DPLA - 9e61db74...jpg", CC BY 4.0
 *     (the planetarium drum and the red stack, the brick colour):
 *     https://commons.wikimedia.org/wiki/File:Oregon_Museum_of_Science_and_Industry,_Willamette_River,_Portland_-_DPLA_-_9e61db74e86b2daddb8b66feb019644d.jpg
 *   - M.O. Stevens, "OMSI OMNIMAX exterior - Portland, Oregon.JPG",
 *     CC BY-SA 3.0 (the OMNIMAX drum and ribbed dome over the south wing):
 *     https://commons.wikimedia.org/wiki/File:OMSI_OMNIMAX_exterior_-_Portland,_Oregon.JPG
 *
 * Numbers (no lidar used)
 * - Published (OSM): 36.6 m, the stack's top.
 * - Estimated from the photos, scaled to three storeys of brick: the
 *   wings 14 m; the cube 24 m, its pyramid to 33 m; the planetarium drum
 *   17 m; the OMNIMAX drum 21 m, dome to 28 m; the turbine hall's eaves 18 m
 *   and ridge 23 m.
 * - Measured on NAIP: the drums (planetarium 22.8 m across, OMNIMAX 28.8 m),
 *   the cube (20.4 m square), the stack (4.2 m), the turbine hall (26 m wide).
 * - Left out: the glass canopies along the plaza, the banners, the
 *   solar panels, the USS Blueback (a separate OSM building, way/58156982).
 *
 * Note: the assignment described a copper-green planetarium dome; the
 * photos show the planetarium as a flat-topped brick drum and the only dome
 * as the OMNIMAX's grey one. The model follows the photos.
 *
 * Doubts
 * - The turbine hall's river side and roof heights are not photographed.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())

/** Ear clipping for a simple counter-clockwise ring. */
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some(j => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) for (const [a, b, c] of triangulate(r)) p.tri([r[a][0], r[a][1], z1], [r[b][0], r[b][1], z1], [r[c][0], r[c][1], z1])
}
const ngon = (cx: number, cy: number, r: number, n: number): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)] as XY)
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function panel(p: Part, a: XY, t: XY, n: XY, w: number, z0: number, z1: number, off = 0.06) {
  const at = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * off, a[1] + t[1] * s + n[1] * off, z]
  p.quad(at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1))
}
/** A dome (half ellipsoid) of radius r and height h, n round, m up. */
function dome(p: Part, cx: number, cy: number, z0: number, r: number, h: number, n = 16, m = 4) {
  const ring = (k: number): V3[] => {
    const a = (k / m) * (Math.PI / 2), rr = r * Math.cos(a), z = z0 + h * Math.sin(a)
    return Array.from({ length: n }, (_, i) => [cx + rr * Math.cos((2 * Math.PI * i) / n), cy + rr * Math.sin((2 * Math.PI * i) / n), z] as V3)
  }
  for (let k = 0; k < m; k++) {
    const A = ring(k), B = ring(k + 1)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (k === m - 1) p.tri(A[i], A[j], B[i])
      else p.quad(A[i], A[j], B[j], B[i])
    }
  }
}

// ------------------------------------------------------------ the model ---
const brick = new Part(), roof = new Part(), win = new Part(), metal = new Part(), red = new Part(), hall = new Part()

// OSM way/57903098 in this frame
const OUTLINE: XY[] = [[-40.1, 93.2], [-40.3, 80.5], [-59.6, 75.5], [-65.0, 74.1], [-56.0, 41.0], [-61.5, 39.7], [-55.8, 17.6], [-50.1, 19.0], [-45.0, -0.3], [-44.4, -2.2], [-24.0, 3.5], [-22.6, -0.6], [-16.9, -0.3], [-16.9, -10.0], [-8.1, -10.0], [-8.1, -41.3], [-3.4, -41.2], [-3.4, -64.3], [1.4, -64.4], [1.3, -82.2], [17.8, -82.5], [17.8, -100.9], [47.2, -100.7], [47.9, -40.0], [54.0, -40.1], [55.5, -38.9], [56.5, -37.5], [56.9, -36.3], [56.8, -34.3], [56.1, -32.5], [54.8, -31.5], [53.9, -31.0], [52.8, -30.7], [46.5, -30.7], [46.6, -27.2], [61.0, -27.2], [60.8, 5.1], [19.6, 5.3], [19.6, 0.3], [2.9, 0.5], [2.9, 10.2], [-7.2, 10.3], [-6.9, 38.2], [-1.9, 38.2], [-1.9, 61.2], [-3.3, 61.2], [-3.3, 92.4], [-10.3, 92.6], [-10.2, 97.2], [-33.9, 97.3], [-33.9, 93.2]]
const WING = 14
prism(brick, OUTLINE, 0, WING - 0.7, false)
prism(metal, OUTLINE.map(([x, y]) => [x, y] as XY), WING - 0.7, WING, false)   // the coping
{
  const r = ccw(OUTLINE)
  for (const [a, b, c] of triangulate(r)) roof.tri([r[a][0], r[a][1], WING], [r[b][0], r[b][1], WING], [r[c][0], r[c][1], WING])
  // a band of square windows along each long wall, upper floor (photos)
  for (let i = 0; i < r.length; i++) {
    const A = r[i], B = r[(i + 1) % r.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L < 14) continue
    const t: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: XY = [t[1], -t[0]]
    const nWin = Math.floor((L - 6) / 7)
    if (A[0] < -38 && B[0] < -38) continue     // the turbine hall's side
    for (let k = 0; k < nWin; k++) {
      const s = 3 + ((L - 6) * (k + 0.5)) / nWin
      panel(win, [A[0] + t[0] * s, A[1] + t[1] * s], t, n, 2.4, 8.0, 10.4)
    }
  }
}

// --- the glass entrance cube and its pyramid
{
  const x0 = -18.0, x1 = 2.4, y0 = -9.6, y1 = 10.8, Z = 24.0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  prism(win, rect(x0, y0, x1, y1), 0, Z, false)
  for (const z of [7.0, 14.0]) prism(metal, rect(x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15), z, z + 0.35, false)
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) prism(metal, rect(x - 0.4, y - 0.4, x + 0.4, y + 0.4), 0, Z, false)
  prism(metal, rect(x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4), Z, Z + 0.5, false)
  const c: V3 = [cx, cy, 33.0], e = 0.5
  const C: V3[] = [[x0 - e, y0 - e, Z + 0.5], [x1 + e, y0 - e, Z + 0.5], [x1 + e, y1 + e, Z + 0.5], [x0 - e, y1 + e, Z + 0.5]]
  for (let i = 0; i < 4; i++) metal.tri(C[i], C[(i + 1) % 4], c)
  metal.quad(C[3], C[2], C[1], C[0])
}

// --- the OMNIMAX theatre: a brick drum over the south wing, ribbed grey dome
{
  const cx = 44.4, cy = -9.6
  prism(brick, ngon(cx, cy, 14.4, 20), 0, 20.4, false)
  prism(metal, ngon(cx, cy, 14.6, 20), 20.4, 21.0, true)
  dome(metal, cx, cy, 21.0, 13.6, 6.8, 20, 4)
  for (let k = 0; k < 3; k++) prism(roof, ngon(cx, cy, 13.6 * Math.cos(((k + 1) / 4) * Math.PI / 2) + 0.1, 20), 21.0 + 6.8 * Math.sin(((k + 1) / 4) * Math.PI / 2) - 0.12, 21.0 + 6.8 * Math.sin(((k + 1) / 4) * Math.PI / 2) + 0.08, false)
}

// --- the Kendall Planetarium: a flat-topped brick drum in the north wing
{
  const cx = -23.4, cy = 50.4
  prism(brick, ngon(cx, cy, 11.4, 20), 0, 16.4, false)
  prism(metal, ngon(cx, cy, 11.6, 20), 16.4, 17.0, true)
}

// --- Station L's turbine hall along the river, its red monitor, the stack
{
  const A: XY = [-44.6, 0.6], t: XY = [-0.26, 0.966], n: XY = [0.966, 0.26]   // along the west wall, n inward
  const W = 25, L = 50, E = 18, R = 23
  const P = (u: number, v: number): XY => [A[0] + t[0] * u + n[0] * v, A[1] + t[1] * u + n[1] * v]
  prism(brick, [P(0, 0.6), P(0, W), P(L, W), P(L, 0.6)], 0, E, false)
  for (let k = 0; k < 6; k++) {
    const u = 4 + k * 8.4
    panel(win, P(u, 0.6), t, [-n[0], -n[1]], 4.2, 3.5, 15.5, 0.06)
  }
  const z = (v: number) => E + (R - E) * (1 - Math.abs(v - (W + 0.6) / 2) / ((W - 0.6) / 2))
  const V3P = (u: number, v: number, dz = 0): V3 => { const p = P(u, v); return [p[0], p[1], z(v) + dz] }
  const vm = (W + 0.6) / 2, o = 0.6
  // two roof slopes (over the eaves a little)
  hall.quad(V3P(-o, 0), V3P(-o, vm), V3P(L + o, vm), V3P(L + o, 0))
  hall.quad(V3P(-o, vm), V3P(-o, W + o * 0), V3P(L + o, W), V3P(L + o, vm))
  hall.quad(V3P(-o, 0), V3P(L + o, 0), V3P(L + o, vm), V3P(-o, vm))   // undersides
  hall.quad(V3P(-o, vm), V3P(L + o, vm), V3P(L + o, W), V3P(-o, W))
  // gable ends
  for (const u of [0, L]) {
    const a = P(u, 0.6), b = P(u, W), m = P(u, vm)
    const tri: V3[] = [[a[0], a[1], E], [b[0], b[1], E], [m[0], m[1], R]]
    brick.tri(tri[0], tri[1], tri[2]); brick.tri(tri[0], tri[2], tri[1])
  }
  // the red monitor along the ridge
  const m0 = P(2, vm - 2.2), m1 = P(L - 2, vm - 2.2), m2 = P(L - 2, vm + 2.2), m3 = P(2, vm + 2.2)
  prism(red, [m0, m1, m2, m3], R - 1.2, R + 1.6, true)
  // the smokestack
  prism(red, ngon(-29.0, 29.4, 2.1, 14), 0, 35.8, true)
  prism(red, ngon(-29.0, 29.4, 2.4, 14), 35.8, 36.6, true)
}

// Lift everything above the base onto the real ground: the map puts z = 0
// on the lowest terrain in the plan's box, 8.8 m under the ground floor
// (tools/terrain.ts check); the walls' feet stay at 0 and run down into it.
const LIFT = 8.8
for (const part of [brick, roof, win, metal, red, hall]) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 0.01) part.pos[i] += LIFT

// ---------------------------------------------------------------- output ---
const parts = [
  { part: brick, material: finish('omsi-brick', 0xd4ae86) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: { name: 'window', color: 0x56769a, roughness: 0.35 } },
  { part: metal, material: finish('omsi-metal', 0xa2a7ac) },
  { part: red, material: finish('omsi-red', 0xc9483c) },
  { part: hall, material: finish('omsi-hall-roof', 0x9c5a4c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Oregon Museum of Science and Industry', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 36.6 + LIFT,
})
await Bun.write(new URL('../models/pdx-omsi.glb', import.meta.url), glb)
console.log(`pdx-omsi.glb: ${triangles} triangles, ${glb.length} bytes`)
