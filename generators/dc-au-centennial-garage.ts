/**
 * Centennial Hall Garage, American University.
 * https://www.openstreetmap.org/way/929483468 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 class-6 and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * University documents the attached parking garage: https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf
 * Aboveground part only, with median roof at 7.3 m above lower grade.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [10.25, 4.31], [3.21, 4.47], [-2.44, 10.52], [-12.81, 0.15],
  [-2.32, -10.39], [3.38, -4.49], [10.42, -4.68], [13.67, -1.51],
  [12.38, -0.27], [13.65, 0.96],
]
const height = 7.3
shell.mass(footprint, 0, height)

// The lower wing meets Centennial Hall along the notched end of the tapered neck.
for (const edge of [1, 2, 3, 4]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  shell.bays(a, b, 1.5, 3.8, 4.8, 0.62, shell.accent)
}
await shell.save('dc-au-centennial-garage', 'Centennial Hall Garage', 0xc2b2a2, finish('garage-openings', 0x78756e))
