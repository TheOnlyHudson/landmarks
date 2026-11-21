/**
 * Portland Union Station (1896, Van Brunt & Howe; tower signs 1948),
 * Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-union-station.ts
 *
 * A long Queen Anne station on NW 6th Avenue beside the tracks: walls of
 * grey pebbledash stucco banded and framed in red brick, red tile hipped
 * roofs, a big gabled waiting hall that runs out to the street in a round
 * apse ringed by a canopy, and the clock tower with its four clocks and the
 * neon signs on its roof: "GO BY TRAIN" on the street and track faces,
 * "UNION STATION" on the two others. The tower signs are the landmark's
 * identity at night, so their letters are modelled (STYLE.md, famous signs).
 *
 * Frame: x east, y north, z up, metres, turned to bearing 49.5 (the
 * outline's long edges), so +x runs south-east along the tracks and +y
 * north-east toward them; the street front faces -y. Origin: the area
 * centroid of OSM way/156423744. z = 0 is the ground; the site is flat
 * within 0.5 m (lidar ground returns).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/156423744 (3 levels,
 *   hipped); parts way/1580321841 (the station), way/421660583 (the tower,
 *   7 m square), way/443258323 (the street canopies, building:part=roof),
 *   way/1580321840 (the platform canopy and the walkway shed),
 *   way/450250949 (the chimney), way/443258321 (an elevator). Plan follows
 *   these, simplified to rectangles.
 * - Lidar (measured): USGS 3DEP OR_OLCMetro_2019 (flown 2019), 1 m, read in
 *   this frame with tools/lidar_frame.py, heights above the ground (0.9 m in
 *   the grid): north-west wing eaves 9.6 m, ridge 16.0 m; middle block eaves
 *   13.2 m, ridge 17.9 m; south-east wing eaves 11 m, ridge 14.6 m; the hall
 *   ridge 20.6 m on x = 0, its walls about 21 m apart, the apse to y = -29.5;
 *   the canopies 4.6-5.7 m; the walkway shed 7.4-11.3 m; the chimney 21.5 m;
 *   the low end blocks 5.5-8 m; the tower's sign tops 40.8 m all round. The
 *   tower's centre returns reach 55 m: the flags and flagpole.
 * - USGS NAIP (public domain): red tile roofs, the grey flat roof of the
 *   front block (F), the round bay at the south-east end.
 * - Published: tower 150 ft (46 m) (Wikipedia, "Union Station (Portland,
 *   Oregon)"; National Register 1975). Used for the flagpole top.
 * - Photos (evidence, Wikimedia Commons):
 *   - Bobjgalindo, "A front view of Union Station, Portland Oregon.jpg"
 *     (from the street:
 *     the tower stages, clocks, the signs and which face carries which,
 *     pebbledash and brick, the canopies), CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:A_front_view_of_Union_Station,_Portland_Oregon.jpg
 *   - Neonorange, "Union Station Portland Oregon (view from platform
 *     side).JPG" (from
 *     the south-east over the tracks: roofs, dormers, the chimney, the
 *     track-side signs), CC BY-SA 3.0:
 *     https://commons.wikimedia.org/wiki/File:Union_Station_Portland_Oregon_(view_from_platform_side).JPG
 *   - Nathan Searles, "Union Station Portland Oregon.jpg" (night, from the
 *     north-west: the white neon UNION STATION, the platform canopies),
 *     CC BY 2.0:
 *     https://commons.wikimedia.org/wiki/File:Union_Station_Portland_Oregon.jpg
 *   - Another Believer, "Union Station, Portland, OR 2012 - sign.JPG" (close-up of the
 *     pebbledash and brick banding: the wall colours), CC BY-SA 3.0:
 *     https://commons.wikimedia.org/wiki/File:Union_Station,_Portland,_OR_2012_-_sign.JPG
 *
 * Numbers
 * - Measured (lidar): the eaves, ridges, canopy, shed, chimney and sign-top
 *   heights above.
 * - From the photos, scaled to the 7.2 m tower: the clock stage 29-37 m,
 *   clocks 3.6 m across centred at 33.2 m; tower eave 37.6 m, a shallow
 *   pyramid to 41.8 m (the lidar can't see it behind the flags); letters
 *   1.55 m high in two lines, baselines 37.3 m and 39.2 m (tops at the
 *   lidar's 40.8 m), leaning back with the roof, the signs about 8 m wide;
 *   window rows per storey.
 * - Estimated: bay spacing (about 4.3 m) on every front; the hall's north
 *   end (hipped into the long block); the track side drawn like the street
 *   side.
 * - Left out: dormers, awnings, the decorative brick panels, the platforms'
 *   further canopies (separate OSM buildings), the flags.
 *
 * Night: the letters and clock faces are `neon` (white, as in the night
 *   photo); the windows glow.
 *
 * Doubts
 * - "GO BY TRAIN" is said to glow red at night; the night photo used shows
 *   only UNION STATION (white), and the letters are white by day, so all
 *   letters share one white neon material.
 * - Letterforms: a bold sans-serif traced in proportion from the street
 *   photo, not letter by letter.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'

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
const peb = new Part()    // grey pebbledash walls
const brick = new Part()  // red brick bands, quoins, window surrounds, the clock stage
const tile = new Part()   // red tile roofs and canopy roofs
const win = new Part()    // windows
const metal = new Part()  // flat roofs, canopy posts, doors
const neon = new Part()   // the tower's letters and clock faces

/** A hipped roof with an eave overhang and a soffit. */
function hip(x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, over = 0.7) {
  const k = (zr - ze) / (Math.min(x1 - x0, y1 - y0) / 2), zo = ze - over * k
  hipRoof(tile, x0 - over, y0 - over, x1 + over, y1 + over, zo, zr)
  poly(tile, [[x0 - over, y0 - over, zo], [x1 + over, y0 - over, zo], [x1 + over, y1 + over, zo], [x0 - over, y1 + over, zo]], [0, 0, -1])
}

/** A pyramid roof over a square about (cx, cy), half-size h. */
function pyramid(p: Part, cx: number, cy: number, h: number, ze: number, zt: number) {
  const c: V3[] = [[cx - h, cy - h, ze], [cx + h, cy - h, ze], [cx + h, cy + h, ze], [cx - h, cy + h, ze]]
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    poly(p, [a, b, [cx, cy, zt]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, h])
  }
  poly(p, c, [0, 0, -1])
}

/**
 * Walls of a block: pebbledash, a brick plinth, brick string courses at each
 * floor, and windows in brick surrounds, one panel per window, bay by bay.
 * `rows` are [z0, z1] of each storey's windows; `skip` drops walls by index.
 */
function block(ring: XY[], ze: number, rows: number[][], bay = 4.3, skip: number[] = []) {
  prism(peb, ring, 0, ze, true)
  band(brick, ring, 0.12, 0, 0.9)
  for (const [z0] of rows.slice(1)) band(brick, ring, 0.1, z0 - 1.1, z0 - 0.7)
  band(brick, ring, 0.15, ze - 0.6, ze)
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const w = seg(r[i], r[(i + 1) % r.length])
    if (w.L < 3) continue
    const n = Math.max(1, Math.floor((w.L - 1.6) / bay)), step = (w.L - 1.6) / n
    for (let k = 0; k < n; k++) {
      const o = w.at(0.8 + step * (k + 0.5))
      for (const [z0, z1] of rows) {
        if (z0 > 2) panel(brick, o, w.t, w.n, 1.9, z0 - 0.3, z1 + 0.3, false, 0.04)
        panel(win, o, w.t, w.n, 1.3, z0, z1, false, 0.08)
      }
    }
  }
}

/** A flat canopy roof slab on thin posts. */
function canopy(ring: XY[], z: number, posts: XY[]) {
  prism(tile, ring, z - 0.35, z, true, true)
  for (const [x, y] of posts) box(metal, x - 0.15, y - 0.15, x + 0.15, y + 0.15, 0, z - 0.35, 0, false)
}

const R3 = [[1.3, 3.8], [5.3, 7.9], [9.3, 11.6]]  // three storeys under a 13.2 m eave
const R2 = [[1.3, 3.8], [5.3, 7.8]]               // two storeys under a 9.6 m eave

// --- the long block, north-west to south-east (x), tracks to the north (+y)
// A: the north-west wing, two storeys.
block(crect(-46, -6.5, -10.5, 13.2), 9.6, R2)
hip(-46, -6.5, -10.5, 13.2, 9.6, 16.0)
// B: the middle, three storeys, behind the tower; a front piece west of the
// tower and a pavilion east of it come forward to the street line.
block(crect(10.5, -0.4, 47, 13.2), 13.2, R3)
hip(10.5, -0.4, 47, 13.2, 13.2, 17.9)
block(crect(10.5, -6.5, 20, -0.4), 13.2, R3, 3.0)
hip(10.5, -6.5, 20, 1.0, 13.2, 15.8)
block(crect(39, -6.5, 51, 6), 13.2, R3, 3.2)
hip(39, -6.5, 51, 6, 13.2, 17.4)
// C: the south-east wing, a little lower.
block(crect(47, -5.7, 74.7, 13.4), 11.0, [[1.3, 3.8], [5.1, 7.4], [8.0, 9.6]])
hip(47, -5.7, 74.7, 13.4, 11.0, 14.6)
// D: the one-storey south-east end, and the round bay on C's street side.
block(crect(74.7, -6.8, 85.3, 11.6), 5.4, [[1.3, 3.8]])
hip(74.7, -6.8, 85.3, 11.6, 5.4, 8.2, 0.5)
{
  const C: XY = [66.8, -5.7], r = 5.4, arc = arcPts(C[0], C[1], r, Math.PI, 2 * Math.PI, 8)
  prism(peb, arc, 0, 4.8, true)
  band(brick, arc, 0.1, 4.3, 4.8)
  for (let i = 0; i < 8; i++) {
    const a = arc[i], b = arc[i + 1], w = seg(b, a)
    panel(win, w.at(w.L / 2), w.t, w.n, 1.2, 1.3, 3.6, false, 0.06)
  }
  for (let i = 0; i < 8; i++) {
    const a = arc[i], b = arc[i + 1]
    poly(tile, [[a[0] + (a[0] - C[0]) * 0.1, a[1] + (a[1] - C[1]) * 0.1, 4.6], [b[0] + (b[0] - C[0]) * 0.1, b[1] + (b[1] - C[1]) * 0.1, 4.6], [C[0], C[1], 6.6]], [a[0] + b[0] - 2 * C[0], a[1] + b[1] - 2 * C[1], 2])
  }
}
// E: the low north-west end blocks.
block(crect(-71.5, -17.6, -54.5, 0), 5.5, [[1.3, 3.8]])
hip(-71.5, -17.6, -54.5, 0, 5.5, 7.6, 0.5)
block(crect(-54.5, -26.8, -46, 8), 6.0, [[1.3, 3.8]])
hip(-54.5, -26.8, -46, 8, 6.0, 8.2, 0.5)
// F: the one-storey front block on the street, flat roofed (grey in NAIP).
block(crect(-46, -24, -10.5, -6.5), 6.0, [[1.3, 4.2]])
prism(peb, crect(-45.6, -23.6, -10.9, -6.9), 6.0, 6.15, true)

// --- the main hall: gabled, running out to the street in a round apse.
const HX = 0, HW = 10.5, HE = 13.0, HR = 20.6, AY = -19.5
{
  // walls from the apse's spring line back to the long block
  const ring: XY[] = [[HX - HW, AY], [HX + HW, AY], [HX + HW, 6], [HX - HW, 6]]
  prism(peb, ring, 0, HE, false)
  band(brick, [[HX - HW, AY], [HX + HW, AY], [HX + HW, 6], [HX - HW, 6]], 0.15, HE - 0.6, HE)
  const apse = arcPts(HX, AY, HW, Math.PI, 2 * Math.PI, 10)
  prism(peb, apse, 0, HE, false)
  band(brick, apse, 0.12, 0, 0.9)
  band(brick, apse, 0.15, HE - 0.6, HE)
  band(brick, apse, 0.1, 6.0, 6.4)
  // tall round-headed windows round the apse, a row of upper windows
  for (let i = 0; i < 10; i++) {
    const a = apse[i], b = apse[i + 1], w = seg(b, a)
    if (i === 0 || i === 9) continue
    panel(brick, w.at(w.L / 2), w.t, w.n, 2.3, 6.9, 11.4, true, 0.03)
    panel(win, w.at(w.L / 2), w.t, w.n, 1.7, 7.2, 11.1, true, 0.07)
  }
  for (const s of [-1, 1]) {
    // the hall's side walls between the street blocks and the long block
    const o: XY = [HX + s * HW, (AY - 6.5) / 2]
    for (const dy of [-5, 0, 5]) {
      panel(brick, [o[0], o[1] + dy - 1], [0, -s], [s, 0], 2.3, 6.9, 11.4, true, 0.03)
      panel(win, [o[0], o[1] + dy - 1], [0, -s], [s, 0], 1.7, 7.2, 11.1, true, 0.07)
    }
  }
  // the roof: two slopes along y with a hipped north end, a half cone over the apse
  const ov = 0.7, k = (HR - HE) / HW, zo = HE - ov * k
  poly(tile, [[HX - HW - ov, AY, zo], [HX, AY, HR], [HX, 2, HR], [HX - HW - ov, 2 + HW + ov, zo]], [-1, 0, 1])
  poly(tile, [[HX + HW + ov, AY, zo], [HX + HW + ov, 2 + HW + ov, zo], [HX, 2, HR], [HX, AY, HR]], [1, 0, 1])
  poly(tile, [[HX - HW - ov, 2 + HW + ov, zo], [HX, 2, HR], [HX + HW + ov, 2 + HW + ov, zo]], [0, 1, 1])
  const cone = arcPts(HX, AY, HW + ov, Math.PI, 2 * Math.PI, 10)
  for (let i = 0; i < 10; i++) {
    const a = cone[i], b = cone[i + 1]
    poly(tile, [[a[0], a[1], zo], [b[0], b[1], zo], [HX, AY, HR]], [a[0] + b[0] - 2 * HX, a[1] + b[1] - 2 * AY, 2])
    poly(tile, [[a[0], a[1], zo], [b[0], b[1], zo], [HX, AY, zo]], [0, 0, -1])
  }
  poly(tile, [[HX - HW - ov, AY, zo], [HX + HW + ov, AY, zo], [HX + HW + ov, 2 + HW + ov, zo], [HX - HW - ov, 2 + HW + ov, zo]], [0, 0, -1])
}

// --- canopies: the ring round the apse, the street strip, the deep canopy
// before the tower, the platform canopy and the shed over the tracks' walkway.
{
  const ring = [...arcPts(HX, AY, 14.3, Math.PI, 2 * Math.PI, 10)].reverse()
  const inner = arcPts(HX, AY, HW, Math.PI, 2 * Math.PI, 10)
  for (let i = 0; i < 10; i++) {
    const o0 = arcPts(HX, AY, 14.3, Math.PI, 2 * Math.PI, 10)
    const q: XY[] = [inner[i], inner[i + 1], o0[i + 1], o0[i]]
    prism(tile, q, 4.9, 5.25, true, true)
    box(metal, o0[i][0] - 0.15, o0[i][1] - 0.15, o0[i][0] + 0.15, o0[i][1] + 0.15, 0, 4.9, 0, false)
  }
  void ring
  canopy(crect(-42.5, -26.7, -10.5, -24), 4.6, [-40, -33, -26, -19, -12].map((x) => [x, -26.4] as XY))
  canopy([[10.5, -6.5], [10.5, -21.8], [18.9, -21.4], [21, -18.9], [27.5, -11.3], [27.5, -6.6]], 5.3, [[11, -21.4], [18.6, -21], [24, -15.4], [27.2, -11.6]])
  canopy(crect(27.5, -11.2, 39, -0.4), 5.3, [[31, -10.9], [35, -10.9], [38.7, -10.9]])
  canopy(crect(-46, 13.2, 36.3, 20.2), 4.6, [-42, -32, -22, -12, 12, 22, 32].map((x) => [x, 19.9] as XY))
  // the walkway shed, gabled, on posts
  gableRoof(tile, null, -9.6, 20.2, 8.8, 44.1, 7.4, 11.3, false, 0.4)
  for (const y of [21, 27, 33, 39, 43.6]) for (const x of [-9.3, 8.5]) box(metal, x - 0.18, y - 0.18, x + 0.18, y + 0.18, 0, 7.2, 0, false)
}

// --- the chimney at the south-east end (lidar 21.5 m)
box(peb, 71.3, 3.4, 73.3, 5.5, 10, 20.6, 0.15, false)
box(brick, 71.1, 3.2, 73.5, 5.7, 20.6, 21.5, 0.15, true)

// --- the clock tower
const TX = 23.5, TY = -3.0, TH = 3.6, CLK0 = 29.0, CLK1 = 37.0, EAVE = 37.6, APEX = 41.8
{
  box(peb, TX - TH, TY - TH, TX + TH, TY + TH, 0, CLK0, 0.2, false)
  // brick quoins up the corners and bands
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TX + sx * (TH - 0.35), cy = TY + sy * (TH - 0.35)
    box(brick, cx - 0.45, cy - 0.45, cx + 0.45, cy + 0.45, 0, CLK0, 0.1, false)
  }
  for (const z of [0, 13.6, 20.2]) box(brick, TX - TH - 0.1, TY - TH - 0.1, TX + TH + 0.1, TY + TH + 0.1, z, z + (z ? 0.4 : 0.9), 0.1, false)
  box(brick, TX - TH - 0.25, TY - TH - 0.25, TX + TH + 0.25, TY + TH + 0.25, CLK0 - 0.5, CLK0, 0.15, true)
  box(brick, TX - TH, TY - TH, TX + TH, TY + TH, CLK0, CLK1, 0.2, false)
  box(brick, TX - TH - 0.4, TY - TH - 0.4, TX + TH + 0.4, TY + TH + 0.4, CLK1, EAVE, 0.2, true)
  pyramid(tile, TX, TY, TH + 1.2, EAVE - 0.2, APEX)
  box(metal, TX - 0.12, TY - 0.12, TX + 0.12, TY + 0.12, APEX - 0.3, 46.0, 0, true)
  // per face: a round-headed window, a small window with its balconette, the clock
  const faces: Array<[XY, XY]> = [[[0, -1], [1, 0]], [[1, 0], [0, 1]], [[0, 1], [-1, 0]], [[-1, 0], [0, -1]]]
  for (const [n, t] of faces) {
    const o: XY = [TX + n[0] * TH, TY + n[1] * TH]
    panel(brick, o, t, n, 1.6, 19.6, 22.6, true, 0.04)
    panel(win, o, t, n, 1.0, 19.9, 22.4, true, 0.08)
    panel(win, o, t, n, 1.0, 25.6, 27.6, false, 0.06)
    slabOn(brick, o, t, n, 1.6, 25.0, 25.5, 0.6)
    // clock: a disc of 2.8 m, its brick ring
    const ring = (r: number, off: number): V3[] => Array.from({ length: 16 }, (_, k) => {
      const a = (2 * Math.PI * k) / 16, u = Math.cos(a) * r, v = Math.sin(a) * r
      return [o[0] + t[0] * u + n[0] * off, o[1] + t[1] * u + n[1] * off, 33.2 + v] as V3
    })
    const rim = ring(2.05, 0.12), face = ring(1.8, 0.2)
    poly(brick, rim, [n[0], n[1], 0])
    poly(neon, face, [n[0], n[1], 0])
  }
}

// --- the signs on the tower top: GO BY TRAIN on the street (south-west) and
// track (north-east) faces, UNION STATION on the other two; white letters
// in two lines on light steel frames, standing out from the eave.
{
  // Sans-serif capitals, cap height 1, drawn as centre-lines.
  const G: Record<string, (p: Pen) => number> = {
    G: (p) => { p.moveTo([0.66, 0.78]).arc([0.36, 0.5], 1.6 * Math.PI, 7).lineTo([0.66, 0.42]).lineTo([0.42, 0.42]); return 0.74 },
    O: (p) => { p.circle([0.36, 0.5], 0.34, 0.46, 10); return 0.74 },
    B: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.4, 1]).arc([0.4, 0.76], -Math.PI, 4).lineTo([0.06, 0.52]); p.moveTo([0.4, 0.52]).arc([0.42, 0.26], -Math.PI, 4).lineTo([0.06, 0]); return 0.72 },
    Y: (p) => { p.moveTo([0, 1]).lineTo([0.32, 0.5]).lineTo([0.64, 1]); p.moveTo([0.32, 0.5]).lineTo([0.32, 0]); return 0.68 },
    T: (p) => { p.moveTo([0, 1]).lineTo([0.64, 1]); p.moveTo([0.32, 1]).lineTo([0.32, 0]); return 0.68 },
    R: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.38, 1]).arc([0.38, 0.74], -Math.PI, 4).lineTo([0.06, 0.48]); p.moveTo([0.34, 0.48]).lineTo([0.62, 0]); return 0.7 },
    A: (p) => { p.moveTo([0, 0]).lineTo([0.34, 1]).lineTo([0.68, 0]); p.moveTo([0.14, 0.34]).lineTo([0.54, 0.34]); return 0.72 },
    I: (p) => { p.moveTo([0.08, 0]).lineTo([0.08, 1]); return 0.3 },
    N: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.58, 0]).lineTo([0.58, 1]); return 0.74 },
    U: (p) => { p.moveTo([0.06, 1]).lineTo([0.06, 0.34]).arc([0.33, 0.34], Math.PI, 5).lineTo([0.6, 1]); return 0.74 },
    S: (p) => { p.moveTo([0.6, 0.84]).cubicTo([0.5, 1.04], [0.04, 1.04], [0.06, 0.74], 4).cubicTo([0.08, 0.5], [0.6, 0.54], [0.62, 0.26], 4).cubicTo([0.64, -0.04], [0.12, -0.06], [0.02, 0.16], 4); return 0.72 },
    ' ': () => 0.36,
  }
  const word = (s: string) => {
    const pen = new Pen()
    let u = 0
    for (const ch of s) { const q = new Pen(); const w = G[ch](q); pen.add(q, u); u += w + 0.14 }
    return { pen, width: u - 0.14 }
  }
  const CAP = 1.55, GAP = 0.35, Z1 = 39.2, LEAN = 0.45, Z0 = Z1 - CAP - GAP, OFF = TH + 1.9
  const sign = (lines: string[], n: XY, t: XY) => {
    const o: XY = [TX + n[0] * OFF, TY + n[1] * OFF]
    lines.forEach((s, i) => {
      const { pen, width } = word(s)
      const z0 = i === 0 ? Z1 : Z0, u0 = -width * CAP / 2
      strokes(neon, pen.paths, {
        width: 0.24, depth: 0.25,
        place: (u, v, w) => { const k = w - (z0 + v * CAP - Z0) * LEAN; return [o[0] + t[0] * (u0 + u * CAP) + n[0] * k, o[1] + t[1] * (u0 + u * CAP) + n[1] * k, z0 + v * CAP] },
      })
    })
    // the frame: two rails behind the letters, tied back to the roof
    for (const z of [Z0 + 0.1, Z1 + 0.2]) slabOn(metal, [o[0] - n[0] * (z - Z0) * LEAN, o[1] - n[1] * (z - Z0) * LEAN], t, n, 8.4, z, z + 0.14, -0.15)
    for (const s of [-3.8, 3.8]) {
      const p: XY = [o[0] + t[0] * s, o[1] + t[1] * s]
      const q: XY = [p[0] - n[0] * 1.2, p[1] - n[1] * 1.2]
      box(metal, q[0] - 0.08, q[1] - 0.08, q[0] + 0.08, q[1] + 0.08, EAVE - 0.3, Z1 + CAP + 0.1, 0, true)
    }
  }
  sign(['GO BY', 'TRAIN'], [0, -1], [1, 0])
  sign(['GO BY', 'TRAIN'], [0, 1], [-1, 0])
  sign(['UNION', 'STATION'], [1, 0], [0, 1])
  sign(['UNION', 'STATION'], [-1, 0], [0, -1])
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: peb, material: finish('us-pebbledash', 0x8a7462) },
  { part: brick, material: finish('us-red-brick', 0xb8604a) },
  { part: tile, material: finish('us-red-tile', 0xbd6449) },
  { part: win, material: PALETTE.window },
  { part: metal, material: finish('us-green-steel', 0x6b7670) },
  { part: neon, material: finish('neon-us-white', 0xf3f1ea) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Portland Union Station', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 49.5, elevation: 0, height: 46.0,
})
await Bun.write(new URL('../models/pdx-union-station.glb', import.meta.url), glb)
console.log(`pdx-union-station.glb: ${triangles} triangles, ${glb.length} bytes`)
