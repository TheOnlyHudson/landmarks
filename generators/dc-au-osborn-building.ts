/**
 * Osborn Building — American University.
 * The small facilities building occupies a separate footprint west of the arena.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
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
    // The 2022 survey resolves a narrow hipped block and a much lower side wing.
    outline: [[6.02,22.06],[-2.91,22.08],[-2.94,-17.88],[6.02,-17.89]],
    eave: 6.15,
    rows: [[.75,2.4],[3.7,5.25]],
    bayWidth: 1.8, pierWidth: 2,
    roofFaces: [
      [[6.02,22.06,6.15],[-2.91,22.08,6.15],[1.55,17.6,7.95]],
      [[-2.91,22.08,6.15],[-2.94,-17.88,6.15],[1.54,-13.4,7.95],[1.55,17.6,7.95]],
      [[-2.94,-17.88,6.15],[6.02,-17.89,6.15],[1.54,-13.4,7.95]],
      [[6.02,-17.89,6.15],[6.02,22.06,6.15],[1.55,17.6,7.95],[1.54,-13.4,7.95]],
    ],
  }, {
    outline: [[-2.92,2.53],[-8.03,2.53],[-8.03,-17.25],[-2.94,-17.25]],
    eave: 3.5,
    rows: [[.8,2.4]],
    bayWidth: 1.8, pierWidth: 2,
    blankEdges: [3],
  }],
})
