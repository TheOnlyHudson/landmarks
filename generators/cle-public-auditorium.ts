/**
 * Cleveland Public Auditorium (Public Hall, 500 Lakeside Avenue East, 1922,
 * Frank Walker and J. Harry Weeks for the city), with the Music Hall (1929)
 * that shares its stage, on the Group Plan Mall: procedural, CC0-1.0.
 * bun generators/cle-public-auditorium.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 326 (OSM's
 * long walls run 146° / 326°): the Lakeside Avenue end is model north, the
 * Mall front model west. Origin at the centroid of OSM way/131556737
 * (-81.692933, 41.503563). z = 0 is the ground round the building, which is
 * flat to half a metre.
 *
 * Identity, in order: a long, plain Renaissance block of buff limestone,
 * 173 x 63 m, a single cornice and a tall attic round it; on the long sides
 * a row of round-arched upper windows between slightly projecting corner
 * pavilions, a rusticated ground storey, and on the Mall front its arcade
 * of piers, now glazed between; on the Lakeside end five arched windows;
 * over the arena a long, pale, low gable roof, and the Music Hall's tall
 * stage house rising behind it to the south.
 *
 * Evidence:
 *  - plan: OSM way/131556737 (one outline, height 25.3 m, no parts).
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    1 m grid, above the ground: attic top 26.0 (main cornice ~21.5 from
 *    the photos); the arena's gable from its eaves on the long walls to a
 *    ridge at 34.0, running from y = -30 to +56; flat roofs at 25.6 over the
 *    Lakeside end, with a raised block to 29.4, and over the Music Hall end;
 *    the stage house, 30 x 19 m, to 39.6.
 *  - facade: from the photos, scaled to the lidar attic: ground storey to
 *    7 m, arched windows ~2.6 m wide from ~8.4 to ~13.5 m, ~15 along
 *    each long side between the corner pavilions (Cards84664 from the
 *    Convention Center roof); five on the Lakeside end (Drost, Cards84664
 *    2018); in the middle of the Mall front the ground storey between the
 *    piers is glazed right through, the old open arcade (Wehwalt, Mike
 *    Russell).
 *  - colour: buff Indiana limestone (all photos), the arena roof a pale,
 *    almost white grey (Cards84664 from the Convention Center roof).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cleveland_Public_Auditorium.jpg, Erik Drost, CC BY 2.0 (NE corner)
 *  - Cleveland_Public_Auditorium_(2018).jpg, Cards84664, CC BY-SA 4.0 (N end)
 *  - Public_Auditorium_Cleveland.png, Cards84664, CC BY-SA 4.0 (Mall front, W)
 *  - Public_Auditorium_Cleveland_from_Convention_Center_roof.png, Cards84664, CC BY-SA 4.0 (NW)
 *  - Cleveaud.jpg, Wehwalt, CC BY-SA 3.0 (Mall front and its arcade)
 *  - Cleveland_Convention_center_Public_auditorium_1922.jpg, Mike Russell, CC BY-SA 3.0
 *  - Cleveland_Public_Auditorium,_Cleveland,_OH_(28726170948).jpg, Warren LeMay, CC0
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south (Music Hall) end and the east side are drawn like the
 * north end and the west side minus the arcade; no photo used shows them
 * square on. The inscriptions, medallions and the loading docks are left
 * out, as is a small low court in the south-west corner of the roof.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, cornice, panel, relief, gableY, save } from './chi-field-museum'
import { archPanel, parapet, ringTop } from './cle-city-hall'

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), arena = new Part()
  const X = 31.3, YS = -86.6, YN = 86.5
  const BASE = 7.0, CORN = 21.5, TOP = 26.0
  const R = rect(-X, YS, X, YN)

  walls(stone, R, 0, CORN - 1.0)
  cornice(trim, R, CORN - 1.0, CORN, 0.8)
  ringTop(trim, inset(R, -0.32), R, CORN)
  parapet(stone, R, CORN, TOP - 0.4, 0.8)
  parapet(trim, inset(R, -0.15), TOP - 0.4, TOP, 1.0)

  // Corner pavilions, a little proud of the walls and a little higher.
  const PL = 14, PW = 12, PD = 0.45
  for (const [x0, x1] of [[-X - PD, -X + PW], [X - PW, X + PD]])
    for (const [y0, y1] of [[YS - PD, YS + PL], [YN - PL, YN + PD]]) {
      const r = rect(x0, y0, x1, y1)
      walls(stone, r, 0, CORN - 1.0)
      cornice(trim, r, BASE - 0.6, BASE, 0.3)
      cornice(trim, r, CORN - 1.0, CORN, 0.8)
      block(stone, stone, r, CORN, TOP + 0.6, 0.3)
    }

  // Long sides: the row of arched upper windows between the pavilions, and
  // ground-storey openings below them; on the Mall front, the arcade.
  const west: [XY, XY] = [[-X, YN], [-X, YS]], east: [XY, XY] = [[X, YS], [X, YN]]
  const L = YN - YS
  const n = 15, s0 = PL + 2, s1 = L - PL - 2, bw = (s1 - s0) / n
  for (const [a, b] of [west, east]) {
    for (let i = 0; i < n; i++) {
      const sc = s0 + (i + 0.5) * bw
      const yy = a[1] + (b[1] - a[1]) * (sc / L) // model y of this bay
      const arcade = a === west[0] && Math.abs(yy) < 42
      archPanel(win, a, b, sc - 1.3, sc + 1.3, 8.4, 12.2)
      if (arcade) panel(win, a, b, sc - bw / 2 + 0.7, sc + bw / 2 - 0.7, 0.4, 6.0, 0.05)
      else panel(win, a, b, sc - 0.9, sc + 0.9, 2.2, 4.8, 0.05)
    }
    // The string course over the ground storey, broken by the arcade.
    const breaks = a === west[0] ? [[0, YN - 42 - 0.6], [YN + 42 + 0.6, L]] : [[0, L]]
    for (const [b0, b1] of breaks) relief(trim, a, b, b0, b1, BASE - 0.6, BASE, 0.3)
    // Pavilion windows: one arched window high up, two square ones below.
    for (const sc of [PL / 2, L - PL / 2]) {
      archPanel(win, a, b, sc - 1.2, sc + 1.2, 8.6, 12.0, PD + 0.05)
      for (const dz of [2.2, 16.4]) panel(win, a, b, sc - 0.7, sc + 0.7, dz, dz + 2.0, PD + 0.05)
    }
  }
  // Ends: five arched windows between the pavilions, square openings below.
  const north: [XY, XY] = [[X, YN], [-X, YN]], south: [XY, XY] = [[-X, YS], [X, YS]]
  for (const [a, b] of [north, south]) {
    const W = 2 * X
    for (let i = 0; i < 5; i++) {
      const sc = PW + 3 + (i + 0.5) * ((W - 2 * PW - 6) / 5)
      archPanel(win, a, b, sc - 1.3, sc + 1.3, 8.4, 12.2)
      panel(win, a, b, sc - 1.1, sc + 1.1, 1.0, 4.6, 0.05)
    }
    relief(trim, a, b, 0, 2 * X, BASE - 0.6, BASE, 0.3)
    for (const sc of [PW / 2, W - PW / 2]) {
      archPanel(win, a, b, sc - 1.2, sc + 1.2, 8.6, 12.0, PD + 0.05)
      for (const dz of [2.2, 16.4]) panel(win, a, b, sc - 0.7, sc + 0.7, dz, dz + 2.0, PD + 0.05)
    }
  }

  // Roofs: flat over the ends, the arena's long low gable, the stage house.
  cap(roof, inset(R, 0.8), 25.0)
  gableY(arena, stone, -X + 0.8, X - 0.8, -30, 56, 25.6, 34.0)
  block(stone, roof, rect(-24, 56, 24, 64), 25.0, 29.4, 0.3)
  block(stone, null, rect(-15, -50, 15, -31), 25.0, 38.8, 0.3)
  cornice(trim, rect(-15, -50, 15, -31), 38.8, 39.6, 0.4)
  cap(roof, rect(-14.8, -49.8, 14.8, -31.2), 39.6)

  return [
    { part: stone, material: finish('cle-auditorium-limestone', 0xe4d9c4) },
    { part: trim, material: finish('cle-auditorium-limestone-trim', 0xf0e8d9) },
    { part: win, material: PALETTE.window },
    { part: arena, material: finish('cle-auditorium-arena-roof', 0xc9cdcf) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cle-public-auditorium', 'Cleveland Public Auditorium', [41.503563, -81.692933], 326, build())
