/**
 * Canada Place (999 Canada Place; Zeidler Roberts Partnership with Musson
 * Cattell Mackey Partnership and Downs/Archambault, 1986; the Canadian
 * pavilion of Expo 86), the Vancouver Convention Centre's East building,
 * cruise terminal and Pan Pacific hotel — original procedural geometry,
 * CC0-1.0.  bun generators/van-canada-place.ts
 *
 * Identity, in order: the white tensile-fabric "sails" on the roof of the
 * exhibition hall, five peaked ridges strung between pairs of white masts
 * on either side of the hall, each ridge running obliquely across the pier
 * and sagging between its masts, the fabric dipping into valleys between
 * them; the long white pier into Burrard Inlet, with the cruise berths
 * along both sides, the promenade deck around the hall and the green glass
 * arcade vaults along its flanks; the hotel and office tower at the shore
 * end, a bent white slab on a glass podium, with its glass dome and the
 * white spike on its roof; the low terminal building at the tip.
 *
 * Frame: x east, y north, z up (map frame of mesh.ts), metres, bearing 0.
 * Origin at the anchor (-123.1114349, 49.2886797), 150 m east and 20 m north
 * of the survey origin (-123.1135, 49.2885) used to read OSM and lidar.
 * z = 0 is the water of Burrard Inlet (lidar 0-4 m on the water beside the
 * pier): the pier stands in the water on both sides and at the tip, so the
 * model runs down to it. The street end of the pier meets the land at the
 * shore; its walls sink into the ground there.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/223635729 (building=yes,
 *   name Canada Place, alt_name Vancouver Convention Centre East, wikidata
 *   Q1032014), which takes in the hotel and office tower at the shore end;
 *   building:parts way/1216968939-1216968942 (the sail ridges, gabled,
 *   6 levels), way/1216968944 (the shore end of the sails, gambrel, roof
 *   colour white), way/1216968929 (the glass dome, 24 levels), way/143682542
 *   (the terminal at the tip, 4 levels) and way/1216968938 (4 levels).
 * - Lidar: NRCan HRDEM "BC-Lower_Mainland_2016-1m" DSM (CanElevation series,
 *   Open Government Licence - Canada; flown 2016), resampled to a 1 m
 *   east/north grid on the survey origin. Mast positions are its local
 *   maxima; ridge and valley heights its profiles; hotel, podium, hall and
 *   tip outlines its contours (at 85, 45, 41 and 23.5 m).
 * Photos (evidence):
 * - "Vancouver (BC, Canada), Canada Place -- 2022 -- 1847.jpg", Dietmar
 *   Rabich, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Canada_Place_--_2022_--_1847.jpg
 *   (east flank: masts, ridges, arcade vaults, promenade, quay).
 * - "Vancouver (BC, Canada), Canada Place -- 2022 -- 1852.jpg", Dietmar
 *   Rabich, CC BY-SA 4.0 (the hotel tower, podium, dome and spike).
 * - "Vancouver (BC, Canada), Canada Place -- 2022 -- 1906.jpg" and
 *   "-- 1870.jpg", "-- 1876.jpg", Dietmar Rabich, CC BY-SA 4.0 (sails close
 *   up, masts, glass arcade vaults).
 * - "Vancouver (BC, Canada), Canada Place -- 2022 -- 2093.jpg", Dietmar
 *   Rabich, CC BY-SA 4.0 (from Stanley Park, the whole pier with ships).
 * - "Canada Place, Vancouver - panoramio.jpg", Colin W, CC BY-SA 3.0 (from
 *   the north across the inlet).
 * - "Canada Place 加拿大廣場 - panoramio.jpg", lienyuan lee, CC BY 3.0 (west
 *   flank with a ship).
 * - "Vancouver Convention Centre, British Columbia (470080) (9441435593).jpg",
 *   Robert Linsdell, CC BY 2.0 (west flank and hotel from the West building).
 * - Night: "Canada Place (23761677).jpeg", Harrystyle, CC BY 3.0 (sails
 *   floodlit white, windows lit); "Canada Place (5058665875).jpg", Hubert
 *   Figuière, CC BY-SA 2.0, and "Canada Place Night May 2011.jpg", Matthew
 *   Grapengieser, CC BY-SA 2.0 (the sails are also lit in colours on
 *   occasion; drawn floodlit white).
 *
 * Numbers (lidar, heights above the water, unless marked):
 * - Masts: ten, five on each side of the hall, 24 m apart along the pier
 *   (bearing 61); the lidar maxima read 51-53 m, which is the fabric at the
 *   masts: the thin mast tops are missed. Drawn with the fabric meeting each
 *   mast as a sharp cone at 56 m and the tips at 61 m (photo-scaled from
 *   Rabich 1847 and 1906; estimated). Ridges run between facing masts (bearing
 *   108, 69 m long), fabric ~49 m beside the masts sagging to 40 m midway;
 *   valleys between the ridges 36 m at mid-span, ~30 m at the mast lines;
 *   the valleys are drawn deeper than the lidar (32.5 m mid-span, 27.5 m at
 *   the mast lines) to give the catenaries the photos show; the fabric's
 *   skirt meets the hall at 26.5 m.
 * - Hall under the sails and on to the tip 27-28 m; promenade deck 17.5 m;
 *   quay apron ~4 m; tip terminal 26 m.
 * - Hotel and office tower: lidar platforms at 44 and 52.5 m, drawn as a
 *   stepped white podium at 36 and 44 m so the blue glass slab rises from a
 *   third of the way up as in Rabich 1852; slab 95 m (lidar), drawn narrower
 *   than the lidar contour with its south-east face curved; glass dome to
 *   107 m; the white spike 104 m.
 * - Arcade vaults and window bands on the flanks: heights photo-scaled from
 *   Rabich 1847 against the 17.5 m promenade (estimated).
 * - Colours: white concrete and fabric (photos); the hotel's glass reads
 *   blue-grey; the arcade vaults pale green; the deck paving grey.
 *
 * Night: the fabric carries _FLOODLIGHT (floodlit white); window bands, the
 * hotel's windows and the arcade vaults glow; the dome stays dark.
 *
 * Doubts
 * - The mast stays and cables, the flags, railings, planters, stairs,
 *   gangways, the ships and the "Canada Place" lettering are left out.
 * - The fabric is an analytic surface fitted to the 1 m lidar maxima, which
 *   blur the sharp cones right at the masts.
 * - The hotel's curved facade and its stepped terraces are simplified to
 *   the lidar contours; the window rhythm is generic (three floors a band).
 * - The shore end of the outline (drop-off and road ramps, 16-25 m in the
 *   lidar) is drawn at the promenade height; the quay apron's top at that end
 *   sits up to 1.4 m under the map's terrain where the pier meets the land
 *   (`bun tools/terrain.ts check`), which is right: it is land there.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { save, walls, cap, inset, panel, bays, rows, lathe, type XY } from './chi-aon-center'

// The pier building's painted concrete, a shade greyer than the fabric so the sails stand out.
const CONC = finish('cp-concrete', 0xdfdcd6)
const FABRIC = finish('cp-sails', 0xffffff, 0.6) // the sails: the brightest white in the model
const ROOF = finish('cp-deck', 0xbab0a7) // the promenade's warm grey and brick-red pavers, muted
// The hotel's curtain wall and the window bands read blue-grey glass (Rabich 1852).
const WIN = { ...PALETTE.window, color: 0x86a3bd }
const ARCADE = windowVariant(2, 0x9cc4b8) // the green glass vaults along the flanks; lit at night
const GLASS = PALETTE.glass // the hotel's dome

const conc = new Part(), fabric = new Part(), roof = new Part(), win = new Part(), arcade = new Part(), glass = new Part()

// Survey frame → model frame.
const OX = 150, OY = 20
const L = (r: XY[]): XY[] => r.map(([x, y]) => [x - OX, y - OY] as XY)
const L3 = ([x, y, z]: V3): V3 => [x - OX, y - OY, z]

const QUAY = 4, DECK = 17.5, HALL = 26.5, BASE = 27.5

// ---------------------------------------------------------------------------
// The pier: OSM outline way/223635729, counter-clockwise (OSM runs clockwise).
const OUTLINE: XY[] = L(([
  [-64.7, -55.3], [-50.9, -47.9], [219.9, 99.1], [250.5, 103.6], [284.2, 108.5], [306.5, 111.8], [351.6, 118.3],
  [375.1, 121.8], [408.6, 126.7], [413.1, 126.1], [416.9, 123.3], [418.9, 119.0], [418.9, 116.5], [417.3, 112.7],
  [415.2, 110.5], [358.3, 79.5], [304.7, 50.4], [255.8, 24.6], [96.4, -62.0], [82.6, -69.7], [64.4, -79.7],
  [48.2, -118.4], [38.1, -113.4], [22.5, -106.0], [-35.8, -79.1], [-41.4, -77.0], [-76.6, -61.8], [-68.5, -57.3],
] as XY[]).reverse())

// Quay apron at the waterline, then the terminal set back 4 m to the
// promenade deck, with its window band and the arcade vaults.
const TERM = inset(OUTLINE, 4)
walls(conc, OUTLINE, 0, QUAY)
{
  // apron top between the quay edge and the terminal wall
  for (let i = 0; i < OUTLINE.length; i++) {
    const j = (i + 1) % OUTLINE.length, a = OUTLINE[i], b = OUTLINE[j], c = TERM[j], d = TERM[i]
    roof.quad([a[0], a[1], QUAY], [b[0], b[1], QUAY], [c[0], c[1], QUAY], [d[0], d[1], QUAY])
  }
}
walls(conc, TERM, QUAY, DECK - 0.5)
walls(conc, TERM, DECK - 0.5, DECK, inset(TERM, 0.5))
cap(roof, inset(TERM, 0.5), DECK)
// the flanks: a dark ground-floor band behind the colonnade, the arcade vaults over it
for (let i = 0; i < TERM.length; i++) {
  const a = TERM[i], b = TERM[(i + 1) % TERM.length], len = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (len < 25) continue
  for (let s = 3; s + 6 < len - 2; s += 8) panel(win, a, b, s, s + 6.4, 5.2, 9.2, 0.05)
  arcadeVault(a, b, 4, len - 4, 10, 4.2)
}

/** A glass quarter-vault leaning on wall a→b (counter-clockwise ring, so outside is to the right). */
function arcadeVault(a: XY, b: XY, s0: number, s1: number, z0: number, r: number, n = 5) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], o: XY = [u[1], -u[0]]
  const P = (s: number, k: number): V3 => {
    const t = (Math.PI / 2) * (k / n), out = r * Math.sin(t) * 0.8, z = z0 + r * Math.cos(t)
    return [a[0] + u[0] * s + o[0] * out, a[1] + u[1] * s + o[1] * out, z]
  }
  for (let k = 0; k < n; k++) arcade.quad(P(s0, k + 1), P(s1, k + 1), P(s1, k), P(s0, k))
  // ends
  for (const [s, f] of [[s0, true], [s1, false]] as [number, boolean][])
    for (let k = 0; k < n; k++) {
      const W: V3 = [a[0] + u[0] * s, a[1] + u[1] * s, z0]
      if (f) arcade.tri(W, P(s, k), P(s, k + 1)); else arcade.tri(W, P(s, k + 1), P(s, k))
    }
  // the vault's foot: a white sill
  const F = (s: number, z: number): V3 => [a[0] + u[0] * s + o[0] * r * 0.8, a[1] + u[1] * s + o[1] * r * 0.8, z]
  conc.quad(F(s0, z0 - 0.8), F(s1, z0 - 0.8), F(s1, z0), F(s0, z0))
}

// ---------------------------------------------------------------------------
// The exhibition hall: from the hotel podium to the tip terminal (lidar ≥ 23.5 m).
const HALL_RING: XY[] = L([
  [72, -52], [96, -62], [255, 25], [270, 42], [351, 87], [354.5, 96], [346, 104], [263, 92.5],
  [225, 86], [185, 72.5], [140, 48.5], [100, 27.5], [84, 13.5], [50, -4],
])
walls(conc, HALL_RING, DECK, HALL - 0.5)
walls(conc, HALL_RING, HALL - 0.5, HALL, inset(HALL_RING, 0.5))
cap(roof, inset(HALL_RING, 0.5), HALL)

// ---------------------------------------------------------------------------
// The sails. Masts (DSM maxima, survey frame): the north-west row and the
// south-east row, 24 m apart along the pier.
const NW: XY = [98.5, 10], SE: XY = [164, -11], STEP: XY = [21, 11.75]
// Fabric apex at each mast, and the mast tips standing clear above it. The
// 1 m lidar reads the fabric (51-53 m) and misses the thin mast tops; the
// tips are photo-scaled from Rabich 1847/1906, where each mast stands a
// fifth again above its sail's point.
const APEX = 56, TIP = 61
const RIDGE = (t: number) => 37 + 13 * Math.abs(2 * t - 1) ** 1.5
const VALLEY = (t: number) => BASE + 3 * Math.sin(Math.PI * Math.min(1, Math.max(0, t))) ** 0.7
const RIDGE_LEN = Math.hypot(164 - 98.5, -11 - 10), STEP_LEN = Math.hypot(21, 11.75)
/** Fabric height at ridge coordinate f (0..4 on the ridges, half-way between = valleys) and t along the ridge. */
function fabricZ(f: number, t: number) {
  const j = Math.min(4, Math.max(0, Math.round(f))), u = Math.min(1, Math.abs(f - j) / 0.5)
  const outer = (f < 0 && j === 0) || (f > 4 && j === 4)
  const v = outer ? BASE : VALLEY(t)
  const sheet = v + (RIDGE(t) - v) * (1 - u) ** 1.6
  // a sharp cone where the fabric meets each mast tip
  const d = Math.hypot((f - j) * STEP_LEN * 0.7, Math.min(t, 1 - t) * RIDGE_LEN)
  return Math.max(sheet, APEX - 2.6 * d)
}
const at = (f: number, t: number): V3 => {
  const x = NW[0] + STEP[0] * f + (SE[0] - NW[0]) * t, y = NW[1] + STEP[1] * f + (SE[1] - NW[1]) * t
  return L3([x, y, fabricZ(f, t)])
}
/** The fabric's upward normal, by finite differences, so the surface welds and shades smooth. */
function normal(f: number, t: number): V3 {
  const h = 1e-3, a = at(f + h, t), b = at(f - h, t), c = at(f, t + h), d = at(f, t - h)
  const u: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
  let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
  const l = Math.hypot(...n)
  return [n[0] / l, n[1] / l, n[2] / l]
}
{
  const F0 = -0.5, F1 = 4.5, NF = 60
  const TS = [0, 0.015, 0.04, 0.08, 0.13, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.87, 0.92, 0.96, 0.985, 1]
  const fs = Array.from({ length: NF + 1 }, (_, k) => F0 + ((F1 - F0) * k) / NF)
  for (let a = 0; a < NF; a++) for (let b = 0; b < TS.length - 1; b++) {
    // f grows toward the north-east, t toward the south-east: (f, t) is clockwise from above, so wind f-major
    const q = [[a, b], [a, b + 1], [a + 1, b + 1], [a + 1, b]].map(([i, k]) => [at(fs[i], TS[k]), normal(fs[i], TS[k])] as [V3, V3])
    fabric.tri(q[0][0], q[1][0], q[2][0], undefined, undefined, undefined, [q[0][1], q[1][1], q[2][1]])
    fabric.tri(q[0][0], q[2][0], q[3][0], undefined, undefined, undefined, [q[0][1], q[2][1], q[3][1]])
  }
  // skirts: the fabric's edges down to the hall roof, on all four sides
  const edge = (pts: V3[]) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const p = pts[k], q = pts[k + 1]
      fabric.quad([p[0], p[1], HALL], [q[0], q[1], HALL], q, p)
    }
  }
  edge(fs.map((f) => at(f, 0)).reverse()) // north-west side
  edge(fs.map((f) => at(f, 1))) // south-east side
  edge(TS.map((t) => at(F0, t))) // shore end
  edge(TS.map((t) => at(F1, t)).reverse()) // tip end
}
// the masts: white posts from the hall roof to their tops, standing clear of the fabric
for (let i = 0; i < 5; i++)
  for (const t of [0, 1]) {
    const [x, y] = at(i, t)
    mast(x, y, HALL, TIP, 1.1)
  }
function mast(x: number, y: number, z0: number, z1: number, r: number) {
  lathe(fabric, x, y, [[r, z0], [r * 0.7, z1 - 3], [0, z1]], 8)
}

// ---------------------------------------------------------------------------
// The hotel and office tower at the shore end (lidar contours, survey frame).
const TERRACE: XY[] = L(([
  [46, -7], [101, -30], [105, -40], [95, -51], [99, -61], [36, -95], [9, -83], [1, -83], [-3, -73], [0, -67],
  [-14, -43], [-12, -38], [-4, -33],
] as XY[]).reverse())
const PODIUM: XY[] = L(([
  [46, -10], [93, -29], [100, -37], [101, -46], [88, -56], [93, -64], [91, -66], [41, -91], [3, -78], [1, -72],
  [3, -59], [-8, -40], [1, -31],
] as XY[]).reverse())
// The tower: a bent glass slab (lidar ≥ 85 m), drawn narrower and with its
// south-east face curved as in Rabich 1852, rising from the 36 m podium.
const TOWER: XY[] = (() => {
  const r: XY[] = [[6, -70], [6, -63], [70, -41], [79, -44], [81, -50]]
  const A: XY = [81, -50], B: XY = [14, -74], n = 10, bulge = 4
  const c: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], l = Math.hypot(B[0] - A[0], B[1] - A[1])
  const o: XY = [(B[1] - A[1]) / l, -(B[0] - A[0]) / l] // outward, to the south-east
  for (let k = 1; k < n; k++) {
    const t = k / n, w = bulge * Math.sin(Math.PI * t)
    r.push([A[0] + (B[0] - A[0]) * t + o[0] * w, A[1] + (B[1] - A[1]) * t + o[1] * w])
  }
  r.push(B)
  return L(r.reverse()) // built clockwise; counter-clockwise for the kit
})()
function block(r: XY[], z0: number, z1: number, top: Part = roof) {
  const ins = inset(r, 0.6)
  walls(conc, r, z0, z1 - 0.6)
  walls(conc, r, z1 - 0.6, z1, ins)
  cap(top, ins, z1)
}
// The stepped white podium. The lidar's 44 and 52.5 m platforms are drawn
// lower (36 and 44 m) so the glass slab rises from a third of the way up,
// as in Rabich 1852; the lidar levels are the slab's own lower floors.
block(TERRACE, DECK, 36)
bays(win, TERRACE, rows(DECK + 1.5, 35, 3, 1.4), { bay: 6, gap: 1.6, end: 1.5, minLen: 8 })
block(PODIUM, 36, 44)
bays(win, PODIUM, [[37.2, 43]], { bay: 5, gap: 1.2, end: 1.2, minLen: 6 })
// the slab: glass walls with a white floor line every three storeys, a white crown
walls(win, TOWER, 36, 93.5)
for (let z = 45; z < 92; z += 9.6) walls(conc, inset(TOWER, -0.25), z, z + 0.8)
block(TOWER, 93.5, 95)
// the glass dome on its drum, and the white spike at the east end
{
  const [cx, cy] = L([[24, -64]])[0]
  lathe(conc, cx, cy, [[0, 95], [7.6, 95], [7.6, 98.5], [0, 98.5]], 14)
  const prof: XY[] = [[7.4, 98.5]]
  for (let k = 1; k <= 5; k++) { const a = (Math.PI / 2) * (k / 5); prof.push([7.4 * Math.cos(a), 98.5 + 8.5 * Math.sin(a)]) }
  lathe(glass, cx, cy, prof, 14)
  const [sx, sy] = L([[72, -48]])[0]
  lathe(conc, sx, sy, [[3.2, 95], [0.2, 104], [0, 104]], 8)
}

const LIT = (_p: V3, n: V3) => 0.55 + 0.4 * Math.max(0, n[2])

if (import.meta.main) {
  await save('van-canada-place', 'Canada Place', [-123.1114349, 49.2886797], 0, [
    { part: conc, material: CONC as Swatch },
    { part: fabric, material: { ...FABRIC, floodlight: LIT } as Swatch },
    { part: roof, material: ROOF },
    { part: win, material: WIN },
    { part: arcade, material: ARCADE },
    { part: glass, material: GLASS },
  ], 6500)
}
