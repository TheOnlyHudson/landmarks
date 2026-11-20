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
 * Bay spacing, panel tones, individual collector supports, and join between
 * wings and ground-storey height estimated.
 * 2022 DC OCTO lidar, building-class returns above local ground P10:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Main roof levels 21.1 and 24.0 m above ground 115.0 m,
 * central rooftop structure 27.6 m. Collector groups are approximately 1.5 m
 * above the roofs and run diagonally across both wings. Their inclines,
 * lengths and centers were fitted to the full-return 2022 lidar surface.
 */
import { CampusShell } from './dc-au-constitution-hall'
import { Part, type V3 } from './mesh'
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
hall.mass([[6.4, -8.5], [16.65, -8.35], [16.9, 12.8], [7.5, 12.75], [7.2, 4.1], [6.4, 3.9]], 24.0, 27.6)

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
// The stacked suite lounges continue the end-stair curtain wall design.
hall.curtain(plan[15], plan[16], 0.45, 7.6, 0.52, 23.4, 1.72, [3.48, 6.55, 9.45, 12.35, 15.25, 18.15, 21.05])
hall.curtain(plan[5], plan[6], 0.52, 7.18, 3.8, 20.51, 1.72, [6.55, 9.45, 12.35, 15.25, 18.15])

// Full-surface roof returns resolve five parallel lower collector rows
// and three upper rows, with the same axis and a rise across the short side.
function collector(cx: number, cy: number, length: number, z: number) {
  const pt = (along: number, cross: number, height: number): V3 => [
    cx - 0.55 * along + 0.835 * cross, cy + 0.835 * along + 0.55 * cross, height,
  ]
  const half = length / 2
  const low = z + 0.43, high = z + 1.62
  const a = pt(-half, -0.82, low), b = pt(-half, 0.82, high)
  const c = pt(half, 0.82, high), d = pt(half, -0.82, low)
  solar.quad(a, b, c, d)
  for (const along of [-half * 0.75, half * 0.75]) {
    const f = pt(along, 0.65, z), g = pt(along, 0.65, z + 1.5)
    base.quad(f, pt(along + 0.18, 0.65, z), pt(along + 0.18, 0.65, z + 1.5), g)
  }
}
for (const [cx, cy, length] of [[-20.5, -10, 10.7], [-16.0, -10.5, 11.7], [-13.0, -9.5, 10.8], [-9.0, -10.8, 9.0], [-4.5, -11.5, 8.9]]) {
  collector(cx, cy, length, 21.1)
}
for (const [cx, cy, length] of [[8, 21, 8.6], [11.5, 21.5, 11.5], [14.5, 24.25, 11.6]]) {
  collector(cx, cy, length, 24.0)
}
await writeModel('dc-au-cassell-hall', finishGlb('Cassell Hall', [
  { part: base, material: finish('flagstone', 0xb8ad9f) },
  { part: hall.stone, material: finish('architectural-precast', 0xd7c8b3) },
  { part: hall.roof, material: PALETTE.roof },
  { part: hall.window, material: PALETTE.window }, { part: hall.entrance, material: PALETTE.entrance },
  { part: solar, material: finish('solar-collector', 0x566474) },
], {}))
