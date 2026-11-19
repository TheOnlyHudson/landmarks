/**
 * New York Stock Exchange Building (18 Broad Street, 1903, and the 11 Wall
 * Street annex, 1922) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-new-york-stock-exchange.ts
 *
 * Map frame: x = model east (the Broad Street front faces +x), y = model
 * north (Wall Street), z up, metres. Placed at bearing 26°, the line of the
 * Broad Street and New Street walls in OSM (25.7° and 26.1°). Anchor: the
 * point Nominatim gives for the outline way/278053530, near the middle of
 * the block.
 *
 * The annex is part of this model. OSM maps the whole block, 1903 building
 * and 1922 tower, as one outline (way/278053530, "New York Stock
 * Exchange", 11 Wall Street) with eleven building:part ways inside; hiding
 * that outline hides the annex too, so the model draws both. 20 Broad
 * Street to the south (way/278053497) and 23 Wall Street across Broad
 * (way/278042235) are separate neighbours and stay on the map. Federal Hall
 * (its own model) is across Wall Street and isn't touched.
 *
 * Evidence
 * - OSM way/278053530 (outline) and parts 378259074–084: the 1903 block
 *   (082, 45 m; 083, 34.9 m), the annex base and tower (081, 78.5 m; 084,
 *   the west wing to 82.9 m; 076, the 9-storey Broad Street strip, 39.3 m;
 *   075, 96 m; 074/077–080, the roof to 104.8 m). Walls squared to the 26°
 *   axis; the outline's corners land within ~0.5 m.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m grid, read in the model
 *   frame (heights above the lowest ground, Broad Street at Exchange
 *   Place). Broad Street rises ~2.5 m to Wall Street; New Street and the
 *   Wall/New corner stand ~4.5 m higher. 1903 front attic/balustrade
 *   41–42 m; roof behind 45–47 then 51 m; two roof houses 55–58 m and
 *   60–62 m. Annex: 9-storey base 42 m along Broad Street; tower 81 m (to
 *   the 18th-storey cornice), flush on Wall Street, set back ~3.5 m from
 *   Broad; west wing 84 m; top stage 99–103 m; roof crown 106–109 m. These
 *   replace OSM's heights where they differ.
 * - Published (Wikipedia, "New York Stock Exchange Building", citing the
 *   NYC LPC 1985 report and NRHP): 18 Broad Street 137 ft 8.5 in on Broad,
 *   152 ft 10 in on New Street, roof 156 ft; white Georgia marble; a
 *   two-storey podium in seven bays with arched windows; six Corinthian
 *   columns 52 ft tall, 5.5 ft across, flanked by two pilasters, on Broad
 *   (fluted) and New Street (plain); behind each colonnade a window ~96 ft
 *   wide by 50 ft; pediment ~110 ft wide, ~100 ft above the sidewalk, eleven
 *   figures (J. Q. A. Ward and P. W. Bartlett); a balustraded attic. 11 Wall
 *   Street (Trowbridge & Livingston, 1922): 156 ft on Wall Street, 58 ft on
 *   Broad, 100 ft on New Street; 22/23 storeys; setbacks at the 9th, 19th
 *   and 20th storeys, heavy cornice above the 18th; the entrance in the
 *   chamfered Wall/New corner.
 * - Photos (Wikimedia Commons / Flickr, EVIDENCE):
 *   Broad St front, frontal: "The New York Stock Exchange", epicharmus, CC BY 2.0,
 *     https://www.flickr.com/photos/8256808@N02/1613548865
 *   From Federal Hall (north-east), front + annex: "New York Stock Exchange
 *     August 2017 02.jpg" and "...04.jpg", Arild Vågen, CC BY-SA 4.0
 *   Front with the flag: "New York City (New York, USA), Wall Street -- 2012 --
 *     6614.jpg", Dietmar Rabich, CC BY-SA 4.0; "New York Stock Exchange
 *     Flag.jpg", Balon Greyjoy, CC0
 *   Columns and pediment: "NEW YORK STOCK EXCHANGE 20240521.jpg", 颐园居,
 *     CC BY-SA 4.0; "New York Stock Exchange Building 2010.jpg", LeoTar,
 *     CC BY-SA 3.0
 *   Wall Street side: "New York Stock Exchange building, 20231002 171816.jpg",
 *     Jakub Hałun, CC BY 4.0
 *   Wall/New corner entrance at dusk: "11 Wall Street - New York Stock
 *     Exchange", pixelgrey, CC BY-SA 2.0, https://www.flickr.com/photos/85145727@N00/8044923705
 *   Night: "NYSE lit up at night (3122761205).jpg", Georgio, CC BY 2.0
 *
 * Estimated: the podium height (10 m, two storeys under 15.9 m columns, so
 * the entablature tops out at the published ~100 ft); the 4.2 m column
 * pitch (the 96 ft window split into seven bays); the piers' width (from
 * the 110 ft pediment); the pediment's rise (photos give ~4.5 m; drawn
 * 5.4 m so the triangle still reads at 200 px); the window rhythm on the
 * annex (photos, grouped two storeys a panel).
 * Exaggerated for reading at map size: the window recess behind the
 * columns is 5 m deep and nearly black, with shadow-toned reveals, so the
 * pale shafts stand out; the entablature cornice and the pediment overhang
 * the wall line by 0.45 m with the attic 2.5 m back, and the tympanum is a
 * darker marble tone; the podium is that darker tone too (it is rusticated
 * granite and marble), under one projecting balcony ledge.
 * Unseen: no open photo shows the New Street side; its colonnade copies
 * Broad Street's layout without the pediment and flag (the source says it
 * has six plain columns between pilasters and a simple cornice). The roof
 * houses are from lidar alone.
 * The flag: the Broad Street front often (not always) carries a huge US
 * flag draped across the colonnade, in front of the columns (epicharmus,
 * Rabich). It is drawn as one flat panel 0.25 m proud of the shafts over the
 * middle four bays, ~17 × 9 m, its top under the capitals and its bottom
 * well above the bases, so the outer columns and the column tops and feet
 * still show against the dark recess (the real flag is a little larger);
 * thirteen stripes and a plain canton in the window blue, no stars.
 * The pediment's figures are a row of plain blocks, the tallest in the
 * middle, standing in for the eleven figures.
 *
 * Night: the Broad Street front is floodlit from the street and the
 * balconies: its columns, piers, pediment and the flag carry a floodlight
 * wash; the trading-floor window stays dark (glass material); the annex
 * tower stays unlit stone with lit windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, insetRing, type Facade, type XY } from './nyc-570-lexington'
import { archPanel, block, column, rectPanel } from './nyc-city-hall'

// Six materials: marble; a darker marble tone (the rusticated podium, the
// tympanum, the recess reveals, and the roofs); trim (columns, cornices, the
// flag's white stripes); windows (also the flag's canton); the dark
// trading-floor glazing; the flag's red.
const stone = new Part(), shade = new Part(), trim = new Part(), win = new Part(), dark = new Part(), red = new Part()
const roof = shade

// --- Plan (model frame) ---
const XB = 22.1 // Broad Street wall
const XN = -22.0 // New Street wall
const YS = -38.7 // Broad Street front's south end, on 20 Broad Street's north wall (OSM -38.7…-39.4)
const YP = -33.7 // party wall with 20 Broad Street west of x = 0.6
const YA = 2.7 // 1903 building / annex line
const wallY = (x: number) => 20.0 + (x - XB) * -0.268 // Wall Street line, (22.1, 20.0) → (-18.9, 31.0)

// --- Heights (above Broad Street at Exchange Place) ---
const POD = 10.3 // podium top / column bases
const COLTOP = 26.3 // capitals' top (52 ft columns)
const ENT = 30.0 // entablature top, pediment base
const ATTIC = 42.0 // attic balustrade (lidar)
const PED = 5.4 // pediment rise (photo ~4.5–4.7 m; drawn a little taller so the triangle reads at phone size)

// --- The 1903 building, 18 Broad Street ---
const cB = (YS + YA) / 2 // Broad front centre, -18.3
const cN = (YP + YA) / 2 // New Street front centre, -15.5
const PITCH = 4.2, RECESS = 13.85, PIER = 17.0, DEPTH = 5.0
const OVER = 0.45 // the cornice and pediment overhang past the wall line
const colY = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * PITCH)

// Ring for the colonnade storeys: the window recesses cut into both fronts.
const ringFull: XY[] = [[XN, YP], [0.6, YP], [0.6, YS], [XB, YS], [XB, YA], [XN, YA]]
const ringNotched: XY[] = [
  [XN, YP], [0.6, YP], [0.6, YS], [XB, YS],
  [XB, cB - RECESS], [XB - DEPTH, cB - RECESS], [XB - DEPTH, cB + RECESS], [XB, cB + RECESS],
  [XB, YA], [XN, YA],
  [XN, cN + RECESS], [XN + DEPTH, cN + RECESS], [XN + DEPTH, cN - RECESS], [XN, cN - RECESS],
]
const ATTIC_IN = 2.5 // the attic stands back behind the pediment
const ringAttic: XY[] = [[XN + ATTIC_IN, YP], [0.6, YP], [0.6, YS], [XB - ATTIC_IN, YS], [XB - ATTIC_IN, YA], [XN + ATTIC_IN, YA]]

prism({ wall: shade, win: null, roof: null, ring: ringFull, z0: 0, z1: POD, facade: null, bevel: 0.3 }) // the rusticated podium
prism({ wall: stone, win: null, roof: null, ring: ringNotched, z0: POD, z1: COLTOP, facade: null, bevel: 0.3 })
prism({ wall: trim, win: null, roof: trim, ring: ringFull, z0: COLTOP, z1: ENT, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof: roof, coping: trim, ring: ringAttic, z0: ENT, z1: ATTIC, facade: null, bevel: 0.4 })
// Floors of the recesses (the balconies) and their ceilings under the entablature.
for (const [x0, x1, c] of [[XB - DEPTH, XB, cB], [XN, XN + DEPTH, cN]]) {
  shade.quad([x0, c - RECESS, POD], [x1, c - RECESS, POD], [x1, c + RECESS, POD], [x0, c + RECESS, POD])
  shade.quad([x0, c + RECESS, COLTOP], [x1, c + RECESS, COLTOP], [x1, c - RECESS, COLTOP], [x0, c - RECESS, COLTOP])
}
// The recesses' side walls in the shadow tone, so the dark reads deep.
for (const [xa, xb, c] of [[XB, XB - DEPTH, cB], [XN, XN + DEPTH, cN]]) {
  for (const sy of [-1, 1]) {
    const y = c + sy * RECESS, L = Math.abs(xa - xb)
    // Wall ring order runs so the panel faces into the recess.
    const a: XY = (sy < 0) === (xa > xb) ? [xa, y] : [xb, y], b: XY = (sy < 0) === (xa > xb) ? [xb, y] : [xa, y]
    rectPanel(shade, a, b, L / 2, L, POD, COLTOP, 0.03)
  }
}
// The trading-floor windows filling the recesses.
rectPanel(dark, [XB - DEPTH, cB - RECESS], [XB - DEPTH, cB + RECESS], RECESS, 2 * RECESS - 0.1, POD, COLTOP)
rectPanel(dark, [XN + DEPTH, cN + RECESS], [XN + DEPTH, cN - RECESS], RECESS, 2 * RECESS - 0.1, POD, COLTOP)
// Six columns on each front, their faces on the wall line.
for (const y of colY) {
  column(trim, XB - 1.15, cB + y, 0.85, POD, COLTOP, { n: 12, base: 0.9, cap: 1.7, taper: 0.88 })
  column(trim, XN + 1.15, cN + y, 0.85, POD, COLTOP, { n: 12, base: 0.9, cap: 1.7, taper: 0.88 })
}
// The balcony band: one ledge along the whole Broad Street front, under the columns.
block(trim, XB - DEPTH, YS + 0.3, XB + 0.35, YA - 0.3, POD - 0.7, POD)
// The entablature's heavy cornice, overhanging the colonnade and piers.
block(trim, XB - 0.6, cB - PIER - OVER, XB + OVER, cB + PIER + OVER, ENT - 1.1, ENT)

// Broad Street podium: seven arched windows over seven doors, an arched
// doorway in each outer bay.
const broad: [XY, XY] = [[XB, YS], [XB, YA]]
const sB = (y: number) => y - YS
for (let k = -3; k <= 3; k++) {
  const y = cB + k * PITCH
  archPanel(win, broad[0], broad[1], sB(y), 2.2, 5.4, 9.2)
  rectPanel(win, broad[0], broad[1], sB(y), 1.9, 1.4, 4.4)
}
for (const y of [cB - 18.9, cB + 18.9]) {
  archPanel(win, broad[0], broad[1], sB(y), 2.0, 1.4, 7.6)
  rectPanel(win, broad[0], broad[1], sB(y), 1.4, 12.0, 17.6)
  rectPanel(win, broad[0], broad[1], sB(y), 1.4, 19.4, 25.0)
}
// Attic windows over the whole front, and the balustrade band.
const attic: [XY, XY] = [[XB - ATTIC_IN, YS], [XB - ATTIC_IN, YA]]
for (let k = -4; k <= 4; k++) rectPanel(win, attic[0], attic[1], cB + k * PITCH - YS, 1.4, 35.6, 38.4)
rectPanel(trim, attic[0], attic[1], (YA - YS) / 2, YA - YS - 0.8, 40.2, ATTIC - 0.4, 0.06)

// New Street: plain square windows in the rusticated base, outer-bay windows.
const newSt: [XY, XY] = [[XN, YA], [XN, YP]]
const sN = (y: number) => YA - y
for (let k = -3; k <= 3; k++) {
  const y = cN + k * PITCH
  rectPanel(win, newSt[0], newSt[1], sN(y), 1.8, 6.0, 9.0) // the street is ~3–4 m higher here
}
const atticN: [XY, XY] = [[XN + ATTIC_IN, YA], [XN + ATTIC_IN, YP]]
for (let k = -4; k <= 4; k++) rectPanel(win, atticN[0], atticN[1], YA - (cN + k * PITCH), 1.4, 35.6, 38.4)

// The pediment over the Broad Street front: a raking cornice round a
// recessed tympanum, the figures standing in it.
{
  const xf = XB + OVER, xb = XB - ATTIC_IN, xt = XB - 0.5, w = PIER + OVER, top = ENT + PED
  const slope = PED / w
  const X = (x: number, y: number, z: number): V3 => [x, cB + y, z]
  const E: V3 = [1, 0, 0]
  const tri = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tri(p, a, b, c, n); tri(p, a, c, d, n) }
  // Inner (tympanum) triangle, a heavy raking cornice ~1 m round it.
  const zi = ENT + 0.6, ti = top - 1.3, wi = (ti - zi) / slope
  const O = [X(xf, -w, ENT), X(xf, w, ENT), X(xf, 0, top)]
  const I = [X(xf, -wi, zi), X(xf, wi, zi), X(xf, 0, ti)]
  for (let i = 0; i < 3; i++) quad(trim, O[i], O[(i + 1) % 3], I[(i + 1) % 3], I[i], E)
  tri(shade, X(xt, -wi, zi), X(xt, wi, zi), X(xt, 0, ti), E)
  // Reveals from the cornice back to the tympanum.
  for (let i = 0; i < 3; i++) {
    const a = I[i], b = I[(i + 1) % 3]
    const a2: V3 = [xt, a[1], a[2]], b2: V3 = [xt, b[1], b[2]]
    const mid: V3 = [0, -(a[1] + b[1]) / 2 + cB, -(a[2] + b[2]) / 2 + (zi + ti) / 2]
    const l = Math.hypot(mid[1], mid[2]) || 1
    quad(trim, a, b, b2, a2, [0, mid[1] / l, mid[2] / l])
  }
  // Raking tops, sloping back to the attic.
  const up = (s: number): V3 => { const l = Math.hypot(slope, 1); return [0, (s * slope) / l, 1 / l] }
  quad(trim, X(xf, -w, ENT), X(xb, -w, ENT), X(xb, 0, top), X(xf, 0, top), up(-1))
  quad(trim, X(xb, w, ENT), X(xf, w, ENT), X(xf, 0, top), X(xb, 0, top), up(1))
  // Eleven figures: a tall central one, the rest stepping down with the rake,
  // the outermost reclining.
  for (let k = -5; k <= 5; k++) {
    const y = k * 1.95, room = ti - Math.abs(y) * slope - zi
    const h = Math.abs(k) === 5 ? 0.6 : room * (k === 0 ? 0.92 : 0.78)
    const hw = Math.abs(k) === 5 ? 0.9 : k === 0 ? 0.65 : 0.55
    block(trim, xt, cB + y - hw, xt + 0.45, cB + y + hw, zi, zi + h)
  }
}

// The flag, draped in front of the columns over the middle four bays, the
// capitals above and the bases below clear of it: 13 stripes, the canton at
// the upper left as seen from Broad Street (the south end).
{
  const hw = 2 * PITCH, xf = XB - 0.05, z1 = COLTOP - 1.9, z0 = z1 - (2 * hw) / 1.9
  const sh = (z1 - z0) / 13, cantonW = 0.4 * 2 * hw
  const panel = (p: Part, y0: number, y1: number, a: number, b: number) => p.quad([xf, y0, a], [xf, y1, a], [xf, y1, b], [xf, y0, b])
  for (let i = 0; i < 13; i++) {
    const b = z1 - i * sh, a = b - sh
    const p = i % 2 === 0 ? red : trim
    if (i < 7) panel(p, cB - hw + cantonW, cB + hw, a, b)
    else panel(p, cB - hw, cB + hw, a, b)
  }
  panel(win, cB - hw, cB - hw + cantonW, z1 - 7 * sh, z1)
}

// Roof behind the attic: stepped roofs and two roof houses (lidar).
prism({ wall: stone, win: null, roof, coping: trim, ring: [[-20.5, -32.5], [16.5, -32.5], [16.5, 1.5], [-20.5, 1.5]], z0: ATTIC - 1, z1: 46.5, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, coping: trim, ring: [[-13.0, -32.0], [7.5, -32.0], [7.5, 1.0], [-13.0, 1.0]], z0: 46, z1: 51, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: [[-7.0, -29.0], [5.0, -29.0], [5.0, -8.0], [-7.0, -8.0]], z0: 50.5, z1: 57.5, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: [[1.0, -38.4], [14.0, -38.4], [14.0, -28.5], [1.0, -28.5]], z0: ATTIC - 1, z1: 61.0, facade: null, bevel: 0.3 })

// --- The 1922 annex, 11 Wall Street ---
const fac: Facade = { bay: 3.6, ratio: 0.42, floor: 4.2, group: 2, spandrel: 1.6, sill: 1.6, head: 2.2, ground: 6.5, minLength: 3, margin: 0.6 }
const facTop: Facade = { ...fac, head: 1.6, sill: 1.4 }
const TX0 = -11.2, TX1 = 18.6 // tower between the west wing and the Broad Street setback
const T1 = 81.0, WING = 83.8, UP = 103.0
// Base, lower part of the tower (flush on Wall Street) and the Broad Street strip.
prism({ wall: stone, win, roof: null, ring: [[TX0, YA], [TX1, YA], [TX1, wallY(TX1)], [TX0, wallY(TX0)]], z0: 0, z1: ATTIC, facade: fac, bevel: 0.4,
  faceFacade: (i) => (i === 2 ? fac : null) })
prism({ wall: stone, win, roof, coping: trim, ring: [[TX1, YA], [XB, YA], [XB, wallY(XB)], [TX1, wallY(TX1)]], z0: 0, z1: ATTIC, facade: fac,
  faceFacade: (i) => (i === 1 || i === 2 ? fac : null) })
prism({ wall: stone, win, roof, coping: trim, ring: [[XN, YA], [TX0, YA], [TX0, wallY(TX0)], [-18.9, 31.0], [XN, 29.4]], z0: 0, z1: ATTIC, facade: { ...fac, ground: 9.5 },
  faceFacade: (i) => (i === 2 || i === 4 ? { ...fac, ground: 9.5 } : null) })
// The tower to the 18th-storey cornice, and the west wing beside it.
prism({ wall: stone, win, roof, coping: trim, ring: [[TX0, YA], [TX1, YA], [TX1, wallY(TX1)], [TX0, wallY(TX0)]], z0: ATTIC, z1: T1, facade: facTop, bevel: 0.4,
  faceFacade: (i) => (i === 3 ? null : facTop) })
prism({ wall: stone, win, roof, coping: trim, ring: [[-21.0, 3.8], [TX0, 3.8], [TX0, 25.1], [-21.0, 25.1]], z0: ATTIC, z1: WING, facade: facTop, bevel: 0.4,
  faceFacade: (i) => (i === 1 ? null : facTop) })
// The top stage (19th–22nd storeys), flat-roofed behind its cornice, and a
// roof house in the middle (lidar 106–109 m).
const ringUp: XY[] = [[-9.9, 4.8], [15.5, 4.8], [15.5, 17.1], [-9.9, 23.9]]
prism({ wall: stone, win, roof, coping: trim, ring: ringUp, z0: T1, z1: UP, facade: facTop, bevel: 0.5 })
prism({ wall: stone, win: null, roof, ring: insetRing(ringUp, 5.0), z0: UP - 1, z1: UP + 4.5, facade: null, bevel: 0.3 })
// Cornice bands: the 9th-storey balustrade and the 18th-storey cornice on the
// tower's Wall and Broad Street faces.
const wallFace: [XY, XY] = [[TX1, wallY(TX1)], [TX0, wallY(TX0)]]
const wallLen = Math.hypot(TX1 - TX0, wallY(TX1) - wallY(TX0))
rectPanel(trim, wallFace[0], wallFace[1], wallLen / 2, wallLen, ATTIC - 1.4, ATTIC - 0.2, 0.06)
rectPanel(trim, wallFace[0], wallFace[1], wallLen / 2, wallLen, T1 - 2.2, T1 - 0.8, 0.06)
rectPanel(trim, [XB, YA], [XB, wallY(XB)], (wallY(XB) - YA) / 2, wallY(XB) - YA, ATTIC - 1.4, ATTIC - 0.2, 0.06)
rectPanel(trim, [TX1, YA], [TX1, wallY(TX1)], (wallY(TX1) - YA) / 2, wallY(TX1) - YA, T1 - 2.2, T1 - 0.8, 0.06)
// Entrances: the arched doorway on Broad Street, the chamfered Wall/New corner.
archPanel(win, [XB, YA], [XB, wallY(XB)], 8.5, 3.2, 2.0, 8.4)
{
  const a: XY = [-18.9, 31.0], b: XY = [XN, 29.4]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  rectPanel(trim, a, b, L / 2, L - 0.3, 4.5, 11.0, 0.08)
  rectPanel(win, a, b, L / 2, 2.0, 5.0, 10.0, 0.12)
}

// Floodlights on Broad Street and on the balconies: the 1903 front (faces
// looking east, the columns all round, the flag) full; ledges and tops a
// little; nothing west of the front or above the attic.
const frontLit = (p: V3, n: V3): number => {
  if (p[0] < XB - DEPTH - 0.5 || p[1] > YA || p[2] > ATTIC + 0.1) return 0
  if (n[2] > 0.7) return 0.25
  if (n[0] > 0.3) return 1
  // Side faces only within the front (columns, recess reveals), not the end walls.
  return p[1] > YS + 1 && p[1] < YA - 1 ? (n[0] > -0.3 ? 0.6 : 0.3) : 0
}

finishModel('New York Stock Exchange', 'nyc-new-york-stock-exchange', [
  { part: stone, material: { ...finish('nyse-marble', 0xebe3d6), floodlight: frontLit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: frontLit } },
  { part: shade, material: { ...finish('nyse-marble-shade', 0xc9c0b1), floodlight: frontLit } },
  { part: win, material: PALETTE.window },
  // Dark glazing that stays dark at night (STYLE.md, Night).
  { part: dark, material: { ...PALETTE.glass, color: 0x3f4966 } },
  { part: red, material: { ...finish('flag-red', 0xbf4b45), floodlight: frontLit } },
], { bearing: 26, osm: 'way/278053530', height: UP + 4.5 }, 6500)
