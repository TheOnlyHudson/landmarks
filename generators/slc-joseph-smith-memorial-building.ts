/**
 * Joseph Smith Memorial Building (the Hotel Utah, 1911, Parkinson and
 * Bergstrom; converted 1993), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-joseph-smith-memorial-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * true north-south). The origin is the area centroid of OSM way/32333198
 * (-111.8905119, 40.7698866). y = 0 is the lowest ground under the
 * outline, at the south-west; Mapterhorn rises about 4 m to the north-east
 * corner, so the base's openings start 4.4 m up and the north doors at 3.2 m.
 *
 * Form: an H in plan, from OSM's 13-level part (way/398416950): two
 * 20 m wings running the full 80 m north-south, joined by a centre block,
 * with a deep court opening north (the entrance court, p3) and a shallower
 * one opening south (p1). The two-storey base (OSM's outline, 2 levels)
 * fills both courts. Ten storeys of white terra-cotta over a rusticated
 * base, a heavy bracketed cornice, a glazed attic storey above it and low
 * hipped roofs; the centre block's north face carries a canted bay rising
 * to the square ornamental lantern (the "beehive" cupola) on the roof.
 *
 * OSM: way/32333198 outline (62.5 x 80.5 m, building:colour #afafb4,
 * roof:colour #867d74); way/398416950 the tower part, height 55.5 m,
 * 13 levels, hipped.
 * Estimated from photos: the base 9 m (two tall storeys); the shaft to the
 * cornice at 44 m; the cornice 1.6 m deep; the attic storey 46-50.5 m set
 * back 0.6 m; the roofs low, to 51.6 m (OSM's 55.5 m reads too steep against p1 and
 * p2, where the roof barely shows over the attic); the lantern (see
 * revision 2) over the canted bay (p3), the beehive on top to 65 m;
 * bays about 3.7 m, windows grouped two storeys a panel
 * with a spandrel band between.
 * Left out: balconies, window surrounds and medallions, the cornice
 * brackets, the lettering over the entrance.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Joseph_Smith_Memorial_Building_-_Salt_Lake_City,_Utah_-_2_May_2020.jpg
 *     Beneathtimp, CC0 (from the south-east: the south court and the east side)
 *  p2 https://commons.wikimedia.org/wiki/File:Hotel_Utah_4650.jpg
 *     Chris Light, CC BY-SA 4.0 (the east side, from the gardens)
 *  p3 https://commons.wikimedia.org/wiki/File:Joseph_Smith_Building_-_panoramio.jpg
 *     Jordan W., CC BY-SA 3.0 (into the north court, the lantern above)
 * Lidar: not used.
 *
 * Revision 2 (lead review): the roof is the palette `roof` grey and low
 * (attic top 50.5, ridges 51.6), hidden behind the attic; the cream cornice
 * is heavier (2 m, 1.3 m out); the shaft's windows are panels grouped two
 * storeys each with 1.8 m spandrels (were three tall lifts that read as
 * stripes); the two-storey base is a greyer rusticated stone with a string
 * course, round-headed ground-floor windows on the south front (p1) and
 * square upper-base windows; the lantern is drawn at its size in p3: a
 * lower stage 12 x 9.8 m to 55 m and a square upper stage 7.8 m with corner
 * piers to 62.6 m and the beehive to 65 m (estimated from p3, scaled to the
 * canted bay's 10 m width).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), base = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const grow = (r: XY[], d: number): XY[] => {
  const xs = r.map((p) => p[0]), ys = r.map((p) => p[1])
  return rect(Math.min(...xs) - d, Math.min(...ys) - d, Math.max(...xs) + d, Math.max(...ys) + d)
}
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, l = y1 - y0
  const E = (x: number, y: number): V3 => [x, y, ze]
  if (l >= w) {
    const h = w / 2, xm = x0 + h, A: V3 = [xm, y0 + h, zr], B: V3 = [xm, y1 - h, zr]
    poly(p, [E(x1, y0), E(x1, y1), B, A], [1, 0, 1]); poly(p, [E(x0, y1), E(x0, y0), A, B], [-1, 0, 1])
    poly(p, [E(x0, y0), E(x1, y0), A], [0, -1, 1]); poly(p, [E(x1, y1), E(x0, y1), B], [0, 1, 1])
  } else {
    const h = l / 2, ym = y0 + h, A: V3 = [x0 + h, ym, zr], B: V3 = [x1 - h, ym, zr]
    poly(p, [E(x0, y0), E(x1, y0), B, A], [0, -1, 1]); poly(p, [E(x1, y1), E(x0, y1), A, B], [0, 1, 1])
    poly(p, [E(x0, y1), E(x0, y0), A], [-1, 0, 1]); poly(p, [E(x1, y0), E(x1, y1), B], [1, 0, 1])
  }
}
/** Window panels along a wall from a to b (outward normal n), one per bay, in storey groups. */
function facade(a: XY, b: XY, n: XY, bay: number, lifts: [number, number][], w = 0.34) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nb = Math.max(1, Math.round(L / bay)), step = L / nb
  for (let i = 0; i < nb; i++) {
    const s = step * (i + 0.5), hw = (step * w) / 2
    const c: XY = [a[0] + t[0] * s + n[0] * 0.05, a[1] + t[1] * s + n[1] * 0.05]
    for (const [z0, z1] of lifts) {
      poly(win, [[c[0] - t[0] * hw, c[1] - t[1] * hw, z0], [c[0] + t[0] * hw, c[1] + t[1] * hw, z0],
        [c[0] + t[0] * hw, c[1] + t[1] * hw, z1], [c[0] - t[0] * hw, c[1] - t[1] * hw, z1]], [n[0], n[1], 0])
    }
  }
}
/** Runs facade() over every edge of a counter-clockwise ring. */
function ringFacade(r: XY[], bay: number, lifts: [number, number][], w?: number, skip: number[] = []) {
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    facade(a, b, [dy / l, -dx / l], bay, lifts, w)
  }
}

// ------------------------------------------------------------- the plan ---
const WW: XY[] = rect(-31.2, -40.2, -11.4, 40.2)   // west wing
const EW: XY[] = rect(12.4, -40.2, 31.2, 40.2)     // east wing
const CB: XY[] = rect(-11.4, -19.9, 12.4, 6.5)     // centre block
const Z_BASE = 9, Z_CORN = 44, Z_ATTIC = 50.5, Z_TOP = 51.6
// ten storeys of about 3.5 m, grouped in pairs with a 1.8 m spandrel between
const SHAFT: [number, number][] = [[9.9, 15.1], [16.9, 22.1], [23.9, 29.1], [30.9, 36.1], [37.9, 42.9]]

// The base fills the courts: one block under everything.
const BASE = rect(-31.2, -40.2, 31.2, 40.2)
prism(base, BASE, 0, Z_BASE, true)
prism(trim, grow(BASE, 0.4), Z_BASE - 0.6, Z_BASE + 0.2, false, true)
poly(trim, grow(BASE, 0.4).map(([x, y]) => [x, y, Z_BASE + 0.2] as V3), [0, 0, 1])
// the string course between the base's two storeys
prism(trim, grow(BASE, 0.15), 6.2, 6.6, false, true)
// The base's openings: round-headed ground-floor windows on the south
// front (p1: ground 0.2-2 m there), square windows in the base's upper
// storey all round; on the other sides the ground rises to 4.3 m, so their
// ground storey starts above it.
{
  const y = -40.2 - 0.05
  for (let i = 0; i < 11; i++) {
    const cx = -31.2 + (62.4 * (i + 0.5)) / 11, r = 1.25, z0 = 2.2, zs = 4.9
    const P: V3[] = [[cx - r, y, z0], [cx + r, y, z0]]
    for (let k = 0; k <= 8; k++) { const a = (k / 8) * Math.PI; P.push([cx + r * Math.cos(a), y, zs + r * Math.sin(a)]) }
    poly(win, P, [0, -1, 0])
  }
}
ringFacade(BASE, 5.5, [[7.0, 8.2]], 0.42)
for (const [r, skip] of [[BASE, [0]]] as [XY[], number[]][]) ringFacade(r, 5.5, [[4.5, 5.9]], 0.42, skip)
// Balustrade over the base in the north court (p3).
prism(trim, rect(-11.0, 30, 12.0, 40.4), Z_BASE + 0.2, Z_BASE + 1.3, true)

for (const r of [WW, EW, CB]) {
  prism(wall, r, Z_BASE, Z_CORN, false)
  // a spandrel-coloured band between the base and the shaft
  prism(trim, grow(r, 1.3), Z_CORN - 0.4, Z_CORN + 1.6, true, true) // the heavy cream cornice
  prism(wall, grow(r, -0.6), Z_CORN + 1.6, Z_ATTIC, false)
  ringFacade(grow(r, -0.6), 3.7, [[46.2, 49.8]], 0.88) // the glazed attic storey
}
// the shaft's windows: wings all round; the centre block only into the courts
ringFacade(WW, 3.7, SHAFT, 0.42)
ringFacade(EW, 3.7, SHAFT, 0.42)
facade([12.4, 6.5], [-11.4, 6.5], [0, 1], 3.7, SHAFT, 0.42)
facade([-11.4, -19.9], [12.4, -19.9], [0, -1], 3.7, SHAFT, 0.42)

// roofs: a low hip on each wing and on the centre block
hip(roof, -31.2 + 0.4, -40.2 + 0.4, -11.4 - 0.4, 40.2 - 0.4, Z_ATTIC, Z_TOP)
hip(roof, 12.4 + 0.4, -40.2 + 0.4, 31.2 - 0.4, 40.2 - 0.4, Z_ATTIC, Z_TOP)
hip(roof, -11.4 - 0.2, -19.9 + 0.4, 12.4 + 0.2, 6.5 - 0.4, Z_ATTIC, Z_TOP - 0.4)

// ---------------------------------------- the canted bay and the lantern ---
{
  // the canted bay on the centre block's north face, under the lantern
  const cx = 0.5, y0 = 6.5, d = 2.4, hw = 5.0, k = 2.0
  const bay: XY[] = [[cx - hw, y0], [cx + hw, y0], [cx + hw - k, y0 + d], [cx - hw + k, y0 + d]]
  prism(wall, bay, Z_BASE, Z_CORN + 1.6, true)
  facade([cx + hw - k, y0 + d], [cx - hw + k, y0 + d], [0, 1], 3.0, SHAFT, 0.6)
  for (const sx of [-1, 1]) {
    const a: XY = sx < 0 ? [cx - hw, y0] : [cx + hw - k, y0 + d], b: XY = sx < 0 ? [cx - hw + k, y0 + d] : [cx + hw, y0]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    facade(a, b, [dy / l, -dx / l], 3.0, SHAFT, 0.6)
  }
  // the lantern (p3), two white stages over the north court: a broad lower
  // stage the width of the centre block's bay with a cornice, then a square
  // upper stage with paired arched windows between corner piers that rise
  // above its cornice, and the beehive dome on top
  const lx = 0.5
  const L1 = rect(lx - 6.0, -3.6, lx + 6.0, 6.2)
  prism(wall, L1, Z_ATTIC - 1, 54.2, false)
  prism(trim, grow(L1, 0.5), 54.2, 55.0, true, true)
  ringFacade(L1, 3.0, [[51.2, 53.4]], 0.5)
  const ly = 1.3, h = 3.9
  const L2 = rect(lx - h, ly - h, lx + h, ly + h)
  prism(wall, L2, 55.0, 60.6, false)
  prism(trim, grow(L2, 0.45), 60.6, 61.4, true, true)
  ringFacade(L2, 3.9, [[56.0, 59.6]], 0.45)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const ux = lx + sx * (h - 0.1), uy = ly + sy * (h - 0.1)
    prism(trim, rect(ux - 0.65, uy - 0.65, ux + 0.65, uy + 0.65), 55.0, 62.6, true)
  }
  // the beehive crowning the lantern: swelling rings, bold at phone size
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI
    return [lx + r * Math.cos(a), ly + r * Math.sin(a), z] as V3
  })
  trim.loft([ringAt(2.6, 61.4), ringAt(2.8, 62.3), ringAt(2.6, 63.2), ringAt(2.1, 64.0), ringAt(1.3, 64.6), ringAt(0.3, 65.0)])
  trim.cap(ringAt(0.3, 65.0), true)
}

// ------------------------------------------------------------- entrances ---
// The main doors under the north court's balustrade, and on South Temple.
prism(door, rect(-4.5, 40.2, 5.5, 40.3), 3.2, 7.4, false)
prism(door, rect(-3.5, -40.3, 4.5, -40.2), 0.9, 4.6, false)

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: white terra-cotta, cream cornices,
// a brown-grey roof (OSM roof:colour #867d74), blue-green glass.
const parts = [
  { part: wall, material: finish('jsmb-terracotta', 0xefece5) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: base, material: finish('jsmb-base', 0xe4e0d8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Joseph Smith Memorial Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 65.0,
})
await Bun.write(new URL('../models/slc-joseph-smith-memorial-building.glb', import.meta.url), glb)
console.log(`slc-joseph-smith-memorial-building.glb: ${triangles} triangles, ${glb.length} bytes`)
