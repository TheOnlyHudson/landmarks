/**
 * Cathedral of the Annunciation, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-annunciation-cathedral.ts
 *
 * The grand princes' house church on the west side of Cathedral Square,
 * built by Pskov masons in 1484-89 and enlarged under Ivan the Terrible:
 * a small cross-domed core on a high basement, ringed by galleries, with
 * four corner chapels; nine gilded onion domes (the central one, four round
 * it on the core and four on the chapels) on tall white drums, the roofs
 * of the core and the chapels laid as tiers of gilded keeled kokoshniks,
 * three tall apses with gilded roofs to the east, and the stair porch at
 * the south-east corner.
 *
 * Frame: built turned so +x runs along the axis to the altar (bearing 76)
 * and +y to the north; the placement's bearing is 346. Origin: the area
 * centroid of OSM relation/1359251.
 *
 * Evidence
 * - OSM relation/1359251 and its 63 parts, fetched 2026-11-18:
 *   relation/3062968 (the core, 12.4 x 13.5 m, 16.3 m), the barrels and
 *   keels over its 3 x 3 bays (relation/3062958-3062998, 3063190-3063195:
 *   rising 1.7-2.3 m, keels to 19 m), the corner chapels
 *   (relation/3062963-3062966, 14.5 m), the west and north galleries
 *   (relation/3062962, 3062961, 9.5 m), the south gallery over the basement
 *   (relation/3062967, 11 m, lean-to roof), the three apses
 *   (relation/3062969, 3062974, 3062981: 16.5-17 m with pyramid roofs),
 *   the drums and onions (way/228697441-228697767: the central drum 3.7 m
 *   across to 22.5 m with its onion to 27 m; four core drums 2.4 m across
 *   to 21 m, onions to 24.5 m; four chapel drums to 17 m, onions to 20.5
 *   m) and the kokoshnik ring round the central drum (the 0.8 m "round"
 *   parts at 14.5-15.3 m, here folded into the keels).
 * - Photos, Wikimedia Commons:
 *   - "The Cathedral of the Annunciation.jpg", Holger Zscheyge, CC BY 2.0
 *     (from the north-east: the apses, the gold kokoshniks, the north
 *     gallery and its stair)
 *   - "Annunciation Cathedral in Moscow 20190430.jpg", Suicasmo, CC BY-SA
 *     4.0 (the south front, square on: the basement gallery, the chapels'
 *     kokoshniks, the domes' proportions)
 *   - "Russia-Moscow-Annunciation Cathedral.jpg", Alex Zelenko, CC BY-SA
 *     4.0 (from the north-east across the square)
 *   - "Cathedral of the Annunciation, Moscow.jpg", Pedro Szekely, CC BY-SA
 *     2.0 (from Ivan the Great: the roofs)
 *   - "Moscow - 2026 - Annunciation Cathedral of the Moscow Kremlin.jpg",
 *     Юрий Д.К., CC BY 4.0 (the domes)
 *
 * Heights are OSM's but for the domes. Measured on the square-on south
 * photo (scaled by the 20 m south front): the central drum stands about
 * 1.25 times its width above the kokoshniks and its onion is 0.6 times as
 * tall as it is wide; so the central drum is drawn to 23.4 m (OSM 22.5),
 * the onion 4.6 m wide and 2.9 m tall with a 1.1 m spike (27.4 m, OSM 27)
 * and a 2.2 m cross; the other onions to the same proportions on OSM's
 * drums. Estimated: the keels (1.0 m on the core, 0.7 m on the chapels),
 * the chapels' kokoshnik bays, the apses' walls at 14 m under 2.6 m
 * gilded cones, gallery window sizes, the porch's height (6 m).
 *
 * The kokoshniks are white keel-arched gables standing on the cornices,
 * their curved tops gilded, with gilded pyramid roofs rising behind them:
 * three on each front of the chapels, three over the core's bays and a
 * second row of two a side round the central drum (keels 0.5-0.9 m, from
 * the photos). The south gallery's arcade: five large round arches on the
 * upper storey with the gallery windows in them, small windows below.
 *
 * Doubts: OSM's south gallery outline takes in the basement under the
 * terrace; it is drawn as one 11 m block. The core's kokoshnik rows are
 * simplified (the real ones overlap in several steps). The roofs of the galleries are
 * drawn dark (they are hardly seen from the ground); the gilded roofs are
 * the core's, the chapels' and the apses'.
 *
 * Night: walls and domes floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  apse, archPanel, barrelBlock, block, cross, dome, drum, finishModel, floodDomes, floodWalls, hood, kokoshnik, pyramidRoof, wedge,
} from './moscow-church-kit'

const white = new Part(), trim = new Part(), gold = new Part(), roof = new Part(), win = new Part(), door = new Part()
const S: V3 = [0, -1, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0], E: V3 = [1, 0, 0]
const AX: V3 = [1, 0, 0], AY: V3 = [0, 1, 0]

// ---------------------------------------------------------------- galleries on the basement
wedge(white, -9.9, -12.6, 10.2, -8.6, 11, 10.2, 'y1', roof)            // south gallery
block(white, -4.0, -8.6, 0, 4.3, -3.9, 11, roof)                      // its middle, between the chapels
block(white, -9.9, -2.6, 0, -4.5, 8.1, 9.5, roof)                     // west gallery
block(white, -4.0, 9.6, 0, 3.1, 13.9, 9.5, roof)                      // north gallery
for (const [x0, y0, x1, y1, z] of [[-9.9, -12.6, 10.2, -8.6, 10.2], [-9.9, -2.6, -4.5, 8.1, 9.5], [-4.0, 9.6, 3.1, 13.9, 9.5]])
  block(trim, x0 - 0.2, y0 - 0.2, z - 0.6, x1 + 0.2, y1 + 0.2, z - 0.2, trim)  // cornice band
// the gallery's arcade: on the upper storey large round arches with the gallery's windows in
// them under deep reveals, blind arches on the basement below (south front, photo-S)
for (const x of [-7.6, -3.75, 0.1, 3.95, 7.8]) {
  archPanel(win, [x, -12.6, 5.0], AX, S, 2.4, 2.4, 8)
  hood(trim, [x, -12.6, 7.4], AX, S, 1.45, 0.35, 0.35, 6)
  archPanel(win, [x, -12.6, 1.0], AX, S, 0.8, 0.9, 6)
}
for (const y of [-0.2, 3.0, 6.2]) {
  archPanel(win, [-9.9, y, 4.6], AY, W, 1.9, 2.4, 8)
  hood(trim, [-9.9, y, 7.0], AY, W, 1.2, 0.3, 0.3, 6)
}
for (const x of [-2.6, 1.9]) {
  archPanel(win, [x, 13.9, 4.6], AX, N, 1.9, 2.4, 8)
  hood(trim, [x, 13.9, 7.0], AX, N, 1.2, 0.3, 0.3, 6)
}
// doors: west and north portals, and the south basement door
archPanel(door, [-9.9, 2.9 - 6.2 + 6.2, 0.2], AY, W, 1.6, 2.3, 6, 0.06)
archPanel(door, [-0.4, 13.9, 3.2], AX, N, 1.6, 2.4, 6, 0.06)
hood(gold, [-0.4, 13.9, 5.6], AX, N, 1.1, 0.35, 0.8, 6)
archPanel(door, [3.0, -12.6, 0.2], AX, S, 1.3, 2.0, 6, 0.06)
// the north stair up to the gallery portal
wedge(white, -2.4, 13.9, 1.6, 17.0, 3.2, 0.3, 'y0', trim)

// ---------------------------------------------------------------- corner chapels under kokoshniks
// Each front ends in three white keel-arched kokoshniks on the cornice, their
// curved tops gilded, a gilded roof rising behind them to the drum.
/** A row of kokoshniks along one front: from a to b (along u), facing n. */
function row(a: number, b: number, at: (s: number) => [number, number], u: V3, n: V3, z: number, k: number, keel: number, t = 0.3, seg = 6) {
  const w = (b - a) / k
  for (let i = 0; i < k; i++) {
    const [x, y] = at(a + w * (i + 0.5))
    kokoshnik(white, gold, [x, y, z], u, n, w - 0.12, keel, t, seg)
  }
}
/** Kokoshniks all round a rectangle. */
function ring(x0: number, y0: number, x1: number, y1: number, z: number, kx: number, ky: number, keel: number, seg = 6) {
  row(x0, x1, (s) => [s, y0], AX, S, z, kx, keel, 0.3, seg)
  row(x0, x1, (s) => [s, y1], AX, N, z, kx, keel, 0.3, seg)
  row(y0, y1, (s) => [x0, s], AY, W, z, ky, keel, 0.3, seg)
  row(y0, y1, (s) => [x1, s], AY, E, z, ky, keel, 0.3, seg)
}
const CH: Array<[number, number, number, number]> = [[-9.9, -8.6, -4.0, -2.6], [4.3, -8.6, 10.2, -2.6], [-9.9, 8.1, -4.0, 13.9], [3.1, 8.9, 7.8, 14.0]]
for (const [x0, y0, x1, y1] of CH) {
  block(white, x0, y0, 0, x1, y1, 13.4, null)
  block(trim, x0 - 0.25, y0 - 0.25, 12.9, x1 + 0.25, y1 + 0.25, 13.4, null)
  pyramidRoof(gold, x0, y0, x1, y1, 13.4, 1.9, 0)
  ring(x0 + 0.1, y0 + 0.1, x1 - 0.1, y1 - 0.1, 13.4, 3, 3, 0.5, 4)
}
// chapel windows facing out
for (const [x, y, n, u] of [[-6.95, -8.6, S, AX], [7.25, -8.6, S, AX], [-6.95, 13.9, N, AX], [5.45, 14.0, N, AX], [-9.9, -5.6, W, AY], [-9.9, 11.0, W, AY], [10.2, -5.6, E, AY], [7.8, 11.45, E, AY]] as [number, number, V3, V3][]) {
  archPanel(win, [x - 0.6 * u[0], y - 0.6 * u[1], 11.3], u, n, 0.55, 0.8, 6)
  archPanel(win, [x + 0.6 * u[0], y + 0.6 * u[1], 11.3], u, n, 0.55, 0.8, 6)
}

// ---------------------------------------------------------------- the core
// Two stepped rows of kokoshniks: three large ones on each front over the
// bays, then a second row of two round the central drum, the gilded roof
// rising in steps behind them.
block(white, -4.5, -3.9, 0, 7.9, 9.6, 16.3, null)
block(trim, -4.75, -4.15, 15.8, 8.15, 9.85, 16.3, null)
pyramidRoof(gold, -4.5, -3.9, 7.9, 9.6, 16.3, 4.3, 0.1)
{
  const xb = [-4.5, -0.55, 4.0, 7.9], yb = [-3.9, 0.3, 5.6, 9.6]
  for (let i = 0; i < 3; i++) {
    const xm = (xb[i] + xb[i + 1]) / 2, wx = xb[i + 1] - xb[i] - 0.15, ym = (yb[i] + yb[i + 1]) / 2, wy = yb[i + 1] - yb[i] - 0.15
    kokoshnik(white, gold, [xm, -3.75, 16.3], AX, S, wx, 0.9)
    kokoshnik(white, gold, [xm, 9.45, 16.3], AX, N, wx, 0.9)
    kokoshnik(white, gold, [-4.35, ym, 16.3], AY, W, wy, 0.9)
    kokoshnik(white, gold, [7.75, ym, 16.3], AY, E, wy, 0.9)
  }
}
ring(-1.2, -0.1, 4.8, 5.9, 18.3, 2, 2, 0.6, 6)
for (const [x, y, n, u] of [[1.8, -3.9, S, AX], [1.8, 9.6, N, AX], [-4.5, 2.9, W, AY]] as [number, number, V3, V3][])
  for (const d of [-0.8, 0.8]) archPanel(win, [x + d * u[0], y + d * u[1], 12.6], u, n, 0.7, 1.4, 6)


// apses, tall, under gilded cones
for (const [cy, ry, rx] of [[7.25, 1.65, 1.0], [2.95, 2.65, 2.1], [-1.3, 1.6, 1.3]])
  apse({ wall: white, roof: gold, win, c: [7.9, cy], rx, ry, z0: 0, z1: 14.0, roofRise: 2.6, sill: 7.5, winW: rx > 2 ? 0.9 : 0.6, winH: 2.0, ov: 0.25 })

// the porch at the south-east corner: an arched stair hall under a barrel roof
barrelBlock(white, roof, 10.2, -12.4, 13.3, -8.5, 0, 6.0, 'x', 1.95, 8, 0.25)
archPanel(door, [13.3, -10.45, 0.4], AY, E, 2.2, 2.6, 8, 0.06)
hood(trim, [13.3, -10.45, 3.0], AY, E, 1.1, 0.3, 0.15, 6)

// ---------------------------------------------------------------- drums and onions
type D = { c: [number, number]; z0: number; z1: number; r: number; R: number; H: number; spike: number; L: number; n: number }
const DOMES: D[] = [
  { c: [1.8, 2.9], z0: 17.5, z1: 23.4, r: 1.85, R: 2.3, H: 2.9, spike: 1.1, L: 2.2, n: 16 },
  ...([[-2.35, -1.6], [6.0, -1.6], [5.9, 7.5], [-2.4, 7.4]] as [number, number][]).map((c) => ({ c, z0: 16.8, z1: 21.0, r: 1.2, R: 1.55, H: 2.0, spike: 0.9, L: 1.7, n: 12 })),
  ...([[-7.0, -5.6], [7.1, -5.6], [5.4, 11.5], [-7.0, 11.0]] as [number, number][]).map((c) => ({ c, z0: 14.0, z1: 17.0, r: 1.1, R: 1.45, H: 1.9, spike: 0.9, L: 1.5, n: 12 })),
]
for (const d of DOMES) {
  drum({ wall: white, win, trim, c: d.c, z0: d.z0, z1: d.z1, r: d.r, n: d.n, windows: d.n === 16 ? 8 : 4, winW: 0.4, winH: d.r > 1.5 ? 1.6 : 1.0, sill: d.z1 - (d.r > 1.5 ? 3.0 : 2.0), cornice: 0.18 })
  // the arcade belt round each drum
  if (d.z0 > 15) drum({ wall: trim, c: d.c, z0: d.z1 - (d.r > 1.5 ? 3.6 : 2.6), z1: d.z1 - (d.r > 1.5 ? 3.3 : 2.35), r: d.r + 0.12, n: d.n, cornice: 0 })
  const t = dome(gold, d.c, d.z1, d.R, d.H, 'onion', d.n, d.spike, d.r + 0.15, d.n < 16)
  cross(gold, d.c, t - 0.1, d.L, 'y', 0.18)
}

await finishModel('moscow-annunciation-cathedral', 'Cathedral of the Annunciation', [
  { part: white, material: { ...finish('annunciation-white', 0xf4eee5), floodlight: floodWalls } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
  { part: gold, material: { ...finish('kremlin-gold', 0xdcb25e), floodlight: floodDomes } },
  { part: roof, material: finish('kremlin-iron', 0x737b80) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('annunciation-oak', 0x9c7a58) },
], { bearing: 346, anchor: [55.7499996, 37.6168811], replaces: ['relation/1359251'] })
