/**
 * Portland City Hall (1895, Whidden & Lewis), Portland, Oregon: procedural,
 * CC0-1.0, no textures.
 * bun generators/pdx-city-hall.ts
 *
 * An Italian Renaissance palazzo in grey-buff sandstone filling most of the
 * block between SW 4th and 5th Avenues and Madison and Jefferson Streets:
 * four storeys (a basement and a tall first floor in the rusticated base,
 * a second floor with console hoods, a smooth third floor), a deep cornice
 * and a balustrade with urns at the corners. Corner pavilions frame both
 * avenue fronts. On 4th Avenue a three-storey rotunda projects from the
 * middle, its entrance behind a ring of paired pink granite columns, with
 * one-storey fronts at both ends; on 5th Avenue a one-storey portico of
 * banded columns ("CITY HALL") with a loggia of pink columns above it.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 21.1 (the
 * downtown grid, the outline's long edges), so +y runs up the avenues and +x
 * toward 4th Avenue. Origin: the area centroid of OSM way/141453089 (the
 * outline). z = 0 is the lowest ground, on the 4th Avenue side; downtown
 * rises gently westward and the 5th Avenue base sinks into it.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/141453089; parts
 *   way/1169135164 (the four-storey block, height 20 m), way/1169135161 (the
 *   rotunda, 3 levels), way/1169135162 and way/1169135163 (the one-storey
 *   fronts). The plan follows them.
 * - Published: the OSM part's height of 20 m to the cornice; four storeys
 *   (OSM building:levels, NRHP nomination "Portland City Hall", 1974).
 * - Photos (evidence, Wikimedia Commons):
 *   - M.O. Stevens, "City Hall front pan - Portland, Oregon.JPG", CC BY-SA 3.0
 *     (the 4th Avenue front square-on: the rotunda, its pink columns, the
 *     pavilions and the storey heights):
 *     https://commons.wikimedia.org/wiki/File:City_Hall_front_pan_-_Portland,_Oregon.JPG
 *   - Steve Morgan, "City Hall, Portland, Oregon - southwest corner in
 *     2013.jpg", CC BY-SA 3.0 (the 5th Avenue and Jefferson Street corner:
 *     window heads, the cornice, balustrade and urns, the pink loggia
 *     columns, the stone's colour):
 *     https://commons.wikimedia.org/wiki/File:City_Hall,_Portland,_Oregon_-_southwest_corner_in_2013.jpg
 *   - Visitor7, "Portland City Hall-1.jpg", CC BY-SA 3.0 (the 5th Avenue
 *     portico at night: paired banded columns on blocks, the balustrade):
 *     https://commons.wikimedia.org/wiki/File:Portland_City_Hall-1.jpg
 *
 * Numbers
 * - Published: cornice 20 m (OSM height; the cornice top here 19.4 m and
 *   the balustrade to 20.6 m).
 * - From the photos, scaled to that: basement 0.9-2.2 m, first floor windows
 *   3.4-6.7 m, second 8.8-11.7 m with hoods, third 13.6-16.6 m; the rotunda
 *   to 18 m (its balustrade) with columns 1.4-5.4 m; the one-storey fronts
 *   6.4 m; the portico 7.3 m.
 * - Estimated: the bay counts on the north side and the 5th Avenue
 *   pavilions (mirrored from the south side and the 4th Avenue front); the
 *   loggia's length (one photo shows its south end).
 * - Left out: rustication joints, the console brackets, the 5th Avenue
 *   flagpoles, the light court (if any) under the flat roof.
 *
 * Night: the windows glow; the building isn't floodlit (night photo).
 *
 * Doubts
 * - No lidar was read; heights rest on OSM's 20 m and the photos.
 * - The north (Madison Street) side was not photographed.
 * - OSM maps two 10 m glass parts (way/1568119408, way/1568119409, height
 *   25 m) over the light courts; no photo shows them, so the roof stays flat
 *   and they are only listed in replaces.
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
const stone = new Part()   // sandstone walls
const trim = new Part()    // cornice, string courses, balustrades, surrounds
const roof = new Part()    // flat roofs
const win = new Part()     // windows
const pink = new Part()    // the pink granite columns
const door = new Part()    // doors

const BASE = 2.8, S1 = 7.8, S2 = 12.6, FRIEZE = 17.4, CORN = 19.4, BAL = 20.6
// The four-storey block (OSM part way/1169135164), counter-clockwise:
// pavilions at the four corners, the middles recessed on both avenues.
const MAIN: XY[] = [
  [-20.5, -30.6], [14.1, -30.6], [14.1, -16.6], [12.3, -16.6], [12.3, 17.0], [14.1, 17.0],
  [14.1, 30.9], [-20.4, 30.9], [-20.4, 17.0], [-18.8, 17.0], [-18.8, -16.6], [-20.5, -16.6],
]
prism(stone, MAIN, 0, CORN, false)
band(trim, MAIN, 0.18, 0, BASE)                       // the rusticated base
band(trim, MAIN, 0.12, S1, S1 + 0.4)                  // string courses
band(trim, MAIN, 0.12, S2, S2 + 0.35)
band(trim, MAIN, 0.65, FRIEZE + 1.0, CORN)            // the cornice
parapet(trim, offset(MAIN, 0.2), 0.45, CORN, BAL)     // the balustrade
for (const r of [[-18.8, -30.6, 12.3, 30.9], [-20.5, -30.6, -18.8, -16.6], [-20.4, 17.0, -18.8, 30.9], [12.3, -30.6, 14.1, -16.6], [12.3, 17.0, 14.1, 30.9]])
  poly(roof, crect(r[0], r[1], r[2], r[3]).map(([x, y]) => [x, y, CORN - 0.05] as V3), [0, 0, 1])
// Urns on the corners of the balustrade.
for (const [x, y] of [[-20.3, -30.4], [13.9, -30.4], [13.9, 30.7], [-20.2, 30.7]]) {
  box(trim, x - 0.45, y - 0.45, x + 0.45, y + 0.45, BAL, BAL + 0.5, 0.1, true)
  prism(trim, ngon(x, y, 0.42, 8), BAL + 0.5, BAL + 1.4, true)
  prism(trim, ngon(x, y, 0.16, 6), BAL + 1.4, BAL + 1.9, true)
}

// Windows by floor: basement, a tall first floor and the hooded second floor
// in the rusticated base, the smooth third floor under the frieze.
function bays(w: ReturnType<typeof seg>, n: number, from = 0, upperOnly = false) {
  const step = w.L / n
  for (let k = 0; k < n; k++) {
    const o = w.at(step * (k + 0.5))
    if (!upperOnly) {
      panel(win, o, w.t, w.n, 1.2, 0.9, 2.2, false, 0.24)
      panel(trim, o, w.t, w.n, 2.0, 3.2, 6.9, false, 0.03)
      panel(win, o, w.t, w.n, 1.5, 3.4, 6.7, false, 0.07)
    }
    if (from <= 8) {
      panel(trim, o, w.t, w.n, 2.0, 8.6, 11.9, false, 0.03)
      panel(win, o, w.t, w.n, 1.5, 8.8, 11.7, false, 0.07)
      slabOn(trim, o, w.t, w.n, 2.5, 11.9, 12.35, 0.3)
    }
    panel(trim, o, w.t, w.n, 1.9, 13.4, 16.8, false, 0.03)
    panel(win, o, w.t, w.n, 1.4, 13.6, 16.6, false, 0.07)
  }
}
// Pavilions: five bays on the street ends (photos of Jefferson Street),
// three on the avenue faces; the recessed middles two bays either side of
// the rotunda (4th Avenue) and the loggia (5th Avenue).
bays(seg([-20.5, -30.6], [14.1, -30.6]), 8)                // Jefferson Street (south)
bays(seg([14.1, 30.9], [-20.4, 30.9]), 8)                  // Madison Street (north)
bays(seg([14.1, -30.6], [14.1, -16.6]), 3, 0, true)             // 4th Ave pavilions, over the one-storey fronts
bays(seg([14.1, 17.0], [14.1, 30.9]), 3, 0, true)
bays(seg([-20.4, 30.9], [-20.4, 17.0]), 3)                 // 5th Ave pavilions
bays(seg([-20.5, -16.6], [-20.5, -30.6]), 3)
bays(seg([12.3, -16.6], [12.3, -9.4]), 2)                  // 4th Ave middle, beside the rotunda
bays(seg([12.3, 9.4], [12.3, 17.0]), 2)
bays(seg([-18.8, 17.0], [-18.8, 7.6]), 2)                  // 5th Ave middle, beside the loggia
bays(seg([-18.8, -7.8], [-18.8, -16.6]), 2)
bays(seg([-18.8, 7.6], [-18.8, -7.8]), 4, 9, true)         // top floor over the loggia

// The one-storey fronts at the ends of the 4th Avenue side (OSM parts
// way/1169135162, way/1169135163).
for (const [y0, y1] of [[-30.6, -16.6], [17.0, 30.9]]) {
  box(stone, 13.9, y0, 23.1, y1, 0, 6.4, 0.3, false)
  band(trim, crect(13.9, y0, 23.1, y1, 0.3), 0.18, 0, BASE)
  band(trim, crect(13.9, y0, 23.1, y1, 0.3), 0.5, 5.6, 6.4)
  poly(roof, crect(13.9, y0, 23.1, y1).map(([x, y]) => [x, y, 6.35] as V3), [0, 0, 1])
  parapet(trim, crect(13.95, y0 + 0.05, 23.25, y1 - 0.05), 0.35, 6.4, 7.3)
  const w = seg([23.1, y0], [23.1, y1])
  for (const s of [w.L / 4, w.L / 2, (3 * w.L) / 4]) {
    panel(trim, w.at(s), w.t, w.n, 2.0, 3.2, 5.2, false, 0.03)
    panel(win, w.at(s), w.t, w.n, 1.5, 3.4, 5.0, false, 0.07)
  }
}

// The rotunda on 4th Avenue (OSM part way/1169135161): three storeys, a
// ring of pink granite columns round the entrance, two floors of windows,
// a balustrade under the main cornice.
{
  const CX = 14.4, R = 9.45, N = 12
  const ring = (r: number): XY[] => [[12.3, -r], ...arcPts(CX, 0, r, -Math.PI / 2, Math.PI / 2, N), [12.3, r]]
  prism(trim, ring(R + 0.15), 0, 1.4, true)                                 // the podium
  prism(door, ring(R - 1.4), 1.4, 5.6, false)                               // the recessed entrance wall
  for (let k = 0; k <= N; k++) {
    if (k === N / 2) continue
    const a = -Math.PI / 2 + (Math.PI * k) / N
    const [x, y] = [CX + (R - 0.55) * Math.cos(a), (R - 0.55) * Math.sin(a)]
    for (const d of [-0.55, 0.55]) {
      const px = x - Math.sin(a) * d, py = y + Math.cos(a) * d
      if (px < 12.6) continue
      prism(pink, ngon(px, py, 0.36, 8), 1.4, 5.4, false)
    }
  }
  // the pedimented doorcase at the centre
  box(trim, 22.6, -2.1, 24.3, 2.1, 1.4, 5.8, 0.1, true)
  panel(door, [24.3, 0], [0, 1], [1, 0], 2.4, 1.4, 4.4, false, 0.05)
  prism(trim, ring(R + 0.1), 5.4, 6.2, true, true)                           // the entablature over the columns
  prism(stone, ring(R), 6.2, 16.0, false)
  band(trim, ring(R), 0.12, 10.9, 11.25)
  prism(trim, ring(R + 0.45), 16.0, 17.0, true, true)
  parapet(trim, ring(R + 0.2), 0.35, 17.0, 18.0)
  poly(roof, ring(R).map(([x, y]) => [x, y, 16.95] as V3), [0, 0, 1])
  for (let k = 0; k < 7; k++) {
    const a0 = -Math.PI / 2 + (Math.PI * (k + 0.15)) / 7, a1 = -Math.PI / 2 + (Math.PI * (k + 0.85)) / 7
    const P = (a: number, z: number, r = R + 0.06): V3 => [CX + r * Math.cos(a), r * Math.sin(a), z]
    for (const [z0, z1] of [[7.0, 10.3], [11.8, 15.2]]) {
      const n: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0]
      poly(win, [P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1)], n)
    }
  }
}

// 5th Avenue: the one-storey portico (paired banded columns, CITY HALL on
// its frieze, a balustrade) and, above it, the loggia of pink columns.
{
  box(trim, -23.0, -7.4, -18.8, 5.9, 0, 1.6, 0.2, true)                     // podium and steps
  for (const y of [-6.6, -5.5, -2.0, 0.6, 4.0, 5.1]) prism(stone, ngon(-22.3, y, 0.4, 8), 1.6, 6.0, false)
  box(trim, -23.0, -7.4, -18.8, 5.9, 6.0, 7.3, 0.2, true, true)             // entablature
  parapet(trim, crect(-23.0, -7.4, -18.8, 5.9), 0.35, 7.3, 8.2)
  poly(roof, crect(-23.0, -7.4, -18.8, 5.9).map(([x, y]) => [x, y, 7.25] as V3), [0, 0, 1])
  panel(door, [-18.8, -0.7], [0, -1], [-1, 0], 2.4, 1.6, 4.8, false, 0.05)
  // the loggia: recessed dark bays behind pink columns, second and third floors
  for (let k = 0; k < 6; k++) {
    const y = -7.0 + (14.2 * (k + 0.5)) / 6
    panel(win, [-18.8, y], [0, -1], [-1, 0], 1.9, 8.6, 12.0, false, 0.05)
    prism(pink, ngon(-19.25, -7.0 + (14.2 * k) / 6 + (k === 0 ? 0.4 : 0), 0.3, 8), 8.2, 12.5, false)
  }
  prism(pink, ngon(-19.25, 6.8, 0.3, 8), 8.2, 12.5, false)
  box(trim, -19.7, -7.6, -18.8, 7.6, 12.5, 13.2, 0.1, true, true)
}

// ---------------------------------------------------------------- output ---
// Night: the stone is lit from the street lamps and the windows; it is not
// floodlit as a monument, so only the windows glow.
const parts = [
  { part: stone, material: finish('pch-sandstone', 0xd3cbbd) },
  { part: trim, material: finish('pch-stone-trim', 0xe8e1d4) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: pink, material: finish('pch-pink-granite', 0xcf9384) },
  { part: door, material: finish('pch-door', 0x7d5a4a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Portland City Hall', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 21.1, elevation: 0, height: 22.5,
})
await Bun.write(new URL('../models/pdx-city-hall.glb', import.meta.url), glb)
console.log(`pdx-city-hall.glb: ${triangles} triangles, ${glb.length} bytes`)
