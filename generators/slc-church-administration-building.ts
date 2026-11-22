/**
 * Church Administration Building (1917, Joseph Don Carlos Young), 47 East
 * South Temple, Salt Lake City. Procedural, CC0-1.0.
 * bun generators/slc-church-administration-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/33155054 (-111.8893637, 40.769816). y = 0 is the
 * lowest ground under the outline (Mapterhorn: the west edge); the plaza
 * round the building stands about 0.5 m higher (terrain grid), G = 0.5.
 *
 * Form, from the photos: a granite Neoclassical block, five storeys. On
 * every side a full-height Ionic colonnade stands in antis between solid
 * corner piers: four columns on the south (South Temple) and north fronts,
 * eight down each long side ("twenty-four Ionic columns", Wikipedia). The
 * window wall is recessed behind the columns, with one tall window panel
 * per bay over the upper three floors and the ground-floor windows below.
 * Over it a deep entablature (the frieze carries the church's name on the
 * south front, left out as lettering), a strong cornice and a plain attic
 * storey. The main door, bronze under a pedimented stone surround, is in
 * the centre of the south front at the top of a flight of steps.
 *
 * Numbers: plan from OSM (31 x 50 m; Wikipedia's "140 by 75 ft" does not
 * match the mapped outline or the photos, so OSM is used). Heights
 * estimated from p3 (straight-on south front) scaled by the 31 m width:
 * stylobate 1.5 m, columns 14.4 m, entablature 4.4 m, attic 3.0 m, total
 * about 23.8 m above the plaza; corner piers 4.5 m wide; column spacing
 * 5.0 m (p3). Long-side spacing from the column count and the outline.
 * Lidar: not used.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Church_Administration_Building_-_Salt_Lake_City,_Utah_-_10_May_2020.jpg
 *     Beneathtimp, CC0 (south front and west side from the south-west)
 *  p2, p3 https://commons.wikimedia.org/wiki/File:Admin_bldg_5254.jpg and
 *     https://commons.wikimedia.org/wiki/File:Admin_bldg_5257.jpg
 *     Chris Light, CC BY-SA 4.0 (2024: the south front and east side from the
 *     south-east; the south front straight on)
 * Doubts: the north front is seen in no photo (mirrored from the south,
 * without the door); the attic's exact height. p2 and p3 are identified
 * by author and frame size (6000 x 4000) from the Commons search; which is
 * which of the two is not certain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, panel, prism, rect, type Face } from './slc-beehive-house'

const gran = new Part(), trim = new Part(), roof = new Part(), win = new Part(), bronze = new Part()
const G = 0.5
const X0 = -15.5, X1 = 15.5, Y0 = -25.0, Y1 = 25.0
const ZS = G + 1.5, ZC = ZS + 14.4, ZE = ZC + 4.4, ZA = ZE + 3.0
const REC = 2.6 // depth of the window wall behind the column line
const PIER = 4.5

// stylobate (podium) and the steps on the south front
prism(gran, rect(X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3), 0, ZS, true)
for (let k = 0; k < 4; k++) box(gran, -6.5, Y0 - 2.4 + k * 0.6, 6.5, Y0, 0, G + 0.375 * (k + 1))
// the recessed core and the four corner piers
prism(gran, rect(X0 + REC, Y0 + REC, X1 - REC, Y1 - REC), ZS, ZC, false)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const xa = sx < 0 ? X0 : X1 - PIER, ya = sy < 0 ? Y0 : Y1 - PIER
  box(gran, xa, ya, xa + PIER, ya + PIER, ZS, ZC)
}
// entablature: architrave and frieze, the projecting cornice, the attic, the roof
prism(trim, rect(X0, Y0, X1, Y1), ZC, ZC + 1.2, false, true)
prism(gran, rect(X0, Y0, X1, Y1), ZC + 1.2, ZE - 1.3, false)
prism(trim, rect(X0 - 0.7, Y0 - 0.7, X1 + 0.7, Y1 + 0.7), ZE - 1.3, ZE, true, true)
prism(gran, rect(X0 + 0.4, Y0 + 0.4, X1 - 0.4, Y1 - 0.4), ZE, ZA - 0.4, false)
prism(trim, rect(X0 + 0.2, Y0 + 0.2, X1 - 0.2, Y1 - 0.2), ZA - 0.4, ZA, false)
prism(roof, rect(X0 + 0.2, Y0 + 0.2, X1 - 0.2, Y1 - 0.2), ZA - 0.05, ZA, true)
// the soffit over the colonnade (the bottom of the architrave band)
prism(trim, rect(X0, Y0, X1, Y1), ZC - 0.01, ZC, false, true)

// an Ionic column: square base, tapering 12-sided shaft, volute capital
function column(x: number, y: number) {
  box(gran, x - 0.95, y - 0.95, x + 0.95, y + 0.95, ZS, ZS + 0.45)
  const ring = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI
    return [x + r * Math.cos(a), y + r * Math.sin(a), z] as V3
  })
  gran.loft([ring(0.78, ZS + 0.45), ring(0.74, ZS + 7), ring(0.66, ZC - 0.75)])
  box(trim, x - 1.0, y - 0.6, x + 1.0, y + 0.6, ZC - 0.75, ZC - 0.25)
  box(trim, x - 0.85, y - 0.85, x + 0.85, y + 0.85, ZC - 0.25, ZC)
}
const SX = [-7.5, -2.5, 2.5, 7.5]
const SY = Array.from({ length: 8 }, (_, k) => -17.5 + k * 5.0)
for (const x of SX) { column(x, Y0 + 1.0); column(x, Y1 - 1.0) }
for (const y of SY) { column(X0 + 1.0, y); column(X1 - 1.0, y) }

// windows on the recessed walls: one tall panel per bay over floors 2-4,
// the ground-floor windows below
function bays(face: Face, plane: number, centres: number[]) {
  for (const u of centres) {
    panel(win, face, plane, u, 2.6, ZS + 4.3, ZC - 1.0, 'flat', 0.05)
    panel(win, face, plane, u, 2.2, ZS + 0.9, ZS + 3.4, 'flat', 0.05)
  }
}
const bx = [-9.5, -5, 0, 5, 9.5]
bays('S', Y0 + REC, bx.filter((u) => u !== 0))
bays('N', Y1 - REC, bx)
const by = [-20, ...SY.slice(0, -1).map((y) => y + 2.5), 20].filter((y) => Math.abs(y) < 19)
bays('E', X1 - REC, by)
bays('W', X0 + REC, by)
// the south door: upper window, pedimented surround, bronze leaves
panel(win, 'S', Y0 + REC, 0, 2.6, ZS + 4.3, ZC - 1.0, 'flat', 0.05)
panel(trim, 'S', Y0 + REC, 0, 3.2, ZS, ZS + 3.9, 'flat', 0.03)
panel(bronze, 'S', Y0 + REC, 0, 1.9, ZS, ZS + 3.1, 'flat', 0.06)
box(trim, -1.9, Y0 + REC - 0.5, 1.9, Y0 + REC, ZS + 3.9, ZS + 4.15)
// a lamp standard each side of the door (p3)
for (const s of [-1, 1]) box(bronze, s * 1.9 - 0.2, Y0 + REC - 0.9, s * 1.9 + 0.2, Y0 + REC - 0.5, ZS, ZS + 1.6)

// ---------------------------------------------------------------- output ---
// Colours from p1-p3: light grey quartz monzonite, a paler cornice and
// capitals, dark bronze-framed windows (slate), bronze door.
const parts = [
  { part: gran, material: finish('cab-granite', 0xd9d8d2) },
  { part: trim, material: finish('cab-granite-light', 0xe7e5df) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: bronze, material: finish('cab-bronze', 0x8b7558) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Church Administration Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ZA,
})
await Bun.write(new URL('../models/slc-church-administration-building.glb', import.meta.url), glb)
console.log(`slc-church-administration-building.glb: ${triangles} triangles, ${glb.length} bytes`)
