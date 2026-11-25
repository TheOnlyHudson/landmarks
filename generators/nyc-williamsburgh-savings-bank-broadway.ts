/**
 * Williamsburgh Savings Bank, 175 Broadway, Williamsburg: procedural,
 * CC0-1.0. (Not the 1 Hanson Place tower, `nyc-williamsburgh-savings-bank`.)
 * bun generators/nyc-williamsburgh-savings-bank-broadway.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 26.4° (the
 * OSM outline's sides), so -y is the Broadway front. The origin is the
 * centroid of OSM way/279615231 (building=yes, height=37), on the ground.
 *
 * The building. George B. Post's 1875 bank: a square Renaissance-revival
 * block of grey-buff stone with pedimented fronts, a great round-arched
 * entrance window with a grille, a heavy cornice, and over the centre a
 * square attic, a drum ringed with round oculus windows, and a large dome
 * of pinkish-red tile with gilded ribs, crowned by a lantern and a gilded
 * weathervane; a lower west wing of the same height and stone (Wikipedia,
 * "Williamsburgh Savings Bank Building (Broadway)"; NYC LPC designation,
 * 1966). Now the Weylin event space.
 *
 * Numbers (lidar: USGS NY_NewYorkCity, 2017; ground ~15 m in the grid):
 *   plan: OSM, the bank block 20 x 29 m and the west wing 20 x 23 m.
 *   cornice 21.5 m, front pediment to ~26.5 m, spanning the front (photo "2015"), drum to 28.5 m, dome top
 *     36.5 m, lantern to 45 m: measured (lidar 36.5, 43, 51, 60).
 *   drum radius 7.5 m (lidar), dome a half-sphere on it; 12 oculi and 16
 *     gilded ribs: estimated from "Williamsburgh Savings Bank Building 005"
 *     and "003" (the photos show ~8 oculi a half and gold ribs).
 *   arched entrance window 6.5 m wide and the smaller arched windows
 *     either side in two tiers: estimated from "... 2015".
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Williamsburgh Savings Bank, Brooklyn, NY 2015", Atorpey, CC BY-SA 4.0
 *     (the Broadway front and side, whole)
 *   "Billyb Sav Bank dome bright jeh", Jim.henderson, CC0
 *   "Williamsburgh Savings Bank Building", "001"–"005", Kidfly182,
 *     CC BY-SA 4.0 (the dome, drum, pediments and cornice)
 * Look-only: none.
 *
 * Night: the windows glow; the dome is not drawn lit (no licensed night
 * photo).
 *
 * Doubts: the lidar and OSM differ by ~2 m in where the dome sits (the OSM
 * block's centre is used); the side pediments are drawn on the long sides
 * of the bank block only; the wing's facade is simplified.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, quadN, unit, type Facade, type XY } from './nyc-570-lexington'

const TAU = Math.PI * 2
const stone = new Part(), win = new Part(), roof = new Part(), dome = new Part(), gold = new Part()
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
// A plinth course round the foot, its ring split every 2 m so the base is
// sampled all along it on the map's sloping ground.
const dense = (r: XY[], step = 2): XY[] => r.flatMap((a, i) => {
  const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
  return Array.from({ length: n }, (_, k) => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n] as XY)
})
const BX0 = -1.7, BX1 = 18.4, BY0 = -14.8, BY1 = 14.0, CORN = 21.5
const C: XY = [(BX0 + BX1) / 2, (BY0 + BY1) / 2]

const fac: Facade = { bay: 4.2, ratio: 0.4, floor: 5, group: 1, spandrel: 2.5, sill: 1.8, head: 3.6, minLength: 6, margin: 2 }
// The bank block, its cornice, and the west wing.
prism({ wall: stone, win, roof, ring: rect(BX0, BY0, BX1, BY1), z0: 0, z1: CORN, facade: fac, bevel: 0.45, faceFacade: (i) => (i === 0 ? null : fac) })
prism({ wall: stone, win: null, roof: null, ring: rect(BX0 - 0.5, BY0 - 0.5, BX1 + 0.5, BY1 + 0.5), z0: CORN - 1.8, z1: CORN - 0.9, facade: null, bevel: 0.3 })
prism({ wall: stone, win, roof, ring: rect(-20.6, -10.9, BX0, 12.2), z0: 0, z1: CORN - 0.5, facade: fac, bevel: 0.45 })

prism({ wall: stone, win: null, roof: null, ring: dense(rect(BX0 - 0.25, BY0 - 0.25, BX1 + 0.25, BY1 + 0.25)), z0: 0, z1: 1.5, facade: null, bevel: 0.1 })
prism({ wall: stone, win: null, roof: null, ring: dense(rect(-20.85, -11.15, BX0, 12.45)), z0: 0, z1: 1.5, facade: null, bevel: 0.1 })

// Pediments on the front (Broadway, -y) and back over the central 14 m,
// each a shallow gable standing on the cornice.
function pediment(y: number, out: number) {
  // drawn with both windings: a thin gable standing proud of the cornice
  const x0 = BX0 + 0.6, x1 = BX1 - 0.6, z0 = CORN - 0.3, z1 = CORN + 5.0
  const yf = y + out * 0.6, yb = y - out * 3
  const both = (p: V3, q: V3, r: V3) => { stone.tri(p, q, r); stone.tri(p, r, q) }
  both([x0, yf, z0], [x1, yf, z0], [C[0], yf, z1])
  both([x0, yf, z0], [C[0], yf, z1], [C[0], yb, z1]); both([x0, yf, z0], [C[0], yb, z1], [x0, yb, z0])
  both([x1, yf, z0], [C[0], yf, z1], [C[0], yb, z1]); both([x1, yf, z0], [C[0], yb, z1], [x1, yb, z0])
}
pediment(BY0, -1)
pediment(BY1, 1)

/** A round-headed panel 0.06 m proud of the wall face at y = yf facing -y. */
function archFront(cx: number, w: number, z0: number, zs: number) {
  const y = BY0 - 0.06, r = w / 2
  win.quad([cx - r, y, z0], [cx + r, y, z0], [cx + r, y, zs], [cx - r, y, zs])
  for (let k = 0; k < 10; k++) {
    const a0 = (k / 10) * Math.PI, a1 = ((k + 1) / 10) * Math.PI
    win.tri([cx, y, zs], [cx + r * Math.cos(a0), y, zs + r * Math.sin(a0)], [cx + r * Math.cos(a1), y, zs + r * Math.sin(a1)])
  }
}
archFront(C[0], 6.5, 2.5, 11)
archFront(C[0] - 7, 2.2, 3, 9.5)
archFront(C[0] + 7, 2.2, 3, 9.5)
archFront(C[0] - 7, 2.0, 12.5, 17)
archFront(C[0] + 7, 2.0, 12.5, 17)

// The square attic, the drum with its oculi, the dome with gilded ribs,
// and the lantern.
const R = 7.5, DRUM0 = CORN + 2.5, DRUM1 = 28.5, TOP = 36.5
prism({ wall: stone, win: null, roof, ring: rect(C[0] - 8.6, C[1] - 8.6, C[0] + 8.6, C[1] + 8.6), z0: CORN - 0.4, z1: DRUM0, facade: null, bevel: 0.35 })
const N = 24
const ring = (r: number, z: number, k: number): V3 => [C[0] + r * Math.cos((k / N) * TAU), C[1] + r * Math.sin((k / N) * TAU), z]
for (let k = 0; k < N; k++) {
  const na = unit([Math.cos((k / N) * TAU), Math.sin((k / N) * TAU), 0]), nb = unit([Math.cos(((k + 1) / N) * TAU), Math.sin(((k + 1) / N) * TAU), 0])
  quadN(stone, ring(R, DRUM0, k), ring(R, DRUM0, k + 1), ring(R, DRUM1, k + 1), ring(R, DRUM1, k), [na, nb, nb, na])
  // a cornice lip at the drum's top
  quadN(stone, ring(R, DRUM1, k), ring(R, DRUM1, k + 1), ring(R + 0.4, DRUM1 + 0.4, k + 1), ring(R + 0.4, DRUM1 + 0.4, k), [na, nb, nb, na])
}
// 12 oculi round the drum.
for (let k = 0; k < 12; k++) {
  const a = ((k + 0.5) / 12) * TAU, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
  const zc = (DRUM0 + DRUM1) / 2, rr = 0.85, P = (u: number, v: number): V3 => [C[0] + n[0] * (R + 0.06) + t[0] * u, C[1] + n[1] * (R + 0.06) + t[1] * u, zc + v]
  for (let s = 0; s < 10; s++) {
    const b0 = (s / 10) * TAU, b1 = ((s + 1) / 10) * TAU
    win.tri(P(0, 0), P(rr * Math.cos(b0), rr * Math.sin(b0)), P(rr * Math.cos(b1), rr * Math.sin(b1)))
  }
}
// The dome: a half-sphere from the drum's lip, smooth-shaded.
const RINGS = 8, RD = R + 0.2, Z0 = DRUM1 + 0.4, RISE = TOP - Z0
const sp = (i: number, k: number): V3 => {
  const ph = (i / RINGS) * (Math.PI / 2)
  return [C[0] + RD * Math.cos(ph) * Math.cos((k / N) * TAU), C[1] + RD * Math.cos(ph) * Math.sin((k / N) * TAU), Z0 + RISE * Math.sin(ph)]
}
const sn = (i: number, k: number): V3 => {
  const ph = (i / RINGS) * (Math.PI / 2)
  return unit([Math.cos(ph) * Math.cos((k / N) * TAU) / RD, Math.cos(ph) * Math.sin((k / N) * TAU) / RD, Math.sin(ph) / RISE])
}
for (let i = 0; i < RINGS; i++) for (let k = 0; k < N; k++)
  quadN(dome, sp(i, k), sp(i, k + 1), sp(i + 1, k + 1), sp(i + 1, k), [sn(i, k), sn(i, k + 1), sn(i + 1, k + 1), sn(i + 1, k)])
// 16 gilded ribs, raised a little off the tile, from the lip to the lantern.
for (let r = 0; r < 16; r++) {
  const k = (r / 16) * N, w = 0.14
  for (let i = 0; i < RINGS - 1; i++) {
    const p0 = sp(i, k), p1 = sp(i + 1, k), n0 = sn(i, k), n1 = sn(i + 1, k)
    const tx = -Math.sin((k / N) * TAU), ty = Math.cos((k / N) * TAU)
    const o = (p: V3, n: V3, s: number): V3 => [p[0] + n[0] * 0.1 + tx * s, p[1] + n[1] * 0.1 + ty * s, p[2] + n[2] * 0.1]
    quadN(gold, o(p0, n0, w), o(p0, n0, -w), o(p1, n1, -w), o(p1, n1, w), [n0, n0, n1, n1])
  }
}
// The lantern: a stone drum, a dark cap and a gilded finial.
const LZ = TOP - 0.3
prism({ wall: stone, win: null, roof: null, ring: Array.from({ length: 12 }, (_, k) => [C[0] + 1.7 * Math.cos((k / 12) * TAU), C[1] + 1.7 * Math.sin((k / 12) * TAU)] as XY), z0: LZ, z1: LZ + 4, facade: null, bevel: 0 })
prism({ wall: roof, win: null, roof: roof, ring: Array.from({ length: 12 }, (_, k) => [C[0] + 2.0 * Math.cos((k / 12) * TAU), C[1] + 2.0 * Math.sin((k / 12) * TAU)] as XY), z0: LZ + 4, z1: LZ + 5.2, facade: null, bevel: 0.1 })
prism({ wall: gold, win: null, roof: gold, ring: rect(C[0] - 0.35, C[1] - 0.35, C[0] + 0.35, C[1] + 0.35), z0: LZ + 5.2, z1: 45, facade: null, bevel: 0 })

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: stone, material: finish('wsb-stone', 0xdcd5c4) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dome, material: finish('wsb-dome-tile', 0xa97b6d) },
  { part: gold, material: finish('wsb-gilt', 0xd8b25a) },
]
finishModel('Williamsburgh Savings Bank', 'nyc-williamsburgh-savings-bank-broadway', parts, { bearing: 26.4, elevation: 0, height: 45, osm: 'way/279615231' })
