/**
 * Peter B. Lewis Building (Weatherhead School of Management, Case Western
 * Reserve University; Frank Gehry, 2002), 11119 Bellflower Road, University
 * Circle, Cleveland: procedural, CC0-1.0.
 * bun generators/cle-peter-b-lewis-building.ts [out.glb]
 *
 * Frame: x, y, z metres, turned to bearing 312 (+y north-west to the back
 * of the block, +x north-east toward Ford Drive, -y south-east to the
 * Bellflower Road front), origin at the OSM outline's area centroid
 * (-81.6080083, 41.5099546). z = 0 is the street round the building (the
 * site is flat to under a metre). elevation 0.
 *
 * Form: Gehry's cascade of stainless-steel ribbons over and in front of a
 * U of plain red-brick office blocks. Drawn as: four brick blocks with
 * grouped window panels (a 22.5 m block at the back west, 18.2 m blocks at
 * the west end, back east and east end); a steel-clad core under two big
 * "rolls" (smooth lofted bodies with a sharp crest, the west one the
 * highest point at 33 m) each with a thin curling lip; along the front a
 * long steel barrel lifted over the glazed lettering front and a leaning
 * steel cone east of the front notch, its top a sweeping lip; cream-
 * soffited curling canopies off the brick at both ends and over the two
 * end entrances; the S-curved steel wall between the back wings.
 *
 * Sources
 * - OSM (ODbL): way/108349160 (building=university, roof:shape many,
 *   architect Frank Gehry, wikidata Q118383040), the only building or part
 *   in the outline; replaced.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 0.5 m grid read in this frame. Street ~2.5 m over the
 *   box's lowest return. Back-west brick roof 22.5 m; west, back-east and
 *   east brick roofs 18.2; the west roll's crest 33 m at x -24..-12,
 *   y -10..0; the east roll ~28 m at x 8..20; the front steel 13-18.5 m;
 *   the core between the rolls ~12-14 m.
 * - USGS NAIP (public domain): plan, brown gravel roofs, the steel's spread.
 * - Published: 2002, Frank Gehry, for the Weatherhead School of Management
 *   (Wikipedia, "Peter B. Lewis Building").
 * - Photos (EVIDENCE):
 *   - "Peter B Lewis (PBL) Building Case Western Reserve.jpg", Usaf 1832,
 *     CC BY 4.0, https://commons.wikimedia.org/wiki/File:Peter_B_Lewis_(PBL)_Building_Case_Western_Reserve.jpg
 *     (from the south-west: brick block, wave canopy, the rolls)
 *   - "Peter B. Lewis Building - oblique 1.jpg" and "- oblique 2.jpg",
 *     Daderot, public domain,
 *     https://commons.wikimedia.org/wiki/File:Peter_B._Lewis_Building_-_oblique_1.jpg
 *     https://commons.wikimedia.org/wiki/File:Peter_B._Lewis_Building_-_oblique_2.jpg
 *     (the front from the east: lettering front, leaning cone, entrance)
 *   - "Peter B. Lewis Building view from above.jpg", Percival Kestreltail,
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Peter_B._Lewis_Building_view_from_above.jpg
 *     (drone, plan of brick roofs and steel)
 *   - "Weatherhead School of Management building.jpg", Packer1028, CC0,
 *     https://commons.wikimedia.org/wiki/File:Weatherhead_School_of_Management_building.jpg
 *     (east end: brick block and its canopy)
 *   - "Peter B. Lewis Bldg.JPG", Harmanani, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Peter_B._Lewis_Bldg.JPG
 *   - "Lewis Building, Cleveland,OH.jpg", Richard A. Weaver, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Lewis_Building,_Cleveland,OH.jpg
 *   - "PBLBroof.JPG", CC BY 2.5, https://commons.wikimedia.org/wiki/File:PBLBroof.JPG
 *     (from the north, the rolls over the brick)
 * Estimated from the photos: every steel section (feet, crests, lips), the
 *   canopy heights (10.5-14 m), window grouping, the glazed front (6 m).
 * Invented: the exact twist of each sheet; Gehry's surfaces are drawn as
 *   a few lofted sections, not traced.
 * Left out: the shingled panel pattern, skylights and roof terraces inside
 *   the rolls, the lettering ("Peter B. Lewis Building"), mullions.
 * Doubts: the back (north-west) faces are seen only from afar; the back
 *   S-wall's shape is read from the drone photo and lidar only.
 * Night: brick windows and the glazed fronts glow; the steel is unlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw } from './sea-columbia-center'
import { type Block, buildBlocks, writeModel } from './cle-200-public-square'
import { finishGlb } from './sea-columbia-center'

// ---------------------------------------------------------------- smooth-surface helpers (exported for my other cle- models)

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sc = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** Catmull-Rom through points, `n` samples per span. */
export function spline(pts: V3[], n: number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push([0, 1, 2].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)) as V3)
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/** Smooth vertex normals of a grid G[i][j]; `wrap` closes j. */
function gridNormals(G: V3[][], wrap: boolean): V3[][] {
  const ni = G.length, nj = G[0].length
  return G.map((row, i) => row.map((_, j) => {
    const du = subv(G[Math.min(ni - 1, i + 1)][j], G[Math.max(0, i - 1)][j])
    const jp = wrap ? (j + 1) % nj : Math.min(nj - 1, j + 1), jm = wrap ? (j - 1 + nj) % nj : Math.max(0, j - 1)
    const dv = subv(row[jp], row[jm])
    return unit(crs(du, dv))
  }))
}

/** Emit a smooth grid surface; normals `N` say which side is out. */
function gridEmit(p: Part, G: V3[][], N: V3[][], wrap: boolean) {
  const ni = G.length, nj = G[0].length
  for (let i = 0; i < ni - 1; i++)
    for (let j = 0; j < (wrap ? nj : nj - 1); j++) {
      const l = (j + 1) % nj
      // a duplicated column is a crease: skip its zero-width strip
      if (Math.hypot(...subv(G[i][j], G[i][l])) < 1e-6 && Math.hypot(...subv(G[i + 1][j], G[i + 1][l])) < 1e-6) continue
      p.tri(G[i][j], G[i + 1][j], G[i + 1][l], undefined, undefined, undefined, [N[i][j], N[i + 1][j], N[i + 1][l]])
      p.tri(G[i][j], G[i + 1][l], G[i][l], undefined, undefined, undefined, [N[i][j], N[i + 1][l], N[i][l]])
    }
}

/**
 * A closed smooth body lofted through closed sections (each the same number
 * of points), interpolated `n` steps per span, flat end caps.
 */
export function body(p: Part, sections: V3[][], n = 3, caps = true) {
  const m = sections[0].length
  const cols = Array.from({ length: m }, (_, j) => spline(sections.map((s) => s[j]), n))
  const G = cols[0].map((_, i) => cols.map((c) => [c[i][0], c[i][1], Math.max(0, c[i][2])] as V3))
  let N = gridNormals(G, true)
  const mid = G[Math.floor(G.length / 2)], c = sc(mid.reduce((s, q) => add(s, q), [0, 0, 0] as V3), 1 / m)
  const k = Math.floor(m / 4)
  if (dot(N[Math.floor(G.length / 2)][k], subv(mid[k], c)) < 0) N = N.map((r) => r.map((v) => sc(v, -1)))
  gridEmit(p, G, N, true)
  if (!caps) return
  for (const [ring, sgn] of [[G[0], -1], [G[G.length - 1], 1]] as [V3[], number][]) {
    const cc = sc(ring.reduce((s, q) => add(s, q), [0, 0, 0] as V3), 1 / m)
    const axis = subv(sgn > 0 ? G[G.length - 1][0] : G[0][0], sgn > 0 ? G[G.length - 2][0] : G[1][0])
    for (let j = 0; j < m; j++) {
      const a = ring[j], b = ring[(j + 1) % m]
      const nn = crs(subv(a, cc), subv(b, cc))
      if (dot(nn, axis) >= 0) p.tri(cc, a, b); else p.tri(cc, b, a)
    }
  }
}

/**
 * A thin smooth sheet through open section polylines (rows, same count),
 * `t` thick: the side facing `up` in `top`, the other in `under`, rims in `top`.
 */
export function sheet(top: Part, under: Part, rows: V3[][], up: V3, t = 0.35, n = 3, nv = 2) {
  const m0 = rows[0].length
  const dense = rows.map((r) => spline(r, nv))
  const m = dense[0].length
  const cols = Array.from({ length: m }, (_, j) => spline(dense.map((s) => s[j]), n))
  const G = cols[0].map((_, i) => cols.map((c) => [c[i][0], c[i][1], Math.max(0, c[i][2])] as V3))
  let N = gridNormals(G, false)
  const ci = Math.floor(G.length / 2), cj = Math.floor(m / 2)
  if (dot(N[ci][cj], up) < 0) N = N.map((r) => r.map((v) => sc(v, -1)))
  const B = G.map((r, i) => r.map((q, j) => add(q, sc(N[i][j], -t))))
  const NB = N.map((r) => r.map((v) => sc(v, -1)))
  gridEmit(top, G, N, false)
  gridEmit(under, B, NB, false)
  // rims
  const rim = (a: V3[], b: V3[]) => {
    for (let k = 0; k < a.length - 1; k++) {
      const q = [a[k], a[k + 1], b[k + 1], b[k]] as V3[]
      const nn = crs(subv(q[1], q[0]), subv(q[3], q[0]))
      // face away from the sheet's middle
      const mid = G[ci][cj]
      if (dot(nn, subv(q[0], mid)) >= 0) top.quad(q[0], q[1], q[2], q[3]); else top.quad(q[0], q[3], q[2], q[1])
    }
  }
  rim(G[0], B[0]); rim(G[G.length - 1], B[B.length - 1])
  rim(G.map((r) => r[0]), B.map((r) => r[0])); rim(G.map((r) => r[m - 1]), B.map((r) => r[m - 1]))
  void m0
}

/**
 * A sail section in the plane x = const: a face leaning out from its foot
 * (yf, zb) to a sharp crest at height H overhanging the foot by `over`, then
 * a concave back dropping to (yb, zbb). The crest is a crease (duplicated
 * point). `yc` is unused but kept for the call sites' readability.
 */
function wave(x: number, yf: number, yb: number, zb: number, H: number, _yc: number, over: number, zbb = zb): V3[] {
  const s = Math.sign(yb - yf) // +1: front is toward -y
  const cy = yf - s * over, h = H - zb
  const front = spline([[x, yf, zb], [x, yf - s * over * 0.25, zb + h * 0.45], [x, yf - s * over * 0.7, zb + h * 0.85], [x, cy, H]], 2)
  const back = spline([[x, cy, H], [x, cy + s * (yb - cy) * s * 0.3, H - (H - zbb) * 0.12], [x, cy + s * (yb - cy) * s * 0.75, zbb + (H - zbb) * 0.35], [x, yb, zbb]], 2)
  return [...front, ...back]
}

/** A horizontal ellipse at height z. */
function ell(cx: number, cy: number, rx: number, ry: number, z: number, seg = 16, rot = 0, tilt = 0): V3[] {
  return Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * 2 * Math.PI, x = rx * Math.cos(a), y = ry * Math.sin(a)
    return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot), z - tilt * y] as V3
  })
}

// ---------------------------------------------------------------- the model

function build() {
  const brick = new Part(), steel = new Part(), soffit = new Part(), win = new Part(), roof = new Part()

  // Brick blocks (frame metres, bearing 312: +y north-west to the back, -y
  // south-east to Bellflower Road), heights above the street.
  const H_NW = 22.5, H_LOW = 18.2, H_CORE = 13
  const grid = { bay: 1.6, pier: 2.6, group: 8.4, spandrel: 2.0, from: 1.0, edge: 1.8, head: 2.2, foot: 2.0 }
  const blocks: Block[] = [
    { ring: ccw([[-36, 9], [-4, 9], [-4, 26.5], [-12, 27], [-21, 26.5], [-28, 28], [-35, 27], [-36, 22]]), z1: H_NW, wall: brick, roof, kind: 'brick', grid },
    { ring: ccw([[-41.5, -3], [-31, -3], [-31, 9], [-36, 9], [-36, 11], [-40, 11], [-42, 6]]), z1: H_LOW, wall: brick, roof, kind: 'brick', grid },
    { ring: ccw([[4, 10], [38, 10], [38, 27], [30, 26], [24, 23.5], [12, 25], [4, 23.5]]), z1: H_LOW, wall: brick, roof, kind: 'brick', grid },
    { ring: ccw([[28, -15], [37, -15], [38, -5], [41, -4], [46, 4], [43, 8], [38, 10], [28, 10]]), z1: H_LOW, wall: brick, roof, kind: 'brick', grid },
    // the steel-clad core under the rolls, its roof the terraces between them
    { ring: ccw([[-31, -16], [28, -16], [28, 10], [4, 10], [-4, 9], [-31, 9]]), z1: H_CORE, wall: steel, roof, kind: 'core', grid: null },
  ]
  buildBlocks(blocks, win)

  // Glass curtain under the front barrel and at the two entrances.
  const glassWall = (x0: number, x1: number, y: number, z1: number) => {
    win.quad([x0, y, 0.3], [x1, y, 0.3], [x1, y, z1], [x0, y, z1])
  }
  // the glazed lettering front, recessed under the barrel's raised middle
  win.quad([-15, -24.5, 0], [4, -24.5, 0], [4, -24.5, 6], [-15, -24.5, 6])
  glassWall(5, 9, -19.2, 15) // the entrance at the front notch
  void glassWall

  // B1: the big roll west of centre, crest 33 m (lidar).
  body(steel, [
    wave(-31, -14, 9, 10, 22, 0, -4),
    wave(-24, -16.5, 9, 10, 31, 0, -6),
    wave(-16, -16, 9, 10, 33, 0, -7),
    wave(-9, -14.5, 9, 10, 29, 0, -9),
    wave(-4, -12, 8, 10, 21, 0, -10),
  ], 3)
  // its curling lip, rolling forward over the front
  sheet(steel, soffit, [
    [[-27, -7, 27], [-26, -13, 29.5], [-25, -18.5, 27.5], [-24.5, -21, 23]],
    [[-18, -5, 31.5], [-18, -12, 33.5], [-18, -19, 31], [-18, -22, 26]],
    [[-10, -2, 28], [-10, -9, 30.5], [-10.5, -15, 29], [-11, -17.5, 25.5]],
  ], [0, -0.3, 1], 0.4, 3, 3)

  // B2: the roll east of centre, crest 28 m.
  body(steel, [
    wave(2, -12, 10, 10, 20, 0, -9),
    wave(8, -15, 10, 10, 27, 0, -9),
    wave(15, -15.5, 10, 10, 28.5, 0, -10),
    wave(22, -14, 10, 10, 25, 0, -8),
    wave(27, -13, 10, 10, 19, 0, -6),
  ], 3)

  // its lip, curling forward and up over the cone
  sheet(steel, soffit, [
    [[5, -1, 19.5], [5, -7, 22], [5.5, -12, 21], [6, -15, 23.5]],
    [[13, -2, 27], [13, -8, 29.5], [13, -14, 27.5], [13, -18, 30]],
    [[22, 0, 23.5], [22, -6, 25.5], [21.5, -11, 24], [21, -14, 26]],
  ], [0, -0.3, 1], 0.4, 3, 3)

  // B3: the front barrel, x -33..6: down to the ground at the west end,
  // lifted over the glazed lettering front in the middle.
  body(steel, [
    wave(-33, -26, -15, 0, 14, 0, 1, 10),
    wave(-25, -28, -15, 0, 18, 0, 2.5, 11),
    wave(-17, -27, -15, 3, 19, 0, 3, 11),
    wave(-7, -25, -15, 6, 18, 0, 3.5, 11),
    wave(0, -25, -15, 6, 17, 0, 3, 11),
    wave(6, -25, -15, 5, 15, 0, 2, 11),
  ], 3)

  // B4: the leaning cone east of the entrance, its top rolled into a lip.
  {
    const rings: V3[][] = [
      ell(18.5, -20.0, 8.0, 5.5, 0, 16, 0.12),
      ell(18.2, -21.6, 8.6, 6.2, 5, 16, 0.12, 0.1),
      ell(17.8, -23.4, 9.3, 6.9, 10, 16, 0.12, 0.2),
      ell(17.3, -25.0, 9.9, 7.4, 15, 16, 0.12, 0.3),
    ]
    body(steel, rings, 2)
    // the lip: a sheet sweeping from the cone's top back over the roll
    sheet(steel, soffit, [
      [[8, -26, 15], [9, -22, 18.5], [10, -16, 21]],
      [[17, -30, 17.5], [17, -24, 20], [17, -16, 23]],
      [[26, -27, 15.5], [25, -22, 18], [24, -16, 20]],
    ], [0, 0, 1], 0.4, 3, 3)
  }

  // B5: the east curl, a cream-soffited canopy off the east block's top.
  sheet(steel, soffit, [
    [[37, -12, H_LOW - 0.3], [41.5, -12.5, H_LOW + 0.6], [45, -13, H_LOW + 3.2]],
    [[38, -2, H_LOW - 0.3], [43.5, -1.5, H_LOW + 0.2], [48, -1, H_LOW + 2.4]],
    [[39, 8, H_LOW - 0.3], [43, 9, H_LOW + 0.8], [46, 11, H_LOW + 4]],
  ], [0, 0, 1], 0.35, 3, 3)
  // B6: the west curl over the west block.
  sheet(steel, soffit, [
    [[-30, -3, H_LOW + 0.5], [-36, -4, H_LOW + 2.5], [-42, -6, H_LOW + 1.5], [-45, -8, H_LOW - 2]],
    [[-30, 5, H_LOW + 1.5], [-37, 5, H_LOW + 4.2], [-43, 5, H_LOW + 2.6], [-46.5, 5, H_LOW - 1]],
    [[-30, 13, H_LOW + 0.5], [-36, 13, H_LOW + 3], [-41, 14, H_LOW + 2], [-44, 15, H_LOW - 1.5]],
  ], [0, 0, 1], 0.35, 3, 3)
  // B7: the S-curved steel wall running back between the two brick wings.
  sheet(steel, steel, [
    [[-3, 9, H_CORE - 0.5], [1, 15, H_CORE - 0.5], [-2, 22, H_CORE - 0.5], [1, 29.5, H_CORE - 0.5]],
    [[-2, 9, 20], [3, 15, 22], [-1, 22, 23], [2.5, 30, 22]],
    [[0, 8, 25], [5, 15, 26.5], [1, 22, 26], [4, 29, 24]],
  ], [1, 0, 0], 0.8, 2, 3)
  // B8 and B9: the entrance canopies by the east and west brick blocks.
  sheet(steel, soffit, [
    [[27.5, -15, 11.5], [27.5, -21, 12.5], [28, -27, 15.5]],
    [[32, -15, 11.5], [32.5, -22, 12], [33.5, -29, 14.5]],
    [[37, -15, 11.8], [37.5, -20, 13.5], [38.5, -24, 17]],
  ], [0, 0, 1], 0.35, 3, 3)
  sheet(steel, soffit, [
    [[-31, -16, 10.5], [-31.5, -21, 13.5], [-32.5, -26, 11], [-33.5, -30, 15]],
    [[-36, -15.5, 12.5], [-37, -20, 10], [-38.5, -24, 14.5], [-39.5, -27, 12]],
    [[-41, -3, 10.5], [-43.5, -7, 13.5], [-46, -11, 11], [-48, -14, 14]],
  ], [0, 0, 1], 0.35, 3, 3)
  glassWall(-41, -33, -3.2, 10.5)

  return finishGlb('cle-peter-b-lewis-building', 'Peter B. Lewis Building', [
    { part: brick, material: finish('pbl-brick', 0xb8735c) },
    { part: steel, material: finish('pbl-steel', 0xcfd4d9, 0.4) },
    { part: soffit, material: finish('pbl-soffit', 0xeee5d6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('pbl-roof', 0xa39a91) },
  ], { bearing: 312, height: 33.5, replaces: ['way/108349160'] }, 6500)
}

if (import.meta.main) await writeModel('cle-peter-b-lewis-building', build())
