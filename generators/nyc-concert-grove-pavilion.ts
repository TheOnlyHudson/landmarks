/**
 * Concert Grove Pavilion (the Oriental Pavilion), Prospect Park, Brooklyn
 * (Calvert Vaux, 1874; restored 1988) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-concert-grove-pavilion.ts
 *
 * Frame: x along the pavilion (toward 122.6°), y across it (toward 32.6°),
 * z up, metres. Placed at bearing 32.6°. Anchor: the area centroid of OSM
 * way/241846601 (-73.964140, 40.659335), which the model replaces.
 *
 * Evidence
 * - OSM way/241846601 (ODbL): an elongated octagon 25.3 × 13.7 m with
 *   4 m chamfers (taken as the eave line), height=8.1.
 * - Published (Wikipedia "Concert Grove Pavilion"; NYC Parks): Vaux's 1874
 *   open pavilion with a roof of "Hindu/Moorish" profile on slender
 *   cast-iron columns; restored 1988 after a fire, the roof re-clad.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Downtowngal, "Prospect Park Oriental Pavilion Golden Hour.jpg",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Oriental_Pavilion_Golden_Hour.jpg
 *     (long side square on: roof profile, column pairs, fascia, lamps);
 *   Downtowngal, "Prospect Park Oriental Pavilion Golden Hour 2.jpg",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Oriental_Pavilion_Golden_Hour_2.jpg
 *     (from the end, down the Concert Grove axis: the end profile and the
 *     stone terrace).
 *
 * Estimated from the frontal photo (roof 1.7× the columns' height) and OSM's
 * 8.1 m to the top cresting: terrace 0.45 m, columns to 3.25 m, fascia
 * 3.25–3.65 m; the roof one continuous bell/ogee profile lofted over the
 * octagon and smooth-shaded: a concave skirt flaring from the eave (3.65 m)
 * to a steep waist about 3.7 m in at 5.75 m, a convex bulge rolling over to
 * a short ridge (10.5 m long) at 7.9 m, with a thin cresting rail to 8.1 m.
 * Columns in pairs at x ±8.0 and ±2.6 on the long sides, singles on the ends; eight pendant lamps under the eave.
 *
 * Doubts: no photo shows the ends square on; the end columns are a guess.
 * The diamond-pattern cladding is drawn plain; cast-iron brackets and the
 * cresting's finials are left out (the cresting is a thin rail in the
 * ironwork colour). Roof shape revised after lead review (was two tiers).
 */
import { Part, type V3 } from './mesh'
import { finishModel, chamferRect, capPoly, prism } from './nyc-570-lexington'
import { box } from './nyc-prospect-park-boathouse'
import { cyl, dome, parapet } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

function build() {
  const roof = new Part(), iron = new Part(), stone = new Part(), dark = new Part(), lamp = new Part()

  // Roof profile as rings (half-length, half-width, chamfer, z), eave to top.
  // One continuous bell/ogee profile from the eave to a short ridge:
  // (inset along x, z). The skirt flares up concave from the eave, turns
  // steep at the waist, bulges back out and rolls over convex to the top.
  const prof: [number, number][] = [
    [0, 3.65], [0.9, 3.9], [1.9, 4.25], [2.8, 4.7], [3.45, 5.2], [3.75, 5.75],
    [3.65, 6.3], [3.85, 6.85], [4.5, 7.35], [5.6, 7.7], [7.4, 7.9],
  ]
  const DX = 7.4, HY1 = 0.35
  const ring = ([d, z]: [number, number]): V3[] => {
    const hx = 12.66 - d, hy = 6.85 - (d / DX) * (6.85 - HY1)
    const c = Math.min(4.0 * (hy / 6.85) * 1.05, hy * 0.95, hx * 0.5)
    return chamferRect(-hx, -hy, hx, hy, c).map(([x, y]) => [x, y, z] as V3)
  }
  const rings = prof.map(ring)
  // Smooth-shaded loft: each vertex takes the average of its neighbouring faces' normals.
  const n = rings[0].length, L = rings.length
  const fn = (k: number, i: number): V3 => {
    const a = rings[k][i], b = rings[k][(i + 1) % n], c = rings[k + 1][i]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const r: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...r) || 1
    return [r[0] / l, r[1] / l, r[2] / l]
  }
  const vn = (k: number, i: number): V3 => {
    const acc: V3 = [0, 0, 0]
    for (const kk of [k - 1, k]) for (const ii of [i - 1, i]) {
      if (kk < 0 || kk >= L - 1) continue
      const f = fn(kk, (ii + n) % n)
      acc[0] += f[0]; acc[1] += f[1]; acc[2] += f[2]
    }
    const l = Math.hypot(...acc) || 1
    return [acc[0] / l, acc[1] / l, acc[2] / l]
  }
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    roof.tri(rings[k][i], rings[k][j], rings[k + 1][j], undefined, undefined, undefined, [vn(k, i), vn(k, j), vn(k + 1, j)])
    roof.tri(rings[k][i], rings[k + 1][j], rings[k + 1][i], undefined, undefined, undefined, [vn(k, i), vn(k + 1, j), vn(k + 1, i)])
  }
  capPoly(roof, rings[L - 1].map(([x, y]) => [x, y] as [number, number]), 7.9)
  // Fine ironwork cresting along the short ridge: a thin light rail.
  parapet(iron, chamferRect(-5.2, -0.3, 5.2, 0.3, 0.25), 7.9, 8.1, 0.05)
  // Fascia (the eave beam) and the dark ceiling.
  const E = chamferRect(-12.66, -6.85, 12.66, 6.85, 4.0)
  prism({ wall: iron, win: null, roof: null, ring: E, z0: 3.25, z1: 3.65, facade: null, bevel: 0.05 })
  capPoly(dark, E, 3.25, false)

  // Stone terrace with a step.
  prism({ wall: stone, win: null, roof: stone, ring: chamferRect(-12.2, -6.4, 12.2, 6.4, 3.8), z0: 0, z1: 0.45, facade: null, bevel: 0.08 })

  // Cast-iron columns: pairs on the long sides, singles on the ends.
  const col = (x: number, y: number) => {
    box(iron, x - 0.22, y - 0.22, x + 0.22, y + 0.22, 0.45, 0.75)
    cyl(iron, x, y, 0.13, 0.75, 2.85, 6, false)
    dome(iron, x, y, [[0.13, 2.85], [0.34, 3.15], [0.34, 3.25]], 6)
  }
  for (const sy of [-1, 1]) for (const x of [-8.0, -2.6, 2.6, 8.0]) for (const d of [-0.32, 0.32]) col(x + d, sy * 5.75)
  for (const sx of [-1, 1]) for (const y of [-2.2, 2.2]) col(sx * 11.55, y)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) col(sx * 10.0, sy * 4.3)

  // Pendant lamps under the eave.
  for (const sy of [-1, 1]) for (const x of [-9.2, -3.4, 3.4, 9.2]) {
    cyl(iron, x, sy * 6.45, 0.04, 2.75, 3.25, 4)
    dome(lamp, x, sy * 6.45, [[0.05, 2.4], [0.25, 2.55], [0.22, 2.75], [0.05, 2.8]], 8)
  }

  finishModel('Concert Grove Pavilion', 'nyc-concert-grove-pavilion', [
    { part: roof, material: finish('slate-roof', 0x98a1a8) },
    { part: iron, material: finish('iron-red', 0xa5684e) },
    { part: stone, material: PALETTE.stone },
    { part: dark, material: finish('iron-dark', 0x55595e) },
    { part: lamp, material: { name: 'lamp', color: 0x6f6a5e, roughness: 0.6 } },
  ], { bearing: 32.6, osm: 'way/241846601', height: 8.1 })
}

if (import.meta.main) build()
