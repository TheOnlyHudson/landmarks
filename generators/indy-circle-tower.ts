/**
 * Circle Tower (1930, Rubush & Hunter), 5 East Market Street on Monument
 * Circle, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-circle-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. Built in the "circle frame" of
 * the Soldiers' and Sailors' Monument (ind-soldiers-and-sailors-monument):
 * metres from the monument's axis (-86.158045, 39.7685195), turned 1.5
 * degrees clockwise with the downtown grid, so the street walls run square.
 * The origin is the area centroid of OSM way/340965638, (84.98, -34.33) in
 * that frame (-86.1570627, 39.7681891); bearing 1.5. y = 0 is the street
 * (the Circle and Market Street are flat here; lidar ground varies < 0.3 m).
 *
 * Identity (from the photos below):
 *  1. A pale limestone office block whose west front follows the curve of
 *     the Circle, with a two-storey arcade of round-headed shop arches.
 *  2. The setbacks: the street walls stop at about 33 m and step back twice
 *     to the main roof at 46 m; a two-tier stepped tower rises in the middle
 *     (52 and 57 m) with a jagged crown of short piers (the "ziggurat" top).
 *  3. The lower south wing on the Circle (33 m, no setbacks) and the rear
 *     (south and east) walls in tan brick, with a brick stair-and-lift block
 *     on the south-east rising above the main roof.
 *  4. Punched windows in tall vertical bays between limestone piers.
 *
 * Sources
 * - OSM (ODbL): way/340965638 (building=office, no height): the outline,
 *   the curved front at r 74.8..75.5 m from the monument (75.2 used).
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid, read in the circle frame (heights above the street,
 *   218.0 m NAVD88). Measured: the north bar and south-east wing walls at
 *   33.2 on the street sides, a 2 m setback at 39.4, another 2 m to the main
 *   roof at 45.5..46.6 (the east wall runs straight up to 46); the south
 *   wing on the Circle flat at 32.7..33.3 over x 64..78.5; a low court
 *   (8..10 m) at x 79..88, y -37..-54; the south-east lift block x 88..100.6,
 *   y -36..-46 at 49.5..50.9; the tower x 81..93, y -21..-35 at 51.3..52.4
 *   and its top x 83..91, y -23..-32.5 at 56.1..57.8.
 * - Published (Wikipedia, "Circle Tower"; NRHP 1983): 14 storeys, Art Deco,
 *   limestone, finished 1930; its setbacks answer the height limit on the
 *   Circle.
 * - Photos (Wikimedia Commons):
 *   "Circle Tower, Indianapolis - 2012.jpg" (Richie Diesterheft, CC BY-SA
 *   2.0, https://commons.wikimedia.org/wiki/File:Circle_Tower,_Indianapolis_-_2012.jpg),
 *   from the monument: the curved front, the arcade, the stepped top;
 *   "Circle Tower - Indianapolis.jpg" (Paul Sableman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Circle_Tower_-_Indianapolis.jpg),
 *   from across the Circle to the north-west: the brick south wing and the
 *   brick lift block over the main roof;
 *   "Circle Tower 2.jpg" (Paul Sableman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Circle_Tower_2.jpg), from the
 *   south-west: the brick south face with its painted sign.
 *
 * Estimated: the arcade (arches 3.6 m wide, springing at 5.0 m, 4.6 m
 *   apart), the window bays (3.2 m, panels grouped three storeys at a time),
 *   the crown's piers (0.8 m wide, 2.1..2.4 m tall: the lidar's ±1 m
 *   ripple on the tower roofs, drawn taller than measured so the jagged
 *   ziggurat top reads at phone size, as STYLE.md asks of crowns). Left out: the bronze doors and canopy, the Art Deco
 *   carving round the setbacks, the painted sign.
 * Doubts: the east and south walls are only seen obliquely; the court's
 *   walls are drawn plain brick.
 *
 * Exports the circle-frame helpers used by the other Monument Circle models
 * (indy-hilbert-circle-theatre, indy-christ-church-cathedral,
 * indy-columbia-club); the build runs only when this file is the entry.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, turn, outward, wallEdge, capRing, prism, chamfer, arc, flatShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- shared helpers

/** Points on a circle about the monument's axis (circle frame), degrees counter-clockwise from east. */
export const circlePts = (r: number, a0: number, a1: number, n: number): XY[] => arc(0, 0, r, a0, a1, n)
/** The angle (degrees) at which a circle of radius r about the monument crosses the line y = y0 (east side). */
export const angAtY = (r: number, y0: number) => (Math.asin(y0 / r) * 180) / Math.PI
/** The angle (degrees) at which a circle of radius r crosses the line x = x0 (north side). */
export const angAtX = (r: number, x0: number) => (Math.acos(x0 / r) * 180) / Math.PI
/** Move rings from the circle frame to the model frame (origin at the anchor), counter-clockwise. */
export const shifter = (ax: number, ay: number) => (r: XY[]): XY[] => ccw(r.map(([x, y]) => [x - ax, y - ay] as XY))

/** A prism whose walls go to part `b` where `useB(n, a, b)` says so (by the edge's outward normal), else `a`. */
export function prism2(a: Part, b: Part, roof: Part | null, r: XY[], z0: number, z1: number, useB: (n: XY, p: XY, q: XY) => boolean) {
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length]
    wallEdge(useB(outward(p, q), p, q) ? b : a, r, i, z0, z1)
  }
  if (roof) capRing(roof, r, z1)
}

/** Split a counter-clockwise ring into facade runs at corners sharper than `corner` degrees. */
export function facadeRuns(r: XY[], corner = 25): XY[][] {
  const cs = r.map((_, i) => i).filter((i) => Math.abs(turn(r, i)) >= corner)
  if (!cs.length) return [[...r, r[0]]]
  return cs.map((c, k) => {
    const e = cs[(k + 1) % cs.length], out: XY[] = []
    for (let i = c; ; i = (i + 1) % r.length) { out.push(r[i]); if (i === e && out.length > 1) break }
    return out
  })
}

export type PanelOpts = {
  bay: number
  w: number
  margin?: number
  d?: number
  /** Keep a bay? Given the wall's outward normal, the point and the run index. */
  keep?: (n: XY, p: XY, run: number, k: number, count: number) => boolean
  /** The panel's outline in (s, z) about the bay's centre; a rectangle by default. */
  shape?: (w: number, z0: number, z1: number) => XY[]
  corner?: number
}
/** Flat panels in bays along every facade run of a counter-clockwise ring, following curves. */
export function panels(part: Part, r: XY[], z0: number, z1: number, o: PanelOpts) {
  const margin = o.margin ?? 1.2, d = o.d ?? 0.06
  facadeRuns(r, o.corner).forEach((run, ri) => {
    const seg = run.slice(0, -1).map((p, i) => Math.hypot(run[i + 1][0] - p[0], run[i + 1][1] - p[1]))
    const L = seg.reduce((s, v) => s + v, 0)
    if (L < 2 * margin + o.w) return
    const n = Math.max(1, Math.round((L - 2 * margin) / o.bay))
    for (let k = 0; k < n; k++) {
      let s = margin + ((L - 2 * margin) * (k + 0.5)) / n, i = 0
      while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
      const a = run[i], b = run[i + 1], t: XY = [(b[0] - a[0]) / seg[i], (b[1] - a[1]) / seg[i]]
      const p: XY = [a[0] + t[0] * s, a[1] + t[1] * s], nn: XY = [t[1], -t[0]]
      if (o.keep && !o.keep(nn, p, ri, k, n)) continue
      const poly = o.shape ? o.shape(o.w, z0, z1) : ([[-o.w / 2, z0], [o.w / 2, z0], [o.w / 2, z1], [-o.w / 2, z1]] as XY[])
      flatShape(part, { o: [p[0], p[1], 0], n: nn }, poly, d)
    }
  })
}
/** Short piers (merlons) round the top of a ring: the jagged crowns of the Circle's towers. */
export function crownPiers(part: Part, r: XY[], z0: number, z1: number, gap: number, w = 0.7, depth = 0.5) {
  facadeRuns(r).forEach((run) => {
    const seg = run.slice(0, -1).map((p, i) => Math.hypot(run[i + 1][0] - p[0], run[i + 1][1] - p[1]))
    const L = seg.reduce((s, v) => s + v, 0)
    const n = Math.max(2, Math.round(L / gap))
    for (let k = 0; k < n; k++) {
      let s = (L * k) / n + w / 2, i = 0
      while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
      const a = run[i], b = run[i + 1], t: XY = [(b[0] - a[0]) / seg[i], (b[1] - a[1]) / seg[i]], nn: XY = [t[1], -t[0]]
      const c: XY = [a[0] + t[0] * s - nn[0] * depth / 2, a[1] + t[1] * s - nn[1] * depth / 2]
      const ring: XY[] = [[-w / 2, -depth / 2], [w / 2, -depth / 2], [w / 2, depth / 2], [-w / 2, depth / 2]].map(([u, v]) => [c[0] + t[0] * u + nn[0] * v, c[1] + t[1] * u + nn[1] * v] as XY)
      prism(part, part, ccw(ring), z0, z1)
    }
  })
}

// ---------------------------------------------------------------- the model
if (import.meta.main) {
  const AX = 84.98, AY = -34.33
  const S = shifter(AX, AY)
  const stone = new Part(), brick = new Part(), roof = new Part(), win = new Part(), arch = win

  const RF = 75.2 // the curved front's radius about the monument
  const XE = 100.6, YN = -14.5, YS = -36.5 // east wall, north wall, the north bar's south wall
  const B1 = 33.2, B2 = 39.4, B3 = 46.0 // street cornice, first setback, main roof
  const aSW = Math.atan2(-41.6, 63.0) * 180 / Math.PI // the front's south end

  // the north bar and the south-east wing, set back 2 m and 4 m on the street sides
  const bar = (rf: number, yn: number): XY[] => [
    ...circlePts(rf, angAtY(rf, YS), angAtY(rf, yn), 6),
    [XE, yn], [XE, -47.0], [88.0, -47.0], [88.0, YS],
  ]
  // the south wing on the Circle, 33 m
  const wing: XY[] = [...circlePts(RF, aSW, angAtY(RF, YS), 3), [78.5, YS], [78.5, -53.5]]
  // the podium: the whole outline, with the low court
  const podium: XY[] = [...circlePts(RF, aSW, angAtY(RF, YN), 10), [XE, YN], [XE, -53.9], [79.2, -54.0]]

  // brick on the rear: every wall that faces neither the Circle nor Market Street
  const front = (rf: number) => (n: XY, p: XY, q: XY) => !(n[1] > 0.7 || (Math.abs(Math.hypot(p[0] + AX, p[1] + AY) - rf) < 0.2 && Math.abs(Math.hypot(q[0] + AX, q[1] + AY) - rf) < 0.2))

  prism2(stone, brick, roof, S(podium), 0, 9.5, front(RF))
  prism2(stone, brick, roof, S(wing), 9.5, B1, front(RF))
  prism2(stone, brick, roof, S(bar(RF, YN)), 9.5, B1, front(RF))
  prism2(stone, brick, roof, S(bar(RF + 2, YN - 2)), B1, B2, front(RF + 2))
  prism2(stone, brick, roof, S(bar(RF + 4, YN - 4)), B2, B3, (n) => n[0] > 0.7 || n[1] < -0.7)
  // cornices: a thin band at each street cornice
  // the lift block on the south-east, brick
  prism(brick, roof, S([[88.0, -46.0], [XE, -46.0], [XE, -36.0], [88.0, -36.0]]), B3, 50.8)
  // the stepped tower and its crown
  const T1 = S([[81.0, -35.0], [93.0, -35.0], [93.0, -21.0], [81.0, -21.0]])
  const T2 = S([[83.0, -32.5], [91.0, -32.5], [91.0, -23.0], [83.0, -23.0]])
  prism(stone, roof, chamfer(T1, 0.4), B3, 51.3)
  prism(stone, roof, chamfer(T2, 0.4), 51.3, 56.2)
  crownPiers(stone, T1, 51.3, 53.4, 1.5, 0.8)
  crownPiers(stone, T2, 56.2, 58.6, 1.3, 0.8)
  prism(stone, roof, S([[85.6, -29.6], [88.4, -29.6], [88.4, -25.9], [85.6, -25.9]]), 56.2, 59.6)

  // ---------------------------------------------------- windows
  const isFront = (rf: number) => (n: XY, p: XY) => {
    const r = Math.hypot(p[0] + AX, p[1] + AY)
    return n[1] > 0.7 || Math.abs(r - rf) < 0.3
  }
  // the arcade on the Circle and on Market Street: round-headed shop arches
  panels(arch, S(podium), 0.4, 0, { bay: 4.6, w: 3.6, margin: 1.6, keep: isFront(RF), shape: (w) => archShape(0, w, 0.4, 5.0, 8) })
  // the office floors, three storeys to a panel, in 3.2 m bays
  const rows: [number, number][] = [[8.3, 17.3], [18.0, 27.0], [27.7, 32.2]]
  for (const [z0, z1] of rows) {
    panels(win, S(wing), z0, z1, { bay: 3.2, w: 1.7, margin: 1.4 })
    panels(win, S(bar(RF, YN)), z0, z1, { bay: 3.2, w: 1.7, margin: 1.4 })
  }
  panels(win, S(podium), 1.2, 6.8, { bay: 3.2, w: 1.7, margin: 1.4, keep: (n, p) => !isFront(RF)(n, p) && n[0] > 0.7 })
  panels(win, S(bar(RF + 2, YN - 2)), B1 + 0.9, B2 - 0.8, { bay: 3.2, w: 1.7, margin: 1.4 })
  panels(win, S(bar(RF + 4, YN - 4)), B2 + 0.9, B3 - 0.9, { bay: 3.2, w: 1.7, margin: 1.4 })
  panels(win, chamfer(T1, 0.4), B3 + 0.9, 50.4, { bay: 2.8, w: 1.4, margin: 1.2 })
  panels(win, chamfer(T2, 0.4), 52.2, 55.4, { bay: 2.6, w: 1.2, margin: 1.2 })
  panels(win, S([[88.0, -46.0], [XE, -46.0], [XE, -36.0], [88.0, -36.0]]), B3 + 0.9, 49.6, { bay: 3.2, w: 1.5, margin: 1.4 })

  const built = finishGlb('Circle Tower', [
    { part: stone, material: finish('indy-circle-limestone', 0xe8e1d1) },
    { part: brick, material: finish('indy-circle-tan-brick', 0xd8c09c) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ], { bearing: 1.5, height: 59.6, replaces: ['way/340965638'] }, 5000)
  await writeModel('indy-circle-tower', built)
}
