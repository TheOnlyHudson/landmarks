/**
 * Baku Crystal Hall (Bakı Kristal Zalı), Baku: procedural, CC0-1.0.
 * bun generators/baku-crystal-hall.ts   (writes the low model and the detail model)
 *
 * The indoor arena built for the Eurovision Song Contest 2012 on the
 * Flag Square peninsula on the bay (gmp architekten von Gerkan, Marg and
 * Partners, with Alpine Bau; opened 2012).
 *
 * Identity, in order: a ring of thirty great diamond-shaped facets of
 * silver membrane round a rounded-rectangle plan, each diamond standing on
 * its lower point and folded outward along its vertical diagonal, the
 * diamonds touching at their side points so that the tops make a crown of
 * peaks and the feet a row of pointed openings; under each opening a tent of
 * pale soffit panels sloping in to a red wall and a glazed entrance; a flat
 * pale roof inside the crown; at night the whole facade lit by LED points.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the plan's long axis
 * runs east-west, as OSM has it). Origin: the area centroid of OSM
 * way/249204041 (49.850221, 40.344164). y = 0 is the lowest ground under the
 * footprint (reclaimed land, flat).
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Baku_-_Baku8423.jpg
 *   lumoplank, CC0: daylight from high ground to the north-west, the whole
 *   north side and both ends: the diamonds, their folds, the openings, the
 *   roof, the colours. The facade's proportions are measured on it.
 * - p2 https://commons.wikimedia.org/wiki/File:Crystal_Hall.jpg
 *   Joseph Arth, CC BY-SA 4.0 (2023-05): dusk, eye level, close: the
 *   diamonds' shapes and folds, the side points at 0.43 of the height, the
 *   soffit tents, the red walls and glazed doors, the LED points.
 * - p3 https://commons.wikimedia.org/wiki/File:Trip_to_Azerbaijan_(2014-09-25)_07.jpg
 *   mos.ru, CC BY 4.0: from the hill to the west, the plan's shape.
 * - p4 https://commons.wikimedia.org/wiki/File:Baku_bolvard_and_flag_square_1.JPG
 *   Urek Meniashvili, CC BY-SA 3.0: from the north-west hill, the crown's
 *   low profile against the bay.
 * - p5 https://commons.wikimedia.org/wiki/File:%D0%91%D0%B0%D0%BA%D1%83.JPG
 *   Consulbk, CC BY-SA 3.0: night, the facade lit blue.
 * - p6 https://commons.wikimedia.org/wiki/File:View_of_Baku_at_night_3.jpg
 *   Interfase, CC BY-SA 3.0: night, lit blue-white from the north-west.
 * - OSM (OSM API, 2026-11): way/249204041 the hall (6 levels, no height),
 *   a 179 x 139 m rounded rectangle.
 * - Published (Wikipedia "Baku Crystal Hall"): height 24 m in the middle;
 *   15 entrances on each side (30 round the hall); a membrane facade lit by
 *   LED points with dynamic lighting scenarios; architect gmp.
 * - Mapterhorn terrain (z12): flat. No lidar or NAIP (outside the US).
 *   Look-only references: none.
 *
 * Numbers:
 * - thirty diamond units, one per entrance (published 15 a side), spaced
 *   evenly round the OSM outline (about 19.6 m apart);
 * - peaks 27 m (p1: the facade's height against the unit spacing, 1.35;
 *   p2 1.17 with its upward view; estimated +-2 m), leaning 3 m out past
 *   the outline (p2: the diamonds flare from their feet), feet 1.5 m inside
 *   it; side points at 13 m (0.48 of the peak; p1 0.53, p2 0.43), set
 *   4.5 m inside the outline (the fold's depth, estimated from p1's shading);
 * - the notches above the side points are filled by membrane tents sloping
 *   back to the roof's edge, 11 m inside the outline at 20.5 m (the smaller
 *   diamonds seen behind the notches in p2; estimated);
 * - the openings' tents slope in to a wall 9 m inside the outline, 5.5 m
 *   tall at its apex (p2, estimated);
 * - the roof from its edge at 20.5 m swelling to 24 m in the middle
 *   (published);
 * Colours: membrane silver #c3c4c2 (p1: #a9a59f to #c9c5bd in sun, a little
 * warm; pulled light); frames and soffits white trim; the walls in the
 * openings red #b3544c (p1, p2 #8a2c2a pulled light); the roof pale
 * #e6e1d6 (p1); the doors `window`.
 *
 * Night: the membrane is `neon-crystal-membrane`, so the whole facade
 * glows (in the real hall the LED points play scenes in any colour, blue
 * in p5 and p6; the day colour can only glow silver-white); the doors are
 * `window`.
 *
 * Detail model (models/baku-crystal-hall.detail.glb, from zoom 16): the
 * frame lines across each facet (the membrane's cable lines, parallel to
 * the diamond's edges, p1), finer frames, the roof's rows of rooflights.
 *
 * Doubts: the peaks lean up to 3 m past the OSM outline (the outline is
 * taken as the line of the feet). The peak height is from photo proportions only; the fold depth
 * and the tents' depth are estimated; the units' exact positions round the
 * corners follow even spacing, not counted per side; the low connector
 * buildings outside the outline (way/249204039 to the east) are left to
 * the map.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { triangulate, type XY } from './chi-aon-center'

export const ANCHOR: [number, number] = [49.850221, 40.344164]
const KX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), KY = 110574
const OUTLINE = [[49.8493802, 40.3436005], [49.8492515, 40.3436986], [49.8491764, 40.3438704], [49.8491935, 40.3445409], [49.8493158, 40.3446635], [49.8494553, 40.3447371], [49.8496227, 40.3447862], [49.8501591, 40.3447944], [49.8505389, 40.344778], [49.8509573, 40.3447371], [49.8511183, 40.3446799], [49.851247, 40.3445654], [49.8512899, 40.3444264], [49.851272, 40.3441767], [49.8512676, 40.3441153], [49.851247, 40.3438295], [49.8511719, 40.343715], [49.8510432, 40.343625], [49.8508822, 40.3435596], [49.8503029, 40.3435351], [49.8498094, 40.3435433]]

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

const UNITS = 30, PEAK = 27, SIDE = 13, FOLD = 4.5, LEAN = 3, FOOT_IN = 1.5, TENT_IN = 9, TENT_H = 5.5, NOTCH_IN = 11, NOTCH_Z = 20.5, ROOF_TOP = 24

// ---- The outline, resampled and smoothed -------------------------------------------------------------------
function outline(): { at: (s: number, inset: number) => XY; P: number } {
  let r: XY[] = OUTLINE.map(([lo, la]) => [(lo - ANCHOR[0]) * KX, (la - ANCHOR[1]) * KY] as XY)
  const a2 = r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  if (a2 < 0) r = r.reverse()
  // Resample densely by arc length, then smooth lightly so the corners curve.
  const seg = r.map((a, i) => { const b = r[(i + 1) % r.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]) })
  const L = seg.reduce((s, v) => s + v, 0), M = 400
  let d: XY[] = []
  for (let m = 0; m < M; m++) {
    let s = (m / M) * L, i = 0
    while (s > seg[i]) { s -= seg[i]; i++ }
    const a = r[i], b = r[(i + 1) % r.length], t = s / seg[i]
    d.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  for (let it = 0; it < 30; it++) d = d.map((p, i) => [0.5 * p[0] + 0.25 * (d[(i + M - 1) % M][0] + d[(i + 1) % M][0]), 0.5 * p[1] + 0.25 * (d[(i + M - 1) % M][1] + d[(i + 1) % M][1])] as XY)
  const sg = d.map((a, i) => { const b = d[(i + 1) % M]; return Math.hypot(b[0] - a[0], b[1] - a[1]) })
  const P = sg.reduce((s, v) => s + v, 0)
  const at = (s0: number, inset: number): XY => {
    let s = ((s0 % P) + P) % P, i = 0
    while (s > sg[i] && i < M - 1) { s -= sg[i]; i++ }
    const a = d[i], b = d[(i + 1) % M], t = s / sg[i]
    const tx = (b[0] - a[0]) / sg[i], ty = (b[1] - a[1]) / sg[i]
    // Counter-clockwise ring: the inward normal is the tangent turned left.
    return [a[0] + (b[0] - a[0]) * t - ty * inset, a[1] + (b[1] - a[1]) * t + tx * inset]
  }
  return { at, P }
}

/** Both sides of a triangle (a thin membrane, seen from inside through the notches too). */
function tri2(p: Part, a: V3, b: V3, c: V3) {
  p.tri(a, b, c)
  p.tri(a, c, b)
}

/** A box strut between two points, square section w. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = unit(sub(b, a))
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = mul(unit(cross(d, ref)), w / 2), v = mul(unit(cross(d, unit(cross(d, ref)))), w / 2)
  const c = (o: V3, i: number): V3 => add(add(o, mul(u, i & 1 ? 1 : -1)), mul(v, i & 2 ? 1 : -1))
  const A = [0, 1, 3, 2].map((i) => c(a, i)), Bq = [0, 1, 3, 2].map((i) => c(b, i))
  const ctr = mul(add(a, b), 0.5)
  const face = (q: V3[], n: V3) => {
    const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    const Q = f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0 ? q : [q[0], q[3], q[2], q[1]]
    p.quad(Q[0], Q[1], Q[2], Q[3])
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, q = [A[i], A[j], Bq[j], Bq[i]]
    face(q, unit(sub(mul(add(add(q[0], q[1]), add(q[2], q[3])), 0.25), ctr)))
  }
  face(A, mul(d, -1)); face(Bq, d)
}

/** A triangle wound to face `toward` (a point it should face away from is passed negated in use). */
function triFacing(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (f[0] * out[0] + f[1] * out[1] + f[2] * out[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

const MEMBRANE: MaterialSpec = finish('neon-crystal-membrane', 0xbab8b3, 0.5)
const TRIM: MaterialSpec = PALETTE.trim
const RED: MaterialSpec = finish('hall-red', 0xb3544c)
const DOOR: MaterialSpec = PALETTE.window
const ROOF: MaterialSpec = finish('hall-roof', 0xe6e1d6)

export function build(detail: boolean) {
  const mem = new Part(), trim = new Part(), red = new Part(), door = new Part(), roof = new Part()
  const { at, P } = outline()
  const span = P / UNITS
  const s0 = span * 0.25 // phase: a diamond's foot near the middle of the north side (p1)
  const pt = (s: number, inset: number, z: number): V3 => { const q = at(s, inset); return [q[0], q[1], z] }
  const fw = detail ? 0.35 : 0.55

  for (let k = 0; k < UNITS; k++) {
    const sB = s0 + k * span, sVl = sB - span / 2, sVr = sB + span / 2
    const B = pt(sB, FOOT_IN, 0), T = pt(sB, -LEAN, PEAK)
    const Vl = pt(sVl, FOLD, SIDE), Vr = pt(sVr, FOLD, SIDE)
    // The diamond, folded along T-B.
    tri2(mem, T, Vl, B)
    tri2(mem, T, B, Vr)
    // The notch above each side point, filled by a tent of membrane sloping back
    // from the side point and the two peaks to the roof's edge (the smaller
    // diamond seen behind the notch in p2), and the back of the peak.
    const Tn = pt(sB + span, -LEAN, PEAK)
    const N = pt(sVr, NOTCH_IN, NOTCH_Z), Np = pt(sVl, NOTCH_IN, NOTCH_Z)
    const nUp = (s: number): V3 => { const a = at(s, 0), b = at(s, 1); return [a[0] - b[0], a[1] - b[1], 0.8] }
    triFacing(mem, T, Vr, N, nUp(sVr)); triFacing(mem, Vr, Tn, N, nUp(sVr))
    triFacing(mem, T, N, Np, [0, 0, 1])
    // Frames: the four edges and the ridge.
    const Bf: V3 = [B[0], B[1], fw * 0.75] // the frame's foot kept above the ground
    for (const [a, b] of [[T, Vl], [T, Vr], [Bf, Vl], [Bf, Vr], [T, Bf]] as [V3, V3][]) strut(trim, a, b, fw)
    // The tent under the right side point, between this foot and the next.
    const B2 = pt(sB + span, FOOT_IN, 0)
    const Ql = pt(sB + span * 0.22, TENT_IN, 0), Qr = pt(sB + span * 0.78, TENT_IN, 0), R = pt(sVr, TENT_IN, TENT_H)
    const outN = (s: number): V3 => { const a = at(s, 0), b = at(s, 1); return [a[0] - b[0], a[1] - b[1], 0] }
    const nO = outN(sVr)
    // Soffits face out and down.
    const down: V3 = [nO[0], nO[1], -0.6]
    triFacing(trim, B, Vr, R, down); triFacing(trim, B, R, Ql, down)
    triFacing(trim, Vr, B2, Qr, down); triFacing(trim, Vr, Qr, R, down)
    // The back wall, red, with the glazed doors on it.
    triFacing(red, Ql, Qr, R, nO)
    const o: V3 = mul(unit(nO), 0.06)
    const d0 = add(lerp3(Ql, Qr, 0.3), o), d1 = add(lerp3(Ql, Qr, 0.7), o)
    const d2 = add(add(d1, [0, 0, 2.8]), [0, 0, 0]), d3 = add(d0, [0, 0, 2.8])
    triFacing(door, d0, d1, d2, nO); triFacing(door, d0, d2, d3, nO)
    // Detail: the membrane's cable lines, parallel to the diamond's edges.
    if (detail) {
      for (const V of [Vl, Vr]) {
        for (let i = 1; i <= 5; i++) {
          const t = i / 6
          // Lines parallel to T-V across the lower half (from the ridge to the B-V edge),
          // and parallel to B-V across the upper half (from the ridge to the T-V edge).
          strut(trim, lerp3(B, T, t * 0.5), lerp3(B, V, t), 0.16)
          strut(trim, lerp3(T, B, t * 0.5), lerp3(T, V, t), 0.16)
        }
      }
    }
  }

  // The drum behind the facade (hidden) and the roof from the notches' edge, swelling to 24 m.
  const DN = UNITS
  const r1: V3[] = Array.from({ length: DN }, (_, i) => pt(s0 + span / 2 + i * span, NOTCH_IN, NOTCH_Z))
  const r0: V3[] = r1.map((p) => [p[0], p[1], 0])
  for (let i = 0; i < DN; i++) {
    const j = (i + 1) % DN
    triFacing(roof, r0[i], r0[j], r1[j], [r0[i][0], r0[i][1], 0]); triFacing(roof, r0[i], r1[j], r1[i], [r0[i][0], r0[i][1], 0])
  }
  const cx = r1.reduce((s, p) => s + p[0], 0) / DN, cy = r1.reduce((s, p) => s + p[1], 0) / DN
  const steps = [[1, NOTCH_Z], [0.75, 22.3], [0.45, 23.4], [0.15, ROOF_TOP]] as const
  const rings = steps.map(([f, z]) => r1.map((p) => [cx + (p[0] - cx) * f, cy + (p[1] - cy) * f, z] as V3))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < DN; i++) {
      const j = (i + 1) % DN
      triFacing(roof, rings[k][i], rings[k][j], rings[k + 1][j], [0, 0, 1]); triFacing(roof, rings[k][i], rings[k + 1][j], rings[k + 1][i], [0, 0, 1])
    }
  const top = rings[rings.length - 1]
  const tri2d = triangulate(top.map((p) => [p[0], p[1]] as XY))
  for (const [i, j, k] of tri2d) triFacing(roof, top[i], top[j], top[k], [0, 0, 1])
  // Detail: rows of rooflights on the roof (p1).
  if (detail) {
    for (let x = -60; x <= 60; x += 10)
      for (let y = -42; y <= 42; y += 10) {
        const px = cx + x, py = cy + y
        if (Math.hypot(x / 70, y / 52) > 0.95) continue
        const z = ROOF_TOP - 3.5 * Math.pow(Math.hypot(x / 70, y / 52), 2)
        strut(trim, [px - 1.6, py, z], [px + 1.6, py, z + 0.01], 1.6)
      }
  }

  return [
    { part: mem, material: MEMBRANE },
    { part: trim, material: TRIM },
    { part: red, material: RED },
    { part: door, material: DOOR },
    { part: roof, material: ROOF },
  ]
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['baku-crystal-hall.glb', false, 6500, 250 * 1024],
    ['baku-crystal-hall.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Baku Crystal Hall', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor', anchor: ANCHOR, bearing: 0, height: PEAK })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
