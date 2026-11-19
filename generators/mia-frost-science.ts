/**
 * Phillip and Patricia Frost Museum of Science (2017, Grimshaw Architects),
 * Museum Park, 1101 Biscayne Boulevard, Miami — original procedural
 * geometry, CC0-1.0.
 * bun generators/mia-frost-science.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/1381279642 (the museum's
 * ground-storey part), 25.7852827, -80.1880413. Bearing 335.2 (the walls
 * run 65.2° / 335.2°, as at the Pérez museum next door), so the model is
 * square to its own frame: +x runs ENE toward PAMM, +y NNW toward I-395.
 *
 * Identity: the white planetarium sphere at the north-west corner; the
 * white wings with their scatter of square windows; the aquarium drum (the
 * "Living Core"), a white bowl-shaped wall under a thin overhanging roof on
 * slim posts, with an oval oculus crowned by a row of white tensile sails;
 * the raised plaza between the museum and PAMM, with the covered bridge
 * north to the Metromover.
 *
 * Sources:
 *  - OSM: planetarium way/484587349 (dome part, a 26 m circle); wings
 *    way/484587351 (18 m, 5 levels); drum way/551736013 (18 m, 5 levels);
 *    atrium way/1381279640 (5 levels); ground storey way/1381279642; the
 *    complex outline way/1381279639 (building, layer 1: the Frost, the
 *    raised plaza and PAMM — listed here only; mia-perez-art-museum lists
 *    PAMM's own ways and the car park way/484587328); covered bridge
 *    way/1381279641 (building=roof). Plans from OSM, checked on lidar.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid in this frame, above the street (ground_min + 1.5 m):
 *    wing roofs 24.3–26 (measured: OSM's 18 m is low), north-wing rooftop
 *    block to 29.5, west-wing rooftop box to 33 (measured), drum roof
 *    canopy 24.3 and its sails 27–29.5 (measured), sphere top 21.6
 *    (measured: the sphere is 26 m across, OSM, so its centre stands at
 *    8.5 m and its foot is below the plaza), plaza deck 4.0 (measured),
 *    bridge roof 8.9 (measured).
 *  - Estimated from the photos: the drum wall's top at 17 m and its flare
 *    (2 m wider at the top), the canopy overhang (2.5 m), post spacing,
 *    the oculus (an ellipse 30 × 17 m), five sails, the window scatter.
 *  - Colours: all white (wing tiles, drum, canopy, sails, sphere); the
 *    planetarium reads a touch greyer; glass slate.
 *
 * Photos:
 *  - Frost Science Museum (Flickr 39168495632), Phillip Pessar, CC BY 2.0,
 *    via Openverse — from Museum Park to the south-east: drum and canopy;
 *  - Phillip And Patricia Frost Museum Of Science Miami (Flickr
 *    27184894249), Phillip Pessar, CC BY 2.0 — the wing's square windows
 *    beside the drum, from the south;
 *  - Frost Science Museum Construction (Flickr 32775954083), Phillip
 *    Pessar, CC BY 2.0 — the south front from the park: west wing, drum,
 *    sails;
 *  - Phillip And Patricia Frost Museum Of Science Miami (Flickr
 *    25090680858) and Frost Science Museum Construction (Flickr
 *    29295046574), Phillip Pessar, CC BY 2.0 — the curved tiled north
 *    block under its thin roof;
 *  - Frost_Science_museum_viewed_from_the_MacArthur_Causeway.jpg,
 *    Beanjamin, CC BY-SA 4.0 (Commons) — the sphere from the south-west.
 *  The Knight Foundation image on Commons (CC BY-SA 2.0) is an architect's
 *  rendering, looked at for the sphere's placement only.
 * No commercial imagery or 3D tiles. No look-only sources.
 *
 * Doubts: no licensed photo shows the north (I-395) side squarely; it is
 * drawn plain white with grouped glazing. The square-window scatter is
 * drawn as a fixed pseudo-random pattern with bigger, fewer windows than
 * the real ones. The plaza's ramps and stairs down to the park are left
 * out (the deck is a plain slab with walls).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, walls, capRing, face, build, box, panels, ringEdges, edgeRect } from './mia-panorama-tower'

const white = new Part(), sphere = new Part(), win = new Part(), deck = new Part(), roof = new Part(), sails = new Part()

const WING_TOP = 24.6, DRUM_WALL = 17, CAN = 24.3, PLAZA = 4.0

// ---------------- plans (OSM, this frame) ----------------
const WINGS: XY[] = [[3.8, 34.9], [62.0, 35.2], [62.1, 17.0], [62.1, 9.6], [58.1, 9.7], [1.5, 10.7], [-2.0, 10.3], [-3.9, 9.9], [-3.8, 8.8], [-6.6, 7.1], [-9.3, 5.2], [-12.1, 2.9], [-14.4, 1.1], [-15.3, -0.1], [-16.7, 1.5], [-19.1, -2.4], [-20.9, -6.5], [-21.4, -7.6], [-33.9, -36.2], [-54.9, -23.2], [-42.9, 4.5], [-34.9, 4.5], [-23.0, 4.6], [-18.7, 5.0], [-15.3, 5.5], [-12.2, 7.0], [-9.4, 8.9], [-7.1, 11.4], [-5.3, 14.3]]
const DRUM: XY[] = [[63.4, 2.7], [1.9, 2.0], [-3.2, 1.3], [-8.2, -1.6], [-11.2, -5.1], [-13.8, -10.8], [-20.7, -26.5], [-20.9, -31.2], [-20.0, -35.3], [-17.4, -38.8], [-13.2, -41.2], [-11.3, -41.8], [11.7, -42.1], [17.3, -40.5], [20.4, -38.8], [59.4, -15.5], [62.8, -12.7], [65.5, -8.0], [67.9, -2.5], [68.1, -0.4], [67.2, 1.3], [65.9, 2.3]]
const ATRIUM: XY[] = [[58.1, 9.7], [58.2, 2.6], [1.9, 2.0], [-3.2, 1.3], [-8.2, -1.6], [-11.2, -5.1], [-13.8, -10.8], [-21.4, -7.6], [-19.1, -2.4], [-15.3, -0.1], [-12.1, 2.9], [-6.6, 7.1], [-3.9, 9.9], [1.5, 10.7]]
const PLAZA_RING: XY[] = [[62, -38], [83.3, -39.9], [103.5, -42.2], [119.8, -41.4], [128.9, -40.5], [139.0, -39.4], [139.3, 18.2], [92.7, 18.2], [83.6, 18.0], [83.5, 35.0], [62, 35.2]]
const SPH: [number, number, number] = [-20.7, 21.5, 13.1] // centre x, y and radius (OSM circle)

// ---------------- the raised plaza and the bridge to the Metromover ----------------
{
  const r = ccw(PLAZA_RING)
  walls(r, [[0, PLAZA, deck]])
  capRing(deck, r, PLAZA)
  // covered bridge (way/1381279641): roof on posts
  box(white, 86.3, 27, 5.8, 36, 8.3, 8.9)
  for (const y of [12, 22, 32, 42]) for (const x of [84, 88.6]) box(white, x, y, 0.5, 0.5, y < 35 ? PLAZA : 0, 8.3, 0, false)
}

// ---------------- wings and atrium ----------------
{
  const w = ccw(WINGS)
  walls(w, [[0, WING_TOP, white]])
  capRing(roof, w, WING_TOP)
  const a = ccw(ATRIUM)
  walls(a, [[0, 5, win], [5, WING_TOP - 0.6, white]])
  capRing(roof, a, WING_TOP - 0.6)
  panels(win, a, 8, WING_TOP - 3, { bay: 9, pier: 1.6, rowH: 7.5, spandrel: 1.8, minEdge: 20 })
  // ground-storey glazing on the long wing fronts
  panels(win, w, 0.4, 4.6, { bay: 8, pier: 1.2, rowH: 4.2, spandrel: 0.3, minEdge: 20 })
  // rooftop blocks (lidar): north wing 29.5, west wing box 33
  box(white, 18, 20, 20, 8, WING_TOP, 29.5)
  box(white, -36, -18, 9, 9, WING_TOP, 33, -23.6 + 90 - 90)
  // the scatter of square windows on the white tiles (fixed pseudo-random)
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (const e of ringEdges(w)) {
    if (e.L < 18) continue
    const cols = Math.floor(e.L / 4.2), rows = 5
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (rnd() > 0.36) continue
      const s = 1.2 + i * 4.2 + rnd() * 0.8, z = 6.5 + j * 3.6 + rnd() * 0.6
      if (s + 2.6 > e.L - 1) continue
      edgeRect(win, e, s, s + 2.6, z, z + 2.6, 0.06)
    }
  }
}

// ---------------- the aquarium drum: bowl wall, posts, canopy, oculus, sails ----------------
{
  const d = ccw(DRUM)
  // centroid for the radial build
  let cx = 0, cy = 0; d.forEach(([x, y]) => { cx += x; cy += y }); cx /= d.length; cy /= d.length
  const shrink = (r: XY[], k: number): XY[] => r.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as XY)
  const base = shrink(d, 0.95)
  // the bowl: lofted from the narrower foot to the full plan at the wall top
  const lv = [0, 6, 12, DRUM_WALL]
  const rings = lv.map((z) => shrink(d, 0.95 + 0.05 * (z / DRUM_WALL) ** 1.5).map(([x, y]) => [x, y, z] as V3))
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1]
    for (let i = 0; i < A.length; i++) {
      const j = (i + 1) % A.length
      const n: V3 = [A[j][1] - A[i][1], -(A[j][0] - A[i][0]), 0]; const l = Math.hypot(n[0], n[1]); n[0] /= l; n[1] /= l
      face(white, [A[i], A[j], B[j], B[i]], n)
    }
  }
  void base
  capRing(roof, d, DRUM_WALL)
  // a recessed glazed band at the foot (the park-side lobby)
  walls(shrink(d, 0.952), [[0.3, 3.4, win]])
  // the canopy: a thin slab overhanging the drum, with an oval oculus
  const O = { x: 8, y: -20, a: 15, b: 8.5 } // oculus, long axis along the drum's diagonal
  const ang = Math.atan2(-42 + 2, 20 + 20) // tilt of the oculus (along the drum's SW-NE body)
  const N = 40
  const outerAt = (t: number): XY => {
    // ray from the oculus centre to the drum's plan offset 2.5 m
    const dx = Math.cos(t), dy = Math.sin(t)
    let best = 0
    const r = d
    for (let i = 0; i < r.length; i++) {
      const p = r[i], q = r[(i + 1) % r.length]
      const ex = q[0] - p[0], ey = q[1] - p[1]
      const den = dx * ey - dy * ex
      if (Math.abs(den) < 1e-9) continue
      const u = ((p[0] - O.x) * ey - (p[1] - O.y) * ex) / den
      const v = ((p[0] - O.x) * dy - (p[1] - O.y) * dx) / den
      if (u > 0 && v >= 0 && v <= 1) best = Math.max(best, u)
    }
    return [O.x + dx * (best + 2.5), O.y + dy * (best + 2.5)]
  }
  const innerAt = (t: number): XY => {
    // ellipse in its own turned frame, intersected with the same ray
    const c = Math.cos(-ang), s = Math.sin(-ang)
    const dx = Math.cos(t) * c - Math.sin(t) * s, dy = Math.cos(t) * s + Math.sin(t) * c
    const r = 1 / Math.sqrt((dx * dx) / (O.a * O.a) + (dy * dy) / (O.b * O.b))
    return [O.x + Math.cos(t) * r, O.y + Math.sin(t) * r]
  }
  const ts = Array.from({ length: N }, (_, k) => (2 * Math.PI * k) / N)
  const outer = ts.map(outerAt), inner = ts.map(innerAt)
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    const o0 = outer[k], o1 = outer[j], i0 = inner[k], i1 = inner[j]
    face(white, [[i0[0], i0[1], CAN], [o0[0], o0[1], CAN], [o1[0], o1[1], CAN], [i1[0], i1[1], CAN]], [0, 0, 1])
    face(white, [[i0[0], i0[1], CAN - 0.8], [i1[0], i1[1], CAN - 0.8], [o1[0], o1[1], CAN - 0.8], [o0[0], o0[1], CAN - 0.8]], [0, 0, -1])
    // edge fascia, outside and round the oculus
    const no: V3 = [o1[1] - o0[1], -(o1[0] - o0[0]), 0]; const lo = Math.hypot(no[0], no[1]) || 1; no[0] /= lo; no[1] /= lo
    face(white, [[o0[0], o0[1], CAN - 0.8], [o1[0], o1[1], CAN - 0.8], [o1[0], o1[1], CAN], [o0[0], o0[1], CAN]], no)
    face(white, [[i1[0], i1[1], CAN - 0.8], [i0[0], i0[1], CAN - 0.8], [i0[0], i0[1], CAN], [i1[0], i1[1], CAN]], [-no[0], -no[1], 0])
  }
  // posts round the rim, between the wall top and the canopy
  for (let k = 0; k < N; k += 2) {
    const [x, y] = outer[k]
    const px = O.x + (x - O.x) * 0.93, py = O.y + (y - O.y) * 0.93
    box(white, px, py, 0.7, 0.7, DRUM_WALL, CAN - 0.8, 0, false)
  }
  // the tensile sails: a row of white peaks along the oculus
  const ca = Math.cos(ang), sa = Math.sin(ang)
  for (let k = -2; k <= 2; k++) {
    const u = k * 6, px = O.x + u * ca, py = O.y + u * sa, top: V3 = [px, py, 30.5]
    const corners: XY[] = [[-3, -6], [3, -6], [3, 6], [-3, 6]].map(([a, b]) => [px + a * ca - b * sa, py + a * sa + b * ca] as XY)
    for (let i = 0; i < 4; i++) {
      const p = corners[i], q = corners[(i + 1) % 4]
      const A: V3 = [p[0], p[1], CAN - 0.4], B: V3 = [q[0], q[1], CAN - 0.4]
      const n = (() => { const e1 = [B[0] - A[0], B[1] - A[1], 0], e2 = [top[0] - A[0], top[1] - A[1], top[2] - A[2]]; const c: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]; const l = Math.hypot(...c); return c.map((v) => v / l) as V3 })()
      face(sails, [A, B, top], n)
    }
  }
}

// ---------------- the planetarium sphere ----------------
{
  const [sx, sy, R] = SPH, zc = 21.6 - R, NU = 16, NV = 12
  const pt = (i: number, j: number): V3 => {
    const th = (2 * Math.PI * i) / NU, ph = -Math.PI / 2 + (Math.PI * j) / NV
    return [sx + R * Math.cos(ph) * Math.cos(th), sy + R * Math.cos(ph) * Math.sin(th), zc + R * Math.sin(ph)]
  }
  const nrm = (p: V3): V3 => [(p[0] - sx) / R, (p[1] - sy) / R, (p[2] - zc) / R]
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    if (Math.max(a[2], b[2], c[2], d[2]) < 0) continue
    const cl = (p: V3): V3 => [p[0], p[1], Math.max(0, p[2])]
    const A = cl(a), B = cl(b), C = cl(c), D = cl(d)
    if (j > 0) sphere.tri(A, B, C, undefined, undefined, undefined, [nrm(a), nrm(b), nrm(c)])
    if (j < NV - 1) sphere.tri(A, C, D, undefined, undefined, undefined, [nrm(a), nrm(c), nrm(d)])
  }
}

if (import.meta.main) {
  await build('Frost Museum of Science', 'mia-frost-science', [
    { part: white, material: finish('frost-white', 0xf1efea) },
    { part: sphere, material: finish('frost-sphere', 0xe4e6e8) },
    { part: win, material: PALETTE.window },
    { part: deck, material: finish('frost-plaza', 0xd8d3c9) },
    { part: roof, material: PALETTE.roof },
    { part: sails, material: { ...finish("frost-sails", 0xfbfaf6), doubleSided: true } },
  ], {
    bearing: 335.2, elevation: 0, height: 33,
    replaces: ['way/1381279639', 'way/1381279642', 'way/484587349', 'way/484587351', 'way/551736013', 'way/1381279640', 'way/1381279641'],
  }, process.argv[2], 6500)
}
