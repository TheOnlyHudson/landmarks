/**
 * East Shed near the Media Production Center, American University.
 * https://www.openstreetmap.org/way/90190634 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 all-returns and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * The fitted all-returns roof plane falls about 0.16 m across the mapped shed.
 * Access opening, its position, plinth, fascia thickness and color are estimates.
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-1.23, 2.19], [-1.17, -2.24], [1.24, -2.18], [1.17, 2.23],
]
// Corner heights, in footprint order, from a plane fitted to local roof returns.
shell.utilityRoof(footprint, [2.28, 2.36, 2.28, 2.2], 0.12)
shell.serviceDoor(footprint[1], footprint[2], 1.3, 1.1, 1.97)

await shell.save('dc-au-media-center-east-shed', 'East Shed near the Media Production Center', 0xb9aea0, finish('service-door', 0x8e938b))
