/**
 * Hughes Hall — American University.
 * Hughes Hall is one of the long slab residence halls north of the main quad. Horizontal window bands run across its principal elevations.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/38094597
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-hughes-hall',
  name: "Hughes Hall",
  anchor: [-77.0885229, 38.9382992],
  bearing: 33.97,
  masonry: 0xbba78d, accent: 0xd1c0a8, roof: 0x8b8a80,
  sash: 'sliding',
  wings: [{
    outline: [
      [10.09, 11.34], [9.73, 27.41], [-2.65, 27.33], [-2.51, 7.49],
      [-4.02, 6.41], [-22.23, 6.53], [-22.18, -6.87], [-4.09, -6.56],
      [-2.81, -8.64], [-2.68, -26.94], [9.92, -26.94], [10.09, -12.06],
      [12.82, -10.74], [12.95, 9.13]
    ],
    eave: 23.8,
    rows: [[1.2, 3.05], [4.45, 6.3], [7.7, 9.55], [10.95, 12.8], [14.2, 16.05], [17.45, 19.3], [20.7, 22.55]],
    bayWidth: 3.15, pierWidth: 0.86,
    base: 0.55,
    blankEdges: [5],
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-15.51, 4.51], [-16.51, -6.51], [-4.09, -6.56], [-2.79, -11.51],
      [2.51, -11.51], [3.51, 9.51], [-2.53, 10.37], [-2.51, 7.49],
      [-4.02, 6.41], [-9.51, 6.44], [-9.51, 4.51]
    ],
    bottom: 23.8, eave: 28.7,
    rows: [],
    bayWidth: 3.15, pierWidth: 0.86,
  }],
})
