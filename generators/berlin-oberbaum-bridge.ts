/**
 * Oberbaumbrücke, Spree between Kreuzberg and Friedrichshain, Berlin (Otto
 * Stahn and Georg Pinkenburg, 1894-96; middle span Santiago Calatrava,
 * 1994-95): procedural, CC0-1.0, no textures.
 * bun generators/berlin-oberbaum-bridge.ts
 *
 * Writes models/berlin-oberbaum-bridge.glb (low) and
 * models/berlin-oberbaum-bridge.detail.glb (detail: round arcade columns,
 * finer arch curves, every merlon, the arcade's railings, the U-Bahn's
 * rails and the steel middle span's posts and railings).
 *
 * One complete model of the bridge, as docs/reference.md "Bridges" asks: the
 * piers and their cutwaters, the brick and granite arches, the arcade with
 * the U-Bahn deck on it, the two towers and the end turrets. The roadway is
 * the map's: nothing is drawn at road level across it. Under the roadway a
 * deck slab tops out at 4.75 m, 0.25 m under the road the model was built
 * to (5.0 m over the water, measured from photos; OSM tags the outline
 * height=6). The arcade walkway (5.0 m) and the U-Bahn deck with its track
 * bed (9.8 m) are the model's.
 *
 * Map frame: x across the bridge (+x to the south-east, the upstream side
 * that carries the arcade and the U-Bahn), y along it (+y to the north-east,
 * Friedrichshain), z up, metres, BEARING 38.5 (the outline's long sides).
 * Anchor: the area centroid of the outline way/288514442, lng 13.445669,
 * lat 52.501729. z = 0 is the Spree's water.
 *
 * What makes it the Oberbaumbrücke, and how each is drawn
 * - Red brick neo-Gothic, a city gate over the river: the long arcade
 *   (a covered walk like a cloister) on the upstream side under the U-Bahn,
 *   its pointed arches open to the road and the river, a diaper frieze and
 *   a crenellated parapet on top.
 * - The two towers over the middle span, on the upstream piers: a granite
 *   and brick square shaft, a corbelled octagonal gallery with round
 *   windows and a skirt roof, a round stage with a crenellated crown, a
 *   brick cone with its finial (bear and eagle vanes, drawn as a finial).
 * - Seven river spans (7.5, 16, 19, 22, 19, 16, 7.5 m): six low segmental
 *   brick arches with granite voussoir rings on granite piers with
 *   pointed cutwaters, and the 1995 middle span: a flat white slab for the
 *   road and walk, and Calatrava's white steel deck arch for the U-Bahn.
 * - The end turrets on the arcade, and the clock gables over the third
 *   piers.
 *
 * Evidence
 * - OSM (ODbL): outline way/288514442 (man_made=bridge, "Oberbaumbrücke",
 *   bridge:structure=arch, height=6, wikidata Q695082): 150 m long, 29 m
 *   wide, the piers' cutwaters bulging at y = -61, -41, -15, +14, +40, +61;
 *   the U-Bahn deck way/288514445 (building=bridge, 9.5-10 m, x 4.4-13.5);
 *   the towers way/373626463, /464 (bases), way/288514443, /444 (shafts to
 *   15 m), way/373626457, /462 (to 26 m), way/373626459 (cone to 34 m); the
 *   end turrets way/373626454, /455, /456 (18 m); the clock gables
 *   way/373626460, /461 (12 m); way/439029208 (building=bridge, the middle
 *   span's slab).
 * - Published (de.wikipedia "Oberbaumbrücke"): built 1894-96, seven arches
 *   of 7.5, 16, 19, 22, 19, 16 and 7.5 m; the two towers 34 m high, after
 *   the Mitteltorturm in Prenzlau; the arcade under the U-Bahn "in the
 *   manner of a medieval cloister"; middle arch blown up 1945, replaced by
 *   Calatrava's steel span 1994-95.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Oberbaumbrücke November 2013 01.jpg", Arild Vågen, CC BY-SA 3.0 (the
 *     whole upstream face from the south-east bank; tower stages measured
 *     from it, 10.9 px/m, the crown at OSM's 26 m as scale)
 *     https://commons.wikimedia.org/wiki/File:Oberbaumbr%C3%BCcke_November_2013_01.jpg
 *   "Oberbaumbrücke, Berlin, Northwest view 20130725 1.jpg", DXR, CC BY-SA
 *     4.0 (the downstream face: arches, piers, the arcade behind the road)
 *     https://commons.wikimedia.org/wiki/File:Oberbaumbr%C3%BCcke,_Berlin,_Northwest_view_20130725_1.jpg
 *   "Berlin, Oberbaumbrücke -- 2019 -- 4335.jpg", Dietmar Rabich, CC BY-SA
 *     4.0 (from the road: the arcade's arches on columns, the frieze, the
 *     merlons, the tower's gallery and round stage)
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Oberbaumbr%C3%BCcke_--_2019_--_4335.jpg
 *   "Oberbaum Bridge, Berlin 01.jpg", Ank Kumar, CC BY-SA 4.0 (granite
 *     voussoirs, piers, parapet and railing on the downstream side)
 *     https://commons.wikimedia.org/wiki/File:Oberbaum_Bridge,_Berlin_01.jpg
 *   "Oberbaumbrücke von Westen, Berlin, 170331, ako.jpg", Ansgar Koreng,
 *     CC BY-SA 4.0; "Oberbaumbrücke mit U-Bahn.jpg", Sarah Jane, CC BY 2.0;
 *     "Oberbaumbrücke (Berlin) (1).jpg", Joseolgon, CC BY-SA 4.0;
 *     "Oberbaumbrücke Berlin 1.jpg", kallerna, CC BY-SA 4.0.
 * - Measured (Vågen photo): cutwater tops 4.1 m; the arcade floor 5.0, its
 *   arches to 8.5, the frieze to 10, merlons to 11.3 (on review the arches
 *   were drawn taller and wider, to 9.5 m on 0.66 m piers, the frieze at
 *   9.75, the parapet to 11.6, so the arcade reads as the row of big open
 *   arches it is; the walk's inside is drawn in shadow); tower: shaft 7.8 m
 *   wide to 13.8, corbels to 15.9, gallery (9.4 m) to 17.9, skirt to 19.3,
 *   round stage (6.0 m) to 24.1, crown to 26, cone to 32, finial to 34.8
 *   (on review drawn slimmer and taller: shaft 6.6 m to 15, gallery 8.4 m to
 *   19.2, round stage 5.1 m to 25.4, crown and merlons to 27.4, spire to
 *   34.4, vane to 36.7);
 *   arch crowns about 4 m with a rise of a seventh of the span.
 * - Estimated: the arcade's bay pitch (3.6 m) and wall thickness; the end
 *   turrets' spires and the clock gables' outline; the cutwater lengths.
 * - Invented/simplified: the coats of arms, terracotta ornament and glazed
 *   brick bands are left out; the diaper frieze is a plain band; the
 *   finials stand in for the bear and eagle vanes.
 * - Look-only references: none.
 * - Doubts: the map's roadway height (no lidar in Germany; the model is
 *   built to 5.0 m, the outline says 6); the road-side end turrets.
 *
 * Night: the brick and granite are floodlit (`_FLOODLIGHT`), the arcade's
 * vault glows (`lamp`-free; it is lit by its own lamps, drawn as `window`
 * on the ceiling).
 */
import clipping from 'polygon-clipping' // a declared dependency
import { triangulate } from './chi-aon-center'
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { mat } from './berlin-konzerthaus'

export const ID = 'berlin-oberbaum-bridge'
export const BEARING = 38.5

type XY = [number, number]
const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

// ───────────────────────────── shared kit ─────────────────────────────────

/**
 * Triangles covering an outline (s, z) minus its holes. The committed
 * ear-clipper takes simple rings only, so the region is cut into vertical
 * slabs at every hole's centre (polygon-clipping): each hole becomes two
 * notches in the slabs' edges and every piece is a simple ring.
 */
export function polyTris(outline: XY[], holes: XY[][] = []): [XY, XY, XY][] {
  const ccwR = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)
  const close = (r: XY[]) => [...r, r[0]].map(([a, b]) => [a, b] as [number, number])
  const out: [XY, XY, XY][] = []
  const emit = (r: XY[]) => {
    const q = ccwR(r)
    for (const [a, b, c] of triangulate(q)) out.push([q[a], q[b], q[c]])
  }
  if (!holes.length) { emit(outline); return out }
  const xs = outline.map((q) => q[0]), zs = outline.map((q) => q[1])
  const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, z0 = Math.min(...zs) - 1, z1 = Math.max(...zs) + 1
  // As few cut lines as stab every hole (greedy interval stabbing), each
  // well inside the holes it crosses.
  const spans = holes.map((h) => {
    const hx = h.map((q) => q[0]), lo = Math.min(...hx), hi = Math.max(...hx), m = (hi - lo) * 0.2
    return [lo + m, hi - m] as [number, number]
  }).sort((a, b) => a[1] - b[1])
  const cuts: number[] = []
  for (const [lo, hi] of spans) if (!cuts.length || cuts[cuts.length - 1] < lo) cuts.push(hi)
  const edges = [x0, ...cuts, x1]
  const H = holes.map((h) => [close(h)])
  for (let i = 0; i < edges.length - 1; i++) {
    if (edges[i + 1] - edges[i] < 1e-6) continue
    const slab: [number, number][] = [[edges[i], z0], [edges[i + 1], z0], [edges[i + 1], z1], [edges[i], z1], [edges[i], z0]]
    let piece = clipping.intersection([close(outline)], [slab])
    const near = H.filter((h) => h[0].some(([x]) => x >= edges[i] - 1e-6 && x <= edges[i + 1] + 1e-6))
    if (near.length) piece = clipping.difference(piece, ...(near as any))
    for (const poly of piece) {
      const ring = poly[0].slice(0, -1) as XY[]
      if (poly.length > 1) {
        // A hole left whole inside the slab (one sharing a centre line): split again.
        for (const [a, b, c] of polyTris(ring, poly.slice(1).map((h) => h.slice(0, -1) as XY[]))) out.push([a, b, c])
      } else emit(ring)
    }
  }
  return out
}

/** A flat triangle wound to face `n`. */
export function ftri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}
/** A flat quad wound to face `n`. */
export function fquad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  ftri(p, a, b, c, n)
  ftri(p, a, c, d, n)
}

/**
 * A wall slab in a vertical plane: an outline in (s, z) with holes cut
 * clean through (openings, arches), `t` thick. `at(s, w, z)` maps plane
 * coordinates to the model (w across the wall, -t/2..t/2) and `out` is the
 * +w direction. Both faces, the outline's edges (all but those listed in
 * `skipEdge`) and every hole's reveal are drawn.
 */
export function wallPlate(p: Part, outline: XY[], holes: XY[][], t: number, at: (s: number, w: number, z: number) => V3, out: V3, o: { skipEdge?: (a: XY, b: XY) => boolean; faces?: [boolean, boolean]; reveal?: Part } = {}) {
  const ring = area2(outline) < 0 ? [...outline].reverse() : outline
  const hs = holes.map((h) => (area2(h) > 0 ? [...h].reverse() : h))
  const tris = polyTris(ring, hs)
  const faces = o.faces ?? [true, true]
  for (const side of [1, -1]) {
    if (!faces[side > 0 ? 0 : 1]) continue
    const n = scl(out, side), w = (side * t) / 2
    for (const [a, b, c] of tris) ftri(p, at(a[0], w, a[1]), at(b[0], w, b[1]), at(c[0], w, c[1]), n)
  }
  const edges = (r: XY[], inward: boolean, dst: Part) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (!inward && o.skipEdge?.(a, b)) continue
      // In-plane normal of the edge, pointing out of the solid.
      const e: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(e[0], e[1]) || 1
      // ring is CCW (solid on the left): outward is the right-hand normal.
      // Holes run clockwise, so the same right-hand normal points into the hole.
      const ns: XY = [e[1] / L, -e[0] / L]
      const n = nrm(subv(at(ns[0], 0, ns[1]), at(0, 0, 0)))
      fquad(dst, at(a[0], -t / 2, a[1]), at(b[0], -t / 2, b[1]), at(b[0], t / 2, b[1]), at(a[0], t / 2, a[1]), n)
    }
  }
  edges(ring, false, p)
  for (const h of hs) edges(h, true, o.reveal ?? p)
}

/** A box between two corners, its rings counter-clockwise; no bottom unless asked. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false, top = true) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
  if (bottom) p.cap(r(z0), false)
}
/** A prism over a convex counter-clockwise ring. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const r = (z: number): V3[] => ring.map(([x, y]) => [x, y, z])
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
}
/** A round or polygonal frustum; `phase` turns the corners. */
export function cone(p: Part, cx: number, cy: number, r0: number, r1: number, z0: number, z1: number, n: number, phase = 0, top = true, smooth = true) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const a = phase + (i * TAU) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  })
  if (smooth) {
    const slope = Math.atan2(r0 - r1, z1 - z0)
    for (let i = 0; i < n; i++) {
      const a0 = phase + (i * TAU) / n, a1 = phase + ((i + 1) * TAU) / n
      const N = (a: number): V3 => [Math.cos(a) * Math.cos(slope), Math.sin(a) * Math.cos(slope), Math.sin(slope)]
      const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      if (r1 > 1e-4) {
        p.tri(P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
        p.tri(P(r0, a0, z0), P(r1, a1, z1), P(r1, a0, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
      } else p.tri(P(r0, a0, z0), P(r0, a1, z0), P(0, 0, z1), undefined, undefined, undefined, [N(a0), N(a1), N((a0 + a1) / 2)])
    }
  } else p.loft([ring(r0, z0), ring(Math.max(r1, 1e-4), z1)])
  if (top && r1 > 1e-4) p.cap(ring(r1, z1), true)
}

/** A square-section member from A to B, `w` wide, faces turned to `up`. */
export function beam(p: Part, A: V3, B: V3, w: number, up: V3 = [0, 0, 1], caps = true, h = w) {
  const d = nrm(subv(B, A))
  let u = crs(d, up)
  if (Math.hypot(...u) < 1e-3) u = crs(d, [1, 0, 0])
  u = scl(nrm(u), w / 2)
  const v = scl(nrm(crs(u, d)), h / 2)
  const ring = (c: V3): V3[] => [add(add(c, u), v), add(subv(c, u), v), subv(subv(c, u), v), subv(add(c, u), v)]
  const a = ring(A), b = ring(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    fquad(p, a[i], a[j], b[j], b[i], nrm(add(subv(a[i], A), subv(a[j], A))))
  }
  if (caps) {
    fquad(p, a[0], a[1], a[2], a[3], scl(d, -1))
    fquad(p, b[0], b[1], b[2], b[3], d)
  }
}

/** A pointed (two-centred) arch opening: jambs from z0, springing zs, `seg` points a side. */
export function pointedArch(s0: number, s1: number, z0: number, zs: number, seg: number, sharp = 0.72): XY[] {
  const w = s1 - s0, R = sharp * w, mid = (s0 + s1) / 2
  // Each side's arc is centred on the opposite side of the opening.
  const cr = s1 - R, cl = s0 + R
  const aR = Math.acos((mid - cr) / R)
  const pts: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  for (let i = 1; i < seg; i++) {
    const a = (aR * i) / seg
    pts.push([cr + R * Math.cos(a), zs + R * Math.sin(a)])
  }
  pts.push([mid, zs + R * Math.sin(aR)])
  for (let i = seg - 1; i >= 1; i--) {
    const a = (aR * i) / seg
    pts.push([cl - R * Math.cos(a), zs + R * Math.sin(a)])
  }
  pts.push([s0, zs])
  return pts
}

/** A segmental arch's soffit curve from s0 to s1, springing zs, rise r. */
function segArc(s0: number, s1: number, zs: number, rise: number, seg: number): XY[] {
  const L = (s1 - s0) / 2, R = (L * L + rise * rise) / (2 * rise), cz = zs + rise - R, cs = (s0 + s1) / 2
  const a0 = Math.asin(L / R)
  return Array.from({ length: seg + 1 }, (_, i) => {
    const a = -a0 + (2 * a0 * i) / seg
    return [cs + R * Math.sin(a), cz + R * Math.cos(a)] as XY
  })
}

// ───────────────────────────── the bridge ─────────────────────────────────

// Across: the downstream face, the arcade's two walls, the upstream face.
const X_NW = -15.0, X_SE = 14.0
const X_AR0 = 4.4, X_AR1 = 13.5, T_AR = 0.8
// Heights (see header).
const Z_DECK = 4.75, Z_WALK = 5.0, Z_FRIEZE = 10.4, Z_RAIL = 10.2, Z_MERLON = 11.6
const Y_END = 75
/** Piers: centre and width along the bridge; the towers' piers are the third. */
const PIERS = [-61, -40.3, -14.6, 14.6, 40.3, 61].map((y, i) => ({ y, w: [4, 6, 7.5, 7.5, 6, 4][i] }))
const Y_ABUT = 70.5
/** The masonry spans: [y0, y1, rise]; the middle (steel) span stands apart. */
const SPANS: [number, number, number][] = [
  [-Y_ABUT, -63, 1.4], [-59, -43.3, 2.3], [-37.3, -18.35, 2.7],
  [18.35, 37.3, 2.7], [43.3, 59, 2.3], [63, Y_ABUT, 1.4],
]
const Y_MID = 10.85 // the middle span's clear half-width
const CROWN = 4.0 // arch soffit crown height
const TOWERS = [-14.6, 14.6]
const X_TOWER = 16.1

type Mats = { brick: Part; granite: Part; white: Part; metal: Part; roof: Part; lit: Part }

function lowerBridge(m: Mats, detail: boolean) {
  const seg = detail ? 16 : 6
  // Both river faces: the brick wall from the water to the deck, the arches
  // cut out of it, the middle span open under its slab.
  const outline: XY[] = [[-Y_END, 0]]
  for (const [y0, y1, rise] of SPANS.slice(0, 3)) {
    outline.push([y0, 0], ...segArc(y0, y1, CROWN - rise, rise, seg), [y1, 0])
  }
  outline.push([-Y_MID, 0], [-Y_MID, 3.6], [Y_MID, 3.6], [Y_MID, 0])
  for (const [y0, y1, rise] of SPANS.slice(3)) {
    outline.push([y0, 0], ...segArc(y0, y1, CROWN - rise, rise, seg), [y1, 0])
  }
  outline.push([Y_END, 0], [Y_END, Z_DECK], [-Y_END, Z_DECK])
  // The segment endpoints on z = 0 repeat; drop consecutive duplicates.
  const clean = outline.filter((q, i) => i === 0 || q[0] !== outline[i - 1][0] || q[1] !== outline[i - 1][1])
  for (const [x, sgn] of [[X_NW, -1], [X_SE, 1]] as [number, number][]) {
    // Only the outer face is seen; the inner face would sit inside the deck.
    wallPlate(m.brick, clean, [], 0.6, (s, w, z) => [x - sgn * 0.3 + sgn * w, s, z], [sgn, 0, 0], { faces: [true, false], skipEdge: () => true })
  }
  // Soffits (the barrel vaults) between the faces, granite voussoir rings on both faces.
  for (const [y0, y1, rise] of SPANS) {
    const arc = segArc(y0, y1, CROWN - rise, rise, seg)
    for (let i = 0; i < arc.length - 1; i++) {
      const a = arc[i], b = arc[i + 1]
      const n = nrm([0, b[1] - a[1], -(b[0] - a[0])])
      fquad(m.brick, [X_NW, a[0], a[1]], [X_SE, a[0], a[1]], [X_SE, b[0], b[1]], [X_NW, b[0], b[1]], n)
    }
    for (const [x, sgn] of [[X_NW, -1], [X_SE, 1]] as [number, number][]) {
      const ring = segArc(y0 - 0.0, y1 + 0.0, CROWN - rise, rise, seg)
      const outer = segArc(y0 - 0.9, y1 + 0.9, CROWN - rise - 0.25, rise + 1.15, seg)
      const vou: XY[] = [...outer, ...[...ring].reverse()]
      wallPlate(m.granite, vou, [], 0.3, (s, w, z) => [x + sgn * 0.15 + sgn * w, s, z], [sgn, 0, 0], { faces: [true, false], skipEdge: detail ? undefined : () => true })
    }
  }
  // Piers in granite, with pointed cutwaters on both faces.
  for (const { y, w } of PIERS) {
    const tower = TOWERS.includes(y)
    const zTop = 3.0
    // The pier up to the higher of its arches' springings, a little proud of the faces.
    const spring = Math.max(...SPANS.filter(([a, b]) => Math.abs(a - (y + w / 2)) < 0.6 || Math.abs(b - (y - w / 2)) < 0.6).map(([, , r]) => CROWN - r), CROWN - 2.7)
    box(m.granite, X_NW - 0.12, y - w / 2, X_SE + 0.12, y + w / 2, 0, spring)
    for (const [x, sgn, len] of [[X_NW, -1, 2.4], [X_SE, 1, tower ? 0 : 2.4]] as [number, number, number][]) {
      if (!len) continue
      const r: XY[] = [[x, y - w / 2], [x + sgn * len, y], [x, y + w / 2]]
      prism(m.granite, area2(r) < 0 ? [...r].reverse() : r, 0, zTop, false)
      // The cutwater's pyramidal cap.
      const apex: V3 = [x, y, zTop + 1.1]
      const rr = (area2(r) < 0 ? [...r].reverse() : r).map(([a, b]) => [a, b, zTop] as V3)
      for (let i = 0; i < rr.length; i++) {
        const A = rr[i], B = rr[(i + 1) % rr.length]
        const n = nrm(crs(subv(B, A), subv(apex, A)))
        ftri(m.granite, A, B, apex, n)
      }
    }
  }
  // The tower piers' upstream foot: a granite block out to x = 21.
  for (const y of TOWERS) box(m.granite, X_SE, y - 4.75, X_TOWER + 4.9, y + 4.75, 0, 4.1)
  // The deck slab under the road (0.25 m under it) and the soffit under the middle.
  box(m.granite, X_NW, -Y_END, X_AR0, Y_END, Z_DECK - 0.2, Z_DECK)
  // The middle span: a white slab for road and walk, its fascias.
  box(m.white, X_NW - 0.2, -Y_MID, X_SE, Y_MID, 3.6, Z_DECK, true, false)
  // Downstream parapet: granite coping on a brick wall, the railing over it.
  box(m.brick, X_NW, -Y_END, X_NW + 0.6, Y_END, Z_DECK, Z_WALK + 0.55)
  box(m.granite, X_NW - 0.08, -Y_END, X_NW + 0.68, Y_END, Z_WALK + 0.55, Z_WALK + 0.75)
  if (detail) {
    for (let y = -Y_END + 1; y <= Y_END - 1; y += 2.5) beam(m.metal, [X_NW + 0.3, y, Z_WALK + 0.75], [X_NW + 0.3, y, Z_WALK + 1.6], 0.07, [1, 0, 0], false)
    beam(m.metal, [X_NW + 0.3, -Y_END + 1, Z_WALK + 1.6], [X_NW + 0.3, Y_END - 1, Z_WALK + 1.6], 0.09, [1, 0, 0])
    beam(m.metal, [X_NW + 0.3, -Y_END + 1, Z_WALK + 1.2], [X_NW + 0.3, Y_END - 1, Z_WALK + 1.2], 0.05, [1, 0, 0])
  }
}

/**
 * The arcade between y0 and y1: the road wall and the river wall, each a
 * slab with its pointed arches cut through, the frieze, the merlons, the
 * walk's floor and the U-Bahn deck with its track bed on top.
 */
function arcade(m: Mats, y0: number, y1: number, detail: boolean, o: { riverSkip?: [number, number][]; high?: boolean } = {}) {
  const pitch = 3.6
  const n = Math.max(1, Math.round((y1 - y0) / pitch)), p = (y1 - y0) / n
  const seg = detail ? 6 : 2
  for (const [x, sgn] of [[X_AR0 + T_AR / 2, -1], [X_AR1 - T_AR / 2, 1]] as [number, number][]) {
    const top = o.high ? Z_FRIEZE + 1.6 : Z_FRIEZE
    const at = (s: number, w: number, z: number): V3 => [x + w, s, z]
    // Bay by bay: each bay a simple outline with its pointed arch notched up
    // from the floor, so no face has a hole; the arch's reveal drawn dark.
    for (let i = 0; i < n; i++) {
      const sl = y0 + i * p, sr = y0 + (i + 1) * p
      const s0 = sl + 0.33, s1 = sr - 0.33
      const open = !(sgn > 0 && o.riverSkip?.some(([a2, b2]) => s1 > a2 && s0 < b2))
      if (!open) {
        wallPlate(m.brick, [[sl, Z_DECK], [sr, Z_DECK], [sr, top], [sl, top]], [], T_AR, at, [1, 0, 0], { skipEdge: (q, r) => q[1] !== top || r[1] !== top })
        continue
      }
      const arch = pointedArch(s0, s1, Z_DECK, 7.4, seg) // [s0,z0],[s1,z0],[s1,zs],...,[s0,zs]
      const notch = arch.slice(2).reverse() // up the left jamb... to the right jamb, top-down reversed
      const ring: XY[] = [[sl, Z_DECK], [s0, Z_DECK], ...[...arch.slice(2)].reverse(), [s1, Z_DECK], [sr, Z_DECK], [sr, top], [sl, top]]
      void notch
      // The street-facing face in brick; the face inside the walk in shadow.
      wallPlate(m.brick, ring, [], T_AR, at, [1, 0, 0], { skipEdge: (q, r) => !(q[1] === top && r[1] === top), faces: sgn > 0 ? [true, false] : [false, true] })
      wallPlate(m.roof, ring, [], T_AR, at, [1, 0, 0], { skipEdge: () => true, faces: sgn > 0 ? [false, true] : [true, false] })
      // The reveal round the arch (jambs and soffit), facing into the opening.
      const path: XY[] = [[s0, Z_DECK], ...[...arch.slice(2)].reverse(), [s1, Z_DECK]]
      for (let k = 0; k < path.length - 1; k++) {
        const A = path[k], B = path[k + 1]
        const e: XY = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(e[0], e[1]) || 1
        const nn: V3 = [0, e[1] / L, -e[0] / L] // right of the path: into the opening
        fquad(m.roof, at(A[0], -T_AR / 2, A[1]), at(B[0], -T_AR / 2, B[1]), at(B[0], T_AR / 2, B[1]), at(A[0], T_AR / 2, A[1]), nn)
      }
    }
    // Columns' granite capitals and bases: a band at the springing in detail.
    if (detail) {
      for (let i = 0; i <= n; i++) {
        const s = y0 + i * p
        if (i === 0 || i === n) continue
        box(m.granite, x - T_AR / 2 - 0.08, s - 0.4, x + T_AR / 2 + 0.08, s + 0.4, 7.2, 7.45)
        box(m.granite, x - T_AR / 2 - 0.08, s - 0.4, x + T_AR / 2 + 0.08, s + 0.4, Z_WALK, Z_WALK + 0.35)
      }
    }
    // The frieze band (a granite string course over the arches).
    box(m.granite, x - sgn * 0 - T_AR / 2 - 0.1, y0, x + T_AR / 2 + 0.1, y1, 9.75, 9.95, true)
    // Merlons on the parapet.
    const mp = detail ? 1.6 : 5.0, mw = detail ? 0.85 : 2.2
    const mn = Math.max(1, Math.round((y1 - y0) / mp)), mq = (y1 - y0) / mn
    const z0 = o.high ? Z_FRIEZE + 1.6 : Z_FRIEZE, z1 = o.high ? Z_MERLON + 1.9 : Z_MERLON
    box(m.brick, x - T_AR / 2, y0, x + T_AR / 2, y1, z0, z0 + 0.35)
    for (let i = 0; i < mn; i++) {
      const c = y0 + (i + 0.5) * mq
      box(m.brick, x - T_AR / 2, c - mw / 2, x + T_AR / 2, c + mw / 2, z0 + 0.35, z1)
    }
  }
  // The walk's floor and its vaulted ceiling (lit at night).
  box(m.lit, X_AR0 + T_AR, y0, X_AR1 - T_AR, y1, Z_DECK, Z_WALK)
  const ceil = 9.7
  fquad(m.lit, [X_AR0 + T_AR, y0, ceil], [X_AR0 + T_AR, y1, ceil], [X_AR1 - T_AR, y1, ceil], [X_AR1 - T_AR, y0, ceil], [0, 0, -1])
  // The U-Bahn deck: the track bed between the parapets, two tracks.
  box(m.granite, X_AR0 + T_AR, y0, X_AR1 - T_AR, y1, ceil, Z_RAIL, false)
  for (const xc of [7.0, 10.9]) for (const dx of [-0.72, 0.72]) {
    if (detail) box(m.metal, xc + dx - 0.04, y0, xc + dx + 0.04, y1, Z_RAIL, Z_RAIL + 0.16)
  }
  if (!detail) for (const xc of [7.0, 10.9]) box(m.metal, xc - 0.8, y0, xc + 0.8, y1, Z_RAIL, Z_RAIL + 0.06)
  // Railings in the river arches (green iron, as the photos show).
  if (detail) {
    beam(m.metal, [X_AR1 - T_AR / 2, y0 + 0.5, Z_WALK + 1.1], [X_AR1 - T_AR / 2, y1 - 0.5, Z_WALK + 1.1], 0.1, [1, 0, 0])
  }
}

/** A tower on the upstream pier at y. */
function tower(m: Mats, y: number, detail: boolean) {
  const x = X_TOWER, n = detail ? 24 : 10
  const h = 3.3 // half the shaft (slender: 6.6 m)
  const Z_SH = 15.0, Z_GAL0 = 16.2, Z_GAL1 = 19.2, Z_SK = 20.4, Z_CR = 25.4, Z_CR1 = 26.3, Z_MER = 27.4, Z_TIP = 34.4
  const RG = 4.2, RS = 2.55, RC = 2.95
  // The granite-faced shaft: granite to the arcade floor, brick above with
  // granite quoins, a tall pointed window on each free face.
  box(m.granite, x - h - 0.25, y - h - 0.25, x + h + 0.25, y + h + 0.25, 4.1, 6.0)
  box(m.brick, x - h, y - h, x + h, y + h, 6.0, Z_SH)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(m.granite, x + sx * h - 0.45, y + sy * h - 0.45, x + sx * h + 0.45, y + sy * h + 0.45, 6.0, Z_SH)
  for (const [nx, ny] of [[1, 0], [0, 1], [0, -1]]) {
    const win = pointedArch(-0.6, 0.6, 9.0, 12.2, detail ? 4 : 2)
    wallPlate(m.roof, win, [], 0.1, (s, w, z) => [x + nx * (h + 0.03) + ny * s + nx * w, y + ny * (h + 0.03) - nx * s + ny * w, z], [nx, ny, 0], { faces: [true, false] })
  }
  const oct = (r: number) => Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI / 8 + (i * TAU) / 8
    return [x + (r / Math.cos(Math.PI / 8)) * Math.cos(a), y + (r / Math.cos(Math.PI / 8)) * Math.sin(a)] as XY
  })
  const loftOct = (p: Part, r0: number, r1: number, z0: number, z1: number, top = false) => {
    const a = oct(r0), b = oct(r1)
    p.loft([a.map(([u, v]) => [u, v, z0] as V3), b.map(([u, v]) => [u, v, z1] as V3)])
    if (top) p.cap(b.map(([u, v]) => [u, v, z1] as V3), true)
  }
  // The corbel table stepping out to the gallery, with machicolation brackets.
  loftOct(m.granite, h, h + 0.35, Z_SH, Z_SH + 0.3)
  {
    const a = oct(h + 0.35), b = oct(RG)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      fquad(m.brick, [a[i][0], a[i][1], Z_SH + 0.3], [a[j][0], a[j][1], Z_SH + 0.3], [b[j][0], b[j][1], Z_GAL0], [b[i][0], b[i][1], Z_GAL0], nrm([((a[i][0] + a[j][0]) / 2 - x), ((a[i][1] + a[j][1]) / 2 - y), -0.6]))
    }
    const nb = detail ? 24 : 0
    for (let i = 0; i < nb; i++) {
      const ang = (i * TAU) / nb + TAU / 16, r = RG - 0.15
      beam(m.granite, [x + r * Math.cos(ang), y + r * Math.sin(ang), Z_SH + 0.1], [x + r * Math.cos(ang), y + r * Math.sin(ang), Z_GAL0 + 0.3], 0.4, [Math.cos(ang), Math.sin(ang), 0])
    }
  }
  // The gallery, its round windows, a crenellated parapet round its eave.
  loftOct(m.brick, RG, RG, Z_GAL0, Z_GAL1)
  for (let i = 0; i < 8; i++) {
    const a0 = oct(RG)[i], a1 = oct(RG)[(i + 1) % 8]
    const c: XY = [(a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2]
    const nx = (c[0] - x) / RG, ny = (c[1] - y) / RG, tx = -ny, ty = nx
    for (const off of detail ? [-0.9, 0.9] : [0]) {
      const rr = 0.36, k = detail ? 10 : 6
      const circ: XY[] = Array.from({ length: k }, (_, j) => [off + rr * Math.cos((j * TAU) / k), 17.6 + rr * Math.sin((j * TAU) / k)] as XY)
      wallPlate(m.roof, circ, [], 0.06, (s, w, z) => [c[0] + nx * (0.03 + w) + tx * s, c[1] + ny * (0.03 + w) + ty * s, z], [nx, ny, 0], { faces: [true, false] })
    }
  }
  // The skirt roof up to the round stage.
  {
    const a = oct(RG + 0.3), z0 = Z_GAL1, z1 = Z_SK
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const A: V3 = [a[i][0], a[i][1], z0], B: V3 = [a[j][0], a[j][1], z0]
      const ai = Math.PI / 8 + (i * TAU) / 8, aj = Math.PI / 8 + (j * TAU) / 8
      const C: V3 = [x + RS * Math.cos(aj), y + RS * Math.sin(aj), z1], D: V3 = [x + RS * Math.cos(ai), y + RS * Math.sin(ai), z1]
      fquad(m.roof, A, B, C, D, nrm(crs(subv(B, A), subv(D, A))))
    }
    const b = oct(RG)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      fquad(m.roof, [b[i][0], b[i][1], z0], [b[j][0], b[j][1], z0], [a[j][0], a[j][1], z0], [a[i][0], a[i][1], z0], [0, 0, -1])
    }
  }
  // Round stage, the corbelled crown and its bold merlons, the tall spire, finial.
  cone(m.brick, x, y, RS, RS, Z_GAL1, Z_CR, n)
  cone(m.brick, x, y, RS, RC, Z_CR, Z_CR + 0.4, n, 0, false)
  cone(m.brick, x, y, RC, RC, Z_CR + 0.4, Z_CR1, n, 0, true)
  const kn = detail ? 12 : 8
  for (let i = 0; i < kn; i++) {
    const a = (i * TAU) / kn, c: V3 = [x + (RC - 0.25) * Math.cos(a), y + (RC - 0.25) * Math.sin(a), Z_CR1]
    beam(m.brick, c, [c[0], c[1], Z_MER], 1.0, [Math.cos(a), Math.sin(a), 0], true, 0.5)
  }
  cone(m.roof, x, y, 2.3, 0, Z_CR1, Z_TIP, n)
  cone(m.metal, x, y, 0.16, 0.1, Z_TIP - 0.3, Z_TIP + 1.0, 6, 0, true, false)
  // The vane (a bear on one tower, an eagle on the other): a flat silhouette.
  wallPlate(m.metal, [[-0.5, Z_TIP + 1.0], [0.5, Z_TIP + 1.0], [0.65, Z_TIP + 1.6], [0.2, Z_TIP + 2.3], [-0.3, Z_TIP + 2.2], [-0.6, Z_TIP + 1.5]], [], 0.12, (s, w, z) => [x + w, y + s, z], [1, 0, 0])
}

/** An end turret on the arcade's river corner: square shaft, brick spire. */
function turret(m: Mats, x: number, y: number, detail: boolean) {
  box(m.brick, x - 1.6, y - 1.6, x + 1.6, y + 1.6, Z_DECK, 14.0)
  cone(m.roof, x, y, 1.75, 0, 14.0, 18.0, 4, Math.PI / 4, false, false)
  if (detail) cone(m.metal, x, y, 0.08, 0.04, 18.0, 19.0, 4)
}

/** The clock gable over a pier on the river wall. */
function clockGable(m: Mats, y: number, detail: boolean) {
  const x = X_AR1 + 0.3
  wallPlate(m.brick, [[y - 2.6, Z_FRIEZE], [y + 2.6, Z_FRIEZE], [y + 2.6, 13.0], [y + 1.5, 13.0], [y + 1.5, 14.0], [y, 15.2], [y - 1.5, 14.0], [y - 1.5, 13.0], [y - 2.6, 13.0]], [], 1.2, (s, w, z) => [x + w, s, z], [1, 0, 0])
  // The clock face.
  const k = detail ? 14 : 8
  const circ: XY[] = Array.from({ length: k }, (_, j) => [y + 0.6 * Math.cos((j * TAU) / k), 12.0 + 0.6 * Math.sin((j * TAU) / k)] as XY)
  wallPlate(m.white, circ, [], 0.06, (s, w, z) => [x + 0.63 + w, s, z], [1, 0, 0], { faces: [true, false] })
  for (const dy of [-2.6, 2.6, 0]) {
    if (dy) box(m.brick, x - 0.3, y + dy - 0.4, x + 0.9, y + dy + 0.4, 12.8, 14.4)
    cone(m.roof, x + 0.3, y + dy, 0.55, 0, dy ? 14.4 : 15.1, dy ? 15.8 : 16.2, 4, Math.PI / 4, false, false)
  }
}

/** Calatrava's middle span for the U-Bahn: a white steel deck arch. */
function middleSpan(m: Mats, detail: boolean) {
  const seg = detail ? 16 : 6
  // The deck.
  box(m.white, X_AR0 + 0.3, -Y_MID - 0.5, X_AR1 - 0.3, Y_MID + 0.5, 9.4, Z_RAIL, true, false)
  box(m.granite, X_AR0 + 1.0, -Y_MID - 0.5, X_AR1 - 1.0, Y_MID + 0.5, Z_RAIL - 0.05, Z_RAIL)
  for (const xc of [7.0, 10.9]) {
    if (detail) for (const dx of [-0.72, 0.72]) box(m.metal, xc + dx - 0.04, -Y_MID - 0.5, xc + dx + 0.04, Y_MID + 0.5, Z_RAIL, Z_RAIL + 0.16)
    else box(m.metal, xc - 0.8, -Y_MID - 0.5, xc + 0.8, Y_MID + 0.5, Z_RAIL, Z_RAIL + 0.06)
  }
  // The arch ribs, one under each side of the deck, springing from the piers.
  const arc = segArc(-Y_MID, Y_MID, 5.9, 3.4, seg)
  for (const xr of [X_AR0 + 0.9, X_AR1 - 0.9]) {
    for (let i = 0; i < arc.length - 1; i++) beam(m.white, [xr, arc[i][0], arc[i][1]], [xr, arc[i + 1][0], arc[i + 1][1]], 0.7, [1, 0, 0], i === 0 || i === arc.length - 2, 0.7)
    // Posts from the arch to the deck.
    for (let i = 2; i < arc.length - 2; i += detail ? 1 : 2) beam(m.white, [xr, arc[i][0], arc[i][1]], [xr, arc[i][0], 9.4], 0.25, [1, 0, 0], false)
  }
  // Parapets and railings along the deck.
  for (const xr of [X_AR0 + 0.3, X_AR1 - 0.3]) {
    box(m.white, xr - 0.15, -Y_MID - 0.5, xr + 0.15, Y_MID + 0.5, Z_RAIL, Z_RAIL + 0.5)
    if (detail) beam(m.metal, [xr, -Y_MID, Z_RAIL + 1.1], [xr, Y_MID, Z_RAIL + 1.1], 0.07, [1, 0, 0])
  }
  // The walk across the middle span on the slab: a white railing on the river side.
  box(m.white, X_SE - 0.3, -Y_MID, X_SE, Y_MID, Z_DECK, Z_WALK + 0.9)
}

function build(detail: boolean): Mats {
  const m: Mats = { brick: new Part(), granite: new Part(), white: new Part(), metal: new Part(), roof: new Part(), lit: new Part() }
  lowerBridge(m, detail)
  // Arcade runs: the south half, the north half, each from its end to its
  // tower; the end blocks between the turrets stand higher.
  const yT = 14.6 - 3.75
  arcade(m, -Y_END + 1.4, -60.5, detail, { high: true })
  arcade(m, -60.5, -yT, detail, { riverSkip: [[-18.6, -10]] })
  arcade(m, yT, 60.5, detail, { riverSkip: [[10, 18.6]] })
  arcade(m, 60.5, Y_END - 1.4, detail, { high: true })
  middleSpan(m, detail)
  for (const y of TOWERS) tower(m, y, detail)
  for (const y of [-Y_END + 1.4, -60.5, 60.5, Y_END - 1.4]) turret(m, X_AR1 - 0.5, y, detail)
  for (const y of [-40.3, 40.3]) clockGable(m, y, detail)
  return m
}

function write(detail: boolean) {
  const m = build(detail)
  // Floodlit from the banks and the piers: the faces and the towers.
  const flood = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.8)
  writeModel('Oberbaumbrücke', ID, [
    { part: m.brick, material: { ...mat('oberbaum-brick', 0xc06a48), floodlight: flood } },
    { part: m.granite, material: { ...mat('oberbaum-granite', 0xaaa59c), floodlight: flood } },
    { part: m.white, material: mat('trim', 0xeceae4) },
    { part: m.metal, material: mat('metal', 0x5b6660) },
    { part: m.roof, material: mat('roof', 0x8a4a3c) },
    { part: m.lit, material: mat('window', 0x6a5448, 0.6) },
  ], { bearing: BEARING, osm: 'way/288514442', height: 34.8 }, detail ? 40000 : 6500, detail ? `${ID}.detail` : ID)
}

if (import.meta.main) {
  write(false)
  write(true)
}
