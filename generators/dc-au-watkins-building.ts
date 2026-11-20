/**
 * Watkins Building — American University.
 * The two-story Watkins Building has a rectangular plan at the southwestern edge of campus.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190715
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-watkins-building',
  name: "Watkins Building",
  anchor: [-77.0928918, 38.9352686],
  bearing: 52.92,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [8.64, 18.66], [-8.64, 18.69], [-8.64, -18.65], [8.64, -18.68]
    ],
    eave: 9.5,
    rows: [[1.03, 3.56], [5.46, 7.98]],
    bayWidth: 2.55, pierWidth: 1.45,

  }],
})
