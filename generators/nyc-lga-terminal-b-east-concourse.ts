/**
 * LaGuardia Airport Terminal B, Eastern Concourse (gates 40–59), with its
 * jet bridges — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lga-terminal-b-east-concourse.ts
 *
 * Built with the kit in nyc-lga-terminal-b-west-concourse.ts (`concourse`),
 * whose header holds the shared evidence, heights and doubts.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0, as the headhouse
 * model (nyc-lga-terminal-b). Anchor: area centroid of the OSM outline
 * way/633420347, -73.8689867, 40.7737467, OSM put in this frame at the map's
 * own scale (111,195 m per degree of latitude).
 *
 * Identifying features:
 *  1. A Y-shaped pier: a 110 m arm running south-east from the East
 *     Pedestrian Bridge's landing and a shorter, squarer arm turning north,
 *     both flat-roofed, the roof cut into sections by raised joints (NAIP
 *     2024).
 *  2. The glazed gate hall over a pale apron storey (night photo 01, gates
 *     40–47 interior photo).
 *  3. The East Pedestrian Bridge landing in the crook between the arms (the
 *     bridge itself is nyc-lga-terminal-b's).
 *  4. Its jet bridges, eighteen in OSM, round both arms' ends and sides.
 *
 * Evidence (beyond the kit's)
 * - OSM way/633420347 (Eastern Concourse, aeroway=terminal, no height) as
 *   mapped, matching NAIP 2024; its three nodes on the bridge end moved
 *   onto the headhouse model's bridge end (0.5 m off OSM here).
 * - OSM jet bridges way/651198383–651198393, 652505734, 652505736,
 *   652505738, 655208225, 655208226, 655217084, 835827483.
 * - Lidar: the 2017 USGS flight shows the old Central Terminal Building's
 *   wing here, a 59 m wide block on a different line (checked against OSM),
 *   not this concourse (opened 2018). Not used.
 * - Photos: "View of LaGuardia Airport (October 2023) 01" (DiscoA340,
 *   CC BY-SA 4.0), the concourse's end at night behind American 737s:
 *   glazed hall, pale roof edge and rail, jet bridges at the sill;
 *   "08-JUL-2022 - UA5546 LGA-ORD (E175 - N89349) (01)" (Simply Aviation,
 *   CC BY 4.0), gate 46's jet bridge; "Terminal B at LaGuardia Airport (1)"
 *   (Simply Aviation, CC BY 4.0), the gate hall at gates 40–47 inside.
 *
 * Estimated: as the Western Concourse (roof 22.5 m from shadows on NAIP
 * 2024, glazing 7.8–20.8 m, jet bridge heights). Invented: the bridge
 * landing, 6 m deep, up to the bridge's roof (see the kit's header). The
 * roof joints are read off NAIP to a metre or two.
 */
import { unit } from './nyc-570-lexington'
import { concourse } from './nyc-lga-terminal-b-west-concourse'
import { type XY } from './nyc-570-lexington'

// OSM way/633420347 in this frame.
const RING: XY[] = [[-68.0, 24.1], [-66.2, 26.5], [-61.5, 32.9], [-39.1, 67.8], [-34.7, 75.3], [-17.8, 101.8], [-12.7, 110.5], [-5.8, 106.8], [11.6, 95.8], [14.0, 94.3], [18.5, 91.4], [-4.3, 55.0], [-8.4, 48.3], [-8.8, 47.5], [-9.1, 46.4], [-9.3, 45.0], [-9.2, 43.6], [-9.0, 42.4], [1.4, 3.5], [1.9, 1.9], [2.4, 0.8], [3.0, -0.3], [4.2, -1.6], [25.1, -20.8], [25.4, -21.0], [34.4, -29.3], [61.5, -54.1], [72.0, -63.7], [75.0, -66.7], [83.3, -74.2], [79.3, -80.8], [71.8, -92.5], [69.8, -95.6], [62.7, -106.8], [38.2, -84.1], [18.6, -66.1], [8.9, -57.2], [-31.3, -20.6], [-49.9, -3.2], [-55.1, 1.5], [-48.8, 6.8]]
// The end of the East Pedestrian Bridge as nyc-lga-terminal-b draws it, in this frame.
const BRIDGE_END: [XY, XY, XY] = [[-67.7, 23.5], [-48.6, 6.3], [-54.9, 1.0]]
// OSM jet bridges, wall first.
const JET: [string, XY[]][] = [
  ['651198383', [[14.0, 94.3], [19.5, 102.8], [37.6, 126.8], [39.5, 128.4]]],
  ['651198384', [[-4.3, 55.0], [11.9, 44.5], [30.9, 61.0], [36.1, 65.5], [35.8, 68.4]]],
  ['651198385', [[25.4, -21.0], [37.3, -8.1], [62.2, 2.1], [62.2, 4.7]]],
  ['651198386', [[75.0, -66.7], [85.0, -56.1], [89.1, -60.1], [111.0, -59.5], [143.8, -61.7], [144.3, -59.7]]],
  ['651198387', [[79.3, -80.8], [83.6, -84.5], [85.8, -82.5], [114.3, -78.4], [116.2, -76.0]]],
  ['651198388', [[71.8, -92.5], [76.8, -96.9], [78.6, -94.7], [94.5, -99.0], [96.9, -97.6]]],
  ['651198389', [[69.8, -95.6], [74.1, -99.7], [72.4, -101.9], [66.5, -135.7], [68.7, -136.5]]],
  ['651198390', [[38.2, -84.1], [34.2, -89.1], [44.9, -116.5], [47.0, -119.4]]],
  ['651198391', [[18.6, -66.1], [16.8, -68.1], [12.8, -64.3], [10.2, -67.5], [12.5, -83.0], [14.3, -85.5]]],
  ['651198392', [[-31.3, -20.6], [-32.1, -21.4], [-24.9, -28.0], [-28.3, -32.1], [-22.4, -58.6], [-20.1, -60.7]]],
  ['651198393', [[-49.9, -3.2], [-54.5, -8.2], [-43.4, -32.6]]],
  ['652505734', [[72.0, -63.7], [82.5, -52.4], [118.6, -36.3], [118.3, -33.9]]],
  ['652505736', [[11.6, 95.8], [17.4, 104.9], [10.0, 135.2], [7.6, 134.8]]],
  ['652505738', [[-5.8, 106.8], [-1.6, 114.1], [-4.1, 115.4], [-31.3, 129.3], [-34.3, 127.3]]],
  ['655208225', [[-17.8, 101.8], [-23.1, 105.0], [-45.2, 97.9], [-47.1, 95.8]]],
  ['655208226', [[-34.7, 75.3], [-35.7, 76.0], [-41.5, 66.8], [-48.4, 71.3], [-73.9, 56.2], [-76.8, 53.9]]],
  ['655217084', [[-66.2, 26.5], [-69.9, 28.8], [-71.6, 26.1], [-85.4, 2.3], [-85.1, -0.5]]],
  ['835827483', [[-61.5, 32.9], [-66.1, 35.9], [-93.7, 28.6], [-94.6, 27.0]]],
]

if (import.meta.main) concourse({
  id: 'nyc-lga-terminal-b-east-concourse', name: 'LaGuardia Airport Terminal B Eastern Concourse', osm: 'way/633420347',
  ring: RING, bridgeEnd: BRIDGE_END, bridgeAxis: unit([0.71, 0.70, 0]).slice(0, 2) as XY,
  // Roof joints read off NAIP 2024: across the north arm, the hub's diagonal, across the south-east arm.
  joints: [[[-34.3, 70.1], [-8.9, 54.4]], [[-44.5, 11.3], [-11.5, 41.3]], [[-13.7, -36.2], [9.3, -6.3]]],
  jetBridges: JET,
})
