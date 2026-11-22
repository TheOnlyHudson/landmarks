/**
 * The Children's Museum of Indianapolis (1976 building, Wallace Hall
 * additions; Dinosphere 2004 in the former CineDome; the sauropods 2009),
 * 3000 North Meridian Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-childrens-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the outline's walls
 * run within 2 degrees of north). The origin is the area centroid of OSM
 * way/297351032 (-86.1577714, 39.8107166). y = 0 is the low ground on the
 * Meridian Street (east) side, 219.6 m (lidar reference 217.55 + 2.05);
 * the ground rises 1.5 m to the Illinois Street (west) side, where the
 * Dinosphere and the glass front stand (Gw = 1.55).
 *
 * Identity (from the photos below):
 *  1. The Dinosphere: a truncated cone clad in cream and golden-tan
 *     diamond panels in three bands, with a low grey-green dome. (W, SW)
 *  2. The two sauropods (an adult and its young) bursting out of the
 *     Dinosphere's wall toward the corner of Illinois and 30th Streets,
 *     the adult's long neck stretched out over the plaza.        (SW)
 *  3. The glass front on the west garden: five storeys of glass over a
 *     glazed ground floor, under a green parapet that swells into a hump
 *     in the middle (the vault over the atrium behind).             (W)
 *  4. The big flat-roofed red-brown brick blocks behind, stepping
 *     between two heights; the small silver dome on the Meridian side; a
 *     glass pyramid skylight.                               (NAIP, lidar)
 *
 * Sources
 * - OSM (ODbL): way/297351032 (building=yes, "Childrens Museum"), with
 *   the roof ways way/704223298 (the north entrance canopy) and
 *   way/704223299 (over the Dinosphere) and the part way/704225434 (the
 *   glass front block). No heights.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid, model z = lidar - 2.05. Measured: the Dinosphere's
 *   rim 18.3..20.4 at r 13, its dome 24.1 at the centre (-77, -30.5); the
 *   glass front block 18.8..21.5 with its vault to 23.4 along y -10..10;
 *   the brick blocks 19.3..19.6 and 22.8..23.4; the north lobby 13.5..13.9;
 *   the canopy 8.4..8.6; the wing by the Dinosphere 15.8..16.6; the low
 *   courtyard 9.4..12.6; the silver dome 11.6..12.2; the skylight 25..29.
 *   Ground 2.0 (east) .. 3.9 (west). The sauropods (2009) are older than
 *   the flight but too small and thin to measure.
 * - USGS NAIP orthophoto (public domain): the plan, the green vault roof,
 *   the silver dome, the glass pyramid, the dark curved wing, the plaza
 *   at the south-west where the sauropods stand.
 * - Photos (Wikimedia Commons):
 *   "The Children's Museum of Indianapolis - March 2012 01.jpg"
 *   (anjanettew, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:The_Children%27s_Museum_of_Indianapolis_-_March_2012_01.jpg),
 *   the glass front with its green hump;
 *   "The Children's Museum of Indianapolis - March 2012 03.jpg"
 *   (anjanettew, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:The_Children%27s_Museum_of_Indianapolis_-_March_2012_03.jpg)
 *   and "... March 2012 02.jpg" (anjanettew, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:The_Children%27s_Museum_of_Indianapolis_-_March_2012_02.jpg),
 *   the Dinosphere, its diamond cladding and dome, and the sauropods,
 *   from the Illinois Street skywalk.
 *
 * Estimated: the cone's radii (17.2 at the base from OSM, 13.6 at the rim
 *   from lidar), its three bands and the dome; the sauropods' size and
 *   pose (the adult about 7 m to the back, 16 m from the wall to the
 *   snout, heading about 235 degrees) from the photos against the cone;
 *   the glass front's storeys; the block split from lidar steps.
 * Doubts: the north, east and south walls are not photographed here and
 *   are drawn as plain brick with a pale coping; the glass front photo is
 *   from 2012. The free-standing brachiosaur that once stood before the
 *   glass front is left out (not in the newer aerial).
 * Left out: the six small domes in the low courtyard, the skywalk over
 *   Illinois Street, the rooftop plant, the diamond panels' joints.
 * Night: the glass front and the entrance glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, ccw, flatShape, lathe, finishGlb, writeModel, type Face } from './sea-tacoma-union-station'

const brick = new Part(), cream = new Part(), tan = new Part(), win = new Part(), roof = new Part(), green = new Part()
const GW = 1.55 // the west ground above y = 0

/** A brick block over a polygon with a pale coping. */
function block(r: XY[], h: number, wall: Part = brick) {
  const p = ccw(r)
  prism(wall, roof, p, 0, h - 0.6, 30)
  prism(cream, roof, p, h - 0.6, h, 30)
}

// ---------------------------------------------------------------- the brick blocks (east)
block(rect(2.5, -47.0, 36.0, -10.0), 21.0)
block([[36.0, -38.0], [70.0, -37.6], [69.2, -6.0], [55.0, -6.0], [55.0, 12.0], [36.0, 12.0]], 17.5)
block(rect(36.0, 12.0, 68.5, 51.0), 21.0)
block(rect(2.5, -10.0, 36.0, 50.0), 17.5)
block([[22.4, 50.0], [48.6, 51.0], [48.8, 60.2], [22.2, 59.8]], 11.5)
// the north entrance canopy (way/704223298): a slab on posts
{
  const z0 = 6.0, z1 = 6.6
  prism(cream, cream, rect(22.5, 59.8, 48.8, 64.8), z0, z1)
  for (const x of [24, 35.5, 47]) prism(cream, null, rect(x - 0.25, 64.0, x + 0.25, 64.5), 0, z0)
}
// the glass pyramid skylight
{
  const cx = 21, cy = 3.5, a = 6.0, b = 6.5, z0 = 17.5, z1 = 23.5
  const c: V3[] = [[cx - a, cy - b, z0], [cx + a, cy - b, z0], [cx + a, cy + b, z0], [cx - a, cy + b, z0]]
  for (let i = 0; i < 4; i++) win.tri(c[i], c[(i + 1) % 4], [cx, cy, z1])
}
// the small silver dome on the Meridian side
lathe(roof, 63.0, 2.6, [[8.2, 0], [8.2, 3.0], [7.6, 5.5], [5.8, 7.9], [3.1, 9.5], [0.01, 10.1]], 16)

// ---------------------------------------------------------------- the west wings
// north-west block, the higher part toward Illinois Street
block([[-56.0, 15.0], [-37.7, 19.1], [-26.7, 24.2], [-26.1, 13.0], [2.5, 13.0], [2.5, 47.5], [-11.2, 47.2], [-13.7, 55.8], [-56.3, 55.0], [-56.3, 45.0], [-64.7, 42.4]], 14.0)
block([[-57.5, 20.0], [-26.5, 20.0], [-26.5, 55.5], [-56.3, 55.0], [-56.3, 45.0], [-64.7, 42.4]], 17.0)
// the south block between the glass front and the brick blocks
block(rect(-14.0, -46.0, 2.5, -12.0), 14.5)
// the low courtyard block (its six small domes left out)
block([[-50.0, -48.5], [-32.0, -49.4], [-22.6, -47.8], [-14.0, -45.0], [-14.0, -21.0], [-50.0, -21.0]], 8.0)
// the dark curved wing from the Dinosphere to the glass front, and the wing beside the Dinosphere
block([[-85.9, -3.2], [-78.6, -1.3], [-71.4, -1.1], [-64.8, -2.7], [-58.4, -5.4], [-51.8, -8.1], [-43.6, -10.3], [-37.2, -11.6], [-26.3, -12.0], [-14.0, -12.0], [-14.0, -21.0], [-62.0, -21.0], [-70.0, -17.0]], 14.0)
block([[-64.0, -47.5], [-51.3, -44.6], [-50.0, -21.0], [-64.0, -21.0]], 14.3)

// ---------------------------------------------------------------- the glass front block and its vault
{
  const X0 = -28.0, X1 = 2.5, Y0 = -12.0, Y1 = 13.0, H = 17.0
  prism(brick, roof, ccw(rect(X0, Y0, X1, Y1)), 0, H, 30)
  // the west face: glazed ground floor, a pale band, five storeys of glass
  const W: Face = { o: [X0, Y1, 0], n: [-1, 0] } // s runs south along the face
  flatShape(win, W, rect(1.0, GW + 0.2, Y1 - Y0 - 1.0, GW + 4.4), 0.05)
  flatShape(cream, W, rect(0.0, GW + 4.4, Y1 - Y0, GW + 5.0), 0.06)
  flatShape(win, W, rect(0.3, GW + 5.0, Y1 - Y0 - 0.3, H - 0.9), 0.05)
  // the green parapet and the hump: a vault along x over y -10..10
  prism(green, green, ccw(rect(X0 - 0.1, Y0, X1, Y1)), H - 0.9, H, 30)
  const n = 10, R = 10.0, rise = 4.2
  const prof: XY[] = []
  for (let k = 0; k <= n; k++) {
    const t = k / n, y = -R + 2 * R * t
    prof.push([y, H + rise * Math.sin(Math.PI * t) ** 1.5])
  }
  for (let k = 0; k < n; k++) {
    const [ya, za] = prof[k], [yb, zb] = prof[k + 1]
    green.quad([X1, ya, za], [X1, yb, zb], [X0 - 0.1, yb, zb], [X0 - 0.1, ya, za])
  }
  // the vault's west end: glass under a green edge, and the east end
  for (let k = 0; k < n; k++) {
    const [ya, za] = prof[k], [yb, zb] = prof[k + 1]
    if (za - 0.6 > H && zb - 0.6 > H) win.quad([X0 - 0.1, ya, H], [X0 - 0.1, ya, za - 0.6], [X0 - 0.1, yb, zb - 0.6], [X0 - 0.1, yb, H])
    green.quad([X0 - 0.1, ya, za - 0.6], [X0 - 0.1, ya, za], [X0 - 0.1, yb, zb], [X0 - 0.1, yb, zb - 0.6])
    brick.quad([X1, ya, H], [X1, yb, H], [X1, yb, zb], [X1, ya, za])
  }
}

// ---------------------------------------------------------------- the Dinosphere
const DC: XY = [-78.0, -30.5]
{
  const [cx, cy] = DC
  const r0 = 17.2, rTop = 13.6, zTop = 16.6, N = 28
  const rAt = (z: number) => r0 + ((rTop - r0) * z) / zTop
  const P = (a: number, z: number): V3 => { const r = rAt(z); return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] }
  // the pale plinth band
  const zb = GW + 1.0
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
    cream.quad(P(a0, 0), P(a1, 0), P(a1, zb), P(a0, zb))
  }
  // three bands of diamonds: tan diamonds in each band, cream diamonds between (their halves pair up at the band joints)
  const bands = 3, bh = (zTop - zb) / bands, h = Math.PI / N
  for (let b = 0; b < bands; b++) {
    const z0 = zb + b * bh, zm = z0 + bh / 2, z1 = z0 + bh
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
      tan.quad(P(a, z0), P(a + h, zm), P(a, z1), P(a - h, zm))
      cream.tri(P(a, z0), P(a1, z0), P(a + h, zm))
      cream.tri(P(a + h, zm), P(a1, z1), P(a, z1))
    }
  }
  // the rim and the low dome
  lathe(cream, cx, cy, [[rTop, zTop], [rTop, zTop + 1.4], [rTop - 0.6, zTop + 1.4]], N)
  lathe(green, cx, cy, [[rTop - 0.6, zTop + 1.4], [11.5, zTop + 2.9], [8.0, zTop + 4.3], [4.0, zTop + 5.1], [0.01, zTop + 5.4]], N)
}

// ---------------------------------------------------------------- the sauropods
/** A tube through spine points [x, y, z, r], `n` sides, ends capped. */
function tube(part: Part, spine: [number, number, number, number][], n = 8, squash = 1) {
  const rings: V3[][] = spine.map(([x, y, z, r], k) => {
    const a = spine[Math.max(0, k - 1)], b = spine[Math.min(spine.length - 1, k + 1)]
    const t = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
    let u = crs(t, [0, 0, 1])
    if (Math.hypot(...u) < 0.2) u = crs(t, [1, 0, 0])
    u = norm(u)
    const v = norm(crs(u, t))
    return Array.from({ length: n }, (_, i) => {
      const ang = (i / n) * 2 * Math.PI, c = Math.cos(ang) * r, s = Math.sin(ang) * r * squash
      return [x + u[0] * c + v[0] * s, y + u[1] * c + v[1] * s, z + u[2] * c + v[2] * s] as V3
    })
  })
  for (let k = 0; k + 1 < rings.length; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      part.quad(rings[k][i], rings[k + 1][i], rings[k + 1][j], rings[k][j])
    }
  }
  const c0 = spine[0], c1 = spine[spine.length - 1]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    part.tri([c0[0], c0[1], c0[2]], rings[0][i], rings[0][j])
    part.tri([c1[0], c1[1], c1[2]], rings[rings.length - 1][j], rings[rings.length - 1][i])
  }
}
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * A sauropod emerging from the wall: `o` the wall point on the ground,
 * heading `deg` (compass), scale `s`. u runs forward, w to its left.
 */
function sauropod(part: Part, o: XY, deg: number, s: number, z0: number) {
  const b = (deg * Math.PI) / 180, f: XY = [Math.sin(b), Math.cos(b)], l: XY = [-f[1], f[0]]
  const at = (u: number, w: number, z: number, r: number): [number, number, number, number] =>
    [o[0] + (f[0] * u + l[0] * w) * s, o[1] + (f[1] * u + l[1] * w) * s, z0 + z * s, r * s]
  // tail (in the wall), body, neck, head
  tube(part, [
    at(-5.0, 0, 5.0, 0.6), at(-2.0, 0, 5.6, 1.4), at(0.2, 0, 5.9, 2.0), at(2.6, 0, 6.0, 2.3),
    at(5.0, 0, 6.1, 2.0), at(6.8, 0, 6.7, 1.5), at(9.2, 0, 7.4, 1.1), at(12.0, 0, 7.9, 0.85),
    at(14.6, 0, 8.1, 0.7), at(15.4, 0, 8.1, 0.85), at(16.6, 0, 7.8, 0.55),
  ], 8, 0.9)
  // legs: columns, a little splayed
  for (const [u, w, r] of [[0.9, 1.3, 0.8], [0.9, -1.3, 0.8], [4.9, 1.2, 0.68], [4.9, -1.2, 0.68]] as [number, number, number][]) {
    tube(part, [at(u + 0.2, w * 1.15, 0, r * 1.1), at(u, w, 3.0, r), at(u, w * 0.8, 5.6, r * 1.2)], 6)
  }
}
{
  // the adult and the young at the Dinosphere's south-west wall, heading toward the corner
  const hd = 235, a = (hd * Math.PI) / 180
  const wall = (rr: number, side: number): XY => [DC[0] + Math.sin(a) * rr + Math.cos(a) * side, DC[1] + Math.cos(a) * rr - Math.sin(a) * side]
  sauropod(tan, wall(15.8, 0), hd, 1.1, GW)
  sauropod(tan, wall(16.4, 5.5), hd - 8, 0.5, GW)
}

const built = finishGlb("The Children's Museum of Indianapolis", [
  { part: brick, material: finish('indy-cm-brick', 0xb0735e) },
  { part: cream, material: finish('indy-cm-cream', 0xeee2c8) },
  { part: tan, material: finish('indy-cm-tan', 0xcdab7a) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: green, material: finish('indy-cm-green', 0x86b394) },
], { bearing: 0, height: 23.5, replaces: ['way/297351032', 'way/704223298', 'way/704223299', 'way/704225434'] }, 5000)
await writeModel('indy-childrens-museum', built)
