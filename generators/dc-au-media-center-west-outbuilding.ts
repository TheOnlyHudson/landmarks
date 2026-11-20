/**
 * West Outbuilding near the Media Production Center, American University.
 * https://www.openstreetmap.org/way/90190349 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 all-returns and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * The fitted all-returns roof plane falls about 0.08 m toward the drive.
 * Access opening, its position, plinth, fascia thickness and color are estimates.
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-1.59, 2.6], [-1.73, -2.52], [1.58, -2.6], [1.73, 2.51],
]
// Corner heights, in footprint order, from a plane fitted to local roof returns.
shell.utilityRoof(footprint, [3.49, 3.41, 3.42, 3.5], 0.12)
shell.serviceDoor(footprint[1], footprint[2], 1.53, 1.6, 2.32)

await shell.save('dc-au-media-center-west-outbuilding', 'West Outbuilding near the Media Production Center', 0xbcad9c, finish('service-door', 0x8e938b))
