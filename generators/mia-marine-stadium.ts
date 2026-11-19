/**
 * Miami Marine Stadium, Virginia Key (1963, Hilario Candela of Pancoast,
 * Ferendino, Grafton, Skeels & Burnham; engineer Jack Meyer) — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-marine-stadium.ts
 *
 * The grandstand only: the regatta basin in front of it is the map's water
 * and is not modelled.
 *
 * Map frame: x east, y north, z up, metres. The model is built turned: its
 * +x runs along the grandstand to the south-east (134.5°) and its +y faces
 * the basin (44.5°), so the catalog bearing is 44.5. Anchor = centroid of
 * the OSM outline way/477122363 (25.7428855, -80.1698905).
 *
 * y = 0 is the water level of the basin, the lowest ground the map's
 * terrain (Mapterhorn) has under the footprint: its hydro-flattened DEM
 * reads the front half of the stands as water, the land behind as 2.0 m.
 * Heights below are lidar heights above the lidar's water (ground_min)
 * plus 0.25 m, the gap between the two waters.
 *
 * Identity, in order: the folded-plate roof cantilevered toward the water,
 * its eight V-folds rising to a spine and flattening to a straight front
 * fascia, so the basin side reads as a row of arches; the long raked stand
 * of blue seats under it running down to the seawall; the eight columns
 * under the spine; the row of diagonal struts (Λ pairs) on the land side
 * meeting the roof's zig-zag back edge; graffiti everywhere at ground level.
 *
 * Evidence:
 *  - plan: OSM way/477122363 (building, height 20.1): 98.8 x 31.4 m, long
 *    axis 134.5°. The neighbouring way/828515641 (a 104 x 14 m strip behind)
 *    is at ground level in lidar (the paved concourse) and is not covered.
 *  - lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown 2019), 1 m
 *    grid, read in the model frame (measured):
 *    - roof from x = -49.2 to +49.2 (ends square), front edge y = +16,
 *      back edge y = -15.7, as OSM;
 *    - nine fold ridges at x = -49.2 + 12.3k (both ends are ridges), eight
 *      troughs between them over the columns (12.3 m bays);
 *    - top surface (model z): front edge 16.8 flat; just ahead of the spine
 *      (y = -2.5) ridges 19.95, troughs 16.05; the fold dies out by
 *      y = -12; at the back edge the phase flips (ridges 15.85, troughs
 *      18.25), the zig-zag back edge of the photos;
 *    - a flat-topped spine beam 2 m wide at y = -4.5, top 20.35 (lidar 20.1
 *      over its whole length);
 *    - front rows outside the roof: 3.75 at y = 16, 2.4 at y = 20, the
 *      seawall walk 1.6 at y = 22; land behind 2.0.
 *  - from photos (scaled from the lidar heights): the back facade's two
 *    concrete bands (8.6–10.4, 12.7–14.8) with dark voids between and the
 *    graffiti-covered ground floor under them; the Λ struts, one pair under
 *    each interior ridge with their feet ~4 m either side, a single strut at
 *    each end; the columns' lean and flared heads; roof thickness ~0.5 m,
 *    the front fascia ~1.3 m, the back edge
 *    ~1 m, its zig-zag deepened to the photo (troughs 19.0, ridges 15.7;
 *    lidar's 1 m cells read 18.25 / 15.85).
 *  - estimated: the seating rake under the roof (0.30 rise per metre, from
 *    the front rows' lidar, to ~12 m at the top row, which agrees with the
 *    photographed upper band), aisle and cross-aisle positions, strut and
 *    column sections (0.9 m, 1.1 x 1.8 m).
 *  - published (Wikipedia, "Miami Marine Stadium"): opened 1963, Hilario
 *    Candela, folded-plate concrete roof; closed since 1992. Lengths and
 *    heights here are from lidar, not published figures.
 *  - colour: weathered pale concrete; seats a faded mid blue (o2, NAIP); the
 *    graffiti as two broad colours (magenta and teal) on the ground-floor
 *    walls and the struts' feet, the commonest colours in the photos.
 *
 * Photos:
 *  - "Miami Marine Stadium.jpg", Wilfredor, CC0 (Wikimedia Commons; land
 *    side from the south-west: struts, bands, back edge) p2
 *  - "Virginia Key - Miami Marine Stadium - .jpg", Bumbiti, CC BY-SA 4.0
 *    (Wikimedia Commons; south-east end: roof cantilever, struts) p1
 *  - "Miami Marine Stadium", miamism, CC BY 2.0
 *    https://www.flickr.com/photos/23245739@N02/14385588409 (from the basin:
 *    fascia, arches, columns, seats) o2
 *  - "Miami Marine Stadium", miamism, CC BY 2.0
 *    https://www.flickr.com/photos/23245739@N02/10280025636 (in the stands:
 *    columns, spine beam, seating) o5
 *  - "Miami Marine, 1967.jpg", State Library and Archives of Florida,
 *    public domain (stands toward the basin)
 *  - USGS NAIP orthophoto (public domain): the eight folds from above.
 * Look-only: none.
 *
 * Doubts: whether the main columns lean (o5 is a wide-angle view); how the
 * end struts meet the ground (the NW end shows no outer leg in lidar, the
 * SE one is hidden in trees, so both ends get a single strut); the seating
 * profile under the roof is inferred. The small stair block at the south-
 * east end is left out. Night: the stadium is closed and unlit, so there is
 * no lit material.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { save } from './chi-aon-center'

// ------------------------------------------------------------- helpers ---
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const avg = (ps: V3[]): V3 => mul(ps.reduce(add, [0, 0, 0] as V3), 1 / ps.length)

/** A flat convex polygon, wound so its normal points along `out`. */
export function poly(p: Part, pts: V3[], out: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = cross(sub(b, a), sub(c, a))
    if (dot(n, out) >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** A convex solid from 8 corners: bottom ring 0-3, top ring 4-7, same order. */
export function hexa(p: Part, c: V3[]) {
  const m = avg(c)
  const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
  for (const f of faces) {
    const pts = f.map((i) => c[i])
    poly(p, pts, sub(avg(pts), m))
  }
}

/** An axis-aligned box. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  hexa(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])
}

/** A square-section strut from a to b, w across (horizontal) and d deep. */
export function strut(p: Part, a: V3, b: V3, w: number, d = w) {
  const ax = norm(sub(b, a))
  let u = cross(ax, [0, 0, 1])
  if (Math.hypot(...u) < 1e-6) u = [1, 0, 0]
  u = norm(u)
  const v = norm(cross(u, ax))
  const ring = (c: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => add(c, add(mul(u, (s * w) / 2), mul(v, (t * d) / 2))))
  hexa(p, [...ring(a), ...ring(b)])
}

/** A leaning post from foot a to head b with horizontal end faces. */
export function post(p: Part, a: V3, b: V3, w: number, d = w) {
  const h: V3 = [b[0] - a[0], b[1] - a[1], 0]
  const v: V3 = Math.hypot(h[0], h[1]) < 1e-6 ? [0, 1, 0] : norm(h)
  const u: V3 = [v[1], -v[0], 0]
  const ring = (c: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => add(c, add(mul(u, (s * w) / 2), mul(v, (t * d) / 2))))
  hexa(p, [...ring(a), ...ring(b)])
}

// ------------------------------------------------------------ the model ---
const BAY = 12.3
const XR = Array.from({ length: 9 }, (_, k) => -49.2 + BAY * k) // ridges
const XV = Array.from({ length: 8 }, (_, k) => -43.05 + BAY * k) // troughs / columns
const LAND = 2.0
const Y_FRONT = 16, Y_BACK = -15.7

/** Roof top: [y, base, amplitude], ridge = base + amp, trough = base - amp. */
const ROOF: [number, number, number][] = [
  [Y_BACK, 17.35, -1.65], [-14, 17.2, -0.9], [-12, 17.25, 0], [-10, 17.45, 0.4], [-8, 17.75, 1.1],
  [-6, 18.1, 1.65], [-4.5, 18.1, 1.85], [-2.5, 18.0, 1.95], [0, 17.95, 1.6], [4, 17.35, 1.2],
  [8, 17.15, 0.9], [12, 17.0, 0.4], [Y_FRONT, 16.8, 0],
]
/** The fold: +1 on a ridge, -1 over a column; flat plates, so a sharp V. */
const fold = (x: number) => {
  const t = (((x - XR[0]) / BAY) % 1 + 1) % 1
  return 1 - 4 * Math.min(t, 1 - t)
}
const roofTop = (x: number, k: number) => ROOF[k][1] + ROOF[k][2] * fold(x)
/** Shell thickness: thin plate, thickening into the front fascia. */
const thick = (y: number) => (y >= 14 ? 1.3 : y >= 12 ? 0.5 + 0.8 * ((y - 12) / 2) : y <= -14 ? 1.0 : 0.5)

/** Seating tread height at y (the rake), from the front rows' lidar. */
const seatZ = (y: number) => 1.8 + 0.3 * (20 - y)
const Y_SEAT_FRONT = 21.2, Y_SEAT_BACK = -13
const X_SEAT = 48.2

function build() {
  const concrete = new Part() // weathered pale concrete
  const shade = new Part() // undersides and voids
  const seats = new Part() // faded blue seats
  const pink = new Part() // graffiti, magenta
  const teal = new Part() // graffiti, teal

  // --- roof shell ---
  const xs: number[] = []
  const SEG = 1 // per half bay: flat plates
  for (let i = 0; i <= 8 * 2 * SEG; i++) xs.push(XR[0] + (i * BAY) / (2 * SEG))
  const top = ROOF.map((r, k) => xs.map((x): V3 => [x, r[0], roofTop(x, k)]))
  const bot = top.map((row) => row.map(([x, y, z]): V3 => [x, y, z - thick(y)]))
  for (let k = 0; k < ROOF.length - 1; k++)
    for (let i = 0; i < xs.length - 1; i++) {
      poly(concrete, [top[k][i], top[k][i + 1], top[k + 1][i + 1]], [0, 0, 1])
      poly(concrete, [top[k][i], top[k + 1][i + 1], top[k + 1][i]], [0, 0, 1])
      poly(shade, [bot[k][i], bot[k][i + 1], bot[k + 1][i + 1]], [0, 0, -1])
      poly(shade, [bot[k][i], bot[k + 1][i + 1], bot[k + 1][i]], [0, 0, -1])
    }
  const K = ROOF.length - 1, N = xs.length - 1
  for (let i = 0; i < N; i++) {
    poly(concrete, [top[K][i], top[K][i + 1], bot[K][i + 1], bot[K][i]], [0, 1, 0]) // front fascia
    poly(concrete, [top[0][i], top[0][i + 1], bot[0][i + 1], bot[0][i]], [0, -1, 0]) // back edge
  }
  for (let k = 0; k < K; k++) {
    poly(concrete, [top[k][0], top[k + 1][0], bot[k + 1][0], bot[k][0]], [-1, 0, 0])
    poly(concrete, [top[k][N], top[k + 1][N], bot[k + 1][N], bot[k][N]], [1, 0, 0])
  }

  // --- spine beam on the column heads ---
  box(concrete, XR[0] + 0.3, XR[8] - 0.3, -5.5, -3.5, 15.0, 20.35)

  // --- eight columns, leaning toward the water, flared under the beam ---
  for (const x of XV) {
    const foot: V3 = [x, -8.2, LAND], head: V3 = [x, -4.5, 13.6]
    post(concrete, foot, head, 1.1, 1.8)
    hexa(concrete, [
      [x - 0.55, -5.4, 13.4], [x + 0.55, -5.4, 13.4], [x + 0.55, -3.6, 13.4], [x - 0.55, -3.6, 13.4],
      [x - 2.0, -5.5, 15.05], [x + 2.0, -5.5, 15.05], [x + 2.0, -3.5, 15.05], [x - 2.0, -3.5, 15.05],
    ])
  }

  // --- the stand: an extruded section, seats on the rake ---
  const zb = seatZ(Y_SEAT_BACK)
  // seat surface, split at the aisles (concrete) and a cross aisle
  const aisles = [-X_SEAT, ...XV, X_SEAT]
  const AW = 0.8 // half width of an aisle
  const CROSS: [number, number] = [5.0, 7.0] // cross aisle (y)
  const bands: [number, number, Part][] = [
    [Y_SEAT_BACK, CROSS[0], seats], [CROSS[0], CROSS[1], concrete], [CROSS[1], Y_SEAT_FRONT, seats],
  ]
  for (const [ya, yb, part] of bands) {
    const segs: [number, number][] = part === concrete ? [[-X_SEAT, X_SEAT]]
      : aisles.slice(0, -1).map((x, a) => [a === 0 ? x : x + AW, a === aisles.length - 2 ? aisles[a + 1] : aisles[a + 1] - AW])
    for (const [x0, x1] of segs) {
      // split along y so long faces follow the ground
      const steps = Math.max(1, Math.ceil((yb - ya) / 6))
      for (let s = 0; s < steps; s++) {
        const y0 = ya + ((yb - ya) * s) / steps, y1 = ya + ((yb - ya) * (s + 1)) / steps
        poly(part, [[x0, y0, seatZ(y0)], [x1, y0, seatZ(y0)], [x1, y1, seatZ(y1)], [x0, y1, seatZ(y1)]], [0, 0.3, 1])
      }
    }
    for (let a = 1; a < aisles.length - 1; a++) {
      const x0 = aisles[a] - AW, x1 = aisles[a] + AW
      if (part === concrete) continue
      const steps = Math.max(1, Math.ceil((yb - ya) / 6))
      for (let s = 0; s < steps; s++) {
        const y0 = ya + ((yb - ya) * s) / steps, y1 = ya + ((yb - ya) * (s + 1)) / steps
        poly(concrete, [[x0, y0, seatZ(y0) + 0.05], [x1, y0, seatZ(y0) + 0.05], [x1, y1, seatZ(y1) + 0.05], [x0, y1, seatZ(y1) + 0.05]], [0, 0.3, 1])
      }
    }
  }
  // seawall face (front, down to the water)
  for (let x = -X_SEAT; x < X_SEAT - 0.01; x += 12.05) {
    const x1 = Math.min(X_SEAT, x + 12.05)
    poly(concrete, [[x, Y_SEAT_FRONT, 0], [x1, Y_SEAT_FRONT, 0], [x1, Y_SEAT_FRONT, seatZ(Y_SEAT_FRONT)], [x, Y_SEAT_FRONT, seatZ(Y_SEAT_FRONT)]], [0, 1, 0])
  }
  // end walls of the stand: a concrete raking girder over a dark open bay
  for (const sx of [-1, 1]) {
    const x = sx * X_SEAT
    const ys = [Y_SEAT_FRONT, 14, 8, 2, -4, -10, Y_SEAT_BACK]
    for (let i = 0; i < ys.length - 1; i++) {
      const y0 = ys[i], y1 = ys[i + 1]
      const g0 = Math.max(0, seatZ(y0) - 1.3), g1 = Math.max(0, seatZ(y1) - 1.3)
      poly(concrete, [[x, y0, g0], [x, y1, g1], [x, y1, seatZ(y1) + 0.9], [x, y0, seatZ(y0) + 0.9]], [sx, 0, 0])
      const w0 = Math.min(g0, 4.6), w1 = Math.min(g1, 4.6)
      poly(i % 2 ? pink : teal, [[x, y0, 0], [x, y1, 0], [x, y1, w1], [x, y0, w0]], [sx, 0, 0])
      if (g0 > 4.6 || g1 > 4.6) poly(shade, [[x, y0, w0], [x, y1, w1], [x, y1, g1], [x, y0, g0]], [sx, 0, 0])
    }
    // railing parapet top of the girder
    const ysR = [Y_SEAT_FRONT, 8, -4, Y_SEAT_BACK]
    for (let i = 0; i < ysR.length - 1; i++) {
      const y0 = ysR[i], y1 = ysR[i + 1]
      poly(concrete, [[x, y0, seatZ(y0) + 0.9], [x, y1, seatZ(y1) + 0.9], [x - sx * 0.4, y1, seatZ(y1) + 0.9], [x - sx * 0.4, y0, seatZ(y0) + 0.9]], [0, 0, 1])
      poly(concrete, [[x - sx * 0.4, y0, seatZ(y0)], [x - sx * 0.4, y1, seatZ(y1)], [x - sx * 0.4, y1, seatZ(y1) + 0.9], [x - sx * 0.4, y0, seatZ(y0) + 0.9]], [-sx, 0, 0])
    }
  }

  // --- the land-side facade, bay by bay ---
  const YB = Y_SEAT_BACK
  for (let b = 0; b < 8; b++) {
    const x0 = b === 0 ? -X_SEAT : XR[b], x1 = b === 7 ? X_SEAT : XR[b + 1]
    const g = b % 2 ? pink : teal
    // ground floor rooms, graffiti-covered, set back
    poly(g, [[x0, YB + 1.2, 0], [x1, YB + 1.2, 0], [x1, YB + 1.2, 4.6], [x0, YB + 1.2, 4.6]], [0, -1, 0])
    // dark open floors up to the top band
    poly(shade, [[x0, YB + 1.2, 4.6], [x1, YB + 1.2, 4.6], [x1, YB + 1.2, zb], [x0, YB + 1.2, zb]], [0, -1, 0])
  }
  // two concrete bands across the whole length (the lower on brackets)
  box(concrete, -X_SEAT, X_SEAT, YB - 1.4, YB + 1.2, 8.6, 10.4)
  box(concrete, -X_SEAT, X_SEAT, YB - 1.0, YB + 1.2, 12.7, 14.8)
  // seat back between band and rake top
  poly(concrete, [[-X_SEAT, YB, zb], [X_SEAT, YB, zb], [X_SEAT, YB, 12.7], [-X_SEAT, YB, 12.7]], [0, 1, 0])

  // --- Λ struts on the land side, under the roof's back edge ---
  const yTop = Y_BACK + 0.5, yFoot = Y_BACK - 0.6
  const zApex = (x: number) => roofTop(x, 0) - thick(Y_BACK) - 0.1
  const leg = (top: V3, foot: V3) => {
    const t = 2.6 / (top[2] - foot[2])
    const mid: V3 = [foot[0] + (top[0] - foot[0]) * t, foot[1] + (top[1] - foot[1]) * t, foot[2] + (top[2] - foot[2]) * t]
    post(Math.abs(foot[0]) % 7 < 3.5 ? pink : teal, foot, mid, 1.3)
    post(concrete, mid, top, 1.3)
  }
  for (let k = 1; k < 8; k++) {
    const x = XR[k], top: V3 = [x, yTop, zApex(x)]
    leg([x - 0.35, top[1], top[2]], [x - 5.6, yFoot, 0])
    leg([x + 0.35, top[1], top[2]], [x + 5.6, yFoot, 0])
  }
  for (const sx of [-1, 1]) {
    const x = sx * 48.6
    leg([x, yTop, zApex(XR[sx < 0 ? 0 : 8])], [sx * 47.4, yFoot, 0])
  }

  return [
    { part: concrete, material: finish('mms-concrete', 0xd9d5cc) },
    { part: shade, material: finish('mms-shade', 0x7b7a76) },
    { part: seats, material: finish('mms-seats', 0x5f82b4) },
    { part: pink, material: finish('mms-graffiti-pink', 0xb87596) },
    { part: teal, material: finish('mms-graffiti-teal', 0x6a9c9a) },
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) {
  await save('mia-marine-stadium', 'Miami Marine Stadium', [25.7428855, -80.1698905], 44.5, build(), 5000)
}
