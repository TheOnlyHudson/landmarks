/**
 * Jack Child Hall — American University.
 * The two-story building sits between Hamilton and Rockwood near the southern campus boundary.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38110443
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-jack-child-hall',
  name: "Jack Child Hall",
  anchor: [-77.0912874, 38.9349886],
  bearing: 124.1,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-4.93, -7.25], [4.86, -7.25], [4.94, 7.36], [-4.94, 7.08]
    ],
    eave: 8.8,
    rows: [[0.97, 3.29], [5.04, 7.36]],
    bayWidth: 1.6, pierWidth: 1.75,
    roofFaces: [
      [[-4.93, -7.25, 8.8], [4.86, -7.25, 8.8], [-0.03, -2.34, 10.27]],
      [[4.86, -7.25, 8.8], [4.94, 7.36, 8.8], [-0.01, 2.29, 10.28], [-0.03, -2.34, 10.27]],
      [[4.94, 7.36, 8.8], [-4.94, 7.08, 8.8], [-0.01, 2.29, 10.28]],
      [[-4.94, 7.08, 8.8], [-4.93, -7.25, 8.8], [-0.03, -2.34, 10.27], [-0.01, 2.29, 10.28]]
    ],
  }],
})
