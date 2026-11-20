/**
 * Huntington Bank Stadium (TCF Bank Stadium until 2021; HOK Sport, 2009),
 * University of Minnesota, Minneapolis: procedural, CC0-1.0.
 * bun generators/msp-huntington-bank-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the field runs
 * exactly east-west). Origin at the area centroid of OSM relation/8771432
 * (building=stadium), -93.224285, 44.976562. The geometry below is written
 * 13.0 m east and 0.2 m north of that (around the lead's point -93.22445,
 * 44.97656, where the lidar grid is centred) and shifted at the end.
 * y = 0 is the field (lidar 252.0 m); the streets and plazas round it are
 * 2.0 m (north, south) to 2.9-3.3 m (the west plaza, the east side) higher.
 *
 * Identity, from the photos and lidar (not the brief's one-liner: the
 * horseshoe opens to the WEST, toward downtown, and the video board stands
 * at that open end; the press box and suite tower is on the SOUTH sideline):
 * - a horseshoe of red-brown brick with limestone, open to the west;
 * - maroon seats in a lower bowl and an upper deck, a glazed club step
 *   between them;
 * - a white roof band behind the upper deck round the north, east and
 *   their corners, its front edge raised over the top rows;
 * - the press box and suite tower on the south sideline, wrapping the
 *   south-east corner, its field face glass, its outer face brick piers
 *   below and a glass box above;
 * - the video board at the open west end on eight brick piers, its back a
 *   white panel with the block M and the arched crest on top.
 *
 * Measured (USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, 1 m surface
 * model, sections north, south, east, north-east, south-east and at
 * x = -60): lower bowl 2 to 8.5 m over 19-25 m from the field's edge; the
 * club step to 13 m; the upper deck to 23.5 m (north), 26 m (east), 19.5 m
 * (south); the roof band 26-26.5 m with its front at 29 m (north), its
 * outer parapet 27.3 m; the south tower 41-43 m, 36 m deep, ending at the
 * south-east corner (about 320 degrees round the corner); the board 34.2 m,
 * 36 m wide, 4 m thick, its crest 37.8 m; the north-west stair tower
 * 31.6 m. The arm ends from the lidar's plan (north arm from (-77, 37) to
 * (-132, 62), south arm from (-67, -47) to (-101, -92), lead frame).
 * From OSM relation/8771432: the field (inner ring, drawn as a rounded
 *   rectangle x -73..52, y -41..35, corner radius 11) and the outer wall.
 * Estimated from the photos: the board's piers (to 15 m), its panel's
 *   bottom (12 m), the M's size and place (10.3 x 15.4 m, centre 20.8 m),
 *   the crest's arch (14 m chord); the outer wall's window bays (5-19 m) and the
 *   tower's glass box (26-39.5 m); the split of the profile into wall,
 *   seats, club glass and canopy; colours.
 * Elevation: 0 (lead review: lidar ground may not set it; no published field level found. Lidar suggests the field 2.0 m below the north and south sidewalks, from
 *   the lidar's own field and sidewalk returns; see the report).
 * Left out: the turf and field (the map's), seat lettering (MINNESOTA,
 *   the M's in the stands), the light rigs on the roof, the gates' arches,
 *   flags, the plaza.
 *
 * Photos (Wikimedia Commons, evidence):
 * - Lectrician2, "Huntington Bank Stadium Aerial.jpg", CC BY-SA 4.0 (from
 *   the west, above: the plan, the white roof band, the board's back);
 * - Tony Webster, "TCF Bank Stadium - University of Minnesota
 *   (27003968243).jpg", CC BY-SA 2.0 (the board's back, piers, M, crest);
 * - Randy Stern, "TCF Bank Stadium - University of Minnesota 2.jpg" and
 *   "... 4.jpg", CC BY 2.0 (the board close up; the south tower from the
 *   south-west: brick piers below, glass box above);
 * - SusanLesch, "TCF Bank Stadium-20100914.JPG", CC BY-SA 3.0 (the board
 *   and the arms' brick ends from the west);
 * - Jon Platek, "TCF Bank Stadium - panoramio.jpg", CC BY-SA 3.0, and
 *   Gabriel Vanslette, "TCF Bank Stadium - Minneapolis, MN - panoramio
 *   (1).jpg", CC BY 3.0 (the outer wall and tower from the street);
 * - Andrew Constans, "TCF Bank Stadium 2.JPG", CC BY-SA 3.0, and A Syn,
 *   "TCF Bank Stadium - Minnesota Golden Gophers.jpg", CC BY-SA 2.0 (the
 *   bowl inside: maroon seats, club step, roof band);
 * - Runner1928, "Winter at TCF Bank Stadium - press box.jpg" and
 *   "... scoreboard from box seats.jpg", CC BY-SA 4.0;
 * - August Schwerdfeger, "View of TCF Bank Stadium from Prospect Park water
 *   tower 2015-05-29.jpg", CC BY 4.0 (far, from the east).
 * Doubts: the north arm's outer face has no close photo; the east end's
 *   profile is drawn like the north's; the arm ends are radial cuts that
 *   approximate the slanted ends.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { ccw, triangulate, type XY } from './sea-tacoma-union-station'

const brick = new Part(), stone = new Part(), seats = new Part(), white = new Part(), glass = new Part(), screen = new Part()
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, P: V3[], hint: V3) {
  const n = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const n2 = P.length > 3 ? cross(sub(P[2], P[0]), sub(P[3], P[0])) : n
  const Q = dot(n, hint) + dot(n2, hint) >= 0 ? P : [...P].reverse()
  const area = (a: V3, b: V3, c: V3) => Math.hypot(...cross(sub(b, a), sub(c, a)))
  if (area(Q[0], Q[1], Q[2]) > 1e-4) p.tri(Q[0], Q[1], Q[2])
  if (Q.length > 3 && area(Q[0], Q[2], Q[3]) > 1e-4) p.tri(Q[0], Q[2], Q[3])
}
/** A box, axis-aligned. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p) {
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - mx, (a[1] + b[1]) / 2 - my, 0])
  }
  face(top, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
}

// ------------------------------------------------------------ profiles ---
type Prm = { dLow: number; hLow: number; dUp: number; hUp: number; hFront: number; hRoof: number; dOut: number }
const NORTH: Prm = { dLow: 22, hLow: 8.5, dUp: 46, hUp: 23.5, hFront: 29, hRoof: 26.5, dOut: 74 }
const EAST: Prm = { dLow: 25, hLow: 9, dUp: 55, hUp: 26, hFront: 27.5, hRoof: 26.3, dOut: 84 }
const SOUTH: Prm = { dLow: 19, hLow: 8, dUp: 34, hUp: 19.5, hFront: 42.5, hRoof: 41.5, dOut: 73 }
const mixP = (a: Prm, b: Prm, t: number): Prm => Object.fromEntries(Object.keys(a).map((k) => [k, a[k as keyof Prm] + (b[k as keyof Prm] - a[k as keyof Prm]) * t])) as Prm
const withOut = (p: Prm, dOut: number): Prm => ({ ...p, dOut })
/** Twelve (distance from the field's edge, height) points, field to outside. */
const prof = (p: Prm): [number, number][] => [
  [0, 0], [0, 2.2], [p.dLow, p.hLow], [p.dLow, p.hLow + 4.5], [p.dLow + 3, p.hLow + 5], [p.dUp, p.hUp],
  [p.dUp + 1, p.hFront], [p.dUp + 3, p.hFront], [p.dUp + 3, p.hRoof], [p.dOut - 1, p.hRoof], [p.dOut, p.hRoof + 1], [p.dOut, 0],
]
// what each segment is: field wall, lower seats, club glass, club ledge, upper seats, back/suite glass, canopy x4, outer wall
const SEG: Part[] = [stone, seats, glass, stone, seats, glass, white, white, white, white, brick]

// ------------------------------------------------------------ stations ---
// Round the field's rounded rectangle, counter-clockwise from the south arm's end to the north arm's.
const R0 = 11, FX0 = -73, FX1 = 52, FY0 = -41, FY1 = 35
type St = { B: XY; N: XY; p: Prm }
const st: St[] = []
const corner = (cx: number, cy: number, th: number, p: Prm) => {
  const t = (th * Math.PI) / 180, n: XY = [Math.cos(t), Math.sin(t)]
  st.push({ B: [cx + R0 * n[0], cy + R0 * n[1]], N: n, p })
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
for (const th of [245, 251, 257, 263]) corner(FX0 + R0, FY0 + R0, th, SOUTH)
for (let i = 0; i <= 8; i++) st.push({ B: [lerp(FX0 + R0, FX1 - R0, i / 8), FY0], N: [0, -1], p: SOUTH })
for (const th of [278, 286, 294, 302, 310, 318]) corner(FX1 - R0, FY0 + R0, th, withOut(SOUTH, lerp(73, 69, Math.min(1, (th - 270) / 45))))
corner(FX1 - R0, FY0 + R0, 320.5, withOut(SOUTH, 69))
corner(FX1 - R0, FY0 + R0, 321.5, withOut(EAST, 69))
for (const th of [330, 338, 346, 354]) corner(FX1 - R0, FY0 + R0, th, withOut(EAST, lerp(69, 84, (th - 315) / 45)))
for (let i = 0; i <= 4; i++) { const y = lerp(FY0 + R0, FY1 - R0, i / 4); st.push({ B: [FX1, y], N: [1, 0], p: withOut(EAST, 84 + 4 * (1 - ((y + 3) / 27) ** 2)) }) }
for (const th of [7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60, 67.5, 75, 82.5]) corner(FX1 - R0, FY1 - R0, th, withOut(mixP(EAST, NORTH, th / 90), th < 45 ? lerp(84, 69, th / 45) : lerp(69, 74, (th - 45) / 45)))
for (let i = 0; i <= 8; i++) st.push({ B: [lerp(FX1 - R0, FX0 + R0, i / 8), FY1], N: [0, 1], p: NORTH })
for (const th of [98, 106, 114, 122, 130, 138, 147]) corner(FX0 + R0, FY1 - R0, th, withOut(NORTH, lerp(74, 70, (th - 90) / 57)))

const P = (s: St, [d, h]: [number, number]): V3 => [s.B[0] + s.N[0] * d, s.B[1] + s.N[1] * d, h]

// ------------------------------------------------------------ the bowl ---
for (let i = 0; i + 1 < st.length; i++) {
  const a = st[i], b = st[i + 1], A = prof(a.p), Bp = prof(b.p)
  const n: XY = [(a.N[0] + b.N[0]) / 2, (a.N[1] + b.N[1]) / 2]
  for (let k = 0; k < 11; k++) {
    const dr = (A[k + 1][0] - A[k][0] + Bp[k + 1][0] - Bp[k][0]) / 2, dh = (A[k + 1][1] - A[k][1] + Bp[k + 1][1] - Bp[k][1]) / 2
    face(SEG[k], [P(a, A[k]), P(b, Bp[k]), P(b, Bp[k + 1]), P(a, A[k + 1])], [-dh * n[0], -dh * n[1], dr])
  }
  // the outer wall's bays: tall windows between brick piers; on the tower, a glass box above
  const tower = a.p.hRoof > 35 && b.p.hRoof > 35
  const L = Math.hypot(P(b, Bp[11])[0] - P(a, A[11])[0], P(b, Bp[11])[1] - P(a, A[11])[1])
  if (L < 3) continue
  const g = Math.min(0.3, 1.6 / L), o = 0.06
  const W = (t: number, z: number): V3 => {
    const p = P(a, A[11]), q = P(b, Bp[11])
    return [p[0] + (q[0] - p[0]) * t + n[0] * o, p[1] + (q[1] - p[1]) * t + n[1] * o, z]
  }
  const pane = (z0: number, z1: number, gg: number) => face(glass, [W(gg, z0), W(1 - gg, z0), W(1 - gg, z1), W(gg, z1)], [n[0], n[1], 0])
  pane(5, tower ? 21 : 19.5, g)
  if (tower) pane(26, 39.5, 0.02)
}
// the arms' ends: the section, closed along the ground
for (const [s, dir] of [[st[0], -1], [st[st.length - 1], 1]] as [St, number][]) {
  const pts = ccw(prof(s.p) as XY[]), tan: V3 = [-s.N[1] * dir, s.N[0] * dir, 0]
  for (const [i, j, k] of triangulate(pts)) face(brick, [P(s, pts[i] as [number, number]), P(s, pts[j] as [number, number]), P(s, pts[k] as [number, number])], tan)
}
// the north-west stair tower at the north arm's end
box(brick, -120, -104, 60, 76, 0, 30.6, stone)
box(stone, -120.3, -103.7, 59.7, 76.3, 30.6, 31.6)

// ------------------------------------------------------------ the video board ---
{
  const X0 = -108, X1 = -104, Y0 = -6, Y1 = 30
  for (let i = 0; i < 8; i++) { const y = Y0 + (36 * (i + 0.5)) / 8; box(brick, X0 - 0.6, X1 + 0.4, y - 1.2, y + 1.2, 0, 15) }
  box(brick, X0 - 0.3, X1 + 0.2, Y0, Y1, 8, 9.6)
  box(white, X0, X1, Y0, Y1, 12, 34.2, white)
  face(white, [[X0, Y1, 12], [X1, Y1, 12], [X1, Y0, 12], [X0, Y0, 12]], [0, 0, -1])
  face(screen, [[X1 + 0.06, Y0 + 1.5, 15], [X1 + 0.06, Y1 - 1.5, 15], [X1 + 0.06, Y1 - 1.5, 33], [X1 + 0.06, Y0 + 1.5, 33]], [1, 0, 0])
  // the arched crest on top, maroon
  // a segmental arch 14 m wide, 4.4 m high, its top at the lidar's 37.8 m
  const cy = 12, R = 7.77, zc = 30.03, a0 = 25.7, arc: XY[] = []
  for (let k = 0; k <= 10; k++) { const t = ((a0 + ((180 - 2 * a0) * k) / 10) * Math.PI) / 180; arc.push([cy + R * Math.cos(t), zc + R * Math.sin(t)]) }
  const poly = ccw(arc)
  for (const x of [X0 - 0.3, X1 + 0.3]) for (const [i, j, k] of triangulate(poly)) face(seats, [[x, poly[i][0], poly[i][1]], [x, poly[j][0], poly[j][1]], [x, poly[k][0], poly[k][1]]], [x < X0 ? -1 : 1, 0, 0])
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    face(seats, [[X0 - 0.3, p[0], p[1]], [X0 - 0.3, q[0], q[1]], [X1 + 0.3, q[0], q[1]], [X1 + 0.3, p[0], p[1]]], [0, (p[0] + q[0]) / 2 - cy, (p[1] + q[1]) / 2 - 36])
  }
  // the block M on the back, toward the plaza (Webster's photo)
  const pen = new Pen()
  pen.moveTo([0.1, 0.05]).lineTo([0.1, 0.95]).lineTo([0.52, 0.36]).lineTo([0.94, 0.95]).lineTo([0.94, 0.05])
  pen.moveTo([-0.04, 0.07]).lineTo([0.32, 0.07]); pen.moveTo([0.72, 0.07]).lineTo([1.08, 0.07])
  pen.moveTo([-0.04, 0.93]).lineTo([0.2, 0.93]); pen.moveTo([0.84, 0.93]).lineTo([1.08, 0.93])
  strokes(seats, pen.paths, { width: 0.26, depth: 0.3, place: (u, v, w) => [X0 - 0.05 - w, 12 + (0.52 - u) * 14.8, 15.7 + v * 10.3] })
}

// ---------------------------------------------------------------- output ---
for (const p of [brick, stone, seats, white, glass, screen]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= 13.0; p.pos[i + 2] += 0.2 }
const parts = [
  { part: brick, material: finish('hbs-brick', 0xa86c5a) },
  { part: stone, material: finish('hbs-limestone', 0xe0d4bd) },
  { part: seats, material: finish('hbs-maroon', 0x96565b) },
  { part: white, material: finish('hbs-canopy', 0xeeeeea, 0.6) },
  { part: glass, material: PALETTE.window },
  { part: screen, material: finish('neon-hbs-board', 0x4a5058, 0.4) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Huntington Bank Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 37.8,
})
if (import.meta.main) {
  await Bun.write(new URL('../models/msp-huntington-bank-stadium.glb', import.meta.url), glb)
  console.log(`msp-huntington-bank-stadium.glb: ${triangles} triangles, ${glb.length} bytes`)
}
