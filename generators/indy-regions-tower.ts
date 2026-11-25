/**
 * Regions Tower, Indianapolis (1970 as the Indiana National Bank Tower /
 * One Indiana Square; re-clad in glass 2008-09): procedural, CC0-1.0.
 * bun generators/indy-regions-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centroid of
 * OSM way/339570767 (-86.155223, 39.770302), which covers the whole block:
 * the tower and the five-storey podium (a parking garage with offices,
 * "Taft" on its corner) it stands on. The block is turned 2.0 degrees
 * clockwise from north, so the model is drawn square and placed at bearing
 * 2.0. In that frame the block is x -60.4..61.5, y -31.1..30.5, and the
 * tower stands at its west end, x -56..0, y -6..26.
 *
 * Form: a plain rectangular slab of light blue-grey reflective glass, its
 * long faces south and north; the narrow east and west faces have grey
 * solid strips down both edges. Pale floor lines every three storeys. The
 * top four storeys of the long faces are a dark blue screen band; the
 * Regions sign (green logo, pale letters) sits at the top of the east face.
 * The podium is a white frame of tall square piers with dark recessed bays
 * between, under a plain white fascia, with a raised block on its roof.
 * Note: the brief's "pale concrete with vertical ribs" is the 1970 look;
 * every current photo shows the 2009 glass re-cladding, which is modelled.
 *
 * Sources
 * - OSM (ODbL): way/339570767 (building=office, height 154, 36 levels).
 * - Published (Wikipedia, "Regions Tower (Indianapolis)"): 504 ft (154 m),
 *   36 floors, completed 1970, re-clad 2008-2009.
 * - Lidar: USGS 3DEP USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m DSM, heights above the street: tower parapet 153.5, roof
 *   inside 152 (published 154 used for the top); tower plan x -56..0,
 *   y -6..26 (no returns south of the tower, read as its lidar shadow;
 *   the NAIP roof width, 32 m, agrees); podium 20.8 with a 22 m parapet;
 *   a raised block on the podium, x 2..46, y -19..26, at 26.
 * - NAIP 2022 aerial (USGS, public domain): the tower's roof and podium.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Regions Tower - June 2022 - Sarah Stierch.jpg" (Missvain, CC BY 4.0),
 *     from Delaware and Ohio streets (south-east) - the podium's white
 *     piers and dark bays, the glass tower, the dark band, the east sign;
 *     https://commons.wikimedia.org/wiki/File:Regions_Tower_-_June_2022_-_Sarah_Stierch.jpg
 *   "One Indiana Square, Regions Bank, Indy, 2009.JPG" (Xnatedawgx, CC
 *     BY-SA 3.0) - the curtain wall, floor lines, the narrow face's grey
 *     edge strips, the dark band at the top of the long face, the sign;
 *     https://commons.wikimedia.org/wiki/File:One_Indiana_Square,_Regions_Bank,_Indy,_2009.JPG
 *   "Regions Bank - Indianapolis.jpg" (Paul Sableman, CC BY 2.0) - the
 *     narrow face's top with the sign and grey strips.
 *     https://commons.wikimedia.org/wiki/File:Regions_Bank_-_Indianapolis.jpg
 * - Look-only: none.
 *
 * Estimated: the grey strips' width (a fifth of the narrow face each, from
 * the Xnatedawgx photo), the dark band's depth (four storeys), the floor
 * line spacing (three storeys), the mullion spacing, the podium pier
 * rhythm (4.6 m) and fascia, the sign's size.
 * Doubts: the north face is unphotographed (drawn like the south); the
 * sign is drawn on the east face only, as photographed; the west face's
 * sign, if any, is not drawn.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const glassW = new Part(), panel = new Part(), white = new Part()
const dark = new Part(), roof = new Part(), sign = new Part()

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}
function cap(part: Part, ring: XY[], z: number) {
  for (let i = 1; i < ring.length - 1; i++) part.tri(at(ring[0], z), at(ring[i], z), at(ring[i + 1], z))
}
/** A strip on the wall a→b between fractions s..e, set out by `d`. */
function strip(part: Part, a: XY, b: XY, s: number, e: number, z0: number, z1: number, d = 0.05) {
  const n = outward(a, b), p = lerp2(a, b, s), q = lerp2(a, b, e)
  wall(part, [p[0] + n[0] * d, p[1] + n[1] * d], [q[0] + n[0] * d, q[1] + n[1] * d], z0, z1)
}
/** Cut a small bevel at every corner of a counter-clockwise convex ring. */
function chamfer(ring: XY[], c: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const p = ring[(i + ring.length - 1) % ring.length], q = ring[i], r = ring[(i + 1) % ring.length]
    const a = norm2([q[0] - p[0], q[1] - p[1]]), b = norm2([r[0] - q[0], r[1] - q[1]])
    out.push([q[0] - a[0] * c, q[1] - a[1] * c], [q[0] + b[0] * c, q[1] + b[1] * c])
  }
  return out
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ---------- the podium ----------
const PX0 = -60.4, PX1 = 61.5, PY0 = -31.1, PY1 = 30.5, PH = 21, FASCIA = 16.6
{
  const ring = chamfer(rect(PX0, PY0, PX1, PY1), 0.5)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    wall(white, a, b, 0, PH + 1)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    // dark recessed bays between white piers, under the fascia
    const n = Math.round(L / 4.6)
    for (let k = 0; k < n; k++) strip(dark, a, b, (k + 0.14) / n + 0.6 / L, (k + 0.86) / n - 0.6 / L, 0, FASCIA)
  }
  // parapet: the roof sits a metre below its top
  const inner = rect(PX0 + 0.8, PY0 + 0.8, PX1 - 0.8, PY1 - 0.8)
  for (let i = 0; i < 4; i++) {
    const a = inner[(i + 1) % 4], b = inner[i]
    wall(white, a, b, PH, PH + 1)
  }
  const outerR = rect(PX0, PY0, PX1, PY1)
  for (let i = 0; i < 4; i++) {
    const a = outerR[i], b = outerR[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
    white.quad(at(a, PH + 1), at(b, PH + 1), at(c, PH + 1), at(d, PH + 1))
  }
  cap(roof, inner, PH)
}
// the raised block on the podium's roof
{
  const r = chamfer(rect(2, -19, 46, 26), 0.4)
  for (let i = 0; i < r.length; i++) wall(white, r[i], r[(i + 1) % r.length], PH, 26)
  cap(roof, r, 26)
}

// ---------- the tower ----------
const TX0 = -56, TX1 = 0, TY0 = -6, TY1 = 26, H = 154, BAND = 141.5
const LINE = 0.9, STOREY = 3.7
{
  const ring = chamfer(rect(TX0, TY0, TX1, TY1), 0.4)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2) { wall(panel, a, b, PH, H); continue }
    const long = L > 40
    if (long) {
      wall(glassW, a, b, PH, BAND)
      wall(dark, a, b, BAND, H) // the dark screen band
      // vertical mullion lines every ~9 m
      const m = Math.round(L / 9)
      for (let k = 1; k < m; k++) strip(white, a, b, k / m - 0.4 / L, k / m + 0.4 / L, PH, BAND)
    } else {
      // narrow face: grey edge strips, glass between
      const e = 0.2
      wall(panel, a, lerp2(a, b, e), PH, H)
      wall(glassW, lerp2(a, b, e), lerp2(a, b, 1 - e), PH, H)
      wall(panel, lerp2(a, b, 1 - e), b, PH, H)
      for (const t of [1 / 3, 2 / 3]) strip(white, a, b, e + (1 - 2 * e) * t - 0.4 / L, e + (1 - 2 * e) * t + 0.4 / L, PH, H - 1.5)
    }
    // floor lines every three storeys, over the glass only
    const top = long ? BAND : H - 1.5
    for (let z = PH + 3 * STOREY; z < top - 2; z += 3 * STOREY) {
      if (long) strip(white, a, b, 0.004, 0.996, z - LINE / 2, z + LINE / 2)
      else strip(white, a, b, 0.2, 0.8, z - LINE / 2, z + LINE / 2)
    }
  }
  // a thin parapet ring and the roof inside it
  const inner = rect(TX0 + 0.7, TY0 + 0.7, TX1 - 0.7, TY1 - 0.7)
  const outer = rect(TX0, TY0, TX1, TY1)
  for (let i = 0; i < 4; i++) {
    wall(panel, inner[(i + 1) % 4], inner[i], H - 1.5, H)
    panel.quad(at(outer[i], H), at(outer[(i + 1) % 4], H), at(inner[(i + 1) % 4], H), at(inner[i], H))
  }
  cap(roof, inner, H - 1.5)
}

// ---------- the Regions sign, top of the east face ----------
{
  const a: XY = [TX1, TY0], b: XY = [TX1, TY1], n = outward(a, b)
  const P = (u: number, d: number): XY => [a[0] + n[0] * d, a[1] + (b[1] - a[1]) * u]
  // the green logo: a triangle at the sign's left (south) end
  const z0 = 144.6, z1 = 152
  const l0 = P(0.22, 0.3), l1 = P(0.40, 0.3), lt = P(0.31, 0.3)
  sign.tri(at(l0, z0), at(l1, z0), at(lt, z1))
  const k0 = P(0.22, 0.05), k1 = P(0.40, 0.05), kt = P(0.31, 0.05)
  sign.quad(at(l0, z0), at(lt, z1), at(kt, z1), at(k0, z0))
  sign.quad(at(lt, z1), at(l1, z0), at(k1, z0), at(kt, z1))
  // the letters as a pale bar
  strip(white, a, b, 0.42, 0.79, 145.6, 149.6, 0.3)
  const q0 = P(0.42, 0.3), q1 = P(0.79, 0.3), r0 = P(0.42, 0.05), r1 = P(0.79, 0.05)
  white.quad(at(q0, 149.6), at(q1, 149.6), at(r1, 149.6), at(r0, 149.6))
}

// ---------- write ----------
// Light reflective blue-grey glass (STYLE: light curtain wall), grey metal
// edge strips, white floor and mullion lines and sign letters, white podium concrete, a dark navy-slate for the screen
// band and the podium's recessed bays, and the sign's green.
const wallLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[2] < PH + 1.5 ? 0.6 : 0)
const parts = [
  { part: glassW, material: { name: 'window', color: 0xa6bccf, roughness: 0.3 } },
  { part: panel, material: finish('indy-regions-metal', 0xb3b8bd, 0.6) },
  { part: white, material: { ...finish('indy-regions-podium', 0xf0eee8), floodlight: wallLit } },
  { part: dark, material: finish('indy-regions-dark', 0x56617a) },
  { part: roof, material: PALETTE.roof },
  { part: sign, material: finish('neon-regions-green', 0x6fae45, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Regions Tower', parts, {
  license: 'CC0-1.0', bearing: 2.0, elevation: 0, height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/339570767'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/indy-regions-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
