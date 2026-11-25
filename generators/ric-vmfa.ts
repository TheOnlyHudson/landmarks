/**
 * Virginia Museum of Fine Arts, Richmond — procedural, CC0-1.0, no textures.
 * bun generators/ric-vmfa.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/146689449 (lng -77.4748995, lat 37.5560163); the
 * walls run at 24° and 114° (the Boulevard's grid), so the model is placed
 * at bearing 24 and built square. Model "east" is Arthur Ashe Boulevard.
 *
 * What it is, kept to the masses that read from the street: the 1936
 * Georgian-revival museum (Peebles & Ferguson) on the Boulevard, red brick
 * with limestone cornice and base; the later galleries behind it to the
 * west and south (pale stone, flat roofs with skylight lanterns); and to
 * the north the 2010 James W. and Frances G. McGlothlin wing (Rick Mather):
 * a limestone-clad block with ribbon windows, cut-in glass terraces and a
 * café on the sculpture garden, a set-back upper volume clad in silver
 * metal, a frosted-glass stair tower at its north-west corner, and a glass
 * entrance atrium where it meets the 1936 building on the Boulevard.
 *
 * Covers and replaces: way/146689449 (the outline; OSM maps no parts).
 *
 * Evidence
 * - OSM (measured): outline, read in the bearing-24 frame: x -51.4..51.5,
 *   y -73.4..82.3; the 1936 front on the Boulevard at x 51.4, y -62..14.4.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014, after the
 *   2010 wing), 1 m grid read every 4 m (measured, above the lowest ground,
 *   on the Boulevard side; the site rises about 3 m to the north-west):
 *   McGlothlin body 16.2, its west end 12.0, its upper volume 20–22 (lower at the west edge),
 *   stair tower 23.8, the low entrance canopy at the north-west 7.1;
 *   1936 front range 15.4 with a raised core 17.4 behind; southern and
 *   western galleries 16.5 with lanterns to 18.2; a tower at (0, -52) 23.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Virginia Museum of Fine Arts Exterior (February 2026).jpg" (Kiraface,
 *   CC BY-SA 4.0), from the Boulevard: red brick 1936 block with stone
 *   cornice and a row of low windows, the glass atrium, the limestone wing
 *   with its metal top and a tall window;
 *   "Virginia Museum of Fine Arts Back Exterior (February 2026).jpg"
 *   (Kiraface, CC BY-SA 4.0), the McGlothlin wing on the garden: limestone,
 *   glazed café and terraces, upper glass band, the frosted stair tower;
 *   "Virginia Museum of Fine Arts - entrance Fall2010.JPG" (Morgan Riley,
 *   CC BY 3.0), the north entrance: limestone, ribbon window, the silver
 *   upper volume, the stair tower.
 * - USGS NAIP (public domain): plan, the McGlothlin wing's dark roof, the
 *   pale gallery roofs and skylights.
 * - Colours from the photos: warm grey limestone; red brick (pulled to the
 *   palette's lightness); silver metal cladding; pale green frosted glass.
 * - Estimated: window bands and heights from the photos; where the brick
 *   ends and the later stone galleries begin (x 8, from NAIP roof colour);
 *   the south and west faces are not photographed here and are drawn
 *   plain (doubt). The 1936 front's own entrance is not photographed here
 *   and is left out rather than invented.
 * - Simplified: no quoins, balcony rails, exhaust stacks or sculpture.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect } from './dc-white-house'
import { saveModel, pslab, ppanel, type XY } from './dc-nga-west'

const lime = new Part(), brick = new Part(), roof = new Part(), win = new Part(), metal = new Part(), glass = new Part()

// ---- the McGlothlin wing (north)
const north: XY[] = [[-46, 22.7], [22, 22.7], [22, 30], [35.6, 30], [35.7, 44.6], [33.2, 44.6], [33.3, 61.8], [32.2, 61.8], [32.2, 72.6], [17.9, 72.6], [17.9, 67.3], [-21.5, 67.2], [-21.5, 75.3], [-46, 75.2]]
pslab(lime, north, 0, 16.2, 0.3, roof)
// the lower west end (lidar 12)
cbox(lime, rect(-51.4, -46, 22.7, 75.2), 0, 12.0, { b: 0.3, top: roof })
// upper volume in silver metal, set back
cbox(metal, rect(-44, 20, 26, 60), 16.0, 21.6, { b: 0.8, top: roof })
cbox(metal, rect(-48, -44, 30, 60), 16.0, 19.8, { b: 0.5, top: roof })
// stair tower, frosted glass, and the low entrance canopy beside it
cbox(glass, rect(-35.5, -28.8, 67.5, 75.5), 0, 23.8, { b: 0.2 })
cbox(lime, rect(-28.6, -21.6, 75.3, 82.2), 0, 7.1, { b: 0.2, top: roof })
// windows: the garden (north) front's café glazing and terraces, the ribbon
// window, the upper glass band
panel(win, 'n', 67.2, -19.5, 16, 0.6, 6.4, 0.05)
panel(win, 'n', 67.2, -19.5, -4, 8.4, 11.8, 0.05)
panel(win, 'n', 67.2, 3, 16, 8.4, 11.8, 0.05)
panel(win, 'n', 72.6, 19, 31.5, 8.4, 11.8, 0.05)
panel(win, 'n', 75.2, -45, -36, 9.0, 10.2, 0.05)
panel(win, 'n', 75.2, -51, -46.5, 5.5, 6.7, 0.05)
panel(win, 'n', 67.2, -20.5, 16.5, 14.3, 15.7, 0.05)
// the Boulevard (east) face: ground glazing and a tall window
panel(win, 'e', 35.7, 31.5, 43.5, 0.6, 3.8, 0.05)
panel(win, 'e', 33.25, 48, 60, 0.6, 3.8, 0.05)
panel(win, 'e', 33.25, 50.5, 53, 8.0, 12.0, 0.05)
panel(win, 'e', 35.7, 32, 44, 13.8, 15.4, 0.05)
// west face: ribbon window
panel(win, 'w', -51.4, 27, 73, 5.5, 6.7, 0.05)

// ---- glass entrance atrium between the wings, on the Boulevard
cbox(glass, rect(22, 43.4, 14.4, 30), 0, 15.4, { b: 0.2 })

// ---- the 1936 building on the Boulevard: red brick, stone base and cornice
const B = rect(8, 51.4, -62, 14.4)
cbox(lime, grow(B, 0.1), 0, 1.4, { top: false })
cbox(brick, B, 1.4, 14.4, { top: false })
cbox(lime, grow(B, 0.4), 14.4, 15.0, { b: 0.25, bottom: true, top: false })
cbox(brick, B, 15.0, 15.4, { b: 0.15, top: roof })
cbox(roof, rect(12, 36, -40, 10), 15.4, 17.4, { b: 0.3 })
// a row of low windows and a few tall ones near the north end (photo)
for (let y = -58; y <= 11; y += 4.6) panel(win, 'e', 51.4, y - 0.8, y + 0.8, 2.0, 4.2, 0.05)
for (let x = 11; x <= 49; x += 4.6) panel(win, 's', -62, x - 0.8, x + 0.8, 2.0, 4.2, 0.05)
for (const y of [4, 8.5]) panel(win, 'e', 51.4, y - 0.8, y + 0.8, 6.5, 10.5, 0.05)
// stone pilasters at the corners
for (const y of [-62, 14.4]) cbox(lime, rect(50.9, 51.8, y - (y < 0 ? 0 : 0.9), y + (y < 0 ? 0.9 : 0)), 1.4, 14.4, { top: false })

// ---- the later galleries behind (pale stone, skylight lanterns)
const south: XY[] = [[-28.3, -70.6], [20.7, -70.4], [20.7, -73.4], [31.5, -73.3], [31.5, -70.7], [45.9, -70.6], [45.9, -62.0], [8, -62], [8, 14.4], [22, 14.4], [22, 22.7], [-51.4, 22.7], [-51.4, 21.7], [-42.5, 21.7], [-42.6, -25.5], [-42.5, -56.6], [-28.3, -56.3]]
pslab(lime, south, 0, 16.5, 0.3, roof)
for (const [x0, x1, y0, y1] of [[-24, -6, -34, -17], [-34, -12, 4, 18], [12, 22, -58, -48]]) cbox(glass, rect(x0, x1, y0, y1), 16.5, 18.2, { b: 0.5 })
cbox(lime, rect(-3, 3, -62, -45), 16.5, 23.0, { b: 0.3, top: roof })
// a few window bands on the stone galleries' west and south fronts
ppanel(win, [-42.6, -25.5], [-42.5, -56.6], 0.1, 0.9, 1.0, 3.6)
panel(win, 's', -70.6, -26, 18, 1.0, 3.6, 0.05)

if (import.meta.main) {
  await saveModel('ric-vmfa', 'Virginia Museum of Fine Arts', [
    { part: lime, material: finish('vmfa-limestone', 0xe6decf) },
    { part: brick, material: finish('vmfa-brick', 0xb87a66) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('vmfa-metal-cladding', 0xc9ced2) },
    { part: glass, material: finish('glass', 0xb4d3cf, 0.3) },
  ], { source: 'generators/ric-vmfa.ts', bearing: 24, osm: 'way/146689449', height: 23.8 }, 5000)
}
