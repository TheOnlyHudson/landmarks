/**
 * Florida Theatre, Jacksonville (Roy A. Benjamin, 1927) — original
 * procedural geometry, CC0-1.0.
 * bun generators/jax-florida-theatre.ts
 *
 * The 1927 Mediterranean Revival movie palace on the corner of East Forsyth
 * and Newnan streets, wrapped in a seven-storey office block of buff brick
 * over a cream stone ground storey. Deep bracketed eaves with a red-tile lip
 * run round the top; square corner towers on Forsyth Street rise a storey
 * above them under low hipped tile roofs, and a curved, crested stone
 * pavilion marks the centre of the Forsyth front. Over the entrance three
 * tall cream terracotta window frames with arched, cartouche-topped hoods
 * stand above the pink marquee with its "Florida" script.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14:
 * the outline's walls run 14° clockwise of the compass (the downtown grid).
 * Origin = centroid of way/327725047. The outline is a 48.9 × 35.4 m
 * rectangle: x -24.45..24.45, y -17.7..17.7; Forsyth Street is the north
 * face (y = +17.7), Newnan Street the east face (x = +24.45).
 *
 * Evidence
 * - OSM way/327725047 ("Florida Theatre", building=yes, building:levels 7):
 *   the outline. The neighbouring 1904 Music Hall (way/327725071) and the
 *   low building on the west (way/327725049) are not part of it.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read in this frame, heights above the street (~1.3 m above the grid
 *   minimum): main roof 27.5 over most of the plan; the corner towers'
 *   roofs peak at ~30.5 (x -22..-15 and x 18..24.5, y 10..17.7); the centre
 *   of the Forsyth front ~29.5; a lower west wing at ~22.5 (x -24.5..-14,
 *   y -17.7..5).
 * - Published (Wikipedia "Florida Theatre"; NRHP 1982): opened April 1927,
 *   architect Roy A. Benjamin, Mediterranean Revival; office block of
 *   seven storeys.
 * - Photos (Commons):
 *   · "Florida Theatre, Jacksonville, FL, U.S. (09).jpg", bubba73,
 *     CC BY-SA 3.0, from the north-east corner (tower, eaves, pavilion,
 *     marquee),
 *     https://commons.wikimedia.org/wiki/File:Florida_Theatre,_Jacksonville,_FL,_U.S._(09).jpg
 *   · "Florida Theatre, Jacksonville, FL, U.S. (03).jpg", bubba73,
 *     CC BY-SA 3.0, the Forsyth front and marquee,
 *     https://commons.wikimedia.org/wiki/File:Florida_Theatre,_Jacksonville,_FL,_U.S._(03).jpg
 *   · "Florida Theatre, Jacksonville, FL, U.S..jpg", bubba73, CC BY-SA 3.0,
 *     the three window frames and the "Florida" script (traced),
 *     https://commons.wikimedia.org/wiki/File:Florida_Theatre,_Jacksonville,_FL,_U.S..jpg
 *   · "Florida Theatre, Jacksonville, FL, U.S. (12).jpg", bubba73,
 *     CC BY-SA 3.0, the corner tower's hipped roof and brackets,
 *     https://commons.wikimedia.org/wiki/File:Florida_Theatre,_Jacksonville,_FL,_U.S._(12).jpg
 *   · "Marquee 1927 Florida Theatre Jacksonville", Carol M. Highsmith
 *     (Library of Congress), CC0 via rawpixel, the Forsyth front straight on,
 *     https://www.rawpixel.com/image/80709
 *
 * Measured: plan (OSM), heights (lidar). Published: date, architect,
 * storeys. Estimated from the photos: the 6 m stone ground storey, 3.2 m
 * upper storeys, the window columns (punched windows ~1.5 × 1.9 m, one a
 * storey, brick between), the three window frames (5 m wide,
 * hoods to ~15.6 m), the marquee (22 m wide, 4 m deep, fascia 5.0..7.2 m),
 * the pavilion's crest, the towers' 7 m width and roof pitch. The script
 * "Florida" is traced from the photo, its size scaled to the fascia.
 * Famous-sign exception (STYLE.md): the marquee carries its lettering.
 *
 * Night: windows `window`; the marquee fascia glows pink
 * (`neon-florida-pink`), the script stays cream against it.
 *
 * Left out: the vertical blade sign of old (no current photo shows one; the
 * corner now has an LED ticket sign, left out), the tile and medallion
 * ornament, the balconettes under the tower windows, the brackets.
 * Doubts: the south and west sides are not photographed; the west wing's
 * windows and the towers' exact spans are read from lidar only.
 */
import { Part, writeGlb, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'

const BEARING = 14
const ANCHOR = { lng: -81.6557653, lat: 30.3263071 }

const brick = new Part(), trim = new Part(), win = new Part(), tile = new Part(), roof = new Part(), pink = new Part()

// ─── helpers ───
function quadF(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function triF(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
/** An axis-aligned box; `bev` chamfers the top edges; top goes to `top` part (or none). */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, top: Part | null = roof, bottom = false) {
  const r = (z: number, i = 0): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  part.loft(bev > 0 ? [r(z0), r(z1 - bev), r(z1, bev)] : [r(z0), r(z1)])
  if (top) top.cap(r(z1, bev), true)
  if (bottom) part.cap(r(z0), false)
}
type Face = 'N' | 'S' | 'E' | 'W'
const FN: Record<Face, V3> = { N: [0, 1, 0], S: [0, -1, 0], E: [1, 0, 0], W: [-1, 0, 0] }
/** A point on a wall: u runs along the wall (x for N/S, y for E/W), z up, `off` outward. */
function onWall(f: Face, c: number, u: number, z: number, off: number): V3 {
  const n = FN[f]
  return f === 'N' || f === 'S' ? [u, c + n[1] * off, z] : [c + n[0] * off, u, z]
}
function rectOn(part: Part, f: Face, c: number, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  quadF(part, onWall(f, c, u0, z0, off), onWall(f, c, u1, z0, off), onWall(f, c, u1, z1, off), onWall(f, c, u0, z1, off), FN[f])
}
/** A convex outline (u, z) on a wall, fanned from its centroid. */
function polyOn(part: Part, f: Face, c: number, pts: [number, number][], off = 0.05) {
  const cu = pts.reduce((s, p) => s + p[0], 0) / pts.length, cz = pts.reduce((s, p) => s + p[1], 0) / pts.length
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    triF(part, onWall(f, c, cu, cz, off), onWall(f, c, a[0], a[1], off), onWall(f, c, b[0], b[1], off), FN[f])
  }
}
/** A round-headed opening: jambs u0..u1 from z0, a true semicircle on top. */
function archPts(u0: number, u1: number, z0: number, zs: number, n = 8): [number, number][] {
  const r = (u1 - u0) / 2, cu = (u0 + u1) / 2
  const p: [number, number][] = [[u0, z0], [u1, z0]]
  for (let i = 0; i <= n; i++) { const t = (Math.PI * i) / n; p.push([cu + r * Math.cos(t), zs + r * Math.sin(t)]) }
  return p
}
/** A hipped roof over a rectangle (eaves at z0), rising h; ridge along the longer side. */
function hipRoof(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const rx = w > d ? (w - d) / 2 : 0, ry = d > w ? (d - w) / 2 : 0
  const A: V3 = [cx - rx, cy - ry, z0 + h], B: V3 = [cx + rx, cy + ry, z0 + h]
  const c00: V3 = [x0, y0, z0], c10: V3 = [x1, y0, z0], c11: V3 = [x1, y1, z0], c01: V3 = [x0, y1, z0]
  const up = (v: V3): V3 => [v[0], v[1], 1]
  if (w >= d) {
    quadF(part, c00, c10, B, A, up([0, -1, 0])); quadF(part, c11, c01, A, B, up([0, 1, 0]))
    triF(part, c10, c11, B, up([1, 0, 0])); triF(part, c01, c00, A, up([-1, 0, 0]))
  } else {
    quadF(part, c10, c11, B, A, up([1, 0, 0])); quadF(part, c01, c00, A, B, up([-1, 0, 0]))
    triF(part, c00, c10, A, up([0, -1, 0])); triF(part, c11, c01, B, up([0, 1, 0]))
  }
  part.cap([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], false)
}
/** An eave: a slab projecting `o` beyond the rectangle, z0..z1, its top a tiled lip rising to the roof. */
function eave(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o: number, lipH = 1.6, lipIn = 2.6) {
  box(tile, x0 - o, x1 + o, y0 - o, y1 + o, z0, z1, 0, null, true)
  const r = (z: number, i: number): V3[] => [[x0 - o + i, y0 - o + i, z], [x1 + o - i, y0 - o + i, z], [x1 + o - i, y1 + o - i, z], [x0 - o + i, y1 + o - i, z]]
  tile.loft([r(z1, 0), r(z1 + lipH, lipIn)])
  roof.cap(r(z1 + lipH, lipIn), true)
}

// ─── massing ───
const X0 = -24.45, X1 = 24.45, Y0 = -17.7, Y1 = 17.7
const BASE = 6.0, EAVE = 25.2, WEST_EAVE = 21.6
const WX1 = -14.0, WY1 = 9.5 // the lower west wing: x X0..WX1, y Y0..WY1
const TW = 7.0, TOWER_EAVE = 28.4 // corner towers on Forsyth Street

// stone ground storey with a cornice band
box(trim, X0, X1, Y0, Y1, 0, BASE, 0, null)
box(trim, X0 - 0.3, X1 + 0.3, Y0, Y1 + 0.3, BASE - 0.7, BASE, 0, null, true)
// the brick body: main block east of the west wing, the west wing lower
box(brick, WX1, X1, Y0, Y1, BASE, EAVE, 0, null)
box(brick, X0, WX1, WY1, Y1, BASE, EAVE, 0, null)
box(brick, X0, WX1, Y0, WY1, BASE, WEST_EAVE, 0, null)
eave(WX1, X1, Y0, Y1, EAVE, EAVE + 0.7, 1.0)
eave(X0, WX1, WY1, Y1, EAVE, EAVE + 0.7, 1.0)
eave(X0, WX1, Y0, WY1, WEST_EAVE, WEST_EAVE + 0.7, 1.0)

// corner towers: a storey above the eaves, low hipped tile roofs on bracketed eaves
for (const [tx0, tx1] of [[X0, X0 + TW], [X1 - TW, X1]]) {
  box(brick, tx0, tx1, Y1 - TW, Y1, EAVE, TOWER_EAVE, 0, null)
  box(tile, tx0 - 1.0, tx1 + 1.0, Y1 - TW - 1.0, Y1 + 1.0, TOWER_EAVE, TOWER_EAVE + 0.6, 0, null, true)
  hipRoof(tile, tx0 - 1.0, tx1 + 1.0, Y1 - TW - 1.0, Y1 + 1.0, TOWER_EAVE + 0.6, 2.4)
}

// the crested pavilion at the centre of the Forsyth front
{
  const hw = 4.6, z0 = EAVE - 0.5, zs = EAVE + 2.6, top = EAVE + 4.3, n = 10
  const crest: [number, number][] = [[-hw, z0], [hw, z0], [hw, zs]]
  for (let i = 1; i < n; i++) {
    const t = i / n, u = hw - 2 * hw * t
    crest.push([u, zs + (top - zs) * Math.sqrt(Math.max(0, 1 - (u / hw) ** 2))])
  }
  crest.push([-hw, zs])
  const y0 = Y1 - 1.2, y1 = Y1 + 0.35
  // front and back faces, then the edges
  polyOn(trim, 'N', y1, crest, 0)
  polyOn(trim, 'S', y0, crest, 0)
  for (let i = 0; i < crest.length; i++) {
    const a = crest[i], b = crest[(i + 1) % crest.length]
    const nu = b[1] - a[1], nz = -(b[0] - a[0])
    quadF(trim, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [nu, 0, nz])
  }
  // the pavilion's windows: a column of paired lights under the crest
  rectOn(win, 'N', y1, -1.5, 1.5, EAVE - 0.2, EAVE + 2.0, 0.05)
}

// ─── facades ───
const FLOORS = [[7.0, 8.9], [10.2, 12.1], [13.4, 15.3], [16.6, 18.5], [19.8, 21.6]] as const // punched windows, one a storey (2-6): the photos show brick well between floors
const ARCH = [22.3, 23.6] // seventh-storey round-headed windows: sill, springing
function column(f: Face, c: number, u: number, w: number, z1Max = EAVE) {
  for (const [z0, z1] of FLOORS) if (z1 <= z1Max) rectOn(win, f, c, u - w / 2, u + w / 2, z0, z1)
  if (z1Max >= EAVE) polyOn(win, f, c, archPts(u - w / 2, u + w / 2, ARCH[0], ARCH[1]))
}
// North (Forsyth) front: symmetric about x = 0
const ORNATE = [-6.2, 0, 6.2]
for (const s of [-1, 1]) {
  for (const u of [21.0, 16.6, 13.3, 10.0]) column('N', Y1, s * u, 1.5)
  // tower storey window
  rectOn(win, 'N', Y1, s * 21.0 - 0.8, s * 21.0 + 0.8, EAVE + 0.6, TOWER_EAVE - 0.6)
}
for (const u of ORNATE) {
  // cream frame with an arched hood, the triple windows in two tiers
  polyOn(trim, 'N', Y1, archPts(u - 2.6, u + 2.6, 6.4, 13.0, 10), 0.03)
  rectOn(win, 'N', Y1, u - 1.9, u + 1.9, 7.0, 9.4, 0.07)
  rectOn(win, 'N', Y1, u - 1.9, u + 1.9, 10.2, 12.8, 0.07)
  for (const [z0, z1] of FLOORS.slice(2)) rectOn(win, 'N', Y1, u - 1.5, u + 1.5, z0, z1)
  polyOn(win, 'N', Y1, archPts(u - 0.8, u + 0.8, ARCH[0], ARCH[1]))
}
// East (Newnan) side: tower bay at the north end, then paired columns
for (const u of [14.2, 9.6, 6.2, 2.8, -0.6, -4.0, -7.4, -10.8, -14.6]) column('E', X1, u, 1.5)
rectOn(win, 'E', X1, 13.4, 15.0, EAVE + 0.6, TOWER_EAVE - 0.6)
// South (alley) side and the west wing's upper storeys: plain columns
for (let u = -20; u <= 20.5; u += 3.6) column('S', Y0, u, 1.4, u < WX1 ? WEST_EAVE : EAVE)
for (const u of [-14.6, -11.0, -7.4, -3.8, 0.2, 4.0]) column('W', X0, u, 1.4, WEST_EAVE)
for (const u of [11.6, 14.6]) column('W', X0, u, 1.4)
rectOn(win, 'W', X0, 13.4, 15.0, EAVE + 0.6, TOWER_EAVE - 0.6)
rectOn(win, 'S', Y1 - TW, -21.8, -20.2, EAVE + 0.6, TOWER_EAVE - 0.6)
rectOn(win, 'S', Y1 - TW, 20.2, 21.8, EAVE + 0.6, TOWER_EAVE - 0.6)

// ground storey: shopfronts on Forsyth and Newnan, the theatre doors under the marquee
for (const s of [-1, 1]) for (const u of [14.0, 19.6]) rectOn(win, 'N', Y1, s * u - 2.0, s * u + 2.0, 0.6, 4.6)
rectOn(win, 'N', Y1, -9.5, 9.5, 0.3, 4.0)
for (const u of [10.5, 4.5, -1.5, -7.5, -13.5]) rectOn(win, 'E', X1, u - 2.2, u + 2.2, 0.6, 4.6)

// ─── the marquee ───
const MQ = { x0: -11, x1: 11, y1: Y1 + 4.0, z0: 4.5, z1: 7.2 }
box(pink, MQ.x0, MQ.x1, Y1, MQ.y1, MQ.z0, MQ.z1, 0.15, pink, true)
// "Florida" in script, traced from the photo: units are x-heights, baseline v = 0
const pen = new Pen()
// F: a swash top stroke, the stem curving down to a hooked foot, a short crossbar
pen.moveTo([0.0, 1.85]).cubicTo([0.6, 2.35], [1.6, 1.85], [2.5, 2.25], 8)
pen.moveTo([1.55, 2.05]).cubicTo([1.3, 1.2], [1.1, 0.4], [0.7, 0.0], 6).quadTo([0.35, -0.15], [0.1, 0.2], 4)
pen.moveTo([0.75, 1.05]).lineTo([1.75, 1.15])
// l: a tall looped ascender
pen.moveTo([1.6, 0.1]).cubicTo([2.2, 0.6], [2.6, 2.0], [2.35, 2.05], 6).cubicTo([2.05, 2.1], [1.9, 0.6], [2.2, 0.0], 6).quadTo([2.4, -0.05], [2.6, 0.2], 3)
// o
pen.circle([3.0, 0.45], 0.42, 0.47, 12)
// r
pen.moveTo([3.55, 0.0]).lineTo([3.65, 0.9]).quadTo([3.9, 1.05], [4.2, 0.8], 4)
// i, with its dot
pen.moveTo([4.45, 0.0]).lineTo([4.6, 0.9])
pen.circle([4.68, 1.3], 0.09, 0.09, 6)
// d: bowl and tall stem
pen.circle([5.3, 0.45], 0.42, 0.47, 12)
pen.moveTo([5.75, 0.0]).cubicTo([5.85, 0.8], [5.95, 1.5], [6.1, 2.15], 5)
// a: bowl, stem and tail
pen.circle([6.6, 0.45], 0.4, 0.45, 12)
pen.moveTo([7.05, 0.9]).lineTo([7.0, 0.1]).quadTo([7.1, -0.05], [7.35, 0.15], 3)
const S = 1.38, U0 = -7.35 * S / 2, BASELINE = 5.15
strokes(trim, pen.paths, {
  width: 0.2, depth: 0.18,
  place: (u, v, w) => [-(U0 + u * S), MQ.y1 + w, BASELINE + v * S], // read from the street: east is to the left
})

const parts = [
  { part: brick, material: finish('florida-buff-brick', 0xd6c3a2) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: { ...PALETTE.window, color: 0x5f7283 } },
  { part: tile, material: finish('florida-tile', 0xa9654e) },
  { part: roof, material: PALETTE.roof },
  { part: pink, material: finish('neon-florida-pink', 0xe8b4b4) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Florida Theatre', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOWER_EAVE + 3.0,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/327725047'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-florida-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
