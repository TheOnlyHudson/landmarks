/**
 * Old Main, Wayne State University (4841 Cass Avenue; built 1895-96 as
 * Detroit's Central High School, Malcomson & Higginbotham, Richardsonian
 * Romanesque): procedural, CC0-1.0.
 * bun generators/det-old-main.ts
 *
 * Map frame: x, y, z up, metres, turned to the building's walls: +y runs
 * along bearing 64 (east-north-east, towards Cass Avenue), +x along 154
 * (south-south-east); Warren Avenue is on the -x side. The anchor is the
 * centroid of the OSM outline (relation/8874010, outer way/69025245):
 * 42.3550917, -83.0672738.
 *
 * Identity, in order: the tall square clock tower on the Cass front, buff
 * brick over grey stone, with arcaded belfry openings, clocks in gables on
 * every face and a steep pyramid roof; the long buff-brick Cass front on a
 * rough grey stone base, with round-arched second-floor windows and steep
 * grey metal hipped roofs; the big gable-fronted end pavilions; the spirelet
 * and flèche on the roofs; the rear ranges round two courts; the tall
 * chimney.
 *
 * Evidence:
 *  - plan: OSM relation/8874010 (building=university, levels 4, Q7084436);
 *    the inner ring way/639558826 is the west court.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; heights over the lowest ground (the Warren side, 1.1 m over
 *    the box minimum; Cass is 1.1 m higher). Measured: the tower's top 56.2 (highest return; the needle tip returns few points, so the pyramid is drawn to 59.5 to match the photo's steep roof);
 *    the Cass range's ridge 30-30.5, its face at y = 41; the end pavilions'
 *    ridges 32.8 (north) and 34-35 (south); a spirelet to 39; the spine's
 *    ridge 30; the south range's ridge 24.8; the flat north block 15.6; the
 *    chimney 30.2. Many metal-roof cells are empty, so eave heights are from
 *    the photos.
 *  - photos (all EVIDENCE):
 *    - Old Main WSU - Detroit Michigan.jpg, Del arte at English Wikipedia,
 *      CC BY-SA 3.0 (the Cass front and tower from above): tower stages,
 *      eaves (21.5) and the clock stage (44.7), scaled 0.064 m/px to the
 *      tower's lidar height.
 *      https://commons.wikimedia.org/wiki/File:Old_Main_WSU_-_Detroit_Michigan.jpg
 *    - Detroit December 2021 01 and 02 (Wayne State University Old Main).jpg,
 *      Michael Barera, CC BY-SA 4.0 (the Cass/Warren corner and the Cass
 *      front, street level).
 *      https://commons.wikimedia.org/wiki/File:Detroit_December_2021_01_(Wayne_State_University_Old_Main).jpg
 *      https://commons.wikimedia.org/wiki/File:Detroit_December_2021_02_(Wayne_State_University_Old_Main).jpg
 *    - Central High School historic - Detroit Michigan.jpg, Detroit
 *      Publishing Company, public domain (c. 1900, the tower and Cass front).
 *  - published: 1895-96, Central High School, then Wayne University; NRHP
 *    80001922 (Wikipedia, "Old Main (Wayne State University)").
 *  Estimated: window sizes and rows, the gables' heights, the tower's
 *  belfry, the flèche (to 38).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the rear ranges and the courts are seen only in the aerial and
 * lidar; their windows repeat the front's rhythm. The many small dormers and
 * corner turrets are reduced to the gables and the spirelet. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { flatShape, archShape, lathe } from './sea-tacoma-union-station'
import { bbox, box, hip, gable, pyramid, face, panels, arches, side, sOf, R, spread, saveModel, type Mat } from './det-detroit-institute-of-arts'

const EAVE = 21.5, BASE = 7.0
type Dir = 's' | 'n' | 'e' | 'w'

function build(): Mat[] {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), trim = new Part()

  /** A brick block on a grey stone base, with a stone band at the eaves. */
  const block = (x0: number, y0: number, x1: number, y1: number, top: number, base = BASE) => {
    box(stone, null, x0, y0, x1, y1, 0, base)
    box(brick, null, x0, y0, x1, y1, base, top)
    bbox(trim, null, x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25, top - 0.6, top, 0.15)
  }
  /** The window rows of a face between map coordinates a and b, bays about 3.6 m. */
  const bays = (dir: Dir, c: number, a: number, b: number, top = EAVE, g = 0) => {
    const at = spread(a, b, Math.max(1, Math.round((b - a) / 3.6)))
    panels(win, dir, c, at, 1.3, g + 2.0, g + 4.8, 0.06)
    arches(win, dir, c, at, 1.3, BASE + 1.6, BASE + 4.2, 0.06, 6)
    if (top > 17) panels(win, dir, c, at, 1.3, BASE + 6.0, BASE + 9.6, 0.06)
    if (top > 20) panels(win, dir, c, at, 1.1, BASE + 10.6, BASE + 12.6, 0.06)
  }

  // ---------------------------------------------------------------- the Cass range and its end pavilions
  block(-21, 27, 34, 41, EAVE)
  hip(roof, -21.4, 26.6, 34.4, 41.4, EAVE, 30.5)
  bays('n', 41, -20, 1); bays('n', 41, 12.8, 33.5)
  // a gable dormer and the flèche on the north half
  gable(roof, brick, -14, 38, -6, 41.4, EAVE, 30.0, 'y', 0.2)
  box(brick, null, -14, 41.0, -6, 41.4, EAVE, EAVE + 0.01)
  { const f = side('n', 41.4); flatShape(win, f, archShape(sOf('n', -10), 1.6, EAVE + 1.2, EAVE + 3.4, 6), 0.05) }
  lathe(roof, -10, 34, [[1.3, 29.6], [1.3, 31.6], [0.9, 32.2], [0.01, 38.5]], 8)
  // the north pavilion, gable-fronted to Cass, and the south pavilion
  for (const [x0, x1, y0, y1, rg] of [[-39, -21, 16, 47.2, 33.0], [34, 52.7, 10, 43.7, 34.5]]) {
    block(x0, y0, x1, y1, EAVE + 0.5)
    gable(roof, brick, x0, y0, x1, y1, EAVE + 0.5, rg, 'y', 0.4)
    bays('n', y1, x0 + 1, x1 - 1)
    bays(x0 < 0 ? 'w' : 'e', x0 < 0 ? x0 : x1, y0 + 1, y1 - 1)
    // the gable's window group and a stone coping band along it
    const xm = (x0 + x1) / 2, f = side('n', y1)
    flatShape(win, f, archShape(sOf('n', xm), 2.2, EAVE + 2.0, EAVE + 5.2, 6), 0.06)
    panels(win, 'n', y1, [xm - 2.6, xm + 2.6], 1.0, EAVE + 2.0, EAVE + 4.6, 0.06)
  }
  // the spirelet on the south pavilion
  box(brick, null, 42.3, 22.8, 45.3, 25.8, 30.0, 33.0)
  pyramid(roof, 42.1, 22.6, 45.5, 26.0, 33.0, 39.0)

  // ---------------------------------------------------------------- the clock tower
  {
    const X0 = 1.6, X1 = 12.6, Y0 = 36.8, Y1 = 47.6, CL = 44.7, TOPZ = 59.5
    const xm = (X0 + X1) / 2, ym = (Y0 + Y1) / 2
    box(stone, null, X0, Y0, X1, Y1, 0, BASE + 1.1)
    box(brick, null, X0, Y0, X1, Y1, BASE + 1.1, CL)
    for (const zb of [BASE + 1.1, 20.8, 30.5, 39.2]) bbox(trim, null, X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3, zb - 0.5, zb, 0.12)
    bbox(trim, trim, X0 - 0.5, Y0 - 0.5, X1 + 0.5, Y1 + 0.5, CL - 0.7, CL, 0.2)
    // the steep pyramid, a gable with a clock on each face
    pyramid(roof, X0 - 0.4, Y0 - 0.4, X1 + 0.4, Y1 + 0.4, CL, TOPZ)
    const faces: [Dir, number, number][] = [['n', Y1, xm], ['s', Y0, xm], ['e', X1, ym], ['w', X0, ym]]
    for (const [dir, c, m] of faces) {
      const out: V3 = dir === 'n' ? [0, 1, 0] : dir === 's' ? [0, -1, 0] : dir === 'e' ? [1, 0, 0] : [-1, 0, 0]
      const P = (s: number, zz: number): V3 => (dir === 'n' || dir === 's') ? [m + s, c + out[1] * 0.2, zz] : [c + out[0] * 0.2, m + s, zz]
      face(brick, [P(-3.2, CL), P(3.2, CL), P(0, CL + 5.4)], out)
      // the gable's own little roof, over its top edges
      const Q = (s: number, zz: number, d: number): V3 => (dir === 'n' || dir === 's') ? [m + s, c + out[1] * (0.4 - d), zz] : [c + out[0] * (0.4 - d), m + s, zz]
      for (const sg of [-1, 1]) face(roof, [Q(sg * 3.5, CL - 0.2, 0), Q(0, CL + 5.7, 0), Q(0, CL + 5.7, 3.4), Q(sg * 3.5, CL - 0.2, 3.4)], [out[0] + (dir === 'e' || dir === 'w' ? 0 : 0), out[1], 1])
      const f = side(dir, c)
      const disc: [number, number][] = Array.from({ length: 12 }, (_, i) => [sOf(dir, m) + 1.1 * Math.cos((i / 12) * 2 * Math.PI), CL + 1.5 + 1.1 * Math.sin((i / 12) * 2 * Math.PI)])
      flatShape(trim, f, disc, 0.3)
      // belfry arcade (three round-headed openings), a lower pair, a balcony slab
      arches(win, dir, c, [m - 2.4, m, m + 2.4].map(v => v), 1.4, 33.0, 36.8, 0.06, 6)
      arches(win, dir, c, [m - 1.8, m + 1.8], 1.4, 23.5, 27.0, 0.06, 6)
      panels(win, dir, c, [m], 1.4, 13.0, 18.5, 0.06)
    }
    lathe(trim, xm, ym, [[0.25, TOPZ - 0.4], [0.12, TOPZ + 2.5]], 6)
    // corner turrets at the clock stage
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]) {
      lathe(brick, x, y, [[0.7, CL - 2], [0.7, CL + 1.2]], 8)
      lathe(roof, x, y, [[0.85, CL + 1.2], [0.01, CL + 4.2]], 8)
    }
    // the arched entrance at the tower's foot
    { const f = side('n', Y1); flatShape(stone, f, archShape(sOf('n', xm), 4.0, 1.1, 4.4, 8), 0.06); flatShape(win, f, archShape(sOf('n', xm), 2.8, 1.1, 4.4, 8), 0.1) }
  }

  // ---------------------------------------------------------------- the spine, the rear ranges, the north block
  block(-4, -42, 16, 27, EAVE)
  hip(roof, -4.4, -42.4, 16.4, 27.4, EAVE, 30.0)
  bays('e', 16, -19, 9); bays('w', -4, 27, -15)
  block(-45.5, -44, 52, -20, 18.5)
  gable(roof, brick, -45.5, -44, 52, -20, 18.5, 24.8, 'x', 0.4)
  bays('s', -44, -44, 49, 18.5, -0.1); bays('n', -20, 17, 50, 18.5); bays('n', -20, -44, -5, 18.5)
  block(-45, -20, -21, 16, 15.6)
  box(stone, stone, -45, -20, -21, 16, 15.0, 15.6)
  bays('w', -45, -19, 15, 15.6); bays('e', -21, -13, 15, 15.6)
  // the chimney
  bbox(brick, brick, 33.2, -55.4, 38.8, -49.2, 0, 30.2, 0.2)
  bbox(trim, null, 32.9, -55.7, 39.1, -48.9, 28.6, 29.4, 0.1)

  return [
    { part: brick, material: finish('old-main-brick', 0xd8bb8a) },
    { part: stone, material: finish('old-main-stone', 0xb9b3a8) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('old-main-trim', 0xeadcc4) },
  ]
}

if (import.meta.main) await saveModel('det-old-main', 'Old Main, Wayne State University', [42.3550917, -83.0672738], 64, build(), 6500)
