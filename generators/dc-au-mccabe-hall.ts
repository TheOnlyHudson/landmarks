/**
 * McCabe Hall — American University.
 * One of the four low, two-story brick halls grouped south of the library along Nebraska Avenue.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190518
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-mccabe-hall',
  name: "McCabe Hall",
  anchor: [-77.0898094, 38.9350672],
  bearing: 123.72,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-9.24, 23.14], [-9.23, -26.82], [4.23, -26.8], [4.23, -0.74],
      [15.62, -0.72], [15.62, 12.71], [10.95, 12.71], [10.94, 15.82],
      [4.35, 15.8], [4.34, 23.16]
    ],
    eave: 6.7,
    rows: [[0.76, 2.48], [3.78, 5.5]],
    bayWidth: 1.38, pierWidth: 1.68,
    roofFaces: [
      [[-9.24, 23.14, 6.7], [-9.23, -26.82, 6.7], [-2.5, -20.08, 9.39], [-2.5, 5.99, 9.39],
      [-0.97, 7.52, 10.01], [-2.44, 8.99, 9.42], [-2.44, 16.36, 9.42]],
      [[-9.23, -26.82, 6.7], [4.23, -26.8, 6.7], [-2.5, -20.08, 9.39]],
      [[4.23, -26.8, 6.7], [4.23, -0.74, 6.7], [-2.5, 5.99, 9.39], [-2.5, -20.08, 9.39]],
      [[4.23, -0.74, 6.7], [15.62, -0.72, 6.7], [8.9, 5.99, 9.39], [4.24, 5.98, 9.39],
      [2.69, 7.53, 10.01], [-0.97, 7.52, 10.01], [-2.5, 5.99, 9.39]],
      [[15.62, -0.72, 6.7], [15.62, 12.71, 6.7], [8.9, 5.99, 9.39]],
      [[15.62, 12.71, 6.7], [10.95, 12.71, 6.7], [4.24, 5.98, 9.39], [8.9, 5.99, 9.39]],
      [[10.95, 12.71, 6.7], [10.94, 15.82, 6.7], [2.69, 7.53, 10.01], [4.24, 5.98, 9.39]],
      [[10.94, 15.82, 6.7], [4.35, 15.8, 6.7], [-2.44, 8.99, 9.42], [-0.97, 7.52, 10.01],
      [2.69, 7.53, 10.01]],
      [[4.35, 15.8, 6.7], [4.34, 23.16, 6.7], [-2.44, 16.36, 9.42], [-2.44, 8.99, 9.42]],
      [[4.34, 23.16, 6.7], [-9.24, 23.14, 6.7], [-2.44, 16.36, 9.42]]
    ],
  }],
})
