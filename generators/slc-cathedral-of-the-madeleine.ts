/**
 * Cathedral of the Madeleine (1899-1909, Carl M. Neuhausen; Romanesque
 * body, Gothic Revival towers), 331 E South Temple, Salt Lake City:
 * procedural, CC0-1.0.
 * bun generators/slc-cathedral-of-the-madeleine.ts
 *
 * Also exports the small church kit (poly, prism, opening, disc, turret,
 * ...) that slc-first-presbyterian-church.ts imports: merge this one first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the church is square
 * to the city grid, its front facing south onto South Temple). The origin is
 * the area centroid of OSM way/466188203 (-111.8817253, 40.7698918). The
 * plan below is written in a frame 0.40 m west and 4.22 m north of that
 * (the batch's first anchor) and shifted at the end. y = 0 is the lowest
 * ground under the outline, at the south-west corner (lidar ground_min +
 * 1.7 m); the ground rises about 2 m to the south-east corner and 7-8 m to
 * the north end, where the apse and sacristies sink into the slope.
 *
 * Form (OSM outline and parts, checked against the photos): a long nave
 * under one steep green metal roof spanning nave and aisles; twin square
 * towers at the south front with corner buttresses, a pair of tall
 * round-headed windows, an arcaded band, a round-headed belfry pair, and a
 * crown of four steep gables between octagonal corner turrets with conical
 * caps; between the towers the front gable with its great wheel window in a
 * round arch, an arcade of three small lights near the apex, and three
 * gabled porches (the middle one tall, with a pointed portal); low
 * flat-topped transept wings; the north chancel gable and a five-sided apse
 * with a pyramidal roof; low sacristies with pyramidal green roofs; and a
 * green flèche over the crossing.
 *
 * Heights, lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013; the
 * building is unchanged since), above the south-west ground:
 *   tower top platform 43.4 (measured), tower gable tips about 48 and
 *   turret cones 49.3 (measured, highest returns 49.3);
 *   nave ridge 32.3 (measured, flat along its length), eaves about 20
 *   (measured on the roof slope at the wall line);
 *   transept wings' roofs 23.7 (measured, flat 25.4 above ground_min);
 *   apse roof from 28 at the gable down to 20 at its eaves (measured);
 *   flèche 44.6, its cross 45.5 (measured, 47.2 above ground_min);
 *   sacristies 10.5-14.5 (measured; OSM says 3-6 m above the uphill ground).
 * OSM's height=24 on the outline and the towers is wrong (the towers are
 * twice that); not used.
 * Estimated from p0 and p1 (front gable about 16 px/m in p1): the wheel
 * window centred 17 m, 3.2 m glass radius in a 4.5 m round arch; porch
 * gables 8.5 and 12 m; tower stages 17.5-24.5 (window pair), 26-27.5
 * (arcaded band), 29.5-37.5 (belfry pair), 38.5 (buttress tops and the
 * gargoyles). Doors at 2.3 m, on the landing the front stairs climb to.
 * The apse's three blind arches and the gable's corbelled rakes from p11.
 * Left out: the gargoyles, crockets, the corbel arcading under the eaves,
 * the roof dormers, the wheel window's cusping and the tympanum sculpture.
 *
 * Photos (EVIDENCE):
 *  p0  https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Madeleine_-_Salt_Lake_City.jpg
 *      Farragutful, CC BY-SA 4.0 (the front and west tower, from the south-west)
 *  p2  https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Catholic_Cathedral.jpg
 *      Streamline1989 (English Wikipedia), public domain (from the east, above: roof, flèche, towers)
 *  p11 https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Madeleine_-_Salt_Lake_City_11.jpg
 *      Farragutful, CC BY-SA 4.0 (the apse and chancel gable, from the north)
 *  p9  https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Madeleine_-_Salt_Lake_City_09.jpg
 *      Farragutful, CC BY-SA 4.0 (the portal and wheel window, close)
 * Doubts: the west side and the transept ends are seen only through trees
 * or not at all; the transept wings are drawn flat-topped from the lidar.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat polygon, wound to face n. */
export function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const ccw = (r: XY[]) => {
  let a = 0
  for (let i = 0; i < r.length; i++) { const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length]; a += x0 * y1 - x1 * y0 }
  return a > 0 ? r : [...r].reverse()
}
/** Walls round a ring (split into pieces no longer than `seg` metres), with an optional top and bottom. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false, seg = 5) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    const k = z0 < 1 ? Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / seg)) : 1
    for (let j = 0; j < k; j++) {
      const u = j / k, v = (j + 1) / k
      const a: XY = [ax + (bx - ax) * u, ay + (by - ay) * u], b: XY = [ax + (bx - ax) * v, ay + (by - ay) * v]
      p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  if (top) poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
export const box = (p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, top = true) =>
  prism(p, rect(cx - hx, cy - hy, cx + hx, cy + hy), z0, z1, top, false)
/** A square pyramid. */
export function spire(p: Part, cx: number, cy: number, h: number, z0: number, z1: number) {
  const c: V3[] = [[cx - h, cy - h, z0], [cx + h, cy - h, z0], [cx + h, cy + h, z0], [cx - h, cy + h, z0]]
  for (let i = 0; i < 4; i++) p.tri(c[i], c[(i + 1) % 4], [cx, cy, z1])
}
/** An n-sided ring. */
export const ngon = (cx: number, cy: number, r: number, z: number, n = 8, rot = Math.PI / 8): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * 2 * Math.PI
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
/** An octagonal turret with a conical (octagonal) cap. */
export function turret(body: Part, cap: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number) {
  body.loft([ngon(cx, cy, r, z0), ngon(cx, cy, r, z1)])
  cap.loft([ngon(cx, cy, r * 1.12, z1), ngon(cx, cy, r * 1.12, z1 + 0.35), ngon(cx, cy, 0.05, tip)])
}
/** A window shape on a wall: 'flat', 'round' (semicircle) or 'pointed' (equilateral). o is the foot's centre, t along the wall, n out. */
export function opening(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, head: 'flat' | 'round' | 'pointed', off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0], r = w / 2
  if (head === 'flat') return poly(p, [at(-r, z0), at(r, z0), at(r, z1), at(-r, z1)], nn)
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  const seg = 8
  if (head === 'round') {
    const zs = z1 - r
    for (let k = 0; k <= seg; k++) { const a = (k / seg) * Math.PI; pts.push(at(r * Math.cos(a), zs + r * Math.sin(a))) }
  } else {
    const zs = z1 - w * Math.sin(Math.PI / 3)
    for (let k = 0; k <= seg / 2; k++) { const a = (k / (seg / 2)) * (Math.PI / 3); pts.push(at(-r + w * Math.cos(a), zs + w * Math.sin(a))) }
    for (let k = 1; k <= seg / 2; k++) { const a = (2 * Math.PI) / 3 + (k / (seg / 2)) * (Math.PI / 3); pts.push(at(r + w * Math.cos(a), zs + w * Math.sin(a))) }
  }
  poly(p, pts, nn)
}
/** A bar on a wall from (s0,z0) to (s1,z1), w wide. */
export function bar(p: Part, o: XY, t: XY, n: XY, s0: number, z0: number, s1: number, z1: number, w: number, off = 0.08) {
  const L = Math.hypot(s1 - s0, z1 - z0), ps = (-(z1 - z0) / L) * (w / 2), pz = ((s1 - s0) / L) * (w / 2)
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  poly(p, [at(s0 - ps, z0 - pz), at(s1 - ps, z1 - pz), at(s1 + ps, z1 + pz), at(s0 + ps, z0 + pz)], [n[0], n[1], 0])
}
/** A ring or disc on a wall. */
export function disc(p: Part, o: XY, t: XY, n: XY, zc: number, r0: number, r1: number, off: number, seg = 16) {
  const P = (a: number, r: number): V3 => [o[0] + n[0] * off + t[0] * r * Math.cos(a), o[1] + n[1] * off + t[1] * r * Math.cos(a), zc + r * Math.sin(a)]
  const nn: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    const u = (2 * Math.PI * k) / seg, v = (2 * Math.PI * (k + 1)) / seg
    if (r0 <= 0) poly(p, [P(u, 0), P(u, r1), P(v, r1)], nn)
    else poly(p, [P(u, r0), P(u, r1), P(v, r1), P(v, r0)], nn)
  }
}
/** A gable wall: a triangle prism of thickness d, its face at `o` facing n. */
export function gable(p: Part, o: XY, t: XY, n: XY, half: number, z0: number, z1: number, d: number) {
  const A = (s: number, z: number, k: number): V3 => [o[0] + t[0] * s - n[0] * k, o[1] + t[1] * s - n[1] * k, z]
  const f = [A(-half, z0, 0), A(half, z0, 0), A(0, z1, 0)], b = [A(-half, z0, d), A(half, z0, d), A(0, z1, d)]
  poly(p, f, [n[0], n[1], 0]); poly(p, b, [-n[0], -n[1], 0])
  const up1: V3 = [-t[0] * (z1 - z0), -t[1] * (z1 - z0), half], up2: V3 = [t[0] * (z1 - z0), t[1] * (z1 - z0), half]
  poly(p, [f[0], f[2], b[2], b[0]], up1); poly(p, [f[1], b[1], b[2], f[2]], up2)
}

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
  const S: XY = [0, -1], E: XY = [1, 0], W: XY = [-1, 0], N: XY = [0, 1]

  // ------------------------------------------------------------ the plan ---
  const NX0 = -11.2, NX1 = 12.0, CX = 0.4         // nave walls, ridge line
  const YF = -31.4, YB = 12.4                     // nave front wall, chancel gable
  const Z_EAVE = 20.0, Z_RIDGE = 32.3
  const pitch = (Z_RIDGE - Z_EAVE) / (NX1 - CX)
  const roofZ = (x: number) => Z_RIDGE - Math.abs(x - CX) * pitch

  // --------------------------------------------------------------- nave ---
  prism(stone, rect(NX0, -24.3, NX1, YB), 0, Z_EAVE, false)
  prism(stone, rect(-7.1, YF, 7.9, -24.3), 0, Z_EAVE, false)
  {
    const ov = 0.5, x0 = NX0 - ov, x1 = NX1 + ov, ez = Z_EAVE - ov * pitch, y0 = YF - 0.3, y1 = YB + 0.5
    for (const [xa, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const q: V3[] = [[xa, y0, ez], [xa, y1, ez], [CX, y1, Z_RIDGE], [CX, y0, Z_RIDGE]]
      poly(roof, q, [s, 0, 1]); poly(roof, q, [-s, 0, -1])
    }
    // the ridge cap
    box(roof, CX, (y0 + y1) / 2, 0.2, (y1 - y0) / 2, Z_RIDGE - 0.2, Z_RIDGE + 0.25)
  }
  // nave side windows (round-headed, between buttresses) on both aisles
  for (const [xw, n] of [[NX0, W], [NX1, E]] as [number, XY][]) {
    const t: XY = [n[1], -n[0]]
    for (const y of [-21.0, -15.6, -10.2, -5.0]) {
      opening(trim, [xw, y], t, n, 2.9, 8.6, 17.4, 'round', 0.04)
      opening(win, [xw, y], t, n, 2.3, 9.0, 17.0, 'round', 0.07)
      bar(trim, [xw, y], t, n, 0, 9.0, 0, 15.6, 0.18, 0.1)
    }
    for (const y of [-18.3, -12.9, -7.6]) {
      box(stone, xw + n[0] * 0.35, y, 0.45, 0.6, 0, 18.5)
      spire(stone, xw + n[0] * 0.35, y, 0.6, 18.5, 19.8)
    }
  }

  // -------------------------------------------------------- the towers ---
  function tower(x0: number, x1: number, y0: number, y1: number, inner: 1 | -1) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2, ins = 0.5
    const ZB = 38.5, ZT = 43.4
    box(stone, cx, cy, hx - ins, hy - ins, 0, ZT)
    // corner buttresses to the gargoyles
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(stone, cx + sx * (hx - 1.0), cy + sy * (hy - 1.0), 1.0, 1.0, 0, ZB)
    // string courses: the arcaded band, and the band under the crown
    box(trim, cx, cy, hx - ins + 0.2, hy - ins + 0.2, 26.0, 27.5, true)
    box(trim, cx, cy, hx + 0.12, hy + 0.12, 16.6, 17.2, true)
    box(trim, cx, cy, hx - ins + 0.25, hy - ins + 0.25, ZT - 0.3, ZT + 0.1, true)
    // openings on the faces the nave doesn't hide
    const faces: [XY, XY, XY, number][] = [
      [[cx, y0 + ins], [1, 0], S, hx],
      [[inner > 0 ? x0 + ins : x1 - ins, cy], [0, inner > 0 ? 1 : -1], inner > 0 ? W : E, hy],
      [[cx, y1 - ins], [-1, 0], N, hx],
    ]
    for (const [o, t, n, h] of faces) {
      const back = n === N
      // a pair of tall round-headed windows (above the nave roof only at the back)
      if (!back) for (const s of [-0.85, 0.85]) {
        const oo: XY = [o[0] + t[0] * s, o[1] + t[1] * s]
        opening(trim, oo, t, n, 1.55, 17.6, 24.9, 'round', 0.04)
        opening(win, oo, t, n, 1.15, 17.9, 24.6, 'round', 0.07)
      }
      // the belfry: a pair under one round arch, an oculus between the heads
      opening(trim, o, t, n, 4.3, 29.2, 38.0, 'round', 0.04)
      opening(stone, o, t, n, 3.7, 29.5, 37.6, 'round', 0.06)
      for (const s of [-0.95, 0.95]) {
        const oo: XY = [o[0] + t[0] * s, o[1] + t[1] * s]
        opening(win, oo, t, n, 1.35, 29.6, 35.4, 'round', 0.08)
      }
      disc(win, o, t, n, 36.4, 0, 0.55, 0.08, 10)
      // the crown gable on this face, with a small round-headed light
      const g: XY = [o[0] + n[0] * (ins + 0.1), o[1] + n[1] * (ins + 0.1)]
      gable(stone, g, t, n, h - 1.7, ZT - 1.2, 48.0, 0.7)
      opening(win, g, t, n, 0.8, ZT - 0.2, ZT + 2.0, 'round', 0.04)
      box(trim, g[0] - n[0] * 0.35, g[1] - n[1] * 0.35, 0.12, 0.12, 47.6, 49.3)
      box(trim, g[0] - n[0] * 0.35, g[1] - n[1] * 0.35, n[0] ? 0.12 : 0.45, n[0] ? 0.45 : 0.12, 48.4, 48.65)
      void h
    }
    // a round-headed door in the front face
    opening(trim, [cx, y0 + ins], [1, 0], S, 2.6, 2.0, 6.6, 'round', 0.04)
    opening(door, [cx, y0 + ins], [1, 0], S, 1.9, 2.3, 6.1, 'round', 0.07)
    // the octagonal corner turrets and their cones
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      turret(stone, stone, cx + sx * (hx - 0.95), cy + sy * (hy - 0.95), 1.0, ZB - 0.2, ZT + 0.6, 49.3)
    }
  }
  tower(-15.0, -7.1, -32.8, -24.3, 1)
  tower(7.9, 16.1, -32.9, -24.3, -1)

  // ------------------------------------------------- the front gable ---
  {
    const y = YF, o: XY = [CX, y], t: XY = [1, 0]
    // the gable triangle between the towers
    const zl = roofZ(-7.1)
    poly(stone, [[-7.1, y, zl], [7.9, y, roofZ(7.9)], [CX, y, Z_RIDGE]], [0, -1, 0])
    // coping on the rakes and a cross at the apex
    for (const xe of [-7.1, 7.9]) bar(trim, o, t, S, xe - CX, roofZ(xe), 0, Z_RIDGE + 0.4, 0.6, 0.12)
    box(trim, CX, y - 0.2, 0.18, 0.18, Z_RIDGE, Z_RIDGE + 2.4)
    box(trim, CX, y - 0.2, 0.7, 0.18, Z_RIDGE + 1.4, Z_RIDGE + 1.75)
    // three round-headed lights near the apex
    for (const s of [-1.3, 0, 1.3]) opening(win, [CX + s, y], t, S, 0.8, 25.6, s ? 27.6 : 28.2, 'round', 0.05)
    // the wheel window in its round arch
    opening(trim, o, t, S, 10.0, 12.6, 22.0, 'round', 0.04)
    opening(stone, o, t, S, 9.0, 13.0, 21.4, 'round', 0.06)
    disc(trim, o, t, S, 16.9, 3.2, 3.7, 0.08)
    disc(win, o, t, S, 16.9, 0, 3.2, 0.08)
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * 2 * Math.PI
      bar(trim, o, t, S, 0.7 * Math.cos(a), 16.9 + 0.7 * Math.sin(a), 3.2 * Math.cos(a), 16.9 + 3.2 * Math.sin(a), 0.2, 0.11)
    }
    disc(trim, o, t, S, 16.9, 0, 0.75, 0.11, 10)
    // a small arcade across the front under the wheel window
    for (const s of [-6.0, -4.9, 4.9, 6.0]) opening(win, [CX + s, y], t, S, 0.6, 10.6, 12.0, 'round', 0.05)
  }
  // porches: a tall gabled one with the pointed portal, two lower side ones
  function porch(x0: number, x1: number, zw: number, za: number, portal: boolean) {
    const cx = (x0 + x1) / 2, h = (x1 - x0) / 2, y0 = -33.5
    prism(stone, rect(x0, y0, x1, YF), 0, zw, false)
    for (const s of [-1, 1]) {
      const q: V3[] = [[cx + s * (h + 0.25), y0 - 0.25, zw - 0.2], [cx + s * (h + 0.25), YF, zw - 0.2], [cx, YF, za], [cx, y0 - 0.25, za]]
      poly(roof, q, [s, 0, 1]); poly(roof, q, [-s, 0, -1])
    }
    poly(stone, [[x0, y0, zw], [x1, y0, zw], [cx, y0, za - 0.3]], [0, -1, 0])
    bar(trim, [cx, y0], [1, 0], S, -h - 0.25, zw - 0.2, 0, za, 0.45, 0.1)
    bar(trim, [cx, y0], [1, 0], S, h + 0.25, zw - 0.2, 0, za, 0.45, 0.1)
    if (portal) {
      opening(trim, [cx, y0], [1, 0], S, 5.6, 2.0, 10.0, 'pointed', 0.04)
      opening(stone, [cx, y0], [1, 0], S, 4.4, 2.2, 9.4, 'pointed', 0.06)
      opening(door, [cx, y0], [1, 0], S, 3.4, 2.3, 6.2, 'flat', 0.08)
      bar(trim, [cx, y0], [1, 0], S, 0, 2.3, 0, 6.2, 0.3, 0.1)
    } else {
      opening(trim, [cx, y0], [1, 0], S, 2.5, 2.0, 6.4, 'round', 0.04)
      opening(door, [cx, y0], [1, 0], S, 1.8, 2.3, 5.9, 'round', 0.07)
    }
  }
  porch(-3.6, 4.6, 8.0, 12.2, true)
  porch(-7.1, -3.6, 5.6, 8.3, false)
  porch(4.6, 7.9, 5.6, 8.3, false)
  // the landing the front stairs climb to, and a step
  prism(stone, rect(-7.3, -35.6, 8.1, -33.5), 0, 2.3, true)
  prism(stone, rect(-4.0, -37.0, 5.0, -35.6), 0, 1.2, true)

  // ----------------------------------------------- the transept wings ---
  for (const [x0, x1, n] of [[-14.6, -7.6, W], [8.0, 15.1, E]] as [number, number, XY][]) {
    prism(stone, rect(x0, -2.5, x1, YB), 0, 23.7, false)
    poly(roof, rect(x0, -2.5, x1, YB).map(([x, y]) => [x, y, 23.75] as V3), [0, 0, 1])
    const xo = n[0] < 0 ? x0 : x1, t: XY = [n[1], -n[0]]
    box(trim, (x0 + x1) / 2, (YB - 2.5) / 2, (x1 - x0) / 2 + 0.15, (YB + 2.5) / 2 + 0.15, 23.0, 23.7, false)
    for (const y of [1.2, 8.4]) {
      opening(trim, [xo, y], t, n, 3.2, 8.6, 18.6, 'round', 0.04)
      opening(win, [xo, y], t, n, 2.6, 9.0, 18.2, 'round', 0.07)
      bar(trim, [xo, y], t, n, 0, 9.0, 0, 16.9, 0.18, 0.1)
    }
    // the pinnacled corner buttresses (p11)
    for (const y of [-2.5, YB]) {
      box(stone, xo, y, 0.8, 0.8, 0, 24.5)
      spire(stone, xo, y, 0.85, 24.5, 28.0)
    }
  }

  // ------------------------------------- the chancel gable and the apse ---
  poly(stone, [[NX0, YB, Z_EAVE], [NX1, YB, Z_EAVE], [CX, YB, Z_RIDGE]], [0, 1, 0])
  for (const xe of [NX0, NX1]) bar(trim, [CX, YB], [-1, 0], N, -(xe - CX), Z_EAVE - 0.2, 0, Z_RIDGE + 0.4, 0.6, 0.12)
  for (const xe of [NX0 + 0.3, NX1 - 0.3]) { box(stone, xe, YB, 0.7, 0.7, 0, 22.0); spire(stone, xe, YB, 0.75, 22.0, 25.5) }
  box(trim, CX, YB + 0.2, 0.18, 0.18, Z_RIDGE, Z_RIDGE + 2.0)
  {
    const A: XY[] = [[-6.8, 12.4], [-6.8, 17.7], [-2.6, 22.2], [3.4, 22.1], [7.8, 17.6], [7.8, 12.3]]
    const ZA = 20.0, apex: V3 = [CX + 0.1, 12.4, 28.0]
    prism(stone, A, 0, ZA, false)
    for (let i = 0; i < A.length - 1; i++) {
      const [ax, ay] = A[i], [bx, by] = A[i + 1]
      const mx = (ax + bx) / 2, my = (ay + by) / 2, L = Math.hypot(bx - ax, by - ay)
      const t: XY = [(bx - ax) / L, (by - ay) / L], n: XY = [-t[1], t[0]]
      // eaves and roof
      const e = 0.4
      poly(roof, [[ax + n[0] * e, ay + n[1] * e, ZA - 0.2], [bx + n[0] * e, by + n[1] * e, ZA - 0.2], apex], [n[0], n[1], 1.2])
      // blind arches on the three back faces, a corbel band under the eaves
      if (i >= 1 && i <= 3) {
        opening(trim, [mx, my], t, n, 2.5, 9.5, 17.5, 'round', 0.04)
        opening(stone, [mx, my], t, n, 2.0, 9.6, 17.1, 'round', 0.06)
      }
      opening(trim, [mx, my], t, n, L, ZA - 1.2, ZA - 0.5, 'flat', 0.05)
    }
  }
  // sacristies with pyramidal green roofs, and the flat link round the apse
  for (const [x0, x1] of [[-13.9, -7.5], [8.5, 14.7]]) {
    prism(stone, rect(x0, 12.4, x1, 24.0), 0, 10.6, false)
    const cx = (x0 + x1) / 2, cy = 18.2, hx = (x1 - x0) / 2 + 0.3, hy = 6.1
    const c: V3[] = [[cx - hx, cy - hy, 10.4], [cx + hx, cy - hy, 10.4], [cx + hx, cy + hy, 10.4], [cx - hx, cy + hy, 10.4]]
    const r0: V3 = [cx, cy - 2.5, 14.6], r1: V3 = [cx, cy + 2.5, 14.6]
    poly(roof, [c[0], c[1], r0], [0, -1, 1])
    poly(roof, [c[2], c[3], r1], [0, 1, 1])
    poly(roof, [c[1], c[2], r1, r0], [1, 0, 1]); poly(roof, [c[3], c[0], r0, r1], [-1, 0, 1])
    for (const y of [15.0, 21.0]) opening(win, [x0 < 0 ? x0 : x1, y], [0, x0 < 0 ? -1 : 1], x0 < 0 ? W : E, 1.3, 8.0, 9.8, 'round', 0.05)
  }
  prism(stone, [[-7.5, 12.4], [-6.8, 12.4], [-6.8, 17.7], [-2.6, 22.2], [3.4, 22.1], [7.8, 17.6], [7.8, 12.3], [8.5, 12.3], [8.5, 22.2], [7.0, 22.2], [5.0, 24.1], [-3.9, 24.1], [-5.9, 22.2], [-7.5, 22.2]], 0, 10.2, false)
  poly(roof, ([[-7.5, 22.2, 10.2], [-5.9, 22.2, 10.2], [-3.9, 24.1, 10.2], [5.0, 24.1, 10.2], [7.0, 22.2, 10.2], [8.5, 22.2, 10.2], [7.8, 17.6, 10.2], [3.4, 22.1, 10.2], [-2.6, 22.2, 10.2], [-6.8, 17.7, 10.2]] as V3[]).reverse(), [0, 0, 1])

  // ------------------------------------------------------- the flèche ---
  {
    const cx = CX, cy = 4.8
    roof.loft([ngon(cx, cy, 1.9, 29.0), ngon(cx, cy, 1.9, 36.0), ngon(cx, cy, 2.15, 36.0), ngon(cx, cy, 2.15, 36.5), ngon(cx, cy, 0.08, 44.6)])
    for (let i = 0; i < 8; i += 2) {
      const a = (i / 8) * 2 * Math.PI + Math.PI / 4
      const nn: XY = [Math.cos(a), Math.sin(a)], r = 1.9 * Math.cos(Math.PI / 8)
      opening(win, [cx + nn[0] * r, cy + nn[1] * r], [-nn[1], nn[0]], nn, 0.8, 32.8, 35.4, 'round', 0.04)
    }
    box(trim, cx, cy, 0.1, 0.1, 44.4, 45.5)
    box(trim, cx, cy, 0.4, 0.1, 44.9, 45.1)
  }

  // ----------------------------------------------------- shift, output ---
  const parts = [stone, trim, roof, win, door]
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= 0.4; p.pos[i + 2] -= 4.22 }
  // Night: the front and the towers are floodlit.
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < -14 ? (p[2] > 30 ? 1 : 0.85) : 0.2)
  const out = [
    { part: stone, material: { ...finish('madeleine-sandstone', 0xc4b6a6), floodlight: flood } },
    { part: trim, material: { ...finish('madeleine-sandstone-light', 0xe2d8ca), floodlight: flood } },
    { part: roof, material: finish('madeleine-green-metal', 0x7f978a) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('madeleine-door', 0x8f6e4f) },
  ]
  const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Cathedral of the Madeleine', out, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 49.3,
  })
  await Bun.write(new URL('../models/slc-cathedral-of-the-madeleine.glb', import.meta.url), glb)
  console.log(`slc-cathedral-of-the-madeleine.glb: ${triangles} triangles, ${glb.length} bytes`)
}
