/**
 * Denver Museum of Nature & Science, City Park (1908 core, wrapped by wings of 1968–2014)
 * — procedural, CC0-1.0, no textures.
 * bun generators/den-museum-of-nature-and-science.ts
 *
 * What it looks like today: a broad complex of blank, fluted buff precast-concrete boxes at
 * several heights. The 1908 neoclassical museum survives only inside, as the raised spine
 * through the middle of the roofscape; no part of it shows on the outside. The landmarks
 * from the street: the tall projecting box at the north-west corner, the angled glass entry
 * vestibule beside it under the long lettered wall with its banners, the north facade's tall
 * dark window slots and low canopy, the tallest block on the west side, the 2014 Morgridge
 * wing along the south with its green-glass corner and timber-clad entrance, the blue glass
 * entry box at the south-west. The Gates Planetarium dome is inside the building and does
 * not show on the roof (lidar), so it isn't drawn.
 *
 * Frame: x across (towards 80°), y along (towards 350°), z up, metres; origin at the centroid
 * of OSM way/34414979. z = 0 is 1616.0 m NAVD88, the lowest map terrain under the footprint
 * (tools/terrain.ts check); the ground round the building is about 1617.1 m (z 1.1).
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/34414979 (building=public, 4 levels,
 *   Q3330052); no parts.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020, after the 2014 wing), 1 m grid, read on a
 *   2 m grid in the frame and grouped into roof levels (heights NAVD88): main roofs 1634.4;
 *   the west strip 1635.9; the central spine and its cross arm 1638.3; the south wing 1639.9;
 *   the west tall block 1641.5; the south wing's east tower 1641.5.
 * - USGS NAIP: white membrane roofs, the buff spine.
 * - Photos (EVIDENCE):
 *   - Sarbjit Bahga, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Museum_of_Nature_and_Science_View_from_north_west.jpg
 *   - Sarbjit Bahga, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Museum_of_Nature_and_Science._View_from_south-east.jpg
 *   - Sarbjit Bahga, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Museum_of_Nature_and_Science._View_from_south-west.jpg
 *   - Avrand6, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Museum_of_Nature_%26_Science,_July_2017.jpg
 *   - public domain: https://commons.wikimedia.org/wiki/File:Denver_Museum_of_Nature_%26_Science.JPG (north entrance)
 *
 * Measured / published / estimated:
 * - measured: all roof heights and the extents of each raised block (lidar), plan (OSM).
 * - estimated from photos: glazing (entry vestibule, slots, green-glass corner, blue glass
 *   box), the canopy, the lettering band (a dark band, no letters), colours.
 * - simplified: rooftop plant and small level changes under about 1.5 m are left out; the
 *   raised blocks are drawn as rectangles fitted to the lidar.
 *
 * Doubts: the east facade and the courtyard notch on it (x 58–73) aren't in any licensed
 * photo; drawn plain. The banners are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { finish, PALETTE } from './palette'

const Z = (rel: number) => rel - 2.36 // lidar height above its ground_min (1613.64) → model z
const G = 1.1 // the ground round the building, model z

type P2 = [number, number]

const OUT: P2[] = [
  [-73.6, 58.0], [-65.9, 61.5], [-63.8, 66.8], [-38.9, 67.3], [-36.6, 60.6], [-28.7, 57.4], [-27.6, 59.9],
  [4.7, 60.3], [5.9, 56.8], [12.6, 59.5], [12.5, 62.1], [73.0, 61.9], [73.3, 33.6], [58.0, 32.7], [58.1, 22.5],
  [60.0, 22.5], [60.0, 20.9], [61.4, 20.9], [61.4, 14.9], [59.0, 14.9], [59.0, 0.0], [61.2, 0.0], [61.2, -4.3],
  [59.9, -4.3], [59.9, -6.1], [58.3, -6.1], [58.4, -18.3], [73.7, -18.0], [73.6, -47.3], [56.0, -47.9],
  [57.6, -68.7], [8.1, -68.2], [6.4, -70.9], [1.3, -70.6], [-23.8, -74.1], [-25.7, -63.6], [-22.5, -62.9],
  [-22.9, -53.3], [-20.0, -52.2], [-20.1, -45.1], [-26.7, -45.3], [-28.0, -43.2], [-35.0, -45.6], [-37.2, -51.7],
  [-61.8, -51.8], [-64.9, -46.7], [-74.3, -42.9], [-64.8, -15.4], [-69.4, -15.3], [-69.4, 34.4], [-65.2, 34.7],
]

const area = (P: P2[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2

/** Ear-clipping triangulation of a simple polygon, flat at z, facing up. */
function cap(p: Part, P0: P2[], z: number) {
  const P = area(P0) < 0 ? [...P0].reverse() : [...P0]
  const idx = P.map((_, i) => i)
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: P2, a: P2, b: P2, c: P2) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = P[i0], b = P[i1], c = P[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(P[j], a, b, c))) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) p.tri([P[idx[0]][0], P[idx[0]][1], z], [P[idx[1]][0], P[idx[1]][1], z], [P[idx[2]][0], P[idx[2]][1], z])
}

/** Vertical walls round a polygon from z0 to z1, split ≤ 5 m, facing out. */
function walls(p: Part, P: P2[], z0: number, z1: number) {
  const s = area(P) > 0 ? 1 : -1
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(len / 5))
    const n: V3 = [((b[1] - a[1]) * s) / len, (-(b[0] - a[0]) * s) / len, 0]
    for (let j = 0; j < k; j++) {
      const t0 = j / k, t1 = (j + 1) / k
      const A: P2 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], B: P2 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      face(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], n)
    }
  }
}

/** A raised rectangular block from z0 to z1 with a coping band; walls in `w`, roof in `r`. */
function block(w: Part, r: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, cope?: Part) {
  const P: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(w, P, z0, z1)
  face(r, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (cope) {
    const c = 0.15
    walls(cope, [[x0 - c, y0 - c], [x1 + c, y0 - c], [x1 + c, y1 + c], [x0 - c, y1 + c]], z1 - 0.7, z1 + 0.05)
  }
}

/** A flat panel on a vertical wall along a→b (outside to the left, as OUT runs), u0..u1 × z0..z1, `off` proud. */
function panel(p: Part, a: P2, b: P2, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [-t[1], t[0]]
  const q = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * off, a[1] + t[1] * u + n[1] * off, z]
  face(p, q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1), [n[0], n[1], 0])
}

export function build() {
  const wall = new Part(), roof = new Part(), cope = new Part(), win = new Part(), glass = new Part(), wood = new Part()
  const BASE = Z(20.8)

  // the main body: the whole outline up to the main roofs
  walls(wall, OUT, 0, BASE)
  cap(roof, OUT, BASE)
  walls(cope, OUT.map(([x, y]) => [x, y] as P2), BASE - 0.8, BASE + 0.05)

  // raised blocks (lidar levels)
  const L22 = Z(22.3), L25 = Z(24.7), L26 = Z(26.3), L28 = Z(27.9)
  block(wall, roof, -69.4, -58, -15, 30, BASE, L22)                 // west strip
  block(wall, roof, -58, -40, -15, 30, BASE, L28, cope)             // west tall block
  block(wall, roof, -42, 25, 26, 31, BASE, L25)                      // spine cross arm
  block(wall, roof, 11, 31, 31, 54, BASE, L25)                       // spine north
  block(wall, roof, -9, 17, -14, 26, BASE, L25)                      // spine middle
  block(wall, roof, -17, -9, -14, 14, BASE, L22)
  block(wall, roof, 11, 31, -42, -14, BASE, L25)                     // spine south
  block(wall, roof, 25, 58, 26, 31, BASE, L22)                       // north-east arm
  block(wall, roof, 25, 57, -13, -5, BASE, L22)                      // south-east arm
  block(wall, roof, 35, 57, -29, -16, BASE, L22)
  block(wall, roof, 37, 54, -26, -18, L22, L26)
  block(wall, roof, -22.5, 44, -68, -54, BASE, L26, cope)            // Morgridge wing (2014)
  block(wall, roof, 44, 56, -59, -54, BASE, L26)
  block(wall, roof, 38, 44, -66, -54, L26, L28, cope)                // its east tower
  block(wall, roof, -52, -43, 55, 61, BASE, Z(23.5))                 // north-west roof box

  // ---- North facade (photos from the north-west)
  // the angled glass entry vestibule between the north-west box and the lettered wall
  const va: P2 = [-36.6, 60.6], vb: P2 = [-28.7, 57.4]
  panel(win, va, vb, 0.4, 8.1, G, G + 7.5)
  // its sloping glass canopy roof, out over the doors
  const vt: V3[] = [[va[0], va[1], G + 8.2], [vb[0], vb[1], G + 8.2], [vb[0] + 1.6, vb[1] + 4.0, G + 5.2], [va[0] + 1.6, va[1] + 4.0, G + 5.2]]
  face(glass, vt[0], vt[1], vt[2], vt[3], [0.4, 1, 1])
  face(glass, vt[0], vt[3], vt[2], vt[1], [-0.4, -1, -1])
  // the lettered wall: a dark band along its top and a glazed base
  const la: P2 = [-27.6, 59.9], lb: P2 = [4.7, 60.3]
  panel(cope, la, lb, 0, 32.3, BASE - 2.6, BASE - 1.0, 0.1)
  panel(win, la, lb, 2, 30, G, G + 4.2)
  // the long north facade: tall dark slots and a canopy over a glazed base
  const na: P2 = [12.5, 62.1], nb: P2 = [73.0, 61.9]
  for (let u = 4; u < 58; u += 7.5) panel(win, na, nb, u, u + 1.6, G + 4.8, BASE - 2.0)
  panel(win, na, nb, 2, 58, G, G + 3.8)
  const cz = G + 4.3
  face(cope, [14, 62.1, cz], [40, 62.1, cz], [40, 65.0, cz], [14, 65.0, cz], [0, 0, 1])
  face(cope, [14, 62.1, cz - 0.4], [14, 65.0, cz - 0.4], [40, 65.0, cz - 0.4], [40, 62.1, cz - 0.4], [0, 0, -1])
  face(cope, [14, 65.0, cz - 0.4], [40, 65.0, cz - 0.4], [40, 65.0, cz], [14, 65.0, cz], [0, 1, 0])

  // ---- South-east: the Morgridge wing's green-glass corner and timber-clad entrance
  const ea: P2 = [56.0, -47.9], eb: P2 = [57.6, -68.7]
  panel(glass, ea, eb, 0.5, 20.4, G, G + 14.5)
  const sa: P2 = [57.6, -68.7], sb: P2 = [8.1, -68.2]
  panel(glass, sa, sb, 0.5, 14, G, G + 14.5)
  panel(glass, sa, sb, 30.5, 33, G + 6, Z(26.3) - 1)
  panel(wood, sa, sb, 14.5, 30, G + 4.5, G + 7.5)
  panel(win, sa, sb, 14.5, 30, G, G + 4.3)
  // ---- South-west: the blue glass entry box
  const wa: P2 = [-23.8, -74.1], wb: P2 = [-25.7, -63.6]
  panel(win, wa, wb, 0.5, 10.2, G, G + 9.5)
  panel(win, [1.3, -70.6], [-23.8, -74.1], 0.5, 12, G, G + 9.5)

  return { wall, roof, cope, win, glass, wood }
}

if (import.meta.main) {
  const m = build()
  const parts = [
    { part: m.wall, material: finish('buff-precast', 0xd9c9ad) },
    { part: m.roof, material: { ...PALETTE.roof, color: 0xc9c6bd } },
    { part: m.cope, material: finish('buff-precast-shade', 0xb9a98f) },
    { part: m.win, material: { ...PALETTE.window, color: 0x5f7a8c } },
    { part: m.glass, material: { ...PALETTE.glass, color: 0x7fa9a4 } },
    { part: m.wood, material: finish('timber', 0xb98c5c) },
  ]
  const glb = writeGlb('Denver Museum of Nature & Science', parts)
  await Bun.write(new URL('../models/den-museum-of-nature-and-science.glb', import.meta.url), glb)
  console.log(`den-museum-of-nature-and-science.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
