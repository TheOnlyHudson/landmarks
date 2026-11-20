/**
 * James B. Hunt Jr. Library, NC State University Centennial Campus,
 * Raleigh (Snøhetta with Clark Nexsen, 2013): procedural, CC0-1.0.
 * bun generators/ral-hunt-library.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 12 (the
 * long west wall). Origin: the area centroid of OSM way/177166351
 * (-78.676425, 35.769327). y = 0 is the lowest ground under the
 * footprint, the north-west corner. USGS 3DEP DEM (10 m grid, `usgs.py
 * dem`): the north side ~0–1 m, the south end ~3.5–4.5 m, the middle of
 * the east side up to ~8 m (Mapterhorn z13 agrees roughly). The map lifts
 * each low vertex by the ground under it and the upper floors by the mean
 * lift (`terrain.ts check --scene-out`), so the model is built on the
 * south end's ground: the dark base one storey (5 m) there, showing
 * taller on the lower north and partly buried on the higher east, as in
 * the photos. Elevation 0.
 *
 * OSM: way/177166351 "James B. Hunt Jr. Library" (levels 5, no height): a
 * long wedge 36–45 m wide and 138 m long, drawn from the OSM points.
 * Published: five storeys, 221,000 sq ft, opened January 2013 (NC State
 * University Libraries; Wikipedia "James B. Hunt Jr. Library").
 * No lidar covers Wake County. Heights are photo-scaled from u02 at the
 * south-west corner, over the south end's ground (~3.8 m): the dark
 * recessed ground floor 5.0 m (one storey, u02, u04; the review's
 * 4–5 m), then by pixel shares of the corner: a white band 1.0 m, the
 * glazed second floor 5.3 m, a white band 1.0 m, and the box's three upper
 * floors 13.9 m to the roof at 26.2 m over the south ground. Scaling by
 * the south front's width gives ~10% more.
 * The east terrace: NAIP shows a grey strip ~9 m wide along the east side
 * from behind the south box to two-thirds of the way north, under the
 * white main roof: drawn as a roof one floor lower (21.2 m).
 *
 * Identifying features, from the photos:
 *  - the glazed box at the south end, its three upper floors behind a
 *    thick white frame (u01, u02, u03, u04): the frame 2 m thick and 1.8 m
 *    proud, the glass dark, across the whole south end;
 *  - the long sides' white aluminium fins, so close they read as a
 *    near-solid silver skin, with a few long dark window bands that slope
 *    gently and run on round the corners (u02, u04, u06, u11): drawn as a
 *    silver wall with two solid sloping dark bands 2.4 m deep;
 *  - the glazed second floor over a white band, and the dark recessed
 *    ground floor (u02, u04, u05).
 *
 * Photos (evidence):
 *  u01–u04 "Hunt Library Exterior 1–4.JPG", Seannator, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Hunt_Library_Exterior_1.JPG (and _2, _3, _4)
 *  u05 "Hunt Library Front Entrance.JPG", Seannator, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Hunt_Library_Front_Entrance.JPG
 *  u06 "Hunt Library Siding View.JPG", Seannator, CC BY-SA 3.0 (the fins)
 *      https://commons.wikimedia.org/wiki/File:Hunt_Library_Siding_View.JPG
 *  u07–u12 "Hunt Library, NC State Univ.", Payton Chung, CC BY 2.0 (inside; u11 the fins from below)
 *      https://www.flickr.com/photos/41813589@N00/8758631495 (and 8758631355, 8759755000,
 *      8758631631, 8759757086, 8758631395)
 * Aerial: USGS NAIP (public domain): plan, roofs, the east terrace.
 * Look-only: none.
 *
 * Colours: the main roof a pale membrane (NAIP: white), the terrace grey;
 * the fins near-white aluminium, the wall behind them a silver
 * grey (the fins over glass and white panels, u04), the glass a light
 * sky grey-blue as it reads by day (u02), the ground floor dark glass.
 * Invented: the north end (no licensed exterior photo of it): fins like
 * the long sides; the window strips' exact pattern.
 * Doubts: the north half of the west side; whether the terrace roof is
 * one or two floors down; every height (photo-scaled, ±2 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, prism, capRing, onFace, flatShape, outward, finishGlb, writeModel } from './sea-tacoma-union-station'
import { grow, panel } from './nash-tennessee-state-capitol'

const RING: XY[] = [
  [-23.7, -69.2], [11.9, -71.5], [17.3, -47.3], [19.0, -39.8], [21.0, -31.0], [22.4, -25.0], [24.1, -17.6], [27.7, -1.6], [28.5, 1.8],
  [26.7, 15.4], [25.6, 24.1], [24.5, 32.8], [23.1, 45.1], [22.2, 51.5], [21.6, 56.8], [20.9, 63.6], [20.7, 67.4], [-24.4, 61.9],
  [-25.3, 24.9], [-25.4, 21.0], [-20.5, 20.0],
]
// the upper floors: the ring with the east terrace (y −58..19) cut back 9 m
const UPPER: XY[] = [
  [-23.7, -69.2], [11.9, -71.5], [14.6, -59.5], [5.6, -59.5], [12.0, -31.0], [15.1, -17.6], [18.7, -1.6], [19.5, 1.8],
  [17.4, 19.0], [26.0, 19.0], [25.6, 24.1], [24.5, 32.8], [23.1, 45.1], [22.2, 51.5], [21.6, 56.8], [20.9, 63.6], [20.7, 67.4], [-24.4, 61.9],
  [-25.3, 24.9], [-25.4, 21.0], [-20.5, 20.0],
]
const BASE = 5.0, BAND1 = 6.0, L2 = 11.3, BAND2 = 12.3, TERR = 21.2, TOP = 26.2
const BOX = -59.5 // the south box's north end

function edges(r: XY[]) {
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return { a, b, f: { o: [a[0], a[1], 0], n: outward(a, b) } as Face, L, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as XY }
  })
}

// the long sides' dark window bands, sloping gently and running on across
// the wall's corners (u02, u04): bottom z as a function of y
const BANDS: { y0: number; y1: number; z: (y: number) => number }[] = [
  { y0: -58, y1: 28, z: (y) => BAND2 + 1.4 + 0.035 * (y + 58) },
  { y0: -32, y1: 66, z: (y) => TOP - 3.6 - 0.03 * (y + 32) },
]
const BH = 2.4 // band height

function build() {
  const fin = new Part(), wall = new Part(), dark = new Part(), glass = new Part(), roof = new Part(), white = new Part()

  // ------------------------------------------------------------ the dark recessed ground floor and the bands
  const inner = grow(RING, -1.4)
  prism(dark, null, inner, 0, BASE)
  prism(fin, null, grow(RING, 0.15), BASE, BAND1)
  capRing(fin, grow(RING, 0.15), BASE, false)
  // the glazed second floor
  prism(glass, null, RING, BAND1, L2)
  for (const { f, L } of edges(RING)) {
    if (L < 4) continue
    for (let s = 3; s < L - 1; s += 3) panel(fin, f, s, 0.22, BAND1, L2, 0.08)
  }
  prism(fin, null, grow(RING, 0.15), L2, BAND2)
  capRing(fin, grow(RING, 0.15), L2, false)

  // ------------------------------------------------------------ the upper floors: the terrace level, then the top
  // the fins drawn as a near-solid silver skin (wall), the dark bands behind fins
  prism(wall, roof, RING, BAND2, TERR)
  prism(wall, white, UPPER, TERR, TOP)
  // parapet copings
  for (const { f, L } of edges(RING)) panel(fin, f, L / 2, L, TERR - 0.5, TERR, 0.12)
  for (const { f, L } of edges(UPPER)) panel(fin, f, L / 2, L, TOP - 0.6, TOP, 0.12)

  const bandFace = (f: Face, L: number, a: XY, b: XY, z0: number, z1: number, keep: (y: number) => boolean) => {
    const yAt = (s: number) => a[1] + (b[1] - a[1]) * (s / L)
    if (Math.abs(b[1] - a[1]) < 0.5 * L) {
      // an end wall: one level band
      const za = (z0 + z1) / 2 - BH / 2
      if (z1 - z0 < 6) return
      flatShape(dark, f, [[1, za], [L - 1, za], [L - 1, za + BH], [1, za + BH]], 0.05)
      return
    }
    for (const B of BANDS) {
      // s range where the band runs, kept and clear of the corners
      let s0 = -1, s1 = -1
      for (let s = 0.15; s <= L - 0.15; s += 0.2) {
        const y = yAt(s)
        if (y >= B.y0 && y <= B.y1 && keep(y)) { if (s0 < 0) s0 = s; s1 = s }
      }
      if (s0 < 0 || s1 - s0 < 2) continue
      const za = B.z(yAt(s0)), zb = B.z(yAt(s1))
      if (Math.min(za, zb) < z0 + 0.4 || Math.max(za, zb) + BH > z1 - 0.8) continue
      flatShape(dark, f, [[s0, za], [s1, zb], [s1, zb + BH], [s0, za + BH]], 0.05)
    }
  }
  const terrace = (x: number, y: number) => y > BOX && y < 19 && x > 5
  edges(RING).forEach(({ f, L, a, b }, i) => {
    if (L < 4 || i === 0) return // the south box
    // the lower block shows from BAND2 to TERR only where the upper floors step back (the terrace's east wall)
    if (!terrace(Math.max(a[0], b[0]), (a[1] + b[1]) / 2)) return
    bandFace(f, L, a, b, BAND2, TERR, (y) => y > BOX + 1)
  })
  edges(UPPER).forEach(({ f, L, a, b, m }, i) => {
    if (L < 4 || i === 0 || i === 2) return
    const setback = m[0] > 5 && m[0] < 20.5 && m[1] > BOX && m[1] < 19
    bandFace(f, L, a, b, setback ? TERR : BAND2, TOP, (y) => y > BOX + 1)
  })

  // ------------------------------------------------------------ the glazed south box with its thick white frame
  const south = edges(RING)[0]
  const sf = south.f, SL = south.L
  const FR = 2.0
  // the glass reads dark against the white frame (u02)
  panel(dark, sf, SL / 2, SL - 2 * FR, BAND2, TOP - FR, 0.02)
  // its mullions and floor lines
  for (let s = FR + 4.5; s < SL - FR - 2; s += 4.5) panel(fin, sf, s, 0.22, BAND2, TOP - FR, 0.06)
  for (const z of [BAND2 + (TOP - FR - BAND2) / 3, BAND2 + (2 * (TOP - FR - BAND2)) / 3]) panel(fin, sf, SL / 2, SL - 2 * FR, z - 0.15, z + 0.15, 0.07)
  // the frame: four bars standing 1.8 m proud
  const bar = (s0: number, s1: number, z0: number, z1: number) => {
    const P = (s: number, z: number, d: number) => onFace(sf, s, z, d)
    const D = 1.8
    fin.quad(P(s0, z0, D), P(s1, z0, D), P(s1, z1, D), P(s0, z1, D))
    fin.quad(P(s0, z1, 0), P(s0, z1, D), P(s1, z1, D), P(s1, z1, 0))
    fin.quad(P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, D), P(s0, z0, D))
    fin.quad(P(s0, z0, 0), P(s0, z0, D), P(s0, z1, D), P(s0, z1, 0))
    fin.quad(P(s1, z0, D), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, D))
  }
  bar(-0.6, SL + 0.6, TOP - FR, TOP)
  bar(-0.6, SL + 0.6, BAND2 - 0.6, BAND2 + 0.4)
  bar(-0.6, FR, BAND2 + 0.4, TOP - FR)
  bar(SL - FR, SL + 0.6, BAND2 + 0.4, TOP - FR)
  // the box's glazed sides, back to its north end
  const sw = edges(RING).find(({ b }) => b[0] === -23.7 && b[1] === -69.2)!
  const se = edges(UPPER)[1] // (11.9, −71.5) → (14.6, −59.5)
  panel(dark, sw.f, sw.L - 6, 12, BAND2 + 0.4, TOP - FR, 0.03)
  panel(dark, se.f, se.L / 2, se.L - 0.8, BAND2 + 0.4, TOP - FR, 0.03)
  panel(fin, sw.f, sw.L - 12.2, 0.6, BAND2, TOP, 0.06)

  return finishGlb('James B. Hunt Jr. Library', [
    { part: fin, material: finish('hunt-aluminium', 0xf1f1ef) },
    { part: wall, material: finish('hunt-skin', 0xdadde0) },
    { part: dark, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0x87a3b8) },
    { part: roof, material: PALETTE.roof },
    { part: white, material: finish('hunt-roof', 0xd3d7da) },
  ], { bearing: 12, height: TOP, replaces: ['way/177166351'] }, 5000)
}

if (import.meta.main) await writeModel('ral-hunt-library', build())
