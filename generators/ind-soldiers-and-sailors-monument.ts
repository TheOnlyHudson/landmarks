/**
 * Indiana Soldiers' and Sailors' Monument (1888–1901, Bruno Schmitz),
 * Monument Circle, Indianapolis: procedural, CC0-1.0.
 * bun generators/ind-soldiers-and-sailors-monument.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * OSM outline way/339773760 (-86.158045, 39.7685195), which is also the
 * shaft's axis and the centre of the terrace, the steps and the two
 * cascades. The OSM plan is turned about 1.5 degrees clockwise from true
 * north (the edges of the outline, the steps and the walls all agree), so
 * the model is drawn square and placed at bearing 1.5. y = 0 is the floor of
 * the east and west pools, the lowest ground under the model; the brick
 * street of the Circle is 2 m higher (Mapterhorn terrain, `bun tools/terrain.ts
 * check`), and the heights below are given above the street.
 *
 * Form: a round raised terrace with broad stairs north and south (two
 * flights with a landing between); on the east and west a three-tier
 * cascade falls from the terrace into the big pools (the pools' water is
 * the map's). On the terrace a cross-shaped podium, the tall pedestal with
 * its inscribed tablets (north and south) and the two great limestone
 * groups, War and Peace (east and west), a cornice with bronze trophies of
 * cannon and eagles, a narrower upper pedestal, the bronze army astragal
 * with its upturned corner horns, the tapering limestone shaft with slit
 * windows, the bronze "1861 / 1865" band, a capital of eagles, the
 * observation balcony and its glazed lantern, and Victory in bronze on a
 * globe, facing south, sword in her right hand and torch raised in her left.
 * Four 40 ft bronze candelabra stand on the cheek walls of the stairs.
 *
 * Sources
 * - OSM (ODbL): way/339773760 outline (cross plan, x -10.3..10.4,
 *   y -9.4..8.9), building:parts way/1317043421 (pedestal, 12.6 m square),
 *   way/1457569889 (podium), way/1457569890..94 and way/1457572267 (shaft
 *   and lantern, about 9.7 m at the base by OSM, 4.8 m at the top);
 *   steps area:highway ways 1317043395..98 (inner flights r 15.5..21.7 m,
 *   x ±10; outer flights r 25.5..30.4, x ±13.5); stone walls 1317043408/09
 *   (the cheek walls and the parapet round the terrace at r 16..17); the
 *   cascade's retaining walls 1317043739..41, 1317043855..57 and fountain
 *   areas 1317043414/15; pools 339439358/59.
 * - Published (Wikipedia, "Soldiers' and Sailors' Monument (Indianapolis)";
 *   NRHP 1973): 284 ft 6 in (86.72 m) to the top of Victory; Victory 30 ft
 *   (9.1 m), faces south; north and south stairs 70 ft (21 m) wide; three
 *   bronze astragals; the capital of eight eagles carries a balcony and a
 *   19 ft turret under the statue; four 40 ft (12 m) candelabra at the north
 *   and south steps; the War and Peace groups by Rudolf Schwarz on the east
 *   and west, with The Dying Soldier and The Return Home below them.
 * - Photos (Wikimedia Commons): Diego Delso's 2012 set (CC BY-SA 3.0),
 *   "DD 06" (the south front, square on: the elevation every height below is
 *   scaled from, against the 86.72 m total and a 5 m terrace), "DD 08" (the
 *   east or west front with its cascade and group); "Monument Circle,
 *   Indianapolis, Indiana, USA.jpg" (alexeatswhales, CC BY 2.0, from high
 *   up to the south: the terrace, the two flights, the cascades and pools);
 *   Todd Fowler's April 2016 set (CC BY-SA 2.0) for the pedestal's corners;
 *   "Soldiers' and Sailors' Monument - September 2019 - 00.jpg" (formulanone,
 *   CC BY-SA 2.0, from across the stairs).
 *
 * Heights above the street (from the "DD 06" elevation, ±1 m):
 *   terrace 5.0, landing 2.6; podium to 6.5; pedestal cornice 25.6..26.8;
 *   bronze trophies to 29; upper pedestal 26.8..35.6 (7.3 m wide);
 *   army astragal 35.6..39.0, horns to 40.4; shaft 39.0..63.6, 5.8 m wide
 *   at the foot to 4.4 m; date band 63.6..65.6; capital 68.6..71.6;
 *   balcony 71.6..74.4; lantern 74.4..75.7; turret cap to 76.9; globe and
 *   Victory to 86.7.
 * Estimated: the terrace and landing heights (from the number of steps in
 *   the aerial), every width not in OSM, the cascade tiers' heights, the
 *   groups' bulk. OSM's shaft parts (9.7 m at the base) are wider than the
 *   photos show; the photo widths are used.
 * Left out: the naval astragal (a thin bronze band, too fine), the four
 *   soldier figures and the four bronze statues round the Circle, the
 *   balustrades, the inscriptions, all relief carving (the groups are drawn
 *   as bold lumps), the pools' water, the Christmas lights.
 * Night: floodlit from the candelabra (since 1928) and the terrace: the
 *   stone and bronze carry a floodlight wash, strongest low down; the
 *   balcony and lantern glow faintly as `window`; the candelabra heads are
 *   `lamp`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type XY, prism, rect, chamfer, lathe, disc, arc, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const T = 5.0 // terrace
const L = 2.6 // landing between the flights
const STREET = 2.0 // the Circle's street above the pools' floor (Mapterhorn, measured)

const stone = new Part(), trim = new Part(), bronze = new Part(), win = new Part(), glass = new Part(), lamp = new Part()

/** A chamfered square ring of half-width h at height z. */
const sq = (h: number, z: number, c = 0.35): V3[] => {
  const k = Math.min(c, h * 0.2)
  return [[-h + k, -h, z], [h - k, -h, z], [h, -h + k, z], [h, h - k, z], [h - k, h, z], [-h + k, h, z], [-h, h - k, z], [-h, -h + k, z]]
}
/** A tapering square block from (h0, z0) to (h1, z1); caps optional. */
function block(p: Part, h0: number, z0: number, h1: number, z1: number, top: Part | null = p, c = 0.35) {
  p.loft([sq(h0, z0, c), sq(h1, z1, c)])
  if (top) top.cap(sq(h1, z1, c), true)
}
/** A square beam from a to b, w wide: arms, sword, torch. */
function beam(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(...d)
  const u: V3 = Math.abs(d[2]) / l > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  const nz = (v: V3): V3 => { const m = Math.hypot(...v); return [v[0] / m, v[1] / m, v[2] / m] }
  const e1 = nz(cr(d, u)), e2 = nz(cr(e1, d))
  const ring = (o: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [o[0] + (e1[0] * s + e2[0] * t) * w / 2, o[1] + (e1[1] * s + e2[1] * t) * w / 2, o[2] + (e1[2] * s + e2[2] * t) * w / 2] as V3)
  const r0 = ring(a), r1 = ring(b)
  // winding: make the side quads face outward whatever the beam's direction
  const outwardOk = (() => { const n = cr([r0[1][0] - r0[0][0], r0[1][1] - r0[0][1], r0[1][2] - r0[0][2]], d); const c0 = [(r0[0][0] + r0[1][0]) / 2 - a[0], (r0[0][1] + r0[1][1]) / 2 - a[1], (r0[0][2] + r0[1][2]) / 2 - a[2]]; return n[0] * c0[0] + n[1] * c0[1] + n[2] * c0[2] > 0 })()
  const R0 = outwardOk ? r0 : [...r0].reverse(), R1 = outwardOk ? r1 : [...r1].reverse()
  p.loft([R0, R1])
  p.cap(R1, true)
  p.cap([...R0].reverse(), true)
}
/** An ellipse-ish ring about (cx, 0), clipped to |y| <= ymax, from angle -90 to 90 on side sx. */
const halfOval = (cx: number, a: number, b: number, ymax: number, sx: number, n = 12): XY[] => {
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    const t = -Math.PI / 2 + (Math.PI * k) / n
    out.push([cx + sx * a * Math.cos(t), Math.max(-ymax, Math.min(ymax, b * Math.sin(t)))])
  }
  return sx > 0 ? out : out.reverse()
}

// ------------------------------------------------------------ the terrace
const RT = 16.0
{
  const ring = arc(0, 0, RT, 0, 360, 48).slice(0, -1)
  // the rusticated retaining wall in short pieces, so it follows the ground
  prism(stone, null, ring, -STREET, T) // down to the pools' level on the east and west
  capRing(trim, ring, T)
  // the parapet over the cascades, east and west (the stairs open north and south)
  for (const sx of [-1, 1]) {
    const a0 = sx > 0 ? -44 : 136, a1 = sx > 0 ? 44 : 224
    const outer = arc(0, 0, RT + 0.9, a0, a1, 10), inner = arc(0, 0, RT - 0.1, a1, a0, 10)
    const r = [...outer, ...inner]
    prism(stone, trim, r, T, T + 1.0)
  }
}

// ------------------------------------------------------------ the stairs, north and south
/** A flight in plan between radii r0 and r1, |x| <= hw, falling from z0 to z1; ruled into treads. */
function flight(sy: number, r0: number, r1: number, hw: number, z0: number, z1: number, treads: number) {
  const N = 6
  const xs = Array.from({ length: N + 1 }, (_, i) => -hw + (2 * hw * i) / N)
  const y = (x: number, r: number) => sy * Math.sqrt(Math.max(r * r - x * x, 0))
  for (let k = 0; k < treads; k++) {
    const ra = r0 + ((r1 - r0) * k) / treads, rb = r0 + ((r1 - r0) * (k + 1)) / treads
    const za = z0 + ((z1 - z0) * k) / treads, zb = z0 + ((z1 - z0) * (k + 1)) / treads
    for (let i = 0; i < N; i++) {
      const x0 = xs[i], x1 = xs[i + 1]
      // tread at za from ra to rb, then the riser down to zb at rb
      const A: V3 = [x0, y(x0, ra), za], B: V3 = [x1, y(x1, ra), za], C: V3 = [x1, y(x1, rb), za], D: V3 = [x0, y(x0, rb), za]
      if (sy > 0) trim.quad(A, B, C, D); else trim.quad(B, A, D, C)
      if (zb < za - 1e-6) {
        const C2: V3 = [C[0], C[1], zb], D2: V3 = [D[0], D[1], zb]
        if (sy > 0) stone.quad(C2, D2, D, C); else stone.quad(D2, C2, C, D)
      }
    }
  }
  // the outer riser down to the ground at r1 when the flight ends above it
  if (z1 > 0) {
    for (let i = 0; i < N; i++) {
      const x0 = xs[i], x1 = xs[i + 1]
      const a: V3 = [x0, y(x0, r1), 0], b: V3 = [x1, y(x1, r1), 0]
      if (sy > 0) stone.quad([b[0], b[1], 0], [a[0], a[1], 0], [a[0], a[1], z1], [b[0], b[1], z1]); else stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  // the side faces, down to the ground
  for (const sx of [-1, 1]) {
    const x = sx * hw, ya = y(x, r0), yb = y(x, r1)
    const P = (yy: number, z: number): V3 => [x, yy, z]
    const q = [P(ya, 0), P(yb, 0), P(yb, z1), P(ya, z0)]
    if (sx * sy > 0) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[1], q[0], q[3], q[2])
  }
}
for (const sy of [-1, 1]) {
  flight(sy, RT - 0.4, 21.7, 10.2, T, L, 6)
  flight(sy, 21.7, 25.5, 12.0, L, L, 1)
  flight(sy, 25.5, 30.4, 13.6, L, 0, 5)
  // cheek walls, sloping with the inner flight, and the candelabra pedestals
  for (const sx of [-1, 1]) {
    const x0 = sx * 10.2, x1 = sx * 11.6
    const ya = sy * 11.3, yb = sy * 22.6
    const xa = Math.min(x0, x1), xb = Math.max(x0, x1)
    const lo = Math.min(ya, yb), hi = Math.max(ya, yb)
    const zAt = (yy: number) => (Math.abs(yy) < 12 ? T + 1.0 : T + 1.0 + ((L - T) * (Math.abs(yy) - 12)) / 10.6)
    // walls: a sloping top from the terrace parapet down to the landing
    const pts: [number, number][] = [[xa, lo], [xb, lo], [xb, hi], [xa, hi]]
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 4]
      stone.quad([ax, ay, 0], [bx, by, 0], [bx, by, zAt(by)], [ax, ay, zAt(ay)])
    }
    trim.quad([xa, lo, zAt(lo)], [xb, lo, zAt(lo)], [xb, hi, zAt(hi)], [xa, hi, zAt(hi)])
    // the pedestal at the landing's outer corner, and the candelabrum on it
    const px = sx * 11.6, py = sy * 24.0, PT = L + 2.2
    prism(stone, trim, chamfer(rect(px - 1.2, py - 1.2, px + 1.2, py + 1.2), 0.2), 0, PT)
    const z0 = PT, H = 12.2
    lathe(bronze, px, py, [[0.75, z0], [0.7, z0 + 1.2], [0.42, z0 + 1.6], [0.3, z0 + 6.5], [0.42, z0 + 7.0], [0.25, z0 + 7.6], [0.2, z0 + 10.6], [0.32, z0 + 11.0], [0.01, z0 + H]], 6)
    // the crown of arms at two-thirds height, with its lamps
    lathe(bronze, px, py, [[0.3, z0 + 7.9], [1.5, z0 + 8.3], [1.5, z0 + 8.6], [0.3, z0 + 8.4]], 6)
    for (let k = 0; k < 4; k++) {
      const a = ((k + 0.5) / 4) * 2 * Math.PI
      lathe(lamp, px + Math.cos(a) * 1.5, py + Math.sin(a) * 1.5, [[0.01, z0 + 8.6], [0.32, z0 + 8.8], [0.32, z0 + 9.2], [0.01, z0 + 9.4]], 4)
    }
    lathe(lamp, px, py, [[0.01, z0 + 10.0], [0.4, z0 + 10.2], [0.4, z0 + 10.6], [0.01, z0 + 10.75]], 6)
  }
}

// ------------------------------------------------------------ the cascades, east and west
// Built after the lift to the street (below): their heights are above the pools.
function cascades() {
for (const sx of [-1, 1]) {
  // the lowest tier, a wide shallow basin to the pool's edge; the tiers'
  // tops are water (drawn in the pale glass blue so the cascades read)
  const a = halfOval(sx * 13.5, 15.2, 14.6, 12.4, sx, 12)
  prism(stone, glass, a, 0, 0.9)
  const b = halfOval(sx * 14.0, 10.2, 11.0, 11.0, sx, 12)
  prism(stone, glass, b, 0.9, 2.3)
  // the top bowl under the group, its water falling into the tiers
  lathe(stone, sx * 15.6, 0, [[4.3, 2.3], [4.3, 5.0]], 16, sx > 0 ? -90 : 90, sx > 0 ? 90 : 270)
  lathe(trim, sx * 15.6, 0, [[4.3, 5.0], [4.55, 5.0], [4.55, 5.4], [4.0, 5.4]], 16, sx > 0 ? -90 : 90, sx > 0 ? 90 : 270)
  lathe(glass, sx * 15.6, 0, [[4.0, 5.3], [0.01, 5.3]], 16, sx > 0 ? -90 : 90, sx > 0 ? 90 : 270)
}
}

// ------------------------------------------------------------ podium and pedestal
{
  // the cross-shaped podium (OSM way/339773760, squared)
  const cross: XY[] = [[-5.2, -9.2], [5.2, -9.2], [5.2, -8.0], [8.0, -8.0], [8.0, -4.3], [10.3, -4.3], [10.3, 4.3], [8.0, 4.3], [8.0, 8.0], [5.2, 8.0], [5.2, 9.2], [-5.2, 9.2], [-5.2, 8.0], [-8.0, 8.0], [-8.0, 4.3], [-10.3, 4.3], [-10.3, -4.3], [-8.0, -4.3], [-8.0, -8.0], [-5.2, -8.0]]
  prism(stone, trim, chamfer(cross, 0.25), T - 0.5, T + 1.5)
  // lower pedestal with battered corners, then the shaft of the pedestal
  block(stone, 7.6, T + 1.5, 7.6, T + 4.0, null)
  stone.loft([sq(7.6, T + 4.0), sq(6.4, T + 5.6)])
  block(stone, 6.3, T + 5.6, 6.3, 25.6, null)
  // cornice and its frieze
  block(trim, 6.3, 24.6, 6.6, 25.2, null)
  block(trim, 6.6, 25.2, 7.0, 26.0, null)
  block(trim, 7.0, 26.0, 7.0, 26.8, trim)
  // north and south: the bronze doors, the inscribed tablet and its pediment
  for (const sy of [-1, 1]) {
    const y = sy * 7.62, yt = sy * 6.33
    const q = (p: Part, x0: number, x1: number, z0: number, z1: number, yy: number) =>
      sy > 0 ? p.quad([x1, yy, z0], [x0, yy, z0], [x0, yy, z1], [x1, yy, z1]) : p.quad([x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1])
    q(bronze, -1.1, 1.1, T + 1.5, T + 4.0, y)
    q(trim, -2.6, 2.6, T + 7.0, T + 15.5, sy * 6.4)
    q(trim, -3.0, 3.0, T + 15.8, T + 16.8, sy * 6.42)
    // the cartouche over the tablet
    q(trim, -0.8, 0.8, T + 17.1, T + 19.0, sy * 6.42)
    void yt
  }
  // the four corner buttresses holding the soldier figures (drawn as plain piers)
  for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    prism(stone, trim, chamfer(rect(cx * 7.0 - 1.0, cy * 7.0 - 1.0, cx * 7.0 + 1.0, cy * 7.0 + 1.0), 0.2), T + 1.5, T + 8.5)
  }
}

// ------------------------------------------------------------ War and Peace, east and west
for (const sx of [-1, 1]) {
  const X = (d: number) => sx * d
  const box = (d0: number, d1: number, y0: number, y1: number, z0: number, z1: number, p = stone) =>
    prism(p, trim, chamfer(rect(Math.min(X(d0), X(d1)), y0, Math.max(X(d0), X(d1)), y1), 0.35), z0, z1)
  /** A carved figure: a body of revolution with shoulders and a head. */
  const figure = (d: number, y: number, z0: number, h: number, r: number) =>
    lathe(stone, X(d), y, [[r, z0], [r * 0.85, z0 + h * 0.62], [r, z0 + h * 0.78], [r * 0.45, z0 + h * 0.84], [r * 0.5, z0 + h * 0.93], [0.01, z0 + h]], 6)
  // the buttress over the bowl, with the lower scene (The Dying Soldier /
  // The Return Home): a row of seated and kneeling figures
  box(6.3, 10.3, -4.3, 4.3, T + 1.5, T + 3.0)
  for (const y of [-2.4, 0, 2.4]) figure(9.4, y, T + 3.0, y === 0 ? 2.6 : 2.0, 0.85)
  // the main group: a heap of figures banked against the pedestal, rising to
  // the central standing figure (Columbia), with figures at each side
  box(6.3, 9.0, -4.4, 4.4, T + 3.0, T + 5.4)
  box(6.3, 8.4, -3.6, 3.6, T + 5.4, T + 8.2)
  box(6.3, 7.6, -2.6, 2.6, T + 8.2, T + 11.0)
  for (const y of [-3.4, 3.4]) figure(8.3, y, T + 5.4, 4.2, 0.85)
  for (const y of [-1.6, 1.6]) figure(8.7, y, T + 5.4, 3.0, 0.8)
  figure(8.4, 0, T + 7.0, 6.6, 1.0)
  // raised arms, a banner and a sword at the group's shoulders
  beam(stone, [X(8.2), -3.4, T + 9.0], [X(8.6), -4.1, T + 12.4], 0.5)
  beam(stone, [X(8.4), 0.4, T + 12.4], [X(8.6), 0.9, T + 14.6], 0.45)
  beam(stone, [X(8.2), 3.4, T + 9.0], [X(8.5), 4.3, T + 11.6], 0.5)
  // the relief with its spread wings over the group
  box(6.3, 6.9, -3.6, 3.6, T + 11.0, T + 18.0)
  box(6.3, 7.3, -1.2, 1.2, T + 14.0, T + 17.6)
}

// ------------------------------------------------------------ trophies, upper pedestal, astragal
// bronze cannons and trophies round the foot of the upper pedestal
block(bronze, 5.4, 26.8, 4.4, 29.2)
for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  // cannon barrels pointing out over the corners
  beam(bronze, [cx * 4.2, cy * 2.6, 28.6], [cx * 6.0, cy * 3.2, 29.4], 0.55)
  beam(bronze, [cx * 2.6, cy * 4.2, 28.6], [cx * 3.2, cy * 6.0, 29.4], 0.55)
}
for (const sy of [-1, 1]) {
  // the eagles over the north and south tablets, wings spread
  const y = sy * 3.9
  const w = (x: number, z: number): V3 => [x, y, z]
  const q = (a: V3, b: V3, c: V3, d: V3) => { bronze.quad(a, b, c, d); bronze.quad(d, c, b, a) }
  q(w(-2.9, 31.0), w(0, 29.2), w(0, 31.6), w(-2.9, 32.4))
  q(w(0, 29.2), w(2.9, 31.0), w(2.9, 32.4), w(0, 31.6))
  lathe(bronze, 0, sy * 3.9, [[0.01, 29.0], [0.9, 29.4], [0.8, 30.8], [0.01, 31.2]], 8)
}
block(stone, 3.75, 26.8, 3.55, 35.6, null)
// the army astragal: a bronze band flaring outward, its corners turned up like horns
{
  const z0 = 35.6, z1 = 39.0
  bronze.loft([sq(3.6, z0, 0.3), sq(4.6, z0 + 1.6, 0.3), sq(5.2, z1, 0.3)])
  bronze.cap(sq(5.2, z1, 0.3), true)
  for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    beam(bronze, [cx * 4.6, cy * 4.6, z1 - 0.4], [cx * 5.9, cy * 5.9, 40.6], 0.55)
  }
  // the medallions on each face
  for (let f = 0; f < 4; f++) {
    const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
    lathe(bronze, c * 4.55, s * 4.55, [[0.01, 36.4], [0.9, 37.0], [0.9, 37.8], [0.01, 38.4]], 8)
  }
}

// ------------------------------------------------------------ the shaft and its crown
const SH0 = 39.0, SH1 = 63.6
const shaftHalf = (z: number) => 2.9 + (2.2 - 2.9) * ((z - SH0) / (SH1 - SH0))
block(stone, 2.9, SH0, 2.2, SH1, null, 0.3)
// slit windows on every face
for (let f = 0; f < 4; f++) {
  const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
  for (const z of [41.5, 47.7, 54.1, 60.3]) {
    const h = shaftHalf(z) + 0.03
    const P = (t: number, zz: number): V3 => [c * h - s * t, s * h + c * t, zz]
    win.quad(P(-0.22, z - 0.55), P(0.22, z - 0.55), P(0.22, z + 0.55), P(-0.22, z + 0.55))
  }
}
// the bronze date band ("1861", "1865") with its white tablet
block(bronze, 2.4, 63.6, 2.4, 65.6, bronze, 0.3)
for (let f = 0; f < 4; f++) {
  const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a), h = 2.43
  const P = (t: number, zz: number): V3 => [c * h - s * t, s * h + c * t, zz]
  trim.quad(P(-0.9, 64.15), P(0.9, 64.15), P(0.9, 65.05), P(-0.9, 65.05))
}
block(stone, 2.2, 65.6, 2.15, 68.6, null, 0.3)
// the capital of eagles, flaring out under the balcony
stone.loft([sq(2.15, 68.6, 0.3), sq(2.3, 69.4, 0.3), sq(2.8, 71.2, 0.3)])
for (let f = 0; f < 4; f++) {
  // three eagles a face, as bold lumps under the balcony
  const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
  for (const t of [-1.4, 0, 1.4]) {
    const h = 2.45
    lathe(stone, c * h - s * t, s * h + c * t, [[0.01, 69.2], [0.45, 69.6], [0.5, 70.6], [0.25, 71.1], [0.01, 71.2]], 6)
  }
}
block(trim, 2.95, 71.2, 2.95, 71.7)
// the balcony storey with its openings, a small cornice and the parapet
block(stone, 2.85, 71.7, 2.85, 74.0, null)
for (let f = 0; f < 4; f++) {
  const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a), h = 2.88
  const P = (t: number, zz: number): V3 => [c * h - s * t, s * h + c * t, zz]
  for (const t of [-1.35, 0, 1.35]) win.quad(P(t - 0.42, 72.2), P(t + 0.42, 72.2), P(t + 0.42, 73.5), P(t - 0.42, 73.5))
}
block(trim, 3.0, 74.0, 3.0, 74.4)
// the glazed observation lantern with stone corners, and the turret cap
block(glass, 2.1, 74.4, 2.1, 75.7, null, 0.2)
for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) prism(stone, null, rect(cx * 2.15 - 0.3, cy * 2.15 - 0.3, cx * 2.15 + 0.3, cy * 2.15 + 0.3), 74.4, 75.7)
block(trim, 2.3, 75.7, 2.3, 76.1)
block(stone, 1.7, 76.1, 1.55, 76.9)

// ------------------------------------------------------------ Victory
{
  // the globe, then the figure: robe, shoulders, head with its helmet
  lathe(bronze, 0, 0, [[0.6, 76.9], [0.8, 77.3], [0.85, 77.7], [0.6, 78.1], [0.01, 78.2]], 12)
  lathe(bronze, 0, 0, [[1.05, 78.0], [0.95, 79.4], [0.78, 81.2], [0.72, 82.4], [0.92, 83.1], [0.55, 83.6], [0.32, 83.75], [0.42, 84.1], [0.45, 84.6], [0.3, 85.0], [0.01, 85.1]], 12)
  // her left arm raised to the torch (east, as she faces south)
  beam(bronze, [0.75, 0, 83.1], [1.05, -0.1, 85.7], 0.38)
  beam(bronze, [1.05, -0.1, 85.4], [1.12, -0.1, 86.2], 0.55)
  lathe(bronze, 1.12, -0.1, [[0.01, 86.1], [0.3, 86.3], [0.15, 86.6], [0.01, 86.72]], 6)
  // her right arm lowered, the long sword held across her body
  beam(bronze, [-0.75, -0.1, 83.0], [-0.95, -0.5, 81.6], 0.35)
  beam(bronze, [-0.3, -0.6, 83.0], [-1.9, -0.6, 79.6], 0.22)
  // the folded wings of the helmet and the cloak behind
  beam(bronze, [0, 0.55, 83.2], [0, 0.95, 79.2], 0.7)
}

// ------------------------------------------------------------ the street and the pools
// Everything so far is drawn from the Circle's street; the pools (and so the
// model's y = 0, the lowest ground under it) lie STREET metres lower, so
// lift it all, then add the cascades, which stand in the pools.
for (const part of [stone, trim, bronze, win, glass, lamp]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += STREET
cascades()

// ------------------------------------------------------------ materials
// Floodlit from the candelabra and the terrace: brightest on the pedestal
// and the groups, fading up the shaft, the crown and Victory still lit.
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.3 : 1) * (p[2] < 30 ? 1 : p[2] < 66 ? 0.85 : 0.75)
const limestone = { ...finish('ind-limestone', 0xe7e1d6), floodlight: lit }
const trimLit = { ...PALETTE.trim, floodlight: lit }
const bronzeLit = { ...finish('ssm-bronze', 0x6f604f), floodlight: (p: V3) => (p[2] > 76 ? 0.8 : 0.5) }
const lampSwatch = finish('lamp', 0x4f4a42)
const built = finishGlb("Indiana Soldiers' and Sailors' Monument", [
  { part: stone, material: limestone },
  { part: trim, material: trimLit },
  { part: bronze, material: bronzeLit },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: lamp, material: lampSwatch },
], { bearing: 1.5, height: 86.72 + STREET, replaces: ['way/339773760'] }, 6500)

if (import.meta.main) await writeModel('ind-soldiers-and-sailors-monument', built)
