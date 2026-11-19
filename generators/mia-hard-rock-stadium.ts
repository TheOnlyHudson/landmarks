/**
 * Hard Rock Stadium (Joe Robbie Stadium, 1987; canopy 2016 by Arquitectonica
 * with Thornton Tomasetti), 347 Don Shula Drive, Miami Gardens — procedural,
 * CC0-1.0.
 * bun generators/mia-hard-rock-stadium.ts
 *
 * What makes it Hard Rock Stadium: the huge flat white canopy, nearly square
 * in plan, cantilevered far past the bowl on every side with a thin white
 * edge and a dark underside, open over the field through a rectangular hole;
 * four tall white tapered masts rising through the canopy near its corners,
 * cables fanning down from their tops to the canopy; low white arch trusses
 * along the opening's sidelines; under it the old concrete bowl with its
 * teal seats seen through the opening, and the pairs of white super columns
 * at each corner that carry the masts.
 *
 * Frame: bearing 31.5 (the canopy's and field's axes; model +y points 31.5°
 * east of north, the field's long axis runs along model x). The anchor is
 * the area centroid of OSM way/171419981 (outer of relation/2278785,
 * building=stadium; the way carries leisure=stadium), -80.2388366
 * 25.9579200. The relation's inner way/171419979 is the open bowl over the
 * field.
 *
 * Ground: y = 0 is the parking-lot grade round the stadium. No published
 * field depth was found (Wikipedia, STRUCTURE magazine, web search), and
 * the street-level photos (elisfkc2) show the bowl's gates at grade, so
 * `elevation` is 0. The field is not modelled; the map draws it.
 *
 * Heights: NO usable lidar. `lidar.py find` lists
 * USGS_LPC_FL_Southeast_B2_2018_LAS_2019 here, but its EPT has no points
 * over the stadium (the tiles round it hold only points north of it).
 * - published: the four masts 350 ft (106.7 m) tall, each on a transfer
 *   truss between a pair of super columns at a corner; 64 cables up to
 *   300 ft; the canopy 14 acres (626,000 sq ft) (STRUCTURE magazine,
 *   "Hard Rock Stadium", Ruby+Associates/Hillsdale; esub.com).
 * - photo-scaled (Prieur's view from the highway, on the 106.7 m mast):
 *   the canopy's outer edge 30.5-34.5 m (fascia drawn a little deep to read at
 *   phone size) (the masts stand about three times
 *   its height), its top rising to 42 m at the opening, the arches about
 *   10 m above it, the bowl's rim about 30 m;
 * - from the NAIP orthophoto rotated into the model frame (public domain,
 *   0.51 m/px, corrected for the canopy's lean): canopy x ±135, y ±125;
 *   opening x ±85, y ±55 with a pale inner band 12 m wide at the ends and
 *   6 m at the sides; mast bases at (±96, ±82.5), each on a round plate
 *   about 18 m across; the sideline arches spanning x ±70;
 * - estimated: the bowl's plan (an octagon inside the canopy, x ±118,
 *   y ±106, corners cut so the super columns stand outside it), the seating
 *   rake, the columns' positions (each pair straddling its mast, about 28 m
 *   apart), the facade bands.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Hard Rock Stadium-depuis l'autoroute en février 2022 (2).jpg" and
 *   "...février 2022.jpg", Benoît Prieur, CC0 — side elevation, masts,
 *   cables, arches, the canopy's edge and underside, super columns;
 * - "Hard Rock Stadium Prior to first NFL game.jpg", Eisenthesky
 *   Productions, CC BY-SA 4.0 — aerial: the canopy, opening, mast plates;
 * - "Hard Rock Stadium for Super Bowl LIV" (49606710103, 49606710208,
 *   49607465062), elisfkc2, CC BY-SA 2.0 — from the parking lots: canopy
 *   overhang, masts, the glass entrance facade;
 * - "Hard Rock Stadium 2017.jpg", TheSoccerBoy, CC BY-SA 4.0 — inside: the
 *   teal seats, the arch trusses (Lipp's "Hard Rock Stadium.jpg" too);
 * - published facts: STRUCTURE magazine, "Hard Rock Stadium"
 *   (structuremag.org/article/hard-rock-stadium/).
 * - Plan: USGS NAIP (public domain), OSM (ODbL).
 *
 * Left out: the field, the corner video boards under the canopy, lettering
 * and the roof logos, the bowl's ramps, the separate Paddock garage.
 *
 * Doubts: no lidar; every height but the masts' is photo-scaled. The bowl's
 * outline under the canopy is estimated (OSM maps only the canopy's
 * outline). Field depth unsourced (taken as at grade).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const white = new Part(), soffit = new Part(), concrete = new Part(), seats = new Part(), win = new Part(), glass = new Part()

// ---------------------------------------------------------------- helpers
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, P: V3[], hint: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    if (flip) p.tri(a, c, b)
    else p.tri(a, b, c)
  }
}
/** A straight bar of square section `w` between two points. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d = sub(b, a), L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let u = cross(t, [0, 0, 1])
  if (Math.hypot(...u) < 1e-6) u = [1, 0, 0]
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v = cross(t, u)
  const h = w / 2
  const corner = (c: V3, s: number, r: number): V3 => [c[0] + (u[0] * s + v[0] * r) * h, c[1] + (u[1] * s + v[1] * r) * h, c[2] + (u[2] * s + v[2] * r) * h]
  const sq: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [u[0] * (sq[i][0] + sq[j][0]) + v[0] * (sq[i][1] + sq[j][1]), u[1] * (sq[i][0] + sq[j][0]) + v[1] * (sq[i][1] + sq[j][1]), u[2] * (sq[i][0] + sq[j][0]) + v[2] * (sq[i][1] + sq[j][1])]
    face(p, [corner(a, ...sq[i]), corner(a, ...sq[j]), corner(b, ...sq[j]), corner(b, ...sq[i])], m)
  }
}
/** A vertical prism over a convex polygon, z0 to z1. */
function prism(p: Part, q: XY[], z0: number, z1: number, bottom = false) {
  const n = q.length, cx = q.reduce((s, a) => s + a[0], 0) / n, cy = q.reduce((s, a) => s + a[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  }
  face(p, q.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) face(p, q.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A round frustum about (x, y), radius r0 at z0 to r1 at z1. */
function frustum(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1: number, n = 12) {
  for (let k = 0; k < n; k++) {
    const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
    face(p, [[x + r0 * Math.cos(a0), y + r0 * Math.sin(a0), z0], [x + r0 * Math.cos(a1), y + r0 * Math.sin(a1), z0], [x + r1 * Math.cos(a1), y + r1 * Math.sin(a1), z1], [x + r1 * Math.cos(a0), y + r1 * Math.sin(a0), z1]], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
  }
}

// ---------------------------------------------------------------- the canopy
const OX = 135, OY = 125 // outer edge
const JX = 97, JY = 61 // the pale inner band's outer edge
const IX = 85, IY = 55 // the opening
const ZO0 = 30.5, ZO1 = 34.5, ZJ = 42, ZI = 42.5, ZU = 37.5 // edge, top, band, soffit at the opening
/** The canopy's top surface height at (x, y) (a shallow hipped slope). */
const topZ = (x: number, y: number) => ZJ - (ZJ - ZO1) * Math.max(0, Math.max((Math.abs(x) - JX) / (OX - JX), (Math.abs(y) - JY) / (OY - JY)))
const Q = (x: number, y: number, z: number): V3 => [x, y, z]
const quadrants: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
// top: four trapezoids from the outer edge up to the band
for (const [sx, sy] of [[1, 0], [0, 1], [-1, 0], [0, -1]] as [number, number][]) {
  if (sx) {
    face(white, [Q(sx * OX, -OY, ZO1), Q(sx * OX, OY, ZO1), Q(sx * JX, JY, ZJ), Q(sx * JX, -JY, ZJ)], [sx * 0.2, 0, 1])
    face(glass, [Q(sx * JX, -JY, ZJ), Q(sx * JX, JY, ZJ), Q(sx * IX, IY, ZI), Q(sx * IX, -IY, ZI)], [0, 0, 1])
  } else {
    face(white, [Q(-OX, sy * OY, ZO1), Q(OX, sy * OY, ZO1), Q(JX, sy * JY, ZJ), Q(-JX, sy * JY, ZJ)], [0, sy * 0.2, 1])
    face(glass, [Q(-JX, sy * JY, ZJ), Q(JX, sy * JY, ZJ), Q(IX, sy * IY, ZI), Q(-IX, sy * IY, ZI)], [0, 0, 1])
  }
}
// the outer fascia, the underside, the opening's inner fascia
{
  const O: V3[] = quadrants.map(([sx, sy]) => Q(sx * OX, sy * OY, 0))
  const I: V3[] = quadrants.map(([sx, sy]) => Q(sx * IX, sy * IY, 0))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const out: V3 = [(O[i][0] + O[j][0]) / 2, (O[i][1] + O[j][1]) / 2, 0]
    face(white, [[O[i][0], O[i][1], ZO0], [O[j][0], O[j][1], ZO0], [O[j][0], O[j][1], ZO1], [O[i][0], O[i][1], ZO1]], out)
    face(soffit, [[O[i][0], O[i][1], ZO0], [O[j][0], O[j][1], ZO0], [I[j][0], I[j][1], ZU], [I[i][0], I[i][1], ZU]], [0, 0, -1])
    face(white, [[I[i][0], I[i][1], ZU], [I[j][0], I[j][1], ZU], [I[j][0], I[j][1], ZI], [I[i][0], I[i][1], ZI]], [-out[0], -out[1], 0])
  }
}
const underZ = (x: number, y: number) => {
  const t = Math.max((Math.abs(x) - IX) / (OX - IX), (Math.abs(y) - IY) / (OY - IY))
  return ZU - (ZU - ZO0) * Math.min(1, Math.max(0, t))
}

// ---------------------------------------------------------------- masts, plates, cables, super columns
const MX = 96, MY = 82.5, MTOP = 106.7
for (const [sx, sy] of quadrants) {
  const x = sx * MX, y = sy * MY
  // the mast: from its transfer truss (z 30) through the canopy to 106.7 m
  frustum(white, x, y, 27, 42, 3.6, 3.6)
  frustum(white, x, y, 42, MTOP - 3, 3.6, 1.0)
  frustum(white, x, y, MTOP - 3, MTOP, 1.0, 0.05, 8)
  // the round plate on the canopy round its foot (pale, translucent-looking)
  const zp = topZ(x, y) + 0.2
  const plate: V3[] = Array.from({ length: 16 }, (_, k) => [x + 9 * Math.cos((Math.PI * k) / 8), y + 9 * Math.sin((Math.PI * k) / 8), zp] as V3)
  face(glass, plate, [0, 0, 1])
  // cables: eight from near the top, fanning down to the canopy
  for (let k = 0; k < 8; k++) {
    const ang = (Math.PI * 2 * k) / 8 + Math.PI / 8
    let tx = x + 52 * Math.cos(ang), ty = y + 52 * Math.sin(ang)
    tx = Math.max(-OX + 4, Math.min(OX - 4, tx)); ty = Math.max(-OY + 4, Math.min(OY - 4, ty))
    if (Math.abs(tx) < IX && Math.abs(ty) < IY) { tx = Math.sign(tx) * IX; }
    bar(soffit, [x, y, MTOP - 8], [tx, ty, topZ(tx, ty) + 0.3], 0.5)
  }
  // the pair of super columns and the transfer truss between them
  const c1: XY = [x + sx * 19.5, y - sy * 19.5], c2: XY = [x - sx * 19.5, y + sy * 19.5]
  for (const [cx, cy] of [c1, c2]) prism(white, [[cx - 2.2, cy - 2.2], [cx + 2.2, cy - 2.2], [cx + 2.2, cy + 2.2], [cx - 2.2, cy + 2.2]], 0, underZ(cx, cy))
  bar(white, [c1[0], c1[1], 28.5], [c2[0], c2[1], 28.5], 3.2)
}
// the sideline arch trusses over the opening's long edges
for (const sy of [1, -1]) {
  const n = 10, X0 = 72, rise = 10
  for (let k = 0; k < n; k++) {
    const xa = -X0 + (2 * X0 * k) / n, xb = -X0 + (2 * X0 * (k + 1)) / n
    const za = ZI + rise * (1 - (xa / X0) ** 2), zb = ZI + rise * (1 - (xb / X0) ** 2)
    bar(white, [xa, sy * (IY + 2), za], [xb, sy * (IY + 2), zb], 3.0)
  }
}

// ---------------------------------------------------------------- the bowl
const BX = 118, BY = 106, CH = 52 // the octagon's half-sizes and corner cut
const BOWL: XY[] = [[BX, -(BY - CH)], [BX, BY - CH], [BX - CH, BY], [-(BX - CH), BY], [-BX, BY - CH], [-BX, -(BY - CH)], [-(BX - CH), -BY], [BX - CH, -BY]]
const RIM = 30
for (let i = 0; i < BOWL.length; i++) {
  const a = BOWL[i], b = BOWL[(i + 1) % BOWL.length]
  const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), on = Math.hypot(out[0], out[1])
  const o: XY = [(out[0] / on) * 0.07, (out[1] / on) * 0.07]
  face(concrete, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], RIM], [a[0], a[1], RIM]], out)
  // glazed concourse bays on the straight sides, 14 m with piers between
  if (i % 2 === 0) {
    const nb = Math.floor(L / 16)
    for (let k = 0; k < nb; k++) {
      const s0 = (L - nb * 16) / 2 + k * 16 + 1.5, s1 = s0 + 13
      const P = (s: number, z: number): V3 => [a[0] + ((b[0] - a[0]) * s) / L + o[0], a[1] + ((b[1] - a[1]) * s) / L + o[1], z]
      face(win, [P(s0, 5), P(s1, 5), P(s1, 14), P(s0, 14)], out)
      face(win, [P(s0, 19), P(s1, 19), P(s1, 26), P(s0, 26)], out)
    }
  }
}
// the seating rake, seen through the opening: from the field wall up to the rim
{
  const SO: XY[] = [[112, -50], [112, 50], [62, 100], [-62, 100], [-112, 50], [-112, -50], [-62, -100], [62, -100]]
  const SI: XY[] = [[68, -36], [68, 36], [64, 40], [-64, 40], [-68, 36], [-68, -36], [-64, -40], [64, -40]]
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    face(seats, [[SI[i][0], SI[i][1], 1.5], [SI[j][0], SI[j][1], 1.5], [SO[j][0], SO[j][1], RIM], [SO[i][0], SO[i][1], RIM]], [0, 0, 1])
    // the field wall
    face(concrete, [[SI[i][0], SI[i][1], 0], [SI[j][0], SI[j][1], 0], [SI[j][0], SI[j][1], 1.5], [SI[i][0], SI[i][1], 1.5]], [-(SI[i][0] + SI[j][0]), -(SI[i][1] + SI[j][1]), 0])
    // the flat rim between the rake and the outer wall
    face(concrete, [[SO[i][0], SO[i][1], RIM], [SO[j][0], SO[j][1], RIM], [BOWL[j][0], BOWL[j][1], RIM], [BOWL[i][0], BOWL[i][1], RIM]], [0, 0, 1])
  }
}

// ---------------------------------------------------------------- materials and output
// From the daylight photos: the canopy, masts, arches and columns white
// (masts and columns floodlit at night); the canopy's underside and the
// cables a mid grey; the bowl's pale concrete; the Dolphins' aqua seats
// pulled to the palette; the inner band and mast plates pale glazing.
const out = [
  { part: white, material: { ...finish('hr-white', 0xf3f4f2), floodlight: (p: V3, n: V3) => (p[2] > 46 && Math.abs(n[2]) < 0.7 ? 0.8 : p[2] < 36 && Math.abs(n[2]) < 0.5 ? 0.6 : 0) } },
  { part: soffit, material: finish('hr-soffit', 0x8b949a) },
  { part: concrete, material: finish('hr-concrete', 0xd9d6cf) },
  { part: seats, material: finish('hr-seats', 0x6fb2b3) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hard Rock Stadium', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at grade under the way/171419981 centroid; bearing 31.5',
  bearing: 31.5, osm: 'relation/2278785',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/mia-hard-rock-stadium.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
