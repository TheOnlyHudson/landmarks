/**
 * Dominion Energy, 600 Canal Place (2019), Richmond, Virginia — original
 * procedural geometry, CC0-1.0.
 * bun generators/ric-dominion-energy-600-canal.ts
 *
 * This file also exports `slopedPrism` and `curtainLines`, which
 * ric-gateway-plaza uses.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/735392154 (the podium,
 * building=garage, 4 levels), 37.538296,-77.439762. Its sides run at 37.5° /
 * 127.5°, so the catalog bearing is 37.5 (+y = 37.5°, +x = 127.5°, down
 * Canal Street to the south-east).
 *
 * Identity, in order: a slab of reflective sky-blue glass on a plan with two
 * gently convex long faces; its roof line rising toward the south-east end,
 * where a narrower glass fin stands highest; the low four-storey podium
 * behind it, grey panels and glass under a green roof.
 *
 * Evidence:
 *  - plan: OSM. Podium outline way/735392154; tower part way/735392153
 *    (building:part, "Dominion Energy HQ", height 127.102). Turned into this
 *    frame. The tower part sits on the podium's south-west side.
 *  - heights: not in the lidar (USGS_LPC_VA_Sandy_2014_LAS_2015 was flown
 *    about 2014; the tower opened in 2019). Published: 417 ft / 127.2 m, 20
 *    floors (Wikipedia, List of tallest buildings in Richmond); OSM 127.1.
 *    The fin is taken to the published 127.1 m. The main slab's roof is
 *    estimated from the two photos: rising from ~100 m at the north-west end
 *    to ~117 m against the fin (photo-scaled, ±5 m). Podium 18 m (four
 *    levels, photo-scaled).
 *  - which end is tall: in APK's elevated photo from the east the fin with
 *    the masts is at the south-east end; Lluck002's street photo from the
 *    south-west shows the convex south-west face's top rising to the same
 *    end.
 *  - colours: the glass reads pale sky blue in both daylight photos; a light
 *    window variant with pale trim lines for the curtain wall's floor groups
 *    and mullions. Podium: light grey panels, green roof.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - 600_Canal_Place_-_Richmond.jpg, APK, CC BY 4.0 (elevated, from the
 *    east). https://commons.wikimedia.org/wiki/File:600_Canal_Place_-_Richmond.jpg
 *  - 600_Canal_Place.jpg, Lluck002, CC BY-SA 4.0 (street level, south-west).
 *    https://commons.wikimedia.org/wiki/File:600_Canal_Place.jpg
 *  - Richmond,_Virginia_Skyline_March_2025.jpg, Bdl2001, CC BY 4.0 (from the
 *    south, across the James; distant).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only two close photos exist, so the roof heights of the slab are
 * estimates and the north-west end is unphotographed. The diagonal fritted
 * pattern of the glass and the rooftop masts are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, walls, cap, panel, save, triangulate } from './chi-aon-center'

/** Walls from z0 up to a roof that follows top(x, y), and that roof. */
export function slopedPrism(wall: Part, roof: Part | null, r: XY[], z0: number, top: (p: XY) => number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top(b)], [a[0], a[1], top(a)])
  }
  if (roof) for (const [i, j, k] of triangulate(r)) {
    const P = (p: XY): V3 => [p[0], p[1], top(p)]
    roof.tri(P(r[i]), P(r[j]), P(r[k]))
  }
}

/**
 * Pale floor-group and mullion lines on a curtain wall: horizontal bands
 * every `dz` from z0 up to under the roof, vertical lines every `dx` along
 * each wall, all just proud of the glass.
 */
export function curtainLines(p: Part, r: XY[], z0: number, top: (p: XY) => number, dz: number, dx: number, w = 0.35) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1) continue
    const zt = Math.min(top(a), top(b)) - 0.8
    for (let z = z0; z < zt; z += dz) panel(p, a, b, 0, L, z, z + w, 0.06)
    const n = Math.max(1, Math.round(L / dx))
    for (let k = 1; k < n; k++) {
      const s = (L * k) / n, q: XY = [a[0] + (b[0] - a[0]) * s / L, a[1] + (b[1] - a[1]) * s / L]
      panel(p, a, b, s - w / 2, s + w / 2, z0, Math.min(top(a), top(b), top(q)) - 0.6, 0.06)
    }
  }
}

const PODIUM: XY[] = [[-31.7, -46.3], [-27.2, -47.1], [-21.2, -48.2], [-12.5, -49.2], [-2.7, -49.8], [9.5, -49.8], [20.2, -48.9], [31.3, -47.0], [36.7, -45.3], [36.9, -33.6], [38.4, 47.2], [-39.3, 45.5], [-39.6, -12.2], [-39.6, -24.1], [-32.9, -24.0], [-33.2, -34.3], [-31.2, -34.1]]
// Tower part, split at x = 27.1 into the slab and the south-east fin.
const SLAB: XY[] = [[-32.4, -10.7], [-39.6, -12.2], [-39.6, -24.1], [-32.9, -24.0], [-33.2, -34.3], [-31.2, -34.1], [-31.7, -46.3], [-27.2, -47.1], [-21.2, -48.2], [-12.5, -49.2], [-2.7, -49.8], [9.5, -49.8], [20.2, -48.9], [27.1, -47.7], [27.1, -33.0], [26.8, -23.7], [28.6, -23.5], [28.7, -11.5], [21.9, -10.2], [14.5, -9.1], [3.9, -8.3], [-15.9, -8.4], [-24.7, -9.3]]
const FIN: XY[] = [[27.1, -47.7], [31.3, -47.0], [36.7, -45.3], [36.9, -33.6], [27.1, -33.0]]

function build() {
  const glass = new Part(), trim = new Part(), roof = new Part(), pan = new Part(), win = new Part(), green = new Part()
  const POD = 18, FIN_TOP = 127.1, LOBBY = 9.0
  const slabTop = (p: XY) => 100 + ((p[0] + 39.6) / (28.7 + 39.6)) * 17
  const finTop = () => FIN_TOP

  // Podium: the whole outline, grey panels with glass bands, green roof.
  // Walls only where the podium shows: its other edges are the tower's own
  // faces (indices 0-9 and 13-16), drawn in glass below.
  for (const i of [10, 11, 12]) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length]
    pan.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], POD], [a[0], a[1], POD])
  }
  cap(green, PODIUM, POD)
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 30) continue // the south-west edges are under the tower
    const n = Math.round(L / 7.5), w = L / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[1.0, 8.0], [9.6, 16.4]]) panel(win, a, b, k * w + 0.8, (k + 1) * w - 0.8, z0, z1, 0.05)
  }

  // Tower: the slab and the fin, glass walls with pale lines.
  slopedPrism(glass, roof, SLAB, 0, slabTop)
  slopedPrism(glass, roof, FIN, 0, finTop)
  curtainLines(trim, SLAB, LOBBY, slabTop, 25.2, 12.0, 0.6)
  curtainLines(trim, FIN, LOBBY, finTop, 25.2, 12.0, 0.6)
  // A pale coping round each roof edge.
  for (const [r, t] of [[SLAB, slabTop], [FIN, finTop]] as [XY[], (p: XY) => number][]) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.5) continue
      const za = t(a), zb = t(b)
      const n: XY = [(b[1] - a[1]) / L * 0.06, -(b[0] - a[0]) / L * 0.06]
      trim.quad([a[0] + n[0], a[1] + n[1], za - 1.0], [b[0] + n[0], b[1] + n[1], zb - 1.0], [b[0] + n[0], b[1] + n[1], zb], [a[0] + n[0], a[1] + n[1], za])
    }
  }

  return [
    { part: glass, material: windowVariant(2, 0xa3bacd) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: pan, material: finish('dom-panel', 0xd8dbdb) },
    { part: win, material: PALETTE.window },
    { part: green, material: finish('dom-green-roof', 0xa3b08c) },
  ]
}

if (import.meta.main) await save('ric-dominion-energy-600-canal', 'Dominion Energy 600 Canal Place', [37.538296, -77.439762], 37.5, build())
