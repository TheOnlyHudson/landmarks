/**
 * Yoyogi National Gymnasium (国立代々木競技場), Jinnan, Shibuya, Tokyo
 * (Kenzō Tange with Yoshikatsu Tsuboi, 1964): procedural, CC0-1.0.
 * bun generators/tokyo-yoyogi-gymnasium.ts
 *
 * One model for both halls, ~200 m apart on their shared podium: the First
 * Gymnasium (two masts, the swooping ridge, two crescents turned 180° about
 * each other) and the Second (Annex) Gymnasium (one mast, a spiral roof).
 * Writes models/tokyo-yoyogi-gymnasium.glb (low) and .detail.glb (zoom 16,
 * every rib, louvres across the ridge, more fins and cable segments, and
 * the roof's underside).
 *
 * Frame: x east, y north, z up (bearing 0). Origin at 139.6998033,
 * 35.6673672, the area centroid of the two OSM outlines together; each hall
 * is built about its own outline's centroid and moved into place.
 * Elevation 0: the halls stand on the plaza, which Mapterhorn shows ~6 m
 * above the low street corner in the box (terrain check: ok).
 *
 * OSM (all replaced): way/101925760 First Gymnasium (height 30.2 tag, 3
 * levels: too low, see below), way/1069271775 its "roof section" part along
 * the ridge (40.37 m, the published height), way/72541058 Second Gymnasium.
 * Wikidata Q1069457 (the complex).
 *
 * Published (ja.wikipedia 国立代々木競技場): First Gymnasium 40.37 m high,
 * a suspension roof hung from two main pillars; Second Gymnasium 42.29 m,
 * hung from one pillar. Tange's practice text (as quoted by ArchEyes): two
 * main cables 33 cm across between two masts 126 m apart, ~40 m high.
 *
 * Measured on OSM (local metres): masts at ±(65.3, 3.6) from the First
 * Gym's centroid (the outline's notches; 131 m apart, near the published
 * 126 m); anchor tips at ±(112.7, 15.6) (the two OSM tips averaged for the
 * 180° symmetry); each crescent's arc fits a circle r 71.7 m centred
 * ±(2.1, 12.2) m (residual < 2 m); the tails' outer edges are tangent to it.
 * Second Gym: the outline used as drawn; mast at its notch (29, 5.6).
 *
 * Estimated from photos (Kakidai's and Ocdp's side views, scaled on the
 * 40.4 m mast): the main cables leave the masts at ~29.5 m and sag to
 * ~19.5 m at mid-span, steep near the masts; the concourse ring and roof
 * edge at ~10.5 m; the white edge beam sweeping from ~27 m at the mast to
 * the ring over ~34 m of arc; the roof concave (rib profile (1-t)^2.5);
 * the canopy edge over the glazed entrances ~4.5 m, anchors ~3 m; the
 * ridge skylight a raised band 8.4 m wide (OSM part ~9 m). Masts ~6 x 6 m
 * at the foot, a 4.8 m blade above the saddles. Second Gym: wall ~10 m,
 * buttress ~17 m, roof on the mast from ~14 m (south) rising to ~37 m
 * (north, where the spiral closes), main cable from the buttress to the mast.
 * Window bays on the ring (7.2 m) and fins: estimated.
 *
 * Colours (daylight photos): roof grey with a mauve cast (#afa7ad; it reads
 * pinkish in Kakidai's, plain grey in Ocdp's), ribs, cables and steelwork
 * dark grey (#6f727a), concrete pale warm grey (#d9d5cd), the ridge's
 * louvres and the steep strip beside them dark (glass, #646b74).
 * Night: the ring's windows glow (window); the ridge skylight stays dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Yoyogi National Gymnasium 1.jpg, Kakidai, CC BY-SA 4.0 (First, from SW)
 *  - Yoyogi National Gymnasium.jpg, Kakidai, CC BY-SA 4.0 (First, end view)
 *  - Yoyogi National Gymnasium 2.jpg, Kakidai, CC BY-SA 4.0 (Second, from S)
 *  - Yoyogi National Gymnasium 2013.jpg, Ocdp, CC0 (First, side)
 *  - Yoyogi-National-First-Gymnasium-04.jpg, Rs1421, CC BY-SA 3.0 (mast, canopy)
 *  - Yoyogi-National-Second-Gymnasium-01.jpg, Rs1421, CC BY-SA 3.0 (Second, from E)
 *  - Yoyogi National Gymnasium, from west-south-west.JPG, Rwendland, CC BY-SA 3.0
 *  - View North from Shibuya Scramble Square - Dec 15, 2019.jpg, Daniel
 *    Ramirez, CC BY 2.0 (from above, SSE)
 * Look-only: "Aerial view of Yoyogi National Gymnasium.20191101.jpg" (GSI,
 * tagged "Attribution" by the photo tool) was looked at to read how the
 * Second Gym's ribs fan from its mast and where its main cable runs; no
 * dimension was taken from it.
 *
 * Doubts: the ridge sag and saddle height are photo estimates (no section
 * found); the Second Gym's spiral (where on the mast each part of the roof
 * hangs) is simplified to ribs from the mast at heights rising round the
 * circle; the plaza, podium, bridges and the pool's ancillary blocks are
 * left to the map; the cable bend at the masts in plan follows OSM's tips.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { member, unit, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rot2 = (p: XY, a: number): XY => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)]
const smooth = (t: number) => t * t * (3 - 2 * t)

// ------------------------------------------------------------- placement ---
// Anchor: the area centroid of the two OSM outlines together.
const ANCHOR = { lng: 139.6998033, lat: 35.6673672 }
const KX = 111320 * Math.cos((ANCHOR.lat * Math.PI) / 180), KY = 111320
const local = (lng: number, lat: number): XY => [(lng - ANCHOR.lng) * KX, (lat - ANCHOR.lat) * KY]
/** First Gymnasium: centroid of way/101925760. */
const C1 = local(139.7001571, 35.6676444)
/** Second Gymnasium: centroid of way/72541058. */
const C2 = local(139.6986305, 35.6664487)

type Opt = { detail: boolean; only?: 1 | 2 }

// ------------------------------------------------------------- helpers ---
/** Sample a polyline (xy) evenly by length into n+1 points. */
function resample(pts: XY[], n: number): XY[] {
  const L: number[] = [0]
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const tot = L[L.length - 1], out: XY[] = []
  let k = 0
  for (let s = 0; s <= n; s++) {
    const d = (s / n) * tot
    while (k < L.length - 2 && L[k + 1] < d) k++
    const t = (d - L[k]) / (L[k + 1] - L[k] || 1)
    out.push([lerp(pts[k][0], pts[k + 1][0], t), lerp(pts[k][1], pts[k + 1][1], t)])
  }
  return out
}
const plen = (pts: XY[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

/**
 * A hanging roof: ribs from the cable or mast (U) down to the edge (P), each
 * a concave curve z = zP + (zU - zP)(1 - t)^k, the plan straight. Smooth
 * normals facing up. Returns the grid so ribs can be drawn on it.
 */
function hang(top: Part, U: V3[], P: V3[], k: number[], segs: number, under?: Part, crest?: Part, crestT = 0): V3[][] {
  const G: V3[][] = U.map((u, i) => {
    const p = P[i], row: V3[] = []
    for (let j = 0; j <= segs; j++) {
      const t = j / segs, z = p[2] + (u[2] - p[2]) * Math.pow(1 - t, k[i])
      row.push([lerp(u[0], p[0], t), lerp(u[1], p[1], t), z])
    }
    return row
  })
  const n = U.length
  const N = (i: number, j: number): V3 => {
    const a = G[Math.min(n - 1, i + 1)][j], b = G[Math.max(0, i - 1)][j]
    const c = G[i][Math.min(segs, j + 1)], d = G[i][Math.max(0, j - 1)]
    let v = unit(cross(sub(a, b), sub(c, d)))
    if (v[2] < 0) v = mul(v, -1)
    return v
  }
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < segs; j++) {
      const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1]
      const na = N(i, j), nb = N(i + 1, j), nc = N(i + 1, j + 1), nd = N(i, j + 1)
      const tp = crest && (j + 0.5) / segs < crestT ? crest : top
      tp.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      tp.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
      if (under) {
        const f = (v: V3) => mul(v, -1)
        under.tri(a, c, b, undefined, undefined, undefined, [f(na), f(nc), f(nb)])
        under.tri(a, d, c, undefined, undefined, undefined, [f(na), f(nd), f(nc)])
      }
    }
  return G
}

/** A vertical wall along a polyline from z0 up to top[i], facing away from `inside`. */
function wall(p: Part, pts: XY[], z0: number | number[], top: number[], inside: XY, smoothN = true) {
  const nOf = (i: number): V3 => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    let v: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
    const m = pts[i]
    if ((m[0] - inside[0]) * v[0] + (m[1] - inside[1]) * v[1] < 0) v = mul(v, -1)
    return v
  }
  const zb = (i: number) => (typeof z0 === 'number' ? z0 : z0[i])
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-3) continue
    let na = nOf(i), nb = nOf(i + 1)
    if (!smoothN) {
      let f: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      if ((m[0] - inside[0]) * f[0] + (m[1] - inside[1]) * f[1] < 0) f = mul(f, -1)
      na = nb = f
    }
    const A: V3 = [a[0], a[1], zb(i)], B: V3 = [b[0], b[1], zb(i + 1)], C: V3 = [b[0], b[1], top[i + 1]], D: V3 = [a[0], a[1], top[i]]
    p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
  }
}

/** A closed box from 8 corners: bottom ring a0..a3, top ring b0..b3 (any winding; outward computed). */
function hexa(p: Part, bot: V3[], topR: V3[]) {
  const c = mul([...bot, ...topR].reduce((s, v) => add(s, v), [0, 0, 0] as V3), 1 / 8)
  const face = (q: V3[]) => {
    const n = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    const m = mul(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)
    const out = n[0] * (m[0] - c[0]) + n[1] * (m[1] - c[1]) + n[2] * (m[2] - c[2]) > 0
    if (out) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[3], q[2], q[1], q[0])
  }
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face([bot[i], bot[j], topR[j], topR[i]]) }
  face([...topR]); face([...bot])
}

// ------------------------------------------------------------- First Gymnasium ---
/*
 * Built in its own frame, centred on the outline's centroid, then moved by C1.
 * The plan is two crescents turned 180 degrees about the centre: each is an
 * arc of a circle (fitted to OSM: r 71.7 m, centres at ±(2.1, 12.2) m) running
 * from one mast round to a straight tail that ends at the far tip.
 */
const F = {
  mast: [65.3, 3.6] as XY, // east mast (west one is its negative)
  tip: [112.7, 15.6] as XY, // east anchor tip (OSM: 110.2,14.4 and -115.3,-16.9, averaged)
  blunt: [106.2, 8.8] as XY, // the tail's blunt end beside the tip
  arcC: [2.1, 12.2] as XY, // centre of the south crescent's arc (north one is its negative)
  arcR: 71.7,
  zMastTop: 40.4, // published 40.37 m
  zSaddle: 29.5, // estimated, photos: the cables leave the masts ~73% up
  zMid: 19.5, // estimated, photos: the ridge's sag at mid-span
  cableW: 8.4, // the two main cables' spacing (OSM roof-section part ~9 m wide)
  eave: 10.5, // estimated, photos: roof edge on the concourse ring
  sweepTop: 27.0, // the white edge beam meets the mast (photos)
  sweepLen: 34, // metres along the arc over which it falls to the eave
  tailEdge: 4.5, // canopy edge over the glazed entrance (photos)
  anchorZ: 3.0,
}

function firstGym(o: Opt, L: Record<string, Part>) {
  const { concrete, roof, steel, win, glass, roofUnder } = L
  const ax = unit([F.mast[0], F.mast[1], 0]) // the axis, west to east
  const nrm: XY = [-ax[1], ax[0]] // across the axis, pointing north
  const half = F.cableW / 2
  const RIBS = o.detail ? 84 : 34, TAILR = o.detail ? 22 : 8, SEG = o.detail ? 12 : 7

  // The ridge (between the masts) as a function of s in [-1, 1], west to east.
  const ridge = (s: number, side: number): V3 => {
    const x = F.mast[0] * s + nrm[0] * half * side, y = F.mast[1] * s + nrm[1] * half * side
    return [x, y, F.zMid + (F.zSaddle - F.zMid) * Math.pow(Math.abs(s), 2.4)]
  }
  // A backstay from the east mast saddle down to the east anchor, t in [0, 1].
  const backstay = (t: number, side: number): V3 => {
    const a: XY = [F.mast[0] + nrm[0] * half * side, F.mast[1] + nrm[1] * half * side]
    const b: XY = [F.tip[0] + nrm[0] * half * 0.35 * side, F.tip[1] + nrm[1] * half * 0.35 * side]
    const z = lerp(F.zSaddle, F.anchorZ, t) - 1.2 * Math.sin(Math.PI * t)
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), z]
  }

  // One crescent: the south one (its arc starts at the WEST mast and its tail
  // runs to the EAST tip); the north one is the same turned 180 degrees.
  const crescent = (turn: number) => {
    const R = (p: V3): V3 => { const q = rot2([p[0], p[1]], turn); return [q[0], q[1], p[2]] }
    const Rxy = (p: XY): XY => rot2(p, turn)
    // arc from the west mast (angle a0) clockwise... the south arc runs west -> south -> east.
    const c = F.arcC
    const wm: XY = [-F.mast[0], -F.mast[1]]
    const a0 = Math.atan2(wm[1] - nrm[1] * half - c[1], wm[0] - nrm[0] * half - c[0])
    // tangent point from the blunt end to the circle (the tail's outer edge)
    const bx = F.blunt[0] - c[0], by = F.blunt[1] - c[1], d = Math.hypot(bx, by)
    const ab = Math.atan2(by, bx), dt = Math.acos(F.arcR / d)
    const a1 = ab - dt // the tangent point on the south-east side
    // the arc runs with increasing angle from the west mast through the south
    let A0 = a0
    while (A0 < 0) A0 += TAU
    let A1 = a1
    while (A1 < A0) A1 += TAU
    const arc: XY[] = []
    const NA = 64
    for (let i = 0; i <= NA; i++) { const a = lerp(A0, A1, i / NA); arc.push([c[0] + F.arcR * Math.cos(a), c[1] + F.arcR * Math.sin(a)]) }
    // start the arc exactly at the mast's south face
    arc[0] = [wm[0] - nrm[0] * (half - 0.2), wm[1] - nrm[1] * (half - 0.2)]
    const T = arc[arc.length - 1]
    const tail: XY[] = [T, F.blunt, F.tip]
    const arcLen = plen(arc)

    // edge heights along the arc: the white sweep falling from the mast to the eave
    const edgeArc = (s: number) => { const dd = s * arcLen; return dd < F.sweepLen ? F.eave + (F.sweepTop - F.eave) * Math.pow(1 - dd / F.sweepLen, 2.2) : F.eave }
    const arcS = resample(arc, RIBS)
    const tailS = resample(tail, TAILR)
    // U: the south cable, west mast -> east mast, then the east backstay
    const U: V3[] = [], P: V3[] = [], K: number[] = []
    arcS.forEach((p, i) => {
      const s = i / RIBS
      U.push(ridge(-1 + 2 * s, -1)); P.push([p[0], p[1], edgeArc(s)]); K.push(2.5)
    })
    const tailLen = plen(tail)
    tailS.forEach((p, i) => {
      if (i === 0) return
      const t = i / TAILR
      // the tail edge drops from the eave to the canopy edge over its first stretch
      const dd = t * tailLen
      const ze = dd < 18 ? lerp(F.eave, F.tailEdge, smooth(dd / 18)) : lerp(F.tailEdge, F.anchorZ, Math.max(0, (dd - (tailLen - 8)) / 8))
      U.push(backstay(t, -1)); P.push([p[0], p[1], ze]); K.push(lerp(2.5, 1.0, Math.min(1, t * 3)))
    })
    const Ur = U.map(R), Pr = P.map(R)
    const G = hang(roof, Ur, Pr, K, SEG, o.detail ? roofUnder : undefined, glass, o.detail ? 0.09 : 0.1)

    // ribs on the roof: raised bands every few rows (real 3D strips)
    const every = o.detail ? 3 : 4
    for (let i = every; i < G.length - 1; i += every) {
      const row = G[i]
      for (let j = 0; j < row.length - 1; j++) {
        const a = add(row[j], [0, 0, 0.35]), b = add(row[j + 1], [0, 0, 0.35])
        member(steel, a, b, o.detail ? 0.32 : 0.45, o.detail ? 4 : 3, [0, 0, 1], Math.PI / 4)
      }
    }

    // the outer walls under the edge: concrete on the arc; the concourse ring
    const inside = Rxy(c)
    const arcW = arcS.map(Rxy), arcTop = arcS.map((_, i) => edgeArc(i / RIBS) + 0.02)
    // ground storey recessed under the concourse ring where the edge is level
    const ring0 = arcS.findIndex((_, i) => edgeArc(i / RIBS) <= F.eave + 0.05)
    const ringPts = arcS.slice(ring0).map(Rxy)
    wall(concrete, arcW.slice(0, ring0 + 1), 0, arcTop.slice(0, ring0 + 1), inside)
    const inner = (pts: XY[], dd: number) => pts.map((p) => { const v = unit([p[0] - inside[0], p[1] - inside[1], 0]); return [p[0] - v[0] * dd, p[1] - v[1] * dd] as XY })
    const RING_Z = 6.2
    wall(concrete, ringPts, RING_Z - 1.2, ringPts.map(() => F.eave + 0.02), inside)
    // soffit under the ring, sloping in (the cantilever)
    const inn = inner(ringPts, 3.2)
    for (let i = 0; i < ringPts.length - 1; i++) {
      const a = ringPts[i], b = ringPts[i + 1], ai = inn[i], bi = inn[i + 1]
      const q: V3[] = [[a[0], a[1], RING_Z - 1.2], [ai[0], ai[1], RING_Z - 2.6], [bi[0], bi[1], RING_Z - 2.6], [b[0], b[1], RING_Z - 1.2]]
      const n = cross(sub(q[1], q[0]), sub(q[3], q[0]))
      if (n[2] < 0) concrete.quad(q[0], q[1], q[2], q[3]); else concrete.quad(q[3], q[2], q[1], q[0])
    }
    wall(concrete, inn, 0, inn.map(() => RING_Z - 2.6), inside)
    // ring windows: broad panels between brackets, standing just proud of the wall
    const bay = 7.2
    const ringLen = plen(ringPts)
    const nb = Math.floor(ringLen / bay)
    const ringRs = resample(ringPts, nb * 4)
    for (let b = 0; b < nb; b++) {
      for (let q = 0; q < 4; q++) {
        if (q === 0) continue // pier
        const a = ringRs[b * 4 + q], e = ringRs[b * 4 + q + 1] ?? ringRs[b * 4 + q]
        const v = unit([a[0] - inside[0], a[1] - inside[1], 0]), w = unit([e[0] - inside[0], e[1] - inside[1], 0])
        const A: V3 = [a[0] + v[0] * 0.06, a[1] + v[1] * 0.06, 6.6], B: V3 = [e[0] + w[0] * 0.06, e[1] + w[1] * 0.06, 6.6]
        const n = cross(sub(B, A), [0, 0, 1])
        const outward = n[0] * v[0] + n[1] * v[1] > 0
        const C: V3 = [B[0], B[1], 9.4], D: V3 = [A[0], A[1], 9.4]
        if (outward) win.quad(A, B, C, D); else win.quad(B, A, D, C)
      }
      // a bracket (pier) under the ring, a real fin
      const a = ringRs[b * 4], v = unit([a[0] - inside[0], a[1] - inside[1], 0])
      const fp = inner([a], 3.0)[0]
      member(concrete, [a[0] - v[0] * 0.3, a[1] - v[1] * 0.3, RING_Z - 1.4], [fp[0], fp[1], 0.0], 0.55, 4)
    }
    // ground-floor glazing behind the brackets
    const innG = inner(ringPts, 3.25)
    wall(win, innG, 0.6, innG.map(() => 3.6), inside)

    // tail: glazed entrance wall under the canopy edge, and the anchor block
    const tailW = tailS.map(Rxy)
    const tailTop = tailS.map((_, i) => { const dd = (i / TAILR) * tailLen; return dd < 18 ? lerp(F.eave, F.tailEdge, smooth(dd / 18)) : lerp(F.tailEdge, F.anchorZ, Math.max(0, (dd - (tailLen - 8)) / 8)) })
    // the first stretch is concrete (the end of the ring), then glass
    wall(concrete, tailW.slice(0, 3), 0, tailTop.slice(0, 3), inside)
    wall(glass, tailW.slice(2), 0, tailTop.slice(2).map((z) => z - 0.05), [Rxy([0, 0])[0], Rxy([0, 0])[1]])

    // the glazed wall under the outer backstay (north side of this tail), from the mast to the anchor
    const BS = o.detail ? 16 : 6
    const bsPts: XY[] = [], bsTop: number[] = []
    for (let i = 0; i <= BS; i++) { const p = R(backstay(i / BS, 1)); bsPts.push([p[0], p[1]]); bsTop.push(p[2] - 0.3) }
    wall(glass, bsPts, 0, bsTop, Rxy([0, -20]), false)
    // the strip of roof between the two backstays
    {
      const A: V3[] = [], B: V3[] = []
      for (let i = 0; i <= BS; i++) { A.push(R(backstay(i / BS, 1))); B.push(R(backstay(i / BS, -1))) }
      for (let i = 0; i < BS; i++) {
        const q: V3[] = [A[i], B[i], B[i + 1], A[i + 1]]
        const n = cross(sub(q[1], q[0]), sub(q[3], q[0]))
        if (n[2] > 0) roof.quad(q[0], q[1], q[2], q[3]); else roof.quad(q[3], q[2], q[1], q[0])
      }
    }
    // inclined steel fins on the glazed backstay wall (real members)
    const FIN = o.detail ? 12 : 4
    for (let i = 1; i < FIN; i++) {
      const t = i / FIN, top = R(backstay(t, 1)), base = R(backstay(Math.min(1, t + 0.06), 1))
      member(steel, [base[0], base[1], 0.2], add(top, [0, 0, -0.4]), o.detail ? 0.28 : 0.4, 4)
    }
    // anchor block at the tip: a sloped concrete wedge
    {
      const tp = F.tip, dir = unit([F.tip[0] - F.mast[0], F.tip[1] - F.mast[1], 0]), side: XY = [-dir[1], dir[0]]
      const back: XY = [tp[0] - dir[0] * 12, tp[1] - dir[1] * 12], front: XY = [tp[0] + dir[0] * 3, tp[1] + dir[1] * 3]
      const w = 4.2
      const bot: V3[] = [[back[0] - side[0] * w, back[1] - side[1] * w, 0], [front[0] - side[0] * w, front[1] - side[1] * w, 0], [front[0] + side[0] * w, front[1] + side[1] * w, 0], [back[0] + side[0] * w, back[1] + side[1] * w, 0]]
      const top: V3[] = [[back[0] - side[0] * w, back[1] - side[1] * w, 6.5], [front[0] - side[0] * w * 0.8, front[1] - side[1] * w * 0.8, 1.2], [front[0] + side[0] * w * 0.8, front[1] + side[1] * w * 0.8, 1.2], [back[0] + side[0] * w, back[1] + side[1] * w, 6.5]]
      hexa(concrete, bot.map(R), top.map(R))
    }
    // the white edge beam along the sweep (a real bevelled band on the roof edge)
    {
      const n = ring0 + 1
      for (let i = 0; i < n - 1; i++) {
        const a = R(P[i]), b = R(P[i + 1])
        member(concrete, add(a, [0, 0, 0.3]), add(b, [0, 0, 0.3]), o.detail ? 0.75 : 0.9, o.detail ? 6 : 4, [0, 0, 1], Math.PI / 4)
      }
    }
    return { G, arcS: arcS.map(Rxy) }
  }

  crescent(0)
  crescent(Math.PI)

  // The ridge: the skylight strip between the two main cables, and the cables.
  const RS = o.detail ? 48 : 16
  for (let i = 0; i < RS; i++) {
    const s0 = -1 + (2 * i) / RS, s1 = -1 + (2 * (i + 1)) / RS
    const a = ridge(s0, 1), b = ridge(s0, -1), c = ridge(s1, -1), d = ridge(s1, 1)
    const lift = 1.3
    roof.quad(add(b, [0, 0, lift]), add(c, [0, 0, lift]), add(d, [0, 0, lift]), add(a, [0, 0, lift]))
    // the band's sides, down to the cables
    steel.quad(a, add(a, [0, 0, lift]), add(d, [0, 0, lift]), d)
    steel.quad(c, add(c, [0, 0, lift]), add(b, [0, 0, lift]), b)
  }
  const LV = o.detail ? 64 : 0
  for (let i = 1; i < LV; i++) {
    const s = -1 + (2 * i) / LV
    member(steel, add(ridge(s, 1), [0, 0, 1.45]), add(ridge(s, -1), [0, 0, 1.45]), 0.2, 3)
  }
  const cableR = o.detail ? 0.75 : 1.0, CS = o.detail ? 6 : 4
  for (const side of [1, -1]) {
    for (let i = 0; i < RS; i++) member(steel, add(ridge(-1 + (2 * i) / RS, side), [0, 0, 0.7]), add(ridge(-1 + (2 * (i + 1)) / RS, side), [0, 0, 0.7]), cableR, CS)
    for (const turn of [0, Math.PI]) {
      const BSN = o.detail ? 12 : 5
      for (let i = 0; i < BSN; i++) {
        const a = backstay(i / BSN, side), b = backstay((i + 1) / BSN, side)
        const r = (p: V3): V3 => { const q = rot2([p[0], p[1]], turn); return [q[0], q[1], p[2] + 0.7] }
        member(steel, r(a), r(b), cableR, CS)
      }
    }
  }

  // The masts: tall concrete blades, the cables passing either side of them.
  for (const turn of [0, Math.PI]) {
    const m = rot2(F.mast, turn), a = rot2([ax[0], ax[1]], turn), nn = rot2(nrm, turn)
    const ring = (hx: number, hy: number, z: number, dx = 0): V3[] => {
      const c: XY = [m[0] + a[0] * dx, m[1] + a[1] * dx]
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [c[0] + a[0] * u * hx + nn[0] * v * hy, c[1] + a[1] * u * hx + nn[1] * v * hy, z] as V3)
    }
    // shaft: 5.4 m along the axis, 6.4 m across, tapering a little, then the blade above the saddle
    hexa(concrete, ring(3.0, 2.9, 0), ring(2.4, 2.9, F.zSaddle + 1.6))
    // the blade above, its outer face leaning out; top cut on a slope
    const b0 = ring(2.4, 2.4, F.zSaddle + 1.6, 0.2)
    const b1 = ring(2.0, 2.4, F.zMastTop, 0.8)
    b1[0][2] -= 1.6; b1[3][2] -= 1.6 // the inner side lower: a sloping top
    hexa(concrete, b0, b1)
    // saddle caps over the cables
    for (const side of [1, -1]) {
      const c: XY = [m[0] + nn[0] * half * side, m[1] + nn[1] * half * side]
      const cap: V3[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [c[0] + a[0] * u * 3.2 + nn[0] * v * 1.6, c[1] + a[1] * u * 3.2 + nn[1] * v * 1.6, F.zSaddle - 1.2] as V3)
      const capT = cap.map((p) => [p[0], p[1], F.zSaddle + 2.6] as V3)
      hexa(concrete, cap, capT)
    }
  }
}

// ------------------------------------------------------------- Second Gymnasium ---
/*
 * In its own frame centred on way/72541058's centroid. The plan is a snail:
 * a circle (fitted: centre (-6.6, 0), r 34.3) and a tail running east-north-
 * east to a concrete buttress. The mast stands where the circle meets the
 * tail's north edge; the roof hangs from it in a spiral, low on the south
 * and rising round the west and north to near the mast's top, and over the
 * tail from the main cable that runs from the mast down to the buttress.
 */
const S = {
  mast: [29.0, 5.6] as XY,
  zMastTop: 42.3, // published 42.29 m
  zLow: 14.0, // roof at the mast on the south side (photo)
  zHigh: 37.0, // roof at the mast on the north side (photo)
  circle: { c: [-6.6, 0.0] as XY, r: 34.3 },
  wallZ: 10.0, // circle wall top (photo)
  tipZ: 16.0, // buttress top (photo)
  // tail south edge from OSM, tip first
  // way/72541058 in this frame, from the tip round to the notch beside the mast
  outline: [[76.4, 19.7], [65.9, 14.6], [53.7, 2.6], [42.7, -7.3], [28.3, -20.2], [20.4, -25.5], [13.7, -29.1], [6.7, -31.0], [-2.9, -33.2], [-11.3, -33.6], [-20.8, -30.6], [-27.2, -26.3], [-34.1, -20.3], [-36.6, -15.8], [-38.8, -9.6], [-40.0, -4.5], [-41.2, 1.3], [-41.0, 5.7], [-40.0, 10.4], [-37.3, 16.3], [-34.0, 21.6], [-29.5, 25.9], [-23.7, 30.3], [-16.1, 33.5], [-10.7, 34.4], [-4.0, 34.2], [4.0, 32.5], [8.2, 30.3], [11.7, 28.6], [15.9, 25.6], [20.3, 20.7], [24.1, 12.8], [27.3, 5.7]] as XY[],
  anchor: [74.2, 21.0] as XY,
}

function secondGym(o: Opt, L: Record<string, Part>) {
  const { concrete, roof, steel, win, roofUnder } = L
  const SEG = o.detail ? 12 : 7
  const c = S.circle.c
  // the outline from OSM, tip first: the tail's south edge, then round the circle to the notch
  const tail = resample(S.outline.slice(0, 5), o.detail ? 24 : 8)
  const NT = tail.length - 1
  const circ = resample(S.outline.slice(4), o.detail ? 72 : 30)
  const NC = circ.length - 1
  // the main cable: from the buttress up to the mast at zLow (along the tail's north edge)
  const cable = (t: number): V3 => {
    const m: XY = [S.mast[0] + 1.5, S.mast[1] - 1.0]
    return [lerp(S.anchor[0], m[0], t), lerp(S.anchor[1], m[1], t), lerp(S.tipZ + 0.8, S.zLow, t) - 0.8 * Math.sin(Math.PI * t)]
  }
  const U: V3[] = [], P: V3[] = [], K: number[] = []
  const wallTail = (i: number) => lerp(S.tipZ, S.wallZ, smooth(Math.min(1, i / NT * 1.15)))
  tail.forEach((p, i) => { U.push(cable(i / NT)); P.push([p[0], p[1], wallTail(i)]); K.push(1.2) })
  circ.forEach((p, i) => {
    if (i === 0) return
    const t = i / NC
    const zm = lerp(S.zLow, S.zHigh, Math.pow(t, 3.2))
    // attach on the mast's face toward the point
    const v = unit([p[0] - S.mast[0], p[1] - S.mast[1], 0])
    U.push([S.mast[0] + v[0] * 1.6, S.mast[1] + v[1] * 1.6, zm]); P.push([p[0], p[1], S.wallZ]); K.push(lerp(1.6, 2.1, t))
  })
  const G = hang(roof, U, P, K, SEG, o.detail ? roofUnder : undefined)
  // ribs
  const every = o.detail ? 3 : 4
  for (let i = every; i < G.length - 1; i += every) {
    const row = G[i]
    for (let j = 0; j < row.length - 1; j++) member(steel, add(row[j], [0, 0, 0.3]), add(row[j + 1], [0, 0, 0.3]), o.detail ? 0.28 : 0.4, o.detail ? 4 : 3, [0, 0, 1], Math.PI / 4)
  }
  // walls: tail south edge then the circle
  const inside: XY = [c[0], c[1]]
  wall(concrete, tail, 0, tail.map((_, i) => wallTail(i) + 0.02), [40, 20])
  wall(concrete, circ, 0, circ.map(() => S.wallZ + 0.02), inside)
  // the notch: a steep wall from the circle's end up to the mast
  {
    const e = circ[circ.length - 1]
    const v = unit([e[0] - S.mast[0], e[1] - S.mast[1], 0])
    const m: XY = [S.mast[0] + v[0] * 1.6, S.mast[1] + v[1] * 1.6]
    wall(concrete, [e, m], 0, [S.wallZ, S.zHigh], [0, 0], false)
  }
  // north face of the tail: concrete wall under the cable
  {
    const N = o.detail ? 12 : 5, pts: XY[] = [], top: number[] = []
    for (let i = 0; i <= N; i++) { const p = cable(i / N); pts.push([p[0], p[1]]); top.push(p[2]) }
    wall(concrete, pts, 0, top, [50, 0], false)
  }
  // the main cable, bold
  {
    const N = o.detail ? 12 : 5
    for (let i = 0; i < N; i++) member(steel, add(cable(i / N), [0, 0, 0.6]), add(cable((i + 1) / N), [0, 0, 0.6]), o.detail ? 0.8 : 1.0, o.detail ? 6 : 4)
  }
  // the buttress at the tip: a leaning triangular concrete fin, with its opening
  {
    const tip = S.outline[0], dir = unit([tip[0] - 50, tip[1] - 8, 0]), side: XY = [-dir[1], dir[0]]
    const w = 3.0
    const back: XY = [tip[0] - dir[0] * 9, tip[1] - dir[1] * 9], front: XY = [tip[0] + dir[0] * 3.5, tip[1] + dir[1] * 3.5]
    const bot: V3[] = [[back[0] - side[0] * w, back[1] - side[1] * w, 0], [front[0] - side[0] * w, front[1] - side[1] * w, 0], [front[0] + side[0] * w, front[1] + side[1] * w, 0], [back[0] + side[0] * w, back[1] + side[1] * w, 0]]
    const top: V3[] = [[back[0] - side[0] * w, back[1] - side[1] * w, S.tipZ + 1.2], [tip[0] - side[0] * w, tip[1] - side[1] * w, S.tipZ + 1.2], [tip[0] + side[0] * w, tip[1] + side[1] * w, S.tipZ + 1.2], [back[0] + side[0] * w, back[1] + side[1] * w, S.tipZ + 1.2]]
    hexa(concrete, bot, top)
    // the opening near the top, a dark panel on both long faces
    for (const sgn of [1, -1]) {
      const o0: XY = [tip[0] - dir[0] * 6.5 + side[0] * (w + 0.06) * sgn, tip[1] - dir[1] * 6.5 + side[1] * (w + 0.06) * sgn]
      const o1: XY = [tip[0] - dir[0] * 1.5 + side[0] * (w + 0.06) * sgn, tip[1] - dir[1] * 1.5 + side[1] * (w + 0.06) * sgn]
      const q: V3[] = [[o0[0], o0[1], S.tipZ - 2.6], [o1[0], o1[1], S.tipZ - 2.6], [o1[0], o1[1], S.tipZ - 0.4], [o0[0], o0[1], S.tipZ - 0.4]]
      const n = cross(sub(q[1], q[0]), sub(q[3], q[0]))
      if (n[0] * side[0] * sgn + n[1] * side[1] * sgn > 0) win.quad(q[0], q[1], q[2], q[3]); else win.quad(q[3], q[2], q[1], q[0])
    }
  }
  // the mast: a tapering concrete blade, leaning a little, with a pointed top
  {
    const m = S.mast, a: XY = unit([1, 0.35, 0]) as unknown as XY, nn: XY = [-a[1], a[0]]
    const ring = (hx: number, hy: number, z: number, dx = 0): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [m[0] + a[0] * (u * hx + dx) + nn[0] * v * hy, m[1] + a[1] * (u * hx + dx) + nn[1] * v * hy, z] as V3)
    hexa(concrete, ring(2.3, 1.7, 0), ring(1.6, 1.3, 30))
    hexa(concrete, ring(1.6, 1.3, 30), ring(0.9, 0.9, S.zMastTop - 2.5, 0.3))
    // pointed top
    const t = ring(0.9, 0.9, S.zMastTop - 2.5, 0.3), apex: V3 = [m[0] + a[0] * 0.6, m[1] + a[1] * 0.6, S.zMastTop]
    for (let i = 0; i < 4; i++) {
      const p = t[i], q = t[(i + 1) % 4], n = cross(sub(q, p), sub(apex, p))
      const cx = (p[0] + q[0]) / 2 - m[0], cy = (p[1] + q[1]) / 2 - m[1]
      if (n[0] * cx + n[1] * cy > 0) concrete.tri(p, q, apex); else concrete.tri(q, p, apex)
    }
  }
}

// ------------------------------------------------------------- build ---
function build(o: Opt): Layer[] {
  const L: Record<string, Part> = { concrete: new Part(), roof: new Part(), roofUnder: new Part(), steel: new Part(), win: new Part(), glass: new Part() }
  const parts1: Record<string, Part> = {}, parts2: Record<string, Part> = {}
  for (const k of Object.keys(L)) { parts1[k] = new Part(); parts2[k] = new Part() }
  if (o.only !== 2) firstGym(o, parts1)
  if (o.only !== 1) secondGym(o, parts2)
  // move into the shared frame
  const move = (src: Part, dst: Part, d: XY) => {
    for (let i = 0; i < src.pos.length; i += 3) {
      // pos is stored in glTF frame: (x, z, -y)
      dst.pos.push(src.pos[i] + d[0], src.pos[i + 1], src.pos[i + 2] - d[1])
      dst.nrm.push(src.nrm[i], src.nrm[i + 1], src.nrm[i + 2])
    }
    dst.uv.push(...src.uv)
  }
  for (const k of Object.keys(L)) { move(parts1[k], L[k], C1); move(parts2[k], L[k], C2) }
  // underside of the roofs shares the roof's colour
  const roofAll = L.roof
  move(L.roofUnder, roofAll, [0, 0])
  return [
    { part: L.concrete, material: finish('yoyogi-concrete', 0xd9d5cd) },
    { part: roofAll, material: finish('yoyogi-roof', 0xafa7ad, 0.6) },
    { part: L.steel, material: finish('yoyogi-steel', 0x6f727a, 0.6) },
    { part: L.win, material: PALETTE.window },
    { part: L.glass, material: { ...PALETTE.glass, color: 0x646b74 } },
  ]
}

const meta = { bearing: 0, elevation: 0, height: 42.3 }
if (import.meta.main && process.env.YOYOGI_ONLY) {
  // review aid: one building alone, written to the scratch path given
  const only = Number(process.env.YOYOGI_ONLY) as 1 | 2
  const { writeGlb } = await import('./mesh')
  await Bun.write(process.env.YOYOGI_OUT!, writeGlb('part', build({ detail: process.env.YOYOGI_DETAIL === '1', only }).filter((l) => l.part.triangles > 0)))
} else if (import.meta.main) {
  await writeModel('tokyo-yoyogi-gymnasium', 'tokyo-yoyogi-gymnasium.glb', 'Yoyogi National Gymnasium', build({ detail: false }), meta, 6500, 250_000)
  await writeModel('tokyo-yoyogi-gymnasium', 'tokyo-yoyogi-gymnasium.detail.glb', 'Yoyogi National Gymnasium', build({ detail: true }), meta, 40_000, 1536 * 1024)
}
