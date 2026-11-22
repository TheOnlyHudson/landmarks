/**
 * St. John the Evangelist Catholic Church (1867–1871, Diedrich A. Bohlen;
 * spires 1893), 126 West Georgia Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-st-john-the-evangelist.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/340480890 (-86.1613215, 39.7648739); the plan is
 * turned 1.4 degrees clockwise from true north (both long walls of the
 * outline agree), so the church is drawn square, its west front on Capitol
 * Avenue at x = -28.5 and the apse at x = 32.5, and placed at bearing 1.4.
 *
 * Identity (from the photos below):
 *  1. Twin west towers in red brick with pale limestone angle buttresses
 *     and string courses, belfry stage with paired louvred lancets, and two
 *     tall octagonal verdigris copper spires, each with four gabled
 *     lucarnes and four corner pinnacles at its foot.          (W, NW, SW)
 *  2. Between the towers the west gable: a pointed portal with a small
 *     gable over it, a big rose window, a pair of lancets, a cross.  (W)
 *  3. The long brick nave under a dark slate roof, buttressed bays with
 *     tall two-light lancets and a stone ledge under them, small
 *     round-headed windows below, a cross gable near the east end. (SW)
 *  4. A lower polygonal apse, with low sacristies either side.   (aerial)
 *
 * Sources
 * - OSM (ODbL): way/340480890 (building=church): towers x -28.6..-21.4,
 *   nave y -11.3..11.0, buttresses on the south wall at x -12.2, -8.0,
 *   -3.6, 1.3, 6.0, 11.2, 16.7, 22.0; apse x 22.6..32.6 (y -7..7);
 *   way/1465664948 (building=yes, x 22.4..33.5), the apse and sacristies,
 *   drawn here and listed in `replaces`.
 * - USGS NAIP orthophoto (public domain): the cross gable near the east end,
 *   the dark roof, the spires' shadows.
 * - Photos (Wikimedia Commons):
 *   "Saint John the Evangelist Catholic Church (Indianapolis, Indiana) -
 *   Jimmy Baikovicius.jpg" (Jimmy Baikovicius, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Saint_John_the_Evangelist_Catholic_Church_(Indianapolis,_Indiana)_-_Jimmy_Baikovicius.jpg),
 *   the west front from the south-west: every height below is scaled from
 *   it against the 22.3 m front;
 *   "Saint John the Evangelist Church (Indianapolis, Indiana) - exterior,
 *   side.jpg" (Nheyob, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Saint_John_the_Evangelist_Church_(Indianapolis,_Indiana)_-_exterior,_side.jpg),
 *   the south side: bays, windows, the ledge, the cross gable;
 *   "Saint John the Evangelist Catholic Church (Indianapolis, Indiana) -
 *   201106-18.jpg" (Chad Bowman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Saint_John_the_Evangelist_Catholic_Church_(Indianapolis,_Indiana)_-_201106-18.jpg),
 *   the towers and spires close up.
 *
 * Heights (photo-scaled, ±1.5 m; see LIDAR below): tower stages 0..9,
 *   9..17, belfry 17..27, cornice 27..28.2; spire to 47.5, cross to 49.5;
 *   west gable apex 21.5; nave eaves 13.0, ridge 21.5; apse eaves 11,
 *   roof to 17; sacristies 6.5.
 * LIDAR: USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016), if read;
 *   see the report. Estimated: the cross gable's span (x 9.5..21.5), the
 *   apse roof, the sacristies, every window's size from the photos. The
 *   north side and the east end are unphotographed and drawn like the south.
 * Left out: the relief of St John over the door, tracery cusps, the
 *   crockets on the spires, the rectory and school.
 * Night: the towers and spires are floodlit; windows glow; the doors are
 *   `entrance`.
 *
 * Shared helpers for my Indianapolis models are exported below (gable roofs,
 * spires, pointed arches, rings on a face).
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, chamfer, flatShape, extrudeShape, archShape, onFace, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'

// ---------------------------------------------------------------- helpers
// Shared by my Indianapolis models (indy-*): import from this file.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A flat convex polygon, wound to face `hint` (any vector on the outside). */
export function poly(part: Part, pts: V3[], hint: V3) {
  let n = unit(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
  if (dot(n, hint) < 0) n = [-n[0], -n[1], -n[2]]
  for (let i = 1; i + 1 < pts.length; i++) part.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/**
 * A gabled roof on a rectangle centred (cx, cy), `len` along the ridge
 * (turned `ang` degrees anticlockwise from +x) and `wid` across, eaves at zE,
 * ridge at zR, with an overhang `ov` and a 0.3 m thick edge. The gable-end
 * triangles go in `wall` (when `ends` says so); the slopes in `roof`.
 */
export function gable(wall: Part | null, roof: Part, cx: number, cy: number, len: number, wid: number, ang: number, zE: number, zR: number, ov = 0.4, ends: [boolean, boolean] = [true, true]) {
  const a = (ang * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  const P = (u: number, v: number, z: number): V3 => [cx + u * c - v * s, cy + u * s + v * c, z]
  const L = len / 2, W = wid / 2, k = (zR - zE) / W, T = 0.3
  const ue = L + ov * 0.6, ve = W + ov, ze = zE - ov * k
  for (const sg of [-1, 1]) {
    const up: V3 = [-s * sg * k, c * sg * k, 1]
    const nrm: V3 = [-s * sg, c * sg, 0]
    poly(roof, [P(-ue, sg * ve, ze), P(ue, sg * ve, ze), P(ue, 0, zR), P(-ue, 0, zR)], up)
    poly(roof, [P(-ue, sg * ve, ze - T), P(ue, sg * ve, ze - T), P(ue, 0, zR - T), P(-ue, 0, zR - T)], [-up[0], -up[1], -up[2]])
    poly(roof, [P(-ue, sg * ve, ze), P(ue, sg * ve, ze), P(ue, sg * ve, ze - T), P(-ue, sg * ve, ze - T)], nrm)
    for (const e of [-1, 1]) poly(roof, [P(e * ue, sg * ve, ze), P(e * ue, 0, zR), P(e * ue, 0, zR - T), P(e * ue, sg * ve, ze - T)], [c * e, s * e, 0])
  }
  if (wall) for (const e of [-1, 1]) if (ends[e < 0 ? 0 : 1]) poly(wall, [P(e * L, -W, zE), P(e * L, W, zE), P(e * L, 0, zR - 0.05)], [c * e, s * e, 0])
}

/** A pyramid or cone of `n` flat faces from a ring of radius r at z0 to an apex at z1; `rot` degrees turns the ring. */
export function spire(part: Part, cx: number, cy: number, r: number, z0: number, z1: number, n: number, rot = 0, base = false) {
  const ring: V3[] = []
  for (let i = 0; i < n; i++) {
    const a = ((rot + (360 * i) / n) * Math.PI) / 180
    ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z0])
  }
  const apex: V3 = [cx, cy, z1]
  for (let i = 0; i < n; i++) {
    const p = ring[i], q = ring[(i + 1) % n]
    poly(part, [p, q, apex], [(p[0] + q[0]) / 2 - cx, (p[1] + q[1]) / 2 - cy, 0.2])
  }
  if (base) poly(part, ring, [0, 0, -1])
}

/** A prism of `n` flat sides (an octagonal drum), radius r to its corners. */
export function drum(part: Part, top: Part | null, cx: number, cy: number, r: number, z0: number, z1: number, n: number, rot = 0) {
  const ring: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = ((rot + (360 * i) / n) * Math.PI) / 180
    ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  prism(part, top, ring, z0, z1, 1)
}

/** A pointed (equilateral) lancet's outline: jambs from z0, springing at zs. */
export function lancet(sc: number, w: number, z0: number, zs: number, segs = 4): XY[] {
  const h = w / 2
  const right = arc(sc - h, zs, w, 0, 60, segs)
  const left = arc(sc + h, zs, w, 120, 180, segs).slice(1)
  return [[sc - h, z0], [sc + h, z0], ...right, ...left]
}

/** An annulus r0..r1 about (sc, zc) on a face, d out from it. */
export function ringOnFace(part: Part, f: Face, sc: number, zc: number, r0: number, r1: number, segs: number, d = 0.08, a0 = 0, a1 = 360) {
  for (let k = 0; k < segs; k++) {
    const t0 = ((a0 + ((a1 - a0) * k) / segs) * Math.PI) / 180, t1 = ((a0 + ((a1 - a0) * (k + 1)) / segs) * Math.PI) / 180
    const A = onFace(f, sc + r0 * Math.cos(t0), zc + r0 * Math.sin(t0), d), B = onFace(f, sc + r1 * Math.cos(t0), zc + r1 * Math.sin(t0), d)
    const C = onFace(f, sc + r1 * Math.cos(t1), zc + r1 * Math.sin(t1), d), D = onFace(f, sc + r0 * Math.cos(t1), zc + r0 * Math.sin(t1), d)
    poly(part, [A, B, C, D], [f.n[0], f.n[1], 0])
  }
}

/** A bar (s0,z0)-(s1,z1) of width w, flat on a face. */
export function bar(part: Part, f: Face, s0: number, z0: number, s1: number, z1: number, w: number, d = 0.1) {
  const L = Math.hypot(s1 - s0, z1 - z0) || 1, ns = (-(z1 - z0) / L) * (w / 2), nz = ((s1 - s0) / L) * (w / 2)
  flatShape(part, f, [[s0 + ns, z0 + nz], [s0 - ns, z0 - nz], [s1 - ns, z1 - nz], [s1 + ns, z1 + nz]], d)
}

/** The four faces of an axis-aligned box x0..x1, y0..y1, with the face centre as origin and the half-width along it. */
export function boxFaces(x0: number, y0: number, x1: number, y1: number): { f: Face; half: number }[] {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  return [
    { f: { o: [cx, y0, 0], n: [0, -1] }, half: (x1 - x0) / 2 },
    { f: { o: [x1, cy, 0], n: [1, 0] }, half: (y1 - y0) / 2 },
    { f: { o: [cx, y1, 0], n: [0, 1] }, half: (x1 - x0) / 2 },
    { f: { o: [x0, cy, 0], n: [-1, 0] }, half: (y1 - y0) / 2 },
  ]
}

/** Floodlight: walls lit, faces looking up barely. */
export const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.2 : 0.85)

// ---------------------------------------------------------------- the model
if (import.meta.main) {
  const brick = new Part(), stone = new Part(), roof = new Part(), green = new Part(), win = new Part(), door = new Part()

  const FX = -28.0 // the towers' west faces
  const NX = -27.3 // the west gable wall between the towers
  const EX = 22.6 // the east end of the nave
  const YS = -11.3, YN = 11.0, YC = (YS + YN) / 2
  const EAVE = 13.0, RIDGE = 21.5
  const TW = 6.8 // tower width
  const TX1 = FX + TW
  const towers = [YS - 0.5, YN + 0.5 - TW] // south edges of the two towers
  const LEDGE = 5.6, CORN = 27.0, CORN1 = 28.2, SPIRE = 47.5, CROSS = 49.5

  // ---------------------------------------------------- the nave
  prism(brick, null, rect(NX, YS, EX, YN), 0, EAVE)
  prism(stone, null, rect(NX - 0.15, YS - 0.15, EX + 0.15, YN + 0.15), LEDGE - 0.35, LEDGE)
  prism(stone, null, rect(NX - 0.2, YS - 0.2, EX + 0.2, YN + 0.2), EAVE - 0.5, EAVE)
  gable(brick, roof, (NX + EX) / 2, YC, EX - NX, YN - YS, 0, EAVE, RIDGE, 0.5)
  // the cross gable near the east end (the transept roof, inside the walls)
  {
    const cx = 15.5, w = 12.0
    prism(brick, null, rect(cx - w / 2, YS, cx + w / 2, YN), EAVE - 0.5, EAVE)
    gable(brick, roof, cx, YC, YN - YS, w, 90, EAVE, RIDGE, 0.5)
    for (const f of [{ o: [cx, YS, 0], n: [0, -1] }, { o: [cx, YN, 0], n: [0, 1] }] as Face[]) {
      flatShape(win, f, lancet(0, 3.0, 8.0, 13.6, 4), 0.06)
      bar(stone, f, 0, 8.0, 0, 14.6, 0.18, 0.1)
      ringOnFace(stone, f, 0, 17.0, 0.9, 1.3, 12, 0.08)
      flatShape(win, f, arc(0, 17.0, 0.9, 0, 360, 12).slice(0, -1), 0.06)
    }
  }
  // the buttresses and bays, south and north
  const BUTT = [-17.6, -12.2, -8.0, -3.6, 1.3, 6.0, 11.2, 16.7, 21.9]
  for (const [y, sgn] of [[YS, -1], [YN, 1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sgn] }
    const S = (x: number) => (sgn < 0 ? x : -x) // s along the face for a given x
    for (const x of BUTT.slice(1)) {
      const yy = sgn < 0 ? [y - 0.6, y] : [y, y + 0.6]
      box(brick, stone, x - 0.45, yy[0], x + 0.45, yy[1], 0, EAVE - 1.2)
    }
    for (let k = 0; k + 1 < BUTT.length; k++) {
      const xc = (BUTT[k] + BUTT[k + 1]) / 2
      if (xc > 9.5 && xc < 21.5) continue // the cross gable's bays carry the big lancet
      flatShape(win, f, lancet(S(xc), 2.0, 6.6, 10.6, 4), 0.06)
      bar(stone, f, S(xc), 6.6, S(xc), 11.2, 0.16, 0.1)
      flatShape(win, f, archShape(S(xc), 1.0, 2.2, 3.6, 6), 0.06)
    }
    // the cross gable bays: a lower pair of round-headed windows
    for (const xc of [12.9, 18.5]) flatShape(win, f, archShape(S(xc), 1.0, 2.2, 3.6, 6), 0.06)
  }

  // ---------------------------------------------------- the apse and sacristies
  {
    const ap: XY[] = [[EX, -7.0], [28.0, -7.0], [32.2, -3.0], [32.2, 3.0], [28.0, 7.0], [EX, 7.0]]
    prism(brick, null, ap, 0, 11.0, 1)
    prism(stone, null, chamfer(ap.map(([x, y]) => [x + (x > EX + 0.1 ? 0.15 : 0), y * 1.02] as XY), 0.01), 10.5, 11.0, 1)
    // the half-octagon roof: a ridge from the nave to x 28, then hips
    const R = 17.0, z = 11.0
    const A: V3 = [EX, -7.4, z], B: V3 = [28.2, -7.4, z], C: V3 = [32.6, -3.1, z], D: V3 = [32.6, 3.1, z], E: V3 = [28.2, 7.4, z], F: V3 = [EX, 7.4, z]
    const top: V3 = [28.0, 0, R], back: V3 = [EX, 0, R]
    poly(roof, [A, B, top, back], [0, -1, 1])
    poly(roof, [E, F, back, top], [0, 1, 1])
    poly(roof, [B, C, top], [1, -1, 1])
    poly(roof, [C, D, top], [1, 0, 1])
    poly(roof, [D, E, top], [1, 1, 1])
    // apse windows: a lancet on each of the five outer faces
    const faces: [XY, XY][] = [[[28.0, -7.0], [32.2, -3.0]], [[32.2, -3.0], [32.2, 3.0]], [[32.2, 3.0], [28.0, 7.0]]]
    for (const [a, b] of faces) {
      const n: XY = [b[1] - a[1], a[0] - b[0]], l = Math.hypot(n[0], n[1])
      const f: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n: [n[0] / l, n[1] / l] }
      flatShape(win, f, lancet(0, 1.6, 4.5, 8.4, 4), 0.06)
    }
    // the sacristies, low and flat-roofed, either side of the apse
    for (const [y0, y1] of [[YS, -7.0], [7.0, YN]]) {
      box(brick, roof, EX, y0, 33.2, y1, 0, 6.5, 0.2)
      prism(stone, stone, rect(EX, y0 - 0.1, 33.3, y1 + 0.1), 6.5, 6.9)
      const f: Face = { o: [33.2, (y0 + y1) / 2, 0], n: [1, 0] }
      flatShape(win, f, archShape(0, 1.2, 2.2, 4.2, 6), 0.06)
    }
  }

  // ---------------------------------------------------- the west front between the towers
  {
    const f: Face = { o: [NX, YC, 0], n: [-1, 0] }
    const W2 = (towers[1] - (towers[0] + TW)) / 2 // half the gable wall's width
    // the gable above the nave roof line, up to the apex, with a stone coping
    const zEdge = RIDGE - (RIDGE - EAVE) * (W2 / ((YN - YS) / 2))
    flatShape(brick, f, [[-W2, EAVE], [W2, EAVE], [W2, zEdge], [0, RIDGE + 0.6], [-W2, zEdge]], 0.0)
    bar(stone, f, -W2, zEdge + 0.2, 0, RIDGE + 0.8, 0.5, 0.15)
    bar(stone, f, W2, zEdge + 0.2, 0, RIDGE + 0.8, 0.5, 0.15)
    // a stone cross at the apex
    box(stone, stone, NX - 0.3, YC - 0.15, NX + 0.1, YC + 0.15, RIDGE + 0.6, RIDGE + 2.8)
    box(stone, stone, NX - 0.3, YC - 0.75, NX + 0.1, YC + 0.75, RIDGE + 1.8, RIDGE + 2.2)
    // the portal: stone surround, pointed doorway, a small gable over it
    extrudeShape(stone, f, lancet(0, 4.6, 0, 3.6, 5), 0, 0.35)
    flatShape(door, f, lancet(0, 3.0, 0, 3.4, 5), 0.38)
    extrudeShape(stone, f, [[-2.6, 5.4], [2.6, 5.4], [0, 8.2]], 0, 0.35)
    // the rose window in its stone ring, with a cross of tracery
    const RZ = 12.4
    ringOnFace(stone, f, 0, RZ, 2.9, 3.5, 16, 0.12)
    flatShape(win, f, arc(0, RZ, 2.95, 0, 360, 16).slice(0, -1), 0.06)
    ringOnFace(stone, f, 0, RZ, 0.7, 1.0, 10, 0.1)
    for (const a of [0, 45, 90, 135]) {
      const r = (a * Math.PI) / 180
      bar(stone, f, -2.9 * Math.cos(r), RZ - 2.9 * Math.sin(r), 2.9 * Math.cos(r), RZ + 2.9 * Math.sin(r), 0.2, 0.1)
    }
    // a pair of small lancets in the gable
    for (const s of [-0.7, 0.7]) flatShape(win, f, lancet(s, 0.9, 16.6, 18.0, 3), 0.06)
    // the side lancets under the rose, either side of the portal
    for (const s of [-3.3, 3.3]) flatShape(win, f, lancet(s, 1.1, 5.0, 7.6, 3), 0.06)
  }

  // ---------------------------------------------------- the towers and spires
  for (const y0 of towers) {
    const x0 = FX, x1 = TX1, y1 = y0 + TW, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    prism(brick, null, rect(x0, y0, x1, y1), 0, CORN)
    // string courses and the cornice
    for (const z of [9.0, 17.0]) prism(stone, null, rect(x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12), z - 0.35, z)
    prism(stone, stone, chamfer(rect(x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35), 0.3), CORN, CORN1)
    // the limestone angle buttresses, stepping in twice
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = sx < 0 ? x0 : x1, py = sy < 0 ? y0 : y1
      const B = (o: number, w: number, z0: number, z1: number) => {
        const xa = px - sx * (w - o), xb = px + sx * o, ya = py - sy * (w - o), yb = py + sy * o
        box(stone, stone, Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb), z0, z1, 0.1)
      }
      B(0.55, 1.5, 0, 9.0)
      B(0.4, 1.3, 9.0, 17.0)
      B(0.25, 1.1, 17.0, CORN)
    }
    // windows on the outer faces (not where the nave abuts)
    for (const { f } of boxFaces(x0, y0, x1, y1)) {
      const n = f.n
      const inner = n[0] > 0.5 || (n[1] > 0.5 && y0 < 0) || (n[1] < -0.5 && y0 > 0)
      // the belfry: paired louvred lancets on every face (above the roofs)
      for (const s of [-1.0, 1.0]) {
        flatShape(win, f, lancet(s, 1.3, 19.0, 24.6, 4), 0.06)
        extrudeShape(stone, f, [[s - 0.75, 18.6], [s + 0.75, 18.6], [s + 0.75, 19.0], [s - 0.75, 19.0]], 0, 0.15)
      }
      if (inner) continue
      flatShape(win, f, lancet(0, 1.5, 11.0, 14.6, 4), 0.06)
      if (n[0] < -0.5) for (const s of [-0.7, 0.7]) flatShape(win, f, archShape(s, 0.8, 5.0, 7.2, 5), 0.06)
      else flatShape(win, f, lancet(0, 1.1, 4.0, 7.0, 3), 0.06)
    }
    // the spire: octagonal, faces on the axes, with four gabled lucarnes and four corner pinnacles
    const R0 = 2.75
    drum(stone, null, cx, cy, R0 / Math.cos(Math.PI / 8), CORN1, CORN1 + 0.4, 8, 22.5)
    spire(green, cx, cy, R0 / Math.cos(Math.PI / 8), CORN1 + 0.4, SPIRE, 8, 22.5)
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      // a lucarne: a little gabled box on the face, with a louvre
      const ox = cx + dx * 1.9, oy = cy + dy * 1.9, ang = dx !== 0 ? 0 : 90
      const hw = 0.85, d = 1.3
      box(green, null, ox - (dx ? d : hw), oy - (dy ? d : hw), ox + (dx ? d : hw), oy + (dy ? d : hw), CORN1, CORN1 + 3.0)
      gable(green, green, ox, oy, 2 * d + 0.2, 2 * hw, ang, CORN1 + 3.0, CORN1 + 4.6, 0.15)
      const f: Face = { o: [ox + dx * d, oy + dy * d, 0], n: [dx, dy] }
      flatShape(win, f, lancet(0, 0.8, CORN1 + 0.6, CORN1 + 2.6, 3), 0.06)
    }
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = cx + sx * (TW / 2 - 0.15), py = cy + sy * (TW / 2 - 0.15)
      drum(green, null, px, py, 0.55, CORN1, CORN1 + 1.6, 4, 45)
      spire(green, px, py, 0.55, CORN1 + 1.6, CORN1 + 6.0, 4, 45)
    }
    // the cross
    box(green, green, cx - 0.12, cy - 0.12, cx + 0.12, cy + 0.12, SPIRE - 0.5, CROSS)
    box(green, green, cx - 0.12, cy - 0.7, cx + 0.12, cy + 0.7, CROSS - 1.3, CROSS - 0.95)
  }

  const towerLit = (p: V3, n: V3) => (p[0] < -21 ? lit(p, n) : 0)
  const brickM = { ...finish('indy-sje-brick', 0xae6450), floodlight: towerLit }
  const stoneM = { ...finish('indy-sje-limestone', 0xe8e0cf), floodlight: towerLit }
  const copperM = { ...finish('indy-sje-copper', 0x77ab95), floodlight: (_p: V3, _n: V3) => 0.7 }
  const built = finishGlb('St. John the Evangelist Catholic Church', [
    { part: brick, material: brickM },
    { part: stone, material: stoneM },
    { part: roof, material: finish('indy-sje-slate', 0x8a8b8f) },
    { part: green, material: copperM },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('entrance', 0x9a7350) },
  ], { bearing: 1.4, height: CROSS, replaces: ['way/340480890', 'way/1465664948'] }, 5000)
  await writeModel('indy-st-john-the-evangelist', built)
}
