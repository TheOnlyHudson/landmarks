/**
 * Fort Street Presbyterian Church (631 West Fort Street, Detroit, 1855,
 * Octavius and Albert Jordan; rebuilt after fires in 1876 and 1914):
 * procedural, CC0-1.0.
 * bun generators/det-fort-street-presbyterian.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +y runs
 * along bearing 330 (north-north-west, towards Fort Street; the front is
 * the +y face), +x along 60 (east-north-east, the church house side). The anchor is the centroid of the nave's OSM part
 * way/71187639 (42.32752, -83.05384).
 *
 * Identity, in order: the tall square west tower on Fort Street with angle
 * buttresses, a great pointed window over its door, a louvred belfry and
 * tall corner pinnacles, under the slender green copper spire with its
 * lucarnes; the steep crenellated front gable with its great traceried
 * window over the central portal and a pinnacled turret on its apex; the
 * octagonal corner turret at the east end of the front; the steep slate
 * roof over buttressed side walls with pinnacles; the lower Gothic church
 * house to the east.
 *
 * Evidence:
 *  - plan: OSM relation/11197198 (Fort Street Presbyterian Church,
 *    height=81, Q5472134), outer ways 71187639 (nave, building:part
 *    height 40, gabled), 559288134 (tower, building:part height 81,
 *    pyramidal) and 71187629 (the church house to the east).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; it sits about 1.5 m east and 0.7 m south of OSM and is
 *    shifted to it. Heights above y = 0, the lowest ground (the back of the
 *    lot; Fort Street is 2.0 m higher): nave eaves 14.8, ridge 27.5 on the
 *    nave's axis; tower body 32.5, its pinnacles 37-38.5, the spire's
 *    highest return 67.0 (tip drawn at 68 with its finial); front-gable
 *    turret 31.8; east corner turret 27; church house 14.8 (11.8 next to
 *    the nave).
 *    The OSM height 81 is not borne out by the lidar: a masonry and copper
 *    spire 14 m higher would show. Drawn to the lidar.
 *  - published: 1855, Gothic Revival, Octavius and Albert Jordan
 *    (Wikipedia, "Fort Street Presbyterian Church"; NRHP 71000430).
 *  - photos: the front light by light, the tower's stages and pinnacles,
 *    the spire's lucarnes, the side buttresses and windows, the roof's
 *    slate grey, the buff stone and green copper.
 *  Estimated: window sizes, stage heights and turret sizes, from the photos
 *  scaled to the lidar.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fort_Street_Presbyterian_Church_Detroit.jpg, Adam Bishop, CC BY-SA 4.0
 *    (the front from Fort Street)
 *  - FortStreetPresbyterianChurch.jpg, Andrew Jameson, CC BY-SA 3.0 (from
 *    the north-west: tower, west side)
 *  - Fort_Street_Presbyterian_Church_1.jpg, Amaury Laporte, CC BY 2.0 (the
 *    west side, roof and tower)
 *  - FortStreetPresbyterianDetroit.jpg, Detroit Publishing Co., public
 *    domain (historic, from the north-west)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the church house (east) is seen only at its Fort Street end;
 * its other sides are drawn plain with a few windows. The back (south)
 * gable is unphotographed. The tower's copper railing, crockets and the
 * openwork parapets are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
function pointed(sc: number, w: number, z0: number, zs: number, segs = 4): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
const pointedTop = (w: number, zs: number, d: number) => zs + Math.sqrt(Math.max(0, w * w - (Math.abs(d) + w / 2) ** 2))
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1); walls(p, r, z0, z1); if (top) cap(top, r, z1)
}
/** A pinnacle: a square shaft and a four-sided spirelet. */
function pinnacle(p: Part, x: number, y: number, z0: number, z1: number, r = 0.4) {
  const zs = z0 + (z1 - z0) * 0.45
  box(p, p, x - r, y - r, x + r, y + r, z0, zs)
  const q = rect(x - r * 1.1, y - r * 1.1, x + r * 1.1, y + r * 1.1)
  for (let i = 0; i < 4; i++) p.tri([q[i][0], q[i][1], zs], [q[(i + 1) % 4][0], q[(i + 1) % 4][1], zs], [x, y, z1])
}
/** A traceried pointed window in a pale surround. */
function lancet(trim: Part, win: Part, f: Face, sc: number, w: number, z0: number, zs: number, n: number, transoms: number[] = [], surround = 0.25) {
  if (surround > 0) flatShape(trim, f, pointed(sc, w + 2 * surround, z0 - surround, zs), 0.03)
  flatShape(win, f, pointed(sc, w, z0, zs), 0.06)
  for (let k = 1; k < n; k++) {
    const d = -w / 2 + (w * k) / n
    flatShape(trim, f, R(sc + d - 0.09, z0, sc + d + 0.09, pointedTop(w, zs, d) - 0.15), 0.09)
  }
  for (const z of transoms) flatShape(trim, f, R(sc - w / 2, z - 0.1, sc + w / 2, z + 0.1), 0.09)
}

const NX0 = -11.1, NX1 = 10.5, NY0 = -17.6, NY1 = 18.6, NXC = (NX0 + NX1) / 2
const EAVE = 14.8, RIDGE = 27.5
const STREET = 2.0 // Fort Street above y = 0
const TX0 = -13.1, TX1 = -5.1, TY0 = 13.9, TY1 = 22.2, TXC = (TX0 + TX1) / 2, TYC = (TY0 + TY1) / 2
const TTOP = 32.5, TIP = 68.0

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), green = new Part(), trim = new Part(), door = new Part()

  // ---------------------------------------------------------------- the nave and its steep slate roof
  walls(stone, rect(NX0, NY0, NX1, NY1), 0, EAVE)
  const ov = 0.4, sl = (RIDGE - EAVE) / ((NX1 - NX0) / 2)
  roof.quad([NX0 - ov, NY1, EAVE - ov * sl], [NX0 - ov, NY0, EAVE - ov * sl], [NXC, NY0, RIDGE], [NXC, NY1, RIDGE])
  roof.quad([NX1 + ov, NY0, EAVE - ov * sl], [NX1 + ov, NY1, EAVE - ov * sl], [NXC, NY1, RIDGE], [NXC, NY0, RIDGE])
  // the gables: the back plain, the front standing proud with a crenellated coping
  tf(stone, [NX0, NY0, EAVE], [NX1, NY0, EAVE], [NXC, NY0, RIDGE], [0, -1, 0])
  {
    const y0 = NY1, y1 = NY1 - 0.7, A = RIDGE + 0.6
    tf(stone, [NX0, y0, EAVE], [NX1, y0, EAVE], [NXC, y0, A], [0, 1, 0])
    tf(stone, [NX0, y1, EAVE], [NX1, y1, EAVE], [NXC, y1, A], [0, -1, 0])
    for (const [xa, xb] of [[NX0, NXC], [NXC, NX1]]) {
      const za = xa === NXC ? A : EAVE, zb = xb === NXC ? A : EAVE
      qf(stone, [xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za], [0, 0, 1])
      for (let k = 1; k < 7; k++) {
        const t = k / 7, x = xa + (xb - xa) * t, z = za + (zb - za) * t
        box(stone, stone, x - 0.35, y1, x + 0.35, y0, z - 0.3, z + 0.7)
      }
    }
  }
  // side buttresses with pinnacles over the eaves, six bays; west lancets (the east side is against the church house)
  const BAYS = 6, bw = (NY1 - NY0) / BAYS
  const west: Face = { o: [NX0, 0, 0], n: [-1, 0] } // s = -y
  for (let k = 0; k <= BAYS; k++) {
    const y = NY0 + k * bw
    if (k > 0 && k < BAYS) {
      box(stone, stone, NX0 - 0.8, y - 0.45, NX0, y + 0.45, 0, EAVE - 1)
      pinnacle(stone, NX0 - 0.2, y, EAVE - 1, EAVE + 3.8, 0.42)
      pinnacle(stone, NX1 + 0.2, y, EAVE - 1, EAVE + 3.8, 0.42)
    }
    if (k < BAYS) lancet(trim, win, west, -(y + bw / 2), 2.2, 3.2, 11.0, 2, [7.2], 0.25)
  }
  pinnacle(stone, NX1 - 0.3, NY0 + 0.3, EAVE - 0.5, EAVE + 4.2, 0.5)
  pinnacle(stone, NX0 + 0.3, NY0 + 0.3, EAVE - 0.5, EAVE + 4.2, 0.5)
  // the back gable's window
  lancet(trim, win, { o: [0, NY0, 0], n: [0, -1] }, NXC, 3.6, 6, 15, 3)

  // ---------------------------------------------------------------- the front
  const front: Face = { o: [0, NY1, 0], n: [0, 1] } // s = -x
  {
    const c = -0.05 // the great window sits between the tower (x -5.1) and the east pier (x 5.2)
    lancet(trim, win, front, c, 4.8, STREET + 6.5, 17.6, 4, [STREET + 13.6], 0.4)
    // the portal under it and its gablet
    flatShape(trim, front, pointed(c, 3.2, STREET, STREET + 3.4), 0.04)
    flatShape(door, front, R(c - 1.1, STREET, c + 1.1, STREET + 3.4), 0.08)
    flatShape(win, front, pointed(c, 2.2, STREET + 3.5, STREET + 3.5).slice(1), 0.08)
    extrudeShape(stone, front, [[c - 2.0, STREET + 5.2], [c + 2.0, STREET + 5.2], [c, STREET + 7.6]], 0, 0.3)
    // blind niches either side
    for (const d of [-3.6, 3.6]) extrudeShape(trim, front, pointed(c + d, 1.0, STREET + 6.8, STREET + 13.0, 3), 0, 0.05)
    // the side door at the east end
    flatShape(trim, front, pointed(-8.3, 2.0, STREET, STREET + 2.8), 0.04)
    flatShape(door, front, R(-9.0, STREET, -7.6, STREET + 2.8), 0.08)
    lancet(trim, win, front, -8.3, 1.2, STREET + 6, STREET + 11.5, 1)
  }
  // the octagonal pier east of the great window, rising to a pinnacle
  {
    const x = 5.2, y = NY1 + 0.5, oc = circle(x, y, 0.85, 8, Math.PI / 8)
    walls(stone, oc, 0, 24.5); cap(stone, oc, 24.5)
    lathe(stone, x, y, [[0.75, 24.5], [0.75, 25.5], [0.01, 28.5]], 8)
  }
  // the east corner turret: octagonal, with lancets, a pinnacled top and a spirelet
  {
    const x = NX1, y = NY1, oc = circle(x, y, 1.7, 8, Math.PI / 8)
    walls(stone, oc, 0, 22.5)
    const lip = circle(x, y, 1.95, 8, Math.PI / 8)
    walls(stone, lip, 22.5, 23.2); cap(stone, lip, 23.2); cap(stone, lip, 22.5, false)
    lathe(stone, x, y, [[1.2, 23.2], [1.2, 24.5], [0.05, 28.5]], 8, 22.5)
    for (let k = 0; k < 8; k += 2) {
      const a = Math.PI / 8 + (k * Math.PI) / 4 + Math.PI / 8
      pinnacle(stone, x + 1.6 * Math.cos(a), y + 1.6 * Math.sin(a), 23.2, 26.0, 0.22)
    }
    for (const a of [Math.PI / 2, Math.PI / 4, 0]) {
      const f: Face = { o: [x + 1.6 * Math.cos(a), y + 1.6 * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] }
      flatShape(win, f, pointed(0, 0.55, 16.5, 20.8, 2), 0.06)
      flatShape(win, f, pointed(0, 0.55, 9.5, 13.0, 2), 0.06)
    }
  }
  // the turret on the gable's apex, with two lancets and corner pinnacles
  {
    const x0 = NXC - 2.0, x1 = NXC + 2.0, y0 = NY1 - 4.0, y1 = NY1 - 0.1
    box(stone, roof, x0, y0, x1, y1, 22.0, 30.6)
    for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]] as XY[]) pinnacle(stone, x, y, 29.8, 33.0, 0.32)
    const f: Face = { o: [0, y1, 0], n: [0, 1] }
    for (const d of [-0.9, 0.9]) flatShape(win, f, pointed(-NXC + d, 0.9, 25.2, 28.6, 2), 0.06)
  }

  // ---------------------------------------------------------------- the tower and spire
  {
    box(stone, null, TX0, TY0, TX1, TY1, 0, TTOP - 0.8)
    const lip = rect(TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3)
    walls(stone, lip, TTOP - 0.8, TTOP); cap(stone, lip, TTOP); cap(stone, lip, TTOP - 0.8, false)
    for (const z of [STREET + 4.5, 23.5]) walls(stone, rect(TX0 - 0.15, TY0 - 0.15, TX1 + 0.15, TY1 + 0.15), z - 0.3, z + 0.1)
    // angle buttresses at the corners, stepping in, ending in tall pinnacles
    for (const [x, y, sx, sy] of [[TX0, TY0, -1, -1], [TX1, TY0, 1, -1], [TX1, TY1, 1, 1], [TX0, TY1, -1, 1]]) {
      for (const [ax, ay] of [[sx, 0], [0, sy]]) {
        const cx = x + ax * 0.5 - (ax ? 0 : sx * 0.7), cy = y + ay * 0.5 - (ay ? 0 : sy * 0.7)
        const hx = ax ? 0.5 : 0.55, hy = ay ? 0.5 : 0.55
        box(stone, stone, cx - hx, cy - hy, cx + hx, cy + hy, 0, 18)
        box(stone, stone, cx - hx * 0.7, cy - hy * 0.7, cx + hx * 0.7, cy + hy * 0.7, 18, TTOP - 0.8)
      }
      pinnacle(stone, x, y, TTOP - 0.8, 38.6, 0.6)
    }
    // faces: north (street) with the door and the great window, the belfry on all four
    const faces: Face[] = [{ o: [TX1, TY1, 0], n: [0, 1] }, { o: [TX0, TY1, 0], n: [-1, 0] }, { o: [TX0, TY0, 0], n: [0, -1] }, { o: [TX1, TY0, 0], n: [1, 0] }]
    const L = TX1 - TX0
    for (const f of faces) for (const d of [L / 2 - 1.3, L / 2 + 1.3]) {
      flatShape(trim, f, pointed(d, 1.5, 24.6, 29.4, 3), 0.03)
      flatShape(win, f, pointed(d, 1.1, 24.8, 29.4, 3), 0.06)
      for (let k = 0; k < 5; k++) flatShape(trim, f, R(d - 0.55, 25.3 + k * 0.75, d + 0.55, 25.45 + k * 0.75), 0.09)
    }
    const n = faces[0]
    lancet(trim, win, n, L / 2, 3.0, STREET + 6.0, 19.5, 3, [STREET + 11.5], 0.35)
    flatShape(trim, n, pointed(L / 2, 2.8, STREET, STREET + 3.4), 0.04)
    flatShape(door, n, R(L / 2 - 1.0, STREET, L / 2 + 1.0, STREET + 3.4), 0.08)
    for (const f of [faces[1], faces[3]]) lancet(trim, win, f, L / 2 + (f === faces[1] ? -0.0 : 0), 1.6, 9, 19.5, 2)
    // the spire: octagonal, from inside the parapet to the tip, with four lucarnes at its foot
    const S0 = TTOP, rb = 2.3
    const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + (i * Math.PI) / 4; return [TXC + r * Math.cos(a), TYC + r * Math.sin(a), z] as V3 })
    const levels: [number, number][] = [[rb, S0], [rb * 0.93, S0 + 2.5], [0.3, TIP - 1.4]]
    for (let k = 0; k < levels.length - 1; k++) {
      const a = ring(levels[k][0], levels[k][1]), b = ring(levels[k + 1][0], levels[k + 1][1])
      for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; green.quad(a[i], a[j], b[j], b[i]) }
    }
    {
      const g = rect(TX0 + 0.5, TY0 + 0.5, TX1 - 0.5, TY1 - 0.5)
      walls(green, g, TTOP, TTOP + 1.1); walls(green, [...g].reverse(), TTOP, TTOP + 1.1)
    }
    const top = ring(0.3, TIP - 1.4)
    for (let i = 0; i < 8; i++) green.tri(top[i], top[(i + 1) % 8], [TXC, TYC, TIP - 0.6])
    lathe(trim, TXC, TYC, [[0.12, TIP - 0.7], [0.12, TIP]], 6)
    for (const a of [Math.PI / 2, Math.PI, -Math.PI / 2, 0]) {
      const cx = TXC + 1.85 * Math.cos(a), cy = TYC + 1.85 * Math.sin(a), ux = -Math.sin(a), uy = Math.cos(a)
      const P = (u: number, d: number, z: number): V3 => [cx + ux * u + Math.cos(a) * d, cy + uy * u + Math.sin(a) * d, z]
      const zb = S0 + 2.0, ze = S0 + 4.6, za = S0 + 6.6
      qf(green, P(-0.75, 0.4, zb), P(0.75, 0.4, zb), P(0.75, 0.4, ze), P(-0.75, 0.4, ze), [Math.cos(a), Math.sin(a), 0])
      tf(green, P(-0.75, 0.4, ze), P(0.75, 0.4, ze), P(0, 0.4, za), [Math.cos(a), Math.sin(a), 0])
      for (const sg of [-1, 1]) qf(green, P(sg * 0.75, 0.4, zb), P(sg * 0.75, -0.8, zb), P(sg * 0.75, -0.8, ze), P(sg * 0.75, 0.4, ze), [ux * sg, uy * sg, 0])
      flatShape(win, { o: P(0, 0.42, 0), n: [Math.cos(a), Math.sin(a)] }, pointed(0, 0.7, zb + 0.4, ze - 0.2, 2), 0.02)
      qf(green, P(-0.9, 0.5, ze - 0.2), P(0, 0.5, za + 0.2), P(0, -0.9, za + 0.2), P(-0.9, -0.9, ze - 0.2), [0, 0, 1])
      qf(green, P(0, 0.5, za + 0.2), P(0.9, 0.5, ze - 0.2), P(0.9, -0.9, ze - 0.2), P(0, -0.9, za + 0.2), [0, 0, 1])
    }
  }

  // ---------------------------------------------------------------- the church house to the east
  {
    box(stone, roof, 14.1, NY0, 30.6, 18.5, 0, 14.8)
    box(stone, roof, 18.5, 18.5, 30.6, 23.0, 0, 15.0)
    box(stone, roof, NX1, NY0, 14.1, -8.7, 0, 11.8)
    box(stone, roof, NX1, 7.1, 18.5, 18.6, 0, 11.8)
    // parapet coping and a few merlons along the Fort Street fronts
    for (const [x0, x1, y, z] of [[18.5, 30.6, 23.0, 15.0], [NX1 + 1.8, 18.5, 18.6, 11.8]] as [number, number, number, number][]) {
      walls(stone, rect(x0 - 0.1, y - 0.5, x1 + 0.1, y + 0.1), z - 0.4, z + 0.3); cap(stone, rect(x0 - 0.1, y - 0.5, x1 + 0.1, y + 0.1), z + 0.3)
      for (let x = x0 + 0.8; x < x1 - 0.4; x += 1.7) box(stone, stone, x - 0.4, y - 0.5, x + 0.4, y + 0.1, z + 0.3, z + 1.0)
    }
    const hf: Face = { o: [0, 23.0, 0], n: [0, 1] } // s = -x
    for (const x of [21, 24.5, 28]) {
      lancet(trim, win, hf, -x, 1.5, STREET + 6.5, 12.0, 2)
      flatShape(win, hf, R(-x - 0.7, STREET + 1.2, -x + 0.7, STREET + 4.2), 0.06)
    }
    const lf: Face = { o: [0, 18.6, 0], n: [0, 1] }
    flatShape(trim, lf, pointed(-15.2, 2.2, STREET, STREET + 3.0), 0.04)
    flatShape(door, lf, R(-16.0, STREET, -14.4, STREET + 3.0), 0.08)
    lancet(trim, win, lf, -15.2, 1.6, STREET + 4.8, 9.0, 2)
    const ef: Face = { o: [30.6, 0, 0], n: [1, 0] } // s = y
    for (let k = 0; k < 6; k++) {
      const y = NY0 + 3 + k * 6.2
      flatShape(win, ef, pointed(y, 1.4, 8.0, 12.0, 2), 0.06)
      flatShape(win, ef, R(y - 0.7, 2.5, y + 0.7, 5.6), 0.06)
    }
  }

  return [
    { part: stone, material: finish('fort-street-stone', 0xe2d4bd) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('fort-street-slate', 0x8e9a98) },
    { part: green, material: PALETTE.patina },
    { part: trim, material: PALETTE.trim },
    { part: door, material: finish('fort-street-door', 0x7d5a44) },
  ]
}

if (import.meta.main) await save('det-fort-street-presbyterian', 'Fort Street Presbyterian Church', [42.32752, -83.05384], 330, build(), 6500)
