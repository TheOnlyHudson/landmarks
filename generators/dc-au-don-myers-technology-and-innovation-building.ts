/**
 * Don Myers Technology and Innovation Building, American University.
 * Two academic wings linked by a narrow connector, running along the
 * eastern boundary of East Campus. Both residential blocks that meet this
 * building have their own placement and geometry.
 *
 * Measured plan https://www.openstreetmap.org/way/535124892.
 * Origin at polygon centroid, principal north wing axis at 33.60°.
 * The small indents, the almost 170 m length and the offset between the two
 * wings are from the polygon. Plan vertices in metres, rounded to 0.01 m.
 * DC Zoning Commission 11-07, findings 133–139, describes the two buffer
 * wings as two storeys, flat roofs, 34 ft (10.36 m), with no penthouses or
 * doors on their eastern elevations.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf
 * AU identifies these as two connected buildings and describes courtyard
 * entrances. AU's built project and the structural engineer confirm two
 * principal storeys. The terrace level is partly below grade.
 * https://www.american.edu/buildingau/upload/east-campus-fact-sheet.pdf
 * https://ehlert-bryan.com/project/american-university-east-campus/
 * https://www.american.edu/about/sustainability/buildings/east-campus.cfm
 * Bay sizes, layout of the office windows, finish tones and the height of
 * the parapet are estimates. The whole roof uses a single quiet finish:
 * the extent of East Campus' reported planted areas on this roof is unverified.
 * No licensed close views of the narrow returns were located.
 * 2022 DC OCTO aerial lidar, building-class surface and bare earth:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Primary roof 11.0 m above ground P10 (117.8 m). The taller returns
 * near the dormitory party walls belong to adjacent structures.
 * The 2011 planning documents distinguish glazed courtyard entries from the
 * more shielded neighborhood elevation. Story-height glazed units in the
 * connector and labs are modeled in groups. Mullion spacing estimated.
 * https://www.american.edu/finance/ppm/upload/exhibit-1-east-campus.pdf
 */
import { CampusShell } from './dc-au-constitution-hall'
import type { XY } from './sea-tacoma-union-station'

const building = new CampusShell()
const plan: XY[] = [
  [16.05, -69.9], [12.13, -68.98], [15.38, -57.11], [17.01, -56.58],
  [15.73, -17.69], [17.38, -17.69], [16.99, -5.25], [7.39, -5.38],
  [6.82, 0.99], [11.19, 1.15], [10.75, 17.62], [6.98, 17.63],
  [6.68, 23.35], [12.51, 23.48], [12.55, 44.61], [1.18, 44.78],
  [1.66, 77.19], [-21.06, 77.17], [-20.63, 22.87], [2.4, 23.63],
  [2.28, 17.55], [2.21, 0.94], [2.33, -5.09], [-6.46, -5.26],
  [-6.34, -13.09], [-5.95, -41.73], [2.47, -41.67], [2.56, -51.37],
  [-0.71, -66.79], [-1.48, -70.18], [-6.12, -69.07], [-9.67, -81.34],
  [-5.62, -82.66], [-6.33, -84.95], [7.01, -88.97], [7.7, -86.44],
  [11.85, -87.46],
]
building.mass(plan, 0, 11.0)
// Keep the ends where the taller dorms attach blank. The site's interior
// courts face the western walls. The opposite, articulated edge faces
// the planted buffer. Each step in that edge keeps its roof outline.
const courtyard = [17, 18, 20, 24, 27, 30]
const buffer = [1, 3, 5, 9, 13, 15, 16, 33, 36]
for (const edge of buffer) {
  const a = plan[edge], b = plan[(edge + 1) % plan.length]
  building.bays(a, b, 1.4, 3.65, 4.8, 0.61)
  building.bays(a, b, 6.2, 8.8, 4.8, 0.61)
}
for (const edge of courtyard) {
  const a = plan[edge], b = plan[edge + 1]
  building.bays(a, b, 5.9, 9.05, 5.8, 0.76)
  if (edge === 17 || edge === 24) building.lobby(a, b, 4.15)
  else building.bays(a, b, 0.85, 4.0, 5.8, 0.76)
}
// The connector between the two wings reads as joined glazing from the
// courts. Open academic and lab bays have broader lites along this frontage.
for (const edge of [17, 24]) {
  const a = plan[edge], b = plan[edge + 1]
  const length = Math.hypot(b[0] - a[0], b[1] - a[1])
  const left = edge === 17 ? 9.5 : 4.4
  const right = left + (edge === 17 ? 15.8 : 11.6)
  building.curtain(a, b, left, right, 0.52, 9.9, 2.1, [4.35, 4.85, 7.6])
  building.curtain(a, b, right + 1.6, length - 0.85, 5.95, 9.05, 2.2)
}
building.curtain(plan[20], plan[21], 0.47, 16.03, 1.04, 9.08, 2.25, [4.5, 5.10])
await building.save('dc-au-don-myers-technology-and-innovation-building', 'Don Myers Technology and Innovation Building')
