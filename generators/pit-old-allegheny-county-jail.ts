/**
 * Old Allegheny County Jail (H. H. Richardson, 1884-1886), Ross Street and
 * Fifth/Forbes Avenues, downtown Pittsburgh, with the "Bridge of Sighs" over
 * Ross Street to the courthouse — original procedural geometry, CC0-1.0.
 * bun generators/pit-old-allegheny-county-jail.ts
 *
 * Imports the Richardsonian helpers from pit-allegheny-county-courthouse.ts,
 * which must be merged first. This model owns the Bridge of Sighs; the
 * courthouse draws only the doorway it lands on.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint (the east end of the east wing, ~235.6 m
 * NAVD88; Ross Street is ~1.2 m higher). Anchor = area centroid of the OSM
 * outline way/203445068, -79.9953453 40.4385156. The cell wings run at 27.9°
 * / 117.9°, so the catalog bearing is 27.9: -x is Ross Street (the bridge
 * and the courthouse), +y Fifth Avenue, -y Forbes Avenue.
 *
 * Identity, in order: the octagonal rotunda with its steep red pyramid at
 * the crossing of the cell wings; the long gabled cell wings radiating from
 * it (north-south, east, north-east diagonal) with small corner turrets at
 * their ends; the square tower with machicolated top and pyramid by the
 * bridge; the Bridge of Sighs, an enclosed stone passage on a segmental
 * arch over Ross Street; the tall round ventilating shaft at the south-east
 * corner of the yard wall; the massive rusticated yard wall; rough tan
 * granite; small deep-set windows.
 *
 * Evidence:
 *  - plan: OSM way/203445068 (building), way/203445076 (barrier=wall, the
 *    yard wall) and way/1469951563 (building:part=tower), turned into this
 *    frame. The lidar and the NAIP aerial (2019, 0.28 m) agree with each
 *    other but put the cell wings and the rotunda 2-5 m east of the OSM
 *    outline (the rotunda part by ~5 m); the model follows the lidar and
 *    aerial for those (rotunda centre (-11, -12), N-S wing x -19..-1.5) and
 *    OSM for the yard wall and the Ross Street front. HABS PA-610 (Library
 *    of Congress, 1963, public domain) sheet 1 roof plan and sheets 21-30
 *    (jail plans, sections, elevations) for the arrangement.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1-3 m samples above the base: rotunda drum 30.3, apex 39.6; cell wing
 *    eaves 20-21, ridges 24.5; wing-end turrets ~25.5; square tower walls
 *    26.3, apex 31.1; Ross Street fronts 13-19.5 (north-west block 25);
 *    the low block at Ross/Forbes 12.5-15.5; yard wall 11.3; ventilating
 *    shaft 45.4; the bridge 12.6-13.5 with its central gable 15.5.
 *  - published: jail completed 1886, H. H. Richardson; converted to the
 *    Family Court in 2001 (Wikipedia, "Allegheny County Jail"; NHL with the
 *    courthouse).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Old Allegheny County Jail, Ross Street and Forbes Avenue, Pittsburgh, PA.jpg"
 *      https://commons.wikimedia.org/wiki/File:Old_Allegheny_County_Jail,_Ross_Street_and_Forbes_Avenue,_Pittsburgh,_PA.jpg
 *      w_lemay, CC BY-SA 2.0 — the Ross/Forbes corner: bridge, square
 *      tower, gabled block, ventilating shaft, colour.
 *    "JAIL, FORBES AVENUE FACADE AND PART OF ROSS STREET FACADE, FROM THE WEST" (HABS PA-610)
 *      https://commons.wikimedia.org/wiki/Category:Old_Allegheny_County_Jail
 *      HABS, public domain — the same corner in 1963.
 *    "Dome of the Jail, 2025-11-14.jpg"
 *      https://commons.wikimedia.org/wiki/File:Dome_of_the_Jail,_2025-11-14.jpg
 *      Cbaile19, CC0 — the rotunda: drum, arcaded band, red pyramid.
 *    "Bridge, Old Allegheny County Jail, Ross Street and Forbes Avenue, Pittsburgh, PA.jpg"
 *      https://commons.wikimedia.org/wiki/File:Bridge,_Old_Allegheny_County_Jail,_Ross_Street_and_Forbes_Avenue,_Pittsburgh,_PA.jpg
 *      w_lemay, CC BY-SA 2.0 — the bridge's arch, gable and window.
 *    "Allegheny County Courthouse skyway over Ross St in Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Courthouse_skyway_over_Ross_St_in_Pittsburgh.jpg
 *      Dllu, CC BY-SA 4.0 — the bridge side-on down Ross Street.
 *    "JAIL, REAR ENCLOSING WALL, FROM THE SOUTHEAST" (HABS PA-610), public
 *      domain — the yard wall and the east wing's end.
 *  - colour: the cleaned granite reads warm tan, pulled to the palette;
 *    roofs red tile like the courthouse.
 * Estimated: window and door sizes and counts (photos and HABS sheets);
 * the bridge's arch rise (photos); the north and east fronts (only the
 * 1963 HABS views and the aerial); the hip/gable form of the Ross Street
 * roofs (lidar profile).
 *
 * Left out: the yard (trees, paving), chimneys, corbel detail, the small
 * modern annexes in the yards.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arcade, arch, band, boxFaces, grow, hipRoof, poly, pyramid, turret, voussoirs, wallsSplit } from './pit-allegheny-county-courthouse'

type R4 = [number, number, number, number]

/** A gabled range along a straight axis from p0 to p1, half-width h, eaves z0, ridge z1. */
function gabled(wall: Part, roof: Part, p0: XY, p1: XY, h: number, z0: number, z1: number, gable0 = true, gable1 = true) {
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), u: XY = [(p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L], n: XY = [-u[1], u[0]]
  const P = (s: number, t: number, z: number): V3 => [p0[0] + u[0] * s + n[0] * t, p0[1] + u[1] * s + n[1] * t, z]
  const ring: XY[] = [[0, -h], [L, -h], [L, h], [0, h]].map(([s, t]) => [P(s, t, 0)[0], P(s, t, 0)[1]] as XY)
  wallsSplit(wall, ring, 0, z0)
  if (gable1) poly(wall, [P(L, -h, z0), P(L, h, z0), P(L, 0, z1)], [u[0], u[1], 0])
  if (gable0) poly(wall, [P(0, h, z0), P(0, -h, z0), P(0, 0, z1)], [-u[0], -u[1], 0])
  const o = 0.45, k = o * (z1 - z0) / h
  const e0 = gable0 ? -o : 0, e1 = gable1 ? L + o : L
  poly(roof, [P(e0, -h - o, z0 - k), P(e1, -h - o, z0 - k), P(e1, 0, z1 + 0.05), P(e0, 0, z1 + 0.05)], [-n[0], -n[1], 1])
  poly(roof, [P(e1, h + o, z0 - k), P(e0, h + o, z0 - k), P(e0, 0, z1 + 0.05), P(e1, 0, z1 + 0.05)], [n[0], n[1], 1])
  return { P, L, u, n, ring }
}

function build() {
  const granite = new Part(), win = new Part(), tile = new Part(), door = new Part(), dark = new Part()

  const RC: XY = [-11, -12] // rotunda centre (lidar)
  const EAVE = 20.5, RIDGE = 24.5

  // ---- cell wings: N-S (through the rotunda), east, north-east diagonal
  const ns = gabled(granite, tile, [-10.25, -48], [-10.25, 36.5], 8.6, EAVE, RIDGE)
  const ew = gabled(granite, tile, [-2, -11.75], [39.5, -11.75], 7.2, EAVE + 0.5, RIDGE, false, true)
  const d = Math.SQRT1_2
  const ne = gabled(granite, tile, [RC[0] + 12 * d, RC[1] + 12 * d], [RC[0] + 63 * d, RC[1] + 63 * d], 7.4, EAVE, RIDGE, false, true)

  // tall cell windows: a lower square-headed and an upper round-headed panel per bay
  const cellWindows = (g: ReturnType<typeof gabled>, s0: number, s1: number, skip: (s: number) => boolean = () => false) => {
    const { L } = g
    void L
    for (const side of [-1, 1]) {
      const a = side < 0 ? g.ring[0] : g.ring[2], b = side < 0 ? g.ring[1] : g.ring[3]
      const { L: wl } = onWall(a, b)
      for (let s = s0 + 2.25; s < s1 - 1.5; s += 4.5) {
        const ss = side < 0 ? s : wl - s
        if (skip(s)) continue
        panel(win, a, b, ss - 0.7, ss + 0.7, 3.5, 9.5)
        arch(win, a, b, ss - 0.7, ss + 0.7, 11, 17, 0.05, 6)
      }
    }
  }
  cellWindows(ns, 1, 84.5, (s) => (s > 26 && s < 47)) // skip the rotunda and the east wing
  cellWindows(ew, 7.5, 41.5)
  cellWindows(ne, 8, 51)
  // gable-end windows: a tall arched window in each free gable
  const endWin = (g: ReturnType<typeof gabled>, end: 0 | 1, h: number) => {
    const a = end ? g.ring[1] : g.ring[3], b = end ? g.ring[2] : g.ring[0]
    arch(win, a, b, h - 1.4, h + 1.4, 6, 17.5, 0.05, 8)
  }
  endWin(ns, 0, 8.6); endWin(ns, 1, 8.6); endWin(ew, 1, 7.2); endWin(ne, 1, 7.4)

  // wing-end corner turrets (lidar ~25.5)
  const turretAt = (q: V3) => turret(granite, tile, q[0], q[1], 1.3, 0, 25.5, 29.5, 8, 0.2)
  for (const g of [ns, ew, ne]) { turretAt(g.P(g.L, -8.3, 0)); turretAt(g.P(g.L, 8.3, 0)) }
  turretAt(ns.P(0, -8.3, 0)); turretAt(ns.P(0, 8.3, 0))

  // ---- the rotunda: octagonal drum, arcaded band, steep red pyramid
  {
    const R = 8.66, oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => [RC[0] + r * Math.cos((i + 0.5) * Math.PI / 4), RC[1] + r * Math.sin((i + 0.5) * Math.PI / 4)] as XY)
    const o = oct(R)
    walls(granite, o, 0, 30.3)
    band(granite, o, oct(R + 0.45), 28.6, 30.3, 0.4)
    const ro = oct(R + 0.7)
    for (let i = 0; i < 8; i++) {
      const a = ro[i], b = ro[(i + 1) % 8]
      poly(tile, [[a[0], a[1], 30.1], [b[0], b[1], 30.1], [RC[0], RC[1], 39.6]], [(a[0] + b[0]) / 2 - RC[0], (a[1] + b[1]) / 2 - RC[1], 1])
    }
    cap(tile, ro, 30.1, false)
    for (let i = 0; i < 8; i++) arcade(win, o[i], o[(i + 1) % 8], 1.0, 5.6, 3, 0.5, 25.2, 27.2, 4)
    turret(granite, tile, RC[0], RC[1], 0.6, 39, 40.3, 41.5, 8, 0.15) // lantern finial
  }

  // ---- Ross Street fronts (x -33..-21)
  const front: { r: R4; z0: number; z1: number }[] = [
    { r: [-33, -22, -21, -5], z0: 15.5, z1: 18.8 },
    { r: [-33, 11, -21, 22], z0: 16, z1: 19.5 },
    { r: [-33, 22, -22, 31.5], z0: 20.5, z1: 25.3 },
  ]
  for (const f of front) {
    wallsSplit(granite, rect(...f.r), 0, f.z0)
    band(granite, rect(...f.r), grow(f.r, 0.3), f.z0 - 0.8, f.z0, 0.3)
    hipRoof(tile, f.r, f.z0, f.z1, 0.45, 0.7)
  }
  {
    const r: R4 = [-33, -5, -21, 11]
    wallsSplit(granite, rect(...r), 0, 13)
    band(granite, rect(...r), grow(r, 0.3), 12.2, 13, 0.3)
    cap(granite, rect(...r), 12.9)
  }
  // the low block at Ross and Forbes: a flat-topped range along Ross and,
  // on the corner, a short gabled block whose west gable faces Ross Street
  // (lidar ridge 17.6 along x at y -44)
  {
    const r: R4 = [-32.5, -40.5, -24, -30]
    wallsSplit(granite, rect(...r), 0, 12.6)
    band(granite, rect(...r), grow(r, 0.3), 11.8, 12.6, 0.3)
    cap(granite, rect(...r), 12.55)
    const g = gabled(granite, tile, [-32.5, -44.25], [-19, -44.25], 3.75, 14, 17.6, true, false)
    const [a0, b0] = [g.ring[3], g.ring[0]] // west gable face
    for (const s of [1.4, 3.75, 6.1]) { panel(win, a0, b0, s - 0.5, s + 0.5, 2.5, 4.4); panel(win, a0, b0, s - 0.5, s + 0.5, 6.2, 11.2) }
    panel(win, a0, b0, 3.2, 4.3, 12.4, 14.6)
    const [a1, b1] = [g.ring[0], g.ring[1]] // Forbes face
    for (let s = 1.6; s < g.L - 1; s += 2.9) { panel(win, a1, b1, s - 0.5, s + 0.5, 2.5, 4.4); panel(win, a1, b1, s - 0.5, s + 0.5, 6.2, 12) }
  }
  // Ross Street windows: small deep-set windows in two-storey groups
  const ross: [XY, XY] = [[-33, 31.5], [-33, -22]]
  {
    const { L } = onWall(...ross)
    for (let s = 2.4; s < L - 1.5; s += 3.6) {
      const y = 31.5 - s
      if (y > -6 && y < 12) { panel(win, ross[0], ross[1], s - 0.6, s + 0.6, 3.5, 5.2); panel(win, ross[0], ross[1], s - 0.6, s + 0.6, 7, 10.5); continue }
      panel(win, ross[0], ross[1], s - 0.6, s + 0.6, 3.5, 5.4)
      panel(win, ross[0], ross[1], s - 0.6, s + 0.6, 7.2, 13)
      if (y > 22) panel(win, ross[0], ross[1], s - 0.6, s + 0.6, 15, 18.5)
    }
    // the Ross Street entrance, round-arched with heavy voussoirs
    const se = 31.5 - 3
    arch(door, ross[0], ross[1], se - 1.6, se + 1.6, 1.2, 4.5, 0.08, 8)
    voussoirs(granite, ross[0], ross[1], se - 1.6, se + 1.6, 4.5, 1.0, 0.12, 8)
  }
  // windows on the wing-side and Fifth faces of the front blocks
  for (const f of front) for (const [a, b] of boxFaces(f.r)) {
    const { L, n } = onWall(a, b)
    if (n[0] < -0.5) continue // Ross faces done above
    for (let s = 2.2; s < L - 1.2; s += 3.6) panel(win, a, b, s - 0.55, s + 0.55, 7.2, 12.5)
  }

  // ---- the square tower by the bridge: machicolated top, pyramid
  {
    const r: R4 = [-32.6, -30, -26.1, -23.5]
    wallsSplit(granite, rect(...r), 0, 23.2)
    band(granite, rect(...r), grow(r, 0.45), 23.2, 26.3, 0.6)
    pyramid(tile, r, 26.3, 31.1, 0.6)
    for (const [a, b] of boxFaces([r[0] - 0.45, r[1] - 0.45, r[2] + 0.45, r[3] + 0.45])) {
      const { L } = onWall(a, b)
      arcade(win, a, b, 1.0, L - 1.0, 2, 1.6, 24.0, 25.4, 4)
    }
    for (const [a, b] of boxFaces(r)) {
      const { L } = onWall(a, b)
      panel(win, a, b, L / 2 - 0.45, L / 2 + 0.45, 16.5, 20)
    }
  }

  // ---- the ventilating shaft at the yard wall's south-east corner
  lathe(granite, 12, -40.5, [[1.9, 0], [1.9, 41.5], [2.3, 42.2], [2.3, 44.6], [1.6, 45.4], [0, 45.6]], 12)

  // ---- the yard wall (OSM way/203445076), rusticated, 11.3 m
  {
    const wallPts: XY[] = [[-31.6, 28.5], [-21.6, 33.5], [11.4, 50.5], [25.0, 42.9], [38.9, 30.5], [61.4, 11.3], [40.2, -16.0], [12.2, -42.9], [9.1, -45.8], [6.7, -46.2], [-1.6, -47.5], [-19.5, -47.8]]
    const T = 0.7, H = 11.3
    for (let i = 0; i < wallPts.length - 1; i++) {
      const a = wallPts[i], b = wallPts[i + 1]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L * T, ny = (b[0] - a[0]) / L * T
      const r: XY[] = [[a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny], [a[0] + nx, a[1] + ny]]
      // keep the ring counter-clockwise
      const ar = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0])
      const ring = ar > 0 ? r : [...r].reverse()
      wallsSplit(granite, ring, 0, H)
      cap(granite, ring, H)
    }
    // the arched gateway in the east wall
    const ga: XY = [61.4, 11.3], gb: XY = [40.2, -16.0], { L } = onWall(gb, ga)
    arch(dark, gb, ga, L / 2 - 2, L / 2 + 2, 0.3, 4, 0.75, 8)
  }

  // ---- the Bridge of Sighs over Ross Street (x -49.2 .. -32.6, y -28.6 .. -23.4)
  {
    const X0 = -49.2, X1 = -32.6, Y0 = -28.6, Y1 = -23.4, TOPZ = 13.2
    const N = 10, span = X1 - X0
    const soffit = (t: number) => 5.6 + 3.8 * Math.sin(Math.PI * t) // segmental arch, springing 5.6, crown 9.4
    const xs = Array.from({ length: N + 1 }, (_, i) => X0 + (span * i) / N)
    for (let i = 0; i < N; i++) {
      const xa = xs[i], xb = xs[i + 1], za = soffit(i / N), zb = soffit((i + 1) / N)
      granite.quad([xa, Y0, za], [xb, Y0, zb], [xb, Y0, TOPZ], [xa, Y0, TOPZ]) // south face
      granite.quad([xb, Y1, zb], [xa, Y1, za], [xa, Y1, TOPZ], [xb, Y1, TOPZ]) // north face
      granite.quad([xa, Y1, za], [xb, Y1, zb], [xb, Y0, zb], [xa, Y0, za]) // soffit, facing down
      // voussoir band on both faces
      for (const [y, s] of [[Y0 - 0.06, -1], [Y1 + 0.06, 1]] as [number, number][]) {
        const q = [[xa, y, za], [xb, y, zb], [xb, y, zb + 1.1], [xa, y, za + 1.1]] as V3[]
        poly(dark, q, [0, s, 0])
      }
    }
    // roof: low gable along the bridge, raised in the middle third (lidar 15.5)
    const m0 = X0 + span / 3, m1 = X1 - span / 3, yc = (Y0 + Y1) / 2
    poly(tile, [[X0, Y0 - 0.3, TOPZ], [X1, Y0 - 0.3, TOPZ], [X1, yc, TOPZ + 0.9], [X0, yc, TOPZ + 0.9]], [0, -1, 1])
    poly(tile, [[X1, Y1 + 0.3, TOPZ], [X0, Y1 + 0.3, TOPZ], [X0, yc, TOPZ + 0.9], [X1, yc, TOPZ + 0.9]], [0, 1, 1])
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
      poly(granite, [[m0, y, TOPZ], [m1, y, TOPZ], [(m0 + m1) / 2, y, 15.5]], [0, s, 0])
      const a: XY = s < 0 ? [X0, y] : [X1, y], b: XY = s < 0 ? [X1, y] : [X0, y]
      const c = span / 2
      arch(win, a, b, c - 0.6, c + 0.6, 10.6, 12.6, 0.05, 6)
      for (const k of [-1, 1]) for (const j of [2.6, 5.2]) panel(win, a, b, c + k * j - 0.3, c + k * j + 0.3, 10.8, 12.2)
    }
    poly(tile, [[m0, Y0 - 0.3, TOPZ], [(m0 + m1) / 2, Y0 - 0.3, 15.6], [(m0 + m1) / 2, Y1 + 0.3, 15.6], [m0, Y1 + 0.3, TOPZ]], [-1, 0, 1])
    poly(tile, [[(m0 + m1) / 2, Y0 - 0.3, 15.6], [m1, Y0 - 0.3, TOPZ], [m1, Y1 + 0.3, TOPZ], [(m0 + m1) / 2, Y1 + 0.3, 15.6]], [1, 0, 1])
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : p[2] < 14 ? 0.5 : 0.3)
  return [
    { part: granite, material: { ...finish('jail-granite', 0xd5c3a6), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('red-tile', 0xc87661) },
    { part: door, material: PALETTE.entrance },
    { part: dark, material: finish('jail-granite-dark', 0xb5a284) },
  ]
}

if (import.meta.main) await save('pit-old-allegheny-county-jail', 'Old Allegheny County Jail', [40.4385156, -79.9953453], 27.9, build() as any, 6500)
