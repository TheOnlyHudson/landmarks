/**
 * Virginia Executive Mansion, Capitol Square, Richmond, Virginia (Alexander
 * Parris, 1811–13; oval dining room wing 1906; later additions to the east)
 * — the oldest governor's residence in the United States still in use —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-executive-mansion.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 36.6 (the walls of OSM
 * way/658620667 run at 36.6° / 126.6°): +y points 36.6° (north-east, the
 * back), +x points 126.6° (south-east, the oval wing); the entrance front
 * with its portico faces -y (216.6°, south-west, toward Capitol Square:
 * the HABS site plan's north arrow puts the forecourt, fountain and gate
 * on that side). Anchor = the outline's centroid, -77.4321437, 37.5384237.
 *
 * Identity (from the photos below):
 *  1. A pale cream (painted brick) two-storey Federal block, five bays,
 *     with tall 6-over-6 windows between dark green-black shutters.
 *  2. The centre: a four-column portico carrying a balustraded balcony,
 *     the fanlit front door under it and a triple window over it.
 *  3. A white cornice and a parapet of balustrade panels hiding a low hip
 *     roof, with a flat railed deck between four tall chimneys.
 *  4. The oval dining room bowing out of the south-east side.
 *
 * Plan: the main block is HABS's 54'8" x 68'4½" (16.66 x 20.84 m; HABS
 * VA-1242 sheet 7, roof plan), set to the north-west part of the OSM
 * outline (x -12.1..4.56, y ±10.42). The east wing fills the rest of the
 * OSM outline (to x 11.1) and the oval room's bow reaches x 13.4, as OSM and
 * the lidar roof show. HABS (1987) shows only the oval room and a small
 * rear block on that side; the rest is a later addition. The front
 * portico (5.5 x 3 m), the side and rear porches follow the HABS roof plan.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, in this frame: the ground falls from 1.7 above y = 0 on the
 * north-west side to 0 at the east wing (y = 0); about 0.9 at the front's
 * middle (FG). Measured: the parapet's top 11.5 above y = 0 (FG + 10.6;
 * lidar edge returns 11.8–12.8), the roof deck 13.6 (lidar 14.5–15.1, drawn
 * lower so the roof stays behind the parapet as in the photos), the chimney
 * tops 15.0, the east wing's roof
 * 10.8–11.6. Estimated from the HABS west-elevation photo, scaled to the
 * 16.66 m front and stretched 1.24x in height to meet the lidar parapet:
 * window sills and heads, the portico (floor FG + 1.25, columns to FG + 6.7,
 * balcony rail to FG + 8.9), the cornice and parapet bands. Deck and
 * chimneys placed from the HABS roof plan.
 *
 * Night: the walls are floodlit; windows glow.
 *
 * Photos and drawings (EVIDENCE):
 *  - 2011-07-10 Virginia Executive Mansion.jpg, Leonard Woody, CC BY-SA 3.0
 *    (the front, through the gate)
 *    https://commons.wikimedia.org/wiki/File:2011-07-10_Virginia_Executive_Mansion.jpg
 *  - West elevation - Governor's Mansion ... HABS VA,44-RICH,8-1, Jack
 *    Boucher, HABS, public domain (the front, square on)
 *    https://commons.wikimedia.org/wiki/File:West_elevation_-_Governor%27s_Mansion,_Capitol_Square,_Richmond,_Independent_City,_VA_HABS_VA.44-RICH,8-1.tif
 *  - HABS VA-1242 sheets 2 (site plan) and 7 (roof plan), public domain
 *    https://commons.wikimedia.org/wiki/File:Governor%27s_Mansion,_Capitol_Square,_Richmond,_Independent_City,_VA_HABS_VA.44-RICH,8-_(sheet_2_of_16).png
 *    https://commons.wikimedia.org/wiki/File:Governor%27s_Mansion,_Capitol_Square,_Richmond,_Independent_City,_VA_HABS_VA.44-RICH,8-_(sheet_7_of_16).png
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no photo of the sides, the back or the east wing was used; their
 * windows repeat the front's rhythm, and the east wing's extent rests on
 * OSM and the lidar roof under trees. The HABS roof plan's own north arrow
 * disagrees with its site plan; the site plan (forecourt to the
 * south-west, toward the Capitol) is followed. Basement windows are left
 * out; the parapet's balustrade panels are drawn solid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { hipRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, prism, save } from './atl-flatiron-building'

const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part()

const X0 = -12.1, X1 = 4.56, Y0 = -10.42, Y1 = 10.42, CX = (X0 + X1) / 2
const FG = 0.9, COR0 = FG + 9.0, COR1 = FG + 9.6, PAR = FG + 10.6, DECK = 13.6
type F = [XY, XY]

// ── main block ──
box(wall, X0, X1, Y0, Y1, 0, COR0, null, 0)
box(trim, X0 - 0.05, X1 + 0.05, Y0 - 0.05, Y1 + 0.05, FG + 1.1, FG + 1.3, null, 0) // water table
box(trim, X0 - 0.35, X1 + 0.35, Y0 - 0.35, Y1 + 0.35, COR0, COR1, trim, 0.25, true)
// parapet: a ring of panels on the cornice
for (const [a0, a1, b0, b1] of [[X0, X1, Y0, Y0 + 0.3], [X0, X1, Y1 - 0.3, Y1], [X0, X0 + 0.3, Y0 + 0.3, Y1 - 0.3], [X1 - 0.3, X1, Y0 + 0.3, Y1 - 0.3]]) box(trim, a0, a1, b0, b1, COR1, PAR, trim, 0.06)
// truncated hip roof to a flat deck
{
  const e = 0.3, z0 = PAR - 0.2, ix = 1.45, iy = 3.6
  const o: V3[] = [[X0 + e, Y0 + e, z0], [X1 - e, Y0 + e, z0], [X1 - e, Y1 - e, z0], [X0 + e, Y1 - e, z0]]
  const i: V3[] = [[CX - ix, -iy, DECK], [CX + ix, -iy, DECK], [CX + ix, iy, DECK], [CX - ix, iy, DECK]]
  for (let k = 0; k < 4; k++) roof.quad(o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k])
  roof.cap(i, true)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(trim, CX + sx * 1.3 - 0.5, CX + sx * 1.3 + 0.5, sy * 3.25 - 0.45, sy * 3.25 + 0.45, DECK - 1.5, 15.0, trim, 0.1)
  for (const sy of [-1, 1]) box(trim, CX - 0.85, CX + 0.85, sy * 3.3 - 0.1, sy * 3.3 + 0.1, DECK, DECK + 0.8, trim, 0)
}

// ── windows, shutters, doors ──
function window2(f: F, s: number, z0: number, z1: number, w = 1.0) {
  onWall(trim, f[0], f[1], rectShape(s - w / 2 - 0.12, s + w / 2 + 0.12, z0 - 0.12, z1 + 0.15), 0.04)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.07)
  for (const k of [-1, 1]) onWall(dark, f[0], f[1], rectShape(s + k * (w / 2 + 0.14), s + k * (w / 2 + 0.14 + 0.52), z0, z1), 0.07)
}
const GF: [number, number] = [FG + 2.2, FG + 4.85], UF: [number, number] = [FG + 6.95, FG + 8.8]
const front: F = [[X0, Y0], [X1, Y0]], back: F = [[X1, Y1], [X0, Y1]]
const west: F = [[X0, Y1], [X0, Y0]]
for (const s of [1.8, 4.4, 12.26, 14.86]) for (const f of [front, back]) { window2(f, s, ...GF); window2(f, s, ...UF) }
for (const f of [front, back]) {
  // the triple window over the portico (front), a plain one (back)
  if (f === front) {
    onWall(trim, f[0], f[1], rectShape(8.33 - 1.55, 8.33 + 1.55, FG + 7.5, FG + 8.95), 0.04)
    onWall(win, f[0], f[1], rectShape(8.33 - 0.6, 8.33 + 0.6, FG + 7.6, FG + 8.8), 0.07)
    for (const k of [-1, 1]) onWall(win, f[0], f[1], rectShape(8.33 + k * 0.75, 8.33 + k * 1.4, FG + 7.6, FG + 8.8), 0.07)
    for (const k of [-1, 1]) onWall(dark, f[0], f[1], rectShape(8.33 + k * 1.6, 8.33 + k * 2.12, FG + 7.6, FG + 8.8), 0.07)
  } else window2(f, 8.33, ...UF)
  // the door with its sidelights and fanlight
  onWall(trim, f[0], f[1], rectShape(8.33 - 1.25, 8.33 + 1.25, FG + 1.25, FG + 4.85), 0.04)
  onWall(dark, f[0], f[1], rectShape(8.33 - 0.62, 8.33 + 0.62, FG + 1.25, FG + 4.0), 0.08)
  for (const k of [-1, 1]) onWall(win, f[0], f[1], rectShape(8.33 + k * 0.75, 8.33 + k * 1.1, FG + 1.5, FG + 4.0), 0.08)
  onWall(win, f[0], f[1], rectShape(8.33 - 0.62, 8.33 + 0.62, FG + 4.12, FG + 4.6), 0.08)
}
for (const s of [3.0, 6.0, 14.84, 17.84]) { window2(west, s, ...GF); window2(west, s, ...UF) }
window2(west, 10.42, ...UF)
{
  const s = 10.42
  onWall(trim, west[0], west[1], rectShape(s - 0.85, s + 0.85, FG + 1.25, FG + 4.6), 0.04)
  onWall(dark, west[0], west[1], rectShape(s - 0.6, s + 0.6, FG + 1.25, FG + 4.0), 0.08)
}

// ── the front portico with its balcony ──
{
  const y0 = Y0, y1 = Y0 - 3.0, h = 2.75
  box(trim, CX - h, CX + h, y1, y0, 0, FG + 1.25, trim, 0.05)
  for (let k = 0; k < 5; k++) box(trim, CX - 1.2, CX + 1.2, y1 - 1.6 + k * 0.32, y1, 0, FG + 0.25 * (k + 1) - 0.0, trim, 0) // steps
  for (const sx of [-2.25, -1.3, 1.3, 2.25]) {
    revolve(trim, [CX + sx, y1 + 0.45], [[0.34, FG + 1.25], [0.34, FG + 1.5], [0.3, FG + 1.55], [0.25, FG + 6.45], [0.36, FG + 6.55], [0.36, FG + 6.7]], 12, 0, false, true)
    revolve(trim, [CX + sx, y0 - 0.3], [[0.3, FG + 1.25], [0.25, FG + 6.45], [0.32, FG + 6.7]], 10, 0, false, true) // the pilasters' columns at the wall
  }
  box(trim, CX - h, CX + h, y1, y0, FG + 6.7, FG + 7.9, trim, 0.12, true)
  // the balcony rail
  for (const [a0, a1, b0, b1] of [[CX - h, CX + h, y1, y1 + 0.2], [CX - h, CX - h + 0.2, y1 + 0.2, y0], [CX + h - 0.2, CX + h, y1 + 0.2, y0]]) box(trim, a0, a1, b0, b1, FG + 7.9, FG + 8.9, trim, 0.04)
}
// ── side (north-west) and rear porches ──
{
  const sy = 0, x1 = X0 - 2.6
  box(trim, x1, X0, sy - 2.7, sy + 2.7, 0, FG + 1.25, trim, 0.05)
  for (const dy of [-2.3, 2.3]) revolve(trim, [x1 + 0.4, sy + dy], [[0.25, FG + 1.25], [0.21, FG + 4.6], [0.28, FG + 4.75]], 10, 0, false, true)
  box(trim, x1, X0, sy - 2.7, sy + 2.7, FG + 4.75, FG + 5.4, roof, 0.1, true)
  const y1 = Y1 + 2.4
  box(trim, CX - 2.3, CX + 2.3, Y1, y1, 0, FG + 1.25, trim, 0.05)
  for (const dx of [-1.9, 1.9]) revolve(trim, [CX + dx, y1 - 0.4], [[0.25, FG + 1.25], [0.21, FG + 4.6], [0.28, FG + 4.75]], 10, 0, false, true)
  box(trim, CX - 2.3, CX + 2.3, Y1, y1, FG + 4.75, FG + 5.4, roof, 0.1, true)
}

// ── the east wing and the oval dining room's bow ──
{
  const W0 = X1, W1 = 11.1, WY0 = Y0 + 0.6, WY1 = Y1 - 0.6, WC = 10.4
  box(wall, W0, W1, WY0, WY1, 0, WC - 0.6, null, 0)
  box(trim, W0, W1 + 0.3, WY0 - 0.3, WY1 + 0.3, WC - 0.6, WC, trim, 0.2, true)
  hipRoof(roof, W0, W1, WY0, WY1, WC, 11.6, 0.1)
  const bow: XY[] = [[W1 - 0.5, -6.3], [11.1, -6.3], [13.4, -3.1], [13.4, 3.1], [11.1, 6.3], [W1 - 0.5, 6.3]]
  prism(wall, bow, 0, WC - 0.6, null, 0)
  const bowTop: XY[] = [[W1 - 0.5, -6.6], [11.3, -6.6], [13.7, -3.25], [13.7, 3.25], [11.3, 6.6], [W1 - 0.5, 6.6]]
  prism(trim, bowTop, WC - 0.6, WC, roof, 0.15)
  // bow windows, two floors
  for (let k = 1; k < 4; k++) {
    const f: F = [bow[k], bow[k + 1]], L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
    window2(f, L / 2, ...GF, 0.95); window2(f, L / 2, FG + 6.6, FG + 8.4, 0.95)
  }
  // the wing's front and back faces
  for (const f of [[[W0, WY0], [W1, WY0]], [[W1, WY1], [W0, WY1]]] as F[]) { window2(f, 3.27, ...GF, 0.95); window2(f, 3.27, FG + 6.6, FG + 8.4, 0.95) }
  // the wing's side either side of the bow
  for (const f of [[[W1, WY0], [W1, -6.3]], [[W1, 6.3], [W1, WY1]]] as F[]) { window2(f, 1.75, ...GF, 0.9); window2(f, 1.75, FG + 6.6, FG + 8.4, 0.9) }
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.7)
await save('ric-executive-mansion', 'Virginia Executive Mansion', [
  { part: wall, material: { ...finish('exec-mansion-cream', 0xf1e8d0), floodlight: lit } },
  { part: trim, material: { ...finish('exec-mansion-trim', 0xf8f5ee), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('exec-mansion-shutter', 0x4a504c) },
], { height: 15.0, anchor: [37.5384237, -77.4321437], bearing: 36.6 })
