/**
 * The Atlantis (1982, Arquitectonica), 2025 Brickell Avenue, Miami —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-atlantis.ts [out.glb]
 *
 * Uses the ring kit exported from mia-panorama-tower.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 52.4, so +x
 * runs along the slab to its south-east end (bearing 142.4) and +y faces
 * Biscayne Bay. Anchor = area centroid of the OSM outline way/480909198,
 * 25.7529294, -80.1985402.
 *
 * Form: a thin 20-storey slab, 92 m long and 13 m deep, with a rounded
 * south-east nose. The Brickell Avenue face (south-west) is a blue glass
 * grid; the bay face is a white concrete frame of balconies. A cube-shaped
 * "sky court" is punched right through the slab at mid height, with a
 * yellow wall on its south-east side, a red spiral stair and a palm. A red
 * open triangle stands on the roof at the south-east end, white plant
 * boxes at the north-west end, and yellow wavy balconies lap the
 * north-west corner of the glass face low down.
 *
 * Sources:
 *  - OSM: outline way/480909198 (54.6 m, 20 levels, wikidata Q3286640),
 *    used as drawn.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 0.5 m grid in the slab frame. Measured: slab roof 54-55 m above
 *    the grid's lowest return (about 52 m above the street), plan x
 *    -48..+44, y -9..+5 (matches OSM), roof boxes to 60-62 m at x -47..-38,
 *    -29..-23 and +16..+22. The open triangle barely registers.
 *  - Published: 20 floors (OSM); the sky court is a cube about five storeys
 *    high (widely described).
 *  - Estimated from the photos: sky court position and size (12 m wide, x -17..-5, 20-33.5 m:
 *    about floors 8-13, counted on the photo's glass grid; five storeys),
 *    triangle size (13 m wide, 10 m high, centred x +35), balcony and grid
 *    spacing, yellow balconies.
 *
 * Photos:
 *  - Atlantiscondominium.jpg, Averette, CC BY 3.0 (Wikimedia Commons) —
 *    daylight, from Brickell Avenue to the south-west: glass grid, sky
 *    court with the yellow wall, red stair and palm, red roof triangle,
 *    yellow balconies at the north-west end;
 *  - "Atlantis Brickell Condo", miamism, CC BY 2.0 (Flickr
 *    https://www.flickr.com/photos/23245739@N02/4523587635) — from the bay
 *    side: the white balcony frame, the sky court seen through, the
 *    triangle. Its colours are filtered (purple/red cast), so it was used
 *    for shapes only.
 * No commercial imagery or 3D tiles were used. No look-only sources.
 *
 * Doubts: only two licensed photos; the sky court's exact floor and
 * position along the slab are read from one oblique photo. The lead's
 * notes mention a yellow roof triangle; the licensed daylight photo shows
 * it red, and it is drawn red. No licensed night photo: only the windows
 * glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, walls, capRing, panels, ringEdges, edgeRect, face, box, build } from './mia-panorama-tower'

const glass = new Part(), white = new Part(), yellow = new Part(), red = new Part(), roof = new Part(), green = new Part()

const RING: XY[] = ccw([[42.4, 2.8], [43.8, 0.3], [43.6, -3.0], [42.2, -5.0], [39.7, -6.4], [35.4, -7.1], [35.2, -9.0], [-44.9, -8.8], [-45.2, -6.4], [-48.7, -6.2], [-48.7, 4.6], [39.8, 5.0]])
const ROOF = 52.5
const XA = -17, XB = -5, H0 = 20, H1 = 33.5 // the sky court

/** Keep the part of a ring on one side of x = c (Sutherland–Hodgman). */
function clipX(r: XY[], c: number, keepLess: boolean): XY[] {
  const inside = (p: XY) => (keepLess ? p[0] <= c : p[0] >= c)
  const out: XY[] = []
  r.forEach((p, i) => {
    const q = r[(i + 1) % r.length]
    if (inside(p)) out.push(p)
    if (inside(p) !== inside(q)) { const t = (c - p[0]) / (q[0] - p[0]); out.push([c, p[1] + (q[1] - p[1]) * t]) }
  })
  return out
}

// faces: the SW (Brickell) face is glass, the bay face and ends a white frame
function slab(r: XY[], z0: number, z1: number) {
  const es = ringEdges(r)
  for (const e of es) {
    const sw = e.o[1] < -0.7
    const nose = e.a[0] > 34 && !sw && e.L < 10
    const part = sw || nose ? glass : white
    edgeRect(part, e, 0, e.L, z0, z1, 0)
  }
}

const lower = clipX(RING, 1e9, true)
slab(lower, 0, H0)
capRing(white, lower, H0)               // the court floor (and hidden slab interior)
const upper = lower
slab(upper, H1, ROOF)
capRing(white, upper, H1, false)        // the court ceiling
capRing(roof, upper, ROOF)
const left = clipX(RING, XA, true), right = clipX(RING, XB, false)
slab(left, H0, H1)
slab(right, H0, H1)
// the court's inner walls: white on the north-west, yellow on the south-east
for (const [r, part, cut] of [[left, white, XA], [right, yellow, XB]] as [XY[], Part, number][]) {
  for (const e of ringEdges(r)) if (Math.abs(e.a[0] - cut) < 1e-6 && Math.abs(e.t[0]) < 0.01) {
    edgeRect(part, e, 0, e.L, H0, H1, 0)
  }
}

// glass grid on the Brickell face: pale lines every three floors and ~6 m
{
  const e = ringEdges(RING).find((q) => q.o[1] < -0.7 && q.L > 50)!
  // e runs from the SE (x 35) to the NW (x -45): s = distance from its start
  const sOf = (x: number) => (x - e.a[0]) / e.t[0]
  for (let z = 3; z < ROOF - 1; z += 7.9) {
    if (z > H0 && z < H1) {
      edgeRect(white, e, 0, sOf(XB), z - 0.2, z + 0.2, 0.05)
      edgeRect(white, e, sOf(XA), e.L, z - 0.2, z + 0.2, 0.05)
    } else edgeRect(white, e, 0, e.L, z - 0.2, z + 0.2, 0.05)
  }
  for (let x = -39; x < 34; x += 9.2) {
    if (x > XA - 0.5 && x < XB + 0.5) {
      edgeRect(white, e, sOf(x) - 0.2, sOf(x) + 0.2, 0, H0, 0.05)
      edgeRect(white, e, sOf(x) - 0.2, sOf(x) + 0.2, H1, ROOF, 0.05)
    } else edgeRect(white, e, sOf(x) - 0.2, sOf(x) + 0.2, 0, ROOF, 0.05)
  }
  // the white stair-core strip near the south-east end, with its small windows
  edgeRect(white, e, sOf(17) - 1.6, sOf(17) + 1.6, 0, ROOF, 0.06)
  // the yellow frame on the court's south-east side and lintel
  edgeRect(yellow, e, sOf(XB + 1.3), sOf(XB), H0 - 0.6, H1 + 1.3, 0.08)
  edgeRect(yellow, e, sOf(XB + 1.3), sOf(XA), H1, H1 + 1.3, 0.08)
  // yellow wavy balconies lapping the north-west end, low down
  for (const z of [4.5, 7.2, 9.9, 12.6]) {
    const b: XY[] = [[-48.7, -8.8], [-36, -8.8], [-36, -10.4], [-40, -11.2], [-44, -10.6], [-48.7, -10.2]]
    walls(ccw(b), [[z - 0.5, z, yellow]])
    capRing(yellow, ccw(b), z)
    capRing(yellow, ccw(b), z - 0.5, false)
  }
}

// bay face: window panels in the white balcony frame, two floors to a row
{
  const bay = ringEdges(RING).filter((e) => e.o[1] > 0.7 && e.L > 30)
  for (const e of bay) {
    const n = Math.round(e.L / 6.3), bw = e.L / n
    for (let k = 0; k < n; k++) {
      const x0 = e.a[0] + e.t[0] * (k * bw + 0.8), x1 = e.a[0] + e.t[0] * ((k + 1) * bw - 0.8)
      const inCourt = Math.max(x0, x1) > XA && Math.min(x0, x1) < XB
      for (let z = 1.2; z < ROOF - 2; z += 5.3) {
        if (inCourt && z + 4.2 > H0 && z < H1) continue
        edgeRect(glass, e, k * bw + 0.8, (k + 1) * bw - 0.8, z, z + 3.9, 0.05)
      }
    }
  }
}

// ---- the sky court's red spiral stair and palm ----
function cylinder(part: Part, c: XY, r: number, z0: number, z1: number, seg = 10) {
  const ring: XY[] = Array.from({ length: seg }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / seg), c[1] + r * Math.sin((2 * Math.PI * k) / seg)])
  walls(ring, [[z0, z1, part]], 1)
  capRing(part, ring, z1)
}
cylinder(red, [XA + 2.8, -5.6], 0.7, H0, H1 - 0.4)
for (let z = H0 + 0.8; z < H1 - 1; z += 1.5) box(red, XA + 2.8, -5.6, 4.8, 1.3, z, z + 0.5, ((z - H0) * 50) % 360)
cylinder(roof, [XB - 4, 0], 0.4, H0, H0 + 8.5, 6)
{
  // the palm's crown: a low octahedron of fronds
  const c: V3 = [XB - 4, 0, H0 + 8.8], R = 3.2
  const pts: V3[] = [[c[0] + R, c[1], c[2]], [c[0], c[1] + R, c[2]], [c[0] - R, c[1], c[2]], [c[0], c[1] - R, c[2]]]
  const top: V3 = [c[0], c[1], c[2] + 1], bot: V3 = [c[0], c[1], c[2] - 1.4]
  for (let k = 0; k < 4; k++) {
    const a = pts[k], b = pts[(k + 1) % 4]
    const n = (p: V3, q: V3, s: V3): V3 => { const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [s[0] - p[0], s[1] - p[1], s[2] - p[2]]; const x: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const l = Math.hypot(...x); return [x[0] / l, x[1] / l, x[2] / l] }
    face(green, [a, b, top], n(a, b, top))
    face(green, [b, a, bot], n(b, a, bot))
  }
}

// ---- roof: plant boxes and the red open triangle ----
box(white, -42.5, -0.8, 9, 10, ROOF, 60)
box(white, -26, -1, 6, 8, ROOF, 58)
box(white, 19, -1, 6, 8, ROOF, 58)
{
  const cx = 35, half = 6.5, h = 10, t = 1.4, y0 = -2.2, y1 = -0.6
  const A: [number, number] = [cx - half, ROOF], B: [number, number] = [cx + half, ROOF], C: [number, number] = [cx, ROOF + h]
  // inner triangle: each side moved in by t
  const inc = (P: [number, number], Q: [number, number], R: [number, number]): [number, number] => {
    const g = [(P[0] + Q[0] + R[0]) / 3, (P[1] + Q[1] + R[1]) / 3]
    const r = (half * h) / (half + Math.hypot(half, h)) // inradius
    const k = (r - t) / r
    return [g[0] + (P[0] - g[0]) * k, g[1] + (P[1] - g[1]) * k] as [number, number]
  }
  const a = inc(A, B, C), b = inc(B, C, A), c = inc(C, A, B)
  const bar = (q: [number, number][]) => {
    const front = q.map(([x, z]) => [x, y0, z] as V3), back = q.map(([x, z]) => [x, y1, z] as V3)
    face(red, front, [0, -1, 0])
    face(red, [...back].reverse(), [0, 1, 0])
    for (let i = 0; i < q.length; i++) {
      const j = (i + 1) % q.length
      const dx = q[j][0] - q[i][0], dz = q[j][1] - q[i][1], l = Math.hypot(dx, dz)
      face(red, [front[i], front[j], back[j], back[i]], [dz / l, 0, -dx / l])
    }
  }
  // ccw in (x, z) as seen from -y
  bar([A, B, b, a])
  bar([B, C, c, b])
  bar([C, A, a, c])
}

await build('The Atlantis', 'mia-atlantis', [
  { part: glass, material: windowVariant(2, 0x7f9fbd) },
  { part: white, material: PALETTE.trim },
  { part: yellow, material: finish('atlantis-yellow', 0xe9c84a) },
  { part: red, material: finish('atlantis-red', 0xc8463c) },
  { part: roof, material: PALETTE.roof },
  { part: green, material: finish('atlantis-palm', 0x6f9a55) },
], { bearing: 52.4, elevation: 0, height: ROOF + 10, replaces: ['way/480909198'] }, process.argv[2])
