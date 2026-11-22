/**
 * Federation Square, Melbourne (2002, Lab Architecture Studio with Bates
 * Smart): procedural, CC0-1.0.
 * bun generators/melbourne-federation-square.ts
 *
 * Writes models/melbourne-federation-square.glb (low) and
 * models/melbourne-federation-square.detail.glb (detail, from zoom 16).
 *
 * The buildings of the square, not the square: the plaza's paving, steps
 * and lawn are the map's ground and are left out.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from the OSM rings. Origin (144.9692, -37.8177), in the
 * middle of the complex between the Alfred Deakin Building and the Atrium.
 *
 * Identity, in order: the faceted facades tiled in the pinwheel pattern of
 * sandstone, zinc and glass triangles; the glazed Atrium with its
 * triangulated steel frame between ACMI and the NGV; the zinc shards; the
 * low glass Deakin Edge facing the river; the big screen over the stage.
 *
 * Evidence:
 *  - plan: OSM. Alfred Deakin Building (ACMI + SBS) way/800163541 with its
 *    parts way/22963244 (ACMI), way/22963246 (SBS), way/22963266,
 *    way/1489432440; the west shard way/46330906 ("East Shard" in OSM);
 *    the shard between ACMI and the Atrium way/46330935; The Atrium
 *    way/275175953; NGV Ian Potter Centre way/22963243; Crossbar
 *    way/778486279; Deakin Edge way/420153509; Birrarung Building
 *    way/22963268; Transport Hotel way/22963353; Zinc way/406695495; the
 *    stage roof way/778473772 under the big screen.
 *  - heights: none in OSM. Estimated from photos against people and
 *    storeys: Alfred Deakin Building 23 m; shards 27 m; NGV 19 m; Atrium
 *    roof 19 m; Crossbar 16 m; Deakin Edge 13 m; Birrarung 12 m; Transport
 *    13 m with the screen tower to 22 m; Zinc 9 m. The site falls about
 *    5 m from Flinders Street to the river promenade (Mapterhorn z12 and
 *    the photos); the northern buildings are drawn from y = 0 (the
 *    promenade level) up to their tops at plaza height plus their own
 *    height, so they sink into the slope as the map expects.
 *  - facades: the pinwheel tiling (Radin's, the scheme the architects used)
 *    drawn as real triangles: each wall is cut into 2:1 rectangles, each
 *    halved into two right triangles and split by pinwheel subdivision;
 *    level-1 triangles take one finish each (sandstone, zinc or glass, in
 *    each building's proportions from the photos) and stand proud of the
 *    wall; in the detail model their level-2 triangles are separate raised
 *    panels with joints between them. The pattern is generated, not traced:
 *    it has the real scale and mix, not the real placement of each panel.
 *  - colours: sandstone a pale pinkish buff, zinc a mid grey and the
 *    perforated zinc darker, glass the palette window; sampled from the
 *    2017-2023 photos.
 *
 * Photos (Wikimedia Commons):
 *  - "Fed Square, Melbourne, west view 20230219 1.jpg", DXR, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Fed_Square,_Melbourne,_west_view_20230219_1.jpg
 *  - "Fed Square, Melbourne, north view 20230219 1.jpg", DXR, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Fed_Square,_Melbourne,_north_view_20230219_1.jpg
 *  - "Melbourne Federation Square.jpg", Donaldytong, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Melbourne_Federation_Square.jpg
 *  - "AUS Melbourne, Central Business District, Federation Square 003.jpg",
 *    -wuppertaler, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:AUS_Melbourne,_Central_Business_District,_Federation_Square_003.jpg
 *  - "Melbourne Federation Square from Swanston Street intersection
 *    2017-10-10.jpg", Tangerineduel, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Melbourne_Federation_Square_from_Swanston_Street_intersection_2017-10-10.jpg
 *  - "Melbourne (AU), View from Eureka Tower, Northbank -- 2019 -- 1461.jpg",
 *    Dietmar Rabich, CC BY-SA 4.0 (aerial, roofs)
 *    https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_View_from_Eureka_Tower,_Northbank_--_2019_--_1461.jpg
 *  - "Melbourne (AU), Flinders Street Railway Station -- 2019 -- 1583.jpg",
 *    Dietmar Rabich, CC BY-SA 4.0 (the east side over the rail yards)
 *    https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_Flinders_Street_Railway_Station_--_2019_--_1583.jpg
 *  - "Federation Square December 2020.jpg", Nick-D, CC BY-SA 4.0 (the screen)
 *    https://commons.wikimedia.org/wiki/File:Federation_Square_December_2020.jpg
 * No lidar; no commercial imagery. Look-only references: none.
 *
 * Night: glass triangles and the Deakin Edge glazing are `window` (lit); the
 * Atrium stays `glass`; the big screen glows (`neon`-free: drawn as window).
 *
 * Terrain: `terrain.ts check --zoom 12` prints ok (z12 only here; it shows
 * the complex as a 4-8 m bump over the falling site).
 *
 * Doubts: every height is a photo estimate; the roofs are drawn flat (the
 * real zinc roofs step and slope a little); the panel layout is generated;
 * the Birrarung and Transport facades towards the river are from the aerial
 * only.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap } from './chi-aon-center'

const ID = 'melbourne-federation-square'

// ------------------------------------------------------------------ plan ---
const R = {
  deakin: [[-60.2, 33.4], [-57.9, 27.5], [-57.5, 21.2], [-57.3, 19.2], [-56.0, 5.4], [-55.6, 0.5], [-44.2, -16.1], [-29.0, -9.9], [-15.7, -6.4], [-15.9, -4.8], [-13.3, -2.8], [-9.8, 0.0], [-7.8, -4.6], [3.8, -0.3], [3.4, 0.9], [13.3, 5.8], [15.7, 7.0], [15.8, 8.2], [12.7, 14.4], [10.2, 19.3], [9.0, 18.7], [5.5, 25.4], [2.3, 35.9], [1.8, 46.2], [-1.6, 45.7], [-0.7, 46.9], [-6.1, 57.3], [-16.7, 51.5], [-30.4, 46.3], [-27.8, 39.2], [-30.5, 38.9], [-32.8, 38.6], [-38.1, 46.9], [-40.6, 48.4], [-61.9, 37.8]],
  shardW: [[-81.0, 19.0], [-80.6, 6.4], [-74.6, 8.5], [-74.1, 8.7], [-74.9, 16.6], [-74.3, 17.8], [-74.6, 19.5], [-73.5, 19.4], [-78.1, 32.4], [-87.4, 27.0]],
  shardE: [[15.6, 5.5], [18.4, 5.2], [18.7, 8.2], [19.2, 7.6], [24.6, 9.7], [22.4, 12.2], [21.1, 22.3], [21.6, 26.7], [20.9, 26.3], [21.2, 29.3], [17.8, 29.8], [17.6, 27.7], [16.2, 27.2], [14.7, 26.5], [14.1, 27.9], [9.7, 25.4], [11.6, 19.9], [13.6, 14.7], [12.7, 14.4], [15.8, 8.2], [15.7, 7.0]],
  atrium: [[34.0, -7.4], [45.7, 3.4], [49.6, 7.0], [35.5, 51.0], [29.5, 68.6], [21.4, 66.1], [13.3, 63.5]],
  ngv: [[47.1, -14.6], [59.6, -3.4], [58.5, -16.0], [58.6, -28.1], [59.8, -34.7], [60.2, -39.3], [76.7, -38.9], [76.4, -35.4], [82.8, -37.5], [83.3, -40.5], [88.5, -40.1], [94.7, -39.1], [100.2, -39.7], [99.9, -33.3], [96.3, 0.4], [85.5, 19.5], [90.6, 24.5], [80.4, 34.9], [79.1, 33.6], [76.3, 36.4], [75.3, 56.6], [74.1, 68.5], [58.6, 68.5], [58.2, 74.7], [36.3, 76.0], [35.5, 51.0], [49.6, 7.0], [45.7, 3.4], [46.0, -0.6], [46.5, -6.3]],
  crossbar: [[45.7, 3.4], [34.0, -7.4], [34.2, -8.1], [26.7, -15.4], [9.8, -31.2], [17.5, -39.8], [18.6, -41.0], [20.7, -39.1], [21.4, -40.7], [47.1, -16.6], [47.1, -15.6], [47.1, -14.6], [46.5, -6.3], [46.0, -0.6]],
  edge: [[21.4, -40.7], [22.7, -44.7], [25.5, -44.0], [33.8, -68.6], [34.8, -71.8], [53.4, -69.0], [51.4, -50.9], [49.7, -37.0], [47.1, -16.6]],
  birrarung: [[24.0, -59.6], [24.7, -59.1], [22.1, -51.6], [18.0, -51.1], [12.8, -50.5], [11.7, -48.7], [8.0, -42.6], [3.0, -45.5], [-5.3, -46.7], [-9.8, -48.7], [-12.6, -49.9], [-13.4, -50.2], [-14.8, -50.6], [-20.9, -52.8], [-20.8, -58.5], [-20.3, -60.9], [-19.1, -66.5], [-17.3, -75.3], [-9.2, -72.2], [-0.4, -68.8], [0.5, -71.4], [17.4, -71.6], [24.1, -69.4]],
  transport: [[-59.3, -73.5], [-71.3, -61.7], [-73.9, -60.4], [-78.9, -63.5], [-73.8, -72.1], [-84.5, -74.6], [-86.7, -69.3], [-92.3, -71.4], [-86.7, -87.1], [-85.1, -86.2], [-84.4, -96.2], [-77.6, -95.7], [-77.9, -91.4], [-76.6, -91.4], [-75.4, -91.3], [-74.4, -94.8], [-63.4, -90.0], [-58.1, -89.8], [-52.5, -86.6], [-57.1, -79.0], [-56.4, -77.2], [-57.3, -74.9]],
  zinc: [[76.2, -51.5], [76.1, -50.8], [68.5, -52.4], [72.1, -69.4], [83.7, -69.0], [87.0, -68.9], [90.4, -68.8], [97.6, -68.6], [106.5, -68.3], [111.4, -67.3], [117.6, -66.1], [116.1, -58.3], [114.6, -50.6], [104.6, -55.2], [102.7, -45.9]],
  stage: [[-59.3, -73.5], [-52.6, -67.3], [-66.6, -57.5], [-71.3, -61.7]],
} satisfies Record<string, XY[]>

// heights above y = 0 (the river promenade side): own height + the ground it stands on
const PLAZA = 3.5
type Mix = [number, number, number, number] // sandstone, zinc, perforated (dark) zinc, glass shares
const BUILDINGS: { r: XY[]; top: number; mix: Mix; s: number; base?: number }[] = [
  { r: R.deakin, top: PLAZA + 23, mix: [0.36, 0.36, 0.18, 0.1], s: 8, base: PLAZA + 5 },
  { r: R.shardW, top: PLAZA + 27, mix: [0.34, 0.44, 0.14, 0.08], s: 7, base: PLAZA },
  { r: R.shardE, top: PLAZA + 27, mix: [0.12, 0.62, 0.18, 0.08], s: 7 },
  { r: R.ngv, top: PLAZA + 19, mix: [0.46, 0.3, 0.16, 0.08], s: 8, base: PLAZA },
  { r: R.crossbar, top: PLAZA + 16, mix: [0.36, 0.36, 0.2, 0.08], s: 7, base: PLAZA },
  { r: R.birrarung, top: 12, mix: [0.32, 0.36, 0.22, 0.1], s: 6 },
  { r: R.transport, top: 13, mix: [0.0, 0.12, 0.38, 0.5], s: 6 },
  { r: R.zinc, top: 9, mix: [0.06, 0.6, 0.26, 0.08], s: 5 },
]

// --------------------------------------------------------------- helpers ---
const hash = (a: number, b: number, c = 0) => {
  let h = Math.imul(Math.round(a * 97) ^ 0x9e3779b1, 0x85ebca6b) ^ Math.imul(Math.round(b * 131) + 7, 0xc2b2ae35) ^ Math.imul(Math.round(c * 61) + 3, 0x27d4eb2f)
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12
  return ((h >>> 0) % 10000) / 10000
}
type T2 = { R: XY; S: XY; L: XY } // right angle, short-leg end, long-leg end, in wall (s, z)
const mid2 = (a: XY, b: XY): XY => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
/** Radin's pinwheel subdivision of a 1:2 right triangle into five. */
function pinwheel(t: T2): T2[] {
  const { R: A, S: C, L: B } = t
  const H: XY = [C[0] + (B[0] - C[0]) / 5, C[1] + (B[1] - C[1]) / 5]
  const K = mid2(A, H), M = mid2(H, B), N = mid2(A, B)
  return [
    { R: H, S: C, L: A },
    { R: H, S: K, L: M },
    { R: K, S: A, L: N },
    { R: M, S: N, L: B },
    { R: N, S: M, L: K },
  ]
}
const centroid = (t: T2): XY => [(t.R[0] + t.S[0] + t.L[0]) / 3, (t.R[1] + t.S[1] + t.L[1]) / 3]

type Frame = { L: number; P: (s: number, z: number, o: number) => V3; n: XY }
function frame(a: XY, b: XY): Frame {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  return { L, n, P: (s, z, o) => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z] }
}
/** A wall-plane triangle at offset o, wound to face out; with sides back to o0 if given. */
function panelTri(p: Part, f: Frame, pts: XY[], o: number, o0?: number) {
  const cr = (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0])
  const q = cr > 0 ? pts : [pts[0], pts[2], pts[1]]
  p.tri(f.P(q[0][0], q[0][1], o), f.P(q[1][0], q[1][1], o), f.P(q[2][0], q[2][1], o))
  if (o0 === undefined) return
  for (let i = 0; i < 3; i++) {
    const a = q[i], b = q[(i + 1) % 3]
    // the side between edge a->b, facing away from the triangle
    p.quad(f.P(a[0], a[1], o0), f.P(b[0], b[1], o0), f.P(b[0], b[1], o), f.P(a[0], a[1], o))
  }
}
/** Only the side faces of a raised triangle, from o0 out to o. */
function sides(p: Part, f: Frame, pts: XY[], o: number, o0: number) {
  const cr = (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0])
  const q = cr > 0 ? pts : [pts[0], pts[2], pts[1]]
  for (let i = 0; i < 3; i++) {
    const a = q[i], b = q[(i + 1) % 3]
    p.quad(f.P(a[0], a[1], o0), f.P(b[0], b[1], o0), f.P(b[0], b[1], o + 0.06), f.P(a[0], a[1], o + 0.06))
  }
}
const shrink = (t: XY[], d: number): XY[] => {
  const c: XY = [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3]
  return t.map(([x, y]) => {
    const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy) || 1
    const k = Math.max(0.2, (l - d * 2) / l)
    return [c[0] + dx * k, c[1] + dy * k] as XY
  })
}

function build(detail: boolean) {
  const sand = new Part(), zinc = new Part(), dark = new Part(), win = new Part(), glass = new Part(), roof = new Part()
  const finishes = [sand, zinc, dark, win]

  // ---- faceted buildings
  for (const [bi, b] of BUILDINGS.entries()) {
    walls(zinc, b.r, 0, b.top)
    cap(roof, b.r, b.top)
    // a low zinc parapet lip round the roof
    for (let i = 0; i < b.r.length; i++) {
      const a = b.r[i], c = b.r[(i + 1) % b.r.length]
      const f = frame(a, c)
      if (f.L < 3) continue
      // pinwheel tiling: 2:1 rectangles, each halved into two right triangles
      // a plain sandstone podium (the plaza's retaining walls), the tiling above it
      const zb = b.base ?? 0
      if (zb > 0) sand.quad(f.P(0, 0, 0.12), f.P(f.L, 0, 0.12), f.P(f.L, zb, 0.12), f.P(0, zb, 0.12))
      const S = detail ? b.s * 1.25 : b.s * 1.4, Ht = b.top - zb
      const rows = Math.max(1, Math.round(Ht / S)), sz = Ht / rows
      const cols = Math.max(1, Math.round(f.L / (2 * sz))), w = f.L / cols
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const s0 = k * w, s1 = s0 + w, z0 = zb + r * sz, z1 = z0 + sz
        // alternate the diagonal so the big triangles pinwheel round
        const flip = (r + k + i) % 2 === 1
        const halves: T2[] = flip
          ? [{ R: [s0, z0], S: [s0, z1], L: [s1, z0] }, { R: [s1, z1], S: [s1, z0], L: [s0, z1] }]
          : [{ R: [s1, z0], S: [s1, z1], L: [s0, z0] }, { R: [s0, z1], S: [s0, z0], L: [s1, z1] }]
        for (const [hi, h] of halves.entries()) {
          // one finish per level-0 triangle mostly, some level-1 variety
          const g = hash(bi * 13 + i, r * 7 + k, hi)
          for (const [ti, t1] of pinwheel(h).entries()) {
            const v = hash(bi * 13 + i + ti * 3, r * 7 + k + 1, hi + 5)
            const x = v < 0.65 ? g : v
            let pick = 0, acc = b.mix[0]
            while (pick < 3 && x >= acc) acc += b.mix[++pick]
            const part = finishes[pick]
            const o = pick === 3 ? 0.05 : 0.1 + 0.18 * hash(r, k, ti + hi * 5 + i)
            if (!detail) panelTri(part, f, [t1.R, t1.S, t1.L], o)
            else {
              // a raised plate of the level-1 triangle, and its level-2 panels on it
              // the sandstone plates stand proud with real sides; zinc and glass sit flush
              if (pick === 0) sides(zinc, f, [t1.R, t1.S, t1.L], o, 0)
              for (const t2 of pinwheel(t1)) panelTri(part, f, shrink([t2.R, t2.S, t2.L], 0.05), o + 0.06)
            }
          }
        }
      }
      // roof lip
      const lo = b.top, hi = b.top + 0.6
      zinc.quad(f.P(0, lo, 0.32), f.P(f.L, lo, 0.32), f.P(f.L, hi, 0.32), f.P(0, hi, 0.32))
      if (detail) zinc.quad(f.P(0, hi, 0.32), f.P(f.L, hi, 0.32), f.P(f.L, hi, -0.3), f.P(0, hi, -0.3))
    }
  }

  // ---- the Atrium: a glazed galleria with a triangulated steel frame
  {
    const top = PLAZA + 19, r = R.atrium
    walls(glass, r, 0, top)
    cap(glass, r, top)
    const tube = (a0: V3, b0: V3, w: number) => {
      const a: V3 = [a0[0], a0[1], Math.max(a0[2], w * 0.6)], b: V3 = [b0[0], b0[1], Math.max(b0[2], w * 0.6)]
      const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
      const ref: V3 = Math.abs(d[2] / L) > 0.9 ? [1, 0, 0] : [0, 0, 1]
      const e1: V3 = [d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]]
      const l1 = Math.hypot(...e1); for (let k = 0; k < 3; k++) e1[k] *= w / 2 / l1
      const e2: V3 = [(d[1] * e1[2] - d[2] * e1[1]) / L, (d[2] * e1[0] - d[0] * e1[2]) / L, (d[0] * e1[1] - d[1] * e1[0]) / L]
      const ring = (c: V3) => [0, 1, 2].map((k) => {
        const t = (k / 3) * Math.PI * 2
        return [c[0] + e1[0] * Math.cos(t) + e2[0] * Math.sin(t), c[1] + e1[1] * Math.cos(t) + e2[1] * Math.sin(t), c[2] + e1[2] * Math.cos(t) + e2[2] * Math.sin(t)] as V3
      })
      const A = ring(a), B = ring(b)
      for (let k = 0; k < 3; k++) {
        const j = (k + 1) % 3
        const nk: V3 = [A[k][0] - a[0], A[k][1] - a[1], A[k][2] - a[2]], nj: V3 = [A[j][0] - a[0], A[j][1] - a[1], A[j][2] - a[2]]
        dark.tri(A[k], A[j], B[j], undefined, undefined, undefined, [nk, nj, nj])
        dark.tri(A[k], B[j], B[k], undefined, undefined, undefined, [nk, nj, nk])
      }
    }
    const W = detail ? 0.35 : 0.5
    // the frame on the glazed walls: pinwheel triangle edges as steel members
    for (let i = 0; i < r.length; i++) {
      const f = frame(r[i], r[(i + 1) % r.length])
      if (f.L < 3) continue
      const sz = top / (detail ? 3 : 2), cols = Math.max(1, Math.round(f.L / (2 * sz))), w = f.L / cols
      for (let q = 0; q < (detail ? 3 : 2); q++) for (let k = 0; k < cols; k++) {
        const s0 = k * w, s1 = s0 + w, z0 = q * sz, z1 = z0 + sz
        const tris: T2[] = [{ R: [s0, z0], S: [s0, z1], L: [s1, z0] }, { R: [s1, z1], S: [s1, z0], L: [s0, z1] }]
        if (!detail) {
          // the low model: the big diagonals and the verticals only
          tube(f.P(s0, z0, 0.25), f.P(s1, z1, 0.25), W)
          tube(f.P(s0, z0, 0.25), f.P(s0, z1, 0.25), W)
          continue
        }
        for (const t of tris.flatMap(pinwheel)) {
          const pts = [t.R, t.S, t.L]
          for (let e = 0; e < 3; e++) {
            const a = pts[e], c = pts[(e + 1) % 3]
            tube(f.P(a[0], a[1], 0.25), f.P(c[0], c[1], 0.25), W)
          }
        }
      }
    }
    // roof frame: lines across the galleria
    const n = detail ? 18 : 9
    const west = [r[6], r[0]], east = [r[4], r[2]] // north to south along each side
    for (let k = 0; k <= n; k++) {
      const t = k / n
      const a: V3 = [west[0][0] + (west[1][0] - west[0][0]) * t, west[0][1] + (west[1][1] - west[0][1]) * t, top + 0.3]
      const b: V3 = [east[0][0] + (east[1][0] - east[0][0]) * t, east[0][1] + (east[1][1] - east[0][1]) * t, top + 0.3]
      tube(a, b, W)
      if (k < n) {
        const t2 = (k + 1) / n
        const b2: V3 = [east[0][0] + (east[1][0] - east[0][0]) * t2, east[0][1] + (east[1][1] - east[0][1]) * t2, top + 0.3]
        tube(a, b2, W)
      }
    }
  }

  // ---- Deakin Edge: a glass box facing the river, steel triangulation on it
  {
    const top = PLAZA + 9.5, r = R.edge
    walls(win, r, 0, top)
    cap(roof, r, top)
    for (let i = 0; i < r.length; i++) {
      const f = frame(r[i], r[(i + 1) % r.length])
      if (f.L < 3) continue
      const cols = Math.max(1, Math.round(f.L / 7)), w = f.L / cols
      for (let k = 0; k < cols; k++) {
        const s0 = k * w
        // diagonal mullions in zinc, flush
        for (const [a, c] of [[[s0, 0], [s0 + w, top]], [[s0 + w, 0], [s0, top]]] as [XY, XY][]) {
          const d = Math.hypot(c[0] - a[0], c[1] - a[1]), nx = (-(c[1] - a[1]) / d) * 0.2, nz = ((c[0] - a[0]) / d) * 0.2
          const cl = (z: number) => Math.min(top, Math.max(0, z))
          const q: XY[] = [[a[0] - nx, cl(a[1] - nz)], [c[0] - nx, cl(c[1] - nz)], [c[0] + nx, cl(c[1] + nz)], [a[0] + nx, cl(a[1] + nz)]]
          panelTri(zinc, f, [q[0], q[1], q[2]], 0.08)
          panelTri(zinc, f, [q[0], q[2], q[3]], 0.08)
        }
      }
      zinc.quad(f.P(0, top - 0.8, 0.1), f.P(f.L, top - 0.8, 0.1), f.P(f.L, top, 0.1), f.P(0, top, 0.1))
    }
  }

  // ---- the big screen over the stage: a zinc tower slab with the screen
  {
    const a: XY = [-71.3, -61.7], b: XY = [-59.3, -73.5] // the stage's south-west edge
    const f = frame(b, a) // faces north-east, to the plaza
    const top = 22
    const ring0: XY[] = [f.P(-1, 0, -3), f.P(f.L + 1, 0, -3), f.P(f.L + 1, 0, 0), f.P(-1, 0, 0)].map((q) => [q[0], q[1]] as XY)
    const area = ring0.reduce((acc, q, i) => { const n = ring0[(i + 1) % 4]; return acc + q[0] * n[1] - n[0] * q[1] }, 0)
    const ring = area > 0 ? ring0 : ring0.reverse()
    walls(zinc, ring, 0, top)
    cap(roof, ring, top)
    win.quad(f.P(0.5, 8, 0.08), f.P(f.L - 0.5, 8, 0.08), f.P(f.L - 0.5, 18.5, 0.08), f.P(0.5, 18.5, 0.08))
    // the stage roof
    const st = R.stage
    walls(dark, st, 6.5, 7.2)
    cap(roof, st, 7.2)
    cap(dark, st, 6.5, false)
  }

  return [
    { part: sand, material: finish('fedsq-sandstone', 0xdcc4ad) },
    { part: zinc, material: finish('fedsq-zinc', 0xaab0b4) },
    { part: dark, material: finish('fedsq-zinc-dark', 0x7b8288) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...finish('glass', 0x9fc6c4, 0.24), opacity: 0.45, doubleSided: true } },
    { part: roof, material: PALETTE.roof },
  ]
}

async function write(file: string, parts: ReturnType<typeof build>, maxTri: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${used.length} materials`)
  const glb = writeGlb('Federation Square', used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', bearing: 0, height: PLAZA + 27 })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  await Bun.write(file, glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  const dir = new URL('../models/', import.meta.url).pathname
  await write(`${dir}${ID}.glb`, build(false), 6500, 250_000)
  await write(`${dir}${ID}.detail.glb`, build(true), 40_000, 1_536_000)
}
