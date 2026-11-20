/**
 * Centennial Hall — American University.
 * The northwestern residence hall in the connected Anderson, Centennial and Letts complex on South Campus.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38076901
 * https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-centennial-hall',
  name: "Centennial Hall",
  anchor: [-77.0912145, 38.9361067],
  bearing: 33.7,
  masonry: 0x9e6a5b, accent: 0xc6b19c, roof: 0x787a77,
  wings: [{
    outline: [
      [-22.92, -36.91], [-17.61, -36.91], [-17.61, -35.47], [-16.27, -35.45],
      [-16.21, -36.91], [-14.08, -36.91], [12.95, -9.91], [13.69, -9.96],
      [13.65, -10.98], [23.94, -11.0], [23.93, -10.06], [26.2, -10.08],
      [25.46, 10.45], [13.62, 10.94], [13.66, 9.92], [12.88, 9.98],
      [-14.1, 36.95], [-16.19, 36.95], [-16.22, 35.56], [-17.55, 35.57],
      [-17.54, 36.96], [-22.9, 36.98], [-22.92, 28.07], [3.82, 1.16],
      [2.55, -0.08], [3.85, -1.32], [-22.92, -28.03]
    ],
    eave: 26.4,
    rows: [[1.18, 3.25], [4.81, 6.89], [8.45, 10.52], [12.08, 14.16], [15.72, 17.79], [19.36, 21.43], [22.99, 25.06]],
    bayWidth: 1.72, pierWidth: 1.44,
    base: 0.45,
    blankEdges: [11, 23, 24],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [5.49, 4.51], [2.49, 3.51], [3.85, -1.32], [2.49, -4.51],
      [10.49, -7.51], [10.49, -10.51], [23.94, -11.0], [26.18, -9.51],
      [25.46, 10.45], [13.62, 10.94], [12.49, 8.51], [7.49, 8.51]
    ],
    bottom: 26.4, eave: 31.3,
    rows: [],
    bayWidth: 1.72, pierWidth: 1.44,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [18.49, 6.51], [19.49, -7.51], [26.13, -8.34], [25.57, 7.39]
    ],
    bottom: 31.3, eave: 37.4,
    rows: [],
    bayWidth: 1.72, pierWidth: 1.44,
  }],
})
