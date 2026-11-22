/**
 * EverBank Stadium, Jacksonville (NFL, Jacksonville Jaguars; built 1995 on
 * the site of the Gator Bowl, keeping parts of its west stand; Jacksonville
 * Municipal Stadium, EverBank Field, TIAA Bank Field) — procedural, CC0-1.0,
 * no textures.  bun generators/jax-everbank-stadium.ts
 *
 * Drawn as it stood before the "Stadium of the Future" rebuild that began
 * in 2025 (the 2018 lidar, the 2023 NAIP aerial and the 2021-2024 photos
 * all show it so). The Daily's Place amphitheatre canopy beyond the south
 * end is a separate building and is not part of this model.
 *
 * Map frame: x across the field (+x the east-south-east sideline), y along
 * it (+y the north-north-east end), z up, metres. Placed at bearing 17°, the
 * field's long axis in the NAIP aerial and the lidar (the field wall is
 * symmetric about it to a metre). Anchor: the area centroid of the outline
 * way/27258894 (outer of building=stadium relation/2305417), -81.637312,
 * 30.323922. The stands are lofted round C = (-3, -3), the field's centre
 * in the lidar.
 *
 * z = 0 is the field. The lidar puts the plazas round the stadium about
 * 1 m above it, so the bowl is at grade and `elevation` is 0.
 *
 * What makes it read as itself (photos and aerials): a big open bowl of
 * teal seats with no roof; tall two-tier stands on both sidelines and round
 * the four corners, the upper decks' backs standing about 41-43 m, over a
 * pale concrete outer wall banded with open concourse levels; low ends,
 * each with a roof deck at 22 m (28 m in the corners) and, on it, the
 * giant end-zone video board (362 ft, 110 m, wide) on a white steel frame;
 * and the eight white lattice light masts leaning in over the rims.
 *
 * Evidence
 * - OSM: relation/2305417 (building=stadium; outer way/27258894, which also
 *   carries leisure=stadium, name, Q635117; inner way/172665884). No
 *   building:part inside. The Gate 1-4 and club entrance roofs
 *   (building=roof) stand outside the outline and are left to the map.
 * - Measured, lidar: USGS 3DEP FL_Peninsular_FDEM_Duval_2018 (flown 2018),
 *   1 m grid, read along rays from C every 5° (tables below), heights above
 *   the field:
 *   - field wall r 41 m at the sidelines, 63-67 m at the ends;
 *   - lower bowl 13 m at r 78 (sides) / 99 (ends), 15-18 m at its back;
 *   - sideline upper decks from 25 m at r 94 to 39-45 m at their backs,
 *     a 28-29 m outer roof band out to the wall at r 128-134;
 *   - end decks 20-25 m (north 21 m, south 20-25 m), 28 m in the north
 *     corners and the south-west corner;
 *   - video boards: north x -61..50, y 117..134, top 56.4 m; south x
 *     -56..56, y -138..-121, top 56.4 m;
 *   - light masts (tops): (109, 34) and (110, -33) 59 m; (-116, 30) and
 *     (-114, -37) 61 m; corners (84, 97) 55.5, (83, -96) 55.6, (-88, 93)
 *     57.4, (-83, -100) 57.5 m.
 * - Measured, USGS NAIP orthophoto 2023 (0.42 m): plan, teal seats, the
 *   boards' white frames, grey roofs.
 * - Published (Wikipedia, "EverBank Stadium"): opened 1995; capacity about
 *   67,800; the 2014 end-zone video boards 362 ft × 60 ft (110 × 18 m).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Quintin Soloviev, "EverBank Stadium aerial view" (CC BY 4.0; from the
 *     south-east: the bowl, teal seats, both boards on their white frames,
 *     the lattice masts, the outer wall)
 *     https://commons.wikimedia.org/wiki/File:EverBank_Stadium_aerial_view.jpg
 *   Excel23, "Everbank Stadium 2024" (CC BY 4.0; the west side across the
 *     water: the concourse bands, leaning lattice masts, a board's frame)
 *     https://commons.wikimedia.org/wiki/File:Everbank_Stadium_2024.jpg
 *   Michael Rivera, "Everbank Field, Gate 1" (CC BY-SA 3.0; the outer wall
 *     at street level: concrete frame, ramps, a white lattice mast foot)
 *     https://commons.wikimedia.org/wiki/File:Everbank_Field,_Gate_1.JPG
 * - Estimated: the boards' bottoms (38 m, from the published 18 m height
 *   under the measured top); the frames under them; the masts' feet (at the
 *   outer wall, from the photos) and their lamp heads; the concourse bands
 *   on the outer wall (from the 2024 photo).
 * - Not drawn: the spiral ramps at the corners, the pools and cabanas in
 *   the north-east corner, the gate canopies, lettering, the lattices'
 *   members (the masts and frames are solid white beams).
 * - Doubts: the east outer wall is seen only in the aerial; the corners'
 *   step down from the upper decks is drawn as a 5° slope.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, quad, type SectionPt, type XY } from './dc-nationals-park'

const C: XY = [-3, -3]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]

const panel = new Part(), seats = new Part(), roof = new Part(), win = new Part(), trim = new Part(), board = new Part()

/** Linear interpolation in [x, y] rows. */
function lerpRows(rows: number[][], x: number) {
  if (x <= rows[0][0]) return rows[0][1]
  for (let i = 0; i < rows.length - 1; i++) if (x <= rows[i + 1][0]) {
    const f = (x - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][1] + (rows[i + 1][1] - rows[i][1]) * f
  }
  return rows[rows.length - 1][1]
}
/** Fold an angle into 0..90 (0 = an end, 90 = a sideline): the bowl is symmetric both ways. */
const fold = (a: number) => { const m = ((a % 180) + 180) % 180; return m > 90 ? 180 - m : m }

// Lidar radii from C (5° rays, both halves averaged), by folded angle.
const R_WALL = [[0, 64], [10, 65], [20, 66], [30, 63], [40, 56], [50, 51], [60, 45], [70, 43], [80, 42], [90, 41]]
const R_LOWER = [[0, 99], [10, 100], [20, 102], [30, 101], [40, 96], [50, 89], [60, 84], [70, 80], [80, 78], [90, 77]]
const R_UPPER = [[35, 112], [40, 110], [50, 106], [60, 100], [70, 96], [80, 95], [90, 94]]
const R_OUT = [[0, 136], [10, 138], [20, 138], [30, 136], [40, 138], [50, 137], [60, 134], [70, 130], [80, 129], [90, 129]]

function section(a: number): SectionPt[] {
  const f = fold(a)
  const rW = lerpRows(R_WALL, f), rL = lerpRows(R_LOWER, f), rO = lerpRows(R_OUT, f)
  const east = a > 0 && a < 180
  // w: 1 on the sideline and corner upper decks, 0 on the ends.
  const w = Math.min(1, Math.max(0, (f - 35) / 5))
  const zEnd = f < 12 ? 22 : 28
  const rU = w > 0 ? lerpRows(R_UPPER, f) : rL + 1
  const zTop = (east ? 41 : 43) * w + zEnd * (1 - w)
  const zBand = 29 * w + zEnd * (1 - w)
  const zL = 18 * w + 15 * (1 - w)
  const zU0 = 25 * w + zEnd * (1 - w)
  const rTop = rO - 8
  return [
    { r: rW, z: 0, part: panel }, // field wall
    { r: rW, z: 1.5, part: seats }, // lower bowl
    { r: rW + (rL - rW) * 0.45, z: 7.5, part: trim }, // its cross aisle
    { r: rW + (rL - rW) * 0.45 + 2, z: 7.5, part: seats },
    { r: rU - 1, z: zL, part: win }, // suite / club face under the upper deck
    { r: rU - 0.6, z: zU0, part: seats }, // upper deck (or the end deck's front)
    { r: rTop, z: zTop, part: trim }, // its rim
    { r: rTop + 1.2, z: zTop, part: w > 0 ? board : panel }, // the back wall above the outer roof: its black sign fascia
    { r: rTop + 1.2, z: zTop - 3.2 * w, part: panel },
    { r: rTop + 1.2, z: zBand, part: roof },
    { r: rO, z: zBand, part: panel }, // outer wall, concourse bands below
    { r: rO, z: 18, part: win },
    { r: rO, z: 13.5, part: panel },
    { r: rO, z: 9, part: win },
    { r: rO, z: 4.5, part: panel },
    { r: rO, z: 0, part: null },
  ]
}
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 2.5) angles.push(a)
  loftSections(C, angles, angles.map(section), null)
}

// ---------------------------------------------------------------------------
// The end-zone video boards on their white frames, standing on the end decks.
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
function videoBoard(xc: number, half: number, yFace: number, s: 1 | -1) {
  // s: +1 the board's back is at larger y (north board), -1 south.
  const depth = 2.4, z0 = 38.2, z1 = 56.4, zDeck = 22
  const yc = yFace + (s * depth) / 2
  box(board, [xc, yc, (z0 + z1) / 2], [X, Y, Z], [half, depth / 2, (z1 - z0) / 2], true)
  // White frame: a cap, a sill and the trussed legs behind, down to the deck.
  box(trim, [xc, yc, z1 + 0.5], [X, Y, Z], [half + 0.4, depth / 2 + 0.4, 0.5])
  box(trim, [xc, yc, z0 - 0.6], [X, Y, Z], [half + 0.4, depth / 2 + 0.4, 0.6], true)
  const yb = yFace + s * (depth + 3.2)
  box(trim, [xc, yb, (z0 + z1) / 2], [X, Y, Z], [half, 0.6, (z1 - z0) / 2 - 1], true) // the back truss, a white screen
  for (let i = 0; i <= 6; i++) {
    const x = xc - half + 3 + ((2 * half - 6) * i) / 6
    box(trim, [x, yFace + s * (depth + 1.6), (zDeck + z1) / 2], [X, Y, Z], [1.0, 2.6, (z1 - zDeck) / 2])
  }
}
videoBoard(-5.5, 55, 121.5, 1)
videoBoard(0, 55, -123.5, -1)

// ---------------------------------------------------------------------------
// The eight lattice light masts: a pair of legs from the foot of the outer
// wall leaning in to a lamp head over the rim (tops from the lidar).
const MASTS: [number, number, number][] = [
  [109, 34, 59], [110, -33, 59], [-116, 30, 61], [-114, -37, 61],
  [84, 97, 55.5], [83, -96, 55.6], [-88, 93, 57.4], [-83, -100, 57.5],
]
function beam(p: Part, a: V3, b: V3, w: number, side: V3) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d), ax: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let n: V3 = [ax[1] * side[2] - ax[2] * side[1], ax[2] * side[0] - ax[0] * side[2], ax[0] * side[1] - ax[1] * side[0]]
  const nl = Math.hypot(...n); n = [n[0] / nl, n[1] / nl, n[2] / nl]
  const t: V3 = [n[1] * ax[2] - n[2] * ax[1], n[2] * ax[0] - n[0] * ax[2], n[0] * ax[1] - n[1] * ax[0]]
  box(p, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], [ax, t, n], [L / 2, w / 2, w / 2])
}
for (const [x, y, top] of MASTS) {
  const dx = x - C[0], dy = y - C[1], r = Math.hypot(dx, dy)
  const u: XY = [dx / r, dy / r], t: V3 = [u[1], -u[0], 0]
  const a = (Math.atan2(dx, dy) * 180) / Math.PI
  // The corner masts come down to the ground outside the wall; the
  // sideline ones stand on the outer roof behind the upper deck.
  const corner = fold(a) < 60
  const rFoot = lerpRows(R_OUT, fold(a)) + (corner ? 2.5 : -4)
  const zFoot = corner ? 1.6 : 29
  const head: V3 = [x, y, top - 3]
  for (const s of [-1, 1]) {
    const foot: V3 = [C[0] + u[0] * rFoot + t[0] * 4 * s, C[1] + u[1] * rFoot + t[1] * 4 * s, zFoot]
    beam(trim, foot, [head[0] + t[0] * 2 * s, head[1] + t[1] * 2 * s, head[2]], 2.2, [u[0], u[1], 0])
  }
  // The lamp head: a broad white bank facing the field, its face dark.
  box(trim, [x, y, top - 3], [[t[0], t[1], 0], [u[0], u[1], 0], Z], [6.5, 1.0, 3])
  quad(board, [
    [x - t[0] * 5.4 - u[0] * 1.03, y - t[1] * 5.4 - u[1] * 1.03, top - 5.5],
    [x + t[0] * 5.4 - u[0] * 1.03, y + t[1] * 5.4 - u[1] * 1.03, top - 5.5],
    [x + t[0] * 5.4 - u[0] * 1.03, y + t[1] * 5.4 - u[1] * 1.03, top - 0.5],
    [x - t[0] * 5.4 - u[0] * 1.03, y - t[1] * 5.4 - u[1] * 1.03, top - 0.5],
  ], [-u[0], -u[1], 0])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: panel, material: finish('everbank-concrete', 0xdcdad3) },
  { part: seats, material: finish('jaguars-teal', 0x4f9fbd) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: board, material: finish('video-board', 0x4a4f57) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('EverBank Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 17, osm: 'relation/2305417', height: 61,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/jax-everbank-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
