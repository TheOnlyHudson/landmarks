/**
 * Four Seasons Hotel and Private Residences Denver (2010, Gensler / RTKL) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-four-seasons.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 45 (the
 * downtown grid): +y is north-east (14th to 15th Street), +x south-east.
 * Anchor -104.99814, 39.74659, the centroid of OSM way/189266919 (the
 * whole building: podium and tower). y = 0 is the lowest ground.
 *
 * Identity (from the photos below):
 *  1. A tall slab-like tower of pale tan stone with grouped blue-glass
 *     window bays.                                     (true, fed, beall)
 *  2. From about 55% of its height the corners step in, and the upper
 *     shaft carries stacked balconies at the corners.  (true, beall, lidar)
 *     The notches are 7 m along the short faces and 2.6 m along the long
 *     ones (lidar: the 86 m returns at each corner).
 *  3. A stepped glass crown: a raised spine and cross bar, a higher
 *     middle, a short mast; lit at night.        (true, fed, beall, lidar)
 *  4. A broad plain tan podium (hotel, parking) filling the block.  (true)
 *
 * Plan: OSM way/189266919 (outline) and way/457997451 (tower,
 * x 4.7..35.5, y -30.8..12.5 here). The lidar footprint sits about 1.5 m
 * north-east of OSM's (as across this part of downtown); OSM is kept and
 * the crown's lidar positions are moved with it.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py at bearing 45; ground about 2.8 m above the
 * grid's minimum; heights here from that.
 * Measured: podium 15.0 (south-west half), 19.5 (north-east half), 22.0
 * (north-west strip), 19 (the south-west corner block); tower roof 156.5;
 * the corner notches from 86 m (7 m by 2.6 m); the crown's spine
 * (x 15..25) at 160.5, its cross bar (y -15.5..-2) at 162.7, the middle at
 * 168.5; mast top 177.9 (the highest return). OSM tags 165 m, 172 m and a
 * 195 m spire; the lidar is used. Published: 45 floors.
 * Estimated: window grouping (three floors of 3.2 m per panel), balcony
 * bands, the crown's glazing, from the photos.
 *
 * Photos (evidence):
 *  true    "FourSeasonsDenver.jpg", Trueshow111, CC0,
 *          https://commons.wikimedia.org/wiki/File:FourSeasonsDenver.jpg
 *  fed     "FederalReserveDenverBranch.jpg", Trueshow111, CC0,
 *          https://commons.wikimedia.org/wiki/File:FederalReserveDenverBranch.jpg
 *          (tower behind the Federal Reserve, from the north)
 *  beall   "Four Seasons Denver.JPG", Jeffrey Beall, CC BY-SA 3.0,
 *          https://commons.wikimedia.org/wiki/File:Four_Seasons_Denver.JPG
 *          (2009, nearly finished, from Speer Boulevard)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only three usable photos, none close; the podium's facades are
 * drawn plain. The balcony layout is simplified to bands on the notched
 * corners. Beall's photo shows a tall construction mast; the finished mast
 * (true) is short, as the lidar has it.
 *
 * Night: tower windows glow (window); the crown glass is window-2, so it
 * glows as the real crown is lit.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, edgePanels, offset, prism, save, split, type XY } from './atl-flatiron-building'

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), crown = new Part()

  // ── podium ──
  const POD: XY[] = [[-21.4, -31.0], [35.4, -30.8], [35.5, 45.2], [-12.4, 45.0], [-12.5, -25.3], [-21.4, -25.4]]
  prism(stone, split(POD, 5), 0, 15.0, roof, 0.3)
  box(stone, 9.0, 35.5, 12.5, 45.2, 14.5, 19.5, roof, 0.3)
  box(stone, -12.4, -6.0, 26.0, 45.0, 14.5, 22.0, roof, 0.3)
  box(stone, -21.4, -12.5, -31.0, -25.4, 14.5, 19.0, roof, 0.3)
  const podPanels = { group: 4.2, gap: 0.8, bay: 4.5, pier: 1.2, margin: 1.5, out: 0.06 }
  for (let i = 0; i < POD.length; i++) edgePanels(win, POD[i], POD[(i + 1) % POD.length], 1.0, 5.2, podPanels)
  prism(trim, offset(split(POD, 5), 0.12), 13.8, 15.1, null, 0.15) // podium coping

  // ── tower ──
  const X0 = 4.7, X1 = 35.5, Y0 = -30.8, Y1 = 12.5, N = 7.0, M = 2.6, Z0 = 15.0, ZN = 86.0, ZR = 156.5
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const notched: XY[] = [
    [X0 + N, Y0], [X1 - N, Y0], [X1 - N, Y0 + M], [X1, Y0 + M], [X1, Y1 - M], [X1 - N, Y1 - M], [X1 - N, Y1],
    [X0 + N, Y1], [X0 + N, Y1 - M], [X0, Y1 - M], [X0, Y0 + M], [X0 + N, Y0 + M],
  ]
  prism(stone, rect(X0, X1, Y0, Y1), Z0, ZN, trim, 0.3)
  prism(stone, notched, ZN, ZR, roof, 0.4)
  const tw = { group: 9.6, gap: 1.4, bay: 3.4, pier: 1.6, margin: 1.6, out: 0.05 }
  const R0 = rect(X0, X1, Y0, Y1)
  for (let i = 0; i < 4; i++) edgePanels(win, R0[i], R0[(i + 1) % 4], Z0 + 1.5, ZN - 0.5, tw)
  for (let i = 0; i < notched.length; i++) {
    const a = notched[i], b = notched[(i + 1) % notched.length]
    edgePanels(win, a, b, ZN + 1.0, ZR - 4.0, { ...tw, margin: Math.hypot(b[0] - a[0], b[1] - a[1]) < 4 ? 0.4 : 1.4, min: 2 })
  }
  // balconies: pale slabs every two floors round the notched corners
  for (let z = ZN + 6.4; z < ZR - 5; z += 6.4) {
    for (const [cx, cy, sx, sy] of [[X0, Y0, 1, 1], [X1, Y0, -1, 1], [X1, Y1, -1, -1], [X0, Y1, 1, -1]] as const) {
      const sl = (xa: number, xb: number, ya: number, yb: number) =>
        box(trim, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), z, z + 0.45, trim, 0.1, true)
      // a 1.4 m slab along each of the notch's two inner faces
      sl(cx + sx * N, cx + sx * (N - 1.4), cy, cy + sy * M)
      sl(cx, cx + sx * (N - 1.4), cy + sy * M, cy + sy * (M - 1.4))
    }
  }
  prism(trim, notched, ZR - 1.2, ZR, roof, 0.2)

  // ── crown: glass spine, cross bar, raised middle, mast ──
  const glassBox = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    box(stone, x0, x1, y0, y1, z0, z1, roof, 0.3)
    const r = rect(x0, x1, y0, y1)
    for (let i = 0; i < 4; i++) edgePanels(crown, r[i], r[(i + 1) % 4], z0 + 0.6, z1 - 0.6, { group: z1 - z0, gap: 0, bay: 3.2, pier: 0.5, margin: 0.4, out: 0.05 })
  }
  glassBox(15.0, 25.0, Y0 + 1.0, Y1 - 1.0, ZR - 0.5, 160.5)
  glassBox(X0 + 1.0, X1 - 1.0, -15.5, -2.0, ZR - 0.5, 162.7)
  glassBox(15.0, 25.0, -14.0, -3.5, 160, 168.5)
  prism(trim, [[21.0, -9.5], [22.0, -9.5], [22.0, -8.5], [21.0, -8.5]], 168.5, 172.0, trim, 0.1)
  prism(trim, [[21.25, -9.25], [21.75, -9.25], [21.75, -8.75], [21.25, -8.75]], 172.0, 177.9, trim, 0.05)

  await save('den-four-seasons', 'Four Seasons Hotel Denver', [
    { part: stone, material: finish('tan-stone', 0xd9cab0) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: crown, material: windowVariant(2, 0xa9bfd1) },
  ], {}, 6500)
}
