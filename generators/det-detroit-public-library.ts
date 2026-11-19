/**
 * Detroit Public Library, Main Library (5201 Woodward Avenue; 1921 Cass
 * Gilbert, Italian Renaissance, white Vermont marble; the Cass Avenue wings
 * and connecting hall 1963, Cass Gilbert Jr. and Francis Keally):
 * procedural, CC0-1.0.
 * bun generators/det-detroit-public-library.ts
 *
 * Map frame: x, y, z up, metres, turned to the library's walls: +y runs along
 * bearing 63.5 (east-north-east, towards Woodward Avenue), +x along 153.5.
 * The Gilbert front faces +y, the 1963 Cass front -y. The anchor is the
 * centroid of the OSM outline way/58826126: 42.3584794, -83.0669680.
 *
 * Identity, in order: the long white-marble Woodward front, symmetric, with
 * its arcade of seven tall round-arched windows between pilasters on the
 * piano nobile, a single window under a blind arch in each end bay, the
 * rusticated ground floor with small windows and the central door, the
 * frieze band with small square attic windows and the heavy cornice; the two
 * green copper-roofed rooftop pavilions behind the cornice; on Cass, the
 * 1963 hall of tall narrow windows between marble piers, its dark granite
 * entrance block with red columns, and the two tall plain marble wings.
 *
 * Evidence:
 *  - plan: OSM way/58826126 (building=public, height 11.73: too low).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid in this
 *    frame. y = 0 is the lowest ground (the Cass end of the wings, 1.0 m
 *    over the box minimum); Woodward is 1.7 m higher. Measured: the Gilbert
 *    block's cornice 21.8 (x +-31 at the front, +-28.5 behind, back to
 *    y = -10); the inner hall's roof 22.8; the copper pavilions 26.4 (front
 *    pair) and 24.4 (rear); the 1963 hall 10.2; the wings 10.4 at the
 *    edges and 15.3 in the middle.
 *  - photos (all EVIDENCE):
 *    - Detroit Public Library Main Branch January 2015.jpg, Michael Barera,
 *      CC BY-SA 4.0 (Woodward front square on): every opening's place and
 *      size, scaled 0.0418 m/px to the lidar width.
 *      https://commons.wikimedia.org/wiki/File:Detroit_Public_Library_Main_Branch_January_2015.jpg
 *    - Detroit Library Main Branch - IMG 8924.JPG, Daderot, public domain
 *      (front, oblique; the end bays' blind arches).
 *      https://commons.wikimedia.org/wiki/File:Detroit_Library_Main_Branch_-_IMG_8924.JPG
 *    - Detroit December 2021 03 (Detroit Public Library).jpg, Michael Barera,
 *      CC BY-SA 4.0 (the Cass side: the 1963 hall, granite entrance, wings,
 *      the Gilbert block's rear).
 *      https://commons.wikimedia.org/wiki/File:Detroit_December_2021_03_(Detroit_Public_Library).jpg
 *    - Main public library building - Detroit LCCN2014647618.jpg, Library of
 *      Congress, public domain (1921 view of the front and side).
 *  - published: Cass Gilbert, opened 1921; wings 1963 (Wikipedia, "Detroit
 *    Public Library"; NRHP 83000881, Cultural Center Historic District).
 *  Estimated: the front terrace (the facade starts 3.6 m over y = 0, 1.9 m
 *  over Woodward, behind a terrace wall), the side windows, the wing glazing.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the brief mentions a low tile roof; the lidar and the aerial show a
 * flat roof behind the cornice, so there is none. The side elevations are
 * seen only obliquely; their windows repeat the front's rhythm. The light
 * wells round the inner hall are left out. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect } from './chi-aon-center'
import { flatShape, extrudeShape, archShape, archBand, lathe, arc } from './sea-tacoma-union-station'
import { bbox, box, hip, panels, arches, side, sOf, R, spread, saveModel, type Mat } from './det-detroit-institute-of-arts'

const FR = 60.2, GX = 31, GX2 = 28.5, GB = -10 // the Gilbert block: front face, half-widths, back face
const TOP = 21.8, T0 = 3.6 // cornice top; the facade's terrace level
const z = (py: number) => T0 + (815 - py) * 0.0418 // photo pixel row to height

function build(): Mat[] {
  const stone = new Part(), win = new Part(), cu = new Part(), trim = new Part(), gran = new Part(), red = new Part()

  // ---------------------------------------------------------------- the Gilbert block
  bbox(stone, stone, -GX, 40, GX, FR, 0, TOP - 1.3, 0.2)
  bbox(stone, stone, -GX2, GB, GX2, 40.2, 0, TOP - 1.3, 0.2)
  // the cornice, projecting all round
  for (const [x0, y0, x1, y1] of [[-GX, 40, GX, FR], [-GX2, GB, GX2, 40.2]]) bbox(trim, trim, x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, TOP - 1.3, TOP, 0.4)
  // the inner hall's raised roof and the copper-roofed pavilions
  box(stone, stone, -12, 6, 12, 42, TOP, 22.8)
  for (const [cx, cy, top] of [[-14, 44, 26.4], [14, 44, 26.4], [0, 2, 24.4]] as [number, number, number][]) {
    bbox(stone, null, cx - 3.2, cy - 2.6, cx + 3.2, cy + 2.6, TOP - 0.2, top - 1.6, 0.15)
    panels(win, 'n', cy + 2.6, [cx - 1.4, cx, cx + 1.4], 0.7, top - 3.2, top - 2.2, 0.04)
    hip(cu, cx - 3.6, cy - 3.0, cx + 3.6, cy + 3.0, top - 1.6, top)
  }

  // the Woodward front
  {
    const f = side('n', FR)
    const S = (x: number) => sOf('n', x)
    // the plinth below the terrace, and the rusticated ground storey a touch proud
    flatShape(stone, f, R(S(GX) + 0.2, T0, S(-GX) - 0.2, z(700)), 0.1)
    // ground-floor windows, small grilles, the door in its surround
    panels(win, 'n', FR, [-23.5, -13.9, -9.0, -4.4, 4.4, 9.0, 13.9, 23.5], 1.3, z(780), z(720), 0.14)
    panels(win, 'n', FR, [-26.7, -20.8, -16.6, 16.6, 20.8, 26.7], 0.6, z(775), z(735), 0.14)
    panels(trim, 'n', FR, [0], 3.8, T0, z(705), 0.13)
    panels(gran, 'n', FR, [0], 2.4, T0, z(722), 0.16)
    // the frieze of names
    extrudeShape(trim, f, R(S(GX) + 0.1, z(705), S(-GX) - 0.1, z(682)), 0, 0.25)
    // the arcade: seven round-headed windows with balconettes, pilasters between
    const xs = [-3, -2, -1, 0, 1, 2, 3].map(k => k * 4.45)
    for (const x of xs) {
      flatShape(trim, f, archBand(S(x), z(530), 1.3, 1.75, z(650), 10), 0.12)
      flatShape(win, f, archShape(S(x), 2.6, z(650), z(530), 10), 0.12)
      flatShape(trim, f, R(S(x) - 1.4, z(660), S(x) + 1.4, z(630)), 0.16)
    }
    for (const x of [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map(k => k * 4.45)) extrudeShape(trim, f, R(S(x) - 0.42, z(680), S(x) + 0.42, z(490)), 0, 0.22)
    // the end bays: pilasters, a window under a blind arch
    for (const sg of [-1, 1]) {
      const x = sg * 23.3
      for (const px of [x - 3.0, x + 3.0]) extrudeShape(trim, f, R(S(px) - 0.42, z(680), S(px) + 0.42, z(490)), 0, 0.22)
      flatShape(trim, f, archBand(S(x), z(540), 1.0, 1.4, z(540), 8), 0.12)
      flatShape(stone, f, archShape(S(x), 2.0, z(540), z(540), 8), 0.12)
      panels(win, 'n', FR, [x], 1.9, z(615), z(545), 0.14)
    }
    // the attic band's small square windows
    panels(win, 'n', FR, [...xs, -23.3, 23.3], 0.8, z(460), z(430), 0.06)
  }
  // the sides: arcaded windows on the front block, tall pairs behind
  for (const [dir, c] of [['e', GX], ['w', -GX]] as ['e' | 'w', number][]) {
    arches(win, dir, c, [45, 50, 55], 2.4, z(650), z(530), 0.06, 8)
    panels(win, dir, c, [45, 50, 55], 1.2, z(780), z(720), 0.06)
  }
  for (const [dir, c] of [['e', GX2], ['w', -GX2]] as ['e' | 'w', number][]) {
    const at = spread(GB + 2, 38, 8)
    panels(win, dir, c, at, 2.0, 10.6, 17.2, 0.06)
    panels(win, dir, c, at, 0.8, 18.3, 19.3, 0.06)
  }
  // the Cass face of the Gilbert block, above the 1963 hall
  {
    const at = spread(-26, 26, 11)
    panels(win, 's', GB, at, 2.0, 11.6, 17.2, 0.06)
    panels(trim, 's', GB, at, 2.2, 14.1, 14.6, 0.09)
    panels(win, 's', GB, at, 0.8, 18.3, 19.3, 0.06)
  }

  // ---------------------------------------------------------------- the 1963 hall and the granite entrance
  bbox(stone, stone, -44.2, -17.5, 44.2, GB + 0.2, 0, 10.2, 0.25)
  {
    // tall narrow windows between marble piers, both sides of the entrance
    const at = [...spread(-43, -13, 10), ...spread(13, 43, 10)]
    panels(win, 's', -17.5, at, 1.6, 0.6, 8.4, 0.05)
    // the granite entrance block with its four red columns
    bbox(gran, gran, -11.9, -22.8, 11.0, -17.3, 0, 10.6, 0.2)
    panels(win, 's', -22.8, [-6.3, -2.9, 0.5, 3.9], 2.2, 0, 6.6, 0.05)
    flatShape(trim, side('s', -22.8), R(-11.0, 8.2, 10.1, 9.3), 0.05)
    for (const x of [-8.0, -4.6, -1.2, 2.2, 5.6]) lathe(red, x, -23.6, [[0.45, 0], [0.45, 7.4]], 10)
    bbox(gran, null, -11.9, -24.5, 11.0, -22.8, 7.4, 8.2, 0.1)
  }

  // ---------------------------------------------------------------- the 1963 wings
  for (const [x0, x1, y0, y1] of [[-71.9, -44.2, -58.8, 14.8], [43.4, 71.1, -59.7, 15.2]]) {
    bbox(stone, stone, x0, y0, x1, y1, 0, 10.4, 0.25)
    bbox(stone, stone, x0 + 5, y0 + 5, x1 - 5, y1 - 5, 10.3, 15.3, 0.3)
    // tall narrow windows along the outer and Cass faces, low down
    const xo = x0 < 0 ? x0 : x1, d = x0 < 0 ? 'w' : 'e'
    panels(win, d as 'w' | 'e', xo, spread(y0 + 3, y1 - 3, 14), 1.4, 0.6, 7.6, 0.05)
    panels(win, 's', y0, spread(x0 + 3, x1 - 3, 5), 1.4, 0.6, 7.6, 0.05)
    // the inner faces towards the Cass lawn
    panels(win, d === 'w' ? 'e' : 'w', d === 'w' ? x1 : x0, spread(y0 + 3, -19, 7), 1.4, 0.6, 7.6, 0.05)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[1] > 55 && n[1] > 0.5 ? 1 : 0.3)
  return [
    { part: stone, material: { ...finish('dpl-marble', 0xece6da), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: cu, material: PALETTE.patina },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: gran, material: finish('dpl-granite', 0x7f766e) },
    { part: red, material: finish('dpl-red', 0xb4473a) },
  ]
}

if (import.meta.main) await saveModel('det-detroit-public-library', 'Detroit Public Library', [42.3584794, -83.066968], 63.5, build(), 6500)
