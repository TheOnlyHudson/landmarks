/**
 * Sky Tower (Te Pourewa), SkyCity, Auckland: procedural, CC0-1.0.
 * bun generators/auckland-sky-tower.ts
 *
 * Also exports the small kit the other `auckland-` generators of this batch
 * build with (face, lathe, tube, box, prism, loftRings, arch, skin, saveLods).
 * Merge this file first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin on the shaft's axis: the centroid of OSM's shaft part way/329588158
 * (174.762188, -36.848471); the mast parts (way/1173272336, way/1173272337)
 * and the collar (way/1173350302) share it within 0.4 m. y = 0 is the plaza
 * at the shaft's foot (Victoria St / Federal St corner). Mapterhorn z12 shows
 * the ground falling about 1 m from west to east across the base.
 *
 * Designed by Gordon Moller (Craig Craig Moller), Beca engineers, built by
 * Fletcher Construction 1994-97. A 12 m reinforced-concrete shaft standing
 * on eight round "legs" that lean in to a conical collar about 40 m up and
 * carry on above it as half-round fins dying into the shaft; the shaft flares
 * in a concave trumpet into the white aluminium pod, which holds (from the
 * bottom) a teardrop service drum with a dark band, the Sky Bar, the main
 * observation level, the Orbit revolving restaurant with the open SkyWalk
 * ring outside it, the Lookout, a white cone, the Sky Deck under a wide
 * white disc, a smaller cone and disc, and the steel mast.
 *
 * Published (Wikipedia "Sky Tower (Auckland)", retrieved 2026-11):
 * - 328 m to the top of the mast; shaft 12 m diameter on eight legs.
 * - main observation level 186 m; Orbit revolving restaurant 190 m; SkyWalk
 *   and SkyJump 192 m; Sky Deck 220 m; mast climbs to about 300 m.
 * - observation decks clad in aluminium with blue/green reflective glass.
 *
 * OSM (heights tagged by mappers, used where photos agree):
 * - outline relation/19745928 (the pod, r about 20 m), the SkyWalk ring
 *   relation/15909011, and the building:parts: shaft 0-182 (r 6.4),
 *   collar 35-45 (r 7.9), eight leg/fin parts to 80 m (skillion), pod drums
 *   154-159, 159-179 (black 165-172), Sky Bar 179-183, main observation
 *   183-187, Orbit 187-194, Sugar Club 194-198, the upper cone 198-242
 *   (pyramidal), Sky Deck 220-224, discs at 224-225 and 235-236, mast
 *   182-290 (r 2.2), 290-310 (r 1.3), 310-328 (r 0.6).
 *
 * Photo-scaled (p4, a distant level view from the north-east: scaled by the
 * SkyWalk ring's 38.6 m (OSM outline) and hung from the Sky Deck disc at
 * 224.5 m; the small disc then reads 235.7 m against OSM's 236):
 * - Sky Deck glass 219.2-222.4 (r 8.0) under a disc r 10.3 to 224.5; the
 *   cone below it 205.4-219.2, r 8.5 to 7.6; small cone 224.6-233.8,
 *   r 5.0 to 4.1; small disc r 5.9 to 235.7; mast pole r 2.1, steel lattice
 *   from about 273 m.
 * - Lookout glass r 10.5 at 197-201; Orbit glass r 16-16.5 at 189.5-194.5;
 *   main observation glass raked out from r 12 to 14 at 185.5-188.5; Sky Bar
 *   r 11.2 at 182-185.5; dark band 168-178.4 (p4 reads 170-178, p1 167-178.5; OSM 165-172; the photos are
 *   followed); white drum down to a lip at 154.5 (r 9.6), tapering as a
 *   teardrop (p11 close-up gives the ratios).
 * - the shaft flare: p1 (Queen St, distant) shows the trumpet about 15 m
 *   tall from the 12 m shaft to the drum's lip.
 * - the legs: p3, p5 and p7 (from the base) show eight round legs, about a
 *   quarter of the shaft's width, leaning in to the collar, and half-round
 *   fins above it with rounded tops (OSM tags them to 80 m; 78 used). The
 *   collar is a frustum, wider at its sharp lower edge with a flat soffit.
 * Estimated: the legs' foot radius (9.6 m centre) and 1.3 m radius (p5:
 *   about 5 m clear between legs); the collar's lower radius 10.9 m, its top
 *   sloping up to the fins; the shaft's window columns (two, facing
 *   north-east and north-north-west, from p1 and p11; which faces they are
 *   on is a guess); the glazed entrance pavilions between the legs (p3, p5)
 *   drawn as one dark glazed ring to 11 m; SkyWalk struts (16 in the low
 *   model, 48 in the detail); mast lattice width.
 * Left out: antennas and dishes on the mast, the SkyJump rig, railings
 *   (the detail model has the SkyWalk's upper rail), lettering, the grey
 *   pinstripes on the cladding.
 *
 * Colours sampled from daylight photos (work/auckland-tools/sample.ts):
 * concrete #aeaeac-#c4c3c0 (p11 sunlit/overcast) -> 0xc6c5bf; cladding
 * #d8dadc (p11, cone) -> 0xe3e5e6; dark band #2a2e36 -> charcoal 0x4a4f57;
 * glass #18242a (p11 Orbit) pulled light, blue-green -> 0x4f6a72; mast
 * lattice grey 0x8a9096.
 *
 * Night: the tower is floodlit in changing colours (p9, p10: green shaft,
 * red pod and mast; often blue). The shaft, legs and pod carry a
 * `_FLOODLIGHT` wash; the white rims (SkyWalk ring, Orbit roof rim, both
 * discs) and the mast pole are `neon-sky-rim`, a pale cool white by day that
 * glows at night; the observation glazing is `window`.
 *
 * Detail model (models/auckland-sky-tower.detail.glb): finer lathes, real
 * Sky Bar mullions, 48 SkyWalk struts and the upper rail with its posts,
 * the flare's eight ribs, the mast lattice as legs and braces.
 *
 * Photos (Wikimedia Commons):
 * - p1 "Sky Tower Auckland 01.jpg", Krzysztof Golik, CC BY-SA 4.0 (Queen St, from the north-east)
 * - p2 "Sky Tower from Mayoral Drive.jpg", Krzysztof Golik, CC BY-SA 4.0
 * - p3 "Sky Tower from the base, Auckland, New Zealand.jpg", Jonathan Harker, CC0
 * - p4 "Sky Tower, Auckland PA01.jpg", Paora, CC0 (distant, from the Domain side)
 * - p5 "Auckland Sky Tower closeup.jpg", Orderinchaos, CC BY-SA 4.0
 * - p6 "Sky Tower (Auckland), 2013 (01).jpg", Bahnfrend, CC BY-SA 4.0
 * - p7 "The Sky Tower, Auckland - panoramio.jpg", Bob Linsdell, CC BY 3.0
 * - p8/p9 "Auckland Sky Tower in Christmas colours.jpg", Marco Klapper, CC BY 2.0 (night)
 * - p10 "Auckland Sky Tower on St. Patrick's Day.jpg", Civil10, CC BY-SA 4.0 (night)
 * - p11 "Sky Tower Auckland (31296763753).jpg", Tony Hisgett, CC BY 2.0 (pod close-up)
 * Look-only: none used.
 * Doubts: OSM's dark-band height (165-172) against the photos (168-178);
 * the foot of the legs is hidden by the casino pavilions in every photo.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'

// ---- Kit (shared by the auckland- generators) -----------------------------------------------------------

export type XY = [number, number]
type Opt = { phase?: number; top?: boolean; bottom?: boolean; crease?: number; arc?: [number, number] }
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/** A face (convex polygon, any winding) with a given outward normal: the winding follows the normal. */
export function face(p: Part, pts: V3[], n: V3) {
  const m = norm(n)
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [m, m, m])
}

/**
 * A surface of revolution about the vertical axis through `c`. `prof` is
 * [r, z] pairs ordered with the solid on the left (bottom to top on the
 * outside, inward across a top), so normals point out. Adjacent segments
 * meeting at less than `crease` degrees share smoothed normals. `arc` limits
 * it to an angular range (radians, counter-clockwise from east).
 */
export function lathe(p: Part, c: XY, prof: [number, number][], n = 16, o: Opt = {}) {
  const ph = o.phase ?? 0, crease = Math.cos(((o.crease ?? 40) * Math.PI) / 180)
  const [a0, a1] = o.arc ?? [0, Math.PI * 2]
  const full = !o.arc
  const segN = prof.slice(0, -1).map(([r0, z0], k) => {
    const [r1, z1] = prof[k + 1]
    const l = Math.hypot(r1 - r0, z1 - z0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  const endN = (k: number, end: 0 | 1): XY => {
    const s = segN[k]
    const o2 = end === 0 ? segN[k - 1] : segN[k + 1]
    if (!o2 || s[0] * o2[0] + s[1] * o2[1] < crease) return s
    const r = s[0] + o2[0], z = s[1] + o2[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const ang = (i: number) => ph + a0 + ((a1 - a0) * i) / n
  const P = (r: number, z: number, i: number): V3 => [c[0] + r * Math.cos(ang(i)), c[1] + r * Math.sin(ang(i)), z]
  const N = (q: XY, i: number): V3 => [q[0] * Math.cos(ang(i)), q[0] * Math.sin(ang(i)), q[1]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (r0 < 1e-6 && r1 < 1e-6) continue
    const n0 = endN(k, 0), n1 = endN(k, 1)
    for (let i = 0; i < n; i++) {
      const a = P(r0, z0, i), b = P(r0, z0, i + 1), cc = P(r1, z1, i + 1), d = P(r1, z1, i)
      if (r0 > 1e-6) p.tri(a, b, cc, undefined, undefined, undefined, [N(n0, i), N(n0, i + 1), N(n1, i + 1)])
      if (r1 > 1e-6) p.tri(a, cc, d, undefined, undefined, undefined, [N(n0, i), N(n1, i + 1), N(n1, i)])
    }
  }
  const ring = (k: number) => Array.from({ length: full ? n : n + 1 }, (_, i) => P(prof[k][0], prof[k][1], i))
  if (o.bottom && prof[0][0] > 1e-6) face(p, [...ring(0), ...(full ? [] : [[c[0], c[1], prof[0][1]] as V3])], [0, 0, -1])
  const L = prof.length - 1
  if (o.top && prof[L][0] > 1e-6) face(p, [...ring(L), ...(full ? [] : [[c[0], c[1], prof[L][1]] as V3])], [0, 0, 1])
}

/** A round tube along a polyline, smooth-shaded, open-ended unless `caps`. `r` may vary per point. */
export function tube(p: Part, pts: V3[], r: number | number[], n = 6, caps = false) {
  const R = (k: number) => (typeof r === 'number' ? r : r[k])
  const rings: V3[][] = [], dirs: V3[] = []
  for (let k = 0; k < pts.length; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    dirs.push(norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]))
  }
  let u: V3 = Math.abs(dirs[0][2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  for (let k = 0; k < pts.length; k++) {
    const d = dirs[k]
    const dot = u[0] * d[0] + u[1] * d[1] + u[2] * d[2]
    u = norm([u[0] - dot * d[0], u[1] - dot * d[1], u[2] - dot * d[2]])
    const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
    rings.push(Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, cs = Math.cos(t), sn = Math.sin(t), rr = R(k)
      return [pts[k][0] + rr * (cs * u[0] + sn * v[0]), pts[k][1] + rr * (cs * u[1] + sn * v[1]), pts[k][2] + rr * (cs * u[2] + sn * v[2])] as V3
    }))
  }
  const nr = (q: V3, c: V3): V3 => norm([q[0] - c[0], q[1] - c[1], q[2] - c[2]])
  for (let k = 0; k < pts.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
      p.tri(A, B, C, undefined, undefined, undefined, [nr(A, pts[k]), nr(B, pts[k]), nr(C, pts[k + 1])])
      p.tri(A, C, D, undefined, undefined, undefined, [nr(A, pts[k]), nr(C, pts[k + 1]), nr(D, pts[k + 1])])
    }
  if (caps) {
    const L = pts.length - 1
    face(p, rings[0], dirs[0].map((x) => -x) as V3)
    face(p, rings[L], dirs[L])
  }
}

/** A smooth leaning cylinder with horizontal end cuts, from centre `a` (bottom) to `b` (top); open ends. */
export function leanCyl(p: Part, a: V3, b: V3, r: number, n = 12) {
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * Math.PI * 2, t1 = ((i + 1) / n) * Math.PI * 2
    const Q = (c: V3, t: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), c[2]]
    const M = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
    p.tri(Q(a, t0), Q(a, t1), Q(b, t1), undefined, undefined, undefined, [M(t0), M(t1), M(t1)])
    p.tri(Q(a, t0), Q(b, t1), Q(b, t0), undefined, undefined, undefined, [M(t0), M(t1), M(t0)])
  }
}

/** A box about centre `c`, half sizes hx, hy, turned `rot` radians anticlockwise. */
export function box(p: Part, c: XY, hx: number, hy: number, z0: number, z1: number, rot = 0, o: { top?: boolean; bottom?: boolean } = {}) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const pt = (x: number, y: number): XY => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]
  prism(p, [pt(-hx, -hy), pt(hx, -hy), pt(hx, hy), pt(-hx, hy)], z0, z1, o)
}

/** A straight bar of rectangular section between two points (w across, h in the `up` plane). */
export function bar(p: Part, a: V3, b: V3, w: number, h: number, up: V3 = [0, 0, 1]) {
  const d = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  let s: V3 = [d[1] * up[2] - d[2] * up[1], d[2] * up[0] - d[0] * up[2], d[0] * up[1] - d[1] * up[0]]
  if (Math.hypot(...s) < 1e-6) s = [1, 0, 0]
  s = norm(s)
  const t: V3 = [s[1] * d[2] - s[2] * d[1], s[2] * d[0] - s[0] * d[2], s[0] * d[1] - s[1] * d[0]]
  const corner = (q: V3, i: number, j: number): V3 => [q[0] + s[0] * i * w / 2 + t[0] * j * h / 2, q[1] + s[1] * i * w / 2 + t[1] * j * h / 2, q[2] + s[2] * i * w / 2 + t[2] * j * h / 2]
  const cs: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = cs[k], [i1, j1] = cs[(k + 1) % 4]
    const n: V3 = norm([s[0] * (i0 + i1) + t[0] * (j0 + j1), s[1] * (i0 + i1) + t[1] * (j0 + j1), s[2] * (i0 + i1) + t[2] * (j0 + j1)])
    face(p, [corner(a, i0, j0), corner(a, i1, j1), corner(b, i1, j1), corner(b, i0, j0)], n)
  }
  face(p, cs.map(([i, j]) => corner(a, i, j)), d.map((x) => -x) as V3)
  face(p, cs.map(([i, j]) => corner(b, i, j)), d)
}

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
export const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** A vertical prism over a polygon (holes allowed), flat-shaded. */
export function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; bottom?: boolean; holes?: XY[][] } = {}) {
  const ring = ccw(poly)
  const sides = (r: XY[], inward: boolean) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], inward ? (n.map((x) => -x) as V3) : n)
    }
  }
  sides(ring, false)
  for (const h of o.holes ?? []) sides(ccw(h), true)
  const tris = polyTris(ring, o.holes ?? [])
  if (o.top !== false) for (const [a, b, c] of tris) face(p, [[a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1]], [0, 0, 1])
  if (o.bottom) for (const [a, b, c] of tris) face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z0]], [0, 0, -1])
}

/** A loft between same-length convex polygons at different heights (tapered prisms, spires, pyramids). */
export function loftRings(p: Part, rings: V3[][], o: { top?: boolean; bottom?: boolean } = {}) {
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], n = A.length
    const cx = A.reduce((s, v) => s + v[0], 0) / n, cy = A.reduce((s, v) => s + v[1], 0) / n
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const e1: V3 = [A[j][0] - A[i][0], A[j][1] - A[i][1], A[j][2] - A[i][2]]
      const e2: V3 = [B[i][0] - A[i][0], B[i][1] - A[i][1], B[i][2] - A[i][2]]
      let nn: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (Math.hypot(...nn) < 1e-9) {
        const e3: V3 = [B[j][0] - A[j][0], B[j][1] - A[j][1], B[j][2] - A[j][2]]
        nn = [e1[1] * e3[2] - e1[2] * e3[1], e1[2] * e3[0] - e1[0] * e3[2], e1[0] * e3[1] - e1[1] * e3[0]]
      }
      const mx = (A[i][0] + A[j][0]) / 2 - cx, my = (A[i][1] + A[j][1]) / 2 - cy
      if (nn[0] * mx + nn[1] * my < 0) nn = nn.map((x) => -x) as V3
      if (B[i][0] === B[j][0] && B[i][1] === B[j][1] && B[i][2] === B[j][2]) face(p, [A[i], A[j], B[i]], nn)
      else face(p, [A[i], A[j], B[j], B[i]], nn)
    }
  }
  if (o.bottom) face(p, rings[0], [0, 0, -1])
  if (o.top) face(p, rings[rings.length - 1], [0, 0, 1])
}

/** Points of a round (semicircular) or segmental arch opening in wall coordinates [s, z]: jambs from zb to the springing zs. `rise` < half-width gives a segmental head. */
export function arch(s0: number, s1: number, zb: number, zs: number, seg = 8, rise?: number): XY[] {
  const w = s1 - s0, c = (s0 + s1) / 2, h = rise ?? w / 2
  const out: XY[] = [[s0, zb], [s1, zb]]
  if (h >= w / 2 - 1e-9) {
    for (let i = 0; i <= seg; i++) {
      const t = (Math.PI * i) / seg
      out.push([c + (w / 2) * Math.cos(t), zs + (w / 2) * Math.sin(t)])
    }
  } else {
    const R = ((w / 2) ** 2 + h * h) / (2 * h), zc = zs + h - R, half = Math.asin(w / 2 / R)
    for (let i = 0; i <= seg; i++) {
      const t = Math.PI / 2 - half + (2 * half * i) / seg
      out.push([c + R * Math.cos(t), zc + R * Math.sin(t)])
    }
  }
  const res: XY[] = []
  for (const q of out) if (!res.length || Math.hypot(q[0] - res[res.length - 1][0], q[1] - res[res.length - 1][1]) > 1e-6) res.push(q)
  if (Math.hypot(res[0][0] - res[res.length - 1][0], res[0][1] - res[res.length - 1][1]) < 1e-6) res.pop()
  return ccw(res)
}

/**
 * A facade skin on the wall line a→b (outside on the right of a→b, as on a
 * counter-clockwise plan): a slab `depth` thick standing proud of the wall,
 * from z0 to z1, pierced by `holes` (in [s, z] along the wall). Each hole
 * gets real reveals back to the wall and, when `glass` is given, a panel on
 * the wall at its back. With `through`, the holes are left open (an arcade
 * or a belfry) and the skin needs nothing behind it.
 */
export function skin(p: Part, glass: Part | null, a: XY, b: XY, z0: number, z1: number, depth: number, holes: XY[][], o: { ends?: boolean; top?: boolean; through?: boolean; s0?: number; s1?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [u[1], -u[0]]
  const s0 = o.s0 ?? 0, s1 = o.s1 ?? L
  const W = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + nrm[0] * d, a[1] + u[1] * s + nrm[1] * d, z]
  const outline: XY[] = [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
  const N: V3 = [nrm[0], nrm[1], 0]
  for (const [q, r, t] of polyTris(outline, holes)) face(p, [W(q[0], q[1], depth), W(r[0], r[1], depth), W(t[0], t[1], depth)], N)
  for (const h of holes) {
    const cs = h.reduce((s, q) => s + q[0], 0) / h.length, cz = h.reduce((s, q) => s + q[1], 0) / h.length
    for (let i = 0; i < h.length; i++) {
      const q = h[i], r = h[(i + 1) % h.length]
      const es = r[0] - q[0], ez = r[1] - q[1]
      let ns = -ez, nz = es
      if (ns * (cs - (q[0] + r[0]) / 2) + nz * (cz - (q[1] + r[1]) / 2) < 0) { ns = -ns; nz = -nz }
      const back = o.through ? -depth : 0
      face(p, [W(q[0], q[1], depth), W(r[0], r[1], depth), W(r[0], r[1], back), W(q[0], q[1], back)], [u[0] * ns, u[1] * ns, nz])
    }
    if (glass) for (const [q, r, t] of polyTris(h)) face(glass, [W(q[0], q[1], 0.03), W(r[0], r[1], 0.03), W(t[0], t[1], 0.03)], N)
  }
  if (o.through) for (const [q, r, t] of polyTris(outline, holes)) face(p, [W(q[0], q[1], -depth), W(r[0], r[1], -depth), W(t[0], t[1], -depth)], [-nrm[0], -nrm[1], 0])
  if (o.top !== false) face(p, [W(s0, z1, 0), W(s1, z1, 0), W(s1, z1, depth), W(s0, z1, depth)], [0, 0, 1])
  if (o.ends !== false) {
    face(p, [W(s0, z0, 0), W(s0, z0, depth), W(s0, z1, depth), W(s0, z1, 0)], [-u[0], -u[1], 0])
    face(p, [W(s1, z0, 0), W(s1, z0, depth), W(s1, z1, depth), W(s1, z1, 0)], [u[0], u[1], 0])
  }
}

export type Layer = { part: Part; material: MaterialSpec }

/** Write the low model and, when given, the detail model, checking the budgets. */
export async function saveLods(id: string, name: string, low: Layer[], detail: Layer[] | null, extras: Record<string, unknown>, lowMax = 5000) {
  const out: [string, Layer[], number, number][] = [[`${id}.glb`, low, lowMax, 250 * 1024]]
  if (detail) out.push([`${id}.detail.glb`, detail, 40000, 1536 * 1024])
  for (const [file, layers, maxT, maxB] of out) {
    const used = layers.filter((l) => l.part.triangles > 0)
    const tris = used.reduce((s, l) => s + l.part.triangles, 0)
    if (tris > maxT) throw new Error(`${file}: ${tris} triangles, over ${maxT} (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`)
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', ...extras })
    if (glb.length > maxB) throw new Error(`${file}: ${glb.length} bytes, over ${maxB}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`)
  }
}

// ---- Sky Tower ------------------------------------------------------------------------------------------

const O: XY = [0, 0]
const TAU = Math.PI * 2
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
/** Compass bearing (deg clockwise from north) to the map frame's angle (counter-clockwise from east). */
const az = (deg: number) => Math.PI / 2 - (deg * Math.PI) / 180

const SHAFT_R = 6.0
const LEG_N = 8, LEG_R = 1.3, LEG_FOOT = 9.6, LEG_TOP = 7.5
const COLLAR_Z0 = 35, COLLAR_Z1 = 45
const FIN_C = 6.4, FIN_R = 1.25, FIN_TOP = 78
const LIP = 154.5
const RING_Z0 = 194.4, RING_Z1 = 195.7, RING_RO = 19.3, RING_RI = 17.7

type Set = { conc: Part; clad: Part; win: Part; dark: Part; neon: Part; steel: Part }
const mk = (): Set => ({ conc: new Part(), clad: new Part(), win: new Part(), dark: new Part(), neon: new Part(), steel: new Part() })
const low = mk(), det = mk()

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const N = d ? 48 : 24, Ns = d ? 32 : 16
  const legPhase = TAU / 16 // legs at 22.5 deg off the axes (OSM's parts sit at the 8 compass points ±; see header)

  // -- the shaft, with the concave trumpet into the pod
  lathe(s.conc, O, [
    [SHAFT_R, 0], [SHAFT_R, 138], [6.15, 142], [6.5, 146], [7.1, 149.5], [7.9, 152], [8.7, 153.7], [9.25, LIP],
  ], N)

  // -- legs: round columns leaning in from the plaza to the collar
  for (let i = 0; i < LEG_N; i++) {
    const a = (i / LEG_N) * TAU + 0 // OSM's fin parts sit at the eight compass points
    leanCyl(s.conc, P(LEG_FOOT, a, 0), P(LEG_TOP, a, COLLAR_Z0 + 1), LEG_R, d ? 16 : 10)
    // above the collar: half-round fins hugging the shaft with rounded tops
    const c: XY = [FIN_C * Math.cos(a), FIN_C * Math.sin(a)]
    lathe(s.conc, c, [
      [FIN_R, COLLAR_Z1 - 0.5], [FIN_R, FIN_TOP - 6], [FIN_R * 0.85, FIN_TOP - 3.2], [FIN_R * 0.5, FIN_TOP - 1.1], [0, FIN_TOP],
    ], d ? 10 : 6, { arc: [a - Math.PI * 0.62, a + Math.PI * 0.62] })
  }
  void legPhase

  // -- the collar: a frustum with a sharp lower edge and a flat soffit
  lathe(s.conc, O, [
    [SHAFT_R, COLLAR_Z0], [10.9, COLLAR_Z0], [10.9, COLLAR_Z0 + 1.4], [9.6, COLLAR_Z0 + 4.2], [7.7, COLLAR_Z1 - 0.6], [SHAFT_R, COLLAR_Z1 + 0.4],
  ], N, { crease: 30 })

  // -- glazed pavilions between the legs at the plaza (dark glass, a dark fascia band on top)
  lathe(s.win, O, [[10.0, 0], [10.0, 8.6]], N)
  lathe(s.dark, O, [[10.0, 8.6], [10.15, 9.0], [10.15, 11.0], [SHAFT_R, 11.0]], N, { crease: 30 })

  // -- window columns on the shaft (small windows, two columns)
  for (const deg of [45, 345]) {
    const a = az(deg), hw = 0.75 / SHAFT_R
    for (let z = 52; z < 136; z += 7.6) {
      const r = SHAFT_R + 0.03
      face(s.win, [P(r, a - hw, z), P(r, a + hw, z), P(r, a + hw, z + 2.6), P(r, a - hw, z + 2.6)], [Math.cos(a), Math.sin(a), 0])
    }
  }

  // -- ribs on the trumpet (eight thin fins from the pod's lip down the flare)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + TAU / 16
    const pts: V3[] = [[6.05, 0, 136], [6.6, 0, 146], [7.6, 0, 150.5], [9.3, 0, LIP]].map(([r, , z]) => P(r + 0.25, a, z))
    for (let k = 0; k < pts.length - 1; k++) bar(s.conc, pts[k], pts[k + 1], 0.35, 0.6, [Math.cos(a), Math.sin(a), 0])
  }

  // -- the pod: lip, teardrop drum, dark band, Sky Bar
  lathe(s.clad, O, [
    [9.25, LIP], [9.65, LIP], [9.65, 155.4], [9.4, 156.2], [9.6, 160], [9.85, 165], [9.95, 168.0],
  ], N, { crease: 30 })
  lathe(s.dark, O, [[9.95, 168.0], [10.3, 178.4]], N)
  lathe(s.clad, O, [[10.3, 178.4], [10.5, 182], [11.4, 182], [11.4, 182.3]], N, { crease: 30 })
  // Sky Bar glazing
  lathe(s.win, O, [[11.2, 182.3], [11.3, 185.5]], N)
  if (d) {
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * TAU
      bar(s.clad, P(11.4, a, 182.3), P(11.5, a, 185.5), 0.35, 0.3)
    }
  }
  // soffit and main observation glazing, raked out
  lathe(s.clad, O, [[11.3, 185.5], [12.2, 185.5]], N)
  lathe(s.win, O, [[12.0, 185.5], [14.0, 188.5]], N)
  // Orbit floor slab: soffit out to the white rim
  lathe(s.clad, O, [[14.0, 188.5], [16.3, 188.6], [16.4, 189.6], [16.0, 189.6]], N, { crease: 30 })
  // Orbit glazing (blue-green), raked out a little
  lathe(s.win, O, [[16.0, 189.6], [16.5, 194.4]], N)
  // Orbit roof rim (lit) and the roof deck in towards the Lookout
  lathe(s.neon, O, [[16.5, 194.4], [17.1, 194.4], [17.1, 195.6], [16.6, 195.9]], N, { crease: 30 })
  lathe(s.clad, O, [[16.6, 195.9], [10.6, 196.3]], N)

  // -- the SkyWalk ring and its struts (open: real members, sky between them)
  lathe(s.neon, O, [[RING_RO, RING_Z0], [RING_RO, RING_Z1], [RING_RI, RING_Z1], [RING_RI, RING_Z0], [RING_RO, RING_Z0]], N, { crease: 30 })
  const struts = d ? 48 : 16
  for (let i = 0; i < struts; i++) {
    const a = (i / struts) * TAU
    // under the walkway: from the ring's inner edge down to the Orbit floor rim
    bar(s.clad, P(RING_RI + 0.3, a, RING_Z0 + 0.2), P(16.3, a, 189.8), d ? 0.25 : 0.4, d ? 0.35 : 0.5)
    // across the gap to the roof rim
    bar(s.clad, P(RING_RI + 0.2, a, RING_Z0 + 0.6), P(17.0, a, RING_Z0 + 0.6), d ? 0.25 : 0.4, 0.4)
  }
  if (d) {
    // the upper rail on posts leaning in from the ring's outer edge
    const rail: V3[] = []
    for (let i = 0; i <= 96; i++) rail.push(P(18.6, (i / 96) * TAU, 198.2))
    tube(s.clad, rail, 0.12, 5)
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * TAU
      bar(s.clad, P(RING_RO - 0.2, a, RING_Z1), P(18.6, a, 198.2), 0.12, 0.12)
    }
  }

  // -- the Lookout, the white cone, the Sky Deck and its disc, the small cone and disc
  lathe(s.win, O, [[10.5, 196.3], [10.5, 200.6]], N)
  lathe(s.clad, O, [
    [10.5, 200.6], [11.0, 200.6], [11.0, 201.6], [9.2, 201.8], [9.2, 205.4], [8.5, 205.6], [7.6, 219.2], [8.1, 219.2],
  ], N, { crease: 30 })
  lathe(s.win, O, [[8.0, 219.2], [8.0, 222.2]], N)
  lathe(s.neon, O, [[8.0, 222.2], [10.3, 223.0], [10.3, 224.0], [9.6, 224.5], [5.0, 224.6]], N, { crease: 30 })
  lathe(s.clad, O, [[5.0, 224.6], [4.1, 233.8]], Ns)
  lathe(s.neon, O, [[4.1, 233.8], [5.9, 234.6], [5.9, 235.3], [5.4, 235.7], [2.6, 235.8]], Ns, { crease: 30 })

  // -- the mast (p1, p4): a white pole stepping down at rings, wrapped in square steel cages
  //    235.8-271 pole r 2.1 (cage 246.5-271), ring 271; 271-290 pole r 1.4; platform 290;
  //    290-304 pole r 1.0 in a cage; ring 304; antenna 304-328.
  lathe(s.neon, O, [[2.6, 235.8], [2.1, 238.0], [2.1, 271], [2.6, 271], [2.6, 272], [1.4, 272.2], [1.4, 289.4], [2.3, 289.6], [2.3, 290.6], [1.0, 290.8], [1.0, 303.6]], d ? 16 : 10, { crease: 30 })
  lathe(s.steel, O, [[1.0, 303.6], [1.7, 303.7], [1.7, 304.6], [0.5, 304.8], [0.42, 318], [0.3, 326], [0.08, 328], [0, 328]], d ? 10 : 6, { crease: 30 })
  const cage = (z0: number, z1: number, h: number, st: number) => {
    const corner = (k: number, z: number): V3 => {
      const a = TAU / 8 + (k * TAU) / 4, r = h * Math.SQRT2
      return [r * Math.cos(a), r * Math.sin(a), z]
    }
    for (let k = 0; k < 4; k++) tube(s.steel, [corner(k, z0), corner(k, z1)], d ? 0.13 : 0.22, d ? 6 : 4)
    const n = Math.max(1, Math.round((z1 - z0) / st)), dz = (z1 - z0) / n
    for (let j = 1; j <= n; j++) {
      const z = z0 + j * dz
      for (let k = 0; k < 4; k++) {
        bar(s.steel, corner(k, z), corner((k + 1) % 4, z), d ? 0.12 : 0.2, d ? 0.12 : 0.2)
        bar(s.steel, corner(k, z - dz), corner((k + 1) % 4, z), d ? 0.08 : 0.16, d ? 0.08 : 0.16)
      }
    }
  }
  cage(246.5, 271, 2.15, d ? 2.45 : 3.5)
  cage(290.6, 303.6, 1.45, d ? 2.2 : 3.3)
  // antenna arms at the 290 and 304 platforms (detail only)
  if (d) for (const [z, r0, r1] of [[290.2, 2.3, 3.4], [304.2, 1.7, 2.6]] as [number, number, number][])
    for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; bar(s.steel, P(r0, a, z), P(r1, a, z), 0.15, 0.15); box(s.steel, [r1 * Math.cos(a), r1 * Math.sin(a)], 0.15, 0.3, z - 1.2, z + 1.4, a) }
}

// ---- Materials and output --------------------------------------------------------------------------------

/** Floodlit shaft and legs (strong on the sides, faces looking up barely lit). */
const shaftLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 150 ? 0.85 : 0.7)
const podLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.75)
const CONC: MaterialSpec = { ...finish('sky-concrete', 0xc6c5bf), floodlight: shaftLit }
const CLAD: MaterialSpec = { ...finish('sky-cladding', 0xe3e5e6, 0.6), floodlight: podLit }
const WIN: MaterialSpec = { name: 'window', color: 0x4f6a72, roughness: 0.35 }
const DARK: MaterialSpec = finish('sky-dark-band', 0x4a4f57, 0.5)
const NEON: MaterialSpec = finish('neon-sky-rim', 0xdbe5ec, 0.6)
const STEEL: MaterialSpec = finish('mast-steel', 0x8a9096, 0.6)
const layers = (s: Set): Layer[] => [
  { part: s.conc, material: CONC },
  { part: s.clad, material: CLAD },
  { part: s.win, material: WIN },
  { part: s.dark, material: DARK },
  { part: s.neon, material: NEON },
  { part: s.steel, material: STEEL },
]

if (import.meta.main) {
  await saveLods('auckland-sky-tower', 'Sky Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin on the shaft axis at plaza level',
    bearing: 0, height: 328,
  }, 6500)
}
