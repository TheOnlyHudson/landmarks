/**
 * Cleveland Harbor West Pierhead Light (1910-11, fog signal house 1916),
 * at the end of the west breakwater, Cleveland: procedural, CC0-1.0.
 * bun generators/cle-harbor-west-pierhead-light.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 142 (the fog
 * house's ridge and the pierhead's long axis; +y points 142°, south-east,
 * from the house to the tower). Origin: the tower's centre, at lake level.
 *
 * Identity, in order: the white conical steel tower with its bracketed,
 * flared gallery and railing; the narrower white watch room, the small
 * second gallery and the glazed lantern under a red conical roof and ball;
 * the white fog signal house, gable end to the tower, with its crimson roof
 * and the tall dark-red box on its far end; the low wing joining them and
 * the little porch on the tower's lake side; all on the square pierhead
 * crib, now sheathed in dark steel sheet piling that stands a little above
 * the concrete deck.
 *
 * Evidence:
 *  - OSM way/414659280 (man_made=lighthouse, "white conical tower with fog
 *    signal building attached", height 15.2, Q28374708), way/414659282 (Fog
 *    Signal House), way/414659281 (West Pierhead, man_made=pier, a flat
 *    area with no height), way/3786595 (the rock breakwater, not modelled).
 *    The assignment said "square tower"; OSM's shape tag and every photo show
 *    a round, tapering one, which the model follows.
 *  - lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019), 0.5 m grid
 *    centred on -81.71775 41.50897. OSM's two buildings sit about 2.5 m west
 *    of the lidar (and of NAIP); the OSM pier outline agrees with the lidar
 *    to 1-2 m. The model and its anchor follow the lidar. Measured, above
 *    the deck: gallery floor 10.8, its rail ~12.0, lantern gallery ~14.0,
 *    lantern roof 15.6-15.9; the gallery ~7.0 m across. Fog house: eaves
 *    5.5, ridge 7.9, the box on its far end 9.0; walls ~8.6 x 10.1 m; the
 *    wing 3.3; the porch 3.0. Pierhead 22.5 x 34 m; its steel edge stands
 *    1.1-1.3 m above the deck.
 *  - elevation: the deck is 2.5 m above the lake (lidar deck 176.8-177.2 m;
 *    lidar water 174.6 m; the map's terrain is flat at 174.56 m here, the
 *    lake). OSM maps the pier only as a flat area, so the model carries the
 *    pierhead crib itself, from the water (y = 0) to the deck, and the
 *    placement keeps elevation 0. The rocks of the breakwater are not drawn.
 *  - USGS NAIP (public domain): plan, pale concrete deck, dark steel edge,
 *    red roof.
 *  - published: built 1910-11, fog signal house 1916, NRHP 83001950;
 *    light 19 m above water (OSM seamark:light:height).
 *  Estimated from the photos (scaled to the lidar): the tower's base 6.6 m
 *  across (OSM ring), 5.5 m under the corbels; the watch room 3.5 m, the
 *  lantern 2.4 m, the lantern gallery 4.1 m across; windows, doors.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cleveland_West_Pierhead_Light,_Cleveland,_OH.jpg, Kuyacmh, CC BY-SA 3.0
 *    (close, side-on, before the steel sheathing)
 *  - Lake_Erie_Lighthouse_(42700447184).jpg, Erik Drost, CC BY 2.0 (side-on,
 *    current steel wall, roof colours)
 *  - Lake_Erie_Lighthouse_(49839847497).jpg, Erik Drost, CC BY 2.0 (dusk,
 *    the lantern lit)
 *  - Cleveland_Harbor_West_Pierhead_Lighthouse_(30316531223).jpg, darlingtrk,
 *    CC BY 2.0 (from the harbour side)
 *  - Cleveland_West_Pierhead_Lighthouse.jpg, Mtbangert, CC BY-SA 3.0 (the
 *    porch side at sunset)
 *  - Cleveland_West_Pierhead_Light_-_Lake_Erie_OH.jpg, Tom Bower, CC BY 2.0
 *    (distant, from the east)
 * No look-only sources. No commercial imagery.
 *
 * Night: the lantern glazing is `window` (lit; the real light flashes red).
 * The windows are boarded in dark green and stay dark; nothing is floodlit.
 * Doubts: which faces carry which windows is read loosely from the photos;
 * the railings are drawn as posts and a rail, the one fine detail kept.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, circle, type XY } from './chi-aon-center'

const DECK = 2.5

/** A drum or frustum between two radii, flat-shaded sides, optional caps. */
function drum(p: Part, r0: number, z0: number, r1: number, z1: number, seg: number, top = true, bottom = false, cx = 0, cy = 0, a0 = 0) {
  const c0 = circle(cx, cy, r0, seg, a0), c1 = circle(cx, cy, r1, seg, a0)
  walls(p, c0, z0, z1, c1)
  if (top) cap(p, c1, z1)
  if (bottom) cap(p, c0, z0, false)
}

/** A smooth surface of revolution, (r, z) profile bottom to top. */
function lathe(p: Part, prof: XY[], seg: number) {
  const nrm = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: XY, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    const N = (n: XY, t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      const A = P(prof[i], a), B = P(prof[i], b), C = P(prof[i + 1], b), D = P(prof[i + 1], a)
      p.tri(A, B, C, undefined, undefined, undefined, [N(nrm[i], a), N(nrm[i], b), N(nrm[i + 1], b)])
      p.tri(A, C, D, undefined, undefined, undefined, [N(nrm[i], a), N(nrm[i + 1], b), N(nrm[i + 1], a)])
    }
  }
}

/** A box from z0 to z1 over a rectangle. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) {
  const r = rect(x0, y0, x1, y1)
  walls(p, r, z0, z1)
  if (top) cap(p, r, z1)
}

/** A flat panel on the cone/drum of radius r(z) at azimuth az (deg from +x), width w, z0..z1. */
function conePanel(p: Part, rAt: (z: number) => number, az: number, w: number, z0: number, z1: number, out = 0.05) {
  const a = (az * Math.PI) / 180, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
  const pt = (s: number, z: number): V3 => {
    const r = Math.sqrt(rAt(z) ** 2 - (w / 2) ** 2) + out
    return [n[0] * r + t[0] * s, n[1] * r + t[1] * s, z]
  }
  p.quad(pt(-w / 2, z0), pt(w / 2, z0), pt(w / 2, z1), pt(-w / 2, z1))
}

/** A flat panel on a wall: outward normal n (unit, axis-aligned), centre c along the wall, plane at d. */
function wallPanel(p: Part, n: XY, d: number, c: number, w: number, z0: number, z1: number, out = 0.04) {
  const t: XY = [-n[1], n[0]]
  const o: XY = [n[0] * (d + out), n[1] * (d + out)]
  const pt = (s: number, z: number): V3 => [o[0] + t[0] * (c + s), o[1] + t[1] * (c + s), z]
  p.quad(pt(-w / 2, z0), pt(w / 2, z0), pt(w / 2, z1), pt(-w / 2, z1))
}

/** A ring of railing posts with a top rail. */
function railing(p: Part, r: number, z0: number, h: number, posts: number, seg: number) {
  for (let k = 0; k < posts; k++) {
    const a = (k / posts) * 2 * Math.PI, x = r * Math.cos(a), y = r * Math.sin(a), w = 0.06
    box(p, x - w, y - w, x + w, y + w, z0, z0 + h - 0.1, false)
  }
  const o = circle(0, 0, r + 0.05, seg), i = circle(0, 0, r - 0.05, seg)
  walls(p, o, z0 + h - 0.12, z0 + h)
  walls(p, [...i].reverse(), z0 + h - 0.12, z0 + h)
  for (let k = 0; k < seg; k++) {
    const l = (k + 1) % seg
    p.quad([i[k][0], i[k][1], z0 + h], [o[k][0], o[k][1], z0 + h], [o[l][0], o[l][1], z0 + h], [i[l][0], i[l][1], z0 + h])
    p.quad([i[l][0], i[l][1], z0 + h - 0.12], [o[l][0], o[l][1], z0 + h - 0.12], [o[k][0], o[k][1], z0 + h - 0.12], [i[k][0], i[k][1], z0 + h - 0.12])
  }
}

function build() {
  const white = new Part(), red = new Part(), iron = new Part(), win = new Part(), deck = new Part()
  const D = DECK

  // ------------------------------------------------ the pierhead crib: dark steel walls, concrete deck
  const PX0 = -11.5, PX1 = 11, PY0 = -21.5, PY1 = 12.5, EDGE = D + 1.2, T = 0.45
  const outer = rect(PX0, PY0, PX1, PY1), inner = rect(PX0 + T, PY0 + T, PX1 - T, PY1 - T)
  // split the tall outer walls at the deck so no face is over ~5 m high
  walls(iron, outer, 0, D)
  walls(iron, outer, D, EDGE)
  walls(iron, [...inner].reverse(), D, EDGE)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    iron.quad([inner[k][0], inner[k][1], EDGE], [outer[k][0], outer[k][1], EDGE], [outer[l][0], outer[l][1], EDGE], [inner[l][0], inner[l][1], EDGE])
  }
  cap(deck, inner, D)

  // ------------------------------------------------ the tower
  const R0 = 3.3, R1 = 2.75, ZC = D + 9.7 // conical shaft
  const rAt = (z: number) => R0 + (R1 - R0) * ((z - D) / (ZC - D))
  drum(iron, R0 + 0.06, D, R0 + 0.04, D + 0.45, 16, true) // dark plinth band
  lathe(white, [[R0, D + 0.45], [rAt(D + 5), D + 5], [R1, ZC], [2.85, ZC + 0.45], [3.1, ZC + 0.8], [3.5, ZC + 1.05]], 16)
  const ZG = D + 10.8 // gallery floor
  drum(iron, 3.55, ZC + 1.05, 3.55, ZG, 16, true, true)
  railing(iron, 3.45, ZG, 1.15, 16, 16)
  // corbel brackets under the gallery
  for (let k = 0; k < 12; k++) {
    const a = ((k + 0.5) / 12) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), w = 0.14
    const p0: V3[] = [[c * (R1 + 0.05) - s * w, s * (R1 + 0.05) + c * w, ZC - 0.9], [c * (R1 + 0.05) + s * w, s * (R1 + 0.05) - c * w, ZC - 0.9]]
    const top: V3[] = [[c * 3.45 - s * w, s * 3.45 + c * w, ZC + 1.05], [c * 3.45 + s * w, s * 3.45 - c * w, ZC + 1.05]]
    const mid: V3[] = [[c * (R1 + 0.05) - s * w, s * (R1 + 0.05) + c * w, ZC + 1.05], [c * (R1 + 0.05) + s * w, s * (R1 + 0.05) - c * w, ZC + 1.05]]
    // a triangular web, both sides
    white.tri(p0[0], top[0], mid[0]); white.tri(p0[1], mid[1], top[1])
    white.quad(p0[1], top[1], top[0], p0[0])
  }
  // the watch room
  const RW = 1.75, ZW = D + 13.6
  drum(white, RW, ZG, RW, ZW, 16, false)
  // the lantern gallery deck and rail
  drum(iron, 2.05, ZW, 2.05, ZW + 0.2, 16, true, true)
  railing(iron, 1.95, ZW + 0.2, 0.9, 10, 16)
  // the lantern: a base ring, ten-sided glazing with bars, the red roof and ball
  const ZL = ZW + 0.2
  drum(iron, 1.3, ZL, 1.3, ZL + 0.5, 10, false, false, 0, 0, Math.PI / 10)
  drum(win, 1.2, ZL + 0.5, 1.2, ZL + 1.75, 10, false, false, 0, 0, Math.PI / 10)
  for (let k = 0; k < 10; k++) {
    const a = Math.PI / 10 + (k / 10) * 2 * Math.PI, x = 1.21 * Math.cos(a), y = 1.21 * Math.sin(a), w = 0.07
    box(iron, x - w, y - w, x + w, y + w, ZL + 0.5, ZL + 1.75, false)
  }
  drum(iron, 1.3, ZL + 1.75, 1.3, ZL + 1.9, 10, false, true, 0, 0, Math.PI / 10)
  const ZR = ZL + 1.9
  drum(red, 1.5, ZR, 0.18, ZR + 0.95, 16, false, true)
  lathe(red, [[0.18, ZR + 0.95], [0.26, ZR + 1.1], [0.26, ZR + 1.3], [0.12, ZR + 1.45], [0.01, ZR + 1.5]], 8)
  box(iron, -0.04, -0.04, 0.04, 0.04, ZR + 1.5, ZR + 2.1)

  // windows on the tower: three tiers, staggered round it (boarded, dark green)
  for (const [z0, azs] of [[D + 2.0, [60, 200, 320]], [D + 4.8, [0, 130, 250]], [D + 7.4, [70, 190, 300]]] as [number, number[]][])
    for (const az of azs) conePanel(iron, rAt, az, 0.75, z0, z0 + 1.35)
  // the round port under the gallery on four sides
  for (const az of [45, 135, 225, 315]) conePanel(iron, rAt, az, 0.45, ZC - 0.6, ZC - 0.15)
  // watch-room door, facing the harbour channel (north-east, -x), as in the photos from there
  conePanel(iron, () => RW, 180, 0.8, ZG + 0.1, ZG + 2.0, 0.04)

  // the porch on the tower's lake side (+y)
  box(white, -0.85, R0 - 0.3, 0.85, R0 + 1.3, D, D + 2.85)
  box(white, -0.95, R0 - 0.3, 0.95, R0 + 1.4, D + 2.85, D + 3.0)
  wallPanel(iron, [0, 1], R0 + 1.3, 0, 0.9, D + 0.1, D + 2.2)

  // ------------------------------------------------ the wing between tower and house
  const HY1 = -6.8, HY0 = -16.9, HX0 = -4.6, HX1 = 4.0
  box(white, -1.6, HY1 - 0.2, 1.6, -R0 + 0.3, D, D + 3.1, false)
  box(white, -1.75, HY1 - 0.2, 1.75, -R0 + 0.3, D + 3.1, D + 3.3)
  wallPanel(iron, [1, 0], 1.6, -5.4, 0.7, D + 1.3, D + 2.4)
  wallPanel(iron, [-1, 0], 1.6, 5.4, 0.7, D + 1.3, D + 2.4)

  // ------------------------------------------------ the fog signal house: gable to the tower
  const EAVE = D + 5.2, RIDGE = D + 7.9, XC = (HX0 + HX1) / 2, OV = 0.4
  walls(white, rect(HX0, HY0, HX1, HY1), D, EAVE)
  for (const [y, n] of [[HY1, 1], [HY0, -1]] as [number, number][]) {
    const a: V3 = [HX0, y, EAVE], b: V3 = [HX1, y, EAVE], c: V3 = [XC, y, RIDGE]
    if (n > 0) white.tri(b, a, c); else white.tri(a, b, c)
  }
  // the roof: two slabs with overhang, 0.2 thick
  {
    const slope = (RIDGE - EAVE) / (HX1 - XC)
    const zE = EAVE - OV * slope, y0 = HY0 - OV, y1 = HY1 + OV, th = 0.2
    for (const s of [-1, 1]) {
      const xe = s > 0 ? HX1 + OV : HX0 - OV
      const top: V3[] = [[xe, y0, zE], [XC, y0, RIDGE], [XC, y1, RIDGE], [xe, y1, zE]]
      const bot = top.map(([x, y, z]) => [x, y, z - th] as V3)
      if (s > 0) { red.quad(top[0], top[3], top[2], top[1]); red.quad(bot[0], bot[1], bot[2], bot[3]) }
      else { red.quad(top[0], top[1], top[2], top[3]); red.quad(bot[0], bot[3], bot[2], bot[1]) }
      // eave edge and gable verges
      if (s > 0) red.quad(bot[0], bot[3], top[3], top[0]); else red.quad(bot[0], top[0], top[3], bot[3])
      if (s > 0) { red.quad(bot[0], top[0], top[1], bot[1]); red.quad(bot[3], bot[2], top[2], top[3]) }
      else { red.quad(bot[1], top[1], top[0], bot[0]); red.quad(bot[3], top[3], top[2], bot[2]) }
    }
  }
  // the tall box on the far end of the ridge
  box(red, XC - 1.7, HY0 + 0.5, XC + 1.7, HY0 + 4.1, EAVE + 0.8, D + 9.0)
  box(red, XC - 1.85, HY0 + 0.35, XC + 1.85, HY0 + 4.25, D + 9.0, D + 9.15)
  // windows and doors (boarded, dark green)
  for (const [n, d] of [[[1, 0], HX1], [[-1, 0], -HX0]] as [XY, number][]) {
    const sgn = n[0]
    // along the long walls: wall coordinate s runs along t = (-n.y, n.x) = (0, sgn)
    for (const y of [-8.6, -11.2]) wallPanel(iron, n, d, y * sgn, 0.75, D + 1.3, D + 3.0)
    wallPanel(iron, n, d, -14.4 * sgn, 1.3, D + 0.1, D + 2.6) // the door
    wallPanel(iron, n, d, -15.9 * sgn, 0.6, D + 1.3, D + 3.0)
  }
  // the gable end facing the tower: two windows in the attic, either side of the wing
  for (const x of [-0.6, 0.6]) wallPanel(iron, [0, 1], HY1, -x + XC, 0.45, D + 4.0, D + 5.2)
  for (const x of [-3.2, 2.6]) wallPanel(iron, [0, 1], HY1, -x, 0.75, D + 1.3, D + 3.0)
  // the far gable
  wallPanel(iron, [0, -1], -HY0, XC, 0.75, D + 1.3, D + 3.0)
  wallPanel(iron, [0, -1], -HY0, XC, 0.5, D + 4.0, D + 5.2)

  return [
    { part: white, material: finish('pierhead-white', 0xf1eee8) },
    { part: red, material: finish('pierhead-red', 0x8e3a3f) },
    { part: iron, material: finish('pierhead-iron', 0x4c5450) },
    { part: win, material: PALETTE.window },
    { part: deck, material: finish('pierhead-concrete', 0xbdb8ae) },
  ]
}

if (import.meta.main) await save('cle-harbor-west-pierhead-light', 'Cleveland Harbor West Pierhead Light', [41.508971, -81.71769], 142, build(), 5000)
