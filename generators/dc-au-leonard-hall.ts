/**
 * Leonard Hall — American University.
 * Leonard Hall is one of the long slab residence halls north of the main quad. Horizontal window bands run across its principal elevations.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38094599
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-leonard-hall',
  name: "Leonard Hall",
  anchor: [-77.0895536, 38.9387315],
  bearing: 33.79,
  masonry: 0xbba78d, accent: 0xd1c0a8, roof: 0x8b8a80,
  wings: [{
    outline: [
      [5.99, 35.77], [-6.09, 35.87], [-6.23, 21.7], [-8.28, 21.72],
      [-8.33, 17.25], [-6.65, 17.24], [-6.79, 3.29], [-4.8, 3.27],
      [-4.86, -3.2], [-6.48, -3.19], [-6.62, -17.2], [-8.29, -17.18],
      [-8.33, -21.81], [-6.9, -21.82], [-7.04, -35.34], [5.62, -35.44],
      [5.86, -10.7], [8.29, -10.71], [8.51, 11.04], [5.75, 11.07]
    ],
    eave: 30,
    rows: [[1.27, 3.34], [4.89, 6.96], [8.51, 10.57], [12.13, 14.19], [15.75, 17.81], [19.37, 21.43], [22.99, 25.05], [26.61, 28.67]],
    bayWidth: 3.15, pierWidth: 0.86,
    base: 0.55,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-4.51, 10.51], [-3.51, -10.51], [8.29, -10.71], [8.51, 10.51]
    ],
    bottom: 30, eave: 35.2,
    rows: [],
    bayWidth: 3.15, pierWidth: 0.86,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [0.51, -15.49], [-8.29, -17.18], [-8.33, -21.81], [0.51, -21.51]
    ],
    bottom: 30, eave: 35.2,
    rows: [],
    bayWidth: 3.15, pierWidth: 0.86,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-6.68, 14.6], [-0.49, 14.49], [0.51, 21.51], [-8.28, 21.72],
      [-8.33, 17.25], [-6.65, 17.24]
    ],
    bottom: 30, eave: 35.2,
    rows: [],
    bayWidth: 3.15, pierWidth: 0.86,
  }],
})
