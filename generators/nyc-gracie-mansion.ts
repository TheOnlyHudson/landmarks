/**
 * Gracie Mansion (1799, Archibald Gracie; Susan E. Wagner Wing 1966),
 * Carl Schurz Park, Manhattan: procedural, CC0-1.0.
 * bun generators/nyc-gracie-mansion.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 338.3. The
 * house is set square to the East River bank, not to the Manhattan grid:
 * model +x (compass 68.3) is the entrance front with its full-width veranda,
 * facing the lawn; model -x is the back, where the glazed link and the
 * Wagner Wing run off toward East End Avenue. Bearing from OSM way/284868519's
 * long edges (68.3 / 158.3 degrees).
 * Origin: the Nominatim centre of OSM way/284868519 (-73.9430787, 40.7760949).
 * y = 0 is the lawn; the site is flat to within a metre (lidar ground
 * 8.6 to 10.0 m around the house, front lawn 9.1 m).
 *
 * Form: a two-storey Federal frame house, six bays by four, in pale yellow
 * clapboard with dark green-grey shutters and white trim, under a low hipped
 * roof with a flat deck, four red-brick chimneys, and a Chinese Chippendale
 * lattice balustrade right round the eaves. A one-storey veranda on round
 * columns wraps the front and both ends, on a raised basement with a
 * lattice skirt; its flat roof is a balcony with a second lattice
 * balustrade. On the north-west end a small pedimented two-storey bay. At
 * the back a one-storey glazed link (lattice balustrade on its roof) and an
 * entrance portico join the Wagner Wing: two storeys, gabled, a pediment
 * facing south-east, hipped at the north-west end.
 *
 * Sources
 * - OSM way/284868519 (outline, building=yes, height 12.6, ref:nrhp 75001205).
 *   The outline is the house, veranda, link and wing as one way; there are
 *   no building:parts.
 * - USGS 3DEP lidar NY_NewYorkCity (2017 flight), read in the house's own
 *   axes, heights above the front lawn (all measured):
 *     main body x 1.2..16.2, y -12.0..7.6; eaves 9.8 (cornice and
 *     balustrade read 10.4..10.8); flat roof deck 12.2..12.8 over
 *     x 5..12.5, y -8..2.5; chimneys 14.4 at (4.2,-5.6), (4.4,0.9),
 *     (11.3,0.9), (13.2,-5.6);
 *     veranda balcony 5.9..6.1 (the balustrade top) along the front to
 *     x 19.9, along the south-east end to y -15.5 (from x 4.4 in the lidar,
 *     under trees further back; the snow photo shows it reaching the back
 *     corner, which the model follows), along the
 *     north-west end to y 10.9 from x 11.9;
 *     pedimented bay x 4.5..11.8, y 7.6..11.4, eaves 9.4, ridge 11.1;
 *     link x -4.0..1.2, roof balustrade 5.9;
 *     Wagner Wing x -19.4..-4.0, y -4.6..11.2 (OSM), eaves 7.6, ridge 10.5
 *     on x -11.7, falling to 7.8 at the north-west end (a hip). A 14 m
 *     spike near (-8, 2) may be a wing chimney or a tree; no photo shows the
 *     wing's roof, so none is modelled.
 * - USGS NAIP (public domain): plan, grey roof, white balustrades.
 * - HABS NY-461 (Library of Congress, public domain, on Wikimedia Commons):
 *   "North front", "General view from northeast", "East side", "West side",
 *   "Southeast corner", "Looking along north (front) porch from east"
 *   (c. 1981): the bays, the veranda columns and skirt, the lattice
 *   balustrades, the pedimented bay, the link portico and the wing's
 *   pediment. HABS names the front "north" and the river end "east".
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Carol M. Highsmith, "Gracie Mansion is the official residence of the
 *     mayor of the City of New York, New York LCCN2011632135.tif", public
 *     domain (the front: six bays at about 3.2 m with the door between the third
 *     and fourth, the wide centre bay of the veranda, chimneys, roof);
 *   Jim.henderson, "Gracie Mansion snow jeh.jpg", CC0 (geotagged south of
 *     the back corner: the back face's four bays, the glazed link, the
 *     south-east veranda; colours);
 *   Jim.henderson, "Gracie East front summer jeh.jpg", CC0;
 *   Karen Apricot, "Gracie Mansion (3570483716).jpg" and
 *     "Gracie Mansion (3570483518).jpg", CC BY-SA 2.0 (front veranda,
 *     steps, door, lattice skirt; the 60 m tower to the north-west behind
 *     the front's right end fixes which face is the front);
 *   Shinya Suzuki, "Gracie Mansion (4572240397).jpg", CC BY 2.0 (roof
 *     balustrade and chimney);
 *   Karl Palutke, "Gracie Mansion (4906895387).jpg", CC BY-SA 2.0;
 *   Dmadeo, "Gracie-mansion-2007.jpg", CC BY-SA 3.0;
 *   Rhododendrites, "Police outside Gracie Mansion (74983).jpg", CC BY-SA 4.0.
 * Published: built 1799 for Archibald Gracie, enlarged c. 1810; the mayor's
 *   residence since 1942; Wagner Wing 1966 (Mott B. Schmidt); NRHP 1975.
 * Estimated from photos: storey heights, window sizes and shutters, the
 *   veranda floor (1.3 m, seven risers), column spacing (the front's centre
 *   bay is wide, the rest even), the balustrade panel rhythm, the wing's
 *   windows, the link's French doors and the portico.
 * Simplified: the lattice is drawn as one X per panel between posts and
 *   rails; the veranda's lower railing as a solid white band; the wing's
 *   detail (it is barely photographed, mostly behind trees) as plain bays.
 * Doubts: the portico at the link is from HABS (c. 1981) only; the wing's
 *   south-east pediment is from the HABS photo, while the lidar there is
 *   under trees. The front door is painted ochre; it is drawn in the
 *   shutter colour to stay within six materials.
 * Colour: pale yellow clapboard (snow and summer photos), pulled to the
 *   palette's lightness; white trim, columns and balustrades; grey metal
 *   roof; red-brick chimneys; green-grey shutters and lattice skirt.
 * Night: windows and the fanlight glow; the house is otherwise unlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
/** A square-section bar from a to b, sides only. */
function bar(part: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let e1: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
  const l1 = Math.hypot(...e1)
  e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1]
  const e2: V3 = [t[1] * e1[2] - t[2] * e1[1], t[2] * e1[0] - t[0] * e1[2], t[0] * e1[1] - t[1] * e1[0]]
  const h = w / 2
  const off = (p: V3, s1: number, s2: number): V3 => [p[0] + (e1[0] * s1 + e2[0] * s2) * h, p[1] + (e1[1] * s1 + e2[1] * s2) * h, p[2] + (e1[2] * s1 + e2[2] * s2) * h]
  const cs: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let k = 0; k < 4; k++) {
    const [p1, p2] = cs[k], [q1, q2] = cs[(k + 1) % 4]
    const want: V3 = [(e1[0] * (p1 + q1) + e2[0] * (p2 + q2)), (e1[1] * (p1 + q1) + e2[1] * (p2 + q2)), (e1[2] * (p1 + q1) + e2[2] * (p2 + q2))]
    qf(part, off(a, p1, p2), off(b, p1, p2), off(b, q1, q2), off(a, q1, q2), want)
  }
}
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
/** Face coordinate s of a world coordinate along the face. */
const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** A hipped roof from the eaves at z0 to a flat deck at z1 inset by ix, iy. */
function hip(roof: Part, deck: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ix: number, iy: number) {
  const o: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const i: V3[] = [[x0 + ix, y0 + iy, z1], [x1 - ix, y0 + iy, z1], [x1 - ix, y1 - iy, z1], [x0 + ix, y1 - iy, z1]]
  const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let k = 0; k < 4; k++) qf(roof, o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k], out[k])
  if (deck) deck.cap(i, true)
}

/**
 * A Chinese Chippendale balustrade along a path of (x, y) points at base z:
 * posts at the corners and between panels, top and bottom rails, an X in
 * each panel.
 */
function lattice(part: Part, path: XY[], z: number, h: number, panel = 2.1) {
  const W = 0.09, P = 0.15
  for (let k = 0; k < path.length - 1; k++) {
    const [ax, ay] = path[k], [bx, by] = path[k + 1]
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / panel))
    const at = (t: number, zz: number): V3 => [ax + (bx - ax) * t, ay + (by - ay) * t, zz]
    bar(part, at(0, z + h - 0.05), at(1, z + h - 0.05), W + 0.02)
    bar(part, at(0, z + 0.12), at(1, z + 0.12), W)
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n
      bar(part, at(t0, z + 0.12), at(t1, z + h - 0.05), W * 0.8)
      bar(part, at(t1, z + 0.12), at(t0, z + h - 0.05), W * 0.8)
      if (i > 0) bar(part, at(t0, z), at(t0, z + h + 0.08), P)
    }
  }
  for (const [x, y] of path) bar(part, [x, y, z], [x, y, z + h + 0.14], P + 0.03)
}

// ---------------------------------------------------------------- the model

// Main body (lidar)
const BX0 = 1.2, BX1 = 16.2, BY0 = -12.0, BY1 = 7.6, BYC = (BY0 + BY1) / 2
const CORN0 = 9.3, EAVE = 9.8, DECK = 12.5, OH = 0.35
// Veranda
const VX = 19.9, VY0 = -15.5, VY1 = 10.9, VSE = BX0, VNW = 11.9
const FLOOR = 1.3, VCEIL = 4.5, VTOP = 4.9
// Windows (sill, head)
const L1: [number, number] = [1.7, 3.9]
const L2: [number, number] = [5.8, 8.2]
// Pedimented bay
const PX0 = 4.5, PX1 = 11.8, PY1 = 11.4, PEAVE = 9.4, PRIDGE = 11.1
// Link and Wagner Wing
const KX0 = -4.0, KX1 = BX0, KY0 = -3.8, KY1 = 10.6, KTOP = 4.7
const WX0 = -19.4, WX1 = KX0, WY0 = -4.6, WY1 = 11.2, WEAVE = 7.6, WRIDGE = 10.5

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), brick = new Part(), shut = new Part()

  /** A sash window with its white surround and a shutter either side. */
  const sash = (f: Face, s: number, z: [number, number], w = 1.0, shutters = true) => {
    flatShape(trim, f, R(s - w / 2 - 0.12, z[0] - 0.12, s + w / 2 + 0.12, z[1] + 0.15), 0.03)
    flatShape(win, f, R(s - w / 2, z[0], s + w / 2, z[1]), 0.06)
    if (!shutters) return
    const sw = w * 0.46
    flatShape(shut, f, R(s - w / 2 - 0.12 - sw, z[0], s - w / 2 - 0.12, z[1]), 0.05)
    flatShape(shut, f, R(s + w / 2 + 0.12, z[0], s + w / 2 + 0.12 + sw, z[1]), 0.05)
  }
  const along = (f: Face, ws: number[], z: [number, number], w = 1.0, sh = true) => ws.forEach((w0) => sash(f, sOf(f, w0), z, w, sh))
  /** White corner boards on a rectangle's corners. */
  const corners = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => {
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) box(trim, null, x - 0.12, y - 0.12, x + 0.12, y + 0.12, z0, z1)
  }

  // ---- the main body: walls, cornice, hipped roof with deck, eaves balustrade
  box(wall, null, BX0, BY0, BX1, BY1, 0, CORN0, 0.12)
  corners(BX0, BY0, BX1, BY1, 0.3, CORN0)
  box(trim, null, BX0 - OH, BY0 - OH, BX1 + OH, BY1 + OH, CORN0, EAVE, 0.15)
  {
    const x0 = BX0 - OH, x1 = BX1 + OH, y0 = BY0 - OH, y1 = BY1 + OH
    hip(roof, roof, x0, y0, x1, y1, EAVE, DECK, 3.95, 4.3)
    const e = 0.15
    lattice(trim, [[BX0 + e, BY0 + e], [BX1 - e, BY0 + e], [BX1 - e, BY1 - e], [BX0 + e, BY1 - e], [BX0 + e, BY0 + e]], EAVE, 0.9, 2.0)
  }
  // four chimneys (lidar)
  for (const [x, y] of [[4.2, -5.6], [4.4, 0.9], [11.3, 0.9], [13.2, -5.6]] as XY[]) {
    box(brick, brick, x - 0.6, y - 0.8, x + 0.6, y + 0.8, 10.5, 14.5, 0.06)
    box(brick, brick, x - 0.7, y - 0.9, x + 0.7, y + 0.9, 14.15, 14.4, 0.04)
  }

  // ---- windows on the main body
  const fF = faceX(BX1, 1), fB = faceX(BX0, -1), fSE = faceY(BY0, -1), fNW = faceY(BY1, 1)
  // six bays at 3.2 m (Highsmith), the door between the third and fourth
  const front = [-8.0, -4.8, 4.8, 8.0].map((d) => BYC + d), inner = [-1.6, 1.6].map((d) => BYC + d)
  along(fF, [...front, ...inner], L2)
  along(fF, front, L1)
  // the front door: sidelights, a fanlight and a white surround
  {
    const s = sOf(fF, BYC)
    flatShape(trim, fF, [[s - 1.35, FLOOR], [s + 1.35, FLOOR], ...arc(s, 3.45, 1.35, 0, 180, 10).slice(1, -1)], 0.03)
    flatShape(win, fF, arc(s, 3.45, 1.05, 0, 180, 10), 0.06)
    flatShape(shut, fF, R(s - 0.55, FLOOR, s + 0.55, 3.4), 0.06)
    flatShape(win, fF, R(s - 1.05, FLOOR + 0.5, s - 0.75, 3.4), 0.06)
    flatShape(win, fF, R(s + 0.75, FLOOR + 0.5, s + 1.05, 3.4), 0.06)
  }
  const sideX = [3.45, 6.95, 10.45, 13.95]
  along(fSE, sideX, L1)
  along(fSE, sideX, L2)
  // the back: four narrow bays south of the link, three above it
  along(fB, [-11.0, -9.0, -7.0, -5.0], L1, 0.85)
  along(fB, [-11.0, -9.0, -7.0, -5.0], L2, 0.85)
  along(fB, [-1.5, 2.0, 5.5], L2, 0.85)
  // the north-west end: a bay either side of the pedimented bay
  along(fNW, [2.85, 14.0], L1, 0.85)
  along(fNW, [2.85, 14.0], L2, 0.85)

  // ---- the pedimented bay on the north-west end
  {
    const xm = (PX0 + PX1) / 2
    box(wall, null, PX0, BY1 - 0.2, PX1, PY1, 0, PEAVE - 0.4, 0.1)
    corners(PX0, BY1, PX1, PY1, 0.3, PEAVE - 0.4)
    box(trim, null, PX0 - 0.25, BY1 - 0.2, PX1 + 0.25, PY1 + 0.25, PEAVE - 0.4, PEAVE, 0.08)
    // gable roof, ridge along y, running back into the main roof
    const yb = 5.8, yf = PY1 + 0.3
    const l0: V3 = [PX0 - 0.3, yb, PEAVE], l1: V3 = [PX0 - 0.3, yf, PEAVE], r0: V3 = [PX1 + 0.3, yb, PEAVE], r1: V3 = [PX1 + 0.3, yf, PEAVE]
    const k0: V3 = [xm, yb, PRIDGE], k1: V3 = [xm, yf, PRIDGE]
    qf(roof, l0, l1, k1, k0, [-1, 0, 2])
    qf(roof, r0, r1, k1, k0, [1, 0, 2])
    // the pediment: tympanum, raking cornice, a lunette
    const f = faceY(PY1, 1), s0 = sOf(f, PX1), s1 = sOf(f, PX0), sm = sOf(f, xm)
    flatShape(wall, f, [[s0, PEAVE], [s1, PEAVE], [sm, PRIDGE]], 0)
    extrudeShape(trim, f, [[s0 - 0.3, PEAVE], [sm, PRIDGE + 0.08], [s1 + 0.3, PEAVE], [s1 - 0.35, PEAVE], [sm, PRIDGE - 0.35], [s0 + 0.35, PEAVE]], 0, 0.25)
    flatShape(win, f, arc(sm, PEAVE + 0.1, 0.55, 0, 180, 6), 0.04)
    sash(f, sm, L1)
    sash(f, sm, L2)
    sash(faceX(PX0, -1), sOf(faceX(PX0, -1), 9.5), L2, 0.85)
    sash(faceX(PX1, 1), sOf(faceX(PX1, 1), 9.5), L2, 0.85)
  }

  // ---- the veranda: skirt, floor, columns, railing, roof, balcony balustrade
  {
    // the deck: three slabs
    const slabs: [number, number, number, number][] = [[VSE, VY0, BX1, BY0], [BX1, VY0, VX, VY1], [VNW, BY1, BX1, VY1]]
    for (const [x0, y0, x1, y1] of slabs) {
      box(shut, null, x0, y0, x1, y1, 0, FLOOR - 0.2) // lattice skirt
      box(trim, roof, x0, y0, x1, y1, FLOOR - 0.2, FLOOR) // floor edge
      box(trim, null, x0, y0, x1, y1, VCEIL, VTOP - 0.1, 0) // fascia and ceiling
      box(trim, roof, x0, y0, x1, y1, VTOP - 0.1, VTOP)
    }
    // the slabs' undersides (ceiling) read white
    for (const [x0, y0, x1, y1] of slabs) trim.cap([[x0, y0, VCEIL], [x1, y0, VCEIL], [x1, y1, VCEIL], [x0, y1, VCEIL]], false)
    // columns and the piers under them: the front's centre bay is wide, over the steps
    const cols: XY[] = []
    for (const y of [-15.2, -12.1, -9.0, -6.0, 1.6, 4.6, 7.6, 10.6]) cols.push([VX - 0.3, y])
    for (const x of [4.4, 7.5, 10.6, 13.6, 16.6]) cols.push([x, VY0 + 0.3])
    for (const x of [12.2, 14.8, 17.3]) cols.push([x, VY1 - 0.3])
    for (const [x, y] of cols) {
      box(brick, null, x - 0.3, y - 0.3, x + 0.3, y + 0.3, 0, FLOOR - 0.2)
      lathe(trim, x, y, [[0.22, FLOOR], [0.19, FLOOR + 0.25], [0.17, VCEIL - 0.35], [0.24, VCEIL - 0.1], [0.24, VCEIL]], 10)
    }
    // the lower railing (white pickets as a band), broken for the front steps
    const rail = (a: XY, b: XY) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
      const q = (p: XY, o: number): XY => [p[0] + nx * o, p[1] + ny * o]
      prism(trim, trim, [q(a, -0.04), q(b, -0.04), q(b, 0.04), q(a, 0.04)].map(([x, y]) => [x, y] as XY), FLOOR + 0.1, FLOOR + 0.95)
    }
    const ri = 0.25
    rail([VSE, VY0 + ri], [VX - ri, VY0 + ri])
    rail([VX - ri, VY0 + ri], [VX - ri, BYC - 1.4])
    rail([VX - ri, BYC + 1.4], [VX - ri, VY1 - ri])
    rail([VX - ri, VY1 - ri], [VNW, VY1 - ri])
    // the balcony's lattice balustrade on the veranda roof, from wall to wall
    lattice(trim, [[VSE, VY0 + 0.15], [VX - 0.15, VY0 + 0.15], [VX - 0.15, VY1 - 0.15], [VNW, VY1 - 0.15]], VTOP, 1.0, 2.2)
    // the front steps: seven risers to the lawn, in four flights of treads
    const s0 = BYC - 1.3, s1 = BYC + 1.3
    for (let k = 0; k < 4; k++) box(trim, roof, VX + k * 0.55, s0, VX + (k + 1) * 0.55, s1, 0, FLOOR - (FLOOR / 4) * k)
    for (const y of [s0 - 0.1, s1 + 0.1]) {
      bar(trim, [VX, y, FLOOR + 0.95], [VX + 2.2, y, 0.9], 0.1)
      bar(trim, [VX + 2.2, y, 0], [VX + 2.2, y, 1.15], 0.18)
    }
  }

  // ---- the link and its entrance portico
  {
    box(wall, null, KX0, KY0, KX1, KY1, 0, KTOP - 0.4)
    box(trim, roof, KX0 - 0.15, KY0 - 0.15, KX1, KY1 + 0.15, KTOP - 0.4, KTOP)
    corners(KX0, KY0, KX0, KY1, 0.3, KTOP - 0.4)
    // French doors on both long sides
    for (const f of [faceY(KY0, -1), faceY(KY1, 1)]) {
      for (const x of [-2.6, -1.1]) {
        const s = sOf(f, x)
        flatShape(trim, f, R(s - 0.6, 0.3, s + 0.6, 3.4), 0.03)
        flatShape(win, f, R(s - 0.48, 0.3, s + 0.48, 3.25), 0.06)
      }
    }
    lattice(trim, [[KX1, KY0 + 0.1], [KX0 + 0.1, KY0 + 0.1]], KTOP, 0.85, 2.0)
    lattice(trim, [[KX0 + 0.1, KY1 - 0.1], [KX1, KY1 - 0.1]], KTOP, 0.85, 2.0)
    // the portico (HABS): two columns, a flat roof with a balustrade, an arched doorway
    const py0 = KY0 - 1.8, px0 = -0.4, px1 = 1.1
    const f = faceY(KY0, -1)
    for (const x of [px0, px1]) lathe(trim, x, py0 + 0.25, [[0.18, 0], [0.15, 0.2], [0.14, 3.2], [0.2, 3.45], [0.2, 3.5]], 8)
    box(trim, roof, px0 - 0.35, py0, px1 + 0.35, KY0, 3.5, 3.85)
    lattice(trim, [[px0 - 0.25, KY0], [px0 - 0.25, py0 + 0.1], [px1 + 0.25, py0 + 0.1], [px1 + 0.25, KY0]], 3.85, 0.7, 1.3)
    const sd = sOf(f, (px0 + px1) / 2)
    flatShape(win, f, arc(sd, 2.5, 0.55, 0, 180, 6), 0.06)
    flatShape(shut, f, R(sd - 0.55, 0, sd + 0.55, 2.5), 0.06)
  }

  // ---- the Wagner Wing: two storeys, gabled, pediment to the south-east, hipped to the north-west
  {
    const xm = (WX0 + WX1) / 2, o = 0.3
    box(wall, null, WX0, WY0, WX1, WY1, 0, WEAVE - 0.35, 0.12)
    corners(WX0, WY0, WX1, WY1, 0.3, WEAVE - 0.35)
    // eaves cornice on the long sides and the hipped end
    box(trim, null, WX0 - 0.2, WY0, WX1 + 0.2, WY1 + 0.2, WEAVE - 0.35, WEAVE, 0.08)
    const a: V3 = [WX0 - o, WY0 - o, WEAVE], b: V3 = [WX1 + o, WY0 - o, WEAVE], c: V3 = [WX1 + o, WY1 + o, WEAVE], d: V3 = [WX0 - o, WY1 + o, WEAVE]
    const k0: V3 = [xm, WY0 - o, WRIDGE], k1: V3 = [xm, WY1 - 3.2, WRIDGE]
    qf(roof, a, d, k1, k0, [-1, 0, 2])
    qf(roof, b, c, k1, k0, [1, 0, 2])
    tf(roof, d, c, k1, [0, 1, 2])
    // the south-east pediment
    const f = faceY(WY0, -1), s0 = sOf(f, WX0), s1 = sOf(f, WX1), sm = sOf(f, xm)
    flatShape(wall, f, [[s0, WEAVE - 0.35], [s1, WEAVE - 0.35], [sm, WRIDGE - 0.1]], 0)
    extrudeShape(trim, f, R(s0 - 0.2, WEAVE - 0.35, s1 + 0.2, WEAVE), 0, 0.25)
    extrudeShape(trim, f, [[s0 - 0.3, WEAVE], [sm, WRIDGE + 0.05], [s1 + 0.3, WEAVE], [s1 - 0.4, WEAVE], [sm, WRIDGE - 0.4], [s0 + 0.4, WEAVE]], 0, 0.3)
    flatShape(win, f, arc(sm, WEAVE + 0.3, 0.7, 0, 180, 6), 0.04)
    const W1: [number, number] = [1.0, 3.4], W2: [number, number] = [4.4, 6.4]
    along(f, [-15.4, -11.7, -8.0], W1)
    along(f, [-15.4, -11.7, -8.0], W2)
    const fSW = faceX(WX0, -1), fN = faceY(WY1, 1), fNE = faceX(WX1, 1)
    along(fSW, [-2.0, 1.6, 5.2, 8.8], W1)
    along(fSW, [-2.0, 1.6, 5.2, 8.8], W2)
    along(fN, [-15.4, -11.7, -8.0], W1)
    along(fN, [-15.4, -11.7, -8.0], W2)
    along(fNE, [-1.5, 3.3, 8.0], W2, 0.9)
  }

  return finishGlb('Gracie Mansion', [
    { part: wall, material: finish('gracie-yellow', 0xeedfa8) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: brick, material: finish('gracie-brick', 0xb46f5c) },
    { part: shut, material: finish('gracie-shutter', 0x63776d) },
  ], { bearing: 338.3, height: 14.4, replaces: ['way/284868519'] }, 6500)
}

if (import.meta.main) await writeModel('nyc-gracie-mansion', build())
