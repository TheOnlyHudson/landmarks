/**
 * Former Child Development Center — American University.
 * The former Child Development Center building stands west of the southern residence halls.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190440
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-former-child-development-center',
  name: "Former Child Development Center",
  anchor: [-77.091831, 38.9356743],
  bearing: 84.56,
  masonry: 0xac8270, accent: 0xcbbca7, roof: 0x847f79,
  wings: [{
    outline: [
      [-9.77, 0.72], [-9.77, -7.58], [6.82, -7.58], [6.82, 10.34],
      [-2.07, 10.34], [-2.08, 0.72]
    ],
    eave: 5.0,
    rows: [[1.02, 3.5]],
    bayWidth: 1.5, pierWidth: 2.2,
    roofFaces: [
      [[-9.77, 0.72, 5.0], [-9.77, -7.58, 5.0], [-5.62, -3.43, 6.29]],
      [[-9.77, -7.58, 5.0], [6.82, -7.58, 5.0], [2.36, -3.13, 6.38], [2.06, -3.43, 6.29],
      [-5.62, -3.43, 6.29]],
      [[6.82, -7.58, 5.0], [6.82, 10.34, 5.0], [2.37, 5.89, 6.38], [2.36, -3.13, 6.38]],
      [[6.82, 10.34, 5.0], [-2.07, 10.34, 5.0], [2.37, 5.89, 6.38]],
      [[-2.07, 10.34, 5.0], [-2.08, 0.72, 5.0], [2.06, -3.43, 6.29], [2.36, -3.13, 6.38],
      [2.37, 5.89, 6.38]],
      [[-2.08, 0.72, 5.0], [-9.77, 0.72, 5.0], [-5.62, -3.43, 6.29], [2.06, -3.43, 6.29]]
    ],
  }],
})
