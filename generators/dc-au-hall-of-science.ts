/**
 * Factual cross-check (building identity/floor labels only):
 * https://map-american.university-tour.com/hall-of-science-dollhouse
 * Tour illustrations and photos are not geometry evidence.
 * Hall of Science, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/951907144 (OpenStreetMap contributors, ODbL).
 * Height evidence: DC OCTO 2022 airborne lidar, NOAA Digital Coast dataset 9837,
 * 1 m classified-building DSM plus bare earth DEM (NAVD88 metres).
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Hall of Science and the garden-facing curtain wall: https://www.american.edu/news/hall-of-science-leed-glass-building.cfm
 * Building form and solar shades: https://ccnet.ballinger.com/design/hallofscience/
 * Main roof 20.9 m and offset two-arm roof enclosure 26.2 m over
 * the site's lower ground (2022 LiDAR). Three principal academic stories as
 * published by AU; Ballinger reports entries on three different levels.
 * Approximate curtain-wall divisions and horizontal solar shades, materials
 * and colors. The 2022 point-cloud raster resolves the mechanical penthouse
 * with a western offset and a tapered north side. Approximate metal shade
 * projections are based on Ballinger's published description of the system.
 * Campus walks meet both ends of the curved glazing:
 * https://www.openstreetmap.org/way/951907147
 * No licensed individual facade photographs were used.
 */
import { ccw, prism, type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const hall = new SportsShell()
const footprint: XY[] = [
  [-24.84, -0.49], [-2.3, -2.22], [-0.33, -28.07], [30.1, -24.98], [29.7, -20.82],
  [29.46, -16.71], [29.46, -12.47], [30.03, -8.15], [34.23, 13.86], [7.54, 16.89],
  [-47.67, 16.84], [-47.65, -0.67],
]
hall.mass(footprint, 0, 20.9)

// This elbow follows the elevated mechanical enclosure visible in the 1 m survey.
const roofEnclosure: XY[] = ccw([
  [-6.5, 11.5], [-21.5, 10.5], [-22.5, 7.5], [-24.5, 9.5], [-25.5, 5.5],
  [-18.5, 2.5], [2.5, 1.5], [4.5, -23.5], [23.5, -23.5],
  [24.5, -22.5], [23.5, -13.5], [28.5, 6.5], [26.5, 8.5],
])
prism(hall.accent, null, roofEnclosure, 20.9, 25.97)
prism(hall.trim, hall.roof, roofEnclosure, 25.97, 26.22)
for (let edge = 0; edge < roofEnclosure.length; edge++) {
  const a = roofEnclosure[edge], b = roofEnclosure[(edge + 1) % roofEnclosure.length]
  const length = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (length > 9) hall.bays(a, b, 22.2, 25.2, 4.4, 0.83, hall.roof)
}

for (let edge = 0; edge < footprint.length; edge++) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  const gardenFace = edge <= 8 || edge === 11
  const wallTop = 20.1
  if (gardenFace) {
    // The garden elevation is glass from plinth to roof with narrow solar shades.
    for (const [sill, head] of [[1.35, 5.25], [5.75, 10.15], [10.68, 15.02], [15.55, wallTop]]) {
      hall.bays(a, b, sill, head, 3.85, 0.965)
    }
    // Along the bowed garden wall the shades cast an actual shadow over the glass.
    if (edge >= 2 && edge <= 8) {
      const length = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (const sill of [5.39, 10.32, 15.19]) {
        hall.face(hall.trim, a, b, 0.10, length - 0.10, sill, sill + 0.17, 0.48)
      }
    }
  } else {
    for (const [sill, head] of [[2.0, 5.1], [7.0, 11.1], [13.0, 18.7]]) {
      hall.bays(a, b, sill, head, 5.8, 0.77)
    }
  }
}
// Paired entrance doors sit by the eastern sidewalk and the upper-level crossing.
for (const [edge, station, floor] of [[3, 2.0, 6.25], [8, 2.65, 6.25]]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  hall.face(hall.accent, a, b, station - 1.45, station + 1.45, floor, floor + 2.9)
  for (const offset of [-1.22, 0.08]) {
    hall.face(hall.detail, a, b, station + offset, station + offset + 1.16, floor + 0.1, floor + 2.45, 0.069)
  }
}
await hall.save('dc-au-hall-of-science', 'Hall of Science', 0xd5d5c9, finish('equipment-screen', 0xa5a6a1))
