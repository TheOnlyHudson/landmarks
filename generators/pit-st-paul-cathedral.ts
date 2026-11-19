/**
 * Cathedral of Saint Paul (Egan & Prindeville, 1903-1906), Fifth Avenue at
 * North Craig Street, Oakland, Pittsburgh — original procedural geometry,
 * CC0-1.0. bun generators/pit-st-paul-cathedral.ts
 *
 * Imports the Gothic helpers from pit-heinz-chapel.ts and the
 * Richardsonian kit's `poly`/`band`/`wallsSplit` from
 * pit-allegheny-county-courthouse.ts; both must be merged first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/104431158, -79.9498070 40.4473720. The nave runs at 355.5°,
 * so the catalog bearing is 355.5: model -y is the twin-spired front on
 * Fifth Avenue (south), +y the apse (north), the transepts point east (+x,
 * toward Craig Street) and west (-x).
 *
 * Identity, in order: the two tall octagonal stone spires over square
 * buttressed towers on the Fifth Avenue front, each spire ringed at its
 * foot by gablets and corner pinnacles; the central gable between them
 * with its great traceried window and three gabled portals; the long,
 * steep slate nave roof crossed by the transept roof, the transept ends
 * gabled between pairs of small pinnacled towers; the stepped aisles; the
 * polygonal apse; pale grey limestone.
 *
 * Evidence:
 *  - plan: OSM outline way/104431158, turned into this frame: front at y
 *    -34.1, towers 8.5 m square (x -18.3..-9.8 and 10.8..19.3); aisles out
 *    to x -17 / 17.8 with a chapel strip to -22.5 on the west; transept x
 *    -22.5..22.7, y -2..24; north chapels to y 31.6; apse to y 34. The
 *    nave, aisle and transept lines from the lidar ridges and eaves.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, above the ground round the church (281.2 m NAVD88; the
 *    site is level within 1.5 m): spire tip 73 (the west spire's highest
 *    return; the east spire's thin tip was missed, it is drawn the same);
 *    square towers to ~38 with corner pinnacles to 44-46, the open
 *    octagonal belfry stage above to ~52 (lidar 52-64 inside the tower
 *    squares; the stage's top from the head-on photo, at three-quarters of
 *    the spire height), the spire from there; nave and transept ridges 34.5,
 *    eaves ~26; inner aisle roofs 18-19 against the nave, outer 13;
 *    transept corner towers 38-43; apse roof 26-31; north chapels 9-10;
 *    the stair turret beside the east tower ~18.
 *  - published: 1906, spires about 247 ft (75 m) (Wikipedia, "Cathedral of
 *    Saint Paul (Pittsburgh)"), agreeing with the lidar.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Saint Paul Cathedral in Pittsburgh as seen from Fifth Avenue in 2016.jpg"
 *      https://commons.wikimedia.org/wiki/File:Saint_Paul_Cathedral_in_Pittsburgh_as_seen_from_Fifth_Avenue_in_2016.jpg
 *      Dllu, CC BY-SA 4.0 — the front head-on: towers, spires, gable, portals.
 *    "Saint Paul Cathedral in Pittsburgh as seen from Craig St in 2016.jpg"
 *      https://commons.wikimedia.org/wiki/File:Saint_Paul_Cathedral_in_Pittsburgh_as_seen_from_Craig_St_in_2016.jpg
 *      Dllu, CC BY-SA 4.0 — the east transept front and its towers.
 *    "St. Paul Cathedral Pittsburgh distance.jpg"
 *      https://commons.wikimedia.org/wiki/File:St._Paul_Cathedral_Pittsburgh_distance.jpg
 *      Piotrus (attributed by Commons), CC BY-SA 3.0 — from the south-west:
 *      the nave roof, west transept, aisles.
 *    "Cathedral of Saint Paul Pittsburgh aerial.JPG"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Saint_Paul_Pittsburgh_aerial.JPG
 *      Alekjds, CC BY-SA 3.0 — from above, the south-west: the cross plan.
 *    "South transept façade, St. Paul’s Cathedral, Oakland, Pittsburgh, 2026-08-03.jpg"
 *      https://commons.wikimedia.org/wiki/File:South_transept_fa%C3%A7ade,_St._Paul%E2%80%99s_Cathedral,_Oakland,_Pittsburgh,_2026-08-03.jpg
 *      Cbaile19, CC0 — a transept front head-on.
 *    "St. Paul Cathedral, Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:St._Paul_Cathedral,_Pittsburgh.jpg
 *      Kiran Kulkarni, CC BY-SA 3.0 — the front from below; colour.
 *    "St. Paul’s Cathedral, Oakland, Pittsburgh, 2026-08-03-2.jpg"
 *      https://commons.wikimedia.org/wiki/File:St._Paul%E2%80%99s_Cathedral,_Oakland,_Pittsburgh,_2026-08-03-2.jpg
 *      Cbaile19, CC0 — the front gable and its window.
 *    "St. Paul’s Cathedral. Pittsburgh, at dusk, 2022-12-07, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:St._Paul%E2%80%99s_Cathedral._Pittsburgh,_at_dusk,_2022-12-07,_01.jpg
 *      Cbaile19, CC0 — the floodlit front at dusk.
 *    USGS NAIP orthophoto (public domain): the cross plan, the brown-grey
 *    slate roofs and the pale aisle roofs.
 *  - colour: pale grey limestone; slate roofs brown-grey (NAIP, photos);
 *    aisle roofs pale grey.
 * Estimated: the tower stages and openings, the spire's gablets and
 * pinnacles, the portals and front window sizes (from the head-on photo
 * scaled to the lidar), the aisle windows, the apse's five sides.
 * Doubts: the north end (apse and chapels) is seen only from the air.
 *
 * Left out: crockets, statues, the rose tracery (drawn as mullions and a
 * Y fork), railings, the crosses (one bold cross on the front gable).
 *
 * Night: the front and spires are floodlit (dusk photo): stone and
 * tracery carry `floodlight`, strongest on the front; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { greatWindow, headH, pier, pointed } from './pit-heinz-chapel'

/** A gabled roof over [x0,y0,x1,y1], ridge along y (or x), with stone gable ends. */
function gable(roof: Part, wall: Part, r: [number, number, number, number], z0: number, z1: number, alongY: boolean, over = 0.4, ends: [boolean, boolean] = [true, true]) {
  const [x0, y0, x1, y1] = r
  if (alongY) {
    const cx = (x0 + x1) / 2
    poly(roof, [[x0 - over, y0, z0 - over * 0.8], [cx, y0, z1], [cx, y1, z1], [x0 - over, y1, z0 - over * 0.8]], [-1, 0, 1])
    poly(roof, [[cx, y0, z1], [x1 + over, y0, z0 - over * 0.8], [x1 + over, y1, z0 - over * 0.8], [cx, y1, z1]], [1, 0, 1])
    if (ends[0]) poly(wall, [[x0, y0, z0], [x1, y0, z0], [cx, y0, z1]], [0, -1, 0])
    if (ends[1]) poly(wall, [[x0, y1, z0], [x1, y1, z0], [cx, y1, z1]], [0, 1, 0])
  } else {
    const cy = (y0 + y1) / 2
    poly(roof, [[x0, y0 - over, z0 - over * 0.8], [x1, y0 - over, z0 - over * 0.8], [x1, cy, z1], [x0, cy, z1]], [0, -1, 1])
    poly(roof, [[x0, cy, z1], [x1, cy, z1], [x1, y1 + over, z0 - over * 0.8], [x0, y1 + over, z0 - over * 0.8]], [0, 1, 1])
    if (ends[0]) poly(wall, [[x0, y0, z0], [x0, y1, z0], [x0, cy, z1]], [-1, 0, 0])
    if (ends[1]) poly(wall, [[x1, y0, z0], [x1, y1, z0], [x1, cy, z1]], [1, 0, 0])
  }
}

/** A square pinnacle: shaft w wide from z0 to z1, pyramid to z2. */
function pinnacle(p: Part, x: number, y: number, w: number, z0: number, z1: number, z2: number) {
  const r = rect(x - w / 2, y - w / 2, x + w / 2, y + w / 2)
  walls(p, r, z0, z1)
  const t: V3 = [x, y, z2]
  for (let i = 0; i < 4; i++) { const a = r[i], b = r[(i + 1) % 4]; poly(p, [[a[0], a[1], z1], [b[0], b[1], z1], t], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.4]) }
}

function build() {
  const stone = new Part(), win = new Part(), slate = new Part(), lead = new Part(), tr = new Part(), door = new Part()

  const NX0 = -7, NX1 = 7.5, EAVE = 26, RIDGE = 34.5
  const FRONT = -34.1

  // ---- nave (front gable wall to the crossing and on to the apse)
  wallsSplit(stone, [[NX0, -26], [NX1, -26], [NX1, 26], [NX0, 26]], 0, EAVE)
  gable(slate, stone, [NX0, FRONT + 1.2, NX1, 26], EAVE, RIDGE, true, 0.5, [false, false])
  // clerestory lancets over the aisles, pairs per bay
  for (const [a, b] of [[[NX1, -25], [NX1, 1]], [[NX0, 1], [NX0, -25]]] as [XY, XY][]) {
    const { L } = onWall(a, b)
    for (let i = 0; i < 5; i++) { const s = 2.6 + i * (L - 5.2) / 4; pointed(win, a, b, s - 1.0, s + 1.0, 20, 24.4 - headH(2.0), 0.04) }
  }

  // ---- aisles: lean-to roofs from 13 at the outer wall to 19 at the nave
  const aisle = (xo: number, xi: number, y0: number, y1: number) => {
    const r = rect(Math.min(xo, xi), y0, Math.max(xo, xi), y1)
    wallsSplit(stone, r, 0, 13)
    poly(lead, [[xo, y0, 13], [xo, y1, 13], [xi, y1, 19], [xi, y0, 19]], [Math.sign(xo - xi), 0, 1])
    poly(stone, [[xo, y0, 13], [xi, y0, 13], [xi, y0, 19]], [0, -1, 0])
    poly(stone, [[xo, y1, 13], [xi, y1, 13], [xi, y1, 19]], [0, 1, 0])
    const a: XY = xo < xi ? [xo, y1] : [xo, y0], b: XY = xo < xi ? [xo, y0] : [xo, y1]
    const { L } = onWall(a, b)
    const n = Math.max(1, Math.round(L / 5))
    for (let i = 0; i < n; i++) { const s = (i + 0.5) * L / n; greatWindow(win, tr, a, b, s - 1.2, s + 1.2, 3.5, 10.3 - headH(2.4), 2, [], 0.15) }
  }
  aisle(-17, NX0, -25.5, -2)
  aisle(17.8, NX1, -25.5, -2)
  // the west chapel strip
  {
    const r = rect(-22.5, -20.1, -17, -5.1)
    wallsSplit(stone, r, 0, 12.6); cap(lead, r, 12.6)
    const a: XY = [-22.5, -5.1], b: XY = [-22.5, -20.1]
    for (const s of [3.8, 11.2]) greatWindow(win, tr, a, b, s - 1.2, s + 1.2, 3.5, 9.8 - headH(2.4), 2, [], 0.15)
  }

  // ---- transept, gabled ends between pairs of small pinnacled towers
  const TY0 = 2, TY1 = 22
  wallsSplit(stone, rect(-22.5, TY0, 22.7, TY1), 0, EAVE)
  gable(slate, stone, [-22.5, TY0, 22.7, TY1], EAVE, RIDGE, false, 0.5)
  for (const [x, a, b] of [[22.7, [22.7, TY0], [22.7, TY1]], [-22.5, [-22.5, TY1], [-22.5, TY0]]] as [number, XY, XY][]) {
    const { L, P } = onWall(a, b)
    greatWindow(win, tr, a, b, L / 2 - 3.6, L / 2 + 3.6, 11, 24.5 - headH(7.2), 4, [17], 0.18)
    pointed(stone, a, b, L / 2 - 2.2, L / 2 + 2.2, 0, 6.2, 0.35)
    pointed(door, a, b, L / 2 - 1.5, L / 2 + 1.5, 0.6, 4.2, 0.4)
    for (const s of [L / 2 - 1.3, L / 2, L / 2 + 1.3]) pointed(win, a, b, s - 0.4, s + 0.4, 28.2, 31.2, 0.04)
    void P
    // the corner towers: 4 m square, to 36, pinnacled to 42
    for (const ty of [TY0 - 2, TY1 + 2]) {
      const sx = Math.sign(x), tx = x - sx * 2
      const tr0 = rect(tx - 2, ty - 2, tx + 2, ty + 2)
      wallsSplit(stone, tr0, 0, 36)
      band(stone, tr0, grow([tx - 2, ty - 2, tx + 2, ty + 2], 0.25), 35.3, 36.2, 0.2)
      cap(stone, tr0, 36)
      pinnacle(stone, tx, ty, 2.4, 36, 37.5, 42.5)
      for (const [cx, cy] of [[-1.7, -1.7], [1.7, -1.7], [1.7, 1.7], [-1.7, 1.7]]) pinnacle(stone, tx + cx, ty + cy, 0.6, 36, 37.2, 39.2)
      for (const [fa, fb] of [[[tx + 2 * sx, ty - 2 * sx], [tx + 2 * sx, ty + 2 * sx]]] as [XY, XY][]) {
        pointed(win, fa, fb, 1.3, 2.7, 26, 32, 0.04)
        pointed(win, fa, fb, 1.5, 2.5, 14, 18, 0.04)
      }
    }
  }
  // the crossing: a small cross over the meeting ridges is all the evidence shows

  // ---- choir, apse and the low north chapels
  {
    const apse: XY[] = [[NX0, 26], [NX1, 26], [NX1, 30.2], [3.5, 34], [-2.5, 34], [NX0, 30.2]]
    wallsSplit(stone, apse, 0, 24)
    const c: V3 = [0.25, 28.5, 31]
    for (let i = 0; i < apse.length; i++) {
      const a = apse[i], b = apse[(i + 1) % apse.length]
      if (i === 0) continue
      poly(slate, [[a[0], a[1], 24], [b[0], b[1], 24], c], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 1])
    }
    poly(slate, [[NX0, 26, 24], [NX1, 26, 24], c], [0, -1, 0.2])
    poly(stone, [[NX0, 26, EAVE], [NX1, 26, EAVE], [0.25, 26, RIDGE]], [0, 1, 0])
    for (let i = 1; i < apse.length - 1; i++) {
      const a = apse[i], b = apse[i + 1]
      const { L } = onWall(a, b)
      if (L > 3) greatWindow(win, tr, a, b, L / 2 - 1.1, L / 2 + 1.1, 12, 21 - headH(2.2), 2, [], 0.15)
    }
    for (const r of [rect(-20.1, TY1, NX0, 31.4), rect(NX1, TY1, 20.5, 31.6)]) { wallsSplit(stone, r, 0, 9.5); cap(lead, r, 9.5) }
  }

  // ---- the front: central gable wall, portals, great window
  {
    const FX0 = -9.8, FX1 = 10.8
    wallsSplit(stone, rect(FX0, FRONT, FX1, -25.5), 0, EAVE)
    cap(lead, rect(FX0, FRONT, FX1, -25.5), EAVE)
    // the gable rising over the nave roof's end, a bold cross on it
    poly(stone, [[FX0 + 1.5, FRONT, EAVE], [FX1 - 1.5, FRONT, EAVE], [0.5, FRONT, 37]], [0, -1, 0])
    poly(stone, [[FX0 + 1.5, FRONT + 1.2, EAVE], [FX1 - 1.5, FRONT + 1.2, EAVE], [0.5, FRONT + 1.2, 37]], [0, 1, 0])
    poly(slate, [[FX0 + 1.5, FRONT, EAVE], [0.5, FRONT, 37], [0.5, FRONT + 1.2, 37], [FX0 + 1.5, FRONT + 1.2, EAVE]], [-1, 0, 1])
    poly(slate, [[0.5, FRONT, 37], [FX1 - 1.5, FRONT, EAVE], [FX1 - 1.5, FRONT + 1.2, EAVE], [0.5, FRONT + 1.2, 37]], [1, 0, 1])
    walls(stone, rect(0.2, FRONT + 0.3, 0.8, FRONT + 0.9), 37, 39.6)
    walls(stone, rect(-0.6, FRONT + 0.3, 1.6, FRONT + 0.9), 38.2, 38.8)
    const a: XY = [FX0, FRONT], b: XY = [FX1, FRONT], { L } = onWall(a, b)
    // gallery band, great window, three gabled portals
    greatWindow(win, tr, a, b, L / 2 - 4.0, L / 2 + 4.0, 13.5, 26.5 - headH(8.0), 4, [19.5], 0.18)
    for (const s of [L / 2 - 2.4, L / 2 - 0.8, L / 2 + 0.8, L / 2 + 2.4]) pointed(win, a, b, s - 0.45, s + 0.45, 29, 32.6, 0.04)
    band(stone, [[FX0, FRONT], [FX1, FRONT], [FX1, FRONT + 0.1], [FX0, FRONT + 0.1]], [[FX0, FRONT - 0.5], [FX1, FRONT - 0.5], [FX1, FRONT + 0.1], [FX0, FRONT + 0.1]], 11.6, 12.6, 0.3)
    for (const c of [L / 2 - 6.3, L / 2, L / 2 + 6.3]) {
      const w = c === L / 2 ? 4.4 : 3.6
      pointed(stone, a, b, c - w / 2 - 0.6, c + w / 2 + 0.6, 0, 7.6 - headH(w + 1.2), 0.45)
      pointed(door, a, b, c - w / 2 + 0.3, c + w / 2 - 0.3, 0.6, 4.4, 0.5)
      pointed(win, a, b, c - w / 2 + 0.3, c + w / 2 - 0.3, 4.6, 7.0 - headH(w - 0.6), 0.5)
      const { P } = onWall(a, b)
      poly(tr, [P(c - w / 2 - 0.5, 7.4, 0.5), P(c + w / 2 + 0.5, 7.4, 0.5), P(c, 10.8, 0.5)], [0, -1, 0])
    }
    for (const s of [L / 2 - 3.6, L / 2 + 3.6]) pier(stone, a, b, s, 0.9, 0, 12.6, 0.8, 1.6)
  }

  // ---- the twin towers and spires
  for (const [tx0, tx1] of [[-18.3, -9.8], [10.8, 19.3]]) {
    const ty0 = FRONT, ty1 = -25.5, TOP = 38, cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2, h = (tx1 - tx0) / 2
    const r = rect(tx0, ty0, tx1, ty1)
    wallsSplit(stone, r, 0, TOP)
    band(stone, r, grow([tx0, ty0, tx1, ty1], 0.3), 12, 12.7, 0.25)
    band(stone, r, grow([tx0, ty0, tx1, ty1], 0.3), 24.5, 25.2, 0.25)
    band(stone, r, grow([tx0, ty0, tx1, ty1], 0.4), TOP - 0.8, TOP, 0.3)
    cap(stone, r, TOP)
    for (const [a, b] of [[[tx0, ty0], [tx1, ty0]], [[tx1, ty0], [tx1, ty1]], [[tx1, ty1], [tx0, ty1]], [[tx0, ty1], [tx0, ty0]]] as [XY, XY][]) {
      const { L } = onWall(a, b)
      // belfry: two tall lancets; below, a pair of smaller ones
      for (const s of [L / 2 - 1.35, L / 2 + 1.35]) {
        pointed(win, a, b, s - 0.9, s + 0.9, 27, 35.8 - headH(1.8), 0.04)
        pointed(win, a, b, s - 0.6, s + 0.6, 17, 22.6 - headH(1.2), 0.04)
      }
      if (a[1] === ty0 && b[1] === ty0) {
        // the tower's own portal on the front
        pointed(stone, a, b, L / 2 - 2.0, L / 2 + 2.0, 0, 7 - headH(4), 0.45)
        pointed(door, a, b, L / 2 - 1.3, L / 2 + 1.3, 0.6, 4.2, 0.5)
        greatWindow(win, tr, a, b, L / 2 - 1.2, L / 2 + 1.2, 13.5, 21.5, 2, [], 0.15)
      }
    }
    // corner buttresses, pinnacles at the top
    for (const [x, y] of r) {
      const sx = Math.sign(x - cx), sy = Math.sign(y - cy)
      const b = rect(Math.min(x, x - sx * 1.6), Math.min(y, y - sy * 1.6), Math.max(x, x - sx * 1.6), Math.max(y, y - sy * 1.6))
      const bo = rect(Math.min(x - sx * 0.2, x + sx * 0.4), Math.min(y - sy * 0.2, y + sy * 0.4), Math.max(x - sx * 0.2, x + sx * 0.4), Math.max(y - sy * 0.2, y + sy * 0.4))
      void b
      walls(stone, bo, 0, TOP - 0.8); cap(stone, bo, TOP - 0.8)
      pinnacle(stone, x - sx * 0.6, y - sy * 0.6, 1.3, TOP, 41.5, 45.5)
    }
    // the open octagonal belfry stage, ringed by pinnacles, then the spire
    const seg = 8, RO = h - 1.0, OCT = 52, SP = 2.9
    const ring = (rr: number, z: number): V3[] => Array.from({ length: seg }, (_, i) => [cx + rr * Math.cos((i + 0.5) * Math.PI / 4), cy + rr * Math.sin((i + 0.5) * Math.PI / 4), z] as V3)
    const o0 = ring(RO, TOP), o1 = ring(RO, OCT)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg, nrm: V3 = [Math.cos((i + 1) * Math.PI / 4), Math.sin((i + 1) * Math.PI / 4), 0]
      poly(stone, [o0[i], o0[j], o1[j], o1[i]], nrm)
      const a: XY = [o0[i][0], o0[i][1]], b: XY = [o0[j][0], o0[j][1]], { L, P } = onWall(a, b)
      pointed(win, a, b, L / 2 - 0.55, L / 2 + 0.55, 42.5, 49.2 - headH(1.1), 0.04)
      // a gablet over each face, rising past the stage's top
      poly(tr, [P(0.2, OCT - 1.2, 0.08), P(L - 0.2, OCT - 1.2, 0.08), P(L / 2, OCT + 2.4, 0.08)], nrm)
    }
    band(stone, o1.map(([x, y]) => [x, y] as XY), o1.map(([x, y]) => [cx + (x - cx) * 1.08, cy + (y - cy) * 1.08] as XY), OCT - 0.6, OCT, 0.2)
    for (let i = 0; i < seg; i++) pinnacle(stone, cx + (RO + 0.3) * Math.cos((i + 0.5) * Math.PI / 4), cy + (RO + 0.3) * Math.sin((i + 0.5) * Math.PI / 4), 0.6, OCT - 2, OCT + 1, OCT + 3.6)
    const s0 = ring(SP, OCT), tip: V3 = [cx, cy, 73]
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      poly(stone, [s0[i], s0[j], tip], [Math.cos((i + 1) * Math.PI / 4), Math.sin((i + 1) * Math.PI / 4), 0.12])
    }
    cap(stone, rect(tx0 + 0.1, ty0 + 0.1, tx1 - 0.1, ty1 - 0.1), TOP)
    walls(stone, rect(cx - 0.12, cy - 0.12, cx + 0.12, cy + 0.12), 72.5, 74.6)
  }
  // the stair turret beside the east tower
  {
    const c: XY = [20.1, -29.6]
    const ring = Array.from({ length: 10 }, (_, i) => [c[0] + 2.1 * Math.cos((i * 2 * Math.PI) / 10), c[1] + 2.1 * Math.sin((i * 2 * Math.PI) / 10)] as XY)
    wallsSplit(stone, ring, 0, 17)
    const t: V3 = [c[0], c[1], 20]
    for (let i = 0; i < 10; i++) { const a = ring[i], b = ring[(i + 1) % 10]; poly(slate, [[a[0], a[1], 17], [b[0], b[1], 17], t], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0.6]) }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : p[1] < -24 ? 0.85 : 0.3)
  return [
    { part: stone, material: { ...finish('cathedral-limestone', 0xe2ddd3), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('slate', 0x7c7570) },
    { part: lead, material: PALETTE.roof },
    { part: tr, material: { ...PALETTE.trim, floodlight: lit } },
    { part: door, material: finish('entrance', 0x8a6a52) },
  ]
}

if (import.meta.main) await save('pit-st-paul-cathedral', 'Cathedral of Saint Paul', [40.447372, -79.949807], 355.5, build() as any, 6500)
