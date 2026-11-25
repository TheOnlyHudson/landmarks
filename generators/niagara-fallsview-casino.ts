/**
 * Fallsview Casino Resort (2004, Moriyama & Teshima / Hirsch Bedner),
 * 6380 Fallsview Boulevard, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-fallsview-casino.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the OSM outline way/808104046,
 * 43.082478, -79.080755.
 *
 * Ground: the resort steps down the Fallsview escarpment. Mapterhorn puts
 * the ground under the outline between about 0 (its east edge, toward the
 * Niagara Parkway) and 10 m higher (the west, along Fallsview Boulevard).
 * y = 0 is the lowest point; each block below starts at y = 0 and rises
 * to its height above its own ground, read from the Mapterhorn table
 * embedded here (20 m grid, `bun tools/terrain.ts grid -79.080755
 * 43.082478 160 20`). The hotel tower stands about 6 m up (G).
 *
 * Identity: a pale stone hotel slab with rounded ends, its top floors in
 * green glass under a ribbed green glass bell roof; a dark grey core
 * rising up the middle of its north-west face into the roof; a lower
 * 25-27 storey block on its north-west side carrying the tall red CASINO
 * sign; and a broad low podium with glass domes and rotundas.
 *
 * Evidence:
 * - plan: OSM parts. Hotel slab way/231787196 (25-32 levels, glass hipped
 *   roof, 111 m with a 14 m roof); the lower block way/1093989141 (25
 *   levels) and way/807638406 (27 levels); the glass east tip
 *   way/1093989140; podium way/1093989146 (2 levels), way/1093989139 (4),
 *   way/1093989138 (3); the glass dome way/1093989147 (18 m, 12 m dome);
 *   the glass rotunda way/1093989135 (13 m) and glass concourses
 *   way/1093989136, way/1093989137 (2 levels); the raised block
 *   way/1093989142 (levels 2-3); porte-cochère roofs way/1093989143-145.
 * - height: 111 m (364 ft), 32 floors, published (Wikipedia, "List of
 *   tallest buildings in Niagara Falls, Ontario"), matching OSM: walls to
 *   G + 97, the bell roof to G + 111.
 * - the bell's profile, traced from Gary J. Wood's photo scaled by the
 *   slab's width: a skirt flaring about 1.4 m past the walls at the eave,
 *   near-vertical sides to about two thirds up, then rounded shoulders to a
 *   flat top about four fifths of the plan wide, with a rooftop rail. Drawn
 *   on a clean stadium plan fitted to the slab (axis 50 deg, half-width
 *   8.7 m), flat-shaded with 10 facets on each rounded end so the ribbed
 *   glass reads faceted. The green-glass top floors from about G + 80, the
 *   dark core with its glazed strip (rising about 6.5 m into the roof), the
 *   grey bands about every seven floors, the lower block's height (0.86 of
 *   the slab's wall height, so 25-27 floors) and the sign's place: the same
 *   photo and Richie Diesterheft's from the Skylon Tower (north-north-east).
 * - colours: cream limestone (palette stone) with slate punched windows
 *   (palette window, one panel per bay over two to three floors); the top
 *   floors in darker green glass (window-2); the bell and the podium's
 *   glass domes in green glass (named glass: dark at night); the core,
 *   bands and podium roofs in palette roof grey; the sign red.
 *
 * Rework (lead review against Gary J. Wood's photo): the smooth dome on a
 * drum became the faceted flared bell above; the teal window strips became
 * slate punched panels; podium rings are simplified to 0.6 m and lost their
 * bevels to keep the byte budget. Footprint, podium and placement unchanged.
 *
 * Estimated: podium heights (2 levels as 11 m, the casino floor being
 * tall; 3 levels 14 m; 4 levels 18 m), the raised block's posts, the
 * canopies at 7-8 m, the sign's size. The roof's glazing ribs are left
 * out (too fine at map distance).
 * Left out: the CASINO letters (the sign is a plain lit red panel; not a
 * famous sign), rooftop plant, the Avalon theatre and parking garage
 * (separate OSM buildings).
 *
 * Photos (Wikimedia Commons):
 * - "Fallsview Casino and the Horseshoe Falls (5750353909).jpg", Gary J.
 *   Wood, CC BY-SA 2.0 (north-west, from the Hilton)
 * - "Falls View Casino and Embassy Suites (8204388676).jpg", Richie
 *   Diesterheft, CC BY-SA 2.0 (north-north-east, from the Skylon)
 * - "SkylineNiagaraFalls.jpg", Sundar1, CC BY-SA 3.0 (east, the skyline)
 * No commercial imagery. No lidar: Ontario, no 3DEP coverage here.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, bays, block, cap, inset, lathe, rows, save, walls, type XY } from './chi-aon-center'
import { ground } from './niagara-tower-hotel'

// Mapterhorn, metres above 160.62 m; rows north (z -160) to south (z 160), columns x -160..160, 20 m.
const TABLE = [
  [33.0, 32.5, 32.2, 32.5, 31.3, 29.7, 31.0, 30.7, 28.0, 19.6, 17.8, 14.7, 18.5, 18.1, 18.8, 16.7, 7.4],
  [33.2, 32.7, 32.1, 31.5, 30.8, 28.6, 26.1, 24.0, 21.5, 18.8, 16.7, 14.8, 13.2, 11.7, 10.2, 8.7, 7.3],
  [33.4, 32.6, 31.9, 31.1, 29.9, 28.2, 26.3, 23.9, 21.6, 19.2, 17.0, 15.8, 15.0, 12.3, 14.6, 15.4, 8.0],
  [33.8, 33.7, 33.6, 32.7, 31.1, 30.0, 31.1, 31.0, 31.2, 30.9, 30.4, 29.7, 29.4, 23.2, 25.0, 23.0, 8.6],
  [34.2, 34.0, 35.6, 35.2, 33.6, 32.3, 33.4, 32.8, 32.6, 31.6, 31.3, 30.6, 30.5, 30.1, 30.2, 24.6, 10.4],
  [34.4, 35.6, 38.1, 37.6, 35.8, 34.7, 35.0, 34.5, 34.2, 33.4, 32.5, 31.4, 30.9, 30.4, 29.9, 26.3, 11.9],
  [34.7, 35.7, 38.5, 38.6, 37.9, 37.2, 36.6, 36.2, 35.5, 34.5, 33.4, 32.3, 31.1, 31.0, 29.8, 28.4, 13.7],
  [34.9, 35.4, 37.8, 39.9, 38.8, 38.8, 38.3, 37.5, 36.5, 35.4, 34.3, 33.1, 32.0, 31.2, 29.7, 29.7, 15.8],
  [35.2, 35.6, 37.4, 38.2, 38.8, 38.8, 38.9, 38.3, 37.1, 35.9, 34.6, 33.4, 32.1, 30.7, 29.6, 29.7, 20.9],
  [35.6, 36.3, 37.2, 38.2, 38.8, 38.2, 37.4, 37.6, 36.7, 35.5, 34.2, 33.0, 31.7, 30.0, 29.7, 29.8, 20.2],
  [36.4, 36.6, 37.8, 36.9, 35.7, 34.8, 34.2, 35.1, 35.8, 34.7, 33.6, 32.6, 31.3, 30.2, 26.7, 27.6, 23.5],
  [37.2, 37.3, 37.0, 35.7, 34.4, 33.1, 32.0, 32.5, 33.4, 33.9, 32.8, 31.7, 31.2, 30.7, 24.7, 18.6, 13.0],
  [38.1, 37.7, 36.5, 35.4, 34.3, 33.1, 31.9, 31.8, 31.7, 31.7, 32.0, 31.3, 31.2, 30.6, 30.0, 29.5, 16.4],
  [38.9, 38.6, 37.3, 36.2, 35.1, 33.9, 31.7, 31.6, 31.5, 31.4, 31.4, 31.4, 31.2, 30.7, 30.4, 22.5, 7.8],
  [39.8, 39.5, 38.0, 37.0, 35.8, 35.0, 31.4, 31.3, 31.3, 31.1, 31.3, 30.7, 30.6, 29.6, 27.9, 13.0, 2.4],
  [40.5, 40.1, 38.5, 37.5, 36.4, 35.0, 31.1, 31.1, 31.0, 31.1, 31.3, 30.7, 30.5, 27.4, 12.6, 5.9, 0.7],
  [40.7, 40.5, 40.7, 40.8, 39.5, 34.5, 30.7, 30.8, 30.7, 31.2, 31.2, 30.6, 30.5, 26.0, 11.6, 1.7, 0.0],
]
/** The lowest ground under the outline, on the table's scale. */
const LOW = 29.5
const gnd = ground(TABLE, -160, -160, 20)
const at = (x: number, y: number) => Math.max(0, gnd(x, y) - LOW)
const centroid = (r: XY[]): XY => {
  let a = 0, cx = 0, cy = 0
  r.forEach((p, i) => { const q = r[(i + 1) % r.length], k = p[0] * q[1] - q[0] * p[1]; a += k; cx += (p[0] + q[0]) * k; cy += (p[1] + q[1]) * k })
  return [cx / (3 * a), cy / (3 * a)]
}
/** Height above y = 0 of the ground under a ring's centroid. */
const base = (r: XY[]) => at(...centroid(r))

const BAR: XY[] = [[-8.13, -28.92], [-11.16, -32.75], [-11.99, -37.28], [-9.92, -41.45], [-6.14, -43.9], [-1.89, -44.12], [2.57, -42.5], [19.89, -28.18], [22.54, -24.61], [22.76, -23.29], [22.97, -20.02], [20.93, -15.72], [19.75, -14.64], [17.08, -13.3], [12.91, -13.06], [8.93, -14.78], [7.21, -16.22]]
const WING: XY[] = [[1.22, 10.67], [-8.05, 2.56], [7.21, -16.22], [8.93, -14.78], [12.91, -13.06], [17.08, -13.3], [19.75, -14.64], [20.17, -14.22], [21.09, -13.29]]
const ROTUNDA: XY[] = [[36.08, -83.54], [29.33, -88.3], [29.65, -92.08], [31.51, -97.88], [36.74, -104.21], [41.97, -107.14], [47.26, -107.36], [50.51, -105.62], [52.12, -103.08], [52.28, -98.86], [50.53, -93.17], [44.7, -86.35], [38.64, -83.58]]
const GLASS_E: XY[] = [[36.08, -83.54], [38.64, -83.58], [44.7, -86.35], [50.53, -93.17], [52.28, -98.86], [58.71, -96.1], [59.67, -99.63], [66.94, -98.49], [74.8, -99.46], [82.18, -102.84], [89.5, -91.3], [86.76, -89.98], [85.66, -89.45], [82.7, -95.22], [74.41, -92.3], [65.91, -91.11], [58.39, -92.63], [54.18, -84.72], [51.08, -87.11], [46.5, -82.83], [39.35, -79.69], [34.51, -78.98], [33.14, -79.96]]
const GLASS_S: XY[] = [[21.15, -145.68], [20.4, -145.74], [20.52, -148.75], [27.55, -147.43], [32.88, -143.45], [36.28, -138.64], [38.93, -132.56], [38.89, -123.84], [41.25, -114.77], [38.48, -113.04], [41.97, -107.14], [36.74, -104.21], [31.51, -97.88], [29.65, -92.08], [29.33, -88.3], [26.93, -85.71], [25.89, -86.35], [25.24, -92.47], [27.14, -98.75], [30.8, -104.06], [27.86, -106.71], [35.6, -112.12], [32.86, -119.92], [32.11, -127.93], [31.99, -134.32], [29.81, -138.1], [26.11, -141.24], [20.99, -142.55]]
const BLOCK3: XY[] = [[19.29, -34.54], [-2.3, -52.4], [1.74, -57.76], [-3.28, -59.61], [-9.16, -59.33], [-14.07, -56.73], [-17.68, -52.36], [-18.81, -47.37], [-18.11, -41.84], [-15.84, -38.18], [-17.34, -36.35], [-19.03, -33.73], [-23.94, -77.58], [-22.74, -77.58], [-20.72, -119.48], [-18.6, -140.56], [-16.96, -143.62], [-13.69, -145.61], [8.3, -143.81], [8.12, -146.15], [13.01, -146.1], [20.4, -145.74], [21.15, -145.68], [20.99, -142.55], [26.11, -141.24], [29.81, -138.1], [31.99, -134.32], [32.11, -127.93], [32.86, -119.92], [35.6, -112.12], [27.86, -106.71], [30.8, -104.06], [27.14, -98.75], [25.24, -92.47], [25.89, -86.35], [26.93, -85.71], [29.33, -88.3], [36.08, -83.54], [33.14, -79.96], [34.51, -78.98], [39.35, -79.69], [46.5, -82.83], [51.08, -87.11], [54.18, -84.72], [58.39, -92.63], [65.91, -91.11], [74.41, -92.3], [82.7, -95.22], [85.66, -89.45], [79.67, -86.57], [84.56, -68.53], [80.53, -67.43], [44.32, -58.41], [45.46, -60.04], [37.07, -66.65], [18.97, -44.94], [20.71, -42.01], [21.03, -38.6]]
const BLOCK4: XY[] = [[-15.84, -38.18], [-18.11, -41.84], [-18.81, -47.37], [-17.68, -52.36], [-14.07, -56.73], [-9.16, -59.33], [-3.28, -59.61], [1.74, -57.76], [-2.3, -52.4], [19.29, -34.54], [21.03, -38.6], [20.71, -42.01], [18.97, -44.94], [37.07, -66.65], [45.46, -60.04], [44.32, -58.41], [41.7, -55.05], [59.69, 12.18], [54.13, 14.02], [30.36, 41.74], [31.67, 47.37], [-9.76, 58.53], [-17.5, -18.78], [-10.75, -27.02], [-19.03, -33.73], [-17.34, -36.35], [-8.13, -28.92], [7.21, -16.22], [-8.05, 2.56], [1.22, 10.67], [21.09, -13.29], [20.17, -14.22], [22.51, -14.67], [24.17, -16.05], [25.2, -18.08], [25.24, -20.87], [24.28, -22.9], [23.35, -24.01], [24.01, -24.8], [19.89, -28.18], [2.57, -42.5], [-4.86, -48.45], [-10.59, -41.8], [-11.94, -42.9]]
const GLASS_TIP: XY[] = [[20.17, -14.22], [19.75, -14.64], [20.93, -15.72], [22.97, -20.02], [22.76, -23.29], [23.35, -24.01], [24.28, -22.9], [25.24, -20.87], [25.2, -18.08], [24.17, -16.05], [22.51, -14.67]]
const LOWER: XY[] = [[-8.05, 2.56], [7.21, -16.22], [-8.13, -28.92], [-17.34, -36.35], [-15.84, -38.18], [-11.94, -42.9], [-10.59, -41.8], [-4.86, -48.45], [2.57, -42.5], [19.89, -28.18], [24.01, -24.8], [23.35, -24.01], [22.76, -23.29], [22.97, -20.02], [20.93, -15.72], [19.75, -14.64], [20.17, -14.22], [21.09, -13.29], [1.22, 10.67]]
const BRIDGE: XY[] = [[-24.81, 41.64], [-22.74, 61.99], [-101.36, 83.1], [-106.81, 82.56], [-110.52, 79.74], [-112.7, 75.63], [-112.81, 71.2], [-110.19, 66.32], [-106.59, 63.39]]
const CANOPY_A: XY[] = [[-83.31, 7.26], [-84.22, 5.55], [-72.3, -14.32], [-73.13, -14.86], [-71.25, -18.75], [-64.51, -15.32], [-59.27, -11.31], [-55.45, -5.69], [-51.36, -5.21], [-52.56, -1.89], [-52.81, 0.81], [-59.65, 1.41]]
const CANOPY_B: XY[] = [[-81.35, 14.78], [-57.58, 8.66], [-51.6, 5.88], [-50.21, 8.11], [-47.68, 10.54], [-50.77, 13.26], [-50.99, 20.51], [-53.27, 27.89], [-57.18, 34.24], [-62.55, 30.06], [-61.96, 28.91], [-81.82, 17.11]]
const CANOPY_GLASS: XY[] = [[-81.82, 17.11], [-87.77, 18.26], [-90.42, 7.08], [-84.22, 5.55], [-83.31, 7.26], [-59.65, 1.41], [-52.81, 0.81], [-52.76, 1.62], [-52.61, 2.75], [-51.95, 5.05], [-51.6, 5.88], [-57.58, 8.66], [-81.35, 14.78]]
const FLOOR2: XY[] = [[-51.36, -5.21], [-55.45, -5.69], [-59.27, -11.31], [-64.51, -15.32], [-71.25, -18.75], [-76.75, -22.6], [-47.86, -20.87], [-47.77, -21.6], [-44.93, -21.38], [-43.9, -40.49], [-51.31, -40.93], [-50.99, -52.13], [-46.4, -51.81], [-48.25, -70.27], [-49.78, -70.54], [-47.71, -121.96], [-28.42, -119.98], [-20.72, -119.48], [-22.74, -77.58], [-23.94, -77.58], [-19.03, -33.73], [-10.75, -27.02], [-17.5, -18.78], [-9.76, 58.53], [31.67, 47.37], [30.36, 41.74], [54.13, 14.02], [59.69, 12.18], [41.7, -55.05], [44.32, -58.41], [80.53, -67.43], [86.18, -47.14], [80.72, -45.83], [91.2, -9.28], [102.49, -12.48], [108.44, 10.24], [97.49, 13.22], [104.4, 39.79], [98.23, 41.42], [101.87, 55.01], [100.44, 55.41], [101.29, 59.44], [98.68, 60.23], [98.35, 67.78], [94.04, 73.85], [87.39, 76.39], [87.49, 79.96], [83.44, 80.33], [83.31, 81.65], [44.08, 85.78], [44.37, 89.21], [40.23, 89.66], [40.29, 90.63], [10.78, 93.9], [11.15, 98.5], [-20.62, 101.68], [-27.72, 103.56], [-33.33, 107.25], [-33.66, 111.86], [-70.76, 108.91], [-124.89, 105.72], [-124.67, 100.92], [-137.73, 100.41], [-143.77, 98.73], [-148.63, 94.8], [-151.8, 89.06], [-152.4, 83.0], [-150.64, 76.6], [-146.53, 72.04], [-141.54, 69.34], [-122.7, 64.46], [-123.02, 63.16], [-123.53, 61.47], [-124.03, 59.83], [-124.42, 58.63], [-71.25, 44.89], [-62.55, 40.0], [-57.18, 34.24], [-53.27, 27.89], [-50.99, 20.51], [-50.77, 13.26], [-47.68, 10.54], [-44.55, 12.18], [-41.09, 12.86], [-37.59, 12.56], [-34.31, 11.29], [-31.52, 9.16], [-29.45, 6.34], [-28.26, 3.06], [-28.04, -0.42], [-28.82, -3.83], [-30.53, -6.88], [-33.04, -9.34], [-36.15, -11.0], [-39.61, -11.72], [-43.14, -11.44], [-46.44, -10.18], [-49.26, -8.05]]
const DOME: XY[] = [[-43.14, -11.44], [-39.61, -11.72], [-36.15, -11.0], [-33.04, -9.34], [-30.53, -6.88], [-28.82, -3.83], [-28.04, -0.42], [-28.26, 3.06], [-29.45, 6.34], [-31.52, 9.16], [-34.31, 11.29], [-37.59, 12.56], [-41.09, 12.86], [-44.55, 12.18], [-47.68, 10.54], [-50.21, 8.11], [-51.6, 5.88], [-51.95, 5.05], [-52.61, 2.75], [-52.76, 1.62], [-52.81, 0.81], [-52.56, -1.89], [-51.36, -5.21], [-49.26, -8.05], [-46.44, -10.18]]

const v3 = (p: XY, z: number): V3 => [p[0], p[1], z]


/** Drop ring vertices within `tol` metres of the line through their neighbours (podium rings, for the byte budget). */
function simplify(r: XY[], tol = 0.6): XY[] {
  let out = r.slice(), changed = true
  while (changed && out.length > 4) {
    changed = false
    for (let i = 0; i < out.length && out.length > 4; i++) {
      const a = out[(i + out.length - 1) % out.length], p = out[i], b = out[(i + 1) % out.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      const d = Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / L
      if (d < tol) { out.splice(i, 1); changed = true; i-- }
    }
  }
  return out
}

/** The slab's plan as a clean stadium, offset d metres outward (inward if negative), counter-clockwise. */
function stadium(d: number, seg = 10): XY[] {
  const u: XY = [0.771, 0.637], v: XY = [-u[1], u[0]], c: XY = [5.65, -28.82], h = 11.4, r = 8.7 + d
  const out: XY[] = []
  for (const [k, t0] of [[1, -Math.PI / 2], [-1, Math.PI / 2]] as const)
    for (let i = 0; i <= seg; i++) {
      const t = t0 + (i / seg) * Math.PI, e: XY = [u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t)]
      out.push([c[0] + u[0] * h * k + e[0] * r, c[1] + u[1] * h * k + e[1] * r])
    }
  return out
}

/** A flat slab on a few posts, for the porte-cochère roofs. */
function canopy(slab: Part, post: Part, r: XY[], z0: number, z1: number, posts: XY[]) {
  block(slab, slab, r, z0, z1, 0.15)
  cap(slab, r, z0, false)
  for (const [x, y] of posts) block(post, null, [[x - 0.35, y - 0.35], [x + 0.35, y - 0.35], [x + 0.35, y + 0.35], [x - 0.35, y + 0.35]], 0, z0, 0)
}

function build() {
  const stone = new Part(), win = new Part(), top = new Part(), grey = new Part(), glass = new Part(), neon = new Part()

  // ===== the hotel slab
  const G = base(BAR) // about 6 m
  const EAVE = G + 97, TOP = G + 111, GLASS = G + 80
  walls(stone, BAR, 0, GLASS)
  walls(top, BAR, GLASS, EAVE)
  // grey bands at the slab's string courses, and the band under the glass
  for (const z of [G + 19, G + 38, G + 57, GLASS - 1, (GLASS + EAVE) / 2]) {
    const o = inset(BAR, -0.25)
    walls(grey, o, z - 0.2, z + 1.2); walls(grey, o, z + 1.2, z + 1.21, BAR) // no underside: seen from above
  }
  bays(win, BAR, [...rows(G + 4, G + 18.6, 3, 1.6), ...rows(G + 20.4, G + 37.6, 3, 1.6), ...rows(G + 39.4, G + 56.6, 3, 1.6), ...rows(G + 58.4, GLASS - 1.4, 3, 1.6)], { bay: 2.4, gap: 2.0, end: 1.0, minLen: 3, out: 0.05 })
  // pale mullion lines on the glass top: a stone frame every few metres
  for (let i = 0; i < BAR.length; i++) {
    const a = BAR[i], b = BAR[(i + 1) % BAR.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.max(1, Math.round(L / 3.6))
    for (let q = 0; q <= k; q++) {
      if (L < 3 && q > 0) break
      const s = (L * q) / k, P = (d: number, z: number, o: number): V3 => [a[0] + u[0] * (s + d) + n[0] * o, a[1] + u[1] * (s + d) + n[1] * o, z]
      if (s < 0.2 || s > L - 0.2) continue
      stone.quad(P(-0.2, GLASS, 0.07), P(0.2, GLASS, 0.07), P(0.2, EAVE, 0.07), P(-0.2, EAVE, 0.07))
    }
  }
  // the glass east tip (way/1093989140)
  walls(top, GLASS_TIP, 0, GLASS)
  // eave lip and the bell roof: a clean stadium matching BAR (axis 50.4 deg, half-width
  // 8.7 m, straight half-length 11.4 m), offset outward or inward per the photo's profile.
  // Faceted: 10 flat facets on each rounded end, flat-shaded, so the ribbed glass reads.
  const lip = stadium(1.3)
  cap(grey, lip, EAVE, false)
  walls(grey, lip, EAVE, EAVE + 0.7)
  // [offset from the wall line, height above the eave]: a flared skirt, near-vertical
  // sides, then curving in to a narrow flat top (Gary J. Wood's photo, scaled by the slab).
  const bell: [number, number][] = [[1.45, 0.7], [1.0, 1.4], [0.8, 2.8], [0.65, 5.0], [0.45, 7.2], [0.0, 9.2], [-0.8, 11.0], [-1.9, 12.6], [-2.9, 13.6], [-3.3, 14.0]]
  cap(grey, lip, EAVE + 0.7)
  for (let i = 0; i < bell.length - 1; i++) walls(glass, stadium(bell[i][0]), EAVE + bell[i][1], EAVE + bell[i + 1][1], stadium(bell[i + 1][0]))
  cap(glass, stadium(-3.3), TOP)
  // the rooftop rail, as a low solid band round the flat top
  {
    const o = stadium(-3.45), i = stadium(-3.75)
    walls(grey, o, TOP - 0.05, TOP + 0.9); walls(grey, o, TOP + 0.9, TOP + 0.9, i)
  }
  // the dark core up the middle of the north-west face, rising into the roof
  {
    const a: XY = [7.21, -16.22], b: XY = [-8.13, -28.92] // the north-west face, east to west
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const s0 = L * 0.2, s1 = s0 + 6.5
    const P = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
    block(grey, grey, [P(s0, 1.6), P(s0, -2.5), P(s1, -2.5), P(s1, 1.6)].reverse(), 0, EAVE + 6.5, 0.3)
    // its glazed strip, the full height of the front face
    const Q = (s: number, z: number): V3 => v3(P(s, 1.65), z)
    const m = (s0 + s1) / 2
    win.quad(Q(m - 1.6, G + 3), Q(m + 1.6, G + 3), Q(m + 1.6, EAVE + 4.5), Q(m - 1.6, EAVE + 4.5))
  }

  // ===== the lower block on the north-west side (25 floors) and its 27-floor wing
  const LZ = G + 79.6, WZ = G + 85.5
  block(stone, grey, LOWER, 0, LZ, 0.4)
  bays(win, LOWER, [...rows(G + 4, G + 18.6, 3, 1.6), ...rows(G + 20.4, G + 37.6, 3, 1.6), ...rows(G + 39.4, G + 56.6, 3, 1.6), ...rows(G + 58.4, LZ - 1.6, 3, 1.6)], { bay: 2.4, gap: 2.0, end: 0.9, minLen: 5, out: 0.05 })
  block(stone, grey, WING, 0, WZ, 0.4)
  bays(win, WING, [...rows(G + 4, G + 18.6, 3, 1.6), ...rows(G + 20.4, G + 37.6, 3, 1.6), ...rows(G + 39.4, G + 56.6, 3, 1.6), ...rows(G + 58.4, WZ - 1.6, 3, 1.6)], { bay: 2.4, gap: 2.0, end: 0.9, minLen: 5, out: 0.05 })
  // the CASINO sign: a tall green-glass box on the wing's north-west corner, red lit face to the north-east
  {
    const a: XY = [1.22, 10.67], b: XY = [21.09, -13.29] // the wing's north-east face, from its north-west end
    // a→b runs against the ring's winding, so the outward normal is on the left
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
    const P = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
    block(win, grey, [P(0.4, 2.2), P(0.4, -0.5), P(4.0, -0.5), P(4.0, 2.2)], G + 30, WZ - 2, 0.2)
    const Q = (s: number, d: number, z: number): V3 => v3(P(s, d), z)
    neon.quad(Q(4.0 - 0.5, 2.25, G + 33), Q(0.9, 2.25, G + 33), Q(0.9, 2.25, WZ - 5), Q(4.0 - 0.5, 2.25, WZ - 5))
  }

  // ===== podium
  const pod = (r: XY[], h: number, wallPart = stone, roofPart = grey, bevel = 0.4) => {
    const z = base(r) + h
    block(wallPart, roofPart, r, 0, z, bevel)
    return z
  }
  const zF = pod(simplify(FLOOR2), 11, stone, grey, 0) // long rings: no bevel, for the byte budget
  bays(win, simplify(FLOOR2), [[zF - 7.5, zF - 2]], { bay: 5, gap: 3.5, end: 2, minLen: 14, out: 0.05 })
  const z4 = pod(simplify(BLOCK4), 18, stone, grey, 0)
  bays(win, simplify(BLOCK4), [[z4 - 14, z4 - 9], [z4 - 7, z4 - 2]], { bay: 4, gap: 2.6, end: 1.5, minLen: 10, out: 0.05 })
  const z3 = pod(simplify(BLOCK3), 14, stone, grey, 0)
  bays(win, simplify(BLOCK3), [[z3 - 10, z3 - 2]], { bay: 4, gap: 2.6, end: 1.5, minLen: 10, out: 0.05 })
  pod(simplify(GLASS_E), 9, win, glass)
  pod(simplify(GLASS_S), 9, win, glass)
  // glass rotunda: glass drum and a glass cone roof
  {
    const c = centroid(ROTUNDA), g0 = base(ROTUNDA)
    block(win, null, ROTUNDA, 0, g0 + 9, 0.2)
    const top = inset(ROTUNDA, 0.2)
    for (let i = 0; i < top.length; i++) {
      const j = (i + 1) % top.length
      glass.tri(v3(top[i], g0 + 9), v3(top[j], g0 + 9), [c[0], c[1], g0 + 13])
    }
  }
  // the glass dome (way/1093989147): a stone drum to 6 m, glass dome to 18 m
  {
    const c = centroid(DOME), r = Math.sqrt(Math.abs(area(DOME)) / Math.PI), g0 = base(DOME)
    lathe(stone, c[0], c[1], [[r, 0], [r, g0 + 6], [r + 0.4, g0 + 6.4], [r - 0.2, g0 + 6.4]], 16)
    lathe(glass, c[0], c[1], [[r - 0.2, g0 + 6.4], [r * 0.93, g0 + 10.5], [r * 0.74, g0 + 14.2], [r * 0.42, g0 + 16.9], [0.001, g0 + 18]], 16)
  }
  // the raised block (levels 2-3) on posts, and the porte-cochère roofs
  {
    const g0 = base(BRIDGE)
    canopy(stone, grey, BRIDGE, g0 + 8, g0 + 14, [[-30, 48], [-55, 56], [-80, 63], [-105, 70]])
    bays(win, BRIDGE, [[g0 + 9.2, g0 + 12.8]], { bay: 3, gap: 1.2, end: 1.2, minLen: 8, out: 0.05 })
  }
  canopy(grey, grey, CANOPY_A, base(CANOPY_A) + 7, base(CANOPY_A) + 8, [[-80, 5], [-70, -12], [-60, -2]])
  canopy(grey, grey, CANOPY_B, base(CANOPY_B) + 7, base(CANOPY_B) + 8, [[-78, 15], [-58, 26], [-55, 12]])
  canopy(glass, grey, CANOPY_GLASS, base(CANOPY_GLASS) + 7.5, base(CANOPY_GLASS) + 8, [[-87, 10], [-60, 4]])

  return [
    { part: stone, material: PALETTE.stone },
    { part: win, material: PALETTE.window },
    { part: top, material: windowVariant(2, 0x587d7f) },
    { part: grey, material: PALETTE.roof },
    { part: glass, material: finish('glass', 0x78a294) },
    { part: neon, material: finish('neon-casino-red', 0xc9473d) },
  ]
}

if (import.meta.main && process.env.DBG) { const b = build(); for (const x of b) console.log(x.material.name, x.part.triangles) }
if (import.meta.main) await save('niagara-fallsview-casino', 'Fallsview Casino Resort', [43.082478, -79.080755], 0, build(), 6500)
