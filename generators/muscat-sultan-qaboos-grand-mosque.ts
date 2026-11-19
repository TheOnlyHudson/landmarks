/**
 * Sultan Qaboos Grand Mosque, Muscat (1995-2001; Quad Design / Mohammed
 * Saleh Makiya): procedural, CC0-1.0.
 * bun generators/muscat-sultan-qaboos-grand-mosque.ts
 *
 * Two levels of detail, same frame and materials: the low model (under
 * 6,500 triangles) and models/muscat-sultan-qaboos-grand-mosque.detail.glb
 * (under 40,000) from zoom 16. The detail model has every riwaq bay (~4.8 m)
 * cut right through the galleries, the hall's arcades, windows and loggias
 * as real recesses, crenellation on every roof edge, the dome's 3D lattice
 * at 16 meridians and 32 x 2 helices, finials with crescents; the low model
 * keeps the same forms with one riwaq opening per ~2.8 real bays, a coarser
 * lattice and crenellation on the hall only.
 *
 * Frame: bearing 0, built on the cardinal axes (the relation's long edges
 * run at 90.3 and 0.5 degrees). Authored in an OSM-local frame with origin
 * 58.3885 E 23.5838 N; the anchor is the centroid of the outline (outer way
 * 902004821 of relation/12252336), 58.3888084, 23.5837596.
 *
 * Plan (OSM, measured): prayer hall 72.4 x 71.4 m (x -36.2..36.2, y
 * -39.8..31.6; Wikipedia: 5,476 m2, i.e. 74 m square); the east block of
 * ranges round two inner courts (inner ways 902004822, 902004823) to x 120;
 * riwaqs 6.2 m wide on the north (1448565020, 1079046536) and south
 * (902004824, 1185026488-93, the three building=roof gaps being the tall
 * gate arches) from x -55 to 158; the main minaret's 9.8 m square on the
 * north riwaq (1448186366, height 91.5); four corner minarets (1448186363,
 * -64, -65, -71, height 45); the pink boundary walls on the west
 * (barrier=wall buildings 1448186372, -73, -75, -76). The east side of the
 * enclosure (x 120-160) is not mapped in OSM and is not modelled.
 *
 * Heights. Published: main minaret 90 m (Wikipedia; OSM 91.5, used), corner
 * minarets 45.5 m (Wikipedia), dome "50 m" (Wikipedia; OSM dome part
 * min_height 20 + roof:height 30 = 50, used to the finial). Estimated from
 * photos (scaled by the dome's 28 m OSM circle in c63 and o12, people in
 * c28): hall walls 18 m with crenellation to 19.2; upper tier 22.6; platform
 * 25.6; drum to 29.4; dome springing 30.1, rise 14.4, apex 44.5, finial to
 * 51; main minaret stages (o12, c32): base block 12.6, shaft to 45, balconies
 * at 45-47.8, 61.1-64.7, 76.2-80.5, lantern to 85.6, dome to 89, finial
 * 91.5; corner minarets (c24): shaft to 23.5, balconies 23.5-26 and
 * 33.8-36.4, lantern, ribbed dome to 43.3; east-block ranges 13 m, kiosks
 * 17.5 m with domes, the neck's iwan gates 22 m with 16.8 m pointed arches
 * (c28, c29); riwaqs 10.5 m, the tall gate groups 14.5 m (c22, c63, o13);
 * boundary walls 5 m (c24, c00). Bay rhythms are estimates.
 *
 * Colour (sampled, pulled to the palette's lightness): marble #ece4d3
 * (sunlit c28 #b3a995, shaded c29 #a9a7a1: a warm light grey-beige);
 * sandstone #dcb9a0 (c23 #ac8f7b / #b08f78, c22 #947f68: the riwaqs, corner
 * minarets and walls are pink Indian sandstone, the hall, east block and
 * main minaret white); dome: a cream lattice over gold, cells #d8ad78
 * (o14 cells #d7b496 to #855c42, finial #e6b582), shade #a89d8e in
 * recesses and galleries; doors carved wood #a8714c (c43). The assignment
 * mentioned blue bands on the dome: no open photo shows blue outside, so
 * the dome is cream and gold. Night: the dome glows gold through the
 * lattice (c00 at dusk, o11), so the gold is a `neon` material; marble and
 * sandstone are floodlit (_FLOODLIGHT), windows glow.
 *
 * Elevation 0: the site is flat (photos); the courtyards' marble paving
 * and the gardens are the map's ground and are not modelled.
 *
 * Photos (EVIDENCE):
 * - c28 "Muscat, moschea del sultano qaboos, esterno 02", Francesco Bini, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Muscat,_moschea_del_sultano_qaboos,_esterno_02.jpg (hall face, portal, hood, iwan gate)
 * - c29 "... esterno 03", Francesco Bini, CC BY-SA 4.0 (iwan gate, main minaret, kiosk)
 * - c05 "... cortile 01", Francesco Bini, CC BY-SA 4.0 (inner court arcade)
 * - c22 "... esterno, perimetro 01", c23 "... perimetro 02", c24 "... perimetro 03 minareto", Francesco Bini, CC BY-SA 4.0 (pink riwaq, walls, corner minaret)
 * - c32 "... esterno 05 minareto 2", Francesco Bini, CC BY-SA 4.0 (main minaret)
 * - c63 "Sultan Qaboos Grand Mosque (20517260391)", Riyadh Al Balushi, CC BY 2.0, Commons (north elevation, distant)
 * - c56 "SultanQaboosGrandMosque 44", Paasikivi, CC BY-SA 3.0, Commons (south courtyard panorama)
 * - c00 "Grand Mosque", AdArSh r u, CC BY-SA 4.0, Commons (dusk, dome lit)
 * - o12 "Grand Mosque - Sultanate of Oman", Jhong Dizon, CC BY 2.0, https://www.flickr.com/photos/27636029@N05/4206047049 (north elevation)
 * - o13 "Grand Central Mosque, Muscat", AD2O9, CC BY 2.0, https://www.flickr.com/photos/73435065@N00/160404538 (north court, riwaq inner face)
 * - o18 "Sultan Qaboos Grand Mosque, Oman", prasad.om, CC BY 2.0, https://www.flickr.com/photos/43810986@N03/9840564423 (hall)
 * - o10 "The Sultan Qaboos Grand Mosque", y entonces, CC BY 2.0, https://www.flickr.com/photos/86896868@N00/11261912345
 * - o14 "Dome Detail", andryn2006, CC BY-SA 2.0, https://www.flickr.com/photos/84985982@N00/13639232134 (dome lattice)
 * - o06 "Mosque Gardens", andryn2006, CC BY-SA 2.0, https://www.flickr.com/photos/84985982@N00/13638558693
 * Facts: https://en.wikipedia.org/wiki/Sultan_Qaboos_Grand_Mosque
 * Look-only: none.
 *
 * Doubts: no open aerial, so the roofs of the east block and the hall's
 * upper tiers rest on oblique photos; the east block's use and heights are
 * estimated (13 m); the hall's four faces are drawn alike from the two seen
 * (c28, o18); the corner pavilion with the ribbed dome beside the hall (o18,
 * c00) is left out; the unmapped east side of the enclosure is open;
 * small roof kiosks on the riwaqs (o13) are left out.
 *
 * This file also exports the small geometry kit the Muscat and Nizwa
 * models share (muscat-royal-opera-house, muscat-al-alam-palace,
 * nizwa-fort import it): faces with explicit normals, lathes, prisms, wall
 * bands with real pointed or round openings cut through them (reveals,
 * sills, backs), crenellations, a lattice dome and a crescent finial. The
 * mosque's own build only runs under `import.meta.main`. Several helpers
 * (lathe, archFaceP, crescent) follow abu-dhabi-sheikh-zayed-grand-mosque.ts.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Shared kit. Map frame: x east, y north, z up, metres. Every face is given
// its outward normal and Part.tri winds it to agree.

export const TAU = Math.PI * 2
export type P2 = [number, number]
let SHIFT: P2 = [0, 0]
/** Author in any convenient local frame; this offset is subtracted on write. */
export const setShift = (x: number, y: number) => { SHIFT = [x, y] }
const W = (p: V3): V3 => [p[0] - SHIFT[0], p[1] - SHIFT[1], p[2]]
export const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

export function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(W(a), W(b), W(c), [0, 0], [0, 0], [0, 0], ns.map(norm))
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
export function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}

/** Surface of revolution about the vertical axis at (cx, cy); prof = [r, z] bottom to top. */
export function lathe(p: Part, cx: number, cy: number, prof: P2[], n: number, o: { smooth?: boolean; phase?: number } = {}) {
  const ph = o.phase ?? 0
  const segN = prof.slice(0, -1).map((q, k) => {
    const dr = prof[k + 1][0] - q[0], dz = prof[k + 1][1] - q[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as P2
  })
  const vN = (k: number, seg: number): P2 => {
    if (!o.smooth) return segN[seg]
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const pt = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  const nn = (q: P2, t: number): V3 => [q[0] * Math.cos(t), q[0] * Math.sin(t), q[1]]
  for (let i = 0; i < n; i++) {
    const t0 = ph + (TAU * i) / n, t1 = ph + (TAU * (i + 1)) / n
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      if (r0 < 1e-6 && r1 < 1e-6) continue
      const A = pt(r0, z0, t0), B = pt(r0, z0, t1), C = pt(r1, z1, t1), D = pt(r1, z1, t0)
      const nA = nn(vN(k, k), t0), nB = nn(vN(k, k), t1), nC = nn(vN(k + 1, k), t1), nD = nn(vN(k + 1, k), t0)
      if (r0 < 1e-6) tri(p, A, C, D, [nA, nC, nD])
      else if (r1 < 1e-6) tri(p, A, B, C, [nA, nB, nC])
      else quad(p, A, B, C, D, [nA, nB, nC, nD])
    }
  }
}

/** A vertical prism over a convex ring (counter-clockwise from above). */
export function prism(side: Part | null, top: Part | null, ring: P2[], z0: number, z1: number, bottom: Part | null = null) {
  for (let i = 0; side && i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    quad(side, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], [by - ay, -(bx - ax), 0])
  }
  if (top) face(top, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) face(bottom, [...ring].reverse().map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
export const rect = (x0: number, x1: number, y0: number, y1: number, b = 0): P2[] =>
  b > 0
    ? [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export function box(side: Part | null, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom: Part | null = null) {
  prism(side, top, rect(x0, x1, y0, y1, b), z0, z1, bottom)
}
/** A regular polygon ring (counter-clockwise), vertices at phase + i*TAU/n. */
export const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): P2[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (TAU * i) / n), cy + r * Math.sin(phase + (TAU * i) / n)] as P2)

// A wall plane: origin o on the face line, unit tangent t, outward normal n.
export type Plane = { o: P2; t: P2; n: P2 }
export const plane = (o: P2, t: P2, n: P2): Plane => ({ o, t, n })
export const at = (pl: Plane, s: number, z: number, d = 0): V3 => [pl.o[0] + pl.t[0] * s + pl.n[0] * d, pl.o[1] + pl.t[1] * s + pl.n[1] * d, z]
export const nrm = (pl: Plane, k = 1): V3 => [pl.n[0] * k, pl.n[1] * k, 0]
/** The face T behind, seen from the other side: s there is -s here. */
export const flip = (pl: Plane, T: number): Plane => ({ o: [pl.o[0] - pl.n[0] * T, pl.o[1] - pl.n[1] * T], t: [-pl.t[0], -pl.t[1]], n: [-pl.n[0], -pl.n[1]] })
/** The four outward faces of an axis box, counter-clockwise from the south: [plane, length]. */
export const boxFaces = (x0: number, x1: number, y0: number, y1: number): [Plane, number][] => [
  [plane([x0, y0], [1, 0], [0, -1]), x1 - x0],
  [plane([x1, y0], [0, 1], [1, 0]), y1 - y0],
  [plane([x1, y1], [-1, 0], [0, 1]), x1 - x0],
  [plane([x0, y1], [0, -1], [-1, 0]), y1 - y0],
]
/** A straight run from A to B, the face at half-width w/2 on the side `side` (+1 left of A->B, -1 right). */
export function runPlane(A: P2, B: P2, w: number, side: number): [Plane, number] {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const n: P2 = [-t[1] * side, t[0] * side]
  const o: P2 = [A[0] + n[0] * w / 2, A[1] + n[1] * w / 2]
  // keep s increasing to the right as seen from outside
  return side > 0 ? [plane([o[0] + t[0] * L, o[1] + t[1] * L], [-t[0], -t[1]], n), L] : [plane(o, t, n), L]
}

/** A flat panel on a wall (within 0.06 m of it): rectangle with an optional round or pointed head. */
export function panel(p: Part, pl: Plane, s: number, z0: number, w: number, h: number, head: 'round' | 'pointed' | 'flat' = 'round', segs = 6, d = 0.06) {
  const r = w / 2, n = nrm(pl)
  if (head === 'flat') {
    quad(p, at(pl, s - r, z0, d), at(pl, s + r, z0, d), at(pl, s + r, z0 + h, d), at(pl, s - r, z0 + h, d), n)
    return
  }
  const zs = head === 'round' ? z0 + h - r : springOf(z0 + h, r)
  quad(p, at(pl, s - r, z0, d), at(pl, s + r, z0, d), at(pl, s + r, zs, d), at(pl, s - r, zs, d), n)
  const arc = head === 'round' ? roundArc(s, zs, r, segs) : pointedArc(s, zs, r, segs)
  for (let i = 0; i < arc.length - 1; i++) tri(p, at(pl, s, zs, d), at(pl, arc[i][0], arc[i][1], d), at(pl, arc[i + 1][0], arc[i + 1][1], d), n)
}

/**
 * The face of a wall bay [x0, x1] x [zs, H] with an arch cut through it.
 * `arc` runs from the left jamb's top over the crown to the right jamb's
 * top, star-shaped seen from (ox, oz). (From the Sheikh Zayed generator.)
 */
export function archFaceP(p: Part, pl: Plane, d: number, k: number, x0: number, x1: number, zs: number, H: number, arc: P2[], ox: number, oz: number) {
  const ang = (q: P2) => Math.atan2(q[0] - ox, q[1] - oz)
  const corners = [ang([x0, zs]), ang([x0, H]), ang([x1, H]), ang([x1, zs])]
  const pts: [number, P2][] = arc.map((q) => [ang(q), q])
  for (const c of corners) {
    for (let j = 0; j < pts.length - 1; j++) {
      const [a0, q0] = pts[j], [a1, q1] = pts[j + 1]
      if (c > a0 + 1e-9 && c < a1 - 1e-9) {
        const t = (c - a0) / (a1 - a0)
        pts.splice(j + 1, 0, [c, [q0[0] + (q1[0] - q0[0]) * t, q0[1] + (q1[1] - q0[1]) * t]])
        break
      }
    }
  }
  const R = (q: number): P2 => {
    if (q <= corners[0]) return [x0, zs]
    if (q >= corners[3]) return [x1, zs]
    const sx = Math.sin(q), cz_ = Math.cos(q)
    let tBest = Infinity
    if (sx < -1e-9) tBest = Math.min(tBest, (x0 - ox) / sx)
    if (sx > 1e-9) tBest = Math.min(tBest, (x1 - ox) / sx)
    if (cz_ > 1e-9) tBest = Math.min(tBest, (H - oz) / cz_)
    return [ox + sx * tBest, oz + cz_ * tBest]
  }
  const n = nrm(pl, k)
  const P = (q: P2) => at(pl, q[0], q[1], d)
  const same = (a: P2, b: P2) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6
  const r0 = R(pts[0][0]), rN = R(pts[pts.length - 1][0])
  if (!same(r0, [x0, zs])) tri(p, P([x0, zs]), P(pts[0][1]), P(r0), n)
  if (!same(rN, [x1, zs])) tri(p, P([x1, zs]), P(rN), P(pts[pts.length - 1][1]), n)
  for (let i = 0; i < pts.length - 1; i++) {
    if (pts[i + 1][0] - pts[i][0] < 1e-9) continue
    const a0 = pts[i][1], a1 = pts[i + 1][1], ra = R(pts[i][0]), rb = R(pts[i + 1][0])
    if (same(ra, rb)) tri(p, P(a0), P(a1), P(ra), n)
    else quad(p, P(a0), P(a1), P(rb), P(ra), n)
  }
}
/** Pointed (two-centred) arch over jambs at cx +- hw springing at zs; e sets how sharp. */
export function pointedArc(cx: number, zs: number, hw: number, seg: number, e = 0.55): P2[] {
  const R = hw * (1 + e), off = hw * e, ta = Math.acos(off / R), m = Math.max(1, Math.round(seg / 2))
  const left: P2[] = []
  for (let i = 0; i <= m; i++) {
    const t = Math.PI - ((Math.PI - ta) * i) / m
    left.push([cx + off + R * Math.cos(t), zs + R * Math.sin(t)])
  }
  const right = left.slice(0, -1).reverse().map(([x, z]) => [2 * cx - x, z] as P2)
  return [...left, ...right]
}
export const springOf = (crown: number, hw: number, e = 0.55) => crown - hw * Math.sqrt((1 + e) ** 2 - e * e)
/** A real semicircle. */
export function roundArc(cx: number, zs: number, hw: number, seg: number): P2[] {
  return Array.from({ length: seg + 1 }, (_, i) => {
    const t = Math.PI - (Math.PI * i) / seg
    return [cx + hw * Math.cos(t), zs + hw * Math.sin(t)] as P2
  })
}

/**
 * An opening in a wall band. `through` openings go right through (the far
 * face is drawn by the caller with `flip` and mirrored openings, reveals
 * off); otherwise a recess `depth` deep with a back in `back` (shade,
 * window, or nothing), and a door at its foot if `door`.
 */
export type Opening = {
  c: number; hw: number; zb: number; crown: number; depth: number
  round?: boolean; flat?: boolean; through?: boolean; back?: Part | null; door?: { part: Part; h: number }
  seg?: number; noReveal?: boolean; inner?: Part
}
export function openingArc(o: Opening, seg: number): { zs: number; arc: P2[]; ox: number; oz: number } {
  if (o.flat) {
    const zs = o.crown
    return { zs, arc: [[o.c - o.hw, zs], [o.c + o.hw, zs]], ox: o.c, oz: zs - o.hw }
  }
  if (o.round) {
    const zs = o.crown - o.hw
    return { zs, arc: roundArc(o.c, zs, o.hw, seg), ox: o.c, oz: zs }
  }
  const zs = springOf(o.crown, o.hw)
  return { zs, arc: pointedArc(o.c, zs, o.hw, seg), ox: o.c, oz: zs - 0.4 * o.hw }
}

/**
 * A wall band from s = x0 to x1, z0 to H, with openings cut into it. Each
 * opening gets the cell between its neighbours' midpoints.
 */
export function wallBand(wall: Part, inner: Part, pl: Plane, x0: number, x1: number, z0: number, H: number, ops: Opening[], seg = 4, reveals = true) {
  const n = nrm(pl)
  const os = [...ops].sort((a, b) => a.c - b.c)
  if (!os.length) {
    quad(wall, at(pl, x0, z0), at(pl, x1, z0), at(pl, x1, H), at(pl, x0, H), n)
    return
  }
  const cuts = [x0, ...os.slice(1).map((o, i) => (os[i].c + os[i].hw + o.c - o.hw) / 2), x1]
  os.forEach((o, i) => {
    const a = cuts[i], b = cuts[i + 1]
    const { zs, arc, ox, oz } = openingArc(o, o.seg ?? seg)
    if (o.zb > z0 + 1e-6) quad(wall, at(pl, a, z0), at(pl, b, z0), at(pl, b, o.zb), at(pl, a, o.zb), n)
    if (o.c - o.hw > a + 1e-6) quad(wall, at(pl, a, o.zb), at(pl, o.c - o.hw, o.zb), at(pl, o.c - o.hw, zs), at(pl, a, zs), n)
    if (b > o.c + o.hw + 1e-6) quad(wall, at(pl, o.c + o.hw, o.zb), at(pl, b, o.zb), at(pl, b, zs), at(pl, o.c + o.hw, zs), n)
    if (o.flat) quad(wall, at(pl, a, zs), at(pl, b, zs), at(pl, b, H), at(pl, a, H), n)
    else archFaceP(wall, pl, 0, 1, a, b, zs, H, arc, ox, oz)
    if (reveals && !o.noReveal) reveal(o.inner ?? inner, pl, o, arc, zs)
  })
}

/** Inside of an opening: soffit, jambs, sill, and the back of a recess. */
export function reveal(p: Part, pl: Plane, o: Opening, arc: P2[], zs: number) {
  const d = -o.depth
  const mid = (zs + o.crown) / 2
  for (let j = 0; j < arc.length - 1; j++) {
    const [s0, q0] = arc[j], [s1, q1] = arc[j + 1]
    const n0: V3 = [pl.t[0] * (o.c - s0), pl.t[1] * (o.c - s0), Math.min(mid, zs) - q0 - (o.flat ? 1 : 0)]
    const n1: V3 = [pl.t[0] * (o.c - s1), pl.t[1] * (o.c - s1), Math.min(mid, zs) - q1 - (o.flat ? 1 : 0)]
    quad(p, at(pl, s0, q0, 0), at(pl, s0, q0, d), at(pl, s1, q1, d), at(pl, s1, q1, 0), [n0, n0, n1, n1])
  }
  const tR: V3 = [pl.t[0], pl.t[1], 0], tL: V3 = [-pl.t[0], -pl.t[1], 0]
  quad(p, at(pl, o.c - o.hw, o.zb, 0), at(pl, o.c - o.hw, o.zb, d), at(pl, o.c - o.hw, zs, d), at(pl, o.c - o.hw, zs, 0), tR)
  quad(p, at(pl, o.c + o.hw, o.zb, 0), at(pl, o.c + o.hw, zs, 0), at(pl, o.c + o.hw, zs, d), at(pl, o.c + o.hw, o.zb, d), tL)
  if (o.zb > 0.05 || o.through) quad(p, at(pl, o.c - o.hw, o.zb, 0), at(pl, o.c + o.hw, o.zb, 0), at(pl, o.c + o.hw, o.zb, d), at(pl, o.c - o.hw, o.zb, d), [0, 0, 1])
  if (o.through || !o.back) return
  const ring: P2[] = [[o.c - o.hw, o.zb], ...arc, [o.c + o.hw, o.zb]]
  const n = nrm(pl)
  for (let j = 0; j < ring.length - 1; j++) tri(o.back, at(pl, o.c, o.zb, d), at(pl, ring[j][0], ring[j][1], d), at(pl, ring[j + 1][0], ring[j + 1][1], d), n)
  if (o.door) {
    const dw = Math.min(o.hw * 0.8, 2.6), dh = Math.min(o.door.h, zs - o.zb)
    quad(o.door.part, at(pl, o.c - dw, o.zb, d + 0.05), at(pl, o.c + dw, o.zb, d + 0.05), at(pl, o.c + dw, o.zb + dh, d + 0.05), at(pl, o.c - dw, o.zb + dh, d + 0.05), n)
  }
}

/** A wall T thick with openings right through it: both faces and the reveals. */
export function throughWall(wall: Part, inner: Part, pl: Plane, x0: number, x1: number, z0: number, H: number, T: number, ops: Opening[], seg = 4) {
  const os = ops.map((o) => ({ ...o, through: true, depth: T }))
  wallBand(wall, inner, pl, x0, x1, z0, H, os, seg)
  wallBand(wall, inner, flip(pl, T), -x1, -x0, z0, H, os.map((o) => ({ ...o, c: -o.c })), seg, false)
}

/** Evenly spaced openings over [x0, x1]: n bays, each opening centred. */
export function bays(x0: number, x1: number, n: number, f: (c: number, w: number) => Opening): Opening[] {
  const w = (x1 - x0) / n
  return Array.from({ length: n }, (_, i) => f(x0 + w * (i + 0.5), w))
}

/**
 * Crenellation along a face from s = x0 to x1 standing on z: merlons h high
 * and w wide every sp, pointed (Omani) heads, T thick. `sides` adds their
 * side faces (detail); without, front and back only.
 */
export function merlons(p: Part, pl: Plane, x0: number, x1: number, z: number, h: number, w: number, sp: number, T: number, sides = true, round = false) {
  const nM = Math.max(1, Math.floor((x1 - x0) / sp)), off = x0 + (x1 - x0 - (nM - 1) * sp) / 2
  const sh = round ? 0.62 : 0.55
  for (let i = 0; i < nM; i++) {
    const s = off + i * sp
    const prof: P2[] = round
      ? [[s - w / 2, z], [s + w / 2, z], [s + w / 2, z + h * sh], [s + w * 0.35, z + h * 0.9], [s, z + h], [s - w * 0.35, z + h * 0.9], [s - w / 2, z + h * sh]]
      : [[s - w / 2, z], [s + w / 2, z], [s + w / 2, z + h * sh], [s, z + h], [s - w / 2, z + h * sh]]
    face(p, prof.map(([a, b]) => at(pl, a, b, 0)), nrm(pl))
    face(p, [...prof].reverse().map(([a, b]) => at(pl, a, b, -T)), nrm(pl, -1))
    if (!sides) continue
    for (let k = 0; k < prof.length; k++) {
      const A = prof[k], B = prof[(k + 1) % prof.length]
      if (k === 0) continue // the base sits on the wall
      const dx = B[0] - A[0], dz = B[1] - A[1]
      const nn: V3 = [pl.t[0] * dz, pl.t[1] * dz, -dx]
      quad(p, at(pl, A[0], A[1], 0), at(pl, A[0], A[1], -T), at(pl, B[0], B[1], -T), at(pl, B[0], B[1], 0), nn)
    }
  }
}

/** A crescent, horns up, in the x-z plane, centred at (cx, cy, zc). (From the Sheikh Zayed generator.) */
export function crescentAt(p: Part, cx: number, cy: number, zc: number, R: number, e: number) {
  const m = 6, th = (2.3 * Math.PI) / 4, Wd = R * 0.42
  const O: P2[] = [], I: P2[] = []
  for (let i = 0; i <= m; i++) {
    const q = -th + (2 * th * i) / m
    const ou: P2 = [R * Math.sin(q), -R * Math.cos(q)]
    const w = Wd * Math.cos((q / th) * (Math.PI / 2))
    O.push(ou)
    I.push([ou[0] * (1 - w / R), ou[1] * (1 - w / R)])
  }
  const P = (q: P2, y: number): V3 => [cx + q[0], cy + y, zc + q[1]]
  for (let i = 0; i < m; i++) {
    quad(p, P(O[i], -e), P(O[i + 1], -e), P(I[i + 1], -e), P(I[i], -e), [0, -1, 0])
    quad(p, P(O[i], e), P(I[i], e), P(I[i + 1], e), P(O[i + 1], e), [0, 1, 0])
    const no = (q: P2): V3 => [q[0], 0, q[1]]
    quad(p, P(O[i], -e), P(O[i], e), P(O[i + 1], e), P(O[i + 1], -e), [no(O[i]), no(O[i]), no(O[i + 1]), no(O[i + 1])])
    const ni = (q: P2): V3 => [-q[0], 0, -q[1]]
    quad(p, P(I[i], -e), P(I[i + 1], -e), P(I[i + 1], e), P(I[i], e), [ni(I[i]), ni(I[i + 1]), ni(I[i + 1]), ni(I[i])])
  }
}

/** A gold finial: stem, two balls, spike and (detail) a crescent; h total. */
export function finial(p: Part, D: boolean, cx: number, cy: number, z: number, h: number, crescent = true) {
  const k = h / 7
  const prof: P2[] = D
    ? [[0.5, 0], [0.42, 1.2], [0.75, 1.7], [0.45, 2.25], [0.7, 2.75], [0.3, 3.3], [0.16, 3.6], [0.12, 5.6], [0, 5.7]]
    : [[0.55, 0], [0.72, 2.2], [0.25, 3.4], [0, 6.2]]
  lathe(p, cx, cy, prof.map(([r, zz]) => [r * k, z + zz * k] as P2), D ? 8 : 4, { smooth: true })
  if (D && crescent) crescentAt(p, cx, cy, z + 6.35 * k, 0.75 * k, 0.1 * k)
}

/**
 * A lattice dome: a shell (the gold seen through the cells) on a scaled
 * sphere of radius R and rise Hr springing at zs, with a real 3D lattice of
 * ribs standing `off` proud: meridians, and two families of helices making
 * diamond cells, up to latitude `top`; a solid cap above it.
 */
export function latticeDome(shell: Part, rib: Part, cx: number, cy: number, zs: number, R: number, Hr: number,
  o: { mer: number; hel: number; rows: number; off: number; w: number; sides: boolean; shellSeg: number; top?: number }) {
  const top = o.top ?? 1.3
  const P = (th: number, ph: number, off: number): V3 => [cx + (R + off) * Math.cos(ph) * Math.cos(th), cy + (R + off) * Math.cos(ph) * Math.sin(th), zs + (Hr + off) * Math.sin(ph)]
  const N = (th: number, ph: number): V3 => norm([Math.cos(ph) * Math.cos(th) / R, Math.cos(ph) * Math.sin(th) / R, Math.sin(ph) / Hr])
  // shell up to the cap
  const ring = Array.from({ length: 8 }, (_, i) => (top * i) / 7)
  lathe(shell, cx, cy, ring.map((ph) => [R * Math.cos(ph), zs + Hr * Math.sin(ph)] as P2), o.shellSeg, { smooth: true })
  // cap in rib colour
  const capR: P2[] = [top, (top + Math.PI / 2) / 2, Math.PI / 2].map((ph) => [(R + o.off) * Math.cos(ph), zs + (Hr + o.off) * Math.sin(ph)] as P2)
  lathe(rib, cx, cy, capR, o.shellSeg, { smooth: true })
  const strip = (path: [number, number][]) => {
    for (let k = 0; k < path.length - 1; k++) {
      const [ta, pa] = path[k], [tb, pb] = path[k + 1]
      const A = P(ta, pa, o.off), B = P(tb, pb, o.off), nA = N(ta, pa), nB = N(tb, pb)
      const tg = norm([B[0] - A[0], B[1] - A[1], B[2] - A[2]])
      const sA = norm([tg[1] * nA[2] - tg[2] * nA[1], tg[2] * nA[0] - tg[0] * nA[2], tg[0] * nA[1] - tg[1] * nA[0]])
      const sB = norm([tg[1] * nB[2] - tg[2] * nB[1], tg[2] * nB[0] - tg[0] * nB[2], tg[0] * nB[1] - tg[1] * nB[0]])
      const h = o.w / 2
      const off = (p: V3, s: V3, k: number, n?: V3, d = 0): V3 => [p[0] + s[0] * k + (n ? n[0] * d : 0), p[1] + s[1] * k + (n ? n[1] * d : 0), p[2] + s[2] * k + (n ? n[2] * d : 0)]
      quad(rib, off(A, sA, h), off(A, sA, -h), off(B, sB, -h), off(B, sB, h), [nA, nA, nB, nB])
      if (o.sides) {
        quad(rib, off(A, sA, h), off(B, sB, h), off(B, sB, h, nB, -o.off), off(A, sA, h, nA, -o.off), sA)
        quad(rib, off(A, sA, -h), off(A, sA, -h, nA, -o.off), off(B, sB, -h, nB, -o.off), off(B, sB, -h), [-sA[0], -sA[1], -sA[2]])
      }
    }
  }
  const ph0 = 0.04, dph = (top - ph0) / o.rows
  for (let j = 0; j < o.mer; j++) {
    const th = (TAU * j) / o.mer
    strip(Array.from({ length: o.rows + 1 }, (_, k) => [th, ph0 + k * dph] as [number, number]))
  }
  const dth = TAU / o.hel
  for (let i = 0; i < o.hel; i++) for (const sgn of [1, -1]) {
    strip(Array.from({ length: o.rows + 1 }, (_, k) => [(i + sgn * k * 0.5) * dth, ph0 + k * dph] as [number, number]))
  }
  // a band at the springing
  lathe(rib, cx, cy, [[R + 0.05, zs - 0.2], [R + o.off + 0.1, zs - 0.05], [R + o.off + 0.1, zs + 0.6], [R + 0.02, zs + 0.75]], o.shellSeg, {})
}

/** An octagonal stage (vertices at 22.5 + 45 i degrees, circumradius R) with one opening per face. */
export function octStage(wall: Part, inner: Part, cx: number, cy: number, R: number, z0: number, z1: number, op: ((i: number) => Opening | null) | null, seg = 4) {
  const ap = R * Math.cos(Math.PI / 8), fw = 2 * R * Math.sin(Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const t = (TAU * i) / 8
    const pl = plane([cx + ap * Math.cos(t), cy + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    const o = op ? op(i) : null
    wallBand(wall, inner, pl, -fw / 2, fw / 2, z0, z1, o ? [o] : [], seg)
  }
}
export const OCT = Math.PI / 8 // lathe phase matching octStage

// ---------------------------------------------------------------------------
// MOSQUE
//
// Authored in an OSM-local frame (origin 58.3885 E, 23.5838 N, x east, y
// north); the anchor, the centroid of OSM relation/12252336, is at
// (31.464, -4.467) in it. Bearing 0: the plan is laid out on the cardinal
// axes (the relation's long edges run at 90.3 and 0.5 degrees).

type Mats = { cream: Part; pink: Part; gold: Part; shade: Part; win: Part; door: Part }
const ANCHOR: P2 = [31.464, -4.467]

// Plan (OSM): prayer hall x -36.2..36.2, y -39.8..31.6; dome circle 28 m.
const HX = 36.2, HY0 = -39.8, HY1 = 31.6, HCY = (HY0 + HY1) / 2
const HH = 18 // hall walls (photo-scaled, OSM height 20 with parapet)

/** One face of the prayer hall (c28, o18): corner loggia, two bays, the portal bay, mirrored. */
function hallFace(M: Mats, D: boolean, pl: Plane, L: number) {
  const k = L / 72
  const piers = [10, 20, 29, 43, 52, 62].map((s) => s * k)
  const seg = D ? 6 : 2
  const cells: [number, number][] = [[0, piers[0] - 1.1], ...piers.slice(0, -1).map((p, i) => [p + 1.1, piers[i + 1] - 1.1] as [number, number]), [piers[5] + 1.1, L]]
  const zA = 4.6
  cells.forEach(([a, b], i) => {
    const w = b - a, c = (a + b) / 2
    if (i === 0 || i === 6) {
      // corner loggia: tall open arches into a shaded porch
      const n = D ? 3 : 1
      wallBand(M.cream, M.shade, pl, a, b, 0, HH, bays(a, b, n, (cc, ww) => ({ c: cc, hw: Math.min(ww / 2 - 0.45, 3.2), zb: 0, crown: 8.4, depth: 2.4, back: M.shade })), seg)
      if (D) panel(M.win, pl, c, 11.5, 1.2, 3.2, 'pointed', 4)
    } else if (i === 3) {
      // the portal: a deep pointed iwan with stepped (muqarnas) heads, door at its foot
      const hw = Math.min(w / 2 - 1.4, 3.6)
      wallBand(M.cream, M.shade, pl, a, b, 0, HH, [{ c, hw, zb: 0, crown: 13, depth: 2.6, back: M.shade, door: { part: M.door, h: 4.6 } }], seg)
      if (D) for (const [f, dd] of [[0.78, -0.9], [0.56, -1.8]] as [number, number][]) {
        // two inner arch rings, each set back, the muqarnas read as steps
        const o: Opening = { c, hw: hw * f, zb: springOf(13, hw) - 0.6, crown: springOf(13, hw) + (13 - springOf(13, hw)) * 0.9 - (1 - f) * 2.5, depth: 0.3 }
        const pl2 = plane(at(pl, 0, 0, dd) as unknown as P2, pl.t, pl.n)
        const { zs, arc } = openingArc(o, 6)
        archFaceP(M.shade, pl2, 0, 1, c - hw, c + hw, zs, springOf(13, hw) + (13 - springOf(13, hw)) * 0.98, arc, o.c, zs - 0.4 * o.hw)
      }
      // the hood over it (c28): a slab with a shaded underside
      const h0 = 14.6, h1 = 16.0, pr = 1.9
      const A = at(pl, c - 4.4, 0, 0), B = at(pl, c + 4.4, 0, pr)
      box(M.cream, M.cream, Math.min(A[0], B[0]), Math.max(A[0], B[0]), Math.min(A[1], B[1]), Math.max(A[1], B[1]), h0 + 0.6, h1, 0, M.shade)
      // the corbel under it: an inverted pyramid in shade
      const ap = at(pl, c, h0 - 2.4, 0.02), L0 = at(pl, c - 4.4, h0 + 0.6, 0.02), R0 = at(pl, c + 4.4, h0 + 0.6, 0.02)
      const L1 = at(pl, c - 4.4, h0 + 0.6, pr), R1 = at(pl, c + 4.4, h0 + 0.6, pr)
      tri(M.cream, L1, ap, R1, [pl.n[0], pl.n[1], -0.7])
      tri(M.cream, L0, ap, L1, [-pl.t[0], -pl.t[1], -0.4])
      tri(M.cream, R1, ap, R0, [pl.t[0], pl.t[1], -0.4])
    } else {
      // a lower band of small arches, tall screened windows above
      wallBand(M.cream, M.shade, pl, a, b, 0, zA, D ? bays(a, b, 2, (cc, ww) => ({ c: cc, hw: Math.min(ww / 2 - 0.5, 0.85), zb: 0.6, crown: 3.7, depth: 0.7, back: M.shade })) : [], seg)
      const two = i === 1 || i === 5
      wallBand(M.cream, M.shade, pl, a, b, zA, HH, two && D
        ? bays(a, b, 2, (cc) => ({ c: cc, hw: 1.05, zb: 5.8, crown: 12.6, depth: 0.7, back: M.win }))
        : [{ c, hw: Math.min(w / 2 - 0.8, 2.2), zb: 5.2, crown: 13.2, depth: 0.7, back: M.win }], seg)
    }
  })
  // piers, standing 1 m proud and a little above the parapet; the pair at the portal higher
  piers.forEach((s, i) => {
    const top = i === 2 || i === 3 ? HH + 2.4 : HH + 0.6
    const A = at(pl, s - 1.1, 0, 0), B = at(pl, s + 1.1, 0, 1.0)
    box(M.cream, M.cream, Math.min(A[0], B[0]), Math.max(A[0], B[0]), Math.min(A[1], B[1]), Math.max(A[1], B[1]), 0, top, 0)
    if (D && (i === 2 || i === 3)) panel(M.win, plane(at(pl, 0, 0, 1.0) as unknown as P2, pl.t, pl.n), s, top - 3.6, 0.8, 2.6, 'pointed', 4)
  })
  merlons(M.cream, pl, 0, L, HH, D ? 1.15 : 1.5, D ? 0.75 : 0.9, D ? 1.7 : 5.5, 0.45, D, false)
}

function hall(M: Mats, D: boolean) {
  box(null, M.cream, -HX, HX, HY0, HY1, 0, HH)
  boxFaces(-HX, HX, HY0, HY1).forEach(([pl, L], i) => {
    // the east face is mostly behind the neck and its courts: plain in the low model
    if (i === 1 && !D) {
      wallBand(M.cream, M.shade, pl, 0, L, 0, HH, [], 2)
      merlons(M.cream, pl, 0, L, HH, 1.5, 0.9, 5.5, 0.45, false)
    } else hallFace(M, D, pl, L)
  })
  // upper tier (o12, c63): set back, crenellated, small windows
  const U = 27, cy = HCY
  box(null, M.cream, -U, U, cy - U, cy + U, HH, 22.6)
  for (const [pl, L] of boxFaces(-U, U, cy - U, cy + U)) {
    wallBand(M.cream, M.shade, pl, 0, L, HH, 22.6, D ? bays(0, L, 9, (c) => ({ c, hw: 0.7, zb: 19.2, crown: 21.6, depth: 0.5, back: M.win })) : [], D ? 4 : 2)
    if (D) merlons(M.cream, pl, 0, L, 22.6, 1.1, 0.7, 1.9, 0.4, D, false)
  }
  // platform under the drum, chamfered
  prism(M.cream, M.cream, rect(-18.5, 18.5, cy - 18.5, cy + 18.5, 5), 22.6, 25.6)
  // drum with small round-headed windows (o14), lip, lattice dome, finial
  const n = D ? 32 : 12, R = 14.9, z0 = 25.6, z1 = 29.4
  lathe(M.cream, 0, cy, [[R, z0], [R, z1]], n, { phase: Math.PI / n })
  if (D) for (let i = 0; i < 24; i++) {
    const t = (TAU * i) / 24, ap = R * Math.cos(Math.PI / n) + 0.02
    panel(M.win, plane([ap * Math.cos(t), cy + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)]), 0, 26.6, 0.9, 1.8, 'round', 4)
  }
  lathe(M.cream, 0, cy, D ? [[R, z1], [R + 0.4, z1 + 0.2], [R + 0.4, z1 + 0.6], [14.3, z1 + 0.7]] : [[R, z1], [14.3, z1 + 0.7]], n, { phase: Math.PI / n })
  latticeDome(M.gold, M.cream, 0, cy, z1 + 0.7, 14.3, 14.4, D
    ? { mer: 16, hel: 32, rows: 10, off: 0.35, w: 0.42, sides: true, shellSeg: 32 }
    : { mer: 8, hel: 14, rows: 4, off: 0.45, w: 0.85, sides: false, shellSeg: 12 })
  finial(M.gold, D, 0, cy, z1 + 0.7 + 14.4 + 0.3, 6.4)
}

// --- the east block: ranges round two inner courts (OSM inner ways) -----------
type SegT = 'out' | 'arc' | 'pass' | 'skip'
const EH = 13 // ranges, photo-scaled against the hall (c29, c56)

/** One face of a range, as typed segments along it. depth = the range's width (for passages). */
function rangeFace(M: Mats, D: boolean, pl: Plane, segs: [number, number, SegT][], depth: number, H = EH) {
  const seg = D ? 4 : 3
  for (const [a, b, ty] of segs) {
    if (ty === 'skip' || b - a < 0.3) continue
    const w = b - a
    if (ty === 'out') {
      const n = Math.max(0, Math.round(w / (D ? 7 : 14)))
      if (D) wallBand(M.cream, M.shade, pl, a, b, 0, H, w > 3.5 ? bays(a, b, Math.max(1, n), (c) => ({ c, hw: 1.0, zb: 3.2, crown: 9.4, depth: 0.5, back: M.win })) : [], seg)
      else {
        wallBand(M.cream, M.shade, pl, a, b, 0, H, [], seg)
        if (w > 3.5) for (const o of bays(a, b, Math.max(1, n), (c) => ({ c, hw: 1.2, zb: 3.2, crown: 9.4, depth: 0 }))) panel(M.win, pl, o.c, 3.2, 2.4, 6.2, 'pointed', 2)
      }
    } else if (ty === 'arc') {
      const n = Math.max(1, Math.round(w / (D ? 5.2 : 16)))
      wallBand(M.cream, M.shade, pl, a, b, 0, H, bays(a, b, n, (c, ww) => ({ c, hw: D ? Math.min(ww / 2 - 0.6, 1.7) : Math.min(ww / 2 - 1.0, 3.0), zb: 0, crown: 7.8, depth: 4.0, back: M.shade })), seg)
    } else {
      const c = (a + b) / 2
      wallBand(M.cream, M.shade, pl, a, b, 0, H, [{ c, hw: 3.0, zb: 0, crown: 10.6, depth, through: true }], seg)
    }
    if (D) merlons(M.cream, pl, a, b, H, 1.1, 0.7, 2.0, 0.4, D, false)
  }
}
/** The same passage seen from the far face: no reveals (drawn from the near side). */
function passBack(M: Mats, D: boolean, pl: Plane, a: number, b: number, H = EH) {
  const c = (a + b) / 2
  wallBand(M.cream, M.shade, pl, a, b, 0, H, [{ c, hw: 3.0, zb: 0, crown: 10.6, depth: 1, through: true, noReveal: true }], D ? 6 : 3)
  if (D) merlons(M.cream, pl, a, b, H, 1.1, 0.7, 2.0, 0.4, D, false)
}

/** The tall iwan gate on the neck (c28, c29): a frame standing 1.2 m proud with a pointed arch. */
function gateFrame(M: Mats, D: boolean, pl: Plane, s: number) {
  const hw = 6.2, pr = 1.2, H = 22, f = plane(at(pl, 0, 0, pr) as unknown as P2, pl.t, pl.n)
  wallBand(M.cream, M.shade, f, s - hw, s + hw, 0, H, [{ c: s, hw: 3.7, zb: 0, crown: 16.8, depth: pr }], D ? 8 : 4)
  for (const [x, k] of [[s - hw, -1], [s + hw, 1]] as [number, number][]) quad(M.cream, at(pl, x, 0, 0), at(pl, x, 0, pr), at(pl, x, H, pr), at(pl, x, H, 0), [pl.t[0] * k, pl.t[1] * k, 0])
  quad(M.cream, at(pl, s - hw, H, pr), at(pl, s + hw, H, pr), at(pl, s + hw, H, 0), at(pl, s - hw, H, 0), [0, 0, 1])
  // the frame's back above the range roof
  quad(M.cream, at(pl, s + hw, EH, 0), at(pl, s - hw, EH, 0), at(pl, s - hw, H, 0), at(pl, s + hw, H, 0), nrm(pl, -1))
  merlons(M.cream, f, s - hw, s + hw, H, 1.3, 0.8, D ? 1.5 : 3.0, 0.4, D, false)
}

function kiosk(M: Mats, D: boolean, x0: number, y0: number) {
  const s = 8, H = 17.5, cx = x0 + s / 2, cy = y0 + s / 2
  box(null, M.cream, x0, x0 + s, y0, y0 + s, 0, H)
  for (const [pl, L] of boxFaces(x0, x0 + s, y0, y0 + s)) {
    wallBand(M.cream, M.shade, pl, 0, L, EH, H, D ? [{ c: L / 2 - 1.2, hw: 0.5, zb: 14.2, crown: 16.3, depth: 0.5, back: M.win }, { c: L / 2 + 1.2, hw: 0.5, zb: 14.2, crown: 16.3, depth: 0.5, back: M.win }] : [], 4)
    if (D) merlons(M.cream, pl, 0, L, H, 1.0, 0.7, 2.0, 0.35, D, false)
  }
  const n = D ? 16 : 6
  lathe(M.cream, cx, cy, [[2.9, H], [2.9, H + 1.1], [3.1, H + 1.25], [3.05, H + 1.6], [2.65, H + 2.9], [1.6, H + 4.0], [0, H + 4.45]], n, { smooth: true })
  finial(M.gold, D, cx, cy, H + 4.3, 2.2)
}

function eastBlock(M: Mats, D: boolean) {
  const blocks: [number, number, number, number][] = [
    [36.2, 60.1, 4.8, 12.1], [36.2, 60.1, -20.8, -14.5], [60.1, 73, -29.8, 19.5], [73, 91.6, 12.4, 19.5],
    [73, 91.6, -29.8, -23.8], [91.6, 102, -29.8, 19.5], [102, 120, -21.2, 10.9],
  ]
  for (const [x0, x1, y0, y1] of blocks) box(null, M.cream, x0, x1, y0, y1, 0, EH)
  // faces, from boxFaces order S, E, N, W (s: S x-x0, E y-y0, N x1-x, W y1-y)
  const F = (i: number, b: [number, number, number, number]) => boxFaces(...b)[i][0]
  const gx = 48.15 // the neck's gates, centred on it
  // N1: court (S) with the passage, outer N with the passage and the frame
  rangeFace(M, D, F(0, blocks[0]), [[0, gx - 4.6 - 36.2, 'arc'], [gx - 36.2 - 4.6, gx - 36.2 + 4.6, 'skip'], [gx - 36.2 + 4.6, 23.9, 'arc']], 7.3)
  passBack(M, D, F(0, blocks[0]), gx - 36.2 - 4.6, gx - 36.2 + 4.6)
  rangeFace(M, D, F(2, blocks[0]), [[0, 60.1 - gx - 4.6, 'out'], [60.1 - gx - 4.6, 60.1 - gx + 4.6, 'pass'], [60.1 - gx + 4.6, 23.9, 'out']], 7.3)
  gateFrame(M, D, F(2, blocks[0]), 60.1 - gx)
  // S1: court (N) and outer S, the same
  rangeFace(M, D, F(2, blocks[1]), [[0, 60.1 - gx - 4.6, 'arc'], [60.1 - gx - 4.6, 60.1 - gx + 4.6, 'skip'], [60.1 - gx + 4.6, 23.9, 'arc']], 6.3)
  passBack(M, D, F(2, blocks[1]), 60.1 - gx - 4.6, 60.1 - gx + 4.6)
  rangeFace(M, D, F(0, blocks[1]), [[0, gx - 36.2 - 4.6, 'out'], [gx - 36.2 - 4.6, gx - 36.2 + 4.6, 'pass'], [gx - 36.2 + 4.6, 23.9, 'out']], 6.3)
  gateFrame(M, D, F(0, blocks[1]), gx - 36.2)
  // W2: S out, E court (y -23.8..12.4), N out, W: out / skip / court H1 / skip / out
  const b2 = blocks[2]
  rangeFace(M, D, F(0, b2), [[0, 12.9, 'out']], 0)
  rangeFace(M, D, F(1, b2), [[6, 42.2, 'arc']], 0)
  rangeFace(M, D, F(2, b2), [[0, 12.9, 'out']], 0)
  rangeFace(M, D, F(3, b2), [[0, 7.4, 'out'], [14.7, 34, 'arc'], [40.7, 49.3, 'out']], 0)
  // N2, S2: court and outer
  rangeFace(M, D, F(0, blocks[3]), [[0, 18.6, 'arc']], 0)
  rangeFace(M, D, F(2, blocks[3]), [[0, 18.6, 'out']], 0)
  rangeFace(M, D, F(2, blocks[4]), [[0, 18.6, 'arc']], 0)
  rangeFace(M, D, F(0, blocks[4]), [[0, 18.6, 'out']], 0)
  // E2: W court, E out except where the end block abuts, S and N out
  const b5 = blocks[5]
  rangeFace(M, D, F(3, b5), [[7.1, 43.3, 'arc']], 0)
  rangeFace(M, D, F(1, b5), [[0, 8.6, 'out'], [40.7, 49.3, 'out']], 0)
  rangeFace(M, D, F(0, b5), [[0, 10.4, 'out']], 0)
  rangeFace(M, D, F(2, b5), [[0, 10.4, 'out']], 0)
  // end block
  const b6 = blocks[6]
  rangeFace(M, D, F(0, b6), [[0, 18, 'out']], 0)
  rangeFace(M, D, F(1, b6), [[0, 32.1, 'out']], 0)
  rangeFace(M, D, F(2, b6), [[0, 18, 'out']], 0)
  // inner-court floors in shade at the gallery feet are the map's paving: not drawn
  for (const [x, y] of [[60.1, 11.5], [94, 11.5], [60.1, -29.8], [94, -29.8]] as P2[]) kiosk(M, D, x, y)
}

// --- the riwaqs: pink sandstone galleries open on both faces (c22, o13, c63) ---
const RH = 10.5, GH = 14.5
function riwaq(M: Mats, D: boolean, A: P2, B: P2, w: number, side: number, gates: [number, number][]) {
  const [pl, L] = runPlane(A, B, w, side)
  const sOf = (x: number, y: number) => (x - pl.o[0]) * pl.t[0] + (y - pl.o[1]) * pl.t[1]
  // gates given as world x on the run, width
  const gs = gates.map(([x, gw]) => {
    const f = (x - A[0]) / (B[0] - A[0]), y = A[1] + (B[1] - A[1]) * f
    const s = sOf(x, y)
    return [s - gw / 2, s + gw / 2] as [number, number]
  }).sort((a, b) => a[0] - b[0])
  const segs: [number, number, boolean][] = []
  let s0 = 0
  for (const [a, b] of gs) { segs.push([s0, a, false], [a, b, true]); s0 = b }
  segs.push([s0, L, false])
  const seg = D ? 4 : 2
  segs.forEach(([a, b, gate], i) => {
    if (b - a < 0.5) return
    const H = gate ? GH : RH
    const ops = gate
      ? bays(a, b, 3, (c, ww) => ({ c, hw: ww / 2 - 0.65, zb: 0, crown: 12.3, depth: w }))
      : bays(a, b, Math.max(1, Math.round((b - a) / (D ? 4.8 : 13.5))), (c, ww) => ({ c, hw: D ? Math.min(ww / 2 - 0.55, 1.6) : Math.min(ww / 2 - 1.8, 2.5), zb: 0, crown: D ? 7.0 : 7.8, depth: w }))
    throughWall(M.pink, M.shade, pl, a, b, 0, H, w, ops, seg)
    // roof and the ends of the segment above its neighbours
    quad(M.pink, at(pl, a, H, 0), at(pl, b, H, 0), at(pl, b, H, -w), at(pl, a, H, -w), [0, 0, 1])
    for (const [s, k, nb] of [[a, -1, segs[i - 1]], [b, 1, segs[i + 1]]] as [number, number, [number, number, boolean] | undefined][]) {
      const z0 = nb && nb[1] - nb[0] > 0.5 ? (nb[2] ? GH : RH) : 0
      if (z0 >= H) continue
      quad(M.pink, at(pl, s, z0, 0), at(pl, s, z0, -w), at(pl, s, H, -w), at(pl, s, H, 0), [pl.t[0] * k, pl.t[1] * k, 0])
    }
    // a low parapet with rounded merlons (detail), front and back
    // a low coping band on both faces (the real parapet carries small blocks, o13)
    if (D) for (const [q, x0, x1] of [[pl, a, b], [flip(pl, w), -b, -a]] as [Plane, number, number][])
      quad(M.pink, at(q, x0, H, 0.15), at(q, x1, H, 0.15), at(q, x1, H + 0.6, 0.15), at(q, x0, H + 0.6, 0.15), nrm(q))
  })
}

// --- minarets ----------------------------------------------------------------
/** Corner minaret, 45.5 m (Wikipedia), stages from c24 and c22, pink sandstone. */
function cornerMinaret(M: Mats, D: boolean, cx: number, cy: number) {
  const P = M.pink, R0 = 3.6 // octagonal shaft, about 6.6 m across
  octStage(P, M.shade, cx, cy, R0, 0, 23.5, D ? () => ({ c: 0, hw: 0.42, zb: 12.5, crown: 22.4, depth: 0.4, back: M.shade }) : null, D ? 4 : 2)
  const o = { phase: OCT }
  lathe(P, cx, cy, [[R0, 23.5], [4.3, 24.4], [4.3, 26.0], [3.0, 26.0]], 8, o)
  octStage(P, M.shade, cx, cy, 3.0, 26.0, 33.8, D ? () => ({ c: 0, hw: 0.55, zb: 27.6, crown: 32.4, depth: 0.6, back: M.shade }) : null, D ? 4 : 2)
  if (!D) for (let i = 0; i < 8; i += 2) { const t = (TAU * i) / 8, ap = 3.0 * Math.cos(Math.PI / 8); panel(M.shade, plane([cx + ap * Math.cos(t), cy + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)]), 0, 27.6, 1.1, 4.8, 'pointed', 2) }
  lathe(P, cx, cy, [[3.0, 33.8], [3.9, 34.6], [3.9, 36.4], [2.1, 36.4]], 8, o)
  const n = D ? 12 : 6
  lathe(P, cx, cy, [[2.1, 36.4], [2.1, 40.4], [2.35, 40.6], [2.25, 41.0], [1.9, 42.0], [1.1, 42.9], [0, 43.3]], n, { smooth: true })
  if (D) for (let i = 0; i < 8; i++) {
    const t = (TAU * i) / 8
    panel(M.shade, plane([cx + 2.06 * Math.cos(t), cy + 2.06 * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)]), 0, 37.2, 0.45, 2.6, 'round', 3)
  }
  finial(M.gold, D, cx, cy, 43.1, 2.4, false)
}

/** The main minaret, 91.5 m (OSM; Wikipedia 90 m), white; stages from o12 and c32. */
function mainMinaret(M: Mats, D: boolean, cx: number, cy: number) {
  const C = M.cream, seg = D ? 6 : 2
  // base block over the riwaq, portals on its faces
  for (const [pl, L] of boxFaces(cx - 6, cx + 6, cy - 6, cy + 6)) {
    wallBand(C, M.shade, pl, 0, L, 0, 12.6, [{ c: L / 2, hw: 2.0, zb: 0, crown: 8.0, depth: 1.4, back: M.shade, door: { part: M.door, h: 4 } }], seg)
    if (D) merlons(C, pl, 0, L, 12.6, 1.0, 0.7, 1.4, 0.35, D, false)
  }
  box(null, C, cx - 6, cx + 6, cy - 6, cy + 6, 0, 12.6)
  const o = { phase: OCT }
  // shaft: tall slender pointed niches on all eight faces
  octStage(C, M.shade, cx, cy, 5.3, 12.6, 45.0, (i) => (D || i % 2 === 0 ? { c: 0, hw: 0.75, zb: 21, crown: 44.0, depth: 0.45, back: M.shade } : null), seg)
  lathe(C, cx, cy, [[5.3, 45.0], [6.4, 46.0], [6.4, 47.8], [3.8, 47.8]], 8, o)
  octStage(C, M.shade, cx, cy, 3.8, 47.8, 61.1, (i) => (D || i % 2 === 0 ? { c: 0, hw: 0.8, zb: 50.2, crown: 58.2, depth: 0.8, back: M.shade } : null), seg)
  lathe(C, cx, cy, [[3.8, 61.1], [5.0, 62.2], [5.0, 64.7], [3.15, 64.7]], 8, o)
  octStage(C, M.shade, cx, cy, 3.15, 64.7, 76.2, (i) => (D || i % 2 === 0 ? { c: 0, hw: 0.65, zb: 67.0, crown: 74.0, depth: 0.7, back: M.shade } : null), seg)
  lathe(C, cx, cy, [[3.15, 76.2], [4.3, 77.3], [4.3, 80.5], [2.35, 80.5]], 8, o)
  const n = D ? 16 : 8
  lathe(C, cx, cy, [[2.35, 80.5], [2.35, 85.6], [2.55, 85.9], [2.45, 86.3], [2.05, 87.6], [1.2, 88.6], [0, 89.0]], n, { smooth: true })
  if (D) for (let i = 0; i < 8; i++) {
    const t = (TAU * i) / 8
    panel(M.shade, plane([cx + 2.3 * Math.cos(t), cy + 2.3 * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)]), 0, 81.4, 0.5, 3.4, 'round', 3)
  }
  finial(M.gold, D, cx, cy, 88.8, 2.7)
}

// --- the pink boundary walls on the west (OSM barrier=wall buildings) ---------
function wall(M: Mats, D: boolean, A: P2, B: P2, t: number, H = 5) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], v: P2 = [-u[1] * t / 2, u[0] * t / 2]
  prism(M.pink, M.pink, [[A[0] - v[0], A[1] - v[1]], [B[0] - v[0], B[1] - v[1]], [B[0] + v[0], B[1] + v[1]], [A[0] + v[0], A[1] + v[1]]], 0, H)
}

function build(D: boolean): Mats {
  setShift(...ANCHOR)
  const M: Mats = { cream: new Part(), pink: new Part(), gold: new Part(), shade: new Part(), win: new Part(), door: new Part() }
  const tot = () => Object.values(M).reduce((t, q) => t + q.triangles, 0)
  let last = 0
  const lap = (name: string) => { if (process.env.LAPS) console.log(D ? 'D' : 'L', name, tot() - last); last = tot() }
  hall(M, D); lap('hall')
  eastBlock(M, D); lap('east')
  // riwaqs (OSM 1448565020, 1079046536; 902004824, 1185026488-93), 6.2 m wide
  riwaq(M, D, [-54.6, 60.45], [49.8, 59.8], 6.2, 1, [[-20, 14]])
  riwaq(M, D, [59.6, 59.7], [158.8, 58.4], 6.2, 1, [[123.3, 14]])
  riwaq(M, D, [-54.3, -66.85], [156, -69.25], 6.2, -1, [[-20, 14], [51.6, 11.6], [123.3, 14]])
  lap('riwaqs')
  mainMinaret(M, D, 54.7, 59.6); lap('main minaret')
  for (const [x, y] of [[-57.55, 60.5], [-57.05, -66.85], [158.65, -69.25], [161.6, 58.35]] as P2[]) cornerMinaret(M, D, x, y)
  for (const [a, b, t] of [
    [[-66.65, -33.5], [-66.65, 29.2], 2.1], [[-77.7, 28.85], [-66.65, 28.85], 1.3], [[-77.65, 28.3], [-77.65, 35.6], 1.3],
    [[-78.3, 35.5], [-59.9, 35.5], 1.3], [[-59.8, 35.0], [-59.8, 57.4], 1.5], [[-77.9, -32.45], [-66.65, -32.45], 2.0],
    [[-77.55, -33.4], [-77.55, -38.6], 0.7], [[-77.9, -39.6], [-59.1, -39.6], 1.8], [[-59.2, -39.0], [-59.2, -63.9], 1.2],
  ] as [P2, P2, number][]) wall(M, D, a, b, t)
  lap('corner minarets + walls')
  return M
}

// ----------------------------------------------------------------- write ---
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : 0.85)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.cream, material: { ...finish('sqgm-marble', 0xece4d3), floodlight: lit } },
    { part: M.pink, material: { ...finish('sqgm-sandstone', 0xdcb9a0), floodlight: (p, n) => (n[2] > 0.8 ? 0.15 : 0.6) } },
    { part: M.gold, material: finish('neon-sqgm-dome', 0xd8ad78, 0.5) },
    { part: M.shade, material: { ...finish('sqgm-shade', 0xa89d8e), floodlight: () => 0.7 } },
    { part: M.win, material: PALETTE.window },
    { part: M.door, material: { ...PALETTE.entrance, color: 0xa8714c } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Sultan Qaboos Grand Mosque', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 91.5,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`, parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('muscat-sultan-qaboos-grand-mosque.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
  await write('muscat-sultan-qaboos-grand-mosque.glb', materials(build(false)), 6500, 250 * 1024)
}
