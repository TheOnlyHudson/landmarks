/**
 * Central Library, Multnomah County Library (1913, A. E. Doyle), Portland,
 * Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-central-library.ts
 *
 * A Georgian Revival library filling the block between SW 10th and 11th
 * Avenues and Yamhill and Taylor Streets: a rusticated grey stone ground
 * floor, two floors of red brick above it (tall round-headed windows lighting
 * the main floor, short windows over them), stone-faced pavilions at the four
 * corners, an inscribed frieze, a deep cornice and a stone balustrade round a
 * flat roof. The main entrance is in the middle of the 10th Avenue front.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 20.8 (the
 * downtown grid; the outline's edges), so +y runs up the avenues and +x
 * toward 10th Avenue. Origin: the area centroid of OSM way/32499299 (the
 * outline). z = 0 is the lowest ground (the north-west corner); the block
 * slopes up about 3 m toward Taylor Street and the base sinks into it.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/32499299, 3 levels, no parts.
 * - Lidar (measured): USGS 3DEP OR_OLCMetro_2019 (flown 2019), 1 m, read in
 *   this frame with tools/lidar_frame.py, heights above the lowest ground
 *   (3.4 m in the grid): balustrade 22.3 m, the flat roof 20.1 m, a block
 *   on the roof about 15 x 15 m west of the middle reaching 29 m (6-9 m over
 *   the roof), smaller skylights; ground from 3.4 m (north-west) to 6.8 m
 *   (south-west).
 * - Photos (evidence, Wikimedia Commons):
 *   - Parhamr, "Central Library (Portland, Oregon).jpg", CC BY-SA 3.0
 *     (own work; the author offers a choice of licences): the
 *     10th Avenue and Yamhill corner: the stone pavilion, the window rows,
 *     the frieze, cornice and balustrade, colours:
 *     https://commons.wikimedia.org/wiki/File:Central_Library_(Portland,_Oregon).jpg
 *   - Steve Morgan, "Central Library of Portland Oregon with streetcar
 *     (2016).jpg", CC BY-SA 4.0 (the same corner from further along 10th
 *     Avenue: storey heights, the arched windows):
 *     https://commons.wikimedia.org/wiki/File:Central_Library_of_Portland_Oregon_with_streetcar_(2016).jpg
 *
 * Numbers
 * - Measured (lidar): roof, balustrade and roof block heights above.
 * - From the photos, scaled to the 22.3 m balustrade: the ground floor to
 *   7.5 m; the round-headed windows 8.2-13.6 m, 2.3 m wide; the top floor
 *   windows 14.9-16.7 m; the frieze from 17.4 m, the cornice to 20.3 m.
 *   Corner pavilions about 6 m along each face; bays about 4.3 m.
 * - Estimated: the 10th Avenue entrance (an arched doorway and steps in the
 *   middle bay; no photo of it was used); the other three fronts drawn like
 *   the two photographed ones; the roof block's hipped top.
 * - Brief said hipped roof; the photos and lidar show a flat roof behind
 *   the balustrade, so it is flat.
 * - Left out: the inscription, the window tracery and balconies, the
 *   ground-floor railings and planters.
 *
 * Night: the windows glow; no floodlighting in the photos.
 *
 * Doubts
 * - Only the north-east corner was photographed; the 10th Avenue entrance
 *   and the 11th Avenue and Taylor Street fronts are inferred.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

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

// ------------------------------------------------------------ the model ---
const brick = new Part()   // red brick, the two upper floors
const stone = new Part()   // grey stone: the rusticated ground floor, the corner pavilions, the frieze
const trim = new Part()    // string courses, cornice, balustrade, surrounds
const roof = new Part()    // roofs
const win = new Part()     // windows
const door = new Part()    // the entrance doors

const X0 = -24.2, X1 = 24.2, Y0 = -26.6, Y1 = 26.7
const GROUND = 7.5, FRIEZE = 17.4, CORN = 20.3, BAL = 22.2
const RING = crect(X0, Y0, X1, Y1, 0.3)
prism(stone, RING, 0, GROUND, false)
prism(brick, RING, GROUND, FRIEZE, false)
prism(stone, RING, FRIEZE, CORN, false)
band(trim, RING, 0.2, 0, 1.0)                    // plinth
band(trim, RING, 0.18, GROUND - 0.5, GROUND)      // the string course and sill band
band(trim, RING, 0.7, CORN - 1.1, CORN)           // the cornice
parapet(trim, offset(RING, 0.25), 0.45, CORN, BAL)
poly(roof, RING.map(([x, y]) => [x, y, CORN - 0.05] as V3), [0, 0, 1])
// The block on the roof (lidar: 15 x 15 m, 7-9 m above the roof), unseen
// from the street.
box(roof, -19.0, -6.0, -4.0, 9.0, CORN - 0.1, 26.6, 0.3, false)
hipRoof(roof, -19.0, -6.0, -4.0, 9.0, 26.6, 28.6)

// Each front: a stone-faced pavilion at either corner with one window a
// floor, and between them the brick bays: a rectangular window on the
// ground floor, a tall round-headed window on the main reading-room floor,
// a short window on the top floor.
const PAV = 6.0
function front(a: XY, b: XY, entrance = false) {
  const w = seg(a, b)
  for (const s of [PAV / 2, w.L - PAV / 2]) slabOn(stone, w.at(s), w.t, w.n, PAV - 0.2, GROUND, FRIEZE, 0.15)
  const n = Math.round((w.L - 2 * PAV) / 4.3), step = (w.L - 2 * PAV) / n
  const at = [PAV / 2, w.L - PAV / 2, ...Array.from({ length: n }, (_, k) => PAV + step * (k + 0.5))]
  at.forEach((s, i) => {
    const o = w.at(s), pav = i < 2, off = pav ? 0.2 : 0.05
    const mid = !pav && entrance && Math.abs(s - w.L / 2) < step / 2
    if (mid) {
      panel(trim, o, w.t, w.n, 3.6, 0.6, 6.6, true, 0.05)
      panel(door, o, w.t, w.n, 2.6, 0.6, 4.2, false, 0.09)
      panel(win, o, w.t, w.n, 2.6, 4.3, 6.1, true, 0.09)
      box(trim, X1 - 0.1, o[1] - 3.2, X1 + 1.6, o[1] + 3.2, 0, 0.6, 0.1, true)   // steps (east front only)
    } else {
      panel(trim, o, w.t, w.n, 2.0, 2.0, 5.2, false, 0.03)
      panel(win, o, w.t, w.n, 1.5, 2.2, 5.0, false, 0.07)
    }
    panel(trim, o, w.t, w.n, 2.9, 8.0, 13.9, true, off - 0.02)
    panel(win, o, w.t, w.n, 2.3, 8.2, 13.6, true, off + 0.03)
    panel(trim, o, w.t, w.n, 1.9, 14.7, 16.9, false, off - 0.02)
    panel(win, o, w.t, w.n, 1.4, 14.9, 16.7, false, off + 0.03)
  })
}
front([X0, Y0], [X1, Y0])            // Taylor Street (south)
front([X1, Y0], [X1, Y1], true)      // 10th Avenue (east), the main entrance
front([X1, Y1], [X0, Y1])            // Yamhill Street (north)
front([X0, Y1], [X0, Y0])            // 11th Avenue (west)

// ---------------------------------------------------------------- output ---
const parts = [
  { part: brick, material: finish('lib-red-brick', 0xb8705e) },
  { part: stone, material: finish('lib-grey-stone', 0xd6d3cb) },
  { part: trim, material: finish('lib-stone-trim', 0xe9e6dd) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('lib-door', 0x7e5c48) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Central Library', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 20.8, elevation: 0, height: 28.6,
})
await Bun.write(new URL('../models/pdx-central-library.glb', import.meta.url), glb)
console.log(`pdx-central-library.glb: ${triangles} triangles, ${glb.length} bytes`)
