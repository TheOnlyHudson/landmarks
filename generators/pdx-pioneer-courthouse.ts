/**
 * Pioneer Courthouse (1869-75, Alfred B. Mullett; west wings 1903-05),
 * Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-pioneer-courthouse.ts
 *
 * The oldest federal building in the Pacific Northwest: an Italianate
 * sandstone courthouse on the block between SW 5th and 6th Avenues and
 * Morrison and Yamhill Streets, facing Pioneer Courthouse Square to the west.
 * Three storeys: a rusticated ground floor of round-headed windows under a
 * string course, a piano nobile of tall windows under hoods, a short top
 * floor, a full entablature. The original block runs north-south under a
 * low gabled roof with pediments at both ends and the octagonal wooden
 * cupola (arched windows, a grey dome, flagpole) at its centre; the two
 * 1903 wings run west from it, each ending in a pedimented pavilion toward
 * the square, with a one-storey entrance link (two arched doors, a
 * balustrade) between them.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 21.1 (the
 * downtown street grid, the outline's long edges), so +y runs up the
 * avenues (NNE) and +x toward 5th Avenue (ESE). Origin: the area centroid of
 * OSM way/31732583 (the outline). z = 0 is the ground around the building,
 * which is flat within 0.7 m (lidar ground returns 2.3-3.0 m around it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/31732583; parts
 *   way/450174478 (the 1875 block), way/450174480 and way/450174481 (the
 *   wings), way/450174483, way/450174482 (the cupola, 8 sides),
 *   way/1157298039 (the entrance link). Plan taken from these parts.
 * - Lidar (measured): USGS 3DEP OR_OLCMetro_2019 (flown 2019), 0.5 m, read in
 *   this frame with tools/lidar_frame.py; heights above the ground (2.5 m in
 *   the grid): eaves 16.0 m and ridges 18.7 m on all three gabled blocks,
 *   the wings' ridges east-west and the old block's north-south; the link's
 *   top 8.3 m; the cupola's cornice a flat octagon 8.6 m across at 26.2 m,
 *   the dome to about 30 m; chimney pairs 5.4 m either side of the ridge,
 *   tops 21.3 m (inner) and 20.0 m (outer). The lidar sits about 1.2 m east
 *   of OSM; the plan follows OSM.
 * - Photos (evidence, Wikimedia Commons):
 *   - M.O. Stevens, "Pioneer Courthouse Portland.JPG", CC BY-SA 3.0 (the west
 *     front from the square: pavilions, pilasters, the link and its doors,
 *     the cupola stages, colours):
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Courthouse_Portland.JPG
 *   - Another Believer, "Pioneer Courthouse, Portland, Oregon 2012.JPG",
 *     CC BY-SA 3.0 (the east front at night, floodlit: bay rhythm, window
 *     heads, hoods, the floodlighting):
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Courthouse,_Portland,_Oregon_2012.JPG
 *   - Busition, "Pioneer Courthouse (February 2026).jpg", CC BY 4.0 (from the
 *     south-west at night: the wing's long side, the old block's south
 *     pediment, chimneys):
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Courthouse_(February_2026).jpg
 *
 * Numbers
 * - Measured (lidar): the eave, ridge, link, cupola cornice, dome and
 *   chimney heights above.
 * - From the photos, scaled to the 16 m eave: string course 5.7 m; ground
 *   floor windows 1.5-4.8 m, round-headed; piano nobile windows 6.6-10.0 m
 *   with hoods; top floor 11.4-13.4 m; entablature from 15.1 m. The cupola's
 *   stages (base to 21.1 m, arcaded drum to 25 m, cornice), one arched window
 *   to each of the eight faces.
 * - Estimated: bay counts on the sides no photo shows square-on (three on the
 *   wings' long sides, five on the old block's ends, nine on the east front
 *   in three groups); the oculus in each north/south pediment.
 * - Left out: rustication joints, balcony railing, flagpole and flag, the
 *   lamp posts and the square's planting (the map's), sculpture.
 *
 * Night: the stone is floodlit (both night photos), so stone and trim carry
 * _FLOODLIGHT; the windows glow; the roofs and the dome stay dark.
 *
 * Doubts
 * - The north side and the east front are drawn from one night photo and the
 *   lidar; their bay counts are approximate.
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
const trim = new Part()    // cornices, string course, pilasters, hoods
const roof = new Part()    // grey metal roofs
const domeP = new Part()   // the cupola's dome
const win = new Part()     // windows
const door = new Part()    // door leaves

const EAVE = 16.0, RIDGE = 18.7          // lidar, all three gabled blocks
const STRING = 5.7                        // string course over the rusticated ground floor
// Blocks (OSM parts, this frame): the 1875 block east, two 1903 wings west.
const OX0 = -4.7, OX1 = 17.9, OY0 = -19.4, OY1 = 19.9, XM = (OX0 + OX1) / 2
const WX0 = -19.0
const WINGS: Array<[number, number]> = [[4.75, 18.8], [-19.1, -5.2]]

// --- walls, plinth, string course, frieze and cornice for each block
function block(x0: number, y0: number, x1: number, y1: number) {
  box(trim, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, 0, 0.9, 0.3, false)
  box(stone, x0, y0, x1, y1, 0.9, EAVE - 0.9, 0.3, false)
  box(trim, x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12, STRING, STRING + 0.45, 0.3, false, true)
  box(stone, x0 + 0.05, y0 + 0.05, x1 - 0.05, y1 - 0.05, EAVE - 0.9, EAVE, 0.3, true)
  box(trim, x0 - 0.45, y0 - 0.45, x1 + 0.45, y1 + 0.45, EAVE - 0.55, EAVE, 0.4, true, true)
}
block(OX0, OY0, OX1, OY1)
box(stone, OX1 - 0.5, -7.9, OX1 + 1.0, 7.7, 0.9, EAVE - 0.9, 0.2, false)          // the east frontispiece
box(trim, OX1 - 0.5, -8.3, OX1 + 1.4, 8.1, EAVE - 0.9, EAVE + 0.1, 0.3, true, true)
for (const [y0, y1] of WINGS) block(WX0, y0, OX0 + 0.3, y1)

// --- roofs. The old block's ridge runs north-south with pediments at both
// ends; each wing's ridge runs east-west with a pediment to the west, its
// slopes meeting the old roof along a valley.
gableRoof(roof, stone, OX0, OY0, OX1, OY1, EAVE, RIDGE, false, 0.45)
const SLOPE = (RIDGE - EAVE) / (XM - OX0)
for (const [y0, y1] of WINGS) {
  const ym = (y0 + y1) / 2, ov = 0.45
  for (const [ye, s] of [[y0 - ov, -1], [y1 + ov, 1]] as Array<[number, number]>) {
    const P: V3[] = [[WX0 - ov, ye, EAVE], [OX0 - ov, ye, EAVE], [XM, ym, RIDGE], [WX0 - ov, ym, RIDGE]]
    poly(roof, P, [0, s, 1])
    poly(roof, P, [0, -s, -1])
  }
  poly(stone, [[WX0, y0, EAVE], [WX0, y1, EAVE], [WX0, ym, RIDGE]], [-1, 0, 0])
  // the pediment's raking cornices
  for (const [ya, yb] of [[y0, ym], [ym, y1]]) {
    const za = ya === ym ? RIDGE : EAVE, zb = yb === ym ? RIDGE : EAVE
    poly(trim, [[WX0 - 0.5, ya, za], [WX0 - 0.5, yb, zb], [WX0 - 0.5, yb, zb + 0.5], [WX0 - 0.5, ya, za + 0.5]], [-1, 0, 0])
  }
}
// The old block's pediments' raking cornices (north and south).
for (const [y, s] of [[OY0 - 0.5, -1], [OY1 + 0.5, 1]] as Array<[number, number]>) {
  for (const [xa, xb] of [[OX0, XM], [XM, OX1]]) {
    const za = xa === XM ? RIDGE : EAVE, zb = xb === XM ? RIDGE : EAVE
    poly(trim, [[xa, y, za], [xb, y, zb], [xb, y, zb + 0.5], [xa, y, za + 0.5]], [0, s, 0])
  }
}

// --- the entrance link between the wings: one storey, a balustrade on top
box(stone, -17.6, -5.2, OX0, 4.75, 0, 7.6, 0, true)
box(trim, -17.9, -5.2, OX0, 4.75, 7.0, 7.7, 0, true)
box(trim, -17.75, -4.9, OX0, 4.45, 7.7, 8.5, 0, true)
{
  const w = seg([-17.6, 4.75], [-17.6, -5.2])
  for (const s of [3.6, 6.35]) {
    panel(trim, w.at(s), w.t, w.n, 2.5, 0.6, 5.4, true, 0.04)
    panel(door, w.at(s), w.t, w.n, 1.9, 0.6, 3.6, false, 0.08)
    panel(win, w.at(s), w.t, w.n, 1.9, 3.75, 5.1, true, 0.08)
  }
  box(trim, -18.9, -3.4, -17.6, 2.9, 5.6, 6.0, 0.1, true, true)  // the porch canopy over the doors
}

// --- windows. Ground floor round-headed, piano nobile tall with hoods,
// top floor short; each wall gets bays at the photographed rhythm.
function bays(w: ReturnType<typeof seg>, n: number, opts: { ground?: boolean; from?: number; pil?: boolean } = {}) {
  const step = w.L / n
  for (let k = 0; k < n; k++) {
    const o = w.at(step * (k + 0.5))
    if (opts.ground !== false) {
      panel(trim, o, w.t, w.n, 2.2, 1.3, 5.0, true, 0.03)
      panel(win, o, w.t, w.n, 1.6, 1.5, 4.8, true, 0.07)
    }
    panel(trim, o, w.t, w.n, 2.0, 6.4, 10.3, false, 0.03)
    panel(win, o, w.t, w.n, 1.45, 6.6, 10.0, false, 0.07)
    slabOn(trim, o, w.t, w.n, 2.4, 10.3, 10.75, 0.3)
    panel(trim, o, w.t, w.n, 1.8, 11.2, 13.6, false, 0.03)
    panel(win, o, w.t, w.n, 1.3, 11.4, 13.4, false, 0.07)
  }
  if (opts.pil) for (let k = 0; k <= n; k++) {
    const s = Math.min(w.L - 0.5, Math.max(0.5, step * k))
    slabOn(stone, w.at(s), w.t, w.n, 0.95, STRING + 0.45, EAVE - 0.9, 0.22)
  }
}
// The wings' west pavilions: one window a floor between four pilasters.
for (const [y0, y1] of WINGS) {
  const w = seg([WX0, y1], [WX0, y0])
  bays(w, 1)
  for (const s of [0.6, 4.6, w.L - 4.6, w.L - 0.6]) slabOn(stone, w.at(s), w.t, w.n, 1.0, STRING + 0.45, EAVE - 0.9, 0.22)
}
bays(seg([OX0, 18.8], [WX0, 18.8]), 3, { pil: true })        // north wing, north side
bays(seg([WX0, -19.1], [OX0, -19.1]), 3, { pil: true })      // south wing, south side
bays(seg([OX1, OY1], [OX0, OY1]), 5, { pil: true })          // north end of the old block
bays(seg([OX0, OY0], [OX1, OY0]), 5, { pil: true })          // south end
// East front on Fifth Avenue: three bays either side, three on the frontispiece.
bays(seg([OX1, OY0], [OX1, -7.9]), 3, { pil: true })
bays(seg([OX1 + 1.0, -7.9], [OX1 + 1.0, 7.7]), 3, { pil: true })
bays(seg([OX1, 7.7], [OX1, OY1]), 3, { pil: true })
bays(seg([OX0, 4.75], [OX0, -5.2]), 3, { ground: false })   // the old west wall over the link
// The old block's north and south pediments carry a round window (oculus).
for (const [y, s] of [[OY0, -1], [OY1, 1]] as Array<[number, number]>) {
  const w = s < 0 ? seg([OX0, y], [OX1, y]) : seg([OX1, y], [OX0, y])
  panel(win, w.at(w.L / 2), w.t, w.n, 1.4, EAVE + 0.4, EAVE + 1.8, true, 0.06)
}

// --- chimneys, four pairs along the old block's slopes (lidar)
for (const x of [XM - 5.4, XM + 5.4]) for (const y of [-18.2, -6.0, 5.6, 17.8]) {
  const top = Math.abs(y) > 12 ? 20.0 : 21.3
  box(stone, x - 0.65, y - 0.45, x + 0.65, y + 0.45, 16.5, top - 0.35, 0.1, false)
  box(trim, x - 0.8, y - 0.6, x + 0.8, y + 0.6, top - 0.35, top, 0.1, true)
}

// --- the cupola: an octagonal base, the arcaded drum, cornice, dome
{
  const CX = XM, CY = -0.2, a0 = Math.PI / 8
  const rc = (flat: number) => flat / Math.cos(Math.PI / 8)
  prism(stone, ngon(CX, CY, rc(3.7), 8, a0), 17.6, 20.5, false)
  prism(trim, ngon(CX, CY, rc(3.95), 8, a0), 20.5, 21.1, true, true)
  prism(stone, ngon(CX, CY, rc(3.25), 8, a0), 21.1, 25.0, false)
  for (let k = 0; k < 8; k++) {
    const a = a0 + (2 * Math.PI * k) / 8, b = a + (2 * Math.PI) / 8
    const r = rc(3.25)
    const w = seg([CX + r * Math.cos(a), CY + r * Math.sin(a)], [CX + r * Math.cos(b), CY + r * Math.sin(b)])
    panel(trim, w.at(w.L / 2), w.t, w.n, 1.75, 21.5, 24.6, true, 0.03)
    panel(win, w.at(w.L / 2), w.t, w.n, 1.25, 21.7, 24.4, true, 0.07)
  }
  prism(trim, ngon(CX, CY, rc(3.6), 8, a0), 25.0, 25.5, false, true)
  prism(trim, ngon(CX, CY, rc(4.05), 8, a0), 25.5, 26.2, true, true)
  dome(domeP, CX, CY, 26.2, 3.35, 3.5, 16, 5)
  box(trim, CX - 0.35, CY - 0.35, CX + 0.35, CY + 0.35, 29.5, 30.4, 0.1, true)
  prism(domeP, ngon(CX, CY, 0.12, 6), 30.4, 32.0, true)
}

// ---------------------------------------------------------------- output ---
// The sandstone and cornices are floodlit at night (night photos): walls
// fully, roofs barely.
const lit = (p: V3, n: V3) => (Math.abs(n[2]) > 0.6 ? 0.15 : p[2] < EAVE + 3 ? 0.9 : 0.7)
const parts = [
  { part: stone, material: { ...finish('pc-sandstone', 0xcfc5b2), floodlight: lit } },
  { part: trim, material: { ...finish('pc-stone-trim', 0xe7dfcf), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: domeP, material: finish('pc-cupola-dome', 0x8d988f) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('pc-door', 0x8a5b45) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pioneer Courthouse', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 21.1, elevation: 0, height: 32.0,
})
await Bun.write(new URL('../models/pdx-pioneer-courthouse.glb', import.meta.url), glb)
console.log(`pdx-pioneer-courthouse.glb: ${triangles} triangles, ${glb.length} bytes`)
