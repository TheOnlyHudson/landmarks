/**
 * Madam Walker Legacy Center (the Madam C. J. Walker Building and Walker
 * Theatre, 1927, Rubush & Hunter), 617 Indiana Avenue, Indianapolis:
 * procedural, CC0-1.0.
 * bun generators/indy-madam-walker-legacy-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The origin is the
 * area centroid of OSM way/200813905 (-86.1672202, 39.7761558), the
 * triangular block between Indiana Avenue (the long south-west side),
 * North Street (north-west side) and West Street (east side). The site is
 * flat (lidar ground varies < 0.5 m); y = 0 is the street.
 *
 * Identity (from the photos below):
 *  1. A four-storey triangular "flatiron" block of tan-brown brick with
 *     cream terracotta trim, the right-angled north corner cut into a narrow
 *     bay with a clock under a raised parapet.                      (N)
 *  2. The rooftop "WALKER THEATRE" sign: two rows of big red letters on an
 *     open steel frame over the north corner.                       (N)
 *  3. Tall brick pilaster strips between the window bays, rising to cream
 *     caps at the parapet; a cream belt course over the ground floor;
 *     ground-floor openings in cream terracotta frames.          (N, E)
 *  4. The dark marquee with gold trim on the West Street side.  (N, E)
 *  5. The lower south part (the theatre end), 3 m lower than the north.
 *                                                                 (lidar)
 *
 * Sources
 * - OSM (ODbL): way/200813905 (building=yes, "Madam C. J. Walker
 *   Building"); the place node node/367792923 (the Legacy Center) stands on
 *   it. No heights.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   1 m grid. Measured: the north part's roof 18.2..18.7 with parapets
 *   19.0..19.6; the south part's roof 15.1..15.5, parapets 16.1..16.6; the
 *   boundary between them runs from the north-west face at x -25 to the
 *   east face at y -5.
 * - Photos (Wikimedia Commons):
 *   "Madame Walker Theatre Center.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Madame_Walker_Theatre_Center.jpg),
 *   the north corner, both street faces, the rooftop sign, the clock bay;
 *   "Indy Walker theatre.jpg" (Collin Anderson, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Indy_Walker_theatre.jpg), the
 *   marquee, the ground-floor frames, the window rhythm and brick colour.
 * Look-only (GFDL, not used for shape): "WalkerTheatreIndy.jpg" and
 *   "WalkerTheatreDetails.jpg" (Jonathunder), not opened.
 *
 * Estimated: storey heights (ground floor 5.0 m, then 4.1 m), the window
 *   bays (2.7 m), the sign (10 m wide, 5.6 m tall over the roof, set on the
 *   corner's bisector), the marquee's place and size, from the photos
 *   against the lidar heights.
 * Doubts: the Indiana Avenue (south-west) face is unphotographed here and is
 *   drawn with the same bays; whether the marquee face is West Street (the
 *   geometry of the north-corner photo says so).
 * Left out: the sign's letters (drawn as two red neon bands), the
 *   African and Art Deco terracotta ornament, the vertical blade sign, the
 *   clock's face (a pale disc).
 * Night: the rooftop sign glows red (`neon-walker-red`); windows glow; the
 *   marquee is `entrance`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, ccw, flatShape, extrudeShape, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'

const brick = new Part(), terra = new Part(), win = new Part(), ent = new Part(), roof = new Part(), neon = new Part()

// the outline, counter-clockwise, corners cut: W (51 deg), SE (39 deg), N (90 deg, the clock bay)
const W: XY = [-29.35, 10.0], SE: XY = [20.3, -28.65], N: XY = [9.5, 20.1]
const lerp = (a: XY, b: XY, d: number): XY => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * d / L, a[1] + (b[1] - a[1]) * d / L] }
const RING: XY[] = [lerp(W, SE, 1.4), lerp(SE, W, 1.4), lerp(SE, N, 1.4), lerp(N, SE, 2.2), lerp(N, W, 2.2), lerp(W, N, 1.4)]
// the higher north part
const HIGH: XY[] = [lerp(N, SE, 2.2), lerp(N, W, 2.2), [-25.0, 11.94], [-24.0, 9.5], [-12.0, 4.0], [-10.5, -4.5], [15.5, -5.0]]
const LOW_H = 15.0, HIGH_H = 18.3, PAR = 1.1

/** Faces of a ring: each edge with its outward face, length and start. */
function faces(r: XY[]) {
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    return { a, b, L, t, f: { o: [a[0], a[1], 0], n: [t[1], -t[0]] } as Face }
  })
}
/** Is the point (on a wall) in the high part? */
const inHigh = (p: XY) => {
  // left of every edge of the convex-ish HIGH polygon (it is convex enough here)
  const h = ccw(HIGH)
  return h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= -0.5 })
}

// ---------------------------------------------------------------- masses
prism(brick, roof, ccw(RING), 0, LOW_H)
prism(brick, roof, ccw(HIGH), LOW_H, HIGH_H)
// parapets: a brick band along each part's edges, cream coping. The low part's run along
// the streets from the boundary at the east face round to the boundary on the north-west face;
// the high part's run all round it (its inner edges step down to the low roof).
function parapet(pts: XY[], z: number, closed: boolean) {
  const m = closed ? pts.length : pts.length - 1
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.5) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const q: XY[] = [a, b, [b[0] - n[0] * 0.4, b[1] - n[1] * 0.4], [a[0] - n[0] * 0.4, a[1] - n[1] * 0.4]]
    prism(brick, null, ccw(q), z, z + PAR, 1)
    prism(terra, terra, ccw([[a[0] + n[0] * 0.12, a[1] + n[1] * 0.12], [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12], [b[0] - n[0] * 0.5, b[1] - n[1] * 0.5], [a[0] - n[0] * 0.5, a[1] - n[1] * 0.5]]), z + PAR, z + PAR + 0.3, 1)
  }
}
// RING runs W-SE, SE, SE-N, N bay, N-W, W: the low street edges, counter-clockwise
parapet([[-25.0, 11.94], RING[5], RING[0], RING[1], RING[2], [15.5, -5.0]], LOW_H, false)
parapet(ccw(HIGH), HIGH_H, true)
// the clock bay's raised parapet
{
  const a = lerp(N, SE, 2.2), b = lerp(N, W, 2.2)
  const n: XY = (() => { const t: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...t); return [-t[1] / L, t[0] / L] })()
  const q: XY[] = [a, b, [b[0] - n[0] * 1.2, b[1] - n[1] * 1.2], [a[0] - n[0] * 1.2, a[1] - n[1] * 1.2]]
  prism(brick, null, ccw(q), HIGH_H, HIGH_H + PAR + 1.3, 1)
  prism(terra, terra, ccw(q.map(([x, y]) => [x + n[0] * 0.12, y + n[1] * 0.12] as XY)), HIGH_H + PAR + 1.3, HIGH_H + PAR + 1.6, 1)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const f: Face = { o: [a[0], a[1], 0], n: [-n[0], -n[1]] }
  void f
}

// ---------------------------------------------------------------- facades
const GF = 5.0, FL = 4.1 // ground floor, upper storeys
for (const { a, L, t, f } of faces(ccw(RING))) {
  if (L < 3) {
    // a corner bay: the clock bay (N) or a cut acute corner
    const mid: XY = [a[0] + t[0] * L / 2, a[1] + t[1] * L / 2]
    const isClock = mid[1] > 15
    flatShape(terra, f, rect(0.15, 0, L - 0.15, 1.0), 0.04)
    if (isClock) {
      flatShape(ent, f, rect(L / 2 - 0.6, 0, L / 2 + 0.6, 2.7), 0.06)
      for (const z0 of [GF + 0.6, GF + FL + 0.6]) flatShape(win, f, rect(L / 2 - 0.65, z0, L / 2 + 0.65, z0 + 2.4), 0.06)
      flatShape(terra, f, arc(L / 2, HIGH_H - 0.6, 0.55, 0, 360, 12).slice(0, -1), 0.05)
      flatShape(terra, f, rect(0.1, GF - 0.35, L - 0.1, GF + 0.1), 0.05)
      
    }
    continue
  }
  // belt course over the ground floor and a cream plinth
  flatShape(terra, f, rect(0, GF - 0.35, L, GF + 0.1), 0.05)
  flatShape(terra, f, rect(0, 0, L, 0.6), 0.04)
  const bay = 2.7, n = Math.round((L - 1.0) / bay), step = (L - 1.0) / n
  for (let k = 0; k < n; k++) {
    const s = 0.5 + step * (k + 0.5)
    const p: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
    const top = inHigh(p) ? HIGH_H : LOW_H
    const floors = inHigh(p) ? 3 : 2
    // upper windows, one panel per window
    for (let j = 0; j < floors; j++) {
      const z0 = GF + 0.7 + j * FL
      flatShape(win, f, rect(s - 0.62, z0, s + 0.62, z0 + 2.3), 0.06)
    }
    // pilaster strips between bays, with cream caps under the parapet
    if (k > 0) {
      const sp = s - step / 2
      extrudeShape(brick, f, rect(sp - 0.25, GF + 0.1, sp + 0.25, top + PAR - 0.2), 0, 0.3)
      extrudeShape(terra, f, rect(sp - 0.3, top + PAR - 0.75, sp + 0.3, top + PAR - 0.2), 0, 0.36)
    }
    // ground floor: openings in cream frames
    flatShape(terra, f, rect(s - 0.95, 0.6, s + 0.95, GF - 0.6), 0.04)
    flatShape(k % 3 === 1 ? ent : win, f, rect(s - 0.7, 0.6, s + 0.7, GF - 0.9), 0.06)
  }
}

// ---------------------------------------------------------------- the marquee on West Street
{
  const t: XY = [(SE[0] - N[0]), (SE[1] - N[1])], L = Math.hypot(...t), u: XY = [t[0] / L, t[1] / L], n: XY = [-u[1], u[0]]
  // n points out of the east face? the east face's outward normal is to the right of SE->N, i.e. left of N->SE
  const P = (s: number, d: number): XY => [N[0] + u[0] * s + n[0] * d, N[1] + u[1] * s + n[1] * d]
  const q: XY[] = [P(9.0, 0), P(19.0, 0), P(19.0, 3.4), P(9.0, 3.4)]
  prism(ent, ent, ccw(q), 4.0, 5.4, 1)
  prism(terra, terra, ccw([P(8.9, -0.0), P(19.1, 0), P(19.1, 3.5), P(8.9, 3.5)]), 5.4, 5.6, 1)
}

// ---------------------------------------------------------------- the rooftop sign over the north corner
{
  // on the corner's bisector, 6 m in from the clock bay, facing north-north-east
  const c: XY = [5.9, 14.1]
  const face: XY = [0.52, 0.854] // out from the corner (bisector of the two street faces)
  const along: XY = [face[1], -face[0]]
  const W2 = 5.6, z0 = HIGH_H + PAR + 0.2
  const P = (s: number, d: number): XY => [c[0] + along[0] * s + face[0] * d, c[1] + along[1] * s + face[1] * d]
  // the frame: four posts and two rails
  for (const s of [-W2 + 0.2, -1.6, 1.6, W2 - 0.2]) {
    const p = P(s, -0.35)
    box(terra, terra, p[0] - 0.12, p[1] - 0.12, p[0] + 0.12, p[1] + 0.12, z0, z0 + 6.0)
  }
  // the two lines of letters as red panels, back-to-back on a thin board
  const board = (zb: number, zt: number) => prism(neon, neon, ccw([P(-W2, -0.08), P(W2, -0.08), P(W2, 0.08), P(-W2, 0.08)]), zb, zt, 1)
  board(z0 + 3.5, z0 + 5.8)
  board(z0 + 0.8, z0 + 3.1)
}

const built = finishGlb('Madam Walker Legacy Center', [
  { part: brick, material: finish('indy-mw-brick', 0xc2a378) },
  { part: terra, material: finish('indy-mw-terracotta', 0xefe3cc) },
  { part: win, material: PALETTE.window },
  { part: ent, material: finish('entrance', 0x4a3a2e) },
  { part: roof, material: PALETTE.roof },
  { part: neon, material: finish('neon-walker-red', 0xa8343a) },
], { bearing: 0, height: HIGH_H + 6.2, replaces: ['way/200813905'] }, 5000)
await writeModel('indy-madam-walker-legacy-center', built)
