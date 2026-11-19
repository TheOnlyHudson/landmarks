/**
 * Plaza Tower (1001 Howard Avenue, 1969, Leonard R. Spangenberg Jr.), New
 * Orleans — original procedural geometry, CC0-1.0. Vacant since 2002.
 * bun generators/nola-plaza-tower.ts
 *
 * Plan frame: x across the tower (model east = 126.25° true), y along it
 * (model north = 36.25° true), z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/328802960,
 * 29.9463426, -90.0762935; its walls run at 36.25° / 126.25°, so the
 * catalog bearing is 36.25.
 *
 * Identity, in order: the slender shaft with close dark bronze fins running
 * its full height, white marble spandrels between them (the "checker" read
 * from the street); the dark flared crown that sweeps out over the shaft to
 * a broad flat-topped cap; the dark ribbed garage floors at the bottom of
 * the shaft; the 60 m wing with its curved face of white bands and window
 * ribbons over dark garage decks; the grey marble core on the north face;
 * the low white marble wing to the north-west.
 *
 * NOTE: the batch notes described pink/salmon striping and a pointed or
 * spired crown. No photo shows either (2021-2025 photos, all sides); this
 * model follows the photos (the lead agreed).
 *
 * Evidence:
 *  - heights: USGS 3DEP lidar LA_2021GNO_1_C22 (flown 2021-22), read in
 *    this frame with tools/lidar_frame.py; street ≈ 0.5 m above
 *    ground_min, taken as y = 0. Crown eave 154.6 m, crown top 156.6 m
 *    (159 m on rooftop gear, left out); curved wing 59.6 m (a 56 m strip
 *    at its south end); north core 65.9 m; north-west wing 18.2 m (west)
 *    and 15.0 m (east); entrance canopy 5.2 m (all measured). Published
 *    531 ft = 161.8 m, 45 floors (Wikipedia, Emporis via Wikipedia); the
 *    published figure includes rooftop gear. OSM's height=54.6 is wrong.
 *  - plan: the crown is x -13 … 19, y -29 … 9.5 in the lidar. The OSM
 *    part way/367524550 (162 m) is ~3-4 m too far west and south and too
 *    big (it seems traced from the overhang at a guess); the lidar is
 *    used. The shaft is the crown less a 3.5 m overhang each side
 *    (overhang 3.5 m: cap 1.22 × the shaft's width on the Howard Avenue photo).
 *    Curved wing, north-west wing and core from the OSM outline, checked
 *    against the lidar to ~1 m.
 *  - fins: 11 bays across the short (27 m) faces, 13 across the long
 *    (33.5 m) ones (counted on the Aug 2021 and Feb 2022 photos, ±1). Fin
 *    0.8 m wide and 0.5 m proud (estimated). Office floors 26-143 m, two
 *    storeys to a window panel (STYLE: no per-floor dot grids); the
 *    garage zone below is dark bronze with the fins continuing.
 *  - crown: short concave flare 3.5 m out over 144-148.5 m, a dark fascia
 *    with two faint light bands to the eave, low hip to the top; cap ~11 m
 *    deep (Howard Avenue photo) (Feb 2022, Jan 2023, Howard Avenue photos).
 *  - curved wing: ten office floors 25-58 m of white bands and window
 *    ribbons over dark garage decks (Feb 2022, Jan 2025 - 5, Jul 2021 - 12).
 *  - colours: marble pale warm white; fins, crown and garage dark bronze
 *    grey, held at charcoal lightness (STYLE); glass dark grey.
 *  - night: the tower is vacant, so nothing is lit: the glass is named
 *    `glass` (stays dark), not `window`.
 *
 * Photos (EVIDENCE), all Infrogmation (of New Orleans), CC BY-SA 4.0:
 *  - Plaza Tower, New Orleans, 24 Feb 2022.jpg
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower,_New_Orleans,_24_Feb_2022.jpg
 *  - Plaza Tower New Orleans 11 January 2023.jpg
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower_New_Orleans_11_January_2023.jpg
 *  - Plaza Tower New Orleans 30 January 2025 - 5.jpg (from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower_New_Orleans_30_January_2025_-_5.jpg
 *  - Plaza Tower, New Orleans, 10 August 2021 05.jpg
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower,_New_Orleans,_10_August_2021_05.jpg
 *  - Plaza Tower, New Orleans, 10 August 2021 from Howard Avenue.jpg
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower,_New_Orleans,_10_August_2021_from_Howard_Avenue.jpg
 *  - Plaza Tower and surroundings, New Orleans, July 2021 - 12.jpg
 *    https://commons.wikimedia.org/wiki/File:Plaza_Tower_and_surroundings,_New_Orleans,_July_2021_-_12.jpg
 * Look-only: none used. No commercial imagery.
 *
 * Ground: flat (street ≈ 0.5 m over the lidar minimum). elevation 0.
 *
 * Doubts: fin counts ±1; the overhang is from photos, not lidar (the
 * crown hides the shaft). The north-west wing's faces are drawn plain
 * marble with one louvre strip each (little evidence). The core's small
 * openings are left out.
 *
 * Left out: rooftop masts, the broken windows, the entrance lettering, the
 * open garage deck edges (drawn as a dark ribbed wall).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { type XY, rect, walls, cap, inset, onWall, panel, area, save } from './chi-aon-center'

const SX0 = -9.5, SX1 = 15.5, SY0 = -25.5, SY1 = 6.0 // shaft
const OV = 3.5 // crown overhang
const GAR = 26, OFF1 = 144, FLARE = 148.5, EAVE = 154.6, TOP = 156.6

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function prism(wall: Part, top: Part, r: XY[], z0: number, z1: number, bev = 0.3) {
  r = ccw(r)
  walls(wall, r, z0, z1 - bev)
  const i = inset(r, bev)
  walls(wall, r, z1 - bev, z1, i)
  cap(top, i, z1)
}
/** A box standing proud of wall a→b: s0..s1 along, z0..z1, `d` out. */
function proud(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number) {
  const { P } = onWall(a, b)
  const A = (s: number, z: number, o: number) => P(s, z, o)
  p.quad(A(s0, z0, d), A(s1, z0, d), A(s1, z1, d), A(s0, z1, d)) // front
  p.quad(A(s0, z0, 0), A(s0, z0, d), A(s0, z1, d), A(s0, z1, 0)) // side
  p.quad(A(s1, z0, d), A(s1, z0, 0), A(s1, z1, 0), A(s1, z1, d)) // side
  p.quad(A(s0, z1, d), A(s1, z1, d), A(s1, z1, 0), A(s0, z1, 0)) // top
}

function build() {
  const marble = new Part(), bronze = new Part(), glass = new Part(), roof = new Part(), grey = new Part()

  // ---- Shaft: dark garage zone, marble office zone, bronze fins.
  const shaft = rect(SX0, SY0, SX1, SY1)
  walls(bronze, shaft, 0, GAR)
  walls(marble, shaft, GAR, OFF1)
  const groups: [number, number][] = []
  const n2 = Math.round((OFF1 - GAR - 2) / 6.9), gh = (OFF1 - GAR - 2) / n2
  for (let i = 0; i < n2; i++) groups.push([GAR + 1 + i * gh + 1.8, GAR + 1 + (i + 1) * gh - 1.8])
  for (let i = 0; i < 4; i++) {
    const a = shaft[i], b = shaft[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = L > 30 ? 13 : 11, bay = L / n, fw = 0.6
    for (let k = 0; k <= n; k++) {
      const c = k * bay, s0 = Math.max(0, c - fw / 2), s1 = Math.min(L, c + fw / 2)
      proud(bronze, a, b, s0, s1, 0, OFF1, 0.5)
    }
    for (let k = 0; k < n; k++) {
      const s0 = k * bay + fw / 2 + 0.05, s1 = (k + 1) * bay - fw / 2 - 0.05
      for (const [z0, z1] of groups) panel(glass, a, b, s0, s1, z0, z1, 0.05)
    }
  }

  // ---- Crown: concave flare, fascia, low hip.
  const ring = (d: number): XY[] => rect(SX0 - d, SY0 - d, SX1 + d, SY1 + d)
  const prof: [number, number][] = [[0.5, OFF1], [1.0, 145.4], [1.8, 146.7], [2.7, 147.7], [OV, FLARE]]
  let prev = ring(0.5), pz = OFF1
  cap(bronze, ring(0.5), OFF1, false)
  for (const [d, z] of prof.slice(1)) {
    const r = ring(d)
    walls(bronze, prev, pz, z, r)
    prev = r; pz = z
  }
  walls(bronze, ring(OV), FLARE, EAVE)
  const fr = ring(OV)
  for (let i = 0; i < 4; i++) for (const z of [150.2, 152.4]) panel(grey, fr[i], fr[(i + 1) % 4], 0, Math.hypot(fr[(i + 1) % 4][0] - fr[i][0], fr[(i + 1) % 4][1] - fr[i][1]), z, z + 0.45, 0.04)
  const hip = inset(ring(OV), 6)
  walls(bronze, ring(OV), EAVE, TOP, hip)
  cap(roof, hip, TOP)

  // ---- North core (65.9 m), grey marble, against the shaft's north face.
  const core = rect(-12, SY1, 12, 12.5)
  prism(grey, roof, core, 0, 65.9, 0.3)

  // ---- Curved wing (59.6 m) to the east, from the OSM arc.
  const wing: XY[] = [[SX1, -29.6], [50.18, -29.55], [49.06, -27.07], [44.4, -19.41], [39.27, -12.55], [32.35, -4.68], [26.0, 0.9], [20.3, 6.17], [SX1, SY1]]
  const W = ccw(wing)
  walls(bronze, W, 0, 25)
  walls(marble, W, 25, 59.0)
  const wi = inset(W, 0.3)
  walls(marble, W, 59.0, 59.6, wi)
  cap(roof, wi, 59.6)
  for (let i = 0; i < W.length; i++) {
    const a = W[i], b = W[(i + 1) % W.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const { P } = onWall(a, b), m = P(L / 2, 0, 0.5)
    if (m[0] > SX0 && m[0] < SX1 + 0.6 && m[1] > SY0 && m[1] < SY1 + 0.5) continue // against the shaft
    const curved = a[0] > 19 && b[0] > 19 && Math.abs(a[1] - b[1]) > 1
    const south = Math.abs(a[1] + 29.6) < 0.2 && Math.abs(b[1] + 29.6) < 0.2
    // garage decks: vertical bronze ribs
    for (let s = 1.2; s < L - 0.6; s += 2.4) proud(bronze, a, b, s, Math.min(L - 0.3, s + 0.5), 1.5, 24.5, 0.25)
    if (south) for (let f = 0; f < 10; f++) { const z0 = 25 + f * 3.35 + 1.0; panel(glass, a, b, 0, L - 4.5, z0, z0 + 1.75, 0.05) }
    if (curved) for (let f = 0; f < 10; f++) { const z0 = 25 + f * 3.35 + 1.0; panel(glass, a, b, 0, L, z0, z0 + 1.75, 0.05) }
  }

  // ---- North-west wing: 18.2 m west block, 15.0 m east block, rooftop box.
  const nwA = rect(-34.7, 8.5, -19.5, 48.1)
  prism(marble, roof, nwA, 0, 18.2)
  const nwB: XY[] = [[-19.5, 8.5], [-12, 8.5], [-12, 12.5], [9.6, 12.6], [9.6, 15.3], [6.4, 15.3], [6.4, 18.3], [4.8, 18.3], [-19.5, 42.76]]
  prism(marble, roof, nwB, 0, 15.0)
  prism(roof, roof, rect(-31, 19, -23, 38), 18.0, 23.5, 0.2)
  // louvre strips on the long faces
  for (const [a, b] of [[nwA[3], nwA[0]], [nwB[8], nwB[0]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(bronze, a, b, L * 0.4, L * 0.4 + 2.2, 2.5, 13.5, 0.05)
  }

  // ---- Entrance canopy on the south face (5.2 m).
  const can = rect(-4, -33, 7, SY0)
  prism(bronze, roof, can, 4.4, 5.2, 0.15)
  for (const x of [-3.5, 6.5]) prism(bronze, bronze, rect(x - 0.2, -32.7, x + 0.2, -32.3), 0, 4.4, 0)

  return [
    { part: marble, material: finish('pt-marble', 0xebe6dc) },
    { part: bronze, material: finish('pt-bronze', 0x56534f) },
    { part: glass, material: { name: 'glass', color: 0x66707a, roughness: 0.3 } },
    { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
    { part: grey, material: finish('pt-grey-marble', 0xc9c6c0) },
  ]
}

if (import.meta.main) await save('nola-plaza-tower', 'Plaza Tower', [29.9463426, -90.0762935], 36.25, build(), 6500)
