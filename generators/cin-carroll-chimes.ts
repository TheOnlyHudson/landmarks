/**
 * Carroll Chimes Bell Tower, Goebel Park, MainStrasse Village, Covington,
 * Kentucky (1979, German Gothic-style clock and carillon tower with a
 * Pied Piper glockenspiel) — original procedural geometry, CC0-1.0.
 * bun generators/cin-carroll-chimes.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 359.1 (OSM's outline). Anchor = centroid of OSM
 * way/1459654470, -84.520668, 39.084201.
 *
 * Identity (from the photos below):
 *  1. A slim red-brick shaft with recessed panels of slot openings.
 *  2. A half-timbered clock stage overhanging the shaft, a clock on each
 *     face, under a tall, steep dark metal spire with a crown finial.
 *  3. The glockenspiel: a balcony with a green canopy on the shaft over
 *     the arched passage, where the Pied Piper figures come out.
 *  4. A low brick annex with a metal roof and a little green turret.
 *
 * Plan: OSM way/1459654470 and its parts read in this frame: tower base x
 * -1.5..4.2, y -3.2..3.2 (part 1459654471); annex x -5.2..-1.5, y -2..2
 * (part 1459654472, tagged 4 m, gabled).
 *
 * Heights: published 100 ft (30.5 m) to the finial; OSM height 30. The
 * stages are scaled from LeMay's photo (shaft 230 px wide = 5 m): base
 * stage 5.8, glockenspiel balcony 6.6–8.1, canopy to 10.9, clock stage
 * 16.9–23.1 (clock centre 20.0, about 1.9 m across), spire 23.1–29.6,
 * finial to 30.5; annex eaves 5.2, ridge 7.5, turret spire to 12.
 * Estimated: every opening, the overhangs, the timbering pattern. No lidar
 * read (the published height and two photos settle it).
 *
 * Ground: Mapterhorn varies about 1 m over the park round it; elevation 0.
 *
 * Night: the clock faces glow (they are lit) and so do the glockenspiel
 * stage's windows.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Julian Carroll Bell Tower.jpg, Warren LeMay, CC0 (from the
 *    south-west: the annex on the west and the south face with its arch)
 *    https://commons.wikimedia.org/wiki/File:Julian_Carroll_Bell_Tower.jpg
 *  - CC Bell Tower.jpg, Fannybyrd, CC BY-SA 4.0 (straight on to the
 *    glockenspiel face, from the north)
 *    https://commons.wikimedia.org/wiki/File:CC_Bell_Tower.jpg
 * Look-only (not relied on): Flickr photos by Onasill ~ Bill (CC BY-NC-SA)
 * and SeeMidTN.com (CC BY-NC) of the glockenspiel.
 * No commercial imagery.
 *
 * Doubts: which face carries the glockenspiel rests on reasoning, not a
 * photo that shows it with the annex: LeMay's view shows the annex (west)
 * and an arched south face without it, and Fannybyrd's shows an arched
 * face with it, so it is put on the north face. The east face is not
 * photographed; it repeats the south face without the arch.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { archShape, box, gableRoof, onWall, pyramid, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { faces, type Face } from './cin-city-hall'

const brick = new Part(), dark = new Part(), infill = new Part(), win = new Part(), clock = new Part(), green = new Part()

const C: XY = [1.35, 0]
const BX = 2.85, BY = 3.2 // base half-sizes
const SX = 2.5, SY = 2.85 // shaft half-sizes
const BASE = 5.8, CL0 = 16.9, CL1 = 23.1, TIP = 29.6
const OV = 0.45 // clock stage overhang

/** A block standing d proud of face f, from s0 to s1 along it. */
function proud(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number, top: Part | null = p) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + n[0] * o, f[0][1] + t[1] * s + n[1] * o]
  const a = P(s0, -0.05), b = P(s1, d)
  box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, top, 0.08)
}
const len = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
const circle = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
function bar(s0: number, z0: number, s1: number, z1: number, w: number): [number, number][] {
  const l = Math.hypot(s1 - s0, z1 - z0), ns = (-(z1 - z0) / l) * w / 2, nz = ((s1 - s0) / l) * w / 2
  return [[s0 + ns, z0 + nz], [s0 - ns, z0 - nz], [s1 - ns, z1 - nz], [s1 + ns, z1 + nz]]
}

// ── base stage, shaft ──
box(brick, C[0] - BX, C[0] + BX, C[1] - BY, C[1] + BY, 0, BASE, null, 0.2)
box(infill, C[0] - BX - 0.08, C[0] + BX + 0.08, C[1] - BY - 0.08, C[1] + BY + 0.08, 0, 0.5, null, 0.05)
// the sloped weathering where the shaft steps in
brick.loft([
  [[C[0] - BX, C[1] - BY, BASE], [C[0] + BX, C[1] - BY, BASE], [C[0] + BX, C[1] + BY, BASE], [C[0] - BX, C[1] + BY, BASE]],
  [[C[0] - SX, C[1] - SY, BASE + 0.5], [C[0] + SX, C[1] - SY, BASE + 0.5], [C[0] + SX, C[1] + SY, BASE + 0.5], [C[0] - SX, C[1] + SY, BASE + 0.5]],
])
box(brick, C[0] - SX, C[0] + SX, C[1] - SY, C[1] + SY, BASE, CL0, null, 0.15)

const bf = faces(C[0] - BX, C[0] + BX, C[1] - BY, C[1] + BY)
const sf = faces(C[0] - SX, C[0] + SX, C[1] - SY, C[1] + SY)
// the arched passage through the base, north to south
for (const f of [bf.N, bf.S]) {
  const m = len(f) / 2
  onWall(brick, f[0], f[1], archShape(m, 2.9, 0.5, 2.55, 10), 0.08)
  onWall(dark, f[0], f[1], archShape(m, 2.2, 0.0, 2.55, 10), 0.14)
}
// shaft panels: two tiers of three slots in a recessed frame (N, E, W)
for (const f of [sf.S, sf.E, sf.W]) {
  const m = len(f) / 2
  for (const [z0, z1] of [[7.2, 10.1], [10.7, 15.2]]) {
    onWall(dark, f[0], f[1], rectShape(m - 1.55, m + 1.55, z0 - 0.15, z1 + 0.15), 0.03)
    for (const d of [-1.0, 0, 1.0]) {
      onWall(brick, f[0], f[1], rectShape(m + d - 0.5, m + d + 0.5, z0 - 0.15, z1 + 0.15), 0.06)
      onWall(win, f[0], f[1], rectShape(m + d - 0.32, m + d + 0.32, z0, z1), 0.09)
    }
  }
  proud(brick, f, 0.2, len(f) - 0.2, 10.15, 10.5, 0.15)
}
// north: the glockenspiel stage, three tall windows over it
{
  const f = sf.N, m = len(f) / 2
  proud(green, f, m - 1.7, m + 1.7, 6.5, 8.1, 1.0)
  onWall(win, f[0], f[1], rectShape(m - 1.4, m + 1.4, 8.1, 9.9), 0.06)
  for (const d of [-0.95, 0.95]) onWall(brick, f[0], f[1], rectShape(m + d - 0.08, m + d + 0.08, 8.1, 9.9), 0.1)
  // the canopy: a sloped green roof over the stage
  const L = len(f), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, o: number, z: number): [number, number, number] => [f[0][0] + t[0] * s + n[0] * o, f[0][1] + t[1] * s + n[1] * o, z]
  green.quad(P(m - 1.9, 1.15, 9.95), P(m + 1.9, 1.15, 9.95), P(m + 1.9, 0, 11.0), P(m - 1.9, 0, 11.0))
  green.quad(P(m - 1.9, 1.15, 9.75), P(m - 1.9, 0, 9.75), P(m + 1.9, 0, 9.75), P(m + 1.9, 1.15, 9.75))
  green.quad(P(m - 1.9, 1.15, 9.75), P(m + 1.9, 1.15, 9.75), P(m + 1.9, 1.15, 9.95), P(m - 1.9, 1.15, 9.95))
  green.tri(P(m - 1.9, 0, 9.75), P(m - 1.9, 1.15, 9.75), P(m - 1.9, 0, 11.0))
  green.tri(P(m + 1.9, 1.15, 9.75), P(m + 1.9, 0, 9.75), P(m + 1.9, 0, 11.0))
  for (const d of [-0.9, 0, 0.9]) {
    onWall(brick, f[0], f[1], rectShape(m + d - 0.45, m + d + 0.45, 11.3, 15.4), 0.04)
    onWall(win, f[0], f[1], rectShape(m + d - 0.32, m + d + 0.32, 11.5, 15.2), 0.08)
  }
}
// corbelled band under the clock stage
box(dark, C[0] - SX - 0.25, C[0] + SX + 0.25, C[1] - SY - 0.25, C[1] + SY + 0.25, CL0 - 0.45, CL0, null, 0.08)

// ── half-timbered clock stage ──
const QX = SX + OV, QY = SY + OV
box(dark, C[0] - QX, C[0] + QX, C[1] - QY, C[1] + QY, CL0, CL1, null, 0.1)
const qf = faces(C[0] - QX, C[0] + QX, C[1] - QY, C[1] + QY)
for (const f of [qf.N, qf.E, qf.S, qf.W]) {
  const L = len(f), m = L / 2, cz = 20.0, post = 0.28
  // tan infill between corner posts, a sill, a head rail and the posts beside the clock
  const cols: [number, number][] = [[post, m - 1.25], [m + 1.25, L - post]]
  for (const [s0, s1] of cols) {
    onWall(infill, f[0], f[1], rectShape(s0, s1, CL0 + 0.3, cz - 0.1), 0.04)
    onWall(infill, f[0], f[1], rectShape(s0, s1, cz + 0.15, CL1 - 0.35), 0.04)
    // a brace across each lower panel
    onWall(dark, f[0], f[1], bar(s0 + 0.1, CL0 + 0.35, s1 - 0.1, cz - 0.15, 0.22), 0.07)
    onWall(dark, f[0], f[1], bar(s0 + 0.1, CL1 - 0.4, s1 - 0.1, cz + 0.2, 0.22), 0.07)
  }
  onWall(infill, f[0], f[1], rectShape(m - 1.05, m + 1.05, CL0 + 0.3, CL1 - 0.35), 0.04)
  onWall(dark, f[0], f[1], circle(m, cz, 1.05, 16), 0.07)
  onWall(clock, f[0], f[1], circle(m, cz, 0.9, 16), 0.1)
  onWall(dark, f[0], f[1], bar(m, cz, m + 0.1, cz + 0.65, 0.1), 0.13)
  onWall(dark, f[0], f[1], bar(m, cz, m + 0.45, cz - 0.1, 0.1), 0.13)
}

// ── eaves and spire ──
{
  const E = QX + 0.55, F = QY + 0.55
  const ring = (hx: number, hy: number, z: number): [number, number, number][] => [[C[0] - hx, C[1] - hy, z], [C[0] + hx, C[1] - hy, z], [C[0] + hx, C[1] + hy, z], [C[0] - hx, C[1] + hy, z]]
  dark.loft([ring(QX, QY, CL1 - 0.3), ring(E, F, CL1)])
  dark.loft([ring(E, F, CL1), ring(E, F, CL1 + 0.3)])
  // a flared kick at the eaves, then the steep spire
  dark.loft([ring(E, F, CL1 + 0.3), ring(QX - 0.25, QY - 0.25, CL1 + 1.3)])
  dark.loft([ring(QX - 0.25, QY - 0.25, CL1 + 1.3), ring(0.12, 0.12, TIP)])
  dark.cap(ring(0.12, 0.12, TIP), true)
  // the crown finial
  revolve(clock, C, [[0.45, TIP], [0.45, TIP + 0.25], [0.05, TIP + 0.3]], 8, 0, true, false)
  box(clock, C[0] - 0.06, C[0] + 0.06, C[1] - 0.06, C[1] + 0.06, TIP, 30.5, clock, 0)
}

// ── the annex: brick walls, metal gable roof, a little green turret ──
{
  const X0 = -5.2, X1 = C[0] - BX, Y0 = -2.0, Y1 = 2.05, EAVE = 5.2, RIDGE = 7.5
  box(brick, X0, X1 + 0.1, Y0, Y1, 0, EAVE, null, 0.12)
  box(infill, X0 - 0.06, X1 + 0.1, Y0 - 0.06, Y1 + 0.06, 0, 0.5, null, 0.05)
  gableRoof(dark, brick, X0, X1, Y0, Y1, EAVE, RIDGE, 'x', 0.35, 0.3)
  const af = faces(X0, X1, Y0, Y1)
  for (const f of [af.N, af.S]) onWall(win, f[0], f[1], archShape(len(f) / 2, 0.9, 1.4, 3.2, 6), 0.06)
  onWall(dark, af.W[0], af.W[1], rectShape(len(af.W) / 2 - 0.55, len(af.W) / 2 + 0.55, 0.0, 2.4), 0.06)
  const T: XY = [X0 + 0.9, 0]
  box(dark, T[0] - 0.6, T[0] + 0.6, T[1] - 0.6, T[1] + 0.6, 5.5, 9.6, null, 0.06)
  for (const f of Object.values(faces(T[0] - 0.6, T[0] + 0.6, T[1] - 0.6, T[1] + 0.6))) onWall(win, f[0], f[1], archShape(0.6, 0.45, 8.2, 9.0, 4), 0.04)
  box(green, T[0] - 0.78, T[0] + 0.78, T[1] - 0.78, T[1] + 0.78, 9.6, 9.85, null, 0.05)
  pyramid(green, T, 0.72, 9.85, 11.6, 8, Math.PI / 8)
  box(clock, T[0] - 0.05, T[0] + 0.05, T[1] - 0.05, T[1] + 0.05, 11.5, 12.2, clock, 0)
}

await save('cin-carroll-chimes', 'Carroll Chimes Bell Tower', [
  { part: brick, material: finish('cin-chimes-brick', 0xc87c5c) },
  { part: dark, material: finish('cin-chimes-timber', 0x5f5246) },
  { part: infill, material: finish('cin-chimes-infill', 0xe2c49c) },
  { part: win, material: PALETTE.window },
  { part: clock, material: windowVariant(2, 0xf2efe7) },
  { part: green, material: PALETTE.copper },
], { height: 30.5, anchor: [39.084201, -84.520668], bearing: 359.1 })
