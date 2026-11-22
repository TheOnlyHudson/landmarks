/**
 * Cincinnati City Hall, 801 Plum Street, Cincinnati (1893, Samuel Hannaford,
 * Richardsonian Romanesque) — original procedural geometry, CC0-1.0.
 * bun generators/cin-city-hall.ts
 *
 * Also exports the small facade kit (`faces`, `windowRow`, `mansard`,
 * `roundedRect`) that the other cin- civic generators in this batch use;
 * merge this file first.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 349.1, the downtown street grid: +x runs along
 * Eighth Street toward Plum Street, +y up Plum Street toward Ninth.
 * Anchor = centroid of OSM relation/19839330, -84.519596, 39.104165.
 *
 * Identity (from the photos below):
 *  1. The tall square clock tower on the corner of Plum and Eighth: buff
 *     sandstone with red bands, rounded corners, a clock on each face, tall
 *     arched belfry lights, four corner turrets with conical caps and a
 *     steep red-tile pyramid with an iron cross.
 *  2. A block-long, four-storey range round two courtyards: a red granite
 *     ground storey, buff rock-faced sandstone above with red string
 *     courses, round-arched windows, and steep red-tile mansard roofs with
 *     gabled wall dormers.
 *  3. Big steep hipped pavilions at the Plum and Central ends, each with a
 *     front gable and round corner turrets with conical roofs; smaller
 *     pyramid-roofed pavilions mid-way along Eighth and Ninth and at the
 *     other corners.
 *
 * Plan: OSM relation/19839330 (outline with two courtyards) and the
 * building:part ways in relation/3683352, read in the turned frame:
 * outer faces x ±42, y ±30; Plum/Central pavilions x ±(32.5..50.5),
 * y ±11, with round turrets r 2.7 at x ±48.7, y ±9.6; tower x 32.4..42.6,
 * y -30.6..-19.5; corner pavilions and the Eighth/Ninth pavilions from
 * their parts. The courtyards are drawn from the lidar (below), which puts
 * the wings' inner faces at y ±14, x -20 and x 24.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown 2021), 1 m grid, read in this frame. ground_min (the west
 * courtyard) is y = 0; the streets are 1.0-1.5 up. Measured: wing eaves
 * 27-30, mansard flats 35.7; Plum/Central pavilion ridges 47-51; corner
 * pavilions about 38; link block between the courtyards 23.5, the east
 * courtyard's low infill 6.5; chimney 44.8; tower stonework 54.3, corner
 * turrets about 60.5, cross 78.9. OSM's part heights (18 m wings, 27 m
 * pavilions) are far below the lidar and are not used.
 * Estimated from the photos: storey and window heights, the string
 * courses, dormer sizes, the clock (about 47 m) and belfry (37-44.5 m),
 * the turret radii.
 *
 * Ground: Mapterhorn over the block varies 0-2 m; elevation 0.
 *
 * Night: windows glow; the clock faces and the main doors use `entrance`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - CincinnatiCityHall.jpg, Greg Hume, CC BY-SA 3.0 (from the south-east:
 *    tower, Eighth St range, Plum St pavilion)
 *    https://commons.wikimedia.org/wiki/File:CincinnatiCityHall.jpg
 *  - St. Peter in Chains - Cincinnati City Hall.jpg, Farragutful, CC BY-SA
 *    4.0 (from the south-east across Eighth St)
 *    https://commons.wikimedia.org/wiki/File:St._Peter_in_Chains_-_Cincinnati_City_Hall.jpg
 *  - Cincinnati City Hall, Cincinnati, OH (32411548547).jpg, Warren LeMay,
 *    CC0 (the Plum St entrance bay, looking up)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_City_Hall,_Cincinnati,_OH_(32411548547).jpg
 * No look-only sources. No commercial imagery.
 *
 * Rework (lead review): the tower is now a full square mass 14.2 m a
 * side standing about 3 m proud of the Eighth and Plum St faces (OSM's
 * 10.2 m tower part is drawn as the core; the photo shows the tower much
 * broader and clearly projecting), with a bold clock in a red ring, a
 * three-light belfry arcade under a red arch, larger corner turrets and
 * a wider steep pyramid; heights unchanged (lidar). The fronts are now
 * window groups after the photo (paired ground-storey windows, arched
 * triples under red relieving arches, square-headed pairs, a three-light
 * arcade in the top storey); the sandstone is warmer.
 *
 * Doubts: the Ninth St and Central Ave fronts and the courtyards are not
 * in the photos; they are drawn like the Eighth and Plum fronts. Window
 * groups follow a regular 6.4 m rhythm, not the real irregular grouping. The
 * west end lies outside the lidar crop beyond x -45; it mirrors the east.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, at, band, box, capPoly, cornice, gableRoof, hipRoof, onWall, pyramid, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'

// ─────────────────────────────── shared kit ───────────────────────────────

export type Face = [XY, XY]
/** The four faces of a box, each with its outside to the right of a→b. */
export function faces(x0: number, x1: number, y0: number, y1: number) {
  return {
    S: [[x0, y0], [x1, y0]] as Face, E: [[x1, y0], [x1, y1]] as Face,
    N: [[x1, y1], [x0, y1]] as Face, W: [[x0, y1], [x0, y0]] as Face,
  }
}
export const faceLen = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])

export type Row = { z0: number; z1: number; w: number; arch?: boolean }
/**
 * A row of windows along a face at a regular pitch, centred on the face
 * between `m` metres of plain wall at each end: one panel per real window,
 * round-headed (a true semicircle) where `arch` is set.
 */
export function windowRow(p: Part, f: Face, pitch: number, rows: Row[], m = 1.5, out = 0.06, s0 = 0, s1 = faceLen(f)) {
  const L = s1 - s0 - 2 * m
  if (L < 1) return
  const n = Math.max(1, Math.floor(L / pitch + 0.5))
  const step = L / n
  for (let k = 0; k < n; k++) {
    const s = s0 + m + step * (k + 0.5)
    for (const r of rows) {
      if (r.arch) onWall(p, f[0], f[1], archShape(s, r.w, r.z0, r.z1 - r.w / 2, 8), out)
      else onWall(p, f[0], f[1], rectShape(s - r.w / 2, s + r.w / 2, r.z0, r.z1), out)
    }
  }
}

/** A rectangular range with walls to `eave` and a mansard rising `inset` inward to a flat at `top`. */
export function mansard(walls: Part, roof: Part, x0: number, x1: number, y0: number, y1: number, z0: number, eave: number, top: number, inset: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const i: XY[] = [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]]
  wall(walls, r, z0, eave)
  roof.loft([at(r, eave), at(i, top)])
  capPoly(roof, i, top, true)
}

/** A rectangle with rounded corners of radius r, counter-clockwise. */
export function roundedRect(x0: number, x1: number, y0: number, y1: number, r: number, seg = 3): XY[] {
  const out: XY[] = []
  const cs: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]
  for (const [cx, cy, a0] of cs) for (let k = 0; k <= seg; k++) {
    const a = a0 + (k / seg) * (Math.PI / 2)
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return out
}

/** A round turret: drum to z1, a ring cornice, a cone to apex. */
export function turret(wallP: Part, roofP: Part, c: XY, r: number, z0: number, z1: number, apex: number, n = 12) {
  revolve(wallP, c, [[r, z0], [r, z1]], n, 0, false, false)
  revolve(wallP, c, [[r, z1], [r + 0.25, z1 + 0.1], [r + 0.25, z1 + 0.5]], n, 0, true, false)
  revolve(roofP, c, [[r + 0.25, z1 + 0.5], [0, apex]], n, 0, false, true)
}

// ──────────────────────────────── City Hall ───────────────────────────────

if (import.meta.main) {
  const buff = new Part(), red = new Part(), tile = new Part(), win = new Part(), door = new Part(), flat = new Part()

  const EAVE = 27.5, FLAT = 35.7, BASE = 6.0
  // storeys: granite ground floor, an arched main floor, a square-headed floor, an arched top floor
  const ROWS: Row[] = [
    { z0: 1.8, z1: 4.6, w: 1.5 },
    { z0: 7.4, z1: 12.6, w: 1.9, arch: true },
    { z0: 14.6, z1: 18.8, w: 1.7 },
    { z0: 20.8, z1: 25.4, w: 1.5, arch: true },
  ]
  const UPPER = ROWS.slice(1)
  void UPPER
  /**
   * The Romanesque window groups (Hume's photo): per group a pair of
   * square-headed granite-storey windows, an arched triple under a red
   * relieving arch on the main floor, a square-headed pair above, and a
   * close arcade of three round-arched lights in the top storey.
   */
  function arcade(f: Face, s0: number, s1: number, pitch = 6.4, m = 1.0) {
    const L = s1 - s0 - 2 * m
    if (L < 2.5) return
    const n = Math.max(1, Math.round(L / pitch)), w = L / n
    for (let k = 0; k < n; k++) {
      const s = s0 + m + w * (k + 0.5), sc = Math.min(1, (w - 0.8) / 5.6)
      for (const d of [-1, 1]) onWall(win, f[0], f[1], rectShape(s + d * 1.0 * sc - 0.6 * sc, s + d * 1.0 * sc + 0.6 * sc, 1.8, 4.4), 0.06)
      onWall(red, f[0], f[1], archShape(s, 5.0 * sc, 7.0, 10.4, 8), 0.04)
      for (const d of [-1.45, 0, 1.45]) onWall(win, f[0], f[1], archShape(s + d * sc, 1.15 * sc, 7.4, 10.8, 6), 0.08)
      for (const d of [-0.95, 0.95]) onWall(win, f[0], f[1], rectShape(s + d * sc - 0.65 * sc, s + d * sc + 0.65 * sc, 14.6, 18.6), 0.06)
      onWall(red, f[0], f[1], rectShape(s - 2.5 * sc, s + 2.5 * sc, 20.5, 20.8), 0.08)
      for (const d of [-1.3, 0, 1.3]) onWall(win, f[0], f[1], archShape(s + d * sc, 1.05 * sc, 21.0, 24.4, 6), 0.06)
    }
  }

  /** A wall mass with the red granite ground storey and buff above. */
  function mass(x0: number, x1: number, y0: number, y1: number, z1: number) {
    box(red, x0, x1, y0, y1, 0, BASE, null, 0)
    box(buff, x0, x1, y0, y1, BASE, z1, null, 0)
  }
  /** Red string courses and the eaves cornice round a box. */
  function courses(x0: number, x1: number, y0: number, y1: number, zs: number[], eave: number) {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (const z of zs) band(red, r, z, 0.45, 0.12, null)
    cornice(red, r, eave - 0.9, 0.9, 0.45, null)
  }
  /** A gabled wall dormer standing on the eaves of face f at s. */
  function dormer(f: Face, s: number, w = 3.6) {
    const L = faceLen(f), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], nn: XY = [t[1], -t[0]]
    const P = (ss: number, d: number): XY => [f[0][0] + t[0] * ss + nn[0] * d, f[0][1] + t[1] * ss + nn[1] * d]
    // the dormer's front sits in the wall plane and runs 3.5 m back into the roof
    const a = P(s - w / 2, 0), b = P(s + w / 2, 0), c = P(s + w / 2, -3.5), d = P(s - w / 2, -3.5)
    const zt = EAVE + 3.0, zp = zt + w * 0.75
    wall(buff, [a, b, c, d], EAVE - 0.5, zt)
    // gable triangle on the front, roof slopes back
    const m0 = P(s, 0), m1 = P(s, -3.5)
    buff.tri([a[0], a[1], zt], [b[0], b[1], zt], [m0[0], m0[1], zp])
    const o = 0.25
    const A = P(s - w / 2 - o, 0.3), B = P(s + w / 2 + o, 0.3), C = P(s + w / 2 + o, -3.5), D = P(s - w / 2 - o, -3.5)
    const M0 = P(s, 0.3)
    tile.quad([B[0], B[1], zt - 0.2], [C[0], C[1], zt - 0.2], [m1[0], m1[1], zp + 0.2], [M0[0], M0[1], zp + 0.2])
    tile.quad([D[0], D[1], zt - 0.2], [A[0], A[1], zt - 0.2], [M0[0], M0[1], zp + 0.2], [m1[0], m1[1], zp + 0.2])
    onWall(win, f[0], f[1], archShape(s, 1.3, EAVE - 0.2, zt - 0.4, 8), 0.06)
  }

  // ── The ranges round the courtyards ──
  const OX = 42, OY = 30
  const ranges: [number, number, number, number][] = [
    [-OX, OX, -OY, -14], // Eighth St
    [-OX, OX, 14, OY], // Ninth St
    [-OX, -20, -OY, OY], // Central Ave
    [24, OX, -OY, OY], // Plum St
  ]
  for (const [x0, x1, y0, y1] of ranges) {
    box(red, x0, x1, y0, y1, 0, BASE, null, 0)
    mansard(buff, tile, x0, x1, y0, y1, BASE, EAVE, FLAT, 4.2)
  }
  // string courses on the outer faces and the courtyard faces
  courses(-OX, OX, -OY, OY, [BASE, 13.6, 19.8], EAVE)
  // the link block between the courtyards, and the east courtyard's infill
  mass(-3, 13, -14, 14, 23.5)
  capPoly(flat, [[-3, -14], [13, -14], [13, 14], [-3, 14]], 23.5, true)
  box(flat, 13, 24, -14, 14, 0, 6.5, flat, 0)
  {
    // windows on the courtyard faces (inner faces of the ranges)
    const cy: Face[] = [[[-3, -14], [-20, -14]], [[-20, 14], [-3, 14]], [[-20, -14], [-20, 14]], [[-3, 14], [-3, -14]]]
    for (const f of cy) windowRow(win, f, 4.2, [ROWS[1], ROWS[2], ROWS[3]].map((r) => ({ ...r, arch: false })), 1.2)
    const cy2: Face[] = [[[24, -14], [13, -14]], [[13, 14], [24, 14]], [[24, 14], [24, -14]]]
    for (const f of cy2) windowRow(win, f, 4.2, [ROWS[2], ROWS[3]].map((r) => ({ ...r, arch: false })), 1.2)
    const link = faces(-3, 13, -14, 14)
    windowRow(win, [link.E[0], link.E[1]], 4.2, [{ z0: 8.0, z1: 12.5, w: 1.6 }, { z0: 14.6, z1: 18.8, w: 1.6 }], 1.2)
  }
  // chimney in the east courtyard
  revolve(red, [15.6, -7.7], [[1.5, 0], [1.5, 43.6], [1.8, 43.8], [1.8, 44.8]], 10, 0, false, true)

  // ── Outer fronts: windows and dormers on the plain stretches ──
  const front = (f: Face, s0: number, s1: number, dormers: number[]) => {
    arcade(f, s0, s1)
    for (const s of dormers) dormer(f, s)
  }
  // Eighth St (south): runs west→east, x = -42 + s
  const S8: Face = [[-OX, -OY], [OX, -OY]]
  front(S8, 9.6, 33.7, [14.5, 28.7]) // between SW pavilion and the Eighth St pavilion
  front(S8, 50.3, 72.6, [55.2, 68.5]) // between it and the tower
  // Ninth St (north): runs east→west, x = 42 - s
  const N9: Face = [[OX, OY], [-OX, OY]]
  front(N9, 10.0, 33.7, [14.5, 28.7])
  front(N9, 50.3, 74.2, [55.2, 69.5])
  // Plum (east) and Central (west) between the corner blocks and the end pavilions
  const EP: Face = [[OX, -OY], [OX, OY]], WC: Face = [[-OX, OY], [-OX, -OY]]
  front(EP, 10.6, 19, [])
  front(EP, 41, 49.5, [])
  front(WC, 8.5, 19, [])
  front(WC, 41, 51.5, [])

  // ── Pavilions ──
  /** A pyramid-roofed pavilion standing slightly proud of its front. */
  function pavilion(x0: number, x1: number, y0: number, y1: number, apex: number, fr: Face[]) {
    mass(x0, x1, y0, y1, EAVE)
    courses(x0, x1, y0, y1, [BASE, 13.6, 19.8], EAVE)
    hipRoof(tile, x0, x1, y0, y1, EAVE, apex, 0.5)
    for (const f of fr) arcade(f, 0, faceLen(f), 6.4, 1.6)
  }
  {
    const sw = faces(-42.8, -32.6, -30.6, -21.5), nw = faces(-42.4, -32.2, 21.3, 31), ne = faces(32.1, 42.6, 20.7, 30.6)
    pavilion(-42.8, -32.6, -30.6, -21.5, 39, [sw.S, sw.W])
    pavilion(-42.4, -32.2, 21.3, 31, 39, [nw.N, nw.W])
    pavilion(32.1, 42.6, 20.7, 30.6, 39, [ne.N, ne.E])
    // Eighth and Ninth St pavilions, each with a front gable
    for (const k of [-1, 1]) {
      const y0 = k < 0 ? -30.4 : 17.5, y1 = k < 0 ? -17.5 : 30.4
      const f = faces(-8.3, 8.3, y0, y1)
      pavilion(-8.3, 8.3, y0, y1, 38.5, [k < 0 ? f.S : f.N])
      // front gable: wall to a peak over the eaves
      const yf = k < 0 ? -30.4 : 30.4, yb = yf - k * 5.5
      box(buff, -4.4, 4.4, Math.min(yf, yb), Math.max(yf, yb), EAVE - 1, EAVE + 0.5, null, 0)
      gableRoof(tile, buff, -4.4, 4.4, Math.min(yf, yb), Math.max(yf, yb), EAVE + 0.5, EAVE + 6.5, 'y', 0.3, 0.3)
      const ff: Face = k < 0 ? f.S : f.N
      onWall(win, ff[0], ff[1], archShape(8.3, 2.2, EAVE - 0.5, EAVE + 2.2, 8), 0.06)
      // the entrance arch
      onWall(red, ff[0], ff[1], archShape(8.3, 4.6, 0, 3.6, 10), 0.1)
      onWall(door, ff[0], ff[1], archShape(8.3, 3.2, 0, 3.6, 10), 0.16)
    }
  }
  // Plum and Central St end pavilions: big steep hips, a front gable, round corner turrets
  for (const k of [-1, 1]) {
    const x0 = k > 0 ? 32.5 : -50.5, x1 = k > 0 ? 50.5 : -32.5, xf = k > 0 ? x1 : x0
    mass(x0, x1, -11, 11, EAVE)
    courses(x0, x1, -11, 11, [BASE, 13.6, 19.8], EAVE)
    hipRoof(tile, x0, x1, -11, 11, EAVE, k > 0 ? 50.5 : 47.5, 0.5)
    const f = faces(x0, x1, -11, 11)
    const ff = k > 0 ? f.E : f.W
    arcade(ff, 0, 7.6, 6.4, 0.6); arcade(ff, 14.4, 22, 6.4, 0.6)
    // side faces beyond the ranges
    const side = k > 0 ? [f.S, f.N] : [f.S, f.N]
    for (const sf of side) arcade(sf, k > 0 ? (sf === f.S ? 9.5 : 0) : (sf === f.S ? 0 : 9.5), k > 0 ? (sf === f.S ? 18 : 8.5) : (sf === f.S ? 8.5 : 18), 6.4, 0.5)
    // front gable
    const xb = xf - k * 6
    box(buff, Math.min(xf, xb), Math.max(xf, xb), -4.6, 4.6, EAVE - 1, EAVE + 1.5, null, 0)
    gableRoof(tile, buff, Math.min(xf, xb), Math.max(xf, xb), -4.6, 4.6, EAVE + 1.5, EAVE + 9.5, 'x', 0.3, 0.3)
    onWall(win, ff[0], ff[1], archShape(11, 2.4, EAVE - 0.3, EAVE + 3.4, 8), 0.06)
    // the main entrance: a deep red arch with the doors
    onWall(red, ff[0], ff[1], archShape(11, 5.4, 0, 4.2, 10), 0.1)
    onWall(door, ff[0], ff[1], archShape(11, 3.8, 0, 4.2, 10), 0.16)
    // round corner turrets
    for (const sy of [-1, 1]) turret(buff, tile, [k * 48.7, sy * 9.6], 2.7, 0, EAVE + 1.0, EAVE + 10.5, 14)
    for (const sy of [-1, 1]) band(red, Array.from({ length: 14 }, (_, i) => [k * 48.7 + 2.7 * Math.cos((i / 14) * Math.PI * 2), sy * 9.6 + 2.7 * Math.sin((i / 14) * Math.PI * 2)] as XY), BASE, 0.45, 0.12, null)
  }

  // ── The clock tower ──
  // A full square tower standing 3 m proud of both the Eighth St and Plum
  // St faces (Hume's photo), wider than OSM's 10.2 m part, which traces
  // only its inner core.
  const TX0 = 30.8, TX1 = 45.0, TY0 = -33.0, TY1 = -18.8, TTOP = 54.3
  const tc: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
  {
    const W = TX1 - TX0, D = TY1 - TY0
    const ring = roundedRect(TX0, TX1, TY0, TY1, 1.9, 3)
    wall(red, ring, 0, BASE)
    wall(buff, ring, BASE, TTOP - 1.4)
    capPoly(tile, ring, TTOP - 1.4, true)
    for (const z of [BASE, 13.6, 19.8, 27.0, 35.4, 45.0]) band(red, ring, z, 0.55, 0.16, null)
    cornice(red, ring, TTOP - 1.4, 1.4, 0.6, buff)
    const f = faces(TX0, TX1, TY0, TY1)
    for (const [ff, L] of [[f.S, W], [f.E, D], [f.N, W], [f.W, D]] as [Face, number][]) {
      const s = L / 2
      // lower storeys: a granite arch at the foot, paired arched windows up the shaft
      onWall(red, ff[0], ff[1], archShape(s, 4.4, 0, 3.4, 8), 0.06)
      onWall(door, ff[0], ff[1], archShape(s, 3.0, 0, 3.4, 8), 0.12)
      for (const [z0, z1] of [[7.4, 11.4], [14.6, 18.2], [21.0, 25.2], [28.4, 33.4]] as [number, number][])
        for (const d of [-1.3, 1.3]) onWall(win, ff[0], ff[1], archShape(s + d, 1.6, z0, z1, 6), 0.06)
      // the belfry: an arcade of three tall round-arched openings under one red arch
      onWall(red, ff[0], ff[1], archShape(s, 8.4, 36.4, 41.2, 10), 0.04)
      for (const d of [-2.4, 0, 2.4]) onWall(win, ff[0], ff[1], archShape(s + d, 1.9, 36.8, 42.4, 8), 0.08)
      // the bold clock face in a red ring
      onWall(red, ff[0], ff[1], Array.from({ length: 18 }, (_, i) => [s + 3.1 * Math.cos((i / 18) * Math.PI * 2), 49.3 + 3.1 * Math.sin((i / 18) * Math.PI * 2)] as [number, number]), 0.04)
      onWall(door, ff[0], ff[1], Array.from({ length: 18 }, (_, i) => [s + 2.5 * Math.cos((i / 18) * Math.PI * 2), 49.3 + 2.5 * Math.sin((i / 18) * Math.PI * 2)] as [number, number]), 0.08)
    }
    // corner turrets and the tall steep pyramid
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) turret(buff, tile, [tc[0] + sx * (W / 2 - 1.6), tc[1] + sy * (D / 2 - 1.6)], 1.75, TTOP - 1.4, TTOP + 4.6, TTOP + 9.2, 10)
    pyramid(tile, tc, 5.6, TTOP, 77.4)
    // iron cross
    box(red, tc[0] - 0.15, tc[0] + 0.15, tc[1] - 0.15, tc[1] + 0.15, 77.0, 79.0, red, 0)
    box(red, tc[0] - 0.15, tc[0] + 0.15, tc[1] - 0.75, tc[1] + 0.75, 78.0, 78.35, red, 0)
  }

  await save('cin-city-hall', 'Cincinnati City Hall', [
    { part: buff, material: finish('cch-sandstone', 0xdcb889) },
    { part: red, material: finish('cch-red-granite', 0xa25e50) },
    { part: tile, material: finish('cch-tile', 0xb96e52) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: flat, material: PALETTE.roof },
  ], { height: 79, anchor: [39.104165, -84.519596], bearing: 349.1 }, 6500)
}
