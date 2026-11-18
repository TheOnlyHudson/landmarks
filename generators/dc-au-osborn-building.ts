/**
 * Osborn Building — American University.
 * The small facilities building occupies a separate footprint west of the arena.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190449
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-osborn-building',
  name: "Osborn Building",
  anchor: [-77.090985, 38.9374567],
  bearing: 33.66,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [6.02, 22.06], [-2.91, 22.08], [-2.9, 2.53], [-8.03, 2.53],
      [-8.03, -17.25], [-2.95, -17.25], [-2.94, -17.88], [6.02, -17.89]
    ],
    eave: 6.4,
    rows: [[0.73, 2.36], [3.6, 5.24]],
    bayWidth: 1.8, pierWidth: 2,
    roofFaces: [
      [[6.02, 22.06, 6.4], [-2.91, 22.08, 6.4], [1.55, 17.6, 7.2]],
      [[-2.91, 22.08, 6.4], [-2.9, 2.53, 6.4], [1.56, -1.93, 7.2], [1.55, 17.6, 7.2]],
      [[-2.9, 2.53, 6.4], [-8.03, 2.53, 6.4], [-1.0, -4.5, 7.66], [1.56, -1.93, 7.2]],
      [[-8.03, 2.53, 6.4], [-8.03, -17.25, 6.4], [-1.0, -10.23, 7.66], [-1.0, -4.5, 7.66]],
      [[-8.03, -17.25, 6.4], [-2.95, -17.25, 6.4], [1.51, -12.74, 7.21], [-1.0, -10.23, 7.66]],
      [[-2.95, -17.25, 6.4], [-2.94, -17.88, 6.4], [1.51, -13.37, 7.21], [1.51, -12.74, 7.21]],
      [[-2.94, -17.88, 6.4], [6.02, -17.89, 6.4], [1.51, -13.37, 7.21]],
      [[6.02, -17.89, 6.4], [6.02, 22.06, 6.4], [1.55, 17.6, 7.2], [1.56, -1.93, 7.2],
      [-1.0, -4.5, 7.66], [-1.0, -10.23, 7.66], [1.51, -12.74, 7.21], [1.51, -13.37, 7.21]]
    ],
  }],
})
