/**
 * Hamilton Building — American University.
 * A small two-story building on the Rockwood Parkway side of campus near Jack Child Hall.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190208
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-hamilton-building',
  name: "Hamilton Building",
  anchor: [-77.0917163, 38.9349595],
  bearing: 54.74,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [6.16, 11.62], [5.81, 11.62], [5.82, 14.4], [-6.17, 14.4],
      [-6.23, -14.16], [6.62, -14.16], [6.63, -9.7], [6.14, -9.71]
    ],
    eave: 10.1,
    rows: [[1.09, 3.79], [5.82, 8.51]],
    bayWidth: 1.6, pierWidth: 1.75,
    roofFaces: [
      [[6.16, 11.62, 10.1], [5.81, 11.62, 10.1], [-0.2, 5.58, 14.29], [-0.02, 5.4, 14.42]],
      [[5.81, 11.62, 10.1], [5.82, 14.4, 10.1], [-0.19, 8.41, 14.29], [-0.2, 5.58, 14.29]],
      [[5.82, 14.4, 10.1], [-6.17, 14.4, 10.1], [-0.19, 8.41, 14.29]],
      [[-6.17, 14.4, 10.1], [-6.23, -14.16, 10.1], [-0.04, -7.98, 14.43], [-0.02, 5.4, 14.42],
      [-0.2, 5.58, 14.29], [-0.19, 8.41, 14.29]],
      [[-6.23, -14.16, 10.1], [6.62, -14.16, 10.1], [4.4, -11.94, 11.66], [3.92, -11.94, 11.66],
      [-0.04, -7.98, 14.43]],
      [[6.62, -14.16, 10.1], [6.63, -9.7, 10.1], [4.4, -11.94, 11.66]],
      [[6.63, -9.7, 10.1], [6.14, -9.71, 10.1], [3.92, -11.94, 11.66], [4.4, -11.94, 11.66]],
      [[6.14, -9.71, 10.1], [6.16, 11.62, 10.1], [-0.02, 5.4, 14.42], [-0.04, -7.98, 14.43],
      [3.92, -11.94, 11.66]]
    ],
  }],
})
