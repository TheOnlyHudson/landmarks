/**
 * Government House (ՀՀ կառավարության շենք), Republic Square, Yerevan:
 * procedural, CC0-1.0.
 *   bun generators/yerevan-government-house.ts   (writes the low and the detail model)
 *
 * This file also holds the small kit the Yerevan models share
 * (yerevan-history-museum, yerevan-opera, yerevan-blue-mosque import it);
 * the Government House itself is built under `import.meta.main`.
 *
 * Alexander Tamanian's seat of government (1926-1952, finished by his son
 * Gevorg), in pink felsite tuff on a basalt base. Identity, in order: the
 * long front bowed concave to the oval square, with five tall round arches
 * in its middle, a carved band over them and an open colonnade along the
 * whole top storey; the square clock tower at its north end with a big
 * arched gateway and an open columned belvedere; the lower three-storey
 * wings with salmon-red pitched metal roofs; the pink-apricot tuff.
 *
 * Frame: x east, y north, z up, metres (bearing 0). Origin: the area
 * centroid of the four OSM ways below, 44.5142889, 40.1772326.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): way/31664493 (building=government, 4
 *   levels, facade colour #e1af87, tuff: the square front and the south-west
 *   wing), way/482593803 (the north-east wing round the court, 4 levels),
 *   way/82681471 (5 levels, closing the court), way/1015255216 (the clock
 *   tower, 6 levels, roof:shape=pyramidal).
 * - Published: ru Wikipedia "Дом правительства Армении": begun 1926,
 *   designed as a complex 1932-1936, halted 1941, finished 1952 by Gevorg
 *   Tamanian; the main front "in a rhythm of five arches"; the tower on the
 *   north side crowned with a rectangular rotunda; pink felsite tuff on a
 *   basalt base. No heights are published.
 * - Photos (Wikimedia Commons, evidence):
 *   g1 Vyacheslav Argenberg, CC BY 4.0, "Yerevan, Government House,
 *      Government of Armenia, Republic Square, Armenia.jpg": from the
 *      north-west, the tower, the north-east wing and the bowed front
 *      https://commons.wikimedia.org/wiki/File:Yerevan,_Government_House,_Government_of_Armenia,_Republic_Square,_Armenia.jpg
 *   g2 Vyacheslav Argenberg, CC BY 4.0, "Yerevan, Government House,
 *      Government of Armenia, Armenia.jpg": the tower close, from the
 *      north-west https://commons.wikimedia.org/wiki/File:Yerevan,_Government_House,_Government_of_Armenia,_Armenia.jpg
 *   g3 Aleksey Chalabyan (Xelgen), CC BY-SA 4.0, "Government House on
 *      Republic Square in Yerevan, Armenia May 2021.jpg": the whole bowed
 *      front from the square (west), far off
 *      https://commons.wikimedia.org/wiki/File:Government_House_on_Republic_Square_in_Yerevan,_Armenia_May_2021.jpg
 *   g4 Vyacheslav Argenberg, CC BY 4.0, "Yerevan, Government House of
 *      Armenia, Republic Square of Yerevan, Armenia.jpg": from above, from
 *      the north: the north-east wing's roofs and the tower
 *      https://commons.wikimedia.org/wiki/File:Yerevan,_Government_House_of_Armenia,_Republic_Square_of_Yerevan,_Armenia.jpg
 *   g6 Beko, CC BY-SA 3.0, "Yerevan Government House 04.jpg": the bowed
 *      front from the south-west in sun: the five arches, the carved band,
 *      the colonnade https://commons.wikimedia.org/wiki/File:Yerevan_Government_House_04.jpg
 *   g8 Preacher lad, CC BY-SA 4.0, "Yerevan Government building
 *      23.03.2025.jpg": at night (floodlit stone, lit clock)
 *      https://commons.wikimedia.org/wiki/File:Yerevan_Government_building_23.03.2025.jpg
 *   g9 GeoO, CC BY-SA 4.0, "Government House №1, Yerevan, Armenia ...jpg":
 *      the north-west fronts at sunset
 *      https://commons.wikimedia.org/wiki/File:Government_House_%E2%84%961,_Yerevan,_Armenia_-_%D4%BF%D5%A1%D5%BC%D5%A1%D5%BE%D5%A1%D6%80%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6_%D5%B7%D5%A5%D5%B6%D6%84_%E2%84%96_1,_%D4%B5%D6%80%D6%87%D5%A1%D5%B6,_%D5%80%D5%A1%D5%B5%D5%A1%D5%BD%D5%BF%D5%A1%D5%B6.jpg
 *   g10 Rita Willaert, CC BY 2.0, "Yerevan square by Rita W.jpg": from the
 *      fountains (north-west) in sun
 *      https://commons.wikimedia.org/wiki/File:Yerevan_square_by_Rita_W.jpg
 * - Look-only: none.
 *
 * Numbers
 * - Plan: OSM, measured. The bowed front is a circle fitted to the OSM
 *   front vertices (centre on the square, radius about 100 m).
 * - Heights: published (visityerevan.am, gov.am) building 25 m, tower about
 *   30 m, clock 4 m across. Drawn: the front's parapet 25.6; the tower
 *   35.0 to its cornice (photo ratios 1.28-1.65 x the front; raised on lead
 *   review so it clears the parapet as in g1, g6), its shaft 28.2, the
 *   belvedere 28.2-33.0; the five arches 6.8 m wide on 7.5 m bays, crowns
 *   13.4, 3.4 m deep (g6: two storeys tall); the carved band 14.1-15.4;
 *   the colonnade storey 15.6-22.9, 3.2 m deep; the wings' eaves 17 m
 *   behind a 0.8 m parapet, their low roofs (flat in the low model,
 *   1 m hips in the detail) barely showing, as in the photos. The tower's
 *   plan 16 x 11.5 m (the 4 m clock fills a quarter of its face).
 * - Colours from daylight photos, pulled to the palette's lightness: the
 *   tuff sunlit #dabaae, #b3958b, #af9388 (g6, g10) and OSM's #e1af87:
 *   re-sampled on review as a mottled pink-brown/mauve about #b98f84
 *   sunlit (g1, g6, g10): drawn #bd9488; recesses and the base #7f5f5a;
 *   cornices and columns #ceaa9e; the roofs' metal, mostly hidden, drawn
 *   dark #93625b.
 *
 * Doubts
 * - No height is published; all are from photo proportions.
 * - OSM tags the tower roof pyramidal; every photo shows a flat-topped
 *   belvedere under a heavy cornice, which is drawn.
 * - The courtyard fronts and the south and east outer fronts are only seen
 *   from a distance (g4): they get the same window panels and hipped roofs
 *   as the north-east wing.
 * - Terrain: Mapterhorn here is z12 only and shows the building as a bump;
 *   the square is flat in every photo, so the model is flat.
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { polyTris, wallPlate } from './berlin-oberbaum-bridge'
import { offset, earcut } from './sf-de-young'

// ───────────────────────────── the Yerevan kit ─────────────────────────────

export type XY = [number, number]
export const TAU = Math.PI * 2
const D2R = Math.PI / 180

/** lon/lat to the model frame: anchor at the origin, +y along `bearing`. */
export function projector(lon0: number, lat0: number, bearing: number) {
  const kx = 111320 * Math.cos(lat0 * D2R), ky = 110574, b = bearing * D2R
  return (lon: number, lat: number): XY => {
    const e = (lon - lon0) * kx, n = (lat - lat0) * ky
    return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
  }
}
export const ringArea = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export const toCCW = (r: XY[]) => (ringArea(r) > 0 ? r : [...r].reverse())
const open = (r: XY[]) => (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r.slice(0, -1) : r)

/** Drop vertices that make edges shorter than `min` or that are collinear. */
export function simplify(r0: XY[], min = 1.0): XY[] {
  let r = open(r0).slice()
  for (let pass = 0; pass < 4; pass++) {
    const out: XY[] = []
    for (let i = 0; i < r.length; i++) {
      const p = r[i], q = out.length ? out[out.length - 1] : r[r.length - 1]
      if (Math.hypot(p[0] - q[0], p[1] - q[1]) < min) continue
      out.push(p)
    }
    const res: XY[] = []
    for (let i = 0; i < out.length; i++) {
      const a = out[(i + out.length - 1) % out.length], b = out[i], c = out[(i + 1) % out.length]
      const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) * Math.hypot(c[0] - b[0], c[1] - b[1])
      if (Math.abs(cr) / (l || 1) > 0.02) res.push(b)
    }
    r = res
  }
  return r
}
type MP = Array<Array<Array<[number, number]>>>
const toPC = (r: XY[]) => [[...open(r), open(r)[0]].map(([a, b]) => [a, b] as [number, number])]
const fromPC = (mp: MP): XY[][] => mp.map((poly) => toCCW(open(poly[0] as XY[])))
/** The parts of `ring` inside `clip` (or outside, `minus`). Outer rings only. */
export function clipRing(ring: XY[], clip: XY[], minus = false): XY[][] {
  const mp = (minus ? clipping.difference(toPC(ring) as any, toPC(clip) as any) : clipping.intersection(toPC(ring) as any, toPC(clip) as any)) as MP
  return fromPC(mp)
}
export function unionRings(rings: XY[][]): XY[][] {
  return fromPC((clipping.union as any)(...rings.map(toPC)) as MP)
}
/** A big polygon on the left of the line a→b. */
export function halfPlane(a: XY, b: XY, size = 2000): XY[] {
  const d: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]), u: XY = [d[0] / l, d[1] / l], n: XY = [-u[1], u[0]]
  const P = (s: number, w: number): XY => [a[0] + u[0] * s + n[0] * w, a[1] + u[1] * s + n[1] * w]
  return [P(-size, 0), P(size, 0), P(size, size), P(-size, size)]
}
export const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export function insidePoly(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < ((r[j][0] - r[i][0]) * (p[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  }
  return c
}

export function ftri(p: Part, a: V3, b: V3, c: V3, n: V3) { p.tri(a, b, c, undefined, undefined, undefined, [n, n, n]) }
export function fquad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) { ftri(p, a, b, c, n); ftri(p, a, c, d, n) }
const nz = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const triN = (a: V3, b: V3, c: V3): V3 => nz([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])])

/** Vertical walls round a ring (any winding), from z0 to z1, facing out. */
export function walls(p: Part, ring0: XY[], z0: number, z1: number, skip?: (a: XY, b: XY) => boolean) {
  const r = toCCW(ring0)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skip?.(a, b)) continue
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    fquad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
  }
}
/** A flat cap over a ring with optional holes. */
export function capRing(p: Part, ring: XY[], z: number, up = true, holes: XY[][] = []) {
  const n: V3 = [0, 0, up ? 1 : -1]
  const tris = holes.length ? polyTris(toCCW(ring), holes) : earcut(toCCW(ring)).map(([i, j, k]) => [toCCW(ring)[i], toCCW(ring)[j], toCCW(ring)[k]] as [XY, XY, XY])
  for (const [a, b, c] of tris) ftri(p, [a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z], n)
}
export function prismRing(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number) {
  walls(wall, ring, z0, z1)
  if (top) capRing(top, ring, z1)
}
/** A hipped roof: the ring at z rising to its inset by `inset` at z + rise, the top capped flat. */
export function hipRoof(p: Part, ring0: XY[], z: number, inset: number, rise: number) {
  const r = toCCW(simplify(ring0, 0.8)), q = offset(r, -inset)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const a: V3 = [r[i][0], r[i][1], z], b: V3 = [r[j][0], r[j][1], z], c: V3 = [q[j][0], q[j][1], z + rise], d: V3 = [q[i][0], q[i][1], z + rise]
    const n = triN(a, b, c)
    if (n[2] > -0.05) fquad(p, a, b, c, d, n[2] < 0 ? nz([n[0], n[1], 0.05]) : n)
  }
  if (ringArea(q) > 1) capRing(p, q, z + rise)
}
/** A projecting band round a ring: out by `out`, from z to z + h, with its soffit and top. */
export function band(p: Part, ring0: XY[], z: number, h: number, out: number, skip?: (a: XY, b: XY) => boolean) {
  const r = toCCW(ring0), o = offset(r, out)
  walls(p, o, z, z + h, skip ? (a, b) => { const i = o.indexOf(a); return skip(r[i], r[(i + 1) % r.length]) } : undefined)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    if (skip?.(r[i], r[j])) continue
    fquad(p, [r[i][0], r[i][1], z], [o[i][0], o[i][1], z], [o[j][0], o[j][1], z], [r[j][0], r[j][1], z], [0, 0, -1])
    fquad(p, [r[i][0], r[i][1], z + h], [r[j][0], r[j][1], z + h], [o[j][0], o[j][1], z + h], [o[i][0], o[i][1], z + h], [0, 0, 1])
  }
}

/** A face frame along a ring edge or chord: s along, w out of the wall. */
export type Face = { A: XY; u: XY; n: XY; L: number }
export const faceOf = (A: XY, B: XY): Face => {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  return { A, u, n: [u[1], -u[0]], L }
}
export const onFace = (f: Face, s: number, w: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.n[0] * w, f.A[1] + f.u[1] * s + f.n[1] * w, z]

/** An arch outline in (s, z): jambs from z0, springing zs; round or pointed; clockwise not assumed. */
export function archOutline(s0: number, s1: number, z0: number, zs: number, seg: number, pointed = 0): XY[] {
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  const pts: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  if (!pointed) {
    for (let i = 1; i < seg; i++) { const t = (Math.PI * i) / seg; pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)]) }
  } else {
    // two-centred: each side an arc of radius R = pointed * width, centred on the far side
    const R = pointed * (s1 - s0), cr = s1 - R, cl = s0 + R, aR = Math.acos((c - cr) / R)
    const h = seg >> 1
    for (let i = 1; i <= h; i++) { const a = (aR * i) / h; pts.push([cr + R * Math.cos(a), zs + R * Math.sin(a)]) }
    for (let i = h - 1; i >= 1; i--) { const a = (aR * i) / h; pts.push([cl - R * Math.cos(a), zs + R * Math.sin(a)]) }
  }
  pts.push([s0, zs])
  return pts
}
/** A flat panel in (s, z) shape on a face, `w` out from the face line. */
export function facePanel(p: Part, f: Face, shape: XY[], w: number) {
  const n: V3 = [f.n[0], f.n[1], 0]
  const r = toCCW(shape)
  for (const [i, j, k] of earcut(r)) ftri(p, onFace(f, r[i][0], w, r[i][1]), onFace(f, r[j][0], w, r[j][1]), onFace(f, r[k][0], w, r[k][1]), n)
}
/**
 * A wall slab on face f (outer face on the face line, `t` thick behind it),
 * outline in (s, z) with holes cut through and their reveals drawn.
 */
export function screen(p: Part, f: Face, outline: XY[], holes: XY[][], t: number, reveal?: Part, faces: [boolean, boolean] = [true, true]) {
  const at = (s: number, w: number, z: number): V3 => onFace(f, s, w - t / 2, z)
  wallPlate(p, outline, holes, t, at, [f.n[0], f.n[1], 0], { reveal, faces })
}
/** A round shaft (column) with optional base and capital blocks. */
export function column(p: Part, c: XY, r: number, z0: number, z1: number, n: number, cap = 0, base = 0) {
  const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const a = (i * TAU) / n + Math.PI / n; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z] })
  const shaft0 = z0 + (base ? base * 0.8 : 0), shaft1 = z1 - (cap ? cap : 0)
  // smooth shaft
  const A = ring(r, shaft0), B = ring(r * 0.94, shaft1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a0 = (i * TAU) / n + Math.PI / n, a1 = (j * TAU) / n + Math.PI / n
    const N0: V3 = [Math.cos(a0), Math.sin(a0), 0], N1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [N0, N1, N1])
    p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [N0, N1, N0])
  }
  if (cap) blockXY(p, c, r * 1.45, r * 1.45, shaft1, z1, 0)
  if (base) blockXY(p, c, r * 1.35, r * 1.35, z0, shaft0, 0)
}
/** An axis-aligned or turned box centred on c (half sizes hx, hy), z0..z1, turned by `rot` rad. */
export function blockXY(p: Part, c: XY, hx: number, hy: number, z0: number, z1: number, rot = 0, bottom = false) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const P = (x: number, y: number): XY => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]
  const r = [P(-hx, -hy), P(hx, -hy), P(hx, hy), P(-hx, hy)]
  walls(p, r, z0, z1)
  capRing(p, r, z1)
  if (bottom) capRing(p, r, z0, false)
}
/** A surface of revolution about the z axis at c: profile [r, z] bottom to top, smooth normals. */
export function lathe(p: Part, prof: XY[], n: number, c: XY = [0, 0], a0 = 0) {
  const nrm = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as XY
  })
  const P = (r: number, z: number, t: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
  const N = (k: number, t: number): V3 => [nrm[k][0] * Math.cos(t), nrm[k][0] * Math.sin(t), nrm[k][1]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const t0 = a0 + (i * TAU) / n, t1 = a0 + ((i + 1) * TAU) / n
      if (r0 > 1e-6) p.tri(P(r0, z0, t0), P(r0, z0, t1), P(r1, z1, t1), undefined, undefined, undefined, [N(k, t0), N(k, t1), N(k + 1, t1)])
      if (r1 > 1e-6) p.tri(P(r0, z0, t0), P(r1, z1, t1), P(r1, z1, t0), undefined, undefined, undefined, [N(k, t0), N(k + 1, t1), N(k + 1, t0)])
    }
  }
}
/**
 * Window panels along every edge of a ring: bays of `bay` metres centred on
 * each edge, a panel `w` wide per bay and row; `arch` rows get a round
 * head. Edges shorter than `minLen`, or whose outside is inside one of the
 * `hidden` rings, are skipped.
 */
export function ringPanels(p: Part, ring0: XY[], rows: Array<{ z0: number; z1: number; arch?: boolean }>, o: { bay: number; w: number; margin?: number; minLen?: number; hidden?: XY[][]; seg?: number; skip?: (f: Face) => boolean; frame?: Part }) {
  const r = toCCW(ring0)
  for (let i = 0; i < r.length; i++) {
    const f = faceOf(r[i], r[(i + 1) % r.length])
    if (f.L < (o.minLen ?? 5)) continue
    if (o.skip?.(f)) continue
    const m = Math.floor((f.L - 2 * (o.margin ?? 1.2)) / o.bay)
    if (m < 1) continue
    for (let k = 0; k < m; k++) {
      const s = (f.L - (m - 1) * o.bay) / 2 + k * o.bay
      const probe = onFace(f, s, 1.5, 0)
      if (o.hidden?.some((h) => insidePoly([probe[0], probe[1]], h))) continue
      for (const row of rows) {
        const shape = row.arch ? archOutline(s - o.w / 2, s + o.w / 2, row.z0, row.z1 - o.w / 2, o.seg ?? 4) : rectRing(s - o.w / 2, row.z0, s + o.w / 2, row.z1)
        facePanel(p, f, shape, 0.05)
        if (o.frame) windowFrame(o.frame, f, s, o.w, row.z0, row.z1, !!row.arch, o.seg ?? 4)
      }
    }
  }
}
/** A pale stone surround: sill, jambs and (round or flat) head standing proud of the wall. */
export function windowFrame(p: Part, f: Face, s: number, w: number, z0: number, z1: number, arch: boolean, seg: number, t = 0.22, d = 0.16) {
  const h = w / 2
  blockOnFace(p, f, s - h - t, s + h + t, z0 - t * 1.2, z0, d + 0.06, -0.05)
  const zs = arch ? z1 - h : z1
  blockOnFace(p, f, s - h - t, s - h, z0, zs, d, -0.05)
  blockOnFace(p, f, s + h, s + h + t, z0, zs, d, -0.05)
  if (!arch) { blockOnFace(p, f, s - h - t, s + h + t, z1, z1 + t, d, -0.05); return }
  for (let i = 0; i < seg; i++) {
    const a0 = (Math.PI * i) / seg, a1 = (Math.PI * (i + 1)) / seg
    const P = (a: number, r: number, w2: number) => onFace(f, s + r * Math.cos(a), w2, zs + r * Math.sin(a))
    const q = [P(a0, h, d), P(a1, h, d), P(a1, h + t, d), P(a0, h + t, d)]
    fquad(p, q[0], q[3], q[2], q[1], [f.n[0], f.n[1], 0])
    const o0 = P(a0, h + t, -0.05), o1 = P(a1, h + t, -0.05)
    fquad(p, q[3], o0, o1, q[2], nz([Math.cos((a0 + a1) / 2) * f.u[0], Math.cos((a0 + a1) / 2) * f.u[1], Math.sin((a0 + a1) / 2)]))
  }
}
/** Write a GLB under models/, checking its budget. */
export async function save(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, meta: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter((q) => q.part.triangles > 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...meta })
  const tris = used.reduce((s, q) => s + q.part.triangles, 0)
  if (process.env.PARTS) console.log(file, used.map((q) => `${q.material.name}:${q.part.triangles}`).join(' '))
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles > ${maxTris}`)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes > ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
/** Floodlight helper: walls lit, faces looking up barely. */
export const wallLight = (k = 0.85) => (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : k)

// ───────────────────────────── the Government House ─────────────────────────────

const ANCHOR: XY = [44.5142889, 40.1772326]
const OSM: Record<string, Array<[number, number]>> = {
  'way/31664493': [[44.5139168, 40.1774540], [44.5138957, 40.1774403], [44.5138832, 40.1773654], [44.5140066, 40.1773650], [44.5140045, 40.1772552], [44.5140437, 40.1772496], [44.5140391, 40.1771177], [44.5139996, 40.1771200], [44.5139615, 40.1770204], [44.5138412, 40.1770317], [44.5137976, 40.1768951], [44.5139751, 40.1766553], [44.5142008, 40.1768608], [44.5143533, 40.1767490], [44.5142406, 40.1766535], [44.5142873, 40.1766211], [44.5140789, 40.1764362], [44.5139762, 40.1764295], [44.5139028, 40.1764784], [44.5136789, 40.1767708], [44.5136529, 40.1767624], [44.5135997, 40.1768375], [44.5136574, 40.1768731], [44.5135864, 40.1769565], [44.5136590, 40.1770225], [44.5136954, 40.1770924], [44.5137289, 40.1771986], [44.5137317, 40.1773020], [44.5137177, 40.1773831], [44.5137005, 40.1774829], [44.5137215, 40.1775406], [44.5137089, 40.1775550], [44.5137657, 40.1775913], [44.5138950, 40.1774764]],
  'way/482593803': [[44.5145542, 40.1777357], [44.5148890, 40.1774844], [44.5148903, 40.1774321], [44.5146015, 40.1771889], [44.5144907, 40.1770974], [44.5146454, 40.1769950], [44.5147173, 40.1770591], [44.5147334, 40.1770489], [44.5147651, 40.1770766], [44.5151572, 40.1774198], [44.5151521, 40.1774596], [44.5151424, 40.1775356], [44.5147037, 40.1778505], [44.5147120, 40.1778569], [44.5146006, 40.1779419], [44.5144024, 40.1779443], [44.5143236, 40.1778916], [44.5138895, 40.1776375], [44.5140008, 40.1775411], [44.5139469, 40.1775082], [44.5138950, 40.1774764], [44.5139168, 40.1774540], [44.5139712, 40.1774860], [44.5144182, 40.1777488], [44.5144944, 40.1777486], [44.5145399, 40.1777248]],
  'way/82681471': [[44.5143839, 40.1767270], [44.5142008, 40.1768608], [44.5144787, 40.1771054], [44.5144907, 40.1770974], [44.5146454, 40.1769950], [44.5146699, 40.1769788]],
  'way/1015255216': [[44.5138568, 40.1776663], [44.5138070, 40.1776350], [44.5137546, 40.1776012], [44.5137657, 40.1775913], [44.5138950, 40.1774764], [44.5139469, 40.1775082], [44.5140008, 40.1775411], [44.5138895, 40.1776375]],
}
const P0 = projector(ANCHOR[0], ANCHOR[1], 0)
const ring = (id: string) => toCCW(OSM[id].map(([lo, la]) => P0(lo, la)))
/** The earlier working frame (origin 44.5142, 40.1777) to this one. */
const old = (x: number, y: number): XY => P0(44.5142 + x / (111320 * Math.cos(ANCHOR[1] * D2R)), 40.1777 + y / 110574)

// heights (see the header)
const Z = {
  front: 24.4, top: 25.6, archTop: 13.4, archSpring: 10.0, band0: 14.0, band1: 15.4,
  log0: 15.6, col1: 22.9, wing: 17.0, wingRidge: 18.0, corner: 21.0, tower: 28.2, belv1: 33.0, belvTop: 35.0,
}

function build(detail: boolean) {
  const tuff = new Part(), shade = new Part(), trim = new Part(), roof = new Part(), win = new Part(), clock = new Part()
  const SEG = detail ? 10 : 6
  const R1 = ring('way/31664493'), R2 = ring('way/482593803'), R3 = ring('way/82681471'), R4 = ring('way/1015255216')

  // ── the bowed front: a circle fitted to OSM's front vertices ──
  const fp = [[44.513659, 40.1770225], [44.5136954, 40.1770924], [44.5137289, 40.1771986], [44.5137317, 40.177302], [44.5137177, 40.1773831], [44.5137005, 40.1774829]].map(([a, b]) => P0(a, b))
  // Kasa fit
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0
  for (const [x, y] of fp) { const z = x * x + y * y; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; sxz += x * z; syz += y * z; sz += z }
  const n = fp.length
  const M = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]], v = [sxz, syz, sz]
  const det = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  const D0 = det(M), sol = [0, 1, 2].map((k) => det(M.map((row, i) => row.map((c, j) => (j === k ? v[i] : c)))) / D0)
  const C: XY = [sol[0] / 2, sol[1] / 2], R = Math.sqrt(sol[2] + C[0] * C[0] + C[1] * C[1])
  const north = old(-41.8, -15), south = old(-49.0, -80)
  const thN = Math.atan2(north[1] - C[1], north[0] - C[0]), thS = Math.atan2(south[1] - C[1], south[0] - C[0])
  const L = R * (thN - thS)
  const AP = (s: number, d: number): XY => { const t = thN - s / R; return [C[0] + (R + d) * Math.cos(t), C[1] + (R + d) * Math.sin(t)] }
  const sMid = L / 2
  const BAY = 7.5, A0 = sMid - 2.5 * BAY, A1 = sMid + 2.5 * BAY
  const LOG0 = 5.5, LOG1 = L - 3.5, DA = 3.4, DL = 3.2
  const inner: XY[] = [[-32.0, -80], [-30.52, -73.9], [-20.29, -75.15], [-17.04, -64.13], [-13.69, -64.39], [-13.29, -49.8], [-16.63, -49.18], [-16.45, -37.04], [-26.95, -37.0], [-25.88, -28.72], [-24.09, -27.2], [-25.94, -24.72], [-36.94, -12.02]].map(([x, y]) => old(x, y))
  // front chain samples (s, d) for a recess [r0, r1] of depth dd
  const chain = (r0: number, r1: number, dd: number): Array<[number, number]> => {
    const ss = new Set<number>([0, L])
    for (let s = 0; s <= L; s += 2.4) ss.add(s)
    const out: Array<[number, number]> = []
    const sorted = [...ss].filter((s) => !(dd && Math.abs(s - r0) < 0.6) && !(dd && Math.abs(s - r1) < 0.6)).sort((a, b) => a - b)
    for (const s of sorted) {
      if (dd && s > r0 && out.length && out[out.length - 1][0] < r0) out.push([r0, 0], [r0, dd])
      if (dd && s > r1 && out.length && out[out.length - 1][0] < r1) out.push([r1, dd], [r1, 0])
      out.push([s, dd && s > r0 && s < r1 ? dd : 0])
    }
    return out
  }
  const frontRing = (ch: Array<[number, number]>) => [...ch.map(([s, d]) => AP(s, d)), ...inner]
  type Layer = { z0: number; z1: number; ch: Array<[number, number]> }
  const layers: Layer[] = [
    { z0: 0, z1: Z.band0, ch: chain(A0, A1, DA) },
    { z0: Z.band0, z1: Z.log0, ch: chain(0, 0, 0) },
    { z0: Z.log0, z1: Z.col1, ch: chain(LOG0, LOG1, DL) },
    { z0: Z.col1, z1: Z.front, ch: chain(0, 0, 0) },
  ]
  for (const ly of layers) {
    const r = frontRing(ly.ch)
    // chain edges: recess backs in shade; the rest tuff
    const nCh = ly.ch.length
    const rr = r // the chain runs north→south on the west: with the inner chain this ring is clockwise? fix winding per edge
    const cw = ringArea(rr) < 0
    for (let i = 0; i < rr.length; i++) {
      const j = (i + 1) % rr.length
      const a = cw ? rr[j] : rr[i], b = cw ? rr[i] : rr[j]
      const back = i < nCh - 1 && ly.ch[i][1] > 0 && ly.ch[j][1] > 0
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      fquad(back ? shade : tuff, [a[0], a[1], ly.z0], [b[0], b[1], ly.z0], [b[0], b[1], ly.z1], [a[0], a[1], ly.z1], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
    }
  }
  // recess floors and ceilings
  const strip = (s0: number, s1: number, dd: number, z: number, up: boolean, p: Part) => {
    const m = Math.max(1, Math.ceil((s1 - s0) / 2.4))
    for (let k = 0; k < m; k++) {
      const a = s0 + ((s1 - s0) * k) / m, b = s0 + ((s1 - s0) * (k + 1)) / m
      const q = [AP(a, 0), AP(b, 0), AP(b, dd), AP(a, dd)].map(([x, y]) => [x, y, z] as V3)
      // AP(a,0)→AP(b,0) runs south; seen from above that ring is clockwise
      if (up) fquad(p, q[0], q[3], q[2], q[1], [0, 0, 1]); else fquad(p, q[0], q[1], q[2], q[3], [0, 0, -1])
    }
  }
  strip(A0, A1, DA, 0.02, true, shade)
  strip(A0, A1, DA, Z.band0, false, shade)
  strip(LOG0, LOG1, DL, Z.log0, true, shade)
  strip(LOG0, LOG1, DL, Z.col1, false, shade)
  // the roof and parapet
  const topRing = frontRing(chain(0, 0, 0))
  walls(tuff, topRing, Z.front, Z.top)
  parapet(trim, roof, topRing, Z.front - 0.3, Z.top, 0.6)
  // the five arches: a screen per bay with a real round-arched opening
  for (let i = 0; i < 5; i++) {
    const s0 = A0 + i * BAY, s1 = s0 + BAY
    const f = faceOf(AP(s0, 0), AP(s1, 0))
    const c = f.L / 2, w = 6.8
    screen(tuff, f, rectRing(0, 0, f.L, Z.band0), [archOutline(c - w / 2, c + w / 2, 0.35, Z.archSpring, SEG)], 0.9, trim)
    // inside: a glazed back with a balcony slab half way
    const fb = faceOf(AP(s0, DA), AP(s1, DA))
    facePanel(win, fb, archOutline(fb.L / 2 - 2.6, fb.L / 2 + 2.6, 0.8, Z.archSpring, SEG), 0.04)
    if (detail) {
      // the balcony at the second floor and paired half-columns on the piers
      const sl = [onFace(f, c - w / 2, -0.9, 5.6), onFace(f, c + w / 2, -0.9, 5.6), onFace(fb, fb.L / 2 + 2.6, 0, 5.6), onFace(fb, fb.L / 2 - 2.6, 0, 5.6)]
      fquad(trim, sl[0], sl[3], sl[2], sl[1], [0, 0, 1])
      for (const s of i === 0 ? [0.0, f.L] : [f.L]) {
        for (const off of [-0.55, 0.55]) {
          const p = onFace(f, s + off, 0.25, 0)
          column(trim, [p[0], p[1]], 0.28, 0.4, Z.archSpring, 8, 0.45, 0.4)
        }
      }
    }
  }
  // the carved band over the arches: bold ornament panels (detail), a plain raised band (low)
  {
    const m = Math.ceil((A1 + 6 - (A0 - 6)) / 2.4)
    for (let k = 0; k < m; k++) {
      const a = A0 - 6 + ((A1 - A0 + 12) * k) / m, b = A0 - 6 + ((A1 - A0 + 12) * (k + 1)) / m
      const f = faceOf(AP(a, 0), AP(b, 0))
      if (detail) {
        // a rosette-and-interlace relief: a raised panel with a bold boss
        blockOnFace(trim, f, 0.15, f.L - 0.15, 14.15, 15.3, 0.22)
        boss(trim, f, f.L / 2, 14.72, 0.5, 0.26)
      } else blockOnFace(trim, f, 0, f.L, 14.1, 15.35, 0.14)
    }
  }
  // the colonnade: columns before the loggia, a solid balustrade between
  {
    const step = 3.05, m = Math.round((LOG1 - LOG0) / step), st = (LOG1 - LOG0) / m
    for (let k = 0; k <= m; k++) {
      const s = LOG0 + k * st, c = AP(s, 0.55)
      column(trim, c, 0.5, Z.log0, Z.col1, detail ? 12 : 7, detail ? 0.55 : 0.4, detail ? 0.35 : 0)
      if (k < m) {
        const f = faceOf(AP(s, 0), AP(s + st, 0))
        if (!detail) blockOnFace(trim, f, 0.5, f.L - 0.5, Z.log0, Z.log0 + 1.1, -0.15, -0.55)
        else {
          // a balustrade: plinth, turned balusters, a top rail
          blockOnFace(trim, f, 0.5, f.L - 0.5, Z.log0, Z.log0 + 0.18, -0.12, -0.58)
          blockOnFace(trim, f, 0.5, f.L - 0.5, Z.log0 + 0.95, Z.log0 + 1.12, -0.1, -0.6)
          const nb = Math.floor((f.L - 1.2) / 0.36)
          for (let q = 0; q < nb; q++) {
            const pq = onFace(f, 0.6 + (f.L - 1.2) * (q + 0.5) / nb, -0.35, 0)
            lathe(trim, [[0.1, Z.log0 + 0.18], [0.13, Z.log0 + 0.35], [0.07, Z.log0 + 0.62], [0.11, Z.log0 + 0.85], [0.08, Z.log0 + 0.95]], 6, [pq[0], pq[1]])
          }
        }
        // a window per bay on the loggia's back wall
        const fb = faceOf(AP(s, DL), AP(s + st, DL))
        facePanel(win, fb, rectRing(0.6, Z.log0 + 1.1, fb.L - 0.6, Z.col1 - 0.5), 0.04)
      }
    }
    // the entablature's projecting cornice
    const cr = chain(0, 0, 0).map(([s]) => AP(s, -0.55))
    for (let k = 0; k < cr.length - 1; k++) {
      const a = cr[k], b = cr[k + 1], ai = AP(chain(0, 0, 0)[k][0], 0.2), bi = AP(chain(0, 0, 0)[k + 1][0], 0.2)
      const f = faceOf(a, b)
      fquad(trim, [a[0], a[1], Z.front - 0.7], [b[0], b[1], Z.front - 0.7], [b[0], b[1], Z.front], [a[0], a[1], Z.front], [f.n[0], f.n[1], 0])
      fquad(trim, [a[0], a[1], Z.front - 0.7], [ai[0], ai[1], Z.front - 0.7], [bi[0], bi[1], Z.front - 0.7], [b[0], b[1], Z.front - 0.7], [0, 0, -1])
      fquad(trim, [a[0], a[1], Z.front], [b[0], b[1], Z.front], [bi[0], bi[1], Z.front], [ai[0], ai[1], Z.front], [0, 0, 1])
    }
  }
  // the front's lower windows outside the arches: tall arched first-floor panels, ground-floor panels
  {
    const bays: number[] = []
    for (let s = 2.6; s < A0 - 1.5; s += 3.6) bays.push(s)
    for (let s = L - 2.6; s > A1 + 1.5; s -= 3.6) bays.push(s)
    for (const s of bays) {
      const f = faceOf(AP(s - 1.2, 0), AP(s + 1.2, 0))
      facePanel(win, f, rectRing(0.6, 1.6, f.L - 0.6, 5.2), 0.05)
      facePanel(win, f, archOutline(0.5, f.L - 0.5, 6.6, 10.4, 4), 0.05)
    }
  }
  // the basalt base along the front
  for (const ly of [layers[1]]) {
    const ch = chain(0, 0, 0)
    for (let k = 0; k < ch.length - 1; k++) {
      if (ch[k][0] >= A0 && ch[k + 1][0] <= A1) continue
      const f = faceOf(AP(ch[k][0], 0), AP(ch[k + 1][0], 0))
      blockOnFace(shade, f, 0, f.L, 0, 0.9, 0.12)
    }
    void ly
  }

  // ── the clock tower ──
  {
    const c = old(-27.4, -14.4)
    const aU: XY = (() => { const p = old(-25.94, -24.72), q = old(-36.94, -12.02), l = Math.hypot(p[0] - q[0], p[1] - q[1]); return [(p[0] - q[0]) / l, (p[1] - q[1]) / l] })()
    const bU: XY = [aU[1], -aU[0]] // a runs south-east along the tower's long side, b to the north-east
    const TP = (a: number, b: number): XY => [c[0] + aU[0] * a + bU[0] * b, c[1] + aU[1] * a + bU[1] * b]
    const HA = 5.75, HB = 8.0
    const rect = (a0: number, b0: number, a1: number, b1: number) => [TP(a0, b0), TP(a1, b0), TP(a1, b1), TP(a0, b1)]
    // the gateway: a slot 4.9 wide and 3 deep in the north-west face, behind an arched screen
    const GW = 3.25, GD = 4.5, GZ = 11.4
    const slotRing: XY[] = [TP(-HA, -HB), TP(HA, -HB), TP(HA, HB), TP(-HA, HB), TP(-HA, GW), TP(-HA + GD, GW), TP(-HA + GD, -GW), TP(-HA, -GW)]
    const inv = (p: XY): XY => [(p[0] - c[0]) * aU[0] + (p[1] - c[1]) * aU[1], (p[0] - c[0]) * bU[0] + (p[1] - c[1]) * bU[1]]
    const isSlot = (a: XY, b: XY) => { const m = inv([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); return m[0] > -HA + 0.1 && Math.abs(m[1]) < GW + 0.1 }
    walls(tuff, slotRing, 0, GZ, isSlot)
    walls(shade, slotRing, 0, GZ, (a, b) => !isSlot(a, b))
    capRing(shade, rect(-HA, -GW, -HA + GD, GW), GZ, false)
    capRing(shade, rect(-HA, -GW, -HA + GD, GW), 0.02, true)
    facePanel(win, faceOf(TP(-HA + GD, -GW), TP(-HA + GD, GW)), rectRing(0.5, 0.2, 2 * GW - 0.5, 7.5), 0.04)
    const fNW = faceOf(TP(-HA, -HB), TP(-HA, HB))
    screen(tuff, fNW, rectRing(0, 0, 2 * HB, GZ), [archOutline(HB - GW, HB + GW, 0.3, 10.0 - GW, SEG)], 0.9, trim)
    walls(tuff, rect(-HA, -HB, HA, HB), GZ, Z.tower)
    // the cornice under the belvedere, then the belvedere: corner piers, columns, an inner room, the entablature
    band(trim, rect(-HA, -HB, HA, HB), Z.tower - 0.6, 0.6, 0.45)
    capRing(trim, rect(-HA - 0.45, -HB - 0.45, HA + 0.45, HB + 0.45), Z.tower)
    const IN = 2.3
    prismRing(shade, null, rect(-HA + IN, -HB + IN, HA - IN, HB - IN), Z.tower, Z.belv1)
    for (const [a, b] of [[-HA, -HB], [HA, -HB], [HA, HB], [-HA, HB]] as XY[]) {
      const p = TP(a - Math.sign(a) * 0.65, b - Math.sign(b) * 0.65)
      blockXY(tuff, p, 0.65, 0.65, Z.tower, Z.belv1, Math.atan2(aU[1], aU[0]))
    }
    const colsAlong = (p0: XY, p1: XY, k: number) => {
      for (let i = 1; i <= k; i++) {
        const t = i / (k + 1), p: XY = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]
        column(trim, p, 0.36, Z.tower, Z.belv1, detail ? 12 : 6, detail ? 0.45 : 0, detail ? 0.3 : 0)
      }
    }
    colsAlong(TP(-HA + 0.6, -HB + 0.6), TP(-HA + 0.6, HB - 0.6), 4)
    colsAlong(TP(HA - 0.6, -HB + 0.6), TP(HA - 0.6, HB - 0.6), 4)
    colsAlong(TP(-HA + 0.6, -HB + 0.6), TP(HA - 0.6, -HB + 0.6), 2)
    colsAlong(TP(-HA + 0.6, HB - 0.6), TP(HA - 0.6, HB - 0.6), 2)
    // a low balustrade between the piers
    for (const [p, q] of [[TP(-HA, -HB), TP(-HA, HB)], [TP(-HA, HB), TP(HA, HB)], [TP(HA, HB), TP(HA, -HB)], [TP(HA, -HB), TP(-HA, -HB)]] as Array<[XY, XY]>) {
      const f = faceOf(p, q)
      blockOnFace(trim, f, 1.3, f.L - 1.3, Z.tower, Z.tower + 0.95, -0.3, -0.7)
    }
    const ent = rect(-HA, -HB, HA, HB)
    walls(tuff, ent, Z.belv1, Z.belvTop - 0.7)
    capRing(shade, rect(-HA + 0.01, -HB + 0.01, HA - 0.01, HB - 0.01), Z.belv1, false)
    band(trim, ent, Z.belvTop - 0.7, 0.7, 0.6)
    capRing(roof, rect(-HA - 0.6, -HB - 0.6, HA + 0.6, HB + 0.6), Z.belvTop)
    // the clock on the north-west face, and a window panel either side of the gate
    const f = faceOf(TP(-HA, -HB), TP(-HA, HB))
    const disc = (r: number, w: number, p: Part) => facePanel(p, f, Array.from({ length: detail ? 20 : 12 }, (_, i) => { const t = (i * TAU) / (detail ? 20 : 12); return [HB + r * Math.cos(t), 21.2 + r * Math.sin(t)] as XY }), w)
    disc(2.45, 0.08, trim)
    disc(2.0, 0.14, clock)
    for (const fs of [f, faceOf(TP(HA, HB), TP(HA, -HB)), faceOf(TP(HA, -HB), TP(-HA, -HB))]) {
      // narrow windows up the shaft
      if (fs === f) { facePanel(win, fs, archOutline(HB - 0.8, HB + 0.8, 12.4, 14.0, 4), 0.05); continue }
      facePanel(win, fs, archOutline(fs.L / 2 - 0.8, fs.L / 2 + 0.8, 11.2, 13.4, 4), 0.05)
      facePanel(win, fs, rectRing(fs.L / 2 - 0.8, 16.2, fs.L / 2 + 0.8, 19.6), 0.05)
    }
    if (detail) {
      // a flagpole on the belvedere
      column(trim, c, 0.08, Z.belvTop, Z.belvTop + 9, 6)
    }
  }

  // ── the wings ──
  const spav = clipRing(R1, rectRing(...old(-60, -108), ...old(-25, -80)))
  const sw = clipRing(R1, rectRing(...old(-60, -150), ...old(25, -80))).flatMap((r) => spav.length ? clipRing(r, spav[0], true) : [r])
  const corner = clipRing(R2, [old(2, 30), old(10, 14), old(26, 2), old(50, 0), old(50, 30)].map((p) => p) as XY[])
  const rest2 = corner.length ? clipRing(R2, corner[0], true) : [R2]
  const frontR = frontRing(chain(0, 0, 0))
  const hidden = [frontR, R4, ...spav, ...sw, ...corner, ...rest2, R3]
  const wingRows = [{ z0: 1.8, z1: 6.0, arch: true }, { z0: 7.2, z1: 15.0, arch: true }]
  const wing = (r: XY[], h: number, ridge: number, inset: number, rows: typeof wingRows, bay = 3.4) => {
    walls(tuff, r, 0, h)
    band(shade, r, 0, 0.9, 0.12)
    band(trim, r, h - 0.55, 0.55, 0.4)
    // a parapet hides most of the low metal roof behind it
    walls(tuff, r, h, h + 0.8)
    if (detail) hipRoof(roof, offset(toCCW(simplify(r, 0.8)), -0.3), h, inset, ridge - h)
    else capRing(roof, r, h + 0.45)
    ringPanels(win, r, rows, { bay, w: 1.9, hidden: hidden.filter((q) => q !== r), seg: detail ? 6 : 3, frame: detail ? trim : undefined })
  }
  for (const r of rest2) wing(r, Z.wing, Z.wingRidge, 6.2, wingRows)
  for (const r of corner) wing(r, Z.corner, Z.corner + 1.2, 7.5, [...wingRows, { z0: 16.4, z1: 19.4, arch: false }])
  for (const r of sw) wing(r, Z.wing, Z.wingRidge, 6.0, wingRows)
  wing(R3, 19.0, 20.1, 6.0, [...wingRows, { z0: 15.9, z1: 17.9, arch: false }])
  for (const r of spav) {
    walls(tuff, r, 0, Z.front)
    band(shade, r, 0, 0.9, 0.12)
    band(trim, r, Z.front - 0.7, 0.7, 0.55)
    walls(tuff, toCCW(r), Z.front, Z.top)
    parapet(trim, roof, r, Z.front - 0.3, Z.top, 0.6)
    ringPanels(win, r, [{ z0: 1.8, z1: 5.6 }, { z0: 6.8, z1: 11.6, arch: true }, { z0: 16.4, z1: 21.6 }], { bay: 3.8, w: 1.9, hidden: hidden.filter((q) => q !== r), seg: detail ? 6 : 3 })
  }
  // the bowed front's own end faces and court side get panels too
  ringPanels(win, frontR, [{ z0: 1.8, z1: 5.6, arch: true }, { z0: 6.8, z1: 11.2, arch: true }, { z0: 16.4, z1: 21.6 }], { bay: 3.6, w: 1.6, hidden: hidden.filter((q) => q !== frontR), skip: (f) => Math.abs(Math.hypot(f.A[0] - C[0], f.A[1] - C[1]) - R) < 0.3, seg: detail ? 6 : 3 })
  return { tuff, shade, trim, roof, win, clock }
}

/** A parapet round a ring: coping `w` wide at zTop, inner walls down to the roof at zRoof. */
export function parapet(coping: Part, roof: Part, ring0: XY[], zRoof: number, zTop: number, w: number) {
  const r = toCCW(simplify(ring0, 1.2)), q = offset(r, -w)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    fquad(coping, [r[i][0], r[i][1], zTop], [r[j][0], r[j][1], zTop], [q[j][0], q[j][1], zTop], [q[i][0], q[i][1], zTop], [0, 0, 1])
    const l = Math.hypot(q[j][0] - q[i][0], q[j][1] - q[i][1]) || 1
    fquad(coping, [q[j][0], q[j][1], zRoof], [q[i][0], q[i][1], zRoof], [q[i][0], q[i][1], zTop], [q[j][0], q[j][1], zTop], [-(q[j][1] - q[i][1]) / l, (q[j][0] - q[i][0]) / l, 0])
  }
  capRing(roof, q, zRoof)
}
/** A box standing on face f between s0..s1, z0..z1, from w0 (out) back to w1. */
export function blockOnFace(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, w0: number, w1 = Math.min(0, w0) - 0.3) {
  const A = (s: number, w: number, z: number) => onFace(f, s, w, z)
  const N: V3 = [f.n[0], f.n[1], 0], U: V3 = [f.u[0], f.u[1], 0]
  fquad(p, A(s0, w0, z0), A(s1, w0, z0), A(s1, w0, z1), A(s0, w0, z1), N)
  fquad(p, A(s0, w1, z1), A(s0, w0, z1), A(s1, w0, z1), A(s1, w1, z1), [0, 0, 1])
  fquad(p, A(s0, w1, z0), A(s1, w1, z0), A(s1, w0, z0), A(s0, w0, z0), [0, 0, -1])
  fquad(p, A(s1, w0, z0), A(s1, w1, z0), A(s1, w1, z1), A(s1, w0, z1), U)
  fquad(p, A(s0, w1, z0), A(s0, w0, z0), A(s0, w0, z1), A(s0, w1, z1), [-U[0], -U[1], 0])
}
/** A bold round boss (a carved rosette) on face f at (s, z): radius r, standing w proud. */
export function boss(p: Part, f: Face, s: number, z: number, r: number, w: number, n = 8) {
  const N: V3 = [f.n[0], f.n[1], 0]
  const ringAt = (rr: number, ww: number) => Array.from({ length: n }, (_, i) => { const t = (i * TAU) / n; return onFace(f, s + rr * Math.cos(t), ww, z + rr * Math.sin(t)) })
  const a = ringAt(r, 0), b = ringAt(r * 0.7, w), tip = onFace(f, s, w * 1.3, z)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    fquad(p, a[i], a[j], b[j], b[i], triN(a[i], a[j], b[j]))
    ftri(p, b[i], b[j], tip, triN(b[i], b[j], tip))
  }
  void N
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.tuff, material: { ...finish('yerevan-tuff-pink', 0xbd9488), floodlight: wallLight(0.85) } },
      { part: p.shade, material: { ...finish('tuff-shade', 0x7f5f5a) } },
      { part: p.trim, material: { ...finish('tuff-trim', 0xceaa9e), floodlight: wallLight(0.9) } },
      { part: p.roof, material: { ...finish('roof-salmon', 0x93625b) } },
      { part: p.win, material: PALETTE.window },
      { part: p.clock, material: { name: 'window-2', color: 0xf2ede2, roughness: 0.5 } },
    ]
  }
  const meta = { osm: 'way/31664493', height: Z.belvTop }
  await save("yerevan-government-house.glb", "Government House", make(false), meta, 6500, 250 * 1024)
  await save('yerevan-government-house.detail.glb', 'Government House', make(true), meta, 40000, 1536 * 1024)
}
