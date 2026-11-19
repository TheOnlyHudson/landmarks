/**
 * Historic Davidson County Courthouse (Davidson County Public Building and
 * Court House, now the Metro Courthouse), 1 Public Square, Nashville
 * (1937, Emmons Woolwine with Frederic C. Hirons; PWA Moderne) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nash-davidson-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the colonnaded front onto Public Square and +x runs along
 * the long axis toward the river end. Anchor = area centroid of OSM
 * way/130913030, 36.167256, -86.778587. y = 0 is the lowest ground under
 * the footprint (the front west corner, lidar 0.6 m above the box's
 * ground_min); the raised plaza in front of the doors is about 2 m up and
 * the ground behind 4–5 m up (the site climbs to the south).
 *
 * Identity, in order: the long pale limestone block; the giant colonnade
 * of twelve fluted columns between solid end piers across the Public
 * Square front, standing in front of a recessed wall of dark window bays;
 * the deep entablature with the inscribed frieze ("Davidson County Public
 * Building and Court House"); the set-back attic storey that steps the top
 * up behind the cornice, with small penthouses on it; the two-storey base
 * with the three tall entrance bays at the centre; the plain ends and rear
 * with vertical strips of windows.
 *
 * Evidence:
 *  - plan: OSM way/130913030 (79 x 29 m), matching the lidar footprint
 *    (x -40.2..40.0, y -15.8..14.8 here). The OSM node "Metro Nashville
 *    Courthouse" (node/6139853430) sits inside it.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 1 m grid in the
 *    model frame. Above y = 0: main cornice 35.6; the colonnade's floor
 *    (top of the base) 16.6; attic parapet 41.1 (set back ~3 m at the
 *    front, x ±37); roof inside the attic 37.4; penthouses 42.6; light
 *    wells at 31.1 (not drawn). Measured.
 *  - colonnade: 12 columns in 13 bays of 5 m between end piers, counted on
 *    LeMay's square-on photo (54385292733); column and entablature
 *    proportions from it and HABS TN-168-20 (estimated, ~2 m columns).
 *  - colours: pale buff-grey limestone (sampled #c0c3bd in shade, warmer
 *    in sun), dark window bays and bronze spandrels (drawn as window).
 *
 * Photos (all EVIDENCE):
 *  - Davidson County Courthouse and Nashville City Hall, Public Square,
 *    Nashville, TN (54385292733), (54385292138), (54385061456), Warren
 *    LeMay, CC BY-SA 2.0 (front square on, north-east, front from the
 *    square)
 *    https://commons.wikimedia.org/wiki/File:Davidson_County_Courthouse_and_Nashville_City_Hall,_Public_Square,_Nashville,_TN_(54385292733).jpg
 *    https://commons.wikimedia.org/wiki/File:Davidson_County_Courthouse_and_Nashville_City_Hall,_Public_Square,_Nashville,_TN_(54385292138).jpg
 *  - HABS TENN,19-NASH,21 (public domain): -2 elevated view of the north
 *    elevation, -4 east elevation, -5 south (rear) and west elevations,
 *    -7 entrance bays, -20 upper floors detail.
 *    https://commons.wikimedia.org/wiki/File:South_(rear)_and_west_elevations_-_Davidson_County_Courthouse_and_Public_Building,_Public_Square,_Nashville,_Davidson_County,_TN_HABS_TENN,19-NASH,21-5.tif
 *  - USGS NAIP (public domain): plan.
 * No look-only sources. No commercial imagery.
 *
 * Night: window bays glow; the entrance doors are `entrance`; the front
 * carries floodlight.
 *
 * Left out: the plaza, steps and fountain (ground and map features), the
 * fluting, the carved heads on the cornice, the relief panels, lettering,
 * the light wells in the roof.
 *
 * Doubts: column diameter and the depth of the recess behind the columns
 * are estimated (lidar shows the colonnade floor at 16.6 in the middle
 * bays); the rear's bay rhythm is drawn as the front's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, save } from './atl-westin-peachtree-plaza'
import { rectOn, band, block } from './nash-ryman-auditorium'
import { wf, rect, lathe, type Side } from './nash-downtown-presbyterian'

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const X0 = -40.2, X1 = 40.0, Y0 = -15.8, Y1 = 14.8, XC = (X0 + X1) / 2
  const PL = 2.0 // plaza in front of the doors
  const BT = 16.6, CT = 30.0, CORN = 35.6, ATT = 41.1
  const CX = 32.5 // colonnade half-span
  const YW = 12.0, YCOL = 13.6 // recessed wall, column line

  // ── Base and main block ──
  prism(stone, rect(X0, Y0, X1, Y1), 0, BT, stone, 0.01)
  prism(stone, rect(X0, Y0, X1, YW), BT, CORN - 1.0, roof, 0.01)
  for (const s of [-1, 1]) {
    const xa = s < 0 ? X0 : XC + CX, xb = s < 0 ? XC - CX : X1
    prism(stone, rect(xa, YW - 0.1, xb, Y1), BT, CORN - 1.0, roof, 0.01)
  }
  // entablature over the colonnade
  prism(stone, rect(XC - CX, YW, XC + CX, Y1), CT, CORN - 1.0, roof, 0.01)
  capPoly(trim, rect(XC - CX, YW, XC + CX, Y1), CT, false)
  // cornice round the whole block and a roof inside the parapet
  prism(trim, rect(X0 - 0.35, Y0 - 0.35, X1 + 0.35, Y1 + 0.35), CORN - 1.0, CORN, roof, 0.15)
  // set-back attic storey and penthouses
  prism(stone, rect(XC - 37, Y0 + 1.2, XC + 37, Y1 - 3.3), CORN, ATT - 0.5, roof, 0.01)
  prism(trim, rect(XC - 37.2, Y0 + 1.0, XC + 37.2, Y1 - 3.1), ATT - 0.5, ATT, roof, 0.1)
  for (const s of [-1, 1]) prism(stone, rect(XC + s * 34 - (s > 0 ? 10 : 0), -4, XC + s * 34 + (s < 0 ? 10 : 0), 4), ATT, 42.6, stone, 0.1)
  // base: a plinth band and a course at the top of the base
  for (const [dir, c, lo, hi] of [['N', Y1, X0, X1], ['S', Y0, X0, X1], ['E', X1, Y0, Y1], ['W', X0, Y0, Y1]] as [Side, number, number, number][]) {
    const { f } = wf(dir, c, lo, hi)
    band(trim, f, 0, f.L, BT - 0.6, BT, 0.15)
  }

  // ── Front: colonnade, window bays behind, inscribed frieze ──
  {
    const { f, s } = wf('N', YW, X0, X1)
    for (let k = 0; k < 13; k++) {
      const x = XC - CX + 2.5 + 5 * k
      for (const [z0, z1] of [[BT + 0.6, 20.6], [21.3, 25.2], [25.9, CT - 0.5]]) rectOn(win, f, s(x) - 1.75, s(x) + 1.75, z0, z1, 0.06)
    }
    for (let k = 1; k <= 12; k++) {
      const x = XC - CX + 5 * k
      lathe(trim, x, YCOL, [[1.15, BT], [1.15, BT + 0.4], [0.95, BT + 0.5], [0.85, CT - 0.9], [1.05, CT - 0.5], [1.05, CT - 0.4]], 12, false)
      block(trim, x - 1.15, x + 1.15, YCOL - 1.15, YCOL + 1.15, CT - 0.4, CT)
    }
    // soffit under the entablature between the piers
    const { f: E } = wf('N', Y1, X0, X1)
    band(trim, E, s(XC - CX), s(XC + CX), CT, CT + 0.8, 0.1) // architrave
    rectOn(trim, E, s(XC - CX) + 1.5, s(XC + CX) - 1.5, CT + 1.6, CT + 3.0, 0.05) // inscribed frieze
    // base: two tiers of windows per bay, the three tall entrance bays at the centre
    for (let k = 0; k < 13; k++) {
      const x = XC - CX + 2.5 + 5 * k
      if (k >= 5 && k <= 7) {
        rectOn(trim, E, s(x) - 1.7, s(x) + 1.7, PL, 12.8, 0.04)
        rectOn(door, E, s(x) - 1.1, s(x) + 1.1, PL, 6.6, 0.08)
        rectOn(win, E, s(x) - 1.1, s(x) + 1.1, 7.0, 12.2, 0.08)
        continue
      }
      rectOn(win, E, s(x) - 1.1, s(x) + 1.1, 4.0, 7.4, 0.06)
      rectOn(win, E, s(x) - 1.1, s(x) + 1.1, 9.0, 15.0, 0.06)
    }
    // end piers: a narrow window strip in each
    for (const sg of [-1, 1]) {
      const x = XC + sg * (CX + 3.8)
      for (const [z0, z1] of [[4.0, 7.4], [9.0, 15.0], [BT + 0.6, 25.2], [25.9, CT - 0.5]]) rectOn(win, E, s(x) - 0.9, s(x) + 0.9, z0, z1, 0.06)
    }
  }

  // ── Rear and ends: vertical strips of grouped windows between plain piers ──
  {
    const { f, s } = wf('S', Y0, X0, X1)
    for (let k = 0; k < 15; k++) {
      const x = X0 + 4.0 + k * ((X1 - X0 - 8) / 14)
      for (const [z0, z1] of [[6.0, 10.0], [11.0, 15.4], [BT + 0.8, 22.0], [23.0, 28.6], [29.6, 33.6]]) rectOn(win, f, s(x) - 1.0, s(x) + 1.0, z0, z1, 0.06)
    }
  }
  for (const [dir, X] of [['E', X1], ['W', X0]] as [Side, number][]) {
    const { f, s } = wf(dir, X, Y0, Y1)
    for (const y of [-9.5, -4.5, 0.5, 5.5, 10.5]) {
      for (const [z0, z1] of [[5.2, 9.6], [10.6, 15.4], [BT + 0.8, 22.0], [23.0, 28.6], [29.6, 33.6]]) rectOn(win, f, s(y) - 1.0, s(y) + 1.0, z0, z1, 0.06)
    }
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > 10 && n[1] > 0.4 ? 0.75 : 0)
  return [
    { part: stone, material: { ...finish('courthouse-limestone', 0xddd6c5), floodlight: flood } },
    { part: trim, material: { ...finish('courthouse-dressings', 0xebe5d7), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: { ...PALETTE.entrance, color: 0x6f6252 } },
  ]
}

if (import.meta.main) {
  await save('nash-davidson-county-courthouse', 'Historic Davidson County Courthouse', build(), { height: 42.6, anchor: [36.167256, -86.778587], bearing: 332 })
}
