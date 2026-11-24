/**
 * Sky Chaser, Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-sky-chaser.ts
 *
 * Map frame: x east, y north, z up, metres, built in the ride's own frame:
 * x across its width, y along its length. The placement's bearing (351.5°,
 * the long sides of OSM way/1483353317) turns it into place. The origin is
 * the centroid of that way (building=roof, layer=1, mapped February 2026),
 * 13.3 x 23.2 m, on the ground. Level ground, elevation 0.
 *
 * The ride. Luna Park's high ropes course: "NYC's first 50-foot high
 * bespoke oceanside ropes courses and adventure zones" (Luna Park), a
 * "Sky Trail" structure by Ropes Courses Inc., between the Thunderbolt and
 * the Astro Tower by the boardwalk. Its frame carries the "SKY CHASER"
 * board (July 2024 photo). OSM tags its node (node/11217196503) "Sky Tykes"
 * with alt_name "Sky Chaser": Sky Tykes is the park's kiddie ropes course,
 * which Luna Park places near the Tickler; the structure here is Sky
 * Chaser, so the model takes that name.
 *
 * Evidence and what rests on it:
 *   the footprint: OSM way/1483353317 (the tent roof), matched on the NAIP
 *     orthophoto by a grey rectangle the same size;
 *   the height: published 50 ft (15.2 m) to the roof's eaves; the three
 *     course levels at about 4, 8 and 12 m and the roof truss from 13 to
 *     15 m scaled from Galeotti's October 2023 photo against the eaves; the
 *     tent's peaks about 3.8 m over the eaves (same photo). Estimated, ±15%;
 *   the frame: white round columns (yellow sleeves on some), red beams with
 *     red star-painted drum platforms at the columns, yellow walk beams, red
 *     stairs, a white lattice roof truss, a yellow ring course at one end:
 *     photos; the column grid (3 x 5) is an estimate from the photos;
 *   the tent: three peaks along the length, red crowns over a white band
 *     and a red valance (October 2023). Doubt: the July 2024 and August
 *     2022 photos show the frame without the tent (2022 even without the
 *     roof truss); OSM's 2026 roof suggests the tent stands at least in the
 *     off-season. The model has it, as the mapped roof and the strongest
 *     read from above.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Riegelmann Boardwalk - Coney Island, Brooklyn, New York City, New York,
 *     USA - October 3, 2023 03", Giorgio Galeotti, CC BY-SA 4.0 (from the
 *     east; tent, levels, truss)
 *   "Coney Island Brooklyn July 2024 023", "028", "034", Kidfly182,
 *     CC BY 4.0 (the frame close up, with the SKY CHASER board)
 *   "Coney Island August 2022 012", Kidfly182, CC BY-SA 4.0 (the frame
 *     from below, branded "Sky Trail")
 * Look-only: none.
 *
 * Style: no ropes, nets or rails (too thin to read); the course is its
 * frame. Beams are plain box sections; the lattice truss is a solid white
 * band. No lettering.
 *
 * Doubts: the tent (above); the column grid; the stairs' positions.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A smooth vertical cylinder at (cx, cy) between heights, optional caps. */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n: number, caps = false) {
  const pt = (k: number, z: number): V3 => [cx + r * Math.cos((k / n) * TAU), cy + r * Math.sin((k / n) * TAU), z]
  const nr = (k: number): V3 => [Math.cos((k / n) * TAU), Math.sin((k / n) * TAU), 0]
  for (let k = 0; k < n; k++) {
    const j = k + 1
    p.tri(pt(k, z0), pt(j, z0), pt(j, z1), undefined, undefined, undefined, [nr(k), nr(j), nr(j)])
    p.tri(pt(k, z0), pt(j, z1), pt(k, z1), undefined, undefined, undefined, [nr(k), nr(j), nr(k)])
  }
  if (caps) {
    p.cap(Array.from({ length: n }, (_, k) => pt(k, z1)), true)
    p.cap(Array.from({ length: n }, (_, k) => pt(k, z0)), false)
  }
}

/** A box beam of width w and depth d (top at z) from (x0, y0) to (x1, y1). */
function beam(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, w: number, d: number) {
  const ax = unit([x1 - x0, y1 - y0, 0]), s: V3 = [-ax[1], ax[0], 0]
  const c = (x: number, y: number, side: number, zz: number): V3 => [x + s[0] * side * w / 2, y + s[1] * side * w / 2, zz]
  const A = [c(x0, y0, -1, z - d), c(x1, y1, -1, z - d), c(x1, y1, 1, z - d), c(x0, y0, 1, z - d)]
  const B = A.map(([x, y]) => [x, y, z] as V3)
  // A runs -side→+side along the beam: make each ring counter-clockwise from above.
  const ccw = (r: V3[]) => {
    const n = cross(sub(r[1], r[0]), sub(r[2], r[0]))
    return n[2] >= 0 ? r : [...r].reverse()
  }
  const a = ccw(A), b = ccw(B)
  p.loft([a, b]); p.cap(b, true); p.cap(a, false)
}

/** A sloped box (stair flight) between two points, width w, depth d. */
function flight(p: Part, a: V3, b: V3, w: number, d: number) {
  const ax = unit(sub(b, a)), s: V3 = unit(cross(ax, [0, 0, 1])), up = cross(s, ax)
  const P = (q: V3, i: number, j: number): V3 => add(add(q, mul(s, (i * w) / 2)), mul(up, j * d))
  const r0 = [P(a, -1, -1), P(a, 1, -1), P(a, 1, 0), P(a, -1, 0)], r1 = [P(b, -1, -1), P(b, 1, -1), P(b, 1, 0), P(b, -1, 0)]
  // Sides as quads, each wound from the outside.
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const q = [r0[k], r0[j], r1[j], r1[k]]
    const n = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    const mid = mul(add(q[0], q[2]), 0.5), cen = mul(add(add(r0[0], r0[2]), add(r1[0], r1[2])), 0.25)
    if (n[0] * (mid[0] - cen[0]) + n[1] * (mid[1] - cen[1]) + n[2] * (mid[2] - cen[2]) >= 0) p.quad(q[0], q[1], q[2], q[3])
    else p.quad(q[3], q[2], q[1], q[0])
  }
  // End caps.
  for (const [r, out] of [[r0, mul(ax, -1)], [r1, ax]] as [V3[], V3][]) {
    const n = cross(sub(r[1], r[0]), sub(r[2], r[0]))
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.quad(r[0], r[1], r[2], r[3])
    else p.quad(r[3], r[2], r[1], r[0])
  }
}

// ------------------------------------------------------------- materials ---
const WHITE = PALETTE.trim
const RED = finish('sky-chaser-red', 0xc9423a)
const YELLOW = finish('sky-chaser-yellow', 0xe6bd3a)
const TENT_WHITE = finish('sky-chaser-canvas', 0xf3ece4)

const white = new Part(), red = new Part(), yellow = new Part(), canvas = new Part()

// ----------------------------------------------------------------- frame ---
const XS = [-6.0, 0, 6.0], YS = [-10.8, -5.4, 0, 5.4, 10.8]
const LEVELS = [4.0, 8.0, 12.0], TRUSS0 = 13.2, EAVE = 15.0
const perimeter = (x: number, y: number) => Math.abs(x) > 1 || Math.abs(y) > 10
for (const x of XS) for (const y of YS) {
  cyl(white, x, y, 0.28, 0, EAVE - 0.2, 8)
  // Yellow sleeves between the first two levels on every other column.
  if ((XS.indexOf(x) + YS.indexOf(y)) % 2 === 0) cyl(yellow, x, y, 0.33, LEVELS[0] + 0.3, LEVELS[1] - 1.0, 8)
}
for (const z of LEVELS) {
  // Red beams round the edges and across; yellow walk beams down the middle line.
  for (const x of XS) for (let j = 0; j < YS.length - 1; j++) beam(x === 0 ? yellow : red, x, YS[j], x, YS[j + 1], z, x === 0 ? 0.5 : 0.4, 0.45)
  for (const y of YS) for (let i = 0; i < XS.length - 1; i++) beam(red, XS[i], y, XS[i + 1], y, z, 0.4, 0.45)
  // Star-painted drum platforms under the outer columns' crossings.
  for (const x of XS) for (const y of YS) if (perimeter(x, y)) cyl(red, x, y, 0.95, z - 1.0, z - 0.2, 10, true)
}
// Red diagonal braces in the long faces' end bays, ground to the first level.
for (const x of [-6.0, 6.0]) for (const [y0, y1] of [[-10.8, -5.4], [5.4, 10.8]]) {
  const a: V3 = [x, y0, 0.75], b: V3 = [x, y1, LEVELS[0] - 0.5]
  flight(red, a, b, 0.3, 0.35)
}
// Stairs: red flights up the east side, zigzagging level to level.
flight(red, [7.0, -4.8, 0.75], [7.0, 3.6, LEVELS[0]], 1.1, 0.4)
flight(red, [7.0, 3.6, LEVELS[0]], [7.0, -4.8, LEVELS[1]], 1.1, 0.4)
flight(red, [7.0, -4.8, LEVELS[1]], [7.0, 3.6, LEVELS[2]], 1.1, 0.4)
// The white roof truss: a band round the edge and one across at each column line.
for (const x of [-6.0, 6.0]) beam(white, x, -11.1, x, 11.1, EAVE - 0.2, 0.45, EAVE - 0.2 - TRUSS0)
for (const y of [-10.8, 10.8]) beam(white, -6.2, y, 6.2, y, EAVE - 0.2, 0.45, EAVE - 0.2 - TRUSS0)
for (const y of YS.slice(1, -1)) beam(white, -6.0, y, 6.0, y, EAVE - 0.2, 0.3, 1.0)
// The yellow ring course at the south end.
{
  const c: V3 = [0, -9.4, 12.6], R = 2.6, r = 0.2, seg = 20, sides = 6
  for (let i = 0; i < seg; i++) for (let k = 0; k < sides; k++) {
    const at = (ii: number, kk: number): [V3, V3] => {
      const a = (ii / seg) * TAU, b = (kk / sides) * TAU
      const rad: V3 = [Math.cos(a), Math.sin(a), 0]
      const n: V3 = add(mul(rad, Math.cos(b)), [0, 0, Math.sin(b)])
      return [add(add(c, mul(rad, R)), mul(n, r)), n]
    }
    const [p00, n00] = at(i, k), [p10, n10] = at(i + 1, k), [p11, n11] = at(i + 1, k + 1), [p01, n01] = at(i, k + 1)
    yellow.tri(p00, p10, p11, undefined, undefined, undefined, [n00, n10, n11])
    yellow.tri(p00, p11, p01, undefined, undefined, undefined, [n00, n11, n01])
  }
}

// ------------------------------------------------------------------ tent ---
// Three peaks along the length over the eaves, red crowns over a white band.
const TX = 6.85, TY = 11.85, PEAKS = [-7.7, 0, 7.7], RISE = 3.8
const lift = (x: number, y: number) => {
  let f = 0
  for (const yi of PEAKS) {
    const d = Math.hypot(x / TX, (y - yi) / 5.2)
    f = Math.max(f, Math.max(0, 1 - d) ** 2.2)
  }
  return f * Math.min(1, (TY - Math.abs(y)) / 1.5, (TX - Math.abs(x)) / 1.5)
}
{
  const NX = 12, NY = 30
  const P = (i: number, j: number): V3 => {
    const x = -TX + (2 * TX * i) / NX, y = -TY + (2 * TY * j) / NY
    return [x, y, EAVE + RISE * lift(x, y)]
  }
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    const f = (lift(a[0], a[1]) + lift(b[0], b[1]) + lift(c[0], c[1]) + lift(d[0], d[1])) / 4
    const top = f > 0.22 ? red : canvas
    top.quad(a, b, c, d)
    // The underside, seen from beside and below.
    canvas.quad(d, c, b, a)
  }
  // The red valance round the eaves, both faces.
  const Z0 = EAVE - 0.75
  const corners: [number, number][] = [[-TX, -TY], [TX, -TY], [TX, TY], [-TX, TY]]
  for (let k = 0; k < 4; k++) {
    const [x0, y0] = corners[k], [x1, y1] = corners[(k + 1) % 4]
    red.quad([x0, y0, Z0], [x1, y1, Z0], [x1, y1, EAVE], [x0, y0, EAVE])
    red.quad([x1, y1, Z0], [x0, y0, Z0], [x0, y0, EAVE], [x1, y1, EAVE])
  }
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: white, material: WHITE },
  { part: red, material: RED },
  { part: yellow, material: YELLOW },
  { part: canvas, material: TENT_WHITE },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sky Chaser', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 351.5, elevation: 0, height: EAVE + RISE, osm: 'way/1483353317',
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/nyc-sky-chaser.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
