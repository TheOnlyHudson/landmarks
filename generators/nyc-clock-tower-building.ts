/**
 * The Clocktower Building (Gair Building No. 7), 1 Main Street, DUMBO:
 * procedural, CC0-1.0.
 * bun generators/nyc-clock-tower-building.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2° (the OSM
 * outline's sides). The origin is the centroid of OSM way/250402641
 * ("Clocktower Building", height=80.9), as Nominatim gives it, on the
 * ground. The map's terrain rises 1.2 m from Main Street (west) to the east
 * side, so y = 0 is the Main Street ground and the east side sinks into it.
 *
 * The building. Robert Gair's 1914 reinforced-concrete factory, sixteen
 * storeys of cream-painted concrete with big grouped industrial windows
 * and a heavy cornice, and on its Main Street side a square tower rising
 * five more storeys to four large clock faces with green bronze rims,
 * a brown hipped roof with dormers and a glazed rooftop belvedere;
 * converted to condominiums in 1998 (Wikipedia, "Clock Tower Building
 * (Brooklyn)"; NYC LPC, DUMBO Historic District report, 2007). The low
 * wing on the east side is inside the same OSM outline.
 *
 * Numbers (lidar: USGS NY_NewYorkCity, 2017; heights above the Main
 * Street ground, which is 2.2 m above the box's ground_min):
 *   slab 34 x 62 m: OSM outline; roof 52.1 m, cornice/parapet 55.0 m:
 *     measured (54.3 and 56.6–57.7 above ground_min). The 3 m parapet
 *     well is drawn as a flat roof at the cornice.
 *   tower 17.5 m square, set ~1 m in from the Main Street wall, centre
 *     (-14, 1): measured, lidar. Walls to the cornice 72.8 m; the hipped
 *     roof from there to 81.4 m with a 7 m flat top; the belvedere to
 *     84.8 m: measured (75.0, 83.6 and 87.0 above ground_min).
 *   clock faces 5.6 m across (real ~4.5 m, drawn bold), centres 4.0 m below the cornice: estimated
 *     from "The Clocktower and the Manhattan Bridge from 15 Clark Street"
 *     (the dial a quarter of the tower's width) and drawn a little bold
 *     for phone size, as the brief asks.
 *   east wing 10.2 m (7 m on its north strip): measured, lidar.
 *   storeys 3.3 m (16 in 52 m); windows grouped two storeys a panel (wide, with deep spandrels),
 *     the two storeys under the cornice as their own band of segmental-
 *     arched windows; on the tower a row of square windows and a row of
 *     round-headed ones (the middle wider) under each dial, as photographed.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "The Clocktower and the Manhattan Bridge from 15 Clark Street",
 *     Beyond My Ken, CC BY-SA 4.0 (the tower from the south-west)
 *   "Clock Tower Condominium, Brooklyn, Sept 2017", Thomson200, CC0
 *     (from the north-west, the park: the whole slab and tower)
 *   "The Clocktower Building, 1 Main Street", Opencooper, CC0 (the
 *     tower, the clock and the roof from the north-west, close)
 *   "The Clocktower Building", "... 001", Kidfly182, CC BY-SA 4.0
 *   "Dumbo, Brooklyn at sunset", MusikAnimal, CC BY-SA 4.0 (from the river)
 * Look-only: none.
 *
 * Colours: the tower is whiter than the slab in every photo (a white
 * finish for its walls and the dials, cream for the slab).
 *
 * Night: the windows glow. The dials share the tower's white finish and are
 * not drawn lit (no licensed night photo shows them).
 *
 * Doubts: whether the dials are lit at night (no licensed night photo
 * found; drawn unlit); the dormers on the hipped roof are left out; the east wing's
 * rooftops vary 7–11 m and are drawn as two heights.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, prism, quadN, unit, type Facade, type XY } from './nyc-570-lexington'

const TAU = Math.PI * 2
const SLAB = 55.0, WING = 10.2
const TC: XY = [-14, 1], TH = 8.75, CORNICE = 72.8, HIP = 81.4, HIP_TOP = 3.5, BELV = 84.8

const stone = new Part(), white = new Part(), win = new Part(), roof = new Part(), bronze = new Part(), rim = new Part()

/**
 * A window panel 0.05 m proud of wall a→b (outside to the right of travel),
 * centred s along it, w wide, z0..z1 to the springing, with a round
 * (semicircle) or segmental (rise w/5) head above z1, or none.
 */
function panel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, head: 'none' | 'round' | 'seg' = 'none') {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * 0.05, a[1] + u[1] * t + n[1] * 0.05, z]
  const r = w / 2
  p.quad(P(s - r, z0), P(s + r, z0), P(s + r, z1), P(s - r, z1))
  if (head === 'none') return
  const rise = head === 'round' ? r : w / 5
  const SEG = 8
  for (let k = 0; k < SEG; k++) {
    const t0 = Math.PI - (k / SEG) * Math.PI, t1 = Math.PI - ((k + 1) / SEG) * Math.PI
    p.tri(P(s, z1), P(s + r * Math.cos(t0), z1 + rise * Math.sin(t0)), P(s + r * Math.cos(t1), z1 + rise * Math.sin(t1)))
  }
}

// ------------------------------------------------------------ the slab ---
// Grouped two storeys a panel, pale piers and deep spandrels between; the
// storeys under the cornice get their own band of segmental-arched windows.
const slabFacade: Facade = { bay: 4.2, ratio: 0.68, floor: 3.3, group: 2, spandrel: 2.0, sill: 1.0, head: 9.9, ground: 0.15, margin: 1.2 }
massing({
  wall: stone, win, roof, facade: slabFacade, bevel: 0.5,
  boxes: [
    [-22.6, -29.7, 10.8, 32.4, SLAB],
    [10.8, 22.1, 12.8, 32.4, SLAB],
    [10.8, -29.6, 19.4, -16.4, WING],
    [10.8, -16.4, 22.6, 17.8, WING],
    [10.8, 17.8, 12.8, 22.1, 7],
  ],
})
{
  const X0 = -22.6, X1 = 10.8, Y0 = -29.7, Y1 = 32.4
  const band = (a: XY, b: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), usable = L - 2.4
    const count = Math.max(1, Math.round(usable / 4.2)), pitch = usable / count
    for (let k = 0; k < count; k++) panel(win, a, b, 1.2 + pitch * (k + 0.5), pitch * 0.55, 46.2, 50.9, 'seg')
  }
  band([X0, Y0], [X1, Y0]); band([X1, Y1], [X0, Y1]); band([X0, Y1], [X0, Y0]); band([X1, Y0], [X1, 22.1])
}
// A heavy cornice lip round the slab top.
{
  const x0 = -22.6 - 0.5, x1 = 10.8 + 0.5, y0 = -29.7 - 0.5, y1 = 32.4 + 0.5
  prism({ wall: stone, win: null, roof: null, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: SLAB - 1.6, z1: SLAB - 0.9, facade: null, bevel: 0.3 })
}

// ------------------------------------------------------------ the tower ---
const T0: XY = [TC[0] - TH, TC[1] - TH], T1: XY = [TC[0] + TH, TC[1] + TH]
prism({ wall: white, win: null, roof: null, ring: [[T0[0], T0[1]], [T1[0], T0[1]], [T1[0], T1[1]], [T0[0], T1[1]]], z0: SLAB - 3, z1: CORNICE - 0.8, facade: null, bevel: 0.45 })
// On each face, as in the Beyond My Ken photo: a row of square windows over
// the slab roof, a row of round-headed windows (the middle one wider) under
// the dial, and the dial.
{
  const C: XY[] = [[T0[0], T0[1]], [T1[0], T0[1]], [T1[0], T1[1]], [T0[0], T1[1]]]
  for (let i = 0; i < 4; i++) {
    const a = C[i], b = C[(i + 1) % 4], L = 2 * TH
    for (const t of [0.14, 0.38, 0.62, 0.86]) panel(win, a, b, L * t, 1.7, SLAB + 0.6, SLAB + 3.0)
    for (const [t, w] of [[0.13, 1.6], [0.32, 1.6], [0.5, 2.3], [0.68, 1.6], [0.87, 1.6]] as [number, number][]) panel(win, a, b, L * t, w, SLAB + 4.0, SLAB + 5.9, 'round')
  }
}
// Cornice band at the top of the tower walls.
prism({ wall: white, win: null, roof: null, ring: [[T0[0] - 0.45, T0[1] - 0.45], [T1[0] + 0.45, T0[1] - 0.45], [T1[0] + 0.45, T1[1] + 0.45], [T0[0] - 0.45, T1[1] + 0.45]], z0: CORNICE - 0.8, z1: CORNICE, facade: null, bevel: 0.2 })
// The hipped roof, from the cornice to a flat top, and the glazed belvedere.
{
  const e = TH + 0.45
  const lo: V3[] = [[TC[0] - e, TC[1] - e, CORNICE], [TC[0] + e, TC[1] - e, CORNICE], [TC[0] + e, TC[1] + e, CORNICE], [TC[0] - e, TC[1] + e, CORNICE]]
  const hi: V3[] = lo.map((p) => [TC[0] + Math.sign(p[0] - TC[0]) * HIP_TOP, TC[1] + Math.sign(p[1] - TC[1]) * HIP_TOP, HIP])
  bronze.loft([lo, hi])
  bronze.cap(hi, true)
  const B = 2.6, top = BELV - 0.5
  // glass walls, corner posts and the cap
  const g: XY[] = [[-B, -B], [B, -B], [B, B], [-B, B]]
  for (let i = 0; i < 4; i++) {
    const a = g[i], b = g[(i + 1) % 4]
    win.quad([TC[0] + a[0], TC[1] + a[1], HIP], [TC[0] + b[0], TC[1] + b[1], HIP], [TC[0] + b[0], TC[1] + b[1], top], [TC[0] + a[0], TC[1] + a[1], top])
    prism({ wall: bronze, win: null, roof: null, ring: [[TC[0] + a[0] - 0.2, TC[1] + a[1] - 0.2], [TC[0] + a[0] + 0.2, TC[1] + a[1] - 0.2], [TC[0] + a[0] + 0.2, TC[1] + a[1] + 0.2], [TC[0] + a[0] - 0.2, TC[1] + a[1] + 0.2]], z0: HIP, z1: top, facade: null, bevel: 0 })
  }
  prism({ wall: bronze, win: null, roof: bronze, ring: [[TC[0] - B - 0.3, TC[1] - B - 0.3], [TC[0] + B + 0.3, TC[1] - B - 0.3], [TC[0] + B + 0.3, TC[1] + B + 0.3], [TC[0] - B - 0.3, TC[1] + B + 0.3]], z0: top, z1: BELV, facade: null, bevel: 0.1 })
}

// ------------------------------------------------------------ the clocks ---
// One on each face: a green bronze rim ring, a white dial, bold hands
// (at ten past ten), all flush shapes just proud of the wall.
const CR = 4.6, CZ = CORNICE - 0.8 - 0.6 - 4.6
function clock(face: number) {
  const out: XY = [Math.sin(face), Math.cos(face)], tan: XY = [-Math.cos(face), Math.sin(face)]  // u to the right, seen from outside
  const c: XY = [TC[0] + out[0] * TH, TC[1] + out[1] * TH]
  const P = (u: number, v: number, d: number): V3 => [c[0] + tan[0] * u + out[0] * d, c[1] + tan[1] * u + out[1] * d, CZ + v]
  const N = 24
  for (let k = 0; k < N; k++) {
    const a = (k / N) * TAU, b = ((k + 1) / N) * TAU
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b)
    // rim: a ring 0.45 m wide standing 0.18 m proud, with its outer edge
    const ri = CR - 0.75
    rim.quad(P(ri * ca, ri * sa, 0.18), P(CR * ca, CR * sa, 0.18), P(CR * cb, CR * sb, 0.18), P(ri * cb, ri * sb, 0.18))
    const ea = unit([tan[0] * ca, tan[1] * ca, sa]), eb = unit([tan[0] * cb, tan[1] * cb, sb])
    quadN(rim, P(CR * ca, CR * sa, 0), P(CR * cb, CR * sb, 0), P(CR * cb, CR * sb, 0.18), P(CR * ca, CR * sa, 0.18), [ea, eb, eb, ea])
    white.tri(P(0, 0, 0.1), P(ri * ca, ri * sa, 0.1), P(ri * cb, ri * sb, 0.1))
  }

  // hands: hour to ten o'clock, minute to two
  const hand = (ang: number, l: number, w: number) => {
    const dx = Math.sin(ang), dy = Math.cos(ang), px = -dy * w, py = dx * w
    bronze.quad(P(px - dx * 0.2, py - dy * 0.2, 0.16), P(-px - dx * 0.2, -py - dy * 0.2, 0.16), P(-px + dx * l, -py + dy * l, 0.16), P(px + dx * l, py + dy * l, 0.16))
  }
  hand((-60 * Math.PI) / 180, CR * 0.5, 0.22)
  hand((60 * Math.PI) / 180, CR * 0.75, 0.16)
}
for (let k = 0; k < 4; k++) clock((k * Math.PI) / 2)

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: stone, material: finish('clocktower-cream', 0xe6dcc5) },
  { part: white, material: finish('clocktower-white', 0xf6f2e8) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: bronze, material: finish('clocktower-roof', 0x6b5548) },
  { part: rim, material: finish('clocktower-bronze', 0x7db5a5) },
]
finishModel('Clocktower Building', 'nyc-clock-tower-building', parts, {
  bearing: 2, elevation: 0, height: BELV, osm: 'way/250402641',
})
