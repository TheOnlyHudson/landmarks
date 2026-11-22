/**
 * Gainbridge Fieldhouse (ex Conseco / Bankers Life Fieldhouse, 1999, Ellerbe
 * Becket), Indianapolis — procedural, CC0-1.0, no textures.
 * bun generators/indy-gainbridge-fieldhouse.ts
 *
 * Map frame: turned to bearing 1° (the downtown grid; OSM way/341313456 has
 * its long edges at 1° and 92°). +y north (Georgia Street), +x east
 * (Delaware Street), Pennsylvania Street on the west (-x). Anchor: the
 * outline's area centroid. z = 0 is the street, level within about 0.5 m
 * (lidar); `elevation` 0.
 *
 * Identity (from the photos and the lidar):
 *  1. The big barrel vault over the arena: its axis runs east–west, so the
 *     arched ends face Pennsylvania and Delaware Streets; white standing-
 *     seam roof, crest 43.3 m just south of centre.             (NAIP, lidar)
 *  2. The arched ends: a glazed wall under a dark steel arch truss, with a
 *     tall brick tower beside it on Pennsylvania Street.        (p1, p2, p3)
 *  3. Dark grey hipped slopes at the north and south ends of the vault,
 *     with chamfered corners.                                  (NAIP, p3)
 *  4. The five-storey red-brick fieldhouse block all round, with big
 *     grouped windows over a pale stone base.                      (p1–p3)
 *  5. The glass entrance on the Pennsylvania/Georgia corner: a glazed wall
 *     under a flat arched metal roof.                               (p4)
 *
 * Heights, measured from the USGS lidar (USGS_LPC_IN_Central_MarionCo_2016_
 * LAS_2018, flown 2016, 1 m), above the street:
 *   - vault profile along y (below, PROFILE), constant across x ±60;
 *   - north hip from the vault edge (y 33, 30.5 m) down to 20.5 at y 43;
 *     south hip from y -59 (32.5) down to 22 at y -73;
 *   - brick block 19.7; the north-east service wing 10.8; the low south
 *     apron 6.2; the west tower 44 (lidar spot at the west face);
 * Estimated: the entrance (peak 22 m, springing 16.5, 25 m wide, from p4
 * against the brick storeys); the glazing extent on the arched ends (p1–p3
 * show the west end's glass south of the tower; the east end is drawn
 * glazed from the NAIP glass line along that edge, not photographed);
 * window bays (9.5 m, two rows grouped over two storeys each).
 *
 * Evidence
 * - OSM (ODbL): way/341313456 (building, leisure=stadium, Q545007) and its
 *   part way/620778693 (building:part=stadium, the arena bowl), roof ways
 *   way/696303086 and way/696303087 (canopies on the north wing).
 * - USGS NAIP orthophoto: plan, white vault with its seams, dark hips, the
 *   painted name (not drawn).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - p1 "Bankers Life Fieldhouse, Indianápolis, Estados Unidos, 2012-10-22,
 *     DD 01.jpg", Diego Delso (CC BY-SA 3.0) — the Pennsylvania St front
 *     from the north-west: corner entrance, brick block, tower, arch truss.
 *     https://commons.wikimedia.org/wiki/File:Bankers_Life_Fieldhouse,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_01.jpg
 *   - p4 "… DD 02.jpg", Diego Delso (CC BY-SA 3.0) — the entrance face on.
 *     https://commons.wikimedia.org/wiki/File:Bankers_Life_Fieldhouse,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_02.jpg
 *   - p2 "Bankers Life Fieldhouse in May 2017.jpg", NaBUru38 (CC BY-SA 4.0)
 *     — the glazed arch end and the brick block along Pennsylvania St.
 *     https://commons.wikimedia.org/wiki/File:Bankers_Life_Fieldhouse_in_May_2017.jpg
 *   - p3 "ConsecoFieldhouse.jpg", Durin (CC BY-SA 3.0) — the same front,
 *     the vault and the grey hip above the brick.
 *     https://commons.wikimedia.org/wiki/File:ConsecoFieldhouse.jpg
 * Doubts: the 2020–22 renovation changed the north side (plaza, canopies);
 * the lidar predates it, so the north wing is drawn as flown in 2016. The
 * east end is not photographed. Not drawn: lettering, banners, signs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, type XY } from './dc-nationals-park'

const brick = new Part(), stone = new Part(), hip = new Part(), vault = new Part(), win = new Part(), steel = new Part()

// Vault crest heights along y (lidar, street-relative).
const PROFILE: [number, number][] = [
  [-59, 32.5], [-52, 35.8], [-45, 38.4], [-38, 40.4], [-31, 41.9], [-24, 42.8], [-17, 43.3], [-10, 43.2],
  [-3, 42.6], [4, 41.4], [11, 39.7], [18, 37.6], [25, 34.7], [33, 30.5],
]
const zAt = (y: number) => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [ya, za] = PROFILE[i], [yb, zb] = PROFILE[i + 1]
    if (y >= ya && y <= yb) return za + ((zb - za) * (y - ya)) / (yb - ya)
  }
  return y < PROFILE[0][0] ? PROFILE[0][1] : PROFILE[PROFILE.length - 1][1]
}
const X = 61.5 // the arched end walls
const BRICK = 19.7

// ---------------------------------------------------------------------------
// 1. Brick block, north-east service wing, low south apron.
const MAIN: XY[] = [[-63.5, -58], [62.4, -58.3], [61.8, 27.9], [31, 28], [30.7, 83.7], [24.4, 84], [-35.7, 85.1], [-36.3, 54.8], [-63.1, 55.1]]
const NE: XY[] = [[31, 28], [61.8, 27.9], [63.9, 64.5], [31, 64.8]]
const APRON: XY[] = [[-63.5, -58], [-35.9, -71.4], [-1.6, -89.4], [33.5, -72.4], [62.4, -58.3]]
prism(MAIN, 0, BRICK - 0.9, brick, null)
prism(MAIN, BRICK - 0.9, BRICK, stone, hip)
prism(MAIN.map(([x, y]) => [x * 1.004, y * 1.004] as XY), 0, 4, stone, null)
prism(NE, 0, 10.8, brick, hip)
prism(APRON, 0, 6.2, stone, hip)

// 2. The vault, smooth-shaded, x ±X.
for (let i = 0; i < PROFILE.length - 1; i++) {
  const nrm = (k: number): V3 => {
    const a = PROFILE[Math.max(0, k - 1)], b = PROFILE[Math.min(PROFILE.length - 1, k + 1)]
    const dy = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dy, dz)
    return [0, -dz / l, dy / l]
  }
  const [ya, za] = PROFILE[i], [yb, zb] = PROFILE[i + 1], na = nrm(i), nb = nrm(i + 1)
  quad(vault, [[-X - 0.6, ya, za], [X + 0.6, ya, za], [X + 0.6, yb, zb], [-X - 0.6, yb, zb]], [0, 0, 1], [na, na, nb, nb])
}

// 3. The hipped ends: a sloped trapezoid and two chamfered corner facets each.
function hipEnd(yv: number, zv: number, yb: number, zb: number, xin: number) {
  const s = Math.sign(yb - yv), out: V3 = [0, s * (zv - zb), Math.abs(yb - yv)]
  quad(hip, [[-X, yv, zv], [X, yv, zv], [xin, yb, zb], [-xin, yb, zb]], out)
  // chamfered corners, facing out and up
  for (const sx of [1, -1]) quad(hip, [[sx * X, yv, zv], [sx * xin, yb, zb], [sx * X, yb, zb], [sx * X, yb, zb]], [sx, s, 1])
}
hipEnd(33, 30.5, 43, 20.5, 45)
hipEnd(-59, 32.5, -73, 22, 35)
// south apron block under the south hip
prism([[-X, -59], [X, -59], [35, -73], [-35, -73]], 0, 22, brick, null)

// 4. The arched end walls at x = ±X: grey metal, glazed under a steel arch truss.
const WALL_Y0 = -73, WALL_Y1 = 43
function topAt(y: number) {
  if (y > 33) return 30.5 - ((y - 33) * 10) / 10
  if (y < -59) return 32.5 - ((-59 - y) * 10.5) / 14
  return zAt(y)
}
const ys: number[] = [WALL_Y0, ...PROFILE.map((p) => p[0]), WALL_Y1]
for (const sx of [1, -1]) {
  const x = sx * X, n: V3 = [sx, 0, 0]
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    quad(hip, [[x, a, BRICK - 1], [x, b, BRICK - 1], [x, b, topAt(b)], [x, a, topAt(a)]], n)
  }
  // glass: from the brick top to 1.8 m under the arch; west end only south of the tower
  const g0 = -57, g1 = sx < 0 ? 6 : 31
  const xg = x + sx * 0.08
  const gy = ys.filter((y) => y > g0 && y < g1)
  const pts = [g0, ...gy, g1]
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    quad(win, [[xg, a, BRICK + 0.5], [xg, b, BRICK + 0.5], [xg, b, topAt(b) - 2.2], [xg, a, topAt(a) - 2.2]], n)
  }
  // the arch truss: a deep dark band following the vault edge, and bold vertical bars
  const xt = x + sx * 0.5
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    if (b <= -59 || a >= 33) continue
    quad(steel, [[xt, a, topAt(a) - 2.4], [xt, b, topAt(b) - 2.4], [xt, b, topAt(b) + 0.4], [xt, a, topAt(a) + 0.4]], n)
    quad(steel, [[xt, a, topAt(a) + 0.4], [xt, b, topAt(b) + 0.4], [x - sx * 0.3, b, topAt(b) + 0.4], [x - sx * 0.3, a, topAt(a) + 0.4]], [0, 0, 1])
  }
  for (let y = g0 + 9; y < g1 - 3; y += 9.5) quad(steel, [[xt, y - 0.35, BRICK], [xt, y + 0.35, BRICK], [xt, y + 0.35, topAt(y) - 2.2], [xt, y - 0.35, topAt(y) - 2.2]], n)
}

// 5. Towers beside the arched ends (west on Pennsylvania St, measured; east, lidar spot).
prism([[-66.3, 7], [-59.5, 7], [-59.5, 14], [-66.3, 14]], 0, 43, brick, null)
prism([[-66.6, 6.7], [-59.2, 6.7], [-59.2, 14.3], [-66.6, 14.3]], 43, 44.2, stone, hip)
prism([[59.5, -15], [65.5, -15], [65.5, -8], [59.5, -8]], 0, 42.5, brick, null)
prism([[59.2, -15.3], [65.8, -15.3], [65.8, -7.7], [59.2, -7.7]], 42.5, 43.6, stone, hip)

// 6. The corner entrance facing Georgia St: glass under a flat arched metal roof,
// x -62..-37, a short barrel back to y 38.
{
  const x0 = -62.6, x1 = -37, cx = (x0 + x1) / 2, W = (x1 - x0) / 2, zs = 16.5, rise = 5.5
  const R = (W * W + rise * rise) / (2 * rise), zc = zs + rise - R, N = 10
  const arc = (i: number): XY => { const a0 = Math.asin(W / R), a = -a0 + (2 * a0 * i) / N; return [cx + R * Math.sin(a), zc + R * Math.cos(a)] }
  const yf = 55.1, yb = 38
  for (let i = 0; i < N; i++) {
    const [xa, za] = arc(i), [xb, zb] = arc(i + 1)
    // roof
    quad(vault, [[xa, yb, za + 0.8], [xb, yb, zb + 0.8], [xb, yf + 1.2, zb + 0.8], [xa, yf + 1.2, za + 0.8]], [0, 0, 1])
    // fascia (the curved metal edge)
    quad(vault, [[xa, yf + 1.2, za - 0.4], [xb, yf + 1.2, zb - 0.4], [xb, yf + 1.2, zb + 0.8], [xa, yf + 1.2, za + 0.8]], [0, 1, 0])
    // glass tympanum and wall face
    quad(win, [[xa, yf + 0.08, zs], [xb, yf + 0.08, zs], [xb, yf + 0.08, zb - 0.4], [xa, yf + 0.08, za - 0.4]], [0, 1, 0])
  }
  // the glass wall below the springing, over a dark canopy band at 5 m
  quad(win, [[x0 + 0.6, yf + 0.08, 5.6], [x1 - 0.6, yf + 0.08, 5.6], [x1 - 0.6, yf + 0.08, zs], [x0 + 0.6, yf + 0.08, zs]], [0, 1, 0])
  quad(win, [[x0 + 2.5, yf + 0.08, 0.4], [x1 - 2.5, yf + 0.08, 0.4], [x1 - 2.5, yf + 0.08, 4.6], [x0 + 2.5, yf + 0.08, 4.6]], [0, 1, 0])
  quad(steel, [[x0, yf + 0.12, 4.6], [x1, yf + 0.12, 4.6], [x1, yf + 0.12, 5.6], [x0, yf + 0.12, 5.6]], [0, 1, 0])
  // the barrel's west end over the Pennsylvania front
  for (let i = 0; i < N; i++) {
    const [xa, za] = arc(i), [xb, zb] = arc(i + 1)
    if (xa > x0 + 1 && i > 0) break
    quad(vault, [[xa, yb, za + 0.8], [xa, yf + 1.2, za + 0.8], [xa, yf + 1.2, BRICK], [xa, yb, BRICK]], [-1, 0, 0])
    void xb; void zb
  }
}

// 7. Window bays: broad two-storey panels in the brick, over the stone base.
function bays(a: XY, b: XY, bay: number, rows: [number, number][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 8) return
  const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [e[1], -e[0], 0]
  const n = Math.max(1, Math.round(L / bay))
  for (let i = 0; i < n; i++) {
    const u0 = (L / n) * i + 1.6, u1 = (L / n) * (i + 1) - 1.6
    const q = (u: number, z: number): V3 => [a[0] + e[0] * u + nrm[0] * 0.07, a[1] + e[1] * u + nrm[1] * 0.07, z]
    for (const [r0, r1] of rows) quad(win, [q(u0, r0), q(u1, r0), q(u1, r1), q(u0, r1)], nrm)
  }
}
{
  const a2 = MAIN.reduce((s, p, i) => { const q = MAIN[(i + 1) % MAIN.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const r = a2 < 0 ? [...MAIN].reverse() : MAIN
  for (let i = 0; i < r.length; i++) {
    let a = r[i], b = r[(i + 1) % r.length]
    if (Math.abs(a[1] - 55) < 1 && Math.abs(b[1] - 55) < 1) continue // the entrance face
    // the west front: skip the tower's stretch
    if (Math.abs(a[0] + 63.3) < 0.5 && Math.abs(b[0] + 63.3) < 0.5) {
      const lo: XY = [a[0], Math.min(a[1], b[1])], hi: XY = [b[0], Math.max(a[1], b[1])]
      const dir = a[1] < b[1] ? 1 : -1
      const parts: [XY, XY][] = [[[lo[0], lo[1]], [lo[0], 6]], [[lo[0], 15], [hi[0], hi[1]]]]
      for (const [p, q] of parts) dir > 0 ? bays(p, q, 9.5, [[5.2, 11.4], [12.6, 18.2]]) : bays(q, p, 9.5, [[5.2, 11.4], [12.6, 18.2]])
      continue
    }
    bays(a, b, 9.5, [[5.2, 11.4], [12.6, 18.2]])
  }
  // the south block's three outer faces (counter-clockwise ring: right of each edge is outside)
  const S: XY[] = [[-X, -59], [-35, -73], [35, -73], [X, -59]]
  for (let i = 0; i < 3; i++) bays(S[i], S[i + 1], 9.5, [[7.4, 13.2], [14.6, 20.4]])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('gainbridge-brick', 0xb0705c) },
  { part: stone, material: PALETTE.stone },
  { part: hip, material: PALETTE.roof },
  { part: vault, material: finish('gainbridge-vault', 0xdfe2e2) },
  { part: win, material: PALETTE.window },
  { part: steel, material: finish('gainbridge-steel', 0x5c6670) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Gainbridge Fieldhouse', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 1, osm: 'way/341313456', height: 44.2,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/indy-gainbridge-fieldhouse.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
