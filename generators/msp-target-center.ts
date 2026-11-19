/**
 * Target Center (1990, KMR Architects; renovated 2017), Minneapolis:
 * procedural, CC0-1.0.
 * bun generators/msp-target-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM way/23125943. y = 0 is the map's lowest terrain under the
 * footprint, 254.2 m, on the north side (Mapterhorn; tools/terrain.ts);
 * the street on the south-east (1st Ave N) is about 4-5 m higher.
 *
 * Form: an octagonal arena drum. Pale precast walls with brown checkerboard
 * brick towers at the corners, each with a round grey disc near its top
 * (the 1990 design), a glazed concourse band in the long faces, and a
 * dark sloped metal edge running up to the large green roof. The 1st Ave
 * (south-east) face is the 2017 re-cladding in dark brown horizontal
 * panels, and the corner of 1st Ave and 6th St (east) has the renovation's
 * glass entrance atrium.
 *
 * Measured (USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, 1 m grid, read
 * with class 18 kept; ground_min 250.7 m):
 * - the octagon: its eight edges from the roof's outline (north edge y =
 *   64.2, east x = 66, south y = -63.8, west x = -63, and the four
 *   45-degree diagonals), 129 x 128 m, within 2 m of the OSM outline;
 * - the green roof at 299.7 m, 45.5 m above y = 0 and 40.4 m above the
 *   1st Ave street (OSM height 41); the edge falling to about 293.5 m at
 *   the wall line, so a sloped band about 5 m wide;
 * - the entrance atrium at the east corner, roof 282.7 m (28.5 m here).
 * From OSM way/23125943: the atrium's wedge plan (the bump at the east
 *   corner of the outline).
 * From NAIP (USDA, public domain): the green roof with its dark edge band.
 * From photos: the colours (warm pale precast, pinkish-brown brick in a
 *   checkerboard, grey discs, the dark brown re-cladding with its grey
 *   standing-seam edge); the towers at the corners; the glazed band.
 * Estimated: the towers' width (10 m) and height, the discs' size (7 m
 *   across) and height, the brick base (6 m), the glazed band (10-14 m),
 *   the white upper band's depth (30.5 m up, 1.5 m out), the atrium's
 *   glazing.
 * Left out: the skyways (separate bridges to the ramps and to Mayo Clinic
 *   Square), signs and the Spot sculpture, the paths across the green roof,
 *   the street-level canopies.
 *
 * Photos (Wikimedia Commons):
 * - Tony Webster, "Target Center in Minneapolis, Minnesota (49113411356).jpg",
 *   CC BY 2.0, 2019, the re-clad 1st Ave face:
 *   https://commons.wikimedia.org/wiki/File:Target_Center_in_Minneapolis,_Minnesota_(49113411356).jpg
 * - Runner1928, "Target Center exterior 02.jpg", CC BY-SA 4.0, 2016, from
 *   Target Plaza (north-north-west): https://commons.wikimedia.org/wiki/File:Target_Center_exterior_02.jpg
 * - Runner1928, "Target Center exterior 01.jpg", CC BY-SA 4.0, 2016, from
 *   the south-south-west: https://commons.wikimedia.org/wiki/File:Target_Center_exterior_01.jpg
 * - Jeramey Jannene, "Target Center 2013.jpg", CC BY 2.0:
 *   https://commons.wikimedia.org/wiki/File:Target_Center_2013.jpg
 * - Tony Webster, "Target Center, Minneapolis - Spot the Dog Sign
 *   (28037908911).jpg", CC BY 2.0, 2016, the roof edge from the north:
 *   https://commons.wikimedia.org/wiki/File:Target_Center,_Minneapolis_-_Spot_the_Dog_Sign_(28037908911).jpg
 * - "Target Center.jpg", public domain (Commons, no author given), the
 *   precast and checkerboard towers: https://commons.wikimedia.org/wiki/File:Target_Center.jpg
 * Doubts: most licensed photos predate the 2017 renovation; only the 2019
 *   close-up shows the new cladding, so its extent (the 1st Ave face and the
 *   atrium's sides) is inferred, and the atrium's glazing rests on the
 *   lidar box and the OSM wedge, not a photo. The towers' and discs'
 *   positions are generalised to every corner off the 1st Ave face.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const precast = new Part(), brick = new Part(), clad = new Part(), green = new Part(), glass = new Part(), grey = new Part()
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, P: V3[], hint: V3) {
  const n = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(n, hint) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
type XY = [number, number]
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const outN = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, (a[0] - b[0]) / l] }

// The octagon (lidar roof outline), counter-clockwise from the north edge.
const O: XY[] = [[32, 64.2], [-12, 64.2], [-63, 13.2], [-63, -32.8], [-32, -63.8], [10, -63.8], [66, -7.8], [66, 30.2]]
const WALL = 39.5, ROOF = 45.5, INSET = 5
const SE = 5 // index of the south-east (1st Ave) face, O[5] -> O[6]
const EAST = 6 // the east face, O[6] -> O[7], behind the atrium
const reclad = (i: number) => i === SE || i === EAST

// walls
for (let i = 0; i < 8; i++) {
  const a = O[i], b = O[(i + 1) % 8], n = outN(a, b)
  face(reclad(i) ? clad : precast, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL]], [n[0], n[1], 0])
}
// the sloped metal edge and the green roof
const inner: XY[] = O.map((p, i) => {
  const a = O[(i + 7) % 8], b = O[(i + 1) % 8]
  const n1 = outN(a, p), n2 = outN(p, b), m: XY = [n1[0] + n2[0], n1[1] + n2[1]]
  const k = INSET / (1 + n1[0] * n2[0] + n1[1] * n2[1])
  return [p[0] - m[0] * k, p[1] - m[1] * k]
})
for (let i = 0; i < 8; i++) {
  const j = (i + 1) % 8, n = outN(O[i], O[j])
  face(clad, [[O[i][0], O[i][1], WALL], [O[j][0], O[j][1], WALL], [inner[j][0], inner[j][1], ROOF], [inner[i][0], inner[i][1], ROOF]], [n[0], n[1], 1])
}
face(green, inner.map(([x, y]) => [x, y, ROOF] as V3), [0, 0, 1])

// On each precast face: the brick base at street level, the dark glazed
// band above it, and the white upper band cantilevered 1.5 m out between
// the corner towers (the south-south-west photo).
for (let i = 0; i < 8; i++) {
  if (reclad(i)) continue
  const a = O[i], b = O[(i + 1) % 8], n = outN(a, b)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const towerA = !reclad((i + 7) % 8), towerB = !reclad((i + 1) % 8)
  const t0 = (towerA ? 7 : 0) / L, t1 = 1 - (towerB ? 7 : 0) / L
  const p = (t: number, z: number, out = 0.06): V3 => { const q = lerp2(a, b, t); return [q[0] + n[0] * out, q[1] + n[1] * out, z] }
  const N: V3 = [n[0], n[1], 0]
  face(brick, [p(0, 0), p(1, 0), p(1, 6), p(0, 6)], N)
  const m = 10 / L
  face(glass, [p(m, 10), p(1 - m, 10), p(1 - m, 14), p(m, 14)], N)
  const o = 1.5, z0 = 30.5, z1 = WALL
  face(precast, [p(t0, z0, o), p(t1, z0, o), p(t1, z1, o), p(t0, z1, o)], N)
  face(precast, [p(t0, z0, 0), p(t1, z0, 0), p(t1, z0, o), p(t0, z0, o)], [0, 0, -1])
  face(precast, [p(t0, z1, 0), p(t0, z1, o), p(t1, z1, o), p(t1, z1, 0)], [0, 0, 1])
  const d: V3 = [b[0] - a[0], b[1] - a[1], 0]
  face(precast, [p(t0, z0, 0), p(t0, z0, o), p(t0, z1, o), p(t0, z1, 0)], [-d[0], -d[1], 0])
  face(precast, [p(t1, z0, 0), p(t1, z0, o), p(t1, z1, o), p(t1, z1, 0)], d)
}
// the 1st Ave face: two long bands of the re-cladding's darker reveal and a
// glazed street front
{
  const a = O[SE], b = O[SE + 1], n = outN(a, b)
  const p = (t: number, z: number): V3 => { const q = lerp2(a, b, t); return [q[0] + n[0] * 0.06, q[1] + n[1] * 0.06, z] }
  face(glass, [p(0.06, 5), p(0.94, 5), p(0.94, 11), p(0.06, 11)], [n[0], n[1], 0])
  face(grey, [p(0, 33), p(1, 33), p(1, 34.2), p(0, 34.2)], [n[0], n[1], 0])
}

// brick towers at the corners (off the 1st Ave face), squared across the
// corner, each with a grey disc near the top
for (let i = 0; i < 8; i++) {
  const prev = (i + 7) % 8
  if (reclad(i) || reclad(prev)) continue
  const p = O[i], a = O[prev], b = O[(i + 1) % 8]
  const n1 = outN(a, p), n2 = outN(p, b)
  const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(...m), u: XY = [m[0] / ml, m[1] / ml], s: XY = [-u[1], u[0]]
  const W = 5, D = 1.2, H = 41.5
  // the tower's front sits 1.2 m out from the corner; its sides run back
  // into the two walls
  const c: XY = [p[0] + u[0] * D, p[1] + u[1] * D]
  const f0: XY = [c[0] - s[0] * W, c[1] - s[1] * W], f1: XY = [c[0] + s[0] * W, c[1] + s[1] * W]
  const back = 7
  const b0: XY = [f0[0] - u[0] * back, f0[1] - u[1] * back], b1: XY = [f1[0] - u[0] * back, f1[1] - u[1] * back]
  face(brick, [[f0[0], f0[1], 0], [f1[0], f1[1], 0], [f1[0], f1[1], H], [f0[0], f0[1], H]], [u[0], u[1], 0])
  face(brick, [[f1[0], f1[1], 0], [b1[0], b1[1], 0], [b1[0], b1[1], H], [f1[0], f1[1], H]], [s[0], s[1], 0])
  face(brick, [[b0[0], b0[1], 0], [f0[0], f0[1], 0], [f0[0], f0[1], H], [b0[0], b0[1], H]], [-s[0], -s[1], 0])
  face(brick, [[f0[0], f0[1], H], [f1[0], f1[1], H], [b1[0], b1[1], H], [b0[0], b0[1], H]], [0, 0, 1])
  // checkerboard: paler precast squares on the front, two columns
  for (let r = 0; r < 6; r++) for (let k = 0; k < 2; k++) {
    if ((r + k) % 2) continue
    const t0 = k * 0.5 + 0.04, t1 = t0 + 0.42, z0 = 4 + r * 4.6, z1 = z0 + 4.2
    const q = (t: number, z: number): V3 => { const x = lerp2(f0, f1, t); return [x[0] + u[0] * 0.05, x[1] + u[1] * 0.05, z] }
    face(precast, [q(t0, z0), q(t1, z0), q(t1, z1), q(t0, z1)], [u[0], u[1], 0])
  }
  // the disc
  const R = 3.5, zc = 35, N = 14
  const ctr: V3 = [c[0] + u[0] * 0.08, c[1] + u[1] * 0.08, zc]
  const ring: V3[] = []
  for (let k = 0; k < N; k++) {
    const t = (2 * Math.PI * k) / N
    ring.push([ctr[0] + s[0] * R * Math.cos(t), ctr[1] + s[1] * R * Math.cos(t), zc + R * Math.sin(t)])
  }
  face(grey, ring, [u[0], u[1], 0])
}

// Two more towers in the long north-west face, facing Target Plaza (the
// north-north-west photo shows four across it), with their discs.
{
  const i = 1, a = O[i], b = O[i + 1], n = outN(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (const t of [0.36, 0.64]) {
    const c = lerp2(a, b, t), W = 5.5, D = 2, H = 41.5
    const P = (s: number, d: number, z: number): V3 => [c[0] + u[0] * s + n[0] * d, c[1] + u[1] * s + n[1] * d, z]
    face(brick, [P(-W, D, 0), P(W, D, 0), P(W, D, H), P(-W, D, H)], [n[0], n[1], 0])
    face(brick, [P(W, D, 0), P(W, 0, 0), P(W, 0, H), P(W, D, H)], [u[0], u[1], 0])
    face(brick, [P(-W, 0, 0), P(-W, D, 0), P(-W, D, H), P(-W, 0, H)], [-u[0], -u[1], 0])
    face(brick, [P(-W, D, H), P(W, D, H), P(W, 0, H), P(-W, 0, H)], [0, 0, 1])
    for (let r = 0; r < 6; r++) for (let k = 0; k < 2; k++) {
      if ((r + k) % 2) continue
      const s0 = -W + k * W + 0.4, s1 = s0 + W - 0.8, z0 = 4 + r * 4.6, z1 = z0 + 4.2
      face(precast, [P(s0, D + 0.05, z0), P(s1, D + 0.05, z0), P(s1, D + 0.05, z1), P(s0, D + 0.05, z1)], [n[0], n[1], 0])
    }
    const R = 3.5, N = 14, ring: V3[] = []
    for (let k = 0; k < N; k++) { const q = (2 * Math.PI * k) / N; ring.push(P(R * Math.cos(q), D + 0.08, 35 + R * Math.sin(q))) }
    face(grey, ring, [n[0], n[1], 0])
  }
}

// the glass entrance atrium at the east corner (OSM wedge, lidar height)
{
  const A: XY[] = [[66, -4.5], [70.8, -4.5], [85.1, 9.6], [70.4, 24], [66, 24]]
  const H = 28.5
  for (let i = 0; i < A.length - 1; i++) {
    const a = A[i], b = A[i + 1], n = outN(a, b)
    face(glass, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H - 1.5], [a[0], a[1], H - 1.5]], [n[0], n[1], 0])
    face(clad, [[a[0], a[1], H - 1.5], [b[0], b[1], H - 1.5], [b[0], b[1], H], [a[0], a[1], H]], [n[0], n[1], 0])
    // mullions every few metres, as the glazing reads in bays
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / 6))
    for (let m = 1; m < k; m++) {
      const q = lerp2(a, b, m / k), d: XY = [(b[0] - a[0]) / L * 0.25, (b[1] - a[1]) / L * 0.25]
      face(grey, [[q[0] - d[0] + n[0] * 0.08, q[1] - d[1] + n[1] * 0.08, 0], [q[0] + d[0] + n[0] * 0.08, q[1] + d[1] + n[1] * 0.08, 0],
        [q[0] + d[0] + n[0] * 0.08, q[1] + d[1] + n[1] * 0.08, H - 1.5], [q[0] - d[0] + n[0] * 0.08, q[1] - d[1] + n[1] * 0.08, H - 1.5]], [n[0], n[1], 0])
    }
  }
  face(clad, A.map(([x, y]) => [x, y, H] as V3), [0, 0, 1])
}

const parts = [
  { part: precast, material: finish('tc-precast', 0xe7e1d6) },
  { part: brick, material: finish('tc-brick', 0xa98b7f) },
  { part: clad, material: finish('tc-cladding', 0x74675f) },
  { part: green, material: finish('green-roof', 0x8d9c6c) },
  { part: glass, material: PALETTE.window },
  { part: grey, material: finish('tc-metal', 0x9aa0a6) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Target Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ROOF,
})
if (import.meta.main) {
  await Bun.write(new URL('../models/msp-target-center.glb', import.meta.url), glb)
  console.log(`msp-target-center.glb: ${triangles} triangles, ${glb.length} bytes`)
}
