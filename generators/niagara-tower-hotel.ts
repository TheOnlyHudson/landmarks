/**
 * The Tower Hotel (1962-64, built as the Seagram Tower, later the Panasonic
 * and Konica Minolta Tower), 6732 Fallsview Boulevard, Niagara Falls,
 * Ontario: procedural, CC0-1.0.
 * bun generators/niagara-tower-hotel.ts
 *
 * This file also exports the small helpers the other niagara- hotel towers
 * of this batch use (`facets`, `ringAt`, `ground`); the Tower Hotel itself
 * is only written when this file runs.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the OSM outline way/808108221,
 * 43.079086, -79.082220. y = 0 is the lowest ground under the footprint;
 * Mapterhorn shows the site flat to about 1 m.
 *
 * Identity: a slender white shaft carrying a twelve-sided glass pod that
 * flares outward as it rises, with white mullions at every facet, white
 * spandrels between the glazed bands, a solid white underside and a white
 * crown band with the antenna mast on top.
 *
 * Evidence:
 * - plan: OSM parts. Pod way/421320093 (a regular 12-gon, 12.95 m to its
 *   corners, 71-99 m); shaft way/1012633610 (a 10.6 m hexagon, 4-71 m);
 *   the white base way/1012633609 (4 m) and the canopy roof
 *   way/1012633608 (6 m).
 * - height: 99 m (325 ft) to the roof, published (Wikipedia, "List of
 *   tallest buildings in Niagara Falls, Ontario"), matching OSM.
 * - the pod's proportions from the photos below: the pod, underside
 *   included, is about 1.24 times as tall as it is wide at the top in the
 *   2019 telephoto (Sokolov), so it starts near 66 m, lower than OSM's
 *   71 m; the glazed body flares from about 0.82 of the top radius at its
 *   foot; eight glazed bands (two floors each) between white spandrels; a
 *   crown band about 3.5 m; the underside cone about 4 m.
 * - the shaft reads in every photo as a flat face with two deep vertical
 *   grooves on each side, so it is drawn as a cross in plan (11 m over
 *   all, arms 6.4 m), square to the outline, inside OSM's hexagon's span.
 * - colour: white shaft, pod frame and crown in the 2019 photos (cream in
 *   2010, since repainted); dark blue-green glass, the palette window.
 *
 * Estimated: the mast (to about 106 m), the canopy's posts, the base's
 * window band. Invented: nothing else.
 * Left out: the rooftop signs ("TOWER"; the old Konica Minolta boards), the
 * antenna cluster, railings.
 *
 * Photos (Wikimedia Commons):
 * - "Hotels at Niagara Falls, Ontario, Canada.jpg", Maksim Sokolov
 *   (maxergon.com), CC BY-SA 4.0 (from the east, 2019)
 * - "Niagara Falls - ON - Konica Minolta Tower.jpg", Taxiarchos228,
 *   CC BY 3.0 (from the west, 2010)
 * - "Embassy Suites - panoramio.jpg", Idawriter, CC BY-SA 3.0 (from the
 *   north-east)
 * No commercial imagery. No lidar: Ontario, no 3DEP coverage here.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, save, walls, type XY } from './chi-aon-center'

const D = Math.PI / 180

/** A regular n-gon ring about (cx, cy), radius r to its corners, first corner at a0 degrees. */
export function ringAt(cx: number, cy: number, r: number, n: number, a0: number): XY[] {
  return Array.from({ length: n }, (_, i) => [cx + r * Math.cos((a0 + (360 * i) / n) * D), cy + r * Math.sin((a0 + (360 * i) / n) * D)] as XY)
}

/**
 * Window panels on the facets of a lofted ring (bottom ring rb at z0, top
 * ring rt at z1, same corner count, counter-clockwise): on each facet, in
 * each band [b0, b1] (absolute heights), a panel `margin` metres in from
 * the facet's corners, `out` metres proud of the wall.
 */
export function facets(p: Part, rb: XY[], rt: XY[], z0: number, z1: number, bandsZ: [number, number][], margin = 0.6, out = 0.05, skip: (i: number) => boolean = () => false) {
  const at = (i: number, z: number): XY => {
    const t = (z - z0) / (z1 - z0)
    return [rb[i][0] + (rt[i][0] - rb[i][0]) * t, rb[i][1] + (rt[i][1] - rb[i][1]) * t]
  }
  const n = rb.length
  for (let i = 0; i < n; i++) {
    if (skip(i)) continue
    const j = (i + 1) % n
    for (const [b0, b1] of bandsZ) {
      const P = (k: number, z: number, s: number): V3 => {
        const a = at(i, z), b = at(j, z)
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
        const d = k === 0 ? margin : L - margin
        return [a[0] + u[0] * d + nn[0] * out, a[1] + u[1] * d + nn[1] * out, z]
      }
      p.quad(P(0, b0, 0), P(1, b0, 0), P(1, b1, 0), P(0, b1, 0))
    }
  }
}

/** Bilinear lookup in a terrain table (rows north to south). */
export function ground(table: number[][], x0: number, z0: number, step: number) {
  return (x: number, y: number) => {
    const fx = (x - x0) / step, fz = (-y - z0) / step
    const i = Math.max(0, Math.min(table[0].length - 2, Math.floor(fx))), k = Math.max(0, Math.min(table.length - 2, Math.floor(fz)))
    const tx = Math.min(1, Math.max(0, fx - i)), tz = Math.min(1, Math.max(0, fz - k))
    const a = table[k][i] * (1 - tx) + table[k][i + 1] * tx, b = table[k + 1][i] * (1 - tx) + table[k + 1][i + 1] * tx
    return a * (1 - tz) + b * tz
  }
}

function build() {
  const white = new Part(), win = new Part(), base = new Part(), roof = new Part(), metal = new Part()

  // ---- pod: a 12-gon about the OSM pod's centre
  const C: XY = [9.82, -4.86], A0 = -6.4, N = 12
  const R_TOP = 13.0, R_FOOT = 10.6
  const Z_UNDER = 65.5, Z_FOOT = 69.5, Z_GLASS = 95.4, Z_CROWN = 99
  const ring = (r: number) => ringAt(C[0], C[1], r, N, A0)
  // underside: from the shaft out to the glazed body's foot, solid white
  walls(white, ring(5.4), Z_UNDER - 0.5, Z_UNDER)
  walls(white, ring(5.4), Z_UNDER, Z_FOOT, ring(R_FOOT))
  cap(white, ring(5.4), Z_UNDER - 0.5, false)
  // the glazed body: a flaring frustum of white frame with glass panels
  walls(white, ring(R_FOOT), Z_FOOT, Z_GLASS, ring(R_TOP))
  const bands: [number, number][] = []
  const nb = 8, bh = (Z_GLASS - Z_FOOT - 0.3) / nb
  for (let k = 0; k < nb; k++) bands.push([Z_FOOT + 0.3 + k * bh + 0.25, Z_FOOT + 0.3 + (k + 1) * bh - 0.25])
  facets(win, ring(R_FOOT), ring(R_TOP), Z_FOOT, Z_GLASS, bands, 0.35, 0.05)
  // crown band, a little proud, with a parapet round a sunk roof
  const crown = ring(R_TOP + 0.2)
  walls(white, ring(R_TOP), Z_GLASS, Z_GLASS + 0.2, crown)
  const top = block(white, null, crown, Z_GLASS + 0.2, Z_CROWN, 0.25)
  const lip = ring(R_TOP - 0.6)
  walls(white, lip.slice().reverse(), Z_CROWN - 1.0, Z_CROWN, lip.slice().reverse())
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    white.quad([lip[i][0], lip[i][1], Z_CROWN], [top[i][0], top[i][1], Z_CROWN], [top[j][0], top[j][1], Z_CROWN], [lip[j][0], lip[j][1], Z_CROWN])
  }
  cap(roof, lip, Z_CROWN - 1.0)
  // roof plant and the mast
  block(roof, roof, ring(4.5), Z_CROWN - 1.0, Z_CROWN + 2.2, 0.3)
  block(metal, metal, ringAt(C[0], C[1], 0.55, 6, 0), Z_CROWN + 2.2, 106.5, 0)

  // ---- shaft: a cross in plan, square to the outline (turned -5.6°)
  const t = -5.6 * D, c = Math.cos(t), s = Math.sin(t)
  const H = 5.5, W = 3.2
  const cross: XY[] = [[H, -W], [H, W], [W, W], [W, H], [-W, H], [-W, W], [-H, W], [-H, -W], [-W, -W], [-W, -H], [W, -H], [W, -W]]
  const shaft = cross.map(([x, y]) => [C[0] + x * c - y * s, C[1] + x * s + y * c] as XY)
  walls(white, shaft, 0, Z_UNDER)

  // ---- base: the white podium (way/1012633609) and its canopy roof (way/1012633608)
  const podium: XY[] = [[-4.74, 9.76], [-6.89, -15.62], [-4.75, -15.82], [-4.91, -17.4], [22.85, -20.12], [25.53, 6.79], [16.69, 7.66]]
  block(base, roof, podium, 0, 4.6, 0.3)
  // glazed shopfront band on the long walls
  for (let i = 0; i < podium.length; i++) {
    const a = podium[i], b = podium[(i + 1) % podium.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.round(L / 6)
    for (let q = 0; q < k; q++) {
      const s0 = 0.8 + (q * (L - 1.6)) / k + 0.5, s1 = 0.8 + ((q + 1) * (L - 1.6)) / k - 0.5
      const P = (sx: number, z: number): V3 => [a[0] + u[0] * sx + n[0] * 0.05, a[1] + u[1] * sx + n[1] * 0.05, z]
      win.quad(P(s0, 0.6), P(s1, 0.6), P(s1, 3.3), P(s0, 3.3))
    }
  }
  const canopy: XY[] = [[-10.3, 10.3], [-10.75, 5.81], [-12.38, 3.5], [-15.28, -0.6], [-14.47, -4.85], [-12.1, -8.86], [-8.19, -15.49], [-6.89, -15.62], [-4.74, 9.76]]
  block(white, roof, canopy, 5.3, 6.0, 0.15)
  cap(white, canopy, 5.3, false)
  for (const [x, y] of [[-9.6, 8.6], [-13.6, -0.6], [-8.6, -13.8]] as XY[]) block(metal, null, ringAt(x, y, 0.3, 6, 0), 0, 5.3, 0)

  return [
    { part: white, material: finish('tower-hotel-white', 0xefece6) },
    { part: win, material: PALETTE.window },
    { part: base, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: PALETTE.metal },
  ]
}

if (import.meta.main) await save('niagara-tower-hotel', 'The Tower Hotel', [43.079086, -79.08222], 0, build())
