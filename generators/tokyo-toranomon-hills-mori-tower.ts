/**
 * Toranomon Hills Mori Tower (虎ノ門ヒルズ森タワー), Toranomon, Minato,
 * Tokyo: procedural, CC0-1.0.  bun generators/tokyo-toranomon-hills-mori-tower.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the kits in tokyo-metropolitan-government-building.ts and
 * tokyo-azabudai-hills-mori-jp-tower.ts.
 *
 * Completed 2014 (Nihon Sekkei, Mori Building); 52 floors; 247 m (OSM
 * height 247; Wikipedia "Toranomon Hills": 255.5 m to the top of the roof
 * structure, 247 m roof). Loop Road No. 2 runs through it in a tunnel.
 *
 * OSM: way/390949465 is the whole complex's outline (building=commercial,
 * height 247, levels 52: the tower and its low podium and Oval Plaza deck),
 * and way/390949466 the tower (building:part). Both are replaced: the tower
 * is drawn on the part's outline, and the rest of the outline as a low
 * podium, 11 m, with a planted roof (estimated: the podium's height and its
 * roof garden are read from street photos, not measured). Toranomon Hills
 * Station Tower (2023), across the road to the north-east, is a separate
 * building and is not modelled.
 *
 * The tower (from photos): a rounded parallelogram in plan, 84 x 62 m at the
 * foot (OSM), whose north-west and south-east corners are sharp and the other
 * two rounded. It tapers like a blade: the narrow end faces close in as it
 * rises, the plan's depth falling to 60% at the top (Kakidai 2018 (1) and
 * "Toranomon Hills 2.jpg", seen end-on; estimated from their convergence).
 * The roof is a steep twisted plane: the two sharp corners rise to 247 m
 * and the rounded ones fall to 212 m, about 14% of the height, so from each
 * long side the top slopes from a pointed high end down to a rounded
 * shoulder (Kakidai 2018 (2), "Toranomon Hills.JPG") and from the ends it
 * rises to a point (2018 (1)); seen from Azabudai Hills JP Tower 33F (Syced)
 * the two high corners frame a V. A bright pale rim runs round the roof's
 * edge. Bold pale fold creases run from each sharp corner down across the
 * end faces to the foot, and from the sharp corners' feet across the long
 * faces (2018 (1), "Toranomon Hills.JPG", Suicasmo 2020).
 * Silver-blue glass curtain wall, vertical mullions, floor lines every three
 * floors.
 * Colours (daylight): glass #9aaebd to #b2c2cf, drawn `window-2` #a4b6c4
 * (offices lit at night: named window); rim and lines pale; podium glass
 * `window`, its walls stone, its roof garden muted green.
 * Estimated: the low corners' height (from the photos' proportions, +-5 m),
 * the taper, the folds' paths, the podium.
 *
 * Frame: built turned to bearing 31 (the tower's long sides run to 121).
 * Origin at 139.7491906, 35.6668064, the complex outline's centroid; the
 * tower's centre is about (28, 12) in the model frame. y = 0 is the ground
 * (the map's terrain is flat to 1.5 m under the footprint).
 *
 * Photos (Wikimedia Commons):
 * - "2018 Toranomon Hills 1.jpg", "2018 Toranomon Hills 2.jpg",
 *   "Toranomon Hills.JPG", "Toranomon Hills 2.jpg", Kakidai, CC BY-SA 4.0
 * - "Toranomon Hills 20201112.jpg", Suicasmo, CC BY-SA 4.0
 * - "View from Azabudai Hills Mori JP Tower 33F 15.jpg" and "16.jpg", Syced, CC0
 * - "Japanese Toranomon Hills.jpg", PRiMENON, CC BY-SA 3.0
 * - "Toranomon Hills - from a distance rainy day May 13 2022 01-54pm.jpeg", Nesnad, CC BY 4.0
 * No lidar (Japan). No look-only sources.
 * Doubts: the roof's exact shape (drawn as a straight-line twist between the
 * corner heights: the street photos could also be read as a single plane
 * falling from one sharp corner, but Syced's high view shows both sharp
 * corners high); the podium's height and edges; the green glass atrium
 * at the tower's foot is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { earcut, prism, capPoly, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'
import { type Ring, wall, band, normals, quadN, centroid } from './tokyo-azabudai-hills-mori-jp-tower'

const HI = 247, LO = 212, PODIUM = 11, TAPER = 0.6
// The tower part (way/390949466), bearing-31 frame, counter-clockwise as OSM gives it? (checked below)
const PART: XY[] = [[-12.0, 42.1], [-14.3, 35.2], [-12.5, 23.8], [-8.0, -6.3], [-5.7, -11.1], [-2.3, -14.2], [3.4, -16.0], [19.8, -18.3], [41.0, -19.7], [66.1, -19.5], [69.8, -10.9], [62.3, 32.1], [60.2, 35.7], [56.6, 38.1], [52.7, 39.3], [36.5, 41.5], [19.7, 42.7], [1.5, 42.9]]
// The complex outline (way/390949465), bearing-31 frame.
const SITE: XY[] = [[59.7, 58.4], [3.2, 47.0], [-7.8, 45.2], [-16.5, 43.5], [-44.9, 24.1], [-79.8, 41.5], [-82.5, 40.6], [-82.6, 35.1], [-72.8, 29.8], [-87.5, 0.4], [-87.2, -3.9], [-79.9, -7.9], [-76.5, -28.6], [-72.6, -52.2], [-24.6, -45.0], [-10.0, -36.9], [7.1, -40.3], [26.7, -41.6], [50.0, -40.7], [64.7, -39.2], [80.1, -36.6], [79.1, -7.8], [75.7, 5.7], [68.7, 32.7], [67.1, 32.9]]

const signedArea = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (signedArea(r) < 0 ? [...r].reverse() : r)

type Lod = { detail: boolean; maxSeg: number; vbay: number }
const LOW: Lod = { detail: false, maxSeg: 8, vbay: 10 }
const DETAIL: Lod = { detail: true, maxSeg: 4, vbay: 5 }

function build(L: Lod): Layer[] {
  const glass = new Part(), trim = new Part(), roof = new Part(), stone = new Part(), podGlass = new Part(), garden = new Part()
  // the tower ring: OSM points, long sides split; the two sharp corners (NW, SE) creased
  const base = ccw(PART)
  const sharp = new Set([0, 1, 9, 10]) // NW (-12, 42.1)/(-14.3, 35.2) and SE (66.1, -19.5)/(69.8, -10.9)
  const pts: { p: XY; crease: boolean }[] = []
  const baseIdx = base.map((p) => PART.findIndex((q) => q[0] === p[0] && q[1] === p[1]))
  for (let i = 0; i < base.length; i++) {
    const a = base[i], b = base[(i + 1) % base.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / L.maxSeg))
    for (let k = 0; k < n; k++) pts.push({ p: [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n], crease: k === 0 && (sharp.has(baseIdx[i]) || [3, 6, 11, 14].includes(baseIdx[i])) })
  }
  const P = pts.map((e) => e.p)
  const c = centroid(P)
  // the taper: the narrow (end) faces close in as the tower rises, the plan's depth falling to TAPER at the top
  const S = (z: number) => 1 - (1 - TAPER) * Math.pow(Math.max(0, z) / HI, 1.4)
  const pAt = (p: XY, z: number): XY => [p[0], c[1] + (p[1] - c[1]) * S(z)]
  const ring: Ring = { n: P.length, at: (z) => P.map((p) => pAt(p, z)), crease: (i) => pts[i].crease }
  // the roof: high at the two sharp corners, falling steeply to the rounded ones (a twisted plane)
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1])
  const hx = (Math.max(...xs) - Math.min(...xs)) / 2, hy = (Math.max(...ys) - Math.min(...ys)) / 2
  const twist = (p: XY) => -Math.max(-1, Math.min(1, (p[0] - c[0]) / hx)) * Math.max(-1, Math.min(1, (p[1] - c[1]) / hy))
  const tmax = Math.max(...P.map(twist)), tmin = Math.min(...P.map(twist))
  const saddle = (p: XY) => LO + ((HI - LO) * (twist(p) - tmin)) / (tmax - tmin)
  const top = (i: number) => saddle(P[i])

  // the glass walls
  wall(glass, ring, [0, 40, 80, 120, 160, 200], { top })
  // floor lines every three floors, pale
  const FL = HI / 52
  for (let f = 3; f < 52; f += 3) band(trim, ring, f * FL - 0.3, f * FL + 0.3, 0.07, { top })
  // vertical mullions every vbay along each side, leaning with the taper
  const nAt = (a: XY, b: XY, z: number): XY => { const A = pAt(a, z), B = pAt(b, z), l = Math.hypot(B[0] - A[0], B[1] - A[1]); return [(B[1] - A[1]) / l, -(B[0] - A[0]) / l] }
  for (let i = 0; i < P.length; i++) {
    const j = (i + 1) % P.length, a = P[i], b = P[j], len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(len / L.vbay))
    for (let k = pts[i].crease ? 1 : 0; k < n; k++) {
      const t = k / n, q: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const zt = saddle(q) - 2.2, w = L.detail ? 0.35 : 0.5, d = L.detail ? 0.45 : 0.08
      const Q = (o: number, out: number, z: number): V3 => {
        const A = pAt(a, z), B = pAt(b, z), l = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / l, (B[1] - A[1]) / l], nn = nAt(a, b, z)
        const m: XY = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
        return [m[0] + u[0] * o + nn[0] * out, m[1] + u[1] * o + nn[1] * out, z]
      }
      const lv = [1, 40, 80, 120, 160, 200].filter((z) => z < zt - 1).concat([zt])
      for (let m = 0; m < lv.length - 1; m++) { const z0 = lv[m], z1 = lv[m + 1]
        trim.quad(Q(-w / 2, d, z0), Q(w / 2, d, z0), Q(w / 2, d, z1), Q(-w / 2, d, z1))
        if (L.detail) { trim.quad(Q(w / 2, 0, z0), Q(w / 2, 0, z1), Q(w / 2, d, z1), Q(w / 2, d, z0)); trim.quad(Q(-w / 2, 0, z0), Q(-w / 2, d, z0), Q(-w / 2, d, z1), Q(-w / 2, 0, z1)) }
      }
    }
  }
  // the folds: bold pale creases where the faces' planes meet, running from the sharp corners
  // down across the faces to the foot (Kakidai 2018 (1), "Toranomon Hills.JPG", Suicasmo)
  {
    const NW: XY = [-14.3, 35.2], SW: XY = [-5.7, -11.1], SE: XY = [69.8, -10.9], NE: XY = [62.3, 32.1], NWn: XY = [-12.0, 42.1], SEs: XY = [66.1, -19.5]
    // [face start, face end, path as (t along the face, z)]
    const faces: [XY, XY, [number, number][]][] = [
      [NW, SW, [[0.04, HI - 4], [0.1, 0.62 * HI], [0.3, 0.3 * HI], [0.55, 0]]],   // west end, from the NW corner
      [SE, NE, [[0.04, HI - 4], [0.1, 0.62 * HI], [0.3, 0.3 * HI], [0.55, 0]]],   // east end, from the SE corner
      [NWn, [52.7, 39.3], [[0.02, 0.42 * HI], [0.14, 0.18 * HI], [0.3, 0]]],       // north face, from the NW corner's foot
      [SEs, [3.4, -16.0], [[0.02, 0.42 * HI], [0.14, 0.18 * HI], [0.3, 0]]],       // south face, from the SE corner's foot
    ]
    const w = L.detail ? 0.8 : 1.3, out = L.detail ? 0.7 : 0.6
    for (const [A, B, path] of faces) {
      const pt = (t: number, z: number): { p: V3; n: XY } => {
        const a = pAt(A, z), b = pAt(B, z), n = nAt(A, B, z)
        return { p: [a[0] + (b[0] - a[0]) * t + n[0] * out, a[1] + (b[1] - a[1]) * t + n[1] * out, z], n }
      }
      // subdivide the path so it follows the tapering face
      const dense: [number, number][] = []
      for (let k = 0; k < path.length - 1; k++) for (let m = 0; m < 8; m++) dense.push([path[k][0] + ((path[k + 1][0] - path[k][0]) * m) / 8, path[k][1] + ((path[k + 1][1] - path[k][1]) * m) / 8])
      dense.push(path[path.length - 1])
      for (let k = 0; k < dense.length - 1; k++) {
        const P0 = pt(...dense[k]), P1 = pt(...dense[k + 1])
        const d: V3 = [P1.p[0] - P0.p[0], P1.p[1] - P0.p[1], P1.p[2] - P0.p[2]], n: V3 = [P0.n[0], P0.n[1], 0]
        const sv: V3 = [n[1] * d[2] - n[2] * d[1], n[2] * d[0] - n[0] * d[2], n[0] * d[1] - n[1] * d[0]], sl = Math.hypot(...sv) || 1
        const o: V3 = [(sv[0] / sl) * w, (sv[1] / sl) * w, (sv[2] / sl) * w]
        const add = (p: V3, s: number): V3 => [p[0] + o[0] * s, p[1] + o[1] * s, Math.max(0, p[2] + o[2] * s)]
        quadN(trim, add(P0.p, -1), add(P0.p, 1), add(P1.p, 1), add(P1.p, -1), n, n, n, n)
      }
    }
  }
  // the roof: a pale rim band under the edge, then the sloping roof to the centre
  {
    const rimH = L.detail ? 1.4 : 2.2
    const T = P.map((p, i) => pAt(p, top(i)))
    const N = P.map((_, i) => { const a = T[(i + P.length - 1) % P.length], b = T[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] as XY })
    for (let i = 0; i < P.length; i++) {
      const j = (i + 1) % P.length, ni = N[i], nj = N[j], d = 0.2
      quadN(trim, [T[i][0] + ni[0] * d, T[i][1] + ni[1] * d, top(i) - rimH], [T[j][0] + nj[0] * d, T[j][1] + nj[1] * d, top(j) - rimH], [T[j][0] + nj[0] * d, T[j][1] + nj[1] * d, top(j)], [T[i][0] + ni[0] * d, T[i][1] + ni[1] * d, top(i)], [ni[0], ni[1], 0], [nj[0], nj[1], 0], [nj[0], nj[1], 0], [ni[0], ni[1], 0])
    }
    const k = 0.94, cz = (HI + LO) / 2 - 1
    const ct = pAt(c, cz)
    const inner = T.map((p) => [ct[0] + (p[0] - ct[0]) * k, ct[1] + (p[1] - ct[1]) * k] as XY)
    const iz = (i: number) => cz + (top(i) - 1 - cz) * k
    for (let i = 0; i < P.length; i++) {
      const j = (i + 1) % P.length
      trim.quad([T[i][0], T[i][1], top(i)], [T[j][0], T[j][1], top(j)], [inner[j][0], inner[j][1], iz(j)], [inner[i][0], inner[i][1], iz(i)])
      roof.tri([inner[i][0], inner[i][1], iz(i)], [inner[j][0], inner[j][1], iz(j)], [ct[0], ct[1], cz])
    }
  }
  // the lobby: lit glazing round the tower's foot
  band(podGlass, ring, 0.5, 8, 0.1)

  // the podium and plaza deck: the rest of the complex's outline
  const site = ccw(SITE)
  prism(stone, site, 0, PODIUM, { roof: garden, lip: 1.2 })
  {
    // its glazing: a band along each side, piers at the corners
    for (let i = 0; i < site.length; i++) {
      const a = site[i], b = site[(i + 1) % site.length], len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 6) continue
      const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, nx = uy, ny = -ux
      const Q = (s: number, z: number): V3 => [a[0] + ux * s + nx * 0.06, a[1] + uy * s + ny * 0.06, z]
      podGlass.quad(Q(1.5, 2), Q(len - 1.5, 2), Q(len - 1.5, PODIUM - 2.5), Q(1.5, PODIUM - 2.5))
    }
  }
  void earcut; void capPoly
  return [
    { part: glass, material: windowVariant(2, 0xa4b6c4) },
    { part: trim, material: finish('toranomon-rim', 0xeef0f1) },
    { part: roof, material: PALETTE.roof },
    { part: stone, material: PALETTE.stone },
    { part: podGlass, material: PALETTE.window },
    { part: garden, material: finish('toranomon-garden', 0x9fb294) },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 31, elevation: 0, height: HI }
  await writeModel('tokyo-toranomon-hills-mori-tower', 'tokyo-toranomon-hills-mori-tower.glb', 'Toranomon Hills Mori Tower', build(LOW), meta, 5000, 256_000)
  await writeModel('tokyo-toranomon-hills-mori-tower', 'tokyo-toranomon-hills-mori-tower.detail.glb', 'Toranomon Hills Mori Tower', build(DETAIL), meta, 40_000, 1536 * 1024)
}
