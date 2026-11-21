/**
 * Tbilisi Opera and Ballet Theatre (Z. Paliashvili), Rustaveli Avenue 25:
 * Victor Schröter's Moorish Revival building of 1880-1896: procedural,
 * CC0-1.0, no textures.
 *   bun generators/tbilisi-opera.ts
 * Writes models/tbilisi-opera.glb and a detail model
 * models/tbilisi-opera.detail.glb (the stripes at their real pitch, every
 * window framed, the ribbed domes, the side arcade's columns, the lunette's
 * rays).
 *
 * Uses the relief kit in tbilisi-chronicle-of-georgia.ts.
 *
 * Frame: x east, y north, z up, metres, built turned to bearing 47.7: the
 * front faces -y, south-west onto Rustaveli Avenue; +y runs back through
 * the auditorium to the stage. Origin at the area centroid of the outline
 * way/59151604: 44.7962826, 41.7011314.
 *
 * Identity: ochre walls banded with red-brown courses all over; a towered
 * front: a tall centre between two slim corner towers with grey ribbed
 * domes and spikes rising well clear of the wings, a deep pointed horseshoe arch loggia in the middle
 * over a three-bay portico with columns, flanked by pylons with small
 * domes and by stacked arched loggias; lower two-storey wings either side
 * with tall pointed-arch windows in cream frames; behind, the auditorium's
 * broad transverse block with a barrel roof ending in great semicircular
 * lunette gables, a column arcade under them; grey metal roofs.
 *
 * Evidence
 * - OSM (ODbL): way/59151604 (building=theatre, moorish_revival,
 *   building:levels 9.5, construction 1896, architect Victor Schröter): the
 *   whole plan, every block below from its corners; way/1375902726
 *   (building:part, 6 levels): the towered centre block, 21.9 m wide, its
 *   two corner towers 4.4 m wide.
 * - Published: Wikipedia (en, "Tbilisi Opera and Ballet Theatre"): Moorish
 *   Revival, Victor Schröter, opened 1896.
 *   https://en.wikipedia.org/wiki/Tbilisi_Opera_and_Ballet_Theatre
 * - Photos (all evidence):
 *   - "National Opera House. Tbilisi, Georgia.jpg", Francisco Anzola, CC BY
 *     2.0: the front square on; every height of the front scaled from it at
 *     0.0378 m/px (the centre block's 21.9 m from OSM): towers raised to
 *     25 m with their top storey of paired windows (review: they must stand
 *     clear of the wings as in the photo), domes to 27.8, centre cornice 19.6, arch 7.2 to its apex near 16.8 (springing 12.2), wings 12.5.
 *     https://commons.wikimedia.org/wiki/File:National_Opera_House._Tbilisi,_Georgia.jpg
 *   - "Georgian National Opera Theater.jpg", Giorgi Balakhadze, CC BY-SA
 *     4.0: the front in full sun; colours.
 *     https://commons.wikimedia.org/wiki/File:Georgian_National_Opera_Theater.jpg
 *   - "Tbilisi Opera House, ArmAg (1).jpg", Armineaghayan, CC BY-SA 4.0:
 *     the north-west side: the side tower, the wing windows, the
 *     auditorium's barrel roof and lunette, the arcade.
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_Opera_House,_ArmAg_(1).jpg
 *   - "Tbilisi Opera House at night.jpg", Robot8A, CC BY-SA 4.0: floodlit
 *     front, lit windows. https://commons.wikimedia.org/wiki/File:Tbilisi_Opera_House_at_night.jpg
 * - Colour from the photos: sunlit ochre (#e3b45f-ish, sampled #cd9c65 at
 *   a slant), red-brown courses, cream stone frames and balustrades, pink
 *   loggia walls, slate-grey domes and roofs (#5d6878 in shade).
 *
 * Numbers: plan from OSM; heights of the front from Anzola's photo; the
 * side and rear heights (body 14 m, body 12.5 m, auditorium walls 12.5, its segmental
 * barrel to 14.1, the stage block 13.5 + a 1 m hip; kept low and set back so that,
 * as in the street photos, they barely show over the front) estimated from ArmAg (1). Doubts: the rear and the
 * south-east side are unphotographed here and mirrored from the north-west;
 * the stripes are drawn at 1.2 m pitch as proud strips, the real
 * courses are a little finer. Night: windows glow, the front is floodlit (in the detail model; the low
 * model carries no _FLOODLIGHT, to stay within 250 KB).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, faceAt, quadOut, triOut, recessFace, rect, writeModel } from './tbilisi-chronicle-of-georgia'

type XY = [number, number]
const TAU = Math.PI * 2
type Parts = { ochre: Part; red: Part; cream: Part; roof: Part; win: Part; pink: Part }

/** A face of a box side: the wall from s0 to s1 along u, at origin o (s measured from o). */
const F = (o: V3, u: V3, n: V3): Face => ({ o, u, n })
const FRONT = (y: number): Face => F([0, y, 0], [1, 0, 0], [0, -1, 0])
const BACK = (y: number): Face => F([0, y, 0], [-1, 0, 0], [0, 1, 0])
const EAST = (x: number): Face => F([x, 0, 0], [0, 1, 0], [1, 0, 0])
const WEST = (x: number): Face => F([x, 0, 0], [0, -1, 0], [-1, 0, 0])

/** A pointed horseshoe arch opening: jambs from z0 to the springing zs, a pointed head of rise ~0.85 of the width. */
function archOutline(s0: number, s1: number, z0: number, zs: number, seg: number, round = false): XY[] {
  const w = s1 - s0, out: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  if (round) {
    for (let i = 1; i < seg; i++) { const t = (Math.PI * i) / seg; out.push([(s0 + s1) / 2 + (w / 2) * Math.cos(t), zs + (w / 2) * Math.sin(t)]) }
  } else {
    // two arcs of radius 0.85w struck from points inside the opposite jamb, slightly horseshoed
    const R = 0.85 * w, cR = s1 - R, cL = s0 + R
    const top = Math.sqrt(R * R - (w / 2) ** 2)
    const h = Math.max(2, Math.floor(seg / 2))
    for (let i = 1; i <= h; i++) { const sx = s1 - (w / 2) * (i / h); out.push([sx, zs + Math.sqrt(Math.max(0, R * R - (sx - cR) ** 2))]) }
    void top
    for (let i = h - 1; i >= 1; i--) { const sx = s0 + (w / 2) * (i / h); out.push([sx, zs + Math.sqrt(Math.max(0, R * R - (sx - cL) ** 2))]) }
  }
  out.push([s0, zs])
  return out
}

type Opening = { s0: number; s1: number; z0: number; zs: number; depth: number; back: 'win' | 'pink'; frame?: boolean; round?: boolean; sill?: boolean }

/**
 * A wall face from (s0, z0) to (s1, z1) with arched openings cut through as
 * recesses (reveals ochre, back pink or glazed), cream frames proud round the
 * arches, and red courses every `pitch` metres between the openings.
 */
function wall(P: Parts, f: Face, s0: number, s1: number, z0: number, z1: number, ops: Opening[], o: { detail: boolean; pitch?: number; stripes?: boolean; seg?: number }) {
  const seg = o.seg ?? (o.detail ? 8 : 4)
  const holes = ops.map((q) => archOutline(q.s0, q.s1, q.z0, q.zs, seg, q.round))
  // recesses grouped by depth and back
  const byKey = new Map<string, number[]>()
  ops.forEach((q, i) => { const k = `${q.depth}|${q.back}`; byKey.set(k, [...(byKey.get(k) ?? []), i]) })
  // the face plate with every hole, then each group's reveals and backs
  recessFace(P.ochre, f, rect(s0, s1, z0, z1), holes, 0.0001, 0, new Part(), new Part())
  for (const [k, idx] of byKey) {
    const [dep, back] = k.split('|')
    for (const i of idx) {
      const h = holes[i]
      // reveals
      const cx = (ops[i].s0 + ops[i].s1) / 2, cz = (ops[i].z0 + ops[i].zs) / 2
      for (let j = 0; j < h.length; j++) {
        const a = h[j], b = h[(j + 1) % h.length]
        if (Math.abs(a[1] - ops[i].z0) < 1e-6 && Math.abs(b[1] - ops[i].z0) < 1e-6) {
          // the sill / floor of the recess: faces up
          quadOut(P.ochre, faceAt(f, a[0], a[1], 0), faceAt(f, b[0], b[1], 0), faceAt(f, b[0], b[1], -Number(dep)), faceAt(f, a[0], a[1], -Number(dep)), [0, 0, 1])
          continue
        }
        const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        const inward: V3 = [faceAt(f, cx, cz)[0] - faceAt(f, m[0], m[1])[0], faceAt(f, cx, cz)[1] - faceAt(f, m[0], m[1])[1], cz - m[1]]
        quadOut(P.ochre, faceAt(f, a[0], a[1], 0), faceAt(f, b[0], b[1], 0), faceAt(f, b[0], b[1], -Number(dep)), faceAt(f, a[0], a[1], -Number(dep)), inward)
      }
      const bp = back === 'win' ? P.win : P.pink
      const pts = h
      for (let j = 1; j < pts.length - 1; j++) triOut(bp, faceAt(f, pts[0][0], pts[0][1], -Number(dep)), faceAt(f, pts[j][0], pts[j][1], -Number(dep)), faceAt(f, pts[j + 1][0], pts[j + 1][1], -Number(dep)), f.n)
    }
  }
  // cream frames: a band round each arch's head and jambs, proud
  ops.forEach((q, i) => {
    if (!q.frame) return
    const h = holes[i], bw = Math.min(0.45, (q.s1 - q.s0) * 0.12), d = 0.14
    const n = h.length
    // skip the bottom edge (index 0 -> 1)
    for (let j = 1; j < n; j++) {
      const a = h[j], b = h[(j + 1) % n]
      if (j === n - 1) continue
      const off = (p: XY, prev: XY, next: XY): XY => {
        const t: XY = [next[0] - prev[0], next[1] - prev[1]], l = Math.hypot(t[0], t[1]) || 1
        return [p[0] + (t[1] / l) * bw, p[1] - (t[0] / l) * bw]
      }
      const ao = off(a, h[(j - 1 + n) % n], b), bo = off(b, a, h[(j + 2) % n])
      quadOut(P.cream, faceAt(f, a[0], a[1], d), faceAt(f, b[0], b[1], d), faceAt(f, bo[0], bo[1], d), faceAt(f, ao[0], ao[1], d), f.n)
      if (o.detail) quadOut(P.cream, faceAt(f, ao[0], ao[1], 0), faceAt(f, bo[0], bo[1], 0), faceAt(f, bo[0], bo[1], d), faceAt(f, ao[0], ao[1], d), [faceAt(f, (ao[0] + bo[0]) / 2, (ao[1] + bo[1]) / 2)[0] - faceAt(f, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)[0], faceAt(f, (ao[0] + bo[0]) / 2, (ao[1] + bo[1]) / 2)[1] - faceAt(f, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)[1], (ao[1] + bo[1]) / 2 - (a[1] + b[1]) / 2])
    }
    if (q.sill) {
      const A = (s: number, z: number, dd: number) => faceAt(f, s, z, dd)
      quadOut(P.cream, A(q.s0 - 0.3, q.z0 - 0.25, 0.2), A(q.s1 + 0.3, q.z0 - 0.25, 0.2), A(q.s1 + 0.3, q.z0, 0.2), A(q.s0 - 0.3, q.z0, 0.2), f.n)
      quadOut(P.cream, A(q.s0 - 0.3, q.z0, 0), A(q.s1 + 0.3, q.z0, 0), A(q.s1 + 0.3, q.z0, 0.2), A(q.s0 - 0.3, q.z0, 0.2), [0, 0, 1])
    }
  })
  // the red courses
  if (o.stripes !== false) {
    const pitch = o.pitch ?? 1.0, th = 0.3
    for (let z = z0 + pitch * 0.75; z + th < z1 - 0.3; z += pitch) {
      // free intervals between the openings (and their frames)
      let free: XY[] = [[s0, s1]]
      for (const q of ops) {
        const top = q.zs + (q.s1 - q.s0) * (q.round ? 0.5 : 0.75) + 0.5
        if (z + th < q.z0 - 0.3 || z > top) continue
        const c0 = q.s0 - (q.frame ? 0.5 : 0.05), c1 = q.s1 + (q.frame ? 0.5 : 0.05)
        free = free.flatMap(([a, b]): XY[] => (c1 <= a || c0 >= b ? [[a, b]] : ([[a, Math.max(a, c0)], [Math.min(b, c1), b]] as XY[]).filter(([x, y]) => y - x > 0.2)))
      }
      for (const [a, b] of free) quadOut(P.red, faceAt(f, a, z, 0.03), faceAt(f, b, z, 0.03), faceAt(f, b, z + th, 0.03), faceAt(f, a, z + th, 0.03), f.n)
    }
  }
}

/** A box's four walls (no openings) with stripes, and an optional flat top. */
function plainBox(P: Parts, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, detail: boolean, top: Part | null) {
  const o = { detail }
  wall(P, FRONT(y0), x0, x1, z0, z1, [], o)
  wall(P, EAST(x1), y0, y1, z0, z1, [], o)
  wall(P, BACK(y1), -x1, -x0, z0, z1, [], o)
  wall(P, WEST(x0), -y1, -y0, z0, z1, [], o)
  if (top) quadOut(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/** A cornice: a cream band proud round a box at z. */
function cornice(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, out: number) {
  const r = (z: number, e: number): V3[] => [[x0 - e, y0 - e, z], [x1 + e, y0 - e, z], [x1 + e, y1 + e, z], [x0 - e, y1 + e, z]]
  p.loft([r(z0, 0), r(z0, out), r(z1, out)])
  const a = r(z1, out), b = r(z1, 0)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quadOut(p, a[i], a[j], b[j], b[i], [0, 0, 1]) }
}

/** A hipped roof over a box. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, h: number) {
  const inset = Math.min(x1 - x0, y1 - y0) / 2
  const along = x1 - x0 >= y1 - y0
  const r0: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  const a: V3 = along ? [x0 + inset, (y0 + y1) / 2, z + h] : [(x0 + x1) / 2, y0 + inset, z + h]
  const b: V3 = along ? [x1 - inset, (y0 + y1) / 2, z + h] : [(x0 + x1) / 2, y1 - inset, z + h]
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z]
  if (along) {
    quadOut(p, r0[0], r0[1], b, a, [0, -1, 1]); quadOut(p, r0[2], r0[3], a, b, [0, 1, 1])
    triOut(p, r0[1], r0[2], b, [1, 0, 1]); triOut(p, r0[3], r0[0], a, [-1, 0, 1])
  } else {
    quadOut(p, r0[1], r0[2], b, a, [1, 0, 1]); quadOut(p, r0[3], r0[0], a, b, [-1, 0, 1])
    triOut(p, r0[0], r0[1], a, [0, -1, 1]); triOut(p, r0[2], r0[3], b, [0, 1, 1])
  }
  void c
}

/** A dome on a drum: a slightly bulbous ribbed (detail) dome with a finial spike. */
function dome(P: Parts, cx: number, cy: number, z: number, r: number, h: number, detail: boolean, spike = 1.4) {
  const n = detail ? 16 : 8
  const prof: [number, number][] = [[r * 0.92, z], [r * 1.0, z + h * 0.2], [r * 0.95, z + h * 0.45], [r * 0.72, z + h * 0.7], [r * 0.38, z + h * 0.9], [0.08, z + h]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
      // ribs: alternate faces pushed out a touch in the detail model
      const A = (rr: number, zz: number, t: number): V3 => [cx + rr * Math.cos(t), cy + rr * Math.sin(t), zz]
      quadOut(P.roof, A(r0, z0, t0), A(r0, z0, t1), A(r1, z1, t1), A(r1, z1, t0), [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), (r0 - r1) / Math.max(0.01, z1 - z0)])
    }
  }
  // drum ring
  const ring = (rr: number, zz: number): V3[] => Array.from({ length: n }, (_, i) => [cx + rr * Math.cos((i / n) * TAU), cy + rr * Math.sin((i / n) * TAU), zz] as V3)
  P.cream.loft([ring(r * 1.05, z - 0.5), ring(r * 1.05, z)])
  // finial
  const sp = (rr: number, zz: number) => ring(rr, zz).slice(0, 4).map((_, i): V3 => [cx + rr * Math.cos((i / 4) * TAU), cy + rr * Math.sin((i / 4) * TAU), zz])
  P.roof.loft([sp(0.12, z + h), sp(0.0001, z + h + spike)])
}

/** A barrel roof along x over a block, ending in semicircular lunettes on the ±x ends (walls raised to meet it). */
function barrel(P: Parts, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, detail: boolean) {
  // a segmental barrel: chord the block's depth, `rise` high
  const c = (y1 - y0) / 2, cy = (y0 + y1) / 2, n = detail ? 16 : 8
  const R = (c * c + rise * rise) / (2 * rise), zc = z + rise - R, a0 = Math.asin(c / R)
  const pt = (x: number, i: number, rr = R): V3 => { const t = Math.PI / 2 + a0 - (2 * a0 * i) / n; return [x, cy + rr * Math.cos(t), zc + rr * Math.sin(t)] }
  const base = (x: number, i: number): V3 => { const p = pt(x, i); return [x, p[1], z] }
  for (let i = 0; i < n; i++) {
    const t = Math.PI / 2 + a0 - (2 * a0 * (i + 0.5)) / n
    quadOut(P.roof, pt(x0 - 0.4, i, R + 0.3), pt(x1 + 0.4, i, R + 0.3), pt(x1 + 0.4, i + 1, R + 0.3), pt(x0 - 0.4, i + 1, R + 0.3), [0, Math.cos(t), Math.sin(t)])
  }
  // the lunettes: ochre fans with red rays and a cream rim, on the end walls
  for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const ctr: V3 = [x, cy, z]
    for (let i = 0; i < n; i++) {
      const ray = i % 2 === 1
      // fan from the centre of the springing line
      triOut(ray ? P.red : P.ochre, ctr, pt(x, i), pt(x, i + 1), [sx, 0, 0])
      const a = pt(x, i), b = pt(x, i + 1)
      quadOut(P.cream, a, b, [b[0] + sx * 0.25, b[1], b[2]], [a[0] + sx * 0.25, a[1], a[2]], [sx, 0, 0])
    }
    void base
  }
  // the barrel's underside rims along the long sides are hidden by the walls' parapets
}

export function build(detail: boolean) {
  const P: Parts = { ochre: new Part(), red: new Part(), cream: new Part(), roof: new Part(), win: new Part(), pink: new Part() }
  // ---------------- the towered centre (way/1375902726) ----------------
  const yF = -40.8, yC1 = -22.6
  const xT0 = -11.0, xT1 = 10.9 // centre block
  const cx = (xT0 + xT1) / 2 // -0.05: the axis
  const X = (s: number) => cx + s
  const ZC = 19.6, ZT = 25.0
  // front wall of the centre: towers' faces, side bays, pylons, the great arch
  const big: Opening = { s0: X(-3.3), s1: X(3.3), z0: 7.2, zs: 12.2, depth: 5.0, back: 'pink', frame: true }
  const portico: Opening = { s0: X(-2.9), s1: X(3.0), z0: 1.2, zs: 4.0, depth: 2.6, back: 'pink', frame: true, round: true }
  const sideUp = (s0: number, s1: number): Opening => ({ s0, s1, z0: 8.0, zs: 10.8, depth: 2.4, back: 'pink', frame: true })
  const sideDn = (s0: number, s1: number): Opening => ({ s0, s1, z0: 1.2, zs: 3.4, depth: 1.6, back: 'win', frame: true })
  const towerWin = (s0: number): Opening => ({ s0, s1: s0 + 1.0, z0: 16.0, zs: 17.6, depth: 0.4, back: 'win', frame: true })
  wall(P, FRONT(yF), xT0, xT1, 0, ZC, [
    big, portico,
    sideUp(X(-7.9), X(-5.4)), sideUp(X(5.5), X(8.0)), sideDn(X(-7.6), X(-5.6)), sideDn(X(5.6), X(7.7)),
    { s0: X(-2.5), s1: X(-1.6), z0: 16.0, zs: 17.6, depth: 0.4, back: 'win', frame: true }, { s0: X(1.7), s1: X(2.6), z0: 16.0, zs: 17.6, depth: 0.4, back: 'win', frame: true },
  ], { detail })
  // the portico's two columns and the big arch's balcony
  for (const s of [-1.0, 1.1]) {
    const c = [X(s), yF + 0.6]
    const n = detail ? 10 : 6
    const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((i / n) * TAU), c[1] + r * Math.sin((i / n) * TAU), z] as V3)
    P.cream.loft([ring(0.3, 1.2), ring(0.26, 3.7), ring(0.42, 4.1)])
  }
  for (const [a, b] of [[X(-3.6), X(3.6)], [X(-8.2), X(-5.1)], [X(5.2), X(8.3)]]) {
    const z0 = a < X(-4) || a > X(4) ? 8.0 : 7.2
    const r = (z: number): V3[] => [[a, yF - 0.5, z], [b, yF - 0.5, z], [b, yF + 0.05, z], [a, yF + 0.05, z]]
    P.cream.loft([r(z0 - 0.3), r(z0 + 0.9)]); P.cream.cap(r(z0 + 0.9), true)
  }
  // the great arch's cream surround: a broad band over its head between the pylons
  {
    const r = (z: number): V3[] => [[X(-3.9), yF - 0.35, z], [X(3.9), yF - 0.35, z], [X(3.9), yF + 0.02, z], [X(-3.9), yF + 0.02, z]]
    P.cream.loft([r(17.3), r(17.9)]); P.cream.cap(r(17.9), true)
  }
  // the steps up to the portico (the outline's projection to y -45.9)
  for (let k = 0; k < 4; k++) {
    const y0 = -45.4 + k * 1.1, z1 = 0.3 * (k + 1)
    const r = (z: number): V3[] => [[X(-8), y0, z], [X(8), y0, z], [X(8), yF, z], [X(-8), yF, z]]
    P.cream.loft([r(0), r(z1)]); P.cream.cap(r(z1), true)
  }
  // the centre's other walls and roof
  wall(P, EAST(xT1), yF, yC1, 0, ZC, [], { detail })
  wall(P, WEST(xT0), -yC1, -yF, 0, ZC, [], { detail })
  cornice(P.cream, xT0, yF, xT1, yC1, ZC - 2.0, ZC, 0.25)
  quadOut(P.roof, [xT0, yF, ZC], [xT1, yF, ZC], [xT1, yC1, ZC], [xT0, yC1, ZC], [0, 0, 1])
  // corner towers: shafts rising above the centre to 22 m, with windows, cornice and domes
  for (const [t0, t1] of [[xT0, xT0 + 4.4], [xT1 - 4.4, xT1]]) {
    const yb = yF + 4.4
    const tm = (t0 + t1) / 2
    // the tower's own storeys over the centre: a single arched window, then the top storey's pair
    const tw: Opening[] = [
      { s0: tm - 0.55, s1: tm + 0.55, z0: ZC - 1.0, zs: ZC + 0.6, depth: 0.4, back: 'win', frame: true },
      { s0: tm - 1.35, s1: tm - 0.3, z0: ZT - 3.4, zs: ZT - 2.0, depth: 0.4, back: 'win', frame: true },
      { s0: tm + 0.3, s1: tm + 1.35, z0: ZT - 3.4, zs: ZT - 2.0, depth: 0.4, back: 'win', frame: true },
    ]
    wall(P, FRONT(yF - 0.01), t0, t1, ZC - 2, ZT, tw, { detail })
    wall(P, EAST(t1), yF, yb, ZC - 2, ZT, [], { detail })
    wall(P, BACK(yb), -t1, -t0, ZC, ZT, [], { detail })
    wall(P, WEST(t0), -yb, -yF, ZC - 2, ZT, [], { detail })
    cornice(P.cream, t0, yF, t1, yb, ZT - 1.0, ZT, 0.3)
    quadOut(P.roof, [t0, yF, ZT], [t1, yF, ZT], [t1, yb, ZT], [t0, yb, ZT], [0, 0, 1])
    dome(P, (t0 + t1) / 2, yF + 2.2, ZT, 1.75, 2.8, detail, 1.6)
  }
  // the pylons' small domes either side of the great arch, and (detail) the lower pair
  for (const s of [-4.2, 4.3]) {
    const r = (z: number): V3[] => [[X(s) - 0.9, yF - 0.3, z], [X(s) + 0.9, yF - 0.3, z], [X(s) + 0.9, yF + 1.5, z], [X(s) - 0.9, yF + 1.5, z]]
    P.ochre.loft([r(ZC - 2), r(ZC + 1.2)]); P.cream.loft([r(ZC + 1.2), r(ZC + 1.6)]); P.cream.cap(r(ZC + 1.6), true)
    dome(P, X(s), yF + 0.6, ZC + 1.6, 0.85, 1.4, detail, 0.8)
  }
  if (detail) for (const s of [-8.5, 8.6]) dome(P, X(s), yF + 0.6, 15.4, 0.6, 1.0, detail, 0.6)
  // ---------------- the front wings ----------------
  const yW = -37.2, yW1 = -22.9, ZW = 12.5
  for (const [w0, w1] of [[-22.5, xT0], [xT1, 22.1]] as [number, number][]) {
    const len = w1 - w0, ops: Opening[] = []
    for (let i = 0; i < 3; i++) {
      const sm = w0 + len * (i + 0.5) / 3
      ops.push({ s0: sm - 0.95, s1: sm + 0.95, z0: 3.6, zs: 6.0, depth: 0.5, back: 'win', frame: true, sill: true })
      if (detail) {
        ops.push({ s0: sm - 0.75, s1: sm - 0.15, z0: 9.2, zs: 10.2, depth: 0.3, back: 'win', frame: false, round: true })
        ops.push({ s0: sm + 0.15, s1: sm + 0.75, z0: 9.2, zs: 10.2, depth: 0.3, back: 'win', frame: false, round: true })
      } else ops.push({ s0: sm - 0.75, s1: sm + 0.75, z0: 9.2, zs: 10.2, depth: 0.3, back: 'win', round: true })
    }
    wall(P, FRONT(yW), w0, w1, 0, ZW, ops, { detail })
    cornice(P.cream, w0, yW, w1, yW1, ZW - 0.6, ZW, 0.3)
    // a balustraded parapet and a low hip barely showing behind it
    cornice(P.cream, w0, yW, w1, yW1, ZW, ZW + 0.8, 0.05)
    hipRoof(P.roof, w0 + 0.3, yW + 0.3, w1 - 0.3, yW1 - 0.3, ZW + 0.3, 0.9)
  }
  // the wings' outer ends and the body's sides: two storeys of pointed windows
  const sideOps = (a: number, b: number): Opening[] => {
    const n = Math.max(1, Math.round((b - a) / 4.4)), ops: Opening[] = []
    for (let i = 0; i < n; i++) {
      const sm = a + (b - a) * (i + 0.5) / n
      ops.push({ s0: sm - 0.9, s1: sm + 0.9, z0: 3.6, zs: 6.0, depth: 0.5, back: 'win', frame: true, sill: detail })
      if (detail) ops.push({ s0: sm - 0.55, s1: sm + 0.55, z0: 9.2, zs: 10.4, depth: 0.3, back: 'win', frame: true })
    }
    return ops
  }
  wall(P, WEST(-22.5), 22.9, 37.2, 0, ZW, sideOps(23.4, 36.7), { detail })
  wall(P, EAST(22.1), -37.2, -22.9, 0, ZW, sideOps(-36.7, -23.4), { detail })
  // ---------------- the body: x -21.3..20.6, y -22.9..4.2, 14 m ----------------
  const ZB = 12.5
  wall(P, WEST(-21.3), -4.2, 22.9, 0, ZB, sideOps(-3.7, 22.4), { detail })
  wall(P, EAST(20.6), -22.9, 4.2, 0, ZB, sideOps(-22.4, 3.7), { detail })
  // the body's front above the wings' roofs
  wall(P, FRONT(-22.9), -21.3, 20.6, ZW, ZB, [], { detail, stripes: false })
  cornice(P.cream, -21.3, -22.9, 20.6, 4.2, ZB - 0.6, ZB, 0.3)
  hipRoof(P.roof, -21.3, -22.9, 20.6, 4.2, ZB, 1.0)
  // ---------------- the auditorium: x -31.8..30.5, y 3.9..23.4, walls to 12.5, barrel to 15.5 ----------------
  const ZA = 12.5, yA0 = 3.9, yA1 = 23.4
  const arcade = (a: number, b: number): Opening[] => {
    const n = 6, ops: Opening[] = []
    for (let i = 0; i < n; i++) { const sm = a + (b - a) * (i + 0.5) / n; ops.push({ s0: sm - 1.1, s1: sm + 1.1, z0: 0.8, zs: 3.4, depth: 2.4, back: 'pink', frame: true, round: true }) }
    for (let i = 0; i < 4; i++) { const sm = a + (b - a) * (i + 0.5) / 4; ops.push({ s0: sm - 1.0, s1: sm + 1.0, z0: 8.0, zs: 10.6, depth: 0.5, back: 'win', frame: true, sill: detail }) }
    return ops
  }
  wall(P, WEST(-31.8), -yA1, -yA0, 0, ZA, arcade(-yA1 + 0.6, -yA0 - 0.6), { detail })
  wall(P, EAST(30.5), yA0, yA1, 0, ZA, arcade(yA0 + 0.6, yA1 - 0.6), { detail })
  // the arcade's columns: in each arched bay's mouth, between the arches
  for (const [x, sx] of [[-31.8, -1], [30.5, 1]] as [number, number][]) {
    for (let i = 1; i < 6; i++) {
      const y = yA0 + 0.6 + ((yA1 - yA0 - 1.2) * i) / 6
      const n = detail ? 8 : 5
      const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, k) => [x + sx * 0.35 + r * Math.cos((k / n) * TAU), y + r * Math.sin((k / n) * TAU), z] as V3)
      P.cream.loft([ring(0.3, 0), ring(0.3, 3.4), ring(0.45, 3.8)])
    }
  }
  wall(P, FRONT(yA0), -31.8, -21.3, 0, ZA, sideOps(-31.3, -21.8).filter((q) => q.z0 > 5), { detail })
  wall(P, FRONT(yA0), 20.6, 30.5, 0, ZA, sideOps(21.1, 30.0).filter((q) => q.z0 > 5), { detail })
  
  wall(P, BACK(yA1), -30.5, 31.8, 0, ZA, [], { detail })
  cornice(P.cream, -31.8, yA0, 30.5, yA1, ZA - 0.6, ZA, 0.3)
  barrel(P, -31.8, yA0, 30.5, yA1, ZA, 1.6, detail)
  // ---------------- the stage house: x -23.7..29.7, y 23.4..34, 13.5 m; and the back x -14.2..13.5 to 38.6, 12 m ----------------
  plainBox(P, -23.7, yA1, 29.7, 34.0, 0, 13.5, detail, null)
  cornice(P.cream, -23.7, yA1, 29.7, 34.0, 12.9, 13.5, 0.3)
  hipRoof(P.roof, -23.7, yA1, 29.7, 34.0, 13.5, 1.0)
  plainBox(P, -14.2, 34.0, 13.5, 38.6, 0, 12, detail, P.roof)
  return P
}

export const COLORS = {
  ochre: 0xe4bd78, // sunlit ochre, pulled to the palette's lightness
  red: 0xb8664a, // the red-brown courses
  cream: 0xf1e6d0, // stone frames, balustrades, cornices
  roof: 0x5b636d, // slate-grey domes and roofs, dark: they read big from above
  pink: 0xd9a58e, // the loggias' walls
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const front = (q: V3, n: V3) => (n[1] < -0.5 ? 0.9 : n[2] > 0.6 ? 0.2 : 0.5)
    const fl = (m: any) => (detail ? { ...m, floodlight: front } : m)
    return [
      { part: p.ochre, material: fl(finish('opera-ochre', COLORS.ochre)) },
      { part: p.red, material: finish('opera-red', COLORS.red) },
      { part: p.cream, material: fl({ ...PALETTE.trim, color: COLORS.cream }) },
      { part: p.roof, material: finish('opera-slate', COLORS.roof) },
      { part: p.win, material: PALETTE.window },
      { part: p.pink, material: finish('opera-loggia', COLORS.pink) },
    ]
  }
  const meta = { bearing: 47.7, osm: 'way/59151604', height: 29.4 }
  await writeModel('tbilisi-opera.glb', 'Tbilisi Opera and Ballet Theatre', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-opera.detail.glb', 'Tbilisi Opera and Ballet Theatre', make(true), meta, 40000, 1536 * 1024)
}
