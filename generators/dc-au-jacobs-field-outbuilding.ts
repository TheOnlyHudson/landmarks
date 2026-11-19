/**
 * Outbuilding near Jacobs Field, American University.
 * https://www.openstreetmap.org/way/90190857 (OpenStreetMap contributors, ODbL), May 22, 2026 extract.
 * Ground footprint, centroid and alignment from OSM. Heights above lower site
 * measured from the NOAA/DC OCTO 2022 class-6 and bare-earth lidar, 1 m grid.
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Descriptive label; no official building name established.
 * Colors, coping and facade details are estimates. No licensed facade photos established.
 */
import { prism, type XY } from './sea-tacoma-union-station'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const shell = new SportsShell()
const footprint: XY[] = [
  [-2.04, 5.16], [-4.93, -2.59], [2.04, -5.17], [4.93, 2.6],
]
const height = 3.3
shell.mass(footprint, 0, height)

// A short higher patch near the middle of the survey is simplified as a roof upstand.
prism(shell.trim, shell.roof, [[-2.4, -2.8], [0.4, -2.8], [0.4, -0.9], [-2.4, -0.9]], height, 3.78)
await shell.save('dc-au-jacobs-field-outbuilding', 'Outbuilding near Jacobs Field', 0xc7b198)
