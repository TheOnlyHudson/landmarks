/**
 * Niagara Parks Power Station (the Canadian Niagara Power Company's
 * Rankine Generating Station, 1905; closed 2006, a museum since 2021),
 * 7005 Niagara Parkway, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-parks-power-station.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to the building's
 * long axis: bearing 329.85 (the long walls of the OSM outline). In this
 * frame the Niagara Parkway side faces -x (west-south-west), the river
 * side +x, and the entrance front (the south pavilion) -y. Anchor = centre
 * of the OSM outline way/178404800, 43.074510, -79.078820.
 *
 * Ground: Mapterhorn (`bun tools/terrain.ts grid -79.07882 43.07451 100 10
 * --bearing 329.85`) falls about 2.4 m across the building, from the
 * Parkway side (x = -17.75, ~2.6 m) to the river side (x = 17.75, ~0.3 m),
 * and is level along it. y = 0 is the river side's ground; the walls all
 * start at y = 0, and openings start at their own wall's ground (gnd(x)).
 * Eaves are level, set from the mean ground (1.3 m).
 *
 * Identity: a long, plain hall of rough-faced grey limestone under a big
 * hipped slate roof with a green copper cornice; tall round-headed windows
 * along the river side; a one-storey arcaded gallery with a balustraded
 * flat roof along the Parkway side; a taller square entrance pavilion at
 * the south end, its front three great arches (the middle one the door)
 * under a row of small square windows; a lower hipped pavilion at the
 * north end.
 *
 * Evidence:
 * - plan: OSM way/178404800 (building=yes, building:levels=2,
 *   building:material=stone), a 176.6 x 35.5 m rectangle, used whole.
 *   The split into the 11 m Parkway gallery and the 24.5 m hall, and the
 *   pavilions' depths (south 18.3 m, north 16.3 m), are estimated from
 *   the photos (the gallery's south end beside the pavilion in Antony-22's
 *   2023b; the pavilion's side bays in 2023a).
 * - heights: no published figure. Estimated from the south front in
 *   Antony-22's 2023b, scaled by its width (24.5 m) against the doors:
 *   pavilion eave ~13 m above its ground, roof rise ~8 m (2023a, seen from far off, so little foreshortened); the gallery
 *   ~6 m to its parapet; the hall's eave ~11.5 m, lower than the pavilion's
 *   (2023a), roof rise 7.5 m; the north pavilion eave ~10 m, rise 5 m.
 * - openings: the south front's three arches and eight small windows
 *   (2023b); the gallery's arched windows and the hall's row of small
 *   square windows under the eaves (2023a); the river side's tall arched
 *   windows at about 5.5 m centres (Peter Broster's photo).
 * - colours: rough grey-buff limestone (photos ~#a59e8f, pulled to the
 *   palette's lightness), dark grey slate roof (~#5a5c58, pulled light),
 *   green copper cornice (palette patina), slate windows.
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 * - "Niagara Parks Power Station 2023a.jpg", Antony-22, CC BY-SA 4.0
 *   (south front and Parkway side, from the south-south-west)
 * - "Niagara Parks Power Station 2023b.jpg", Antony-22, CC BY-SA 4.0
 *   (the south front, square on)
 * - "Rankine Generating Station.jpg", Peter Broster, CC BY-SA 4.0 (the
 *   river side, from the south-east)
 * No lidar used. No commercial imagery.
 *
 * Doubts: the north end is seen only far off in 2023a (two lower hipped
 * roofs; drawn as the north pavilion and a hipped end on the gallery);
 * the river side's north half and the roof's real pitch are estimated;
 * the balustrade is a plain parapet; the forebay works, railings and the
 * tunnel's lift are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, save, walls, type XY } from './chi-aon-center'
import { archPanel, hipRoof, rect } from './niagara-table-rock-centre'

const W0 = -17.75, GX = -6.75, E0 = 17.75 // the Parkway wall, the hall's west wall, the river wall
const S0 = -88.3, PS = -70, PN = 72, N0 = 88.3 // south end, pavilion fronts, north end
/** The ground under the wall at x, above y = 0. */
const gnd = (x: number) => Math.max(0, 1.3 - 0.062 * x)

function build() {
  const stone = new Part(), roof = new Part(), copper = new Part(), win = new Part(), trim = new Part()

  // --- the Parkway gallery: flat roof behind a parapet, hipped at its north end
  const GT = gnd(W0) + 6
  block(stone, roof, rect(W0, S0, GX, 74), 0, GT, 0.3)
  panel(trim, [W0, 74], [W0, S0], 0, 74 - S0, GT - 1.3, GT - 1.0, 0.06) // the balustrade's base line
  panel(trim, [W0, S0], [GX, S0], 0, GX - W0, GT - 1.3, GT - 1.0, 0.06)
  walls(stone, rect(W0, 74, GX, N0), 0, GT - 0.8)
  hipRoof(roof, W0, 74, GX, N0, GT - 0.8, 3, 0.5, 0.35, copper)
  // arched windows along its west face, at 5 m
  {
    const L = N0 - S0, n = Math.round(L / 5)
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n
      archPanel(win, [W0, N0], [W0, S0], s - 1.0, s + 1.0, gnd(W0) + 0.8, gnd(W0) + 3.6, 0.05, 6)
    }
  }
  // its south end: an arched doorway and a door
  archPanel(win, [W0, S0], [GX, S0], 2.6, 4.8, gnd(-10) + 0, gnd(-10) + 2.4, 0.05, 6)

  // --- the hall: walls to a level eave, the hipped roof with its copper cornice
  const HE = 1.3 + 11.5
  walls(stone, rect(GX, PS, E0, PN), 0, HE)
  hipRoof(roof, GX, PS, E0, PN, HE, 7.5, 0.9, 0.6, copper)
  // small square windows under the eaves on the Parkway side, above the gallery
  for (let s = 1.6; s < PN - PS - 1; s += 2.6) panel(win, [GX, PN], [GX, PS], s - 0.6, s + 0.6, HE - 2.6, HE - 1.4, 0.05)
  // the river side: tall round-headed windows at 5.5 m, a pair of small ones over each
  {
    const L = PN - PS, n = Math.round(L / 5.5), g = gnd(E0)
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n
      archPanel(win, [E0, PS], [E0, PN], s - 1.3, s + 1.3, g + 1.2, g + 6.0, 0.05, 6)
      for (const d of [-1.3, 1.3]) panel(win, [E0, PS], [E0, PN], s + d - 0.5, s + d + 0.5, HE - 2.6, HE - 1.4, 0.05)
    }
  }

  // --- the south entrance pavilion
  const PE = 1.3 + 13
  walls(stone, rect(GX, S0, E0, PS), 0, PE)
  hipRoof(roof, GX, S0, E0, PS, PE, 8, 0.9, 0.6, copper)
  {
    const a: XY = [GX, S0], b: XY = [E0, S0], g = gnd(5.5), W = E0 - GX
    archPanel(win, a, b, W / 2 - 2.9, W / 2 + 2.9, g, g + 6.3, 0.06, 10) // the great door arch
    for (const s of [4.0, W - 4.0]) archPanel(win, a, b, s - 1.7, s + 1.7, g + 1.1, g + 6.5, 0.06, 8)
    for (const s of [3.2, 5.6, 8.0, 10.9, 13.6, 16.5, 18.9, 21.3]) panel(win, a, b, s - 0.55, s + 0.55, PE - 2.4, PE - 1.2, 0.05)
    // a pale stone string course under the small windows
    panel(trim, a, b, 0, W, PE - 3.3, PE - 3.0, 0.07)
    // the river and Parkway sides: three arched windows, small ones above
    const L = PS - S0
    for (const s of [L / 2 - 5.5, L / 2, L / 2 + 5.5]) {
      archPanel(win, [E0, S0], [E0, PS], s - 1.5, s + 1.5, gnd(E0) + 1.2, gnd(E0) + 6.5, 0.05, 8)
      panel(win, [E0, S0], [E0, PS], s - 0.55, s + 0.55, PE - 2.4, PE - 1.2, 0.05)
      panel(win, [GX, PS], [GX, S0], s - 0.55, s + 0.55, PE - 2.4, PE - 1.2, 0.05)
    }
  }

  // --- the north pavilion, lower
  const NE = 1.3 + 10
  walls(stone, rect(GX, PN, E0, N0), 0, NE)
  hipRoof(roof, GX, PN, E0, N0, NE, 5, 0.8, 0.5, copper)
  {
    const W = E0 - GX
    for (const s of [W / 2 - 6, W / 2, W / 2 + 6]) archPanel(win, [E0, N0], [GX, N0], s - 1.4, s + 1.4, gnd(5.5) + 1.2, gnd(5.5) + 5.6, 0.05, 8)
    const L = N0 - PN
    for (const s of [L / 2 - 4, L / 2 + 4]) archPanel(win, [E0, PN], [E0, N0], s - 1.3, s + 1.3, gnd(E0) + 1.2, gnd(E0) + 5.6, 0.05, 6)
  }

  return [
    { part: stone, material: finish('rankine-limestone', 0xcdc5b3) },
    { part: roof, material: finish('rankine-slate-roof', 0x737874) },
    { part: copper, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('niagara-parks-power-station', 'Niagara Parks Power Station', [43.07451, -79.07882], 329.85, build())
