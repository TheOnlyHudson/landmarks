/**
 * Sellwood Bridge (2016, T.Y. Lin International), Portland, Oregon:
 * procedural, CC0-1.0, no textures.
 * bun generators/pdx-sellwood-bridge.ts
 *
 * The steel deck-arch bridge that carries SE Tacoma Street over the
 * Willamette, replacing the 1925 truss: three shallow arch spans, each of
 * two red-painted steel box ribs braced together, springing from concrete
 * piers in the river and on the banks, with slender red spandrel columns up
 * to the deck; the concrete deck's grey edge and parapets run the whole
 * length, rising gently to the east, with lookouts over the two river
 * piers; the east approach is a concrete girder deck on column bents down
 * the Sellwood bank, and at the west end the deck splits into the ramps of
 * the interchange over Highway 43.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the bridge runs east and
 * west). Origin: the area centroid of OSM way/432791657 (the bridge
 * outline). z = 0 is the river (lidar water surface, 2.0 m NAVD88).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/432791657
 *   (man_made=bridge), whose bulges mark the two river piers' lookouts (x
 *   -70, 59.5) and whose notches mark the east approach's bents; the
 *   roadways way/923041198, way/1102598708, way/1102598709, way/595610339.
 * - Lidar (measured): USGS 3DEP OR_OLCMetro_2019 (flown 2019), roadway
 *   heights by tools/bridge_ele.py measure along those ways (NAVD88 minus
 *   the 2.0 m water): 23.1 m at the west abutment (x -195), 26.3 (x -106),
 *   28.7 (x -51), 30.7 (x -1), 32.2 (x 60), a crest of 32.6 at x 116, then
 *   falling to 31.3 (x 201), 29.6 (x 268) and 27.1 at the east end; the
 *   ground under the east approach (10.2 m at x 201 to 26 m at x 364).
 * - USGS NAIP orthophoto (public domain): the banks (west about x -172, east
 *   about x 185).
 * - Photos (evidence, Wikimedia Commons):
 *   - Steve Morgan, "Sellwood Bridge on a warm day with kayakers on river,
 *     July 2017.jpg", CC BY-SA 4.0 (from the south-west: the three arches,
 *     the paired ribs, the spandrel columns, the piers, the red paint, the
 *     grey deck edge):
 *     https://commons.wikimedia.org/wiki/File:Sellwood_Bridge_on_a_warm_day_with_kayakers_on_river,_July_2017.jpg
 *   - Steve Morgan, "New Sellwood Bridge in September 2016.jpg", CC BY-SA 4.0
 *     (the arches from the river bank):
 *     https://commons.wikimedia.org/wiki/File:New_Sellwood_Bridge_in_September_2016.jpg
 *
 * Numbers
 * - Measured: the roadway heights above; the pier and bent positions from
 *   the OSM outline.
 * - Estimated from the photos: the arches spring 4.5 m above the water, their
 *   crowns 2.6 m under the road; the ribs 7 m either side of the deck's
 *   centre, 1.6 m wide and 3 m deep; spandrel columns about 13 m apart;
 *   the deck edge 1.8 m deep with a 0.9 m parapet. The west arch's
 *   springing (x -178) and the east one's (x 167.6) are taken one bent
 *   spacing from the first notch and symmetric with it.
 * - Estimated: the interchange ramps descend from the deck to about 11.5 m
 *   at their far ends (the ground along Highway 43).
 * - The road surfaces are the map's; the model draws the deck's edges,
 *   parapets and underside, and leaves the top open.
 *
 * Doubts
 * - The spans are read from the outline, not from drawings; the published
 *   main span (about 137 m) is a little longer than the 129.5 m here.
 * - The interchange ramps' heights are estimated, not measured.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function poly(p: Part, P: V3[], n: V3) {
  let f: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    f = [f[0] + c[0], f[1] + c[1], f[2] + c[2]]
  }
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  poly(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  poly(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  poly(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  poly(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  poly(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (bottom) poly(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
}

const RING: XY[] = [[332.2,-7.8],[332.2,-7.0],[360.7,-6.7],[367.9,-7.3],[367.0,-4.8],[363.3,5.5],[360.0,14.8],[359.4,16.4],[331.1,15.3],[331.1,16.2],[330.1,16.1],[330.2,15.2],[302.9,14.0],[301.9,15.1],[300.0,15.1],[298.7,13.8],[269.6,12.5],[268.7,13.8],[266.7,13.8],[265.6,12.5],[236.7,12.1],[235.4,13.6],[233.4,13.6],[232.1,12.1],[203.7,12.2],[202.2,13.7],[200.2,13.7],[198.7,12.2],[64.4,12.3],[63.5,13.4],[62.4,14.5],[61.1,15.0],[59.5,15.2],[58.0,14.9],[56.7,14.2],[55.7,13.3],[55.0,12.3],[34.0,12.3],[-43.7,16.4],[-65.2,16.4],[-65.9,17.5],[-66.8,18.6],[-68.2,19.2],[-69.8,19.4],[-71.3,19.1],[-72.6,18.4],[-73.5,17.5],[-74.3,16.4],[-187.8,16.5],[-193.2,17.1],[-197.6,18.1],[-201.8,19.6],[-205.3,21.2],[-207.8,22.5],[-211.2,24.7],[-216.3,29.1],[-219.0,32.7],[-220.9,36.6],[-229.6,79.6],[-231.7,79.1],[-237.9,77.6],[-240.3,77.1],[-231.7,34.4],[-230.0,20.9],[-236.3,16.5],[-251.2,16.6],[-251.0,15.0],[-250.5,11.3],[-250.4,10.7],[-249.4,3.2],[-248.2,-5.7],[-248.1,-6.3],[-247.7,-9.4],[-247.4,-11.8],[-227.0,-11.6],[-225.9,-16.3],[-223.2,-49.9],[-219.0,-73.6],[-214.4,-122.0],[-211.4,-121.7],[-205.6,-121.1],[-209.6,-72.9],[-207.5,-72.8],[-207.8,-70.3],[-208.2,-66.2],[-210.8,-29.4],[-210.3,-25.0],[-209.6,-21.6],[-208.1,-18.8],[-205.1,-16.1],[-198.6,-13.6],[-194.2,-12.5],[-187.9,-11.4],[-176.8,-10.2],[-74.4,-10.3],[-73.5,-11.3],[-72.4,-12.1],[-71.2,-12.8],[-69.7,-13.1],[-68.4,-12.9],[-67.2,-12.2],[-66.1,-11.4],[-65.1,-10.2],[-43.7,-10.2],[33.9,-6.7],[55.2,-6.5],[56.0,-7.6],[57.0,-8.5],[58.2,-9.3],[59.5,-9.5],[61.1,-9.3],[62.5,-8.5],[63.5,-7.7],[64.4,-6.6],[198.9,-6.6],[200.2,-8.4],[202.4,-8.5],[203.8,-6.6],[232.1,-6.9],[233.4,-8.1],[235.4,-8.1],[236.7,-6.9],[265.8,-6.9],[266.8,-8.2],[268.8,-8.2],[269.7,-6.9],[298.8,-6.8],[300.0,-8.2],[302.0,-8.2],[302.9,-6.8],[331.2,-7.0],[331.3,-7.8]]

// The roadway above the water (lidar), by x.
const ROAD: XY[] = [[-252, 22.9], [-195, 23.1], [-146, 24.6], [-106, 26.3], [-51, 28.7], [-1, 30.7], [34, 31.7], [60, 32.2], [89, 32.5], [116, 32.6], [145, 32.4], [173, 32.0], [201, 31.3], [235, 30.4], [268, 29.6], [301, 28.7], [332, 27.9], [368, 27.0]]
// The ground under the east approach (lidar), by x.
const GROUND: XY[] = [[173, 0], [201, 10.2], [235, 14.8], [268, 16.7], [301, 18.5], [332, 18.8], [364, 26.0], [370, 26.0]]
const interp = (T: XY[], x: number) => {
  if (x <= T[0][0]) return T[0][1]
  for (let i = 0; i < T.length - 1; i++) if (x <= T[i + 1][0]) return T[i][1] + ((x - T[i][0]) / (T[i + 1][0] - T[i][0])) * (T[i + 1][1] - T[i][1])
  return T[T.length - 1][1]
}
const road = (x: number) => interp(ROAD, x)
/** The deck's top: the road, or on the west interchange ramps falling toward their far ends. */
const deckZ = (x: number, y: number) => {
  if (x > -188) return road(x)
  const top = road(-195)
  if (y > 20) return top - (Math.min(y, 80) - 20) / 60 * 11.5
  if (y < -14) return top - (Math.min(-y, 122) - 14) / 108 * 11.5
  return top
}

const steel = new Part()     // red-painted steel: ribs, bracing, spandrel columns
const concrete = new Part()  // deck edge, parapets, underside, piers, bents

const DEPTH = 1.8, PARAPET = 0.9, YC = 3.0, RIB = 7.0

// --- the deck edge and parapet round the whole outline, split into short
// pieces so they follow the road's grade
{
  const n = RING.length
  // counter-clockwise check
  const a = RING.reduce((s, p, i) => { const q = RING[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const R = a > 0 ? RING : [...RING].reverse()
  for (let i = 0; i < n; i++) {
    const A = R[i], B = R[(i + 1) % n], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const k = Math.max(1, Math.ceil(L / 10))
    const t: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o: XY = [t[1], -t[0]]
    for (let j = 0; j < k; j++) {
      const P = (u: number): XY => [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u]
      const p0 = P(j / k), p1 = P((j + 1) / k)
      const z0 = deckZ(p0[0], p0[1]), z1 = deckZ(p1[0], p1[1])
      const th = 0.35, i0: XY = [p0[0] - o[0] * th, p0[1] - o[1] * th], i1: XY = [p1[0] - o[0] * th, p1[1] - o[1] * th]
      poly(concrete, [[p0[0], p0[1], z0 - DEPTH], [p1[0], p1[1], z1 - DEPTH], [p1[0], p1[1], z1 + PARAPET], [p0[0], p0[1], z0 + PARAPET]], [o[0], o[1], 0])
      poly(concrete, [[i0[0], i0[1], z0 - DEPTH + 0.6], [i1[0], i1[1], z1 - DEPTH + 0.6], [i1[0], i1[1], z1 + PARAPET], [i0[0], i0[1], z0 + PARAPET]], [-o[0], -o[1], 0])
      poly(concrete, [[p0[0], p0[1], z0 + PARAPET], [p1[0], p1[1], z1 + PARAPET], [i1[0], i1[1], z1 + PARAPET], [i0[0], i0[1], z0 + PARAPET]], [0, 0, 1])
    }
  }
}
// the deck's underside along the main bridge (faces down only; the top stays open)
for (let x = -188; x < 368; x += 8) {
  const xb = Math.min(368, x + 8)
  const ya = YC - 9.8, yb = YC + 9.8
  poly(concrete, [[x, ya, road(x) - DEPTH], [xb, ya, road(xb) - DEPTH], [xb, yb, road(xb) - DEPTH], [x, yb, road(x) - DEPTH]], [0, 0, -1])
}

// --- the arches: two red box ribs per span, braced, with spandrel columns
const SPANS: XY[] = [[-178, -70], [-70, 59.5], [59.5, 167.6]]
const SPRING = 4.5
function rib(xa: number, xb: number, y: number) {
  const xm = (xa + xb) / 2, crown = road(xm) - DEPTH - 0.8
  const zAt = (x: number) => { const t = (x - xa) / (xb - xa); return SPRING + (crown - SPRING) * 4 * t * (1 - t) + (road(x) - road(xm)) * 4 * t * (1 - t) }
  const N = 16, w = 0.8, d = 1.5
  const pts = Array.from({ length: N + 1 }, (_, k) => xa + ((xb - xa) * k) / N)
  for (let k = 0; k < N; k++) {
    const x0 = pts[k], x1 = pts[k + 1], z0 = zAt(x0), z1 = zAt(x1)
    const up: V3 = [-(z1 - z0) / (x1 - x0), 0, 1]
    poly(steel, [[x0, y - w, z0 + d], [x1, y - w, z1 + d], [x1, y + w, z1 + d], [x0, y + w, z0 + d]], up)
    poly(steel, [[x0, y - w, z0 - d], [x1, y - w, z1 - d], [x1, y + w, z1 - d], [x0, y + w, z0 - d]], [-up[0], 0, -1])
    poly(steel, [[x0, y - w, z0 - d], [x1, y - w, z1 - d], [x1, y - w, z1 + d], [x0, y - w, z0 + d]], [0, -1, 0])
    poly(steel, [[x0, y + w, z0 - d], [x1, y + w, z1 - d], [x1, y + w, z1 + d], [x0, y + w, z0 + d]], [0, 1, 0])
  }
  return zAt
}
for (const [xa, xb] of SPANS) {
  const zN = rib(xa, xb, YC + RIB)
  rib(xa, xb, YC - RIB)
  const n = Math.round((xb - xa) / 13)
  for (let k = 1; k < n; k++) {
    const x = xa + ((xb - xa) * k) / n, za = zN(x) + 1.5, zt = road(x) - DEPTH
    if (zt - za > 1.0) for (const s of [-1, 1]) box(steel, x - 0.55, YC + s * RIB - 0.55, x + 0.55, YC + s * RIB + 0.55, za - 0.3, zt)
    // cross-bracing between the ribs, every other column
    if (k % 2 === 1) box(steel, x - 0.4, YC - RIB, x + 0.4, YC + RIB, zN(x) - 0.4, zN(x) + 0.4, true)
    box(steel, x - 0.6, YC - RIB - 1.2, x + 0.6, YC + RIB + 1.2, zt - 0.6, zt, true)   // the floor beam
  }
}

// --- piers: concrete blocks the arches spring from; a red bent up from
// each to the deck
for (const x of [-178, -70, 59.5, 167.6]) {
  const river = x > -175 && x < 165
  box(concrete, x - (river ? 7 : 4.5), YC - RIB - 3.5, x + (river ? 7 : 4.5), YC + RIB + 3.5, 0, SPRING - 0.5)
  box(concrete, x - (river ? 4 : 3), YC - RIB - 2.2, x + (river ? 4 : 3), YC + RIB + 2.2, SPRING - 0.5, SPRING + 1.8)
  for (const s of [-1, 1]) box(steel, x - 0.9, YC + s * RIB - 0.9, x + 0.9, YC + s * RIB + 0.9, SPRING + 1.8, road(x) - DEPTH)
  box(steel, x - 0.9, YC - RIB - 1.2, x + 0.9, YC + RIB + 1.2, road(x) - DEPTH - 1.0, road(x) - DEPTH, true)
}

// --- the east approach's bents (at the outline's notches), down to the ground
for (const x of [200.8, 234.4, 267.7, 300.9, 331.2]) {
  const g = interp(GROUND, x) - 0.5, zt = road(x) - DEPTH
  for (const s of [-1, 1]) box(concrete, x - 0.8, YC + s * 5.5 - 0.8, x + 0.8, YC + s * 5.5 + 0.8, g, zt - 1.2)
  box(concrete, x - 0.9, YC - 8.5, x + 0.9, YC + 8.5, zt - 1.2, zt, true)
}
// the west abutment and the interchange's columns
box(concrete, -194, YC - 11, -188, YC + 11, 10.5, road(-190) - DEPTH)
for (const [x, y] of [[-240, 50], [-224, 50], [-222, -45], [-207, -45], [-235, 3], [-215, 3]] as XY[]) {
  const zt = deckZ(x, y) - DEPTH
  box(concrete, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 10.5, zt)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: steel, material: finish('sellwood-red', 0xbd5841) },
  { part: concrete, material: finish('sellwood-concrete', 0xc9c6c0) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sellwood Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 33.5,
})
await Bun.write(new URL('../models/pdx-sellwood-bridge.glb', import.meta.url), glb)
console.log(`pdx-sellwood-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
