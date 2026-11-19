/**
 * LaGuardia Airport Terminal C (Delta; opened in stages 2019–2022), Queens:
 * the headhouse, its four gate concourses, the connectors between them, the
 * pedestrian bridge to the Terminal C garage and the 37 jet bridges —
 * everything passengers walk through to the planes. Procedural, CC0-1.0, no
 * textures.
 *   bun generators/nyc-lga-terminal-c.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: area
 * centroid of the OSM outline relation/20056349, -73.8631743, 40.7695866.
 *
 * One model, not a headhouse model plus a concourse model: OSM maps the whole
 * terminal as one multipolygon (relation/20056349, outer way/650687659,
 * inner way/1465119016) and the whole thing fits the 6,500-triangle budget,
 * so a split would only make two placements hide the same outline.
 *
 * The plan, split along the outline's own vertices (frame below is the
 * scratch frame about -73.8620, 40.7705; the code shifts it to the anchor):
 * - the headhouse hall: the block between the curb and the east pier, about
 *   180 × 120 m. Its glass front faces south-west over the roadways, along
 *   the line from node 30 to node 24, which the outline's inner ring (the gap
 *   where Inner Arrivals runs open to the sky) lies on;
 * - the curbside block south-west of that line, between the inner and outer
 *   roadways: 14 m, glazed, three levels (OSM maps indoor footways and
 *   stairs on levels 0–2 in it), with a level-2 footbridge (OSM
 *   way/1133148452) across the open gap to the hall. Inner Arrivals runs
 *   under its ends (tunnel=building_passage) and Inner Departures (bridge,
 *   layer 1) along the gap;
 * - the bridge to the garage: the 18 m wide arm (nodes 32–41) reaching the
 *   Daily Parking – Terminal C garage over the ramps (OSM motorway_link
 *   bridges, layer 1, run under it), so it is drawn raised on two piers;
 * - the west connector (about 270 m, from the hall's north corner to the
 *   gates 60s pier), the 70s pier off its root, the 80s pier off the hall's
 *   east side, and the narrow south-east connector along the shore to the
 *   90s pier;
 * - jet bridges: the 37 OSM aeroway=jet_bridge ways (level 2) at gates
 *   61–98, each a tube from the concourse wall along its OSM line.
 *
 * Measured (OSM): every wall and gate position. Lengths: west connector
 * ~270 m × 25 m; 60s pier ~150 m × 30 m; 70s pier ~210 m × 30 m; 80s pier
 * ~260 m × 40 m; 90s pier ~260 m × 25 m; south-east connector ~160 m ×
 * 10–17 m; garage bridge ~100 m × 18 m; jet bridges 18–35 m.
 * Published (OSM height tag, from NYC building data): 13.2 m, used for the
 * piers and connectors.
 * Estimated: headhouse roof 25 m, rising to 29 m over its south-east third
 * (t038, roof edge scaled against the two-level roadway viaduct in front,
 * taken as ~8 m; the right part of the roof stands higher), its glass wall
 * from 8.5 m (the departures roadway) to 23 m, a 6 m roof cantilever over
 * the front; the curbside block 14 m and its footbridge 9.5–13.5 m; the
 * garage bridge 13–19.5 m; the
 * south-east connector 10 m; the piers' gate-level glazing 5.4–11.3 m (a321,
 * fleet); jet bridge tubes 4–7 m, 3 m wide, a rotunda at the root and a
 * wheel leg near the cab. The garage bridge's pier positions are invented
 * (placed clear of the ramps).
 * Piers: a continuous band of tall glass along every outline wall of the
 * piers and connectors at gate level (4.6–12.4 m) over a pale base, and a
 * white stair tower (3.2 × 4 × 8.5 m, estimated) beside each jet bridge's
 * root (a321, fleet). The headhouse's roof edge is dark grey and 2.2 m
 * thick (t038); its landside lower level, behind the roadway viaducts the
 * map draws as flat roads, is a shadowed dark band to 8.3 m.
 * Lidar: USGS NY_NewYorkCity (2017) was flown while the old Terminals C and
 * D still stood and the new terminal was being built; not used for heights.
 * NAIP (USGS NAIP Plus) also shows construction, so it was used only to
 * confirm the piers' plan and pale roofs.
 *
 * Photos (Wikimedia Commons, evidence):
 *  t038 https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_038_-_LaGuardia_Airport_Terminal_D.jpg
 *       Tdorante10, CC BY-SA 4.0: the headhouse from Grand Central Parkway
 *       (south-west), finishing construction: long glass wall under a thin
 *       flat roof edge, the roof higher toward the south-east, the
 *       two-level roadway in front.
 *  t037 https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_037_-_LaGuardia_Airport_Terminal_D.jpg
 *       Tdorante10, CC BY-SA 4.0: the same front from further west.
 *  a321 https://commons.wikimedia.org/wiki/File:Delta_Airbus_A321_LaGuardia_Airport_May_2026.jpg
 *       Nielsoncaetanosalmeron, CC BY 4.0: the 80s pier at gates 81–83, grey
 *       metal panels, a tall glazed gate level, jet bridges.
 *  fleet https://commons.wikimedia.org/wiki/File:Delta_Connection_fleet_at_LaGuardia_Airport_Terminal_C.jpg
 *       Zheng Zhou, CC BY-SA 4.0: the 90s pier at night, ~13 m high with
 *       slot windows, floodlights on the roof, jet bridges.
 *  v3, v5 https://commons.wikimedia.org/wiki/File:View_of_LaGuardia_Airport_(October_2023)_03.jpg
 *       https://commons.wikimedia.org/wiki/File:View_of_LaGuardia_Airport_(October_2023)_05.jpg
 *       DiscoA340, CC BY-SA 4.0: the 80s pier from the airfield at night,
 *       glazing lit, apron floodlit.
 *  cd1 https://commons.wikimedia.org/wiki/File:New_Concourse_D,_under_construction,_at_LaGuardia_Airport_in_Queens,_New_York_(cropped).jpg
 *       Mnw2000, CC BY-SA 4.0: a new pier under construction, glazed end.
 *  Interiors (Myotus CC0; DiscoA340 CC BY-SA 4.0; Delta News Hub CC BY 2.0,
 *  "New Delta terminal at LGA", 2019, gate 93) confirm tall gate-level
 *  glazing but say nothing about the massing.
 * Look-only: Port Authority "A Whole New LGA: Terminal C" (Flickr, CC BY-NC-
 * ND 2.0), interiors only; not relied on.
 *
 * Doubts: no open photo shows the headhouse roof from above, its back
 * (north-east) side, or the piers' roofs, so the roof is flat but for the
 * south-east rise, and the piers are plain boxes with a glazed gate level.
 * The brief's "elevated bridges over taxiways" are Terminal B's; Terminal C's
 * only raised crossings are the garage bridge over the ramps and the short
 * footbridge over the curb roads. The curbside block's height and glazing
 * are guessed from OSM's indoor levels; no open photo shows it clearly. The
 * hall's real roof is said to curve; t038 only shows a flat edge stepping up
 * toward the south-east, which is what is drawn.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type XY, ccw, clip, zones, slopedZone, pwl, segDist, type Facade } from './nyc-jfk-terminal-5'
import { finishModel, inside, quadN, unit, capPoly, prism } from './nyc-570-lexington'

// ---------------------------------------------------------------- the plan
// Scratch frame (about -73.8620, 40.7705); shifted to the anchor below.
const O: XY = [-99, -101]
const sh = (r: XY[]): XY[] => r.map(([x, y]) => [x - O[0], y - O[1]] as XY)
// relation/20056349 outer way/650687659, in ring order (node index = position).
const RAW: XY[] = [[351.8, -142.8], [354.2, -144.9], [350.5, -149.0], [354.7, -153.1], [352.0, -156.1], [353.0, -156.8], [292.1, -228.3], [232.0, -299.0], [193.8, -341.7], [184.3, -343.6], [160.4, -336.6], [137.9, -330.3], [85.5, -315.3], [17.3, -295.2], [5.0, -284.6], [-43.3, -294.5], [-50.5, -296.2], [-59.3, -298.3], [-60.1, -294.3], [-70.0, -295.7], [-75.5, -290.1], [-80.1, -295.2], [-89.2, -287.0], [-91.6, -284.8], [-95.8, -281.1], [-128.1, -294.2], [-169.5, -257.2], [-159.1, -222.6], [-166.8, -215.7], [-168.6, -214.0], [-174.6, -208.6], [-170.4, -203.9], [-179.7, -194.8], [-260.3, -122.1], [-254.8, -116.1], [-246.7, -107.4], [-232.5, -120.1], [-231.3, -121.5], [-229.4, -124.5], [-227.6, -127.4], [-223.3, -131.6], [-192.3, -159.3], [-190.0, -160.4], [-187.6, -161.0], [-183.7, -161.5], [-181.1, -161.4], [-178.5, -160.6], [-176.3, -159.4], [-174.5, -158.1], [-172.7, -156.4], [-171.5, -154.5], [-170.7, -152.0], [-170.5, -148.9], [-170.3, -146.5], [-172.9, -141.1], [-164.4, -67.1], [-267.5, 27.2], [-269.4, 25.1], [-318.5, 69.9], [-378.4, 124.7], [-366.4, 137.9], [-368.9, 141.1], [-368.9, 142.3], [-362.8, 149.2], [-361.8, 149.1], [-360.3, 147.8], [-355.9, 152.5], [-345.3, 164.1], [-343.3, 164.2], [-339.5, 167.9], [-341.7, 169.7], [-341.8, 171.1], [-336.9, 176.5], [-336.1, 177.3], [-334.6, 177.4], [-332.3, 175.5], [-331.1, 176.8], [-319.4, 189.6], [-297.3, 213.6], [-299.4, 215.4], [-299.4, 216.8], [-298.7, 217.6], [-293.6, 223.3], [-292.2, 223.2], [-290.2, 221.4], [-263.7, 250.6], [-265.6, 252.4], [-265.8, 253.8], [-261.3, 258.7], [-259.9, 260.2], [-258.6, 260.2], [-256.4, 258.4], [-251.9, 263.4], [-249.4, 266.0], [-248.3, 266.0], [-246.7, 264.5], [-233.9, 252.9], [-228.1, 247.6], [-226.6, 246.2], [-226.5, 245.3], [-235.3, 235.4], [-239.1, 231.7], [-236.7, 229.4], [-236.7, 228.2], [-240.7, 223.7], [-241.9, 223.4], [-243.5, 221.5], [-245.0, 221.4], [-247.0, 223.3], [-254.3, 216.8], [-280.0, 187.2], [-277.9, 185.5], [-278.1, 183.7], [-278.7, 182.9], [-283.0, 177.8], [-284.9, 177.7], [-287.0, 179.5], [-294.2, 171.8], [-292.7, 170.3], [-298.2, 164.3], [-297.9, 158.4], [-297.9, 156.8], [-291.6, 151.4], [-289.8, 112.0], [-310.9, 89.0], [-253.4, 37.1], [-258.7, 30.6], [-246.6, 19.5], [-245.2, 20.7], [-235.8, 12.2], [-233.2, 15.0], [-228.1, 10.5], [-221.9, 4.6], [-224.4, 1.6], [-212.5, -9.5], [-207.8, -7.6], [-179.0, 5.1], [-157.9, 27.5], [-125.4, 63.5], [-111.4, 78.9], [-93.3, 98.5], [-77.4, 115.5], [-70.1, 124.1], [-67.8, 122.0], [-61.8, 116.8], [-49.5, 105.9], [-47.6, 104.1], [-71.6, 77.5], [-106.3, 39.1], [-135.1, 8.1], [-156.4, -16.0], [-163.3, -36.3], [-167.8, -49.9], [-147.7, -68.0], [-154.2, -125.9], [-134.2, -144.0], [-132.9, -140.3], [-115.8, -155.8], [-82.1, -186.5], [-47.3, -218.4], [-17.8, -205.6], [-1.1, -186.9], [12.0, -172.2], [35.3, -147.1], [73.0, -105.3], [103.3, -72.2], [119.2, -54.9], [128.1, -62.2], [137.7, -70.4], [142.1, -75.2], [131.9, -86.9], [121.0, -98.9], [107.5, -113.7], [79.2, -144.0], [53.7, -171.7], [19.3, -209.0], [4.2, -225.4], [-3.9, -250.0], [-7.2, -260.0], [22.7, -286.6], [82.2, -304.0], [141.5, -321.3], [165.6, -328.1], [184.0, -324.9], [196.6, -311.5], [194.2, -309.2], [198.9, -304.4], [201.3, -306.8], [210.9, -296.3], [235.2, -269.9], [240.4, -264.2], [237.6, -261.7], [242.5, -256.1], [245.3, -258.8], [267.1, -235.0], [288.2, -212.0], [285.2, -209.3], [290.1, -203.7], [293.1, -206.3], [295.4, -203.8], [292.1, -200.9], [298.1, -194.1], [298.9, -193.3], [302.1, -196.3], [313.9, -184.0], [310.9, -181.2], [316.1, -175.4], [315.7, -175.0], [318.7, -171.7], [322.4, -174.9], [324.9, -172.0], [325.8, -171.1], [338.2, -157.2], [335.3, -154.7], [340.1, -149.3], [343.1, -152.1]]
const OUTER = ccw(sh(RAW))
const N = (i: number): XY => sh([RAW[i]])[0]
// inner way/1465119016: the open gap over Inner Arrivals.
const HOLE = sh([[-103.5, -273.3], [-114.9, -263.0], [-117.0, -261.1], [-127.2, -251.8], [-137.0, -243.0], [-139.1, -241.0], [-150.7, -230.5], [-154.9, -245.2], [-117.4, -279.4]])
// Cut polygons, drawn through outline nodes (comments give the node numbers).
const HEAD_CUT = sh([[-194.8, -152.2], [-178.5, -145.7], [-148.6, -121.3], [-140, -125], [-45, -195], [-47.3, -218.4] /* 159 */, [-7.2, -260.0] /* 178 */, [8.7, -292], [8.7, -345], [-200, -345], [-200, -210], [-177.2, -201.9]])
const STRIP_CUT = sh([[-185, -199.4], [-95.8, -281.1] /* 24 */, [-95.8, -340], [-200, -340], [-200, -199.4]]) // SW of the hall's glass front (node 30 → 24)
const BRIDGE_CUT = sh([[-177.2, -201.9], [-194.8, -152.2], [-280, -60], [-280, -210]])
const SE_CUT = sh([[0, -270], [170, -315], [175, -350], [0, -350]])
const FRONT: XY[] = [N(30), N(24)] // the hall's glass front along the inner ring's line
const LANDSIDE: XY[] = [30, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14].map(N) // the whole landside front

// OSM aeroway=jet_bridge ways (level 2), from the concourse wall outward.
const JET: Record<string, XY[]> = {
  1133148410: [[137.7, -70.4], [140.2, -67.9], [150.0, -65.1], [156.2, -41.9], [156.0, -39.5]],
  1133148411: [[131.9, -86.9], [135.2, -89.2], [160.4, -81.5], [161.1, -79.1]],
  1133148412: [[107.5, -113.7], [111.1, -116.6], [137.9, -112.9], [138.7, -111.1]],
  1133148413: [[79.2, -144.0], [81.4, -146.1], [105.0, -147.3], [107.3, -145.1]],
  1133148427: [[-163.3, -36.3], [-153.4, -45.4], [-135.5, -35.2], [-133.9, -32.9]],
  1133148429: [[-135.1, 8.1], [-125.8, -0.4], [-101.1, 9.4], [-98.8, 11.2]],
  1133148430: [[-71.6, 77.5], [-62.3, 69.2], [-35.3, 79.2], [-33.3, 81.5]],
  1133148431: [[-49.5, 105.9], [-48.3, 107.2], [-30.2, 104.8], [-9.7, 120.6], [-8.5, 122.8]],
  1133148432: [[-61.8, 116.8], [-53.4, 126.4], [-72.2, 152.2], [-74.8, 152.2]],
  1133148433: [[-67.8, 122.0], [-65.7, 124.3], [-75.1, 135.4], [-98.7, 130.8], [-100.7, 128.9]],
  1133148434: [[-93.3, 98.5], [-101.4, 108.1], [-132.8, 99.6], [-135.3, 97.5]],
  1133148435: [[-125.4, 63.5], [-133.4, 70.7], [-159.4, 67.5], [-161.1, 66.2]],
  1133148437: [[-106.3, 39.1], [-97.3, 31.1], [-64.2, 40.2], [-62.1, 42.7]], // OSM draws this one cab-first
  1337008349: [[-235.3, 235.4], [-233.7, 234.0], [-224.3, 244.7], [-226.3, 247.8], [-228.6, 260.3], [-229.1, 263.9]],
  1341606365: [[-278.7, 182.9], [-277.2, 181.3], [-283.4, 174.5], [-279.4, 173.5], [-257.7, 173.0], [-256.2, 175.1]],
  1341606366: [[-297.9, 158.4], [-295.3, 157.5], [-287.8, 150.4], [-276.5, 137.8], [-274.3, 139.5]],
  1341606367: [[-157.9, 27.5], [-168.1, 36.8], [-170.8, 34.3], [-192.4, 32.7]],
  1347421476: [[128.1, -62.2], [131.1, -58.7], [131.1, -45.4], [101.8, -34.2], [100.3, -36.4]],
  1464980012: [[-254.3, 216.8], [-251.6, 213.6], [-259.3, 205.7], [-256.8, 204.4], [-238.7, 204.4], [-237.8, 206.4]],
  1474230738: [[-3.9, -250.0], [-1.2, -251.0], [4.3, -255.8], [17.0, -242.4]],
  1474230739: [[19.3, -209.0], [22.6, -212.2], [46.5, -201.3], [47.5, -200.3]],
  1474230740: [[53.7, -171.7], [60.5, -177.7], [82.9, -166.3]],
  1474230741: [[-1.1, -186.9], [-5.2, -183.3], [-40.4, -188.3], [-44.0, -190.1]],
  1474230742: [[35.3, -147.1], [28.8, -141.1], [10.1, -148.4]],
  1474230743: [[73.0, -105.3], [70.6, -102.8], [43.4, -113.5]],
  1474230744: [[103.3, -72.2], [101.9, -71.0], [77.7, -78.4]],
  651198394: [[-355.9, 152.5], [-367.4, 163.1], [-364.8, 170.6], [-369.5, 172.2], [-374.6, 166.2], [-375.3, 164.6]],
  651198395: [[-319.4, 189.6], [-320.7, 191.0], [-320.0, 199.2], [-340.3, 203.9], [-341.0, 203.2]],
  651198396: [[-298.7, 217.6], [-299.4, 218.2], [-293.2, 224.9], [-316.1, 235.1], [-318.0, 233.7]],
  651198397: [[-261.3, 258.7], [-266.4, 269.0], [-286.1, 265.4], [-287.5, 264.4]],
  651198398: [[-251.9, 263.4], [-252.6, 264.2], [-245.0, 272.5], [-256.8, 289.3], [-259.3, 288.6]],
  699686107: [[350.1, -144.3], [327.7, -139.8], [325.9, -141.5]],
  699686108: [[324.9, -172.0], [324.0, -171.1], [329.3, -165.2], [327.8, -163.7], [308.6, -167.4], [307.4, -169.0]],
  699686109: [[298.1, -194.1], [297.4, -193.5], [279.5, -195.1], [278.2, -196.9]],
  699686110: [[285.1, -215.4], [284.1, -214.6], [272.3, -227.3], [254.9, -221.9], [253.0, -223.8]],
  699686111: [[267.1, -235.0], [266.1, -234.2], [261.0, -239.8], [235.4, -248.3], [233.3, -251.0]],
  699686112: [[235.2, -269.9], [231.8, -266.7], [210.1, -273.7], [208.1, -275.3]],
}
export const JET_BRIDGE_WAYS = Object.keys(JET).map((id) => `way/${id}`)

// ---------------------------------------------------------------- heights
const PIER = 13.2, SE_LINK = 10
const ROOF_LO = 25, ROOF_HI = 29
const CURB = 14, FB0 = 9.5, FB1 = 13.5
const BR0 = 13, BR1 = 19.5
const JB0 = 4, JB1 = 7, JBW = 3

function build() {
  const panel = new Part(), win = new Part(), dark = new Part(), roof = new Part(), white = new Part(), jet = new Part()
  const glass = win // the hall's curtain wall reads as dark as the gate glazing in t038 and a321

  // ---- pieces
  const head = clip('intersection', [OUTER], [HEAD_CUT])
  const hall = clip('difference', head, [STRIP_CUT])
  const strip = clip('difference', clip('intersection', head, [STRIP_CUT]), [HOLE])
  const bridge = clip('intersection', [OUTER], [BRIDGE_CUT])
  const rest = clip('difference', [OUTER], [HEAD_CUT], [BRIDGE_CUT])
  const seLink = clip('intersection', rest, [SE_CUT])
  const piers = clip('difference', rest, [SE_CUT])

  // ---- the headhouse hall: roof rising toward the south-east (t038)
  const hallLo = Math.min(...hall.flat().map((p) => p[0]))
  const STEP = 12
  const kx = (n: number) => hallLo + STEP * n // band lines, so the slope is exact
  const roofZ = (q: XY) => pwl([[kx(8), ROOF_LO], [kx(10), ROOF_HI]])(q[0])
  const pierAt = (q: XY) => (piers.some((r) => inside(q, r)) ? PIER : seLink.some((r) => inside(q, r)) ? SE_LINK : strip.some((r) => inside(q, r)) ? CURB : 0)
  const glassWall: Facade = { bay: 6, ratio: 0.94, floor: 7.2, group: 1, spandrel: 0.45, sill: 0.4, head: 1.6, ground: 8.5, minLength: 4 }
  const exterior = [OUTER, FRONT]
  for (const r of hall) {
    slopedZone({ roof, wall: panel, win: glass, fascia: white, ring: r, z: roofZ, axis: 0, step: STEP, heightAt: pierAt, exterior, facade: () => glassWall })
  }
  // A low band of doors and windows at the arrivals level on the hall's outer walls.
  const doors: Facade = { bay: 8, ratio: 0.8, floor: 3.6, group: 1, spandrel: 0, sill: 0, head: 0, ground: 1.2, minLength: 8 }
  for (const r of hall) for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 8) continue
    const m: XY = [(a[0] + b[0]) / 2 + (b[1] - a[1]) / L * 0.3, (a[1] + b[1]) / 2 - (b[0] - a[0]) / L * 0.3]
    if (pierAt(m) > 0) continue
    if (LANDSIDE.some((q, k) => k < LANDSIDE.length - 1 && segDist(m, q, LANDSIDE[k + 1]) < 1)) {
      // the landside front's lower level sits behind and under the roadway viaducts: drawn as a shadowed band
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = 0.07
      dark.quad([a[0] + u[1] * o, a[1] - u[0] * o, 0], [b[0] + u[1] * o, b[1] - u[0] * o, 0], [b[0] + u[1] * o, b[1] - u[0] * o, 8.3], [a[0] + u[1] * o, a[1] - u[0] * o, 8.3])
      continue
    }
    facadeOnly(win, a, b, 0, 4.8, doors)
  }

  // The roof's cantilever over the glass front and the south face (nodes 30 → 24 → 14), 6 m deep.
  {
    eave(dark, LANDSIDE, 6, roofZ)
  }

  // ---- the curbside block: indoor stairs and walkways on levels 0–2 (OSM indoor footways) between the
  // arrivals and departures roads; a level-2 footbridge (OSM way/1133148452) crosses the open gap to the hall.
  {
    const a = sh([[-140, -265]])[0], b = sh([[-127, -252]])[0]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const A: XY = [a[0] - u[0] * 3, a[1] - u[1] * 3], B: XY = [b[0] + u[0] * 6, b[1] + u[1] * 6], w = 2.5
    const ring: XY[] = [[A[0] + u[1] * w, A[1] - u[0] * w], [B[0] + u[1] * w, B[1] - u[0] * w], [B[0] - u[1] * w, B[1] + u[0] * w], [A[0] - u[1] * w, A[1] + u[0] * w]]
    prism({ wall: panel, win: glass, roof, coping: white, ring, z0: FB0, z1: FB1, facade: { bay: 5, ratio: 0.9, floor: 3, group: 1, spandrel: 0, sill: 0.6, head: 0.6, ground: 0.6, minLength: 4 }, bevel: 0.25 })
    capPoly(panel, ring, FB0, false)
  }

  // ---- the garage bridge, raised over the ramps on two pairs of piers
  const bridgeFacade: Facade = { bay: 6, ratio: 0.9, floor: 4.2, group: 1, spandrel: 0, sill: 1.1, head: 1.2, ground: 1.1, minLength: 5 }
  for (const r of bridge) {
    prism({ wall: panel, win: glass, roof, coping: white, ring: r, z0: BR0, z1: BR1, facade: bridgeFacade, bevel: 0.35 })
    capPoly(panel, r, BR0, false)
  }
  for (const c of [[-221.8, -137.3], [-212.6, -127.1], [-247.4, -114.3], [-240.1, -106.3]] as XY[]) column(white, sh([c])[0], 0.9, 0, BR0, 8)

  // ---- the concourses: piers and connectors at 13.2 m, the south-east connector at 10 m
  const gate: Facade = { bay: 12, ratio: 0.985, floor: 5.5, group: 1, spandrel: 0, sill: 0, head: 0.5, ground: 4.6, minLength: 4 }
  const link: Facade = { bay: 12, ratio: 0.985, floor: 3.5, group: 1, spandrel: 0, sill: 0, head: 0.8, ground: 4.2, minLength: 4 }
  zones({
    wall: panel, win, roof, coping: white, exterior: [OUTER, HOLE],
    list: [{ rings: piers, z: PIER, facade: gate }, { rings: seLink, z: SE_LINK, facade: link }, { rings: strip, z: CURB, facade: link }],
    heightAt: (q) => (hall.some((r) => inside(q, r)) ? roofZ(q) : 0),
  })

  // ---- jet bridges
  for (const raw of Object.values(JET)) jetBridge(jet, white, sh(raw))

  const lit = (k: number) => (p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0 : Math.max(0, k * (1 - p[2] / 16)))
  finishModel('LaGuardia Airport Terminal C', 'nyc-lga-terminal-c', [
    { part: panel, material: { ...finish('lgac-panel', 0xd3d7d9), floodlight: lit(0.7) } },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('lgac-dark', 0x62686d) },
    { part: roof, material: PALETTE.roof },
    { part: white, material: finish('lgac-fascia', 0xeceeee) },
    { part: jet, material: { ...finish('lgac-jet-bridge', 0xe2e4e3), floodlight: lit(0.9) } },
  ], { bearing: 0, osm: 'relation/20056349', height: ROOF_HI }, 6500)
}

// ---------------------------------------------------------------- helpers
/** Window panels only (the wall itself is drawn elsewhere). */
function facadeOnly(win: Part, a: XY, b: XY, z0: number, z1: number, f: Facade) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: XY = [uy, -ux]
  const count = Math.max(1, Math.round(L / f.bay)), pitch = L / count, w = pitch * f.ratio
  const lo = z0 + (f.ground ?? 0), hi = z1 - f.head
  for (let k = 0; k < count; k++) {
    const c = pitch * (k + 0.5)
    const v = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.06, a[1] + uy * s + n[1] * 0.06, z]
    win.quad(v(c - w / 2, lo), v(c + w / 2, lo), v(c + w / 2, hi), v(c - w / 2, hi))
  }
}

/** A thin roof edge cantilevered `d` metres out from a polyline (outside on its left in ccw terms: right of travel for this west→east list), top at z(q). */
function eave(p: Part, line: XY[], d: number, z: (q: XY) => number) {
  const out = line.map((q, k) => {
    const a = line[Math.max(0, k - 1)], b = line[Math.min(line.length - 1, k + 1)]
    const t = unit([b[0] - a[0], b[1] - a[1], 0])
    return [q[0] + t[1] * d, q[1] - t[0] * d] as XY // right of travel
  })
  const th = 2.2
  for (let k = 0; k < line.length - 1; k++) {
    const a = line[k], b = line[k + 1], A = out[k], B = out[k + 1]
    const za = z(a) + 0.12, zb = z(b) + 0.12
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.5) continue
    const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    quadN(p, [a[0], a[1], za], [b[0], b[1], zb], [B[0], B[1], zb], [A[0], A[1], za], [up, up, up, up])
    const n = unit([A[0] - a[0], A[1] - a[1], 0])
    quadN(p, [B[0], B[1], zb - th], [A[0], A[1], za - th], [A[0], A[1], za], [B[0], B[1], zb], [n, n, n, n])
    quadN(p, [a[0], a[1], za - th - 0.8], [A[0], A[1], za - th], [B[0], B[1], zb - th], [b[0], b[1], zb - th - 0.8], [dn, dn, dn, dn])
  }
  for (const k of [0, line.length - 1]) {
    const a = line[k], A = out[k], za = z(a) + 0.12
    const P: V3[] = [[a[0], a[1], za - th - 0.8], [A[0], A[1], za - th], [A[0], A[1], za], [a[0], a[1], za]]
    p.quad(P[0], P[1], P[2], P[3]); p.quad(P[3], P[2], P[1], P[0])
  }
}

/** A plain box from the ground, walls and a flat top. */
function stairTower(p: Part, ring0: XY[], h: number) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h], [a[0], a[1], h])
  }
  capPoly(p, ring, h)
}

/** A round column, smooth-shaded, no caps. */
function column(p: Part, c: XY, r: number, z0: number, z1: number, n: number) {
  for (let k = 0; k < n; k++) {
    const t0 = (2 * Math.PI * k) / n, t1 = (2 * Math.PI * (k + 1)) / n
    const n0: V3 = [Math.cos(t0), Math.sin(t0), 0], n1: V3 = [Math.cos(t1), Math.sin(t1), 0]
    quadN(p, [c[0] + r * n0[0], c[1] + r * n0[1], z0], [c[0] + r * n1[0], c[1] + r * n1[1], z0], [c[0] + r * n1[0], c[1] + r * n1[1], z1], [c[0] + r * n0[0], c[1] + r * n0[1], z1], [n0, n1, n1, n0])
  }
}

/** A passenger boarding bridge along an OSM line: a 3 m tube per segment, a rotunda column at the first joint, a wheel leg under the cab end. */
function jetBridge(p: Part, legs: Part, line: XY[]) {
  const h = JBW / 2
  // drop the first stub (inside the concourse wall) when it is shorter than a metre and a half
  const pts = Math.hypot(line[1][0] - line[0][0], line[1][1] - line[0][1]) < 1.5 ? [line[0], ...line.slice(2)] : line
  let longest = 0, li = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.8) continue
    if (L > longest) { longest = L; li = i }
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const e = i === 0 ? 0 : h // overlap the previous segment at a bend
    const A: XY = [a[0] - u[0] * e, a[1] - u[1] * e], B: XY = [b[0] + u[0] * (i === pts.length - 2 ? 0 : h), b[1] + u[1] * (i === pts.length - 2 ? 0 : h)]
    const c = (q: XY, s: number, z: number): V3 => [q[0] + n[0] * s, q[1] + n[1] * s, z]
    p.quad(c(A, h, JB0), c(B, h, JB0), c(B, h, JB1), c(A, h, JB1)) // right side
    p.quad(c(B, -h, JB0), c(A, -h, JB0), c(A, -h, JB1), c(B, -h, JB1)) // left side
    p.quad(c(A, -h, JB1), c(A, h, JB1), c(B, h, JB1), c(B, -h, JB1)) // top
    p.quad(c(A, h, JB0), c(A, -h, JB0), c(B, -h, JB0), c(B, h, JB0)) // underside
    if (i === pts.length - 2) p.quad(c(B, h, JB0), c(B, -h, JB0), c(B, -h, JB1), c(B, h, JB1)) // cab face
  }
  if (pts.length > 2) column(legs, pts[1], 0.7, 0, JB0, 8) // the rotunda's column
  // the white service stair tower against the concourse beside each bridge's root (a321, fleet)
  {
    const a = pts[0], b = pts[1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const c: XY = [a[0] + n[0] * 4.5 + u[0] * 1.6, a[1] + n[1] * 4.5 + u[1] * 1.6]
    const ring: XY[] = [[-1.6, -2], [1.6, -2], [1.6, 2], [-1.6, 2]].map(([s, t]) => [c[0] + u[0] * s + n[0] * t, c[1] + u[1] * s + n[1] * t] as XY)
    stairTower(legs, ring, 8.5)
  }
  const a = pts[li], b = pts[li + 1], t = 0.8
  column(legs, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], 0.45, 0, JB0, 6)
}

if (import.meta.main) build()
