/**
 * Tokyo Metropolitan Government Building (東京都庁舎), Nishi-Shinjuku, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-metropolitan-government-building.ts
 *
 * Also exports the small geometry kit (`kit`) shared by the Tokyo batch's
 * B2 towers (tokyo-mode-gakuen-cocoon-tower, tokyo-docomo-yoyogi,
 * tokyo-shibuya-scramble-square, tokyo-sunshine-60); the build itself runs
 * only under `import.meta.main`.
 *
 * One model for the whole complex Kenzo Tange designed (completed 1990):
 * Main Building No. 1 with its twin towers, Main Building No. 2, the
 * Metropolitan Assembly Building and the colonnaded crescent of the Citizens'
 * Plaza between them, and the two raised bridges (15-25 m) that tie them
 * together. Writes the low model and a detail model (drawn from zoom 16)
 * in the same frame.
 *
 * Frame: built turned to bearing 349 (the complex's long axis, measured on
 * No. 1's long walls, -10.5 and -11.5 degrees). Origin at the centroid of
 * No. 1's outline (way/89877471); y = 0 is the ground.
 *
 * OSM (all in `replaces`):
 * - way/89877471 No. 1 outline (133 m, 48 levels); parts way/568387704 and
 *   way/568387707 (176 m, the tower shafts in the base's orientation, stepped
 *   corners), way/568387705 and way/568387708 (207 m, a star: the shaft's
 *   core square, half 16.8 m, overlapped by a square turned 45 degrees), and
 *   way/568387706 and way/568387709 (243 m, the turned square, corners 22.3 m
 *   from the tower's centre with a V-notch in each);
 * - way/89877420 No. 2 outline (73 m, a sawtooth of stepped bays); parts
 *   way/568465171, way/568465175, way/568465180 (115, 138, 163 m): three
 *   squares turned 45 degrees, each with notched corners;
 * - way/89878322 Assembly outline (41 m) and its parts way/245962672 (25-41
 *   m, the chamber block), way/245962673 (25 m, the east block and the
 *   plaza's crescent), way/245962674 and way/245962675 (15-25 m, the
 *   colonnade bridges round the plaza);
 * - way/572510171 and way/572510172 (15-25 m), the bridge from No. 1 to No. 2.
 * Left to the map: way/575384550, a small canopy roof (building=roof, 45 m2)
 * that the model's footprint touches at 11%.
 *
 * Published (Wikipedia, "Tokyo Metropolitan Government Building"; CTBUH):
 * No. 1 243 m, 48 floors, splitting into two towers at the 33rd floor; the
 * observatories at 202 m (45th floor) in each tower; No. 2 163 m, 34 floors.
 *
 * From photos (heights scaled on Kakidai's and DXR's near-elevations, with
 * 133 and 243 m as the scale): the shaft's stepped corners end at ~176 m;
 * the turned crown box starts ~197 m and the core square's corners stand
 * out of its faces as pointed prisms up to ~214 m; above them each of the
 * crown's four faces is cut by a deep recess (212-238 m, about three quarters
 * of the face wide) showing a ribbed drum carrying the dishes; a band of
 * granite closes the recess at the top. No. 2: each turned square ends in
 * a low pyramid; the bays of the sawtooth rise in three steps (~80, 100 and
 * 125 m read on Kakidai's 2024 No. 2 photo) under the turned squares.
 *
 * Estimated: the drum's radius (11 m) and recess depth; No. 2's step
 * heights (photo, +-5 m; flat-topped, the turned squares rising straight to
 * OSM's heights with a coping); the Assembly chamber's dome (from the GSI aerial,
 * a shallow round roof ~22 m across); the colonnade's pier spacing (~7 m)
 * and the arcade height (0-15 m open, the bridges 15-25 m on top).
 *
 * Colours (re-sampled on review): the granite is a cool light grey (#d0d2d4
 * in Kakidai's sun, #a8a9ab in DXR's overcast), drawn #d3d5d7 for the whole
 * complex; the crowns read darker, #b4b8bc; the recesses are deep shadow,
 * #4f565e, so they hold at 200 px; the window grid is a dark blue-grey,
 * drawn as `window` #5f7283 in tall panels three floors high with thin
 * spandrels and granite piers between, so the faces read as vertical bands;
 * the drum a mid metal grey. Night: office windows lit (`window`).
 *
 * Photos (Wikimedia Commons):
 * - "Tokyo Metropolitan Government Building 2024.jpg", Kakidai, CC BY-SA 4.0
 *   (No. 1 and No. 2 from the north-east, colour)
 * - "2024 Tokyo Metropolitan Government Building No.1.jpg", Kakidai, CC BY-SA 4.0
 * - "2024 Tokyo Metropolitan Government Building No.2.jpg", Kakidai, CC BY-SA 4.0
 * - "Tokyo Metropolitan Government Building, Northeast view 20190419 1.jpg",
 *   DXR, CC BY-SA 4.0 (crowns, recesses, the Assembly in front)
 * - "Tokyo Metropolitan Government Building taken from Shinjuku NS Building.jpg",
 *   Eavesdropper6735, CC BY 4.0 (crowns from the south-west)
 * - "TokyoMetropolitanGovernmentOffice.jpg", Markus Leupold-Löwenthal,
 *   CC BY-SA 3.0 (east front from the Citizens' Plaza, the colonnade)
 * - "Tokyo Metropolitan Government Building No1 ... cropped GSI
 *   CKT20092-C63-16 20090427.jpg", 国土地理院 (GSI), CC BY 4.0 (aerial: plan,
 *   crowns' drums, the plaza and the Assembly's dome)
 * - "Tokyo Metropolitan Government Building No.1 at night 20170206.jpg",
 *   Suicasmo, CC BY-SA 4.0 (night)
 * No lidar (Japan). No look-only sources.
 * Doubts: the recesses are drawn on all four crown faces (photos show the
 * north-east, south-east and south-west ones; the north-west is assumed);
 * No. 2's west side is unphotographed here and mirrored from the east.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ------------------------------------------------------------------ kit ---
export type XY = [number, number]
const TAU = Math.PI * 2
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul3(a, 1 / (Math.hypot(...a) || 1))

export const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above. */
export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)
export const rotXY = (p: XY, a: number, c: XY = [0, 0]): XY => {
  const x = p[0] - c[0], y = p[1] - c[1]
  return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]
}
export const shift = (r: XY[], dx: number, dy: number): XY[] => r.map(([x, y]) => [x + dx, y + dy])
/** Remove consecutive near-duplicates and collinear points. */
export function clean(r: XY[], eps = 0.05): XY[] {
  let out = r.filter((p, i) => { const q = r[(i + 1) % r.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > eps })
  out = out.filter((b, i) => {
    const a = out[(i + out.length - 1) % out.length], c = out[(i + 1) % out.length]
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    return Math.abs(cr) > eps * Math.hypot(c[0] - a[0], c[1] - a[1])
  })
  return out
}

/** Ear clipping for a simple counter-clockwise polygon. */
export function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), tris: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) >= -1e-9 && crossz(b, c, p) >= -1e-9 && crossz(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(r[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { idx.splice(0, 1) }
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}
export function capPoly(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** Offset a counter-clockwise ring inward by d (outward if negative). */
export function inset(ring: XY[], d: number): XY[] {
  return ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] - ((u[0] + v[0]) * d) / k, b[1] - ((u[1] + v[1]) * d) / k]
  })
}

/** Edges shorter than this keep sharp corners. */
export let SOFT_MIN = 0
export const setSoftMin = (m: number) => { SOFT_MIN = m }
export type Rim = { points: XY[]; normals: V3[] }
/** Chamfer convex corners by r with smooth normals (rounded look); concave corners stay sharp. */
export function soften(ring: XY[], r = 0.5): Rim {
  const points: XY[] = [], normals: V3[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[(i + ring.length - 1) % ring.length], b = ring[i], c = ring[(i + 1) % ring.length]
    const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), l1 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: XY = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], v: XY = [(c[0] - b[0]) / l1, (c[1] - b[1]) / l1]
    const cr = u[0] * v[1] - u[1] * v[0]
    const rr = Math.min(r, l0 * 0.3, l1 * 0.3)
    // Short returns (a stepped corner's 3 m steps) stay sharp: a bevel there doesn't read.
    if (cr <= 1e-5 || rr <= 0.01 || Math.min(l0, l1) < SOFT_MIN) {
      // concave or straight: a sharp corner, duplicated so each wall keeps its own normal
      points.push(b, b); normals.push([u[1], -u[0], 0], [v[1], -v[0], 0]); continue
    }
    points.push([b[0] - u[0] * rr, b[1] - u[1] * rr], [b[0] + v[0] * rr, b[1] + v[1] * rr])
    normals.push([u[1], -u[0], 0], [v[1], -v[0], 0])
  }
  return { points, normals }
}
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc: V3, nd: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
}
export function walls(p: Part, rim: Rim, z0: number, z1: number) {
  const P = rim.points, N = rim.normals
  for (let i = 0; i < P.length; i++) {
    const j = (i + 1) % P.length
    if (Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1]) < 1e-4) continue
    quadN(p, [P[i][0], P[i][1], z0], [P[j][0], P[j][1], z0], [P[j][0], P[j][1], z1], [P[i][0], P[i][1], z1], N[i], N[j], N[j], N[i])
  }
}
/**
 * A vertical prism: soft walls on `wall`, and (optionally) a roof cap on
 * `roof` set inside a coping lip of `lip` metres.
 */
export function prism(wall: Part, ring: XY[], z0: number, z1: number, o: { roof?: Part; bevel?: number; lip?: number; bottom?: boolean; top?: boolean } = {}) {
  const r = ccw(ring), bevel = o.bevel ?? 0.5
  const rim = soften(r, bevel)
  walls(wall, rim, z0, z1)
  if (o.top !== false) {
    const lip = o.lip ?? 0
    if (lip > 0 && o.roof) {
      // a coping ring round a roof set just below it
      const P = clean(r, 0.01), inner = inset(P, lip)
      for (let i = 0; i < P.length; i++) {
        const j = (i + 1) % P.length
        wall.quad([P[i][0], P[i][1], z1], [P[j][0], P[j][1], z1], [inner[j][0], inner[j][1], z1], [inner[i][0], inner[i][1], z1])
      }
      capPoly(o.roof, inner, z1 - 0.01)
    } else capPoly(o.roof ?? wall, clean(r, 0.01), z1)
  }
  if (o.bottom) capPoly(wall, clean(r, 0.01), z0, false)
}

/**
 * An upward flat ring between a star-shaped outer ring and a circle of
 * radius rIn about c (a roof with a round hole).
 */
export function ringCap(p: Part, outer: XY[], c: XY, rIn: number, z: number, n = 32) {
  const o = ccw(outer)
  const angs = new Set<number>()
  for (let i = 0; i < n; i++) angs.add((i / n) * TAU)
  for (const q of o) angs.add((Math.atan2(q[1] - c[1], q[0] - c[0]) + TAU) % TAU)
  const A = [...angs].sort((a, b) => a - b)
  const hit = (a: number): XY => {
    const d: XY = [Math.cos(a), Math.sin(a)]
    let best = Infinity
    for (let i = 0; i < o.length; i++) {
      const p0 = o[i], p1 = o[(i + 1) % o.length]
      const ex = p1[0] - p0[0], ey = p1[1] - p0[1], wx = p0[0] - c[0], wy = p0[1] - c[1]
      const den = d[0] * ey - d[1] * ex
      if (Math.abs(den) < 1e-9) continue
      const t = (wx * ey - wy * ex) / den, u = (wx * d[1] - wy * d[0]) / den
      if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, t)
    }
    return [c[0] + d[0] * best, c[1] + d[1] * best]
  }
  for (let i = 0; i < A.length; i++) {
    const a0 = A[i], a1 = A[(i + 1) % A.length] + (i + 1 === A.length ? TAU : 0)
    const o0 = hit(a0), o1 = hit(a1)
    const i0: XY = [c[0] + rIn * Math.cos(a0), c[1] + rIn * Math.sin(a0)], i1: XY = [c[0] + rIn * Math.cos(a1), c[1] + rIn * Math.sin(a1)]
    p.quad([i0[0], i0[1], z], [o0[0], o0[1], z], [o1[0], o1[1], z], [i1[0], i1[1], z])
  }
}

/** Plain vertical walls on each edge of a ring, the part chosen per edge (no bevel). */
export function wallsBy(ring: XY[], z0: number, z1: number, pick: (i: number) => Part) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    pick(i).quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** Clip a counter-clockwise ring to the band y0 <= y <= y1. */
export function clipY(ring: XY[], y0: number, y1: number): XY[] {
  const half = (r: XY[], keep: (p: XY) => number) => {
    const out: XY[] = []
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], ka = keep(a), kb = keep(b)
      if (ka >= 0) out.push(a)
      if ((ka >= 0) !== (kb >= 0)) { const t = ka / (ka - kb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
    }
    return out
  }
  return clean(half(half(ring, (p) => p[1] - y0), (p) => y1 - p[1]), 0.01)
}

/**
 * Window panels on every edge of a counter-clockwise ring, standing `out`
 * proud of the wall: `bay` metres per bay (fill `fw` of it), rows `row`
 * metres high (fill `fh`). Edges shorter than `minEdge` stay plain wall.
 */
export function panels(p: Part, ring: XY[], z0: number, z1: number, o: { bay: number; row: number; fw: number; fh: number; minEdge?: number; out?: number; margin?: number; skip?: (i: number, mid: XY) => boolean }) {
  const r = ccw(ring), out = o.out ?? 0.05, margin = o.margin ?? 0.8
  const rows = Math.max(1, Math.round((z1 - z0) / o.row)), rh = (z1 - z0) / rows
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < (o.minEdge ?? 3)) continue
    if (o.skip?.(i, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const usable = L - 2 * margin
    if (usable <= 0.5) continue
    const n = Math.max(1, Math.round(usable / o.bay)), bw = usable / n, w = bw * o.fw
    for (let k = 0; k < n; k++) {
      const s0 = margin + bw * k + (bw - w) / 2, s1 = s0 + w
      const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * out, a[1] + uy * s + ny * out, z]
      for (let j = 0; j < rows; j++) {
        const zz0 = z0 + rh * j + (rh * (1 - o.fh)) / 2, zz1 = zz0 + rh * o.fh
        p.quad(P(s0, zz0), P(s1, zz0), P(s1, zz1), P(s0, zz1))
      }
    }
  }
}
/** Vertical window strips (one per bay, full height between z0 and z1). */
export function strips(p: Part, ring: XY[], z0: number, z1: number, o: { bay: number; fw: number; minEdge?: number; out?: number; margin?: number }) {
  panels(p, ring, z0, z1, { ...o, row: z1 - z0, fh: 1 })
}

/** Surface of revolution about (cx, cy) from [r, z] pairs; the left of the profile is outside. */
export function lathe(p: Part, profile: [number, number][], k: number, c: XY = [0, 0], smooth = 40, a0 = 0) {
  const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]; const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1]); return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const A0 = a0 + (s / k) * TAU, A1 = a0 + ((s + 1) / k) * TAU
      const q = [P(r0, A0, z0), P(r0, A1, z0), P(r1, A1, z1), P(r1, A0, z1)]
      const nn = [N(n0, A0), N(n0, A1), N(n1, A1), N(n1, A0)]
      if (r0 === 0) p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else { p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]]); p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]]) }
    }
  }
}

/** A straight member from a to b: a prism of `sides` faces, radius r, smooth-shaded, open-ended. */
export function member(p: Part, a: V3, b: V3, r: number, sides = 4, ref: V3 = [0, 0, 1], twist = 0) {
  const t = unit(sub(b, a))
  let u = sub(ref, mul3(t, dot3(ref, t)))
  if (Math.hypot(...u) < 1e-6) u = Math.abs(t[2]) < 0.9 ? cross(t, [0, 0, 1]) : cross(t, [1, 0, 0])
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => { const ang = twist + (k / sides) * TAU; return add3(mul3(u, r * Math.cos(ang)), mul3(v, r * Math.sin(ang))) }
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1), n0 = unit(o0), n1 = unit(o1)
    const Q = [add3(a, o0), add3(a, o1), add3(b, o1), add3(b, o0)].map((q) => [q[0], q[1], Math.max(0, q[2])] as V3)
    quadN(p, Q[0], Q[1], Q[2], Q[3], n0, n1, n1, n0)
  }
}

/** A box between z0 and z1 over a 4-point footprint, no bevel (for small bits). */
export function box(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) capPoly(p, r, z1)
}
export const rect = (cx: number, cy: number, hx: number, hy: number, a = 0): XY[] =>
  ([[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]] as XY[]).map((q) => rotXY(q, a)).map(([x, y]) => [x + cx, y + cy] as XY)
export const circle = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i / n) * TAU), cy + r * Math.sin(a0 + (i / n) * TAU)] as XY)

export type Layer = { part: Part; material: MaterialSpec }
export async function writeModel(id: string, file: string, name: string, parts: Layer[], meta: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter((l) => l.part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...meta })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${id} ${file}: ${triangles} triangles, ${glb.length} bytes`)
}

// ------------------------------------------------------------ the model ---
// OSM outlines in the model frame (bearing 349), metres.
const NO1: XY[] = [[-9.9, -48.7], [-16.4, -48.6], [-16.7, -42.6], [-22.2, -42.6], [-22.8, -21.9], [-16.9, -21.9], [-16.5, 20.8], [-22.7, 21.0], [-23.0, 42.1], [-16.8, 42.1], [-16.8, 48.5], [-10.3, 48.6], [-10.2, 55.1], [10.0, 55.0], [10.0, 48.9], [16.7, 48.7], [16.7, 43.0], [23.6, 42.9], [23.2, 20.4], [16.2, 20.5], [16.5, -22.1], [23.2, -22.3], [22.9, -42.6], [16.5, -42.2], [16.7, -48.4], [10.7, -48.4], [10.8, -55.2], [-10.0, -54.7]]
/** No. 1's tower shafts (176 m parts), around their own centres, stepped corners. */
function shaft(cy: number): XY[] {
  const q: XY[] = [[7.0, 23.4], [7.0, 20.1], [10.0, 20.1], [10.0, 17.1], [16.7, 17.1], [16.7, 11.3], [19.9, 11.3], [19.9, 8.0], [23.4, 8.0]]
  // one octant-pair of the stepped corner (NE), mirrored round
  const ne: XY[] = [...q]
  const full: XY[] = []
  const quads: Array<(p: XY) => XY> = [([x, y]) => [x, y], ([x, y]) => [-y, x], ([x, y]) => [-x, -y], ([x, y]) => [y, -x]]
  for (const f of quads) {
    // from the top face's east end round the NE corner to the east face's north end
    for (const p of ne) full.push(f(p))
    // east face's south end, then the SE steps (the mirror of NE about y)
    for (const p of [...ne].reverse()) full.push(f([p[0], -p[1]]))
  }
  // walk counter-clockwise: built as segments per quarter, ensure order
  return ccw(clean(dedupe(reorder(full)).map(([x, y]) => [x, y + cy] as XY)))
}
function dedupe(r: XY[]) { return r.filter((p, i) => { const q = r[(i + 1) % r.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.01 }) }
function reorder(r: XY[]) { return [...r].sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0])) }

/**
 * A square turned 45 degrees, corners on the axes `R` from its centre, each
 * corner's tip cut back to a V: the edges stop `t` either side of the axis
 * and fold in to a notch `n` from the tip (OSM: R 25.4, t 3.2, n 6.3).
 */
function diamond(cx: number, cy: number, R = 25.4, t = 3.2, n = 6.3): XY[] {
  const out: XY[] = []
  for (let k = 0; k < 4; k++) for (const p of [[R - t, -t], [R - n, 0], [R - t, t]] as XY[]) out.push(rotXY(p, (k * Math.PI) / 2))
  return ccw(out.map(([x, y]) => [x + cx, y + cy] as XY))
}
const DR = 25.4
/** The core square (base orientation), plain corners. */
const square = (cx: number, cy: number, h: number): XY[] => rect(cx, cy, h, h)
/** Star: union of core square half h and diamond (corner R). */
function star(cx: number, cy: number, h: number, R: number): XY[] {
  const f = R / Math.SQRT2 // the diamond's face distance... its edges are x+y=R
  void f
  const out: XY[] = []
  // walk counter-clockwise from the +x axis corner of the diamond
  for (let k = 0; k < 4; k++) {
    const rot = (p: XY) => rotXY(p, (k * Math.PI) / 2)
    // diamond corner on +x, then along edge x + y = R until it meets the square's side y = -h ... (in this quadrant, going up: x + y = R meets x = h at y = R - h)
    out.push(rot([R, 0]), rot([h, R - h]), rot([h, h]), rot([R - h, h]))
  }
  return ccw(out.map(([x, y]) => [x + cx, y + cy] as XY))
}

type Lod = { bay: number; row: number; detail: boolean; k: number }
const LOW: Lod = { bay: 6.6, row: 13.2, detail: false, k: 16 }
const DETAIL: Lod = { bay: 3.2, row: 8.2, detail: true, k: 40 }

function build(L: Lod): Layer[] {
  setSoftMin(L.detail ? 0 : 4.5)
  const granite = new Part(), win = new Part(), roof = new Part(), drum = new Part(), crown = new Part(), shade = new Part()
  const assembly = granite
  const pan = (ring: XY[], z0: number, z1: number, fw = 0.5, fh = 0.88, part = win, bay = L.bay, row = L.row) =>
    panels(part, ring, z0, z1, { bay, row, fw, fh, minEdge: 4.5, margin: 1.2 })

  // ---------------------------------------------------------- No. 1 ---
  // Base block to 133 m (the 33rd floor), stepped like the shafts above.
  prism(granite, NO1, 0, 133, { roof, lip: 1.0, bevel: 0.6 })
  pan(NO1, 6, 131)
  // A heavier plinth band and the entrance hall glazing on the east front.
  if (L.detail) prism(granite, inset(ccw(NO1), -0.35), 0, 6, { top: false, bevel: 0.6 })

  for (const cy of [31.75, -32.0]) {
    const S1 = shaft(cy)
    prism(granite, S1, 133, 176, { roof, lip: 1.0, bevel: 0.6 })
    pan(S1, 134, 175)
    // 176-197: the star (core square half 16.8 + the turned square, corners 22.3)
    const ST = star(0, cy, 16.8, DR)
    prism(granite, ST, 176, 197, { roof, lip: 0.8 })
    pan(ST, 177, 196, 0.5, 0.88, win, L.bay, 19)
    // the core square's corners run on up as pointed prisms in front of the crown
    const CORE = square(0, cy, 16.8)
    prism(granite, CORE, 197, 212, { roof, lip: 0.6 })
    // The crown: the turned square from 197 to 243 m, its corners notched.
    const D = diamond(0, cy)
    prism(crown, D, 197, 212, { top: false })
    pan(D, 198, 211, 0.5, 0.88, win, L.bay, 13)
    // 214-236: each face cut by a deep recess, the drum inside.
    // face from the tip (R,0) to (0,R): middle m, along d, outward n
    const depth = 8.0, half = 12.6
    const recessed: XY[] = []
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2
      const corner: XY[] = [[DR - 3.2, -3.2], [DR - 6.3, 0], [DR - 3.2, 3.2]]
      const m: XY = [DR / 2, DR / 2], d: XY = [-Math.SQRT1_2, Math.SQRT1_2], n: XY = [Math.SQRT1_2, Math.SQRT1_2]
      const P = (t: number, dep: number): XY => [m[0] + d[0] * t - n[0] * dep, m[1] + d[1] * t - n[1] * dep]
      const face: XY[] = [P(-half, 0), P(-half, depth), P(half, depth), P(half, 0)]
      for (const p of [...corner, ...face]) recessed.push(rotXY(p, a))
    }
    const REC = ccw(recessed.map(([x, y]) => [x, y + cy] as XY))
    // the recesses' sides and backs are in shadow (roof grey); the corners granite
    wallsBy(REC, 212, 238, (i) => (i % 7 >= 3 && i % 7 <= 5 ? shade : crown))
    // the closing band at the top
    const dr = 11.2
    // a ring with a round opening over the drum (GSI aerial: the drum's top shows from above)
    prism(crown, D, 238, 243, { top: false })
    ringCap(crown, D, [0, cy], 12.6, 243, L.k)
    lathe(shade, [[12.6, 243], [12.6, 238]], L.k, [0, cy], 10, Math.PI / L.k)
    lathe(drum, [[0, 241.5], [dr, 241.5]].reverse() as [number, number][], L.k, [0, cy], 10, Math.PI / L.k)
    panels(win, REC, 213, 237, { bay: L.bay, row: 12, fw: 0.5, fh: 0.88, minEdge: 4.5, margin: 1.2, skip: (i) => i % 7 >= 3 && i % 7 <= 5 })
    // a floor at the recess's foot (top of the core prisms already caps 214)
    capPoly(shade, REC, 212)
    // underside of the closing band over the recesses
    capPoly(shade, D, 238, false)
    // The drum, ribbed: in the low model a smooth cylinder, in the detail a fluted one.
    lathe(drum, [[dr, 211.5], [dr, 241.5]], L.k, [0, cy], 40, Math.PI / L.k)
    if (L.detail) for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU
      member(drum, [Math.cos(a) * (dr + 0.25), cy + Math.sin(a) * (dr + 0.25), 214], [Math.cos(a) * (dr + 0.25), cy + Math.sin(a) * (dr + 0.25), 236], 0.35, 4)
    }
    // the dishes on the drum (detail only): a few white discs facing out
    if (L.detail) for (const [ang, z] of [[0.3, 226], [1.2, 230], [2.5, 222], [3.6, 229], [4.6, 224], [5.6, 231]] as [number, number][]) {
      const c: V3 = [Math.cos(ang) * (dr + 1.3), cy + Math.sin(ang) * (dr + 1.3), z]
      const rr = 1.8
      const ring = circle(0, 0, rr, 10)
      const n: V3 = [Math.cos(ang), Math.sin(ang), 0], t: V3 = [-Math.sin(ang), Math.cos(ang), 0]
      const pts = ring.map(([u, w]) => add3(c, add3(mul3(t, u), [0, 0, w])) as V3)
      for (let i = 1; i < pts.length - 1; i++) drum.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
      for (let i = 1; i < pts.length - 1; i++) drum.tri(pts[0], pts[i + 1], pts[i], undefined, undefined, undefined, [mul3(n, -1), mul3(n, -1), mul3(n, -1)])
    }
  }

  // ---------------------------------------------------------- No. 2 ---
  // Three turned squares (115, 138, 163 m), each over a sawtooth of bays.
  const no2 = [
    { cy: -145.8, top: 115, step: 80, y0: -158.6, y1: -122.2 },
    { cy: -171.4, top: 138, step: 100, y0: -184.2, y1: -158.6 },
    { cy: -196.9, top: 163, step: 125, y0: -219.2, y1: -184.2 },
  ]
  const NO2: XY[] = [[10.7, -219.1], [10.9, -212.8], [17.3, -213.3], [17.2, -206.8], [23.8, -207.0], [23.8, -186.6], [17.0, -186.6], [17.0, -180.9], [24.0, -181.1], [23.6, -161.2], [17.0, -160.9], [16.8, -155.0], [23.2, -154.9], [23.3, -135.4], [17.1, -135.3], [17.2, -129.0], [10.9, -128.7], [10.8, -122.3], [-9.6, -122.2], [-9.5, -129.1], [-15.6, -129.0], [-15.8, -135.4], [-22.2, -135.2], [-22.0, -155.4], [-15.8, -155.3], [-15.8, -160.8], [-22.0, -161.0], [-22.3, -181.1], [-15.6, -181.1], [-15.5, -186.5], [-21.9, -186.8], [-22.1, -206.8], [-14.9, -206.8], [-15.1, -212.8], [-8.8, -213.1], [-8.8, -219.2]]
  prism(granite, NO2, 0, 73, { roof, lip: 1.0 })
  const b2 = L.detail ? L.bay : 7.4
  pan(NO2, 6, 72, 0.5, 0.88, win, b2)
  for (const s of no2) {
    // the bays of the section, stepped: the section's slice of the sawtooth, inset a little
    const sec = clipY(ccw(NO2), s.y0 + 0.5, s.y1 - 0.5)
    prism(granite, sec, 73, s.step, { roof, lip: 1.0 })
    pan(sec, 74, s.step - 1, 0.5, 0.88, win, b2)
    const D = diamond(0.8, s.cy)
    // the turned square rises flat-topped above the bays (photo: no hipped roofs)
    prism(granite, D, s.step, s.top, { roof, lip: 1.0 })
    pan(D, s.step + 1, s.top - 1, 0.5, 0.88, win, b2)
  }

  // ------------------------------------------------- the bridges ---
  // No. 1 to No. 2, 15-25 m, on two piers.
  const BR: XY[] = [[-3.4, -64.4], [4.5, -64.4], [4.6, -112.9], [-3.2, -112.8]]
  prism(granite, BR, 15, 25, { roof, lip: 0.4, bottom: true })
  pan(BR, 16.5, 23.5, 0.6, 0.7, win, L.detail ? 5 : 9, 10)
  const BR2: XY[] = [[-9.8, -112.7], [11.3, -112.9], [11.2, -122.3], [-9.9, -122.0]]
  prism(granite, BR2, 15, 25, { roof, bottom: true })
  for (const y of [-80, -97]) box(granite, rect(0.6, y, 1.6, 1.6), 0, 15, false)

  // ------------------------------------- Assembly and the plaza crescent ---
  // The colonnaded crescent round the Citizens' Plaza: an arcade on piers
  // (0-15 m) carrying the 15-25 m gallery, from No. 1 round to the Assembly.
  // Plaza crescent: the inner edge is the arc through (73,-57.5)...(125,-15)...(76,58).
  const arcC: XY = [72, 0.4], arcR = 57.8
  const arcIn = (a: number): XY => [arcC[0] + arcR * Math.cos(a), arcC[1] + arcR * Math.sin(a)]
  const arcOut = (a: number): XY => [arcC[0] + (arcR + 7.2) * Math.cos(a), arcC[1] + (arcR + 7.2) * Math.sin(a)]
  // straight arms from No. 1 out to the arc, then the arc round the east
  const armS: XY[] = [[7.3, -64.4], [72, -64.4], [72, -57.4], [7.3, -57.4]]
  const armN: XY[] = [[7.3, 57.6], [72, 57.6], [72, 64.6], [7.3, 64.6]]
  const gallery = (ring: XY[]) => {
    prism(assembly, ring, 15, 25, { roof, lip: 0.5, bottom: true })
    pan(ring, 16.5, 24, 0.55, 0.7, win, L.detail ? 4.5 : 8, 9)
  }
  gallery(armS); gallery(armN)
  const arcSegs = L.detail ? 16 : 8
  const a0 = -Math.PI / 2, a1 = -0.27, b0 = 0.27, b1 = Math.PI / 2
  for (const [s0, s1] of [[a0, a1], [b0, b1]]) {
    const ring: XY[] = []
    for (let i = 0; i <= arcSegs; i++) ring.push(arcIn(s0 + ((s1 - s0) * i) / arcSegs))
    for (let i = arcSegs; i >= 0; i--) ring.push(arcOut(s0 + ((s1 - s0) * i) / arcSegs))
    gallery(ring)
    // the arcade's piers under the gallery
    const n = L.detail ? 9 : 4
    for (let i = 0; i <= n; i++) {
      const a = s0 + ((s1 - s0) * i) / n, c: XY = [arcC[0] + (arcR + 3.6) * Math.cos(a), arcC[1] + (arcR + 3.6) * Math.sin(a)]
      box(assembly, rect(c[0], c[1], 1.2, 2.6, a), 0, 15, false)
    }
  }
  for (const arm of [[[7.3, -60.9], [72, -60.9]], [[7.3, 61.1], [72, 61.1]]] as XY[][]) {
    const n = L.detail ? 9 : 4
    for (let i = 0; i <= n; i++) {
      const x = arm[0][0] + 4 + ((arm[1][0] - arm[0][0] - 4) * i) / n
      box(assembly, rect(x, arm[0][1], 2.6, 1.2), 0, 15, false)
    }
  }
  // The Assembly's east block (25 m) and the chamber block over it (to 41 m)
  // with its shallow dome (GSI aerial).
  const EAST: XY[] = [[105.6, 65.0], [99.4, 51.8], [109.3, 44.8], [114.9, 38.6], [120.0, 30.4], [123.3, 23.4], [124.9, 16.3], [126.5, 9.0], [126.7, 0.5], [126.3, -7.8], [125.3, -15.3], [123.4, -21.2], [118.6, -31.2], [113.3, -39.0], [106.3, -46.1], [99.4, -50.4], [106.6, -63.9], [151.1, -64.0], [151.3, -57.5], [157.8, -57.6], [157.3, -25.5], [161.9, -15.9], [161.8, 17.0], [157.6, 26.5], [157.3, 58.9], [151.0, 58.8], [150.9, 65.2]]
  prism(assembly, EAST, 0, 25, { roof, lip: 1.0 })
  pan(EAST, 4, 24, 0.5, 0.6, win, L.detail ? L.bay : 9, 10)
  const CH: XY[] = [[161.8, 17.0], [157.6, 26.5], [149.5, 26.6], [141.5, 27.8], [130.4, 26.6], [130.4, 22.5], [124.9, 16.3], [121.6, 3.1], [121.6, -4.6], [125.3, -15.3], [130.4, -22.2], [130.3, -25.4], [157.3, -25.5], [161.9, -15.9]]
  prism(assembly, CH, 25, 41, { roof, lip: 0.8 })
  pan(CH, 26, 40, 0.5, 0.6, win, L.detail ? L.bay : 9, 15)
  lathe(roof, [[11.5, 40.9], [10.5, 43.5], [7, 45.6], [0, 46.6]], L.k, [140.5, 0.6], 60)

  // Colours from daylight photos, pulled to the palette's lightness.
  return [
    { part: granite, material: finish('tmg-granite', 0xd3d5d7) },
    { part: crown, material: finish('tmg-granite-crown', 0xb4b8bc) },
    { part: shade, material: finish('tmg-recess', 0x4f565e) },
    { part: win, material: { name: 'window', color: 0x5f7283, roughness: 0.35 } },
    { part: roof, material: PALETTE.roof },
    { part: drum, material: finish('tmg-drum', 0xc3c7cb) },
      ]
}

if (import.meta.main) {
  const meta = { bearing: 349, elevation: 0, height: 243 }
  await writeModel('tokyo-metropolitan-government-building', 'tokyo-metropolitan-government-building.glb', 'Tokyo Metropolitan Government Building', build(LOW), meta, 6500, 256_000)
  await writeModel('tokyo-metropolitan-government-building', 'tokyo-metropolitan-government-building.detail.glb', 'Tokyo Metropolitan Government Building', build(DETAIL), meta, 40_000, 1536 * 1024)
}
