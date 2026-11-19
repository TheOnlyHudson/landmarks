/**
 * Tokyo International Forum (東京国際フォーラム), Marunouchi, Tokyo:
 * procedural, CC0-1.0, no textures. bun generators/tokyo-international-forum.ts
 *
 * Writes models/tokyo-international-forum.glb (low) and
 * models/tokyo-international-forum.detail.glb (detail, from zoom 16). The
 * small geometry kit below is a verbatim copy of the one in
 * generators/tokyo-station.ts; nothing is imported from it.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 14.98
 * (the hall building's walls): +y is compass 14.98. One placement for the
 * whole Forum: the hall building (OSM way/144508545) and the Glass Hall
 * (way/144508541) are separate OSM buildings across the plaza; both are
 * drawn, since the Glass Hall is what people know. Origin: the area-
 * weighted centroid of the two outlines (139.763830, 35.676803). y = 0 is
 * the ground; elevation 0. The plaza between is the map's.
 *
 * Rafael Viñoly, 1996. What makes it itself, and how each is drawn:
 * - the Glass Hall: the boat-shaped plan (OSM part 287732855, curved and
 *   pointed at both ends, smoothed with a spline), 60 m tall at
 *   mid-length with the roof edge sagging to 56.5 m at the ends (the sheer
 *   line in Bohao Zhao's photo), in
 *   translucent blue glass (`glass`, opacity 0.3, double-sided) carried by
 *   a white frame of mullions at every station and transoms every 15 m
 *   (7.5 m in the detail model);
 * - inside, seen through the glass: the ship-keel roof truss along the
 *   centre line (a straight top chord under the roof and a keel-shaped
 *   bottom chord sagging between the two giant tapering columns, with posts
 *   and diagonals) and ribs out to both walls at every station; lobby
 *   floors in the detail model;
 * - on the track side the band of pale grey ribbed panels (OSM outline,
 *   37 m) with a glazed
 *   strip under its top, and the granite blocks at both ends;
 * - across the plaza the hall building: four halls stepping along the plaza
 *   (OSM 47 m) and the lobby block along the street (OSM 61 m, drawn 55 m:
 *   in every photo the Glass Hall is the tallest thing there), in pale
 *   grey panels over a glazed ground floor, with broken glazed bands;
 * - the glass bridges crossing the plaza (three low, five detail).
 *
 * Evidence
 * - OSM (ODbL): way/144508545 (hall building, 36 m) and its parts
 *   way/287736170 (61 m), 287736171 (47 m), 287736172 and 287736174 (61 m);
 *   way/144508541 (ガラス棟, 37 m) and its part way/287732855 (60 m).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Tokyo-International-Forum Glass-Building Outside.jpg", MaedaAkihiko,
 *     CC BY-SA 4.0 (the glass wall and its frame, the granite end block);
 *   "Tokyo-International-Forum Square.jpg", MaedaAkihiko, CC BY-SA 4.0 (the
 *     plaza: the halls' panels, cantilevers and bridges);
 *   "東京国際フォーラム Tokyo International Forum - panoramio.jpg", Bohao
 *     Zhao, CC BY 3.0 (from the tracks: the granite band with its glazed
 *     strip and the keel truss and column through the glass; the truss's
 *     depth, ~14 m, is read from it);
 *   "東京駅（東京国際フォーラム）.JPG", DAMASA, CC BY-SA 3.0 (the prow).
 * Numbers
 * - Published: Glass Hall 60 m tall, 207 m long (Wikipedia).
 * - OSM: all plans and heights as listed.
 * - Estimated: the truss (columns at 20% and 80% of the length, keel 10-15 m
 *   deep, ribs), the granite band's glazed strip (30-35.5 m), the granite
 *   blocks' heights (40 m north, 30 m south), the halls' glazed ground
 *   floor (9 m) and bands, the bridges' levels (26-44 m) and positions.
 * Colours: glass #7fc4de translucent (STYLE.md's clear blue), steel
 *   #f4f6f6, panels #d6d9da, the band's pale grey ribbed panels #d0d2d3
 *   (a rib at every station; the end blocks share the material).
 * Doubts
 * - OSM's 61 m for the lobby block is not followed (55 m drawn); the
 *   halls' 47 m is. The halls' real
 *   stepped and cantilevered profiles are simplified to boxes.
 * - The truss is drawn as a simple keel truss; the real one's ribs form
 *   arches and are lighter and more numerous.
 * - Terrain: `tools/terrain.ts check` passes.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ---------------------------------------------------------------------------
// A small kit shared by the tokyo-* models of this builder (tokyo-station,
// tokyo-national-diet-building, tokyo-kabukiza, tokyo-wako,
// tokyo-international-forum). Map frame: x east, y north, z up, metres.
// `frame()` sets a 2D placement (offset and turn about z) that every helper
// applies, so a wing can be drawn in its own axes.
// ---------------------------------------------------------------------------
export type XY = [number, number]
type PartLike = Part
let F = { ox: 0, oy: 0, c: 1, s: 0 }
/** Draw what follows turned by `deg` (counter-clockwise, map frame) and moved to (ox, oy). */
export function frame(ox = 0, oy = 0, deg = 0) {
  const a = (deg * Math.PI) / 180
  F = { ox, oy, c: Math.cos(a), s: Math.sin(a) }
}
const T = (p: V3): V3 => [F.ox + p[0] * F.c - p[1] * F.s, F.oy + p[0] * F.s + p[1] * F.c, p[2]]
const TN = (n: V3): V3 => [n[0] * F.c - n[1] * F.s, n[0] * F.s + n[1] * F.c, n[2]]
const area3 = (a: V3, b: V3, c: V3) => Math.hypot(...cross(sub(b, a), sub(c, a)))
/** A triangle in the current frame; degenerate ones are dropped. */
export function tri(p: PartLike, a: V3, b: V3, c: V3, n?: V3[]) {
  if (area3(a, b, c) < 1e-7) return
  p.tri(T(a), T(b), T(c), undefined, undefined, undefined, n && n.map(TN))
}
export function quad(p: PartLike, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}
const signedArea = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Ear-clipping triangulation of a simple polygon (indices, CCW output). */
export function earcut(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i)
  if (signedArea(ring) < 0) idx.reverse()
  const out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { idx.splice(0, 1) }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A flat horizontal cap over a simple polygon at z. */
export function capPoly(p: PartLike, ring: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(ring)) {
    const A: V3 = [...ring[a], z], B: V3 = [...ring[b], z], C: V3 = [...ring[c], z]
    up ? tri(p, A, B, C) : tri(p, A, C, B)
  }
}
/** Vertical walls round a polygon (any winding) from z0 to z1, with optional caps. */
export function prism(p: PartLike, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const r = signedArea(ring) < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) capPoly(p, r, z1, true)
  if (bottom) capPoly(p, r, z0, false)
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export function box(p: PartLike, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  prism(p, rect(x0, y0, x1, y1), z0, z1, true, bottom)
}
/** A box with its vertical edges chamfered by c (the soft bevel STYLE.md asks for). */
export function cbox(p: PartLike, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.4) {
  c = Math.min(c, (x1 - x0) / 3, (y1 - y0) / 3)
  prism(p, [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]], z0, z1)
}
/** A regular polygon ring (n sides) of circumradius r about (cx, cy); `phase` in radians. */
export const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)] as XY)
/** Loft through horizontal rings of equal length (CCW from above); caps the top if `top`. */
export function loftRings(p: PartLike, rings: { r: XY[]; z: number }[], top = true) {
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], n = A.r.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quad(p, [...A.r[i], A.z], [...A.r[j], A.z], [...B.r[j], B.z], [...B.r[i], B.z])
    }
  }
  const L = rings[rings.length - 1]
  if (top && Math.abs(signedArea(L.r)) > 1e-4) capPoly(p, L.r, L.z, true)
}
/** A rectangle ring inset by (ix, iy). */
export const rectIn = (x0: number, y0: number, x1: number, y1: number, ix: number, iy = ix): XY[] => rect(x0 + ix, y0 + iy, x1 - ix, y1 - iy)
/** A hipped roof over a rectangle: eaves at z0, ridge at z0 + h, hips inset by `hip` at the ends. */
export function hipRoof(p: PartLike, x0: number, y0: number, x1: number, y1: number, z0: number, h: number, hipX?: number) {
  const w = x1 - x0, d = y1 - y0
  if (w >= d) {
    const hx = Math.min(hipX ?? d / 2, w / 2), ym = (y0 + y1) / 2
    loftRings(p, [{ r: rect(x0, y0, x1, y1), z: z0 }, { r: [[x0 + hx, ym], [x1 - hx, ym], [x1 - hx, ym], [x0 + hx, ym]], z: z0 + h }], false)
  } else {
    const hy = Math.min(hipX ?? w / 2, d / 2), xm = (x0 + x1) / 2
    loftRings(p, [{ r: rect(x0, y0, x1, y1), z: z0 }, { r: [[xm, y0 + hy], [xm, y0 + hy], [xm, y1 - hy], [xm, y1 - hy]], z: z0 + h }], false)
  }
}
/**
 * A surface of revolution about (cx, cy) from a profile of [r, z] (bottom to
 * top), n segments, smooth-shaded where neighbouring bands turn less than
 * `smooth` degrees. r = 0 at the ends closes it.
 */
export function lathe(p: PartLike, cx: number, cy: number, profile: [number, number][], n: number, phase = 0, smooth = 50, flatSides = false) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const lim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], o = bandN[b + (end ? 1 : -1)]
    if (!o || own[0] * o[0] + own[1] * o[1] < lim) return own
    const s = [own[0] + o[0], own[1] + o[1]], l = Math.hypot(s[0], s[1]) || 1
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    const n0 = vn(b, 0), n1 = vn(b, 1)
    for (let i = 0; i < n; i++) {
      const a0 = phase + (i * 2 * Math.PI) / n, a1 = phase + ((i + 1) * 2 * Math.PI) / n
      const am = (a0 + a1) / 2
      const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const N = (nn: [number, number], a: number): V3 => {
        const aa = flatSides ? am : a
        return [nn[0] * Math.cos(aa), nn[0] * Math.sin(aa), nn[1]]
      }
      quad(p, P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1), [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)])
    }
  }
}
/** A rectangular bar from a to b, w wide and h deep (h along `up` where possible). */
export function beam(p: PartLike, a: V3, b: V3, w: number, h = w, up: V3 = [0, 0, 1]) {
  const d = sub(b, a), L = Math.hypot(...d)
  if (L < 1e-6) return
  const dn: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let s = cross(dn, up)
  if (Math.hypot(...s) < 1e-3) s = cross(dn, [1, 0, 0])
  const sl = Math.hypot(...s); s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const u = cross(s, dn)
  const C = (o: V3, i: number): V3 => {
    const k = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + s[0] * k[0] * w / 2 + u[0] * k[1] * h / 2, o[1] + s[1] * k[0] * w / 2 + u[1] * k[1] * h / 2, o[2] + s[2] * k[0] * w / 2 + u[2] * k[1] * h / 2]
  }
  const A = [0, 1, 2, 3].map((i) => C(a, i)), B = [0, 1, 2, 3].map((i) => C(b, i))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(p, A[i], A[j], B[j], B[i])
  }
  quad(p, A[3], A[2], A[1], A[0])
  quad(p, B[0], B[1], B[2], B[3])
}
/**
 * A flat panel on a vertical wall running from a to b (the wall's outside is
 * to the right of a→b, as on a counter-clockwise ring), raised `off` off it.
 */
export function wallPanel(p: PartLike, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
  quad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}
/** A block standing proud of a wall a→b (outside to the right), from depth d0 to d1 off it. */
export function wallBlock(p: PartLike, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, top = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const Q = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
  prism(p, [Q(s0, d0), Q(s0, d1), Q(s1, d1), Q(s1, d0)], z0, z1, top, true)
}
/** A round-headed panel (semicircular head) on a wall, `seg` segments in the head. */
export function archPanel(p: PartLike, a: XY, b: XY, s0: number, s1: number, z0: number, zSpring: number, off = 0.05, seg = 6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
  quad(p, P(s0, z0), P(s1, z0), P(s1, zSpring), P(s0, zSpring))
  const r = (s1 - s0) / 2, sc = (s0 + s1) / 2
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    tri(p, P(sc, zSpring), P(sc + r * Math.cos(t0), zSpring + r * Math.sin(t0)), P(sc + r * Math.cos(t1), zSpring + r * Math.sin(t1)))
  }
}
export type Parts = Array<{ part: Part; material: MaterialSpec }>
export async function save(file: string, name: string, parts: Parts, maxTris: number, maxBytes: number, extras: Record<string, unknown>) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Tokyo International Forum
// ---------------------------------------------------------------------------
const BEARING = 14.98

/** Catmull-Rom through control points, `per` samples per span. */
function spline(pts: XY[], per: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

function build(hi: boolean) {
  const glass = new Part(), frameP = new Part(), panel = new Part(), granite = new Part(), win = new Part(), win2 = new Part()
  frame()
  const LOBBY = 55 // the lobby block: OSM says 61; drawn below the Glass Hall, as every photo shows it
  const H = 60 // the Glass Hall (OSM part 287732855; published 60 m)
  // ---- the Glass Hall: a curved, boat-shaped plan (OSM), pointed at both ends
  const west = spline([[7.6, -109.8], [9.2, -87.4], [11.2, -59.3], [22.4, -14.8], [32.4, 13.9], [46.8, 45.0], [61.7, 70.3], [70.5, 82.9], [74.6, 89.5]], hi ? 4 : 2)
  const east = spline([[7.6, -109.8], [22.0, -86.0], [36.4, -62.2], [53.9, -23.4], [68.3, 27.3], [72.8, 51.9], [74.9, 81.6], [74.6, 89.5]], hi ? 5 : 3)
  // resample both sides to the same count so ribs can join them
  const resample = (line: XY[], n: number): XY[] => {
    const d = [0]
    for (let i = 1; i < line.length; i++) d.push(d[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]))
    const L = d[d.length - 1]
    return Array.from({ length: n + 1 }, (_, k) => {
      const s = (L * k) / n
      let i = 1
      while (i < d.length - 1 && d[i] < s) i++
      const t = (s - d[i - 1]) / (d[i] - d[i - 1] || 1)
      return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t] as XY
    })
  }
  const N = hi ? 28 : 14
  const W = resample(west, N), E = resample(east, N)
  // the plan ring: west side south→north, east side north→south (CCW? check below)
  const ring: XY[] = [...E, ...[...W].reverse().slice(1, -1)]
  // the roof edge sags gently towards the two ends, so the boat's sheer
  // line shows against the sky (60 m at mid-length, published height)
  const hz = (i: number) => H - 3.5 * Math.pow((2 * i) / N - 1, 2)
  // translucent glass walls and roof
  const hOf: number[] = [...E.map((_, i) => hz(i)), ...[...W].map((_, i) => hz(i)).reverse().slice(1, -1)]
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length], ha = hOf[k], hb = hOf[(k + 1) % ring.length]
    quad(glass, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], hb], [a[0], a[1], ha])
  }
  for (let i = 0; i < N; i++) quad(glass, [W[i][0], W[i][1], hz(i)], [E[i][0], E[i][1], hz(i)], [E[i + 1][0], E[i + 1][1], hz(i + 1)], [W[i + 1][0], W[i + 1][1], hz(i + 1)])
  // the frame that carries the outline: top and bottom rails, mullions at
  // every station and transoms every 15 m (thin white members)
  const rails = hi ? [0.4, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, H - 0.4] : [0.4, 15, 30, 45, H - 0.4]
  for (const side of [W, E]) {
    for (let i = 0; i < side.length - 1; i++) {
      const a = side[i], b = side[i + 1]
      for (const z of rails) {
        const za = Math.min(z, hz(i) - 0.4), zb = Math.min(z, hz(i + 1) - 0.4)
        beam(frameP, [a[0], a[1], z === rails[rails.length - 1] ? hz(i) - 0.4 : za], [b[0], b[1], z === rails[rails.length - 1] ? hz(i + 1) - 0.4 : zb], 0.45, 0.6)
      }
    }
    for (let i = 1; i < side.length - 1; i++) beam(frameP, [side[i][0], side[i][1], 0], [side[i][0], side[i][1], hz(i)], 0.45, 0.45)
  }
  // ---- the ship-keel roof truss inside, on two giant columns -----------
  // a spine along the hall's centre line: a straight top chord under the
  // roof, a bottom chord that sags like a keel between the two columns,
  // with posts and diagonals, and ribs out to the walls at every station
  const C = W.map((w, i) => [(w[0] + E[i][0]) / 2, (w[1] + E[i][1]) / 2] as XY)
  const i0 = Math.round(N * 0.2), i1 = Math.round(N * 0.8)
  const keel = (i: number) => keel0(i) - (H - hz(i))
  const keel0 = (i: number) => {
    if (i <= i0 || i >= i1) {
      const t = i <= i0 ? i / i0 : (N - i) / (N - i1)
      return H - 1.5 - 8.5 * Math.sin((Math.PI / 2) * Math.max(0, t))
    }
    const t = (i - i0) / (i1 - i0)
    return H - 10 - 5 * Math.sin(Math.PI * t)
  }
  for (let i = 1; i < N; i++) {
    const a = C[i], b = C[i + 1]
    if (i < N - 1) {
      beam(frameP, [a[0], a[1], hz(i) - 1.2], [b[0], b[1], hz(i + 1) - 1.2], 1.2, 1.2)
      beam(frameP, [a[0], a[1], keel(i)], [b[0], b[1], keel(i + 1)], 1.8, 1.6)
      beam(frameP, [a[0], a[1], keel(i)], [b[0], b[1], hz(i + 1) - 1.2], 0.8, 0.8)
    }
    beam(frameP, [a[0], a[1], keel(i)], [a[0], a[1], hz(i) - 1.2], 0.9, 0.9)
    // ribs to the walls, arched a little under the roof
    for (const s of [W[i], E[i]]) {
      const m: V3 = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2, hz(i) - 4.5]
      beam(frameP, [a[0], a[1], keel(i) + 2], m, 0.8, 0.8)
      beam(frameP, m, [s[0], s[1], hz(i) - 0.8], 0.8, 0.8)
    }
  }
  // the two columns, tapering up to the keel
  for (const i of [i0, i1]) lathe(frameP, C[i][0], C[i][1], [[1.2, 0], [1.5, 6], [1.0, keel(i) - 2], [1.6, keel(i)], [0, keel(i) + 0.01]], hi ? 12 : 8)
  // floors of the ramps inside (the lobby levels): a few slabs along the walls
  if (hi) for (const z of [12, 24, 36]) for (let i = 2; i < N - 2; i += 3) {
    const a = E[i], b = E[i + 2], c = C[i + 2], d = C[i]
    const q = (p: XY, r: XY, f: number): V3 => [p[0] + (r[0] - p[0]) * f, p[1] + (r[1] - p[1]) * f, z]
    quad(frameP, q(a, d, 0.05), q(b, c, 0.05), q(b, c, 0.35), q(a, d, 0.35))
    quad(frameP, q(a, d, 0.35), q(b, c, 0.35), q(b, c, 0.05), q(a, d, 0.05))
  }

  // ---- the east band along the tracks (OSM outline, 37 m) and the granite
  // service block at the north end
  {
    const outer = spline([[84.0, 100.8], [85.6, 93.6], [86.7, 81.4], [84.7, 57.3], [81.1, 29.5], [76.2, 12.1], [68.8, -12.3], [57.3, -43.6], [48.3, -63.3], [32.6, -88.5], [20.0, -108.7], [12.5, -119.2]], hi ? 2 : 1)
    // drawn as a ring of quads between the two curves, walls on the outside
    const out2 = resample([[12.5, -119.2], ...[...outer].reverse()], N)
    for (let i = 0; i < N; i++) {
      const a = out2[i], b = out2[i + 1], c = E[i + 1], d = E[i]
      // roof of the band at 37 m
      quad(granite, [a[0], a[1], 37], [b[0], b[1], 37], [c[0], c[1], 37], [d[0], d[1], 37])
      quad(granite, [a[0], a[1], 37], [d[0], d[1], 37], [c[0], c[1], 37], [b[0], b[1], 37])
      // the outer glazed wall
      const n = cross(sub([b[0], b[1], 0], [a[0], a[1], 0]), [0, 0, 1])
      const out = (n[0] * (a[0] - C[i][0]) + n[1] * (a[1] - C[i][1])) > 0
      const [p, q] = out ? [a, b] : [b, a]
      quad(granite, [p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], 30], [p[0], p[1], 30])
      quad(win2, [p[0], p[1], 30], [q[0], q[1], 30], [q[0], q[1], 35.5], [p[0], p[1], 35.5])
      quad(granite, [p[0], p[1], 35.5], [q[0], q[1], 35.5], [q[0], q[1], 37], [p[0], p[1], 37])
      if (hi) for (const z of [6, 12, 18, 24]) beam(granite, [p[0], p[1], z], [q[0], q[1], z], 0.15, 0.15)
      // the panels' vertical ribs
      beam(granite, [p[0], p[1], 0], [p[0], p[1], 37], 0.35, 0.35)
    }
    // the granite block at the north end (photo: ~40 m)
    prism(granite, [[73.7, 89.5], [86.7, 85.5], [86.0, 100.8], [73.7, 101.0]], 0, 40)
    // and a granite stair block at the south tip
    prism(granite, [[6.0, -121], [14.5, -121], [14.5, -110], [6.0, -110]], 0, 30)
  }

  // ---- the hall buildings on the west (OSM way/144508545) ---------------
  // four halls stepping along the plaza (OSM part 287736171, 47 m) and the
  // lobby block along the street (part 287736170, 61 m), all clad in pale
  // grey panels, cantilevering over a glazed ground floor on the plaza side
  const halls: [number, number, number, number][] = [
    [-33.5, 29.0, 26.6, 94.2],
    [-33.8, -26.0, 8.3, 20.9],
    [-34.2, -72.8, -2.4, -35.0],
    [-34.0, -109.9, -10.1, -81.2],
  ]
  for (const [x0, y0, x1, y1] of halls) {
    box(win, x0, y0 + 1.5, x1 - 4, y1 - 1.5, 0, 9)
    cbox(panel, x0, y0, x1, y1, 9, 47, 0.4)
    // the panels' joints at a few levels and glazed bands (two per hall)
    for (const z of [19, 33]) for (let s = 2; s < y1 - y0 - 4; s += 9.5) {
      wallPanel(win, [x1, y0], [x1, y1], s, Math.min(s + 7.5, y1 - y0 - 2), z, z + 2.2, 0.06)
    }
    if (hi) for (const z of [14, 24, 28, 38, 42]) box(panel, x1 - 0.05, y0, x1 + 0.12, y1, z - 0.12, z + 0.12)
    // the end faces facing the gaps
    for (const z of [19, 33]) {
      wallPanel(win, [x0, y0], [x1, y0], 2, x1 - x0 - 2, z, z + 2.2, 0.06)
      wallPanel(win, [x1, y1], [x0, y1], 2, x1 - x0 - 2, z, z + 2.2, 0.06)
    }
  }
  // the gaps between halls: lower glazed links
  for (const [y0, y1, x1] of [[20.9, 29.0, -5.3], [-35.0, -26.0, -15.7], [-81.2, -72.8, -23.2]] as [number, number, number][]) box(win, -39.5, y0, x1, y1, 0, 14)
  // the lobby block along the street
  cbox(panel, -57.9, -110.1, -33.5, 96.2, 9, LOBBY, 0.4)
  box(panel, -57.9, 96.2, -48.8, 100.3, 9, LOBBY)
  box(panel, -57.9, -119.5, -47.8, -110.1, 9, LOBBY)
  box(panel, -48.8, 96.2, -36.0, 100.3, 9, 47)
  box(panel, -47.8, -119.5, -18.5, -110.0, 9, 47)
  box(win, -47.3, -119.0, -19.0, -110.0, 0, 9)
  box(win, -57.4, -119.0, -34.0, 99.8, 0, 9)
  for (const z of [16, 26, 36, 46]) for (let s = 3; s < 214; s += 12.2) wallPanel(win, [-57.9, 100.3], [-57.9, -119.5], s, s + 9.6, z, z + 2.4, 0.06)
  for (const z of [16, 26, 36, 46]) for (const [a, b] of [[[-57.9, -119.5], [-33.5, -119.5]], [[-33.5, 100.3], [-57.9, 100.3]]] as [XY, XY][]) wallPanel(win, a, b, 2, 22.4, z, z + 2.4, 0.06)

  // ---- glass bridges across the plaza from the halls to the Glass Hall ---
  const bridges: [number, number][] = hi ? [[60, 34], [5, 26], [-48, 30], [60, 44], [-12, 40]] : [[60, 34], [5, 26], [-48, 30]]
  for (const [y, z] of bridges) {
    // from the hall's east face to the glass wall at the same y
    const hx = y > 29 ? 26.6 : y > -26 ? 8.3 : y > -72.8 ? -2.4 : -10.1
    let k = 0
    while (k < N && W[k + 1][1] < y) k++
    const t = (y - W[k][1]) / (W[k + 1][1] - W[k][1] || 1)
    const gx = W[k][0] + (W[k + 1][0] - W[k][0]) * t
    box(glass, hx, y - 1.6, gx, y + 1.6, z, z + 3.2, true)
    beam(frameP, [hx, y - 1.6, z], [gx, y - 1.6, z], 0.35, 0.35)
    beam(frameP, [hx, y + 1.6, z], [gx, y + 1.6, z], 0.35, 0.35)
    beam(frameP, [hx, y - 1.6, z + 3.2], [gx, y - 1.6, z + 3.2], 0.35, 0.35)
    beam(frameP, [hx, y + 1.6, z + 3.2], [gx, y + 1.6, z + 3.2], 0.35, 0.35)
  }

  // Colours from daylight photos (MaedaAkihiko, DAMASA): blue-tinted clear
  // glass, white steel, pale grey panel cladding, grey granite.
  return [
    { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.24, opacity: 0.3, doubleSided: true } },
    { part: frameP, material: { ...PALETTE.trim, name: 'forum-steel', color: 0xf4f6f6 } },
    { part: panel, material: finish('forum-panel', 0xd6d9da) },
    { part: granite, material: finish('forum-granite', 0xd0d2d3) },
    { part: win, material: PALETTE.window },
    { part: win2, material: windowVariant(2, 0xa9bfd1) },
  ] as Parts
}

if (process.env.COUNT) for (const h of [false, true]) console.log(h, build(h).map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
if (import.meta.main && !process.env.COUNT) {
  const extras = { bearing: BEARING, elevation: 0, height: 60 }
  await save('tokyo-international-forum.glb', 'Tokyo International Forum', build(false), 6500, 250_000, extras)
  await save('tokyo-international-forum.detail.glb', 'Tokyo International Forum', build(true), 40_000, 1536 * 1024, extras)
}
