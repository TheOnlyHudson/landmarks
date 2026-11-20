/**
 * Duber Hall, formerly Congressional Hall, American University. The western
 * residential finger on East Campus has a widened end at New Mexico Avenue.
 * The southeast end meets the low academic building. Body and end block
 * follow https://www.openstreetmap.org/way/535124891, currently tagged Duber Hall.
 * Ground anchor at the polygon centroid, major axis 136.00°.
 *
 * DC Zoning Order 11-07 finding 137 gives the New Mexico Avenue dorm a
 * design roof of 54 ft, drawn as 16.46 m, and five principal storeys.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf
 * 2022 campus facilities count lists six levels including all named floors.
 * https://www.american.edu/emergency/upload/east-campus-emergency-plan-4-28-22-final.pdf
 * Built of precast, per the structural engineer:
 * https://ehlert-bryan.com/project/american-university-east-campus/ .
 * Photo reference, west end from New Mexico Avenue, Herrperry123,
 * CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:East_Campus_Residence_Hall.jpg
 * The grouped facade windows, shared-space glazing and their dimensions
 * are approximations. Interior details and planting omitted.
 * https://www.american.edu/buildingau/upload/east-campus-fact-sheet.pdf
 * 2022 DC OCTO aerial lidar, building-class surface and bare earth:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Roof 16.5 m, three raised sections approximately 18.0 m, measured
 * above the lower ground decile (118.8 m).
 * New Mexico Avenue design elevations record a glazed stair at the west end,
 * upper residential bays and a lower garage entry. Position/width of glazing
 * simplified; roof casings follow independent full-surface lidar groups.
 * https://www.american.edu/finance/ppm/upload/exhibit-1-east-campus.pdf
 */
import { CampusShell } from './dc-au-constitution-hall'
import type { XY } from './sea-tacoma-union-station'

const hall = new CampusShell()
const plan: XY[] = [
  [7.84, -13.25], [7.88, -8.84], [7.13, -8.75], [8.87, 28.11],
  [-6.89, 27.99], [-8.44, -2.56], [-8.62, -16.32], [-10.38, -16.38],
  [-10.49, -25.38], [10.22, -26.1], [10.02, -16.76], [7.7, -16.89],
]
hall.mass(plan, 0, 16.5)
hall.casing([[-1.9, -10.4], [2.3, -10.4], [2.3, -2.0], [-1.6, -1.7]], 16.5, 17.8)
hall.casing([[-0.7, 12.8], [2.8, 12.7], [2.8, 22.7], [-0.7, 22.8]], 16.5, 17.9)
hall.casing([[-0.4, -21.8], [1.2, -23.0], [5.6, -22.7], [7.3, -20.6], [5.8, -18.3], [-0.1, -18.6]], 16.5, 18.07)
// The wider New Mexico end groups its street windows around the ground-floor
// shared-space band. Courtyard elevations have a quieter series of room bays.
for (let floor = 0; floor < 4; floor++) {
  const sill = 4.35 + 3.04 * floor
  for (const edge of [2, 4, 5]) hall.bays(plan[edge], plan[edge + 1], sill, sill + 2.10, 4.0)
  for (const edge of [7, 8, 9]) hall.bays(plan[edge], plan[edge + 1], sill, sill + 2.25, 5.3, 0.75)
}
hall.lobby(plan[5], plan[6], 3.7)
hall.bays(plan[8], plan[9], 0.55, 3.55, 5.2, 0.84)
hall.bays(plan[2], plan[3], 0.85, 3.4, 4.3)
hall.bays(plan[4], plan[5], 0.85, 3.4, 4.3)
hall.bays(plan[3], plan[4], 11.2, 15.3, 5.0, 0.48)
const stairSlabs = [3.88, 6.96, 10.0, 13.04]
hall.curtain(plan[8], plan[9], 0.42, 6.20, 0.38, 16.0, 1.50, stairSlabs)
hall.curtain(plan[7], plan[8], 3.84, 8.7, 0.38, 16.0, 1.58, stairSlabs)
await hall.save('dc-au-duber-hall', 'Duber Hall')
