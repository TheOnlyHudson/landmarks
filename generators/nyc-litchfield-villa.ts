/**
 * Litchfield Villa, Prospect Park, Brooklyn (Alexander Jackson Davis, 1857;
 * Prospect Park Alliance offices) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-litchfield-villa.ts
 *
 * Frame: x = model east (toward 123.2°, Prospect Park West), y = model
 * north (toward 33.2°, the Brooklyn grid), z up, metres. Placed at bearing
 * 33.2°. Anchor: the area centroid of OSM way/241846599 (-73.973706,
 * 40.666899), which the model replaces. The park front, with the towers,
 * faces −x (west-north-west, toward the Long Meadow).
 *
 * Also exports small helpers (`archWin`, `rectWin`, `hipRoof`, `parapet`,
 * `cornice`, `cyl`, `dome`) used by the other Prospect Park buildings of this
 * group (picnic house, tennis house, Lefferts house, peristyle, Concert Grove
 * pavilion).
 *
 * Evidence
 * - OSM way/241846599 (ODbL): outline 710 m², height=20.1, start 1857;
 *   main axis 33.2°. The outline shows the round turrets at the NW and NE
 *   corners, the chamfered octagonal tower and its bow window on the park
 *   front, the chamfered bay on the rear, the north bay, and the 1913 annex
 *   (17.5 × 8.8 m) reached by a link to the south-east.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, read in the
 *   model frame. Ground under the footprint: 6.4–6.6 m (above the crop's
 *   minimum) on the east side = y 0 here; the park front is 1.1–1.4 m higher,
 *   the annex's ground about 2.2 m higher. Measured, above y 0: square tower
 *   x −14.5…−8.0, y 4.3…10.1 over the cornice (body drawn x −14.2…−8.6,
 *   y 4.6…9.8, slimmer as the photo shows), roof 19.9, balustrade 21.0;
 *   octagonal tower x −15.1…−7.0, y −2.6…4.3 over the cornice (body
 *   −15.0…−7.2, −2.4…4.6), roof 16.0, balustrade 17.0; main roof eaves
 *   12.0–12.5, ridge 15.2; both round turrets to 15.1; north bay 10.8;
 *   veranda along the south and west 6.6–7.3; annex and link 10.5–12.0.
 * - Published (Wikipedia "Litchfield Villa"; NYC LPC designation 1966):
 *   Italianate villa by A. J. Davis for Edwin C. Litchfield, 1854–57; the
 *   stucco that once covered the brick was removed; corn-cob capitals on the
 *   veranda; annex added 1913 for the parks department.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Rhododendrites, "Litchfield Villa (14034p).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Litchfield_Villa_(14034p).jpg
 *     (park front, square on: towers, turret, windows, heights);
 *   Jim.henderson, "Litchfield Villa PPW jeh.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Litchfield_Villa_PPW_jeh.jpg
 *     (park front, steps and the pale veranda on the right);
 *   Jim.henderson, "Litchfield Villa jeh.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:Litchfield_Villa_jeh.JPG
 *     (from the south-west: the pedimented south gable over the colonnade);
 *   Anira3478, "Litchfield Villa.JPG", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Litchfield_Villa.JPG
 *     (front from a distance);
 *   A. J. Davis, "Grace Hill for Edwin C. Litchfield … (front elevation)",
 *     The Met, CC0,
 *     https://commons.wikimedia.org/wiki/File:Grace_Hill_for_Edwin_C._Litchfield,_Brooklyn,_New_York_(front_elevation)_MET_DP370756.jpg
 *     (the design: towers, veranda with balustrade, low metal roofs).
 *
 * Estimated from the frontal photo scaled to the lidar tower height (25.9
 * px/m): window heads and sills, the tower door (1.6–4.8 m), the bow window
 * (to 6.1 m) and balconies, the turret windows and cornice. Turret cap
 * shape from the photos. Small roof cupolas from the photo, positions from
 * lidar bumps.
 *
 * Doubts: no licensed photo shows the rear (east) face or the annex; the
 * rear is drawn with plain paired windows, and the annex as two pale
 * storeys with a flat roof (its colour from NAIP and the pale stucco of the
 * veranda). The NE turret is drawn like the photographed NW one. Ivy on the
 * left wing is ignored. Corn-cob capitals are plain columns.
 */
import { Part, type V3 } from './mesh'
import { finishModel, chamferRect, prism, capPoly, insetRing, area, type XY } from './nyc-570-lexington'
import { wallFrame, triN, quadF, box } from './nyc-prospect-park-boathouse'
import { PALETTE, finish } from './palette'

type WF = ReturnType<typeof wallFrame>

/** A wall frame for the edge a→b of a counter-clockwise ring (d points out). */
export function edgeFrame(a: XY, b: XY): WF & { L: number } {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { ...wallFrame(a, [(b[0] - a[0]) / L, (b[1] - a[1]) / L]), L }
}

/** A flush round-headed window: jambs z0…spring, semicircle of half-width r on top. */
export function archWin(p: Part, w: WF, s: number, z0: number, zTop: number, r: number, d = 0.05, seg = 8) {
  const spring = zTop - r
  quadF(p, w.at(s - r, z0, d), w.at(s + r, z0, d), w.at(s + r, spring, d), w.at(s - r, spring, d), w.n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    triN(p, w.at(s, spring, d), w.at(s + r * Math.cos(a0), spring + r * Math.sin(a0), d), w.at(s + r * Math.cos(a1), spring + r * Math.sin(a1), d), w.n)
  }
}

/** A flush rectangular panel on a wall. */
export function rectWin(p: Part, w: WF, s: number, z0: number, z1: number, hw: number, d = 0.05) {
  quadF(p, w.at(s - hw, z0, d), w.at(s + hw, z0, d), w.at(s + hw, z1, d), w.at(s - hw, z1, d), w.n)
}

/** A slab standing proud of a wall (sill, hood, pilaster, balcony): s0…s1 along, z0…z1, out to depth t. */
export function wallBox(p: Part, w: WF, s0: number, s1: number, z0: number, z1: number, t: number, bottom = true) {
  const P = (s: number, z: number, d: number) => w.at(s, z, d)
  const u: V3 = [P(1, 0, 0)[0] - P(0, 0, 0)[0], P(1, 0, 0)[1] - P(0, 0, 0)[1], 0]
  quadF(p, P(s0, z0, t), P(s1, z0, t), P(s1, z1, t), P(s0, z1, t), w.n)
  quadF(p, P(s0, z1, 0), P(s1, z1, 0), P(s1, z1, t), P(s0, z1, t), [0, 0, 1])
  if (bottom) quadF(p, P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, t), P(s0, z0, t), [0, 0, -1])
  quadF(p, P(s0, z0, 0), P(s0, z0, t), P(s0, z1, t), P(s0, z1, 0), [-u[0], -u[1], 0])
  quadF(p, P(s1, z0, 0), P(s1, z0, t), P(s1, z1, t), P(s1, z1, 0), u)
}

/** Offset a ring outward (positive d) — counter-clockwise rings only. */
export const outset = (ring: XY[], d: number): XY[] => insetRing(ccw(ring), -d)
export const ccw = (ring: XY[]): XY[] => (area(ring) < 0 ? ring.slice().reverse() : ring.slice())

/** A projecting cornice band round a ring: outset by o, z0…z1, with its soffit and a top cap (if roof given). */
export function cornice(p: Part, ring: XY[], z0: number, z1: number, o: number, top: Part | null = p, bevel = 0.12) {
  const r = ccw(ring), out = outset(r, o)
  prism({ wall: p, win: null, roof: top, coping: p, ring: out, z0, z1, facade: null, bevel })
  // soffit from the wall out to the band's edge
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    quadF(p, [r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [out[j][0], out[j][1], z0], [out[i][0], out[i][1], z0], [0, 0, -1])
  }
}

/** A hollow parapet or balustrade band on a ring: outer wall flush with the ring, t thick. */
export function parapet(p: Part, ring: XY[], z0: number, z1: number, t: number) {
  const r = ccw(ring), inn = insetRing(r, t)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const n: V3 = [r[j][1] - r[i][1], r[i][0] - r[j][0], 0]
    quadF(p, [r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1], n)
    quadF(p, [inn[i][0], inn[i][1], z0], [inn[j][0], inn[j][1], z0], [inn[j][0], inn[j][1], z1], [inn[i][0], inn[i][1], z1], [-n[0], -n[1], 0])
    quadF(p, [r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [inn[j][0], inn[j][1], z1], [inn[i][0], inn[i][1], z1], [0, 0, 1])
  }
}

/** Dark piercings on the outer face of a balustrade ring: one panel per `pitch`. */
export function piercings(p: Part, ring: XY[], z0: number, z1: number, pitch: number, fill = 0.7, skipEnds = 0.25) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const w = edgeFrame(r[i], r[(i + 1) % r.length])
    const n = Math.floor((w.L - 2 * skipEnds) / pitch)
    if (n < 1) continue
    const pp = (w.L - 2 * skipEnds) / n
    for (let k = 0; k < n; k++) rectWin(p, w, skipEnds + pp * (k + 0.5), z0, z1, (pp * fill) / 2, 0.03)
  }
}

/** A vertical cylinder (n sides, smooth), optional top cap. */
export function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 16, top = true, phase = 0) {
  for (let i = 0; i < n; i++) {
    const a0 = phase + (2 * Math.PI * i) / n, a1 = phase + (2 * Math.PI * (i + 1)) / n
    const A: V3 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0], B: V3 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0]
    const na: V3 = [Math.cos(a0), Math.sin(a0), 0], nb: V3 = [Math.cos(a1), Math.sin(a1), 0]
    p.tri(A, B, [B[0], B[1], z1], undefined, undefined, undefined, [na, nb, nb])
    p.tri(A, [B[0], B[1], z1], [A[0], A[1], z1], undefined, undefined, undefined, [na, nb, na])
    if (top) p.tri([cx, cy, z1], [A[0], A[1], z1], [B[0], B[1], z1])
  }
}

/** A surface of revolution from a profile of [radius, z] pairs (bottom to top), smooth-shaded. */
export function dome(p: Part, cx: number, cy: number, prof: [number, number][], n = 16, phase = 0) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const sl = Math.atan2(r0 - r1, z1 - z0)
    for (let i = 0; i < n; i++) {
      const a0 = phase + (2 * Math.PI * i) / n, a1 = phase + (2 * Math.PI * (i + 1)) / n
      const N = (a: number): V3 => [Math.cos(a) * Math.cos(sl), Math.sin(a) * Math.cos(sl), Math.sin(sl)]
      const P = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      if (r1 < 1e-4) { p.tri(P(r0, z0, a0), P(r0, z0, a1), P(0, z1, 0), undefined, undefined, undefined, [N(a0), N(a1), [0, 0, 1]]); continue }
      p.tri(P(r0, z0, a0), P(r0, z0, a1), P(r1, z1, a1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      p.tri(P(r0, z0, a0), P(r1, z1, a1), P(r1, z1, a0), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
}

/**
 * A pitched roof over the rectangle x0…x1, y0…y1 (eaves at z, overhang o),
 * ridge along the longer axis (or `along`), rising `rise`. Each end is a hip
 * or a gable; gable triangles go to `gable` (the wall), the soffit to `soffit`.
 */
export function hipRoof(roof: Part, gable: Part | null, soffit: Part | null, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, o: number, ends: ['hip' | 'gable', 'hip' | 'gable'] = ['hip', 'hip'], along?: 'x' | 'y') {
  const ax = along ?? (x1 - x0 >= y1 - y0 ? 'x' : 'y')
  // Work in (u along the ridge, v across); map back to x, y.
  const [u0, u1, v0, v1] = ax === 'x' ? [x0 - o, x1 + o, y0 - o, y1 + o] : [y0 - o, y1 + o, x0 - o, x1 + o]
  const M = (u: number, v: number, zz: number): V3 => (ax === 'x' ? [u, v, zz] : [v, u, zz])
  const hw = (v1 - v0) / 2, vc = (v0 + v1) / 2, zr = z + rise
  const ra = ends[0] === 'hip' ? u0 + hw : u0, rb = ends[1] === 'hip' ? u1 - hw : u1
  const R0 = M(ra, vc, zr), R1 = M(rb, vc, zr)
  const A = M(u0, v0, z), B = M(u1, v0, z), C = M(u1, v1, z), D = M(u0, v1, z)
  const dir = (du: number, dv: number): V3 => (ax === 'x' ? [du, dv, 1] : [dv, du, 1])
  quadF(roof, A, B, R1, R0, dir(0, -1))
  quadF(roof, C, D, R0, R1, dir(0, 1))
  if (ends[0] === 'hip') triN(roof, D, A, R0, dir(-1, 0))
  else if (gable) triN(gable, D, A, R0, ax === 'x' ? [-1, 0, 0] : [0, -1, 0])
  if (ends[1] === 'hip') triN(roof, B, C, R1, dir(1, 0))
  else if (gable) triN(gable, B, C, R1, ax === 'x' ? [1, 0, 0] : [0, 1, 0])
  if (soffit) quadF(soffit, A, B, C, D, [0, 0, -1])
  // gable ends also get the underside of the roof slope's thickness hidden by the soffit
  return { R0, R1, zr }
}

/** A round column with base and capital blocks. */
export function column(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 8, cap = 0.18) {
  box(p, cx - r * 1.35, cy - r * 1.35, cx + r * 1.35, cy + r * 1.35, z0, z0 + cap)
  cyl(p, cx, cy, r, z0 + cap, z1 - cap, n, false, Math.PI / n)
  box(p, cx - r * 1.4, cy - r * 1.4, cx + r * 1.4, cy + r * 1.4, z1 - cap, z1)
}

// ===========================================================================
// Litchfield Villa
// ===========================================================================

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), stucco = new Part(), door = new Part()
  const FRONT = 1.3 // park-front ground over y 0 (lidar)
  const EAVE = 11.4, CORN = 12.1, RIDGE = 15.1

  // ---- Main block: brick, two tall storeys, with the chamfered rear bay.
  const MX0 = -11.8, MX1 = 2.45, MY0 = -10.0, MY1 = 17.4
  const main: XY[] = [[MX0, MY0], [1.95, MY0], [1.95, -2.44], [2.85, -2.44], [4.28, -0.53], [4.28, 4.46], [MX1, 5.73], [MX1, MY1], [MX0, MY1]]
  prism({ wall: brick, win: null, roof: null, ring: main, z0: 0, z1: EAVE, facade: null, bevel: 0.2 })
  cornice(trim, main, EAVE, CORN, 0.45, null)
  capPoly(roof, [[1.95, -2.44], [2.85, -2.44], [4.28, -0.53], [4.28, 4.46], [MX1, 5.73], [1.95, 5.73]], CORN)
  // Low pitched metal roof: a pediment over the south end, a hip to the north.
  hipRoof(roof, brick, trim, MX0, MY0, 1.95, MY1, CORN, RIDGE - CORN, 0.45, ['gable', 'hip'], 'y')
  // Pediment frame: a raking cornice band under the gable's slopes.
  {
    const o = 0.45, y = MY0 - o - 0.02, xa = MX0 - o, xb = 1.95 + o, xm = (xa + xb) / 2
    const g = wallFrame([xb, y], [-1, 0])
    for (const [s0, s1] of [[0, (xb - xa) / 2], [(xb - xa) / 2, xb - xa]]) {
      const z0 = s0 === 0 ? CORN : RIDGE, z1 = s0 === 0 ? RIDGE : CORN
      quadF(trim, g.at(s0, z0 - 0.35, 0.05), g.at(s1, z1 - 0.35, 0.05), g.at(s1, z1, 0.05), g.at(s0, z0, 0.05), g.n)
    }
    void xm
  }

  // Windows on the main block: paired round-headed windows per bay, two storeys.
  const bays = (a: XY, b: XY, pitch: number, skip: (s: number) => boolean = () => false, z0 = FRONT) => {
    const w = edgeFrame(a, b), n = Math.max(1, Math.round(w.L / pitch))
    for (let k = 0; k < n; k++) {
      const s = (w.L / n) * (k + 0.5)
      if (skip(s)) continue
      archWin(win, w, s, z0 + 1.2, z0 + 4.2, 0.55)
      archWin(win, w, s, 6.6, 9.7, 0.55)
    }
  }
  // west face of the north wing between the turret and the square tower
  bays([MX0, MY1], [MX0, MY0], 3.0, (s) => s < 2.2 || (s > 6.9 && s < 13.2) || s > 19.4)
  // south (pediment) face over the colonnade, a triple window in the pediment storey
  {
    const w = edgeFrame([MX0, MY0], [1.95, MY0]) // runs west → east, faces south
    for (const s of [2.4, 5.0, 9.2, 11.8]) { archWin(win, w, s, 1.6, 5.4, 0.6); archWin(win, w, s, 6.6, 9.8, 0.5) }
    for (const s of [6.35, 7.1, 7.85]) archWin(win, w, s + 0.0, 6.6, 9.8, 0.3)
  }
  bays([MX1, 5.73], [MX1, MY1], 2.9, (s) => s > 9.6) // east
  bays([4.28, -0.53], [4.28, 4.46], 5.0) // rear bay
  bays([1.95, MY0], [1.95, -2.44], 2.6) // south-east
  {
    const w = edgeFrame([MX1, MY1], [MX0, MY1]) // north face
    for (const s of [3.2, 12.6]) { archWin(win, w, s, 1.6, 4.6, 0.55); archWin(win, w, s, 6.6, 9.7, 0.55) }
  }

  // ---- Square tower (lidar x −14.5…−8.0, y 4.3…10.1; balustrade 21.0).
  const T: XY[] = chamferRect(-14.2, 4.6, -8.6, 9.8, 0)
  prism({ wall: brick, win: null, roof: null, ring: T, z0: 0, z1: 19.2, facade: null, bevel: 0.2 })
  cornice(trim, T, 19.2, 19.95, 0.55, roof)
  parapet(trim, outset(T, 0.3), 19.95, 21.0, 0.3)
  piercings(roof, outset(T, 0.3), 20.2, 20.75, 0.9, 0.62, 0.7)
  for (const [x, y] of T) box(trim, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 19.95, 21.1)
  {
    const fw = edgeFrame([-14.2, 9.8], [-14.2, 4.6]) // park face
    for (const s of [1.6, 2.6, 3.6]) archWin(win, fw, s, 16.3, 18.4, 0.34)
    archWin(win, fw, 2.6, 11.8, 13.8, 0.4)
    archWin(win, fw, 2.6, 7.0, 9.1, 0.4)
    // the door: an arched stone surround, the leaves and a fanlight
    wallBox(trim, fw, 1.3, 3.9, FRONT, FRONT + 0.25, 0.6) // top step
    archWin(trim, fw, 2.6, FRONT + 0.25, 5.3, 1.2, 0.08)
    archWin(door, fw, 2.6, FRONT + 0.25, 4.7, 0.78, 0.12)
    archWin(win, fw, 2.6, 3.95, 4.7, 0.78, 0.13)
    wallBox(trim, fw, 2.45, 2.75, 5.15, 5.55, 0.15) // keystone
    for (const [a, b] of [[[-8.6, 4.6], [-8.6, 9.8]], [[-8.6, 9.8], [-14.2, 9.8]], [[-14.2, 4.6], [-8.6, 4.6]]] as [XY, XY][]) {
      const w = edgeFrame(a, b)
      for (const s of [w.L / 2 - 1.0, w.L / 2, w.L / 2 + 1.0]) archWin(win, w, s, 16.3, 18.4, 0.34)
    }
    const nw = edgeFrame([-8.6, 9.8], [-14.2, 9.8])
    archWin(win, nw, 4.0, 6.6, 9.4, 0.45)
  }

  // ---- Octagonal tower with its bow window and balconies (roof 16.0, balustrade 17.0).
  const OX0 = -15.0, OX1 = -7.2, OY0 = -2.4, OY1 = 4.6, CH = 1.5
  const O: XY[] = [[OX0 + CH, OY0], [OX1, OY0], [OX1, OY1], [OX0 + CH, OY1], [OX0, OY1 - CH], [OX0, OY0 + CH]]
  prism({ wall: brick, win: null, roof: null, ring: O, z0: 0, z1: 14.8, facade: null, bevel: 0.15 })
  cornice(trim, O, 14.8, 15.95, 0.6, roof)
  parapet(trim, outset(O, 0.3), 15.95, 17.0, 0.3)
  piercings(roof, outset(O, 0.3), 16.2, 16.75, 0.9, 0.62, 0.6)
  {
    const oc = (OY0 + OY1) / 2
    const front = edgeFrame([OX0, OY1 - CH], [OX0, OY0 + CH]) // faces west; s from north
    const sc = front.L / 2
    // paired round-headed windows, second and third floors
    for (const ds of [-0.75, 0.75]) { archWin(win, front, sc + ds, 7.5, 9.6, 0.42); archWin(win, front, sc + ds, 12.6, 14.2, 0.4) }
    // third-floor balcony on brackets
    wallBox(trim, front, sc - 1.6, sc + 1.6, 11.2, 11.5, 0.75)
    wallBox(trim, front, sc - 1.6, sc + 1.6, 11.5, 12.3, 0.12, false)
    for (const ds of [-1.5, 1.5]) wallBox(trim, front, sc + ds - 0.1, sc + ds + 0.1, 11.5, 12.3, 0.75, false)
    wallBox(trim, front, sc - 1.6, sc + 1.6, 12.2, 12.35, 0.78)
    // the bow window: a half drum of pale stone and glass, with a balcony on top
    const R = 1.5, cx = OX0, cy = oc
    const segs = 8
    for (let k = 0; k < segs; k++) {
      const a0 = Math.PI / 2 + (Math.PI * k) / segs, a1 = Math.PI / 2 + (Math.PI * (k + 1)) / segs
      const P = (a: number, z: number, r = R): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
      trim.tri(P(a0, 0), P(a1, 0), P(a1, 6.1), undefined, undefined, undefined, [n0, n1, n1])
      trim.tri(P(a0, 0), P(a1, 6.1), P(a0, 6.1), undefined, undefined, undefined, [n0, n1, n0])
      const am = (a0 + a1) / 2, dd = 0.04
      const g = (a: number, z: number): V3 => P(a, z, R + dd)
      const ia0 = a0 + 0.06, ia1 = a1 - 0.06
      quadF(win, g(ia0, FRONT + 1.1), g(ia1, FRONT + 1.1), g(ia1, 5.5), g(ia0, 5.5), [Math.cos(am), Math.sin(am), 0])
    }
    dome(trim, cx, cy, [[R + 0.35, 6.1], [R + 0.35, 6.45], [0, 6.45]], 16)
    // balcony rail on the bow
    for (let k = 0; k < segs; k++) {
      const a0 = Math.PI / 2 + (Math.PI * k) / segs, a1 = Math.PI / 2 + (Math.PI * (k + 1)) / segs
      const P = (a: number, z: number, r: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const am = (a0 + a1) / 2, n: V3 = [Math.cos(am), Math.sin(am), 0]
      quadF(trim, P(a0, 6.45, R + 0.25), P(a1, 6.45, R + 0.25), P(a1, 7.3, R + 0.25), P(a0, 7.3, R + 0.25), n)
      quadF(trim, P(a0, 6.45, R + 0.05), P(a1, 6.45, R + 0.05), P(a1, 7.3, R + 0.05), P(a0, 7.3, R + 0.05), [-n[0], -n[1], 0])
      quadF(trim, P(a0, 7.3, R + 0.05), P(a1, 7.3, R + 0.05), P(a1, 7.3, R + 0.25), P(a0, 7.3, R + 0.25), [0, 0, 1])
    }
    // chamfered faces and the north and south sides: single round-headed windows
    for (const [a, b] of [[O[3], O[4]], [O[5], O[0]]] as [XY, XY][]) {
      const w = edgeFrame(a, b)
      for (const [z0, z1] of [[FRONT + 1.2, 5.3], [7.5, 9.6], [12.6, 14.2]]) archWin(win, w, w.L / 2, z0, z1, 0.4)
    }
    const sw = edgeFrame(O[0], O[1])
    for (const s of [2.4, 5.0]) for (const [z0, z1] of [[7.5, 9.6], [12.6, 14.2]]) archWin(win, sw, s, z0, z1, 0.42)
  }

  // ---- Round turrets at the NW and NE corners (lidar tops 15.1).
  const turret = (cx: number, cy: number, angles: number[]) => {
    const r = 2.1
    cyl(brick, cx, cy, r, 0, 12.4, 16, false)
    dome(trim, cx, cy, [[r, 12.4], [r + 0.3, 12.55], [r + 0.3, 13.0], [r - 0.1, 13.0]], 16)
    dome(roof, cx, cy, [[r + 0.1, 13.0], [r - 0.3, 13.5], [1.1, 14.05], [0.4, 14.4], [0, 14.5]], 16)
    cyl(trim, cx, cy, 0.12, 14.5, 14.95, 6)
    dome(trim, cx, cy, [[0.01, 14.9], [0.22, 15.0], [0.01, 15.2]], 6)
    for (const a of angles) {
      const w = wallFrame([cx + r * Math.cos(a), cy + r * Math.sin(a)], [-Math.sin(a), Math.cos(a)])
      for (const [z0, z1] of [[FRONT + 1.4, 4.6], [6.5, 8.6], [10.0, 11.8]]) archWin(win, w, 0, z0, z1, 0.4, 0.09)
    }
  }
  turret(-12.0, 17.0, [Math.PI * 0.6, Math.PI * 1.05])
  turret(2.4, 17.0, [Math.PI * 0.4, 0])

  // ---- North bay (OSM), two storeys with a flat roof.
  const NB: XY[] = [[-8.32, 17.0], [-1.08, 17.0], [-1.09, 20.98], [-2.56, 20.97], [-3.85, 22.18], [-5.72, 22.17], [-6.45, 20.95], [-8.32, 20.95]]
  prism({ wall: brick, win: null, roof: null, ring: NB, z0: 0, z1: 10.0, facade: null, bevel: 0.15 })
  cornice(trim, NB, 10.0, 10.6, 0.35, roof)
  {
    const w = edgeFrame(NB[4], NB[5])
    for (const [z0, z1] of [[1.6, 4.8], [6.4, 9.2]]) archWin(win, w, w.L / 2, z0, z1, 0.5)
    for (const k of [2, 5]) {
      const v = edgeFrame(NB[k], NB[k + 1])
      archWin(win, v, v.L / 2, 6.6, 9.2, 0.38)
    }
  }

  // ---- The veranda: an enclosed pale porch along the south part of the park
  // front and an open colonnade along the south face, flat roof, balustrade.
  const VZ = 5.6, VTOP = 6.6
  const L: XY[] = [[-12.95, -12.48], [1.95, -12.48], [1.95, MY0], [MX0, MY0], [MX0, -2.6], [-12.95, -2.6]]
  prism({ wall: trim, win: null, roof: trim, ring: L, z0: 0, z1: FRONT, facade: null, bevel: 0.1 })
  box(stucco, -12.95, MY0, MX0, -2.6, FRONT, VZ)
  {
    const w = edgeFrame([-12.95, -2.6], [-12.95, MY0])
    for (const s of [1.5, 3.7, 5.9]) rectWin(win, w, s, FRONT + 0.7, VZ - 0.6, 0.55)
  }
  prism({ wall: stucco, win: null, roof: null, ring: L, z0: VZ, z1: VTOP, facade: null, bevel: 0.1 })
  capPoly(stucco, L, VZ, false)
  capPoly(roof, L, VTOP - 0.02)
  parapet(trim, L, VTOP, 7.3, 0.25)
  piercings(roof, L, 6.75, 7.1, 0.8, 0.6, 0.4)
  for (const x of [-12.5, -10.1, -7.7, -5.3, -2.9, -0.5, 1.6]) column(trim, x, -12.13, 0.27, FRONT, VZ)
  column(trim, -12.6, -10.4, 0.27, FRONT, VZ)

  // ---- 1913 annex and its link (lidar 10.5–12 m; ground ~2.2 m up).
  const AG = 2.2
  prism({ wall: stucco, win: null, roof: roof, ring: chamferRect(8.89, -16.4, 26.43, -7.65, 0), z0: 0, z1: 10.6, facade: null, bevel: 0.2 })
  cornice(trim, chamferRect(8.89, -16.4, 26.43, -7.65, 0), 10.6, 11.2, 0.3, roof)
  prism({ wall: stucco, win: null, roof: roof, ring: chamferRect(1.6, -12.42, 9.0, -8.98, 0), z0: 0, z1: 9.6, facade: null, bevel: 0.1 })
  for (const [a, b, pitch] of [[[8.89, -16.4], [26.43, -16.4], 2.9], [[26.43, -7.65], [8.89, -7.65], 2.9], [[26.43, -16.4], [26.43, -7.65], 2.9], [[1.6, -12.42], [8.89, -12.42], 2.4]] as [XY, XY, number][]) {
    const w = edgeFrame(a, b), n = Math.round(w.L / pitch)
    for (let k = 0; k < n; k++) {
      const s = (w.L / n) * (k + 0.5)
      rectWin(win, w, s, AG + 1.0, AG + 3.4, 0.6)
      rectWin(win, w, s, AG + 4.7, AG + 7.0, 0.6)
    }
  }

  // ---- Small lanterns on the main roof (photo; lidar bumps).
  for (const [x, y, r] of [[-5.2, 14.0, 0.65], [-5.2, 11.0, 0.65], [-4.9, -4.0, 0.85]] as [number, number, number][]) {
    cyl(roof, x, y, r, 13.8, 15.5, 8, false, Math.PI / 8)
    for (let k = 0; k < 4; k++) {
      const a = (Math.PI / 2) * k + Math.PI / 4
      const w = wallFrame([x + r * 0.92 * Math.cos(a), y + r * 0.92 * Math.sin(a)], [-Math.sin(a), Math.cos(a)])
      rectWin(win, w, 0, 14.6, 15.3, 0.2, 0.06)
    }
    dome(trim, x, y, [[r + 0.15, 15.5], [r + 0.15, 15.7], [0, 15.7]], 8, Math.PI / 8)
    dome(roof, x, y, [[r + 0.05, 15.7], [r * 0.7, 16.2], [0, 16.45]], 8, Math.PI / 8)
  }

  finishModel('Litchfield Villa', 'nyc-litchfield-villa', [
    { part: brick, material: finish('litchfield-brick', 0xb26c55) },
    { part: trim, material: PALETTE.trim },
    { part: stucco, material: finish('stucco', 0xe8dfcf) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('door-oak', 0x8a6a52) },
  ], { bearing: 33.2, osm: 'way/241846599', height: 21.1 }, 6500)
}

if (import.meta.main) build()
