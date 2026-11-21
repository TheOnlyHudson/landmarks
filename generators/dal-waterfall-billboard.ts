/**
 * Dallas Waterfall Billboard (1962, Tracy-Locke with Uhler and Company, for
 * Pearl Brewing; rebuilt 2008 by Rock-Scapes), Goat Hill, 3303 Harry Hines
 * Boulevard, Dallas. Original procedural geometry, CC0-1.0.
 *
 *   bun generators/dal-waterfall-billboard.ts
 *
 * Map frame: x east, y north, z up, metres. The model is built with the
 * faces toward -y (south) and read left to right along +x. Bearing 67 turns
 * the faces to 247° (west-south-west, toward I-35E) and the reading
 * direction to 157°, the line of the two panels' lit tops in the NAIP
 * orthophoto. The origin is the middle of the rock in that photo
 * (32.79680, -96.81405), on the hilltop behind the screened fence. OSM
 * has no feature for the sign, so it replaces nothing.
 *
 * Identity: a craggy pale limestone cliff with a waterfall spilling down a
 * dark wet notch in its middle, between two big billboard panels. The
 * current tenant is Coors: "Coors Light" with a can on the left panel and
 * the red "Coors" script on the right.
 *
 * Lettering: STYLE.md's famous-sign exception. The "Coors" script on the
 * right panel is traced from w1's centre-lines with `lettering.ts`. The
 * left panel's can is a plain silver shape, with no lettering.
 *
 * Night: the waterfall is `neon-waterfall`, a pale aqua-white that glows
 * after dark (the user asked for a glowing waterfall). The real fall is
 * floodlit, and photos of it show it bright against the dark rock. The
 * panel faces and their letters carry `_FLOODLIGHT`, as billboards are
 * lit from below.
 *
 * Evidence:
 *  - Published (Wikipedia, "Dallas Waterfall Billboard"; Texas Highways;
 *    Clear Channel Outdoor's blog): built 1962, about 45 ft (13.7 m)
 *    high and about 150 ft (46 m) long. The water falls 45 ft into a pool
 *    3–4 ft deep and is recirculated. City of Dallas "Extraordinarily
 *    Significant Sign" (2008). Leased to Coors.
 *  - USGS NAIP orthophoto (public domain): two bright panel tops about
 *    12–15 m long, with an 11.5 m grey rock mass between them. The whole
 *    run is 38.5 m at 157°.
 *  - w1 "Dallas Waterfall Billboard.jpg", Jrihani, CC BY-SA 4.0, 26 July
 *    2018, from I-35E to the south-west (camera 32.79598, -96.81552):
 *    https://commons.wikimedia.org/wiki/File:Dallas_Waterfall_Billboard.jpg
 *    Scaled at 35 px/m from the published 45 ft rock height and the NAIP
 *    length: panels 13.5 m wide and 9.4 m tall, their bottoms 3.6 m above the
 *    fence foot; the rock 12 m wide with its top at 13 m. The waterfall
 *    leaves its notch at 10.5 m, 3.6 m wide, widening to about 4.4 m
 *    at the pool, about 2.6 m up. The stone base wall is 3.6 m high.
 *
 * Estimated: the depths (panels 0.6 m on a 3.6 m deep stone base, the
 * rock 5.5 m deep, from the NAIP rock mass), the block layout of the rock
 * (a simplified reading of w1), and the right end, which is drawn as a
 * mirror of the left. The ~39 m length follows NAIP rather than the
 * "approximately 150 ft" published.
 * Left out: the screened chain-link fence in front, the catwalks and
 * lights, the vinyl art on the back (Kyle Steed, 2017), and the Coors
 * Light ad's ice and mountain backdrop, drawn as one pale face colour.
 * Doubts: only one open photo, from one side. The back and the ends are
 * plain, and the tenant's artwork changes. Miller Lite and Topo Chico
 * have run here since 2018, so the ad shown is the Coors one the user
 * asked for.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const ROCK = finish('rockscape', 0xd9caa8)
const WET = finish('rockscape-wet', 0x8d8676)
const FACE = finish('billboard-face', 0xe2e9ef, 0.6)
const CAN = finish('billboard-can', 0xf1f1ee, 0.5)
const RED = finish('coors-red', 0xc9443c, 0.6)
const WATER = finish('neon-waterfall', 0xdcebf2, 0.3)

const rock = new Part(), wet = new Part(), face = new Part(), can = new Part(), red = new Part(), water = new Part()

/** A box with its top edges chamfered by b; faces counter-clockwise from outside. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.35) {
  b = Math.min(b, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 2)
  const r = (i: number, z: number): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  p.loft([r(0, z0), r(0, z1 - b), r(b, z1)])
  p.cap(r(b, z1), true)
}

// ---------------------------------------------------------------- base
const PW = 13.5, RW = 12, HALF = RW / 2 + PW // 19.5
const FY = -1.0 // the panels' face plane
const PZ0 = 3.6, PZ1 = 13.0
// The stone base wall under the whole run, in short blocks so its top
// steps a little as in w1.
const baseTops = [3.4, 3.6, 3.3, 3.7, 3.5, 3.8, 4.1, 4.4, 4.0, 4.3, 3.9]
for (let i = 0; i < baseTops.length; i++) {
  const x0 = -HALF + (2 * HALF * i) / baseTops.length, x1 = -HALF + (2 * HALF * (i + 1)) / baseTops.length
  block(rock, x0, x1, FY - 0.8 - (i % 2) * 0.3, 2.6, 0, baseTops[i], 0.3)
}

// ---------------------------------------------------------------- panels
/** A billboard panel: a lit face toward -y, metal sides and back. */
function panel(x0: number, x1: number) {
  const y0 = FY, y1 = FY + 0.6
  // Face.
  face.quad([x0, y0, PZ0], [x1, y0, PZ0], [x1, y0, PZ1], [x0, y0, PZ1])
  // Sides, top, bottom and back in the wet-rock grey of the steel.
  wet.quad([x1, y0, PZ0], [x1, y1, PZ0], [x1, y1, PZ1], [x1, y0, PZ1])
  wet.quad([x0, y1, PZ0], [x0, y0, PZ0], [x0, y0, PZ1], [x0, y1, PZ1])
  wet.quad([x0, y0, PZ1], [x1, y0, PZ1], [x1, y1, PZ1], [x0, y1, PZ1])
  wet.quad([x0, y1, PZ0], [x1, y1, PZ0], [x1, y0, PZ0], [x0, y0, PZ0])
  wet.quad([x1, y1, PZ0], [x0, y1, PZ0], [x0, y1, PZ1], [x1, y1, PZ1])
  // Two posts behind, down to the base.
  for (const x of [x0 + PW * 0.25, x1 - PW * 0.25]) block(wet, x - 0.3, x + 0.3, y1, y1 + 0.6, 2, PZ0 + 6, 0.05)
}
panel(-HALF, -RW / 2)
panel(RW / 2, HALF)

// Letter and art placement on a face: u from the panel's left edge, v up
// from its bottom, w out of the face.
const onPanel = (x0: number) => (u: number, v: number, w: number): V3 => [x0 + u, FY - w, PZ0 + v]

// The left panel's can: a tilted silver can with a rounded top, leaning
// right, from w1 (px 465–660 wide, 355–620 tall, about 15° off upright).
{
  const place = onPanel(-HALF)
  const cx = 5.4, cy = 4.9, hw = 2.6, hh = 3.6, tilt = (-15 * Math.PI) / 180
  const pts: Pt[] = []
  // Body corners, rounded on the shoulders, counter-clockwise.
  const corner = (sx: number, sy: number, r: number, a0: number) => {
    for (let k = 0; k <= 3; k++) {
      const a = a0 + (k / 3) * (Math.PI / 2)
      pts.push([sx + r * Math.cos(a), sy + r * Math.sin(a)])
    }
  }
  corner(hw - 0.3, -hh + 0.3, 0.3, -Math.PI / 2)
  corner(hw - 0.9, hh - 0.9, 0.9, 0)
  corner(-hw + 0.9, hh - 0.9, 0.9, Math.PI / 2)
  corner(-hw + 0.3, -hh + 0.3, 0.3, Math.PI)
  const rot = ([x, y]: Pt): Pt => [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
  const ring = pts.map(rot)
  // Clip to the panel (the can runs off its bottom edge in w1).
  const clip = ring.map(([u, v]): Pt => [Math.min(PW - 0.05, Math.max(0.05, u)), Math.min(9.35, Math.max(0.05, v))])
  const c = place(cx, cy, 0.04)
  for (let i = 0; i < clip.length; i++) {
    const a = place(clip[i][0], clip[i][1], 0.04), b = place(clip[(i + 1) % clip.length][0], clip[(i + 1) % clip.length][1], 0.04)
    can.tri(c, a, b)
  }
  // The can's own red "Coors", the panel script at a third of its size,
  // across the can's shoulder and turned with it.
  const k = 0.32, mini = coorsPen().paths.map((path) => path.map(([u, v]): Pt => rot([(u - 7) * k, (v - 2.8) * k + 1.4])))
  strokes(red, mini, { width: 0.3, depth: 0.06, place: (u, v, w) => place(u, v, 0.04 + w) })
}

// The right panel's "Coors" script, traced from w1 (u = (px - 1225) / 38.9,
// v = (800 - py) / 37 - 3.6).
function coorsPen() {
  const pen = new Pen()
  // C: from the top flag, over and down round the bowl to the foot.
  pen.moveTo([3.3, 4.4]).cubicTo([2.8, 5.2], [1.5, 5.0], [1.0, 3.6]).cubicTo([0.6, 2.2], [1.2, 0.8], [2.2, 0.8]).quadTo([3.0, 0.8], [3.5, 1.4])
  pen.moveTo([2.9, 4.9]).quadTo([3.6, 4.9], [3.6, 4.2], 4)
  pen.circle([5.0, 2.0], 0.85, 1.1, 14)
  pen.circle([7.45, 2.0], 0.85, 1.1, 14)
  // r: stem, then the shoulder.
  pen.moveTo([9.1, 0.8]).lineTo([9.2, 3.0]).quadTo([9.7, 3.4], [10.3, 3.1]).quadTo([10.7, 2.9], [10.6, 2.6])
  // s: top hook, the spine, the foot.
  pen.moveTo([12.9, 3.0]).cubicTo([12.4, 3.5], [11.3, 3.2], [11.5, 2.4]).cubicTo([11.7, 1.8], [12.9, 1.9], [12.7, 1.1]).cubicTo([12.5, 0.5], [11.4, 0.6], [11.2, 1.0])
  return pen
}
strokes(red, coorsPen().paths, { width: 0.7, depth: 0.1, place: onPanel(RW / 2) })

// ---------------------------------------------------------------- rock
// The cliff: two craggy piers either side of the falls and a lintel over
// the notch, built up from chamfered blocks (x0, x1, y0, y1, z0, z1).
const crags: [number, number, number, number, number, number][] = [
  // left pier, bottom to top
  [-6.6, -2.9, -2.6, 3.2, 0, 7.4],
  [-6.3, -3.0, -2.2, 2.8, 7.4, 10.6],
  [-6.4, -4.2, -1.8, 2.4, 10.4, 12.3],
  [-4.6, -2.6, -2.0, 2.4, 10.4, 12.9],
  [-6.9, -5.3, -1.6, 1.6, 4.0, 9.4],
  // right pier
  [2.9, 6.6, -2.6, 3.2, 0, 7.8],
  [3.0, 6.3, -2.2, 2.8, 7.8, 10.6],
  [2.6, 4.8, -1.9, 2.4, 10.4, 13.0],
  [4.6, 6.5, -1.6, 2.2, 10.4, 12.1],
  [5.2, 6.9, -1.6, 1.6, 4.2, 9.0],
  // lintel over the notch, and its crest
  [-3.2, 3.2, -0.6, 2.6, 10.5, 12.4],
  [-1.8, 2.0, 0.2, 2.4, 12.4, 13.1],
]
for (const c of crags) block(rock, ...c, 0.45)

// The notch: a wide dark wet recess behind the falls (about 7.7 m across
// in w1, the water a little right of its middle), with wet ledges either
// side of the sheet and the lip it spills from.
block(wet, -3.0, 3.0, -0.7, 1.2, 0, 10.6, 0.1)
block(wet, -3.0, -1.9, -1.7, 0, 2.6, 8.4, 0.3)
block(wet, -3.0, -2.2, -1.9, 0, 8.4, 10.5, 0.25)
block(wet, 2.0, 3.0, -1.6, 0, 2.6, 6.8, 0.3)
block(wet, 2.2, 3.0, -1.8, 0, 6.8, 10.5, 0.25)
block(wet, -2.0, 2.0, -1.2, 0.0, 10.2, 10.6, 0.15)

// ---------------------------------------------------------------- water
// The sheet leaves the lip at 10.5 m and bows out as it falls into the
// pool at 2.6 m, widening from 3.6 to 4.4 m. Both sides are drawn so it reads
// from behind the lip too.
{
  const N = 8
  const at = (t: number) => {
    const z = 10.5 - t * (10.5 - 2.6)
    const hw = 1.8 + 0.4 * t
    const y = -1.3 - 0.9 * Math.sin(t * Math.PI * 0.6)
    return { z, hw, y }
  }
  for (let k = 0; k < N; k++) {
    const a = at(k / N), b = at((k + 1) / N)
    const A0: V3 = [-a.hw, a.y, a.z], A1: V3 = [a.hw, a.y, a.z], B0: V3 = [-b.hw, b.y, b.z], B1: V3 = [b.hw, b.y, b.z]
    water.quad(B0, B1, A1, A0)
    water.quad(A0, A1, B1, B0)
  }
  // The pool's foam: a low pale mound where the water lands, on the base.
  block(water, -2.6, 2.6, -3.0, -0.9, 2.0, 3.1, 0.4)
}

// ---------------------------------------------------------------- write
const lit = (_p: V3, n: V3) => (n[1] < -0.5 ? 1 : 0)
const list = [
  { part: rock, material: ROCK },
  { part: wet, material: WET },
  { part: face, material: { ...FACE, floodlight: lit } },
  { part: can, material: { ...CAN, floodlight: lit } },
  { part: red, material: { ...RED, floodlight: lit } },
  { part: water, material: WATER },
]
const tris = list.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Dallas Waterfall Billboard', list, {
  title: 'Dallas Waterfall Billboard',
  license: 'CC0-1.0',
  source: 'generators/dal-waterfall-billboard.ts',
})
const out = process.argv[2] ?? new URL('../models/dal-waterfall-billboard.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
