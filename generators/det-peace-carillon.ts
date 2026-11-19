/**
 * Nancy Brown Peace Carillon, Belle Isle, Detroit (1940, Clarence E. Day):
 * procedural, CC0-1.0.
 * bun generators/det-peace-carillon.ts
 *
 * Map frame: x, y, z up, metres, turned to the tower's base: +y runs along
 * bearing 73, +x along 163. The anchor is the centroid of OSM
 * way/659605208 (42.3352014, -82.9885053).
 *
 * Identity, in order: a slender pale limestone octagonal shaft on a square
 * base with buttressed corners, an arched bronze door and a clock; stacks
 * of three tall slit lancets with traceried heads on the diagonal faces; the
 * open belfry with two tall traceried openings a face between stepped
 * corner piers; the crown of pierced tracery parapets between eight
 * pinnacles.
 *
 * Evidence:
 *  - plan: OSM way/659605208 (building=tower, bell_tower, height 30, the
 *    5.9 m square base; drawn 6.0 m, with corner buttresses, as the photos show
 *    the base about 1.5 times the shaft's width), way/1323641533 (building:part, the same square,
 *    the base) and way/659605207 (building:part, min_level 1, the octagonal
 *    shaft, 4.6 m across; drawn 5.0 m, from the photos).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid: the
 *    crown 27.4 m over the ground (27.8 at a pinnacle); the paved terrace
 *    round the base ~0.6 m up (left to the terrain).
 *  - published: 1940, Clarence E. Day; a gift of the readers of Nancy
 *    Brown's Detroit News column (Wikipedia, "Nancy Brown Peace Carillon").
 *    OSM's 30 m is taken as the tip of the pinnacles; the lidar's 27.8 is
 *    used.
 *  - photos: the stages (base to ~4.7 m, the shaft to the belfry ledge at
 *    ~20.2, belfry openings ~20.7-23.6, parapet ~24.6-27.3, scaled to the
 *    lidar height), the openings, the colours.
 *  Estimated: the base's buttresses, the lancets' sizes, the tracery.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Nancy_Brown_Peace_Carillon.jpg, Drklinkert, CC BY-SA 4.0 (the door
 *    and clock face, close)
 *  - Belle_Isle_carillon_-_Detroit_Michigan.jpg, Mikerussell, CC BY-SA 3.0
 *  - Nancy_Brown_Peace_Carillon_-_Belle_Isle.jpg, TracieMichelle, CC BY-SA
 *    4.0
 *  - Nancy_Brown_Peace_Carillon_Tower,_Belle_Isle,_Michigan,_2025-07-27.jpg,
 *    Chris Woodrich, CC BY-SA 4.0 (from across the water)
 * No look-only sources. No commercial imagery.
 *
 * The openings are dark stone, not `window`: the bells hang in an open,
 * unlit belfry. Doubts: which face carries the door is read from one close
 * photo whose direction is not fixed; it is put on the -x face. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, circle, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc } from './sea-tacoma-union-station'

const pointed = (sc: number, w: number, z0: number, zs: number, segs = 3): XY[] => {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
const archR = (sc: number, w: number, z0: number, zs: number, segs = 8): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** The eight faces of a regular octagon of apothem a, flats square to the axes. */
function octFaces(a: number): { f: Face; w: number }[] {
  const w = 2 * a * Math.tan(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => {
    const t = (k * Math.PI) / 4
    return { f: { o: [a * Math.cos(t), a * Math.sin(t), 0] as V3, n: [Math.cos(t), Math.sin(t)] as XY }, w }
  })
}
const oct = (a: number) => circle(0, 0, a / Math.cos(Math.PI / 8), 8, Math.PI / 8)

function build() {
  const stone = new Part(), dark = new Part(), door = new Part(), pale = new Part()

  // ------------------------------------------------ the square base, with buttressed corners
  const H = 3.0, BT = 4.7
  walls(stone, rect(-H - 0.15, -H - 0.15, H + 0.15, H + 0.15), 0, 0.5)
  cap(stone, rect(-H - 0.15, -H - 0.15, H + 0.15, H + 0.15), 0.5)
  walls(stone, rect(-H, -H, H, H), 0.5, BT)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const xa = sx * (H - 1.1), xb = sx * (H + 0.35), ya = sy * (H - 1.1), yb = sy * (H + 0.35)
    const r = rect(Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb))
    walls(stone, r, 0.5, BT + 0.4); cap(stone, r, BT + 0.4)
  }
  // the sloped weathering from the base to the shaft
  const A = 2.5, top = oct(A), sq = rect(-H, -H, H, H)
  {
    // a ring of the square's corners matched to the octagon's: each octagon vertex to the nearest point on the square
    const ring = top.map(([x, y]) => [Math.max(-H, Math.min(H, x * 1.6)), Math.max(-H, Math.min(H, y * 1.6))] as XY)
    walls(stone, ring, BT, BT + 1.0, top)
    cap(stone, sq, BT, true)
  }
  // door (-x face), clock and plaque (+y face), arched panels on the others
  {
    const fx: Face = { o: [-H, 0, 0], n: [-1, 0] }
    flatShape(pale, fx, archR(0, 1.9, 0.5, 2.6, 8), 0.03)
    flatShape(door, fx, archR(0, 1.4, 0.5, 2.6, 8), 0.06)
    const fy: Face = { o: [0, H, 0], n: [0, 1] }
    flatShape(pale, fy, arc(-0.9, 3.6, 0.5, 0, 360, 12).slice(0, 12), 0.04)
    flatShape(dark, fy, R(0.35, 3.0, 1.35, 4.2), 0.04)
    for (const f of [{ o: [H, 0, 0], n: [1, 0] } as Face, { o: [0, -H, 0], n: [0, -1] } as Face]) flatShape(pale, f, archR(0, 1.4, 0.5, 2.4, 8), 0.04)
  }

  // ------------------------------------------------ the octagonal shaft, lancets on alternate faces
  const SH = 20.2
  walls(stone, oct(A), BT + 1.0, SH)
  for (const [k, { f }] of octFaces(A).entries()) {
    if (k % 2 === 0) continue
    // a pale frame and three slit lancets one above the other
    flatShape(pale, f, R(-0.5, 6.4, 0.5, 19.0), 0.02)
    for (const [z0, z1] of [[6.7, 10.4], [10.9, 14.6], [15.1, 18.7]]) flatShape(dark, f, pointed(0, 0.42, z0, z1 - 0.35), 0.05)
  }
  // the belfry ledge
  walls(stone, oct(A + 0.3), SH - 0.3, SH)
  cap(stone, oct(A + 0.3), SH)

  // ------------------------------------------------ the belfry
  const BF = 24.4
  walls(stone, oct(A - 0.05), SH, BF)
  for (const { f } of octFaces(A - 0.05)) {
    // one tall traceried opening a face: a mullion and a transom
    flatShape(dark, f, pointed(0, 0.95, 20.8, 23.0, 3), 0.05)
    flatShape(pale, f, R(-0.06, 20.8, 0.06, 23.4), 0.07)
    flatShape(pale, f, R(-0.47, 22.0, 0.47, 22.12), 0.07)
  }
  // stepped corner piers at the octagon's vertices, rising into pinnacles
  const verts = oct(A - 0.05)
  for (const [x, y] of verts) {
    const ux = x / Math.hypot(x, y), uy = y / Math.hypot(x, y)
    const p0: XY[] = [[x + ux * 0.25 - uy * 0.28, y + uy * 0.25 + ux * 0.28], [x - ux * 0.3 - uy * 0.28, y - uy * 0.3 + ux * 0.28], [x - ux * 0.3 + uy * 0.28, y - uy * 0.3 - ux * 0.28], [x + ux * 0.25 + uy * 0.28, y + uy * 0.25 - ux * 0.28]]
    const r = p0[0][0] * p0[1][1] - p0[1][0] * p0[0][1] > 0 ? p0 : [...p0].reverse()
    walls(stone, r, SH, 27.3)
    const c: V3 = [x + ux * 0.0, y + uy * 0.0, 27.85]
    for (let i = 0; i < 4; i++) stone.tri([r[i][0], r[i][1], 27.3], [r[(i + 1) % 4][0], r[(i + 1) % 4][1], 27.3], c)
  }

  // ------------------------------------------------ the crown: pierced tracery parapet
  walls(stone, oct(A + 0.05), BF, BF + 0.35)
  cap(stone, oct(A + 0.05), BF + 0.35)
  walls(stone, oct(A - 0.15), BF + 0.35, 27.1)
  walls(stone, [...oct(A - 0.45)].reverse(), BF + 0.35, 27.1)
  {
    const o = oct(A - 0.15), i = oct(A - 0.45)
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8
      stone.quad([o[k][0], o[k][1], 27.1], [o[j][0], o[j][1], 27.1], [i[j][0], i[j][1], 27.1], [i[k][0], i[k][1], 27.1])
    }
    cap(stone, oct(A - 0.45), BF + 0.35)
  }
  for (const { f, w } of octFaces(A - 0.15)) {
    // the pierced panel: a dark field with a pale cusped arch over it
    flatShape(dark, f, R(-w / 2 + 0.3, 25.0, w / 2 - 0.3, 26.7), 0.03)
    flatShape(pale, f, R(-0.06, 25.0, 0.06, 26.7), 0.05)
    flatShape(pale, f, R(-w / 2 + 0.3, 25.75, w / 2 - 0.3, 25.87), 0.05)
  }

  return [
    { part: stone, material: finish('carillon-limestone', 0xdccdb2) },
    { part: pale, material: finish('carillon-trim', 0xe9dfca) },
    { part: dark, material: finish('carillon-openings', 0x6f6b63) },
    { part: door, material: finish('carillon-bronze', 0x5b645a) },
  ]
}

if (import.meta.main) await save('det-peace-carillon', 'Nancy Brown Peace Carillon', [42.3352014, -82.9885053], 73, build(), 5000)
