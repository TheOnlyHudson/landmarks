/**
 * Coors Field, Denver (MLB, Colorado Rockies; opened 1995, HOK Sport) —
 * procedural, CC0-1.0, no textures.  bun generators/den-coors-field.ts
 *
 * Map frame: x across the park (first-base side +x), y from home plate
 * toward centre field, z up, metres. Bearing 4°: the home plate – second
 * base line in the USGS NAIP orthophoto and the symmetry of the lidar bowl.
 * Anchor -104.9940946, 39.7560319: the area centroid of the stadium
 * multipolygon (relation/4423251, outer way/25654485 less the field,
 * inner way/318760843).
 *
 * The stands only: grass, infield and warning track are the map's. z = 0 is
 * the playing field (lidar 1578.9 m; the map's terrain puts y = 0 at
 * 1578.8 m, so the terrain already carries the pit). The streets on the
 * home-plate and first-base sides (20th and Blake) stand 7.5 m above the
 * field (lidar; published "21 ft below street level"), the left-field side
 * on Wynkoop only 1 m above it. Elevation 0 for that reason, as at Comerica
 * Park; `terrain.ts check` passes at 0.
 *
 * How it is built: lofted round C = (-6.2, -17.9), near the mound, with
 * `loftSections` from dc-nationals-park.ts. At each angle θ (clockwise from
 * centre field) the section runs from the field wall (OSM inner ring) out
 * to the street face (OSM outer ring, median of three rays). Measured from
 * the USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020, 1 m grid), every 4°
 * (table ROWS): the back of the lower bowl (4.4–7.8 m), the club deck
 * front (11 m), the upper-deck front (21 m), the canopy front and back
 * (canopy roof 38.5–39.2 m all round, drawn 38.8), and the outer concourse
 * ring and brick street walls at 24 m. Also measured: the home-plate
 * rotunda's upper level 28–30.5 m; the clock tower to 38–39 m (drawn
 * to 45.1 at the hood's crown, and the First Base gate to 41.4, bolder at
 * phone size after the lead's review); brick
 * towers on the street walls at 28–31 m and the First Base gate block at
 * 34 m; the three light racks on the canopies (third base 63 m long,
 * first base 64 m, right field 42 m; tops 53–55.8 m); the left-centre
 * scoreboard (29 m long, board 31–36 m, light rack 55.5 m); the left-field
 * bleachers to an 8 m concourse with 12 m buildings behind; the batter's
 * eye rising to 8 m and the Rockpile bleachers in centre field, 15 → 26 m.
 *
 * Identity (from the photos): the red brick street walls with pale precast
 * bands, broad windows and projecting brick towers; the home-plate rotunda
 * at 20th and Blake with its clock tower, white clock under a green steel
 * arched hood and COORS / FIELD letters (drawn as two plain bars, not
 * lettering); the First Base gate on Blake with its big arched green steel
 * canopy and arched hood; dark green steel and seats; the pale metal canopy
 * over the upper deck; the steel light racks; the purple row of seats in
 * the upper deck at one mile above sea level.
 *
 * Evidence
 * - OSM: relation/4423251 (leisure=stadium, building, height 35,
 *   Q1129916) and its 272 building:part ways, all inside the outline.
 * - Measured: USGS lidar CO_DRCOG_2_2020 (all heights and radii above);
 *   USGS NAIP orthophoto (plan, home-plate line, canopy roof pale grey).
 * - Published: opened 1995, HOK Sport; field about 21 ft below street level;
 *   the 20th row of the upper deck is purple, 5,280 ft above sea level
 *   (Wikipedia, "Coors Field").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Coors Field exterior 2022.jpg", Troutfarm27, CC BY-SA 4.0: the
 *     home-plate rotunda from 20th and Blake (from ~185°).
 *   - "Coors Field Main Entrance.jpg", Enkrates, public domain: the
 *     rotunda close up, clock and hood, precast bands, diamond band.
 *   - "Coors Field (23305954114).jpg", Paul Sableman, CC BY 2.0: the
 *     rotunda and the Blake Street wall receding to the First Base gate,
 *     light racks behind (from ~160°).
 *   - "Coors Field (23307824413).jpg", Paul Sableman, CC BY 2.0: the
 *     First Base gate's arched canopy.
 *   - "Coors Field, Denver, Colorado, US.jpg", color line, CC BY 2.0: the
 *     First Base gate block, hood and racks (from ~128°).
 *   - "Coors field aerial 1.JPG", John Maushammer, CC BY-SA 3.0: the whole
 *     park from the air over centre field (from ~355°, before the 2014
 *     scoreboard).
 *   - "Coors Field panorama 2022.jpg", Troutfarm27, CC BY-SA 4.0, and
 *     "Coors field 1.JPG", Matt Kozlowski, CC BY-SA 3.0: the bowl, decks,
 *     canopy, racks and scoreboard from inside.
 * Estimated: the club and suite glass band (11–18.4 m) and the upper
 * deck's slope under the canopy (21.2 → 31.5 m); the purple row's place
 * (drawn 1.7 m wide just in front of the canopy edge so it shows from
 * above; the real single row, 30.4 m over the field, sits a few metres
 * further up under the canopy); the window panels and precast band heights
 * from the photos; the rack posts and lamp banks; the scoreboard's raised
 * centre. The light racks and the steel above the brick walls are open
 * trusses in reality, drawn as solid posts and a solid green screen.
 * Not drawn: flagpoles, statues, the Sandlot brewery's neon, the trees and
 * water feature of the batter's eye (drawn as a green slope), lettering.
 * Doubts: the scoreboard's 2014 outline is read from the lidar and the
 * 2022 panorama only; the right-field corner (θ ≈ 80°) follows the OSM
 * outline's protrusion.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, quad, rayHit, type SectionPt, type XY } from './dc-nationals-park'

// OSM in this frame (bearing 4°, about the anchor): outer way/25654485 of relation/4423251.
const OUTLINE: XY[] = [[-57.6, -98.5], [-66.3, -91.0], [-63.2, -87.3], [-64.4, -86.3], [-65.5, -87.7], [-72.9, -81.2], [-71.8, -79.9], [-74.5, -77.6], [-75.7, -78.9], [-81.2, -74.2], [-80.1, -72.8], [-124.0, -35.1], [-117.1, -27.1], [-104.0, -38.3], [-101.5, -36.8], [-115.2, -13.1], [-129.8, -29.4], [-132.4, -27.1], [-134.4, -29.3], [-144.3, -20.6], [-142.4, -18.5], [-146.5, -14.8], [-131.9, 1.6], [-126.8, -2.9], [-121.8, 3.1], [-139.3, 18.1], [-118.2, 41.9], [-126.0, 48.7], [-53.4, 131.1], [-55.7, 133.2], [-48.6, 141.2], [-39.8, 133.4], [-31.5, 139.2], [-27.7, 141.0], [-21.5, 143.0], [-17.8, 143.4], [-12.4, 143.0], [-6.5, 141.5], [2.2, 137.3], [9.6, 145.5], [18.1, 138.1], [16.2, 135.9], [30.5, 123.7], [37.5, 131.8], [45.4, 125.0], [43.7, 123.2], [74.2, 97.0], [75.1, 98.0], [82.9, 91.3], [82.1, 90.3], [124.6, 54.0], [125.4, 54.9], [133.2, 48.2], [126.3, 40.2], [128.7, 38.1], [124.3, 33.0], [152.2, 9.1], [137.2, -8.0], [127.5, 0.3], [124.0, -3.8], [131.2, -10.0], [124.2, -18.1], [122.0, -16.1], [119.9, -18.5], [121.3, -19.7], [114.9, -27.1], [113.5, -25.9], [111.4, -28.4], [112.8, -29.6], [106.4, -36.9], [105.0, -35.7], [103.0, -38.1], [104.3, -39.3], [98.0, -46.7], [96.6, -45.5], [94.5, -47.9], [95.8, -49.1], [89.5, -56.5], [88.1, -55.3], [85.6, -58.1], [81.5, -54.6], [75.9, -60.9], [83.0, -67.7], [83.3, -67.4], [84.7, -68.6], [73.3, -81.5], [64.4, -73.5], [58.2, -80.4], [63.6, -85.0], [61.6, -87.1], [62.9, -88.3], [56.5, -95.7], [55.1, -94.6], [53.1, -96.9], [54.4, -98.1], [48.1, -105.4], [46.8, -104.2], [44.8, -106.6], [46.1, -107.8], [39.6, -115.2], [38.2, -114.2], [36.2, -116.5], [37.6, -117.6], [30.9, -125.3], [29.6, -124.2], [19.6, -136.2], [17.2, -138.1], [10.1, -141.5], [5.4, -141.7], [-2.5, -139.5], [-5.1, -138.0], [-16.4, -127.7], [-17.6, -129.1], [-25.0, -122.7], [-23.8, -121.3], [-26.3, -119.2], [-27.5, -120.5], [-34.9, -114.2], [-33.7, -112.9], [-36.2, -110.8], [-37.4, -112.1], [-44.6, -105.9], [-43.5, -104.5], [-46.1, -102.3], [-47.3, -103.6], [-54.7, -97.2], [-53.5, -95.9], [-54.6, -95.0]]
// The field ring: inner way/318760843.
const FIELD: XY[] = [[44.7, 64.0], [70.3, 42.3], [71.4, 33.7], [56.7, 19.3], [56.7, 17.1], [44.4, -3.5], [41.3, -8.0], [27.8, -23.4], [30.3, -25.5], [10.4, -48.4], [5.0, -43.9], [0.6, -47.5], [-4.0, -49.1], [-7.6, -49.2], [-11.1, -48.4], [-14.4, -46.8], [-17.3, -44.2], [-22.5, -48.5], [-42.1, -24.1], [-39.5, -21.9], [-52.4, -6.1], [-70.9, 26.9], [-81.5, 37.8], [-78.9, 40.9], [-94.5, 54.0], [-91.2, 57.8], [-75.7, 44.6], [-38.2, 88.1], [-16.7, 89.7], [-17.4, 98.8], [-14.3, 99.0], [-15.3, 111.6], [6.9, 113.3], [13.8, 107.7], [11.5, 105.2], [50.9, 71.2]]

/** Centre of the bowl lofts, near the pitcher's mound. */
const C: XY = [-6.2, -17.9]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const at = (a: number, r: number): XY => [C[0] + dirOf(a)[0] * r, C[1] + dirOf(a)[1] * r]
const fieldR = (a: number) => rayHit(FIELD, C, dirOf(a % 360))
const outlineRaw = (a: number) => rayHit(OUTLINE, C, dirOf(((a % 360) + 360) % 360))
/** The street face: the outline, smoothed over its small notches (median of three rays). */
const outerR = (a: number) => [outlineRaw(a - 2), outlineRaw(a), outlineRaw(a + 2)].sort((p, q) => p - q)[1] - 0.3

const brick = new Part(), stone = new Part(), roof = new Part(), green = new Part(), glass = new Part(), purple = new Part()

/**
 * The grandstand, measured from the lidar every 4°, θ clockwise from
 * centre field (θ 180 = home plate):
 * [θ, back of the lower bowl, its height, upper-deck front, canopy front,
 *  canopy back, street level outside]. Heights above the field.
 */
type Row = [number, number, number, number, number, number, number]
const ROWS: Row[] = [
  [12, 119.5, 1.2, 119.5, 135.0, 138.5, 1.3], [16, 115.4, 1.2, 115.4, 130.4, 140.9, 1.3], [20, 112.0, 1.2, 112.0, 126.5, 137.0, 1.3],
  [24, 109.4, 1.2, 109.4, 122.9, 133.9, 1.3], [28, 107.4, 1.2, 107.4, 120.9, 131.4, 1.3], [32, 104.8, 6.2, 105.8, 119.3, 129.8, 1.4],
  [36, 104.1, 5.8, 104.1, 118.1, 128.1, 1.4], [40, 103.9, 5.9, 103.9, 117.9, 126.9, 1.6], [44, 104.1, 6.0, 104.6, 118.1, 127.6, 4.5],
  [48, 103.7, 5.7, 104.7, 118.7, 128.2, 5.5], [52, 105.6, 6.0, 106.6, 120.1, 129.1, 6.2], [56, 107.0, 5.8, 108.0, 122.0, 132.5, 6.2],
  [60, 109.6, 7.7, 110.6, 124.6, 135.1, 6.2], [64, 106.5, 7.7, 108.5, 123.5, 134.0, 6.2], [68, 104.8, 7.8, 105.8, 120.8, 130.8, 7.4],
  [72, 102.8, 7.7, 103.8, 117.8, 127.8, 7.1], [76, 92.1, 6.3, 100.1, 116.6, 126.1, 7.2], [80, 84.1, 5.7, 92.1, 113.1, 125.1, 7.5],
  [84, 78.0, 5.4, 85.0, 105.0, 119.5, 7.7], [88, 72.6, 5.1, 78.6, 97.6, 111.1, 7.5], [92, 67.2, 4.7, 74.2, 91.7, 104.7, 7.7],
  [96, 63.8, 4.7, 70.8, 86.8, 99.8, 7.6], [100, 61.3, 4.8, 67.8, 83.3, 94.8, 7.6], [104, 59.5, 4.9, 65.0, 80.0, 91.5, 7.6],
  [108, 57.9, 4.8, 63.4, 78.4, 88.9, 7.7], [112, 56.4, 4.8, 60.9, 76.4, 85.9, 7.6], [116, 55.2, 4.8, 59.7, 73.7, 84.7, 7.6],
  [120, 53.7, 4.7, 59.7, 73.2, 83.2, 7.6], [124, 53.3, 4.8, 57.8, 71.8, 81.8, 7.6], [128, 52.1, 4.4, 58.1, 72.1, 81.1, 7.5],
  [132, 52.6, 4.7, 58.1, 72.1, 81.1, 7.5], [136, 53.2, 4.8, 58.2, 71.7, 81.2, 7.5], [140, 53.5, 4.8, 59.0, 72.5, 82.0, 7.5],
  [144, 53.9, 4.6, 59.4, 73.9, 83.4, 7.5], [148, 55.1, 4.7, 61.1, 74.6, 84.1, 7.4], [152, 55.8, 4.7, 62.3, 75.3, 84.8, 7.5],
  [156, 57.4, 4.9, 62.4, 76.4, 85.9, 7.4], [160, 62.1, 5.8, 63.1, 76.6, 86.6, 7.5], [164, 63.4, 6.0, 63.4, 76.4, 87.4, 7.5],
  [168, 64.5, 6.1, 64.5, 77.5, 87.0, 7.5], [172, 64.0, 6.0, 64.0, 78.0, 87.5, 7.6], [176, 63.8, 6.0, 63.8, 77.8, 87.3, 7.6],
  [180, 64.9, 6.2, 64.9, 77.9, 87.4, 7.5], [184, 64.3, 6.2, 64.3, 77.8, 87.3, 7.5], [188, 63.0, 5.9, 63.0, 77.5, 87.0, 7.5],
  [192, 63.1, 6.0, 63.1, 78.1, 86.6, 7.5], [196, 63.5, 6.2, 63.5, 76.5, 86.5, 7.5], [200, 60.7, 5.7, 62.2, 76.2, 85.7, 7.5],
  [204, 56.7, 4.9, 61.2, 75.7, 85.2, 7.5], [208, 55.1, 4.7, 61.1, 75.1, 84.1, 7.5], [212, 53.8, 4.7, 59.3, 73.8, 83.3, 7.6],
  [216, 53.0, 4.8, 58.5, 72.5, 82.5, 7.5], [220, 52.5, 4.8, 58.0, 71.5, 81.0, 7.4], [224, 52.1, 4.7, 57.6, 71.1, 80.1, 7.5],
  [228, 51.4, 4.7, 56.9, 70.9, 80.4, 7.5], [232, 51.4, 4.6, 56.4, 70.9, 79.9, 7.5], [236, 51.5, 4.7, 57.5, 70.0, 80.0, 7.5],
  [240, 52.3, 4.8, 57.8, 70.8, 80.3, 7.5], [244, 52.7, 4.6, 58.2, 72.2, 81.2, 7.4], [248, 53.8, 4.9, 59.8, 73.3, 82.3, 7.6],
  [252, 55.6, 4.8, 60.6, 75.1, 84.6, 5.6], [256, 56.6, 4.8, 61.6, 78.1, 88.6, 3.5], [260, 58.3, 4.6, 64.3, 80.3, 90.8, 1.5],
  [264, 60.9, 4.6, 67.9, 82.9, 93.4, 1.0], [268, 64.1, 4.7, 71.1, 86.1, 97.6, 1.0], [272, 67.1, 4.8, 73.1, 89.1, 100.6, 1.0],
  [276, 69.7, 4.7, 76.2, 93.2, 105.7, 1.1], [280, 73.8, 4.6, 81.3, 98.8, 108.8, 1.2], [284, 78.8, 4.8, 84.8, 97.0, 104.8, 1.1],
]
const CANOPY = 38.8 // canopy roof, lidar 38.5–39.2 all round
const OUTER = 24 // roof of the outer concourse ring and top of the brick street walls
/** The home-plate rotunda's upper level (pergola under the COORS FIELD letters), lidar 28–30.5. */
const innerTop = (a: number) => (a >= 160 && a <= 188 ? 30.4 : OUTER)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function standSection(row: Row): SectionPt[] {
  const [a, rb0, zb0, ru, rc0, rc1] = row
  const ro = Math.max(outerR(a), rc1 + 4)
  const rb = rb0, zb = Math.max(zb0, 3)
  const rw = Math.min(fieldR(a), rb - 3)
  const rs = Math.max(rb + 1.5, ru + 2) // the club and suite face under the upper deck
  const zClub = rs - rb > 4 ? 11 : zb + 1
  const rScr = rc1 - 1.5 // screen at the back of the upper deck
  const zAt = (r: number) => lerp(21.2, 29.5, (r - ru) / (rc0 - ru))
  const rp0 = rc0 - 2.6, rp1 = rc0 - 0.8 // the purple row, one mile above sea level
  const rp = ro - 11 // the rotunda pergola's face
  return [
    { r: rw, z: 0, part: green }, // padded outfield and backstop wall
    { r: rw, z: 1.2, part: green }, // lower bowl, green seats
    { r: rb, z: zb, part: green }, // its back riser
    { r: rb, z: zb + 1, part: green }, // club seats
    { r: rs, z: zClub, part: glass }, // club and suite glass
    { r: rs, z: 18.4, part: green },
    { r: rs, z: 19.6, part: green }, // underside of the upper deck
    { r: ru, z: 19.6, part: green }, // its fascia
    { r: ru, z: 21.2, part: green }, // upper deck seats
    { r: rp0, z: zAt(rp0), part: purple },
    { r: rp1, z: zAt(rp1), part: green },
    { r: rScr, z: 31.5, part: green }, // screen up to the canopy
    { r: rScr, z: CANOPY - 1.2, part: green }, // its outer face
    { r: rScr, z: innerTop(a), part: roof },
    { r: rp, z: innerTop(a), part: green }, // pergola face (rotunda only)
    { r: rp, z: OUTER, part: roof },
    { r: ro, z: OUTER, part: stone }, // precast cornice
    { r: ro, z: OUTER - 1.4, part: brick }, // red brick street walls
    { r: ro, z: 0, part: null },
  ]
}
loftSections(C, ROWS.map((r) => r[0]), ROWS.map(standSection), brick)

// The canopy over the upper deck's back rows: pale metal roof, green steel edges.
loftSections(C, ROWS.map((r) => r[0]), ROWS.map(([, , , , rc0, rc1]) => [
  { r: rc0 - 0.5, z: CANOPY - 1.2, part: green },
  { r: rc0 - 0.5, z: CANOPY, part: roof },
  { r: rc1 + 0.3, z: CANOPY, part: green },
  { r: rc1 + 0.3, z: CANOPY - 1.2, part: green },
  { r: rc0 - 0.5, z: CANOPY - 1.2, part: null },
]), green)

// Left field, past the end of the upper deck: bleachers up to an 8 m
// concourse, low buildings on the street. [θ, top of the bleachers]
const LF: [number, number][] = [[284, 100], [288, 100], [292, 100], [296, 104], [300, 109], [304, 109], [308, 109], [312, 112], [316, 115], [320, 115], [324, 115], [328, 118], [332, 121], [336, 124], [340, 130], [344, 134]]
loftSections(C, LF.map((l) => l[0]), LF.map(([a, rl]) => {
  const ro = outerR(a), rw = Math.min(fieldR(a), rl - 10)
  return [
    { r: rw, z: 0, part: green },
    { r: rw, z: 2.4, part: green }, // bleachers
    { r: rl, z: 7.8, part: roof }, // concourse
    { r: ro - 9, z: 7.8, part: brick },
    { r: ro - 9, z: 12, part: roof },
    { r: ro, z: 12, part: stone },
    { r: ro, z: 10.8, part: brick },
    { r: ro, z: 0, part: null },
  ]
}), brick)

// Centre field: the planted batter's eye rising from the wall to 8 m, then
// the Rockpile bleachers, 15 → 26 m. [θ, Rockpile front, back]
const CF: [number, number, number][] = [[344, 147, 151], [348, 133, 156], [352, 132, 158], [356, 132, 158], [360, 132, 158], [364, 134, 157], [368, 145, 150], [372, 141, 146]]
loftSections(C, CF.map((c) => c[0]), CF.map(([a, rk, rr]) => {
  const rw = Math.min(fieldR(a), rk - 20), ro = Math.max(outerR(a), rr + 2)
  return [
    { r: rw, z: 0, part: green },
    { r: rw, z: 3, part: green }, // the evergreen batter's eye
    { r: rk - 4, z: 8, part: roof },
    { r: rk, z: 8, part: green },
    { r: rk, z: 15, part: green }, // Rockpile seats
    { r: rr, z: 26, part: roof },
    { r: ro, z: 26, part: stone },
    { r: ro, z: 24.6, part: brick },
    { r: ro, z: 0, part: null },
  ]
}), brick)

// ---------------------------------------------------------------------------
// The brick street walls: two-storey window panels between brick piers, a
// precast band over the ground storey, entrances round the home-plate rotunda.
const rowAt = (a: number, col: number) => {
  for (let i = 0; i < ROWS.length - 1; i++) if (a >= ROWS[i][0] && a <= ROWS[i + 1][0]) {
    return lerp(ROWS[i][col], ROWS[i + 1][col], (a - ROWS[i][0]) / (ROWS[i + 1][0] - ROWS[i][0]))
  }
  return ROWS[ROWS.length - 1][col]
}
const roAt = (a: number) => Math.max(outerR(a), rowAt(a, 5) + 4)
function facade(a0: number, a1: number, z0: number, z1: number, f0: number, f1: number, part: Part, off = 0.06) {
  const A = at(a0, roAt(a0)), B = at(a1, roAt(a1))
  const e: XY = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(...e)
  const n: XY = [-e[1] / L, e[0] / L] // outward for a clockwise sweep
  const P = (f: number, z: number): V3 => [A[0] + e[0] * f + n[0] * off, A[1] + e[1] * f + n[1] * off, z]
  quad(part, [P(f0, z0), P(f1, z0), P(f1, z1), P(f0, z1)], [n[0], n[1], 0])
}
const TOWERS = [17, 37, 64, 123, 150, 174, 214, 260]
for (let i = 0; i < ROWS.length - 1; i++) {
  const a0 = ROWS[i][0], a1 = ROWS[i + 1][0], zs = Math.max(ROWS[i][6], ROWS[i + 1][6])
  if (TOWERS.some((t) => t > a0 - 1 && t < a1 + 1)) continue
  const top = OUTER - 3
  if (top - (zs + 6.2) > 3) facade(a0, a1, zs + 6.2, OUTER - 2.6, 0.17, 0.83, glass) // floors two and three
  facade(a0, a1, zs + 4.6, zs + 5.6, 0, 1, stone) // precast band
  if (a0 >= 156 && a1 <= 192) facade(a0, a1, zs, zs + 4.2, 0.22, 0.78, glass) // HOME PLATE gates
}

// Brick towers along the street walls, at the lidar's heights.
function tower(a: number, depth: number, width: number, h: number) {
  const ro = roAt(a), d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
  const c = at(a, ro - depth / 2 + 0.4)
  box(brick, [c[0], c[1], (h - 1.2) / 2], [t, n, [0, 0, 1]], [width / 2, depth / 2, (h - 1.2) / 2])
  box(stone, [c[0], c[1], h - 0.6], [t, n, [0, 0, 1]], [width / 2 + 0.3, depth / 2 + 0.3, 0.6])
  const zs = rowAt(a, 6)
  const p = (u: number, z0: number, z1: number) => { // tall window slot on the street face
    const q = (uu: number, z: number): V3 => [c[0] + t[0] * uu + n[0] * (depth / 2 + 0.06), c[1] + t[1] * uu + n[1] * (depth / 2 + 0.06), z]
    quad(glass, [q(u - 1.1, z0), q(u + 1.1, z0), q(u + 1.1, z1), q(u - 1.1, z1)], n)
  }
  if (h - zs > 16) { p(-width / 4, zs + 7, h - 4); p(width / 4, zs + 7, h - 4) }
}
tower(17, 8, 8, 31.1)
tower(37, 8, 8, 31)
tower(64, 9, 9, 31.1)
tower(150, 12, 12, 28.1)
tower(214, 10, 10, 28.8)
tower(260, 8, 8, 28)

// The First Base gate on Blake Street (lidar block top 34 m; drawn to 36, towers 38.7): a broad brick
// block between two projecting brick towers, the open arcade of its top
// storey under a big segmental green steel hood, and the arched green
// steel canopy over the three gate arches. Drawn a little bolder than the
// lidar's block (hood crown 41.4) so it reads at phone size.
{
  const a = 123, ro = roAt(a), d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
  const c = at(a, ro - 7)
  const q = (u: number, w: number, z: number): V3 => [c[0] + t[0] * u + n[0] * w, c[1] + t[1] * u + n[1] * w, z]
  const B = (u: number, w: number, z: number, hu: number, hw: number, hz: number, p = brick) => box(p, q(u, w, z), [t, n, [0, 0, 1]], [hu, hw, hz])
  const zs = rowAt(a, 6)
  B(0, 0, 18, 9, 7, 18) // the block, 0–36 (lidar 34)
  for (const s of [-1, 1]) { // the flanking towers, 3 m wide, standing 1.2 m proud
    B(s * 8.5, 0.6, 19, 1.7, 7.6, 19)
    B(s * 8.5, 0.6, 38.3, 2.0, 7.9, 0.4, stone)
  }
  B(0, 0, 36.2, 7, 7.2, 0.25, stone)
  const F = 7.06 // the block's street face
  // the open arcade of the top storey, three bays between brick piers
  for (const u of [-4.6, 0, 4.6]) quad(glass, [q(u - 1.9, F, 25.4), q(u + 1.9, F, 25.4), q(u + 1.9, F, 33.6), q(u - 1.9, F, 33.6)], n)
  quad(stone, [q(-6.9, F + 0.02, 24.4), q(6.9, F + 0.02, 24.4), q(6.9, F + 0.02, 25.0), q(-6.9, F + 0.02, 25.0)], n)
  // three round-headed gate arches at the street, 3.6 m wide
  for (const u of [-4.4, 0, 4.4]) {
    const pts: V3[] = [q(u - 1.8, F, zs), q(u + 1.8, F, zs)]
    for (let i = 0; i <= 6; i++) pts.push(q(u + 1.8 * Math.cos((Math.PI * i) / 6), F, zs + 5 + 1.8 * Math.sin((Math.PI * i) / 6)))
    for (let i = 1; i < pts.length - 1; i++) quad(glass, [pts[0], pts[i], pts[i + 1], pts[i + 1]], n)
  }
  // Segmental canopy arch over the gates: span 24 m, rise 5.5 m, crown 15 m
  // over the street, a band 1.5 m thick reaching 5.5 m out.
  const span = 12, rise = 5.5, R = (span * span + rise * rise) / (2 * rise), zc = zs + 15 - R
  const N = 10, th = Math.asin(span / R)
  for (let i = 0; i < N; i++) {
    const t0 = -th + (2 * th * i) / N, t1 = -th + (2 * th * (i + 1)) / N
    const p0: [number, number] = [R * Math.sin(t0), zc + R * Math.cos(t0)], p1: [number, number] = [R * Math.sin(t1), zc + R * Math.cos(t1)]
    const o0 = q(p0[0], F + 0.3, p0[1]), o1 = q(p1[0], F + 0.3, p1[1]), o2 = q(p1[0], F + 5.5, p1[1]), o3 = q(p0[0], F + 5.5, p0[1])
    const lo = (p: V3): V3 => [p[0], p[1], p[2] - 1.5]
    const tm = (t0 + t1) / 2
    quad(green, [o0, o1, o2, o3], [Math.sin(tm) * t[0], Math.sin(tm) * t[1], Math.cos(tm)])
    quad(green, [lo(o0), lo(o3), lo(o2), lo(o1)], [-Math.sin(tm) * t[0], -Math.sin(tm) * t[1], -Math.cos(tm)])
    quad(green, [o3, o2, lo(o2), lo(o3)], n)
    // the steel fan under it, drawn as a solid green lunette at its front
    const fz = zs + 8.6, f0 = lo(o3), f1 = lo(o2)
    if (f0[2] > fz + 0.1 || f1[2] > fz + 0.1) quad(green, [q(p0[0], F + 5.4, fz), q(p1[0], F + 5.4, fz), [f1[0] - n[0] * 0.1, f1[1] - n[1] * 0.1, f1[2]], [f0[0] - n[0] * 0.1, f0[1] - n[1] * 0.1, f0[2]]], n)
  }
  // the beam under the fan, 'FIRST BASE'
  box(green, q(0, F + 2.8, zs + 8.2), [t, n, [0, 0, 1]], [10.5, 2.7, 0.4])
  // the big segmental hood over the arcade, between the towers: span 14 m,
  // rise 4.6 m, a green band 1.4 m deep and 9 m from front to back
  {
    const hs = 7, hr = 5, RR = (hs * hs + hr * hr) / (2 * hr), z0 = 36.4, zcc = z0 + hr - RR, tt = Math.asin(hs / RR), M = 10
    const P = (k: number, w: number, dz = 0): V3 => { const ang = -tt + (2 * tt * k) / M; return q(RR * Math.sin(ang), w, zcc + RR * Math.cos(ang) + dz) }
    for (let k = 0; k < M; k++) {
      const ang = -tt + (2 * tt * (k + 0.5)) / M, up: V3 = [Math.sin(ang) * t[0], Math.sin(ang) * t[1], Math.cos(ang)]
      quad(green, [P(k, F + 1.2), P(k + 1, F + 1.2), P(k + 1, F - 8), P(k, F - 8)], up)
      quad(green, [P(k, F + 1.2, -1.4), P(k, F - 8, -1.4), P(k + 1, F - 8, -1.4), P(k + 1, F + 1.2, -1.4)], [-up[0], -up[1], -up[2]])
      quad(green, [P(k, F + 1.2), P(k + 1, F + 1.2), P(k + 1, F + 1.2, -1.4), P(k, F + 1.2, -1.4)], n)
      quad(green, [P(k, F - 8), P(k + 1, F - 8), P(k + 1, F - 8, -1.4), P(k, F - 8, -1.4)], [-n[0], -n[1], 0])
      // brick tympanum under it
      quad(brick, [q(RR * Math.sin(-tt + (2 * tt * k) / M), F - 0.4, z0 - 0.1), q(RR * Math.sin(-tt + (2 * tt * (k + 1)) / M), F - 0.4, z0 - 0.1), P(k + 1, F - 0.4, -1.4), P(k, F - 0.4, -1.4)], n)
    }
  }
}

// The home-plate rotunda's clock tower at 20th and Blake: a broad brick
// shaft rising above the rotunda, the big white clock with a dark rim and
// hands, a semicircular green steel hood (crown 45.1, lidar top 38–39: drawn
// about 6 m taller, at the lead's review, so the crown reads at phone size), and the green steel
// pergolas either side carrying COORS and FIELD (plain bars, not lettering).
{
  const a = 174, ro = roAt(a), d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
  const c = at(a, ro - 3.0)
  const q = (u: number, w: number, z: number): V3 => [c[0] + t[0] * u + n[0] * w, c[1] + t[1] * u + n[1] * w, z]
  const B = (u: number, w: number, z: number, hu: number, hw: number, hz: number, p = brick) => box(p, q(u, w, z), [t, n, [0, 0, 1]], [hu, hw, hz])
  const zs = rowAt(a, 6), W = 4.6, D = 3.6
  B(0, 0, 20, W, D, 20)
  B(0, 0, 40.1, W + 0.25, D + 0.25, 0.25, stone)
  for (const z0 of [zs + 8, zs + 15.4]) quad(glass, [q(-1.8, D + 0.06, z0), q(1.8, D + 0.06, z0), q(1.8, D + 0.06, z0 + 6.2), q(-1.8, D + 0.06, z0 + 6.2)], n)
  // the hood: a half cylinder of radius 4.4 over the top, 10 segments, with end faces
  const HR = W + 0.2, H0 = 40.3, M = 10
  const hp = (k: number, w: number): V3 => q(-HR * Math.cos((Math.PI * k) / M), w, H0 + HR * Math.sin((Math.PI * k) / M))
  for (let k = 0; k < M; k++) {
    const m = (Math.PI * (k + 0.5)) / M
    quad(green, [hp(k, D + 0.7), hp(k + 1, D + 0.7), hp(k + 1, -D), hp(k, -D)], [-Math.cos(m) * t[0], -Math.cos(m) * t[1], Math.sin(m)])
  }
  for (const [w, s] of [[D + 0.7, 1], [-D, -1]] as const) {
    for (let k = 1; k < M - 1; k++) quad(green, [hp(0, w), hp(k, w), hp(k + 1, w), hp(k + 1, w)], [n[0] * s, n[1] * s, 0])
  }
  // the clock, 3.3 m radius, a dark rim and two hands
  const ring = (r: number, w: number, part: Part, z = 35.2) => {
    for (let i = 0; i < 16; i++) {
      const t0 = (2 * Math.PI * i) / 16, t1 = (2 * Math.PI * (i + 1)) / 16
      quad(part, [q(0, w, z), q(r * Math.cos(t0), w, z + r * Math.sin(t0)), q(r * Math.cos(t1), w, z + r * Math.sin(t1)), q(r * Math.cos(t1), w, z + r * Math.sin(t1))], n)
    }
  }
  ring(4.2, D + 0.05, green)
  ring(3.6, D + 0.1, stone)
  quad(green, [q(-0.25, D + 0.15, 35.2), q(0.25, D + 0.15, 35.2), q(0.25, D + 0.15, 38.2), q(-0.25, D + 0.15, 38.2)], n)
  quad(green, [q(-0.25, D + 0.15, 35.45), q(-0.25, D + 0.15, 34.95), q(-2.3, D + 0.15, 34.95), q(-2.3, D + 0.15, 35.45)], n)
  // the pergolas either side: posts, a green slab, the sign bar on top
  for (const s of [-1, 1]) {
    for (const u of [6, 9.6, 13.2]) B(s * u, 0.4, 28.4, 0.3, 0.3, 4.0, green)
    B(s * 9.6, 0.4, 32.7, 4.6, 1.6, 0.3, green)
    B(s * 9.6, 0.4, 34.8, 4.4, 0.35, 1.8, stone)
  }
}

// Light towers: steel racks on the canopies' back edges, posts and a lamp
// bank facing the field (lidar tops 53–55.8 m).
function rack(A: XY, B: XY, z0: number, posts: number, top = 55) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), e: V3 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L, 0]
  let n: V3 = [-e[1], e[0], 0]
  const m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  if (n[0] * (C[0] - m[0]) + n[1] * (C[1] - m[1]) < 0) n = [-n[0], -n[1], 0]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  for (let i = 0; i < posts; i++) {
    const u = -L / 2 + 1 + ((L - 2) * i) / (posts - 1)
    box(green, [m[0] + e[0] * u, m[1] + e[1] * u, (z0 + top - 6) / 2], ax, [0.8, 0.8, (top - 6 - z0) / 2])
  }
  box(green, [m[0], m[1], top - 3], ax, [L / 2, 0.8, 3], true)
  box(stone, [m[0] + n[0] * 0.85, m[1] + n[1] * 0.85, top - 3], ax, [L / 2 - 0.4, 0.05, 2.5])
}
rack([-96, -34], [-55, -82], CANOPY, 6)
rack([88, -36], [36, -83], CANOPY, 6)
rack([34, 113], [68, 88], CANOPY, 4, 55.5)

// The left-centre scoreboard (2014 video board): a 29 m dark board on the
// bleacher concourse with a raised centre and a light rack above.
{
  const A: XY = [-79, 88], B: XY = [-60, 110]
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), e: V3 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L, 0]
  const n: V3 = [e[1], -e[0], 0] // toward home plate
  const m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  const P = (u: number, w: number): XY => [m[0] + e[0] * u + n[0] * w, m[1] + e[1] * u + n[1] * w]
  const c0 = P(0, 0)
  box(green, [c0[0], c0[1], 19.5], ax, [L / 2, 1.5, 11.5])
  box(green, [c0[0], c0[1], 33], ax, [7.5, 1.5, 2.5])
  const s = P(0, 1.56)
  box(glass, [s[0], s[1], 22], ax, [L / 2 - 1.2, 0.05, 7.5]) // the screen
  const r0 = P(0, -0.5)
  for (const u of [-4, 4]) { const p = P(u, -0.5); box(green, [p[0], p[1], 42.5], ax, [0.5, 0.5, 7.5]) }
  box(green, [r0[0], r0[1], 52.5], ax, [5.5, 0.8, 2.8], true)
  const lf = P(0, 0.35)
  box(stone, [lf[0], lf[1], 52.5], ax, [5.1, 0.05, 2.3])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('coors-brick', 0xb87561) },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: green, material: finish('coors-green', 0x5c756c) },
  { part: glass, material: PALETTE.window },
  { part: purple, material: finish('coors-purple', 0x7d6aa8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Coors Field', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 4, osm: 'relation/4423251', height: 55.8,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/den-coors-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
