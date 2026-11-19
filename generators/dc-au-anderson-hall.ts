/**
 * Anderson Hall — American University.
 * The central residence hall in the connected Anderson, Centennial and Letts complex on South Campus.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38076903
 * https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-anderson-hall',
  name: "Anderson Hall",
  anchor: [-77.0908259, 38.9359033],
  bearing: 33.31,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-14.01, 40.96], [-15.0, 10.68], [-14.4, -9.86], [-14.59, -40.67],
      [-10.92, -40.65], [-10.92, -42.25], [-11.63, -42.3], [-11.72, -47.7],
      [4.36, -47.76], [4.41, -42.99], [7.21, -43.01], [7.18, -47.82],
      [25.66, -48.08], [25.89, -35.47], [14.07, -35.31], [14.07, -40.18],
      [7.3, -40.21], [7.38, -9.37], [2.62, -9.38], [2.69, -7.58],
      [8.85, -7.61], [8.68, 7.82], [2.8, 7.7], [2.96, 9.43],
      [7.57, 9.39], [7.91, 39.88], [14.69, 40.12], [14.58, 35.4],
      [25.83, 35.32], [25.89, 47.66], [7.8, 47.69], [7.8, 43.04],
      [4.96, 43.07], [4.87, 47.82], [-11.1, 47.95], [-11.12, 42.57],
      [-10.36, 42.56], [-10.38, 40.87]
    ],
    eave: 9.4,
    rows: [[1.14, 3.12], [4.61, 6.58], [8.07, 8.82]],
    bayWidth: 1.72, pierWidth: 1.44,
    base: 0.45,
    blankEdges: [1, 12, 28],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [25.57, 47.66], [7.8, 47.69], [7.8, 43.04], [4.96, 43.07],
      [4.87, 47.82], [-11.1, 47.95], [-10.38, 40.87], [-14.01, 40.96],
      [-14.59, -40.67], [-10.92, -40.65], [-11.72, -47.7], [4.36, -47.76],
      [4.41, -42.99], [7.21, -43.01], [7.18, -47.82], [25.66, -48.08],
      [25.89, -35.47], [14.07, -35.31], [14.07, -40.18], [7.3, -40.21],
      [7.38, -9.37], [2.62, -9.38], [2.69, -7.58], [4.51, -7.58],
      [4.51, 7.74], [2.8, 7.7], [2.96, 9.43], [7.57, 9.39],
      [7.91, 39.88], [14.69, 40.12], [14.58, 35.4], [25.83, 35.32]
    ],
    bottom: 9.4, eave: 25.2,
    rows: [[11.54, 13.51], [15.0, 16.97], [18.46, 20.44], [21.93, 23.9]],
    bayWidth: 1.72, pierWidth: 1.44,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-9.51, 14.51], [-14.2, 14.51], [-14.37, -9.51], [-10.51, -9.51],
      [-9.51, -24.51], [1.51, -25.51], [1.51, 24.51], [-8.51, 24.51]
    ],
    bottom: 25.2, eave: 30.1,
    rows: [],
    bayWidth: 1.72, pierWidth: 1.44,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-5.49, 7.51], [-14.25, 7.51], [-14.37, -9.4], [-5.49, -8.51]
    ],
    bottom: 30.1, eave: 36.0,
    rows: [],
    bayWidth: 1.72, pierWidth: 1.44,
  }],
})
