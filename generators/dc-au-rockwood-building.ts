/**
 * Rockwood Building — American University.
 * A two-story campus building on the Rockwood Parkway side of the southern residence halls.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190174
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-rockwood-building',
  name: "Rockwood Building",
  anchor: [-77.0906859, 38.9348421],
  bearing: 33.52,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [4.23, 7.48], [-4.24, 7.49], [-4.24, -7.48], [4.24, -7.49]
    ],
    eave: 6.5,
    rows: [[0.73, 2.4], [3.66, 5.33]],
    bayWidth: 1.55, pierWidth: 1.75,

  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [0.49, 2.49], [4.23, 2.49], [4.23, 7.48], [0.49, 7.48]
    ],
    bottom: 6.5, eave: 11,
    rows: [],
    bayWidth: 1.55, pierWidth: 1.75,
  }],
})
