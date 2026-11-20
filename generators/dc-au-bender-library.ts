/**
 * Bender Library — American University.
 * AU’s main library has angled corners and deep recesses along its concrete façades.
 * Plan projected in metres about the OSM area centroid. The catalog bearing restores map north.
 * Close-range LOD adds recessed glazing, masonry reveals and restrained sash profiles.
 * Reveal depth (0.14 m; 0.28 m for spandrel glazing), frame widths and sash spacing are estimates.
 * Exterior study. Roof heights use 2022 DC LiDAR building returns above the footprint’s lower ground (10th percentile).
 * Roof edges and slopes are simplified. Sill heights, bay spacing and colors are estimates.
 * https://www.openstreetmap.org/way/90190152
 * https://planning.dc.gov/publication/26-07-american-university-historic-district
 * https://commons.wikimedia.org/wiki/File:LibraryRevamp.jpg
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 */
import { buildCampusBuilding } from './au-campus-building'

await buildCampusBuilding({
  id: 'dc-au-bender-library',
  name: "Bender Library",
  anchor: [-77.0889399, 38.9359694],
  bearing: 33.43,
  masonry: 0xb9ac97, accent: 0xc9bba6, roof: 0x8a8981,
  sash: 'spandrel',
  wings: [{
    outline: [
      [-12.58, 33.33], [-12.58, 31.15], [-18.49, 25.34], [-20.86, 25.35],
      [-20.85, 16.3], [-19.05, 16.3], [-19.04, 8.92], [-21.01, 8.93],
      [-20.98, -8.42], [-19.21, -8.43], [-19.2, -15.84], [-21.21, -15.85],
      [-21.2, -24.79], [-18.68, -24.78], [-12.64, -30.94], [-12.64, -33.41],
      [12.56, -33.41], [12.55, -30.96], [18.72, -24.9], [21.0, -24.91],
      [20.99, -16.0], [19.14, -16.0], [19.14, -8.56], [21.03, -8.56],
      [21.01, 8.65], [19.24, 8.64], [19.23, 16.41], [21.02, 16.41],
      [21.01, 24.9], [18.9, 24.9], [12.85, 31.07], [12.84, 33.34]
    ],
    eave: 12.1,
    rows: [[1.27, 4.47], [6.89, 10.09]],
    bayWidth: 3.1, pierWidth: 1.65,
    band: 10.25,
  }, {
    // Upper roof tier fitted to the 2022 building returns.
    outline: [
      [-17.51, -0.49], [-16.51, -18.51], [-6.51, -18.51], [-5.51, -28.51],
      [1.51, -28.51], [1.51, -19.51], [14.51, -18.51], [15.51, 17.51],
      [10.51, 21.51], [10.51, 29.51], [2.49, 29.51], [0.49, 19.51],
      [-14.51, 19.51], [-14.51, -0.49]
    ],
    bottom: 12.1, eave: 17.5,
    rows: [[12.51, 15.71]],
    bayWidth: 3.1, pierWidth: 1.65,
  }],
})
