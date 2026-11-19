/**
 * Mariners' Church of Detroit (170 East Jefferson Avenue, 1849, Calvin N.
 * Otis; moved 270 m east in 1955, when the bell tower was added):
 * procedural, CC0-1.0.
 * bun generators/det-mariners-church.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +x runs
 * along bearing 60 (east-north-east, the nave's axis, towards the
 * Detroit-Windsor tunnel plaza), +y along 330 (towards Jefferson Avenue).
 * The rose-window gable faces -x (west-south-west, towards Hart Plaza);
 * the great-window gable faces +x. The anchor is the centroid of the OSM
 * outline way/105530705 (42.3292063, -83.0420410).
 *
 * Identity, in order: a small rough-faced grey limestone Gothic Revival
 * church with a green copper roof; the west gable with its eight-petal rose
 * window over a crenellated entrance porch with a pointed door, flanked by
 * buttress turrets carrying tall green copper spires; the east gable with
 * its great pointed window; buttressed side walls with traceried lancets;
 * the square 1955 bell tower at the north-west corner, its belfry with two
 * louvred lancets a face, string courses and an arched door, joined by a
 * low link.
 *
 * Evidence:
 *  - plan: OSM way/105530705 (Mariner's Church, building=church, stone,
 *    Q6764376): the nave 29.0 × 14.5 m, the tower 4.9 m square, the link.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame. Heights above y = 0, the lowest ground (the south and east
 *    sides, 0.9 m over the box minimum): eaves 12.3, ridge 15.0 along
 *    y = -1.5; tower 22.3; link 7.6. The ground is 2.8-3.7 m higher on the
 *    north (Jefferson) and west (the plaza) sides: the church stands on a
 *    terrace there, with its basement exposed on the east and south.
 *  - published: 1849, Gothic Revival, Calvin N. Otis; moved and the tower
 *    added in 1955 (Wikipedia, "Mariners' Church"; NRHP 71000429).
 *  - photos: openings light by light (rose window, porch and door, blind
 *    lancets, the great east window, side lancets, basement windows,
 *    belfry), the spires (as restored by 2024), the tower's string courses.
 *  Estimated: window sizes and heights, the spires' height (~6 m over the
 *  turrets), the porch, from photos scaled to the lidar heights.
 *
 * Photos (Wikimedia Commons / Flickr, all EVIDENCE):
 *  - Mariners_Church,_Jefferson_Avenue,_Detroit,_MI_Sept._2024_04.jpg,
 *    Warren LeMay, CC0 (west gable and tower)
 *  - Mariners_Church,_Jefferson_Avenue,_Detroit,_MI_Sept._2024_03.jpg,
 *    Warren LeMay, CC0 (east gable)
 *  - Marinerschurch.JPG, HistoryGeek1967, CC BY-SA 3.0 (north side, tower)
 *  - Mariners_Church,_Jefferson_Avenue,_Detroit,_MI_-_53016834217.jpg,
 *    w_lemay, CC0 (west gable square on)
 *  - Old_Mariner_Church,_Detroit.jpg, Mikerussell, CC BY-SA 3.0 (east gable)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south side is not photographed here; it mirrors the north
 * (without its door). The 2023 photos show the west turrets without spires;
 * those of 2024 show the green spires, which are drawn. The anchor emblem
 * on the tower is left out. Elevation 0; the terrace is the map's terrain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, inset, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
function pointed(sc: number, w: number, z0: number, zs: number, segs = 4): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
const pointedTop = (w: number, zs: number, d: number) => zs + Math.sqrt(Math.max(0, w * w - (Math.abs(d) + w / 2) ** 2))
const archR = (sc: number, w: number, z0: number, zs: number, segs = 6): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? r : [...r].reverse())
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

const X0 = -13.7, X1 = 15.3, Y0 = -8.05, Y1 = 6.4, YM = (Y0 + Y1) / 2
const EAVE = 12.0, RIDGE = 15.2, APEX = 15.9
const NORTH_G = 2.8, WEST_G = 3.0 // the ground on the north and west sides, above y = 0

/** A light with tracery: a pointed opening, a pale surround, mullions to n lights, Y forks. */
function lancet(trim: Part, win: Part, f: Face, sc: number, w: number, z0: number, zs: number, n: number, surround = 0.25) {
  if (surround > 0) flatShape(trim, f, pointed(sc, w + 2 * surround, z0 - surround, zs), 0.03)
  flatShape(win, f, pointed(sc, w, z0, zs), 0.06)
  const b = 0.08
  for (let k = 1; k < n; k++) {
    const d = -w / 2 + (w * k) / n
    flatShape(trim, f, R(sc + d - b, z0, sc + d + b, pointedTop(w, zs, d) - 0.15), 0.09)
  }
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), trim = new Part(), door = new Part()

  // ---------------------------------------------------------------- the nave
  const nave = rect(X0, Y0, X1, Y1)
  walls(stone, nave, 0, EAVE)
  // the copper roof, with a little overhang along the sides, between the gable parapets
  const ov = 0.35, sl = (RIDGE - EAVE) / ((Y1 - Y0) / 2)
  roof.quad([X0, Y0 - ov, EAVE - ov * sl], [X1, Y0 - ov, EAVE - ov * sl], [X1, YM, RIDGE], [X0, YM, RIDGE])
  roof.quad([X1, Y1 + ov, EAVE - ov * sl], [X0, Y1 + ov, EAVE - ov * sl], [X0, YM, RIDGE], [X1, YM, RIDGE])
  // gable walls standing a little proud of the roof, with crenellated coping up both slopes
  for (const [x, out] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const xi = x - out * 0.6 // the parapet's thickness
    const P = (y: number, z: number, xx: number): V3 => [xx, y, z]
    const tri = [P(Y0, EAVE, x), P(Y1, EAVE, x), P(YM, APEX, x)]
    if (out > 0) stone.tri(tri[0], tri[1], tri[2]); else stone.tri(tri[1], tri[0], tri[2])
    const triI = [P(Y0, EAVE, xi), P(Y1, EAVE, xi), P(YM, APEX, xi)]
    if (out > 0) stone.tri(triI[1], triI[0], triI[2]); else stone.tri(triI[0], triI[1], triI[2])
    // the coping's top faces
    for (const [ya, yb] of [[Y0, YM], [YM, Y1]]) {
      const za = ya === YM ? APEX : EAVE, zb = yb === YM ? APEX : EAVE
      const q: V3[] = [P(ya, za, x), P(yb, zb, x), P(yb, zb, xi), P(ya, za, xi)]
      qf(stone, q[0], q[1], q[2], q[3], [0, 0, 1])
      // merlons along the slope, on the west gable only
      if (out < 0) for (let k = 1; k < 5; k++) {
        const t = k / 5, y = ya + (yb - ya) * t, z = za + (zb - za) * t
        const r = ccw(rect(Math.min(x, xi), y - 0.3, Math.max(x, xi), y + 0.3))
        walls(stone, r, z - 0.2, z + 0.55); cap(stone, r, z + 0.55)
      }
    }
    // the cross on the apex
    const cx = (x + xi) / 2
    box(stone, stone, cx - 0.12, YM - 0.12, cx + 0.12, YM + 0.12, APEX, APEX + 1.6)
    box(stone, stone, cx - 0.12, YM - 0.5, cx + 0.12, YM + 0.5, APEX + 1.0, APEX + 1.25)
  }
  // corner turrets: square buttress shafts, octagonal tops, green copper spires with finials
  for (const x of [X0 + 0.55, X1 - 0.55]) for (const y of [Y0 + 0.55, Y1 - 0.55]) {
    box(stone, null, x - 0.85, y - 0.85, x + 0.85, y + 0.85, 0, EAVE + 0.4)
    const oc = circle(x, y, 0.62, 8, Math.PI / 8)
    walls(stone, oc, EAVE + 0.4, EAVE + 1.6)
    cap(stone, rect(x - 0.85, y - 0.85, x + 0.85, y + 0.85), EAVE + 0.4)
    lathe(roof, x, y, [[0.55, EAVE + 1.6], [0.55, EAVE + 3.6], [0.66, EAVE + 3.7], [0.38, EAVE + 5.6], [0.1, EAVE + 7.2], [0.01, EAVE + 7.6]], 8, 22.5)
    lathe(trim, x, y, [[0.18, EAVE + 7.0], [0.2, EAVE + 7.4], [0.01, EAVE + 8.0]], 6)
  }
  // side buttresses between the bays, with sloped tops
  const BAYS = 5, bw = (X1 - X0) / BAYS
  for (let k = 1; k < BAYS; k++) {
    const x = X0 + k * bw
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
      const yo = y + s * 0.65
      const r = ccw(rect(x - 0.45, Math.min(y, yo), x + 0.45, Math.max(y, yo)))
      walls(stone, r, 0, 8.4)
      // the sloped weathering back to the wall
      const a: V3 = [x - 0.45, yo, 8.4], b: V3 = [x + 0.45, yo, 8.4], c: V3 = [x + 0.45, y, 9.6], d: V3 = [x - 0.45, y, 9.6]
      qf(stone, a, b, c, d, [0, s, 1])
      tf(stone, [x - 0.45, y, 8.4], a, d, [-1, 0, 0])
      tf(stone, [x + 0.45, y, 8.4], b, c, [1, 0, 0])
    }
  }
  // side lancets, one a bay, two lights; the north door in the middle bay; basement windows on the south
  const north: Face = { o: [0, Y1, 0], n: [0, 1] } // s = -x
  const south: Face = { o: [0, Y0, 0], n: [0, -1] } // s = x
  for (let k = 0; k < BAYS; k++) {
    const x = X0 + (k + 0.5) * bw
    lancet(trim, win, north, -x, 1.7, NORTH_G + 2.6, 8.9, 2)
    lancet(trim, win, south, x, 1.7, NORTH_G + 2.6, 8.9, 2)
    flatShape(win, south, archR(x, 0.9, 0.7, 2.0, 4), 0.06)
  }
  {
    const x = X0 + 2.5 * bw
    flatShape(trim, north, pointed(-x, 1.8, NORTH_G, NORTH_G + 2.3), 0.04)
    flatShape(door, north, R(-x - 0.7, NORTH_G, -x + 0.7, NORTH_G + 2.3), 0.07)
  }

  // ---------------------------------------------------------------- the west gable
  {
    const wf: Face = { o: [X0, 0, 0], n: [-1, 0] } // s = -y, so s = -YM is the gable's centre
    const c = -YM
    // the rose window: a round light in a pale ring, eight spokes
    const rz = 9.6, rr = 1.75
    flatShape(trim, wf, arc(c, rz, rr + 0.35, 0, 360, 16).slice(0, 16), 0.03)
    flatShape(win, wf, arc(c, rz, rr, 0, 360, 16).slice(0, 16), 0.06)
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 4, dx = Math.cos(a), dz = Math.sin(a), b = 0.08
      flatShape(trim, wf, [[c - dx * rr - dz * b, rz - dz * rr + dx * b], [c + dx * rr - dz * b, rz + dz * rr + dx * b], [c + dx * rr + dz * b, rz + dz * rr - dx * b], [c - dx * rr + dz * b, rz - dz * rr - dx * b]], 0.09)
    }
    flatShape(trim, wf, arc(c, rz, 0.45, 0, 360, 8).slice(0, 8), 0.1)
    // blind lancets either side, in pale stone
    for (const d of [-4.0, 4.0]) { extrudeShape(stone, wf, pointed(c + d, 1.9, WEST_G + 3.4, 9.4), 0, 0.12); extrudeShape(stone, wf, pointed(c + d, 1.3, WEST_G + 3.7, 9.4), 0.12, 0.05, false) }
    // pilaster strips framing the middle
    for (const d of [-2.6, 2.6]) extrudeShape(stone, wf, R(c + d - 0.3, WEST_G, c + d + 0.3, EAVE + 0.8), 0, 0.3)
    // the entrance porch: a shallow crenellated block, a pointed door in a pale surround
    const px0 = X0 - 1.2
    box(stone, stone, px0, YM - 2.0, X0, YM + 2.0, 0, WEST_G + 4.4)
    for (const y of [YM - 1.7, YM - 0.6, YM + 0.6, YM + 1.7]) box(stone, stone, px0, y - 0.3, px0 + 0.6, y + 0.3, WEST_G + 4.4, WEST_G + 5.0)
    const pf: Face = { o: [px0, 0, 0], n: [-1, 0] }
    flatShape(trim, pf, pointed(c, 2.1, WEST_G, WEST_G + 2.4), 0.04)
    flatShape(door, pf, R(c - 0.75, WEST_G, c + 0.75, WEST_G + 2.4), 0.07)
    flatShape(door, pf, pointed(c, 1.5, WEST_G + 2.4, WEST_G + 2.4).slice(1), 0.07)
  }

  // ---------------------------------------------------------------- the east gable
  {
    const ef: Face = { o: [X1, 0, 0], n: [1, 0] } // s = y
    const c = YM
    lancet(trim, win, ef, c, 3.8, 4.4, 9.9, 3, 0.35)
    flatShape(trim, ef, R(c - 1.9, 7.4, c + 1.9, 7.6), 0.09)
    for (const d of [-4.3, 4.3]) lancet(trim, win, ef, c + d, 1.2, 4.4, 9.0, 1)
    for (const d of [-5.2, -3.1, -1.0, 1.1, 3.2]) flatShape(win, ef, archR(c + d, 1.3, 0.6, 2.0, 5), 0.06)
    flatShape(door, ef, archR(c + 5.2, 1.2, 0.1, 2.0, 5), 0.06)
  }

  // ---------------------------------------------------------------- the bell tower and its link
  {
    const TX0 = -13.0, TX1 = -8.1, TY0 = 10.2, TY1 = 14.8, TOP = 22.3
    const t = rect(TX0, TY0, TX1, TY1)
    walls(stone, t, 0, TOP - 0.5)
    const lip = inset(t, -0.15)
    walls(stone, lip, TOP - 0.5, TOP); cap(stone, lip, TOP); cap(stone, lip, TOP - 0.5, false)
    for (const z of [NORTH_G + 7.8, NORTH_G + 12.7]) walls(stone, inset(t, -0.12), z - 0.25, z + 0.1)
    // belfry: two louvred lancets a face; the door on the north face
    const faces: Face[] = [{ o: [TX0, TY1, 0], n: [-1, 0] }, { o: [TX1, TY0, 0], n: [1, 0] }, { o: [TX0, TY0, 0], n: [0, -1] }, { o: [TX1, TY1, 0], n: [0, 1] }]
    for (const f of faces) for (const d of [1.45, 3.45]) {
      flatShape(trim, f, pointed(d, 1.05, 15.9, 19.0, 3), 0.03)
      flatShape(win, f, pointed(d, 0.75, 16.1, 19.0, 3), 0.06)
      for (let k = 0; k < 4; k++) flatShape(trim, f, R(d - 0.38, 16.5 + k * 0.6, d + 0.38, 16.62 + k * 0.6), 0.09) // louvres
    }
    const nf = faces[3]
    flatShape(trim, nf, archR(2.45, 2.0, NORTH_G, NORTH_G + 2.3, 6), 0.04)
    flatShape(door, nf, archR(2.45, 1.5, NORTH_G, NORTH_G + 2.3, 6), 0.07)
    for (const d of [1.95, 2.95]) flatShape(win, faces[1], R(d - 0.22, 10.0, d + 0.22, 11.6), 0.06)
    // the link to the nave, with two small lancets
    box(stone, roof, -12.0, Y1, -10.1, TY0, 0, 7.6)
    const lf: Face = { o: [-10.1, Y1, 0], n: [1, 0] }
    for (const d of [0.9, 2.6]) flatShape(win, lf, pointed(d, 0.5, NORTH_G + 1.0, NORTH_G + 2.8, 2), 0.06)
  }

  return [
    { part: stone, material: finish('mariners-stone', 0xdcd4c2) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.patina },
    { part: trim, material: PALETTE.trim },
    { part: door, material: finish('mariners-oak', 0x8a6247) },
  ]
}

if (import.meta.main) await save('det-mariners-church', "Mariners' Church", [42.3292063, -83.042041], 330, build(), 5000)
