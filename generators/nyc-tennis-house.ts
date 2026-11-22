/**
 * Tennis House, Prospect Park, Brooklyn (Helmle & Huberty, 1910) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-tennis-house.ts
 *
 * Frame: x along the house (toward 111.4°), y across it (toward 21.4°), z
 * up, metres. Placed at bearing 21.4°. Anchor: the area centroid of OSM
 * way/241846604 (-73.973349, 40.663586), which the model replaces.
 *
 * Evidence
 * - OSM way/241846604 (ODbL): a 29.7 × 16.4 m rectangle, height=11.9.
 * - Published (NYC Parks; Prospect Park Alliance): 1910 Classical Revival
 *   pavilion of buff brick and limestone with an open arched loggia toward
 *   the Long Meadow and a terracotta tile roof; now Alliance offices.
 * - USGS NAIP aerial (public domain): low hipped roof in terracotta tile,
 *   two small light blocks on the roof near its ends (cupola and chimney).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 103.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_103.jpg
 *     (an end face square on, three bays of rectangular windows under
 *     arched lunettes, roundels, pilasters, heavy cornice, louvred cupola;
 *     the loggia's columns and arches receding on the left);
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 101.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_101.jpg
 *     (a long side through trees: the row of arches with roundels between,
 *     the chimney).
 *
 * Estimated from the end photo scaled to OSM's 16.4 m width (33 px/m):
 * plinth 0.6 m, walls to 6.2 m, entablature to 6.9 m, a heavy cornice to
 * 7.9 m projecting 0.85 m, a low hipped roof (1.6 m rise) to 9.5 m, cupola to 11.9 m (OSM height).
 * Seven arches a long side.
 *
 * Doubts: which long side carries the open loggia is taken from the
 * published "facing the Long Meadow" (+y, north-north-east); the other long
 * side is drawn with arched windows. Only two licensed photos, both partly
 * behind trees; the loggia's column pairs and Guastavino vaults are
 * simplified to piers with arches over a dark interior.
 */
import { Part } from './mesh'
import { finishModel, prism, chamferRect, type XY } from './nyc-570-lexington'
import { box } from './nyc-prospect-park-boathouse'
import { archWin, rectWin, edgeFrame, hipRoof, cornice, wallBox } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

function build() {
  const brick = new Part(), stone = new Part(), tile = new Part(), win = new Part(), shade = new Part()
  const X = 14.84, Y = 8.18
  const PL = 0.6, WALL = 6.2, ENT = 6.9, CORN = 7.9, RIDGE = 9.5
  const R = chamferRect(-X, -Y, X, Y, 0)

  prism({ wall: stone, win: null, roof: null, ring: chamferRect(-X - 0.1, -Y - 0.1, X + 0.1, Y + 0.1, 0), z0: 0, z1: PL, facade: null, bevel: 0.1 })
  prism({ wall: brick, win: null, roof: null, ring: R, z0: PL, z1: WALL, facade: null, bevel: 0.2 })
  prism({ wall: stone, win: null, roof: null, ring: chamferRect(-X - 0.05, -Y - 0.05, X + 0.05, Y + 0.05, 0), z0: WALL, z1: ENT, facade: null, bevel: 0.15 })
  cornice(stone, chamferRect(-X - 0.05, -Y - 0.05, X + 0.05, Y + 0.05, 0), ENT, CORN, 0.85, null)
  hipRoof(tile, null, stone, -X, -Y, X, Y, CORN, RIDGE - CORN, 0.3, ['hip', 'hip'], 'x')

  // Long sides: seven bays. The loggia (+y) is an open arcade; the back has arched windows.
  const bayS = (L: number, k: number) => (L / 7) * (k + 0.5)
  for (const sg of [-1, 1]) {
    const f = sg > 0 ? edgeFrame([X, Y], [-X, Y]) : edgeFrame([-X, -Y], [X, -Y])
    for (let k = 0; k < 7; k++) {
      const s = bayS(f.L, k)
      if (sg > 0) {
        archWin(stone, f, s, PL, 5.25, 1.75, 0.06)
        archWin(shade, f, s, PL, 4.95, 1.45, 0.1)
      } else {
        archWin(stone, f, s, 1.4, 5.4, 1.2, 0.06)
        archWin(win, f, s, 1.6, 5.15, 0.95, 0.1)
      }
    }
    for (let k = 0; k <= 7; k++) {
      const s = (f.L / 7) * k
      const s0 = Math.max(0, s - 0.45), s1 = Math.min(f.L, s + 0.45)
      wallBox(stone, f, s0, s1, PL, WALL, 0.18, false)
      if (k > 0 && k < 7) archWin(win, f, s, 5.35, 6.15, 0.4, 0.2)
    }
  }
  // Ends: three bays of rectangular windows under arched lunettes, roundels between, pilasters.
  for (const [a, b] of [[[X, -Y], [X, Y]], [[-X, Y], [-X, -Y]]] as [XY, XY][]) {
    const f = edgeFrame(a, b)
    for (const s of [f.L / 6, f.L / 2, (5 * f.L) / 6]) {
      rectWin(win, f, s, 1.5, 4.2, 0.62)
      wallBox(stone, f, s - 0.85, s + 0.85, 4.2, 4.5, 0.12)
      archWin(stone, f, s, 4.6, 6.05, 1.05, 0.06)
      archWin(win, f, s, 4.75, 5.8, 0.8, 0.1)
    }
    for (const s of [f.L / 3, (2 * f.L) / 3]) archWin(win, f, s, 4.95, 5.85, 0.45, 0.2)
    for (const s of [0, f.L / 3, (2 * f.L) / 3, f.L]) wallBox(stone, f, Math.max(0, s - 0.5), Math.min(f.L, s + 0.5), PL, WALL, 0.18, false)
  }
  // Louvred cupola toward the east end, a chimney toward the west.
  box(brick, 8.0, -0.8, 9.6, 0.8, 8.4, 11.2)
  for (const [x0, x1, y0, y1] of [[8.0, 9.6, -0.85, -0.8], [8.0, 9.6, 0.8, 0.85]]) box(shade, x0 + 0.3, y0, x1 - 0.3, y1, 9.9, 10.9)
  hipRoof(tile, null, stone, 8.0, -0.8, 9.6, 0.8, 11.2, 0.7, 0.2, ['hip', 'hip'], 'x')
  box(brick, -10.4, -2.4, -9.4, -1.4, 8.6, 11.0)

  finishModel('Tennis House', 'nyc-tennis-house', [
    { part: brick, material: finish('buff-brick', 0xe4dac2) },
    { part: stone, material: PALETTE.stone },
    { part: tile, material: finish('muted-terracotta', 0xae7f6b) },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('loggia-shade', 0x6f777d) },
  ], { bearing: 21.4, osm: 'way/241846604', height: 11.9 })
}

if (import.meta.main) build()
