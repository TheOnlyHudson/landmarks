/**
 * Steinhardt Conservatory, Brooklyn Botanic Garden — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-bbg-steinhardt-conservatory.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * −8.5°, the axis of the conservatory range and of the pavilions' straight
 * sides (OSM). Anchor: the middle of the 1988 complex, between the three
 * pavilions and the range (-73.96215, 40.66604).
 *
 * What it covers: the three glass pavilions of the 1988 Steinhardt
 * Conservatory (Davis, Brody & Associates) — Tropical, Warm Temperate and
 * Desert — and the long glasshouse range on the Washington Avenue side with
 * its lower level, from its south end north to the 1917 Palm House's south
 * (café) wing, which nyc-bbg-palm-house draws. The courtyard's lily pools are
 * the map's (water), not modelled.
 *
 * Identifying features (from the photos): three octagonal (clipped-diamond)
 * glass pavilions with pale green-white frames, vertical glass walls under a
 * steep (≈45°) glass pyramid crowned by a square glass lantern, all framed
 * in dark green-grey (unlike the 1917 Palm House's white), the Tropical
 * Pavilion much the biggest; the long double-ridged glass range with a hipped glass
 * crossing in the middle; everything glass over a stone base, the pavilions
 * sunk a storey below the courtyard.
 *
 * Evidence
 * - OSM: way/250230007 (Tropical Pavilion, 27.7 m across, height 18.4),
 *   way/250230006 (Warm Temperate, 19.8 m, 12.8), way/250229993 (Desert,
 *   19.8 m, 14.7), the conservatory outline way/250230005 (12.8; its south
 *   74 m are the range, 21.5 m wide), way/487485088 (canteen kiosk between
 *   the pavilions, not covered: left to the map).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid in the model frame
 *   (ground_min 29.04 m): courtyard 35.5 m; pavilion floors ≈32.3 m (sunk
 *   3.2 m); tops (frame returns): Tropical 50.1, Warm Temperate 47.4,
 *   Desert 47.1 m; range ridges 39–43 m, the crossing ≈45 m; ground east of
 *   the range 31 m and at its south end ≈30 m.
 * - Map terrain (Mapterhorn): the lowest ground under the footprint is at
 *   the range's south-east corner, 29.5 m (the map's own check), the
 *   model's y = 0. So the courtyard level is COURT = 6.0 and the pavilion
 *   floors 2.8 (Warm Temperate 3.5, from the terrain there).
 * - USGS NAIP (public domain, 0.12 m): the pavilions' plans with their
 *   central square lanterns and eight hips; the range as two parallel glass
 *   ridge ranges with a hipped glass crossing at y ≈ −1…11.
 * - Photos (Wikimedia Commons), credits in
 *   ~/landmarks-scratch/bkn/work/nyc-bbg-steinhardt-conservatory/photos/
 *   credits.txt: the Tropical Pavilion from the garden (Elisa.rolle,
 *   CC BY-SA 3.0, "Prospect Park Botanic Gardens 093.JPG"), a pavilion from
 *   the courtyard pool (Rhododendrites, CC BY-SA 4.0, "Brooklyn Botanic
 *   Garden conservatory (60594).jpg"), the pavilion roof and lantern from
 *   inside (Rabiul_Hasan_Lincoln, CC BY-SA 3.0, "-gallery- conservatory
 *   roof- …jpg"), the courtyard (Vallue, CC BY-SA 4.0, "Steinhardt
 *   Conservatory Brooklyn Botanic Garden.jpg"), interiors (Daderot, CC0).
 *
 * Measured: plans (OSM, NAIP), floor, courtyard and top heights (lidar,
 * terrain). Estimated from the photos: the split of each pavilion's height
 * into wall (Tropical 6.2 m, Desert 5.4, Warm Temperate 5.0), pyramid
 * (8.4 / 6.0 m, about 45° as in Rhododendrites' courtyard photo) and lantern
 * (2.6 / 2.4 m); the lidar tops cap the total, so the steeper roofs were
 * paid for by lower walls and lanterns and a lantern 30% of the pavilion's
 * size; the frame colour, dark green-grey (photos, pulled light); the frame
 * rhythm (drawn bold, ~2.4 m, not the real bars); the range's eaves and
 * ridges (2.6 / 5.8 m over the courtyard) and the crossing (8.5 m).
 *
 * Doubts: the range's east and south faces (its exposed lower level, on
 * Washington Avenue and the service yard) have no licensed photo; drawn as
 * plain stone. NAIP shows the west range's south half darker: drawn as
 * glass like the rest. The pavilion floors and the courtyard step are from
 * lidar ground under glass.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel } from './nyc-570-lexington'
import { oq, strip, glassRange, unit3 } from './nyc-bbg-palm-house'

const stone = new Part(), frame = new Part(), glass = new Part()
const COURT = 6.0

/** A clipped-diamond octagon: half-extent h, half short side s, counter-clockwise. */
const oct = (cx: number, cy: number, h: number, s: number, z: number): V3[] => ([
  [cx - s, cy - h], [cx + s, cy - h], [cx + h, cy - s], [cx + h, cy + s], [cx + s, cy + h], [cx - s, cy + h], [cx - h, cy + s], [cx - h, cy - s],
] as XY[]).map(([x, y]) => [x, y, z] as V3)

function pavilion(cx: number, cy: number, h: number, s: number, floor: number, wallH: number, roofH: number, lanH: number) {
  const k = 0.3, W = 0.4
  const z1 = floor + 0.6, E = z1 + wallH, T = E + roofH, L = T + lanH
  // stone base from the lowest ground
  const base0 = oct(cx, cy, h + 0.12, s, 0), base1 = oct(cx, cy, h + 0.12, s, z1)
  stone.loft([base0, base1])
  // glass walls, the frames on them
  const w0 = oct(cx, cy, h, s, z1), w1 = oct(cx, cy, h, s, E)
  glass.loft([w0, w1])
  for (let i = 0; i < 8; i++) {
    const a = w0[i], b = w0[(i + 1) % 8], len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], n: V3 = [t[1], -t[0], 0]
    const n_ = Math.max(1, Math.round(len / 2.4))
    for (let j = 0; j <= n_; j++) {
      const sAt = j === 0 ? W : j === n_ ? len - W : (len * j) / n_
      const p: V3 = [a[0] + t[0] * sAt, a[1] + t[1] * sAt, 0]
      strip(frame, [[p[0], p[1], z1], [p[0], p[1], E]], t, j === 0 || j === n_ ? W * 2 : W * 0.8, () => n)
    }
    // the low solid band, a mid transom and the eave band
    for (const [za, zb] of [[z1, z1 + 1.1], [z1 + wallH * 0.55 - 0.15, z1 + wallH * 0.55 + 0.15], [E - 0.45, E + 0.05]]) {
      const P = (s_: number, z: number): V3 => [a[0] + t[0] * s_ + n[0] * 0.08, a[1] + t[1] * s_ + n[1] * 0.08, z]
      oq(frame, P(0, za), P(len, za), P(len, zb), P(0, zb), n)
    }
  }
  // glass pyramid to the lantern; hips and two purlin rings
  const r1 = oct(cx, cy, h * k, s * k, T)
  glass.loft([w1, r1])
  for (let i = 0; i < 8; i++) {
    const p = w1[i], q = r1[i], d = unit3([p[0] - cx, p[1] - cy, 0])
    strip(frame, [p, q], [-d[1], d[0], 0], W * 1.6, (u, v) => { const dz = v[2] - u[2], dh = Math.hypot(v[0] - u[0], v[1] - u[1]); return unit3([d[0] * dz, d[1] * dz, dh]) })
  }
  for (const f of [0.36, 0.7]) {
    const ring = oct(cx, cy, h * (1 - f * (1 - k)), s * (1 - f * (1 - k)), E + roofH * f)
    for (let i = 0; i < 8; i++) {
      const a = ring[i], b = ring[(i + 1) % 8], t = unit3([b[0] - a[0], b[1] - a[1], 0]), n: V3 = [t[1], -t[0], 0]
      const up = unit3([n[0] * roofH, n[1] * roofH, h * (1 - k)])
      const A: V3 = [a[0] + up[0] * 0.07, a[1] + up[1] * 0.07, a[2] + up[2] * 0.07], B: V3 = [b[0] + up[0] * 0.07, b[1] + up[1] * 0.07, b[2] + up[2] * 0.07]
      const dn: V3 = [-n[0] * 0.35, -n[1] * 0.35, 0.35 * roofH / (h * (1 - k))]
      oq(frame, A, B, [B[0] + dn[0], B[1] + dn[1], B[2] + dn[2]], [A[0] + dn[0], A[1] + dn[1], A[2] + dn[2]], up)
    }
  }
  // the square glass lantern with a white frame and a flat cap
  const l1 = oct(cx, cy, h * k, s * k, L)
  glass.loft([r1, l1])
  for (let i = 0; i < 8; i++) {
    const p = r1[i], d = unit3([p[0] - cx, p[1] - cy, 0])
    strip(frame, [p, [p[0], p[1], L]], [-d[1], d[0], 0], W * 1.2, () => d)
  }
  const c0 = oct(cx, cy, h * k + 0.25, s * k, L - 0.05), c1 = oct(cx, cy, h * k + 0.25, s * k, L + 0.35)
  frame.loft([c0, c1]); frame.cap(c1, true)
  frame.loft([oct(cx, cy, h * k, s * k, T), oct(cx, cy, h * k + 0.2, s * k, T + 0.3)])
}

// --- the three pavilions (OSM centres and sizes) ---
pavilion(-18.05, -1.25, 13.8, 3.2, 2.8, 6.2, 8.4, 2.6) // Tropical, way/250230007
pavilion(-2.2, 17.5, 9.85, 2.2, 3.5, 5.0, 6.0, 2.4) // Warm Temperate, way/250230006
pavilion(-2.1, -20.1, 9.9, 2.15, 2.8, 5.4, 6.0, 2.4) // Desert, way/250229993

// --- the range: a lower level in stone, two glass ridge ranges on it, a
// hipped glass crossing in the middle, and the low link north to the Palm
// House's café wing ---
prism({ wall: stone, win: null, roof: frame, ring: [[13.3, -38.0], [34.8, -38.0], [34.8, 36.0], [13.3, 36.0]], z0: 0, z1: COURT, facade: null, bevel: 0.3 })
const RANGE: [number, number][] = [[0, 0], [0, 2.6], [0.35, 3.2], [1.0, 3.6]]
for (const [x, hw] of [[18.45, 5.05], [29.25, 5.45]] as [number, number][]) {
  const prof: [number, number][] = [...RANGE, [hw, 5.8]]
  glassRange({ glass, trim: frame, stone, a: [x, -37.8], b: [x, -1.2], hw, z0: COURT, prof, ribEvery: 3.0 })
  glassRange({ glass, trim: frame, stone, a: [x, 11.2], b: [x, 35.8], hw, z0: COURT, prof, ribEvery: 3.0 })
}
// the crossing: a hipped glass house over both ranges, with the west entrance jog
{
  const x0 = 13.3, x1 = 34.8, y0 = -1.4, y1 = 11.4, z0 = COURT, eave = z0 + 4.4, top = z0 + 8.5
  const ring = (d: number, z: number): V3[] => [[x0 + d, y0 + d, z], [x1 - d, y0 + d, z], [x1 - d, y1 - d, z], [x0 + d, y1 - d, z]]
  glass.loft([ring(0, z0), ring(0, eave)])
  const inset = 5.0
  glass.loft([ring(0, eave), ring(inset, top)])
  frame.cap(ring(inset, top), true)
  const c = ring(0, z0)
  for (let i = 0; i < 4; i++) {
    const p = ring(0, eave)[i], q = ring(inset, top)[i], d = unit3([p[0] - (x0 + x1) / 2, p[1] - (y0 + y1) / 2, 0])
    strip(frame, [p, q], [-d[1], d[0], 0], 0.6, (u, v) => { const dz = v[2] - u[2], dh = Math.hypot(v[0] - u[0], v[1] - u[1]); return unit3([d[0] * dz, d[1] * dz, dh]) })
    strip(frame, [[c[i][0], c[i][1], z0], [c[i][0], c[i][1], eave]], [-d[1], d[0], 0], 0.7, () => d)
  }
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], t = unit3([b[0] - a[0], b[1] - a[1], 0]), n: V3 = [t[1], -t[0], 0], len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const P = (s_: number, z: number): V3 => [a[0] + t[0] * s_ + n[0] * 0.08, a[1] + t[1] * s_ + n[1] * 0.08, z]
    oq(frame, P(0, eave - 0.45), P(len, eave - 0.45), P(len, eave + 0.05), P(0, eave + 0.05), n)
    const nm = Math.round(len / 2.6)
    for (let j = 1; j < nm; j++) strip(frame, [P((len * j) / nm, z0), P((len * j) / nm, eave)], t, 0.32, () => n)
  }
  // the west entrance jog (OSM x 10.8–13.4, y −6.6…4.1)
  prism({ wall: stone, win: null, roof: null, ring: [[10.8, -6.6], [13.4, -6.6], [13.4, 4.1], [10.8, 4.1]], z0: 0, z1: COURT, facade: null, bevel: 0.2 })
  glassRange({ glass, trim: frame, stone, a: [10.8, -1.25], b: [13.6, -1.25], hw: 5.35, z0: COURT, prof: [[0, 0], [0, 2.6], [0.35, 3.1], [5.35, 4.6]], ends: [true, false], ribEvery: 2.8 })
}
// the link north to the café wing (OSM x 18.9–29.3, y 36–43.6)
prism({ wall: stone, win: null, roof: null, ring: [[18.9, 36.0], [29.3, 36.0], [29.3, 43.6], [18.9, 43.6]], z0: 0, z1: COURT, facade: null, bevel: 0.2 })
glassRange({ glass, trim: frame, stone, a: [24.1, 35.8], b: [24.1, 43.6], hw: 5.2, z0: COURT, prof: [[0, 0], [0, 2.4], [0.3, 2.9], [5.2, 4.2]], ends: [false, false], ribEvery: 2.6 })

finishModel('Steinhardt Conservatory, Brooklyn Botanic Garden', 'nyc-bbg-steinhardt-conservatory', [
  { part: stone, material: PALETTE.stone },
  { part: frame, material: finish('bbg-frame-green', 0x5b6e64) },
  { part: glass, material: { name: 'glass', color: 0xa9c9cf, roughness: 0.24 } },
], { bearing: -8.5, osm: 'way/250230005', height: 20.5 }, 6500)
