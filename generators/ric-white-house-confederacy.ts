/**
 * The White House of the Confederacy (the Brockenbrough House), 1201 East
 * Clay Street, Richmond, Virginia (1818, attributed to Robert Mills; the
 * Confederate executive mansion 1861–65) — original procedural geometry,
 * CC0-1.0.
 * bun generators/ric-white-house-confederacy.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36.7 (the street grid): the Clay Street front at
 * +y, the garden front with its portico at -y. Anchor = the centroid of OSM
 * way/224601753 (building=yes, tourism=museum), -77.4296017, 37.5407120.
 *
 * Identity (from the photos below):
 *  1. A tall, plain, three-storey grey stuccoed house on a raised basement,
 *     with a deep white dentilled cornice and a low hipped roof.
 *  2. The garden front: a full-width two-storey portico of tall plain
 *     columns in pairs (outer pairs and a pair either side of the centre
 *     door), a white entablature and flat roof, up a flight of iron steps.
 *  3. The Clay Street front: five bays of white-framed sash windows and a
 *     small Ionic entrance porch; the west end blank with three tall
 *     recessed panels.
 *
 * Plan: OSM way/224601753 in this frame: x -11.9..11.9, y -8.5..8.5;
 * from the lidar, the house is y -4.5..8.5 and the portico y -8.5..-4.5.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame. y = 0 is the lowest ground (the garden on
 * the south-east); Clay Street is 0.8 m higher, the west end 1.3 m. Above
 * y = 0: eaves 15.5, roof peak 16.7, portico roof 12.8, chimneys 17.2.
 * Estimated from the photos, scaled to those: the basement (1.7), the
 * floor levels (5.6, 9.7), the window sizes, the column pairs (0.9 m
 * across), the entrance porch.
 *
 * Ground: elevation 0.
 *
 * Night: the house is lit by street lamps only; windows glow.
 *
 * Photos (all EVIDENCE):
 *  - The White House of the Confederacy.JPG, Alana Iesu, CC BY-SA 3.0 (the
 *    Clay Street front, the blank west end and the portico's end)
 *    https://commons.wikimedia.org/wiki/File:The_White_House_of_the_Confederacy.JPG
 *  - White House of the Confederacy 2007.JPG, Ad Meskens, CC BY-SA 3.0 (the
 *    portico's centre bay)
 *    https://commons.wikimedia.org/wiki/File:White_House_of_the_Confederacy_2007.JPG
 *  - White House of the Confederacy, Richmond, Virginia (10476303303).jpg,
 *    Gary Todd, CC0 (the Clay Street front and east end)
 *    https://commons.wikimedia.org/wiki/File:White_House_of_the_Confederacy,_Richmond,_Virginia_(10476303303).jpg
 *  - White House of the Confederacy, Richmond, Virginia (10475897204).jpg,
 *    Gary Todd, CC0 (the garden front and portico)
 *    https://commons.wikimedia.org/wiki/File:White_House_of_the_Confederacy,_Richmond,_Virginia_(10475897204).jpg
 *  - USGS NAIP orthoimagery (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east end's windows follow p3 loosely; the portico's outer
 * column pairs at the east end are hidden by trees in p4 and mirrored
 * from the west.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { hipRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, column, save } from './atl-flatiron-building'

const stucco = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part()

const X0 = -11.9, X1 = 11.9, Y0 = -4.5, Y1 = 8.5, YP = -8.5
const EAVE = 15.5, PEAK = 16.7, BASE = 1.7, F2 = 5.6, F3 = 9.7, PTOP = 12.8
type F = [XY, XY]

// ── The house ──
box(stucco, X0, X1, Y0, Y1, 0, EAVE - 0.9, null, 0)
// the white dentilled cornice: a fascia and a projecting crown
box(trim, X0 - 0.15, X1 + 0.15, Y0 - 0.15, Y1 + 0.15, EAVE - 0.9, EAVE - 0.35, null, 0)
box(trim, X0 - 0.55, X1 + 0.55, Y0 - 0.55, Y1 + 0.55, EAVE - 0.35, EAVE, null, 0.12)
hipRoof(roof, X0 + 0.2, X1 - 0.2, Y0 + 0.2, Y1 - 0.2, EAVE, PEAK, 0)
// chimneys on the end walls
for (const x of [X0 + 0.9, X1 - 0.9]) for (const y of [-0.5, 5.0]) box(stucco, x - 0.55, x + 0.55, y - 0.9, y + 0.9, EAVE - 1, 17.2, stucco, 0.08)
// string course at the first floor and a basement water table
for (const z of [BASE, F2 - 0.3]) box(stucco, X0 - 0.08, X1 + 0.08, Y0 - 0.08, Y1 + 0.08, z - 0.25, z, null, 0)

// ── Windows ──
function sash(f: F, s: number, z0: number, w: number, h: number) {
  onWall(trim, f[0], f[1], rectShape(s - w / 2 - 0.18, s + w / 2 + 0.18, z0 - 0.15, z0 + h + 0.18), 0.04)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z0 + h), 0.07)
}
const N: F = [[X1, Y1], [X0, Y1]], S: F = [[X0, Y0], [X1, Y0]], E: F = [[X1, Y0], [X1, Y1]], Wf: F = [[X0, Y1], [X0, Y0]]
const L = X1 - X0
// Clay Street: five bays, the door in the middle under the porch
for (let i = 0; i < 5; i++) {
  const s = L / 2 + (i - 2) * 4.3
  if (i !== 2) sash(N, s, 0.8 + BASE + 0.9, 1.2, 2.6)
  sash(N, s, F2 + 0.9, 1.2, 2.5)
  sash(N, s, F3 + 0.8, 1.1, 1.9)
}
// the entrance porch: two Ionic columns, flat roof, the door with its fanlight
{
  const x0 = -1.8, x1 = 1.8, PF = 0.8 + BASE
  box(stucco, x0 - 0.2, x1 + 0.2, Y1, Y1 + 2.6, 0, PF, trim, 0.05)
  for (const x of [x0 + 0.35, x1 - 0.35]) {
    column(trim, [x, Y1 + 2.15], 0.24, PF, PF + 3.2, 10)
    revolve(trim, [x, Y1 + 2.15], [[0.3, PF + 3.2], [0.38, PF + 3.45]], 8, 0, true, true)
  }
  box(trim, x0 - 0.2, x1 + 0.2, Y1, Y1 + 2.6, PF + 3.45, PF + 4.2, trim, 0.08)
  onWall(dark, N[0], N[1], rectShape(L / 2 - 0.65, L / 2 + 0.65, PF, PF + 2.7), 0.08)
  onWall(win, N[0], N[1], rectShape(L / 2 - 0.65, L / 2 + 0.65, PF + 2.8, PF + 3.3), 0.08)
}
// the west end: three tall blind panels (p1)
{
  const l = Y1 - Y0
  for (const s of [l / 2 - 3.6, l / 2, l / 2 + 3.6]) onWall(stucco, Wf[0], Wf[1], rectShape(s - 1.3, s + 1.3, BASE + 0.6, F3 + 2.6), 0.1)
}
// the east end: windows in two bays
{
  const l = Y1 - Y0
  for (const s of [l / 2 - 2.4, l / 2 + 2.4]) {
    sash(E, s, BASE + 0.9, 1.2, 2.6)
    sash(E, s, F2 + 0.9, 1.2, 2.5)
    sash(E, s, F3 + 0.8, 1.1, 1.9)
  }
}
// the garden front, behind the portico: tripartite windows and the centre door
for (const k of [-2, -1, 0, 1, 2]) {
  const s = L / 2 + k * 4.3
  if (k === 0) {
    onWall(trim, S[0], S[1], rectShape(s - 1.15, s + 1.15, BASE, BASE + 3.3), 0.04)
    onWall(dark, S[0], S[1], rectShape(s - 0.95, s + 0.95, BASE, BASE + 3.1), 0.07)
  } else sash(S, s, BASE + 0.8, 1.7, 2.6)
  sash(S, s, F2 + 1.2, 1.9, 1.7)
}

// ── The garden portico ──
{
  const yc = YP + 0.7
  box(stucco, X0, X1, YP, Y0, 0, BASE, trim, 0.05) // the porch floor over the basement
  for (const xc of [-10.3, -3.2, 3.2, 10.3]) for (const dx of [-0.65, 0.65]) {
    const c: XY = [xc + dx, yc]
    column(trim, c, 0.45, BASE, PTOP - 1.6, 12)
    revolve(trim, c, [[0.47, PTOP - 1.6], [0.6, PTOP - 1.4]], 10, 0, true, false)
    box(trim, c[0] - 0.62, c[0] + 0.62, c[1] - 0.62, c[1] + 0.62, PTOP - 1.4, PTOP - 1.25, null, 0)
  }
  box(trim, X0 - 0.1, X1 + 0.1, YP - 0.1, Y0, PTOP - 1.25, PTOP, roof, 0.1)
  // the iron steps down to the garden
  box(dark, -1.0, 1.0, YP - 2.2, YP, 0, 0.35, dark, 0)
  {
    const a: V3 = [-1.0, YP - 2.2, 0.35], b: V3 = [1.0, YP - 2.2, 0.35], c: V3 = [1.0, YP, BASE], d: V3 = [-1.0, YP, BASE]
    dark.quad(a, b, c, d)
  }
}

await save('ric-white-house-confederacy', 'White House of the Confederacy', [
  { part: stucco, material: finish('confederacy-stucco', 0xc4c7c2) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('confederacy-roof', 0x8f969b) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('confederacy-iron', 0x4a4f57) },
], { height: 17.2, anchor: [37.540712, -77.4296017], bearing: 36.7 })
