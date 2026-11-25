/**
 * Birch Bayh Federal Building and U.S. Courthouse, 46 East Ohio Street,
 * Indianapolis (1902-05, Rankin, Kellogg and Crane; enlarged 1938):
 * procedural, CC0-1.0.
 * bun generators/indy-birch-bayh-federal-building.ts [out.glb]
 *
 * Plan frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/339570749 (-86.1570453, 39.7707300). The block is
 * turned 1.7 degrees clockwise from true north, so the model is drawn square
 * and placed at bearing 1.7. y = 0 is the street; downtown is flat (lidar
 * ground within 0.3 m round the block).
 *
 * Identity (from the photos below):
 *  1. The long Ohio Street (south) front: a screen of giant fluted Ionic
 *     columns, three storeys tall, standing just in front of the wall on a
 *     balustraded terrace, under a deep entablature (the inscription frieze)
 *     and a balustrade.                                          (p3, p9)
 *  2. A taller end pavilion at each end of that front: plain piers, two
 *     Ionic columns in antis framing one tall window over a pedimented
 *     door, steps up to it, an attic with a carved panel.   (p3, p9, x4)
 *  3. Pale grey-buff limestone all round, windows in tall bays.
 *  4. A hollow plan: four wings round a low-roofed middle court; the north
 *     part of the block stands a storey higher.              (lidar, x1)
 *
 * Sources
 * - OSM (ODbL): way/339570749 (building=civic, amenity=courthouse, 3 levels
 *   + roof level). In the model frame: the south pavilions x -52.8..-31.6 and
 *   31.9..53.5 to y -49.4, the colonnade wall y -45.2 between x +-29.6, the
 *   side walls x -52.3 and 52.1 with entrance blocks to +-55 at y -35..-19,
 *   the north pavilions to y 48.6 and the north wall y 46.6.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   1 m grid read in the model frame (tools/lidar_frame.py, bearing 1.7),
 *   heights above the street. Measured: the main cornice 20.4; the roof and
 *   balustrade 22.5-23.2; the pavilions' attics 23.9; the middle court
 *   x -30..30, y -22..22, roofed at 9.5; the north block x -46..46,
 *   y 22..44, at 27.2, with two penthouses to 31.2; two stair heads at
 *   x +-32, y -20..-12, to 27.5; the colonnade bays empty in front of the
 *   south and north walls.
 * - Photos (Wikimedia Commons):
 *   p3 "Exterior of the Birch Bayh Federal Building & U.S. Courthouse.jpg"
 *   (Paul Sableman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_the_Birch_Bayh_Federal_Building_%26_U.S._Courthouse.jpg),
 *   the south front from the south-east;
 *   p9 "Birch Bayh U.S. Courthouse and Post Office.jpg" (Nyttend, public
 *   domain, https://commons.wikimedia.org/wiki/File:Birch_Bayh_U.S._Courthouse_and_Post_Office.jpg),
 *   the same front from Pennsylvania Street;
 *   x4 "Exterior of the Birch Bayh Federal Building & U.S. Courthouse - Jan
 *   2012.jpg" (Richie Diesterheft, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_the_Birch_Bayh_Federal_Building_%26_U.S._Courthouse_-_Jan_2012.jpg),
 *   an end pavilion square on;
 *   x1 "Exterior of the Birch Bayh Federal Building & U.S. Courthouse - May
 *   2016 - Artistmac.jpg" (artistmac, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_the_Birch_Bayh_Federal_Building_%26_U.S._Courthouse_-_May_2016_-_Artistmac.jpg),
 *   from high to the south-east: the pale roof, the east side's windows.
 *
 * Estimated (photos against the lidar heights): the terrace 2.0; the
 *   columns 2.0..16.0 (1.5 m thick), the entablature 16.0..20.4; twelve
 *   columns in thirteen bays on the south front (counted roughly from p3
 *   and p9); the pavilions' columns, window and door sizes; the windows of
 *   the sides and the court.
 * Doubts: no photo of the north (New York Street) front or the Meridian
 *   side was used. The north front is drawn like the south (OSM shows the
 *   same pavilion-and-recess plan and the lidar empty colonnade bays), but
 *   the north pavilions get no columns. The sides get plain window bays.
 * Left out: fluting, the statues and lamps on the terrace, the
 *   inscription, the balusters (a solid parapet), rooftop plant.
 * Night: the limestone carries a floodlight wash; windows glow; the doors
 *   are `entrance`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, finishGlb, writeModel } from './sea-tacoma-union-station'
import { windowRow, box, stairs, column, wallLit } from './indy-world-war-memorial'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

const TER = 2.0, COL = 16.0, CORN = 20.4, PAR = 22.5, PAV = 23.9
const ROOF = 21.8, COURT = 9.5, NORTH = 27.2

// ------------------------------------------------------------ the wings round the court
// south wing (behind the colonnade), north wing, west and east wings
box(stone, null, -52.8, -45.2, 53.5, -22.0, 0, ROOF)
box(stone, null, -52.3, 22.0, 52.1, 46.6, 0, ROOF)
box(stone, null, -52.3, -22.0, -30.0, 22.0, 0, ROOF)
box(stone, null, 30.0, -22.0, 52.1, 22.0, 0, ROOF)
// the roofs (pale membrane) and the court's low roof
roof.quad([-52.8, -45.2, ROOF], [53.5, -45.2, ROOF], [53.5, -22, ROOF], [-52.8, -22, ROOF])
roof.quad([-52.3, -22, ROOF], [-30, -22, ROOF], [-30, 22, ROOF], [-52.3, 22, ROOF])
roof.quad([30, -22, ROOF], [52.1, -22, ROOF], [52.1, 22, ROOF], [30, 22, ROOF])
box(stone, roof, -30.0, -22.0, 30.0, 22.0, 0, COURT)
// the court's inner walls: windows
for (const [a, b] of [[[-30, 22], [-30, -22]], [[-30, -22], [30, -22]], [[30, -22], [30, 22]], [[30, 22], [-30, 22]]] as [XY, XY][]) {
  // these walls face into the court: reverse so the panels sit on the court side
  windowRow(win, b, a, COURT + 1.5, COURT + 9.5, 4.4, 2.0, 1.5)
}
// the north block, a storey higher, and its penthouses
box(stone, roof, -46.0, 22.0, 46.0, 44.0, 0, NORTH, 0.2)
windowRow(win, [-46, 22], [46, 22], ROOF + 1.2, NORTH - 1.2, 4.6, 2.2, 2)
box(roof, roof, -36.0, 24.0, -24.0, 32.0, NORTH, 31.2)
box(roof, roof, 24.0, 24.0, 40.0, 32.0, NORTH, 31.2)
// stair heads
box(roof, roof, -35.0, -20.0, -29.0, -12.0, ROOF, 27.5)
box(roof, roof, 29.0, -20.0, 35.0, -12.0, ROOF, 27.5)
// the parapet (a solid balustrade) round the outer edge
for (const r of [rect(-52.3, -45.2, 52.1, -44.6), rect(-52.3, 46.0, 52.1, 46.6), rect(-52.3, -45.2, -51.7, 46.6), rect(51.5, -45.2, 52.1, 46.6)]) prism(trim, trim, r, ROOF, PAR)

// ------------------------------------------------------------ a colonnaded front
/** The recessed colonnade between the pavilions, on the wall y = yw facing `s` (-1 south, +1 north). */
function colonnade(yw: number, s: number, x0: number, x1: number, bays: number, cols: boolean, d: number) {
  const yc = yw + s * (d - 1.25) // column line
  const yf = yw + s * d // front of the entablature and terrace
  const lo = Math.min(yw, yf), hi = Math.max(yw, yf)
  // terrace with its parapet
  prism(trim, trim, rect(x0, lo, x1, hi), 0, TER)
  // entablature (frieze and cornice) carried over the columns
  prism(stone, stone, rect(x0, lo, x1, hi), COL, CORN - 1.0)
  prism(trim, trim, rect(x0, Math.min(yw, yf), x1, Math.max(yw, yf)), CORN - 1.0, CORN)
  prism(trim, trim, rect(x0, Math.min(yw, yf - s * 0.4), x1, Math.max(yw, yf - s * 0.4)), CORN, PAR)
  const bay = (x1 - x0) / bays
  for (let k = 1; k < bays; k++) {
    const x = x0 + bay * k
    if (cols) column(trim, x, yc, TER, COL, 0.75, 6, 1.35)
    else box(stone, null, x - 0.6, Math.min(yw, yw + s * 0.8), x + 0.6, Math.max(yw, yw + s * 0.8), TER, COL)
  }
  // the end antae
  for (const x of [x0 + 0.7, x1 - 0.7]) box(stone, null, x - 0.7, lo, x + 0.7, hi, 0, COL)
  // windows in each bay: a ground row and the two upper storeys grouped
  const a: XY = s < 0 ? [x0, yw] : [x1, yw], b: XY = s < 0 ? [x1, yw] : [x0, yw]
  windowRow(win, a, b, TER + 0.8, TER + 4.0, bay, 2.0, 0)
  windowRow(win, a, b, TER + 5.4, COL - 1.2, bay, 2.0, 0)
}
colonnade(-45.2, -1, -31.6, 31.9, 13, true, 3.6)
colonnade(46.6, 1, -38.9, 36.0, 15, true, 1.9)

/** An end pavilion: plain piers, a recess with two columns in antis framing a tall window over a door. */
function pavilion(x0: number, x1: number, yb: number, yf: number, cols: boolean) {
  const s = Math.sign(yf - yb), cx = (x0 + x1) / 2, w = x1 - x0
  const lo = Math.min(yb, yf), hi = Math.max(yb, yf)
  const rx = w * 0.27 // half-width of the recess
  const yr = yf - s * 1.6 // recessed face
  // the piers either side, full depth, and the solid behind the recess
  box(stone, null, x0, lo, cx - rx, hi, 0, CORN)
  box(stone, null, cx + rx, lo, x1, hi, 0, CORN)
  box(stone, null, cx - rx, Math.min(yb, yr), cx + rx, Math.max(yb, yr), 0, CORN)
  // entablature over the recess, cornice and attic
  box(stone, null, cx - rx, Math.min(yr, yf), cx + rx, Math.max(yr, yf), COL, CORN)
  box(trim, trim, x0 - 0.4, lo, x1 + 0.4, hi + (s > 0 ? 0.4 : 0) , CORN - 1.0, CORN)
  if (s < 0) box(trim, null, x0 - 0.4, yf - 0.4, x1 + 0.4, yf, CORN - 1.0, CORN)
  box(stone, trim, x0 + 0.6, Math.min(yb, yf - s * 0.6), x1 - 0.6, Math.max(yb, yf - s * 0.6), CORN, PAV, 0.2)
  // the carved panel on the attic (a lighter band)
  const pa: XY = s < 0 ? [cx - rx, yf - s * 0.6] : [cx + rx, yf - s * 0.6], pb: XY = s < 0 ? [cx + rx, yf - s * 0.6] : [cx - rx, yf - s * 0.6]
  windowRow(trim, pa, pb, CORN + 0.8, PAV - 0.9, 2 * rx, 2 * rx - 1, 0)
  // columns in antis
  if (cols) for (const x of [cx - rx * 0.42, cx + rx * 0.42]) column(trim, x, yf - s * 0.9, TER, COL, 0.8, 6, 1.35)
  // tall window, pedimented door, steps up to the terrace
  const ra: XY = s < 0 ? [cx - rx, yr] : [cx + rx, yr], rb: XY = s < 0 ? [cx + rx, yr] : [cx - rx, yr]
  windowRow(win, ra, rb, 8.6, COL - 1.0, 2 * rx, 3.0, 0)
  windowRow(door, ra, rb, TER, 6.6, 2 * rx, 2.2, 0)
  box(trim, trim, cx - 2.0, Math.min(yr, yr + s * 0.5), cx + 2.0, Math.max(yr, yr + s * 0.5), 6.6, 7.6)
  stairs(trim, cx - rx, Math.min(yf, yf + s * 4.0), cx + rx, Math.max(yf, yf + s * 4.0), s < 0 ? 's' : 'n', 0, TER, 5)
  // windows on the piers' fronts: a small one high, one low
  for (const [p0, p1] of [[x0, cx - rx], [cx + rx, x1]]) {
    const a: XY = s < 0 ? [p0, yf] : [p1, yf], b: XY = s < 0 ? [p1, yf] : [p0, yf]
    windowRow(win, a, b, TER + 1.0, TER + 3.4, p1 - p0, 1.4, 0)
  }
}
pavilion(-52.8, -31.6, -45.2, -49.4, true)
pavilion(31.9, 53.5, -45.2, -49.4, true)
pavilion(-52.0, -38.9, 46.6, 48.6, false)
pavilion(36.0, 51.9, 46.6, 48.5, false)

// ------------------------------------------------------------ the sides
// entrance blocks on Meridian (west) and Pennsylvania (east)
box(stone, null, -55.0, -34.7, -52.3, -19.3, 0, CORN)
box(stone, null, 52.1, -35.1, 55.3, -19.5, 0, CORN)
box(trim, trim, -55.3, -35.0, -52.3, -19.0, CORN - 1.0, CORN)
box(trim, trim, 52.1, -35.4, 55.6, -19.2, CORN - 1.0, CORN)
// cornice band along the sides
box(trim, trim, -52.7, -44.6, -52.3, 46.0, CORN - 1.0, CORN)
box(trim, trim, 52.1, -44.6, 52.5, 46.0, CORN - 1.0, CORN)
// window bays: the two upper storeys grouped, a ground row
for (const [a, b] of [
  [[-52.3, 46.0], [-52.3, -19.3]], [[-55.0, -19.3], [-55.0, -34.7]], [[-52.8, -34.7], [-52.8, -45.2]],
  [[53.5, -45.2], [53.5, -35.1]], [[55.3, -35.1], [55.3, -19.5]], [[52.1, -19.5], [52.1, 46.0]],
] as [XY, XY][]) {
  windowRow(win, a, b, TER + 1.0, TER + 4.0, 4.4, 2.0, 1.5)
  windowRow(win, a, b, TER + 5.4, COL - 1.2, 4.4, 2.0, 1.5)
}
// a plinth course
box(trim, null, -52.6, -45.0, -52.3, 46.0, 0, 1.2)
box(trim, null, 52.1, -45.0, 52.4, 46.0, 0, 1.2)

const built = finishGlb('Birch Bayh Federal Building and U.S. Courthouse', [
  { part: stone, material: Object.assign(finish('indy-federal-limestone', 0xddd5c3), { floodlight: wallLit }) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('indy-federal-roof', 0xc4c6c4) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 1.7, height: 31.2, replaces: ['way/339570749'] }, 6500)

if (import.meta.main) await writeModel('indy-birch-bayh-federal-building', built)
