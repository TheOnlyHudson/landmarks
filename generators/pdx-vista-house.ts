/**
 * Vista House at Crown Point (1916-18, Edgar M. Lazarus), Columbia River
 * Gorge, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-vista-house.ts
 *
 * The Historic Columbia River Highway's observatory and rest stop on the
 * Crown Point promontory, 223 m over the river: an octagonal sandstone
 * rotunda in a German Art Nouveau manner. Each of the eight faces holds one
 * wide arch of three tall lights of tinted art glass between heavy rusticated
 * corner piers; four alternate faces carry a door in the middle light. A
 * frieze, a string course and a parapet ring the roof terrace; on it stands
 * a shorter octagonal drum (three lights a face, corner piers, a cornice)
 * under a low dome of green glazed tile with a small finial. The building
 * sits on a ring of broad circular steps, the 64 ft base, over a lower
 * storey (toilets) that opens to the cliff side.
 *
 * Also exports the small masonry kit (polygons, prisms, wall panels,
 * segmental arches, domes) that pdx-multnomah-falls-lodge imports. Merge
 * this generator first.
 *
 * Frame: x east, y north, z up, metres (mesh.ts converts on write), turned
 * to bearing 357.5, so one face of the octagon points north. Origin: the area
 * centroid of OSM way/145892556. z = 0 is the lowest ground under the
 * steps; the map's terrain (Mapterhorn) is a smooth knoll here, 4.5 m at the
 * centre and 3.6-4.2 m at the steps' edge, so the bottom steps sink into it
 * on the high side. elevation 0.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/145892556, the octagon, 5.9 m
 *   faces, 14.2 m across the flats (it matches the published 44 ft); the dome
 *   part way/416451709, about 7.5 m across. OSM's note says Bing imagery is
 *   skewed here and the outline follows GPS traces.
 * - Published (Wikipedia "Vista House", from the NRHP nomination): a domed
 *   rotunda 44 ft (13 m) across, octagonal, on a 64 ft (20 m) base that
 *   houses toilets and a shop; 55 ft (17 m) high (from the lower storey on
 *   the cliff side).
 * - Photos (EVIDENCE):
 *   - Josh B, "Crown Point Vista House.jpg", CC BY-SA 2.0, from the south,
 *     face-on: every proportion below is scaled from it (14.2 m across the
 *     flats = 500 px), the colours of the stone and the green tile dome:
 *     https://commons.wikimedia.org/wiki/File:Crown_Point_Vista_House.jpg
 *   - Kevin Payravi, "Vista House and lot.jpg", CC BY-SA 4.0, from the
 *     south-west, low: the arches, the door faces, the drum's windows:
 *     https://commons.wikimedia.org/wiki/File:Vista_House_and_lot.jpg
 *   - HAER ORE,26-TROUT.V,1D-5 (Historic American Engineering Record, public
 *     domain), "Southwest elevation of Vista House, looking 68 degrees":
 *     the circular steps, the corner piers standing proud of the parapet,
 *     the door in the south-west face:
 *     https://commons.wikimedia.org/wiki/File:SOUTHWEST_ELEVATION_OF_VISTA_HOUSE,_LOOKING_68_DEGREES_EAST-NORTHEAST._-_Historic_Columbia_River_Highway,_Crown_Point,_East_of_Corbett,_Troutdale,_Multnomah_County,_OR_HAER_ORE,26-TROUT.V,1D-5.tif
 *
 * Numbers
 * - Published/OSM: the plan (14.2 m across the flats, the 64 ft steps ring).
 * - From the photo, scaled: eight steps, 1.7 m in all; the walls 5.3 m to
 *   the parapet's top over the floor (string course at 3.9-4.2 m); the arch
 *   springing at 2.6 m and its crown 3.3 m; the drum 8.6 m across, to 8.7 m
 *   over the floor, its lights 6.0-7.6 m; the dome 8 m across (inside the
 *   drum's cornice) and 2.1 m high, its top 10.8 m over the floor; the
 *   finial to 11.35 m. 13.0 m over the plaza in all; the published 55 ft is taken from the lower storey.
 * - Estimated: the steps run right round (the photos show the south half);
 *   the doors are on the four diagonal faces of this frame (the HAER caption
 *   puts one in the south-west face; the photos show doors alternating with
 *   all-glass faces); pier sizes.
 * - Left out: the lower storey's walls on the cliff side (the map's terrain
 *   is too smooth to show where they come out), railings, lamps, the
 *   rustication joints.
 * - Colour: the sandstone grey-buff (#c8bca6 in sun) pulled to #d6cbb6; the
 *   tile dome olive green with gold flecks (#7d9452) pulled to #8ea36a; the
 *   art glass green-grey; the steps grey concrete #c9c4ba.
 *
 * Night: the windows glow (the lit interior), nothing is floodlit.
 *
 * Doubts
 * - The bearing rests on OSM's outline; no aerial was checked. The north
 *   (cliff) side is unphotographed here.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { merged } from './bridge-kit'

// ------------------------------------------------------------ the kit ---
// Map frame: x east, y north, z up, metres (mesh.ts converts on write).
export type XY = [number, number]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A polygon facing `n`, fanned from its first corner (convex or star-shaped from it). */
export function poly(p: Part, P: V3[], n: V3) {
  let f: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    f = [f[0] + c[0], f[1] + c[1], f[2] + c[2]]
  }
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}

const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())

/** A vertical prism over a ring, with optional caps (the top fanned; keep it convex). */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}

/** A rectangle with its corners cut by `c`. */
export function crect(x0: number, y0: number, x1: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
export const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0, top = true, bottom = false) =>
  prism(p, crect(x0, y0, x1, y1, c), z0, z1, top, bottom)

/** A regular polygon ring (n sides) of circumradius r about (cx, cy), starting at angle a0. */
export const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (2 * Math.PI * k) / n), cy + r * Math.sin(a0 + (2 * Math.PI * k) / n)] as XY)

/** A wall segment from a to b with its outward normal (for a ring wound counter-clockwise). */
export function seg(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { a, b, L, t, n: [t[1], -t[0]] as XY, at: (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s] }
}
export type Seg = ReturnType<typeof seg>

/**
 * A flat panel on a wall: `o` the wall point under the panel's centre line,
 * `t` along the wall, `n` the outward normal. `rise` > 0 puts a segmental arch
 * of that rise on top (rise = w/2 is a semicircle); `rise` < 0 a pointed gable.
 */
export function panel(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, rise = 0, off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  if (rise === 0) return poly(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], nn)
  const zs = z1 - Math.abs(rise), h = w / 2
  // Counter-clockwise from the bottom left: up the right jamb, over the head, down the left.
  const pts: V3[] = [at(-h, z0), at(h, z0), at(h, zs)]
  if (rise < 0) pts.push(at(0, z1))
  else {
    const R = (h * h + rise * rise) / (2 * rise), zc = z1 - R, a0 = Math.asin(Math.min(1, h / R))
    for (let k = 1; k < 10; k++) { const a = a0 - (2 * a0 * k) / 10; pts.push(at(R * Math.sin(a), zc + R * Math.cos(a))) }
  }
  pts.push(at(-h, zs))
  poly(p, pts, nn)
}

/** A shallow block standing proud of a wall (a pier, a surround, a band): depth d. */
export function slabOn(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, d: number) {
  const P = (s: number, k: number): XY => [o[0] + t[0] * s + n[0] * k, o[1] + t[1] * s + n[1] * k]
  prism(p, [P(-w / 2, -0.02), P(w / 2, -0.02), P(w / 2, d), P(-w / 2, d)], z0, z1, true)
}

/** A dome (half ellipsoid) of radius r and height h over (cx, cy, z0), n around, m up, smooth-shaded. */
export function dome(p: Part, cx: number, cy: number, z0: number, r: number, h: number, n = 16, m = 5) {
  const pt = (k: number, i: number): [V3, V3] => {
    const a = (k / m) * (Math.PI / 2), b = (2 * Math.PI * i) / n
    const P: V3 = [cx + r * Math.cos(a) * Math.cos(b), cy + r * Math.cos(a) * Math.sin(b), z0 + h * Math.sin(a)]
    const N: V3 = [Math.cos(a) * Math.cos(b) / r, Math.cos(a) * Math.sin(b) / r, Math.sin(a) / h]
    const l = Math.hypot(...N)
    return [P, [N[0] / l, N[1] / l, N[2] / l]]
  }
  for (let k = 0; k < m; k++) for (let i = 0; i < n; i++) {
    const [a, na] = pt(k, i), [b, nb] = pt(k, i + 1), [c, nc] = pt(k + 1, i + 1), [d, nd] = pt(k + 1, i)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    if (k < m - 1) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/** A ring offset outward by d (inward when negative), mitred. */
export function offset(ring: XY[], d: number): XY[] {
  const r = ccw(ring), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const t1 = norm2([p[0] - a[0], p[1] - a[1]]), t2 = norm2([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [t1[1], -t1[0]], n2: XY = [t2[1], -t2[0]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k] as XY
  })
}
export function norm2(v: XY): XY { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A projecting band (cornice, string course) round a ring: its face d out, top and soffit. */
export function band(p: Part, ring: XY[], d: number, z0: number, z1: number) {
  const a = ccw(ring), o = offset(a, d), n = a.length
  prism(p, o, z0, z1, false)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    poly(p, [[a[i][0], a[i][1], z1], [a[j][0], a[j][1], z1], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1]], [0, 0, 1])
    poly(p, [[a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0]], [0, 0, -1])
  }
}

/** A parapet of thickness th standing on a ring from z0 to z1. */
export function parapet(p: Part, ring: XY[], th: number, z0: number, z1: number) {
  const a = ccw(ring), inner = offset(a, -th), n = a.length
  prism(p, a, z0, z1, false)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const t = norm2([a[j][0] - a[i][0], a[j][1] - a[i][1]])
    poly(p, [[inner[j][0], inner[j][1], z0], [inner[i][0], inner[i][1], z0], [inner[i][0], inner[i][1], z1], [inner[j][0], inner[j][1], z1]], [-t[1], t[0], 0])
    poly(p, [[inner[i][0], inner[i][1], z1], [a[i][0], a[i][1], z1], [a[j][0], a[j][1], z1], [inner[j][0], inner[j][1], z1]], [0, 0, 1])
  }
}

// ------------------------------------------------------------ the model ---
if (import.meta.main) {
  const stone = new Part()   // sandstone walls and piers
  const trim = new Part()    // steps, arch stones, string course, cornices, mullions
  const domeP = new Part()   // green glazed tile
  const win = new Part()     // art glass
  const door = new Part()    // bronze doors
  const steps = new Part()   // concrete steps
  const roof = new Part()    // the tile ring at the dome's foot (dome colour)

  const C8 = Math.cos(Math.PI / 8)
  const oct = (flat: number) => ngon(0, 0, flat / 2 / C8, 8, Math.PI / 8)   // faces toward the axes and diagonals

  // --- the circular steps (the 64 ft base), eight risers, 16 sides
  const NSTEP = 8, RISE = 0.21, R0 = 9.9, TREAD = 0.19
  for (let k = 0; k < NSTEP; k++) prism(steps, ngon(0, 0, R0 - k * TREAD, 16, Math.PI / 16), 0, (k + 1) * RISE, true)
  const F = NSTEP * RISE                     // the floor, 1.68

  // --- the rotunda: walls, string course, frieze, parapet round the terrace
  const FLAT = 14.2, WALL = F + 4.6, PARA = F + 5.3
  const ring = oct(FLAT)
  prism(stone, ring, 0.5, WALL, true)
  band(trim, ring, 0.18, F + 3.9, F + 4.2)
  parapet(stone, offset(ring, 0.05), 0.45, WALL, PARA)
  band(trim, offset(ring, 0.05), 0.1, PARA - 0.12, PARA)

  // Corner piers: heavy, radial, standing a little proud of the parapet.
  const RC = FLAT / 2 / C8
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (2 * Math.PI * k) / 8, u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
    const P = (r: number, s: number): XY => [u[0] * r + v[0] * s, u[1] * r + v[1] * s]
    prism(stone, [P(RC - 1.0, -0.8), P(RC + 0.25, -0.8), P(RC + 0.25, 0.8), P(RC - 1.0, 0.8)], 0.5, PARA + 0.05, false)
    prism(trim, [P(RC - 1.05, -0.86), P(RC + 0.31, -0.86), P(RC + 0.31, 0.86), P(RC - 1.05, 0.86)], PARA + 0.05, PARA + 0.25, true)
  }

  // Each face: the arch's stones, three lights of art glass, two mullions; a door on the diagonals.
  const rr = ccw(ring)
  for (let k = 0; k < 8; k++) {
    const w = seg(rr[k], rr[(k + 1) % 8]), o = w.at(w.L / 2)
    const hasDoor = k % 2 === 0          // faces at 45, 135, 225, 315 degrees in this frame
    panel(trim, o, w.t, w.n, 4.5, F + 2.4, F + 3.75, 0.75, 0.03)                    // voussoir band
    panel(win, o, w.t, w.n, 3.9, F + 0.15, F + 3.35, 0.65, 0.06)
    for (const s of [-0.68, 0.68]) slabOn(trim, w.at(w.L / 2 + s), w.t, w.n, 0.24, F + 0.15, F + 3.25, 0.12)
    panel(trim, o, w.t, w.n, 3.9, F, F + 0.15, 0, 0.06)                              // sill
    if (hasDoor) {
      panel(door, o, w.t, w.n, 1.1, F, F + 2.35, 0, 0.09)
      slabOn(trim, o, w.t, w.n, 1.3, F + 2.35, F + 2.5, 0.12)                         // transom bar
    }
  }

  // --- the drum on the terrace: piers, three lights a face, cornice
  const DFLAT = 8.6, DTOP = F + 8.7, DR = DFLAT / 2 / C8
  const dring = oct(DFLAT)
  prism(stone, dring, WALL, DTOP - 0.4, false)
  band(trim, dring, 0.3, DTOP - 0.4, DTOP)
  poly(trim, offset(dring, 0.3).map(([x, y]) => [x, y, DTOP] as V3), [0, 0, 1])
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (2 * Math.PI * k) / 8, u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
    const P = (r: number, s: number): XY => [u[0] * r + v[0] * s, u[1] * r + v[1] * s]
    prism(stone, [P(DR - 0.6, -0.5), P(DR + 0.22, -0.5), P(DR + 0.22, 0.5), P(DR - 0.6, 0.5)], WALL, DTOP - 0.4, false)
  }
  const dr = ccw(dring)
  for (let k = 0; k < 8; k++) {
    const w = seg(dr[k], dr[(k + 1) % 8]), o = w.at(w.L / 2)
    panel(trim, o, w.t, w.n, 2.6, F + 5.8, F + 7.85, 0, 0.03)
    panel(win, o, w.t, w.n, 2.2, F + 6.0, F + 7.6, 0.25, 0.06)
    for (const s of [-0.38, 0.38]) slabOn(trim, w.at(w.L / 2 + s), w.t, w.n, 0.16, F + 6.0, F + 7.5, 0.1)
  }

  // --- the dome of green glazed tile and its finial
  poly(roof, offset(dring, 0.3).map(([x, y]) => [x, y, DTOP + 0.01] as V3), [0, 0, 1])
  dome(domeP, 0, 0, DTOP, 4.0, 2.1, 16, 5)
  prism(trim, ngon(0, 0, 0.45, 8), DTOP + 2.0, DTOP + 2.3, true)
  prism(domeP, ngon(0, 0, 0.3, 8), DTOP + 2.3, DTOP + 2.65, true)

  // ---------------------------------------------------------------- output
  const parts = [
    { part: stone, material: finish('vh-sandstone', 0xd6cbb6) },
    { part: trim, material: finish('vh-stone-trim', 0xe6dece) },
    { part: merged(domeP, roof), material: finish('vh-tile-dome', 0x8ea36a) },
    { part: steps, material: finish('vh-steps', 0xc9c4ba) },
    { part: win, material: { name: 'window', color: 0x66807b, roughness: 0.35 } },
    { part: door, material: finish('vh-door', 0x7a6a55) },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Vista House', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/145892556, on the lowest ground under the steps',
    bearing: 357.5, elevation: 0, height: DTOP + 2.65,
  })
  await Bun.write(new URL('../models/pdx-vista-house.glb', import.meta.url), glb)
  console.log(`pdx-vista-house.glb: ${triangles} triangles, ${glb.length} bytes`)
}
