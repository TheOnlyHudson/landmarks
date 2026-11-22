/**
 * Victory Field (1996, HOK Sport), 501 West Maryland Street, Indianapolis,
 * home of the Indianapolis Indians: procedural, CC0-1.0.
 * bun generators/indy-victory-field.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of the grandstand outline way/113047379 (building=stadium,
 * -86.1689096, 39.7645514). The stands wrap the field on the west (third
 * base) and south (first base) sides, home plate at their inner corner
 * near (-14, -8), and the outfield opens to the north-east.
 *
 * The stands only: the field and the lawn are the map's (STYLE.md). z = 0 is
 * the playing field, the lowest ground under the outline (lidar ground_min
 * + 0.8 m); the field is sunk about 4 m below West Street on the west, so
 * the west wall runs into the ground there. Elevation stays 0.
 *
 * How it is built: the grandstand is lofted along stations, each a pair of
 * points read off the OSM outline (the field-side edge and the outer edge),
 * with one section per station:
 *   - the padded field wall to 1.2 m and the lower bowl rising to 3.2 m over
 *     12 m (lidar: 1.0 at the wall to 2.6-2.8 at the top);
 *   - the main concourse at 3.2 m, at street level on the west;
 *   - behind the infield, the upper deck: its fascia to 8.5 m (lidar 8-9 m
 *     band, 4-6 m deep), seats rising to 13 m under the canopy, a 13 m roof
 *     at the back (lidar 12.3-12.9 m) and the brick outer wall;
 *   - the canopy over the upper deck, 18.6 m at its front edge falling to
 *     17.4 m at the back (lidar 17.5-19.2 m), from about 20 m behind the
 *     field wall to the back, west arm and the curve behind home, and the
 *     south arm to x 70 (lidar extent of the >16 m returns);
 *   - beyond the canopy (the north end of the west arm, and the south arm
 *     past x 70) a low block at 8 m (lidar 8-9 m), and at the east end the
 *     low party terraces at 4.5 m (lidar 4-5 m).
 *   - Eight light towers, 33-35 m to the top of the light banks (lidar
 *     peaks): four rising through the stands, four in the outfield; the
 *     banks face the field.
 *   - The video scoreboard in right-centre field (lidar 11-16 m block about
 *     (84, 74)), faced toward home plate.
 *
 * Sources
 * - OSM (ODbL): way/113047379 (building=stadium, the stands), inside the
 *   venue area way/989724577 (leisure=stadium, not a building).
 * - USGS lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016), 1 m
 *   grid over the park: every height above is measured from it.
 * - USGS NAIP orthophoto (public domain): the plan, the canopy (pale teal
 *   top), the white roofs behind it, the dark green seats.
 * - Photos (Wikimedia Commons):
 *   "Victory Field panorama, 2019.jpg" (styrofoamjes, CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Victory_Field_panorama,_2019.jpg),
 *   from behind first base: the canopy with its steel trusses, the light
 *   towers, the scoreboard;
 *   "Victory Field Left Field.jpg" (Yonikasz, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Victory_Field_Left_Field.jpg),
 *   the third-base stands: lower bowl, upper deck, the suite band, the dark
 *   green canopy;
 *   "Victory Field - 2011-06-18.jpg" (Chad Bowman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Victory_Field_-_2011-06-18.jpg),
 *   the Center Field Gate: dark red brick piers with limestone caps and
 *   green steel, the colours of the outer walls.
 * Estimated: the outer walls' brick-and-cap treatment (the street sides are
 *   unphotographed apart from the gate), the scoreboard's size and facing,
 *   the canopy struts.
 * Left out: the arched Center Field Gate sign (off the outline), the lawn,
 *   the bullpens, the netting, the seat aisles.
 * Night: the light banks are `lamp`; the suite band and the scoreboard are
 *   `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { poly } from './indy-st-john-the-evangelist'

const green = new Part(), canopy = new Part(), brick = new Part(), stone = new Part(), win = new Part(), lamp = new Part()

/** A quad a-b-c-d (any winding), facing `hint`. */
const quad = (part: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) => poly(part, [a, b, c, d], hint)

// ---------------------------------------------------------------- stations
// Each station: field-side point, outer point (OSM outline), and its kind:
// 'c' canopy section, 'l' low block (8 m), 't' terraces (4.5 m).
type Kind = 'c' | 'l' | 't'
const ST: [XY, XY, Kind][] = [
  [[3.0, 93.0], [-13.0, 95.0], 'l'],
  [[-0.5, 77.2], [-41.0, 78.0], 'l'],
  [[-8.0, 62.0], [-49.0, 62.0], 'c'],
  [[-16.1, 46.6], [-56.0, 44.0], 'c'],
  [[-22.5, 22.0], [-61.5, 20.0], 'c'],
  [[-28.0, 0.6], [-64.0, 3.0], 'c'],
  [[-27.1, -8.1], [-63.6, -11.0], 'c'],
  [[-23.0, -13.5], [-57.9, -24.3], 'c'],
  [[-17.0, -17.3], [-48.7, -37.3], 'c'],
  [[-9.0, -18.9], [-37.0, -46.6], 'c'],
  [[2.3, -19.7], [-15.0, -53.0], 'c'],
  [[16.0, -21.0], [16.0, -56.5], 'c'],
  [[35.0, -21.6], [35.0, -57.0], 'c'],
  [[52.0, -19.6], [52.0, -55.8], 'c'],
  [[70.0, -18.0], [70.0, -54.5], 'l'],
  [[82.6, -21.3], [85.0, -47.0], 't'],
  [[99.2, -13.8], [112.6, -28.3], 't'],
]

const L1 = 12 // lower bowl depth
const BOWL = 3.2, WALL = 1.2
/** The section at a station: (d, z) points from the field wall round to the outer wall's foot. */
function section(kind: Kind, D: number): XY[] {
  if (kind === 'c') return [[0, 0], [0, WALL], [L1, BOWL], [L1 + 3, BOWL], [L1 + 3, 8.5], [D - 6, 13], [D, 13], [D, 0]]
  if (kind === 'l') return [[0, 0], [0, WALL], [L1, BOWL], [L1 + 3, BOWL], [L1 + 3, 8], [D - 6, 8], [D, 8], [D, 0]]
  return [[0, 0], [0, WALL], [L1, BOWL], [L1 + 3, BOWL], [L1 + 3, 4.5], [D - 6, 4.5], [D, 4.5], [D, 0]]
}
// which Part each section segment goes in (k = segment from point k to k+1)
function segPart(k: number, kind: Kind): Part {
  if (k === 0) return green
  if (k === 1) return green
  if (k === 2) return stone
  if (k === 3) return kind === 'c' ? stone : brick
  if (k === 4) return kind === 'c' ? green : stone
  if (k === 5) return stone
  return brick
}

const P3 = (st: [XY, XY, Kind], d: number, z: number): V3 => {
  const [I, O] = st
  const D = Math.hypot(O[0] - I[0], O[1] - I[1])
  const t = d / D
  return [I[0] + (O[0] - I[0]) * t, I[1] + (O[1] - I[1]) * t, z]
}
const depth = (st: [XY, XY, Kind]) => Math.hypot(st[1][0] - st[0][0], st[1][1] - st[0][1])

// the stands, lofted
for (let i = 0; i + 1 < ST.length; i++) {
  const a = ST[i], b = ST[i + 1]
  const kind: Kind = a[2] === 'c' && b[2] === 'c' ? 'c' : a[2] === 't' || b[2] === 't' ? 't' : 'l'
  const sa = section(a[2] === 'c' && kind !== 'c' ? kind : a[2], depth(a))
  const sb = section(b[2] === 'c' && kind !== 'c' ? kind : b[2], depth(b))
  // field-ward direction for normals
  const mid = P3(a, 0, 0), out = P3(a, depth(a), 0)
  const inward: V3 = [mid[0] - out[0], mid[1] - out[1], 0]
  for (let k = 0; k + 1 < sa.length; k++) {
    const A = P3(a, sa[k][0], sa[k][1]), B = P3(a, sa[k + 1][0], sa[k + 1][1])
    const C = P3(b, sb[k + 1][0], sb[k + 1][1]), D = P3(b, sb[k][0], sb[k][1])
    const dz = sa[k + 1][1] - sa[k][1], dd = sa[k + 1][0] - sa[k][0]
    const h: V3 = k === 6 ? [-inward[0], -inward[1], 0] : dz > 0 ? [inward[0], inward[1], Math.max(dd, 0) * 2] : [0, 0, 1]
    quad(segPart(k, kind), A, B, C, D, h)
  }
  // the suite band and canopy over canopy bays
  if (kind === 'c') {
    // the club / suite glazing on the upper deck's fascia
    const w0 = P3(a, L1 + 3 - 0.05, 4.6), w1 = P3(b, L1 + 3 - 0.05, 4.6)
    quad(win, w0, w1, [w1[0], w1[1], 7.6], [w0[0], w0[1], 7.6], inward)
    const Da = depth(a), Db = depth(b)
    const FR = 18.6, BK = 17.4, T = 0.5
    const f0 = P3(a, L1 + 10, FR), f1 = P3(b, L1 + 10, FR)
    const k0 = P3(a, Da + 0.6, BK), k1 = P3(b, Db + 0.6, BK)
    quad(canopy, f0, f1, k1, k0, [0, 0, 1])
    const lift = (p: V3, dz: number): V3 => [p[0], p[1], p[2] - dz]
    quad(green, lift(f0, T), lift(f1, T), lift(k1, T), lift(k0, T), [0, 0, -1])
    quad(green, f0, f1, lift(f1, T), lift(f0, T), inward)
    quad(green, k0, k1, lift(k1, T), lift(k0, T), [-inward[0], -inward[1], 0])
    // the suite glass band: from the back roof (13 m) up to the canopy, set in 1 m
    const g0 = P3(a, Da - 1, 13), g1 = P3(b, Db - 1, 13)
    quad(win, g0, g1, [g1[0], g1[1], BK - T], [g0[0], g0[1], BK - T], [-inward[0], -inward[1], 0])
    // the limestone cap on the outer wall
    const c0 = P3(a, Da + 0.25, 12.2), c1 = P3(b, Db + 0.25, 12.2)
    quad(stone, c0, c1, [c1[0], c1[1], 13.2], [c0[0], c0[1], 13.2], [-inward[0], -inward[1], 0])
  } else {
    const Da = depth(a), Db = depth(b), H = kind === 'l' ? 8 : 4.5
    const c0 = P3(a, Da + 0.25, H - 0.9), c1 = P3(b, Db + 0.25, H - 0.9)
    quad(stone, c0, c1, [c1[0], c1[1], H + 0.1], [c0[0], c0[1], H + 0.1], [-inward[0], -inward[1], 0])
    if (kind === 'l') {
      // a glazed band along the low block's field-side fascia (the club and concession fronts)
      const w0 = P3(a, L1 + 3 - 0.05, 4.4), w1 = P3(b, L1 + 3 - 0.05, 4.4)
      quad(win, w0, w1, [w1[0], w1[1], 7.0], [w0[0], w0[1], 7.0], inward)
    }
  }
}
// the canopy's struts: slim posts at the front of the upper deck, every other station
for (let i = 2; i < ST.length; i += 2) {
  const a = ST[i]
  if (a[2] !== 'c') continue
  const p = P3(a, L1 + 10.5, 0)
  box(green, null, p[0] - 0.25, p[1] - 0.25, p[0] + 0.25, p[1] + 0.25, 10.5, 17.8)
}
// the brick piers on the outer wall at each station
for (const a of ST) {
  if (a[2] === 't') continue
  const p = P3(a, depth(a) + 0.3, 0)
  const H = a[2] === 'c' ? 12.2 : 7.1
  box(brick, stone, p[0] - 0.9, p[1] - 0.9, p[0] + 0.9, p[1] + 0.9, 0, H + 0.6)
}
// end caps: the first and last sections as walls
for (const [st, sgn] of [[ST[0], -1], [ST[ST.length - 1], 1]] as [[XY, XY, Kind], number][]) {
  const s = section(st[2], depth(st))
  const pts = s.map(([d, z]) => P3(st, d, z))
  const nb = sgn < 0 ? ST[1] : ST[ST.length - 2]
  const away: V3 = [st[0][0] - nb[0][0], st[0][1] - nb[0][1], 0]
  // fan from the outer foot
  for (let k = 1; k + 1 < pts.length - 1; k++) poly(brick, [pts[pts.length - 1], pts[k], pts[k + 1]], away)
}

// ---------------------------------------------------------------- light towers
const FIELD: XY = [40, 40] // what the banks face
const TOWERS: [number, number, number][] = [
  [-39.5, 59.5, 34.9], [-49.5, 25.5, 34.3], [-2.5, -45.5, 34.4], [35.5, -49.5, 34.7],
  [32.5, 109.5, 32.9], [83.5, 95.5, 32.7], [105.5, 49.5, 32.7], [105.5, 2.5, 32.8],
]
for (const [x, y, top] of TOWERS) {
  const z0 = Math.hypot(x, y) < 75 ? 13 : 0 // the stand towers stand on the roof
  box(stone, null, x - 0.45, y - 0.45, x + 0.45, y + 0.45, z0, top - 3.0)
  // the bank: a frame 7 m wide, 3.6 m tall, facing the field, lamp face toward it
  const ux = FIELD[0] - x, uy = FIELD[1] - y, L = Math.hypot(ux, uy)
  const n: V3 = [ux / L, uy / L, 0], s: V3 = [-uy / L, ux / L, 0]
  const W = 4.2, H0 = top - 4.4, H1 = top
  const at = (u: number, v: number, z: number): V3 => [x + s[0] * u + n[0] * v, y + s[1] * u + n[1] * v, z]
  quad(lamp, at(-W, 0.5, H0), at(W, 0.5, H0), at(W, 0.5, H1), at(-W, 0.5, H1), n)
  quad(stone, at(-W, -0.3, H0), at(W, -0.3, H0), at(W, -0.3, H1), at(-W, -0.3, H1), [-n[0], -n[1], 0])
  quad(stone, at(-W, -0.3, H1), at(W, -0.3, H1), at(W, 0.5, H1), at(-W, 0.5, H1), [0, 0, 1])
  quad(stone, at(-W, -0.3, H0), at(W, -0.3, H0), at(W, 0.5, H0), at(-W, 0.5, H0), [0, 0, -1])
  for (const e of [-1, 1]) quad(stone, at(e * W, -0.3, H0), at(e * W, 0.5, H0), at(e * W, 0.5, H1), at(e * W, -0.3, H1), [s[0] * e, s[1] * e, 0])
}

// ---------------------------------------------------------------- scoreboard
{
  const cx = 84, cy = 74, HOME: XY = [-14, -8]
  const ux = HOME[0] - cx, uy = HOME[1] - cy, L = Math.hypot(ux, uy)
  const n: V3 = [ux / L, uy / L, 0], s: V3 = [-uy / L, ux / L, 0]
  const at = (u: number, v: number, z: number): V3 => [cx + s[0] * u + n[0] * v, cy + s[1] * u + n[1] * v, z]
  const W = 9, Z0 = 6.5, Z1 = 15
  for (const u of [-5, 5]) {
    const p = at(u, -0.6, 0)
    box(brick, stone, p[0] - 0.8, p[1] - 0.8, p[0] + 0.8, p[1] + 0.8, 0, Z0)
  }
  quad(win, at(-W, 0.45, Z0 + 0.4), at(W, 0.45, Z0 + 0.4), at(W, 0.45, Z1 - 1.6), at(-W, 0.45, Z1 - 1.6), n)
  quad(green, at(-W, 0.4, Z0), at(W, 0.4, Z0), at(W, 0.4, Z1), at(-W, 0.4, Z1), n)
  quad(green, at(-W, -1.6, Z0), at(W, -1.6, Z0), at(W, -1.6, Z1), at(-W, -1.6, Z1), [-n[0], -n[1], 0])
  quad(green, at(-W, -1.6, Z1), at(W, -1.6, Z1), at(W, 0.4, Z1), at(-W, 0.4, Z1), [0, 0, 1])
  quad(green, at(-W, -1.6, Z0), at(W, -1.6, Z0), at(W, 0.4, Z0), at(-W, 0.4, Z0), [0, 0, -1])
  for (const e of [-1, 1]) quad(green, at(e * W, -1.6, Z0), at(e * W, 0.4, Z0), at(e * W, 0.4, Z1), at(e * W, -1.6, Z1), [s[0] * e, s[1] * e, 0])
}

const built = finishGlb('Victory Field', [
  { part: green, material: finish('indy-vf-green', 0x3f5f4c) },
  { part: canopy, material: finish('indy-vf-canopy', 0x6f8c84) },
  { part: brick, material: finish('indy-vf-brick', 0xa0604f) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: lamp, material: finish('lamp-floods', 0xd9dcd6) },
], { bearing: 0, height: 34.9, replaces: ['way/113047379'] }, 5000)
await writeModel('indy-victory-field', built)
