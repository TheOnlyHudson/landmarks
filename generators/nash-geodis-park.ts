/**
 * GEODIS Park, Nashville (Nashville SC; opened May 2022, Populous with
 * Hastings) — procedural, CC0-1.0, no textures.
 *   bun generators/nash-geodis-park.ts
 *
 * Map frame: x across the pitch (+x the east side), y along it (+y north),
 * z up, metres. Placed at bearing 343.5°, the pitch's long axis (inner ring
 * way/1385850554 of the building=stadium relation/19122466; the outline's
 * long walls run within 0.5° of it). The anchor is the area centroid of the
 * outline (outer way/1385490388), -86.765975, 36.130045. The pitch centre is
 * at C = (3.8, 4) in this frame; everything below is placed from C.
 *
 * z = 0 is the pitch. Elevation: -6.8. The pitch is sunk below the streets
 * round the stadium: in the 2022 lidar the pitch reads 8.6 m over the grid's
 * lowest return and the paving outside 15.3-15.5 m on the east, north and
 * west sides (first returns on open ground), so 6.7-6.9 m; the photos show
 * the gates at street level opening onto the concourse at the back of the
 * lower rows. No published section was found; a doubt within half a metre.
 * The map's terrain (Mapterhorn) predates the dig and is flat at street level
 * here, so the rows below the street are left out; the seating is drawn
 * from the street up.
 *
 * What makes it read as itself, from the photos and lidar:
 * - one continuous flat black roof over all four sides, a rectangular ring
 *   30 m above the pitch whose inner edge stops at the touchlines, with the
 *   floodlights in a line along that edge;
 * - square corners: the four stands meet in a closed, steep box;
 * - the black steel exterior: columns at a 12.5 m rhythm carrying the roof,
 *   each with a low triangular truss "kicker" at the eave, navy banners hung
 *   between them, over a dark base;
 * - gold-and-navy seats (gold the larger share), the west stand split by the
 *   suite level's glass band;
 * - dark concourse blocks round the foot of the frame, pale on top.
 *
 * Evidence
 * - Lidar, measured: USGS 3DEP TN_DavidsonCo_1_2022. The stadium was
 *   complete in it (roof closed all round, unlike the NAIP frame, which
 *   shows the roof still being laid); 1 m grid, half 150 m, read in this
 *   frame on a 5 m grid and along rays from C. Roof top 30.0-30.5 m above
 *   the pitch, falling 0.7 m to the outer eave; roof opening x ±42-43,
 *   y ±67-68 from C; outer eave x -68 to +72, y -92 to +97; kicker returns
 *   at 25 m about 4 m outside the eave; concourse and plaza blocks 11-13 m
 *   (east, north, south, west), the west corner blocks 21-23 m.
 * - OSM: relation/19122466 (building=stadium; outer way/1385490388, inner
 *   way/1385850554), leisure=stadium way/1056868015 (name, wikidata
 *   Q47528203), the seven gate canopies (building=roof way/1385490396-
 *   1385490400, way/1385850552, way/1385850553), drawn on their outlines.
 * - NAIP (USGS, public domain, during construction): plan, dark roof.
 * - Published (Wikipedia, "Geodis Park"): opened 1 May 2022; 30,000 seats,
 *   the largest soccer-specific stadium in the US; canopy over every seat.
 * - Photos (Wikimedia Commons), compared with renders from their sides:
 *   CheckeredYeti, "GEODIS Park.jpg" (CC BY-SA 4.0, a long side from
 *   outside: black frame, kickers, navy banners, dark base);
 *   cornfield948, "Gate C of Geodis Park by cornfield948 (20220705093936).jpg"
 *   (CC BY-SA 3.0, the frame and kickers close up);
 *   cornfield948, "Nashville SC vs Portland Timbers by cornfield948
 *   (20220705094553).jpg" and "(20220705094311).jpg" (CC BY-SA 3.0,
 *   inside: the closed corners, the roof edge with its lights, the seat
 *   colours, the suite band);
 *   jeremyrs80, "Nashville SC vs Houston Dynamo by jeremyrs80
 *   (20221002204452).jpg" (CC BY-SA 3.0, inside at night: the lit roof edge).
 *
 * Estimated: the rake (from the pitch edge to 26 m under the eave, from the
 * photos), the suite band's height on the west side, the base and banner
 * heights on the facade (from the CheckeredYeti photo), the kicker shape
 * (drawn as a solid triangular fin), the facade's 1.5 m set back under the
 * eave; the gate canopies' height (5.5 m over the street). Not drawn: the pitch (the map's), the gable over Gate C (its side is
 * not certain from the photos), the video board, signs and lettering.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const black = new Part(), gold = new Part(), navy = new Part(), pale = new Part(), win = new Part(), lights = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
function quad(p: Part, P: V3[], hint: V3) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const o = dot(face, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[o[0]], P[o[1]], P[o[2]])
  if (P[o[3]] !== P[o[2]]) p.tri(P[o[0]], P[o[2]], P[o[3]])
}
/** Axis-aligned box in pitch coordinates (from C); `open` skips faces (+x,-x,+y,-y,+z,-z). */
function abox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, open: number[] = []) {
  const P = (x: number, y: number, z: number): V3 => [C[0] + x, C[1] + y, z]
  const f: [V3[], V3][] = [
    [[P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], [1, 0, 0]],
    [[P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)], [-1, 0, 0]],
    [[P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], [0, 1, 0]],
    [[P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)], [0, -1, 0]],
    [[P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], [0, 0, 1]],
    [[P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)], [0, 0, -1]],
  ]
  f.forEach(([q, n], i) => { if (!open.includes(i)) quad(p, q, n) })
}

const C: [number, number] = [3.8, 4]
const S = 6.8 // the street, above the pitch
// Roof opening and eave (from C), lidar.
const IN = { x0: -42.5, x1: 42.5, y0: -67.5, y1: 67.5 }
const OUT = { x0: -68, x1: 72, y0: -92, y1: 97 }
const ROOF_TOP = 30.2, ROOF_BOT = 27.4, SET = 1.5

// ---------------------------------------------------------------------------
// The four sides, each described by its inner and outer line along one axis.
// side: the outward axis (0 = x, 1 = y) and sign; run: the other axis' extent.
type Side = { ax: 0 | 1; s: 1 | -1; inner: number; outer: number }
const SIDES: Side[] = [
  { ax: 0, s: 1, inner: IN.x1, outer: OUT.x1 },
  { ax: 0, s: -1, inner: IN.x0, outer: OUT.x0 },
  { ax: 1, s: 1, inner: IN.y1, outer: OUT.y1 },
  { ax: 1, s: -1, inner: IN.y0, outer: OUT.y0 },
]
/** A point given (distance along the outward axis, along the side, z), in pitch coordinates. */
const pt = (sd: Side, d: number, t: number, z: number): V3 =>
  sd.ax === 0 ? [C[0] + d, C[1] + t, z] : [C[0] + t, C[1] + d, z]
const outN = (sd: Side): V3 => (sd.ax === 0 ? [sd.s, 0, 0] : [0, sd.s, 0])

/**
 * A trapezoid band round the ring between two offsets: inner `a` and outer
 * `b` lines, each a rectangle; the band's four pieces are mitred at the
 * corners, so the bowl closes square as the real one does.
 */
type Rect = { x0: number; x1: number; y0: number; y1: number }
const lerpR = (a: Rect, b: Rect, f: number): Rect => ({
  x0: a.x0 + (b.x0 - a.x0) * f, x1: a.x1 + (b.x1 - a.x1) * f, y0: a.y0 + (b.y0 - a.y0) * f, y1: a.y1 + (b.y1 - a.y1) * f,
})
const corners = (r: Rect, z: number): V3[] => [
  [C[0] + r.x0, C[1] + r.y0, z], [C[0] + r.x1, C[1] + r.y0, z], [C[0] + r.x1, C[1] + r.y1, z], [C[0] + r.x0, C[1] + r.y1, z],
]
/** Ring surface between two rectangles at heights za, zb; facing `face` (up, or in towards the pitch). */
function ring(p: Part | ((side: number) => Part), a: Rect, za: number, b: Rect, zb: number, face: 'up' | 'down' | 'in' | 'out', only?: number[]) {
  const A = corners(a, za), B = corners(b, zb)
  // side index by edge: 0 south (y0), 1 east (x1), 2 north (y1), 3 west (x0)
  for (let i = 0; i < 4; i++) {
    if (only && !only.includes(i)) continue
    const j = (i + 1) % 4
    const outward: V3 = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]][i] as V3
    const hint: V3 = face === 'up' ? add([0, 0, 1], mul(outward, -0.2)) : face === 'down' ? [0, 0, -1] : face === 'in' ? mul(outward, -1) : outward
    const part = typeof p === 'function' ? p(i) : p
    quad(part, [A[i], A[j], B[j], B[i]], hint)
  }
}

// Roof: top, underside, inner and outer fascia; a light strip under the inner edge.
const eave: Rect = OUT, open: Rect = IN
ring(black, open, ROOF_TOP, eave, ROOF_TOP - 0.7, 'up')
ring(black, open, ROOF_BOT, eave, ROOF_BOT, 'down')
ring(black, open, ROOF_BOT, open, ROOF_TOP, 'in')
ring(black, eave, ROOF_BOT, eave, ROOF_TOP - 0.7, 'out')
const lip = { x0: IN.x0 - 0.06, x1: IN.x1 + 0.06, y0: IN.y0 - 0.06, y1: IN.y1 + 0.06 }
ring(lights, lip, ROOF_BOT, lip, ROOF_BOT + 1.1, 'in')

// Seating, from the street up (the rows below it are the map's): one steep
// rake from the touchline (1.5 m) to 26 m under the eave; on the west side
// the suite level splits it, a glass band between two rakes.
const field: Rect = { x0: -45.5, x1: 45.5, y0: -70.5, y1: 70.5 }
const back: Rect = { x0: OUT.x0 + SET + 2, x1: OUT.x1 - SET - 2, y0: OUT.y0 + SET + 2, y1: OUT.y1 - SET - 2 }
const zAt = (f: number) => 1.5 + (26 - 1.5) * f
const fS = (S - 1.5) / (26 - 1.5)
ring(gold, lerpR(field, back, fS), S, back, 26, 'up', [0, 1, 2])
// West: lower rake to 12 m, suite front with its glass to 17 m, upper rake.
{
  const fL = (12 - 1.5) / (26 - 1.5), rL = lerpR(field, back, fL), rU = { ...rL, x0: rL.x0 - 1.2 }
  ring(gold, lerpR(field, back, fS), S, rL, 12, 'up', [3])
  ring(navy, rL, 12, rL, 17, 'in', [3])
  const g = { ...rL, x0: rL.x0 - 0.06 }
  ring(win, g, 13, g, 16.2, 'in', [3])
  ring(navy, rL, 17, rU, 17, 'up', [3])
  ring(gold, rU, 17, back, 26, 'up', [3])
}
// The back of the bowl up to the roof, and the front edge at the street.
ring(black, back, 26, back, ROOF_BOT, 'in')
ring(navy, lerpR(field, back, fS), S - 0.6, lerpR(field, back, fS), S, 'in')
// The mitred corner joints of the west rakes meet the other sides' single
// rake; the steps there are hidden under the roof.

// ---------------------------------------------------------------------------
// Facade: a dark wall set 1.5 m back under the eave, navy banners between
// the columns, the columns carrying the eave with a kicker fin at each.
const wall: Rect = { x0: OUT.x0 + SET, x1: OUT.x1 - SET, y0: OUT.y0 + SET, y1: OUT.y1 - SET }
ring(black, wall, 0, wall, ROOF_BOT, 'out')
ring(black, wall, ROOF_BOT, eave, ROOF_BOT, 'down') // (soffit strip, already under the roof)
const BAY = 12.5
for (const sd of SIDES) {
  const along = sd.ax === 0 ? [OUT.y0, OUT.y1] : [OUT.x0, OUT.x1]
  const n = Math.round((along[1] - along[0]) / BAY), step = (along[1] - along[0]) / n
  const o = outN(sd), dW = sd.ax === 0 ? (sd.s > 0 ? wall.x1 : wall.x0) : (sd.s > 0 ? wall.y1 : wall.y0)
  const dE = sd.outer
  for (let i = 0; i <= n; i++) {
    const t = along[0] + i * step
    // column, 1.2 m square, standing just inside the eave line
    const c = pt(sd, dE - sd.s * 0.7, t, 0)
    abox(black, c[0] - C[0] - 0.6, c[0] - C[0] + 0.6, c[1] - C[1] - 0.6, c[1] - C[1] + 0.6, 0, ROOF_BOT, [5])
    // kicker: a triangular fin in the column's plane, out past the eave and up over the roof
    const tri: V3[] = [pt(sd, dE + sd.s * 3, t, 24), pt(sd, dE - sd.s * 0.2, t, 31.6), pt(sd, dE - sd.s * 6, t, ROOF_TOP - 0.3)]
    const side: V3 = sd.ax === 0 ? [0, 1, 0] : [1, 0, 0]
    const off = (v: V3, k: number) => add(v, mul(side, k))
    const T0 = tri.map(v => off(v, -0.35)), T1 = tri.map(v => off(v, 0.35))
    quad(black, [T1[0], T1[1], T1[2], T1[2]], side)
    quad(black, [T0[0], T0[1], T0[2], T0[2]], mul(side, -1))
    for (let k = 0; k < 3; k++) {
      const l = (k + 1) % 3
      const m = add(mul(add(T0[k], T0[l]), 0.5), mul(add(T0[(k + 2) % 3], T0[(k + 2) % 3]), -0.5))
      quad(black, [T0[k], T0[l], T1[l], T1[k]], [m[0], m[1], m[2]])
    }
    // banner in the bay to the next column
    if (i < n) {
      const a = t + 1.6, b = t + step - 1.6
      const P = (tt: number, z: number) => add(pt(sd, dW, tt, z), mul(o, 0.05))
      quad(navy, [P(a, 15.5), P(b, 15.5), P(b, 25), P(a, 25)], o)
    }
  }
}

// ---------------------------------------------------------------------------
// Concourse and plaza blocks round the foot (lidar heights above the pitch,
// extents within the OSM outline): the dark base walls of the photos, pale
// concrete decks on top as in NAIP, a glass band on the tall west blocks.
const BLOCKS: [number, number, number, number, number][] = [
  [-86, OUT.x0 + SET, -82, 86, 12],
  [OUT.x1 - SET, 88, -82, 84, 12],
  [-78, 60, OUT.y1 - SET, 114, 11],
  [-66, 58, -124, OUT.y0 + SET, 13],
  [-82, OUT.x0 + SET, 48, 72, 22],
  [-82, OUT.x0 + SET, -6, 6, 22.5],
  [-82, OUT.x0 + SET, -72, -54, 22],
]
for (const [x0, x1, y0, y1, h] of BLOCKS) {
  abox(black, x0, x1, y0, y1, 0, h, [4, 5])
  abox(pale, x0, x1, y0, y1, h, h, [0, 1, 2, 3, 5])
  // glass band on the street faces, a storey and a half over the street
  const faces: [V3, V3, V3][] = []
  const Q = (x: number, y: number, z: number): V3 => [C[0] + x, C[1] + y, z]
  if (h > 15) for (const [xa, ya, xb, yb, n] of [[x0, y0, x0, y1, [-1, 0, 0]], [x0, y0, x1, y0, [0, -1, 0]], [x0, y1, x1, y1, [0, 1, 0]]] as [number, number, number, number, V3][]) {
    const e = mul(n, 0.05)
    quad(win, [add(Q(xa, ya, S + 2), e), add(Q(xb, yb, S + 2), e), add(Q(xb, yb, h - 2.5), e), add(Q(xa, ya, h - 2.5), e)], n)
  }
  void faces
}

// ---------------------------------------------------------------------------
// Gate canopies: the seven OSM building=roof ways round the outline (pitch
// coordinates), flat dark slabs 5.5 m over the street on slim posts; the
// two east corner gates are the chevron-shaped ones.
const GATES: [number, [number, number][]][] = [
  [1385490396, [[60.8, -99.0], [67.0, -92.4], [70.0, -92.5], [70.0, -89.7], [76.3, -83.7], [83.2, -90.8], [75.8, -98.1], [68.0, -105.8]]],
  [1385490397, [[-90.5, -96.6], [-86.5, -96.6], [-78.0, -96.5], [-77.9, -83.6], [-86.5, -83.5], [-90.5, -83.5], [-90.5, -89.7]]],
  [1385490398, [[-97.1, 8.4], [-97.2, -4.8], [-92.9, -4.9], [-93.0, 8.4]]],
  [1385490399, [[-86.2, 100.4], [-90.3, 100.5], [-90.3, 93.7], [-90.4, 87.3], [-86.2, 87.1], [-86.2, 93.5]]],
  [1385490400, [[76.4, 86.3], [83.6, 93.4], [76.2, 100.9], [68.3, 108.8], [61.3, 101.8], [67.1, 95.5], [70.5, 95.5], [70.5, 92.3]]],
  [1385850552, [[89.3, -30.0], [89.5, -37.8], [89.6, -46.9], [94.5, -46.8], [94.0, -29.9]]],
  [1385850553, [[88.6, 47.4], [88.6, 39.7], [88.5, 32.0], [94.2, 31.9], [94.2, 47.4]]],
]
for (const [, ring] of GATES) {
  const z0 = S + 5.5, z1 = S + 6.3
  const P = ring.map(([x, y]) => [C[0] + x, C[1] + y] as [number, number])
  const cx = P.reduce((s, q) => s + q[0], 0) / P.length, cy = P.reduce((s, q) => s + q[1], 0) / P.length
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    quad(black, [[cx, cy, z1], [a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], z1]], [0, 0, 1])
    quad(black, [[cx, cy, z0], [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z0]], [0, 0, -1])
    const m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    quad(black, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], m)
  }
  // two posts, at the outer corners farthest apart
  let best = [0, 1], bd = 0
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
    const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])
    if (d > bd) { bd = d; best = [i, j] }
  }
  for (const i of best) {
    const q: [number, number] = [P[i][0] + (cx - P[i][0]) * 0.15, P[i][1] + (cy - P[i][1]) * 0.15]
    abox(black, q[0] - C[0] - 0.3, q[0] - C[0] + 0.3, q[1] - C[1] - 0.3, q[1] - C[1] + 0.3, 0, z0, [4, 5])
  }
}

// ---------------------------------------------------------------------------
// Materials (six): black steel and roof (the style's charcoal floor), the
// gold of the seats pulled to the palette's lightness, navy banners and
// fascias, pale concrete, window, and the roof-edge floodlights.
const parts = [
  { part: black, material: finish('geodis-black', 0x4b5058) },
  { part: gold, material: finish('nashville-sc-gold-seats', 0xcdb85e) },
  { part: navy, material: finish('nashville-sc-navy', 0x4a5786) },
  { part: pale, material: finish('geodis-concrete', 0xd6d3cc) },
  { part: win, material: PALETTE.window },
  { part: lights, material: finish('neon-floodlights', 0xfff3d8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(24), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('GEODIS Park', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 343.5, osm: 'relation/19122466', height: 33.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/nash-geodis-park.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
