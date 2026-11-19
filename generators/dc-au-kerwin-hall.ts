/**
 * Kerwin Hall — American University.
 * The freestanding academic building beside Ward Circle has matching projections on its two long elevations.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90189816
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-kerwin-hall',
  name: "Kerwin Hall",
  anchor: [-77.0869085, 38.9374479],
  bearing: 33.78,
  masonry: 0xd3c8b6, accent: 0xddd3bd, roof: 0x777873,
  wings: [{
    outline: [
      [-11.74, 29.26], [-11.73, 18.46], [-18.57, 18.47], [-18.57, 15.37],
      [-21.34, 15.38], [-21.34, -15.3], [-18.52, -15.3], [-18.52, -18.4],
      [-11.41, -18.42], [-11.42, -29.23], [11.67, -29.26], [11.66, -18.4],
      [18.77, -18.4], [18.76, -15.4], [21.35, -15.41], [21.35, 15.38],
      [18.52, 15.38], [18.52, 18.37], [11.4, 18.38], [11.39, 29.23]
    ],
    eave: 12.6,
    rows: [[2.14, 5.25], [7.59, 10.7]],
    bayWidth: 3.1, pierWidth: 1.1,
    base: 1.05,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-20.03, 15.38], [-20.51, 11.49], [-9.51, 11.49], [-8.51, -9.51],
      [-8.51, -11.49], [-19.51, -11.49], [-18.52, -18.4], [-11.41, -18.42],
      [-11.41, -20.17], [-7.51, -22.51], [-7.51, -24.51], [8.51, -23.51],
      [8.51, -19.51], [18.77, -18.4], [19.51, -12.49], [9.51, -11.49],
      [8.51, -3.51], [9.51, 10.49], [19.51, 11.49], [18.52, 18.37],
      [11.4, 18.38], [7.51, 23.51], [-7.51, 23.51], [-9.51, 19.51],
      [-18.57, 18.47], [-18.57, 15.37]
    ],
    bottom: 12.6, eave: 17.9,
    rows: [[13.04, 16.15]],
    bayWidth: 3.1, pierWidth: 1.1,
  }],
})
