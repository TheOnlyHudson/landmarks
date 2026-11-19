/**
 * McDowell Hall — American University.
 * Mcdowell Hall is one of the long slab residence halls north of the main quad. Horizontal window bands run across its principal elevations.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38094598
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-mcdowell-hall',
  name: "McDowell Hall",
  anchor: [-77.0889124, 38.9386343],
  bearing: 124.21,
  masonry: 0xbba78d, accent: 0xd1c0a8, roof: 0x8b8a80,
  wings: [{
    outline: [
      [5.38, 26.56], [5.68, 2.18], [2.2, 2.26], [2.07, 6.0],
      [-1.41, 6.08], [-1.94, 23.32], [-14.81, 22.51], [-14.74, 6.9],
      [-15.73, 5.5], [-15.76, -13.77], [-14.51, -14.94], [-14.3, -32.4],
      [-1.38, -32.2], [-1.28, -14.39], [2.1, -14.33], [2.32, -10.57],
      [18.78, -10.41], [18.78, 26.66]
    ],
    eave: 8.6,
    rows: [[1.3, 3.44], [5.05, 7.19]],
    bayWidth: 3.15, pierWidth: 0.86,
    base: 0.55,
    blankEdges: [17],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-14.3, -32.4], [-1.38, -32.2], [-1.28, -14.39], [2.1, -14.33],
      [2.32, -10.57], [18.78, -10.41], [18.78, 3.51], [5.66, 3.51],
      [5.68, 2.18], [2.2, 2.26], [2.07, 6.0], [-1.41, 6.08],
      [-1.94, 23.32], [-14.81, 22.51]
    ],
    bottom: 8.6, eave: 27.3,
    rows: [[8.92, 10.94], [12.55, 14.69], [16.3, 18.44], [20.05, 22.19], [23.8, 25.94]],
    bayWidth: 3.15, pierWidth: 0.86,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [5.49, 22.49], [18.78, 22.49], [18.78, 26.66], [5.49, 26.56]
    ],
    bottom: 8.6, eave: 27.3,
    rows: [[8.92, 10.94], [12.55, 14.69], [16.3, 18.44], [20.05, 22.19], [23.8, 25.94]],
    bayWidth: 3.15, pierWidth: 0.86,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-8.51, 5.51], [-8.51, -16.51], [2.1, -14.33], [2.32, -10.57],
      [11.51, -9.51], [11.51, 1.51], [3.51, 1.51], [2.2, 2.26],
      [2.07, 6.0]
    ],
    bottom: 27.3, eave: 32.2,
    rows: [],
    bayWidth: 3.15, pierWidth: 0.86,
  }],
})
