/**
 * Federal Hall, American University. The middle of three residential slabs
 * in the East Campus plan, shielding two courts. Its long axis runs SE from
 * the court to a shared end wall with the lower Don Myers academic building.
 *
 * Measured plan, rotated 122.30 degrees: https://www.openstreetmap.org/way/535124056.
 * DC zoning order 11-07 finding 138: central residence (Building 3), five
 * principal storeys at 54 feet (16.46 m), residence-room windows face the
 * courtyards. These are approved design dimensions.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf
 * A 2022 AU facility table lists seven levels. Its counting differs from
 * the structural engineer's five principal storeys for the lower halls:
 * https://ehlert-bryan.com/project/american-university-east-campus/ .
 * https://www.american.edu/emergency/upload/east-campus-emergency-plan-4-28-22-final.pdf
 * Precast walls confirmed by the engineer. Bay spacing, finish tone, lower
 * lobby glazing and parapet are simplified estimates. No verified licensed
 * close view for matching the elevation.
 * 2022 DC OCTO aerial lidar, building-class surface and bare earth:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Southern extension 4.5 m, primary roof 16.3 m, upper enclosure 19.5 m
 * above footprint ground P10 at 119.0 m. Enclosure perimeter simplified.
 */
import { CampusShell } from './dc-au-constitution-hall'
import type { XY } from './sea-tacoma-union-station'

const hall = new CampusShell()
const plan: XY[] = [
  [8.88, -12.04], [8.06, -11.97], [9.26, 31.22], [-7.34, 31.67],
  [-8.06, -12.45], [-11.48, -12.44], [-11.81, -24.57], [-8.99, -24.63],
  [-9.02, -29.01], [8.82, -29.66],
]
const westBreak: XY = [-11.72, -20.35], eastBreak: XY = [8.85, -20.35]
const body = [...plan.slice(0, 6), westBreak, eastBreak]
const low = [westBreak, ...plan.slice(6), eastBreak]
hall.mass(body, 0, 16.3)
hall.mass(low, 0, 4.5)
// The upper-level roof enclosure occupies the central part of the main slab.
hall.mass([[-3.5, -3.5], [6.5, -3.5], [7, 21], [-3.3, 21]], 16.3, 19.5)
for (let f = 0; f < 4; f++) {
  const sill = 4.2 + 3.05 * f
  for (const i of [1, 3, 5, 7]) hall.bays(body[i], body[(i + 1) % body.length], sill, sill + 2.05, 4.0, 0.63)
}
hall.bays(plan[2], plan[3], 11.0, 15.1, 4.8, 0.52)
hall.lobby(plan[8], plan[9], 3.65)
hall.bays(plan[1], plan[2], 0.9, 3.3, 4.6, 0.69)
hall.bays(plan[3], plan[4], 0.9, 3.3, 4.6, 0.69)
await hall.save('dc-au-federal-hall', 'Federal Hall')
