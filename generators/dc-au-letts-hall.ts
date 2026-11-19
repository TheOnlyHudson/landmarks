/**
 * Letts Hall — American University.
 * The southeastern residence hall in the connected Anderson, Centennial and Letts complex on South Campus.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38076904
 * https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-letts-hall',
  name: "Letts Hall",
  anchor: [-77.0903118, 38.9356264],
  bearing: 33.43,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-5.08, -46.89], [1.43, -47.08], [1.17, -52.54], [9.06, -52.64],
      [9.16, -47.02], [11.02, -46.99], [11.1, -40.0], [14.04, -40.0],
      [14.09, -8.53], [9.42, -8.58], [9.38, -6.77], [23.05, -6.86],
      [22.87, 8.48], [9.4, 8.53], [9.48, 10.21], [14.17, 10.15],
      [14.24, 41.55], [10.5, 41.5], [10.62, 43.17], [11.32, 43.19],
      [11.32, 48.7], [-4.81, 48.72], [-4.67, 43.88], [-7.57, 43.88],
      [-7.62, 48.75], [-28.31, 48.85], [-28.33, 36.51], [-14.5, 36.29],
      [-14.42, 40.93], [-7.74, 41.05], [-7.56, 8.97], [-3.74, 8.91],
      [-3.79, 4.77], [-11.8, 4.88], [-11.98, -7.42], [-4.1, -7.52],
      [-4.15, -10.54], [-7.92, -10.49], [-7.9, -39.3], [-14.71, -39.19],
      [-14.81, -34.38], [-28.13, -34.27], [-28.33, -46.89], [-7.9, -46.92],
      [-7.82, -42.16], [-5.06, -42.13]
    ],
    eave: 8,
    rows: [[1.1, 2.94], [4.33, 6.18]],
    bayWidth: 1.72, pierWidth: 1.44,
    base: 0.45,
    blankEdges: [25, 41],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-5.38, -7.51], [-4.1, -7.52], [-4.15, -10.54], [-7.92, -10.49],
      [-7.9, -39.3], [-14.71, -39.19], [-14.81, -34.38], [-28.13, -34.27],
      [-28.33, -46.89], [-7.9, -46.92], [-7.82, -42.16], [-5.06, -42.13],
      [-5.08, -46.89], [9.13, -48.48], [9.16, -47.02], [10.89, -47.0],
      [11.1, -40.0], [14.04, -40.0], [14.09, -8.53], [9.42, -8.58],
      [9.38, -6.77], [11.66, -6.78], [9.51, -5.49], [10.45, 8.53],
      [9.4, 8.53], [9.48, 10.21], [14.17, 10.15], [14.24, 41.55],
      [10.5, 41.5], [11.32, 48.51], [-4.81, 48.72], [-4.67, 43.88],
      [-7.57, 43.88], [-7.62, 48.75], [-28.31, 48.85], [-28.33, 36.51],
      [-14.5, 36.29], [-14.42, 40.93], [-7.74, 41.05], [-7.56, 8.97],
      [-3.74, 8.91]
    ],
    bottom: 8, eave: 23.6,
    rows: [[8.32, 9.41], [10.8, 12.65], [14.04, 15.88], [17.28, 19.12], [20.51, 22.36]],
    bayWidth: 1.72, pierWidth: 1.44,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-3.51, 25.51], [-2.51, -24.51], [7.51, -23.51], [8.51, 19.51],
      [6.51, 25.51]
    ],
    bottom: 23.6, eave: 28.5,
    rows: [],
    bayWidth: 1.72, pierWidth: 1.44,
  }],
})
