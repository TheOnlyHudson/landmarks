/**
 * Maimonides Park (opened 2001 as KeySpan Park, later MCU Park), the
 * Brooklyn Cyclones' ballpark on the Coney Island boardwalk — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-maimonides-park.ts
 *
 * Map frame: x = east, y = north, z up, metres, bearing 0: everything is
 * taken straight from OSM and lidar in east/north metres. Anchor: area
 * centroid of the leisure=stadium way/266063817 (-73.9840245, 40.5743533).
 * Home plate is at about (-28, 24), at the north-west; the field opens to
 * the south-east, with the Parachute Jump beyond the right-field corner.
 *
 * The stands only: the field, the warning track and all paving are the
 * map's (STYLE.md, "Don't model the ground"). What is drawn:
 *   - the low seating rake from the right-field end of the first-base
 *     stand round home plate to the end of the third-base stand;
 *   - the concourse deck behind it and the low buildings under and beside
 *     it, out to the OSM outline;
 *   - the curved press-box and suite block behind home, its blue "MCU
 *     Park" fascia (a plain blue band; the sign is not famous enough to
 *     letter) and the stair/elevator tower;
 *   - the striped blue-and-yellow sunshade canopies over the first- and
 *     third-base seats;
 *   - eight light towers, each lamp bank inside the big ring that is the
 *     park's signature (lit blue at night in Wally Gobetz's photo).
 *
 * Sources
 * - OSM: building=stadium way/266063810 (the L-shaped stand, its inner
 *   edge is the rake's front), leisure=stadium way/266063817 (name,
 *   wikidata Q6715011).
 * - USGS 3DEP lidar NY_NewYorkCity (2017 flight), 1 m grid, read in this
 *   frame (lidar_frame.py, bearing 0). Ground outside 0.5–0.9 m over the
 *   tile's ground_min; y = 0 is that street level, so the field is at
 *   0.9 m and stands at street level (elevation 0, per docs/evidence.md).
 *   Measured above y = 0: rake from ~0.9 at the field wall to ~4.5 at its
 *   back (15 m deep on the first-base side, 13 m on the third-base side);
 *   concourse deck 6.0; outer blocks 9.5; first-base canopy 11–12.8
 *   (x -57…-45, y -45…-5), third-base canopy 11.5–12.7 (x -15…30,
 *   y 53…62); press-box block 17.2–17.9 (round home, 17–28 m out), its
 *   tower 22.8 at (-50, 65); light towers 33.5–37.1, at (-10, 70),
 *   (-74, -3), (58, -75), (15, -83), (38, 44), (-28, -55), (71, 20),
 *   (75, -15).
 * - USGS/NYC orthophoto via tools/usgs.py: plan, the grey rake with its
 *   aisles, the canopies' blue and yellow stripes.
 * - Photos (Wikimedia Commons):
 *   - "Coney Island Keyspan Park-1.jpg", Wally Gobetz, CC BY 2.0 (night:
 *     rings lit, canopy, the Parachute Jump beyond right field)
 *   - "Coney Island Keyspan Park-3 Exterior.jpg", Wally Gobetz, CC BY 2.0
 *   - "MCU Park td (2018-09-03) 04.jpg", Tdorante10, CC BY-SA 4.0 (the
 *     exterior from the west lot: buff block, rings, canopies)
 *   - "Surf Av W 17th St td (2019-08-19) 01 - MCU Park.jpg", Tdorante10,
 *     CC BY-SA 4.0 (the press box and its blue fascia from the north)
 *   - "Coney Island Surf Av 10 - MCU Park.jpg", Tdorante10, CC BY-SA 4.0
 *   - "Cyclones vs Renegades 06-24-17 4th Inning 07.jpg", Tdorante10,
 *     CC BY-SA 4.0 (concrete stands, dark green seats)
 *
 * Estimated: ring diameter 7 m and the lamp bank (from td 04 against the
 * pole); the outer blocks' extent (lidar shows several, drawn as four);
 * the canopy posts. The rings' orientation (each faces home plate).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel, prism, circle, unit, type XY } from './nyc-570-lexington'

const concrete = new Part(), seats = new Part(), buff = new Part(), blue = new Part(), yellow = new Part(), neon = new Part()

const HOME: XY = [-28, 24]
const FIELD = 0.9, WALL = 2.1, RAKE_TOP = 4.6, DECK = 6.0, BLOCK = 9.5

// OSM way/266063810: the inner (field) chain from the first-base end round
// home to the third-base end, and the outer chain back.
const INNER: XY[] = [[-22.4, -53.2], [-31.6, -25.4], [-45.2, 15.5], [-45.3, 20.7], [-44.1, 25.8], [-41.6, 30.6], [-37.8, 35.0], [-33.2, 37.9], [-27.4, 39.7], [37.0, 36.4]]
const OUTER: XY[] = [[37.6, 44.9], [40.2, 82.3], [-63.3, 68.6], [-72.9, 67.4], [-71.5, 55.9], [-80.8, 52.7], [-87.7, 50.4], [-59.8, -26.6], [-63.9, -28.2], [-57.0, -46.3], [-52.2, -44.5], [-45.8, -61.2], [-40.3, -59.3]]

/** Each chain point pushed out (away from the field) by d, mitred. */
function offset(chain: XY[], d: number | ((i: number) => number)): XY[] {
  return chain.map((p, i) => {
    const a = chain[Math.max(0, i - 1)], b = chain[Math.min(chain.length - 1, i + 1)]
    const prev = i > 0 ? unit([p[0] - a[0], p[1] - a[1], 0]) : null, next = i < chain.length - 1 ? unit([b[0] - p[0], b[1] - p[1], 0]) : null
    const nl = (v: V3): XY => [-v[1], v[0]] // left of travel = away from the field
    const n0 = prev ? nl(prev) : nl(next!), n1 = next ? nl(next) : n0
    const m = unit([n0[0] + n1[0], n0[1] + n1[1], 0]), k = m[0] * n0[0] + m[1] * n0[1]
    const dd = typeof d === 'number' ? d : d(i)
    return [p[0] + (m[0] * dd) / k, p[1] + (m[1] * dd) / k]
  })
}
/** A box, all faces but the bottom. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  prism({ wall: p, win: null, roof: p, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel: 0 })
}
/** A square-section bar from a to b, w wide, with end caps. */
function bar(p: Part, a: V3, b: V3, w: number, w2 = w) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = unit([d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]])
  const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
  const sec = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s, t]) =>
    [c[0] + u[0] * s * w / 2 + v[0] * t * w2 / 2, c[1] + u[1] * s * w / 2 + v[1] * t * w2 / 2, c[2] + u[2] * s * w / 2 + v[2] * t * w2 / 2] as V3)
  const r0 = sec(a), r1 = sec(b)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(r0[i], r0[j], r1[j], r1[i]) }
  p.quad(r1[0], r1[1], r1[2], r1[3])
  p.quad(r0[3], r0[2], r0[1], r0[0])
}
const at3 = (p: XY, z: number): V3 => [p[0], p[1], z]

// ---------------------------------------------------------------------------
// The seating rake, its field wall, aisles and end walls.
// ---------------------------------------------------------------------------
const DEPTH = (i: number) => (i <= 2 ? 15 : i >= 8 ? 13 : 14)
const R = offset(INNER, DEPTH)
for (let i = 0; i < INNER.length - 1; i++) {
  const a = INNER[i], b = INNER[i + 1]
  seats.quad(at3(a, WALL), at3(b, WALL), at3(R[i + 1], RAKE_TOP), at3(R[i], RAKE_TOP))
  concrete.quad(at3(a, 0), at3(b, 0), at3(b, WALL), at3(a, WALL))
  // Aisles: pale concrete strips down the rake, about every 10 m.
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 10)
  for (let k = 1; k <= n; k++) {
    const t0 = (k * L / (n + 1) - 0.6) / L, t1 = (k * L / (n + 1) + 0.6) / L
    const P = (t: number, outer: boolean): V3 => {
      const p0 = outer ? R[i] : a, p1 = outer ? R[i + 1] : b
      return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, (outer ? RAKE_TOP : WALL) + 0.06]
    }
    concrete.quad(P(t0, false), P(t1, false), P(t1, true), P(t0, true))
  }
}
{
  const n = INNER.length - 1
  concrete.quad(at3(R[0], 0), at3(INNER[0], 0), at3(INNER[0], WALL), at3(R[0], DECK))
  concrete.quad(at3(INNER[n], 0), at3(R[n], 0), at3(R[n], DECK), at3(INNER[n], WALL))
}

// The concourse and the buildings under it, from the rake's back to the
// OSM outline; low blocks standing on the deck.
prism({ wall: buff, win: null, roof: concrete, ring: [...R, ...OUTER.slice(1)], z0: 0, z1: DECK, facade: null, bevel: 0.3 })
for (const [x0, y0, x1, y1] of [[-42, 69, -28, 78], [-12, 68, -3, 77], [24, 68, 36, 78], [-77, 25, -71, 40]])
  box(buff, x0, y0, DECK - 0.1, x1, y1, BLOCK)

// ---------------------------------------------------------------------------
// The press-box and suite block round home plate (buff below, the blue
// fascia above), and the stair/elevator tower.
// ---------------------------------------------------------------------------
{
  const arc = INNER.slice(2, 9)
  const front = offset(arc, 17), back = offset(arc, 27)
  const ring = [...front, ...back.reverse()]
  prism({ wall: buff, win: null, roof: null, ring, z0: DECK - 0.1, z1: 13.2, facade: null, bevel: 0.3 })
  prism({ wall: blue, win: null, roof: concrete, ring, z0: 13.2, z1: 17.6, facade: null, bevel: 0.3 })
  box(blue, -53, 62, DECK - 0.1, -47, 68, 22.8)
}

// ---------------------------------------------------------------------------
// Sunshade canopies: thin slabs sloping up toward the field, in alternate
// blue and yellow panels, on posts along their back edge.
// ---------------------------------------------------------------------------
function canopy(f0: XY, f1: XY, b1: XY, b0: XY, zf: number, zb: number, panels: number) {
  const lerp2 = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
  for (let k = 0; k < panels; k++) {
    const t0 = k / panels, t1 = (k + 1) / panels, part = k % 2 ? blue : yellow
    const a = at3(lerp2(f0, f1, t0), zf), b = at3(lerp2(f0, f1, t1), zf), c = at3(lerp2(b0, b1, t1), zb), d = at3(lerp2(b0, b1, t0), zb)
    part.quad(d, c, b, a) // top (front edge, field side, is on the right going f0→f1)
    part.quad(a, b, c, d) // underside
  }
  // Front fascia and posts.
  const F0 = at3(f0, zf), F1 = at3(f1, zf)
  blue.quad(F0, F1, [F1[0], F1[1], zf - 0.5], [F0[0], F0[1], zf - 0.5])
  blue.quad([F0[0], F0[1], zf - 0.5], [F1[0], F1[1], zf - 0.5], F1, F0)
  const L = Math.hypot(b1[0] - b0[0], b1[1] - b0[1]), n = Math.max(2, Math.round(L / 9))
  for (let k = 0; k <= n; k++) {
    const p = lerp2(b0, b1, 0.05 + 0.9 * k / n), q = lerp2(lerp2(f0, f1, 0.05 + 0.9 * k / n), p, 0.75)
    bar(concrete, at3(p, DECK - 0.1), at3(q, zb + (zf - zb) * 0.25), 0.45)
  }
}
canopy([-42, -47], [-51, -3], [-63, -3], [-53, -47], 12.6, 11.3, 10)
canopy([32, 52], [-27, 52], [-27, 63], [32, 63], 12.4, 11.3, 14)

// ---------------------------------------------------------------------------
// Light towers: a grey pole, the lamp bank, and the ring round it, facing
// home plate. Tops from lidar (ring top = tower top).
// ---------------------------------------------------------------------------
const TOWERS: [number, number, number][] = [[-10, 70, 37.1], [-74, -3, 37.1], [58, -75, 34.6], [15, -83, 34.4], [38, 44, 34.0], [-28, -55, 34.0], [71, 20, 33.6], [75, -15, 33.4]]
const RING_R = 3.5
for (const [x, y, top] of TOWERS) {
  const zc = top - RING_R
  const f = unit([HOME[0] - x, HOME[1] - y, 0]) // towards home
  const s: V3 = [-f[1], f[0], 0] // across the ring's plane
  // Pole: an octagonal shaft to the ring's centre, slimmer above.
  const ring8 = (r: number, z: number) => circle(x, y, r, 8).map(([a, b]) => [a, b, z] as V3)
  const r0 = ring8(0.5, 0), r1 = ring8(0.35, zc + 0.6)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; concrete.quad(r0[i], r0[j], r1[j], r1[i]) }
  concrete.cap(r1, true)
  // The lamp bank, a broad panel at the ring's centre.
  const c: V3 = [x + f[0] * 0.6, y + f[1] * 0.6, zc]
  bar(neon, [c[0] - s[0] * 2.0, c[1] - s[1] * 2.0, c[2]], [c[0] + s[0] * 2.0, c[1] + s[1] * 2.0, c[2]], 3.0, 0.6)
  // The ring: 16 bold segments in the plane across f.
  const N = 16
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    const P = (a: number): V3 => [x + f[0] * 0.6 + s[0] * RING_R * Math.cos(a), y + f[1] * 0.6 + s[1] * RING_R * Math.cos(a), zc + RING_R * Math.sin(a)]
    bar(neon, P(a0), P(a1), 0.6)
  }
}

finishModel('Maimonides Park', 'nyc-maimonides-park', [
  { part: concrete, material: finish('ballpark-concrete', 0xc6c4bd) },
  { part: seats, material: finish('ballpark-seats', 0x557f70) },
  { part: buff, material: finish('ballpark-buff', 0xe4d8c0) },
  { part: blue, material: finish('ballpark-blue', 0x557fbb) },
  { part: yellow, material: finish('ballpark-yellow', 0xe8c64c) },
  { part: neon, material: finish('neon-ballpark-lights', 0xc9dff0) },
], { bearing: 0, osm: 'way/266063810', height: 37.1 })
