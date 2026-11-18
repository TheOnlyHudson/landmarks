/**
 * Patriarch's Palace with the Church of the Twelve Apostles, Moscow
 * Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-patriarchs-palace.ts
 *
 * Patriarch Nikon's palace of 1653-56 on the north side of Cathedral
 * Square, with his house church of the Twelve Apostles at its east end: a
 * white three-storey palace under green-grey hipped roofs, the taller
 * block of the Cross Chamber behind; the church raised over two great gate
 * arches, three zakomary with gilded edges on each front, five silver
 * onion domes on tall arcaded drums, the central one larger; and the long
 * lower wings running west towards the Kremlin Palace.
 *
 * Frame: built turned so +x runs east along the palace (bearing 65.5) and
 * +y to its north; the placement's bearing is 335.5. Origin: the area
 * centroid of OSM relation/1359248 (the palace) and relation/1359249 (the
 * church) together.
 *
 * Evidence
 * - OSM, fetched 2026-11-18: relation/1359248 and relation/1359249, and
 *   the parts inside them: relation/16456011 (the main palace, 13.5 m,
 *   roofs to 17), relation/16456008 (the Cross Chamber block, 21.5 m,
 *   roofs to 25.5), relation/16456007 (the block against the church,
 *   17.5 m, roofs to 20.5), relation/21772928 (its north roof, to 22),
 *   relation/16456009, 16456010, 21773016, 21773017 (the west wings,
 *   5-12.3 m), the church's body over its ground arcade
 *   (relation/16461264-16461269: vaults from 6.5 m to 20.5 m, three bays
 *   each way), its five drums and domes (way/1214371132-1214371136: four
 *   4.4 m across, onions to 29 m; the central 6 m across, its onion to
 *   32.1 m), its apse (way/1571119816-1571119818, 6.5-16.6 m) and north
 *   gallery (relation/16456006, 11.2 m, lean-to roof to 13).
 * - Photos, Wikimedia Commons:
 *   - "Kreml-12apostel.jpg", A.Savin, CC BY-SA 3.0 (the south front of
 *     church and palace, square on)
 *   - "00 4843 Church oft the Twelve Apostles, Moscow.jpg", W. Bulach,
 *     CC BY-SA 4.0 (the same from the south-east)
 *   - "Church of the Twelve Apostles (Kremlin, 2020) south facade 01 by
 *     shakko.jpg", shakko, CC BY-SA 4.0 (from the south-west, with the
 *     Assumption's west end)
 *   - "2019-07-26-Moscow-3119-Church of the Twelve Apostles.jpg", Don-vip,
 *     CC BY-SA 4.0 (from above, Ivan the Great: the roofs)
 *   - "Church of the Twelve Apostles (19342847674).jpg", Jorge Láscar,
 *     CC BY 2.0
 *   - "Moscow, Church of the Twelve Apostles.jpg", Andrew Bossi, CC BY-SA
 *     2.0 (the east end and the porch)
 *
 * Heights are OSM's but for the domes. Estimated from the photos: the
 * church's zakomary spring at 17.3 m and are half-round; the drums stand
 * taller and the domes sit on long spikes in every photo, so the side
 * drums (4 m across) are drawn to 26 m under onions 4.6 m wide and 2.6 m
 * tall with 2 m spikes (30.6 m; OSM 29), the central drum (5.4 m) to
 * 27.6 m under a 6 m wide, 3.6 m tall onion with a 2.2 m spike (33.4 m;
 * OSM 32.1), and 1.6-2 m crosses; the gate arches 4 m wide; the palace's window rhythm (3.2 m) and
 * three storeys. The hipped roofs are drawn from OSM's eaves and ridge
 * heights.
 *
 * Doubts: the west wings are hardly seen in the photos and are drawn as
 * plain blocks to OSM's heights; their roofs as flat tops at the eaves.
 * The palace's carved window surrounds are left out.
 *
 * Night: walls and domes floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, type XY } from './sf-de-young'
import { apse, archPanel, block, cross, dome, drum, finishModel, floodDomes, floodWalls, quadOut, rectPanel, triOut, wedge, zakomaraBlock } from './moscow-church-kit'

const white = new Part(), trim = new Part(), roof = new Part(), silver = new Part(), gold = new Part(), win = new Part()
const S: V3 = [0, -1, 0], N: V3 = [0, 1, 0], E: V3 = [1, 0, 0], AX: V3 = [1, 0, 0]

/** A hipped roof over a rectangle from its eaves at z, the ridge `rise` higher, with a small overhang. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, ov = 0.4) {
  x0 -= ov; y0 -= ov; x1 += ov; y1 += ov
  const alongX = x1 - x0 >= y1 - y0, h = (alongX ? y1 - y0 : x1 - x0) / 2
  const zt = z + rise
  const c: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  const r0: V3 = alongX ? [x0 + h, (y0 + y1) / 2, zt] : [(x0 + x1) / 2, y0 + h, zt]
  const r1: V3 = alongX ? [x1 - h, (y0 + y1) / 2, zt] : [(x0 + x1) / 2, y1 - h, zt]
  if (alongX) {
    quadOut(p, c[0], c[1], r1, r0, [0, -1, 1]); quadOut(p, c[2], c[3], r0, r1, [0, 1, 1])
    triOut(p, c[1], c[2], r1, [1, 0, 1]); triOut(p, c[3], c[0], r0, [-1, 0, 1])
  } else {
    quadOut(p, c[1], c[2], r1, r0, [1, 0, 1]); quadOut(p, c[3], c[0], r0, r1, [-1, 0, 1])
    triOut(p, c[0], c[1], r0, [0, -1, 1]); triOut(p, c[2], c[3], r1, [0, 1, 1])
  }
  // the eaves' underside
  quadOut(p, c[0], c[1], c[2], c[3], [0, 0, -1])
}

/** A palace block: walls, a cornice, rows of windows on the given fronts, a hipped roof. */
function palace(x0: number, y0: number, x1: number, y1: number, h: number, rise: number, rows: number[], fronts: Array<'s' | 'n' | 'e'>) {
  block(white, x0, y0, 0, x1, y1, h, null)
  block(trim, x0 - 0.2, y0 - 0.2, h - 0.6, x1 + 0.2, y1 + 0.2, h, null)
  hip(roof, x0, y0, x1, y1, h, rise)
  for (const f of fronts) {
    const len = f === 'e' ? y1 - y0 : x1 - x0, n = Math.max(1, Math.floor(len / 3.2))
    for (let i = 0; i < n; i++) {
      const s = (len / n) * (i + 0.5)
      for (const z of rows) {
        if (f === 's') rectPanel(win, [x0 + s, y0, z], AX, S, 1.1, 1.7)
        else if (f === 'n') rectPanel(win, [x0 + s, y1, z], AX, N, 1.1, 1.7)
        else rectPanel(win, [x1, y0 + s, z], [0, 1, 0], E, 1.1, 1.7)
      }
    }
  }
}

// ---------------------------------------------------------------- the palace
palace(-24.4, -13.9, 14.1, 6.2, 13.5, 3.5, [1.6, 5.6, 9.6], ['s', 'n'])
palace(14.0, -10.5, 22.7, 4.8, 21.5, 2.6, [1.6, 5.6, 9.6, 13.4, 17.2], ['s'])
palace(20.9, -10.5, 31.1, 11.7, 17.5, 3.0, [1.6, 5.6, 9.6, 13.4], ['s', 'n'])
block(white, 15.7, 4.8, 0, 20.9, 12.0, 20, null)
wedge(roof, 15.3, 4.8, 20.9, 12.4, 22, 20, 'y0')
// the porch on the square and the small stair towers on the north
block(white, 3.0, -17.6, 0, 14.1, -13.9, 4.0, roof)
for (const x of [5.0, 9.0, 12.4]) archPanel(roof, [x, -17.6, 0.3], AX, S, 2.2, 2.4, 6)
block(white, -7.8, 5.6, 0, -5.3, 9.3, 7.0, roof)
block(white, 5.6, 5.2, 0, 8.4, 7.5, 7.0, roof)
block(white, 15.8, 11.9, 0, 19.2, 13.4, 7.0, roof)

// ---------------------------------------------------------------- the west wings, plain
const NW: XY[] = [[-46.7, 19.8], [-33.8, 10.1], [-30.0, 0.0], [-24.4, -0.5], [-24.4, 6.2], [-15.1, 5.9], [-14.6, 12.7], [-38.6, 30.5]]
const SW: XY[] = [[-30.0, 0.0], [-29.7, -6.8], [-40.7, -15.2], [-42.9, -23.8], [-42.2, -25.9], [-36.5, -27.1], [-34.6, -19.0], [-28.2, -13.8], [-24.4, -13.9], [-24.4, -0.5]]
prism(white, NW, 0, 11, roof)
prism(white, SW, 0, 12.3, roof)

// ---------------------------------------------------------------- the Church of the Twelve Apostles
const CX0 = 31.1, CX1 = 48.8, CY0 = -10.0, CY1 = 6.0
const xb = [CX0, 37.1, 42.6, CX1], yb = [CY0, -4.2, 0.35, CY1]
zakomaraBlock({ wall: white, roof, edge: gold, xb, yb, z0: 0, zs: 17.3, rise: (w) => w / 2, n: 6, overhang: 0.35 })
block(trim, CX0, CY0 - 0.3, 6.1, CX1 + 0.3, CY0, 6.6, trim)
block(trim, CX0, CY0 - 0.35, 16.7, CX1 + 0.35, CY0, 17.3, trim)
// the gate arches through its ground storey, and two tiers of windows
for (const x of [36.4, 43.4]) archPanel(roof, [x, CY0, 0], AX, S, 4.0, 2.4, 10)
for (let i = 0; i < 3; i++) {
  const x = (xb[i] + xb[i + 1]) / 2
  for (const d of [-1.4, 1.4]) {
    archPanel(win, [x + d, CY0, 8.0], AX, S, 0.9, 1.4, 6)
    archPanel(win, [x + d, CY0, 12.2], AX, S, 0.9, 1.6, 6)
  }
  archPanel(win, [CX1, (yb[i] + yb[i + 1]) / 2, 12.2], [0, 1, 0], E, 0.9, 1.6, 6)
}
apse({ wall: white, roof, win, c: [CX1, 2.5], rx: 2.2, ry: 2.3, z0: 6.5, z1: 14.6, roofRise: 2.0, sill: 9.5, winW: 0.8, winH: 1.6 })
block(white, CX1, 0.2, 0, 51.0, 4.8, 6.5, roof)
wedge(white, CX0, CY1, 44.8, 9.1, 13, 11.2, 'y0', roof)
for (const x of [34, 38, 42]) archPanel(win, [x, 9.1, 7.6], AX, N, 1.2, 1.6, 6)

// drums and silver onions
const DR: Array<{ c: [number, number]; r: number; z1: number; R: number; H: number; spike: number; L: number; n: number }> = [
  { c: [39.9, -1.85], r: 2.7, z1: 27.6, R: 3.0, H: 3.6, spike: 2.2, L: 2.0, n: 16 },
  ...([[34.2, 2.05], [45.6, 1.9], [45.5, -6.15], [34.1, -5.9]] as [number, number][]).map((c) => ({ c, r: 2.0, z1: 26.0, R: 2.3, H: 2.6, spike: 2.0, L: 1.6, n: 14 })),
]
for (const d of DR) {
  drum({ wall: white, win, trim, c: d.c, z0: 18.5, z1: d.z1, r: d.r, n: d.n, windows: d.n === 16 ? 8 : 7, winW: 0.6, winH: 2.6, sill: d.z1 - 4.0, cornice: 0.25 })
  drum({ wall: trim, c: d.c, z0: d.z1 - 5.0, z1: d.z1 - 4.65, r: d.r + 0.15, n: d.n, cornice: 0 })
  const t = dome(silver, d.c, d.z1, d.R, d.H, 'bulb', d.n, d.spike, d.r + 0.2, d.n < 16)
  cross(gold, d.c, t - 0.1, d.L, 'y', 0.2)
}

await finishModel('moscow-patriarchs-palace', "Patriarch's Palace", [
  { part: white, material: { ...finish('patriarch-white', 0xf3ede4), floodlight: floodWalls } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
  { part: roof, material: finish('patriarch-roof', 0x7c8a84) },
  { part: silver, material: { ...finish('kremlin-silver', 0xc3cad0), floodlight: floodDomes } },
  { part: gold, material: { ...finish('kremlin-gold', 0xdcb25e), floodlight: floodDomes } },
  { part: win, material: PALETTE.window },
], { bearing: 335.5, anchor: [55.7512276, 37.6168377], replaces: ['relation/1359248', 'relation/1359249'] })
