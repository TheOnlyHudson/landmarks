/**
 * USS Cod (SS-224), Gato-class submarine (launched 1942, commissioned 1943),
 * museum ship moored at North Coast Harbor, Cleveland — original procedural
 * geometry, CC0-1.0.
 * bun generators/cle-uss-cod.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * waterline. Anchor = area centroid of the OSM outline way/166174337
 * (building=ship, Q2078835), 41.5100737,-81.6916281. The hull's axis runs
 * at 204.6° (bow to the south-south-west, stern toward Barge 225), so the
 * catalog bearing is 204.6: +y is the bow, +x the harbour side (WNW),
 * -x the quay. The 2019 lidar puts the hull's centreline 1.4 m toward the
 * quay from the OSM outline's (the outline is an OSM trace offset), so the
 * model is drawn on x = -1.4; it runs from y -47.3 (stern) to +46.4 (stem),
 * the OSM outline's length (93.8 m; published LOA 95.0 m, beam 8.3 m).
 *
 * Identity, in order: the long, low grey casing with its black saddle
 * tanks at the waterline and the dark slatted deck; the bow rising and
 * sweeping forward to a rounded stem, the row of flood holes along the
 * casing; the fairwater (sail) a little forward of midships, with its gun
 * platforms fore and aft, the taller bridge block between them, the
 * periscope shears and the radar mast; the 5"/25 deck gun just aft of the
 * fairwater.
 *
 * Evidence:
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019),
 *    1 m and 0.5 m grids read in this frame; y = 0 is the lake surface
 *    (the water returns sit 0.1-0.4 m over the box's lowest return, and
 *    the map's terrain there is flat lake at 174.56 m). Deck 1.6 m at the
 *    stern, 2.7-2.8 aft, 3.1 at the fairwater, 3.6 at y 18, 4.2 at y 34,
 *    4.8 at the stem; saddle-tank shoulders 1.4-1.6 m; fairwater gun
 *    platforms 5.1 m (y 2-15.5); bridge block 6.3-6.9 m (y 5.5-12.5;
 *    drawn 6.85, the photos' height); periscope shears to 10.9-11.6 m
 *    (y 6.5-10.5; drawn 11.15, periscopes to 12.8 from the photos); radar mast ~10.7 m
 *    (y 5.5); deck gun 4.3-4.8 m (y -4 to -6).
 *  - plan: OSM outline for the length and taper; the lidar for the deck
 *    width (5.5 m amidships) and the waterline beam (8.2 m, published 8.3).
 *  - forms and colours: the photos below. Grey casing and fairwater, black
 *    saddle tanks and boot-topping, black-painted slatted deck (pulled to
 *    charcoal), the flood holes larger and round at the bow.
 *  - elevation 0: OSM maps the ship as a building on the water with
 *    nothing under it; terrain.ts shows the lake flat at 174.56 m under
 *    the whole hull (the quay rises to 1.2-1.3 m 2-3 m off the quay side).
 *    Nothing is modelled under the waterline and no water is modelled.
 *
 * Photos (Wikimedia Commons): Cleveland August 2015 30, 31 and 36 (USS
 * Cod).jpg (Michael Barera, CC BY-SA 4.0); USS Cod (2022).jpg (Eric
 * Friedebach, CC BY 2.0); Submarine Exterior.jpg and Submarine Exterior
 * (guns).jpg (Chris Light, CC BY-SA 4.0, 2006); USS COD - Joy of Museums 3
 * .jpg (GordonMakryllos, CC BY-SA 4.0). Flickr 2502795101 "USS Cod"
 * (Elfboy, CC BY 2.0). USGS NAIP for the plan. No commercial imagery.
 * Look-only: none.
 *
 * Left out: railings, lifelines, the jackstaff and antennas, the hull
 * number and battle flags (lettering), the folded bow planes, the gangway
 * and its sign (on the quay), the cleats and bollards.
 *
 * Doubts: no photo from the harbour side or from above; that side is the
 * quay side mirrored. The low lidar bump on the foredeck (y -25..-28 in
 * the stern-up frame, i.e. y 25-28 here, 1.5 m high) is not identified
 * and is drawn as a low hatch casing. The stem's rake and the stern's
 * taper below the deck are estimated from the 2015 and 2022 bow photos.
 * The guns' training is as photographed 2015-2022 and may change. Night:
 * no night photo found, so nothing is lit.
 */
import { Part, type V3, cross, sub } from './mesh'
import { finish } from './palette'
import { save, walls, cap, lathe, type XY } from './chi-aon-center'

const XC = -1.4

const pl = (t: [number, number][]) => (y: number) => {
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) {
    const [y0, v0] = t[i - 1], [y1, v1] = t[i]
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return t[t.length - 1][1]
}
const Y0 = -47.3, Y1 = 46.4
// Waterline half-beam, deck half-width, deck height, and the keel line
// where the stem and stern rise out of the water.
const hb = pl([[Y0, 0.3], [-44, 1.2], [-40, 2.2], [-34, 3.0], [-26, 3.7], [-18, 4.1], [16, 4.1], [24, 3.85], [30, 3.4], [36, 2.6], [40, 1.6], [43, 0.6], [Y1, 0.1]])
const dw = pl([[Y0, 0.3], [-44, 0.8], [-40, 1.4], [-34, 1.9], [-26, 2.4], [-16, 2.75], [20, 2.75], [28, 2.5], [34, 2.1], [40, 1.4], [44, 0.8], [Y1, 0.25]])
const dz = pl([[Y0, 1.5], [-44, 1.8], [-40, 2.3], [-36, 2.7], [-24, 2.8], [-10, 3.0], [0, 3.1], [10, 3.3], [18, 3.6], [26, 3.9], [34, 4.2], [40, 4.5], [Y1, 4.85]])
const zb = pl([[Y0, 0.9], [-45, 0.2], [-44, 0], [41, 0], [43, 0.5], [44.5, 1.3], [45.7, 2.4], [Y1, 3.6]])

/** One side's section at y, waterline to deck edge, as (half, z). */
function section(y: number): XY[] {
  const b = hb(y), d = dw(y), D = dz(y), z0 = zb(y)
  const Z = (h: number) => z0 + (h * (D - z0)) / D
  const g = Math.max(0, b - d)
  return [
    [b, z0],
    [b, Z(0.6)],
    [d + g * 0.82, Z(1.15)],
    [d + g * 0.08 + 0.04, Z(1.5)],
    [d, Z(D - 0.15)],
    [d - 0.12, D],
  ]
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, pts: V3[], want: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const r = dot(g, want) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < r.length - 1; i++) p.tri(r[0], r[i], r[i + 1])
}

function build() {
  const grey = new Part(), black = new Part(), deck = new Part(), dark = new Part()

  // ------------------------------------------------------------- hull
  const ys: number[] = [Y0, -46.5, -45.5, -44, -42, -40, -37, -34, -30, -26, -22, -18]
  for (let y = -14; y <= 14; y += 4) ys.push(y)
  ys.push(18, 22, 26, 30, 33, 36, 38.5, 40.5, 42.3, 43.8, 45, 45.8, Y1)
  const S = ys.map(section)
  const P = (y: number, [h, z]: XY, s: 1 | -1): V3 => [XC + s * h, y, z]
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1], a = S[i], b = S[i + 1]
    for (const s of [1, -1] as const) for (let k = 0; k < a.length - 1; k++) {
      const part = k < 3 ? black : grey
      const out: V3 = [s * (a[k + 1][1] - a[k][1] + 0.01), 0, Math.max(0, a[k][0] - a[k + 1][0])]
      face(part, [P(y0, a[k], s), P(y1, b[k], s), P(y1, b[k + 1], s), P(y0, a[k + 1], s)], out)
    }
    // The deck, split across so the long faces stay short.
    const e0 = a[a.length - 1], e1 = b[b.length - 1]
    face(deck, [P(y0, e0, -1), P(y1, e1, -1), P(y1, e1, 1), P(y0, e0, 1)], [0, 0, 1])
  }
  // Stern and stem end caps.
  for (const [i, n] of [[0, -1], [ys.length - 1, 1]] as [number, number][]) {
    const s = S[i], y = ys[i]
    const ring: V3[] = [...s.map((q) => P(y, q, 1)), ...[...s].reverse().map((q) => P(y, q, -1))]
    face(grey, ring, [0, n, 0])
  }

  // Flood holes along the casing: large and round-headed in the bow,
  // a long row of small slots aft of it.
  const casing = (y: number, t: number, s: 1 | -1, out = 0.05): V3 => {
    const q = section(y), [h0, z0] = q[3], [h1, z1] = q[4]
    return [XC + s * (h0 + (h1 - h0) * t + out), y, z0 + (z1 - z0) * t]
  }
  for (const s of [1, -1] as const) {
    for (let y = -36; y <= 29; y += 1.1) {
      if (Math.abs(y - 9) < 0.5) continue
      const a = casing(y - 0.3, 0.12, s), b = casing(y + 0.3, 0.12, s), c = casing(y + 0.3, 0.32, s), d = casing(y - 0.3, 0.32, s)
      face(dark, [a, b, c, d], [s, 0, 0])
    }
    for (let y = 30.5; y <= 38.5; y += 1.35) {
      const q = section(y), [h0, z0] = q[3], [h1, z1] = q[4]
      const zc = z0 + 0.15 + 0.35, r = 0.42
      const pts: V3[] = []
      for (let k = 0; k <= 8; k++) {
        const t = Math.PI * k / 8, dy = -r * Math.cos(t), dzz = r * Math.sin(t)
        const z = zc + dzz, tt = (z - z0) / (z1 - z0)
        pts.push([XC + s * (h0 + (h1 - h0) * tt + 0.05), y + dy, z])
      }
      const tt = (z0 + 0.15 - z0) / (z1 - z0), hh = h0 + (h1 - h0) * tt + 0.05
      pts.push([XC + s * hh, y + r, z0 + 0.15], [XC + s * hh, y - r, z0 + 0.15])
      face(dark, pts, [s, 0, 0])
    }
  }

  // ---------------------------------------------------------- helpers
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    walls(p, r, z0, z1)
    if (top) cap(top, r, z1)
  }
  /** A capped tube from A to B, n-sided. */
  const tube = (p: Part, A: V3, B: V3, r0: number, r1: number, n = 6) => {
    const d = sub(B, A), L = Math.hypot(...d), u: V3 = [d[0] / L, d[1] / L, d[2] / L]
    const a: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const c = cross(u, a), lc = Math.hypot(...c), e1: V3 = [c[0] / lc, c[1] / lc, c[2] / lc], e2 = cross(u, e1)
    const ring = (C: V3, r: number) => Array.from({ length: n }, (_, k) => {
      const t = (k / n) * 2 * Math.PI
      return [0, 1, 2].map((j) => C[j] + r * (Math.cos(t) * e1[j] + Math.sin(t) * e2[j])) as V3
    })
    const ra = ring(A, r0), rb = ring(B, r1)
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n
      face(p, [ra[k], ra[j], rb[j], rb[k]], sub(ra[k], A))
    }
    face(p, rb, u)
  }
  const ell = (hw: number, y0: number, y1: number, seg = 16): XY[] => Array.from({ length: seg }, (_, k) => {
    const t = (k / seg) * 2 * Math.PI, cy = (y0 + y1) / 2, ry = (y1 - y0) / 2
    // A superellipse: straight sides, round ends.
    const c = Math.cos(t), s = Math.sin(t)
    return [XC + hw * Math.sign(c) * Math.abs(c) ** 0.5, cy + ry * Math.sign(s) * Math.abs(s) ** 0.35] as XY
  })

  // --------------------------------------------------------- fairwater
  // The lower fairwater: gun platforms fore and aft at 5.1 m.
  const low = ell(1.8, 2.0, 15.5, 20)
  walls(grey, low, 2.9, 5.0, low.map(([x, y]) => [XC + (x - XC) * 0.92, y] as XY))
  const lowTop = low.map(([x, y]) => [XC + (x - XC) * 0.92, y] as XY)
  walls(grey, lowTop, 5.0, 5.15)
  cap(deck, lowTop, 5.15)
  // The bridge block between them, to 6.5 m, with its open bridge.
  const hi = ell(1.5, 5.4, 12.8, 16)
  walls(grey, hi, 5.15, 6.85, hi.map(([x, y]) => [XC + (x - XC) * 0.95, y] as XY))
  const hiTop = hi.map(([x, y]) => [XC + (x - XC) * 0.95, y] as XY)
  cap(grey, hiTop, 6.85)
  // Bridge windscreen/cowl at the forward end and the bridge's shadowed
  // openings along both sides.
  for (const s of [1, -1]) face(dark, [[XC + s * 1.53, 11.0, 5.7], [XC + s * 1.53, 12.0, 5.7], [XC + s * 1.5, 12.0, 6.5], [XC + s * 1.5, 11.0, 6.5]], [s, 0, 0])
  // Periscope shears: two stout legs, the platform, two periscopes.
  for (const [y0, y1] of [[6.6, 7.3], [9.6, 10.3]]) box(grey, XC - 0.9, XC - 0.1, y0, y1, 6.85, 10.8)
  box(grey, XC - 1.1, XC + 0.1, 6.4, 10.5, 10.8, 11.15)
  tube(grey, [XC - 0.6, 9.9, 11.15], [XC - 0.6, 9.9, 12.8], 0.2, 0.17, 6)
  tube(grey, [XC - 0.4, 8.6, 11.15], [XC - 0.4, 8.6, 12.2], 0.18, 0.15, 6)
  // SJ radar mast aft of the shears, with its dish.
  tube(grey, [XC - 0.5, 5.6, 5.15], [XC - 0.5, 5.6, 10.9], 0.34, 0.15, 8)
  box(grey, XC - 1.1, XC + 0.1, 5.4, 5.8, 10.7, 11.3)

  // ----------------------------------------------------------- guns
  // 5"/25 wet-mount deck gun aft of the fairwater, trained to starboard.
  const gy = -5.0, gd = dz(gy)
  lathe(grey, XC, gy, [[0.75, gd - 0.05], [0.75, gd + 0.35], [0.45, gd + 0.4], [0.45, gd + 0.9], [0, gd + 0.9]], 10)
  box(grey, XC - 0.5, XC + 0.6, gy - 0.6, gy + 0.6, gd + 0.9, gd + 1.6)
  {
    const t = (65 * Math.PI) / 180, A: V3 = [XC + 0.5 * Math.sin(t), gy + 0.5 * Math.cos(t), gd + 1.3]
    tube(black, A, [A[0] + 3.1 * Math.sin(t), A[1] + 3.1 * Math.cos(t), gd + 1.55], 0.2, 0.16, 6)
  }
  // Light guns on the fairwater platforms: forward trained forward, aft aft.
  for (const [yc, dir] of [[14.2, 1], [3.2, -1]] as [number, number][]) {
    lathe(grey, XC, yc, [[0.35, 5.1], [0.35, 5.7], [0, 5.7]], 8)
    box(grey, XC - 0.45, XC + 0.45, yc - 0.5, yc + 0.5, 5.7, 6.3)
    tube(black, [XC, yc + dir * 0.4, 6.05], [XC + 0.3, yc + dir * 2.4, 6.35], 0.12, 0.1, 5)
  }
  // The low hatch casing on the foredeck (lidar).
  box(grey, XC - 0.9, XC + 0.9, 25.2, 27.8, dz(25) - 0.05, dz(27) + 1.1, grey)

  return [
    { part: grey, material: finish('cod-grey', 0x9ea4a9) },
    { part: black, material: finish('cod-black', 0x4a4f57) },
    { part: deck, material: finish('cod-deck', 0x5d5b57) },
    { part: dark, material: finish('cod-shadow', 0x50555c) },
  ]
}

if (import.meta.main) await save('cle-uss-cod', 'USS Cod', [41.5100737, -81.6916281], 204.6, build(), 6500)
