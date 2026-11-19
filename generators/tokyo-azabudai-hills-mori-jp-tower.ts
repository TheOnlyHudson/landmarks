/**
 * Azabudai Hills Mori JP Tower (麻布台ヒルズ森JPタワー), Azabudai, Minato,
 * Tokyo: procedural, CC0-1.0.  bun generators/tokyo-azabudai-hills-mori-jp-tower.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Also exports the curved-tower kit (`Ring`, `wall`, `band`, `fin`, ...) the
 * other Roppongi/Toranomon towers in this batch use; merge this file first.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Completed 2023 (Pelli Clarke & Partners, Mori Building); 64 floors; roof
 * 325.2 m (OSM height 325.2; Wikipedia "Azabudai Hills": 325.24 m, the
 * tallest building in Japan).
 *
 * Plan (OSM way/1158739441, the only OSM building for the tower, replaced):
 * a square of about 77 x 78 m set at bearing 31, its corners rounded, and
 * each face folded inward along a vertical crease at its middle: in the
 * model frame the creases sit at x = -33.5 / +34.9 and y = -35.6 / +34.2
 * while the faces' ends reach about +-38.7 (OSM). Drawn symmetric: crease
 * 34.6 m from the centre, the half-faces bowing gently out to 38.7 m, corner
 * radius 8 m (estimated from the outline's corner points).
 *
 * From photos:
 * - each face's crease is a pale vertical line from the foot to the crown,
 *   lit white at night (Kakidai 2024 (2), Suicasmo's night view);
 * - the crown: the roof edge rises over each half-face like a petal, dips in
 *   a V at the crease (about 6 m) and rolls down over the rounded corners
 *   (about 5 m) (Kakidai 2024 (2) face-on, Syced from Roppongi Hills and
 *   the Skydeck, February 2023); the rim is lit white at night;
 * - the foot is pinched: the faces curve in over the lowest ~50 m to about
 *   92% (Kakidai 2024 (2)); estimated from that photo;
 * - the curtain wall is blue-grey glass under fine white horizontal fins at
 *   every floor; drawn as pale bands every three floors (15.2 m) in the low
 *   model and 3D fins every two floors in the detail;
 * - a darker plant band at about 84% of the height (Syced, February 2023) is
 *   left out: it barely shows in the other photos and read too strong.
 * Colours (daylight): glass from #5f7486 (overcast, Skydeck) to #8fa6b8
 * (sunny, Kakidai); drawn `window` #7d93a5 so it reads silver-blue; fins
 * #e6eaec.
 *
 * Frame: built turned to bearing 31 (the faces). Origin at 139.7406598,
 * 35.6608484, the outline's centroid; y = 0 is the ground (the site is flat
 * to within 1.5 m on the map's terrain).
 *
 * Photos (Wikimedia Commons):
 * - "2024 Azabudai Hills Mori JP Tower (2).jpg", Kakidai, CC BY-SA 4.0
 * - "2024 Azabudai Hills Mori JP Tower (3).jpg", Kakidai, CC BY-SA 4.0
 * - "Azabudai Hills JP Tower seen from Roppongi Hills.jpg", Syced, CC0
 * - "Azabudai Hills Mori JP Tower from Skydeck, May 2023.jpg", Syced, CC0
 * - "Azabudai Hills Mori JP Tower, February 2023.jpg", Syced, CC0
 * - "Azabudai Hills Mori JP Tower 20240329.jpg", Suicasmo, CC0 (night)
 * No lidar (Japan). No look-only sources.
 * Doubts: the crown's dips and the foot's pinch are read from photos taken
 * from below or far away (estimated to a few metres); the creases are drawn
 * on the faces' mid-lines although OSM puts them up to 2 m off centre.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

// ---------------------------------------------------------------- the kit ---
/**
 * A closed plan ring that can change with height: `at(z)` gives the same
 * number of points at every height, counter-clockwise from above, and
 * `crease[i]` marks a point where the wall folds (its two sides keep their
 * own normals); elsewhere the wall is smooth-shaded.
 */
export type Ring = { n: number; at: (z: number) => XY[]; crease: (i: number) => boolean }

const nrm2 = (a: XY, b: XY): XY => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l] }
/** Per point: the normal of the segment before it and after it (equal unless a crease). */
export function normals(r: XY[], crease: (i: number) => boolean): { l: XY; r: XY }[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const nl = nrm2(a, p), nr = nrm2(p, b)
    if (crease(i)) return { l: nl, r: nr }
    const s: XY = [nl[0] + nr[0], nl[1] + nr[1]], l = Math.hypot(s[0], s[1]) || 1
    return { l: [s[0] / l, s[1] / l], r: [s[0] / l, s[1] / l] }
  })
}
const v3 = (p: XY, z: number, n?: XY, out = 0): V3 => [p[0] + (n ? n[0] * out : 0), p[1] + (n ? n[1] * out : 0), z]
const n3 = (n: XY): V3 => [n[0], n[1], 0]
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc: V3, nd: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
}

/**
 * The ring's walls between successive heights `zs`, segment by segment;
 * `top(i)`, when given, replaces the last height per point (a shaped roof
 * edge). `pick(i)` chooses the part for segment i (default `p`).
 */
export function wall(p: Part, ring: Ring, zs: number[], o: { top?: (i: number) => number; pick?: (i: number) => Part | null } = {}) {
  for (let k = 0; k < zs.length - 1; k++) {
    const r0 = ring.at(zs[k]), r1 = ring.at(zs[k + 1]), n0 = normals(r0, ring.crease), n1 = normals(r1, ring.crease)
    const last = k === zs.length - 2
    for (let i = 0; i < ring.n; i++) {
      const j = (i + 1) % ring.n
      const part = o.pick ? o.pick(i) : p
      if (!part) continue
      const zi = last && o.top ? o.top(i) : zs[k + 1], zj = last && o.top ? o.top(j) : zs[k + 1]
      const ti = last && o.top ? ring.at(zi)[i] : r1[i], tj = last && o.top ? ring.at(zj)[j] : r1[j]
      quadN(part, v3(r0[i], zs[k]), v3(r0[j], zs[k]), v3(tj, zj), v3(ti, zi), n3(n0[i].r), n3(n0[j].l), n3(n1[j].l), n3(n1[i].r))
    }
  }
}

/**
 * A flush band round the ring from z0 to z1, `out` proud of the wall (a
 * colour band: fins, floor lines). Skips segments where `keep(i)` is false
 * and stops under a shaped top (`top(i)`).
 */
export function band(p: Part, ring: Ring, z0: number, z1: number, out = 0.08, o: { keep?: (i: number) => boolean; top?: (i: number) => number } = {}) {
  const r0 = ring.at(z0), r1 = ring.at(z1), n0 = normals(r0, ring.crease), n1 = normals(r1, ring.crease)
  for (let i = 0; i < ring.n; i++) {
    const j = (i + 1) % ring.n
    if (o.keep && !o.keep(i)) continue
    if (o.top && (z1 > o.top(i) - 0.3 || z1 > o.top(j) - 0.3)) continue
    quadN(p, v3(r0[i], z0, n0[i].r, out), v3(r0[j], z0, n0[j].l, out), v3(r1[j], z1, n1[j].l, out), v3(r1[i], z1, n1[i].r, out),
      n3(n0[i].r), n3(n0[j].l), n3(n1[j].l), n3(n1[i].r))
  }
}

/**
 * A projecting fin round the ring at height z: `depth` out from the wall,
 * `thick` tall, with its top, bottom and outer faces (a real 3D ledge).
 */
export function fin(p: Part, ring: Ring, z: number, depth: number, thick: number, o: { keep?: (i: number) => boolean; top?: (i: number) => number } = {}) {
  const r = ring.at(z), n = normals(r, ring.crease), z1 = z + thick
  for (let i = 0; i < ring.n; i++) {
    const j = (i + 1) % ring.n
    if (o.keep && !o.keep(i)) continue
    if (o.top && (z1 > o.top(i) - 0.3 || z1 > o.top(j) - 0.3)) continue
    const ai = v3(r[i], z, n[i].r, 0), aj = v3(r[j], z, n[j].l, 0)
    const bi = v3(r[i], z, n[i].r, depth), bj = v3(r[j], z, n[j].l, depth)
    const up = (q: V3): V3 => [q[0], q[1], z1]
    quadN(p, bi, bj, up(bj), up(bi), n3(n[i].r), n3(n[j].l), n3(n[j].l), n3(n[i].r))
    p.quad(up(ai), up(bi), up(bj), up(aj))
    p.quad(ai, aj, bj, bi)
  }
}

/** A vertical flush strip `w` wide centred on ring point i, from z0 to z1 (a mullion line, a crease). */
export function strip(p: Part, ring: Ring, i: number, w: number, zs: number[], out = 0.1) {
  for (let k = 0; k < zs.length - 1; k++) {
    for (const zz of [[zs[k], zs[k + 1]]]) {
      const [z0, z1] = zz
      const pts = (z: number) => {
        const r = ring.at(z), n = ring.n, a = r[(i + n - 1) % n], b = r[i], c = r[(i + 1) % n]
        const nn = normals(r, ring.crease)[i]
        const ua = unit2([a[0] - b[0], a[1] - b[1]]), uc = unit2([c[0] - b[0], c[1] - b[1]])
        return { a: v3([b[0] + ua[0] * w / 2, b[1] + ua[1] * w / 2], z, nn.l, out), b: v3(b, z, unit2([nn.l[0] + nn.r[0], nn.l[1] + nn.r[1]]), out * 1.4), c: v3([b[0] + uc[0] * w / 2, b[1] + uc[1] * w / 2], z, nn.r, out), nl: nn.l, nr: nn.r }
      }
      const P0 = pts(z0), P1 = pts(z1)
      quadN(p, P0.a, P0.b, P1.b, P1.a, n3(P0.nl), n3(P0.nl), n3(P1.nl), n3(P1.nl))
      quadN(p, P0.b, P0.c, P1.c, P1.b, n3(P0.nr), n3(P0.nr), n3(P1.nr), n3(P1.nr))
    }
  }
}
const unit2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }

/** A cap over the ring at per-point heights, as a fan to an inner ring `k` smaller at height zIn, then flat. */
export function sunkenRoof(rim: Part, roof: Part, ring: Ring, top: (i: number) => number, k: number, zIn: number) {
  const zr = Math.min(...Array.from({ length: ring.n }, (_, i) => top(i)))
  const r = ring.at(zr), c = centroid(r)
  const inner = r.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as XY)
  for (let i = 0; i < ring.n; i++) {
    const j = (i + 1) % ring.n
    const ti = ring.at(top(i))[i], tj = ring.at(top(j))[j]
    rim.quad(v3(ti, top(i)), v3(tj, top(j)), v3(inner[j], zIn), v3(inner[i], zIn))
  }
  for (const [a, b, cc] of earcut(inner)) roof.tri(v3(inner[a], zIn), v3(inner[b], zIn), v3(inner[cc], zIn))
}
export function centroid(r: XY[]): XY {
  let A = 0, x = 0, y = 0
  r.forEach((p, i) => { const q = r[(i + 1) % r.length], c = p[0] * q[1] - q[0] * p[1]; A += c; x += (p[0] + q[0]) * c; y += (p[1] + q[1]) * c })
  return [x / (3 * A), y / (3 * A)]
}
export const smooth = (t: number) => { const u = Math.max(0, Math.min(1, t)); return u * u * (3 - 2 * u) }

// ------------------------------------------------------------- the tower ---
const HT = 325.2   // roof crest (published)
const A = 34.6     // crease distance from the centre (OSM)
const H = 38.7     // the faces' ends (OSM)
const R = 8        // corner radius (OSM, estimated)
const BOW = 0.45   // the half-faces' outward bow (photos, estimated)
const FLOOR = HT / 64
const CREASE_DIP = 6, CORNER_DIP = 3.5

type Lod = { detail: boolean; seg: number; arc: number }
const LOW: Lod = { detail: false, seg: 5, arc: 4 }
const DETAIL: Lod = { detail: true, seg: 8, arc: 8 }

/** One quarter's points (east face's crease, round the NE corner, to just before the north face's crease) with the crown's height factor. */
function quarter(L: Lod): { p: XY; crease: boolean; dip: number }[] {
  const out: { p: XY; crease: boolean; dip: number }[] = []
  const S = H - R
  const crown = (t: number) => {
    // the edge's drop below HT over a half-face: deepest at the crease (t = 0), level from t = 0.8 to the corner's start
    const u = Math.max(0, 1 - t / 0.8)
    return CREASE_DIP * Math.pow(u, 1.5)
  }
  // the east face's northern half, crease (s = 0) to the corner's start (s = S)
  for (let k = 0; k < L.seg; k++) {
    const t = k / L.seg
    const x = A + (H - A) * (t + BOW * t * (1 - t))
    out.push({ p: [x, t * S], crease: k === 0, dip: crown(t) })
  }
  // the corner arc, centre (S, S)
  for (let k = 0; k <= L.arc; k++) {
    const a = (k / L.arc) * (Math.PI / 2), m = Math.sin(2 * a) // 0 at the arc's ends, 1 at the diagonal: the corner rolls over
    out.push({ p: [S + R * Math.cos(a), S + R * Math.sin(a)], crease: false, dip: CORNER_DIP * m * m })
    void m
  }
  // the north face's eastern half, corner's start back to (not including) its crease
  for (let k = L.seg - 1; k >= 1; k--) {
    const t = k / L.seg
    const y = A + (H - A) * (t + BOW * t * (1 - t))
    out.push({ p: [t * S, y], crease: false, dip: crown(t) })
  }
  return out
}

function plan(L: Lod) {
  const q = quarter(L)
  const pts: { p: XY; crease: boolean; dip: number }[] = []
  for (let k = 0; k < 4; k++) {
    const c = Math.cos((k * Math.PI) / 2), s = Math.sin((k * Math.PI) / 2)
    for (const e of q) pts.push({ ...e, p: [e.p[0] * c - e.p[1] * s, e.p[0] * s + e.p[1] * c] })
  }
  // the east face's southern half came last (as the fourth quarter's tail); the ring starts on a crease
  return pts
}

/** The foot's pinch: 0.92 at the ground, easing out to 1 by 52 m. */
const scaleAt = (z: number) => 0.92 + 0.08 * smooth(z / 52)

function build(L: Lod): Layer[] {
  const glass = new Part(), fins = new Part(), lit = new Part(), roof = new Part(), door = new Part()
  const P = plan(L)
  const ring: Ring = { n: P.length, crease: (i) => P[i].crease, at: (z) => { const s = scaleAt(z); return P.map((e) => [e.p[0] * s, e.p[1] * s] as XY) } }
  const top = (i: number) => HT - P[i].dip
  const zs = [0, 13, 26, 39, 52, 120, 200, 270]
  // the glass walls, to the shaped crown edge
  wall(glass, ring, zs, { top })
  // the fins: pale bands every three floors (low), 3D fins every two floors (detail)
  if (!L.detail) {
    for (let f = 3; f < 64; f += 3) {
      const z = f * FLOOR
      band(fins, ring, z - 0.45, z + 0.45, 0.08, { top })
    }
  } else {
    for (let f = 2; f < 64; f += 2) {
      const z = f * FLOOR
      fin(fins, ring, z - 0.2, 0.55, 0.4, { top })
    }
  }
  // the creases' pale lines, lit at night, foot to crown
  const creases = P.map((e, i) => (e.crease ? i : -1)).filter((i) => i >= 0)
  for (const i of creases) strip(lit, ring, i, L.detail ? 1.4 : 2.2, [0, 13, 26, 39, 52, 200, top(i) - 0.2], L.detail ? 0.7 : 0.14)
  // the crown's rim: a lit band just under the edge, following it
  {
    const r = ring.at(HT), n = normals(r, ring.crease)
    for (let i = 0; i < ring.n; i++) {
      const j = (i + 1) % ring.n
      const zi = top(i), zj = top(j), d = L.detail ? 0.6 : 0.15
      quadN(lit, v3(r[i], zi - 1.6, n[i].r, d), v3(r[j], zj - 1.6, n[j].l, d), v3(r[j], zj, n[j].l, d), v3(r[i], zi, n[i].r, d), n3(n[i].r), n3(n[j].l), n3(n[j].l), n3(n[i].r))
      if (L.detail) lit.quad(v3(r[i], zi, n[i].r, 0), v3(r[i], zi, n[i].r, d), v3(r[j], zj, n[j].l, d), v3(r[j], zj, n[j].l, 0))
    }
  }
  // the roof: the parapet's inner face falls to a sunken flat roof with the plant on it
  sunkenRoof(glass, roof, ring, top, 0.88, HT - 9)
  {
    // rooftop plant and lift housings, kept below the crease dips so the crown's outline stays clean
    const hx = 14, hy = 14, z0 = HT - 9, z1 = HT - 6.5
    const r: XY[] = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
    for (let i = 0; i < 4; i++) { const a = r[i], b = r[(i + 1) % 4]; roof.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
    roof.quad([r[0][0], r[0][1], z1], [r[1][0], r[1][1], z1], [r[2][0], r[2][1], z1], [r[3][0], r[3][1], z1])
  }
  // the entrances: a lit glazed lobby band, the lowest 7 m, on each face's middle
  for (let k = 0; k < 4; k++) {
    const c = Math.cos((k * Math.PI) / 2), s = Math.sin((k * Math.PI) / 2), sc = scaleAt(0)
    const rot = (x: number, y: number): XY => [(x * c - y * s) * sc, (x * s + y * c) * sc]
    const xa = A + 0.15 + (H - A) * 0.05
    for (const [y0, y1] of [[-13, -2], [2, 13]]) {
      const x0 = A + (H - A) * ((Math.abs(y0) / (H - R)) * (1 + BOW * (1 - Math.abs(y0) / (H - R)))) + 0.15
      const x1 = A + (H - A) * ((Math.abs(y1) / (H - R)) * (1 + BOW * (1 - Math.abs(y1) / (H - R)))) + 0.15
      void xa
      const a = rot(x0, y0), b = rot(x1, y1)
      door.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 6.5], [a[0], a[1], 6.5])
    }
  }
  return [
    { part: glass, material: { name: 'window', color: 0x8297a9, roughness: 0.3 } },
    { part: fins, material: finish('jp-fin', 0xe6eaec) },
    { part: lit, material: finish('neon-jp-crown', 0xf2f4f5) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 31, elevation: 0, height: HT }
  await writeModel('tokyo-azabudai-hills-mori-jp-tower', 'tokyo-azabudai-hills-mori-jp-tower.glb', 'Azabudai Hills Mori JP Tower', build(LOW), meta, 5000, 256_000)
  await writeModel('tokyo-azabudai-hills-mori-jp-tower', 'tokyo-azabudai-hills-mori-jp-tower.detail.glb', 'Azabudai Hills Mori JP Tower', build(DETAIL), meta, 40_000, 1536 * 1024)
}
