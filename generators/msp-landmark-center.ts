/**
 * Landmark Center (former Federal Courts Building, 1892-1902), Saint Paul —
 * original procedural geometry, CC0-1.0.
 * bun generators/msp-landmark-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned by the placement bearing
 * 359.5 deg. Origin on the building's north-south centre line (lidar), at
 * -93.097117, 44.94561, on the ground (the site is flat to 0.5 m).
 *
 * Form: Richardsonian Romanesque in pink-grey granite. A 38 x 40 m south
 * block whose south and side fronts are recessed between corner pavilions
 * behind one-storey arcades; a 31 m middle and a 26 m north range; steep
 * red-tile hips with flat tops, steep pyramids on the front pavilions, stone
 * dormer gables, fourteen round turrets with mint-green copper cones, a
 * slender clock tower centred on the south (Rice Park) front, a square north
 * tower with an open belfry arcade and a tall tiled pyramid, and the glazed
 * roof of the five-storey cortile.
 *
 * Sources
 * - OSM: outline way/43386059 (no height tags). It sits about 1-2 m west of
 *   the lidar footprint and turns ~1 deg more; the model follows the lidar.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_5_B22, flown ~2022, read
 *   with class 18 kept): plan of every block (south block x +-19, recesses
 *   3 m, middle +-15.3, north +-12.9, north wall y 39.5); eaves 24-25 m;
 *   hip tops ~30.5 m; cortile glass ~33-34 m; pavilion peaks ~34-36 m; clock
 *   tower 6.5 x 7 m, shaft and turrets 44-46 m, spire ~54 m (thin top under-
 *   sampled; finial added to 56); north tower 15.5 m square, walls 48 m,
 *   pinnacles 50-52 m, pyramid apex 66-68 m.
 * - USGS NAIP (public domain): the red hips round pale flat tops and the
 *   cortile skylight; flat-top colour.
 * - Published: 1892-1902, Willoughby J. Edbrooke, US Federal Courts Building
 *   (Wikipedia "Landmark Center"; NRHP 1969).
 * - Photos (Wikimedia Commons, all evidence):
 *   Michael Barera, "Saint Paul April 2025 14 (Landmark Center).jpg", CC BY-SA 4.0
 *     (south front from Rice Park): the symmetric front, tower stages, gables.
 *     https://commons.wikimedia.org/wiki/File:Saint_Paul_April_2025_14_(Landmark_Center).jpg
 *   McGhiever, "Landmark Center SE.jpg" and "Landmark Center SW.jpg", CC BY-SA 4.0:
 *     turrets, pyramids, east and west faces, colours, chimneys.
 *     https://commons.wikimedia.org/wiki/File:Landmark_Center_SE.jpg
 *     https://commons.wikimedia.org/wiki/File:Landmark_Center_SW.jpg
 *   "Landmark Center.jpg", public domain (from the south-west).
 *     https://commons.wikimedia.org/wiki/File:Landmark_Center.jpg
 *   w_lemay, "Landmark Center from St. Paul Hotel, Saint Paul, MN.jpg", CC BY-SA 2.0
 *     (looking north): the north tower's four-arch belfry and pyramid.
 *     https://commons.wikimedia.org/wiki/File:Landmark_Center_from_St._Paul_Hotel,_Saint_Paul,_MN.jpg
 *
 * Estimated from photos: storey heights and window rows (round-headed ground
 * and fourth-floor lights), turret radii (1.95-2.2 m) and cone tips, gable
 * sizes, chimney positions, clock size (r 1.45 m, bolder than real ~1.2 m).
 * Colours from the daylight photos pulled to the palette's lightness.
 *
 * Night: windows glow; the clock faces are `neon-clock`. No licensed night
 * photo was found, so no floodlight is set.
 *
 * Doubts: the north end's facade and the low east annex (not in the outline)
 * are not well photographed; the upper roof slopes look green copper in the
 * hotel photo but pale in NAIP, drawn pale; turret count and positions on the
 * long faces simplified to the plan's corners.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, capRing, wallEdge, outward, finishGlb } from './sea-rainier-square-tower'

const EAVE = 24.5, TOP = 30.5, RUN = 5.5, OVER = 0.45

const circle = (c: XY, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => { const a = a0 + (2 * Math.PI * i) / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })

/** Walls of a ring (ccw) from z0 to z1. */
function walls(part: Part, ring: XY[], z0: number, z1: number, smooth = 35) {
  for (let i = 0; i < ring.length; i++) wallEdge(part, ring, i, z0, z1, smooth)
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** An outset band round a ring (string course, cornice), with its top and underside. */
function band(part: Part, ring: XY[], out: number, z0: number, z1: number) {
  const o = ring.map((p, i) => {
    const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
    const n1 = outward(a, p), n2 = outward(p, b), m: XY = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(m[0], m[1])
    const k = out / Math.max(0.5, (m[0] / l) * n1[0] + (m[1] / l) * n1[1])
    return [p[0] + (m[0] / l) * k, p[1] + (m[1] / l) * k] as XY
  })
  walls(part, o, z0, z1, 10)
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    part.quad([ring[j][0], ring[j][1], z0], [ring[i][0], ring[i][1], z0], [o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0])
    part.quad([o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1])
  }
}

/** A box: walls and top. */
function box(wall: Part, top: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1)
  walls(wall, r, z0, z1)
  capRing(top, r, z1)
}

/**
 * A hipped roof over a rectangle: slopes rise `run` inward to `zTop`, then a
 * flat top (or a ridge / apex where the rectangle is narrower). Eaves
 * overhang the walls by OVER with a soffit underneath.
 */
function hip(tile: Part, flat: Part | null, soffit: Part, x0: number, y0: number, x1: number, y1: number, zE: number, zTop: number, run: number) {
  const ox0 = x0 - OVER, oy0 = y0 - OVER, ox1 = x1 + OVER, oy1 = y1 + OVER
  const rx = Math.min(run + OVER, (ox1 - ox0) / 2), ry = Math.min(run + OVER, (oy1 - oy0) / 2)
  const r = Math.min(rx, ry)
  const zt = zE + ((zTop - zE) * r) / (run + OVER)
  const ix0 = ox0 + r, ix1 = ox1 - r, iy0 = oy0 + r, iy1 = oy1 - r
  const B: V3[] = [[ox0, oy0, zE], [ox1, oy0, zE], [ox1, oy1, zE], [ox0, oy1, zE]]
  const T: V3[] = [[ix0, iy0, zt], [ix1, iy0, zt], [ix1, iy1, zt], [ix0, iy1, zt]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const same = Math.hypot(T[i][0] - T[j][0], T[i][1] - T[j][1]) < 1e-3
    if (same) tile.tri(B[i], B[j], T[i])
    else tile.quad(B[i], B[j], T[j], T[i])
  }
  if (flat && ix1 - ix0 > 0.01 && iy1 - iy0 > 0.01) flat.quad(T[0], T[1], T[2], T[3])
  // soffit: from the wall line out to the eave, facing down
  const W: V3[] = [[x0, y0, zE], [x1, y0, zE], [x1, y1, zE], [x0, y1, zE]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; soffit.quad(W[j], W[i], B[i], B[j]) }
}

/** A pyramid or cone over a ring, smooth-shaded when `smooth`. */
function cone(part: Part, ring: XY[], z0: number, apex: V3, smooth = true) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (!smooth) { part.tri([a[0], a[1], z0], [b[0], b[1], z0], apex); continue }
    const h = apex[2] - z0
    const nrm = (p: XY): V3 => { const dx = p[0] - apex[0], dy = p[1] - apex[1], l = Math.hypot(dx, dy) || 1, k = Math.hypot(h, l); return [(dx / l) * h / k, (dy / l) * h / k, l / k] }
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    part.tri([a[0], a[1], z0], [b[0], b[1], z0], apex, undefined, undefined, undefined, [nrm(a), nrm(b), nrm(m)])
  }
}

/** A round turret: corbel from zb-2.4, drum to z1, eave ring and conical cap to zc. */
function turret(stone: Part, cap: Part, c: XY, r: number, zb: number, z1: number, zc: number, n = 12, corbel = true) {
  const ring = circle(c, r, n, Math.PI / n)
  walls(stone, ring, zb, z1, 40)
  if (corbel) {
    const small = circle(c, r * 0.35, n, Math.PI / n), zc0 = zb - 2.4
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      stone.quad([small[i][0], small[i][1], zc0], [small[j][0], small[j][1], zc0], [ring[j][0], ring[j][1], zb], [ring[i][0], ring[i][1], zb])
    }
  }
  const eave = circle(c, r + 0.3, n, Math.PI / n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    cap.quad([ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1], [eave[i][0], eave[i][1], z1], [eave[j][0], eave[j][1], z1])
  }
  cone(cap, eave, z1, [c[0], c[1], zc])
}

/** A flat panel on a face (a, unit tangent t, outward n): centre s along it, width w, optional semicircular head. */
function panel(part: Part, a: XY, t: XY, n: XY, s: number, w: number, z0: number, z1: number, arch: boolean, proud = 0.06) {
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * proud, a[1] + t[1] * u + n[1] * proud, z]
  const r = w / 2, zs = arch ? z1 - r : z1
  if (zs - z0 > 0.1) part.quad(P(s - r, z0), P(s + r, z0), P(s + r, zs), P(s - r, zs))
  if (arch) {
    const k = 8
    for (let i = 0; i < k; i++) {
      const a0 = (Math.PI * i) / k, a1 = (Math.PI * (i + 1)) / k
      part.tri(P(s, zs), P(s + r * Math.cos(a0), zs + r * Math.sin(a0)), P(s + r * Math.cos(a1), zs + r * Math.sin(a1)))
    }
  }
}
function face(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { L, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as XY, n: outward(a, b) }
}
/** A disc on a face (clock), facing n. */
function disc(part: Part, a: XY, t: XY, n: XY, s: number, z: number, r: number, proud = 0.12, k = 14) {
  const P = (u: number, v: number): V3 => [a[0] + t[0] * u + n[0] * proud, a[1] + t[1] * u + n[1] * proud, v]
  for (let i = 0; i < k; i++) {
    const a0 = (2 * Math.PI * i) / k, a1 = (2 * Math.PI * (i + 1)) / k
    part.tri(P(s, z), P(s + r * Math.cos(a0), z + r * Math.sin(a0)), P(s + r * Math.cos(a1), z + r * Math.sin(a1)))
  }
}

/** The storey windows of one bay, from zFrom up. */
function bayWindows(win: Part, a: XY, t: XY, n: XY, s: number, zFrom: number) {
  if (zFrom < 1) panel(win, a, t, n, s, 1.9, 1.3, 5.2, true) // ground floor, round-headed
  if (zFrom < 6.4) panel(win, a, t, n, s, 1.7, 6.6, 13.2, false) // 2nd-3rd floors
  panel(win, a, t, n, s, 1.8, 14.6, 19.9, true) // 4th floor, tall round-headed
  panel(win, a, t, n, s, 1.5, 21.0, 23.4, false) // 5th floor
}
/** Windows along a wall from a to b, bays of about `bay` m, `inset` clear at both ends. */
function facade(win: Part, a: XY, b: XY, zFrom: number, inset = 2.3, bay = 3.4, skip?: (s: number) => boolean) {
  const { L, t, n } = face(a, b)
  const span = L - 2 * inset
  if (span < 1.6) return
  const k = Math.max(1, Math.round(span / bay)), w = span / k
  for (let i = 0; i < k; i++) {
    const s = inset + (i + 0.5) * w
    if (skip?.(s)) continue
    bayWindows(win, a, t, n, s, zFrom)
  }
}

/**
 * A stone dormer gable on a facade: its face at the eave line, rising to
 * `apex`, with tiled slopes running back `depth` into the main roof.
 */
function gable(stone: Part, tile: Part, win: Part, a: XY, b: XY, s: number, w = 4.4, apex = 31.5, depth = 5.5) {
  const { t, n } = face(a, b)
  const o = 0.3, zb = EAVE - 1.2, zs = EAVE + 0.6
  const P = (u: number, z: number, d = o): V3 => [a[0] + t[0] * u + n[0] * d, a[1] + t[1] * u + n[1] * d, z]
  const l = s - w / 2, r = s + w / 2
  // the stone face (a pentagon) and its thin sides
  stone.quad(P(l, zb), P(r, zb), P(r, zs), P(l, zs))
  stone.tri(P(l, zs), P(r, zs), P(s, apex))
  stone.quad(P(r, zb, 0), P(r, zb), P(r, zs), P(r, zs, 0))
  stone.quad(P(l, zb), P(l, zb, 0), P(l, zs, 0), P(l, zs))
  // tiled slopes back into the roof, dropping a little so they stay inside it
  const back = -depth, ar = apex - 0.9
  tile.quad(P(r + 0.2, zs - 0.1, o + 0.05), P(r + 0.2, zs - 0.1, back), P(s, ar, back), P(s, apex + 0.05, o + 0.05))
  tile.quad(P(l - 0.2, zs - 0.1, back), P(l - 0.2, zs - 0.1, o + 0.05), P(s, apex + 0.05, o + 0.05), P(s, ar, back))
  // its window: a paired round-headed light
  panel(win, a, t, n, s, 1.3, EAVE - 0.4, EAVE + 3.4, true, o + 0.06)
}

function build() {
  const stone = new Part(), tile = new Part(), cap = new Part(), win = new Part(), glass = new Part(), clock = new Part()

  // ---------------------------------------------------------------- plan (lidar)
  const Xs = 19, Xr = 16, Xm = 15.3, Xn = 12.9, XR = 8.5
  const Ys = -42.5, Yr = -40, Yp1 = -27, Yp2 = -16, Ym = -3, Yn = 9, YN = 39.5
  const half: XY[] = [ // east half, south to north, mirrored below
    [XR, Yr], [XR, Ys], [Xs, Ys], [Xs, Yp1], [Xr, Yp1], [Xr, Yp2], [Xs, Yp2], [Xs, Ym], [Xm, Ym], [Xm, Yn], [Xn, Yn], [Xn, YN],
  ]
  const outline = ccw([...half, ...half.slice().reverse().map(([x, y]) => [-x, y] as XY)])
  walls(stone, outline, 0, EAVE, 10)
  // string courses over the ground floor and under the fourth-floor arches, and the eave cornice
  band(stone, outline, 0.25, 6.0, 6.5)
  band(stone, outline, 0.2, 14.0, 14.4)
  band(stone, outline, 0.4, EAVE - 1.0, EAVE)

  // the one-storey arcades in the recesses (south front and both sides)
  box(stone, stone, -XR, Ys, XR, Yr, 0, 9)
  for (const sx of [1, -1]) {
    const r = ccw(rect(sx * Xr, Yp1, sx * Xs, Yp2))
    walls(stone, r, 0, 9); capRing(stone, r, 9)
  }

  // ---------------------------------------------------------------- roofs
  hip(tile, stone, stone, -Xr, Yr, Xr, Ym, EAVE, TOP, RUN) // the south block's main hip
  hip(tile, stone, stone, -Xm, Ym, Xm, Yn, EAVE, TOP, RUN) // the middle
  hip(tile, stone, stone, -Xn, Ym, Xn, YN, EAVE, TOP, RUN) // the north block
  for (const sx of [1, -1]) {
    const x0 = sx > 0 ? XR : -Xs, x1 = sx > 0 ? Xs : -XR
    hip(tile, null, stone, x0, Ys, x1, Yp1, EAVE, 36, 5.5) // front pavilions: steep pyramids
    hip(tile, null, stone, sx > 0 ? XR + 1 : -Xs, Yp2, sx > 0 ? Xs : -XR - 1, Ym, EAVE, 33.5, 5.5) // rear pavilions
  }
  // the glazed cortile roof over the five-storey courtyard, and the small north light
  {
    const g = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => {
      const zr = z1, m = (x1 - x0) / 2
      const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
      const P: V3 = [(x0 + x1) / 2, y0 + m, zr], Q: V3 = [(x0 + x1) / 2, y1 - m, zr]
      glass.tri(A, B, P); glass.quad(B, C, Q, P); glass.tri(C, D, Q); glass.quad(D, A, P, Q)
    }
    g(-7.5, -31, 7.5, -8.5, TOP + 0.02, 34)
    g(-3.5, 10.5, 3.5, 17.5, TOP + 0.02, 32.6)
  }

  // ---------------------------------------------------------------- windows
  const pts = outline
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const { L, n } = face(a, b)
    if (L < 2) continue
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    // recess walls behind the arcades: windows above it
    if (Math.abs(my - Yr) < 0.1 && n[1] < 0) { facade(win, a, b, 9, 1.0, 3.6, (s) => Math.abs(a[0] + (b[0] - a[0]) * s / L) < 3.8); continue }
    if (Math.abs(Math.abs(mx) - Xr) < 0.1 && Math.abs(my - (Yp1 + Yp2) / 2) < 1) { facade(win, a, b, 9, 1.0, 3.6); continue }
    if (Math.abs(n[0]) < 0.5 && Math.abs(n[1]) < 0.5) continue
    // short return walls (recess sides): none
    if (L < 4) continue
    // the north end: the tower's face covers the middle
    if (Math.abs(my - YN) < 0.1) { facade(win, a, b, 0, 2.3, 3.4, (s) => Math.abs(a[0] + (b[0] - a[0]) * s / L) < 8.6); continue }
    facade(win, a, b, 0)
  }
  // arcade openings: three round arches on the front, two on each side
  { const a: XY = [-XR, Ys], { t, n } = face(a, [XR, Ys])
    for (const s of [XR - 4.6, XR, XR + 4.6]) panel(win, a, t, n, s, 3.4, 0.2, 6.6, true)
    for (const s of [2.2, 14.8]) panel(win, a, t, n, s, 1.8, 1.3, 5.2, true) }
  for (const sx of [1, -1]) {
    const a: XY = [sx * Xs, sx > 0 ? Yp1 : Yp2], b: XY = [sx * Xs, sx > 0 ? Yp2 : Yp1], { t, n, L } = face(a, b)
    for (const s of [L * 0.27, L * 0.73]) panel(win, a, t, n, s, 3.2, 0.2, 6.4, true)
  }

  // ---------------------------------------------------------------- dormer gables
  const G = (a: XY, b: XY, s: number, w?: number, apex?: number) => gable(stone, tile, win, a, b, s, w, apex)
  for (const sx of [1, -1]) {
    const M = (p: XY): XY => [sx * p[0], p[1]]
    const seg = (a: XY, b: XY) => sx > 0 ? [M(a), M(b)] as const : [M(b), M(a)] as const
    // south face: the pavilions and the recess beside the clock tower
    { const [a, b] = seg([XR, Ys], [Xs, Ys]); G(a, b, (Xs - XR) / 2, 4.6, 32) }
    { const [a, b] = seg([3.4, Yr], [XR, Yr]); G(a, b, (XR - 3.4) / 2, 3.6, 30.8) }
    // east / west faces
    const side = (y0: number, y1: number, x: number, w = 4.4, apex = 31.5) => {
      const [a, b] = sx > 0 ? [M([x, y0]), M([x, y1])] : [M([x, y1]), M([x, y0])]
      G(a, b, Math.abs(y1 - y0) / 2, w, apex)
    }
    side(Ys, Yp1, Xs, 4.6, 32)
    side(Yp1, Yp2, Xr, 4.2, 31)
    side(Yp2, Ym, Xs, 4.4, 31.5)
    side(Ym, Yn, Xm, 4.2, 31)
    side(Yn, 18, Xn, 4.0, 31)
    side(18, 27, Xn, 4.0, 31)
  }

  // ---------------------------------------------------------------- turrets
  const corners: XY[] = [[Xs, Ys], [XR, Ys], [Xs, Yp1], [Xs, Yp2], [Xs, Ym], [Xm, Yn], [Xn, YN]]
  for (const [x, y] of corners) for (const sx of [1, -1]) {
    const big = Math.abs(y - Ys) < 0.1
    turret(stone, cap, [sx * x, y], big ? 2.2 : 1.95, 8.0, EAVE + 1.6, big ? 35.5 : 33.5)
  }

  // ---------------------------------------------------------------- chimneys
  for (const [x, y] of [[-6.2, -38.5], [12.5, -36.5], [-12.5, -36.5], [14, -6], [-14, -6], [10.5, 21], [-10.5, 21]] as XY[]) box(stone, stone, x - 0.7, y - 0.9, x + 0.7, y + 0.9, 26, 34)

  // ---------------------------------------------------------------- the clock tower (south front)
  {
    const cx = 0, y0 = -40.25, y1 = -33.3, hx = 3.3, zt = 44
    const r = ccw(rect(cx - hx, y0, cx + hx, y1))
    walls(stone, r, 9, zt)
    // a cornice band and the spire
    const band = ccw(rect(cx - hx - 0.3, y0 - 0.3, cx + hx + 0.3, y1 + 0.3))
    walls(stone, band, zt - 1, zt); capRing(stone, band, zt)
    // its round corner turrets with stone caps, from the clock stage up
    for (const [x, y] of [[cx - hx, y0], [cx + hx, y0], [cx - hx, y1], [cx + hx, y1]] as XY[]) turret(stone, stone, [x, y], 0.75, 37.5, 45.6, 48.6, 8, true)
    cone(tile, ccw(rect(cx - 2.6, y0 + 0.65, cx + 2.6, y1 - 0.65)), zt, [cx, (y0 + y1) / 2, 54.2], false)
    cone(cap, circle([cx, (y0 + y1) / 2], 0.35, 6), 54.0, [cx, (y0 + y1) / 2, 56], false)
    // the clock on all four faces, the belfry lights below it, slit windows down the shaft
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], { L, t, n } = face(a, b)
      disc(clock, a, t, n, L / 2, 40.3, 1.45)
      for (const d of [-0.85, 0.85]) panel(win, a, t, n, L / 2 + d, 1.0, 34.2, 37.4, true)
      if (n[1] < -0.5) {
        for (const z of [10.5, 15.5, 20.5, 25.5, 30]) for (const d of [-0.8, 0.8]) panel(win, a, t, n, L / 2 + d, 0.9, z, z + 2.6, false)
      } else for (const z of [27, 30.5]) panel(win, a, t, n, L / 2, 1.0, z, z + 2.4, false)
    }
  }

  // ---------------------------------------------------------------- the north tower
  {
    const hx = 7.7, y0 = 25.5, y1 = 41, zt = 48
    const r = ccw(rect(-hx, y0, hx, y1))
    walls(stone, r, 0, zt)
    const band = ccw(rect(-hx - 0.35, y0 - 0.35, hx + 0.35, y1 + 0.35))
    walls(stone, band, 37.6, 38.6); capRing(stone, band, 38.6)
    walls(stone, band, zt - 1.2, zt); capRing(stone, band, zt)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], { L, t, n } = face(a, b)
      // the open belfry arcade: four round arches a face
      for (let k = 0; k < 4; k++) panel(win, a, t, n, L * (0.2 + 0.2 * k), 2.3, 39.6, 45.4, true)
      // the north face carries the facade's windows up to the arcade
      if (n[1] > 0.5) {
        for (const s of [L * 0.3, L * 0.7]) { bayWindows(win, a, t, n, s, 0); panel(win, a, t, n, s, 1.5, 26, 30.5, true); panel(win, a, t, n, s, 1.5, 32, 36, false) }
        panel(win, a, t, n, L / 2, 3.0, 0.2, 6.2, true)
      } else for (const s of [L * 0.3, L * 0.7]) panel(win, a, t, n, s, 1.4, 28.5, 35.5, true)
    }
    // round corner pinnacles with stone caps, and the tall tiled pyramid
    for (const [x, y] of [[-hx, y0], [hx, y0], [-hx, y1], [hx, y1]] as XY[]) turret(stone, stone, [x, y], 1.0, 41, 50, 53.2, 8, true)
    const yc = (y0 + y1) / 2
    cone(tile, ccw(rect(-hx + 0.6, y0 + 0.6, hx - 0.6, y1 - 0.6)), zt, [0, yc, 65.5], false)
    cone(cap, circle([0, yc], 0.45, 6), 65.2, [0, yc, 67.8], false)
  }

  const GRANITE = finish('lc-granite', 0xd6bea8)
  return finishGlb('msp-landmark-center', 'Landmark Center', [
    { part: stone, material: GRANITE },
    { part: tile, material: finish('lc-tile', 0xb35a48, 0.9) },
    { part: cap, material: { ...PALETTE.patina, color: 0x8bb8a0 } },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: clock, material: finish('neon-clock', 0xf3ead6) },
  ], { bearing: 359.5, height: 67.8, replaces: ['way/43386059'] }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-landmark-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
