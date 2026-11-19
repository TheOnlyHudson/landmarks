/**
 * Grain Belt Beer Sign, Nicollet Island, Minneapolis (1941; on this site since
 * 1950; relit with LEDs 2017) — procedural, CC0-1.0, no textures.
 * bun generators/msp-grain-belt-sign.ts
 *
 * The giant bottle cap: a navy cap seen from the front with its white crimped
 * skirt below, a red diamond with a yellow border across it carrying "GRAIN
 * BELT" and "BEER" in cream slab-serif capitals, the Minneapolis Brewing
 * Company's "M" in a circle at the top, all inside a green rounded-rectangle
 * border tube, on a steel lattice tower braced back into the bank at the
 * south end of Nicollet Island, beside the Hennepin Avenue Bridge, facing
 * downtown.
 *
 * Famous sign: the lettering is modelled (STYLE.md, "Famous signs"), traced
 * from the photos below: heavy slab-serif capitals, upright, set on a
 * baseline that climbs one in ten to the right with the diamond's upper edge.
 *
 * Frame: map frame x right, y forward, z up, metres, placed at bearing 40.5,
 * so the sign's face looks to −y (220.5°, south-west, toward downtown and the
 * bridge) and +x runs along the face to the reader's right. Anchor: the OSM
 * node/12895850116 (historic=sign, "Grain Belt Beer Sign", Q128960847), which
 * the lidar puts 3 m behind the face. z = 0 is the lowest ground under the
 * legs, the foot of the bank in front (247.2 m); the bank rises about 4 m to
 * the back legs, which run down into it.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): node/12895850116. No building is
 *   mapped here, so the sign replaces nothing.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022), 0.5 m,
 *   read in this frame: the face a straight line 19.5 m long at bearing
 *   130.5°, its top 31.1 m over the foot of the bank (278.3 m); the frame
 *   behind it sloping down to 25.7–28 m 3 m back; a platform at about 13–14 m;
 *   the ground 2.4 m (front) to 6.5 m (back) over the lowest point in the box.
 * - Published (Wikipedia, "Grain Belt Beer Sign", from the NRHP nomination):
 *   the sign 52 ft (15.8 m) tall and 63 ft (19.2 m) wide, the structure 100 ft
 *   (30.5 m) tall; built 1941 by General Outdoor Advertising, moved here 1950,
 *   neon and over 1,000 bulbs, relit with LEDs on 30 December 2017.
 * Photos (evidence, Wikimedia Commons):
 * - August Schwerdfeger, "Grain Belt sign 2016-07-29.jpg", CC BY 4.0 (face-on:
 *   the layout traced for every element, letterforms):
 *   https://commons.wikimedia.org/wiki/File:Grain_Belt_sign_2016-07-29.jpg
 * - Guywelch2000, "Grain Belt Beer sign, Nicollet Island, Minneapolis.jpg",
 *   CC BY 4.0 (from the south-west, below: the tower, the border tube's
 *   green, the lattice behind the cap):
 *   https://commons.wikimedia.org/wiki/File:Grain_Belt_Beer_sign,_Nicollet_Island,_Minneapolis.jpg
 * - Greg Gjerdingen, "Grain Belt Beer Sign (41038520611) (cropped).jpg", CC BY
 *   2.0 (lit at dusk: green border, red diamond outline, cream letters, the
 *   skirt's lit crimps):
 *   https://commons.wikimedia.org/wiki/File:Grain_Belt_Beer_Sign_(41038520611)_(cropped).jpg
 * - August Schwerdfeger, "Grain Belt sign relit 2017-12-30.jpg", CC BY 4.0
 *   (night, relit): https://commons.wikimedia.org/wiki/File:Grain_Belt_sign_relit_2017-12-30.jpg
 *
 * Numbers
 * - The border: 19.2 x 15.6 m (published 63 x 52 ft; the photo's aspect
 *   0.81), corner radius 1.8 m, its top at 31.1 m (lidar).
 * - Everything inside it traced from the face-on photo scaled to that box:
 *   navy cap top 12.8 x 10.5 m; skirt out to ±7.9 m and down to 16.3 m
 *   with 22 crimps; diamond from
 *   (−9.25, 23.8) to (9.2, 26.0), (−0.5, 29.6) to (0.5, 20.1) (u, z);
 *   "GRAIN BELT" 2.1 m high from u −7.5 to 7.6, "BEER" 1.6 m; the M circle
 *   0.8 m radius.
 * - Tower: seven posts in the face plane, four back legs 6 m behind (lidar's
 *   slope), rails every 3.5 m, X-bracing below the face; members 0.36 m
 *   square, thicker than the real angles so they read (STYLE.md).
 * - Colours from the daylight photos: navy cap, white skirt, red diamond with
 *   a yellow edge, cream letters, green border tube, grey-green steel.
 *
 * Night: the border tube neon green, the letters, M ring and the skirt cream
 * white, the diamond's edge yellow (it reads red-orange in some night photos),
 * and the diamond's red face (lit in the dusk photo), as `neon*` materials;
 * the navy cap and the steel stay unlit.
 *
 * Doubts
 * - The back of the sign (plain panels and catwalks) is drawn as the backs of
 *   the cap and diamond and the bare frame; no close photo of it was used.
 * - The real lattice is far finer: drawn at about half its density.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const STEEL = finish('steel-green', 0x7c8a7a)
const GREEN = finish('neon-green', 0x5fae7c)
const RED = finish('neon-grain-belt-red', 0xb8403a) // the diamond's face is lit red after dark (dusk photo)
const CREAM = finish('neon-cream', 0xefe3c4)
const NAVY = finish('cap-navy', 0x4a5670)
const YELLOW = finish('neon-yellow', 0xe2b83c)
const steel = new Part(), green = new Part(), red = new Part(), cream = new Part(), navy = new Part(), yellow = new Part()

const FACE_Y = -3 // the face plane (lidar)
/** Face plane: u right, z up, w toward the viewer (−y). */
const F = (u: number, z: number, w = 0): V3 => [u, FACE_Y - w, z]

const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function poly(p: Part, q: V3[], n: V3) {
  const pts = dot(cross(sub(q[1], q[0]), sub(q[2], q[0])), n) >= 0 ? q : [...q].reverse()
  for (let i = 1; i + 1 < pts.length; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
/** A flat panel in the face plane at depth w, front and back. */
function panel(p: Part, pts: [number, number][], w: number, back = true) {
  poly(p, pts.map(([u, z]) => F(u, z, w)), [0, -1, 0])
  if (back) poly(p, pts.map(([u, z]) => F(u, z, w - 0.25)), [0, 1, 0])
}
/** A square-section bar from a to b. */
function bar(p: Part, a: V3, b: V3, r: number) {
  const d = sub(b, a), l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const s0 = Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1])
  const ls = Math.hypot(...s0), s: V3 = [s0[0] / ls, s0[1] / ls, s0[2] / ls], u = cross(s, t)
  const c = (o: V3, i: number): V3 => {
    const k = (i * Math.PI) / 2 + Math.PI / 4
    return [o[0] + (s[0] * Math.cos(k) + u[0] * Math.sin(k)) * r * 1.414, o[1] + (s[1] * Math.cos(k) + u[1] * Math.sin(k)) * r * 1.414, o[2] + (s[2] * Math.cos(k) + u[2] * Math.sin(k)) * r * 1.414]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, m = (i + 0.5) * Math.PI / 2 + Math.PI / 4
    poly(p, [c(a, i), c(a, j), c(b, j), c(b, i)], [s[0] * Math.cos(m) + u[0] * Math.sin(m), s[1] * Math.cos(m) + u[1] * Math.sin(m), s[2] * Math.cos(m) + u[2] * Math.sin(m)])
  }
}

// ---- The tower ----------------------------------------------------------------------
const TOP = 31.1, BOTTOM = TOP - 15.6, ZC = TOP - 7.8
const POSTS = [-9.6, -6.4, -3.2, 0, 3.2, 6.4, 9.6]
const R = 0.18
for (const u of POSTS) bar(steel, F(u, 0, -0.7), F(u, TOP + 0.4, -0.7), R)
for (const u of [-9.6, -3.2, 3.2, 9.6]) {
  bar(steel, F(u, 0, -6.7), F(u, 25.8, -6.7), R) // back legs, into the bank
  bar(steel, F(u, TOP + 0.4, -0.7), F(u, 25.8, -6.7), R * 0.8) // the back slope
  for (const z of [6, 13.5, 20]) bar(steel, F(u, z, -0.7), F(u, z, -6.7), R * 0.7)
  bar(steel, F(u, 0.5, -0.7), F(u, 13.5, -6.7), R * 0.7)
}
for (const z of [BOTTOM - 1.5, BOTTOM + 2.0, ZC, TOP - 2.2, TOP + 0.4]) bar(steel, F(-10.1, z, -0.7), F(10.1, z, -0.7), R * 0.85)
for (const z of [6, 13.5]) bar(steel, F(-9.6, z, -0.7), F(9.6, z, -0.7), R * 0.85)
// X-bracing in the face plane below the sign, in alternate bays
for (let i = 0; i + 1 < POSTS.length; i += 2) {
  const a = POSTS[i], b = POSTS[i + 1]
  for (const [z0, z1] of [[0.5, 6], [6, 13.5]]) {
    bar(steel, F(a, z0, -0.7), F(b, z1, -0.7), R * 0.6)
    bar(steel, F(b, z0, -0.7), F(a, z1, -0.7), R * 0.6)
  }
}
// a catwalk under the face
poly(steel, [F(-9.8, BOTTOM - 1.5, 0.2), F(9.8, BOTTOM - 1.5, 0.2), F(9.8, BOTTOM - 1.5, -1.4), F(-9.8, BOTTOM - 1.5, -1.4)], [0, 0, 1])
poly(steel, [F(-9.8, BOTTOM - 1.5, 0.2), F(9.8, BOTTOM - 1.5, 0.2), F(9.8, BOTTOM - 1.5, -1.4), F(-9.8, BOTTOM - 1.5, -1.4)], [0, 0, -1])

// ---- The cap ----------------------------------------------------------------------
// The navy top of the cap (traced: 30.3 m to 19.8 m, u −6.6 to 6.2), and the
// white crimped skirt below and around it, seen from below as on the real
// sign: out to ±7.9 m at mid-height and down to 16.3 m.
const CU = -0.2, CZ = 25.05, CRX = 6.4, CRZ = 5.25
const disc: [number, number][] = Array.from({ length: 28 }, (_, i) => {
  const a = (2 * Math.PI * i) / 28
  return [CU + CRX * Math.cos(a), CZ + CRZ * Math.sin(a)]
})
panel(navy, disc, 0.1)
{
  const n = 22, a0 = (158 * Math.PI) / 180, a1 = (382 * Math.PI) / 180
  const su = 0.18, sz = 23.2, ex = 7.95, ez = 6.9
  const at = (k: number) => a0 + ((a1 - a0) * k) / (2 * n)
  const outer = (k: number): [number, number] => {
    const r = k % 2 ? 0.92 : 1.0
    return [su + ex * r * Math.cos(at(k)), sz + ez * r * Math.sin(at(k))]
  }
  const inner = (k: number): [number, number] => [CU + CRX * 0.97 * Math.cos(at(k)), CZ + CRZ * 0.97 * Math.sin(at(k))]
  for (let k = 0; k < 2 * n; k++) panel(cream, [inner(k), outer(k), outer(k + 1), inner(k + 1)], 0.05)
}

// ---- The diamond ------------------------------------------------------------------
const DL: [number, number] = [-9.25, 23.83], DR: [number, number] = [9.2, 25.96], DT: [number, number] = [-0.53, 29.57], DB: [number, number] = [0.53, 20.11]
panel(red, [DL, DB, DR, DT], 0.3)
{
  const pen = new Pen()
  pen.moveTo(DL).lineTo(DB).lineTo(DR).lineTo(DT).lineTo(DL)
  strokes(yellow, pen.paths, { width: 0.32, depth: 0.12, place: (u, v, w) => F(u, v, 0.3 + w) })
}

// ---- The border tube ---------------------------------------------------------------
{
  const pen = new Pen(), hw = 9.6, hh = 7.8, r = 1.8
  pen.moveTo([-hw + r, ZC - hh]).lineTo([hw - r, ZC - hh]).arc([hw - r, ZC - hh + r], Math.PI / 2, 4)
    .lineTo([hw, ZC + hh - r]).arc([hw - r, ZC + hh - r], Math.PI / 2, 4)
    .lineTo([-hw + r, ZC + hh]).arc([-hw + r, ZC + hh - r], Math.PI / 2, 4)
    .lineTo([-hw, ZC - hh + r]).arc([-hw + r, ZC - hh + r], Math.PI / 2, 4)
  strokes(green, pen.paths, { width: 0.45, depth: 0.45, back: true, place: (u, v, w) => F(u, v, 0.1 + w) })
}

// ---- Lettering --------------------------------------------------------------------
/** Points on an ellipse arc, from a0 to a1 (radians), as a path. */
const ell = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 8): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt })
type Glyph = { w: number; draw: (p: Pen) => void }
const d2r = Math.PI / 180
// Heavy slab-serif capitals, cap height 1.
const G: Record<string, Glyph> = {
  G: { w: 0.66, draw: (p) => { const a = ell(0.31, 0.5, 0.31, 0.5, 38 * d2r, 330 * d2r, 9); p.moveTo(a[0]); for (const q of a.slice(1)) p.lineTo(q); p.lineTo([0.6, 0.42]).lineTo([0.36, 0.42]); p.moveTo([0.6, 0.42]).lineTo([0.6, 0.0]) } },
  R: { w: 0.66, draw: (p) => { p.moveTo([-0.08, 1]).lineTo([0.3, 1]).quadTo([0.52, 1], [0.52, 0.76], 4).quadTo([0.52, 0.52], [0.3, 0.52], 4).lineTo([0, 0.52]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.08, 0]).lineTo([0.1, 0]); p.moveTo([0.26, 0.52]).lineTo([0.54, 0]).lineTo([0.62, 0]) } },
  A: { w: 0.7, draw: (p) => { p.moveTo([-0.04, 0]).lineTo([0.1, 0]); p.moveTo([0.04, 0]).lineTo([0.32, 1]).lineTo([0.6, 0]); p.moveTo([0.52, 0]).lineTo([0.68, 0]); p.moveTo([0.15, 0.36]).lineTo([0.49, 0.36]) } },
  I: { w: 0.3, draw: (p) => { p.moveTo([0.12, 0]).lineTo([0.12, 1]); p.moveTo([-0.02, 1]).lineTo([0.26, 1]); p.moveTo([-0.02, 0]).lineTo([0.26, 0]) } },
  N: { w: 0.7, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.58, 0]).lineTo([0.58, 1]); p.moveTo([-0.08, 0]).lineTo([0.1, 0]); p.moveTo([0.48, 1]).lineTo([0.66, 1]) } },
  B: { w: 0.64, draw: (p) => { p.moveTo([-0.08, 1]).lineTo([0.3, 1]).quadTo([0.5, 1], [0.5, 0.77], 4).quadTo([0.5, 0.54], [0.3, 0.54], 4).lineTo([0, 0.54]); p.moveTo([0.3, 0.54]).quadTo([0.55, 0.54], [0.55, 0.27], 4).quadTo([0.55, 0], [0.3, 0], 4).lineTo([-0.08, 0]); p.moveTo([0, 0]).lineTo([0, 1]) } },
  E: { w: 0.58, draw: (p) => { p.moveTo([0.5, 0.8]).lineTo([0.5, 1]).lineTo([-0.08, 1]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.08, 0]).lineTo([0.52, 0]).lineTo([0.52, 0.2]); p.moveTo([0, 0.52]).lineTo([0.36, 0.52]) } },
  L: { w: 0.56, draw: (p) => { p.moveTo([-0.08, 1]).lineTo([0.12, 1]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.08, 0]).lineTo([0.5, 0]).lineTo([0.5, 0.22]) } },
  T: { w: 0.64, draw: (p) => { p.moveTo([0, 0.8]).lineTo([0, 1]).lineTo([0.6, 1]).lineTo([0.6, 0.8]); p.moveTo([0.3, 1]).lineTo([0.3, 0]); p.moveTo([0.16, 0]).lineTo([0.44, 0]) } },
  M: { w: 0.8, draw: (p) => { p.moveTo([0, 0]).lineTo([0.06, 1]).lineTo([0.38, 0.25]).lineTo([0.7, 1]).lineTo([0.76, 0]) } },
  ' ': { w: 0.45, draw: () => {} },
}
function word(text: string, gap: number) {
  const pen = new Pen()
  let x = 0
  for (const ch of text) {
    const g = G[ch], s = new Pen()
    g.draw(s)
    pen.add(s, x + 0.08)
    x += g.w + gap
  }
  return { pen, width: x - gap }
}
const SLOPE = 0.1 // the baseline climbs with the diamond's upper edge
function setWord(text: string, u0: number, u1: number, z0: number, h: number, width: number) {
  const { pen, width: wu } = word(text, 0.16)
  const k = (u1 - u0) / wu
  strokes(cream, pen.paths, {
    width, depth: 0.25,
    place: (u, v, w) => { const U = u0 + u * k; return F(U, z0 + (U - u0) * SLOPE + v * h, 0.42 + w) },
  })
}
setWord('GRAIN BELT', -7.5, 7.6, 23.92, 2.1, 0.2)
setWord('BEER', -2.82, 3.35, 22.06, 1.6, 0.22)
// the M in its ring at the top of the diamond
{
  const pen = new Pen()
  pen.circle([-0.4, 28.2], 0.8, 0.8, 14)
  strokes(cream, pen.paths, { width: 0.2, depth: 0.25, place: (u, v, w) => F(u, v, 0.42 + w) })
  const m = new Pen()
  G.M.draw(m)
  strokes(cream, m.paths, { width: 0.2, depth: 0.25, place: (u, v, w) => F(-0.4 - 0.42 + u * 1.1, 28.2 - 0.45 + v * 0.9, 0.42 + w) })
}

// ---- Write -----------------------------------------------------------------------------
const parts = [
  { part: steel, material: STEEL },
  { part: green, material: GREEN },
  { part: red, material: RED },
  { part: cream, material: CREAM },
  { part: navy, material: NAVY },
  { part: yellow, material: YELLOW },
]
const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
const glb = writeGlb('msp-grain-belt-sign', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
const outPath = process.argv[2] ?? new URL('../models/msp-grain-belt-sign.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes`)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
