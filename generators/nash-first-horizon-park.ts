/**
 * First Horizon Park (opened 2015 as First Tennessee Park; Nashville Sounds,
 * Triple-A), Nashville — Populous with Hastings — procedural, CC0-1.0, no
 * textures.  bun generators/nash-first-horizon-park.ts
 *
 * Map frame: x across the park (+x the first-base / right-field side), y from
 * home plate towards centre field, z up, metres. Placed at bearing 158°, the
 * line from home plate to centre field (OSM pitch way/469900897: home plate
 * apex at (0, -11), centre-field wall at (0, 125) in this frame). The anchor
 * is the area-weighted centroid of the three building=stadium ways
 * (way/592150009 grandstand, way/610287887 right-field stands,
 * way/642085725 left-field stands), -86.785000, 36.173020.
 *
 * z = 0 is the field. Elevation: -2.6: the field reads 2.0 m above the lidar
 * grid's lowest return and the streets round the park 4.4-4.8 m (the home
 * plate entrance plaza, Jackson Street side) and the ground behind the
 * outfield 5 m (first returns on paving), so the field is 2.5-3 m below the
 * street; the photos agree (the home-plate entrance steps up from the
 * concourse). No published field level was found. The map fills the bowl
 * to the street, so the lowest seats and the bleachers' front rows are
 * left to it: seating is drawn from 4.6 m (the terrain check).
 *
 * What makes it read as itself, from the photos:
 * - the guitar-shaped video scoreboard behind the right-centre field wall,
 *   drawn at its measured size: a 38 m guitar facing home plate, its double-
 *   bout body a video screen 19.5 m wide and 14.6 m tall in a black frame,
 *   the neck carrying the line score, the flared headstock with three tuning
 *   pegs above and three below, on black posts;
 * - the grandstand round home plate under its flat white roof, which
 *   overhangs the suite level's glass band, with the two leaning lattice
 *   light masts standing on the roof behind first and third base;
 * - navy seats, the low bleachers down both lines;
 * - the curved home-plate entrance: beige stone, a dark glass band under a
 *   silver metal fascia;
 * - pole light towers in the outfield.
 *
 * Evidence
 * - Lidar, measured: USGS 3DEP TN_DavidsonCo_1_2022 (2022), two 1 m grids
 *   (half 130 m on the anchor; half 85 m over the outfield), read in this
 *   frame. Grandstand roof 14.7 m above the field (flat), its inner edge
 *   5-6 m behind the field wall and its back 52-89 m from (0, 30) (table
 *   ROOF); the seating's front and the backstop netting 6-8 m; the
 *   concourse blocks at the ends of the roof 8-10 m; right-field bleachers
 *   4-6 m; the roof masts' heads 29 m at (-36, -10) and (36.5, -2); pole
 *   lights 33-37 m at (-67, 25), (-61.5, 102), (60, 38.5), (64.5, 125.5);
 *   the guitar: a thin line of returns from (27.5, 146) to (62, 128.5)
 *   (38.7 m), the body's top 25 m, the neck's 18-20 m, the headstock and
 *   pegs 22 m (the dark screen returns little, as usual).
 * - NAIP (USGS, public domain): plan of roof and seats, the guitar's shadow.
 * - OSM: the three building ways above and the pitch way/469900897
 *   (wikidata Q15262085, name) for the field edge, which the map draws.
 * - Published (Wikipedia, "First Horizon Park"): opened 17 April 2015;
 *   10,000 capacity; a guitar-shaped scoreboard in right-centre field, a
 *   successor to Greer Stadium's.
 * - Photos (Wikimedia Commons, NatureBoyMD, CC BY-SA 4.0 unless noted),
 *   compared with renders from their sides:
 *   "First Tennessee Park, April 17, 2015 - 13.jpg" (the guitar face on,
 *   its proportions traced from it); "First Horizon Park August 30,
 *   2022.jpg" and "First Tennessee Park, September 3, 2015 - 1.JPG" (the
 *   guitar); "First Horizon Park May 3, 2022 - 1.jpg" (the grandstand and
 *   roof masts from right field); "First Horizon Park, April 5, 2022 -
 *   1.jpg" (the outfield from the stands); "First Horizon Park, July 27,
 *   2021 - 1.jpg" and "- 2.jpg" (the home-plate entrance); "First Horizon
 *   Park September 13, 2022.jpg" (the stands, a pole light);
 *   "First Tennessee Park, April 17, 2015 - 5.jpg" (night).
 *
 * Estimated: the guitar's outline between the lidar's ends (traced from the
 * face-on photo: body 51%, neck 29%, headstock 20% of its length; the waist
 * 1.8 m deep), its posts, the seating rake (field wall 1 m to 7.5 m under
 * the roof edge), the suite band (7.5-12.5 m), the entrance's bands, the
 * masts' legs. Not drawn: the field (the map's), the netting, the lettering,
 * the "FIRST HORIZON PARK" sign over the neck, the line-score digits.
 *
 * Night: the guitar's screen, neck strip and the suite glass are `window`;
 * the light heads `neon-floodlights`.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const navy = new Part(), pale = new Part(), stone = new Part(), black = new Part(), win = new Part(), lights = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function quad(p: Part, P: V3[], hint: V3) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const o = dot(face, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    if (Math.hypot(...cross(sub(P[o[b]], P[o[a]]), sub(P[o[c]], P[o[a]]))) > 1e-9) p.tri(P[o[a]], P[o[b]], P[o[c]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number], open: number[] = []) {
  const P = (a: number, b: number, d: number) => add(add(add(c, mul(ax[0], a * h[0])), mul(ax[1], b * h[1])), mul(ax[2], d * h[2]))
  const faces: [number, number][] = [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]]
  faces.forEach(([i, sgn], f) => {
    if (open.includes(f)) return
    const o = [0, 1, 2].filter(x => x !== i)
    const corner = (a: number, b: number) => {
      const v = [0, 0, 0]
      v[i] = sgn; v[o[0]] = a; v[o[1]] = b
      return P(v[0], v[1], v[2])
    }
    quad(p, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], mul(ax[i], sgn))
  })
}
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
function bar(p: Part, a: V3, b: V3, w: number) {
  const f = unit(sub(b, a))
  const s = unit(Math.abs(f[2]) > 0.9 ? cross(f, X) : cross(f, Z))
  box(p, mul(add(a, b), 0.5), [f, s, unit(cross(f, s))], [Math.hypot(...sub(b, a)) / 2, w / 2, w / 2])
}
/** A vertical prism over a star-shaped polygon (counter-clockwise), z0 to z1. */
function prism(p: Part, ring: XY[], z0: number, z1: number, capP: Part = p, bottom = false) {
  const cx = ring.reduce((s, q) => s + q[0], 0) / ring.length, cy = ring.reduce((s, q) => s + q[1], 0) / ring.length
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    quad(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
    quad(capP, [[cx, cy, z1], [a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], z1]], Z)
    if (bottom) quad(capP, [[cx, cy, z0], [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z0]], mul(Z, -1))
  }
}

// ---------------------------------------------------------------------------
// The grandstand, in polar sections about O = (0, 30), behind the mound,
// from 204° (third-base end) round home plate (270°) to 348° (first-base
// end). Per angle: the field wall, the roof's inner edge and its back (lidar).
const O: XY = [0, 30]
const ROOF: [number, number, number, number][] = [
  // angle, field wall r, roof edge r, back r
  [204, 49.0, 55.5, 62.5], [210, 47.0, 53.5, 72.0], [216, 46.0, 52.0, 69.0], [222, 45.5, 51.0, 74.5],
  [228, 44.5, 49.0, 81.0], [234, 44.5, 50.5, 89.5], [240, 45.5, 51.5, 88.5], [246, 48.0, 53.0, 83.5],
  [252, 49.0, 55.0, 79.0], [258, 51.0, 56.0, 75.5], [264, 52.0, 56.0, 74.5], [270, 52.0, 57.0, 74.0],
  [276, 51.0, 56.5, 74.5], [282, 50.5, 56.0, 73.5], [288, 48.5, 53.5, 73.0], [294, 46.5, 52.0, 75.0],
  [300, 43.5, 50.0, 78.5], [306, 42.0, 47.5, 82.5], [312, 41.0, 46.0, 88.0], [318, 40.5, 44.0, 76.5],
  [324, 39.5, 46.0, 70.0], [330, 40.0, 46.0, 63.5], [336, 41.5, 46.5, 64.0], [342, 41.5, 47.5, 66.0],
  [348, 44.0, 50.0, 52.5],
]
const pol = (deg: number, r: number, z: number): V3 => {
  const t = (deg * Math.PI) / 180
  return [O[0] + r * Math.cos(t), O[1] + r * Math.sin(t), z]
}
const ROOF_TOP = 14.7, ROOF_BOT = 13.5, SUITE_LO = 7.5, SUITE_HI = 12.5
const ZS = 4.6 // seats drawn from here: the street plus the map's coarse ground
for (let i = 0; i < ROOF.length - 1; i++) {
  const [a0, w0, e0, b0] = ROOF[i], [a1, w1, e1, b1] = ROOF[i + 1]
  const g0 = e0 + 3, g1 = e1 + 3 // suite glass front, 3 m under the roof edge
  const out = (a: number): V3 => { const t = ((a0 + a1) / 2 * Math.PI) / 180; return [Math.cos(t), Math.sin(t), 0] }
  const n = out(0), inward = mul(n, -1)
  // seats: field wall (1 m) to the suite front (7.5 m), navy
  // (drawn from the street up: the lower rows are under the map's ground, which
  // the elevation fills to the street, see the header)
  const f = (ZS - 1) / (SUITE_LO - 1), s0 = w0 + (g0 - w0) * f, s1 = w1 + (g1 - w1) * f
  quad(navy, [pol(a0, s0, ZS), pol(a1, s1, ZS), pol(a1, g1, SUITE_LO), pol(a0, g0, SUITE_LO)], add(Z, mul(inward, 0.4)))
  quad(pale, [pol(a0, s0, 0), pol(a1, s1, 0), pol(a1, s1, ZS), pol(a0, s0, ZS)], inward) // front wall
  // suite level: glass band in a pale frame
  quad(pale, [pol(a0, g0, SUITE_LO), pol(a1, g1, SUITE_LO), pol(a1, g1, ROOF_BOT), pol(a0, g0, ROOF_BOT)], inward)
  quad(win, [pol(a0, g0 - 0.06, SUITE_LO + 0.8), pol(a1, g1 - 0.06, SUITE_LO + 0.8), pol(a1, g1 - 0.06, SUITE_HI), pol(a0, g0 - 0.06, SUITE_HI)], inward)
  // roof slab: top, underside, front edge
  quad(pale, [pol(a0, e0, ROOF_TOP), pol(a1, e1, ROOF_TOP), pol(a1, b1, ROOF_TOP), pol(a0, b0, ROOF_TOP)], Z)
  quad(pale, [pol(a0, e0, ROOF_BOT), pol(a1, e1, ROOF_BOT), pol(a1, b1, ROOF_BOT), pol(a0, b0, ROOF_BOT)], mul(Z, -1))
  quad(pale, [pol(a0, e0, ROOF_BOT), pol(a1, e1, ROOF_BOT), pol(a1, e1, ROOF_TOP), pol(a0, e0, ROOF_TOP)], inward)
  // back: behind home plate (250-290°) the curved entrance — beige stone,
  // a dark glass band, a silver metal fascia; elsewhere stone with a
  // grouped window band.
  const P = (r0: number, r1: number, z: number, d = 0) => [pol(a0, r0 + d, z), pol(a1, r1 + d, z)]
  const band = (part: Part, z0: number, z1: number, d = 0) => {
    const [p0, p1] = P(b0, b1, z0, d), [q0, q1] = P(b0, b1, z1, d)
    quad(part, [p0, p1, q1, q0], n)
  }
  band(stone, 0, ROOF_BOT)
  quad(pale, [pol(a0, b0, ROOF_BOT), pol(a1, b1, ROOF_BOT), pol(a1, b1, ROOF_TOP), pol(a0, b0, ROOF_TOP)], n)
  if (a0 >= 246 && a1 <= 294) {
    band(win, 6.2, 10.6, 0.06)
    band(pale, 10.6, ROOF_BOT, 0.06)
  } else {
    band(win, 6.5, 11.5, 0.06)
  }
}
// End walls of the roof and stand.
for (const [a, w, e, b] of [ROOF[0], ROOF[ROOF.length - 1]]) {
  const t = (a * Math.PI) / 180, side: V3 = a < 270 ? [Math.sin(t), -Math.cos(t), 0] : [-Math.sin(t), Math.cos(t), 0]
  quad(pale, [pol(a, e, ROOF_BOT), pol(a, b, ROOF_BOT), pol(a, b, ROOF_TOP), pol(a, e, ROOF_TOP)], side)
  quad(stone, [pol(a, w, 0), pol(a, b, 0), pol(a, b, ROOF_BOT), pol(a, e + 3, ROOF_BOT)], side)
  quad(stone, [pol(a, w, 0), pol(a, e + 3, ROOF_BOT), pol(a, e + 3, SUITE_LO), pol(a, w, 1)], side)
}

// Concourse blocks at the roof's ends (lidar 8-10 m), inside way/592150009.
prism(stone, [[-79, 15], [-81, 14.5], [-79, -3.2], [-75.8, -27.6], [-74.4, -48.8], [-55.6, -46.8], [-58, -20], [-62, 2]], 0, 9.5, pale)
prism(stone, [[62.8, -38.3], [79.9, -32.9], [77.9, -11.9], [74.5, 13], [73.4, 27.9], [62, 14], [58, -14]], 0, 9.5, pale)

// ---------------------------------------------------------------------------
// Bleachers down the lines (way/610287887 right field, way/642085725 left
// field): a low navy rake from the field edge (1.5 m) to 5 m, a stone back.
function bleachers(inner: XY[], outer: XY[], zf: number, zb: number) {
  for (let i = 0; i < inner.length - 1; i++) {
    const a: V3 = [...inner[i], zf], b: V3 = [...inner[i + 1], zf], c: V3 = [...outer[i + 1], zb], d: V3 = [...outer[i], zb]
    quad(navy, [a, b, c, d], Z)
    const n: V3 = [outer[i][0] - inner[i][0], outer[i][1] - inner[i][1], 0]
    quad(stone, [[outer[i][0], outer[i][1], 0], [outer[i + 1][0], outer[i + 1][1], 0], c, d], n)
    quad(pale, [[inner[i][0], inner[i][1], 0], [inner[i + 1][0], inner[i + 1][1], 0], b, a], mul(n, -1))
  }
  for (const [p, q, s] of [[inner[0], outer[0], -1], [inner[inner.length - 1], outer[outer.length - 1], 1]] as [XY, XY, number][]) {
    const along: V3 = s < 0 ? [inner[0][0] - inner[1][0], inner[0][1] - inner[1][1], 0] : [inner[inner.length - 1][0] - inner[inner.length - 2][0], inner[inner.length - 1][1] - inner[inner.length - 2][1], 0]
    quad(stone, [[p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], zb], [p[0], p[1], zf]], along)
  }
}
bleachers([[44.5, 46.3], [62.8, 66.2], [49.4, 105.2], [38, 108.4], [29, 113.5], [20.9, 121.1]],
  [[55.7, 33.0], [68.9, 66.1], [54.6, 111.8], [44.2, 113.5], [35.1, 120.4], [27.1, 128.4]], 5, 6.5)
bleachers([[-52.2, 36.1], [-71.4, 50.1], [-77.9, 63], [-76.7, 81.2], [-66.3, 90.1], [-61.0, 96.7]],
  [[-61.2, 20.7], [-83.7, 58.0], [-82.1, 62.2], [-83.9, 84.8], [-72.6, 91.5], [-63.6, 102.5]], 5, 6)

// ---------------------------------------------------------------------------
// Light masts on the grandstand roof: a leaning lattice A-frame (drawn as
// two legs and a brace) from the roof's back up to a head over the roof's
// front, 29 m (lidar), facing the field. And the pole lights in the outfield.
function head(c: V3, face: V3, w: number) {
  const s = unit(cross(Z, face))
  box(pale, c, [s, face, Z], [w / 2, 0.9, 1.7])
  quad(lights, [add(add(c, mul(face, 0.95)), add(mul(s, -w / 2 + 0.3), [0, 0, -1.4])), add(add(c, mul(face, 0.95)), add(mul(s, w / 2 - 0.3), [0, 0, -1.4])),
    add(add(c, mul(face, 0.95)), add(mul(s, w / 2 - 0.3), [0, 0, 1.4])), add(add(c, mul(face, 0.95)), add(mul(s, -w / 2 + 0.3), [0, 0, 1.4]))], face)
}
for (const [hx, hy] of [[-36, -10], [36.5, -2]] as XY[]) {
  const toField = unit([0 - hx * 0.3, 40 - hy, 0])
  const top: V3 = [hx, hy, 27.3]
  const s = unit(cross(Z, toField))
  for (const k of [-1, 1]) {
    const foot: V3 = add([hx, hy, ROOF_TOP], add(mul(toField, -11), mul(s, k * 3.5)))
    bar(pale, foot, add(top, mul(s, k * 1.2)), 0.8)
  }
  bar(pale, add([hx, hy, ROOF_TOP], mul(toField, 2)), add(top, mul(toField, -0.5)), 0.6)
  head(add(top, [0, 0, 1.5]), toField, 7)
}
for (const [x, y, h] of [[-67, 25, 37.2], [-61.5, 102, 32.8], [60, 38.5, 37.1], [64.5, 125.5, 37]] as [number, number, number][]) {
  box(pale, [x, y, (h - 2) / 2], [X, Y, Z], [0.55, 0.55, (h - 2) / 2], [5])
  head([x, y, h - 1.7], unit([-x, 40 - y, 0]), 5)
}

// ---------------------------------------------------------------------------
// The guitar scoreboard. u runs along it from the body (left, seen from home
// plate) to the headstock; n is its face, towards home plate.
{
  const A: XY = [27.5, 146], B: XY = [62, 128.5]
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: V3 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L, 0]
  const n: V3 = [u[1], -u[0], 0] // (−0.45, −0.89): towards home
  const T = 1.6 // thickness
  const P = (s: number, z: number, d = 0): V3 => [A[0] + u[0] * s + n[0] * d, A[1] + u[1] * s + n[1] * d, z]
  const BODY = 0.51 * L, NECK = 0.29 * L, HEAD = L - BODY - NECK
  const ZC = 17.7, HB = 7.3
  // Body outline: a rounded rectangle (superellipse, n = 4) with a waist.
  const outline = (inset: number): [number, number][] => {
    const pts: [number, number][] = [], M = 40
    const a = BODY / 2 - inset, b = HB - inset
    for (let k = 0; k < M; k++) {
      const t = (k / M) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
      let x = a * Math.sign(c) * Math.pow(Math.abs(c), 0.5), y = b * Math.sign(s) * Math.pow(Math.abs(s), 0.5)
      const xn = x / (BODY / 2)
      y *= 1 - 0.25 * Math.exp(-Math.pow((xn - 0.12) / 0.28, 2)) // the waist, 1.8 m deep
      if (xn > 0) y *= 1 - 0.06 * xn // the upper bout a little smaller
      pts.push([BODY / 2 + x, ZC + y])
    }
    return pts
  }
  const body = outline(0), screen = outline(1.0)
  const cs = BODY / 2
  for (let k = 0; k < body.length; k++) {
    const [s0, z0] = body[k], [s1, z1] = body[(k + 1) % body.length]
    const [t0, y0] = screen[k], [t1, y1] = screen[(k + 1) % screen.length]
    const edgeN: V3 = add(mul(u, z1 - z0), [0, 0, -(s1 - s0)])
    quad(black, [P(s0, z0, T / 2), P(s1, z1, T / 2), P(s1, z1, -T / 2), P(s0, z0, -T / 2)], mul(edgeN, -1))
    // front: frame ring and screen; back: plain black
    quad(black, [P(s0, z0, T / 2), P(s1, z1, T / 2), P(t1, y1, T / 2), P(t0, y0, T / 2)], n)
    quad(win, [P(cs, ZC, T / 2 + 0.05), P(t0, y0, T / 2 + 0.05), P(t1, y1, T / 2 + 0.05), P(t1, y1, T / 2 + 0.05)], n)
    quad(black, [P(cs, ZC, -T / 2), P(s0, z0, -T / 2), P(s1, z1, -T / 2), P(s1, z1, -T / 2)], mul(n, -1))
  }
  // Neck, with the line score strip on its face.
  box(black, P(BODY + NECK / 2 - 0.5, ZC - 0.2), [u, n, Z], [NECK / 2 + 0.5, 0.6, 1.75])
  quad(win, [P(BODY + 0.8, ZC - 1.2, 0.66), P(BODY + NECK - 0.8, ZC - 1.2, 0.66), P(BODY + NECK - 0.8, ZC + 0.9, 0.66), P(BODY + 0.8, ZC + 0.9, 0.66)], n)
  // Headstock: flaring out to its end, rounded corners cut.
  {
    const s0 = BODY + NECK, s1 = L
    const ring: [number, number][] = [[s0, ZC - 1.95], [s1 - 0.8, ZC - 2.4], [s1, ZC - 1.6], [s1, ZC + 1.6], [s1 - 0.8, ZC + 2.4], [s0, ZC + 1.95]]
    for (let k = 0; k < ring.length; k++) {
      const [a0, b0] = ring[k], [a1, b1] = ring[(k + 1) % ring.length]
      quad(black, [P(a0, b0, 0.8), P(a1, b1, 0.8), P(a1, b1, -0.8), P(a0, b0, -0.8)], add(mul(u, b1 - b0), [0, 0, -(a1 - a0)]))
    }
    const mid: [number, number] = [(s0 + s1) / 2, ZC]
    for (let k = 0; k < ring.length; k++) {
      const [a0, b0] = ring[k], [a1, b1] = ring[(k + 1) % ring.length]
      quad(black, [P(mid[0], mid[1], 0.8), P(a0, b0, 0.8), P(a1, b1, 0.8), P(a1, b1, 0.8)], n)
      quad(black, [P(mid[0], mid[1], -0.8), P(a0, b0, -0.8), P(a1, b1, -0.8), P(a1, b1, -0.8)], mul(n, -1))
    }
    // Tuning pegs: three above, three below, on short stalks.
    for (const k of [0, 1, 2]) {
      const s = s0 + 1.3 + k * ((s1 - s0 - 2.4) / 2)
      for (const sg of [1, -1]) {
        box(black, P(s, ZC + sg * 3.3), [u, n, Z], [0.7, 0.5, 0.95])
        box(black, P(s, ZC + sg * 2.2), [u, n, Z], [0.15, 0.15, 0.3])
      }
    }
  }
  // Posts: two under the body, one under the neck, one under the head.
  for (const s of [0.3 * BODY, 0.72 * BODY, BODY + 0.6 * NECK, L - 3]) {
    const zTop = s < BODY ? ZC - HB * (s < BODY / 2 ? 0.98 : 0.9) + 0.5 : ZC - 2
    box(black, P(s, zTop / 2), [u, n, Z], [0.5, 0.5, zTop / 2], [4, 5])
  }
}

// ---------------------------------------------------------------------------
// Materials (six): navy seats; pale (roof, frames, masts, poles, fascia);
// the beige stone of the walls; black (the guitar); window (the screen,
// line score, suite and entrance glass); the light heads.
const parts = [
  { part: navy, material: finish('sounds-navy-seats', 0x51628a) },
  { part: pale, material: finish('fhp-white', 0xe9e6df) },
  { part: stone, material: finish('fhp-beige-stone', 0xd9cfba) },
  { part: black, material: finish('guitar-black', 0x4a4f57) },
  { part: win, material: PALETTE.window },
  { part: lights, material: finish('neon-floodlights', 0xfff3d8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('First Horizon Park', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 158, osm: 'way/592150009', height: 37.2,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/nash-first-horizon-park.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
