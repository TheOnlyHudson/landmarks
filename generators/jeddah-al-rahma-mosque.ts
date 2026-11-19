/**
 * Al-Rahma Mosque ("the Floating Mosque"), Jeddah — original procedural geometry, CC0-1.0.
 * bun generators/jeddah-al-rahma-mosque.ts
 *
 * Frame: map frame turned to BEARING 18, so local +x points to compass 108°,
 * the qibla from Jeddah (towards Mecca), the hall's axis; the
 * arcaded deck runs along local y, parallel to the corniche to the east. Origin = the
 * centroid of the OSM outline way/1258945369, at sea level.
 *
 * Evidence
 * - OSM way/1258945369 (building, under the mosque node/539501874 "مسجد
 *   الرحمة", Q12242734): a rough 41 m round outline, the prayer hall. The
 *   deck and its loggias are not mapped. The corniche footway runs ~85 m to
 *   the east (OSM way/1485777375), so the deck reaches the shore that way.
 * - Commons photos, all EVIDENCE:
 *   "Mosque on Water V2.jpg" (Ilmarry, CC BY-SA 4.0) — the hall from the
 *     water: chamfered walls, screen panels between white pilasters,
 *     arched windows, drum, low dome, minaret, piles;
 *     https://commons.wikimedia.org/wiki/File:Mosque_on_Water_V2.jpg
 *   "Floating Mosque, Jeddah (6573519583).jpg" (Sammy Six, CC BY 2.0) — the
 *     loggias with horseshoe arches and small domes, the minaret's stages;
 *     https://commons.wikimedia.org/wiki/File:Floating_Mosque,_Jeddah_(6573519583).jpg
 *   "Floating Mosque, Jeddah (6573503347).jpg" (Sammy Six, CC BY 2.0) — the
 *     arcade over the sea on paired piles;
 *     https://commons.wikimedia.org/wiki/File:Floating_Mosque,_Jeddah_(6573503347).jpg
 *   "Floating Mosque - Red Sea" (absolutraia, Flickr 17541333322 and
 *     17355816948, CC BY 2.0) — the entry stair from the beach, the minaret
 *     beside the arcade, the arcade running out over the sea;
 *     https://www.flickr.com/photos/8791753@N05/17541333322
 *   "Al-Rahmah Mosque 4.jpg", "Al-Rahmah Mosque 5.jpg", "Al-Rahmah Mosque 6.jpg"
 *     (Tahir mq, CC BY-SA 4.0) — the long deck, the loggia wing over the
 *     sea, the hall standing in the water with the low bridge to the shore;
 *     https://commons.wikimedia.org/wiki/File:Al-Rahmah_Mosque_4.jpg (and _5, _6)
 *   "Mezquita Al-Rahmah, Yeda, Arabia Saudita, 2025-05-19, DD 01.jpg",
 *     "… DD 03.jpg", "… DD 05.jpg" (Diego Delso, CC BY-SA 4.0) — the 2025
 *     state: the dome is now white; the minaret's zigzag corbels and lantern;
 *     the keyhole (horseshoe) arches of the loggias;
 *     https://commons.wikimedia.org/wiki/File:Mezquita_Al-Rahmah,_Yeda,_Arabia_Saudita,_2025-05-19,_DD_01.jpg
 *   "مئذنة مسجد الرحمة - جدة.jpg" / "المئذنة مسجد الرحمة - جدة.jpg" (Faisal
 *     Al-Abdullah, CC BY-SA 3.0) — the parapet merlons and the balcony;
 *     https://commons.wikimedia.org/wiki/File:%D8%A7%D9%84%D9%85%D8%A6%D8%B0%D9%86%D8%A9_%D9%85%D8%B3%D8%AC%D8%AF_%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D8%A9_-_%D8%AC%D8%AF%D8%A9.jpg
 *
 * Estimated (scaled from "Mosque on Water" with the hall 36 m across flats,
 * the OSM outline's size): the deck 3.0 m above the water on piles; hall
 * walls 9.4 m with a 1 m frieze and merlons; a 9.3 m drum 1.6 m high with a
 * window band; a low segmental dome 18 m across rising 5 m; the minaret at
 * the hall's north-east corner, where the deck meets it (beside the arcade
 * in every shore photo), 35.6 m to the finial (lower box 15.6–17.4 m,
 * octagonal shaft, zigzag corbel balcony 25.4–27.8 m, open lantern to
 * 31.5 m, cap and small dome to 35, finial). The loggia deck 18 m wide
 * along the hall's shore (east) side, from 30 m south of the hall's centre
 * to 68 m north of it, the north part standing out over the sea; loggias
 * along its east side, along its west side north of the hall and across its
 * north end; bays 4.4 m,
 * arches 4.4 m to the crown, horseshoe arcs (240°) on jambs, a small dome
 * over each outer bay; the low bridge to the corniche 4 m wide. Hall and deck
 * plan are regularised: the hall a regular octagon on the OSM centre.
 *
 * Colour: the whole hall is white in the 2025 photos (Delso DD 01); the
 * screen panels are drawn near-white (#ebe6dc), a touch warmer than the
 * white (#f3f0e8) so they still read as panels. The loggias carry a solid
 * roof slab with a continuous parapet over the arches in both LODs.
 *
 * Elevation 0: the piles stand on the water (y = 0) and are modelled.
 *
 * Doubts: no licensed aerial — the deck's extent and the wings' lengths are
 * read from oblique photos and are the weakest part; the dome was pale blue
 * until it was repainted white (2025 photos show white, used here).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, earcut, oq, ot, triCount, type P2 } from './riyadh-kingdom-centre'

const BEARING = 18
const ANCHOR = { lng: 39.1008286, lat: 21.648718 }

const DECK = 3.0 // deck top above the water
const HALL_C: P2 = [3, 2.5], APO = 18 // hall centre, apothem
const WALL = 9.4, FRIEZE = 1.0
const BAY = 4.4

function build(detail: boolean) {
  const white = new Part(), screen = new Part(), win = new Part(), conc = new Part()
  const SEGC = detail ? 16 : 10 // segments round a full circle

  // ---------- helpers ----------
  /** An unbevelled turned box: four sides and a top (the low model's pilasters and bands). */
  const pbox = (p: Part, cx: number, cy: number, hx: number, hy: number, za: number, zb: number, _bev: number, rot: number) => {
    if (detail) return box(p, cx, cy, hx, hy, za, zb, _bev, rot)
    const c = Math.cos(rot), s = Math.sin(rot)
    const r = (z: number): V3[] => ([[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]] as P2[]).map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c, z] as V3)
    p.loft([r(za), r(zb)]); p.cap(r(zb), true)
  }
  const cyl = (p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 8, top = true) => {
    const ring = (z: number) => Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n), z] as V3)
    const a = ring(z0), b = ring(z1)
    p.loft([a, b]); if (top) p.cap(b, true)
  }
  /** Dome (segmental or hemispherical) over a circle of radius rb at z, rising h, smooth-shaded. */
  const dome = (p: Part, cx: number, cy: number, rb: number, z: number, h: number, nA: number, nR: number) => {
    const R = (rb * rb + h * h) / (2 * h), zc = z + h - R, th0 = Math.asin(Math.min(1, rb / R))
    const P = (i: number, j: number): [V3, V3] => {
      const th = th0 * (1 - j / nR), ph = (2 * Math.PI * i) / nA
      const n: V3 = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
      return [[cx + R * n[0], cy + R * n[1], zc + R * n[2]], n]
    }
    for (let j = 0; j < nR; j++) for (let i = 0; i < nA; i++) {
      const [a, na] = P(i, j), [b, nb] = P(i + 1, j), [c, nc] = P(i + 1, j + 1), [d, nd] = P(i, j + 1)
      if (j === nR - 1) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      else { p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc]); p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd]) }
    }
  }
  /** Extrude a CCW polygon given in a vertical plane: u along `t`, v up; depth along `n` (front at +d/2). */
  const slabPoly = (p: Part, o: V3, t: P2, shape: P2[], d: number, skip?: (A: P2, B: P2) => boolean) => {
    const n: P2 = [t[1], -t[0]] // right of t = front
    const P = ([u, v]: P2, s: number): V3 => [o[0] + t[0] * u + n[0] * s, o[1] + t[1] * u + n[1] * s, o[2] + v]
    for (const [i, j, k] of earcut(shape)) {
      ot(p, P(shape[i], d / 2), P(shape[j], d / 2), P(shape[k], d / 2), [n[0], n[1], 0])
      ot(p, P(shape[i], -d / 2), P(shape[j], -d / 2), P(shape[k], -d / 2), [-n[0], -n[1], 0])
    }
    for (let i = 0; i < shape.length; i++) {
      const A = shape[i], B = shape[(i + 1) % shape.length], eu = B[0] - A[0], ev = B[1] - A[1]
      if (skip?.(A, B)) continue
      oq(p, P(A, d / 2), P(B, d / 2), P(B, -d / 2), P(A, -d / 2), [t[0] * ev, t[1] * ev, -eu])
    }
  }

  // ---------- the arcade wall: horseshoe arches between piers ----------
  /**
   * A straight arcade from a (start) along t for `n` bays, standing on z0,
   * height H, thickness th. Each bay is cut into two simple halves so the
   * arch is a real opening: jambs, then a 240° horseshoe arc.
   */
  const arcade = (a: P2, t: P2, n: number, z0: number, H: number, th: number) => {
    const pier = 0.9, r = (BAY - pier) / 2 + 0.2, spring = 2.7 // circle centre height
    const jamb = r * Math.cos(Math.PI / 6) // half-width at the cusps
    const nArc = detail ? 8 : 3 // segments per half arc (120°)
    for (let k = 0; k < n; k++) {
      const xc = BAY * (k + 0.5)
      for (const side of [-1, 1]) {
        // half bay: from the bay edge to the centre line
        const pts: P2[] = []
        const edge = side < 0 ? BAY * k : BAY * (k + 1)
        const jz = spring - r * Math.sin(Math.PI / 6)
        if (side < 0) {
          pts.push([edge, 0], [xc - jamb, 0], [xc - jamb, jz])
          for (let s = 1; s <= nArc; s++) { const ang = (210 - (120 * s) / nArc) * (Math.PI / 180); pts.push([xc + r * Math.cos(ang), spring + r * Math.sin(ang)]) }
          pts.push([xc, H], [edge, H])
        } else {
          pts.push([xc + jamb, 0], [edge, 0], [edge, H], [xc, H])
          for (let s = 0; s < nArc; s++) { const ang = (90 - (120 * s) / nArc) * (Math.PI / 180); pts.push([xc + r * Math.cos(ang), spring + r * Math.sin(ang)]) }
          pts.push([xc + r * Math.cos(-Math.PI / 6), spring + r * Math.sin(-Math.PI / 6)])
        }
        // drop the duplicate apex point on the left half (arc ends at the crown already)
        const clean = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-6)
        // faces on the centre line and on inner pier joints are hidden inside the wall
        const inner = (A: P2, B: P2) => Math.abs(A[0] - B[0]) < 1e-6 && (Math.abs(A[0] - xc) < 1e-6 || (Math.abs(A[0] - edge) < 1e-6 && edge > 1e-6 && edge < n * BAY - 1e-6))
        slabPoly(white, [a[0], a[1], z0], t, clean, th, inner)
      }
    }
  }

  // ---------- piles and deck ----------
  const pile = (x: number, y: number) => cyl(conc, x, y, 0.45, 0, DECK - 0.7, detail ? 10 : 6, false)
  const deckSlab = (x0: number, x1: number, y0: number, y1: number) => {
    box(white, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, DECK - 0.8, DECK, 0.15)
    const nx = Math.max(1, Math.round((x1 - x0) / 6)), ny = Math.max(1, Math.round((y1 - y0) / 6))
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
      if (!detail && i > 0 && i < nx && j > 0 && j < ny) continue
      pile(x0 + 0.8 + ((x1 - x0 - 1.6) * i) / nx, y0 + 0.8 + ((y1 - y0 - 1.6) * j) / ny)
    }
  }

  // ---------- the prayer hall ----------
  const [hx, hy] = HALL_C
  const oct: P2[] = Array.from({ length: 8 }, (_, k) => {
    const a = (Math.PI / 8) * (2 * k - 1), R = APO / Math.cos(Math.PI / 8)
    return [hx + R * Math.cos(a), hy + R * Math.sin(a)]
  })
  // hall deck: an octagon 2 m wider, on piles
  {
    const big: P2[] = oct.map(([x, y]) => [hx + (x - hx) * (APO + 2) / APO, hy + (y - hy) * (APO + 2) / APO])
    for (let k = 0; k < 8; k++) {
      const a = big[k], b = big[(k + 1) % 8]
      oq(white, [a[0], a[1], DECK - 0.8], [b[0], b[1], DECK - 0.8], [b[0], b[1], DECK], [a[0], a[1], DECK], [Math.cos((Math.PI / 4) * k), Math.sin((Math.PI / 4) * k), 0])
    }
    for (let i = 1; i < 7; i++) {
      ot(white, [big[0][0], big[0][1], DECK], [big[i][0], big[i][1], DECK], [big[i + 1][0], big[i + 1][1], DECK], [0, 0, 1])
      ot(white, [big[0][0], big[0][1], DECK - 0.8], [big[i][0], big[i][1], DECK - 0.8], [big[i + 1][0], big[i + 1][1], DECK - 0.8], [0, 0, -1])
    }
    for (let k = 0; k < 8; k++) { const [x, y] = big[k]; pile(hx + (x - hx) * 0.93, hy + (y - hy) * 0.93) }
    if (detail) for (let k = 0; k < 8; k++) { const [x, y] = big[k]; pile(hx + (x - hx) * 0.5, hy + (y - hy) * 0.5) }
  }
  const z0 = DECK, zTop = DECK + WALL
  // core walls (white), roof
  for (let k = 0; k < 8; k++) {
    const a = oct[k], b = oct[(k + 1) % 8], ang = (Math.PI / 4) * k, n: V3 = [Math.cos(ang), Math.sin(ang), 0]
    for (const [za, zb] of [[z0, z0 + 4.7], [z0 + 4.7, zTop]]) oq(white, [a[0], a[1], za], [b[0], b[1], za], [b[0], b[1], zb], [a[0], a[1], zb], n)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const at = (u: number, z: number, off: number): V3 => [a[0] + t[0] * u + n[0] * off, a[1] + t[1] * u + n[1] * off, z]
    // pilasters at both ends and frieze band, proud of the wall
    const PR = 0.35
    for (const u of [0.6, L - 0.6]) pbox(white, a[0] + t[0] * u + n[0] * PR / 2, a[1] + t[1] * u + n[1] * PR / 2, 0.6, PR / 2 + 0.01, z0, zTop - FRIEZE, 0.08, ang + Math.PI / 2)
    pbox(white, a[0] + t[0] * L / 2 + n[0] * PR / 2, a[1] + t[1] * L / 2 + n[1] * PR / 2, L / 2 + 0.1, PR / 2 + 0.01, zTop - FRIEZE, zTop + 0.2, 0.08, ang + Math.PI / 2)
    // base plinth
    pbox(white, a[0] + t[0] * L / 2 + n[0] * 0.15, a[1] + t[1] * L / 2 + n[1] * 0.15, L / 2, 0.16, z0, z0 + 0.7, 0.05, ang + Math.PI / 2)
    const main = k % 2 === 0
    // panels: screens and windows set just on the wall
    const flat = (p: Part, u0: number, u1: number, za: number, zb: number) => oq(p, at(u0, za, 0.04), at(u1, za, 0.04), at(u1, zb, 0.04), at(u0, zb, 0.04), n)
    const arched = (p: Part, uc: number, w: number, za: number, zs: number) => {
      // a round-headed window: rectangle to the springing, then a semicircle
      flat(p, uc - w / 2, uc + w / 2, za, zs)
      const N = detail ? 8 : 5
      for (let s = 0; s < N; s++) {
        const a0 = (Math.PI * s) / N, a1 = (Math.PI * (s + 1)) / N
        ot(p, at(uc, zs, 0.04), at(uc + (w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0), 0.04), at(uc + (w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1), 0.04), n)
      }
    }
    if (main) {
      arched(win, L / 2, 2.6, z0 + 1.2, z0 + 5.6)
      for (const s of [-1, 1]) {
        flat(screen, L / 2 + s * 2.0, L / 2 + s * 5.4, z0 + 1.0, zTop - FRIEZE - 0.5)
        arched(win, L / 2 + s * 6.25, 0.9, z0 + 2.5, z0 + 6.2)
      }
    } else {
      flat(screen, 1.6, L - 1.6, z0 + 1.0, zTop - FRIEZE - 0.5)
    }
  }
  // roof
  for (let i = 1; i < 7; i++) ot(white, [oct[0][0], oct[0][1], zTop], [oct[i][0], oct[i][1], zTop], [oct[i + 1][0], oct[i + 1][1], zTop], [0, 0, 1])
  // parapet merlons (detail model only; the low model keeps the frieze band)
  if (detail) {
    const shape: P2[] = detail
      ? [[-0.45, 0], [0.45, 0], [0.45, 0.5], [0.3, 0.5], [0.3, 0.85], [0.12, 1.05], [-0.12, 1.05], [-0.3, 0.85], [-0.3, 0.5], [-0.45, 0.5]]
      : [[-0.45, 0], [0.45, 0], [0.45, 0.6], [0, 1.0], [-0.45, 0.6]]
    for (let k = 0; k < 8; k++) {
      const a = oct[k], b = oct[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const ang = (Math.PI / 4) * k, n: P2 = [Math.cos(ang), Math.sin(ang)]
      const m = Math.floor(L / 1.25)
      for (let i = 0; i < m; i++) {
        const u = (L * (i + 0.5)) / m
        slabPoly(white, [a[0] + t[0] * u + n[0] * 0.15, a[1] + t[1] * u + n[1] * 0.15, zTop + 0.2], t, shape.map(([x, y]) => [x, y] as P2), 0.35)
      }
    }
  }
  // drum with its window band, and the low dome
  {
    const RD = 9.3, zd = zTop, zd1 = zTop + 1.8
    cyl(white, hx, hy, RD, zd, zd1, SEGC * 2, false)
    const nW = detail ? 16 : 8
    for (let i = 0; i < nW; i++) {
      const a0 = (2 * Math.PI * (i + 0.18)) / nW, a1 = (2 * Math.PI * (i + 0.82)) / nW
      const P = (a: number, z: number): V3 => [hx + (RD + 0.04) * Math.cos(a), hy + (RD + 0.04) * Math.sin(a), z]
      oq(win, P(a0, zd + 0.5), P(a1, zd + 0.5), P(a1, zd1 - 0.3), P(a0, zd1 - 0.3), [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
    }
    // a small lip, then the dome
    cyl(white, hx, hy, RD + 0.35, zd1, zd1 + 0.35, SEGC * 2, true)
    dome(white, hx, hy, RD, zd1 + 0.35, 5.0, SEGC * 2, detail ? 8 : 5)
    cyl(white, hx, hy, 0.12, zd1 + 5.3, zd1 + 6.8, 6) // finial rod
  }

  // ---------- the minaret on the hall's north side ----------
  {
    const mx = hx + APO * 0.62, my = hy + APO * 0.62
    const oct8 = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => [mx + r * Math.cos((Math.PI / 8) * (2 * k + 1)), my + r * Math.sin((Math.PI / 8) * (2 * k + 1)), z] as V3)
    const prism8 = (r: number, za: number, zb: number) => { white.loft([oct8(r, za), oct8(r, zb)]); white.cap(oct8(r, zb), true) }
    // square base from the deck to the lower box, the box with its zigzag skirt
    box(white, mx, my, 1.7, 1.7, DECK - 0.8, 15.6, 0.1)
    box(white, mx, my, 2.2, 2.2, 15.6, 17.4, 0.12)
    // shaft
    prism8(1.45, 17.4, 25.4)
    // slit windows up the shaft (detail)
    if (detail) for (const z of [19.5, 22.5]) for (let k = 0; k < 8; k += 2) {
      const a = (Math.PI / 8) * (2 * k + 2), c = Math.cos(a), s = Math.sin(a), r = 1.45 * Math.cos(Math.PI / 8) + 0.03
      oq(win, [mx + r * c - 0.12 * s, my + r * s + 0.12 * c, z], [mx + r * c + 0.12 * s, my + r * s - 0.12 * c, z], [mx + r * c + 0.12 * s, my + r * s - 0.12 * c, z + 0.9], [mx + r * c - 0.12 * s, my + r * s + 0.12 * c, z + 0.9], [c, s, 0])
    }
    // the zigzag corbel balcony: an inverted frustum with a ring of hanging points
    white.loft([oct8(1.45, 25.4), oct8(2.15, 27.2)])
    prism8(2.15, 27.2, 28.2)
    const nZ = detail ? 24 : 12
    for (const [zr, rr] of (detail ? [[25.4, 1.85], [26.3, 2.05]] : [[25.8, 1.95]]) as [number, number][]) {
      for (let i = 0; i < nZ; i++) {
        const a = (2 * Math.PI * (i + (zr > 26 ? 0.5 : 0))) / nZ, w = (Math.PI * 2 * rr) / nZ / 2
        const c = Math.cos(a), s = Math.sin(a)
        const top: V3[] = [[mx + rr * c - w * s, my + rr * s + w * c, zr + 1.0], [mx + (rr + 0.25) * c, my + (rr + 0.25) * s, zr + 1.0], [mx + rr * c + w * s, my + rr * s - w * c, zr + 1.0]]
        const tip: V3 = [mx + (rr + 0.05) * c, my + (rr + 0.05) * s, zr]
        ot(white, top[0], top[1], tip, [c - s, s + c, -0.3]); ot(white, top[1], top[2], tip, [c + s, s - c, -0.3])
      }
    }
    // the open lantern: columns, a stepped cap, a small dome, the finial
    const nCol = detail ? 8 : 4
    for (let k = 0; k < nCol; k++) {
      const a = (2 * Math.PI * (k + 0.5)) / nCol
      cyl(white, mx + 1.45 * Math.cos(a), my + 1.45 * Math.sin(a), 0.18, 28.2, 30.6, 6, false)
    }
    prism8(0.9, 28.2, 30.6) // the core seen through the columns
    prism8(1.85, 30.6, 31.5)
    prism8(1.55, 31.5, 32.4)
    dome(white, mx, my, 1.4, 32.4, 1.6, SEGC, detail ? 5 : 3)
    cyl(white, mx, my, 0.09, 33.9, 35.6, 6)
    if (detail) cyl(white, mx, my, 0.22, 35.0, 35.4, 8) // the finial's bulb
  }

  // ---------- the loggia deck along the shore side of the hall ----------
  {
    const LOG = 3.6, H = 5.4
    const xa = hx + APO + 0.5, xb = xa + 18 // the deck, east of the hall
    const ya = hy - 30, yb = hy + 68 // south end, north end over the sea
    deckSlab(xa, xb, ya, yb)
    // the low bridge from the deck to the corniche
    deckSlab(xb, xb + 24, hy + 8, hy + 12)
    /** A loggia: two parallel arch walls LOG apart, a roof slab and a small dome per bay. */
    const loggia = (a: P2, t: P2, n: number) => {
      const o: P2 = [-t[1], t[0]] // inward (left of t)
      arcade(a, t, n, DECK, H, 0.6)
      // the inner side: a second arch wall in the detail model, plain piers in the low one
      if (detail) arcade([a[0] + o[0] * LOG, a[1] + o[1] * LOG], t, n, DECK, H, 0.6)
      else for (let k = 0; k <= n; k++) pbox(white, a[0] + t[0] * BAY * k + o[0] * LOG, a[1] + t[1] * BAY * k + o[1] * LOG, 0.45, 0.3, DECK, DECK + H, 0, Math.atan2(t[1], t[0]))
      const len = n * BAY, cx = a[0] + t[0] * len / 2 + o[0] * LOG / 2, cy = a[1] + t[1] * len / 2 + o[1] * LOG / 2
      // a solid roof slab over both arch walls, with a continuous parapet band round it
      const rot = Math.atan2(t[1], t[0])
      box(white, cx, cy, len / 2 + 0.3, LOG / 2 + 0.6, DECK + H - 0.2, DECK + H + 1.0, 0.12, rot)
      for (const side of [-1, 1]) {
        const px = cx + o[0] * side * (LOG / 2 + 0.45), py = cy + o[1] * side * (LOG / 2 + 0.45)
        pbox(white, px, py, len / 2 + 0.3, 0.15, DECK + H + 1.0, DECK + H + 1.6, 0.05, rot)
      }
      for (let k = 0; k < n; k++) dome(white, a[0] + t[0] * BAY * (k + 0.5) + o[0] * LOG / 2, a[1] + t[1] * BAY * (k + 0.5) + o[1] * LOG / 2, 1.55, DECK + H + 1.0, 1.4, detail ? 12 : 6, detail ? 4 : 2)
    }
    // east row, facing the shore, full length (front = right of t = east, so t points north)
    const nE = Math.floor((yb - ya - 1.2) / BAY)
    loggia([xb - 0.6, ya + 0.6], [0, 1], nE)
    // west row, facing the sea, north of the hall only
    const yN0 = hy + APO + 2, nW = Math.floor((yb - 0.6 - yN0) / BAY)
    loggia([xa + 0.6, yb - 0.6], [0, -1], nW)
    // the north end, across the deck over the sea
    const nN = Math.floor((xb - xa - 2 * LOG - 1.2) / BAY)
    if (nN > 0) loggia([xb - LOG - 0.6, yb - 0.6], [-1, 0], nN)
  }

  return [
    { part: white, material: { ...finish('mosque-white', 0xf3f0e8), floodlight: (p: V3, n: V3) => (p[2] > DECK && Math.abs(n[2]) < 0.6 ? 0.8 : 0.2) } },
    { part: screen, material: finish('mosque-screen', 0xebe6dc) },
    { part: win, material: PALETTE.window },
    { part: conc, material: finish('pile-concrete', 0x8f928f) },
  ]
}

for (const [file, detail, maxTri, maxBytes] of [['jeddah-al-rahma-mosque.glb', false, 6500, 256000], ['jeddah-al-rahma-mosque.detail.glb', true, 40000, 1536 * 1024]] as const) {
  const parts = build(detail)
  const triangles = triCount(parts)
  if (triangles > maxTri) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Al-Rahma Mosque', parts, {
    license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 35.6,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/1258945369'],
  })
  if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
