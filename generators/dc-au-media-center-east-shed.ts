/**
 * East Shed near the Media Production Center, American University.
 * https://www.openstreetmap.org/way/90190634 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 all-returns and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { type XY } from './sea-tacoma-union-station'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-1.23, 2.19], [-1.17, -2.24], [1.24, -2.18], [1.17, 2.23],
]
const height = 2.33
shell.mass(footprint, 0, height)

// The measured roof is almost level across the narrow, four-metre-long shed.
await shell.save('dc-au-media-center-east-shed', 'East Shed near the Media Production Center', 0xb9aea0)
