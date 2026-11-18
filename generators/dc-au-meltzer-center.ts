/**
 * Alan and Amy Meltzer Center for Athletic Performance, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/1509229469 (OpenStreetMap contributors, ODbL).
 * Building, photovoltaic array and green roof: https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm
 * Published design heights and floor counts: https://www.american.edu/communityrelations/campus-plan/meltzer-center-feedback-and-reponses.cfm
 * May 2026 mapping records the completed building and adjacent SCAN as
 * separate ways. Two stories, with high gym volume and a roof approximately
 * 51 feet above design grade in the university's published response.
 * Masonry, glazing, a roof garden, solar array and screened plant are documented.
 * Roof zones, panel grouping, wall details and colors are estimates. The 2022
 * lidar flight predates construction. No current open facade imagery established.
 */
import { rect, prism, type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const center = new SportsShell()
const footprint: XY[] = [
  [49.8, -16.4], [33.54, -16.9], [34.09, 24.71], [-28.32, 24.81], [-28.89, 4.57],
  [-38.56, 5.69], [-37.94, -24.36], [-10.28, -24.87], [-9.51, -21.09], [-2.79, -21.49],
  [-3.32, -17.46], [16.84, -17.84], [15.84, -24.85], [33.5, -23.37], [32.79, -20.56],
  [48.69, -20.89],
]
const roof = 15.4
center.mass(footprint, 0, roof)

// Simple planted roof and the solar tables represent the published roof systems.
prism(center.roof, center.detail, rect(-26.8, -16.5, 31.9, -7.0), roof, roof + 0.08)
prism(center.roof, center.detail, rect(-34.6, -21.9, -11.8, -17.2), roof, roof + 0.08)
center.solar(-25.3, -5.4, 5, 5, roof + 0.18, 8.9, 4.5)
prism(center.trim, center.roof, rect(24.5, -4.5, 31.3, 17.8), roof, roof + 2.3)
for (const edge of [2, 3, 4, 5, 6, 11, 12]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  center.bays(a, b, 9.7, 13.65, 6.7, 0.73)
}
for (const edge of [6, 7, 8, 10, 13, 14]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  center.bays(a, b, 1.05, 5.2, 4.7, 0.85)
}
await center.save('dc-au-meltzer-center', 'Alan and Amy Meltzer Center for Athletic Performance', 0xdbccb4, undefined, finish('planted-roof', 0x99a380))
