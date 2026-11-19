/**
 * Berliner Philharmonie (Hans Scharoun, 1960-1963; gold cladding 1979-1981),
 * Herbert-von-Karajan-Straße 1, Berlin-Tiergarten: original procedural
 * geometry, CC0-1.0.
 * bun generators/berlin-philharmonie.ts
 *
 * Also exports small helpers (upTri, outQuad, ring prisms, window bands,
 * mat) used by berlin-sony-center.ts, berlin-kollhoff-tower.ts and
 * berlin-neue-nationalgalerie.ts: merge this generator first.
 *
 * Map frame, BEARING 0: +x east, +y north, z up, metres. z = 0 the forecourt
 * on Herbert-von-Karajan-Straße (Mapterhorn: the site is flat to about 1 m).
 * Origin = the area centroid of the outer ring of OSM relation/3626485,
 * 13.369695 52.509986.
 *
 * What makes it the Philharmonie, and how each is drawn
 * - The tent: a concave, silver-grey metal roof over the irregular
 *   pentagon of the hall, rising to a central apex over the orchestra
 *   (Uhlmann's "Phoenix" on top) and sweeping up again at its corners, the
 *   edges sagging between them. Drawn as a real 3D fan from the apex with
 *   concave radial profiles and sagging edge curves, a thin turned-down rim.
 * - The gold walls (gold-anodised aluminium panels): folded planes under
 *   the roof edge, each side broken inward at its middle, as the north
 *   front on Tiergartenstraße shows (two planes meeting in a shallow V).
 * - The white low base of foyers and terraces round the hall, with the
 *   window bands, the glass sloped skylights of the west foyer and the
 *   gold stair blocks with portholes; the slim white shaft at the
 *   south-east corner.
 *
 * Sources
 * - OSM relation/3626485 (outline: outer way/22990120, inner courtyard
 *   way/271700932; wikidata Q32653910) and its 80 building:part ways
 *   (way/13840030-38, way/271700913-26, way/305204119-162, way/305425313-469),
 *   which give the plan of the hall (gold parts 19-34 m), the roof facet
 *   heights (apex 32, upturned south-east corner 31-34) and the base tiers
 *   (2.7-11 m). (c) OpenStreetMap contributors, ODbL.
 * - de.wikipedia "Berliner Philharmonie" (gold anodised aluminium panels
 *   1979-1981, Phoenix by Hans Uhlmann, Kammermusiksaal 1984-1987 as a
 *   separate, connected building).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Philharmonie und Kammermusiksaal Berlin - von oben 2023-1797.jpg" and
 *     "... von oben.jpg", Raimond Spekking, CC BY-SA 4.0 (from the
 *     south-east, from the Kollhoff tower: roof, corners, walls),
 *     https://commons.wikimedia.org/wiki/File:Philharmonie_und_Kammermusiksaal_Berlin_-_von_oben_2023-1797.jpg
 *   "Berliner Philharmonie building seen from Reichstag building.jpg",
 *     Yair Haklai, CC BY-SA 4.0 (from the north-north-east: roof, apex),
 *   "Berliner Philharmonie Tiergartenstraße Berlin.jpg", Singlespeedfahrer,
 *     CC0 (the north front: the V of two gold planes, the Phoenix),
 *   "Philharmonie, Berlin, 170518, ako.jpg", Ansgar Koreng, CC BY-SA 4.0
 *     (south-east forecourt, dusk: base, stairs, gold blocks),
 *   "Berliner Philharmonie From Street 2023.jpg", Jonathan Platteau,
 *     CC BY-SA 4.0 (the east front on Herbert-von-Karajan-Straße),
 *   "Berliner Philharmonie, main building (1).jpg", Joseolgon, CC BY-SA 4.0;
 *   "20220812 Berliner Philharmonie.jpg", Flocci Nivis, CC BY 4.0 (from the
 *     south-west);
 *   "Berliner Philharmonie 2019-10-19 01.jpg", Leonhard Lenz, CC0;
 *   "Berlin - Berliner Philharmonie (3).jpg", Fred Romero, CC BY 2.0;
 *   "Berliner Philharmonie.nightshot.JPG", De-okin, CC BY-SA 3.0 (night).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: the outline, the hall's plan (convex hull of the gold parts
 *   of 19 m or more, simplified to eight corners), the base heights (6.5 m
 *   terraces, 11 m west foyer), the apex (32 m) and the south-east corner
 *   (34 m).
 * - Estimated from the photos: the other corner heights (22-29 m), the sag
 *   of the roof edges (2.5 m) and of the roof between apex and edge
 *   (1.8 m), the inward fold of each wall (1.6-2.4 m), the Phoenix (5 m
 *   span), window bands and portholes.
 * - Not modelled: the courtyard (inner ring, 118 m^2) is roofed over at the
 *   base height; the Kammermusiksaal (way/305425477) is a separate OSM
 *   building, joined by a corridor, and is left to the map.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { welded, ccw, ringLoft, ringBand, type XY } from './berlin-kit'
import { earcut } from './berlin-chancellery'

export const BEARING = 0
export type Q = { detail: boolean; n: number }
export const LOW: Q = { detail: false, n: 6 }
export const HIGH: Q = { detail: true, n: 14 }

// ---------------------------------------------------------------------------
// Shared helpers (also used by the other Kulturforum / Potsdamer Platz models)
// ---------------------------------------------------------------------------

export function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

/** A triangle wound so its normal has the sign `up` in z (true = facing up). */
export function upTri(p: Part, a: V3, b: V3, c: V3, up = true) {
  const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  if ((nz >= 0) === up) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A quad wound to face away from `inside`. */
export function outQuad(p: Part, a: V3, b: V3, c: V3, d: V3, inside: V3) {
  const n = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const m = [(a[0] + c[0]) / 2 - inside[0], (a[1] + c[1]) / 2 - inside[1], (a[2] + c[2]) / 2 - inside[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A prism over a simple polygon (any winding): walls into `wall`, top into `top`, optional bottom. */
export function polyPrism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bottom = false) {
  const c = ccw(r)
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earcut(c)) {
    if (top) top.tri([c[i][0], c[i][1], z1], [c[j][0], c[j][1], z1], [c[k][0], c[k][1], z1])
    if (bottom) (top ?? wall).tri([c[i][0], c[i][1], z0], [c[k][0], c[k][1], z0], [c[j][0], c[j][1], z0])
  }
}

/** A flat panel on the outside of a ccw ring's edge a→b, from s0 to s1 metres along it, d proud. */
export function edgePanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}

/** A round porthole (flat disc) on the outside of a ccw ring edge. */
export function edgeDisc(p: Part, a: XY, b: XY, s: number, z: number, r: number, n = 10, d = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux
  const P = (u: number, v: number): V3 => [a[0] + ux * (s + u) + nx * d, a[1] + uy * (s + u) + ny * d, z + v]
  for (let k = 0; k < n; k++) {
    const t0 = (k / n) * Math.PI * 2, t1 = ((k + 1) / n) * Math.PI * 2
    p.tri(P(0, 0), P(r * Math.cos(t0), r * Math.sin(t0)), P(r * Math.cos(t1), r * Math.sin(t1)))
  }
}

/** Window bands on every edge of a ccw ring longer than `minLen`, leaving piers at the ends. */
export function ringBands(p: Part, r: XY[], bands: [number, number][], minLen = 6, pier = 1.5, share = 1) {
  const c = ccw(r)
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const w = (L - 2 * pier) * share, s0 = (L - w) / 2
    for (const [z0, z1] of bands) edgePanel(p, a, b, s0, s0 + w, z0, z1)
  }
}


/** Offset a ccw ring by d (negative = inward), with the mitre at sharp corners limited to 2|d|. */
function ringOffset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((v, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1 = [v[0] - a[0], v[1] - a[1]], e2 = [b[0] - v[0], b[1] - v[1]]
    const l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1
    const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
    const k = Math.max(0.5, 1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [v[0] + d * (n1[0] + n2[0]) / k, v[1] + d * (n1[1] + n2[1]) / k] as XY
  })
}

// ---------------------------------------------------------------------------
// The Philharmonie
// ---------------------------------------------------------------------------

/** OSM outer ring (way/22990120), in the model frame. */
const OUTLINE: XY[] = [[33.9, -45.7], [33.5, -45.6], [-12.3, -32.5], [-16.1, -32.3], [-20.4, -31.9], [-37.0, -29.8], [-44.8, -29.0], [-44.4, -23.6], [-43.7, -12.6], [-46.2, -11.0], [-51.6, -7.3], [-53.2, 3.8], [-56.8, 7.1], [-63.1, 6.4], [-59.6, 16.7], [-49.4, 20.9], [-49.2, 15.1], [-45.8, 12.0], [-43.4, 14.4], [-42.6, 15.3], [-38.9, 17.0], [-35.1, 20.1], [-11.8, 40.8], [2.3, 46.9], [7.5, 40.6], [11.7, 39.2], [14.3, 41.4], [15.9, 40.4], [27.9, 32.4], [41.8, 29.4], [48.9, 28.1], [49.3, 27.4], [49.3, 20.7], [41.3, 5.8], [40.2, -3.2], [47.0, -11.1], [45.8, -12.9], [43.4, -16.4], [41.3, -21.9], [40.7, -23.5], [38.6, -29.8], [42.4, -35.6], [35.8, -40.0]]

/** The hall's corners (ccw) with the roof-edge height at each; the apex. */
const HALL: { p: XY; z: number; fold: number }[] = [
  { p: [-20.5, -20.0], z: 26.0, fold: 1.6 }, // SW, upturned
  { p: [17.5, -29.5], z: 22.5, fold: 2.0 }, // S
  { p: [40.8, -22.6], z: 25.5, fold: 0.8 }, // SE (beside the stair shaft)
  { p: [45.5, -12.5], z: 27.0, fold: 0.6 }, // E
  { p: [41.0, -3.6], z: 32.0, fold: 2.4 }, // the east end of the ridge from the apex: the peak of the east front
  { p: [42.0, 29.0], z: 28.0, fold: 2.2 }, // NE, upturned
  { p: [15.5, 39.5], z: 22.5, fold: 1.4 }, // N (the lower north wing)
  { p: [-1.0, 25.0], z: 24.5, fold: 1.4 }, // NW
  { p: [-14.5, 7.5], z: 29.0, fold: 1.6 }, // W, upturned
]
/** The apex over the orchestra (OSM: the 32 m facets meet at 12.6, -3.9). */
const APEX: V3 = [12.6, -3.9, 32.5]
const ZB = 6.5 // the white base's terraces

export function build(Q: Q) {
  const white = new Part(), gold = new Part(), roof = new Part(), win = new Part(), glass = new Part(), dark = new Part()
  const n = Q.n, m = Q.detail ? 8 : 4

  // ===== The white base ======================================================
  // Two tiers: the ground storey over the whole outline, its roof a terrace with a
  // parapet; the foyer storey set back 2.5 m above it, with its own parapet; a canopy
  // over the east entrance.
  const Z1 = 3.6, LOWER = ccw(OUTLINE), UPPER = ringOffset(LOWER, -2.5)
  polyPrism(white, roof, LOWER, 0, Z1)
  ringLoft(white, LOWER, Z1, Z1 + 1.0)
  ringLoft(white, ringOffset(LOWER, -0.3), Z1, Z1 + 1.0, true)
  ringBand(white, ringOffset(LOWER, -0.3), LOWER, Z1 + 1.0, true)
  polyPrism(white, roof, UPPER, Z1, ZB)
  ringLoft(white, UPPER, ZB, ZB + 0.9)
  ringLoft(white, ringOffset(UPPER, -0.3), ZB, ZB + 0.9, true)
  ringBand(white, ringOffset(UPPER, -0.3), UPPER, ZB + 0.9, true)
  ringBands(win, LOWER, [[0.6, 3.0]], 9, 2.0, 0.7)
  ringBands(win, UPPER, [[4.0, 6.0]], 8, 1.5, 0.75)
  polyPrism(roof, roof, [[40.2, -3.2], [46.5, -9.0], [50.5, 5.5], [44.5, 8.0]], 6.4, 6.9, true)
  for (const [x, y] of [[49.6, 4.6], [46.8, -6.6]]) polyPrism(white, white, [[x - 0.25, y - 0.25], [x + 0.25, y - 0.25], [x + 0.25, y + 0.25], [x - 0.25, y + 0.25]], 0, 6.4)
  // The upper west foyer (11 m) with its sloped glass skylights rising to the hall.
  const FOYER_W: XY[] = [[-4.7, 20.2], [-14.1, 7.5], [-31.6, -1.3], [-10.8, 25.0]]
  const FOYER_SW: XY[] = [[-14.1, 7.5], [-31.6, -1.3], [-16.2, -2.8], [-15.5, 0.6]]
  for (const f of [FOYER_W, FOYER_SW]) {
    polyPrism(white, null, f, ZB, 8.0)
    const c = ccw(f)
    // A shed of glass from 8 m at the outer edge up to 11 m against the hall.
    const cx = APEX[0], cy = APEX[1]
    const d = c.map(([x, y]) => Math.hypot(x - cx, y - cy)), dmin = Math.min(...d), dmax = Math.max(...d)
    const zt = c.map((_, i) => 11 - 3 * (d[i] - dmin) / (dmax - dmin))
    for (let i = 0; i < c.length; i++) {
      const j = (i + 1) % c.length
      outQuad(white, [c[i][0], c[i][1], 8.0], [c[j][0], c[j][1], 8.0], [c[j][0], c[j][1], zt[j]], [c[i][0], c[i][1], zt[i]], [cx, cy, 8])
    }
    for (const [a, b, e] of earcut(c)) upTri(glass, [c[a][0], c[a][1], zt[a]], [c[b][0], c[b][1], zt[b]], [c[e][0], c[e][1], zt[e]])
  }
  // The gold stair block at the south-west corner of the hall (8-10 m), slanted window band.
  const SWB: XY[] = [[-8.4, -21.4], [-14.0, -25.8], [-18.8, -20.2], [-20.7, -18.0], [-16.9, -11.4], [-6.4, -16.1]]
  polyPrism(gold, roof, SWB, ZB, 10.0)
  ringBands(win, SWB, [[7.2, 9.2]], 5, 0.8, 0.85)

  // ===== The hall ============================================================
  const H = HALL.length
  const cen: XY = [HALL.reduce((s, c) => s + c.p[0], 0) / H, HALL.reduce((s, c) => s + c.p[1], 0) / H]
  // Edge samples: the folded plan and the sagging edge height.
  type S = { x: number; y: number; z: number; nx: number; ny: number; beak: number }
  const edge: S[] = []
  for (let i = 0; i < H; i++) {
    const A = HALL[i], B = HALL[(i + 1) % H]
    const L = Math.hypot(B.p[0] - A.p[0], B.p[1] - A.p[1])
    const ux = (B.p[0] - A.p[0]) / L, uy = (B.p[1] - A.p[1]) / L, nx = uy, ny = -ux
    const fold = Math.min(A.fold, B.fold) + 0.4
    const sag = Math.max(0, 0.08 * L * (1 - Math.abs(A.z - B.z) / 12))
    for (let k = 0; k < n; k++) {
      const t = k / n
      const inset = fold * (1 - Math.abs(2 * t - 1)) // V-fold: planar facets
      edge.push({
        x: A.p[0] + (B.p[0] - A.p[0]) * t - nx * inset,
        y: A.p[1] + (B.p[1] - A.p[1]) * t - ny * inset,
        z: A.z + (B.z - A.z) * t - sag * Math.sin(Math.PI * t),
        nx, ny,
        // Upturned corners (26 m or more) end in a projecting beak of the roof.
        beak: (t < 0.2 && A.z >= 26 ? (1 - t / 0.2) * (A.z - 24) / 6 : 0) + (t > 0.8 && B.z >= 26 ? ((t - 0.8) / 0.2) * (B.z - 24) / 6 : 0),
      })
    }
  }
  const E = edge.length
  const inside: V3 = [cen[0], cen[1], 15]
  // Gold walls from the base terraces to the roof edge.
  for (let i = 0; i < E; i++) {
    const a = edge[i], b = edge[(i + 1) % E]
    outQuad(gold, [a.x, a.y, ZB], [b.x, b.y, ZB], [b.x, b.y, b.z], [a.x, a.y, a.z], inside)
    // The panel relief: vertical ribs every 2.4 m, 0.3 m wide and 0.22 m proud, up to the roof edge.
    const L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L
    const nx = uy, ny = -ux, sgn = (nx * (a.x - cen[0]) + ny * (a.y - cen[1])) >= 0 ? 1 : -1
    const n0 = Math.max(1, Math.round(L / 2.4))
    for (let k = 0; k < n0; k++) {
      const t = (k + 0.5) / n0, sx = a.x + (b.x - a.x) * t, sy = a.y + (b.y - a.y) * t, zt = a.z + (b.z - a.z) * t - 0.4
      const w = 0.15, d = 0.22 * sgn
      const p0: V3 = [sx - ux * w, sy - uy * w, ZB], p1: V3 = [sx + ux * w, sy + uy * w, ZB]
      const q0: V3 = [p0[0] + nx * d, p0[1] + ny * d, ZB], q1: V3 = [p1[0] + nx * d, p1[1] + ny * d, ZB]
      const T = (p: V3): V3 => [p[0], p[1], zt]
      const ins: V3 = [sx - nx * d * 4, sy - ny * d * 4, (ZB + zt) / 2]
      outQuad(gold, q0, q1, T(q1), T(q0), ins)
      outQuad(gold, p0, q0, T(q0), T(p0), [sx + ux * 3, sy + uy * 3, (ZB + zt) / 2])
      outQuad(gold, q1, p1, T(p1), T(q1), [sx - ux * 3, sy - uy * 3, (ZB + zt) / 2])
      upTri(gold, T(p0), T(q0), T(q1)); upTri(gold, T(p0), T(q1), T(p1))
    }
  }
  // The roof: a fan from the apex, each ray sagging, with a 0.7 m overhang and a turned-down rim.
  const OV = 0.7, RIM = 0.6, SAGR = 2.6
  const ray = (e: S, t: number): V3 => {
    const x = APEX[0] + (e.x - APEX[0]) * t, y = APEX[1] + (e.y - APEX[1]) * t
    const z = APEX[2] + (e.z - APEX[2]) * t - SAGR * Math.min(1, (APEX[2] - e.z) / 5) * Math.sin(Math.PI * t)
    return [x, y, z]
  }
  const eave = (e: S): V3 => {
    // Push out along the averaged edge normal.
    const o = OV + 2.6 * e.beak
    return [e.x + e.nx * o, e.y + e.ny * o, e.z + 0.25 + 1.2 * e.beak]
  }
  for (let i = 0; i < E; i++) {
    const a = edge[i], b = edge[(i + 1) % E]
    let pa = APEX as V3, pb = APEX as V3
    for (let k = 1; k <= m; k++) {
      const t = k / m
      const qa = ray(a, t), qb = ray(b, t)
      if (k === 1) upTri(roof, APEX, qa, qb)
      else { upTri(roof, pa, qa, qb); upTri(roof, pa, qb, pb) }
      pa = qa; pb = qb
    }
    // Eave strip and the rim's outer face.
    const ea = eave(a), eb = eave(b)
    upTri(roof, [a.x, a.y, a.z], ea, eb); upTri(roof, [a.x, a.y, a.z], eb, [b.x, b.y, b.z])
    outQuad(roof, [ea[0], ea[1], ea[2] - RIM], [eb[0], eb[1], eb[2] - RIM], eb, ea, inside)
    // Soffit of the eave, facing down.
    upTri(roof, [a.x, a.y, a.z - RIM + 0.25], [eb[0], eb[1], eb[2] - RIM], [ea[0], ea[1], ea[2] - RIM], false)
    upTri(roof, [a.x, a.y, a.z - RIM + 0.25], [b.x, b.y, b.z - RIM + 0.25], [eb[0], eb[1], eb[2] - RIM], false)
  }

  // ===== Openings in the gold walls =========================================
  // Portholes and the tall glazed slots of the stair landings, from the photos.
  const portholes: [number, number, number[]][] = [
    // [corner index of edge start, fraction along, heights]
    [4, 0.12, [9.5, 12.0, 14.5]], [4, 0.2, [9.5, 12.0]], [7, 0.7, [10.5, 13.0, 15.5]], [7, 0.8, [10.5, 13.0]],
    [1, 0.85, [12.0, 14.5, 17.0]], [8, 0.25, [11.0, 13.5]], [5, 0.75, [11.0, 13.5, 16.0]],
  ]
  for (const [ci, f, zs] of portholes) {
    const k = Math.round(ci * n + f * n)
    const a = edge[k % E], b = edge[(k + 1) % E]
    const L = Math.hypot(b.x - a.x, b.y - a.y)
    for (const z of zs) edgeDisc(win, [a.x, a.y], [b.x, b.y], (f * n - Math.floor(f * n)) * L || L / 2, z, 0.75, Q.detail ? 12 : 8)
  }
  // The glazed band of the east foyer stair (east front) and the north front's ground glazing.
  for (const [ci, f0, f1, z0, z1] of [[4, 0.3, 0.55, 7.2, 9.6], [6, 0.15, 0.85, 7.2, 9.0], [0, 0.2, 0.7, 7.2, 9.4]] as number[][]) {
    for (let k = Math.round(ci * n + f0 * n); k < Math.round(ci * n + f1 * n); k++) {
      const a = edge[k % E], b = edge[(k + 1) % E]
      edgePanel(win, [a.x, a.y], [b.x, b.y], 0, Math.hypot(b.x - a.x, b.y - a.y), z0, z1)
    }
  }

  // ===== The south-east stair tower (white frame, glazed landings) ==========
  {
    const T: XY[] = [[33.5, -28.5], [39.2, -30.0], [40.6, -24.6], [34.9, -23.4]]
    polyPrism(white, roof, T, ZB, 21.0)
    ringBands(win, T, [[8.0, 10.6], [11.6, 14.2], [15.2, 17.8]], 3, 0.6, 1)
    // Projecting landing slab at 7 m.
    polyPrism(white, white, [[31.5, -30.0], [40.0, -32.2], [41.6, -25.5], [33.5, -23.0]], 7.0, 7.6, true)
  }
  // The projecting gold window bay on the east front.
  {
    const k = Math.round(4 * n + 0.6 * n), a = edge[k % E], b = edge[(k + 1) % E]
    const L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L
    const P = (s: number, d: number): XY => [a.x + ux * s + a.nx * d, a.y + uy * s + a.ny * d]
    polyPrism(gold, gold, [P(0, -0.5), P(L, -0.5), P(L, 2.2), P(0, 2.2)], 8.6, 12.4, true)
    edgePanel(win, P(0, 2.2), P(L, 2.2), 0.5, L - 0.5, 9.2, 11.8)
  }

  // ===== The south-east shaft and the Phoenix ===============================
  polyPrism(white, white, [[38.9, -23.1], [40.7, -23.6], [41.4, -21.6], [39.6, -21.0]], ZB, 34.5)
  // The Phoenix: a dark lantern on the apex and two swept wings.
  {
    const [x, y, z] = APEX
    const b = 1.6, h = 2.2
    const base: V3[] = [[x - b, y - b, z - 0.5], [x + b, y - b, z - 0.5], [x + b, y + b, z - 0.5], [x - b, y + b, z - 0.5]]
    for (let i = 0; i < 4; i++) dark.tri(base[i], base[(i + 1) % 4], [x, y, z + h])
    for (const s of [-1, 1]) {
      // Each wing a thin blade rising from the lantern's top, swept out and up.
      const r: V3 = [x, y, z + h - 0.2], tip: V3 = [x + s * 2.6, y + 0.4, z + h + 2.6], back: V3 = [x + s * 1.2, y - 0.3, z + h + 2.2]
      const t = 0.18
      const off = (p: V3, d: number): V3 => [p[0], p[1] + d, p[2]]
      outQuad(dark, off(r, -t), off(tip, -t), off(tip, t), off(r, t), [x, y - 5, z + h + 1])
      dark.tri(off(r, t), off(tip, t), off(back, t)); dark.tri(off(r, -t), off(back, -t), off(tip, -t))
      outQuad(dark, off(tip, -t), off(back, -t), off(back, t), off(tip, t), [x, y, z])
      outQuad(dark, off(back, -t), off(r, -t), off(r, t), off(back, t), [x + s * 3, y, z + h + 5])
    }
  }
  return { white, gold, roof, win, glass, dark }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Berliner Philharmonie', 'berlin-philharmonie', [
    { part: welded(b.white), material: mat('philharmonie-white', 0xece9e2) },
    { part: welded(b.gold), material: { ...mat('philharmonie-gold', 0xc99a3e, 0.6), floodlight: (p: V3) => (p[2] > 6.4 ? 1 : 0) } },
    { part: welded(b.roof, 12), material: mat('philharmonie-roof', 0xc4c8ca, 0.6) },
    { part: welded(b.win), material: mat('window', 0x64798a, 0.35) },
    { part: welded(b.glass), material: mat('glass', 0xa4c4d9, 0.24) },
    { part: welded(b.dark), material: mat('metal', 0x4f4c49, 0.6) },
  ], { bearing: BEARING, osm: 'relation/3626485', height: 34.5 }, maxTris, file)
}

if (import.meta.main) {
  write(LOW, 'berlin-philharmonie', 5000)
}
