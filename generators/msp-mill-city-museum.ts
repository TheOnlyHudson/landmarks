/**
 * Mill City Museum (the Washburn A Mill ruins) and the Gold Medal Flour
 * Elevator, Minneapolis — procedural, CC0-1.0, no textures.
 * bun generators/msp-mill-city-museum.ts
 *
 * The Washburn A Mill (1880, rebuilt after the 1878 explosion) burned in 1991;
 * its limestone walls were stabilised as ruins and the Minnesota Historical
 * Society built the Mill City Museum (2003, Meyer Scherer & Rockcastle) inside
 * them: a glass-walled block at the 2nd Street end, an open ruin courtyard on
 * the river side, a glass elevator tower crowned by the red MILL CITY MUSEUM
 * sign. Joined to it on the river side stands the mill's concrete grain
 * elevator, its rows of silos and its head house carrying the two GOLD MEDAL
 * FLOUR signs.
 *
 * Identity note (the lead asked "whether the sign sits on the elevator or the
 * mill"): the signs stand on the elevator, not on the mill. OSM names the
 * elevator "Gold Medal Flour Elevator" (way/157035921, man_made=silo); the
 * lidar shows two sign frames 13 m tall on the ends of its head house roof
 * (way/1534387796), and every photo has them there. There are two identical
 * signs, one on each end of that roof, back to back: the west one faces
 * downtown, the east one faces the river and the east bank. The elevator is
 * also east of the mill (river side), not west as the brief guessed.
 *
 * Frame: map frame x right, y forward, z up, metres, placed at bearing 30:
 * model +y runs toward the river (north-north-east), +x down the river
 * (east-south-east), the downtown street grid's axes. Anchor -93.2571913,
 * 44.9788220, the area centroid of the museum outline way/157035918. z = 0 is
 * the lowest ground under the footprint, the river side (West River Parkway
 * level, 243.4 m); 2nd Street on the south side is 7 m higher, where the walls
 * run into the slope and the windows start above the street.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the museum way/157035918 (historic=
 *   heritage, 8 levels) with its elevator-tower bump; the elevator way/
 *   157035921 (5 levels) with parts way/1534387794 (6 levels), way/1534387795
 *   (8 levels), way/1534387796 (height 56, the head house); the roof between
 *   them way/157035917; the 2nd Street canopy way/1545436274.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022), 1 m,
 *   class 18 kept (city notes), above the river-side ground: museum block
 *   35.5–38.5 m; ruin wall on the river side 12–16 m; elevator tower 40 m and
 *   its sign to 44 m; north silo bank 41.8 m (west half) and 34.8 m (east
 *   half); head house roof 62 m with a 51 m stage on its north side and a
 *   44 m stair block on its west; the two sign frames to 14.3 m over that
 *   roof, each along the roof's short side; the roofs between museum and
 *   elevator 13 m; the conveyor gallery to the mill at 38 m. 2nd Street
 *   ground +7 m.
 * - Published (Wikipedia, "Mill City Museum", "Washburn A Mill"; MNHS): built
 *   1874/1880, fire 1991, museum opened 2003; the GOLD MEDAL FLOUR signs.
 * Photos (evidence, Wikimedia Commons):
 * - McGhiever, "Washburn A Mill 2014.jpg", CC BY-SA 4.0 (the river side: the
 *   silos, the head house and both signs, the ruins, the glass museum and the
 *   elevator tower with its sign):
 *   https://commons.wikimedia.org/wiki/File:Washburn_A_Mill_2014.jpg
 * - Tsya 42, "Washburn A Mill Mill City Museum.jpg", CC BY-SA 4.0
 *   (from the river, east: the head house's stepped top, the sign facing the
 *   river read face-on, the other from behind; letterforms):
 *   https://commons.wikimedia.org/wiki/File:Washburn_A_Mill_Mill_City_Museum.jpg
 * - quaziefoto, "Mill City Museum-20070704.jpg", CC BY 2.0 (the ruin
 *   courtyard from the river: stepped ruin walls, the glass block, the tower):
 *   https://commons.wikimedia.org/wiki/File:Mill_City_Museum-20070704.jpg
 * - Michael Barera, "Minneapolis April 2025 23 (Mill City Museum).jpg", CC
 *   BY-SA 4.0 (inside the courtyard: the glass museum facade):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_23_(Mill_City_Museum).jpg
 * - Michael Barera, "Minneapolis April 2025 21 (Mill City Museum).jpg", CC
 *   BY-SA 4.0 (the 2nd Street side):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_21_(Mill_City_Museum).jpg
 * - Tony Webster, "Gold Medal Flour, Minneapolis (23675508481).jpg", CC BY-SA
 *   2.0 (the head house top and both sign frames):
 *   https://commons.wikimedia.org/wiki/File:Gold_Medal_Flour,_Minneapolis_(23675508481).jpg
 * - Tiggr222, "Washburn A Mill Complex.jpg", CC BY-SA 4.0 (night: the sign lit
 *   red): https://commons.wikimedia.org/wiki/File:Washburn_A_Mill_Complex.jpg
 *
 * Famous sign: the GOLD MEDAL FLOUR letters are modelled (STYLE.md, "Famous
 * signs"), traced from the photos: three stacked lines of bold condensed
 * sans-serif capitals, gold by day on an open steel frame, outlined in red
 * neon that glows after dark. Each sign 13 m wide; lines 3.2 m high.
 *
 * Numbers
 * - Plans: OSM in this frame, squared up; heights lidar (above).
 * - Silos: the north bank as two rows of cylinders, slender in the west half
 *   (r 2.4 m, five a row) and stout in the east (r 3.4 m), as the river photo
 *   shows; the cores between them filled.
 * - Ruin walls: 1.4 m thick, stepped tops estimated from the courtyard and
 *   river photos (the east wall to 30 m, the west wall stepping down from the
 *   block to 14 m at the river, the river wall 12–16 m with its openings).
 * - Museum windows: arched, seven rows on 2nd Street (photo); the courtyard
 *   face a glass wall in three tiers, the top storeys glazed on the sides.
 * - Colours: grey-buff limestone, pale stained concrete, gold letters, dark
 *   steel, from the daylight photos.
 *
 * Doubts
 * - The museum's 2nd Street half and the buildings east of it (which OSM does
 *   not tie to the museum) are not photographed close up here; the 2nd Street
 *   face follows the street photo loosely.
 * - The low structures between the museum and the elevator (the train shed
 *   and roofs, 13 m) are drawn as one block.
 * - Which way each sign faces is read from the photos (the river photo reads
 *   one and mirrors the other) and the lidar (both frames run along the roof's
 *   short sides); the headings are estimates.
 * - "WASHBURN CROSBY CO" painted lettering is left out, as asked.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const STONE = finish('limestone', 0xd3c9b3)
const CONC = finish('concrete', 0xd2ccbe)
const WIN = PALETTE.window
const STEEL = finish('steel', 0x4f4d4b)
const GOLD = finish('gold-medal-gold', 0xd9ac3a)
const NEON = finish('neon-red', 0xd9473b)
const stone = new Part(), conc = new Part(), win = new Part(), steel = new Part(), gold = new Part(), neon = new Part()

// ---- Helpers -----------------------------------------------------------------
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function poly(p: Part, q: V3[], n: V3) {
  const pts = dot(cross(sub(q[1], q[0]), sub(q[2], q[0])), n) >= 0 ? q : [...q].reverse()
  for (let i = 1; i + 1 < pts.length; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
function prism(p: Part, plan: [number, number][], z0: number, z1: number, bottom = false) {
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const a = plan[i], b = plan[(i + 1) % n]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
  poly(p, plan.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, plan.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const rect = (x0: number, x1: number, y0: number, y1: number, c = 0.4): [number, number][] =>
  c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.4, bottom = false) =>
  prism(p, rect(x0, x1, y0, y1, c), z0, z1, bottom)
function cylinder(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 12) {
  const plan: [number, number][] = Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)])
  // smooth sides
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = (2 * Math.PI * i) / n, b = (2 * Math.PI * j) / n
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const A0: V3 = [plan[i][0], plan[i][1], z0], B0: V3 = [plan[j][0], plan[j][1], z0], A1: V3 = [plan[i][0], plan[i][1], z1], B1: V3 = [plan[j][0], plan[j][1], z1]
    p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
  poly(p, plan.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
}
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
/** A flush panel on a wall through o along t facing n, u0..u1, z0..z1, with an optional round head. */
function panel(p: Part, o: [number, number], t: [number, number], n: [number, number], u0: number, u1: number, z0: number, z1: number, round = false) {
  const off = 0.05
  const P = (u: number, z: number): V3 => [o[0] + t[0] * u + n[0] * off, o[1] + t[1] * u + n[1] * off, z]
  const N: V3 = [n[0], n[1], 0]
  poly(p, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], N)
  if (!round) return
  const hw = (u1 - u0) / 2, c = (u0 + u1) / 2, k = 5
  for (let i = 0; i < k; i++) {
    const a0 = Math.PI - (Math.PI * i) / k, a1 = Math.PI - (Math.PI * (i + 1)) / k
    poly(p, [P(c, z1), P(c + hw * Math.cos(a0), z1 + hw * Math.sin(a0)), P(c + hw * Math.cos(a1), z1 + hw * Math.sin(a1))], N)
  }
}

// ---- The museum block (2nd Street half) -------------------------------------------
const MX0 = -21.2, MX1 = 18.5, MY0 = -20.9, MY1 = 21.9, MB = 12 // the block reaches y = MB
const STREET = 7 // 2nd Street over the river-side ground
box(stone, MX0, MX1, MY0, MB, 0, 36.5, 0.5)
// 2nd Street face: arched windows, seven rows over the street
for (let r = 0; r < 7; r++) {
  const z0 = STREET + 2.2 + r * 3.9
  for (let c = 0; c < 8; c++) {
    const u = 2.2 + c * 4.85
    panel(win, [MX1, MY0], [-1, 0], [0, -1], u, u + 1.6, z0, z0 + 2.2, true)
  }
}
// east face above the neighbours (lidar 28 m next door)
for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) {
  const z0 = 29.5 + r * 3.4, u = 2 + c * 4.4
  panel(win, [MX1, MY0], [0, 1], [1, 0], u, u + 1.6, z0, z0 + 2.0, true)
}
// the courtyard face: the museum's glass wall over the whole face, in three
// tiers with steel floor bands (the river and courtyard photos read it as one
// dark glass block above the ruins)
for (let tier = 0; tier < 3; tier++) {
  const z0 = 5.2 + tier * 10.4, z1 = z0 + 9.8
  for (let bay = 0; bay < 2; bay++) {
    const u0 = 0.8 + bay * 19.1
    panel(win, [MX0, MB], [1, 0], [0, 1], u0, u0 + 18.5, z0, z1)
  }
}
// and the block's top storeys above the ruin walls, glazed on both sides
for (const [o, t, n] of [[[MX0, MB], [0, -1], [-1, 0]], [[MX1, MB], [0, -1], [1, 0]]] as [[number, number], [number, number], [number, number]][])
  panel(win, o, t, n, 0.8, 12, 30.2, 35.6)
// 2nd Street canopy (way/1545436274)
box(steel, MX0, MX1, -24.5, MY0, STREET + 4.0, STREET + 4.4, 0, true)

// ---- The ruin walls round the courtyard ----------------------------------------------
const T = 1.4
// west wall: stepping down from the block to the river
const westSteps: [number, number, number][] = [[MB, 15.5, 33], [15.5, 18.5, 24], [18.5, MY1, 17]]
for (const [y0, y1, z] of westSteps) box(stone, MX0, MX0 + T, y0, y1, 0, z, 0.2)
// east wall: the tall ruin, to 30 m
box(stone, MX1 - T, MX1, MB, MY1, 0, 30, 0.2)
// river wall: ragged top 12–16 m
const riverSteps: [number, number, number][] = [[MX0 + T, -12, 13], [-12, -4, 15.5], [-4, 4, 12], [4, MX1 - T, 16]]
for (const [x0, x1, z] of riverSteps) box(stone, x0, x1, MY1 - T, MY1, 0, z, 0.2)
// empty window openings in the ruins: dark, unglazed
for (let c = 0; c < 9; c++) for (let r = 0; r < 2; r++) {
  const u = 2.2 + c * 4.2, z0 = 2.6 + r * 4.6
  panel(steel, [MX0, MY1], [1, 0], [0, 1], u, u + 1.3, z0, z0 + 2.0, true)
}
for (let r = 0; r < 6; r++) for (const u of [1.6, 5.2]) {
  const z0 = 3 + r * 4.4
  if (z0 + 2.6 < 29) panel(steel, [MX1, MB], [0, 1], [1, 0], u, u + 1.2, z0, z0 + 2.0, true)
}
for (let r = 0; r < 3; r++) panel(steel, [MX0, MB], [0, 1], [-1, 0], 4.5, 5.7, 3 + r * 4.4, 5 + r * 4.4, true)
// the glass elevator tower in the river wall's bump (OSM) with the MILL CITY MUSEUM sign
box(win, 5.4, 10.8, 22, 30, 0, 40.5, 0.2)
box(steel, 5.2, 11, 21.8, 30.2, 40.5, 41.2, 0, true)
bar(steel, [6.6, 26, 41.2], [6.6, 26, 42], 0.12)
bar(steel, [9.6, 26, 41.2], [9.6, 26, 42], 0.12)
box(neon, 5.9, 10.3, 25.6, 26.4, 42, 46.4, 0, true)

// ---- The elevator --------------------------------------------------------------------
// The low buildings between the mill and the silos (train shed and roofs, 13 m).
box(conc, MX1, 80.5, 15.4, 28, 0, 13, 0.3)
box(conc, 20, 47, 28, 43, 0, 13, 0.3)
// north silo bank: slender bins in the west half, stout ones in the east
for (const y of [45.9, 51.3]) {
  for (let k = 0; k < 5; k++) cylinder(conc, 22.4 + k * 4.8, y, 2.4, 0, 41.8)
  for (let k = 0; k < 5; k++) cylinder(conc, 47.6 + k * 6.8, y, 3.4, 0, 34.8)
}
box(conc, 22.4, 41.6, 45.9, 51.3, 0, 41.2, 0)
box(conc, 47.6, 74.8, 45.9, 51.3, 0, 34.2, 0)
// the head house over them: north stage to 51, the house to 62, the stair block to 44
box(conc, 46.6, 74, 38.2, 43.2, 0, 51, 0.3)
box(conc, 47, 75, 28, 40, 0, 62, 0.4)
box(conc, 42, 47, 28, 40, 0, 44, 0.3)
// small windows on the head house (photo: a scatter of single lights)
for (const [u, z] of [[3, 54], [9, 56.5], [15, 54], [21, 56.5], [26, 54], [5, 47], [12, 47], [19, 47], [24, 44]] as [number, number][]) {
  panel(steel, [47, 28], [1, 0], [0, -1], u, u + 1.1, z, z + 1.4)
  panel(steel, [75, 43.2], [-1, 0], [0, 1], u, u + 1.1, z - 9, z - 7.6)
}
// the conveyor gallery from the head house to the mill
box(steel, 9, 42, 32.5, 35.5, 34.2, 38.4, 0, true)
bar(steel, [20, 34, 13], [20, 34, 34.2], 0.3)
bar(steel, [32, 34, 13], [32, 34, 34.2], 0.3)

// ---- GOLD MEDAL FLOUR ----------------------------------------------------------------
type Glyph = { w: number; draw: (p: Pen) => void }
const ell = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 8): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt })
const d2r = Math.PI / 180
const G: Record<string, Glyph> = {
  G: { w: 0.56, draw: (p) => { const a = ell(0.27, 0.5, 0.27, 0.5, 38 * d2r, 322 * d2r, 9); p.moveTo(a[0]); for (const q of a.slice(1)) p.lineTo(q); p.lineTo([0.54, 0.42]).lineTo([0.3, 0.42]) } },
  O: { w: 0.56, draw: (p) => { p.circle([0.27, 0.5], 0.27, 0.5, 14) } },
  L: { w: 0.5, draw: (p) => { p.moveTo([0, 1]).lineTo([0, 0]).lineTo([0.48, 0]) } },
  D: { w: 0.56, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.24, 1]).cubicTo([0.58, 1], [0.58, 0], [0.24, 0], 6).lineTo([0, 0]) } },
  M: { w: 0.7, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.33, 0.32]).lineTo([0.66, 1]).lineTo([0.66, 0]) } },
  E: { w: 0.5, draw: (p) => { p.moveTo([0.48, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.48, 0]); p.moveTo([0, 0.52]).lineTo([0.4, 0.52]) } },
  A: { w: 0.62, draw: (p) => { p.moveTo([0, 0]).lineTo([0.3, 1]).lineTo([0.6, 0]); p.moveTo([0.12, 0.32]).lineTo([0.48, 0.32]) } },
  F: { w: 0.5, draw: (p) => { p.moveTo([0.48, 1]).lineTo([0, 1]).lineTo([0, 0]); p.moveTo([0, 0.52]).lineTo([0.4, 0.52]) } },
  U: { w: 0.56, draw: (p) => { p.moveTo([0, 1]).lineTo([0, 0.26]).quadTo([0, 0], [0.27, 0], 3).quadTo([0.54, 0], [0.54, 0.26], 3).lineTo([0.54, 1]) } },
  R: { w: 0.58, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.28, 1]).quadTo([0.54, 1], [0.54, 0.75], 3).quadTo([0.54, 0.5], [0.28, 0.5], 3).lineTo([0, 0.5]); p.moveTo([0.26, 0.5]).lineTo([0.56, 0]) } },
}
const ROOF = 62, SIGN_H = 14.3, SIGN_W = 13
/**
 * One sign: its face at x = fx across y 27.5…40.5, facing `dir` (±1 in x),
 * frame braced back onto the roof.
 */
function goldMedal(fx: number, dir: number) {
  const yc = 34
  // u to the reader's right: facing −x the reader looks +x, so right is −y
  const S = (u: number, v: number, w: number): V3 => [fx + dir * w, yc + dir * u, ROOF + v]
  for (const u of [-6.2, -2.1, 2.1, 6.2]) {
    bar(steel, S(u, 0, -0.4), S(u, SIGN_H, -0.4), 0.15)
    bar(steel, S(u, SIGN_H, -0.4), S(u, 0, -4.2), 0.12)
  }
  for (const v of [1.1, 5.0, 9.0, 12.95]) bar(steel, S(-6.6, v, -0.4), S(6.6, v, -0.4), 0.11)
  const lines: [string, number][] = [['GOLD', 9.5], ['MEDAL', 5.4], ['FLOUR', 1.4]]
  for (const [text, v0] of lines) {
    const pen = new Pen()
    let x = 0
    for (const ch of text) { const s = new Pen(); G[ch].draw(s); pen.add(s, x); x += G[ch].w + 0.2 }
    const width = x - 0.2, h = 3.2, k = Math.min(1, 11.6 / (width * h)) * h
    const u0 = -(width * k) / 2
    const place = (u: number, v: number, w: number) => S(u0 + u * k, v0 + v * h, w)
    strokes(gold, pen.paths, { width: 0.19, depth: 0.45, back: true, place })
    strokes(neon, pen.paths, { width: 0.05, depth: 0.08, place: (u, v, w) => place(u, v, 0.46 + w) })
  }
}
goldMedal(48.6, -1) // the west sign, facing downtown
goldMedal(73.4, 1) // the east sign, facing the river and the east bank

// ---- Write -----------------------------------------------------------------------------
const parts = [
  { part: stone, material: STONE },
  { part: conc, material: CONC },
  { part: win, material: WIN },
  { part: steel, material: STEEL },
  { part: gold, material: GOLD },
  { part: neon, material: NEON },
]
const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
const glb = writeGlb('msp-mill-city-museum', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
const outPath = process.argv[2] ?? new URL('../models/msp-mill-city-museum.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes`)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
