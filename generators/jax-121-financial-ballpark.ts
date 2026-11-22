/**
 * 121 Financial Ballpark, Jacksonville (Minor League Baseball, Jacksonville
 * Jumbo Shrimp; opened 2003 as the Baseball Grounds of Jacksonville; HOK
 * Sport; Bragan Field) — procedural, CC0-1.0, no textures.
 * bun generators/jax-121-financial-ballpark.ts
 *
 * Map frame: x along the first-base line's stands (+x towards right field,
 * east-south-east), y along the third-base stands (+y towards left field,
 * north-north-east), z up, metres. Placed at bearing 15°, the downtown
 * street grid the stands' outline follows (west edge 16°, south edge
 * 105°). Anchor: -81.64285, 30.32503 (the lead's point, inside the field
 * near the infield; the lidar grid is centred on it).
 *
 * The stands only: the field is the map's (STYLE.md, "Don't model the
 * ground"). z = 0 is the lowest ground; the field and the streets are
 * within a metre or two of it, so `elevation` is 0.
 *
 * What makes it read as itself: an L of red-brick grandstand round home
 * plate, the third-base side under a long blue-grey standing-seam roof on
 * green steel, the roof wrapping round behind home plate, where the brick
 * home-plate gate block rises at the corner under a hipped roof; the
 * first-base side open, its seats rising to a lower brick concourse; a low
 * party deck along right field.
 *
 * Evidence
 * - OSM: building=stadium way/326793763 (the stands' L), inside leisure=
 *   stadium way/326793769 (the park, not a building). No building:part.
 * - Measured, lidar: USGS 3DEP FL_Peninsular_FDEM_Duval_2018 (flown 2018),
 *   1 m grid, read in this frame (5 m table); above the lowest ground:
 *   - third-base roof 19.5-20.5 m over x -77..-58, its front eave 17 m;
 *     the concourse building behind it 12.5-13.5 m to x = -85;
 *   - the roof behind home plate 20.5 m at its back (y -65), 17-18 m at its
 *     front (y -50), from x -75 to x 5;
 *   - first-base seats rising from 4 m (y -45) to 7.3 m (y -60); the
 *     concourse behind them 11-13 m (y -65..-72);
 *   - right-field deck 7-8 m (x 74-85); the lamp masts 27-28 m (x 82),
 *     36-38 m (x -70, y -5; x -20, y -60; x -30, y 50).
 * - Measured, USGS NAIP orthophoto 2023 (0.4 m): plan; the blue-grey roof;
 *   dark green seats.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Kenny Rowland, "121 Financial Ballpark exterior" (CC BY-SA 4.0; the
 *     home-plate gate: brick piers, green steel, the roof and its trusses)
 *     https://commons.wikimedia.org/wiki/File:121_Financial_Ballpark_exterior.jpg
 *   Kenny Rowland, "121 Financial Ballpark during a ballgame" (CC BY-SA
 *     4.0; the light masts and the outfield, at night)
 *     https://commons.wikimedia.org/wiki/File:121_Financial_Ballpark_during_a_ballgame.jpg
 *   Michael Rivera, "Baseball Grounds of Jacksonville Home Plate Gate"
 *     (CC BY-SA 3.0)
 *     https://commons.wikimedia.org/wiki/File:Baseball_Grounds_of_Jacksonville_Home_Plate_Gate.JPG
 * - Estimated: the hipped roof over the gate block (from the exterior
 *   photo's gable trusses); window and opening sizes; the seat rakes'
 *   lower ends; the light masts' heads.
 * - Not drawn: the scoreboard in left-centre (outside the stands' outline),
 *   lettering, railings, the trusses' members.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { PALETTE } from './palette'
import { box, prism, quad, type XY } from './dc-nationals-park'

const brick = new Part(), roof = new Part(), seats = new Part(), steel = new Part(), win = new Part(), stone = new Part()
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A brick block with a stone cap. */
function block(poly: XY[], h: number) {
  prism(poly, 0, h - 0.6, brick, null)
  prism(poly, h - 0.6, h, stone, roof)
}
/** A bank of seats over a rectangle, rising from zLo at one side to zHi at the opposite one. */
function rake(x0: number, x1: number, y0: number, y1: number, zLo: number, zHi: number, rise: 'x+' | 'x-' | 'y+' | 'y-') {
  const z = (x: number, y: number) => {
    const t = rise === 'x+' ? (x - x0) / (x1 - x0) : rise === 'x-' ? (x1 - x) / (x1 - x0) : rise === 'y+' ? (y - y0) / (y1 - y0) : (y1 - y) / (y1 - y0)
    return zLo + (zHi - zLo) * t
  }
  const P = (x: number, y: number, top: boolean): V3 => [x, y, top ? z(x, y) : 0]
  quad(seats, [P(x0, y0, true), P(x1, y0, true), P(x1, y1, true), P(x0, y1, true)], Z)
  quad(brick, [P(x0, y0, false), P(x1, y0, false), P(x1, y0, true), P(x0, y0, true)], [0, -1, 0])
  quad(brick, [P(x1, y1, false), P(x0, y1, false), P(x0, y1, true), P(x1, y1, true)], [0, 1, 0])
  quad(brick, [P(x0, y1, false), P(x0, y0, false), P(x0, y0, true), P(x0, y1, true)], [-1, 0, 0])
  quad(brick, [P(x1, y0, false), P(x1, y1, false), P(x1, y1, true), P(x1, y0, true)], [1, 0, 0])
}
/** A sloped roof slab with its fascia, high at the back. */
function roofSlab(x0: number, x1: number, y0: number, y1: number, zFront: number, zBack: number, back: 'x-' | 'y-') {
  const t = 0.5
  const z = (x: number, y: number) => back === 'x-' ? zBack + ((zFront - zBack) * (x - x0)) / (x1 - x0) : zBack + ((zFront - zBack) * (y - y0)) / (y1 - y0)
  const P = (x: number, y: number, d: number): V3 => [x, y, z(x, y) + d]
  quad(roof, [P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0)], Z)
  quad(steel, [P(x0, y0, -t), P(x0, y1, -t), P(x1, y1, -t), P(x1, y0, -t)], [0, 0, -1])
  const edges: [XY, XY, V3][] = [[[x0, y0], [x1, y0], [0, -1, 0]], [[x1, y1], [x0, y1], [0, 1, 0]], [[x0, y1], [x0, y0], [-1, 0, 0]], [[x1, y0], [x1, y1], [1, 0, 0]]]
  for (const [a, b, n] of edges) quad(steel, [P(a[0], a[1], -t), P(b[0], b[1], -t), P(b[0], b[1], 0), P(a[0], a[1], 0)], n)
}
/** Green steel columns along a line. */
function columns(a: XY, b: XY, n: number, z1: (p: XY) => number) {
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const p: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const h = z1(p)
    box(steel, [p[0], p[1], h / 2], [X, Y, Z], [0.35, 0.35, h / 2])
  }
}
/** A flat panel on a wall face. */
function panel(p: Part, a: XY, b: XY, n: V3, z0: number, z1: number, off = 0.06) {
  const q = (s: XY, z: number): V3 => [s[0] + n[0] * off, s[1] + n[1] * off, z]
  quad(p, [q(a, z0), q(b, z0), q(b, z1), q(a, z1)], n)
}

// --- Third-base grandstand (west), roofed.
block(rect(-85, -77, -48, 18), 13) // the concourse building behind
rake(-77, -50, -46, 17, 1.5, 12, 'x-') // seats, rising away from the field
roofSlab(-78, -57, -50, 18, 17, 20.3, 'x-')
columns([-58.5, -44], [-58.5, 14], 6, ([x, y]) => 17 + 0 * x * y)
columns([-77.5, -44], [-77.5, 14], 6, () => 12.6)
// Windows on the street (west) wall: broad bays between brick piers.
for (let y = -46; y < 16; y += 8) {
  panel(win, [-85, y + 6.6], [-85, y + 1.4], [-1, 0, 0], 4.2, 8.2)
  panel(steel, [-85, y + 6.6], [-85, y + 1.4], [-1, 0, 0], 9.2, 11.6)
}
// The north end of the stand: a low party deck block.
block(rect(-84, -62, 18, 24), 13)

// --- Behind home plate and the first-base side under the roof (south).
block(rect(-76, 8, -75, -66), 15) // the suite and concourse building
rake(-44, 8, -66, -40, 1.5, 12, 'y-')
roofSlab(-58, 8, -67, -48, 17.2, 20.5, 'y-')
columns([-44, -48.5], [6, -48.5], 6, () => 17.1)
// The south street wall: windows between piers, a steel band.
for (let x = -74; x < 6; x += 8) {
  panel(win, [x + 1.4, -75], [x + 6.6, -75], [0, -1, 0], 4.2, 8.2)
  panel(win, [x + 1.4, -75], [x + 6.6, -75], [0, -1, 0], 9.4, 13.4)
}

// --- The home-plate gate block at the corner: brick piers, glazed and
// open levels, and the hipped roof over it.
{
  const poly: XY[] = [[-85, -62], [-80, -70], [-72, -76], [-56, -76], [-56, -48], [-85, -48]]
  block(poly, 15.6)
  // Its corner face (towards the street corner): windows, a steel band.
  const a: XY = [-80, -70], b: XY = [-72, -76], L = Math.hypot(8, 6)
  const n: V3 = [-6 / L, -8 / L, 0]
  panel(win, a, b, n, 4.0, 7.6)
  panel(win, a, b, n, 9.0, 13.4)
  // Hipped roof: eaves at 15.6 m out over the walls, a ridge at 21.5 m.
  const e = 1.2, z0 = 15.6, z1 = 21.5
  const E: V3[] = [[-85 - e, -62, z0], [-80 - e * 0.7, -70 - e * 0.7, z0], [-72, -76 - e, z0], [-56 + e, -76 - e, z0], [-56 + e, -48 + e, z0], [-85 - e, -48 + e, z0]]
  const R0: V3 = [-74, -64, z1], R1: V3 = [-64, -60, z1]
  const faces: [V3[], V3][] = [
    [[E[0], E[1], R0, R0], [-1, -0.6, 1]],
    [[E[1], E[2], R0, R0], [-0.6, -1, 1]],
    [[E[2], E[3], R1, R0], [0, -1, 1]],
    [[E[3], E[4], R1, R1], [1, 0, 1]],
    [[E[4], E[5], R0, R1], [0, 1, 1]],
    [[E[5], E[0], R0, R0], [-1, 0, 1]],
  ]
  for (const [q, h] of faces) quad(roof, q, h)
  // Its green steel fascia.
  for (let i = 0; i < E.length; i++) {
    const p = E[i], q = E[(i + 1) % E.length]
    const nn: V3 = [q[1] - p[1], -(q[0] - p[0]), 0]
    quad(steel, [[p[0], p[1], z0 - 0.7], [q[0], q[1], z0 - 0.7], [q[0], q[1], z0], [p[0], p[1], z0]], nn)
  }
}

// --- First-base side (open seats) and its concourse, and the right-field
// party deck.
rake(8, 62, -62, -40, 1.5, 7.3, 'y-')
block(rect(8, 60, -73, -62), 12.4)
block(rect(60, 78, -71, -54), 10.6)
rake(66, 84, -38, 50, 1.5, 7.5, 'x+')
for (let x = 10; x < 58; x += 8) panel(win, [x + 1.4, -73], [x + 6.6, -73], [0, -1, 0], 4.2, 9.4)

// --- Light masts (lidar tops), slim green poles with lamp banks.
for (const [x, y, h] of [[-70, -5, 37.5], [-20, -60, 38], [-30, 50, 36], [82, -12, 28]] as [number, number, number][]) {
  box(steel, [x, y, h / 2], [X, Y, Z], [0.5, 0.5, h / 2])
  box(steel, [x, y, h - 1.5], [X, Y, Z], [3.2, 0.6, 1.5])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('ballpark-brick', 0xb0614f) },
  { part: roof, material: finish('ballpark-roof', 0x8b9eab) },
  { part: seats, material: finish('ballpark-seats', 0x5d7f7a) },
  { part: steel, material: finish('ballpark-green-steel', 0x4f7a6c) },
  { part: win, material: PALETTE.window },
  { part: stone, material: PALETTE.trim },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('121 Financial Ballpark', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 15, osm: 'way/326793763', height: 38,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/jax-121-financial-ballpark.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
