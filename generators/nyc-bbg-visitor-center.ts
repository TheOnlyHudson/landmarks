/**
 * Steinberg Visitor Center, Brooklyn Botanic Garden — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-bbg-visitor-center.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the building is a
 * curve, so the frame is plain north-up). Anchor: the centroid of OSM
 * way/165548228 (-73.96302, 40.66940).
 *
 * Identifying features (from the photos and the aerial): a long serpentine
 * pavilion set into the garden's hill by Washington Avenue, with a planted
 * green roof that rises from its east end to its middle and falls again; a
 * curving floor-to-ceiling glass wall with slim silver mullions on the
 * garden (south) side; a fritted-glass canopy along that wall and over the
 * entrance between the pavilion and the smaller east pavilion (the shop, now
 * Terrain), which has a flat roof and a glass front.
 *
 * Evidence
 * - OSM: way/165548228 (visitor centre: the serpentine, 66.8 × 12–15 m;
 *   architect Weiss/Manfredi, 2012), way/1289545224 (the east pavilion,
 *   shop "Terrain"), way/1290336565 (building=roof: the canopy along the
 *   garden wall and over the entrance court).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017; the building is 2012, so it
 *   shows): garden ground on the south 44.8 m NAVD88; the hill north of the
 *   west half 48.4–51.5 m; the green roof 51.5–53.5 m over the west half
 *   (6.7–8.7 m over the garden), falling to ≈49 m (4.5 m) at the east end;
 *   the shop's flat roof 48.7–49.1 m, 4.3 m over its plaza (44.2 m).
 * - Map terrain (Mapterhorn): lowest ground under the footprint at the shop
 *   (42.1 m, the map's own check), the model's y = 0; the garden in front
 *   of the glass wall 2.4 m up, the shop plaza 2.1 m; the hill under the
 *   pavilion's north edge 5–7 m up: the north wall runs into it.
 * - USGS NAIP (public domain): green roof over the serpentine, the grey
 *   glass canopy strip along its south edge, the shop's dark flat roof.
 * - Photos (Wikimedia Commons), credits in
 *   ~/landmarks-scratch/bkn/work/nyc-bbg-visitor-center/photos/credits.txt:
 *   the curved glass wall and the plaza (Caroline Léna Becker, CC BY 3.0,
 *   "Entrance Brooklyn Botanic Garden.JPG"), the fritted canopy along the
 *   glass wall (King of Hearts, CC BY-SA 3.0, "Brooklyn Botanic Garden New
 *   York May 2015 003/004.jpg"), the planted slope (King of Hearts,
 *   CC BY-SA 4.0, "… October 2016 004.jpg").
 *
 * Measured: plan (OSM), roof heights and the hill (lidar, terrain).
 * Estimated: the roof as one surface varying along the building (lidar
 * maxima, not its real folds), the canopy's height (4.2 m) and depth (from
 * OSM), the mullion rhythm (drawn every ~2.6 m, bold), the fascia (0.6 m),
 * the north wall as plain concrete (no licensed photo of it).
 *
 * Doubts: no licensed photo shows the whole building or the green roof from
 * above; the roof's real shape is a warped surface with ramps, drawn here
 * as heights along x from the lidar. The east pavilion's street side is
 * unphotographed (drawn plain).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, finishModel } from './nyc-570-lexington'
import { oq, unit3 } from './nyc-bbg-palm-house'

const conc = new Part(), trim = new Part(), win = new Part(), green = new Part(), roof = new Part(), glass = new Part()
const G = 2.4 // the garden walk in front of the glass wall

const VC: XY[] = [[23.1, 15.6], [17.8, 12.5], [7.9, 5.4], [-2.1, 0.3], [-5.9, -1.4], [-9.9, -2.2], [-13.6, -2.4], [-16.1, -2.5], [-20.9, -1.8], [-25.8, -0.8], [-29.7, -0.2], [-31.1, -0.2], [-33.6, -0.3], [-36.2, -0.9], [-34.0, -4.4], [-31.2, -7.2], [-27.9, -9.9], [-23.9, -12.2], [-19.5, -14.0], [-14.7, -14.8], [-10.4, -14.6], [-7.0, -14.0], [-0.8, -12.2], [0.2, -11.9], [6.9, -9.4], [12.7, -6.6], [19.7, -2.1], [19.1, -0.9], [18.5, 0.2], [21.8, 2.6], [24.7, 4.5], [27.4, 6.6], [29.3, 8.8], [30.2, 10.5], [30.6, 13.1], [30.3, 15.0], [29.9, 16.8], [29.4, 18.4]]
const SHOP: XY[] = [[58.3, 18.1], [56.3, 18.5], [54.9, 18.8], [50.8, 19.2], [47.6, 19.3], [45.4, 18.9], [43.3, 17.8], [42.1, 16.7], [40.6, 14.9], [39.4, 13.2], [38.0, 11.3], [36.5, 9.6], [35.3, 8.0], [34.1, 6.6], [33.0, 5.5], [32.1, 4.4], [31.8, 3.2], [32.4, 2.4], [33.6, 2.0], [36.0, 1.9], [39.6, 1.9], [42.1, 2.0], [45.3, 2.0], [50.9, 0.9], [56.3, -1.1], [61.2, -3.5]]
const CANOPY: XY[] = [[0.2, -11.9], [0.8, -14.2], [4.0, -13.1], [8.2, -11.4], [13.7, -8.7], [18.4, -5.8], [23.1, -3.0], [24.1, -2.3], [25.4, -1.4], [29.8, 0.8], [36.0, 1.9], [33.6, 2.0], [32.4, 2.4], [31.8, 3.2], [32.1, 4.4], [33.0, 5.5], [34.1, 6.6], [35.3, 8.0], [36.5, 9.6], [38.0, 11.3], [39.4, 13.2], [40.6, 14.9], [42.1, 16.7], [43.3, 17.8], [45.4, 18.9], [47.6, 19.3], [50.8, 19.2], [54.9, 18.8], [56.3, 18.5], [58.3, 18.1], [58.0, 20.3], [54.4, 20.9], [51.0, 21.3], [47.7, 21.4], [44.3, 21.3], [39.9, 21.2], [36.1, 20.3], [34.4, 19.8], [29.4, 18.4], [29.9, 16.8], [30.3, 15.0], [30.6, 13.1], [30.2, 10.5], [29.3, 8.8], [27.4, 6.6], [24.7, 4.5], [21.8, 2.6], [18.5, 0.2], [19.1, -0.9], [19.7, -2.1], [12.7, -6.6], [6.9, -9.4]]

/** Ear-clipping triangulation: index triples, counter-clockwise. */
function earClip(ring: XY[]): [number, number, number][] {
  let sgn = 0
  for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; sgn += a[0] * b[1] - b[0] * a[1] }
  const idx = ring.map((_, i) => i); if (sgn < 0) idx.reverse()
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let done = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && cr(a, b, ring[j]) >= -1e-9 && cr(b, c, ring[j]) >= -1e-9 && cr(c, a, ring[j]) >= -1e-9)) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); done = true; break
    }
    if (!done) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
const ccw = (ring: XY[]) => { let s = 0; for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 ? ring : [...ring].reverse() }

/** A roof surface over a ring with per-vertex heights, plus its fascia walls down to z = 0. */
function solid(ring: XY[], zTop: (p: XY) => number, wallFor: (a: XY, b: XY) => 'glass' | 'conc', top: Part) {
  const r = ccw(ring)
  for (const [a, b, c] of earClip(r)) top.tri([r[a][0], r[a][1], zTop(r[a])], [r[b][0], r[b][1], zTop(r[b])], [r[c][0], r[c][1], zTop(r[c])])
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], za = zTop(a), zb = zTop(b)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-3) continue
    const t: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], n: V3 = [t[1], -t[0], 0]
    const kind = wallFor(a, b)
    // the fascia band on top, then the wall
    oq(trim, [a[0], a[1], za - 0.6], [b[0], b[1], zb - 0.6], [b[0], b[1], zb], [a[0], a[1], za], n)
    if (kind === 'conc') { oq(conc, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb - 0.6], [a[0], a[1], za - 0.6], n); continue }
    oq(conc, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], G], [a[0], a[1], G], n)
    oq(win, [a[0], a[1], G], [b[0], b[1], G], [b[0], b[1], zb - 0.6], [a[0], a[1], za - 0.6], n)
    // bold silver mullions
    const m = Math.max(1, Math.round(L / 2.6))
    for (let j = 0; j < m; j++) {
      const s = (L * j) / m, p: V3 = [a[0] + t[0] * s + n[0] * 0.05, a[1] + t[1] * s + n[1] * 0.05, 0], z = za + ((zb - za) * s) / L
      oq(trim, [p[0] - t[0] * 0.14, p[1] - t[1] * 0.14, G], [p[0] + t[0] * 0.14, p[1] + t[1] * 0.14, G], [p[0] + t[0] * 0.14, p[1] + t[1] * 0.14, z - 0.6], [p[0] - t[0] * 0.14, p[1] - t[1] * 0.14, z - 0.6], n)
    }
    // a transom line
    const zt = G + 3.1
    oq(trim, [a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, zt], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, zt], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, zt + 0.18], [a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, zt + 0.18], n)
  }
}

// --- the serpentine pavilion: the green roof's height along x (lidar), over the garden ---
const ROOFX: [number, number][] = [[-37, 6.6], [-28, 7.9], [-20, 8.5], [-10, 8.0], [0, 7.2], [8, 6.3], [16, 5.2], [24, 4.6], [31, 4.5]]
const roofAt = (p: XY) => {
  const x = p[0]
  for (let i = 0; i < ROOFX.length - 1; i++) if (x <= ROOFX[i + 1][0]) { const [x0, z0] = ROOFX[i], [x1, z1] = ROOFX[i + 1]; return G + z0 + ((z1 - z0) * Math.max(0, x - x0)) / (x1 - x0) }
  return G + ROOFX[ROOFX.length - 1][1]
}
// the north edge (from the east end's north point back west) is against the hill: concrete
const northEdge = new Set(VC.slice(0, 14).map((p) => p.join(',')))
solid(VC, roofAt, (a, b) => (northEdge.has(a.join(',')) && northEdge.has(b.join(',')) ? 'conc' : 'glass'), green)

// --- the east pavilion (the shop): flat roof 4.3 m, glass to the entrance court ---
const shopStreet = new Set(['58.3,18.1', '61.2,-3.5', '56.3,-1.1', '50.9,0.9'])
solid(SHOP, () => 6.4, (a, b) => (shopStreet.has(a.join(',')) || shopStreet.has(b.join(',')) ? 'conc' : 'glass'), roof)

// --- the fritted-glass canopy: a thin slab with a white edge at 4.2 m ---
{
  const r = ccw(CANOPY), z0 = G + 3.9, z1 = G + 4.15
  for (const [a, b, c] of earClip(r)) {
    glass.tri([r[a][0], r[a][1], z1], [r[b][0], r[b][1], z1], [r[c][0], r[c][1], z1])
    glass.tri([r[a][0], r[a][1], z0], [r[c][0], r[c][1], z0], [r[b][0], r[b][1], z0])
  }
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-3) continue
    const n = unit3([b[1] - a[1], a[0] - b[0], 0])
    oq(trim, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
}

finishModel('Steinberg Visitor Center, Brooklyn Botanic Garden', 'nyc-bbg-visitor-center', [
  { part: conc, material: finish('bbg-concrete', 0xe3e0d8) },
  { part: trim, material: finish('bbg-silver', 0xd9dde0) },
  { part: win, material: windowVariant(2, 0xa9bfd1) },
  { part: green, material: finish('bbg-green-roof', 0x9fb38c) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: { name: 'glass', color: 0xc6d6dc, roughness: 0.24 } },
], { bearing: 0, osm: 'way/165548228', height: 11.6 })
