/**
 * Pittock Mansion (1909-14, Edward T. Foulkes), Portland, Oregon:
 * procedural, CC0-1.0, no textures.
 * bun generators/pdx-pittock-mansion.ts
 *
 * Henry Pittock's French Renaissance chateau on the crest of the West
 * Hills: buff sandstone walls of two storeys over a raised basement and
 * terrace, a cornice, and steep red tile roofs with dormers and tall
 * chimneys. The central block carries the tallest, almost pavilion-like hip
 * roof; toward the view (east) it has a bowed ground-floor bay with a
 * balcony on top and a round tower with a conical roof at its north-east
 * corner (a rounded bay at the south-east). A west wing and a south wing,
 * under lower hips, frame the entrance court, where a canted two-storey
 * entrance bay sits in the angle between them.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 20 (the walls of
 * the OSM outline), so +x faces the view (ESE). Origin: the area centroid of
 * OSM way/73908289. z = 0 is the lowest ground under the footprint, at the
 * south-east corner of the plan's box; the ground floor and terrace stand
 * about 3.8 m higher (Mapterhorn terrain, `tools/terrain.ts check`): the
 * heights below are drawn from G = 2.3 and the whole house above its feet
 * is lifted 1.5 m at the end, so the facade starts at the real ground and
 * the basement plinth sinks into the slope. Heights quoted below are before
 * that lift (add 1.5 m).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/73908289 (the plan:
 *   central block, west and south wings, the canted entrance bay, the bowed
 *   east bay, the diagonal north-east corner where the tower stands). No
 *   heights tagged. The gate lodge (way/130708136) and garage
 *   (way/73908283) are separate buildings, not modelled.
 * - USGS NAIP orthophoto (public domain): roof colours and the plan.
 * - Photos (evidence, Wikimedia Commons):
 *   - ProfReader, "Pittock Mansion from rear.jpg", CC0 (the east front: the
 *     central roof and its dormers and oculi, the bowed bay and balcony, the
 *     conical tower, chimneys, wings):
 *     https://commons.wikimedia.org/wiki/File:Pittock_Mansion_from_rear.jpg
 *   - Steven Pavlov, "Portland, OR — Pittock Mansion.jpg", CC BY-SA 4.0 (the
 *     entrance court from the north-west: the canted entrance bay, the
 *     wings, the tile colour, dormers):
 *     https://commons.wikimedia.org/wiki/File:Portland,_OR_%E2%80%94_Pittock_Mansion.jpg
 *   - Another Believer, "Pittock Mansion, 2017 - 5.jpg", CC BY-SA 4.0 (the
 *     south-west corner from below: the cornice, the stone colour):
 *     https://commons.wikimedia.org/wiki/File:Pittock_Mansion,_2017_-_5.jpg
 *
 * Numbers (no lidar used)
 * - Estimated from the east photo, scaled to two storeys of about 4.7 m:
 *   the cornice at 12.3 m (10 m over the terrace), the central ridge at
 *   20.5 m, the wings' ridges 17.5 m, the tower's cone to 20 m, chimneys to
 *   22 m; the bow one storey high under its balcony.
 * - Window counts follow the photos where they show a face, and are
 *   estimated on the north and west sides.
 * - Left out: the terrace balustrades and steps (ground), the porte-cochere
 *   details, carving, the gardens.
 *
 * Night: the windows glow; the house is not floodlit.
 *
 * Doubts
 * - The north and west faces are not photographed square-on.
 * - The south-east rounded bay is read from the east photo, partly hidden by
 *   a tree, and has no cone.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

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
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) =>
  prism(p, rect(x0, y0, x1, y1), z0, z1, top, bottom)
const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0, a1 = 2 * Math.PI, closed = true): XY[] =>
  Array.from({ length: closed ? n : n + 1 }, (_, k) => [cx + r * Math.cos(a0 + ((a1 - a0) * k) / n), cy + r * Math.sin(a0 + ((a1 - a0) * k) / n)] as XY)
function seg(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { a, b, L, t, n: [t[1], -t[0]] as XY, at: (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s] }
}
type Wall = ReturnType<typeof seg>
function panel(p: Part, w: Wall, s: number, wd: number, z0: number, z1: number, off = 0.05) {
  const o = w.at(s)
  const at = (u: number, z: number): V3 => [o[0] + w.t[0] * u + w.n[0] * off, o[1] + w.t[1] * u + w.n[1] * off, z]
  poly(p, [at(-wd / 2, z0), at(wd / 2, z0), at(wd / 2, z1), at(-wd / 2, z1)], [w.n[0], w.n[1], 0])
}
/** A hipped roof over x0..x1, y0..y1 (eave overhang included by the caller). */
function hipRoof(roof: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, h = y1 - y0
  if (w >= h) {
    const ym = (y0 + y1) / 2, d = Math.min(h / 2, w / 2)
    const A: V3 = [x0 + d, ym, zr], B: V3 = [x1 - d, ym, zr]
    poly(roof, [[x0, y0, ze], [x1, y0, ze], B, A], [0, -1, 1])
    poly(roof, [[x1, y1, ze], [x0, y1, ze], A, B], [0, 1, 1])
    poly(roof, [[x1, y0, ze], [x1, y1, ze], B], [1, 0, 1])
    poly(roof, [[x0, y1, ze], [x0, y0, ze], A], [-1, 0, 1])
  } else {
    const xm = (x0 + x1) / 2, d = w / 2
    const A: V3 = [xm, y0 + d, zr], B: V3 = [xm, y1 - d, zr]
    poly(roof, [[x1, y0, ze], [x1, y1, ze], B, A], [1, 0, 1])
    poly(roof, [[x0, y1, ze], [x0, y0, ze], A, B], [-1, 0, 1])
    poly(roof, [[x0, y0, ze], [x1, y0, ze], A], [0, -1, 1])
    poly(roof, [[x1, y1, ze], [x0, y1, ze], B], [0, 1, 1])
  }
  poly(roof, [[x0, y0, ze], [x1, y0, ze], [x1, y1, ze], [x0, y1, ze]], [0, 0, -1])
}
/** A cone over a ring (n sides) from z0 to its apex at z1. */
function cone(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 16) {
  const R = ngon(cx, cy, r, n)
  for (let i = 0; i < n; i++) {
    const a = R[i], b = R[(i + 1) % n]
    const m: XY = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [cx, cy, z1]], [m[0], m[1], r / (z1 - z0) * Math.hypot(m[0], m[1])])
  }
}

// ------------------------------------------------------------ the model ---
const stone = new Part()   // sandstone walls
const trim = new Part()    // cornice, plinth, balustrade, chimney caps, window surrounds
const roof = new Part()    // red tile
const win = new Part()     // windows
const cheek = new Part()   // green copper dormer cheeks and hoods

const G = 2.3                    // the ground floor's terrace level above z = 0
const EAVE = 12.3                // cornice top
const F1: [number, number] = [G + 1.0, G + 4.0]   // ground-floor window sill, head
const F2: [number, number] = [G + 5.8, G + 8.6]   // upper floor

// Blocks: [x0, y0, x1, y1, ridge]
const CEN = [-5.5, -9.9, 12.2, 10.9] as const
const WEST = [-17.2, -1.0, -5.5, 10.9] as const
const SOUTH = [-2.2, -17.9, 8.5, -9.9] as const
const OV = 0.55   // eave overhang

function block(b: readonly [number, number, number, number], ridge: number) {
  const [x0, y0, x1, y1] = b
  box(trim, x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1, 0, G + 0.4, false)             // basement plinth
  box(stone, x0, y0, x1, y1, G + 0.4, EAVE - 0.6, false)
  box(trim, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, EAVE - 0.6, EAVE, true, true)  // cornice
  box(trim, x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12, G + 4.6, G + 4.95, false, true) // string course
  hipRoof(roof, x0 - OV, y0 - OV, x1 + OV, y1 + OV, EAVE, ridge)
}
block(CEN, 20.5)
block(WEST, 17.5)
block(SOUTH, 17.5)

// Windows: a list of wall runs and the positions of the bays along them.
function bays(w: Wall, ss: number[], opts: { ground?: boolean; tall?: number[] } = {}) {
  for (const s of ss) {
    const wide = opts.tall?.includes(s) ? 2.4 : 1.5
    if (opts.ground !== false) {
      panel(trim, w, s, wide + 0.5, F1[0] - 0.25, F1[1] + 0.3, 0.03)
      panel(win, w, s, wide, F1[0], F1[1], 0.07)
    }
    panel(trim, w, s, wide + 0.5, F2[0] - 0.25, F2[1] + 0.3, 0.03)
    panel(win, w, s, wide, F2[0], F2[1], 0.07)
  }
}
const spread = (L: number, n: number, m = 2) => Array.from({ length: n }, (_, k) => m + ((L - 2 * m) * (k + 0.5)) / n)
{
  // central block
  const E = seg([CEN[2], CEN[1]], [CEN[2], CEN[3]])          // the east front, 20.8 m
  bays(E, [3.4, 6.8, 14.0, 17.4])
  bays(E, [10.4], { ground: false, tall: [10.4] })
  const N = seg([CEN[2], CEN[3]], [CEN[0], CEN[3]])
  bays(N, [6.5, 10.0, 14.0])
  const S = seg([CEN[0], CEN[1]], [CEN[2], CEN[1]])
  bays(S, [13.6, 16.0])
  const Wc = seg([CEN[0], CEN[3]], [CEN[0], CEN[1]])
  bays(Wc, [], {})
  // west wing
  const WN = seg([WEST[2], WEST[3]], [WEST[0], WEST[3]])
  bays(WN, spread(WN.L, 3))
  const WW = seg([WEST[0], WEST[3]], [WEST[0], WEST[1]])
  bays(WW, spread(WW.L, 3))
  const WS = seg([WEST[0], WEST[1]], [WEST[2], WEST[1]])
  bays(WS, spread(WS.L - 2.6, 2))
  // south wing
  const SS = seg([SOUTH[0], SOUTH[1]], [SOUTH[2], SOUTH[1]])
  bays(SS, spread(SS.L, 3))
  const SE = seg([SOUTH[2], SOUTH[1]], [SOUTH[2], SOUTH[3]])
  bays(SE, spread(SE.L, 2))
  const SW = seg([SOUTH[0], SOUTH[3]], [SOUTH[0], SOUTH[1]])
  bays(SW, spread(SW.L, 2, 1.5))
}

// --- the canted entrance bay in the angle of the wings (front photo)
{
  const P: XY[] = [[-8.1, -1.0], [-8.1, -3.6], [-5.5, -6.1], [-5.5, -1.0]]
  prism(trim, P, 0, G + 0.4, false)
  prism(stone, P, G + 0.4, 10.6, false)
  prism(trim, P.map(([x, y]) => [x - 0.25, y] as XY), 10.6, 11.1, true, true)
  const d = seg([-8.1, -3.6], [-5.5, -6.1])
  panel(trim, d, d.L / 2, 2.6, G, G + 3.6, 0.03)
  panel(win, d, d.L / 2, 2.0, G, G + 3.3, 0.07)     // the french doors
  panel(trim, d, d.L / 2, 2.6, F2[0] - 0.25, F2[1] + 0.3, 0.03)
  panel(win, d, d.L / 2, 2.0, F2[0], F2[1], 0.07)
  const w = seg([-8.1, -1.0], [-8.1, -3.6])
  panel(win, w, w.L / 2, 1.3, F2[0], F2[1], 0.07)
  // its small hipped roof
  poly(roof, [[-8.4, -0.8, 11.1], [-8.4, -3.7, 11.1], [-6.6, -2.4, 13.2]], [-1, 0, 1])
  poly(roof, [[-8.4, -3.7, 11.1], [-5.4, -6.5, 11.1], [-6.6, -2.4, 13.2]], [-1, -1, 1])
}

// --- the bowed east bay: one storey, a balcony on top
{
  const C: XY = [12.2, 0.9], R = 3.2
  const arc = ngon(C[0], C[1], R, 8, -Math.PI / 2, Math.PI / 2, false)
  prism(trim, arc, 0, G + 0.4, false)
  prism(stone, arc, G + 0.4, G + 4.9, false)
  prism(trim, ngon(C[0], C[1], R + 0.3, 8, -Math.PI / 2, Math.PI / 2, false), G + 4.9, G + 5.4, true, true)
  prism(trim, ngon(C[0], C[1], R + 0.1, 8, -Math.PI / 2, Math.PI / 2, false), G + 5.4, G + 6.3, false)
  for (let k = 0; k < 8; k += 1) {
    if (k === 0 || k === 7) continue
    const a = arc[k], b = arc[k + 1]
    const w = seg(a, b)
    panel(win, w, w.L / 2, w.L - 0.5, F1[0], F1[1] + 0.3, 0.06)
  }
  const a = arc[3], b = arc[5]
  const w = seg(a, b)
  panel(win, w, w.L / 2, 3.2, F1[0] - 0.4, F1[1] + 0.3, 0.12)   // the big centre window
}

// --- the round tower at the north-east corner, the rounded bay at the south-east
{
  const C: XY = [9.0, 9.9], R = 3.3
  prism(trim, ngon(C[0], C[1], R + 0.1, 16), 0, G + 0.4, false)
  prism(stone, ngon(C[0], C[1], R, 16), G + 0.4, EAVE + 1.2, false)
  prism(trim, ngon(C[0], C[1], R + 0.35, 16), EAVE + 1.2, EAVE + 1.7, true, true)
  cone(roof, C[0], C[1], R + 0.45, EAVE + 1.7, 20.3, 16)
  prism(cheek, ngon(C[0], C[1], 0.12, 6), 20.0, 21.2, true)
  for (const a of [-0.2, 0.6, 1.4]) {
    const p: XY = [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)]
    const t: XY = [-Math.sin(a), Math.cos(a)]
    const w = seg([p[0] - t[0] * 0.8, p[1] - t[1] * 0.8], [p[0] + t[0] * 0.8, p[1] + t[1] * 0.8])
    panel(win, w, 0.8, 1.2, F1[0], F1[1], 0.1)
    panel(win, w, 0.8, 1.2, F2[0], F2[1], 0.1)
  }
  const D: XY = [10.4, -7.6], r = 2.4
  const arc = ngon(D[0], D[1], r, 8, -Math.PI / 2, Math.PI / 2, false)
  prism(stone, arc, 0, EAVE - 0.6, false)
  prism(trim, ngon(D[0], D[1], r + 0.35, 8, -Math.PI / 2, Math.PI / 2, false), EAVE - 0.6, EAVE, true, true)
  for (const k of [3, 4]) {
    const w = seg(arc[k], arc[k + 1])
    panel(win, w, w.L / 2, 1.1, F1[0], F1[1], 0.06)
    panel(win, w, w.L / 2, 1.1, F2[0], F2[1], 0.06)
  }
}

// --- dormers: a gabled box with a copper hood standing on the eave line
function dormer(cx: number, cy: number, nx: number, ny: number, w = 1.9, h = 2.4, depth = 2.4) {
  const t: XY = [-ny, nx]
  const P = (u: number, v: number): XY => [cx + t[0] * u + nx * v, cy + t[1] * u + ny * v]
  const z0 = EAVE - 0.2, z1 = EAVE + h
  prism(cheek, [P(-w / 2, -depth), P(w / 2, -depth), P(w / 2, 0), P(-w / 2, 0)], z0, z1, false)
  const wall = seg(P(-w / 2, 0), P(w / 2, 0))
  panel(win, wall, w / 2, w - 0.6, z0 + 0.5, z1 - 0.3, 0.05)
  const A = P(-w / 2 - 0.2, 0.3), B = P(w / 2 + 0.2, 0.3), Ab = P(-w / 2 - 0.2, -depth), Bb = P(w / 2 + 0.2, -depth)
  const M = P(0, 0.3), Mb = P(0, -depth), zr = z1 + 1.1
  poly(roof, [[A[0], A[1], z1], [M[0], M[1], zr], [Mb[0], Mb[1], zr], [Ab[0], Ab[1], z1]], [-t[0], -t[1], 1])
  poly(roof, [[B[0], B[1], z1], [Bb[0], Bb[1], z1], [Mb[0], Mb[1], zr], [M[0], M[1], zr]], [t[0], t[1], 1])
  poly(cheek, [[A[0], A[1], z1], [B[0], B[1], z1], [M[0], M[1], zr]], [nx, ny, 0])
}
dormer(CEN[2] + 0.1, -4.3, 1, 0)
dormer(CEN[2] + 0.1, 3.6, 1, 0)
dormer(4.0, CEN[3] + 0.1, 0, 1)
dormer(-11.4, WEST[3] + 0.1, 0, 1)
dormer(-14.2, WEST[1] - 0.1, 0, -1)
dormer(-11.0, WEST[1] - 0.1, 0, -1)
dormer(3.2, SOUTH[1] - 0.1, 0, -1)
dormer(SOUTH[0] - 0.1, -13.9, -1, 0)
dormer(CEN[0] - 0.1, 6.0, -1, 0)
// the three small round windows (oculi) high on the central east slope
{
  const xe = CEN[2] + OV, xr = (CEN[0] + CEN[2]) / 2, m = (20.5 - EAVE) / (xe - xr)   // the east slope
  const zAt = (x: number) => EAVE + (xe - x) * m + 0.06
  for (const y of [-2.6, 0.9, 4.4]) {
    const xa = 7.6, xb = 8.4
    poly(win, [[xb, y - 0.45, zAt(xb)], [xb, y + 0.45, zAt(xb)], [xa, y + 0.45, zAt(xa)], [xa, y - 0.45, zAt(xa)]], [m, 0, 1])
  }
}

// --- chimneys (stone, capped)
for (const [x, y, top] of [[3.4, 0.9, 22.0], [6.0, 8.0, 21.6], [-12.0, 5.0, 19.5], [3.2, -15.0, 19.3], [-1.0, -7.0, 20.8]] as Array<[number, number, number]>) {
  box(stone, x - 0.8, y - 0.55, x + 0.8, y + 0.55, 13.0, top - 0.4, false)
  box(trim, x - 0.95, y - 0.7, x + 0.95, y + 0.7, top - 0.4, top, true, true)
}

// Lift everything above the base onto the real ground: the map puts z = 0
// on the lowest terrain in the plan's box, 1.5 m under the ground floor
// (tools/terrain.ts check); the walls' feet stay at 0 and run down into it.
const LIFT = 1.5
for (const part of [stone, trim, roof, win, cheek]) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 0.01) part.pos[i] += LIFT

// ---------------------------------------------------------------- output ---
const parts = [
  { part: stone, material: finish('pittock-sandstone', 0xd6ccb6) },
  { part: trim, material: finish('pittock-trim', 0xe6dece) },
  { part: roof, material: finish('pittock-tile', 0xb8604f) },
  { part: win, material: PALETTE.window },
  { part: cheek, material: PALETTE.copper },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pittock Mansion', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 20, elevation: 0, height: 22.0 + LIFT,
})
await Bun.write(new URL('../models/pdx-pittock-mansion.glb', import.meta.url), glb)
console.log(`pdx-pittock-mansion.glb: ${triangles} triangles, ${glb.length} bytes`)
