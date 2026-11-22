/**
 * The Arsenal, Central Park at Fifth Avenue and 64th Street (Martin E.
 * Thompson, 1847–51, built as the state arsenal; NYC Parks headquarters
 * since 1934) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-arsenal.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 28.7° (the Manhattan grid), so +y is NNE along Fifth Avenue and +x
 * is ESE, toward the avenue: the entrance front. Anchor: the centroid of
 * OSM way/265347583 (building=office, "The Arsenal", height=23.5). The model
 * also replaces way/265347582 (building=office, "The Arsenal", height=9.1),
 * the low annex 15 m to the SSW, drawn here as a plain two-storey block.
 *
 * Plan (OSM, model frame): main block x −7.25..7.3, y −29.1..29.1 (14.5 ×
 * 58 m); an octagonal tower at each corner (apothem ~2.4 m, centres
 * x ±6.2, y ±28.1) and two on each long face flanking the centre (centres
 * y ≈ ±6.1, standing 1.4 m proud of the wall). Annex: OSM outline as drawn.
 *
 * Heights (y = 0 at the foot of the entrance steps):
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 1 m grid read in this
 *   frame, over ground at 2.3 m: wing roofs +14.4; the end blocks (y beyond
 *   ±24.5) +17.3; the central pavilion +18.5; its four towers +21.0; the
 *   corner towers no higher than the end blocks' parapet (+17.8 taken for
 *   their merlons); a penthouse on the pavilion's park side +22.6. OSM's
 *   height=23.5 is the street-referenced figure for the towers; the annex's
 *   height=9.1 is used as is.
 * - Estimated from the photos against those: granite basement 2.6 m, the
 *   towers' band at 15.5 m, window sizes and rows, the steps and doorcase.
 * - Published (Wikipedia "The Arsenal (Central Park)"; NYC LPC designation
 *   1967): red brick, Gothic Revival, eight crenellated octagonal towers,
 *   a central entrance with a carved eagle over the door.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-arsenal/photos):
 * - Flickr user -, "Central Park Arsenal, NYC.jpg", CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_Arsenal,_NYC.jpg
 *   (the ESE front square on: central towers, pavilion, wings, steps)
 * - Andrew Russeth, "Front of the Arsenal (4003258588).jpg", CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Front_of_the_Arsenal_(4003258588).jpg
 *   (the entrance: white doorcase, eagle, steps)
 *
 * Doubts: only the ESE front is photographed; the park-side (WNW) face and
 * the ends are drawn from the plan with the front's window rhythm. The
 * corner towers' height is estimated. The annex's facade is invented
 * (plain windows), from its height only.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { board, opening, slabUp, box, type P2 } from './nyc-cp-dairy'

const brick = new Part(), granite = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

const X0 = -7.25, X1 = 7.3, Y0 = -29.1, Y1 = 29.1
const BASE = 2.6, CORNICE = 14.4, PAV = 18.5, TOWER = 21.0, CORNER = 17.8, ENDS = 17.3

const octPts = (cx: number, cy: number, ap: number): P2[] => Array.from({ length: 8 }, (_, i): P2 => {
  const a = Math.PI / 8 + (i * Math.PI) / 4, r = ap / Math.cos(Math.PI / 8)
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
})
/** Crenellated parapet round an octagon top at z: two merlons a face. */
function crenel(cx: number, cy: number, ap: number, z: number) {
  slabUp(trim, octPts(cx, cy, ap + 0.15), z - 0.3, z - 0.1)
  const side = 2 * ap * Math.tan(Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, nx = Math.cos(a), ny = Math.sin(a)
    for (const s of [-side * 0.25, side * 0.25]) {
      const m = side * 0.2
      const c: P2 = [cx + nx * (ap - 0.15) - ny * s, cy + ny * (ap - 0.15) + nx * s]
      board(brick, [[-m, -0.25], [m, -0.25], [m, 0.25], [-m, 0.25]], (u, v) => [c[0] - ny * u + nx * v, c[1] + nx * u + ny * v, z + 0.4], [0, 0, 1], 0.8)
    }
  }
}
/** An octagonal tower: granite base, brick shaft, crenellated top, narrow windows. */
function tower(cx: number, cy: number, ap: number, top: number, faces: number[]) {
  slabUp(granite, octPts(cx, cy, ap + 0.05), 0, BASE)
  slabUp(brick, octPts(cx, cy, ap), BASE, top)
  slabUp(roof, octPts(cx, cy, ap - 0.3), top - 0.3, top - 0.2)
  crenel(cx, cy, ap, top)
  for (const k of faces) {
    const a = (k * Math.PI) / 4, nx = Math.cos(a), ny = Math.sin(a), ox = cx + nx * ap, oy = cy + ny * ap
    for (const z of [4.0, 8.0, 12.0]) if (z + 2 < top - 1) opening(win, ox, oy, nx, ny, 0.7, z, z + 1.9, 0, 0.06)
    if (top > 20) opening(win, ox, oy, nx, ny, 0.8, 16.3, 18.3, 0.4, 0.06)
  }
}

// --- The main block: granite basement, brick to the cornice, flat roof. ---
slabUp(granite, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, BASE)
slabUp(brick, [[X0 + 0.05, Y0 + 0.05], [X1 - 0.05, Y0 + 0.05], [X1 - 0.05, Y1 - 0.05], [X0 + 0.05, Y1 - 0.05]], BASE, CORNICE)
slabUp(trim, [[X0 - 0.2, Y0 - 0.2], [X1 + 0.2, Y0 - 0.2], [X1 + 0.2, Y1 + 0.2], [X0 - 0.2, Y1 + 0.2]], CORNICE - 0.1, CORNICE + 0.35)
slabUp(roof, [[X0 + 0.3, Y0 + 0.3], [X1 - 0.3, Y0 + 0.3], [X1 - 0.3, Y1 - 0.3], [X0 + 0.3, Y1 - 0.3]], CORNICE + 0.35, CORNICE + 0.5)
// The central pavilion between the middle towers, the full depth, to 21 m, with merlons.
const PY = 4.0
slabUp(brick, [[X0 + 0.05, -PY], [X1 + 0.15, -PY], [X1 + 0.15, PY], [X0 + 0.05, PY]], CORNICE, PAV)
slabUp(roof, [[X0 + 0.4, -PY + 0.3], [X1 - 0.2, -PY + 0.3], [X1 - 0.2, PY - 0.3], [X0 + 0.4, PY - 0.3]], PAV - 0.3, PAV - 0.2)
slabUp(trim, [[X0 - 0.1, -PY], [X1 + 0.3, -PY], [X1 + 0.3, PY], [X0 - 0.1, PY]], PAV - 0.35, PAV - 0.1)
for (const x of [X0 + 0.1, X1 - 0.05]) for (let k = 0; k < 5; k++) {
  const y = -PY + 0.4 + (k * (2 * PY - 0.8)) / 4
  box(brick, x - 0.25, y - 0.35, x + 0.25, y + 0.35, PAV - 0.1, PAV + 0.7)
}
box(granite, X1, -PY, X1 + 0.15, PY, 0, BASE) // the pavilion stands a little proud

// The end blocks rise to 17.3 m (lidar), the full width, with their own cornice.
for (const sy of [-1, 1]) {
  const ya = sy * 24.5, yb = sy * 29.1, lo = Math.min(ya, yb), hi = Math.max(ya, yb)
  slabUp(brick, [[X0 + 0.05, lo], [X1 - 0.05, lo], [X1 - 0.05, hi], [X0 + 0.05, hi]], CORNICE, ENDS)
  slabUp(trim, [[X0 - 0.15, lo], [X1 + 0.15, lo], [X1 + 0.15, hi], [X0 - 0.15, hi]], ENDS - 0.1, ENDS + 0.3)
  slabUp(roof, [[X0 + 0.3, lo + 0.3], [X1 - 0.3, lo + 0.3], [X1 - 0.3, hi - 0.3], [X0 + 0.3, hi - 0.3]], ENDS + 0.3, ENDS + 0.4)
  for (const [x, nx] of [[X1, 1], [X0, -1]] as P2[]) sash(x, sy * 26.3, nx, 0, 1.0, 14.9, 16.6)
}
// A brick penthouse on the pavilion roof toward the park (lidar +22.6).
box(brick, -6.2, -2.0, -1.2, 2.5, PAV - 0.3, 22.6)
slabUp(roof, [[-6.35, -2.15], [-1.05, -2.15], [-1.05, 2.65], [-6.35, 2.65]], 22.4, 22.7)

// --- Towers: four at the corners, two each side of the pavilion on both long faces. ---
for (const sx of [-1, 1]) for (const sy of [-1, 1]) tower(sx > 0 ? 6.2 : -6.15, sy * 28.1, 2.45, CORNER, sx > 0 ? (sy > 0 ? [0, 1, 2] : [0, 7, 6]) : (sy > 0 ? [4, 3, 2] : [4, 5, 6]))
for (const sy of [-1, 1]) {
  tower(6.3, sy * 6.1, 2.4, TOWER, [0, sy > 0 ? 1 : 7])
  tower(-6.25, sy * 6.1, 2.4, TOWER, [4, sy > 0 ? 3 : 5])
  slabUp(trim, octPts(6.3, sy * 6.1, 2.55), 15.4, 15.7)
  slabUp(trim, octPts(-6.25, sy * 6.1, 2.55), 15.4, 15.7)
}

// --- Windows: tall sash windows with pale lintels, three storeys over the basement. ---
const ROWS: [number, number][] = [[3.3, 5.6], [6.7, 9.0], [10.1, 12.4]]
function sash(cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, rise = 0) {
  opening(trim, cx, cy, nx, ny, w + 0.3, z0 - 0.15, z1 + 0.2, rise ? rise + 0.15 : 0, 0.03)
  opening(win, cx, cy, nx, ny, w, z0, z1, rise, 0.06)
}
for (const [x, nx] of [[X1, 1], [X0, -1]] as P2[]) {
  for (const sy of [-1, 1]) for (let k = 0; k < 4; k++) {
    const y = sy * (10.4 + k * 4.25)
    for (const [z0, z1] of ROWS) sash(x, y, nx, 0, 1.2, z0, z1)
    sash(x, y, nx, 0, 1.0, 0.8, 1.9) // basement lights in the granite
  }
  // Pavilion: the window over the door, the arched triple window, a pair above.
  sash(x + nx * 0.15, 0, nx, 0, 1.6, 6.7, 8.9)
  for (const y of [-1.3, 1.3]) sash(x + nx * 0.15, y, nx, 0, 0.7, 10.1, 12.7, 0.35)
  sash(x + nx * 0.15, 0, nx, 0, 1.4, 10.1, 13.5, 0.7)
  for (const y of [-1.0, 1.0]) sash(x + nx * 0.15, y, nx, 0, 0.75, 14.9, 16.7, 0.375)
  if (nx < 0) for (const [z0, z1] of ROWS) sash(x, 0, nx, 0, 1.2, z0, z1)
}
for (const [y, ny] of [[Y1, 1], [Y0, -1]] as P2[]) for (const x of [-2.0, 2.0]) for (const [z0, z1] of ROWS) sash(x, y, 0, ny, 1.2, z0, z1)

// --- The entrance: granite steps, white doorcase with its cornice, oak doors. ---
for (let k = 0; k < 6; k++) box(granite, X1, -1.5, X1 + 2.6 - k * 0.4, 1.5, 0, 0.4 * (k + 1))
board(trim, [[-1.25, 2.4], [1.25, 2.4], [1.25, 5.9], [-1.25, 5.9]], (s, z) => [X1 + 0.15, s, z], [1, 0, 0], 0.3)
box(trim, X1 + 0.1, -1.45, X1 + 0.55, 1.45, 5.9, 6.25)
opening(door, X1 + 0.3, 0, 1, 0, 1.3, 2.4, 4.7, 0, 0.03)

// --- The annex to the SSW (way/265347582): a plain two-storey brick block. ---
const annex: P2[] = [[11.07, -45.9], [12.98, -43.36], [18.09, -43.28], [19.63, -45.77], [20.69, -45.76], [20.83, -56.43], [20.09, -56.43], [17.68, -58.97], [13.18, -59.04], [11.2, -55.91], [2.12, -56.05], [-5.18, -56.16], [-5.31, -46.15]]
slabUp(granite, annex, 0, 1.0)
slabUp(brick, annex, 1.0, 8.5)
slabUp(trim, annex, 8.5, 8.8)
slabUp(roof, annex, 8.8, 9.1)
{
  let A = 0
  for (let i = 0; i < annex.length; i++) { const a = annex[i], b = annex[(i + 1) % annex.length]; A += a[0] * b[1] - b[0] * a[1] }
  const sg = A > 0 ? 1 : -1
  for (let i = 0; i < annex.length; i++) {
    const a = annex[i], b = annex[(i + 1) % annex.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = sg * uy, ny = -sg * ux
    const n = Math.floor(L / 3.4)
    for (let k = 0; k < n; k++) {
      const s = (L / n) * (k + 0.5), cx = a[0] + ux * s, cy = a[1] + uy * s
      for (const [z0, z1] of [[2.0, 4.0], [5.3, 7.5]]) sash(cx, cy, nx, ny, 1.1, z0, z1)
    }
  }
}

finishModel('The Arsenal', 'nyc-arsenal', [
  { part: brick, material: { name: 'brick', color: 0xa8634f, roughness: 0.9 } },
  { part: granite, material: { name: 'granite', color: 0xa9a49a, roughness: 0.85 } },
  { part: trim, material: { name: 'trim', color: 0xf0ebe0, roughness: 0.8 } },
  { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: door, material: { name: 'entrance', color: 0x8a6440, roughness: 0.7 } },
], { bearing: 28.7, osm: 'way/265347583', height: 24.3 }, 6500)
