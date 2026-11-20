/**
 * West Side Market (Hubbell & Benes, 1912), West 25th Street and Lorain
 * Avenue, Ohio City, Cleveland: the market hall, its clock tower, the
 * boiler-house chimney and the L-shaped produce arcade. Procedural, CC0-1.0.
 * bun generators/cle-west-side-market.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned to bearing 329.2: +x runs along the
 * hall's long axis to the east-north-east (true 59.2), the W. 25th Street
 * front with the great arched window faces -x, Lorain Avenue is the -y
 * (south-east) side, the produce arcade lies along +y and wraps round the
 * +x end. The clock tower stands at the -x/-y corner, on W. 25th and
 * Lorain. Origin at the area centroid of OSM way/93599980 (-81.7030174,
 * 41.4846501). z = 0 is the ground at the W. 25th front, the lowest under
 * the footprint; the ground rises ~0.7 m to the east end (lidar and
 * Mapterhorn agree). Elevation 0.
 *
 * Identity, in order: the 137 ft buff-brick clock tower with its grey stone
 * base, clock stage and green copper dome and spire; the two end fronts,
 * each a great segmental-arched window under a curved stone parapet between
 * stone-capped piers; the long red-tile barrel vault with the green ridge
 * monitor over the two-storey brick aisles; the tall brick chimney at the
 * east end; the low brick produce arcade.
 *
 * Evidence:
 *  - plan: OSM way/93599980 (hall outline, building=retail, height 44',
 *    wikidata Q2493259), parts way/1534283512 (tower), 1535853542 (aisles),
 *    1535853543 and 1535853544 (vault and monitor), way/100764205 (Produce
 *    Arcade), way/1534284011 (chimney, man_made=chimney). Turned into this
 *    frame: hall x -37.6..38, y -18.9..19.1; tower 7.7 m square.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019
 *    flight), 0.5 m grid, read with tools/lidar_frame.py at bearing 329.2,
 *    above the ground at the W. 25th front: aisle roofs 8.3-8.8; the
 *    clerestory walls at y +-10.5 to ~12.3; the vault 12.3 -> 14.8 at
 *    y +-4; the green monitor (y +-3.5) 16.0-16.5; end-front piers 13.4,
 *    curved parapet crown 16.4; tower: shaft cornice 32.6, clock stage to
 *    38.9, dome ~42.1, the highest cell 44.6 (the spire's tip escapes the
 *    grid; drawn to 47.5 from the photos); chimney top 31.7 (OSM's 22 is
 *    wrong; lidar followed), ~3 m across; arcade eaves ~3.8, ridge ~4.7.
 *    The hall's east front stands at x ~36.5 in the lidar (OSM 38).
 *  - published: completed 1912, Hubbell & Benes; tower 137 ft (41.8 m)
 *    (Wikipedia "West Side Market"; National Register 1973). Lidar puts
 *    the dome top at 42 m, consistent.
 *  - estimated from the photos scaled to the lidar: the arched window
 *    (12.4 m wide, sill 4.4, springing 8.6, crown 12.0), its stone
 *    surround, the pier windows, the doors, the aisle window rhythm
 *    (5 m bays, two storeys), string courses (base 1.2, belt 4.0, cornice
 *    7.2-7.9), the tower's stone base (to 8.4), clock faces (2 m), the
 *    upper stage and dome profile, the arcade's glazed bays.
 *  - colour: buff-orange brick (all photos), grey granite dressings, red
 *    tile vault and green copper monitor (NAIP), green copper dome, green
 *    painted window frames and doors.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market_2023.jpg
 *    Cards84664, CC BY-SA 4.0 (W. 25th front and the NW side from the west)
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market,_Ohio_City,_Cleveland,_OH_(28569077637).jpg
 *    Warren LeMay, CC0 (W. 25th front square on, tower base)
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market,_Ohio_City,_Cleveland,_OH_(28569071847).jpg
 *    Warren LeMay, CC0 (the aisle's corner, cornices)
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market,_Ohio_City,_Cleveland,_OH_(28569071037).jpg
 *    Warren LeMay, CC0 (east front and chimney from the north-east)
 *  - https://commons.wikimedia.org/wiki/File:Cleveland_West_Side_Market_(8248366932).jpg
 *    Erik Drost, CC BY 2.0 (from the west)
 *  - https://commons.wikimedia.org/wiki/File:Cleveland_West_Side_Market_(7382154800).jpg
 *    Erik Drost, CC BY 2.0 (Lorain side and east front from the south-east)
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market,_Cleveland_-_Jan_27,_2024.jpg
 *    Erik Drost, CC BY 2.0 (night: floodlit tower and lit clock stage)
 *  - https://commons.wikimedia.org/wiki/File:Cleveland_West_Side_-_Market.jpg
 *    Mike Sharp, CC BY-SA 4.0 (along Lorain from the east)
 *  - https://commons.wikimedia.org/wiki/File:West_Side_Market_Cleveland_05.jpg
 *    Ɱ, CC BY-SA 4.0 (inside the produce arcade: brick piers, glazed bays)
 *  - USGS NAIP orthophoto (public domain): roof colours and plan.
 * No look-only sources. No commercial imagery.
 *
 * Left out: the diaper brick pattern of the tower shaft (corner piers
 * frame its panels instead), the eagle and sculpture on the parapets, the
 * "WEST SIDE MARKET" letters on the Lorain parapet, the window glazing
 * bars beyond five bold mullions, canopies.
 * Doubts: Mike Sharp's older photo shows a square brick pavilion with a
 * glazed cupola at the arcade's Lorain end; neither the 2019 lidar (5 m
 * there) nor the NAIP shows it, so it is not drawn. The arcade's walls are
 * from one interior photo and the lidar; its outer face is not in any photo
 * used. The north-west side of the hall is only seen obliquely.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, panel, relief, onWall, lathe, save } from './chi-field-museum'
import { band, wallsSplit, poly } from './pit-allegheny-county-courthouse'

/** A profile in the (y, z) plane, counter-clockwise seen from +x, extruded from x0 to x1; `side(i)` picks the part for edge i. */
function extrudeX(prof: [number, number][], x0: number, x1: number, side: (i: number) => Part, ends: Part | null) {
  const n = prof.length
  for (let i = 0; i < n; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[(i + 1) % n]
    side(i).quad([x0, ya, za], [x0, yb, zb], [x1, yb, zb], [x1, ya, za])
  }
  if (!ends) return
  // the end faces may be concave along the top: fan from the bottom middle
  const ctr = [(prof[0][0] + prof[1][0]) / 2, prof[0][1]] as [number, number]
  for (let i = 0; i < n; i++) {
    const a = prof[i], b = prof[(i + 1) % n]
    if (i === 0) continue
    poly(ends, [[x1, ctr[0], ctr[1]], [x1, a[0], a[1]], [x1, b[0], b[1]]], [1, 0, 0])
    poly(ends, [[x0, ctr[0], ctr[1]], [x0, b[0], b[1]], [x0, a[0], a[1]]], [-1, 0, 0])
  }
}

/** z of a segmental arch, half-width w, springing zs, rise h, at offset d from its centre. */
const segZ = (w: number, zs: number, h: number, d: number) => {
  const R = (w * w + h * h) / (2 * h)
  return zs + h - R + Math.sqrt(Math.max(0, R * R - d * d))
}
/** A flat segmental-arched panel on wall a→b centred at s, half-width w, sill z0, springing zs, rise h. */
function segArch(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, h: number, out = 0.05, seg = 8) {
  const { P, n } = onWall(a, b)
  const pts: V3[] = [P(s - w, z0, out), P(s + w, z0, out)]
  for (let i = 0; i <= seg; i++) { const d = w - (2 * w * i) / seg; pts.push(P(s + d, segZ(w, zs, h, d), out)) }
  poly(p, pts, [n[0], n[1], 0])
}

function build() {
  const brick = new Part(), stone = new Part(), tile = new Part(), copper = new Part(), win = new Part(), clock = new Part()

  // ------------------------------------------------------------ the hall
  const X0 = -37.6, X1 = 36.8, YS = -18.9, YN = 19.1
  const hall = rect(X0, YS, X1, YN)
  wallsSplit(brick, hall, 0, 8.6, 5)
  band(stone, hall, inset(hall, -0.15), 0, 1.2, 0.1)
  band(stone, hall, inset(hall, -0.12), 3.9, 4.4, 0.1)
  band(stone, hall, inset(hall, -0.45), 7.2, 7.9, 0.3)
  band(stone, hall, inset(hall, -0.1), 8.5, 8.75, 0.05)
  cap(stone, inset(hall, 0.3), 8.4)
  walls(brick, inset(hall, 0.3).reverse(), 8.4, 8.75)

  // The aisle windows: two storeys per 5 m bay along both long sides.
  const sides: [XY, XY, number][] = [[[X0, YS], [X1, YS], -31.0], [[X1, YN], [X0, YN], X0 + 1.5]]
  for (const [a, b, xFrom] of sides) {
    const { L } = onWall(a, b)
    for (let k = 0; k < 15; k++) {
      const x = X0 + 2.6 + k * 5.0
      if (x < xFrom || x > X1 - 2.0) continue
      const s = a[0] < b[0] ? x - X0 : X1 - x
      if (s < 1.5 || s > L - 1.5) continue
      const g = (x - X0) / (X1 - X0) * 0.7 // the ground rises to the east
      panel(win, a, b, s - 1.4, s + 1.4, g + 1.5, 3.6, 0.07)
      panel(win, a, b, s - 1.4, s + 1.4, 4.75, 7.0, 0.07)
    }
  }

  // The nave: clerestory walls, the red tile barrel vault, the green monitor.
  const vz = (y: number) => -5.246 + Math.sqrt(20.45 * 20.45 - y * y)
  const mz = (y: number) => 15.8 + 0.6 * (1 - (y / 3.5) ** 2)
  const vy = [10.5, 8.2, 5.9, 3.5]
  const prof: [number, number][] = [[-10.5, 8.4], [10.5, 8.4]]
  for (const y of vy) prof.push([y, vz(y)])
  for (const y of [3.5, 1.75, 0, -1.75, -3.5]) prof.push([y, mz(y)])
  for (const y of [...vy].reverse()) prof.push([-y, vz(y)])
  // edges: 0 floor, 1 north clerestory, 2-4 vault, 5 monitor side, 6-9 monitor top, 10 monitor side, 11-13 vault, 14 south clerestory
  const nave = (i: number) => (i === 0 ? stone : i === 1 || i === 14 ? brick : i === 5 || i === 10 ? win : i >= 6 && i <= 9 ? copper : tile)
  // the clerestory wall runs straight up from the roof to the vault's foot
  prof.splice(2, 0, [10.5, 12.3])
  prof.splice(prof.length, 0, [-10.5, 12.3])
  const nave2 = (i: number) => (i === 0 ? stone : i === 1 || i === 15 ? brick : i === 6 || i === 11 ? win : i >= 7 && i <= 10 ? copper : tile)
  void nave
  extrudeX(prof.filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]), X0 + 0.5, X1 - 0.5, nave2, null)
  // clerestory windows
  for (const [a, b] of [[[X0, -10.5], [X1, -10.5]], [[X1, 10.5], [X0, 10.5]]] as [XY, XY][]) {
    for (let k = 0; k < 14; k++) {
      const s = 3.0 + k * 5.0
      if (s + 2 > X1 - X0 - 2.0) continue
      panel(win, a, b, s, s + 3.6, 9.1, 11.6, 0.05)
    }
  }

  // ------------------------------------------------------------ the end fronts
  const PIER = 7.8, FW = 11.5, PTOP = 13.4, CROWN = 16.4
  const front = (east: boolean) => {
    const g = east ? 0.5 : 0 // ground at the east front
    const xo = east ? X1 + 0.6 : X0 - 0.6, xi = east ? X1 - 1.6 : X0 + 1.6
    const R = (PIER * PIER + (CROWN - PTOP) ** 2) / (2 * (CROWN - PTOP))
    const top = (y: number) => CROWN - R + Math.sqrt(R * R - y * y) + g
    const prof: [number, number][] = [[-FW, 0], [FW, 0], [FW, PTOP + g], [PIER, PTOP + g]]
    for (let i = 1; i < 10; i++) { const y = PIER - (2 * PIER * i) / 10; prof.push([y, top(y)]) }
    prof.push([-PIER, PTOP + g], [-FW, PTOP + g])
    const nTop = prof.length
    extrudeX(prof, Math.min(xo, xi), Math.max(xo, xi), (i) => (i >= 3 && i <= nTop - 2 ? stone : brick), brick)
    // the facade face, as a wall a→b facing out
    const a: XY = east ? [xo, -FW] : [xo, FW], b: XY = east ? [xo, FW] : [xo, -FW]
    const sOf = (y: number) => (east ? y + FW : FW - y)
    const L = 2 * FW
    // stone plinth, the parapet's coping band following the curve, pier cornices and caps
    panel(stone, a, b, 0, L, 0, g + 1.2, 0.08)
    const { P, n } = onWall(a, b)
    for (let i = 0; i < 12; i++) {
      const y0 = -PIER + (2 * PIER * i) / 12, y1 = -PIER + (2 * PIER * (i + 1)) / 12
      poly(stone, [P(sOf(y0), top(y0) - 1.3, 0.06), P(sOf(y1), top(y1) - 1.3, 0.06), P(sOf(y1), top(y1), 0.06), P(sOf(y0), top(y0), 0.06)], [n[0], n[1], 0])
    }
    for (const sg of [-1, 1]) {
      const ya = sg * PIER, yb = sg * FW
      const s0 = Math.min(sOf(ya), sOf(yb)), s1 = Math.max(sOf(ya), sOf(yb))
      relief(stone, a, b, s0 - 0.2, s1 + 0.2, PTOP + g - 1.0, PTOP + g, 0.3)
      const yc = sg * (PIER + FW) / 2
      block(stone, stone, rect(Math.min(xo, xi) + 0.3, yc - 1.2, Math.max(xo, xi) - 0.3, yc + 1.2), PTOP + g, PTOP + g + 0.9, 0.15)
      // the pier's stone-framed windows
      const sc = sOf(yc)
      panel(stone, a, b, sc - 0.8, sc + 0.8, g + 4.4, g + 11.8, 0.05)
      panel(win, a, b, sc - 0.5, sc + 0.5, g + 5.0, g + 7.4, 0.09)
      panel(win, a, b, sc - 0.5, sc + 0.5, g + 8.6, g + 11.3, 0.09)
    }
    // the great window: stone surround, glazing, five bold green mullions and a transom
    segArch(stone, a, b, FW, 7.0, g + 3.9, g + 8.3, 4.1, 0.06)
    segArch(win, a, b, FW, 6.2, g + 4.4, g + 8.6, 3.4, 0.1)
    for (const d of [-4.4, -2.2, 0, 2.2, 4.4]) panel(copper, a, b, FW + d - 0.1, FW + d + 0.1, g + 4.4, segZ(6.2, g + 8.6, 3.4, d) - 0.05, 0.13)
    panel(copper, a, b, FW - 6.2, FW + 6.2, g + 7.4, g + 7.6, 0.13)
    // doors under the window, and the small windows between them
    for (const d of [-4.3, 4.3]) {
      panel(stone, a, b, FW + d - 1.3, FW + d + 1.3, g, g + 3.6, 0.1)
      panel(copper, a, b, FW + d - 1.0, FW + d + 1.0, g, g + 3.2, 0.14)
    }
    for (const d of [-1.8, -0.6, 0.6, 1.8]) panel(win, a, b, FW + d - 0.25, FW + d + 0.25, g + 2.0, g + 3.2, 0.1)
    // the aisle ends either side: two storeys of windows
    for (const [ya, yb] of [[FW, YN], [YS, -FW]] as [number, number][]) {
      if (!east && ya < 0) continue // the tower stands there
      const w: [XY, XY] = east ? [[X1, ya], [X1, yb]] : [[X0, yb], [X0, ya]]
      const Lw = yb - ya
      panel(win, w[0], w[1], 1.6, Lw - 1.6, g + 1.5, 3.6, 0.07)
      panel(win, w[0], w[1], 1.3, Lw - 1.3, 4.75, 7.0, 0.07)
    }
  }
  front(false)
  front(true)

  // ------------------------------------------------------------ the clock tower
  const TX = -35.75, TY = -14.95
  block(stone, null, rect(TX - 3.85, TY - 3.85, TX + 3.85, TY + 3.85), 0, 7.6, 0)
  const tb = rect(TX - 3.85, TY - 3.85, TX + 3.85, TY + 3.85)
  band(stone, tb, inset(tb, -0.3), 7.6, 8.4, 0.2)
  cap(stone, inset(tb, -0.3), 8.4)
  // the base's door on W. 25th and its window on Lorain
  panel(copper, [TX - 3.85, TY + 3.85], [TX - 3.85, TY - 3.85], 2.9, 4.9, 0, 2.9, 0.06)
  panel(win, [TX - 3.85, TY - 3.85], [TX + 3.85, TY - 3.85], 2.4, 5.4, 4.6, 6.8, 0.06)
  panel(win, [TX - 3.85, TY + 3.85], [TX - 3.85, TY - 3.85], 2.4, 5.4, 4.6, 6.8, 0.06)
  // brick shaft, slightly battered, with corner piers framing each face
  const sq = (h: number, z: number): XY[] => rect(TX - h, TY - h, TX + h, TY + h)
  walls(brick, sq(3.45, 8.4), 8.4, 31.8, sq(3.25, 31.8))
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const r0 = (h: number, w: number): XY[] => {
      const cx = TX + sx * (h - w / 2), cy = TY + sy * (h - w / 2)
      return rect(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2)
    }
    walls(brick, r0(3.7, 1.3), 8.4, 31.8, r0(3.45, 1.2))
  }
  const tq = sq(3.45, 0)
  for (let i = 0; i < 4; i++) {
    const a = tq[i], b = tq[(i + 1) % 4]
    for (const d of [-0.75, 0.75]) panel(win, a, b, 3.45 + d - 0.45, 3.45 + d + 0.45, 9.0, 10.3, 0.27)
    panel(win, a, b, 3.45 - 0.3, 3.45 + 0.3, 19.5, 21.1, 0.22)
    panel(win, a, b, 3.45 - 0.3, 3.45 + 0.3, 27.0, 28.6, 0.2)
  }
  // cornice, the stone clock stage with its four faces, cornice, octagonal drum
  const c0 = sq(3.4, 0)
  band(stone, c0, inset(c0, -0.45), 31.8, 32.8, 0.3)
  cap(stone, inset(c0, -0.45), 32.8)
  block(stone, null, sq(3.1, 0), 32.8, 37.6, 0)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TX + sx * 2.85, cy = TY + sy * 2.85
    block(stone, stone, rect(cx - 0.45, cy - 0.45, cx + 0.45, cy + 0.45), 32.8, 37.6, 0)
  }
  const cs = sq(3.1, 0)
  for (let i = 0; i < 4; i++) {
    const a = cs[i], b = cs[(i + 1) % 4]
    const { P, n } = onWall(a, b)
    const ringPts = (r: number, out: number) => Array.from({ length: 14 }, (_, k) => P(3.1 + r * Math.cos(k * 2 * Math.PI / 14), 35.1 + r * Math.sin(k * 2 * Math.PI / 14), out))
    poly(win, ringPts(1.25, 0.06), [n[0], n[1], 0])
    poly(clock, ringPts(1.0, 0.1), [n[0], n[1], 0])
  }
  const c1 = sq(3.1, 0)
  band(stone, c1, inset(c1, -0.35), 37.6, 38.3, 0.2)
  cap(stone, inset(c1, -0.35), 38.3)
  lathe(stone, TX, TY, [[2.6, 38.3], [2.6, 39.5], [2.85, 39.5], [2.85, 39.75]], 8, Math.PI / 8)
  // the green copper dome, its lantern and spire
  lathe(copper, TX, TY, [[2.75, 39.75], [2.7, 40.3], [2.45, 41.0], [1.95, 41.6], [1.2, 42.0], [0.55, 42.15]], 12)
  lathe(copper, TX, TY, [[0.55, 42.15], [0.5, 43.0], [0.6, 43.1], [0.18, 43.3], [0.0, 47.5]], 8)

  // ------------------------------------------------------------ the chimney
  lathe(brick, 31.0, 10.5, [[1.95, 8.4], [1.5, 30.2]], 12)
  lathe(stone, 31.0, 10.5, [[1.5, 30.2], [1.7, 30.5], [1.7, 31.7], [1.3, 31.7], [1.2, 31.0]], 12)

  // ------------------------------------------------------------ the produce arcade
  const arc: XY[] = [[-34.5, 26.0], [56.9, 26.0], [56.9, -13.4], [59.6, -13.4], [59.6, -19.3], [65.2, -19.3], [65.2, -13.4], [69.5, -13.4],
    [69.5, 35.2], [61.2, 35.2], [61.2, 38.4], [-34.5, 38.4], [-34.5, 35.8], [-39.2, 35.8], [-39.2, 30.0], [-34.5, 30.0]]
  wallsSplit(brick, arc, 0, 3.8, 5)
  band(stone, arc, inset(arc, -0.12), 3.8, 4.3, 0.1)
  cap(stone, arc, 4.3)
  for (let i = 0; i < arc.length; i++) {
    const a = arc[i], b = arc[(i + 1) % arc.length]
    const { L } = onWall(a, b)
    if (L < 9) continue
    const n = Math.floor((L - 1.0) / 4.6)
    const s0 = (L - n * 4.6) / 2
    for (let k = 0; k < n; k++) panel(win, a, b, s0 + k * 4.6 + 0.6, s0 + k * 4.6 + 4.0, 1.0, 3.3, 0.06)
  }

  // Night: the tower is floodlit, the shaft warmest, its clock stage white.
  const towerLit = (p: V3, nn: V3) => (Math.abs(p[0] - TX) < 4.4 && Math.abs(p[1] - TY) < 4.4 && p[2] > 0.5 ? (nn[2] > 0.7 ? 0.3 : 1) : 0)
  return [
    { part: brick, material: { ...finish('cle-wsm-brick', 0xcf9c6c), floodlight: towerLit } },
    { part: stone, material: { ...finish('cle-wsm-granite', 0xd4cfc4), floodlight: towerLit } },
    { part: tile, material: finish('cle-wsm-tile', 0xb5654c) },
    { part: copper, material: finish('cle-wsm-copper', 0x7fa894) },
    { part: win, material: PALETTE.window },
    { part: clock, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('cle-west-side-market', 'West Side Market', [41.4846501, -81.7030174], 329.2, build(), 6500)
