/**
 * PNC Tower (Union Central Life / Central Trust Tower, 4th & Vine Tower),
 * Cincinnati, 1913, Cass Gilbert with Garber & Woodward — original
 * procedural geometry, CC0-1.0.
 * bun generators/cin-pnc-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/46126970,
 * -84.51290, 39.09959. The street grid runs at 348.9°, so the catalog
 * bearing is 348.9: Fourth Street is the north front (y = 25), Vine Street
 * the east (x = 18.9).
 *
 * Identity, in order: the cream terracotta shaft with its heavy projecting
 * cornice; the temple stage of tall engaged columns above it; the steep,
 * pale-grey stepped pyramid modelled on the Mausoleum of Halicarnassus;
 * the small green copper lantern on the apex; the lower south wing on
 * Third Street side. At night the crown is floodlit and the lantern glows.
 *
 * Evidence:
 *  - plan: OSM outline way/46126970 and relation/3622286 (parts
 *    way/271098464, 271098466, 272241497, 1457161598, 1457162438,
 *    1457162962, 1457163543, 1457164804, 1457642386).
 *  - heights: measured, USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio
 *    statewide phase 3, ~2021 flight), 0.5 m grid read in the model frame,
 *    above the lowest ground under the footprint (the south side; Fourth
 *    Street is ~3 m higher, so the north front sinks into the slope).
 *    Shaft cornice 96 (OSM 92); temple stage to 115.5 with its cornice to
 *    117, set in 1.6 m behind the shaft's cornice; pyramid from 117 to 139
 *    (eaves 24 × 18 m, top 8 × 6 m); lantern to 150. Published 495 ft
 *    (151 m) to the top (Wikipedia, CTBUH). South wing 78 (OSM 72–74);
 *    west strip 20.
 *  - colour: cream terracotta and granite (stone); the pyramid's pale grey
 *    stone sampled from EEJCC's photo (#c9cbc8 sun) as a finish; the
 *    lantern green copper (patina).
 *  - windows: punched in pairs; drawn as panels per pair over three
 *    storeys (~4.2 m a floor, 23 floors to the cornice). Temple stage: a
 *    tall dark recess between each pair of columns, 8 on the long faces
 *    and 6 on the short (counted on EEJCC's and the 2.5 photo).
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 *  - PNC_Tower_-_Cincinnati,_Ohio.jpg, EEJCC, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:PNC_Tower_-_Cincinnati,_Ohio.jpg
 *  - Pnc_tower.jpg, original uploader on en.wikipedia, CC BY 2.5 (from the
 *    Carew Tower deck, looking south over the crown)
 *    https://commons.wikimedia.org/wiki/File:Pnc_tower.jpg
 *  - PNC_Tower.jpg, Doug Kerr, CC BY-SA 2.0 (skyline from the south)
 *    https://commons.wikimedia.org/wiki/File:PNC_Tower.jpg
 *  - Carew_Tower_and_Union_Central_Tower,_Cincinnati,_OH_(46777811591).jpg,
 *    Warren LeMay, CC0 https://commons.wikimedia.org/wiki/File:Carew_Tower_and_Union_Central_Tower,_Cincinnati,_OH_(46777811591).jpg
 *  - Carew_Tower_at_Race_-_Out,_Cincinnati,_United_States_(Unsplash).jpg,
 *    Jordan Andrews, CC0 (straight down on the temple stage from Carew)
 *    https://commons.wikimedia.org/wiki/File:Carew_Tower_at_Race_-_Out,_Cincinnati,_United_States_(Unsplash).jpg
 * No commercial imagery.
 *
 * Doubts: the pyramid's fine steps are drawn as a smooth slope with three
 * shallow ledges (they read smooth in every photo at distance). The street
 * level and entrances are not in any photo used: no doors drawn. The PNC
 * logos on the pyramid are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, panel, rect, rows, save, spire, walls, type XY } from './chi-aon-center'
import { rectBays } from './chi-board-of-trade'

function tier(wall: Part, lip: Part, roof: Part, r: XY[], z0: number, z1: number, lipH = 0.6) {
  walls(wall, r, z0, z1 - lipH)
  block(lip, roof, r, z1 - lipH, z1, 0.3)
}

/** A projecting cornice slab round rectangle r, `out` beyond it. */
function cornice(trim: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, out: number) {
  block(trim, roof, rect(x0 - out, y0 - out, x1 + out, y1 + out), z0, z1, 0.3)
}

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), pyr = new Part(), copper = new Part()

  // West strip, 20 m.
  {
    const r = rect(-23.9, -21.1, -15.4, 25)
    tier(stone, trim, roof, r, 0, 20)
    rectBays(win, r, [[4, 8.5], [10, 17.5]], { bay: 2.4, gap: 1.6, skip: [1] })
  }
  // South wing, 78 m, with the light-well notch at its north-west corner.
  {
    const r: XY[] = [[-15.4, -21.1], [18.7, -21.1], [18.7, 0.7], [-11.6, 0.7], [-11.6, -9.7], [-15.4, -9.7]]
    walls(stone, r, 0, 76.6)
    cornice(trim, roof, -15.4, -21.1, 18.7, 0.7, 76.6, 78, 0)
    cap(roof, r, 78)
    block(stone, roof, rect(-15.4, -9.7, -11.6, 0.7), 0, 20, 0.3)
    const g: [number, number][] = [[3.5, 15], ...rows(17, 75, 5, 1.6)]
    rectBays(win, rect(-15.4, -21.1, 18.7, 0.7), g, { bay: 2.3, gap: 1.5, end: 1.6, skip: [2, 3] })
    // West face above the 20 m strip, and the notch's faces.
    rectBays(win, rect(-15.4, -21.1, 18.7, 0.7), rows(22, 75, 4, 1.6), { bay: 2.3, gap: 1.5, end: 1.6, skip: [0, 1, 2] })
  }

  // The shaft: 34 × 24 m to the main cornice at 96.
  const X0 = -15.4, X1 = 18.6, Y0 = 0.7, Y1 = 24.7
  const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2
  walls(stone, rect(X0, Y0, X1, Y1), 0, 94.6)
  // A belt course over the base storeys, and the heavy main cornice.
  cornice(trim, roof, X0, Y0, X1, Y1, 19.5, 20.5, 0.35)
  cornice(trim, roof, X0, Y0, X1, Y1, 94.6, 96.6, 1.1)
  const shaftRows: [number, number][] = [[3.5, 17.5], ...rows(22, 93, 6, 1.7)]
  rectBays(win, rect(X0, Y0, X1, Y1), shaftRows, { bay: 2.3, gap: 1.5, end: 2.0, skip: [0] })
  // The south face shows above the wing.
  rectBays(win, rect(X0, Y0, X1, Y1), rows(80, 93, 1, 0), { bay: 2.3, gap: 1.5, end: 2.0, skip: [1, 2, 3] })

  // The temple stage: columns as the wall between tall dark recesses.
  const T = rect(CX - 15, CY - 10.6, CX + 15, CY + 10.6)
  walls(stone, T, 96.6, 113.8)
  cornice(trim, roof, CX - 15, CY - 10.6, CX + 15, CY + 10.6, 113.8, 117, 0.6)
  for (let i = 0; i < 4; i++) {
    const a = T[i], b = T[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = L > 25 ? 8 : 6
    const end = 2.4, pitch = (L - 2 * end) / n, w = pitch * 0.55
    for (let k = 0; k < n; k++) {
      const c = end + (k + 0.5) * pitch
      panel(win, a, b, c - w / 2, c + w / 2, 98, 112.8, 0.05)
    }
  }

  // The pyramid: steep, pale grey, with two shallow ledges, then the lantern.
  const ring = (hx: number, hy: number, z: number): V3[] => [[CX - hx, CY - hy, z], [CX + hx, CY - hy, z], [CX + hx, CY + hy, z], [CX - hx, CY + hy, z]]
  const prof: [number, number, number][] = [[13.2, 9.8, 117], [9.6, 7.0, 124.5], [9.2, 6.7, 124.5], [6.3, 4.6, 131.5], [5.9, 4.3, 131.5], [3.2, 2.6, 139]]
  // Faces between successive rings (ledges are flat rings).
  pyr.loft(prof.map(([hx, hy, z]) => ring(hx, hy, z)))
  // Lantern: a plinth, an open drum of eight piers, a cap.
  const L0 = 139
  block(copper, copper, rect(CX - 3.2, CY - 2.6, CX + 3.2, CY + 2.6), L0 - 0.01, L0 + 1.2, 0.2)
  // Four corner piers and a dark open centre.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = CX + sx * 2.1, py = CY + sy * 1.7
    block(copper, null, rect(px - 0.55, py - 0.55, px + 0.55, py + 0.55), L0 + 1.2, L0 + 6.2, 0)
  }
  block(win, null, rect(CX - 1.6, CY - 1.2, CX + 1.6, CY + 1.2), L0 + 1.2, L0 + 6.2, 0)
  block(copper, copper, rect(CX - 2.9, CY - 2.5, CX + 2.9, CY + 2.5), L0 + 6.2, L0 + 7.2, 0.25)
  spire(copper, rect(CX - 2.4, CY - 2.0, CX + 2.4, CY + 2.0), L0 + 7.2, [CX, CY, 150])

  // Crown floodlit: the temple stage and the pyramid.
  const flood = (p: V3, n: V3) => (p[2] > 94 ? (n[2] > 0.8 ? 0.3 : 0.6 + 0.4 * Math.min(1, (p[2] - 94) / 45)) : 0)
  return [
    { part: stone, material: { ...PALETTE.stone, floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: pyr, material: { ...finish('pnc-pyramid', 0xd2d3cf), floodlight: flood } },
    { part: copper, material: PALETTE.patina },
  ]
}

if (import.meta.main) await save('cin-pnc-tower', 'PNC Tower', [39.09959, -84.5129], 348.9, build(), 5000)
