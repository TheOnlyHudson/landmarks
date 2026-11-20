/**
 * Butler Pavilion — American University.
 * The narrow pavilion stands between the central quad and the sports complex.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38075681
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-butler-pavilion',
  name: "Butler Pavilion",
  anchor: [-77.0890763, 38.9375028],
  bearing: 123.85,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-3.3, -34.99], [-3.4, -14.76], [9.3, -14.72], [9.91, 14.41],
      [10.36, 22.11], [-5.99, 21.95], [-8.15, 17.93], [-8.14, -35.01]
    ],
    eave: 18.6,
    rows: [[0.87, 2.93], [4.48, 6.54], [8.09, 10.15], [11.7, 13.75], [15.31, 17.36]],
    bayWidth: 2.9, pierWidth: 1.55,
    blankEdges: [0, 1, 2, 7],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-6.45, 21.09], [-5.51, -2.51], [-1.51, -4.51], [-1.51, -14.76],
      [9.3, -14.72], [10.36, 22.11]
    ],
    bottom: 18.6, eave: 22.3,
    rows: [[18.92, 20.97]],
    bayWidth: 2.9, pierWidth: 1.55,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-1.5, 21.39], [-0.51, 11.49], [4.51, 11.49], [6.51, 13.49],
      [6.51, 21.51]
    ],
    bottom: 22.3, eave: 26.1,
    rows: [],
    bayWidth: 2.9, pierWidth: 1.55,
  }],
})
