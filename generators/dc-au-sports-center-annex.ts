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
 * or post-construction lidar was established.
 */
import { rect, prism, type XY } from './sea-tacoma-union-station'
import { PALETTE, finish } from './palette'
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
prism(annex.accent, annex.roof, rect(-3.75, -9, 3.75, 10.5), 15.54, 17.45)
await annex.save('dc-au-sports-center-annex', 'Sports Center Annex', 0xdbccb4, finish('acoustic-screen', 0xa49c90))
