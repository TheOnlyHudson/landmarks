/**
 * Old St. Mary's Church, 123 East Thirteenth Street, Over-the-Rhine,
 * Cincinnati (1841-42, Greek Revival with a later clock steeple) —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-old-st-marys.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 348.8, the Over-the-Rhine street grid: the front
 * faces Thirteenth Street at +y (north), the nave runs south along -y.
 * Anchor = centroid of OSM way/46695107, -84.512360, 39.109517.
 *
 * Identity (from the photos below):
 *  1. The white steeple rising from the middle of the front: a square
 *     shaft with a lancet and a quatrefoil over the gable, a clock stage
 *     with a clock on each face, an arcaded octagonal lantern and a green
 *     copper spire with a ball and cross.
 *  2. A plain cream-painted brick temple front: three round-arched doors
 *     in pale stone surrounds, three oculi, pilasters, an entablature and
 *     a low gable with raised corner blocks.
 *  3. Long sides of tall round-headed traceried windows between
 *     pilasters, under a grey gabled roof.
 *
 * Plan: OSM way/46695107 read in the turned frame: nave x ±10.5,
 * y -26.9..26.3; the tower's base projects to y 28.2 over x ±3.8.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown 2021), 0.5 m grid sampled at 1 m in this frame; y = 0 is
 * Thirteenth St in front (lidar ground_min + 0.8). Measured: eaves 15.1,
 * ridge 20.2; tower shaft 8 m square to 32.7; clock stage about 6 m
 * square to 40.9; lantern to about 45; spire top return 52.9 (the tip
 * and cross are thinner than the grid; spire drawn to 54.7, cross 56.7).
 * Estimated from the photos: openings, oculi, pilasters, the entablature,
 * the lantern's width, the clock size, the window count (seven bays).
 *
 * Ground: Mapterhorn and lidar are within about 1 m over the site;
 * elevation 0.
 *
 * Night: windows, oculi and the clock faces glow (the clocks are lit).
 *
 * Photos (Wikimedia Commons, all EVIDENCE, Warren LeMay, CC0):
 *  - Old St. Mary's Catholic Church, Over-the-Rhine, Cincinnati, OH
 *    (46437329365).jpg (steeple and the west side from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Old_St._Mary%27s_Catholic_Church,_Over-the-Rhine,_Cincinnati,_OH_(46437329365).jpg
 *  - ... (46629189804).jpg (the front on Thirteenth St)
 *    https://commons.wikimedia.org/wiki/File:Old_St._Mary%27s_Catholic_Church,_Over-the-Rhine,_Cincinnati,_OH_(46629189804).jpg
 *  - ... (46437327725).jpg (the south end from the rear: the attached
 *    rectory, not modelled; it is outside the OSM outline)
 *    https://commons.wikimedia.org/wiki/File:Old_St._Mary%27s_Catholic_Church,_Over-the-Rhine,_Cincinnati,_OH_(46437327725).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east side is not photographed; it mirrors the west. The
 * clock stage's width rests on the 1 m lidar edge cells.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import type { Face } from './cin-city-hall'

/** A pointed (lancet) opening of width w centred at s, from z0, springing at zs. */
export function lancet(s: number, w: number, z0: number, zs: number, seg = 5): [number, number][] {
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  // right flank: centred on the left jamb, radius w, from the right jamb up to the apex
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(a), zs + w * Math.sin(a)]) }
  // left flank: centred on the right jamb, from just past the apex down to the left jamb
  for (let i = seg - 1; i >= 0; i--) { const a = (i / seg) * (Math.PI / 3); pts.push([s + w / 2 - w * Math.cos(a), zs + w * Math.sin(a)]) }
  return pts
}

const circ = (s: number, z: number, r: number, n = 14): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

if (import.meta.main) {
  const wallP = new Part(), trim = new Part(), win = new Part(), roof = new Part(), cu = new Part(), dark = new Part()

  const X = 10.5, Y0 = -26.9, Y1 = 26.3, EAVE = 15.1, RIDGE = 20.2
  const L = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  /** A box standing d proud of face f from s0 to s1 (axis-aligned faces). */
  function slab(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
    const l = L(f), t: XY = [(f[1][0] - f[0][0]) / l, (f[1][1] - f[0][1]) / l], nn: XY = [t[1], -t[0]]
    const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + nn[0] * o, f[0][1] + t[1] * s + nn[1] * o]
    const a = P(s0, -0.05), b = P(s1, d)
    box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, p, 0.1)
  }

  // ── nave ──
  box(wallP, -X, X, Y0, Y1, 0, EAVE, null, 0)
  cornice(trim, [[-X, Y0], [X, Y0], [X, Y1], [-X, Y1]], EAVE - 1.0, 1.0, 0.45, trim)
  gableRoof(roof, wallP, -X, X, Y0, Y1, EAVE, RIDGE, 'y', 0.45, 0.35)
  // plinth
  box(trim, -X - 0.15, X + 0.15, Y0 - 0.15, Y1 + 0.15, 0, 0.9, trim, 0.05)

  // ── sides: seven bays of tall round-headed traceried windows between pilasters ──
  const sides: Face[] = [[[-X, Y1], [-X, Y0]], [[X, Y0], [X, Y1]]]
  const nb = 7, bw = (Y1 - Y0) / nb
  for (const f of sides) {
    for (let k = 0; k <= nb; k++) slab(trim, f, k * bw - 0.45, k * bw + 0.45, 0.9, EAVE - 1.0, 0.3)
    for (let k = 0; k < nb; k++) {
      const s = bw * (k + 0.5)
      onWall(trim, f[0], f[1], archShape(s, 3.0, 3.0, 11.6, 10), 0.05)
      onWall(win, f[0], f[1], archShape(s, 2.4, 3.3, 11.6, 10), 0.09)
      // Y tracery: a mullion forking under the head
      onWall(trim, f[0], f[1], rectShape(s - 0.09, s + 0.09, 3.3, 11.4), 0.12)
      onWall(trim, f[0], f[1], rectShape(s - 1.2, s + 1.2, 7.4, 7.58), 0.12)
    }
  }
  // the south (rear) gable end: two windows
  {
    const f: Face = [[-X, Y0], [X, Y0]]
    for (const s of [6, 15]) onWall(win, f[0], f[1], archShape(s, 2.2, 4, 11, 10), 0.06)
  }

  // ── front on Thirteenth St ──
  {
    const f: Face = [[X, Y1], [-X, Y1]] // s = X - x
    // corner pilasters and the pilasters flanking the tower bay
    for (const s of [0.5, 2 * X - 0.5]) slab(trim, f, s - 0.6, s + 0.6, 0.9, EAVE - 1.0, 0.35)
    // entablature band and the raised corner blocks over the eaves
    slab(trim, f, -0.2, 2 * X + 0.2, EAVE - 1.6, EAVE - 0.9, 0.3)
    for (const s of [0.9, 2 * X - 0.9]) slab(trim, f, s - 0.9, s + 0.9, EAVE - 1.0, EAVE + 1.8, 0.4)
    // side doors with fanlights in stone surrounds, oculi over them
    for (const s of [3.5, 17.5]) {
      onWall(trim, f[0], f[1], archShape(s, 3.2, 0.9, 4.0, 10), 0.06)
      onWall(dark, f[0], f[1], rectShape(s - 1.15, s + 1.15, 0.9, 3.7), 0.1)
      onWall(win, f[0], f[1], archShape(s, 2.3, 3.75, 4.0, 10), 0.1)
      onWall(trim, f[0], f[1], circ(s, 9.8, 1.45), 0.06)
      onWall(win, f[0], f[1], circ(s, 9.8, 1.05), 0.1)
    }
    // raking trim on the gable
    for (const k of [-1, 1]) {
      const sec = (x: number, z: number): V3[] => [[x, Y1 + 0.35, z], [x, Y1 + 0.35, z - 0.5], [x, Y1 - 0.05, z - 0.5], [x, Y1 - 0.05, z]]
      trim.sweep(k < 0 ? [sec(-X, EAVE + 0.5), sec(-4, EAVE + 0.5 + (RIDGE - EAVE) * (X - 4) / X)] : [sec(4, EAVE + 0.5 + (RIDGE - EAVE) * (X - 4) / X), sec(X, EAVE + 0.5)])
    }
  }

  // ── tower ──
  const C: XY = [0, 24.1], TA = 32.7, TB = 40.9
  {
    box(wallP, -4, 4, 20.1, 28.1, 0, TA - 0.8, null, 0)
    const fT: Face = [[4, 28.1], [-4, 28.1]]
    for (const s of [0.45, 7.55]) slab(trim, fT, s - 0.45, s + 0.45, 0.9, TA - 1.0, 0.25)
    // main door, oculus and the plaque
    onWall(trim, fT[0], fT[1], archShape(4, 3.4, 0.9, 4.4, 10), 0.06)
    onWall(dark, fT[0], fT[1], rectShape(2.75, 5.25, 0.9, 4.1), 0.1)
    onWall(win, fT[0], fT[1], archShape(4, 2.5, 4.15, 4.4, 10), 0.1)
    onWall(trim, fT[0], fT[1], circ(4, 9.2, 1.45), 0.06)
    onWall(win, fT[0], fT[1], circ(4, 9.2, 1.05), 0.1)
    onWall(dark, fT[0], fT[1], circ(4, 12.6, 1.0, 12).map(([a, b]) => [4 + (a - 4) * 1.4, b] as [number, number]), 0.06)
    // entablature across the tower bay at the front's line
    slab(trim, fT, -0.2, 8.2, EAVE - 1.6, EAVE - 0.9, 0.3)
    // the shaft over the roof: a lancet and a quatrefoil on each face
    const tf: Face[] = [fT, [[-4, 20.1], [4, 20.1]], [[4, 20.1], [4, 28.1]], [[-4, 28.1], [-4, 20.1]]]
    for (const f of tf) {
      onWall(trim, f[0], f[1], lancet(4, 1.9, 22.6, 26.0), 0.05)
      onWall(win, f[0], f[1], lancet(4, 1.4, 22.8, 26.0), 0.09)
      onWall(trim, f[0], f[1], circ(4, 29.8, 0.85, 12), 0.05)
      onWall(win, f[0], f[1], circ(4, 29.8, 0.6, 12), 0.09)
    }
    cornice(trim, [[-4, 20.1], [4, 20.1], [4, 28.1], [-4, 28.1]], TA - 0.8, 0.8, 0.45, roof)
    // clock stage
    box(wallP, -3.3, 3.3, 20.8, 27.4, TA, TB - 0.7, null, 0)
    const cf: Face[] = [[[3.3, 27.4], [-3.3, 27.4]], [[-3.3, 20.8], [3.3, 20.8]], [[3.3, 20.8], [3.3, 27.4]], [[-3.3, 27.4], [-3.3, 20.8]]]
    for (const f of cf) {
      for (const s of [0.35, 6.25]) slab(trim, f, s - 0.35, s + 0.35, TA, TB - 0.7, 0.2)
      onWall(trim, f[0], f[1], lancet(3.3, 1.3, 33.6, 35.9), 0.05)
      onWall(win, f[0], f[1], lancet(3.3, 0.95, 33.8, 35.9), 0.09)
      onWall(trim, f[0], f[1], circ(3.3, 38.4, 1.4, 16), 0.05)
      onWall(dark, f[0], f[1], circ(3.3, 38.4, 1.15, 16), 0.09)
    }
    cornice(trim, [[-3.3, 20.8], [3.3, 20.8], [3.3, 27.4], [-3.3, 27.4]], TB - 0.9, 0.9, 0.55, roof)
    // lantern: an octagon with arched openings
    revolve(wallP, C, [[2.1, TB], [2.1, TB + 0.5], [1.8, TB + 0.6], [1.8, 44.6]], 8, Math.PI / 8, true, false)
    revolve(trim, C, [[1.8, 44.6], [2.2, 44.8], [2.2, 45.3], [1.6, 45.4]], 8, Math.PI / 8, true, false)
    const a = 1.8 * Math.cos(Math.PI / 8), hw = 1.8 * Math.sin(Math.PI / 8)
    const lf: Face[] = [[[hw, C[1] + a], [-hw, C[1] + a]], [[-hw, C[1] - a], [hw, C[1] - a]], [[a, C[1] - hw], [a, C[1] + hw]], [[-a, C[1] + hw], [-a, C[1] - hw]]]
    for (const f of lf) onWall(win, f[0], f[1], archShape(hw, 0.8, TB + 1.0, 43.4, 6), 0.03)
    // copper spire, ball and cross
    revolve(cu, C, [[1.6, 45.4], [0, 54.7]], 8, Math.PI / 8, true, false)
    revolve(dark, C, [[0.0, 54.4], [0.3, 54.6], [0.3, 54.9], [0, 55.1]], 8, 0, true, false)
    box(dark, -0.1, 0.1, C[1] - 0.1, C[1] + 0.1, 55.0, 56.7, dark, 0)
    box(dark, -0.5, 0.5, C[1] - 0.1, C[1] + 0.1, 55.9, 56.15, dark, 0)
  }

  await save('cin-old-st-marys', "Old St. Mary's Church", [
    { part: wallP, material: finish('osm-painted-brick', 0xf0e9d8) },
    { part: trim, material: finish('osm-trim', 0xf7f1e3) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: cu, material: PALETTE.copper },
    { part: dark, material: finish('osm-door', 0x4f4a44) },
  ], { height: 56.7, anchor: [39.109517, -84.51236], bearing: 348.8 })
}
