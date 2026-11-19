/**
 * The Peristyle, City Park, New Orleans (Paul Andry, 1907) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nola-city-park-peristyle.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 6.4, so the long sides run along
 * model x (compass 96.4, the OSM outline's long walls) and model -y faces
 * compass 186, across Big Lake.
 * Anchor: the area centroid of OSM way/325825562 (building=yes), which is
 * the Peristyle (node/2657829351, amenity=shelter "Peristyle", stands
 * inside it).
 *
 * Identity: an open, roofed colonnade on a low stepped platform: a long
 * rectangle with semicircular ends, ringed by slender Ionic columns (twelve
 * on each long side, five round each end) with a square pier at each of
 * the four corners where the straight sides meet the curves; over them a
 * tall plain entablature (architrave, a projecting cornice moulding and a
 * deep plain attic) under a flat roof; steps down to Big Lake at either end
 * of the lake side, flanked by four recumbent concrete lions facing the
 * water.
 *
 * Evidence
 * - OSM way/325825562: the outline: the straight part 30.5 m long, the
 *   rounded ends out to x = +-19.6, the whole 10.9 m deep.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. Ground north of it 1.85 above the
 *   grid minimum; the roof 9.0-9.2 (7.3 above the ground) over
 *   x = +-16, y = -6..5.3, and over the ends to x = +-19.8 within
 *   y = +-4.5; the platform about 0.35 above the ground; south of it the
 *   ground falls 0.4 to a lawn terrace and then 1.8 to Big Lake.
 * - Terrain (Mapterhorn): 1.5-2.2 round the platform, the lake 20 m south.
 *   elevation 0; the lower flights down to the water are left to the map.
 * - NAIP (USGS, public domain): the plan, the pale flat roof, the steps
 *   down to the water at both ends of the lake side.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "City Park, New Orleans, May 2019 - Peristyle across the water.jpg",
 *     William Marnoch, CC BY 2.0: the lake side face on (column count and
 *     spacing, entablature proportions, the two flights and the lions)
 *     https://commons.wikimedia.org/wiki/File:City_Park,_New_Orleans,_May_2019_-_Peristyle_across_the_water.jpg
 *   - "City Park New Orleans 24 Sept 2016 Peristyle 2.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: the east end from the north-east (the
 *     semicircular end, the corner piers, the coffered ceiling, a lion)
 *     https://commons.wikimedia.org/wiki/File:City_Park_New_Orleans_24_Sept_2016_Peristyle_2.jpg
 *   - "City Park New Orleans 24 Sept 2016 Peristyle.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: the north side from the north-west
 *     https://commons.wikimedia.org/wiki/File:City_Park_New_Orleans_24_Sept_2016_Peristyle.jpg
 *   - "Peristyle NOLA From Across Great Lawn.JPG", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: the north side face on, far off
 *     https://commons.wikimedia.org/wiki/File:Peristyle_NOLA_From_Across_Great_Lawn.JPG
 *   - "City Park Peristyle, New Orleans 14 May 2011 - lion.jpg",
 *     mrpolyonymous, CC BY 2.0: a lion close up (pose, mane, plinth)
 *     https://commons.wikimedia.org/wiki/File:City_Park_Peristyle,_New_Orleans_14_May_2011_-_lion.jpg
 * - Published: Wikipedia "City Park (New Orleans)": the Peristyle, 1907,
 *   built as a dance pavilion; its four concrete lions.
 *
 * Measured (lidar/OSM): plan, roof 7.3, platform 0.35-0.45. Estimated from
 * the lake-side photo scaled to the lidar's roof: the columns 0.45-5.6
 * (r 0.3, about 1:9), the entablature 5.6-7.35 (architrave 0.45, cornice
 * moulding 0.3, attic 1.05), the column spacing 2.47 m, the corner piers
 * 1.7 m square, the end ring's radius 3.8 to the column centres. The lions
 * (2.2 m long, 1.1 m to the head, on 0.7 m plinths) and their places at the
 * heads of the two lake flights are estimated from the photos.
 * Left out: the coffers, the lamp posts, the lower flights and landing at
 * the water, the paving.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, prism, save, offset, ccw, circle, type XY } from './atl-flatiron-building'
import { faceOf, fblock, qf, tf, shaft } from './nola-gallier-hall'

/**
 * A recumbent lion facing -y (or +y with `dir` 1), centred on (x, y) with
 * its belly at z0: smooth elliptical sections lofted from the haunch to
 * the mane, a rounded head, and two forelegs stretched out in front.
 */
export function lion(p: Part, x: number, y: number, z0: number, s = 1, dir = -1) {
  const n = 8
  // sections: [along (from the rump, +), half-width, bottom, top]
  const body: [number, number, number, number][] = [
    [1.1, 0.15, 0.15, 0.4], [0.9, 0.42, 0.0, 0.62], [0.3, 0.4, 0.0, 0.6],
    [-0.3, 0.5, 0.0, 0.95], [-0.6, 0.55, 0.05, 1.25], [-0.82, 0.45, 0.25, 1.25],
    [-0.95, 0.28, 0.45, 1.05], [-1.12, 0.2, 0.5, 0.85], [-1.2, 0.1, 0.58, 0.75],
  ]
  const P = (a: number, w: number, z: number): V3 => [x + w * s, y - dir * a * s, z0 + z * s]
  const rings = body.map(([a, w, zb, zt]) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI, c = Math.cos(t), sn = Math.sin(t)
    return P(a, w * c, (zb + zt) / 2 + ((zt - zb) / 2) * sn)
  }))
  // the loft runs rump to head; outward faces must face away from the axis
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], mid = (zb: number, zt: number) => (zb + zt) / 2
    const cA: V3 = [x, P(body[k][0], 0, 0)[1], z0 + mid(body[k][2], body[k][3]) * s]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const m: V3 = [(A[i][0] + B[j][0]) / 2, (A[i][1] + B[j][1]) / 2, (A[i][2] + B[j][2]) / 2]
      qf(p, A[i], A[j], B[j], B[i], [m[0] - cA[0], 0, m[2] - cA[2]])
    }
  }
  // close the rump and the muzzle
  const end = (R: V3[], out: number) => { for (let i = 1; i < n - 1; i++) tf(p, R[0], R[i], R[i + 1], [0, out, 0]) }
  end(rings[0], dir < 0 ? 1 : -1)
  end(rings[rings.length - 1], dir < 0 ? -1 : 1)
  // forelegs: two rounded slabs lying forward from the chest
  for (const sg of [-1, 1]) {
    const xa = x + sg * 0.26 * s, a0 = -0.4, a1 = -1.5
    const y0 = y - dir * a0 * s, y1 = y - dir * a1 * s
    box(p, xa - 0.13 * s, xa + 0.13 * s, Math.min(y0, y1), Math.max(y0, y1), z0, z0 + 0.24 * s, p, 0.08 * s)
  }
}

/**
 * A light Ionic column (about 90 triangles): a round base, a tapered
 * shaft, a capital block with a bold scroll drum at each end (`alongX`: the
 * scrolls on the column's x sides) and a thin abacus.
 */
export function ionicLite(p: Part, x: number, y: number, r: number, z0: number, z1: number, alongX = true, n = 8) {
  const hb = r * 0.5, hc = r * 1.0
  // the shaft flares into its base (the square plinth is drawn by the caller)
  shaft(p, x, y, r * 1.2, r, z0, z0 + hb, n)
  shaft(p, x, y, r, r * 0.86, z0 + hb, z1 - hc, n)
  const zv = z1 - hc, za = z1 - r * 0.22
  const vw = r * 1.05, vd = r * 0.85
  const [hx, hy] = alongX ? [vw, vd] : [vd, vw]
  box(p, x - hx, x + hx, y - hy, y + hy, zv, za, null, 0)
  const vr = r * 0.42, zc = za - vr
  for (const k of [-1, 1]) {
    const c: XY = alongX ? [x + k * vw, y] : [x, y + k * vw]
    const ring = circle([0, 0], vr, 6, Math.PI / 6)
    const P = (u: number, v: number, t: number): V3 => (alongX ? [c[0] + u * 0.6, c[1] + t, zc + v] : [c[0] + t, c[1] + u * 0.6, zc + v])
    const d = vd * 1.02
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6, a = ((i + 0.5) / 6) * 2 * Math.PI + Math.PI / 6
      const want: V3 = alongX ? [Math.cos(a), 0, Math.sin(a)] : [0, Math.cos(a), Math.sin(a)]
      qf(p, P(ring[i][0], ring[i][1], -d), P(ring[j][0], ring[j][1], -d), P(ring[j][0], ring[j][1], d), P(ring[i][0], ring[i][1], d), want)
    }
    for (const t of [-d, d]) {
      const want: V3 = alongX ? [0, Math.sign(t), 0] : [Math.sign(t), 0, 0]
      for (let i = 1; i < 5; i++) tf(p, P(ring[0][0], ring[0][1], t), P(ring[i][0], ring[i][1], t), P(ring[i + 1][0], ring[i + 1][1], t), want)
    }
  }
  box(p, x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3, za, z1, null, 0)
}

if (import.meta.main) {
  const stone = new Part(), white = new Part(), roof = new Part(), con = new Part()

  const YC = -0.2, XS = 15.4, HD = 5.5, RE = 4.4 // straight half-length, half-depth, end radius
  const XP = 16.3 // the corner piers' outer face
  const FLOOR = 0.42, CAP = 5.6, ARCH = 6.05, CORN = 6.35, TOP = 7.35

  // the plan: rectangle (to the piers' outer faces) with a semicircular end on each side
  const ends = (sg: number): XY[] => {
    const pts: XY[] = []
    const a0 = Math.asin(Math.min(1, ((XP - XS) / RE)))
    // where x = XP meets the circle: angle from the axis
    const lim = Math.acos((XP - XS) / RE)
    for (let i = 0; i <= 8; i++) {
      const t = -lim + (2 * lim * i) / 8
      pts.push([XS * sg + sg * RE * Math.cos(t), YC + RE * Math.sin(t) * sg])
    }
    void a0
    return pts
  }
  const plan: XY[] = ccw([[-XP, YC - HD], [XP, YC - HD], ...ends(1), [XP, YC + HD], [-XP, YC + HD], ...ends(-1)])

  // ── the platform: two steps all round ──
  prism(stone, offset(plan, 1.5), 0, FLOOR * 0.5, stone, 0.06)
  prism(stone, offset(plan, 0.85), FLOOR * 0.5, FLOOR, stone, 0.06)

  // ── the columns ──
  const R = 0.3
  const YL = HD - 0.75
  for (let k = 0; k < 12; k++) {
    const x = -13.6 + (27.2 * k) / 11
    for (const sg of [-1, 1]) {
      const y = YC + sg * YL
      box(white, x - 0.42, x + 0.42, y - 0.42, y + 0.42, FLOOR, FLOOR + 0.22, white, 0)
      ionicLite(white, x, y, R, FLOOR + 0.22, CAP, true)
    }
  }
  const RC = 3.75
  for (const sg of [-1, 1]) {
    for (let k = -2; k <= 2; k++) {
      const t = (k * Math.PI) / 6, x = sg * (XS + RC * Math.cos(t)), y = YC + RC * Math.sin(t)
      box(white, x - 0.42, x + 0.42, y - 0.42, y + 0.42, FLOOR, FLOOR + 0.22, white, 0)
      ionicLite(white, x, y, R, FLOOR + 0.22, CAP, Math.abs(k) === 0)
    }
    // the corner piers, with a pilaster on each face
    for (const sy of [-1, 1]) {
      const x0 = sg > 0 ? XP - 1.7 : -XP, x1 = sg > 0 ? XP : -XP + 1.7
      const y0 = sy > 0 ? YC + HD - 1.7 : YC - HD, y1 = sy > 0 ? YC + HD : YC - HD + 1.7
      box(white, x0, x1, y0, y1, FLOOR, CAP, null, 0.05)
      box(white, x0 - 0.12, x1 + 0.12, y0 - 0.12, y1 + 0.12, FLOOR, FLOOR + 0.35, white, 0.04)
      box(white, x0 - 0.12, x1 + 0.12, y0 - 0.12, y1 + 0.12, CAP - 0.35, CAP, null, 0.04)
    }
  }

  // ── the entablature: architrave, cornice moulding, the deep plain attic, the flat roof ──
  prism(stone, offset(plan, -0.08), CAP, ARCH, null, 0.0, true)
  prism(stone, offset(plan, 0.22), ARCH, CORN, null, 0.1, true)
  prism(stone, plan, CORN, TOP - 0.1, null, 0.0)
  prism(stone, offset(plan, 0.1), TOP - 0.12, TOP, roof, 0.06, true)

  // ── the lake side: two flights down from the platform, with the four lions ──
  const lake = faceOf([-XP, YC - HD - 0.85], [XP, YC - HD - 0.85])
  for (const [s0, s1] of [[XP - 17.4 + 0.0, XP - 9.8], [XP + 9.8, XP + 17.4]]) {
    for (let k = 0; k < 3; k++) fblock(stone, lake, s0, s1, 0, (FLOOR * (3 - k)) / 3 - 0.0, 0.5 + k * 0.45, -0.1)
  }
  for (const x of [-16.6, -9.1, 9.1, 16.6]) {
    const y = YC - HD - 1.5
    box(con, x - 0.7, x + 0.7, y - 1.6, y + 1.55, 0, 0.75, con, 0)
    lion(con, x, y + 0.2, 0.75, 1.15, -1)
  }

  await save('nola-city-park-peristyle', 'Peristyle', [
    { part: stone, material: finish('peristyle-stone', 0xe6e0d3) },
    { part: white, material: finish('peristyle-columns', 0xf1ece2) },
    { part: con, material: finish('peristyle-lions', 0xcdc8bd) },
    { part: roof, material: finish('peristyle-roof', 0xc2bdb0) },
  ], { bearing: 6.4, osm: 'way/325825562', height: TOP }, 6500)
}
