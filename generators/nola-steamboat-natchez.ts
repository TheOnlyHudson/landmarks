/**
 * Steamboat Natchez (1975), at the Toulouse Street Wharf, New Orleans —
 * procedural, CC0-1.0.
 * bun generators/nola-steamboat-natchez.ts
 *
 * Identity: the white three-deck steam sternwheeler; railings drawn as bold
 * white bands with red fascia stripes under the boiler and hurricane decks;
 * the two tall black smokestacks forward with feathered crowns; the pilot
 * house on the texas cabin; the green awning over the aft top deck; the
 * calliope on the texas roof; the big red sternwheel between the hull's
 * fantail arms, with the white pitman arms running down to its hub; the
 * stage (gangplank boom) over the bow; the black hull.
 *
 * A vessel. It is placed at its usual berth, the outer (river) face of the
 * Toulouse Street Wharf (OSM man_made=pier way/478486646, an 85 m strip at
 * bearing 22.3), stern upriver abreast the wharf's green-roofed kiosk and
 * bow downriver, as the docked photos show. The boat shares the berth with
 * the Riverboat City of New Orleans, and both the 2023 NAIP image and the
 * 2021-22 lidar caught that boat (about 58 m, twin red stage booms) here
 * rather than the Natchez, so nothing of the Natchez is measured from them;
 * they give the berth only. `replaces` is empty (OSM maps the boat as
 * node/2486487251 only).
 *
 * Frame: origin on the water at the hull's middle, +y toward the bow (the
 * placement bearing, 22.3, turns it downriver), +x to starboard (riverward
 * at the berth). y = 0 is the waterline: the map's terrain under the
 * footprint is the hydro-flattened river surface (0.88 m, flat; Mapterhorn
 * grid), so elevation is 0. The wheel is drawn sitting on the waterline
 * rather than dipping into it, so its node can turn without poking below
 * the model's base.
 *
 * The sternwheel is its own glTF node ("sternwheel"), pivot at the axle,
 * axis across the boat, so it can be animated later (STYLE.md "Moving
 * rides"). It ships static.
 *
 * Evidence
 * - OSM: node/2486487251 (Steamboat Natchez, Q12062367), the wharf
 *   way/478486646, the ticket office way/478486647.
 * - USGS NAIP 2023-05-04 and USGS 3DEP LA_2021GNO_1_C22 (2021-22): the
 *   wharf's outer face and deck (x −16..−7, y −42..+42 in the lidar frame at
 *   -90.06223 29.95501, bearing 22.3), the kiosk at its south end.
 * - Published: length 265 ft (81 m) overall, beam 46 ft (14 m), three decks,
 *   built 1975 by Bergeron Marine, Braithwaite (Wikipedia, "Natchez (1975
 *   steamboat)"); the wheel about 25 ft (7.6 m) across.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   - "Steamboat Natchez (26737607216).jpg", Coastal Elite from Halifax,
 *     Canada, CC BY-SA 2.0: broadside, port side, the scale reference for
 *     every deck height and station along the hull
 *     https://commons.wikimedia.org/wiki/File:Steamboat_Natchez_(26737607216).jpg
 *   - "Steamboat Natchez. New Orleans. (48759732042).jpg", Bernard Spragg.
 *     NZ, CC0: three-quarter from astern, the wheel, pitman arms, canopy,
 *     calliope
 *     https://commons.wikimedia.org/wiki/File:Steamboat_Natchez._New_Orleans._(48759732042).jpg
 *   - "Steamboat Natchez. New Orleans. (50704591141).jpg", Bernard Spragg.
 *     NZ, CC0: from astern, the fantail arms either side of the wheel
 *     https://commons.wikimedia.org/wiki/File:Steamboat_Natchez._New_Orleans._(50704591141).jpg
 *   - "Steamboat NATCHEZ. New Orleans. (51099673821).jpg", Bernard Spragg.
 *     NZ, Public domain
 *     https://commons.wikimedia.org/wiki/File:Steamboat_NATCHEZ._New_Orleans._(51099673821).jpg
 *   - "Steamboat Natchez.jpg", Daquella manera, CC0: docked at the wharf,
 *     stern by the kiosk, bow downriver
 *     https://commons.wikimedia.org/wiki/File:Steamboat_Natchez.jpg
 *   - "SS Natchez of New Orleans 2.JPG", MusikAnimal, CC BY-SA 4.0: docked,
 *     seen from the river, wheel upriver
 *     https://commons.wikimedia.org/wiki/File:SS_Natchez_of_New_Orleans_2.JPG
 *
 * Numbers (metres above the waterline; y from the bow tip at +40.5):
 * - Published: length 81 (bow tip to the wheel's after edge), beam 14.
 * - Estimated from the broadside photo scaled to the 81 m length: hull
 *   freeboard 1.4 rising to 2.4 at the bow; main deck to boiler deck 5.0;
 *   hurricane deck 8.4; texas roof 11.2; pilot house roof 15.0; stacks
 *   19.6 to the crown tips, 1.2 across (2.0 at the crown), 3.4 m off the centreline; stations:
 *   superstructure 6.8 m aft of the bow tip, stacks 24, pilot house 31–36,
 *   the "NATCHEZ." panel 41–60, cabin end 71, wheel axle 76.4.
 * - Estimated: wheel 8.4 across and 8 m wide (photos: its top level with
 *   the boiler deck rail), axle 4.2 (so the wheel sits on the water), canopy and calliope sizes,
 *   cabin insets (1.4–1.8 m promenades), window bands.
 * - Lettering: "NATCHEZ." traced from the Spragg CC0 photos (heavy
 *   slab-serif capitals, black with a red drop shade), the one sign kept.
 * - Invented: the deck-top colours (no open overhead photo of the Natchez;
 *   drawn white).
 *
 * Left out: the small "STEAMER NATCHEZ" board, flags and
 * flagpoles, the jackstaff, rigging and the whistle, balusters (railings are
 * solid bands), stairs.
 *
 * Doubts: the berth is the boat's usual one, not measured with the boat in
 * it; the exact station along the wharf is from photos (±5 m). The stacks'
 * spacing across the boat is from three-quarter photos. Night: windows
 * glow, the white superstructure carries a light floodlight share for its
 * deck lighting.
 */
import { Part, type V3 } from './mesh'
import { writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { box, circle, smoothWall, capPoly, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, qf, tf, earclip } from './nola-gallier-hall'
import { Pen, strokes, type Pt } from './lettering'

const white = new Part(), black = new Part(), red = new Part(), win = new Part(), green = new Part(), brass = new Part()
const wRed = new Part(), wBlack = new Part()

// ───────────────────────────── helpers ─────────────────────────────

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** An oriented box: centre c, unit axes u v w, half sizes a b d. */
function obox(p: Part, c: V3, u: V3, v: V3, w: V3, a: number, b: number, d: number) {
  const P = (i: number, j: number, k: number): V3 => add(add(add(c, u, i * a), v, j * b), w, k * d)
  const neg = (x: V3): V3 => [-x[0], -x[1], -x[2]]
  qf(p, P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1), u)
  qf(p, P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), P(-1, -1, 1), neg(u))
  qf(p, P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), P(-1, 1, 1), v)
  qf(p, P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1), neg(v))
  qf(p, P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1), w)
  qf(p, P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1), neg(w))
}
/** A bar from A to B, `t` across (horizontal side) and `h` deep. */
function bar(p: Part, A: V3, B: V3, t: number, h: number) {
  const u = norm([B[0] - A[0], B[1] - A[1], B[2] - A[2]])
  let side = crs(u, [0, 0, 1])
  if (Math.hypot(...side) < 1e-6) side = [1, 0, 0]
  const v = norm(side), w = norm(crs(v, u))
  const L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2])
  obox(p, [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2], u, v, w, L / 2, t / 2, h / 2)
}

/** A deck outline: half width w, aft yA, fore yF, front corners chamfered c (counter-clockwise). */
const deck = (w: number, yA: number, yF: number, c: number): XY[] => [[-w, yA], [w, yA], [w, yF - c], [w - c, yF], [-w + c, yF], [-w, yF - c]]

/** A railing as a solid band round a ring, `t` thick, from z0(x, y) up `h`. */
function band(p: Part, ring: XY[], z0: (q: XY) => number, h: number, t = 0.12, closed = true) {
  const n = ring.length
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
    const nx = ty, ny = -tx
    const o = (q: XY, k: number, z: number): V3 => [q[0] + nx * k * t / 2, q[1] + ny * k * t / 2, z]
    const za = z0(a), zb = z0(b)
    qf(p, o(a, 1, za), o(b, 1, zb), o(b, 1, zb + h), o(a, 1, za + h), [nx, ny, 0])
    qf(p, o(a, -1, za), o(b, -1, zb), o(b, -1, zb + h), o(a, -1, za + h), [-nx, -ny, 0])
    qf(p, o(a, 1, za + h), o(b, 1, zb + h), o(b, -1, zb + h), o(a, -1, za + h), [0, 0, 1])
  }
}
/** A deck slab: red fascia round the edge, white top and soffit. */
function slab(ring: XY[], z0: number, z1: number) {
  red.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  capPoly(white, ring, z1, true)
  capPoly(white, ring, z0, false)
}
/** Wall prism (no top): for cabins whose roof is the next deck's soffit. */
function cabin(ring: XY[], z0: number, z1: number, top = false) {
  white.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) capPoly(white, ring, z1, true)
}
/** Window panels on both long sides of a cabin of half width w, y-spans given. */
function sideWins(w: number, spans: [number, number][], z0: number, z1: number) {
  const S = faceOf([w, -100], [w, 100]), P = faceOf([-w, 100], [-w, -100])
  for (const [y0, y1] of spans) {
    fpanel(win, S, y0 + 100, y1 + 100, z0, z1)
    fpanel(win, P, 100 - y1, 100 - y0, z0, z1)
  }
}
const even = (y0: number, y1: number, n: number, w: number): [number, number][] =>
  Array.from({ length: n }, (_, k) => { const c = y0 + ((y1 - y0) * (k + 0.5)) / n; return [c - w / 2, c + w / 2] as [number, number] })

// ───────────────────────────── the hull ─────────────────────────────

const BOW = 40.5, STERN = -30.5, HW = 7.0
const sheer = (q: XY) => 1.4 + (q[1] > 20 ? ((q[1] - 20) / (BOW - 20)) ** 2 * 1.0 : 0)
const bowPts: XY[] = [[7.0, 24], [6.8, 28], [6.3, 31.5], [5.4, 34.6], [4.0, 37.4], [2.2, 39.6], [0, BOW]]
const hull: XY[] = [[-HW, STERN], [HW, STERN], ...bowPts, ...bowPts.slice(0, -1).reverse().map(([x, y]) => [-x, y] as XY)]
black.loft([hull.map(([x, y]) => [x, y, 0] as V3), hull.map((q) => [q[0], q[1], sheer(q)] as V3)])
for (const [a, b, c] of earclip(hull)) tf(white, [hull[a][0], hull[a][1], sheer(hull[a])], [hull[b][0], hull[b][1], sheer(hull[b])], [hull[c][0], hull[c][1], sheer(hull[c])], [0, 0, 1])
// the fantail arms either side of the wheel
for (const s of [-1, 1]) box(black, s > 0 ? 4.3 : -6.6, s > 0 ? 6.6 : -4.3, -40.3, STERN + 0.01, 0, 1.3, black, 0.15)
// main-deck railing round the hull edge
band(white, hull, sheer, 1.0)

// ───────────────────────────── main deck ─────────────────────────────

const MAIN_TOP = 5.0
cabin(deck(5.6, STERN + 0.2, 32.2, 1.5), 1.3, MAIN_TOP)
// one broad window per bay between the deck posts (the saloon aft, the main cabin forward)
const BAYS = Array.from({ length: 13 }, (_, k) => -25.7 + k * 4.6)
sideWins(5.6, BAYS.map((c) => [c - 1.5, c + 1.5] as [number, number]), 2.3, 4.4)
{
  const F = faceOf([4.1, 32.2], [-4.1, 32.2])
  for (const s of [1.0, 3.4, 4.8, 7.2]) fpanel(win, F, s - 0.5, s + 0.5, 2.6, 4.1)
}
// posts round the main deck edge
for (let y = -28; y <= 30; y += 4.6) for (const s of [-1, 1]) box(white, s * 6.8 - 0.13, s * 6.8 + 0.13, y - 0.13, y + 0.13, sheer([7, y]), MAIN_TOP, null, 0)

// ───────────────────────────── boiler deck ─────────────────────────────

const UP = deck(HW, STERN, 33.7, 2.5)
slab(UP, MAIN_TOP, 5.4)
band(white, UP, () => 5.4, 1.0)
cabin(deck(5.2, STERN + 1.0, 30.5, 1.4), 5.4, 8.4)
sideWins(5.2, BAYS.filter((c) => c < -20 || c > 1).map((c) => [c - 1.4, c + 1.4] as [number, number]), 6.2, 8.0)
{
  const F = faceOf([3.8, 30.5], [-3.8, 30.5])
  for (const s of [1.2, 3.0, 4.6, 6.4]) fpanel(win, F, s - 0.6, s + 0.6, 6.4, 7.9)
}
// the "NATCHEZ." name panels: solid white wall out to the deck edge
for (const s of [-1, 1]) box(white, s > 0 ? 6.82 : -7.0, s > 0 ? 7.0 : -6.82, -19.5, -0.5, 5.4, 8.4, null, 0)
// "NATCHEZ." on both name panels: heavy slab-serif capitals in black with
// a red drop shade below and to the right, traced from the Spragg photos
// (cap height 1.7 m, the word ~16 m long). The name is the boat's sign.
{
  const pen = new Pen(), W = 0.7, S = 0.17
  const serif = (x: number, y: number) => pen.moveTo([x - S, y]).lineTo([x + S, y])
  const glyphs: Record<string, (x: number) => void> = {
    N: (x) => { pen.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + W, 0]).lineTo([x + W, 1]); serif(x, 0); serif(x, 1); serif(x + W, 1) },
    A: (x) => { pen.moveTo([x, 0]).lineTo([x + W / 2, 1]).lineTo([x + W, 0]); pen.moveTo([x + 0.15, 0.33]).lineTo([x + W - 0.15, 0.33]); serif(x, 0); serif(x + W, 0) },
    T: (x) => { pen.moveTo([x - 0.02, 0.82]).lineTo([x - 0.02, 1]).lineTo([x + W + 0.02, 1]).lineTo([x + W + 0.02, 0.82]); pen.moveTo([x + W / 2, 1]).lineTo([x + W / 2, 0]); serif(x + W / 2, 0) },
    C: (x) => {
      const pts: Pt[] = []
      for (let i = 0; i <= 10; i++) { const a = 0.75 + (i / 10) * (2 * Math.PI - 1.5); pts.push([x + W / 2 + (W / 2) * Math.cos(a), 0.5 + 0.5 * Math.sin(a)]) }
      pen.moveTo(pts[0]); for (const q of pts.slice(1)) pen.lineTo(q)
    },
    H: (x) => { pen.moveTo([x, 0]).lineTo([x, 1]); pen.moveTo([x + W, 0]).lineTo([x + W, 1]); pen.moveTo([x, 0.5]).lineTo([x + W, 0.5]); serif(x, 0); serif(x, 1); serif(x + W, 0); serif(x + W, 1) },
    E: (x) => { pen.moveTo([x + W, 0.8]).lineTo([x + W, 1]).lineTo([x, 1]).lineTo([x, 0]).lineTo([x + W, 0]).lineTo([x + W, 0.2]); pen.moveTo([x, 0.52]).lineTo([x + W * 0.7, 0.52]); serif(x, 0); serif(x, 1) },
    Z: (x) => { pen.moveTo([x, 0.8]).lineTo([x, 1]).lineTo([x + W, 1]).lineTo([x, 0]).lineTo([x + W, 0]).lineTo([x + W, 0.2]) },
    '.': (x) => { pen.moveTo([x + 0.1, 0.02]).lineTo([x + 0.1, 0.2]) },
  }
  const word = 'NATCHEZ.', ADV = 1.3
  word.split('').forEach((ch, i) => glyphs[ch](i * ADV))
  const len = (word.length - 1) * ADV + 0.2, CAP = 1.7, MID = -10, Z0 = 6.05
  for (const side of [-1, 1]) {
    // on the starboard face the reader's right is toward the bow (+y); on the port face toward the stern
    const place = (du: number, dv: number) => (u: number, v: number, w: number): V3 =>
      [side * (7.0 + w), MID + side * ((u + du - len / 2) * CAP), Z0 + (v + dv) * CAP]
    strokes(red, pen.paths, { width: 0.2, depth: 0.04, place: place(0.07, -0.08) })
    strokes(black, pen.paths, { width: 0.2, depth: 0.08, place: place(0, 0) })
  }
}
for (let y = -28; y <= 31; y += 4.6) {
  if (y > -20 && y < 0) continue
  for (const s of [-1, 1]) box(white, s * 6.85 - 0.12, s * 6.85 + 0.12, y - 0.12, y + 0.12, 5.4, 8.4, null, 0)
}

// ───────────────────────────── hurricane deck ─────────────────────────────

slab(UP, 8.4, 8.8)
band(white, UP, () => 8.8, 1.0)
// texas cabin, behind the stacks, its roof the sun deck the pilot house stands on
const TEXAS = deck(4.6, -4.5, 14.5, 0.6)
cabin(TEXAS, 8.8, 11.2, false)
slab(deck(4.9, -4.8, 14.8, 0.7), 11.2, 11.45)
sideWins(4.6, even(-4, 14, 6, 1.6), 9.6, 10.8)
{
  const F = faceOf([4.0, 14.5], [-4.0, 14.5])
  for (const s of [1.6, 4.0, 6.4]) fpanel(win, F, s - 0.6, s + 0.6, 9.6, 10.8)
}
// the green awning over the aft top deck, on posts
box(green, -5.6, 5.6, -21, -4.8, 11.25, 11.6, green, 0.12)
for (const x of [-5.3, 5.3]) for (const y of [-20.7, -15.4, -10.1]) box(white, x - 0.12, x + 0.12, y - 0.12, y + 0.12, 8.8, 11.25, null, 0)
// pilot house
box(white, -2.4, 2.4, 4.6, 9.4, 11.45, 14.6, null, 0)
{
  const r: XY[] = [[-2.4, 4.6], [2.4, 4.6], [2.4, 9.4], [-2.4, 9.4]]
  for (let i = 0; i < 4; i++) { const F = faceOf(r[i], r[(i + 1) % 4]); fpanel(win, F, 0.35, F.L - 0.35, 12.6, 14.1) }
}
box(white, -3.0, 3.0, 4.0, 10.0, 14.6, 14.95, white, 0.1)
box(red, -1.0, 1.0, 6.0, 8.0, 14.95, 15.4, red, 0.1) // the pilot house's lantern cap
// the calliope on the texas roof: a stepped bank of brass pipes
for (let k = 0; k < 4; k++) box(brass, -1.0 + k * 0.5, -0.5 + k * 0.5, -3.6, -1.8, 11.45, 12.3 + k * 0.25, brass, 0.05)

// ───────────────────────────── smokestacks ─────────────────────────────

for (const s of [-1, 1]) {
  const c: XY = [s * 3.4, 16.5], n = 12
  smoothWall(black, circle(c, 0.6, n), 8.8, 17.8)
  // the crown: a flare to 1.0 m, then eight feathered points
  const r0 = circle(c, 0.6, n), r1 = circle(c, 1.0, n)
  black.loft([r0.map(([x, y]) => [x, y, 17.8] as V3), r1.map(([x, y]) => [x, y, 18.6] as V3)])
  smoothWall(black, r1, 18.6, 18.8)
  capPoly(black, circle(c, 0.85, n), 18.7, true)
  // inside face of the crown ring, so it reads as a hollow crown
  const ri = circle(c, 0.85, n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    qf(black, [r1[i][0], r1[i][1], 18.8], [r1[j][0], r1[j][1], 18.8], [ri[j][0], ri[j][1], 18.8], [ri[i][0], ri[i][1], 18.8], [0, 0, 1])
  }
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a)
    const base: V3 = [c[0] + 0.93 * ca, c[1] + 0.93 * sa, 18.75]
    const tip: V3 = [c[0] + 1.15 * ca, c[1] + 1.15 * sa, 19.6]
    const t: V3 = [-sa * 0.2, ca * 0.2, 0], o: V3 = [ca * 0.12, sa * 0.12, 0]
    const b1 = add(add(base, t), o, -1), b2 = add(add(base, t, -1), o, -1), b3 = add(add(base, t, -1), o), b4 = add(add(base, t), o)
    tf(black, b1, b2, tip, add([0, 0, 0], o, -1))
    tf(black, b3, b4, tip, o)
    tf(black, b2, b3, tip, add([0, 0, 0], t, -1))
    tf(black, b4, b1, tip, t)
  }
}

// ───────────────────────────── bow stage and pitman arms ─────────────────────────────

bar(white, [0, 33.0, 2.3], [0, 43.5, 5.6], 1.8, 0.18) // the stage, raised over the bow
bar(white, [0, 33.4, 1.8], [0, 33.4, 9.5], 0.3, 0.3) // its derrick mast
bar(white, [0, 33.4, 9.4], [0, 43.3, 5.7], 0.12, 0.12) // the boom fall
const AXLE: V3 = [0, -35.6, 4.2]
for (const s of [-1, 1]) bar(white, [s * 4.6, -27.0, 6.4], [s * 4.6, AXLE[1], AXLE[2]], 0.3, 0.45)

// ───────────────────────────── the sternwheel (its own node) ─────────────────────────────

{
  const R = 4.2, HALF = 4.0, NB = 16
  const radial = (a: number): V3 => [0, Math.cos(a), Math.sin(a)]
  const tang = (a: number): V3 => [0, -Math.sin(a), Math.cos(a)]
  const X: V3 = [1, 0, 0]
  const off = Math.PI / NB
  for (let k = 0; k < NB; k++) {
    const a = off + (k / NB) * Math.PI * 2
    obox(wRed, add([0, 0, 0], radial(a), R - 0.45), radial(a), tang(a), X, 0.45, 0.1, HALF) // bucket planks
  }
  for (const x of [-HALF + 0.1, 0, HALF - 0.1]) {
    for (let k = 0; k < NB; k++) {
      const a = (k / NB) * Math.PI * 2 + off + Math.PI / NB
      const c = add([x, 0, 0], radial(a), R - 0.35)
      obox(wRed, c, tang(a), radial(a), X, (R - 0.35) * Math.sin(Math.PI / NB) + 0.06, 0.14, 0.13) // rim
    }
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + off
      obox(wRed, add([x, 0, 0], radial(a), (R - 0.2) / 2 + 0.25), radial(a), tang(a), X, (R - 0.7) / 2, 0.1, 0.12) // arms
    }
  }
  // the shaft
  const n = 10
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2
    const P = (x: number, a: number): V3 => [x, 0.5 * Math.cos(a), 0.5 * Math.sin(a)]
    const m = (a0 + a1) / 2
    qf(wBlack, P(-4.75, a0), P(4.75, a0), P(4.75, a1), P(-4.75, a1), [0, Math.cos(m), Math.sin(m)])
    tf(wBlack, P(4.75, a0), P(4.75, a1), [4.75, 0, 0], [1, 0, 0])
    tf(wBlack, P(-4.75, a0), P(-4.75, a1), [-4.75, 0, 0], [-1, 0, 0])
  }
}

// ───────────────────────────── write ─────────────────────────────

const lit = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 && p[2] > 1.4 ? 0.35 : 0)
const WHITE = { ...PALETTE.trim, color: 0xfaf3e8, floodlight: lit }
const BLACK = finish('natchez-black', 0x4a4f57)
const RED = finish('natchez-red', 0xc8453b)
const parts = [
  { part: white, material: WHITE },
  { part: black, material: BLACK },
  { part: red, material: RED },
  { part: win, material: PALETTE.window },
  { part: green, material: finish('natchez-awning', 0x4f6a63) },
  { part: brass, material: finish('calliope-brass', 0xb8964f) },
]
const wheel = [{ part: wRed, material: RED }, { part: wBlack, material: BLACK }]
const tris = [...parts, ...wheel].reduce((s, p) => s + p.part.triangles, 0)
if (tris > 5000) throw new Error(`nola-steamboat-natchez: ${tris} triangles`)
const glb = writeGlb('Steamboat Natchez', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the waterline anchor', bearing: 22.3, height: 19.6,
}, { nodes: [{ name: 'sternwheel', translation: AXLE, parts: wheel }] })
if (glb.length > 250000) throw new Error(`nola-steamboat-natchez: ${glb.length} bytes`)
await Bun.write(new URL('../models/nola-steamboat-natchez.glb', import.meta.url).pathname, glb)
console.log([...parts, ...wheel].map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`nola-steamboat-natchez.glb: ${tris} triangles, ${glb.length} bytes`)
