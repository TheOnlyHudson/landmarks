/**
 * The Science Pyramid, Denver Botanic Gardens (2017) — procedural, CC0-1.0, no textures.
 * bun generators/den-science-pyramid.ts
 *
 * What makes it this building: a low pyramid split in two along its south-west to north-east
 * diagonal by a narrow glazed slot, the two halves rising to slightly different peaks; the
 * faces clad in light grey hexagonal panels with clusters of charcoal hexagons; a pale
 * concrete plinth round the base by the pool; a long low window along the west face.
 *
 * Frame: x east, y north (bearing 0), z up, metres; origin at the centroid of OSM
 * way/584894104. z = 0 is the ground at the base (lidar ground about 1 m above the box's
 * ground_min, 1615.9 m NAVD88; the site is level).
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/584894104 (building=yes, height 6, "The
 *   Science Pyramid"); parts way/584894105 (west half, skillion facing 310°),
 *   way/584894106 (east half, skillion facing 130°), way/584894107 (the slot between).
 *   OSM's 6 m is too low against the lidar.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 0.5 m grid: the peak 10–11 m above
 *   ground_min, about 10 m above the base, at the middle of the slot; the faces falling to
 *   about 3 m at the outline (cells straddling the base edge).
 * - USGS NAIP: the two halves lit differently (west half facing north-west, east half
 *   south-east), the slot.
 * - Photos (EVIDENCE):
 *   - tyler.cipriani, CC BY-SA 2.0: https://www.flickr.com/photos/100417748@N07/33012476026
 *     (a face with the long window, across the pool)
 *   - Sarbjit Bahga, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Botanic_Gardens-22.jpg
 *     (from the south: the slot and the east half's south face)
 * - Look-only (CC BY-NC-ND, not relied on): Denverphotoscapes, "Science Pyramid",
 *   https://www.flickr.com/photos/23002449@N02/33516118635
 *
 * Measured / published / estimated:
 * - measured: plan (OSM), peak height (lidar).
 * - estimated from photos: the plinth (0.8 m), the halves' peaks (10.4 and 9.2 m, within the lidar's 10–11 m cell maxima), the hexagon
 *   size and the dark clusters (a regular pattern, not the real one), the long window's
 *   length and height and which face carries it (the photo's direction is not certain).
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { face } from './bridge-kit'
import { finish, PALETTE } from './palette'

type P2 = [number, number]
const PL = 0.8 // plinth height

// the two halves (OSM parts), each listed with its slot-side edge last
const WEST: P2[] = [[-7.1, -8.3], [-9.3, -11.1], [-11.8, -11.1], [-12.8, -6.2], [-11.2, -4.8], [-11.7, 0.7], [-12.0, 5.8],
  [-11.8, 9.9], [-11.7, 11.4], [-2.8, 12.2], [1.5, 11.8], [2.4, 10.5], [3.0, 6.8], [0.7, 2.3]]
const EAST: P2[] = [[5.7, 7.7], [8.9, 11.8], [10.9, 11.8], [11.8, 10.8], [11.0, 2.6], [11.9, -2.9], [13.6, -6.0], [11.2, -11.4],
  [-0.9, -11.3], [-6.2, -8.6]]
const PW: V3 = [-0.6, 1.4, 10.4], PE: V3 = [1.0, 0.4, 9.2]

/** One triangle wound to face n. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = cross(sub(b, a), sub(c, a))
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** Hexagons on triangle abc (in its plane, `off` proud), dark ones where `dark(i, j)`. */
function hexes(lite: Part, dark: Part, a: V3, b: V3, c: V3, r: number, isDark: (i: number, j: number) => boolean) {
  const n = norm(cross(sub(b, a), sub(c, a)))
  const n2: V3 = n[2] < 0 ? [-n[0], -n[1], -n[2]] : n
  // in-plane axes: u horizontal, v up the slope
  const u = norm(cross([0, 0, 1], n2)), v = cross(n2, u)
  const to2 = (p: V3): P2 => { const d = sub(p, a); return [d[0] * u[0] + d[1] * u[1] + d[2] * u[2], d[0] * v[0] + d[1] * v[1] + d[2] * v[2]] }
  const A = to2(a), B = to2(b), C = to2(c)
  const cr = (p: P2, q: P2, s: P2) => (q[0] - p[0]) * (s[1] - p[1]) - (q[1] - p[1]) * (s[0] - p[0])
  const sg = Math.sign(cr(A, B, C))
  const inside = (p: P2) => sg * cr(A, B, p) > 0.05 && sg * cr(B, C, p) > 0.05 && sg * cr(C, A, p) > 0.05
  const dx = r * Math.sqrt(3), dy = r * 1.5
  const gx = (A[0] + B[0] + C[0]) / 3, gy = (A[1] + B[1] + C[1]) / 3 + 0.8
  const xs = [A[0], B[0], C[0]], ys = [A[1], B[1], C[1]]
  const g0 = Math.floor(Math.min(...ys) / dy), g1 = Math.ceil(Math.max(...ys) / dy)
  for (let j = g0; j <= g1; j++) {
    const i0 = Math.floor(Math.min(...xs) / dx) - 1, i1 = Math.ceil(Math.max(...xs) / dx) + 1
    for (let i = i0; i <= i1; i++) {
      const cx = i * dx + (j % 2 ? dx / 2 : 0), cy = j * dy
      const ring: P2[] = Array.from({ length: 6 }, (_, k) => { const t = Math.PI / 6 + (k * Math.PI) / 3; return [cx + 0.86 * r * Math.cos(t), cy + 0.86 * r * Math.sin(t)] as P2 })
      if (!ring.every(inside)) continue
      const p = isDark(i - Math.round(gx / dx), j - Math.round(gy / dy)) ? dark : lite
      if (p === lite) continue
      const P = ring.map(([x, y]) => [a[0] + u[0] * x + v[0] * y + n2[0] * 0.05, a[1] + u[1] * x + v[1] * y + n2[1] * 0.05, a[2] + u[2] * x + v[2] * y + n2[2] * 0.05] as V3)
      for (let k = 1; k < 5; k++) tri(p, P[0], P[k], P[k + 1], n2)
    }
  }
}

export function build() {
  const clad = new Part(), dark = new Part(), slot = new Part(), plinth = new Part(), win = new Part()
  let faceNo = 0
  for (const [poly, apex] of [[WEST, PW], [EAST, PE]] as [P2[], V3][]) {
    const m = poly.length
    for (let i = 0; i < m; i++) {
      const a = poly[i], b = poly[(i + 1) % m]
      const isSlot = i === m - 1 // the closing edge runs along the slot
      const A: V3 = [a[0], a[1], PL], B: V3 = [b[0], b[1], PL]
      const n = norm(cross(sub(B, A), sub(apex, A)))
      // outward: away from the polygon's middle
      const mid = poly.reduce((s, p) => [s[0] + p[0] / m, s[1] + p[1] / m], [0, 0])
      const out = (a[0] + b[0]) / 2 - mid[0], outY = (a[1] + b[1]) / 2 - mid[1]
      const nn: V3 = n[0] * out + n[1] * outY >= 0 ? n : [-n[0], -n[1], -n[2]]
      tri(isSlot ? slot : clad, A, B, apex, nn)
      if (!isSlot) {
        // the plinth under this edge
        const nh = norm([nn[0], nn[1], 0])
        face(plinth, [a[0] + nh[0] * 0.15, a[1] + nh[1] * 0.15, 0], [b[0] + nh[0] * 0.15, b[1] + nh[1] * 0.15, 0], [b[0] + nh[0] * 0.15, b[1] + nh[1] * 0.15, PL], [a[0] + nh[0] * 0.15, a[1] + nh[1] * 0.15, PL], nh)
        face(plinth, [a[0] + nh[0] * 0.15, a[1] + nh[1] * 0.15, PL], [b[0] + nh[0] * 0.15, b[1] + nh[1] * 0.15, PL], [b[0], b[1], PL], [a[0], a[1], PL], [0, 0, 1])
        const f = faceNo++
        hexes(clad, dark, A, B, apex, 0.8, (ii, jj) => { const ci = (f % 3) - 1; return (ii - ci) ** 2 + 1.6 * jj * jj < 7 && ((ii * 5 + jj * 3 + f) % 7 + 7) % 7 !== 0 })
      } else {
        // the slot's floor strip and its plinth
        face(plinth, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PL], [a[0], a[1], PL], [nn[0], nn[1], 0])
      }
    }
  }
  // the slot between the halves: glazing joining the two ridge edges
  const w0: V3 = [WEST[0][0], WEST[0][1], PL], w1: V3 = [WEST[WEST.length - 1][0], WEST[WEST.length - 1][1], PL]
  const e0: V3 = [EAST[EAST.length - 1][0], EAST[EAST.length - 1][1], PL], e1: V3 = [EAST[0][0], EAST[0][1], PL]
  face(slot, w0, e0, PE, PW, [0.7, -0.7, 0.6])
  face(slot, PW, PE, e1, w1, [0.7, -0.7, 0.6])
  face(slot, w0, PW, PE, e0, [-0.7, 0.7, 0.6])
  // the long low window on the west face (tyler.cipriani's photo)
  {
    const a: P2 = [-11.7, 0.7], b: P2 = [-12.0, 5.8]
    const A: V3 = [a[0], a[1], PL], B: V3 = [b[0], b[1], PL]
    const t = 0.16 // up the face, as a share of the way to the apex
    const lift = (p: V3, s: number): V3 => [p[0] + (PW[0] - p[0]) * s, p[1] + (PW[1] - p[1]) * s, p[2] + (PW[2] - p[2]) * s]
    const n = norm(cross(sub(B, A), sub(PW, A)))
    const nn: V3 = n[0] < 0 ? n : [-n[0], -n[1], -n[2]]
    const off = (p: V3): V3 => [p[0] + nn[0] * 0.07, p[1] + nn[1] * 0.07, p[2] + nn[2] * 0.07]
    face(win, off(lift(A, 0.01)), off(lift(B, 0.01)), off(lift(B, t)), off(lift(A, t)), nn)
  }
  return { clad, dark, slot, plinth, win }
}

if (import.meta.main) {
  const m = build()
  const parts = [
    { part: m.clad, material: finish('hex-cladding', 0xa6abae) },
    { part: m.dark, material: finish('hex-cladding-dark', 0x555b60) },
    { part: m.slot, material: { ...PALETTE.glass, color: 0x5b6670 } },
    { part: m.plinth, material: finish('concrete', 0xddd6c9) },
    { part: m.win, material: PALETTE.window },
  ]
  const glb = writeGlb('The Science Pyramid', parts)
  await Bun.write(new URL('../models/den-science-pyramid.glb', import.meta.url), glb)
  console.log(`den-science-pyramid.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
