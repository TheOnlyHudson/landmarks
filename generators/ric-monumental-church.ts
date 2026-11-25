/**
 * Monumental Church, 1224 East Broad Street, Richmond, Virginia (1812–14,
 * Robert Mills; built over the site of the 1811 Richmond Theatre fire) —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-monumental-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36.7 (the street grid; the portico faces Broad
 * Street at -y). Anchor = the centroid of OSM way/224530979,
 * -77.4297938, 37.5388754.
 *
 * Identity (from the photos below):
 *  1. An octagonal stuccoed body with short arms (side pavilions with blind
 *     recessed panels, a lunette in the east one), plain band courses and
 *     a crowning entablature.
 *  2. A broad, very low saucer dome on the octagon with a short glazed
 *     lantern and a flat cap.
 *  3. The heavy sandstone portico on Broad Street: massive square corner
 *     piers, two columns in antis on the front and on each side, a deep
 *     plain entablature and a low pediment, on a podium with steps.
 *  4. A taller gabled rear (chancel) block behind the dome.
 *
 * Plan: OSM way/224530979, simplified (symmetric arms, straight diagonals)
 * in this frame; the dome centre (-4.8, 0) from the lidar.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame. y = 0 is the lowest ground (6.4 above the
 * crop's minimum); the site is nearly flat (+0.9 m to the north). Measured
 * above y = 0: body cornice 12.6; dome rising to 15.8 at the lantern;
 * lantern cap 18.9; portico eaves 9.2, pediment apex 11.2; rear block eaves
 * 15.0, ridge 16.6. Estimated from the HABS photos, scaled to those: band
 * courses, piers (2.4 m square), columns (1.1 m), windows, doors, steps.
 *
 * Colours: the HABS photos are black and white. The body is buff stucco and
 * the portico brown Aquia sandstone (pulled to the palette); the dome's
 * metal reads pale grey in USGS NAIP. Estimated, see doubts.
 *
 * Night: the portico and body are softly floodlit; windows glow.
 *
 * Photos (all EVIDENCE, public domain, Historic American Buildings Survey
 * HABS VA-1241, Library of Congress):
 *  - Monumental Church, Richmond, Virginia.jpg (aerial from the west)
 *    https://commons.wikimedia.org/wiki/File:Monumental_Church,_Richmond,_Virginia.jpg
 *  - HABS VA-1241-6 (the portico's south-east corner) and VA-1241-24 (a
 *    pavilion and an octagon face), HABS/HAER collection,
 *    https://www.loc.gov/item/va1241/
 *  - USGS NAIP orthoimagery (public domain): plan, roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no licensed colour photo was found; colours follow the known
 * materials (stucco and Aquia sandstone) and NAIP. The north and east sides
 * are seen only in the aerial; window positions there are estimated.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { archShape, gableRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, column, cornice, prism, save } from './atl-flatiron-building'

const stucco = new Part(), stone = new Part(), roof = new Part(), win = new Part(), dark = new Part()
const CX = -4.8, EAVE = 12.6

// ── The octagonal body with its arms ──
const BODY: XY[] = ccw([
  [-10.6, -11.4], [1.0, -11.4], [7.0, -5.0], [11.2, -5.0], [11.2, 5.0], [7.0, 5.0],
  [1.0, 11.6], [-10.6, 11.6], [-16.6, 5.0], [-20.8, 5.0], [-20.8, -5.0], [-16.6, -5.0],
])
prism(stucco, BODY, 0, EAVE - 0.9, null, 0)
cornice(stucco, BODY, EAVE - 0.9, 0.9, 0.35, roof)
// band courses (HABS VA-1241-24)
cornice(stucco, BODY, 4.6, 0.35, 0.1, stucco)
cornice(stucco, BODY, 8.3, 0.3, 0.08, stucco)
// pavilion parapets a little proud of the octagon
for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -20.8 : 7.0, x1 = sx < 0 ? -16.6 : 11.2
  box(stucco, x0 - 0.1, x1 + 0.1, -5.1, 5.1, EAVE, EAVE + 0.5, roof, 0.1)
}

// faces of the body, each from left to right seen from outside
const faces: Array<[XY, XY]> = BODY.map((a, i) => [a, BODY[(i + 1) % BODY.length]] as [XY, XY])
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const nx = b[1] - a[1], ny = -(b[0] - a[0]) // outward normal (unnormalised)
  const front = ny < -0.5 * L && Math.abs(nx) < 0.5 * L && a[1] < -11 // the Broad Street face, behind the portico
  const back = ny > 0.5 * L && a[1] > 11
  const pavilion = Math.abs(nx) > 0.9 * L && Math.abs(a[0]) > 11 // east and west ends of the arms
  const diag = Math.abs(nx) > 0.3 * L && Math.abs(ny) > 0.3 * L
  if (front || back) continue
  if (pavilion) {
    // blind recessed panels, upper and lower; a lunette on the east end
    onWall(stucco, a, b, rectShape(L / 2 - 1.4, L / 2 + 1.4, 1.2, 4.0), 0.12)
    onWall(stucco, a, b, rectShape(L / 2 - 1.3, L / 2 + 1.3, 5.6, 7.8), 0.12)
    if (a[0] > 0) {
      onWall(win, a, b, archShape(L / 2, 3.0, 9.0, 9.0, 10).filter((p) => p[1] >= 9.0), 0.08)
    }
  } else if (diag) {
    // a tall lower window and a wide tripartite upper window on each angle
    onWall(stucco, a, b, rectShape(L / 2 - 1.0, L / 2 + 1.0, 4.05, 4.35), 0.18)
    onWall(win, a, b, rectShape(L / 2 - 0.85, L / 2 + 0.85, 1.0, 4.0), 0.06)
    onWall(win, a, b, rectShape(L / 2 - 1.8, L / 2 + 1.8, 9.0, 10.6), 0.06)
  } else if (L > 3) {
    // the short side faces of the arms
    onWall(win, a, b, rectShape(L / 2 - 0.7, L / 2 + 0.7, 1.0, 3.8), 0.06)
  }
}

// ── The saucer dome and lantern ──
revolve(roof, [CX, 0], [[9.6, EAVE], [8.6, EAVE + 0.75], [6.8, EAVE + 1.8], [4.6, EAVE + 2.7], [2.9, EAVE + 3.2]], 24, 0, false, false)
revolve(stucco, [CX, 0], [[2.9, EAVE + 3.2], [2.9, EAVE + 3.5]], 16, 0, true, false)
revolve(win, [CX, 0], [[2.55, EAVE + 3.5], [2.55, EAVE + 5.0]], 16, 0, true, false)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2
  box(stucco, CX + Math.cos(a) * 2.55 - 0.18, CX + Math.cos(a) * 2.55 + 0.18, Math.sin(a) * 2.55 - 0.18, Math.sin(a) * 2.55 + 0.18, EAVE + 3.5, EAVE + 5.0, null, 0)
}
revolve(roof, [CX, 0], [[2.9, EAVE + 5.0], [2.9, EAVE + 5.35], [2.0, EAVE + 5.9], [0, EAVE + 6.3]], 16, 0, true, false)

// ── The rear block, gabled ──
{
  const x0 = -9.6, x1 = 1.3, y0 = 9.5, y1 = 19.3, E = 15.0
  box(stucco, x0, x1, y0, y1, 0, E, null, 0)
  cornice(stucco, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], E - 0.6, 0.6, 0.25, null)
  gableRoof(roof, stucco, x0, x1, y0, y1, E, 16.6, 'y', 0.35, 0.35)
  const f: [XY, XY] = [[x1, y1], [x0, y1]], L = x1 - x0
  onWall(win, f[0], f[1], archShape(L / 2, 3.2, 7.0, 10.6, 10), 0.06)
  onWall(stucco, f[0], f[1], rectShape(L / 2 - 2.2, L / 2 + 2.2, 1.0, 5.0), 0.12)
  for (const [a, b] of [[[x1, y0 + 2.1], [x1, y1]], [[x0, y1], [x0, y0 + 2.1]]] as [XY, XY][]) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, rectShape(l / 2 - 0.8, l / 2 + 0.8, 8.5, 12.5), 0.06)
  }
}

// ── The sandstone portico ──
{
  const x0 = -10.9, x1 = 0.8, y0 = -20.5, y1 = -11.4, PZ = 1.2, ENT = 6.6, E = 9.2, APEX = 11.2
  const xm = (x0 + x1) / 2, P = 2.4
  box(stone, x0, x1, y0, y1, 0, PZ, stone, 0.08)
  // steps in front and down each side of the podium
  box(stone, xm - 2.6, xm + 2.6, y0 - 1.2, y0, 0, PZ * 0.5, stone, 0.05)
  box(stone, xm - 2.6, xm + 2.6, y0 - 0.6, y0, PZ * 0.5, PZ, stone, 0.05)
  // massive corner piers
  for (const [ax, ay] of [[x0, y0], [x1 - P, y0]] as XY[]) box(stone, ax, ax + P, ay, ay + P, PZ, ENT, null, 0)
  for (const ax of [x0, x1 - P]) box(stone, ax, ax + P, y1 - 1.6, y1, PZ, ENT, null, 0)
  // columns in antis: two on the front, two on each side
  const cols: XY[] = [[xm - 1.6, y0 + 0.9], [xm + 1.6, y0 + 0.9], [x0 + 0.9, y0 + 4.0], [x0 + 0.9, y0 + 6.3], [x1 - 0.9, y0 + 4.0], [x1 - 0.9, y0 + 6.3]]
  for (const c of cols) {
    column(stone, c, 0.55, PZ, ENT - 0.55, 12)
    revolve(stone, c, [[0.55, ENT - 0.55], [0.78, ENT - 0.15], [0.78, ENT]], 10, 0, true, false)
  }
  // entablature, pediment and roof
  box(stone, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1, ENT, E, null, 0.1)
  gableRoof(roof, stone, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 1.5, E, APEX, 'y', 0.4, 0.3)
  // the door and its tablet in the back wall
  const f: [XY, XY] = [[x0, y1], [x1, y1]]
  const s = xm - x0
  onWall(stucco, f[0], f[1], rectShape(s - 1.6, s + 1.6, PZ, PZ + 4.4), 0.04)
  onWall(dark, f[0], f[1], rectShape(s - 1.15, s + 1.15, PZ, PZ + 3.7), 0.08)
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[1] < -10 ? 0.8 : 0.45)
void PALETTE
await save('ric-monumental-church', 'Monumental Church', [
  { part: stucco, material: { ...finish('monumental-stucco', 0xe6dac4), floodlight: lit } },
  { part: stone, material: { ...finish('aquia-sandstone', 0xcdb18e), floodlight: lit } },
  { part: roof, material: finish('monumental-roof', 0xa8b1b2) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('monumental-door', 0x5d5550) },
], { height: 18.9, anchor: [37.5388754, -77.4297938], bearing: 36.7 })
