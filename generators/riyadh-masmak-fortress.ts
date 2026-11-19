/**
 * Masmak Fortress (Qasr al-Masmak), Riyadh — original procedural geometry, CC0-1.0.
 * bun generators/riyadh-masmak-fortress.ts
 *
 * Frame: north-up map frame (BEARING 0); the fort's four sides are not
 * square to each other, so the OSM corners are used as they are. Origin =
 * centroid of the OSM outline way/1385940120.
 *
 * Evidence
 * - OSM way/1385940120 (historic=castle, museum): an irregular quadrilateral
 *   with a small round bump at each corner for the towers. Tower centres
 *   measured from those bumps (local metres): W (-33.6, 13.3), S (-12.9,
 *   -30.4), E (39.5, -12.9), N (28.4, 31.3). Sides between them: NW 64 m,
 *   NE 45 m, SE 55 m, SW 47 m. OSM draws the towers ~5 m across; the photos
 *   show them about 10 m across at the foot, so they are drawn at the
 *   photographed size on the OSM centres. way/300654157 (building=roof,
 *   a shade 70 m to the north-west) is not part of the fort.
 * - Commons photos, all EVIDENCE:
 *   "Masmak Fortress (6329473680).jpg" (Sammy Six, CC BY 2.0) — the SW gate
 *     front square on: wall, gate, brackets, both towers, the square tower;
 *     https://commons.wikimedia.org/wiki/File:Masmak_Fortress_(6329473680).jpg
 *   "المصمك.jpg" (Heritage Commission, CC BY-SA 4.0) — the same front;
 *     https://commons.wikimedia.org/wiki/File:%D8%A7%D9%84%D9%85%D8%B5%D9%85%D9%83.jpg
 *   "Masmak Fort (12753717253).jpg" (Francisco Anzola, CC BY 2.0) — the
 *     towers' taper, string course and stepped merlons up close;
 *     https://commons.wikimedia.org/wiki/File:Masmak_Fort_(12753717253).jpg
 *   "Masmak castle.jpg" (Baptiste Marcel, public domain) — the long NW wall
 *     and the plaster colour; https://commons.wikimedia.org/wiki/File:Masmak_castle.jpg
 *   "Masmak Castle from Thumairi.jpg" (Dainomite, CC BY-SA 3.0) — the south
 *     tower from Al-Thumairi Street, scaled by people at its foot;
 *     https://commons.wikimedia.org/wiki/File:Masmak_Castle_from_Thumairi.jpg
 *   "Masmak Citadel, Riyadh (14372839641).jpg" (Rick McCharles, CC BY 2.0) —
 *     the inner courtyard, rooms round it under flat roofs;
 *     https://commons.wikimedia.org/wiki/File:Masmak_Citadel,_Riyadh_(14372839641).jpg
 * - Gate side: the plaza with the flag and steps faces Deera Square (OSM
 *   way/1385940115) to the west-south-west, so the photographed gate front
 *   is the 47 m SW side.
 *
 * Estimated (photo proportions on the 47 m SW side, checked against people
 * in two photos): curtain walls 10.5 m high and 1.6 m thick; towers 17.5 m
 * to the merlon tips, 10.2 m across at the foot tapering to 7.4 m at the
 * string course (13.3 m), then a lip and a near-cylindrical top stage;
 * 14 stepped merlons per tower; the gate 2.0 × 3.4 m at 0.36 of the SW wall
 * from the west tower; the three drip brackets over it and the larger box
 * bracket at 0.62; the square watchtower behind the SW wall, 5 m square and
 * 14 m to its merlon tips; the rooms round the courtyard 10 m deep under roofs
 * at 8.9 m. Colour: sunlit plaster sampled at #deab88, #e9b07f, #d5a55e in
 * three photos, pulled to a paler buff (#dcb894) per the palette.
 *
 * Levels of detail: the low model draws the merlons as plain triangles;
 * the detail model (models/riyadh-masmak-fortress.detail.glb, from zoom 16)
 * steps them as in the photos and adds the loophole rows (two on each tower,
 * one along the walls) as small dark squares.
 *
 * Doubts: no licensed aerial; the inner layout (rooms, courtyard, where the
 * square tower stands) is simplified. The string line on the curtain walls is
 * left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { box, earcut, inset, oq, ot, triCount, type P2 } from './riyadh-kingdom-centre'

const ANCHOR = { lng: 46.7133512, lat: 24.631213 }
const BEARING = 0

const flood = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? 0.85 : 0.15)

function build(detail: boolean) {
const mud = new Part(), roof = new Part(), wood = new Part(), dark = new Part()
// Tower centres, counter-clockwise from above: S, E, N, W.
const T: P2[] = [[-12.9, -30.4], [39.5, -12.9], [28.4, 31.3], [-33.6, 13.3]]
const WALL_H = 10.5, WALL_T = 1.6
const ROOM_D = 10, ROOF_H = 8.9

/** A wall face along a→b (outward = right), split into ≤5 m pieces, z0..z1. */
function face(p: Part, a: P2, b: P2, z0: number, z1: number, out: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5))
  for (let k = 0; k < n; k++) {
    const s = k / n, t = (k + 1) / n
    const A: P2 = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s], B: P2 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    oq(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], out)
  }
}
const outN = (a: P2, b: P2): V3 => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l, 0] }

// --- Curtain walls, the rooms behind them and the open courtyard. ---
{
  const I1 = inset(T, WALL_T), I2 = inset(T, WALL_T + ROOM_D)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, o = outN(T[i], T[j])
    if (i === 3) {
      // the SW wall, with the gate opening cut through its outer face
      const L = Math.hypot(T[j][0] - T[i][0], T[j][1] - T[i][1])
      const at = (d: number): P2 => [T[i][0] + ((T[j][0] - T[i][0]) * d) / L, T[i][1] + ((T[j][1] - T[i][1]) * d) / L]
      const g = 0.36 * L
      face(mud, T[i], at(g - 1.0), 0, WALL_H, o)
      face(mud, at(g + 1.0), T[j], 0, WALL_H, o)
      face(mud, at(g - 1.0), at(g + 1.0), 3.4, WALL_H, o)
    } else face(mud, T[i], T[j], 0, WALL_H, o) // outer face
    face(mud, I1[i], I1[j], ROOF_H, WALL_H, [-o[0], -o[1], 0]) // parapet's inner face over the roofs
    face(mud, I2[i], I2[j], 0, ROOF_H, [-o[0], -o[1], 0]) // courtyard walls
    oq(mud, [T[i][0], T[i][1], WALL_H], [T[j][0], T[j][1], WALL_H], [I1[j][0], I1[j][1], WALL_H], [I1[i][0], I1[i][1], WALL_H], [0, 0, 1])
    // the roofs of the rooms, in strips so they follow the ground
    for (let k = 0; k < 4; k++) {
      const s = k / 4, t = (k + 1) / 4
      const L = (P: P2[], u: number): V3 => [P[i][0] + (P[j][0] - P[i][0]) * u, P[i][1] + (P[j][1] - P[i][1]) * u, ROOF_H]
      oq(roof, L(I1, s), L(I1, t), L(I2, t), L(I2, s), [0, 0, 1])
    }
  }
}

// --- The four round towers: tapered cone, lip, top stage, hollow parapet, stepped merlons. ---
const SEG = 16
function ring(cx: number, cy: number, r: number, z: number): V3[] {
  return Array.from({ length: SEG }, (_, k) => { const a = (2 * Math.PI * k) / SEG; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3 })
}
function smoothLoft(p: Part, cx: number, cy: number, prof: [number, number][]) {
  // smooth-shaded sides of a turned profile [(r, z), ...]
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < SEG; i++) {
      const a0 = (2 * Math.PI * i) / SEG, a1 = (2 * Math.PI * (i + 1)) / SEG
      const n = (a: number): V3 => [(Math.cos(a) * dz) / l, (Math.sin(a) * dz) / l, -dr / l]
      const P = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const A = P(r0, z0, a0), B = P(r0, z0, a1), C = P(r1, z1, a1), D = P(r1, z1, a0)
      p.tri(A, B, C, undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
      p.tri(A, C, D, undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
    }
  }
}
/**
 * A merlon standing on the ring at (px, py), facing along `a` (outward angle):
 * a stepped triangle (detail) or a plain triangle (low), extruded through
 * the parapet's thickness.
 */
const STEPPED: P2[] = [[-0.475, 0], [0.475, 0], [0.475, 0.35], [0.31, 0.35], [0.31, 0.65], [0.15, 0.65], [0.15, 0.95], [-0.15, 0.95], [-0.15, 0.65], [-0.31, 0.65], [-0.31, 0.35], [-0.475, 0.35]]
const PLAIN: P2[] = [[-0.475, 0], [0.475, 0], [0, 0.95]]
function merlonAt(p: Part, px: number, py: number, a: number, z: number, scale: number, depth: number, detail: boolean) {
  const shape = (detail ? STEPPED : PLAIN).map(([u, v]) => [u * scale, v * scale] as P2)
  const nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
  const P = ([u, v]: P2, d: number): V3 => [px + tx * u + nx * d, py + ty * u + ny * d, z + v]
  for (const [i, j, k] of earcut(shape)) {
    ot(p, P(shape[i], depth / 2), P(shape[j], depth / 2), P(shape[k], depth / 2), [nx, ny, 0])
    ot(p, P(shape[i], -depth / 2), P(shape[j], -depth / 2), P(shape[k], -depth / 2), [-nx, -ny, 0])
  }
  for (let i = 0; i < shape.length; i++) {
    const A = shape[i], B = shape[(i + 1) % shape.length]
    const ex = B[0] - A[0], ev = B[1] - A[1]
    const hint: V3 = [tx * ev, ty * ev, -ex] // outward in the (u, v) plane: (ev, -ex)
    oq(p, P(A, depth / 2), P(B, depth / 2), P(B, -depth / 2), P(A, -depth / 2), hint)
  }
}
for (const [cx, cy] of T) {
  const R0 = 5.1, RS = 3.7, LIP = 4.05, RT0 = 3.85, RT1 = 3.65
  const ZS = 13.3, ZL = 13.6, ZT = 16.6
  smoothLoft(mud, cx, cy, [[R0, 0], [RS, ZS]])
  // the lip: out, up, in
  const lo = ring(cx, cy, RS, ZS), lo2 = ring(cx, cy, LIP, ZS), hi2 = ring(cx, cy, LIP, ZL), hi = ring(cx, cy, RT0, ZL)
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    const m: V3 = [Math.cos((2 * Math.PI * (i + 0.5)) / SEG), Math.sin((2 * Math.PI * (i + 0.5)) / SEG), 0]
    oq(mud, lo[i], lo[j], lo2[j], lo2[i], [0, 0, -1])
    oq(mud, lo2[i], lo2[j], hi2[j], hi2[i], m)
    oq(mud, hi2[i], hi2[j], hi[j], hi[i], [0, 0, 1])
  }
  smoothLoft(mud, cx, cy, [[RT0, ZL], [RT1, ZT]])
  // hollow parapet: rim, inner face, floor
  const rimO = ring(cx, cy, RT1, ZT), rimI = ring(cx, cy, RT1 - 0.55, ZT), flI = ring(cx, cy, RT1 - 0.55, ZT - 1.1)
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    const m: V3 = [-Math.cos((2 * Math.PI * (i + 0.5)) / SEG), -Math.sin((2 * Math.PI * (i + 0.5)) / SEG), 0]
    oq(mud, rimO[i], rimO[j], rimI[j], rimI[i], [0, 0, 1])
    oq(mud, rimI[i], rimI[j], flI[j], flI[i], m)
  }
  for (let i = 1; i < SEG - 1; i++) ot(roof, flI[0], flI[i], flI[i + 1], [0, 0, 1])
  for (let k = 0; k < 14; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / 14, r = RT1 - 0.27
    merlonAt(mud, cx + r * Math.cos(a), cy + r * Math.sin(a), a, ZT, 1, 0.48, detail)
  }
}

// --- Detail only: the loophole rows on the towers and the walls, as small dark squares. ---
if (detail) {
  const R0 = 5.1, RS = 3.7, ZS = 13.3
  const rAt = (z: number) => R0 + (RS - R0) * (z / ZS)
  for (const [cx, cy] of T) for (const [z, n, off] of [[7.2, 14, 0], [10.6, 14, 0.5]] as [number, number, number][]) {
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * (k + off)) / n, h = 0.17
      const r0 = rAt(z - h) + 0.05, r1 = rAt(z + h) + 0.05, c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c
      const P = (r: number, u: number, zz: number): V3 => [cx + r * c + tx * u, cy + r * s + ty * u, zz]
      oq(dark, P(r0, -h, z - h), P(r0, h, z - h), P(r1, h, z + h), P(r1, -h, z + h), [c, s, 0.3])
    }
  }
  for (let i = 0; i < 4; i++) {
    const a = T[i], b = T[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), o = outN(a, b)
    const n = Math.floor((L - 12) / 1.7)
    for (let k = 0; k <= n; k++) {
      const u = (6 + k * 1.7) / L, x = a[0] + (b[0] - a[0]) * u + o[0] * 0.04, y = a[1] + (b[1] - a[1]) * u + o[1] * 0.04
      const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L, h = 0.16, z = 8.6
      oq(dark, [x - tx * h, y - ty * h, z - h], [x + tx * h, y + ty * h, z - h], [x + tx * h, y + ty * h, z + h], [x - tx * h, y - ty * h, z + h], o)
    }
  }
}

// --- The square watchtower behind the SW wall. ---
{
  const W = T[3], S = T[0]
  const u = 0.36, along: P2 = [S[0] + (W[0] - S[0]) * (1 - u), S[1] + (W[1] - S[1]) * (1 - u)]
  const o = outN(W, S) // outward normal of the SW wall
  const cx = along[0] - o[0] * 6.5, cy = along[1] - o[1] * 6.5
  const rot = Math.atan2(W[1] - S[1], W[0] - S[0])
  box(mud, cx, cy, 2.5, 2.5, ROOF_H - 0.5, 13.4, 0.2, rot)
  // stepped merlons, 4 a side
  for (let side = 0; side < 4; side++) {
    const a = rot + (side * Math.PI) / 2
    const nx = Math.cos(a - Math.PI / 2), ny = Math.sin(a - Math.PI / 2), tx = Math.cos(a), ty = Math.sin(a)
    for (let k = 0; k < 4; k++) {
      const s = -1.8 + (3.6 * k) / 3
      const px = cx + nx * 2.25 + tx * s, py = cy + ny * 2.25 + ty * s
      merlonAt(mud, px, py, a - Math.PI / 2, 13.4, 0.72, 0.4, detail)
    }
  }
}

// --- The SW gate: a deep wooden door with a thin frame, and the brackets over the wall. ---
{
  const S = T[0], W = T[3]
  const L = Math.hypot(W[0] - S[0], W[1] - S[1]), t: P2 = [(W[0] - S[0]) / L, (W[1] - S[1]) / L]
  const o = outN(W, S)
  // distance along from the west tower (the left end seen from outside)
  const at = (u: number): P2 => [W[0] - t[0] * u * L, W[1] - t[1] * u * L]
  const g = at(0.36), GW = 2.0, GH = 3.4, D = 0.35
  const P = (s: number, z: number, d: number): V3 => [g[0] + t[0] * s - o[0] * d, g[1] + t[1] * s - o[1] * d, z]
  // the recess: two jambs, the lintel soffit, then the door leaf at the back
  oq(mud, P(-GW / 2, 0, 0), P(-GW / 2, 0, D), P(-GW / 2, GH, D), P(-GW / 2, GH, 0), [t[0], t[1], 0])
  oq(mud, P(GW / 2, 0, D), P(GW / 2, 0, 0), P(GW / 2, GH, 0), P(GW / 2, GH, D), [-t[0], -t[1], 0])
  oq(mud, P(-GW / 2, GH, 0), P(-GW / 2, GH, D), P(GW / 2, GH, D), P(GW / 2, GH, 0), [0, 0, -1])
  oq(wood, P(-GW / 2, 0, D), P(GW / 2, 0, D), P(GW / 2, GH, D), P(-GW / 2, GH, D), [o[0], o[1], 0])
  // the wicket door outlined in the leaf
  oq(dark, P(-0.35, 0.25, D - 0.04), P(0.35, 0.25, D - 0.04), P(0.35, 1.6, D - 0.04), P(-0.35, 1.6, D - 0.04), [o[0], o[1], 0])
  // brackets: three rounded drips over the gate, a larger box to the right
  for (const s of [-1.1, 0, 1.1]) {
    const c = at(0.36 + s / L)
    box(mud, c[0] + o[0] * 0.3, c[1] + o[1] * 0.3, 0.38, 0.3, 5.0, 6.6, 0.15, Math.atan2(t[1], t[0]))
  }
  const c = at(0.62)
  box(mud, c[0] + o[0] * 0.35, c[1] + o[1] * 0.35, 0.65, 0.35, 5.6, 8.2, 0.15, Math.atan2(t[1], t[0]))
}

const parts = [
  { part: mud, material: { ...finish('masmak-mud', 0xdcb894), floodlight: flood } },
  { part: roof, material: finish('masmak-roof', 0xcdae8e) },
  { part: wood, material: finish('masmak-gate-wood', 0x8a6a4c) },
  { part: dark, material: finish('masmak-shadow', 0x5e4a3a) },
]
return parts
}

for (const [file, detail, maxTri, maxBytes] of [['riyadh-masmak-fortress.glb', false, 6500, 256000], ['riyadh-masmak-fortress.detail.glb', true, 40000, 1536 * 1024]] as const) {
const parts = build(detail)
const triangles = triCount(parts)
if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Masmak Fortress', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 17.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1385940120'],
})
if (glb.length > maxBytes) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL(`../models/${file}`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
