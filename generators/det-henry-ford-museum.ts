/**
 * Henry Ford Museum of American Innovation, Dearborn (1929, Robert O.
 * Derrick) — procedural, CC0-1.0, no textures.
 * bun generators/det-henry-ford-museum.ts
 *
 * Map frame: turned to bearing 121.5°, so +y is the way the front faces
 * (ESE, across the lawn toward Oakwood Boulevard) and x runs along the
 * 250 m front; the outline's edges run at 121.5° and 31.5°. Anchor: the
 * area centroid of the museum outline (way/101385278).
 *
 * The front: a full-size replica of Independence Hall (OSM way/100012155)
 * with its tower facing the lawn, low brick hyphens to each side, the two
 * flanking halls (way/101384731 and way/100012143, standing in for Congress
 * Hall and Old City Hall), and the long brick ranges out to the end blocks.
 * Behind it, the eight-acre exhibition hall: a plain brick box with ten
 * glazed roof monitors running front to back. The front replica group is
 * modelled in detail; the hall plainly.
 *
 * Heights, from the USGS lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018, flown
 * 2017, 1 m), above the lawn:
 *   - spire tip 46.4 m; Independence Hall's ridge balustrade 19.3 m, eaves
 *     about 13.5 m; hyphens 8–9 m; flanking halls 11–12.5 m; ranges 11–12 m;
 *     the Giant Screen block 14–19 m;
 *   - the hall roof 9.5 m with monitors to 11 m every 24 m, gutters 7.2 m.
 *   Irregular 14–25 m returns in the courtyard behind the west hyphen
 *   (x -31 to -10, y 68–89), where OSM maps no building, read as trees and
 *   aren't drawn.
 * The tower's stages are scaled from roger4336's frontal photo to the
 * 46.4 m tip: brick to 22.4 m, the white clock stage to 30 m, a balustrade,
 * the octagonal belfry to 36.2 m, the lead dome to 38.8 m, then the lantern
 * and spire.
 *
 * Evidence
 * - OSM: way/101385278 (The Henry Ford, Q3521242), and the front group
 *   way/100012155, 101384723, 101384761, 101384731, 100012143, 101384736,
 *   101384732, 312704954, 58323558 (Giant Screen Experience), 101386875
 *   (Overflow Lunch Room).
 * - Measured: lidar 2017; USGS NAIP orthophoto (plan, roof monitors).
 * - Published: opened 1929/1933; front buildings replicate Independence
 *   Hall, Congress Hall and Old City Hall (Wikipedia, "Henry Ford Museum of
 *   American Innovation").
 * - Photos (EVIDENCE):
 *   - "Dearborn - Henry Ford Museum", roger4336, Flickr (CC BY-SA 2.0): the
 *     tower and main block, frontal.
 *     https://www.flickr.com/photos/24736216@N07/4364333350
 *   - "Dearborn - The Henry Ford - 20201011113815.jpg", CoolRockC (CC BY-SA
 *     4.0): the tower and the brick wing with its white arched doorways.
 *   - "Ford Museum Independence Hall facade tower.jpg", Dacoslett (CC BY-SA
 *     3.0): the tower's upper stages.
 *   - "Henry Ford Museum, Exterior", mrkumm, Flickr (CC BY 2.0): the arched
 *     entrance doors (night).
 * Estimated: window sizes and counts on the replicas (from the two photos;
 * the Philadelphia building's rhythm where they don't show); the flanking
 * halls' hipped roofs; the hall's walls (no licensed photo shows the sides
 * or back of the exhibition hall; drawn plain brick with high windows).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cylinder, prism, quad, type XY } from './dc-nationals-park'

const HALL: XY[] = [[94.2, 106.1], [94.2, 65.1], [121.3, 64.9], [122.3, 53.5], [125.7, 53.5], [125.7, 38.3], [122.2, 38.3], [122.2, 4.9], [124.7, 4.9], [124.7, -9.7], [121.5, -9.7], [121.5, -44.0], [124.1, -44.0], [124.1, -59.1], [121.3, -59.1], [121.3, -69.0], [108.1, -69.0], [108.1, -72.4], [96.2, -72.3], [96.2, -69.5], [56.4, -69.3], [56.4, -71.9], [43.3, -71.8], [43.3, -83.4], [22.2, -83.3], [22.2, -99.2], [-25.0, -98.9], [-25.0, -83.0], [-46.3, -82.9], [-46.3, -71.2], [-59.6, -71.1], [-59.6, -67.6], [-98.8, -67.4], [-98.8, -69.8], [-103.9, -69.8], [-111.6, -69.7], [-111.6, -67.3], [-123.5, -67.2], [-123.5, -56.1], [-126.5, -56.1], [-126.5, -41.4], [-123.4, -41.4], [-123.4, -7.4], [-126.1, -7.4], [-126.1, 7.7], [-123.2, 7.7], [-123.2, 41.4], [-125.9, 41.4], [-125.9, 56.3], [-122.5, 56.3], [-122.5, 68.1], [-121.2, 68.0], [-121.2, 70.4], [-112.4, 70.4], [-112.3, 67.9], [-110.0, 67.9], [-110.0, 71.1], [-106.4, 71.4], [-106.3, 97.3], [-106.6, 98.6], [-99.9, 98.5], [-100.4, 71.3], [-96.7, 71.3], [-96.7, 67.5], [-86.8, 67.5], [-86.2, 107.6], [-67.8, 107.2], [-67.8, 66.9], [58.9, 66.0], [58.9, 107.0], [77.8, 107.0]]

const brick = new Part(), trim = new Part(), roof = new Part(), glass = new Part(), lead = new Part()

// ---------------------------------------------------------------------------
// The exhibition hall and the ranges in its outline: brick to 9 m.
prism(HALL, 0, 8.3, brick, null)
prism(HALL, 8.3, 9.0, trim, roof)
// The ranges at the front of the outline rise to 11.8 m.
for (const p of [
  [[58.9, 66.0], [94.2, 65.1], [94.2, 106.1], [77.8, 107.0], [58.9, 107.0]],
  [[-86.8, 67.5], [-67.8, 66.9], [-67.8, 107.2], [-86.2, 107.6]],
] as XY[][]) { prism(p, 0, 11.1, brick, null); prism(p, 11.1, 11.8, trim, roof) }
// Ten roof monitors running front to back, glazed on their sides.
for (let k = 0; k < 10; k++) {
  const x = -106 + 24 * k, w = 2.6
  prism([[x - w, -62], [x + w, -62], [x + w, 60], [x - w, 60]], 9.0, 10.4, glass, null)
  prism([[x - w - 0.4, -62.5], [x + w + 0.4, -62.5], [x + w + 0.4, 60.5], [x - w - 0.4, 60.5]], 10.4, 11.0, roof, roof)
}
// The 12 m entrance corridor behind Independence Hall (part of way/100012155).
prism([[-5.1, 66.8], [6.5, 66.7], [6.6, 96.6], [-5.0, 96.7]], 0, 11.3, brick, null)
prism([[-5.1, 66.8], [6.5, 66.7], [6.6, 96.6], [-5.0, 96.7]], 11.3, 12.0, trim, roof)

// ---------------------------------------------------------------------------
// The front group: OSM footprints at their lidar heights.
const FRONT: [XY[], number, boolean][] = [ // [ring, wall height, hipped roof]
  [[[-15.0, 100.8], [-23.9, 100.8], [-23.8, 97.2], [-36.3, 97.2], [-36.3, 101.1], [-44.0, 101.1], [-44.0, 107.1], [-15.0, 107.1]], 8.6, false], // west hyphen
  [[[42.6, 100.1], [36.5, 100.1], [36.5, 96.3], [23.9, 96.4], [23.9, 100.3], [17.2, 100.4], [17.2, 106.7], [42.7, 106.5]], 8.6, false], // east hyphen
  [[[-58.6, 66.8], [-44.0, 66.7], [-44.0, 113.0], [-58.6, 113.0]], 9.2, true], // Congress Hall's stand-in
  [[[44.6, 66.0], [58.9, 66.0], [58.9, 111.4], [42.6, 111.7], [42.6, 100.1], [44.3, 98.9]], 9.2, true], // Old City Hall's stand-in
  [[[-58.6, 101.1], [-67.8, 101.2], [-67.8, 107.2], [-58.6, 107.1]], 8.0, false],
  [[[-86.2, 107.6], [-94.3, 107.6], [-94.3, 121.4], [-110.3, 121.5], [-110.3, 101.0], [-104.8, 100.9], [-104.8, 98.8], [-101.1, 98.8], [-101.1, 100.6], [-94.6, 100.5], [-94.6, 101.6], [-86.2, 101.5]], 11.2, false],
  [[[-100.1, 76.7], [-86.4, 76.5], [-86.3, 93.2], [-100.0, 93.4]], 6.8, false],
  [[[94.2, 106.1], [94.4, 118.4], [110.7, 118.6], [110.6, 105.7], [117.1, 105.6], [117.5, 115.6], [132.3, 115.3], [132.3, 112.6], [141.4, 117.9], [145.5, 112.3], [140.0, 105.5], [142.4, 105.6], [141.9, 64.1], [121.3, 64.9], [94.2, 65.1]], 14.4, false], // Giant Screen
  [[[-134.7, 70.5], [-106.4, 70.4], [-106.3, 97.3], [-115.3, 97.4], [-115.3, 108.4], [-134.7, 108.5]], 10.8, false], // Overflow Lunch Room
]
for (const [ring, h, hip] of FRONT) {
  prism(ring, 0, h - 0.7, brick, null)
  prism(ring, h - 0.7, h, trim, hip ? null : roof)
  if (hip) {
    // A hipped slate roof over the rectangle's bounding box, 3 m high.
    const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1])
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
    hipRoof(x0, x1, y0, y1, h, h + 3)
  }
}

/** A hipped roof over a rectangle, ridge along its longer side. */
function hipRoof(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, part = roof) {
  const along = y1 - y0 > x1 - x0
  const inset = Math.min(x1 - x0, y1 - y0) / 2
  const R0: V3 = along ? [(x0 + x1) / 2, y0 + inset, z1] : [x0 + inset, (y0 + y1) / 2, z1]
  const R1: V3 = along ? [(x0 + x1) / 2, y1 - inset, z1] : [x1 - inset, (y0 + y1) / 2, z1]
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], Cc: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (along) {
    quad(part, [A, B, R0, R0], [0, -1, 1]); quad(part, [Cc, D, R1, R1], [0, 1, 1])
    quad(part, [B, Cc, R1, R0], [1, 0, 1]); quad(part, [D, A, R0, R1], [-1, 0, 1])
  } else {
    quad(part, [A, B, R1, R0], [0, -1, 1]); quad(part, [Cc, D, R0, R1], [0, 1, 1])
    quad(part, [B, Cc, R1, R1], [1, 0, 1]); quad(part, [D, A, R0, R0], [-1, 0, 1])
  }
}

// ---------------------------------------------------------------------------
// Independence Hall: the main block (x -15..17, y 96.5..107), two storeys
// of brick with tall white-framed windows, a slate roof and the white
// balustrade along its ridge; the tower on its front.
{
  const X0 = -15, X1 = 17, Y0 = 96.5, Y1 = 107, EAVE = 13.5
  prism([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, EAVE - 0.8, brick, null)
  prism([[X0 - 0.3, Y0 - 0.3], [X1 + 0.3, Y0 - 0.3], [X1 + 0.3, Y1 + 0.3], [X0 - 0.3, Y1 + 0.3]], EAVE - 0.8, EAVE, trim, null) // cornice
  // A gabled roof with the ridge along x to 17.6 m, then the balustraded deck.
  const zr = 17.6, ym = (Y0 + Y1) / 2
  quad(roof, [[X0, Y1, EAVE], [X1, Y1, EAVE], [X1, ym + 1.6, zr], [X0, ym + 1.6, zr]], [0, 1, 1])
  quad(roof, [[X1, Y0, EAVE], [X0, Y0, EAVE], [X0, ym - 1.6, zr], [X1, ym - 1.6, zr]], [0, -1, 1])
  for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
    quad(brick, [[x, Y0, EAVE], [x, Y1, EAVE], [x, ym + 1.6, zr], [x, ym - 1.6, zr]], [s, 0, 0])
    // end chimneys, a pair on each gable
    for (const y of [ym - 2.6, ym + 2.6]) box(brick, [x - s * 0.8, y, zr], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.7, 1.1, 2.4])
  }
  prism([[X0 + 2, ym - 1.6], [X1 - 2, ym - 1.6], [X1 - 2, ym + 1.6], [X0 + 2, ym + 1.6]], zr, zr + 0.3, roof, roof)
  prism([[X0 + 2, ym - 1.6], [X1 - 2, ym - 1.6], [X1 - 2, ym + 1.6], [X0 + 2, ym + 1.6]], zr + 0.3, 19.3, trim, null) // balustrade
  // Front and back windows: two storeys, nine bays less the tower's.
  const win = (y: number, s: number) => {
    for (let i = 0; i < 9; i++) {
      const x = X0 + 1.8 + i * ((X1 - X0 - 3.6) / 8)
      if (s > 0 && Math.abs(x - 1.5) < 6) continue
      for (const [z0, z1] of [[2.2, 5.6], [7.6, 11.0]]) {
        quad(trim, [[x - 1.05, y + s * 0.05, z0 - 0.3], [x + 1.05, y + s * 0.05, z0 - 0.3], [x + 1.05, y + s * 0.05, z1 + 0.3], [x - 1.05, y + s * 0.05, z1 + 0.3]], [0, s, 0])
        quad(glass, [[x - 0.75, y + s * 0.1, z0], [x + 0.75, y + s * 0.1, z0], [x + 0.75, y + s * 0.1, z1], [x - 0.75, y + s * 0.1, z1]], [0, s, 0])
      }
    }
  }
  win(Y1, 1)
  win(Y0, -1)
}

// The tower (x -4..7, y 107..121 in OSM): a square brick shaft, then the
// white clock stage, balustrade, octagonal belfry, lead dome, lantern and spire.
{
  const cx = 1.5, cy = 114, H = 5.4 // half the brick shaft
  prism([[cx - H, cy - H - 1.6], [cx + H, cy - H - 1.6], [cx + H, cy + H + 1.6], [cx - H, cy + H + 1.6]], 0, 21.6, brick, null)
  prism([[cx - H - 0.35, cy - H - 1.95], [cx + H + 0.35, cy - H - 1.95], [cx + H + 0.35, cy + H + 1.95], [cx - H - 0.35, cy + H + 1.95]], 21.6, 22.4, trim, roof)
  // A white belt course round the shaft at the main block's eaves.
  prism([[cx - H - 0.2, cy - H - 1.8], [cx + H + 0.2, cy - H - 1.8], [cx + H + 0.2, cy + H + 1.8], [cx - H - 0.2, cy + H + 1.8]], 13.0, 13.7, trim, null)
  // The front doorway, arched window and oculus.
  const fy = cy + H + 1.6 + 0.06
  quad(trim, [[cx - 1.5, fy, 0], [cx + 1.5, fy, 0], [cx + 1.5, fy, 4.4], [cx - 1.5, fy, 4.4]], [0, 1, 0]) // door surround
  quad(glass, [[cx - 1.0, fy + 0.04, 0.2], [cx + 1.0, fy + 0.04, 0.2], [cx + 1.0, fy + 0.04, 3.8], [cx - 1.0, fy + 0.04, 3.8]], [0, 1, 0])
  quad(trim, [[cx - 2.4, fy, 4.6], [cx + 2.4, fy, 4.6], [cx, fy, 6.0], [cx, fy, 6.0]], [0, 1, 0]) // pediment over it
  // the tall round-headed window
  {
    const n = 8, r = 1.2, zb = 7.4, zs = 11.2
    quad(glass, [[cx - r, fy + 0.04, zb], [cx + r, fy + 0.04, zb], [cx + r, fy + 0.04, zs], [cx - r, fy + 0.04, zs]], [0, 1, 0])
    for (let i = 0; i < n; i++) {
      const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
      glass.tri([cx, fy + 0.04, zs], [cx + r * Math.cos(a0), fy + 0.04, zs + r * Math.sin(a0)], [cx + r * Math.cos(a1), fy + 0.04, zs + r * Math.sin(a1)], undefined, undefined, undefined, [[0, 1, 0], [0, 1, 0], [0, 1, 0]])
    }
  }
  // the oculus and a white band near the shaft's top
  {
    const n = 12, r = 0.9, z = 17.0
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      trim.tri([cx, fy + 0.04, z], [cx + r * Math.cos(a0), fy + 0.04, z + r * Math.sin(a0)], [cx + r * Math.cos(a1), fy + 0.04, z + r * Math.sin(a1)], undefined, undefined, undefined, [[0, 1, 0], [0, 1, 0], [0, 1, 0]])
    }
  }
  // Clock stage, 22.4–30 m, 8.2 m square, with a clock on each face.
  const S = 4.1
  prism([[cx - S, cy - S], [cx + S, cy - S], [cx + S, cy + S], [cx - S, cy + S]], 22.4, 29.4, trim, null)
  prism([[cx - S - 0.5, cy - S - 0.5], [cx + S + 0.5, cy - S - 0.5], [cx + S + 0.5, cy + S + 0.5], [cx - S - 0.5, cy + S + 0.5]], 29.4, 30.1, trim, roof)
  for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]) {
    const c: V3 = [cx + nx * (S + 0.06), cy + ny * (S + 0.06), 26.2], t: V3 = [-ny, nx, 0], n = 12, r = 1.7
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      const P = (a: number): V3 => [c[0] + t[0] * r * Math.cos(a), c[1] + t[1] * r * Math.cos(a), c[2] + r * Math.sin(a)]
      lead.tri(c, P(a0), P(a1), undefined, undefined, undefined, [[nx, ny, 0], [nx, ny, 0], [nx, ny, 0]])
    }
  }
  // Balustrade round the clock stage's top.
  for (const [a, b] of [[[cx - S - 0.4, cy - S - 0.4], [cx + S + 0.4, cy - S - 0.4]], [[cx + S + 0.4, cy - S - 0.4], [cx + S + 0.4, cy + S + 0.4]], [[cx + S + 0.4, cy + S + 0.4], [cx - S - 0.4, cy + S + 0.4]], [[cx - S - 0.4, cy + S + 0.4], [cx - S - 0.4, cy - S - 0.4]]] as [XY, XY][]) {
    const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 30.75], L = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2
    const e: V3 = [(b[0] - a[0]) / (2 * L), (b[1] - a[1]) / (2 * L), 0]
    box(trim, m, [e, [-e[1], e[0], 0], [0, 0, 1]], [L, 0.15, 0.65])
  }
  // Octagonal belfry, 30.1–36.2 m, with an arched opening in each face.
  const R8 = 2.75
  cylinder(trim, [cx, cy], R8, 30.1, 35.6, 8, null)
  for (let i = 0; i < 8; i++) {
    const a = (2 * Math.PI * (i + 0.5)) / 8, n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-n[1], n[0], 0]
    const rr = R8 * Math.cos(Math.PI / 8) + 0.05, c: V3 = [cx + n[0] * rr, cy + n[1] * rr, 0]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    quad(lead, [P(-0.55, 31.0), P(0.55, 31.0), P(0.55, 34.0), P(-0.55, 34.0)], n)
    lead.tri(P(-0.55, 34.0), P(0.55, 34.0), P(0, 34.55), undefined, undefined, undefined, [n, n, n])
  }
  cylinder(trim, [cx, cy], R8 + 0.35, 35.6, 36.2, 8, null)
  // Lead dome, 36.2–38.8 m.
  {
    const n = 8, rings = 4
    for (let k = 0; k < rings; k++) {
      const p0 = (Math.PI / 2) * (k / rings), p1 = (Math.PI / 2) * ((k + 1) / rings)
      const r0 = (R8 + 0.1) * Math.cos(p0), r1 = (R8 + 0.1) * Math.cos(p1), z0 = 36.2 + 2.6 * Math.sin(p0), z1 = 36.2 + 2.6 * Math.sin(p1)
      for (let i = 0; i < n; i++) {
        const a0 = (2 * Math.PI * (i + 0.5)) / n, a1 = (2 * Math.PI * (i + 1.5)) / n
        const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
        const nn = (p: number, a: number): V3 => [Math.cos(p) * Math.cos(a), Math.cos(p) * Math.sin(a), Math.sin(p)]
        lead.tri(P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), undefined, undefined, undefined, [nn(p0, a0), nn(p0, a1), nn(p1, a1)])
        if (r1 > 0.3) lead.tri(P(r0, a0, z0), P(r1, a1, z1), P(r1, a0, z1), undefined, undefined, undefined, [nn(p0, a0), nn(p1, a1), nn(p1, a0)])
      }
    }
  }
  // Lantern and spire.
  cylinder(trim, [cx, cy], 0.85, 38.4, 41.0, 8, trim)
  cylinder(trim, [cx, cy], 0.45, 41.0, 43.6, 8, trim)
  {
    const n = 8, r = 0.35
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      trim.tri([cx + r * Math.cos(a0), cy + r * Math.sin(a0), 43.6], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), 43.6], [cx, cy, 46.4])
    }
  }
}

// High windows on the flanking halls and ranges' front faces.
function frontWindows(x0: number, x1: number, y: number, z0: number, z1: number, bay: number) {
  const n = Math.max(1, Math.round((x1 - x0) / bay))
  for (let i = 0; i < n; i++) {
    const u0 = x0 + ((x1 - x0) / n) * i + 0.9, u1 = x0 + ((x1 - x0) / n) * (i + 1) - 0.9
    quad(glass, [[u0, y + 0.06, z0], [u1, y + 0.06, z0], [u1, y + 0.06, z1], [u0, y + 0.06, z1]], [0, 1, 0])
  }
}
frontWindows(-58.6, -44.0, 113.0, 2.5, 7.5, 3.6)
frontWindows(42.6, 58.9, 111.6, 2.5, 7.5, 3.6)
frontWindows(-44.0, -15.0, 107.1, 1.8, 6.4, 4.2) // the hyphens' arched doorways, as tall panels
frontWindows(17.2, 42.7, 106.6, 1.8, 6.4, 4.2)
frontWindows(58.9, 94.2, 107.0, 3, 9.5, 4.4)
frontWindows(-86.2, -67.8, 107.4, 3, 9.5, 4.4)

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('hfm-brick', 0xb87a66) },
  { part: trim, material: { ...PALETTE.trim, floodlight: (p: V3, n: V3) => (p[2] > 21 && Math.hypot(p[0] - 1.5, p[1] - 114) < 7 && n[2] < 0.8 ? 0.85 : 0) } },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
  { part: lead, material: finish('hfm-lead', 0x8b9299) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Henry Ford Museum of American Innovation', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 121.5, osm: 'way/101385278', height: 46.4,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/det-henry-ford-museum.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
