/**
 * United States Mint at Denver (1904–1906, James Knox Taylor; Italian
 * Renaissance after the Palazzo Medici-Riccardi; enlarged 1936–1937 and
 * later) — original procedural geometry, CC0-1.0.
 * bun generators/den-denver-mint.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint (Delaware Street on the west), at the centroid of
 * OSM's outline. Bearing 0: OSM's walls run north–south and east–west.
 *
 * Identity (from the photos below):
 *  1. A Florentine palazzo in grey granite on West Colfax: banded
 *     rusticated walls, tall round-arched ground-floor windows, twin-light
 *     round-arched windows above a belt course, and a very deep bracketed
 *     cornice.                              (hathorn, moore, detroit, night)
 *  2. Red tile hip roofs round light courts, over the 1906 block and the
 *     matching wing south along Cherokee Street.                    (naip)
 *  3. Lower flat-roofed production buildings behind, to the west and
 *     south.                                                     (naip)
 *
 * Plan: OSM way/305541720 (and its parts way/587844017, 019, 020, 021),
 * split into blocks where USGS NAIP shows the roofs change: the 1906 block
 * x -24.8..30.15, y 32.9..65.0 with a light court; the Cherokee wing
 * x 4..32, y -42.5..32.9 with a long narrow court; flat-roofed blocks west
 * (x -40.4..-15.5), middle (x -15.5..4), south (y -59.7..-42.5) and two
 * small blocks on the east. The Cherokee wing's red roof reaches x ≈ 32 in
 * NAIP north of y = 7, where OSM's outline steps in to x = 28.6; NAIP was
 * followed (a 3 m strip outside OSM's outline). The shed way/587844018 to
 * the north-west is a separate building and is not drawn.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid;
 * ground_min 1592.5 m; y = 0 here is 1.0 m above it (Delaware Street);
 * Colfax and Cherokee are about 2 m higher. Measured: the palazzo's cornice
 * 20 (lidar 21), its hip ridges 24 (lidar 24–26); the middle block 16.5
 * (lidar 17–19), the west and south blocks 11 (lidar 12), the east blocks 11
 * and 7.5. OSM's tags (6–12 m) were not used.
 * Estimated from "hathorn" (about 32 px a metre): bays 5.4 m (5.9 on
 * Colfax, nine bays with the bronze door in the middle arch); ground-floor
 * arches 2.6 m wide, 4.8 to 11.4; belt course at 12.9; upper twin arches
 * 13.1 to 17; the cornice 18 to 20.
 *
 * Photos (evidence, Wikimedia Commons):
 *  hathorn "U.S. Mint in Denver, CO IMG 5527.JPG", Billy Hathorn, CC BY-SA
 *          3.0 (the Colfax front, square on)
 *  moore   "Denver mint.jpg", Larry D. Moore, CC BY 4.0 (Colfax front,
 *          oblique)
 *  detroit "Us-mint-denver-colorado.jpg", Detroit Publishing Co., public
 *          domain (as built, from the north-east)
 *  night   "Denver Mint at Night.jpg", Patcris2264, CC BY-SA 3.0
 *  naip    USGS NAIP orthoimagery, public domain (plan and roof colours)
 * No look-only sources. No commercial imagery.
 * Doubts: the west and south production buildings are unphotographed (from
 * NAIP and lidar only) and drawn plain; the rustication is drawn as a few
 * shallow bands, not every course.
 *
 * Night ("night"): the palazzo is floodlit softly and its windows lit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { at, capPoly } from './atl-flatiron-building'

const stone = new Part(), tile = new Part(), flat = new Part(), pale = new Part(), win = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

// ── The palazzo: the 1906 block and the Cherokee wing ──
const CORN = 20, RIDGE = 24
/** A hip roof round a light court: outer eave, ridge halfway, court eave, flat court. */
function courtRoof(o: [number, number, number, number], c: [number, number, number, number]) {
  const O = rect(...o), I = rect(...c)
  const M = O.map((p, i) => [(p[0] + I[i][0]) / 2, (p[1] + I[i][1]) / 2] as XY)
  tile.loft([at(O, CORN), at(M, RIDGE)])
  tile.loft([at(M, RIDGE), at(I, CORN + 1)])
  capPoly(flat, I, CORN + 1, true)
}
const NB: [number, number, number, number] = [-24.8, 30.15, 32.9, 65.0]
const EW: [number, number, number, number] = [4, 32, -42.5, 32.9]
for (const [b, c] of [[NB, [-13, 22.5, 41, 55]], [EW, [14, 23, -34, 24]]] as [typeof NB, typeof NB][]) {
  const r = rect(...b)
  prism(stone, r, 0, CORN - 2, null, 0)
  band(stone, r, 3.2, 0.35, 0.12, null)
  band(stone, r, 12.6, 0.5, 0.2, null)
  // the deep cornice, drawn bold: a frieze, then a 1.3 m overhang
  cornice(stone, r, CORN - 2, 2, 1.3, null)
  courtRoof(b, c)
}

/** Palazzo windows along a wall from a to b (outside to the right). */
function palazzo(a: XY, b: XY, bay = 5.4, door = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round((L - 2) / bay)), w = (L - 2) / n
  for (let i = 0; i < n; i++) {
    const s = 1 + (i + 0.5) * w
    onWall(win, a, b, archShape(s, 2.6, door && i === (n - 1) / 2 ? 2.2 : 4.8, 10.1, 8))
    onWall(stone, a, b, archShape(s, 3.5, 10.1, 10.1, 8).slice(2).concat([[s - 1.75, 10.1]]), 0.03)
    for (const d of [-0.62, 0.62]) onWall(win, a, b, archShape(s + d, 1.0, 13.3, 16.2, 6))
  }
}
palazzo([30.15, 65.0], [-24.8, 65.0], 5.9, true) // Colfax: nine bays, the door in the middle
palazzo([-24.8, 65.0], [-24.8, 34.9]) // west end of the 1906 block
palazzo([30.15, 32.9], [30.15, 65.0], 5.4) // Cherokee, 1906 block
palazzo([32, -42.5], [32, 32.9], 5.4) // Cherokee, the wing
palazzo([4, -42.5], [32, -42.5])

// ── The flat-roofed buildings behind ──
const flatBlock = (r: XY[], h: number, top = flat) => {
  prism(stone, r, 0, h, top, 0.15)
  band(stone, r, h - 0.8, 0.5, 0.15, null)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 5)
    for (let j = 0; j < n; j++) {
      const s = ((j + 0.5) * L) / n
      for (let z = 2.5; z + 3 < h - 1; z += 4.2) onWall(win, a, b, rectShape(s - 1.1, s + 1.1, z, z + 2.4))
    }
  }
}
flatBlock(rect(-15.5, 4, -52.5, 32.9), 16.5)
// NAIP: the west and south roofs are pale, the middle one dark grey
flatBlock(rect(-40.4, -15.5, -41.2, 34.9), 11, pale)
flatBlock(rect(-30.9, 35.8, -59.7, -42.5), 11, pale)
flatBlock(rect(32, 45.5, -22.5, -4.6), 7.5)
flatBlock(rect(32, 44.8, 0.9, 21.2), 11)
// rooftop plant on the middle block, as NAIP shows it
for (const y of [-40, -20, 0, 20]) box(stone, -9, -3, y - 1.5, y + 1.5, 16.5, 18, flat, 0.1)
// the skylight in the 1906 block's court
box(stone, -6, 15, 45.5, 50.5, CORN + 1, CORN + 2, flat, 0.2)

await save('den-denver-mint', 'United States Mint at Denver', [
  { part: stone, material: { ...finish('mint-granite', 0xcdc8be), floodlight: (p, n) => (n[2] > 0.8 ? 0.05 : p[1] > 30 || p[0] > 31 ? 0.55 : 0.1) } },
  { part: tile, material: finish('mint-tile', 0xbf7a5f) },
  { part: flat, material: finish('mint-flat-roof', 0x9a9c9c) },
  { part: pale, material: finish('mint-pale-roof', 0xc9bfad) },
  { part: win, material: PALETTE.window },
], { height: RIDGE, anchor: [39.739293, -104.9923378], bearing: 0 }, 5000)
