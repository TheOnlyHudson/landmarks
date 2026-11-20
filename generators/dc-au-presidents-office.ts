/**
 * President’s Office — American University.
 * The Federal-style office has light siding, a central portico and a hipped roof.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38110182
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-presidents-office',
  name: "President’s Office",
  anchor: [-77.0884133, 38.9390966],
  bearing: 34.06,
  masonry: 0xded9c9, accent: 0xede5d2, roof: 0x6e6e68,
  sash: 'six-over-six',
  chimneys: [[1.2,-5.8],[1.2,5.8]],
  wings: [{
    outline: [
      [-8.05, 4.39], [-8.05, -5.2], [-4.25, -5.19], [-4.25, -8.43],
      [6.67, -8.4], [6.67, 8.59], [-4.26, 8.56], [-4.26, 4.4]
    ],
    eave: 8.7,
    rows: [[0.95, 3.25], [4.98, 7.27]],
    bayWidth: 1.25, pierWidth: 1.55,
    portico: { edge: 3, width: 4.2, depth: 1.55, height: 3.4, columns: 2, pediment: true },
    roofFaces: [
      [[-8.05, 4.39, 8.7], [-8.05, -5.2, 8.7], [-3.25, -0.4, 10.0]],
      [[-8.05, -5.2, 8.7], [-4.25, -5.19, 8.7], [1.21, 0.27, 10.18], [1.21, 0.28, 10.18],
      [0.54, -0.39, 10.0], [-3.25, -0.4, 10.0]],
      [[-4.25, -5.19, 8.7], [-4.25, -8.43, 8.7], [1.21, -2.95, 10.17], [1.21, 0.27, 10.18]],
      [[-4.25, -8.43, 8.7], [6.67, -8.4, 8.7], [1.21, -2.95, 10.17]],
      [[6.67, -8.4, 8.7], [6.67, 8.59, 8.7], [1.21, 3.11, 10.18], [1.21, 0.28, 10.18],
      [1.21, 0.27, 10.18], [1.21, -2.95, 10.17]],
      [[6.67, 8.59, 8.7], [-4.26, 8.56, 8.7], [1.21, 3.11, 10.18]],
      [[-4.26, 8.56, 8.7], [-4.26, 4.4, 8.7], [0.54, -0.39, 10.0], [1.21, 0.28, 10.18],
      [1.21, 3.11, 10.18]],
      [[-4.26, 4.4, 8.7], [-8.05, 4.39, 8.7], [-3.25, -0.4, 10.0], [0.54, -0.39, 10.0]]
    ],
  }],
})
