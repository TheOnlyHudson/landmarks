/**
 * Japan National Stadium (国立競技場), Kasumigaoka, Shinjuku, Tokyo
 * (Kengo Kuma with Taisei and Azusa Sekkei, 2019): procedural, CC0-1.0.
 * bun generators/tokyo-national-stadium.ts
 *
 * Writes models/tokyo-national-stadium.glb (low) and .detail.glb (zoom 16:
 * every eave's vertical timber louvres and the louvred soffit as real slats,
 * white columns on every level, eave soffits, tier fronts, and radial roof
 * trusses under the opening's rim).
 *
 * Identity, in order: the low white roof ring with its oval opening and the
 * field of glass panels on its south-west; the stack of timber eaves, each
 * stepping out beyond the one above, planted along their edges; the white
 * struts leaning out under the louvred soffit of the roof; the three tiers
 * of stands seen through the opening.
 *
 * Frame: x east, y north, z up (bearing 0), origin at the area centroid of
 * OSM relation/10071391 (139.7145577, 35.6778206). y = 0 is the field.
 *
 * OSM (replaced): relation/10071391 "MUFGスタジアム" (official name 国立競技場;
 * building=stadium, height 50.5), outer way/727740261 (taken as the reach of
 * the lowest eaves: area 69,207 m², against the published building area
 * 69,611 m²) and inner way/727740260 (the roof's opening, 178 x 108 m, long
 * axis at bearing 21°). Both rings are smoothed to a few Fourier harmonics
 * (the outer's gate notches bridged first): the real eaves are one smooth
 * oval.
 *
 * Published (ja.wikipedia 国立競技場): maximum height 47.35 m and eaves 41.46 m
 * above the design ground TP+25.9 m; building area 69,611 m²; stands roughly
 * 350 x 260 m; three tiers of stands (20°, 29°, 34°); three-tier eaves after
 * the five-storey pagoda of Hōryū-ji; cedar and larch from all 47
 * prefectures; a steel-and-timber roof cantilevered from the back of the
 * stands; field at the second basement level.
 *
 * Elevation 0: the field is y = 0. It lies ~3.1 m below the design ground
 * (OSM's 50.5 m height tag less the published 47.35 m; Mapterhorn's filled
 * ground under the bowl reads ~TP 22.8 m), so every published height is
 * raised by 3.1 m. Terrain check: ok (the east side's ground is ~10 m higher
 * and its lowest eave sinks into it, as on the real site).
 *
 * Estimated from photos: four timber bands (the ground-storey canopy and
 * the three planted eaves) ~3.6 m deep at ~7.3 m centres from 8 m; their
 * outer edges at 0, -1, -3.5 and -6.5 m from the outline, the walls ~5.5 m
 * behind each; the louvred soffit rising from ~37 m, 16 m in, to the roof's
 * edge 6 m in; the roof's crown ~42% of the way out from the opening, the
 * opening's rim ~46.6 m; the glass panels over bearings ~170-275°, inner
 * half to two-thirds of the roof (Müseler's aerial); 48 struts, 28 columns a
 * level in the low model (96 in the detail model; the real spacing is
 * closer); the stands as three raked bands from the opening's edge back to
 * the outer walls.
 *
 * Colours (daylight photos): roof white (#eeeeea), glass panels pale blue-
 * grey (#b4c7d2), timber louvres warm brown-grey (#8a7a6c: sampled #544943-#5f514a
 * in the shade of Akonnchiroll's east-gate photo and #918883 in sun in
 * Müseler's aerial, pulled toward the palette's lightness); the recesses
 * between the eaves dark charcoal (#4a4f57; sampled #2e2e34, pulled up to
 * the palette's darkest), planting muted green, the
 * stands' mottled earth-tone seats as one grey-brown (#8e8a80).
 * Night: the walls behind the eaves glow (window); the timber louvres carry
 * a floodlight wash, as they are lit at night; the roof glass stays dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - New national stadium tokyo 1.jpg, Arne Müseler, CC BY-SA 3.0 de (aerial, SE)
 *  - Olympic Stadium Tokyo aerial 2020 (cropped).jpg, Arne Müseler, CC BY-SA 3.0 de
 *  - The Japan National Stadium.jpg, Akonnchiroll, CC BY 4.0 (east gate, ground)
 *  - Japan National Stadium 2024 1.jpg and 2024 3.jpg, Akonnchiroll, CC BY 4.0 (inside)
 *  - 国立競技場の外観 Exterior of the Japan National Stadium 09.jpg, 11.jpg and
 *    23.jpg, RuinDig/Yuki Uchida, CC BY 4.0 (street views, eaves, gate G)
 * No look-only sources used.
 *
 * Doubts: the field's depth (3.1 m) rests on OSM's height tag and the DEM,
 * not a section; each eave's projection and the soffit's slope are read from
 * perspective photos; the roof's crown height and place are estimated; gates,
 * stairs and the bridges to the plaza are left out.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { member, unit, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

const TAU = Math.PI * 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

// OSM relation/10071391 (outer way/727740261, inner way/727740260), in metres
// about the area centroid 139.7145577, 35.6778206 (x east, y north).
const OUTER: XY[] = [[-32.8, 150.2], [-44.3, 143.2], [-56.8, 134.9], [-68.2, 125.3], [-79.6, 113.7], [-90.1, 99.9], [-99.6, 86.1], [-108.1, 69.5], [-115.3, 53.0], [-123.3, 32.4], [-130.3, 11.2], [-133.5, -3.1], [-135.5, -18.3], [-136.6, -32.6], [-136.1, -45.6], [-134.2, -57.6], [-131.6, -69.4], [-128.5, -81.8], [-124.2, -92.5], [-118.7, -104.6], [-111.9, -113.4], [-102.2, -123.4], [-95.5, -130.4], [-100.5, -136.5], [-99.3, -137.7], [-100.5, -139.2], [-90.1, -146.5], [-93.4, -149.7], [-80.3, -157.6], [-65.7, -164.0], [-53.1, -168.6], [-37.9, -172.4], [-37.3, -168.3], [-25.2, -169.5], [-25.1, -167.4], [-23.1, -167.1], [-22.7, -159.6], [-9.6, -159.5], [3.2, -158.6], [13.8, -156.6], [27.0, -151.4], [34.2, -147.7], [39.0, -145.0], [48.3, -139.0], [55.4, -133.6], [64.5, -126.3], [73.1, -118.3], [80.5, -110.1], [87.2, -101.9], [93.9, -92.0], [101.1, -80.0], [104.9, -72.6], [107.1, -73.7], [107.6, -72.6], [109.6, -73.4], [114.3, -61.9], [117.7, -63.1], [123.9, -48.8], [128.5, -35.9], [125.4, -34.9], [129.8, -23.4], [127.8, -22.8], [128.4, -21.4], [125.7, -20.6], [130.4, -3.7], [132.6, 9.4], [134.0, 22.9], [134.4, 36.2], [133.5, 50.0], [131.6, 63.5], [128.8, 75.7], [125.2, 88.0], [119.2, 100.3], [113.1, 110.2], [105.3, 119.8], [93.9, 131.1], [98.8, 137.1], [97.1, 138.2], [98.7, 139.9], [89.1, 147.4], [91.1, 150.6], [77.6, 158.8], [65.5, 164.1], [50.7, 169.5], [36.3, 172.4], [35.9, 168.7], [23.4, 170.1], [23.4, 168.2], [21.3, 168.3], [20.9, 160.6], [3.3, 160.4], [-16.6, 157.1]]
const INNER: XY[] = [[-5.1, 83.7], [-11.0, 81.2], [-17.1, 77.2], [-23.2, 71.9], [-27.3, 67.3], [-31.7, 60.8], [-37.5, 50.4], [-45.1, 34.5], [-51.9, 18.5], [-58.7, -0.8], [-62.8, -14.1], [-65.2, -24.4], [-65.9, -30.8], [-66.1, -37.5], [-65.5, -42.7], [-64.7, -47.1], [-63.2, -52.6], [-61.3, -57.3], [-58.4, -62.1], [-55.4, -66.2], [-53.1, -69.5], [-49.8, -72.6], [-46.0, -75.6], [-42.1, -78.1], [-37.2, -81.1], [-32.2, -82.9], [-28.1, -84.4], [-23.1, -85.4], [-15.6, -86.0], [-9.6, -85.7], [-4.5, -85.1], [-1.0, -84.3], [2.7, -83.1], [6.8, -81.6], [10.0, -79.9], [14.1, -77.5], [18.2, -74.5], [20.9, -72.1], [25.0, -68.0], [29.2, -61.9], [33.4, -54.6], [38.9, -43.4], [49.7, -19.1], [56.4, -0.8], [60.1, 11.7], [62.8, 22.1], [63.9, 28.5], [64.5, 35.8], [64.0, 41.8], [62.9, 47.4], [61.7, 52.3], [59.1, 57.8], [55.5, 64.1], [52.1, 68.2], [49.1, 71.4], [45.5, 75.0], [40.7, 78.9], [36.3, 81.2], [31.7, 83.1], [26.8, 85.0], [20.7, 86.3], [13.4, 87.0], [7.6, 86.7], [1.1, 85.5]]

/** Distance from the origin to a ring along the direction at angle a. */
function rayHit(ring: XY[], a: number): number {
  const d: XY = [Math.cos(a), Math.sin(a)]
  let best = Infinity
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length]
    const ex = q[0] - p[0], ey = q[1] - p[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (p[0] * ey - p[1] * ex) / den, u = (p[0] * d[1] - p[1] * d[0]) / den
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, t)
  }
  return best
}
/**
 * Radii by angle, smoothed by keeping the first `h` Fourier harmonics: the
 * real eaves are one smooth oval, and OSM's outline zig-zags round the gates.
 * The outer ring's gate notches are first bridged with a running maximum.
 */
function radii(ring: XY[], h: number, bridge: boolean): (t: number) => number {
  const fine = 720, r0 = Array.from({ length: fine }, (_, i) => rayHit(ring, (i / fine) * TAU))
  const r = bridge ? r0.map((_, i) => Math.max(...Array.from({ length: 9 }, (_, k) => r0[(i + k - 4 + fine) % fine]))) : r0
  const A: number[] = [], B: number[] = []
  for (let k = 0; k <= h; k++) {
    let a = 0, b = 0
    for (let i = 0; i < fine; i++) { const t = (i / fine) * TAU; a += r[i] * Math.cos(k * t); b += r[i] * Math.sin(k * t) }
    A.push((a * (k ? 2 : 1)) / fine); B.push((b * 2) / fine)
  }
  return (t: number) => {
    let v = 0
    for (let k = 0; k <= h; k++) v += A[k] * Math.cos(k * t) + (k ? B[k] * Math.sin(k * t) : 0)
    return v
  }
}

type Opt = { detail: boolean }
const RO_AT = radii(OUTER, 6, true), RI_AT = radii(INNER, 8, false)

// Heights above y = 0, the field. Published heights (47.35 m overall, 41.46 m to the
// eaves) are from the design ground, TP+25.9 m; the field lies ~3.1 m below it (OSM's
// 50.5 m height tag less the published 47.35 m; Mapterhorn's filled ground under the
// bowl is at ~TP 22.8 m). The west plaza is near field level, the east ~10 m higher.
const BASE = 3.1
const H = {
  top: BASE + 47.35, // published, the roof's crown
  eave: BASE + 41.46, // published, the roof's outer edge
  inner: BASE + 43.5, // estimated: the roof's inner edge, a little below its crown (photos inside)
  crownAt: 0.42, // estimated: the crown's place across the roof, from the inner edge
  skirtBot: BASE + 34.0, // estimated: the foot of the louvred soffit sloping out to the roof's edge (photos)
  // the three eaves (with planting) and the ground-storey canopy: [bottom, top] (photos)
  eaves: ([[5.0, 8.6], [12.2, 15.8], [19.6, 23.2], [27.0, 30.6]] as [number, number][]).map(([a, b]) => [a + BASE, b + BASE] as [number, number]),
}

function build(o: Opt): Layer[] {
  const timber = new Part(), white = new Part(), green = new Part(), win = new Part(), seats = new Part(), glass = new Part()
  const N = o.detail ? 128 : 56
  const angle = (i: number) => (i / N) * TAU
  const RO = Array.from({ length: N }, (_, i) => RO_AT(angle(i)))
  const RI = Array.from({ length: N }, (_, i) => RI_AT(angle(i)))
  const dir = (i: number): XY => [Math.cos(angle(i)), Math.sin(angle(i))]
  const at = (i: number, r: number, z: number): V3 => { const d = dir(i % N); return [d[0] * r, d[1] * r, z] }
  /** A ring band: for each i, a point at radius f(i) and height z; quads between two such rings. */
  type Face = 'out' | 'in' | 'up' | 'down'
  const nz = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  /** Quads between two rings, smooth-shaded round the ring, facing `face`; `pick` may choose the part per quad. */
  const band = (p: Part, r0: (i: number) => number, z0: number, r1: (i: number) => number, z1: number, face: Face, pick?: (i: number) => Part) => {
    const Q: V3[][] = [], F: V3[] = []
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const a = at(i, r0(i), z0), b = at(i + 1, r0(j), z0), c = at(i + 1, r1(j), z1), d = at(i, r1(i), z1)
      let n = nz(cross(sub(b, a), sub(d, a)))
      const m: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], ml = Math.hypot(m[0], m[1])
      const radial = (n[0] * m[0] + n[1] * m[1]) / ml
      const v = face === 'out' ? radial : face === 'in' ? -radial : face === 'up' ? n[2] : -n[2]
      if (v < 0) n = [-n[0], -n[1], -n[2]]
      Q.push([a, b, c, d]); F.push(n)
    }
    for (let i = 0; i < N; i++) {
      const nl = nz(add(F[(i + N - 1) % N], F[i])), nr = nz(add(F[i], F[(i + 1) % N]))
      const [a, b, c, d] = Q[i], tp = pick ? pick(i) : p
      tp.tri(a, b, c, undefined, undefined, undefined, [nl, nr, nr])
      tp.tri(a, c, d, undefined, undefined, undefined, [nl, nr, nl])
    }
  }
  const Ro = (dr: number) => (i: number) => RO[i % N] + dr
  // Each eave steps out beyond the one above it (photos: the ground-storey canopy and the
  // first eave reach the OSM outline, the third ~6.5 m inside it, the roof's edge ~6 m).
  const OUT = [0, -1.0, -3.5, -6.5]
  const fac = (k: number) => Ro(OUT[k] - 5.5)
  const roofEdge = Ro(-6.0), skirtFoot = Ro(-16)

  // ---- the eaves: layered timber bands with a planted top -----------------------------
  H.eaves.forEach(([z0, z1], k) => {
    const out = OUT[k], facade = fac(k)
    const fasc = Ro(out), back = Ro(out - 0.7)
    // layered fascia: the lower louvre band at the eave's edge, the upper set back behind it
    const zm = lerp(z0, z1, 0.55)
    band(timber, fasc, z0, fasc, zm, 'out')
    band(timber, fasc, zm, back, zm, 'up') // the step between the layers
    band(timber, back, zm, back, z1, 'out')
    // soffit under the eave, back to the facade
    if (o.detail) band(timber, facade, z0, fasc, z0, 'down')
    // the planting along the edge, then the walkway deck back to the wall above
    band(green, back, z1, back, z1 + 0.9, 'out')
    band(green, back, z1 + 0.9, Ro(out - 2.6), z1 + 0.9, 'up')
    band(white, Ro(out - 2.6), z1, k < 3 ? fac(k + 1) : skirtFoot, z1, 'up')
  })
  // glazed / recessed walls between the eaves
  band(win, fac(0), 0, fac(0), H.eaves[0][0], 'out')
  for (let k = 1; k < 4; k++) band(win, fac(k), H.eaves[k - 1][1], fac(k), H.eaves[k][0], 'out')
  band(win, skirtFoot, H.eaves[3][1], skirtFoot, H.skirtBot, 'out')

  // ---- the roof: louvred skirt, white top, glass panels to the south-west -------------
  band(timber, skirtFoot, H.skirtBot, roofEdge, H.eave - 0.6, 'out')
  band(white, roofEdge, H.eave - 0.6, roofEdge, H.eave, 'out') // thin white fascia
  const ROWS = o.detail ? 10 : 5
  const roofZ = (s: number) => {
    // s = 0 at the inner edge, 1 at the outer
    if (s <= H.crownAt) return lerp(H.inner, H.top, Math.sin((s / H.crownAt) * Math.PI / 2))
    const t = (s - H.crownAt) / (1 - H.crownAt)
    return lerp(H.top, H.eave, t * t)
  }
  const isGlass = (i: number, s: number) => {
    const brg = (90 - (angle(i) * 180) / Math.PI + 360) % 360 // compass bearing of this spoke
    // a jagged field of glass panels over the south-west roof (aerial photo)
    const step = Math.floor((brg - 170) / 15)
    const lim = [0.5, 0.62, 0.7, 0.66, 0.6, 0.55, 0.45][step] ?? -1
    return brg >= 170 && brg < 275 && s < lim
  }
  for (let r = 0; r < ROWS; r++) {
    const s0 = r / ROWS, s1 = (r + 1) / ROWS
    const R = (s: number) => (k: number) => lerp(RI[k % N], roofEdge(k), s)
    band(white, R(s0), roofZ(s0), R(s1), roofZ(s1), 'up', (i) => (isGlass(i, (s0 + s1) / 2) ? glass : white))
  }
  // the roof's inner edge: a white ring beam, and its underside lip
  band(white, (i) => RI[i % N], H.inner - 2.2, (i) => RI[i % N], H.inner, 'in')
  // ---- the bowl: three tiers of stands, seen through the opening -----------------------
  const field = (i: number) => RI[i % N] * 1.04
  const tiers: [number, number, number, number][] = [
    // [r from (share of the way from the field to the back), z0, share to, z1]
    [0.0, 1.5, 0.36, 13.5],
    [0.36, 16.0, 0.62, 26.5],
    [0.62, 29.0, 1.0, 40.5],
  ]
  const backR = Ro(-16)
  const rr = (i: number, s: number) => lerp(field(i), backR(i), s)
  for (const [s0, z0, s1, z1] of tiers) {
    band(seats, (i) => rr(i, s0), z0, (i) => rr(i, s1), z1, 'up')
    band(s0 === 0 ? white : win, (i) => rr(i, s0), s0 === 0 ? 0 : z0 - 2.0, (i) => rr(i, s0), z0, 'in')
  }

  // ---- white struts under the roof's skirt, and columns between the eaves ------------
  const NS = o.detail ? 96 : 48
  for (let k = 0; k < NS; k++) {
    const i = Math.round((k / NS) * N) % N
    const f = (k / NS) * N - Math.floor((k / NS) * N)
    const ang = ((k + 0.5) / NS) * TAU
    const d: XY = [Math.cos(ang), Math.sin(ang)]
    void i; void f
    const ro = RO_AT(ang)
    const R = (dr: number) => ro + dr
    // leaning out: from the top of the third eave's deck up to the skirt
    const foot: V3 = [d[0] * R(-11.5), d[1] * R(-11.5), H.eaves[3][1] + 0.1]
    const head: V3 = [d[0] * R(-8.5), d[1] * R(-8.5), lerp(H.skirtBot, H.eave - 0.6, 0.75) - 0.3]
    member(white, foot, head, o.detail ? 0.42 : 0.55, o.detail ? 6 : 4)
  }
  const NC = o.detail ? 96 : 28
  for (let k = 0; k < NC; k++) {
    const ang = ((k + 0.25) / NC) * TAU, d: XY = [Math.cos(ang), Math.sin(ang)], ro = RO_AT(ang)
    for (let e = 0; e < 4; e++) {
      const z0 = e === 0 ? 0 : H.eaves[e - 1][1], z1 = H.eaves[e][0], r = ro + OUT[e] - 4.6
      member(white, [d[0] * r, d[1] * r, z0], [d[0] * r, d[1] * r, z1], o.detail ? 0.5 : 0.65, o.detail ? 6 : 3)
    }
  }

  // ---- detail: vertical timber louvres on every eave and on the skirt ---------------
  if (o.detail) {
    const slat = (r0: number, z0: number, r1: number, z1: number, ang: number) => {
      const d: XY = [Math.cos(ang), Math.sin(ang)]
      member(timber, [d[0] * (r0 + 0.2), d[1] * (r0 + 0.2), z0], [d[0] * (r1 + 0.2), d[1] * (r1 + 0.2), z1], 0.24, 4, [d[0], d[1], 0], Math.PI / 4)
    }
    const NL = 440
    for (let k = 0; k < NL; k++) {
      const ang = (k / NL) * TAU, ro = RO_AT(ang)
      H.eaves.forEach(([z0, z1], e) => {
        const out = OUT[e]
        slat(ro + out, z0 - 0.15, ro + out, z1 - 0.1, ang)
      })
      if (k % 2 === 0) slat(ro - 16, H.skirtBot, ro - 6.0, H.eave - 0.6, ang)
    }
    // radial roof trusses seen through the opening's rim: a few bold members on the underside
    const NT = 64
    for (let k = 0; k < NT; k++) {
      const ang = (k / NT) * TAU, ri = RI_AT(ang), ro = RO_AT(ang)
      const d: XY = [Math.cos(ang), Math.sin(ang)]
      member(timber, [d[0] * ri, d[1] * ri, H.inner - 2.4], [d[0] * (ri + (ro - 11 - ri) * 0.6), d[1] * (ri + (ro - 11 - ri) * 0.6), H.top - 3.2], 0.45, 4)
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.8)
  return [
    { part: timber, material: { ...finish('stadium-timber', 0x8a7a6c), floodlight: lit } },
    { part: white, material: finish('stadium-white', 0xeeeeea) },
    { part: green, material: finish('stadium-planting', 0x8a9d72) },
    { part: win, material: { ...PALETTE.window, color: 0x4a4f57 } }, // the shaded recesses behind the eaves (window: lit at night)
    { part: seats, material: finish('stadium-seats', 0xa29f94) },
    { part: glass, material: { ...PALETTE.glass, color: 0xb4c7d2 } },
  ]
}

const meta = { bearing: 0, elevation: 0, height: H.top }
if (import.meta.main) {
  await writeModel('tokyo-national-stadium', 'tokyo-national-stadium.glb', 'Japan National Stadium', build({ detail: false }), meta, 6500, 250_000)
  await writeModel('tokyo-national-stadium', 'tokyo-national-stadium.detail.glb', 'Japan National Stadium', build({ detail: true }), meta, 40_000, 1536 * 1024)
}
