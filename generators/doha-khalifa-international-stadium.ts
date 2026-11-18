/**
 * Khalifa International Stadium, Aspire Zone, Al Rayyan (1976; rebuilt 2005–06;
 * renovated 2014–17 by Dar Al-Handasah for the 2022 World Cup) — original
 * procedural geometry, CC0-1.0.
 * bun generators/doha-khalifa-international-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/doha-khalifa-international-stadium.glb (low, ≤ 6,500 triangles);
 * - models/doha-khalifa-international-stadium.detail.glb (from zoom 16).
 *
 * Frame: map frame (bearing 0: the stadium's long axis runs north–south).
 * Origin = centroid of the OSM outline relation/8677986 (51.4483067, 25.2636694).
 *
 * Evidence
 * - OSM relation/8677986 (building=stadium): an outer ring 277 × 271 m and an
 *   inner ring 115 × 152 m, which is the roof's opening (the 2017 roof covers
 *   the stands all round, ~70% of the stadium). Two arcs of six small
 *   elliptical buildings (way/770622816 to way/770622827) at the north and
 *   south ends; the outermost of each arc mark the arches' feet: the east arch springs from
 *   (66, -144) to (66, 135) m, a 279 m span, and the west arch from (-58,
 *   -167) to (-58, 158) m. The four foot buildings (way/770622816, 821, 822,
 *   827) are replaced, as the model's arch feet stand on them; the eight
 *   between them are not covered and are left to the map. The round stair towers on the east (way/770603498, 770521875,
 *   770622785) and the canopies north of the stadium are separate and left
 *   to the map.
 * - Published: Wikipedia "Khalifa International Stadium": two roof arches,
 *   east and west, after the 2014–17 renovation; the roof of EFTE/PTFE
 *   membrane covers over 70% of the stadium; capacity ~40,000–48,000; the
 *   athletics track remains. Maffeis Engineering (arch structure): span
 *   280 m, height 98 m. The Peninsula (2016): the last arch segment set at
 *   120 m (taken as including the crane's reach; 98 m is used).
 * - Photos (EVIDENCE):
 *   Doha Stadium Plus, "ASPIRE Tower" (CC BY 2.0) — the two arches, the
 *     near one high with hangers to the roof, the other behind it;
 *     https://live.staticflickr.com/6219/6376487897_525744dffa_b.jpg
 *   Nayaab Shaikh, "Aspire tower" (CC BY 2.0) — the arches from the west,
 *     the white membrane bays over the stand;
 *     https://live.staticflickr.com/2643/4120231826_8b39f0ed39_b.jpg
 *   Mohamod Fasil, "Khalifa International Stadium, Doha - Qatar" (CC BY 2.0) — the arch's double-chord lattice at night;
 *     https://live.staticflickr.com/7604/16749602291_28c2ee3490_b.jpg
 *   Hanson K Joseph, "Hanson K Joseph Khalifa Stadium.jpg" (CC BY-SA 4.0) —
 *     the renovated bowl: maroon and white seats, the stepped tiers;
 *     https://commons.wikimedia.org/wiki/File:Hanson_K_Joseph_Khalifa_Stadium.jpg
 *   Diplomatic Security Service, "Special Agents at the World Cup
 *     (52553123545).jpg" (public domain) — the bowl in 2022;
 *     https://commons.wikimedia.org/wiki/File:Special_Agents_at_the_World_Cup_(52553123545).jpg
 *
 * Estimated: the bowl's inner edge, an oval 2 × 58 by 2 × 96 m round the
 * track; the stand profile: a lower tier rising to 14 m, a concourse, an
 * upper tier to 38 m on the sides and 26 m at the ends (photos); the roof's
 * outer edge at 44 m (sides) to 32 m (ends), falling gently to 40 m at the
 * opening; the arches' apex 98 m, each a double-chord truss 6 m deep (8 m in the low model) with a
 * zigzag web; hangers from the arches to the roof every ~14 m (detail only).
 * Colours: the roof white; the arches white steel, drawn a shade greyer (#dde0e2) so they read against the roof; seats Qatar maroon (#8a1538 in the
 * photos), drawn #a05468; the outer wall pale grey-sand.
 * Elevation 0: the field's depth below the street is unknown (the photos
 * show the lower tier starting about at grade).
 *
 * Doubts: the arches are drawn in vertical planes (they may lean); the
 * roof's membrane bays are drawn as one smooth surface in the low model.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { tube, otri, writeModel, type Mat, type P2 } from './doha-museum-of-islamic-art'

const ANCHOR = { lng: 51.4483067, lat: 25.2636694 }
const OUTER: P2[] = [[133.4,-34.6],[136.0,-6.7],[136.2,-4.0],[136.1,0.0],[135.3,5.4],[135.0,9.2],[134.8,11.2],[133.8,23.8],[130.5,41.3],[127.1,51.9],[120.1,68.1],[118.6,71.6],[117.2,74.8],[115.0,79.8],[104.4,94.9],[97.5,103.1],[87.0,114.1],[83.2,112.7],[78.1,108.5],[71.2,114.7],[54.6,125.0],[37.8,130.8],[10.3,133.5],[-20.4,132.1],[-49.1,125.1],[-69.9,116.1],[-74.0,113.1],[-83.2,106.5],[-93.0,99.2],[-99.5,93.1],[-103.3,89.6],[-121.2,68.9],[-122.7,66.6],[-125.5,62.4],[-128.9,55.3],[-132.5,47.8],[-133.0,46.8],[-136.2,36.9],[-139.0,26.9],[-140.4,10.6],[-139.3,-10.1],[-137.4,-26.5],[-135.2,-34.8],[-130.9,-46.0],[-129.5,-50.5],[-129.0,-51.3],[-122.3,-62.9],[-118.6,-69.4],[-117.4,-71.4],[-100.1,-90.7],[-95.9,-94.1],[-79.1,-107.5],[-70.7,-113.2],[-57.6,-122.0],[-33.2,-132.4],[-0.6,-137.4],[31.0,-132.0],[61.6,-120.1],[72.3,-113.6],[73.6,-101.4],[87.6,-112.6],[99.6,-101.5],[112.4,-85.1],[117.1,-76.0],[118.9,-72.5],[124.2,-62.5],[128.1,-50.7]]
const HOLE: P2[] = [[-33.6,68.2],[-46.5,58.5],[-57.1,41.7],[-63.3,20.4],[-65.8,0.4],[-63.4,-23.1],[-57.7,-41.4],[-48.9,-56.5],[-38.2,-67.2],[-26.5,-73.6],[-12.3,-76.8],[2.2,-75.6],[17.9,-70.4],[26.9,-63.1],[35.2,-53.2],[40.1,-41.1],[44.4,-28.0],[47.4,-14.1],[49.0,0.4],[47.6,16.7],[43.9,32.6],[38.1,47.4],[29.8,60.5],[15.0,71.1],[-1.5,75.5],[-17.5,73.8]]

/** Where the ray from the centre at angle a meets a polygon. */
function rayHit(poly: P2[], a: number): P2 {
  const d: P2 = [Math.cos(a), Math.sin(a)]
  let best = Infinity
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], e: P2 = [q[0] - p[0], q[1] - p[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const t = (p[0] * e[1] - p[1] * e[0]) / den, u = (p[0] * d[1] - p[1] * d[0]) / den
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t)
  }
  return [d[0] * best, d[1] * best]
}
/** The track's oval: a superellipse 58 × 96 m. */
const field = (a: number): P2 => { const c = Math.cos(a), s = Math.sin(a), n = 3; return [58 * Math.sign(c) * Math.abs(c) ** (2 / n), 96 * Math.sign(s) * Math.abs(s) ** (2 / n)] }
const sideness = (a: number) => Math.abs(Math.cos(a)) ** 1.5 // 1 on the east and west sides, 0 at the ends

function build(detail: boolean): Mat[] {
  const seats = new Part(), conc = new Part(), roof = new Part(), arch = new Part(), wall = new Part()
  const NA = detail ? 112 : 56
  const ang = (k: number) => (2 * Math.PI * k) / NA

  // stand profile: [t across from field to outer wall, height]
  const prof = (a: number): [number, number][] => {
    const H = 26 + 12 * sideness(a)
    return [[0, 1.2], [0.06, 1.2], [0.42, 14], [0.5, 14], [0.52, 16.5], [0.94, H], [1, H]]
  }
  const at = (a: number, t: number, z: number): V3 => {
    const f = field(a), o = rayHit(OUTER, a), w = 0.985
    return [f[0] + (o[0] * w - f[0]) * t, f[1] + (o[1] * w - f[1]) * t, z]
  }
  for (let k = 0; k < NA; k++) {
    const a0 = ang(k), a1 = ang(k + 1), p0 = prof(a0), p1 = prof(a1)
    for (let j = 0; j + 1 < p0.length; j++) {
      const A = at(a0, p0[j][0], p0[j][1]), B = at(a1, p1[j][0], p1[j][1]), C = at(a1, p1[j + 1][0], p1[j + 1][1]), D = at(a0, p0[j + 1][0], p0[j + 1][1])
      const part = j === 0 || j === 3 || j === 5 ? conc : seats
      otri(part, A, B, C, [0, 0, 1]); otri(part, A, C, D, [0, 0, 1])
    }
    // the field wall (front of the lower tier)
    { const A = at(a0, 0, 0), B = at(a1, 0, 0), C = at(a1, 0, 1.2), D = at(a0, 0, 1.2), c = field((a0 + a1) / 2); otri(conc, A, B, C, [-c[0], -c[1], 0]); otri(conc, A, C, D, [-c[0], -c[1], 0]) }
    // the outer wall, in two bands so it follows the ground
    const o0 = rayHit(OUTER, a0), o1 = rayHit(OUTER, a1), H0 = p0[p0.length - 1][1], H1 = p1[p1.length - 1][1]
    const om = rayHit(OUTER, (a0 + a1) / 2)
    for (const [za, zb, part] of [[0, 5, wall], [5, 1, wall]] as [number, number, Part][]) {
      const z0a = za, z1a = zb === 5 ? 5 : H0 + 0, z1b = zb === 5 ? 5 : H1
      otri(part, [o0[0], o0[1], z0a], [o1[0], o1[1], z0a], [o1[0], o1[1], z1b], [om[0], om[1], 0])
      otri(part, [o0[0], o0[1], z0a], [o1[0], o1[1], z1b], [o0[0], o0[1], z1a], [om[0], om[1], 0])
    }
  }

  // the roof: a membrane ring from just outside the stands' top in to the opening
  {
    const hole = (a: number) => rayHit(HOLE, a)
    const rows = detail ? 6 : 3
    const roofZ = (a: number, t: number) => { const e = 32 + 12 * sideness(a); return e + (40 - e) * t + (detail ? 1.2 * Math.sin(Math.PI * t) : 0) }
    // the membrane's bays: every other radial line is a ridge, 3 m up
    const ridge = (a: number) => (Math.round(a / ang(1)) % 2 === 0 ? 3 : 0)
    const rp = (a: number, t: number, dz = 0): V3 => {
      const o = rayHit(OUTER, a), h = hole(a), oo: P2 = [o[0] * 1.01, o[1] * 1.01]
      return [oo[0] + (h[0] - oo[0]) * t, oo[1] + (h[1] - oo[1]) * t, roofZ(a, t) + dz + ridge(a) * Math.sin(Math.PI * Math.min(1, t * 1.15))]
    }
    for (let k = 0; k < NA; k++) {
      const a0 = ang(k), a1 = ang(k + 1)
      for (let j = 0; j < rows; j++) {
        const t0 = j / rows, t1 = (j + 1) / rows
        otri(roof, rp(a0, t0), rp(a1, t0), rp(a1, t1), [0, 0, 1]); otri(roof, rp(a0, t0), rp(a1, t1), rp(a0, t1), [0, 0, 1])
        otri(roof, rp(a0, t0, -0.6), rp(a1, t1, -0.6), rp(a1, t0, -0.6), [0, 0, -1]); otri(roof, rp(a0, t0, -0.6), rp(a0, t1, -0.6), rp(a1, t1, -0.6), [0, 0, -1])
      }
      // edges: the inner lip and the outer fascia down to the wall top
      const i0 = rp(a0, 1), i1 = rp(a1, 1), h = hole((a0 + a1) / 2)
      otri(roof, i0, [i1[0], i1[1], i1[2] - 0.6], i1, [-h[0], -h[1], 0]); otri(roof, i0, [i0[0], i0[1], i0[2] - 0.6], [i1[0], i1[1], i1[2] - 0.6], [-h[0], -h[1], 0])
      const e0 = rp(a0, 0), e1 = rp(a1, 0), p0 = prof(a0), p1 = prof(a1), o = rayHit(OUTER, (a0 + a1) / 2)
      const w0 = rayHit(OUTER, a0), w1 = rayHit(OUTER, a1)
      otri(wall, [w0[0] * 1.01, w0[1] * 1.01, p0[p0.length - 1][1]], [w1[0] * 1.01, w1[1] * 1.01, p1[p1.length - 1][1]], e1, [o[0], o[1], 0])
      otri(wall, [w0[0] * 1.01, w0[1] * 1.01, p0[p0.length - 1][1]], e1, e0, [o[0], o[1], 0])
    }
  }

  // the two arches: double-chord trusses in vertical planes, 98 m high
  const arches: [number, number, number][] = [[66, -144, 135], [-58, -167, 158]]
  const AP = 98, DEPTH = detail ? 6 : 8
  for (const [x, y0, y1] of arches) {
    const n = detail ? 40 : 20
    const half = (y1 - y0) / 2, yc = (y0 + y1) / 2
    // a parabola through the feet and the apex; the lower chord DEPTH below, meeting at the feet
    const top = (t: number): V3 => { const y = y0 + (y1 - y0) * t, u = (y - yc) / half; return [x, y, AP * (1 - u * u)] }
    const bot = (t: number): V3 => { const p = top(t), s = Math.sin(Math.PI * t); return [x, p[1] + 0 * s, Math.max(0, p[2] - DEPTH * Math.min(1, s * 2.2))] }
    const T: V3[] = [], B: V3[] = []
    for (let k = 0; k <= n; k++) { T.push(top(k / n)); B.push(bot(k / n)) }
    // the chords spring from inside the 3 m plinths, so nothing goes below the ground
    for (const p of [...T, ...B]) p[2] = Math.max(p[2], 2.6)
    tube(arch, T, detail ? 1.3 : 2.3, detail ? 8 : 5)
    tube(arch, B, detail ? 1.1 : 2.0, detail ? 8 : 5)
    // the zigzag web
    for (let k = 1; k < n - 1; k++) tube(arch, [T[k], B[k + 1]], detail ? 0.5 : 1.0, detail ? 6 : 3)
    if (detail) for (let k = 1; k < n; k++) tube(arch, [T[k], B[k]], 0.35, 6)
    // the feet: concrete plinths on the OSM foot buildings
    for (const y of [y0, y1]) {
      const s = 4
      const q: V3[] = [[x - s, y - s, 0], [x + s, y - s, 0], [x + s, y + s, 0], [x - s, y + s, 0]]
      for (let i = 0; i < 4; i++) { const p = q[i], r = q[(i + 1) % 4]; otri(conc, p, r, [r[0], r[1], 3], [(p[0] + r[0]) / 2 - x, (p[1] + r[1]) / 2 - y, 0]); otri(conc, p, [r[0], r[1], 3], [p[0], p[1], 3], [(p[0] + r[0]) / 2 - x, (p[1] + r[1]) / 2 - y, 0]) }
      otri(conc, [x - s, y - s, 3], [x + s, y - s, 3], [x + s, y + s, 3], [0, 0, 1]); otri(conc, [x - s, y - s, 3], [x + s, y + s, 3], [x - s, y + s, 3], [0, 0, 1])
    }
    // hangers down to the roof
    if (detail) for (let k = 2; k < n - 1; k += 2) {
      const p = B[k]
      if (p[2] < 46) continue
      tube(arch, [p, [p[0], p[1], 42]], 0.25, 4)
    }
  }

  return [
    { part: seats, material: finish('khalifa-seats', 0xa05468) },
    { part: conc, material: finish('khalifa-concrete', 0xd9d3c8) },
    { part: wall, material: finish('khalifa-wall', 0xe4ded2) },
    { part: roof, material: { ...finish('khalifa-roof', 0xf3f1ec, 0.6) } },
    { part: arch, material: { ...finish('khalifa-arch', 0xdde0e2, 0.5), floodlight: () => 0.8 } },
  ]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0, height: 98 }
  await writeModel('doha-khalifa-international-stadium.glb', 'Khalifa International Stadium', build(false), 6500, 250 * 1024, extras)
  await writeModel('doha-khalifa-international-stadium.detail.glb', 'Khalifa International Stadium', build(true), 40000, 1536 * 1024, extras)
}
