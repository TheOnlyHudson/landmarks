/**
 * Museum of Islamic Art, Doha (I. M. Pei, 2008) — original procedural geometry, CC0-1.0.
 * bun generators/doha-museum-of-islamic-art.ts
 *
 * This file also exports the small geometry helpers the other doha-* generators
 * import (projector, boxes, prisms, lathes, tubes, facades with real recessed
 * arched openings, the GLB writer); its own build runs only as main.
 *
 * Frame: map frame turned to BEARING 337.5, so the long axis of the OSM outline
 * (relation/10671567, edges at 67.5° / 157.5°) runs along model x. Model +x
 * points to 67.5° (towards the education wing), model -y to 157.5° (the
 * entrance front). Origin = centroid of the OSM outline (51.539397, 25.295528).
 *
 * Evidence
 * - OSM relation/10671567 "Museum of Islamic Art" (building=museum, height 20,
 *   3 levels): a coarse 185 × 70 m outline over the island platform, covering
 *   the main building, the courtyard and the education wing. Parts inside it:
 *   way/769768768 (the tower, height 40, a 15.7 m square turned 45° to the
 *   outline), way/970357653 (the atrium dome inside it, height 35),
 *   way/769768767 (the round entrance canopy, layer 1), relation/13054829 (the
 *   landing where the entrance bridge way/769755406 meets the building),
 *   way/769768746 (the courtyard pavilion). The courtyard's fountains
 *   (way/769768747-50) and pedestrian area (way/769768744) fix the courtyard.
 * - Commons / Flickr photos (all EVIDENCE):
 *   "Museum of Islamic Art, Doha, Qatar." (jemasmith, CC BY 2.0) — from the
 *     south-west across the water: the stepped tiers, the turned top cube with
 *     its eye window, the low west wing, the two pier columns, the portal;
 *     https://www.flickr.com/photos/26085795@N02/4754905352
 *   "Museum of Islamic Art from the Corniche" (Francisco Anzola, CC BY 2.0) —
 *     the same side in morning sun; https://www.flickr.com/photos/10345599@N03/12543126645
 *   "Museum of Islamic Art - Doha, Qatar" (ToGa Wanderings, CC BY 2.0) — the
 *     entrance front from the park: portal arch, canopy, twin windows, the
 *     tiers, the cube seen on its corner; https://www.flickr.com/photos/69031678@N00/12187468733
 *   "Museum of Islamic Art, Doha, Qatar" (jikatu, CC BY-SA 2.0) — night: the
 *     long wing's upper arcade, striped base, floodlit stone;
 *     https://www.flickr.com/photos/7221539@N06/8171890818
 *   "Doha - towards the islamic art museum.jpg" (Chainwit., CC BY-SA 4.0) —
 *     from the east along the seawall, midday: stone colour, step profile;
 *     https://commons.wikimedia.org/wiki/File:Doha_-_towards_the_islamic_art_museum.jpg
 *   "IslamicArtMuseumDohaSkyline.jpg" (Mohamod Fasil, CC BY 2.0) — from above
 *     the park: the main building and the long low wing;
 *     https://commons.wikimedia.org/wiki/File:IslamicArtMuseumDohaSkyline.jpg
 *   "Doha - Museum of Islamic Art.jpg" (Marek Śliwecki, CC BY-SA 4.0) — the
 *     courtyard arcade; https://commons.wikimedia.org/wiki/File:Doha_-_Museum_of_Islamic_Art.jpg
 *
 * Heights: the tower top is drawn at 50 m. OSM tags the tower part 40 m,
 * but the tower part is a 15.7 m square, and the front photo's cube is
 * 0.31 of the total height across its diagonal, which with that square gives
 * ~51 m; published accounts give the domed atrium inside as 45–50 m high
 * (Architectural Record, archeyes, dezeen). So 50 m, and the photos'
 * proportions for the rest (estimated, scaled from the ToGa front photo):
 * granite base 2.6 m; portal block 15.2 m, 34 m wide, its round arch 10 m;
 * the outer square ±26 m to 25.5 m with its corners notched down to 20.5 m,
 * raised central bays to 27 m with the twin windows; the next square ±19 m to
 * 31 m (corners 28 m); ±12 m to 36.7 m; the cube 36.7–50 m. The plan
 * (52 m square plus the portal block) sits between the OSM entrance canopy
 * and the OSM tower part; the courtyard, wing and arcade follow the OSM
 * outline and the courtyard features.
 * Stone: sunlit #e8dac9 (Chainwit, midday), drawn #ecdfca; the dark striped
 * granite bands #6f6a64.
 *
 * Doubts: no open aerial exists, so the main building's plan, its depth and
 * the education wing's internal shape are estimated; the north (sea) side is
 * unphotographed in licensed sources and is drawn symmetric with a tall
 * window, as described. The OSM outline is coarse; the model keeps inside it.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------- helpers --

export type P2 = [number, number]

/** lng/lat → local metres in a frame turned to `bearing` (local +y points to the bearing). */
export function projector(lng0: number, lat0: number, bearing: number) {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
  const b = (bearing * Math.PI) / 180
  return (lng: number, lat: number): P2 => {
    const e = (lng - lng0) * kx, n = (lat - lat0) * ky
    return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
  }
}

const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const subV = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dotV = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle wound so its face normal points along `hint`. */
export function otri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  if (dotV(crossV(subV(b, a), subV(c, a)), hint) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A quad wound so its face normal points along `hint`. */
export function oquad(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  otri(p, a, b, c, hint)
  otri(p, a, c, d, hint)
}

export const area2 = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Ear-clipping triangulation of a simple CCW polygon: index triples. */
export function earcut(p: P2[]): [number, number, number][] {
  const idx = p.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: P2, a: P2, b: P2, c: P2) => cz(a, b, q) >= -1e-9 && cz(b, c, q) >= -1e-9 && cz(c, a, q) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = p[i0], b = p[i1], c = p[i2]
      if (cz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(p[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat horizontal cap over a CCW polygon. */
export function capPoly(part: Part, p: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(p)) {
    const A: V3 = [p[a][0], p[a][1], z], B: V3 = [p[b][0], p[b][1], z], C: V3 = [p[c][0], p[c][1], z]
    if (up) part.tri(A, B, C); else part.tri(A, C, B)
  }
}

/** A rectangle with its corners cut at 45° by `c` (an octagon when c > 0), CCW. */
export function octo(cx: number, cy: number, hx: number, hy: number, c = 0): P2[] {
  if (c <= 0) return [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]
  return [[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
    [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]]
}

/** A regular n-gon of radius r, CCW, first corner at angle a0. */
export function ngon(cx: number, cy: number, r: number, n: number, a0 = 0): P2[] {
  return Array.from({ length: n }, (_, i) => { const a = a0 + (2 * Math.PI * i) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as P2 })
}

/**
 * An opening in a facade, in the face's own coordinates: `s0..s1` along the
 * face, from `zb` (sill) to `zs` (springing), then a head: 'flat', 'round'
 * (a semicircle) or 'seg' (a circular segment of rise `rise`). `depth` is how
 * far the window sits back from the face.
 */
export type Opening = { s0: number; s1: number; zb: number; zs: number; head?: 'flat' | 'round' | 'seg'; rise?: number; depth?: number }

function headPts(o: Opening, n: number): P2[] {
  const w = o.s1 - o.s0, sc = (o.s0 + o.s1) / 2
  if (!o.head || o.head === 'flat') return [[o.s1, o.zs], [o.s0, o.zs]]
  if (o.head === 'round') {
    const r = w / 2
    return Array.from({ length: n + 1 }, (_, k) => { const a = (Math.PI * k) / n; return [sc + r * Math.cos(a), o.zs + r * Math.sin(a)] as P2 })
  }
  const h = o.rise ?? w / 4, R = (w * w / 4 + h * h) / (2 * h), zc = o.zs + h - R, a0 = Math.asin((w / 2) / R)
  return Array.from({ length: n + 1 }, (_, k) => { const a = Math.PI / 2 - a0 + (2 * a0 * k) / n; return [sc + R * Math.cos(a), zc + R * Math.sin(a)] as P2 })
}
const headTop = (o: Opening) => !o.head || o.head === 'flat' ? o.zs : o.head === 'round' ? o.zs + (o.s1 - o.s0) / 2 : o.zs + (o.rise ?? (o.s1 - o.s0) / 4)

/**
 * A vertical wall face from A to B (plan points; outward normal on the right
 * of A→B, as for a CCW outline) between z0 and z1, with real openings cut
 * into it: the jambs, sills and arched heads are reveal faces going `depth`
 * into the wall, and the window itself is a panel at the back of the recess
 * (`back`), or nothing when `back` is null (an open arch).
 */
export function facade(wall: Part, back: Part | null, A: P2, B: P2, z0: number, z1: number, openings: Opening[] = [], seg = 8, reveal: Part | null = wall) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: V3 = [u[1], -u[0], 0]
  const at = (s: number, z: number, d = 0): V3 => [A[0] + u[0] * s - nrm[0] * d, A[1] + u[1] * s - nrm[1] * d, z]
  const rect = (sa: number, sb: number, za: number, zb: number) => { if (sb - sa > 1e-6 && zb - za > 1e-6) oquad(wall, at(sa, za), at(sb, za), at(sb, zb), at(sa, zb), nrm) }
  const ops = [...openings].sort((a, b) => a.s0 - b.s0)
  let s = 0
  for (const o of ops) {
    rect(s, o.s0, z0, z1)
    const top = headTop(o)
    rect(o.s0, o.s1, z0, o.zb)
    rect(o.s0, o.s1, top, z1)
    const hp = headPts(o, seg) // from the right springing to the left
    if (o.head && o.head !== 'flat') {
      const TL = at(o.s0, top), TR = at(o.s1, top), half = seg / 2
      for (let k = 0; k < seg; k++) {
        const a = at(hp[k][0], hp[k][1]), b = at(hp[k + 1][0], hp[k + 1][1])
        otri(wall, k < half ? TR : TL, a, b, nrm)
      }
    }
    // the outline of the hole, going round: sill, right jamb, head, left jamb
    const ring: P2[] = [[o.s0, o.zb], [o.s1, o.zb], ...hp]
    const d = o.depth ?? 0.8, cs = (o.s0 + o.s1) / 2, cz = (o.zb + top) / 2
    if (reveal) for (let k = 0; k < ring.length; k++) {
      const p = ring[k], q = ring[(k + 1) % ring.length]
      const mid: P2 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
      const toward = at(cs, cz, d / 2), from = at(mid[0], mid[1], d / 2)
      oquad(reveal, at(p[0], p[1]), at(q[0], q[1]), at(q[0], q[1], d), at(p[0], p[1], d), subV(toward, from))
    }
    if (back) for (let k = 0; k < ring.length; k++) {
      const p = ring[k], q = ring[(k + 1) % ring.length]
      otri(back, at(cs, cz, d), at(p[0], p[1], d), at(q[0], q[1], d), nrm)
    }
    s = o.s1
  }
  rect(s, L, z0, z1)
}

/** Walls round a CCW polygon (split into ≤ maxLen pieces), plus a top cap. */
export function prism(part: Part, poly: P2[], z0: number, z1: number, top: Part | null = part, maxLen = 6) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxLen))
    for (let k = 0; k < n; k++) {
      const pa: P2 = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const pb: P2 = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      part.quad([pa[0], pa[1], z0], [pb[0], pb[1], z0], [pb[0], pb[1], z1], [pa[0], pa[1], z1])
    }
  }
  if (top) capPoly(top, poly, z1, true)
}

/** A slab with a 45° bevelled top lip: walls to z1 - bev, then an inset ring. */
export function bevelPrism(part: Part, poly: P2[], z0: number, z1: number, bev = 0.4, top: Part = part) {
  const inner = insetPoly(poly, bev)
  prism(part, poly, z0, z1 - bev, null)
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length
    part.quad([poly[i][0], poly[i][1], z1 - bev], [poly[j][0], poly[j][1], z1 - bev], [inner[j][0], inner[j][1], z1], [inner[i][0], inner[i][1], z1])
  }
  capPoly(top, inner, z1, true)
}

/** Inset a CCW polygon by d (miter). */
export function insetPoly(p: P2[], d: number): P2[] {
  const n = p.length
  return p.map((c, i) => {
    const a = p[(i + n - 1) % n], b = p[(i + 1) % n]
    const e1 = nrm2([c[0] - a[0], c[1] - a[1]]), e2 = nrm2([b[0] - c[0], b[1] - c[1]])
    const n1: P2 = [-e1[1], e1[0]], n2: P2 = [-e2[1], e2[0]]
    const m = nrm2([n1[0] + n2[0], n1[1] + n2[1]])
    const cos = Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
    return [c[0] + (m[0] * d) / cos, c[1] + (m[1] * d) / cos]
  })
}
export const nrm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A solid of revolution about the vertical axis at (cx, cy): profile [r, z] from bottom to top. */
export function lathe(part: Part, cx: number, cy: number, profile: P2[], n = 16, smooth = true, a0 = 0) {
  for (let k = 0; k + 1 < profile.length; k++) {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    const nr = dz / l, nz = -dr / l
    for (let i = 0; i < n; i++) {
      const a = a0 + (2 * Math.PI * i) / n, b = a0 + (2 * Math.PI * (i + 1)) / n
      const pa0: V3 = [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0], pb0: V3 = [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), z0]
      const pa1: V3 = [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1], pb1: V3 = [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1]
      const na: V3 = [nr * Math.cos(a), nr * Math.sin(a), nz], nb: V3 = [nr * Math.cos(b), nr * Math.sin(b), nz]
      if (smooth) {
        if (r0 > 1e-6) part.tri(pa0, pb0, pb1, [0, 0], [0, 0], [0, 0], [na, nb, nb])
        if (r1 > 1e-6) part.tri(pa0, pb1, pa1, [0, 0], [0, 0], [0, 0], [na, nb, na])
        else if (r0 > 1e-6) { /* apex: one triangle above */ }
      } else {
        const hint: V3 = [Math.cos((a + b) / 2) * nr, Math.sin((a + b) / 2) * nr, nz]
        if (r0 > 1e-6) otri(part, pa0, pb0, pb1, hint)
        if (r1 > 1e-6) otri(part, pa0, pb1, pa1, hint)
      }
    }
  }
}

/** A round tube of radius r through 3D points (open ends, smooth). */
export function tube(part: Part, pts: V3[], r: number, n = 8, caps = false) {
  const frames: { c: V3; u: V3; v: V3 }[] = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    let t = subV(b, a); const tl = Math.hypot(...t); t = [t[0] / tl, t[1] / tl, t[2] / tl]
    const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    let u = crossV(t, ref); const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
    const v = crossV(t, u)
    frames.push({ c: pts[i], u, v })
  }
  const ring = (f: { c: V3; u: V3; v: V3 }, k: number): [V3, V3] => {
    const a = (2 * Math.PI * k) / n, ca = Math.cos(a), sa = Math.sin(a)
    const d: V3 = [f.u[0] * ca + f.v[0] * sa, f.u[1] * ca + f.v[1] * sa, f.u[2] * ca + f.v[2] * sa]
    return [[f.c[0] + d[0] * r, f.c[1] + d[1] * r, f.c[2] + d[2] * r], d]
  }
  for (let i = 0; i + 1 < frames.length; i++) for (let k = 0; k < n; k++) {
    const [a, na] = ring(frames[i], k), [b, nb] = ring(frames[i], k + 1), [c, nc] = ring(frames[i + 1], k + 1), [d, nd] = ring(frames[i + 1], k)
    part.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
    part.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
  }
  if (caps) for (const [f, sgn] of [[frames[0], -1], [frames[frames.length - 1], 1]] as const) {
    const i0 = sgn < 0 ? 0 : frames.length - 1, j = sgn < 0 ? 1 : frames.length - 2
    const t = subV(pts[i0], pts[j])
    for (let k = 0; k < n; k++) otri(part, f.c, ring(f, k)[0], ring(f, k + 1)[0], t)
  }
}

/** A box between two plan corners, turned by `rot` about (cx, cy) — for posts and small blocks. */
export function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  const poly: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(part, poly, z0, z1)
  if (bottom) capPoly(part, poly, z0, false)
}

export type Mat = { part: Part; material: MaterialSpec }
export const tris = (parts: Mat[]) => parts.reduce((t, { part }) => t + part.triangles, 0)

/** Write a GLB under models/, report its size, and warn on the budget. */
export async function writeModel(file: string, title: string, parts: Mat[], maxTris: number, maxBytes: number, extras: Record<string, unknown> = {}) {
  const live = parts.filter((p) => p.part.triangles > 0)
  const t = tris(live)
  console.log(live.map(({ part, material }) => `${material.name}:${part.triangles}`).join(' '))
  const glb = writeGlb(title, live, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (t > maxTris) console.warn(`${file}: triangle budget exceeded: ${t} > ${maxTris}`)
  if (glb.length > maxBytes) console.warn(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${t} triangles, ${glb.length} bytes`)
}

// ------------------------------------------------------------------ model --

const BEARING = 337.5
const ANCHOR = { lng: 51.539397, lat: 25.295528 }

function build() {
  const stone = new Part(), granite = new Part(), win = new Part(), metal = new Part(), deep = new Part()

  /** A tier: an octagon prism whose four main faces carry openings. */
  const tier = (cx: number, cy: number, hx: number, hy: number, c: number, z0: number, z1: number, ops: Partial<Record<'s' | 'e' | 'n' | 'w', Opening[]>> = {}) => {
    const p = octo(cx, cy, hx, hy, c)
    const face = (i: number) => (c > 0 ? ['s', null, 'e', null, 'n', null, 'w', null][i] : ['s', 'e', 'n', 'w'][i]) as 's' | 'e' | 'n' | 'w' | null
    for (let i = 0; i < p.length; i++) {
      const f = face(i)
      facade(stone, win, p[i], p[(i + 1) % p.length], z0, z1, f ? ops[f] ?? [] : [])
    }
    bevelPrismTop(p, z1)
  }
  const bevelPrismTop = (p: P2[], z1: number) => {
    const inner = insetPoly(p, 0.35)
    for (let i = 0; i < p.length; i++) {
      const j = (i + 1) % p.length
      stone.quad([p[i][0], p[i][1], z1], [p[j][0], p[j][1], z1], [inner[j][0], inner[j][1], z1 + 0.35], [inner[i][0], inner[i][1], z1 + 0.35])
    }
    capPoly(stone, inner, z1 + 0.35, true)
  }
  /** Openings centred on a face of length L. */
  const centred = (L: number, w: number, zb: number, zs: number, head: Opening['head'] = 'round', depth = 0.9, gap = 0, count = 1): Opening[] => {
    const tot = count * w + (count - 1) * gap, s0 = (L - tot) / 2
    return Array.from({ length: count }, (_, k) => ({ s0: s0 + k * (w + gap), s1: s0 + k * (w + gap) + w, zb, zs, head, depth }))
  }

  /** A square tier with its corners notched down: a cross to z1, corner blocks to zc. */
  const crossTier = (cx: number, cy: number, h: number, n: number, z0: number, z1: number, zc: number, ops: Partial<Record<'s' | 'e' | 'n' | 'w', Opening[]>> = {}) => {
    const a = h - n
    const p: P2[] = [[cx - a, cy - h], [cx + a, cy - h], [cx + a, cy - a], [cx + h, cy - a], [cx + h, cy + a], [cx + a, cy + a],
      [cx + a, cy + h], [cx - a, cy + h], [cx - a, cy + a], [cx - h, cy + a], [cx - h, cy - a], [cx - a, cy - a]]
    const face = ['s', null, null, 'e', null, null, 'n', null, null, 'w', null, null] as const
    for (let i = 0; i < p.length; i++) { const f = face[i]; facade(stone, win, p[i], p[(i + 1) % p.length], f ? z0 : zc, z1, f ? ops[f] ?? [] : []) }
    bevelPrismTop(p, z1)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const q = octo(cx + sx * (h - n / 2), cy + sy * (h - n / 2), n / 2, n / 2, 0)
      for (let i = 0; i < 4; i++) facade(stone, null, q[i], q[(i + 1) % 4], z0, zc)
      bevelPrismTop(q, zc)
    }
  }
  // ---- Main building, centred on MX, MY (between the canopy and the OSM tower part).
  // A square ziggurat read from the front photo: an outer ring to 20.4 m
  // (±27 m, corners cut at 45°), a raised central bay on each face to 21.7 m,
  // the next square to 24.8 m (±18), the next to 29.4 m (±10), the turned cube
  // to 40 m. Low 12.3 m blocks stand in front of the south (portal) and west
  // (triple window) faces.
  const MX = -32, MY = 2
  const O = 26, M = 19, I = 12, ZO = 25.5, ZB = 27, ZM = 31, ZI = 36.7, ZT = 50, ZP = 15.2, GB = 2.6
  prism(granite, octo(MX, MY, O + 0.3, O + 0.3, 2.3), 0, GB, null)
  {
    const L = 2 * (O - 7)
    const twin = centred(L, 2.0, 20, 23.2, 'round', 0.9, 1.2, 2)
    crossTier(MX, MY, O, 7, GB, ZO, ZO - 5, { s: twin, e: twin, w: twin, n: [...twin, { s0: L / 2 - 9, s1: L / 2 + 9, zb: 3.5, zs: 17, head: 'flat', depth: 1.2 }] })
    // the raised central bay on each face
    const h = 10
    box(stone, MX - h, MX + h, MY - O, MY - M, ZO, ZB)
    box(stone, MX - h, MX + h, MY + M, MY + O, ZO, ZB)
    box(stone, MX - O, MX - M, MY - h, MY + h, ZO, ZB)
    box(stone, MX + M, MX + O, MY - h, MY + h, ZO, ZB)
  }
  crossTier(MX, MY, M, 5, ZO, ZM, ZM - 3)
  tier(MX, MY, I, I, 1, ZM, ZI)
  // The portal block on the south face: 34 m wide, 15.2 m, a 10 m round arch.
  {
    const y0 = MY - O - 8, x0 = MX - 17, x1 = MX + 17
    const p: P2[] = [[x0, y0], [x1, y0], [x1, MY - O + 0.1], [x0, MY - O + 0.1]]
    prism(granite, p, 0, GB, null)
    facade(stone, win, p[0], p[1], GB, ZP, [{ s0: 17 - 5, s1: 17 + 5, zb: GB, zs: 9, head: 'round', depth: 2.4 }])
    facade(stone, win, p[1], p[2], GB, ZP)
    facade(stone, win, p[3], p[0], GB, ZP)
    bevelPrismTop(p, ZP)
    // the striped granite courses either side of the portal: proud bands
    for (const [a, b] of [[x0 + 0.3, MX - 5.8], [MX + 5.8, x1 - 0.3]]) for (let k = 0; k < 4; k++) {
      const z = GB + 0.4 + k * 1.3
      box(granite, a, b, y0 - 0.12, y0 + 0.02, z, z + 0.6)
    }
    box(deep, MX - 3.5, MX + 3.5, y0 + 2.25, y0 + 2.35, GB, 7)
  }
  // The west block with the triple-arched window.
  {
    const p: P2[] = [[MX - O - 8, MY - 14], [MX - O + 0.1, MY - 14], [MX - O + 0.1, MY + 14], [MX - O - 8, MY + 14]]
    prism(granite, p, 0, GB, null)
    facade(stone, win, p[0], p[1], GB, ZP)
    facade(stone, win, p[2], p[3], GB, ZP)
    facade(stone, win, p[3], p[0], GB, ZP, centred(28, 2.8, 5, 9.5, 'round', 1.0, 0.9, 3))
    bevelPrismTop(p, ZP)
  }
  // The cube, turned 45°: 15.7 m a side (OSM way/769768768), 36.7–50 m, an eye window on each face.
  {
    const cx = MX, cy = MY, h = 15.7 / Math.SQRT2, zc = ZI + 0.35
    const p: P2[] = [[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]]
    for (let i = 0; i < 4; i++) facade(stone, win, p[i], p[(i + 1) % 4], zc, ZT, [{ s0: 3.9, s1: 11.8, zb: 39.6, zs: 39.6, head: 'seg', rise: 2.6, depth: 1.2 }], 10)
    bevelPrismTop(p, ZT)
    // the faceted collar: sloped facets from the square below up to the cube's faces
    for (let i = 0; i < 4; i++) {
      const a = p[i], b = p[(i + 1) % 4], m: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const out = nrm2([m[0] - cx, m[1] - cy]), tip: P2 = [cx + out[0] * (I * Math.SQRT2 - 1), cy + out[1] * (I * Math.SQRT2 - 1)]
      otri(stone, [a[0], a[1], zc + 2], [b[0], b[1], zc + 2], [tip[0], tip[1], zc], [out[0], out[1], 1])
      otri(stone, [a[0], a[1], zc + 2], [tip[0], tip[1], zc], [a[0], a[1], zc], [out[0] - out[1], out[1] + out[0], 0])
      otri(stone, [b[0], b[1], zc + 2], [b[0], b[1], zc], [tip[0], tip[1], zc], [out[0] + out[1], out[1] - out[0], 0])
    }
  }
  // Entrance canopy: a disc on four slim posts in front of the portal (OSM way/769768767).
  {
    const cx = MX + 0.5, cy = MY - O - 8 - 5
    lathe(metal, cx, cy, [[0, 3.6], [8.2, 3.6], [8.2, 4.2], [0, 4.2]], 16, false)
    for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) lathe(metal, cx + dx, cy + dy, [[0.25, 0], [0.25, 3.6]], 6, true)
  }

  // ---- The low west wing on the pier, with its stair-side arches.
  {
    const p = octo(-78, 3, 11, 15, 0)
    prism(granite, p, 0, 1.4, null)
    for (let i = 0; i < 4; i++) {
      const ops: Opening[][] = [
        [{ s0: 4, s1: 8, zb: 3, zs: 6, head: 'round', depth: 1.4 }, { s0: 14, s1: 18, zb: 3, zs: 6, head: 'round', depth: 1.4 }],
        [], [], [{ s0: 11, s1: 19, zb: 1.4, zs: 5, head: 'round', depth: 2.0 }],
      ]
      facade(stone, win, p[i], p[(i + 1) % 4], 1.4, 9, ops[i])
    }
    bevelPrismTop(p, 9)
    // the two lamp columns at the pier's edge
    for (const y of [-25, -7]) {
      lathe(granite, -91, y, [[1.25, 0], [1.25, 2.2]], 12, true)
      lathe(stone, -91, y, [[0.95, 2.2], [0.95, 21], [0.7, 21.6]], 12, true)
      lathe(metal, -91, y, [[0.35, 21.6], [0.35, 22], [2.6, 22.1], [2.6, 22.5], [0, 22.6]], 12, false)
    }
  }

  // ---- Link block between the main building and the courtyard.
  {
    const p: P2[] = [[-4, -18], [16, -18], [16, 30], [-4, 30]]
    for (let i = 0; i < 4; i++) facade(stone, win, p[i], p[(i + 1) % 4], 0, 9, i === 1 ? [{ s0: 18, s1: 30, zb: 0, zs: 4.5, head: 'round', depth: 1.5 }] : [])
    bevelPrismTop(p, 9)
  }
  // ---- South range along the park: the long wing with its upper loggia of ten arches.
  {
    const p: P2[] = [[-4, -32.5], [58, -32.5], [58, -16], [-4, -16]]
    const loggia: Opening[] = Array.from({ length: 10 }, (_, k) => ({ s0: 13 + k * 4.4, s1: 13 + k * 4.4 + 3.4, zb: 6, zs: 8.4, head: 'round' as const, depth: 2.0 }))
    const low: Opening[] = Array.from({ length: 10 }, (_, k) => ({ s0: 13.9 + k * 4.4, s1: 13.9 + k * 4.4 + 1.6, zb: 2.6, zs: 3.8, head: 'flat' as const, depth: 0.5 }))
    facade(stone, win, p[0], p[1], 0, 11.5, [...loggia, ...low].sort((a, b) => a.s0 - b.s0).filter((o, i, a) => i === 0 || o.s0 >= a[i - 1].s1))
    for (let i = 1; i < 4; i++) facade(stone, win, p[i], p[(i + 1) % 4], 0, 11.5, i === 2 ? Array.from({ length: 6 }, (_, k) => ({ s0: 18 + k * 6, s1: 22 + k * 6, zb: 0, zs: 3.6, head: 'round' as const, depth: 2.4 })) : [])
    bevelPrismTop(p, 11.5)
    // striped base courses
    for (let k = 0; k < 3; k++) box(granite, -3.5, 57.5, -32.62, -32.48, 1.5 + k * 1.2, 2.0 + k * 1.2)
  }
  // ---- Courtyard arcade on the sea side: an open arcade, real arches through a 3 m wall.
  {
    const A: P2 = [16, 24], B: P2 = [58, 24], t = 3
    const ops = (L: number): Opening[] => Array.from({ length: 6 }, (_, k) => { const s = 2.2 + k * 6.6; return { s0: s, s1: s + 5.0, zb: 0, zs: 4.6, head: 'round' as const, depth: t } })
    facade(stone, null, A, B, 0, 9, ops(42)) // courtyard side (faces -y)… wound by its own normal
    facade(stone, null, [B[0], B[1] + t], [A[0], A[1] + t], 0, 9, ops(42).map((o) => ({ ...o, s0: 42 - o.s1, s1: 42 - o.s0 })), 8, null)
    capPoly(stone, [[16, 24], [58, 24], [58, 27], [16, 27]], 9, true)
    for (const x of [16, 58]) facade(stone, null, x === 16 ? [16, 27] : [58, 24], x === 16 ? [16, 24] : [58, 27], 0, 9)
  }
  // ---- Education wing at the east end, its iwan arch facing the courtyard.
  {
    const p: P2[] = [[58, -32.5], [92, -32.5], [92, 36], [58, 36]]
    const arcade: Opening[] = Array.from({ length: 5 }, (_, k) => ({ s0: 4 + k * 5.6, s1: 8 + k * 5.6, zb: 0, zs: 3.6, head: 'round' as const, depth: 2.4 }))
    facade(stone, win, p[0], p[1], 0, 12, arcade)
    facade(stone, win, p[1], p[2], 0, 12, centred(68.5, 3, 5.5, 8.5, 'round', 0.8, 5, 5))
    facade(stone, win, p[2], p[3], 0, 12, centred(34, 3, 5.5, 8.5, 'round', 0.8, 4, 3))
    facade(stone, win, p[3], p[0], 0, 12, [{ s0: 34.5, s1: 47.5, zb: 0, zs: 4.5, head: 'round', depth: 3.0 }, { s0: 51, s1: 54, zb: 5.5, zs: 8.5, head: 'round', depth: 0.8 }, { s0: 57, s1: 60, zb: 5.5, zs: 8.5, head: 'round', depth: 0.8 }])
    bevelPrismTop(p, 12)
    // a raised block over the iwan
    tier(70, 11, 9, 10, 0, 12, 16)
  }
  // ---- The courtyard pavilion (OSM way/769768746): a small domed kiosk on four piers.
  {
    const cx = 37.8, cy = 3.9
    for (const [dx, dy] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) box(stone, cx + dx - 0.6, cx + dx + 0.6, cy + dy - 0.6, cy + dy + 0.6, 0, 4.2)
    prism(stone, octo(cx, cy, 4.9, 4.9, 1.2), 4.2, 5.0)
    lathe(stone, cx, cy, [[3.6, 5.0], [3.4, 5.9], [2.6, 6.8], [1.4, 7.4], [0, 7.6]], 12, true)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : p[2] < 1.6 ? 0.2 : 0.8)
  return [
    { part: stone, material: { ...finish('mia-limestone', 0xecdfca), floodlight: lit } },
    { part: granite, material: finish('mia-granite', 0x6f6a64) },
    { part: win, material: { ...PALETTE.window, color: 0x5d6a73 } },
    { part: deep, material: PALETTE.entrance },
    { part: metal, material: finish('mia-steel', 0x8d9399, 0.5) },
  ] as Mat[]
}

if (import.meta.main) {
  await writeModel('doha-museum-of-islamic-art.glb', 'Museum of Islamic Art', build(), 6500, 250 * 1024, { bearing: BEARING, height: 40, anchor: ANCHOR })
}
