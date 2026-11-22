/**
 * The front-stretch grandstands of the Indianapolis Motor Speedway,
 * Speedway, Indiana: procedural, CC0-1.0.
 * bun generators/indy-ims-main-grandstands.ts [out.glb]
 *
 * One model for the wall of seats along the main straight, from E Stand on
 * the exit of Turn 4 into Turn 1 (south-east) to Stand H at the north end:
 *   outside (west of the track): E Stand, B Stand, A Stand, the Paddock,
 *     Stand C with the Hulman Terrace suites, Stand H;
 *   inside (east, beyond pit lane): the Gasoline Alley Suites with the Pit
 *     Road Terrace seats on their roof, the Tower Terrace and the Tower
 *     Suites.
 * The Pagoda (indy-ims-pagoda), the Media Center, the track, pit lane and
 * the grass are not part of it.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the straight runs
 * within a degree of north). The origin is the area centroid of the Paddock
 * outline way/589354572 (-86.2392624, 39.7938089). Coordinates below are
 * written in a local frame centred on (-86.2385, 39.7920) and shifted to
 * the origin by `L`.
 *
 * Ground: z = 0 is the lowest ground under the stands (lidar, at E Stand);
 *   the ground rises 3.3 m to the north end, so each station adds the
 *   lidar ground under it (`gz`), and every wall runs down to z = 0.
 *
 * How it is built: each stand is lofted along stations, each a pair of
 * points read off its OSM outline (the track-side front edge and the back
 * edge), with one section per stand kind (heights above the local ground,
 * all from the lidar's top surface):
 *   - roofed (E, B, A, Paddock): the track wall to 1.5 m, the open front
 *     rows to the roof's front edge, the seats rising under the roof to the
 *     penthouse boxes (glass, facing the track), the roof plate:
 *       A and Paddock: roof 23.0 m at the back to 24.0 m at the front
 *         (lidar 23.1-24.2), its front 8-11 m behind the track wall;
 *       B: 24-25 m (lidar), almost the whole depth;
 *       E: 19.8 m at the front falling to 14.8 m at the back (lidar), a
 *         cantilever over all but the first rows;
 *     and steel columns along the roof's front edge;
 *   - Stand C: seats to 12.5 m, the Hulman Terrace suites behind them to
 *     19.2 m (lidar 18.5-19.5), glass to the track;
 *   - Stand H: an open rake, 2 m at the front to 13 m at the back (lidar);
 *   - Gasoline Alley Suites: 8.7 m (lidar), the suites' glass band on the
 *     pit-lane face, and the three Pit Road Terrace seat blocks on the roof
 *     rising to 12.7 m (lidar);
 *   - Tower Terrace: an open rake from 2 m to 8 m (9.5 m in front of the
 *     Media Center), and behind it the Tower Suites: a glass face, the
 *     upper seats rising 13.6 to 17.6 m and the suites under a dark roof at
 *     21.6 m (lidar 21.5-21.7).
 *
 * Sources
 * - OSM (ODbL): way/570796644 E Stand, way/388929551 B Stand,
 *   way/383851500 A Stand, way/589354572 Paddock, way/388929555 Stand C &
 *   Hulman Terrace/Club, way/588833536 Stand H, way/388929552 Gasoline
 *   Alley Suites, way/588800193, way/588800194, way/588800195 Pit Road
 *   Terrace Stands, way/588795255 Tower Terrace Grandstand, way/588795256
 *   Tower Suites; their descriptions give the levels (two-level A, B, E;
 *   three-level Paddock; suites over the garages with seats on the roof).
 * - USGS lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   2 m grid over the whole run: every height above, and the ground.
 * - USGS NAIP orthophoto (public domain): the roofs (pale grey over the
 *   west stands, dark over the Tower Suites), the plan.
 * - Photos (Wikimedia Commons):
 *   "Indianapolis Motor Speedway (16188939351).jpg" (redlegsfan21, CC BY-SA
 *   2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Motor_Speedway_(16188939351).jpg),
 *   down the straight from the south: the long roof on its columns over A
 *   and the Paddock, the Gasoline Alley Suites and their roof seats, the
 *   Tower Terrace;
 *   "Frontstretch of Indianapolis Motor Speedway (40652603200).jpg" (Zach
 *   Catanzareti Photo, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Frontstretch_of_Indianapolis_Motor_Speedway_(40652603200).jpg),
 *   from the Paddock: the inside stands, the aluminium seats, the suites'
 *   glass, the Tower Terrace's upper deck;
 *   "Racing at the 2026 Brickyard 400.jpg" (Brycenrichter, CC0,
 *   https://commons.wikimedia.org/wiki/File:Racing_at_the_2026_Brickyard_400.jpg),
 *   the Gasoline Alley Suites and the stands beyond them from the outside
 *   wall.
 * Estimated: the seat rake under the roofs (hidden from the lidar), the
 *   penthouse glass, the column spacing (15 m), the outer (west) walls,
 *   which no photo shows and are drawn plain.
 * Left out: the Paddock's front notch, the skybridges, stair towers and
 *   ramps, the vomitories in the Tower Terrace, the catch fence, the seat
 *   rows and aisles, the flags.
 * Night: the suites' and penthouses' glass is `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, triangulate, finishGlb, writeModel } from './sea-tacoma-union-station'
import { poly } from './indy-st-john-the-evangelist'

const concrete = new Part(), seats = new Part(), roof = new Part(), glass = new Part(), steel = new Part()
const C = 0, S = 1, RF = 2, W = 3, ST = 4
const PARTS = [concrete, seats, roof, glass, steel]

// local frame → model frame
const L = (p: XY): XY => [p[0] + 65.22, p[1] - 200.02]

/** Lidar ground above the lowest point, along the straight (local y). */
const GROUND: XY[] = [[-430, 0.1], [-330, 0.3], [-260, 0.9], [-180, 1.2], [-60, 1.4], [20, 1.5], [100, 1.8], [180, 1.9], [260, 2.2], [380, 2.6], [500, 2.8], [620, 3.2], [780, 3.4]]
function gz(y: number): number {
  if (y <= GROUND[0][0]) return GROUND[0][1]
  for (let i = 0; i + 1 < GROUND.length; i++) {
    const [y0, g0] = GROUND[i], [y1, g1] = GROUND[i + 1]
    if (y <= y1) return g0 + ((g1 - g0) * (y - y0)) / (y1 - y0)
  }
  return GROUND[GROUND.length - 1][1]
}

/** A section: [d from the front, height above local ground (null = z 0), material of the segment to the next point]. */
type Pt = [number, number | null, number]
type Section = (D: number) => Pt[]
type Station = { f: XY; b: XY }

/**
 * A two-deck roofed stand: the lower rows rising from the track wall to the
 * upper deck's front at `Uf` (height `low`), the deck's fascia to `deck`,
 * the upper seats rising to `seat` at the penthouse glass, and the roof
 * plate from `R` (top `rf`) to the back (top `rb`).
 */
const roofed = (R: number, Uf: number, low: number, deck: number, seat: number, rf: number, rb: number): Section => (D) => [
  [0, null, C], [0, 1.5, S], [Uf, low, C], [Uf, deck, S], [D - 1, seat, W], [D - 1, rb - 0.9, ST],
  [R, rf - 0.9, C], [R, rf, RF], [D, rb, C], [D, null, C],
]

/** Loft a stand along its stations; caps both ends; returns nothing. */
function stand(stations: Station[], sec: Section | Section[], cols?: { d: number; low: number; rf: number; every: number }) {
  const secAt = (i: number) => (Array.isArray(sec) ? sec[i] : sec)
  const pts3 = stations.map((st, i) => {
    const f = L(st.f), b = L(st.b)
    const D = Math.hypot(b[0] - f[0], b[1] - f[1])
    const u: XY = [(b[0] - f[0]) / D, (b[1] - f[1]) / D]
    const g = gz(st.f[1])
    const s = secAt(i)(D)
    return { u, s, f, g, P: s.map(([d, h]) => [f[0] + u[0] * d, f[1] + u[1] * d, h === null ? 0 : g + h] as V3) }
  })
  // sides
  for (let i = 0; i + 1 < pts3.length; i++) {
    const A = pts3[i], B = pts3[i + 1]
    const n = A.s.length
    for (let k = 0; k + 1 < n; k++) {
      const [d0, h0] = A.s[k], [d1, h1] = A.s[k + 1]
      const td = d1 - d0, tz = (h1 ?? -A.g) - (h0 ?? -A.g)
      // outward in the section: (-tz, td) in (d, z)
      const u: XY = [(A.u[0] + B.u[0]) / 2, (A.u[1] + B.u[1]) / 2]
      const hint: V3 = [-tz * u[0], -tz * u[1], td]
      if (Math.hypot(...hint) < 1e-6) continue
      poly(PARTS[A.s[k][2]], [A.P[k], A.P[k + 1], B.P[k + 1], B.P[k]], hint)
    }
  }
  // end caps
  for (const [i, sgn] of [[0, -1], [pts3.length - 1, 1]] as [number, number][]) {
    const E = pts3[i], O = pts3[i === 0 ? 1 : i - 1]
    const along: V3 = [(E.f[0] - O.f[0]) * 1, (E.f[1] - O.f[1]) * 1, 0]
    void sgn
    const ring: XY[] = E.s.map(([d, h]) => [d, h === null ? -E.g : h])
    const r = ccw(ring)
    for (const [a, b, c] of triangulate(r)) {
      const to3 = (q: XY): V3 => [E.f[0] + E.u[0] * q[0], E.f[1] + E.u[1] * q[0], q[1] + E.g]
      poly(concrete, [to3(r[a]), to3(r[b]), to3(r[c])], along)
    }
  }
  // columns along the roof's front edge
  if (cols) {
    for (let i = 0; i + 1 < pts3.length; i++) {
      const A = pts3[i], B = pts3[i + 1]
      const fa = A.f, fb = B.f
      const len = Math.hypot(fb[0] - fa[0], fb[1] - fa[1])
      const n = Math.max(1, Math.round(len / cols.every))
      for (let k = i === 0 ? 0 : 1; k <= n; k++) {
        const t = k / n
        const u: XY = [A.u[0] + (B.u[0] - A.u[0]) * t, A.u[1] + (B.u[1] - A.u[1]) * t]
        const g = A.g + (B.g - A.g) * t
        const d = cols.d
        const x = fa[0] + (fb[0] - fa[0]) * t + u[0] * d, y = fa[1] + (fb[1] - fa[1]) * t + u[1] * d
        const z0 = g + cols.low, z1 = g + cols.rf - 0.9
        const r = 0.3
        const q: V3[] = [[x - r, y - r, 0], [x + r, y - r, 0], [x + r, y + r, 0], [x - r, y + r, 0]]
        for (let e = 0; e < 4; e++) {
          const a = q[e], b = q[(e + 1) % 4]
          poly(steel, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0])
        }
      }
    }
  }
}

// ---------------------------------------------------------------- outside, west of the track
// E Stand, round the start of Turn 1, south-east to north-west
stand([
  { f: [95.9, -406.6], b: [85.7, -424.6] },
  { f: [63.2, -383.6], b: [53.5, -402.0] },
  { f: [39.4, -362.6], b: [24.6, -377.4] },
  { f: [15.4, -335.9], b: [-1.1, -348.8] },
  { f: [-2.5, -309.3], b: [-20.0, -319.5] },
  { f: [-20.2, -273.0], b: [-39.8, -281.3] },
], roofed(3, 8, 5, 8, 12, 19.8, 14.8))

// B Stand, out of the turn onto the straight
stand([
  { f: [-20.2, -273.0], b: [-39.8, -281.3] },
  { f: [-35.2, -231.1], b: [-55.2, -237.6] },
  { f: [-45.8, -190.1], b: [-65.8, -193.0] },
  { f: [-52.2, -148.1], b: [-72.7, -151.0] },
  { f: [-52.3, -143.0], b: [-73.0, -143.7] },
], roofed(5, 6, 4, 8, 15, 25.0, 24.0), { d: 6.3, low: 8, rf: 25.0, every: 15 })

// A Stand and the Paddock, one continuous roof
stand([
  { f: [-43.6, -142.0], b: [-73.0, -143.7] },
  { f: [-47.8, 17.9], b: [-78.2, 16.7] },
  { f: [-47.5, 178.6], b: [-81.2, 179.0] },
  { f: [-50.1, 378.9], b: [-83.1, 379.8] },
], [roofed(8, 9, 4, 9, 15.5, 24.0, 23.0), roofed(9, 10, 4, 9, 16, 24.0, 23.0), roofed(11, 12, 4.5, 9.5, 16, 24.0, 23.0), roofed(11, 12, 4.5, 9.5, 16, 24.0, 23.0)],
{ d: 11, low: 9.2, rf: 24.0, every: 15 })

// Stand C and the Hulman Terrace suites
stand([
  { f: [-59.4, 389.3], b: [-83.0, 389.3] },
  { f: [-61.8, 553.8], b: [-85.2, 553.6] },
], (D) => [[0, null, C], [0, 1.5, S], [D - 12, 12.5, W], [D - 12, 19.2, RF], [D, 19.2, C], [D, null, C]])

// Stand H, open
stand([
  { f: [-62.0, 584.6], b: [-85.2, 584.6] },
  { f: [-64.2, 779.0], b: [-87.1, 779.5] },
], (D) => [[0, null, C], [0, 2.0, S], [D, 13.0, C], [D, null, C]])

// ---------------------------------------------------------------- inside, east of pit lane
// Gasoline Alley Suites: the building, the suites' glass to pit lane
stand([
  { f: [13.1, -195.0], b: [31.5, -197.1] },
  { f: [9.4, 99.0], b: [27.9, 99.9] },
], (D) => [[0, null, C], [0, 8.7, RF], [D, 8.7, C], [D, null, C]])
{
  const a = L([13.1, -195.0]), b = L([9.4, 99.0])
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], o: XY = [t[1], -t[0]] // outward, to the west
  const ga = gz(-195), gb = gz(99)
  const P = (s: number, h: number): V3 => {
    const g = ga + ((gb - ga) * s) / len
    return [a[0] + t[0] * s + o[0] * 0.06, a[1] + t[1] * s + o[1] * 0.06, g + h]
  }
  // the suites (level 2) as one long band broken every ~50 m, and the garage doors below
  const n = 6
  for (let k = 0; k < n; k++) {
    const s0 = 3 + ((len - 6) * k) / n + 0.6, s1 = 3 + ((len - 6) * (k + 1)) / n - 0.6
    poly(glass, [P(s0, 4.6), P(s1, 4.6), P(s1, 7.9), P(s0, 7.9)], [o[0], o[1], 0])
  }
}
// the Pit Road Terrace seats on its roof, rising away from pit lane
for (const [x0, x1, y0, y1] of [[16.6, 23.6, -172.8, -111.0], [15.4, 22.9, -70.2, -6.7], [13.7, 21.7, 30.4, 94.4]]) {
  stand([
    { f: [x0, y0], b: [x1, y0] },
    { f: [x0 - 0.8, y1], b: [x1 - 0.8, y1] },
  ], (D) => [[0, 8.7, C], [0, 9.3, S], [D, 12.7, C], [D, 8.7, C]])
}

// Tower Terrace, south part in front of the Media Center
stand([
  { f: [-1.1, 177.6], b: [24.3, 178.0] },
  { f: [-2.4, 275.6], b: [24.0, 275.6] },
], (D) => [[0, null, C], [0, 2.0, S], [D, 9.5, C], [D, null, C]])
// Tower Terrace and the Tower Suites behind it
stand([
  { f: [-2.4, 276.1], b: [48.0, 276.2] },
  { f: [-5.7, 554.5], b: [44.7, 554.8] },
], (D) => [
  [0, null, C], [0, 2.0, S], [D - 25.5, 8.0, W], [D - 25.5, 13.6, S],
  [D - 17, 17.6, W], [D - 17, 21.6, ST], [D, 21.6, C], [D, null, C],
])

const concreteM = finish('indy-ims-concrete', 0xdcd8d0)
const built = finishGlb('Indianapolis Motor Speedway front-stretch grandstands', [
  { part: concrete, material: concreteM },
  { part: seats, material: finish('indy-ims-seats', 0xb8bebd) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
  { part: steel, material: finish('indy-ims-steel', 0x6b737b) },
], {
  bearing: 0, height: 26.6,
  replaces: [
    'way/570796644', 'way/388929551', 'way/383851500', 'way/589354572', 'way/388929555', 'way/588833536',
    'way/388929552', 'way/588800193', 'way/588800194', 'way/588800195', 'way/588795255', 'way/588795256',
  ],
}, 6500)
await writeModel('indy-ims-main-grandstands', built)
