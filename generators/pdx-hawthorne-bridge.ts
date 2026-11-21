/**
 * Hawthorne Bridge (1910; Waddell & Harrington), over the Willamette River
 * in Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-hawthorne-bridge.ts
 *
 * The oldest working vertical-lift bridge in the US: five fixed Parker
 * through trusses and a 244 ft lift span between two lattice towers, the
 * lift span's top chord carrying the operator's house; the towers hold the
 * red counterweights high up (the span is down) under four big sheaves. The
 * trusses stand between the two centre lanes and the cantilevered outer lanes,
 * the sidewalks outside those. Painted a dark sage green, the counterweights
 * and the sidewalk railings red. Drawn closed.
 *
 * This file also holds the movable-bridge kit the other Portland river
 * bridges import (pdx-steel-bridge, pdx-broadway-bridge, pdx-burnside-bridge,
 * pdx-morrison-bridge): beams, through and deck trusses, piers on the map's
 * terrain, sidewalks and railings, lift towers. Merge this generator first.
 *
 * Frame: x across, y along the outline's long axis (bearing 110.31, toward
 * the east bank), z up, metres. Origin at the centroid of the man_made=bridge
 * outline way/722118662; z = 0 the river in the map's terrain (Mapterhorn,
 * 2.31 m NAVD88). elevation 0.
 *
 * OSM: way/722118662 the outline (replaced), 425 m from the west seawall
 * (y = -211.6) to the east end (y = +213.8); the centre carriageway's ways
 * split at y = -134.7 and -59.4, the lift span's ends; the two centre lanes
 * (x = 0) run between the trusses, the outer lanes (x = +-6) and the
 * sidewalk paths (x = +-9.3) outside them. No building is mapped on the
 * bridge.
 *
 * Lidar, USGS 3DEP OR_OLCMetro_2019 (2019), 1 m grids over the lift span
 * and the first east fixed span (water at 3.4 m NAVD88 that day, so +1.1 m to
 * this frame): truss planes at x = +-4.3 (the top bracing between them reads
 * x = -4..+4); the lift-span roadway 16.4 m over the map's water; the lift
 * span's top chord 24.3 m at its ends, 28.4 m at mid-span, the operator's
 * house to 31.9 m over y = -101..-89; the towers' tops 67.3 m, their inner
 * legs at the lift span's ends (y = -134.7, -59.4), their outer legs sloping
 * out to 50 m at z 36 and further toward the piers; the east fixed span's
 * top chord 22.5 m at its end posts and 26.8 m at mid-span, its roadway
 * falling from 16.4 m to 15.4 m at y = +13.
 * Roadway (tools/bridge_ele.py measure 689031436 681301894 282174242
 * 681301899 689031435 --every 20, the centre carriageway, minus 2.31 m):
 * 14.0 m at the west end (y = -211), climbing 3.2% to 16.4 m on the lift
 * span, falling to 15.65 m at y = -19, 14.4 at +56, 13.75 at +96, 12.8 at
 * +156, 12.05 at +196 and 11.75 at the east end. Readings on the trusses'
 * own spans with a spread over 0.3 m were dropped (overhead bracing).
 *
 * Published (Wikipedia "Hawthorne Bridge"; Wood Wortman, The Portland Bridge
 * Book): Parker trusses with a vertical-lift span of 244 ft (74 m); six spans,
 * 1,382 ft (421 m); 73 ft (22 m) wide; 49 ft clear when closed, 159 ft open.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Aerial view of Hawthorne Bridge from southwest in 2016 - Portland,
 *   Ore.jpg" (Pdx.rollingthunder, CC BY-SA 4.0): the six spans, the curved
 *   Parker tops, the towers' tapering side frames and red counterweights;
 * - "Barge passes under Hawthorne Bridge.jpg" (Tammy, CC BY 2.0): the west
 *   tower from the river, the house on the lift span, the pier shafts and
 *   caps, the lift span's polygonal top chord;
 * - "Hawthorne Bridge (2015) - 1.jpg" (Another Believer, CC BY-SA 3.0): the
 *   curved portal, the posts and diagonals, the sidewalk and its red railing,
 *   the outer lane outside the truss;
 * - "Aerial views of Portland bridges (54042794214).jpg" and "Bridges in
 *   Portland (54042794304).jpg" (Oregon Department of Transportation,
 *   CC BY 2.0): from above, with the other river bridges.
 *
 * Estimated: the fixed spans' pier positions (y = -147, -47, 8.9, 77.2,
 * 145.5; the first east span from lidar), panel counts (8 a span), member
 * sizes, the towers' bracing and counterweight sizes, the sheaves (2.6 m
 * radius), the piers' plans (5 x 21 m shafts with cutwaters and 1.2 m caps; the
 * tower piers 7 m shafts under 12 m caps, from the barge photo), the
 * sidewalk width (x = 8 to 11).
 * Colour: the steel and railings #6b8a73 in sun, pulled to #7a967f; the
 * counterweights red #b23a2e pulled to #b5503d; concrete #c9c3b8.
 *
 * Doubts: the west fixed span and the east spans beyond y = +13 have no
 * lidar crop; their truss depths copy the measured east span. Night: the
 * bridge carries street lamps only, so nothing is floodlit.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { chamferedRect, face, footedLoft, groundAt, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

// ---------------------------------------------------------------- the kit

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A rectangular member from a to b, w wide (horizontal) and d deep; ends capped only when asked. */
export function beam(p: Part, a: V3, b: V3, w: number, d: number, caps = false) {
  const t = norm(sub(b, a))
  let S = cross(t, [0, 0, 1]); if (Math.hypot(...S) < 1e-3) S = [1, 0, 0]
  S = norm(S); const U = norm(cross(S, t)), s = mul(S, w / 2), u = mul(U, d / 2)
  const q = (o: V3): V3[] => [sub(sub(o, s), u), add(sub(o, s), u), add(add(o, s), u), sub(add(o, s), u)]
  const A = q(a), B = q(b), ns: V3[] = [mul(S, -1), U, S, mul(U, -1)]
  for (let i = 0; i < 4; i++) face(p, A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i], ns[i])
  if (caps) { face(p, A[0], A[1], A[2], A[3], mul(t, -1)); face(p, B[0], B[1], B[2], B[3], t) }
}

/** An axis-aligned box; the bottom face only when asked. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** A pyramid or hipped roof over x0..x1, y0..y1 from z0 rising `h`, its ridge `ridge` long along y (0 for a pyramid). */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number, ridge = 0) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const r0: V3 = [cx, cy - ridge / 2, z0 + h], r1: V3 = [cx, cy + ridge / 2, z0 + h]
  const c: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const tri = (a: V3, b: V3, d: V3) => {
    const n = cross(sub(b, a), sub(d, a))
    p.tri(a, b, d, undefined, undefined, undefined, [norm(n), norm(n), norm(n)])
  }
  tri(c[0], c[1], r0); tri(c[2], c[3], r1)
  if (ridge > 0) { face(p, c[1], c[2], r1, r0, norm([1, 0, (x1 - x0) / 2 / h])); face(p, c[3], c[0], r0, r1, norm([-1, 0, (x1 - x0) / 2 / h])) }
  else { tri(c[1], c[2], r0); tri(c[3], c[0], r0) }
}

/** A drum with its axis along x, from x0 to x1, centred at (y, z), smooth-shaded, capped. */
export function drumX(p: Part, x0: number, x1: number, y: number, z: number, r: number, n = 12) {
  for (let k = 0; k < n; k++) {
    const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
    const P = (x: number, a: number): V3 => [x, y + r * Math.cos(a), z + r * Math.sin(a)]
    const n0: V3 = [0, Math.cos(a0), Math.sin(a0)], n1: V3 = [0, Math.cos(a1), Math.sin(a1)]
    p.tri(P(x0, a0), P(x0, a1), P(x1, a1), undefined, undefined, undefined, [n0, n1, n1])
    p.tri(P(x0, a0), P(x1, a1), P(x1, a0), undefined, undefined, undefined, [n0, n1, n0])
    p.tri([x0, y, z], P(x0, a1), P(x0, a0), undefined, undefined, undefined, [[-1, 0, 0], [-1, 0, 0], [-1, 0, 0]])
    p.tri([x1, y, z], P(x1, a0), P(x1, a1), undefined, undefined, undefined, [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
  }
}

/** A ground function from a terrain table (heights above the water), never below the water. */
export const groundOf = (g: GroundGrid) => (x: number, y: number) => Math.max(0, groundAt(g, x, y))

/**
 * One truss plane at x. `bot(y)` and `top(y)` are the chords' centre lines;
 * the panel points are `panels` equal panels from y0 to y1. `ends`:
 * 'inclined' runs end posts from the bottom chord at the ends up to the top
 * chord at the first panel point (a Parker or Pratt through truss);
 * 'vertical' stands posts at the ends (a deck truss or a lift span).
 * `web`: 'pratt' (diagonals falling toward mid-span), 'warren' (alternating),
 * 'x' (both). Posts and diagonals are flat strips, for a double-sided material.
 */
export type TrussSpec = {
  x: number; y0: number; y1: number; panels: number
  bot: (y: number) => number; top: (y: number) => number
  ends?: 'inclined' | 'vertical'; web?: 'pratt' | 'warren' | 'x'
  chordW?: number; chordD?: number; post?: number; diag?: number; endW?: number
}
export function trussPoints(t: TrussSpec) { return stations(t.y0, t.y1, (t.y1 - t.y0) / t.panels) }
export function trussSide(p: Part, t: TrussSpec) {
  const { x, bot, top } = t, ends = t.ends ?? 'inclined', web = t.web ?? 'pratt'
  const cw = t.chordW ?? 0.6, cd = t.chordD ?? 0.8, pw = t.post ?? 0.4, dw = t.diag ?? 0.35, ew = t.endW ?? 0.9
  const ys = trussPoints(t), n = ys.length - 1, n2: V3 = [1, 0, 0]
  for (let i = 0; i < n; i++) beam(p, [x, ys[i], bot(ys[i])], [x, ys[i + 1], bot(ys[i + 1])], cw, cd)
  const t0 = ends === 'inclined' ? 1 : 0, t1 = ends === 'inclined' ? n - 1 : n
  for (let i = t0; i < t1; i++) beam(p, [x, ys[i], top(ys[i])], [x, ys[i + 1], top(ys[i + 1])], cw, cd)
  if (ends === 'inclined') {
    beam(p, [x, ys[0], bot(ys[0])], [x, ys[1], top(ys[1])], ew * 0.8, ew)
    beam(p, [x, ys[n], bot(ys[n])], [x, ys[n - 1], top(ys[n - 1])], ew * 0.8, ew)
  } else {
    beam(p, [x, ys[0], bot(ys[0])], [x, ys[0], top(ys[0])], ew * 0.8, ew)
    beam(p, [x, ys[n], bot(ys[n])], [x, ys[n], top(ys[n])], ew * 0.8, ew)
  }
  const z0 = (y: number) => bot(y) + cd / 2, z1 = (y: number) => top(y) - cd / 2
  for (let i = 1; i < n; i++) strip(p, [x, ys[i], z0(ys[i])], [x, ys[i], z1(ys[i])], pw, n2)
  const mid = (t.y0 + t.y1) / 2
  for (let i = 0; i < n; i++) {
    if (ends === 'inclined' && (i === 0 || i === n - 1)) continue
    const a = ys[i], b = ys[i + 1]
    const fall = (a + b) / 2 < mid // left half: the diagonal falls from a's top to b's foot
    if (web === 'x' || web === 'pratt') {
      if (fall || web === 'x') strip(p, [x, a, z1(a)], [x, b, z0(b)], dw, n2)
      if (!fall || web === 'x') strip(p, [x, b, z1(b)], [x, a, z0(a)], dw, n2)
    } else {
      if (i % 2 === 0) strip(p, [x, a, z0(a)], [x, b, z1(b)], dw, n2)
      else strip(p, [x, a, z1(a)], [x, b, z0(b)], dw, n2)
    }
  }
}
/** Both truss planes at +-x, with overhead struts at the top panel points and portals. */
export function throughTruss(p: Part, t: TrussSpec, struts = true) {
  trussSide(p, { ...t, x: -t.x }); trussSide(p, { ...t, x: t.x })
  if (!struts) return
  const ys = trussPoints(t), n = ys.length - 1, inc = (t.ends ?? 'inclined') === 'inclined'
  for (let i = inc ? 1 : 0; i <= (inc ? n - 1 : n); i++) {
    const z = t.top(ys[i]) - 0.2
    beam(p, [-t.x, ys[i], z], [t.x, ys[i], z], 0.35, 0.5)
  }
  if (inc) for (const i of [1, n - 1]) {
    const z = t.top(ys[i]) - 1.6, y = ys[i] + (i === 1 ? -0.9 : 0.9)
    beam(p, [-t.x, y, z], [t.x, y, z], 0.5, 1.6)
  }
}

/**
 * The deck's underside and fascias from x0 to x1 (|x0| < |x1|, mirrored) along ys:
 * a plate `depth` under the roadway and the outer fascia from the roadway to it.
 */
export function deckBand(p: Part, ys: number[], road: (y: number) => number, x1: number, depth: number, fascia = true, lip = 0) {
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1], za = road(a) - depth, zb = road(b) - depth
    face(p, [-x1, a, za], [x1, a, za], [x1, b, zb], [-x1, b, zb], [0, 0, -1])
    if (fascia) for (const s of [-1, 1])
      face(p, [s * x1, a, za], [s * x1, b, zb], [s * x1, b, road(b) + lip], [s * x1, a, road(a) + lip], [s, 0, 0])
  }
}

/** Sidewalk slabs between |x| = xa and xb (their walking surface `up` over the road) and a railing h tall at xb. */
export function sidewalks(slab: Part, rail: Part | null, ys: number[], road: (y: number) => number, xa: number, xb: number, up = 0.2, h = 1.1) {
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    for (const s of [-1, 1]) {
      face(slab, [s * xa, a, road(a) + up], [s * xb, a, road(a) + up], [s * xb, b, road(b) + up], [s * xa, b, road(b) + up], [0, 0, 1])
      face(slab, [s * xa, a, road(a) - 0.3], [s * xa, b, road(b) - 0.3], [s * xa, b, road(b) + up], [s * xa, a, road(a) + up], [-s, 0, 0])
      if (rail) strip(rail, [s * xb, a, road(a) + up + h / 2], [s * xb, b, road(b) + up + h / 2], h, [s, 0, 0])
    }
  }
}

/**
 * A river pier: a shaft from the ground (or the river bed at the water) to
 * `top`, centred on x = xc, long across the bridge (x) with pointed cutwaters, and a cap
 * `cap` metres deep standing `over` metres proud of the shaft.
 */
export function pier(p: Part, gnd: (x: number, y: number) => number, yc: number, hy: number, hx: number, top: number, cap = 1.2, over = 0.6, xc = 0) {
  const plan = (o: number) => chamferedRect(xc - hx - o, xc + hx + o, yc - hy - o, yc + hy + o, (hy + o) * 0.85)
  footedLoft(p, gnd, [
    { plan: plan(0), z: 'ground' },
    { plan: plan(0), z: top - cap },
    { plan: plan(over), z: top - cap },
    { plan: plan(over), z: top },
  ], 3)
}

/** A rectangular block on the ground up to `top`: an abutment, a pier shaft on land. */
export function block(p: Part, gnd: (x: number, y: number) => number, x0: number, x1: number, y0: number, y1: number, top: number, r = 0) {
  footedLoft(p, gnd, [
    { plan: chamferedRect(x0, x1, y0, y1, r), z: 'ground' },
    { plan: chamferedRect(x0, x1, y0, y1, r), z: top },
  ], 3)
}

/** Write a model's GLB and print its size. */
export async function save(id: string, title: string, parts: { part: Part; material: MaterialSpec }[], extras: Record<string, unknown>) {
  const live = parts.filter(({ part }) => part.triangles > 0)
  const tris = live.reduce((n, { part }) => n + part.triangles, 0)
  const glb = writeGlb(title, live, { license: 'CC0-1.0', ...extras })
  await Bun.write(new URL(`../models/${id}.glb`, import.meta.url), glb)
  console.log(`${id}.glb: ${tris} triangles, ${glb.length} bytes`)
}

/** Shared Portland bridge colours. */
export const CONCRETE: MaterialSpec = finish('pier-concrete', 0xc9c3b8)
export const WINDOW: MaterialSpec = { name: 'window', color: 0x64798a, roughness: 0.35 }

// ---------------------------------------------------------------- Hawthorne

if (import.meta.main) {
  // Map terrain (Mapterhorn) minus 2.31 m, 10 m apart in this frame (x -20..20, y -230..230).
  const GROUND: GroundGrid = {"y0":-230,"x0":-20,"step":10,"z":[[8.3,8.3,8.2,8.1,8.2],[8,8,8,8,8.1],[7.8,7.8,7.9,7.8,7.9],[6.3,7.7,8,7.9,8],[0,0,0,0.1,4.4],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[3.6,0.9,0,0,0],[7.9,4.8,1,0,0],[7.7,6.2,3.4,0.6,0],[7.5,6.6,3.8,1.2,0]]}
  const gnd = groundOf(GROUND)

  const YW = -211.6, YE = 213.8          // the outline's ends
  const LW = -134.7, LE = -59.4          // the lift span's ends (centre-lane way splits)
  const LC = (LW + LE) / 2
  // Pier lines: the west seawall, the tower piers' outer faces, the fixed spans' piers, the east end.
  const PIERS = [YW, LW - 12.3, LE + 12.3, 8.9, 77.2, 145.5, YE]
  const XT = 4.3                          // truss planes
  // Roadway over the map's water (lidar; see header).
  const ROAD = piecewise([[YW, 14.0], [LW, 16.4], [LE, 16.4], [-19, 15.65], [56, 14.4], [96, 13.75], [156, 12.8], [196, 12.05], [YE, 11.75]])
  const BOT = (y: number) => ROAD(y) - 0.6

  const steel = new Part(), red = new Part(), conc = new Part(), house = new Part(), glass = new Part()

  // Fixed Parker spans: end posts 7 m over the deck, 11 m at mid-span, the top chord a flattened arc.
  const parker = (y0: number, y1: number, rise: number) => (y: number) => {
    const t = (y - y0) / (y1 - y0)
    return ROAD(y) + 6.2 + (rise - 6.2) * Math.pow(Math.sin(Math.PI * t), 0.55)
  }
  const spans: [number, number][] = [[PIERS[0], PIERS[1]], [PIERS[2], PIERS[3]], [PIERS[3], PIERS[4]], [PIERS[4], PIERS[5]], [PIERS[5], PIERS[6]]]
  for (const [a, b] of spans) {
    const L = b - a, rise = L > 60 ? 11 : 10.4
    throughTruss(steel, { x: XT, y0: a + 0.8, y1: b - 0.8, panels: L > 60 ? 8 : 7, bot: BOT, top: parker(a, b, rise) })
  }
  // The lift span: vertical end posts 8 m tall, a polygonal top chord to 12 m at mid-span.
  const LIFT_TOP = (y: number) => ROAD(y) + 7.9 + 4.1 * Math.pow(Math.max(0, 1 - Math.abs((y - LC) / ((LE - LW) / 2))), 0.6) ** 1
  throughTruss(steel, { x: XT, y0: LW + 0.4, y1: LE - 0.4, panels: 8, bot: BOT, top: LIFT_TOP, ends: 'vertical' })

  // The operator's house on the lift span's top chord, its roof to 31.9 m.
  {
    const z0 = LIFT_TOP(LC) + 0.3, y0 = LC - 5.5, y1 = LC + 5.5
    box(house, -3.6, 3.6, y0, y1, z0, z0 + 2.4, true)
    hipRoof(house, -4.0, 4.0, y0 - 0.4, y1 + 0.4, z0 + 2.4, 1.0, 6)
    for (const s of [-1, 1]) face(glass, [s * 3.63, y0 + 1, z0 + 0.9], [s * 3.63, y1 - 1, z0 + 0.9], [s * 3.63, y1 - 1, z0 + 2.0], [s * 3.63, y0 + 1, z0 + 2.0], [s, 0, 0])
  }

  // Lift towers: inner legs plumb at the lift span's ends, outer legs leaning out to the pier,
  // braced in X panels, the red counterweight up top, four sheaves on the crown.
  const TOWER_TOP = 67.3, XL = 4.6
  for (const [yi, s] of [[LW, -1], [LE, 1]] as [number, number][]) {
    const zb = ROAD(yi) - 3.0, yo = yi + s * 12.0, yt = yi + s * 4.8
    const inner = (z: number) => yi, outer = (z: number) => yo + (yt - yo) * (z - zb) / (TOWER_TOP - zb)
    for (const x of [-XL, XL]) {
      beam(steel, [x, inner(zb), zb], [x, inner(TOWER_TOP), TOWER_TOP], 1.0, 1.0)
      beam(steel, [x, outer(zb), zb], [x, outer(TOWER_TOP), TOWER_TOP], 1.0, 1.0)
      const levels = [zb, ROAD(yi) + 9, 32, 42, 50, 58, TOWER_TOP - 0.5]
      for (let k = 0; k < levels.length; k++) {
        const z = levels[k]
        if (k > 0) beam(steel, [x, inner(z), z], [x, outer(z), z], 0.5, 0.6)
        if (k > 0 && k < levels.length) {
          const za = levels[k - 1]
          strip(steel, [x, inner(za), za + 0.4], [x, outer(z), z - 0.4], 0.45, [1, 0, 0])
          strip(steel, [x, outer(za), za + 0.4], [x, inner(z), z - 0.4], 0.45, [1, 0, 0])
        }
      }
    }
    // Cross struts between the two side frames.
    for (const z of [ROAD(yi) + 9, 32, 50, TOWER_TOP - 0.5]) {
      beam(steel, [-XL, inner(z), z], [XL, inner(z), z], 0.5, 0.6)
      beam(steel, [-XL, outer(z), z], [XL, outer(z), z], 0.5, 0.6)
    }
    // The counterweight, hanging high in the tower (the span is down).
    const ya = yi + s * 0.9, yb = yi + s * 4.6
    box(red, -XL + 0.6, XL - 0.6, Math.min(ya, yb), Math.max(ya, yb), 51.5, 64.8, true)
    // The crown: a deck of girders and the sheaves over each side frame.
    box(steel, -XL - 0.7, XL + 0.7, Math.min(yi, yt) - 0.3, Math.max(yi, yt) + 0.3, TOWER_TOP - 0.6, TOWER_TOP)
    for (const x of [-XL, XL]) drumX(steel, x - 0.45, x + 0.45, yi + s * 2.4, TOWER_TOP + 1.6, 2.4, 12)
  }

  // Piers: tower piers under the towers, river piers under the fixed spans, the seawall pier and the east bent.
  const PIER_TOP = (y: number) => ROAD(y) - 1.6
  for (const yc of [(LW + PIERS[1]) / 2, (LE + PIERS[2]) / 2]) pier(conc, gnd, yc, 3.6, 10.5, PIER_TOP(yc), 2.0, 2.6)
  for (const yc of [PIERS[3], PIERS[4], PIERS[5]]) pier(conc, gnd, yc, 2.6, 10.5, PIER_TOP(yc))
  block(conc, gnd, -11.6, 11.6, YW, YW + 4, PIER_TOP(YW + 2), 0)
  block(conc, gnd, -11.6, 11.6, YE - 4, YE, PIER_TOP(YE - 2), 0)

  // The deck: floor plate under the whole width, sidewalks and railings outside the outer lanes.
  const ALL = stations(YW, YE, 8.5)
  deckBand(conc, ALL, ROAD, 11.3, 1.4, true, 0.2)
  sidewalks(conc, steel, ALL, ROAD, 8.2, 11.2, 0.2, 1.1)

  const STEEL: MaterialSpec = { ...finish('bridge-green', 0x7a967f), doubleSided: true }
  const RED: MaterialSpec = { ...finish('counterweight-red', 0xb5503d), doubleSided: true }
  const HOUSE: MaterialSpec = finish('operator-house', 0x6f8c75)
  await save('pdx-hawthorne-bridge', 'Hawthorne Bridge', [
    { part: steel, material: STEEL }, { part: red, material: RED }, { part: conc, material: CONCRETE },
    { part: house, material: HOUSE }, { part: glass, material: WINDOW },
  ], {
    frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/722118662, on the river (2.31 m NAVD88)',
    bearing: 110.31, elevation: 0, height: TOWER_TOP + 4.0,
  })
}
