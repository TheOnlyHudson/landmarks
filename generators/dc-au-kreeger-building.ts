/**
 * Kreeger Building — American University.
 * This two-story academic building stands beside Watkins on the southwest side of campus.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90189977
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-kreeger-building',
  name: "Kreeger Building",
  anchor: [-77.0926426, 38.934708],
  bearing: 88.96,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [6.71, 18.44], [6.7, 18.67], [-8.57, 18.67], [-8.57, -18.68],
      [6.6, -18.68], [6.61, -18.4], [8.61, -18.4], [8.6, 18.44]
    ],
    eave: 10.8,
    rows: [[1.17, 4.06], [6.24, 9.13]],
    bayWidth: 2.5, pierWidth: 1.5,

  }],
})
