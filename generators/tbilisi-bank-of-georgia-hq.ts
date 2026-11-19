/**
 * Bank of Georgia Headquarters, Tbilisi: the former Ministry of Highway
 * Construction of the Georgian SSR (George Chakhava and Zurab Jalaghania,
 * 1972-1975), Gagarin Street 29a, on the slope down to the Kura:
 * procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-bank-of-georgia-hq.ts
 * Writes models/tbilisi-bank-of-georgia-hq.glb and a detail model
 * models/tbilisi-bank-of-georgia-hq.detail.glb (the coffered soffits, the
 * window hoods framed all round, the raking struts).
 *
 * Uses the relief kit in tbilisi-chronicle-of-georgia.ts.
 *
 * Frame: x east, y north, z up, metres, built turned to bearing 76: +y runs
 * along the building's long axis, 76 deg (ENE, down the slope toward the
 * river), +x along 166 deg. Origin at the area centroid of the outline
 * way/1236448832: 44.7708965, 41.7357601.
 *
 * Identity: three square concrete cores standing on the slope, and five
 * two-storey horizontal blocks stacked across them in alternating
 * directions, each running clear through its cores and cantilevering far
 * out past them, so the building reads as a 3D lattice of crossed beams.
 * Every block is a hollow concrete box: long sides with ribbon windows
 * under deep projecting hoods, the ends blind but for two small framed
 * windows one above the other, a dark coffered soffit underneath. The
 * cores are cut by deep vertical slots. Pale warm-grey concrete.
 *
 * Evidence
 * - OSM (ODbL): the outline way/1236448832 (building=office, brutalist,
 *   1975); building:parts 1236448835, 1236448836, 1236448837 (17 levels:
 *   the three cores, about 13 m square, drawn 10 m square inside their
 *   blocks); the blocks with their levels: 1236448834 (y, levels 5-6, down
 *   the slope from the middle core), 1236448833 (x, 8-9, through the middle
 *   and east cores), 557466934 + 1358301477 (y, 11-12, the bridge from the
 *   upper street through the upper and middle cores), 557466932 (y, 11-12,
 *   through the east core), 557466935 (x, 14-15, the crown). The outline is
 *   the union of these plans. way/1236448838, the glass entrance pavilion,
 *   is a separate building left to the map.
 * - Published: Wikipedia (en, "Bank of Georgia headquarters"): 18 storeys
 *   at the highest core; "rests on and hangs from three cores"; five
 *   horizontal sections of two storeys each, three running east-west (the
 *   model's y) and two north-south (x); 1972-1975, renovated 2010-2011.
 *   https://en.wikipedia.org/wiki/Bank_of_Georgia_headquarters
 * - Photos (all evidence):
 *   - "Bank-of-georgia-hq.jpg", TheadoreTwombly, CC BY-SA 4.0: from the
 *     street below to the north-east, the stacked cantilevers, the ends with
 *     two small windows, the soffits.
 *     https://commons.wikimedia.org/wiki/File:Bank-of-georgia-hq.jpg
 *   - "Bank-of-georgia-headquarter.jpg", TheadoreTwombly, CC BY-SA 4.0: from
 *     the upper street, the top bridge block over the gorge (ivy-covered).
 *     https://commons.wikimedia.org/wiki/File:Bank-of-georgia-headquarter.jpg
 *   - "Architecture of Tbilisi, Part II - TbilisiArchitecture8017.jpg",
 *     lumoplank, CC0: from the air to the south, the alternation of the
 *     blocks up one core and the raking struts.
 *     https://commons.wikimedia.org/wiki/File:Architecture_of_Tbilisi,_Part_II_-_TbilisiArchitecture8017.jpg
 *   - "Bank of Georgia headquarters", Ndecam, CC BY 2.0, Flickr: from
 *     below, the hoods round the ribbon windows and the coffered soffits.
 *     https://www.flickr.com/photos/37035967@N07/14668507127
 *   - "Didube-Chugureti, Tbilisi, Georgia - panoramio (1).jpg", Daibo Taku,
 *     CC BY 3.0: across the river, the whole silhouette.
 *     https://commons.wikimedia.org/wiki/File:Didube-Chugureti,_Tbilisi,_Georgia_-_panoramio_(1).jpg
 * - Colour, sampled: lit concrete #cdc6b3, #c7bfa9 (overcast), #b5ad97
 *   in half-shade; soffits dark in every photo.
 * - Look-only: Flickr "Soviet Brutalist Architecture: Georgian Ministry of
 *   Highways" by JoeInSouthernCA (CC BY-ND), not used for any number.
 *
 * Numbers: plans and block levels from OSM; the fifth block (y, levels
 * 2-3, through the east core) is inferred from Wikipedia's three east-west
 * sections and the photos. Floor to floor 3.6 m (estimated), so the bridge
 * block's floor comes out at 39.6 m, the level of the upper street in the
 * map's terrain and in the photo from the street; cores to 18 storeys
 * (66.6 m, published storeys, estimated height). Blocks 10 m deep (two
 * storeys, a deep soffit slab and parapet: the ends read near square in the
 * photos). Window bands, hoods and end windows from the photos. Doubts: the
 * fifth block's place; the cores' size inside the blocks; the ivy that
 * covers the bridge block and the east core is left off. Office windows
 * glow at night (window material); nothing else is lit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, faceAt, quadOut, rect, boxXY, writeModel } from './tbilisi-chronicle-of-georgia'

type XY = [number, number]
const FH = 3.6 // floor to floor
const BH = 2 * FH + 3.0 // a block: two storeys, a deep coffered soffit slab and a parapet (ends near square in the photos)
const TOP = 18 * FH + 1.8 // the cores' tops: 18 storeys

type Parts = { wall: Part; win: Part; roof: Part; soffit: Part }

/** The four faces of a box, centred on each face, u running along it counter-clockwise. */
function boxFaces(x0: number, y0: number, x1: number, y1: number): { f: Face; L: number }[] {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
  return [
    { f: { o: [mx, y0, 0], u: [1, 0, 0], n: [0, -1, 0] }, L: x1 - x0 },
    { f: { o: [x1, my, 0], u: [0, 1, 0], n: [1, 0, 0] }, L: y1 - y0 },
    { f: { o: [mx, y1, 0], u: [-1, 0, 0], n: [0, 1, 0] }, L: x1 - x0 },
    { f: { o: [x0, my, 0], u: [0, -1, 0], n: [-1, 0, 0] }, L: y1 - y0 },
  ]
}

/** A bar proud of a face: front, top, bottom and both ends. */
function proud(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const A = (s: number, z: number, d: number) => faceAt(f, s, z, d)
  quadOut(p, A(s0, z0, d1), A(s1, z0, d1), A(s1, z1, d1), A(s0, z1, d1), f.n)
  quadOut(p, A(s0, z1, d0), A(s1, z1, d0), A(s1, z1, d1), A(s0, z1, d1), [0, 0, 1])
  quadOut(p, A(s0, z0, d0), A(s1, z0, d0), A(s1, z0, d1), A(s0, z0, d1), [0, 0, -1])
  quadOut(p, A(s0, z0, d0), A(s0, z1, d0), A(s0, z1, d1), A(s0, z0, d1), f.u.map((v) => -v) as V3)
  quadOut(p, A(s1, z0, d0), A(s1, z1, d0), A(s1, z1, d1), A(s1, z0, d1), f.u)
}

/**
 * A wall face with rectangular window recesses, triangulated as a grid of
 * cells between the openings' edges (clean rectangles, no slanted cuts):
 * the plate, each opening's four reveals and its glazed back.
 */
function rectWall(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, holes: XY[][], depth: number, back: Part) {
  const R = holes.map((h) => [Math.min(...h.map((q) => q[0])), Math.max(...h.map((q) => q[0])), Math.min(...h.map((q) => q[1])), Math.max(...h.map((q) => q[1]))])
  const ss = [...new Set([s0, s1, ...R.flatMap((r) => [r[0], r[1]])])].sort((a, b) => a - b)
  const zs = [...new Set([z0, z1, ...R.flatMap((r) => [r[2], r[3]])])].sort((a, b) => a - b)
  for (let i = 0; i < ss.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
    const ms = (ss[i] + ss[i + 1]) / 2, mz = (zs[j] + zs[j + 1]) / 2
    if (R.some((r) => ms > r[0] && ms < r[1] && mz > r[2] && mz < r[3])) continue
    quadOut(p, faceAt(f, ss[i], zs[j]), faceAt(f, ss[i + 1], zs[j]), faceAt(f, ss[i + 1], zs[j + 1]), faceAt(f, ss[i], zs[j + 1]), f.n)
  }
  for (const [a, b, c, d] of R) {
    const A = (s: number, z: number, dd: number) => faceAt(f, s, z, dd)
    quadOut(p, A(a, c, 0), A(b, c, 0), A(b, c, -depth), A(a, c, -depth), [0, 0, 1])
    quadOut(p, A(a, d, 0), A(b, d, 0), A(b, d, -depth), A(a, d, -depth), [0, 0, -1])
    quadOut(p, A(a, c, 0), A(a, d, 0), A(a, d, -depth), A(a, c, -depth), f.u)
    quadOut(p, A(b, c, 0), A(b, d, 0), A(b, d, -depth), A(b, c, -depth), f.u.map((v) => -v) as V3)
    quadOut(back, A(a, c, -depth), A(b, c, -depth), A(b, d, -depth), A(a, d, -depth), f.n)
  }
}

/**
 * A two-storey block: a hollow box with ribbon windows on its long sides,
 * two small windows on each end, a flat roof and a coffered soffit.
 */
function block(P: Parts, x0: number, y0: number, x1: number, y1: number, floor: number, detail: boolean, endWin: [boolean, boolean] = [true, true]) {
  const z0 = floor * FH, z1 = z0 + BH
  const alongY = y1 - y0 > x1 - x0
  const faces = boxFaces(x0, y0, x1, y1)
  for (const [k, { f, L }] of faces.entries()) {
    const long = alongY ? k % 2 === 1 : k % 2 === 0
    const h = L / 2
    const holes: XY[][] = []
    if (long) {
      // per storey a ribbon, broken into runs about 10 m long by piers
      const n = detail ? Math.max(1, Math.round((L - 3) / 11)) : Math.max(1, Math.round((L - 3) / 22))
      const run = (L - 3 - (n - 1) * 1.4) / n
      for (let st = 0; st < 2; st++) {
        const sz = z0 + 1.2 + st * FH + 1.0
        for (let i = 0; i < n; i++) {
          const s0 = -h + 1.5 + i * (run + 1.4)
          holes.push(rect(s0, s0 + run, sz, sz + 1.6))
          // the hood: a projecting concrete box round the band (top and cheeks; all round in the detail model)
          proud(P.wall, f, s0 - 0.35, s0 + run + 0.35, sz + 1.6, sz + 1.9, 0, 0.75)
          if (detail) {
            proud(P.wall, f, s0 - 0.35, s0 + run + 0.35, sz - 0.3, sz, 0, 0.75)
            proud(P.wall, f, s0 - 0.35, s0, sz, sz + 1.6, 0, 0.75)
            proud(P.wall, f, s0 + run, s0 + run + 0.35, sz, sz + 1.6, 0, 0.75)
          }
        }
      }
    } else if (endWin[k < 2 ? 0 : 1] ?? true) {
      // the blind end: two small framed windows one above the other, off centre
      for (let st = 0; st < 2; st++) {
        const sz = z0 + 1.2 + st * FH + 1.0, s0 = h - 4.2
        holes.push(rect(s0, s0 + 1.7, sz, sz + 1.6))
        proud(P.wall, f, s0 - 0.3, s0 + 2.0, sz + 1.6, sz + 1.9, 0, 0.6)
        if (detail) {
          proud(P.wall, f, s0 - 0.3, s0 + 2.0, sz - 0.3, sz, 0, 0.6)
          proud(P.wall, f, s0 - 0.3, s0, sz, sz + 1.6, 0, 0.6)
          proud(P.wall, f, s0 + 1.7, s0 + 2.0, sz, sz + 1.6, 0, 0.6)
        }
      }
    }
    rectWall(P.wall, f, -h, h, z0, z1, holes, 0.3, P.win)
  }
  // roof: a parapet lip round a flat roof
  const r = (x: number, y: number, z: number): V3 => [x, y, z]
  quadOut(P.roof, r(x0 + 0.4, y0 + 0.4, z1 - 0.3), r(x1 - 0.4, y0 + 0.4, z1 - 0.3), r(x1 - 0.4, y1 - 0.4, z1 - 0.3), r(x0 + 0.4, y1 - 0.4, z1 - 0.3), [0, 0, 1])
  const lip: [V3, V3, V3, V3][] = [
    [r(x0, y0, z1), r(x1, y0, z1), r(x1 - 0.4, y0 + 0.4, z1), r(x0 + 0.4, y0 + 0.4, z1)],
    [r(x1, y0, z1), r(x1, y1, z1), r(x1 - 0.4, y1 - 0.4, z1), r(x1 - 0.4, y0 + 0.4, z1)],
    [r(x1, y1, z1), r(x0, y1, z1), r(x0 + 0.4, y1 - 0.4, z1), r(x1 - 0.4, y1 - 0.4, z1)],
    [r(x0, y1, z1), r(x0, y0, z1), r(x0 + 0.4, y0 + 0.4, z1), r(x0 + 0.4, y1 - 0.4, z1)],
  ]
  for (const q of lip) quadOut(P.wall, q[0], q[1], q[2], q[3], [0, 0, 1])
  // the parapet's inner face down to the roof
  const inner: [XY, XY, V3][] = [[[x0 + 0.4, y0 + 0.4], [x1 - 0.4, y0 + 0.4], [0, 1, 0]], [[x1 - 0.4, y0 + 0.4], [x1 - 0.4, y1 - 0.4], [-1, 0, 0]], [[x1 - 0.4, y1 - 0.4], [x0 + 0.4, y1 - 0.4], [0, -1, 0]], [[x0 + 0.4, y1 - 0.4], [x0 + 0.4, y0 + 0.4], [1, 0, 0]]]
  for (const [a, b, n] of inner) quadOut(P.wall, [a[0], a[1], z1 - 0.3], [b[0], b[1], z1 - 0.3], [b[0], b[1], z1], [a[0], a[1], z1], n)
  // the soffit: dark, coffered in the detail model
  quadOut(P.soffit, r(x0, y0, z0), r(x1, y0, z0), r(x1, y1, z0), r(x0, y1, z0), [0, 0, -1])
  if (detail) {
    const ribs = (a0: number, a1: number, b0: number, b1: number, alongX: boolean) => {
      const n = Math.max(2, Math.round((a1 - a0) / 1.8))
      for (let i = 1; i < n; i++) {
        const a = a0 + ((a1 - a0) * i) / n
        if (alongX) boxXY(P.soffit, a - 0.12, b0, a + 0.12, b1, z0 - 0.35, z0, true)
        else boxXY(P.soffit, b0, a - 0.12, b1, a + 0.12, z0 - 0.35, z0, true)
      }
    }
    ribs(x0, x1, y0, y1, true)
    ribs(y0, y1, x0, x1, false)
  }
}

/** A core: a square shaft with two deep slots on every face. */
function core(P: Parts, cx: number, cy: number, z1: number, detail: boolean) {
  const h = 5
  for (const { f } of boxFaces(cx - h, cy - h, cx + h, cy + h)) {
    const holes = [rect(-2.6, -1.8, 1.0, z1 - 1.5), rect(1.8, 2.6, 1.0, z1 - 1.5)]
    rectWall(P.wall, f, -h, h, 0, z1, holes, detail ? 1.2 : 0.8, P.win)
  }
  quadOut(P.roof, [cx - h, cy - h, z1], [cx + h, cy - h, z1], [cx + h, cy + h, z1], [cx - h, cy + h, z1], [0, 0, 1])
}

/** A raking strut from a block's soffit edge down to a core. */
function strut(p: Part, a: V3, b: V3, w = 0.5) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(d[0], d[1], d[2])
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const side: V3 = Math.abs(u[0]) > Math.abs(u[1]) ? [0, 1, 0] : [1, 0, 0]
  const up: V3 = [u[1] * side[2] - u[2] * side[1], u[2] * side[0] - u[0] * side[2], u[0] * side[1] - u[1] * side[0]]
  const C = (o: V3, i: number): V3 => {
    const [s, t] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + (side[0] * s + up[0] * t) * w / 2, o[1] + (side[1] * s + up[1] * t) * w / 2, o[2] + (side[2] * s + up[2] * t) * w / 2]
  }
  const A = [0, 1, 2, 3].map((i) => C(a, i)), B = [0, 1, 2, 3].map((i) => C(b, i))
  const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(A[i][0] + A[j][0]) / 2 - a[0], (A[i][1] + A[j][1]) / 2 - a[1], (A[i][2] + A[j][2]) / 2 - a[2]]
    quadOut(p, A[i], A[j], B[j], B[i], m)
    void mid
  }
}

// cores (centres, from the OSM parts)
const CA: XY = [-14.05, -32.95], CC: XY = [-14.4, 9.4], CB: XY = [25.15, 9.7]

export function build(detail: boolean) {
  const P: Parts = { wall: new Part(), win: new Part(), roof: new Part(), soffit: new Part() }
  core(P, CA[0], CA[1], 11 * FH + BH + 1.2, detail) // up through the bridge block
  core(P, CC[0], CC[1], TOP, detail)
  core(P, CB[0], CB[1], TOP, detail)
  // five layers of two-storey blocks, alternating, at the OSM parts' levels:
  // three along y (east-west), two along x (north-south)
  block(P, 18.9, -10.9, 31.3, 26.8, 2, detail) // Y, levels 2-3, through the east core (not in OSM: the third east-west section)
  block(P, -20.8, -9.7, -7.6, 28.2, 5, detail) // Y, levels 5-6, down the slope from the middle core (way/1236448834)
  block(P, -33.6, 2.2, 41.8, 16.9, 8, detail) // X, levels 8-9, through the middle and east cores (way/1236448833)
  block(P, -20.8, -48.7, -7.6, 28.2, 11, detail, [false, true]) // Y, levels 11-12: the bridge from the upper street over the gorge (ways 557466934, 1358301477)
  block(P, 18.9, -10.9, 31.3, 26.8, 11, detail) // Y, levels 11-12, through the east core (way/557466932)
  block(P, -33.6, 2.2, 41.8, 16.9, 14, detail) // X, levels 14-15, the crown (way/557466935)
  if (detail) {
    // the raking struts under the cantilevers, from the soffit's outer edge back to the core
    const s = (b: V3, c: V3) => strut(P.wall, b, c, 0.55)
    s([25.1, 25.6, 2 * FH], [25.1, 14.9, 2 * FH - 6])
    s([-14.2, 27.0, 5 * FH], [-14.2, 14.6, 5 * FH - 9])
    s([-32.5, 9.5, 8 * FH], [-19.6, 9.5, 8 * FH - 9])
    s([40.6, 9.5, 8 * FH], [30.4, 9.5, 8 * FH - 9])
    s([-14.2, 27.0, 11 * FH], [-14.2, 14.6, 11 * FH - 9])
    s([25.1, 25.6, 11 * FH], [25.1, 14.9, 11 * FH - 9])
  }
  return P
}

export const COLORS = {
  concrete: 0xd2c9b5, // lit #cdc6b3 / #c7bfa9, half-shade #b5ad97
  soffit: 0x7a7466, // the coffered undersides, dark in every photo
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.wall, material: finish('bog-concrete', COLORS.concrete) },
      { part: p.win, material: PALETTE.window },
      { part: p.roof, material: PALETTE.roof },
      { part: p.soffit, material: finish('bog-soffit', COLORS.soffit) },
    ]
  }
  const meta = { bearing: 76, osm: 'way/1236448832', height: TOP }
  await writeModel('tbilisi-bank-of-georgia-hq.glb', 'Bank of Georgia Headquarters', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-bank-of-georgia-hq.detail.glb', 'Bank of Georgia Headquarters', make(true), meta, 40000, 1536 * 1024)
}
