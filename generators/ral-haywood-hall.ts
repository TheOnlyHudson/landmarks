/**
 * Haywood Hall, 211 New Bern Avenue, Raleigh (1799, Federal-style frame
 * house of Treasurer John Haywood): procedural, CC0-1.0.
 * bun generators/ral-haywood-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 4.0 (OSM
 * way/47776422's edges run at 4.0° / 94.0°). Origin: the area centroid of
 * way/47776422 (-78.6358132, 35.7807557).
 *
 * Ground: Mapterhorn z13 falls ~1 m from the north-east to the south-west
 * corner, the lowest point under the footprint (y = 0). The front (south)
 * grade is G = 0.5; heights below are from it, as HABS draws them. Walls run
 * down to y = 0. Elevation 0.
 *
 * Plan (OSM, model frame): main house x -6.55 … 8.4, y -8.9 … 0.2 (HABS
 * sheet 3: 51'-2" wide; about 29'-10" deep), the west and east chimneys
 * reaching OSM's ends at x -7.05 and 8.96; the two-storey front porch
 * x -1.7 … 3.0 (HABS: 15'-0" wide), 2.0 m deep (OSM; HABS 8'-6" to the
 * steps); behind, one-storey rear rooms (x -1.68 … 7.59, y 0.2 … 5.78) and
 * a frame wing x -7.43 … 0, y 3.52 … 13.26 (OSM; not on the 1967 HABS
 * sheets, which show servant's porch and west additions since removed).
 *
 * Heights: published (HABS NC-229 measured drawings, 1967, sheets 6–8,
 * scaled on the 51'-2" front): first floor 0.82; lower windows 2.16 … 4.02,
 * upper 5.89 … 7.45, 1.27 m wide, centred at -6.13, -3.18, +3.11, +5.67 m
 * from the front's centre; dentil cornice to 8.1 (eaves); ridge 11.3;
 * chimney tops 13.2, the east chimney 1.6 m wide at its base, shouldered at
 * 5.1 and 8.5; porch: lower order to 4.4, balcony floor 4.85, upper order to
 * 7.35, entablature to 7.7, flat roof. Rear rooms (eaves 3.6) and the north
 * wing (eaves 4.0, ridge 7.0) are estimated (NAIP, no photo).
 *
 * Evidence:
 *  p1 "Haywood Hall.jpg", Mx. Granger, CC0,
 *     https://commons.wikimedia.org/wiki/File:Haywood_Hall.jpg — the south
 *     front and east side from the south-east: white clapboard, black
 *     shutters, stone foundation, red brick chimney, two-storey porch.
 *  HABS NC,92-RAL,8- sheets 1–8 of 20 (Library of Congress, public domain),
 *     https://commons.wikimedia.org/wiki/File:Haywood_Hall,_211_New_Bern_Avenue,_Raleigh,_Wake_County,_NC_HABS_NC,92-RAL,8-_(sheet_6_of_20).png
 *     and siblings: site plan, floor plans, south, east, north elevations.
 * Aerial: USGS NAIP (public domain): grey roofs, the north wing.
 *
 * Left out: clapboard lines, dentils, porch balustrades and steps, sash
 * bars, the lamps. Doubts: the west side and the north wing are
 * unphotographed; the west chimney is drawn like the east one (HABS south
 * elevation shows its stack); the rear rooms' roofs are simplified.
 * Night: windows lit (a house museum; modest).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'

const G = 0.5, FL = G + 0.82
const X0 = -6.55, X1 = 8.4, XC = (X0 + X1) / 2, Y0 = -8.9, Y1 = 0.2, YC = (Y0 + Y1) / 2, HD = (Y1 - Y0) / 2
const EAVE = G + 8.1, RIDGE = G + 11.3, LIFT = 0.1
const PX0 = -1.7, PX1 = 3.0, PY0 = Y0 - 2.0

function build() {
  const wall = new Part(), roof = new Part(), brick = new Part(), win = new Part(), shut = new Part(), stone = new Part()

  // ============================================================ main house
  box(stone, X0, Y0, X1, Y1, 0, FL, null)
  prismX(wall, X0, X1, [[Y0, FL], [Y1, FL], [Y1, EAVE], [YC, RIDGE], [Y0, EAVE]])
  // the dentil cornice as a broad band under the eaves (front and back)
  for (const [a, b] of [[Y0 - 0.3, Y0], [Y1, Y1 + 0.3]]) box(wall, X0 - 0.1, a, X1 + 0.1, b, EAVE - 0.45, EAVE)
  roofX(roof, X0 - 0.35, X1 + 0.35, YC, HD, EAVE + LIFT, RIDGE + LIFT, 0.45, 0.2)

  // windows with black shutters, front (HABS sheet 6) and back (sheet 8)
  const front: Face = { o: [XC, Y0, 0], n: [0, -1] }, back: Face = { o: [XC, Y1, 0], n: [0, 1] }
  for (const s of [-6.13, -3.18, 3.11, 5.67]) {
    for (const [z0, z1] of [[G + 2.16, G + 4.02], [G + 5.89, G + 7.45]]) {
      for (const [f, ss] of [[front, s], [back, -s]] as [Face, number][]) {
        panel(win, f, ss, 1.27, z0, z1)
        for (const d of [-1, 1]) panel(shut, f, ss + d * 0.95, 0.55, z0 - 0.05, z1 + 0.05)
      }
    }
  }
  // the doors: front (ground and balcony) and back
  panel(shut, front, PX0 + (PX1 - PX0) / 2 - XC, 1.05, FL, G + 3.3)
  panel(win, front, PX0 + (PX1 - PX0) / 2 - XC, 1.05, G + 3.35, G + 3.9)
  panel(shut, front, PX0 + (PX1 - PX0) / 2 - XC, 1.0, G + 4.85, G + 7.0)
  panel(shut, back, 0, 1.0, FL, G + 3.3)

  // gable ends: chimneys centred, a window each side per floor and in the attic (sheet 7)
  for (const sg of [-1, 1]) {
    const xw = sg < 0 ? X0 : X1, xo = sg < 0 ? -7.05 : 8.96
    const a = Math.min(xw, xo), b = Math.max(xw, xo)
    // stepped base, shoulders, stack to 13.2
    box(brick, a, YC - 0.8, b, YC + 0.8, 0, G + 5.1)
    box(brick, a, YC - 0.6, b, YC + 0.6, G + 5.1, G + 8.5, null)
    const sa = sg < 0 ? xo : xw - 0.55, sb = sg < 0 ? xw + 0.55 : xo
    box(brick, sa, YC - 0.45, sb, YC + 0.45, G + 8.5, G + 13.2)
    box(brick, sa - 0.08, YC - 0.53, sb + 0.08, YC + 0.53, G + 12.8, G + 13.2, null)
    const f: Face = { o: [xw, YC, 0], n: [sg, 0] }
    for (const d of [-2.6, 2.6]) {
      for (const [z0, z1] of [[G + 2.16, G + 4.02], [G + 5.89, G + 7.45]]) {
        panel(win, f, d, 1.1, z0, z1)
        for (const e of [-1, 1]) panel(shut, f, d + e * 0.85, 0.5, z0 - 0.05, z1 + 0.05)
      }
      panel(win, f, d * 0.55, 0.7, G + 8.5, G + 9.5)
    }
  }

  // ============================================================ the two-storey front porch
  {
    const x0 = PX0, x1 = PX1, y0 = PY0, y1 = Y0
    box(stone, x0, y0, x1, y1, 0, FL)
    box(wall, x0, y0, x1, y1, G + 4.4, G + 4.85)
    box(wall, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1, G + 7.35, G + 7.7)
    box(roof, x0 - 0.25, y0 - 0.25, x1 + 0.25, y1, G + 7.7, G + 7.85)
    for (const x of [x0 + 0.25, x0 + 1.55, x1 - 1.55, x1 - 0.25]) {
      const y = y0 + 0.25
      lathe(wall, x, y, [[0.2, FL], [0.17, G + 4.4]], 10)
      lathe(wall, x, y, [[0.17, G + 4.85], [0.15, G + 7.35]], 10)
    }
    // back columns at the wall
    for (const x of [x0 + 0.25, x1 - 0.25]) {
      box(wall, x - 0.15, y1 - 0.15, x + 0.15, y1, FL, G + 7.35, null)
    }
  }

  // ============================================================ rear rooms and the north wing (estimated)
  box(stone, -1.68, Y1, 7.59, 4.85, 0, FL - 0.3, null)
  box(wall, -1.68, Y1, 7.59, 4.85, FL - 0.3, G + 3.6, null)
  // a low shed roof falling north
  prismX(roof, -1.9, 7.8, [[Y1 - 0.1, G + 4.4], [Y1 - 0.1, G + 4.6], [5.1, G + 3.7], [5.1, G + 3.5]])
  box(wall, -1.68, 4.85, 0.0, 5.78, 0, G + 3.6)
  panel(win, { o: [3.0, 4.85, 0], n: [0, 1] }, 0, 1.0, FL + 0.6, FL + 2.0)
  panel(win, { o: [6.0, 4.85, 0], n: [0, 1] }, 0, 1.0, FL + 0.6, FL + 2.0)
  {
    const x0 = -7.43, x1 = 0.0, y0 = 3.52, y1 = 13.26, xc = (x0 + x1) / 2, hw = (x1 - x0) / 2
    box(stone, x0, y0, x1, y1, 0, FL - 0.2, null)
    prismY(wall, y0, y1, [[x0, FL - 0.2], [x1, FL - 0.2], [x1, G + 4.0], [xc, G + 7.0], [x0, G + 4.0]])
    roofY(roof, y0 - 0.3, y1 + 0.3, xc, hw, G + 4.0 + LIFT, G + 7.0 + LIFT, 0.35, 0.18)
    box(brick, xc - 0.45, y1 - 0.2, xc + 0.45, y1 + 0.5, 0, G + 8.0)
    for (const sg of [-1, 1]) {
      const f: Face = { o: [sg < 0 ? x0 : x1, (y0 + y1) / 2, 0], n: [sg, 0] }
      for (const s of [-2.5, 2.5]) {
        panel(win, f, s, 1.0, FL + 0.8, FL + 2.5)
        for (const e of [-1, 1]) panel(shut, f, s + e * 0.75, 0.45, FL + 0.75, FL + 2.55)
      }
    }
  }

  return finishGlb('Haywood Hall', [
    { part: wall, material: finish('hh-clapboard', 0xf2ede4) },
    { part: roof, material: PALETTE.roof },
    { part: brick, material: finish('hh-brick', 0xb06a52) },
    { part: win, material: PALETTE.window },
    { part: shut, material: finish('hh-shutter', 0x4a4f57) },
    { part: stone, material: finish('hh-stone', 0xcdbf9f) },
  ], { bearing: 4.0, height: G + 13.2, replaces: ['way/47776422'] })
}

if (import.meta.main) await writeModel('ral-haywood-hall', build())
