/**
 * Laboratory Administration Building, Brooklyn Botanic Garden — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-bbg-laboratory.ts
 *
 * Map frame: x = model east (Washington Avenue), y = model north, z up,
 * metres. Placed at bearing −8.5°, the building's long axis (OSM edges).
 * Anchor: area centroid of OSM way/250229994.
 *
 * Identifying features (from the photos): a long, two-storey Italian
 * Renaissance revival block in buff (cream) render-like brick with pale
 * limestone trim and wide-eaved green copper hipped roofs; the taller centre
 * with a gabled front to the garden holding a big round-headed window under
 * an oculus, crowned by a square drum with oculi, a copper hip and a small
 * domed lantern; projecting end pavilions with oculus gables and square
 * belvederes; round-headed ground-floor windows; the semicircular apse on
 * the Washington Avenue side.
 *
 * Evidence
 * - OSM way/250229994 (outline; height 14.7 m from NYC building
 *   footprints; architect McKim, Mead & White, 1917). Plan: centre 16.7 m
 *   along the front with a 1.4 m projection to the garden, wings 18.4 m deep,
 *   end pavilions 25.2 × 13.5 m, end bays, the east apse (radius 7.3 m).
 * - Plans and the 1912 rendering in Popular Science Monthly v.80 (public
 *   domain, Commons "PSM V80 D343/D344 …"): two storeys over a basement,
 *   the apse is the lecture hall, symmetrical about the centre.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid in the model frame
 *   (it sits ~4 m west of the OSM outline here; read for heights only):
 *   garden ground 36.3 m NAVD88; wing roofs 13–14.6 m over the lidar low,
 *   i.e. 9–10.5 m over the garden; the centre's roof 16–16.5 (12.5 over the
 *   garden); the central lantern top 24.6 (20.6 over the garden).
 * - Map terrain (Mapterhorn): the garden (west) side 2.6 m above the lowest
 *   ground under the outline (the Washington Avenue side and its areaways),
 *   so G = 2.6; the north plaza and the main floor (F) are 2 m higher (the
 *   building stands on a terrace over the lily-pool garden, stairs up to
 *   its balustrades): the base shows on the west and east as the real
 *   basement does, and the north end runs into the plaza.
 * - Photos (Wikimedia Commons), credits in
 *   ~/landmarks-scratch/bkn/work/nyc-bbg-laboratory/photos/credits.txt:
 *   garden front (Reading Tom, CC BY 2.0, "Brooklyn Botanic Garden
 *   (8179803798).jpg"; Andre Carrotflower, CC BY-SA 4.0, "… 20200911 - 14 -
 *   Laboratory Administration Building & Magnolia Plaza.jpg"; King of
 *   Hearts, CC BY-SA 3.0/4.0, "… May 2015 005", "… October 2016 006/007/008",
 *   "… November 2016 005"), the east apse from Washington Avenue (Daderot,
 *   CC0, "Brooklyn Botanic Garden - DSC07892.JPG"), the south end over the
 *   lily pool (Elisa.rolle, CC BY-SA 3.0, "Prospect Park Botanic Gardens
 *   097/115.JPG"); 1917 view (C. Stuart Gager, public domain).
 *
 * Measured: plan (OSM), roof and lantern heights (lidar). Estimated from
 * the photos: the main floor 2 m over the west garden, eaves (wings 8.0 m, end pavilions 8.6 m, centre 10 m over the
 * garden), the front gable (apex 15 m), the drum, its hip and the lantern,
 * the belvederes (3.6 m square to 14.4 m), the window rhythm (4.2 m bays,
 * a round-headed window and a square one over it), the apse's eave (7 m)
 * and its lozenge windows; the garden terrace and balustrade (1.1 m).
 *
 * Doubts: the east (Washington Avenue) side is drawn from one photo of the
 * apse; its wings are given the garden side's windows. The end bays'
 * gables are drawn on both ends from the south one.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel } from './nyc-570-lexington'
import { archPanel, rectPanel, discPanel, block } from './nyc-city-hall'
import { oq, ot, unit3 } from './nyc-bbg-palm-house'

const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part()
const G = 2.6 // the west garden walk over the model's base (heights below are measured from it)
const F = G + 2.0 // the main floor: the north plaza's level, a half storey over the lily-pool garden
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A box of walls with a limestone base course and a cornice band. */
function body(x0: number, y0: number, x1: number, y1: number, top: number) {
  prism({ wall, win: null, roof: null, ring: rect(x0, y0, x1, y1), z0: 0, z1: top, facade: null, bevel: 0.25 })
  block(trim, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, top - 0.45, top)
}

/** A hipped roof with wide eaves: ridge along the longer side, eave slab under it. */
function hip(x0: number, y0: number, x1: number, y1: number, z: number, h: number, ov = 0.8) {
  const a = x0 - ov, b = y0 - ov, c = x1 + ov, d = y1 + ov
  block(roof, a, b, c, d, z - 0.22, z)
  const w = c - a, dd = d - b, k = Math.min(w, dd) / 2, cx = (a + c) / 2, cy = (b + d) / 2
  const A: V3 = [a, b, z], B: V3 = [c, b, z], C: V3 = [c, d, z], D: V3 = [a, d, z]
  if (w >= dd) {
    const r0: V3 = [a + k, cy, z + h], r1: V3 = [c - k, cy, z + h]
    oq(roof, A, B, r1, r0, [0, -1, 1]); oq(roof, C, D, r0, r1, [0, 1, 1]); ot(roof, B, C, r1, [1, 0, 1]); ot(roof, D, A, r0, [-1, 0, 1])
  } else {
    const r0: V3 = [cx, b + k, z + h], r1: V3 = [cx, d - k, z + h]
    oq(roof, B, C, r1, r0, [1, 0, 1]); oq(roof, D, A, r0, r1, [-1, 0, 1]); ot(roof, A, B, r0, [0, -1, 1]); ot(roof, C, D, r1, [0, 1, 1])
  }
}

/** A gabled roof, ridge along y from y0 to y1 at x = cx, gable wall at the y1 end (dir +1) or y0 (−1). */
function gableY(x0: number, x1: number, y0: number, y1: number, z: number, h: number, gableAt: 1 | -1, ov = 0.6) {
  const cx = (x0 + x1) / 2, a = x0 - ov, c = x1 + ov
  const yg = gableAt > 0 ? y1 + ov : y0 - ov, yb = gableAt > 0 ? y0 : y1
  oq(roof, [a, yb, z], [cx, yb, z + h], [cx, yg, z + h], [a, yg, z], [-h, 0, cx - a])
  oq(roof, [c, yb, z], [cx, yb, z + h], [cx, yg, z + h], [c, yg, z], [h, 0, c - cx])
  oq(roof, [a, yb, z - 0.22], [c, yb, z - 0.22], [c, yg, z - 0.22], [a, yg, z - 0.22], [0, 0, -1])
  const yw = gableAt > 0 ? y1 : y0
  ot(wall, [x0, yw, z], [x1, yw, z], [cx, yw, z + h], [0, gableAt, 0])
  ot(wall, [a, yb, z], [c, yb, z], [cx, yb, z + h], [0, -gableAt, 0])
  // the raking eave edge
  oq(roof, [a, yg, z - 0.22], [c, yg, z - 0.22], [c, yg, z], [a, yg, z], [0, gableAt, 0])
  return yw
}
/** The same along x, gable at the x0 end (dir −1) or x1 (+1). */
function gableX(x0: number, x1: number, y0: number, y1: number, z: number, h: number, gableAt: 1 | -1, ov = 0.6) {
  const cy = (y0 + y1) / 2, b = y0 - ov, d = y1 + ov
  const xg = gableAt > 0 ? x1 + ov : x0 - ov, xb = gableAt > 0 ? x0 : x1
  oq(roof, [xb, b, z], [xb, cy, z + h], [xg, cy, z + h], [xg, b, z], [0, -h, cy - b])
  oq(roof, [xb, d, z], [xb, cy, z + h], [xg, cy, z + h], [xg, d, z], [0, h, d - cy])
  oq(roof, [xb, b, z - 0.22], [xb, d, z - 0.22], [xg, d, z - 0.22], [xg, b, z - 0.22], [0, 0, -1])
  const xw = gableAt > 0 ? x1 : x0
  ot(wall, [xw, y0, z], [xw, y1, z], [xw, cy, z + h], [gableAt, 0, 0])
  ot(wall, [xb, b, z], [xb, d, z], [xb, cy, z + h], [-gableAt, 0, 0])
  oq(roof, [xg, b, z - 0.22], [xg, d, z - 0.22], [xg, d, z], [xg, b, z], [gableAt, 0, 0])
}

/** The window rhythm along a wall a→b (counter-clockwise, so it faces out). */
function windows(a: XY, b: XY, n: number, o: { lower?: boolean; upper?: boolean; z0?: number; square?: boolean } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), z0 = o.z0 ?? F
  for (let k = 0; k < n; k++) {
    const s = (L * (k + 0.5)) / n
    if (o.lower !== false && o.square) rectPanel(win, a, b, s, 1.5, z0 + 0.4, z0 + 3.2, 0.05)
    else if (o.lower !== false) archPanel(win, a, b, s, 1.6, z0 + 0.4, z0 + 3.6, 0.05, 8)
    if (o.upper !== false) rectPanel(win, a, b, s, 1.3, z0 + 4.3, z0 + 5.3, 0.05)
  }
}

// --- wings (|y| 8.3–21), eaves G + 8.0 ---
for (const s of [1, -1]) {
  const y0 = s > 0 ? 8.3 : -21.0, y1 = s > 0 ? 21.0 : -8.3
  body(-9.9, y0, 8.5, y1, G + 8.0)
  hip(-9.9, y0 - (s < 0 ? 0 : 1), 8.5, y1 + (s > 0 ? 0 : 1), G + 8.0, 2.3)
  windows([-9.9, y1], [-9.9, y0], 3) // west
  windows([8.5, y0], [8.5, y1], 3, { square: true }) // east
}
// --- end pavilions (|y| 21–34.5) and the end bays with their gables (|y| 34.5–38) ---
for (const s of [1, -1]) {
  const y0 = s > 0 ? 21.0 : -34.5, y1 = s > 0 ? 34.5 : -21.0
  body(-13.3, y0, 11.9, y1, G + 8.6)
  hip(-13.3, y0, 11.9, y1, G + 8.6, 2.5)
  windows([-13.3, y1], [-13.3, y0], 3)
  windows([11.9, y0], [11.9, y1], 3, { square: true })
  // the end bay, gable out
  const e0 = s > 0 ? 34.5 : -38.0, e1 = s > 0 ? 38.0 : -34.5
  body(-9.9, e0, 8.7, e1, G + 8.0)
  gableY(-9.9, 8.7, s > 0 ? 27.7 : e0, s > 0 ? e1 : -27.7, G + 8.0, 2.4, s > 0 ? 1 : -1)
  const ya = s > 0 ? e1 : e0
  const fa: XY = s > 0 ? [8.7, ya] : [-9.9, ya], fb: XY = s > 0 ? [-9.9, ya] : [8.7, ya]
  const L = 18.6
  for (const k of [0.17, 0.83]) { archPanel(win, fa, fb, L * k, 1.6, F + 0.4, F + 3.6, 0.05, 8); rectPanel(win, fa, fb, L * k, 1.3, F + 4.3, F + 5.3, 0.05) }
  archPanel(win, fa, fb, L / 2, 2.6, F + 0.2, F + 5.0, 0.05, 8)
  discPanel(trim, fa, fb, L / 2, G + 9.0, 0.95, 0.04, 14)
  discPanel(win, fa, fb, L / 2, G + 9.0, 0.7, 0.08, 14)
  // the square belvedere with oculi and a copper pyramid
  const bx = -0.7, by = s * 27.7, h = 1.8
  prism({ wall, win: null, roof: null, ring: rect(bx - h, by - h, bx + h, by + h), z0: G + 9.5, z1: G + 13.0, facade: null, bevel: 0.15 })
  block(trim, bx - h - 0.15, by - h - 0.15, bx + h + 0.15, by + h + 0.15, G + 12.6, G + 13.0)
  for (const [a, b] of [[[bx - h, by - h], [bx + h, by - h]], [[bx + h, by - h], [bx + h, by + h]], [[bx + h, by + h], [bx - h, by + h]], [[bx - h, by + h], [bx - h, by - h]]] as [XY, XY][]) discPanel(win, a, b, h, G + 11.4, 0.6, 0.05, 10)
  hip(bx - h, by - h, bx + h, by + h, G + 13.0, 1.4, 0.4)
}

// --- the centre (|y| < 8.3), eaves G + 10, with the gabled front to the garden ---
body(-9.9, -8.3, 8.5, 8.3, G + 10.0)
hip(-9.9, -8.3, 8.5, 8.3, G + 10.0, 2.4)
windows([8.5, -8.3], [8.5, 8.3], 3, { lower: false })
for (const s of [1, -1]) windows([-9.9, s > 0 ? 8.3 : -5.6], [-9.9, s > 0 ? 5.6 : -8.3], 1)
// front gable block
body(-11.3, -5.6, -3.0, 5.6, G + 10.6)
gableX(-11.3, -3.0, -5.6, 5.6, G + 10.6, 4.2, -1)
{
  const fa: XY = [-11.3, 5.6], fb: XY = [-11.3, -5.6]
  // limestone surround and the big round-headed window
  archPanel(trim, fa, fb, 5.6, 4.4, G + 2.6, G + 9.3, 0.04, 10)
  archPanel(win, fa, fb, 5.6, 3.4, G + 3.0, G + 8.8, 0.08, 10)
  discPanel(trim, fa, fb, 5.6, G + 12.3, 1.5, 0.04, 14)
  discPanel(win, fa, fb, 5.6, G + 12.3, 1.15, 0.08, 14)
  rectPanel(win, fa, fb, 5.6, 1.6, G + 0.1, F - 0.1, 0.06) // the doorway under the terrace
  // garden terrace with its balustrade in front of the centre
  for (const [x0, y0, x1, y1] of [[-14.6, -4.6, -11.3, -3.0], [-14.6, 3.0, -11.3, 4.6]]) block(trim, x0, y0, x1, y1, 0, F)
  for (const [x0, y0, x1, y1] of [[-14.6, -4.6, -11.3, -4.25], [-14.6, 4.25, -11.3, 4.6], [-14.6, -4.6, -14.25, -3.0], [-14.6, 3.0, -14.25, 4.6]]) block(trim, x0, y0, x1, y1, F, F + 1.05)
}
// central drum with oculi, copper hip, round lantern and dome
{
  const cx = -1.0, h = 3.0
  prism({ wall, win: null, roof: null, ring: rect(cx - h, -h, cx + h, h), z0: G + 11.0, z1: G + 15.6, facade: null, bevel: 0.2 })
  block(trim, cx - h - 0.2, -h - 0.2, cx + h + 0.2, h + 0.2, G + 15.1, G + 15.6)
  for (const [a, b] of [[[cx - h, -h], [cx + h, -h]], [[cx + h, -h], [cx + h, h]], [[cx + h, h], [cx - h, h]], [[cx - h, h], [cx - h, -h]]] as [XY, XY][]) {
    discPanel(trim, a, b, h, G + 13.5, 1.05, 0.04, 12)
    discPanel(win, a, b, h, G + 13.5, 0.75, 0.08, 12)
  }
  hip(cx - h, -h, cx + h, h, G + 15.6, 1.9, 0.6)
  const ring = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => [cx + r * Math.cos((i * Math.PI) / 6), r * Math.sin((i * Math.PI) / 6), z] as V3)
  trim.loft([ring(1.0, G + 16.9), ring(1.0, G + 18.6), ring(1.2, G + 18.6), ring(1.2, G + 18.9)])
  roof.loft([ring(1.2, G + 18.9), ring(1.05, G + 19.4), ring(0.7, G + 19.8), ring(0.2, G + 20.0)])
  trim.loft([ring(0.12, G + 20.0), ring(0.12, G + 20.4), ring(0.02, G + 20.6)])
}

// --- the apse on Washington Avenue: a half drum with a conical copper roof ---
{
  const cx = 10.2, R = 7.3, N = 12, top = G + 7.8
  const arc = (r: number, z: number): V3[] => Array.from({ length: N + 1 }, (_, i) => { const t = -Math.PI / 2 + (i * Math.PI) / N; return [cx + r * Math.cos(t), r * Math.sin(t), z] as V3 })
  const a0 = arc(R, 0), a1 = arc(R, top)
  for (let i = 0; i < N; i++) {
    const n0 = unit3([a0[i][0] - cx, a0[i][1], 0]), n1 = unit3([a0[i + 1][0] - cx, a0[i + 1][1], 0])
    wall.tri(a0[i], a0[i + 1], a1[i + 1], undefined, undefined, undefined, [n0, n1, n1])
    wall.tri(a0[i], a1[i + 1], a1[i], undefined, undefined, undefined, [n0, n1, n0])
    // windows: tall lower lights, lozenges above (Daderot's photo)
    const t = -Math.PI / 2 + ((i + 0.5) * Math.PI) / N, c = Math.cos(t), sn = Math.sin(t), tg: V3 = [-sn, c, 0]
    const P = (along: number, z: number, d = 0.06): V3 => [cx + (R + d) * c + tg[0] * along, (R + d) * sn + tg[1] * along, z]
    if (i % 2 === 1) {
      oq(win, P(-0.75, G + 0.2), P(0.75, G + 0.2), P(0.75, G + 3.8), P(-0.75, G + 3.8), [c, sn, 0])
      oq(win, P(0, G + 4.6), P(0.75, G + 5.4), P(0, G + 6.2), P(-0.75, G + 5.4), [c, sn, 0])
    }
  }
  const b0 = arc(R + 0.15, top - 0.45), b1 = arc(R + 0.15, top)
  for (let i = 0; i < N; i++) oq(trim, b0[i], b0[i + 1], b1[i + 1], b1[i], unit3([b0[i][0] - cx, b0[i][1], 0]))
  // conical roof from the eave (with overhang) to the centre wall
  const e = arc(R + 0.8, top), apex: V3 = [cx, 0, top + 2.4]
  for (let i = 0; i < N; i++) ot(roof, e[i], e[i + 1], apex, unit3([e[i][0] - cx, e[i][1], 1]))
  for (let i = 0; i < N; i++) ot(roof, e[i], e[i + 1], [cx, 0, top - 0.2], [0, 0, -1])
  // the strip joining the apse to the centre block's east wall
  body(8.5, -7.4, 10.2, 7.4, top)
}

finishModel('Laboratory Administration Building, Brooklyn Botanic Garden', 'nyc-bbg-laboratory', [
  { part: wall, material: finish('bbg-buff', 0xecdcb6) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('bbg-copper', 0x8fb9a2) },
  { part: win, material: PALETTE.window },
], { bearing: -8.5, osm: 'way/250229994', height: G + 20.6 })
