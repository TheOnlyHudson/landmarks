/**
 * Hurst Hall — American University.
 * The white marble science building faces the quad with a pedimented central portico.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190366
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://sah-archipedia.org/buildings/DC-01-NW37
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-hurst-hall',
  name: "Hurst Hall",
  anchor: [-77.08747, 38.9368734],
  bearing: 33.66,
  masonry: 0xdfd8c9, accent: 0xede4d4, roof: 0x7b7871,
  sash: 'two-over-two',
  wings: [{
    outline: [
      [10.31, 27.63], [-13.09, 27.66], [-13.08, 9.53], [-14.06, 9.53],
      [-14.05, -9.6], [-13.11, -9.59], [-13.1, -27.55], [10.43, -27.59],
      [10.42, -9.74], [17.7, -9.76], [17.7, 9.73], [10.32, 9.74]
    ],
    bayCounts: { 1: 4, 5: 4 },
    eave: 14.3,
    rows: [[2.78, 6.27], [8.9, 12.39]],
    bayWidth: 1.65, pierWidth: 2.5,
    base: 1.55,
    portico: { steps: 4, edge: 3, width: 12.8, depth: 2.55, height: 13.4, columns: 2, pediment: true, piers: true },
    roofFaces: [
      [[10.31, 27.63, 14.3], [-13.09, 27.66, 14.3], [-1.38, 15.94, 16.99]],
      [[-13.09, 27.66, 14.3], [-13.08, 9.53, 14.3], [-1.33, -2.17, 17.0], [-1.33, -2.0, 17.0],
      [-1.38, -1.95, 16.99], [-1.38, 15.94, 16.99]],
      [[-13.08, 9.53, 14.3], [-14.06, 9.53, 14.3], [-4.49, -0.01, 16.5], [-3.54, -0.01, 16.5],
      [-1.35, -2.19, 17.0], [-1.33, -2.17, 17.0]],
      [[-14.06, 9.53, 14.3], [-14.05, -9.6, 14.3], [-4.49, -0.01, 16.5]],
      [[-14.05, -9.6, 14.3], [-13.11, -9.59, 14.3], [-3.54, -0.01, 16.5], [-4.49, -0.01, 16.5]],
      [[-13.11, -9.59, 14.3], [-13.1, -27.55, 14.3], [-1.34, -15.8, 17.01], [-1.35, -2.19, 17.0],
      [-3.54, -0.01, 16.5]],
      [[-13.1, -27.55, 14.3], [10.43, -27.59, 14.3], [-1.34, -15.8, 17.01]],
      [[10.43, -27.59, 14.3], [10.42, -9.74, 14.3], [0.68, 0.01, 16.54], [-1.33, -2.0, 17.0],
      [-1.33, -2.17, 17.0], [-1.35, -2.19, 17.0], [-1.34, -15.8, 17.01]],
      [[10.42, -9.74, 14.3], [17.7, -9.76, 14.3], [7.97, 0, 16.54], [0.68, 0.01, 16.54]],
      [[17.7, -9.76, 14.3], [17.7, 9.73, 14.3], [7.97, 0, 16.54]],
      [[17.7, 9.73, 14.3], [10.32, 9.74, 14.3], [-1.38, -1.95, 16.99], [-1.33, -2.0, 17.0],
      [0.68, 0.01, 16.54], [7.97, 0, 16.54]],
      [[10.32, 9.74, 14.3], [10.31, 27.63, 14.3], [-1.38, 15.94, 16.99], [-1.38, -1.95, 16.99]]
    ],
  }],
})
