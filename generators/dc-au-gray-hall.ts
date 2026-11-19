/**
 * Gray Hall — American University.
 * One of the four low, two-story brick halls grouped south of the library along Nebraska Avenue.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190204
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-gray-hall',
  name: "Gray Hall",
  anchor: [-77.0893515, 38.9349575],
  bearing: 33.51,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [15.5, 1.06], [4.38, 1.08], [4.38, 26.77], [-9.28, 26.8],
      [-9.28, -23.34], [4.2, -23.36], [4.21, -15.95], [11.1, -15.97],
      [11.11, -12.56], [15.49, -12.57]
    ],
    eave: 6.4,
    rows: [[0.73, 2.36], [3.6, 5.24]],
    bayWidth: 1.38, pierWidth: 1.68,
    roofFaces: [
      [[15.5, 1.06, 6.4], [4.38, 1.08, 6.4], [-2.45, -5.74, 9.34], [-0.77, -7.43, 10.06],
      [2.6, -7.43, 10.06], [4.31, -5.73, 9.33], [8.69, -5.74, 9.33]],
      [[4.38, 1.08, 6.4], [4.38, 26.77, 6.4], [-2.45, 19.95, 9.34], [-2.45, -5.74, 9.34]],
      [[4.38, 26.77, 6.4], [-9.28, 26.8, 6.4], [-2.45, 19.95, 9.34]],
      [[-9.28, 26.8, 6.4], [-9.28, -23.34, 6.4], [-2.54, -16.61, 9.3], [-2.53, -9.19, 9.3],
      [-0.77, -7.43, 10.06], [-2.45, -5.74, 9.34], [-2.45, 19.95, 9.34]],
      [[-9.28, -23.34, 6.4], [4.2, -23.36, 6.4], [-2.54, -16.61, 9.3]],
      [[4.2, -23.36, 6.4], [4.21, -15.95, 6.4], [-2.53, -9.19, 9.3], [-2.54, -16.61, 9.3]],
      [[4.21, -15.95, 6.4], [11.1, -15.97, 6.4], [2.6, -7.43, 10.06], [-0.77, -7.43, 10.06],
      [-2.53, -9.19, 9.3]],
      [[11.1, -15.97, 6.4], [11.11, -12.56, 6.4], [4.31, -5.73, 9.33], [2.6, -7.43, 10.06]],
      [[11.11, -12.56, 6.4], [15.49, -12.57, 6.4], [8.69, -5.74, 9.33], [4.31, -5.73, 9.33]],
      [[15.49, -12.57, 6.4], [15.5, 1.06, 6.4], [8.69, -5.74, 9.33]]
    ],
  }],
})
