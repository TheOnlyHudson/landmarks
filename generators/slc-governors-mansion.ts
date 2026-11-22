/**
 * Kearns Mansion (Utah Governor's Mansion), 603 East South Temple, Salt Lake
 * City: the 1902 Châteauesque limestone house built for Thomas Kearns
 * (Carl M. Neuhausen, architect), the governor's residence since 1937.
 * Procedural, CC0-1.0. bun generators/slc-governors-mansion.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the house faces
 * South Temple squarely). Origin: the area centroid of OSM way/143796145
 * (-111.8740882, 40.7697968). y = 0 is the lowest ground under the
 * outline, the front lawn by South Temple; the ground rises about 1.3 m to
 * the rear (lidar).
 *
 * Plan: lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013) puts the
 * main block at x -8.4..11.2, y -13.3..14.3, about 1.5 m east of the OSM
 * outline (OSM's walls at x -9.9..10.4); the model follows the lidar. The
 * two front towers stand at x -6.1 and 9.3, y -11.3 (cone peaks in the
 * lidar), radius 2.4 (OSM's arcs, p3). The west side porch (x -14.2..-8.4,
 * y -1.0..5.1), the east bay (to x 12.6, y -7.5..-0.3) and the small rear
 * porch from OSM and lidar.
 * Heights (measured, lidar, above the front ground): main cornice 11.4 (the
 * roof edge reads 13.1 against ground 1.6); the hipped roof rises steeply
 * (about 40 degrees) to a short ridge at 19.6, highest a little in front of
 * centre; tower cones to ~19.3 with the finials; the front porch's balcony
 * 6.5-7.3; the west porch 6.2-7.0; the rear porch 5.5; four chimneys to
 * ~18.6 (two on the west slope, two on the east). The front dormer's
 * pediment to 15.3. Facade heights (porch floor 2.4, door, loggia arches
 * 7.4-9.0, oval windows at 8.1, tower drum to 14.3, cone eave 14.6) are
 * photo-scaled from p3 (straight on, ~37.6 px/m from the lidar width).
 *
 * Identifying features, from p1/p3/p4: the two round corner towers with
 * their set-back windowed drums, flared eaves and steep dark conical roofs;
 * the steep dark hipped roof with the central stone dormer (three arched
 * lights, a pediment); the columned entrance porch with the balustraded
 * balcony and, above it, the three-arched loggia; the oval windows in
 * carved cartouches either side; pale grey-cream limestone; the steps up
 * from the street. p2 shows the west side: tall chimneys, gabled dormers,
 * the side porch.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Kearns_Mansion_Salt_Lake_City.jpeg
 *     Tricia Simpson, CC BY-SA 3.0 (south front)
 *  p2 https://commons.wikimedia.org/wiki/File:Governor%27s_Mansion_Salt_Lake_City_Utah.jpg
 *     Alede2010, CC BY-SA 4.0 (from the south-west: the west side)
 *  p3 https://commons.wikimedia.org/wiki/File:Governor%27s_mansion,_Salt_Lake_City,_Utah_LCCN2011633121.tif
 *     Carol M. Highsmith, public domain (south front, straight on)
 *  p4 https://commons.wikimedia.org/wiki/File:Governor%27s_Mansion,_Salt_Lake_City,_Utah_LCCN2011633359.tif
 *     Carol M. Highsmith, public domain (south front from the south-west)
 * Lidar: as above. Aerial: USGS NAIP (blurred at this size; the hipped roof
 * and the cream front dormer).
 * Doubts: the east and north sides are seen in no photo (windows estimated,
 * dormers on the east slope mirrored from the west); the window rhythm of
 * the west side is simplified from p2. Left out: carving, cresting, the
 * balusters (drawn as solid bands), the fence and gates.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { poly, prism, box, rect, gable, hip, panel, type Face, type XY } from './slc-beehive-house'
import { wallShape, lathe } from './slc-saltair'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
const X0 = -8.4, X1 = 11.2, Y0 = -13.3, Y1 = 14.3, CX = 1.4
const ZC = 11.0 // cornice bottom; cornice top 11.5 (roof edge)
const RG = (y: number) => Math.max(0, Math.min(1.3, ((y - Y0) / (Y1 - Y0)) * 1.3)) // ground rise to the rear

// ------------------------------------------------------------ main block ---
// the two front towers stand on the front corners (p2, p3: three-quarter
// rounds), so the block's walls stop at the tower centres
const TW = -5.7, TE = 9.4, TY = -11.2, TR = 2.85
const ring: XY[] = [[TW, Y0], [TE, Y0], [TE, TY], [X1, TY], [X1, Y1], [X0, Y1], [X0, TY], [TW, TY]]
/** A rectilinear ring pushed out by o. */
const outset = (r: XY[], o: number): XY[] => r.map((v, i) => {
  const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
  const n1 = [v[1] - a[1], -(v[0] - a[0])], n2 = [b[1] - v[1], -(b[0] - v[0])]
  const l1 = Math.hypot(n1[0], n1[1]), l2 = Math.hypot(n2[0], n2[1])
  return [v[0] + o * (n1[0] / l1 + n2[0] / l2), v[1] + o * (n1[1] / l1 + n2[1] / l2)] as XY
})
/** Caps over the T-shaped ring (outset o), as two rectangles: the ring is not convex. */
function capT(part: Part, o: number, z: number, up: boolean) {
  for (const r of [rect(TW - o, Y0 - o, TE + o, TY - o), rect(X0 - o, TY - o, X1 + o, Y1 + o)])
    poly(part, r.map(([x, y]) => [x, y, z] as V3), [0, 0, up ? 1 : -1])
}
prism(stone, ring, 0, ZC, false)
prism(trim, outset(ring, 0.45), ZC, ZC + 0.5, false); capT(trim, 0.45, ZC, false)
prism(trim, outset(ring, 0.15), 5.9, 6.25, false); capT(trim, 0.15, 6.25, true) // string course
prism(stone, outset(ring, 0.12), 0, 2.0, false); capT(stone, 0.12, 2.0, true) // basement
// the steep hipped roof to a short ridge (lidar), its inset making the ridge
{
  const ox = X0 - 0.45, oy = Y0 - 0.45, px = X1 + 0.45, py = Y1 + 0.45, h = (px - ox) / 2
  const ze = ZC + 0.5, zt = 19.6
  // hip() wants a flat top inset by d; d = h gives a ridge along y
  hip(roof, ox, oy, px, py, ze, zt, h - 0.01, false)
}

// ------------------------------------------------------------ the towers ---
const towers: [number, number][] = [[TW, TY], [TE, TY]]
for (const [tx, ty] of towers) {
  const R = TR
  lathe(stone, tx, ty, 0, [[R + 0.12, 0], [R + 0.12, 2.0], [R, 2.0], [R, ZC]], 16)
  lathe(trim, tx, ty, ZC, [[R + 0.45, 0], [R + 0.45, 0.5], [2.1, 0.5]], 16, true)
  lathe(trim, tx, ty, 5.9, [[R + 0.15, 0], [R + 0.15, 0.35]], 16)
  // the set-back drum with its arched windows, the flared eave and the cone
  lathe(stone, tx, ty, ZC + 0.5, [[2.1, 0], [2.1, 2.8]], 16)
  lathe(roof, tx, ty, ZC + 3.3, [[2.1, 0], [3.0, 0.1], [3.0, 0.35], [2.4, 0.75], [0.2, 4.0], [0.12, 4.0], [0.12, 5.0], [0, 5.1]], 16, true)
  // windows round the front half of the tower: two storeys, and the drum
  const side = tx < CX ? -1 : 1
  for (const a of [-Math.PI / 2, -Math.PI / 2 + side * Math.PI / 4, side > 0 ? 0 : Math.PI]) {
    const c = Math.cos(a), s = Math.sin(a), t: V3 = [-s, c, 0]
    const win1 = (r: number, w: number, z0: number, z1: number, round: boolean) => {
      const o: V3 = [tx + (r + 0.06) * c, ty + (r + 0.06) * s, 0]
      const P = (u: number, z: number): V3 => [o[0] + t[0] * u, o[1] + t[1] * u, z]
      const pts: V3[] = [P(-w / 2, z0), P(w / 2, z0)]
      if (round) { const zs = z1 - w / 2; for (let k = 0; k <= 6; k++) { const q = (k / 6) * Math.PI; pts.push(P((w / 2) * Math.cos(q), zs + (w / 2) * Math.sin(q))) } }
      else pts.push(P(w / 2, z1), P(-w / 2, z1))
      poly(win, pts, [c, s, 0])
    }
    win1(R, 1.15, 2.6, 4.9, false)
    win1(R, 1.15, 6.8, 9.1, false)
    win1(2.1, 0.7, ZC + 1.0, ZC + 2.5, true)
  }
}

// -------------------------------------------------------- the south front ---
{
  // the raised porch: platform, four columns, entablature, balcony band
  const px0 = CX - 3.6, px1 = CX + 3.6, py0 = -15.6
  box(stone, px0, py0, px1, Y0, 0, 2.4)
  for (const dx of [-3.1, -1.9, 1.9, 3.1]) lathe(trim, CX + dx, py0 + 0.55, 2.4, [[0.34, 0], [0.28, 0.4], [0.26, 3.0], [0.36, 3.2]], 10)
  box(trim, px0, py0, px1, Y0, 5.6, 6.5, true)
  prism(trim, [[px0, py0], [px1, py0], [px1, Y0], [px1 - 0.2, Y0], [px1 - 0.2, py0 + 0.2], [px0 + 0.2, py0 + 0.2], [px0 + 0.2, Y0], [px0, Y0]], 6.5, 7.3, true)
  // steps up from the walk (lidar: ~1 m over the last 3 m), flanked by curved stairs in reality
  for (let k = 0; k < 4; k++) box(stone, CX - 1.6, -18.6 + k * 0.75, CX + 1.6, py0, 0, 0.6 + k * 0.6)
  // the door and its transom
  panel(door, 'S', Y0, CX, 1.7, 2.4, 4.6, 'flat', 0.06)
  panel(win, 'S', Y0, CX, 1.7, 4.7, 5.3, 'flat', 0.06)
  // the three-arched loggia over the balcony, framed in carved stone
  panel(trim, 'S', Y0, CX, 4.9, 7.2, 9.7, 'flat', 0.03)
  for (const dx of [-1.45, 0, 1.45]) panel(win, 'S', Y0, CX + dx, 1.15, 7.4, 9.1, 'round', 0.06)
  // either side: a hooded ground-floor window, and an oval in a cartouche
  for (const dx of [-4.1, 4.1]) {
    panel(trim, 'S', Y0, CX + dx, 2.0, 2.2, 5.9, 'round', 0.03)
    panel(win, 'S', Y0, CX + dx, 1.3, 2.4, 4.9, 'flat', 0.06)
    panel(trim, 'S', Y0, CX + dx, 1.8, 6.8, 9.5, 'round', 0.03)
    const pts: [number, number][] = []
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI; pts.push([CX + dx + 0.42 * Math.cos(a), 8.1 + 0.58 * Math.sin(a)]) }
    wallShape(win, 'S', Y0, pts, 0.06)
  }
  // the front dormer: stone face, three arched lights, pediment, gabled roof
  const dx0 = CX - 2.9, dx1 = CX + 2.9, dy1 = Y0 + 4.2
  box(stone, dx0, Y0 - 0.2, dx1, dy1, ZC + 0.5, 14.3)
  gable(roof, stone, dx0 - 0.1, Y0 - 0.2, dx1 + 0.1, dy1, 14.3, 15.3, 'y', 0.25)
  poly(trim, [[dx0 - 0.3, Y0 - 0.5, 14.1], [dx1 + 0.3, Y0 - 0.5, 14.1], [dx1 + 0.3, Y0 - 0.5, 14.5], [dx0 - 0.3, Y0 - 0.5, 14.5]], [0, -1, 0])
  for (const dx of [-1.0, 0, 1.0]) panel(win, 'S', Y0 - 0.2, CX + dx, 0.8, ZC + 0.9, ZC + 2.7, 'round', 0.06)
  // small urns at the dormer's shoulders
  for (const x of [dx0 - 0.1, dx1 + 0.1]) lathe(trim, x, Y0, 14.3, [[0.25, 0], [0.3, 0.3], [0.12, 0.6], [0, 0.7]], 8)
}

// ------------------------------------------------- sides, rear, wings ---
/** Plain sash windows along a wall, two storeys, following the ground. */
function windows(face: Face, plane: number, us: number[], skipGround: (u: number) => boolean = () => false) {
  for (const u of us) {
    const g = face === 'S' ? 0 : face === 'N' ? 1.3 : RG(u)
    if (!skipGround(u)) panel(win, face, plane, u, 1.2, g + 2.5, g + 4.9, 'flat', 0.06)
    panel(win, face, plane, u, 1.2, 6.8, 9.2, 'flat', 0.06)
  }
}
windows('W', X0, [-6.6, -3.0, 2.0, 7.0, 11.0], (u) => u > -1.5 && u < 5.5)
windows('E', X1, [2.6, 7.0, 11.4])
windows('N', Y1, [-5.6, -1.6, 4.4, 8.6])
// the west side porch: floor, columns, roof slab and balustrade band
{
  const ax0 = -14.2, ax1 = X0, ay0 = -1.0, ay1 = 5.1
  box(stone, ax0, ay0, ax1, ay1, 0, 1.2)
  for (const [x, y] of [[ax0 + 0.4, ay0 + 0.4], [ax0 + 0.4, ay1 - 0.4], [ax0 + 0.4, (ay0 + ay1) / 2], [ax1 - 2.8, ay0 + 0.4], [ax1 - 2.8, ay1 - 0.4]] as [number, number][])
    lathe(trim, x, y, 1.2, [[0.26, 0], [0.24, 3.4], [0.32, 3.6]], 8)
  box(trim, ax0, ay0, ax1, ay1, 4.8, 5.5, true)
  prism(trim, [[ax0, ay0], [ax1, ay0], [ax1, ay0 + 0.2], [ax0 + 0.2, ay0 + 0.2], [ax0 + 0.2, ay1 - 0.2], [ax1, ay1 - 0.2], [ax1, ay1], [ax0, ay1]], 5.5, 6.3, true)
  panel(door, 'W', X0, 2.0, 1.5, 1.2, 3.6, 'flat', 0.06)
}
// the east bay
{
  box(stone, X1, -7.5, 12.6, -0.3, 0, ZC)
  box(trim, X1, -7.8, 12.9, 0.0, ZC, ZC + 0.45, true)
  hip(roof, X1, -7.8, 12.9, 0.0, ZC + 0.45, 12.4, 1.0, true)
  for (const y of [-5.6, -2.2]) { panel(win, 'E', 12.6, y, 1.2, RG(y) + 2.5, RG(y) + 4.9); panel(win, 'E', 12.6, y, 1.2, 6.8, 9.2) }
}
// the small rear porch
box(stone, 0.5, Y1, 5.5, 15.6, 0, 5.5)
box(trim, 0.4, Y1, 5.6, 15.75, 5.5, 5.9, true)
// gabled dormers on the side slopes (p2) and the rear
for (const [face, y] of [['W', -5.0], ['W', 5.0], ['E', -5.0], ['E', 5.0]] as ['W' | 'E', number][]) {
  const x = face === 'W' ? X0 + 0.7 : X1 - 0.7, s = face === 'W' ? -1 : 1
  const xa = Math.min(x, x - s * 3.0), xb = Math.max(x, x - s * 3.0)
  box(stone, xa, y - 1.1, xb, y + 1.1, ZC + 0.5, 13.7)
  gable(roof, stone, xa - (s < 0 ? 0.3 : 0), y - 1.1, xb + (s > 0 ? 0.3 : 0), y + 1.1, 13.7, 14.9, 'x', 0.15)
  panel(win, face, x, y, 0.9, ZC + 0.9, 13.3)
}
// chimneys (lidar peaks), pale stone with a cap
for (const [x, y] of [[-7.4, 5.0], [-7.0, 8.6], [10.4, 8.6], [10.4, -7.6]] as [number, number][]) {
  box(stone, x - 0.5, y - 0.8, x + 0.5, y + 0.8, ZC, 18.2)
  box(trim, x - 0.65, y - 0.95, x + 0.65, y + 0.95, 18.2, 18.6, true)
}

// ---------------------------------------------------------------- output ---
// Colours from p1-p4: pale grey-cream limestone, whiter carved trim and
// columns, dark grey metal roofs pulled lighter, a dark glazed oak door.
const parts = [
  { part: stone, material: finish('kearns-limestone', 0xe6e0d2) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('kearns-roof', 0x6b7179) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('kearns-door', 0x6e5a48) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Governor's Mansion", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 19.6,
})
await Bun.write(new URL('../models/slc-governors-mansion.glb', import.meta.url), glb)
console.log(`slc-governors-mansion.glb: ${triangles} triangles, ${glb.length} bytes`)
