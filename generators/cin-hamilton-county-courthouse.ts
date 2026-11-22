/**
 * Hamilton County Courthouse, 1000 Main Street, Cincinnati (1919, Rankin,
 * Kellogg & Crane, neoclassical) — original procedural geometry, CC0-1.0.
 * bun generators/cin-hamilton-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 349.3, the downtown street grid: the colonnaded
 * Main Street front faces west (-x), Court Street is on the north (+y).
 * Anchor = centroid of OSM relation/361391, -84.510274, 39.107161.
 *
 * Identity (from the photos below):
 *  1. The giant Ionic colonnade on Main Street: sixteen columns three
 *     storeys tall standing on a rusticated base storey with round-arched
 *     openings, between two plain corner pavilions.
 *  2. A long limestone block with a heavy cornice and a set-back attic
 *     storey with paired small windows over every bay.
 *  3. Corner pavilions with tall framed window recesses; the Court and
 *     Ninth Street sides in pilastered bays of tall grouped windows.
 *
 * Plan: OSM relation/361391 (outer way/46137791, inner courtyard
 * way/46137797), read in the turned frame: x -40.2..40.5, y -45.3..45.6;
 * the Main St middle (the base storey under the colonnade) reaches
 * x -40.2 between y -34.8 and 34.9, the pavilions stop at x -37.2/-38.3;
 * the Court/Ninth St middles are set back to y ±44.2 between x -25 and
 * 26.4; light court x -15.3..18.3, y 9.7..27.5.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown 2021), 1 m grid, read in this frame. y = 0 is the Sycamore St
 * (east) side, the lowest ground under the footprint (lidar ground_min
 * + 1.5, Mapterhorn agrees); Main St is 2.3 m higher. Measured: Main St
 * range attic 31.6, Court/Ninth ranges 30.2, east range 32.8, corner
 * pavilions about 29.3, a raised roof spine behind the Main St range
 * 34.8, light court open to the ground.
 * Estimated from the photos (scaled from the 29 m Main St front): base
 * storey to 12.3, columns 12.3-22.3, entablature to 24.5, column count
 * (sixteen), bay widths, window and arch sizes.
 *
 * Ground: Mapterhorn falls 2.3 m from Main St to the east side; elevation
 * 0. The Main St base storey and doors start at Main St level (2.3).
 *
 * Night: windows glow; the colonnade is floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hamilton County Courthouse in Cincinnati, western front.jpg, Nyttend,
 *    public domain (the Main St colonnade from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Hamilton_County_Courthouse_in_Cincinnati,_western_front.jpg
 *  - Hamilton County Courthouse, Cincinnati, OH.jpg, Warren LeMay, CC0
 *    (from the north-west: Court St side and Main St front)
 *    https://commons.wikimedia.org/wiki/File:Hamilton_County_Courthouse,_Cincinnati,_OH.jpg
 *  - Hamilton County Courthouse, Cincinnati, OH (46630000384).jpg, Warren
 *    LeMay, CC0 (the colonnade and the north pavilion, looking up)
 *    https://commons.wikimedia.org/wiki/File:Hamilton_County_Courthouse,_Cincinnati,_OH_(46630000384).jpg
 *  - Hamilton County Courthouse, Cincinnati, OH (32411276977).jpg, Warren
 *    LeMay, CC0 (the Main St front from across the street)
 *    https://commons.wikimedia.org/wiki/File:Hamilton_County_Courthouse,_Cincinnati,_OH_(32411276977).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east (Sycamore St) front and the light court are not in
 * the photos; they are drawn in the side elevations' bays. OSM puts the
 * colonnade's base 2-3 m in front of the pavilions; the photos read the
 * pavilions about level with the columns, so the columns stand on the
 * OSM line and the loggia wall is a metre behind the pavilion faces.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import type { Face } from './cin-city-hall'

if (import.meta.main) {
  const stone = new Part(), loggia = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const GW = 2.3 // Main St ground
  const BASE = 12.3, COLTOP = 22.3, ENT = 24.5, ATTIC = 30.2
  const IN = 0.9 // attic set back from the outer faces
  const XW = -37.0, XP = -38.0, XE = 40.0, YN = 44.2, YS = -44.3, YNP = 45.5, YSP = -45.2
  const PW = -25.0, PE = 26.4 // pavilion inner edges in x
  const PYN = 34.9, PYS = -34.8 // pavilion inner edges in y

  // ── core block with the light court, up to the attic top ──
  const CX0 = -15.3, CX1 = 18.3, CY0 = 9.7, CY1 = 27.5
  const core = (x0: number, x1: number, y0: number, y1: number, z1: number) => box(stone, x0, x1, y0, y1, 0, z1, roof, 0.3)
  core(XW + IN, XE - IN, YS + IN, CY0, ATTIC)
  core(XW + IN, XE - IN, CY1, YN - IN, ATTIC)
  core(XW + IN, CX0, CY0, CY1, ATTIC)
  core(CX1, XE - IN, CY0, CY1, ATTIC)
  // raised attic strips: behind the colonnade, along the east range, and the roof spine
  box(stone, XW + IN, -28.5, PYS, PYN, ATTIC - 1, 31.6, roof, 0.3)
  box(stone, 29.0, XE - IN, -34.4, 34.5, ATTIC - 1, 32.8, roof, 0.3)
  box(roof, -22, -16, -31, 26, ATTIC - 1, 34.8, roof, 0.4)

  // ── lower skin: the facade below the cornice, proud of the attic ──
  box(stone, XW, XE, YS, YN, 0, ENT, roof, 0.2)
  // cornice round the ranges
  const ring: XY[] = [[XW, YS], [XE, YS], [XE, YN], [XW, YN]]
  cornice(stone, ring, ENT - 1.3, 1.3, 0.55, roof)

  // ── corner pavilions, full height ──
  const pav: [number, number, number, number][] = [
    [XP, PW, PYN, YNP], [XP, PW, YSP, PYS], [PE, XE + 0.3, 34.4, YNP], [PE, XE + 0.3, YSP, -34.4],
  ]
  for (const [x0, x1, y0, y1] of pav) {
    box(stone, x0, x1, y0, y1, 0, ATTIC - 0.6, roof, 0.3)
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    cornice(stone, r, ENT - 1.3, 1.3, 0.55, null)
    cornice(stone, r, ATTIC - 1.3, 0.9, 0.35, roof)
  }

  // ── window helpers ──
  const L = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  /** A box standing d metres proud of face f, from s0 to s1 along it (faces here are axis-aligned). */
  function slab(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
    const l = L(f), t: XY = [(f[1][0] - f[0][0]) / l, (f[1][1] - f[0][1]) / l], nn: XY = [t[1], -t[0]]
    const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + nn[0] * o, f[0][1] + t[1] * s + nn[1] * o]
    const a = P(s0, -0.05), b = P(s1, d)
    box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, p, 0.12)
  }
  /** A pilastered bay run along face f between s0 and s1: base windows, a tall grouped panel, a pilaster between bays. */
  function bays(f: Face, s0: number, s1: number, pitch: number, g: number, attic: Face | null) {
    const n = Math.max(1, Math.round((s1 - s0) / pitch)), w = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + w * (k + 0.5)
      onWall(win, f[0], f[1], rectShape(s - 0.8, s + 0.8, g + 2.0, g + 4.6), 0.06)
      onWall(win, f[0], f[1], rectShape(s - w * 0.3, s + w * 0.3, BASE + 0.8, COLTOP - 0.6), 0.06)
      // spandrel between the lower two storeys and the top one
      onWall(stone, f[0], f[1], rectShape(s - w * 0.3, s + w * 0.3, 18.6, 19.2), 0.1)
      if (attic) {
        const sa = s + (L(attic) - L(f)) / 2
        for (const d of [-0.75, 0.75]) onWall(win, attic[0], attic[1], rectShape(sa + d - 0.45, sa + d + 0.45, ENT + 1.2, ENT + 3.6), 0.06)
      }
    }
    // pilasters between the bays
    for (let k = 0; k <= n; k++) {
      const s = s0 + w * k
      slab(stone, f, s - 0.45, s + 0.45, BASE, COLTOP, 0.35)
    }
    // the base storey's top course
    slab(stone, f, s0, s1, BASE - 0.5, BASE, 0.25)
  }
  /** A pavilion face: a tall framed recess with a window stack. */
  function pavFace(f: Face, g: number) {
    const m = L(f) / 2
    for (const d of [-1, 1]) slab(stone, f, m + d * 2.6 - 0.6, m + d * 2.6 + 0.6, BASE - 0.6, COLTOP + 0.4, 0.4)
    slab(stone, f, m - 3.2, m + 3.2, COLTOP + 0.4, COLTOP + 1.1, 0.4)
    onWall(loggia, f[0], f[1], rectShape(m - 2.0, m + 2.0, BASE, COLTOP + 0.4), 0.05)
    onWall(win, f[0], f[1], rectShape(m - 1.5, m + 1.5, BASE + 0.8, COLTOP - 0.8), 0.09)
    onWall(win, f[0], f[1], rectShape(m - 1.0, m + 1.0, g + 2.2, g + 5.2), 0.06)
  }

  // ── Main St front: base storey, colonnade, loggia ──
  {
    // the base storey under the colonnade, and its steps' landing
    box(stone, -40.2, XW, PYS, PYN, 0, BASE, stone, 0.25)
    const fb: Face = [[-40.2, PYN], [-40.2, PYS]]
    const n = 9, w = (PYN - PYS) / n
    for (let k = 0; k < n; k++) {
      const s = w * (k + 0.5), main = k >= 3 && k <= 5
      onWall(stone, fb[0], fb[1], archShape(s, 3.6, GW, GW + 4.6, 10), 0.08)
      onWall(main ? door : win, fb[0], fb[1], archShape(s, 2.8, GW, GW + 4.6, 10), 0.14)
    }
    // rustication joints read as two thin courses
    for (const z of [GW + 3.0, GW + 6.6]) onWall(loggia, fb[0], fb[1], rectShape(0, PYN - PYS, z, z + 0.18), 0.05)
    // loggia wall behind the columns, darker in its shade, with tall grouped windows
    const fl: Face = [[XW, PYN], [XW, PYS]]
    onWall(loggia, fl[0], fl[1], rectShape(0, PYN - PYS, BASE, COLTOP), 0.04)
    const nc = 16, pitch = (PYN - PYS - 2.0) / (nc - 1)
    for (let k = 0; k < nc - 1; k++) {
      const s = 1.0 + pitch * (k + 0.5)
      onWall(win, fl[0], fl[1], rectShape(s - 1.0, s + 1.0, BASE + 0.9, 18.3), 0.08)
      onWall(win, fl[0], fl[1], rectShape(s - 1.0, s + 1.0, 19.1, COLTOP - 0.8), 0.08)
    }
    // the columns
    for (let k = 0; k < nc; k++) {
      const y = PYN - 1.0 - pitch * k
      revolve(stone, [-39.1, y], [[0.95, BASE], [0.95, BASE + 0.45], [0.76, BASE + 0.6], [0.68, COLTOP - 0.9], [0.72, COLTOP - 0.7], [1.0, COLTOP - 0.35], [1.0, COLTOP]], 10, 0, false, false)
    }
    // entablature over the columns (closed underneath)
    box(stone, -40.2, XW, PYS, PYN, COLTOP, ENT, roof, 0.2, true)
    const fe: Face = [[-40.2, PYN], [-40.2, PYS]]
    onWall(loggia, fe[0], fe[1], rectShape(0.3, PYN - PYS - 0.3, COLTOP + 0.75, COLTOP + 0.95), 0.04)
    cornice(stone, [[-40.2, PYS], [XW, PYS], [XW, PYN], [-40.2, PYN]], ENT - 1.0, 1.0, 0.5, roof)
    // attic windows in pairs over each intercolumniation
    const fa: Face = [[XW + IN, PYN], [XW + IN, PYS]]
    for (let k = 0; k < nc - 1; k++) {
      const s = 1.0 + pitch * (k + 0.5)
      for (const d of [-0.75, 0.75]) onWall(win, fa[0], fa[1], rectShape(s + d - 0.45, s + d + 0.45, ENT + 1.6, ENT + 4.0), 0.06)
    }
  }

  // ── Court St (north), Ninth St (south) and the east front ──
  {
    const fN: Face = [[XE, YN], [XW, YN]], aN: Face = [[XE - IN, YN - IN], [XW + IN, YN - IN]]
    // the north face runs east→west: s from XE
    bays(fN, XE - PE, XE - PW, 4.3, 0.6, aN)
    const fS: Face = [[XW, YS], [XE, YS]], aS: Face = [[XW + IN, YS + IN], [XE - IN, YS + IN]]
    bays(fS, PW - XW, PE - XW, 4.3, 0.8, aS)
    const fE: Face = [[XE, YS], [XE, YN]], aE: Face = [[XE - IN, YS + IN], [XE - IN, YN - IN]]
    bays(fE, -34.4 - YS, 34.4 - YS, 4.3, 0.0, aE)
    // light court faces: plain windows
    const court: Face[] = [[[CX0, CY0], [CX1, CY0]], [[CX1, CY1], [CX0, CY1]], [[CX0, CY1], [CX0, CY0]], [[CX1, CY0], [CX1, CY1]]]
    for (const f of court) {
      // inward-facing: the outside of the court wall is to the left, so reverse the face
      const rf: Face = [f[1], f[0]]
      const n = Math.max(1, Math.round(L(rf) / 4.5)), w = L(rf) / n
      for (let k = 0; k < n; k++) {
        const s = w * (k + 0.5)
        for (const [z0, z1] of [[3, 10.5], [13, 20.5], [23, 28]]) onWall(win, rf[0], rf[1], rectShape(s - 1.1, s + 1.1, z0, z1), 0.06)
      }
    }
  }

  // ── pavilion faces ──
  {
    const pf: [Face, number][] = [
      [[[XP, YNP], [XP, PYN]], GW], [[[XP, PYS], [XP, YSP]], GW],
      [[[PW, YNP], [XP, YNP]], 1.2], [[[XP, YSP], [PW, YSP]], 1.6],
      [[[XE + 0.3, YNP], [PE, YNP]], 0.6], [[[PE, YSP], [XE + 0.3, YSP]], 0.8],
      [[[XE + 0.3, YSP], [XE + 0.3, -34.4]], 0], [[[XE + 0.3, 34.4], [XE + 0.3, YNP]], 0],
    ]
    for (const [f, g] of pf) pavFace(f, g)
  }

  const lit = (p: V3, n: V3) => (p[0] < -36 && n[2] < 0.7 && p[2] > 2 ? 0.8 : 0)
  await save('cin-hamilton-county-courthouse', 'Hamilton County Courthouse', [
    { part: stone, material: { ...finish('hcc-limestone', 0xe6dfcd), floodlight: lit } },
    { part: loggia, material: finish('hcc-loggia', 0x9c9483) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('hcc-door', 0x7d6449) },
  ], { height: 34.8, anchor: [39.107161, -84.510274], bearing: 349.3 })
}
