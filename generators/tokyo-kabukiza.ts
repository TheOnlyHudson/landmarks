/**
 * Kabuki-za (歌舞伎座) and Kabukiza Tower, Higashi-Ginza, Tokyo: procedural,
 * CC0-1.0, no textures. bun generators/tokyo-kabukiza.ts
 *
 * Writes models/tokyo-kabukiza.glb (low) and models/tokyo-kabukiza.detail.glb
 * (detail, from zoom 16). The small geometry kit below is a verbatim copy of
 * the one in generators/tokyo-station.ts; nothing is imported from it.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 47.3
 * (OSM's walls run at 47.3 and 137.3 degrees): +y is compass 47.3, so the
 * front on Harumi-dori faces model -y (compass 227). Origin: the area
 * centroid of OSM relation/4859313 (139.768033, 35.669649). y = 0 is the
 * ground; elevation 0.
 *
 * The fifth Kabuki-za (Kengo Kuma, 2013), rebuilding the 1951 front. What
 * makes it itself, and how each is drawn:
 * - two front pavilions under irimoya (hip-and-gable) roofs in mid-grey
 *   tile: two eave tiers (the lower edge, a tiled step and the upper tier's
 *   fascia) turning up at the corners, a white soffit, and a short skirt
 *   under a gable roof that spans nearly the full eaves, its large white
 *   tympanum facing the street with a gold crest and gold edging, thick
 *   tiled rakes over white bargeboards, a ridge with onigawara (the hanging
 *   gegyo, in gold, in the detail model);
 * - the centre bay under a lower hipped roof, its red lantern gallery under
 *   the eaves (rails and lanterns share `neon-kabukiza-red`, so the lanterns
 *   glow at night; the rails glow with them, a compromise forced by the
 *   six-material limit, the sixth being the gold);
 * - the karahafu over the entrance: an undulating curved gable, humped in
 *   the middle and flared at the ends, with a tiled roll along its edge, a
 *   deep white board and white gable face, a gold crest, on two posts over
 *   the red lantern beam and lantern row, and the doors;
 * - white walls with round columns at the pavilions' corners, red-railed
 *   balconies on the first floor (front and sides), the pent roof along the
 *   ground floor;
 * - Kabukiza Tower behind: a white slab with light glass between white fins
 *   in three-storey groups (detail), the glass corner on the north-west
 *   (OSM 4859316) treated the same way.
 *
 * Evidence
 * - OSM (ODbL): relation/4859313 (theatre outline, with an inner ring over
 *   the auditorium that the model roofs over), relation/4859314 (tower,
 *   141 m), relation/4859316 (tower glass corner, 141 m), relation/4859315
 *   (the side wing on the south-east, 16 m, gabled), way/662901403
 *   (歌舞伎座タワー outline).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "2019 Kabuki-za.jpg", Kakidai, CC BY-SA 4.0 (front elevation, scaled at
 *     27 px/m from people at the entrance and the OSM entrance recess);
 *   "Kabukiza Tower 2019-04.jpg", Svetlov Artem, CC0 (front-right corner:
 *     the pavilion's side, eaves and brackets, the tower's fins);
 *   "Kabuki-Za 20221216.jpg", 先従隗始, CC0 (front from the west);
 *   "Kabuki-za Theatre 2013 1125.jpg", Tak1701d, public domain (front).
 * - No lidar or NAIP in Japan.
 * Numbers
 * - Published: Kabukiza Tower 145 m, 29 floors (Wikipedia); OSM 141 m is
 *   taken as the roof and the crown drawn to 145 m.
 * - Estimated from the Kakidai elevation: pavilion walls 18.6 m, eaves
 *   ~18.6-19 m, gable foot 21.6 m, ridge 25.6 m, onigawara to ~27 m;
 *   centre roof 18-20.7 m; lantern gallery 14.3-16.3 m; karahafu ends 9 m,
 *   crown 12 m, 14 m wide; pent roof 5.4 m; windows 6.9-9.4 and 12.0-14.2 m;
 *   balconies at 10.3-12 m; pavilion fronts 13.1 m wide inside the OSM
 *   front (x -19.7..26), the centre 19.4 m; eaves overhang 4.6 m (1.3 m on
 *   the north-west). The photo shows the left eaves reaching ~7 m past the
 *   wall, over the lot where OSM maps a 39 m part (way/342493229) 1.4 m
 *   away. That part may be misdrawn, but the map draws it, and a longer
 *   eave would cut through it; so the north-west eaves stop at 1.3 m, clear
 *   of it and of 銀座石川ビル (way/342493239, 10 m).
 * - Estimated: the theatre's roof at 18.3 m (the rooftop garden behind the
 *   pavilions, drawn bare); the low podium behind the tower at 14 m (no
 *   photo); the side wing's walls 12 m under OSM's 16 m ridge.
 * Colours (daylight photos, pulled to the palette): white #f3efe6, tile
 *   mid-grey #868c93, vermilion #c4473b, gold #cfae5a, facade windows
 *   #515c64, tower glass a pale #d3dce2 in narrow strips between white fins.
 * Doubts
 * - Fine gold carving and the purple curtains are left out.
 * - The rear and the north-west side are seen in no photo used.
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
// Kabuki-za and Kabukiza Tower
// ---------------------------------------------------------------------------
const BEARING = 47.3
const YF = -47.5 // the front wall on Harumi-dori
const CX = 3.2 // the front's axis (centre of the entrance)

function build(hi: boolean) {
  const wall = new Part(), tile = new Part(), red = new Part(), gold = new Part(), win = new Part(), glassT = new Part()
  const lantern = red
  frame()
  const SEG = hi ? 10 : 6

  /**
   * An irimoya (hip-and-gable) roof with its ridge along y and the gables
   * facing ±y: a concave hipped skirt whose eaves turn up at the corners,
   * under a gable roof with a white tympanum at each end. (x0..x1, y0..y1)
   * is the wall top; `o` the eaves' overhang.
   */
  const irimoya = (x0: number, y0: number, x1: number, y1: number, ze: number, zb: number, zr: number, o: number, upturn = 0.9, oxl = o) => {
    const ex0 = x0 - oxl, ex1 = x1 + o, ey0 = y0 - o, ey1 = y1 + o
    const bi = 2.2 // inset of the skirt's top: the gable roof spans nearly the full eaves (photo)
    const K = hi ? 5 : 3, sub = hi ? 4 : 2
    // a ring with `sub` points per side, inset t, its corners raised by r
    const ring = (t: number, z: number, r: number) => {
      const a0 = ex0 + t, a1 = ex1 - t, b0 = ey0 + t, b1 = ey1 - t
      const pts: { r: XY[]; z: number } = { r: [], z }
      const out: V3[] = []
      const side = (p: XY, q: XY) => {
        for (let k = 0; k < sub; k++) {
          const f = k / sub
          const x = p[0] + (q[0] - p[0]) * f, y = p[1] + (q[1] - p[1]) * f
          const lift = r * Math.pow(Math.abs(2 * f - 1), 2.2)
          out.push([x, y, z + lift])
        }
      }
      side([a0, b0], [a1, b0]); side([a1, b0], [a1, b1]); side([a1, b1], [a0, b1]); side([a0, b1], [a0, b0])
      void pts
      return out
    }
    // two eave tiers: the lower tier's edge, a short tiled step, the upper
    // tier's fascia, then the concave skirt up to the gable's foot
    const T1 = 1.1
    const rings: V3[][] = [ring(0, ze, upturn), ring(T1, ze + 0.15, upturn * 0.85), ring(T1, ze + 0.75, upturn * 0.85)]
    for (let k = 1; k <= K; k++) {
      const t = k / K
      rings.push(ring(T1 + (bi - T1) * t, ze + 0.75 + (zb - ze - 0.75) * Math.pow(t, 1.7), upturn * 0.85 * (1 - t) * (1 - t)))
    }
    void K
    for (let k = 0; k < K; k++) {
      const A = rings[k], B = rings[k + 1], n = A.length
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; quad(tile, A[i], A[j], B[j], B[i]) }
    }
    // the eave edge (a fascia) and the white soffit under the overhang
    const E = rings[0], n = E.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quad(tile, [E[i][0], E[i][1], E[i][2] - 0.45], [E[j][0], E[j][1], E[j][2] - 0.45], E[j], E[i])
    }
    const W = ring(0, ze - 0.45, 0).map(([x, y, z]) => [Math.min(Math.max(x, x0), x1), Math.min(Math.max(y, y0), y1), z] as V3)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quad(wall, [E[i][0], E[i][1], E[i][2] - 0.45], [W[i][0], W[i][1], W[i][2]], [W[j][0], W[j][1], W[j][2]], [E[j][0], E[j][1], E[j][2] - 0.45])
    }
    // the gable roof above the skirt, slightly concave, ridge along y
    const gx0 = ex0 + bi, gx1 = ex1 - bi, gy0 = ey0 + bi - 0.6, gy1 = ey1 - bi + 0.6, xm = (gx0 + gx1) / 2
    const G = hi ? 4 : 2
    const prof = Array.from({ length: G + 1 }, (_, k) => { const t = k / G; return [gx0 - 0.5 + (xm - gx0 + 0.5) * t, zb - 0.25 + (zr - zb + 0.25) * Math.pow(t, 1.35)] })
    for (let k = 0; k < G; k++) {
      const [xa, za] = prof[k], [xb, zb2] = prof[k + 1]
      quad(tile, [xb, gy0, zb2], [xb, gy1, zb2], [xa, gy1, za], [xa, gy0, za])
      const xa2 = 2 * xm - xa, xb2 = 2 * xm - xb
      quad(tile, [xb2, gy1, zb2], [xb2, gy0, zb2], [xa2, gy0, za], [xa2, gy1, za])
      // undersides of the gable roof's overhang at the ends (white)
    }
    // tympana (white) set 0.8 m in, with a dark ridge on top
    for (const [y, s] of [[gy0 + 0.8, -1], [gy1 - 0.8, 1]] as [number, number][]) {
      const pts: V3[] = [[gx0 + 0.2, y, zb], [xm, y, zr - 0.2], [gx1 - 0.2, y, zb]]
      s < 0 ? tri(wall, pts[2], pts[1], pts[0]) : tri(wall, pts[0], pts[1], pts[2])
      // the gable's thick rake ends: a grey tiled edge over a white bargeboard
      for (const [p, q] of [[[gx0 - 0.6, y + s * 0.65, zb - 0.1], [xm, y + s * 0.65, zr + 0.35]], [[xm, y + s * 0.65, zr + 0.35], [gx1 + 0.6, y + s * 0.65, zb - 0.1]]] as [V3, V3][]) {
        beam(tile, [p[0], p[1], p[2] + 0.35], [q[0], q[1], q[2] + 0.35], 0.6, 0.8, [s, 0, 0] as V3)
        beam(wall, [p[0], p[1] - s * 0.05, p[2] - 0.45], [q[0], q[1] - s * 0.05, q[2] - 0.45], 0.4, 0.75, [s, 0, 0] as V3)
      }
      // the gold crest in the gable and gold edging along the rakes
      const zc = zb + (zr - zb) * 0.42
      box(gold, xm - 1.1, y + s * 0.05 - 0.15, xm + 1.1, y + s * 0.05 + 0.15, zc - 0.7, zc + 0.7)
      for (const [p, q] of [[[gx0 + 0.6, y + s * 0.1, zb + 0.15], [xm, y + s * 0.1, zr - 0.55]], [[xm, y + s * 0.1, zr - 0.55], [gx1 - 0.6, y + s * 0.1, zb + 0.15]]] as [V3, V3][]) beam(gold, p, q, 0.22, 0.3, [s, 0, 0] as V3)
      if (hi) {
        // white bargeboards along the rakes and the gold-less hanging fish (gegyo) as a block
        for (const [p, q] of [[[gx0 - 0.3, y + s * 0.7, zb - 0.3], [xm, y + s * 0.7, zr + 0.05]], [[xm, y + s * 0.7, zr + 0.05], [gx1 + 0.3, y + s * 0.7, zb - 0.3]]] as [V3, V3][])
          beam(wall, p, q, 0.35, 0.7, [s, 0, 0] as V3)
        box(gold, xm - 0.5, y + s * 0.3 - 0.25, xm + 0.5, y + s * 0.3 + 0.25, zr - 2.6, zr - 0.6)
      }
    }
    beam(tile, [xm, gy0 - 0.3, zr + 0.25], [xm, gy1 + 0.3, zr + 0.25], 0.7, 0.9)
    // onigawara at the ridge ends, standing up and curling back
    for (const y of [gy0 - 0.3, gy1 + 0.3]) {
      box(tile, xm - 0.55, y - 0.35, xm + 0.55, y + 0.35, zr, zr + 1.6)
      if (hi) for (const d of [-1, 1]) beam(tile, [xm, y, zr + 1.4], [xm, y - d * 0.9 * Math.sign(y - (gy0 + gy1) / 2) * -1, zr + 2.2], 0.45, 0.45)
    }
  }

  /** A plain hipped roof with concave slopes and upturned corners (ridge along the longer side). */
  const hipC = (x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, o: number, upturn = 0.6) => {
    const ex0 = x0 - o, ex1 = x1 + o, ey0 = y0 - o, ey1 = y1 + o
    const K = hi ? 4 : 3, sub = hi ? 4 : 2
    const hw = Math.min(ex1 - ex0, ey1 - ey0) / 2
    const rings: V3[][] = []
    for (let k = 0; k <= K; k++) {
      const t = k / K, ins = hw * t * 0.999, z = ze + (zr - ze) * Math.pow(t, 1.6), r = upturn * (1 - t) * (1 - t)
      const a0 = ex0 + ins, a1 = ex1 - ins, b0 = ey0 + ins, b1 = ey1 - ins
      const out: V3[] = []
      const side = (p: XY, q: XY) => { for (let i = 0; i < sub; i++) { const f = i / sub; out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, z + r * Math.pow(Math.abs(2 * f - 1), 2.2)]) } }
      side([a0, b0], [a1, b0]); side([a1, b0], [a1, b1]); side([a1, b1], [a0, b1]); side([a0, b1], [a0, b0])
      rings.push(out)
    }
    for (let k = 0; k < K; k++) { const A = rings[k], B = rings[k + 1]; for (let i = 0; i < A.length; i++) { const j = (i + 1) % A.length; quad(tile, A[i], A[j], B[j], B[i]) } }
    const E = rings[0], n = E.length
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; quad(tile, [E[i][0], E[i][1], E[i][2] - 0.35], [E[j][0], E[j][1], E[j][2] - 0.35], E[j], E[i]) }
    const top = rings[K]
    if (ey1 - ey0 > ex1 - ex0) beam(tile, [(ex0 + ex1) / 2, top[0][1], zr + 0.2], [(ex0 + ex1) / 2, top[2 * sub][1], zr + 0.2], 0.6, 0.7)
    else beam(tile, [top[0][0], (ey0 + ey1) / 2, zr + 0.2], [top[sub][0], (ey0 + ey1) / 2, zr + 0.2], 0.6, 0.7)
  }
  /** A pent roof (hisashi) along a front wall: a sloping tiled strip from the wall out to y0. */
  const pent = (x0: number, x1: number, yw: number, depth: number, z: number) => {
    const y0 = yw - depth
    quad(tile, [x0, y0, z - 0.8], [x1, y0, z - 0.8], [x1, yw, z], [x0, yw, z])
    quad(tile, [x0, y0, z - 1.15], [x1, y0, z - 1.15], [x1, y0, z - 0.8], [x0, y0, z - 0.8])
    quad(wall, [x0, yw, z - 1.15], [x1, yw, z - 1.15], [x1, y0, z - 1.15], [x0, y0, z - 1.15])
  }
  /** A row of red paper lanterns (small octagonal barrels) along x at y, z. */
  const lanterns = (x0: number, x1: number, y: number, z: number, step = 1.0) => {
    const n = Math.floor((x1 - x0) / step)
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * ((x1 - x0) / n)
      if (hi) lathe(lantern, x, y, [[0.18, z - 0.5], [0.36, z - 0.35], [0.4, z], [0.36, z + 0.35], [0.18, z + 0.5]], 6)
      else box(lantern, x - 0.32, y - 0.32, x + 0.32, y + 0.32, z - 0.45, z + 0.45)
    }
  }

  // ---- The theatre body (OSM outline, front part): white walls ---------
  const body: XY[] = [[-19.7, -47.8], [-2.6, -47.5], [-2.5, -45.2], [9.0, -45.1], [9.0, -47.2], [26.0, -47.3], [26.0, -11.9], [-23.8, -11.1], [-40.0, -10.9], [-38.6, -17.5], [-29.0, -15.8], [-25.6, -32.9], [-26.5, -32.9], [-26.5, -38.0], [-19.9, -37.8]]
  prism(wall, body, 0, 18.3)
  // the stone plinth
  prism(wall, [[-19.9, -48.0], [26.2, -48.0], [26.2, -46.6], [-19.9, -46.6]], 0, 0.9)
  // the back part of the outline behind the tower: a low podium (estimated)
  const back: XY[] = [[23.4, 42.2], [8.4, 42.2], [8.0, 29.9], [-6.8, 29.8], [-6.7, 39.4], [-20.2, 39.7], [-20.6, 29.8], [-36.4, 29.6], [-47.8, 27.7], [-46.3, 18.8], [-20.3, 23.5], [28.7, 23.6], [28.7, 42.2]]
  prism(wall, back, 0, 14)

  // ---- The two front pavilions under irimoya roofs ----------------------
  for (const [x0, x1] of [[-19.7, -6.5], [12.9, 26.0]]) {
    const y0 = x0 < 0 ? -47.85 : -47.35, y1 = -30
    prism(wall, rect(x0, y0, x1, y1), 0, 18.6)
    irimoya(x0, y0, x1, y1, 18.6, 20.4, 25.9, 4.6, 1.3, x0 < 0 ? 1.3 : 4.6)
    // windows: tall red-framed ones in two storeys, small ones under the eaves
    const a: XY = [x0, y0], b: XY = [x1, y0] // front face runs west→east; outside is -y (right of a→b)
    const fa: XY = [x0, y0], fb: XY = [x1, y0]
    void a; void b
    const L = x1 - x0
    for (const s of [L * 0.27, L * 0.73]) {
      wallPanel(win, fa, fb, s - 1.3, s + 1.3, 6.9, 9.4, 0.06)
      wallPanel(win, fa, fb, s - 1.3, s + 1.3, 12.0, 14.2, 0.06)
      wallPanel(win, fa, fb, s - 1.0, s + 1.0, 16.3, 17.1, 0.06)
    }
    // the red balcony in the first storey (railing and its white bracket)
    const bx0 = x0 + L * 0.12, bx1 = x0 + L * 0.88
    box(wall, bx0, y0 - 1.2, bx1, y0, 10.3, 10.8)
    beam(red, [bx0, y0 - 1.15, 11.8], [bx1, y0 - 1.15, 11.8], 0.25, 0.25)
    box(red, bx0, y0 - 1.25, bx1, y0 - 1.05, 10.8, 11.0)
    for (const x of hi ? [bx0, bx0 + (bx1 - bx0) / 3, bx0 + (2 * (bx1 - bx0)) / 3, bx1] : [bx0, bx1]) box(red, x - 0.12, y0 - 1.27, x + 0.12, y0 - 1.03, 10.8, 11.95)
    // white round columns on the corners of the front (half-engaged)
    for (const x of [x0 + 0.6, x1 - 0.6]) lathe(wall, x, y0 - 0.2, [[0.6, 0.9], [0.6, 18.3]], SEG)
    if (hi) {
      for (const x of [x0 + L * 0.5]) lathe(wall, x, y0 - 0.15, [[0.5, 0.9], [0.5, 18.3]], SEG)
      // the bracket sets under the eaves
      for (let i = 0; i <= 4; i++) box(wall, x0 + (L * i) / 4 - 0.3, y0 - 2.2, x0 + (L * i) / 4 + 0.3, y0, 17.4, 18.3)
    }
    // the side faces (only the outer ones are free)
    const outer: [XY, XY] = x0 < 0 ? [[x0, y1], [x0, y0]] : [[x1, y0], [x1, y1]]
    {
      // a red balcony on the outer side face too
      const sx = x0 < 0 ? x0 : x1, d = x0 < 0 ? -1 : 1, yb0 = y0 + 4, yb1 = y0 + 13
      box(wall, Math.min(sx, sx + d * 1.2), yb0, Math.max(sx, sx + d * 1.2), yb1, 10.3, 10.8)
      box(red, Math.min(sx + d * 1.05, sx + d * 1.25), yb0, Math.max(sx + d * 1.05, sx + d * 1.25), yb1, 10.8, 11.0)
      beam(red, [sx + d * 1.15, yb0, 11.8], [sx + d * 1.15, yb1, 11.8], 0.25, 0.25)
      for (const y of [yb0, yb1]) box(red, sx + d * 1.15 - 0.12, y - 0.12, sx + d * 1.15 + 0.12, y + 0.12, 10.8, 11.95)
    }
    for (const s of [3, 8.5, 14]) {
      wallPanel(win, outer[0], outer[1], s - 1.0, s + 1.0, 6.9, 9.4, 0.06)
      wallPanel(win, outer[0], outer[1], s - 1.0, s + 1.0, 12.0, 14.2, 0.06)
    }
  }
  // the pent roof running along the ground floor, across both pavilions
  pent(-19.7, -2.6, -47.85, 2.4, 5.4)
  pent(9.0, 27.3, -47.35, 2.4, 5.4)
  // ---- The centre bay: hipped roof, lantern rail, karahafu porch --------
  hipC(-6.5, -45.2, 12.9, -30, 18.0, 20.7, 1.8, 0.4)
  {
    const fa: XY = [-2.6, -45.2], fb: XY = [9.0, -45.1]
    for (const s of [1.7, 4.4, 7.1, 9.8]) wallPanel(win, fa, fb, s - 1.0, s + 1.0, 11.1, 13.3, 0.06)
    // the red lantern gallery under the eaves
    box(red, -6.5, -46.3, 12.9, -45.1, 14.3, 14.7)
    box(red, -6.5, -46.3, 12.9, -46.1, 16.0, 16.3)
    lanterns(-6.2, 12.6, -45.9, 15.35, hi ? 0.75 : 1.2)
  }
  {
    // karahafu: an undulating curved gable over the entrance porch, its
    // section (across the front) humped in the middle and flared at the ends
    const W2 = 7.0, y0 = -50.6, y1 = -45.1, N = hi ? 16 : 10
    const zk = (u: number) => {
      // u in [-1, 1]: convex crown, concave flanks, slight upturn at the tips
      const a = Math.abs(u)
      return 9.0 + 3.0 * Math.pow(Math.cos((Math.PI / 2) * Math.min(1, a / 0.95)), 1.25) + 0.25 * Math.max(0, a - 0.85) / 0.15
    }
    for (let i = 0; i < N; i++) {
      const u0 = -1 + (2 * i) / N, u1 = -1 + (2 * (i + 1)) / N
      const X = (u: number) => CX + u * W2
      quad(tile, [X(u0), y0, zk(u0)], [X(u1), y0, zk(u1)], [X(u1), y1, zk(u1)], [X(u0), y1, zk(u0)])
      // the white curved bargeboard on the front, and the white tympanum
      quad(wall, [X(u0), y0 - 0.05, zk(u0) - 1.7], [X(u1), y0 - 0.05, zk(u1) - 1.7], [X(u1), y0 - 0.05, zk(u1)], [X(u0), y0 - 0.05, zk(u0)])
      // underside
      quad(wall, [X(u0), y1, zk(u0) - 1.7], [X(u1), y1, zk(u1) - 1.7], [X(u1), y0, zk(u1) - 1.7], [X(u0), y0, zk(u0) - 1.7])
      // the tiled roll along the curved front edge
      quad(tile, [X(u0), y0 - 0.15, zk(u0) - 0.1], [X(u1), y0 - 0.15, zk(u1) - 0.1], [X(u1), y0 - 0.15, zk(u1) + 0.75], [X(u0), y0 - 0.15, zk(u0) + 0.75])
      // the white gable face under the curve, down to the red lantern beam
      const ZB = 7.4, inset = 0.5
      if (zk(u0) - 1.7 > ZB + 0.1 && Math.abs(u0) < 0.97 && Math.abs(u1) < 0.97)
        quad(wall, [X(u0), y0 + inset, ZB], [X(u1), y0 + inset, ZB], [X(u1), y0 + inset, zk(u1) - 1.7], [X(u0), y0 + inset, zk(u0) - 1.7])
      // gold edge along the board's foot (detail)
      if (hi) beam(gold, [X(u0), y0 - 0.12, zk(u0) - 1.5], [X(u1), y0 - 0.12, zk(u1) - 1.5], 0.2, 0.2)
    }
    // the ridge cap and its onigawara, the porch posts, lantern row and doors
    beam(tile, [CX, y0 - 0.2, zk(0) + 0.25], [CX, y1, zk(0) + 0.25], 0.7, 0.6)
    box(tile, CX - 0.6, y0 - 0.45, CX + 0.6, y0 + 0.3, zk(0), zk(0) + 1.5)
    for (const x of [CX - W2 + 0.7, CX + W2 - 0.7]) lathe(wall, x, y0 + 0.7, [[0.5, 0], [0.5, 7.4]], SEG)
    box(red, CX - W2 + 0.4, y0 + 0.2, CX + W2 - 0.4, y0 + 0.9, 7.0, 7.4)
    box(gold, CX - 1.2, y0 - 0.35, CX + 1.2, y0 - 0.05, zk(0) - 1.6, zk(0) - 0.4)
    lanterns(CX - W2 + 1.2, CX + W2 - 1.2, y0 + 0.6, 6.45, hi ? 0.7 : 1.1)
    wallPanel(win, [-2.6, -45.2], [9.0, -45.1], 2.2, 9.4, 0.3, 5.0, 0.06)
  }

  // ---- The side wing along the south-east street (OSM 4859315, 16 m) ----
  {
    const ring: XY[] = [[26.0, -37.9], [37.9, -37.3], [34.8, 44.5], [23.4, 44.1], [23.4, 42.2], [26.0, 23.6]]
    prism(wall, ring, 0, 12)
    // a long gabled tile roof, ridge along the wing
    frame(31.9, -37.6, 2.0)
    const L = 82.0
    loftRings(tile, [{ r: rect(-6.4, -0.6, 6.4, L), z: 11.6 }, { r: [[0, 0.5], [0, 0.5], [0, L - 0.5], [0, L - 0.5]], z: 16 }], false)
    for (const yy of [-0.6, L]) {
      const s = yy < 0 ? -1 : 1
      const pts: V3[] = [[-6.0, yy + s * 0.05 + 0.6 * -s, 11.8], [0, yy + 0.6 * -s, 15.8], [6.0, yy + 0.6 * -s, 11.8]]
      s < 0 ? tri(wall, pts[0], pts[1], pts[2]) : tri(wall, pts[2], pts[1], pts[0])
    }
    const side: XY = [6.0, 0], side2: XY = [6.0, L]
    for (let s = 3; s < L - 3; s += 6) wallPanel(win, side, side2, s - 1.2, s + 1.2, 5.0, 8.0, 0.06)
    frame()
  }

  // ---- Kabukiza Tower: a white finned slab, 145 m (published) -----------
  {
    const T: XY[] = [[-46.3, 18.8], [-40.0, -10.9], [-23.8, -11.1], [29.5, -11.9], [28.7, 23.6], [-20.3, 23.5]]
    const TOP = 141, CROWN = 145
    prism(wall, T, 15.6, TOP)
    prism(wall, T, 0, 15.6, false)
    // a recessed crown band, then the parapet to the published height
    prism(glassT, T.map(([x, y]) => [x * 0.985, 2.5 + (y - 2.5) * 0.97] as XY), TOP, TOP + 2.2, false)
    prism(wall, T, TOP + 2.2, CROWN)
    // the facade: light glass between white fins, in three-storey groups
    const faces: [XY, XY][] = [[T[2], T[3]], [T[3], T[4]], [T[4], T[5]], [T[1], T[2]], [T[5], T[0]], [T[0], T[1]]]
    const step = hi ? 2.4 : 4.8, band = hi ? 12.6 : 25.2
    for (const [a, b] of faces) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      // the ring runs counter-clockwise, so the outside is to the right of b→a
      const n = Math.floor((L - 2) / step)
      for (let i = 0; i < n; i++) {
        const s = 1 + (i + 0.5) * ((L - 2) / n)
        for (let z = 18; z + band * 0.5 < TOP - 1; z += band)
          wallPanel(glassT, a, b, s - step * 0.16, s + step * 0.16, z, Math.min(z + band - 0.8, TOP - 1.5), 0.06)
      }
    }
    // the north-west corner (OSM 4859316, glass) gets the same fins: the photos show white frames there too
  }

  // Colours from daylight photos (Kakidai 2019, Tak1701d): white walls,
  // dark grey tile, vermilion rails and red lanterns, the tower a pale
  // white with grey-blue glass between its fins.
  const flood = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : 0.9)
  return [
    { part: wall, material: { ...finish('kabukiza-white', 0xf3efe6), floodlight: (p: V3, n: V3) => (p[2] > 16 ? 0 : flood(p, n)) } },
    { part: tile, material: finish('kabukiza-tile', 0x868c93) },
    { part: red, material: finish('neon-kabukiza-red', 0xc4473b) },
    { part: gold, material: finish('kabukiza-gold', 0xcfae5a) },
    { part: win, material: { ...PALETTE.window, color: 0x515c64 } },
    { part: glassT, material: windowVariant(2, 0xd3dce2) },
  ] as Parts
}

if (process.env.COUNT) for (const h of [false, true]) console.log(h, build(h).map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
if (import.meta.main && !process.env.COUNT) {
  const extras = { bearing: BEARING, elevation: 0, height: 145 }
  await save('tokyo-kabukiza.glb', 'Kabuki-za', build(false), 6500, 250_000, extras)
  await save('tokyo-kabukiza.detail.glb', 'Kabuki-za', build(true), 40_000, 1536 * 1024, extras)
}
