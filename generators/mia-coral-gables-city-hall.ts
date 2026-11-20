/**
 * Coral Gables City Hall (405 Biltmore Way; 1928, Phineas Paist with
 * Harold Steward and Denman Fink) — original procedural geometry, CC0-1.0.
 * bun generators/mia-coral-gables-city-hall.ts
 *
 * Map frame: model +y points along the bearing (41°, out of the
 * semicircular front), +x to its right (131°); metres; origin at the anchor
 * on the ground. Anchor = centroid of the OSM outline way/416557593,
 * 25.7492372, -80.2635687. Its walls run at 41° / 131°.
 *
 * Identity, in order: the semicircular front, a rusticated base storey
 * carrying a two-storey ring of giant columns with an entablature and
 * balustrade; the three-tier clock tower rising behind it (a square base
 * stage with an arched window, a narrower clock stage with cut corners,
 * the iron bell frame on top); the plain three-storey block of pale coral
 * stone under a low tile hipped roof.
 *
 * Night: the whole building is floodlit warm (`floodlight` on stone and
 * trim, brightest on the colonnade and tower); windows glow.
 *
 * Evidence:
 *  - plan: OSM outline way/416557593 (building=government_office) and
 *    building:part way/450842966 (the tower, 5 m square). In the model
 *    frame: main block x -8..24.7, y -5.5..11.3; the semicircle centred on
 *    (8.8, 11.3), radius 10.7 (fitted to the outline's 15 arc points); the
 *    one-storey rear wing x 19.7..24.6, y -24.8..-5.6.
 *  - heights: lidar, NOAA Digital Coast EPT 10338 (2021 Florida coastal
 *    topobathy, public domain; no USGS 3DEP points here), 0.5 m grid, above
 *    the street (0.9 m over the dataset's lowest return): main eaves 13.9,
 *    hip ridge 15.5; colonnade roof 11.3 with its balustrade to ~12.6;
 *    tower base stage 19.4, clock stage 25.8, bell frame ~28; rear wing 4.5.
 *  - storeys, column count (12 over the half-circle, from the photos),
 *    windows, tower stages: the photos below, scaled by the outline.
 *  - colour: pale grey-cream coral rock, lighter columns and balustrade,
 *    green-framed windows (drawn as `window`), red tile.
 *
 * Photos (Wikimedia Commons):
 *  - Coral_Gables_City_Hall_(30475918076).jpg (Phillip Pessar, CC BY 2.0),
 *    the semicircular front and tower
 *  - Coral_Gables_FL_city_hall02.jpg (Ebyabe, CC BY-SA 3.0), the rear
 *    (south-west) front and the tower
 *  - Coral_Gables_FL_city_hall01.jpg (Ebyabe, CC BY-SA 3.0)
 *  - Coral_Gables_City_Hall_at_night.jpg (Jesper Rautell Balle, CC BY 3.0),
 *    night, floodlit
 * No look-only sources. No commercial imagery.
 *
 * Left out: the baroque cartouche on the balustrade (its position on the
 * ring couldn't be fixed from the photos), the urns and finials, the
 * fountain and statue in front, window surrounds, the iron railing in the
 * colonnade. Building way/450843012 behind the block is a separate
 * building and isn't drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel, cornice, parapet, ring, at } from './mia-freedom-tower'
import { cols, faces, hip, punched, solid } from './mia-vizcaya'

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), tile = new Part(), metal = new Part()

  // --- Main block.
  const MB = [-8, -5.5, 24.7, 11.3] as const
  solid(stone, MB[0], MB[1], MB[2], MB[3], 0, 13.9, null)
  hip(tile, MB[0], MB[1], MB[2], MB[3], 13.9, 15.5, 0.6)
  const F = faces(MB[0], MB[1], MB[2], MB[3]) // south(rear), east, north(front), west
  for (const [a, b] of F) panel(trim, a, b, 0, onWall(a, b).L, 12.9, 13.9, 0.06) // cornice band
  for (const [a, b] of F) panel(trim, a, b, 0, onWall(a, b).L, 0, 1.0, 0.05) // plinth
  const G: [number, number] = [1.6, 3.6], R2: [number, number] = [5.2, 7.6], R3: [number, number] = [10.0, 11.8]
  // Rear front: seven columns, the arched entrance bay in the middle.
  {
    const [a, b] = F[0], L = MB[2] - MB[0], m = L / 2
    punched(win, a, b, cols(L, 7, 2.6).filter((_, i) => i !== 3), 1.5, [G, R2, R3])
    archPanel(win, a, b, m - 1.5, m + 1.5, 0.3, 7.0, 0.05, 8)
    punched(win, a, b, [m], 1.3, [R3])
  }
  // The short sides: three columns.
  for (const i of [1, 3]) punched(win, F[i][0], F[i][1], cols(MB[3] - MB[1], 3, 3), 1.5, [G, R2, R3])
  // Front, beside the semicircle.
  punched(win, F[2][0], F[2][1], [3.0, 30.0], 1.5, [G, R2, R3])

  // --- Rear wing, one storey.
  solid(stone, 19.7, -24.8, 24.6, -5.5, 0, 4.5, stone)
  for (const [a, b] of faces(19.7, -24.8, 24.6, -5.5).slice(0, 2)) punched(win, a, b, cols(onWall(a, b).L, onWall(a, b).L > 8 ? 5 : 1, 2), 1.3, [[1.2, 3.4]])

  // --- The semicircular front.
  const CX = 8.8, CY = 11.3, RO = 10.7, RI = 8.3, RC = 9.75, N = 12
  const arc = (r: number, n = 24): XY[] => Array.from({ length: n + 1 }, (_, k) => [CX + r * Math.cos((Math.PI * k) / n), CY + r * Math.sin((Math.PI * k) / n)] as XY)
  const O = arc(RO), I = arc(RI)
  // Base storey, rusticated, with a window between each pair of columns.
  walls(stone, O, 0, 4.6)
  ring(stone, O, I, 4.6)
  for (let k = 0; k < O.length - 1; k++) {
    if (k % 2 === 0) continue
    panel(win, O[k - 1], O[k + 1], onWall(O[k - 1], O[k + 1]).L / 2 - 0.75, onWall(O[k - 1], O[k + 1]).L / 2 + 0.75, 1.3, 3.6, 0.08)
  }
  // Inner wall of the colonnade, two storeys of windows.
  walls(stone, I, 4.6, 10.6)
  for (let k = 0; k < I.length - 1; k++) {
    if (k % 2 === 0) continue
    const a = I[k - 1], b = I[k + 1], L = onWall(a, b).L
    panel(win, a, b, L / 2 - 0.7, L / 2 + 0.7, 5.4, 7.6, 0.05)
    panel(win, a, b, L / 2 - 0.6, L / 2 + 0.6, 8.3, 10.0, 0.05)
  }
  // Twelve giant columns.
  for (let k = 0; k < N; k++) {
    const t = (Math.PI * (k + 0.5)) / N
    const x = CX + RC * Math.cos(t), y = CY + RC * Math.sin(t)
    lathe(trim, x, y, [[0.62, 4.6], [0.62, 5.0], [0.46, 5.1], [0.4, 9.9], [0.62, 10.2], [0.62, 10.6]], 8)
  }
  // Entablature, the ring's roof, the balustrade.
  const Oe = arc(RO + 0.2)
  walls(trim, Oe, 10.6, 11.6)
  ring(trim, Oe, I, 11.6)
  ring(trim, I, Oe, 10.6) // its soffit, facing down
  const Ob = arc(RO + 0.05), Ib = arc(RO - 0.3)
  walls(trim, Ob, 11.6, 12.6)
  walls(trim, [...Ib].reverse(), 11.6, 12.6)
  ring(trim, Ob, Ib, 12.6)

  // --- Clock tower: base stage 6.4 m square, clock stage with cut corners,
  // bell frame. Centred on the OSM part (8.35, 7.1).
  const TX = 8.35, TY = 7.1
  const T1 = at(rect(-3.2, -3.2, 3.2, 3.2), TX, TY)
  walls(stone, T1, 12, 19.4)
  cornice(trim, T1, 18.8, 19.2, 19.6, 0.35)
  cap(stone, T1, 19.4)
  parapet(trim, at(rect(-3.5, -3.5, 3.5, 3.5), TX, TY), 19.6, 20.3, 0.25)
  for (let i = 0; i < 4; i++) archPanel(win, T1[i], T1[(i + 1) % 4], 2.3, 4.1, 16.0, 17.6, 0.05, 8)
  // A tile skirt at its foot on the main roof.
  hip(tile, TX - 4.0, TY - 4.0, TX + 4.0, TY + 4.0, 15.0, 15.9, 0.0)
  const T2 = chamfer(at(rect(-2.1, -2.1, 2.1, 2.1), TX, TY), 0.6)
  walls(stone, T2, 19.4, 25.0)
  cornice(trim, T2, 25.0, 25.4, 25.8, 0.3)
  parapet(trim, chamfer(at(rect(-2.4, -2.4, 2.4, 2.4), TX, TY), 0.7), 25.8, 26.3, 0.2)
  cap(stone, T2, 25.4)
  const q = at(rect(-2.1, -2.1, 2.1, 2.1), TX, TY)
  for (let i = 0; i < 4; i++) {
    const { P } = onWall(q[i], q[(i + 1) % 4])
    // Clock face: a pale disc with a dark ring.
    const c = P(2.1, 23.2, 0.06)
    disc(trim, q[i], q[(i + 1) % 4], 2.1, 23.2, 1.05, 0.06)
    disc(win, q[i], q[(i + 1) % 4], 2.1, 23.2, 0.75, 0.09)
    void c
  }
  // The iron bell frame: four posts and a small cap.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) solid(metal, TX + sx * 0.9 - 0.1, TY + sy * 0.9 - 0.1, TX + sx * 0.9 + 0.1, TY + sy * 0.9 + 0.1, 25.4, 27.4)
  hip(metal, TX - 1.1, TY - 1.1, TX + 1.1, TY + 1.1, 27.4, 28.1, 0.1)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.55 + 0.35 * Math.min(1, p[2] / 26))
  return [
    { part: stone, material: { ...finish('cg-coral', 0xe9e1d1), floodlight: lit } },
    { part: trim, material: { ...finish('cg-trim', 0xf4eee2), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: PALETTE.terracotta },
    { part: metal, material: finish('cg-iron', 0x4f555c) },
  ]
}

/** A round disc on wall a→b. */
function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out: number, seg = 14) {
  const { P } = onWall(a, b)
  const c = P(s, z, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

if (import.meta.main) await save('mia-coral-gables-city-hall', 'Coral Gables City Hall', [25.7492372, -80.2635687], 41, build(), 5000)
