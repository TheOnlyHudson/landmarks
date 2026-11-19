/**
 * Four Seasons Hotel and Private Residences Nashville (100 Demonbreun
 * Street, at 2nd Avenue South), Nashville (2022) — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-four-seasons.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Identity and outline: the brief's candidates near -86.7728 36.1590
 * (way/464660164, 464660165, 464660185, 591997416/422/455) are other
 * buildings 150 m south, around the Ascend Amphitheater. The Four Seasons
 * is the OSM building way/1152585753 (building=hotel, addr:housenumber
 * 160, unnamed), with OSM's "Four Seasons - Nashville" hotel node
 * (node/13522219074) inside it, at the corner of Demonbreun Street and
 * 2nd Avenue; lidar and NAIP show the tower on it. It is the whole complex
 * (tower and podium) in one outline; no building:parts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of
 * way/1152585753 (36.1605239, -86.7737375). Bearing 62°: the outline's
 * sides; +x faces 152° (2nd Avenue), -y faces 242° (Demonbreun Street).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - a tall, plain, light-blue glass slab on a broad podium, its glass
 *   reading pale and reflective (a light window variant);
 * - the dark horizontal slot across the tower where it clears the podium's
 *   glass block (the amenity floor; Jschnake's and Brichar's photos);
 * - the recessed balcony strip up one corner of the residences above;
 * - a glass parapet screen at the top;
 * - the podium: warm tan vertical cladding below, a glass band above, a
 *   glass hotel block beside the tower to ~56 m with a planted terrace.
 *
 * Evidence
 * - OSM: way/1152585753 (read in this frame: x -52 to 43.6, y -31.4 to 28.2,
 *   with the west wing x < -33.5 only north of y = -1.3).
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022. The tower was under construction
 *   at the flight: the cloud shows a 69 x 24 m floor plate at 56 m along the
 *   Demonbreun side (x -35 to 34, y -30 to -5, with tower cranes standing in
 *   it), the podium at 29.8 m (x -40 to 34, y -5 to 25), the west wing at
 *   19 m and a 19-25 m strip along 2nd Avenue. Heights above the lowest
 *   ground under the footprint (~1.5 m above the box's ground_min).
 * - NAIP (USGS NAIP Plus, newer than the lidar): the finished tower's roof
 *   is 23 m wide across the lean; along the lean (62°) the aerial smears
 *   roof and facade together (~45 m), so it gives the width only. The
 *   tower is drawn 23 x 24.4 m at the south-east end of the 2022 lidar
 *   plate (x 11 to 34), on the corner of Demonbreun and 2nd Avenue where
 *   Brichar's photo shows it; the rest of the plate (x -35 to 11) is the
 *   56 m glass hotel block that Jschnake's photos show beside the tower,
 *   with its terrace at the slot's level.
 * - Published: 165.2 m (542 ft), 40 floors, 2022 (Wikipedia, "List of
 *   tallest buildings in Nashville"). The tower's height is the published
 *   one (the lidar predates topping out).
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   4 Seasons Nashville.jpg, Jschnake, CC BY-SA 4.0 (from the Shelby Street
 *     bridge: the tower over the podium and its glass block);
 *   4SeasonsNash- June 2022.jpg, Jschnake, CC BY-SA 4.0 (the whole tower:
 *     the slot, the balcony strip, the parapet, the tan podium);
 *   Four Seasons Tower Nashville.jpg, Brichar60, CC BY-SA 4.0 (from
 *     Demonbreun and 2nd Avenue, during cladding: the slot, the podium
 *     cladding at the corner).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: pale sky-blue glass,
 *   warm tan podium cladding, the slot in a darker window colour.
 * - Night: all glazing glows (window, window-2; the slot and the parapet
 *   screen share window-2, the darker glass).
 *
 * Estimated: the tower's plan and position (above); the slot's height
 * (56-59.5 m, at the glass block's top, as in Jschnake's photo); the
 * balcony strip (the tower's north-west corner, 3 m deep, 95-156 m); the
 * parapet (5 m); the tan cladding's height (21 m).
 * Doubts: the tower's plan rests on the 2022 construction-stage lidar plate,
 * the aerial's width and the photos' proportions (slender from the river,
 * Jschnake), not on a finished-building survey; worth checking against a
 * newer lidar flight. The north and west faces are seen only far off.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { ccw, prism, bevel, rect, rows, panels, ringPanels, lip, walls, cap, save, type Layer } from './nash-pinnacle'

function build(): Layer[] {
  const tan = new Part(), win = new Part(), frame = new Part(), slot = new Part(), roof = new Part(), green = new Part()

  // --- podium ---
  const Z_TAN = 21, Z_POD = 29.8, Z_WING = 19
  const main = bevel(ccw([[-40, -31.4], [43.6, -31.2], [43.6, 28.2], [-40, 28.1]]), 0.4)
  prism(tan, main, 0, Z_TAN, null)
  prism(frame, main, Z_TAN, Z_POD, roof)
  ringPanels(win, main, [[Z_TAN + 0.8, Z_POD - 1.2]], 4.5, 0.4)
  lip(frame, main, Z_POD - 0.5, Z_POD, 0.25)
  const wing = bevel(ccw([[-52, -1.4], [-40, -1.4], [-40, 28.1], [-52, 28.0]]), 0.4)
  prism(tan, wing, 0, Z_WING, roof)
  // shopfront glazing in the tan base, and a few tall slots as in the photos
  ringPanels(win, main, [[0.8, 6.0]], 6, 1.2, 4)
  ringPanels(win, wing, [[0.8, 6.0], [8, Z_WING - 2]], 6, 1.6, 4)

  // --- the glass hotel block beside the tower, to 56 m, with a planted terrace ---
  const Z_BLK = 56
  const blk = bevel(ccw(rect(-35, -30.5, 10.8, -6)), 0.3)
  prism(frame, blk, Z_POD, Z_BLK, roof)
  ringPanels(win, blk, rows(Z_POD, Z_BLK, Z_POD, 12, 0.6, 0.6, 0.3), 4.2, 0.3, 3, 0.3)
  lip(frame, blk, Z_BLK - 0.5, Z_BLK, 0.15)
  prism(green, bevel(ccw(rect(-33, -28.5, 8.5, -8)), 0.3), Z_BLK, Z_BLK + 0.5, green)

  // --- the tower ---
  const X0 = 11.0, X1 = 34, Y0 = -30.6, Y1 = -6.2
  const Z_SLOT0 = 56, Z_SLOT1 = 59.5, Z_ROOF = 160, Z_TOP = 165.2
  const grp = (z0: number, z1: number) => rows(z0, z1, Z_TAN, 12.2, 0.55, 0.5, 0.3)
  const low = bevel(ccw(rect(X0, Y0, X1, Y1)), 0.4)
  prism(frame, low, Z_POD, Z_SLOT0, null)
  ringPanels(win, low, grp(Z_POD, Z_SLOT0), 4.5, 0.3, 3, 0.3)
  // the slot: set in 1.6 m, dark
  const sl = bevel(ccw(rect(X0 + 1.6, Y0 + 1.6, X1 - 1.6, Y1 - 1.6)), 0.3)
  prism(slot, sl, Z_SLOT0, Z_SLOT1, null)
  cap(frame, low, Z_SLOT0)
  // upper tower, with the balcony recess at its north-west corner (x0, y1) from 95 m
  const Z_BAL0 = 95, Z_BAL1 = 156, BD = 3.2
  const up = bevel(ccw(rect(X0, Y0, X1, Y1)), 0.4)
  cap(frame, up, Z_SLOT1, false)
  prism(frame, up, Z_SLOT1, Z_BAL0, null)
  ringPanels(win, up, grp(Z_SLOT1, Z_BAL0), 4.5, 0.3, 3, 0.3)
  const notchd = bevel(ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0 + 9, Y1], [X0 + 9, Y1 - BD], [X0 + BD, Y1 - BD], [X0 + BD, Y1 - 9], [X0, Y1 - 9]]), 0.3)
  prism(frame, notchd, Z_BAL0, Z_BAL1, null)
  ringPanels(win, notchd, grp(Z_BAL0, Z_BAL1), 4.5, 0.3, 2.5, 0.3)
  cap(roof, ccw([[X0, Y1 - 9], [X0 + BD, Y1 - 9], [X0 + BD, Y1 - BD], [X0 + 9, Y1 - BD], [X0 + 9, Y1], [X0, Y1]]), Z_BAL0)
  // balcony slabs in the recess, every three floors
  for (let z = Z_BAL0 + 12; z < Z_BAL1 - 2; z += 12.2) {
    const r1 = ccw(rect(X0 + 0.2, Y1 - 9, X0 + BD, Y1 - BD)), r2 = ccw(rect(X0 + BD, Y1 - BD, X0 + 9, Y1 - 0.2))
    for (const r of [r1, r2]) prism(frame, r, z - 0.4, z, frame)
  }
  prism(frame, up, Z_BAL1, Z_ROOF, roof)
  ringPanels(win, up, grp(Z_BAL1, Z_ROOF), 4.5, 0.3, 3, 0.3)
  // the parapet screen: glass walls round the roof
  walls(slot, up, Z_ROOF, Z_TOP)
  const inner = bevel(ccw(rect(X0 + 0.5, Y0 + 0.5, X1 - 0.5, Y1 - 0.5)), 0.3)
  walls(slot, [...inner].reverse(), Z_ROOF, Z_TOP)
  lip(frame, up, Z_TOP - 0.4, Z_TOP, 0.05)
  prism(frame, bevel(ccw(rect(16, -24, 29, -12)), 0.3), Z_ROOF, Z_ROOF + 3.5, roof)

  return [
    { part: win, material: { ...PALETTE.window, color: 0x93acc3 } },
    { part: frame, material: finish('four-seasons-mullion', 0xc9d3db) },
    { part: slot, material: windowVariant(2, 0x5f7488) },
    { part: tan, material: finish('four-seasons-cladding', 0xcdb596) },
    { part: roof, material: PALETTE.roof },
    { part: green, material: finish('roof-garden', 0x9aae8a) },
  ]
}

if (import.meta.main) {
  await save('nash-four-seasons', 'Four Seasons Hotel and Private Residences Nashville', build(), {
    bearing: 62, height: 165.2, replaces: ['way/1152585753'],
  })
}
