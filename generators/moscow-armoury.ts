/**
 * Armoury (Oruzheynaya Palata), Moscow Kremlin: procedural, CC0-1.0, no
 * textures.
 * bun generators/moscow-armoury.ts
 *
 * Konstantin Thon's museum building of 1844-1851 by the Borovitsky gate: a
 * long two-storey block bent at its north-east end, a white rusticated
 * ground storey with round-headed windows in yellow recesses, a yellow
 * upper storey of tall round-headed windows between paired white columns,
 * a white entablature and yellow attic, and a low green hipped roof with a
 * row of yellow chimneys. Kit from moscow-grand-kremlin-palace.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres. The long front
 * onto the Borovitsky passage faces model south. Placed at bearing -41.7
 * degrees, the outline's long wall (compass 48.3). Anchor: area centroid of
 * the OSM outline relation/1359335 (37.6134348, 55.7495828). Built flat;
 * the map drapes it on its terrain (Mapterhorn z12 only here).
 *
 * Evidence
 * - OSM relation/1359335 (outline: the 65 m main range, its chamfered
 *   south-west end, the 25 m wing bent 32 degrees at the north-east end, a
 *   half-octagonal projection on the courtyard side) and its parts: 3427806
 *   (the body, 22 m), the skillion roofs 22-27.5 m, and the raised roof
 *   over the middle 3427823/824/830/843/844/884 (to 30 m). The building
 *   continues north-east as relation/3349392, which is not this model.
 * - Published: built 1844-1851 to Thon's design (en/ru.wikipedia,
 *   "Armoury Chamber").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Jorge Láscar, "Kremlin Armoury building, 2014-10-04.jpg" and "_2.jpg",
 *     CC BY 2.0: the long front nearly straight on.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Armoury_building,_2014-10-04.jpg
 *   - Ludvig14, "MoscowKremlin Armoury2a.jpg", CC BY-SA 3.0: the front and
 *     the bend from the south-east.
 *     https://commons.wikimedia.org/wiki/File:MoscowKremlin_Armoury2a.jpg
 *   - Andrew Bossi, "Borovitskaya Tower and Kremlin Armory.jpg", CC BY-SA
 *     2.0: the front from the east, its storey heights.
 *     https://commons.wikimedia.org/wiki/File:Borovitskaya_Tower_and_Kremlin_Armory.jpg
 *   - Sergey Norin, "Moscow Kremlin - Borovitskaya Tower, Armoury
 *     building.jpg", CC BY 2.0: the south-west end.
 *     https://commons.wikimedia.org/wiki/File:Moscow_Kremlin_-_Borovitskaya_Tower,_Armoury_building.jpg
 *   - Юрий Д.К., "Moscow - 2026 - Armory Chamber.jpg", CC BY 4.0: the roof
 *     over the Kremlin wall from the river.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_2026_-_Armory_Chamber.jpg
 *
 * Measured from Bossi's photo, scaled to a 23.5 m attic top (people in
 * Láscar's photo give 24 m; OSM 22): granite plinth to 1 m, basement
 * windows 2.4-3.2 m, ground-storey windows 5.2-9.0 m, string course
 * 9.6-10.4 m, upper windows 12.0-19.4 m, entablature 19.8-21.3 m, attic to
 * 23.5 m; roof ridge 27.5 m (OSM), the raised middle to 30 m (OSM). Twelve
 * bays on the long front (Láscar, Bossi), five on the bent wing.
 *
 * Estimated or simplified: the paired columns are flat white strips; the
 * upper windows' two tiers of paired lights are one round-headed light
 * with a mullion and a transom; the courtyard (north-west) side has no
 * close photo and gets the same storeys with plain windows; the chimneys
 * are placed at every second bay from Láscar's photo; the roof's cresting
 * is left out.
 *
 * Materials (five): Thon yellow, white trim and stone, window, the green
 * roof, granite grey for the plinth. Floodlit at night like the palace.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel } from './nyc-570-lexington'
import { band, spread } from './nyc-city-hall'
import { slab, hipRing, pyramid, bayWall, panel, frame, rect, ccw, type Row, type XY } from './moscow-grand-kremlin-palace'

const yellow = new Part(), trim = new Part(), win = new Part(), roof = new Part(), granite = new Part()

// ------------------------------------------------------------ plan (OSM, model frame)
// The whole outline, counter-clockwise, simplified to 0.4 m.
const outline: XY[] = [
  [-40.5, -13.1], [24.7, -13.0], [45.9, 0.4], [38.8, 4.5], [38.1, 12.7], [35.6, 16.6], [30.9, 24.1], [19.0, 16.7],
  [22.9, 10.9], [22.1, 8.2], [-0.5, 8.2], [-4.9, 13.7], [-13.0, 13.6], [-17.5, 8.2], [-40.5, 8.3], [-40.6, 6.1],
  [-45.4, 1.8], [-45.3, -7.9], [-40.5, -11.4],
]
const GROUND = 10.4, ENT0 = 19.8, ENT1 = 21.3, EAVE = 23.5, RISE = 4.0

slab(granite, outline, 0, 1.0, null)
slab(trim, outline, 1.0, GROUND, null)
slab(yellow, outline, GROUND, EAVE, roof)
band(trim, ccw(outline), 9.6, GROUND, 0.25)
band(trim, ccw(outline), ENT0, ENT1, 0.35)
band(trim, ccw(outline), EAVE - 0.35, EAVE, 0.3)

// ------------------------------------------------------------ facades
const rows: Row[] = [
  { z0: 2.4, z1: 3.2, w: 1.1, head: 'rect' },
  { z0: 5.2, z1: 9.0, w: 1.9, head: 'round', frame: 0.25 },
  { z0: 12.0, z1: 19.4, w: 2.3, head: 'round', frame: 0.14, mullion: true },
]
/** One front: yellow recesses behind the ground-storey windows, paired white columns upstairs, attic stubs. */
function front(a: XY, b: XY, bays: number, margin = 1.2, full = true) {
  const f = frame(a, b), pitch = (f.L - 2 * margin) / bays
  // yellow arched recesses in the white ground storey
  for (const s of spread(margin, f.L - margin, bays)) panel(yellow, a, b, s, 3.0, 4.4, 9.6, 0.02)
  // paired columns between the upper bays (one strip each at map distance)
  for (let k = 0; k <= bays; k++) {
    const s = margin + k * pitch
    for (const d of [-0.55, 0.55]) {
      const c = Math.min(f.L - 0.3, Math.max(0.3, s + d))
      panel(trim, a, b, c, 0.5, GROUND, ENT0, 0.02)
    }
    panel(trim, a, b, Math.min(f.L - 0.4, Math.max(0.4, s)), 0.8, ENT1, EAVE - 0.35, 0.02)
  }
  bayWall({ win, trim, a, b, bays, margin, rows: full ? rows : rows.map((r) => ({ ...r, mullion: false, frame: 0 })) })
  // the transom across each upper light (two tiers of lights)
  if (full) for (const s of spread(margin, f.L - margin, bays)) panel(trim, a, b, s, 2.3, 15.4, 15.65, 0.06)
}
front([-40.5, -13.1], [24.7, -13.0], 12, 1.3) // the long front (Láscar, Bossi)
front([24.7, -13.0], [45.9, 0.4], 5, 1.0) // the bent wing (Ludvig14)
front([-45.4, 1.8], [-45.3, -7.9], 2, 0.6) // the south-west end (Norin)
front([-45.3, -7.9], [-40.5, -11.4], 1, 0.4)
front([-40.6, 6.1], [-45.4, 1.8], 1, 0.4)
front([45.9, 0.4], [38.8, 4.5], 1, 0.6, false)
front([-17.5, 8.2], [-40.5, 8.3], 4, 1.0, false) // the courtyard side
front([22.1, 8.2], [-0.5, 8.2], 4, 1.0, false)
front([-4.9, 13.7], [-13.0, 13.6], 1, 1.0, false)
front([30.9, 24.1], [19.0, 16.7], 2, 1.0, false)

// ------------------------------------------------------------ roofs
// The main range under a low hip (its chamfered end included), the bent
// wing as a turned rectangle, and the raised middle as a pyramid to 30 m.
const main: XY[] = [[-40.5, -13.1], [24.7, -13.1], [24.7, 8.2], [-40.5, 8.2], [-40.6, 6.1], [-45.4, 1.8], [-45.3, -7.9], [-40.5, -11.4]]
hipRing(roof, main, EAVE, RISE, 10.2)
const u: XY = [0.845, 0.534], n: XY = [-0.534, 0.845], P0: XY = [24.7, -13.0], L = 25.1, D = 22.0
const wing: XY[] = [P0, [P0[0] + u[0] * L, P0[1] + u[1] * L], [P0[0] + u[0] * L + n[0] * D, P0[1] + u[1] * L + n[1] * D], [P0[0] + n[0] * D, P0[1] + n[1] * D]]
hipRing(roof, wing, EAVE, RISE * 10.6 / 10.65, 10.6)
// the half-octagon on the courtyard side, and the raised middle roof
pyramid(roof, ccw([[-17.5, -3.0], [0.5, -3.0], [0.5, 8.2], [-0.5, 8.2], [-4.9, 13.7], [-13.0, 13.6], [-17.5, 8.2]]), EAVE, [-8.6, 4.2, 30.0])

// ------------------------------------------------------------ chimneys
// Yellow stacks with white caps, at every second bay on both slopes (Láscar).
function chimney(x: number, y: number, z0: number) {
  slab(yellow, rect(x - 0.7, y - 0.55, x + 0.7, y + 0.55), z0, z0 + 2.4, null)
  slab(trim, rect(x - 0.85, y - 0.7, x + 0.85, y + 0.7), z0 + 2.4, z0 + 2.75)
}
const along = spread(-38, 22, 6)
for (const x of along) {
  chimney(x, -10.2, EAVE + 0.9) // over the long front
  if (x < -18 || x > 1) chimney(x, 5.3, EAVE + 0.9) // the courtyard slope
}
for (const t of [7, 18]) chimney(P0[0] + u[0] * t + n[0] * 3, P0[1] + u[1] * t + n[1] * 3, EAVE + 0.9)

// ------------------------------------------------------------ write
const lit = (p: V3, nn: V3): number => (nn[2] > 0.7 ? 0.1 : nn[1] < -0.3 || nn[0] > 0.5 ? 0.9 : 0.4)
const parts: { part: Part; material: MaterialSpec }[] = [
  { part: yellow, material: { ...finish('gkp-yellow', 0xe8cc8a), floodlight: lit } },
  { part: trim, material: { ...finish('gkp-white', 0xf6f0e4), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('gkp-green-roof', 0x86ad98) },
  { part: granite, material: finish('armoury-granite', 0x8d8c88) },
]
finishModel('Armoury', 'moscow-armoury', parts, { bearing: -41.7, osm: 'relation/1359335', height: 30 }, 5000)
