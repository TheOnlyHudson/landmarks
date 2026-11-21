/**
 * Segra Park (2019, opened as Segra Park; the Columbia Fireflies' minor
 * league ballpark at BullStreet), Columbia SC. Procedural, CC0-1.0, no
 * textures.  bun generators/cola-segra-park.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the park has no
 * single axis; geometry is taken straight from OSM in east/north metres).
 * Anchor (-81.03123, 34.01832), inside the field near shortstop. Home
 * plate is at about (-28, 30), at the north-west corner; the outfield runs
 * to the south-east.
 *
 * The stands only: the field, the outfield berm and all paving are the
 * map's (STYLE.md, "Don't model the ground"). What is drawn:
 *   - the low seating rake round the infield and down both lines, from
 *     the left-field corner round home plate to the right-field corner;
 *   - the tall covered grandstand block behind third base and home plate
 *     (suites and club levels under a flat white roof);
 *   - the brick entrance building along the north-west street front, with
 *     its raised centre and four round-arched windows (Blazer photo), and a
 *     lower wing to the east;
 *   - the lower first-base and right-field concourse decks;
 *   - five light towers, the three small outfield buildings.
 *
 * Sources
 * - OSM relation/9765439 (building=stadium multipolygon: outer
 *   way/544618137, inner pitch way/565936167); leisure=stadium
 *   way/511599629 (name, wikidata Q20925277); outfield buildings
 *   way/565936174 (roof), way/565936175, way/565936176.
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid, read
 *   in this frame. y = 0 is the lowest ground in the outline, 2.2 m above
 *   the tile's ground_min, on the north street at (41, 107). Measured,
 *   above y = 0: field 1.4; seating rake rises to ~6.8 at its back;
 *   grandstand roof 16.3-17.0 (x -76..-47, y -22..65); entrance building
 *   11.6-11.8 with a 14.0 parapet along the street (x -60..-18); first-base
 *   and right-field decks 6.7; light towers 33.6, 37.0, 34.0, 33.8, 35.4
 *   (tops). The ground rises to the south: ~7.5 behind left field, so the
 *   field sits ~6 m below the south side but at grade with the north
 *   street (elevation 0: the lowest ground is the north street).
 * - NAIP orthophoto (USGS): plan, white roofs, dark green-grey seats.
 * - Photos (EVIDENCE):
 *   Dr. Blazer, "Segra Park" (the brick entrance, arched windows, cream
 *     bands, white cornice), CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Segra_Park.jpg
 *   U.S. Army FJPAO / Nathan Clinebelle, "250610-A-JU979-8739" (inside:
 *     dark green seats, concrete, outfield berm and video board), public
 *     domain, https://commons.wikimedia.org/wiki/File:250610-A-JU979-8739_(9109074).jpg
 *
 * Estimated: the rake's 13 m depth and the field wall height (1.2 m above
 * the field) from the lidar sections; the arched windows' size and spacing
 * (photo, scaled to the 14 m parapet); window bands on the grandstand.
 * Invented: the outfield buildings' 4 m height. Not drawn: the centre-field
 * video board (the lidar has no returns there, so its position and height
 * are unknown); the "SEGRA PARK" letters (an ordinary sign).
 * Doubts: only one exterior photo (the entrance); the grandstand's field
 * side, the decks and the light towers are drawn from lidar and NAIP
 * alone. The tall building on the third-base side (way/565936169, up to
 * 27 m) is treated as a separate building and not modelled or replaced.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cylinder, prism, quad, triangulate, type XY } from './dc-nationals-park'

const brick = new Part(), cream = new Part(), seats = new Part(), roof = new Part(), win = new Part(), pole = new Part()
const Z = 2.2 // lidar height above ground_min of y = 0

// ---------------------------------------------------------------------------
// Seating rake: a strip round the field edge, from the left-field corner
// clockwise round home plate to the right-field corner. Clockwise, so
// outward is to the left of the direction of travel.
const EDGE: XY[] = [[1, -63], [-23, -22], [-32, 8], [-34, 20], [-24, 33], [10, 45], [40, 48], [70, 51], [77, 46], [96, -6]]
const DEPTH = 13, ZIN = 2.6, ZOUT = 6.8
const nrm: XY[] = EDGE.map((p, i) => {
  const a = EDGE[Math.max(0, i - 1)], b = EDGE[Math.min(EDGE.length - 1, i + 1)]
  const d = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [-(b[1] - a[1]) / d, (b[0] - a[0]) / d]
})
const outer: XY[] = EDGE.map((p, i) => [p[0] + nrm[i][0] * DEPTH, p[1] + nrm[i][1] * DEPTH])
for (let i = 0; i < EDGE.length - 1; i++) {
  const a = EDGE[i], b = EDGE[i + 1], c = outer[i + 1], d = outer[i]
  const up: V3 = [0, 0, 1]
  quad(seats, [[a[0], a[1], ZIN], [b[0], b[1], ZIN], [c[0], c[1], ZOUT], [d[0], d[1], ZOUT]], up)
  const inn: V3 = [-nrm[i][0] - nrm[i + 1][0], -nrm[i][1] - nrm[i + 1][1], 0]
  quad(seats, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZIN], [a[0], a[1], ZIN]], inn) // field wall
  quad(cream, [[d[0], d[1], 0], [c[0], c[1], 0], [c[0], c[1], ZOUT], [d[0], d[1], ZOUT]], [-inn[0], -inn[1], 0])
}
for (const i of [0, EDGE.length - 1]) {
  const a = EDGE[i], d = outer[i]
  const t: V3 = i === 0 ? [EDGE[0][0] - EDGE[1][0], EDGE[0][1] - EDGE[1][1], 0] : [EDGE[i][0] - EDGE[i - 1][0], EDGE[i][1] - EDGE[i - 1][1], 0]
  quad(cream, [[a[0], a[1], 0], [d[0], d[1], 0], [d[0], d[1], ZOUT], [a[0], a[1], ZIN]], t)
}

// ---------------------------------------------------------------------------
// Grandstand block behind third base and home plate: brick, a cream band
// under the white roof, a glazed suite band toward the field.
const G: XY[] = [[-63, -22], [-47, -22], [-47, 46], [-38, 52], [-13, 52], [-13, 65], [-58, 65], [-70, 52], [-76, 36], [-76, 14], [-63, 14]]
prism(G, 0, 13.4, brick, null)
prism(G, 13.4, 16.6, cream, roof)
// lower west wing at 11.8 (lidar 14.0)
prism([[-68, -22], [-63, -22], [-63, 14], [-81, 14]], 0, 11.8, brick, roof)
// suite glazing on the field faces
const band = (a: XY, b: XY, z0: number, z1: number, n: XY) =>
  quad(win, [[a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, z0], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, z0], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, z1], [a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, z1]], [n[0], n[1], 0])
for (const [z0, z1] of [[7.6, 10.4], [11.4, 13]]) {
  band([-47, -20], [-47, 45], z0, z1, [1, 0])
  band([-37, 52], [-14, 52], z0, z1, [0, -1])
}
// window panels on the outer west face
for (const [z0, z1] of [[4, 7.5], [8.6, 12.4]]) band([-76, 34], [-76, 16], z0, z1, [-1, 0])

// ---------------------------------------------------------------------------
// Entrance building on the street front, A -> B along the outline.
const A: XY = [-63, 72], B: XY = [18, 99.8]
const fl = Math.hypot(B[0] - A[0], B[1] - A[1])
const u: XY = [(B[0] - A[0]) / fl, (B[1] - A[1]) / fl], out: XY = [-u[1], u[0]]
const at = (s: number, d = 0): XY => [A[0] + u[0] * s + out[0] * d, A[1] + u[1] * s + out[1] * d]
const S1 = 45 // end of the raised centre along the face
prism([[-62, 66], [18, 62], B, A], 0, 11.6, brick, roof)
prism([A, at(S1), at(S1, -14), at(0, -6)], 11.6, 13.0, brick, null)
prism([at(-0.6, 0.6), at(S1 + 0.6, 0.6), at(S1 + 0.6, -14.6), at(-0.6, -6.6)], 13.0, 14.0, cream, roof) // white cornice
// cream string courses along the street face
for (const [z0, z1] of [[3.2, 3.8], [10.4, 11.0]]) {
  const a = at(0, 0.06), b = at(fl, 0.06)
  quad(cream, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [out[0], out[1], 0])
}
// round-arched windows: rectangle and a real semicircle, flush on the face
function arch(s: number, w: number, z0: number, zs: number) {
  const r = w / 2, pts: [number, number][] = [[-r, z0], [r, z0], [r, zs]]
  for (let k = 1; k < 10; k++) { const a = (k / 10) * Math.PI; pts.push([r * Math.cos(a), zs + r * Math.sin(a)]) }
  pts.push([-r, zs])
  const P = pts.map(([o, z]): V3 => { const p = at(s + o, 0.08); return [p[0], p[1], z] })
  for (const [i, j, k] of triangulate(pts as XY[])) quad(win, [P[i], P[j], P[k], P[k]], [out[0], out[1], 0])
  // cream surround pier either side
  for (const sg of [-1, 1]) {
    const c = at(s + sg * (r + 0.9), 0.35)
    box(cream, [c[0], c[1], 5.9], [[u[0], u[1], 0], [out[0], out[1], 0], [0, 0, 1]], [0.6, 0.35, 5.7])
  }
}
for (const s of [8, 18, 28, 38]) arch(s, 6.4, 3.9, 9.0)
for (const s of [53, 62, 71, 80]) arch(s, 4.2, 3.9, 7.2)

// First-base and right-field concourse decks.
// Their field side is the back of the rake.
prism([[18, 62], ...outer.slice(6), [101, 42], [72, 66], [62, 94], [48, 90], [42, 108], [18, 99.8]], 0, 6.7, brick, roof)

// Outfield buildings (OSM), 4 m on their own ground (~5 m up).
for (const P of [
  [[82, -70], [90, -53], [83, -50], [75, -67]],
  [[95, -57], [101, -60], [106, -50], [100, -47]],
  [[106, -34], [112, -37], [116, -29], [110, -27]],
] as XY[][]) prism(P, 0, 9.0, cream, roof)

// Light towers: a slim mast and a bank of lamps facing the field.
const F: XY = [32, -8]
for (const [x, y, top, base] of [[112, -8, 33.6, 0], [-56, -12, 37.0, 16.6], [-30, -52, 34.0, 0], [80, -74, 33.8, 0], [6, -98, 35.4, 0]] as [number, number, number, number][]) {
  cylinder(pole, [x, y], 0.7, base, top - 2, 8, null)
  const d = Math.hypot(F[0] - x, F[1] - y), f: V3 = [(F[0] - x) / d, (F[1] - y) / d, 0], s: V3 = [-f[1], f[0], 0]
  box(pole, [x, y, top - 2], [s, f, [0, 0, 1]], [3.6, 0.6, 2.2], true)
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('segra-brick', 0xb56a4f) },
  { part: cream, material: finish('segra-cream', 0xeadfc6) },
  { part: seats, material: finish('segra-seats', 0x6f7d74) },
  { part: roof, material: finish('segra-roof', 0xdcdedc) },
  { part: win, material: PALETTE.window },
  { part: pole, material: finish('segra-steel', 0xa3a7aa) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Segra Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'relation/9765439', height: 37,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cola-segra-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
