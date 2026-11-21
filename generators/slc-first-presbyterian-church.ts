/**
 * First Presbyterian Church (1903-06, Walter E. Ware), 347 E South Temple,
 * Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-first-presbyterian-church.ts
 *
 * Uses the church kit exported by slc-cathedral-of-the-madeleine.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of OSM way/466197095 (-111.8802208, 40.7697349). The plan
 * is written in a frame 0.78 m west and 2.75 m south of that and shifted at
 * the end. y = 0 is the lowest ground under the outline, at the south
 * (lidar ground_min + 1.8 m); the ground rises about 2.5 m to the north end.
 *
 * Plan from lidar and NAIP (both put the crossing 4-5 m north of where
 * the OSM outline's shape suggests; OSM's outline takes in the raised
 * forecourt and steps along South Temple, which are drawn here as a low
 * terrace): a nave (x -3..9) with a steep slate roof, crossed by a transept
 * (y 0..10) with gables east and west; flat-roofed crenellated aisles
 * either side; a low crenellated wing along the whole west side (7 m,
 * lidar); a square crenellated tower in the south-west angle with a taller
 * stair corner; a gabled triple-arched porch across the south front; a
 * low flat-roofed annex at the north end, inside the outline. The
 * "First Presbyterian Church Addition" (way/466198777) north of it is a
 * separate later building (taller in the lidar) and is not modelled.
 *
 * Heights: lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013),
 * above the south ground: tower parapet about 24.5 with the stair corner
 * 26 (measured); nave and transept ridges 20.5 (measured); aisle roofs
 * 12-13 (measured); west wing 7 (measured); north annex 11 (measured).
 * Estimated from p2 (south front straight on, about 23.5 px/m): eaves and
 * aisle parapets 12.3, gable shoulders 16, pinnacle tips 21.5, the great
 * window 6.8-15.2 m and 6.2 m wide, the pointed oculus 16.4-18.6, porch
 * gables 10.8 and 8.3, the belfry louvres 17.2-20.0. The transept gables
 * are drawn like the front (p1 and p3 show the west one).
 * Left out: the cusping of the tracery, corbels under the parapets, the
 * porch gates' grilles.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_-_Salt_Lake_City_01.jpg
 *     Farragutful, CC BY-SA 4.0 (the tower and the west transept gable, from the south-west)
 *  p2 https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_-_Salt_Lake_City_02.jpg
 *     Farragutful, CC BY-SA 4.0 (the south front straight on)
 *  p3 https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_-_Salt_Lake_City_03.jpg
 *     Farragutful, CC BY-SA 4.0 (the west transept gable and the tower, from the west)
 *  p5 https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_-_Salt_Lake_City,_Utah_-_27_April_2025.jpg
 *     Beneathtimp, CC0 (the south front, from across South Temple)
 * Doubts: the north side is unphotographed; the east aisle's windows are
 * hidden by trees; the east transept gable is drawn like the west one;
 * p3 shows one more gable north of the west transept that the lidar
 * doesn't separate, left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { poly, rect, prism, box, spire, opening, bar, disc, gable, type XY } from './slc-cathedral-of-the-madeleine'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
const S: XY = [0, -1], E: XY = [1, 0], W: XY = [-1, 0]

const Z_EAVE = 12.3, Z_RIDGE = 20.5
const NX0 = -3.0, NX1 = 9.0, NC = 3.0       // nave walls and ridge
const YS = -11.0, YN = 16.0                 // nave front and north end
const TY0 = 0.0, TY1 = 10.0, TC = 5.0       // transept
const TX0 = -9.0, TX1 = 16.5                // transept gable walls

/** A pitched roof along y (dir 'y') or x, with its two slopes. */
function pitched(dir: 'x' | 'y', lo: number, hi: number, a: number, b: number) {
  const c = (a + b) / 2, h = (b - a) / 2, ov = 0.4, ez = Z_EAVE - (ov * (Z_RIDGE - Z_EAVE)) / h
  const P = (u: number, v: number, z: number): V3 => (dir === 'y' ? [v, u, z] : [u, v, z])
  for (const s of [-1, 1]) {
    const q = [P(lo, c + s * (h + ov), ez), P(hi, c + s * (h + ov), ez), P(hi, c, Z_RIDGE), P(lo, c, Z_RIDGE)]
    const up: V3 = dir === 'y' ? [s, 0, 1] : [0, s, 1]
    poly(roof, q, up); poly(roof, q, [-up[0], -up[1], -1])
  }
}
/** A gable end with pinnacled buttresses, the great traceried window and the pointed oculus. */
function gableEnd(o: XY, t: XY, n: XY, h: number) {
  // the triangle, standing a little proud with its coping
  gable(stone, [o[0] + n[0] * 0.3, o[1] + n[1] * 0.3], t, n, h, Z_EAVE, Z_RIDGE + 0.4, 0.8)
  const at = (s: number): XY => [o[0] + t[0] * s, o[1] + t[1] * s]
  for (const s of [-1, 1]) bar(trim, o, t, n, s * h, Z_EAVE + 0.1, 0, Z_RIDGE + 0.4, 0.45, 0.36)
  box(trim, o[0] + n[0] * 0.1, o[1] + n[1] * 0.1, 0.15, 0.15, Z_RIDGE + 0.3, Z_RIDGE + 1.7)
  box(trim, o[0] + n[0] * 0.1, o[1] + n[1] * 0.1, n[0] ? 0.15 : 0.5, n[0] ? 0.5 : 0.15, Z_RIDGE + 1.0, Z_RIDGE + 1.25)
  // buttresses rising to pinnacles either side
  for (const s of [-1, 1]) {
    const [bx, by] = at(s * (h - 0.2))
    box(stone, bx + n[0] * 0.5, by + n[1] * 0.5, 0.65, 0.65, 0, 16.2)
    spire(trim, bx + n[0] * 0.5, by + n[1] * 0.5, 0.6, 16.2, 21.5)
  }
  // the great window: four lights under a pointed head, a ring in the head
  opening(trim, o, t, n, 6.8, 6.5, 15.6, 'pointed', 0.34)
  opening(win, o, t, n, 6.2, 6.8, 15.2, 'pointed', 0.37)
  const spring = 15.2 - 6.2 * Math.sin(Math.PI / 3)
  for (const s of [-1.55, 0, 1.55]) bar(trim, o, t, n, s, 6.8, s, spring + 0.3, 0.18, 0.4)
  disc(trim, o, t, n, spring + 2.3, 1.05, 1.3, 0.4, 12)
  opening(trim, o, t, n, 2.2, 16.2, 18.9, 'pointed', 0.34)
  opening(win, o, t, n, 1.7, 16.4, 18.6, 'pointed', 0.37)
}
/** Merlons along a wall top. */
function crenels(a: XY, b: XY, z: number, step = 1.3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.floor(L / step))
  for (let i = 0; i < k; i++) {
    const u = (i + 0.5) / k, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u
    const along = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1])
    box(stone, x, y, along ? 0.35 : 0.3, along ? 0.3 : 0.35, z, z + 0.75)
  }
}

// --------------------------------------------------- nave and transept ---
prism(stone, rect(NX0, YS, NX1, YN), 0, Z_EAVE, false)
pitched('y', YS - 0.4, YN + 0.3, NX0, NX1)
prism(stone, rect(TX0, TY0, TX1, TY1), 0, Z_EAVE, false)
pitched('x', TX0 - 0.4, TX1 + 0.4, TY0, TY1)
gableEnd([NC, YS], [1, 0], S, (NX1 - NX0) / 2)
gableEnd([TX0, TC], [0, -1], W, (TY1 - TY0) / 2)
gableEnd([TX1, TC], [0, 1], E, (TY1 - TY0) / 2)
// the north end of the nave: a plain gable over the annex
poly(stone, [[NX0, YN, Z_EAVE], [NX1, YN, Z_EAVE], [NC, YN, Z_RIDGE]], [0, 1, 0])

// --------------------------------------------- aisles and the west wing ---
function aisle(x0: number, x1: number, y0: number, y1: number, z: number, faces: [XY, XY, XY, number][]) {
  prism(stone, rect(x0, y0, x1, y1), 0, z, false)
  poly(roof, rect(x0, y0, x1, y1).map(([x, y]) => [x, y, z - 0.5] as V3), [0, 0, 1])
  box(trim, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.12, (y1 - y0) / 2 + 0.12, z - 0.6, z - 0.3, false)
  for (const [a, b, n, every] of faces) {
    crenels(a, b, z)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    if (every > 0) for (let s = every / 2; s < L - 0.8; s += every) {
      const o: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
      opening(trim, o, t, n, 1.7, z * 0.32 - 0.2, z * 0.7 + 0.2, 'pointed', 0.04)
      opening(win, o, t, n, 1.3, z * 0.32, z * 0.7, 'pointed', 0.07)
    }
  }
}
aisle(NX1, 16.5, YS, YN, 12.6, [[[NX1, YS], [16.5, YS], S, 3.6], [[16.5, YS], [16.5, TY0], E, 3.7], [[16.5, TY1], [16.5, YN], E, 3.0]])
aisle(-9.0, NX0, -6.0, YN, 12.6, [[[-9.0, -6.0], [-4.0, -6.0], S, 0]])
aisle(-11.5, -9.0, -10.0, YN, 7.0, [[[-11.5, -10.0], [-9.0, -10.0], S, 0], [[-11.5, YN], [-11.5, -10.0], W, 3.2]])
// the low north annex, inside the outline
{
  const ring: XY[] = [[-11.5, YN], [16.5, YN], [15.2, 20.2], [1.3, 23.0], [-10.4, 21.0]]
  prism(stone, ring, 0, 11.0, false)
  poly(roof, ring.map(([x, y]) => [x, y, 11.0] as V3), [0, 0, 1])
}

// ----------------------------------------------------------- the tower ---
{
  const x0 = -10.5, x1 = -4.0, y0 = -12.5, y1 = -6.0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = 3.25
  box(stone, cx, cy, h, h, 0, 24.5)
  // stepped corner buttresses on the two street faces
  for (const [bx, by] of [[x0 + 0.6, y0 + 0.6], [x1 - 0.6, y0 + 0.6], [x0 + 0.6, y1 - 0.6]] as XY[]) {
    box(stone, bx, by, 0.95, 0.95, 0, 9.0)
    box(stone, bx, by, 0.8, 0.8, 9.0, 15.5)
  }
  box(trim, cx, cy, h + 0.12, h + 0.12, 16.8, 17.2, true)
  box(trim, cx, cy, h + 0.15, h + 0.15, 22.0, 22.5, true)
  // crenellated parapet, and the taller stair corner at the north-east
  for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) crenels(a, b, 24.5, 1.6)
  box(stone, x1 - 1.3, y1 - 1.3, 1.4, 1.4, 24.5, 26.0)
  crenels([x1 - 2.7, y1 - 2.7], [x1 + 0.1, y1 - 2.7], 26.0, 1.2)
  for (const [o, t, n] of [[[cx, y0], [1, 0], S], [[x0, cy], [0, -1], W], [[x1, cy], [0, 1], E], [[cx, y1], [-1, 0], [0, 1]]] as [XY, XY, XY][]) {
    opening(trim, o, t, n, 2.6, 17.4, 20.4, 'flat', 0.04)
    opening(win, o, t, n, 2.1, 17.6, 20.2, 'flat', 0.07)
    for (const z of [18.4, 19.4]) bar(trim, o, t, n, -1.05, z, 1.05, z, 0.16, 0.1)
    if (n !== S) {
      opening(trim, o, t, n, 1.2, 10.6, 13.6, 'pointed', 0.04)
      opening(win, o, t, n, 0.85, 10.8, 13.3, 'pointed', 0.07)
    }
  }
  // the pointed door in the south face
  opening(trim, [cx, y0 - 0.35], [1, 0], S, 2.3, 1.0, 5.0, 'pointed', 0.04)
  opening(door, [cx, y0 - 0.35], [1, 0], S, 1.7, 1.2, 4.6, 'pointed', 0.07)
  opening(win, [cx, y0], [1, 0], S, 0.85, 10.8, 13.3, 'pointed', 0.05)
}

// ------------------------------------------------------- the porch ---
{
  const y0 = -13.6, y1 = YS
  prism(stone, rect(-4.2, y0, 10.2, y1), 0, 6.3, false)
  poly(roof, rect(-4.2, y0, 10.2, y1).map(([x, y]) => [x, y, 6.3] as V3), [0, 0, 1])
  for (const [cx, w, za, ho] of [[NC, 5.6, 10.8, 5.6], [-1.75, 4.1, 8.3, 4.6], [7.75, 4.1, 8.3, 4.6]]) {
    const hw = w / 2 + 0.25
    poly(stone, [[cx - hw, y0, 6.3], [cx + hw, y0, 6.3], [cx, y0, za]], [0, -1, 0])
    for (const s of [-1, 1]) {
      bar(trim, [cx, y0], [1, 0], S, s * hw, 6.0, 0, za, 0.4, 0.06)
      const q: V3[] = [[cx + s * hw, y0, 6.3], [cx + s * hw, y1, 6.3], [cx, y1, za - 0.2], [cx, y0, za - 0.2]]
      poly(roof, q, [s, 0, 1])
    }
    opening(trim, [cx, y0], [1, 0], S, w, 1.0, ho + 1.0, 'pointed', 0.04)
    opening(stone, [cx, y0], [1, 0], S, w - 0.6, 1.0, ho + 0.7, 'pointed', 0.06)
    opening(door, [cx, y0], [1, 0], S, w - 1.6, 1.0, ho - 1.2, 'flat', 0.08)
  }
}
// the raised forecourt and its steps, within the outline
prism(stone, rect(-12.7, -17.0, 10.3, -13.6), 0, 1.0, true)
prism(stone, rect(-12.7, -13.6, -10.5, -10.0), 0, 1.0, true)

// ---------------------------------------------------- shift and output ---
const parts = [stone, trim, roof, win, door]
for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= 0.78; p.pos[i + 2] += 2.75 }
// Night: the south front and the tower are floodlit.
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : n[1] < -0.5 || p[0] < -8 ? 0.8 : 0.3)
const out = [
  { part: stone, material: { ...finish('fpc-red-sandstone', 0xc68d72), floodlight: flood } },
  { part: trim, material: { ...finish('fpc-red-sandstone-light', 0xdcab90), floodlight: flood } },
  { part: roof, material: finish('fpc-slate', 0x8e9297) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('fpc-door', 0x9c7148) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('First Presbyterian Church', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 26.75,
})
await Bun.write(new URL('../models/slc-first-presbyterian-church.glb', import.meta.url), glb)
console.log(`slc-first-presbyterian-church.glb: ${triangles} triangles, ${glb.length} bytes`)
