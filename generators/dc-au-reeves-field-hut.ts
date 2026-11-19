/**
 * Hut near Reeves Field, American University.
 * https://www.openstreetmap.org/way/90190486 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 class-6 and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-1.45, 1.29], [-1.46, -1.3], [1.44, -1.3], [1.45, 1.3],
]
const height = 3.4
shell.mass(footprint, 0, height)

// Only the flat roof and perimeter are supported by the survey.
await shell.save('dc-au-reeves-field-hut', 'Hut near Reeves Field', 0xc0b09b)
