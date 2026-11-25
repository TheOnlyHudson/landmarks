/**
 * Tavern on the Green, Central Park West at 67th Street (Jacob Wrey Mould
 * and Calvert Vaux, 1870, the sheepfold for the Sheep Meadow flock; a
 * restaurant since 1934, restored and reopened 2014) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-tavern-on-the-green.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 17.9° (the outline's main walls run at 17.9° and 107.9°), so +y
 * is NNE and +x is ESE. Anchor: the centroid of OSM way/265347579
 * (building=yes), the main outer of relation/7459068 (Tavern on the Green,
 * height=10.6). The model replaces way/265347579 and way/362647331
 * (building=yes, the rounded forecourt on the NNE side, where the lidar
 * shows open ground and the photos the entrance canopy); the relation's
 * third outer, way/362647332, is the beer-garden courtyard and not a building.
 *
 * Plan (OSM, model frame), drawn as: the sheepfold's big block to the WSW
 * (x −21.4..−6.3, y −16..12); a low central range (x −1.6..5.4, y −9..5);
 * the range running SSE on a diagonal and then east (to x 25, y −28..−21);
 * the north lobe (x −5.5..11, y 5..24) with the entrance front; the NE range
 * (x 9.5..32, y 15.5..23.4). The courtyard between them stays open.
 *
 * Heights (y = 0 is the ground, ~5.4 m on the lidar's datum):
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 1 m grid read in this
 *   frame: the big hipped roof's peak +11.7 (OSM height=10.6 is taken as
 *   its ridge), its lower slopes and flat parts ~+4.9; the central range
 *   flat at +3.8; the diagonal and east range ridges ~+6.9; the north
 *   lobe's ridge ~+7.0; the NE range ridge ~+6.6.
 * - Estimated from the photos: brick walls 4.0 m to the eaves, the gable
 *   fronts on the entrance side, chimneys, the red entrance vestibule
 *   (3.5 m wide, 2.9 m) under its curved hood (6.4 m wide, 4.7 m deep,
 *   rising to 4.9 m), the red awning gallery along the NE range's front
 *   (19 m long, 3.2 m wide, vault to 3.8 m; its position is estimated from
 *   the photos, not mapped), window sizes. The middle gable's ridge (8.0 m)
 *   stands 1 m over the lidar's lobe ridge to show it as the photo does.
 * - Published (Wikipedia "Tavern on the Green"; NYC LPC 1974 scenic
 *   landmark, Central Park): Victorian Gothic, polychrome brick, slate roofs.
 *
 * Photos:
 * - central park4, "Tavern on the Green Central Park", Flickr, CC BY 2.0,
 *   https://www.flickr.com/photos/189150477@N03/50068925283
 *   (the entrance front from the NNE: three gables, slate roofs, the
 *   red canopy, a tall chimney on the middle gable)
 * - Colleen Sturtevant, "Central Park during the New York City Snow
 *   February 2026 Featuring Tavern on the Green.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_during_the_New_York_City_Snow_February_2026_Featuring_Tavern_on_the_Green.jpg
 *   (the long slate roofs, a cross gable with paired chimneys, the red vestibule)
 * - Jim.henderson, "Tavern on the Green cloudy jeh.JPG", public domain,
 *   https://commons.wikimedia.org/wiki/File:Tavern_on_the_Green_cloudy_jeh.JPG
 *   (red awning over the forecourt, slate roof and dormer behind)
 * - Larry from Charlottetown, "Tavern on the Green - Central Park (5640746624).jpg",
 *   CC BY 2.0, https://commons.wikimedia.org/wiki/File:Tavern_on_the_Green_-_Central_Park_(5640746624).jpg
 *   (the courtyard in 2011: long slate roofs and a gabled dormer)
 *
 * Doubts: the courtyard and park-side faces are seen only in part; the
 * diagonal range, the sheepfold block's roof shape and all window positions
 * are drawn from the lidar and the plan, not from a photo of each face.
 * The polychrome bands of the brick are left out (one brick colour). The
 * forecourt way/362647331 is replaced on the lidar's evidence that nothing
 * stands there but the canopy; if a pavilion was built there after 2017,
 * it is missing.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { turnSince } from './nyc-columbus-monument'
import { board, opening, slabUp, box, house, barge, archPts, type P2 } from './nyc-cp-dairy'

const brick = new Part(), slate = new Part(), trim = new Part(), red = new Part(), win = new Part(), stone = new Part()
const EAVE = 4.0

/** A hipped roof over x0..x1 × y0..y1 from the eave ze to the ridge zr, overhanging `oh`. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, oh = 0.5) {
  const k = (zr - ze) / (Math.min(x1 - x0, y1 - y0) / 2)
  x0 -= oh; y0 -= oh; x1 += oh; y1 += oh; ze -= oh * k
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, alongY = y1 - y0 >= x1 - x0
  const h = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3 = alongY ? [cx, y0 + h, zr] : [x0 + h, cy, zr], r1: V3 = alongY ? [cx, y1 - h, zr] : [x1 - h, cy, zr]
  const A: V3 = [x0, y0, ze], B: V3 = [x1, y0, ze], C: V3 = [x1, y1, ze], D: V3 = [x0, y1, ze]
  if (alongY) { p.quad(B, C, r1, r0); p.quad(D, A, r0, r1); p.tri(A, B, r0); p.tri(C, D, r1) }
  else { p.quad(A, B, r1, r0); p.quad(C, D, r0, r1); p.tri(B, C, r1); p.tri(D, A, r0) }
  p.quad(A, D, C, B)
}
/** A gabled range from a to b (centre line), `w` wide, turned to its own direction. */
function range(a: P2, b: P2, w: number, ridge: number, ends: [boolean, boolean] = [true, true]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
  const marks = [brick, slate, trim].map((p) => p.pos.length)
  house({ wall: brick, roof: slate, axis: 'x', u0: cx - L / 2, u1: cx + L / 2, v0: cy - w / 2, v1: cy + w / 2, eave: EAVE, ridge, oh: 0.5, ohEnd: [ends[0] ? 0.4 : 0, ends[1] ? 0.4 : 0] })
  if (ends[0]) barge(trim, 'x', cx - L / 2 - 0.4, cy - w / 2, cy + w / 2, EAVE, ridge, 0.5, 0.3, -0.02)
  if (ends[1]) barge(trim, 'x', cx + L / 2 + 0.4, cy - w / 2, cy + w / 2, EAVE, ridge, 0.5, 0.3, 0.02)
  ;[brick, slate, trim].forEach((p, i) => turnSince(p, marks[i], ang, cx, cy))
}
/** Round-headed windows along a wall a→b with outward normal on the right of a→b (or left if `flip`). */
function windows(a: P2, b: P2, n: number, flip = false, w = 1.1, z0 = 1.0, z1 = 3.1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = flip ? -uy : uy, ny = flip ? ux : -ux
  for (let k = 0; k < n; k++) {
    const s = (L / n) * (k + 0.5), cx = a[0] + ux * s, cy = a[1] + uy * s
    opening(trim, cx, cy, nx, ny, w + 0.35, z0 - 0.12, z1 + 0.18, (w + 0.35) / 2, 0.03)
    opening(win, cx, cy, nx, ny, w, z0, z1, w / 2, 0.06)
  }
}
const rect = (x0: number, y0: number, x1: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// --- The sheepfold block to the WSW: brick walls and the big hipped slate roof. ---
slabUp(stone, rect(-21.5, -16.1, -6.2, 12.1), 0, 0.6)
slabUp(brick, rect(-21.4, -16.0, -6.3, 12.0), 0.6, EAVE)
hip(slate, -21.4, -16.0, -6.3, 12.0, EAVE, 11.2)
windows([-21.4, 10.5], [-21.4, -14.5], 6)
windows([-19.5, -16.0], [-8.0, -16.0], 3)
windows([-8.0, 12.0], [-19.5, 12.0], 3)

// --- The low central range, flat-roofed at +3.8. ---
slabUp(brick, rect(-1.6, -9.3, 5.4, 5.4), 0, 3.6)
slabUp(slate, rect(-1.8, -9.5, 5.6, 5.6), 3.6, 3.8)
windows([5.4, -8.0], [5.4, 4.0], 3, true, 1.4, 0.6, 3.0)

// --- The diagonal range and the east range on the SSE side of the courtyard. ---
range([-4.0, -12.7], [8.3, -24.6], 7.9, 6.9, [false, false])
range([8.3, -24.6], [25.0, -24.6], 7.1, 6.9, [false, true])
slabUp(brick, [[-6.1, -16.0], [6.9, -28.2], [9.8, -21.1], [-1.6, -9.3]], 0, EAVE - 0.05) // fills the joint
slabUp(slate, [[-6.1, -16.0], [6.9, -28.2], [9.8, -21.1], [-1.6, -9.3]], EAVE - 0.05, EAVE + 0.15)
windows([9.8, -21.1], [24.7, -20.9], 4, true)
windows([25.2, -28.1], [9.0, -28.2], 4, true)
windows([-1.6, -9.3], [8.5, -19.8], 3, true)

// --- The north lobe with the entrance front: walls on its outline, a hipped
// roof, and three gables facing NNE (a broad middle one with its chimney). ---
const lobe: P2[] = [[-0.39, 5.12], [9.5, 15.25], [11.15, 22.86], [9.28, 23.89], [9.06, 22.45], [6.13, 24.03], [4.23, 22.57], [1.75, 23.76], [-0.55, 23.74], [-3.15, 23.11], [-4.85, 20.82], [-5.53, 18.14], [-5.07, 15.62], [-3.42, 13.48], [-6.45, 11.35], [-5.0, 8.0]]
slabUp(brick, lobe, 0, EAVE)
slabUp(slate, lobe, EAVE, EAVE + 0.2) // flat leads where the hipped roof doesn't reach
hip(slate, -4.6, 11.5, 10.0, 22.6, EAVE, 7.0, 0.6)
for (const [v0, v1, rg] of [[-1.45, 4.95, 8.0], [-5.6, -1.7, 6.7], [5.2, 9.6, 6.7]] as [number, number, number][]) {
  house({ wall: brick, roof: slate, axis: 'y', u0: rg > 7.5 ? 14.0 : 17.0, u1: 23.8, v0, v1, eave: EAVE, ridge: rg, oh: 0.45, ohEnd: [0, 0.4] })
  barge(trim, 'y', 24.2, v0, v1, EAVE, rg, 0.45, 0.3, 0.02)
  const c = (v0 + v1) / 2
  opening(trim, c, 23.8, 0, 1, (v1 - v0) * 0.45, EAVE + 0.3, EAVE + 0.3 + (v1 - v0) * 0.35, (v1 - v0) * 0.225, 0.03)
  opening(win, c, 23.8, 0, 1, (v1 - v0) * 0.33, EAVE + 0.45, EAVE + 0.2 + (v1 - v0) * 0.35, (v1 - v0) * 0.165, 0.06)
}
for (const x of [-3.65, 7.4]) { opening(trim, x, 23.8, 0, 1, 1.5, 0.9, 3.4, 0.75, 0.03); opening(win, x, 23.8, 0, 1, 1.2, 1.0, 3.25, 0.6, 0.06) }
box(brick, 1.25, 20.4, 2.25, 21.4, 6.0, 10.9)
box(stone, 1.1, 20.25, 2.4, 21.55, 10.7, 11.0)

// --- The NE range along the forecourt. ---
range([9.5, 19.4], [32.0, 19.6], 7.8, 6.6, [false, true])
windows([31.8, 23.5], [11.3, 22.9], 5, true)
windows([10.5, 15.3], [32.0, 16.0], 5, false)
for (const y of [18.6, 20.4]) { box(brick, 14.5, y - 0.5, 15.5, y + 0.5, 4.5, 9.8); box(stone, 14.35, y - 0.65, 15.65, y + 0.65, 9.6, 9.9) }

// Chimneys on the big roof.
for (const y of [-12.0, 8.0]) { box(brick, -14.4, y - 0.55, -13.3, y + 0.55, 6.0, 12.4); box(stone, -14.55, y - 0.7, -13.15, y + 0.7, 12.2, 12.5) }

// --- The red entrance: an enclosed vestibule under a broad curved red hood
// that rides up into the middle gable, on two dark posts at its front. ---
const VX0 = 0.0, VX1 = 3.5, VY0 = 23.7, VY1 = 27.0, vc = 1.75
slabUp(red, rect(VX0, VY0, VX1, VY1), 0, 2.9)
opening(trim, vc, VY1, 0, 1, 1.7, 0, 2.6, 0.85, 0.03)
opening(win, vc, VY1, 0, 1, 1.3, 0.1, 2.45, 0.65, 0.06)
for (const [x, nx] of [[VX1, 1], [VX0, -1]] as P2[]) for (const y of [24.8, 26.1]) opening(win, x, y, nx, 0, 0.8, 0.9, 2.4, 0.4, 0.05)
const HW = 6.4, HY0 = 23.7, HY1 = 28.4, HS = 3.0, HR = 1.9
const hOut = archPts(HW, HS, HR, 6).map(([s, z]): P2 => [vc + s, z])
const hIn = archPts(HW - 0.4, HS, HR - 0.25, 6).reverse().map(([s, z]): P2 => [vc + s, z])
board(red, [...hOut, ...hIn], (x, z) => [x, (HY0 + HY1) / 2, z], [0, 1, 0], HY1 - HY0)
board(red, archPts(HW - 0.4, HS, HR - 0.25, 6).map(([s, z]): P2 => [vc + s, z]), (x, z) => [x, HY1 - 0.1, z], [0, 1, 0], 0.2) // the hood's curved front
board(red, [[vc - HW / 2, HS - 0.45], [vc + HW / 2, HS - 0.45], [vc + HW / 2, HS], [vc - HW / 2, HS]], (x, z) => [x, HY1 - 0.05, z], [0, 1, 0], 0.1) // valance
opening(trim, vc, HY1, 0, 1, 1.1, HS + 0.5, HS + 1.4, 0.45, 0.02) // the crest on its face
for (const x of [vc - HW / 2 + 0.2, vc + HW / 2 - 0.2]) box(stone, x - 0.1, HY1 - 0.3, x + 0.1, HY1 - 0.1, 0, HS)

// --- The red awning gallery: a long barrel-vault awning on posts along the
// forecourt front of the NE range. ---
const GX0 = 11.6, GX1 = 30.5, GY0 = 23.6, GY1 = 26.8, gc = (GY0 + GY1) / 2, GS = 2.7, GR = 1.1
const gOut = archPts(GY1 - GY0 + 0.3, GS, GR, 5).map(([s, z]): P2 => [gc + s, z])
const gIn = archPts(GY1 - GY0 - 0.1, GS, GR - 0.2, 5).reverse().map(([s, z]): P2 => [gc + s, z])
board(red, [...gOut, ...gIn], (y, z) => [(GX0 + GX1) / 2, y, z], [1, 0, 0], GX1 - GX0)
board(red, archPts(GY1 - GY0 + 0.3, GS, GR, 5).map(([s, z]): P2 => [gc + s, z]), (y, z) => [GX1 + 0.05, y, z], [1, 0, 0], 0.1) // the lettered end
board(red, [[GX0, GS - 0.35], [GX1, GS - 0.35], [GX1, GS], [GX0, GS]], (x, z) => [x, GY1 + 0.1, z], [0, 1, 0], 0.08) // scalloped valance
for (let k = 0; k <= 6; k++) { const x = GX0 + 0.2 + (k * (GX1 - GX0 - 0.4)) / 6; box(stone, x - 0.07, GY1 - 0.07, x + 0.07, GY1 + 0.07, 0, GS) }

finishModel('Tavern on the Green', 'nyc-tavern-on-the-green', [
  { part: brick, material: { name: 'brick', color: 0x9a6052, roughness: 0.9 } },
  { part: slate, material: { name: 'slate', color: 0x7f858b, roughness: 0.8 } },
  { part: trim, material: { name: 'trim', color: 0xeee3c8, roughness: 0.8 } },
  { part: red, material: { name: 'awning', color: 0xb5373a, roughness: 0.7 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: stone, material: { name: 'stone', color: 0xa9a399, roughness: 0.85 } },
], { bearing: 17.9, osm: 'way/265347579', height: 12.5 }, 5000)
