/**
 * Tokyo Station Marunouchi Building (東京駅丸の内駅舎), Chiyoda, Tokyo:
 * procedural, CC0-1.0, no textures. bun generators/tokyo-station.ts
 *
 * Writes models/tokyo-station.glb (low) and models/tokyo-station.detail.glb
 * (detail, from zoom 16) from one build. This file also holds the small kit
 * (frame, prism, cbox, lathe, beam, wallPanel, archPanel, save) that is
 * copied verbatim into this builder's other tokyo-* generators; nothing is
 * imported from it.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 17.1
 * (the bar's long faces in OSM run at 17.1 degrees): +y is compass 17.1, +x
 * (the track side) compass 107.1, the Marunouchi front faces model -x.
 * Origin: the area centroid of OSM relation/4856156 (139.765977, 35.681249).
 * y = 0 is the ground; elevation 0.
 *
 * Tatsuno Kingo, 1914; the third storey and the domes were rebuilt in the
 * 2007-2012 restoration. What makes it itself, and how each is drawn:
 * - the 335 m bar of red brick with white stone banding (plinth, two
 *   string courses, the cornice; in the detail model two more stripes per
 *   storey and stone pilasters between the bays), three storeys of windows,
 *   arched on the ground floor, under a steep slate roof (dormers in the
 *   detail model);
 * - the two octagonal domed halls: an octagonal hall (OSM part, 37 m across
 *   flats) under a slate roof, a brick drum with windows, the dome as eight
 *   curved slate faces on a bell profile with copper ribs at the corners,
 *   four round dormers, a copper eaves ring and the lantern with a tall
 *   finial; in front of each, the three-storey wing on the plaza (OSM
 *   outline) with three arched windows over three, and on its two diagonal
 *   faces copper barrel vaults with round-arched gables between round
 *   stone turrets with copper cupolas;
 * - the central pavilion: a taller block under a steep roof with cresting,
 *   the round-arched stone gable with its round window rising in front of
 *   the roof, and the porte-cochère (OSM 車寄, 7 m) with two small cupolas;
 * - the white stone towers either side of the centre with copper cupolas,
 *   and the pavilions at +-46 m with stone upper storeys and concave helmet
 *   roofs and finials;
 * - the round corner turrets at the north end, and the south tail turning
 *   south-east along the tracks with its round end tower.
 *
 * Evidence
 * - OSM (ODbL): relation/4856156 (building=train_station, the outline,
 *   Bing 2007 trace) and its parts relation/4856157 (bar, 22 m, roof 5 m),
 *   4856158 (the octagonal halls, 28 m, pyramidal roof 11 m), 4856159 (the
 *   domes, 36 m, dome 9 m), 4856160 (車寄, 7 m), 4856162-4856165 (the ends
 *   and tail, 22 m). The outline's west lumps are the halls' plaza wings.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Tokyo Station Marunouchi Building.jpg", Kakidai, CC BY-SA 4.0 (front
 *     elevation, scaled at 12.6 px/m from the 17 m cornice);
 *   "Views of the Tokyo Station Marunouchi Building from the Marunouchi
 *     Building 2016-06-08.jpg", Dick Thomas Johnson, CC BY 2.0 (from the
 *     west, high: the halls, wings, domes and roofs);
 *   "Tokyo Station Marunouchi North 2012 09.jpg", Nishikaratsu, CC BY-SA 3.0
 *     (the north dome, drum, barrel-vault gable, turrets; colours);
 *   "東京駅 Tokyo Station (8164152017).jpg", Yuya Sekiguchi, CC BY 2.0 (the
 *     south hall's front and arched windows, at dusk);
 *   "TokyoStation-fromair-1931.jpg", public domain (plan of the halls, dome
 *     ribs from above);
 *   "Tokyo Station Marunouchi Building at night.JPG", Kakidai, CC BY-SA 4.0
 *     (night: the whole front is floodlit).
 * - No lidar or NAIP in Japan.
 * Numbers
 * - Published: length 335 m (Wikipedia, JR East); three storeys; dome top
 *   ~35-36 m (OSM 36 m, roof 9 m).
 * - OSM: plan and parts as above; bar 22 m to the ridge, halls 28 m.
 * - Estimated from the Kakidai elevation: cornice 17.2 m, ridge 22.6 m,
 *   central pavilion 19.6 m walls and 28 m roof, flanking towers ~21 m with
 *   cupolas to ~24.5 m, the helmet pavilions' walls 20.8 m and roofs to
 *   ~30 m with finials, bay spacing 3.9 m, the centre at y = 15.8 (midway
 *   between the domes and on the porte-cochère).
 * - Estimated from the 2012/2016 photos: drum 21-27.6 m, dome profile,
 *   lantern and finial to 44.5 m, the barrel vaults (radius 5.4 m) and the
 *   turrets, the wings' 30 m front.
 * - Invented: the south tail's round end tower's roof (no photo of that
 *   end), the dormer spacing.
 * Colours (daylight photos, pulled to the palette): brick #b2604c, white
 *   stone #f1ebe0, roof slate #5f626b, dome slate #584d53 (the domes read
 *   darker and browner than the roofs), copper #8f5c47 (restored, brown).
 * Doubts
 * - OSM puts the domes over the bar's axis (x = 3.4) and the outline's
 *   plaza wings in front of them; both are followed, so each dome sits
 *   ~20 m behind its wing's front. The photos from the west agree.
 * - The east (track) face, the south tail and the north end are seen in no
 *   photo used; they repeat the front's storeys and banding.
 * - Terrain: `tools/terrain.ts check` reports ~97 m2 of the plinth band in
 *   front of the south wing up to 0.6 m under the drawn ground (a dip of
 *   ~3 m in the Mapterhorn grid there, a subway entrance); left as is.
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
// Tokyo Station Marunouchi Building
// ---------------------------------------------------------------------------
const BEARING = 17.1
const XW = -7.3, XE = 13.9 // the bar's west (Marunouchi) and east (track) faces
const YS = -112.6, YN = 151.1 // the bar's south (where the tail turns) and north ends
const YC = 15.8 // the axis of symmetry: the central entrance
const EAVE = 17.2 // cornice of the three storeys
const HALLS = [YC + 99.4, YC - 99.2] // north and south dome halls (OSM parts)
const HX = 3.4 // the halls' centre line

function build(hi: boolean) {
  const brick = new Part(), stone = new Part(), slate = new Part(), copper = new Part(), win = new Part(), dome = new Part()
  const door = win
  frame()
  const SEG = hi ? 16 : 8

  /** Stone banding round a block: plinth, two string courses and the cornice. */
  const bands = (ring: XY[], top: number, o = 0.15) => {
    const grow = (r: XY[], d: number): XY[] => {
      // offset a CCW convex-ish ring outward by d (per-vertex bisector)
      const n = r.length, out: XY[] = []
      const ccw = signedArea(r) > 0 ? r : [...r].reverse()
      for (let i = 0; i < n; i++) {
        const p = ccw[(i + n - 1) % n], c = ccw[i], q = ccw[(i + 1) % n]
        const e1 = [c[0] - p[0], c[1] - p[1]], e2 = [q[0] - c[0], q[1] - c[1]]
        const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
        const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
        const b = [n1[0] + n2[0], n1[1] + n2[1]], bl = (b[0] * n1[0] + b[1] * n1[1]) || 1
        out.push([c[0] + (b[0] * d) / bl, c[1] + (b[1] * d) / bl])
      }
      return out
    }
    prism(stone, grow(ring, o), 0, 1.1)
    prism(stone, grow(ring, o), 5.7, 6.3)
    prism(stone, grow(ring, o), 11.1, 11.6)
    prism(stone, grow(ring, o * 2.4), top - 1.1, top)
    if (hi) for (const z of [1.5, 4.9, 7.0, 10.4, 12.2, 15.5]) if (z < top - 1.5) prism(stone, grow(ring, 0.05), z - 0.15, z + 0.15, false)
  }
  const block = (ring: XY[], top: number) => { prism(brick, ring, 0, top - 1.1); bands(ring, top) }

  /** Windows on a wall a→b (outside to the right) at bay centres `at` (metres along), three storeys. */
  const ROWS: [number, number, boolean][] = [[1.6, 4.9, true], [7.1, 10.3, false], [12.3, 15.4, false]]
  const windows = (a: XY, b: XY, at: number[], w = 1.7, rows = ROWS) => {
    for (const s of at) for (const [z0, z1, arch] of rows) {
      if (arch && hi) archPanel(win, a, b, s - w / 2, s + w / 2, z0, z1 - w / 2, 0.06, 6)
      else wallPanel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.06)
      if (hi) {
        // pale stone surround and, on the first floor, a small pediment hood
        wallBlock(stone, a, b, s - w / 2 - 0.3, s + w / 2 + 0.3, z0 - 0.35, z0, 0, 0.18)
        if (z0 > 6 && z0 < 8) wallBlock(stone, a, b, s - w / 2 - 0.4, s + w / 2 + 0.4, z1 + 0.15, z1 + 0.6, 0, 0.3)
      }
    }
  }
  const pilasters = (a: XY, b: XY, at: number[], step: number) => {
    if (!hi) return
    for (const s of at) for (const d of [-step / 2, step / 2]) wallBlock(stone, a, b, s + d - 0.35, s + d + 0.35, 1.1, EAVE - 1.1, 0, 0.12, false)
  }
  const spaced = (s0: number, s1: number, step: number) => {
    const n = Math.max(1, Math.floor((s1 - s0) / step)), d = (s1 - s0) / n
    return Array.from({ length: n }, (_, i) => s0 + d * (i + 0.5))
  }

  // ---- The bar: three storeys of red brick with white stone bands -------
  block([[XW, YS - 8.4], [XE, YS], [XE, YN], [XW, YN]], EAVE)
  // Windows on the west front, between the pavilions and halls; and the whole east face.
  const westGaps: [number, number][] = [] // y ranges along the west front with no bar windows
  const hallFront = 31
  for (const yh of HALLS) westGaps.push([yh - hallFront, yh + hallFront])
  westGaps.push([YC - 13, YC + 13])
  for (const d of [-46, 46]) westGaps.push([YC + d - 6.4, YC + d + 6.4])
  for (const d of [-15, 15]) westGaps.push([YC + d - 3.2, YC + d + 3.2])
  const free = (y: number, gaps: [number, number][]) => !gaps.some(([a, b]) => y > a - 1.2 && y < b + 1.2)
  const yBays = spaced(YS + 2, YN - 2, 3.9)
  // west face runs north→south (outside is west)
  windows([XW, YN], [XW, YS], yBays.filter((y) => free(y, westGaps)).map((y) => YN - y))
  pilasters([XW, YN], [XW, YS], yBays.filter((y) => free(y, westGaps)).map((y) => YN - y), yBays[1] - yBays[0])
  const eastGaps: [number, number][] = HALLS.map((yh) => [yh - 19, yh + 19] as [number, number])
  windows([XE, YS], [XE, YN], yBays.filter((y) => free(y, eastGaps)).map((y) => y - YS))
  pilasters([XE, YS], [XE, YN], yBays.filter((y) => free(y, eastGaps)).map((y) => y - YS), yBays[1] - yBays[0])
  // north end
  windows([XE, YN], [XW, YN], spaced(1.5, XE - XW - 1.5, 4.2))

  // The bar's slate roof, in runs between the halls (a steep mansard, the
  // restored third storey's roof, ridge ~22.6 m).
  const barRoof = (y0: number, y1: number, hip0: boolean, hip1: boolean) => {
    const e = 0.5
    const r = (ix: number, iy0: number, iy1: number, z: number) => ({ r: rect(XW - e + ix, y0 + iy0, XE + e - ix, y1 - iy1), z })
    loftRings(slate, [r(0, 0, 0, EAVE), r(3.0, hip0 ? 3.0 : 0, hip1 ? 3.0 : 0, 21.0), r(10.6 + e, hip0 ? 10.6 : 0, hip1 ? 10.6 : 0, 22.6)], false)
    if (!hip0) quad(slate, [XW - e, y0, EAVE], [XW - e + 3, y0, 21], [XE + e - 3, y0, 21], [XE + e, y0, EAVE])
    if (!hip1) quad(slate, [XE + e, y1, EAVE], [XE + e - 3, y1, 21], [XW - e + 3, y1, 21], [XW - e, y1, EAVE])
  }
  barRoof(YS - 4, HALLS[1] - 14, false, false)
  barRoof(HALLS[1] + 14, HALLS[0] - 14, false, false)
  barRoof(HALLS[0] + 14, YN, false, true)
  // dormers along the roof (detail): small slate-roofed boxes with a window
  if (hi) {
    for (const y of yBays.filter((y) => free(y, [...westGaps, ...eastGaps]) && Math.round((y - YS) / 3.9) % 2 === 0)) {
      for (const [x, s] of [[XW + 1.6, -1], [XE - 1.6, 1]] as [number, number][]) {
        box(stone, x - 0.9, y - 0.9, x + 0.9, y + 0.9, 18.4, 20.4)
        wallPanel(win, s < 0 ? [x - 0.9, y + 0.6] : [x + 0.9, y - 0.6], s < 0 ? [x - 0.9, y - 0.6] : [x + 0.9, y + 0.6], 0.25, 0.95, 18.7, 20.0, 0.03)
        hipRoof(slate, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 20.4, 1.0)
      }
    }
  }

  // ---- Central pavilion --------------------------------------------------
  const CW = 12.2
  block(rect(XW - 1.5, YC - CW, XE + 1.5, YC + CW), 19.6)
  loftRings(slate, [{ r: rect(XW - 2.1, YC - CW - 0.6, XE + 2.1, YC + CW + 0.6), z: 19.6 }, { r: rectIn(XW - 1.5, YC - CW, XE + 1.5, YC + CW, 4.4), z: 27.0 }, { r: rectIn(XW - 1.5, YC - CW, XE + 1.5, YC + CW, 6.2), z: 28.0 }])
  // cresting round the flat top
  for (const [a, b] of [[[XW + 4.7, YC - 6], [XE - 4.7, YC - 6]], [[XE - 4.7, YC - 6], [XE - 4.7, YC + 6]], [[XE - 4.7, YC + 6], [XW + 4.7, YC + 6]], [[XW + 4.7, YC + 6], [XW + 4.7, YC - 6]]] as [XY, XY][])
    beam(copper, [a[0], a[1], 28.6], [b[0], b[1], 28.6], 0.3, 1.2)
  // The central frontispiece: stone pilasters and the round-arched gable
  // that rises in front of the roof, with its round window.
  const cf: XY = [XW - 1.5, YC + CW], cb: XY = [XW - 1.5, YC - CW] // west face, north→south
  const sC = CW
  for (const d of [-4.6, 3.4]) wallBlock(stone, cf, cb, sC + d, sC + d + 1.2, 1.1, 19.6, 0, 0.45)
  wallPanel(brick, cf, cb, sC - 3.4, sC + 3.4, 6.3, 19.6, 0.12)
  for (const [z0, z1] of [[7.1, 10.6], [12.2, 16.8]]) wallPanel(win, cf, cb, sC - 1.6, sC + 1.6, z0, z1, 0.18)
  {
    const R = 4.6, zc = 19.6, x = XW - 1.5 - 0.1, n = hi ? 12 : 8
    for (let i = 0; i < n; i++) {
      const t0 = (Math.PI * i) / n, t1 = (Math.PI * (i + 1)) / n
      const P = (t: number, r: number, dx: number): V3 => [x + dx, YC + r * Math.cos(t), zc + r * Math.sin(t)]
      // brick tympanum (front face) and stone arch ring
      tri(brick, P(0, 0, -0.3), P(t1, R - 0.9, -0.3), P(t0, R - 0.9, -0.3))
      quad(stone, P(t0, R - 0.9, -0.4), P(t0, R, -0.4), P(t1, R, -0.4), P(t1, R - 0.9, -0.4))
      quad(stone, P(t0, R, -0.4), P(t0, R, 1.6), P(t1, R, 1.6), P(t1, R, -0.4))
    }
    const o = ngon(YC, zc + 1.6, 1.15, hi ? 12 : 8)
    for (let i = 1; i < o.length - 1; i++) tri(win, [x - 0.45, o[0][0], o[0][1]], [x - 0.45, o[i + 1][0], o[i + 1][1]], [x - 0.45, o[i][0], o[i][1]])
  }
  // the porte-cochère (車寄, OSM 7 m): a stone porch with two small cupolas
  box(stone, -15.6, 12.3, XW - 1.5, 19.2, 0, 6.0)
  box(stone, -15.9, 12.0, XW - 1.5, 19.5, 6.0, 6.6)
  wallPanel(door, [-15.6, 19.2], [-15.6, 12.3], 1.6, 5.3, 0, 3.8, 0.05)
  for (const y of [12.9, 18.6]) lathe(copper, -15.0, y, [[0.7, 6.6], [0.7, 7.0], [0.6, 7.6], [0.3, 8.0], [0.05, 8.5], [0, 8.5]], 8)

  // ---- White stone towers flanking the centre (cupolas) ------------------
  for (const d of [-15, 15]) {
    const y = YC + d
    prism(brick, rect(XW - 1.0, y - 2.8, XE + 0.6, y + 2.8), 0, 11.1)
    prism(stone, rect(XW - 1.0, y - 2.8, XE + 0.6, y + 2.8), 11.1, 21.0)
    box(stone, XW - 1.3, y - 3.1, XW + 4.8, y + 3.1, 20.4, 21.2)
    windows([XW - 1.0, y + 2.8], [XW - 1.0, y - 2.8], [2.8], 1.3)
    lathe(copper, XW + 1.75, y, hi ? [[2.6, 21.2], [2.5, 22.4], [2.0, 23.4], [1.1, 24.1], [0.4, 24.4], [0.25, 25.2], [0.12, 27.0], [0, 27.0]] : [[2.6, 21.2], [2.3, 23.0], [1.1, 24.1], [0.3, 24.5], [0, 26.6]], SEG)
  }

  // ---- The pavilions with pointed helmet roofs, ±46 m --------------------
  for (const d of [-46, 46]) {
    const y = YC + d, h = 6.2
    block(rect(XW - 1.2, y - h, XW + 11.2, y + h), 20.8)
    prism(stone, rect(XW - 1.25, y - h - 0.05, XW + 11.25, y + h + 0.05), 11.6, 19.7, false)
    wallPanel(win, [XW - 1.25, y + h], [XW - 1.25, y - h], 4.4, 8.0, 17.6, 19.4, 0.06)
    windows([XW - 1.2, y + h], [XW - 1.2, y - h], [3.2, 6.2, 9.2], 1.5)
    const cx = XW + 5.0
    // concave square helmet roof (flat-sided lathe, four sides)
    lathe(slate, cx, y, [[h * Math.SQRT2 + 0.6, 20.8], [6.6, 22.6], [4.6, 24.6], [3.0, 26.6], [1.8, 28.2], [1.0, 29.3], [0.6, 29.8]], 4, Math.PI / 4, 30, true)
    lathe(copper, cx, y, hi ? [[0.6, 29.8], [1.0, 30.2], [0.8, 31.0], [0.18, 31.3], [0.12, 34.0], [0, 34.0]] : [[0.6, 29.8], [1.0, 30.3], [0.2, 31.1], [0, 33.6]], hi ? 8 : 6)
  }

  // ---- The dome halls ---------------------------------------------------
  for (const yh of HALLS) {
    // the octagonal hall, across flats 37 m (OSM part, 28 m to the roof top)
    const oct = ngon(HX, yh, 18.6 / Math.cos(Math.PI / 8), 8, Math.PI / 8)
    block(oct, EAVE)
    const dr = 10.4 / Math.cos(Math.PI / 8)
    loftRings(slate, [{ r: oct.map(([x, y]) => [HX + (x - HX) * 1.03, yh + (y - yh) * 1.03] as XY), z: EAVE }, { r: ngon(HX, yh, dr + 1.0, 8, Math.PI / 8), z: 21.8 }], false)
    // the octagonal drum with its windows, to the dome's springing at 27.4
    const drum = ngon(HX, yh, dr, 8, Math.PI / 8)
    prism(brick, drum, 21.0, 26.9, false)
    prism(stone, ngon(HX, yh, dr + 0.35, 8, Math.PI / 8), 26.9, 27.6)
    for (let i = 0; i < 8; i++) {
      const a = drum[i], b = drum[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (const f of [0.3, 0.5, 0.7]) wallPanel(win, a, b, L * f - 0.55, L * f + 0.55, 23.4, 25.9, 0.05)
    }
    // the dome: eight slate faces on a bell profile, copper ribs at the corners
    const prof: [number, number][] = [[dr + 0.4, 27.6], [dr + 0.25, 29.3], [dr - 0.5, 31.0], [dr - 2.0, 32.7], [dr - 4.3, 34.4], [dr - 7.0, 35.6], [2.2, 36.1]]
    lathe(dome, HX, yh, prof, 8, Math.PI / 8, 40, true)
    const ribN = hi ? prof.length : 4
    const rp = hi ? prof : [prof[0], prof[2], prof[4], prof[6]]
    for (let i = 0; i < 8; i++) {
      const t = Math.PI / 8 + (i * Math.PI) / 4
      for (let k = 0; k < ribN - 1; k++) {
        const P = (q: [number, number]): V3 => [HX + (q[0] + 0.12) * Math.cos(t), yh + (q[0] + 0.12) * Math.sin(t), q[1]]
        beam(copper, P(rp[k]), P(rp[k + 1]), 0.7, 0.45, [Math.cos(t), Math.sin(t), 0])
      }
    }
    // the copper eaves ring and the lantern with its tall finial
    prism(copper, ngon(HX, yh, dr + 0.75, 8, Math.PI / 8), 27.4, 27.9)
    lathe(copper, HX, yh, hi ? [[2.3, 36.0], [2.3, 36.6], [1.6, 37.0], [1.4, 37.9], [1.9, 38.2], [1.0, 38.8], [0.35, 39.4], [0.2, 41.0], [0.08, 44.5], [0, 44.5]] : [[2.3, 36.0], [2.3, 36.6], [1.4, 37.2], [1.8, 38.2], [0.4, 39.3], [0, 44.0]], 8)
    // round dormers (oculi) on four faces of the dome
    for (let i = 0; i < 4; i++) {
      const t = (i * Math.PI) / 2 + (yh > YC ? 0 : 0)
      const r = dr - 1.1, cx = HX + r * Math.cos(t), cy = yh + r * Math.sin(t), z = 31.3
      const u: XY = [-Math.sin(t), Math.cos(t)], nn: XY = [Math.cos(t), Math.sin(t)]
      const ring = [[-1.0, -0.9], [1.0, -0.9], [1.0, 1.2], [-1.0, 1.2]].map(([s, d]) => [cx + u[0] * s + nn[0] * d, cy + u[1] * s + nn[1] * d] as XY)
      prism(copper, ring, z - 1.2, z + 1.2)
      const fc: XY = [cx + nn[0] * 1.21, cy + nn[1] * 1.21]
      const o = Array.from({ length: hi ? 10 : 6 }, (_, k) => (k * 2 * Math.PI) / (hi ? 10 : 6))
      for (let k = 0; k < o.length; k++) {
        const P = (a: number): V3 => [fc[0] + u[0] * 0.6 * Math.cos(a), fc[1] + u[1] * 0.6 * Math.cos(a), z + 0.6 * Math.sin(a)]
        tri(win, [fc[0], fc[1], z], P(o[(k + 1) % o.length]), P(o[k]))
      }
    }

    // The hall's front wing on the Marunouchi side (OSM outline): a
    // three-storey front 30 m wide, two diagonal faces, each under a copper
    // barrel vault with a round-arched gable between round stone turrets.
    const s = yh > YC ? 1 : -1
    const Y = (d: number) => yh + d
    const front = rect(-33, Y(-15.2), -14, Y(15.2))
    block(front, EAVE)
    loftRings(slate, [{ r: rect(-33.5, Y(-15.7), -13.5, Y(15.7)), z: EAVE }, { r: rect(-30.5, Y(-12.7), -16.5, Y(12.7)), z: 21.0 }])
    windows([-33, Y(15.2)], [-33, Y(-15.2)], [3.3, 7.4], 1.6)
    windows([-33, Y(15.2)], [-33, Y(-15.2)], [23.0, 27.1], 1.6)
    // the three arched windows over three, in the middle of the front
    for (const ds of [-3.1, 0, 3.1]) {
      archPanel(win, [-33, Y(15.2)], [-33, Y(-15.2)], 15.2 + ds - 1.1, 15.2 + ds + 1.1, 1.6, 4.6, 0.06, hi ? 8 : 4)
      archPanel(win, [-33, Y(15.2)], [-33, Y(-15.2)], 15.2 + ds - 1.1, 15.2 + ds + 1.1, 7.0, 9.8, 0.06, hi ? 8 : 4)
      if (hi) wallBlock(stone, [-33, Y(15.2)], [-33, Y(-15.2)], 15.2 + ds - 1.25, 15.2 + ds + 1.25, 6.3, 7.0, 0, 0.35)
    }
    wallPanel(win, [-33, Y(15.2)], [-33, Y(-15.2)], 11.2, 19.2, 12.3, 15.4, 0.06)
    for (const sd of [-1, 1]) {
      // diagonal block: from the front's corner back to the bar
      const ring: XY[] = sd > 0
        ? [[-33, Y(15.2)], [-14, Y(15.2)], [XW, Y(25)], [XW, Y(30.6)], [-17.5, Y(30.6)]]
        : [[-33, Y(-15.2)], [-17.5, Y(-30.6)], [XW, Y(-30.6)], [XW, Y(-25)], [-14, Y(-15.2)]]
      block(ring, EAVE)
      capPoly(slate, ring, EAVE + 0.05)
      // the diagonal face, its outward normal and the barrel vault behind it
      const a: XY = sd > 0 ? [-17.5, Y(30.6)] : [-33, Y(-15.2)], b: XY = sd > 0 ? [-33, Y(15.2)] : [-17.5, Y(-30.6)]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const R = 5.4, Lv = 13, n2 = hi ? 14 : 8
      const VP = (t: number, r: number, d: number): V3 => [m[0] + u[0] * r * Math.cos(t) - n[0] * d, m[1] + u[1] * r * Math.cos(t) - n[1] * d, EAVE + r * Math.sin(t)]
      for (let i = 0; i < n2; i++) {
        const t0 = (Math.PI * i) / n2, t1 = (Math.PI * (i + 1)) / n2
        const N = (t: number): V3 => [u[0] * Math.cos(t), u[1] * Math.cos(t), Math.sin(t)]
        quad(copper, VP(t0, R + 0.25, -0.5), VP(t0, R + 0.25, Lv), VP(t1, R + 0.25, Lv), VP(t1, R + 0.25, -0.5), [N(t0), N(t0), N(t1), N(t1)])
        // the gable: brick tympanum with a big arched window
        tri(brick, VP(0, 0, -0.05), VP(t0, R, -0.05), VP(t1, R, -0.05))
        tri(win, VP(0, 0, -0.12), VP(t0, R - 1.3, -0.12), VP(t1, R - 1.3, -0.12))
        quad(copper, VP(t0, R, -0.5), VP(t1, R, -0.5), VP(t1, R + 0.25, -0.5), VP(t0, R + 0.25, -0.5))
      }
      // the arched windows below, and the stone turrets at the gable's sides
      windows(a, b, [L / 2 - 2.6, L / 2, L / 2 + 2.6], 1.5)
      for (const k of [-1, 1]) {
        const c: XY = [m[0] + u[0] * k * (R + 1.0) + n[0] * 0.5, m[1] + u[1] * k * (R + 1.0) + n[1] * 0.5]
        lathe(stone, c[0], c[1], [[1.25, 0], [1.25, 17.8], [1.5, 18.2], [1.5, 18.8]], SEG)
        lathe(copper, c[0], c[1], hi ? [[1.5, 18.8], [1.4, 19.6], [1.0, 20.3], [0.4, 20.7], [0.15, 21.6], [0.06, 23.0], [0, 23.0]] : [[1.5, 18.8], [1.2, 20.0], [0.4, 20.7], [0, 22.6]], SEG)
      }
    }
    void s
  }

  // ---- The north end: two round corner turrets -------------------------
  for (const [x, y] of [[-6.6, 152.0], [14.2, 151.6]] as XY[]) {
    lathe(brick, x, y, [[3.0, 0], [3.0, 16.1]], SEG)
    lathe(stone, x, y, [[3.15, 0], [3.15, 1.1]], SEG)
    lathe(stone, x, y, [[3.15, 5.7], [3.15, 6.3]], SEG)
    lathe(stone, x, y, [[3.15, 11.1], [3.15, 11.6]], SEG)
    lathe(stone, x, y, [[3.4, 16.1], [3.4, 17.6]], SEG)
    lathe(slate, x, y, [[3.4, 17.6], [3.0, 19.4], [2.0, 20.8], [0.8, 21.6], [0.1, 22.0], [0, 22.0]], SEG)
    lathe(copper, x, y, [[0.2, 21.9], [0, 24.0]], 6)
  }

  // ---- The south tail: the wing that turns south-east along the tracks --
  {
    const o: XY = [16.55, -130.45], ang = -47.7
    frame(o[0], o[1], ang)
    const W2 = 10.55
    block(rect(-22, -W2, 22.5, W2), EAVE)
    loftRings(slate, [{ r: rect(-14, -W2 - 0.5, 23, W2 + 0.5), z: EAVE }, { r: rect(-14, -W2 + 2.5, 20.0, W2 - 2.5), z: 21.0 }, { r: rect(-14, -0.1, 12.0, 0.1), z: 22.6 }], false)
    quad(slate, [-14, W2 + 0.5, EAVE], [-14, W2 - 2.5, 21], [-14, -W2 + 2.5, 21], [-14, -W2 - 0.5, EAVE])
    windows([22.5, W2], [-6, W2], spaced(0.5, 28, 3.9))
    windows([-6, -W2], [22.5, -W2], spaced(0.5, 28, 3.9))
    frame()
    // the round end tower
    const tc: XY = [36.3, -155.0]
    lathe(brick, tc[0], tc[1], [[5.6, 0], [5.6, 16.1]], SEG)
    lathe(stone, tc[0], tc[1], [[5.75, 0], [5.75, 1.1]], SEG)
    lathe(stone, tc[0], tc[1], [[5.75, 5.7], [5.75, 6.3]], SEG)
    lathe(stone, tc[0], tc[1], [[5.75, 11.1], [5.75, 11.6]], SEG)
    lathe(stone, tc[0], tc[1], [[6.0, 16.1], [6.0, 17.2]], SEG)
    lathe(slate, tc[0], tc[1], [[6.0, 17.2], [5.4, 19.2], [3.8, 21.0], [1.6, 22.2], [0, 22.5]], SEG)
  }

  // Colours from daylight photos, pulled to the palette's lightness.
  // Night: the whole front is floodlit (Kakidai's night views).
  const wall = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.95)
  const roofLit = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.15 : 0.45)
  return [
    { part: brick, material: { ...finish('tokyo-station-brick', 0xb2604c), floodlight: wall } },
    { part: stone, material: { ...finish('tokyo-station-stone', 0xf1ebe0), floodlight: wall } },
    { part: slate, material: { ...finish('tokyo-station-slate', 0x5f626b), floodlight: roofLit } },
    { part: copper, material: { ...finish('tokyo-station-copper', 0x8f5c47), floodlight: roofLit } },
    { part: win, material: PALETTE.window },
    { part: dome, material: { ...finish('tokyo-station-dome', 0x584d53), floodlight: roofLit } },
  ] as Parts
}

if (process.env.COUNT) for (const h of [false, true]) console.log(h, build(h).map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
if (import.meta.main && !process.env.COUNT) {
  const extras = { bearing: BEARING, elevation: 0, height: 44.5 }
  await save('tokyo-station.glb', 'Tokyo Station Marunouchi Building', build(false), 6500, 250_000, extras)
  await save('tokyo-station.detail.glb', 'Tokyo Station Marunouchi Building', build(true), 40_000, 1536 * 1024, extras)
}
