/**
 * Assumption (Dormition) Cathedral, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-assumption-cathedral.ts
 *
 * Aristotele Fioravanti's white-stone cathedral of 1475-79 on the north
 * side of Cathedral Square: a 4 x 3 bay box under twelve zakomary gables
 * (four on the north and south fronts, three on the west and east), the
 * roof laid over the vaults behind them, five gilded helmet domes on tall
 * white drums shifted towards the east, five low apses, the blind arcade
 * belt round the walls and the fresco portals of the north, south and
 * west fronts.
 *
 * Frame: built turned so +x runs along the cathedral's axis to the altar
 * (bearing 73.7) and +y to its north side; the placement's bearing is
 * 343.7. Origin: the area centroid of OSM relation/3028585.
 *
 * Evidence
 * - OSM relation/3028585 (the outline) and its parts, fetched 2026-11-18
 *   with the API's map call: relation/3028594 (walls, height 20),
 *   relation/3058445-3058452 (the roof over the vaults: seven barrels
 *   rising 3.6 m from 20 m, one per bay row and column, under a roof to
 *   25 m), relation/19652235-19652239 (the five drums and domes: four 8 m
 *   across to 33.6 m, the central 9.8 m across to 40.4 m), relation/16456002
 *   (the west porch). Bay lines, pilasters, the portal recesses and the five
 *   apses are read off the outline in the turned frame.
 * - Published (ru.wikipedia, "Успенский собор (Москва)"): five domes
 *   shifted east, five apses; four bays on the north and south walls,
 *   three on the west and east, each ending in a zakomara; twelve equal
 *   square bays inside.
 * - Photos, Wikimedia Commons (all evidence-licensed):
 *   - "Moscow. Kremlin. Dormition Cathedral P5152479 2600.jpg",
 *     Alexxx1979, CC BY-SA 4.0 (from the west-south-west: west and south
 *     fronts, the five domes)
 *   - "Dormition-Cathedral Moscow.jpg", acediscovery, CC BY 4.0 (south
 *     portal, drums and helmets up close)
 *   - "The Cathedral of the Dormition, Kremlin, Moscow, Russia.jpg",
 *     Vyacheslav Argenberg, CC BY 4.0 (south front from the south-west)
 *   - "Assumption Cathedral (Kremlin, 2020) east facade 02 by shakko.jpg",
 *     shakko, CC BY-SA 4.0 (the apses and the fresco tympana)
 *   - "Moscow - 2025-8 - Assumption Cathedral.jpg", Юрий Д.К., CC BY 4.0
 *     (domes from the south, over the wall)
 *   - "Cathedral square inside the Kremlin.jpg", Pedro Szekely, CC BY-SA
 *     2.0 (the roof and domes from Ivan the Great)
 *
 * - Published heights: 45 m to the top of the central cross (sobory.ru,
 *   object 03386); about 21 m to the tops of the zakomary (a Yandex Q
 *   answer quoting 43 x 29 m outside and 49 m overall; the lower figure is
 *   used for the total).
 *
 * Measured from the photos (scaled by the 27.2 m west front): the
 * zakomary spring at 17.4 m and rise 4.2 m (OSM: 20 + 3.6; the photos read
 * nearly half-round gables, and 21.6 m tops match the published 21 m), the
 * arcade belt at about 5.8-9.2 m, the upper slit windows 13-16 m, the west
 * portal's hood about 11-12 m. Drum diameters 7.5 m (sides) and 9.2 m
 * (centre), 94% of OSM's circles, which include the cornice; helmets about
 * 0.88 of their drum's width tall and swelling to 1.13 of it (from the distant photos; close-up ones
 * foreshorten them).
 * Estimated: drum tops 29 m (sides) and 31.5 m (centre), helmets 6.6 and
 * 8.0 m tall with 1.1-1.3 m spikes and 2.7-3.4 m crosses, so the central
 * cross ends at 44.2 m against the published 45. Apse walls 13.5 m
 * (photo). The arcade belt is drawn as two ledges rather than its small
 * columns; the west portal's porch is 1.6 m deep, where OSM's porch
 * outline (relation/16456002) also takes in its steps.
 *
 * Doubts: the east zakomary carry frescoes, drawn as one muted panel each;
 * the frescoes are not copied. Crosses' orientation (bars north-south) is
 * from the photos of the west front, where they read broad.
 *
 * Night: the cathedral is floodlit, walls and domes (`_FLOODLIGHT`);
 * the slit windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  apse, archPanel, barrelBlock, block, cross, dome, drum, finishModel, floodDomes, floodWalls, hood, tympanum, zakomaraBlock,
} from './moscow-church-kit'

const stone = new Part(), trim = new Part(), roof = new Part(), gold = new Part(), fresco = new Part(), win = new Part()

// ---------------------------------------------------------------- plan (turned frame, from OSM)
const X0 = -18.4, X1 = 17.1, Y0 = -13.6, Y1 = 13.6
const xb = [X0, -9.25, -0.7, 8.05, X1]
const yb = [Y0, -4.3, 4.3, Y1]
const ZS = 17.4, RISE = 4.2
const S: V3 = [0, -1, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0], E: V3 = [1, 0, 0]
const AX: V3 = [1, 0, 0], AY: V3 = [0, 1, 0]

// ---------------------------------------------------------------- body under the zakomary
zakomaraBlock({ wall: stone, roof, edge: gold, xb, yb, z0: 0, zs: ZS, rise: () => RISE, n: 6, overhang: 0.4 })

// plinth
for (const [x0, y0, x1, y1] of [[X0 - 0.2, Y0 - 0.2, X1, Y0 + 0.5], [X0 - 0.2, Y1 - 0.5, X1, Y1 + 0.2], [X0 - 0.2, Y0, X0 + 0.5, Y1]])
  block(stone, x0, y0, 0, x1, y1, 0.9, trim)

// pilasters: the corners, and the bay lines on each front, up to the springing
const PW = 1.25, PP = 0.65
for (const x of [-9.25, -0.7, 8.05]) for (const [y0, y1] of [[Y0 - PP, Y0], [Y1, Y1 + PP]]) block(stone, x - PW / 2, y0, 0.9, x + PW / 2, y1, ZS - 0.1, trim)
for (const y of [-4.3, 4.3]) block(stone, X0 - PP, y - PW / 2, 0.9, X0, y + PW / 2, ZS - 0.1, trim)
for (const sy of [-1, 1]) {
  // west corners wrap both fronts
  block(stone, X0 - PP, sy > 0 ? Y1 - 1.4 : Y0 - PP, 0.9, X0 + 1.3, sy > 0 ? Y1 + PP : Y0 + 1.4, ZS - 0.1, trim)
  // east corner piers, the full height of the walls, past the east wall
  block(stone, X1 - 1.2, sy > 0 ? Y1 - 1.7 : Y0 - PP, 0, 19.33, sy > 0 ? Y1 + PP : Y0 + 1.7, ZS, roof)
}

// the arcade belt: two ledges round the north, south and west fronts
for (const z of [5.8, 9.0]) {
  block(trim, X0, Y0 - 0.25, z - 0.3, X1, Y0, z, trim)
  block(trim, X0, Y1, z - 0.3, X1, Y1 + 0.25, z, trim)
  for (const [y0, y1] of [[Y0, -3.6], [3.4, Y1]]) block(trim, X0 - 0.25, y0, z - 0.3, X0, y1, z, trim)
}

// ---------------------------------------------------------------- windows and portals
const bayC = (b: number[], i: number) => (b[i] + b[i + 1]) / 2
for (const [y, n] of [[Y0, S], [Y1, N]] as [number, V3][]) {
  for (let i = 0; i < 4; i++) {
    const x = bayC(xb, i)
    archPanel(win, [x, y, 13.0], AX, n, 0.8, 2.7)
    if (i !== 2) archPanel(win, [x, y, 6.2], AX, n, 1.0, 2.2)
  }
  // portal in the third bay: a fresco under a hood, the doors below
  const px = 3.7
  archPanel(fresco, [px, y, 0.9], AX, n, 4.2, 8.4, 10)
  archPanel(gold, [px, y, 0.9], AX, n, 2.3, 3.4, 8, 0.09)
  hood(roof, [px, y, 0.9 + 8.4], AX, n, 2.15, 0.45, 0.7, 10, gold)
  block(stone, px - 2.75, n[1] > 0 ? y : y - 0.55, 0.9, px - 2.2, n[1] > 0 ? y + 0.55 : y, 9.3, trim)
  block(stone, px + 2.2, n[1] > 0 ? y : y - 0.55, 0.9, px + 2.75, n[1] > 0 ? y + 0.55 : y, 9.3, trim)
}
for (const i of [0, 2]) archPanel(win, [X0, bayC(yb, i), 13.0], AY, W, 0.8, 2.7)
archPanel(win, [X0, 0, 14.6], AY, W, 0.8, 2.0)
// east tympana: frescoes under the three zakomary
for (let i = 0; i < 3; i++) tympanum(fresco, [X1, bayC(yb, i), ZS], AY, E, yb[i + 1] - yb[i], RISE, 3.4, 0.45)

// west portal: a shallow frame round the fresco and doors, under a hood, on steps
const WX0 = -20.0
barrelBlock(stone, roof, WX0, -3.35, X0, 3.35, 0, 11.6, 'x', 3.35, 8, 0.25)
archPanel(fresco, [WX0, 0, 1.0], AY, W, 4.6, 8.4, 10)
archPanel(gold, [WX0, 0, 1.0], AY, W, 2.4, 3.6, 8, 0.09)
hood(roof, [WX0, 0, 1.0 + 8.4], AY, W, 2.3, 0.5, 0.8, 10, gold)
block(stone, -22.0, -3.6, 0, WX0, 3.6, 0.6, trim)

// ---------------------------------------------------------------- apses (east)
for (const [cy, ry, rx] of [[-10.4, 1.5, 2.2], [-6.45, 1.95, 2.2], [0, 3.9, 3.9], [6.25, 1.65, 2.2], [10.35, 1.55, 2.2]])
  apse({ wall: stone, roof, win, c: [X1, cy], rx, ry, z0: 0, z1: 13.5, roofRise: ry > 3 ? 3.0 : 1.6, sill: 6.2, winW: ry > 3 ? 1.0 : 0.8, winH: 2.6 })

// ---------------------------------------------------------------- drums, helmets, crosses
const DRUMS: Array<{ c: [number, number]; r: number; top: number; H: number; spike: number; L: number }> = [
  { c: [3.7, 0], r: 4.6, top: 31.5, H: 8.0, spike: 1.3, L: 3.4 },
  { c: [-5.0, -8.6], r: 3.75, top: 29, H: 6.6, spike: 1.1, L: 2.7 },
  { c: [-5.0, 8.6], r: 3.75, top: 29, H: 6.6, spike: 1.1, L: 2.7 },
  { c: [12.1, -8.6], r: 3.75, top: 29, H: 6.6, spike: 1.1, L: 2.7 },
  { c: [12.1, 8.6], r: 3.75, top: 29, H: 6.6, spike: 1.1, L: 2.7 },
]
for (const d of DRUMS) {
  drum({ wall: trim, win, trim, c: d.c, z0: ZS + 1, z1: d.top, r: d.r, n: 16, windows: 8, winW: 0.6, winH: 2.4, sill: d.top - 4.2, cornice: 0.3 })
  const top = dome(gold, d.c, d.top, d.r * 1.0, d.H, 'fullhelmet', 16, d.spike, d.r + 0.3)
  cross(gold, d.c, top - 0.1, d.L, 'y')
}

await finishModel('moscow-assumption-cathedral', 'Assumption Cathedral', [
  { part: stone, material: { ...finish('assumption-stone', 0xe6dfd2), floodlight: floodWalls } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
  { part: roof, material: finish('kremlin-iron', 0x737b80) },
  { part: gold, material: { ...finish('kremlin-gold', 0xdcb25e), floodlight: floodDomes } },
  { part: fresco, material: finish('assumption-fresco', 0xae8a6c) },
  { part: win, material: PALETTE.window },
], { bearing: 343.7, anchor: [55.7509265, 37.6170592], replaces: ['relation/3028585'] })
