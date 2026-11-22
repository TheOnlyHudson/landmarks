/**
 * Assembly Hall (1877-82, Obed Taylor), Temple Square, Salt Lake City:
 * procedural, CC0-1.0.
 * bun generators/slc-assembly-hall.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of OSM way/1151574694 (-111.8933234, 40.7697520). y = 0 is
 * the lowest ground under the outline; Mapterhorn varies by under 1 m
 * across it.
 *
 * Form, from OSM's parts and the photos: a cross of two steep gabled roofs
 * (the nave running east-west, the transept north-south, crossing 2.4 m
 * east of the centre, so the long sides have three bays west of the
 * transept and two east of it) over lower corner blocks whose low hipped
 * roofs hide behind a white balustrade. Every gable end carries a rose
 * window with a six-pointed star, white raking trim, a gabled porch with a
 * pointed arch over the door, and an apex spire; turrets with white
 * spires flank each gable, and granite buttresses with white pinnacles
 * mark every bay and corner. Over the crossing stands the white lantern
 * tower with its gablets, octagonal drum, small dome and finial.
 * Pinnacles: 22, one per OSM pyramidal building:part (way/1320123340 to
 * way/1320123362 without the tower, 1320123344), checked against the
 * photos (4 per long-side bay line plus the corners, 2 turrets and an apex
 * spire per gable).
 *
 * OSM: outline 45.7 x 28.6 m with porches; the corner blocks 37 x 21 m
 * (published: 120 x 68 ft, Wikipedia "Assembly Hall (Salt Lake City)").
 * Estimated from p2 (straight-on north side, ~22 px/m): the corner blocks'
 * cornice 10.6 m and balustrade 11.6 m; the gable walls' eaves 12.5 m and
 * ridges 18.5 m; buttress tops 13.2 m and pinnacle tips 17.8 m; turret
 * spires to 20 m; the rose window centred 14 m, 1.1 m radius; two tiers of
 * round-headed windows, 1.3-3.4 m and 5.0-8.6 m. The tower (13 m behind
 * the gable in p2, scaled for distance) to about 28.5 m at its finial.
 * Left out: the lacework of the bargeboards, the balustrade's openings,
 * the window tracery and stained glass.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:2019_Salt_Lake_Assembly_Hall_01.jpg
 *     Farragutful, CC BY-SA 4.0 (the east end, from the north-east)
 *  p2 https://commons.wikimedia.org/wiki/File:2019_Salt_Lake_Assembly_Hall_02.jpg
 *     Farragutful, CC BY-SA 4.0 (the north side, straight on)
 *  p3 https://commons.wikimedia.org/wiki/File:Assembly_Hall_-_Salt_Lake_City,_Utah_-_16_May_2020.jpg
 *     Beneathtimp, CC0 (the south side, from the south-east)
 * Lidar: not used.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const granite = new Part(), white = new Part(), roof = new Part(), win = new Part(), door = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const box = (p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number) =>
  prism(p, rect(cx - hx, cy - hy, cx + hx, cy + hy), z0, z1, true, false)
/** A square pyramid (a spire or pinnacle). */
function spire(p: Part, cx: number, cy: number, h: number, z0: number, z1: number) {
  const c: V3[] = [[cx - h, cy - h, z0], [cx + h, cy - h, z0], [cx + h, cy + h, z0], [cx - h, cy + h, z0]]
  for (let i = 0; i < 4; i++) p.tri(c[i], c[(i + 1) % 4], [cx, cy, z1])
}
/** A window shape on a wall: 'flat', 'round' (semicircle) or 'pointed' (equilateral). */
function opening(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, head: 'flat' | 'round' | 'pointed', off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0], r = w / 2
  if (head === 'flat') return poly(p, [at(-r, z0), at(r, z0), at(r, z1), at(-r, z1)], nn)
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  const seg = 8
  if (head === 'round') {
    const zs = z1 - r
    for (let k = 0; k <= seg; k++) { const a = (k / seg) * Math.PI; pts.push(at(r * Math.cos(a), zs + r * Math.sin(a))) }
  } else {
    // two arcs of radius w, centred on the opposite jambs
    const zs = z1 - w * Math.sin(Math.PI / 3)
    for (let k = 0; k <= seg / 2; k++) { const a = (k / (seg / 2)) * (Math.PI / 3); pts.push(at(-r + w * Math.cos(a), zs + w * Math.sin(a))) }
    for (let k = 1; k <= seg / 2; k++) { const a = (2 * Math.PI) / 3 + (k / (seg / 2)) * (Math.PI / 3); pts.push(at(r + w * Math.cos(a), zs + w * Math.sin(a))) }
  }
  poly(p, pts, nn)
}
/** A ring or disc on a wall. */
function disc(p: Part, o: XY, t: XY, n: XY, zc: number, r0: number, r1: number, off: number, seg = 16) {
  const P = (a: number, r: number): V3 => [o[0] + n[0] * off + t[0] * r * Math.cos(a), o[1] + n[1] * off + t[1] * r * Math.cos(a), zc + r * Math.sin(a)]
  const nn: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    const u = (2 * Math.PI * k) / seg, v = (2 * Math.PI * (k + 1)) / seg
    if (r0 <= 0) poly(p, [P(u, 0), P(u, r1), P(v, r1)], nn)
    else poly(p, [P(u, r0), P(u, r1), P(v, r1), P(v, r0)], nn)
  }
}

// ------------------------------------------------------------- the plan ---
const X0 = -18.8, X1 = 18.6, YS = 10.5          // corner blocks
const NX0 = -21.4, NX1 = 20.8, NY = 4.7          // the nave arm
const TX = 2.4, TH = 4.8, TY = 13.0              // the transept arm
const Z_CORN = 10.6, Z_BAL = 11.6, Z_EAVE = 12.5, Z_RIDGE = 18.5

// --------------------------------------------------------- corner blocks ---
prism(granite, rect(X0, -YS, X1, YS), 0, Z_CORN, false)
prism(white, rect(X0 - 0.3, -YS - 0.3, X1 + 0.3, YS + 0.3), Z_CORN, Z_CORN + 0.4, true, true)
// the balustrade: a low white band, set in from the cornice
prism(white, rect(X0 - 0.1, -YS - 0.1, X1 + 0.1, YS + 0.1), Z_CORN + 0.4, Z_BAL, true, false)
// the low hipped roofs behind it, rising to the cross
{
  const e = 0.3, z0 = Z_BAL - 0.2, z1 = 14.4
  const a: V3 = [X0 + e, -YS + e, z0], b: V3 = [X1 - e, -YS + e, z0], c: V3 = [X1 - e, YS - e, z0], d: V3 = [X0 + e, YS - e, z0]
  const r0: V3 = [X0 + 6, 0, z1], r1: V3 = [X1 - 6, 0, z1]
  poly(roof, [a, b, r1, r0], [0, -1, 1]); poly(roof, [c, d, r0, r1], [0, 1, 1])
  poly(roof, [d, a, r0], [-1, 0, 1]); poly(roof, [b, c, r1], [1, 0, 1])
}

// ------------------------------------------------------- the cross arms ---
/** A gabled arm along x (dir 'x') or y, with granite gable ends, white rakes, rose windows. */
function arm(dir: 'x' | 'y', lo: number, hi: number, c: number, h: number) {
  const P = (u: number, v: number, z: number): V3 => (dir === 'x' ? [u, c + v, z] : [c + v, u, z])
  const ring: XY[] = dir === 'x' ? rect(lo, c - h, hi, c + h) : rect(c - h, lo, c + h, hi)
  prism(granite, ring, 0, Z_EAVE, false)
  prism(white, dir === 'x' ? rect(lo - 0.25, c - h - 0.3, hi + 0.25, c + h + 0.3) : rect(c - h - 0.3, lo - 0.25, c + h + 0.3, hi + 0.25), Z_EAVE - 0.4, Z_EAVE, false, true)
  const ov = 0.5, ez = Z_EAVE - ((Z_RIDGE - Z_EAVE) * ov) / h
  for (const s of [-1, 1]) {
    const q = [P(lo - ov, s * (h + ov), ez), P(hi + ov, s * (h + ov), ez), P(hi + ov, 0, Z_RIDGE), P(lo - ov, 0, Z_RIDGE)]
    const up: V3 = dir === 'x' ? [0, s, 1] : [s, 0, 1]
    poly(roof, q, up)
    poly(roof, q, [-up[0], -up[1], -1])
  }
  for (const [u, s] of [[lo, -1], [hi, 1]] as [number, number][]) {
    const n: V3 = dir === 'x' ? [s, 0, 0] : [0, s, 0]
    poly(granite, [P(u, -h, Z_EAVE), P(u, h, Z_EAVE), P(u, 0, Z_RIDGE)], n)
    // white raking boards, standing just proud of the gable
    for (const sv of [-1, 1]) {
      const a = P(u + s * (ov + 0.05), sv * (h + ov), ez), b = P(u + s * (ov + 0.05), 0, Z_RIDGE)
      poly(white, [a, b, [b[0], b[1], b[2] - 1.0], [a[0], a[1], a[2] - 1.0]], n)
    }
    const o: XY = dir === 'x' ? [u, c] : [c, u]
    const t: XY = dir === 'x' ? [0, s] : [-s, 0]
    const nn: XY = [n[0], n[1]]
    // rose window with a star (drawn as a white ring and a dark disc)
    disc(white, o, t, nn, 14.3, 1.05, 1.5, 0.06)
    disc(win, o, t, nn, 14.3, 0, 1.05, 0.06)
    // the porch: a small gabled mass with a pointed white gable
    const pd = 1.6, pw = 3.0, pz = 5.6, pr = 8.4
    const Q = (v: number, d: number, z: number): V3 => (dir === 'x' ? [u + s * d, c + v, z] : [c + v, u + s * d, z])
    prism(granite, dir === 'x' ? rect(Math.min(u, u + s * pd), c - pw, Math.max(u, u + s * pd), c + pw) : rect(c - pw, Math.min(u, u + s * pd), c + pw, Math.max(u, u + s * pd)), 0, pz, false)
    for (const sv of [-1, 1]) {
      const qq = [Q(sv * (pw + 0.3), 0, pz - 0.3), Q(sv * (pw + 0.3), pd + 0.3, pz - 0.3), Q(0, pd + 0.3, pr), Q(0, 0, pr)]
      poly(white, qq, dir === 'x' ? [0, sv, 1] : [sv, 0, 1])
      poly(white, qq, dir === 'x' ? [0, -sv, -1] : [-sv, 0, -1])
    }
    poly(granite, [Q(-pw, pd, pz), Q(pw, pd, pz), Q(0, pd, pr - 0.4)], n)
    const po: XY = dir === 'x' ? [u + s * pd, c] : [c, u + s * pd]
    opening(white, po, t, nn, 3.0, 0, pz + 1.2, 'pointed', 0.04)
    opening(door, po, t, nn, 2.2, 0.3, 3.4, 'flat', 0.08)
    opening(win, po, t, nn, 2.2, 3.6, 5.6, 'round', 0.08)
    // a pointed window over the porch, and a lancet each side
    opening(win, o, t, nn, 1.3, 8.8, 12.0, 'pointed')
    for (const sv of [-1, 1]) {
      const ox: XY = [o[0] + t[0] * sv * 3.3, o[1] + t[1] * sv * 3.3]
      opening(white, ox, t, nn, 1.5, 6.8, 10.8, 'pointed', 0.04)
      opening(win, ox, t, nn, 1.1, 7.0, 10.5, 'pointed')
    }
  }
}
arm('x', NX0, NX1, 0, NY)
arm('y', -TY, TY, TX, TH)

// -------------------------------------------------- windows of the blocks ---
function bayWindows(o: XY, t: XY, n: XY) {
  for (const [z0, z1] of [[1.3, 3.4], [5.0, 8.6]]) {
    opening(white, o, t, n, 2.3, z0 - 0.3, z1 + 0.35, 'round', 0.04)
    opening(win, o, t, n, 1.8, z0, z1, 'round')
  }
}
const sideBays = [-16.0, -10.4, -5.0, 9.95, 15.4]
for (const s of [-1, 1]) for (const x of sideBays) bayWindows([x, s * YS], [-s, 0], [0, s])
for (const s of [-1, 1]) for (const y of [-7.6, 7.6]) bayWindows([s < 0 ? X0 : X1, y], [0, s], [s, 0])

// ---------------------------------------------------- buttresses, spires ---
// buttress shafts carry white pinnacles; turrets flank the gables
const pin = (x: number, y: number, top: number, tip: number, w = 0.7) => {
  box(granite, x, y, w, w, 0, top)
  // a white octagonal-looking drum (square with its corners cut) and a needle spire
  const d = w + 0.1, k = d * 0.4
  prism(white, [[x - d + k, y - d], [x + d - k, y - d], [x + d, y - d + k], [x + d, y + d - k], [x + d - k, y + d], [x - d + k, y + d], [x - d, y + d - k], [x - d, y - d + k]], top, top + 2.0, true)
  // bolder than life so the pinnacles survive at phone size
  spire(white, x, y, w * 0.9, top + 2.0, tip)
}
for (const s of [-1, 1]) {
  for (const x of [-18.6, -13.2, -7.6, 12.7, 18.1]) pin(x, s * 10.5, 12.8, 19.5)
  for (const x of [-1.9, 7.1]) pin(x, s * 12.6, 14.2, 22.0, 0.85)
  for (const x of [NX0 + 0.8, NX1 - 0.4]) pin(x, s * 4.5, 14.2, 22.0, 0.85)
}
// apex spires on the four gables
for (const [x, y] of [[NX0 - 0.2, 0], [NX1 + 0.2, 0], [TX, -TY - 0.2], [TX, TY + 0.2]] as XY[]) {
  box(white, x, y, 0.45, 0.45, Z_RIDGE - 1.2, Z_RIDGE + 1.0)
  spire(white, x, y, 0.55, Z_RIDGE + 1.0, Z_RIDGE + 6.0)
}

// -------------------------------------------------------------- the tower ---
{
  const cx = TX, cy = 0, h = 2.4
  box(white, cx, cy, h, h, Z_RIDGE - 2, 23.2)
  for (const [t, n] of [[[0, -1], [1, 0]], [[0, 1], [-1, 0]], [[1, 0], [0, 1]], [[-1, 0], [0, -1]]] as [XY, XY][]) {
    const o: XY = [cx + n[0] * h, cy + n[1] * h]
    opening(win, o, t, n, 1.2, 19.6, 22.6, 'round')
    // a gablet over each face
    const at = (s: number, z: number): V3 => [o[0] + t[0] * s, o[1] + t[1] * s, z]
    poly(white, [at(-h, 23.2), at(h, 23.2), at(0, 24.6)], [n[0], n[1], 0])
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) spire(white, cx + sx * (h - 0.3), cy + sy * (h - 0.3), 0.35, 23.2, 25.2)
  // the octagonal drum, the dome and the finial
  const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const a = ((i + 0.5) / 8) * 2 * Math.PI
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
  white.loft([oct(1.7, 23.2), oct(1.7, 25.2)])
  white.loft([oct(1.7, 25.2), oct(1.95, 25.5), oct(1.6, 26.6), oct(0.9, 27.3), oct(0.25, 27.6)])
  white.cap(oct(0.25, 27.6), true)
  spire(white, cx, cy, 0.18, 27.6, 29.0)
  for (let i = 0; i < 8; i += 2) {
    const a = ((i + 0.5) / 8) * 2 * Math.PI, a2 = ((i + 1.5) / 8) * 2 * Math.PI
    const p: XY = [cx + 1.7 * Math.cos((a + a2) / 2) * Math.cos(Math.PI / 8), cy + 1.7 * Math.sin((a + a2) / 2) * Math.cos(Math.PI / 8)]
    const n: XY = [Math.cos((a + a2) / 2), Math.sin((a + a2) / 2)]
    opening(win, p, [-n[1], n[0]], n, 0.8, 23.5, 25.0, 'round')
  }
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: mid-grey granite pulled light, white
// trim and spires, a warm grey shingle roof, oak doors.
const parts = [
  { part: granite, material: finish('assembly-granite', 0xa6a6a3) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: finish('assembly-shingle', 0x9c9690) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('assembly-door', 0xa07d55) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Assembly Hall', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 29.0,
})
await Bun.write(new URL('../models/slc-assembly-hall.glb', import.meta.url), glb)
console.log(`slc-assembly-hall.glb: ${triangles} triangles, ${glb.length} bytes`)
