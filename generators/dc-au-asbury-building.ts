/**
 * Asbury Building — American University.
 * The service and academic building west of the student center has two long wings enclosing a court.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190611
 * https://www.american.edu/communityrelations/clc/upload/2025-06-24-clc-presentation.pdf
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-asbury-building',
  name: "Asbury Building",
  anchor: [-77.0903, 38.9371892],
  bearing: 123.66,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-17.41, -33.33], [-13.69, -33.32], [-13.7, -34.17], [-0.55, -34.14],
      [-0.55, -38.93], [6.39, -38.91], [6.39, -30.5], [-0.02, -30.51],
      [-0.03, -18.55], [3.48, -18.54], [3.48, -12.8], [20.08, -12.77],
      [20.08, -7.04], [17.12, -7.04], [17.13, -4.92], [20.16, -4.91],
      [20.16, -2.28], [17.09, -2.29], [17.1, -0.81], [22.67, -0.8],
      [22.66, 31.37], [16.92, 31.36], [16.92, 34.2], [10.35, 34.19],
      [10.36, 10.35], [7.98, 10.35], [7.97, 7.89], [10.36, 7.9],
      [10.36, -0.78], [-6.89, -0.81], [-6.9, 34.3], [-13.31, 34.3],
      [-13.32, 31.46], [-18.94, 31.45], [-18.94, -0.79], [-13.52, -0.77],
      [-13.51, -7.22], [-16.38, -7.22], [-16.37, -12.64], [-13.67, -12.63],
      [-13.67, -20.67], [-17.41, -20.68]
    ],
    eave: 6.8,
    rows: [[0.95, 3.24], [4.97, 6.22]],
    bayWidth: 2, pierWidth: 1.8,

  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [20.08, -12.77], [20.08, -7.04], [17.12, -7.04], [17.13, -4.92],
      [20.16, -4.91], [20.16, -2.28], [17.09, -2.29], [17.1, -0.81],
      [22.67, -0.8], [22.66, 31.37], [16.92, 31.36], [16.92, 34.2],
      [10.35, 34.19], [10.36, -0.78], [-6.89, -0.81], [-6.9, 34.3],
      [-13.31, 34.3], [-13.32, 31.46], [-18.94, 31.45], [-18.94, -0.79],
      [-13.52, -0.77], [-13.51, -7.22], [-16.38, -7.22], [-16.37, -12.64]
    ],
    bottom: 6.8, eave: 12.7,
    rows: [[8.99, 11.28]],
    bayWidth: 2, pierWidth: 1.8,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-9.51, -17.49], [-10.51, -28.51], [-8.51, -28.51], [-8.51, -30.51],
      [-1.49, -29.51], [-3.49, -17.49]
    ],
    bottom: 6.8, eave: 12.7,
    rows: [[8.99, 11.28]],
    bayWidth: 2, pierWidth: 1.8,
  }],
})
