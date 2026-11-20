/**
 * Sports Center Annex, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/1509229468 (OpenStreetMap contributors, ODbL).
 * Published design heights and floor counts: https://www.american.edu/communityrelations/campus-plan/meltzer-center-feedback-and-reponses.cfm
 * Completed complex: https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm
 * Long, three-story connector. AU proposed approximately 51 ft (15.54 m)
 * above grade, plus screened rooftop plant. The May 2026 polygon replaces
 * the demolished sports annex footprint. Its long walls touch the gym buildings,
 * so glazing is concentrated at its free ends. Pane widths, material colors
 * and plant screen dimensions are estimated. No current open exterior photo
 * or post-construction lidar was established. A planted roof with a screened
 * dedicated outside-air unit is shown on the engineering roof schedule.
 * https://www.american.edu/communityrelations/campus-plan/upload/facilities-planning-slide-deck-2-27-23.pdf
 * The wall returns, two-tone brick, service screen and shade depths are
 * approximations of the materials and levels recorded in the zoning submission.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-further-processing-of-application-20-31b.pdf
 */
import { rect, prism, type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const annex = new SportsShell()
const footprint: XY[] = [
  [8.09, 29.01], [-8.47, 29.03], [-8.4, -17.78], [-8.4, -27.82], [0.33, -27.63],
  [0.18, -30.35], [8.46, -29.63],
]
annex.mass(footprint, 0, 15.54)
// Ends remain exposed between the two gyms. The northern one opens towards the road.
for (const edge of [0, 3, 5]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  for (const [sill, head] of [[0.85, 4.2], [5.65, 9.65], [10.8, 14.6]]) {
    annex.bays(a, b, sill, head, 4.0, 0.85)
  }
}
annex.bays(footprint[2], footprint[3], 5.65, 9.65, 4.0, 0.73)
annex.bays(footprint[2], footprint[3], 10.8, 14.6, 4.0, 0.73)
// The end bay projects towards Reeves Field. Closely spaced tall fins
// frame its glazing and separate the two public levels from the ground entrance.
for (const edge of [0, 5]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  const width = Math.hypot(b[0] - a[0], b[1] - a[1])
  const bays = Math.round(width / 3.8)
  for (let i = 1; i < bays; i++) {
    const station = width * i / bays
    annex.face(annex.accent, a, b, station - 0.17, station + 0.17, 4.7, 15.13, 0.28)
  }
}
annex.face(annex.accent, footprint[5], footprint[6], 0.35, 7.85, 4.29, 4.60, 0.72)
const plantedEdge = rect(-7.2, -25.0, 7.0, 26.7)
prism(annex.roof, annex.detail, plantedEdge, 15.54, 15.62)
const plant = rect(-3.75, -9, 3.75, 10.5)
prism(annex.accent, annex.roof, plant, 15.62, 17.45)
for (const edge of [1, 3]) {
  annex.bays(plant[edge], plant[(edge + 1) % 4], 15.95, 17.2, 3.8, 0.84, annex.roof)
}
await annex.save('dc-au-sports-center-annex', 'Sports Center Annex', 0xc09b85, finish('weathered-brick', 0x98745e), finish('planted-roof', 0x99a380))
