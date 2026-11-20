/**
 * Clark Hall — American University.
 * One of the four low, two-story brick halls grouped south of the library along Nebraska Avenue.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190590
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-clark-hall',
  name: "Clark Hall",
  anchor: [-77.0894225, 38.9354724],
  bearing: 123.72,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-14.41, -15.45], [-10.21, -15.43], [-10.21, -14.95], [9.96, -14.92],
      [9.96, 20.22], [-3.52, 20.19], [-3.51, -1.66], [-5.06, -1.66],
      [-5.06, 0.37], [-7.53, 0.36], [-7.53, 1.69], [-12.31, 1.68],
      [-12.32, -3.11], [-15.28, -3.11], [-15.29, -7.49], [-14.4, -7.49]
    ],
    eave: 5.6,
    rows: [[0.64, 2.06], [3.12, 4.53]],
    bayWidth: 1.38, pierWidth: 1.68,
    roofFaces: [
      [[-14.41, -15.45, 5.6], [-10.21, -15.43, 5.6], [-12.31, -13.34, 6.63]],
      [[-10.21, -15.43, 5.6], [-10.21, -14.95, 5.6], [-12.31, -12.86, 6.63], [-12.31, -13.34, 6.63]],
      [[-10.21, -14.95, 5.6], [9.96, -14.92, 5.6], [3.22, -8.2, 8.9], [3.13, -8.29, 8.85],
      [-5.68, -8.3, 8.86], [-6.41, -9.03, 8.5], [-8.48, -9.03, 8.5], [-12.31, -12.86, 6.63]],
      [[9.96, -14.92, 5.6], [9.96, 20.22, 5.6], [3.22, 13.47, 8.9], [3.22, -8.2, 8.9]],
      [[9.96, 20.22, 5.6], [-3.52, 20.19, 5.6], [3.22, 13.47, 8.9]],
      [[-3.52, 20.19, 5.6], [-3.51, -1.66, 5.6], [3.13, -8.29, 8.85], [3.22, -8.2, 8.9],
      [3.22, 13.47, 8.9]],
      [[-3.51, -1.66, 5.6], [-5.06, -1.66, 5.6], [-8.7, -5.29, 7.38], [-5.68, -8.3, 8.86],
      [3.13, -8.29, 8.85]],
      [[-5.06, -1.66, 5.6], [-5.06, 0.37, 5.6], [-8.69, -3.27, 7.38], [-8.7, -5.29, 7.38]],
      [[-5.06, 0.37, 5.6], [-7.53, 0.36, 5.6], [-9.92, -2.04, 6.77], [-8.69, -3.27, 7.38]],
      [[-7.53, 0.36, 5.6], [-7.53, 1.69, 5.6], [-9.92, -0.71, 6.77], [-9.92, -2.04, 6.77]],
      [[-7.53, 1.69, 5.6], [-12.31, 1.68, 5.6], [-9.92, -0.71, 6.77]],
      [[-12.31, 1.68, 5.6], [-12.32, -3.11, 5.6], [-6.41, -9.03, 8.5], [-5.68, -8.3, 8.86],
      [-8.7, -5.29, 7.38], [-8.69, -3.27, 7.38], [-9.92, -2.04, 6.77], [-9.92, -0.71, 6.77]],
      [[-12.32, -3.11, 5.6], [-15.28, -3.11, 5.6], [-13.09, -5.3, 6.67], [-12.21, -5.3, 6.68],
      [-8.48, -9.03, 8.5], [-6.41, -9.03, 8.5]],
      [[-15.28, -3.11, 5.6], [-15.29, -7.49, 5.6], [-13.09, -5.3, 6.67]],
      [[-15.29, -7.49, 5.6], [-14.4, -7.49, 5.6], [-12.21, -5.3, 6.68], [-13.09, -5.3, 6.67]],
      [[-14.4, -7.49, 5.6], [-14.41, -15.45, 5.6], [-12.31, -13.34, 6.63], [-12.31, -12.86, 6.63],
      [-8.48, -9.03, 8.5], [-12.21, -5.3, 6.68]]
    ],
  }],
})
