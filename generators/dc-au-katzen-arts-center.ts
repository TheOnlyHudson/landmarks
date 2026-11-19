/**
 * Katzen Arts Center, American University, Washington, DC.
 * Two rotundas along a 196 m Massachusetts Avenue frontage. The taller,
 * rounded museum end faces Ward Circle; the low performance and teaching
 * ranges stretch northwest, joined at the central skylit stair hall.
 * https://www.openstreetmap.org/way/66878371 (measured perimeter, rounded
 * to centimetres in the 131.41 degree frame, +Y toward Ward Circle).
 * Rugo Stone supplied flat and radial French limestone panels over granite:
 * https://www.rugostone.com/projects/katzen-art-center-american-university/
 * https://www.engr.psu.edu/ae/thesis/portfolios/2005/jap339/Final%20Report/2Abstract.pdf
 * https://www.american.edu/cas/katzen/index.cfm (program, galleries).
 * Open photo references, all by Ser Amantio di Nicolao, CC BY-SA 3.0:
 * https://commons.wikimedia.org/wiki/File:Katzen_Art_Museum_from_Ward_Circle.jpg
 * https://commons.wikimedia.org/wiki/File:Rotunda_and_garage_entrance_of_Katzen_Art_Museum_from_Massachusetts_Avenue.jpg
 * https://commons.wikimedia.org/wiki/File:Outer_view_of_rotunda,_Katzen_Art_Museum.jpg
 * A separate cross-check gives an 8.64 m building-level value in the February 2026
 * Washington DC Overture centroid table. This is a cross-check, not lidar:
 * https://github.com/pete-rodrigue/get-blg-hts/blob/0ba7cc4d15b3853d2e01684798e9c97f6576508e/get_buildings.py
 * Garage opening, bay rhythm, glazing and small trim details simplified.
 * Upper gallery, terrace and center rotunda footprints are approximations
 * of their zones in the return grid.
 * 2022 DC OCTO lidar, building-class returns above local ground P10:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Datum 117.1 m, gallery 14.3 and 16.5 m, circular hall 13.2 m,
 * main long roof 9.0 m, inset terrace 4.2 m. Ground P90 about 4.2 m higher.
 */
import { CampusShell } from './dc-au-constitution-hall'
import { Part } from './mesh'
import { PALETTE } from './palette'
import { chamfer, finishGlb, flatShape, lathe, outward, prism, rect, writeModel, type XY } from './sea-tacoma-union-station'

const building = new CampusShell()
const glass = new Part()
const plan: XY[] = [
  [-2.99, -93.68], [-2.79, -90.76], [2.84, -90.65], [2.73, -93.91],
  [13.65, -94.24], [13.72, -91.21], [15.74, -91.33], [17.15, -50.19],
  [17.74, -32.69], [17.66, -23.67], [16.27, -17.28], [14.68, -14.03],
  [11.97, -10.72], [6.46, -7.12], [6.46, 55.24], [10.28, 55.24],
  [11.03, 51.25], [17.72, 51.86], [17.49, 61.25], [17.19, 73.18],
  [13.82, 90.71], [10.29, 90.14], [8.13, 96.69], [4.22, 100.64],
  [-0.96, 102.42], [-6.97, 101.77], [-13.0, 97.29], [-15.22, 92.59],
  [-15.53, 87.66], [-16.46, 87.48], [-13.25, 67.48], [-11.99, 67.73],
  [-12.11, 63.77], [-13.17, 29.78], [-14.59, -15.76], [-12.76, -17.09],
  [-14.27, -20.97], [-14.65, -21.94], [-15.13, -24.33], [-15.43, -25.85],
  [-14.9, -28.12], [-14.08, -31.58], [-14.95, -31.71], [-15.39, -43.5],
  [-12.93, -43.88], [-14.02, -93.69],
]
const lowRoof = 9.0
const base = chamfer(plan, 0.16)
prism(building.trim, null, base, 0, 0.8)
prism(building.stone, building.roof, base, 0.8, 4.2)
const upper: XY[] = [
  ...plan.slice(0, 13), [3.1, -7.1], [1.0, 54.5], [1.4, 59.0], [10.6, 59.0], ...plan.slice(16),
]
prism(building.stone, null, upper, 4.2, lowRoof - 0.25)
prism(building.trim, building.roof, upper, lowRoof - 0.25, lowRoof)

// Ward Circle gallery: curved masonry exterior and a rectangular upper
// gallery volume, window to the southeast above the circular end.
const gallery: XY[] = [...plan.slice(17, 33), [6.46, 63.77], plan[14], plan[15], plan[16]]
prism(building.stone, building.roof, gallery, lowRoof, 14.3)
const lantern: XY[] = [[-11.9, 58.5], [1.6, 58.4], [4.0, 96.9], [-9.5, 97.1]]
prism(building.stone, building.roof, chamfer(lantern, 0.14), 14.3, 16.5)
for (const i of [1, 2]) {
  building.bays(lantern[i], lantern[(i + 1) % 4], 14.48, 16.28, 3.1, 0.93)
}
for (const i of [21, 22, 23, 24, 25, 26]) {
  const a = plan[i], b = plan[i + 1]
  building.bays(a, b, 6.7, 7.8, 4.3, 0.62)
}

// The lidar returns show a raised near-circular rim and recessed glazing.
lathe(building.stone, -0.3, -24.8, [[13.6, lowRoof], [13.6, 13.16]], 32)
lathe(building.roof, -0.3, -24.8, [[13.6, 13.16], [5.1, 13.16]], 32)
lathe(glass, -0.3, -24.8, [[5.1, 13.16], [2.3, 12.08], [0, 11.8]], 32)
for (const i of [6, 7, 13, 29, 32, 33, 42, 44]) {
  const a = plan[i], b = plan[i + 1]
  building.bays(a, b, 1.22, 3.62, 7.0, i === 13 ? 0.85 : 0.65)
  if (i !== 13) building.bays(a, b, 5.15, 7.5, 7.0, 0.65)
}
building.bays(upper[13], upper[14], 5.0, 7.75, 7.0, 0.84)
for (const i of [9, 10, 11, 12]) {
  const a = plan[i], b = plan[i + 1]
  building.bays(a, b, 0.65, i === 12 ? 3.75 : 7.75, 2.6, 0.90)
}
// Garage entry is inset from the street face beside the central rotunda.
const a = plan[7], b = plan[8]
flatShape(building.window, { o: [a[0], a[1], 0], n: outward(a, b) }, rect(3.6, 0.05, 12.6, 2.92), 0.06)
await writeModel('dc-au-katzen-arts-center', finishGlb('Katzen Arts Center', [
  { part: building.stone, material: PALETTE.stone }, { part: building.trim, material: PALETTE.trim },
  { part: building.roof, material: PALETTE.roof }, { part: building.window, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], {}))
