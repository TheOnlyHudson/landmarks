/**
 * Hut near Reeves Field, American University.
 * https://www.openstreetmap.org/way/90190486 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 class-6 and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Seven local roof returns show a shallow fall; the fitted corner elevations vary by 0.16 m.
 * Access opening, its position, plinth, fascia thickness and color are estimates.
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-1.45, 1.29], [-1.46, -1.3], [1.44, -1.3], [1.45, 1.3],
]
// Corner heights, in footprint order, from a plane fitted to local roof returns.
shell.utilityRoof(footprint, [3.23, 3.3, 3.39, 3.31], 0.12)
shell.serviceDoor(footprint[0], footprint[1], 1.34, 0.92, 2.1)

await shell.save('dc-au-reeves-field-hut', 'Hut near Reeves Field', 0xc0b09b, finish('service-door', 0x8e938b))
