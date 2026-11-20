/**
 * First National Bank Building (1931, Graham, Anderson, Probst & White),
 * Saint Paul, with its red neon "1st" sign — original procedural geometry,
 * CC0-1.0.
 * bun generators/msp-first-national-bank-building.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned by the placement bearing 326.6 deg
 * (the downtown grid): +y faces north-west toward 5th Street, -y faces
 * 4th Street. Origin at -93.09111, 44.94639, on the ground (flat to 1 m).
 *
 * Form: a buff-brick Art Deco tower, U-shaped round a light court on its
 * south-east face: wings to 84 m (front ledge) and 102 m, a centre block to
 * 121.5 m with a parapet, seven-storey blocks in the court and at the
 * north-east corner; a steel lattice tower on the roof carries the red neon
 * "1st" (lit red at night) and an antenna mast to ~161 m.
 *
 * Famous sign (STYLE.md "Famous signs"): the "1st" is drawn as its real
 * letters, traced from Tony Webster's night photo with lettering.ts: a tall
 * numeral 1 with a pointed flag and a small foot, and a lowercase "s" and
 * "t" hung from its top. The sign is double-faced: the sunrise photo
 * (looking east) shows it face-on with the back face's reversed letters
 * through the lattice, so the faces are drawn toward the south-west and
 * north-east of the grid. Sign height ~19 m and width ~11 m scaled from that
 * photo against the lidar roof and mast (estimated).
 *
 * Sources
 * - OSM: way/199733907 (height 127, 32 levels) and its parts way/1240661055,
 *   -056, -057, -058, -059, -061, -062, -063, -064 (32/27/22/7 levels). The
 *   site relation/3286617 also holds the Merchants Bank and North
 *   buildings, which are separate and left out. OSM sits ~2 m west of the
 *   lidar footprint; the model follows the lidar.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_5_B22, flown ~2022, class
 *   18 kept): plan 39 x 31 m, the court 8 m wide, all tier heights, the
 *   lattice's 9 m square and its top.
 * - Published: 1931, 32 storeys, 417 ft (127 m) (Wikipedia, "First National
 *   Bank Building (Saint Paul, Minnesota)"); the sign dates from 1970.
 * - Photos (Wikimedia Commons, all evidence):
 *   Tony Webster, "1st (2402087047).jpg" (night) and "1st Sunrise (2618520864).jpg",
 *     CC BY 2.0: the letterforms, the sign's faces and colour.
 *     https://commons.wikimedia.org/wiki/File:1st_(2402087047).jpg
 *     https://commons.wikimedia.org/wiki/File:1st_Sunrise_(2618520864).jpg
 *   Michael Hicks, "First National Bank Building, Saint Paul, MN.jpg", CC BY 2.0
 *     (from the south-east): the light court, setbacks, brick.
 *     https://commons.wikimedia.org/wiki/File:First_National_Bank_Building,_Saint_Paul,_MN.jpg
 *   Bobak Ha'Eri, "2019-0819-StP-First National Bank Building.JPG", CC BY 3.0.
 *     https://commons.wikimedia.org/wiki/File:2019-0819-StP-First_National_Bank_Building.JPG
 *
 * Estimated: window grouping (three storeys, 2.7 m bays), lattice member
 * sizes and rings, the sign's size, letter stroke weights (bolder than the
 * neon tubes so they read at phone size).
 *
 * Night: windows glow; the letters are `neon-first-red`.
 *
 * Doubts: which grid direction the sign faces is inferred from one photo
 * whose direction is read from the sunrise sky; the lattice is simplified
 * to corner posts and three rings.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, outward, finishGlb } from './sea-rainier-square-tower'

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

type G = { bay: number; w: number; group: number; sp: number; foot: number; head: number; inset: number }
function panels(part: Part, r: XY[], i: number, z0: number, z1: number, g: G) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * g.inset + 1.2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b), pr = 0.06
  const k = Math.max(1, Math.round((L - 2 * g.inset) / g.bay)), step = (L - 2 * g.inset) / k, w = Math.min(g.w, step - 0.7)
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * pr, a[1] + t[1] * u + n[1] * pr, z]
  const lo0 = z0 + g.foot, hi0 = z1 - g.head
  for (let m = Math.floor(lo0 / g.group); m * g.group < hi0; m++) {
    const lo = Math.max(m * g.group + g.sp / 2, lo0), hi = Math.min((m + 1) * g.group - g.sp / 2, hi0)
    if (hi - lo < 1.5) continue
    for (let j = 0; j < k; j++) { const c = g.inset + (j + 0.5) * step; part.quad(P(c - w / 2, lo), P(c + w / 2, lo), P(c + w / 2, hi), P(c - w / 2, hi)) }
  }
}
/** A square bar between two points (a lattice member), all four sides. */
function bar(part: Part, a: V3, b: V3, s: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cx = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]
  const nz = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
  const e1 = nz(cx(u, ref)), e2 = cx(u, e1), h = s / 2
  const C = (p: V3, i: number): V3 => { const sx = i === 0 || i === 3 ? -h : h, sy = i < 2 ? -h : h; return [p[0] + e1[0] * sx + e2[0] * sy, p[1] + e1[1] * sx + e2[1] * sy, p[2] + e1[2] * sx + e2[2] * sy] }
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; part.quad(C(a, i), C(a, j), C(b, j), C(b, i)) }
}

/** The "1st" as traced from Tony Webster's night photo: units of the 1's height, origin at its foot, u to the reader's right. */
function firstLetters() {
  const stem = new Pen(), fine = new Pen()
  stem.moveTo([0.075, 0.02]).lineTo([0.075, 0.95])
  fine.moveTo([0.125, 0.99]).lineTo([-0.07, 0.83]).lineTo([0.035, 0.80]) // the pointed flag
  fine.moveTo([-0.01, 0.015]).lineTo([0.165, 0.015]) // the small foot
  // s
  fine.moveTo([0.335, 0.865]).cubicTo([0.31, 0.91], [0.215, 0.905], [0.215, 0.835], 5)
    .cubicTo([0.215, 0.77], [0.335, 0.79], [0.335, 0.715], 6).cubicTo([0.335, 0.64], [0.23, 0.64], [0.205, 0.685], 5)
  // t
  fine.moveTo([0.452, 0.985]).lineTo([0.452, 0.745]).quadTo([0.455, 0.68], [0.535, 0.715], 4)
  fine.moveTo([0.395, 0.915]).lineTo([0.525, 0.915])
  return { stem, fine, width: 0.6, left: -0.07 }
}

function build() {
  const brick = new Part(), roof = new Part(), win = new Part(), metal = new Part(), neon = new Part()
  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string) => prisms.push({ ring: chamfer(ring, 0.4), z1, wall: brick, roof, kind })

  // ---- the massing (lidar): a U-shaped tower round a light court on its south-east face
  add(rect(15, -16.5, 24, 14.5), 31.5, 'base') // the seven-storey north-east wing
  add(rect(-9, -16.5, -1, -1), 31.5, 'base') // the light court's floor block
  for (const [x0, x1] of [[-24, -9], [-1, 15]]) {
    add(rect(x0, -16.5, x1, -15), 84, 'tower') // the front ledge
    add(rect(x0, -15, x1, 14.5), 102, 'tower')
  }
  add(rect(-24, -1, 15, 14.5), 102, 'tower') // the wings' back joined across the court
  add(rect(-19, -1, 10, 14.5), 121.5, 'tower') // the centre block
  const tower: G = { bay: 2.7, w: 1.4, group: 11.1, sp: 1.5, foot: 1.0, head: 1.6, inset: 1.0 }
  const base: G = { bay: 3.2, w: 1.8, group: 7.4, sp: 1.6, foot: 1.2, head: 1.6, inset: 1.2 }
  for (const Q of prisms) {
    for (let i = 0; i < Q.ring.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(brick, Q.ring, i, z0, Q.z1)
      panels(win, Q.ring, i, z0, Q.z1, Q.kind === 'base' ? base : tower)
    }
    capRing(roof, Q.ring, Q.z1)
  }
  // parapet lip round the centre block
  { const o = rect(-19.25, -1.25, 10.25, 14.75)
    for (let i = 0; i < 4; i++) wallEdge(brick, o, i, 121.5, 122.6)
    capRing(brick, o, 122.6) }

  // ---- the lattice tower on the roof and the sign on it (lidar: 9 m square, to ~161 m)
  const X0 = -10, X1 = -1, Y0 = 3, Y1 = 12, Z0 = 122.6, ZT = 149, s = 0.45
  const corners: [number, number][] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (const [x, y] of corners) bar(metal, [x, y, Z0], [x, y, ZT], 0.6)
  for (const z of [Z0 + 0.4, 135, ZT - 0.3]) for (let i = 0; i < 4; i++) { const a = corners[i], b = corners[(i + 1) % 4]; bar(metal, [a[0], a[1], z], [b[0], b[1], z], s) }
  // the antenna mast above it, tapering
  const mx = (X0 + X1) / 2, my = (Y0 + Y1) / 2
  for (const [x, y] of [[mx - 1.6, my - 1.6], [mx + 1.6, my - 1.6], [mx + 1.6, my + 1.6], [mx - 1.6, my + 1.6]] as XY[]) bar(metal, [x, y, ZT], [mx + (x - mx) * 0.3, my + (y - my) * 0.3, 158], 0.4)
  bar(metal, [mx, my, 157], [mx, my, 161.5], 0.35)

  // ---- "1st", double-faced, toward the south-west and north-east (photos)
  const L = firstLetters(), S = 19, ZS = 128.5, half = (L.width * S) / 2
  const faces: ((u: number, v: number, w: number) => V3)[] = [
    (u, v, w) => [X0 - 0.35 - w * S, my + half - (u - L.left) * S, ZS + v * S], // SW face: reader's right is -y
    (u, v, w) => [X1 + 0.35 + w * S, my - half + (u - L.left) * S, ZS + v * S], // NE face: reader's right is +y
  ]
  for (const place of faces) {
    strokes(neon, L.stem.paths, { width: 0.125, depth: 0.04, place, back: true })
    strokes(neon, L.fine.paths, { width: 0.06, depth: 0.04, place, back: true })
  }

  return finishGlb('msp-first-national-bank-building', 'First National Bank Building', [
    { part: brick, material: finish('fnb-brick', 0xdcc9a6) },
    { part: roof, material: { ...PALETTE.roof, color: 0xb4ada2 } },
    { part: win, material: { ...PALETTE.window, color: 0x5f6a74 } },
    { part: metal, material: { ...PALETTE.metal, color: 0x6c6862 } },
    { part: neon, material: finish('neon-first-red', 0xd8432f) },
  ], { bearing: 326.6, height: 161.5, replaces: ['way/199733907'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-first-national-bank-building.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
