/**
 * Hibernia Bank Building, 812 Gravier Street at Carondelet, New Orleans
 * (Favrot & Livaudais, 1921; the tallest building in Louisiana until 1932
 * and in New Orleans until 1965) — procedural, CC0-1.0, no textures.
 * bun generators/nola-hibernia-bank-building.ts
 *
 * Built with the classical kit exported from nola-gallier-hall.ts.
 *
 * Identity check: OSM names the outline "Capital One Bank Building"
 * (way/328669466); Wikipedia ("Hibernia Bank Building (New Orleans)",
 * Q5750709) places the Hibernia Bank Building at 812 Gravier at the corner
 * of Carondelet, 23 storeys and 108 m, which is this outline; the lidar's
 * 105.7 m cupola and every photo below confirm it.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 284.4, square to the Carondelet
 * Street front, so model -y is the front on Carondelet (facing compass
 * 104), model -x is Gravier Street. Anchor: the area centroid of the OSM
 * outline.
 *
 * Identity: the white round tempietto on top (a plinth, a ring of twelve
 * columns round a drum, a cornice with a crenellated crest, an attic drum
 * and a stepped conical dome with a finial), lit in changing colours at
 * night; the square two-stage tower under it with a pediment on its Gravier face;
 * the U-shaped main block of buff stone, two wings rising either side of a
 * light court open to Carondelet, with a heavy cornice and balustrade, an
 * upper order over a belt course; and the three-storey banking hall across
 * the whole front, with four big engaged Corinthian columns and arched
 * windows.
 *
 * Evidence
 * - OSM way/328669466 (height 103.7 from Microsoft footprints, 20 levels):
 *   the plan, 53 m on Carondelet, 34 m deep, the back edge skewed.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground 0.3. Banking hall roof in the
 *   light court 19-22 (x -13..9, y -17..0); the wings and back bar: roof
 *   63.5, parapet 66.4; the tower's first stage 80-82 (x -14..8,
 *   y 2..17), second stage 86-88 (x -10..4); the tempietto's cornice ring
 *   98 (radius ~7 about x -3, y 9.6); the dome to 105.7.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "New Orleans, Louisiana building from Hilton New Orleans.JPG",
 *     TonyTheTiger, CC BY-SA 3.0: the whole building from above (the U,
 *     the light court, the tower stages, the pediment, the tempietto)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_Louisiana_building_from_Hilton_New_Orleans.JPG
 *   - "Hibernia Bank Tower New Orleans November 2024.jpg", Daniel Hartwig,
 *     CC BY 2.0: the Carondelet front and banking hall at night
 *     https://commons.wikimedia.org/wiki/File:Hibernia_Bank_Tower_New_Orleans_November_2024.jpg
 *   - "Hibernia Bank Building-Central Business District-New Orleans.jpg",
 *     Yair Haklai, CC BY-SA 4.0: the tower and tempietto close up
 *     https://commons.wikimedia.org/wiki/File:Hibernia_Bank_Building-Central_Business_District-New_Orleans.jpg
 *   - "Hibernia Dome, New Orleans October 2024.jpg", lukeharold, CC0: the
 *     tempietto and the tower's pediment
 *     https://commons.wikimedia.org/wiki/File:Hibernia_Dome,_New_Orleans_October_2024.jpg
 *   - "New Orleans 6 November 2008 - Hibernia Dome illuminated at night
 *     from Canal Street.jpg", Infrogmation of New Orleans, CC BY-SA 4.0:
 *     the lit tempietto
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_6_November_2008_-_Hibernia_Dome_illuminated_at_night_from_Canal_Street.jpg
 * - Published: Wikipedia: 1921, 23 storeys, 355 ft (108 m), lit in colours
 *   for holidays, once a beacon for river traffic.
 *
 * Measured (lidar): every tier height and extent above. Estimated from the
 * photos: the banking hall's columns and arches, the belt course at 52,
 * the window bays (paired windows, ~3.2 m bays, panels across two
 * storeys), the tempietto's parts (column ring radius 5.6, twelve columns),
 * the stepped dome. The back (north) faces are not photographed face on and
 * repeat the side treatment.
 * Left out: the balustrade's balusters, the pedimented window heads, the
 * lettering, the antenna mast.
 *
 * Night: the tempietto is `neon-*` (it is lit in changing colours, so it
 * glows in its own white); the banking hall front is floodlit; the windows
 * glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, cornice, box, smoothWall, circle, save, type XY } from './atl-flatiron-building'
import { faceOf, fp, fprism, fpanel, farch, fblock, shaft, drum, qf, rect, type Face } from './nola-gallier-hall'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), white = new Part()

const YF = -17.25
const foot: XY[] = [[-28.17, -17.24], [24.58, -17.27], [29.96, 14.99], [2.92, 18.8], [2.98, 16.85], [-26.39, 16.72]]
const HALL = 19.5, BELT = 52, CORN = 63.5, PARA = 66.4

// ── the banking hall across the whole plan ──
prism(stone, foot, 0, HALL, roof, 0.2)
// its attic over the front, the court's parapet
fblock(stone, faceOf([-13, YF], [9, YF]), 0, 22, HALL, 22, 0, -0.6)

// ── the U: two wings and the back bar, round the light court ──
const U: XY[] = [[-28.17, -17.24], [-13, -17.24], [-13, 0], [9, 0], [9, -17.26], [24.58, -17.27], [29.96, 14.99], [2.92, 18.8], [2.98, 16.85], [-26.39, 16.72]]
prism(stone, U, HALL, CORN - 1.5, null, 0)
cornice(trim, U, CORN - 1.5, 1.5, 0.7, null)
prism(stone, U, CORN, PARA, roof, 0.3)
cornice(trim, U, BELT - 0.6, 0.6, 0.3, null)
cornice(trim, foot, HALL - 1.2, 1.2, 0.5, null)

// windows: a panel per bay across two storeys, wall showing as piers and spandrels
function grid(F: Face, s0: number, s1: number, bay: number, z0: number, z1: number, group: number, ratio = 0.5) {
  const n = Math.max(1, Math.round((s1 - s0) / bay)), w = (s1 - s0) / n
  const bands = Math.max(1, Math.round((z1 - z0) / group)), g = (z1 - z0) / bands
  for (let k = 0; k < n; k++) {
    const s = s0 + w * (k + 0.5)
    for (let b = 0; b < bands; b++) fpanel(win, F, s - (w * ratio) / 2, s + (w * ratio) / 2, z0 + b * g + 1.0, z0 + (b + 1) * g - 0.8)
  }
}
for (let i = 0; i < U.length; i++) {
  const F = faceOf(U[i], U[(i + 1) % U.length])
  if (F.L < 4) continue
  grid(F, 1.2, F.L - 1.2, 3.3, HALL + 2.2, BELT - 1.2, 7.2, 0.44)
  grid(F, 1.2, F.L - 1.2, 3.3, BELT + 0.6, CORN - 2.2, 9.0, 0.42)
  // the upper order: a pilaster between every bay
  const n = Math.max(1, Math.round((F.L - 2.4) / 3.3)), w = (F.L - 2.4) / n
  for (let k = 1; k < n; k++) fblock(stone, F, 1.2 + k * w - 0.35, 1.2 + k * w + 0.35, BELT, CORN - 1.5, 0.25)
  // the upper order's pilasters at the corners
  fblock(stone, F, 0, 1.2, BELT, CORN - 1.5, 0.3)
  fblock(stone, F, F.L - 1.2, F.L, BELT, CORN - 1.5, 0.3)
}

// ── the banking hall front: four engaged Corinthian columns, arched windows ──
const front = faceOf([-28.17, YF], [24.58, YF])
const sx = (x: number) => x + 28.17
for (const x of [-11.3, -5.1, 1.1, 7.3]) {
  const c = fp(front, sx(x), 0.15, 0)
  drum(trim, c[0], c[1], 1.05, 0, 1.6, 12)
  shaft(trim, c[0], c[1], 0.85, 0.78, 1.6, 14.4, 12)
  const ring = circle([c[0], c[1]], 0.78, 12)
  // the Corinthian bell, flaring
  for (let i = 0; i < 12; i++) {
    const j = (i + 1) % 12, a = (i + 0.5) / 12 * 2 * Math.PI
    const P = (q: XY, r: number, z: number): V3 => [c[0] + (q[0] - c[0]) * r, c[1] + (q[1] - c[1]) * r, z]
    qf(trim, P(ring[i], 1, 14.4), P(ring[j], 1, 14.4), P(ring[j], 1.45, 15.9), P(ring[i], 1.45, 15.9), [Math.cos(a), Math.sin(a), -0.3])
  }
  box(trim, c[0] - 1.2, c[0] + 1.2, c[1] - 1.2, c[1] + 1.2, 15.9, 16.4, trim, 0.08)
}
fblock(trim, front, sx(-13), sx(9), 16.4, HALL - 1.2, 0.5) // entablature over the columns
for (const x of [-8.2, -2.0, 4.2]) farch(win, front, sx(x), 4.0, 2.0, 14.6)
fpanel(win, front, sx(-2.0) - 1.3, sx(-2.0) + 1.3, 0.3, 2.0, 0.06)
for (const x of [-20.5, 16.8]) {
  farch(win, front, sx(x), 4.6, 3.0, 15.0)
  fblock(stone, front, sx(x) - 4.6, sx(x) - 3.5, 0.6, 16.4, 0.3)
  fblock(stone, front, sx(x) + 3.5, sx(x) + 4.6, 0.6, 16.4, 0.3)
}
// the Gravier side of the hall: arched windows
{
  const F = faceOf([-26.39, 16.72], [-28.17, -17.24])
  for (let k = 0; k < 5; k++) farch(win, F, 3.5 + k * 6.8, 3.6, 3.0, 14.6)
}
// court-facing walls of the wings: windows too
grid(faceOf([-13, -17.24], [-13, 0]), 1, 16, 3.3, HALL + 2.2, CORN - 2.2, 7.2)
grid(faceOf([9, 0], [9, -17.26]), 1, 16, 3.3, HALL + 2.2, CORN - 2.2, 7.2)
grid(faceOf([-13, 0], [9, 0]), 1, 21, 3.3, HALL + 2.2, CORN - 2.2, 7.2)

// ── the tower: two square stages ──
box(stone, -14, 8, 2, 16.8, PARA - 1, 80.6, null, 0)
cornice(trim, rect(-14, 2, 8, 16.8), 80.6, 1.4, 0.6, roof)
const tf1 = faceOf([-14, 2], [8, 2])
grid(tf1, 2.5, 19.5, 3.3, PARA + 0.5, 79.6, 6.6, 0.45)
grid(faceOf([8, 2], [8, 16.8]), 1.5, 13.3, 3.3, PARA + 0.5, 79.6, 6.6, 0.45)
grid(faceOf([-14, 16.8], [-14, 2]), 1.5, 13.3, 3.3, PARA + 0.5, 79.6, 6.6, 0.45)
fblock(stone, tf1, 0, 2.2, PARA, 80.6, 0.4)
fblock(stone, tf1, 19.8, 22, PARA, 80.6, 0.4)
// the pediment is on the Gravier face (the photo from the Hilton)
const tfw = faceOf([-14, 16.8], [-14, 2])
fprism(trim, tfw, [[0.8, 80.6], [14.0, 80.6], [7.4, 83.4]], -1.5, 0.6)
fblock(stone, tfw, 0, 1.6, PARA, 80.6, 0.4)
fblock(stone, tfw, 13.2, 14.8, PARA, 80.6, 0.4)
box(stone, -10.2, 4.2, 3.2, 16, 80.6, 88, roof, 0.3)
cornice(trim, rect(-10.2, 3.2, 4.2, 16), 86.8, 1.2, 0.4, null)
for (const F of [faceOf([-10.2, 3.2], [4.2, 3.2]), faceOf([4.2, 3.2], [4.2, 16]), faceOf([4.2, 16], [-10.2, 16]), faceOf([-10.2, 16], [-10.2, 3.2])]) {
  for (const s of [F.L * 0.3, F.L * 0.7]) fpanel(win, F, s - 0.6, s + 0.6, 82.2, 85.6)
}

// ── the tempietto ──
const CX = -3, CY = 9.6
const disc = (p: Part, r: number, z0: number, z1: number, n = 16) => drum(p, CX, CY, r, z0, z1, n)
disc(white, 6.3, 88, 89.4)
disc(white, 5.9, 89.4, 90.2)
disc(white, 4.5, 90.2, 97.0, 16) // the drum behind the columns
for (let k = 0; k < 12; k++) {
  const a = (k / 12) * 2 * Math.PI + Math.PI / 12, x = CX + 5.5 * Math.cos(a), y = CY + 5.5 * Math.sin(a)
  shaft(white, x, y, 0.42, 0.38, 90.2, 96.6, 8)
}
// the entablature ring, the crenellated crest, the attic drum
disc(white, 6.3, 96.6, 98.0)
for (let k = 0; k < 16; k++) {
  const a = (k / 16) * 2 * Math.PI, x = CX + 6.0 * Math.cos(a), y = CY + 6.0 * Math.sin(a)
  box(white, x - 0.4, x + 0.4, y - 0.4, y + 0.4, 98.0, 98.8, white, 0.1)
}
disc(white, 4.3, 98.0, 100.6)
disc(white, 4.6, 100.6, 101.0)
// the stepped cone: four rings stepping in
const steps: [number, number, number][] = [[4.1, 101.0, 102.0], [3.2, 102.0, 103.0], [2.3, 103.0, 104.0], [1.4, 104.0, 104.9]]
for (const [r, z0, z1] of steps) {
  const lower = circle([CX, CY], r, 16), upper = circle([CX, CY], r * 0.82, 16)
  smoothWall(white, lower, z0, z0 + 0.3)
  for (let i = 0; i < 16; i++) {
    const j = (i + 1) % 16, a = ((i + 0.5) / 16) * 2 * Math.PI
    qf(white, [lower[i][0], lower[i][1], z0 + 0.3], [lower[j][0], lower[j][1], z0 + 0.3], [upper[j][0], upper[j][1], z1], [upper[i][0], upper[i][1], z1], [Math.cos(a), Math.sin(a), 1.5])
  }
}
disc(white, 0.9, 104.9, 105.4, 10)
shaft(white, CX, CY, 0.25, 0.12, 105.4, 107.0, 6)

const hallLight = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[1] < YF + 1.5 && p[2] < 23 ? 0.9 : 0)
await save('nola-hibernia-bank-building', 'Hibernia Bank Building', [
  { part: stone, material: { ...finish('hibernia-stone', 0xd8cfbf), floodlight: hallLight } },
  { part: trim, material: { ...finish('hibernia-trim', 0xece5d8), floodlight: hallLight } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: white, material: finish('neon-hibernia-tempietto', 0xf6f5f1) },
], { bearing: 284.4, osm: 'way/328669466', height: 107 }, 6500)
