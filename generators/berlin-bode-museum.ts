/**
 * Bode-Museum (Kaiser-Friedrich-Museum), Museum Island, Berlin (Ernst von
 * Ihne, 1897-1904) — procedural, CC0-1.0, no textures.
 * bun generators/berlin-bode-museum.ts
 *
 * Writes models/berlin-bode-museum.glb (low) and
 * models/berlin-bode-museum.detail.glb (detail). Imports the Berlin
 * sculpture kit from berlin-altes-museum.ts (merge that one first).
 *
 * Map frame: x east, y north, z up, metres, BEARING 0 (north up): the round
 * entrance block on the island's tip faces west (model -x), its axis about
 * y = 19.6. Anchor: the area centroid of the OSM multipolygon
 * relation/4211594 (outer way/313659705 less its five courtyards), lng
 * 13.394951, lat 52.521731. z = 0 is the river level at the foot of the
 * walls (the lowest ground the map finds under the footprint); the street,
 * the deck of the Monbijou bridge at the entrance, is ZW = 3.4 m above it
 * (Mapterhorn grid: 3.4 m on the island, 0 at the river walls). The
 * rusticated socle with its small windows fills the gap.
 *
 * What makes it the Bode-Museum, and how each is drawn
 * - The rounded north-west tip: a half-round entrance block of radius 23 m
 *   with giant Corinthian half-columns on every pier, the tall arched
 *   openings of the ground storey and the windows over them, the
 *   entablature, and the attic balustrade carrying the allegorical statues.
 * - The big dome over it: a drum (r 14.3 m) with its oculi and balustrade,
 *   the ribbed, weathered brown copper dome with its four gilt dormers and
 *   the broad lantern with its finials, to 39.5 m.
 * - The smaller green copper dome over the second hall to the south-east.
 * - The sandstone wings along both river arms (the Spree to the north, the
 *   Kupfergraben to the south-west), three window storeys between pilasters,
 *   with the pedimented risalits where they meet the round block; the five
 *   courtyards; the low grey roofs.
 *
 * Evidence
 * - OSM (ODbL): relation/4211594 "Bode-Museum" (building=civic, wikidata
 *   Q157825) with outer way/313659705 and courtyards way/313659711, 713, 715,
 *   717, 719; the dome parts way/104991250 (min_height 14, height 36, r 15.8)
 *   and way/133891391 (min_height 14, height 30, r 9.9); the wing parts
 *   way/228815155-168, 228936900-901, 229077178, 229990630-631, 229997283-285
 *   (heights 14-20).
 * - Published (de.wikipedia "Bode-Museum"): the dome 39.50 m high, its copper
 *   standing-seam cover restored about 2002; a windowed ashlar socle and two
 *   storeys with Corinthian half-columns and pedimented risalits; allegories
 *   of the arts and art cities crowning the attic (August Vogel, Wilhelm
 *   Widemann); Silesian sandstone.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "2019-08-08 Bode-Museum.jpg", Maksym Kozlenko, CC BY-SA 4.0 (the round
 *   front from the Spree: all heights, scaled by the 46 m front);
 *   "20240815 Bode-Museum.jpg", Flocci Nivis, CC BY 4.0 (front from the
 *   Monbijou bridge axis, dome colour);
 *   "Exterior of the Bode-Museum-Berlin.jpg", Yair Haklai, CC BY-SA 4.0
 *   (entrance arches, half-columns, statues);
 *   "Museumsinsel and Bode-Museum, West view 20130724 1.jpg", DXR,
 *   CC BY-SA 3.0 (west wing, the small green dome);
 *   "Bode Museum, Berlin, from northeast.jpg", Gerda Arendt, CC0 (north
 *   wing on the Spree);
 *   "Berlin Museumsinsel Fernsehturm.jpg", Thomas Wolf, CC BY-SA 3.0;
 *   "Bode-Museum, 2024 (01).jpg", Bahnfrend, CC BY-SA 4.0;
 *   "Bode Museum at night (MK).jpg", Mathias Krumbholz, CC BY-SA 3.0 and
 *   "140406 Bode-Museum.jpg", Ansgar Koreng, CC BY-SA 3.0 de (night: the
 *   round block and drum floodlit, windows lit).
 * - Measured from the Kozlenko photo (12.6 px/m): cornice 16.3 m, attic
 *   balustrade 19 m, drum cornice 22.5 m, dome top 34.5 m, lantern 37.5 m,
 *   finials 39.5 m (published); drum radius 14.3 m, lantern radius 5 m.
 * - Estimated: the wings' window sizes and pilaster rhythm (4.8 m bays),
 *   the small dome's profile (from OSM's 14-30 m and the DXR photo).
 * - Invented/simplified: statues as bold standing figures; the wings' roofs
 *   as a flat deck behind the balustrade; the river-level socle is a plain band with small windows.
 * - Look-only references: none.
 * - Doubts: the east side (towards the S-Bahn and Monbijoustraße) is not in
 *   any photo used and is drawn like the wings.
 *
 * Colour and dome (review): the stone is the dark weathered grey-brown of
 * the photos (about #7a6e5f), the dome dark brown-grey copper; the dome
 * (r 14.4 m on a 13.6 m drum, its shell to 37 m) is drawn a little larger
 * and taller than the Kozlenko measurement so that it dominates as in the
 * Flocci photo; the lantern is shortened to keep the published 39.5 m.
 *
 * Night: the round block and the drum are floodlit; the windows glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { capPoly, wallsPoly, ccw, type XY } from './dc-national-cathedral'
import { lathe, ellipsoid, TAU } from './nyc-columbus-monument'
import { place, figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { lodKit, faceOf, fpanel, fblock } from './london-british-museum'
import { put, corinthian, smoothAll } from './berlin-altes-museum'

export const ID = 'berlin-bode-museum'
export const BEARING = 0

// The round entrance block.
const RC: XY = [-42.0, 19.6], RR = 23.0
const A0 = 81, A1 = 253 // its arc, degrees
// The rest of the OSM outline, from the south wing's end round to the north wing's start (counter-clockwise).
const REST: XY[] = [[-13.9, -48.2], [-13.9, -49.1], [-4.8, -59.7], [-3.7, -59.7], [-2.9, -59.8], [26.9, -35.5], [28.2, -34.4], [28.7, -35.1], [44.2, -22.7], [43.8, -22.1], [45.7, -20.5], [60.4, -8.4], [63.7, -12.8], [68.4, -9.1], [65.1, -4.7], [74.8, 3.2], [72.9, 5.5], [77.1, 9.2], [77.7, 13.6], [75.0, 18.6], [45.5, 23.7], [44.8, 25.9], [45.0, 27.0], [40.3, 27.6], [30.9, 28.9], [-23.6, 39.7], [-24.2, 40.2], [-29.4, 41.2], [-38.2, 43.0]]
const COURTS: XY[][] = [
  [[-18.7, 23.5], [-4.7, 20.8], [-7.3, 4.9], [-23.6, 14.0]],
  [[5.9, 15.4], [28.0, 11.7], [29.5, 11.5], [28.1, 3.8], [25.9, -8.6], [23.0, -7.0], [12.0, -0.5], [3.8, 4.4]],
  [[41.6, 12.2], [55.2, 9.8], [53.4, 0.2], [45.6, -6.3], [43.2, -3.4], [39.1, -2.8]],
  [[-17.5, -24.0], [-8.7, -16.4], [7.2, -35.7], [-1.3, -42.7], [-4.4, -39.2], [-2.7, -37.8], [-2.4, -34.7], [-9.7, -26.3], [-12.8, -26.2], [-14.3, -27.6]],
  [[-33.0, -1.9], [-28.1, 6.7], [-12.0, -2.4], [-24.2, -12.7], [-25.3, -11.2]],
]
const SD: XY = [28.0, -19.6] // the small dome

const ZS = 1.2 // socle band
const ZW = 3.4 // street level above the water (Mapterhorn: 3.4 m on the island, 0 at the river walls)
const ZC = 14.5 // capitals
const ZE = 16.3 // cornice
const ZB = 19.0 // attic balustrade top
const ZR = 17.4 // roof deck behind the balustrade

const arcPt = (deg: number, r = RR): XY => [RC[0] + r * Math.cos((deg * Math.PI) / 180), RC[1] + r * Math.sin((deg * Math.PI) / 180)]

/** Join holes (any winding) into one keyhole ring with the outer ring, for earcut. */
function keyhole(outer: XY[], holes: XY[][]): XY[] {
  let ring = ccw(outer).slice()
  for (const h0 of holes) {
    const h = ccw(h0).slice().reverse()
    let best = [0, 0], bd = Infinity
    for (let i = 0; i < ring.length; i++) for (let j = 0; j < h.length; j++) {
      const d = Math.hypot(ring[i][0] - h[j][0], ring[i][1] - h[j][1])
      if (d < bd) { bd = d; best = [i, j] }
    }
    const [i, j] = best
    const hs = [...h.slice(j), ...h.slice(0, j), h[j]]
    ring = [...ring.slice(0, i + 1), ...hs, ring[i], ...ring.slice(i + 1)]
  }
  return ring
}

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dome = new Part(), green = new Part()

  const nArc = hi ? 24 : 14
  const arc: XY[] = []
  for (let k = 0; k <= nArc; k++) arc.push(arcPt(A0 + ((A1 - A0) * k) / nArc))
  const outline: XY[] = [...arc, ...REST]

  // ===== Massing ===========================================================
  wallsPoly(stone, outline, 0, ZE - 1.8)
  // Entablature band and cornice all round.
  wallsPoly(trim, outline, ZE - 1.8, ZE - 0.6)
  wallsPoly(trim, outline, ZE - 0.6, ZE)
  // Attic balustrade: a solid band with a darker baluster panel, statues on its piers.
  wallsPoly(stone, outline, ZE, ZB - 0.35)
  wallsPoly(trim, outline, ZB - 0.35, ZB)

  // Courtyard walls, facing in.
  for (const c of COURTS) {
    const R = ccw(c)
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length]
      const dx = b[0] - a[0], dy = b[1] - a[1]
      qf(stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZB], [a[0], a[1], ZB], [-dy, dx, 0])
      if (hi && Math.hypot(dx, dy) > 6) {
        const f = faceOf(b, a) // runs the other way so its normal points into the court
        for (let s = 3; s < f.len - 2; s += 4.8) for (const [z0, z1] of [[2, 4.5], [6.5, 10], [11.5, 14.5]]) fpanel(win, f, s - 0.8, s + 0.8, z0, z1)
      }
    }
  }

  // ===== Facades ===========================================================
  // Wings: every straight outer edge longer than 7 m, in 4.8 m bays.
  const R = ccw(outline)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    const f = faceOf(a, b)
    const onArc = i < nArc
    if (onArc) continue
    if (f.len < 7) continue
    const n = Math.max(1, Math.round((f.len - 2) / 4.8)), step = (f.len - 2) / n
    for (let k = 0; k < n; k++) {
      const s = 1 + step * (k + 0.5)
      fpanel(win, f, s - 0.8, s + 0.8, 1.6, 3.6)
      fpanel(win, f, s - 1.0, s + 1.0, 5.2, 9.4)
      fpanel(win, f, s - 0.9, s + 0.9, 10.8, 13.8)
      if (hi) {
        fblock(trim, f, s - 1.3, s + 1.3, 9.4, 9.9, 0, 0.3, true)
        fblock(trim, f, s - 1.15, s + 1.15, 4.7, 5.2, 0, 0.25, true)
      }
    }
    // Pilasters between the bays.
    for (let k = 0; k <= n; k++) {
      const s = 1 + step * k
      fblock(trim, f, s - 0.45, s + 0.45, 4.5, ZE - 1.8, 0, 0.3)
    }
    fblock(trim, f, 0, f.len, 4.2, 4.6, 0, 0.35, true)
  }

  // Pedimented risalits where the wings meet the round block.
  const risalit = (a: XY, b: XY, s: number, w: number) => {
    const f = faceOf(a, b)
    fblock(stone, f, s - w / 2, s + w / 2, 0, ZE, 0, 0.9, false)
    fblock(trim, f, s - w / 2 - 0.3, s + w / 2 + 0.3, ZE - 0.6, ZE, 0.9, 1.4, true)
    const P = (u: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z]
    const nn: V3 = [f.n[0], f.n[1], 0]
    tf(trim, P(s - w / 2 - 0.3, ZE, 1.4), P(s + w / 2 + 0.3, ZE, 1.4), P(s, ZE + 3.6, 1.4), nn)
    // Pediment roof slopes back to the balustrade.
    qf(roof, P(s - w / 2 - 0.3, ZE, 1.4), P(s, ZE + 3.6, 1.4), P(s, ZE + 3.6, -3), P(s - w / 2 - 0.3, ZE, -3), [0, 0, 1])
    qf(roof, P(s + w / 2 + 0.3, ZE, 1.4), P(s, ZE + 3.6, 1.4), P(s, ZE + 3.6, -3), P(s + w / 2 + 0.3, ZE, -3), [0, 0, 1])
    // Statue on the apex.
    put(trim, P(s, 0, 1.0)[0], P(s, 0, 1.0)[1], ZE + 3.6, Math.atan2(-f.n[0], f.n[1]), (g) => sculpt(g, (q) => figure(q, Qs, 2.4, { arms: [[[0.13, 0, 0.78], [0.22, 0.05, 0.92], [0.2, 0.05, 1.08]]] })))
  }
  {
    // North wing start, and the south-west wing start (edge from the arc's end).
    const nA: XY = [-23.6, 39.7], nB: XY = [30.9, 28.9]
    risalit(nB, nA, Math.hypot(nB[0] - nA[0], nB[1] - nA[1]) - 9, 12)
    const sA = arcPt(A1), sB: XY = [-13.9, -48.2]
    risalit(sA, sB, 10, 12)
  }

  // ===== The round block =====================================================
  // Giant half-columns on the piers, arched openings below, windows above.
  const piers = hi ? 12 : 8
  for (let k = 0; k <= piers; k++) {
    const deg = A0 + 4 + ((A1 - A0 - 8) * k) / piers
    const [x, y] = arcPt(deg, RR + 0.45)
    corinthian(L, trim, trim, x, y, 0.6, ZC, 0.7, false)
  }
  for (let k = 0; k < piers; k++) {
    const deg = A0 + 4 + ((A1 - A0 - 8) * (k + 0.5)) / piers
    const t = (deg * Math.PI) / 180
    const c: XY = arcPt(deg, RR + 0.06), tg: XY = [-Math.sin(t), Math.cos(t)]
    const P = (u: number, z: number): V3 => [c[0] + tg[0] * u, c[1] + tg[1] * u, z]
    const nn: V3 = [Math.cos(t), Math.sin(t), 0]
    const hw = 1.4
    // Arched opening: rectangle and semicircular head.
    qf(win, P(-hw, 0.6), P(hw, 0.6), P(hw, 4.9), P(-hw, 4.9), nn)
    const segA = hi ? 8 : 4
    for (let j = 0; j < segA; j++) {
      const a0 = (Math.PI * j) / segA, a1 = (Math.PI * (j + 1)) / segA
      tf(win, P(0, 4.9), P(hw * Math.cos(a0), 4.9 + hw * Math.sin(a0)), P(hw * Math.cos(a1), 4.9 + hw * Math.sin(a1)), nn)
    }
    qf(win, P(-1.1, 8.6), P(1.1, 8.6), P(1.1, 11.6), P(-1.1, 11.6), nn)
    if (hi) {
      // Balcony balustrade under the window and its pediment.
      const Q2 = (u: number, z: number, d: number): V3 => [c[0] + tg[0] * u + nn[0] * d, c[1] + tg[1] * u + nn[1] * d, z]
      qf(trim, Q2(-1.5, 7.6, 0.4), Q2(1.5, 7.6, 0.4), Q2(1.5, 8.5, 0.4), Q2(-1.5, 8.5, 0.4), nn)
      qf(trim, Q2(-1.5, 8.5, 0), Q2(1.5, 8.5, 0), Q2(1.5, 8.5, 0.4), Q2(-1.5, 8.5, 0.4), [0, 0, 1])
      tf(trim, Q2(-1.5, 12.0, 0.3), Q2(1.5, 12.0, 0.3), Q2(0, 12.9, 0.3), nn)
    }
  }
  // Statues on the balustrade over the piers of the round block.
  for (let k = 0; k <= piers; k += hi ? 1 : 2) {
    const deg = A0 + 4 + ((A1 - A0 - 8) * k) / piers
    const [x, y] = arcPt(deg, RR - 0.2)
    const t = (deg * Math.PI) / 180
    put(trim, x, y, ZB, Math.atan2(-Math.cos(t), Math.sin(t)), (g) => sculpt(g, (q) => figure(q, Qs, 2.5, { lean: 0.05, arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.16, 0.2, 0.52]], [[-0.13, 0, 0.78], [-0.2, 0.05, 0.62], [-0.18, 0.05, 0.45]]] })))
  }

  // ===== Main dome ==========================================================
  const nD = hi ? 32 : 16
  const RD = 13.6
  // Drum.
  lathe(stone, [[RD, ZE], [RD, 24.8]], nD, RC[0], RC[1], false)
  lathe(trim, [[RD + 0.5, 24.8], [RD + 0.5, 25.6], [RD - 0.4, 25.6]], nD, RC[0], RC[1], false)
  lathe(trim, [[RD + 0.3, 20.6], [RD + 0.3, 21.2], [RD, 21.2]], nD, RC[0], RC[1], false)
  // Drum balustrade (as a band), oculi and pilasters on the drum.
  for (let k = 0; k < (hi ? 12 : 8); k++) {
    const a = (TAU * (k + 0.5)) / (hi ? 12 : 8)
    const c: V3 = [RC[0] + (RD + 0.05) * Math.cos(a), RC[1] + (RD + 0.05) * Math.sin(a), 23.0]
    const tg: V3 = [-Math.sin(a), Math.cos(a), 0], nn: V3 = [Math.cos(a), Math.sin(a), 0]
    const ring: V3[] = []
    const m = hi ? 10 : 6
    for (let j = 0; j < m; j++) { const b = (TAU * j) / m; ring.push([c[0] + tg[0] * 1.1 * Math.cos(b), c[1] + tg[1] * 1.1 * Math.cos(b), c[2] + 1.1 * Math.sin(b)]) }
    for (let j = 0; j < m; j++) tf(win, c, ring[j], ring[(j + 1) % m], nn)
  }
  // The dome: a raised bell from the drum to the lantern ring.
  const RD2 = 14.4, zd0 = 25.6, zd1 = 37.0, rTop = 4.6
  const prof: [number, number][] = []
  const nP = hi ? 10 : 5
  for (let k = 0; k <= nP; k++) {
    const t = k / nP
    const ang = t * (Math.PI / 2)
    prof.push([rTop + (RD2 - rTop) * Math.cos(ang), zd0 + (zd1 - zd0) * Math.sin(ang) ** 0.75])
  }
  lathe(dome, prof, nD, RC[0], RC[1], false)
  // Copper ribs.
  const nRib = hi ? 16 : 8
  for (let r = 0; r < nRib; r++) {
    const a = (TAU * r) / nRib
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (rr: number, z: number, da: number): V3 => [RC[0] + (rr + 0.12) * Math.cos(a + da / rr), RC[1] + (rr + 0.12) * Math.sin(a + da / rr), z]
      qf(dome, P(r0, z0, -0.25), P(r0, z0, 0.25), P(r1, z1, 0.25), P(r1, z1, -0.25), [Math.cos(a), Math.sin(a), 0.6])
    }
  }
  // Four dormers with gilt tops.
  for (let k = 0; k < 4; k++) {
    const a = Math.PI + (TAU * k) / 4 + Math.PI / 4
    const rr = 11.6, zz = 29.6
    const x = RC[0] + rr * Math.cos(a), y = RC[1] + rr * Math.sin(a)
    cylinder(trim, x, y, 1.1, zz - 1.5, zz + 1.5, hi ? 10 : 6)
    lathe(trim, [[1.3, zz + 1.5], [0.2, zz + 2.6]], hi ? 10 : 6, x, y, true)
    const nn: V3 = [Math.cos(a), Math.sin(a), 0]
    qf(win, [x + nn[0] * 1.12 - nn[1] * 0.5, y + nn[1] * 1.12 + nn[0] * 0.5, zz - 0.9], [x + nn[0] * 1.12 + nn[1] * 0.5, y + nn[1] * 1.12 - nn[0] * 0.5, zz - 0.9], [x + nn[0] * 1.12 + nn[1] * 0.5, y + nn[1] * 1.12 - nn[0] * 0.5, zz + 0.9], [x + nn[0] * 1.12 - nn[1] * 0.5, y + nn[1] * 1.12 + nn[0] * 0.5, zz + 0.9], nn)
  }
  // Lantern: a broad balustraded drum, its cap and green finials.
  lathe(trim, [[rTop + 0.3, zd1], [rTop + 0.3, zd1 + 0.6], [rTop - 0.2, zd1 + 0.6]], nD, RC[0], RC[1], false)
  lathe(stone, [[rTop - 0.4, zd1 + 0.6], [rTop - 0.4, zd1 + 1.8]], hi ? 20 : 10, RC[0], RC[1], false)
  lathe(dome, [[rTop - 0.1, zd1 + 1.8], [rTop - 0.1, zd1 + 2.1], [rTop - 1.5, zd1 + 2.4], [0.01, zd1 + 2.6]], hi ? 20 : 10, RC[0], RC[1], true)
  for (let k = 0; k < (hi ? 8 : 4); k++) {
    const a = (TAU * k) / (hi ? 8 : 4) + 0.3
    const x = RC[0] + (rTop + 0.1) * Math.cos(a), y = RC[1] + (rTop + 0.1) * Math.sin(a)
    lathe(green, [[0.3, zd1 + 0.6], [0.25, zd1 + 1.4], [0.45, zd1 + 1.8], [0.1, zd1 + 2.8]], hi ? 8 : 4, x, y, true)
  }

  // ===== Small dome ==========================================================
  const rs = 9.9, rsd = 9.0
  lathe(stone, [[rs, ZE], [rs, 20.0]], nD, SD[0], SD[1], false)
  lathe(trim, [[rs + 0.4, 20.0], [rs + 0.4, 20.7], [rs - 0.3, 20.7]], nD, SD[0], SD[1], false)
  const ps: [number, number][] = []
  for (let k = 0; k <= nP; k++) { const ang = (k / nP) * (Math.PI / 2); ps.push([2.0 + (rsd - 2.0) * Math.cos(ang), 20.7 + 7.0 * Math.sin(ang)]) }
  lathe(green, ps, nD, SD[0], SD[1], false)
  lathe(trim, [[1.9, 27.7], [1.9, 29.0], [0.01, 30.0]], hi ? 12 : 6, SD[0], SD[1], true)

  // ===== Roof ===============================================================
  // The deck behind the balustrade, open over the courts and the domes' drums.
  const deck = keyhole(outline.map(([x, y]) => [x, y] as XY), COURTS)
  capPoly(roof, deck, ZR, true)
  // Inner face of the balustrade above the deck.
  {
    const Rr = ccw(outline)
    for (let i = 0; i < Rr.length; i++) {
      const a = Rr[i], b = Rr[(i + 1) % Rr.length]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
      const ix = (-dy / l) * 0.5, iy = (dx / l) * 0.5
      qf(trim, [a[0] + ix, a[1] + iy, ZR], [b[0] + ix, b[1] + iy, ZR], [b[0] + ix, b[1] + iy, ZB], [a[0] + ix, a[1] + iy, ZB], [-dy, dx, 0])
      qf(trim, [a[0], a[1], ZB], [b[0], b[1], ZB], [b[0] + ix, b[1] + iy, ZB], [a[0] + ix, a[1] + iy, ZB], [0, 0, 1])
    }
  }

  // ===== The river socle ======================================================
  // Everything above was built from street level; the walls rise from the
  // water (the map's lowest ground under the footprint), 3.4 m below.
  for (const p of [stone, trim, roof, win, dome, green]) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] += ZW
  wallsPoly(stone, outline, 0, ZW + ZS)
  {
    const Rr = ccw(outline)
    for (let i = 0; i < Rr.length; i++) {
      const f = faceOf(Rr[i], Rr[(i + 1) % Rr.length])
      fblock(trim, f, 0, f.len, ZW - 0.2, ZW + 0.25, 0, 0.3, true)
      if (f.len > 7 && i >= nArc) for (let s = 3; s < f.len - 2; s += 4.8) fpanel(win, f, s - 0.6, s + 0.6, 0.9, 2.4)
    }
  }

  // ===== Materials and night ================================================
  const lit = (p: V3, n: V3) => {
    const d = Math.hypot(p[0] - RC[0], p[1] - RC[1])
    if (d < RR + 2 && p[0] < RC[0] + 3 && n[2] < 0.6) return 0.9
    if (d < RD + 1 && p[2] > ZE + ZW && n[2] < 0.6) return 0.7
    return 0
  }
  return [
    { part: stone, material: { ...finish('silesian-sandstone', 0x84786a), floodlight: lit } },
    { part: trim, material: { ...finish('silesian-sandstone-light', 0x948878), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dome, material: { ...finish('weathered-copper-dome', 0x605652), floodlight: (p: V3) => (p[2] > 28 && Math.hypot(p[0] - RC[0], p[1] - RC[1]) < RD ? 0.35 : 0) } },
    { part: green, material: PALETTE.copper },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Bode-Museum', wikidata: 'Q157825' }
  writeModel('Bode-Museum', ID, build(false), extras, 6500)
  writeModel('Bode-Museum', ID, build(true), extras, 40000, `${ID}.detail`)
}
