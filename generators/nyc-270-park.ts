/**
 * 270 Park Avenue (JPMorgan Chase world headquarters) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-270-park.ts
 *
 * Map frame: x = model east (Park Avenue side), y = model north (East 48th
 * Street), z up, metres. Placed at bearing 28.9°, the street axis of the OSM
 * outline. Anchor: centroid of the OSM outline way/1240347246.
 *
 * Evidence
 * - OSM way/1240347246 (outline, 109.3 × 44–57 m, serrated long sides) and
 *   its nine building:parts 1470357701–1470357709: strips across the block,
 *   each about 12.2 m wide, symmetric about the middle, with heights 423
 *   (middle), 382, 330, 250 and 130 m towards Park and Madison, and the
 *   half-depths 28.4, 27.45, 25.6, 23.8 and 22.0 m that make the sawtooth on
 *   47th and 48th Streets. Used as mapped.
 * - Published (Wikipedia, "270 Park Avenue (2025–present)"): 1,388 ft
 *   (423 m), Foster + Partners, 2025; 24 massive columns carry the tower over
 *   an 80 ft (24 m) lobby; setbacks to the west and east tapering to the top;
 *   Leo Villareal's "Celestial Passage" lights run up the tower's edges and
 *   cover the faces above the top two setbacks at night.
 * - Photos (Wikimedia Commons):
 *   - "270 Park Avenue Photomontage (cropped)", CrossingLights, CC BY 4.0
 *     (tiers from the north-east, the diamond braces on each tier's end);
 *   - "270 Park Avenue at Night", Hurstbergn, CC BY 4.0 (gold-lit frames);
 *   - "270 Park Avenue 2025", "2025 001", "2025 002", "2025 004", Kidfly182,
 *     CC BY 4.0 (end-face chevrons, bronze piers at the long-face jogs);
 *   - "270 Park Avenue - Entrance on Park Avenue" and "JPMorgan Chase -
 *     270 Park Avenue", ajay_suresh, CC BY 4.0 (the fan column and lobby);
 *   - "JPMorgan Chase Headquarters New York City", Wobbanight, CC0 (tiers
 *     and sloped glass from 47th Street).
 *
 * Features: the five stepped tiers; a bronze diamond on every tier's Park
 * and Madison face, the lowest one closing on the fan column at the plaza;
 * bronze frames round every tier and piers at the long-face jogs; the tower
 * lifted 24 m on fan columns over a recessed glass lobby.
 *
 * Estimated: the long-side fan positions (three a side, evenly spaced; the
 * photos show fans on 47th Street but not how many); the strut counts; the
 * lobby setback (5 m at the ends, 4 m at the sides); the frame and brace
 * widths (drawn bolder than real so they read at phone size). The dark
 * louvre bands at the mechanical floors are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel } from './nyc-570-lexington'

const win = new Part(), frame = new Part(), body = new Part(), roof = new Part(), lobby = new Part()

// Strip k spans |x| from EDGE[k-1] (0 for k = 0) to EDGE[k] (OSM parts).
const EDGE = [6.15, 18.5, 30.5, 42.4, 54.65]
const DEPTH = [28.4, 27.45, 25.6, 23.8, 22.0]
const H = [423, 382, 330, 250, 130]
const LIFT = 24
const BAR = 2.2, PIER = 1.3, PROUD = 0.45

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A flat face with one normal; `tri` winds it to face `n`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

/** A box of eight corners (bottom four, top four, same order); faces point away from its centre. */
function box(p: Part, c: V3[], skip: number[] = []) {
  const ctr = c.reduce((s, v) => add(s, v, 1 / 8), [0, 0, 0] as V3)
  const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
  faces.forEach((f, i) => {
    if (skip.includes(i)) return
    const [a, b, cc, d] = f.map((k) => c[k])
    let n = unit(crossV(add(b, a, -1), add(d, a, -1)))
    const m = add(add(add(a, b), cc), d).map((v, k) => v / 4 - ctr[k]) as V3
    if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) n = [-n[0], -n[1], -n[2]]
    face(p, a, b, cc, d, n)
  })
}

/** A flat bar laid on a wall from P to Q, `w` wide, standing `PROUD` off the wall along `n`. */
function bar(p: Part, P: V3, Q: V3, n: V3, w = BAR, ext = 0) {
  const t = unit(add(Q, P, -1)), s = unit(crossV(n, t))
  const a = add(P, t, -ext), b = add(Q, t, ext)
  const h = w / 2
  const c = [add(a, s, -h), add(b, s, -h), add(b, s, h), add(a, s, h)]
  box(p, [...c, ...c.map((v) => add(v, n, PROUD))], [0])
}

/** A strut between two points, square section `w`. */
function strut(p: Part, A: V3, B: V3, w: number) {
  const t = unit(add(B, A, -1)), s = unit(crossV(t, [0, 0, 1])), u = crossV(s, t), h = w / 2
  const ring = (o: V3) => [add(add(o, s, -h), u, -h), add(add(o, s, h), u, -h), add(add(o, s, h), u, h), add(add(o, s, -h), u, h)]
  box(p, [...ring(A), ...ring(B)])
}

// --- Tower: nine strips, glass walls, roofs ---------------------------------
for (let k = 0; k < 5; k++) {
  const x0 = k ? EDGE[k - 1] : -EDGE[0], x1 = EDGE[k], D = DEPTH[k], top = H[k]
  for (const sx of k ? [1, -1] : [1]) {
    const xa = sx * x0, xb = sx * x1, lo = Math.min(xa, xb), hi = Math.max(xa, xb)
    // Long faces on 47th and 48th Streets.
    for (const sy of [1, -1]) {
      const n: V3 = [0, sy, 0], y = sy * D
      face(win, [lo, y, LIFT], [hi, y, LIFT], [hi, y, top], [lo, y, top], n)
      // Piers at both ends of the strip, and the frame along its top.
      for (const x of [lo + PIER / 2, hi - PIER / 2]) bar(frame, [x, y, LIFT], [x, y, top], n, PIER)
      bar(frame, [lo, y, top - BAR / 2], [hi, y, top - BAR / 2], n, BAR)
    }
    roof.cap([[lo, -D, top], [hi, -D, top], [hi, D, top], [lo, D, top]], true)
    body.cap([[lo, -D, LIFT], [hi, -D, LIFT], [hi, D, LIFT], [lo, D, LIFT]], false)
    if (k === 0) continue

    // The end face this strip's outer neighbour leaves bare, plus the jogs.
    const xe = sx * x1, n: V3 = [sx, 0, 0]
    const zb = k < 4 ? H[k + 1] : LIFT
    face(win, [xe, -D, zb], [xe, D, zb], [xe, D, top], [xe, -D, top], n)
  }
}
// The middle strip's end faces and every strip's jog strips (inner strip k
// wider than its outer neighbour k+1 by a metre or two on each side).
for (let k = 0; k < 4; k++) {
  for (const sx of [1, -1]) {
    const xe = sx * EDGE[k], n: V3 = [sx, 0, 0], D = DEPTH[k], d = DEPTH[k + 1]
    if (k === 0) face(win, [xe, -D, H[1]], [xe, D, H[1]], [xe, D, H[0]], [xe, -D, H[0]], n)
    for (const sy of [1, -1]) face(body, [xe, sy * d, LIFT], [xe, sy * D, LIFT], [xe, sy * D, H[k + 1]], [xe, sy * d, H[k + 1]], n)
  }
}

// --- The diamonds on the Park and Madison faces ------------------------------
for (let k = 0; k < 5; k++) {
  for (const sx of [1, -1]) {
    const x = sx * EDGE[k], n: V3 = [sx, 0, 0], D = DEPTH[k], top = H[k]
    const zb = k < 4 ? H[k + 1] : LIFT, zm = (zb + top) / 2, i = D - BAR / 2
    const T: V3 = [x, 0, top - BAR / 2], B: V3 = [x, 0, zb + BAR / 2], L: V3 = [x, -i, zm], R: V3 = [x, i, zm]
    // Frame round the face.
    bar(frame, [x, -D, top - BAR / 2], [x, D, top - BAR / 2], n)
    bar(frame, [x, -D, zb + BAR / 2], [x, D, zb + BAR / 2], n)
    bar(frame, [x, -i, zb], [x, -i, top], n)
    bar(frame, [x, i, zb], [x, i, top], n)
    // The diamond.
    for (const [a, b] of [[T, R], [R, B], [B, L], [L, T]] as [V3, V3][]) bar(frame, a, b, n, BAR, BAR / 2)
  }
}

// --- Base: lobby and fan columns -------------------------------------------
const LX = EDGE[4] - 5, LY = DEPTH[4] - 4, GLAZE = 9
const lobbyRing: [number, number][] = [[-LX, -LY], [LX, -LY], [LX, LY], [-LX, LY]]
for (let i = 0; i < 4; i++) {
  const [ax, ay] = lobbyRing[i], [bx, by] = lobbyRing[(i + 1) % 4]
  const n = unit([by - ay, ax - bx, 0])
  face(lobby, [ax, ay, 0], [bx, by, 0], [bx, by, GLAZE], [ax, ay, GLAZE], n)
  face(body, [ax, ay, GLAZE], [bx, by, GLAZE], [bx, by, LIFT], [ax, ay, LIFT], n)
}
// A fan: struts from one foot on the plaza up to points along the soffit edge.
// The foot stands on a low plinth, so no strut dips below the plaza.
function fan(foot: V3, heads: V3[], w: number) {
  const f: V3 = [foot[0], foot[1], w * 0.75], r = w * 1.1
  const ring = (z: number): V3[] => [[f[0] - r, f[1] - r, z], [f[0] + r, f[1] - r, z], [f[0] + r, f[1] + r, z], [f[0] - r, f[1] + r, z]]
  box(body, [...ring(0), ...ring(w)], [0])
  for (const h of heads) strut(body, f, h, w)
}
const FS = 2.0
for (const sx of [1, -1]) {
  const xf = sx * (EDGE[4] - 1.5), xh = sx * (EDGE[4] - 1.2)
  fan([xf, 0, 0], [-19, -9.5, 0, 9.5, 19].map((y) => [xh, y, LIFT] as V3), FS)
}
for (const sy of [1, -1]) {
  const yf = sy * (DEPTH[4] - 1.5), yh = sy * (DEPTH[4] - 1.2)
  for (const x0 of [-30, 0, 30]) fan([x0, yf, 0], [-10, 0, 10].map((dx) => [x0 + dx, yh, LIFT] as V3), FS * 0.85)
}

finishModel('270 Park Avenue', 'nyc-270-park', [
  { part: win, material: windowVariant(2, 0x7a8ea0) },
  { part: frame, material: finish('neon-jpm-bronze', 0xd2ad6c) },
  { part: body, material: finish('jpm-bronze', 0x8f7c69) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: PALETTE.entrance },
], { bearing: 28.9, osm: 'way/1240347246', height: 423 })
