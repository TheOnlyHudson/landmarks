/**
 * Rock and Roll Hall of Fame, Cleveland (I. M. Pei, 1995).
 *
 * The white tower with the glass tent leaning on it, the drum cantilevered
 * on its single column to the south-west, the white wedge (the theatre)
 * hanging over the harbour to the north, and the entrance on the plaza.
 *
 * Frame: authored x east', y north', z up in metres, turned to bearing 10
 * (the tent's front glass face, on the plaza, runs 10.1° from north), anchor
 * at the centroid of the OSM outline (relation/10703171 outer). z = 0 is the
 * harbour water, the lowest ground the footprint touches: the lawn and the
 * walkway west and north of the building are ~1.5 m up, the plaza east of
 * the tent 7.7 m. elevation 0.
 *
 * Sources
 * - OSM: relation/10703171 (outer way/101536152, inner courtyard
 *   way/771759120) and parts way/381414589 (tent, h 40), way/1534393250
 *   (tower, h 49), way/1534631765 (drum, h 30), way/1535041638 (wedge, h 30).
 *   way/1534054693 (h 20 black-glass skillion triangle on the south lawn,
 *   mapped 2026-06/10) is the 2024– expansion; see Doubts.
 * - USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (flight 2019), 1 m grid,
 *   read in this frame. All heights below are measured from it, above the
 *   water, unless marked otherwise.
 * - USGS NAIP orthophoto for the plan.
 * - Published: tower 162 ft (49.4 m) above the lawn (Wikipedia, "Rock and
 *   Roll Hall of Fame"): lidar 51.0 above water = 49.5 above the lawn.
 * - Photos (all EVIDENCE):
 *   - "Rock and Roll Hall of Fame, May 2016", MusikAnimal, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Rock_and_Roll_Hall_of_Fame,_May_2016.jpg
 *     (east, from the plaza: front face, apex at the tower's south-east
 *     corner, the shoulder to the north)
 *   - "Cleveland August 2015 52 (Rock and Roll Hall of Fame and Museum)",
 *     Michael Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_August_2015_52_(Rock_and_Roll_Hall_of_Fame_and_Museum).jpg
 *     (west-north-west across the harbour: tower, wedge, drum on its column)
 *   - "Rock and Roll Hall of Fame from Erieside", Kevin Payravi, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Rock_and_Roll_Hall_of_Fame_from_Erieside.jpg
 *     (south-south-west: drum tiers, tent slope)
 *   - "Rock and Roll Hall of Fame (2012)", Erik Drost, CC BY 2.0, via Commons
 *     category "Rock and Roll Hall of Fame" (north-east pier: wedge, north
 *     glass wall, white bar)
 *   - "Rock and Roll Hall of Fame - October 2015" / Tony Fischer Photography
 *     (Flickr 6842396246), CC BY 2.0 (east at night: lit interior through
 *     the glass)
 *   - "Rock & Roll Hall of Fame 2024", Lyle, CC0, taken 2023-08-30 (east)
 *   - "Science Center and Rock Hall from Convention Center", Cards84664,
 *     CC BY-SA 4.0, 2023-03-26 (south-west, far)
 *
 * Numbers
 * - Tent front face: plane z = 7.7 + 0.96 (26.2 − x), 44°, measured. Apex
 *   against the tower's south-east corner, 42.5 m (lidar 40.8 at x = −8);
 *   the tower stands 8.5 m above it (musik photo: 7.9). The face's left
 *   edge follows the OSM south edge; its right edge ends at the OSM vertex
 *   (26.3, 30.7). The north shoulder is a parallel plane 3.4 m lower
 *   (measured), bounded by the OSM north edges. Side walls vertical (photos).
 * - Tower 51.0, roof well 43.6 not modelled. Windows: top windows and the
 *   west face's tall slot placed from barera52/payravi (estimated).
 * - Wedge: top slopes 29.5 → 36.5 northward (measured); plan from lidar
 *   (pointed to the north, narrower than OSM to the east); underside 18 m
 *   (estimated, barera52).
 * - Drum: lower ring r 11 (OSM r 11.5, lidar ~10) to 21.5, upper drum r 8.5
 *   (lidar), roof sloping 27.0 → 30.2 southward (measured); ring underside
 *   13.5 m and the column (estimated, payravi/barera52).
 * - Connector south of the tower 21.5 (lidar 20.6 / 24, averaged); the
 *   courtyard stays open, as OSM and lidar show.
 * - Entrance canopy 12.1 (measured); white bar outside the north wall
 *   9.8–16.6, x −10.5..−3, y 12.8..31 (lidar; bottom from barera52), on a
 *   beige podium with a window band, as barera52 shows. A white band
 *   9–15 m runs 30 m along the north wall from the tower (barera52,
 *   droststadium; height estimated), over a window band 6.5–9 and a beige
 *   base, all along the north wall.
 * - Interior floors at 13.6 / 19.6 / 25.6 and their extents are invented,
 *   to be seen through the glass; the gallery windows on the tower's east
 *   face are invented likewise (fischer shows lit floors there at night).
 *
 * Doubts
 * - The expansion (construction began 2024; OSM way/1534054693, a 20 m
 *   black-glass wedge on the south lawn) is not modelled: no dated licensed
 *   photo of it was found (Commons and Openverse, Nov 2026), the 2019 lidar
 *   predates it and the NAIP shows lawn. It is left out of `replaces`, so the
 *   map keeps drawing OSM's extrusion for it beside this model.
 * - The wedge is a simplified prism: the real one is a skewed rhomboid whose
 *   faces are cut at angles; its east end is guessed.
 * - The tent's diagonal frame lines are drawn as two bars parallel to each
 *   edge, a simplification of the real lattice.
 *
 * Look-only: none used.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, walls, cap, block, save } from './chi-field-museum'

const S: XY = [26.1, -42.7], N: XY = [26.3, 30.7], NE: XY = [26.3, 45.5]
const A: XY = [-10.0, -4.7]
const NW1: XY = [10.6, 31.3], NW2: XY = [-5.6, 16.7], NW3: XY = [-9.9, 12.8]
const front = (x: number) => 7.7 + 0.96 * (26.2 - x)
const shoulder = (x: number) => Math.max(6.5, front(x) - 3.4)

/** Points every <= `step` metres along a→b, ends included. */
function along(a: XY, b: XY, step = 5): XY[] {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
  return Array.from({ length: n + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n] as XY)
}

/** A vertical wall under a→b from z0(p) to z1(p), split every 5 m; outward is to the right of a→b. */
function wall(p: Part, a: XY, b: XY, z0: (q: XY) => number, z1: (q: XY) => number) {
  const pts = along(a, b)
  for (let i = 0; i < pts.length - 1; i++) {
    const u = pts[i], v = pts[i + 1]
    p.quad([u[0], u[1], z0(u)], [v[0], v[1], z0(v)], [v[0], v[1], z1(v)], [u[0], u[1], z1(u)])
  }
}

/** A flat bar `w` wide lying on a surface z = f(x, y), lifted `lift`. */
function bar(p: Part, a: XY, b: XY, w: number, f: (q: XY) => number, lift = 0.12) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const nx = -(b[1] - a[1]) / l * w / 2, ny = (b[0] - a[0]) / l * w / 2
  const P = (q: XY, s: number): V3 => { const r: XY = [q[0] + nx * s, q[1] + ny * s]; return [r[0], r[1], f(r) + lift] }
  const pts = along(a, b, 8)
  for (let i = 0; i < pts.length - 1; i++) p.quad(P(pts[i], -1), P(pts[i + 1], -1), P(pts[i + 1], 1), P(pts[i], 1))
}

/** Clip a ring to x <= X. */
function clipX(r: XY[], X: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], ia = a[0] <= X, ib = b[0] <= X
    if (ia) out.push(a)
    if (ia !== ib) { const t = (X - a[0]) / (b[0] - a[0]); out.push([X, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}

const circ = (cx: number, cy: number, r: number, n = 16): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)] as XY)

/** A window panel on the face of a box side, outward normal `o` (unit, horizontal). */
function pane(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.06) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ox = (b[1] - a[1]) / l * out, oy = -(b[0] - a[0]) / l * out
  p.quad([a[0] + ox, a[1] + oy, z0], [b[0] + ox, b[1] + oy, z0], [b[0] + ox, b[1] + oy, z1], [a[0] + ox, a[1] + oy, z1])
}

function build() {
  const white = new Part(), glass = new Part(), win = new Part(), steel = new Part(), base = new Part(), roof = new Part()

  // Tower.
  const T0 = -29.6, T1 = -10.0, TS = -5.0, TN = 12.8, TH = 51.0
  block(white, roof, ccw([[T0, TS], [T1, TS], [T1, TN], [T0, TN]]), 0, TH, 0.4)
  // Top windows: north face near its east end, south face near its west end.
  pane(win, [-11.6, TN], [-16.0, TN], 40.8, 46.0)
  pane(win, [-28.0, TS], [-23.6, TS], 40.8, 46.0)
  // Tall slot on the west face, south end.
  pane(win, [T0, -1.1], [T0, -3.8], 23.6, 32.7)
  // Gallery openings on the east face inside the tent.
  for (const [z0, z1] of [[9.0, 12.4], [15.0, 18.4], [21.0, 24.4], [27.0, 30.4]]) pane(win, [T1, -3.2], [T1, 11.6], z0, z1)

  // Connector south of the tower, round the open courtyard.
  const C = ccw([[-14.1, -22.4], [-11.1, -22.5], [-5.1, -21.6], [-0.2, -24.8], [4.2, -19.7], [-6.4, -8.6], [-12.6, -14.5], [-17.6, -4.9], [-21.5, -4.9]])
  block(white, roof, C, 0, 21.5, 0.4)
  pane(win, [-21.5, -4.9], [-14.1, -22.4], 15.5, 19.0)

  // Drum: column, lower ring, upper drum with its roof sloping south.
  const DX = -10.5, DY = -34.0
  const col = circ(DX, DY, 1.6, 12)
  walls(white, col, 0, 13.7)
  const ring = circ(DX, DY, 11.0)
  const ri = block(white, null, ring, 13.5, 21.5, 0.4)
  cap(white, ring, 13.5, false)
  cap(roof, ri, 21.5)
  const up = circ(-10.0, -35.5, 8.5)
  const dz = (q: XY) => 27.0 + (-25 - q[1]) * 0.168
  for (let i = 0; i < up.length; i++) {
    const a = up[i], b = up[(i + 1) % up.length]
    white.quad([a[0], a[1], 21.5], [b[0], b[1], 21.5], [b[0], b[1], dz(b)], [a[0], a[1], dz(a)])
  }
  const upTop = up.map(([x, y]) => [x, y, dz([x, y])] as V3)
  for (let i = 1; i < upTop.length - 1; i++) roof.tri(upTop[0], upTop[i], upTop[i + 1])

  // Wedge over the harbour: underside 18, top sloping up to the north.
  const W = ccw([[-30.5, 12.8], [-12.5, 12.8], [-13.0, 26.0], [-20.5, 37.0], [-34.5, 25.5], [-34.0, 19.0]])
  const wz = (q: XY) => 29.5 + 0.32 * (q[1] - 13)
  for (let i = 0; i < W.length; i++) {
    const a = W[i], b = W[(i + 1) % W.length]
    white.quad([a[0], a[1], 18], [b[0], b[1], 18], [b[0], b[1], wz(b)], [a[0], a[1], wz(a)])
  }
  cap(white, W, 18, false)
  const WT = W.map(([x, y]) => [x, y, wz([x, y])] as V3)
  for (let i = 1; i < WT.length - 1; i++) roof.tri(WT[0], WT[i], WT[i + 1])
  // Ribbon window under the wedge's west end, as barera52 shows.
  pane(win, [-34.0, 19.0], [-30.5, 12.8], 19.5, 21.5)

  // White bar outside the north wall, on a podium with a window band.
  const B = ccw([[-10.5, 12.8], [-3.0, 12.8], [-3.0, 31.0], [-10.5, 31.0]])
  block(base, null, B, 0, 7.2, 0)
  walls(win, B, 7.2, 9.8)
  block(white, roof, B, 9.8, 16.6, 0.4)

  // Entrance canopy on the plaza.
  const E = ccw([[20, -21], [28.2, -21], [28.2, 12], [20, 12]])
  walls(win, E, 7.7, 10.9)
  block(steel, roof, E, 10.9, 12.1, 0.2)

  // Tent: the front face, the north shoulder, the vertical side walls.
  const F = (q: XY) => front(q[0]), Sh = (q: XY) => shoulder(q[0]), z0 = () => 0
  glass.tri([S[0], S[1], F(S)], [N[0], N[1], F(N)], [A[0], A[1], F(A)])
  const SH: XY[] = [A, N, NE, NW1, NW2, NW3]
  for (let i = 1; i < SH.length - 1; i++) glass.tri([SH[0][0], SH[0][1], Sh(SH[0])], [SH[i][0], SH[i][1], Sh(SH[i])], [SH[i + 1][0], SH[i + 1][1], Sh(SH[i + 1])])
  // Step between the front face and the shoulder.
  wall(glass, N, A, Sh, F)
  // South wall, plinth from the lawn up.
  wall(glass, A, S, () => 1.5, F)
  wall(base, A, S, z0, () => 1.5)
  // East: the plaza deck under the front face and the shoulder.
  wall(base, S, NE, z0, (q) => Math.min(7.7, q[1] > N[1] ? Sh(q) : 7.7))
  // North walls: beige podium to 6.5, a window band to 9, glass above.
  for (const [a, b] of [[NE, NW1], [NW1, NW2], [NW2, NW3]] as [XY, XY][]) {
    wall(base, a, b, z0, (q) => Math.min(6.5, Sh(q)))
    wall(win, a, b, (q) => Math.min(6.5, Sh(q)), (q) => Math.min(9, Sh(q)))
    wall(glass, a, b, (q) => Math.min(9, Sh(q)), Sh)
  }
  // The white band along the north wall, from the tower two-thirds of the
  // way to the plaza (barera52, droststadium).
  {
    const d: XY = [0.743, 0.670], o: XY = [-0.670, 0.743]
    const bp = (s: number, t: number): XY => [NW3[0] + d[0] * s + o[0] * t, NW3[1] + d[1] * s + o[1] * t]
    block(white, roof, ccw([bp(0, -0.5), bp(30, -0.5), bp(30, 2.5), bp(0, 2.5)]), 9.0, 15.0, 0.3)
  }

  // Steel frame: edges of the faces and the big diagonals of the front face.
  const lerpXY = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  bar(steel, S, A, 0.7, F, 0.06)
  bar(steel, A, N, 0.7, F, 0.06)
  bar(steel, S, N, 0.6, F, 0.06)
  bar(steel, N, NE, 0.5, Sh, 0.06)
  bar(steel, NE, NW1, 0.6, Sh, 0.06)
  bar(steel, NW1, NW2, 0.6, Sh, 0.06)
  bar(steel, NW2, NW3, 0.6, Sh, 0.06)
  for (const f of [1 / 3, 2 / 3]) {
    bar(steel, lerpXY(S, N, f), lerpXY(A, N, f), 0.35, F)
    bar(steel, lerpXY(N, S, f), lerpXY(A, S, f), 0.35, F)
  }
  bar(steel, lerpXY(N, NE, 0.5), lerpXY(A, NW3, 0.5), 0.3, Sh)

  // Interior floors seen through the glass.
  const plan = ccw([S, N, NE, NW1, NW2, NW3, A])
  for (const [z, X] of [[7.7, 25.5], [13.6, 2], [19.6, -2], [25.6, -5]] as [number, number][]) {
    const r = clipX(plan, X)
    block(white, white, r, z - 0.7, z, 0)
    if (z > 8) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.abs(a[0] - X) < 1e-6 && Math.abs(b[0] - X) < 1e-6) pane(win, a, b, z - 0.7, z - 0.15, 0.04)
    }
  }

  return [
    // At night the tower top and the wedge are washed with light
    // (Drost 2020, Fischer, Highsmith): floodlight the upper walls.
    { part: white, material: { ...finish('cle-rrhof-panel', 0xe9eceb), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.1 : q[2] > 28 ? 0.85 : 0.3) } },
    { part: glass, material: { name: 'glass', color: 0x4b5c92, roughness: 0.2, opacity: 0.6, doubleSided: true } },
    { part: win, material: PALETTE.window },
    { part: steel, material: finish('cle-rrhof-steel', 0x4f5662, 0.6) },
    { part: base, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cle-rock-and-roll-hall-of-fame', 'Rock and Roll Hall of Fame', [41.5085188, -81.6954772], 10, build() as any)
