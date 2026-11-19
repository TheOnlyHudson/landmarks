/**
 * Detroit Institute of Arts (5200 Woodward Avenue; 1927 Paul Philippe Cret
 * Beaux-Arts building in white Vermont marble, with the 1966 south and 1971
 * north wings by Harley, Ellington & Associates, reclad in marble in Michael
 * Graves's 2007 renovation): procedural, CC0-1.0.
 * bun generators/det-detroit-institute-of-arts.ts
 *
 * Map frame: x, y, z up, metres, turned to the museum's walls: +y runs along
 * bearing 63.5 (east-north-east, towards John R Street), +x along 153.5
 * (south-south-east). The Woodward front faces -y. The anchor is the centroid
 * of the OSM outline (relation/1553447, outer way/109657507):
 * 42.3594142, -83.0643873. The Cret front is symmetric about x = -2.5.
 *
 * Identity, in order: the long, low white-marble Woodward front with its
 * projecting central pavilion: three tall round-arched entrance openings
 * between columns, the entablature, a plain attic with the medallion, and
 * the red-tile hipped roof of the Great Hall rising behind it; the red tile
 * edge of the low roofs along the flanking ranges, each with four tall
 * windows over a basement row; the grand stair; the glass roofs of the two
 * courts; the plainer, set-back north and south wings.
 *
 * Evidence:
 *  - plan: OSM relation/1553447 (building=yes, height 11.73 (too low),
 *    Q1201549); the inner ring way/109657506 is an open court.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid read in
 *    this frame. Ground 3.8 m over the box minimum (Woodward side 4.0-4.3);
 *    heights below are above that. Measured: the front ranges 15.4; the
 *    central pavilion's attic 20.2; the Great Hall hip roof, 25 x 38 m,
 *    ridge 26.3; the south court's glass roof 20.0, the north court's 17.0;
 *    the rear block 16.4 with a glass pyramid to 21.5; the auditorium 18.6;
 *    the wings 16.2-16.4; the low ring round the open court 4.7.
 *  - photos (all EVIDENCE):
 *    - Detroit Institute of Arts From DPL.jpg, Av9, CC BY-SA 4.0 (the whole
 *      Woodward front, square on, from the library): pavilion and range
 *      proportions, window places, the tile roofs.
 *      https://commons.wikimedia.org/wiki/File:Detroit_Institute_of_Arts_From_DPL.jpg
 *    - Detroit Institute of Arts August 2011 03.jpg, Michael Barera,
 *      CC BY-SA 4.0 (the auditorium from the north-east, the John R
 *      porte-cochere and the marble-clad north wing).
 *      https://commons.wikimedia.org/wiki/File:Detroit_Institute_of_Arts_August_2011_03.jpg
 *    - Detroit Institute of Arts - IMG 8923.JPG, Daderot, public domain (the
 *      front from the north-west).
 *      https://commons.wikimedia.org/wiki/File:Detroit_Institute_of_Arts_-_IMG_8923.JPG
 *    - Night: Ken Lund's "Detroit Institute of Arts, Detroit, Michigan"
 *      (flickr 14203867784, CC BY-SA 2.0): floodlit pavilion, lit arches.
 *  - published: Cret with Zantzinger, Borie & Medary, opened 1927; wings 1966
 *    and 1971; Graves renovation 2007 (Wikipedia, "Detroit Institute of
 *    Arts"; NRHP 83003791).
 *  Estimated from the photo scaled to the lidar: the arches (4.8 m wide,
 *  springing 7.6 m over the loggia floor), the windows (2.6 x 4.3 m), the
 *  entablature at 14.2, the stair.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the wings and the rear are covered by one 2011 photo and the
 * lidar only; their window bands are estimated. The brief called the wings
 * dark granite: the photo shows them in pale veined marble (the 2007
 * recladding), drawn so. The porte-cochere on John R is drawn as a slab on
 * piers outside the OSM outline. Elevation 0.
 *
 * Shared helpers for the det- models of this builder (Detroit Institute of
 * Arts, Public Library, Wright Museum, Old Main, St. Paul's Cathedral, First
 * Congregational) are exported from here; merge this generator first.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, walls, rect, inset, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, archShape, archBand, arc, lathe } from './sea-tacoma-union-station'

// ================================================================ shared helpers

/** A quad or triangle wound to face `want`. */
export function face(p: Part, pts: V3[], want: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const ok = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0
  const q = ok ? pts : [...pts].reverse()
  if (q.length === 3) p.tri(q[0], q[1], q[2]); else p.quad(q[0], q[1], q[2], q[3])
}
/** An axis-aligned box: walls in `p`, top in `top` (or none), optional bottom. */
export function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1); walls(p, r, z0, z1); if (top) cap(top, r, z1)
}
/** A box with a small bevel round its top edge. */
export function bbox(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bev = 0.4) {
  const r = rect(x0, y0, x1, y1), i = inset(r, bev)
  walls(p, r, z0, z1 - bev); walls(p, r, z1 - bev, z1, i); if (top) cap(top, i, z1)
}
/** A hipped roof over a rectangle from eaves z0 to ridge z1 (the ridge along the longer side). */
export function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const w = x1 - x0, d = y1 - y0, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
  if (w >= d) {
    const h = d / 2, ra: V3 = [x0 + h, ym, z1], rb: V3 = [x1 - h, ym, z1]
    face(p, [[x0, y0, z0], [x1, y0, z0], rb, ra], [0, -1, 1])
    face(p, [[x1, y1, z0], [x0, y1, z0], ra, rb], [0, 1, 1])
    face(p, [[x0, y1, z0], [x0, y0, z0], ra], [-1, 0, 1])
    face(p, [[x1, y0, z0], [x1, y1, z0], rb], [1, 0, 1])
  } else {
    const h = w / 2, ra: V3 = [xm, y0 + h, z1], rb: V3 = [xm, y1 - h, z1]
    face(p, [[x1, y0, z0], [x1, y1, z0], rb, ra], [1, 0, 1])
    face(p, [[x0, y1, z0], [x0, y0, z0], ra, rb], [-1, 0, 1])
    face(p, [[x0, y0, z0], [x1, y0, z0], ra], [0, -1, 1])
    face(p, [[x1, y1, z0], [x0, y1, z0], rb], [0, 1, 1])
  }
}
/** A pyramid roof over a rectangle. */
export function pyramid(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
  face(p, [[x0, y0, z0], [x1, y0, z0], t], [0, -1, 1]); face(p, [[x1, y0, z0], [x1, y1, z0], t], [1, 0, 1])
  face(p, [[x1, y1, z0], [x0, y1, z0], t], [0, 1, 1]); face(p, [[x0, y1, z0], [x0, y0, z0], t], [-1, 0, 1])
}
/**
 * A gabled roof over a rectangle, ridge along `axis`, eaves z0, ridge z1, with
 * `ov` overhang at the eaves; the gable triangles go to `wall` (null: none).
 */
export function gable(roof: Part, wall: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', ov = 0.3) {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2, s = (z1 - z0) / ((x1 - x0) / 2), ze = z0 - ov * s
    face(roof, [[x0 - ov, y0, ze], [x0 - ov, y1, ze], [xm, y1, z1], [xm, y0, z1]], [-1, 0, 1])
    face(roof, [[x1 + ov, y0, ze], [x1 + ov, y1, ze], [xm, y1, z1], [xm, y0, z1]], [1, 0, 1])
    if (wall) { face(wall, [[x0, y0, z0], [x1, y0, z0], [xm, y0, z1]], [0, -1, 0]); face(wall, [[x0, y1, z0], [x1, y1, z0], [xm, y1, z1]], [0, 1, 0]) }
  } else {
    const ym = (y0 + y1) / 2, s = (z1 - z0) / ((y1 - y0) / 2), ze = z0 - ov * s
    face(roof, [[x0, y0 - ov, ze], [x1, y0 - ov, ze], [x1, ym, z1], [x0, ym, z1]], [0, -1, 1])
    face(roof, [[x0, y1 + ov, ze], [x1, y1 + ov, ze], [x1, ym, z1], [x0, ym, z1]], [0, 1, 1])
    if (wall) { face(wall, [[x0, y0, z0], [x0, y1, z0], [x0, ym, z1]], [-1, 0, 0]); face(wall, [[x1, y0, z0], [x1, y1, z0], [x1, ym, z1]], [1, 0, 0]) }
  }
}
/** The face frame of an axis-aligned wall: 's' (y = c, s = x), 'n' (y = c, s = -x), 'e' (x = c, s = y), 'w' (x = c, s = -y). */
export function side(dir: 's' | 'n' | 'e' | 'w', c: number): Face {
  return dir === 's' ? { o: [0, c, 0], n: [0, -1] } : dir === 'n' ? { o: [0, c, 0], n: [0, 1] } : dir === 'e' ? { o: [c, 0, 0], n: [1, 0] } : { o: [c, 0, 0], n: [-1, 0] }
}
/** The s coordinate on a side for a map coordinate along that wall. */
export const sOf = (dir: 's' | 'n' | 'e' | 'w', v: number) => (dir === 's' || dir === 'e' ? v : -v)
export const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A row of flat panels on a side, centred at map coordinates `at` along the wall. */
export function panels(p: Part, dir: 's' | 'n' | 'e' | 'w', c: number, at: number[], w: number, z0: number, z1: number, d = 0.05) {
  const f = side(dir, c)
  for (const v of at) { const s = sOf(dir, v); flatShape(p, f, R(s - w / 2, z0, s + w / 2, z1), d) }
}
/** Round-headed panels: semicircle springing at zs. */
export function arches(p: Part, dir: 's' | 'n' | 'e' | 'w', c: number, at: number[], w: number, z0: number, zs: number, d = 0.05, segs = 8) {
  const f = side(dir, c)
  for (const v of at) flatShape(p, f, archShape(sOf(dir, v), w, z0, zs, segs), d)
}
/** Evenly spaced centres from a to b, n of them, inset by half a step. */
export const spread = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((i + 0.5) * (b - a)) / n)
export type Mat = { part: Part; material: MaterialSpec }
/** Check the budget and write models/<id>.glb. */
export async function saveModel(id: string, name: string, anchor: [number, number], bearing: number, parts: Mat[], maxTri = 5000) {
  const used = parts.filter(x => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
  if (triangles > maxTri || glb.length > 245_000) throw new Error(`${id}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ================================================================ the museum

const CX = -2.5 // the Cret front's axis
const FX0 = -49.7, FX1 = 44.7 // the Cret front range
const FY = -57.1 // its Woodward face
const PH = 13.9, PY = -62.8 // the pavilion's half-width and face
const RANGE = 15.4, ENT = 14.2, ATTIC = 20.2
const HALL = { x0: -15, x1: 10, y0: -45, y1: -14, ridge: 26.3 }
const REAR = 16.4, WING = 16.3, AUD = 18.6
const FLOOR = 1.5 // the loggia floor over the forecourt

function build(): Mat[] {
  const stone = new Part(), wing = new Part(), tile = new Part(), win = new Part(), glass = new Part(), trim = new Part()
  const m = (x: number) => 2 * CX - x // mirror about the front's axis

  // ---------------------------------------------------------------- the Cret front ranges
  bbox(stone, stone, FX0, FY, FX1, -15, 0, RANGE, 0.3)
  // the red-tile edge of the low hipped roofs: a sloped band along the front and the ends
  {
    const z0 = ENT + 0.4, z1 = RANGE + 0.9, d = 2.6, o = 0.5
    face(tile, [[FX0 - o, FY - o, z0], [FX1 + o, FY - o, z0], [FX1 - d, FY + d, z1], [FX0 + d, FY + d, z1]], [0, -1, 1])
    face(tile, [[FX0 - o, FY - o, z0], [FX0 + d, FY + d, z1], [FX0 + d, -15 - d, z1], [FX0 - o, -15 + o, z0]], [-1, 0, 1])
    face(tile, [[FX1 + o, FY - o, z0], [FX1 + o, -15 + o, z0], [FX1 - d, -15 - d, z1], [FX1 - d, FY + d, z1]], [1, 0, 1])
    face(tile, [[FX0 - o, -15 + o, z0], [FX0 + d, -15 - d, z1], [FX1 - d, -15 - d, z1], [FX1 + o, -15 + o, z0]], [0, 1, 1])
    cap(stone, rect(FX0 + d, FY + d, FX1 - d, -15 - d), z1 - 0.05)
    // the cornice under it
    bbox(trim, null, FX0 - 0.35, FY - 0.35, FX1 + 0.35, -15 + 0.35, ENT - 0.7, ENT + 0.4, 0.2)
  }
  // windows on the front: four tall ones each side, a basement row of triples beneath
  for (const sgn of [-1, 1]) {
    const edge = CX + sgn * PH
    for (const off of [5.0, 12.0, 19.0, 27.4]) {
      const x = edge + sgn * off
      panels(trim, 's', FY, [x], 3.4, FLOOR + 3.6, FLOOR + 8.6, 0.04)
      panels(win, 's', FY, [x], 2.6, FLOOR + 4.0, FLOOR + 8.2, 0.07)
      panels(win, 's', FY, [x - 1.3, x, x + 1.3], 0.9, 0.4, 1.9, 0.06)
    }
    // pilaster strips framing each range's end bay
    for (const x of [edge + sgn * 31.2, sgn > 0 ? FX1 - 0.9 : FX0 + 0.9]) extrudeShape(stone, side('s', FY), R(sOf('s', x) - 0.8, 0, sOf('s', x) + 0.8, ENT - 0.7), 0, 0.25)
  }
  // ends and court sides: tall windows in pairs
  for (const [dir, c] of [['w', FX0], ['e', FX1]] as ['w' | 'e', number][]) {
    panels(win, dir, c, [-50, -42, -34, -26], 2.6, FLOOR + 4.0, FLOOR + 8.2, 0.07)
    panels(win, dir, c, spread(-56, -16, 10), 0.9, 0.4, 1.9, 0.06)
  }

  // ---------------------------------------------------------------- the central pavilion
  const PX0 = CX - PH, PX1 = CX + PH
  bbox(stone, null, PX0, PY, PX1, -44, 0, ATTIC - 0.6, 0.3)
  // the entablature band, the attic's tile-edged cornice
  bbox(trim, null, PX0 - 0.3, PY - 0.3, PX1 + 0.3, -44, ENT - 1.2, ENT, 0.2)
  bbox(tile, stone, PX0 - 0.55, PY - 0.55, PX1 + 0.55, -43.5, ATTIC - 0.6, ATTIC, 0.25)
  // rusticated corner piers
  for (const x of [PX0 + 1.3, PX1 - 1.3]) extrudeShape(stone, side('s', PY), R(x - 1.3, 0, x + 1.3, ENT - 1.2), 0, 0.3)
  // the three arches: a deep archivolt, the dark glazed opening, columns between
  {
    const f = side('s', PY), zs = FLOOR + 7.6, w = 4.8
    flatShape(stone, f, R(CX - 10.0, FLOOR, CX + 10.0, ENT - 1.2), 0.12)
    for (const k of [-1, 0, 1]) {
      const sc = CX + k * 5.8
      flatShape(trim, f, archBand(sc, zs, w / 2, w / 2 + 0.7, zs, 10), 0.17)
      flatShape(win, f, archShape(sc, w, FLOOR, zs, 10), 0.16)
    }
    for (const k of [-1.5, -0.5, 0.5, 1.5]) {
      const x = CX + k * 5.8
      lathe(trim, x, PY - 0.75, [[0.5, FLOOR], [0.42, FLOOR + 0.4], [0.38, zs - 0.6], [0.55, zs - 0.2], [0.55, zs]], 10)
      cap(trim, arc(x, PY - 0.75, 0.55, 0, 360, 10).slice(0, 10) as XY[], zs)
    }
    // the inscribed frieze and the medallion on the attic
    flatShape(trim, f, R(CX - 9.5, ENT + 2.2, CX + 9.5, ENT + 4.4), 0.04)
    flatShape(trim, f, arc(CX, ENT + 3.3, 1.5, 0, 360, 14).slice(0, 14) as XY[], 0.08)
  }
  // the grand stair up to the loggia
  for (let k = 0; k < 5; k++) {
    const y = PY - 0.75 - 1.6 - k * 0.7
    box(stone, stone, CX - 11 - k * 0.4, y, CX + 11 + k * 0.4, PY - 0.2, 0, FLOOR - k * 0.3)
  }

  // ---------------------------------------------------------------- the Great Hall's tile roof and the courts
  box(stone, null, HALL.x0, HALL.y0, HALL.x1, HALL.y1, RANGE - 0.1, ATTIC)
  hip(tile, HALL.x0 - 0.4, HALL.y0 - 0.4, HALL.x1 + 0.4, HALL.y1 + 0.4, ATTIC - 0.2, HALL.ridge)
  // the court roofs: glass hips, the south one higher
  box(stone, null, -38, -45, -17, -18, RANGE - 0.1, RANGE + 0.5)
  hip(glass, -38, -45, -17, -18, RANGE + 0.5, 17.4)
  box(stone, null, 13, -45, 40, -18, RANGE - 0.1, RANGE + 1.2)
  hip(glass, 13, -45, 40, -18, RANGE + 1.2, 20.0)

  // ---------------------------------------------------------------- the rear block, auditorium and open court
  bbox(stone, stone, FX0, -15.5, FX1, 16, 0, REAR, 0.3)
  bbox(stone, stone, -26.2, 15.5, 25, 46.3, 0, REAR, 0.3)
  box(glass, null, -12.5, -10, 7.5, 12, REAR, REAR + 0.4)
  pyramid(glass, -12.5, -10, 7.5, 12, REAR + 0.4, 21.5)
  // the auditorium, a taller block with three arched windows on John R
  bbox(stone, stone, -26.2, 18, -2.5, 46.3, 0, AUD, 0.3)
  bbox(trim, null, -26.5, 17.7, -2.2, 46.6, AUD - 3.8, AUD - 3.0, 0.2)
  arches(win, 'n', 46.3, [-20.4, -14.4, -8.4], 3.2, 7.0, 12.4, 0.06, 8)
  panels(win, 'w', -26.2, [24, 30, 36], 1.4, 7.5, 12.0, 0.06)
  // the low ring round the open court
  box(stone, stone, 25, 15.5, 44.7, 25.2, 0, 4.7)
  box(stone, stone, 25, 39.2, 44.7, 46.3, 0, 4.7)
  box(stone, stone, 25, 25.2, 28.1, 39.2, 0, 4.7)
  box(stone, stone, 40.7, 25.2, 44.7, 39.2, 0, 4.7)
  // the John R porte-cochere: a slab on marble piers
  bbox(trim, trim, -26, 46.3, 12, 52.5, 4.6, 5.4, 0.15)
  for (const x of [-24.5, -16.5, -8.5, -0.5, 7.5]) box(wing, null, x - 0.6, 51.0, x + 0.6, 52.2, 0, 4.6)

  // ---------------------------------------------------------------- the wings (marble-clad 1966/1971)
  const wingBlock = (x0: number, y0: number, x1: number, y1: number, h: number) => {
    bbox(wing, wing, x0, y0, x1, y1, 0, h, 0.35)
  }
  wingBlock(-101, -16.4, FX0, 16, WING)
  wingBlock(-101, 16, -58, 43.8, WING)
  wingBlock(-104.3, 7.4, -101, 21, WING - 1.2)
  wingBlock(FX1, -16.4, 94.6, 45.1, 16.2)
  wingBlock(94.6, 7.6, 98, 20.5, 15.0)
  // a high band of windows on the wing faces, in groups, and entrance glazing
  for (const [dir, c, a, b] of [['s', -16.4, -99, -52], ['s', -16.4, 47, 93], ['w', -101, -14, 42], ['e', 94.6, -14, 44], ['n', 43.8, -99, -60], ['n', 45.1, 47, 93]] as ['s' | 'n' | 'e' | 'w', number, number, number][]) {
    const n = Math.max(2, Math.round((b - a) / 9))
    panels(win, dir, c, spread(a, b, n), 6.0, WING - 4.4, WING - 2.0, 0.06)
  }
  panels(win, 's', -16.4, [-75, 70], 8, 0, 3.6, 0.06)

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[1] < -40 && n[1] < -0.5 ? 1 : 0.35)
  return [
    { part: stone, material: { ...finish('dia-marble', 0xeee6d8), floodlight: flood } },
    { part: wing, material: finish('dia-wing-marble', 0xe0dfda) },
    { part: tile, material: finish('dia-tile', 0xb0634c) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
  ]
}

if (import.meta.main) await saveModel('det-detroit-institute-of-arts', 'Detroit Institute of Arts', [42.3594142, -83.0643873], 63.5, build(), 6500)
