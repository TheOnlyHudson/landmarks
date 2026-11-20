/**
 * East Quad Building — American University.
 * A low hipped roof covers the teaching building beside the School of International Service.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90189728
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:AUaerial.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-east-quad-building',
  name: "East Quad Building",
  anchor: [-77.0879989, 38.93633],
  bearing: 33.55,
  masonry: 0xcfbea5, accent: 0xdfcdb2, roof: 0x888377,
  sash: 'spandrel',
  wings: [{
    outline: [
      [9.82, 9.91], [8.14, 9.91], [8.13, 18.06], [-9.07, 18.09],
      [-9.06, -18.13], [7.92, -18.16], [7.92, -10.18], [9.81, -10.18]
    ],
    eave: 9.0,
    rows: [[1.75, 3.89], [5.5, 7.64]],
    bayWidth: 2.9, pierWidth: 1.1,
    base: 1.0,
    roofFaces: [
      [[9.82, 9.91, 9.0], [8.14, 9.91, 9.0], [-0.46, 1.34, 12.79], [0.38, 0.51, 13.15]],
      [[8.14, 9.91, 9.0], [8.13, 18.06, 9.0], [-0.46, 9.48, 12.78], [-0.46, 1.34, 12.79]],
      [[8.13, 18.06, 9.0], [-9.07, 18.09, 9.0], [-0.46, 9.48, 12.78]],
      [[-9.07, 18.09, 9.0], [-9.06, -18.13, 9.0], [-0.57, -9.66, 12.74], [-0.57, -1.69, 12.74],
      [0.38, -0.74, 13.15], [0.38, 0.51, 13.15], [-0.46, 1.34, 12.79], [-0.46, 9.48, 12.78]],
      [[-9.06, -18.13, 9.0], [7.92, -18.16, 9.0], [-0.57, -9.66, 12.74]],
      [[7.92, -18.16, 9.0], [7.92, -10.18, 9.0], [-0.57, -1.69, 12.74], [-0.57, -9.66, 12.74]],
      [[7.92, -10.18, 9.0], [9.81, -10.18, 9.0], [0.38, -0.74, 13.15], [-0.57, -1.69, 12.74]],
      [[9.81, -10.18, 9.0], [9.82, 9.91, 9.0], [0.38, 0.51, 13.15], [0.38, -0.74, 13.15]]
    ],
  }],
})
