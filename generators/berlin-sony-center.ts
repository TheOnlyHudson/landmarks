/**
 * Sony Center, now "Das Center am Potsdamer Platz" (Helmut Jahn,
 * Murphy/Jahn, 1996-2000; roof engineered with Ove Arup, built by
 * Waagner-Biro), Berlin-Tiergarten: original procedural geometry, CC0-1.0.
 * bun generators/berlin-sony-center.ts
 * Imports helpers from berlin-philharmonie.ts (merge that first).
 * Writes models/berlin-sony-center.glb (low) and .detail.glb (detail).
 *
 * Map frame, BEARING 0: +x east, +y north, z up, metres. z = 0 the forum
 * floor and the streets round the block (Mapterhorn: flat to about 1 m).
 * Origin = the area centroid of OSM way/183272253 (landuse=retail, the
 * complex), 13.373010 52.510040.
 *
 * What makes it the Sony Center, and how each is drawn
 * - The forum roof, "Mount Fuji": an elliptical steel ring truss (102 x 73
 *   m) resting on the buildings round the oval forum, and inside it a cone
 *   of 24 white fabric petals with glass strips between them, rising
 *   steeply to a glass funnel and the hub ring at 67 m. The hub sits off
 *   centre, towards the east end, so the cone is oblique: short and steep
 *   on the east, long and flat on the west. All real 3D: the ring is a
 *   triangulated truss of three chords with diagonals (the low model draws
 *   the fabric and glass from above only); each petal is
 *   folded along its middle; the mast hangs from the hub, and in the
 *   detail model the cables fan from its foot to the ring, and run along
 *   the petal seams and round the cone.
 * - The glass office buildings round the forum, as OSM maps them: green-
 *   tinted curtain walls with steel floor bands every two storeys.
 * - The white Esplanade Residence on the east, with its punched windows,
 *   and the remains of the Hotel Esplanade (Kaisersaal and breakfast room)
 *   beside it.
 *
 * - The Bahn Tower (way/11080117, 103 m, 26 storeys): OSM leaves it outside
 *   the complex's landuse outline, but it is Jahn's tower at the tip of the
 *   Center's triangle and one of its seven buildings (de.wikipedia), so it
 *   is drawn here: the D-shaped glass shaft, its open glass crown and the
 *   red DB sign (a plain box).
 * - The glass: dark grey-blue (#5f7378) under a light steel grid of
 *   transoms every two storeys (three in the low model) and mullions every
 *   3 m (8 m in the low model), as strips standing 0.2 m proud.
 *
 * Not modelled: the Kaisersaal's glass enclosure is left out; its two rooms
 *   are drawn as white blocks.
 *
 * Sources
 * - OSM way/183272253 (the complex, wikidata Q641108); the buildings
 *   way/13649540 (13 levels), way/13649546 "Sony Europa Zentrale" (12),
 *   way/13649548 (12), way/216228631 "Sony Professional Center" (11),
 *   way/13650706 and way/191513736 (39 m), way/49679774 (39 m), the
 *   Bahntower way/11080117 (103 m, 26 levels), the
 *   Esplanade remains way/13671389 and way/49679775 (2 levels), the forum
 *   pavilion way/1445633279; the roof: the hub way/13648222 (67 m) and 24
 *   petals way/13655225-236 and way/191513708-735 (building=roof, 40-50 m
 *   skillion), whose outer ends give the ring (least-squares ellipse:
 *   centre 18.7, -7.2; semi-axes 49.7 and 36.6 m; major axis at 151.8
 *   degrees from east). (c) OpenStreetMap contributors, ODbL.
 * - Published: de.wikipedia "Sony Center" (roof up to 67 m high and 102 m
 *   long; fabric and 3,500 m^2 of glass; steel ring on the buildings;
 *   seven buildings; Kaisersaal moved 75 m).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Le Sony Center et la Philharmonie (Berlin) (9620372847).jpg",
 *     Jean-Pierre Dalbéra, CC BY 2.0 (from the east, high: the ring truss,
 *     the petals and glass strips, the funnel and hub, the buildings),
 *     https://commons.wikimedia.org/wiki/File:Le_Sony_Center_et_la_Philharmonie_(Berlin)_(9620372847).jpg
 *   "Berlin Sony Center von unten.jpg", Jürgen Striewski, CC BY-SA 4.0 (the
 *     ring truss, mast and cables from the forum),
 *   "Roof of the Sony Center photo1.JPG", Alf van Beem, CC0 (petals, glass
 *     strips, cables close up),
 *   "Berlin Kulturforum Sony Center dk0875.jpg", DrKssn, CC BY-SA 3.0 (from
 *     the west, Kemperplatz: the buildings and the cone above them),
 *   "Sony Center Roof Berlin 2015.jpg", Perituss, CC0 (from the
 *     south-west, far),
 *   "Sony Center, Berlin-Mitte, 150607, ako.jpg", Ansgar Koreng,
 *     CC BY-SA 3.0 de (the curved glass fronts, green-tinted glass),
 *   "SonyCenterAtNight.jpg", Andreas Tille, CC BY-SA 4.0 (the lit roof);
 *   "Hochhäuser am Potsdamer Platz, Berlin, 141209, ako.jpg", Ansgar
 *     Koreng, CC BY 4.0 (the Bahn Tower's crown and DB sign).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: every plan line, the ring ellipse, the hub position, the 39 m
 *   buildings.
 * - Published: 67 m to the hub, 102 m long.
 * - Estimated: the Bahn Tower's roof (98 m) under its 5 m crown screen;
 *   the untagged heights from the photos, where the ring
 *   truss stands above every building of the ring (13 levels 43 m, 12
 *   levels 41.5, 11 levels 40; OSM's 39 m kept where tagged), the ring truss (40.5-45 m, 4.4 m wide), the petal profile
 *   (rising 45 to 59 m, slightly concave), the funnel (radius 12 to 6 m,
 *   59 to 66 m), the mast foot (26 m), the Esplanade remains (12 m).
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { welded, ccw, type XY } from './berlin-reichstag'
import { polyPrism, edgePanel, mat } from './berlin-philharmonie'
import { tube } from './nyc-columbus-monument'

export const BEARING = 0
type Q = { detail: boolean }
const LOW: Q = { detail: false }
const HIGH: Q = { detail: true }

// The ring ellipse and the hub.
const EC: XY = [18.69, -7.2], EU: XY = [-0.8817, 0.4718], EV: XY = [0.4718, 0.8817], EA = 49.65, EB = 36.57
const HUB: XY = [30.2, -14.4]
const ell = (th: number, k = 1): XY => [EC[0] + k * (EA * Math.cos(th) * EU[0] + EB * Math.sin(th) * EV[0]), EC[1] + k * (EA * Math.cos(th) * EU[1] + EB * Math.sin(th) * EV[1])]

type B = { id: string; h: number; kind: 'glass' | 'white' | 'stone'; r: XY[] }
/** The Bahn Tower, way/11080117: 26 storeys, 103 m (published), D-shaped plan. */
const BAHN: B = { id: 'way/11080117', h: 98, kind: 'glass', r: [[104.4, -34.9], [152.5, -28.7], [161.2, -27.7], [161.7, -31.0], [162.2, -34.5], [167.9, -33.6], [167.0, -36.1], [165.4, -38.8], [163.7, -41.4], [159.9, -45.6], [156.2, -48.5], [152.1, -51.3], [146.5, -53.3], [139.7, -54.8], [132.9, -54.8], [125.5, -53.3], [120.0, -51.1], [115.0, -47.8], [109.3, -42.5], [107.0, -39.6]] }
const BUILDINGS: B[] = [
  { id: 'way/13649540', h: 43, kind: 'glass', r: [[-74.6, -51.6], [-48.9, -48.0], [-47.8, -48.3], [-39.2, -58.1], [-30.7, -64.5], [-25.0, -67.5], [-71.1, -73.3]] },
  { id: 'way/13649546', h: 41.5, kind: 'glass', r: [[-72.7, 73.9], [-96.0, 85.1], [-89.1, 40.7], [-65.4, 27.9]] },
  { id: 'way/13649548', h: 41.5, kind: 'glass', r: [[-86.4, 23.6], [-62.4, 10.0], [-56.5, -28.4], [-63.8, -29.7], [-60.6, -49.5], [-74.6, -51.6]] },
  { id: 'way/13650706', h: 39, kind: 'glass', r: [[-41.6, 23.8], [-34.8, 33.0], [-30.0, 37.3], [-24.3, 41.0], [-19.7, 43.1], [-13.3, 45.1], [-1.1, 47.1], [13.1, 46.8], [19.7, 45.9], [29.2, 43.2], [39.0, 38.9], [45.9, 34.7], [52.1, 29.8], [35.2, 21.4], [32.7, 18.0], [26.9, 20.7], [20.8, 22.7], [14.8, 23.8], [9.0, 24.2], [10.2, 28.7], [7.8, 28.9], [8.1, 35.6], [-4.6, 35.0], [-3.6, 28.4], [-6.0, 28.1], [-4.7, 22.0], [-10.7, 20.3], [-15.7, 17.4], [-20.5, 23.5], [-24.0, 20.0], [-26.9, 15.8]] },
  { id: 'way/49679774', h: 39, kind: 'white', r: [[72.5, -2.5], [78.3, -4.7], [79.0, -3.0], [68.4, 2.6], [64.3, 0.5], [69.8, -0.3], [67.8, -16.1], [57.6, -14.7], [58.8, -2.3], [55.4, -11.1], [40.1, 13.0], [66.5, 24.1], [137.1, -13.8], [132.7, -22.0], [117.7, -23.9], [82.5, -4.9], [82.0, -6.1], [85.3, -7.5], [79.0, -24.4], [67.5, -20.2], [72.1, -8.7], [70.2, -8.0]] },
  { id: 'way/191513736', h: 39, kind: 'glass', r: [[-41.1, 23.5], [-27.5, 16.1], [-29.5, 11.4], [-30.4, 7.3], [-15.3, 12.1], [-16.4, 9.9], [-18.3, 2.7], [-18.1, -2.9], [-14.9, -12.9], [-10.8, -20.7], [-16.9, -26.3], [-10.3, -32.4], [-7.4, -28.6], [-0.1, -33.4], [4.0, -35.4], [2.3, -39.9], [11.6, -43.0], [12.8, -37.7], [23.9, -39.0], [32.0, -38.5], [43.1, -35.3], [48.7, -31.0], [51.8, -35.3], [56.4, -29.3], [88.3, -46.3], [84.5, -53.4], [-8.6, -65.3], [-3.8, -54.0], [-15.7, -47.6], [-23.8, -41.2], [-31.5, -33.1], [-32.3, -33.6], [-38.7, -24.1], [-44.0, -12.9], [-46.7, -2.2], [-45.9, -2.1], [-46.1, 7.0], [-44.0, 17.0]] },
  { id: 'way/216228631', h: 40, kind: 'glass', r: [[-96.0, 85.1], [-72.7, 73.9], [-31.1, 51.5], [-15.1, 61.2], [-27.6, 72.2], [-42.7, 82.6], [-57.4, 90.4], [-68.8, 95.1], [-77.6, 98.0], [-86.4, 100.3], [-98.9, 102.6]] },
  { id: 'way/13671389', h: 12, kind: 'stone', r: [[86.9, -7.2], [111.3, -20.5], [108.7, -25.2], [108.2, -24.9], [107.9, -25.5], [84.1, -12.2]] },
  { id: 'way/49679775', h: 12, kind: 'stone', r: [[86.6, -13.5], [79.0, -27.3], [79.5, -27.6], [78.6, -29.2], [92.3, -36.5], [94.1, -34.0], [94.9, -34.4], [101.6, -22.0]] },
  { id: 'way/1445633279', h: 5, kind: 'glass', r: [[5.7, -12.7], [4.6, -14.4], [1.1, -16.2], [-0.8, -16.2], [-4.1, -14.7], [0.9, -10.2], [-1.7, -4.8], [2.1, -4.8], [3.9, -5.7], [6.0, -8.9]] },
]

/** Ring truss heights; petal and funnel profile. */
const ZR0 = 40.5, ZR1 = 45.0, ZP0 = 45.3, ZP1 = 59.0, RI = 12.0, ZT = 64.0, RT = 6.5, ZH = 67.0, ZM = 26.0
const NP = 24

export function build(Q: Q) {
  const glassW = new Part(), memb = new Part(), steel = new Part(), glass = new Part(), roof = new Part(), sign = new Part()
  const D = Q.detail

  // ===== Buildings ===========================================================
  for (const b of BUILDINGS) {
    const r = ccw(b.r)
    const wall = b.kind === 'glass' ? glassW : memb
    polyPrism(wall, roof, r, 0, b.h)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], c = r[(i + 1) % r.length], L = Math.hypot(c[0] - a[0], c[1] - a[1])
      if (L < 2) continue
      const ux = (c[0] - a[0]) / L, uy = (c[1] - a[1]) / L, nx = uy, ny = -ux
      if (b.kind === 'glass') {
        // The light metal grid on the dark glass: transoms every two storeys (7.6 m),
        // flat strips 0.35 m tall, 0.2 m proud of the glass.
        if (L > 3) for (let z = D ? 7.6 : 11.4; z < b.h - 1; z += D ? 7.6 : 11.4) {
          const d = 0.2, t = 0.35
          steel.quad([a[0] + nx * d, a[1] + ny * d, z], [c[0] + nx * d, c[1] + ny * d, z], [c[0] + nx * d, c[1] + ny * d, z + t], [a[0] + nx * d, a[1] + ny * d, z + t])
        }
      } else if (b.kind === 'white') {
        // The Esplanade Residence: punched windows grouped two storeys high.
        const n = Math.floor(L / 3.4)
        for (let k = 0; k < n; k++) {
          const s = (L - n * 3.4) / 2 + k * 3.4
          for (let z = 4.2; z + 6.0 < b.h - 1.5; z += 7.6) edgePanel(glassW, a, c, s + 0.7, s + 2.7, z, z + 6.0)
        }
      } else {
        // The Esplanade's round-headed windows, as tall panels.
        const n = Math.floor(L / 4.2)
        for (let k = 0; k < n; k++) {
          const s = (L - n * 4.2) / 2 + k * 4.2
          edgePanel(glassW, a, c, s + 1.0, s + 3.2, 1.5, 9.5)
        }
      }
    }
  }

  // ===== Mullions: every 6 m (3 m in the detail model) along each glass front ==========
  for (const b of [...BUILDINGS, BAHN]) {
    if (b.kind !== 'glass' || b.h < 10) continue
    const r = ccw(b.r), step = D ? 3.0 : 8.0, w = D ? 0.16 : 0.22, d = 0.2
    let acc = step / 2
    for (let i = 0; i < r.length; i++) {
      const a = r[i], c = r[(i + 1) % r.length], L = Math.hypot(c[0] - a[0], c[1] - a[1])
      const ux = (c[0] - a[0]) / L, uy = (c[1] - a[1]) / L, nx = uy, ny = -ux
      while (acc < L) {
        if (acc > w && acc < L - w) {
          const px = a[0] + ux * acc + nx * d, py = a[1] + uy * acc + ny * d
          steel.quad([px - ux * w, py - uy * w, 0.5], [px + ux * w, py + uy * w, 0.5], [px + ux * w, py + uy * w, b.h - 0.4], [px - ux * w, py - uy * w, b.h - 0.4])
        }
        acc += step
      }
      acc -= L
    }
  }

  // ===== The Bahn Tower (Helmut Jahn, 2000), at the tip of the triangle ======
  {
    const r = ccw(BAHN.r)
    polyPrism(glassW, roof, r, 0, BAHN.h)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], c = r[(i + 1) % r.length], L = Math.hypot(c[0] - a[0], c[1] - a[1])
      const nx = (c[1] - a[1]) / L, ny = -(c[0] - a[0]) / L, d = 0.2, t = 0.4
      for (let z = D ? 7.6 : 11.4; z < BAHN.h - 1; z += D ? 7.6 : 11.4) steel.quad([a[0] + nx * d, a[1] + ny * d, z], [c[0] + nx * d, c[1] + ny * d, z], [c[0] + nx * d, c[1] + ny * d, z + t], [a[0] + nx * d, a[1] + ny * d, z + t])
      // The glass crown frame: the facade carried 5 m past the roof as an open screen.
      const P = (k: XY, z: number): V3 => [k[0], k[1], z]
      steel.quad(P(a, BAHN.h + 4.2), P(c, BAHN.h + 4.2), P(c, BAHN.h + 5.0), P(a, BAHN.h + 5.0))
      steel.quad(P(c, BAHN.h + 4.2), P(a, BAHN.h + 4.2), P(a, BAHN.h + 5.0), P(c, BAHN.h + 5.0))
      glass.quad(P(a, BAHN.h), P(c, BAHN.h), P(c, BAHN.h + 4.2), P(a, BAHN.h + 4.2))
      glass.quad(P(c, BAHN.h), P(a, BAHN.h), P(a, BAHN.h + 4.2), P(c, BAHN.h + 4.2))
    }
    // The red DB sign on the crown on the curved south front near its east end (Koreng photo).
    const sx = 163.2, sy = -42.4, ang = 0.85, hw = 4.0, dp = 0.6
    const ux = Math.cos(ang), uy = Math.sin(ang), nx = uy, ny = -ux
    const q: XY[] = [[sx - ux * hw, sy - uy * hw], [sx + ux * hw, sy + uy * hw], [sx + ux * hw + nx * dp, sy + uy * hw + ny * dp], [sx - ux * hw + nx * dp, sy - uy * hw + ny * dp]]
    polyPrism(sign, sign, q, BAHN.h + 0.3, BAHN.h + 6.3, true)
  }

  // ===== The ring truss ======================================================
  // Three chords: outer top, inner top, bottom (between them); diagonals between chords at every node.
  const NR = D ? 96 : 30
  const node = (k: number, kk: number, z: number): V3 => { const p = ell((k / NR) * Math.PI * 2, kk); return [p[0], p[1], z] }
  const chords: { k: number; z: number }[] = [{ k: 1.016, z: ZR1 }, { k: 0.972, z: ZR1 }, { k: 0.994, z: ZR0 }]
  const rC = D ? 0.32 : 0.5, sC = D ? 6 : 3
  for (const ch of chords) {
    const path: V3[] = []
    for (let k = 0; k <= NR; k++) path.push(node(k, ch.k, ch.z))
    tube(steel, path, path.map(() => rC), sC)
  }
  const rD = D ? 0.2 : 0.3, sD = D ? 4 : 3
  for (let k = 0; k < NR; k++) {
    const k1 = k + 1
    // Zigzag webs on the outer and inner faces, and cross ties on top.
    tube(steel, [node(k, 0.994, ZR0), node(k1, 1.016, ZR1)], [rD, rD], sD)
    tube(steel, [node(k1, 0.994, ZR0), node(k1, 0.972, ZR1)], [rD, rD], sD)
    if (D) {
      tube(steel, [node(k, 0.994, ZR0), node(k, 1.016, ZR1)], [rD, rD], sD)
      tube(steel, [node(k, 0.972, ZR1), node(k, 1.016, ZR1)], [rD, rD], sD)
      tube(steel, [node(k, 0.994, ZR0), node(k1, 0.972, ZR1)], [rD, rD], sD)
    }
  }

  // ===== The petals, glass strips and the funnel =============================
  const m = D ? 12 : 4, sub = D ? 4 : 2
  const inner = (th: number): XY => {
    const o = ell(th), dx = o[0] - HUB[0], dy = o[1] - HUB[1], l = Math.hypot(dx, dy)
    return [HUB[0] + RI * dx / l, HUB[1] + RI * dy / l]
  }
  /** A point on the roof surface: th around the ring, t from the ring (0) to the funnel (1), lift above it. */
  const surf = (th: number, t: number, lift = 0): V3 => {
    const o = ell(th, 0.972), i = inner(th)
    const z = ZP0 + (ZP1 - ZP0) * Math.pow(t, 1.35)
    return [o[0] + (i[0] - o[0]) * t, o[1] + (i[1] - o[1]) * t, z + lift]
  }
  const up = (p: Part, a: V3, b: V3, c: V3) => {
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (nz >= 0) p.tri(a, b, c); else p.tri(a, c, b)
  }
  const dn = (p: Part, a: V3, b: V3, c: V3) => {
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (nz < 0) p.tri(a, b, c); else p.tri(a, c, b)
  }
  const both = (p: Part, a: V3, b: V3, c: V3) => { up(p, a, b, c); if (D) dn(p, [a[0], a[1], a[2] - 0.08], [b[0], b[1], b[2] - 0.08], [c[0], c[1], c[2] - 0.08]) }
  const dth = (Math.PI * 2) / NP, GL = 0.3
  for (let k = 0; k < NP; k++) {
    const th0 = k * dth, thA = th0 + dth * GL / 2, thB = th0 + dth * (1 - GL / 2), th1 = th0 + dth
    // The petal: folded along its middle line, which stands up to 1.1 m proud at mid-length.
    for (let j = 0; j < m; j++) {
      const t0 = j / m, t1 = (j + 1) / m
      const f = (t: number) => 1.1 * Math.sin(Math.PI * Math.min(1, t * 1.15))
      for (let s = 0; s < sub; s++) {
        const u0 = s / sub, u1 = (s + 1) / sub
        const th = (u: number) => thA + (thB - thA) * u
        const lift = (u: number, t: number) => f(t) * (1 - Math.abs(2 * u - 1))
        const a = surf(th(u0), t0, lift(u0, t0)), b = surf(th(u1), t0, lift(u1, t0)), c = surf(th(u1), t1, lift(u1, t1)), d = surf(th(u0), t1, lift(u0, t1))
        both(memb, a, b, c); both(memb, a, c, d)
      }
      // The glass strip between this petal and the next.
      const a = surf(thB, t0), b = surf(th1 + dth * GL / 2, t0), c = surf(th1 + dth * GL / 2, t1), d = surf(thB, t1)
      both(glass, a, b, c); both(glass, a, c, d)
    }
  }
  // The glass funnel from the petals up to the hub ring, and the hub ring.
  const NF = D ? 48 : 24
  for (let k = 0; k < NF; k++) {
    const a0 = (k / NF) * Math.PI * 2, a1 = ((k + 1) / NF) * Math.PI * 2
    const P = (a: number, r: number, z: number): V3 => [HUB[0] + r * Math.cos(a), HUB[1] + r * Math.sin(a), z]
    // Funnel outer face (facing out and up).
    const b0 = P(a0, RI, ZP1), b1 = P(a1, RI, ZP1), t0 = P(a0, RT, ZT), t1 = P(a1, RT, ZT)
    glass.quad(b0, b1, t1, t0); glass.quad(t0, t1, b1, b0)
    // The hub ring: a drum 1.2 m thick, ZT to ZH.
    const o0 = P(a0, RT + 0.6, ZT), o1 = P(a1, RT + 0.6, ZT), i0 = P(a0, RT - 0.6, ZT), i1 = P(a1, RT - 0.6, ZT)
    const O0 = P(a0, RT + 0.6, ZH), O1 = P(a1, RT + 0.6, ZH), I0 = P(a0, RT - 0.6, ZH), I1 = P(a1, RT - 0.6, ZH)
    steel.quad(o0, o1, O1, O0); steel.quad(i1, i0, I0, I1); up(steel, O0, O1, I1); up(steel, O0, I1, I0); dn(steel, o0, i1, o1); dn(steel, o0, i0, i1)
  }
  // The mast hanging from the hub, with its cone foot.
  tube(steel, [[HUB[0], HUB[1], ZT + 0.5], [HUB[0], HUB[1], ZM + 3], [HUB[0], HUB[1], ZM]], [0.7, 0.55, 0.15], D ? 10 : 6)
  // Spokes from the hub ring to the mast head, under the funnel.
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    tube(steel, [[HUB[0] + RT * Math.cos(a), HUB[1] + RT * Math.sin(a), ZT], [HUB[0], HUB[1], ZT - 3]], [0.2, 0.2], 4)
  }
  // Cables: from the mast foot to the ring's bottom chord at every petal seam (both models),
  // along the seams on the glass, and round the cone (detail model).
  for (let k = 0; k < NP; k++) {
    const th = k * dth, r = ell(th, 0.994)
    tube(steel, [[HUB[0], HUB[1], ZM + 1], [r[0], r[1], ZR0]], [D ? 0.1 : 0.16, D ? 0.1 : 0.16], 3)
    if (D) {
      for (const e of [-1, 1]) {
        const tt = th + e * dth * GL / 2, path: V3[] = []
        for (let j = 0; j <= m; j++) path.push(surf(tt, j / m, 0.15))
        tube(steel, path, path.map(() => 0.09), 3)
      }
      // A second, upper fan from the funnel's foot to the ring's top chord.
      const f = inner(th)
      tube(steel, [[f[0], f[1], ZP1 - 1.5], [r[0], r[1], ZR0 + 0.5]], [0.08, 0.08], 3)
    }
  }
  if (D) for (const t of [0.3, 0.55, 0.8]) {
    const path: V3[] = []
    for (let k = 0; k <= NP * 3; k++) path.push(surf((k / (NP * 3)) * Math.PI * 2, t, 1.2 * Math.sin(Math.PI * Math.min(1, t * 1.15)) + 0.1))
    tube(steel, path, path.map(() => 0.09), 3)
  }
  return { glassW, memb, steel, glass, roof, sign }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Sony Center', 'berlin-sony-center', [
    { part: welded(b.glassW), material: mat('window', 0x5f7378, 0.35) },
    { part: welded(b.memb, 25), material: { ...mat('sony-membrane', 0xf1efe9, 0.7), floodlight: (p: V3) => (p[2] > 44 ? 0.9 : 0) } },
    { part: welded(b.steel, 40), material: mat('sony-steel', 0xc2c7cb, 0.45) },
    { part: welded(b.glass), material: mat('glass', 0x8ea4b0, 0.24) },
    { part: welded(b.roof), material: mat('roof', 0x9da6ad) },
    { part: welded(b.sign), material: mat('neon-db-red', 0xd8262f, 0.5) },
  ], { bearing: BEARING, osm: 'way/183272253', height: BAHN.h + 6.3 }, maxTris, file)
}

if (import.meta.main) {
  write(LOW, 'berlin-sony-center', 6500)
  write(HIGH, 'berlin-sony-center.detail', 40000)
}
