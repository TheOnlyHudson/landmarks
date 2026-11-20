/**
 * Walker Art Center, Minneapolis: Edward Larrabee Barnes's brick galleries
 * (1971), Herzog & de Meuron's expansion and tower (2005) and the 2017
 * garden entrance. Procedural, CC0-1.0.
 * bun generators/msp-walker-art-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin at the area
 * centroid of OSM way/45530842 (-93.288682, 44.968091).
 *
 * Datum. Heights below are written above lidar 257.0 m, the garden-side
 * ground the first version used as y = 0, and the whole model is lifted by
 * LIFT = 3.2 m at the end: the lowest ground under the footprint is the
 * sunken court along the north-west corner (Vineland Place side), lidar
 * 253.8 m, which the map's Mapterhorn terrain shows too (1.4 m against
 * 5.8 m on the garden side). Every wall runs down to that level. The
 * ground rises from there to about 1 m along the garden (west) front,
 * 1-3 m on Hennepin (east) and 5-7 m at the south tip, where the walls sink
 * into it.
 *
 * What makes it the Walker, and how each is drawn:
 * - Herzog & de Meuron's tower: a skewed block in silver crumpled aluminium
 *   mesh, faceted, not a box: each face is folded once (the east fold is in
 *   OSM's outline at (23.8, -42.2); the others are 0.4-0.5 m creases from
 *   the photos), and its parapet line steps between 29 and 31 m (lidar),
 *   highest along the west, where a 6 m plant strip stands over the deck
 *   (27 m). A notch is cut into the top of the east face near its north
 *   end, down to 21.8 m, with sloping dark glass at its back, 5 m deep (lidar reads
 *   22.1 there; McGhiever's and Mulad's photos show its shape). The few big
 *   windows are flush dark-glass shapes: the long wedge high on the north
 *   face, the slanted window low at the north-east corner wrapping onto the
 *   east face, the thin shard on the west face, and the small portholes.
 *   The block stands over a recessed glazed street storey (to 6.3 m, about
 *   3 m above the Hennepin sidewalk).
 * - The long low glass gallery along Hennepin: frosted pale green glass,
 *   8.7 m, a white top band, and the big white WALKER letters near its
 *   north end, traced from McGhiever's close photo (a plain bold
 *   grotesque: pointed W and A, K's arms off the stem, R with a straight
 *   leg), 3.1 m tall, `neon` (lit after dark).
 * - Barnes's 1971 building: dark purple-brown brick, low blocks (terraces
 *   with parapets at 10.5-13.6 m) under two 30 m cubes; the western cube
 *   holds a sunken roof court (24.5 m). A few deep-set windows (a real
 *   recess in the wall): one under a long window band on the west cube's
 *   north face, one in the north-west block's garden face.
 * - The 2017 garden entrance: a dark fascia on the west wall with the
 *   smaller WALKER letters, over full-height glazing.
 * - The white low wings of 2005, with their slanted window slots, and a
 *   white hipped skylight on the roof beside the tower (seen from Hennepin).
 *
 * Sources
 * - OSM (ODbL): way/45530842 (building, "Walker Art Center"), the only
 *   building the model covers; no heights tagged.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022; read keeping
 *   class 18), 1 m grid, heights above 257.0 m: tower parapet 29-31, deck
 *   26.7-27.5, the west strip 30.7-30.9, the notch 22.1; Barnes: cube 1
 *   (x -20.5..-11.5 / -7, y 17.5..40.5) 30.1 with its court at 23.8-25;
 *   cube 2 (x -7..4.5, y 27.5..49.5) 29.7-30.1; low blocks 10.2-11.5, the
 *   north-west block 12.6 with 13.7 parapets; the Hennepin gallery 8.6 at
 *   its face, 9.7 at the rail, and its entrance bay (x 19.8..25.4,
 *   y 44..49); H&dM west wing 11, south wing 14; ground as above.
 * - Mapterhorn terrain (tools/terrain.ts grid): the north-west court is the
 *   lowest ground, as in the lidar.
 * - USGS NAIP (public domain): plan, white H&dM roofs, grey Barnes roofs.
 * - Photos (Wikimedia Commons, evidence):
 *   McGhiever, "Walker Art Center 02.jpg", CC BY-SA 4.0 (from the
 *   north-east: the tower's north and east faces, the wedge and corner
 *   windows, the notch from the side, the portholes, the gallery, WALKER);
 *   McGhiever, "Walker Art Center 03.jpg", CC BY-SA 4.0 (WALKER close up:
 *   the letterforms traced; the canopy and brick wall at the north end);
 *   Paul VanDerWerf, "A view of the Walker Art Center exterior.jpg",
 *   CC BY 2.0, and McGhiever, "Walker Art Center.jpg", CC BY-SA 4.0 (from
 *   the east: the east face, the notch and its glass, the corner window);
 *   Aaron F, "Walker Art Center-Minneapolis-061230.jpg", CC BY-SA 2.0 (from
 *   the north on Hennepin: the wedge window over the gallery);
 *   Richie Diesterheft, "Walker Art Center, May 2009.jpg", CC BY 2.0 (from
 *   the north-west: the brick cubes, the band and deep window on the west
 *   cube's north face, the white wing and its slots, the west shard);
 *   Daniel X. O'Neil, "Walker Art Center, October 2017.jpg", CC BY 2.0 (the
 *   2017 fascia with WALKER, the deep window in the north-west block);
 *   Eco84, "Walker Art Center 2011.JPG", CC BY-SA 3.0 (night: the tower
 *   lit, the gallery glowing); SusanLesch, "Walker Art Center-20081004.JPG",
 *   CC BY-SA 3.0; w_lemay, "Walker Art Center from Irene Hixon Whitney
 *   Bridge ...", CC BY-SA 2.0 (from the east, far).
 * - Published: Barnes building 1971, Herzog & de Meuron expansion 2005,
 *   entrance and garden renovation 2017 (Wikipedia, "Walker Art Center").
 * Measured (lidar): every height, the tower's plan and the cubes' plan.
 * Estimated from the photos: the tower's glazed base (6.3 m) and its 1.6 m
 *   recess; the window and porthole shapes and places (scaled on the tower's
 *   faces); the face creases (0.4-0.5 m); the notch's width (from 0.68 to
 *   0.82 of the east face) and its glass slope; WALKER's size and place
 *   (cap 3.1 m, its right end 7 m short of the gallery's north end); the
 *   2017 fascia (y 8..40, 2.5 m deep, 4.6-6.4 m) and its letters (cap
 *   1.1 m); the Barnes windows; the skylight; colours, from the photos.
 * Left out: the mesh's crumpled relief (drawn as folds only), rooftop
 *   plant on the deck, railings, the hillside green roof (ground: the map's),
 *   the sloped roof east of cube 2.
 * Doubts: the tower's south face shows in no photo close enough for windows
 *   and is left plain; the fascia's extent is from one photo; the Barnes
 *   north face (Vineland Place) has no photo and is plain brick.
 * Night: WALKER (both signs) is `neon-walker`, white; windows and the
 *   tower's base glazing are `window`, the gallery `window-2`; the tower's
 *   mesh carries `floodlight` (lit after dark in Eco84's photo).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE, windowVariant, type Swatch } from './palette'
import { Pen, strokes, type Pt } from './lettering'
import { type XY, type Face, ccw, prism, wallEdge, capRing, rect, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'

const LIFT = 3.2 // lidar 257.0 m (the heights below) above the lowest ground under the footprint
const Z0 = -LIFT // the lowest ground, where every wall starts

// ------------------------------------------------------------------ small helpers
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const add2 = (a: XY, b: XY, k = 1): XY => [a[0] + b[0] * k, a[1] + b[1] * k]
const len2 = (v: XY) => Math.hypot(v[0], v[1])
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
/** Outward normal of edge a->b of a counter-clockwise ring. */
const outN = (a: XY, b: XY): XY => { const d = sub2(b, a), l = len2(d); return [d[1] / l, -d[0] / l] }
/** Where the lines p+t*u and q+s*v meet. */
function meet(p: XY, u: XY, q: XY, v: XY): XY {
  const den = u[0] * v[1] - u[1] * v[0]
  if (Math.abs(den) < 1e-9) return p
  const t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
  return add2(p, u, t)
}
/** A ring offset inward, edge i by d[i]. */
function inset(r: XY[], d: number[]): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const h = (i - 1 + n) % n, a = r[h], b = r[(i + 1) % n]
    const n0 = outN(a, p), n1 = outN(p, b)
    return meet(add2(a, n0, -d[h]), sub2(p, a), add2(p, n1, -d[i]), sub2(b, p))
  })
}
/** The wall face over segment a->b: s runs a (left, seen from outside) to b. */
const segFace = (a: XY, b: XY): { f: Face; L: number } => {
  const L = len2(sub2(b, a))
  return { f: { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n: outN(a, b) }, L }
}
/**
 * Flush shapes on segment a->b of a longer face: points are (t, z) with t
 * the fraction along the whole face, the segment covering t0..t1.
 */
function onSeg(part: Part, a: XY, b: XY, t0: number, t1: number, pts: XY[], d = 0.06) {
  const { f, L } = segFace(a, b)
  flatShape(part, f, pts.map(([t, z]) => [((t - t0) / (t1 - t0) - 0.5) * L, z] as XY), d)
}
const circle = (t: number, z: number, r: number, faceL: number, n = 8): XY[] =>
  Array.from({ length: n }, (_, k) => [t + (r * Math.cos((2 * Math.PI * k) / n)) / faceL, z + r * Math.sin((2 * Math.PI * k) / n)] as XY)

/** Walls of a ring, skipping the edges in `skip`. */
function walls(part: Part, r: XY[], z0: number, z1: number, skip: number[] = []) {
  for (let i = 0; i < r.length; i++) if (!skip.includes(i)) wallEdge(part, r, i, z0, z1, 0)
}
/**
 * A roof terrace: outer walls z0..top, a parapet `t` thick, its inner walls
 * down to the deck, the deck itself.
 */
function terrace(wall: Part, deckPart: Part, ring: XY[], z0: number, deck: number, top: number, t = 0.45, skip: number[] = []) {
  const r = ccw(ring), q = inset(r, r.map(() => t))
  walls(wall, r, z0, top, skip)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    wall.quad([r[i][0], r[i][1], top], [r[j][0], r[j][1], top], [q[j][0], q[j][1], top], [q[i][0], q[i][1], top])
    wall.quad([q[j][0], q[j][1], deck], [q[i][0], q[i][1], deck], [q[i][0], q[i][1], top], [q[j][0], q[j][1], top])
  }
  capRing(deckPart, q, deck)
}
/**
 * A wall over a->b, z0..z1, with one deep-set window: the opening at
 * s (from a) s0..s1, z w0..w1, its glass `depth` back, reveals in the wall.
 */
function deepWall(wall: Part, glass: Part, a: XY, b: XY, z0: number, z1: number, s0: number, s1: number, w0: number, w1: number, depth: number) {
  const L = len2(sub2(b, a)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outN(a, b)
  const P = (s: number, z: number, d = 0): V3 => { const p = add2(add2(a, u, s), n, -d); return [p[0], p[1], z] }
  const Q = (part: Part, s0_: number, s1_: number, za: number, zb: number) => part.quad(P(s0_, za), P(s1_, za), P(s1_, zb), P(s0_, zb))
  Q(wall, 0, L, z0, w0) // below
  Q(wall, 0, L, w1, z1) // above
  Q(wall, 0, s0, w0, w1) // left
  Q(wall, s1, L, w0, w1) // right
  // the recess: glass at the back, reveals facing into the opening
  glass.quad(P(s0, w0, depth), P(s1, w0, depth), P(s1, w1, depth), P(s0, w1, depth))
  wall.quad(P(s0, w0, 0), P(s1, w0, 0), P(s1, w0, depth), P(s0, w0, depth)) // sill, facing up
  wall.quad(P(s1, w1, 0), P(s0, w1, 0), P(s0, w1, depth), P(s1, w1, depth)) // head, facing down
  wall.quad(P(s0, w0, depth), P(s0, w1, depth), P(s0, w1, 0), P(s0, w0, 0)) // left jamb, facing +s
  wall.quad(P(s1, w0, 0), P(s1, w1, 0), P(s1, w1, depth), P(s1, w0, depth)) // right jamb, facing -s
}

/**
 * A wall over a->b from TB to the tops za, zb, as a 3 x 3 grid of cells whose
 * four interior points are pushed along the outward normal by d: shallow
 * facets, the crumpled look of the mesh at a size that reads.
 */
function facets(part: Part, a: XY, b: XY, za: number, zb: number, d: number[]) {
  const n = outN(a, b), m = 3
  const P = (i: number, j: number): V3 => {
    const t = i / m, p = lerp2(a, b, t), top = za + (zb - za) * t, z = TB + ((top - TB) * j) / m
    const k = i > 0 && i < m && j > 0 && j < m ? d[(i - 1) + (j - 1) * 2] : 0
    return [p[0] + n[0] * k, p[1] + n[1] * k, z]
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
    const p00 = P(i, j), p10 = P(i + 1, j), p11 = P(i + 1, j + 1), p01 = P(i, j + 1)
    if ((i + j) % 2) { part.tri(p00, p10, p11); part.tri(p00, p11, p01) }
    else { part.tri(p00, p10, p01); part.tri(p10, p11, p01) }
  }
}

// ------------------------------------------------------------------ WALKER, traced from McGhiever's photo
// Cap height 1; centre-lines, a bold grotesque. Advance widths and the glyphs.
const STROKE = 0.16
function walker(): { pen: Pen; width: number } {
  const pen = new Pen(), gap = 0.09
  let x = 0
  const g = (w: number, draw: (p: Pen) => void) => { const q = new Pen(); draw(q); pen.add(q, x); x += w + gap }
  g(1.1, (p) => { p.moveTo([0.06, 1]).lineTo([0.3, 0.02]).lineTo([0.55, 0.96]).lineTo([0.8, 0.02]).lineTo([1.04, 1]) })
  g(0.88, (p) => { p.moveTo([0.04, 0]).lineTo([0.44, 0.98]).lineTo([0.84, 0]); p.moveTo([0.21, 0.3]).lineTo([0.67, 0.3]) })
  g(0.6, (p) => { p.moveTo([0.08, 1]).lineTo([0.08, 0.08]).lineTo([0.6, 0.08]) })
  g(0.76, (p) => { p.moveTo([0.08, 0]).lineTo([0.08, 1]); p.moveTo([0.74, 1]).lineTo([0.15, 0.4]); p.moveTo([0.33, 0.58]).lineTo([0.76, 0]) })
  g(0.62, (p) => { p.moveTo([0.6, 0.92]).lineTo([0.08, 0.92]).lineTo([0.08, 0.08]).lineTo([0.62, 0.08]); p.moveTo([0.08, 0.5]).lineTo([0.55, 0.5]) })
  g(0.74, (p) => {
    p.moveTo([0.08, 0]).lineTo([0.08, 0.92]).lineTo([0.4, 0.92]).cubicTo([0.7, 0.92], [0.7, 0.46], [0.4, 0.46], 8).lineTo([0.08, 0.46])
    p.moveTo([0.38, 0.46]).lineTo([0.73, 0])
  })
  return { pen, width: x - gap }
}

// ------------------------------------------------------------------ the H&dM tower
const TB = 6.3 // the mesh starts here, over the recessed glazed street storey
const DECK = 27.0
const A: XY = [-1, -16], B: XY = [32.7, -23.7], F: XY = [23.8, -42.2], C: XY = [19.8, -56.8], D: XY = [-9, -50]
const NOTCH = [0.68, 0.82] // fractions of the east face (C..B) where the notch is cut
const NOTCH_Z = 21.8, NOTCH_IN = 5.0, NOTCH_BACK = 27.6

export function build() {
  const brick = new Part(), mesh = new Part(), white = new Part(), win = new Part(), glass = new Part(), neon = new Part()

  // ================================================================ the tower
  // creases (fold points pushed out of the face)
  const crease = (a: XY, b: XY, t: number, d: number) => add2(lerp2(a, b, t), outN(a, b), d)
  const Nf = crease(B, A, 0.66, 0.5), Wf = crease(A, D, 0.5, 0.4), Sf = crease(D, C, 0.5, 0.45)
  // the east face C -> F -> B, the notch on F -> B
  const eastL = len2(sub2(F, C)) + len2(sub2(B, F)), tF = len2(sub2(F, C)) / eastL
  const onFB = (t: number) => lerp2(F, B, (t - tF) / (1 - tF))
  const N1 = onFB(NOTCH[0]), N2 = onFB(NOTCH[1])
  const nin: XY = (() => { const o = outN(F, B); return [-o[0], -o[1]] })()
  const iN1 = add2(N1, nin, NOTCH_IN), iN2 = add2(N2, nin, NOTCH_IN)
  // the outer ring, counter-clockwise, with the parapet's top at each point (lidar)
  type TP = { p: XY; z: number; notch?: 1 | 2; low?: boolean }
  // the faces with no windows, folded into a 3 x 3 field of facets (interior points pushed out or in, metres)
  const CRUMPLE = [
    { a: D, b: Sf, d: [0.6, -0.5, -0.4, 0.7] }, { a: Sf, b: C, d: [-0.5, 0.6, 0.7, -0.4] },
    { a: Wf, b: D, d: [0.5, -0.6, -0.5, 0.5] }, { a: C, b: F, d: [-0.6, 0.5, 0.5, -0.5] },
  ]
  const ring: TP[] = [
    { p: A, z: 29.0 }, { p: Wf, z: 30.9 }, { p: D, z: 30.9 }, { p: Sf, z: 29.8 }, { p: C, z: 29.0 }, { p: F, z: 29.6 },
    { p: N1, z: 29.8, notch: 1 }, { p: N1, z: NOTCH_Z, notch: 1, low: true }, { p: N2, z: NOTCH_Z, notch: 2, low: true }, { p: N2, z: 29.9, notch: 2 },
    { p: B, z: 29.9 }, { p: Nf, z: 29.3 },
  ]
  // inner ring of the parapet: 0.9 m, 6 m along the west (the plant strip), the notch's back
  const corner = (r: XY[], d: number[]) => inset(r, d)
  const base = [A, Wf, D, Sf, C, F, B, Nf]
  const baseIn = corner(base, [6, 6, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9])
  const innerOf = (k: number): XY => {
    const tp = ring[k]
    if (tp.notch === 1) return iN1
    if (tp.notch === 2) return iN2
    return baseIn[base.indexOf(tp.p)]
  }
  const innerZ = (k: number) => (ring[k].notch ? NOTCH_BACK : ring[k].z)
  const V = (p: XY, z: number): V3 => [p[0], p[1], z]
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    const ia = innerOf(k), ib = innerOf((k + 1) % ring.length), za = innerZ(k), zb = innerZ((k + 1) % ring.length)
    const zero = len2(sub2(b.p, a.p)) < 1e-6
    // the face: plain where it carries windows, crumpled into shallow facets where it has none
    const crumple = CRUMPLE.find((c) => c.a === a.p && c.b === b.p)
    if (crumple) facets(mesh, a.p, b.p, a.z, b.z, crumple.d)
    else if (!zero) mesh.quad(V(a.p, TB), V(b.p, TB), V(b.p, b.z), V(a.p, a.z))
    // the parapet's top (or, across the notch, its sloping glass back)
    const top = a.low && b.low ? win : mesh
    if (zero) mesh.tri(V(a.p, a.z), V(b.p, b.z), V(ib, zb))
    else if (len2(sub2(ib, ia)) < 1e-6) top.tri(V(a.p, a.z), V(b.p, b.z), V(ia, za))
    else top.quad(V(a.p, a.z), V(b.p, b.z), V(ib, zb), V(ia, za))
  }
  // the parapet's inner walls and the deck
  const inner: { p: XY; z: number }[] = []
  for (let k = 0; k < ring.length; k++) {
    const p = innerOf(k)
    if (inner.length && len2(sub2(inner[inner.length - 1].p, p)) < 1e-6) continue
    inner.push({ p, z: innerZ(k) })
  }
  for (let k = 0; k < inner.length; k++) {
    const a = inner[k], b = inner[(k + 1) % inner.length]
    mesh.quad(V(b.p, DECK), V(a.p, DECK), V(a.p, a.z), V(b.p, b.z))
  }
  capRing(mesh, inner.map((q) => q.p), DECK)
  // rooftop plant on the deck (NAIP: pale boxes), below the parapet line
  prism(mesh, mesh, rect(8, -41, 15, -33), DECK, 28.9, 0)
  prism(mesh, mesh, rect(15, -31, 21, -26), DECK, 28.6, 0)
  // the recessed glazed street storey and the soffit over it
  const cx = base.reduce((s, p) => s + p[0], 0) / base.length, cy = base.reduce((s, p) => s + p[1], 0) / base.length
  const shrink = (p: XY, d: number): XY => { const v: XY = [cx - p[0], cy - p[1]], l = len2(v); return add2(p, v, d / l) }
  const baseRing = base.map((p) => shrink(p, 1.6))
  prism(win, null, baseRing, Z0, TB, 0)
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length
    mesh.quad(V(base[i], TB), V(baseRing[i], TB), V(baseRing[j], TB), V(base[j], TB))
  }
  // windows, flush dark glass
  {
    // north face B (t 0, east) -> A (t 1); the crease at 0.66
    const L = len2(sub2(A, B))
    onSeg(win, B, Nf, 0, 0.66, [[0.13, 24.4], [0.15, 22.9], [0.5, 22.1], [0.62, 26.4]]) // the long wedge
    onSeg(win, B, Nf, 0, 0.66, [[0, 7.7], [0.38, 7.7], [0.38, 10.0], [0, 15.4]]) // low, wrapping the corner
    for (const [t, z] of [[0.69, 11.9], [0.75, 15.9], [0.9, 9.7], [0.95, 22.7], [0.84, 19.5]] as XY[]) onSeg(win, Nf, A, 0.66, 1, circle(t, z, 0.55, L))
    onSeg(win, B, Nf, 0, 0.66, circle(0.3, 18.4, 0.55, L))
  }
  {
    // east face C (t 0, south) -> F -> N1 | N2 -> B (t 1)
    onSeg(win, N2, B, NOTCH[1], 1, [[0.86, 12.2], [0.89, 8.6], [1, 7.7], [1, 15.4]]) // the corner window's other half
    onSeg(win, F, N1, tF, NOTCH[0], circle(0.47, 17, 0.55, eastL))
    onSeg(win, F, N1, tF, NOTCH[0], circle(0.6, 13.5, 0.55, eastL))
    onSeg(win, N1, N2, NOTCH[0], NOTCH[1], circle(0.75, 10.6, 0.55, eastL))
  }
  {
    // west face A (t 0, north) -> D (t 1): the thin slanted shard
    onSeg(win, A, Wf, 0, 0.5, [[0.12, 13.0], [0.16, 12.6], [0.27, 21.6], [0.23, 22.2]])
  }

  // ================================================================ the H&dM white wings (2005)
  const WEST: XY[] = [[-20.3, 1.5], [-33.9, -1.6], [-29.0, -27.8], [-14.7, -26.2], [-4, -26], [-1, -16], [13, -19.2], [13, 1.5]]
  prism(white, white, ccw(WEST), Z0, 11.2, 0)
  const SOUTH: XY[] = [[-14.7, -26.2], [-14.9, -34.1], [-19.1, -36.2], [-7.6, -61.4], [-0.2, -76.6], [4.5, -86.5], [15.9, -81.0], [7.2, -60.4], [4.1, -52.9], [5, -40], [-2, -26]]
  prism(white, white, ccw(SOUTH), Z0, 14.2, 0)
  // the hipped skylight on the west wing's roof, beside the tower (seen over the gallery from Hennepin)
  {
    const z = 11.2, h = 13.3, r = rect(1.5, -13.5, 11.5, -4), r0: XY = [4.5, -8.75], r1: XY = [8.5, -8.75]
    const c = r.map((p) => V(p, z)), R0 = V(r0, h), R1 = V(r1, h)
    white.quad(c[0], c[1], R1, R0) // south slope
    white.quad(c[2], c[3], R0, R1) // north slope
    white.tri(c[1], c[2], R1) // east hip
    white.tri(c[3], c[0], R0) // west hip
  }
  // the white wings' slanted window slots
  {
    const { f, L } = segFace([-33.9, -1.6], [-29.0, -27.8])
    flatShape(win, f, [[-L / 2 + 3, 6.5], [-L / 2 + 10, 7.8], [-L / 2 + 10, 9.4], [-L / 2 + 3, 8.4]], 0.06)
    flatShape(win, f, [[2, 3.0], [9, 2.4], [9, 4.6], [2, 5.4]], 0.06)
  }
  {
    // the south tail's glazed street storey on Hennepin
    const { f, L } = segFace([15.9, -81.0], [7.2, -60.4])
    flatShape(win, f, [[-L / 2 + 1, 6.2], [L / 2 - 1, 5.0], [L / 2 - 1, 9.2], [-L / 2 + 1, 10.2]], 0.06)
  }

  // ================================================================ the glass gallery along Hennepin
  const GX = 19.8, GTOP = 7.6, GROOF = 8.7
  const gallery: XY[] = [[13, -19.2], [GX, -20.75], [GX, 49], [13, 49]]
  prism(glass, null, gallery, Z0, GTOP, 0)
  terrace(white, white, gallery, GTOP, GROOF - 0.5, GROOF, 0.4)
  // pale mullion and transom lines on its street face
  for (const y of [-13.5, -6, 1.5, 9, 16.5]) flatShape(white, { o: [GX, y, 0], n: [1, 0] }, rect(-0.14, 0.5, 0.14, GTOP), 0.05)
  flatShape(white, { o: [GX, 14.1, 0], n: [1, 0] }, rect(-34.8, 4.1, 34.9, 4.35), 0.05)
  // the entrance canopy at its north end (lidar 8.6 m over x 19.8..25.4, y 44..49): a white slab on
  // two posts, over the low brick wall that steps down beside the ramp (McGhiever's photo)
  {
    prism(white, white, rect(GX, 44, 25.4, 49), 7.9, GROOF, 0)
    white.quad([GX, 49, 7.9], [25.4, 49, 7.9], [25.4, 44, 7.9], [GX, 44, 7.9]) // its underside
    for (const y of [44.5, 48.5]) prism(white, null, rect(24.7, y - 0.25, 25.2, y + 0.25), Z0, 7.9, 0)
    prism(brick, brick, rect(GX, 48.2, 25.4, 49), Z0, 2.4, 0)
  }
  // WALKER, 3.1 m tall, its right (north) end at y 40.6
  {
    const { pen, width } = walker(), cap = 3.1, y0 = 40.6 - width * cap, z0 = 4.4
    strokes(neon, pen.paths, { width: STROKE, depth: 0.18, place: (u, v, w) => [GX + 0.04 + w, y0 + u * cap, z0 + v * cap] })
  }

  // ================================================================ Barnes (1971): brick
  // the low blocks, terraces with parapets
  const L1: XY[] = [[-20.3, 1.5], [13, 1.5], [13, 41.5], [4.5, 41.5], [4.5, 27.5], [-11.5, 27.5], [-11.5, 17.5], [-20.3, 17.5]]
  terrace(brick, mesh, L1, Z0, 10.5, 11.3, 0.45)
  const NW: XY[] = [[-20.3, 40.5], [-7, 40.5], [-7, 49.5], [-6, 49.5], [-6, 67.4], [-20.3, 67.4]]
  const L2: XY[] = [[-6, 49.5], [4.5, 49.5], [4.5, 41.5], [13, 41.5], [13, 49], [20.5, 49], [20.5, 67.4], [-6, 67.4]]
  terrace(brick, mesh, L2, Z0, 9.6, 10.3, 0.45)
  {
    // the north-west block, with a deep-set window in its garden face
    const r = ccw(NW)
    const wi = r.findIndex((p, i) => { const q = r[(i + 1) % r.length]; return p[0] === -20.3 && q[0] === -20.3 })
    terrace(brick, mesh, r, Z0, 12.6, 13.6, 0.45, [wi])
    deepWall(brick, win, r[wi], r[(wi + 1) % r.length], Z0, 13.6, 67.4 - 62.6, 67.4 - 59.4, 3.0, 6.3, 0.9)
  }
  prism(brick, mesh, rect(-6.6, 67.4, -1.7, 73.1), Z0, 10.2, 0) // the north loading bay
  // the west entrance glazing (2017) along the low block's garden face, under the fascia
  flatShape(win, { o: [-20.3, 24, 0], n: [-1, 0] }, rect(-16, 0.6, 16, 4.6), 0.06)
  // cube 1 (west): walls with the deep window in its north face, a sunken roof court
  {
    const c1: XY[] = [[-20.3, 17.5], [-11.5, 17.5], [-11.5, 27.5], [-7, 27.5], [-7, 40.5], [-20.3, 40.5]]
    walls(brick, c1, Z0, 30, [4])
    // north face (from x -7 to -20.5, seen from the north): the window band and the deep window under it
    deepWall(brick, win, [-7, 40.5], [-20.3, 40.5], Z0, 30, 1, 6, 13.9, 16.8, 1.0)
    onSeg(win, [-7, 40.5], [-20.3, 40.5], 0, 1, [[0.07, 17.3], [0.74, 17.3], [0.74, 18.7], [0.07, 18.7]])
    // the roof, around the court
    const top = (r: XY[]) => capRing(brick, ccw(r), 30)
    top(rect(-20.3, 17.5, -11.5, 29)); top(rect(-11.5, 27.5, -7, 29)); top(rect(-20.3, 38.5, -7, 40.5))
    top(rect(-20.3, 29, -19, 38.5)); top(rect(-8, 29, -7, 38.5))
    const court = rect(-19, 29, -8, 38.5)
    for (let i = 0; i < 4; i++) {
      const a = court[i], b = court[(i + 1) % 4]
      brick.quad(V(b, 24.5), V(a, 24.5), V(a, 30), V(b, 30))
    }
    capRing(mesh, court, 24.5)
  }
  // cube 2 (east)
  prism(brick, brick, rect(-7, 27.5, 4.5, 49.5), Z0, 30, 0)

  // ================================================================ the 2017 garden entrance: a dark fascia with WALKER
  {
    const fx = -22.8, y0 = 8, y1 = 40, z0 = 4.6, z1 = 6.4
    prism(win, win, rect(fx, y0, -20.3, y1), z0, z1, 0)
    win.quad([-20.3, y1, z0], [-20.3, y0, z0], [fx, y0, z0], [fx, y1, z0]) // its underside
    const { pen, width } = walker(), cap = 1.1, yR = 14.9
    strokes(neon, pen.paths, { width: STROKE * 1.05, depth: 0.12, place: (u, v, w) => [fx - 0.04 - w, yR + width * cap - u * cap, z0 + 0.35 + v * cap] })
  }

  // ---------------------------------------------------------------- lift onto the lowest ground (glTF y is up)
  for (const p of [brick, mesh, white, win, glass, neon]) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] += LIFT

  const meshLit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.05 : 0.45)
  return finishGlb('msp-walker-art-center', [
    { part: brick, material: finish('walker-brick', 0x7e6e72) },
    { part: mesh, material: { ...finish('walker-mesh', 0xc3c5c8, 0.6), floodlight: meshLit } as Swatch },
    { part: white, material: finish('walker-white', 0xe6e8e2) },
    { part: win, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0xa3bdb2) },
    { part: neon, material: finish('neon-walker', 0xf6f6f2, 0.5) },
  ], { name: 'Walker Art Center' }, 5000)
}

if (import.meta.main) await writeModel('msp-walker-art-center', build())
