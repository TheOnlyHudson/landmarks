/**
 * Swedish Cottage Marionette Theatre, Central Park, below Belvedere Castle
 * on the West Drive (1876; built in Sweden of Baltic fir as Sweden's
 * schoolhouse at the Philadelphia Centennial Exposition, re-erected in the
 * park in 1877; a marionette theatre since 1947) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-swedish-cottage.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 42.0° (the outline's edges run at 42.0° and 131.7°), so model +y
 * is NE and +x is SE. Anchor: the centroid of OSM way/278363049
 * (building=yes, "Swedish Cottage Marionette Theatre", height=8.1), which
 * this model replaces; no other building ways lie within 40 m.
 *
 * Plan (OSM, model frame): the main range x −11.0..0.4, y −6.4..5.8, and a
 * cross wing x 0.4..10.0, y −7.0..7.9.
 *
 * Heights. y = 0 is the lowest ground under the footprint.
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 0.5 m grid read in
 *   this frame: the main range's ridge along x at y ≈ 0, ~8.0 above the
 *   ground round it; the wing's ridge along y at x ≈ 5, the same height;
 *   the eaves (at the overhang's edge) ~4.3. OSM's height=8.1 agrees.
 * - Estimated from the photos against those: walls 4.4 to the eave (ridge drawn at 8.3, a little over the lidar's 8.0, for the photos' steeper gables), the
 *   0.9 m gable overhangs, the porch, the windows and the door (scaled on
 *   the 2.1 m door), the chimneys (~1.6 m over the ridge).
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-swedish-cottage/photos):
 * - Marcus Bornestav, "Swedish Cottage, Central Park, New York City 2018.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Swedish_Cottage,_Central_Park,_New_York_City_2018.jpg
 *   (from the SW: the main range's west gable and its long south side with
 *   the porch and four round-arched windows)
 * - Daderot, "Swedish Cottage Marionette Theatre - DSC05952.JPG", CC0,
 *   https://commons.wikimedia.org/wiki/File:Swedish_Cottage_Marionette_Theatre_-_DSC05952.JPG
 *   (the wing's gable end with its triple arched window, the main range's
 *   long side with the door, the two brick chimneys)
 * - Jim.henderson, "Swedish cottage CP snow jeh.JPG", CC0,
 *   https://commons.wikimedia.org/wiki/File:Swedish_cottage_CP_snow_jeh.JPG
 *   (the whole cottage from the east in snow: the two ridges, chimneys)
 *
 * Colours from the photos: dark brown stained log walls (pulled to the
 * palette's lightness), a grey-brown wood-shingle roof, lighter brown trim,
 * window frames and bargeboards, red brick chimneys.
 *
 * Doubts: the wing's east wall and its SW gable are not clearly seen and
 * repeat the NE side; the carved brackets, pierced bargeboards and the
 * porch's balusters are drawn as plain boards.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { house, barge, box, opening, type P2 } from './nyc-cp-dairy'

const wood = new Part(), roof = new Part(), trim = new Part(), win = new Part(), brick = new Part()

const EAVE = 4.4, RIDGE = 8.3
// Main range, ridge along x; its east end runs into the wing.
const M = { x0: -11.0, x1: 5.2, y0: -6.4, y1: 5.8 }
house({ wall: wood, roof, axis: 'x', u0: M.x0, u1: M.x1, v0: M.y0, v1: M.y1, eave: EAVE, ridge: RIDGE, oh: 0.75, ohEnd: [0.95, 0], t: 0.3 })
// Cross wing, ridge along y, gables to NE and SW.
const W = { x0: 0.4, x1: 10.0, y0: -7.0, y1: 7.9 }
house({ wall: wood, roof, axis: 'y', u0: W.y0, u1: W.y1, v0: W.x0, v1: W.x1, eave: EAVE, ridge: RIDGE, oh: 0.75, ohEnd: 0.95, t: 0.3 })
// Bargeboards on the three gables.
barge(trim, 'x', M.x0 - 0.95, M.y0, M.y1, EAVE, RIDGE, 0.75, 0.35, -0.02)
barge(trim, 'y', W.y1 + 0.95, W.x0, W.x1, EAVE, RIDGE, 0.75, 0.35, 0.02)
barge(trim, 'y', W.y0 - 0.95, W.x0, W.x1, EAVE, RIDGE, 0.75, 0.35, -0.02)
// A pent board across each gable at the eave line, and a skirt of upright boards.
box(trim, M.x0 - 0.35, M.y0, M.x0, M.y1, EAVE - 0.1, EAVE + 0.25)
for (const y of [W.y1, W.y0]) box(trim, W.x0, Math.min(y, y + (y > 0 ? 0.35 : -0.35)), W.x1, Math.max(y, y + (y > 0 ? 0.35 : -0.35)), EAVE - 0.1, EAVE + 0.25)
box(wood, M.x0 - 0.06, M.y0 - 0.06, W.x0, M.y1 + 0.06, 0, 0.9)
box(wood, W.x0 - 0.06, W.y0 - 0.06, W.x1 + 0.06, W.y1 + 0.06, 0, 0.9)

// Windows: round-arched lights in red-brown frames.
const lite = (cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, rise: number) => {
  opening(trim, cx, cy, nx, ny, w + 0.3, z0 - 0.12, z1 + 0.15, rise + 0.15, 0.03)
  opening(win, cx, cy, nx, ny, w, z0, z1, rise, 0.06)
}
// South side of the main range: four tall arched windows and a small one by the porch.
for (const x of [-4.7, -2.5, -0.3]) lite(x, M.y0, 0, -1, 1.75, 1.2, 3.95, 0.87)
lite(-6.6, M.y0, 0, -1, 0.9, 1.6, 3.4, 0.45)
// West gable: two tall arched windows and a small one in the gable.
for (const y of [-1.4, 1.4]) lite(M.x0, y, -1, 0, 1.0, 1.4, 3.6, 0.5)
lite(M.x0, -0.2, -1, 0, 0.7, 5.0, 6.2, 0.35)
// Wing gables: the triple arched window under a panelled head.
for (const [y, ny] of [[W.y1, 1], [W.y0, -1]] as P2[]) {
  opening(trim, 5.2, y, 0, ny, 3.6, 1.2, 4.0, 0, 0.03)
  for (const dx of [-1.1, 0, 1.1]) opening(win, 5.2 + dx, y, 0, ny, 0.85, 1.4, 3.7, 0.42, 0.06)
  opening(win, 5.2, y, 0, ny, 0.8, 5.1, 6.1, 0.4, 0.06)
}
// North side: the stage door and an arched window; the wing's east wall.
opening(trim, -4.0, M.y1, 0, 1, 1.5, 0.9, 3.15, 0.7, 0.03)
opening(win, -4.0, M.y1, 0, 1, 1.1, 1.0, 3.0, 0.55, 0.06)
lite(-8.4, M.y1, 0, 1, 1.2, 1.4, 3.5, 0.6)
lite(-1.4, M.y1, 0, 1, 1.2, 1.4, 3.5, 0.6)
for (const y of [-4.0, 0, 4.0]) lite(W.x1, y, 1, 0, 1.3, 1.4, 3.5, 0.65)

// The porch on the south side by the west gable: posts, a deck and a gabled hood.
const P = { x0: -10.4, x1: -7.4, y0: -8.5, y1: M.y0 }
box(wood, P.x0, P.y0, P.x1, P.y1, 0, 0.7)
for (const [x, y] of [[P.x0 + 0.15, P.y0 + 0.15], [P.x1 - 0.15, P.y0 + 0.15]] as P2[]) box(trim, x - 0.13, y - 0.13, x + 0.13, y + 0.13, 0.7, 3.1)
box(trim, P.x0, P.y0, P.x1, P.y0 + 0.3, 2.85, 3.15)
// A small gabled hood, ridge running out from the wall, its gable to the path.
house({ wall: null, gable: trim, roof, axis: 'y', u0: P.y0, u1: P.y1, v0: P.x0, v1: P.x1, eave: 3.1, ridge: 4.3, oh: 0.3, ohEnd: [0.4, 0], t: 0.2, ends: [true, false] })
barge(trim, 'y', P.y0 - 0.4, P.x0, P.x1, 3.1, 4.3, 0.3, 0.25, -0.02)
// Arched entry in the porch's back wall.
lite(-8.9, M.y0, 0, -1, 1.2, 0.7, 2.9, 0.6)

// Two red brick chimneys on the main ridge.
for (const x of [-7.4, -2.2]) {
  box(brick, x - 0.4, -0.45, x + 0.4, 0.45, RIDGE - 1.0, RIDGE + 1.6)
  box(brick, x - 0.5, -0.55, x + 0.5, 0.55, RIDGE + 1.4, RIDGE + 1.7)
}

finishModel('Swedish Cottage', 'nyc-swedish-cottage', [
  { part: wood, material: { name: 'fir-logs', color: 0x6e5444, roughness: 0.9 } },
  { part: roof, material: { name: 'shingle', color: 0x7f776b, roughness: 0.9 } },
  { part: trim, material: { name: 'trim-brown', color: 0x957559, roughness: 0.85 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: brick, material: { name: 'brick', color: 0xa95f4c, roughness: 0.9 } },
], { bearing: 42.0, osm: 'way/278363049', height: RIDGE + 1.7 }, 5000)
