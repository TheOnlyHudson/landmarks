/**
 * Darrell K Royal–Texas Memorial Stadium (1924; west upper deck 1971, east
 * upper deck 1998, north end zone 2008, south end zone 2021), University of
 * Texas at Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-dkr-texas-memorial-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 5.05 (the field's long
 * axis, from the OSM pitch way/187012995), so +y is up the field toward the
 * north end zone. The anchor is the centre of the pitch, -97.732545,
 * 30.283665. z = 0 is the field, and every outer wall runs down to it:
 * the map drapes the model's base on the terrain, so the walls' feet land
 * on the streets round the bowl (Mapterhorn and the lidar ground: San
 * Jacinto Boulevard on the west is 4-5 m below the field, the north street
 * 3 m above it, Robert Dedman Drive on the east 12-20 m above it) and the
 * field wall on the field (checked with tools/terrain.ts: drawn within 1 m
 * of the field's real height). Elevation 0.
 *
 * A bowl that closes all round: the lower bowl rings the field; tall upper
 * decks stand on the west (1971, over Bellmont Hall) and east (1998); the
 * north end zone (2008) carries an upper deck too, wrapping the east and
 * north as one horseshoe; the south end zone (2021) is lower, its upper
 * seats under a white canopy, the video board set in its face, a burnt-orange
 * band round its back. Every stand is one swept section round the field
 * wall (a rounded rectangle), blended from side to side: stepped treads in
 * aluminium grey with grey riser lips (five per tier), the glass suite face
 * and the dark ribbon-board fascia between the decks, the parapet, the back roof
 * and the outer wall.
 *
 * Heights, z above the field (lidar, read in this frame):
 *   West: lower bowl from the field wall (x -33.5) to 16 m at x -79; the
 *     suite face to 28.3 m; the upper deck to its rim, 51 m at x -114; the
 *     light frame over the rim, columns and a beam topping out at 67.7 m;
 *     the back roof at 36 m out to Bellmont Hall's west wall (x -124). The
 *     deck is a crescent in plan (OSM way/126030906 and the lidar): its
 *     front and back bow out by 11-13 m at the middle.
 *   East: lower bowl to 19.5 m at x 84; face to 31.3 m; upper deck to its
 *     rim, 43.7 m at x 107; back roof 34 m to x 118; a suite block to 41 m
 *     (x 110-117, y 12-52). (The lidar also has four 8 m wide objects at
 *     66.7 m on the east rim; no photo shows light standards there, so
 *     they are left out: the stadium's lights are on the west frame.)
 *   North: lower bowl to 20.6 m at y 106; face to 31.7 m; upper deck to its
 *     rim, 43.7 m at y 128; the Red McCombs Red Zone behind at 34 m to
 *     y 143, with two square entrance towers at 41 m and round brick towers
 *     with glass drums at 37-40 m (also at the NE, NW and SE corners).
 *     The north-west corner between the west and north upper decks is a
 *     lower block, 33 m.
 * South end zone (2021): the lidar (2017) is older than it, so these are
 * estimates from NAIP (plan: lower seats to y -78, the canopy's curved
 * front edge at y -86 to -98, the building back at y -116, as OSM
 * way/1419045023 also draws it) and ajay_suresh's 2025 photo from the
 * south-west (a round brick tower with a glass drum at each corner, the
 * brick back wall with four floors of windows, a burnt-orange band over
 * it): lower bowl to 8 m, upper seats 11-21 m, the building's field face
 * and canopy to 32 m, the orange band falling from 32 m to 22 m over the
 * brick, the corner towers 40 m.
 * The video board: Godzillatron (2006, 134 x 55 ft, Wikipedia) stood at
 * y -105, x -22 to 22, top 40 m in the 2017 lidar; its 2021 replacement on
 * the new south end zone is drawn set into the building's field face under the
 * canopy, 39 x 10 m, 21-31.5 m: estimated (no board shows above the roof in
 * the 2025 photo from the south-west).
 *
 * Evidence
 * - OSM: stadium way/128637559; pitch way/187012995; Bellmont Hall
 *   way/126030906; Red McCombs Red Zone way/126030913; the east concourse
 *   building way/1419045025; South End Zone way/1419045023; corner
 *   buildings way/1419901606, way/1419901607.
 * - Lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019 (2017 flight), 1 m
 *   grid: every height above except the south end zone (built 2019-21,
 *   after the flight). The west, east and north stands are unchanged since
 *   2008 (Wikipedia's list of works).
 * - NAIP (USGS, after 2021): plan of the south end zone, canopy, towers.
 * - Mapterhorn terrain: the ground round the bowl.
 * - Published (Wikipedia, "Darrell K Royal–Texas Memorial Stadium"):
 *   dates of each deck; capacity 100,119; Godzillatron's size; the field
 *   lowered 7 ft in 1999.
 * - Photos (Wikimedia Commons):
 *   ajay_suresh, "Darrell K Royal–Texas Memorial Stadium - Texas Longhorns
 *     (54983869867).jpg", CC BY 4.0, 2025 (south-west corner: tower, south
 *     end zone, the orange band, the west deck's underside);
 *   Counse, "University of Texas, UT Austin Campus (17116648812).jpg",
 *     CC BY 2.0, 2015 (west upper deck and its light frame from the
 *     south-west; the north end's brick towers);
 *   Brint03, "Darrell K Royal-Texas Memorial Stadium at Night.jpg",
 *     CC BY-SA 3.0, 2011 (the bowl from the north-east, west deck lit);
 *   Randall Chancellor, "Darrell K Royal-Texas Memorial Stadium in
 *     2010.jpg", CC BY-SA 2.0 (the bowl from the east stands);
 *   Johntex, "DKR new north end 2008-08-30.JPG", CC BY-SA 3.0 (north end
 *     brick and glass);
 *   Robert Barlow, "Darrell K Royal – Texas Memorial Stadium, Austin, TX -
 *     panoramio.jpg", CC BY 3.0 (grey bleachers, orange field wall).
 * Estimated: the whole south end zone (above); the board; the corner
 *   blends; the window bands on the brick walls.
 * Left out: lettering, logos, ribbon boards, railings, stairs, the field
 *   (the map draws it).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cylinder, prism, quad, type XY } from './dc-nationals-park'

const seats = new Part(), stone = new Part(), brick = new Part(), orange = new Part(), glass = new Part(), roof = new Part()

const FL = 0 // the field: the map drapes the base on the terrain (see the header)

// The field wall: a rounded rectangle (lidar), corner radius R.
const X0 = -33.5, X1 = 35, Y0 = -60, Y1 = 57, R = 14
const CXL = X0 + R, CXR = X1 - R, CYB = Y0 + R, CYT = Y1 - R

// ---------------------------------------------------------------------------
// Stand sections. Distances d outward from the field wall, z above the field.

type Prof = {
  lw: number; zl: number // lower bowl: depth, top
  zf: number // the upper deck's front (top of the suite face)
  uw: number; zu: number // upper deck: depth, rim
  zb: number // the back roof
  dt: number // where the back roof ends (the south's orange band starts)
  zb2: number // the back wall's top
  D: number // the outer wall
  rise: Part; back: Part; slope: Part
}
type Pt = [number, number, Part | null]

/** A seat rake in n treads, each ending in a grey riser lip. */
function rake(d0: number, z0: number, d1: number, z1: number, n: number, end: Part, lip = 0.8): Pt[] {
  const out: Pt[] = []
  for (let i = 1; i <= n; i++) {
    const d = d0 + ((d1 - d0) * i) / n, z = z0 + ((z1 - z0) * i) / n
    out.push([d, z - lip, roof], [d, z, i === n ? end : seats])
  }
  return out
}

function section(p: Prof): Pt[] {
  const f = p.lw + 2, rd = f + p.uw
  return [
    [0, 0, orange], // the field wall
    [0, 1.5, seats],
    ...rake(0, 1.5, p.lw, p.zl, 5, roof), // lower bowl; then the concourse
    [f, p.zl, glass], // suites, press and club glass
    [f, p.zf - 2.5, glass], // the upper deck's fascia: dark ribbon boards
    [f, p.zf, seats],
    ...rake(f, p.zf, rd, p.zu, 5, stone), // upper deck; then the parapet
    [rd, p.zu + 1.2, stone],
    [rd + 1, p.zu + 1.2, p.rise], // down the back of the rim, or up the south's club glass
    [rd + 1, p.zb, roof],
    [p.dt, p.zb, p.slope],
    [p.D, p.zb2, p.back],
    [p.D, -FL, null],
  ]
}

const E: Prof = { lw: 49, zl: 19.5, zf: 31.3, uw: 21, zu: 43.7, zb: 34, dt: 83, zb2: 34, D: 83, rise: stone, back: stone, slope: roof }
const N: Prof = { lw: 49, zl: 20.6, zf: 31.7, uw: 20, zu: 43.7, zb: 34, dt: 86, zb2: 34, D: 86, rise: brick, back: brick, slope: roof }
const NWC: Prof = { lw: 49, zl: 20, zf: 28, uw: 12, zu: 33, zb: 33, dt: 86, zb2: 33, D: 86, rise: brick, back: brick, slope: roof }
const S: Prof = { lw: 18, zl: 8, zf: 11, uw: 16, zu: 21, zb: 32, dt: 47, zb2: 22, D: 56, rise: stone, back: brick, slope: orange }
/** The west deck, a crescent in plan: it bows out at the middle. */
function W(y: number): Prof {
  const k = Math.min(1, (y / 84) ** 2)
  const dF = 45.5 - 11 * Math.min(1, (y / 70) ** 2), dR = 80.5 - 12 * k, D = 90.5 - 13 * k
  return { lw: dF - 2, zl: 16, zf: 28.3, uw: dR - dF, zu: 51, zb: 36, dt: D, zb2: 36, D, rise: roof, back: roof, slope: roof }
}
const mix = (a: Prof, b: Prof, t: number): Prof => {
  const o: any = {}
  for (const k of Object.keys(a) as (keyof Prof)[]) o[k] = typeof a[k] === 'number' ? (a[k] as number) * (1 - t) + (b[k] as number) * t : (t < 0.5 ? a[k] : b[k])
  return o
}
const ramp = (x: number, a: number, b: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

/**
 * The section at a point of the field wall, by the outward normal's angle
 * phi (degrees counter-clockwise from east). The west deck ends on radial
 * cuts at phi 153 and 205, where the lidar and OSM end it.
 */
function profileAt(phi: number, y: number): Prof {
  if (phi < 90) return mix(E, N, ramp(phi, 20, 70))
  if (phi < 180) {
    if (phi < 150) return mix(N, NWC, ramp(phi, 100, 135))
    return mix(NWC, W(78), ramp(phi, 151, 155))
  }
  if (phi === 180) return W(y)
  if (phi < 270) {
    if (phi < 220) return mix(W(-78), S, ramp(phi, 203, 208))
    return S
  }
  return mix(S, E, ramp(phi, 302, 326))
}

// The field wall's path, counter-clockwise from the middle of the south end,
// with extra stations where the sections change quickly.
type Station = { p: XY; n: XY; phi: number }
const stations: Station[] = []
const at = (c: XY, phi: number): Station => {
  const a = (phi * Math.PI) / 180, n: XY = [Math.cos(a), Math.sin(a)]
  return { p: [c[0] + R * n[0], c[1] + R * n[1]], n, phi: phi % 360 }
}
const corner = (c: XY, a0: number, extra: number[] = []) => {
  const angles = new Set<number>(extra)
  for (let a = a0 + 15; a < a0 + 90; a += 15) angles.add(a)
  for (const a of [...angles].sort((u, v) => u - v)) stations.push(at(c, a))
}
const straight = (a: XY, b: XY, n: XY, phi: number, step: number) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / step))
  for (let i = 0; i <= k; i++) stations.push({ p: [a[0] + ((b[0] - a[0]) * i) / k, a[1] + ((b[1] - a[1]) * i) / k], n, phi })
}
const MIDX = (X0 + X1) / 2
straight([MIDX, Y0], [CXR, Y0], [0, -1], 270, 12)
corner([CXR, CYB], 270, [302, 314, 326])
straight([X1, CYB], [X1, CYT], [1, 0], 0, 15)
corner([CXR, CYT], 0)
straight([CXR, Y1], [CXL, Y1], [0, 1], 90, 12)
corner([CXL, CYT], 90, [151, 155])
straight([X0, CYT], [X0, CYB], [-1, 0], 180, 12)
corner([CXL, CYB], 180, [203, 208])
straight([CXL, Y0], [MIDX, Y0], [0, -1], 270, 12)
const uniq = stations.filter((s, i) => i === 0 || Math.hypot(s.p[0] - stations[i - 1].p[0], s.p[1] - stations[i - 1].p[1]) > 1e-6 || s.phi !== stations[i - 1].phi)
const profs = uniq.map((s) => profileAt(s.phi, s.p[1]))
const secs = profs.map(section)

/** Sweep the sections round the path: one quad per edge per bay. */
for (let k = 0; k < uniq.length - 1; k++) {
  const s0 = uniq[k], s1 = uniq[k + 1], a = secs[k], b = secs[k + 1]
  const Q = (s: Station, [d, z]: Pt): V3 => [s.p[0] + s.n[0] * d, s.p[1] + s.n[1] * d, z + FL]
  for (let i = 0; i < a.length - 1; i++) {
    const part = a[i][2]
    if (!part) continue
    const dd = a[i + 1][0] - a[i][0] + b[i + 1][0] - b[i][0], dz = a[i + 1][1] - a[i][1] + b[i + 1][1] - b[i][1]
    const n: XY = [s0.n[0] + s1.n[0], s0.n[1] + s1.n[1]]
    const hint: V3 = [-dz * n[0], -dz * n[1], dd * 2]
    if (Math.abs(dd) + Math.abs(dz) < 1e-6) continue
    quad(part, [Q(s0, a[i]), Q(s1, b[i]), Q(s1, b[i + 1]), Q(s0, a[i + 1])], hint)
  }
}

/** A point at offset d, height z off the path at station k. */
const off = (k: number, d: number, z: number): V3 => [uniq[k].p[0] + uniq[k].n[0] * d, uniq[k].p[1] + uniq[k].n[1] * d, z]

/**
 * A band along the path between two angles: d0..d1 out from the wall,
 * z0..z1 (model z), closed at both ends. dFn gives the band's d0 per
 * section when it follows the profile.
 */
function band(part: Part, inPhi: (phi: number) => boolean, d0: (p: Prof) => number, w: number, z0: number, z1: number, faces = 'all') {
  const ks = uniq.map((s, k) => k).filter((k) => inPhi(uniq[k].phi))
  for (let j = 0; j < ks.length - 1; j++) {
    const k = ks[j], l = ks[j + 1]
    if (l !== k + 1) continue
    const a0 = d0(profs[k]), b0 = d0(profs[l])
    const c = [off(k, a0, z0), off(l, b0, z0), off(l, b0 + w, z0), off(k, a0 + w, z0)]
    const t = c.map(([x, y]) => [x, y, z1] as V3)
    const nOut: V3 = [uniq[k].n[0], uniq[k].n[1], 0]
    if (faces === 'all' || faces === 'top') quad(part, [t[0], t[1], t[2], t[3]], [0, 0, 1])
    if (faces === 'all') {
      quad(part, [c[0], c[1], c[2], c[3]], [0, 0, -1])
      quad(part, [c[0], c[1], t[1], t[0]], [-nOut[0], -nOut[1], 0])
    }
    quad(part, [c[3], c[2], t[2], t[3]], nOut)
  }
  for (const [k, sgn] of [[ks[0], -1], [ks[ks.length - 1], 1]] as const) {
    const d = d0(profs[k]), tg: V3 = [-uniq[k].n[1] * sgn, uniq[k].n[0] * sgn, 0]
    quad(part, [off(k, d, z0), off(k, d + w, z0), off(k, d + w, z1), off(k, d, z1)], tg)
  }
}

// The south end zone's canopy over its upper seats (NAIP: a white curved band).
band(stone, (phi) => phi >= 222 && phi <= 314, () => 30, 8, FL + 30.5, FL + 32)
// Window bands on the brick back walls: the north end zone and the south.
for (const z of [12, 20]) band(glass, (phi) => phi >= 30 && phi <= 145, (p) => p.D, 0.06, z, z + 4.5, 'out')
for (const z of [10, 16.5]) band(glass, (phi) => (phi >= 226 && phi <= 310), (p) => p.D, 0.06, z, z + 4, 'out')
// The west stand's outer face, an open grey concrete frame (Counse's
// photo): piers every 6 m with dark openings between them, three storeys
// on Bellmont Hall's wall and one on the deck's raked back above it.
for (let k = 0; k < uniq.length - 1; k++) {
  if (uniq[k].phi !== 180 || uniq[k + 1].phi !== 180) continue
  const a = profs[k], b = profs[k + 1], A = section(a), B = section(b)
  const rk = A[A.length - 4][0], rl = B[B.length - 4][0] // the deck's back, under the rim
  for (const [dk, dl, levels] of [[a.D, b.D, [[4, 11.5], [15, 22.5], [26, 33]]], [rk, rl, [[39, 48.5]]]] as [number, number, number[][]][]) {
    for (let t = 0; t < 1 - 1e-9; t += 0.5) {
      const t0 = t + 0.07, t1 = t + 0.43
      const P = (u: number, z: number): V3 => {
        const p0 = off(k, dk + 0.06, z), p1 = off(k + 1, dl + 0.06, z)
        return [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z]
      }
      for (const [z0, z1] of levels) quad(glass, [P(t0, FL + z0), P(t1, FL + z0), P(t1, FL + z1), P(t0, FL + z1)], [-1, 0, 0])
    }
  }
}

// ---------------------------------------------------------------------------
// The west deck's light frame: columns on the rim and a beam along the top
// (lidar: 67.7 m, about 6 m deep, y -60 to 60).
{
  const xr = (y: number) => -114 + 12 * Math.min(1, (y / 84) ** 2)
  const ys = Array.from({ length: 21 }, (_, i) => -60 + i * 6)
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    const P = (y: number, dx: number, z: number): V3 => [xr(y) + dx, y, z]
    const z0 = FL + 64.5, z1 = FL + 67.7
    quad(roof, [P(a, 0.5, z1), P(b, 0.5, z1), P(b, -5.5, z1), P(a, -5.5, z1)], [0, 0, 1])
    quad(roof, [P(a, 0.5, z0), P(b, 0.5, z0), P(b, -5.5, z0), P(a, -5.5, z0)], [0, 0, -1])
    quad(roof, [P(a, 0.5, z0), P(b, 0.5, z0), P(b, 0.5, z1), P(a, 0.5, z1)], [1, 0, 0])
    quad(roof, [P(a, -5.5, z0), P(b, -5.5, z0), P(b, -5.5, z1), P(a, -5.5, z1)], [-1, 0, 0])
  }
  for (const y of [ys[0], ys[ys.length - 1]]) quad(roof, [[xr(y) + 0.5, y, FL + 64.5], [xr(y) - 5.5, y, FL + 64.5], [xr(y) - 5.5, y, FL + 67.7], [xr(y) + 0.5, y, FL + 67.7]], [0, Math.sign(y), 0])
  for (const y of ys) box(roof, [xr(y) - 2.5, y, FL + 57.8], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.2, 1.1, 6.7])
}

// The east suite block behind the rim (lidar 41 m).
prism([[109, 12], [117.5, 12], [117.5, 52], [109, 52]], 0, FL + 41, stone, roof)
quad(glass, [[109, 13.5, FL + 30], [109, 50.5, FL + 30], [109, 50.5, FL + 39], [109, 13.5, FL + 39]].map(([x, y, z]) => [x - 0.06, y, z] as V3), [-1, 0, 0])

// ---------------------------------------------------------------------------
// Towers: round brick drums with a glass drum and a pale cap (NAIP; the
// south-west tower in ajay_suresh's photo),
// tops from the lidar (north) or estimated (the south end zone's pair).
function tower(c: XY, top: number) {
  cylinder(brick, c, 7, 0, top - 7, 16)
  cylinder(glass, c, 6.3, top - 7, top - 1.2, 12)
  cylinder(stone, c, 7, top - 1.2, top, 12, stone)
  // a pale ring where the brick meets the drum
  cylinder(stone, c, 7.2, top - 8, top - 7, 16, stone)
}
for (const [x, y, top] of [[-106, 108, 40], [-77, 136, 37], [77.5, 135.5, 37], [105, 108, 37], [98, -100, 37], [56, -113, 40], [-57, -113, 40]]) tower([x, y], FL + top)
// The north end's two square entrance towers (lidar 41 m), brick with a
// glass bay facing the street.
for (const x of [-23, 22]) {
  prism([[x - 6, 128], [x + 6, 128], [x + 6, 146], [x - 6, 146]], 0, FL + 41, brick, roof)
  prism([[x - 6.3, 145.5], [x + 6.3, 145.5], [x + 6.3, 146.4], [x - 6.3, 146.4]], FL + 39.5, FL + 41.6, stone, stone)
  quad(glass, [[x - 3.5, 146.06, 8], [x + 3.5, 146.06, 8], [x + 3.5, 146.06, FL + 37], [x - 3.5, 146.06, FL + 37]], [0, 1, 0])
}

// The video board, set in the south end zone's face under the canopy and
// facing the field (estimated: no board shows over the roof in the 2025
// photo from the south-west).
box(roof, [0.75, -96.6, FL + 26.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [19.5, 0.6, 5.2])
box(glass, [0.75, -95.95, FL + 26.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [18.8, 0.06, 4.6])

// ---------------------------------------------------------------------------
const parts = [
  // At night the field lights wash the bowl: seats, fascias and rim, not the
  // outer walls (the night photo).
  { part: seats, material: { ...finish('dkr-aluminium', 0xcfd3d6), floodlight: () => 0.85 } },
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('dkr-brick', 0xb98466) },
  { part: orange, material: { ...finish('dkr-burnt-orange', 0xc6703e), floodlight: (p: V3, n: V3) => (Math.hypot(p[0], p[1] + 2) < 75 ? 0.7 : 0) } },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Darrell K Royal–Texas Memorial Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 5.05, osm: 'way/128637559', height: FL + 67.7,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/atx-dkr-texas-memorial-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
