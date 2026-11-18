/**
 * Cathedral of the Archangel Michael, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-archangel-cathedral.ts
 *
 * Aloisio the New's cathedral of 1505-08 on the south side of Cathedral
 * Square, the tsars' burial church: a white two-tier box in Venetian
 * Renaissance dress, five zakomary on the long fronts and three on the
 * ends, each filled with a carved scallop shell, a heavy cornice between
 * the tiers, pilasters on the bay lines; five domes, the central one gilded
 * and four smaller silver ones; the central apse and the round north-east
 * and south-east chapels with their small domes, the low 19th-century
 * gallery and the barrel-roofed chapel along the south side, and the big
 * sloping buttress at its south-east corner.
 *
 * Frame: built turned so +x runs along the axis to the altar (bearing
 * 82.6) and +y to the north; the placement's bearing is 352.6. Origin:
 * the area centroid of OSM relation/1359243.
 *
 * Evidence
 * - OSM relation/1359243 and the 99 parts inside it, fetched 2026-11-18:
 *   relation/3060987 (the body, 27.4 x 23.1 m, height 19.5), the barrels
 *   over its bays (relation/3060983-3060997: five across the long fronts,
 *   rising 2.2-3.5 m; three across the ends, the middle one 5 m), the
 *   drums (relation/19652860-19652869: the central 6.5 m across to 32.5 m,
 *   the four side drums 4.9 m across to 29.5 m, then 32 m), the domes'
 *   stacked rings (the side domes to 38-38.5 m, the central spike to 41 m),
 *   the central apse (relation/3060979, to 15 m), the side apses over the
 *   chapels (relation/3060981, 3060984), the round chapels
 *   (relation/3060989, 3060990, 6.5 m, pyramid roofs to 8 m and small domes
 *   to 11 m), the south gallery (relation/3060992, 10.4 m, lean-to roof),
 *   the south-west chapel (relation/3060991 with the round roof
 *   relation/3060978, to 9.7 m) and the buttress (relation/3060998).
 * - Photos, Wikimedia Commons:
 *   - "Exterior of Cathedral of the Archangel in Moscow 20190430-1.jpg",
 *     Suicasmo, CC BY-SA 4.0 (south front from the south-west: the shells,
 *     the cornices, the gallery, the buttress, silver and gold domes)
 *   - "Exterior of Cathedral of the Archangel in Moscow 20190430-2.jpg",
 *     Suicasmo, CC BY-SA 4.0 (north front)
 *   - "Exterior of Cathedral of the Archangel in Moscow 20190430-3.jpg",
 *     Suicasmo, CC BY-SA 4.0 (west front: the deep portal, the three
 *     shells, the taller middle zakomara)
 *   - "Moscow. Southern facade of the Archangel Cathedral and the Ivan the
 *     Great Bell Tower.jpg", Юрий Д.К., CC BY 4.0
 *   - "Cathedral of the Archangel in Moscow 01 by shakko.jpg", shakko, CC
 *     BY-SA 3.0 (from the north-west across the square)
 *   - "7330.1. Moscow Kremlin. Cathedral of the Archangel.jpg",
 *     Александровы АГ, CC BY-SA 4.0 (north-west corner)
 *
 * Walls, bays and the east end follow OSM's heights; a far photo from the
 * north-west (20190430-2) agrees with them, the lower cornice at 0.46 and
 * the main cornice at 0.81 of the gable tops. The domes do not: OSM's
 * stacked rings put the side drums to 32 m under 6.5 m domes, where the
 * photos show short drums, about 0.75 of their width above the roof, under
 * squat silver bulbs. Drawn from the photos: side drums 4.6 m across to
 * 27.5 m, bulbs 5.2 m wide and 3.4 m tall, spikes to 31.8 m, 1.9 m crosses;
 * the central drum 6.2 m across to 31.5 m, its gold onion 7.5 m wide and
 * 6.8 m tall, the spike to 39.9 m (OSM's top part is at 41), a 2.6 m cross.
 * Estimated: the cornices at 9.9-10.9 and 18.7-19.5 m; the zakomary
 * half-round over their bays (OSM's rises are within 0.5 m) drawn up to a
 * sharp ogee keel 1.9 m above the half-round, as the photos' pointed gables,
 * the roof behind them sinking towards the middle (a guess: the photos show
 * the gables standing clear, the roof only as dark lines between them); window sizes; the lower
 * tier's blind arches. The shells are fans of seven flutes (nine in the
 * taller middle gables). The buttress is a wedge from 11.5 m down to the
 * ground (OSM tags it a 19.5 m pyramid, which the photos do not show).
 * Published: tourist sources (azbyka.ru and others) give a height of
 * "21 m" without saying to what; it is below OSM's eaves plus gables
 * (23.7-25.1 m here) and was not used.
 *
 * Doubts: the east end is seen only obliquely in the photos; the side
 * apses and the chapels' small domes follow OSM. The north side has
 * a low porch the model leaves out.
 *
 * Night: walls and domes floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  apse, archPanel, barrelBlock, block, cross, dome, drum, finishModel, floodDomes, floodWalls, hood, shell, wedge, zakomaraBlock,
} from './moscow-church-kit'

const white = new Part(), trim = new Part(), roof = new Part(), gold = new Part(), silver = new Part(), win = new Part()

const X0 = -16.6, X1 = 10.8, Y0 = -8.8, Y1 = 14.3
const xb = [X0, -12.9, -7.0, -1.15, 5.25, X1]
const yb = [Y0, -1.95, 7.7, Y1]
const ZS = 19.5
const S: V3 = [0, -1, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0], E: V3 = [1, 0, 0]
const AX: V3 = [1, 0, 0], AY: V3 = [0, 1, 0]
const bayC = (b: number[], i: number) => (b[i] + b[i + 1]) / 2

// ---------------------------------------------------------------- body: two tiers under the zakomary
zakomaraBlock({ wall: white, roof, edge: roof, xb, yb, z0: 0, zs: ZS, rise: (w) => w / 2, n: 6, overhang: 0.25, keel: 1.9, keelWidth: 0.4, keelPow: 1.5, sag: 0.35, sagDepth: 5 })

// plinth, the cornice between the tiers, the cornice under the gables
const band = (z0: number, z1: number, d: number) => {
  block(trim, X0 - d, Y0 - d, z0, X1 + d, Y0, z1, trim)
  block(trim, X0 - d, Y1, z0, X1 + d, Y1 + d, z1, trim)
  block(trim, X0 - d, Y0, z0, X0, Y1, z1, trim)
  block(trim, X1, Y0, z0, X1 + d, Y1, z1, trim)
}
band(0, 1.0, 0.3)
band(9.9, 10.9, 0.55)
band(18.7, ZS, 0.5)

// pilasters on the bay lines, both tiers
for (const x of xb.slice(1, -1)) for (const [y0, y1] of [[Y0 - 0.35, Y0], [Y1, Y1 + 0.35]]) block(white, x - 0.5, y0, 1.0, x + 0.5, y1, 18.7, trim)
for (const y of yb.slice(1, -1)) for (const [x0, x1] of [[X0 - 0.35, X0], [X1, X1 + 0.35]]) block(white, x0, y - 0.5, 1.0, x1, y + 0.5, 18.7, trim)

// shells in every zakomara, and the windows of both tiers
for (const [y, n] of [[Y0, S], [Y1, N]] as [number, V3][]) for (let i = 0; i < 5; i++) {
  const x = bayC(xb, i), span = xb[i + 1] - xb[i]
  shell(trim, [x, y, ZS + 0.1], AX, n, span / 2 - 0.45, 7, 0.35)
  archPanel(win, [x, y, 13.2], AX, n, 0.9, 1.6)
  if (n[1] > 0 || i < 1) {
    archPanel(win, [x, y, 4.0], AX, n, 1.3, 2.6)
    // the lower tier's big blind arches
    hood(trim, [x, y, 7.0], AX, n, span / 2 - 0.85, 0.35, 0.2, 6)
  }
}
for (const [x, n] of [[X0, W], [X1, E]] as [number, V3][]) for (let i = 0; i < 3; i++) {
  const y = bayC(yb, i), span = yb[i + 1] - yb[i]
  shell(trim, [x, y, ZS + 0.1], AY, n, span / 2 - 0.45, i === 1 ? 9 : 7, 0.35)
  if (n[0] < 0) {
    if (i !== 1) {
      archPanel(win, [x, y, 13.2], AY, n, 0.9, 1.6)
      archPanel(win, [x, y, 4.0], AY, n, 1.3, 2.6)
      hood(trim, [x, y, 7.0], AY, n, span / 2 - 0.85, 0.35, 0.2, 6)
    } else for (const dy of [-1.0, 1.0]) archPanel(win, [x, y + dy, 12.4], AY, n, 1.4, 2.2)
  }
}
// west portal: a deep round-headed recess with the doors, under a hood
archPanel(roof, [X0, 2.9, 1.0], AY, W, 5.6, 6.0, 10)
archPanel(gold, [X0, 2.9, 1.0], AY, W, 2.4, 3.0, 8, 0.08)
hood(trim, [X0, 2.9, 7.0], AY, W, 2.8, 0.6, 0.9, 10)
block(white, -17.0, -0.6, 0, X0, 6.4, 0.5, trim)

// ---------------------------------------------------------------- the east end
apse({ wall: white, roof, win, c: [X1, 2.75], rx: 3.0, ry: 3.75, z0: 0, z1: 13.0, roofRise: 2.2, sill: 5.5, winW: 1.2, winH: 2.8 })
for (const [cy, ry] of [[-4.65, 2.65], [10.15, 2.65]]) apse({ wall: white, roof, win, c: [X1, cy], rx: 2.1, ry, z0: 6.5, z1: 13.0, roofRise: 1.8, sill: 8.6, winW: 0.9, winH: 1.8 })
// the round chapels at the north-east and south-east corners, with their small domes
for (const [cy, ry, y0, y1] of [[-4.8, 3.7, -8.5, -1.1], [9.8, 3.3, 6.5, 13.1]]) {
  block(white, X1, y0, 0, 14.6, y1, 6.5, roof)
  apse({ wall: white, roof, win, c: [14.6, cy], rx: 3.1, ry, z0: 0, z1: 6.5, roofRise: 1.2, sill: 2.2, winW: 1.0, winH: 1.8 })
  drum({ wall: white, trim, c: [14.4, cy], z0: 6.5, z1: 8.6, r: 0.85, n: 10, cornice: 0.15 })
  const t = dome(gold, [14.4, cy], 8.6, 1.0, 1.8, 'bulb', 10, 0.5, undefined, true)
  cross(gold, [14.4, cy], t - 0.05, 1.1, 'y', 0.14)
}

// ---------------------------------------------------------------- the south side
// the 19th-century gallery: open arches under a lean-to roof
wedge(white, -6.0, -14.2, X1, Y0, 10.4, 8.6, 'y1', roof)
for (let i = 0; i < 5; i++) {
  const x = -4.4 + i * 3.3
  archPanel(i === 2 ? gold : win, [x, -14.2, i === 2 ? 0.4 : 3.8], AX, S, i === 2 ? 2.0 : 2.0, i === 2 ? 2.8 : 2.4)
}
// the south-west chapel under its barrel roof, its lunette to the west
barrelBlock(white, roof, -12.9, -14.2, -6.0, Y0, 0, 6.5, 'x', 2.7, 8, 0.3)
for (const y of [-12.3, -11.5, -10.7]) archPanel(win, [-12.9, y, 6.8], AY, W, 0.55, 1.0, 6)
for (const x of [-11.0, -7.9]) archPanel(win, [x, -14.2, 2.0], AX, S, 1.0, 2.0)
// the buttress at the south-east corner
wedge(white, 8.0, -15.7, 13.5, -8.5, 11.5, 0.6, 'x0', roof)

// ---------------------------------------------------------------- drums and domes
drum({ wall: white, win, trim, c: [1.9, 2.6], z0: ZS + 2, z1: 31.5, r: 3.1, n: 16, windows: 8, winW: 0.6, winH: 2.4, sill: 27.2, cornice: 0.3 })
lathe2(trim, [1.9, 2.6], 26.2, 3.1, 0.25)
{ const t = dome(gold, [1.9, 2.6], 31.5, 3.75, 6.8, 'onion', 16, 1.6, 3.4); cross(gold, [1.9, 2.6], t - 0.1, 2.6, 'y') }
for (const c of [[-3.9, -5.1], [7.8, -5.1], [7.7, 10.7], [-4.0, 10.7]] as [number, number][]) {
  drum({ wall: white, win, trim, c, z0: ZS + 1, z1: 27.5, r: 2.3, n: 12, windows: 6, winW: 0.5, winH: 1.5, sill: 25.2, cornice: 0.25 })
  const t = dome(silver, c, 27.5, 2.6, 3.4, 'bulb', 12, 0.9, 2.55, true)
  cross(gold, c, t - 0.1, 1.9, 'y', 0.18)
}

/** A thin ring round a drum (its arcade belt). */
function lathe2(p: Part, c: [number, number], z: number, r: number, d: number) {
  drum({ wall: p, c, z0: z, z1: z + 0.35, r: r + d, n: 14, cornice: 0 })
}

await finishModel('moscow-archangel-cathedral', 'Cathedral of the Archangel', [
  { part: white, material: { ...finish('archangel-white', 0xf2ebe1), floodlight: floodWalls } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
  { part: roof, material: finish('kremlin-iron', 0x737b80) },
  { part: gold, material: { ...finish('kremlin-gold', 0xdcb25e), floodlight: floodDomes } },
  { part: silver, material: { ...finish('kremlin-silver', 0xc3cad0), floodlight: floodDomes } },
  { part: win, material: PALETTE.window },
], { bearing: 352.6, anchor: [55.7501717, 37.6177961], replaces: ['relation/1359243'] })
