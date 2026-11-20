/**
 * Allianz Field (Populous, 2019), 400 Snelling Avenue, Saint Paul: the home of
 * Minnesota United FC. Procedural, CC0-1.0.
 * bun generators/msp-allianz-field.ts [out.glb]
 *
 * Frame: bearing 0 (the pitch runs exactly north-south in the lidar: its
 * low, flat surface fits an 80 x 123 m box best at 0 degrees, centred on the
 * anchor). x east, y north, z up here. The origin is the area centroid of the
 * OSM outer way 588533245 (-93.164672, 44.953096). y = 0 is the field (lidar
 * 277.2 m); the streets round the stadium are about 5.5 m higher in the
 * lidar, but no published field level or drawing was found, so `elevation`
 * is 0 as the brief requires (see Doubts).
 *
 * What makes it itself: a closed oval bowl wrapped in a white PTFE skin of
 * overlapping angled panels (the "woven" look, drawn here as alternately
 * tilted facets), under a continuous white roof canopy that is highest along
 * the sides and the south end (29.7 m) and dips to a low lip over the north
 * end's stand (about 16.6 m); the skin is lit in colours at night (neon).
 *
 * Sources
 * - OSM (ODbL): relation/8302605 (building=stadium, name Allianz Field), outer
 *   way 588533245 (the skin's line, followed as drawn) and inner way
 *   588533249 (a pitch outline that is skewed some 20 degrees against the
 *   lidar's pitch, so not used for shape).
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022, three years after
 *   opening), 1 m grid. Measured per 7.5 degrees round the centre (table
 *   below): the canopy's inner edge distance and height, and the roof's
 *   outer edge height 2.5 m inside the outline.
 * - USGS NAIP (public domain) was not needed beyond the lidar for the plan.
 * - Photos (Wikimedia Commons), compared side by side with renders:
 *   Thomson200, "Allianz Field Aug 2022.jpg", CC0 (from the south-east across
 *     the lot: the white skin, the canopy's dark underside rising over the
 *     sides, the low north end);
 *   Joe Haupt, "Allianz Field construction c2018.jpg", CC BY-SA 2.0 (the skin
 *     and roof from the east, nearly complete);
 *   Chad Davis, "Allianz Field, National Guard (51125916759).jpg", CC BY 2.0
 *     (the skin close up, its angled panels);
 *   Andy Witchger, "Allianz Field - MNUFC Minnesota United st. Paul
 *     Minnesota MLS (40636734693).jpg", CC BY 2.0 (inside: dark canopy
 *     underside, grey seats, the suites' glass band);
 *   Eóin, "MLS All Star Game at Allianz Field.jpg", CC BY-SA 4.0 (night: the
 *     skin lit blue and violet).
 * Published: opened 2019, 19,400 seats, Populous (Wikipedia, "Allianz Field").
 * Estimated: the seat rake (from the field's edge at 1 m to 6.5 m below the
 *   canopy's edge), the suites' glass band (4 m) under the canopy, the canopy's
 *   thickness (1.5 m), the facet tilt (0.35 m) standing for the panels.
 * Left out: the pitch (the map's), the video board, the gates, signs and
 *   lettering, light rigs.
 * Doubts: few licensed exterior photos exist (none from the west or north
 *   close up); the skin's panel pattern is abstracted. Lidar puts the field
 *   about 5.5 m below the surrounding streets; with `elevation` 0 the map
 *   sets the field on its own lowest terrain under the footprint, so the
 *   stadium may stand up to that much too tall if the terrain shows no pit.
 * Night: the skin is `neon-allianz-skin` (lit by day colour, white; the
 *   real lighting changes colour); the suites' glass is `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, finishGlb, writeModel } from './sea-tacoma-union-station'

const OUTER: XY[] = [[-42.0, 92.8], [-29.6, 95.0], [-18.5, 96.4], [-6.0, 97.8], [6.5, 97.9], [19.9, 96.8], [28.8, 95.0], [39.9, 92.0], [54.0, 86.9], [64.6, 76.2], [70.3, 62.9], [73.8, 49.7], [76.0, 37.0], [78.3, 21.9], [78.9, 9.7], [79.2, -0.2], [78.9, -10.5], [77.7, -20.5], [76.6, -33.2], [74.5, -48.7], [70.3, -61.8], [66.4, -70.0], [64.2, -74.7], [53.4, -85.5], [40.4, -90.2], [28.9, -92.7], [17.9, -94.1], [7.1, -95.0], [-7.0, -95.3], [-20.0, -94.7], [-31.7, -93.7], [-44.1, -91.2], [-57.2, -85.0], [-68.3, -72.7], [-74.1, -59.8], [-77.4, -43.0], [-80.1, -24.2], [-81.3, -8.0], [-81.5, 10.0], [-80.6, 22.7], [-78.9, 32.8], [-76.9, 44.8], [-74.5, 54.3], [-71.3, 65.5], [-66.2, 76.2], [-56.1, 86.6]]

// Lidar, every 7.5 degrees counter-clockwise from east: [canopy inner edge
// distance from the centre, its height, the roof's outer edge height].
const T: [number, number, number][] = [
  [46, 29.6, 26.5], [47, 29.6, 26.4], [48, 29.5, 26.4], [50, 29.5, 26.0], [52, 29.2, 25.3], [56, 28.8, 24.0],
  [61, 27.9, 22.4], [69, 26.8, 20.7], [76, 24.8, 19.0], [83, 21.1, 17.2], [87, 18.3, 16.0], [90, 16.8, 15.3],
  [90, 16.6, 14.9], [90, 16.7, 15.3], [89, 18.0, 15.8], [84, 20.8, 16.9], [77, 24.4, 18.7], [66, 27.4, 20.6],
  [57, 28.5, 22.4], [51, 29.2, 23.8], [47, 29.5, 24.7], [44, 29.7, 25.8], [42, 29.7, 26.0], [41, 29.7, 26.0],
  [41, 29.7, 26.0], [41, 29.7, 26.0], [42, 29.7, 26.0], [44, 29.7, 25.9], [48, 29.7, 25.9], [51, 29.7, 26.3],
  [58, 29.7, 26.6], [67, 29.8, 26.6], [72, 29.5, 26.7], [71, 29.4, 26.6], [69, 29.4, 26.7], [68, 29.4, 26.7],
  [67, 29.4, 26.8], [68, 29.4, 26.7], [69, 29.4, 26.8], [70, 29.5, 26.7], [71, 29.5, 26.7], [66, 29.5, 26.7],
  [61, 29.5, 26.6], [56, 29.6, 26.5], [52, 29.5, 25.5], [49, 29.6, 26.5], [48, 29.6, 26.5], [47, 29.6, 26.5],
]
const FIELD_X = 40, FIELD_Y = 61.5 // the pitch's run-off edge (lidar)
const N = 96 // stations round the bowl
const SK = 1.8 // the skin stands this far inside the roof's edge (estimated from the photos)

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A quad (or triangle), wound to face along `out`. */
const face = (p: Part, P: V3[], out: V3) => {
  const q = dot(cross(sub(P[1], P[0]), sub(P[2], P[0])), out) < 0 ? [...P].reverse() : P
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** Distance from the centre to the outline along angle th. */
function rayOuter(th: number) {
  const dx = Math.cos(th), dy = Math.sin(th)
  let best = Infinity
  for (let i = 0; i < OUTER.length; i++) {
    const [x1, y1] = OUTER[i], [x2, y2] = OUTER[(i + 1) % OUTER.length]
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (x1 * ey - y1 * ex) / den, u = (x1 * dy - y1 * dx) / den
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t)
  }
  return best
}
function table(th: number) {
  const f = (((th * 180) / Math.PI / 7.5) % 48 + 48) % 48, i = Math.floor(f), t = f - i
  const a = T[i], b = T[(i + 1) % 48]
  return a.map((v, k) => v + (b[k] - v) * t) as [number, number, number]
}

export function build() {
  const skin = new Part(), roof = new Part(), under = new Part(), seats = new Part(), win = new Part(), trim = new Part()

  type St = { d: XY; F: number; I: number; O: number; hi: number; ho: number; hs: number }
  const st: St[] = []
  for (let k = 0; k < N; k++) {
    const th = (k / N) * Math.PI * 2, d: XY = [Math.cos(th), Math.sin(th)]
    const F = Math.min(FIELD_X / Math.max(Math.abs(d[0]), 1e-6), FIELD_Y / Math.max(Math.abs(d[1]), 1e-6))
    const O = rayOuter(th)
    const [inner, hi, ho] = table(th)
    const I = Math.min(Math.max(inner, F + 1.5), O - 6)
    st.push({ d, F, I, O, hi, ho, hs: Math.max(3, hi - 6.5) })
  }
  const P = (s: St, r: number, z: number): V3 => [s.d[0] * r, s.d[1] * r, z]

  for (let k = 0; k < N; k++) {
    const a = st[k], b = st[(k + 1) % N]
    const mid: XY = [(a.d[0] + b.d[0]) / 2, (a.d[1] + b.d[1]) / 2]
    const outN: V3 = [mid[0], mid[1], 0], inN: V3 = [-mid[0], -mid[1], 0]
    // the seats, raked from the field's edge up to the suites
    face(seats, [P(a, a.F, 1), P(b, b.F, 1), P(b, b.I, b.hs), P(a, a.I, a.hs)], [inN[0], inN[1], 1])
    // the low wall at the field's edge
    face(trim, [P(a, a.F, 0), P(b, b.F, 0), P(b, b.F, 1), P(a, a.F, 1)], inN)
    // the suites' and concourse glass under the canopy
    face(win, [P(a, a.I, a.hs), P(b, b.I, b.hs), P(b, b.I, b.hi - 2.6), P(a, a.I, a.hi - 2.6)], inN)
    face(under, [P(a, a.I, a.hi - 2.6), P(b, b.I, b.hi - 2.6), P(b, b.I, b.hi - 1.5), P(a, a.I, a.hi - 1.5)], inN)
    // the canopy: white fascia, dark underside, white top
    face(trim, [P(a, a.I, a.hi - 1.5), P(b, b.I, b.hi - 1.5), P(b, b.I, b.hi), P(a, a.I, a.hi)], inN)
    face(under, [P(a, a.I, a.hi - 1.5), P(b, b.I, b.hi - 1.5), P(b, b.O - SK, b.ho - 1.2), P(a, a.O - SK, a.ho - 1.2)], [0, 0, -1])
    face(roof, [P(a, a.I, a.hi), P(b, b.I, b.hi), P(b, b.O, b.ho), P(a, a.O, a.ho)], [0, 0, 1])
    // the skin: two bands of facets tilted alternately in and out (the woven panels)
    const zm = (s: St) => s.ho * 0.5
    const ta = (k % 2 === 0 ? 1 : -1) * 0.35, tb = -ta // per station, so neighbours share their edges
    const A0 = P(a, a.O - SK - ta, 0), B0 = P(b, b.O - SK - tb, 0)
    const A1 = P(a, a.O - SK + ta, zm(a)), B1 = P(b, b.O - SK + tb, zm(b))
    const A2 = P(a, a.O - SK - ta, a.ho - 1.2), B2 = P(b, b.O - SK - tb, b.ho - 1.2)
    face(skin, [A0, B0, B1], outN); face(skin, [A0, B1, A1], outN)
    face(skin, [A1, B1, B2], outN); face(skin, [A1, B2, A2], outN)
    // the roof's overhang: a white fascia at the edge, a dark soffit back to the skin
    face(trim, [P(a, a.O, a.ho - 0.7), P(b, b.O, b.ho - 0.7), P(b, b.O, b.ho), P(a, a.O, a.ho)], outN)
    face(under, [A2, B2, P(b, b.O, b.ho - 0.7), P(a, a.O, a.ho - 0.7)], [0, 0, -1])
  }

  return finishGlb('Allianz Field', [
    { part: skin, material: finish('neon-allianz-skin', 0xe9ecef) },
    { part: roof, material: finish('allianz-roof', 0xdfe2e5) },
    { part: under, material: finish('allianz-canopy-underside', 0x5c636c) },
    { part: seats, material: finish('allianz-seats', 0x6a737d) },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
  ], {
    bearing: 0, height: 29.8,
    replaces: ['relation/8302605'],
  })
}

if (import.meta.main) await writeModel('msp-allianz-field', build())
