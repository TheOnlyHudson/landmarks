/**
 * Narikala Fortress, Sololaki ridge above Old Tbilisi: the ruined walls
 * and round towers of the lower enceinte round St Nicholas church and of
 * the upper citadel along the ridge to the west, with the church of St
 * Nicholas (rebuilt 1996-97) inside: procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-narikala.ts
 * Writes models/tbilisi-narikala.glb and models/tbilisi-narikala.detail.glb
 * (the detail model adds the merlons of the restored stretches and towers,
 * finer towers and the church's small windows and drum arcade).
 *
 * Frame: x east, y north, z up, metres, origin at the anchor 44.8091,
 * 41.6877, bearing 0. The model is the masonry, not the hill: every wall
 * and tower stands on the map's own terrain, its feet 2.5 m under the
 * Mapterhorn z12 ground at that point (sampled on a 5 m grid with
 * `bun tools/terrain.ts grid 44.808691 41.687736 95 5 --zoom 12`, then
 * bilinear along the wall line every <= 5 m; the numbers are in LOWER,
 * UPPER and TOWERS below), so the map reads the model as terrain-following
 * and drapes it (web/landmark-ground.ts). y = 0 is 2.5 m under the lowest
 * ground on the wall line (Mapterhorn 434.9 m).
 *
 * Extent: the OSM city wall way/116077699 (barrier=city_wall, member of
 * the castle multipolygon relation/9820020): the lower enceinte from the
 * south-east bastion over the baths round the church terrace to the north
 * gate, and the upper citadel's narrow loop along the ridge west to its
 * big end tower. The cliff (way/468368580) closes the south side, and
 * carries no wall here. Tower positions are the round bumps the OSM line
 * draws, and its corners; outlying fragments down the slopes are left out.
 *
 * Evidence
 * - OSM (ODbL): relation/9820020 (historic=castle, ruins=yes), its wall
 *   and cliff; St Nicholas church way/78145651 (20.1 x 12.9 m, the axis
 *   3.4 deg south of east).
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Narikala - Tbilisi - 01.jpg", Maesi64, CC0: the classic view from
 *     the east: the church inside the lower ring of round towers, the upper
 *     wall and its towers climbing the ridge behind
 *     https://commons.wikimedia.org/wiki/File:Narikala_-_Tbilisi_-_01.jpg
 *   - "Narikala, Tiflis, Georgia, 2016-09-29, DD 91.jpg" and "... DD
 *     42.jpg", Diego Delso, CC BY-SA 4.0: the same from lower down; the
 *     upper wall on the cliff, its towers and their ruined tops
 *     https://commons.wikimedia.org/wiki/File:Narikala,_Tiflis,_Georgia,_2016-09-29,_DD_91.jpg
 *     https://commons.wikimedia.org/wiki/File:Narikala,_Tiflis,_Georgia,_2016-09-29,_DD_42.jpg
 *   - "Narikala from Vakhtang Gorgasali Street.jpg", Mostafameraji,
 *     CC BY-SA 4.0: the lower ring's round towers under the church
 *     https://commons.wikimedia.org/wiki/File:Narikala_from_Vakhtang_Gorgasali_Street.jpg
 *   - "Wall of Narikala Fortress.jpg" and "Wall of Narikala Fortress,
 *     Tbilisi.jpg", Reda Kerbush, CC BY-SA 4.0: the restored crenellated
 *     stretch and tower by the church; a wall walk stepping down the slope
 *     https://commons.wikimedia.org/wiki/File:Wall_of_Narikala_Fortress.jpg
 *   - "Church in Narikala castle.jpg", henribergius, CC BY-SA 2.0, and
 *     "Narikala Fortress, Tbilisi (2011).jpg", Simon, CC BY-SA 2.0: St
 *     Nicholas: pale stone, grey metal roofs, an eight-sided drum with
 *     arched windows under a pyramid roof; the upper wall's masonry
 *     https://commons.wikimedia.org/wiki/File:Church_in_Narikala_castle.jpg
 *     https://commons.wikimedia.org/wiki/File:Narikala_Fortress,_Tbilisi_(2011).jpg
 *
 * Numbers: plan measured from OSM. Heights estimated from the photos
 * against the church (eaves about 7 m, cross 21.8): the lower ring 8 m
 * with its towers 1-4.5 m higher; the upper citadel's tops set to the
 * photo's levels, 30-44 m over the church floor (see upTopG: the z12
 * ground on the ridge is far too low, so the citadel stands 18-27 m over
 * it: its top 10 m masonry, below that an irregular grey-ochre rock crag,
 * #9b9180, standing in for the crag the DEM lacks), towers 1.5-4 m above them and the west end tower 9 m; towers 5-10 m
 * across; ruined, stepped tops and two breaches. Colour: grey-brown
 * stone with a purplish tone (#8f7c6c) from the photos. The church
 * estimated from the photos at its 20 m length: eaves 6.5 and 8, gables
 * 11, drum 5.6 m across from 10.5 to 16.3, its roof to 20.3, cross 21.8.
 * Doubts: the z12 terrain is a smooth surface, so where the real wall
 * stands on a crag the map's ground (and so the wall's foot) is smoothed
 * with it. Towers are placed at the line's bumps and corners, not counted
 * one by one from a plan; the lower slopes' outworks and the two small
 * unnamed buildings inside (way/1207148739, way/1207148740) are left out.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { lathe, prism, box, type XY } from './sf-de-young'
import { quadOut, triOut, beam } from './moscow-church-kit'
import { gabled, faceOf, win, writeModel, archBand, pilaster, type Face } from './tbilisi-holy-trinity-cathedral'

type P3 = [number, number, number]
// x, y (frame) and Mapterhorn z12 ground (m above 416.14) along the walls
const LOWER: P3[] = [[9.3, -34.4, 26.8], [8.6, -39.3, 24.7], [10.9, -42.0, 23.2], [13.2, -44.6, 21.8], [15.8, -47.5, 20.2], [18.5, -50.5, 18.8], [19.4, -46.8, 20.0], [20.4, -43.1, 21.2], [17.4, -39.8, 23.0], [18.4, -36.4, 24.2], [19.4, -33.0, 25.3], [20.8, -30.4, 26.1], [22.2, -27.7, 26.7], [26.0, -25.0, 26.4], [27.4, -20.9, 27.4], [28.7, -16.7, 28.5], [25.8, -13.4, 30.9], [27.4, -9.7, 31.6], [29.0, -6.0, 32.2], [31.0, -4.0, 32.1], [33.0, -2.0, 31.9], [35.9, -0.4, 31.2], [38.8, 1.2, 30.2], [41.9, 4.8, 29.5], [46.0, 6.8, 27.6], [46.5, 10.4, 28.1], [47.0, 14.0, 28.6], [45.4, 17.0, 29.9], [42.5, 20.3, 31.7], [40.0, 18.2, 33.0], [37.5, 16.1, 34.1], [35.6, 18.6, 35.3], [33.7, 21.1, 36.2], [32.0, 24.5, 36.9], [30.4, 27.9, 37.6], [26.9, 31.2, 38.6], [23.5, 34.5, 39.2], [21.1, 36.4, 39.6], [18.8, 38.2, 39.8], [16.1, 40.4, 40.0], [13.4, 42.6, 40.3], [9.8, 44.6, 40.8], [6.2, 46.5, 40.9], [2.6, 48.5, 41.0], [-2.0, 50.5, 41.2], [-6.5, 52.4, 41.4], [-11.1, 54.4, 41.7], [-15.6, 56.3, 41.9], [-20.2, 58.3, 42.1], [-22.3, 54.9, 44.3], [-24.4, 51.4, 46.4], [-26.6, 48.0, 48.5], [-28.7, 44.5, 50.7], [-30.8, 41.1, 52.2], [-31.2, 38.1, 53.0], [-31.6, 35.1, 53.8]]
const UPPER: P3[] = [[-31.6, 35.1, 53.8], [-35.8, 34.5, 55.3], [-40.0, 33.9, 56.8], [-44.3, 33.2, 58.2], [-48.5, 32.6, 59.6], [-52.7, 32.0, 60.6], [-56.2, 33.4, 61.3], [-59.7, 34.8, 61.8], [-63.2, 36.2, 62.3], [-66.7, 37.6, 62.6], [-70.4, 39.3, 62.9], [-74.1, 41.1, 63.3], [-77.8, 42.8, 63.5], [-82.2, 44.2, 63.5], [-86.5, 45.7, 63.1], [-90.8, 47.1, 62.8], [-95.2, 48.6, 62.3], [-99.7, 47.5, 62.7], [-104.1, 46.3, 63.1], [-107.9, 44.9, 63.5], [-111.7, 43.5, 63.7], [-113.1, 41.2, 63.7], [-114.5, 39.0, 63.7], [-114.1, 35.5, 63.8], [-113.6, 32.1, 63.6], [-113.2, 28.6, 63.2], [-108.6, 28.8, 63.2], [-104.0, 28.9, 63.5], [-99.5, 27.1, 63.2], [-94.9, 25.4, 63.0], [-92.0, 25.2, 63.1], [-89.1, 25.0, 63.2], [-84.8, 23.9, 62.9], [-80.5, 22.7, 62.8]]
const TOWERS: Array<[number, number, number, number]> = [[18.5, -50.5, 3.2, 18.8], [26.0, -25.0, 2.6, 26.4], [29.0, -6.0, 3.0, 32.2], [38.8, 1.2, 2.4, 30.2], [46.0, 6.8, 2.6, 27.6], [47.0, 14.0, 3.0, 28.6], [23.5, 34.5, 3.4, 39.2], [13.4, 42.6, 2.4, 40.3], [2.6, 48.5, 2.6, 41.0], [-20.2, 58.3, 2.8, 42.1], [-31.6, 35.1, 3.4, 53.8], [-52.7, 32.0, 3.2, 60.6], [-66.7, 37.6, 3.0, 62.6], [-77.8, 42.8, 3.0, 63.5], [-95.2, 48.6, 3.2, 62.3], [-104.1, 46.3, 3.0, 63.1], [-114.5, 39.0, 4.5, 63.7], [-104.0, 28.9, 3.0, 63.5], [-89.1, 25.0, 3.0, 63.2], [-80.5, 22.7, 3.2, 62.8],
  // more of the lower ring's and the upper wall's towers, at the spacing the photos show
  [8.0, 45.5, 3.0, 40.9], [-4.0, 53.4, 3.2, 40.4], [-12.5, 57.0, 3.0, 40.8], [-26.5, 48.2, 3.2, 48.4], [36.0, 17.6, 2.8, 35.1], [-42.0, 33.5, 3.0, 57.4], [-86.0, 45.7, 3.0, 63.1], [-59.5, 34.8, 2.8, 61.8], [-110.0, 28.7, 3.0, 63.2], [-72.0, 40.0, 2.8, 63.1]]
// min ground 18.785000000000004

const G0 = 18.785 - 2.5 // y = 0
const FEET = 2.5 // the feet under the ground

/** Deterministic unevenness for a ruined top, -1..1. */
const rough = (x: number, y: number) => Math.sin(x * 0.37 + y * 0.91) * 0.6 + Math.sin(x * 1.3 - y * 0.47) * 0.4

/** The top and direction along a path, as `wallAlong` draws it. */
function pathFns(path: P3[], h: (i: number) => number, _t: number) {
  const n = path.length
  const dir = (i: number): XY => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  return { dir, top: (i: number) => path[i][2] - G0 + h(i) }
}

/** A wall of thickness `t` along a ground-following path: feet under the ground, top `h` over it. */
function wallAlong(p: Part, path: P3[], h: (i: number) => number, t: number, batter = 0, footAt?: (i: number) => number) {
  const n = path.length
  const dir = (i: number): XY => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  const foot = (i: number) => (footAt ? footAt(i) : path[i][2] - G0 - FEET)
  const top = (i: number) => path[i][2] - G0 + h(i)
  // a battered foot: the wall's half-width grows by `batter` per metre below its top
  const side = (i: number, s: number, z: number): V3 => { const d = dir(i), hw = t / 2 + batter * Math.max(0, top(i) - 10 - z); return [path[i][0] + d[1] * s * hw, path[i][1] - d[0] * s * hw, z] }
  for (let i = 0; i < n - 1; i++) {
    const d = dir(i), out: V3 = [d[1], -d[0], 0]
    quadOut(p, side(i, 1, foot(i)), side(i + 1, 1, foot(i + 1)), side(i + 1, 1, top(i + 1)), side(i, 1, top(i)), out)
    quadOut(p, side(i, -1, foot(i)), side(i + 1, -1, foot(i + 1)), side(i + 1, -1, top(i + 1)), side(i, -1, top(i)), [-out[0], -out[1], 0])
    quadOut(p, side(i, 1, top(i)), side(i + 1, 1, top(i + 1)), side(i + 1, -1, top(i + 1)), side(i, -1, top(i)), [0, 0, 1])
  }
  for (const [i, s] of [[0, -1], [n - 1, 1]] as const) {
    const d = dir(i)
    quadOut(p, side(i, 1, foot(i)), side(i, -1, foot(i)), side(i, -1, top(i)), side(i, 1, top(i)), [d[0] * s, d[1] * s, 0])
  }
  return { top, dir, side }
}

/** A deterministic hash in 0..1, for the crag's irregular outline. */
const hash = (a: number, b: number) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v) }

/**
 * The crag under the upper citadel: an irregular, faceted rock body along a
 * wall path, from its feet in the ground up to `cut(i)`, where the masonry
 * starts. Three levels of outline, each pushed in and out and up and down
 * by a hash, so it reads as broken rock, not a smooth batter.
 */
function rockAlong(p: Part, path: P3[], cut: (i: number) => number, t: number) {
  const n = path.length
  const dir = (i: number): XY => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  const foot = (i: number) => path[i][2] - G0 - FEET
  const lv = (i: number, k: number, s: number): V3 => {
    const z0 = foot(i), z2 = cut(i), j = hash(path[i][0] + s * 3.1, path[i][1] + k * 1.7)
    const z = k === 0 ? z0 : k === 2 ? z2 : z0 + (z2 - z0) * (0.45 + 0.25 * (j - 0.5))
    const hw = t / 2 + (k === 2 ? 0.6 + 1.4 * j : 0.3 * (z2 - z) + 1.2 + 2.6 * j)
    const d = dir(i)
    return [path[i][0] + d[1] * s * hw, path[i][1] - d[0] * s * hw, z]
  }
  for (let i = 0; i < n - 1; i++) {
    const d = dir(i), out: V3 = [d[1], -d[0], 0]
    for (const s of [1, -1]) for (let k = 0; k < 2; k++) {
      // split each quad along its shorter diagonal's facet: two triangles, faceted
      const a = lv(i, k, s), b = lv(i + 1, k, s), c = lv(i + 1, k + 1, s), e = lv(i, k + 1, s)
      const o: V3 = [out[0] * s, out[1] * s, 0.3]
      triOut(p, a, b, c, o); triOut(p, a, c, e, o)
    }
    // the ledge from the rock's edge in to the wall's foot
    for (const s of [1, -1]) {
      const w = (k: number) => { const q = path[k], dd = dir(k); return [q[0] + dd[1] * s * t / 2, q[1] - dd[0] * s * t / 2, cut(k) + 0.4] as V3 }
      quadOut(p, lv(i, 2, s), lv(i + 1, 2, s), w(i + 1), w(i), [out[0] * s * 0.3, out[1] * s * 0.3, 1])
    }
  }
  for (const [i, sg] of [[0, -1], [n - 1, 1]] as const) {
    const d = dir(i), nrm: V3 = [d[0] * sg, d[1] * sg, 0]
    const ring = [lv(i, 0, 1), lv(i, 1, 1), lv(i, 2, 1), lv(i, 2, -1), lv(i, 1, -1), lv(i, 0, -1)]
    for (let k = 1; k < ring.length - 1; k++) triOut(p, ring[0], ring[k], ring[k + 1], nrm)
  }
}

/** A rock foot under a tower: a jagged, tapering mass from the ground to z1. */
function rockFoot(p: Part, x: number, y: number, r: number, z0: number, z1: number, n: number, seed: number) {
  const ring = (rr: number, z: number, k: number, jr: number, jz: number): V3[] => Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n, j = hash(seed + i * 0.37, k)
    return [x + (rr + jr * (j - 0.3)) * Math.cos(a), y + (rr + jr * (j - 0.3)) * Math.sin(a), z + jz * (hash(seed + i, k + 5) - 0.5)]
  })
  const h = z1 - z0
  p.loft([ring(r + 0.3 * h + 1.2, z0, 0, 2.4, 0), ring(r + 0.15 * h + 1.0, z0 + h * 0.5, 1, 2.2, 2.0), ring(r + 0.7, z1, 2, 1.2, 0)])
  // the ledge round the tower's foot
  const top = ring(r + 0.7, z1, 2, 1.2, 0), inner = Array.from({ length: n }, (_, i): V3 => { const a = (2 * Math.PI * i) / n; return [x + r * Math.cos(a), y + r * Math.sin(a), z1 + 0.4] })
  for (let i = 0; i < n; i++) { const k = (i + 1) % n; quadOut(p, top[i], top[k], inner[k], inner[i], [0, 0, 1]) }
}

/** Square merlons along a path's top, both faces real. */
function merlons(p: Part, path: P3[], top: (i: number) => number, dir: (i: number) => XY, t: number, from: number, to: number) {
  for (let i = from; i < Math.min(to, path.length - 1); i++) {
    const a = path[i], b = path[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.floor(L / 1.6)
    for (let j = 0; j < k; j++) {
      const f = (j + 0.5) / k, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f
      const z = top(i) + (top(i + 1) - top(i)) * f, d = dir(i)
      box(p, [x, y, z + 0.5], 0.42, t / 2, 0.5, Math.atan2(d[1], d[0]), p)
    }
  }
}

export function build(detail: boolean) {
  const wall = new Part(), tower = new Part(), church = new Part(), roof = new Part(), glaze = new Part(), cap = new Part(), rock = new Part()
  const SEG = detail ? 8 : 6

  // ---- Walls ---------------------------------------------------------
  // Ruined tops: uneven, with stepped drops, not a level parapet.
  const jag = (x: number, y: number) => rough(x, y) + 0.6 * Math.sign(Math.sin(x * 0.83 + y * 0.29))
  const lowH = (i: number) => 8 + 1.6 * jag(LOWER[i][0], LOWER[i][1])
  // The upper citadel: the photo from the north puts its wall line about
  // twice the church's height (22 m) above the church's floor, high on the
  // ridge, where the z12 ground is smoothed far too low. Its tops are set
  // to the photo's levels (ground-relative 76 rising to 90 m, i.e. 30 to 44
  // m over the church floor at 46.3), so the citadel stands 18 to 27 m over
  // the smoothed ground; the real walls are about 10 m on a crag the DEM
  // doesn't have, so only the top 10 m is masonry and everything below it
  // is that crag: grey-ochre rock (`rockAlong`, `rockFoot`), faceted and
  // irregular.
  const upTopG = (x: number) => (x >= -31 ? 76 : x <= -80 ? 90 : 76 + (14 * (-31 - x)) / 49)
  const upH = (i: number) => upTopG(UPPER[i][0]) - UPPER[i][2] + 1.8 * jag(UPPER[i][0], UPPER[i][1])
  // two breaches: one in the lower ring's east side, one in the upper loop's south side
  const piece = (path: P3[], h: (i: number) => number, t: number, gap: number, bat = 0) => {
    const g = gap < 0 ? -1 : gap
    if (g < 0) return void wallAlong(wall, path, h, t, bat)
    wallAlong(wall, path.slice(0, g + 1), (j) => h(j), t, bat)
    wallAlong(wall, path.slice(g + 2), (j) => h(j + g + 2), t, bat)
  }
  const lowGap = LOWER.findIndex((q) => q[0] > 39 && q[1] > 1.5), upGap = UPPER.findIndex((q) => q[0] > -97 && q[1] < 27)
  piece(LOWER, lowH, 2.4, lowGap)
  // the upper citadel: masonry only in its top 10 m, on a rock crag below
  const upCut = (i: number) => UPPER[i][2] - G0 + upH(i) - 10
  {
    const g = upGap
    for (const [a, b] of [[0, g + 1], [g + 2, UPPER.length]] as const) {
      const sub = UPPER.slice(a, b)
      // the rock is coarser in the low model: every other point of the line
      const ix = sub.map((_, j) => j).filter((j) => detail || j % 2 === 0 || j === sub.length - 1)
      rockAlong(rock, ix.map((j) => sub[j]), (k) => upCut(ix[k] + a), 2.8)
      wallAlong(wall, sub, (j) => upH(j + a), 2.8, 0, (j) => upCut(j + a) - 0.5)
    }
  }
  if (detail) {
    // the restored, crenellated stretch north of the church (Kerbush's photos)
    const lf = pathFns(LOWER, lowH, 2.4)
    const i0 = LOWER.findIndex((q) => q[0] < 31 && q[1] > 27), i1 = LOWER.findIndex((q) => q[0] < -19)
    merlons(cap, LOWER, lf.top, lf.dir, 0.7, i0, i1)
  }

  // ---- Round towers: 5 to 10 m across, of different heights over the
  // wall beside them, some standing proud of it; the west end tower the
  // biggest and much the tallest. Tops ruined to an uneven ring.
  const R = [4.6, 3.0, 3.6, 2.6, 3.0, 3.8, 4.5, 3.2, 4.0, 4.2, 4.0, 3.6, 3.4, 3.8, 3.5, 3.2, 5.0, 3.2, 3.4, 3.6, 2.8, 3.6, 3.0, 3.2, 2.7, 3.0, 3.0, 2.6, 3.0, 2.8]
  const UP = [3, 1.5, 4, 1, 2.5, 3.5, 4.5, 2, 3.5, 4, 3, 2, 4, 2.5, 3.5, 2, 9, 2.5, 3, 4, 1.5, 3, 2, 2.5, 1.5, 2, 3, 1.5, 2, 2.5]
  TOWERS.forEach(([x0, y0, , g], i) => {
    const upper = x0 < -30
    const r = R[i]
    // proud of the wall: pushed out from the ring's middle by a third of its radius on alternate towers
    const c: XY = upper ? [-80, 36] : [12, 10]
    const d = Math.hypot(x0 - c[0], y0 - c[1]) || 1, push = i % 2 ? 0.35 * r : 0.1 * r
    const x = x0 + ((x0 - c[0]) / d) * push, y = y0 + ((y0 - c[1]) / d) * push
    const top = (upper ? upTopG(x0) : g + 8) + UP[i] + 0.8 * rough(y, x)
    const n = detail ? 16 : 8
    const z0 = g - G0 - FEET, z1 = top - G0
    if (upper) {
      // masonry in its top 10-12 m, on a jagged rock foot
      const zc = z1 - 10 - UP[i] * 0.5
      if (zc > z0 + 1) rockFoot(rock, x, y, r, z0, zc, detail ? 10 : 7, i * 7.3)
      lathe(tower, [[r * 1.03, Math.max(z0, zc - 0.5)], [r, z1]], n, [x, y], 0, true)
    } else lathe(tower, [[r * 1.08, z0], [r * 1.04, z1 - 3], [r, z1]], n, [x, y], 0, true)
    // a ruined top: the parapet ring higher on one side
    const tip = (k: number) => z1 + 0.9 * Math.max(0, Math.sin((2 * Math.PI * k) / n + i))
    for (let k = 0; k < n; k++) {
      const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
      const P = (a: number, rr: number, z: number): V3 => [x + rr * Math.cos(a), y + rr * Math.sin(a), z]
      quadOut(tower, P(a0, r, z1), P(a1, r, z1), P(a1, r, tip(k + 1)), P(a0, r, tip(k)), [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
      quadOut(tower, P(a0, r, tip(k)), P(a1, r, tip(k + 1)), P(a1, r - 0.7, tip(k + 1)), P(a0, r - 0.7, tip(k)), [0, 0, 1])
      if (detail) quadOut(tower, P(a0, r - 0.7, tip(k)), P(a1, r - 0.7, tip(k + 1)), P(a1, r - 0.7, z1 - 1.2), P(a0, r - 0.7, z1 - 1.2), [-Math.cos((a0 + a1) / 2), -Math.sin((a0 + a1) / 2), 0])
    }
    lathe(tower, [[r - 0.7, z1 - 1.2], [0, z1 - 1.2]], n, [x, y], 0, false)
    if (detail && !upper) for (let k = 0; k < n; k += 2) {
      const a = (2 * Math.PI * (k + 0.5)) / n
      box(cap, [x + (r - 0.35) * Math.cos(a), y + (r - 0.35) * Math.sin(a), tip(k) + 0.45], 0.4, 0.33, 0.45, a, cap)
    }
  })

  // ---- St Nicholas church --------------------------------------------
  // its own frame: u along the axis (east, turned 3.4 deg south), v north
  const C: XY = [0.25, 23.7], th = (-3.4 * Math.PI) / 180, cs = Math.cos(th), sn = Math.sin(th)
  const Z0 = 46.3 - G0 // its floor: the ground at its middle
  const zFoot = 43.7 - G0 - FEET
  const toW = (u: number, v: number): XY => [C[0] + u * cs - v * sn, C[1] + u * sn + v * cs]
  const cParts = { wall: new Part(), roof: new Part(), glaze: new Part() }
  {
    const L = 20.1, W = 12.9
    const w = cParts.wall, r = cParts.roof
    // aisles under lean-to roofs (eaves 6.5), the nave and transept gables (eaves 8, ridge 11)
    gabled({ wall: w, roof: r, x0: -L / 2, x1: L / 2, y0: -W / 2, y1: W / 2, ze: 6.5, zr: 6.5 + (W / 2) * 0.55, axis: 'x', ov: 0.3 })
    gabled({ wall: w, roof: r, x0: -L / 2, x1: L / 2, y0: -4.0, y1: 4.0, ze: 8.0, zr: 11.0, axis: 'x', ov: 0.3, z0: 5 })
    gabled({ wall: w, roof: r, x0: 0.6 - 3.6, x1: 0.6 + 3.6, y0: -W / 2, y1: W / 2, ze: 8.0, zr: 11.0, axis: 'y', ov: 0.3, z0: 5 })
    // the drum: eight faces, a round-headed window in each, a pyramid roof and the cross
    const DC: XY = [0.6, 0], NF = 8, RF = 2.8, RC = RF / Math.cos(Math.PI / NF)
    lathe(w, [[RC + 0.3, 9.8], [RC + 0.3, 10.6], [RC, 10.8], [RC, 15.9], [RC + 0.35, 16.1], [RC + 0.35, 16.4]], NF, DC, 0, false)
    lathe(r, [[RC + 0.6, 16.3], [RC + 0.45, 16.55], [0.12, 20.2], [0.0, 20.3]], NF, DC, 0, false)
    beam(r, [DC[0], DC[1], 20.1], [DC[0], DC[1], 21.8], 0.14, 0.14)
    beam(r, [DC[0], DC[1] - 0.42, 21.2], [DC[0], DC[1] + 0.42, 21.2], 0.12, 0.12)
    for (let i = 0; i < NF; i++) {
      const t = ((i + 0.5) * 2 * Math.PI) / NF
      const nn: V3 = [Math.cos(t), Math.sin(t), 0], uu: V3 = [-Math.sin(t), Math.cos(t), 0]
      const fw = 2 * RF * Math.tan(Math.PI / NF)
      const f: Face = { o: [DC[0] + RF * nn[0] - (uu[0] * fw) / 2, DC[1] + RF * nn[1] - (uu[1] * fw) / 2, 0], u: uu, n: nn }
      win(cParts.glaze, f, fw / 2, 11.8, 0.6, 2.8, SEG)
      if (detail) archBand(w, f, fw / 2, 14.6 - 0.2, 0.62, 0.18, 0.15, 6, false)
    }
    // windows and the west door, read from the photos
    const Wf = faceOf([-L / 2, W / 2], [-L / 2, -W / 2])
    win(cParts.glaze, Wf, W / 2, 0.2, 1.3, 2.6, SEG)
    win(cParts.glaze, Wf, W / 2, 5.2, 0.55, 1.8, SEG)
    for (const m of [-1, 1]) {
      const F = m < 0 ? faceOf([-L / 2, -W / 2], [L / 2, -W / 2]) : faceOf([L / 2, W / 2], [-L / 2, W / 2])
      for (const s of [3.2, L - 3.2]) win(cParts.glaze, F, s, 2.6, 0.5, 1.9, SEG)
      win(cParts.glaze, F, L / 2 + (m < 0 ? 0.6 : -0.6), 2.4, 0.6, 2.2, SEG)
      if (detail) for (const s of [L / 2 - 0.9, L / 2 + 0.9]) win(cParts.glaze, F, s + (m < 0 ? 0.6 : -0.6), 6.7, 0.42, 1.5, SEG)
    }
    const Ef = faceOf([L / 2, -W / 2], [L / 2, W / 2])
    win(cParts.glaze, Ef, W / 2, 3.2, 0.6, 2.4, SEG)
    // a plain plinth from the slope's foot up to the floor
    prism(w, [[-L / 2 - 0.3, -W / 2 - 0.3], [L / 2 + 0.3, -W / 2 - 0.3], [L / 2 + 0.3, W / 2 + 0.3], [-L / 2 - 0.3, W / 2 + 0.3]], zFoot - Z0, 0.4, w, 0.1)
  }
  // place the church: turn and lift every vertex of its parts into the frame
  const place = (src: Part, dst: Part) => {
    for (let i = 0; i < src.pos.length; i += 9) {
      const P = [0, 1, 2].map((k): V3 => { const gx = src.pos[i + k * 3], gy = -src.pos[i + k * 3 + 2], gz = src.pos[i + k * 3 + 1]; const [X, Y] = toW(gx, gy); return [X, Y, gz + Z0] })
      dst.tri(P[0], P[1], P[2])
    }
  }
  place(cParts.wall, church); place(cParts.roof, roof); place(cParts.glaze, glaze)

  // walls and towers are one masonry
  wall.pos.push(...tower.pos); wall.nrm.push(...tower.nrm); wall.uv.push(...tower.uv)
  return { wall, church, roof, glaze, cap, rock }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)
    const stone = { ...finish('narikala-masonry', 0x8f7c6c), floodlight: lit }
    return [
      { part: p.wall, material: stone },
      { part: p.rock, material: { ...finish('narikala-crag', 0x9b9180, 0.95), floodlight: (_q: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.45) } },
      { part: p.cap, material: { ...finish('narikala-restored', 0xa08a76), floodlight: lit } },
      { part: p.church, material: { ...finish('st-nicholas-stone', 0xe3d2ac), floodlight: lit } },
      { part: p.roof, material: { ...finish('st-nicholas-roof', 0x9aa1a5, 0.6), floodlight: (_q: V3, n: V3) => (n[2] > 0.5 ? 0.2 : 0.5) } },
      { part: p.glaze, material: PALETTE.window },
    ]
  }
  const meta = { bearing: 0, osm: 'relation/9820020', height: 82.9 }
  await writeModel('tbilisi-narikala.glb', 'Narikala Fortress', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-narikala.detail.glb', 'Narikala Fortress', make(true), meta, 40000, 1536 * 1024)
}
