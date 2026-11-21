/**
 * The White Stag sign ("Portland Oregon", 1940; this wording since 2010) on
 * the White Stag Building (1907), Old Town, Portland, Oregon: procedural,
 * CC0-1.0, no textures.
 * bun generators/pdx-white-stag-sign.ts
 *
 * Portland's best-known sign stands on a steel frame on the roof of the
 * brick White Stag Building, part of the White Stag Block, at the west end
 * of the Burnside Bridge, facing east over Naito Parkway and the river: a leaping white
 * stag over the outline of Oregon in yellow neon, "Portland" and "Oregon"
 * in white script of bulbs, and "OLD TOWN" in white capitals on a red panel
 * at its foot. The building is drawn plainly; the sign is the landmark, so
 * its lettering is modelled (STYLE.md, famous signs), traced from the
 * face-on photo with lettering.ts.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 356.5 (the
 * outline's long edges), so +x is roughly east and the sign faces +x.
 * Origin: the area centroid of OSM way/39336112. z = 0 is Naito Parkway's
 * level on the east side, the lowest ground; Burnside Street on the south
 * side climbs onto the bridge about 7 m higher and that side of the base
 * sinks into it.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/39336112 (White Stag Building,
 *   5 levels), no parts. The cream cast-iron Bickel Block north of it
 *   (way/246961528) and the Skidmore Block west of it are separate and not
 *   modelled.
 * - Lidar (measured): USGS 3DEP OR_OLCMetro_2019 (flown 2019), 0.5 m, read in
 *   this frame with tools/lidar_frame.py, heights above Naito (ground_min):
 *   the roof 20.5-21 m (rooftop plant to 24 m, left out), parapet 21.6 m; the sign a plane at x = 12-15 from
 *   y = -17 to y = 0, its top (the antlers) 38 m; the water tank in the
 *   north-west corner about 6.4 m across, to 35 m.
 * - Photos (evidence, Wikimedia Commons):
 *   - Schwerdf, "White Stag Sign 2025-04-05.jpg", CC BY 4.0 (the sign face
 *     on, by day: every traced shape, the letters, the frame, colours):
 *     https://commons.wikimedia.org/wiki/File:White_Stag_Sign_2025-04-05.jpg
 *   - Steve Morgan, "Portland Oregon - White Stag sign.jpg", CC BY-SA 3.0
 *     (the sign in its setting):
 *     https://commons.wikimedia.org/wiki/File:Portland_Oregon_-_White_Stag_sign.jpg
 *   - Visitor7, "White Stag Block-1.jpg", CC BY-SA 3.0 (the building's brick
 *     fronts and window rhythm, the sign's height over the roof):
 *     https://commons.wikimedia.org/wiki/File:White_Stag_Block-1.jpg
 *   - Steve Morgan, "White Stag sign (night).jpg", CC BY-SA 3.0 (the older
 *     "White Stag Sportswear" wording at night: which parts glow and in
 *     what colour; the stag and outline are unchanged):
 *     https://commons.wikimedia.org/wiki/File:White_Stag_sign_(night).jpg
 *
 * Numbers
 * - Measured (lidar): roof, parapet, sign plane, sign top, tank.
 * - From the photos: storefronts to 3.8 m, four floors of punched windows
 *   (1.5 m wide, 2.2 m tall) about 3.3 m apart.
 * - Traced (face-on photo, scaled to the lidar's 16 m width and 38 m top):
 *   the Oregon outline, the stag, the script, OLD TOWN and its panel.
 * - Estimated: the frame's post and rail spacing and its raking struts
 *   (drawn sparser than the real lattice); the window bays.
 * - The script's dark green edging is a wider steel-grey stroke behind
 *   each letter.
 * - Left out: the bulbs (the script is solid white strokes), the stag's red
 *   edge, the antenna mast, the building's cornice detail and storefronts'
 *   arches.
 *
 * Night: the stag and script are white neon (bulbs), the outline yellow
 *   neon, the OLD TOWN panel red neon with white neon letters; the windows
 *   glow.
 *
 * Doubts
 * - The script is traced as centre-lines of even width; the real letters
 *   swell and thin. The OLD TOWN letters by day are white on the red panel;
 *   at night the whole panel reads red.
 * - The building's west and north fronts are drawn like the east front.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { strokes, type Pt } from './lettering'

// ------------------------------------------------------------ helpers ---
// Map frame: x east, y north, z up, metres (mesh.ts converts on write).
type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A polygon facing `n`, fanned from its first corner (convex or star-shaped from it). */
function poly(p: Part, P: V3[], n: V3) {
  let f: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    f = [f[0] + c[0], f[1] + c[1], f[2] + c[2]]
  }
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}

/** Signed area of a ring (positive = counter-clockwise). */
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())

/** A rectangle with its corners cut by `c`, counter-clockwise. */
function crect(x0: number, y0: number, x1: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

/** A vertical prism over a ring, with optional caps (the top fanned; keep it convex). */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0, top = true, bottom = false) =>
  prism(p, crect(x0, y0, x1, y1, c), z0, z1, top, bottom)

/** A regular polygon ring (n sides) of circumradius r about (cx, cy), starting at angle a0. */
const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (2 * Math.PI * k) / n), cy + r * Math.sin(a0 + (2 * Math.PI * k) / n)] as XY)

/**
 * A flat panel on a wall: `o` the wall point at the panel's centre line,
 * `t` the unit direction along the wall (reader's right), `n` the outward
 * normal. `arch` puts a true semicircle on top (radius w / 2).
 */
function panel(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, arch = false, off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  if (!arch) return poly(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], nn)
  const r = w / 2, zs = z1 - r
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  for (let k = 0; k <= 10; k++) {
    const a = (k / 10) * Math.PI
    pts.push(at(r * Math.cos(a), zs + r * Math.sin(a)))
  }
  poly(p, pts, nn)
}

/** A shallow block standing proud of a wall (a pier, a surround, a band): depth d. */
function slabOn(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, d: number) {
  const P = (s: number, k: number): XY => [o[0] + t[0] * s + n[0] * k, o[1] + t[1] * s + n[1] * k]
  prism(p, [P(-w / 2, -0.02), P(w / 2, -0.02), P(w / 2, d), P(-w / 2, d)], z0, z1, true)
}

/** A wall segment from a to b with its outward normal (for a ring wound counter-clockwise). */
function seg(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { a, b, L, t, n: [t[1], -t[0]] as XY, at: (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s] }
}

/**
 * A gabled roof over the rectangle x0..x1, y0..y1 with its ridge along x
 * (`alongX`) or y; eaves at `ze`, ridge at `zr`; `over` the eave overhang.
 * The gable triangles go to `gable` (a wall material) when given.
 */
function gableRoof(roof: Part, gable: Part | null, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, alongX: boolean, over = 0.4) {
  if (alongX) {
    const ym = (y0 + y1) / 2
    poly(roof, [[x0 - over, y0 - over, ze], [x1 + over, y0 - over, ze], [x1 + over, ym, zr], [x0 - over, ym, zr]], [0, -1, 1])
    poly(roof, [[x1 + over, y1 + over, ze], [x0 - over, y1 + over, ze], [x0 - over, ym, zr], [x1 + over, ym, zr]], [0, 1, 1])
    if (gable) {
      poly(gable, [[x0, y0, ze], [x0, y1, ze], [x0, ym, zr]], [-1, 0, 0])
      poly(gable, [[x1, y0, ze], [x1, y1, ze], [x1, ym, zr]], [1, 0, 0])
    }
    // undersides of the overhang
    poly(roof, [[x0 - over, y0 - over, ze], [x1 + over, y0 - over, ze], [x1 + over, ym, zr], [x0 - over, ym, zr]], [0, 1, -1])
    poly(roof, [[x1 + over, y1 + over, ze], [x0 - over, y1 + over, ze], [x0 - over, ym, zr], [x1 + over, ym, zr]], [0, -1, -1])
  } else {
    const xm = (x0 + x1) / 2
    poly(roof, [[x0 - over, y1 + over, ze], [x0 - over, y0 - over, ze], [xm, y0 - over, zr], [xm, y1 + over, zr]], [-1, 0, 1])
    poly(roof, [[x1 + over, y0 - over, ze], [x1 + over, y1 + over, ze], [xm, y1 + over, zr], [xm, y0 - over, zr]], [1, 0, 1])
    if (gable) {
      poly(gable, [[x0, y0, ze], [x1, y0, ze], [xm, y0, zr]], [0, -1, 0])
      poly(gable, [[x0, y1, ze], [x1, y1, ze], [xm, y1, zr]], [0, 1, 0])
    }
    poly(roof, [[x0 - over, y1 + over, ze], [x0 - over, y0 - over, ze], [xm, y0 - over, zr], [xm, y1 + over, zr]], [1, 0, -1])
    poly(roof, [[x1 + over, y0 - over, ze], [x1 + over, y1 + over, ze], [xm, y1 + over, zr], [xm, y0 - over, zr]], [-1, 0, -1])
  }
}

/** A hipped roof over a rectangle: the ridge runs along the long side. */
function hipRoof(roof: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, h = y1 - y0
  if (w >= h) {
    const ym = (y0 + y1) / 2, d = h / 2
    const A: V3 = [x0 + d, ym, zr], B: V3 = [x1 - d, ym, zr]
    poly(roof, [[x0, y0, ze], [x1, y0, ze], B, A], [0, -1, 1])
    poly(roof, [[x1, y1, ze], [x0, y1, ze], A, B], [0, 1, 1])
    poly(roof, [[x1, y0, ze], [x1, y1, ze], B], [1, 0, 1])
    poly(roof, [[x0, y1, ze], [x0, y0, ze], A], [-1, 0, 1])
  } else {
    const xm = (x0 + x1) / 2, d = w / 2
    const A: V3 = [xm, y0 + d, zr], B: V3 = [xm, y1 - d, zr]
    poly(roof, [[x1, y0, ze], [x1, y1, ze], B, A], [1, 0, 1])
    poly(roof, [[x0, y1, ze], [x0, y0, ze], A, B], [-1, 0, 1])
    poly(roof, [[x0, y0, ze], [x1, y0, ze], A], [0, -1, 1])
    poly(roof, [[x1, y1, ze], [x0, y1, ze], B], [0, 1, 1])
  }
}

/** A dome (half ellipsoid) of radius r and height h over (cx, cy, z0), n around, m up. */
function dome(p: Part, cx: number, cy: number, z0: number, r: number, h: number, n = 16, m = 5) {
  const ring = (k: number): V3[] => {
    const a = (k / m) * (Math.PI / 2), rr = r * Math.cos(a), z = z0 + h * Math.sin(a)
    return Array.from({ length: n }, (_, i) => [cx + rr * Math.cos((2 * Math.PI * i) / n), cy + rr * Math.sin((2 * Math.PI * i) / n), z] as V3)
  }
  for (let k = 0; k < m; k++) {
    const A = ring(k), B = ring(k + 1)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (k === m - 1) p.tri(A[i], A[j], B[i])
      else p.quad(A[i], A[j], B[j], B[i])
    }
  }
}

/** A ring offset outward by d (inward when negative), mitred; the ring counter-clockwise. */
function offset(ring: XY[], d: number): XY[] {
  const r = ccw(ring), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const t1 = norm2([p[0] - a[0], p[1] - a[1]]), t2 = norm2([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [t1[1], -t1[0]], n2: XY = [t2[1], -t2[0]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k] as XY
  })
}
function norm2(v: XY): XY { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A projecting band (cornice, string course) round a ring: its face d out, top and soffit strips. */
function band(p: Part, ring: XY[], d: number, z0: number, z1: number) {
  const a = ccw(ring), o = offset(a, d), n = a.length
  prism(p, o, z0, z1, false)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    poly(p, [[a[i][0], a[i][1], z1], [a[j][0], a[j][1], z1], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1]], [0, 0, 1])
    poly(p, [[a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0]], [0, 0, -1])
  }
}

/** A parapet (or balustrade) of thickness th standing on a ring from z0 to z1. */
function parapet(p: Part, ring: XY[], th: number, z0: number, z1: number) {
  const a = ccw(ring), inner = offset(a, -th), n = a.length
  prism(p, a, z0, z1, false)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const t = norm2([a[j][0] - a[i][0], a[j][1] - a[i][1]])
    poly(p, [[inner[j][0], inner[j][1], z0], [inner[i][0], inner[i][1], z0], [inner[i][0], inner[i][1], z1], [inner[j][0], inner[j][1], z1]], [-t[1], t[0], 0])
    poly(p, [[inner[i][0], inner[i][1], z1], [a[i][0], a[i][1], z1], [a[j][0], a[j][1], z1], [inner[j][0], inner[j][1], z1]], [0, 0, 1])
  }
}

/** An arc of points about (cx, cy), radius r, from angle a0 to a1 (radians), n segments. */
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => { const a = a0 + ((a1 - a0) * k) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY })

// ------------------------------------------------------------ helpers 2 ---
/** A square-section beam from a to b, half-width r. */
function beam(p: Part, a: V3, b: V3, r: number) {
  const d = sub(b, a), L = Math.hypot(d[0], d[1], d[2]), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let e1 = cross(t, up); const l1 = Math.hypot(...e1); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1]
  const e2 = cross(t, e1)
  const c = (o: V3, i: number): V3 => { const s1 = i === 0 || i === 3 ? -r : r, s2 = i < 2 ? -r : r; return [o[0] + e1[0] * s1 + e2[0] * s2, o[1] + e1[1] * s1 + e2[1] * s2, o[2] + e1[2] * s1 + e2[2] * s2] }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, A = c(a, i), B = c(a, j), m: V3 = [(A[0] + B[0]) / 2 - a[0], (A[1] + B[1]) / 2 - a[1], (A[2] + B[2]) / 2 - a[2]]
    poly(p, [A, B, c(b, j), c(b, i)], m)
  }
}

/** Ear-clipping triangulation of a simple polygon (u, v), returning index triples. */
function earcut(P: number[][]): number[][] {
  const idx = P.map((_, i) => i), out: number[][] = []
  const ar = P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  if (ar < 0) idx.reverse()
  const cr = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = P[i0], b = P[i1], c = P[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let inside = false
      for (const m of idx) {
        if (m === i0 || m === i1 || m === i2) continue
        const q = P[m]
        if (cr(a, b, q) >= 0 && cr(b, c, q) >= 0 && cr(c, a, q) >= 0) { inside = true; break }
      }
      if (inside) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat shape in the sign's plane (u, v metres), standing w0..w1 out of it. */
function solid(p: Part, S: number[][], w0: number, w1: number) {
  const tris = earcut(S)
  const F = S.map(([u, v]) => place(u, v, w1)), B = S.map(([u, v]) => place(u, v, w0))
  const out = sub(place(0, 0, 1), place(0, 0, 0))
  for (const [a, b, c] of tris) { poly(p, [F[a], F[b], F[c]], out); poly(p, [B[a], B[b], B[c]], [-out[0], -out[1], -out[2]]) }
  const cx = S.reduce((s, q) => s + q[0], 0) / S.length, cy = S.reduce((s, q) => s + q[1], 0) / S.length
  for (let i = 0; i < S.length; i++) {
    const j = (i + 1) % S.length
    const du = S[j][0] - S[i][0], dv = S[j][1] - S[i][1]
    // outward edge normal in (u, v): pick the side away from the polygon's interior by winding
    const nr = earSign(S) * 1
    const n2 = sub(place(S[i][0] + dv * nr, S[i][1] - du * nr, 0), place(S[i][0], S[i][1], 0))
    poly(p, [B[i], B[j], F[j], F[i]], n2)
    void cx; void cy
  }
}
const earSign = (S: number[][]) => (S.reduce((s, p, i) => { const q = S[(i + 1) % S.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) >= 0 ? 1 : -1)

// ------------------------------------------------------------ the model ---
const brick = new Part()   // the White Stag Building's red brick
const win = new Part()     // its windows
const steel = new Part()   // the sign's frame, the cornice, roof, water tank
const white = new Part()   // neon: the stag and the script letters (bulbs, white by day)
const yellow = new Part()  // neon: the Oregon outline tube

// --- the building: five storeys of brick on the OSM outline, flat roof.
const red = new Part()     // neon: the OLD TOWN panel
const RING: XY[] = [[-15.3, 18.8], [-15.6, 12.2], [-16.3, -3.2], [-14.7, -3.3], [-15.0, -16.8], [15.2, -19.7], [15.3, 17.4]]
const ROOF = 20.5, PARA = 21.6
function flat(p: Part, ring: XY[], z: number) {
  const r = ccw(ring)
  for (const [a, b, c] of earcut(r)) poly(p, [[r[a][0], r[a][1], z], [r[b][0], r[b][1], z], [r[c][0], r[c][1], z]], [0, 0, 1])
}
prism(brick, RING, 0, PARA, false)
band(steel, RING, 0.25, PARA - 0.6, PARA)
flat(steel, RING, ROOF)
// Windows, one panel per window: a storefront row, then punched windows
// floor by floor (square-headed in the brick, round-headed in the cream).
function windows(ring: XY[], rows: number[][], step0: number, w: number, arch: boolean, skipShared: boolean) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skipShared && Math.abs(a[1] - 3) < 0.01 && Math.abs(b[1] - 3) < 0.01) continue
    const sg = seg(a, b)
    if (sg.L < 4) continue
    const n = Math.round(sg.L / step0), step = sg.L / n
    for (let k = 0; k < n; k++) {
      const o = sg.at(step * (k + 0.5))
      panel(win, o, sg.t, sg.n, step - 0.9, 0.9, 3.8)
      for (const [z0, z1] of rows) panel(win, o, sg.t, sg.n, w, z0, z1, arch)
    }
  }
}
windows(RING, [[5.4, 7.6], [9.3, 11.5], [13.2, 15.4], [17.0, 19.2]], 3.3, 1.5, false, false)

// --- the water tank in the roof's north-west corner (lidar: 6.4 m across, to
// 35 m), copper-brown wood like the brick
{
  const CX = -11.1, CY = 15.4
  for (const [dx, dy] of [[-2, -2], [2, -2], [2, 2], [-2, 2]]) box(steel, CX + dx - 0.2, CY + dy - 0.2, CX + dx + 0.2, CY + dy + 0.2, ROOF, 26.6, 0, false)
  prism(brick, ngon(CX, CY, 3.2, 12), 26.6, 33.4, true, true)
  const tip: V3 = [CX, CY, 35.4], R = ngon(CX, CY, 3.4, 12)
  for (let i = 0; i < 12; i++) { const a = R[i], b = R[(i + 1) % 12]; poly(steel, [[a[0], a[1], 33.4], [b[0], b[1], 33.4], tip], [a[0] + b[0] - 2 * CX, a[1] + b[1] - 2 * CY, 1]) }
}

// --- the sign. Traced from Schwerdf's face-on photo (960 x 1200 px):
// photo x → u (to the reader's right, +y here), photo y → z, scaled to the
// lidar: 16 m across the frame, the antler tips at 38 m, the panel's foot
// on the parapet. The face looks east (+x) at x = XS.
const XS = 14.4, YC = -8.8
const U = (px: number) => (px - 480) * 0.0184
const Z = (py: number) => PARA + (1160 - py) * 0.0158
const place = (u: number, v: number, w: number): V3 => [XS + w, YC + u, v]
const P = (px: number, py: number): Pt => [U(px), Z(py)]
// pen paths in photo pixels, converted
function pen(paths: number[][][]) { return paths.map((p) => p.map(([x, y]) => P(x, y))) }
function curve(pts: number[][], n = 4): number[][] {
  // Catmull-Rom through the traced points, n steps a span
  const out: number[][] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)))
    }
  }
  out.push(pts[pts.length - 1])
  return out
}
const ring = (cx: number, cy: number, rx: number, ry: number, n = 12) =>
  Array.from({ length: n + 1 }, (_, k) => [cx + rx * Math.cos((2 * Math.PI * k) / n), cy + ry * Math.sin((2 * Math.PI * k) / n)])

// The frame: posts, rails and raking struts back to the roof.
{
  const posts = [-7.6, -4.6, -1.6, 1.4, 4.4, 7.4]
  for (const u of posts) box(steel, XS - 0.55, YC + u - 0.13, XS - 0.3, YC + u + 0.13, ROOF, 34.0, 0, true)
  for (let z = 23.0; z <= 33.6; z += 2.1) box(steel, XS - 0.6, YC - 7.9, XS - 0.4, YC + 7.7, z, z + 0.22, 0, true, true)
  for (const u of posts) beam(steel, [XS - 0.45, YC + u, 31.5], [XS - 4.4, YC + u, ROOF], 0.12)
  for (const u of [-7.6, 7.4]) beam(steel, [XS - 0.45, YC + u, 23.0], [XS - 0.45, YC + u * 0.2, 33.6], 0.1)
}

// The Oregon outline, a yellow neon tube: coast, Columbia River, Snake River, the
// state line, broken by the OLD TOWN panel along the bottom.
const OREGON = [
  [185, 1125], [55, 1125], [45, 1080], [40, 1020], [35, 920], [40, 820], [48, 720], [58, 620], [62, 520], [60, 430], [45, 345],
  [60, 345], [120, 350], [165, 368], [185, 400], [200, 440], [225, 478], [260, 490], [330, 488], [400, 478], [450, 462],
  [560, 440], [680, 418], [780, 400], [860, 393], [875, 400], [885, 420], [900, 440], [915, 455], [905, 470], [900, 520],
  [885, 560], [870, 600], [858, 660], [862, 700], [880, 735], [868, 780], [870, 850], [862, 960], [865, 1120], [740, 1120],
]
strokes(yellow, pen([OREGON]), { width: 0.32, depth: 0.3, back: true, place })

// The stag, leaping toward the reader's right: built of broad strokes.
const STAG: Array<[number, number[][]]> = [
  [0.95, [[470, 425], [560, 395], [650, 370], [740, 392]]],          // body, rump to chest
  [0.75, [[700, 380], [640, 300], [622, 250]]],                      // neck
  [0.5, [[600, 215], [640, 220], [684, 226]]],                       // head and muzzle
  [0.32, [[745, 400], [775, 402], [778, 412]]],                      // foreleg, reaching
  [0.3, [[720, 420], [685, 455], [650, 498]]],                       // foreleg, folded down
  [0.32, [[480, 430], [430, 520], [400, 580], [378, 620]]],          // hind leg, trailing
  [0.35, [[470, 410], [430, 380], [402, 350]]],                      // the other hind leg, kicked up
  [0.26, [[598, 205], [545, 178], [490, 155], [442, 140]]],          // antlers
  [0.26, [[600, 200], [570, 168], [530, 145], [508, 134]]],
  [0.26, [[606, 200], [614, 168], [612, 135]]],
]
// The stag is a solid white silhouette (traced outline), antlers as strokes.
const STAG_OUT = [
  [402, 342], [425, 352], [458, 392], [520, 378], [570, 352], [595, 315], [588, 262], [578, 232], [600, 205], [635, 212],
  [682, 222], [672, 236], [645, 246], [648, 290], [675, 330], [700, 375], [772, 388], [778, 410], [730, 418], [700, 445],
  [668, 492], [652, 500], [650, 490], [678, 446], [655, 440], [600, 448], [530, 458], [480, 468], [455, 505], [420, 565],
  [378, 628], [368, 622], [400, 560], [430, 500], [447, 452], [440, 420], [415, 380], [398, 352],
].map(([x, y]) => P(x, y))
solid(white, STAG_OUT, 0.15, 0.5)
for (const [w, p] of STAG.slice(7)) strokes(white, pen([curve(p, 3)]), { width: w, depth: 0.35, back: true, place: (u, v, d) => place(u, v, d + 0.15) })

// "Portland" and "Oregon", the script letters, traced as centre-lines.
const SCRIPT: number[][][] = [
  // Portland
  [[88, 640], [130, 598], [200, 588], [244, 628], [228, 690], [168, 728], [130, 742]],   // P bowl with its lead-in
  [[160, 615], [140, 730], [122, 845]],                                               // P stem
  ring(285, 745, 38, 52),                                                              // o
  [[335, 790], [342, 712], [370, 692], [398, 700]],                                    // r
  [[440, 585], [420, 690], [412, 770], [440, 770]],                                    // t stem
  [[395, 650], [470, 640]],                                                            // t bar
  [[470, 770], [500, 640], [530, 525], [512, 520], [492, 620], [484, 740], [510, 745]], // l, looped
  ring(565, 668, 36, 44),                                                              // a bowl
  [[602, 628], [594, 712], [618, 712]],                                                // a stem
  [[632, 712], [645, 632], [682, 612], [702, 632], [690, 705], [712, 705]],            // n
  ring(745, 622, 36, 44),                                                              // d bowl
  [[782, 640], [810, 540], [848, 442]],                                                // d ascender
  // Oregon
  ring(292, 930, 52, 100, 14),                                                         // O
  [[300, 830], [250, 810], [228, 860]],                                                // O's swash
  [[368, 985], [372, 908], [402, 888], [432, 900]],                                    // r
  [[440, 945], [492, 918], [478, 880], [446, 902], [452, 958], [494, 962]],            // e
  ring(540, 918, 34, 40),                                                              // g bowl
  [[574, 895], [566, 965], [552, 1012], [516, 1012]],                                  // g descender
  ring(632, 886, 36, 40),                                                              // o
  [[680, 925], [690, 852], [730, 830], [762, 846], [752, 912], [790, 905]],            // n
]
const SCRIPT_P = pen(SCRIPT.map((p) => (p.length > 8 ? p : curve(p, 3))))
strokes(white, SCRIPT_P, { width: 0.72, depth: 0.4, place: (u, v, d) => place(u, v, d + 0.1) })
// the letters' dark green edging, as a wider stroke behind them
strokes(steel, SCRIPT_P, { width: 1.0, depth: 0.3, back: true, place: (u, v, d) => place(u, v, d - 0.05) })

// OLD TOWN: a red panel with rounded ends, white sans-serif capitals.
{
  const u0 = U(185), u1 = U(740), z0 = Z(1160), z1 = Z(1090), r = (z1 - z0) / 2, zc = (z0 + z1) / 2
  const outline: XY[] = [...arcPts(u1 - r, zc, r, -Math.PI / 2, Math.PI / 2, 6), ...arcPts(u0 + r, zc, r, Math.PI / 2, (3 * Math.PI) / 2, 6)]
  // as a prism in the sign's plane: build in (u, z) then map
  const front = outline.map(([u, z]) => place(u, z, 0.35)), back = outline.map(([u, z]) => place(u, z, 0))
  poly(red, front, [1, 0, 0]); poly(red, back, [-1, 0, 0])
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length
    poly(red, [back[i], back[j], front[j], front[i]], [0, outline[i][0] + outline[j][0] - u0 - u1, outline[i][1] + outline[j][1] - 2 * zc])
  }
  const L: number[][][] = [
    ring(270, 1121, 22, 24),                                   // O
    [[316, 1097], [316, 1145], [348, 1145]],                    // L
    [[364, 1097], [364, 1145], [380, 1145], [398, 1132], [398, 1110], [380, 1097], [364, 1097]], // D
    [[460, 1097], [500, 1097]], [[480, 1097], [480, 1145]],     // T
    ring(540, 1121, 22, 24),                                   // O
    [[575, 1097], [588, 1145], [602, 1112], [616, 1145], [629, 1097]], // W
    [[650, 1145], [650, 1097], [684, 1145], [684, 1097]],      // N
  ]
  strokes(white, pen(L), { width: 0.24, depth: 0.12, place: (u, v, d) => place(u, v, d + 0.35) })
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: brick, material: finish('ws-red-brick', 0xb0624f) },
  { part: win, material: PALETTE.window },
  { part: steel, material: finish('ws-steel', 0x6d7176) },
  { part: white, material: finish('neon-ws-bulbs', 0xf5f1e6) },
  { part: yellow, material: finish('neon-ws-yellow', 0xe9c25a) },
  { part: red, material: finish('neon-ws-red', 0xb83a34) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('White Stag sign', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 356.5, elevation: 0, height: 38.0,
})
await Bun.write(new URL('../models/pdx-white-stag-sign.glb', import.meta.url), glb)
console.log(`pdx-white-stag-sign.glb: ${triangles} triangles, ${glb.length} bytes`)
