/**
 * Raleigh Convention Center (2008; Clearscapes, TVS Design, O'Brien/Atkins;
 * OSM names it "Atlantic Union Bank Convention Center"), with the Shimmer
 * Wall (Ned Kahn): procedural, CC0-1.0.
 * bun generators/ral-convention-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.3 (the OSM
 * walls run at 2.3°/92.3°). Origin: the area centroid of OSM way/135692673
 * (-78.641356, 35.773640). y = 0 is the lowest ground under the footprint,
 * on McDowell Street (west); Mapterhorn (z13) rises about 6 m to Salisbury
 * Street (east). Elevation 0.
 *
 * OSM: way/135692673 (building=public, Q7286901) is the only building under
 * the model: a 96 × 123 m block (x -52.8..42.9, y -60.6..62.9) with three
 * bumps on the Salisbury Street side, drawn as the glazed lobbies. The Red
 * Hat Amphitheater (way/135692670) across McDowell Street is not covered.
 * USGS NAIP (public domain, 0.55 m/px; ≈8 m south of OSM here): a flat
 * white roof with solar arrays, three skylights on the east lobby, the
 * roof's overhang all round.
 *
 * The Shimmer Wall is on the west face, toward McDowell Street and the
 * amphitheater: p5 is taken from the west with the Marriott (east of the
 * centre) behind it, and p8 shows the amphitheater's audience in front of
 * it.
 *
 * No lidar covers Wake County. Heights are estimated from p5 (the whole
 * west face, scaled to OSM's 123 m length: ≈8 px/m): the tan base 10 m
 * with a window strip at its top, the Shimmer Wall's silver frame 11.5 to
 * 31 m, its image 13 to 30.5 m and 72 m long, the roof plane 31.2 to 32.2 m (about 1 m at the edge, white, p5);
 * the tan end blocks to 25 m; the east lobbies about 18 m over Salisbury
 * Street (p2, p3).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-convention-center/p2 and photos/):
 *  p1 "Raleigh-Convention-Center-Shimmer-Wall-200807-17.jpeg", Jelmore,
 *     public domain, https://commons.wikimedia.org/wiki/File:Raleigh-Convention-Center-Shimmer-Wall-200807-17.jpeg
 *  p2 "Raleigh-Convention-Center-20080321.jpeg", Jmturner, public domain,
 *     https://commons.wikimedia.org/wiki/File:Raleigh-Convention-Center-20080321.jpeg
 *  p3 "Raleigh Convention Center - Raleigh, NC - DSC06102.JPG", Daderot,
 *     public domain, https://commons.wikimedia.org/wiki/File:Raleigh_Convention_Center_-_Raleigh,_NC_-_DSC06102.JPG
 *  p4 "Raleigh Convention Center", Suzie T, CC BY 2.0,
 *     https://www.flickr.com/photos/23727257@N00/2814752892: a glass lobby
 *     under its own thin roof.
 *  p5 "Raleigh Convention Center", twbuckner, CC BY 2.0,
 *     https://www.flickr.com/photos/43554380@N00/3171899731: the west face.
 *  p6 "Raleigh Convention Center", twbuckner, CC BY 2.0,
 *     https://www.flickr.com/photos/43554380@N00/3171899167: the west face
 *     from further off.
 *  p7 "Raleigh Convention Center", Alexanderpf, CC BY 2.0,
 *     https://www.flickr.com/photos/21185523@N03/3029426062: an end block,
 *     its glass corner and the lobby beyond.
 *  p8 the Shimmer Wall at dusk with an amphitheater crowd (local photos/
 *     c09.jpg, from the previous builder; source not re-found, used only to
 *     confirm which face).
 *  p9 "Raleigh Convention Center", Skakerman, CC BY 2.0,
 *     https://www.flickr.com/photos/27482959@N08/23663793309: from inside
 *     the Salisbury Street lobby, the Marriott across the street.
 * Aerial: USGS NAIP (public domain).
 *
 * The tree: Ned Kahn's oak image is drawn as flat dark shapes traced from
 * p5 on the silver field: a broad centred trunk forking half way up, five
 * main limbs out to both edges, and one lobed crown across the top of the
 * whole panel with light gaps between the limbs; the thousands of shingles
 * are left out.
 * Colours: tan precast (p5), silver aluminium frame and roof edge, a dark
 * grey for the image.
 * Estimated: every height, the end blocks' widths, the lobbies' roofs.
 * Doubts: the Salisbury Street front is read from oblique photos only; the
 * north and south faces' window pattern is invented from p2 and p7; the
 * terrain drop across the site is from z13 terrain.
 * Night: the Shimmer Wall is floodlit; the lobbies' glass glows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, capRing, ccw, flatShape, finishGlb, writeModel, rect } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const X0 = -52.8, X1 = 42.9, Y0 = -60.6, Y1 = 62.9
const BASE = 25, ROOF = 31, SLAB0 = 31.2, SLAB1 = 32.2
const EAST_G = 6 // Salisbury Street above y = 0
// the Shimmer Wall on the west face
const FY0 = -42, FY1 = 42, FZ0 = 11.5, FZ1 = 31.2
const AY0 = -37.5, AY1 = 35, AZ0 = 13.2, AZ1 = 30.4

function build() {
  const tan = new Part(), silver = new Part(), oak = new Part(), win = new Part(), roof = new Part(), ent = new Part()

  // ------------------------------------------------------------ the main block
  prism(tan, roof, rect(X0, Y0, X1, Y1), 0, BASE)
  capRing(tan, rect(X0, Y0, X1, Y1), 0, false)
  // the upper hall behind the Shimmer Wall, under the long roof
  const UP = rect(X0, -44, X1 - 3, 46)
  prism(tan, null, UP, BASE - 0.01, ROOF)
  // the long roof: a thin white plane overhanging all round, furthest to the west (p1, p2, p4, p5)
  box(silver, X0 - 4, -47, X1 - 0.4, 49, SLAB0, SLAB1, silver, 0.2)

  // ------------------------------------------------------------ the west face
  const W: Face = { o: [X0, Y1, 0], n: [-1, 0] } // s runs south from the north-west corner
  const sOf = (y: number) => Y1 - y
  // the window strip on top of the tan base, and the low windows at the street (p5)
  panel(win, W, sOf((FY0 + FY1) / 2), FY1 - FY0 - 4, 9.0, 10.8, 0.06)
  for (let k = 0; k < 9; k++) panel(win, W, sOf(FY1 - 6 - k * 9.2), 5, 0.6, 2.6, 0.06)
  // the silver frame, standing 1.5 m proud
  box(silver, X0 - 1.5, FY0, X0, FY1, FZ0, FZ1, silver, 0.25)
  // the image field: pale aluminium, then the tree on it
  const AF: Face = { o: [X0 - 1.5, Y1, 0], n: [-1, 0] }
  panel(silver, AF, sOf((AY0 + AY1) / 2), AY1 - AY0, AZ0, AZ1, 0.04)
  const L = AY1 - AY0, H = AZ1 - AZ0
  // traced in pixels off p5's panel, enlarged to 1470 × 330 (x left → right = north → south, y down)
  const px = (pts: number[][], d: number, part = oak) =>
    flatShape(part, AF, pts.map(([x, y]) => [sOf(AY1 - (x / 1470) * L), AZ0 + ((330 - y) / 330) * H] as XY), d)
  // the crown: one mass across the top of the whole panel, down to the ground left of the trunk and
  // over the south third, with a ragged lobed edge
  px([[440, 330], [470, 292], [452, 262], [404, 246], [380, 214], [352, 196], [338, 160], [300, 172], [262, 150],
    [214, 138], [190, 108], [140, 104], [100, 84], [52, 92], [0, 70], [0, 0], [1470, 0],
    [1470, 96], [1446, 128], [1470, 170], [1458, 214], [1470, 246], [1426, 262], [1404, 232], [1372, 270],
    [1336, 250], [1312, 300], [1272, 276], [1238, 312], [1204, 286], [1176, 322], [1144, 300], [1124, 256],
    [1098, 238], [1070, 212], [1032, 222], [996, 208], [958, 230], [924, 250], [898, 292], [884, 330]], 0.09)
  // light gaps inside the crown: between the limbs, and the lacy far north and south ends
  const gap = (pts: number[][]) => px(pts, 0.12, silver)
  gap([[662, 18], [730, 6], [800, 14], [842, 30], [838, 150], [818, 172], [770, 128], [712, 78], [664, 50]])
  gap([[874, 12], [930, 6], [1000, 20], [1046, 42], [1064, 90], [1030, 124], [968, 150], [906, 172], [878, 120]])
  gap([[40, 0], [130, 0], [176, 30], [150, 62], [96, 56], [60, 34]])
  gap([[1260, 30], [1310, 20], [1344, 60], [1320, 110], [1276, 100], [1250, 66]])
  gap([[1384, 150], [1420, 140], [1440, 190], [1410, 214], [1378, 196]])
  gap([[668, 330], [684, 286], [722, 252], [770, 262], [776, 330]])
  gap([[1120, 120], [1170, 100], [1210, 130], [1196, 170], [1150, 168]])
  // the trunk, broad and centred, forking about half way up
  px([[770, 330], [896, 330], [880, 262], [872, 196], [848, 176], [812, 178], [796, 210], [784, 280]], 0.15)
  // the main limbs, out to both edges
  const limb = (pts: number[][]) => px(pts, 0.15)
  limb([[800, 196], [820, 178], [742, 70], [650, 34], [520, 22], [520, 44], [640, 58], [724, 100]]) // up north
  limb([[810, 186], [840, 180], [856, 0], [890, 0], [870, 190]]) // straight up
  limb([[862, 186], [880, 170], [968, 96], [1050, 40], [1120, 0], [1148, 0], [1070, 64], [992, 120], [892, 196]]) // up south
  limb([[872, 206], [890, 182], [1000, 178], [1110, 182], [1240, 172], [1300, 182], [1240, 196], [1110, 202], [1000, 200]]) // out south
  limb([[796, 210], [808, 186], [700, 124], [560, 108], [440, 120], [340, 144], [220, 172], [120, 192], [20, 228],
    [10, 206], [112, 172], [210, 150], [326, 120], [432, 98], [560, 86], [708, 104]]) // the long low limb north
  limb([[330, 140], [342, 128], [250, 100], [170, 70], [100, 66], [96, 78], [168, 84], [246, 112]]) // its upper twig
  // the tan end blocks' tall window slots (p5)
  panel(win, W, sOf(55), 2.2, 11, 22, 0.06)
  panel(win, W, sOf(-52), 2.2, 11, 22, 0.06)

  // ------------------------------------------------------------ the north and south faces: tall slots in groups (p2, p7)
  for (const [y, n] of [[Y1, [0, 1]], [Y0, [0, -1]]] as [number, XY][]) {
    const f: Face = { o: [n[1] > 0 ? X1 : X0, y, 0], n }
    for (let k = 0; k < 7; k++) panel(win, f, 10 + k * 12, 3.2, EAST_G * 0.5 + 3, BASE - 3, 0.06)
  }
  // clerestory under the long roof, all round the upper hall
  for (let i = 0; i < 4; i++) {
    const a = UP[i], b = UP[(i + 1) % 4], Lb = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / Lb, -(b[0] - a[0]) / Lb]
    if (n[0] < -0.5) continue // the west side is the Shimmer Wall
    panel(win, { o: [a[0], a[1], 0], n }, Lb / 2, Lb - 4, ROOF - 3.6, ROOF - 0.6, 0.06)
  }

  // ------------------------------------------------------------ the Salisbury Street lobbies: glass under thin roofs (p3, p4, p9)
  const lobby = (ring: XY[], top: number) => {
    const r = ccw(ring)
    prism(win, null, r, 0, top)
    capRing(win, r, 0, false)
    capRing(roof, r, top, true)
    // a thin overhanging roof
    const xs = r.map((p) => p[0]), ys = r.map((p) => p[1])
    box(silver, Math.min(...xs) - 0.5, Math.min(...ys) - 2, Math.max(...xs) + 2.5, Math.max(...ys) + 2, top, top + 1.0, roof, 0.2)
    // mullions every ~6 m on the street face, a floor line
    const xm = Math.max(...xs)
    const f: Face = { o: [xm, Math.min(...ys), 0], n: [1, 0] }
    const span = Math.max(...ys) - Math.min(...ys)
    for (let k = 1; k < Math.round(span / 6); k++) panel(silver, f, (span * k) / Math.round(span / 6), 0.4, EAST_G, top, 0.08)
    panel(silver, f, span / 2, span, EAST_G + 6, EAST_G + 6.5, 0.08)
    panel(ent, f, span / 2, Math.min(10, span - 4), EAST_G, EAST_G + 3, 0.1)
  }
  lobby([[X1 - 0.1, 19.3], [58.5, 19.3], [58.5, 46.1], [X1 - 0.1, 46.1]], EAST_G + 18)
  lobby([[X1 - 0.1, -24.5], [50.9, -24.5], [50.9, 7.1], [X1 - 0.1, 7.1]], EAST_G + 14)
  lobby([[X1 - 0.1, -60.6], [60.7, -60.6], [63.2, -50.6], [57.1, -32.0], [X1 - 0.1, -32.0]], EAST_G + 18)
  // the east face of the main block: a tall glass slot and a window ribbon (p3)
  {
    const f: Face = { o: [X1, Y0, 0], n: [1, 0] }
    panel(win, f, 70.5, 6, EAST_G, BASE - 2, 0.06) // between the lobbies
    panel(win, f, 120, 4, EAST_G + 2, BASE - 2, 0.06)
  }

  // the Shimmer Wall is floodlit at night
  const lit = (p: V3, n: V3) => (p[0] < X0 + 0.1 && n[0] < -0.5 ? 0.85 : 0)

  return finishGlb('Raleigh Convention Center', [
    { part: tan, material: finish('rcc-tan', 0xdccaa9) },
    { part: silver, material: <Swatch>{ ...finish('rcc-aluminium', 0xd6d9db), floodlight: lit } },
    { part: oak, material: <Swatch>{ ...finish('rcc-oak-image', 0x555b62), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: ent, material: PALETTE.entrance },
  ], { bearing: 2.3, height: SLAB1, replaces: ['way/135692673'] })
}

if (import.meta.main) await writeModel('ral-convention-center', build())
