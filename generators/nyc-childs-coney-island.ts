/**
 * Childs Restaurant Building on the Boardwalk, Coney Island (Dennison &
 * Hirons, 1923; restored 2015–17 as part of the Ford Amphitheater at Coney
 * Island) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-childs-coney-island.ts
 *
 * Map frame: x = east, y = north, z up, metres, built in the building's
 * own frame and placed at bearing 351.5 (its long walls along West 21st
 * Street). Anchor: area centroid of OSM way/248474798 (-73.9876078,
 * 40.5729067). The Boardwalk front is the south edge, which OSM draws 9.6°
 * off square to the side walls (it follows the Boardwalk); the model keeps
 * that slant.
 *
 * Only the Childs building. The 2016 amphitheatre (seating bowl and the
 * white arched truss canopy, OSM way/518329921, 54 m west) is a separate
 * structure on its own outline; it doesn't read as part of the Childs
 * front and would double the budget, so it is left to the map.
 *
 * Evidence
 * - OSM: way/248474798 (building=retail, 2101 Boardwalk West, height
 *   12.9), 30.3 × 76–80 m.
 * - Published (Wikipedia "Childs Restaurant (Boardwalk)"; NYC LPC
 *   designation 2003): 1923, Dennison & Hirons; "resort style with
 *   Spanish Revival influence", stucco with polychrome terracotta of
 *   Poseidon, ships and sea creatures; about 100 ft along the Boardwalk and
 *   250 ft along West 21st Street; three storeys and a roof garden.
 * - Photos (Wikimedia Commons):
 *   - "Childs' Restaurant (84184p).jpg", Rhododendrites, CC BY-SA 4.0
 *     (the restored Boardwalk front, square on; every front dimension
 *     below is scaled from it at 39.7 px/m on the 30.3 m front)
 *   - "Childs Restaurant CI jeh.jpg", Jim.henderson, CC0 (before the
 *     restoration: the same front, columns between the arches)
 *   - "Ford Amphitheater in Coney Island 003.jpg", Kidfly182, CC BY-SA 4.0;
 *     "… 022.jpg" and "… 026.jpg", Kidfly182, CC BY 4.0 (the corner
 *     pavilion's gable on two faces, its cartouche and oculus, the east
 *     wall with arched windows and roundels)
 *   - "CI Amphitheater 2016 March jeh.JPG", Jim.henderson, CC0 (the
 *     amphitheatre canopy, not modelled)
 * - Terrain (Mapterhorn): about 0.5 m at the north-east corner rising to
 *   2.5 m at the Boardwalk, so y = 0 is the lowest ground and the
 *   Boardwalk front starts 2.0 m up (FG); the walls run down to y = 0.
 *
 * From 84184p (heights above the Boardwalk): corner pavilions 5.3 m wide,
 * shoulders 11.7 m, gable crest 12.4 m, urns to 13.9 m; cartouche with a
 * round oculus (centre 9.1 m); side doors 2.0 × 3.5 m in teal surrounds;
 * five round arches, 3.2 m glazed openings springing at 3.9 m, archivolts
 * to 6.3 m; four roundels at 6.5 m; the terracotta frieze 7.4–8.3 m; the
 * roof-garden pergola on four piers to 10.2 m, its beam to 10.8 m.
 * Estimated: the pavilions' depth (5.5 m, as wide as they are, from 022),
 * the roof garden's depth (18 m; the pergola over its front 7 m), the main
 * roof (10.8 m, from 022's east wall against the pavilion), the east wall's
 * windows (from 022/003). The west and north walls are not photographed
 * in the restored state and are drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, circle, type XY } from './nyc-570-lexington'

const stucco = new Part(), poly = new Part(), trim = new Part(), win = new Part(), roof = new Part(), grille = new Part()

const FG = 2.0
const A: XY = [-15.0, -41.2], B: XY = [15.3, -36.1], C: XY = [15.3, 38.7], D: XY = [-15.0, 38.7]
const TW = 5.3, TD = 5.5, TERRACE = 7.0, GARDEN = 18
const SHOULDER = FG + 11.7, CREST = FG + 12.4, FRIEZE0 = FG + 7.4, FRIEZE1 = FG + 8.3, BODY = FG + 10.8

/** A frame along a wall a→b (counter-clockwise), d outward. */
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const xy = (s: number, d = 0): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
  return { L, at, xy, u, n }
}
type At = (s: number, z: number, d?: number) => V3
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
/** A flat convex polygon on a wall, given as (s, z) points counter-clockwise seen from outside. */
const flat = (p: Part, at: At, pts: [number, number][], d: number) => {
  for (let i = 1; i < pts.length - 1; i++) p.tri(at(pts[0][0], pts[0][1], d), at(pts[i][0], pts[i][1], d), at(pts[i + 1][0], pts[i + 1][1], d))
}
/** A disc on a wall. */
const disc = (p: Part, at: At, c: number, z: number, r: number, d: number, n = 12) =>
  flat(p, at, Array.from({ length: n }, (_, k) => [c + r * Math.cos((2 * Math.PI * k) / n), z + r * Math.sin((2 * Math.PI * k) / n)] as [number, number]), d)
/** A round-headed panel. */
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  const pts: [number, number][] = [[c, spring]]
  for (let k = 0; k <= 10; k++) pts.push([c + r * Math.cos((Math.PI * k) / 10), spring + r * Math.sin((Math.PI * k) / 10)])
  for (let k = 1; k < pts.length - 1; k++) p.tri(at(pts[0][0], pts[0][1], d), at(pts[k][0], pts[k][1], d), at(pts[k + 1][0], pts[k + 1][1], d))
}
/** A semicircular band (archivolt) of width t outside radius r. */
function archivolt(p: Part, at: At, c: number, r: number, t: number, spring: number, d: number) {
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    const P = (a: number, rr: number) => at(c + rr * Math.cos(a), spring + rr * Math.sin(a), d)
    p.quad(P(a1, r), P(a0, r), P(a0, r + t), P(a1, r + t))
  }
  rect(p, at, c - r - t, c - r, spring - 0.5, spring, d)
  rect(p, at, c + r, c + r + t, spring - 0.5, spring, d)
}
/** A box from (x0,y0,z0) to (x1,y1,z1), all faces. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  prism({ wall: p, win: null, roof: p, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel: 0 })
}

// ---------------------------------------------------------------------------
// Masses: the main hall behind, the roof-garden front between the two
// corner pavilions, and the pavilions.
// ---------------------------------------------------------------------------
const F = along(A, B)
const back = (p: XY, k: number): XY => [p[0], p[1] + k]
const fA = F.xy(TW), fB = F.xy(F.L - TW)
// Main hall: from the terrace's back line to the north wall.
// The hall behind the roof garden, and the pavilions' back halves.
prism({ wall: stucco, win: null, roof, ring: [back(A, GARDEN), back(B, GARDEN), C, D], z0: 0, z1: BODY, facade: null, bevel: 0.4 })
for (const [a, b] of [[back(A, TD), back(fA, TD)], [back(fB, TD), back(B, TD)]] as [XY, XY][])
  prism({ wall: stucco, win: null, roof, ring: [a, b, back(b, GARDEN - TD), back(a, GARDEN - TD)], z0: 0, z1: BODY, facade: null, bevel: 0.3 })
// The roof garden: between the pavilions and GARDEN m deep, its floor at
// the top of the frieze (the camera on the Boardwalk sees sky through the
// pergola, so nothing behind it stands as high as the pergola beam).
prism({ wall: stucco, win: null, roof, ring: [fA, fB, back(fB, GARDEN), back(fA, GARDEN)], z0: 0, z1: FRIEZE1, facade: null, bevel: 0.3 })
// Pavilions, to the gable shoulders, with a crossing pair of curved gables.
const GABLE: [number, number][] = [[0, 0], [0.18, 0.25], [0.3, 0.75], [0.38, 1.1], [0.62, 1.1], [0.7, 0.75], [0.82, 0.25], [1, 0]]
function pavilion(a: XY) {
  const ring: XY[] = [a, [a[0] + F.u[0] * TW, a[1] + F.u[1] * TW], [a[0] + F.u[0] * TW, a[1] + F.u[1] * TW + TD], [a[0], a[1] + TD]]
  prism({ wall: stucco, win: null, roof: null, ring, z0: 0, z1: SHOULDER, facade: null, bevel: 0.3 })
  // The gables: the profile drawn on all four faces, as a low hipped cap.
  const cx = (ring[0][0] + ring[2][0]) / 2, cy = (ring[0][1] + ring[2][1]) / 2
  const top: V3 = [cx, cy, SHOULDER + 0.9]
  for (let i = 0; i < 4; i++) {
    const p = ring[i], q = ring[(i + 1) % 4]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
    const nn: XY = [u[1], -u[0]]
    const pt = (t: number, h: number): V3 => [p[0] + u[0] * L * t + nn[0] * 0.01, p[1] + u[1] * L * t + nn[1] * 0.01, SHOULDER + h * (CREST - SHOULDER) / 1.1]
    // Gable face (fan from the base line), then a roof back to the centre.
    for (let k = 0; k < GABLE.length - 1; k++) {
      const [t0, h0] = GABLE[k], [t1, h1] = GABLE[k + 1]
      stucco.quad(pt(t0, 0), pt(t1, 0), pt(t1, h1), pt(t0, h0))
      roof.tri(pt(t0, h0), pt(t1, h1), top)
    }
    // The scrolls: bold round bosses either side of the crest.
    for (const t of [0.3, 0.7]) {
      const c = pt(t, 0.95)
      const at: At = (s, z, d = 0) => [c[0] + u[0] * s + nn[0] * d, c[1] + u[1] * s + nn[1] * d, z]
      disc(trim, at, 0, c[2], 0.36, 0.12, 10)
    }
  }
  // Urn on the crest, plinth to finial (1.6 m).
  box(trim, cx - 0.4, cy - 0.4, CREST - 0.1, cx + 0.4, cy + 0.4, CREST + 0.3)
  const urn = [[0.25, 0.3], [0.42, 0.75], [0.42, 1.05], [0.28, 1.3], [0.1, 1.6]] as [number, number][]
  for (let k = 0; k < urn.length - 1; k++) {
    const r0 = urn[k][0], r1 = urn[k + 1][0], z0 = CREST + urn[k][1], z1 = CREST + urn[k + 1][1]
    const c0 = circle(cx, cy, r0, 8), c1 = circle(cx, cy, r1, 8)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      poly.quad([c0[i][0], c0[i][1], z0], [c0[j][0], c0[j][1], z0], [c1[j][0], c1[j][1], z1], [c1[i][0], c1[i][1], z1])
    }
  }
  return ring
}
const westPav = pavilion(A)
const eastPav = pavilion([B[0] - F.u[0] * TW, B[1] - F.u[1] * TW])

// ---------------------------------------------------------------------------
// The pavilions' faces: a polychrome cartouche round an oval oculus with
// its grille, garlands either side, and a door in a terracotta surround.
// ---------------------------------------------------------------------------
const CART: [number, number][] = [[0, -2.05], [1.3, -1.4], [1.6, 0], [1.2, 1.5], [0.5, 2.0], [0, 2.1], [-0.5, 2.0], [-1.2, 1.5], [-1.6, 0], [-1.3, -1.4]]
function pavilionFace(at: At, c: number, ground: number, withDoor: boolean) {
  const zc = FG + 9.1
  flat(poly, at, CART.map(([x, z]) => [c + x, zc + z] as [number, number]), 0.08)
  flat(grille, at, Array.from({ length: 12 }, (_, k) => [c + 0.75 * Math.cos((2 * Math.PI * k) / 12), zc + 0.88 * Math.sin((2 * Math.PI * k) / 12)] as [number, number]), 0.14)
  for (const sg of [-1, 1]) {
    // A drooping garland and a slim cream pilaster-urn at its end.
    const g0 = c + sg * 1.5, g1 = c + sg * 2.25
    const pts: [number, number][] = sg > 0
      ? [[g0, zc + 0.1], [g1, zc - 0.6], [g1, zc - 0.2], [g0, zc + 0.45]]
      : [[g1, zc - 0.6], [g0, zc + 0.1], [g0, zc + 0.45], [g1, zc - 0.2]]
    flat(poly, at, pts, 0.07)
    rect(trim, at, c + sg * 2.45 - 0.17, c + sg * 2.45 + 0.17, zc - 1.6, zc + 0.8, 0.07)
  }
  if (!withDoor) return
  rect(trim, at, c - 1.45, c + 1.45, ground, FG + 4.4, 0.06)
  flat(trim, at, [[c - 1.45, FG + 4.4], [c + 1.45, FG + 4.4], [c, FG + 5.2]], 0.06)
  flat(poly, at, [[c - 0.4, FG + 4.5], [c + 0.4, FG + 4.5], [c, FG + 5.0]], 0.08)
  rect(win, at, c - 0.95, c + 0.95, Math.max(ground, FG), FG + 3.3, 0.1)
}
pavilionFace(F.at, TW / 2, FG, true)
pavilionFace(F.at, F.L - TW / 2, FG, true)
{
  // Outer side faces: the west pavilion's west wall (D→A runs south), the
  // east pavilion's east wall (B→C runs north).
  const W = along([A[0], A[1] + TD], A), E = along(B, [B[0], B[1] + TD])
  pavilionFace(W.at, TD / 2, 0, false)
  pavilionFace(E.at, TD / 2, FG - 0.3, true)
}

// ---------------------------------------------------------------------------
// The arcade: five round arches on cream columns, archivolts, roundels,
// the sea-creature frieze, and the roof-garden pergola over it.
// ---------------------------------------------------------------------------
{
  const s0 = TW, s1 = F.L - TW, pitch = (s1 - s0) / 5, R = 1.6, SPRING = FG + 3.9
  for (let k = 0; k < 5; k++) {
    const c = s0 + pitch * (k + 0.5)
    arched(win, F.at, c, 2 * R, FG, SPRING, 0.07)
    archivolt(poly, F.at, c, R, 0.6, SPRING, 0.09)
  }
  for (let k = 0; k <= 5; k++) {
    const c = s0 + pitch * k
    const w = k === 0 || k === 5 ? 0.3 : 0.3
    // Column shaft and capital.
    rect(trim, F.at, c - w, c + w, FG, SPRING - 0.4, 0.1)
    rect(trim, F.at, c - w - 0.15, c + w + 0.15, SPRING - 0.4, SPRING, 0.12)
    if (k > 0 && k < 5) disc(poly, F.at, c, FG + 6.6, 0.62, 0.09, 12)
  }
  rect(poly, F.at, s0, s1, FRIEZE0, FRIEZE1 - 0.15, 0.08)
  // Pergola: piers on the parapet, a front beam, a back beam, rafters.
  const PB = FG + 10.2, PT = FG + 10.8
  const P = (s: number, d: number): XY => { const q = F.xy(s, 0); return [q[0], q[1] + d] }
  for (let k = 0; k <= 5; k++) {
    for (const d of [0.4, TERRACE - 0.6]) {
      const q = P(s0 + pitch * k + (k === 0 ? 0.35 : k === 5 ? -0.35 : 0), d)
      box(trim, q[0] - 0.3, q[1] - 0.3, FRIEZE1 - 0.05, q[0] + 0.3, q[1] + 0.3, PB)
    }
  }
  for (const d of [0.4, TERRACE - 0.6]) {
    const a = P(s0, d), b = P(s1, d)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const ring: XY[] = [[a[0] + 0.35 * u[1], a[1] - 0.35 * u[0]], [b[0] + 0.35 * u[1], b[1] - 0.35 * u[0]], [b[0] - 0.35 * u[1], b[1] + 0.35 * u[0]], [a[0] - 0.35 * u[1], a[1] + 0.35 * u[0]]]
    prism({ wall: trim, win: null, roof: trim, ring, z0: PB, z1: PT, facade: null, bevel: 0 })
  }
  const nr = 16
  for (let k = 0; k < nr; k++) {
    const s = s0 + 0.6 + ((s1 - s0 - 1.2) * k) / (nr - 1)
    const a = P(s, -0.1), b = P(s, TERRACE - 0.1)
    box(trim, a[0] - 0.11, a[1], PT, a[0] + 0.11, b[1], PT + 0.25)
  }
}

// ---------------------------------------------------------------------------
// The east wall on West 21st Street: arched windows with roundels between,
// under a cornice band; the west and north walls are plain.
// ---------------------------------------------------------------------------
{
  const E = along([B[0], B[1] + TD], C)
  const n = 10, pitch = (E.L - 2) / n
  for (let k = 0; k < n; k++) {
    const c = 1 + pitch * (k + 0.5)
    arched(win, E.at, c, 2.6, 3.4, 5.6, 0.06)
    archivolt(poly, E.at, c, 1.3, 0.3, 5.6, 0.08)
    if (k < n - 1) disc(poly, E.at, c + pitch / 2, 7.4, 0.5, 0.08, 10)
  }
  rect(poly, E.at, 0.3, E.L - 0.3, BODY - 1.0, BODY - 0.7, 0.06)
}

finishModel('Childs Restaurant, Coney Island', 'nyc-childs-coney-island', [
  {
    part: stucco,
    material: {
      ...finish('childs-stucco', 0xeee4cf),
      // Floodlit from the pergola's lamps: the Boardwalk front and the
      // pavilions' faces near it.
      floodlight: (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] < -28 ? 0.85 : 0),
    },
  },
  { part: poly, material: finish('childs-terracotta-teal', 0x6f9fa3) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: grille, material: finish('childs-grille', 0xa86a55) },
], { bearing: 351.5, osm: 'way/248474798', height: CREST + 1.6 })
