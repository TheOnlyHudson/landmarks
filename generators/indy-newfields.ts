/**
 * Newfields: the Indianapolis Museum of Art's main building (1970, Ambrose
 * Richardson; additions by Edward Larrabee Barnes 1990, and the 2005
 * expansion by Browning Day Mullins Dierdorf with the glass entrance
 * pavilion), 4000 Michigan Road, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-newfields.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 7 (the
 * outline's main walls run at 6..8 degrees; the east wing and the entrance
 * block's east wall run nearer true north and are drawn as OSM has them).
 * The origin is the area centroid of OSM way/58253291 (-86.1856651,
 * 39.8260336). The museum sits on the bluff above the White River: the
 * map's terrain under the outline runs from about 8 m (a sunken service
 * court south of the galleries) to 15.5 m (the entrance drive) above the
 * lowest point in the area. y = 0 is that sunken ground, 224.45 m (lidar
 * reference 216.45 + 8.0); the entrance drive and plaza are at G = 7.5.
 * The uphill walls run down to y = 0 and sink into the bluff.
 *
 * Identity (from the photos below):
 *  1. The round glass entrance pavilion (2005) on the south-east: a glass
 *     drum ringed by four thin aluminium brims, under a wide louvred halo
 *     on radial beams, with the doors under a flat canopy.       (SE)
 *  2. The tall pale limestone gallery blocks behind it, nearly
 *     windowless, with thin metal string bands, a strip of windows at
 *     the ends, and a thin overhanging roof edge.            (SE, E)
 *  3. The dark diamond-tiled zinc wall the pavilion is set against. (SE)
 *  4. The low sprawl of stone blocks stepping down to the west, where a
 *     terrace looks over the amphitheatre.           (NAIP, lidar)
 *
 * Sources
 * - OSM (ODbL): way/58253291 (building=yes, "Indianapolis Museum of
 *   Art"), the whole building in one outline; no heights or parts.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid, read in this frame (reference 216.45 m; model z =
 *   lidar - 8.0). Measured: the central 1970 block 38.4 with its raised
 *   middle 43.4; the east gallery block 41.3..41.8; the south block 32.0;
 *   the pavilion's halo 32.6..33.0; the south-west blocks 29.3..31.9 and
 *   25.8..26.9; the west terrace and north-west wings 20.0; the north
 *   blocks 26.1..28.8 and 33.0; the east wing 20.4..26.3 (many dark roofs
 *   return nothing: heights there are from the edges); the entrance drive
 *   15.5.
 * - Mapterhorn terrain (tools/terrain.ts grid, bearing 7): ground 8.1..16
 *   under the outline, the entrance drive 15.5.
 * - USGS NAIP orthophoto (public domain): the plan of the blocks, the
 *   halo's ring, the pale and dark roofs.
 * - Photos (Wikimedia Commons, all of the entrance side):
 *   "Indianapolis Museum of Art - August 2014 - Donna Block.jpg"
 *   (donna_0622, CC BY 2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Museum_of_Art_-_August_2014_-_Donna_Block.jpg),
 *   the pavilion's brims, halo, canopy, the zinc wall;
 *   "Indy-Art-Museum-Szmurlo.jpg" (Csz, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:Indy-Art-Museum-Szmurlo.jpg),
 *   the pavilion against the limestone blocks, the bands, the eaves;
 *   "Indianapolis Museum of Art - July 2009 - Valerie Everett.jpg"
 *   (Valerie Everett, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Museum_of_Art_-_July_2009_-_Valerie_Everett.jpg)
 *   and "Indianapolis Museum of Art -33.jpg" (hibino, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Museum_of_Art_-33.jpg),
 *   the pavilion head-on and from the south.
 *
 * Estimated: the pavilion's drum (r 13.5) and brim levels (G+3.8, +6.8,
 *   +9.8, +12.9; halo to G+17) from the photos against the lidar halo
 *   height; the halo's radius is the OSM arc (fit r 18.6). The string
 *   bands' levels and the window strips, from the photos. The block
 *   boundaries come from lidar steps and the aerial, simplified.
 * Doubts: only the entrance (south-east) side is photographed; the west,
 *   north and east walls are drawn plain stone from the aerial and lidar.
 *   Dark roofs gave no lidar returns, so some block heights are read from
 *   their edges. The north blocks' split is simplified.
 * Left out: the louvres in the brims and halo (drawn solid), the hanging
 *   rods, the "INDIANAPOLIS MUSEUM OF ART" lettering on the glass, the
 *   diamond pattern of the zinc, rooftop plant, the amphitheatre.
 * Night: the pavilion's glass glows (`window`); the stone is unlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, ccw, flatShape, arc, lathe, finishGlb, writeModel, type Face } from './sea-tacoma-union-station'

const stone = new Part(), roof = new Part(), win = new Part(), alu = new Part(), zinc = new Part(), eaveP = new Part()

const G = 7.5 // the entrance drive above y = 0

/** A block over a polygon: stone walls from 0, a roof cap. */
function block(r: XY[], h: number, wall: Part = stone) {
  prism(wall, roof, ccw(r), 0, h, 30)
}
/** A thin overhanging roof edge around a block, `o` metres out. */
function eave(r: XY[], h: number, o: number, t = 0.7) {
  const p = ccw(r)
  const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length
  // offset each edge outward and intersect neighbours (convex blocks only)
  const out: XY[] = p.map((q, i) => {
    const a = p[(i - 1 + p.length) % p.length], b = p[(i + 1) % p.length]
    const n1 = nrm([q[1] - a[1], a[0] - q[0]]), n2 = nrm([b[1] - q[1], q[0] - b[0]])
    const m = nrm([n1[0] + n2[0], n1[1] + n2[1]]), k = o / Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k]
  })
  prism(eaveP, null, out, h - t, h, 30)
  // a low hipped roof over it, rising 1.2 m to an inset ring
  const inset: XY[] = out.map(([x, y]) => [cx + (x - cx) * 0.8, cy + (y - cy) * 0.8])
  for (let i = 0; i < out.length; i++) {
    const j = (i + 1) % out.length
    roof.quad([out[i][0], out[i][1], h], [out[j][0], out[j][1], h], [inset[j][0], inset[j][1], h + 1.2], [inset[i][0], inset[i][1], h + 1.2])
  }
  for (let i = 1; i < inset.length - 1; i++) roof.tri([inset[0][0], inset[0][1], h + 1.2], [inset[i][0], inset[i][1], h + 1.2], [inset[i + 1][0], inset[i + 1][1], h + 1.2])
  // the underside
  for (let i = 1; i < out.length - 1; i++) eaveP.tri([out[0][0], out[0][1], h - t], [out[i + 1][0], out[i + 1][1], h - t], [out[i][0], out[i][1], h - t])
}
function nrm(v: XY): XY { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** A face on edge a→b of a counter-clockwise ring (outward to the right). */
function faceOf(a: XY, b: XY): { f: Face; L: number } {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { f: { o: [a[0], a[1], 0], n: [t[1], -t[0]] }, L }
}
/** String bands (flush aluminium strips) on every edge of a block. */
function bands(r: XY[], levels: number[], t = 0.45) {
  const p = ccw(r)
  for (let i = 0; i < p.length; i++) {
    const { f, L } = faceOf(p[i], p[(i + 1) % p.length])
    if (L < 2) continue
    for (const z of levels) flatShape(alu, f, rect(0.15, z, L - 0.15, z + t), 0.06)
  }
}

// ---------------------------------------------------------------- the low base: the whole outline at the terrace level
// (OSM way/58253291 in this frame; the pavilion's arc is cut by a line through its centre)
const PC: XY = [37.5, -47.0] // the pavilion's centre
const base: XY[] = [
  [-69.3, 31.3], [-39.2, 31.6], [-38.3, 62.0], [-13.8, 62.4], [-13.8, 79.7], [21.9, 79.6], [22.2, 69.2], [22.7, 45.4],
  [37.6, 47.0], [46.5, 48.0], [96.4, 53.3], [97.0, 49.6], [100.4, 49.9], [102.5, 46.8], [104.6, 42.7], [105.6, 38.0],
  [105.6, 34.4], [104.9, 32.3], [103.0, 30.0], [100.5, 28.5], [97.8, 27.5], [93.8, 26.9], [93.3, 29.9], [88.2, 29.3],
  [88.8, 23.3], [82.4, 22.9], [54.1, 19.8], [43.5, 19.4], [49.8, -32.4], PC, [24.9, -56.7], [22.9, -56.7],
  [22.5, -81.5], [15.2, -81.4], [15.5, -75.0], [-15.6, -74.6], [-15.4, -67.6], [-9.0, -67.6], [-9.0, -56.8],
  [-36.3, -56.3], [-36.1, -67.3], [-65.3, -66.3], [-65.2, -38.3], [-69.2, -38.4], [-69.1, -31.1], [-69.2, 23.8],
]
block(base, 12.0)

// ---------------------------------------------------------------- the gallery blocks
// the 1970 central block and its raised middle
const central = rect(-52.0, -27.0, 3.0, 17.0)
block(central, 30.4)
block(rect(-36.0, -21.0, -8.0, 11.0), 35.4)
eave(central, 30.4, 1.0, 0.6)
// the east gallery block, the tallest; its east wall runs nearer true north
const east: XY[] = [[3.0, -36.0], [49.4, -33.5], [43.5, 19.4], [3.0, 17.5]]
block(east, 33.5)
eave(east, 33.5, 1.6)
bands(east, [G + 5.5, G + 11.0, G + 16.5, G + 22.0])
// the south block, west of the pavilion
const south: XY[] = [[-9.0, -36.0], [22.9, -36.0], [22.9, -56.7], [22.5, -81.5], [15.2, -81.4], [15.5, -75.0], [-15.6, -74.6], [-15.4, -67.6], [-9.0, -67.6]]
block(south, 24.0)
eave(rect(-9.0, -75.0, 22.9, -36.0), 24.0, 0.8, 0.6)
bands(south, [G + 5.5, G + 11.0])
// the south-west blocks
block(rect(-65.2, -66.3, -37.0, -31.0), 21.5)
block(rect(-37.0, -56.4, -9.0, -27.0), 18.0)
// the north blocks and the east wing
block([[-13.8, 17.0], [22.6, 17.0], [22.2, 62.0], [-13.8, 62.0]], 19.0)
block([[-13.8, 62.0], [22.2, 62.0], [21.9, 79.6], [-13.8, 79.7]], 22.0)
block([[22.6, 17.0], [44.0, 19.0], [46.5, 48.0], [37.6, 47.0], [22.7, 45.4]], 18.5)
block([[46.5, 48.0], [88.8, 52.5], [88.8, 23.3], [82.4, 22.9], [54.1, 19.8], [43.5, 19.4]], 15.0)

// window strips at the ends of the east block's east wall and the south block's south wall
{
  const { f, L } = faceOf([49.4, -33.5], [43.5, 19.4])
  for (const s of [3.0, L - 6.0]) flatShape(win, f, rect(s, G + 1.0, s + 3.0, 31.0), 0.05)
  const sf = faceOf([-15.6, -74.6], [15.5, -75.0])
  for (const s of [2.0, sf.L - 5.0]) flatShape(win, sf.f, rect(s, G + 1.0, s + 3.0, 22.5), 0.05)
}

// ---------------------------------------------------------------- the zinc wall behind the pavilion
block([[20.5, -50.0], [47.0, -50.0], [49.6, -33.5], [20.5, -36.0]], 24.0, zinc)

// ---------------------------------------------------------------- the glass entrance pavilion
{
  const [cx, cy] = PC
  const R = 13.5, RH = 18.6
  const top = G + 15.6
  // the glass drum on a short plinth, and the solid band under the halo
  lathe(stone, cx, cy, [[R + 0.3, 0], [R + 0.3, G], [0.01, G]], 24)
  lathe(win, cx, cy, [[R, G], [R, top - 1.6]], 24)
  lathe(alu, cx, cy, [[R, top - 1.6], [R, top], [0.01, top]], 24)
  // four brims: thin rings out to R + 3.7
  for (const z of [G + 3.8, G + 6.8, G + 9.8, G + 12.9]) {
    lathe(alu, cx, cy, [[R - 0.05, z - 0.45], [R + 3.6, z - 0.25], [R + 3.7, z + 0.15], [R - 0.05, z + 0.15]], 24)
  }
  // the halo: a louvred ring on beams, rising outward, with a rim
  lathe(alu, cx, cy, [[R - 1.0, top - 0.6], [RH - 0.5, top + 0.4], [RH, top + 1.6], [RH - 0.5, top + 1.6], [R - 1.0, top]], 24)
  // radial beams over the halo
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 2 * Math.PI + 0.13, c = Math.cos(a), s = Math.sin(a), w = 0.35
    const P = (r: number, t: number, z: number): V3 => [cx + c * r - s * t, cy + s * r + c * t, z]
    const r0 = R - 1.5, r1 = RH - 0.2
    const pts: [number, number][] = [[r0, top], [r1, top + 1.4], [r1, top + 1.9], [r0, top + 0.9]]
    for (let i = 0; i < 4; i++) {
      const [ra, za] = pts[i], [rb, zb] = pts[(i + 1) % 4]
      zinc.quad(P(ra, -w, za), P(rb, -w, zb), P(rb, w, zb), P(ra, w, za))
    }
    zinc.quad(P(r0, w, top), P(r1, w, top + 1.4), P(r1, w, top + 1.9), P(r0, w, top + 0.9))
    zinc.quad(P(r0, -w, top + 0.9), P(r1, -w, top + 1.9), P(r1, -w, top + 1.4), P(r0, -w, top))
  }
  // the entrance canopy on the drive, facing south-east, over the doors
  const a = (-50 * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  const P = (r: number, t: number, z: number): V3 => [cx + c * r - s * t, cy + s * r + c * t, z]
  const r0 = R - 0.2, r1 = R + 4.5, w = 7.0, z0 = G + 3.4, z1 = G + 3.9
  const C = [P(r0, -w, z0), P(r1, -w, z0), P(r1, w, z0), P(r0, w, z0)], D = [P(r0, -w, z1), P(r1, -w, z1), P(r1, w, z1), P(r0, w, z1)]
  alu.quad(D[0], D[1], D[2], D[3]); alu.quad(C[3], C[2], C[1], C[0])
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; alu.quad(C[i], C[j], D[j], D[i]) }
}

const limestone = finish('indy-nf-limestone', 0xe8dfcf)
const built = finishGlb('Newfields (Indianapolis Museum of Art)', [
  { part: stone, material: limestone },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: alu, material: finish('indy-nf-aluminium', 0xd3d6d8) },
  { part: zinc, material: finish('indy-nf-zinc', 0x6c7279) },
  { part: eaveP, material: finish('indy-nf-eave', 0x8e949a) },
], { bearing: 7, height: 37, replaces: ['way/58253291'] }, 5000)
await writeModel('indy-newfields', built)
