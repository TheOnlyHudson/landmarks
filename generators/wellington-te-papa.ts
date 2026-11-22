/**
 * Museum of New Zealand Te Papa Tongarewa, Cable Street, Wellington
 * waterfront: procedural, CC0-1.0.
 * bun generators/wellington-te-papa.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the plan is drawn
 * straight from OSM). Origin at the area centroid of the OSM outline
 * way/190557095 (174.7820648, -41.2903930). The site is reclaimed harbour
 * edge and flat; y = 0 is the forecourt level.
 *
 * Jasmax, opened 1998. A 36,000 m2 museum of several clashing blocks that
 * the architects describe as the meeting of the "Maori" and "Pakeha" sides:
 * - the grey, blue-grey stone-clad SW block at the corner of the forecourt
 *   and Cable Street, ending in a thin prow wall pierced by two big square
 *   openings, with a curved metal "wave" blade roof sweeping up over it;
 * - the long sandstone-coloured Cable Street block, its monopitch roof
 *   oversailing the street on V-pairs of steel struts, its ground storeys
 *   of coloured glazing between piers;
 * - the NW sandstone block: a sharp wedge whose roof slopes up to a high
 *   prow at the harbour corner, curving into the entrance as the curved
 *   wall with the purple triangle frieze and the radial louvre canopy;
 * - the glazed entrance atrium between them, under a glass gable canopy;
 * - the low grey harbour-side block along the channel, its east tip
 *   sloping down to the quay;
 * - the central sandstone mass, its roof carrying a segmental barrel vault
 *   behind the round glass stair tower on the east front, two gabled
 *   gallery boxes and the steel arch over the Te Marae end.
 *
 * Plan: OSM way/190557095 (134 nodes, 6 levels, no height), split here into
 * those blocks along lines read from the photos (t4, t5, t7, t9). The thin
 * prow wall is in OSM: the outline's SW tip is a strip 4.9 m wide.
 * Published: 36,000 m2, opened 14 February 1998, architects Jasmax (Pete
 * Bossley, Ivan Mercep) (Wikipedia "Museum of New Zealand Te Papa
 * Tongarewa"). No published heights.
 * Photo-scaled heights: the grey block 27 m (t3: 510 px for the face, its
 * square openings at 7-12.9 and 17.2-24.1 m, 5.3 and 7.4 m wide, by the
 * door heights); the Cable Street block 22-24.5 m under its monopitch roof
 * (t7: two glazed storeys of about 9 m under the struts, the struts rising
 * from about 12 m); the NW wedge 20-21 m at its low ends and 30 m at the
 * prow (t6); the curved wall 21 m (t1); the harbour block 18 m (t4); the
 * centre 21 m, the barrel's crown about 29.5 m and the arch's 33.5 m (t4,
 * t9).
 * Estimated: the internal block lines, the rooftop boxes' size and place,
 * the barrel's span (30 m), the arch (taken to run along the vault's crown,
 * 40 m; t4 sees it broadside from the harbour), the strut count (11 pairs,
 * t7), the louvre count.
 * The entrance canopy (OSM building=roof way/1030319478) and the canopy
 * along the grey face (way/1030319477) are drawn and replaced.
 * Left out: the Te Marae coloured roof panels, the rooftop plant, signs and
 * banners, the "TE PAPA" fingerprint pylon, the Bush City garden.
 *
 * Lead review round 1: sandstone golden 0xd9ae58 and the angular block
 * dark brown stone 0x7a5a48 (t5); round 2: the NW block level at 24.5 m and the brown block raised to 30 m; raised frieze triangles. Round 1: the NW block's roof near level
 * so its curved front reads; the wave blade a bold upturned eave (10 m rise
 * over its length); the barrel lowered to a 4 m rise and the arch truss
 * left out (barely seen from the forecourt); purple and white triangles.
 * Earlier colour notes (sample.ts in the work folder): sandstone panels #c0af87 /
 * #c5b48a (t1, sun), #dfc378 (t5, evening sun) -> 0xd3bf8f; grey stone
 * #838480 / #858b96 (t1, t3) -> 0x8b8e94; purple triangles -> 0x9584b8;
 * the blade and roofs pale silver (t3 #e8edf3, sun) -> 0xbfc6cc; glazing
 * `window`; the entrance canopy glass.
 *
 * Night (no night photo checked): the coloured glazing, the atrium and the stair
 * tower are lit; walls unlit.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - t1 "Museum of New Zealand Te Papa Tongarewa - Wellington, NZ - DSC09543.jpg", Daderot, CC0
 * - t3 "Exterior of Te Papa, 2016-01-25.jpg", Szilas, public domain
 * - t4 "Museum of New Zealand Te Papa Tongarewa (harbour side).jpg", Ulrich Lange, CC BY 3.0
 * - t5 "Museum of New Zealand Te Papa Tongarewa.jpg", Ulrich Lange, CC BY 3.0
 * - t6 "Exterior view of Te Papa from the Wellington Waterfront.jpg", Museum of New Zealand Te Papa Tongarewa, CC BY-SA 4.0
 * - t7 "Te Papa (National Museum), Wellington.jpg", Phillip Capper, CC BY 2.0
 * - t8 "Museum of New Zealand - 2013.04 - panoramio.jpg", rheins, CC BY 3.0
 * - t9 "Wellington view of the City from the top of Mt Victoria.jpg", itravelNZ, CC BY 2.0
 * No look-only references. No open aerial was found; the roof is read from
 * t9 (from Mt Victoria) and t4, and is the least certain part.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, tube, face, skin, ccw, saveLods, type XY, type Layer } from './sydney-tower-eye'
import { polyTris } from './berlin-oberbaum-bridge'

// ---- Helpers --------------------------------------------------------------------------------------------

/** Keep the part of a polygon where n.p <= c. */
function clip(poly: XY[], n: XY, c: number): XY[] {
  const out: XY[] = []
  const f = (p: XY) => n[0] * p[0] + n[1] * p[1] - c
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa <= 0) out.push(a)
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}

/** A block over a polygon with a planar (or flat) top z = top(x, y): walls in `wall`, top in `roof`. */
function block(wall: Part, roof: Part, poly: XY[], z0: number, top: (x: number, y: number) => number) {
  const r = ccw(poly)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-3) continue
    face(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top(b[0], b[1])], [a[0], a[1], top(a[0], a[1])]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
  for (const [a, b, c] of polyTris(r)) {
    const A: V3 = [a[0], a[1], top(a[0], a[1])], B: V3 = [b[0], b[1], top(b[0], b[1])], C: V3 = [c[0], c[1], top(c[0], c[1])]
    const e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
    const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    face(roof, [A, B, C], n[2] < 0 ? (n.map((x) => -x) as V3) : n)
  }
}

/** A plane through three points [x, y, z], as z(x, y). */
function plane(p: V3, q: V3, r: V3) {
  const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  return (x: number, y: number) => p[2] - (n[0] * (x - p[0]) + n[1] * (y - p[1])) / n[2]
}

/** A flush panel on the wall a->b (outside on the right), s along the wall, `off` proud of it. */
function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const W = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
  face(p, [W(s0, z0), W(s1, z0), W(s1, z1), W(s0, z1)], [n[0], n[1], 0])
}

/** A flush triangle (point down) on the wall a->b. */
function tri(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, off = 0.08) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const W = (ss: number, z: number): V3 => [a[0] + u[0] * ss + n[0] * off, a[1] + u[1] * ss + n[1] * off, z]
  face(p, [W(s - w / 2, z1), W(s, z0), W(s + w / 2, z1)], [n[0], n[1], 0])
}

/** A raised triangle (point down) standing `dep` proud of the wall a->b, with its edges returned. */
function raisedTri(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, dep: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const W = (ss: number, z: number, d: number): V3 => [a[0] + u[0] * ss + n[0] * d, a[1] + u[1] * ss + n[1] * d, z]
  const pts: [number, number][] = [[s - w / 2, z1], [s, z0], [s + w / 2, z1]]
  face(p, pts.map(([q, z]) => W(q, z, dep)), [n[0], n[1], 0])
  for (let i = 0; i < 3; i++) {
    const [q0, z0_] = pts[i], [q1, z1_] = pts[(i + 1) % 3]
    const es = q1 - q0, ez = z1_ - z0_, cs = s, cz = (z0 + 2 * z1) / 3
    let ns = ez, nz = -es
    if (ns * ((q0 + q1) / 2 - cs) + nz * ((z0_ + z1_) / 2 - cz) < 0) { ns = -ns; nz = -nz }
    face(p, [W(q0, z0_, 0), W(q1, z1_, 0), W(q1, z1_, dep), W(q0, z0_, dep)], [u[0] * ns, u[1] * ns, nz])
  }
}

const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const flat = (z: number) => (_x?: number, _y?: number) => z

// ---- Plan (OSM way/190557095, centroid frame) -----------------------------------------------------------------------

// Cable Street (SW) front, west to east.
const CABLE: XY[] = [[-71.8, -32.0], [-54.7, -39.2], [-45.6, -43.1], [-39.4, -45.8], [-32.6, -48.6], [-16.0, -55.7], [0.3, -62.6], [16.6, -69.5], [22.9, -72.1], [30.9, -75.5]]
// The curved entrance wall, from the atrium to the NW block's west face.
const ARC: XY[] = [[-58.4, -0.1], [-59.3, -0.2], [-60.4, -0.3], [-61.4, -0.3], [-62.5, -0.3], [-63.7, -0.1], [-64.8, 0.1], [-65.8, 0.4], [-66.6, 0.8], [-67.6, 1.2], [-68.6, 1.8], [-69.6, 2.5], [-70.2, 3.0], [-71.8, 4.5], [-72.9, 6.0], [-73.7, 7.5], [-74.4, 9.4], [-74.8, 11.3]]
const NOTCH_A: XY = [-54.5, -10.6] // grey block's corner at the atrium
const INNER_W: XY = [-38.8, -17.1] // where the grey block, the Cable St block and the atrium meet
const INNER_E: XY = [38.6, -41.8] // Cable St block's inner edge at the east front
const ATR_E: XY = [-43.8, 1.6]

// Grey SW block: the face line from the atrium corner to the prow tip.
const FACE_A = NOTCH_A, FACE_B: XY = [-82.1, -34.5]
const FACE_L = Math.hypot(FACE_B[0] - FACE_A[0], FACE_B[1] - FACE_A[1])
const FU: XY = [(FACE_B[0] - FACE_A[0]) / FACE_L, (FACE_B[1] - FACE_A[1]) / FACE_L]
const FN: XY = [FU[1], -FU[0]] // outward (north-west)
const onFace = (s: number, d = 0): XY => [FACE_A[0] + FU[0] * s + FN[0] * d, FACE_A[1] + FU[1] * s + FN[1] * d]
const BLADE_S0 = 27.1, BLADE_T = 4.85 // the prow wall: from s 27.1 to the tip, 4.85 m thick (OSM)
const G_BODY: XY[] = [FACE_A, onFace(BLADE_S0), onFace(BLADE_S0, -BLADE_T), [-54.7, -39.2], [-45.6, -43.1], INNER_W]
const G_H = 30

const L_POLY: XY[] = [[-45.6, -43.1], ...CABLE.slice(3), [30.3, -66.6], [30.0, -63.5], [30.0, -62.3], [31.7, -58.2], [34.3, -51.8], [36.2, -52.6], [37.0, -45.6], INNER_E, INNER_W]
const N_POLY: XY[] = [...ARC, [-77.3, 31.5], [-74.9, 31.8], [-76.3, 42.6], [-72.6, 40.9], [-70.3, 39.9], [-69.0, 42.9], [-37.5, 29.5], [-38.8, 26.4], ATR_E]
const A_POLY: XY[] = [[-58.4, -0.1], ATR_E, INNER_W, NOTCH_A, [-54.6, -10.3], [-56.5, -5.2]]
const H_IN: XY = [9.8, 18.3]
const H_POLY: XY[] = [[-3.2, 33.5], [15.8, 49.8], [15.9, 49.7], [27.9, 59.8], [26.4, 61.5], [28.0, 63.0], [29.8, 62.6], [31.7, 64.4], [31.0, 65.2], [33.1, 67.0], [37.8, 69.6], [38.4, 68.8], [51.0, 79.6], [56.4, 84.2], [56.8, 83.8], [63.8, 89.6], [66.7, 86.3], [61.4, 81.6], [56.6, 77.4], [69.4, 62.4], [67.1, 60.5], [62.4, 56.8], H_IN]
const TOWER: XY = [50.7, -21.6], TOWER_R = 4.7
const C_POLY: XY[] = [ATR_E, INNER_W, INNER_E, [45.3, -26.0], [53.8, -16.3], [58.4, -11.3], [60.6, -10.0], [64.9, -7.6], [58.2, 0.3], [56.9, -0.8], [56.5, -0.2], [49.0, 8.2], [49.8, 10.7], [51.9, 16.7], [53.9, 20.9], [55.1, 27.7], [58.3, 40.4], [62.4, 56.8], H_IN, [-3.2, 33.5], [-11.1, 43.0], [-12.3, 43.9], [-14.0, 44.0], [-15.8, 40.2], [-17.4, 37.2], [-20.5, 35.9], [-25.5, 28.1], [-24.1, 27.2], [-25.9, 25.0], [-28.4, 22.0], [-38.8, 26.4]]

// ---- Build ---------------------------------------------------------------------------------------------

const sand = new Part(), grey = new Part(), win = new Part(), silver = new Part(), purple = new Part(), glass = new Part()

// Grey SW block and its prow wall with the two square openings.
block(grey, silver, G_BODY, 0, flat(G_H))
{
  const a = onFace(BLADE_S0, -BLADE_T / 2), b = onFace(FACE_L, -BLADE_T / 2), d = BLADE_T / 2, L = FACE_L - BLADE_S0
  const sq = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
  // openings measured from the tip (t3): upper 2.9-10.3 m, lower 3.5-8.8 m
  skin(grey, null, a, b, 0, G_H, d, [sq(L - 10.3, L - 2.9, 17.2, 24.1), sq(L - 8.8, L - 3.5, 7.0, 12.9)], { through: true, ends: false, top: false })
  // the top and the tip end, full thickness
  const P = (s: number, dd: number, z: number): V3 => { const q = onFace(BLADE_S0 + s, -BLADE_T / 2 + dd); return [q[0], q[1], z] }
  face(silver, [P(0, -d, G_H), P(L, -d, G_H), P(L, d, G_H), P(0, d, G_H)], [0, 0, 1])
  face(grey, [P(L, -d, 0), P(L, d, 0), P(L, d, G_H), P(L, -d, G_H)], [FU[0], FU[1], 0])
}
// vertical slit openings on the brown face (t5)
for (const sc of [3.2, 24.5]) panel(win, FACE_A, FACE_B, sc, sc + 0.9, 6, 22, 0.06)
// window strips on the grey face (t3)
for (const [z0, z1] of [[8.4, 10.0], [13.6, 15.2], [19.2, 20.8]]) {
  panel(win, FACE_A, FACE_B, 6, 13, z0, z1)
  panel(win, FACE_A, FACE_B, 15.5, 22.5, z0, z1)
}
// the white canopy along the foot of the grey face (t3; OSM building=roof way/1030319477)
{
  const A = onFace(0.5, 0), B = onFace(BLADE_S0 - 0.5, 0), A2 = onFace(0.5, 3.2), B2 = onFace(BLADE_S0 - 0.5, 3.2)
  const z0 = 4.3, z1 = 4.8
  const P = (q: XY, z: number): V3 => [q[0], q[1], z]
  face(silver, [P(A, z1), P(B, z1), P(B2, z1), P(A2, z1)], [0, 0, 1])
  face(silver, [P(A, z0), P(A2, z0), P(B2, z0), P(B, z0)], [0, 0, -1])
  face(silver, [P(A2, z0), P(A2, z1), P(B2, z1), P(B2, z0)], [FN[0], FN[1], 0])
  face(silver, [P(A, z0), P(A, z1), P(A2, z1), P(A2, z0)], [-FU[0], -FU[1], 0])
  face(silver, [P(B2, z0), P(B2, z1), P(B, z1), P(B, z0)], [FU[0], FU[1], 0])
}
// The wave blade: a curved plate along the face, sweeping up to the prow and past it.
{
  const n = 14, s0 = 6, s1 = FACE_L + 4, d0 = -1.0, d1 = -12, th = 1.0
  const zAt = (t: number) => G_H + 0.8 + 10 * t * t * t // a bold upturned eave (t5, lead review)
  const top: V3[] = [], bot: V3[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, s = s0 + (s1 - s0) * t
    for (const [d, arr] of [[d0, 0], [d1, 1]] as [number, number][]) {
      const q = onFace(s, d), z = zAt(t) + (arr ? 0.8 : 0) // a slight cross-fall
      top.push([q[0], q[1], z]); bot.push([q[0], q[1], z - th])
    }
  }
  for (let i = 0; i < n; i++) {
    const k = i * 2
    face(silver, [top[k], top[k + 2], top[k + 3], top[k + 1]], [0, 0, 1])
    face(silver, [bot[k], bot[k + 1], bot[k + 3], bot[k + 2]], [0, 0, -1])
    face(silver, [bot[k], bot[k + 2], top[k + 2], top[k]], [FN[0], FN[1], 0])
    face(silver, [bot[k + 1], top[k + 1], top[k + 3], bot[k + 3]], [-FN[0], -FN[1], 0])
  }
  const e = n * 2
  face(silver, [bot[e], bot[e + 1], top[e + 1], top[e]], [FU[0], FU[1], 0.3])
  face(silver, [bot[0], top[0], top[1], bot[1]], [-FU[0], -FU[1], 0])
  // two struts under the free end
  for (const d of [-2.5, -8]) {
    const q = onFace(FACE_L - 3, d), r = onFace(FACE_L - 1, d)
    tube(silver, [[q[0], q[1], G_H], [r[0], r[1], zAt((FACE_L - 1 - s0) / (s1 - s0)) - th]], 0.25, 4)
  }
}

// Cable Street block: monopitch top from 24.5 m at the street to 22 m inside; the oversailing roof on struts.
const CU: XY = [(CABLE[9][0] - CABLE[2][0]), (CABLE[9][1] - CABLE[2][1])]
const CL = Math.hypot(CU[0], CU[1]), cu: XY = [CU[0] / CL, CU[1] / CL], cn: XY = [cu[1], -cu[0]] // cn outward (south-west)
const cableDist = (x: number, y: number) => -((x - CABLE[2][0]) * cn[0] + (y - CABLE[2][1]) * cn[1]) // inward distance
const lTop = (x: number, y: number) => 24.5 - (2.5 * cableDist(x, y)) / 30
block(sand, silver, L_POLY, 0, lTop)
{
  // roof plate, 0.6 thick, from 1 m in to 3.5 m out past the street front
  const S0 = -2, S1 = CL + 1.5, out = 3.5, inn = 30
  const P = (s: number, d: number, dz: number): V3 => { const x = CABLE[2][0] + cu[0] * s + cn[0] * d, y = CABLE[2][1] + cu[1] * s + cn[1] * d; return [x, y, 24.5 + (2.5 * d) / 30 + dz] }
  const q = [P(S0, out, 0.7), P(S1, out, 0.7), P(S1, -inn, 0.7), P(S0, -inn, 0.7)]
  const b = [P(S0, out, 0.1), P(S1, out, 0.1), P(S1, -inn, 0.1), P(S0, -inn, 0.1)]
  face(silver, q, [0, 0, 1])
  face(silver, [b[0], b[3], b[2], b[1]], [0, 0, -1])
  face(silver, [b[0], b[1], q[1], q[0]], [cn[0], cn[1], 0])
  face(silver, [b[1], b[2], q[2], q[1]], [cu[0], cu[1], 0])
  face(silver, [b[3], b[0], q[0], q[3]], [-cu[0], -cu[1], 0])
  // 11 V pairs of struts from the face at 12 m to the roof's edge
  for (let i = 0; i < 11; i++) {
    const s = 6 + (i * (CL - 12)) / 10
    const foot = P(s, 0.1, 0), lift = 12 - foot[2]
    const f: V3 = [foot[0], foot[1], foot[2] + lift]
    tube(silver, [f, P(s - 3.2, out - 0.4, 0.1)], 0.22, 4)
    tube(silver, [f, P(s + 3.2, out - 0.4, 0.1)], 0.22, 4)
  }
  // ground storeys: coloured glazing in bays between piers (t7)
  const a = CABLE[2], bb = CABLE[9]
  for (let i = 0; i < 10; i++) {
    const s = 4 + i * ((CL - 8) / 10)
    panel(win, a, bb, s + 1.2, s + (CL - 8) / 10 - 1.2, 1.2, 9.6)
  }
  panel(win, a, bb, 20, 24, 13.5, 16.5) // the small bay window high on the front (t9)
}
// East front: two rows of glazing in five bays (t9), the purple triangles beyond the tower.
{
  const a: XY = [30.9, -75.5], b: XY = [45.3, -26.0]
  // follow the front's real jogs loosely: panels on its straight upper reach
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let i = 0; i < 5; i++) {
    const s = 22 + i * 5.6
    if (s + 4.4 > L - 1) break
    panel(win, a, b, s, s + 4.4, 1.5, 5.0, 0.9)
    panel(win, a, b, s, s + 4.4, 6.0, 9.4, 0.9)
  }
  const c: XY = [53.8, -16.3], d: XY = [64.9, -7.6]
  for (let i = 0; i < 4; i++) tri(purple, c, d, 2.2 + i * 2.6, 2.1, 17.0, 19.6)
}
// Round glass stair tower.
lathe(win, TOWER, [[TOWER_R, 0], [TOWER_R, 24]], 16)
for (const z of [5, 9.5, 14, 18.5]) lathe(silver, TOWER, [[TOWER_R, z - 0.25], [TOWER_R + 0.6, z - 0.2], [TOWER_R + 0.6, z + 0.2], [TOWER_R, z + 0.25]], 16, { crease: 30 })
lathe(silver, TOWER, [[TOWER_R, 24], [TOWER_R + 0.5, 24], [TOWER_R + 0.5, 25], [0.01, 25.2]], 16, { crease: 30 })

// NW sandstone wedge: the roof plane rises to the harbour-corner prow (30 m).
const nTop = flat(24.5) // level, as tall as the brown block's shoulder, so the curved front reads (lead review round 2)
block(sand, silver, N_POLY, 0, nTop)
{
  // the curved wall: a window band (t1), the purple frieze and the louvre canopy
  for (let i = 0; i < ARC.length - 1; i++) {
    const a = ARC[i], b = ARC[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (i > 1 && i < ARC.length - 3) panel(win, a, b, 0, L, 12.8, 14.6)
  }
  // triangles every other segment pair, along the arc
  let acc = 0
  const lens = ARC.slice(0, -1).map((a, i) => Math.hypot(ARC[i + 1][0] - a[0], ARC[i + 1][1] - a[1]))
  const total = lens.reduce((s, x) => s + x, 0)
  const at = (s: number): [XY, XY, number] => { let r = s; for (let i = 0; i < lens.length; i++) { if (r <= lens[i]) return [ARC[i], ARC[i + 1], r]; r -= lens[i] } return [ARC[lens.length - 1], ARC[lens.length], lens[lens.length - 1]] }
  for (let s = 1.6; s < total - 1; s += 2.4) {
    const [a, b, r] = at(s)
    const zt = nTop(a[0], a[1]) - 1.0
    raisedTri(Math.round(s / 2.4) % 2 ? silver : purple, a, b, r, 2.1, zt - 3.2, zt, 0.3)
  }
  void acc
  // louvre canopy: radial ribs from the wall, 3.5 m out, with a curved outer rail
  const rail: V3[] = []
  for (let s = 0.5; s < total; s += 1.8) {
    const [a, b, r] = at(s)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const p: XY = [a[0] + u[0] * r, a[1] + u[1] * r], z = nTop(p[0], p[1])
    const o: V3 = [p[0] + n[0] * 3.6, p[1] + n[1] * 3.6, z + 1.6]
    tube(silver, [[p[0], p[1], z - 0.6], o], 0.14, 3)
    rail.push(o)
  }
  tube(silver, rail, 0.16, 4)
  // windows on the west face and the harbour face (t5, t6): a few broad panels
  const w0: XY = [-74.8, 11.3], w1: XY = [-77.3, 31.5]
  for (const [z0, z1] of [[4.5, 7.5], [11, 14]]) panel(win, w0, w1, 4, 16, z0, z1)
  const h0: XY = [-69.0, 42.9], h1: XY = [-37.5, 29.5]
  for (const [s0, s1] of [[6, 11], [16, 21], [26, 30]]) panel(win, h0, h1, s0, s1, 5, 8)
  panel(win, h0, h1, 4, 14, 12, 14)
}
// Entrance atrium: grey stone with the glass front; a glass gable canopy on two steel trees.
block(grey, silver, A_POLY, 0, flat(20))
{
  const a: XY = [-56.5, -5.2], b: XY = [-54.6, -10.3]
  const fa: XY = [-58.4, -0.1], fb: XY = NOTCH_A
  const L = Math.hypot(fb[0] - fa[0], fb[1] - fa[1])
  panel(win, fa, fb, 0.3, L - 0.3, 0.5, 19.2, 0.08)
  void a; void b
  // canopy: ridge out from the front, glass slopes, posts
  const u: XY = [(fb[0] - fa[0]) / L, (fb[1] - fa[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, d: number, z: number): V3 => [fa[0] + u[0] * s + n[0] * d, fa[1] + u[1] * s + n[1] * d, z]
  const m = L / 2, w = 9, out = 10
  const rid0 = P(m, 0.2, 9.5), rid1 = P(m, out, 9.0), e0a = P(m - w, 0.2, 6.8), e1a = P(m - w, out, 6.4), e0b = P(m + w, 0.2, 6.8), e1b = P(m + w, out, 6.4)
  face(glass, [e0a, e1a, rid1, rid0], [0, 0, 1])
  face(glass, [rid0, rid1, e1b, e0b], [0, 0, 1])
  face(glass, [e0a, rid0, rid1, e1a], [0, 0, -1])
  face(glass, [rid0, e0b, e1b, rid1], [0, 0, -1])
  tube(silver, [rid0, rid1], 0.18, 4); tube(silver, [e0a, e1a], 0.15, 4); tube(silver, [e0b, e1b], 0.15, 4)
  for (const s of [m - 4.5, m + 4.5]) {
    const base = P(s, out - 2.5, 0), head = P(s, out - 2.5, 5.2)
    tube(silver, [base, head], 0.3, 6)
    tube(silver, [head, P(s - 3, out - 0.5, 7.2)], 0.15, 4)
    tube(silver, [head, P(s + 3, out - 0.5, 7.2)], 0.15, 4)
    tube(silver, [head, P(s, 1, 8)], 0.15, 4)
  }
}
// Harbour-side grey block, its east tip sloping to the quay.
{
  const u: XY = [0.759, 0.651], o: XY = [-3.2, 33.5], T = 73.4
  const main = clip(H_POLY, u, u[0] * o[0] + u[1] * o[1] + T)
  const tip = clip(H_POLY, [-u[0], -u[1]], -(u[0] * o[0] + u[1] * o[1] + T))
  block(grey, silver, main, 0, flat(18))
  block(grey, silver, tip, 0, (x, y) => 18 - (16 * ((x - o[0]) * u[0] + (y - o[1]) * u[1] - T)) / 14)
  const a: XY = [-3.2, 33.5], b: XY = [15.8, 49.8]
  // window strips on the harbour face (t4)
  const c: XY = [38.4, 68.8], d: XY = [51.0, 79.6]
  panel(win, b, [27.9, 59.8], 2, 13, 9, 10.6)
  panel(win, c, d, 2, 13, 9, 10.6)
  panel(win, a, b, 3, 22, 3, 5)
}
// Central sandstone mass and its roof structures.
block(sand, silver, C_POLY, 0, flat(21))
{
  // barrel vault behind the stair tower, axis to the west-north-west (t9)
  const ax: XY = [-0.96, 0.28], side: XY = [0.28, 0.96]
  const p0: XY = [46.5, -19.5], len = 38, half = 15, rise = 4, n = 10
  const P = (t: number, k: number, dz = 0): V3 => {
    const a = Math.PI * (k / n), sx = -Math.cos(a) * half, z = 21 + Math.sin(a) * rise + dz
    return [p0[0] + ax[0] * t + side[0] * sx, p0[1] + ax[1] * t + side[1] * sx, z]
  }
  for (let k = 0; k < n; k++) {
    const nrm: V3 = [side[0] * -Math.cos(Math.PI * (k + 0.5) / n), side[1] * -Math.cos(Math.PI * (k + 0.5) / n), Math.sin(Math.PI * (k + 0.5) / n)]
    face(silver, [P(0, k), P(len, k), P(len, k + 1), P(0, k + 1)], nrm)
  }
  // gable ends: the front one rimmed in pale metal (t9)
  const ends = (t: number, sgn: number) => face(sand, Array.from({ length: n + 1 }, (_, k) => P(t, k)), [ax[0] * sgn, ax[1] * sgn, 0])
  ends(0, -1); ends(len, 1)
  for (let k = 0; k < n; k++) tube(silver, [P(-0.3, k, 0.2), P(-0.3, k + 1, 0.2)], 0.3, 4)
  // two gabled gallery boxes (t9)
  const box = (c: XY, L: number, W: number, h: number, ridge: number) => {
    const u = cu, v: XY = [-cn[0], -cn[1]]
    const Q = (a: number, b: number): XY => [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b]
    const poly: XY[] = [Q(-L / 2, -W / 2), Q(L / 2, -W / 2), Q(L / 2, W / 2), Q(-L / 2, W / 2)]
    block(sand, silver, poly, 20.9, flat(h))
    const R0: V3 = [...Q(-L / 2, 0), ridge] as V3, R1: V3 = [...Q(L / 2, 0), ridge] as V3
    const c00: V3 = [...poly[0], h] as V3, c10: V3 = [...poly[1], h] as V3, c11: V3 = [...poly[2], h] as V3, c01: V3 = [...poly[3], h] as V3
    face(silver, [c00, c10, R1, R0], [-v[0], -v[1], 2])
    face(silver, [c01, R0, R1, c11], [v[0], v[1], 2])
    face(sand, [c00, R0, c01], [-u[0], -u[1], 0])
    face(sand, [c10, c11, R1], [u[0], u[1], 0])
  }
  box([-12, -12], 22, 13, 24, 26.5)
  box([8, -14], 16, 11, 23.5, 25.5)
  // (the arch truss along the vault's crown is left out: lead review, barely seen from the forecourt)
}

// ---- Materials and output -----------------------------------------------------------------------------------

const layers: Layer[] = [
  { part: sand, material: finish('te-papa-sandstone', 0xd9ae58) },
  { part: grey, material: finish('te-papa-brown-stone', 0x7a5a48) },
  { part: win, material: PALETTE.window },
  { part: silver, material: finish('te-papa-silver', 0xa9aeb1, 0.6) },
  { part: purple, material: finish('te-papa-purple', 0x9584b8) },
  { part: glass, material: { ...PALETTE.glass, doubleSided: true } as MaterialSpec },
]

if (import.meta.main) {
  await saveLods('wellington-te-papa', 'Museum of New Zealand Te Papa Tongarewa', layers, null, {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, forecourt level',
    bearing: 0, height: 33,
  }, 6500)
}
