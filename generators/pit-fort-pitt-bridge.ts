/**
 * Fort Pitt Bridge (1959; Pennsylvania Department of Highways, George S.
 * Richardson, engineer) — procedural, CC0-1.0, no textures.
 * bun generators/pit-fort-pitt-bridge.ts
 *
 * This file also holds the shared tied-arch builder (`buildArchBridge`),
 * which pit-fort-duquesne-bridge.ts and pit-west-end-bridge.ts import with
 * their own measured spans, ribs, decks and OSM data. Merge this file first.
 *
 * HEADER: see the block above `FORT_PITT` at the end of the file.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, face, footedLoft, groundAt, merged, parabola, piecewise, rod, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

// ---- Shared types --------------------------------------------------------------------------

/** An OSM roadway on the bridge, in the model frame: [x, y, lidar roadway z] every ~10 m. */
export type Way = { id: string; layer: number; hw: string; lanes: number; pts: [number, number, number][] }
/** An OSM `bridge:support` polygon in the model frame. */
export type Pier = { id: string; pts: [number, number][] }
/** A walkway the model owns, surface and all: its centre line [x, y, z of the walking surface]. */
export type Walk = {
  pts: [number, number, number][]
  width: number
  /** Where the model draws it (the map draws the rest); default: inside an outline or along the span. */
  on?: (x: number, y: number) => boolean
}

export type ArchBridge = {
  id: string
  name: string
  bearing: number
  waterNAVD88: number
  /** Map terrain above its own river reading, in this frame. */
  ground: GroundGrid
  /** The man_made=bridge outlines (the model draws the structure inside them). */
  outlines: Record<string, [number, number][]>
  piers: Pier[]
  ways: Way[]
  walks?: Walk[]
  /** Arch ends, at the main piers (y). */
  span: [number, number]
  /** Rib planes at x = ±xr, ribs ribW wide. */
  xr: number
  ribW: number
  /** Depths of the rib's top and bottom chords (1.6 and 1.4 m when absent). */
  ribChords?: [number, number]
  /** Lidar crown line of the ribs [y, z], end to end. */
  extrados: [number, number][]
  /**
   * 'crescent': a solid box rib at the crown whose bottom chord parts from
   * the top chord toward the ends and lands on the deck `foot` metres in
   * from each end, laced between (Fort Pitt, Fort Duquesne);
   * 'truss': a constant-depth trussed rib (West End).
   */
  rib: { kind: 'crescent'; crownDepth: number; foot: number; solid: number; bow?: number } | { kind: 'truss'; depth: number; endDepth?: number }
  /** OSM pier ids drawn as a low wall with a shaft under each rib plane (the main piers). */
  twinPiers?: { ids: string[]; wall: number; shaft: number }
  /** Two hangers side by side at each panel point (one when false or absent). */
  pairedHangers?: boolean
  /** Half-widths of particular OSM roadways' approach decks, to their parapets (else from lanes). */
  roadHalfWidth?: Record<string, number>
  /** Where the generator draws its own approach supports: no estimated bent there. */
  noBents?: (x: number, y: number) => boolean
  panels: number
  /** The main span's roadway, the upper one on a double deck. */
  upper: (y: number) => number
  /** The lower deck of a double-deck span: a stiffening truss carries both. */
  lower?: (y: number) => number
  /** How far the stiffening truss's bottom chord hangs under the lower roadway. */
  trussBelow?: number
  /** Single deck: depth of the tie girders standing in the rib planes, from road + tieUp down. */
  tie?: { up: number; depth: number; w: number }
  /** Half-width of the deck structure in the span. */
  deckEdge: number
  /** The lowest lateral bracing stands this far above the upper roadway. */
  clearance: number
  /** Lateral bracing panels: 'x' crosses, 'diamond'. */
  bracing: 'x' | 'diamond'
  /** Approach bents every this many metres along a roadway, where OSM maps no pier. */
  bentStep: number
  /** Extra stone or concrete masses (pylons, abutments) drawn by the generator itself. */
  extra?: (p: { concrete: Part; gold: Part; detail: boolean }) => void
  /** Night: how lit each steel vertex is. */
  floodlight?: (p: V3, n: V3, part: 'arch' | 'deck' | 'approach') => number
  colors: { gold: number; shade: number; concrete: number }
  extras?: Record<string, unknown>
}

// ---- Small geometry -----------------------------------------------------------------------

/** An upright box. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** A straight member of rectangular section from a to b, `w` across and `h` in the `up` direction. */
export function beam(p: Part, a: V3, b: V3, w: number, h: number, up: V3 = [0, 0, 1], ends = true) {
  const t = norm(sub(b, a))
  let S = cross(t, up); if (Math.hypot(...S) < 1e-3) S = cross(t, [1, 0, 0]); S = norm(S)
  const U = cross(S, t), s = mul(S, w / 2), u = mul(U, h / 2)
  const q = (c: V3): V3[] => [sub(sub(c, s), u), sub(add(c, s), u), add(add(c, s), u), add(sub(c, s), u)]
  const A = q(a), B = q(b)
  const ns: V3[] = [mul(U, -1), S, U, mul(S, -1)]
  for (let i = 0; i < 4; i++) face(p, A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i], ns[i])
  if (ends) { face(p, A[0], A[1], A[2], A[3], mul(t, -1)); face(p, B[0], B[1], B[2], B[3], t) }
}

/** A rectangular band in a plane x = const along a polyline in y-z, mitred: an arch chord. */
export function chord(p: Part, path: V3[], w: number, h: number, ends = false) {
  const X: V3 = [1, 0, 0]
  const rings = path.map((c, i) => {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const U = norm(cross(X, t)), hu = mul(U, h / 2), wx = mul(X, w / 2)
    return { U, t, q: [sub(sub(c, wx), hu), sub(add(c, wx), hu), add(add(c, wx), hu), add(sub(c, wx), hu)] as V3[] }
  })
  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i].q, b = rings[i + 1].q, U = norm(add(rings[i].U, rings[i + 1].U))
    face(p, a[3], a[2], b[2], b[3], U)
    face(p, a[0], a[1], b[1], b[0], mul(U, -1))
    face(p, a[1], a[2], b[2], b[1], X)
    face(p, a[0], a[3], b[3], b[0], [-1, 0, 0])
  }
  if (ends) for (const [r, sgn] of [[rings[0], -1], [rings[rings.length - 1], 1]] as const) face(p, r.q[0], r.q[1], r.q[2], r.q[3], mul(r.t, sgn))
}

/** Is (x, y) inside the polygon? */
export function inside(poly: [number, number][], x: number, y: number) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < xi + ((y - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}
const distToPoly = (poly: [number, number][], x: number, y: number) => {
  let d = Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[j], [x2, y2] = poly[i], dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / L))
    d = Math.min(d, Math.hypot(x - x1 - t * dx, y - y1 - t * dy))
  }
  return inside(poly, x, y) ? -d : d
}

// ---- The builder ----------------------------------------------------------------------------

export async function buildArchBridge(S: ArchBridge) {
  const [Y0, Y1] = S.span, L = Y1 - Y0, XR = S.xr
  const ground = (x: number, y: number) => Math.max(0, groundAt(S.ground, x, y))
  const E = piecewise(S.extrados)
  const up = S.upper
  const deckTop = (y: number) => (S.lower ? up(y) - 0.3 : up(y) + (S.tie?.up ?? 1))
  const inOutline = (x: number, y: number, m = 1) => Object.values(S.outlines).some((o) => distToPoly(o, x, y) < m)
  const inSpan = (x: number, y: number) => y > Y0 - 0.5 && y < Y1 + 0.5 && Math.abs(x) < S.deckEdge + 0.5

  // Rib bottom (intrados) line.
  let I: (y: number) => number
  let ribEnds: [number, number]
  if (S.rib.kind === 'crescent') {
    const { crownDepth, foot, solid, bow = 2 } = S.rib
    const ya = Y0 + foot, yb = Y1 - foot
    const yc = (Y0 + Y1) / 2 // the crescents are symmetric about midspan
    // Solid over the middle; beyond, the depth grows smoothly to reach the deck one `foot` in from each end.
    const depthAt = (y: number) => {
      const [y0, y1] = y < yc ? [yc - solid, ya] : [yc + solid, yb]
      const t = Math.max(0, Math.min(1, (y - y0) / (y1 - y0)))
      const full = E(y1) - deckTop(y1)
      return crownDepth + (full - crownDepth) * t ** bow
    }
    I = (y) => E(y) - depthAt(y)
    ribEnds = [ya, yb]
  } else {
    // Deeper toward the haunches (endDepth), closing to the pin over the last panel.
    const { depth, endDepth = depth } = S.rib, panel = L / S.panels, ym = (Y0 + Y1) / 2
    I = (y) => {
      const u = Math.min(1, Math.abs(y - ym) / (L / 2 - panel))
      return E(y) - (depth + (endDepth - depth) * u * u) * Math.min(1, Math.min(y - Y0, Y1 - y) / panel)
    }
    ribEnds = [Y0, Y1]
  }
  const panelYs = stations(Y0, Y1, L / S.panels)

  const goldLow = new Part(), goldDet = new Part(), archLow = new Part(), archDet = new Part()
  const shadeLow = new Part(), shadeDet = new Part(), concrete = new Part(), apprLow = new Part(), apprDet = new Part()
  const both = (f: (p: Part, det: boolean) => void, low: Part, det: Part) => { f(low, false); f(det, true) }

  // ---- Ribs -----------------------------------------------------------------------------
  const ribTop = S.ribChords?.[0] ?? 1.6, ribBot = S.ribChords?.[1] ?? 1.4
  for (const s of [-1, 1]) {
    const x = s * XR
    // A long span's low chords run at two panels a segment (sagitta well inside the chord's depth).
    const lowStep = S.panels >= 20 ? 2 : 1
    const ysTop = stations(Y0, Y1, (L * lowStep) / S.panels), ysTopD = stations(Y0, Y1, L / (S.panels * 3))
    const [ra, rb] = ribEnds
    const ysBot = stations(ra, rb, ((rb - ra) * lowStep) / S.panels), ysBotD = stations(ra, rb, (rb - ra) / (S.panels * 3))
    chord(archLow, ysTop.map((y) => [x, y, E(y) - ribTop / 2] as V3), S.ribW, ribTop, true)
    chord(archDet, ysTopD.map((y) => [x, y, E(y) - ribTop / 2] as V3), S.ribW, ribTop, true)
    chord(archLow, ysBot.map((y) => [x, y, I(y) + ribBot / 2] as V3), S.ribW * 0.92, ribBot, true)
    chord(archDet, ysBotD.map((y) => [x, y, I(y) + ribBot / 2] as V3), S.ribW * 0.92, ribBot, true)
    // Web: posts and diagonals wherever the chords stand apart.
    const pts = panelYs.filter((y) => y > ra + 0.5 && y < rb - 0.5)
    pts.forEach((y, i) => {
      const zb = I(y) + ribBot, zt = E(y) - ribTop
      if (zt - zb > 0.6) { beam(archDet, [x, y, zb], [x, y, zt], S.ribW * 0.7, 0.8, [0, 1, 0], false); rod(archLow, [x, y, zb], [x, y, zt], 0.65, 3) }
      if (i < pts.length - 1) {
        const y2 = pts[i + 1], zb2 = I(y2) + ribBot, zt2 = E(y2) - ribTop
        if (Math.max(zt - zb, zt2 - zb2) > 1.2) {
          const outward = Math.abs(y2 - (Y0 + Y1) / 2) > Math.abs(y - (Y0 + Y1) / 2)
          const a: V3 = outward ? [x, y, zt] : [x, y, zb], b: V3 = outward ? [x, y2, zb2] : [x, y2, zt2]
          beam(archDet, a, b, S.ribW * 0.7, 0.7, [1, 0, 0], false); rod(archLow, a, b, 0.6, 3)
        }
      }
    })
    // The rib's end lands on the deck: a gusset block at each end.
    for (const yE of [Y0, Y1]) {
      const yi = yE + Math.sign((Y0 + Y1) / 2 - yE) * 1.5
      both((p) => box(p, x - S.ribW / 2, x + S.ribW / 2, Math.min(yE, yi), Math.max(yE, yi), deckTop(yE) - 1.2, E(yi) - 0.2, false), archLow, archDet)
    }
  }

  // ---- Lateral bracing ------------------------------------------------------------------
  const braced = panelYs.filter((y) => I(y) - up(y) > S.clearance)
  const xi = XR - S.ribW / 2
  const zB = (y: number) => E(y) - ribTop / 2
  braced.forEach((y, i) => {
    const portal = i === 0 || i === braced.length - 1
    both((p, det) => beam(p, [-xi, y, zB(y)], [xi, y, zB(y)], det ? 0.8 : 1.0, portal ? 2.2 : det ? 1.2 : 1.4, [0, 0, 1], false), archLow, archDet)
    if (portal) {
      // Knee braces under the portal strut, toward the deck.
      const zk = zB(y) - 1.1
      for (const s of [-1, 1]) both((p, det) => beam(p, [s * xi, y, zk - 3.2], [s * (xi - 3.2), y, zk], 0.6, det ? 0.5 : 0.7, [0, 1, 0], false), archLow, archDet)
    }
    if (i === braced.length - 1) return
    const y2 = braced[i + 1]
    const a: V3 = [-xi, y, zB(y)], b: V3 = [xi, y2, zB(y2)], c: V3 = [xi, y, zB(y)], d: V3 = [-xi, y2, zB(y2)]
    const n: V3 = norm(cross(sub(b, a), sub(d, c)))
    const upN: V3 = n[2] < 0 ? mul(n, -1) : n
    if (S.bracing === 'x') {
      beam(archDet, a, b, 0.5, 0.5, upN, false); beam(archDet, c, d, 0.5, 0.5, upN, false)
      rod(archLow, i % 2 ? a : c, i % 2 ? b : d, 0.45, 3)
    } else {
      // A diamond: from the middle of each strut to the rib at the next one.
      const m1: V3 = [0, y, zB(y)], m2: V3 = [0, y2, zB(y2)], mm: V3 = [0, (y + y2) / 2, zB((y + y2) / 2)]
      for (const s of [-1, 1]) {
        const r: V3 = [s * xi, (y + y2) / 2, zB((y + y2) / 2)]
        beam(archDet, m1, r, 0.55, 0.5, upN, false); beam(archDet, r, m2, 0.55, 0.5, upN, false)
        rod(archLow, m1, r, 0.45, 3); rod(archLow, r, m2, 0.45, 3)
      }
      void mm
    }
  })

  // ---- Hangers (detail only) ------------------------------------------------------------
  for (const y of panelYs) {
    if (y <= ribEnds[0] + 0.5 || y >= ribEnds[1] - 0.5) continue
    // Paired rods at each panel point, as the photos show.
    for (const s of [-1, 1]) for (const dy of S.pairedHangers ? [-0.35, 0.35] : [0]) rod(archDet, [s * XR, y + dy, deckTop(y)], [s * XR, y + dy, I(y) + 0.1], S.pairedHangers ? 0.17 : 0.22, 4)
  }

  // ---- Main-span deck -------------------------------------------------------------------
  const deckYs = stations(Y0, Y1, L / S.panels)
  if (S.lower) {
    const lo = S.lower, TB = S.trussBelow ?? 3.8
    // Stiffening truss: the top chord carries the upper deck; the bottom chord hangs
    // under the lower deck's floor, TB below its roadway.
    const tTop = (y: number) => up(y) - 0.2, tTopB = (y: number) => up(y) - 1.5
    const tBotT = (y: number) => lo(y) - TB + 1.5, tBot = (y: number) => lo(y) - TB
    for (const s of [-1, 1]) {
      const x = s * XR
      both((p) => band(p, x - 0.5, x + 0.5, deckYs, tTop, tTopB), goldLow, goldDet)
      both((p) => band(p, x - 0.55, x + 0.55, deckYs, tBotT, tBot), goldLow, goldDet)
      deckYs.forEach((y, i) => {
        const zt = tTopB(y), zb = tBotT(y)
        beam(goldDet, [x, y, zb], [x, y, zt], 0.6, 0.6, [0, 1, 0], false); rod(goldLow, [x, y, zb], [x, y, zt], 0.5, 3)
        if (i < deckYs.length - 1) {
          const y2 = deckYs[i + 1], ym = (y + y2) / 2
          for (const [ya, yb] of [[y, ym], [y2, ym]]) { beam(goldDet, [x, ya, tTopB(ya)], [x, yb, tBotT(yb)], 0.55, 0.55, [1, 0, 0], false); rod(goldLow, [x, ya, tTopB(ya)], [x, yb, tBotT(yb)], 0.45, 3) }
        }
      })
      // End posts over the piers.
      for (const yE of [Y0, Y1]) both((p) => box(p, x - 0.6, x + 0.6, yE - 0.7, yE + 0.7, tBot(yE), tTop(yE), false), goldLow, goldDet)
      // Upper-deck edge girder outside the truss.
      both((p) => band(p, s * XR, s * S.deckEdge, deckYs, (y) => up(y) - 0.3, (y) => up(y) - 1.4, { out: true, bottom: true, ends: true }), goldLow, goldDet)
    }
    // Lower deck underside and floor beams.
    both((p) => band(p, -XR + 0.5, XR - 0.5, stations(Y0, Y1, L / 8), (y) => tBotT(y), (y) => tBotT(y) - 0.1, { bottom: true }), shadeLow, shadeDet)
    for (const y of deckYs) band(shadeDet, -XR, XR, [y - 0.35, y + 0.35], () => lo(y) - 0.4, () => tBotT(y), { out: true, in: true, bottom: true, ends: true })
    // Railings on the upper deck's edges (detail).
    for (const s of [-1, 1]) band(goldDet, s * (S.deckEdge - 0.25), s * S.deckEdge, stations(Y0, Y1, L / (S.panels * 2)), (y) => up(y) + 1.1, (y) => up(y) - 0.3, { out: true, in: true, top: true })
  } else if (S.tie) {
    const { up: tu, depth, w } = S.tie
    for (const s of [-1, 1]) {
      const x = s * XR
      both((p) => band(p, x - w / 2, x + w / 2, deckYs, (y) => up(y) + tu, (y) => up(y) + tu - depth, { out: true, in: true, top: true, bottom: true, ends: true }), goldLow, goldDet)
    }
    both((p) => band(p, -XR, XR, stations(Y0, Y1, L / 8), (y) => up(y) + tu - depth + 0.1, (y) => up(y) + tu - depth, { bottom: true }), shadeLow, shadeDet)
    for (const y of deckYs) band(shadeDet, -XR, XR, [y - 0.3, y + 0.3], () => up(y) - 0.4, () => up(y) + tu - depth + 0.1, { out: true, in: true, bottom: true, ends: true })
  }

  // ---- Approach girders and parapets, per OSM roadway ------------------------------------
  const halfW = (w: Way) => S.roadHalfWidth?.[w.id] ?? (w.hw === 'cycleway' || w.hw === 'footway' ? 1.8 : Math.max(1, w.lanes) * 1.8 + 1.0)
  const roads = S.ways.filter((w) => w.hw !== 'cycleway' && w.hw !== 'footway')
  /** Road heights near (x, y): every roadway point within `r` m. */
  const decksAt = (x: number, y: number, r: number) => {
    const out: { z: number; w: Way }[] = []
    for (const w of roads) {
      let best = Infinity, z = 0
      for (let i = 0; i < w.pts.length - 1; i++) {
        const [x1, y1, z1] = w.pts[i], [x2, y2, z2] = w.pts[i + 1], dx = x2 - x1, dy = y2 - y1, LL = dx * dx + dy * dy || 1
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / LL))
        const d = Math.hypot(x - x1 - t * dx, y - y1 - t * dy)
        if (d < best) { best = d; z = z1 + (z2 - z1) * t }
      }
      if (best < Math.min(r, halfW(w) + 0.5)) out.push({ z, w })
    }
    return out
  }
  const G_DEPTH = 1.9, PAR_H = 1.0, PAR_W = 0.45
  const parLow = new Part(), parDet = new Part()
  /** The low model follows each ramp at ~18 m chords, the detail model at its ~10 m nodes. */
  const coarse = (pts: [number, number, number][]) => {
    const out = [pts[0]]
    for (let i = 1; i < pts.length - 1; i++) {
      const a = out[out.length - 1], b = pts[i], c = pts[i + 1]
      const h1 = Math.atan2(b[1] - a[1], b[0] - a[0]), h2 = Math.atan2(c[1] - b[1], c[0] - b[0])
      const turn = Math.abs(((h2 - h1 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI)
      if (Math.hypot(c[0] - a[0], c[1] - a[1]) > 19 || turn > 0.2 || inSpan(b[0], b[1]) !== inSpan(c[0], c[1])) out.push(b)
    }
    out.push(pts[pts.length - 1])
    return out
  }
  for (const w of roads) {
    const hw = halfW(w)
    for (const [pts, gold, par, shade, det] of [[coarse(w.pts), apprLow, parLow, shadeLow, false], [w.pts, apprDet, parDet, shadeDet, true]] as const) {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1, z1] = pts[i], [x2, y2, z2] = pts[i + 1]
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        if (!inOutline(mx, my) || inSpan(mx, my)) continue
        const t = norm([x2 - x1, y2 - y1, 0]), nx: V3 = [t[1], -t[0], 0] // right of travel
        const P = (x: number, y: number, k: number, z: number): V3 => [x + nx[0] * k, y + nx[1] * k, z]
        for (const s of [-1, 1]) {
          const o = s * hw, oi = s * (hw - PAR_W), n: V3 = mul(nx, s), nIn: V3 = mul(nx, -s)
          // Gold fascia girder.
          const ga = P(x1, y1, o, z1 - 0.25), gb = P(x2, y2, o, z2 - 0.25), gc = P(x2, y2, o, z2 - G_DEPTH), gd = P(x1, y1, o, z1 - G_DEPTH)
          face(gold, gd, gc, gb, ga, n)
          // Concrete parapet on the deck edge (its narrow top only in the detail model).
          const pa = P(x1, y1, o, z1 + PAR_H), pb = P(x2, y2, o, z2 + PAR_H), qa = P(x1, y1, oi, z1 + PAR_H), qb = P(x2, y2, oi, z2 + PAR_H)
          face(par, ga, gb, pb, pa, n)
          if (det) face(par, pa, pb, qb, qa, [0, 0, 1])
          face(par, P(x1, y1, oi, z1 - 0.25), P(x2, y2, oi, z2 - 0.25), det ? qb : pb, det ? qa : pa, nIn)
        }
        // Soffit between the girders.
        face(shade, P(x1, y1, -hw, z1 - G_DEPTH), P(x2, y2, -hw, z2 - G_DEPTH), P(x2, y2, hw, z2 - G_DEPTH), P(x1, y1, hw, z1 - G_DEPTH), [0, 0, -1])
      }
    }
  }

  console.log('parapets low', parLow.triangles, 'det', parDet.triangles, 'appr low', apprLow.triangles, 'det', apprDet.triangles)
  // ---- Piers from OSM -------------------------------------------------------------------
  for (const pier of S.piers) {
    const cx = pier.pts.reduce((a, p) => a + p[0], 0) / pier.pts.length, cy = pier.pts.reduce((a, p) => a + p[1], 0) / pier.pts.length
    // Top: under the lowest structure over it.
    let top = Infinity
    for (const [px, py] of [...pier.pts, [cx, cy] as [number, number]]) {
      if (inSpan(px, py) || Math.abs(py - Y0) < 6 || Math.abs(py - Y1) < 6) top = Math.min(top, (S.lower ? S.lower(py) - (S.trussBelow ?? 3.8) : up(py) + (S.tie ? S.tie.up - S.tie.depth : -G_DEPTH)))
      for (const d of decksAt(px, py, 30)) top = Math.min(top, d.z - G_DEPTH - 0.9)
    }
    if (!isFinite(top)) continue
    let plan = pier.pts.slice()
    // Counter-clockwise from above.
    const area = plan.reduce((a, p, i) => { const q = plan[(i + 1) % plan.length]; return a + p[0] * q[1] - q[0] * p[1] }, 0)
    if (area < 0) plan = plan.reverse()
    const twin = S.twinPiers
    if (twin?.ids.includes(pier.id)) {
      // A low wall over the whole OSM footprint, and a shaft under each truss.
      footedLoft(concrete, ground, [{ plan, z: 'ground' }, { plan, z: Math.min(twin.wall, top) }], 6)
      const ys = plan.map((p) => p[1]), ya = Math.min(...ys) + 0.3, yb = Math.max(...ys) - 0.3
      for (const s of [-1, 1]) {
        const x0 = s * XR - twin.shaft / 2, x1 = s * XR + twin.shaft / 2
        footedLoft(concrete, ground, [{ plan: [[x0, ya], [x1, ya], [x1, yb], [x0, yb]], z: 'ground' }, { plan: [[x0, ya], [x1, ya], [x1, yb], [x0, yb]], z: top }], 6)
      }
      continue
    }
    footedLoft(concrete, ground, [{ plan, z: 'ground' }, { plan, z: top }], 6)
  }

  console.log('osm piers', concrete.triangles)
  // ---- Estimated bents along the approaches ----------------------------------------------
  const nearPier = (x: number, y: number) => S.piers.some((p) => distToPoly(p.pts, x, y) < 9)
  const placed: [number, number][] = []
  for (const w of roads) {
    const hw = halfW(w)
    let run = S.bentStep / 2
    for (let i = 0; i < w.pts.length - 1; i++) {
      const [x1, y1] = w.pts[i], [x2, y2] = w.pts[i + 1], seg = Math.hypot(x2 - x1, y2 - y1)
      for (let d = 0; d < seg; d += 1) {
        run += 1
        if (run < S.bentStep) continue
        const t = d / seg, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t
        if (!inOutline(x, y, -1) || inSpan(x, y) || nearPier(x, y) || S.noBents?.(x, y) || placed.some(([px, py]) => Math.hypot(px - x, py - y) < 14)) continue
        const here = decksAt(x, y, hw + 4).filter((d2) => Math.abs(d2.z - (w.pts[i][2] + (w.pts[i + 1][2] - w.pts[i][2]) * t)) > 3 || d2.w === w)
        const mine = here.find((d2) => d2.w === w)
        if (!mine) continue
        const others = here.filter((d2) => d2.w !== w)
        if (others.some((o) => o.z < mine.z)) continue // the lower deck's bent carries this one
        const g = ground(x, y)
        if (g < 0.3 || mine.z - g < 4.5) continue
        run = 0
        placed.push([x, y])
        const topZ = Math.max(mine.z, ...others.map((o) => o.z))
        const tx = (x2 - x1) / seg, ty = (y2 - y1) / seg, nx = ty, ny = -tx
        const colX = others.length ? hw + 0.9 : w.lanes <= 2 ? 0 : hw - 2.2
        const cols = colX === 0 ? [0] : [-colX, colX]
        const hc = colX === 0 ? 1.1 : 0.75
        for (const k of cols) {
          const cx = x + nx * k, cy = y + ny * k
          const sq: [number, number][] = [[-hc, -hc], [hc, -hc], [hc, hc], [-hc, hc]].map(([a, b]) => [cx + tx * b + nx * a, cy + ty * b + ny * a])
          const ccw = (sq[1][0] - sq[0][0]) * (sq[2][1] - sq[0][1]) - (sq[1][1] - sq[0][1]) * (sq[2][0] - sq[0][0]) > 0 ? sq : sq.reverse()
          footedLoft(concrete, ground, [{ plan: ccw, z: 'ground' }, { plan: ccw, z: topZ - G_DEPTH - 0.9 }], 4, false)
        }
        // Cap beams under each deck.
        for (const z of [mine.z, ...(others.length ? [topZ] : [])]) {
          const reach = Math.max(hw - 0.3, colX + hc)
          const a: V3 = [x - nx * reach, y - ny * reach, z - G_DEPTH - 0.45], b: V3 = [x + nx * reach, y + ny * reach, z - G_DEPTH - 0.45]
          beam(concrete, a, b, 1.6, 0.9, [0, 0, 1], true)
        }
      }
    }
  }

  console.log('after bents', concrete.triangles, 'bents', placed.length)
  // ---- Walkways the model owns -----------------------------------------------------------
  /** A walkway is drawn inside the outline and wherever it runs along the span, hung from the truss. */
  const onWalkway = (x: number, y: number) => inOutline(x, y, 2) || (y > Y0 - 3 && y < Y1 + 3 && Math.abs(x) < S.deckEdge + 4)
  for (const wk of S.walks ?? []) {
   for (const [p, det] of [[apprLow, false], [apprDet, true]] as const) {
    // The low model follows the walk at ~18 m chords and leaves out its underside.
    const pts = det ? wk.pts : coarse(wk.pts)
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1, z1] = pts[i], [x2, y2, z2] = pts[i + 1]
      if (!(wk.on ?? onWalkway)((x1 + x2) / 2, (y1 + y2) / 2)) continue
      const t = norm([x2 - x1, y2 - y1, 0]), n: V3 = [t[1], -t[0], 0], hw = wk.width / 2
      const P = (x: number, y: number, k: number, z: number): V3 => [x + n[0] * k, y + n[1] * k, z]
      {
        face(p, P(x1, y1, -hw, z1), P(x2, y2, -hw, z2), P(x2, y2, hw, z2), P(x1, y1, hw, z1), [0, 0, 1])
        if (det) face(p, P(x1, y1, -hw, z1 - 0.5), P(x2, y2, -hw, z2 - 0.5), P(x2, y2, hw, z2 - 0.5), P(x1, y1, hw, z1 - 0.5), [0, 0, -1])
        for (const s of [-1, 1]) face(p, P(x1, y1, s * hw, z1 - 0.5), P(x2, y2, s * hw, z2 - 0.5), P(x2, y2, s * hw, z2), P(x1, y1, s * hw, z1), mul(n, s))
        if (det) for (const s of [-1, 1]) {
          const k = s * (hw - 0.05)
          face(p, P(x1, y1, k, z1), P(x2, y2, k, z2), P(x2, y2, k, z2 + 1.1), P(x1, y1, k, z1 + 1.1), mul(n, s))
          face(p, P(x1, y1, k, z1), P(x2, y2, k, z2), P(x2, y2, k, z2 + 1.1), P(x1, y1, k, z1 + 1.1), mul(n, -s))
        }
      }
    }
   }
  }

  // ---- Ends: an abutment face wherever a deck the model draws stops ------------------------
  // A roadway or walkway leaving the outline (onto an approach OSM maps as a separate
  // bridge, a fill or a tunnel portal) ends on a solid concrete wall from the ground up
  // to just under its surface, closing the girders' ends, so no deck stops in the air.
  const walkHalf = (wk: Walk) => wk.width / 2
  const roadDrawn = (w: Way, i: number) => {
    const [x1, y1] = w.pts[i], [x2, y2] = w.pts[i + 1], mx = (x1 + x2) / 2, my = (y1 + y2) / 2
    return inOutline(mx, my) && !inSpan(mx, my)
  }
  const walkDrawn = (wk: Walk, i: number) => (wk.on ?? onWalkway)((wk.pts[i][0] + wk.pts[i + 1][0]) / 2, (wk.pts[i][1] + wk.pts[i + 1][1]) / 2)
  /** Is (x, y, z) on another drawn deck, so the deck carries on there? */
  const continues = (x: number, y: number, z: number, self: object) => {
    for (const w of roads) {
      if (w === self) continue
      for (let i = 0; i < w.pts.length - 1; i++) {
        if (!roadDrawn(w, i) && !inSpan((w.pts[i][0] + w.pts[i + 1][0]) / 2, (w.pts[i][1] + w.pts[i + 1][1]) / 2)) continue
        const [x1, y1, z1] = w.pts[i], [x2, y2, z2] = w.pts[i + 1], dx = x2 - x1, dy = y2 - y1, LL = dx * dx + dy * dy || 1
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / LL))
        if (Math.hypot(x - x1 - t * dx, y - y1 - t * dy) < halfW(w) + 0.5 && Math.abs(z1 + (z2 - z1) * t - z) < 1.5) return true
      }
    }
    for (const wk of S.walks ?? []) {
      if (wk === self) continue
      for (let i = 0; i < wk.pts.length - 1; i++) {
        if (!walkDrawn(wk, i)) continue
        const [x1, y1, z1] = wk.pts[i], [x2, y2, z2] = wk.pts[i + 1], dx = x2 - x1, dy = y2 - y1, LL = dx * dx + dy * dy || 1
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / LL))
        if (Math.hypot(x - x1 - t * dx, y - y1 - t * dy) < walkHalf(wk) + 0.5 && Math.abs(z1 + (z2 - z1) * t - z) < 1.5) return true
      }
    }
    return false
  }
  const ends: { x: number; y: number; z: number; tx: number; ty: number; hw: number; under: number; kind: string }[] = []
  const findEnds = (pts: [number, number, number][], drawn: (i: number) => boolean, hw: number, under: number, self: object, kind: string) => {
    const n = pts.length - 1
    for (let i = 0; i < n; i++) {
      if (!drawn(i)) continue
      for (const [k, k2, first] of [[i, i + 1, i === 0 || !drawn(i - 1)], [i + 1, i, i === n - 1 || !drawn(i + 1)]] as const) {
        if (!first) continue
        const [x, y, z] = pts[k], [x2, y2] = pts[k2], L2 = Math.hypot(x2 - x, y2 - y) || 1
        if (y > Y0 - 3 && y < Y1 + 3 && Math.abs(x) < S.deckEdge + 3) continue // on the truss
        const nb = first && k === i ? i - 1 : i + 1 // the segment beyond this end, if any
        if (nb >= 0 && nb < n && inSpan((pts[nb][0] + pts[nb + 1][0]) / 2, (pts[nb][1] + pts[nb + 1][1]) / 2)) continue // runs on into the span
        if (continues(x, y, z, self)) continue
        if (z - ground(x, y) < 0.6) continue // already on the ground
        ends.push({ x, y, z, tx: (x2 - x) / L2, ty: (y2 - y) / L2, hw, under, kind })
      }
    }
  }
  for (const w of roads) findEnds(w.pts, (i) => roadDrawn(w, i), halfW(w), 0.35, w, `road ${w.id}`)
  for (const wk of S.walks ?? []) findEnds(wk.pts, (i) => walkDrawn(wk, i), walkHalf(wk), 0.1, wk, 'walk')
  for (const e of ends) {
    // Carry any deck lower down at the same spot too: stop under the lowest one.
    let top = e.z - e.under
    for (const d of decksAt(e.x, e.y, e.hw + 2)) if (d.z < e.z - 2) top = Math.min(top, d.z - G_DEPTH)
    const T = 1.4, nx = e.ty, ny = -e.tx, hw = e.hw + 0.15
    const plan = ([[0, -hw], [T, -hw], [T, hw], [0, hw]] as [number, number][]).map(([a, b]) => [e.x + e.tx * a + nx * b, e.y + e.ty * a + ny * b] as [number, number])
    const area = plan.reduce((s, p, i) => { const q = plan[(i + 1) % 4]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
    footedLoft(concrete, ground, [{ plan: area < 0 ? plan.reverse() : plan, z: "ground" }, { plan, z: top }], 8)
  }
  console.log('end walls', ends.map((e) => `${e.kind} @${e.x.toFixed(0)},${e.y.toFixed(0)} z${e.z.toFixed(1)}`).join('; '))

  // ---- Walkway supports beyond the span --------------------------------------------------
  // Where a walkway leaves the arch and no deck carries it, it stands on its own concrete
  // columns with a cap beam, ~WALK_STEP apart, down to the ground (positions estimated).
  const WALK_STEP = 24
  let walkCols = 0
  for (const wk of S.walks ?? []) {
    let run = WALK_STEP / 2
    for (let i = 0; i < wk.pts.length - 1; i++) {
      if (!walkDrawn(wk, i)) { run = WALK_STEP / 2; continue }
      const [x1, y1, z1] = wk.pts[i], [x2, y2, z2] = wk.pts[i + 1], seg = Math.hypot(x2 - x1, y2 - y1)
      for (let d = 0; d < seg; d += 1) {
        run += 1
        if (run < WALK_STEP) continue
        const t = d / seg, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, z = z1 + (z2 - z1) * t
        if (y > Y0 - 4 && y < Y1 + 4) continue // hung from the truss
        if (ends.some((e) => Math.hypot(e.x - x, e.y - y) < 8)) continue
        if (decksAt(x, y, 12).some((dk) => Math.abs(dk.z - z) < 3)) continue // on a deck's edge
        const g = ground(x, y)
        if (z - g < 2) continue
        run = 0; walkCols++
        const tx = (x2 - x1) / seg, ty = (y2 - y1) / seg, nx = ty, ny = -tx, h = 0.55
        const sq = ([[-h, -h], [h, -h], [h, h], [-h, h]] as [number, number][]).map(([a, b]) => [x + tx * b + nx * a, y + ty * b + ny * a] as [number, number])
        const area = sq.reduce((s, p, k) => { const q = sq[(k + 1) % 4]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
        const ccw = area < 0 ? sq.reverse() : sq
        footedLoft(concrete, ground, [{ plan: ccw, z: 'ground' }, { plan: ccw, z: z - 1.1 }], 4, false)
        const r = walkHalf(wk) + 0.2
        beam(concrete, [x - nx * r, y - ny * r, z - 0.85], [x + nx * r, y + ny * r, z - 0.85], 1.0, 0.6, [0, 0, 1], true)
      }
    }
  }
  console.log('walk columns', walkCols)

  S.extra?.({ concrete, gold: goldLow, detail: false })
  const goldExtraDet = new Part()
  S.extra?.({ concrete: new Part(), gold: goldExtraDet, detail: true })

  // ---- Materials and output ---------------------------------------------------------------
  const lit = (kind: 'arch' | 'deck' | 'approach') => (p: V3, n: V3) => S.floodlight?.(p, n, kind) ?? 0
  const C = S.colors
  const ARCH: MaterialSpec = { ...finish('bridge-gold', C.gold), floodlight: S.floodlight ? lit('arch') : undefined }
  const GOLD: MaterialSpec = { ...finish('bridge-gold-deck', C.gold), floodlight: S.floodlight ? lit('deck') : undefined }
  const SHADE: MaterialSpec = finish('bridge-gold-shade', C.shade)
  const CONC: MaterialSpec = finish('pier-concrete', C.concrete)
  const APPR: MaterialSpec = { ...finish('approach-gold', C.gold), floodlight: S.floodlight ? lit('approach') : undefined }
  const low = [
    { part: archLow, material: ARCH }, { part: goldLow, material: GOLD }, { part: shadeLow, material: SHADE },
    { part: merged(concrete, parLow), material: CONC }, { part: apprLow, material: APPR },
  ]
  const detail = [
    { part: archDet, material: ARCH }, { part: merged(goldDet, goldExtraDet), material: GOLD }, { part: shadeDet, material: SHADE },
    { part: merged(concrete, parDet), material: CONC }, { part: apprDet, material: APPR },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the arch axis midway between the main piers, on the water',
    bearing: S.bearing, elevation: 0, span: S.span, waterNAVD88: S.waterNAVD88,
    roadwayAtArchEnds: [+up(Y0).toFixed(2), +up(Y1).toFixed(2)], ...(S.extras ?? {}),
  }
  const count = (l: { part: Part }[]) => l.reduce((n, { part }) => n + part.triangles, 0)
  for (const [file, list, maxTris, maxBytes] of [
    [`${S.id}.glb`, low, 6500, 250 * 1024],
    [`${S.id}.detail.glb`, detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = count([...list])
    const glb = writeGlb(S.name, [...list], extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes` + Object.entries({ arch: list[0].part, deck: list[1].part, shade: list[2].part, concrete: list[3].part, approach: list[4].part }).map(([k, p]) => ` ${k} ${p.triangles}`).join(''))
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}

/*
 * ---- Fort Pitt Bridge --------------------------------------------------------------------
 *
 * A double-deck bowstring (tied) arch over the Monongahela at the Point,
 * from the Fort Pitt Tunnel under Mount Washington into downtown: two box
 * ribs, each a solid deep box over the crown that opens toward the ends into
 * a laced crescent (a top chord and a bottom chord with posts and
 * diagonals), the ribs braced to each other overhead by struts and a
 * diamond of diagonals; vertical hangers at every panel point carrying a
 * Warren stiffening truss (V diagonals, half-height sub-posts) that holds
 * the upper deck on its top chord and the lower deck at its bottom chord;
 * all steel painted gold. At both ends the decks split into ramps on steel
 * girders, concrete parapets and concrete piers and bents: to the tunnel and
 * West Carson Street on the south bank, to the Parkway East and North on the
 * Point. The model draws all of it across both OSM outlines.
 *
 * Writes a low model (ribs as chords with their lacing, bracing, the
 * stiffening truss as chords, posts and diagonals, the deck edges and
 * soffit, approach girders, parapets and soffits, piers and bents) and a
 * detail model (adds the hangers, the truss's sub-posts, floor beams and the
 * upper deck's railings), drawn from detailZoom 16.
 *
 * Frame: x across the bridge (+x south-east, upstream), y along it toward
 * downtown (north-east), z up, metres; origin on the arch axis midway between
 * the main piers, on the water. Bearing 55.055° (the line through the two
 * main piers' centres in OSM, which the lidar's rib planes follow to 0.1 m
 * over the span; the anchor sits 1.2 m south-east of the piers' line, on the
 * ribs' centre line).
 *
 * Height. z = 0 is the Monongahela (216.33 m NAVD88 in lidar). Ground under
 * the piers and bents is the map's terrain (Mapterhorn, river at 216.13 m)
 * from a 6 m table in this frame (`GROUND`).
 *
 * Roadway heights built to (lidar lower quartile within 1.5 m of each OSM
 * road node, every ~10 m; NAVD88 = value + 216.33). OSM records no height
 * or ele on the outlines or roadways, so these are the heights to give the
 * map (docs/bridge-heights.md):
 * - upper deck (way/121593794, I-376 west to the tunnel): 30.0 m at the
 *   south main pier (y = −114.6), 27.2 at midspan, 23.6 at the north main
 *   pier (+107), a steady 3.0 % grade; 31.9 m at the tunnel end (way/
 *   24957029), 21.6 m where it splits on the Point (way/54210162, y = 156);
 * - lower deck (way/11950069 and its ramps): hidden under the upper deck
 *   across the span; where the lidar sees it through the gap at the deck
 *   edge it reads 5.9–6.5 m lower, so it is built 6.2 m under the upper
 *   deck (23.8 m south, 21.2 midspan, 17.4 north); the south ramp
 *   way/121593795 reads 25.4–26.2 m where it emerges toward the tunnel
 *   (three readings through a gap, 7.6–11.2 m, replaced by 25.5–25.8);
 * - each ramp from its own lidar readings (in `WAYS`).
 *
 * Sources:
 * - OSM: outlines way/1244965378 (upper deck, layer 3) and way/1244978189
 *   (lower deck, layer 2), both man_made=bridge, bridge:structure=arch,
 *   wikidata Q5471837; relation/4246069 (type=bridge, height 146 (ft?),
 *   length 368, start_date 1959-06-19); piers way/663074010 and
 *   way/663074011 (the main piers) and way/663074012 (south approach), all
 *   bridge:support=pier. The only building inside the outlines is
 *   way/364838217 (building=government, untagged otherwise, 449 m², about
 *   half of it inside the lower deck's outline): a low building at grade
 *   beneath the Point ramps, which stand about 9 m over it in lidar. The
 *   model doesn't draw it and draws nothing at its level, so it is left
 *   out of `replaces` and the map keeps drawing it under the ramps. The
 *   Fort Pitt Tunnel's portal block (way/534079104) starts at the outlines'
 *   south tip and the Fort Pitt Museum stands beside the Point ramps.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid over the
 *   whole bridge: ribs centred at x = ±9.7 (19.4 m apart), 2–2.3 m wide;
 *   crown 64.6 m above the river at y = −6; the crown line every 6 m is
 *   `extrados` below (both ribs agree within 0.3 m); the ribs land on the
 *   truss over the main piers (y = ±114.6, 229.2 m apart); deck edges
 *   ±11.3 m; overhead bracing a diamond of diagonals between struts, read
 *   in the 1 m grid at the crown.
 * - Published (Wikipedia "Fort Pitt Bridge"; HAER PA-469 overview): opened
 *   1959, double-deck tied arch, main span 750 ft (229 m), the first
 *   computer-designed bowstring arch.
 * - Photos (Wikimedia Commons):
 *   - "Fort Pitt Bridge 2025" (Antony-22, CC BY-SA 4.0): the upstream
 *     elevation from the Ohio side, rib shape and the approach piers;
 *   - "Fort Pitt Bridge, 2021-05-11, 01" and "…, 02" (Cbaile19, CC0): the
 *     downstream elevation: 16 truss panels, the laced crescent ends of the
 *     ribs reaching about 70 m in from each end, the bottom chord landing
 *     one panel in, single hangers at each panel point;
 *   - "Fort Pitt Bridge, 2024-05-27" (Cbaile19, CC0): the Point ramps, gold
 *     girders on concrete piers;
 *   - "Fort Pitt Bridge (1)" (Paul Lowry, CC BY 2.0): the ramps' concrete
 *     parapets over gold girders;
 *   - "Fort Pitt Bridge and Tunnel Entrance" (Jim Kuhn, CC BY 4.0): the
 *     whole bridge from Point State Park: the overhead bracing's struts
 *     and diagonals, the V-web truss, the decks;
 *   - "Fort Pitt Bridge P6210246" (Chris Light, CC BY-SA 4.0): the
 *     upstream side from the Point: the crescent rib ends and their lacing,
 *     the twin pier shafts on a low wall, paired hangers;
 *   - "Fort Pitt Bridge at night" (Paul Lowry, CC BY 2.0): night.
 * - Night: the arch, its bracing and the hangers are floodlit (they glow
 *   pale gold-green above the dark river); the truss catches the deck
 *   lighting. So `_FLOODLIGHT` full on the ribs, bracing and hangers (faces
 *   looking up less), half on the stiffening truss, none on the approaches.
 *
 * Estimated: the rib chords' depths (2.0 and 1.7 m, meeting as a 3.6 m box
 * over the middle, from the photos: each chord reads about a seventh of a
 * 14.3 m panel deep in "…, 01"), the bottom chord's line (from the photos:
 * it leaves the top chord about five panels from each end, 42 m either side
 * of midspan, and runs nearly straight to the deck one panel in, half-way
 * down from the top chord to the deck two panels in), the paired hangers
 * (0.35 m rods 0.7 m apart, detail only), the main piers' shape (a low wall
 * about 6 m high over OSM's footprint with a 6 m square shaft under each
 * truss, from "Fort Pitt Bridge P6210246" (Chris Light, CC BY-SA 4.0) and
 * "…, 01"), the truss chords' depths and
 * the 6.2 m between decks, the deck girders (1.9 m under the road) and
 * parapets (1.0 m) on the approaches, the ramps' widths (3.6 m a lane plus
 * shoulders, from OSM lanes), the piers' tops (under the structure), and
 * every approach bent: OSM maps only three piers, so a bent of one or two
 * columns stands every ~32 m along each ramp where the deck is more than
 * 4.5 m over dry ground. Their positions are invented; the photos show such
 * bents but were not used to place each one.
 * Ends and heights, November 2026 (review fixes):
 * - Every deck now ends on a solid concrete end wall (1.4 m thick, the deck's
 *   width, from the map's terrain to 0.35 m under the roadway, closing the
 *   girders) where it leaves the outlines and nothing the model draws carries
 *   on: both decks at the Fort Pitt Tunnel portal face (y = -253/-250; the
 *   decks run into the tunnel, ways 28411466 and 550018213 off the bridge),
 *   the Carson Street ramps at the outlines' south-west tip, and the five Point
 *   ramps where the outlines stop (their continuations, 121593802's tail,
 *   264591820, 550018192, 54210157, 54210163, 54210156, are drawn by the map
 *   as separate bridges or fill). The builder finds these ends itself
 *   (`findEnds`); the model no longer stops in the air on a bent.
 * - The lower-level walkway (way/173225719, foot and cycle) was missing: it
 *   is now drawn, surface, railings and all, where OSM's line lies inside the
 *   outlines, on the lidar's 2 m strip at x = -11.9 outside the upstream truss
 *   over the span, at its lidar heights (`WALK_Z`: 5.7-6.1 m under the upper
 *   roadway), with an end wall at each end of the outline and concrete columns
 *   (positions estimated, ~24 m apart) where no deck carries it.
 * - Heights re-measured with tools/bridge_ele.py (PA_WesternPA_2_2019) on every
 *   carriageway: the upper deck matches the model to 0.1 m (248.19 m NAVD88 at
 *   the tunnel, 246.33 at the south main pier, 239.88 at the north). One error
 *   fixed: the split node 683700449 at y = 160 was built 2.9 m high (24.3 m;
 *   lidar 21.4 m). The lower deck can't be read under the upper one; at the
 *   upstream deck edge the walkway reads 5.8-6.0 m under it, so the 6.2 m
 *   spacing stays. OSM ele tags for the user: ~/landmarks-scratch/osm-ele/
 *   pit-fort-pitt-bridge.md.
 * - Still estimated: every approach bent (OSM maps three piers), the pier
 *   tops, the end walls' thickness and the walkway's columns.
 * Colour: gold from the sunlit photos, as on the Three Sisters (#d8c062);
 * concrete piers #b8b3a8.
 */
// Data in this frame: anchor [-80.0113569, 40.4388519] bearing 55.055
const GROUND: GroundGrid = {"y0":-268.0,"x0":-74.0,"step":6.0,"z":[[17.9,18.3,18.8,19.8,21.6,24.1,26.4,27.2,26.1,23.4,24.6,28.7,34.8,40.7,41.7,40.7,38.7,37.7,38.7,38.5,37.4,36.6,36.4,37.4,38.1,41.6,44.1,46.6,48.3,50.6,55.6,56.1,60.1,65.6,70.7,79.9],[18.0,18.0,17.9,17.9,18.0,18.6,21.3,23.5,22.0,19.9,20.7,25.3,31.1,35.6,37.3,36.8,35.3,34.1,34.0,35.0,35.5,35.5,35.0,33.8,32.3,31.8,32.6,37.7,43.5,47.4,50.1,54.5,56.2,60.9,66.2,74.3],[17.7,17.9,18.0,18.0,18.0,17.9,17.8,18.1,18.4,18.1,17.9,20.8,24.8,27.8,28.8,29.2,29.5,32.2,32.1,31.9,31.6,31.4,31.4,31.5,31.4,31.0,30.4,30.4,35.0,41.6,44.6,50.2,54.8,58.4,65.8,71.0],[16.9,17.2,17.4,17.6,17.9,17.9,18.0,17.9,17.8,17.8,17.7,19.7,21.2,22.3,24.1,26.6,26.8,27.5,28.3,29.3,30.7,31.0,30.8,30.6,30.4,30.2,30.0,29.9,30.0,34.6,40.1,46.2,55.8,59.3,67.0,68.9],[15.4,15.6,16.0,16.6,17.1,17.4,17.6,17.8,17.9,17.9,17.9,17.8,17.7,17.9,20.9,22.2,22.7,24.0,25.5,26.5,27.9,28.3,28.7,29.3,29.7,29.9,29.9,29.8,29.8,29.7,35.1,44.2,57.0,61.6,65.7,65.3],[14.7,14.5,14.5,14.6,15.0,15.8,16.6,17.1,17.3,17.5,17.8,17.9,17.8,17.8,17.7,17.7,18.0,19.0,19.4,21.5,25.3,28.3,28.7,29.0,29.2,29.5,29.7,29.7,29.6,30.2,39.7,53.3,59.0,61.4,61.3,60.8],[14.7,14.4,14.1,13.8,13.6,13.7,14.4,15.1,16.4,17.1,17.3,17.2,17.5,17.7,17.8,17.8,17.8,17.7,17.6,17.6,19.1,22.1,25.3,27.3,28.8,29.5,29.5,29.5,29.4,33.6,44.8,49.9,53.3,54.1,54.4,53.8],[13.8,14.1,13.9,13.7,13.5,13.2,12.9,13.0,13.5,13.7,15.3,16.1,16.1,16.8,17.3,17.4,17.7,17.8,17.8,17.8,17.5,17.5,18.1,19.4,23.6,26.1,28.4,29.7,29.7,36.1,41.9,44.2,46.0,45.4,47.3,47.0],[9.9,11.1,12.2,12.9,13.2,13.0,12.8,12.6,12.3,11.9,11.7,11.7,12.9,14.0,15.3,16.5,16.9,17.0,17.3,17.6,17.7,17.8,17.7,17.5,17.5,18.7,21.3,24.6,27.9,30.7,32.3,35.3,38.9,39.0,39.8,39.4],[7.8,8.0,8.7,9.8,10.7,11.5,12.3,12.3,12.1,11.9,11.6,11.3,11.5,11.9,12.2,12.7,14.1,15.0,15.9,16.6,16.9,17.3,17.6,17.6,17.8,17.7,17.5,17.5,20.2,23.7,25.3,27.9,29.3,31.5,32.8,32.6],[7.7,7.8,7.8,7.9,8.0,8.8,10.0,11.1,11.8,11.7,11.4,11.2,11.0,10.7,10.4,10.0,9.9,10.4,12.0,13.8,15.2,16.2,16.6,16.9,17.3,17.6,17.6,17.7,17.6,17.4,17.5,19.4,22.8,25.5,27.1,26.5],[7.6,7.6,7.7,7.7,7.8,7.8,7.9,8.9,9.7,9.9,10.2,10.7,10.6,10.4,10.2,10.0,9.7,9.5,9.2,9.3,10.5,12.4,13.9,15.3,16.2,16.6,16.8,17.2,17.6,17.6,17.7,17.6,17.3,17.5,19.1,21.3],[7.5,7.6,7.6,7.6,7.7,7.7,7.7,7.7,8.2,8.8,9.1,8.8,8.8,9.3,9.6,9.8,9.6,9.4,9.2,9.0,8.8,8.6,9.0,10.4,12.4,14.2,15.4,16.2,16.5,16.7,17.2,17.5,17.5,17.6,17.6,17.4],[7.4,7.4,7.5,7.5,7.6,7.6,7.6,7.6,7.7,7.9,7.8,7.8,7.9,8.0,8.2,8.5,9.1,9.2,9.0,8.9,8.8,8.7,8.6,8.5,8.4,8.8,10.5,12.7,14.4,15.5,15.9,16.3,16.7,17.1,17.4,17.5],[7.3,7.3,7.4,7.4,7.5,7.5,7.5,7.5,7.6,7.6,7.6,7.7,7.7,7.8,7.8,7.9,8.0,8.2,8.6,9.0,8.7,8.6,8.5,8.5,8.4,8.4,8.4,8.5,9.1,10.7,12.4,13.9,15.5,16.2,16.3,16.8],[6.9,7.0,7.2,7.3,7.4,7.4,7.4,7.4,7.4,7.5,7.6,7.6,7.6,7.7,7.8,7.8,7.9,7.9,8.0,8.1,8.5,8.7,8.6,8.4,8.4,8.4,8.5,8.5,8.5,8.5,8.6,9.3,10.8,12.3,13.8,15.0],[6.0,6.3,6.7,7.0,7.1,7.2,7.3,7.3,7.2,7.3,7.4,7.4,7.5,7.5,7.6,7.7,7.7,7.8,7.8,7.9,8.0,8.2,8.3,8.5,8.8,8.6,8.4,8.5,8.6,8.6,8.6,8.7,8.7,8.9,9.3,10.1],[6.3,6.3,6.1,6.1,6.5,6.8,6.8,6.8,6.8,7.0,7.1,7.2,7.3,7.3,7.4,7.5,7.6,7.7,7.8,7.9,7.9,8.1,8.3,8.4,8.5,8.6,8.8,8.8,8.7,8.6,8.6,8.8,8.8,8.9,8.9,8.8],[5.9,6.2,6.3,6.3,6.2,5.9,5.9,6.1,6.3,6.5,6.7,6.7,6.9,7.0,7.2,7.3,7.4,7.5,7.6,7.8,7.9,8.0,8.2,8.3,8.4,8.5,8.6,8.6,8.7,8.9,8.9,8.8,8.8,8.8,8.9,9.0],[2.5,4.5,5.7,6.1,6.3,6.3,6.2,5.9,5.8,5.9,6.1,6.3,6.5,6.6,6.8,7.0,7.2,7.3,7.5,7.6,7.7,7.9,8.0,8.2,8.3,8.4,8.5,8.6,8.6,8.7,8.8,8.8,9.0,8.9,8.8,8.9],[0.0,0.4,1.6,3.2,4.8,5.9,6.2,6.2,6.3,6.1,5.9,6.0,6.2,6.3,6.5,6.7,6.9,7.1,7.3,7.5,7.6,7.7,7.9,8.0,8.2,8.3,8.4,8.5,8.6,8.7,8.8,8.8,8.9,8.9,8.9,9.0],[0.0,0.0,0.0,0.2,0.7,1.9,4.0,5.6,6.1,6.2,6.2,6.2,6.1,6.0,6.0,6.2,6.5,6.6,7.1,7.3,7.5,7.6,7.7,7.9,8.1,8.2,8.3,8.4,8.5,8.7,8.8,8.8,8.8,8.9,8.9,8.9],[0.0,0.0,0.0,0.0,0.0,0.1,0.5,1.8,3.7,5.3,5.9,6.1,6.1,6.0,6.0,5.9,6.0,6.5,6.8,7.1,7.3,7.4,7.5,7.7,7.9,8.0,8.2,8.3,8.4,8.5,8.6,8.8,8.9,8.8,8.8,8.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.3,1.8,2.8,3.9,5.1,5.8,5.9,6.2,6.2,5.9,5.8,6.1,6.7,6.9,7.2,7.4,7.5,7.7,7.9,8.0,8.1,8.2,8.3,8.4,8.5,8.7,8.7,8.8,8.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.8,2.0,2.3,3.1,4.1,4.9,5.6,6.1,6.1,6.2,5.9,5.8,6.1,6.7,7.2,7.4,7.5,7.7,7.8,7.9,8.0,8.1,8.2,8.3,8.4,8.5,8.6,8.6],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.6,1.4,1.9,2.5,2.8,3.1,4.3,5.3,6.0,6.1,6.2,5.9,5.8,6.1,6.9,7.3,7.4,7.6,7.7,7.8,7.9,8.0,8.1,8.2,8.3,8.3,8.4],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.2,0.4,0.6,0.9,1.4,2.3,3.5,5.1,5.9,6.1,6.1,6.0,5.8,6.1,6.8,7.3,7.4,7.6,7.7,7.8,7.9,8.0,8.1,8.1,8.2],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.6,1.6,2.8,4.7,5.8,6.0,6.1,6.0,5.8,6.1,6.9,7.4,7.6,7.7,7.8,7.8,7.9,7.9,8.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.7,1.9,4.0,5.7,6.0,6.1,6.0,5.8,6.2,7.1,7.5,7.5,7.7,7.8,7.8,7.9],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.7,2.0,4.2,5.7,6.0,6.0,6.0,5.8,5.9,6.7,7.4,7.6,7.7,7.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.8,2.4,4.4,5.7,5.9,6.0,6.1,5.8,5.8,6.6,7.4,7.6],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.4,2.0,3.9,5.3,5.9,6.0,6.1,5.8,5.8,6.5],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.6,3.1,4.9,5.8,5.9,6.1,5.9],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.9,3.3,5.0,5.8,5.9],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.2,3.0,4.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.4,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.1,1.1,0.8,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.0,1.7,1.3,1.1,1.0,0.5,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.3,3.2,2.6,1.7,1.2,1.1,1.1,0.8,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.5,3.4,3.4,3.3,2.4,1.4,1.3,1.3,1.1,1.0,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.4,3.4,3.4,3.5,3.5,2.7,1.7,1.8,2.1,1.7,1.5,0.9,0.4,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.7,3.6,3.6,3.6,3.6,3.7,3.2,2.4,2.8,3.0,2.8,2.5,2.1,1.6,1.3,0.8,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.2,4.0,3.8,3.8,3.7,3.7,3.7,3.5,3.3,3.5,3.9,4.1,3.6,3.1,2.8,2.2,1.7,1.1,0.3,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.4,4.3,4.1,3.9,3.9,3.8,3.8,3.8,3.8,3.9,4.1,4.3,4.5,4.6,4.6,4.3,3.6,3.1,2.5,1.6,1.6,0.5,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.6,4.5,4.3,4.1,4.0,4.1,4.4,4.4,4.3,4.3,4.4,4.5,4.7,4.8,5.0,5.0,5.1,4.9,4.4,4.0,3.7,3.3,3.2,1.8,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.7,4.6,4.5,4.4,4.2,4.4,4.5,4.6,4.7,4.6,4.6,4.9,5.0,5.1,5.2,5.3,5.3,5.3,5.3,5.2,5.1,4.5,4.3,4.8,4.7,3.7,0.8,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.8,4.7,4.6,4.5,4.3,4.5,4.6,4.6,4.7,4.7,4.7,5.0,5.2,5.5,5.7,5.6,5.4,5.2,5.1,5.0,5.0,4.9,4.8,4.9,5.0,5.0,5.0,4.6,1.8,0.1,0.0,0.0,0.0,0.0,0.0,0.0],[4.7,4.6,4.6,4.4,4.3,4.5,4.6,4.6,4.7,5.4,5.4,5.4,5.3,5.4,5.6,5.3,5.1,5.0,4.9,4.9,4.8,4.8,4.7,4.7,4.8,4.8,4.7,4.7,5.0,5.0,2.7,0.2,0.0,0.0,0.0,0.0],[4.6,4.6,4.5,4.5,4.3,4.3,4.5,4.6,4.8,6.2,6.6,6.4,6.2,5.8,5.5,5.3,5.3,5.1,5.1,5.1,5.1,5.2,5.2,5.1,4.9,5.0,4.8,4.6,4.7,4.8,5.1,5.3,2.7,0.3,0.0,0.0],[4.6,4.5,4.5,4.3,4.3,4.3,4.4,4.5,5.2,7.2,6.9,6.5,6.1,5.6,5.3,5.0,4.9,4.7,4.6,4.7,4.8,4.9,5.0,5.1,5.3,5.3,5.2,5.0,4.9,4.8,5.0,5.3,5.5,5.5,3.0,0.3],[4.7,4.6,4.4,4.4,4.4,4.4,4.5,4.6,5.5,6.8,6.9,6.4,5.9,5.4,5.1,4.9,4.9,4.9,4.9,5.0,5.0,4.9,4.9,4.9,5.0,5.2,5.3,5.5,5.1,5.1,5.1,5.2,5.5,5.7,6.0,4.7],[4.7,4.6,4.6,4.6,4.5,4.5,4.5,4.8,5.3,6.0,6.6,6.4,5.9,5.4,5.5,7.0,6.7,5.6,5.4,5.3,5.2,5.2,5.2,4.9,5.0,5.1,5.2,5.3,5.4,5.3,5.3,5.4,5.5,5.7,6.0,6.3],[4.8,4.8,4.7,4.6,4.6,4.6,4.6,4.7,5.2,5.8,6.2,6.2,6.1,6.0,8.2,10.5,10.9,10.5,10.2,9.9,9.5,8.9,5.3,5.1,5.1,5.2,5.2,5.2,5.3,5.4,5.5,5.5,5.6,5.7,6.0,6.3],[4.8,4.8,4.7,4.7,5.0,5.2,4.7,4.4,4.9,5.4,5.9,6.0,6.2,6.9,8.6,10.8,11.0,11.0,11.4,11.8,10.7,7.1,5.3,5.3,5.3,5.3,5.3,5.3,5.3,5.4,5.5,5.5,5.6,5.7,6.0,6.2],[4.8,4.9,5.1,5.3,5.6,5.8,5.6,4.3,4.6,5.0,5.4,5.8,6.2,7.6,8.9,10.2,10.4,10.3,10.4,11.8,9.6,5.6,5.4,5.4,5.4,5.4,5.4,5.3,5.4,5.4,5.6,5.6,5.6,5.7,5.9,6.1],[5.3,5.5,5.7,6.0,6.2,6.5,6.6,5.3,4.4,4.7,5.1,5.6,6.9,8.4,9.5,10.2,10.4,10.3,11.1,10.5,7.2,5.6,5.6,5.6,5.6,5.5,5.5,5.5,5.4,5.5,5.6,5.7,5.8,5.8,5.8,5.7],[5.9,6.1,6.3,6.6,6.8,7.1,7.5,6.3,5.6,5.6,6.1,6.7,7.8,9.2,10.3,10.4,10.6,10.8,11.8,9.6,5.9,5.7,5.7,5.7,5.7,5.7,5.7,5.6,5.5,5.5,5.6,5.7,5.9,6.0,5.9,5.9],[6.5,6.7,7.0,7.2,7.4,7.7,8.2,7.5,7.1,6.8,7.1,7.8,8.8,9.9,10.5,10.4,11.1,10.5,10.4,7.1,5.9,5.8,5.8,5.8,5.8,5.8,5.8,5.8,5.6,5.6,5.7,5.7,5.8,6.2,6.2,6.0],[6.9,7.3,7.6,7.8,8.0,8.3,8.9,9.0,8.6,8.3,8.5,9.1,9.3,10.1,10.3,10.3,9.5,8.3,7.1,6.3,6.0,6.0,6.0,5.9,5.9,5.9,5.9,5.9,5.8,5.7,5.8,5.8,5.9,6.1,6.5,6.4],[6.7,7.4,8.0,8.4,8.7,8.9,9.5,9.7,9.8,9.6,9.8,10.0,9.9,10.1,10.2,9.8,9.5,8.3,6.9,6.3,6.1,6.1,6.1,6.1,6.1,6.0,6.0,6.0,5.9,5.9,5.9,5.9,6.1,6.1,6.5,6.5],[6.6,7.2,7.8,8.5,9.0,9.5,9.7,9.8,9.9,10.0,10.1,10.0,9.7,10.0,10.3,10.0,9.7,8.5,7.3,6.6,6.4,6.3,6.3,6.2,6.2,6.2,6.1,6.1,6.1,6.1,6.1,6.1,6.2,6.1,6.5,6.2],[6.5,7.0,7.7,8.3,8.9,9.1,9.2,9.4,9.6,9.8,9.9,10.0,9.6,9.8,10.3,10.0,9.8,8.7,7.6,6.8,6.6,6.5,6.4,6.4,6.3,6.3,6.3,6.2,6.2,6.2,6.2,6.2,6.4,6.2,6.2,6.3],[6.5,7.0,7.4,8.0,8.3,8.5,8.7,8.8,9.2,9.5,9.7,9.7,9.4,9.6,10.4,10.2,9.9,9.1,7.9,7.0,6.6,6.6,6.6,6.5,6.4,6.4,6.4,6.4,6.4,6.3,6.3,6.5,6.4,6.3,6.3,6.5]]}
const OUTLINES: Record<string, [number, number][]> = {"1244965378":[[-14.9,-170.6],[-15.5,-178.1],[-16.1,-186.5],[-18.1,-196.5],[-22.1,-207.6],[-14.4,-209.7],[-11.7,-202.8],[-9.6,-193.0],[-8.7,-184.0],[-6.7,-167.3],[-3.9,-144.8],[-3.4,-144.5],[-1.5,-175.4],[1.4,-208.8],[1.8,-236.1],[0.9,-254.3],[6.6,-253.3],[10.3,-252.7],[10.6,-211.9],[6.0,-146.2],[5.6,-118.0],[4.8,-107.2],[8.9,105.2],[10.3,123.2],[12.8,134.2],[14.9,139.6],[18.3,145.0],[32.3,158.1],[66.8,177.1],[121.2,208.7],[118.5,213.3],[116.7,216.6],[115.0,219.6],[32.6,173.5],[17.2,160.2],[7.8,152.5],[10.9,229.3],[13.1,264.8],[4.3,265.5],[1.9,218.1],[0.3,218.9],[-0.5,229.5],[-3.0,242.4],[-8.3,255.2],[-15.4,266.4],[-19.5,273.4],[-30.8,285.1],[-37.5,291.3],[-44.8,282.8],[-33.7,271.6],[-21.1,255.2],[-13.9,239.1],[-11.3,226.6],[-9.4,213.6],[-8.8,197.9],[-7.5,177.9],[-6.9,158.4],[-8.0,144.3],[-7.7,135.1],[-8.6,118.1],[-8.9,99.6],[-8.6,65.8],[-10.4,-2.5],[-12.5,-140.0],[-13.1,-155.3]],"1244978189":[[-53.3,-219.0],[-39.2,-213.1],[-32.4,-208.7],[-28.0,-205.7],[-21.0,-198.9],[-15.7,-192.7],[-8.0,-184.8],[-8.6,-212.2],[-12.7,-254.3],[-8.6,-254.3],[-5.3,-254.3],[-1.5,-216.8],[2.4,-170.1],[6.6,-124.6],[9.8,107.2],[9.4,124.6],[12.6,137.0],[23.9,163.2],[30.5,172.3],[36.1,179.2],[41.3,184.7],[45.9,189.3],[55.9,197.2],[79.9,214.5],[95.8,225.9],[94.6,227.3],[89.3,234.4],[72.7,222.9],[46.3,204.5],[31.9,193.4],[25.2,186.7],[19.1,180.6],[14.0,172.0],[9.1,162.3],[4.0,152.4],[-12.5,188.7],[-22.1,206.9],[-26.7,215.7],[-33.1,225.4],[-46.4,242.1],[-55.5,233.2],[-47.5,223.1],[-44.2,218.6],[-37.9,209.3],[-32.1,198.3],[-28.0,189.9],[-24.3,180.5],[-20.9,172.6],[-15.3,159.9],[-12.2,152.3],[-10.0,141.0],[-8.6,118.1],[-8.9,99.6],[-12.5,-140.0],[-18.6,-176.9],[-23.0,-184.4],[-28.8,-191.1],[-33.0,-196.3],[-40.0,-202.6],[-46.3,-206.2],[-56.1,-210.5],[-55.6,-211.8],[-53.9,-217.1]]}
const PIERS: { id: string; pts: [number, number][] }[] = [{"id":"663074010","pts":[[11.4,112.7],[10.9,116.6],[8.8,117.6],[-15.8,117.4],[-15.7,112.6],[7.5,110.9]]},{"id":"663074011","pts":[[10.9,-116.5],[10.4,-111.9],[7.5,-110.4],[-15.1,-112.2],[-14.7,-118.7],[8.2,-118.0]]},{"id":"663074012","pts":[[10.3,-155.8],[10.9,-154.7],[9.8,-154.0],[-19.8,-163.9],[-19.4,-165.6]]}]
const WAYS: Way[] = [{"id":"11950069","layer":2,"hw":"motorway","lanes":4,"pts":[[-1.8,112.9,17.38],[-1.8,100.9,17.6],[-1.8,88.8,18.3],[-1.9,76.8,18.76],[-1.9,64.7,19.21],[-1.9,52.6,19.48],[-1.9,40.6,20.02],[-2.0,28.5,20.43],[-2.0,16.5,20.83],[-2.0,4.4,21.19],[-2.1,-7.6,21.42],[-2.1,-19.7,21.86],[-2.1,-31.8,22.2],[-2.2,-43.8,22.52],[-2.2,-55.9,22.85],[-2.2,-67.9,23.05],[-2.3,-80.0,23.4],[-2.3,-92.0,23.55],[-2.3,-104.1,23.8]]},{"id":"24957029","layer":3,"hw":"motorway","lanes":3,"pts":[[6.6,-253.3,31.95],[6.6,-239.7,31.91],[6.6,-226.1,31.85],[5.8,-213.9,31.78],[4.9,-201.7,31.65],[4.1,-189.5,31.49],[3.3,-177.2,31.35],[2.5,-165.1,31.17],[1.6,-152.8,30.96],[0.9,-140.2,30.69],[0.4,-126.5,30.4],[-0.1,-112.4,30.13],[-0.2,-107.7,30.0]]},{"id":"24957033","layer":3,"hw":"motorway_link","lanes":1,"pts":[[-2.4,160.4,21.41],[-0.6,173.2,20.95],[1.2,185.9,20.38],[3.0,198.7,19.71],[3.5,202.9,19.51]]},{"id":"54210154","layer":2,"hw":"motorway_link","lanes":2,"pts":[[-2.3,-104.1,23.8],[-4.8,-117.0,24.1],[-7.2,-128.9,24.37],[-9.7,-140.9,24.13],[-12.1,-152.9,24.27],[-14.2,-165.2,23.73],[-15.6,-172.1,23.57]]},{"id":"54210156","layer":2,"hw":"motorway_link","lanes":1,"pts":[[-4.5,256.2,10.87],[-4.3,242.8,11.19],[-4.2,229.5,11.83],[-4.1,225.0,12.15]]},{"id":"54210157","layer":2,"hw":"motorway","lanes":2,"pts":[[91.1,232.0,10.02],[79.7,223.7,10.58],[68.5,215.5,11.02],[57.4,207.4,11.58],[47.6,199.8,12.03],[37.8,192.1,12.65],[28.2,183.0,13.21],[19.6,172.4,13.76],[13.4,160.9,15.15],[8.9,151.6,15.51],[4.5,140.8,16.22],[1.0,129.4,16.43],[-1.2,117.4,17.21],[-1.8,112.9,17.38]]},{"id":"54210161","layer":3,"hw":"motorway_link","lanes":1,"pts":[[-21.5,-213.0,28.35],[-16.0,-199.9,29.0],[-14.7,-194.5,29.21]]},{"id":"54210162","layer":3,"hw":"motorway","lanes":3,"pts":[[0.1,106.8,23.58],[-0.5,119.2,23.07],[-1.1,131.5,22.63],[-1.6,143.9,22.08],[-2.2,156.3,21.59],[-2.4,160.4,21.41]]},{"id":"54210163","layer":2,"hw":"motorway","lanes":2,"pts":[[-54.6,240.9,11.09],[-46.2,231.2,11.36],[-39.4,221.5,11.71],[-33.1,212.5,12.22],[-27.6,202.5,12.6],[-22.4,192.4,13.05],[-17.2,182.3,13.55],[-13.5,173.1,13.96],[-10.0,161.4,14.6],[-4.6,149.3,15.88]]},{"id":"121593794","layer":3,"hw":"motorway","lanes":4,"pts":[[-0.2,-107.7,30.0],[-0.2,-95.5,29.75],[-0.2,-83.4,29.52],[-0.2,-71.3,29.25],[-0.1,-59.1,28.95],[-0.1,-47.0,29.13],[-0.1,-34.8,28.3],[-0.1,-22.7,27.94],[-0.1,-10.6,27.62],[-0.0,1.6,27.25],[-0.0,13.7,26.92],[0.0,25.9,26.49],[0.0,38.0,26.09],[0.0,50.1,25.68],[0.1,62.3,25.26],[0.1,74.4,24.9],[0.1,86.6,24.34],[0.1,98.7,23.95],[0.1,106.8,23.58]]},{"id":"121593795","layer":2,"hw":"motorway","lanes":2,"pts":[[-2.3,-104.1,23.8],[-2.7,-114.1,24.1],[-3.0,-126.6,24.28],[-3.3,-139.1,24.58],[-4.0,-151.5,24.84],[-4.9,-163.9,25.03],[-5.4,-176.1,25.42],[-5.8,-188.3,25.5],[-6.3,-200.4,25.6],[-6.8,-212.6,25.8],[-7.2,-224.8,25.96],[-7.7,-236.9,25.93],[-8.3,-249.6,26.19]]},{"id":"121593802","layer":3,"hw":"motorway","lanes":2,"pts":[[-2.4,160.4,21.41],[-3.0,172.8,20.91],[-3.5,185.2,20.31],[-4.1,197.7,19.63],[-4.7,210.1,18.88],[-5.4,219.8,18.35],[-7.0,230.5,17.72],[-9.4,240.3,17.06],[-12.5,249.3,16.57],[-19.0,261.7,15.72],[-25.4,270.3,15.1],[-34.4,280.4,14.32],[-44.2,289.9,13.47]]},{"id":"264591784","layer":2,"hw":"motorway_link","lanes":1,"pts":[[-4.1,225.0,12.15],[-4.0,212.4,12.95],[-3.8,199.9,13.75],[-3.7,187.3,14.39],[-3.7,174.7,15.03],[-4.2,162.0,15.03],[-4.6,149.3,15.88]]},{"id":"264591820","layer":3,"hw":"motorway_link","lanes":2,"pts":[[3.5,202.9,19.51],[4.8,214.0,18.85],[5.9,226.8,18.04],[7.0,239.6,17.25],[8.1,252.3,16.55],[9.2,265.1,15.74]]},{"id":"264591932","layer":3,"hw":"motorway_link","lanes":2,"pts":[[-14.7,-194.5,29.21],[-12.4,-181.3,29.73],[-10.7,-168.2,30.02],[-8.7,-155.6,30.28],[-6.4,-143.1,30.37],[-4.2,-130.7,30.34],[-1.9,-118.3,30.2],[-0.2,-107.7,30.0]]},{"id":"264591970","layer":2,"hw":"motorway_link","lanes":1,"pts":[[-15.6,-172.1,23.57],[-18.2,-182.9,22.58],[-25.6,-196.7,22.34],[-35.0,-205.7,22.09],[-46.5,-213.7,21.99],[-53.9,-217.1,21.87]]},{"id":"323231442","layer":3,"hw":"motorway","lanes":2,"pts":[[0.1,106.8,23.58],[2.3,119.6,23.04],[5.0,132.2,22.53],[8.9,142.6,22.13],[16.4,153.6,21.35],[27.8,163.9,20.34],[40.4,173.0,19.43],[51.1,179.2,18.75],[61.9,185.4,18.15],[72.6,191.6,17.5],[76.2,193.7,17.33]]},{"id":"550018192","layer":3,"hw":"motorway","lanes":2,"pts":[[76.2,193.7,17.33],[87.2,200.0,16.54],[98.3,206.2,15.87],[109.3,212.4,15.16],[116.7,216.6,14.76]]},{"id":"550018203","layer":2,"hw":"motorway_link","lanes":1,"pts":[[-53.9,-217.1,21.87],[-57.8,-218.4,21.77]]},{"id":"625362030","layer":2,"hw":"motorway","lanes":2,"pts":[[-4.6,149.3,15.88],[-3.6,137.2,16.43],[-2.7,125.0,16.69],[-1.8,112.9,17.21]]}]

const FP_UPPER = piecewise([
  [-130, 30.4], [-108, 30.0], [-96, 29.8], [-83, 29.5], [-71, 29.2], [-59, 28.9], [-47, 28.6], [-35, 28.3], [-23, 27.9], [-11, 27.6],
  [2, 27.2], [14, 26.9], [26, 26.5], [38, 26.1], [50, 25.7], [62, 25.3], [74, 24.9], [87, 24.3], [99, 23.9], [107, 23.6], [120, 23.1],
])

/**
 * The lower-level walkway (way/173225719, cycleway, bridge=yes, layer 2): OSM's line in
 * this frame, and its lidar height along y. Over the span the walkway is the 2 m strip
 * cantilevered outside the upstream truss (lidar x -12.5 to -11), 1.5 m outside OSM's line,
 * which runs under the rib; there it is drawn on the lidar's line.
 */
const WALK_OSM: [number, number][] = [[-210.5, -264], [-153.3, -246], [-113.9, -232.8], [-104.8, -229.6], [-88.5, -223.8], [-55.6, -211.8],
  [-48.7, -209], [-43.1, -205.9], [-38.3, -202.2], [-33.6, -197.9], [-29.1, -192.8], [-25.5, -188.1], [-22.6, -184.6], [-20.3, -181],
  [-17.6, -175.6], [-16.4, -169.1], [-15, -161], [-11.2, -138.9], [-10.7, -127.6], [-10.1, -107.5], [-8.1, 104.8], [-7.9, 124.4],
  [-8.5, 137.3], [-10.2, 147.9], [-16.1, 164.3], [-18.6, 171.7], [-22, 178.3], [-26.3, 189.5], [-33.2, 202], [-38.1, 211.1],
  [-49.7, 227.1], [-54.1, 232.4], [-58.7, 237.5]]
const WALK_Z = piecewise([
  [-264, 18.71], [-246, 19.79], [-232.8, 20.55], [-223.8, 21.05], [-211.8, 21.6], [-209, 21.7], [-161, 23.4], [-144, 24.2], [-128, 24.4],
  [-112, 24.2], [-96, 23.5], [-64, 23.15], [-32, 22.4], [0, 21.4], [32, 20.4], [64, 19.3], [88, 18.6], [104, 17.9], [112, 17.1],
  [128, 16.7], [148, 14.96], [164, 14.33], [189, 13.05], [211, 12.8], [227, 11.4], [237.5, 11.06],
])
const WALK_X = -11.9
/** OSM's walkway line, x along y (the walkway runs steadily along the bridge). */
const WALK_OSM_X = piecewise(WALK_OSM.map(([x, y]) => [y, x] as [number, number]))
const WALK_PTS: [number, number, number][] = (() => {
  // Densify, pull onto the lidar's line between y = -130 and 140, then read the height.
  const out: [number, number, number][] = []
  for (let i = 0; i < WALK_OSM.length - 1; i++) {
    const [x1, y1] = WALK_OSM[i], [x2, y2] = WALK_OSM[i + 1], n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 10))
    for (let k = 0; k < n; k++) out.push([x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n, 0])
  }
  out.push([...WALK_OSM[WALK_OSM.length - 1], 0])
  for (const p of out) {
    const w = Math.max(0, Math.min(1, Math.min(p[1] + 140, 150 - p[1]) / 12))
    p[0] = p[0] + (WALK_X - p[0]) * w
    p[2] = WALK_Z(p[1])
  }
  return out
})()

export const FORT_PITT: ArchBridge = {
  id: 'pit-fort-pitt-bridge',
  name: 'Fort Pitt Bridge',
  bearing: 55.055,
  waterNAVD88: 216.33,
  ground: GROUND,
  outlines: OUTLINES,
  piers: PIERS,
  ways: WAYS,
  // Drawn where OSM's own line lies inside the outlines (the map draws it beyond them).
  walks: [{ pts: WALK_PTS, width: 2.0, on: (_x, y) => { const x = WALK_OSM_X(y); return Object.values(OUTLINES).some((o) => inside(o, x, y) || inside(o, x + 2, y) || inside(o, x - 2, y)) || (y > -117 && y < 117) } }],
  span: [-114.6, 114.6],
  xr: 9.7,
  ribW: 2.2,
  extrados: [
    [-114.6, 31.2], [-108, 34.4], [-102, 38.15], [-96, 41.15], [-90, 44.2], [-84, 47.2], [-78, 49.5], [-72, 52.05], [-66, 54.15], [-60, 56.15],
    [-54, 58.1], [-48, 59.4], [-42, 60.8], [-36, 61.9], [-30, 62.7], [-24, 63.65], [-18, 64.0], [-12, 64.3], [-6, 64.55], [0, 64.35], [6, 64.2],
    [12, 63.75], [18, 63.0], [24, 62.3], [30, 61.05], [36, 59.85], [42, 58.45], [48, 56.65], [54, 54.95], [60, 52.8], [66, 50.5], [72, 48.0],
    [78, 45.15], [84, 42.3], [90, 39.1], [96, 35.65], [102, 32.05], [108, 28.15], [114.6, 24.4],
  ],
  rib: { kind: 'crescent', crownDepth: 3.6, foot: 14.3, solid: 42, bow: 1 },
  ribChords: [2.0, 1.7],
  twinPiers: { ids: ['663074010', '663074011'], wall: 6, shaft: 6 },
  pairedHangers: true,
  panels: 16,
  upper: FP_UPPER,
  lower: (y) => FP_UPPER(y) - 6.2,
  deckEdge: 11.3,
  clearance: 6.5,
  bracing: 'diamond',
  bentStep: 32,
  floodlight: (p, n, part) => {
    const upF = n[2] > 0.7 ? 0.4 : 1
    if (part === 'arch') return upF
    if (part === 'deck') return 0.5 * upF
    return 0
  },
  colors: { gold: 0xd8c062, shade: 0xb09b4f, concrete: 0xb8b3a8 },
  extras: { lowerDeckBelowUpper: 6.2 },
}

if (import.meta.main) await buildArchBridge(FORT_PITT)
