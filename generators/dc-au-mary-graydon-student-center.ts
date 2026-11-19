/**
 * Mary Graydon Student Center — American University.
 * The student center occupies the broad west side of the quad between Battelle-Tompkins and McKinley.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38075678
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-mary-graydon-student-center',
  name: "Mary Graydon Student Center",
  anchor: [-77.0889544, 38.9369299],
  bearing: 34.15,
  masonry: 0xd3c8b6, accent: 0xddd3bd, roof: 0x777873,
  wings: [{
    outline: [
      [-25.05, 36.49], [-25.98, 22.62], [-20.59, 22.37], [-19.19, -19.5],
      [-25.14, -19.59], [-25.99, -37.92], [1.13, -37.68], [1.2, -34.44],
      [22.22, -33.98], [24.48, -23.82], [22.67, -23.86], [23.48, -4.82],
      [25.84, -4.85], [25.57, 6.07], [21.91, 5.76], [22.08, 25.45],
      [24.06, 25.46], [24.14, 35.28], [2.89, 34.98], [3.03, 38.14]
    ],
    eave: 9.5,
    rows: [[1.95, 5.24], [7.72, 8.92]],
    bayWidth: 2.35, pierWidth: 1.75,
    base: 0.8,
    portico: { edge: 12, width: 9, depth: 1.5, height: 6, columns: 4, arcades: true, pediment: false },
    blankEdges: [0, 4],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [1.51, 36.51], [1.51, 38.06], [-25.05, 36.49], [-25.98, 22.62],
      [-20.59, 22.37], [-20.41, 17.0], [-4.49, 17.0], [-4.49, 24.49],
      [-2.51, 24.49], [0.49, 21.49], [0.49, 17.0], [22.01, 17.0],
      [23.47, 35.27], [2.89, 34.98], [2.96, 36.51]
    ],
    bottom: 9.5, eave: 18.6,
    rows: [[9.82, 11.01], [13.49, 16.77]],
    bayWidth: 2.35, pierWidth: 1.75,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [22.01, 17.0], [0.49, 17.0], [0.49, 11.51], [-4.49, 12.51],
      [-4.49, 17.0], [-20.41, 17.0], [-19.19, -19.5], [-25.16, -20.0],
      [-3.99, -20.0], [-3.49, -15.51], [0.49, -14.51], [-0.06, -20.0],
      [22.84, -20.0], [22.51, -8.51], [23.48, -4.82], [25.51, -4.84],
      [25.51, 6.07], [21.91, 5.76]
    ],
    bottom: 9.5, eave: 18.6,
    rows: [[9.82, 11.01], [13.49, 16.77]],
    bayWidth: 2.35, pierWidth: 1.75,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [22.84, -20.0], [-0.06, -20.0], [-0.51, -24.49], [-4.49, -24.49],
      [-3.99, -20.0], [-25.16, -20.0], [-25.99, -37.92], [1.13, -37.68],
      [1.2, -34.44], [22.22, -33.98], [24.4, -23.82], [22.67, -23.86]
    ],
    bottom: 9.5, eave: 18.6,
    rows: [[9.82, 11.01], [13.49, 16.77]],
    bayWidth: 2.35, pierWidth: 1.75,
  }],
})
