/**
 * Media Production Center — American University.
 * The media facility has a stepped footprint along the west edge of the south residence halls.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38110446
 * https://www.american.edu/about/upload/campus-map.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-media-production-center',
  name: "Media Production Center",
  anchor: [-77.0919493, 38.9363926],
  bearing: 123.63,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-7.88, -21.38], [14.12, -21.38], [14.12, -20.28], [15.3, -20.28],
      [15.71, -5.05], [5.21, -5.15], [5.44, 7.76], [13.44, 7.77],
      [13.61, 18.85], [-19.09, 18.96], [-19.01, 8.19], [-9.4, 7.98],
      [-9.57, -9.74], [-8.02, -9.72]
    ],
    eave: 5,
    rows: [[0.94, 3.21]],
    bayWidth: 1.85, pierWidth: 2.5,
    blankEdges: [1, 2],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [13.6, 18.54], [-19.09, 18.96], [-19.01, 8.19], [-9.4, 7.98],
      [-9.57, -9.74], [4.51, -10.51], [6.51, -9.51], [6.51, -5.13],
      [5.21, -5.15], [5.44, 7.76], [13.45, 8.36]
    ],
    bottom: 5, eave: 8.6,
    rows: [[5.32, 7.19]],
    bayWidth: 1.85, pierWidth: 2.5,
  }],
})
