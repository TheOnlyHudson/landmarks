/**
 * The Dairy, Central Park, south of the 65th Street Transverse (Calvert Vaux,
 * 1869–70; loggia rebuilt 1979 to the original design; now the Central Park
 * Conservancy's visitor centre and gift shop) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-cp-dairy.ts
 *
 * This file also exports a small kit (`board`, `house`, `opening`, `ngon`,
 * `archPts`) used by the other Central Park buildings of this batch
 * (nyc-chess-checkers-house, nyc-arsenal, nyc-cop-cot, nyc-tavern-on-the-green);
 * its own build runs only under `import.meta.main`.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * 28.7° (the Manhattan grid; the outline's edges run at 28.7° and 118.7°), so
 * model +y is NNE, toward the transverse road, and +x is ESE. Anchor: the
 * centroid of OSM way/265347588 (building=retail, "The Dairy (Visitor Center
 * and Gift Shop)", height=9.6), which this model replaces; there are no other
 * building ways within 50 m.
 *
 * Plan (OSM, model frame): the stone house x −9.8..10.2, y −0.4..7.85, with
 * a wing to the NNE x −6.5..4.1 up to y 11.0; the open timber loggia x −9.8..9.8,
 * y −9.0..−2.3, with two gabled bays on its SSW side (x −6.7..−3.1 and
 * 2.9..7.0, out to y −11.0); a low link between them, x −6.6..7.0.
 *
 * Heights. y = 0 is the path under the loggia, ~19.9 m NAVD88.
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 0.5 m grid read in this
 *   frame: stone house ridge +8.3 (along x at y ≈ 4.5, slopes ~50°); its wing
 *   ridge +7.7 (along y at x ≈ −1.5); loggia ridge +8.2 (along x); the
 *   lantern's spire +13.5 at x ≈ 0 on the loggia ridge; a chimney +9.7 near
 *   (−2, 8). OSM's height=9.6 is taken as a mean of roof and lantern.
 * - Estimated from the photos against those: stone walls 3.7 m to the eave,
 *   loggia eave 3.0 m, posts and railing, the arched gable openings, the
 *   lantern (1.7 m square, open stage 2.3 m) and every window.
 * - Published (Central Park Conservancy; Wikipedia "The Dairy (Central
 *   Park)"): Victorian Gothic, 1870, Calvert Vaux; polychrome stone with a
 *   tall slate roof; the painted timber loggia restored 1979.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-cp-dairy/photos):
 * - Daderot, "Dairy in Central Park, NYC - IMG 5647.JPG", public domain,
 *   https://commons.wikimedia.org/wiki/File:Dairy_in_Central_Park,_NYC_-_IMG_5647.JPG
 *   (from the WSW: the stone house's west gable, the loggia's arched west
 *   gable, the lantern, the SSW side with its two gabled bays)
 * - Ingfbruno, "3030-Central Park-The Dairy.JPG", CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:3030-Central_Park-The_Dairy.JPG
 *   (from the ESE: the loggia's east gable over the path, the stone house's
 *   east gable with its round-arched window)
 * - Rhododendrites, "Central Park Dairy.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_Dairy.jpg
 *   (the path running through the loggia under its east gable)
 *
 * Colours from the photos: grey Manhattan-schist walls with buff sandstone
 * dressings, grey-brown slate, the loggia's cream boards and sage-green
 * posts, red-brown bargeboards.
 *
 * Doubts: the NNE side (toward the transverse) and the wing are seen in no
 * photo and drawn plain; window positions there are invented. The loggia's
 * pierced bargeboards, brackets and balusters are drawn as plain boards and
 * bars. The lantern's ridge position follows lidar, its shape the photos.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'

export type P2 = [number, number]

/** Ear-clipping triangulation of a simple polygon; returns index triples, counter-clockwise. */
export function earcut(pts: P2[]): [number, number, number][] {
  let A = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; A += a[0] * b[1] - b[0] * a[1] }
  const idx = pts.map((_, i) => i)
  if (A < 0) idx.reverse()
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inT = (p: P2, a: P2, b: P2, c: P2) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let done = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cr(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inT(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); done = true; break
    }
    if (!done) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

export type Map2 = (s: number, t: number) => V3
const addv = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A flat polygon (any simple outline in s,t) on the plane `at`, facing `n`. */
export function poly(p: Part, pts: P2[], at: Map2, n: V3, off = 0) {
  for (const [a, b, c] of earcut(pts)) {
    const A = addv(at(...pts[a]), n, off), B = addv(at(...pts[b]), n, off), C = addv(at(...pts[c]), n, off)
    p.tri(A, B, C, undefined, undefined, undefined, [n, n, n])
  }
}

/**
 * A board: the outline `pts` (s,t) on the mid-plane `at`, `thick` along `n`,
 * with both faces and its edges. Any simple outline, so it also draws a
 * gable with an arch cut out, or a whole prism (a wall, a roof slope, a
 * plan extruded upward).
 */
export function board(p: Part, pts: P2[], at: Map2, n: V3, thick: number, edges = true) {
  const h = thick / 2
  poly(p, pts, at, n, h)
  poly(p, pts, at, [-n[0], -n[1], -n[2]], -h)
  if (!edges) return
  let A = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; A += a[0] * b[1] - b[0] * a[1] }
  const o = at(0, 0), S = addv(at(1, 0), o, -1), T = addv(at(0, 1), o, -1)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    let ds = b[0] - a[0], dt = b[1] - a[1]
    if (A < 0) { ds = -ds; dt = -dt }
    const m = addv([S[0] * dt, S[1] * dt, S[2] * dt], T, -ds)
    const l = Math.hypot(...m) || 1, nm: V3 = [m[0] / l, m[1] / l, m[2] / l]
    const a0 = addv(at(...a), n, -h), a1 = addv(at(...a), n, h), b0 = addv(at(...b), n, -h), b1 = addv(at(...b), n, h)
    p.tri(a0, b0, b1, undefined, undefined, undefined, [nm, nm, nm])
    p.tri(a0, b1, a1, undefined, undefined, undefined, [nm, nm, nm])
  }
}

/** Plan outline extruded from z0 to z1. */
export function slabUp(p: Part, plan: P2[], z0: number, z1: number) {
  board(p, plan, (x, y) => [x, y, (z0 + z1) / 2], [0, 0, 1], z1 - z0)
}
/** An axis-aligned box. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  slabUp(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
}
/** A regular n-gon prism, first corner at angle `phase`. */
export function ngon(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 8, phase = Math.PI / 8) {
  slabUp(p, Array.from({ length: n }, (_, i): P2 => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)]), z0, z1)
}

/**
 * The head of an opening of width w springing at zs, rising h: h = w/2 is a
 * semicircle, h > w/2 a pointed (two-centred) arch, h = 0 flat. Points run
 * from the right springing over to the left one.
 */
export function archPts(w: number, zs: number, h: number, seg = 5): P2[] {
  const r0 = w / 2
  if (h <= 1e-6) return [[r0, zs], [-r0, zs]]
  if (h < r0 - 1e-6) { // segmental: one centre below the springing
    const d = (r0 * r0 - h * h) / (2 * h), R = d + h, t0 = Math.atan2(d, r0)
    return Array.from({ length: 2 * seg + 1 }, (_, i): P2 => { const a = t0 + ((Math.PI - 2 * t0) * i) / (2 * seg); return [R * Math.cos(a), zs - d + R * Math.sin(a)] })
  }
  if (Math.abs(h - r0) < 1e-6) return Array.from({ length: 2 * seg + 1 }, (_, i): P2 => { const a = (i * Math.PI) / (2 * seg); return [r0 * Math.cos(a), zs + r0 * Math.sin(a)] })
  // Two-centred arch: the right half's centre sits at (a, zs) left of the right springing.
  const a = (h * h - r0 * r0) / w, R = r0 + a
  const right: P2[] = []
  const a1 = Math.atan2(h, a) // angle of the apex seen from the centre (−a, zs)
  for (let i = 0; i <= seg; i++) { const t = (i / seg) * a1; right.push([-a + R * Math.cos(t), zs + R * Math.sin(t)]) }
  right[right.length - 1] = [0, zs + h]
  const left = right.slice(0, -1).reverse().map(([s, z]): P2 => [-s, z])
  return [...right, ...left]
}

/** Outline of an opening z0..z1 of width w with the given head rise. */
export function openingPts(w: number, z0: number, z1: number, rise: number, seg = 5): P2[] {
  return [[-w / 2, z0], [w / 2, z0], ...archPts(w, z1 - rise, rise, seg)]
}

/** A flat panel on a wall: centre (cx, cy) on the wall line, outward normal (nx, ny). */
export function opening(p: Part, cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, rise: number, off = 0.06, seg = 5) {
  const at: Map2 = (s, z) => [cx - ny * s, cy + nx * s, z]
  poly(p, openingPts(w, z0, z1, rise, seg), at, [nx, ny, 0], off)
}

/**
 * A gabled house along `axis`: walls (u0..u1 × v0..v1, z0..eave), gable
 * infill to the ridge, and a slate roof slab `t` thick overhanging the
 * walls by `oh` at the eaves (per side: [v0 side, v1 side]) and `ohEnd` at
 * the gables. `walls: false` draws only the gables and roof (a loggia).
 */
export function house(o: {
  wall: Part | null; gable?: Part | null; roof: Part; axis: 'x' | 'y'
  u0: number; u1: number; v0: number; v1: number; z0?: number; eave: number; ridge: number
  oh?: number | [number, number]; ohEnd?: number | [number, number]; t?: number; ends?: [boolean, boolean]
}) {
  const M = (u: number, v: number, z: number): V3 => (o.axis === 'x' ? [u, v, z] : [v, u, z])
  const ax: V3 = o.axis === 'x' ? [1, 0, 0] : [0, 1, 0]
  const z0 = o.z0 ?? 0, t = o.t ?? 0.3
  const [oa, ob] = typeof o.oh === 'number' ? [o.oh, o.oh] : o.oh ?? [0.5, 0.5]
  const [ea, eb] = typeof o.ohEnd === 'number' ? [o.ohEnd, o.ohEnd] : o.ohEnd ?? [0.4, 0.4]
  const vc = (o.v0 + o.v1) / 2, uc = (o.u0 + o.u1) / 2, half = (o.v1 - o.v0) / 2
  const k = (o.ridge - o.eave) / half
  if (o.wall) board(o.wall, [[o.v0, z0], [o.v1, z0], [o.v1, o.eave], [o.v0, o.eave]], (s, z) => M(uc, s, z), ax, o.u1 - o.u0)
  const g = o.gable === undefined ? o.wall : o.gable
  const ends = o.ends ?? [true, true]
  if (g) {
    const tri: P2[] = [[o.v0, o.eave], [o.v1, o.eave], [vc, o.ridge - 0.05]]
    if (o.wall) board(g, tri, (s, z) => M(uc, s, z), ax, o.u1 - o.u0)
    else for (const [i, u] of [[0, o.u0], [1, o.u1]] as [number, number][]) if (ends[i]) board(g, tri, (s, z) => M(u + (i ? -0.08 : 0.08), s, z), ax, 0.16)
  }
  const U0 = o.u0 - ea, U1 = o.u1 + eb, um = (U0 + U1) / 2
  board(o.roof, [[o.v0 - oa, o.eave - oa * k], [vc, o.ridge], [vc, o.ridge + t], [o.v0 - oa, o.eave - oa * k + t]], (s, z) => M(um, s, z), ax, U1 - U0)
  board(o.roof, [[o.v1 + ob, o.eave - ob * k], [o.v1 + ob, o.eave - ob * k + t], [vc, o.ridge + t], [vc, o.ridge]], (s, z) => M(um, s, z), ax, U1 - U0)
  return { k, vc, uc, U0, U1, M }
}

/** Bargeboards: a band under each rake of a gable end at u, `w` deep. */
export function barge(p: Part, axis: 'x' | 'y', u: number, v0: number, v1: number, eave: number, ridge: number, oh: number, w = 0.4, out = 0) {
  const M = (s: number, z: number): V3 => (axis === 'x' ? [u + out, s, z] : [s, u + out, z])
  const ax: V3 = axis === 'x' ? [1, 0, 0] : [0, 1, 0]
  const vc = (v0 + v1) / 2, k = (ridge - eave) / ((v1 - v0) / 2)
  const a: P2 = [v0 - oh, eave - oh * k], b: P2 = [v1 + oh, eave - oh * k], c: P2 = [vc, ridge]
  const dz = w * Math.sqrt(1 + k * k)
  board(p, [a, c, b, [b[0], b[1] - dz], [vc, ridge - dz], [a[0], a[1] - dz]], M, ax, 0.12)
}

// ===========================================================================
// The Dairy
// ===========================================================================

function build() {
  const stone = new Part(), cream = new Part(), sage = new Part(), slate = new Part(), red = new Part(), win = new Part()

  // --- The stone house: walls to 3.7 m, a steep slate roof along x, ridge +8.3. ---
  const H = { x0: -9.8, x1: 10.2, y0: -0.4, y1: 7.85, eave: 3.7, ridge: 8.3 }
  house({ wall: stone, roof: slate, axis: 'x', u0: H.x0, u1: H.x1, v0: H.y0, v1: H.y1, eave: H.eave, ridge: H.ridge, oh: [0.95, 0.5], ohEnd: 0.45 })
  // Its wing to the NNE, ridge along y at +7.7, abutting the main roof.
  house({ wall: stone, roof: slate, axis: 'y', u0: 3.0, u1: 11.0, v0: -6.5, v1: 4.1, eave: H.eave, ridge: 7.7, oh: 0.5, ohEnd: [0, 0.45] })
  // Buff sandstone: a water table and quoins at the gable corners.
  for (const [x, y] of [[H.x0, H.y0], [H.x0, H.y1], [H.x1, H.y0], [H.x1, H.y1], [-6.5, 11.0], [4.1, 11.0]] as P2[]) box(cream, x - 0.32, y - 0.32, x + 0.32, y + 0.32, 0, H.eave - 0.2)
  box(stone, H.x0 - 0.08, H.y0 - 0.08, H.x1 + 0.08, H.y1 + 0.08, 0, 0.55)
  // A chimney on the NNE slope.
  box(stone, -2.6, 6.6, -1.6, 7.6, 5.0, 9.7)
  box(cream, -2.75, 6.45, -1.45, 7.75, 9.45, 9.75)
  // Windows: round-arched lights in buff surrounds. East gable: a broad
  // arched window and a small one in the gable; west gable: the same;
  // NNE wing end: a pointed window; long walls: paired lights.
  const lite = (cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, rise: number) => {
    opening(cream, cx, cy, nx, ny, w + 0.4, z0 - 0.15, z1 + 0.2, rise + 0.2, 0.03)
    opening(win, cx, cy, nx, ny, w, z0, z1, rise, 0.06)
  }
  for (const [x, nx] of [[H.x1, 1], [H.x0, -1]] as P2[]) {
    lite(x, 3.725, nx, 0, 1.7, 0.9, 3.4, 0.85)
    lite(x, 3.725, nx, 0, 0.7, 4.6, 5.9, 0.35)
  }
  lite(-1.2, 11.0, 0, 1, 1.3, 0.9, 3.3, 0.9)
  lite(-1.2, 11.0, 0, 1, 0.6, 4.4, 5.6, 0.3)
  for (const x of [-7.6, 6.9]) lite(x, H.y1, 0, 1, 1.0, 1.0, 3.0, 0.5)
  for (const x of [-8.3, 8.6]) lite(x, H.y0, 0, -1, 0.9, 1.0, 2.9, 0.45)
  // Red-brown bargeboards on the gables.
  barge(red, 'x', H.x1 + 0.45, H.y0, H.y1, H.eave, H.ridge, 0.5, 0.35, 0.02)
  barge(red, 'x', H.x0 - 0.45, H.y0, H.y1, H.eave, H.ridge, 0.5, 0.35, -0.02)
  barge(red, 'y', 11.45, -6.5, 4.1, H.eave, 7.7, 0.5, 0.35, 0.02)

  // --- The link between house and loggia: low stone walls, covered by both roofs' eaves. ---
  box(stone, -6.6, -2.3, 7.0, -0.4, 0, 3.0)

  // --- The loggia: open timber frame on a stone plinth, slate roof along x, ridge +8.2. ---
  const L = { x0: -9.8, x1: 9.8, y0: -9.0, y1: -2.3, eave: 3.0, ridge: 8.2 }
  house({ wall: null, gable: null, roof: slate, axis: 'x', u0: L.x0, u1: L.x1, v0: L.y0, v1: L.y1, eave: L.eave, ridge: L.ridge, oh: [0.55, 0.95], ohEnd: 0.5 })
  // Gable ends: cream boarding with a tall pointed arch over the path,
  // drawn as an opening cut through the board, with a sage arch rib.
  const ly = (L.y0 + L.y1) / 2
  for (const [x, s] of [[L.x0, -1], [L.x1, 1]] as P2[]) {
    const ring: P2[] = [[L.y0, L.eave], [ly - 2.1, L.eave], ...archPts(4.2, 6.2 - 2.6, 2.6, 6).reverse().map(([a, z]): P2 => [ly + a, z]), [ly + 2.1, L.eave], [L.y1, L.eave], [ly, L.ridge - 0.1]]
    board(cream, ring, (v, z) => [x + s * 0.1, v, z], [1, 0, 0], 0.2)
    const rib = [...archPts(4.5, 3.6, 2.85, 6)].map(([a, z]): P2 => [ly + a, z])
    const inner = [...archPts(4.2, 3.6, 2.6, 6)].reverse().map(([a, z]): P2 => [ly + a, z])
    board(sage, [...rib, ...inner], (v, z) => [x + s * 0.22, v, z], [1, 0, 0], 0.12)
    barge(red, 'x', x + s * 0.5, L.y0, L.y1, L.eave, L.ridge, 0.55, 0.4, 0.0)
  }
  // Two gabled bays on the SSW side, ridges along y at +6.0.
  for (const [u0, u1] of [[-6.7, -3.1], [2.9, 7.0]] as P2[]) {
    house({ wall: null, gable: cream, roof: slate, axis: 'y', u0: -11.0, u1: L.y0 + 1.5, v0: u0, v1: u1, eave: L.eave, ridge: 6.0, oh: 0.35, ohEnd: [0.35, 0], ends: [true, false] })
    barge(red, 'y', -11.4, u0, u1, L.eave, 6.0, 0.35, 0.3, -0.02)
    const c = (u0 + u1) / 2
    opening(sage, c, -11.0, 0, -1, (u1 - u0) * 0.62, 3.2, 5.2, (u1 - u0) * 0.31 + 0.3, 0.1)
  }
  // Posts (sage), a beam under the eave, a cream rail and stone plinth.
  const posts: P2[] = []
  for (let k = 0; k <= 8; k++) posts.push([L.x0 + (k * (L.x1 - L.x0)) / 8, L.y0])
  for (const x of [-6.7, -3.1, 2.9, 7.0]) posts.push([x, -11.0])
  for (const x of [L.x0, L.x1]) for (const y of [L.y0, ly - 2.1, ly + 2.1, L.y1]) posts.push([x, y])
  for (const [x, y] of posts) box(sage, x - 0.14, y - 0.14, x + 0.14, y + 0.14, 0.5, L.eave)
  // Beams round the open sides, with the ends of the bays.
  const beam = (x0: number, y0: number, x1: number, y1: number) => box(sage, Math.min(x0, x1) - 0.12, Math.min(y0, y1) - 0.12, Math.max(x0, x1) + 0.12, Math.max(y0, y1) + 0.12, L.eave - 0.35, L.eave)
  beam(L.x0, L.y0, L.x1, L.y0); beam(L.x0, L.y0, L.x0, L.y1); beam(L.x1, L.y0, L.x1, L.y1)
  for (const [u0, u1] of [[-6.7, -3.1], [2.9, 7.0]] as P2[]) { beam(u0, -11.0, u1, -11.0); beam(u0, -11.0, u0, L.y0); beam(u1, -11.0, u1, L.y0) }
  // Diagonal brackets under the beam: cream boards, one each side of a post.
  for (const [x, y] of posts) {
    const alongX = Math.abs(y - L.y0) < 0.01 || Math.abs(y + 11.0) < 0.01
    for (const s of [-1, 1]) {
      const pts: P2[] = [[0, L.eave - 1.25], [0.14, L.eave - 1.25], [s * 0.85 + 0.07, L.eave - 0.35], [s * 0.85 - 0.12, L.eave - 0.35]]
      board(cream, pts.map(([a, z]): P2 => [a - 0.07, z]), (a, z) => (alongX ? [x + a, y, z] : [x, y + a, z]), alongX ? [0, 1, 0] : [1, 0, 0], 0.1)
    }
  }
  // Plinth and rail: the SSW side and both bays; the ends stay open for the path.
  const rail = (x0: number, y0: number, x1: number, y1: number) => {
    box(stone, Math.min(x0, x1) - 0.2, Math.min(y0, y1) - 0.2, Math.max(x0, x1) + 0.2, Math.max(y0, y1) + 0.2, 0, 0.5)
    box(cream, Math.min(x0, x1) - 0.06, Math.min(y0, y1) - 0.06, Math.max(x0, x1) + 0.06, Math.max(y0, y1) + 0.06, 0.5, 1.15)
  }
  rail(L.x0, L.y0, -6.7, L.y0); rail(-3.1, L.y0, 2.9, L.y0); rail(7.0, L.y0, L.x1, L.y0)
  for (const [u0, u1] of [[-6.7, -3.1], [2.9, 7.0]] as P2[]) { rail(u0, -11.0, u1, -11.0); rail(u0, -11.0, u0, L.y0); rail(u1, -11.0, u1, L.y0) }
  rail(L.x0, L.y0, L.x0, ly - 2.1); rail(L.x1, L.y0, L.x1, ly - 2.1); rail(L.x0, ly + 2.1, L.x0, L.y1); rail(L.x1, ly + 2.1, L.x1, L.y1)
  // A dark back wall under the roof so the open loggia reads as a room, not a hole.
  box(stone, -6.6, L.y1 - 0.3, 7.0, L.y1, 0, L.eave)
  for (const x of [-4.5, -1.5, 1.5, 4.5]) opening(win, x, L.y1 - 0.3, 0, -1, 1.1, 0.9, 2.5, 0, 0.05)

  // --- The lantern on the loggia ridge: a square base, an open cream stage
  // with round openings, a sage cornice and a tall slate spire. ---
  const cx = 0, cy = ly, r = 0.72
  box(slate, cx - r, cy - r, cx + r, cy + r, L.ridge - 1.0, L.ridge + 0.6)
  box(cream, cx - r + 0.05, cy - r + 0.05, cx + r - 0.05, cy + r - 0.05, L.ridge + 0.6, L.ridge + 3.0)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as P2[]) {
    const ox = cx + nx * (r - 0.05), oy = cy + ny * (r - 0.05)
    opening(win, ox, oy, nx, ny, 0.95, L.ridge + 1.3, L.ridge + 2.6, 0.475, 0.03)
    opening(sage, ox, oy, nx, ny, 1.5, L.ridge + 0.62, L.ridge + 0.95, 0, 0.03)
  }
  box(sage, cx - r - 0.12, cy - r - 0.12, cx + r + 0.12, cy + r + 0.12, L.ridge + 3.0, L.ridge + 3.25)
  const sp: P2[] = Array.from({ length: 8 }, (_, i): P2 => [cx + (r + 0.05) * 1.08 * Math.cos(Math.PI / 8 + (i * Math.PI) / 4), cy + (r + 0.05) * 1.08 * Math.sin(Math.PI / 8 + (i * Math.PI) / 4)])
  const z0 = L.ridge + 3.25, apex: V3 = [cx, cy, 13.4]
  for (let i = 0; i < 8; i++) { const a = sp[i], b = sp[(i + 1) % 8]; slate.tri([a[0], a[1], z0], [b[0], b[1], z0], apex) }
  box(sage, cx - 0.05, cy - 0.05, cx + 0.05, cy + 0.05, 13.3, 13.8)

  finishModel('The Dairy', 'nyc-cp-dairy', [
    { part: stone, material: { name: 'schist', color: 0x9a9893, roughness: 0.9 } },
    { part: cream, material: { name: 'cream', color: 0xe9dcae, roughness: 0.8 } },
    { part: sage, material: { name: 'sage', color: 0x8c9a7a, roughness: 0.8 } },
    { part: slate, material: { name: 'slate', color: 0x86817d, roughness: 0.8 } },
    { part: red, material: { name: 'bargeboard', color: 0xa95d43, roughness: 0.8 } },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  ], { bearing: 28.7, osm: 'way/265347588', height: 13.8 }, 5000)
}

if (import.meta.main) build()
