/**
 * Wako (和光本館, the Seiko House Ginza), Ginza 4-chome crossing, Tokyo:
 * procedural, CC0-1.0, no textures. bun generators/tokyo-wako.ts
 *
 * Writes models/tokyo-wako.glb (low) and models/tokyo-wako.detail.glb
 * (detail). The small geometry kit below is a verbatim copy of the one in
 * generators/tokyo-station.ts; nothing is imported from it.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 356.85
 * (the bisector of the two street faces, which run at 41.8 and 311.9
 * degrees): the curved corner faces model -y (compass 176.85, the
 * crossing). Origin: the area centroid of OSM way/103509469 (139.765023,
 * 35.671644). y = 0 is the ground; elevation 0.
 *
 * Watanabe Jin, 1932, neo-renaissance in granite. What makes it itself, and
 * how each is drawn:
 * - the curved corner front, drawn as an arc of radius 14.9 m (fitted to
 *   OSM's curve) tangent to both street faces, with the rusticated ground
 *   storey, the balcony band, four storeys of windows grouped two storeys a
 *   panel between piers, the big cornice, the attic with arched windows on
 *   the curve (square ones on the sides) and the raised crown over the
 *   curve;
 * - the clock tower (OSM parts, 5.9 m square): corner piers, the clock on
 *   every face (a pale disc, `neon-wako-clock`, lit at night) in a stone
 *   ring, the arched opening with its iron grille under it, the cornice, a
 *   small lantern and the copper spire.
 *
 * Evidence
 * - OSM (ODbL): way/103509469 (building, 28 m, 7 levels), relation/18401376
 *   (Seiko House Ginza part), way/1341775164 (clock tower 28-38 m),
 *   way/1341815191 (tower podium 28-30 m), way/1341815951 (finial 38-40 m).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Wako Ginza.jpg", Wiiii, CC BY-SA 3.0 (front, square on: scaled at
 *     45 px/m from the 28 m roof);
 *   "Ginza Wako 20241021.jpg", Supanut Arunoprayote, CC BY 4.0 (front from
 *     the south-west; colours);
 *   "Headquarters of Wako at Ginza 4-Chome Crossroads.JPG", Soramimi,
 *     CC BY-SA 4.0;
 *   "Ginza-WAKO at night.jpg", Kakidai, CC BY-SA 4.0 (night: floodlit, the
 *     clock lit).
 * Numbers
 * - OSM: 28 m roof, tower 28-38 m, finial to 40 m.
 * - Estimated from the Wiiii photo: ground storey to 6.9 m, balcony band
 *   7.6 m, cornice 21.1-22 m, attic 22-26.6 m, crown 28.9 m, tower podium to
 *   30 m. The tower in the tower's own proportions (height 1.29 times its
 *   5.9 m width to the cornice, clock about half the face): body 30-37.6 m,
 *   cornice to 38.5 m, cap to 39 m, lantern to 40.6 m (OSM's finial part
 *   ends at 40 m), spire to 43.4 m; clock 3.0 m across at 34.6 m; grille
 *   under it 30.2-32.9 m. A ground-level photo foreshortens the tower, so
 *   the photo-scaled heights read low; these follow OSM and the tower's own
 *   proportions.
 * Colours (daylight photos, pulled to the palette): granite #e3dacb (warm
 *   light grey-beige), windows #5d676d (dark), the ground floor's shop glass
 *   dark #4c5558 by day (named `entrance`, so it glows only at night), clock
 *   #d7e6ec, spire copper #9a6a4e. Piers stand 0.35 m proud between the
 *   bays, in both models.
 * Doubts
 * - The brief mentions a small copper-green roof on the tower; every photo
 *   used shows a flat stone cap with a small stone lantern under a copper
 *   spire, so that is what is drawn.
 * - The back faces are seen in no photo used; they repeat the storeys
 *   without the shop windows.
 * - The cornice overhangs a neighbour (way/449618283, 3% of it) by 0.8 m.
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
// Wako (和光本館)
// ---------------------------------------------------------------------------
const BEARING = 356.85
const AC: XY = [1.7, -1.7], AR = 14.9 // the curved corner: centre and radius
const TC: XY = [2.05, -12.8], TH = 2.95 // the clock tower: centre, half-width (OSM part)

function build(hi: boolean) {
  const stone = new Part(), win = new Part(), shop = new Part(), iron = new Part(), clock = new Part(), copper = new Part()
  frame()
  const NA = hi ? 16 : 8
  // the plan: the curved front (tangent to both street faces), the two
  // street faces and the back corner (OSM way/103509469)
  const plan = (grow: number): XY[] => {
    const pts: XY[] = []
    for (let i = 0; i <= NA; i++) {
      const a = (-135 + (90 * i) / NA) * (Math.PI / 180)
      pts.push([AC[0] + (AR + grow) * Math.cos(a), AC[1] + (AR + grow) * Math.sin(a)])
    }
    const back: XY[] = [[21.7, -2.3], [-1.5, 20.8], [-21.5, 0.7]]
    const c: XY = [0.4, 3.0]
    return [...pts, ...back.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy); return [x + (dx / l) * grow * 1.41, y + (dy / l) * grow * 1.41] as XY })]
  }
  const P0 = plan(0)
  // the street faces: the arc segments and the two straight faces
  const faces: [XY, XY][] = []
  for (let i = 0; i < NA; i++) faces.push([P0[i], P0[i + 1]])
  faces.push([P0[NA], P0[NA + 1]])
  faces.push([P0[NA + 3], P0[0]])
  void faces

  // ---- the body: a rusticated ground storey, four storeys, the cornice,
  // the attic with its arched windows, and the parapet (OSM 28 m)
  prism(stone, plan(0), 0, 21.1)
  prism(stone, plan(0.25), 0, 1.0, false)
  prism(stone, plan(0.3), 6.9, 7.6)
  prism(stone, plan(0.8), 21.1, 22.0)
  prism(stone, plan(-0.5), 22.0, 26.6)
  prism(stone, plan(-0.1), 26.6, 27.3)
  prism(stone, plan(-0.3), 27.3, 28.0)
  // the raised crown over the curved front, and the tower's podium (OSM 28-30 m)
  {
    const ring: XY[] = []
    for (let i = 0; i <= 8; i++) { const a = (-122 + (64 * i) / 8) * (Math.PI / 180); ring.push([AC[0] + (AR - 0.4) * Math.cos(a), AC[1] + (AR - 0.4) * Math.sin(a)]) }
    ring.push([AC[0] + 5, -6.5], [AC[0] - 5, -6.5])
    prism(stone, ring, 26.6, 28.9)
    const pod: XY[] = []
    for (let i = 0; i <= 6; i++) { const a = (-110 + (40 * i) / 6) * (Math.PI / 180); pod.push([AC[0] + (AR - 1.6) * Math.cos(a), AC[1] + (AR - 1.6) * Math.sin(a)]) }
    pod.push([5.7, -7.4], [-1.8, -7.4])
    prism(stone, pod, 28.9, 30.0)
  }

  // ---- windows, bay by bay along the faces --------------------------------
  const bay = (a: XY, b: XY, s: number, w: number, curved: boolean) => {
    // floors 2-3 and 4-5 grouped, piers between bays, the attic window
    wallPanel(win, a, b, s - w / 2, s + w / 2, 8.2, 13.9, 0.05)
    wallPanel(win, a, b, s - w / 2, s + w / 2, 14.7, 20.2, 0.05)
    if (curved) archPanel(win, a, b, s - w * 0.42, s + w * 0.42, 23.0, 25.3 - w * 0.42, -0.45, hi ? 6 : 3)
    else wallPanel(win, a, b, s - w * 0.35, s + w * 0.35, 23.4, 25.0, -0.45)
    // the ground storey: shop windows with iron balconettes above
    wallPanel(shop, a, b, s - w * 0.62, s + w * 0.62, 1.2, 5.9, 0.05)
    if (hi) {
      wallBlock(iron, a, b, s - w * 0.62, s + w * 0.62, 8.2, 9.0, 0.05, 0.4)
      wallBlock(stone, a, b, s - w / 2 - 0.25, s + w / 2 + 0.25, 13.9, 14.7, 0, 0.12)
    }
  }
  // the curved front: one bay per arc segment (fewer in the low model)
  const arcBays = hi ? 2 : 1
  for (let i = 0; i < NA; i += arcBays) {
    const a = P0[i], b = P0[i + arcBays], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (arcBays === 1) bay(a, b, L / 2, Math.min(L * 0.55, 1.9), true)
    else { const m = P0[i + 1], L1 = Math.hypot(m[0] - a[0], m[1] - a[1]); bay(a, m, L1, 1.7, true) }
  }
  // the straight street faces and the back faces: bays of 3.2 m
  const straight: [XY, XY][] = [[P0[NA], P0[NA + 1]], [P0[NA + 3], P0[0]], [P0[NA + 1], P0[NA + 2]], [P0[NA + 2], P0[NA + 3]]]
  straight.forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 3.2)
    for (let i = 0; i < n; i++) {
      const s = (L * (i + 0.5)) / n
      if (k < 2) bay(a, b, s, 1.7, false)
      else {
        wallPanel(win, a, b, s - 0.8, s + 0.8, 8.2, 13.9, 0.05)
        wallPanel(win, a, b, s - 0.8, s + 0.8, 14.7, 20.2, 0.05)
      }
    }
    // piers between bays on the street faces (detail)
    if (k < 2) for (let i = 1; i < n; i++) wallBlock(stone, a, b, (L * i) / n - 0.35, (L * i) / n + 0.35, 7.6, 21.1, 0, 0.35, false)
  })
  for (let i = hi ? 2 : 1; i < NA; i += hi ? 2 : 1) {
    // piers on the curve, standing at each joint between segments
    const a = (-135 + (90 * i) / NA) * (Math.PI / 180)
    const c: XY = [AC[0] + (AR + 0.1) * Math.cos(a), AC[1] + (AR + 0.1) * Math.sin(a)]
    const t: XY = [-Math.sin(a), Math.cos(a)], n: XY = [Math.cos(a), Math.sin(a)]
    prism(stone, [[c[0] - t[0] * 0.3, c[1] - t[1] * 0.3], [c[0] + t[0] * 0.3, c[1] + t[1] * 0.3], [c[0] + t[0] * 0.3 + n[0] * 0.35, c[1] + t[1] * 0.3 + n[1] * 0.35], [c[0] - t[0] * 0.3 + n[0] * 0.35, c[1] - t[1] * 0.3 + n[1] * 0.35]], 7.6, 21.1, true)
  }

  // ---- the clock tower ---------------------------------------------------
  {
    const [cx, cy] = TC, h = TH
    box(stone, cx - h, cy - h, cx + h, cy + h, 30.0, 37.6, true)
    // corner piers standing proud, the top cornice and the attic block
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x0 = sx > 0 ? cx + h - 0.85 : cx - h - 0.15, x1 = sx > 0 ? cx + h + 0.15 : cx - h + 0.85
      const y0 = sy > 0 ? cy + h - 0.85 : cy - h - 0.15, y1 = sy > 0 ? cy + h + 0.15 : cy - h + 0.85
      cbox(stone, x0, y0, x1, y1, 30.0, 37.6, 0.12)
    }
    cbox(stone, cx - h - 0.45, cy - h - 0.45, cx + h + 0.45, cy + h + 0.45, 37.6, 38.5, 0.2)
    box(stone, cx - h + 0.2, cy - h + 0.2, cx + h - 0.2, cy + h - 0.2, 38.5, 39.0)
    // the small lantern (OSM finial part, to 40 m) and the copper spire
    cbox(stone, cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75, 39.0, 39.9, 0.15)
    lathe(stone, cx, cy, [[0.85, 39.9], [0.6, 40.3], [0.25, 40.6]], hi ? 8 : 6)
    lathe(copper, cx, cy, [[0.25, 40.6], [0.14, 41.0], [0.1, 43.4], [0, 43.4]], 6)
    // each face: the clock (pale, lit at night) in its arched frame, and
    // the iron grille below it
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2 - Math.PI / 2, c = Math.cos(ang), s = Math.sin(ang)
      const P = (u: number, v: number): XY => [cx + c * u - s * v, cy + s * u + c * v]
      const a = P(h, -h), b = P(h, h)
      // clock face: a disc 2.45 m across, centre at 32.8 m, a little proud
      const K = hi ? 20 : 12, R = 1.5, zc = 34.6
      const ctr: XY = P(h + 0.12, 0)
      const ux = -s, uy = c // along the face
      for (let k = 0; k < K; k++) {
        const t0 = (k * 2 * Math.PI) / K, t1 = ((k + 1) * 2 * Math.PI) / K
        const Q = (t: number, r: number): V3 => [ctr[0] + ux * r * Math.cos(t), ctr[1] + uy * r * Math.cos(t), zc + r * Math.sin(t)]
        const C: V3 = [ctr[0], ctr[1], zc]
        // wound to face outward (+c, +s)
        const o = cross(sub(Q(t0, R), C), sub(Q(t1, R), C))
        if (o[0] * c + o[1] * s > 0) tri(clock, C, Q(t0, R), Q(t1, R)); else tri(clock, C, Q(t1, R), Q(t0, R))
        // the stone ring round it
        const A1 = Q(t0, R), B1 = Q(t1, R), A2 = Q(t0, R + 0.28), B2 = Q(t1, R + 0.28)
        const o2 = cross(sub(B1, A1), sub(A2, A1))
        if (o2[0] * c + o2[1] * s > 0) quad(stone, A1, B1, B2, A2); else quad(stone, A1, A2, B2, B1)
      }
      // the arched opening with its iron grille, under the clock
      archPanel(iron, a, b, h - 1.15, h + 1.15, 30.2, 31.9, 0.04, hi ? 6 : 3)
      if (hi) for (const d of [-0.58, 0, 0.58]) wallBlock(stone, a, b, h + d - 0.07, h + d + 0.07, 30.2, 32.9, 0, 0.1)
    }
  }

  // Colours from daylight photos (Wiiii, Arunopras): pale grey granite,
  // dark window glass with pale blinds, the clock's pale blue-white face.
  // Night: the facade and tower are floodlit and the clock glows.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[2] > 26 ? 1 : 0.85)
  return [
    { part: stone, material: { ...finish('wako-granite', 0xe3dacb), floodlight: lit } },
    { part: win, material: windowVariant(2, 0x5d676d) },
    { part: shop, material: { ...PALETTE.entrance, color: 0x4c5558 } },
    { part: iron, material: finish('wako-iron', 0x55595a) },
    { part: clock, material: finish('neon-wako-clock', 0xd7e6ec) },
    { part: copper, material: finish('wako-copper-spire', 0x9a6a4e) },
  ] as Parts
}

if (process.env.COUNT) for (const h of [false, true]) console.log(h, build(h).map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
if (import.meta.main && !process.env.COUNT) {
  const extras = { bearing: BEARING, elevation: 0, height: 43.4 }
  await save('tokyo-wako.glb', 'Wako', build(false), 5000, 250_000, extras)
  await save('tokyo-wako.detail.glb', 'Wako', build(true), 40_000, 1536 * 1024, extras)
}
