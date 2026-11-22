/**
 * Crown Sydney (One Barangaroo), Barangaroo, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-crown-sydney.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin (the
 * anchor) at 151.2010405, -33.8624002, within 4 m of the podium outline's
 * area centroid (OSM way/581013658); y = 0 at the Barangaroo quay.
 *
 * Wilkinson Eyre (2015-2020): a sculptural tower of three glass petals that
 * rise from the podium, swell, twist and taper to rounded tips at the top,
 * with a lower petal (the hotel wing) on its south-east side, over a
 * four-storey podium screened by white V-shaped columns.
 *
 * Published: 271.3 m, 75 storeys (Wikipedia "Crown Sydney"; CTBUH).
 * OSM: the podium outline way/581013658 (height=40, 4 levels); the tower
 * part way/786410713 (height=271, mirror glass) and the lower petal
 * way/786410714 (height=110, mirror glass). Plans are OSM's.
 *
 * The petals: each is a lofted round lobe (three, 120 degrees apart round
 * the tower part's centre), so the grooves between them are real creases.
 * Their spread from photos scaled by the 271 m height: a cigar; k3 (far, from Balmain) reads
 * about 46 m at the widest, a third up, and 0.6 of that across the tips;
 * k6 (from the harbour) a little more; k2 (from the north-east) puts the
 * widest at half height and the top at 0.55 of it.
 * Lead review round 1: the upper third tapers to tips about 0.38 of the
 * widest spread; the petals' centres move out from 0.45 to 0.62 of the
 * spread above 205 m, so the tips part into three fins with notches; the
 * creases are deeper; the wing follows the OSM part rounded (Chaikin).
 * Twist: the balcony grooves turn about 30-40 degrees clockwise (seen from
 * above) from foot to top (k2). Tips: 271, 266 and 261 m, each lobe's top
 * cut lower towards the tower's axis so the crown has the notch between
 * tips that k2 and k6 show.
 * Lower petal: OSM plan, 96 m (k6: 87-100 m by the 271 m scale; OSM 110).
 * Podium: 30 m (k6, four storeys; OSM's 40 counts plant), glazed, behind
 * two tiers of white V-columns (k6).
 * Estimated: the lobes' exact radii and centres (fitted to the OSM part
 * and the photo widths), the twist, the tip heights, the podium's height.
 * Left out: the crown logos, balconies in the grooves, the podium's
 * planting.
 *
 * Colours (sampled): sunlit glass #b6d3e1 - #c2e0ea, shaded #6689ab ->
 * pale blue-silver window-2 0xa6c3d6; the lower petal reads a little
 * darker (#5783a8 shaded) -> window-3 0x94b3ca; the podium's glazing, grey behind the
 * white columns -> window-4, lightened to 0xc2ced7 (lead review: the podium reads as a
 * pale, white colonnaded base in k6); the V-columns white -> trim; roofs roof.
 *
 * LODs: the low model has the petals (22 sides, 18 rings), the wing and the
 * podium with two tiers of V-columns every 8.5 m; the detail model has
 * smoother petals, floor bands every three storeys, V-columns every 5.5 m
 * and the podium's mid-level slab.
 *
 * Night: the tower's and podium's glass is lit windows (window-*).
 *
 * Photos (Wikimedia Commons; all evidence):
 * - k2 "Sydney Crown Sydney seen from the observatory.jpg", Ymblanter, CC BY-SA 4.0 (from the north-east)
 * - k3 "Barangaroo & Sydney CBD viewed from Balmain (2021).jpg", William Thorpe, CC BY-SA 4.0 (from the west, far)
 * - k4 "Crown Sydney Sep 2020.jpg", IFergo05, CC BY-SA 4.0 (from the north)
 * - k5 "Crown Sydney Barangaroo.jpg", MDRX, CC BY-SA 4.0 (from the south, Barangaroo Avenue)
 * - k6 "Crown Sydney (One Barangaroo), Dec 2022.jpg", Mx. Granger, CC0 (from the harbour)
 * - k8 "Barangaroo skyline.jpg", Dicklyon, CC BY-SA 4.0 (from the south-west at dusk)
 * No look-only references.
 *
 * Doubts: the petals' plan is fitted, not surveyed; the top's exact cut;
 * the podium's roof terraces (drawn flat).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { face, prism, saveLods, type Layer, type XY } from './sydney-tower-eye'

type Set = { glass: Part; wing: Part; pod: Part; white: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), wing: new Part(), pod: new Part(), white: new Part(), roof: new Part() })
const low = mk(), det = mk()

const TC: XY = [-2.6, 37.4] // the tower part's centre
const H = 271
/** Spread (lobe centre to its outer edge, from TC) by height, from k6/k2. */
const SPREAD: [number, number][] = [[0, 19.5], [40, 21.6], [90, 23.4], [125, 23.4], [160, 22.4], [190, 20.6], [215, 17.8], [240, 13.8], [258, 10.8], [271, 9.0]]
const spread = (z: number) => {
  for (let i = 0; i < SPREAD.length - 1; i++) {
    const [z0, e0] = SPREAD[i], [z1, e1] = SPREAD[i + 1]
    if (z <= z1) { const t = (z - z0) / (z1 - z0); return e0 + (e1 - e0) * (t * t * (3 - 2 * t)) }
  }
  return SPREAD[SPREAD.length - 1][1]
}
/** How far each petal's centre sits out from the axis, as a share of the spread: deep creases, and fins that part near the top. */
const dfrac = (z: number) => 0.45 + 0.17 * Math.max(0, Math.min(1, (z - 205) / 60)) ** 1.5
const TWIST = (-30 * Math.PI) / 180 // clockwise seen from above, foot to top
const LOBES = [ // plan angle at the foot (set so a groove faces west and one north-east at the top, k6/k2, and the wing joins in the south-east groove) and tip height
  { a: (140 * Math.PI) / 180, top: 271 },
  { a: (260 * Math.PI) / 180, top: 264 },
  { a: (20 * Math.PI) / 180, top: 257 },
]

/** A lobe: a round loft whose centre and radius follow the spread and the twist; the top cut sloping to the axis. */
function lobe(p: Part, a0: number, top: number, n: number, rings: number) {
  const zs: number[] = []
  for (let k = 0; k <= rings; k++) zs.push((top * k) / rings)
  const at = (z: number) => {
    const e = spread(z), d = dfrac(z) * e, r = e - d, a = a0 + (TWIST * z) / H
    return { c: [TC[0] + d * Math.cos(a), TC[1] + d * Math.sin(a)] as XY, r, a }
  }
  const P: V3[][] = [], N: V3[][] = []
  for (let k = 0; k <= rings; k++) {
    const z = zs[k], { c, r, a } = at(z)
    const dz = 2, r1 = at(Math.min(top, z + dz)).r, r0 = at(Math.max(0, z - dz)).r
    const slope = (r1 - r0) / (Math.min(top, z + dz) - Math.max(0, z - dz))
    const ring: V3[] = [], nr: V3[] = []
    for (let i = 0; i < n; i++) {
      const t = a + (i / n) * Math.PI * 2
      const x = c[0] + r * Math.cos(t), y = c[1] + r * Math.sin(t)
      // the top ring: lower towards the tower's axis (the notch between the tips)
      let zz = z
      if (k === rings) {
        const out = Math.cos(t - a) // 1 on the outer side of the lobe, -1 towards the axis
        zz = top - 5.5 * (1 - out) / 2
      }
      ring.push([x, y, zz])
      const l = Math.hypot(1, slope)
      nr.push([Math.cos(t) / l, Math.sin(t) / l, -slope / l])
    }
    P.push(ring); N.push(nr)
  }
  for (let k = 0; k < rings; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.tri(P[k][i], P[k][j], P[k + 1][j], undefined, undefined, undefined, [N[k][i], N[k][j], N[k + 1][j]])
      p.tri(P[k][i], P[k + 1][j], P[k + 1][i], undefined, undefined, undefined, [N[k][i], N[k + 1][j], N[k + 1][i]])
    }
  // the sloping top: a fan from the ring's centre
  const R = P[rings], cz = R.reduce((s, v) => s + v[2], 0) / n
  const cc: V3 = [R.reduce((s, v) => s + v[0], 0) / n, R.reduce((s, v) => s + v[1], 0) / n, cz]
  for (let i = 0; i < n; i++) face(p, [cc, R[i], R[(i + 1) % n]], [0, 0, 1])
  return at
}

/** A slanted square member between two points (a column), 8 triangles. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const ring = (q: V3): V3[] => [[q[0] - w, q[1] - w, q[2]], [q[0] + w, q[1] - w, q[2]], [q[0] + w, q[1] + w, q[2]], [q[0] - w, q[1] + w, q[2]]]
  const A = ring(a), B = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(A[i][0] + A[j][0]) / 2 - a[0], (A[i][1] + A[j][1]) / 2 - a[1], 0]
    face(p, [A[i], A[j], B[j], B[i]], m)
  }
}

// ---- Plans (OSM, in the frame) ------------------------------------------------------------------------------
const PODIUM: XY[] = [[-30.0, 64.7], [-29.4, 59.3], [-28.5, 55.1], [-27.4, 51.2], [-24.6, 43.7], [-25.4, 41.4], [-24.0, 39.4], [-20.6, 36.5], [-17.5, 35.3], [-18.5, 27.6], [-24.6, 27.4], [-24.9, 19.8], [-24.7, 12.0], [-24.0, 3.6], [-22.2, -7.4], [-18.3, -5.8], [-16.6, -8.5], [-14.5, -11.9], [-20.8, -18.1], [-20.4, -34.7], [-18.9, -44.8], [-16.8, -54.5], [-14.2, -56.2], [-14.3, -58.8], [-7.6, -61.3], [-1.0, -63.4], [6.9, -64.8], [18.4, -65.1], [24.0, -69.1], [32.8, -74.1], [32.9, -63.6], [31.9, -55.2], [32.9, -55.1], [33.0, -49.8], [31.9, -29.2], [32.0, -22.7], [31.5, -8.0], [32.2, -0.9], [30.0, 17.0], [30.3, 31.3], [29.8, 39.8], [29.0, 45.4], [27.8, 50.8], [24.6, 51.5], [19.5, 51.1], [15.3, 49.8], [12.6, 53.0], [11.2, 54.2], [8.5, 56.4], [5.5, 59.1], [-1.8, 62.5], [-5.7, 63.7], [-12.8, 65.2], [-18.0, 67.1], [-25.0, 69.3], [-30.3, 70.4]]
const WING_OSM: XY[] = [[-8.4, 34.8], [-7.6, 32.5], [-7.6, 28.0], [-4.4, 20.8], [-1.2, 16.4], [3.3, 12.9], [5.6, 9.8], [12.9, 3.4], [18.6, -1.5], [31.5, -8.0], [32.2, -0.9], [30.0, 17.0], [26.5, 27.4], [24.1, 33.6], [22.4, 37.4], [18.7, 42.9],
  [19.9, 36.5], [19.9, 32.1], [19.0, 27.1], [17.3, 22.2], [14.8, 17.2], [11.8, 14.6], [6.5, 15.2], [2.4, 17.3], [-1.0, 20.0], [-3.6, 25.4], [-4.7, 28.6]]
/** Chaikin corner-cutting: the wing is a curved glass drum hugging the tower (k2), so its OSM corners are rounded. */
const chaikin = (p: XY[], n: number): XY[] => {
  let r = p
  for (let k = 0; k < n; k++) r = r.flatMap((a, i) => { const b = r[(i + 1) % r.length]; return [[0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]] as XY[] })
  return r
}
const WING = chaikin(WING_OSM, 2)
const PZ = 30, WZ = 96

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // ---- the three petals ----
  for (const L of LOBES) lobe(s.glass, L.a, L.top, d ? 40 : 22, d ? 44 : 18)
  // floor bands every three storeys in the detail model: thin pale rings proud of the glass
  if (d) for (let z = 40; z < 258; z += 10.8) for (const L of LOBES) {
    const e = spread(z), dd = dfrac(z) * e, r = e - dd + 0.12, a = L.a + (TWIST * z) / H
    const c: XY = [TC[0] + dd * Math.cos(a), TC[1] + dd * Math.sin(a)], n = 40
    for (let i = 0; i < n; i++) {
      const t0 = a + (i / n) * Math.PI * 2, t1 = a + ((i + 1) / n) * Math.PI * 2
      const p0: V3 = [c[0] + r * Math.cos(t0), c[1] + r * Math.sin(t0), z], p1: V3 = [c[0] + r * Math.cos(t1), c[1] + r * Math.sin(t1), z]
      face(s.white, [p0, p1, [p1[0], p1[1], z + 0.35], [p0[0], p0[1], z + 0.35]], [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), 0])
    }
  }

  // ---- the lower petal (hotel wing) ----
  prism(s.wing, WING, 0, WZ, { top: false })
  for (const [a, b, c] of polyTris(WING)) face(s.roof, [[a[0], a[1], WZ + 0.5], [b[0], b[1], WZ + 0.5], [c[0], c[1], WZ + 0.5]], [0, 0, 1])
  // its pale parapet band at the top (k6)
  prism(s.white, WING, WZ - 1.2, WZ + 0.6, { top: false, bottom: true })

  // ---- the podium: glazing behind two tiers of white V-columns ----
  prism(s.pod, PODIUM, 0, PZ - 1.2, { top: false })
  prism(s.white, PODIUM, PZ - 1.2, PZ, { top: false, bottom: true })
  for (const [a, b, c] of polyTris(PODIUM)) face(s.roof, [[a[0], a[1], PZ], [b[0], b[1], PZ], [c[0], c[1], PZ]], [0, 0, 1])
  prism(s.white, PODIUM, 14.2, 15.0, { top: false, bottom: false })
  // the columns, on a line 0.6 m outside the glazing, skipping the stretch under the tower and wing
  const area2 = PODIUM.reduce((acc, p, i) => { const q = PODIUM[(i + 1) % PODIUM.length]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
  const sg = area2 > 0 ? 1 : -1
  const step = d ? 5.5 : 8.5
  const tiers: [number, number][] = [[0, 14.2], [15.0, PZ - 1.2]]
  const inTower = (q: XY) => Math.hypot(q[0] - TC[0], q[1] - TC[1]) < 26 || (q[0] > -8 && q[1] > -9 && q[1] < 43 && q[0] > 10)
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [sg * u[1], -sg * u[0]]
    const k = Math.max(1, Math.round(L / step)), sp = L / k
    for (let j = 0; j < k; j++) {
      const m = (j + 0.5) * sp
      const at = (q: number, off = 0.6): XY => [a[0] + u[0] * q + n[0] * off, a[1] + u[1] * q + n[1] * off]
      if (inTower(at(m))) continue
      for (const [z0, z1] of tiers) {
        // a V: two members from one foot to the top, a bay apart
        const f = at(m)
        strut(s.white, [f[0], f[1], z0], [at(m - sp / 2)[0], at(m - sp / 2)[1], z1], 0.36)
        strut(s.white, [f[0], f[1], z0], [at(m + sp / 2)[0], at(m + sp / 2)[1], z1], 0.36)
      }
    }
  }
}

// ---- Materials and output --------------------------------------------------------------------------------
const GLASS: MaterialSpec = windowVariant(2, 0x9ebed6)
const WINGM: MaterialSpec = windowVariant(3, 0x94b3ca)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.wing, material: WINGM },
  { part: s.pod, material: windowVariant(4, 0xc2ced7) },
  { part: s.white, material: PALETTE.trim },
  { part: s.roof, material: PALETTE.roof },
]
void finish

if (import.meta.main) {
  await saveLods('sydney-crown-sydney', 'Crown Sydney', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the podium outline centroid, quay level', bearing: 0,
  }, 5000)
}
