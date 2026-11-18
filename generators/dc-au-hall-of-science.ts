/**
 * Hall of Science, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/951907144 (OpenStreetMap contributors, ODbL).
 * Height evidence: DC OCTO 2022 airborne lidar, NOAA Digital Coast dataset 9837,
 * 1 m classified-building DSM plus bare earth DEM (NAVD88 metres).
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Hall of Science and the garden-facing curtain wall: https://www.american.edu/news/hall-of-science-leed-glass-building.cfm
 * Building form and solar shades: https://ccnet.ballinger.com/design/hallofscience/
 * Main roof 20.9 m and offset two-arm roof enclosure 25.7 m over
 * the site's lower ground (2022 LiDAR). Three principal academic stories as
 * published by AU; Ballinger reports entries on three different levels.
 * Approximate curtain-wall divisions and horizontal solar shades, materials
 * and colors. No licensed individual facade photographs were used.
 */
import { rect, prism, type XY } from './sea-tacoma-union-station'
import { PALETTE, finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const hall = new SportsShell()
const footprint: XY[] = [
  [-24.84, -0.49], [-2.3, -2.22], [-0.33, -28.07], [30.1, -24.98], [29.7, -20.82],
  [29.46, -16.71], [29.46, -12.47], [30.03, -8.15], [34.23, 13.86], [7.54, 16.89],
  [-47.67, 16.84], [-47.65, -0.67],
]
hall.mass(footprint, 0, 20.9)

// This elbow follows the elevated mechanical enclosure visible in the 1 m survey.
const roofEnclosure: XY[] = [
  [-20, 3.1], [4.6, 3.1], [5.2, -21.7], [16.8, -20.7],
  [23.4, -20], [22.6, -8.5], [26, 4], [13, 6], [13, 11.7], [-20, 11.7],
]
prism(hall.accent, hall.roof, roofEnclosure, 20.9, 25.7)

for (let edge = 0; edge < footprint.length; edge++) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  const gardenFace = edge <= 8 || edge === 11
  const wallTop = 20.1
  if (gardenFace) {
    // The garden elevation is glass from plinth to roof with narrow solar shades.
    for (const [sill, head] of [[1.35, 5.25], [5.75, 10.15], [10.68, 15.02], [15.55, wallTop]]) {
      hall.bays(a, b, sill, head, 3.85, 0.965)
    }
  } else {
    for (const [sill, head] of [[2.0, 5.1], [7.0, 11.1], [13.0, 18.7]]) {
      hall.bays(a, b, sill, head, 5.8, 0.77)
    }
  }
}
await hall.save('dc-au-hall-of-science', 'Hall of Science', 0xd5d5c9, finish('equipment-screen', 0xa5a6a1))
