/**
 * JW Marriott Indianapolis (2011, HOK): procedural, CC0-1.0.
 * bun generators/indy-jw-marriott.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centroid of
 * OSM way/537848110 (-86.167661, 39.766685), the building:part that is the
 * JW tower inside relation/7704773 ("Marriott IndyPlace", the whole hotel
 * complex: the JW, the Marriott, Courtyard, SpringHill Suites and
 * Fairfield Inn and their shared podium). Only the JW tower is modelled,
 * and only its part is replaced. Bearing 0: the slab runs north-south.
 *
 * Form: a thin curved slab, about 20 m deep and 100 m long, its west face
 * bowed out and its east face hollowed in, so the tower reads as a sail
 * curving round toward the east; flat roof; the whole skin bright blue
 * glass with pale floor lines every three storeys and fine vertical
 * mullion lines; "JW MARRIOTT" in white near the top of both long faces.
 *
 * Sources
 * - OSM (ODbL): way/537848110 (building:part, height 109, 34 levels), the
 *   plan used as drawn (21 nodes).
 * - Published (Wikipedia, "JW Marriott Indianapolis"): 34 floors, opened
 *   2011, 1,005 rooms; heights quoted vary (109-126 m), so lidar is used.
 * - Lidar: USGS 3DEP USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m DSM: roof 111 m above the street, parapet 112; the plan
 *   agrees with OSM to 1-2 m; small rooftop areas at 105-109 near the ends
 *   (not modelled).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "JW Marriott Indianapolis - 2012.jpg" (davitydave, CC BY 2.0) - the
 *     concave face, glass colour, mullion and floor rhythm, the sign;
 *     https://commons.wikimedia.org/wiki/File:JW_Marriott_Indianapolis_-_2012.jpg
 *   "JW Marriott Hotel - Indianapolis.jpg" (Chris Bede, CC BY 2.0) - the
 *     convex face and its sign, the three-storey panel bands, flat roof;
 *     https://commons.wikimedia.org/wiki/File:JW_Marriott_Hotel_-_Indianapolis.jpg
 *   "JW Marriott and Indiana Convention Center - 2011.jpg" (Jimmy
 *     Baikovicius, CC BY-SA 2.0), from the south-east - the slab's
 *     thinness, the curve, the flat end wall.
 *     https://commons.wikimedia.org/wiki/File:JW_Marriott_and_Indiana_Convention_Center_-_2011.jpg
 * - Look-only: none.
 *
 * Estimated: the line spacing (floor lines every three storeys of 3.25 m,
 * mullion lines about 10 m apart), the sign's size and height (scaled from
 * the Bede photo, about 26 x 3 m at 104 m) and its place (middle of each
 * long face). Invented: nothing.
 * Doubts: the base, where the tower meets the complex's shared podium, is
 * drawn as plain glass to the ground; the podium (the relation's other
 * parts) is not modelled. The relation itself stays on the map: if it is
 * drawn as a building it shows under and round this model.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

const glass = new Part(), trim = new Part(), roof = new Part(), sign = new Part()

// OSM way/537848110 in metres from its centroid, reversed to run
// counter-clockwise: south-west corner, the east face north to the
// north-east corner... (see `ring` below).
const osm: XY[] = [
  [8.5, -45.2], [-11.4, -49.1], [-12.9, -39.7], [-13.8, -29.8], [-14.5, -18.4], [-14.5, -7.5],
  [-13.7, 1.3], [-12.8, 10.3], [-11.6, 19.8], [-9.4, 31.0], [-2.8, 52.3], [16.1, 46.3],
  [12.5, 36.3], [10.5, 27.5], [7.8, 17.4], [6.3, 6.0], [5.5, -4.8], [5.5, -15.2],
  [5.8, -22.1], [6.5, -30.0], [7.4, -37.7],
]
const ring: XY[] = [...osm].reverse()
const N = ring.length
const H = 111, PARAPET = 112

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

// smooth normals along the curved faces; sharp at the four corners
const edgeN = ring.map((a, i) => outward(a, ring[(i + 1) % N]))
const vertN = (i: number, side: 0 | 1): XY => {
  // side 0: the vertex as the start of edge i; side 1: as the end of edge i-1
  const e0 = edgeN[(i + N - 1) % N], e1 = edgeN[i]
  const smooth = e0[0] * e1[0] + e0[1] * e1[1] > Math.cos(25 * Math.PI / 180)
  return smooth ? norm2([e0[0] + e1[0], e0[1] + e1[1]]) : side === 0 ? e1 : e0
}
const v3 = (n: XY): V3 => [n[0], n[1], 0]

// ---------- the glass walls ----------
for (let i = 0; i < N; i++) {
  const j = (i + 1) % N, a = ring[i], b = ring[j]
  const na = v3(vertN(i, 0)), nb = v3(vertN(j, 1))
  glass.tri(at(a, 0), at(b, 0), at(b, PARAPET), undefined, undefined, undefined, [na, nb, nb])
  glass.tri(at(a, 0), at(b, PARAPET), at(a, PARAPET), undefined, undefined, undefined, [na, nb, na])
}

// ---------- the roof: zip the two long sides together ----------
// In `ring`, index 0 is the south-east corner (7.4,-37.7)... find the
// corners: the two southern ones and the two northern ones.
const iSE = ring.findIndex((p) => p[0] === 8.5 && p[1] === -45.2)
const iSW = ring.findIndex((p) => p[0] === -11.4 && p[1] === -49.1)
const iNW = ring.findIndex((p) => p[0] === -2.8 && p[1] === 52.3)
const iNE = ring.findIndex((p) => p[0] === 16.1 && p[1] === 46.3)
const walk = (from: number, to: number, step: number) => {
  const out: XY[] = []
  for (let k = from; ; k = (k + step + N) % N) { out.push(ring[k]); if (k === to) break }
  return out
}
const east = walk(iSE, iNE, 1) // counter-clockwise: south-east up the east face
const west = walk(iSW, iNW, -1) // south-west up the west face
{
  const param = (side: XY[]) => {
    const d = [0]
    for (let k = 1; k < side.length; k++) d.push(d[k - 1] + Math.hypot(side[k][0] - side[k - 1][0], side[k][1] - side[k - 1][1]))
    return d.map((x) => x / d[d.length - 1])
  }
  const pe = param(east), pw = param(west)
  let e = 0, w = 0
  const z = H
  while (e < east.length - 1 || w < west.length - 1) {
    const advE = w >= west.length - 1 || (e < east.length - 1 && pe[e + 1] <= pw[w + 1])
    if (advE) { roof.tri(at(west[w], z), at(east[e], z), at(east[e + 1], z)); e++ }
    else { roof.tri(at(west[w], z), at(east[e], z), at(west[w + 1], z)); w++ }
  }
  // parapet: inner face and top, 0.6 m deep
  for (let i = 0; i < N; i++) {
    const a = ring[i], b = ring[(i + 1) % N], na = vertN(i, 0), nb = vertN((i + 1) % N, 1)
    const ai: XY = [a[0] - na[0] * 0.6, a[1] - na[1] * 0.6], bi: XY = [b[0] - nb[0] * 0.6, b[1] - nb[1] * 0.6]
    trim.quad(at(a, PARAPET), at(b, PARAPET), at(bi, PARAPET), at(ai, PARAPET))
    trim.quad(at(bi, H), at(ai, H), at(ai, PARAPET), at(bi, PARAPET))
  }
}

// ---------- pale lines on the glass ----------
const STOREY = 3.25, LINE = 0.45, PROUD = 0.06
function strip(a: XY, b: XY, s: number, e: number, z0: number, z1: number) {
  const n = outward(a, b), p = lerp2(a, b, s), q = lerp2(a, b, e)
  const P: XY = [p[0] + n[0] * PROUD, p[1] + n[1] * PROUD], Q: XY = [q[0] + n[0] * PROUD, q[1] + n[1] * PROUD]
  trim.quad(at(P, z0), at(Q, z0), at(Q, z1), at(P, z1))
}
for (let i = 0; i < N; i++) {
  const a = ring[i], b = ring[(i + 1) % N]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // floor lines every three storeys, and the parapet's foot
  for (let z = 6 + 3 * STOREY; z < H; z += 3 * STOREY) strip(a, b, 0, 1, z - LINE / 2, z + LINE / 2)
  strip(a, b, 0, 1, H - 0.6, PARAPET)
  // mullion lines about 10 m apart
  const m = Math.max(1, Math.round(L / 10))
  for (let k = 0; k < m; k++) {
    const c = (k + 0.5) / m
    strip(a, b, c - 0.18 / L, c + 0.18 / L, 0, H - 0.6)
  }
}

// ---------- the sign on both long faces ----------
function signOn(side: XY[], outwardSign: 1 | -1) {
  // the middle of the face, by length; letters a white bar 26 m wide
  const seg: { a: XY; b: XY; s0: number; L: number }[] = []
  let s = 0
  for (let k = 0; k < side.length - 1; k++) {
    const L = Math.hypot(side[k + 1][0] - side[k][0], side[k + 1][1] - side[k][1])
    seg.push({ a: side[k], b: side[k + 1], s0: s, L }); s += L
  }
  const mid = s / 2, half = 13, z0 = 102.6, z1 = 105.6, d = 0.35
  for (const g of seg) {
    const lo = Math.max(g.s0, mid - half), hi = Math.min(g.s0 + g.L, mid + half)
    if (hi <= lo) continue
    let p = lerp2(g.a, g.b, (lo - g.s0) / g.L), q = lerp2(g.a, g.b, (hi - g.s0) / g.L)
    if (outwardSign < 0) [p, q] = [q, p]
    const n = outward(p, q)
    const P: XY = [p[0] + n[0] * d, p[1] + n[1] * d], Q: XY = [q[0] + n[0] * d, q[1] + n[1] * d]
    sign.quad(at(P, z0), at(Q, z0), at(Q, z1), at(P, z1))
    sign.quad(at(P, z1), at(Q, z1), at(q, z1), at(p, z1))
  }
}
signOn(east, 1)
signOn(west, -1)

// ---------- write ----------
// The JW's bright blue glass (davitydave, Bede), kept a little lighter than
// the photos; it is a hotel's lit curtain wall, so it is `window`.
const parts = [
  { part: glass, material: { name: 'window', color: 0x6d9ccf, roughness: 0.3 } },
  { part: trim, material: finish('indy-jw-mullion', 0xdfe6ec, 0.6) },
  { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
  { part: sign, material: finish('neon-jw-white', 0xf6f6f2, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('JW Marriott Indianapolis', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: PARAPET,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/537848110'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/indy-jw-marriott.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
