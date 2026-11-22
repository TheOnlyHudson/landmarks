/**
 * Indianapolis Central Library: the 1917 building (Paul Philippe Cret with
 * Zantzinger, Borie and Medary) and the 2007 addition (Woollen, Molzan and
 * Partners), 40 East St. Clair Street: procedural, CC0-1.0.
 * bun generators/indy-central-library.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/113050102 (-86.1567402, 39.7785466), which takes in
 * both buildings and the glass atrium between them; the plan is turned 0.58
 * degrees anticlockwise from true north, so the model is drawn square and
 * placed at bearing -0.58. y = 0 is the lowest ground under the outline, on
 * St. Clair Street to the north; the south front stands about 1 m higher
 * (lidar), so its steps start at z 1.0.
 *
 * Identity (from the photos below):
 *  1. The south front on the Mall: a deep screen of fluted Doric columns in
 *     antis between two plain end pavilions, under a long entablature and a
 *     stepped-back attic, all in pale grey-buff marble, over a broad flight
 *     of steps.                                                  (S, lidar)
 *  2. Tall windows in the walls of the old building.              (W)
 *  3. Behind it, the six-storey crescent of the addition: a long curved
 *     glass wall facing the old building, silver metal-panelled ends with
 *     a stainless steel cylinder, a few punched windows.           (W, lidar)
 *  4. The glass atrium joining them, under a glass roof.   (atrium, lidar)
 *
 * Sources
 * - OSM (ODbL): way/113050102 (building=civic, 6 levels): the old building
 *   x -31.5..30.2, y -50.5..-2.6 (its centre recessed 4 m behind the
 *   column screen), the link x -21..20.5 to y 9.5, the crescent from x -60
 *   to 63.7, y 0..37.4.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame. Measured: the old building's
 *   end pavilions 17.5 m over y = 0 (16.6 m above the south ground), the
 *   colonnade entablature 15.6 m, the attic over the centre 19.4 m; the
 *   atrium x -16..18, y -20..10 gives no return (a glass roof); the
 *   addition's roof 32.5 m, its two ends to about 35.7 m; ground 1.5 m on
 *   the south, 0.5 m on the north.
 * - Published (Wikipedia, "Indianapolis Public Library"; NRHP 1975): Greek
 *   Doric, Vermont marble on a granite base, opened 1917; the 2007
 *   addition six storeys with a glass atrium.
 * - Photos (Wikimedia Commons):
 *   "Central Library (Indianapolis-Marion County Public Library) from War
 *   Memorial Plaza.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Central_Library_(Indianapolis-Marion_County_Public_Library)_from_War_Memorial_Plaza.jpg),
 *   the south front square on: eight columns, the end pavilions, the attic,
 *   the steps and doors;
 *   "Indianapolis Central Library - Paul Sableman.jpg" (Paul Sableman, CC BY
 *   2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Central_Library_-_Paul_Sableman.jpg),
 *   the south front close: eight free columns between antae, the steps
 *   running the full width of the front;
 *   "Indianapolis Central Library - west side.jpg" (SounderBruce, CC BY-SA
 *   4.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Central_Library_-_west_side.jpg),
 *   the addition's west end, its curved glass wall and the atrium;
 *   "Indianapolis Public Library, Central Library, August 2019.jpg"
 *   (Momoneymoproblemz, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Public_Library,_Central_Library,_August_2019.jpg),
 *   the atrium's glass roof on white branching columns.
 *
 * Estimated: the column screen (eight columns, 1.6 m thick, 2..14.5 m),
 *   the window sizes, the atrium's height (19 m, about the attic), the
 *   addition's north face (no photo here: drawn as metal panels with bands
 *   of punched windows, like its west end), the cylinder's size.
 * Doubt: no licensed photo of the addition's north face on St. Clair Street
 *   was found (Commons' St. Clair Street photos predate 2007; no Mapillary
 *   token here).
 * Left out: the fluting, the frieze of medallions, the lamp standards, the
 *   sculpture on the plaza, the orange text arch, the atrium's branching
 *   columns.
 * Night: the marble is floodlit; the old windows and the curtain wall
 *   glow; the atrium roof stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, prism, rect, chamfer, lathe, ccw, finishGlb, writeModel, outward } from './sea-tacoma-union-station'
import { windowRow, box, stairs, column, wallLit } from './indy-world-war-memorial'

const stone = new Part(), trim = new Part(), win = new Part(), curtain = new Part(), glass = new Part(), metal = new Part()

// ------------------------------------------------------------ the old building
const S0 = 1.0 // ground on the south
const WING = 17.5, ENT0 = 13.4, ENT = 15.6, ATT = 19.4
const YS = -48.4 // the pavilions' south faces and the column line
// the two end pavilions, full depth to the atrium
for (const [x0, x1] of [[-31.5, -20.9], [17.4, 30.2]]) {
  box(stone, stone, x0, YS, x1, -2.8, 0, WING, 0.3)
  prism(trim, trim, chamfer(rect(x0 - 0.3, YS - 0.3, x1 + 0.3, -2.5), 0.3), WING - 2.2, WING - 1.4)
  // tall windows on the outer flank, in two storeys of bays
  const xo = x0 < 0 ? x0 : x1
  const a: XY = x0 < 0 ? [xo, -2.8] : [xo, YS], b: XY = x0 < 0 ? [xo, YS] : [xo, -2.8]
  windowRow(win, a, b, 6.0, 13.0, 4.6, 2.4, 2.5)
  windowRow(win, a, b, 2.0, 4.2, 4.6, 1.8, 2.5)
  // a small window high in each pavilion's south face
  windowRow(win, [x0, YS], [x1, YS], 9.5, 11.0, 6, 0.6, 4)
}
// the centre block behind the columns, its attic
box(stone, stone, -20.9, -44.6, 17.4, -20.0, 0, ENT)
box(stone, stone, -20.9, -20.0, -16.0, -2.8, 0, WING - 1.4)
box(stone, stone, 16.0, -20.0, 17.4, -2.8, 0, WING - 1.4)
box(stone, trim, -19.0, -42.5, 15.5, -21.0, ENT, ATT, 0.3)
prism(trim, null, chamfer(rect(-19.3, -42.8, 15.8, -20.7), 0.3), ATT - 0.6, ATT)
// the column screen: entablature on eight columns, the steps
{
  const XC = -1.75, N = 8, W = 33.0
  prism(trim, trim, rect(-20.9, YS - 0.2, 17.4, -44.6), ENT0, ENT)
  prism(stone, stone, rect(-20.9, YS + 0.3, 17.4, -44.6), ENT, WING - 1.4)
  for (let k = 0; k < N; k++) {
    const x = XC - W / 2 + (W * (k + 0.5)) / N
    column(trim, x, YS + 1.2, S0 + 1.6, ENT0, 0.8, 10, 1.2)
  }
  // the tall windows and three doors in the wall behind the columns
  windowRow(win, [-20.9, -44.6], [17.4, -44.6], 7.5, 12.6, W / 7, 2.6, 3.4)
  windowRow(win, [-20.9, -44.6], [17.4, -44.6], S0 + 2.0, S0 + 5.6, W / 7, 1.9, 3.4)
  // the steps run the whole width of the front (photos), up to the colonnade floor
  stairs(trim, -31.8, YS - 4.0, 30.5, YS - 0.3, 's', S0, S0 + 1.6, 7)
  prism(trim, null, rect(-20.9, YS - 0.3, 17.4, -44.6), 0, S0 + 1.6)
}
// a plinth course round the old building
prism(trim, null, rect(-31.8, YS - 0.3, 30.5, -2.6), 0, S0 + 1.2)

// ------------------------------------------------------------ the glass atrium
{
  const Z = 19.0
  const r = rect(-16.0, -20.0, 16.0, 9.5)
  // glass walls only where they show (the link's east and west sides), the glass roof
  prism(glass, glass, r, WING - 1.4, Z)
  prism(glass, null, rect(-20.9, -2.8, 18.5, 9.5), 0, WING - 1.4)
  glass.quad([-20.9, -2.8, WING - 1.4], [18.5, -2.8, WING - 1.4], [18.5, 9.5, WING - 1.4], [-20.9, 9.5, WING - 1.4])
  // the white roof ribs over the glass
  for (let k = 0; k <= 5; k++) {
    const y = -20 + (29.5 * k) / 5
    box(trim, trim, -16.2, y - 0.25, 16.2, y + 0.25, Z, Z + 0.4)
  }
}

// ------------------------------------------------------------ the addition: the crescent
{
  const NORTH: XY[] = [[63.7, 21.2], [51.4, 27.7], [32.2, 32.9], [12.5, 36.3], [-4.9, 37.4], [-17.3, 37.0], [-24.9, 36.3], [-38.0, 35.0], [-60.1, 29.3]]
  const SOUTH: XY[] = [[-52.1, 3.2], [-37.4, 7.6], [-21.3, 9.7], [20.5, 9.3], [36.1, 6.4], [53.4, 0.3]]
  const C = ccw([...NORTH, ...SOUTH])
  const Z = 32.5
  prism(metal, metal, C, 0, Z, 20)
  // a parapet line and floor bands of the curtain wall on the south (the curved glass face)
  for (let i = 0; i < SOUTH.length - 1; i++) {
    const a = SOUTH[i], b = SOUTH[i + 1], n = outward(a, b)
    const P = (p: XY, z: number, d = 0.08): V3 => [p[0] + n[0] * d, p[1] + n[1] * d, z]
    curtain.quad(P(a, 0.8), P(b, 0.8), P(b, Z - 1.0), P(a, Z - 1.0))
    for (const z of [6.4, 11.6, 16.8, 22.0, 27.2]) metal.quad(P(a, z, 0.14), P(b, z, 0.14), P(b, z + 0.45, 0.14), P(a, z + 0.45, 0.14))
  }
  // the north face: bands of punched windows between the panels
  for (let i = 0; i < NORTH.length - 1; i++) {
    for (const [z0, z1] of [[2.0, 4.6], [7.4, 9.6], [12.6, 14.8], [17.8, 20.0], [23.0, 25.2], [28.0, 30.2]] as [number, number][]) {
      windowRow(win, NORTH[i], NORTH[i + 1], z0, z1, 3.2, 2.4, 1.2)
    }
  }
  // the ends: the stainless cylinder at the west end, a taller block at the east
  lathe(metal, -57.0, 24.0, [[5.0, 0], [5.0, 35.7], [0.001, 35.7]], 16)
  box(metal, metal, 52.0, 10.0, 62.0, 24.0, Z, 35.7, 0.3)
  // the west end's few windows (photo)
  windowRow(win, [-52.1, 3.2], [-59.5, 19.5], 7.0, 9.0, 4, 3.2, 3.5)
  windowRow(win, [-52.1, 3.2], [-59.5, 19.5], 17.0, 19.0, 4, 3.2, 3.5)
}

const built = finishGlb('Indianapolis Central Library', [
  { part: stone, material: Object.assign(finish('indy-library-marble', 0xe4dccb), { floodlight: wallLit }) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: curtain, material: windowVariant(2, 0x8fb0cc) },
  { part: glass, material: PALETTE.glass },
  { part: metal, material: finish('indy-library-steel', 0xc9ced3, 0.5) },
], { bearing: -0.58, height: 35.7, replaces: ['way/113050102'] }, 5000)

if (import.meta.main) await writeModel('indy-central-library', built)
