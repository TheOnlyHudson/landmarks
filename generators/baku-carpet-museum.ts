/**
 * Azerbaijan Carpet Museum (Azərbaycan Xalçası Muzeyi), Seaside Boulevard,
 * Baku: procedural, CC0-1.0.
 *   bun generators/baku-carpet-museum.ts   (writes the low and the detail model)
 *
 * Franz Janz's museum (opened 2014), shaped as a rolled carpet lying along
 * the boulevard. Identity, in order: the long carpet roll, an elliptical
 * tube that swells and rises from a low rounded west end to the big open
 * east end, where its section reaches the ground and the end is a glazed
 * ellipse ringed by thick gold rims (the roll's turns); the carpet pattern
 * on the roll, rows of eight-pointed bronze medallions on pale champagne
 * panels; the fringe: bands of gold stripes along the glazed ground floor
 * and round the low wings to the north, lit at night.
 *
 * Map frame: x along the building (compass 100.5, east-south-east), y to
 * its left (north-north-east), z up, metres; placed at bearing 10.5.
 * Origin: the area centroid of OSM way/253082269, at 49.835551, 40.359841.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): way/253082269, building, levels 4,
 *   roof:shape round: a 121 m bar 21 m wide along compass 100.5, with a
 *   wing to the north at each end (west 37 x 20 m, east 20 x 28 m).
 * - Published: Wikipedia "Azerbaijan Carpet Museum": architect Franz Janz,
 *   opened 26 August 2014, "intended to look like a rolled carpet". No
 *   dimensions are published.
 * - Photos (Wikimedia Commons, evidence):
 *   p5 Presidential Press and Information Office, CC BY 4.0, "Azərbaycan
 *      xalça muzeyi.jpg": from the north near the east end: the gold-ringed
 *      end, the medallion rows, the striped fringe, the low glazed wing
 *      https://commons.wikimedia.org/wiki/File:Az%C9%99rbaycan_xal%C3%A7a_muzeyi.jpg
 *   p6 Francisco Anzola, CC BY 3.0, "Carpet Museum Looks Like A Carpet
 *      (221090067).jpeg": from the south-east: the whole roll, the glazed
 *      end, the taper to the west, the ground floor; heights scaled from
 *      its 2.5 m doors (0.057 m/px)
 *      https://commons.wikimedia.org/wiki/File:Carpet_Museum_Looks_Like_A_Carpet_(221090067).jpeg
 *   p8 Mahmoodrezamo, CC BY-SA 4.0, "Museum of Azerbaijan Carpet and
 *      Applied Art.jpg": from the south-south-east, the roll's profile
 *      https://commons.wikimedia.org/wiki/File:Museum_of_Azerbaijan_Carpet_and_Applied_Art.jpg
 *   p7 SwissTraveller, CC BY-SA 4.0, "Baku Carpet Museum View.jpg": from
 *      the east along the promenade: the roll's low rounded west end
 *      https://commons.wikimedia.org/wiki/File:Baku_Carpet_Museum_View.jpg
 *   p4 Səltənət Gül, CC BY-SA 4.0, "Azərbaycan Milli Xalça Muzeyi,
 *      eksteryer.jpg": night, the medallion panels and the lit stripes
 *      https://commons.wikimedia.org/wiki/File:Az%C9%99rbaycan_Milli_Xal%C3%A7a_Muzeyi,_eksteryer.jpg
 * - Look-only: none.
 *
 * Numbers (estimated from p6 and p8 unless noted)
 * - Plan from OSM. The roll runs from x = -48 to the east end at x = 61,
 *   centred over the bar (y = -7.6).
 * - Lead review 1: the roll lies whole on the ground floor (bottom 5.4),
 *   bigger at the east end (16 x 15.2 m with the last turns' flare) than
 *   at the west (12 x 9.6); the ground floor is a set-back glazed band
 *   with gold stripes; the end's rim is one bold gold band curling inward
 *   1.3 turns; colours re-sampled (roll #9c9ea4 / #868587 sunlit, #7c7f83
 *   shade, medallions #595346 / #615f57): drawn #b3ada0 and #6e6248.
 * - (first pass) The roll's section: at the east end 19 m wide and 19 m tall, from the
 *   ground (2.3, clear of the map's terrain) to 19.2, the last 12 m flaring a metre past the body; at the
 *   west end 14 m wide and 11 m tall, from 4.5 to 15.5 (p6: the far end
 *   about 0.6 the near end's height after perspective). Between, it
 *   swells smoothly; its lower part sinks into the ground floor.
 * - The ground floor 5.0 m over the lowest ground (the park rises about
 *   3 m to the west, Mapterhorn and p5), the stripes over it, four bands;
 *   the wings 7.2 m over their own ground, the west wing's ground 2.6 m
 *   higher.
 * - Medallions about 3 m across, 4.0 m apart along the roll, in five
 *   rows (p5).
 * - Colours: the panels' ground #aab4bb (sky-lit), #9c9385 (shade), read
 *   as champagne gold in every photo: drawn #c4b28c; the medallions
 *   #666254 and #615f57: drawn #85704c, as dark as they show; the rims and
 *   stripes gold, #aba46a lit: drawn #b89a52; the plinth grey #6c6659 (shade) drawn
 *   #9c9c97.
 *
 * Doubts
 * - No dimensions are published; every height is scaled from photos.
 * - The pattern is drawn as rows of medallions only; the panels' frames and
 *   the borders between them are left out. The glazing's mullions are in
 *   the detail model only.
 * - The roll's exact plan position over the bar and the west end's shape
 *   are read from oblique photos.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, flat, ccw, offset, type XY } from './sf-de-young'
import { writeModel } from './baku-maiden-tower'

const OUTLINE: XY[] = [[-62.21, 22.09], [-40.36, 22.58], [-24.97, 22.93], [-24.55, 2.31], [41.56, 3.79], [41.3, 16.15], [40.99, 31.37], [60.45, 31.81], [60.75, 16.75], [61.45, -17.9], [-58.96, -17.9], [-61.54, 13.89]]
const BAR: XY[] = [[-58.96, -17.9], [61.45, -17.9], [61.1, 3.0], [-60.3, 2.4]]
const WEST: XY[] = [[-61.54, 2.4], [-24.75, 2.3], [-24.97, 22.93], [-62.21, 22.09]]
const EAST: XY[] = [[41.56, 3.0], [61.1, 3.0], [60.45, 31.81], [40.99, 31.37]]

const XW = -48, XE = 61, YC = -7.6
/** The roll's section at x: half width, half height, centre height. */
function section(x: number) {
  const t = Math.min(1, Math.max(0, (x - XW) / (XE - XW)))
  const e = t * t * (3 - 2 * t) * 0.35 + t * 0.65 // a smooth swell
  // the last turns flare a little past the body, as the roll's end does in p6
  const g = Math.min(1, Math.max(0, (x - (XE - 12)) / 12)), f = g * g * (3 - 2 * g)
  // the roll lies whole on the ground floor (its bottom at 5.4), and is noticeably bigger at the east end
  const a = 6.0 + 2.0 * e + 1.0 * f, top = 15.0 + 4.0 * e + 1.6 * f, bottom = 5.4
  return { a, b: (top - bottom) / 2, zc: (top + bottom) / 2 }
}
const ON = (x: number, th: number, out = 0): V3 => {
  // th = 0 at the top, increasing towards +y (north) and round
  const s = section(x)
  return [x, YC + (s.a + out) * Math.sin(th), s.zc + (s.b + out) * Math.cos(th)]
}
/** The outward normal of the roll's surface at x, th (ignoring the slow change along x). */
const NRM = (x: number, th: number): V3 => {
  const s = section(x)
  const n: V3 = [0, Math.sin(th) / s.a, Math.cos(th) / s.b]
  const l = Math.hypot(n[1], n[2])
  return [0, n[1] / l, n[2] / l]
}

function build(detail: boolean) {
  const skin = new Part(), medal = new Part(), gold = new Part(), stripe = new Part(), glass = new Part(), plinth = new Part()
  const roofP = plinth
  const NA = detail ? 48 : 24, NX = detail ? 44 : 22

  // ---- the roll ----
  const xs = Array.from({ length: NX + 1 }, (_, i) => XW + 2.2 + ((XE - 1.2 - XW - 2.2) * i) / NX)
  for (let i = 0; i < NX; i++) for (let k = 0; k < NA; k++) {
    const t0 = (k / NA) * 2 * Math.PI, t1 = ((k + 1) / NA) * 2 * Math.PI
    const a = ON(xs[i], t0), b = ON(xs[i], t1), c = ON(xs[i + 1], t1), d = ON(xs[i + 1], t0)
    const na = NRM(xs[i], t0), nb = NRM(xs[i], t1), nc = NRM(xs[i + 1], t1), nd = NRM(xs[i + 1], t0)
    skin.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    skin.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
  // the west end: a rounded cap closing the roll
  {
    const x0 = xs[0], s = section(x0), R = 2.2, NC = detail ? 5 : 3
    let prev = Array.from({ length: NA }, (_, k) => ON(x0, (k / NA) * 2 * Math.PI))
    for (let j = 1; j <= NC; j++) {
      const f = j / NC, phi = (f * Math.PI) / 2
      const scale = Math.cos(phi), dx = -R * Math.sin(phi)
      const ring = Array.from({ length: NA }, (_, k) => {
        const th = (k / NA) * 2 * Math.PI
        return [x0 + dx, YC + s.a * scale * Math.sin(th), s.zc + s.b * scale * Math.cos(th)] as V3
      })
      for (let k = 0; k < NA; k++) {
        const k1 = (k + 1) % NA
        const n: V3 = [-Math.sin(phi) - 0.2, Math.sin(((k + 0.5) / NA) * 2 * Math.PI) * Math.cos(phi), Math.cos(((k + 0.5) / NA) * 2 * Math.PI) * Math.cos(phi)]
        if (j < NC || k % 1 === 0) {
          skin.tri(prev[k], prev[k1], ring[k1], undefined, undefined, undefined, [n, n, n])
          if (j < NC) skin.tri(prev[k], ring[k1], ring[k], undefined, undefined, undefined, [n, n, n])
        }
      }
      prev = ring
    }
  }
  // the east end: a bold gold rim that curls inward in a spiral (the carpet's rolled edge), and the glazed ellipse set back inside
  {
    const xe = xs[NX], s = section(xe), NR = detail ? 48 : 24
    const TURNS = 1.3, NS = Math.round(NR * TURNS), HT = 0.75 // half the band's radial width
    const off = (u: number) => 1.1 - 2.9 * u // from just outside the skin, winding in
    const at = (th: number, r: number, dx: number): V3 => [xe + dx, YC + (s.a + r) * Math.sin(th), s.zc + (s.b + r) * Math.cos(th)]
    const q = (A: V3, B: V3, C: V3, D: V3, n: V3) => { gold.tri(A, B, C, undefined, undefined, undefined, [n, n, n]); gold.tri(A, C, D, undefined, undefined, undefined, [n, n, n]) }
    for (let k = 0; k < NS; k++) {
      const u0 = k / NS, u1 = (k + 1) / NS
      const t0 = u0 * TURNS * 2 * Math.PI, t1 = u1 * TURNS * 2 * Math.PI, tm = (t0 + t1) / 2
      const o0 = off(u0), o1 = off(u1), f0 = 0.45 - 0.5 * u0, f1 = 0.45 - 0.5 * u1, back = 1.8
      if (at(tm, (o0 + o1) / 2, 0)[2] < 4.9) continue // where it meets the ground floor
      const out = NRM(xe, tm), inn: V3 = [0, -out[1], -out[2]]
      q(at(t0, o0 + HT, -back), at(t1, o1 + HT, -back), at(t1, o1 + HT, f1), at(t0, o0 + HT, f0), out)
      q(at(t0, o0 + HT, f0), at(t1, o1 + HT, f1), at(t1, o1 - HT, f1), at(t0, o0 - HT, f0), [1, 0, 0])
      q(at(t0, o0 - HT, f0), at(t1, o1 - HT, f1), at(t1, o1 - HT, -back), at(t0, o0 - HT, -back), inn)
    }
    // the spiral's two ends, capped
    for (const u of [0, 1]) {
      const t = u * TURNS * 2 * Math.PI, o = off(u), fz = 0.45 - 0.5 * u, n: V3 = u ? [0, -Math.cos(t), Math.sin(t)] : [0, Math.cos(t), -Math.sin(t)]
      if (at(t, o, 0)[2] >= 4.9) q(at(t, o - HT, -1.8), at(t, o + HT, -1.8), at(t, o + HT, fz), at(t, o - HT, fz), n)
    }
    // the glazing, set back 2.2 m in the open end; its inner reveal in the skin colour
    const gx = xe - 2.2, rIn = -2.4
    const atG = (th: number, dx: number): V3 => [dx, YC + (s.a + rIn) * Math.sin(th), s.zc + (s.b + rIn) * Math.cos(th)]
    for (let k = 0; k < NR; k++) {
      const t0 = (k / NR) * 2 * Math.PI, t1 = ((k + 1) / NR) * 2 * Math.PI, tm = (t0 + t1) / 2
      const inn = NRM(xe, tm).map((v) => -v) as V3
      skin.tri(atG(t0, xe - 1.9), atG(t1, xe - 1.9), atG(t1, gx), undefined, undefined, undefined, [inn, inn, inn])
      skin.tri(atG(t0, xe - 1.9), atG(t1, gx), atG(t0, gx), undefined, undefined, undefined, [inn, inn, inn])
      glass.tri([gx, YC, s.zc], atG(t0, gx), atG(t1, gx), undefined, undefined, undefined, [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
    }
    if (detail) {
      // mullions: a few bold bars across the glazing, as in p5 and p6
      const bar = (A: V3, B: V3) => {
        const w = 0.18, d: V3 = [0, B[1] - A[1], B[2] - A[2]], l = Math.hypot(d[1], d[2]), p: V3 = [0, -d[2] / l * w, d[1] / l * w]
        const x0 = gx + 0.05, x1 = gx + 0.25
        const P = (Q: V3, sgn: number, x: number): V3 => [x, Q[1] + p[1] * sgn, Q[2] + p[2] * sgn]
        gold.tri(P(A, -1, x1), P(B, -1, x1), P(B, 1, x1), undefined, undefined, undefined, [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
        gold.tri(P(A, -1, x1), P(B, 1, x1), P(A, 1, x1), undefined, undefined, undefined, [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
        void x0
      }
      for (const z of [0.35, 0.0, -0.4]) {
        const zz = s.zc + s.b * z, half = (s.a + rIn) * Math.sqrt(Math.max(0, 1 - ((zz - s.zc) / (s.b + rIn)) ** 2))
        bar([0, YC - half, zz], [0, YC + half, zz])
      }
      for (const yy of [-0.5, 0.0, 0.5]) {
        const y = YC + (s.a + rIn) * yy, half = (s.b + rIn) * Math.sqrt(Math.max(0, 1 - yy * yy))
        bar([0, y, s.zc - half], [0, y, s.zc + half])
      }
    }
  }

  // ---- the medallions: rows of eight-pointed stars on the roll ----
  {
    const rows = [0, -0.62, 0.62, -1.2, 1.2]
    const step = 4.0
    for (let x = XW + 5.0; x < XE - 3.5; x += step) {
      for (const th0 of rows) {
        const th = th0
        const s = section(x)
        const size = Math.min(1.6, 0.3 * Math.min(s.a, s.b) + 0.2)
        const c = ON(x, th, 0.04), n = NRM(x, th)
        // tangent frame: u along the roll, v round it
        const u: V3 = [1, 0, 0], v: V3 = [0, n[2], -n[1]]
        const P = (du: number, dv: number, out: number): V3 => [c[0] + u[0] * du + n[0] * out, c[1] + v[1] * dv + n[1] * out, c[2] + v[2] * dv + n[2] * out]
        if (detail) {
          // a true eight-pointed star: sixteen points, and its lighter centre
          const pts = Array.from({ length: 16 }, (_, i) => {
            const a = (i * Math.PI) / 8, r = i % 2 ? size * 0.62 : size
            return [r * Math.cos(a), r * Math.sin(a)] as [number, number]
          })
          for (let i = 0; i < 16; i++) {
            const A = pts[i], B = pts[(i + 1) % 16]
            medal.tri(P(0, 0, 0.02), P(A[0], A[1], 0.02), P(B[0], B[1], 0.02), undefined, undefined, undefined, [n, n, n])
          }
          const r = size * 0.35
          const sq = [[r, 0], [0, r], [-r, 0], [0, -r]]
          skin.tri(P(sq[0][0], sq[0][1], 0.05), P(sq[1][0], sq[1][1], 0.05), P(sq[2][0], sq[2][1], 0.05), undefined, undefined, undefined, [n, n, n])
          skin.tri(P(sq[0][0], sq[0][1], 0.05), P(sq[2][0], sq[2][1], 0.05), P(sq[3][0], sq[3][1], 0.05), undefined, undefined, undefined, [n, n, n])
        } else {
          // two overlapping squares, one turned 45 degrees
          const h = size * 0.72
          for (const [rot, out] of [[0, 0.02], [Math.PI / 4, 0.03]] as const) {
            const q = [0, 1, 2, 3].map((i) => { const a = rot + (i * Math.PI) / 2 + Math.PI / 4; return P(h * Math.SQRT2 * Math.cos(a), h * Math.SQRT2 * Math.sin(a), out) })
            medal.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
            medal.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
          }
        }
      }
    }
  }

  // ---- the ground floor under the roll, and the low wings ----
  {
    // a glazed band set back under the roll, wrapped in gold stripes
    const ZG = 5.4, HW = 6.2
    const band: XY[] = [[XW + 1.0, YC - HW], [XE - 1.5, YC - HW], [XE - 1.5, YC + HW], [XW + 1.0, YC + HW]]
    prism(glass, band, 0, ZG - 0.4, null)
    prism(plinth, band, ZG - 0.4, ZG, plinth, 0, false)
    for (let k = 0; k < 4; k++) {
      const z0 = 1.4 + k * 0.85
      prism(stripe, offset(band, 0.12), z0, z0 + 0.3, null, 0, true)
    }
    // the wings: low glazed pavilions, gold stripes along their fronts, a pale flat roof
    for (const [W, dz] of [[WEST, 2.6], [EAST, 0]] as Array<[XY[], number]>) {
      prism(plinth, W, 0, 1.0 + dz, null)
      prism(glass, offset(ccw(W), -0.3), 1.0 + dz, 4.6 + dz, null)
      for (let k = 0; k < 3; k++) {
        const z0 = 1.3 + dz + k * 1.0
        prism(stripe, offset(ccw(W), 0.05), z0, z0 + 0.25, null, 0, true)
      }
      prism(roofP, W, 4.6 + dz, 5.0 + dz, roofP, 0.12, true)
    }
  }
  return { skin, medal, gold, stripe, glass, plinth }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.6 ? 0.45 : 0.8)
    return [
      { part: p.skin, material: { ...finish('carpet-panel', 0xb3ada0, 0.5), floodlight: lit } },
      { part: p.medal, material: { ...finish('carpet-medallion', 0x6e6248, 0.55), floodlight: lit } },
      { part: p.gold, material: { ...finish('carpet-gold', 0xb89a52, 0.45), floodlight: () => 0.7 } },
      { part: p.stripe, material: { ...finish('neon-carpet-stripe', 0xb89a52, 0.45) } },
      { part: p.glass, material: PALETTE.window },
      { part: p.plinth, material: { ...finish('carpet-plinth', 0xb4b2aa) } },
    ]
  }
  const meta = { bearing: 10.5, osm: 'way/253082269', height: 19.2 }
  await writeModel('baku-carpet-museum.glb', 'Azerbaijan Carpet Museum', make(false), meta, 5000, 250 * 1024)
  await writeModel('baku-carpet-museum.detail.glb', 'Azerbaijan Carpet Museum', make(true), meta, 40000, 1536 * 1024)
}
