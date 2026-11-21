/**
 * Thomas Cooper Library, University of South Carolina, Columbia —
 * procedural, CC0-1.0, no textures.
 * bun generators/cola-thomas-cooper-library.ts
 *
 * Edward Durell Stone's library of 1959, the university's main library: a
 * long white box on a terrace, its two glazed storeys set back behind a
 * colonnade of slender white piers that carry a deep, plain white attic
 * band and a flat roof. Its front looks north down a long reflecting pool
 * (the pool, the plaza and the sunken courts of the 1976 underground
 * addition are ground and are not modelled). Identity: the slender white
 * colonnade, the solid white band over it, and the dark glass behind,
 * glowing amber at night.
 *
 * Map frame: x east, y north, z up, metres. Anchor: the area centroid of
 * OSM way/294236416 (lng -81.0280699, lat 33.9950562). Its walls run
 * 159.2° / 69.2°, so it is placed at bearing 339.2 and built square: model
 * +y is the front, facing the pool (true bearing 339.2).
 *
 * Replaces: way/294236416 (OSM has no parts). The Hollings Special
 * Collections Library (way/1347892035, 2010) behind it is a separate
 * building and is not drawn; the short link between them, inside the
 * Cooper outline, is.
 *
 * Ground: the library stands on a flat terrace (the plaza, lidar ground
 * 8.7 all round the building), while the map's terrain slopes about 3 m
 * under the footprint, from 6.2 at the front to 3.3 at the back (Mapterhorn
 * z15, terrain.ts grid). y = 0 is that lowest point; the terrace level, FG,
 * is the highest map ground along the front edge, 4.1 m up (terrain.ts
 * check: the front corners sit 1.2 m above the centre of the front). Below
 * FG the model is a plain stone plinth (the terrace edge), which the terrain covers at the front
 * and shows at the back where the ground really does fall to the sunken
 * courts. Elevation 0.
 *
 * Evidence
 * - OSM way/294236416 (measured), in the model frame: the box x -25.9..25.9,
 *   y -42.4..44.8, and the link x -3.7..4.1, y -56.0..-42.4.
 * - USGS 3DEP lidar, SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid,
 *   heights above the plaza at 8.7 (measured): roof 9.1 (17.8), its edge
 *   8.3–9.1; a mechanical penthouse 3.6 over the roof at x -9..9,
 *   y -31..-11 and x 2..10, y -11..4; the link 3.7.
 * - USGS NAIP orthophoto (public domain): the plan, the white flat roof and
 *   its central penthouse, the pool to the north-north-west.
 * - Photos:
 *   "University of South Carolina Thomas Cooper Library.jpg" (Dfscgt21,
 *   CC BY-SA 3.0)
 *   https://commons.wikimedia.org/wiki/File:University_of_South_Carolina_Thomas_Cooper_Library.jpg
 *   — the front by day across the pool: slender square white piers about
 *   5 m apart, a thin projecting band over them, the solid white attic band
 *   above (0.44 of the pier height), dark bronze glass behind, steps up
 *   from the pool.
 *   "Thomas Cooper Library Columbia Sc (70411427).jpeg" (Brandon Cox,
 *   CC BY 3.0)
 *   https://commons.wikimedia.org/wiki/File:Thomas_Cooper_Library_Columbia_Sc_(70411427).jpeg
 *   and "Thomas Cooper Library" (brcox22, Flickr 13994600707, CC BY 2.0)
 *   https://www.flickr.com/photos/brcox22/13994600707
 *   — the front at night: two lit storeys of glass behind the colonnade,
 *   the attic band dark.
 * - Estimated: pier height 6.3 and attic band 2.8 (the day photo's
 *   proportions scaled to the lidar roof); pier spacing ~5.2 m (photo: pier height about 1.2 bays,
 *   fitted to the OSM width: ten bays across the front, seventeen down the
 *   sides); the glass set back 2.0 m behind the piers; the door bay.
 * - Doubts: only the front is photographed. The colonnade is assumed to
 *   run round all four sides, as the roof slab's even overhang in the
 *   orthophoto suggests; the sides and back are otherwise unconfirmed.
 *
 * Night: the glass glows (`window`, lit in the night photos); the doors
 * are `entrance`; the attic band stays dark, the piers are softly lit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, grow, panel, rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const FG = 4.1 // the terrace level above the lowest map ground under the footprint
const PIER = 6.3 // pier height above the terrace
const TOP = 9.1 // roof edge above the terrace (lidar)
const BOX = rect(-25.9, 25.9, -42.4, 44.8)
const SET = 2.0 // glass set back behind the slab edge

function build() {
  const pier = new Part(), band = new Part(), roof = new Part(), win = new Part(), door = new Part(), plinth = new Part()

  // ---- The plinth: the terrace edge, from the lowest ground up to FG.
  cbox(plinth, grow(BOX, 0.4), 0, FG, { top: false })
  plinth.cap([[BOX.x0 - 0.4, BOX.y0 - 0.4, FG], [BOX.x1 + 0.4, BOX.y0 - 0.4, FG], [BOX.x1 + 0.4, BOX.y1 + 0.4, FG], [BOX.x0 - 0.4, BOX.y1 + 0.4, FG]], true)

  // ---- The glass box behind the colonnade: two storeys, a pale floor line.
  const gl = grow(BOX, -SET)
  cbox(win, gl, FG, FG + PIER, { top: false })
  cbox(band, grow(gl, 0.05), FG + 3.2, FG + 3.5, { top: false })
  // the doors, in the middle bay of the front
  panel(door, 'n', gl.y1, -2.6, 2.6, FG, FG + 2.7, 0.07)
  panel(band, 'n', gl.y1, -2.9, 2.9, FG + 2.7, FG + 2.95, 0.07)

  // ---- The colonnade: slender square piers at the slab's edge.
  const inset = 0.75, w = 0.36
  const xs = spread(BOX.x0 + inset, BOX.x1 - inset, 10)
  const ys = spread(BOX.y0 + inset, BOX.y1 - inset, 17)
  const at = new Set<string>()
  const put = (x: number, y: number) => {
    const key = `${x.toFixed(2)},${y.toFixed(2)}`
    if (at.has(key)) return
    at.add(key)
    cbox(pier, rect(x - w, x + w, y - w, y + w), FG, FG + PIER, { b: 0.08, top: false })
  }
  for (const x of xs) { put(x, ys[0]); put(x, ys[ys.length - 1]) }
  for (const y of ys) { put(xs[0], y); put(xs[xs.length - 1], y) }

  // ---- The thin projecting band over the piers, the solid attic band, the roof.
  cbox(band, grow(BOX, 0.15), FG + PIER, FG + PIER + 0.45, { b: 0.08, bottom: true, top: false })
  cbox(band, grow(BOX, -0.1), FG + PIER + 0.45, FG + TOP - 0.3, { top: false })
  cbox(band, grow(BOX, 0.05), FG + TOP - 0.3, FG + TOP, { b: 0.12, top: roof })
  // the mechanical penthouse, set well back
  for (const r of [rect(-9, 9, -31, -11), rect(2, 10, -11, 4)]) cbox(roof, r, FG + TOP - 0.2, FG + TOP + 3.6, { b: 0.15 })

  // ---- The link to the Hollings Library behind, one storey.
  const link = rect(-3.7, 4.1, -56.0, -42.4)
  cbox(plinth, link, 0, FG, { top: false })
  cbox(band, link, FG, FG + 3.7, { b: 0.1, top: roof })
  for (const s of ['e', 'w'] as const) panel(win, s, s === 'e' ? link.x1 : link.x0, -54.8, -43.6, FG + 0.5, FG + 3.0, 0.04)

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0 : 0.45)
  return [
    { part: pier, material: { ...PIER_WHITE, floodlight: lit } },
    { part: band, material: MARBLE },
    { part: roof, material: ROOF },
    { part: win, material: GLASS_WALL },
    { part: door, material: PALETTE.entrance },
    { part: plinth, material: PLINTH },
  ]
}

/** n + 1 evenly spaced values from a to b. */
const spread = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

/** The piers: white marble, from the day photo. */
const PIER_WHITE = finish('tcl-pier', 0xf3eee4)
/** The attic band and fascia: the same white, a touch greyer in shade. */
const MARBLE = finish('tcl-marble', 0xe8e3d8)
/** The pale membrane roof (NAIP). */
const ROOF = finish('tcl-roof', 0xc9cccc)
/** Dark bronze glass, pulled to the palette's window lightness; lit at night. */
const GLASS_WALL = PALETTE.window
/** The terrace edge: a warm grey stone. */
const PLINTH = finish('tcl-plinth', 0xc4bcae)

if (import.meta.main) {
  await saveModel('cola-thomas-cooper-library', 'Thomas Cooper Library', build(), { source: 'generators/cola-thomas-cooper-library.ts' })
}

