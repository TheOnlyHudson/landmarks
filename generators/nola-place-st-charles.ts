/**
 * Place St. Charles (201 St. Charles Avenue, 1985), New Orleans — original
 * procedural geometry, CC0-1.0.
 * bun generators/nola-place-st-charles.ts
 *
 * Plan frame: x across the tower, y along its long faces (model north,
 * toward Canal Street), z up, metres; origin at the anchor on the ground.
 * Anchor = centroid of the OSM outline way/328669397 (tower and podium),
 * 29.9520204, -90.0703508. The long faces run at 14.65°, so the catalog
 * bearing is 14.65.
 *
 * Identity, in order: the tall pinkish-tan granite slab on a parallelogram
 * plan (the short faces follow the skewed CBD block, ~13.7° off square);
 * the ziggurat crown: every face keeps a full-height central bay while the
 * rest steps down in three terraces to the corners, so each face ends in a
 * stepped pyramid; the tall dark glazed panels at the top of each central
 * bay (with the big circle on the long faces); bold granite piers with dark
 * glass between them, strips low down and punched windows near the top;
 * the low granite podium with its street colonnade around the base.
 *
 * Evidence:
 *  - plan: OSM building:parts way/367524546 (180 m, the shaft),
 *    way/367524549 (185), way/367524548 (190), way/367524547 (196); all
 *    four are this tower (they sit inside the outline, and the lidar shows
 *    the same terraces). The parts are a parallelogram, x -22.0 … 16.26,
 *    short faces sheared by -0.2435 m per m (measured in this frame from
 *    the OSM nodes, regularised to one shear). Each tier is a central
 *    block plus four arms reaching the faces: the arms on the long faces
 *    are 10.6 m wide on every tier, those on the short faces 27.5, 19.5 and
 *    10.2 m wide (OSM), insets 2.7 / 5.5 / 9.9 m across and 3.5 / 7 / 11 m
 *    along (OSM and lidar, averaged where the two ends differ by ~1 m).
 *  - heights: USGS 3DEP lidar LA_2021GNO_1_C22 (flown 2021-22), read in
 *    this frame with tools/lidar_frame.py; street 0.4 m above ground_min
 *    taken as y = 0. Terraces 180.5, 184.8, 189.0 m, main roof 197.0 m
 *    (measured). Published 645 ft = 196.6 m, 53 floors (Wikipedia).
 *  - podium: OSM outline and lidar: a 14.3 m block along St. Charles (east,
 *    x 16.3 … 35), a 10.8 m block to the west (Carondelet side) and a
 *    21.5 m block at its north end (measured). Street colonnade on the
 *    St. Charles/Common corner from Infrogmation's May 2019 photo.
 *  - bays: 9 per short face (counted on TonyTheTiger's 2008 photo), 16 per
 *    long face (estimated from Infrogmation's 2007 view from Poydras and
 *    pasa47's 2015 close-up). Windows ~60% of the bay in the strip zone,
 *    ~45% in the punched zone (pasa47 close-up). Floors grouped three to a
 *    panel in the strips, two in the punched zone.
 *  - crown glass: the central bay of every face is glazed from the first
 *    terrace up (two dark panels on the short faces, TonyTheTiger; a glass
 *    bay with a large circle on the long faces, Fredlyfish4 2016).
 *  - colours: granite pinkish tan in all daylight photos (Fredlyfish4,
 *    pasa47), pulled to the palette's lightness; glass dark green-grey.
 *
 * Photos (EVIDENCE):
 *  - Place St. Charles 2016.jpg, Fredlyfish4, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Place_St._Charles_2016.jpg
 *  - Place St Charles New Orleans seen from Hilton.jpg, TonyTheTiger,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Place_St_Charles_New_Orleans_seen_from_Hilton.jpg
 *  - CBD11Oct07PlaceStChasFromPoydrasBack.jpg, Infrogmation of New Orleans,
 *    CC BY-SA 3.0 (from the south)
 *    https://commons.wikimedia.org/wiki/File:CBD11Oct07PlaceStChasFromPoydrasBack.jpg
 *  - Office Towers - New Orleans, March 2015.jpg, pasa47, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Office_Towers_-_New_Orleans,_March_2015.jpg
 *  - New Orleans, LA - A few tall buildings.jpg, TexasExplorer98, CC BY 2.0
 *    (from Canal Street, north)
 *    https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_-_A_few_tall_buildings.jpg
 *  - CBD10Oct07RampartPlaceStChasHiberniaDome.jpg, Infrogmation of New
 *    Orleans, CC BY-SA 3.0 (from the west)
 *    https://commons.wikimedia.org/wiki/File:CBD10Oct07RampartPlaceStChasHiberniaDome.jpg
 *  - St Charles Avenue up from Canal Street New Orelasn May 2019 17.jpg,
 *    Infrogmation of New Orleans, CC BY-SA 4.0 (the base)
 *    https://commons.wikimedia.org/wiki/File:St_Charles_Avenue_up_from_Canal_Street_New_Orelasn_May_2019_17.jpg
 * Look-only: none used. No commercial imagery.
 *
 * Ground: flat (street 0.4 m above the lidar ground minimum). elevation 0.
 *
 * Doubts: where the strips give way to punched windows differs between
 * photos and faces; drawn higher on the short faces than on the long ones.
 * The "Capital One" sign of the 2010s photos is left off (the tenant may
 * have changed). The podium's west and north faces are not well
 * photographed; drawn plain. Lidar shows no return over a strip along the
 * tower's west foot (probably a skylight); drawn as podium roof.
 *
 * Left out: the rooftop mechanical box and masts, the triangle patterns in
 * the glass spandrels, the colonnade's balconies and columns (drawn as a
 * recessed dark arcade).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, walls, cap, inset, onWall, panel, area, save } from './chi-aon-center'

const S = -0.2435, XC = -2.87 // shear of the short faces, tower centre x
const X0 = -22.0, X1 = 16.26, V0 = -30.8, V1 = 35.7 // tower in (x, v)
const VE0 = -3.3, VE1 = 7.25 // the long faces' central arm, along v
const H0 = 180.1, H1 = 184.4, H2 = 188.6, H3 = 196.6 // terraces and roof (street = 0)
const P = (x: number, v: number): XY => [x, v + S * (x - XC)]

/** A tier: central block inset (dx, dv) plus arms; ns = short-face arm width (0 = none). */
function tier(dx: number, dv: number, ns: number): XY[] {
  const a0 = XC - ns / 2, a1 = XC + ns / 2
  const r: [number, number][] = [
    [X0 + dx, V0 + dv], [a0, V0 + dv], [a0, V0], [a1, V0], [a1, V0 + dv], [X1 - dx, V0 + dv],
    [X1 - dx, VE0], [X1, VE0], [X1, VE1], [X1 - dx, VE1],
    [X1 - dx, V1 - dv], [a1, V1 - dv], [a1, V1], [a0, V1], [a0, V1 - dv], [X0 + dx, V1 - dv],
    [X0 + dx, VE1], [X0, VE1], [X0, VE0], [X0 + dx, VE0],
  ]
  return r.map(([x, v]) => P(x, v))
}

/** Panels along wall a→b: n bays, windows w wide, over the given rows; skip bays whose centre is in `skip` (s ranges). */
function baysOn(p: Part, a: XY, b: XY, n: number, wFrac: number, rows: [number, number][], skip: [number, number][] = []) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), bay = L / n, w = bay * wFrac
  for (let k = 0; k < n; k++) {
    const c = (k + 0.5) * bay
    if (skip.some(([s0, s1]) => c > s0 && c < s1)) continue
    for (const [z0, z1] of rows) panel(p, a, b, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}

/** A prism with a bevelled lip on top and a flat roof. */
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function prism(wall: Part, top: Part, r: XY[], z0: number, z1: number, bev = 0.35) {
  r = ccw(r)
  walls(wall, r, z0, z1 - bev)
  const i = inset(r, bev)
  walls(wall, r, z1 - bev, z1, i)
  cap(top, i, z1)
}

function build() {
  const gran = new Part(), win = new Part(), crown = new Part(), roof = new Part(), trim = new Part()

  // ---- Shaft and the stepped crown.
  const shaft = [P(X0, V0), P(X1, V0), P(X1, V1), P(X0, V1)]
  prism(gran, roof, shaft, 0, H0)
  const t1 = tier(2.7, 3.5, 27.5), t2 = tier(5.5, 7.0, 19.5), t3 = tier(9.9, 11.0, 10.2)
  prism(gran, roof, t1, H0 - 0.35, H1)
  prism(gran, roof, t2, H1 - 0.35, H2)
  prism(gran, roof, t3, H2 - 0.35, H3)

  // Windows on the shaft: strips (three floors a panel) below, punched (two floors) above.
  const strips = (z0: number, z1: number, n: number): [number, number][] =>
    Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + 0.35, z0 + (i + 1) * (z1 - z0) / n - 0.35])
  const punched = (z0: number, z1: number, n: number): [number, number][] =>
    Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + 1.1, z0 + (i + 1) * (z1 - z0) / n - 1.1])
  const TOPWIN = H0 - 1.6
  const faces: { a: XY; b: XY; n: number; split: number; arm: [number, number] }[] = [
    { a: shaft[0], b: shaft[1], n: 9, split: 165, arm: [0, 0] },
    { a: shaft[1], b: shaft[2], n: 16, split: 14.5, arm: [0, 0] },
    { a: shaft[2], b: shaft[3], n: 9, split: 165, arm: [0, 0] },
    { a: shaft[3], b: shaft[0], n: 16, split: 14.5, arm: [0, 0] },
  ]
  for (const f of faces) {
    const ns = Math.round((f.split - 14.5) / 10.8), nz = Math.max(1, Math.round((TOPWIN - f.split) / 7.2))
    const split = 14.5 + ns * 10.8
    if (ns > 0) baysOn(win, f.a, f.b, f.n, 0.6, strips(14.5, split, ns))
    baysOn(win, f.a, f.b, f.n, 0.46, punched(split, TOPWIN, nz))
  }

  // Windows on the terraces' walls: one row per tier, on every wall that faces out.
  const tierRows: [XY[], number, number][] = [[t1, H0, H1], [t2, H1, H2], [t3, H2, H3]]
  for (const [r, z0, z1] of tierRows) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 3.4) continue
      const n = Math.max(1, Math.round(L / 4.3))
      const rows: [number, number][] = z1 - z0 > 6 ? [[z0 + 0.9, z0 + 3.4], [z0 + 4.6, z1 - 1.3]] : [[z0 + 0.8, z1 - 1.3]]
      // The arm faces on the shaft planes carry the crown glass instead.
      const onFace = Math.abs(a[0] - X1) < 0.01 && Math.abs(b[0] - X1) < 0.01 || Math.abs(a[0] - X0) < 0.01 && Math.abs(b[0] - X0) < 0.01
      if (onFace) continue
      const { P: Q } = onWall(a, b)
      const mid = Q(L / 2, 0)
      const vMid = mid[1] - S * (mid[0] - XC)
      const onShort = Math.abs(vMid - V0) < 0.01 || Math.abs(vMid - V1) < 0.01
      const skip: [number, number][] = []
      if (onShort && z0 === H2) {
        // skip the central 10.2 m arm, glazed separately
        const s0 = (XC - 5.1 - a[0]) / (b[0] - a[0]) * L, s1 = (XC + 5.1 - a[0]) / (b[0] - a[0]) * L
        skip.push([Math.min(s0, s1), Math.max(s0, s1)])
      }
      baysOn(win, a, b, onShort ? Math.max(1, Math.round(L / 4.38)) : n, 0.5, rows, skip)
    }
  }

  // Crown glass on the four central arms, H0 + 0.8 up to under the coping.
  const G0 = H0 + 0.9, G1 = H3 - 1.4
  const arms: [XY, XY][] = [
    [P(XC - 5.1, V0), P(XC + 5.1, V0)], [P(X1, VE0), P(X1, VE1)],
    [P(XC + 5.1, V1), P(XC - 5.1, V1)], [P(X0, VE1), P(X0, VE0)],
  ]
  arms.forEach(([a, b], i) => {
    const G0 = i % 2 === 1 ? H0 + 0.9 : H2 + 0.6
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = 1.0, pier = 0.9
    panel(crown, a, b, m, L / 2 - pier / 2, G0, G1, 0.05)
    panel(crown, a, b, L / 2 + pier / 2, L - m, G0, G1, 0.05)
    if (i % 2 === 1) {
      // The big circle on the long faces' glass bay.
      const { P: Q } = onWall(a, b), R = 3.6, w = 0.45, zc = (G0 + G1) / 2 + 1.2, seg = 20
      for (let k = 0; k < seg; k++) {
        const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
        const pt = (t: number, r: number): V3 => Q(L / 2 + r * Math.cos(t), zc + r * Math.sin(t), 0.1)
        trim.quad(pt(t0, R - w), pt(t1, R - w), pt(t1, R), pt(t0, R))
      }
      // and the cross bar through it
      panel(trim, a, b, L / 2 - R, L / 2 + R, zc - w / 2, zc + w / 2, 0.1)
    }
  })

  // ---- Podium: 10.8 m west block (outline), 14.3 m St. Charles block, 21.5 m north-west block.
  const outline: XY[] = [[1.79, -35.58], [-0.06, -35.1], [-4.95, -33.78], [-21.61, -29.76], [-22.13, -31.84], [-41.28, -28.47], [-38.4, -15.99], [-35.72, -4.38], [-32.52, 9.49], [-32.14, 11.12], [-31.78, 45.29], [34.77, 29.47], [35.0, -43.49], [1.77, -36.94]]
  // west block: the outline west of the tower, north and south of it to the tower's faces
  const west: XY[] = [[-21.61, -29.76], [-22.13, -31.84], [-41.28, -28.47], [-38.4, -15.99], [-35.72, -4.38], [-32.52, 9.49], [-32.14, 11.12], [-31.78, 45.29], [-22.0, 42.97], P(X0, V1), P(X0, V0)]
  prism(gran, roof, west, 0, 10.8, 0.3)
  const nw: XY[] = [[-31.0, 17.5], [-22.0, 17.5], [-22.0, 39.0], [-31.0, 41.1]]
  prism(gran, roof, nw, 0, 21.5, 0.3)
  // east block along St. Charles, and the strips north and south of the tower
  const yN = (x: number) => 45.29 + (x + 31.78) * (29.47 - 45.29) / (34.77 + 31.78)
  const yS = (x: number) => -36.94 + (x - 1.77) * (-43.49 + 36.94) / (35.0 - 1.77)
  const east: XY[] = [[X1, yS(X1)], [35.0, -43.49], [34.77, 29.47], [X1, yN(X1)]]
  prism(gran, roof, east, 0, 14.3, 0.3)
  const north: XY[] = [P(X0, V1), P(X1, V1), [X1, yN(X1)], [-22.0, yN(-22.0)]]
  prism(gran, roof, north, 0, 6.7, 0.25)
  const south: XY[] = [[-21.61, -29.76], [-4.95, -33.78], [-0.06, -35.1], [1.79, -35.58], [1.77, -36.94], [X1, yS(X1)], P(X1, V0), P(X0, V0)]
  prism(gran, roof, south, 0, 10.8, 0.3)

  // Podium windows: the arcade (dark, recessed look) at the street, a band above.
  const podWalls: [XY[], number][] = [[ccw(east), 14.3], [ccw(west), 10.8], [ccw(nw), 21.5], [ccw(south), 10.8]]
  for (const [r, h] of podWalls) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      // skip walls that sit against the tower
      const { P: Q } = onWall(a, b), m = Q(L / 2, 0, 1.0)
      const v = m[1] - S * (m[0] - XC)
      if (m[0] > X0 - 0.5 && m[0] < X1 + 0.5 && v > V0 - 0.5 && v < V1 + 0.5) continue
      const n = Math.max(1, Math.round(L / 5.5))
      const rows: [number, number][] = h > 12 ? [[0.0, 4.6], [6.0, 9.2], [10.4, h - 1.3]] : [[0.0, 4.6], [6.0, h - 1.4]]
      baysOn(win, a, b, n, 0.62, rows)
    }
  }
  void outline

  return [
    { part: gran, material: finish('psc-granite', 0xe8d2bf) },
    { part: win, material: { ...PALETTE.window, color: 0x5d7276 } },
    { part: crown, material: windowVariant(2, 0x5f7c74) },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: finish('psc-granite-light', 0xf0e0cf) },
  ]
}

if (import.meta.main) await save('nola-place-st-charles', 'Place St. Charles', [29.9520204, -90.0703508], 14.65, build(), 6500)
