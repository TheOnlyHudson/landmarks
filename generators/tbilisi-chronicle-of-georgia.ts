/**
 * The Chronicle of Georgia (Sakartvelos Matiane), Zurab Tsereteli, 1985-2003,
 * on the hill above the Tbilisi Sea: procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-chronicle-of-georgia.ts
 * Writes models/tbilisi-chronicle-of-georgia.glb (low) and
 * models/tbilisi-chronicle-of-georgia.detail.glb (the reliefs sculpted:
 * every king and queen on the shafts, the Gospel scenes round the bases,
 * the capitals and lintels with their panels).
 *
 * Also exports a small relief kit (Face, faceAt, quadOut, reliefLoft,
 * recessFace, writeModel) used by the other Tbilisi models of this builder
 * (tbilisi-bank-of-georgia-hq, tbilisi-tv-tower, tbilisi-opera): merge this
 * generator first.
 *
 * Frame: x east, y north, z up, metres, built turned to bearing 348.6 (the
 * pillar grid's axis, 11.4 deg west of north, from the OSM parts). Origin at
 * the area centroid of the monument outline way/707446533: 44.8104054,
 * 41.7705761. The pillar grid's centre is (6.69, 0.03) in this frame.
 *
 * Identity: sixteen square bronze pillars on a 10 m grid. Twelve stand in
 * four rows of three on the sides of a 40 m square, each row capped by a
 * deep lintel with relief panels and capitals rising through it; four stand
 * free inside the square. Each pillar: a pale granite plinth, a wide base
 * block whose faces carry the life of Christ in relief, a cornice, then a
 * shaft of cross-shaped plan (a broad arm on each face, notched corners)
 * carrying a standing king, queen or saint in high relief in an octagonal
 * frame, inscription tablets that widen the shaft at two thirds of its
 * height, and a square capital with a relief panel on each face. Dark
 * grey-green bronze, greener where the reliefs are.
 *
 * Evidence
 * - OSM (ODbL): way/707446533 (historic=monument, height 35, Zurab
 *   Tsereteli, start_date 1985): the outline; building:part ways
 *   1017618437-1017618453 (16 pillars, each 5.1 x 5.2 m, height 30) and
 *   1017618454-1017618457 (the four lintels, min_height 30, height 35). The
 *   parts sit on a regular 10 m grid to within 0.3 m, which the model
 *   follows exactly.
 * - Published: Wikipedia (en, "Chronicle of Georgia"): 16 pillars 30-35 m
 *   high, begun 1985, upper parts kings, queens and heroes, lower parts the
 *   life of Christ. https://en.wikipedia.org/wiki/Chronicle_of_Georgia
 * - Photos (all evidence):
 *   - "Georgiaren Kronikak (Tbilisi) - The Chronicle of Georgia - Tagzania -
 *     1775459623095/...623441/...623710/...624045.jpg", MSO (Tagzania user
 *     3984), CC BY-SA 4.0, Commons: four daylight views, colour. 624045 is a
 *     near-frontal elevation of a lintel row: every height below was scaled
 *     from it (0.034 m/px at the centre pillar; base block top 9.2, lintel
 *     27.2-34.4, capitals 29.4-35.0, the opening between bases 0.85 of a
 *     base's width). 623095 and 623441 show the inner pillars, the tablets
 *     and the base reliefs; 623710 the cross plan of a shaft's corners.
 *     https://commons.wikimedia.org/wiki/File:Georgiaren_Kronikak_(Tbilisi)_-_The_Chronicle_of_Georgia_-_Tagzania_-_1775459624045.jpg
 *     https://commons.wikimedia.org/wiki/File:Georgiaren_Kronikak_(Tbilisi)_-_The_Chronicle_of_Georgia_-_Tagzania_-_1775459623095.jpg
 *     https://commons.wikimedia.org/wiki/File:Georgiaren_Kronikak_(Tbilisi)_-_The_Chronicle_of_Georgia_-_Tagzania_-_1775459623441.jpg
 *     https://commons.wikimedia.org/wiki/File:Georgiaren_Kronikak_(Tbilisi)_-_The_Chronicle_of_Georgia_-_Tagzania_-_1775459623710.jpg
 *   - "The Chronicle of Georgia (1)", "(4)", "(5.1)", "(6.1)", "(3.1)", RB
 *     (Europe), CC0, Flickr: a distant view from the south-west (the two
 *     lintel rows over the trees), the capitals and lintel panels from
 *     below, the inner pillars' plain tops, a relief close up.
 *     https://www.flickr.com/photos/194996990@N05/51883253940
 *     https://www.flickr.com/photos/194996990@N05/51882685873
 *     https://www.flickr.com/photos/194996990@N05/51883262010
 *     https://www.flickr.com/photos/194996990@N05/51883264905
 *   - "Chronicles of Georgia 2026 1431.jpg", Vitaly Zdanevich, CC BY 4.0:
 *     from the city below, the silhouette on the hill.
 *     https://commons.wikimedia.org/wiki/File:Chronicles_of_Georgia_2026_1431.jpg
 * - Colour, sampled from the Tagzania photos: sunlit bronze #8a8e8c-#98a0a2,
 *   shaded #59616e-#646c77, the base reliefs' patina #81857c, greener in
 *   623441; the plinths pale pink granite #e2d0c3; the platform grey stone
 *   paving and steps (#a9a8a2). Every relief panel is drawn as the photos
 *   read it: a bold bronze frame standing 0.3 m proud round a dark ground
 *   (#4f5a56, a real recess in the detail model) with the figures proud of
 *   it in a lighter bronze.
 * - Look-only (NC/ND, not used for any number): Flickr "Chronicle of
 *   Georgia" by Demipoulpe (BY-NC-SA), Marco Fieber (BY-NC-ND), Jelger
 *   Groeneveld (BY-NC).
 *
 * Numbers: the grid, the 5.1 m base footprints and the 35 m total from OSM;
 * the 30 m free pillars from OSM; every height in between estimated from
 * the Tagzania elevation photo (base block to 9.6 m, its cornice stepping
 * out to 5.9 m); the shafts 4.5 m across with arms 3.1 m wide and 0.45 m
 * notches, estimated from the photos. The reliefs are invented as to subject (a
 * standing robed figure per shaft face, groups of figures on the bases and
 * panels), true as to their size, place and depth. Doubts: the inner
 * pillars' capitals are seen only from below; the platform's height (0.9 m,
 * three steps) is from the photo of the steps by the car park. Floodlit at
 * night (_FLOODLIGHT on the bronze).
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { smooth, ellipsoid, tube } from './nyc-columbus-monument'
import { polyTris } from './berlin-oberbaum-bridge'

type XY = [number, number]
const TAU = Math.PI * 2

// ===========================================================================
// Relief kit (shared with this builder's other Tbilisi generators)
// ===========================================================================

/** A vertical (or any) plane: origin, the across direction u, the outward normal n; z is world up. */
export type Face = { o: V3; u: V3; n: V3 }
/** A point on a face: s across, z up (absolute), d out from the plane. */
export const faceAt = (f: Face, s: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z + f.n[2] * d]
/** The four faces of an axis-aligned square of half-size h about (cx, cy): +x, +y, -x, -y. */
export function squareFaces(cx: number, cy: number, h: number): Face[] {
  return [
    { o: [cx + h, cy, 0], u: [0, 1, 0], n: [1, 0, 0] },
    { o: [cx, cy + h, 0], u: [-1, 0, 0], n: [0, 1, 0] },
    { o: [cx - h, cy, 0], u: [0, -1, 0], n: [-1, 0, 0] },
    { o: [cx, cy - h, 0], u: [1, 0, 0], n: [0, -1, 0] },
  ]
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A triangle wound so that it faces `out` (a direction). */
export function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), out) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A quad wound so that it faces `out`. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  triOut(p, a, b, c, out)
  triOut(p, a, c, d, out)
}

/**
 * A face plate with holes, flush on plane `f` at offset d0: the outline and
 * holes are (s, z) rings. Each hole becomes a recess `depth` deep: reveals
 * and a back plate (on `back`, defaulting to `p`). Only the outward side is
 * drawn: it is the skin of a solid.
 */
export function recessFace(p: Part, f: Face, outline: XY[], holes: XY[][], depth: number, d0 = 0, back: Part = p, reveal: Part = p) {
  for (const [a, b, c] of polyTris(outline, holes)) triOut(p, faceAt(f, a[0], a[1], d0), faceAt(f, b[0], b[1], d0), faceAt(f, c[0], c[1], d0), f.n)
  for (const h of holes) {
    const cx = h.reduce((s, q) => s + q[0], 0) / h.length, cz = h.reduce((s, q) => s + q[1], 0) / h.length
    for (let i = 0; i < h.length; i++) {
      const a = h[i], b = h[(i + 1) % h.length]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      // a reveal faces into the hole: toward the hole's centre
      const inward = sub3(faceAt(f, cx, cz, 0), faceAt(f, m[0], m[1], 0))
      quadOut(reveal, faceAt(f, a[0], a[1], d0), faceAt(f, b[0], b[1], d0), faceAt(f, b[0], b[1], d0 - depth), faceAt(f, a[0], a[1], d0 - depth), inward)
    }
    for (const [a, b, c] of polyTris(h)) triOut(back, faceAt(f, a[0], a[1], d0 - depth), faceAt(f, b[0], b[1], d0 - depth), faceAt(f, c[0], c[1], d0 - depth), f.n)
  }
}

/** An octagon (a rectangle with chamfered corners) in (s, z). */
export const octagon = (s0: number, s1: number, z0: number, z1: number, c: number): XY[] => [
  [s0 + c, z0], [s1 - c, z0], [s1, z0 + c], [s1, z1 - c], [s1 - c, z1], [s0 + c, z1], [s0, z1 - c], [s0, z0 + c],
]
export const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/**
 * A relief mass standing out of face `f`: half-elliptic sections across the
 * face at each ring (z, s centre, half-width w, depth out), lofted bottom to
 * top with closed top and bottom. `seg` segments per half section. Its back
 * is on the plane d0, so it reads as carved from the wall.
 */
export type Ring = { z: number; s: number; w: number; d: number }
export function reliefLoft(p: Part, f: Face, rings: Ring[], seg: number, d0 = 0, bottomCap = true) {
  const sec = (r: Ring) => Array.from({ length: seg + 1 }, (_, k) => {
    const t = (Math.PI * k) / seg
    return faceAt(f, r.s - r.w * Math.cos(t), r.z, d0 + r.d * Math.sin(t))
  })
  const S = rings.map(sec)
  for (let i = 0; i < rings.length - 1; i++) {
    const a = S[i], b = S[i + 1]
    for (let k = 0; k < seg; k++) {
      // outward: away from the axis of the mass, toward the viewer
      const t = (Math.PI * (k + 0.5)) / seg
      const out: V3 = [0, 0, 0]
      const rad = [-Math.cos(t), Math.sin(t)]
      for (let j = 0; j < 3; j++) out[j] = f.u[j] * rad[0] + f.n[j] * rad[1]
      const dz = rings[i + 1].z - rings[i].z
      const dw = (rings[i + 1].w - rings[i].w) * Math.abs(Math.cos(t)) + (rings[i + 1].d - rings[i].d) * Math.sin(t)
      out[2] += dz !== 0 ? -dw / dz : 0
      quadOut(p, a[k], a[k + 1], b[k + 1], b[k], out)
    }
  }
  // caps: fans from the back centre
  for (const [i, up] of [[0, false], [rings.length - 1, true]] as [number, boolean][]) {
    const r = rings[i]
    if (r.w < 1e-3 || (!up && !bottomCap)) continue
    const c = faceAt(f, r.s, r.z, d0), ring = S[i]
    for (let k = 0; k < seg; k++) triOut(p, c, ring[k], ring[k + 1], [0, 0, up ? 1 : -1])
  }
}

/** Box from corners, all six faces (or five without bottom). */
export function boxXY(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  if (bottom) p.cap(r(z0), false)
}

/** Write a GLB, check the budget, print a line. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, meta: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter((q) => q.part.triangles > 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...meta })
  const tris = used.reduce((s, q) => s + q.part.triangles, 0)
  if (process.env.PARTS) console.log(file, tris, glb.length, used.map((q) => `${q.material.name}:${q.part.triangles}`).join(' '))
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles > ${maxTris}`)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes > ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

// ===========================================================================
// The Chronicle
// ===========================================================================

const CX = 6.69, CY = 0.03 // the grid's centre
const G = 10 // grid spacing
// heights (m above y = 0)
const PLAT = 0.9 // platform top
const PL1 = 1.6 // plinth top
const B1 = 9.6, BC0 = 8.8 // base block top; its cornice
const LINT0 = 27.2, LINT1 = 34.4 // the lintels
const CAP0 = 29.4, CAP1 = 35.0 // the row pillars' capitals
const ICAP0 = 26.4, ICAP1 = 30.0 // the free pillars' capitals
// plan half-widths
const HPL = 2.85, HB = 2.55, HBC = 2.95, W = 2.25, ARM = 1.55, NOTCH = 0.45, HCAP = 2.55, LT = 2.1

type Parts = { bronze: Part; relief: Part; recess: Part; stone: Part; paving: Part }

/** Deterministic variety. */
const hash = (a: number, b: number) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * A standing robed figure in high relief on face f, feet at z0, height h,
 * centred at s. `pose` picks the arms and what they hold; `crown` a king's
 * crown; `halo` a disc behind the head.
 */
function figure(q: Part, f: Face, s: number, z0: number, h: number, d0: number, detail: boolean, pose: number, o: { crown?: boolean; halo?: boolean; depth?: number; minor?: boolean; wide?: number } = {}) {
  const D = o.depth ?? 1, K = o.wide ?? 1
  const R = (zf: number, wf: number, df: number, ds = 0): Ring => ({ z: z0 + zf * h, s: s + ds * h * K, w: wf * h * K, d: df * h * D })
  if (!detail) {
    // robe to the shoulders, a pinched neck, the head: bold enough for 200 px
    reliefLoft(q, f, [R(0, 0.11, 0.06), R(0.78, 0.115, 0.07), R(0.86, 0.05, 0.05), R(1, 0.0, 0.03)], 3, d0, false)
    return
  }
  const lean = (hash(pose, 3) - 0.5) * 0.02
  if (o.minor) {
    // a small figure in a scene: robe, shoulders, a round head
    reliefLoft(q, f, [R(0, 0.12, 0.05), R(0.55, 0.09, 0.065, lean * 0.6), R(0.78, 0.12, 0.06, lean), R(0.82, 0.05, 0.04, lean)], 4, d0, false)
    const hc0 = faceAt(f, s + lean * h * K, z0 + 0.9 * h, d0 + 0.045 * h * D)
    ellipsoid(q, [hc0[0], hc0[1], hc0[2]], [0.06 * h, 0.06 * h, 0.075 * h], 4, 3)
    return
  }
  // the robe and body: a tapered loft, hem flaring, waist in, chest and shoulders out
  reliefLoft(q, f, [
    R(0.0, 0.11, 0.05, 0), R(0.3, 0.09, 0.065, lean * 0.3), R(0.55, 0.08, 0.07, lean * 0.65),
    R(0.7, 0.1, 0.075, lean * 0.85), R(0.78, 0.115, 0.06, lean), R(0.815, 0.06, 0.05, lean),
  ], 6, d0, false)
  // the neck and head: an ellipsoid sitting on the shoulders
  const hc = faceAt(f, s + lean * h * K, z0 + 0.9 * h, d0 + 0.045 * h * D)
  const hr = 0.05 * h * Math.min(1, K + 0.15)
  ellipsoid(q, [hc[0], hc[1], hc[2]], [hr, hr, 0.065 * h], 7, 4)
  if (o.crown) {
    // a crown: a short drum on the head with three points
    const cz = z0 + 0.955 * h
    reliefLoft(q, f, [{ z: cz, s: s + lean * h * K, w: hr * 0.96, d: 0.07 * h * D }, { z: cz + 0.035 * h, s: s + lean * h * K, w: hr * 1.04, d: 0.075 * h * D }], 5, d0)
  }
  if (o.halo) {
    // a halo: a flat disc behind the head
    const c = faceAt(f, s + lean * h * K, z0 + 0.905 * h, d0 + 0.01)
    const r = 0.085 * h
    for (let k = 0; k < 8; k++) {
      const a0 = (k / 8) * TAU, a1 = ((k + 1) / 8) * TAU
      const pt = (a: number): V3 => [c[0] + f.u[0] * r * Math.cos(a), c[1] + f.u[1] * r * Math.cos(a), c[2] + r * Math.sin(a)]
      const pf = (a: number): V3 => { const v = pt(a); return [v[0] + f.n[0] * 0.08, v[1] + f.n[1] * 0.08, v[2]] }
      triOut(q, pf(a0), pf(a1), [c[0] + f.n[0] * 0.08, c[1] + f.n[1] * 0.08, c[2]], f.n)
      const rad: V3 = [f.u[0] * Math.cos((a0 + a1) / 2), f.u[1] * Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)]
      quadOut(q, pt(a0), pt(a1), pf(a1), pf(a0), rad)
    }
  }
  // arms: tubes from the shoulders, lying on the body, in one of four poses
  const P = (sf: number, zf: number, df: number): V3 => faceAt(f, s + (sf + lean) * h * K, z0 + zf * h, d0 + df * h * D)
  const kind = Math.floor(pose * 4) % 4
  const r0 = 0.028 * h * K, r1 = 0.022 * h * K
  const arm = (pts: V3[]) => tube(q, pts, pts.map((_, i) => lerp(r0, r1, i / (pts.length - 1))), 4)
  if (kind === 0) {
    // hands together at the chest, holding a book
    arm([P(-0.1, 0.76, 0.06), P(-0.11, 0.64, 0.08), P(-0.03, 0.6, 0.11)])
    arm([P(0.1, 0.76, 0.06), P(0.11, 0.64, 0.08), P(0.03, 0.6, 0.11)])
    reliefLoft(q, f, [{ z: z0 + 0.56 * h, s: s + lean * h * K, w: 0.05 * h * K, d: 0.13 * h * D }, { z: z0 + 0.66 * h, s: s + lean * h * K, w: 0.05 * h * K, d: 0.13 * h * D }], 2, d0)
  } else if (kind === 1) {
    // a sword held upright before him
    arm([P(-0.1, 0.76, 0.06), P(-0.09, 0.62, 0.09), P(0.0, 0.55, 0.11)])
    arm([P(0.1, 0.76, 0.06), P(0.1, 0.62, 0.08), P(0.02, 0.56, 0.11)])
    tube(q, [P(0.01, 0.1, 0.1), P(0.01, 0.62, 0.12)], [0.012 * h, 0.012 * h], 4)
    tube(q, [P(-0.05, 0.53, 0.12), P(0.07, 0.53, 0.12)], [0.012 * h, 0.012 * h], 4)
  } else if (kind === 2) {
    // one hand raised in blessing, the other holding a scroll at the hip
    arm([P(-0.1, 0.76, 0.06), P(-0.15, 0.66, 0.07), P(-0.12, 0.78, 0.1), P(-0.09, 0.86, 0.1)])
    arm([P(0.1, 0.76, 0.06), P(0.11, 0.6, 0.07), P(0.06, 0.5, 0.1)])
    tube(q, [P(0.03, 0.44, 0.11), P(0.09, 0.56, 0.11)], [0.02 * h, 0.02 * h], 6)
  } else {
    // holding a model church on the forearm (a founder)
    arm([P(-0.1, 0.76, 0.06), P(-0.11, 0.62, 0.08), P(0.0, 0.62, 0.11)])
    arm([P(0.1, 0.76, 0.06), P(0.13, 0.62, 0.08), P(0.05, 0.64, 0.12)])
    reliefLoft(q, f, [{ z: z0 + 0.63 * h, s: s + (0.03 + lean) * h * K, w: 0.06 * h * K, d: 0.16 * h * D }, { z: z0 + 0.7 * h, s: s + (0.03 + lean) * h * K, w: 0.055 * h * K, d: 0.15 * h * D }, { z: z0 + 0.76 * h, s: s + (0.03 + lean) * h * K, w: 0.005 * h * K, d: 0.02 * h * D }], 4, d0)
  }
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** A scene on a panel: a row of n robed figures (heads haloed now and then), feet on z0. */
function scene(q: Part, f: Face, s0: number, s1: number, z0: number, h: number, d0: number, detail: boolean, seed: number, n = 3) {
  if (!detail) {
    // the group as one mass with two crowns of heads
    const sm = (s0 + s1) / 2, w = (s1 - s0) / 2
    reliefLoft(q, f, [{ z: z0, s: sm, w: w * 0.9, d: 0.3 }, { z: z0 + h * 0.85, s: sm, w: w * 0.75, d: 0.3 }], 2, d0, false)
    return
  }
  for (let i = 0; i < n; i++) {
    const s = lerp(s0, s1, (i + 0.5) / n) + (hash(seed, i) - 0.5) * 0.25
    const hh = h * (0.78 + 0.22 * hash(seed + 1, i))
    figure(q, f, s, z0, hh, d0, true, hash(seed + 2, i), { depth: 0.7, minor: true, wide: 1.25 })
  }
}

/** Grow a convex counter-clockwise (s, z) polygon outward by d. */
function grow(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i - 1 + n) % n], b = poly[(i + 1) % n]
    const e1: XY = [p[0] - a[0], p[1] - a[1]], e2: XY = [b[0] - p[0], b[1] - p[1]]
    const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
    const n1: XY = [e1[1] / l1, -e1[0] / l1], n2: XY = [e2[1] / l2, -e2[0] / l2]
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}

/**
 * A framed relief panel on face f: a bold bronze frame `fw` wide standing
 * `fd` proud round the panel `poly`, the panel dark. In the detail model
 * the panel is a real recess `depth` deep (the face plate is drawn here
 * too, over `plate`); in the low model a dark plate on the face.
 */
function framedPanel(P: Parts, f: Face, poly: XY[], fw: number, fd: number, detail: boolean, plate?: XY[], depth = 0.35) {
  const out = grow(poly, fw), n = poly.length
  if (detail && plate) recessFace(P.bronze, f, plate, [poly], depth, 0, P.recess, P.bronze)
  else for (let j = 1; j < n - 1; j++) triOut(P.recess, faceAt(f, poly[0][0], poly[0][1], 0.03), faceAt(f, poly[j][0], poly[j][1], 0.03), faceAt(f, poly[j + 1][0], poly[j + 1][1], 0.03), f.n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const A = (q: XY, d: number) => faceAt(f, q[0], q[1], d)
    quadOut(P.bronze, A(poly[i], fd), A(poly[j], fd), A(out[j], fd), A(out[i], fd), f.n)
    if (detail) {
      // the frame's inner reveal down to the face: the deep shadow line (the outer edge is left open: the face is behind it)
      const mo: XY = [(out[i][0] + out[j][0]) / 2 - (poly[i][0] + poly[j][0]) / 2, (out[i][1] + out[j][1]) / 2 - (poly[i][1] + poly[j][1]) / 2]
      const dirO = sub3(A([mo[0], mo[1]], 0), A([0, 0], 0))
      quadOut(P.bronze, A(poly[i], 0), A(poly[j], 0), A(poly[j], fd), A(poly[i], fd), [-dirO[0], -dirO[1], -dirO[2]])
    }
  }
}

function pillar(P: Parts, cx: number, cy: number, row: boolean, idx: number, detail: boolean) {
  const { bronze, relief, stone } = P
  const top = row ? CAP1 : ICAP1
  const cap0 = row ? CAP0 : ICAP0
  const shaftTop = cap0
  // ---- plinth (pale granite) ----
  boxXY(stone, cx - HPL, cy - HPL, cx + HPL, cy + HPL, PLAT - 0.3, PL1)
  // ---- base block, its Gospel scenes in bold frames ----
  const fb = squareFaces(cx, cy, HB)
  const sq = (z: number): V3[] => [[cx - HB, cy - HB, z], [cx + HB, cy - HB, z], [cx + HB, cy + HB, z], [cx - HB, cy + HB, z]]
  if (!detail) bronze.loft([sq(PL1), sq(BC0)])
  for (const [i, f] of fb.entries()) {
    const panel = rect(-2.1, 2.1, PL1 + 0.5, BC0 - 0.5)
    framedPanel(P, f, panel, 0.38, 0.3, detail, rect(-HB, HB, PL1, BC0), 0.35)
    scene(relief, f, -1.95, 1.95, PL1 + 0.6, 5.7, detail ? -0.35 : 0.03, detail, idx * 4 + i)
  }
  // cornice
  boxXY(bronze, cx - HBC, cy - HBC, cx + HBC, cy + HBC, BC0, B1)
  // ---- the shaft: cross plan, a figure on each arm ----
  const cr: XY[] = []
  for (let k = 0; k < 4; k++) {
    // quarter turns of one corner notch, counter-clockwise from +x
    const rot = (x: number, y: number): XY => {
      const c = Math.round(Math.cos((k * Math.PI) / 2)), s = Math.round(Math.sin((k * Math.PI) / 2))
      return [cx + x * c - y * s, cy + x * s + y * c]
    }
    cr.push(rot(W, -ARM), rot(W, ARM), rot(W - NOTCH, ARM), rot(W - NOTCH, W - NOTCH), rot(ARM, W - NOTCH))
  }
  const ring = cr
  // side walls except the arm fronts, which carry the figure panels
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const isFront = i % 5 === 0
    if (isFront) continue
    quadOut(bronze, [a[0], a[1], B1], [b[0], b[1], B1], [b[0], b[1], shaftTop], [a[0], a[1], shaftTop], [b[1] - a[1], a[0] - b[0], 0])
  }
  const fa = squareFaces(cx, cy, W)
  for (const [i, f] of fa.entries()) {
    const fz0 = B1 + 1.0, fz1 = shaftTop - 1.4
    const seed = idx * 4 + i
    // the figure fills the upper three fifths of the frame, an emblem below it
    const fh = (fz1 - fz0) * 0.6, fb = fz1 - 0.4 - fh
    const oct = octagon(-ARM + 0.32, ARM - 0.32, fz0, fz1, 0.6)
    if (!detail) quadOut(bronze, faceAt(f, -ARM, B1), faceAt(f, ARM, B1), faceAt(f, ARM, shaftTop), faceAt(f, -ARM, shaftTop), f.n)
    framedPanel(P, f, oct, 0.3, 0.3, detail, rect(-ARM, ARM, B1, shaftTop), 0.4)
    if (detail) {
      figure(relief, f, 0, fb, fh, -0.4, true, hash(seed, 7), { crown: hash(seed, 9) > 0.35, halo: hash(seed, 9) <= 0.35, wide: 0.85, depth: 0.8 })
      // the emblem: a walled city, flames or a beast, as one carved mass
      reliefLoft(relief, f, [{ z: fz0 + 0.8, s: 0, w: 0.75, d: 0.3 }, { z: fb - 0.6, s: 0, w: 0.6, d: 0.45 }, { z: fb - 0.2, s: 0, w: 0.25, d: 0.25 }], 3, -0.4, false)
    } else {
      figure(relief, f, 0, fb, fh, 0.03, false, 0, { wide: 0.95 })
    }
  }
  // the tablets in the notches: they widen the shaft at two thirds of its height
  const tz0 = B1 + (shaftTop - B1) * 0.6, tz1 = tz0 + 3.6
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = cx + sx * (W - NOTCH), x1 = cx + sx * (W + 0.15), y0 = cy + sy * ARM, y1 = cy + sy * (W + 0.15)
    // top, bottom and the two outer faces; the inner two are against the shaft
    const X0 = Math.min(x0, x1), X1 = Math.max(x0, x1), Y0 = Math.min(y0, y1), Y1 = Math.max(y0, y1)
    const xo = sx > 0 ? X1 : X0, yo = sy > 0 ? Y1 : Y0
    if (detail) quadOut(bronze, [X0, Y0, tz1], [X1, Y0, tz1], [X1, Y1, tz1], [X0, Y1, tz1], [0, 0, 1])
    if (detail) quadOut(bronze, [X0, Y0, tz0], [X1, Y0, tz0], [X1, Y1, tz0], [X0, Y1, tz0], [0, 0, -1])
    quadOut(bronze, [xo, Y0, tz0], [xo, Y1, tz0], [xo, Y1, tz1], [xo, Y0, tz1], [sx, 0, 0])
    quadOut(bronze, [X0, yo, tz0], [X1, yo, tz0], [X1, yo, tz1], [X0, yo, tz1], [0, sy, 0])
  }
  // ---- the capital ----
  const fc = squareFaces(cx, cy, HCAP)
  if (row) {
    // in a row the capital rises through the lintel: draw it whole, the lintel butts against it
    boxXY(bronze, cx - HCAP, cy - HCAP, cx + HCAP, cy + HCAP, cap0, top, true)
  } else {
    boxXY(bronze, cx - HCAP, cy - HCAP, cx + HCAP, cy + HCAP, cap0, top, true)
  }
  for (const [i, f] of fc.entries()) {
    const z0 = cap0 + 0.7, z1 = top - 0.7
    const panel = rect(-1.95, 1.95, z0, z1)
    framedPanel(P, f, panel, 0.35, 0.3, detail)
    if (detail) scene(relief, f, -1.6, 1.6, z0 + 0.2, z1 - z0 - 0.4, 0.03, true, 1000 + idx * 4 + i, 1)
  }
}

/** A short bar proud of face f, (s0..s1) x (z0..z1), `d` deep: four sides and the front. */
function frameBar(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const A = (s: number, z: number, dd: number) => faceAt(f, s, z, dd)
  quadOut(p, A(s0, z0, d), A(s1, z0, d), A(s1, z1, d), A(s0, z1, d), f.n)
  quadOut(p, A(s0, z0, 0), A(s1, z0, 0), A(s1, z0, d), A(s0, z0, d), [0, 0, -1])
  quadOut(p, A(s0, z1, 0), A(s1, z1, 0), A(s1, z1, d), A(s0, z1, d), [0, 0, 1])
  quadOut(p, A(s0, z0, 0), A(s0, z1, 0), A(s0, z1, d), A(s0, z0, d), f.u.map((v) => -v) as V3)
  quadOut(p, A(s1, z0, 0), A(s1, z1, 0), A(s1, z1, d), A(s1, z0, d), f.u)
}

/** A lintel along a row: between the capitals, with relief panels on both long faces. */
function lintel(P: Parts, ax: number, ay: number, bx: number, by: number, idx: number, detail: boolean) {
  const { bronze, relief } = P
  // the row runs from capital a to capital b (end pillars), along x or y
  const alongX = Math.abs(bx - ax) > Math.abs(by - ay)
  const lo = alongX ? Math.min(ax, bx) : Math.min(ay, by), hi = alongX ? Math.max(ax, bx) : Math.max(ay, by)
  const c = alongX ? ay : ax
  for (let k = 0; k < 2; k++) {
    const s0 = lo + k * G + W, s1 = lo + (k + 1) * G - W
    const x0 = alongX ? s0 : c - LT, x1 = alongX ? s1 : c + LT, y0 = alongX ? c - LT : s0, y1 = alongX ? c + LT : s1
    // the soffit, the top and the two faces (the ends are inside the capitals)
    const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
    bronze.cap(r(LINT1), true)
    bronze.cap(r(LINT0), false)
    // the ends show in the shafts' notches
    const ends: [V3[], V3][] = alongX
      ? [[[[x0, y0, LINT0], [x0, y1, LINT0], [x0, y1, LINT1], [x0, y0, LINT1]], [-1, 0, 0]], [[[x1, y0, LINT0], [x1, y1, LINT0], [x1, y1, LINT1], [x1, y0, LINT1]], [1, 0, 0]]]
      : [[[[x0, y0, LINT0], [x1, y0, LINT0], [x1, y0, LINT1], [x0, y0, LINT1]], [0, -1, 0]], [[[x0, y1, LINT0], [x1, y1, LINT0], [x1, y1, LINT1], [x0, y1, LINT1]], [0, 1, 0]]]
    if (detail) for (const [q, nn] of ends) quadOut(bronze, q[0], q[1], q[2], q[3], nn)
    const faces: Face[] = alongX
      ? [{ o: [(s0 + s1) / 2, c + LT, 0], u: [-1, 0, 0], n: [0, 1, 0] }, { o: [(s0 + s1) / 2, c - LT, 0], u: [1, 0, 0], n: [0, -1, 0] }]
      : [{ o: [c + LT, (s0 + s1) / 2, 0], u: [0, 1, 0], n: [1, 0, 0] }, { o: [c - LT, (s0 + s1) / 2, 0], u: [0, -1, 0], n: [-1, 0, 0] }]
    const half = (s1 - s0) / 2
    for (const [j, f] of faces.entries()) {
      const panel = rect(-half + 0.45, half - 0.45, LINT0 + 1.0, LINT1 - 0.6)
      if (!detail) quadOut(bronze, faceAt(f, -half, LINT0), faceAt(f, half, LINT0), faceAt(f, half, LINT1), faceAt(f, -half, LINT1), f.n)
      framedPanel(P, f, panel, 0.35, 0.3, detail, rect(-half, half, LINT0, LINT1), 0.3)
      if (detail) scene(relief, f, -half + 0.7, half - 0.7, LINT0 + 1.1, LINT1 - LINT0 - 1.9, -0.3, true, 2000 + idx * 8 + k * 2 + j)
      else reliefLoft(relief, f, [{ z: LINT0 + 1.1, s: 0, w: half - 1.0, d: 0.3 }, { z: LINT1 - 0.8, s: 0, w: half - 1.6, d: 0.2 }], 2, 0.03, false)
    }
  }
}

/** The platform: three steps up to the paving round the grid. */
function platform(stone: Part, detail: boolean) {
  const h = 27
  for (let k = 0; k < 3; k++) {
    const e = h + (2 - k) * 0.45
    const z1 = 0.3 * (k + 1)
    const r = (z: number): V3[] => [[CX - e, CY - e, z], [CX + e, CY - e, z], [CX + e, CY + e, z], [CX - e, CY + e, z]]
    // walls in 9 m pieces so they follow the ground (see terrain.ts)
    const ring = r(0)
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      const nSeg = 3
      for (let j = 0; j < nSeg; j++) {
        const p0: V3 = [lerp(a[0], b[0], j / nSeg), lerp(a[1], b[1], j / nSeg), 0], p1: V3 = [lerp(a[0], b[0], (j + 1) / nSeg), lerp(a[1], b[1], (j + 1) / nSeg), 0]
        stone.quad(p0, p1, [p1[0], p1[1], z1], [p0[0], p0[1], z1])
      }
    }
    // tread: the ring between this step and the next; the top step is the platform itself
    const ein = k < 2 ? h + (1 - k) * 0.45 : 0
    if (k < 2) {
      const o = r(z1), i2: V3[] = [[CX - ein, CY - ein, z1], [CX + ein, CY - ein, z1], [CX + ein, CY + ein, z1], [CX - ein, CY + ein, z1]]
      for (let s = 0; s < 4; s++) { const t = (s + 1) % 4; quadOut(stone, i2[s], o[s], o[t], i2[t], [0, 0, 1]) }
    } else {
      // the plaza: split into a grid so it follows the ground too
      const N = 3
      for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
        const xa = CX - e + (2 * e * a) / N, xb = CX - e + (2 * e * (a + 1)) / N, ya = CY - e + (2 * e * b) / N, yb = CY - e + (2 * e * (b + 1)) / N
        stone.quad([xa, ya, z1], [xb, ya, z1], [xb, yb, z1], [xa, yb, z1])
      }
    }
  }
}

export function build(detail: boolean) {
  const P: Parts = { bronze: new Part(), relief: new Part(), recess: new Part(), stone: new Part(), paving: new Part() }
  platform(P.paving, detail)
  let idx = 0
  // the four rows of three, on the sides of the 40 m square
  const rows: Array<[number, number][]> = [
    [-1, 0, 1].map((i) => [CX + i * G, CY - 2 * G]), // south
    [-1, 0, 1].map((i) => [CX + 2 * G, CY + i * G]), // east
    [-1, 0, 1].map((i) => [CX + i * G, CY + 2 * G]), // north
    [-1, 0, 1].map((i) => [CX - 2 * G, CY + i * G]), // west
  ] as any
  for (const [r, row] of rows.entries()) {
    for (const [x, y] of row) pillar(P, x, y, true, idx++, detail)
    lintel(P, row[0][0], row[0][1], row[2][0], row[2][1], r, detail)
  }
  // the four free pillars inside
  for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pillar(P, CX + i * G, CY + j * G, false, idx++, detail)
  const relief = new Part()
  smooth(relief, (q) => { for (let i = 0; i < P.relief.pos.length; i += 9) q.tri([P.relief.pos[i], -P.relief.pos[i + 2], P.relief.pos[i + 1]], [P.relief.pos[i + 3], -P.relief.pos[i + 5], P.relief.pos[i + 4]], [P.relief.pos[i + 6], -P.relief.pos[i + 8], P.relief.pos[i + 7]]) }, 80)
  return { ...P, relief }
}

export const COLORS = {
  bronze: 0x6f7774, // sunlit #8a8e8c..#98a0a2, shaded #59616e..#646c77: a dark grey-green bronze
  relief: 0x76807b, // the figures standing proud: the bronze, a touch greener (#81857c sampled)
  stone: 0xd8c6b8, // the plinths' pale pink granite #e2d0c3
  recess: 0x4f5a56, // the panels' grounds, in shadow behind the frames
  paving: 0xa9a8a2, // the platform's grey stone paving and steps
}

if (import.meta.main) {
  const flood = (zTop: number) => (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : Math.max(0.35, 1 - p[2] / (zTop * 1.4)))
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.bronze, material: detail ? { ...finish('chronicle-bronze', COLORS.bronze, 0.6), floodlight: flood(35) } : finish('chronicle-bronze', COLORS.bronze, 0.6) },
      { part: p.relief, material: finish('chronicle-relief', COLORS.relief, 0.6) },
      { part: p.recess, material: finish('chronicle-recess', COLORS.recess, 0.6) },
      { part: p.stone, material: { ...finish('chronicle-granite', COLORS.stone) } },
      { part: p.paving, material: finish('chronicle-paving', COLORS.paving) },
    ]
  }
  const meta = { bearing: 348.6, osm: 'way/707446533', height: 35 }
  await writeModel('tbilisi-chronicle-of-georgia.glb', 'The Chronicle of Georgia', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-chronicle-of-georgia.detail.glb', 'The Chronicle of Georgia', make(true), meta, 40000, 1536 * 1024)
}
