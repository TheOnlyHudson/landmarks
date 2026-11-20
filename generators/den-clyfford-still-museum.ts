/**
 * Clyfford Still Museum, Denver (2011, Allied Works Architecture, Brad
 * Cloepfil) — original procedural geometry, CC0-1.0.
 * bun generators/den-clyfford-still-museum.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.989864, 39.736276,
 * the centroid of OSM way/315709021; bearing 0.
 *
 * Identity (photos below):
 *  1. A closed two-storey block of board-formed grey concrete with vertical
 *     fins, almost windowless.                       (t0, t1, d2, tomb)
 *  2. The upper storey cantilevers over a recessed, glazed ground floor at
 *     one corner, a deep shadowed overhang.            (csm, tomb, d2, d3)
 *  3. A few deep-set punched windows, and a roof of concrete coffers with
 *     skylights.                                     (t0, t1, aerial)
 *
 * Plan: OSM way/315709021 (40 by 36 m). Its parts (way/590820197 4–9 m,
 * way/590820198 6 m, way/590820644 9 m, way/635389190 10 m) are all under
 * the lidar, which shows one roof over the whole outline; the lidar was used.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid,
 * ground_min 1596.42 m; y = 0 is 0.4 m above it (the street on the west;
 * the east side is about 1 m higher). Measured: the roof rim 13.3; the
 * skylit roof wells about 11 (drawn as skylight glass on the roof; the glass
 * returned no points). Estimated: the ground floor's height (4.5) and its
 * 3 m recess under the west and north fronts, from the photos (tomb, d1); the fins (0.35 m ribs every 1.5 m, drawn
 * bolder than the real boards so they read); the window positions.
 *
 * Photos (evidence):
 *  csm   "Clyfford Still Museum by CSM staff.jpg", Sandersenvie, CC BY-SA 4.0
 *        (Wikimedia Commons)
 *  t0,t1 "GlyffordStillMuseum.jpg", "GlyffordStillMuseum1.jpg", Trueshow111,
 *        CC0 (Wikimedia Commons)
 *  d1–d3 "Clyfford Still Museum, Denver", danxoneil, CC BY 2.0 (Flickr
 *        9755156732, 9755416043, 9755121891)
 *  tomb  "Clyfford Still Museum", tombdmot, CC BY 2.0 (Flickr 6094238626)
 *  aerial USGS NAIP orthophoto (public domain)
 * Look-only (CC BY-NC-SA / NC-ND, seen, not relied on): jakobnewman's
 * "Clyfford Still Museum" series and rverc's "Entrance ... CS!M" on Flickr.
 * The photos' directions are unsure (trees and lawn on every side): the
 * recessed glazed corner is placed at the north-west by the Bannock St
 * entrance (address 1250 Bannock St), which no photo pins down.
 * No commercial imagery.
 *
 * Night: the ground-floor glazing glows; the concrete is not floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, offset, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { split } from './atl-flatiron-building'

const conc = new Part(), roof = new Part(), win = new Part(), glass = new Part()

const ring: XY[] = ccw([[-18.46, 19.68], [-5.87, 19.71], [21.88, 20.33], [21.42, 6.22], [22.26, -15.61], [8.64, -15.66], [-13.51, -15.74], [-18.35, -15.75], [-18.39, -2.9]])
const simple: XY[] = ccw([[-18.4, 19.7], [21.9, 20.3], [22.26, -15.61], [-18.35, -15.75]])
const G = 4.5, TOP = 13.3

// the ground floor: concrete on the south and east, recessed 3 m under the
// upper block on the west (Bannock St entrance) and north, glazed there
const foot: XY[] = ccw([[-15.4, -15.72], [22.26, -15.61], [21.98, 17.3], [-15.4, 17.2]])
prism(conc, split(foot, 5), 0, G, null, 0)
onWall(win, foot[2], foot[3], rectShape(0.4, 36.9, 0.3, G - 0.3), 0.06)
onWall(win, foot[3], foot[0], rectShape(0.4, 32.5, 0.3, G - 0.3), 0.06)
// the upper block, its soffit and roof
prism(conc, simple, G, TOP, roof, 0.35)
// the soffit over the recess
capPoly(conc, simple, G, false)
// skylight wells on the roof
for (const [x0, x1, y0, y1] of [[1, 19, -13, 5], [-16, -8, 1, 16]]) {
  for (let x = x0; x < x1 - 1; x += 3.6) capPoly(glass, [[x, y0], [x + 1.4, y0], [x + 1.4, y1], [x, y1]], TOP + 0.04, true)
}

// a few deep-set punched windows (t0, t1, d2)
const wins: [number, number, number, number, number][] = [
  // [edge, s0, s1, z0, z1]
  [0, 4, 8.5, 7, 11], [0, 30, 31.6, 8, 11.5], [1, 6, 7.6, 7.5, 11.5], [2, 12, 16, 7, 11], [3, 22, 23.6, 7.5, 11.5],
]
for (const [e, s0, s1, z0, z1] of wins) {
  const a = simple[e], b = simple[(e + 1) % simple.length]
  onWall(win, a, b, rectShape(s0, s1, z0, z1), 0.06)
}

// vertical fins on the upper walls (the board-formed ribs, drawn bold)
for (let i = 0; i < simple.length; i++) {
  const a = simple[i], b = simple[(i + 1) % simple.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  for (let s = 1.2; s < L - 1; s += 1.5) {
    if (wins.some(([e, w0, w1]) => e === i && s > w0 - 0.4 && s < w1 + 0.4)) continue
    const s0 = s - 0.18, s1 = s + 0.18, d = 0.22, z0 = G + 0.3, z1 = TOP - 0.5
    conc.quad(P(s0, d, z0), P(s1, d, z0), P(s1, d, z1), P(s0, d, z1))
    conc.quad(P(s0, 0, z0), P(s0, d, z0), P(s0, d, z1), P(s0, 0, z1))
    conc.quad(P(s1, d, z0), P(s1, 0, z0), P(s1, 0, z1), P(s1, d, z1))
  }
}

void ring
await save('den-clyfford-still-museum', 'Clyfford Still Museum', [
  { part: conc, material: finish('still-concrete', 0xc2bcb2) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], { height: TOP, anchor: [39.736276, -104.989864], bearing: 0 })
