/**
 * Church Office Building (1972, George Cannon Young), Salt Lake City:
 * procedural, CC0-1.0.
 * bun generators/slc-church-office-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * true east-west). The origin is the area centroid of OSM way/32333201
 * (-111.8893649, 40.7709849). y = 0 is the lowest ground under the
 * outline.
 *
 * Form: a slab tower in three parts, a centre slab 22.3 m wide rising to
 * 128 m between two side slabs 15.5 m wide at 115.7 m (lidar), the centre
 * standing 1.3 m proud of them, all clad in pale precast fins; at its
 * foot, a colonnade of tall square piers under a deep canopy on the
 * south plaza side, with the glass lobby recessed behind; low four-storey
 * wings to east and west, finned the same way, carrying the world-map
 * reliefs beside the entrances.
 *
 * OSM: way/32333201 outline (144 x 65 m) and way/1041554426, the 19 m
 * podium part over the same outline; way/1434285907 the centre slab, 128 m,
 * 30 levels; way/1434285908 and way/1434285909 the side slabs, 110 m, 28
 * levels (not followed: see revision 2). Published: 128 m (420 ft), 28 storeys above ground
 * (Wikipedia, "Church Office Building").
 * Estimated from photos: the fins about 2.2 m apart (twelve slots across
 * the centre slab in p3, ten across a side slab); the colonnade 12 m high
 * with its canopy band to 14 m (p3); the dark mechanical recess under each
 * slab's parapet (p2); the wings 19 m (OSM) with the same fins. The slots
 * are drawn in lifts of three storeys with a fin-coloured band between,
 * as STYLE.md asks, though the real slots run unbroken.
 * World-map reliefs: drawn as raised pale ovals on the wings' south faces
 * either side of the plaza (p2 shows one west of the tower); their exact
 * places and size are estimated.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Church_Office_Building_SLC.jpg
 *     Bobjgalindo, CC BY-SA 4.0 (the north-east, the east wing in front)
 *  p2 https://commons.wikimedia.org/wiki/File:2013_Church_Office_Building_Salt_Lake_City_(2).jpg
 *     Chris06, CC BY-SA 4.0 (from the south-west, across Main Street Plaza)
 *  p3 https://commons.wikimedia.org/wiki/File:Lds_church_office_building.jpg
 *     Ricardo630, CC BY-SA 3.0 (the south face and colonnade, looking up)
 * Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (2013), for the side slabs' height only.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Walls of a counter-clockwise ring, split into lifts no taller than `lift` (for the terrain check's sake near the ground). */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    const L = Math.hypot(bx - ax, by - ay), k = Math.max(1, Math.ceil(L / 5))
    for (let j = 0; j < k; j++) {
      const t0 = j / k, t1 = (j + 1) / k
      const a: XY = [ax + (bx - ax) * t0, ay + (by - ay) * t0], b: XY = [ax + (bx - ax) * t1, ay + (by - ay) * t1]
      // only the lowest few metres need splitting along the wall
      if (z0 < 1) {
        p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], 3], [a[0], a[1], 3])
        p.quad([a[0], a[1], 3], [b[0], b[1], 3], [b[0], b[1], z1], [a[0], a[1], z1])
      } else p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** Window slots along a wall a→b (outward normal n): one per fin bay, in lifts. */
function slots(a: XY, b: XY, n: XY, pitch: number, lifts: [number, number][], w: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nb = Math.max(1, Math.round(L / pitch)), step = L / nb
  for (let i = 0; i < nb; i++) {
    const s = step * (i + 0.5), hw = w / 2
    const c: XY = [a[0] + t[0] * s + n[0] * 0.05, a[1] + t[1] * s + n[1] * 0.05]
    for (const [z0, z1] of lifts) {
      poly(win, [[c[0] - t[0] * hw, c[1] - t[1] * hw, z0], [c[0] + t[0] * hw, c[1] + t[1] * hw, z0],
        [c[0] + t[0] * hw, c[1] + t[1] * hw, z1], [c[0] - t[0] * hw, c[1] - t[1] * hw, z1]], [n[0], n[1], 0])
    }
  }
}
const edgeNormal = (a: XY, b: XY): XY => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l] }
function ringSlots(r: XY[], pitch: number, lifts: [number, number][], w: number, only?: number[]) {
  for (let i = 0; i < r.length; i++) {
    if (only && !only.includes(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    slots(a, b, edgeNormal(a, b), pitch, lifts, w)
  }
}
const lifts = (z0: number, z1: number, h: number, gap: number): [number, number][] => {
  const out: [number, number][] = []
  for (let z = z0; z + h <= z1 + 0.01; z += h) out.push([z + gap / 2, z + h - gap / 2])
  return out
}

// ------------------------------------------------------------ the tower ---
const Z_COL = 14.0      // top of the colonnade's canopy band; the fins start here
const C: XY[] = rect(-11.5, -19.4, 10.8, 24.4)
const W: XY[] = rect(-27.0, -18.1, -11.5, 23.0)
const E: XY[] = rect(10.8, -18.3, 26.3, 22.9)
const slab = (r: XY[], top: number, edges: number[]) => {
  prism(wall, r, Z_COL, top - 3.2, false)
  // the dark mechanical recess under the parapet, then the parapet band
  const inset = (d: number): XY[] => rect(r[0][0] + d, r[0][1] + d, r[2][0] - d, r[2][1] - d)
  prism(win, inset(0.8), top - 3.2, top - 1.4, false)
  prism(wall, r, top - 1.4, top, true)
  ringSlots(r, 3.3, lifts(Z_COL + 0.6, top - 3.8, 11.0, 1.6), 1.5, edges)
  // the lobby storeys under the fins: recessed glass behind the colonnade
  prism(win, inset(3.0), 0, Z_COL - 2.0, false)
  prism(trim, inset(3.0), Z_COL - 2.0, Z_COL, false)
}
slab(C, 128, [0, 1, 2, 3])
slab(W, 115.7, [0, 2, 3])
slab(E, 115.7, [0, 1, 2])
// The slabs' faces stand proud of each other only by a metre: the joints
// read as notches in the parapet line (p2, p3).
// The colonnade: a deep canopy over the south plaza on square piers.
{
  const y0 = -25.7, y1 = -16.0
  prism(trim, rect(-27.4, y0, 26.6, y1), Z_COL - 2.2, Z_COL, true, true)
  for (let i = 0; i <= 8; i++) {
    const x = -26.0 + (51.2 * i) / 8
    prism(wall, rect(x - 0.65, y0 + 0.4, x + 0.65, y0 + 1.7), 0, Z_COL - 2.2, false)
  }
  // the north side has a plainer colonnade under the tower
  prism(trim, rect(-27.4, 22.0, 26.6, 26.0), Z_COL - 2.2, Z_COL, true, true)
  for (let i = 0; i <= 8; i++) {
    const x = -26.0 + (51.2 * i) / 8
    prism(wall, rect(x - 0.65, 24.3, x + 0.65, 25.6), 0, Z_COL - 2.2, false)
  }
}

// ------------------------------------------------------------- the wings ---
const Z_WING = 19.0
for (const s of [-1, 1]) {
  // OSM's outline beyond the tower: the wing steps forward to y = -34.9
  // past x = ±39, and is set back to the colonnade's line nearer in.
  const outer: XY[] = s < 0
    ? [[-72.1, -34.7], [-39.4, -34.7], [-39.4, -25.7], [-27.6, -25.7], [-27.6, 30.2], [-72.1, 30.2]]
    : [[27.6, -25.7], [38.9, -25.7], [38.9, -35.0], [72.0, -34.9], [72.0, 30.2], [27.6, 30.2]]
  prism(wall, outer, 0, Z_WING - 1.0, false)
  prism(trim, outer, Z_WING - 1.0, Z_WING, false)
  // the roof deck, as two rectangles (the outline is L-shaped)
  for (const r of s < 0 ? [rect(-72.1, -34.7, -39.4, 30.2), rect(-39.4, -25.7, -27.6, 30.2)] : [rect(38.9, -35.0, 72.0, 30.2), rect(27.6, -25.7, 38.9, 30.2)])
    poly(roof, r.map(([x, y]) => [x, y, Z_WING] as V3), [0, 0, 1])
  ringSlots(outer, 3.3, [[1.2, 7.6], [9.0, 16.8]], 1.5, s < 0 ? [0, 1, 2, 4, 5] : [0, 1, 2, 3, 4])
  // the world-map relief: a raised pale oval on the face beside the plaza
  const cx = s * 33.3, y = -25.7 - 0.12, zc = 9.0, rx = 4.2, rz = 3.2, seg = 16
  const P = (a: number): V3 => [cx + rx * Math.cos(a), y, zc + rz * Math.sin(a)]
  for (let k = 0; k < seg; k++) poly(trim, [[cx, y, zc], P((2 * Math.PI * k) / seg), P((2 * Math.PI * (k + 1)) / seg)], [0, -1, 0])
}
// close the gap between the wings and the tower above the canopy
prism(wall, rect(-27.6, -14.5, 27.0, 20.5), 0, Z_COL - 2.2, false) // behind the lobby glass

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: pale precast fins (stone), cream
// canopy band and reliefs, dark window slots, grey roof decks.
const parts = [
  { part: wall, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: windowVariant(2, 0x7b8c9a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Church Office Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 128,
})
await Bun.write(new URL('../models/slc-church-office-building.glb', import.meta.url), glb)
console.log(`slc-church-office-building.glb: ${triangles} triangles, ${glb.length} bytes`)
