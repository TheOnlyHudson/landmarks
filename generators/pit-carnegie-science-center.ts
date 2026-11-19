/**
 * Carnegie Science Center (1991, Tasso Katselas; renamed Kamin Science
 * Center in 2024), 1 Allegheny Avenue on the North Shore, Pittsburgh —
 * original procedural geometry, CC0-1.0.
 * bun generators/pit-carnegie-science-center.ts
 *
 * Frame: x, y, z up, metres; origin at the anchor on the lowest ground
 * under the footprint (the riverside walk on the south edge, ~4.5 m above
 * lidar ground_min 216.7 m NAVD88, the Ohio's surface). Anchor = area
 * centroid of the OSM outline way/222624191, -80.0177901 40.4455365.
 * Bearing 20: +x runs ESE along the building and the river, +y NNE to
 * Allegheny Avenue and Acrisure Stadium; -y faces the Ohio.
 *
 * Identity, in order: the white fabric funnel held high on a mast over the
 * east end, on a tripod of struts and cables, above the round Omnimax drum
 * and its low ribbed cone roof; the curved, metal-clad riverfront pavilion
 * with its glass band; the stepped grey metal-panel blocks to the west, the
 * tallest in the middle; the banded round stair tower on the river side
 * with the small silver observatory dome on top.
 *
 * Evidence:
 *  - plan: OSM outline way/222624191 turned into this frame.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, in this frame: west wing 24.0, north-west wing 14.6, the
 *    tall block 28.4, middle 25.8 and 23.7, east block 21.5, the north
 *    bay 9.3, north-east terrace 5.5; drum rim 19.5, its cone roof to
 *    22.5; funnel rim 49.5 (radius ~10.5, centred on the drum), mast top
 *    58.1; stair tower 23, observatory dome ~26.
 *  - USGS NAIP orthophoto (public domain): the plan, the drum and its
 *    ribbed cone roof centred at (14, 19.5), the flat roofs' white membrane.
 *  - published: opened 1991, Tasso Katselas; Buhl Planetarium and
 *    observatory, Rangos Omnimax theater; renamed 2024 (Wikipedia,
 *    "Carnegie Science Center").
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    s4 "Carnegie Science Center from the Point, 2024-09-11b.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center_from_the_Point,_2024-09-11b.jpg
 *      Cbaile19, CC0 — from across the river (south-east): funnel, mast,
 *      tripod, cone roof, the curved pavilion, the blocks.
 *    s3 "Carnegie Science Center, 2020-12-04, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center,_2020-12-04,_01.jpg
 *      Cbaile19, CC0 — from Mount Washington (south): the whole river
 *      front, the round stair tower and observatory dome, roofs.
 *    s1 "Carnegie Science Center, 2023-01-14, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center,_2023-01-14,_02.jpg
 *      Cbaile19, CC0 — the north side from the stadium garage.
 *    s2 "Carnegie Science Center, 2023-01-14, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center,_2023-01-14,_01.jpg
 *      Cbaile19, CC0 — the north side, wider.
 *    s5 "Carnegie Science Center.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center.jpg
 *      Allie_Caulfield, CC BY 2.0 — the drum and funnel from the river.
 *    s6 "Carnegie Science Center river view.JPG"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Science_Center_river_view.JPG
 *      Photojunkie, public domain — the west end close up.
 *  - colour: pale grey metal panels, the drum and cone roof darker grey, glass bands, white
 *    fabric funnel, from the daylight photos.
 * Estimated: the funnel's profile and its bottom (~34 m, from photo s4
 *   against the lidar rim), the tripod's feet, the glass band heights,
 *   the stair tower's radius from the OSM outline.
 * Doubts: the lettering on the parapet (now "Kamin Science Center") is
 *   left out; the thin red trim lines are left out; the north-west wing's
 *   facade is drawn from the oblique photos s1/s2 only. Highmark
 *   SportsWorks (way/222624193), the red building to the north-west, is a
 *   separate building and is not part of this model.
 * Left out: lettering, the antennas, railings, the USS Requin (moored
 *   beside, its own feature).
 *
 * Night: the glass bands glow; the funnel is floodlit from below.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { rod } from './bridge-kit'

const DX = 14, DY = 19.5 // drum and funnel centre

function block(wall: Part, top: Part, r: XY[], h: number) {
  walls(wall, r, 0, h)
  cap(top, r, h)
  // a coping edge, pale
}

/** Glass bands on every wall of a ring longer than minL. */
function bands(win: Part, r: XY[], rows: [number, number][], minL = 8, skip: (a: XY, b: XY) => boolean = () => false) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const { L } = onWall(a, b)
    if (L < minL || skip(a, b)) continue
    for (const [z0, z1] of rows) panel(win, a, b, 1.2, L - 1.2, z0, z1)
  }
}

function build() {
  const wall = new Part(), win = new Part(), roof = new Part(), white = new Part(), flat = new Part()

  // ---- the stepped blocks, west to east
  const W1 = rect(-69.5, -25.2, -52, 8)
  block(wall, flat, W1, 24.0)
  const W0 = circle(-74, -1.5, 5.4, 12, Math.PI / 12)
  block(wall, flat, W0, 24.0)
  const NW = rect(-74, 8, -52, 24.2)
  block(wall, flat, NW, 14.6)
  const NW2 = rect(-52, 20, -44, 24.4)
  block(wall, flat, NW2, 14.6)
  const T = rect(-52, -25.2, -40, 20)
  block(wall, flat, T, 28.4)
  const M = rect(-40, -23, -13, 20)
  block(wall, flat, M, 25.8)
  const M2 = rect(-13, -22.2, 0, 20.2)
  block(wall, flat, M2, 23.7)
  // the north bay with its rounded end
  block(wall, flat, rect(-30.8, 20, -21.9, 34), 9.3)
  block(wall, flat, circle(-26.35, 34, 4.45, 12), 9.3)
  // the east block behind the curved river pavilion
  const E: XY[] = [[0, -22.4], [4.4, -22.5], [9.8, -22.1], [14.7, -21.8], [18, -20.6], [22.1, -19.1], [26.1, -16.7], [29.9, -14], [33.6, -11], [37.1, -8.8], [40, -6.7], [48.8, -3.6], [47.2, 0.2], [46, 8], [0, 8]]
  block(wall, flat, E, 21.5)
  // the north-east terrace
  block(wall, flat, [[30, 8], [46, 8], [46.6, 16.3], [41.3, 23.5], [34.9, 32.4], [31.2, 29.3]], 5.5)

  // glass bands: the curved pavilion (metal below, glass above), the blocks
  for (let i = 0; i < 11; i++) {
    const a = E[i], b = E[i + 1]
    const { L } = onWall(a, b)
    panel(win, a, b, 0.05, L - 0.05, 14.2, 18.6)
  }
  bands(win, M, [[4, 8], [13, 16.5]], 8, (a, b) => a[1] > 19 && b[1] > 19)
  bands(win, T, [[6, 9], [16, 19], [23, 25.6]], 8)
  bands(win, W1, [[5, 8], [15.5, 18.5]], 8)
  bands(win, NW, [[4.5, 7.5]], 8)
  bands(win, M2, [[3, 6.5], [17, 20.5]], 8, (a, b) => a[0] > -1 && b[0] > -1)

  // the round stair tower on the river side, banded, with the observatory dome
  {
    const cx = -39.6, cy = -25.6, r = 4.4
    lathe(wall, cx, cy, [[r, 0], [r, 23]], 14)
    for (const [z0, z1] of [[6, 8.2], [11, 13.2], [16, 18.2]]) lathe(win, cx, cy, [[r + 0.06, z0], [r + 0.06, z1]], 14)
    cap(flat, circle(cx, cy, r, 14), 23)
    lathe(white, cx, cy, [[2.7, 23], [2.6, 24.1], [2.0, 25.2], [1.0, 25.9], [0.01, 26.1]], 12)
  }

  // ---- the Omnimax drum, its ribbed cone roof
  const R = 18.5
  lathe(roof, DX, DY, [[R, 0], [R, 19.5]], 20) // the drum is darker metal than the blocks (photo s4)
  lathe(win, DX, DY, [[R + 0.06, 15.0], [R + 0.06, 18.2]], 20)
  lathe(roof, DX, DY, [[R + 0.4, 19.1], [R + 0.4, 19.6], [12, 21.0], [5, 22.3], [0.01, 22.6]], 20)
  // the cone's ribs
  for (let k = 0; k < 10; k++) {
    const t = (k / 10) * 2 * Math.PI
    rod(roof, [DX + 18.4 * Math.cos(t), DY + 18.4 * Math.sin(t), 19.8], [DX + 4 * Math.cos(t), DY + 4 * Math.sin(t), 22.6], 0.25)
  }

  // ---- the funnel on its mast, tripod and stays
  const MB = 34.0, RIM = 49.5, TOP = 58.1
  rod(white, [DX, DY, 22], [DX, DY, TOP], 0.45, 6)
  const prof: XY[] = []
  for (let i = 0; i <= 8; i++) { const t = i / 8; prof.push([1.3 + 9.2 * t ** 1.7, MB + (RIM - MB) * t]) }
  lathe(white, DX, DY, prof, 16)
  lathe(white, DX, DY, [...prof].reverse().map(([r, z]) => [r - 0.05, z] as XY), 16)
  // the rim, a slight lip
  lathe(white, DX, DY, [[10.45, RIM], [10.7, RIM], [10.7, RIM + 0.4], [10.45, RIM + 0.4]], 16)
  // the tripod, from the cone roof to the funnel's foot
  for (let k = 0; k < 3; k++) {
    const t = Math.PI / 2 + (k * 2 * Math.PI) / 3
    rod(white, [DX + 13 * Math.cos(t), DY + 13 * Math.sin(t), 21.2], [DX, DY, MB - 1], 0.4, 4)
  }
  // stays from the mast top to the rim and down to the drum's edge
  for (let k = 0; k < 4; k++) {
    const t = Math.PI / 4 + (k * Math.PI) / 2
    rod(white, [DX, DY, TOP - 0.5], [DX + 10.5 * Math.cos(t), DY + 10.5 * Math.sin(t), RIM + 0.2], 0.12)
    rod(white, [DX + 10.5 * Math.cos(t), DY + 10.5 * Math.sin(t), RIM], [DX + 18.4 * Math.cos(t), DY + 18.4 * Math.sin(t), 19.8], 0.12)
  }

  const lit = (p: V3, n: V3) => (p[2] > 30 ? (n[2] < 0.2 ? 0.9 : 0.5) : 0.1)
  return [
    { part: wall, material: finish('metal-panel', 0xc9cbd1) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: flat, material: finish('roof-membrane', 0xdcdedd) },
    { part: white, material: { ...finish('fabric-white', 0xf1efe8), floodlight: lit } },
  ]
}

if (import.meta.main) await save('pit-carnegie-science-center', 'Carnegie Science Center', [40.4455365, -80.0177901], 20, build() as any, 6500)
