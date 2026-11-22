/**
 * Charles A. Dana Discovery Center, Central Park, on the north shore of the
 * Harlem Meer (Buttrick White & Burtis, 1993, in the manner of Vaux and
 * Mould's park buildings) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-dana-discovery-center.ts
 *
 * Built with the house helpers in nyc-cp-dairy.ts.
 *
 * Frame (mesh.ts map frame): x east, y north, z up, metres, turned to the
 * placement's bearing 12.2° (the outline's long walls), so +y is the main
 * ridge, toward Central Park North, and −y faces the Meer. Anchor: the
 * centroid of OSM way/278366155 (building=yes, height=17.3), which this
 * model replaces.
 *
 * Evidence
 * - OSM (ODbL): the outline way/278366155, a cross: the main body 11.2 m by
 *   23.6 m along y, the transept 18.7 m by 8.9 m along x. height=17.3 is to
 *   the cupola's finial (lidar agrees).
 * - USGS 3DEP lidar NY_NewYorkCity (2017 flight), 0.5 m crop read in this
 *   frame (tools/lidar_frame.py): the ground 0–1 m (rising to the north);
 *   the main ridge 11.3–11.5 m along x ≈ 0 for the whole length; the main
 *   roof's slopes falling 1 m per metre (45°) to 5.9–6.2 m at x ±6; the
 *   transept ridge 9.9–10.3 m along y ≈ +0.5, its eaves 6.2–6.8 m; the
 *   cupola 15.8–16.6 m at the crossing.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-dana-discovery-center/photos):
 *   CastIronSeasoner, "Charles A. Dana Discovery Center,
 *     Harlem Meer, 2025.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Charles_A._Dana_Discovery_Center,_Harlem_Meer,_2025.jpg
 *     (from across the Meer: the south gable's green arched frame and red
 *     bargeboards, the long slate roof, red-brick walls, the cupola);
 *   M.M.D.A., "MMDA-Photos - 2005-04-15 - Dana Center East.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:MMDA-Photos_-_2005-04-15_-_Dana_Center_East.jpg
 *     (the east entrance gable: the great green arch on posts over the
 *     doors, a fanlight, round windows, the cupola's louvres, red frieze,
 *     slate pyramid and ball finial);
 *   M.M.D.A., "MMDA-Photos - 2005-04-15 - Dana Discovery Center North
 *     Side.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:MMDA-Photos_-_2005-04-15_-_Dana_Discovery_Center_North_Side.jpg
 *     (the north gable: the arched frame with a brick pier up its middle,
 *     doors either side).
 * - Estimated from the photos against the lidar heights: the walls' brick
 *   to 5.6 m with the eaves at 5.9 m; the gables' arched frames springing
 *   at 3.4 m, 0.72 of the gable's width; the cupola 1.9 m square.
 *
 * Simplified: the slate's colour bands, the louvres' slats and the stick
 * work in the gables are left out; the chimney seen in one view is left out
 * (the lidar shows nothing over the roof but the cupola).
 *
 * Doubts: the west gable is drawn like the east one (no licensed photo of
 * it); the arch frames' exact spans are estimated.
 */
import { Part, type V3 } from './mesh'
import { finishModel, spire } from './nyc-570-lexington'
import { barge, box, house, opening, poly, type Map2, type P2 } from './nyc-cp-dairy'

const brick = new Part(), slate = new Part(), green = new Part(), dgreen = new Part(), red = new Part(), win = new Part()
const EAVE = 5.9, RIDGE = 11.4, TR = 10.1
const M = { u0: -12.0, u1: 11.6, v0: -5.6, v1: 5.6 } // main body, ridge along y
const T = { u0: -9.3, u1: 9.4, v0: -3.6, v1: 5.3 } // transept, ridge along x

house({ wall: brick, gable: dgreen, roof: slate, axis: 'y', ...M, eave: EAVE, ridge: RIDGE, oh: 0.55, ohEnd: 0.6, t: 0.3 })
house({ wall: brick, gable: dgreen, roof: slate, axis: 'x', ...T, eave: EAVE, ridge: TR, oh: 0.55, ohEnd: 0.6, t: 0.3 })

/**
 * A gable end's front: the great arched frame in pale green, the recess
 * inside it dark green with a fanlight and a pair of doors, and red
 * bargeboards under the rakes. (cx, cy) on the wall line, (nx, ny) out.
 */
function gableFront(cx: number, cy: number, nx: number, ny: number, half: number, ridge: number, axis: 'x' | 'y', u: number) {
  const r = 0.72 * half, spring = 3.4
  // the gable's triangle in dark green, set just proud of the wall
  const at: Map2 = (t, z) => [cx - ny * t, cy + nx * t, z]
  poly(dgreen, [[-half, EAVE], [half, EAVE], [0, ridge - 0.05]], at, [nx, ny, 0], 0.05)
  opening(green, cx, cy, nx, ny, 2 * r + 1.0, 0, spring + r + 0.5, r + 0.5, 0.1, 6)
  opening(dgreen, cx, cy, nx, ny, 2 * r, 0, spring + r, r, 0.16, 6)
  opening(win, cx, cy, nx, ny, 2.6, spring + 0.4, spring + 1.7, 1.3, 0.2, 5)
  opening(green, cx, cy, nx, ny, 2.0, 0, 2.7, 0, 0.2)
  opening(win, cx, cy, nx, ny, 2.0, 2.75, 3.15, 0, 0.2)
  const vc = axis === 'y' ? cx : cy
  barge(red, axis, u, vc - half, vc + half, EAVE, ridge, 0.6, 0.38, 0)
}
// gable ends: the main body's north and south, the transept's east and west
const vm = (M.v0 + M.v1) / 2, vt = (T.v0 + T.v1) / 2
gableFront(vm, M.u1, 0, 1, (M.v1 - M.v0) / 2, RIDGE, 'y', M.u1 + 0.62)
gableFront(vm, M.u0, 0, -1, (M.v1 - M.v0) / 2, RIDGE, 'y', M.u0 - 0.62)
gableFront(T.u1, vt, 1, 0, (T.v1 - T.v0) / 2, TR, 'x', T.u1 + 0.62)
gableFront(T.u0, vt, -1, 0, (T.v1 - T.v0) / 2, TR, 'x', T.u0 - 0.62)

// round-arched windows in pale green frames on the long walls
const lite = (cx: number, cy: number, nx: number, ny: number) => {
  opening(green, cx, cy, nx, ny, 1.5, 1.0, 4.0, 0.75, 0.04, 5)
  opening(win, cx, cy, nx, ny, 1.1, 1.2, 3.8, 0.55, 0.08, 5)
}
for (const [x, nx] of [[M.v1, 1], [M.v0, -1]] as P2[]) for (const y of [-8.4, 8.5]) lite(x, y, nx, 0)
for (const [y, ny] of [[T.v1, 1], [T.v0, -1]] as P2[]) for (const x of [-7.4, 7.5]) lite(x, y, 0, ny)

// the cupola at the crossing: a slate-clad base on the ridges, a pale
// green louvred stage with dark louvre panels, a red frieze, a slate
// pyramid and a ball finial
const CX = 0, CY = vt, H = 0.95
box(slate, CX - H, CY - H, CX + H, CY + H, 9.6, 12.4)
box(green, CX - H, CY - H, CX + H, CY + H, 12.4, 13.8)
for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as P2[]) {
  for (const s of [-0.38, 0.38]) opening(dgreen, CX + nx * H - ny * s, CY + ny * H + nx * s, nx, ny, 0.55, 12.6, 13.6, 0, 0.04)
}
box(red, CX - H - 0.12, CY - H - 0.12, CX + H + 0.12, CY + H + 0.12, 13.8, 14.15)
const R = H + 0.3
spire(slate, [[CX - R, CY - R], [CX + R, CY - R], [CX + R, CY + R], [CX - R, CY + R]], 14.15, [CX, CY, 16.6] as V3)
box(slate, CX - R, CY - R, CX + R, CY + R, 14.0, 14.15)
for (const [z0, z1, r] of [[16.5, 16.75, 0.08], [16.75, 17.25, 0.25]] as [number, number, number][]) box(green, CX - r, CY - r, CX + r, CY + r, z0, z1)

finishModel('Charles A. Dana Discovery Center', 'nyc-dana-discovery-center', [
  { part: brick, material: { name: 'brick', color: 0xb26c5a, roughness: 0.9 } },
  { part: slate, material: { name: 'roof', color: 0x8f9499, roughness: 0.8 } },
  { part: green, material: { name: 'trim-green', color: 0x8fb09f, roughness: 0.7 } },
  { part: dgreen, material: { name: 'gable-green', color: 0x5f7d6f, roughness: 0.8 } },
  { part: red, material: { name: 'trim-red', color: 0xb5504a, roughness: 0.7 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.4 } },
], { bearing: 12.2, osm: 'way/278366155', height: 17.25 }, 5000)
