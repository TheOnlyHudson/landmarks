/**
 * Al-Masjid an-Nabawi, the Prophet's Mosque, Medina.
 *
 * Writes two levels of detail in the same frame (x east, y north, metres,
 * origin at the outline's centroid 39.61116 E, 24.46879 N, on the lowest
 * ground; bearing 0, the building is laid out on the compass):
 * - models/medina-prophets-mosque.glb, the low model: the cream stone block
 *   on its OSM outline with arched window panels and its 22 gate portals,
 *   the two open courts of the first Saudi expansion, the 27 sliding domes
 *   in their rows on the white roof, the Green Dome on its white drum and
 *   the silver dome beside it, the south portico, all ten minarets in
 *   their real stages (square sections), and the 250 giant umbrellas of the
 *   plazas, open (canopies only: the 1.3 m masts are under a pixel below
 *   zoom 16), plus the 12 court umbrellas, closed. About 5,200 triangles;
 * - models/medina-prophets-mosque.detail.glb, drawn from zoom 16: the same,
 *   with real recessed arched windows (two rows) and doorways cut into every
 *   facade, real pointed arcades round the courts and along the south
 *   portico, a parapet round the roof, the minarets' corbelled galleries,
 *   arcaded stages and zigzag bands, finials and crescents, the Green Dome's
 *   windowed drum, the Ottoman small domes, the domes over the wide gates,
 *   and each umbrella with its stone mast, gold lantern and scalloped funnel
 *   canopy. About 38,000 triangles, 1.49 MB.
 *
 * The umbrellas are drawn OPEN on the plazas (their daytime state, as in
 * u01, u02, p01, p02, a06) and CLOSED in the two inner courts (as a06 shows
 * them at the same hour).
 *
 * What it does not draw: the marble plazas (the map's ground), the service
 * kiosks, escalator houses and lockers on the plazas (separate OSM
 * buildings), the roof's tent shades and the al-Baqi cemetery.
 *
 * Sources (open only; no commercial imagery or 3D tiles):
 * - OSM (API map call, 2026-11-18): way/461699097 (building=yes,
 *   amenity=place_of_worship, height 13), the Green Dome way/232440740, the
 *   tomb way/527049338, the "white dome" way/444217620, the ten minarets
 *   way/506272259-268 (six 104 m, four 70 m), the 27 barrier=wall squares
 *   inside the outline that frame the sliding-dome openings (301797093,
 *   301800494-507, 301802277-288), the two court outlines way/622494682-683,
 *   the gate nodes (historic=city_gate, 22 on the outline), the plaza fence
 *   way/623592432, the underground car park way/566393312 and the kiosk
 *   buildings 201-236.
 * - Published: six minarets of 103.89 m from the King Fahd expansion, ten
 *   in all; 27 sliding domes over courtyards of 324 m2 (18 x 18 m); 250
 *   umbrellas shading about 143,000 m2 (Wikipedia, Al-Masjid an-Nabawi);
 *   12 court umbrellas 17 x 18 m (de.wikipedia, SL Rasch); Green Dome
 *   rebuilt 1817, painted green 1837 (Wikipedia).
 * - Photos (Wikimedia Commons; all EVIDENCE):
 *   a06 "Al-Masjid An-Nabawi (Bird's Eye View).jpg", Konevi, CC0: from the
 *     south: south portico, Ottoman wall, Green and silver domes, small
 *     domes, court arcades with closed umbrellas, sliding domes, minarets.
 *   u02 "Umbrellas for the Piazza of the Prophet's Holy Mosque, Madinah,
 *     SA.jpg", Anaya Ki Family, CC BY-SA 3.0: from the north-east above:
 *     the umbrella field open and closed, the roof, domes on square bases,
 *     a court.
 *   a04 "Masjid Nabawi. Medina, Saudi Arabia.jpg", (anonymous), CC BY-SA 2.5:
 *     the north facade, King Fahd gate, minaret stages, rows of domes.
 *   a03 "Madinah prophet Mosque - Baqee cemtery (2527552809).jpg",
 *     marviikad, CC BY-SA 2.0: the east facade from the south-east, above.
 *   p06 "Perkuburan Baqi' (Maqbaratu al-Baqi') & Masjid al-Nabawi.jpg",
 *     Kerina yin, CC0: the east side and minaret stages (heights scaled).
 *   g01 "Close-up shot of the Green Dome (with silver dome) ...jpg" and g03
 *     "Wide shot of the Green Dome ...jpg", TheHadiRahim, CC0: Green Dome,
 *     silver dome, south wall, Raisiyya and Bab al-Salam minarets.
 *   p01, p02 "Mezquita del Profeta, Medina, Arabia Saudita, 2025-05-22, DD
 *     02.jpg / DD 01.jpg", Diego Delso, CC BY-SA 4.0: umbrellas open, masts,
 *     lanterns, facade, minarets.
 *   u01 "Masjid e Nabawi Courtyard Umbrellas.jpg", King Eliot, CC BY-SA 4.0,
 *   u04 "Medina Haram Piazza.jpg", GLady, CC0: umbrella canopies and masts.
 *   m01 "Prophet's Mosque Minaret 2021.jpg", Saleh Al Hussain, CC BY 4.0:
 *     minaret stages, galleries, zigzag band.
 *   m03 "View of Masjid-e-Nabawi Gate 21, 22.jpg", CR Guru PK, CC BY-SA 4.0:
 *     King Fahd gate between its minarets.
 *   p03 "Masjid Nabawi. Medina, Saudi Arabia-2.jpg", Vago, public domain: night.
 * - Terrain: Mapterhorn z12 only (`tools/terrain.ts grid`): the plazas are
 *   level to a metre or two; the mosque shows as a 12-13 m bump.
 * - No lidar and no NAIP exist here.
 * Look-only references: none.
 *
 * Numbers:
 * - Plan: the OSM outline, exact; the south portico strip (y < -149) split
 *   off it at the line of the Ottoman wall (a06).
 * - Roof 14.5 m, parapet to 16.5 m, gate portals 20.5 m: photo-scaled
 *   against the 104 m minarets (a04, p06) and the z12 surface bump; OSM's
 *   13 m is taken as the roof slab. Estimated.
 * - South portico 9 m (a06, against the 14.5 m wall behind it). Estimated.
 * - Minaret stages (104 m type) from p06 and a06, measured as fractions of
 *   the published height: galleries at 34, 53, 70, 82 m, top pavilion to
 *   90.5 m, bulb to 98.5 m, finial and crescent to 103.9 m. Widths
 *   photo-scaled (square shaft 7.6 m, octagon 6.6 m, cylinders 5.8 and
 *   5.2 m) and then drawn 1.25x (the 70 m pair 1.05x) so the minarets read
 *   as the thick towers they are at phone size; the galleries' pierced
 *   balustrades are drawn as dark bands, 1.35x deeper (lead review).
 *   The two 70 m north minarets of the 1950s expansion are drawn as the same
 *   design scaled to 70 m (a06 shows them alike). Raisiyya and Bab al-Salam
 *   (70 m, OSM) from g01, g03, a06.
 * - Sliding domes: on the 27 OSM squares; square base 19.5 m standing 2.6 m
 *   above the roof, cap 16.4 m across and 5.4 m high (a06,
 *   u02: shallow caps on raised square bases).
 * - Green Dome: OSM footprint 16.7 m; drawn 20 m across (1.2x) on a 25 m
 *   white base so it stays unmistakable at 200 and 80 px (lead review,
 *   STYLE: signature features bolder at phone size); green drum 17.5-23.4 m,
 *   dome to 37.6 m, finial to 41 m (a06, g03: dome about 0.85 as tall as it is wide).
 *   Silver dome 11 m across (g03 against the Green Dome; OSM 9.8 m).
 * - Plaza umbrellas: 24 m square (published 143,000 m2 / 250), canopy from
 *   8.3 m at the mast to 15 m at the rim points (p02, scaled on its width);
 *   placed on a 24.5 m grid along each facade, kept clear of the kiosks, the
 *   gate walkways and the front of the Ottoman portico (a06), the 250 nearest
 *   the mosque kept. The layout is estimated: no open aerial shows it whole.
 * - Court umbrellas: 12, 3 x 2 per court (17 x 18 m, published), closed: a
 *   white folded spindle to 19 m with a gold finial (a06).
 * - Colours from the photos, pulled to the palette: facade stone #e6d3bd
 *   (warm beige; g03, a06 sunlit, a04 shaded); roofs, drums and umbrella
 *   membrane white #fafaf7 (a06: the roofscape and canopies read white); sliding, silver and small domes #d3d8da
 *   (a06 #b6c4ca/#c9cac1 in evening light, g03 #bdb9ac); Green Dome
 *   #4f9460 (g03 #3f5034 in shade, pulled to the palette's lightness and
 *   to the bright green it reads as); gold #d4b46a (a06 #d1bd7b); window
 *   panels the palette's slate.
 * - Night: the minarets, the Green Dome and the facades are floodlit (p03),
 *   the window panels and doorways glow.
 *
 * Doubts:
 * - The umbrella layout (see above) and the exact roof height.
 * - The gate portals are drawn to one design (pointed doorways under a raised
 *   block) at each OSM gate; the real gates vary.
 * - The roof's tent shades and pergolas are left out.
 * - The ablaq (black and white) voussoirs of the court arcades are not drawn;
 *   the arches are plain stone with dark openings.
 * - The model's footprint is the whole umbrella field (640 x 520 m), so the
 *   map grounds it on the lowest plaza point (north-east corner in the z12
 *   terrain); the mosque may sink a metre or two into the plaza.
 * - Umbrella canopies overhang some plaza kiosks (OSM 207, 209, 211, 217,
 *   221, 222, 227, 229, 230) by 6-31% of their area, as the real ones do.
 * - At night only the stone (facades, minarets), Green Dome and gold are
 *   floodlit; the umbrellas' own lanterns are not lamps here.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'

// ================================================================ kit ====
// Shared with amman-king-abdullah-mosque.ts and amman-roman-theatre.ts.

export type P2 = [number, number]
export type Mat = { part: Part; material: MaterialSpec }
const TAU = Math.PI * 2
const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dt = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle wound so its face normal points along `hint`. */
export function otri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const n = cr(sb(b, a), sb(c, a))
  if (Math.hypot(n[0], n[1], n[2]) < 1e-10) return
  if (dt(n, hint) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A quad wound so its face normal points along `hint`. */
export function oquad(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  otri(p, a, b, c, hint)
  otri(p, a, c, d, hint)
}

export const area2 = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (p: P2[]) => (area2(p) < 0 ? [...p].reverse() : p)

/** Ear clipping of a simple polygon (any winding); returns CCW point triples. */
export function triangulate(poly: P2[]): [P2, P2, P2][] {
  const p = ccw(poly)
  const idx = p.map((_, i) => i), out: [P2, P2, P2][] = []
  const cz = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const same = (a: P2, b: P2) => Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7
  const inside = (q: P2, a: P2, b: P2, c: P2) => cz(a, b, q) > 1e-9 && cz(b, c, q) > 1e-9 && cz(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = p[i0], b = p[i1], c = p[i2]
      const z = cz(a, b, c)
      if (z <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && !same(p[j], a) && !same(p[j], b) && !same(p[j], c) && inside(p[j], a, b, c))) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) {
      // drop a collinear or degenerate corner
      const k = idx.findIndex((_, k) => Math.abs(cz(p[idx[(k + idx.length - 1) % idx.length]], p[idx[k]], p[idx[(k + 1) % idx.length]])) <= 1e-9)
      idx.splice(k >= 0 ? k : 0, 1)
    }
  }
  if (idx.length === 3 && cz(p[idx[0]], p[idx[1]], p[idx[2]]) > 1e-9) out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}

/** Merge holes into an outer ring with bridge edges, for `triangulate`. */
export function bridge(outer: P2[], holes: P2[][]): P2[] {
  let ring = ccw(outer).slice()
  const segX = (a: P2, b: P2, c: P2, d: P2) => {
    const o = (p: P2, q: P2, r: P2) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    return o(a, b, c) * o(a, b, d) < -1e-9 && o(c, d, a) * o(c, d, b) < -1e-9
  }
  const hs = holes.map((h) => (area2(h) > 0 ? [...h].reverse() : h.slice())).sort((a, b) => Math.max(...b.map((q) => q[0])) - Math.max(...a.map((q) => q[0])))
  hs.forEach((h, hi) => {
    let mi = 0
    h.forEach((q, i) => { if (q[0] > h[mi][0]) mi = i })
    const M = h[mi]
    const others = hs.slice(hi + 1)
    const cand = ring.map((q, i) => ({ q, i, d: Math.hypot(q[0] - M[0], q[1] - M[1]) })).sort((a, b) => a.d - b.d)
    const ok = (P: P2) => {
      for (let i = 0; i < ring.length; i++) if (segX(M, P, ring[i], ring[(i + 1) % ring.length])) return false
      for (const o of [h, ...others]) for (let i = 0; i < o.length; i++) if (segX(M, P, o[i], o[(i + 1) % o.length])) return false
      return true
    }
    const pick = cand.find((c) => ok(c.q)) ?? cand[0]
    const hr = [...h.slice(mi), ...h.slice(0, mi), M]
    ring = [...ring.slice(0, pick.i + 1), ...hr, ring[pick.i], ...ring.slice(pick.i + 1)]
  })
  return ring
}

/** A flat cap at height z over a polygon with holes, facing up or down. */
export function cap(part: Part, outer: P2[], z: number, up = true, holes: P2[][] = []) {
  const ring = holes.length ? bridge(outer, holes) : outer
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) part.tri(A, B, C); else part.tri(A, C, B)
  }
}

/** The walls of a ring between z0 and z1, facing out of a CCW ring (into a CW one). */
export function walls(part: Part, ring: P2[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1e-6) continue
    const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    oquad(part, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
}

/** A prism over a polygon: walls and top (and optionally bottom). */
export function prism(part: Part, poly: P2[], z0: number, z1: number, top: Part | null = part, bottom = false) {
  const p = ccw(poly)
  walls(part, p, z0, z1)
  if (top) cap(top, p, z1, true)
  if (bottom) cap(part, p, z0, false)
}

/** Offset a CCW polygon inward by d (miter). */
export function inset(poly: P2[], d: number): P2[] {
  const p = ccw(poly), n = p.length
  const un = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  return p.map((c, i) => {
    const a = p[(i + n - 1) % n], b = p[(i + 1) % n]
    const e1 = un([c[0] - a[0], c[1] - a[1]]), e2 = un([b[0] - c[0], b[1] - c[1]])
    const n1: P2 = [-e1[1], e1[0]], n2: P2 = [-e2[1], e2[0]]
    const m = un([n1[0] + n2[0], n1[1] + n2[1]])
    const cos = Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [c[0] + (m[0] * d) / cos, c[1] + (m[1] * d) / cos] as P2
  })
}

/** An axis-aligned box, optionally with a chamfered top edge. */
export function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, opts: { bottom?: boolean; bevel?: number; top?: Part } = {}) {
  const b = opts.bevel ?? 0
  const p: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  if (b <= 0) { prism(part, p, z0, z1, opts.top ?? part, opts.bottom); return }
  walls(part, p, z0, z1 - b)
  const q = inset(p, b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1 - b]
    const m: V3 = [(p[i][0] + p[j][0]) / 2, (p[i][1] + p[j][1]) / 2, z1 - b]
    oquad(part, [p[i][0], p[i][1], z1 - b], [p[j][0], p[j][1], z1 - b], [q[j][0], q[j][1], z1], [q[i][0], q[i][1], z1], [m[0] - c[0], m[1] - c[1], b * 2])
  }
  cap(opts.top ?? part, q, z1, true)
  if (opts.bottom) cap(part, p, z0, false)
}

/** A regular n-gon, CCW, first corner at a0. */
export function ngon(cx: number, cy: number, r: number, n: number, a0 = 0): P2[] {
  return Array.from({ length: n }, (_, i) => { const a = a0 + (TAU * i) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as P2 })
}

/**
 * A solid of revolution about (cx, cy): profile [r, z] from bottom to top.
 * `smooth` shades smoothly round the axis; `soft` also smooths along the
 * profile (domes). Faces are always wound to face out.
 */
export function lathe(part: Part, cx: number, cy: number, profile: P2[], n = 16, opts: { smooth?: boolean; soft?: boolean; a0?: number } = {}) {
  const smooth = opts.smooth ?? true, soft = opts.soft ?? false, a0 = opts.a0 ?? 0
  const segN = (k: number): P2 => {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l]
  }
  const vN = (k: number, seg: number): P2 => {
    if (!soft) return segN(seg)
    const a = k > 0 ? segN(k - 1) : null, b = k < profile.length - 1 ? segN(k) : null
    const s: P2 = [(a?.[0] ?? 0) + (b?.[0] ?? 0), (a?.[1] ?? 0) + (b?.[1] ?? 0)]
    const l = Math.hypot(s[0], s[1]) || 1
    return [s[0] / l, s[1] / l]
  }
  for (let k = 0; k + 1 < profile.length; k++) {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    if (Math.abs(r0 - r1) < 1e-9 && Math.abs(z0 - z1) < 1e-9) continue
    const n0 = vN(k, k), n1 = vN(k + 1, k), sn = segN(k)
    for (let i = 0; i < n; i++) {
      const a = a0 + (TAU * i) / n, b = a0 + (TAU * (i + 1)) / n, m = (a + b) / 2
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const N = (nn: P2, t: number): V3 => (smooth ? [nn[0] * Math.cos(t), nn[0] * Math.sin(t), nn[1]] : [nn[0] * Math.cos(m), nn[0] * Math.sin(m), nn[1]])
      const fN = (nn: P2): V3 => [nn[0] * Math.cos(m), nn[0] * Math.sin(m), nn[1]]
      const pa0 = P(r0, z0, a), pb0 = P(r0, z0, b), pa1 = P(r1, z1, a), pb1 = P(r1, z1, b)
      if (smooth || soft) {
        const na0 = N(n0, a), nb0 = N(n0, b), na1 = N(n1, a), nb1 = N(n1, b)
        if (r0 > 1e-6) part.tri(pa0, pb0, pb1, [0, 0], [0, 0], [0, 0], [na0, nb0, nb1])
        if (r1 > 1e-6) part.tri(pa0, pb1, pa1, [0, 0], [0, 0], [0, 0], [na0, nb1, na1])
        else if (r0 > 1e-6) { /* the apex triangle is the one above */ }
      } else {
        if (r0 > 1e-6) otri(part, pa0, pb0, pb1, fN(sn))
        if (r1 > 1e-6) otri(part, pa0, pb1, pa1, fN(sn))
      }
    }
  }
}

/** A flat disc cap on a lathe (for a profile that ends at r > 0). */
export function disc(part: Part, cx: number, cy: number, r: number, z: number, n: number, up = true, a0 = 0) {
  const ring = ngon(cx, cy, r, n, a0)
  for (let i = 0; i < n; i++) otri(part, [cx, cy, z], [ring[i][0], ring[i][1], z], [ring[(i + 1) % n][0], ring[(i + 1) % n][1], z], [0, 0, up ? 1 : -1])
}

/**
 * An opening in a facade, in the face's own coordinates: `s0..s1` along the
 * face, from `zb` (sill) up to `zs` (springing), then a head: 'flat',
 * 'round' (a semicircle) or 'pointed' (two arcs of radius `k` times the
 * span). `depth` is how far back the back panel sits.
 */
export type Opening = { s0: number; s1: number; zb: number; zs: number; head?: 'flat' | 'round' | 'pointed'; k?: number; depth?: number }

/** The head of an opening, from the right springing round to the left. */
export function headPts(o: Opening, n: number): P2[] {
  const w = o.s1 - o.s0, sc = (o.s0 + o.s1) / 2
  if (!o.head || o.head === 'flat') return [[o.s1, o.zs], [o.s0, o.zs]]
  if (o.head === 'round') {
    const r = w / 2
    return Array.from({ length: n + 1 }, (_, k) => { const a = (Math.PI * k) / n; return [sc + r * Math.cos(a), o.zs + r * Math.sin(a)] as P2 })
  }
  // pointed: the right arc centred at s1 - R, the left at s0 + R
  const R = w * (o.k ?? 0.8), half = n / 2
  const ta = Math.acos((R - w / 2) / R)
  const out: P2[] = []
  for (let k = 0; k <= half; k++) { const t = (ta * k) / half; out.push([o.s1 - R + R * Math.cos(t), o.zs + R * Math.sin(t)]) }
  for (let k = half - 1; k >= 0; k--) { const t = (ta * k) / half; out.push([o.s0 + R - R * Math.cos(t), o.zs + R * Math.sin(t)]) }
  return out
}
export const headTop = (o: Opening) => {
  const w = o.s1 - o.s0
  if (!o.head || o.head === 'flat') return o.zs
  if (o.head === 'round') return o.zs + w / 2
  const R = w * (o.k ?? 0.8)
  return o.zs + Math.sqrt(R * R - (R - w / 2) ** 2)
}

/**
 * A vertical wall face from A to B (outward normal on the right of A→B)
 * between z0 and z1, with openings cut into it as real recesses: jambs,
 * sills and heads are reveal faces going `depth` into the wall, closed by
 * a panel in `back` (or open, when `back` is null). With `flush`, the
 * openings are flat panels on the face instead (for a low model).
 */
export function facade(wall: Part, back: Part | null, A: P2, B: P2, z0: number, z1: number, openings: Opening[] = [], opts: { seg?: number; reveal?: Part; flush?: boolean } = {}) {
  const seg = opts.seg ?? 8, reveal = opts.reveal ?? wall
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: V3 = [u[1], -u[0], 0]
  const at = (s: number, z: number, d = 0): V3 => [A[0] + u[0] * s - nrm[0] * d, A[1] + u[1] * s - nrm[1] * d, z]
  if (opts.flush) {
    oquad(wall, at(0, z0), at(L, z0), at(L, z1), at(0, z1), nrm)
    if (back) panels(back, A, B, openings, seg)
    return
  }
  const rect = (sa: number, sb_: number, za: number, zb: number) => { if (sb_ - sa > 1e-6 && zb - za > 1e-6) oquad(wall, at(sa, za), at(sb_, za), at(sb_, zb), at(sa, zb), nrm) }
  const ops = [...openings].sort((a, b) => a.s0 - b.s0)
  // columns: openings overlapping along the face share a column; the rest is plain wall
  const cols: { c0: number; c1: number; ops: Opening[] }[] = []
  for (const o of ops) {
    const last = cols[cols.length - 1]
    if (last && o.s0 < last.c1 - 1e-6) { last.ops.push(o); last.c0 = Math.min(last.c0, o.s0); last.c1 = Math.max(last.c1, o.s1) }
    else cols.push({ c0: o.s0, c1: o.s1, ops: [o] })
  }
  let s = 0
  for (const col of cols) {
    const { c0, c1 } = col
    rect(s, c0, z0, z1)
    col.ops.sort((a, b) => a.zb - b.zb)
    let zc = z0
    for (const o of col.ops) {
      const top = headTop(o)
      rect(c0, c1, zc, o.zb)
      rect(c0, o.s0, o.zb, top)
      rect(o.s1, c1, o.zb, top)
      const hp = headPts(o, seg)
      if (o.head && o.head !== 'flat') {
        const TL = at(o.s0, top), TR = at(o.s1, top), half = seg / 2
        for (let k = 0; k < hp.length - 1; k++) otri(wall, k < half ? TR : TL, at(hp[k][0], hp[k][1]), at(hp[k + 1][0], hp[k + 1][1]), nrm)
      }
      const ring: P2[] = [[o.s0, o.zb], [o.s1, o.zb], ...hp]
      const d = o.depth ?? 0.8, cs = (o.s0 + o.s1) / 2, czz = (o.zb + top) / 2
      for (let k = 0; k < ring.length; k++) {
        const p = ring[k], q = ring[(k + 1) % ring.length]
        if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6) continue
        const mid: P2 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
        oquad(reveal, at(p[0], p[1]), at(q[0], q[1]), at(q[0], q[1], d), at(p[0], p[1], d), sb(at(cs, czz, d / 2), at(mid[0], mid[1], d / 2)))
      }
      if (back) for (let k = 1; k + 1 < ring.length; k++) otri(back, at(ring[0][0], ring[0][1], d), at(ring[k][0], ring[k][1], d), at(ring[k + 1][0], ring[k + 1][1], d), nrm)
      zc = top
    }
    rect(c0, c1, zc, z1)
    s = c1
  }
  rect(s, L, z0, z1)
}

/** Openings as flat panels just proud of the face A→B (windows, in the palette's way). */
export function panels(back: Part, A: P2, B: P2, openings: Opening[], seg = 4, off = 0.06) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: V3 = [u[1], -u[0], 0]
  const at = (s: number, z: number): V3 => [A[0] + u[0] * s + nrm[0] * off, A[1] + u[1] * s + nrm[1] * off, z]
  for (const o of openings) {
    const ring: P2[] = [[o.s0, o.zb], [o.s1, o.zb], ...headPts(o, seg)]
    for (let k = 1; k + 1 < ring.length; k++) otri(back, at(ring[0][0], ring[0][1]), at(ring[k][0], ring[k][1]), at(ring[k + 1][0], ring[k + 1][1]), nrm)
  }
}

/** Openings spaced evenly along a face of length L: n bays of width w, centred. */
export function row(L: number, bay: number, w: number, zb: number, zs: number, head: Opening['head'], extra: Partial<Opening> = {}, margin = 1.2): Opening[] {
  const n = Math.floor((L - 2 * margin) / bay)
  if (n < 1) return []
  const s0 = (L - n * bay) / 2
  return Array.from({ length: n }, (_, i) => ({ s0: s0 + i * bay + (bay - w) / 2, s1: s0 + i * bay + (bay + w) / 2, zb, zs, head, ...extra }))
}

export const tris = (parts: Mat[]) => parts.reduce((t, { part }) => t + part.triangles, 0)

/** Write a GLB under models/, report it, and warn on the budget. */
export async function writeModel(file: string, title: string, parts: Mat[], maxTris: number, maxBytes: number, extras: Record<string, unknown> = {}) {
  const live = parts.filter((p) => p.part.triangles > 0)
  const t = tris(live)
  console.log(live.map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
  const glb = writeGlb(title, live, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (t > maxTris) console.warn(`${file}: triangle budget exceeded: ${t} > ${maxTris}`)
  if (glb.length > maxBytes) console.warn(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = process.env.MODEL_OUT ? `${process.env.MODEL_OUT}/${file}` : new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${t} triangles, ${glb.length} bytes`)
}

// ================================================================ data ===

export const ANCHOR = { lng: 39.61116, lat: 24.46879, bearing: 0 }

/** way/461699097 in the model frame (metres from the anchor). */
const OUTLINE: P2[] = [[158.47, 129.46], [144.12, 129.39], [144.13, 127.25], [123.22, 127.16], [100.57, 127.06], [100.56, 129.24], [90.68, 129.19], [90.72, 119.02], [60.12, 118.89], [26.17, 118.76], [26.12, 129.7], [18.43, 129.67], [18.44, 125.55], [-0.35, 125.47], [-21.05, 125.37], [-21.07, 128.61], [-31.16, 128.55], [-31.11, 119.3], [-35.62, 119.28], [-35.6, 115.99], [-63.0, 115.82], [-91.74, 115.64], [-91.8, 124.71], [-86.95, 124.74], [-86.98, 128.98], [-103.58, 128.87], [-103.56, 125.69], [-109.33, 125.65], [-125.92, 125.52], [-144.59, 125.38], [-144.61, 128.23], [-161.04, 128.11], [-161.0, 122.43], [-156.91, 122.46], [-156.87, 117.89], [-192.48, 117.63], [-192.42, 110.28], [-205.39, 110.18], [-205.27, 93.58], [-202.53, 93.6], [-202.42, 76.43], [-202.33, 62.42], [-202.31, 59.28], [-206.31, 59.26], [-206.19, 38.41], [-196.55, 38.47], [-196.49, 26.29], [-207.31, 26.24], [-207.27, 18.18], [-207.24, 11.75], [-207.16, -3.86], [-195.42, -3.8], [-195.34, -20.16], [-207.57, -20.21], [-207.48, -39.93], [-203.55, -39.92], [-203.47, -58.05], [-203.39, -79.6], [-207.14, -79.61], [-207.08, -98.7], [-195.51, -98.67], [-195.5, -104.37], [-145.53, -104.25], [-145.51, -114.48], [-125.62, -114.43], [-107.04, -114.39], [-107.07, -102.96], [-60.76, -102.86], [-50.47, -102.83], [-50.44, -115.15], [-50.4, -135.17], [-50.37, -149.25], [-50.34, -161.23], [-1.14, -161.12], [44.51, -161.02], [44.48, -148.11], [44.41, -116.15], [44.4, -109.69], [39.02, -109.7], [39.02, -107.2], [39.01, -104.67], [63.72, -104.61], [116.15, -104.49], [116.17, -112.96], [133.22, -112.92], [151.04, -112.87], [151.03, -105.51], [188.86, -105.41], [188.87, -108.17], [197.92, -108.15], [197.84, -84.05], [209.27, -84.0], [209.24, -76.56], [206.58, -76.57], [206.49, -56.86], [206.41, -36.49], [209.97, -36.48], [209.92, -24.04], [195.85, -24.11], [195.75, -4.09], [207.3, -4.04], [207.24, 9.11], [207.18, 22.08], [195.53, 22.03], [195.44, 39.47], [206.1, 39.53], [206.06, 47.92], [202.98, 47.9], [202.85, 73.58], [202.74, 94.78], [205.2, 94.8], [205.15, 105.92], [198.68, 105.89], [198.66, 110.67], [191.74, 110.64], [191.69, 119.46], [158.51, 119.3]]

/** The two open courts of the first Saudi expansion (way/622494682, 622494683). */
const COURTS: P2[][] = [
  [[-27.6, -100.4], [24.2, -100.4], [24.2, -62.9], [-27.6, -62.9]],
  [[-28.6, -45.7], [25.2, -45.7], [25.2, -8.9], [-28.6, -8.9]],
]

/** Centres of the 27 sliding-dome openings (barrier=wall squares). */
const DOMES: P2[] = [[-152.6, -28.3], [-152.3, -78.5], [-152.0, 26.5], [-151.3, 75.9], [-127.9, -28.0], [-127.4, 26.9], [-127.3, -78.8], [-126.6, 76.4], [-102.6, -28.2], [-102.4, 26.5], [-102.1, -78.9], [-101.7, 76.2], [-25.9, 75.6], [-1.8, 75.6], [22.4, 75.8], [97.1, 76.0], [97.2, 26.1], [97.4, -80.8], [97.5, -30.6], [122.5, 25.5], [122.6, -30.7], [122.9, -81.3], [122.9, 75.9], [147.7, 24.9], [147.8, 75.5], [148.0, -31.3], [148.4, -81.8]]

/** Minarets: centre, height, kind. */
const MINARETS: { c: P2; h: number; kind: 'fahd' | 'raisiyya' | 'salam' }[] = [
  { c: [-193.7, -89.6], h: 103.9, kind: 'fahd' }, { c: [193.3, -91.4], h: 103.9, kind: 'fahd' },
  { c: [-192.7, 104.0], h: 103.9, kind: 'fahd' }, { c: [193.3, 105.3], h: 103.9, kind: 'fahd' },
  { c: [32.0, 115.1], h: 103.9, kind: 'fahd' }, { c: [-32.6, 116.2], h: 103.9, kind: 'fahd' },
  { c: [-46.4, 14.2], h: 70, kind: 'fahd' }, { c: [42.8, 14.0], h: 70, kind: 'fahd' },
  { c: [39.2, -151.0], h: 70, kind: 'raisiyya' }, { c: [-40.7, -152.1], h: 70, kind: 'salam' },
]

/** Gate nodes on the outline (historic=city_gate). */
const GATES: P2[] = [[-0.4, 125.5], [-125.6, -114.4], [133.2, -112.9], [-125.9, 125.5], [123.2, 127.2], [60.1, 118.9], [-63.0, 115.8], [-207.2, 11.8], [-203.5, -58.1], [206.5, -56.9], [207.2, 9.1], [39.0, -107.2], [44.4, -116.1], [-50.4, -115.2], [-50.4, -135.2], [202.8, 73.6], [63.7, -104.6], [-202.4, 76.4], [-60.8, -102.9], [-109.3, 125.6]]

/** Kiosks, escalator houses and other plaza buildings: centre and half sizes. */
const KIOSKS: [number, number, number, number][] = [[-253.2, -173.5, 7.3, 7.7], [-252.8, -214.4, 7.3, 7.7], [-153.7, -213.8, 7.3, 7.7], [-53.3, -213.9, 7.3, 7.7], [147.3, -215.3, 7.3, 7.7], [-252.0, -77.1, 6.6, 6.3], [-250.5, 27.8, 7.4, 6.3], [-253.2, 125.6, 7.1, 7.6], [-253.1, 224.8, 7.3, 7.2], [-147.2, 225.0, 7.1, 6.8], [-36.9, 172.0, 7.2, 7.8], [39.5, 172.4, 7.5, 7.3], [153.5, 172.6, 8.2, 7.2], [250.2, 172.2, 7.8, 7.7], [247.5, 49.9, 7.6, 6.8], [249.2, -26.6, 6.3, 5.6], [305.4, 171.9, 7.2, 7.2], [308.1, 51.1, 6.4, 6.2], [308.4, -27.0, 6.5, 6.6], [-176.5, -98.1, 11, 4.1], [172.0, -100.2, 11, 3.9], [23.8, 230.6, 2.8, 12.4], [-53.7, -283.1, 7.5, 6.7], [-318.7, 171.4, 8.2, 6.6], [-151.6, -283.8, 8, 7.1], [-252.5, -283.5, 7.4, 7.6], [-322.0, -175.0, 7.6, 6.8], [-319.8, -75.5, 8.1, 7.2], [-318.2, 25.0, 8.9, 8.3], [-318.5, 124.4, 7.6, 7.1], [48.3, -216.2, 6.8, 7.3], [48.8, -284.0, 7.6, 6.7], [148.9, -284.7, 7.2, 6.3], [-146.1, 170.5, 7.3, 6.9], [-253.8, 170.6, 7.1, 7.3], [-37.0, 223.9, 7.8, 7.8], [41.2, 223.7, 8.0, 7.6], [154.6, 222.0, 8.6, 8.4], [-195.5, 4.2, 7.5, 4.9], [195.3, 1.8, 7.1, 4.6], [256.2, -257.8, 11.2, 8.0], [-319.3, 225.5, 7.2, 7.8]]

// ============================================================== model ====

const ROOF = 14.5, PARAPET = 16.5, PORTAL = 20.5, PORTICO = 9
const PORTICO_Y = -149 // the Ottoman wall line; the portico runs south of it
const UMB = 24.5 // umbrella pitch and canopy width

/** The outline with the south portico strip cut off at PORTICO_Y. */
function mainRing(): P2[] {
  const out: P2[] = []
  for (const p of OUTLINE) {
    if (p[1] < PORTICO_Y - 0.5 && p[0] > -51 && p[0] < 45) continue
    out.push(p)
  }
  // the cut corners
  const i = out.findIndex((p) => Math.abs(p[0] + 50.37) < 0.05 && Math.abs(p[1] + 149.25) < 0.05)
  out.splice(i + 1, 0, [-50.36, PORTICO_Y], [44.48, PORTICO_Y])
  return mergeCollinear(out.filter((p) => !(Math.abs(p[0] + 50.37) < 0.05 && Math.abs(p[1] + 149.25) < 0.05) && !(Math.abs(p[0] - 44.48) < 0.05 && Math.abs(p[1] + 148.11) < 0.05)))
}

function mergeCollinear(p: P2[]): P2[] {
  let ring = p.slice()
  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < ring.length; i++) {
      const a = ring[(i + ring.length - 1) % ring.length], b = ring[i], c = ring[(i + 1) % ring.length]
      const L1 = Math.hypot(b[0] - a[0], b[1] - a[1]), L2 = Math.hypot(c[0] - b[0], c[1] - b[1])
      const x = ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])) / ((L1 * L2) || 1)
      if (L1 < 0.3 || Math.abs(x) < 0.02) { ring.splice(i, 1); changed = true; break }
    }
  }
  return ring
}

type Kit = { stone: Part; white: Part; dome: Part; green: Part; win: Part; gold: Part }

function build(detail: boolean): Mat[] {
  const K: Kit = { stone: new Part(), white: new Part(), dome: new Part(), green: new Part(), win: new Part(), gold: new Part() }
  const { stone, white, dome, green, win, gold } = K
  let last = 0
  const tally = (label: string) => { const t = Object.values(K).reduce((n, p) => n + p.triangles, 0); if (process.env.TALLY) console.log(`  ${label}: ${t - last}`); last = t }

  // ------------------------------------------------------------ body ---
  const ring = ccw(mainRing())
  const courts = COURTS.map((c) => ccw(c))
  const top = detail ? ROOF : PARAPET

  // facades of the outer ring, with gate portals
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: P2 = [u[1], -u[0]]
    // gates on this edge
    const portals: [number, number][] = []
    for (const g of GATES) {
      const s = (g[0] - A[0]) * u[0] + (g[1] - A[1]) * u[1]
      const off = (g[0] - A[0]) * nrm[0] + (g[1] - A[1]) * nrm[1]
      if (Math.abs(off) > 3 || s < -1 || s > L + 1) continue
      const ottoman = A[0] > -52 && A[0] < 46 && B[0] > -52 && B[0] < 46 && A[1] < -100
      const w = ottoman ? 6.5 : L < 45 ? Math.max(9, L - 2.4) : 16
      const c = Math.min(Math.max(s, w / 2 + 0.6), L - w / 2 - 0.6)
      if (w > L - 1) continue
      portals.push([c - w / 2, c + w / 2])
    }
    portals.sort((a, b) => a[0] - b[0])
    // spans between portals carry window rows; each portal its doorways
    let s = 0
    const spans: { s0: number; s1: number; portal: boolean }[] = []
    for (const p of portals) { if (p[0] > s + 0.01) spans.push({ s0: s, s1: p[0], portal: false }); spans.push({ s0: p[0], s1: p[1], portal: true }); s = p[1] }
    if (L > s + 0.01) spans.push({ s0: s, s1: L, portal: false })
    for (const sp of spans) {
      const a: P2 = [A[0] + u[0] * sp.s0, A[1] + u[1] * sp.s0], b: P2 = [A[0] + u[0] * sp.s1, A[1] + u[1] * sp.s1]
      const len = sp.s1 - sp.s0
      const ottoman = Math.abs(A[1] - PORTICO_Y) < 0.1 && Math.abs(B[1] - PORTICO_Y) < 0.1
      if (ottoman) {
        // the Ottoman wall over the portico roof: small arched windows high up (g01)
        facade(stone, win, a, b, PORTICO, PARAPET, detail ? row(len, 9.5, 1.5, 10.6, 12.4, 'round', { depth: 0.5 }) : [], { seg: 8, flush: !detail })
      } else if (!sp.portal) {
        const lower = row(len, 8.0, 3.0, 1.4, 6.0, 'round', { depth: 0.9 }, 0.9)
        facade(stone, win, a, b, 0, PARAPET, lower, { seg: detail ? 4 : 2, flush: !detail })
        if (detail) panels(win, a, b, row(len, 8.0, 1.6, 9.3, 11.0, 'round', {}, 0.9), 4)
      } else {
        // a gate: raised pylons with tall pointed arches, doorways between (a04, m03)
        const at = (t: number): P2 => [a[0] + u[0] * t, a[1] + u[1] * t]
        const raised = (t0: number, t1: number, h: number) => {
          const d = 4.5, p = at(t0), q = at(t1)
          const p2: P2 = [p[0] - nrm[0] * d, p[1] - nrm[1] * d], q2: P2 = [q[0] - nrm[0] * d, q[1] - nrm[1] * d]
          oquad(stone, [p[0], p[1], top], [p2[0], p2[1], top], [p2[0], p2[1], h], [p[0], p[1], h], [-u[0], -u[1], 0])
          oquad(stone, [q[0], q[1], top], [q2[0], q2[1], top], [q2[0], q2[1], h], [q[0], q[1], h], [u[0], u[1], 0])
          oquad(stone, [p2[0], p2[1], top], [q2[0], q2[1], top], [q2[0], q2[1], h], [p2[0], p2[1], h], [-nrm[0], -nrm[1], 0])
          oquad(white, [p[0], p[1], h], [q[0], q[1], h], [q2[0], q2[1], h], [p2[0], p2[1], h], [0, 0, 1])
        }
        const doorsOf = (L: number, zs: number) => {
          const n = Math.max(1, Math.round((L - 2.4) / 6.2))
          const w = Math.min(4.4, (L - 2.4 - (n - 1) * 1.6) / n)
          return row(L, (L - 2.4) / n, w, 0, zs, 'pointed', { depth: 1.6, k: 0.75 }, 1.2)
        }
        if (len > 24) {
          const pw = Math.min(8.5, len * 0.24), cl = len - 2 * pw
          for (const [t0, t1] of [[0, pw], [len - pw, len]]) {
            const pa = at(t0), pb = at(t1)
            facade(stone, win, pa, pb, 0, PORTAL, [{ s0: 1.3, s1: pw - 1.3, zb: 0, zs: 8.5, head: 'pointed', k: 0.75, depth: 1.8 }], { seg: detail ? 6 : 2, flush: !detail })
            raised(t0, t1, PORTAL)
          }
          const ca = at(pw), cb = at(len - pw)
          facade(stone, win, ca, cb, 0, PARAPET, doorsOf(cl, 6.0), { seg: detail ? 6 : 2, flush: !detail })
          // the row of small domes over the gate hall (a04)
          const nd = Math.max(2, Math.round(cl / 6.5))
          for (let k = 0; k < nd; k++) {
            const t = pw + (cl * (k + 0.5)) / nd, p = at(t), c: P2 = [p[0] - nrm[0] * 5.5, p[1] - nrm[1] * 5.5]
            const rr = Math.min(2.6, cl / nd / 2 - 0.3)
            lathe(dome, c[0], c[1], [[rr, top], [rr, PARAPET + 0.6], ...(detail ? [[rr * 0.87, PARAPET + 0.6 + rr * 0.5] as P2, [rr * 0.5, PARAPET + 0.6 + rr * 0.87] as P2] : []), [0, PARAPET + 0.6 + rr]], detail ? 8 : 6, { soft: true })
          }
        } else {
          facade(stone, win, a, b, 0, PORTAL, doorsOf(len, 7.0), { seg: detail ? 6 : 2, flush: !detail })
          if (detail) panels(win, a, b, row(len, len - 2.4, Math.min(2.4, len * 0.2), 12.2, 14.6, 'pointed', { k: 0.75 }, 1.2), 4)
          raised(0, len, PORTAL)
        }
      }
    }
  }

  tally('outer facades')
  // court walls: a pointed arcade on the ground, small windows above
  for (const c of courts) {
    const cw = [...c].reverse() // walls face into the court
    for (let i = 0; i < cw.length; i++) {
      const A = cw[i], B = cw[(i + 1) % cw.length]
      const L = Math.hypot(B[0] - A[0], B[1] - A[1])
      const arcade = row(L, 5.6, 4.2, 0, 4.6, 'pointed', { depth: 2.4, k: 0.75 }, 0.4)
      facade(stone, win, A, B, 0, top, arcade, { seg: detail ? 6 : 2, flush: !detail })
      if (detail) panels(win, A, B, row(L, 5.6, 1.4, 8.6, 10.6, 'round', {}, 0.4), 4)
    }
  }

  tally('courts')
  // roof
  cap(white, ring, top, true, courts)
  if (detail) {
    // parapet: inner face and top
    const inner = inset(ring, 0.7)
    walls(stone, [...inner].reverse(), ROOF, PARAPET)
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      oquad(white, [ring[i][0], ring[i][1], PARAPET], [ring[j][0], ring[j][1], PARAPET], [inner[j][0], inner[j][1], PARAPET], [inner[i][0], inner[i][1], PARAPET], [0, 0, 1])
    }
    for (const c of courts) {
      const cc = ccw(c), grown = inset(cc, -0.6)
      walls(stone, [...cc].reverse(), ROOF, PARAPET)
      walls(stone, grown, ROOF, PARAPET)
      for (let i = 0; i < cc.length; i++) {
        const j = (i + 1) % cc.length
        oquad(white, [cc[i][0], cc[i][1], PARAPET], [cc[j][0], cc[j][1], PARAPET], [grown[j][0], grown[j][1], PARAPET], [grown[i][0], grown[i][1], PARAPET], [0, 0, 1])
      }
    }
  }

  tally('roof')
  // ------------------------------------------ south portico (Ottoman) ---
  {
    const x0 = -50.34, x1 = 44.51, y0 = -161.1, y1 = PORTICO_Y
    const pr: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    // south face: a row of round arches filled with lattice (a06, g03)
    const Ls = x1 - x0
    const arches = row(Ls, Ls / 20, 3.1, 1.0, 5.2, 'round', { depth: 0.6 }, 0.2)
    facade(stone, win, [x0, y0], [x1, y0], 0, PORTICO, arches, { seg: detail ? 8 : 2, flush: !detail })
    for (const [A, B] of [[pr[1], pr[2]], [pr[3], pr[0]]] as [P2, P2][]) {
      const L = Math.hypot(B[0] - A[0], B[1] - A[1])
      facade(stone, win, A, B, 0, PORTICO, row(L, L / 2, 3.1, 1.0, 5.2, 'round', { depth: 0.6 }, 0.2), { seg: detail ? 8 : 2, flush: !detail })
    }
    if (detail) {
      // parapet with a stepped cresting line drawn as a raised lip
      const ins = inset(pr, 0.5)
      cap(white, ins, PORTICO, true)
      walls(stone, [...ins].reverse(), PORTICO, PORTICO + 1.1)
      walls(stone, pr, PORTICO, PORTICO + 1.1)
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; oquad(white, [pr[i][0], pr[i][1], PORTICO + 1.1], [pr[j][0], pr[j][1], PORTICO + 1.1], [ins[j][0], ins[j][1], PORTICO + 1.1], [ins[i][0], ins[i][1], PORTICO + 1.1], [0, 0, 1]) }
    } else cap(white, pr, PORTICO, true)
    // the Ottoman wall above the portico roof (part of the main ring's south face)
  }

  tally('portico')
  // ------------------------------------------------------ sliding domes ---
  for (const [cx, cy] of DOMES) {
    const h = 9.75, base = top + 2.6
    box(stone, cx - h, cx + h, cy - h, cy + h, top - 0.1, base, { top: white })
    const R = 8.2, H = 5.4, Rs = (R * R + H * H) / (2 * H)
    const n = detail ? 12 : 6, rings = detail ? 3 : 2
    const prof: P2[] = [[R + 0.3, base], [R + 0.3, base + 0.9], [R, base + 0.9]]
    for (let k = 1; k <= rings; k++) {
      const t = (k / rings) * Math.asin(R / Rs)
      prof.push([Rs * Math.sin(Math.asin(R / Rs) - t), base + 0.9 + (Rs * Math.cos(Math.asin(R / Rs) - t) - (Rs - H))])
    }
    prof[prof.length - 1][0] = 0
    if (detail) {
      lathe(white, cx, cy, prof.slice(0, 3), n, { smooth: true })
      lathe(dome, cx, cy, prof.slice(2), n, { soft: true })
      lathe(gold, cx, cy, [[0.35, base + 0.9 + H - 0.05], [0, base + 0.9 + H + 1.6]], 4, { smooth: false })
    } else lathe(dome, cx, cy, [[R, base], ...prof.slice(3)], n, { soft: true })
  }

  tally('sliding domes')
  // --------------------------------------------- Green Dome, silver dome ---
  {
    const [cx, cy] = [29.0, -135.2]
    // white faceted base on the roof (a06: the white stepped octagon)
    lathe(white, cx, cy, [[12.6, top - 0.2], [12.6, 16.4], [11.4, 17.5], [0.01, 17.5]], 8, { smooth: false, a0: Math.PI / 8 })
    const drum: P2[] = [[10.0, 17.5], [10.0, 23.4], [10.5, 23.6], [10.5, 24.1], [9.8, 24.3]]
    const n = detail ? 24 : 12
    if (detail) {
      // the drum with its small arched windows: a 24-sided drum, windows on every other face
      const ringD = ngon(cx, cy, 10.0, n)
      for (let i = 0; i < n; i++) {
        const A = ringD[i], B = ringD[(i + 1) % n]
        facade(green, i % 2 ? win : null, A, B, 17.5, 23.4, i % 2 ? [{ s0: 0.5, s1: Math.hypot(B[0] - A[0], B[1] - A[1]) - 0.5, zb: 19.2, zs: 21.6, head: 'round', depth: 0.25 }] : [], { seg: 4 })
      }
      lathe(green, cx, cy, drum.slice(1), n, { smooth: true })
    } else lathe(green, cx, cy, drum, n, { smooth: true })
    // the dome: a slightly pointed profile, 0.85 as tall as wide
    const prof: P2[] = []
    const steps = detail ? 10 : 5
    for (let k = 0; k <= steps; k++) {
      const t = k / steps
      const r = 9.8 * Math.pow(Math.cos((t * Math.PI) / 2), 0.8)
      const z = 24.3 + 12.4 * Math.sin((t * Math.PI) / 2) + (t > 0.8 ? (t - 0.8) * 6 : 0)
      prof.push([k === steps ? 0 : r, z])
    }
    lathe(green, cx, cy, prof, n, { soft: true })
    finial(gold, cx, cy, prof[prof.length - 1][1] - 0.2, 3.6, detail)
    // the silver dome over the Prophet's mihrab area (way/444217620)
    const [sx, sy] = [7.0, -146.3]
    lathe(white, sx, sy, [[5.9, top - 0.2], [5.9, 18.2], [5.5, 18.4]], detail ? 16 : 8, { smooth: false, a0: Math.PI / 8 })
    const sp: P2[] = []
    for (let k = 0; k <= (detail ? 8 : 4); k++) {
      const t = k / (detail ? 8 : 4)
      sp.push([k === (detail ? 8 : 4) ? 0 : 5.5 * Math.cos((t * Math.PI) / 2), 18.4 + 5.6 * Math.sin((t * Math.PI) / 2)])
    }
    lathe(dome, sx, sy, sp, detail ? 16 : 8, { soft: true })
    finial(gold, sx, sy, 23.9, 1.8, detail)
  }

  tally('green+silver')
  // ------------------------------------------------- Ottoman small domes ---
  {
    const xs = [-44.5, -38.3, -32.1, -25.9, -19.7, -13.5, -7.3, -1.1, 4.9, 10.9]
    const ys = [-142.6, -136.2, -129.8, -123.4, -117.0, -110.6]
    for (const y of ys) for (const x of xs) {
      if (!detail) break
      if (x > 0 && y < -139.5) continue // the silver dome
      if (x > 10 && y > -125) continue
      const r = 2.5, n = 6
      const b = top
      lathe(dome, x, y, [[r, b], ...(detail ? [[r * 0.87, b + 1.25] as P2, [r * 0.5, b + 2.17] as P2] : [[r * 0.7, b + 1.8] as P2]), [0, b + 2.5]], n, { soft: true })
    }
  }

  tally('small domes')
  // ------------------------------------------------------------ minarets ---
  for (const m of MINARETS) {
    if (m.kind === 'fahd') fahdMinaret(K, m.c[0], m.c[1], m.h, detail)
    else if (m.kind === 'raisiyya') raisiyya(K, m.c[0], m.c[1], m.h, detail)
    else babSalam(K, m.c[0], m.c[1], m.h, detail)
  }

  tally('minarets')
  // ----------------------------------------------------------- umbrellas ---
  if (!process.env.NO_UMBRELLAS) for (const [x, y] of umbrellaSites()) openUmbrella(K, x, y, detail)
  for (const c of COURTS) {
    const x0 = c[0][0], x1 = c[1][0], y0 = c[0][1], y1 = c[2][1]
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) closedUmbrella(K, x0 + ((x1 - x0) * (i + 0.5)) / 3, y0 + ((y1 - y0) * (j + 0.5)) / 2, detail)
  }

  tally('umbrellas')
  return materials(K)
}

/** A gold finial: balls on a spike, and a crescent in the detail model. */
function finial(gold: Part, x: number, y: number, z: number, h: number, detail: boolean) {
  const n = detail ? 6 : 4
  const prof: P2[] = [[0.28 * h / 2.8, z], [0.42 * h / 2.8, z + 0.25 * h], [0.15 * h / 2.8, z + 0.4 * h], [0.32 * h / 2.8, z + 0.55 * h], [0.1 * h / 2.8, z + 0.7 * h], [0, z + 0.78 * h]]
  lathe(gold, x, y, detail ? prof : [prof[0], prof[1], prof[5]], n, { smooth: true })
  if (detail) crescent(gold, x, y, z + 0.78 * h, 0.22 * h)
}

/** A crescent in the east-west plane, horns up. */
function crescent(gold: Part, x: number, y: number, z: number, s: number) {
  const n = 7, R = s / 2, t = s * 0.08
  const o = (f: number, side: number): V3 => [x + R * Math.cos(f), y + side * t, z + R + R * Math.sin(f)]
  const i_ = (f: number, side: number): V3 => [x + 0.8 * R * Math.cos(f), y + side * t, z + 1.25 * R + 0.8 * R * Math.sin(f)]
  for (let k = 0; k < n; k++) {
    const f0 = 2.6 + (4.22 * k) / n, f1 = 2.6 + (4.22 * (k + 1)) / n
    for (const side of [1, -1]) oquad(gold, o(f0, side), o(f1, side), i_(f1, side), i_(f0, side), [0, side, 0])
    const m = (f0 + f1) / 2
    oquad(gold, o(f0, 1), o(f1, 1), o(f1, -1), o(f0, -1), [Math.cos(m), 0, Math.sin(m)])
  }
}

/** A gallery: a corbelled ring slab (polygon of n sides) with a parapet in detail. */
function gallery(K: Kit, x: number, y: number, rIn: number, rOut: number, z: number, n: number, detail: boolean, a0 = 0) {
  if (n > 8) { n = 8; a0 = Math.PI / 8 }
  // corbel out from the shaft, then the balcony's parapet: its pierced
  // balustrade reads dark in the photos (a04, a06), so it is a dark band
  rOut = rIn + (rOut - rIn) * 1.35
  const o = { smooth: n > 4, a0 }, zt = z + (detail ? 1.4 : 1.0)
  lathe(K.stone, x, y, [[rIn, z - 1.3], [rOut, z + 0.1]], n, o)
  lathe(K.win, x, y, [[rOut, z + 0.1], [rOut, zt]], n, o)
  lathe(K.white, x, y, [[rOut, zt], [rIn, zt]], n, { smooth: false, a0 })
}

/**
 * A stage with arched openings round it (the arcaded and windowed stages):
 * an n-sided drum whose faces carry one recessed opening each.
 */
function arcadedStage(K: Kit, x: number, y: number, r: number, z0: number, z1: number, n: number, detail: boolean, a0 = 0, wFrac = 0.55, zb = 0.15, zsFrac = 0.62) {
  const ring = ngon(x, y, r, n, a0)
  for (let i = 0; i < n; i++) {
    const A = ring[i], B = ring[(i + 1) % n]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), w = L * wFrac
    const zs = z0 + (z1 - z0) * zsFrac
    const op: Opening = { s0: (L - w) / 2, s1: (L + w) / 2, zb: z0 + (z1 - z0) * zb, zs, head: 'pointed', k: 0.8, depth: Math.min(0.7, r * 0.25) }
    facade(K.stone, K.win, A, B, z0, z1, detail ? [op] : [], { seg: 4 })
  }
}

/** A cylinder of n sides with a zigzag band: rows of triangles, the up-pointing ones grey on alternate rows. */
function zigzag(K: Kit, x: number, y: number, r: number, z0: number, z1: number, n: number, rows: number) {
  const P = (a: number, z: number): V3 => [x + r * Math.cos(a), y + r * Math.sin(a), z]
  const D = TAU / n
  for (let k = 0; k < rows; k++) {
    const za = z0 + ((z1 - z0) * k) / rows, zb = z0 + ((z1 - z0) * (k + 1)) / rows, ob = (k % 2) * 0.5
    for (let i = 0; i < n; i++) {
      const a = (i + ob) * D, b = (i + 1 + ob) * D, t = (i + ob + 0.5) * D, t2 = (i + ob + 1.5) * D
      const N = (f: number): V3 => [Math.cos(f), Math.sin(f), 0]
      ;(k % 2 === 0 ? K.dome : K.stone).tri(P(a, za), P(b, za), P(t, zb), [0, 0], [0, 0], [0, 0], [N(a), N(b), N(t)])
      K.stone.tri(P(t, zb), P(b, za), P(t2, zb), [0, 0], [0, 0], [0, 0], [N(t), N(b), N(t2)])
    }
  }
}

/** The 104 m King Fahd minaret (and the 70 m 1950s pair, scaled). */
function fahdMinaret(K: Kit, x: number, y: number, H: number, detail: boolean) {
  const s = H / 103.9, w = s < 0.9 ? 1.05 : 1.25 // drawn 1.25x the photo-scaled widths (lead review: bolder at phone size); the 70 m pair a little slimmer
  const z = (v: number) => v * s, r = (v: number) => v * w
  const sq = r(3.8)
  // square shaft (corners at 45°: a0 = PI/4 with radius sq*sqrt2)
  const R4 = sq * Math.SQRT2
  if (!detail) {
    // the low model: square sections throughout (the shaft is 1-2 px wide below zoom 16)
    const q = Math.SQRT2, o = { smooth: false, a0: Math.PI / 4 }
    lathe(K.stone, x, y, [[R4, 0], [R4, z(32.8)], [r(5.2) * q, z(34.35)]], 4, o)
    lathe(K.white, x, y, [[r(5.2) * q, z(34.35)], [r(3.3) * q, z(34.35)]], 4, o)
    lathe(K.stone, x, y, [[r(3.3) * q, z(34.35)], [r(3.3) * q, z(51.6)], [r(4.4) * q, z(52.95)], [r(2.9) * q, z(52.95)]], 4, o)
    lathe(K.dome, x, y, [[r(2.9) * q, z(52.95)], [r(2.9) * q, z(67)]], 4, o)
    lathe(K.stone, x, y, [[r(2.9) * q, z(67)], [r(4.0) * q, z(70.35)], [r(2.6) * q, z(70.35)], [r(2.6) * q, z(81)], [r(3.4) * q, z(82.35)], [r(2.1) * q, z(82.35)], [r(2.4) * q, z(90.5)], [r(1.5) * q, z(94)], [0, z(100.8)]], 4, o)
    // the galleries' dark balustrades, bold enough to read as bands
    for (const [rg, zg] of [[5.2, 34.35], [4.4, 52.95], [4.0, 70.35], [3.4, 82.35]]) lathe(K.win, x, y, [[r(rg) * q + 0.05, z(zg)], [r(rg) * q + 0.05, z(zg) + 1.1]], 4, o)
    lathe(K.gold, x, y, [[0.3, z(100.6)], [0, H]], 3, { smooth: false })
    return
  }
  if (detail) {
    // a tall pointed niche on each face (m01, a04), as a panel
    lathe(K.stone, x, y, [[R4, 0], [R4, z(32.8)]], 4, { smooth: false, a0: Math.PI / 4 })
    const ring = ngon(x, y, R4, 4, Math.PI / 4)
    for (let i = 0; i < 4; i++) {
      const A = ring[i], B = ring[(i + 1) % 4], L = 2 * sq
      panels(K.win, A, B, [{ s0: L * 0.3, s1: L * 0.7, zb: z(21), zs: z(27), head: 'pointed', k: 0.8 }], 4)
    }
  } else lathe(K.stone, x, y, [[R4, 0], [R4, z(32.8)]], 4, { smooth: false, a0: Math.PI / 4 })
  gallery(K, x, y, R4, r(5.2) * Math.SQRT2, z(34), 4, detail, Math.PI / 4)
  // octagonal arcaded stage
  const R8 = r(3.3) / Math.cos(Math.PI / 8)
  lathe(K.stone, x, y, [[R8, z(34.35)], [R8, z(51.6)]], 8, { smooth: false, a0: Math.PI / 8 })
  if (detail) { const pr = ngon(x, y, R8, 8, Math.PI / 8); for (let i = 0; i < 8; i++) { const L = Math.hypot(pr[(i + 1) % 8][0] - pr[i][0], pr[(i + 1) % 8][1] - pr[i][1]); panels(K.win, pr[i], pr[(i + 1) % 8], [{ s0: L * 0.28, s1: L * 0.72, zb: z(38.5), zs: z(46.5), head: 'pointed', k: 0.8 }], 2) } }
  gallery(K, x, y, R8, r(4.4) / Math.cos(Math.PI / 8), z(52.6), 8, detail, Math.PI / 8)
  // zigzag cylinder
  const n = detail ? 12 : 8
  if (detail) {
    lathe(K.stone, x, y, [[r(2.9), z(52.95)], [r(2.9), z(55.5)]], n)
    zigzag(K, x, y, r(2.9), z(55.5), z(66.5), n, 4)
    lathe(K.dome, x, y, [[r(2.9), z(66.5)], [r(2.9), z(67.6)]], n)
    lathe(K.stone, x, y, [[r(2.9), z(67.6)], [r(2.9), z(69)]], n)
  } else {
    lathe(K.stone, x, y, [[r(2.9), z(52.95)], [r(2.9), z(56)]], n)
    lathe(K.dome, x, y, [[r(2.9), z(56)], [r(2.9), z(66)]], n)
    lathe(K.stone, x, y, [[r(2.9), z(66)], [r(2.9), z(69)]], n)
  }
  gallery(K, x, y, r(2.9), r(4.0), z(70), n, detail)
  // arcaded cylinder
  if (detail) arcadedStage(K, x, y, r(2.6), z(70.35), z(81), 8, true, Math.PI / 8, 0.6, 0.12, 0.72)
  else lathe(K.stone, x, y, [[r(2.6), z(70.35)], [r(2.6), z(81)]], n)
  gallery(K, x, y, r(2.6), r(3.4), z(82), n, detail)
  // top pavilion, cap ring, bulb, spire, finial
  lathe(K.stone, x, y, [[r(2.1), z(82.35)], [r(2.1), z(89.4)]], 8, { smooth: false, a0: Math.PI / 8 })
  if (detail) { const pr = ngon(x, y, r(2.1), 8, Math.PI / 8); for (let i = 0; i < 8; i++) { const L = Math.hypot(pr[(i + 1) % 8][0] - pr[i][0], pr[(i + 1) % 8][1] - pr[i][1]); panels(K.win, pr[i], pr[(i + 1) % 8], [{ s0: L * 0.25, s1: L * 0.75, zb: z(84), zs: z(87.5), head: 'pointed', k: 0.8 }], 2) } }
  lathe(K.stone, x, y, [[r(2.1), z(89.4)], [r(2.5), z(89.9)], [r(2.5), z(90.5)], [r(1.2), z(90.6)]], n)
  const bulb: P2[] = [[r(1.2), z(90.6)], [r(1.55), z(92.2)], [r(1.6), z(93.6)], [r(1.35), z(95.4)], [r(0.8), z(97.2)], [r(0.35), z(98.4)], [r(0.3), z(100.6)], [0, z(100.8)]]
  lathe(K.stone, x, y, detail ? bulb : [bulb[0], bulb[2], bulb[4], bulb[7]], 8, { soft: true })
  finial(K.gold, x, y, z(100.6), z(3.3), detail)
}

/** The Raisiyya (main) minaret by the Green Dome (g01, a06): Mamluk stages. */
function raisiyya(K: Kit, x: number, y: number, H: number, detail: boolean) {
  const z = (f: number) => f * H
  const sq = 2.6, R4 = sq * Math.SQRT2
  if (!detail) {
    const q = Math.SQRT2, o = { smooth: false, a0: Math.PI / 4 }
    lathe(K.stone, x, y, [[R4, 0], [R4, z(0.47)], [3.6 * q, z(0.485)], [2.5 * q, z(0.485)]], 4, o)
    lathe(K.dome, x, y, [[2.5 * q, z(0.485)], [2.5 * q, z(0.6)]], 4, o)
    lathe(K.stone, x, y, [[2.5 * q, z(0.6)], [3.3 * q, z(0.695)], [2.0 * q, z(0.695)], [2.0 * q, z(0.8)], [2.7 * q, z(0.815)], [1.75 * q, z(0.885)], [0, z(0.947)]], 4, o)
    lathe(K.gold, x, y, [[0.3, z(0.94)], [0, H]], 3, { smooth: false })
    return
  }
  if (detail) {
    const ring = ngon(x, y, R4, 4, Math.PI / 4)
    for (let i = 0; i < 4; i++) facade(K.stone, K.win, ring[i], ring[(i + 1) % 4], 0, z(0.47), [{ s0: 1.6, s1: 3.6, zb: z(0.36), zs: z(0.42), head: 'pointed', k: 0.8, depth: 0.35 }], { seg: 4 })
  } else lathe(K.stone, x, y, [[R4, 0], [R4, z(0.47)]], 4, { smooth: false, a0: Math.PI / 4 })
  gallery(K, x, y, R4, 3.6 * Math.SQRT2, z(0.48), 4, detail, Math.PI / 4)
  const R8 = 2.5 / Math.cos(Math.PI / 8)
  if (detail) zigzag(K, x, y, R8 * 0.97, z(0.485), z(0.6), 8, 4)
  else lathe(K.dome, x, y, [[R8, z(0.485)], [R8, z(0.6)]], 8, { smooth: false, a0: Math.PI / 8 })
  if (detail) arcadedStage(K, x, y, R8, z(0.6), z(0.68), 8, true, Math.PI / 8, 0.45, 0.2, 0.7)
  else lathe(K.stone, x, y, [[R8, z(0.6)], [R8, z(0.68)]], 8, { smooth: false, a0: Math.PI / 8 })
  gallery(K, x, y, R8, 3.3, z(0.69), 12, detail)
  const n = detail ? 12 : 8
  if (detail) arcadedStage(K, x, y, 2.0, z(0.695), z(0.8), 8, true, Math.PI / 8, 0.5, 0.25, 0.7)
  else lathe(K.stone, x, y, [[2.0, z(0.695)], [2.0, z(0.8)]], n)
  gallery(K, x, y, 2.0, 2.7, z(0.81), 12, detail)
  lathe(K.stone, x, y, [[1.7, z(0.815)], [1.7, z(0.865)], [1.9, z(0.87)], [1.75, z(0.885)]], n)
  // ribbed cupola
  lathe(K.stone, x, y, [[1.75, z(0.885)], [1.6, z(0.91)], [1.1, z(0.93)], [0.3, z(0.945)], [0, z(0.947)]], detail ? 12 : 6, { soft: true })
  finial(K.gold, x, y, z(0.94), H - z(0.94), detail)
}

/** The Bab al-Salam minaret (south-west): Ottoman pencil with a green cone (g03, a06). */
function babSalam(K: Kit, x: number, y: number, H: number, detail: boolean) {
  const z = (f: number) => f * H
  const sq = 2.4, R4 = sq * Math.SQRT2
  if (!detail) {
    const q = Math.SQRT2, o = { smooth: false, a0: Math.PI / 4 }
    lathe(K.stone, x, y, [[R4, 0], [R4, z(0.47)], [3.4 * q, z(0.485)], [2.1 * q, z(0.485)], [2.1 * q, z(0.6)], [2.9 * q, z(0.615)], [1.9 * q, z(0.615)], [2.0 * q, z(0.745)]], 4, o)
    lathe(K.green, x, y, [[2.0 * q, z(0.745)], [0, z(0.96)]], 4, o)
    lathe(K.gold, x, y, [[0.3, z(0.955)], [0, H]], 3, { smooth: false })
    return
  }
  if (detail) {
    const ring = ngon(x, y, R4, 4, Math.PI / 4)
    for (let i = 0; i < 4; i++) facade(K.stone, K.win, ring[i], ring[(i + 1) % 4], 0, z(0.47), [{ s0: 1.5, s1: 3.3, zb: z(0.37), zs: z(0.43), head: 'pointed', k: 0.8, depth: 0.35 }], { seg: 4 })
  } else lathe(K.stone, x, y, [[R4, 0], [R4, z(0.47)]], 4, { smooth: false, a0: Math.PI / 4 })
  gallery(K, x, y, R4, 3.4 * Math.SQRT2, z(0.48), 4, detail, Math.PI / 4)
  const n = detail ? 12 : 8
  const R = 2.1
  if (detail) arcadedStage(K, x, y, R, z(0.485), z(0.6), 8, true, Math.PI / 8, 0.45, 0.3, 0.7)
  else lathe(K.stone, x, y, [[R, z(0.485)], [R, z(0.6)]], n)
  gallery(K, x, y, R, 2.9, z(0.61), 12, detail)
  lathe(K.stone, x, y, [[1.9, z(0.615)], [1.9, z(0.69)]], n)
  gallery(K, x, y, 1.9, 2.6, z(0.7), 12, detail)
  lathe(K.stone, x, y, [[1.8, z(0.705)], [1.8, z(0.74)], [2.0, z(0.745)]], n)
  // the tall green cone (a06: about a quarter of the height)
  lathe(K.green, x, y, [[2.0, z(0.745)], [1.0, z(0.86)], [0.15, z(0.955)], [0, z(0.96)]], detail ? 12 : 8, { smooth: true })
  finial(K.gold, x, y, z(0.955), H - z(0.955), detail)
}

/** The umbrella sites: a 24.5 m grid along each facade, clear of kiosks and walkways, the 250 nearest kept. */
export function umbrellaSites(): P2[] {
  const ring = ccw(OUTLINE)
  const inPoly = (p: P2, poly: P2[]) => {
    let c = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j]
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
    }
    return c
  }
  const distTo = (p: P2) => {
    let d = Infinity
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const ab: P2 = [b[0] - a[0], b[1] - a[1]], L2 = ab[0] ** 2 + ab[1] ** 2
      const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / L2))
      d = Math.min(d, Math.hypot(p[0] - a[0] - ab[0] * t, p[1] - a[1] - ab[1] * t))
    }
    return d
  }
  const h = UMB / 2
  const clearOfMosque = (x: number, y: number) => {
    for (const dx of [-h, 0, h]) for (const dy of [-h, 0, h]) if (inPoly([x + dx, y + dy], ring)) return false
    return distTo([x, y]) > h + 1.0
  }
  const sites: { p: P2; d: number }[] = []
  const add = (x: number, y: number) => {
    if (x - h < -337 || x + h > 322 || y - h < -303 || y + h > 244) return // the plaza fence
    if (x + h > 236 && y - h < -22) return // al-Baqi
    if (!clearOfMosque(x, y)) return
    if (x > -64 && x < 58 && y < -161 && y > -235) return // the open front of the Ottoman portico (a06)
    if (Math.abs(x) < 14 && y > 125) return // the King Fahd gate walkway
    for (const [kx, ky, hx, hy] of KIOSKS) if (Math.abs(x - kx) < hx + 6 && Math.abs(y - ky) < hy + 6) return
    if (sites.some((s) => Math.abs(s.p[0] - x) < UMB - 0.1 && Math.abs(s.p[1] - y) < UMB - 0.1)) return
    sites.push({ p: [x, y], d: distTo([x, y]) })
  }
  // west and east bands: columns off the facades, rows on a common lattice
  for (let i = 0; i < 6; i++) for (let j = -13; j <= 10; j++) {
    add(-208.5 - 1.5 - h - i * UMB, 2 + j * UMB)
    add(210.5 + 1.5 + h + i * UMB, 2 + j * UMB)
  }
  // north and south bands: on a lattice centred on the King Fahd gate axis
  for (let i = -9; i <= 9; i++) for (let j = 0; j < 7; j++) {
    add(i * UMB, 130.5 + 1.5 + h + j * UMB)
    add(i * UMB, -115 - 1.5 - h - j * UMB)
  }
  sites.sort((a, b) => a.d - b.d)
  return sites.slice(0, 250).map((s) => s.p)
}

/** The upward normal of a triangle. */
const upN = (a: V3, b: V3, c: V3): V3 => { const n = cr(sb(b, a), sb(c, a)); return n[2] >= 0 ? n : [-n[0], -n[1], -n[2]] }

/** An open plaza umbrella: stone mast, gold lantern, a scalloped funnel canopy. */
function openUmbrella(K: Kit, x: number, y: number, detail: boolean) {
  const h = UMB / 2 - 0.15, zc = 8.3, zr = 15.0
  if (!detail) {
    // canopy only: four triangles from the mast head to the rim corners (the 1.3 m mast is under a pixel below zoom 16)
    const C: V3 = [x, y, zc]
    const r: V3[] = [[x - h, y - h, zr], [x + h, y - h, zr], [x + h, y + h, zr], [x - h, y + h, zr]]
    const nc: V3 = [0, 0, 1], nr = (p: V3): V3 => [(x - p[0]) * 0.012, (y - p[1]) * 0.012, 1]
    for (let i = 0; i < 4; i++) K.white.tri(C, r[i], r[(i + 1) % 4], [0, 0], [0, 0], [0, 0], [nc, nr(r[i]), nr(r[(i + 1) % 4])])
    return
  }
  lathe(K.stone, x, y, [[0.92, 0], [0.92, 6.9]], 4, { smooth: true, a0: Math.PI / 4 })
  lathe(K.gold, x, y, [[1.34, 6.9], [1.34, 8.0]], 4, { smooth: true, a0: Math.PI / 4 })
  // canopy: 8 rim points (corners, mid-edges) at zr with an arched dip between each pair
  const rim: V3[] = []
  const pts8: P2[] = [[h, 0], [h, h], [0, h], [-h, h], [-h, 0], [-h, -h], [0, -h], [h, -h]]
  for (let i = 0; i < 8; i++) {
    const a = pts8[i], b = pts8[(i + 1) % 8]
    rim.push([x + a[0], y + a[1], zr])
    const m: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ml = Math.hypot(m[0], m[1])
    rim.push([x + m[0] - (m[0] / ml) * 0.9, y + m[1] - (m[1] / ml) * 0.9, zr - 1.3])
  }
  // four points round the mast head; smooth funnel normals, so the canopy welds and shades as a membrane
  const base: V3[] = Array.from({ length: 4 }, (_, i) => { const a = (i * TAU) / 4 + Math.PI / 4; return [x + 1.0 * Math.cos(a), y + 1.0 * Math.sin(a), zc - 0.3] as V3 })
  const nn = (p: V3): V3 => { const dx = p[0] - x, dy = p[1] - y, d = Math.hypot(dx, dy) || 1, t = d < 2 ? 0.5 : 0.2; return [(-dx / d) * t, (-dy / d) * t, 1] }
  const T = (a: V3, b: V3, c: V3) => { const n = upN(a, b, c); const g = cr(sb(b, a), sb(c, a)); const [p, q] = dt(g, n) >= 0 ? [b, c] : [c, b]; K.white.tri(a, p, q, [0, 0], [0, 0], [0, 0], [nn(a), nn(p), nn(q)]) }
  for (let i = 0; i < 16; i++) {
    const j = (i + 1) % 16, bi = Math.floor(i / 4), bj = Math.floor(j / 4) % 4
    T(base[bi], rim[i], rim[j])
    if (bi !== bj) T(base[bi], rim[j], base[bj])
  }
  // the gold finial on the mast head, above the canopy
  lathe(K.gold, x, y, [[0.45, zc - 0.3], [0, zc + 3.4]], 3, { smooth: true })
}

/** A closed court umbrella: mast and a white folded spindle with a gold tip. */
function closedUmbrella(K: Kit, x: number, y: number, detail: boolean) {
  const n = detail ? 8 : 4
  if (!detail) { lathe(K.white, x, y, [[1.2, 7.0], [1.7, 11.5], [0, 19.0]], 4, { smooth: false }); return }
  lathe(K.stone, x, y, [[0.6, 0], [0.6, 7.5]], 6, { smooth: true })
  if (detail) box(K.gold, x - 0.8, x + 0.8, y - 0.8, y + 0.8, 7.5, 8.6)
  lathe(K.white, x, y, [[0.7, 8.6], [1.7, 11.5], [1.5, 15.5], [0.6, 18.6], [0, 19.0]], n, { smooth: false })
  if (detail) lathe(K.gold, x, y, [[0.25, 18.8], [0.2, 19.8], [0, 20.4]], 4, { smooth: false })
}

function materials(K: Kit): Mat[] {
  const lit = (base: number) => (p: V3) => (p[2] > PARAPET + 0.5 ? 0.9 : base)
  return [
    { part: K.stone, material: { ...finish('nabawi-stone', 0xe6d3bd), floodlight: lit(0.55) } },
    { part: K.white, material: { ...finish('nabawi-white', 0xfafaf7), doubleSided: true } },
    { part: K.dome, material: finish('nabawi-dome', 0xdadfe1) },
    { part: K.green, material: { ...finish('green-dome', 0x4f9460), floodlight: () => 0.85 } },
    { part: K.win, material: PALETTE.window },
    { part: K.gold, material: { ...finish('nabawi-gold', 0xd4b46a), floodlight: () => 0.6 } },
  ]
}

if (import.meta.main) {
  const title = "Al-Masjid an-Nabawi (the Prophet's Mosque)"
  await writeModel('medina-prophets-mosque.glb', title, build(false), 6500, 250 * 1024)
  await writeModel('medina-prophets-mosque.detail.glb', title, build(true), 40_000, 1536 * 1024)
}
