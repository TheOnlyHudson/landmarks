/**
 * Meiji Jingu (明治神宮), Yoyogi, Tokyo: the inner precinct of the shrine —
 * the Minami-shinmon (south gate), the corridor ring (kairō) round the
 * paved courtyard with the east and west gates, the Gehaiden (outer
 * worship hall) and its wings, the Naihaiden and the Honden enclosure
 * behind — as one model. Procedural, CC0-1.0.
 * bun generators/tokyo-meiji-jingu.ts
 *
 * Writes models/tokyo-meiji-jingu.glb (low) and
 * models/tokyo-meiji-jingu.detail.glb (detail: bracket sets, round
 * columns, the gate's balcony railing and rafter ends, finer roof curves,
 * gilt fittings).
 *
 * This file also exports the shrine/temple kit that tokyo-zojoji.ts,
 * tokyo-zojoji-sanmon.ts, tokyo-fushimi-yagura.ts and
 * tokyo-nippon-budokan.ts build with (copied from the uncommitted
 * tokyo-sensoji.ts kit, which itself copies the hanok kit in
 * seoul-geunjeongjeon.ts): `jroof` (curved hipped / hip-and-gable / skirt
 * roof), `gable2` (a gabled or nagare roof with front and back depths),
 * `hipRun` (a straight corridor roof with hipped ends), `XPart` (a part in
 * a turned and shifted frame), lathe, grid, rbox, save. The model is only
 * written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres, turned to the precinct's axis.
 * The OSM multipolygon relation/3603909 (本殿, the whole inner precinct)
 * has its sides at 354.7° / 84.7°, so the catalog bearing is 354.7. The
 * origin is that outline's centroid (139.6994025, 35.6760054). Plan
 * numbers below are in the frame first drawn, about (139.6994, 35.6758),
 * and shifted by (-2.33, -22.75) when written; the axis of symmetry is
 * x = 2.25 (the middle of the south gate's opening).
 *
 * Identity, in order: the long low ring of corridors with broad dark
 * copper roofs round the great paved courtyard, broken at the south by the
 * tall Minami-shinmon with its deep sweeping hip-and-gable roof over a
 * balcony band; the wide Gehaiden facing it across the court, its big
 * roof sweeping down to a deep eave over the dark cypress front, lower
 * wing roofs either side; unpainted dark cypress everywhere with the
 * eaves' red-brown edge lines and small gilt fittings; the Honden's
 * nagare roof behind.
 *
 * Evidence:
 *  - OSM relation/3603909 (outer ring and its eight holes): courtyard
 *    x -24.0..29.7, y -48.0..12.1; south corridor y -54.8..-48 (-42.4 by
 *    the gate); the gate's notch x -5.8..10.3; west corridor x -30.5..-24,
 *    east 29.6..35.9, their gates at y -27.3..-18.5 (bulging to x -32.0 /
 *    37.3); the Gehaiden's front x -10.4..15.3 at y 7.4, its wings to the
 *    corridors at y 11.5-12.1; the north block y 12..45.6 with the court
 *    ring8 (x -7.5..13.3, y 27..39.1); the inner court ring3 (y 45.6..92)
 *    and the Honden's buildings ring4 (Honden x -5.3..10.8, y 58.6..74.5);
 *    the north corridor y 92..98.9. way/138670869 and way/138670899 are
 *    small halls inside the Honden court, drawn as plain halls.
 *  - published: rebuilt 1958 after the 1945 fire, Honden in nagare-zukuri,
 *    Japanese cypress, copper roofs (ja.wikipedia 明治神宮; the shrine's
 *    site). The roofs were re-coppered for the 2020 centenary and read dark
 *    grey-brown in every photo since, not green: drawn as in the photos.
 *  - heights (estimates, scaled from photos with people for scale):
 *    Minami-shinmon (Hałun-free: Hyppolyte de Saint-Rambert's "512", Asanagi):
 *    floor 0.8, columns to 5.6, balcony 7.2, eave 11.0 at the middle,
 *    gable foot 13.2, ridge 15.6; roof 21 × 15 m at the eaves.
 *    Gehaiden (Tokuzo's court view, Saint-Rambert's "main hall", Kakidai's
 *    far view): platform 1.6 (eight steps), columns to 6.0, bracket band to
 *    7.9, eave 8.6, gable foot 12.4, ridge 16.6; the side wings' eave 5.6,
 *    ridge 8.6. Corridors: wall 3.4, eave 3.8, ridge 6.2, 6.5 m wide.
 *    Naihaiden and the Honden enclosure (not seen in any photo from the
 *    court): estimated from the plan and the published style, kept plain.
 *  - colours (daylight photos, pulled to the palette's lightness): copper
 *    roof #7b7675 (grey-brown; #6f6a68-#86868a in the photos); cypress
 *    #8a6a52 (the dark brown wood, lightened); the eaves' red-brown edge
 *    #a0503e; granite steps #d9d4ca; gilt fittings #cfa94e; white shoji
 *    lattice panels #d6d1c4.
 *  - night: the shrine closes at sunset and is not floodlit; nothing
 *    glows. The lattice panels are a plain finish (not `window`).
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Courtyard of Meiji Shrine 20190717.jpg, Tokuzo in Edomura, CC BY-SA 4.0 (Gehaiden, front)
 *  - Meiji-jingū main hall.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0 (Gehaiden, close)
 *  - Meiji-jingū 512.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0 (Minami-shinmon from the court)
 *  - Meiji-jingū 491.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0 (Minami-shinmon from the south, torii)
 *  - 2018 Meiji Shrine.jpg, Kakidai, CC BY-SA 4.0 (the court from the south gate)
 *  - Meiji Shrine Minami-shinmon 2023-01-26.jpg, Asanagi, CC0 (south gate and corridors)
 *  - Meiji Jingu 2023-2.jpg and 2023-3.jpg, Akonnchiroll, CC BY-SA 4.0 (Gehaiden, south-west)
 *  - Meiji Shrine 20260102b.jpg, 武田信徳, CC BY 4.0 (south gate at night)
 * No commercial imagery. No look-only references.
 *
 * Left out: the two great camphor trees (meoto-kusu) and the ema racks in
 * the court (the court's paving is the map's), the hanging lanterns, the
 * chrysanthemum crests, the stairs' handrails.
 * Doubts: everything north of the Gehaiden (the Naihaiden, the Honden and
 * its court) is unphotographed from open sources and drawn from the plan
 * with estimated heights; the east and west gates are drawn as smaller
 * copies of the south gate's form (only glimpsed in photos); the corridors'
 * outer walls are assumed closed with lattice bands.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { box, prism, bar, storey, columns, brackets, platform, type HanokParts, type RoofOpts } from './seoul-geunjeongjeon'
import { finish } from './palette'

export { box, prism, bar, storey, columns, brackets, platform, type HanokParts, type RoofOpts }

// ===========================================================================
// Kit

export const TAU = Math.PI * 2
export const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/**
 * A part that draws into `base` through a turn by `rot` radians about z
 * (counter-clockwise from above) and a shift: build a building in its own
 * axis-aligned frame and place it. Normals turn with it.
 */
export class XPart extends Part {
  constructor(public base: Part, public rot = 0, public ox = 0, public oy = 0, public oz = 0) { super() }
  get triangles() { return this.base.triangles }
  T = (p: V3): V3 => { const c = Math.cos(this.rot), s = Math.sin(this.rot); return [this.ox + p[0] * c - p[1] * s, this.oy + p[0] * s + p[1] * c, this.oz + p[2]] }
  N = (n: V3): V3 => { const c = Math.cos(this.rot), s = Math.sin(this.rot); return [n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]] }
  tri(a: V3, b: V3, c: V3, ua: number[] = [0, 0], ub: number[] = [0, 0], uc: number[] = [0, 0], normals?: V3[]) {
    this.base.tri(this.T(a), this.T(b), this.T(c), ua, ub, uc, normals?.map(this.N))
  }
}
/** The same set of parts seen through one placement. */
export function placed<K extends string>(P: Record<K, Part>, rot: number, ox: number, oy: number, oz = 0): Record<K, Part> {
  const out = {} as Record<K, Part>
  for (const k of Object.keys(P) as K[]) out[k] = new XPart(P[k], rot, ox, oy, oz)
  return out
}

/** A quad wound to face `want`. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (dot(n, want) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** A triangle wound to face `want`. */
export function triOut(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (dot(n, want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A grid surface P[i][j], smooth-shaded, facing cross(di, dj) (or the other way with `flip`). */
export function grid(p: Part, P: V3[][], flip = false) {
  const I = P.length, J = P[0].length
  const N = P.map((row, i) => row.map((_, j) => {
    const di = sub(P[Math.min(I - 1, i + 1)][j], P[Math.max(0, i - 1)][j])
    const dj = sub(P[i][Math.min(J - 1, j + 1)], P[i][Math.max(0, j - 1)])
    const c = cross(di, dj)
    if (Math.hypot(...c) < 1e-9) return null
    const n = norm(c)
    return flip ? [-n[0], -n[1], -n[2]] as V3 : n
  })).map((row) => row.map((n, j) => n ?? row[j > 0 ? j - 1 : j + 1] ?? [0, 0, 1] as V3)) as V3[][]
  const area = (x: V3, y: V3, z: V3) => Math.hypot(...cross(sub(y, x), sub(z, x)))
  for (let i = 0; i < I - 1; i++) for (let j = 0; j < J - 1; j++) {
    const a = P[i][j], b = P[i + 1][j], c = P[i + 1][j + 1], d = P[i][j + 1]
    if (area(a, b, c) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [N[i][j], N[i + 1][j], N[i + 1][j + 1]])
    if (area(a, c, d) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [N[i][j], N[i + 1][j + 1], N[i][j + 1]])
  }
}

/** A surface of revolution about the vertical axis at (cx, cy), from a profile of [r, z] going upward, `k` sides. */
export function lathe(p: Part, cx: number, cy: number, profile: [number, number][], k = 16, a0 = 0) {
  const rings = profile.map(([r, z]) => Array.from({ length: k + 1 }, (_, i) => {
    const a = a0 + (i / k) * TAU
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  }))
  const P = Array.from({ length: k + 1 }, (_, i) => rings.map((ring) => ring[i]))
  grid(p, P)
}

/** A sphere-ish blob. */
export function ball(p: Part, cx: number, cy: number, cz: number, r: number, k = 10, rz = r) {
  const prof: [number, number][] = []
  const m = Math.max(4, Math.round(k / 2))
  for (let j = 0; j <= m; j++) {
    const t = -Math.PI / 2 + (j / m) * Math.PI
    prof.push([Math.max(1e-4, r * Math.cos(t)), cz + rz * Math.sin(t)])
  }
  lathe(p, cx, cy, prof, k)
}

/** A box turned about z by `rot` round its centre (cx, cy). `skip` leaves out faces: s e n w t b (in its own frame). */
export function rbox(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, rot = 0, skip = '') {
  const c = Math.cos(rot), s = Math.sin(rot)
  const at = (x: number, y: number, z: number): V3 => [cx + x * c - y * s, cy + x * s + y * c, z]
  const B = [at(-hx, -hy, z0), at(hx, -hy, z0), at(hx, hy, z0), at(-hx, hy, z0)]
  const T = [at(-hx, -hy, z1), at(hx, -hy, z1), at(hx, hy, z1), at(-hx, hy, z1)]
  const outs: V3[] = [[s, -c, 0], [c, s, 0], [-s, c, 0], [-c, -s, 0]]
  const names = 'senw'
  for (let k = 0; k < 4; k++) {
    if (skip.includes(names[k])) continue
    quadOut(p, B[k], B[(k + 1) % 4], T[(k + 1) % 4], T[k], outs[k])
  }
  if (!skip.includes('t')) quadOut(p, T[0], T[1], T[2], T[3], [0, 0, 1])
  if (!skip.includes('b')) quadOut(p, B[0], B[1], B[2], B[3], [0, 0, -1])
}

/** A box along a segment (a beam), `w` wide and from z0 to z1, plan ends a→b. */
export function beam(p: Part, ax: number, ay: number, bx: number, by: number, w: number, z0: number, z1: number, skip = '') {
  const L = Math.hypot(bx - ax, by - ay)
  rbox(p, (ax + bx) / 2, (ay + by) / 2, L / 2, w / 2, z0, z1, Math.atan2(by - ay, bx - ax), skip)
}

/** A round column (smooth prism), its top open. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, n = 10) {
  prism(p, x, y, z0, z1, r, r * 0.97, n)
}

/** Small blocks in a row from a to b (rafter ends, bracket heads, dentils). */
export function rafterEnds(p: Part, a: V3, b: V3, step: number, w: number, h: number, depth: number, out: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.floor(L / step))
  const rot = Math.atan2(b[1] - a[1], b[0] - a[0])
  for (let i = 0; i <= n; i++) {
    const f = (i + 0.5) / (n + 1)
    const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, z = a[2] + (b[2] - a[2]) * f
    rbox(p, x + out[0] * depth / 2, y + out[1] * depth / 2, w / 2, depth / 2, z - h / 2, z + h / 2, rot, 'b')
  }
}

export type Mat = { part: Part; material: MaterialSpec }

/** Write a GLB (budget-checked unless DRAFT=1); `file` is under models/ unless absolute. */
export async function save(name: string, parts: Mat[], file: string, maxTri: number, maxBytes: number, extras: Record<string, unknown>) {
  const used = parts.filter((x) => x.part.triangles > 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  console.log(used.map((x) => `${x.material.name} ${x.part.triangles}`).join(', '))
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (!process.env.DRAFT && (triangles > maxTri || glb.length > maxBytes)) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = file.startsWith('/') ? file : new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Roofs

/**
 * The curved Japanese roof (the hanok kit's roof, with a coarse option):
 * 'paljak' hip-and-gable (irimoya), 'hip' hipped, 'skirt' the lower roof of
 * a two-storey building. Parts: roof (tile/copper surface and ridges), red
 * (gable boarding), teal (soffit), stone (hip ridges: pass the roof part to
 * keep them in the roof's colour). `rx` leans the gables in. `edge` takes
 * the eave fascia, when the eave's edge is its own colour.
 */
export function jroof(P: HanokParts & { edge?: Part }, o: RoofOpts & { coarse?: boolean | 2; noHips?: boolean; rx?: number; lite?: boolean }) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const pow = o.pow ?? 1.6, sag = o.sag ?? 0.5, th = o.th ?? 0.6
  const zr = o.zr ?? o.zg
  const U = o.coarse === 2 ? [0, 0.6, 0.9, 1] : o.coarse ? [0, 0.45, 0.75, 0.92, 1] : [0, 0.3, 0.5, 0.64, 0.75, 0.84, 0.91, 0.96, 1]
  const us = [...U.slice(1).reverse().map((u) => -u), ...U]
  const T = o.kind === 'skirt' ? (o.coarse ? [0, 0.4, 1] : [0, 0.3, 0.65, 1]) : o.lite ? [0, 0.45, 1] : o.coarse ? [0, 0.25, 0.6, 1] : [0, 0.14, 0.33, 0.57, 0.8, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const L = (t: number) => Math.pow(1 - t, 1.15)
  const band = (A: number, B: number, A1: number, B1: number) => (u: number, t: number): [number, number, number] => {
    const q = Math.max(0, (Math.abs(u) - 0.3) / 0.7), a = Math.pow(q, pow), l = L(t)
    const along = u * (A + (A1 - A) * t + o.flare * l * a)
    const out = B + (B1 - B) * t + o.flare * l * a
    return [along, -out, o.ze + (o.zg - o.ze) * prof(t) + o.lift * l * a]
  }
  const turn = (k: number, [x, y, z]: [number, number, number]): V3 => {
    const r = [[x, y], [-y, x], [-x, -y], [y, -x]][k]
    return [cx + r[0], cy + r[1], z]
  }
  const sides = [0, 1, 2, 3].map((k) => (k % 2 === 0 ? band(o.ex, o.ey, o.gx, o.gy) : band(o.ey, o.ex, o.gy, o.gx)))
  for (let k = 0; k < 4; k++) grid(P.roof, us.map((u) => T.map((t) => turn(k, sides[k](u, t)))))
  const ring: V3[] = []
  for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) ring.push(turn(k, sides[k](u, 0)))
  const n = ring.length
  const low = ring.map(([x, y, z]) => [x, y, z - th] as V3)
  const mid = ring.map(([x, y, z]) => [x, y, z - th * 0.45] as V3)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (P.edge) { P.roof.quad(mid[i], mid[j], ring[j], ring[i]); P.edge.quad(low[i], low[j], mid[j], mid[i]) }
    else P.roof.quad(low[i], low[j], ring[j], ring[i])
  }
  if (o.soffit && !o.lite) {
    const { bx, by, zb } = o.soffit
    const inner: V3[] = []
    for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) {
      const [x, y] = k % 2 === 0 ? [u * bx, -by] : [u * by, -bx]
      inner.push(turn(k, [x, y, zb]))
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      P.teal.quad(low[i], inner[i], inner[j], low[j])
    }
  }
  const hr = o.hipRidge ?? { w: 0.36, h: 0.32 }
  for (let k = 0; k < (o.noHips || o.lite ? 0 : 4); k++) {
    const line = (o.kind === 'skirt' ? [0, 0.3, 1] : o.coarse ? [0, 0.25, 1] : [0, 0.14, 0.33, 0.6, 1]).map((t) => turn(k, sides[k](1, t)))
    const a = line[0], b = line[1], d = norm(sub(a, b))
    const tip: V3 = [a[0] + d[0] * 0.1, a[1] + d[1] * 0.1, a[2] + d[2] * 0.1 + 0.05]
    bar(P.stone, [tip, ...line], hr.w, hr.h, 0.25, true, false)
  }
  const gx = o.gx, gy = o.gy
  if (o.kind === 'skirt') {
    const w: V3[] = [[cx - gx, cy - gy, o.zg], [cx + gx, cy - gy, o.zg], [cx + gx, cy + gy, o.zg], [cx - gx, cy + gy, o.zg]]
    for (let k = 0; k < 4; k++) bar(P.stone, [w[k], w[(k + 1) % 4]], hr.w, hr.h, 0.1, true, false)
    return
  }
  if (o.kind === 'paljak') {
    const TU = o.coarse ? [0, 0.5, 1] : [0, 0.3, 0.62, 1]
    const rx = o.rx ?? gx
    const ax = (t: number) => gx + (rx - gx) * t
    const zt = (t: number) => o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)
    const top = (u: number, t: number): [number, number, number] => [u * ax(t), -gy * (1 - t), zt(t)]
    for (const k of [0, 2]) grid(P.roof, (o.coarse ? [-1, 1] : [-1, -0.5, 0, 0.5, 1]).map((u) => TU.map((t) => turn(k, top(u, t)))))
    for (const k of [1, 3]) {
      P.red.tri(turn(k, [-gy, -gx, o.zg]), turn(k, [gy, -gx, o.zg]), turn(k, [0, -rx, zr]))
      if (!o.lite) for (const s of [-1, 1]) bar(P.stone, TU.map((t) => turn(k, [s * gy * (1 - t), -ax(t) - 0.05, zt(t)])), hr.w, hr.h, 0.1, true, false)
    }
  }
  const R = o.ridge ?? { h: 1.0, w: 0.9 }
  const rs = o.ridgeSag ?? 0.25
  const rl = (o.rx ?? gx) + (o.kind === 'paljak' ? 0.3 : 0)
  const rpts: V3[] = (o.lite ? [-1, 1] : [-1, -0.6, -0.25, 0.25, 0.6, 1]).map((s) => [cx + s * rl, cy, zr + rs * s * s])
  bar(P.stone, rpts, R.w, R.h, 0.6, true, false)
  if (R.ornament && !o.lite) for (const s of [-1, 1]) {
    const x = cx + s * rl, z = zr + rs + R.h - 0.1, h = R.ornament
    const x0 = x - s * 1.2, x1 = x + s * 0.15
    box(P.roof, x0, cy - R.w * 0.75, z, x1, cy + R.w * 0.75, z + h * 0.7, 'b')
    box(P.roof, x0 + s * 0.2, cy - R.w * 0.6, z + h * 0.7, x0 + s * 0.85, cy + R.w * 0.6, z + h, 'b')
  }
}

export type Gable2 = {
  cx?: number; cy?: number
  /** Half-length along x (verge to verge). */
  L: number
  /** Eave distances from the ridge, front (-y) and back (+y): unequal for a nagare roof. */
  Df: number; Db: number
  /** Eave heights front and back (top of the roofing), ridge height. */
  zf: number; zb: number; zr: number
  /** Concavity (0 straight) and the corner upturn at the eave ends. */
  sag?: number; lift?: number
  /** Roof slab thickness and the ridge's width and height. */
  th?: number; ridge?: { w: number; h: number }
  coarse?: boolean
}
/**
 * A gabled roof with its ridge along x: a kirizuma when Df = Db, a nagare
 * roof when the front runs longer. Parts: roof (surface, ridge), edge (eave
 * fascia and barge boards), gable (the gable triangles under it, to the
 * walls' top `zw` at ±`wy`), soffit.
 */
export function gable2(P: { roof: Part; edge: Part; gable?: Part; soffit?: Part }, o: Gable2, walls?: { wx: number; wyf: number; wyb: number; zw: number }) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0, sag = o.sag ?? 0.35, th = o.th ?? 0.45, lift = o.lift ?? 0
  const U = o.coarse ? [-1, 1] : [-1, -0.9, -0.7, -0.35, 0, 0.35, 0.7, 0.9, 1]
  const T = o.coarse ? [0, 0.5, 1] : [0, 0.2, 0.45, 0.72, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const at = (s: number, u: number, t: number, dz = 0): V3 => {
    const D = s < 0 ? o.Df : o.Db, ze = s < 0 ? o.zf : o.zb
    const up = lift * Math.pow(Math.max(0, (Math.abs(u) - 0.6) / 0.4), 2) * (1 - t)
    return [cx + u * o.L, cy + s * D * (1 - t), ze + (o.zr - ze) * prof(t) + up + dz]
  }
  for (const s of [-1, 1]) {
    grid(P.roof, U.map((u) => T.map((t) => at(s, u, t))), s > 0)
    if (P.soffit) grid(P.soffit, U.map((u) => T.map((t) => at(s, u, t, -th))), s < 0)
    for (let i = 0; i < U.length - 1; i++) {
      const a = at(s, U[i], 0), b = at(s, U[i + 1], 0)
      quadOut(P.edge, [a[0], a[1], a[2] - th], [b[0], b[1], b[2] - th], b, a, [0, s, 0])
    }
    for (const e of [-1, 1]) for (let j = 0; j < T.length - 1; j++) {
      const a = at(s, e, T[j]), b = at(s, e, T[j + 1])
      quadOut(P.edge, [a[0], a[1], a[2] - th * 1.6], [b[0], b[1], b[2] - th * 1.6], b, a, [e, 0, 0])
    }
  }
  const R = o.ridge ?? { w: 0.6, h: 0.5 }
  bar(P.roof, [[cx - o.L - 0.15, cy, o.zr], [cx + o.L + 0.15, cy, o.zr]], R.w, R.h, 0.3, true, false)
  if (walls && P.gable) for (const e of [-1, 1]) {
    // The gable wall under each verge, set in from the barge board.
    const x = cx + e * walls.wx
    const zf = o.zf + (o.zr - o.zf) * (1 - walls.wyf / o.Df), zb = o.zb + (o.zr - o.zb) * (1 - walls.wyb / o.Db)
    const poly: V3[] = [[x, cy - walls.wyf, walls.zw], [x, cy + walls.wyb, walls.zw], [x, cy + walls.wyb, zb - th], [x, cy, o.zr - th], [x, cy - walls.wyf, zf - th]]
    for (let i = 1; i < poly.length - 1; i++) triOut(P.gable, poly[0], poly[i], poly[i + 1], [e, 0, 0])
  }
}

/**
 * A straight corridor roof with hipped ends, ridge along x from x0 to x1
 * (the ridge's own ends), `D` from ridge to eave, eave `ze`, ridge `zr`.
 * Laid at right angles at a corner, two runs that both reach the outer
 * eave line meet in a clean hip outside and a valley inside.
 */
export function hipRun(P: { roof: Part; edge: Part; soffit?: Part }, x0: number, x1: number, cy: number, D: number, ze: number, zr: number, th = 0.4, sag = 0.25, nT = 3) {
  const T = Array.from({ length: nT }, (_, i) => i / (nT - 1))
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  // front/back slopes as grids from eave (t 0) to ridge (t 1), hips at the ends.
  const pt = (s: number, x: number, t: number, end: number): V3 => {
    // end: -1 at the x0 hip, +1 at x1, 0 along; the hip pulls the end in by D(1-t).
    return [x + end * D * (1 - t), cy + s * D * (1 - t), ze + (zr - ze) * prof(t)]
  }
  for (const s of [-1, 1]) {
    grid(P.roof, [T.map((t) => pt(s, x0, t, -1)), T.map((t) => pt(s, x1, t, 1))], s > 0)
  }
  for (const e of [-1, 1]) {
    const x = e < 0 ? x0 : x1
    const ptE = (s: number, t: number): V3 => [x + e * D * (1 - t), cy + s * D * (1 - t), ze + (zr - ze) * prof(t)]
    // the hip facet: a fan from the ridge end to the eave.
    grid(P.roof, [T.map((t) => ptE(-1, t)), T.map((t) => ptE(1, t))], e < 0)
  }
  // eave edge and soffit ring
  const c: V3[] = [[x0 - D, cy - D, ze], [x1 + D, cy - D, ze], [x1 + D, cy + D, ze], [x0 - D, cy + D, ze]]
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4]
    P.edge.quad([a[0], a[1], a[2] - th], [b[0], b[1], b[2] - th], b, a)
  }
  if (P.soffit) P.soffit.quad(...([...c].reverse().map(([x, y, z]) => [x, y, z - th]) as [V3, V3, V3, V3]))
  bar(P.roof, [[x0, cy, zr], [x1, cy, zr]], 0.45, 0.35, 0.2, true, false)
}

// ===========================================================================
// Meiji Jingu

type Sz = { detail: boolean }

/** The precinct's six materials. */
function mats() {
  return { cu: new Part(), wood: new Part(), edge: new Part(), stone: new Part(), gold: new Part(), shoji: new Part() }
}
type M = ReturnType<typeof mats>

/** Shift from the plan frame to the outline's centroid. */
const OX = -2.33, OY = -22.75
const AX = 2.25 // axis of symmetry in the plan frame

/** A corridor (kairō) run along x in its own frame: walls, posts, lattice band, roof. */
function corridor(S: Sz, M: M, x0: number, x1: number, cy: number, w: number, o: { ze?: number; zr?: number; hip0?: boolean; hip1?: boolean; openIn?: number } = {}) {
  const ze = o.ze ?? 3.8, zr = o.zr ?? 6.2, hw = w / 2, D = hw + 1.3
  const zw = ze - 0.45
  // Floor plinth and the body: closed outer wall with a lattice band; the
  // court side (y < 0 in its frame, set by the caller) open between posts.
  box(M.stone, x0, cy - hw, 0, x1, cy + hw, 0.45, 'b')
  box(M.wood, x0, cy + hw - 0.35, 0.45, x1, cy + hw, zw, 'b')
  const open = o.openIn ?? 1
  if (open) {
    // posts on the open side, a tie beam over them
    const n = Math.max(1, Math.round((x1 - x0) / (S.detail ? 3.6 : 6.0)))
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n
      if (S.detail) prism(M.wood, x, cy - hw + 0.3, 0.45, zw, 0.2, 0.2, 8)
      else box(M.wood, x - 0.18, cy - hw + 0.12, 0.45, x + 0.18, cy - hw + 0.48, zw, 'bt')
    }
    box(M.wood, x0, cy - hw + 0.1, zw - 0.5, x1, cy - hw + 0.5, zw, 'b')
    // the dark interior wall seen through the posts
    box(M.wood, x0, cy - 0.15, 0.45, x1, cy + 0.15, zw, 'b')
  } else box(M.wood, x0, cy - hw, 0.45, x1, cy - hw + 0.35, zw, 'b')
  // lattice band high on the outer wall
  const n = Math.max(1, Math.round((x1 - x0) / (S.detail ? 4 : 6.5)))
  for (let i = 0; i < n; i++) {
    const a = x0 + (x1 - x0) * i / n + 0.5, b = x0 + (x1 - x0) * (i + 1) / n - 0.5
    M.shoji.quad([b, cy + hw + 0.03, 1.9], [a, cy + hw + 0.03, 1.9], [a, cy + hw + 0.03, zw - 0.6], [b, cy + hw + 0.03, zw - 0.6])
  }
  box(M.wood, x0, cy - hw, zw, x1, cy + hw, zw + 0.05, 'b')
  hipRun({ roof: M.cu, edge: M.edge, soffit: M.wood }, x0 + (o.hip0 ? 0 : 0), x1, cy, D, ze, zr, 0.4, 0.25, S.detail ? 4 : 2)
}

/** A shinmon gate in its own frame, front -y: columns, balcony band, irimoya roof. */
function gate(S: Sz, M: M, k: { W: number; Dp: number; ze: number; zg: number; zr: number; ex: number; ey: number; col: number; lite?: boolean }) {
  const PB: HanokParts = { roof: M.cu, stone: M.stone, red: M.wood, green: M.wood, teal: M.wood, lattice: M.shoji }
  const PR: HanokParts & { edge: Part } = { roof: M.cu, stone: M.cu, red: M.wood, green: M.wood, teal: M.wood, lattice: M.shoji, edge: M.edge }
  const W = k.W, Dp = k.Dp, zc = k.col
  if (!S.detail && k.lite) box(M.stone, -W - 1.2, -Dp - 1.6, 0, W + 1.2, Dp + 1.6, 0.8, 'b')
  else platform(PB, [{ x0: -W - 1.2, x1: W + 1.2, y0: -Dp - 1.6, y1: Dp + 1.6, z0: 0, z1: 0.8, rail: false,
    stairs: [{ side: 's', at: 0, width: W * 2 }, { side: 'n', at: 0, width: W * 2 }] }])
  // 3 bays × 2: the middle bay wide (the passage), the side bays closed by
  // board walls with lattice windows.
  const xs = [-W, -W * 0.36, W * 0.36, W], ys = [-Dp, 0, Dp]
  for (const x of xs) for (const y of ys) {
    if (!S.detail && y === 0 && Math.abs(x) < W) continue
    if (S.detail) column(M.wood, x, y, 0.8, zc, 0.38, 12)
    else rbox(M.wood, x, y, 0.36, 0.36, 0.8, zc, 0, 'tb')
  }
  for (const e of [-1, 1]) {
    const xa = e * W * 0.36, xb = e * W
    box(M.wood, Math.min(xa, xb), -0.15, 0.8, Math.max(xa, xb), 0.15, zc - 1.2, 'b')
    // (the side bays' lattice reads as dark timber in every photo: plain wall)
  }
  // tie beams and the bracket band to the balcony
  box(M.wood, -W - 0.4, -Dp - 0.4, zc - 1.2, W + 0.4, Dp + 0.4, zc, 'b')
  const zb = zc + 1.2
  if (S.detail) brackets(PB, xs, ys, zc, zb, { per: 1, depth: 1.2, width: 0.5, tiers: 2 })
  else box(M.wood, -W - 0.8, -Dp - 0.8, zc, W + 0.8, Dp + 0.8, zb, 'b')
  // balcony (koshigumi) deck and railing, white rafter-end line under it
  const bw = W + 1.4, bd = Dp + 1.4
  box(M.wood, -bw, -bd, zb, bw, bd, zb + 0.35, '')
  box(M.wood, -W + 0.2, -Dp + 0.2, zb + 0.35, W - 0.2, Dp - 0.2, k.ze - 2.0, 'b')
  if (S.detail) {
    for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as [number, number][][])
      bar(M.wood, [[a[0] * (bw - 0.15), a[1] * (bd - 0.15), zb + 1.0], [b[0] * (bw - 0.15), b[1] * (bd - 0.15), zb + 1.0]], 0.18, 0.12, 0.65, true, false)
    rafterEnds(M.gold, [-bw + 0.3, -bd - 0.05, zb + 0.1], [bw - 0.3, -bd - 0.05, zb + 0.1], 0.6, 0.14, 0.14, 0.12, [0, -1, 0])
    brackets(PB, [-W + 0.2, -W * 0.36, W * 0.36, W - 0.2], [-Dp + 0.2, Dp - 0.2], k.ze - 2.0, k.ze - 0.7, { per: 2, depth: 1.8, width: 0.45, tiers: 3 })
    // the white-painted ends of the bracket arms (tokyō), in rows round the band
    for (const z of [k.ze - 1.65, k.ze - 1.05]) for (const s of [-1, 1]) {
      rafterEnds(M.shoji, [-W - 0.6, s * (Dp + (z > k.ze - 1.3 ? 1.75 : 1.15)), z], [W + 0.6, s * (Dp + (z > k.ze - 1.3 ? 1.75 : 1.15)), z], 0.75, 0.22, 0.2, 0.08, [0, s, 0])
    }
  } else {
    box(M.wood, -bw + 0.1, -bd + 0.1, zb + 0.35, bw - 0.1, bd - 0.1, zb + 1.05, 'b')
    // the bracket band as two corbelled courses, with pale bracket-arm ends
    box(M.wood, -W - 0.5, -Dp - 0.5, k.ze - 2.0, W + 0.5, Dp + 0.5, k.ze - 1.35, 'b')
    box(M.wood, -W - 1.1, -Dp - 1.1, k.ze - 1.35, W + 1.1, Dp + 1.1, k.ze - 0.7, 'b')
    if (!k.lite) for (const s of [-1, 1]) for (const x of [-W, -W * 0.36, W * 0.36, W]) {
      rbox(M.shoji, x, s * (Dp + 0.55), 0.3, 0.06, k.ze - 1.85, k.ze - 1.45, 0, 'b')
      rbox(M.shoji, x, s * (Dp + 1.15), 0.3, 0.06, k.ze - 1.2, k.ze - 0.8, 0, 'b')
    }
  }
  jroof(PR, { coarse: S.detail ? false : k.lite ? 2 : true, lite: !S.detail && k.lite,
    kind: 'paljak', ex: k.ex, ey: k.ey, ze: k.ze, gx: k.ex * 0.68, gy: Dp * 0.55, zg: k.zg, zr: k.zr, rx: k.ex * 0.6,
    lift: 1.1, flare: 0.75, sag: 0.45, th: 0.38, pow: 2.0,
    soffit: { bx: W + 1.0, by: Dp + 1.0, zb: k.ze - 0.7 },
    ridge: { h: 0.75, w: 0.8, ornament: 0.7 }, ridgeSag: 0.1, hipRidge: { w: 0.35, h: 0.3 },
  })
  // gilt fittings on the ridge ends and the gables
  for (const e of [-1, 1]) {
    rbox(M.gold, e * (k.ex * 0.6 + 0.3), 0, 0.3, 0.45, k.zr + 0.15, k.zr + 0.7)
    if (S.detail) rbox(M.gold, e * (k.ex * 0.63 + 0.05), 0, 0.08, 0.5, k.zr - 1.6, k.zr - 0.6)
  }
}

/** A plain hall in its own frame: platform, wood body with lattice band, curved roof. */
function hall(S: Sz, M: M, h: { x0: number; x1: number; y0: number; y1: number; plat: number; zw: number; ze: number; zg?: number; zr: number; over: number; kind: 'paljak' | 'hip' }) {
  const PR: HanokParts & { edge: Part } = { roof: M.cu, stone: M.cu, red: M.wood, green: M.wood, teal: M.wood, lattice: M.shoji, edge: M.edge }
  const cx = (h.x0 + h.x1) / 2, cy = (h.y0 + h.y1) / 2, hx = (h.x1 - h.x0) / 2, hy = (h.y1 - h.y0) / 2
  if (h.plat > 0) box(M.stone, h.x0 - 0.5, h.y0 - 0.5, 0, h.x1 + 0.5, h.y1 + 0.5, h.plat, 'b')
  box(M.wood, h.x0, h.y0, h.plat, h.x1, h.y1, h.zw, 'bt')
  for (const [a, b, out] of [[[h.x0, h.y0], [h.x1, h.y0], [0, -1]], [[h.x1, h.y1], [h.x0, h.y1], [0, 1]], [[h.x1, h.y0], [h.x1, h.y1], [1, 0]], [[h.x0, h.y1], [h.x0, h.y0], [-1, 0]]] as [number[], number[], number[]][]) {
    if (!S.detail && out[1] >= 0) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 4.5))
    for (let i = 0; i < n; i++) {
      const f0 = (i + 0.15) / n, f1 = (i + 0.85) / n
      const p = (f: number, z: number): V3 => [a[0] + (b[0] - a[0]) * f + out[0] * 0.03, a[1] + (b[1] - a[1]) * f + out[1] * 0.03, z]
      M.shoji.quad(p(f0, h.zw - 1.9), p(f1, h.zw - 1.9), p(f1, h.zw - 0.6), p(f0, h.zw - 0.6))
    }
  }
  const zg = h.zg ?? h.ze + (h.zr - h.ze) * 0.55
  if (!S.detail && h.kind === 'hip') {
    // low model: a plain planar hipped roof along the longer side
    const alongX = hx >= hy, D = Math.min(hx, hy) + h.over, L = Math.max(hx, hy) - Math.min(hx, hy)
    const Q = alongX ? { roof: M.cu, edge: M.edge, soffit: M.wood } : placed({ roof: M.cu, edge: M.edge, soffit: M.wood }, Math.PI / 2, cx, cy)
    if (alongX) hipRun(Q, cx - L, cx + L, cy, D, h.ze, h.zr, 0.4, 0.2, 2)
    else hipRun(Q, -L, L, 0, D, h.ze, h.zr, 0.4, 0.2, 2)
    return
  }
  jroof(PR, { coarse: S.detail ? false : 2, lite: !S.detail, kind: h.kind, cx, cy,
    ex: hx + h.over, ey: hy + h.over, ze: h.ze, gx: h.kind === 'hip' ? Math.max(0.5, hx - hy) : hx * 0.8, gy: h.kind === 'hip' ? 0 : hy * 0.5, rx: h.kind === 'hip' ? undefined : hx * 0.75, zg: h.kind === 'hip' ? h.zr : zg, zr: h.zr,
    lift: 0.4, flare: 0.3, sag: 0.4, th: 0.45, soffit: { bx: hx, by: hy, zb: h.zw }, ridge: { h: 0.45, w: 0.6 }, ridgeSag: 0.05, hipRidge: { w: 0.3, h: 0.25 },
  })
}

function buildMeiji(S: Sz) {
  const R = mats()
  // Everything is drawn in the plan frame and shifted to the centroid.
  const M0 = placed(R, 0, OX, OY) as M
  // ONLY=gehaiden|minami draws one building alone (for photo comparisons).
  const only = process.env.ONLY, junk = mats()
  let M = M0
  const pick = (name: string) => { M = !only || only === name ? M0 : (placed(junk, 0, 0, 0) as M) }
  pick('corridors')
  let seen = 0
  const tally = (l: string) => { const n = Object.values(R).reduce((t, p) => t + p.triangles, 0); if (process.env.TALLY) console.log(`  ${l}: ${n - seen}`); seen = n }

  // ---- The corridor ring round the courtyard ------------------------------
  // Each run's ridge reaches the next run's centreline, so the corners close
  // with a hip outside and a valley inside. Frames: a run's court side is -y.
  const cw = 6.5
  const S0 = -51.4 // south corridor centreline (y -54.8..-48)
  const Wc = -27.25, Ec = 32.75 // west/east centrelines
  const Nc = 15.2 // where the east and west runs meet the north block
  // South: two runs either side of the gate (x -30.5..-5.8 and 10.3..35.9).
  corridor(S, placed(M, Math.PI, 0, 0) as M, 5.8 + 0.3, -Wc, -S0, cw)
  corridor(S, placed(M, Math.PI, 0, 0) as M, -Ec, -(10.3 + 0.3), -S0, cw)
  // West and east runs, their court sides facing the court.
  corridor(S, placed(M, Math.PI / 2, 0, 0) as M, S0, Nc, -Wc, cw)
  corridor(S, placed(M, -Math.PI / 2, 0, 0) as M, -Nc, -S0, Ec, cw)
  tally('corridors')
  // The wider blocks either side of the south gate (y -48..-42.4).
  for (const [x0, x1] of [[-14.3, -5.8], [10.3, 19.6]]) box(M.wood, x0, -48.0, 0.45, x1, -42.4, 3.4, 'b')
  // East and west gates (Higashi-/Nishi-shinmon), facing out of the court.
  const side = { W: 4.0, Dp: 3.6, ze: 8.4, zg: 9.8, zr: 11.2, ex: 7.6, ey: 7.0, col: 4.4, lite: true }
  gate(S, placed(M, -Math.PI / 2, -27.35, -22.9) as M, side)
  gate(S, placed(M, Math.PI / 2, 33.5, -23.1) as M, side)
  tally('side gates')
  pick('minami')
  // ---- Minami-shinmon ------------------------------------------------------
  gate(S, placed(M, 0, AX, -46.0) as M, { W: 5.3, Dp: 3.9, ze: 11.2, zg: 13.0, zr: 14.8, ex: 10.6, ey: 7.6, col: 6.2 })

  tally('minami')
  pick('gehaiden')
  // ---- Gehaiden and its wings ----------------------------------------------
  // Platform and stairs (eight steps) across the front.
  const P = { roof: M.cu, stone: M.stone, red: M.wood, green: M.wood, teal: M.wood, lattice: M.shoji }
  const GY0 = 10.4, GY1 = 26.0, GX = 15.0
  platform(P, [{ x0: AX - GX - 0.8, x1: AX + GX + 0.8, y0: GY0 - 0.8, y1: GY1, z0: 0, z1: 1.6, rail: false,
    stairs: [{ side: 's', at: AX, width: 2 * GX + 1.6 }] }])
  // Columns: 7 bays across the front, the middle five open; walls behind.
  const gxs = [-GX, -10.8, -6.4, -2.1, 2.1, 6.4, 10.8, GX].map((x) => x + AX)
  for (const x of gxs) {
    if (S.detail) column(M.wood, x, GY0, 1.6, 6.0, 0.42, 12)
    else rbox(M.wood, x, GY0, 0.4, 0.4, 1.6, 6.0, 0, 'tb')
  }
  box(M.wood, AX - GX, GY0 + 2.0, 1.6, AX + GX, GY1, 6.0, 'b')
  // the lattice windows in the end bays and the bright inner sanctuary curtain
  for (const e of [-1, 1]) {
    const xa = AX + e * GX, xb = AX + e * 10.8
    quadOut(M.shoji, [Math.min(xa, xb) + 0.6, GY0 + 1.97, 3.4], [Math.max(xa, xb) - 0.6, GY0 + 1.97, 3.4], [Math.max(xa, xb) - 0.6, GY0 + 1.97, 4.9], [Math.min(xa, xb) + 0.6, GY0 + 1.97, 4.9], [0, -1, 0])
  }
  box(M.wood, AX - GX - 0.4, GY0 - 0.4, 6.0, AX + GX + 0.4, GY1 + 0.4, 6.8, 'b')
  if (S.detail) brackets(P, gxs.map((x) => x - AX), [GY0 - 18.2, GY1 - 18.2], 6.8, 7.9, { cx: AX, cy: 18.2, per: 1, depth: 1.6, width: 0.5, tiers: 2 })
  else box(M.wood, AX - GX - 0.9, GY0 - 0.9, 6.8, AX + GX + 0.9, GY1 + 0.9, 7.9, 'b')
  // gilt line of rafter ends under the eave (the bright dashes in photos)
  if (S.detail) rafterEnds(M.gold, [AX - GX - 3.0, GY0 - 3.5, 7.75], [AX + GX + 3.0, GY0 - 3.5, 7.75], 0.6, 0.16, 0.16, 0.12, [0, -1, 0])
  else box(M.gold, AX - GX - 3.0, GY0 - 3.65, 7.55, AX + GX + 3.0, GY0 - 3.45, 7.8, 'b')
  jroof({ ...P, stone: M.cu, edge: M.edge }, { coarse: !S.detail, cx: AX, cy: 18.2, kind: 'paljak',
    ex: GX + 4.8, ey: 7.8 + 3.8, ze: 8.4, gx: GX * 0.96, gy: 2.0, zg: 12.0, zr: 13.6, rx: GX * 0.92,
    lift: 0.6, flare: 0.5, sag: 0.5, th: 0.55, pow: 3.0,
    soffit: { bx: GX + 0.9, by: 7.8 + 0.9, zb: 7.9 },
    ridge: { h: 0.9, w: 0.9, ornament: 0.8 }, ridgeSag: 0.1, hipRidge: { w: 0.4, h: 0.35 },
  })
  for (const e of [-1, 1]) {
    rbox(M.gold, AX + e * (GX * 0.92 + 0.3), 18.2, 0.35, 0.5, 13.6 + 0.2, 13.6 + 0.95)
    // small gilt studs along the ridge's side
    if (S.detail) for (const f of [0.2, 0.45, 0.7]) rbox(M.gold, AX + e * GX * 0.92 * f, 18.2 - 0.47, 0.18, 0.03, 13.6 + 0.2, 13.6 + 0.55)
  }
  tally('gehaiden')
  // Wings: lower halls from the Gehaiden to the corridors (x -24..-9.8 and
  // 14.3..29.7, y 11.5..25.5), open to the court under deep eaves.
  for (const [x0, x1] of [[-24.6, AX - GX - 0.6], [AX + GX + 0.6, 30.3]]) {
    hall(S, M, { x0, x1, y0: 12.6, y1: 20.4, plat: 0.6, zw: 4.9, ze: 5.7, zr: 7.7, over: 1.8, kind: 'hip' })
    hall(S, M, { x0, x1, y0: 21.0, y1: 26.0, plat: 0.6, zw: 3.6, ze: 4.2, zr: 6.2, over: 0.8, kind: 'hip' })
  }

  tally('wings')
  pick('north')
  // ---- The north block: corridors round the small court, the Naihaiden ----
  // West and east outer blocks (x -37.6..-24, 29.7..41.8; y 12..45.6).
  hall(S, M, { x0: -34.4, x1: -26.2, y0: 12.6, y1: 59.0, plat: 0.5, zw: 3.8, ze: 4.4, zr: 7.4, over: 1.2, kind: 'hip' })
  hall(S, M, { x0: 30.6, x1: 40.4, y0: 13.0, y1: 51.6, plat: 0.5, zw: 3.8, ze: 4.4, zr: 7.4, over: 1.2, kind: 'hip' })
  hall(S, M, { x0: -24.0, x1: -15.6, y0: 27.0, y1: 44.6, plat: 0.5, zw: 3.8, ze: 4.4, zr: 7.4, over: 1.0, kind: 'hip' })
  hall(S, M, { x0: 22.6, x1: 29.4, y0: 27.0, y1: 44.6, plat: 0.5, zw: 3.8, ze: 4.4, zr: 7.4, over: 1.0, kind: 'hip' })
  // corridors either side of the court ring8 joining the Gehaiden to the Naihaiden
  for (const [x0, x1] of [[-13.6, -8.0], [13.8, 19.4]]) hall(S, M, { x0, x1, y0: 26.8, y1: 39.0, plat: 0.5, zw: 3.6, ze: 4.2, zr: 6.4, over: 0.9, kind: 'hip' })
  // Naihaiden (inner worship hall), across the court's north side.
  hall(S, M, { x0: -13.6, x1: 18.6, y0: 39.4, y1: 46.4, plat: 0.9, zw: 5.0, ze: 6.0, zr: 10.6, over: 1.6, kind: 'paljak' })

  tally('north block')
  // ---- The Honden enclosure ------------------------------------------------
  // North corridor (y 92..98.9), thin roofed fences down the sides (ring3's
  // 2 m margins), wings round the Honden (ring4), the Honden itself.
  corridor(S, M, -30.2, 35.9, 95.4, 6.6)
  for (const x of [-29.1, 34.85]) {
    box(M.wood, x - 0.6, 46.4, 0, x + 0.6, 92.1, 2.6, 'b')
    const F = placed(M, Math.PI / 2, x, 0)
    hipRun({ roof: F.cu, edge: F.edge, soffit: F.wood }, 47.9, 90.6, 0, 1.5, 2.8, 3.8, 0.3, 0.2, 2)
  }
  tally('n corridor+fences')
  // Wings and the Norito-den in front of the Honden.
  hall(S, M, { x0: -11.7, x1: -7.0, y0: 50.0, y1: 75.0, plat: 0.6, zw: 3.6, ze: 4.2, zr: 6.4, over: 0.8, kind: 'hip' })
  hall(S, M, { x0: 12.3, x1: 17.1, y0: 50.0, y1: 75.0, plat: 0.6, zw: 3.6, ze: 4.2, zr: 6.4, over: 0.8, kind: 'hip' })
  hall(S, M, { x0: -3.5, x1: 8.7, y0: 50.5, y1: 57.6, plat: 0.9, zw: 4.0, ze: 4.8, zr: 8.2, over: 1.0, kind: 'paljak' })
  // North halls behind the Honden (x -16.9..22.4, y 75..84.7; the two small
  // halls way/138670869 and way/138670899 among them).
  hall(S, M, { x0: -16.9, x1: -7.1, y0: 76.0, y1: 84.7, plat: 0.5, zw: 3.4, ze: 4.0, zr: 6.6, over: 0.8, kind: 'hip' })
  hall(S, M, { x0: 12.8, x1: 22.4, y0: 76.0, y1: 84.5, plat: 0.5, zw: 3.4, ze: 4.0, zr: 6.6, over: 0.8, kind: 'hip' })
  tally('honden wings')
  // The Honden: nagare-zukuri, ridge along x, the front slope running far
  // down over the stairs (way: x -5.3..10.8, y 58.6..74.5).
  const HX0 = -4.4, HX1 = 9.9, HY0 = 62.0, HY1 = 73.6
  box(M.stone, HX0 - 1.0, HY0 - 3.4, 0, HX1 + 1.0, HY1 + 0.9, 1.0, 'b')
  box(M.wood, HX0, HY0, 1.0, HX1, HY1, 6.6, 'b')
  for (const x of [HX0, HX0 + (HX1 - HX0) / 3, HX0 + 2 * (HX1 - HX0) / 3, HX1]) rbox(M.wood, x, HY0 - 2.6, 0.3, 0.3, 1.0, 5.0, 0, 'tb')
  for (let i = 0; i < 3; i++) {
    const a = HX0 + (HX1 - HX0) * i / 3 + 0.6, b = HX0 + (HX1 - HX0) * (i + 1) / 3 - 0.6
    quadOut(M.gold, [a, HY0 - 0.03, 2.0], [b, HY0 - 0.03, 2.0], [b, HY0 - 0.03, 5.6], [a, HY0 - 0.03, 5.6], [0, -1, 0])
  }
  gable2({ roof: M.cu, edge: M.edge, gable: M.wood, soffit: M.wood }, { cx: (HX0 + HX1) / 2, cy: (HY0 + HY1) / 2 + 0.6, L: (HX1 - HX0) / 2 + 1.6,
    Df: 6.4 + 5.0, Db: 6.4 + 1.6, zf: 5.0, zb: 6.6, zr: 12.8, sag: 0.45, lift: 0.5, th: 0.5, ridge: { w: 0.8, h: 0.7 }, coarse: !S.detail },
  { wx: (HX1 - HX0) / 2, wyf: 5.8 - 0.6, wyb: 5.8 + 0.6, zw: 6.6 })
  // chigi-free (nagare) ridge with gilt ends
  for (const e of [-1, 1]) rbox(M.gold, (HX0 + HX1) / 2 + e * ((HX1 - HX0) / 2 + 1.6), (HY0 + HY1) / 2 + 0.6, 0.3, 0.45, 12.6, 13.6)

  tally('honden')
  const parts: Mat[] = [
    { part: R.cu, material: finish('copper-roof', 0x7b7675) },
    { part: R.wood, material: finish('cypress', 0x8a6a52) },
    { part: R.edge, material: finish('eave-red', 0xa0503e) },
    { part: R.stone, material: finish('granite', 0xd9d4ca) },
    { part: R.gold, material: finish('gilt', 0xcfa94e) },
    { part: R.shoji, material: finish('shoji', 0xd6d1c4) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 354.7, elevation: 0, height: 15.9, osm: 'relation/3603909' }
  await save('Meiji Jingu', buildMeiji({ detail: false }), process.env.OUT ? `${process.env.OUT}/low.glb` : 'tokyo-meiji-jingu.glb', 6500, 250_000, extras)
  await save('Meiji Jingu', buildMeiji({ detail: true }), process.env.OUT ? `${process.env.OUT}/detail.glb` : 'tokyo-meiji-jingu.detail.glb', 40_000, 1536 * 1024, extras)
}
