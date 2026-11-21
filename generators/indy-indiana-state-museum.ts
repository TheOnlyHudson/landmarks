/**
 * Indiana State Museum (2002, Ratio Architects), 650 West Washington Street,
 * White River State Park, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-indiana-state-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The OSM building is a
 * multipolygon, relation/6268982, of two outlines: the museum itself
 * (way/113050101) and a second, smaller building west of the Central Canal
 * (way/113050088), joined to it by a skybridge. The origin is the
 * area-weighted centroid of both (-86.169817, 39.768852). Coordinates below
 * are written in the museum's own frame (origin at the centroid of
 * way/113050101, -86.1694268, 39.7687859) and shifted by (OX, OY).
 *
 * y = 0 is the lowest ground under the model, by the west building (214.0 m
 * NAVD88 in the lidar). The museum's own ground is about 3.2 m higher
 * (Washington Street side 216.8..218.4), so its walls run down to y = 0 and
 * its doors and glazing start at G = 4.2, where the map terrain has the front.
 *
 * Identity (from the photos below):
 *  1. A big, nearly windowless block of rough-faced Indiana limestone,
 *     its south front on the park lawn and Washington Street.
 *  2. The red-brick drum with white bands rising over the east end.
 *  3. The east glass block: a light curtain wall in a pale grid.
 *  4. The deep recessed glazed entrance with a stone lintel, a slanted
 *     metal-clad entrance wedge, and the long white canopy with the
 *     "INDIANA STATE MUSEUM" fascia running east-south-east on posts.
 *  5. Four tall white banner masts at the west end of the front, and the
 *     white mono-pitch roof rising over the middle of the block.
 *
 * Sources
 * - OSM (ODbL): relation/6268982 (building=civic, "Indiana State Museum"),
 *   outers way/113050101 and way/113050088; no heights.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   1 m grid (heights below are above ground_min 212.0 m; subtract 2.0 for
 *   model z). Measured along the front: x -57..-22 roof 20.5, x -21..5 24.6,
 *   x 6..33 26.0, x 34..43 21.2; the north-middle mono-pitch roof 31.9 at
 *   x -20 falling to 23.1 at x 10 (y -2..34); the north-east 21.0; the east
 *   glass block 21..27; the drum (x 38..47, y -13..-4) 34.3..34.5; the
 *   canopy top 10.7..13.0 along a line from (-5, -34) to (75, -50); the
 *   banner masts 26.3; the west building 19.7..21.3, its north-west corner
 *   8.5 and 14.0; ground 4.8..6.4 round the museum, 1.7..3.5 round the
 *   west building.
 * - Photos (Wikimedia Commons):
 *   "Indiana State Museum exterior (WCNA 2024 CR).jpg" (ComplexRational,
 *   CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Indiana_State_Museum_exterior_(WCNA_2024_CR).jpg),
 *   the south front square on: the entrance, the lintel, the drum, the glass block;
 *   "Indiana State Museum Angled.jpg" (Momoneymoproblemz, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indiana_State_Museum_Angled.jpg),
 *   the front from the south-east: the canopy, the drum's bands;
 *   "Indiana State Museum Washington Street Facade.jpg" (Momoneymoproblemz,
 *   CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Indiana_State_Museum_Washington_Street_Facade.jpg),
 *   the west end from the south-west: the masts, the blank stone, the skybridge;
 *   "Indiana State Museum from the JW Marriott - 2011.jpg" (Kent Slade,
 *   CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Indiana_State_Museum_from_the_JW_Marriott_-_2011.jpg),
 *   from above to the south: the white mono-pitch roof, the canopy's length.
 *
 * Estimated: the glazed opening (x -18..3, 2.7..13.5 m over the street) and
 *   lintel, the entrance wedge, the canopy's posts (7 m apart) and depth
 *   (4 m), the glass block's grid, all from the photos against lidar
 *   heights; the drum's white bands (three).
 * Doubts: the north and east walls are unphotographed and drawn plain; the
 *   west building (way/113050088) is unphotographed and unnamed in OSM: it
 *   is drawn as plain brick massing at its lidar heights; the skybridge over
 *   the canal is left out (it is not in OSM and would put y = 0 in the
 *   canal). The lidar's 4 m step between the west part of the front and the
 *   middle hardly shows in the frontal photo; the lidar is followed.
 * Left out: the banners, the lettering, the stone coursing, the sculpture.
 * Night: the glazing glows (`window`, `window-2`); the stone is floodlit
 *   softly along the front.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, prism, rect, ccw, triangulate, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { poly } from './indy-st-john-the-evangelist'

const OX = -33.4, OY = 7.3 // the relation's centroid in the museum frame
const G = 4.2 // the museum's ground above y = 0 (the map terrain at the front is 4.2..5.5 over its lowest point)
const stone = new Part(), brick = new Part(), white = new Part(), win = new Part(), glassW = new Part(), roof = new Part()

const MAIN: XY[] = [[-46.4, 32.8], [-26.5, 30.0], [-27.1, 35.8], [-23.1, 35.1], [-22.6, 37.0], [3.5, 31.8], [12.6, 29.6], [11.9, 24.4], [18.4, 24.4], [19.9, 28.8], [37.5, 24.9], [37.0, 19.8], [47.2, 19.5], [46.3, 29.6], [64.2, 32.0], [68.5, -6.7], [50.8, -6.5], [49.6, -9.4], [46.8, -11.2], [43.8, -11.9], [43.5, -26.8], [-20.3, -33.2], [-57.3, -37.2], [-56.8, -2.3], [-52.7, -1.4], [-50.7, 11.1], [-49.9, 15.7]]
const WEST: XY[] = [[-127.8, 58.7], [-130.1, 48.0], [-145.9, 48.6], [-146.6, 9.8], [-137.4, 10.0], [-139.9, -5.0], [-120.4, -8.4], [-118.3, 0.6], [-113.9, 0.2], [-113.6, -1.7], [-110.4, -4.4], [-106.5, -4.9], [-102.7, -3.2], [-100.5, 1.7], [-102.4, 6.4], [-102.0, 19.5], [-101.7, 43.4], [-99.1, 43.6], [-99.2, 60.4], [-115.4, 61.2], [-115.2, 56.0]]
const sh = (p: XY): XY => [p[0] - OX, p[1] - OY]

/** Keep the part of a polygon where a*x + b*y <= c. */
function clipHalf(r: XY[], a: number, b: number, c: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length]
    const fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c
    if (fp <= 0) out.push(p)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}
function clipBox(r: XY[], x0: number, x1: number, y0: number, y1: number): XY[] {
  let o = clipHalf(r, -1, 0, -x0)
  o = clipHalf(o, 1, 0, x1)
  o = clipHalf(o, 0, -1, -y0)
  return clipHalf(o, 0, 1, y1)
}
/** A prism over a museum-frame region, shifted into the model frame. */
function mass(wall: Part, top: Part | null, r: XY[], z1: number) {
  if (r.length < 3) return
  prism(wall, top, ccw(r.map(sh)), 0, z1, 1)
}
/** A prism whose flat top slopes along x: z = zAt(x). */
function sloped(wall: Part, top: Part, r0: XY[], zAt: (x: number) => number) {
  const r = ccw(r0.map(sh))
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    poly(wall, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zAt(b[0] + OX)], [a[0], a[1], zAt(a[0] + OX)]], [b[1] - a[1], a[0] - b[0], 0])
  }
  for (const [i, j, k] of triangulate(r)) {
    const P = (p: XY): V3 => [p[0], p[1], zAt(p[0] + OX)]
    top.tri(P(r[i]), P(r[j]), P(r[k]))
  }
}
const BIG = 999
// ---------------------------------------------------------------- the museum's masses
mass(stone, roof, clipBox(MAIN, -BIG, -21.5, -BIG, BIG), 18.5)
mass(stone, roof, clipBox(MAIN, -21.5, 6, -BIG, -2), 22.6)
mass(stone, roof, clipBox(MAIN, 6, 34, -BIG, -2), 24.0)
mass(stone, roof, clipBox(MAIN, 34, 43.6, -BIG, -2), 19.2)
mass(stone, roof, clipBox(MAIN, 10, 43.6, -2, BIG), 19.0)
// the white mono-pitch roof over the middle, high to the west
sloped(stone, white, clipBox(MAIN, -21.5, 10, -2, BIG), (x) => 30.0 - ((x + 21.5) / 31.5) * 8.7)
// parapet copings on the stone masses (thin pale lips)
for (const [x0, x1, y1, h] of [[-57.3, -21.5, -2, 18.5], [-21.5, 6, -2, 22.6], [6, 34, -2, 24.0]] as [number, number, number, number][]) {
  const r = clipBox(MAIN, x0, x1, -BIG, y1).map(sh)
  // just the front edge: a 0.4 m lip along the south edge of each part
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.abs(b[0] - a[0]) < 5 || Math.min(a[1], b[1]) > -20 - OY) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    if (n[1] > -0.5) continue
    flatShape(white, { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }, rect(-L / 2, h - 0.35, L / 2, h), 0.04)
  }
}

// ---------------------------------------------------------------- the east glass block
{
  const r = clipBox(MAIN, 43.6, BIG, -BIG, BIG)
  mass(glassW, roof, r, 20.0)
  const rs = ccw(r.map(sh))
  // pale grid: mullions every 3 m, transoms at the storeys
  for (let i = 0; i < rs.length; i++) {
    const a = rs[i], b = rs[(i + 1) % rs.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const f: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }
    for (let s = -L / 2; s <= L / 2 + 0.01; s += L / Math.max(1, Math.round(L / 3.2))) flatShape(white, f, rect(s - 0.12, G, s + 0.12, 20.0), 0.04)
    for (const z of [G, G + 4.4, G + 8.8, G + 13.2, 19.6]) flatShape(white, f, rect(-L / 2, z - 0.15, L / 2, z + 0.25), 0.045)
    flatShape(white, f, rect(-L / 2, 0, L / 2, G), 0.04)
  }
}

// ---------------------------------------------------------------- the red-brick drum with white bands
{
  const [cx, cy] = sh([42.5, -8.5])
  lathe(brick, cx, cy, [[4.6, 0], [4.6, 32.5], [0.01, 32.5]], 16)
  for (const z of [24.6, 27.2, 29.8, 32.2]) lathe(white, cx, cy, [[4.66, z], [4.66, z + 0.35]], 16)
}

// ---------------------------------------------------------------- the south front
// the front line: (-57.3, -37.2) to (43.5, -26.8)
const A: XY = sh([-57.3, -37.2]), B: XY = sh([-20.3, -33.2]), C: XY = sh([43.5, -26.8])
const frontFace = (p: XY, q: XY, at: number): Face => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), t: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
  return { o: [p[0] + t[0] * at, p[1] + t[1] * at, 0], n: [t[1], -t[0]] }
}
{
  // the deep glazed entrance under a stone lintel (x -18..3)
  const fE = frontFace(B, C, 0) // s along the front from x -20.3
  flatShape(win, fE, rect(2.3, G, 23.5, G + 10.8), 0.05)
  for (let s = 2.3; s <= 23.6; s += 3.04) flatShape(white, fE, rect(s - 0.1, G, s + 0.1, G + 10.8), 0.055)
  for (const z of [G + 3.6, G + 7.2]) flatShape(white, fE, rect(2.3, z - 0.08, 23.5, z + 0.08), 0.055)
  // the lintel: a pale stone band standing proud
  const fl = frontFace(B, C, 0)
  const P = (s: number, z: number, d: number): V3 => [fl.o[0] + -fl.n[1] * s + fl.n[0] * d, fl.o[1] + fl.n[0] * s + fl.n[1] * d, z]
  const lint = (d: number) => [P(-0.5, G + 10.8, d), P(26.5, G + 10.8, d), P(26.5, G + 12.8, d), P(-0.5, G + 12.8, d)]
  const L0 = lint(0), L1 = lint(1.2)
  poly(stone, L1, [fl.n[0], fl.n[1], 0])
  poly(stone, [L0[3], L0[2], L1[2], L1[3]], [0, 0, 1])
  poly(stone, [L0[0], L0[1], L1[1], L1[0]], [0, 0, -1])
  poly(stone, [L0[0], L1[0], L1[3], L0[3]], [fl.n[1], -fl.n[0], 0])
  poly(stone, [L0[1], L1[1], L1[2], L0[2]], [-fl.n[1], fl.n[0], 0])
  // the slanted metal-clad entrance wedge in front of the west half (x -25..-9)
  const w0 = P(-5, 0, 0), w1 = P(11, 0, 0), w0o = P(-5, 0, 5.5), w1o = P(11, 0, 5.5)
  const up = (p: V3, z: number): V3 => [p[0], p[1], z]
  const T0 = up(w0, G + 5.0), T1 = up(w1, G + 8.2), T0o = up(w0o, G + 4.2), T1o = up(w1o, G + 6.0)
  poly(glassW, [w0o, w1o, T1o, T0o], [fl.n[0], fl.n[1], 0])
  poly(white, [T0o, T1o, T1, T0], [fl.n[0] * 0.3, fl.n[1] * 0.3, 1])
  poly(glassW, [w0, w0o, T0o, T0], [fl.n[1], -fl.n[0], 0])
  poly(glassW, [w1o, w1, T1, T1o], [-fl.n[1], fl.n[0], 0])
  // doors under the lintel
  flatShape(win, frontFace(B, C, 0), rect(12.5, G, 21.5, G + 3.0), 0.06)
  // the four banner masts at the west end
  const fW = frontFace(A, B, 0)
  for (const s of [10.5, 17.0, 23.5, 30.0]) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    const cx = A[0] + t[0] * s + fW.n[0] * 1.6, cy = A[1] + t[1] * s + fW.n[1] * 1.6
    box(white, white, cx - 0.35, cy - 0.35, cx + 0.35, cy + 0.35, 0, 24.3)
  }
  // a lighter plinth along the front
  flatShape(white, fW, rect(0, 0, Math.hypot(B[0] - A[0], B[1] - A[1]), G + 1.0), 0.03)
}

// ---------------------------------------------------------------- the canopy
{
  const line: XY[] = [[-9, -32.4], [5, -34.6], [21, -38.0], [41, -42.0], [59, -46.0], [76, -49.8]].map((p) => sh(p as XY))
  const W2 = 2.0, z0 = G + 4.6, z1 = G + 6.4
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i], b = line[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L * W2, -(b[0] - a[0]) / L * W2]
    const q: XY[] = [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]]
    prism(white, white, ccw(q), z0, z1, 1)
    flatShape(win, { o: [(a[0] + b[0]) / 2 + n[0], (a[1] + b[1]) / 2 + n[1], 0], n: [n[0] / W2, n[1] / W2] }, rect(-L / 2 + 0.3, z0 + 0.5, L / 2 - 0.3, z1 - 0.4), 0.03)
  }
  // posts, about 7 m apart, on both edges from the third post on
  let acc = 0
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i], b = line[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1] * (W2 - 0.3), -t[0] * (W2 - 0.3)]
    for (let s = acc === 0 ? 7 : 0; s < L; s += 7) {
      for (const sg of [-1, 1]) {
        const x = a[0] + t[0] * s + n[0] * sg, y = a[1] + t[1] * s + n[1] * sg
        box(white, null, x - 0.2, y - 0.2, x + 0.2, y + 0.2, 0, z0)
      }
    }
    acc += L
  }
}

// ---------------------------------------------------------------- the west building across the canal
{
  mass(brick, roof, clipBox(WEST, -127, BIG, -BIG, BIG), 18.5)
  mass(brick, roof, clipBox(WEST, -BIG, -127, -BIG, 6), 18.0)
  mass(brick, roof, clipBox(WEST, -BIG, -127, 6, 32), 12.0)
  mass(brick, roof, clipBox(WEST, -BIG, -127, 32, BIG), 6.5)
  // a pale coping and window bands on the canal (east) side and the south
  const fE: Face = { o: [-101.8 - OX, 30 - OY, 0], n: [1, 0] }
  for (const z of [4.5, 9.5, 14.0]) flatShape(win, fE, rect(-10, z, 10, z + 2.2), 0.05)
  const fS: Face = { o: [-130 - OX, -6.7 - OY, 0], n: [-0.17, -0.985] }
  for (const z of [4.5, 9.5, 14.0]) flatShape(win, fS, rect(-6, z, 6, z + 2.2), 0.05)
}

const frontLit = (p: V3, n: V3) => (n[1] < -0.6 && p[2] < 25 ? 0.5 : 0)
const stoneM = { ...finish('indy-ism-limestone', 0xd8cbb0), floodlight: frontLit }
const built = finishGlb('Indiana State Museum', [
  { part: stone, material: stoneM },
  { part: brick, material: finish('indy-ism-brick', 0xb0614f) },
  { part: white, material: finish('indy-ism-white', 0xf2f0ea) },
  { part: win, material: PALETTE.window },
  { part: glassW, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, height: 32.5, replaces: ['relation/6268982'] }, 5000)
await writeModel('indy-indiana-state-museum', built)
