/**
 * National Diet Building (国会議事堂), Nagatachō, Tokyo: procedural,
 * CC0-1.0, no textures. bun generators/tokyo-national-diet-building.ts
 *
 * Writes models/tokyo-national-diet-building.glb (low) and
 * models/tokyo-national-diet-building.detail.glb (detail, from zoom 16).
 * The small geometry kit below is a verbatim copy of the one in
 * generators/tokyo-station.ts; nothing is imported from it.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 347.23
 * (OSM's long faces): +y is compass 347.23, +x compass 77.23, so the main
 * front faces model +x (east-north-east). Origin: the area centroid of the
 * OSM multipolygon relation/3361370 (139.744864, 35.675893); the building
 * is symmetric about y = 0, the tower's centre is x = 19.2. y = 0 is the
 * ground; elevation 0.
 *
 * Completed 1936. What makes it itself, and how each is drawn:
 * - the central tower: a granite shaft with a deep loggia on every face (six
 *   real piers in front of a recessed wall with tall dark windows), the
 *   roundel frieze stage (discs in the detail model), the attic with its
 *   openings, the stepped pyramid in courses (warmer, pinkish stone) and
 *   the small lantern; urns on the central block's corners;
 * - the front portico: four round 18 m columns between square end piers,
 *   under a full entablature, with the doors and windows recessed behind,
 *   the steps, and the relief panel over it;
 * - the two symmetric wings with the chambers: granite ranges with a
 *   rusticated (greyer) base storey, string course and cornice, grouped
 *   window panels (two storeys each) and arched base windows, the corner
 *   towers (OSM 27 m), the chambers rising to 25 m under their long glass
 *   skylight roofs, the four courts left open;
 * - each house's porte-cochère on the front: a flat slab on square piers.
 *
 * Evidence
 * - OSM (ODbL): relation/3361370 (building, wikidata Q1338856) and its parts
 *   relation/4657354-4657366 and way/331852164 (tower base, 47 m),
 *   way/331852176 (tower top, 63 m, pyramidal roof 14 m), way/331852178.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "National Diet Building.jpg", Kakidai, CC BY-SA 4.0 (front, east);
 *   "National Diet Building 02.jpg", Kakidai, CC BY-SA 4.0 (front);
 *   "National Diet Building 03.jpg", Kakidai, CC BY-SA 4.0 (front, distant:
 *     tower proportions);
 *   "Diet of Japan Kokkai 2009.jpg", Wiiii, CC BY-SA 3.0 (front; colours);
 *   "National Diet Building of Japan from the side.jpg", zoonabar,
 *     CC BY-SA 3.0 (north-east: the tower's side, a porte-cochère, a corner
 *     tower).
 * - No lidar or NAIP in Japan.
 * Numbers
 * - Published: tower 65.45 m; 206.36 m by 88.63 m (Wikipedia).
 * - OSM: the plan and the parts' heights: ranges 21 m, chambers 25 m with
 *   skylights (OSM 29 m, drawn 27.5 m in dark glass grey #6f7a82, as they
 *   are hidden from the street and should not shout from above),
 *   corner towers 27 m, central block 28 m, cross ranges 24 m.
 * - Estimated from "National Diet Building 03.jpg" (distant, scaled on the
 *   65.45 m tip, 8.7 px/m), stage by stage: shouldered base 28-30.6 m
 *   (30.6 m wide, urns on its corners), base wall to 33 m, loggia
 *   33-41.5 m, inscription band to 43.5 m, roundel frieze stage (the widest,
 *   26 m) to 46.6 m, attic (22.4 m) to 51.6 m, stepped pyramid 51.6-60.6 m
 *   (foot 19.6 m, 12 courses low / 22 detail), lantern to 65.45 m. The
 *   shaft is OSM's 22.8 m square, which the distant photo confirms. The
 *   portico's columns 18.4 m; porte-cochères 12.6 m (OSM 8 m reads too low
 *   against the side photo).
 * Colours (daylight photos, pulled to the palette): granite #ece4d8, base
 *   #dcd8d0, pyramid #e2cdbf, windows a dark green-grey #5c6c66.
 * Doubts
 * - The rear (west) faces and the courts are seen in no photo used; they
 *   repeat the front's storeys.
 * - Night: the building is floodlit; the whole granite takes `floodlight`.
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
// National Diet Building
// ---------------------------------------------------------------------------
const BEARING = 347.23
const TX = 19.2 // the tower's centre line (OSM tower parts); the building is symmetric about y = 0
const BODY = 21 // cornice of the ranges (OSM 4657358)

function build(hi: boolean) {
  const stone = new Part(), base = new Part(), pyr = new Part(), win = new Part(), glass = new Part(), dark = new Part()
  frame()
  const SEG = hi ? 12 : 8

  /** A granite block with a rusticated base storey, a string course and a bevelled cornice. */
  const block = (x0: number, y0: number, x1: number, y1: number, top: number, baseTop = 6.2) => {
    box(base, x0, y0, x1, y1, 0, baseTop)
    box(stone, x0, y0, x1, y1, baseTop, top - 0.9)
    if (hi) cbox(stone, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, top - 0.9, top, 0.3)
    else box(stone, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, top - 0.9, top)
    box(stone, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, baseTop, baseTop + 0.5)
  }
  /** Windows on a wall a→b (outside on the right): arched in the base, grouped panels above. */
  const windows = (a: XY, b: XY, at: number[], top = BODY) => {
    for (const s of at) {
      archPanel(win, a, b, s - 0.8, s + 0.8, 1.6, 4.4, 0.05, hi ? 6 : 3)
      wallPanel(win, a, b, s - 0.85, s + 0.85, 7.6, 10.6, 0.05)
      if (top > 16) wallPanel(win, a, b, s - 0.85, s + 0.85, 12.4, Math.min(15.6, top - 3.2), 0.05)
      if (hi) {
        wallBlock(stone, a, b, s - 1.1, s + 1.1, 7.2, 7.6, 0, 0.2)
        wallBlock(stone, a, b, s - 1.1, s + 1.1, 12.0, 12.4, 0, 0.2)
      }
    }
  }
  const spaced = (s0: number, s1: number, step: number) => {
    const n = Math.max(1, Math.round((s1 - s0) / step)), d = (s1 - s0) / n
    return Array.from({ length: n }, (_, i) => s0 + d * (i + 0.5))
  }
  /** Pilasters between bays on a wall a→b, above the base. */
  const pilasters = (a: XY, b: XY, s0: number, s1: number, n: number, top = BODY) => {
    if (!hi) return
    for (let i = 0; i <= n; i++) {
      const s = s0 + ((s1 - s0) * i) / n
      wallBlock(stone, a, b, s - 0.45, s + 0.45, 6.7, top - 0.9, 0, 0.25, false)
    }
  }

  // Both halves are mirror images about y = 0; draw each with m = ±1.
  for (const m of [1, -1]) {
    const Y = (y: number) => m * y
    const R = (x0: number, y0: number, x1: number, y1: number, top: number, bt?: number) =>
      block(x0, Math.min(Y(y0), Y(y1)), x1, Math.max(Y(y0), Y(y1)), top, bt)
    // the end block round the chamber: three ranges and the end range
    R(-35.1, 48.6, 30.3, 61.4, BODY)
    R(-35.1, 61.4, -22.3, 97.7, BODY)
    R(18.0, 61.4, 30.3, 97.7, BODY)
    R(-22.3, 90.6, 18.0, 97.7, BODY)
    R(-27.1, 97.7, 21.2, 103.7, BODY)
    // the west (rear) and east (front) bumps on the end block
    R(-44.3, 62.2, -35.1, 89.3, BODY)
    R(30.3, 61.6, 38.3, 89.7, BODY)
    // the ranges round the big court, and the cross range
    R(-35.1, 17.6, -22.2, 48.6, BODY)
    R(17.1, 22.6, 30.3, 48.6, BODY)
    R(-25.9, 11.0, 37.9, 22.6, 24)
    // corner towers (OSM 27 m), two at each end
    for (const x0 of [-35.5, 21.2]) R(x0, 89.3, x0 + 8.5, 97.7, 27)
    // the chamber: a hall rising to 25 m with its long glass skylight roof
    R(-22.3, 61.4, 18.0, 90.6, 25, 6.2)
    {
      const y0 = Math.min(Y(69.5), Y(83)), y1 = Math.max(Y(69.5), Y(83))
      loftRings(glass, [{ r: rect(-16.5, y0, 11.5, y1), z: 25 }, { r: [[-16.5, (y0 + y1) / 2], [11.5, (y0 + y1) / 2], [11.5, (y0 + y1) / 2], [-16.5, (y0 + y1) / 2]], z: 27.5 }], false)
      tri(glass, [-16.5, y1, 25], [-16.5, (y0 + y1) / 2, 27.5], [-16.5, y0, 25])
      tri(glass, [11.5, y0, 25], [11.5, (y0 + y1) / 2, 27.5], [11.5, y1, 25])
    }
    // the house's porte-cochère on the front: square piers under a flat roof
    {
      const y0 = Math.min(Y(64.9), Y(85.6)), y1 = Math.max(Y(64.9), Y(85.6)), H = 12.6
      cbox(stone, 38.1, y0, 46.6, y1, H - 2.6, H, 0.3)
      const piersY = [0, 1, 2, 3, 4].map((i) => y0 + 0.8 + ((y1 - y0 - 1.6) * i) / 4)
      for (const y of piersY) cbox(stone, 45.0, y - 0.8, 46.6, y + 0.8, 0, H - 2.6, 0.2)
      for (const x of [39.0, 42.2]) for (const y of [y0 + 0.8, y1 - 0.8]) cbox(stone, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 0, H - 2.6, 0.2)
    }
    // the rear centre: the stepped blocks behind the central hall
    R(-43.1, 0, -25.9, 17.5, 22)
    R(-31.3, 11.1, -25.9, 17.6, 26)
  }
  // the centre between the small courts
  block(-25.9, -11.0, -20.5, 11.0, 23)
  block(-20.5, -3.5, 3.9, 3.8, 23)
  // south half of the rear-centre blocks is drawn by the m = -1 pass; the
  // cross ranges' inner faces already close the small courts.

  // ---- Windows on the long faces ----------------------------------------
  // front (east) faces of the end blocks and the links; rear faces; ends
  for (const m of [1, -1]) {
    const W = (y0: number, y1: number, x: number, front: boolean) => {
      const [a, b]: [XY, XY] = front ? [[x, m > 0 ? 22.6 : -97.7], [x, m > 0 ? 97.7 : -22.6]] : [[x, m > 0 ? 97.7 : -22.6], [x, m > 0 ? 22.6 : -97.7]]
      const L = 75.1
      const ys = spaced(y0, y1, 4.6).map((y) => m * y)
      const at = ys.map((y) => (front ? y - a[1] : a[1] - y)).filter((s) => s > 0.8 && s < L - 0.8)
      windows(a, b, at)
    }
    W(22.6, 61.4, 30.3, true)
    W(89.7, 97.7, 30.3, true)
    W(22.6, 62.2, -35.1, false)
    W(89.3, 97.7, -35.1, false)
    if (hi) {
      const a: XY = [30.3, m > 0 ? 22.6 : -97.7], b: XY = [30.3, m > 0 ? 97.7 : -22.6]
      pilasters(a, b, m > 0 ? 0 : 75.1 - 38.8, m > 0 ? 38.8 : 75.1, 8)
    }
    // the end faces
    const ea: XY = m > 0 ? [21.2, 103.7] : [-27.1, -103.7], eb: XY = m > 0 ? [-27.1, 103.7] : [21.2, -103.7]
    windows(ea, eb, spaced(2, 46.3, 4.6))
    // the bumps' faces
    const fa: XY = m > 0 ? [38.3, 61.6] : [38.3, -89.7], fb: XY = m > 0 ? [38.3, 89.7] : [38.3, -61.6]
    windows(fa, fb, [2.5, 25.6])
    const ra: XY = m > 0 ? [-44.3, 89.3] : [-44.3, -62.2], rb: XY = m > 0 ? [-44.3, 62.2] : [-44.3, -89.3]
    windows(ra, rb, spaced(1.5, 25.6, 4.6))
  }

  // ---- The central block, the portico and the tower ---------------------
  block(3.9, -15.7, 34.8, 15.7, 28)
  // relief panel over the portico, and the side bays' windows
  wallBlock(stone, [34.8, -15.7], [34.8, 15.7], 8.5, 22.9, 22.0, 24.6, 0, 0.3)
  for (const s of [2.6, 28.8]) {
    wallPanel(win, [34.8, -15.7], [34.8, 15.7], s - 0.8, s + 0.8, 8.0, 15.0, 0.05)
    wallPanel(win, [34.8, -15.7], [34.8, 15.7], s - 0.6, s + 0.6, 17.5, 19.5, 0.05)
  }
  // the front portico: four round columns between square end piers, 18 m
  // tall, under a full entablature, with the recessed doors behind
  {
    const X0 = 37.4, X1 = 53.2, YH = 13.0, ZC = 18.4, TOP = 22.0
    cbox(stone, X0, -YH, X1, YH, ZC, TOP, 0.35)
    for (const y of [-YH, YH - 3.0]) cbox(stone, X1 - 3.2, y, X1, y + 3.0, 0, ZC, 0.25)
    for (const sy of [-YH, YH - 1.2]) box(stone, X0, sy, X1 - 3.2, sy + 1.2, 0, ZC)
    for (const y of [-5.4, -1.8, 1.8, 5.4]) {
      lathe(stone, X1 - 1.6, y, [[1.05, 0.6], [0.92, 1.0], [0.85, ZC - 1.0], [1.05, ZC - 0.3], [1.15, ZC]], SEG)
      cbox(stone, X1 - 2.85, y - 1.25, X1 - 0.35, y + 1.25, 0, 0.6, 0.2)
    }
    // the back wall of the portico, doors and the windows above them
    box(stone, 34.6, -YH, X0, YH, 0, ZC)
    for (const y of [-5.4, -1.8, 1.8, 5.4]) {
      wallPanel(dark, [X0, y - 1.3], [X0, y + 1.3], 0, 2.6, 0.6, 7.2, 0.05)
      wallPanel(win, [X0, y - 1.3], [X0, y + 1.3], 0.5, 2.1, 9.5, 15.5, 0.05)
    }
    // the steps up to it
    for (let k = 0; k < (hi ? 6 : 3); k++) {
      const d = (k + 1) * (hi ? 0.9 : 1.8)
      box(base, X1, -YH + 1.5, X1 + 6.0 - d + 0.6, YH - 1.5, k * (hi ? 0.18 : 0.36), (k + 1) * (hi ? 0.18 : 0.36))
    }
  }

  // The tower, all granite, in the stages of the Kakidai photos (scaled on
  // the 65.45 m tip): a wide shouldered base with urns at its corners, the
  // shaft (OSM's 22.8 m square) with a deep loggia of six piers on every
  // face, an inscription band, the widest stage with its roundel frieze, the
  // attic with its openings, the tall stepped pyramid in courses, and the
  // lantern.
  {
    const S0 = 28, S1 = 30.6, SH = 15.3 // shoulders
    const half = 11.4, B1 = 33.0, L1 = 41.5, IB = 43.5 // shaft: base wall, loggia, inscription band
    const h2 = 13.0, F1 = 46.6 // roundel frieze stage
    const h3 = 11.2, A1 = 51.6 // attic
    const pr0 = 9.8, pr1 = 2.3, PZ1 = 60.6 // pyramid
    cbox(stone, TX - SH, -SH, TX + SH, SH, S0, S1, 0.3)
    for (const sx of [-1, 1]) for (const sy of [-1, 1])
      lathe(stone, TX + sx * 13.6, sy * 13.6, [[0.9, S1], [0.9, S1 + 0.8], [0.6, S1 + 1.1], [1.1, S1 + 2.0], [1.15, S1 + 3.0], [0.8, S1 + 3.6], [0.3, S1 + 4.0], [0, S1 + 4.0]], hi ? 10 : 6)
    const LO = 6.6, DEP = 2.4
    box(stone, TX - half, -half, TX + half, half, S1, B1)
    box(stone, TX - half, -half, TX + half, half, L1, IB)
    cbox(stone, TX - half - 0.4, -half - 0.4, TX + half + 0.4, half + 0.4, IB - 0.6, IB, 0.2)
    for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]) {
      const x0 = cx < 0 ? TX - half : TX + LO, x1 = cx < 0 ? TX - LO : TX + half
      const y0 = cy < 0 ? -half : LO, y1 = cy < 0 ? -LO : half
      box(stone, x0, y0, x1, y1, B1, L1)
    }
    box(stone, TX - half + DEP, -half + DEP, TX + half - DEP, half - DEP, B1, L1)
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2, c = Math.cos(ang), s = Math.sin(ang)
      const P = (u: number, v: number): XY => [TX + c * u - s * v, c * v + s * u]
      const a = P(half - DEP, -LO), b = P(half - DEP, LO)
      for (let i = 0; i < 6; i++) {
        const v = -LO + ((i + 0.5) * 2 * LO) / 6, w = (2 * LO) / 6
        wallPanel(win, a, b, v + LO - w * 0.32, v + LO + w * 0.32, B1 + 0.6, L1 - 1.0, 0.04)
      }
      for (let i = 1; i < 6; i++) {
        const v = -LO + (i * 2 * LO) / 6, pw = 0.95
        prism(stone, [P(half - 1.15, v - pw / 2), P(half - 0.05, v - pw / 2), P(half - 0.05, v + pw / 2), P(half - 1.15, v + pw / 2)], B1, L1, false)
      }
      const L0 = P(half, -LO), Lb = P(half, LO), B0 = P(half - DEP, -LO), Bb = P(half - DEP, LO)
      quad(stone, [L0[0], L0[1], L1], [B0[0], B0[1], L1], [Bb[0], Bb[1], L1], [Lb[0], Lb[1], L1])
    }
    // the roundel frieze stage, its cornice and the attic
    box(stone, TX - h2, -h2, TX + h2, h2, IB, F1)
    cbox(stone, TX - h2 - 0.3, -h2 - 0.3, TX + h2 + 0.3, h2 + 0.3, F1, F1 + 0.6, 0.2)
    box(stone, TX - h3, -h3, TX + h3, h3, F1 + 0.6, A1)
    cbox(stone, TX - h3 - 0.3, -h3 - 0.3, TX + h3 + 0.3, h3 + 0.3, A1 - 0.4, A1, 0.2)
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2, c = Math.cos(ang), s = Math.sin(ang)
      const P = (u: number, v: number): XY => [TX + c * u - s * v, c * v + s * u]
      const a2 = P(h3, -h3), b2 = P(h3, h3)
      for (let i = 0; i < 6; i++) {
        const v = -h3 + 2.4 + (i * (2 * h3 - 4.8)) / 5
        wallPanel(dark, a2, b2, v + h3 - 0.5, v + h3 + 0.5, F1 + 1.4, A1 - 1.2, 0.05)
      }
      const a1 = P(h2, -h2), b1 = P(h2, h2)
      const n = hi ? 11 : 7, zr = (IB + F1) / 2 + 0.3
      for (let i = 0; i < n; i++) {
        const v = -h2 + 1.6 + (i * (2 * h2 - 3.2)) / (n - 1)
        if (hi) {
          const ctr: XY = [a1[0] + (b1[0] - a1[0]) * ((v + h2) / (2 * h2)), a1[1] + (b1[1] - a1[1]) * ((v + h2) / (2 * h2))]
          const nn: V3 = [c, s, 0], uu: V3 = [-s, c, 0], K = 8
          for (let k = 0; k < K; k++) {
            const t0 = (k * 2 * Math.PI) / K, t1 = ((k + 1) * 2 * Math.PI) / K
            const Q = (t: number, d: number): V3 => [ctr[0] + nn[0] * d + uu[0] * 0.7 * Math.cos(t), ctr[1] + nn[1] * d + uu[1] * 0.7 * Math.cos(t), zr + 0.7 * Math.sin(t)]
            tri(stone, [ctr[0] + nn[0] * 0.25, ctr[1] + nn[1] * 0.25, zr], Q(t0, 0.2), Q(t1, 0.2))
          }
        } else wallBlock(stone, a1, b1, v + h2 - 0.65, v + h2 + 0.65, zr - 0.65, zr + 0.65, 0, 0.18)
      }
    }
    // the stepped pyramid: courses, each a riser and a sloping tread
    const steps = hi ? 22 : 12
    for (let k = 0; k < steps; k++) {
      const t0 = k / steps, t1 = (k + 1) / steps
      const r = pr0 + (pr1 - pr0) * t0, rn = pr0 + (pr1 - pr0) * t1
      const z0 = A1 + (PZ1 - A1) * t0, z1 = A1 + (PZ1 - A1) * t1
      loftRings(pyr, [{ r: rect(TX - r, -r, TX + r, r), z: z0 }, { r: rect(TX - r, -r, TX + r, r), z: z0 + (z1 - z0) * 0.6 }, { r: rect(TX - rn, -rn, TX + rn, rn), z: z1 }], false)
    }
    // the lantern: a box with slits, a cornice and a small stepped cap
    box(stone, TX - pr1, -pr1, TX + pr1, pr1, PZ1, 63.6)
    cbox(stone, TX - pr1 - 0.25, -pr1 - 0.25, TX + pr1 + 0.25, pr1 + 0.25, 63.6, 64.1, 0.1)
    loftRings(stone, [{ r: rect(TX - pr1, -pr1, TX + pr1, pr1), z: 64.1 }, { r: rect(TX - 0.9, -0.9, TX + 0.9, 0.9), z: 65.45 }])
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2, c = Math.cos(ang), s = Math.sin(ang)
      const P = (u: number, v: number): XY => [TX + c * u - s * v, c * v + s * u]
      for (const v of [-1.1, 0, 1.1]) wallPanel(dark, P(pr1, -pr1), P(pr1, pr1), v + pr1 - 0.25, v + pr1 + 0.25, 61.4, 63.1, 0.04)
    }
  }

  // Colours from daylight photos (Kakidai, Wiiii): pale grey-beige granite,
  // the base storey a little greyer, the pyramid's warmer pinkish stone.
  // Night: the whole front and the tower are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[2] > 27 ? 1 : 0.8)
  return [
    { part: stone, material: { ...finish('diet-granite', 0xece4d8), floodlight: lit } },
    { part: base, material: { ...finish('diet-granite-base', 0xdcd8d0), floodlight: lit } },
    { part: pyr, material: { ...finish('diet-pyramid', 0xe2cdbf), floodlight: lit } },
    { part: win, material: windowVariant(2, 0x5c6c66) },
    { part: dark, material: finish('diet-openings', 0x4f5652) },
    { part: glass, material: { ...PALETTE.glass, color: 0x6f7a82 } },
  ] as Parts
}

if (process.env.COUNT) for (const h of [false, true]) console.log(h, build(h).map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
if (import.meta.main && !process.env.COUNT) {
  const extras = { bearing: BEARING, elevation: 0, height: 65.45 }
  await save('tokyo-national-diet-building.glb', 'National Diet Building', build(false), 6500, 250_000, extras)
  await save('tokyo-national-diet-building.detail.glb', 'National Diet Building', build(true), 40_000, 1536 * 1024, extras)
}
