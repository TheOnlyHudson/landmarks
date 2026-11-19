/**
 * Uniroyal Giant Tire, Allen Park, Michigan — procedural, CC0-1.0, no
 * textures.  bun generators/det-uniroyal-tire.ts
 *
 * Built as the Ferris wheel of the U.S. Rubber pavilion at the 1964–65 New
 * York World's Fair, moved beside I-94 in 1966 and turned into a giant
 * tyre; renovated in 2003 with the present 15-vent hubcap and the raised
 * white UNIROYAL letters.
 *
 * Frame: map frame turned to bearing 50°. The tyre's axle runs along the
 * model's y axis, and its lettered, hubcapped face looks along +y, which
 * is compass 50° (north-east, toward westbound I-94 traffic, as in every
 * photo). The tyre stands in the model's x–z plane. Origin at the tyre's
 * centre in plan, on the ground (the concrete pad, which is the map's).
 *
 * Evidence
 * - OSM: node/2177195823 (tourism=attraction, wikidata Q7886992). No
 *   building is mapped, so `replaces` is empty.
 * - Lidar, USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid:
 *   top 24.2 m above the pad; tyre width about 8 m; plane of the tyre at
 *   bearing 140° (axle 50°), from the principal axis of the returns above
 *   14 m; centre at (-0.9, 4.9) m from -83.20905, 42.27050.
 * - USGS NAIP orthophoto (0.1 m resample): the hubcap shows on the
 *   north-east face; the tyre stands in the north-west corner of its
 *   square pad.
 * - Published: 80 ft (24 m) tall, about 12 tons; Ferris wheel of the
 *   1964 World's Fair; 2003 renovation (Wikipedia, "Uniroyal Giant Tire").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Uniroyal tire in Allen Park taken from car.jpg", Gregory Varnum (CC BY-SA
 *     3.0): the face from the north-east, hubcap, letters, tread, plinth.
 *     https://commons.wikimedia.org/wiki/File:Uniroyal_tire_in_Allen_Park_taken_from_car.jpg
 *   - "UniroyalGiantTire2015.jpg", Dethistoricaler (CC BY 3.0): the face and
 *     tread from the north.
 *     https://commons.wikimedia.org/wiki/File:UniroyalGiantTire2015.jpg
 *   - "President Joe Biden's motorcade passing the Uniroyal Giant Tire in
 *     Allen Park, MI.jpg", Adam Schultz, The White House (public domain).
 *     https://commons.wikimedia.org/wiki/File:President_Joe_Biden%27s_motorcade_passing_the_Uniroyal_Giant_Tire_in_Allen_Park,_MI.jpg
 *   - "Uniroyal tire, Dearborn, Michigan LCCN2017707752.tif", John
 *     Margolies (public domain, Library of Congress): the 1960s–90s
 *     whitewall version, for history only.
 *     https://commons.wikimedia.org/wiki/File:Uniroyal_tire,_Dearborn,_Michigan_LCCN2017707752.tif
 *
 * Numbers
 * - Measured (lidar): overall height 24.3 m (centre 12.15 m), width 8 m,
 *   orientation.
 * - Estimated from the car photo, scaled to the 24.3 m diameter: hubcap
 *   diameter 0.57 of the tyre (13.8 m); 15 vents between r 4.2 and 6.4 m;
 *   letters about 2.3 m tall on a 9.0 m baseline radius, spanning from
 *   about 10 to 2 o'clock; the grey plinth in front of the tyre's foot,
 *   about 1 m tall.
 * - Tread: bold staggered shoulder lugs and two circumferential grooves,
 *   drawn bolder and sparser than the real tread (STYLE.md: bold, not
 *   fine). The small "uniroyal.com" line under the letters is left out.
 * - Lettering: the raised UNIROYAL is the sign that makes it the Uniroyal
 *   tyre, so it is drawn (STYLE.md, "Famous signs"): a bold extended
 *   sans, letters traced from the car photo with generators/lettering.ts.
 *
 * Colours: the tyre charcoal at the style's limit (#4a4f57); hubcap silver
 * grey, its vents mid grey; letters `trim` white; plinth `roof` grey.
 * Night: the face is floodlit from the lamp posts in front of it, so the
 * north-east face carries _FLOODLIGHT.
 *
 * Doubts: no licensed photo shows the south-west (back) face; it is drawn
 * as a plain sidewall closed by a dark hub disc, with no hubcap or
 * letters. The plinth's extent behind the tyre is a guess.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'

const C = 12.15 // axle height = tyre radius
const N = 48 // segments round the tyre

const tyre = new Part(), cap = new Part(), vent = new Part(), letters = new Part(), plinth = new Part()

type RY = [number, number]
const P3 = (r: number, y: number, th: number): V3 => [r * Math.cos(th), y, C + r * Math.sin(th)]

/**
 * Revolve a profile of (r, y) points about the axle. Walking along the
 * profile, the outside lies to the left in the (r, y) plane when `side` is
 * 1, to the right when -1. Edges meeting at more than ~35° keep separate
 * normals (a crease).
 */
function revolve(part: Part, prof: RY[], n: number, side: 1 | -1, th0 = 0, th1 = 2 * Math.PI) {
  const en: RY[] = []
  for (let i = 0; i < prof.length - 1; i++) {
    const [r0, y0] = prof[i], [r1, y1] = prof[i + 1]
    const l = Math.hypot(r1 - r0, y1 - y0) || 1
    en.push([(side * -(y1 - y0)) / l, (side * (r1 - r0)) / l])
  }
  const vn = (i: number, end: 0 | 1): RY => {
    const e = en[i], o = en[end ? i + 1 : i - 1]
    if (!o || e[0] * o[0] + e[1] * o[1] < 0.82) return e
    const s: RY = [e[0] + o[0], e[1] + o[1]], l = Math.hypot(...s)
    return [s[0] / l, s[1] / l]
  }
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i], b = prof[i + 1], na = vn(i, 0), nb = vn(i, 1)
    for (let k = 0; k < n; k++) {
      const t0 = th0 + ((th1 - th0) * k) / n, t1 = th0 + ((th1 - th0) * (k + 1)) / n
      const N3 = (m: RY, th: number): V3 => [m[0] * Math.cos(th), m[1], m[0] * Math.sin(th)]
      const A0 = P3(a[0], a[1], t0), A1 = P3(a[0], a[1], t1), B0 = P3(b[0], b[1], t0), B1 = P3(b[0], b[1], t1)
      if (a[0] > 1e-6) part.tri(A0, A1, B1, undefined, undefined, undefined, [N3(na, t0), N3(na, t1), N3(nb, t1)])
      if (b[0] > 1e-6 || a[0] > 1e-6) part.tri(A0, B1, B0, undefined, undefined, undefined, [N3(na, t0), N3(nb, t1), N3(nb, t0)])
    }
  }
}

// ---------------------------------------------------------------------------
// The tyre: face rim → bulging sidewall → shoulder → tread (two grooves) →
// back shoulder → back sidewall → back rim. Outward = away from the torus
// core at r 9.8, y 0.
const TREAD = 11.85
revolve(tyre, [
  [6.95, 3.55], [7.6, 3.85], [8.6, 4.05], [9.8, 4.12], [10.9, 3.95], [11.5, 3.6], [11.8, 3.15],
  [TREAD, 2.6], [TREAD, 0.95], [TREAD - 0.25, 0.85], [TREAD - 0.25, 0.45], [TREAD, 0.35],
  [TREAD, -0.35], [TREAD - 0.25, -0.45], [TREAD - 0.25, -0.85], [TREAD, -0.95], [TREAD, -2.6],
  [11.8, -3.15], [11.5, -3.6], [10.9, -3.95], [9.8, -4.12], [8.6, -4.05], [7.6, -3.85], [6.95, -3.55],
], N, 1)
// The back hub: a dark disc closing the wheel.
revolve(tyre, [[6.95, -3.55], [0, -3.3]], N, 1)

// Shoulder lugs: bold blocks on both shoulders, staggered by half a pitch.
{
  const LUGS = 36
  for (const side of [1, -1]) for (let k = 0; k < LUGS; k++) {
    const th = ((k + (side > 0 ? 0 : 0.5)) / LUGS) * 2 * Math.PI, dw = (2 * Math.PI) / LUGS * 0.27
    const y0 = side * 1.25, y1 = side * 2.75
    const r0 = TREAD - 0.02, r1 = C
    // The block: its top on r1 and four sides; the base is inside the tyre.
    const c = (r: number, y: number, t: number) => P3(r, y, t)
    const t0 = th - dw, t1 = th + dw
    const top = [c(r1, y0, t0), c(r1, y0, t1), c(r1, y1, t1), c(r1, y1, t0)]
    const bot = [c(r0, y0, t0), c(r0, y0, t1), c(r0, y1, t1), c(r0, y1, t0)]
    const radial: V3 = [Math.cos(th), 0, Math.sin(th)], tang: V3 = [-Math.sin(th), 0, Math.cos(th)]
    const face = (q: V3[], n: V3) => {
      tyre.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
      tyre.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
    }
    face(top, radial)
    face([bot[0], bot[1], top[1], top[0]], [0, -side, 0].map((v) => v) as V3) // inner end (toward the centreline)
    face([bot[3], bot[2], top[2], top[3]], [0, side, 0])
    face([bot[0], bot[3], top[3], top[0]], [-tang[0], 0, -tang[2]])
    face([bot[1], bot[2], top[2], top[1]], tang)
  }
}

// ---------------------------------------------------------------------------
// The hubcap on the face: a white lip, then a shallow dome to a flat hub.
const HUB = 6.95
revolve(cap, [[HUB, 3.55], [HUB - 0.1, 3.95], [6.3, 4.05], [4.2, 4.35], [2.3, 4.6], [2.1, 4.75], [0, 4.8]], N, -1)

// Fifteen vents: flush darker trapezoids in the dome, wider at the rim.
{
  const n = 15
  const dome = (r: number) => (r > 6.3 ? 4.05 : r > 4.2 ? 4.05 + ((6.3 - r) / 2.1) * 0.3 : 4.35 + ((4.2 - r) / 1.9) * 0.25)
  for (let k = 0; k < n; k++) {
    const th = (k / n) * 2 * Math.PI + Math.PI / 2
    const pts: [number, number][] = [[4.3, -0.065], [6.1, -0.14], [6.1, 0.14], [4.3, 0.065]] // [r, half-angle]
    const q = pts.map(([r, a]) => P3(r, dome(r) + 0.07, th + a))
    const m: V3 = [0, 1, 0]
    vent.tri(q[0], q[1], q[2], undefined, undefined, undefined, [m, m, m])
    vent.tri(q[0], q[2], q[3], undefined, undefined, undefined, [m, m, m])
  }
}

// ---------------------------------------------------------------------------
// UNIROYAL, raised white letters round the top of the sidewall. Bold
// extended sans: cap height 1, stroke 0.26, letters about one cap wide.
{
  const S = 0.26, h = S / 2
  const glyphs: Record<string, [number, (p: Pen) => void]> = {
    U: [1.0, (p) => { p.moveTo([h, 1]).lineTo([h, 0.5]).arc([0.5, 0.5], Math.PI, 8).lineTo([1 - h, 1]) }],
    N: [1.0, (p) => { p.moveTo([h, 0]).lineTo([h, 1]).lineTo([1 - h, 0]).lineTo([1 - h, 1]) }],
    I: [S, (p) => { p.moveTo([h, 0]).lineTo([h, 1]) }],
    R: [0.96, (p) => {
      p.moveTo([h, 0]).lineTo([h, 1 - h]).lineTo([0.6, 1 - h]).arc([0.6, 0.73], -Math.PI, 6).lineTo([h, 0.46])
      p.moveTo([0.5, 0.46]).lineTo([0.96 - h, 0])
    }],
    O: [1.04, (p) => { p.circle([0.52, 0.5], 0.52 - h, 0.5 - h, 16) }],
    Y: [1.0, (p) => { p.moveTo([0.08, 1]).lineTo([0.5, 0.5]).lineTo([0.92, 1]); p.moveTo([0.5, 0.5]).lineTo([0.5, 0]) }],
    A: [1.04, (p) => { p.moveTo([0.06, 0]).lineTo([0.52, 1]).lineTo([0.98, 0]); p.moveTo([0.27, 0.32]).lineTo([0.77, 0.32]) }],
    L: [0.86, (p) => { p.moveTo([h, 1]).lineTo([h, h]).lineTo([0.86, h]) }],
  }
  const word = 'UNIROYAL', gap = 0.2
  const pen = new Pen()
  let u = 0
  for (const ch of word) {
    const [w, draw] = glyphs[ch]
    const g = new Pen()
    draw(g)
    pen.add(g, u, 0)
    u += w + gap
  }
  const total = u - gap
  const CAP = 2.5, RB = 8.85, RM = RB + CAP / 2, Y0 = 3.92, DEPTH = 0.4
  // Reader's right on the face (seen from +y) is -x.
  const place = (uu: number, v: number, w: number): V3 => {
    const phi = Math.PI / 2 + ((total / 2 - uu) * CAP) / RM
    const r = RB + v * CAP
    return [-r * Math.cos(phi), Y0 + w * DEPTH, C + r * Math.sin(phi)]
  }
  strokes(letters, pen.paths, { width: S, depth: 1, place })
}

// The grey plinth at the tyre's foot, wider than the tread.
{
  const bx = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const p = (x: number, y: number, z: number): V3 => [x, y, z]
    const f = (a: V3, b: V3, c: V3, d: V3) => plinth.quad(a, b, c, d)
    f(p(x0, y0, z0), p(x1, y0, z0), p(x1, y0, z1), p(x0, y0, z1))
    f(p(x1, y1, z0), p(x0, y1, z0), p(x0, y1, z1), p(x1, y1, z1))
    f(p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1), p(x1, y0, z1))
    f(p(x0, y1, z0), p(x0, y0, z0), p(x0, y0, z1), p(x0, y1, z1))
    f(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1))
  }
  bx(-4.5, 4.5, -5.2, 5.2, 0, 1.0)
}

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (p[1] > 2.5 && n[1] > 0.3 ? 0.85 : 0)
const parts = [
  { part: tyre, material: { ...finish('tyre-charcoal', 0x4a4f57, 0.9), floodlight: lit } },
  { part: cap, material: { ...finish('hubcap-silver', 0xd9dcde, 0.5), floodlight: lit } },
  { part: vent, material: { ...finish('hubcap-vent', 0x8e979e, 0.6), floodlight: lit } },
  { part: letters, material: { ...PALETTE.trim, floodlight: lit } },
  { part: plinth, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Uniroyal Giant Tire', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 50, osm: 'node/2177195823', height: 24.3,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/det-uniroyal-tire.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
