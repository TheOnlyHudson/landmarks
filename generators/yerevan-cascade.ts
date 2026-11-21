/**
 * The Cascade (Կասկադ), Yerevan: the giant travertine stairway that climbs
 * the hillside from Tamanyan Street towards Victory Park (Jim Torosyan,
 * Aslan Mkhitaryan, Sargis Gyurzadyan; built 1980-c.1988, finished part
 * restored 2002-2009 as the Cafesjian Center for the Arts). Procedural,
 * CC0-1.0, no textures.
 *   bun generators/yerevan-cascade.ts
 * Writes models/yerevan-cascade.glb and a detail model
 * models/yerevan-cascade.detail.glb (real-size step pairs, finer arches,
 * the fountain spouts and the sunburst ribs under each arched window).
 *
 * Frame: x east, y north up the stair, z up, metres. Origin at the area
 * centroid of the OSM outline way/83688503 (anchor 44.515587, 40.191475),
 * turned to bearing 3.5: the stair's two side walls (OSM retaining walls
 * way/83688504 and way/84790684) run 3.3 and 3.6 deg east of north.
 *
 * Identity: a white-travertine stair 50 m wide climbing ~280 m up the hill
 * in a central spine of five flat-topped terrace blocks (the fan-fountain
 * block at the foot, then four blocks whose south faces each carry a big
 * semicircular arched window over a sunburst fountain, an arched door to
 * the west and a narrow arched window to the east), each block's top a
 * terrace with a sunken stepped diamond fountain and its north end stepped
 * in where the stairs wrap round it; long stair flights on both sides with
 * planted strips beside the spine; sloping parapet walls along the outer
 * edges; a top viewing terrace.
 *
 * The site follows the map's terrain. The ground under it is the
 * Mapterhorn DEM at z12 (the only zoom here), baked below from
 * `bun tools/terrain.ts grid 44.515587 40.191475 150 5 --bearing 3.5
 * --zoom 12`. Every wall stands on that ground (its feet follow the DEM in
 * pieces of 4 m or less), so the map reads the model as terrain-following
 * (web/landmark-ground.ts) and drapes it; nothing is built under the stair
 * treads but their risers. y = 0 is the lowest DEM point under the outline.
 *
 * Evidence
 * - OSM (ODbL): the outline way/83688503 (tourism=attraction, no building
 *   tag); the side retaining walls way/83688504, way/84790684; each spine
 *   block's walls (barrier=retaining_wall) way/412847373 (fan-fountain
 *   block), way/412506409, way/412847369, way/412847370, way/412847371,
 *   with their stepped north ends; the diamond fountains way/412847375,
 *   412847377, 412847374, 412847372; every stair flight with its
 *   step_count (way/1172718376, 1172718375, 1172718318, 28323217,
 *   1172718374, 505351932, 1172718315, 1172718322, 1172718321,
 *   1172718320, 1172718319, 505351931, 1243815105, 1172718354,
 *   1172718350 on the east and the centre): 564 steps bottom to top,
 *   counted along the east side. The landings (footways way/505351933,
 *   505351930, 412847384, 514478540) and the viewpoint node/13273409357.
 *   OSM maps no building or building:part on the Cascade (checked with
 *   osm.py buildings over 250 m; the nearest, way/1058537556, a 13 m2
 *   service hut, and the apartment blocks along both sides stand outside
 *   the outline), so replaces is empty.
 * - Published: Wikipedia "Yerevan Cascade" (en): about 302 m long, 555-572
 *   steps depending on the side, five main terraces, "milky white tuff"
 *   and travertine, upper section unfinished
 *   https://en.wikipedia.org/wiki/Yerevan_Cascade ; ru.wikipedia
 *   "Каскад (Ереван)": height 78 m https://ru.wikipedia.org/wiki/Каскад_(Ереван)
 * - Photos (all evidence):
 *   - "Cascada, Ereván, Armenia, 2016-10-03, DD 18/20/21.jpg", Diego Delso,
 *     CC BY-SA 4.0: from the south on the axis, the fan-fountain block,
 *     the side flights and the planted strips
 *     https://commons.wikimedia.org/wiki/File:Cascada,_Erev%C3%A1n,_Armenia,_2016-10-03,_DD_21.jpg
 *     https://commons.wikimedia.org/wiki/File:Cascada,_Erev%C3%A1n,_Armenia,_2016-10-03,_DD_20.jpg
 *     https://commons.wikimedia.org/wiki/File:Cascada,_Erev%C3%A1n,_Armenia,_2016-10-03,_DD_18.jpg
 *   - "Cascades, Yerevan, Armenia.jpg", Arthur Chapman, CC BY 2.0: the
 *     whole stair from the foot, all four arched block faces, the side
 *     flights; every block-face proportion below is read from it
 *     https://commons.wikimedia.org/wiki/File:Cascades,_Yerevan,_Armenia.jpg
 *   - "Kaskad.jpg", Zapredelom, CC BY-SA 4.0: from the air, the plan, the
 *     diamond fountains on the terraces, the side flights
 *     https://commons.wikimedia.org/wiki/File:Kaskad.jpg
 *   - "Yerevan Cascade, Armenia.jpg", Petar Milošević, CC BY-SA 4.0: the
 *     fan-fountain wall face on (the rows of shell niches and spouts)
 *     https://commons.wikimedia.org/wiki/File:Yerevan_Cascade,_Armenia.jpg
 *   - "2014 Erywań, Kaskady (03), (10), (18), (19), (20).jpg", Marcin
 *     Konsek, CC BY-SA 4.0: the arched block faces, the sunburst fountains,
 *     the stepped diamond pools
 *     https://commons.wikimedia.org/wiki/File:2014_Erywa%C5%84,_Kaskady_(03).jpg
 *   - "Yerevan, Cascade of Yerevan, Armenia.jpg", Vyacheslav Argenberg,
 *     CC BY 4.0: an arched face with its pool
 *     https://commons.wikimedia.org/wiki/File:Yerevan,_Cascade_of_Yerevan,_Armenia.jpg
 *
 * Numbers: plan from OSM (measured); the blocks' faces raised to Chapman's
 * photo, the core 2.5 m over the stair level at its north end, shoulders
 * 1.3 m lower each; levels from the OSM step counts at
 * one riser for all 564 steps, the riser set so the top terrace meets the
 * DEM at the viewpoint (65.4 m over 564 steps, 0.116 m; published
 * heights disagree: 78 m on ru.wikipedia, the z12 DEM gives 66 m over the
 * outline). Each tread is at least 0.3 m over the DEM under it. Block-face
 * features (arch 8 m wide, springing 3.8 m over the landing; the door and
 * window arches) estimated from the Chapman and Konsek photos; the fan
 * niches from Milošević's (three rows, 3/4/5 shells). Colours sampled from
 * Delso DD 20 and Milošević (sunlit travertine #e1d9d1-#f0eae4, shade
 * #b2aba3), planting from DD 21 (#565441, pulled lighter).
 *
 * Doubts: the unfinished upper part (bare concrete terraces and the
 * concrete canopy at the top, under construction since 2024) lies north of
 * the OSM outline and is not modelled; the z12 DEM is coarse, so the stair
 * here rises more evenly than the real one; the planted strips are drawn as
 * continuous green treads, the hedges and flower beds are not; sculptures
 * of the Cafesjian garden are left out. Floodlit warm white at night, the
 * arched windows lit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { polyTris, fquad, ftri } from './berlin-oberbaum-bridge'
import { offset } from './sf-de-young'
import { writeModel } from './tbilisi-holy-trinity-cathedral'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// The ground: Mapterhorn z12 in this frame, metres over the lowest point
// under the outline. Rows from y = -150 north to 150 every 5 m; columns
// x = -30 to 35 every 5 m.
const DEM_X0 = -30, DEM_Y0 = -150, DEM_STEP = 5
const DEM: number[][] = 
[  [2.5,2.5,2.5,2.5,2,1.5,0.9,0.6,0.3,0,0.3,0.7,1.1,1.8],
  [2.5,2.5,2.5,2.5,1.9,1.3,0.7,0.5,0.2,0,0.4,0.9,1.3,2],
  [2.5,2.5,2.5,2.5,1.8,1.2,0.5,0.3,0.2,0,0.5,1,1.5,2.2],
  [2.5,2.5,2.5,2.5,1.9,1.3,0.8,0.6,0.4,0.3,0.8,1.3,1.8,2.5],
  [2.5,2.5,2.5,2.5,2,1.5,1.1,0.9,0.7,0.7,1.2,1.7,2.2,2.9],
  [2.6,2.6,2.6,2.5,2.1,1.8,1.4,1.3,1.1,1.1,1.5,2,2.6,3.2],
  [2.9,2.9,2.9,2.8,2.5,2.2,2,1.9,1.8,1.8,2.2,2.7,3.2,3.8],
  [3.3,3.3,3.2,3.2,2.9,2.7,2.5,2.5,2.5,2.7,3,3.4,3.9,4.4],
  [3.7,3.7,3.7,3.6,3.4,3.2,3.1,3.2,3.3,3.5,3.8,4.1,4.6,5.1],
  [4.2,4.3,4.3,4.3,4.2,4,4,4.1,4.2,4.4,4.8,5.1,5.5,6],
  [4.8,4.9,5,5,4.9,4.8,4.8,5,5.1,5.4,5.8,6.1,6.6,7],
  [5.5,5.6,5.7,5.8,5.7,5.7,5.7,5.8,6,6.3,6.7,7.2,7.6,8.1],
  [6.4,6.5,6.6,6.7,6.7,6.7,6.8,6.9,7,7.4,7.9,8.4,8.9,9.3],
  [7.2,7.4,7.5,7.6,7.7,7.7,7.8,7.9,8,8.5,9.1,9.6,10.2,10.7],
  [8.3,8.4,8.5,8.6,8.7,8.8,8.9,9,9.1,9.6,10.2,10.8,11.4,12],
  [9.5,9.6,9.7,9.8,9.9,10,10.1,10.2,10.3,10.9,11.5,12.1,12.8,13.5],
  [10.8,10.9,11,11,11.1,11.2,11.3,11.4,11.5,12.1,12.7,13.3,14.2,15],
  [12,12.1,12.3,12.4,12.4,12.5,12.6,12.7,12.8,13.4,14,14.6,15.6,16.5],
  [13.3,13.5,13.6,13.7,13.8,13.9,14.1,14.2,14.4,14.9,15.5,16,16.9,17.8],
  [14.5,14.8,15,15.1,15.2,15.3,15.5,15.8,16,16.5,16.9,17.5,18.3,19.1],
  [15.8,16.1,16.4,16.6,16.7,16.8,17,17.2,17.5,17.9,18.4,18.9,19.7,20.4],
  [17.1,17.5,17.8,18,18.2,18.3,18.5,18.7,18.9,19.4,19.8,20.3,21.1,21.9],
  [18.4,18.8,19.2,19.5,19.7,19.9,20,20.1,20.3,20.8,21.2,21.7,22.5,23.3],
  [19.5,20,20.4,20.7,21,21.3,21.3,21.4,21.7,22.1,22.5,23.1,23.9,24.7],
  [20.6,21,21.4,21.8,22.2,22.5,22.6,22.7,22.9,23.3,23.8,24.4,25.3,26.1],
  [21.6,22.1,22.5,23,23.4,23.7,23.8,23.9,24.1,24.6,25,25.7,26.6,27.5],
  [22.9,23.3,23.7,24.2,24.6,24.9,25,25.2,25.5,25.9,26.3,27.1,28,28.9],
  [24.1,24.5,25,25.4,25.9,26.2,26.4,26.5,26.9,27.3,27.7,28.5,29.3,30.2],
  [25.3,25.8,26.2,26.7,27.1,27.4,27.7,27.9,28.3,28.7,29.1,29.8,30.7,31.5],
  [26.7,27.2,27.6,28,28.5,28.8,29,29.3,29.7,30.1,30.5,31.3,32,32.8],
  [28,28.6,29,29.5,29.9,30.2,30.4,30.7,31.1,31.5,32,32.7,33.5,34.2],
  [29.4,30,30.4,30.9,31.3,31.6,31.8,32.1,32.5,32.9,33.4,34.1,34.9,35.7],
  [30.8,31.4,31.8,32.3,32.7,33,33.2,33.5,33.9,34.3,34.8,35.5,36.3,37],
  [32.2,32.8,33.2,33.7,34.1,34.4,34.6,34.9,35.3,35.7,36.2,36.9,37.6,38.3],
  [33.6,34.2,34.6,35.1,35.5,35.8,36,36.3,36.7,37.2,37.6,38.2,38.9,39.5],
  [35,35.6,36,36.4,36.7,37,37.3,37.6,38,38.4,38.9,39.5,40.1,40.7],
  [36.4,37,37.3,37.7,38,38.2,38.5,38.8,39.2,39.7,40.1,40.7,41.2,41.8],
  [37.8,38.4,38.7,38.9,39.2,39.5,39.7,40,40.5,40.9,41.4,41.8,42.3,42.9],
  [39.1,39.6,39.9,40.1,40.4,40.7,41,41.3,41.7,42.1,42.6,43,43.5,44.1],
  [40.4,40.8,41.1,41.4,41.6,41.9,42.2,42.5,42.9,43.4,43.8,44.3,44.7,45.3],
  [41.8,42.2,42.4,42.7,42.9,43.2,43.4,43.8,44.2,44.6,45.1,45.5,45.9,46.6],
  [43.4,43.8,44,44.3,44.5,44.8,45,45.3,45.7,46,46.4,46.9,47.3,47.9],
  [45,45.3,45.6,45.8,46.1,46.3,46.6,46.9,47.2,47.5,47.9,48.3,48.7,49.3],
  [46.6,46.9,47.2,47.4,47.6,47.9,48.1,48.4,48.6,48.9,49.3,49.7,50.1,50.7],
  [48.1,48.5,48.7,49,49.2,49.4,49.5,49.8,50,50.3,50.7,51.1,51.5,52.1],
  [49.7,50.1,50.3,50.5,50.7,50.8,50.9,51.2,51.4,51.7,52.1,52.5,52.9,53.5],
  [51.2,51.5,51.8,52,52.2,52.2,52.3,52.5,52.8,53.1,53.5,53.9,54.3,54.9],
  [52.6,52.9,53.2,53.4,53.5,53.5,53.5,53.8,54,54.3,54.7,55.2,55.6,56.2],
  [54,54.3,54.6,54.8,54.8,54.8,54.7,55,55.2,55.5,55.9,56.4,56.8,57.6],
  [55.3,55.6,55.8,56,56,56,55.9,56.2,56.4,56.7,57.2,57.6,58.1,58.9],
  [56.5,56.7,56.9,57.1,57.1,57.1,57.2,57.3,57.5,57.8,58.3,58.8,59.4,60.1],
  [57.8,57.9,58,58.1,58.2,58.3,58.4,58.5,58.6,58.9,59.4,60,60.6,61.4],
  [59.1,59.2,59.2,59.3,59.4,59.4,59.5,59.6,59.8,60,60.6,61.2,61.9,62.6],
  [60.5,60.5,60.5,60.5,60.5,60.5,60.6,60.8,60.9,61.2,61.8,62.3,62.9,63.7],
  [61.9,61.8,61.8,61.7,61.6,61.6,61.6,61.9,62.1,62.4,62.9,63.4,64,64.8],
  [63.1,63,63,62.9,62.8,62.7,62.8,63,63.3,63.6,64,64.5,65.1,65.9],
  [64.3,64.2,64.2,64.1,64,64,64,64.2,64.3,64.7,65.1,65.6,66.1,66.8],
  [65.5,65.5,65.4,65.3,65.2,65.2,65.2,65.3,65.4,65.7,66.2,66.6,67.1,67.7],
  [66.5,66.3,66.2,66.1,66,66,66.1,66.2,66.4,66.7,67.1,67.6,68,68.5],
  [67.5,67.2,66.9,66.8,66.7,66.7,66.8,67,67.2,67.5,67.9,68.3,68.7,69.1],
  [68.4,68,67.6,67.4,67.4,67.4,67.5,67.8,68.1,68.4,68.7,69,69.4,69.7]]
export function dem(x: number, y: number) {
  const fx = Math.max(0, Math.min(DEM[0].length - 1.001, (x - DEM_X0) / DEM_STEP))
  const fy = Math.max(0, Math.min(DEM.length - 1.001, (y - DEM_Y0) / DEM_STEP))
  const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j
  return (DEM[j][i] * (1 - u) + DEM[j][i + 1] * u) * (1 - v) + (DEM[j + 1][i] * (1 - u) + DEM[j + 1][i + 1] * u) * v
}
const demMax = (x0: number, x1: number, y0: number, y1: number) => {
  let m = -Infinity
  for (let x = x0; x <= x1 + 1e-6; x += Math.max(0.5, (x1 - x0) / 6)) for (let y = y0; y <= y1 + 1e-6; y += Math.max(0.5, (y1 - y0) / 4)) m = Math.max(m, dem(x, y))
  return m
}

// ---------------------------------------------------------------------------
// Small geometry kit (also used by the other Yerevan generators).

/** Split a..b into pieces no longer than `max`. */
export const pieces = (a: number, b: number, max = 4) => {
  const n = Math.max(1, Math.ceil(Math.abs(b - a) / max))
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
}
/** A vertical wall on the line a->b (outside to the right), from the ground to `top`, in short pieces. */
export function groundWall(p: Part, a: XY, b: XY, top: (t: number) => number, ground: (x: number, y: number) => number = dem, max = 8) {
  const n: V3 = [b[1] - a[1], a[0] - b[0], 0]
  const l = Math.hypot(n[0], n[1]) || 1
  n[0] /= l; n[1] /= l
  const ts = pieces(0, 1, max / (Math.hypot(b[0] - a[0], b[1] - a[1]) || 1))
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], t1 = ts[i + 1]
    const P = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const A = P(t0), B = P(t1)
    const ga = ground(A[0], A[1]), gb = ground(B[0], B[1]), ta = top(t0), tb = top(t1)
    if (ta <= ga + 1e-3 && tb <= gb + 1e-3) continue
    fquad(p, [A[0], A[1], Math.min(ga, ta)], [B[0], B[1], Math.min(gb, tb)], [B[0], B[1], tb], [A[0], A[1], ta], n)
  }
}
/** A flat polygon (with holes) at height z facing up (or down). */
export function flatPoly(p: Part, ring: XY[], holes: XY[][], z: number, up = true) {
  const n: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of polyTris(ring, holes)) ftri(p, [a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z], n)
}
/** A semicircular-headed outline (s, z): width w centred on s, from zb, springing at zs. */
export function archOutline(s: number, zb: number, w: number, zs: number, seg: number): XY[] {
  const r = w / 2, pts: XY[] = [[s - r, zb], [s + r, zb], [s + r, zs]]
  for (let k = 1; k < seg; k++) { const t = (Math.PI * k) / seg; pts.push([s + r * Math.cos(t), zs + r * Math.sin(t)]) }
  pts.push([s - r, zs])
  return pts
}
const signedArea = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export const pairs = (v: number[]) => v.slice(1).map((x, i) => [v[i], x] as [number, number])
export const ccwRing = (r: XY[]) => (signedArea(r) > 0 ? r : [...r].reverse())

/**
 * A recess cut into a south-facing (normal -y) wall plane y = y0: its
 * outline (x, z) is the hole in the wall; reveals `depth` deep, and the
 * back panel split at `split` (below on `low`, above on `high`).
 */
export function recess(rev: Part, low: Part, high: Part, y0: number, hole: XY[], depth: number, split: number, dirY = -1) {
  const h = ccwRing(hole)
  const cx = h.reduce((s, q) => s + q[0], 0) / h.length
  const P = (q: XY, d: number): V3 => [q[0], y0 - dirY * d, q[1]]
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length]
    // into the hole: for a CCW ring in (x, z), the left normal points inside
    const e: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(e[0], e[1]) || 1
    const nIn: V3 = [-e[1] / L, 0, e[0] / L]
    fquad(rev, P(a, 0), P(b, 0), P(b, depth), P(a, depth), nIn)
  }
  void cx
  const back: V3 = [0, dirY, 0]
  const below = h.filter((q) => q[1] <= split + 1e-6)
  const xs = h.map((q) => q[0]), zs = h.map((q) => q[1])
  const x0 = Math.min(...xs), x1 = Math.max(...xs), zb = Math.min(...zs)
  if (split > zb + 1e-3) fquad(low, P([x0, zb], depth), P([x1, zb], depth), P([x1, split], depth), P([x0, split], depth), back)
  const above = h.filter((q) => q[1] >= split - 1e-6)
  if (above.length >= 3) for (const [a, b, c] of polyTris(above, [])) ftri(high, P(a, depth), P(b, depth), P(c, depth), back)
  void below
}

// ---------------------------------------------------------------------------
// The stair's profile: steps counted up the east side (OSM step_count),
// against y. One riser for all of them.
const PROFILE: XY[] = [
  [-142, 0], [-136, 10], [-135.4, 10], [-118.5, 46], [-112.8, 58], [-105.1, 70], [-67, 150], [-49, 188], [-47.8, 188],
  [-8, 268], [12, 309], [49.5, 384], [51, 391], [69, 427], [73.2, 439], [100, 493], [114, 520], [130, 555], [139, 564], [140.6, 564],
]
const Z0 = 1.0 // the plaza at the foot, over the DEM's lowest point
const RISER = (66.4 - Z0) / 564
const steps = (y: number) => {
  if (y <= PROFILE[0][0]) return 0
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [y0, s0] = PROFILE[i], [y1, s1] = PROFILE[i + 1]
    if (y <= y1) return s0 + ((s1 - s0) * (y - y0)) / (y1 - y0 || 1)
  }
  return PROFILE[PROFILE.length - 1][1]
}
/** First y at which the profile reaches `s` steps. */
const yAt = (s: number) => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [y0, s0] = PROFILE[i], [y1, s1] = PROFILE[i + 1]
    if (s1 >= s && s1 > s0) return y0 + ((y1 - y0) * (s - s0)) / (s1 - s0)
  }
  return PROFILE[PROFILE.length - 1][0]
}
export const levelAt = (y: number) => Z0 + RISER * steps(y)

// ---------------------------------------------------------------------------
// Plan (OSM, in this frame).
const W = -23.6, E = 25.9 // the outer retaining walls
const YS = -142, YN = 140.6
const SPINE0 = -9.8, SPINE1 = 15.6 // the spine's general width
const PLANT = 3.5 // the planted strip beside the spine

/**
 * A spine block: nested bands, widest first, all with their south face on
 * y = face. Each band is flat-topped at the stair level reached at its north
 * end, so the face steps up to the core like a ziggurat and the plan steps
 * in at the north end (OSM's stepped retaining walls).
 */
type Band = { x0: number; x1: number; north: number; top: number }
type Block = { face: number; bands: Band[]; pool?: XY[] }
const band = (x0: number, x1: number, north: number, at = north): Band => ({ x0, x1, north, top: levelAt(at) })
const BLOCKS: Block[] = [
  // the fan-fountain block and the terrace on it (way/412847373)
  { face: -135.5, bands: [band(-10.5, 14.8, -103, -105.1)], pool: [[-3.5, -114], [9.5, -114], [9.5, -107], [-3.5, -107]] },
  { face: -103, bands: [band(-9.5, 15.0, -80.25), band(-7.0, 12.0, -74.55), band(-3.9, 8.8, -68.2)], pool: diamond(2.45, -87.7, 5.2) },
  { face: -47.8, bands: [band(-9.3, 15.4, -21.3), band(-7.0, 12.0, -15.6), band(-3.4, 8.3, -9.35)], pool: diamond(2.45, -29.8, 5.0) },
  { face: 12, bands: [band(-9.9, 15.8, 40.5), band(-7.0, 12.6, 47.65), band(-3.8, 9.4, 52.7)], pool: diamond(2.8, 30.5, 5.3) },
  { face: 74.8, bands: [band(-9.7, 15.6, 99.25), band(-6.5, 12.3, 105.8), band(-3.3, 8.6, 112.35)], pool: diamond(2.65, 91.7, 5.0) },
]
// Chapman's photo from the foot shows each terrace block standing well
// above the stairs beside it, its face a broad, shallow ziggurat: the core
// about 2.5 m over the stair level reached at its north end, the shoulders
// stepping down 1.3 m each. (Retaining walls at the north end take up the
// difference to the stairs.)
for (const b of BLOCKS) if (b.bands.length === 3) {
  const core = b.bands[2].top + 2.5
  b.bands[2].top = core; b.bands[1].top = core - 1.3; b.bands[0].top = core - 2.6
}
function diamond(cx: number, cy: number, r: number): XY[] { return [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]] }

/** The x-extent a block covers at y (its widest band reaching y), or null. */
function blockSpan(b: Block, y: number): [number, number] | null {
  for (const d of b.bands) if (y > b.face && y < d.north) return [d.x0, d.x1]
  return null
}

export function build(detail: boolean) {
  const stone = new Part(), coping = new Part(), win = new Part(), plant = new Part(), pool = new Part(), riser = new Part()
  const K = detail ? 2 : 7 // real steps per modelled step

  // ---- The stair rows: quantised profile, split at every block boundary ----
  const cuts = new Set<number>([YS, YN])
  for (let s = K; s <= 564; s += K) { const y = yAt(s); if (y > YS && y < YN) cuts.add(+y.toFixed(3)) }
  for (const b of BLOCKS) { cuts.add(b.face); for (const d of b.bands) cuts.add(d.north) }
  const ys = [...cuts].sort((a, b) => a - b).filter((y, i, a) => i === 0 || y - a[i - 1] > 0.05)

  // lanes across the stair, west to east; the centre lane is cut by blocks
  type Lane = { x0: number; x1: number; kind: 'stair' | 'plant' | 'centre' }
  const LANES: Lane[] = [
    { x0: W, x1: SPINE0 - PLANT, kind: 'stair' },
    { x0: SPINE0 - PLANT, x1: SPINE0, kind: 'plant' },
    { x0: SPINE0, x1: SPINE1, kind: 'centre' },
    { x0: SPINE1, x1: SPINE1 + PLANT, kind: 'plant' },
    { x0: SPINE1 + PLANT, x1: E, kind: 'stair' },
  ]
  const prevH = LANES.map((l) => (x: number, y: number) => dem(x, y))
  const laneH = LANES.map(() => -Infinity)
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1], ym = (y0 + y1) / 2
    const q = Z0 + RISER * K * Math.floor((steps(ym) + 1e-6) / K)
    // the centre lane's open pieces at this row
    let open: Array<[number, number]> = [[SPINE0, SPINE1]]
    for (const b of BLOCKS) {
      const sp = blockSpan(b, ym)
      if (!sp) continue
      open = open.flatMap(([a, c]) => [[a, Math.min(c, sp[0])], [Math.max(a, sp[1]), c]] as Array<[number, number]>).filter(([a, c]) => c - a > 0.05)
    }
    const spans: Array<{ lane: number; x0: number; x1: number }> = []
    LANES.forEach((l, k) => {
      if (l.kind === 'centre') for (const [a, c] of open) spans.push({ lane: k, x0: a, x1: c })
      else spans.push({ lane: k, x0: l.x0, x1: l.x1 })
    })
    // each lane's height: the profile, at least 0.3 m over the ground, never going down
    const h = LANES.map((l, k) => {
      const v = Math.max(q, demMax(l.x0, l.x1, y0 - 2, y1 + 2) + (y0 < -115 ? 0.9 : 0.4), laneH[k])
      return v
    })
    for (const s of spans) {
      const z = h[s.lane], kind = LANES[s.lane].kind
      const top = kind === 'plant' && y0 >= -103 ? plant : stone // no planting beside the fan-fountain block
      // tread
      for (const xs of [[s.x0, s.x1]]) for (let j = 0; j < xs.length - 1; j++)
        fquad(top, [xs[j], y0, z], [xs[j + 1], y0, z], [xs[j + 1], y1, z], [xs[j], y1, z], [0, 0, 1])
      // riser up from the row before (or from the ground at the foot)
      const zp = laneH[s.lane]
      const xs = Number.isFinite(zp) ? [s.x0, s.x1] : pieces(s.x0, s.x1, 4)
      for (let j = 0; j < xs.length - 1; j++) {
        const za = Number.isFinite(zp) ? zp : dem(xs[j], y0), zb = Number.isFinite(zp) ? zp : dem(xs[j + 1], y0)
        if (z - Math.min(za, zb) > 0.01) fquad(riser, [xs[j], y0, za], [xs[j + 1], y0, zb], [xs[j + 1], y0, z], [xs[j], y0, z], [0, -1, 0])
      }
    }
    // side faces between neighbouring spans at different heights
    spans.sort((a, b) => a.x0 - b.x0)
    for (let k = 0; k < spans.length - 1; k++) {
      const a = spans[k], b = spans[k + 1]
      if (Math.abs(a.x1 - b.x0) > 0.01) continue
      const za = h[a.lane], zb = h[b.lane]
      if (Math.abs(za - zb) < 0.01) continue
      const x = a.x1, lo = Math.min(za, zb), hi = Math.max(za, zb)
      fquad(stone, [x, y0, lo], [x, y1, lo], [x, y1, hi], [x, y0, hi], [za < zb ? -1 : 1, 0, 0])
    }
    LANES.forEach((_, k) => { if (spans.some((s) => s.lane === k)) laneH[k] = h[k] })
    void prevH
  }
  if (process.env.DBG) console.log('stairs', stone.triangles, plant.triangles, ys.length)
  // the top terrace's north edge, down to the ground
  groundWall(stone, [E, YN], [W, YN], () => laneH[0])

  // ---- The outer parapets: sloping walls along both edges ----
  const parTop = (y: number) => Math.max(levelAt(y), demMax(W, E, y - 2, y + 2) + 0.3) + 1.1
  for (const [x, out] of [[W, -1], [E, 1]] as const) {
    const t = 0.6, xi = x, xo = x + out * t
    const yy = pieces(YS + 6, YN, 8)
    for (let j = 0; j < yy.length - 1; j++) {
      const a = yy[j], b = yy[j + 1], za = parTop(a), zb = parTop(b)
      // outside face, down to the ground
      const A: XY = out < 0 ? [xo, b] : [xo, a], B: XY = out < 0 ? [xo, a] : [xo, b]
      groundWall(stone, A, B, (tt) => (out < 0 ? zb + (za - zb) * tt : za + (zb - za) * tt))
      // inside face, from the treads up
      const ia = levelAt(a) - 1.5, ib = levelAt(b) - 1.5
      fquad(stone, [xi, a, ia], [xi, b, ib], [xi, b, zb], [xi, a, za], [-out, 0, 0])
      // coping
      fquad(coping, [xo, a, za], [xi, a, za], [xi, b, zb], [xo, b, zb], [0, 0, 1])
    }
    // the parapets' south ends
    const a = yy[0], za = parTop(a)
    groundWall(stone, out < 0 ? [xi, a] : [xo, a], out < 0 ? [xo, a] : [xi, a], () => za)
    const n = yy[yy.length - 1], zn = parTop(n)
    groundWall(stone, out < 0 ? [xo, n] : [xi, n], out < 0 ? [xi, n] : [xo, n], () => zn)
  }

  if (process.env.DBG) console.log('parapets', stone.triangles)
  // ---- The spine blocks ----
  const seg = detail ? 16 : 8
  for (const [bi, b] of BLOCKS.entries()) {
    const yF = b.face, zf = levelAt(yF) // the landing in front of the face
    const B = b.bands, core = B[B.length - 1], outer = B[0]
    // each band's walls: on the band outside it where that one reaches, else down to the ground
    B.forEach((d, i) => {
      const below = i > 0 ? B[i - 1] : null
      for (const [x, side] of [[d.x0, -1], [d.x1, 1]] as const) {
        const a: XY = [x, yF], c: XY = [x, d.north], m: XY = [x, below ? below.north : yF]
        const seg2 = (p: XY, q: XY, fromBand: boolean) => {
          if (q[1] - p[1] < 0.01) return
          const A = side > 0 ? p : q, C = side > 0 ? q : p
          if (fromBand && below) {
            const zb = below.top
            for (const [y0, y1] of pairs(pieces(A[1] < C[1] ? A[1] : C[1], A[1] < C[1] ? C[1] : A[1], 8)))
              fquad(stone, [x, y0, zb], [x, y1, zb], [x, y1, d.top], [x, y0, d.top], [side, 0, 0])
          } else groundWall(stone, A, C, () => d.top)
        }
        seg2(a, m, true)
        seg2(m, c, false)
      }
      // north wall, down to the ground
      groundWall(stone, [d.x1, d.north], [d.x0, d.north], () => d.top)
      // the band's top: the strips the next band up leaves, or the whole core with its pool
      const inner = B[i + 1]
      if (!inner) flatPoly(stone, [[d.x0, yF], [d.x1, yF], [d.x1, d.north], [d.x0, d.north]], b.pool ? [b.pool] : [], d.top)
      else for (const [x0, x1] of [[d.x0, inner.x0], [inner.x1, d.x1]])
        fquad(stone, [x0, yF, d.top], [x1, yF, d.top], [x1, d.north, d.top], [x0, d.north, d.top], [0, 0, 1])
      // a pale coping along the band's front and outer edges
      const c = 0.5, h = 0.25
      const runs: Array<[number, number]> = inner ? [[d.x0, inner.x0], [inner.x1, d.x1]] : [[d.x0, d.x1]]
      for (const [p0, p1, n] of runs.map(([a, e]) => [[a, yF], [e, yF], [0, -1, 0]]) as Array<[XY, XY, V3]>) {
        fquad(coping, [p0[0], p0[1] - 0.15, d.top + h], [p1[0], p1[1] - 0.15, d.top + h], [p1[0], p1[1] + c, d.top + h], [p0[0], p0[1] + c, d.top + h], [0, 0, 1])
        fquad(coping, [p0[0], p0[1] - 0.15, d.top - 0.35], [p1[0], p1[1] - 0.15, d.top - 0.35], [p1[0], p1[1] - 0.15, d.top + h], [p0[0], p0[1] - 0.15, d.top + h], n)
        fquad(coping, [p0[0], p0[1] + c, d.top], [p1[0], p1[1] + c, d.top], [p1[0], p1[1] + c, d.top + h], [p0[0], p0[1] + c, d.top + h], [0, 1, 0])
      }
    })
    // the sunken stepped pool on the core's top: three steps down, then the basin
    if (b.pool) {
      const T = core.top
      const cx = b.pool.reduce((s, q) => s + q[0], 0) / 4, cy = b.pool.reduce((s, q) => s + q[1], 0) / 4
      let ringP = ccwRing(b.pool), z = T
      const nSteps = 3, inset = bi === 0 ? 0.7 : 0.8
      for (let k = 0; k <= nSteps; k++) {
        const zn = z - 0.35
        for (let i = 0; i < ringP.length; i++) {
          const a = ringP[i], c = ringP[(i + 1) % ringP.length]
          const m: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], nl = Math.hypot(cx - m[0], cy - m[1])
          fquad(stone, [a[0], a[1], zn], [c[0], c[1], zn], [c[0], c[1], z], [a[0], a[1], z], [(cx - m[0]) / nl, (cy - m[1]) / nl, 0])
        }
        if (k === nSteps) { flatPoly(pool, ringP, [], zn); break }
        const nextR = ringP.map(([x, y]) => { const dx = x - cx, dy = y - cy, dd = Math.hypot(dx, dy); return [cx + dx * (1 - inset / dd), cy + dy * (1 - inset / dd)] as XY })
        for (let i = 0; i < ringP.length; i++) {
          const j = (i + 1) % ringP.length
          fquad(k === nSteps - 1 ? pool : stone, [ringP[i][0], ringP[i][1], zn], [ringP[j][0], ringP[j][1], zn], [nextR[j][0], nextR[j][1], zn], [nextR[i][0], nextR[i][1], zn], [0, 0, 1])
        }
        ringP = nextR; z = zn
      }
    }

    // the south face: one stepped outline, ground to each band's top, pierced
    const holes: XY[][] = []
    const cxF = (core.x0 + core.x1) / 2
    if (bi === 0) {
      // the fan-fountain wall: three staggered rows of shell niches
      const rows = [{ n: 4, r: 1.95 }, { n: 5, r: 1.95 }, { n: 6, r: 1.95 }]
      const sg = detail ? seg : 6
      let z = zf + 0.35
      for (const row of rows) {
        const pitch = 2 * row.r + 0.2
        for (let k = 0; k < row.n; k++) {
          const s = cxF + (k - (row.n - 1) / 2) * pitch
          shell(stone, coping, yF, s, z, row.r, row.r * 0.7, sg, detail)
          const hole: XY[] = []
          for (let t = 0; t <= sg; t++) { const a = (Math.PI * t) / sg; hole.push([s + row.r * Math.cos(a), z + row.r * Math.sin(a)]) }
          holes.push(hole)
        }
        z += row.r + 0.12
      }
      for (const s of [outer.x0 + 1.7, outer.x1 - 1.7]) {
        const d: XY[] = [[s - 0.9, zf + 0.3], [s + 0.9, zf + 0.3], [s + 0.9, zf + 3.0], [s - 0.9, zf + 3.0]]
        holes.push(d); recess(stone, win, win, yF, d, 0.8, zf + 0.3)
      }
    } else {
      // the big arched window over the sunburst fountain, in the core
      const big = archOutline(cxF, zf + 0.6, 9.0, zf + 4.4, seg)
      holes.push(big); recess(stone, coping, win, yF, big, 2.0, zf + 4.4)
      if (detail) sunburst(coping, yF + 2.0 - 0.02, cxF, zf + 0.6, zf + 4.4, 4.3)
      archRing(coping, yF, cxF, zf + 4.4, 4.5, 0.6, 0.3, seg)
      // the arched door in the west shoulder, the narrow arched window in the east one
      const mid = B[1]
      const sd = (mid.x0 + core.x0) / 2, se = (core.x1 + mid.x1) / 2
      const door = archOutline(sd, zf, 2.4, zf + 3.6, seg >> 1)
      holes.push(door); recess(stone, win, win, yF, door, 1.2, zf)
      const nar = archOutline(se, zf + 1.4, 1.5, zf + 5.0, seg >> 1)
      holes.push(nar); recess(stone, win, win, yF, nar, 0.8, zf + 1.4)
    }
    const bottom = pieces(outer.x0, outer.x1, 8).map((x) => [x, Math.min(dem(x, yF), zf)] as XY)
    const rightUp: XY[] = [], leftDown: XY[] = []
    B.forEach((d, i) => {
      const nx = B[i + 1]
      rightUp.push([d.x1, d.top]); if (nx) rightUp.push([nx.x1, d.top])
      leftDown.unshift([d.x0, d.top]); if (nx) leftDown.unshift([nx.x0, d.top])
    })
    const outline: XY[] = [...bottom, ...rightUp, ...leftDown]
    for (const [a, c, d] of polyTris(outline, holes)) ftri(stone, [a[0], yF, a[1]], [c[0], yF, c[1]], [d[0], yF, d[1]], [0, -1, 0])
  }

  // y = 0 on the lowest ground (Part stores glTF: index 1 is up)
  const all = [stone, coping, win, plant, pool, riser]
  let lo = Infinity
  for (const p of all) for (let i = 1; i < p.pos.length; i += 3) lo = Math.min(lo, p.pos[i])
  for (const p of all) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= lo
  return { stone, coping, win, plant, pool, riser }
}

/** A shell niche: a quarter-ellipsoid recess behind a semicircular opening in the wall y = y0 (facing -y), with its shelf. */
function shell(p: Part, spout: Part, y0: number, s: number, z: number, r: number, depth: number, seg: number, detail: boolean) {
  const rows = detail ? 5 : 2
  const P = (t: number, f: number): V3 => [s + r * Math.cos(t) * Math.cos(f), y0 + depth * Math.sin(f), z + r * Math.sin(t) * Math.cos(f)]
  for (let i = 0; i < seg; i++) for (let j = 0; j < rows; j++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg, f0 = (Math.PI / 2) * (j / rows), f1 = (Math.PI / 2) * ((j + 1) / rows)
    const a = P(t0, f0), b = P(t1, f0), c = P(t1, f1), d = P(t0, f1)
    // the inside of the dome faces back out of the wall (towards -y) and to its axis
    const m: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]
    const n: V3 = [s - m[0], (y0 - 1) - m[1], z - m[2]]
    const l = Math.hypot(...n); n[0] /= l; n[1] /= l; n[2] /= l
    if (j === rows - 1) ftri(p, a, b, c, n)
    else fquad(p, a, b, c, d, n)
  }
  // the shelf the shell stands on
  const shelf: V3[] = []
  for (let i = 0; i <= seg; i++) { const f = (Math.PI * i) / seg; shelf.push([s + r * Math.cos(f), y0 + depth * Math.sin(f), z]) }
  for (let i = 1; i < shelf.length - 1; i++) ftri(p, shelf[0], shelf[i], shelf[i + 1], [0, 0, 1])
  if (detail) {
    // the stone spout jutting from the shell's middle
    const cz = z + r * 0.38, ry = 0.32, n = 10
    const ring = (y: number) => Array.from({ length: n }, (_, k) => [s + ry * Math.cos((2 * Math.PI * k) / n), y, cz + ry * Math.sin((2 * Math.PI * k) / n)] as V3)
    const A = ring(y0 + depth * 0.6), B = ring(y0 - 0.5)
    for (let k = 0; k < n; k++) {
      const k1 = (k + 1) % n, a = (2 * Math.PI * (k + 0.5)) / n
      fquad(spout, A[k], A[k1], B[k1], B[k], [Math.cos(a), 0, Math.sin(a)])
    }
    for (let k = 1; k < n - 1; k++) ftri(spout, B[0], B[k], B[k + 1], [0, -1, 0])
  }
}

/** A semicircular stone ring standing proud of the wall y = y0 round an arch springing at zs. */
function archRing(p: Part, y0: number, s: number, zs: number, r: number, w: number, d: number, seg: number) {
  const P = (t: number, rr: number, dd: number): V3 => [s + rr * Math.cos(t), y0 - dd, zs + rr * Math.sin(t)]
  for (let k = 0; k < seg; k++) {
    const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg, m = (a + b) / 2
    fquad(p, P(a, r, d), P(b, r, d), P(b, r + w, d), P(a, r + w, d), [0, -1, 0])
    fquad(p, P(a, r + w, 0), P(b, r + w, 0), P(b, r + w, d), P(a, r + w, d), [Math.cos(m), 0, Math.sin(m)])
    fquad(p, P(a, r, 0), P(b, r, 0), P(b, r, d), P(a, r, d), [-Math.cos(m), 0, -Math.sin(m)])
  }
}

/** The sunburst under an arched window: radiating stone ribs on the recess's back wall. */
function sunburst(p: Part, y: number, s: number, zb: number, zs: number, r: number) {
  const n = 11
  for (let k = 0; k < n; k++) {
    const t = Math.PI + (Math.PI * (k + 0.5)) / n // pointing down from the springing line's centre
    const len = Math.min(r * 0.95, (zs - zb - 0.2) / Math.max(0.2, -Math.sin(t)))
    const ux = Math.cos(t), uz = Math.sin(t), wx = -uz * 0.14, wz = ux * 0.14
    const a: V3 = [s + ux * 0.6 + wx, y, zs + uz * 0.6 + wz], b: V3 = [s + ux * len + wx * 2.2, y, zs + uz * len + wz * 2.2]
    const c: V3 = [s + ux * len - wx * 2.2, y, zs + uz * len - wz * 2.2], d: V3 = [s + ux * 0.6 - wx, y, zs + uz * 0.6 - wz]
    const o = (q: V3): V3 => [q[0], q[1] - 0.25, q[2]]
    fquad(p, o(a), o(b), o(c), o(d), [0, -1, 0])
    fquad(p, a, b, o(b), o(a), [wx, 0, wz])
    fquad(p, d, c, o(c), o(d), [-wx, 0, -wz])
    fquad(p, b, c, o(c), o(b), [ux, 0, uz])
  }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (q: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.85)
    return [
      { part: p.stone, material: { ...finish('cascade-travertine', 0xe9e1d6), floodlight: lit } },
      { part: p.coping, material: { ...finish('cascade-coping', 0xf4eee5), floodlight: lit } },
      { part: p.win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
      { part: p.plant, material: finish('cascade-planting', 0x7f8a5c) },
      { part: p.pool, material: finish('cascade-pool', 0x8f9b98) },
      { part: p.riser, material: { ...finish('cascade-riser', 0xcdc4b8), floodlight: lit } },
    ]
  }
  const meta = { bearing: 3.5, osm: 'way/83688503' }
  await writeModel('yerevan-cascade.glb', 'The Cascade', make(false), meta, 6500, 250 * 1024)
  await writeModel('yerevan-cascade.detail.glb', 'The Cascade', make(true), meta, 40000, 1536 * 1024)
}
