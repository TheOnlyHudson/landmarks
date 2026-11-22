/**
 * Embassy Suites by Hilton Niagara Falls Fallsview (2003), 6700 Fallsview
 * Boulevard, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-embassy-suites.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the OSM outline way/808108216,
 * 43.079538, -79.082105.
 *
 * Ground: Mapterhorn puts Fallsview Boulevard and the tower's own ground
 * about 8-9 m above the lowest point under the outline, which is on its
 * east edge where the site drops toward the Niagara Parkway. y = 0 is that
 * lowest point; the tower and the west podium start at G (the boulevard),
 * and their walls run down to y = 0 so the downhill side has no gap.
 *
 * Identity: a broad glass slab of grey-green curtain wall in vertical
 * stripes, topped by a maroon crown (a band round the top floors, maroon
 * fins dropping down the two show faces, a maroon sign box on the roof),
 * with fifteen-storey salmon-pink wings at its two ends and a podium.
 *
 * Evidence:
 * - plan: OSM. Tower way/37015934 (36 levels); 15-level wings
 *   way/1093928992 (south-west end) and way/1093928993 (north end);
 *   podium way/1093928988 (4 levels), way/1093928989 (5), way/1093928991
 *   (5, east, on the low side), way/1093928990 (1, the south link to the
 *   Tower Hotel's base, whose edge it shares exactly).
 * - height: 118 m (387 ft), 36 floors, published (Wikipedia, "List of
 *   tallest buildings in Niagara Falls, Ontario"), taken from the
 *   boulevard (G) to the top of the sign box. 36 floors over about 110 m
 *   puts the main roof at G + 112.
 * - crown, fins, sign, pink wings and colours: the photos below. The crown
 *   band covers about the top three floors; five fins a face drop about
 *   two more floors; the sign box stands about 6 m above the roof.
 * - wings: 15 floors at about 3.1 m, G + 48.
 *
 * Estimated: podium heights (4-5 floors at about 4 m), the fin count and
 * depth, the sign box's size. The tower's west side, with its jogs, has no
 * close photo; it follows OSM.
 * Left out: the lettering (a plain lit panel instead: this is not a famous
 * sign), rooftop plant, the porte-cochère.
 *
 * Photos (Wikimedia Commons):
 * - "Hotels at Niagara Falls, Ontario, Canada.jpg", Maksim Sokolov
 *   (maxergon.com), CC BY-SA 4.0 (from the east, 2019)
 * - "Embassy Suites - panoramio.jpg", Idawriter, CC BY-SA 3.0 (north-east)
 * - "Falls View Casino and Embassy Suites (8204388676).jpg", Richie
 *   Diesterheft, CC BY-SA 2.0 (from the Skylon Tower, north)
 * - "Niagara Falls - ON - Konica Minolta Tower.jpg", Taxiarchos228,
 *   CC BY 3.0 (west; the pink lower floors)
 * No commercial imagery. No lidar: Ontario, no 3DEP coverage here.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, block, inset, rows, save, walls, cap, type XY } from './chi-aon-center'

/** The boulevard's height above the lowest ground under the outline (Mapterhorn). */
export const G = 7.5

const TOWER: XY[] = [[6.36, 28.89], [-6.84, 20.88], [-11.02, 18.34], [-9.71, 15.93], [-13.68, 13.69], [-10.08, 7.65], [-6.45, 9.73], [-5.84, 8.64], [-7.89, -0.28], [-15.7, -5.13], [-12.23, -10.59], [-4.17, -23.25], [6.49, -16.52], [24.04, -5.42], [25.41, -3.52], [25.0, -1.41], [18.46, 9.22]]
const WING_SW: XY[] = [[-12.23, -10.59], [-16.1, -12.65], [-8.41, -25.49], [-4.17, -23.25]]
const WING_N: XY[] = [[-6.84, 20.88], [6.36, 28.89], [4.24, 32.49], [-3.82, 27.68], [-9.09, 24.53]]
const OUTLINE: XY[] = [[17.04, 23.85], [21.59, 26.13], [18.95, 30.82], [-3.44, 37.75], [-14.12, 37.95], [-23.76, 34.7], [-40.2, 24.86], [-36.21, 4.56], [-32.63, -0.81], [-28.94, -6.36], [-30.03, -7.99], [-31.94, -10.96], [-32.02, -13.57], [-31.57, -16.64], [-30.3, -20.16], [-27.29, -24.58], [-23.57, -27.65], [-20.85, -28.74], [-18.85, -28.64], [-16.48, -28.2], [-14.4, -31.53], [8.23, -33.69], [7.66, -39.05], [7.31, -42.31], [16.15, -43.17], [16.86, -34.77], [22.82, -35.28], [30.24, -35.93], [34.43, -36.25], [34.63, -34.22], [34.8, -32.57], [39.87, 16.95], [24.17, 11.31]]
const POD_W4: XY[] = [[21.59, 26.13], [18.95, 30.82], [-3.44, 37.75], [-14.12, 37.95], [-23.76, 34.7], [-40.2, 24.86], [-36.21, 4.56], [-32.63, -0.81], [-28.94, -6.36], [-30.03, -7.99], [-31.94, -10.96], [-32.02, -13.57], [-31.57, -16.64], [-30.3, -20.16], [-27.29, -24.58], [-23.57, -27.65], [-20.85, -28.74], [-18.85, -28.64], [-16.48, -28.2], [-14.4, -31.53], [8.23, -33.69], [9.53, -33.88], [10.24, -27.43], [12.9, -27.76], [6.49, -16.52], [-4.17, -23.25], [-8.41, -25.49], [-16.1, -12.65], [-19.75, -14.65], [-32.84, 7.49], [-32.51, 8.51], [-33.33, 9.49], [-33.71, 11.22], [-33.43, 12.46], [-34.36, 13.43], [-31.37, 17.5], [-26.9, 21.78], [-18.88, 26.49], [-11.19, 28.81], [-4.98, 29.35], [-3.82, 27.68], [4.24, 32.49], [6.36, 28.89], [16.08, 25.52], [17.04, 23.85]]
const POD_W5: XY[] = [[-3.82, 27.68], [-4.98, 29.35], [-11.19, 28.81], [-18.88, 26.49], [-26.9, 21.78], [-31.37, 17.5], [-34.36, 13.43], [-33.43, 12.46], [-33.71, 11.22], [-33.33, 9.49], [-32.51, 8.51], [-32.84, 7.49], [-19.75, -14.65], [-16.1, -12.65], [-12.23, -10.59], [-15.7, -5.13], [-7.89, -0.28], [-5.84, 8.64], [-6.45, 9.73], [-10.08, 7.65], [-13.68, 13.69], [-9.71, 15.93], [-11.02, 18.34], [-6.84, 20.88], [-9.09, 24.53]]
const POD_E5: XY[] = [[6.49, -16.52], [12.9, -27.76], [29.37, -29.22], [29.16, -31.88], [34.8, -32.57], [39.87, 16.95], [24.17, 11.31], [17.04, 23.85], [16.08, 25.52], [6.36, 28.89], [18.46, 9.22], [25.0, -1.41], [25.41, -3.52], [24.04, -5.42]]
const LINK: XY[] = [[8.23, -33.69], [7.66, -39.05], [7.31, -42.31], [16.15, -43.17], [16.86, -34.77], [22.82, -35.28], [30.24, -35.93], [34.43, -36.25], [34.63, -34.22], [34.8, -32.57], [29.16, -31.88], [29.37, -29.22], [12.9, -27.76], [10.24, -27.43], [9.53, -33.88]]

function build() {
  const wall = new Part(), win = new Part(), red = new Part(), pink = new Part(), roof = new Part(), sign = new Part()

  const ROOF = G + 112, CROWN = G + 103.5
  // ---- tower: grey-green curtain wall with broad glass panels, three floors each
  walls(wall, TOWER, 0, CROWN)
  bays(win, TOWER, rows(G + 5, CROWN - 0.6, 11, 0.9), { bay: 2.6, gap: 0.9, end: 0.8, minLen: 4, out: 0.05 })
  // crown band: a little proud, maroon, with one row of glass panels
  const crown = inset(TOWER, -0.35)
  walls(red, TOWER, CROWN - 0.01, CROWN, crown)
  const top = block(red, null, crown, CROWN, ROOF, 0.4)
  bays(win, crown, [[CROWN + 1.2, CROWN + 5.6]], { bay: 2.6, gap: 0.9, end: 0.8, minLen: 4, out: 0.05 })
  // a parapet round the roof
  const lip = inset(top, 0.6)
  walls(red, lip.slice().reverse(), ROOF - 1, ROOF, lip.slice().reverse())
  for (let i = 0; i < lip.length; i++) {
    const j = (i + 1) % lip.length
    red.quad([lip[i][0], lip[i][1], ROOF], [top[i][0], top[i][1], ROOF], [top[j][0], top[j][1], ROOF], [lip[j][0], lip[j][1], ROOF])
  }
  cap(roof, lip, ROOF - 1)

  // maroon fins down the two show faces (south-east and north-east), and
  // the maroon strip on the rounded east corner
  const fin = (a: XY, b: XY, n: number, z0: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    for (let k = 1; k <= n; k++) {
      const s = (L * k) / (n + 1)
      const c: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
      const r: XY[] = [[-0.45, 0.9], [0.45, 0.9], [0.45, 0], [-0.45, 0]].map(([p, q]) => [c[0] + u[0] * p + nn[0] * q, c[1] + u[1] * p + nn[1] * q] as XY)
      block(red, red, r, z0, CROWN + 0.2, 0.15)
    }
  }
  fin([-4.17, -23.25], [24.04, -5.42], 5, CROWN - 7.5)
  fin([18.46, 9.22], [6.36, 28.89], 3, CROWN - 7.5)
  fin([25.0, -1.41], [18.46, 9.22], 1, G + 78)
  fin([24.04, -5.42], [25.41, -3.52], 1, G + 78)

  // the sign box on the roof, along the south-east face, lit face on both sides
  const sb = (a: XY, b: XY, back: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [-u[1], u[0]]
    const P = (s: number, d: number): XY => [a[0] + u[0] * s + nn[0] * d, a[1] + u[1] * s + nn[1] * d]
    const s0 = L * 0.18, s1 = L * 0.82
    const r: XY[] = [P(s0, back), P(s1, back), P(s1, back + 2.2), P(s0, back + 2.2)]
    block(red, red, r, ROOF - 1, ROOF + 6, 0.2)
    const Q = (s: number, d: number, z: number): V3 => { const p = P(s, d); return [p[0], p[1], z] }
    sign.quad(Q(s0 + 1.2, back - 0.05, ROOF + 0.8), Q(s1 - 1.2, back - 0.05, ROOF + 0.8), Q(s1 - 1.2, back - 0.05, ROOF + 4.8), Q(s0 + 1.2, back - 0.05, ROOF + 4.8))
  }
  sb([-4.17, -23.25], [24.04, -5.42], 1.6)
  sb([25.0, -1.41], [6.36, 28.89], 1.6)

  // ---- the fifteen-storey pink wings
  for (const w of [WING_SW, WING_N]) {
    block(pink, roof, w, 0, G + 48, 0.4)
    bays(win, w, rows(G + 5, G + 47, 5, 0.9), { bay: 2.2, gap: 1.1, end: 0.8, minLen: 4, out: 0.05 })
  }

  // ---- podium
  block(wall, roof, OUTLINE, 0, G + 4.5, 0.3)
  block(wall, roof, POD_W4, 0, G + 16, 0.4)
  block(wall, roof, POD_W5, 0, G + 19.5, 0.4)
  block(wall, roof, POD_E5, 0, G + 15, 0.4)
  block(wall, roof, LINK, 0, G + 5, 0.3)
  for (const [r, z1] of [[POD_W4, G + 16], [POD_W5, G + 19.5], [POD_E5, G + 15]] as [XY[], number][])
    bays(win, r, rows(G + 1.5, z1 - 1.2, 2, 1.2), { bay: 3, gap: 1.4, end: 1.0, minLen: 6, out: 0.05 })

  return [
    { part: wall, material: finish('embassy-panel', 0xc9d2cd) },
    { part: win, material: windowVariant(2, 0x7d9c9b) },
    { part: red, material: finish('embassy-maroon', 0xa45a50) },
    { part: pink, material: finish('embassy-pink', 0xdcb8ab) },
    { part: roof, material: PALETTE.roof },
    { part: sign, material: finish('neon-embassy-sign', 0xeee3d3) },
  ]
}

if (import.meta.main) await save('niagara-embassy-suites', 'Embassy Suites Niagara Falls Fallsview', [43.079538, -79.082105], 0, build())
