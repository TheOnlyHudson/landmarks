/**
 * Cassell Hall, American University, Washington, DC. Plan measured from
 * https://www.openstreetmap.org/way/338514813 . Local +Y follows the long
 * campus driveway side toward McDowell Hall, bearing 122.80 degrees.
 * Finding 19 of DC Zoning Order 11-07A gives the eight-storey driveway wing
 * 81 feet 8 inches (24.89 m) and the seminary wing 72 feet (21.95 m).
 * https://www.american.edu/finance/ppm/upload/zoning-order-11-07a.pdf
 * As-built wing counts confirmed by AU's Cassell Hall LEED case study:
 * https://www.american.edu/about/sustainability/upload/cassell-leed-case-study.pdf
 * Stair-end curtain walls, fitness storefront, flagstone base, upper precast
 * and solar hot water banks on both roofs follow the engineering account:
 * https://www.engr.psu.edu/ae/thesis/portfolios/2013/bmt5078/building-stats.htm
 * Bay spacing, panel tones, exact solar bank positions/areas, join between
 * wings and ground-storey height estimated.
 * 2022 DC OCTO lidar, building-class returns above local ground P10:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Main roof levels 21.1 and 24.0 m above ground 115.0 m,
 * central rooftop structure 27.6 m. Solar panel heights approximated.
 */
import { CampusShell } from './dc-au-constitution-hall'
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { chamfer, finishGlb, flatShape, outward, prism, rect, writeModel, type XY } from './sea-tacoma-union-station'

const hall = new CampusShell()
const base = new Part()
const solar = new Part()
hall.trim = hall.stone
hall.spandrel = base
const plan: XY[] = [
  [10.28, 32.18], [1.82, 32.2], [1.78, 2.81], [2.89, 2.8],
  [2.89, -1.87], [-32.0, -1.84], [-32.0, -9.57], [-31.1, -9.56],
  [-31.11, -11.36], [-34.77, -11.36], [-37.34, -19.29], [17.96, -19.78],
  [17.99, -16.59], [18.61, -16.6], [18.82, -3.65], [20.46, -3.68],
  [20.6, 4.42], [19.02, 4.45], [19.69, 37.29], [16.56, 36.03],
  [11.69, 34.74], [11.69, 33.08], [11.27, 33.08], [11.28, 31.53],
  [10.27, 31.53],
]
const splice: XY = [2.89, -19.65]
// Split the L where the long precast wall of the lower wing meets the elbow.
const shortWing: XY[] = [...plan.slice(4, 11), splice]
const tallWing: XY[] = [...plan.slice(0, 5), splice, ...plan.slice(11)]
prism(base, null, chamfer(plan, 0.15), 0, 3.65)
hall.mass(shortWing, 3.65, 21.1)
hall.mass(tallWing, 3.65, 24.0)
hall.mass([[6.0, -9.7], [16.8, -9.7], [16.8, 10.8], [6.0, 10.8]], 24.0, 27.6)

for (const [index, stories] of [[1, 8], [4, 7], [10, 7], [13, 8], [15, 8], [17, 8]]) {
  for (let f = 1; f < stories; f++) {
    const sill = 4.10 + (f - 1) * 2.9
    hall.bays(plan[index], plan[index + 1], sill, sill + 1.87, 3.8, 0.65)
  }
}
hall.lobby(plan[17], plan[18], 3.36)
hall.lobby(plan[1], plan[2], 3.36)
// Both end stairs have multi-storey curtain walls with slim expressed slabs.
for (const [index, top] of [[9, 21.1], [18, 24.0], [19, 24.0]]) {
  const a = plan[index], b = plan[index + 1]
  const width = Math.hypot(b[0] - a[0], b[1] - a[1])
  const face = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
  flatShape(hall.window, face, rect(0.20, 0.50, width - 0.20, top - 0.55), 0.04)
  for (let level = 3.65; level < top - 1; level += 3.0) {
    flatShape(hall.trim, face, rect(0.16, level, width - 0.16, level + 0.16), 0.055)
  }
}
for (const x of [-25, -17, -9]) prism(solar, solar, rect(x, -14, x + 5.6, -10.8), 21.1, 21.28)
for (const y of [14, 20, 26]) prism(solar, solar, rect(8, y, 13.6, y + 3.2), 24.0, 24.18)
await writeModel('dc-au-cassell-hall', finishGlb('Cassell Hall', [
  { part: base, material: finish('flagstone', 0xb8ad9f) },
  { part: hall.stone, material: finish('architectural-precast', 0xd7c8b3) },
  { part: hall.roof, material: PALETTE.roof },
  { part: hall.window, material: PALETTE.window }, { part: hall.entrance, material: PALETTE.entrance },
  { part: solar, material: finish('solar-collector', 0x566474) },
], {}))
