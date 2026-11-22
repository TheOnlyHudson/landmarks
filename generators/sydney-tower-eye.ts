/**
 * Sydney Tower (Sydney Tower Eye, Centrepoint Tower), Pitt Street Mall,
 * Sydney: procedural, CC0-1.0.
 * bun generators/sydney-tower-eye.ts
 *
 * Also exports the small kit the other `sydney-` generators of this batch
 * build with (lathe, tube, box, prism, holed facade skins, arch shapes,
 * two-LOD save). Merge this file first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin on the shaft's axis: the centroid of OSM's shaft part way/197801074
 * (151.2089424, -33.8704947), which the turret (way/197801072) and the spire
 * (way/273960049) share within 0.5 m. y = 0 is street level at the shaft's
 * foot; the Westfield podium (a separate building, not replaced) hides the
 * lower shaft.
 *
 * Designed by Donald Crone & Associates, completed 1981. A concrete shaft
 * clad in bronze-coloured panels, held by a net of 56 cables that run from
 * the podium roof over a collar ring, cross in a waisted hyperboloid through
 * a ring below the turret, and tie into the turret's underside. The turret is
 * gold-tinted glass in bands, with a narrower drum on top carrying the
 * Westfield sign and the Skywalk deck, and a spire.
 *
 * Published:
 * - 309 m to the spire tip (305 m before the 1998 lightning rod); roof 277 m;
 *   observation deck 250 m; Skywalk 268 m (Wikipedia "Sydney Tower").
 * - shaft 6.7 m diameter; turret about 31 m across; 56 cables (Sydney Tower
 *   Eye fact sheet, sydneytowereye.com.au/media/mnojzxnr/ste-fact-sheet-2025.pdf).
 * - the tower stands on a sixteen-level concrete podium building (Engineering
 *   heritage paper, austehc.unimelb.edu.au/tia/324.html, as quoted in search
 *   results; the page itself refused the fetch).
 *
 * Photo-scaled (t1, the Domain, a distant near-level view, scaled by the
 * published 31 m turret width and hung from the published 309 m tip; the
 * roof then reads 278-280 m against the published 277 m):
 * - turret underside dish from the shaft at 235.6 m to its rim at 242.5 m;
 *   gold body 242.5-262 m, r 14.3 at the foot widening to 15.5, with six
 *   glass bands; deck ring 262-262.9 m; upper drum r 8.9, 262.9-278 m (sign
 *   zone to 271.5, pale band 271.5-274.6, gold cap band to 278).
 *   The published Skywalk height (268 m) would put the deck ring 6 m higher
 *   than the photo reads; the photo is followed.
 * - spire: a cone from the roof to 286.5 m, a mast to 300 m, the antenna
 *   cluster 300-304.5 m, the rod to 309 m.
 * - the cables' waist ring at 198 m (r 4.75).
 * - the collar at about 142 m: from t2 (dusk, from the south-west), whose
 *   ratio of (turret-waist) to (waist-collar) is 200:285 px, set against the
 *   38 m turret-waist span in t1. Its rim r 7.3 (t2 and t7 read 2 to 2.4
 *   shaft widths).
 * Estimated: the cable anchors at the podium roof, r 16 at 36 m (photos t5
 *   and t7 show them on the roof of the 12-level Westfield office block;
 *   36 m keeps the cable ends inside the map's podium, which OSM gives 12
 *   levels and no height); the cables' twist through the hyperboloid (each
 *   crosses about 50 degrees, from t7's lattice); the sign panels' size.
 * Left out: the Skywalk's glass-floored platforms, railings, antennas on the
 *   roof, the Westfield script letters (drawn as plain red sign panels on
 *   four sides, as STYLE.md asks of signs that aren't the landmark).
 *
 * Colours sampled from daylight photos (sample.ts in the work folder):
 * gold bands #d0b677 (t4, sunlit) -> gold-glass 0xd2b673; window rows
 * #97948a -> 0x8e8a7c; shaft sunlit #c68e71 (t7) and shaded far darker ->
 * dark bronze 0x4e4540 (lead review: t1 reads ~#3a3530; held at the
 * charcoal floor STYLE.md sets); the dish the same; cables dark grey
 * 0x5c5c5c (t1 shows thin dark lines); pale band #dacdb7 -> trim; sign red.
 *
 * Night: the turret's glass bands are `window` (lit restaurants and deck);
 * the gold bands and drum carry a floodlight wash, as the turret glows gold
 * after dark (t2, dusk); the sign is `neon-westfield-red`; the spire is
 * lightly washed. The shaft and cables stay dark.
 *
 * LODs: the low model carries every other cable (28) as 4-sided tubes
 * 0.22 m across (about twice real); the detail model has all 56, round (6 sides), ribs the
 * underside dish and the collar, and builds the antenna cluster as a lattice.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - t1 "Sydney Tower March 2022.jpg", IFergo05, CC BY-SA 4.0 (from the Domain, east)
 * - t2 "The Sydney Tower Eye — 8 January 2025.jpg", Daniel William Wilson, CC BY 4.0 (dusk)
 * - t4 "Sydney Tower views from The Domain, Sydney, May 2021, 02.jpg", Kgbo, CC BY-SA 4.0
 * - t5 "(1)Sydney Tower-8.jpg", Sardaka, CC BY-SA 4.0 (from the podium roof)
 * - t6 "Sydney Tower (16635824155).jpg", Jorge Láscar, CC BY 2.0 (Pitt St, below)
 * - t7 "(1)Centrepoint Tower-99.jpg", Sardaka, CC BY-SA 4.0 (Pitt St Mall, sunlit)
 * No look-only references.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'

// ---- Kit (shared by the sydney- generators) -------------------------------------------------------------

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
 * meeting at less than `crease` degrees share smoothed normals.
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

/** A round tube along a polyline, smooth-shaded, open-ended unless `caps`. */
export function tube(p: Part, pts: V3[], r: number, n = 6, caps = false) {
  const rings: V3[][] = [], dirs: V3[] = []
  for (let k = 0; k < pts.length; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    dirs.push(norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]))
  }
  const d0 = dirs[0]
  let u: V3 = Math.abs(d0[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  for (let k = 0; k < pts.length; k++) {
    const d = dirs[k]
    // u perpendicular to d, carried along (parallel transport, roughly)
    const dot = u[0] * d[0] + u[1] * d[1] + u[2] * d[2]
    u = norm([u[0] - dot * d[0], u[1] - dot * d[1], u[2] - dot * d[2]])
    const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
    rings.push(Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, cs = Math.cos(t), sn = Math.sin(t)
      return [pts[k][0] + r * (cs * u[0] + sn * v[0]), pts[k][1] + r * (cs * u[1] + sn * v[1]), pts[k][2] + r * (cs * u[2] + sn * v[2])] as V3
    }))
  }
  for (let k = 0; k < pts.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nr = (q: V3, c: V3): V3 => norm([q[0] - c[0], q[1] - c[1], q[2] - c[2]])
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

/** A box about centre `c`, half sizes hx, hy, turned `rot` radians anticlockwise. */
export function box(p: Part, c: XY, hx: number, hy: number, z0: number, z1: number, rot = 0, o: { top?: boolean; bottom?: boolean } = {}) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const pt = (x: number, y: number): XY => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]
  prism(p, [pt(-hx, -hy), pt(hx, -hy), pt(hx, hy), pt(-hx, hy)], z0, z1, o)
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

/** A loft between same-length polygons at different heights (tapered prisms, spires, pyramids). */
export function loftRings(p: Part, rings: V3[][], o: { top?: boolean; bottom?: boolean } = {}) {
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], n = A.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [A[i], A[j], B[j], B[i]]
      const e1: V3 = [A[j][0] - A[i][0], A[j][1] - A[i][1], A[j][2] - A[i][2]]
      const e2: V3 = [B[i][0] - A[i][0], B[i][1] - A[i][1], B[i][2] - A[i][2]]
      let nn: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (Math.hypot(...nn) < 1e-9) {
        const e3: V3 = [B[j][0] - A[j][0], B[j][1] - A[j][1], B[j][2] - A[j][2]]
        nn = [e1[1] * e3[2] - e1[2] * e3[1], e1[2] * e3[0] - e1[0] * e3[2], e1[0] * e3[1] - e1[1] * e3[0]]
      }
      // outward: away from the ring's centre
      const cx = A.reduce((s, v) => s + v[0], 0) / n, cy = A.reduce((s, v) => s + v[1], 0) / n
      const mx = (A[i][0] + A[j][0]) / 2 - cx, my = (A[i][1] + A[j][1]) / 2 - cy
      if (nn[0] * mx + nn[1] * my < 0) nn = nn.map((x) => -x) as V3
      if (B[i][0] === B[j][0] && B[i][1] === B[j][1] && B[i][2] === B[j][2]) face(p, [A[i], A[j], B[i]], nn)
      else face(p, q, nn)
    }
  }
  if (o.bottom) face(p, rings[0], [0, 0, -1])
  if (o.top) face(p, rings[rings.length - 1], [0, 0, 1])
}

/** Points of a round (semicircular) or pointed (equilateral) arch opening in wall coordinates [s, z]. */
export function arch(s0: number, s1: number, zb: number, zs: number, pointed = false, seg = 8): XY[] {
  const w = s1 - s0, c = (s0 + s1) / 2, out: XY[] = [[s0, zb], [s1, zb]]
  if (!pointed) {
    for (let i = 0; i <= seg; i++) {
      const t = (Math.PI * i) / seg
      out.push([c + (w / 2) * Math.cos(t), zs + (w / 2) * Math.sin(t)])
    }
  } else {
    // two arcs of radius w, centred on the opposite springing points
    const h = w * Math.sqrt(3) / 2, half = Math.ceil(seg / 2)
    for (let i = 0; i <= half; i++) {
      const t = ((Math.PI / 3) * i) / half
      out.push([s0 + w * Math.cos(t), zs + w * Math.sin(t)])
    }
    out.pop()
    out.push([c, zs + h])
    for (let i = half - 1; i >= 0; i--) {
      const t = ((Math.PI / 3) * i) / half
      out.push([s1 - w * Math.cos(t), zs + w * Math.sin(t)])
    }
  }
  // dedupe the springing points: [s1,zb],[s1,zs] ... [s0,zs]
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
      // reveal faces point into the opening
      const es = r[0] - q[0], ez = r[1] - q[1]
      let ns = -ez, nz = es
      if (ns * (cs - (q[0] + r[0]) / 2) + nz * (cz - (q[1] + r[1]) / 2) < 0) { ns = -ns; nz = -nz }
      const back = o.through ? -depth : 0
      face(p, [W(q[0], q[1], depth), W(r[0], r[1], depth), W(r[0], r[1], back), W(q[0], q[1], back)], [u[0] * ns, u[1] * ns, nz])
    }
    if (glass) for (const [q, r, t] of polyTris(h)) face(glass, [W(q[0], q[1], 0.03), W(r[0], r[1], 0.03), W(t[0], t[1], 0.03)], N)
  }
  if (o.through) {
    // the back of an open screen
    for (const [q, r, t] of polyTris(outline, holes)) face(p, [W(q[0], q[1], -depth), W(r[0], r[1], -depth), W(t[0], t[1], -depth)], [-nrm[0], -nrm[1], 0])
  }
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
    if (glb.length > maxB) throw new Error(`${file}: ${glb.length} bytes, over ${maxB}; ${tris} triangles (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}

// ---- Sydney Tower ---------------------------------------------------------------------------------------

const O: XY = [0, 0]
const SHAFT_R = 3.35
const DISH_HUB = 234, DISH_RIM = 242.5, BODY_TOP = 262, ROOF = 278
const COLLAR_Z = 142, WAIST_Z = 198, ANCHOR_Z = 36

type Set = { gold: Part; win: Part; bronze: Part; white: Part; neon: Part; cable: Part }
const mk = (): Set => ({ gold: new Part(), win: new Part(), bronze: new Part(), white: new Part(), neon: new Part(), cable: new Part() })
const low = mk(), det = mk()

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const N = d ? 32 : 20
  // Shaft, foot to the dish.
  lathe(s.bronze, O, [[SHAFT_R, 0], [SHAFT_R, DISH_HUB + 0.5]], d ? 20 : 12)

  // Collar: a cup flaring from the shaft to its rim, a flat top.
  lathe(s.bronze, O, [[SHAFT_R, COLLAR_Z - 6], [6.6, COLLAR_Z - 0.6], [7.3, COLLAR_Z], [7.3, COLLAR_Z + 1.2], [SHAFT_R, COLLAR_Z + 1.2]], N, { crease: 30 })
  if (d) for (let i = 0; i < 28; i++) {
    const t = (i / 28) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t)
    tube(s.bronze, [[c * (SHAFT_R + 0.1), sn * (SHAFT_R + 0.1), COLLAR_Z - 6], [c * 6.9, sn * 6.9, COLLAR_Z - 0.3]], 0.14, 4)
  }

  // Waist ring the cables pass through, on four spokes.
  lathe(s.white, O, [[4.2, WAIST_Z - 0.9], [4.75, WAIST_Z - 0.9], [4.75, WAIST_Z + 0.9], [4.2, WAIST_Z + 0.9], [4.2, WAIST_Z - 0.9]], N, { crease: 30 })
  for (let i = 0; i < 4; i++) {
    const t = (i / 4) * Math.PI * 2 + Math.PI / 4
    box(s.bronze, [Math.cos(t) * 3.75, Math.sin(t) * 3.75], 0.5, 0.2, WAIST_Z - 0.4, WAIST_Z + 0.4, t, { bottom: true })
  }

  // Underside dish (bronze; dark in shade), hub to rim.
  lathe(s.bronze, O, [[SHAFT_R, DISH_HUB + 1.6], [6.5, DISH_HUB + 2.0], [9.8, DISH_HUB + 2.7], [12.6, DISH_HUB + 4.0], [14.0, DISH_HUB + 6.0], [14.3, DISH_RIM]], N, { crease: 35 })
  if (d) for (let i = 0; i < 36; i++) {
    const t = (i / 36) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t)
    const rib = (r: number, z: number): V3 => [c * r, sn * r, z - 0.25]
    tube(s.bronze, [rib(4.0, DISH_HUB + 1.7), rib(6.5, DISH_HUB + 2.0), rib(9.8, DISH_HUB + 2.7), rib(12.6, DISH_HUB + 4.0), rib(13.9, DISH_HUB + 6.0)], 0.16, 4)
  }

  // Turret body: a frustum, gold, with five glass bands set into it.
  const rAt = (z: number) => 14.3 + ((15.5 - 14.3) * (z - DISH_RIM)) / (BODY_TOP - DISH_RIM)
  const bands = Array.from({ length: 6 }, (_, k) => [DISH_RIM + 1.3 + k * 3.05, DISH_RIM + 2.9 + k * 3.05])
  let z = DISH_RIM
  for (const [b0, b1] of bands) {
    lathe(s.gold, O, [[rAt(z), z], [rAt(b0), b0]], N)
    lathe(s.win, O, [[rAt(b0) - 0.08, b0], [rAt(b1) - 0.08, b1]], N)
    z = b1
  }
  lathe(s.gold, O, [[rAt(z), z], [rAt(BODY_TOP), BODY_TOP]], N)
  // Deck ring, then the roof of the body out to it.
  lathe(s.gold, O, [[rAt(BODY_TOP), BODY_TOP], [15.9, BODY_TOP + 0.2], [15.9, BODY_TOP + 0.9], [8.9, BODY_TOP + 0.9]], N, { crease: 30 })

  // Upper drum: sign zone, pale Skywalk band, gold cap band, roof.
  lathe(s.gold, O, [[8.9, BODY_TOP + 0.9], [8.9, 271.5]], N)
  lathe(s.white, O, [[8.85, 271.5], [8.85, 274.6]], N)
  lathe(s.gold, O, [[8.9, 274.6], [8.9, ROOF], [7.6, ROOF + 0.4], [1.4, ROOF + 0.4]], N, { crease: 30, top: true })
  // The Westfield sign: plain red panels on four sides.
  for (let i = 0; i < 4; i++) {
    const c = (i * Math.PI) / 2
    lathe(s.neon, O, [[9.05, 264.8], [9.05, 269.3]], d ? 10 : 6, { arc: [c - 0.7, c + 0.7] })
    // the panel's edges, so it isn't a paper sheet
    for (const e of [c - 0.7, c + 0.7]) {
      const P = (r: number, zz: number): V3 => [r * Math.cos(e), r * Math.sin(e), zz]
      face(s.neon, [P(8.9, 264.8), P(9.05, 264.8), P(9.05, 269.3), P(8.9, 269.3)], [-Math.sin(e) * Math.sign(e - c), Math.cos(e) * Math.sign(e - c), 0])
    }
    lathe(s.neon, O, [[9.05, 269.3], [8.9, 269.3]], d ? 10 : 6, { arc: [c - 0.7, c + 0.7] })
  }

  // Spire: cone, mast, antenna cluster, rod.
  lathe(s.white, O, [[1.4, ROOF + 0.4], [0.55, 286.5], [0.42, 287], [0.42, 300]], d ? 12 : 8, { crease: 25 })
  if (d) {
    // the antenna cluster as a light lattice: four legs and rings
    for (let i = 0; i < 4; i++) {
      const t = (i / 4) * Math.PI * 2 + Math.PI / 4
      tube(s.white, [[Math.cos(t) * 0.85, Math.sin(t) * 0.85, 300], [Math.cos(t) * 0.85, Math.sin(t) * 0.85, 304.5]], 0.09, 4)
    }
    for (const zz of [300, 301.5, 303, 304.5]) lathe(s.white, O, [[0.75, zz - 0.12], [0.95, zz - 0.12], [0.95, zz + 0.12], [0.75, zz + 0.12], [0.75, zz - 0.12]], 12)
    lathe(s.white, O, [[0.42, 300], [0.42, 304.5], [0.15, 304.6], [0.15, 309]], 8, { crease: 25 })
  } else {
    lathe(s.white, O, [[0.42, 300], [0.9, 300.2], [0.9, 304.3], [0.15, 304.6], [0.15, 309]], 8, { crease: 25, top: true })
  }

  // Cables: 56, podium roof -> collar rim -> waist ring -> dish, crossing above the collar.
  // All 56 in the detail model; every other one in the low model (STYLE.md: half density, drawn bolder).
  const n = d ? 56 : 28
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, sgn = i % 2 ? 1 : -1
    const P = (r: number, zz: number, a: number): V3 => [r * Math.cos(a), r * Math.sin(a), zz]
    tube(s.cable, [
      P(16, ANCHOR_Z, t),
      P(7.45, COLLAR_Z + 1.2, t),
      P(4.85, WAIST_Z, t + sgn * 0.42),
      P(6.4, DISH_HUB + 3.1, t + sgn * 0.85),
    ], d ? 0.08 : 0.11, d ? 5 : 3)
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const turretLit = (p: V3, n: V3) => (p[2] > DISH_RIM - 0.5 ? (n[2] > 0.7 ? 0.35 : 0.85) : 0)
const spireLit = (p: V3, n: V3) => (p[2] > ROOF ? 0.5 : p[2] > 270 ? 0.6 : 0)
const GOLD: MaterialSpec = { ...finish('gold-glass', 0xd2b673, 0.5), floodlight: turretLit }
const WIN: MaterialSpec = { name: 'window', color: 0x948a72, roughness: 0.35 }
const BRONZE: MaterialSpec = finish('shaft-bronze', 0x4e4540, 0.7)
const CABLE: MaterialSpec = finish('cable-grey', 0x5c5c5c, 0.6)
const WHITE: MaterialSpec = { ...PALETTE.trim, floodlight: spireLit }
const NEON: MaterialSpec = finish('neon-westfield-red', 0xd2343a, 0.6)
const layers = (s: Set): Layer[] => [
  { part: s.gold, material: GOLD },
  { part: s.win, material: WIN },
  { part: s.bronze, material: BRONZE },
  { part: s.white, material: WHITE },
  { part: s.neon, material: NEON },
  { part: s.cable, material: CABLE },
]

if (import.meta.main) {
  await saveLods('sydney-tower-eye', 'Sydney Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin on the shaft axis at street level',
    bearing: 0, height: 309,
  })
}
