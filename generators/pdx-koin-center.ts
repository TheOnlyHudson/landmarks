/**
 * KOIN Tower (KOIN Center, 222 SW Columbia Street, 1984, Zimmer Gunsul
 * Frasca), Portland, Oregon. Original procedural geometry, CC0-1.0.
 * bun generators/pdx-koin-center.ts
 *
 * Built with the kit in pdx-us-bancorp-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground, turned to the street grid. Anchor = area centroid of the OSM
 * outline way/331780188, 45.5131123, -122.6776644; bearing 21 (the grid,
 * measured from the OSM edges). Every ring below is an OSM part in this
 * frame.
 *
 * Identity, in order: the red-brick tower stepping in through a wide lower
 * block, a two-storey serrated shoulder and a slimmer upper shaft, every
 * corner notched in small steps; the blue-grey metal hipped pyramid with
 * its lantern and spike; white trim lines at each setback; the stepped
 * glass entrance atrium on the south-west corner.
 *
 * Evidence:
 *  - plan and tiers: OSM parts, carefully mapped with levels and
 *    min_height: podium way/684340583 (0-15 m), way/684340580 (15-19),
 *    way/1361924287 (19-23), lower block way/684340579 (19-74), shoulder
 *    way/684340576 (74-78) and way/684340577 (78-82), upper shaft
 *    way/684340574 (82-113), top storey way/684340573 (113-121), atrium
 *    steps way/684684469-72 (8-20 m).
 *  - crown: OSM maps it as a cross of four skillions round a square,
 *    121-132 m. Height to the tip 155.15 m, 35 storeys (published,
 *    Wikipedia). Proportions above the top storey from Cacophony's
 *    telephoto, counted in storeys (about 29 px each): a blue mechanical
 *    band ~1 storey, the pyramid ~3.7, the lantern ~1.1 and the spike the
 *    rest, scaled to reach 155.15 m. The pyramid is drawn as an octagonal
 *    hip over the OSM cross's bounding square with its corners cut.
 *  - lidar (USGS 3DEP OR_OLCMetro_2019, flight 2019): the shoulder tiers
 *    read 77-85 m, agreeing with OSM; the upper shaft and crown are mostly
 *    missing (dark glass and metal return little), with a rim reading
 *    ~100 m and a maximum of 116 m. Not enough to overrule OSM's tiers and
 *    the storey count, so OSM is kept; see doubts.
 *  - colours: the brick reads orange-red in every daylight photo, pulled
 *    to the palette's lightness; the crown uses OSM's building:colour
 *    #8CA3B5, lightened slightly.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - KOINCenterPortland.jpg, Cacophony, CC BY 3.0
 *  - KOIN_Center_angle.jpg, Ulmanor at English Wikipedia, CC BY 3.0
 *  - KOIN_Center,_Portland,_OR_in_2012.JPG, Another Believer, CC BY-SA 3.0
 * No commercial imagery.
 *
 * Doubts: the upper shaft's top (OSM 113 m) is not confirmed by lidar,
 * which reads lower where it has returns; the crown's dormers and the
 * balconies in the notched corners are left out; window rhythm is one
 * panel per two storeys per bay, not the real punched pairs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bandRows, cap, ccw, save, walls, type XY } from './pdx-us-bancorp-tower'
import { bays, block, chamfer, inset, spire } from './chi-aon-center'

const R = (pts: number[][]) => ccw(pts as XY[])

const P15 = R([[-34.6, 28.9], [-34.5, 13.4], [-32.4, 13.4], [-28.2, 13.4], [-21.0, 13.5], [-21.0, 6.9], [-21.0, 0.4], [-28.5, 0.4], [-32.4, 0.3], [-34.5, 0.3], [-34.5, -13.9], [-31.8, -13.9], [-28.5, -13.9], [-25.5, -13.9], [-22.5, -13.8], [-19.3, -13.8], [-19.3, -16.8], [-19.3, -19.9], [-19.3, -23.0], [-19.3, -26.1], [-19.3, -29.9], [-14.5, -29.9], [17.7, -29.7], [23.5, -29.6], [23.5, -1.9], [23.4, 16.1], [23.4, 29.3], [10.5, 29.2], [1.5, 29.2], [-7.6, 29.1]])
const P19 = R([[-28.2, 27.4], [-28.2, 13.4], [-21.0, 13.5], [-21.0, 6.9], [-21.0, 0.4], [-28.5, 0.4], [-28.5, -13.9], [-25.5, -13.9], [-22.5, -13.8], [-19.3, -13.8], [-19.3, -16.8], [-19.3, -19.9], [-19.3, -23.0], [-14.5, -23.0], [-14.5, -29.9], [17.7, -29.7], [17.7, -22.6], [22.2, -22.6], [22.1, -9.0], [22.1, -7.2], [22.1, -1.9], [23.5, -1.9], [23.4, 16.1], [22.1, 16.1], [22.1, 21.9], [22.1, 23.3], [22.1, 27.9], [17.6, 27.8], [10.5, 27.8], [10.5, 29.2], [1.5, 29.2], [-7.6, 29.1], [-7.6, 27.5], [-14.6, 27.5]])
const P23 = R([[-14.5, -23.0], [17.7, -22.6], [17.7, -13.5], [10.6, -13.5], [10.6, -15.3], [-7.5, -15.4], [-7.5, -13.7], [-14.5, -13.7]])
const ATRIUM: [number, XY[]][] = [
  [20, R([[-19.3, -13.8], [-22.5, -13.8], [-22.5, -16.8], [-19.3, -16.8]])],
  [16, R([[-19.3, -16.8], [-19.3, -13.8], [-22.5, -13.8], [-25.5, -13.9], [-25.5, -16.9], [-22.5, -16.8], [-22.5, -19.9], [-19.3, -19.9]])],
  [12, R([[-28.5, -13.9], [-28.5, -16.9], [-25.5, -16.9], [-25.5, -19.9], [-22.5, -19.9], [-22.5, -23.0], [-19.3, -23.0], [-19.3, -19.9], [-19.3, -16.8], [-19.3, -13.8], [-22.5, -13.8], [-25.5, -13.9]])],
  [8, R([[-31.8, -13.9], [-31.8, -16.9], [-28.5, -16.9], [-28.5, -19.9], [-25.5, -19.9], [-25.5, -23.0], [-22.5, -23.0], [-22.5, -26.1], [-19.3, -26.1], [-19.3, -23.0], [-19.3, -19.9], [-19.3, -16.8], [-19.3, -13.8], [-22.5, -13.8], [-25.5, -13.9], [-28.5, -13.9]])],
]
const T74 = R([[-21.0, -2.2], [-19.2, -2.1], [-19.2, -7.5], [-19.2, -9.3], [-17.5, -9.3], [-17.5, -10.7], [-16.1, -10.7], [-16.1, -12.2], [-14.5, -12.2], [-14.5, -13.7], [-7.5, -13.7], [-7.5, -15.4], [10.6, -15.3], [10.6, -13.5], [17.7, -13.5], [17.7, -12.0], [19.2, -11.9], [19.2, -10.4], [20.8, -10.4], [20.8, -9.0], [22.1, -9.0], [22.1, -7.2], [22.1, -1.9], [23.5, -1.9], [23.4, 16.1], [22.1, 16.1], [22.1, 21.9], [22.1, 23.3], [20.7, 23.3], [20.7, 24.9], [19.1, 24.9], [19.1, 26.4], [17.6, 26.4], [17.6, 27.8], [10.5, 27.8], [10.5, 29.2], [1.5, 29.2], [-7.6, 29.1], [-7.6, 27.5], [-14.6, 27.5], [-14.6, 26.2], [-16.2, 26.1], [-16.2, 24.6], [-17.6, 24.6], [-17.6, 23.1], [-19.3, 23.1], [-19.3, 21.6], [-19.2, 16.2], [-21.0, 16.2], [-21.0, 13.5], [-21.0, 6.9], [-21.0, 0.4]])
const T78 = R([[-17.5, -7.5], [-16.1, -7.5], [-16.1, -9.2], [-14.5, -9.2], [-14.5, -10.6], [-13.0, -10.6], [-13.0, -12.2], [16.1, -12.0], [16.1, -10.4], [17.7, -10.4], [17.7, -9.0], [19.2, -9.0], [19.2, -7.2], [20.7, -7.2], [20.7, 21.9], [19.1, 21.9], [19.1, 23.3], [17.6, 23.3], [17.6, 24.9], [16.0, 24.8], [16.0, 26.4], [-13.1, 26.2], [-13.1, 24.6], [-14.6, 24.6], [-14.6, 23.1], [-16.2, 23.1], [-16.2, 21.6], [-17.6, 21.6]])
const T82 = R([[-13.0, -7.5], [-13.0, -9.2], [-6.7, -9.2], [9.5, -9.1], [16.1, -9.0], [16.1, -7.2], [17.7, -7.2], [17.7, -0.9], [17.7, 14.9], [17.6, 21.9], [16.0, 21.8], [16.0, 23.3], [9.4, 23.3], [-6.8, 23.1], [-13.1, 23.1], [-13.1, 21.6], [-14.6, 21.6], [-14.6, 15.0], [-14.5, -0.9], [-14.5, -7.5]])
const T113 = R([[-14.6, 15.0], [-14.5, -0.9], [-13.0, -0.9], [-13.0, -4.7], [-11.9, -4.7], [-11.9, -5.7], [-10.9, -5.7], [-10.9, -6.6], [-9.8, -6.6], [-9.8, -7.4], [-6.7, -7.4], [-6.7, -9.2], [9.5, -9.1], [9.5, -7.3], [12.8, -7.3], [12.8, -6.4], [13.8, -6.4], [13.8, -5.5], [14.9, -5.5], [14.9, -4.5], [16.1, -4.5], [16.1, -0.9], [17.7, -0.9], [17.7, 14.9], [16.0, 14.9], [16.0, 18.6], [14.9, 18.6], [14.9, 19.6], [13.7, 19.6], [13.7, 20.8], [12.7, 20.8], [12.7, 21.8], [9.4, 21.8], [9.4, 23.3], [-6.8, 23.1], [-6.8, 21.7], [-9.9, 21.7], [-9.9, 20.6], [-10.9, 20.6], [-10.9, 19.5], [-11.9, 19.5], [-11.9, 18.4], [-13.1, 18.4], [-13.1, 15.0]])
const T121 = R([[-9.9, 19.5], [-9.9, 18.4], [-10.9, 18.4], [-10.9, 11.4], [-11.9, 11.3], [-11.9, 2.5], [-10.9, 2.5], [-10.9, -4.7], [-9.8, -4.7], [-9.8, -5.7], [-2.9, -5.6], [-2.9, -6.5], [6.1, -6.5], [6.1, -5.5], [12.8, -5.5], [12.8, -4.5], [13.8, -4.5], [13.8, 2.6], [14.9, 2.6], [14.9, 11.5], [13.8, 11.5], [13.7, 18.6], [12.8, 18.5], [12.8, 19.6], [6.1, 19.6], [6.1, 20.7], [-3.0, 20.6], [-3.0, 19.5]])

const TIP = 155.15

export function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), crown = new Part(), atrium = new Part()

  // A brick tier with a white trim line round its top edge.
  const tier = (r: XY[], z0: number, z1: number, band = 0.9) => {
    block(brick, roof, r, z0, z1, 0.35)
    walls(trim, inset(r, -0.08), z1 - 0.35 - band, z1 - 0.35)
  }
  tier(P15, 0, 15)
  tier(P19, 15, 19)
  tier(P23, 19, 23)
  tier(T74, 19, 74)
  tier(T78, 74, 78, 0.7)
  tier(T82, 78, 82, 0.7)
  tier(T113, 82, 113)
  block(brick, null, T121, 113, 119, 0)
  block(crown, roof, T121, 119, 121, 0.3)
  for (const [h, r] of ATRIUM) block(atrium, atrium, r, 0, h, 0.2)

  // Windows: one panel per bay per two storeys; the notch steps are too
  // short to carry any.
  const o = { bay: 2.6, gap: 1.5, end: 0.9, minLen: 4.5, out: 0.1 }
  bays(win, P15, [[1.0, 5.6], [8.0, 13.0]], o)
  bays(win, T74, bandRows(23, 73, 7.6, 5.0, 1.0), o)
  bays(win, T113, bandRows(82, 112, 7.6, 5.0, 1.4), o)
  bays(win, T121, [[114, 117.6]], { ...o, minLen: 6 })

  // Crown: blue mechanical band, octagonal hipped pyramid, lantern, spike.
  const cx = 1.45, cy = 7.0, hw = 11.0
  const base = chamfer(ccw([[cx - hw, cy - hw], [cx + hw, cy - hw], [cx + hw, cy + hw], [cx - hw, cy + hw]]), 4.5)
  block(crown, null, base, 121, 125, 0)
  const pyr = inset(base, 0.6)
  cap(roof, base, 125) // the ledge round the pyramid's foot
  const ZP = 140, ZL = 144.5
  const lanternR = 1.9
  const lant = chamfer(ccw([[cx - lanternR, cy - lanternR], [cx + lanternR, cy - lanternR], [cx + lanternR, cy + lanternR], [cx - lanternR, cy + lanternR]]), 0.8)
  // Pyramid faces from the foot ring up to the lantern ring (a frustum).
  const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z] as V3)
  crown.loft([at(pyr, 125.05), at(lant, ZP)])
  block(crown, crown, lant, ZP - 0.3, ZL, 0.2)
  const spikeR = chamfer(ccw([[cx - 0.35, cy - 0.35], [cx + 0.35, cy - 0.35], [cx + 0.35, cy + 0.35], [cx - 0.35, cy + 0.35]]), 0.1)
  spire(crown, spikeR, ZL, [cx, cy, TIP])

  return [
    { part: brick, material: finish('koin-brick', 0xcd8c70) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: finish('koin-crown', 0x9aaebd) },
    { part: atrium, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('pdx-koin-center', 'KOIN Tower', [45.5131123, -122.6776644], 21, build())
