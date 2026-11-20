/**
 * Beeghly Building — American University.
 * Beeghly stands west of the Hall of Science along the campus service drive.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190991
 * https://www.american.edu/communityrelations/clc/upload/2025-06-24-clc-presentation.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-beeghly-building',
  name: "Beeghly Building",
  anchor: [-77.0914403, 38.936843],
  bearing: 33.26,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-10.34, 19.58], [-10.34, -19.6], [-4.68, -19.62], [-4.68, -22.81],
      [9.74, -22.84], [9.74, 22.83], [-4.71, 22.85], [-4.71, 19.57]
    ],
    eave: 14.9,
    rows: [[1.04, 3.57], [5.48, 8.0], [9.91, 12.44]],
    bayWidth: 2.4, pierWidth: 1.65,

  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-3.51, 11.51], [-10.34, 11.51], [-10.34, -10.51], [-6.49, -10.51],
      [-6.49, -1.51], [-4.51, -1.51], [-3.51, -6.51], [5.49, -6.51],
      [5.49, -9.51], [9.74, -9.51], [9.74, 22.83], [-4.71, 22.85],
      [-5.51, 17.49], [-2.51, 17.49], [-1.51, 13.51]
    ],
    bottom: 14.9, eave: 18.4,
    rows: [[15.22, 16.88]],
    bayWidth: 2.4, pierWidth: 1.65,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [9.74, -17.44], [-5.51, -16.49], [-5.51, -19.61], [-4.68, -22.81],
      [9.74, -22.84]
    ],
    bottom: 14.9, eave: 18.4,
    rows: [[15.22, 16.88]],
    bayWidth: 2.4, pierWidth: 1.65,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-6.49, 13.49], [-6.49, 19.57], [-10.34, 19.58], [-10.34, 13.49]
    ],
    bottom: 14.9, eave: 18.4,
    rows: [[15.22, 16.88]],
    bayWidth: 2.4, pierWidth: 1.65,
  }],
})
