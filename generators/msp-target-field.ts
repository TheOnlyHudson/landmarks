/**
 * Target Field (2010, HOK Sport / Populous), Minneapolis: procedural, CC0-1.0.
 * bun generators/msp-target-field.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM relation/2203690 (building=stadium). Home plate is at the
 * west, about (-38, 0), and the field opens east-north-east: left field is
 * to the north-east, right field to the south-east. Heights are above the
 * lidar ground_min (249.5 m NAVD88), which is the rail cut on the west and
 * north-west that the ballpark was built over; the map's terrain puts its
 * lowest point under the footprint within 0.1 m of it, and the field stands
 * about 2 m above it. The streets on the north-east and the plaza side are
 * 7 to 11 m higher, so the ballpark's outfield walls run down into them.
 * Elevation 0: the field is not dug below its lowest neighbour (the tracks).
 *
 * Form, as a swept profile round a centre at (10, 0): from the field wall
 * up the lower bowl, the club and suite faces, the upper deck, its back
 * wall, the concourse roof and the Kasota limestone outer wall. Round the
 * infield (bearings from the centre of 88 to 282 degrees, counter-clockwise
 * from east) the white canopy floats on posts over the upper deck. The
 * outfield: the left-field bleachers under the big scoreboard and its light
 * rig, the low batter's eye in centre, the right-field seats stepping up to
 * the deck that overhangs the warning track, and the two corner blocks.
 *
 * Measured (USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, 1 m surface
 * model; radial profiles from the centre every 5 degrees):
 * - the canopy: its front and back radii at every 5 degrees (the table
 *   CANOPY), top 47 m at its front edge and 46 m at its back, about 45 m
 *   above the field; it ends at 88 and 282 degrees;
 * - the outer wall's radius (ro in CANOPY) and the concourse roof behind the
 *   upper deck, 29-33 m;
 * - the lower bowl rising from 3 to 9 m, the club step at 14-15 m, the upper
 *   deck's front at 26 m;
 * - the scoreboard: a 34 m blade from (86.4, 58.8) to (104.3, 29.4), its
 *   light rig topping out at 63.8 m (62 m above the field);
 * - the left-field bleachers 16 to 29 m, the right-field seats rising to the
 *   overhanging deck at 35-37 m, the batter's eye at 20-23 m, the
 *   north corner block at 34-38 m.
 * From OSM relation/2203690: the field (its inner ring), which places the
 *   front of the stands; the outer ring agrees with the lidar's outer wall
 *   within a few metres except where it takes in gates, plazas and ramps.
 * From photos: the colours (warm Kasota limestone, the white canopy, dark
 *   green seats, grey steel and cladding on the scoreboard's back, glass
 *   in the club and suite faces); the scoreboard split into board, sign and
 *   rig; the canopy carried on posts above the concourse.
 * Estimated: the split of the scoreboard's height between board (32-50 m),
 *   sign and rig (from the Ken Lund photo); the glazed band on the outer
 *   wall (18-26 m) and its bay spacing; the canopy's thickness (2 m) and the
 *   posts' spacing; the outfield profiles between the lidar's readings.
 * Left out: the field and turf (the map's), the seats' rows and aisles, the
 *   lettering and logos, the light fittings along the canopy, the Minnie and
 *   Paul sign, the flag poles, Target Plaza and its bridge over I-394, the
 *   Northstar platform under the north-west side, the parking ramps.
 *
 * Photos:
 * - Lectrician2, "Target Field Aerial.jpg", CC BY-SA 4.0, drone from the east:
 *   https://commons.wikimedia.org/wiki/File:Target_Field_Aerial.jpg
 * - kla4067, "Target Field, Minneapolis, MN", CC BY 2.0, from a plane, south-east:
 *   https://www.flickr.com/photos/84263554@N00/3942034207
 * - Mac H (media601), "Target Field, Minneapolis", CC BY-SA 2.0, the plaza
 *   side from the east: https://www.flickr.com/photos/11375428@N04/34595384524
 * - Sharon Mollerus, "Target Field, Minneapolis 6/20/23", CC BY 2.0, the
 *   scoreboard's back from 5th St N: https://www.flickr.com/photos/38315261@N00/52993331304
 * - Jerry Huddleston, "Target Field (4051860538).jpg", CC BY 2.0, the
 *   north-west side over the Northstar platform:
 *   https://commons.wikimedia.org/wiki/File:Target_Field_(4051860538).jpg
 * - Ken Lund, "Target Field, Minneapolis, Minnesota (43167053335).jpg",
 *   CC BY-SA 2.0, the bowl and scoreboard from the upper deck:
 *   https://commons.wikimedia.org/wiki/File:Target_Field,_Minneapolis,_Minnesota_(43167053335).jpg
 * - Michael Hicks, "Target Field-20100730.jpg", CC BY 2.0, the outfield at night:
 *   https://commons.wikimedia.org/wiki/File:Target_Field-20100730.jpg
 * - Schwerdf, "Target Field and skyline 2014-05-14.jpg", CC BY 4.0:
 *   https://commons.wikimedia.org/wiki/File:Target_Field_and_skyline_2014-05-14.jpg
 * - Tony Webster, "Target Field - Minnesota Twins Baseball Park and Stadium,
 *   Minnesota (47827858372).jpg", CC BY-SA 2.0, the limestone at gate 14:
 *   https://commons.wikimedia.org/wiki/File:Target_Field_-_Minnesota_Twins_Baseball_Park_and_Stadium,_Minnesota_(47827858372).jpg
 * - Tony Webster, "Target Field, Minneapolis - Minnesota Twins Stadium
 *   (28037934671).jpg", CC BY 2.0, the scoreboard's back:
 *   https://commons.wikimedia.org/wiki/File:Target_Field,_Minneapolis_-_Minnesota_Twins_Stadium_(28037934671).jpg
 * - Chad Davis, "Target Field, Minneapolis (51981334827).jpg", CC BY 2.0,
 *   the scoreboard's back at night:
 *   https://commons.wikimedia.org/wiki/File:Target_Field,_Minneapolis_(51981334827).jpg
 * Doubts: no licensed street photo of the south-west (behind home plate,
 *   over the tracks) side close up; it is drawn like the north-west. The
 *   outer wall is one limestone face with a glazed band; the real one steps
 *   in and out at the gates and has more glass on the plaza side.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const seats = new Part(), glazing = new Part(), metal = new Part(), stone = new Part(), canopy = new Part(), board = new Part()
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar quad or triangle, wound to face `hint`; zero-area ones skipped. */
function face(p: Part, P: V3[], hint: V3) {
  const n = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const n2 = P.length > 3 ? cross(sub(P[2], P[0]), sub(P[3], P[0])) : n
  const s = dot(n, hint) + dot(n2, hint)
  const Q = s >= 0 ? P : [...P].reverse()
  const area = (a: V3, b: V3, c: V3) => Math.hypot(...cross(sub(b, a), sub(c, a)))
  if (area(Q[0], Q[1], Q[2]) > 1e-4) p.tri(Q[0], Q[1], Q[2])
  if (Q.length > 3 && area(Q[0], Q[2], Q[3]) > 1e-4) p.tri(Q[0], Q[2], Q[3])
}

// ------------------------------------------------------------ the plan ---
const C: [number, number] = [10, 0]
// The field (OSM relation/2203690's inner ring), counter-clockwise.
const FIELD: [number, number][] = [[32.0, 70.4], [35.7, 71.3], [74.1, 35.9], [88.9, 12.6], [87.1, -8.9], [90.7, -9.6], [86.4, -16.5], [83.3, -15.1], [59.9, -51.3], [56.9, -49.1], [41.1, -65.1], [32.2, -72.4], [10.6, -51.9], [-7.9, -46.0], [-18.7, -39.2], [-48.4, -8.7], [-50.4, -5.7], [-51.2, -0.9], [-50.0, 3.2], [-47.6, 7.1], [-8.6, 46.2], [2.5, 52.9], [20.8, 58.8]]
/** Distance from the centre to the field's edge at bearing `a` (degrees, CCW from east). */
function fieldR(a: number) {
  const t = (a * Math.PI) / 180, dx = Math.cos(t), dy = Math.sin(t)
  let best = 0
  for (let i = 0; i < FIELD.length; i++) {
    const [x1, y1] = FIELD[i], [x2, y2] = FIELD[(i + 1) % FIELD.length]
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const s = ((x1 - C[0]) * ey - (y1 - C[1]) * ex) / den, u = ((x1 - C[0]) * dy - (y1 - C[1]) * dx) / den
    if (s > 0 && u >= 0 && u <= 1) best = Math.max(best, s)
  }
  return best
}
// The canopy's front and back radii and the outer wall's, every 5 degrees
// from 90 to 280 (lidar; two outer-wall readings over gates replaced by
// their neighbours').
const CANOPY: [number, number, number, number][] = [
  [90, 101.5, 110, 121], [95, 97.5, 110, 118], [100, 94.5, 110.5, 117.5], [105, 92.5, 109.5, 116.5],
  [110, 88.5, 108.5, 112], [115, 87.5, 107, 110.5], [120, 85.5, 106, 112], [125, 84, 104.5, 110],
  [130, 82.5, 104, 110], [135, 83.5, 104.5, 110], [140, 84, 104, 110], [145, 84.5, 106, 111.5],
  [150, 85.5, 108, 113], [155, 88, 110, 114.5], [160, 90.5, 112.5, 117], [165, 93, 114.5, 120],
  [170, 94.5, 116.5, 121.5], [175, 96.5, 117, 122], [180, 97.5, 118, 122.5], [185, 96.5, 117, 122],
  [190, 95.5, 117.5, 120.5], [195, 94.5, 115.5, 119.5], [200, 92, 114, 118], [205, 90, 112.5, 115.5],
  [210, 88, 109.5, 112], [215, 85.5, 108, 110], [220, 85, 107, 110], [225, 85, 106, 110],
  [230, 85, 105.5, 109], [235, 85.5, 106, 111.5], [240, 85.5, 106, 113], [245, 86.5, 107, 115.5],
  [250, 87.5, 108.5, 117], [255, 89, 109.5, 118], [260, 90.5, 110.5, 119.5], [265, 93.5, 111, 117],
  [270, 96, 111.5, 117.5], [275, 100.5, 112, 119], [280, 106, 112.5, 121.5],
]
type Prof = [number, number][] // ten (radius, height) points, field to street
/** The grandstand's section where the canopy is (lidar radii, heights). */
function grand(a: number, rc0: number, rc1: number, ro: number): Prof {
  const rf = fieldR(a), r2 = rf + 0.62 * (rc0 - rf), r4 = rc0 - 8, r6 = rc1 - 2
  return [[rf, 0], [rf, 3], [r2, 9], [r2, 15], [r4, 17], [r4, 26], [r6, 40], [r6, 31], [ro, 31], [ro, 0]]
}
/** The outfield and corner sections: a wall, a front face to `h3`, seats to (r6, h6), a parapet to h7, the back at ro. */
function out(a: number, h3: number, r6: number, h6: number, h7: number, ro: number): Prof {
  const rf = fieldR(a)
  // the padded wall, then the outfield's dark sign band up to the seats
  const hb = Math.min(h3, 9)
  return [[rf, 0], [rf, 3], [rf, 3], [rf, hb], [rf + 2, h3], [rf + 2, h3], [r6, h6], [r6, h7], [ro, h7], [ro, 0]]
}
const KEYS: [number, Prof][] = [
  // centre field: the batter's eye
  [-10, out(-10, 15, fieldR(-10) + 14, 22, 22, fieldR(-10) + 15)],
  [2, out(2, 15, fieldR(2) + 12, 22, 22, fieldR(2) + 13)],
  // left field: bleachers under the scoreboard
  [12, out(12, 15, 93, 27, 27, 95)],
  [25, out(25, 15, 94, 29, 29, 96)],
  [40, out(40, 16, 96, 30, 30, 98)],
  // the north corner block
  [55, out(55, 16, fieldR(55) + 22, 33, 34, 101)],
  [68, out(68, 16, fieldR(68) + 20, 33, 36, 110)],
  [80, out(80, 15, fieldR(80) + 26, 34, 37, 120)],
  [86, out(86, 15, fieldR(86) + 34, 36, 36, 122)],
  ...CANOPY.map(([a, r0, r1, ro]) => [a, grand(a, r0, r1, ro)] as [number, Prof]),
  // the south corner
  [286, out(286, 15, fieldR(286) + 32, 30, 30, 124)],
  [295, out(295, 14, fieldR(295) + 26, 28, 28, 127)],
  [305, out(305, 12, fieldR(305) + 7, 15, 15, fieldR(305) + 9)],
  // right field: seats up to the overhanging deck
  [318, out(318, 15, 99, 34, 34, 100)],
  [335, out(335, 15, 100, 36, 36, 101)],
  [347, out(347, 15, 100, 35, 35, 102)],
]
function prof(a: number): Prof {
  const A = ((a % 360) + 360) % 360
  const keys = [...KEYS.map(([k, p]) => [((k % 360) + 360) % 360, p] as [number, Prof])].sort((p, q) => p[0] - q[0])
  for (let i = 0; i < keys.length; i++) {
    const [k0, p0] = keys[i], [k1r, p1] = keys[(i + 1) % keys.length]
    const k1 = k1r <= k0 ? k1r + 360 : k1r
    const AA = A < k0 ? A + 360 : A
    if (AA >= k0 && AA <= k1) {
      const t = (AA - k0) / (k1 - k0)
      return p0.map(([r, h], j) => [r + (p1[j][0] - r) * t, h + (p1[j][1] - h) * t]) as Prof
    }
  }
  return keys[0][1]
}
const at = (a: number, r: number, h: number): V3 => {
  const t = (a * Math.PI) / 180
  return [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), h]
}

// ---------------------------------------------------------- the bowl ---
// Profile segment k (point k to k+1) and its material.
const SEG: Part[] = [seats, seats, glazing, seats, glazing, seats, metal, metal, stone]
const STEP = 4
for (let a = 0; a < 360; a += STEP) {
  const b = a + STEP, P = prof(a), Q = prof(b)
  for (let k = 0; k < 9; k++) {
    const dr = (P[k + 1][0] - P[k][0] + Q[k + 1][0] - Q[k][0]) / 2, dh = (P[k + 1][1] - P[k][1] + Q[k + 1][1] - Q[k][1]) / 2
    const m = ((a + b) / 2) * Math.PI / 180
    const hint: V3 = [-dh * Math.cos(m), -dh * Math.sin(m), dr]
    face(SEG[k], [at(a, ...P[k]), at(b, ...Q[k]), at(b, ...Q[k + 1]), at(a, ...P[k + 1])], hint)
  }
}
// The glazed band in the limestone outer wall, round the grandstand and
// corners: a panel per two bays, the stone showing between as piers. At the
// north corner, over the Northstar platform, the wall is a tall glass box
// (Huddleston photo).
for (let a = 48; a < 300; a += 2 * STEP) {
  const b = a + 2 * STEP, P = prof(a), Q = prof(b), M = prof(a + STEP)
  if (P[8][1] < 27 || Q[8][1] < 27 || M[8][1] < 27) continue
  const box = a >= 60 && a < 84
  const z0 = box ? 11 : 18, z1 = box ? Math.min(P[8][1], Q[8][1]) - 2.5 : 26, gap = box ? 0.04 : 0.12
  for (const [s0, s1, A, B] of [[a, a + STEP, P, M], [a + STEP, b, M, Q]] as [number, number, typeof P, typeof P][]) {
    const t0 = s0 === a ? gap : 0, t1 = s1 === b ? 1 - gap : 1
    const m = ((s0 + s1) / 2) * Math.PI / 180, n: V3 = [Math.cos(m), Math.sin(m), 0]
    const o = (p: V3): V3 => [p[0] + n[0] * 0.06, p[1] + n[1] * 0.06, p[2]]
    const ang = (t: number) => s0 + (s1 - s0) * t, rad = (t: number) => A[9][0] + (B[9][0] - A[9][0]) * t
    face(glazing, [o(at(ang(t0), rad(t0), z0)), o(at(ang(t1), rad(t1), z0)), o(at(ang(t1), rad(t1), z1)), o(at(ang(t0), rad(t0), z1))], n)
  }
}

// -------------------------------------------------------- the canopy ---
// From 88 to 282 degrees, tapering to a point at each end.
{
  const lo = 87, hi = 283
  const radii = (a: number): [number, number] => {
    if (a <= 90) { const t = (a - lo) / (90 - lo); const r = 101.5 + (110 - 101.5) * 0.5; return [r + (101.5 - r) * t, r + (110 - r) * t] }
    if (a >= 280) { const t = (hi - a) / (hi - 280); const r = 106 + (112.5 - 106) * 0.5; return [r + (106 - r) * t, r + (112.5 - r) * t] }
    for (let i = 0; i < CANOPY.length - 1; i++) {
      const [k0, f0, b0] = CANOPY[i], [k1, f1, b1] = CANOPY[i + 1]
      if (a >= k0 && a <= k1) { const t = (a - k0) / (k1 - k0); return [f0 + (f1 - f0) * t, b0 + (b1 - b0) * t] }
    }
    return [0, 0]
  }
  const angles: number[] = [lo, 90]
  for (let a = 92; a < 280; a += 4) angles.push(a)
  angles.push(280, hi)
  const T0 = 47, T1 = 46, U0 = 45, U1 = 44
  for (let i = 0; i < angles.length - 1; i++) {
    const a = angles[i], b = angles[i + 1], [fa, ba] = radii(a), [fb, bb] = radii(b)
    face(canopy, [at(a, fa, T0), at(b, fb, T0), at(b, bb, T1), at(a, ba, T1)], [0, 0, 1])
    face(canopy, [at(a, fa, U0), at(b, fb, U0), at(b, bb, U1), at(a, ba, U1)], [0, 0, -1])
    const m = ((a + b) / 2) * Math.PI / 180, r: V3 = [Math.cos(m), Math.sin(m), 0]
    face(canopy, [at(a, fa, U0), at(b, fb, U0), at(b, fb, T0), at(a, fa, T0)], [-r[0], -r[1], 0])
    face(canopy, [at(a, ba, U1), at(b, bb, U1), at(b, bb, T1), at(a, ba, T1)], r)
  }
  // posts at the canopy's back, down to the upper deck's back wall
  for (let a = 96; a <= 276; a += 12) {
    const [, rb] = radii(a), h0 = prof(a)[6][1]
    const t = (a * Math.PI) / 180, r: V3 = [Math.cos(t), Math.sin(t), 0], s: V3 = [-r[1], r[0], 0]
    const c = at(a, rb - 3, 0), w = 0.6
    const q = (u: number, v: number, z: number): V3 => [c[0] + r[0] * u + s[0] * v, c[1] + r[1] * u + s[1] * v, z]
    const ring: [number, number][] = [[-w, -w], [w, -w], [w, w], [-w, w]]
    for (let k = 0; k < 4; k++) {
      const [u0, v0] = ring[k], [u1, v1] = ring[(k + 1) % 4]
      const mid: V3 = [r[0] * (u0 + u1) + s[0] * (v0 + v1), r[1] * (u0 + u1) + s[1] * (v0 + v1), 0]
      face(canopy, [q(u0, v0, h0 - 1), q(u1, v1, h0 - 1), q(u1, v1, U1 + 0.2), q(u0, v0, U1 + 0.2)], mid)
    }
  }
}

// ---------------------------------------------------- the scoreboard ---
{
  const S1: [number, number] = [86.4, 58.8], S2: [number, number] = [104.3, 29.4]
  const L = Math.hypot(S2[0] - S1[0], S2[1] - S1[1])
  const u: [number, number] = [(S2[0] - S1[0]) / L, (S2[1] - S1[1]) / L]
  const nIn: [number, number] = [-u[1], u[0]] // towards the field?
  const toField = (C[0] - S1[0]) * nIn[0] + (C[1] - S1[1]) * nIn[1] > 0 ? nIn : [-nIn[0], -nIn[1]] as [number, number]
  const P = (s: number, d: number, z: number): V3 => [S1[0] + u[0] * s + toField[0] * d, S1[1] + u[1] * s + toField[1] * d, z]
  const box = (p: Part, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) => {
    const c = [[s0, d0], [s1, d0], [s1, d1], [s0, d1]] as [number, number][]
    for (let k = 0; k < 4; k++) {
      const [sa, da] = c[k], [sb, db] = c[(k + 1) % 4]
      const ms = (sa + sb) / 2 - (s0 + s1) / 2, md = (da + db) / 2 - (d0 + d1) / 2
      face(p, [P(sa, da, z0), P(sb, db, z0), P(sb, db, z1), P(sa, da, z1)], [u[0] * ms + toField[0] * md, u[1] * ms + toField[1] * md, 0])
    }
    face(p, [P(s0, d0, z1), P(s1, d0, z1), P(s1, d1, z1), P(s0, d1, z1)], [0, 0, 1])
  }
  // the clad box over the left-field building (limestone below, grey
  // cladding from about 28 m, as on the back seen from 5th St N)
  box(stone, 1.5, L - 1.5, -6, 0, 0, 28)
  box(metal, 1.5, L - 1.5, -6, 0, 28, 50)
  // the video board's face, towards the field
  face(board, [P(2.5, 0.08, 32), P(L - 2.5, 0.08, 32), P(L - 2.5, 0.08, 49), P(2.5, 0.08, 49)], [toField[0], toField[1], 0])
  // the sign over it, and the light rig: posts and two bands of lamps
  box(metal, L * 0.3, L * 0.7, -4, -1.5, 50, 55.5)
  for (const s of [2, L * 0.36, L * 0.64, L - 2]) box(metal, s - 0.6, s + 0.6, -3.6, -2.4, 50, 63.8)
  box(metal, 0, L, -4, -2, 58.6, 60.6)
  box(metal, 0, L, -4, -2, 62.2, 63.8)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: stone, material: finish('kasota-limestone', 0xdcc39b) },
  { part: seats, material: finish('tf-seats', 0x56705f) },
  { part: canopy, material: finish('tf-canopy', 0xf4f2ec, 0.6) },
  { part: metal, material: finish('tf-steel', 0xa3a9ad) },
  { part: glazing, material: PALETTE.window },
  { part: board, material: finish('neon-scoreboard', 0x4a5058, 0.4) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Target Field', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 63.8,
})
if (import.meta.main) {
  await Bun.write(new URL('../models/msp-target-field.glb', import.meta.url), glb)
  console.log(`msp-target-field.glb: ${triangles} triangles, ${glb.length} bytes`)
}
