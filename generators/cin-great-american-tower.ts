/**
 * Great American Tower at Queen City Square (2011, HOK), Cincinnati —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-great-american-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor
 * (-84.507085, 39.099774: the centre of the shaft as lidar shows it, 1 m
 * from the OSM outline's centroid) on the lowest ground under the footprint
 * (East 3rd Street side). Built in the street grid's frame: x along 3rd and
 * 4th Streets (compass 80°), y up Sycamore/Broadway; placement bearing 350°.
 *
 * Form: a light blue glass shaft, a long rectangle with stepped (two-notch)
 * corners. The narrow east and west end bays stop at 121 m, the long faces
 * run on to 142.7 m; above them rounded tiers at 151 m, 159.7 m (the centre
 * bays of the long faces) and 164 m, and on top the open steel "tiara": a
 * row of arches spanning the short axis, sized to an elongated dome, tied by
 * a ridge and a ring. The tiara is lit at night, so its steel is `neon`;
 * a faint translucent skin carries its outline at phone size.
 *
 * Sources
 * - OSM: outline way/91493361 (height 202.7, 40 levels); relation/3626990
 *   (building=office) with parts way/271760074..077, 271761705/706/708,
 *   271764809/810. The parts' heights (106-162.7 m) are wrong against lidar
 *   and were not used; their plans agree with the tiers below.
 *   way/46128949 ("Great American Insurance Tower") is the Queen City Square
 *   parking garage north of the tower, a separate building; not modelled or
 *   replaced.
 * - Lidar (measured, USGS 3DEP OH_StatewideP3_6_B21, ~2021, above the 3rd
 *   Street ground): tiara apex 203 m; ring under it 164 m; centre bays of the
 *   long faces 159.7 m; rounded tier 151 m; long faces 142.7 m; end bays and
 *   corner notches 121 m; podium in the corner notches 21 m. Shaft 66.6 x
 *   43.2 m. Tiara base 48 x 29 m.
 * - Published: 665 ft / 202.7 m to the tiara, 41 storeys (Wikipedia, "Great
 *   American Tower at Queen City Square"); the tiara was inspired by
 *   Princess Diana's tiara.
 * - Photos (Wikimedia Commons):
 *   Bpluke01, "Great American Insurance Group skyscraper from Great American
 *   Ballpark" (CC BY-SA 4.0; from the south-south-east: the long face, its
 *   stepped corners, the tiara as a wide arch)
 *   https://commons.wikimedia.org/wiki/File:Great_American_Insurance_Group_skyscraper_from_Great_American_Ballpark.jpg
 *   Carlo Pelagalli, "Great American Insurance Group skyscraper - panoramio"
 *   (CC BY-SA 3.0; from the east, dusk: the end face, the tiara as a pointed
 *   lattice bulb, the stepped tiers)
 *   https://commons.wikimedia.org/wiki/File:Great_American_Insurance_Group_skyscraper_-_panoramio.jpg
 *   Warren LeMay, "Great American Tower at Queen City Square, Cincinnati, OH
 *   (47221092151)" (CC0; from the west along 4th Street: colours, white
 *   corner edges, the tiara's ribs and rings)
 *   https://commons.wikimedia.org/wiki/File:Great_American_Tower_at_Queen_City_Square,_Cincinnati,_OH_(47221092151).jpg
 * Estimated: the notch steps (2 m and 4 m), the floor-line grouping (three
 *   storeys), the tiara's profile between lidar samples and its arch count
 *   (eleven), colours pulled to the palette.
 * Left out: the red "Great American" sign on the crown band, the slot in the
 *   middle of each end face (121 m), the small lower step at the centre of
 *   the long faces (147 m), the teal entrance canopy.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, wallEdge, wallEdgeOff, edgeBase, type Prism, finishGlb, emit } from './sea-two-union-square'

// ---------------------------------------------------------------- helpers (shared by my cin-* models)

/** A superellipse ring, counter-clockwise, `n` points, exponent `p` (2 = ellipse). */
export function superellipse(hx: number, hy: number, p: number, n = 32, cx = 0, cy = 0): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const t = (2 * Math.PI * (k + 0.5)) / n, c = Math.cos(t), s = Math.sin(t)
    return [cx + hx * Math.sign(c) * Math.abs(c) ** (2 / p), cy + hy * Math.sign(s) * Math.abs(s) ** (2 / p)] as XY
  })
}

/** A rectangle with stepped notches at all four corners: steps [dx, dy] from the corner inward. */
export function notchedRect(hx: number, hy: number, steps: [number, number][]): XY[] {
  // one quadrant (x>0, y>0) from the east face to the north face, then mirrored
  const q: XY[] = [[hx, 0]]
  // staircase: from (hx, hy - dy0) inward
  let x = hx
  for (let i = 0; i < steps.length; i++) {
    const y = hy - steps[i][1]
    q.push([x, y])
    x = hx - steps[i][0]
    q.push([x, y])
  }
  q.push([x, hy])
  q.push([0, hy])
  // mirror into the other quadrants, counter-clockwise
  const out: XY[] = []
  for (const [sx, sy, rev] of [[1, 1, false], [-1, 1, true], [-1, -1, false], [1, -1, true]] as [number, number, boolean][]) {
    let pts = q.map(([a, b]) => [a * sx, b * sy] as XY)
    if (rev) pts = pts.reverse()
    out.push(...pts.slice(0, -1))
  }
  return ccw(out)
}

/** A closed tube of square section `w` x `d` along a path, single-sided, outward faces only. */
export function tube(part: Part, path: V3[], w: number, d: number, up: V3 = [0, 0, 1]) {
  const N = path.length
  const secs: V3[][] = []
  for (let i = 0; i < N; i++) {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(N - 1, i + 1)]
    let t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const tl = Math.hypot(...t) || 1
    t = [t[0] / tl, t[1] / tl, t[2] / tl]
    // side = t x up, normalised; if degenerate, use x
    let s: V3 = [t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0]]
    let sl = Math.hypot(...s)
    if (sl < 1e-6) { s = [1, 0, 0]; sl = 1 }
    s = [s[0] / sl, s[1] / sl, s[2] / sl]
    const u: V3 = [s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0]]
    const p = path[i]
    const P = (a: number, b: number): V3 => [p[0] + s[0] * a + u[0] * b, p[1] + s[1] * a + u[1] * b, p[2] + s[2] * a + u[2] * b]
    secs.push([P(-w / 2, -d / 2), P(w / 2, -d / 2), P(w / 2, d / 2), P(-w / 2, d / 2)])
  }
  for (let k = 0; k < N - 1; k++) {
    const r0 = secs[k], r1 = secs[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      // outward: winding chosen by checking against the section centre
      const c0: V3 = path[k]
      const m: V3 = [(r0[i][0] + r0[j][0]) / 2 - c0[0], (r0[i][1] + r0[j][1]) / 2 - c0[1], (r0[i][2] + r0[j][2]) / 2 - c0[2]]
      const e1: V3 = [r0[j][0] - r0[i][0], r0[j][1] - r0[i][1], r0[j][2] - r0[i][2]]
      const e2: V3 = [r1[i][0] - r0[i][0], r1[i][1] - r0[i][1], r1[i][2] - r0[i][2]]
      const nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0]
      if (nx * m[0] + ny * m[1] + nz * m[2] >= 0) part.quad(r0[i], r0[j], r1[j], r1[i])
      else part.quad(r0[i], r1[i], r1[j], r0[j])
    }
  }
  // end caps
  const capEnd = (r: V3[], c: V3, dir: V3) => {
    const e1: V3 = [r[1][0] - r[0][0], r[1][1] - r[0][1], r[1][2] - r[0][2]]
    const e2: V3 = [r[2][0] - r[0][0], r[2][1] - r[0][1], r[2][2] - r[0][2]]
    const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0) part.quad(r[0], r[1], r[2], r[3])
    else part.quad(r[3], r[2], r[1], r[0])
    void c
  }
  const dir = (a: V3, b: V3): V3 => [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  capEnd(secs[0], path[0], dir(path[1], path[0]))
  capEnd(secs[N - 1], path[N - 1], dir(path[N - 2], path[N - 1]))
}

/** Walls of stacked prisms (each from z0 = 0 unless given), hidden faces skipped, plus floor lines. */
export function prismWalls(
  prisms: Prism[],
  wall: (P: Prism) => Part,
  roof: Part,
  lines?: { part: Part; every: number; from: number; h: number },
  coping?: { part: Part; h: number },
  mullions?: { part: Part; every: number; w: number; minLen?: number },
) {
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(wall(P), r, i, z0, P.z1)
      if (lines) for (let z = lines.from; z < P.z1 - 2; z += lines.every) if (z > z0 + 1) wallEdgeOff(lines.part, r, i, z, z + lines.h, 0.05, 0.3)
      if (coping) wallEdgeOff(coping.part, r, i, P.z1 - coping.h, P.z1, 0.06, 0.3)
      if (mullions) {
        const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L >= (mullions.minLen ?? mullions.every)) {
          const n = Math.max(1, Math.round(L / mullions.every)), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [t[1] * 0.05, -t[0] * 0.05]
          for (let k = 1; k < n; k++) {
            const c: XY = [a[0] + (b[0] - a[0]) * (k / n) + o[0], a[1] + (b[1] - a[1]) * (k / n) + o[1]], w = mullions.w / 2
            const A: XY = [c[0] - t[0] * w, c[1] - t[1] * w], B: XY = [c[0] + t[0] * w, c[1] + t[1] * w]
            mullions.part.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], P.z1], [A[0], A[1], P.z1])
          }
        }
      }
    }
    capRing(roof, r, P.z1)
  }
}

/**
 * Window panels on edge i of ring r between z0 and z1: bays `w` wide every
 * `pitch` metres, each spanning a group of storeys `grp` high with `gap`
 * of wall between groups; set 0.05 m proud of the wall.
 */
export function panels(part: Part, r: XY[], i: number, z0: number, z1: number, o: { w: number; pitch: number; grp: number; gap: number; from?: number; margin?: number }) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const m = o.margin ?? 1.2
  if (L < o.w + 2 * m) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const nb = Math.max(1, Math.floor((L - 2 * m + (o.pitch - o.w)) / o.pitch))
  const span = nb * o.pitch - (o.pitch - o.w), s0 = (L - span) / 2
  for (let k = 0; k < nb; k++) {
    const u0 = s0 + k * o.pitch, u1 = u0 + o.w
    const P = (u: number): XY => [a[0] + t[0] * u + n[0] * 0.05, a[1] + t[1] * u + n[1] * 0.05]
    const A = P(u0), B = P(u1)
    for (let z = o.from ?? 0; z < z1; z += o.grp) {
      const lo = Math.max(z + o.gap / 2, z0 + 0.6), hi = Math.min(z + o.grp - o.gap / 2, z1 - 1.0)
      if (hi - lo < 1.2) continue
      part.quad([A[0], A[1], lo], [B[0], B[1], lo], [B[0], B[1], hi], [A[0], A[1], hi])
    }
  }
}

// ---------------------------------------------------------------- the model

function build() {
  const glass = new Part(), white = new Part(), roof = new Part(), steel = new Part(), skin = new Part()
  const H = { podium: 21, ends: 121, faces: 142.7, tier: 151, centre: 159.7, ring: 164, apex: 203 }
  const HX = 33.3, HY = 21.6

  const notch: [number, number][] = [[2, 4.2], [4.4, 2]]
  const prisms: Prism[] = [
    { ring: ccw([[-HX, -HY], [HX, -HY], [HX, HY], [-HX, HY]]), z1: H.podium, kind: 'podium' },
    { ring: notchedRect(HX, HY, notch), z1: H.ends, kind: 'shaft' },
    { ring: notchedRect(30.2, HY, [[1.5, 3.4], [3.2, 1.6]]), z1: H.faces, kind: 'faces' },
    { ring: superellipse(33.0, 19.8, 4, 40), z0: 0, z1: H.tier, kind: 'tier' },
    { ring: superellipse(18, 17.6, 6, 28), z1: H.centre, kind: 'centre' },
    { ring: superellipse(27, 15.5, 4, 36), z1: H.ring, kind: 'ring' },
  ]
  prismWalls(prisms, () => glass, roof, { part: white, every: 48, from: 21, h: 0.8 }, { part: white, h: 1.2 }, { part: white, every: 7.5, w: 0.7, minLen: 6 })

  // white edges at the notched corners of the shaft (the white fins the photos show)
  const shaft = prisms[1].ring
  for (let i = 0; i < shaft.length; i++) {
    const [x, y] = shaft[i]
    if (Math.abs(x) < 0.01 || Math.abs(y) < 0.01) continue
    // convex corners only
    const p = shaft[(i - 1 + shaft.length) % shaft.length], s = shaft[(i + 1) % shaft.length]
    const cr = (x - p[0]) * (s[1] - y) - (y - p[1]) * (s[0] - x)
    if (cr <= 0) continue
    const w = 0.9, sx = Math.sign(x), sy = Math.sign(y)
    const c: XY[] = [[x - sx * w, y - sy * w], [x + sx * 0.15, y - sy * w], [x + sx * 0.15, y + sy * 0.15], [x - sx * w, y + sy * 0.15]]
    const r = ccw(c)
    for (let k = 0; k < 4; k++) wallEdge(white, r, k, H.podium, H.ends, 0)
    capRing(white, r, H.ends)
  }

  // ---- the tiara: arches across the short axis on an elongated dome
  const AX = 24, AY = 14.5, Z0 = H.ring, TH = H.apex - H.ring
  const prof = (r: number) => (r >= 1 ? 0 : (1 - r ** 1.8) ** 0.7)
  const domeZ = (x: number, y: number) => Z0 + TH * prof(Math.hypot(x / AX, y / AY))
  const ARCHES = 11
  for (let k = 0; k < ARCHES; k++) {
    const x = -AX * 0.92 + (2 * AX * 0.92 * k) / (ARCHES - 1)
    const hy = AY * Math.sqrt(Math.max(0, 1 - (x / AX) ** 2))
    if (hy < 1.5) continue
    const path: V3[] = []
    const S = 12
    for (let j = 0; j <= S; j++) {
      const y = -hy * 0.999 + (2 * hy * 0.999 * j) / S
      path.push([x, y, domeZ(x, y)])
    }
    path[0][2] = Z0; path[S][2] = Z0
    tube(steel, path, 1.1, 1.1, [1, 0, 0])
  }
  // ridge along the long axis and the ring at the base
  {
    const S = 16, ridge: V3[] = []
    for (let j = 0; j <= S; j++) {
      const x = -AX * 0.999 + (2 * AX * 0.999 * j) / S
      ridge.push([x, 0, domeZ(x, 0)])
    }
    ridge[0][2] = Z0; ridge[S][2] = Z0
    tube(steel, ridge, 1.2, 1.2, [0, 1, 0])
    // a mid-height ring
    const ring: V3[] = []
    for (let j = 0; j <= 28; j++) {
      const t = (2 * Math.PI * j) / 28, r = 0.78
      ring.push([AX * r * Math.cos(t), AY * r * Math.sin(t), Z0 + TH * prof(r)])
    }
    tube(steel, ring, 0.9, 0.9)
    const base: V3[] = []
    for (let j = 0; j <= 28; j++) {
      const t = (2 * Math.PI * j) / 28
      base.push([AX * Math.cos(t), AY * Math.sin(t), Z0 + 0.8])
    }
    tube(steel, base, 1.4, 1.6)
  }
  // translucent skin, so the outline reads from far off
  {
    const NR = 7, NT = 24
    const pt = (i: number, j: number): V3 => {
      const r = 1 - i / NR, t = (2 * Math.PI * j) / NT
      return [AX * r * Math.cos(t), AY * r * Math.sin(t), Z0 + TH * prof(r)]
    }
    for (let i = 0; i < NR; i++)
      for (let j = 0; j < NT; j++) {
        if (i === NR - 1) skin.tri(pt(i, j), pt(i, j + 1), [0, 0, H.apex])
        else skin.quad(pt(i, j), pt(i, j + 1), pt(i + 1, j + 1), pt(i + 1, j))
      }
  }

  return finishGlb('Great American Tower at Queen City Square', [
    { part: glass, material: windowVariant(2, 0xa7c0d6) },
    { part: white, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: steel, material: finish('neon-tiara', 0xe4e8ec, 0.5) },
    { part: skin, material: { ...PALETTE.glass, color: 0xc4d6e2, opacity: 0.16, doubleSided: true } },
  ], { bearing: 350, height: H.apex, replaces: REPLACES }, 6500)
}

const REPLACES = [
  'way/91493361', 'relation/3626990',
  'way/271760074', 'way/271760075', 'way/271760076', 'way/271760077',
  'way/271761705', 'way/271761706', 'way/271761708', 'way/271764809', 'way/271764810',
]

if (import.meta.main) await emit('cin-great-american-tower', build())
