/**
 * Roper Hall — American University.
 * One of the four low, two-story brick halls grouped south of the library along Nebraska Avenue.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190604
 * https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-roper-hall',
  name: "Roper Hall",
  anchor: [-77.0889639, 38.9352317],
  bearing: 123.46,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-3.82, -20.52], [9.77, -20.51], [9.77, 15.06], [-9.07, 15.03],
      [-9.07, 15.54], [-15.36, 15.52], [-15.36, 3.1], [-10.39, 3.12],
      [-10.39, 1.3], [-3.82, 1.31]
    ],
    eave: 5.5,
    rows: [[0.64, 2.02], [3.06, 4.44]],
    bayWidth: 1.38, pierWidth: 1.68,
    roofFaces: [
      [[-3.82, -20.52, 5.5], [9.77, -20.51, 5.5], [2.98, -13.72, 8.56]],
      [[9.77, -20.51, 5.5], [9.77, 15.06, 5.5], [2.9, 8.18, 8.59], [2.98, 8.11, 8.56],
      [2.98, -13.72, 8.56]],
      [[9.77, 15.06, 5.5], [-9.07, 15.03, 5.5], [-12.19, 11.85, 6.93], [-9.41, 9.07, 8.18],
      [-4.45, 9.08, 8.18], [-3.53, 8.17, 8.59], [2.9, 8.18, 8.59]],
      [[-9.07, 15.03, 5.5], [-9.07, 15.54, 5.5], [-12.19, 12.37, 6.92], [-12.19, 11.85, 6.93]],
      [[-9.07, 15.54, 5.5], [-15.36, 15.52, 5.5], [-12.19, 12.37, 6.92]],
      [[-15.36, 15.52, 5.5], [-15.36, 3.1, 5.5], [-9.41, 9.07, 8.18], [-12.19, 11.85, 6.93],
      [-12.19, 12.37, 6.92]],
      [[-15.36, 3.1, 5.5], [-10.39, 3.12, 5.5], [-4.45, 9.08, 8.18], [-9.41, 9.07, 8.18]],
      [[-10.39, 3.12, 5.5], [-10.39, 1.3, 5.5], [-3.53, 8.17, 8.59], [-4.45, 9.08, 8.18]],
      [[-10.39, 1.3, 5.5], [-3.82, 1.31, 5.5], [2.98, 8.11, 8.56], [2.9, 8.18, 8.59],
      [-3.53, 8.17, 8.59]],
      [[-3.82, 1.31, 5.5], [-3.82, -20.52, 5.5], [2.98, -13.72, 8.56], [2.98, 8.11, 8.56]]
    ],
  }],
})
