/**
 * The Ascent at Roebling's Bridge, 1 Roebling Way, Covington, Kentucky
 * (2008, Daniel Libeskind) — original procedural geometry, CC0-1.0.
 * bun generators/cin-ascent.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0. Anchor = centroid of OSM way/80307110,
 * -84.509547, 39.089331.
 *
 * Identity (from the photos below):
 *  1. The crescent plan cut by one inclined plane: the roof rises from
 *     the low west end to a blade-sharp point at the south tip, so the
 *     roofline sweeps up in a curve from every side.
 *  2. White and silver panels broken by irregular, jogging vertical
 *     stripes of bright blue glass.
 *  3. A dark steel frame along the sloped roof edge.
 *  4. A low podium in the crook of the crescent.
 *
 * Plan: OSM way/80307110 (bearing 0, about the anchor), the low podium
 * (parts 1458781259, 1458781260) cut out of it along their shared edge.
 * The balcony bumps on the outline are kept in the tower's plan.
 *
 * Heights: USGS 3DEP lidar KY_FullState (KyFromAbove statewide lidar,
 * flown 2019–2022; the service gives no tile year), 1 m grid. The roof is
 * a plane: a robust least-squares fit over 1,416 roof cells gives
 * z = 65.65 + 0.449 x − 0.512 y above ground_min (rms 0.31 m). y = 0 is
 * put at ground_min + 1.9 (the west end's ground), so the roof here is
 * z = 63.75 + 0.449 x − 0.512 y: 46.5 at the west end, 89.5 at the
 * south tip (OSM: 49 and 89). The tip carries a needle to about 95.9
 * (measured, two cells). The podium roof is about 6 (measured).
 * Estimated from the photos: the stripe pattern (drawn from a fixed
 * pseudo-random sequence, not traced panel by panel), the steel rim.
 *
 * Ground: the site falls about 4 m from east to west (Mapterhorn and
 * lidar); elevation 0, the east walls sink into the slope.
 *
 * Night: the glass stripes are the residential curtain wall and glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - AscentAtRB.jpg, Studio Daniel Libeskind, CC BY 3.0 (from the
 *    south-west along the street: the blade tip and the white and blue
 *    stripes)
 *    https://commons.wikimedia.org/wiki/File:AscentAtRB.jpg
 *  - Ascent at Roebling Bridge, Covington, KY - 33760899908.jpg, Warren
 *    LeMay, CC0 (the curved glass face with its balconies and the steel
 *    roof frame)
 *    https://commons.wikimedia.org/wiki/File:Ascent_at_Roebling_Bridge,_Covington,_KY_-_33760899908.jpg
 *  - Ascent at Roebling Bridge, Covington, KY - 47638338761.jpg, Warren
 *    LeMay, CC0 (the tip edge-on)
 *    https://commons.wikimedia.org/wiki/File:Ascent_at_Roebling_Bridge,_Covington,_KY_-_47638338761.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the stripes are a pattern in the building's spirit, not a
 * trace of the real panel layout; the stacked balconies are left out
 * (fine, per-floor detail); the lowest ground under the footprint is
 * taken from the lidar to about 1 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, onWall, prism, save, type XY } from './atl-tech-tower'

const wallP = new Part(), glass = new Part(), roof = new Part(), steel = new Part()

const Z = (x: number, y: number) => 63.75 + 0.449 * x - 0.512 * y

// the tower's plan, counter-clockwise: the outline with the podium cut out
const T: XY[] = [
  [20.6, -24.2], [23.6, -18.2], [23.6, -16.9], [23.6, -15.3], [23.2, -10.9], [25.9, -10.4], [25.0, -5.7], [22.3, -6.4],
  [19.9, -0.6], [19.2, 0.7], [18.8, 1.8], [20.9, 3.0], [18.4, 7.0], [16.3, 5.9], [15.2, 7.3], [14.3, 8.5], [12.6, 10.5],
  [14.3, 11.9], [10.3, 15.5], [8.9, 14.0], [6.5, 15.8], [5.7, 16.2], [6.8, 18.3], [0.6, 21.6], [-0.4, 19.3], [-1.7, 19.9],
  [-3.1, 20.5], [-6.1, 21.2], [-5.3, 24.0], [-9.9, 25.0], [-10.4, 22.3], [-11.9, 22.6], [-13.3, 22.9], [-16.3, 23.1],
  [-19.2, 23.1], [-19.4, 25.6], [-26.1, 24.6], [-25.6, 21.9], [-27.0, 21.6], [-22.9, 0.1], [-21.1, 0.0], [-19.6, -0.1],
  [-18.0, -0.4], [-16.5, -0.8], [-15.0, -1.2], [-12.2, -1.9],
  [-9.3, -3.0], [-7.8, -3.8], [-6.3, -4.6], [-5.0, -5.2], [-2.3, -6.9], [0.1, -8.8], [1.1, -10.0], [4.4, -13.4],
  [5.2, -14.6], [6.1, -15.9], [7.0, -17.2], [8.5, -19.8], [9.3, -21.3], [10.3, -24.1], [10.8, -25.7], [12.3, -33.2],
  [12.4, -37.5], [12.5, -39.4], [14.8, -35.2], [17.1, -31.1], [17.8, -29.8], [19.9, -25.7],
]
const PODIUM: XY[] = [[-12.2, -1.9], [-16.5, -17.4], [4.4, -13.4], [1.1, -10.0], [0.1, -8.8], [-2.3, -6.9], [-5.0, -5.2], [-6.3, -4.6], [-7.8, -3.8], [-9.3, -3.0]]

/** A deterministic pseudo-random sequence, so the stripes don't change between builds. */
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

// ── walls up to the roof plane ──
const n = T.length
for (let i = 0; i < n; i++) {
  const a = T[i], b = T[(i + 1) % n]
  const za = Z(a[0], a[1]), zb = Z(b[0], b[1])
  wallP.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za])
  // the steel rim along the roof edge: an outer face, an inner face and a top
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const o = (p: XY, d: number): XY => [p[0] + nn[0] * d, p[1] + nn[1] * d]
  const A0 = o(a, 0.12), B0 = o(b, 0.12), A1 = o(a, -0.45), B1 = o(b, -0.45)
  const h = 1.1
  steel.quad([A0[0], A0[1], za - 0.5], [B0[0], B0[1], zb - 0.5], [B0[0], B0[1], zb + h], [A0[0], A0[1], za + h])
  steel.quad([B1[0], B1[1], zb], [A1[0], A1[1], za], [A1[0], A1[1], za + h], [B1[0], B1[1], zb + h])
  steel.quad([A0[0], A0[1], za + h], [B0[0], B0[1], zb + h], [B1[0], B1[1], zb + h], [A1[0], A1[1], za + h])

  // glass stripes: irregular widths, jogging sideways every few storeys
  if (L < 0.9) continue
  if (L < 3.2) {
    // a short facet (the curved faces are many): glass or panel as a whole, in storey groups
    if (rnd() < 0.5) continue
    let z = 1.2
    while (z < Math.min(za, zb) - 4) {
      const z1 = Math.min(z + 6 + rnd() * 10, Math.min(za, zb) - 1.6)
      onWall(glass, a, b, [[0.2, z], [L - 0.2, z], [L - 0.2, z1], [0.2, z1]], 0.06)
      z = z1 + (rnd() < 0.5 ? 3.0 : 0.9)
    }
    continue
  }
  let s = 0.35 + rnd() * 0.9
  while (s < L - 1.2) {
    const w = Math.min(1.3 + rnd() * 2.4, L - 0.6 - s)
    if (w < 0.7) break
    let z = 1.2
    let jog = 0
    while (true) {
      const hz = 7.5 + rnd() * 9
      const s0 = Math.max(0.35, s + jog), s1 = Math.min(L - 0.35, s + jog + w)
      const top = (q: number) => za + ((zb - za) * q) / L - 1.6
      const z1 = Math.min(z + hz, Math.min(top(s0), top(s1)))
      if (z1 - z < 2.5 || s1 - s0 < 0.5) break
      const last = z + hz >= Math.min(top(s0), top(s1))
      const pts: [number, number][] = last ? [[s0, z], [s1, z], [s1, top(s1)], [s0, top(s0)]] : [[s0, z], [s1, z], [s1, z1], [s0, z1]]
      onWall(glass, a, b, pts, 0.06)
      if (last) break
      z = z1 + (rnd() < 0.35 ? 3.0 : 0)
      jog = (rnd() - 0.5) * 1.4
    }
    s += w + 0.6 + rnd() * 1.3
  }
}

// ── the inclined roof: the plan triangulated, each vertex lifted to the plane ──
{
  const flat = new Part()
  capPoly(flat, T, 0, true)
  for (let k = 0; k < flat.pos.length; k += 9) {
    const v = (j: number): V3 => { const x = flat.pos[k + j * 3], y = -flat.pos[k + j * 3 + 2]; return [x, y, Z(x, y)] } // pos is stored in the glTF frame (x, z, -y)
    roof.tri(v(0), v(1), v(2))
  }
}
// the needle at the south tip
{
  const tip: XY = [12.5, -39.4], zt = Z(tip[0], tip[1])
  const p: XY[] = [[12.35, -37.6], [13.4, -37.9], tip]
  const top: V3 = [12.75, -38.6, 95.9]
  for (let i = 0; i < 3; i++) {
    const a = p[i], b = p[(i + 1) % 3]
    wallP.tri([a[0], a[1], Z(a[0], a[1]) - 0.5], [b[0], b[1], Z(b[0], b[1]) - 0.5], top)
  }
  void zt
}

// ── the podium in the crook ──
prism(wallP, PODIUM, 0, 6.0, roof, 0.3)
{
  const m = PODIUM.length
  for (let i = 0; i < m; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % m], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    // skip the edge against the tower
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (mid[1] > -12 && mid[0] > -12) continue
    onWall(glass, a, b, [[0.8, 0.6], [L - 0.8, 0.6], [L - 0.8, 4.6], [0.8, 4.6]], 0.06)
  }
}

await save('cin-ascent', "The Ascent at Roebling's Bridge", [
  { part: wallP, material: finish('cin-ascent-panel', 0xeceef0) },
  { part: glass, material: { name: 'window', color: 0x4c80c2, roughness: 0.35 } },
  { part: roof, material: PALETTE.roof },
  { part: steel, material: finish('cin-ascent-steel', 0x6b737c) },
], { height: 95.9, anchor: [39.089331, -84.509547], bearing: 0 }, 6500)
