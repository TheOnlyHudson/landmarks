/**
 * loanDepot park (Marlins Park until 2021; Miami Marlins, 2012, Populous),
 * 501 Marlins Way, Little Havana, Miami — procedural, CC0-1.0.
 * bun generators/mia-loandepot-park.ts
 *
 * What makes it loanDepot park: a round white bowl under a broad white
 * fixed roof, and on top of it the three retractable roof panels — a tall
 * central panel with rounded shoulders flanked by two lower ones — riding on
 * two long white runway girders that run out west of the bowl onto the
 * huge splayed white "super columns" (two pylons, four legs) where the
 * panels park when the roof is open; the bowl's facade in horizontal bands:
 * cobalt glass at street level, white stucco and sweeping white ledges, a
 * pale blue-grey glass band under the roof's white rim; the outfield glass
 * wall facing downtown (east).
 *
 * Roof drawn CLOSED: closed in the NAIP orthophoto and in the Garcia and
 * Curra photos (the Marlins expected it closed for ~70 of 81 home games,
 * Wikipedia); Jared's view shows it open.
 *
 * Frame: bearing 0, built north-up (x east, y north); the runway girders run
 * due east-west. The anchor is the area centroid of the outer way of OSM
 * relation/8736190 (way/136979834, height 78.9), -80.2196152 25.7780833.
 * OSM maps the whole stadium, field included, as one building; its outline
 * also takes in the runway girders' strips west of the bowl and the south-
 * west entrance pavilion. No building:part is mapped.
 *
 * Ground: y = 0 is the street outside. The field is said to be sunk a few
 * metres below the street (the lead's note: about 5 m), but no published
 * figure or section was found (Wikipedia, ballparksofbaseball.com and
 * baseballparks.com searched). With the roof drawn closed the field and the
 * bowl inside are not modelled and nothing of them shows, so the model's
 * base is the street and `elevation` is 0. Map terrain (Mapterhorn): flat.
 *
 * Heights: NO 3DEP lidar covers this point (`lidar.py find` lists nothing;
 * FL_TopobathyFLKeysNOAA_Hydroflattened_2019 returns no points here), so
 * every height is photo-scaled or published:
 * - published: the outfield glass panels, 240 ft long and 60 ft high
 *   (73 × 18.3 m; Wikipedia, ballparksofbaseball.com); the roof's top 78.9
 *   (OSM height tag) — Jared's open-roof view scaled on the 18.3 m glass
 *   gives about 76 m, so the tag is kept;
 * - photo-scaled from Curra's and Garcia's closed-roof views from the north
 *   (on the central panel's 81 m width, NAIP): the central panel's fascia
 *   56.6-67.6 and ridge 78.9; the side panels 57-63 with tops at 66.5;
 *   the runway girders 51-56; the bowl's white rim 32-35.5 overhanging the
 *   walls by 4.5 m; the fixed roof rising to about 51 under the panels;
 * - from the NAIP orthophoto (public domain, 0.38 m/px, loanDepot logo on
 *   the roof, so 2021 or later): the central panel x -64..17, y -89..93;
 *   the west panel's exposed strip to x = -104; the east panel to x ≈ 55;
 *   the girders at y = +85 and -81; OSM gives their west ends (-156, -140).
 * - estimated: the facade bands (photos, no scale), the pylons' leg spread
 *   (Kilby's pier view and the 2011 construction views), the south-west
 *   pavilion's height (16 m).
 *
 * Photos (Wikimedia Commons unless noted), compared against the renders:
 * - "Miami - Marlins Park - View From Dolphin Expressway.jpg", Jared,
 *   CC BY 2.0 — from the north, roof open, girders and pylons;
 * - "Marlins park - panoramio.jpg", Daniel Garcia, CC BY 3.0 — from the
 *   north-east, roof closed, three panels, girders out to the pylons;
 * - "MIAMI MARLINS PARK-LITTLE HAVANA - panoramio.jpg", Ivan Curra,
 *   CC BY-SA 3.0 — from the north, roof closed;
 * - "Marlins Stadium near completion 3.jpg" and "Marlins Stadium exterior
 *   near completion.jpg", Phillip, CC BY 2.0 — a pylon and the bowl from the
 *   west plaza;
 * - "Marlins Park north side.jpg", "Marlins Park front plaza.jpg",
 *   "Marlins Park windows open.jpg", Dan Lundberg, CC BY-SA 2.0 — facade
 *   bands, white ledges, the outfield glass wall and the fixed roof's eave;
 * - "Marlins Park Exterior Pier (pano)", Eric Kilby, CC BY-SA 2.0 (Flickr,
 *   via Openverse) — a pylon's legs and cross-beam;
 * - Plan: USGS NAIP orthophoto (public domain), OSM (ODbL).
 *
 * Left out: the field and the seating bowl (under the closed roof), the
 * signs on the panels' fascias, the home-run sculpture, the plaza, the four
 * parking garages (separate buildings, not replaced).
 *
 * Doubts: every height is photo-scaled (no lidar); the panels' exact plan
 * (NAIP shows the east panel's edge slanted; drawn square); the south side
 * has no close photo and repeats the north's bands; the field depth is
 * unsourced and unused.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const D = Math.PI / 180

const white = new Part(), roof = new Part(), ptop = new Part(), win = new Part(), sky = new Part(), soffit = new Part()

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
/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  face(p, [c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1)], [0, -1, 0])
  face(p, [c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], [1, 0, 0])
  face(p, [c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1)], [0, 1, 0])
  face(p, [c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1)], [-1, 0, 0])
  face(p, [c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)], [0, 0, 1])
  if (bottom) face(p, [c(x0, y0, z0), c(x1, y0, z0), c(x1, y1, z0), c(x0, y1, z0)], [0, 0, -1])
}
/** A leg: a tapered square post from foot (x, y, 0 … z0) to head, as a frustum. */
function leg(p: Part, foot: V3, head: V3, wf: XY, wh: XY) {
  const ring = (c: V3, w: XY): V3[] => [[c[0] - w[0], c[1] - w[1], c[2]], [c[0] + w[0], c[1] - w[1], c[2]], [c[0] + w[0], c[1] + w[1], c[2]], [c[0] - w[0], c[1] + w[1], c[2]]]
  const a = ring(foot, wf), b = ring(head, wh)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(a[i][0] + a[j][0]) / 2 - foot[0], (a[i][1] + a[j][1]) / 2 - foot[1], 0]
    face(p, [a[i], a[j], b[j], b[i]], m)
  }
  face(p, b, [0, 0, 1])
}

// ---------------------------------------------------------------- the bowl's plan
// The outer way of relation/8736190, CCW, local metres from its centroid,
// without the runway strips and the south-west pavilion (drawn apart).
const BOWL: XY[] = [[-25.8, -109.9], [-8.5, -113.3], [12.5, -113.6], [31.6, -112.2], [55.5, -106.6], [80.2, -94.7], [91.9, -85.9], [103.7, -74.2], [110.6, -65.7], [112.8, -31.0], [116.8, -10.2], [116.5, 8.0], [114.5, 24.7], [110.7, 38.5], [114.3, 55.6], [102.2, 69.9], [89.3, 81.4], [74.5, 90.5], [61.8, 97.2], [45.2, 103.6], [29.3, 107.2], [13.5, 108.7], [-4.4, 109.3], [-20.2, 108.7], [-36.9, 106.2], [-49.4, 103.3], [-66, 96], [-80.3, 86.5], [-90.3, 76.2], [-93.0, 72.5], [-98.4, 62.9], [-100.8, 56.1], [-102.9, 50.5], [-105.9, 37.3], [-106.6, 27.9], [-106.3, 12.4], [-102.8, -12.0], [-102.5, -14.4], [-98.8, -27.8], [-95.8, -37.1], [-90.1, -50.7], [-80.5, -68], [-65.8, -87.2], [-58.0, -94.0], [-42.3, -103.2]]
function R(th: number) {
  const dx = Math.cos(th * D), dy = Math.sin(th * D)
  let best = 0
  for (let i = 0; i < BOWL.length; i++) {
    const a = BOWL[i], b = BOWL[(i + 1) % BOWL.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const det = dx * -ey - dy * -ex
    if (Math.abs(det) < 1e-12) continue
    const t = (a[0] * -ey - a[1] * -ex) / det
    const u = (dx * a[1] - dy * a[0]) / det
    if (u >= -1e-9 && u <= 1 + 1e-9 && t > best) best = t
  }
  return best
}
const P = (th: number, inset = 0, z = 0): V3 => { const r = R(th) - inset; return [r * Math.cos(th * D), r * Math.sin(th * D), z] }
const ANG = Array.from({ length: 90 }, (_, k) => -180 + 4 * k)

const RIM0 = 32, RIM1 = 35.5, WALL_IN = 4.5 // the roof rim overhangs the walls by 4.5 m
const OUTFIELD = (th: number) => th > -38 && th < 38 // the glass wall faces downtown

for (let i = 0; i < ANG.length; i++) {
  const a = ANG[i], b = ANG[(i + 1) % ANG.length] + (i + 1 === ANG.length ? 360 : 0)
  const m = (a + b) / 2, out: V3 = [Math.cos(m * D), Math.sin(m * D), 0]
  const band = (p: Part, inset: number, z0: number, z1: number) => face(p, [P(a, inset, z0), P(b, inset, z0), P(b, inset, z1), P(a, inset, z1)], out)
  const ledge = (z0: number, z1: number, inset0: number, inset1: number) => {
    face(white, [P(a, inset0, z1), P(b, inset0, z1), P(b, inset1, z1), P(a, inset1, z1)], [0, 0, 1])
    face(soffit, [P(a, inset0, z0), P(b, inset0, z0), P(b, inset1, z0), P(a, inset1, z0)], [0, 0, -1])
    face(white, [P(a, inset0, z0), P(b, inset0, z0), P(b, inset0, z1), P(a, inset0, z1)], out)
  }
  if (OUTFIELD(m)) {
    // a white base, the outfield glass wall (18.3 m), white above it
    band(white, WALL_IN, 0, 8)
    band(sky, WALL_IN, 8, 26.3)
    band(white, WALL_IN, 26.3, RIM0)
  } else {
    // cobalt glass at street level, white stucco, a sweeping white ledge,
    // the pale blue-grey "sky" glass under the roof's rim
    // street-level glass between white piers (one bay per 8°, about 14 m)
    band(white, WALL_IN, 0, 5.5)
    { const ta = i % 2 ? a : a + (b - a) * 0.14, tb = i % 2 ? b - (b - a) * 0.14 : b
      face(win, [P(ta, WALL_IN - 0.07, 0), P(tb, WALL_IN - 0.07, 0), P(tb, WALL_IN - 0.07, 5.5), P(ta, WALL_IN - 0.07, 5.5)], out) }
    band(white, WALL_IN, 5.5, 18)
    band(sky, WALL_IN, 18, RIM0)
    ledge(5.5, 7.0, WALL_IN - 3.6, WALL_IN)
    ledge(11.5, 13.0, WALL_IN - 3.0, WALL_IN)
    ledge(24.4, 25.4, WALL_IN - 1.6, WALL_IN)
  }
  // the roof's white rim, overhanging the walls
  face(white, [P(a, 0, RIM0), P(b, 0, RIM0), P(b, 0, RIM1), P(a, 0, RIM1)], out)
  face(soffit, [P(a, 0, RIM0), P(b, 0, RIM0), P(b, WALL_IN, RIM0), P(a, WALL_IN, RIM0)], [0, 0, -1])
}

// The outfield glass's joints: a white mullion every 12 m (six panels).
for (let t = -36; t <= 36; t += 12) {
  const w = 0.5 / (R(t) * D), out: V3 = [Math.cos(t * D), Math.sin(t * D), 0]
  face(white, [P(t - w, WALL_IN - 0.08, 8), P(t + w, WALL_IN - 0.08, 8), P(t + w, WALL_IN - 0.08, 26.3), P(t - w, WALL_IN - 0.08, 26.3)], out)
}

// The fixed roof: white membrane rising from the rim toward the panels.
{
  const S: [number, number][] = [[1, RIM1], [0.9, 41.0], [0.78, 45.5], [0.62, 49.0], [0.45, 51.0]]
  const RP = (th: number, s: number, z: number): V3 => { const r = (R(th) - 0.3) * s; return [r * Math.cos(th * D), r * Math.sin(th * D), z] }
  for (let i = 0; i < ANG.length; i++) {
    const a = ANG[i], b = ANG[(i + 1) % ANG.length]
    for (let k = 0; k < S.length - 1; k++) face(roof, [RP(a, S[k][0], S[k][1]), RP(b, S[k][0], S[k][1]), RP(b, S[k + 1][0], S[k + 1][1]), RP(a, S[k + 1][0], S[k + 1][1])], [0, 0, 1])
    face(roof, [RP(a, 0.45, 51), RP(b, 0.45, 51), [0, 0, 51]], [0, 0, 1])
  }
}

// ---------------------------------------------------------------- the retractable panels
/**
 * A roof panel: a box of fascia from zb to zf over x0..x1, y0..y1, and a
 * barrel top rising to zt with rounded shoulders `sh` wide, its north and
 * south ends hipped back by `hip`.
 */
function panel(x0: number, x1: number, y0: number, y1: number, zb: number, zf: number, zt: number, sh: number, hip: number) {
  box(white, x0, x1, y0, y1, zb, zf)
  // the cross-section, west to east
  const prof: [number, number][] = []
  const n = 5
  for (let k = 0; k <= n; k++) { const t = (k / n) * (Math.PI / 2); prof.push([x0 + sh * (1 - Math.cos(t)), zf + (zt - zf) * Math.sin(t)]) }
  for (let k = 0; k <= n; k++) { const t = (Math.PI / 2) * (1 - k / n); prof.push([x1 - sh * (1 - Math.cos(t)), zf + (zt - zf) * Math.sin(t)]) }
  const yin = (z: number) => hip * ((z - zf) / (zt - zf))
  for (let k = 0; k < prof.length - 1; k++) {
    const [xa, za] = prof[k], [xb, zb2] = prof[k + 1]
    face(ptop, [[xa, y0 + yin(za), za], [xb, y0 + yin(zb2), zb2], [xb, y1 - yin(zb2), zb2], [xa, y1 - yin(za), za]], [0, 0, 1])
  }
  // the hipped ends
  for (const [y, s] of [[y0, 1], [y1, -1]] as [number, number][]) {
    const c: V3 = [(x0 + x1) / 2, y, zf]
    for (let k = 0; k < prof.length - 1; k++) {
      const [xa, za] = prof[k], [xb, zb2] = prof[k + 1]
      face(ptop, [c, [xa, y + s * yin(za), za], [xb, y + s * yin(zb2), zb2]], [0, -s, 0.6])
    }
  }
}
// side panels first (lower, partly under the central one)
panel(-106, -50, -85, 89, 56.8, 63.0, 66.5, 9, 5)
panel(5, 57, -85, 89, 56.8, 63.0, 66.5, 9, 5)
panel(-64, 17, -89, 93, 56.6, 67.6, 78.9, 17, 9)

// ---------------------------------------------------------------- runway girders and super columns
const GZ0 = 51, GZ1 = 56
const RAILS: [number, number][] = [[85, -156], [-81, -140]] // [y, west end x]
for (const [y, xw] of RAILS) {
  box(white, xw, 66, y - 2.4, y + 2.4, GZ0, GZ1)
  // the pylon at the girder's west end: two splayed legs and a head beam
  const x0 = xw + 9
  for (const s of [-1, 1]) leg(white, [x0 + s * 11, y, 0], [x0 + s * 5, y, GZ0 - 3], [2.6, 2.4], [1.9, 1.9])
  box(white, x0 - 7, x0 + 7, y - 2.2, y + 2.2, GZ0 - 4, GZ0)
}
// the second pair of legs, where the girders leave the bowl (Garcia, Jared)
for (const [y] of RAILS) {
  const x0 = -98
  for (const s of [-1, 1]) leg(white, [x0 + s * 7, y, 0], [x0 + s * 3.5, y, GZ0 - 3], [2.0, 1.9], [1.5, 1.5])
  box(white, x0 - 5, x0 + 5, y - 2, y + 2, GZ0 - 4, GZ0)
}

// ---------------------------------------------------------------- the south-west entrance pavilion
{
  const Q: XY[] = [[-90.1, -50.7], [-121.5, -47.2], [-122.3, -54.5], [-108.1, -68.7], [-97.1, -76.5], [-78, -76]]
  const n = Q.length
  const cx = Q.reduce((s, q) => s + q[0], 0) / n, cy = Q.reduce((s, q) => s + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = Q[i], b = Q[(i + 1) % n]
    const out: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    face(white, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 16], [a[0], a[1], 16]], out)
    // glass across each face, below a white band
    const ix = (b[0] - a[0]) * 0.08, iy = (b[1] - a[1]) * 0.08, o = Math.hypot(out[0], out[1])
    const off: XY = [(out[0] / o) * 0.07, (out[1] / o) * 0.07]
    face(win, [[a[0] + ix + off[0], a[1] + iy + off[1], 1], [b[0] - ix + off[0], b[1] - iy + off[1], 1], [b[0] - ix + off[0], b[1] - iy + off[1], 11], [a[0] + ix + off[0], a[1] + iy + off[1], 11]], out)
  }
  for (let i = 1; i < n - 1; i++) face(roof, [[Q[0][0], Q[0][1], 16], [Q[i][0], Q[i][1], 16], [Q[i + 1][0], Q[i + 1][1], 16]], [0, 0, 1])
}

// ---------------------------------------------------------------- materials and output
// From the daylight photos: white stucco, panels and columns (the columns
// floodlit at night, Arsham/Snarkitecture's column lighting); the roof's
// fixed roof's membrane reads grey-blue beside the brighter panels (NAIP); cobalt glass at street level (lit at
// night); the pale blue-grey upper glass; grey soffits.
const out = [
  { part: white, material: { ...finish('ldp-white', 0xf1f2ef), floodlight: (p: V3, n: V3) => (p[0] < -85 && Math.abs(n[2]) < 0.6 ? 0.8 : 0) } },
  { part: roof, material: finish('ldp-roof', 0xc9d1d5) },
  { part: ptop, material: finish('ldp-panel', 0xf5f6f4) },
  { part: win, material: windowVariant(2, 0x4f6f96) },
  { part: sky, material: { ...PALETTE.window, color: 0x8fa8ba } }, // the upper glass reads pale blue-grey by day
  { part: soffit, material: finish('ldp-soffit', 0x9aa3a8) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('loanDepot park', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at street level under the way/136979834 centroid; bearing 0',
  bearing: 0, osm: 'relation/8736190',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/mia-loandepot-park.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
