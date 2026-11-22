/**
 * Great American Ball Park, Cincinnati (MLB, Cincinnati Reds; opened 2003,
 * HOK Sport with GBBN) — procedural, CC0-1.0, no textures.
 * bun generators/cin-great-american-ball-park.ts
 *
 * Map frame: x across the park (+x towards first base and the south-west),
 * y from home plate towards centre field (+y), z up, metres. Placed at
 * bearing 121°, the line from home plate to the pitcher's mound in the USGS
 * NAIP orthophoto. Anchor -84.50672, 39.09736, near second base, inside
 * leisure=stadium way/24587940. Home plate is at (3.6, -34.6); the stands
 * are lofted round it, angle θ clockwise from centre field.
 *
 * z = 0 is the field. The lidar puts the river-side street (Mehring Way)
 * at field level and the plazas on the city side 7-12 m above it; the map's
 * terrain shows the same (field 10.3 m over the river, the river side at
 * 9.5-10 m), so `elevation` is 0 and the field is the lowest ground under
 * the stands. The field is the map's (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos: the red seats wrapping
 * from the right-field corner round home plate to left field in a lower
 * bowl, a glass suite band and an upper deck under a thin white steel roof
 * that floats over the last rows; The Gap, the 35 ft break through the
 * upper deck and roof between home plate and third base; twelve white
 * lattice light towers in pairs on and behind the stands; the open outfield
 * towards the Ohio River with low bleachers, the big scoreboard in left
 * field and the two white "power stacks" in right-centre.
 *
 * Evidence
 * - OSM: leisure=stadium way/24587940 (Q979975); stand buildings
 *   way/31009336 (the main bowl, building=stadium), way/31009349 (the
 *   right-field and centre-field stands by the river), way/35116609 (the
 *   third-base and left-field side along Joe Nuxhall Way), and the small
 *   building=stadium ways round the first-base side, way/199162430,
 *   way/199162432, way/199162434, way/199162436 (stair and ramp towers).
 * - Measured, lidar: USGS 3DEP OH_StatewideP3_6_B21 (flown about 2021),
 *   1 m grid, read along rays from home plate every 7.5° (table STANDS):
 *   - lower bowl to about 5 m, the suite face to 11-12 m, the upper deck
 *     to 29-31 m at the roof's front, the roof's top 40-42 m, the building
 *     behind 24-30 m;
 *   - The Gap at θ ≈ 225-236°: no roof, the stands only 24 m;
 *   - light-tower heads 67-70.6 m, twelve, in six pairs (TOWERS);
 *   - the left-field scoreboard's top 45 m; the stacks 27-28 m; the
 *     outfield stands 12-19 m.
 * - Measured, USGS NAIP orthophoto: plan, red seats, white roof, the
 *   home-plate and mound positions.
 * - Published (Wikipedia, "Great American Ball Park"): opened 2003;
 *   capacity 42,319; The Gap, 35 ft wide; the two smokestacks in
 *   right-centre field, recalling riverboats.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Eric Kilby, "Great American Ballpark 2007" (CC BY-SA 2.0; panorama
 *   from the third-base upper deck: scoreboard, stacks, light towers, the
 *   roof over the first-base side)
 *     https://commons.wikimedia.org/wiki/File:Great_American_Ballpark_2007.jpg
 *   Antony-22, "Great American Ball Park 2022a" (CC BY-SA 4.0; from
 *   Kentucky across the river: the outfield, the light towers, the stacks)
 *     https://commons.wikimedia.org/wiki/File:Great_American_Ball_Park_2022a.jpg
 *   Leslie, "Great American Ball Park Cincinnati" (CC BY-SA 2.5; from the
 *   west: the outer wall and the roof frame)
 *     https://commons.wikimedia.org/wiki/File:Great_American_Ball_Park_Cincinnati.jpg
 *   RickADikeman, "Great American Ball Park with The Gap on July 5, 2003"
 *   (CC0; the third-base stands, the suite band and the roof)
 *     https://commons.wikimedia.org/wiki/File:Great_American_Ball_Park_with_The_Gap_on_July_5,_2003_Cincinnati_Reds_versus_New_York_Mets.jpg
 *   Geoff Livingston, "Great American Ball Park April 2011" (CC BY-SA 2.0;
 *   the whole bowl from behind home plate)
 *     https://commons.wikimedia.org/wiki/File:Great_American_Ball_Park_April_2011.jpg
 * - Estimated: the heights of the suite band (5-11 m) and of the seats under
 *   the roof (hidden from the lidar, continued at the upper deck's rake to
 *   35 m); the light heads' size; the scoreboard's bottom (30 m).
 * - Not drawn: the field, the scoreboard's images, the lettering, the
 *   riverboat deck's details, the paddlewheel, the Reds Hall of Fame (a
 *   separate building), railings, the lattice of the light towers (solid
 *   white masts).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cylinder, loftSections, type SectionPt, type XY } from './dc-nationals-park'

const HOME: XY = [3.6, -34.6]
const seats = new Part(), white = new Part(), stone = new Part(), glass = new Part(), roof = new Part(), board = new Part()
const S = (r: number, z: number, part: Part | null): SectionPt => ({ r, z, part })

// The grandstand, right-field corner round to left field (lidar):
// [θ, field wall r, lower bowl top r, roof front r, roof back r, back
//  building z, outer r, roof 1/0]
const STANDS: number[][] = [
  [57.5, 58, 86, 110, 114, 27, 124, 0], [62.5, 50, 84, 106, 116, 26, 126, 1], [67.5, 37, 74, 104, 120, 25, 128, 1],
  [75, 30, 62, 92, 108, 27, 120, 1], [82.5, 25, 58, 84, 96, 28, 114, 1], [90, 23, 50, 76, 88, 25, 96, 1],
  [97.5, 21, 46, 72, 84, 25, 92, 1], [105, 21, 42, 68, 80, 12, 84, 1], [112.5, 19, 41, 64, 74, 25, 84, 1],
  [120, 19, 38, 63, 72, 7, 80, 1], [127.5, 19, 38, 60, 72, 26, 86, 1], [135, 19, 38, 60, 69, 28, 86, 1],
  [142.5, 19, 37, 59, 68, 27, 76, 1], [150, 19, 37, 58, 68, 25, 76, 1], [157.5, 18, 35, 56, 68, 24, 76, 1],
  [165, 18, 35, 56, 68, 24, 76, 1], [172.5, 18, 35, 56, 68, 24, 76, 1], [180, 18, 35, 56, 68, 24, 76, 1],
  [187.5, 18, 35, 56, 68, 24, 78, 1], [195, 19, 35, 56, 68, 25, 78, 1], [202.5, 19, 35, 58, 68, 28, 82, 1],
  [210, 18, 36, 60, 68, 30, 80, 1], [217.5, 20, 38, 60, 68, 26, 84, 1], [223, 20, 38, 60, 64, 28, 70, 1],
  [226, 21, 39, 54, 60, 24, 70, 0], [236, 23, 41, 56, 62, 24, 74, 0], [239, 24, 42, 64, 72, 26, 92, 1],
  [247.5, 22, 43, 64, 72, 28, 98, 1], [255, 19, 46, 64, 76, 28, 98, 1], [262.5, 20, 46, 68, 80, 28, 106, 1],
  [270, 22, 50, 74, 88, 28, 112, 1], [277.5, 24, 54, 80, 92, 28, 120, 1], [285, 27, 62, 86, 96, 26, 122, 1],
  [292.5, 33, 70, 96, 108, 28, 130, 1], [300, 51, 80, 106, 122, 28, 138, 1], [307.5, 62, 94, 126, 136, 30, 142, 0],
  [312.5, 70, 104, 128, 132, 22, 136, 0],
]
const Z_LB = 5, Z_SUITE = 11, Z_RF = 30, Z_UNDER = 35, Z_ROOF = 40.2, Z_ROOF_TOP = 41.6

loftSections(HOME, STANDS.map((r) => r[0]), STANDS.map(([, wr, rlb, rrf, rrb, zb, rout, hasRoof]) => {
  const zTop = hasRoof ? Z_UNDER : rrf > 100 ? 29 : 24
  const rBack = Math.max(rrb, rrf + 2), rOut = Math.max(rout, rBack + 2)
  const zBack = Math.max(Math.min(zb, zTop - 4), 8)
  return [
    S(wr, 0, stone), S(wr, 1.2, seats), S(rlb, Z_LB, stone), S(rlb + 1.5, Z_LB, glass), S(rlb + 1.5, Z_SUITE, stone),
    S(rlb + 2.5, Z_SUITE + 0.5, seats), S(rrf, hasRoof ? Z_RF : zTop, seats), S(rBack, zTop, stone),
    S(rBack, zBack, roof), S(rOut, zBack, stone), S(rOut, 0, null),
  ]
}), stone)

// The roof: a thin white canopy over the upper deck's last rows, in two
// runs either side of The Gap, on white posts at the back.
for (const run of [STANDS.filter((r) => r[7] && r[0] < 225), STANDS.filter((r) => r[7] && r[0] > 225)]) {
  loftSections(HOME, run.map((r) => r[0]), run.map(([, , , rrf, rrb]) => [
    S(rrf - 3, Z_ROOF, white), S(rrf - 3, Z_ROOF_TOP, white), S(rrb + 0.5, Z_ROOF_TOP, white), S(rrb + 0.5, Z_ROOF, roof), S(rrf - 3, Z_ROOF, null),
  ]), white)
  for (let i = 0; i < run.length; i += 2) {
    const [a, , , , rrb] = run[i], d: XY = [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
    const p: XY = [HOME[0] + d[0] * (rrb - 1), HOME[1] + d[1] * (rrb - 1)]
    box(white, [p[0], p[1], (Z_UNDER + Z_ROOF) / 2], [[d[1], -d[0], 0], [d[0], d[1], 0], [0, 0, 1]], [0.5, 0.5, (Z_ROOF - Z_UNDER) / 2 + 0.1])
  }
}

// The outfield: left-field stands, the centre-field batter's eye and deck,
// the right-field bleachers by the river: [θ, wall r, top r, top z].
const OUT: number[][] = [
  [312.5, 96, 128, 18], [317.5, 100, 130, 19], [322.5, 106, 134, 19], [330, 109, 140, 18], [337.5, 113, 144, 19],
  [345, 119, 147, 18], [352.5, 123, 144, 15], [360, 126, 142, 20], [367.5, 124, 140, 20], [375, 120, 138, 20],
  [382.5, 115, 136, 13], [390, 111, 134, 12], [397.5, 107, 132, 13], [405, 102, 134, 16], [412.5, 74, 126, 13],
  [417.5, 62, 124, 13],
]
// Their backs to the river carry the red-painted panels and banners.
loftSections(HOME, OUT.map((r) => r[0]), OUT.map(([a, wr, rt, zt]) => [
  S(wr, 0, stone), S(wr, 1.2, seats), S(rt, zt, roof), S(rt + 2.5, zt, a > 366 ? seats : stone), S(rt + 2.5, 0, null),
]), stone)

// The left-field scoreboard, facing home plate: dark board, white frame.
{
  const a: XY = [-88, 66], b: XY = [-61, 91]
  const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const e: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], n: V3 = [e[1], -e[0], 0] // n points at the field
  box(board, [c[0], c[1], 37.5], [e, n, [0, 0, 1]], [L / 2, 1.0, 7.5], true)
  box(white, [c[0] - n[0] * 0.6, c[1] - n[1] * 0.6, 45.2], [e, n, [0, 0, 1]], [L / 2 + 0.6, 1.6, 0.4])
  for (const u of [-L / 2 + 2, 0, L / 2 - 2]) box(white, [c[0] + e[0] * u - n[0] * 1.5, c[1] + e[1] * u - n[1] * 1.5, 15], [e, n, [0, 0, 1]], [0.9, 0.9, 15])
}

// The power stacks in right-centre, white with red crowns.
for (const p of [[54, 95], [61, 87]] as XY[]) {
  cylinder(white, p, 1.7, 0, 24.5, 12, null)
  cylinder(seats, p, 2.1, 24.5, 28, 12, seats)
}

// Twelve light towers (lidar heads 67-70.6 m): a white mast and a bank of
// lamps facing the field.
const TOWERS: XY[] = [[-98, 2], [-94, -10], [-72, -56], [-65, -67], [-58, 92], [-48, 101], [68.5, -71], [77, -62], [91, -41], [97, -31], [73, 87], [86, 77]]
for (const p of TOWERS) {
  const tx = 0 - p[0], ty = 25 - p[1], l = Math.hypot(tx, ty)
  const f: V3 = [tx / l, ty / l, 0], s: V3 = [f[1], -f[0], 0]
  box(white, [p[0], p[1], 31], [s, f, [0, 0, 1]], [0.8, 0.8, 31])
  box(white, [p[0] + f[0] * 0.6, p[1] + f[1] * 0.6, 65.8], [s, f, [0, 0, 1]], [3.2, 0.9, 4.8], true)
}

const parts = [
  { part: seats, material: finish('reds-red', 0xc55a52) },
  { part: white, material: PALETTE.trim },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: board, material: finish('scoreboard', 0x4a4f57) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Great American Ball Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 121, osm: 'way/24587940', height: 70.6,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cin-great-american-ball-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
