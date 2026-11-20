/**
 * St. Elizabeth of Hungary Church, Auraria campus, Denver (1898, Brother
 * Adrian Wewer; German Romanesque Revival in rough-faced rhyolite) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-st-elizabeth-of-hungary.ts
 *
 * Map frame: x across the nave, y along it toward the front, z up, metres,
 * turned to bearing 60.6 (the nave's axis; the front faces east-north-east
 * onto 11th Street). Origin on the ground at the anchor, the area centroid
 * of OSM way/34855926 (-105.0021517, 39.7426901). That outline holds the
 * church (x < -1.2) and the friary wing and cloister walks east of it; all
 * are drawn, the friary plainly.
 *
 * Identity, in order (photos below):
 *  1. the square corner tower at the front's left (seen from the street,
 *     the right): paired round-arched belfry openings, four clock gables,
 *     and a tall, steep, dark slate octagonal spire with a gilded cross.
 *                                                            (beall, migl)
 *  2. the front gable: a corbel table up the rakes, a rose window, a
 *     triplet of small windows above it, a statue niche, three round-arched
 *     portals.                                                       (beall)
 *  3. rough rhyolite, rose-brown, all over; a steep dark slate roof.
 *                                                   (beall, migl, rock)
 *  4. the long nave: round-arched windows between buttresses, a corbel
 *     table under the eaves, a low cloister arcade along the east side.
 *                                                                (migl)
 *
 * Plan: OSM way/34855926 and its building:parts, in this frame: nave
 * x -22.2..-1.2 by y -15.8..22.3; tower x -23.9..-17.1, y 17..23.8;
 * friary x -1.2..29.6, y -15.6..-2.5 with a wing to y 6.5 and a small apse;
 * the curved cloister walks from parts way/539866359 and way/539866360.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, read
 * in this frame. y = 0 is 1586.9 m, the ground at the front (flat within
 * 0.8 m round the site). Measured: nave eaves 12.3, ridge 21.5, the front
 * gable's cross to 24; a lower chancel at the back, ridge about 18; tower
 * rim and clock gables 29.6–31.5; friary eaves 10.5, ridges 14, its cross
 * gables 15; the cloister walks 4–5; the friary's apse 7.
 *
 * Estimated: the spire. The lidar has almost no returns from it (steep dark
 * slate; it records only the tower's rim), and OSM's height=35 is short of
 * the photos. Scaled from the beall photo, where the clock gables' tops
 * (31.5, lidar) are 72% of the height to the cross: spire tip 42, cross to
 * 44.2 (perspective makes this a low estimate). Also from the photos:
 * belfry openings 23–28.8; the rose window centred 15.3, radius 2.3; the
 * portals 2.2 and 1.6 m wide; nave windows 1.5 m wide, 4.5–9.5.
 * Left out: the statue, the rough-face texture, gutters, the friary's
 * detail (no photo of it), railings.
 *
 * Photos (evidence):
 *  beall   "StElizabethsDenver.JPG", Jeffrey Beall, CC BY-SA 3.0, Wikimedia
 *          Commons (the front and tower, from the north-east)
 *  migl    "Denver St Elizabeth of Hungary Church IMG 20180416 173330.jpg",
 *          Alexander Migl, CC BY-SA 4.0, Wikimedia Commons (the east side
 *          and the tower, with the cloister arcade)
 *  rock    "rock church", bradleygee, CC BY 2.0, Flickr 2215221971 via
 *          Openverse (tower and side wall, close; stone colour)
 * Look-only (seen, not used for shape): Flickr photos by StevenM_61,
 * Scott Ingram, Jonathan Thorne and sfgamchick (NC/ND licences).
 * No commercial imagery.
 *
 * Doubts: the spire's height (above); the back and west sides and the
 * friary are not photographed and are drawn plain at lidar heights; the
 * friary is drawn in pale cream stucco, as the building at the left of the
 * migl photo appears.
 *
 * Night: windows glow; the tower and front are floodlit a little.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, ccw, gableRoof, hipRoof, onWall, prism, pyramid, rectShape, save, type XY } from './atl-tech-tower'
import { beam } from './den-city-and-county-building'
import { disc, faces, onFace, roundArch, spire, tri } from './den-cathedral-basilica'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part(), door = new Part()

// ── The nave ──
const TX0 = -23.9, TX1 = -17.1, TY0 = 17.0, TY1 = 23.8, TT = 29.8
const NX0 = -22.2, NX1 = -1.2, NY0 = -9.6, NY1 = 22.3, EAVE = 12.3, RIDGE = 21.5, XM = (NX0 + NX1) / 2
box(stone, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
gableRoof(roof, stone, NX0, NX1, NY0, NY1, EAVE, RIDGE, 'y', 0.45, 0.3)
// the chancel and its corners at the back
box(stone, -18.0, -5.4, -15.8, NY0, 0, EAVE, null, 0)
gableRoof(roof, stone, -18.0, -5.4, -15.8, NY0 + 1.5, EAVE, 18.0, 'y', 0.4, 0.2)
box(stone, NX0, -18.0, -15.8, NY0, 0, 7.0, roof, 0.3)
box(stone, -5.4, NX1, -15.8, NY0, 0, 6.6, roof, 0.3)
{
  const F = faces(NX0, NX1, NY0, NY1)
  // the front: rakes with a corbel table, rose, triplet, niche, portals
  const front = F.N
  for (const [x0, x1] of [[NX0 + 0.2, XM], [NX1 - 0.2, XM]] as [number, number][]) {
    const zA = x0 < XM ? EAVE : EAVE, zB = RIDGE - 0.6
    beam(trim, [x0, NY1 + 0.15, zA - 0.1], [x1, NY1 + 0.15, zB], 0.35, 0.55)
  }
  onFace(trim, front, rectShape(NX0 + 0.3, NX1, EAVE - 0.55, EAVE), 0.12)
  onFace(trim, front, disc(XM, 15.3, 2.7, 18), 0.04)
  onFace(win, front, disc(XM, 15.3, 2.3, 18), 0.08)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    onFace(trim, front, [[XM + Math.cos(a) * 0.5 - Math.sin(a) * 0.09, 15.3 + Math.sin(a) * 0.5 + Math.cos(a) * 0.09], [XM + Math.cos(a) * 2.3 - Math.sin(a) * 0.09, 15.3 + Math.sin(a) * 2.3 + Math.cos(a) * 0.09], [XM + Math.cos(a) * 2.3 + Math.sin(a) * 0.09, 15.3 + Math.sin(a) * 2.3 - Math.cos(a) * 0.09], [XM + Math.cos(a) * 0.5 + Math.sin(a) * 0.09, 15.3 + Math.sin(a) * 0.5 - Math.cos(a) * 0.09]], 0.12)
  }
  onFace(trim, front, disc(XM, 15.3, 0.6, 10), 0.12)
  for (const d of [-0.85, 0, 0.85]) onFace(win, front, roundArch(XM + d, 0.55, 18.6, 19.6, 5), 0.06)
  onFace(trim, front, roundArch(XM, 1.5, 8.6, 11.0, 6), 0.03)
  onFace(dark, front, roundArch(XM, 1.0, 8.9, 10.9, 6), 0.06)
  onFace(trim, front, rectShape(NX0 + 6, NX1, 6.2, 6.6), 0.1)
  for (const [d, w, zs] of [[0, 2.3, 3.9], [-3.4, 1.6, 3.2], [3.4, 1.6, 3.2]] as [number, number, number][]) {
    onFace(trim, front, roundArch(XM + d, w + 0.8, 0, zs, 8), 0.03)
    onFace(dark, front, roundArch(XM + d, w + 0.3, 0, zs, 8), 0.06)
    onFace(door, front, rectShape(XM + d - w / 2 + 0.1, XM + d + w / 2 - 0.1, 0, zs - 0.15), 0.09)
    onFace(win, front, roundArch(XM + d, w - 0.2, zs - 0.05, zs, 6).slice(2) as [number, number][], 0.09)
  }
  for (const s of [XM - 4.4, XM + 4.4, XM + 7.6]) for (const d of [-0.55, 0.55]) onFace(win, front, roundArch(s + d, 0.8, 7.3, 9.6, 6), 0.06)
  // pinnacles at the gable's foot: the right corner, and beside the tower
  for (const px of [NX1 - 0.35, TX1 + 0.6]) {
    box(stone, px - 0.55, px + 0.55, NY1 - 0.9, NY1 + 0.2, 0, EAVE + 0.8, null, 0.1)
    pyramid(trim, [px, NY1 - 0.35], 0.55, EAVE + 0.8, EAVE + 3.0, 4)
  }
  box(trim, XM - 0.14, XM + 0.14, NY1 - 0.2, NY1 + 0.08, RIDGE - 0.4, 24.0, trim, 0.03)
  box(trim, XM - 0.6, XM + 0.6, NY1 - 0.2, NY1 + 0.08, 22.8, 23.1, trim, 0.03)
  // the sides: buttresses, round-arched windows, the corbel table
  const bay = (NY1 - 2 - NY0) / 6
  for (const [k, x, sx] of [['W', NX0, -1], ['E', NX1, 1]] as ['W' | 'E', number, number][]) {
    onFace(trim, F[k], rectShape(NY0, NY1, EAVE - 0.6, EAVE - 0.1), 0.14)
    for (let i = 0; i < 6; i++) {
      const ym = NY0 + (i + 0.5) * bay
      onFace(trim, F[k], roundArch(ym, 2.1, 4.2, 8.8, 7), 0.03)
      onFace(win, F[k], roundArch(ym, 1.5, 4.5, 8.8, 7), 0.07)
      if (k === 'W') onFace(win, F[k], roundArch(ym, 0.9, 1.4, 2.8, 5), 0.06)
    }
    for (let i = 0; i <= 6; i++) {
      const y = NY0 + i * bay
      box(stone, Math.min(x, x + sx * 0.7), Math.max(x, x + sx * 0.7), y - 0.45, y + 0.45, 0, 10.0, stone, 0.3)
    }
  }
}

// ── The tower and spire ──
const tc: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
box(stone, TX0, TX1, TY0, TY1, 0, TT, null, 0)
{
  const F = faces(TX0, TX1, TY0, TY1)
  for (const k of ['N', 'E', 'S', 'W'] as const) {
    const lo = k === 'N' || k === 'S' ? TX0 : TY0, hi = k === 'N' || k === 'S' ? TX1 : TY1, m = (lo + hi) / 2
    for (const z of [EAVE - 0.6, 21.4]) onFace(trim, F[k], rectShape(lo, hi, z, z + 0.45), 0.1)
    // corner strips
    for (const s of [lo + 0.35, hi - 0.35]) onFace(stone, F[k], rectShape(s - 0.35, s + 0.35, 0, TT - 0.2), 0.12)
    // belfry: paired round-arched openings under a hood
    onFace(trim, F[k], roundArch(m, 3.4, 22.9, 27.2, 8), 0.03)
    for (const d of [-0.78, 0.78]) onFace(dark, F[k], roundArch(m + d, 1.1, 23.2, 28.2, 6), 0.06)
    onFace(trim, F[k], rectShape(m - 0.12, m + 0.12, 23.2, 28.0), 0.09)
    // a corbel band and the clock gable with its face
    onFace(trim, F[k], rectShape(lo, hi, TT - 0.6, TT), 0.12)
    onFace(stone, F[k], tri(lo, hi, TT, 32.0), 0)
    onFace(trim, F[k], disc(m, 30.75, 0.85, 14), 0.06)
    if (k !== 'E') {
      onFace(trim, F[k], disc(m, 18.3, 1.0, 12), 0.04)
      onFace(win, F[k], disc(m, 18.3, 0.7, 12), 0.08)
      if (k !== 'S') onFace(win, F[k], roundArch(m, 0.9, 13.4, 15.6, 5), 0.06)
    }
  }
  // the clock gables' slopes back to the spire, corner pinnacles
  for (const k of ['N', 'E', 'S', 'W'] as const) {
    const f = F[k], L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const t: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], n: XY = [t[1], -t[0]]
    const P = (s: number, d: number, z: number): V3 => [f.a[0] + t[0] * s - n[0] * d, f.a[1] + t[1] * s - n[1] * d, z]
    const back = 2.4
    roof.quad(P(0.1, 0, TT), P(L / 2, 0, 32.0), P(L / 2, back, 32.0), P(0.1, back, TT))
    roof.quad(P(L - 0.1, 0, TT), P(L - 0.1, back, TT), P(L / 2, back, 32.0), P(L / 2, 0, 32.0))
  }
  for (const [cx, cy] of [[TX0 + 0.35, TY0 + 0.35], [TX1 - 0.35, TY0 + 0.35], [TX1 - 0.35, TY1 - 0.35], [TX0 + 0.35, TY1 - 0.35]] as XY[]) {
    pyramid(trim, [cx, cy], 0.4, TT, 32.3, 4)
  }
  // tower door on the front, under the oculus
  onFace(trim, F.N, roundArch(tc[0], 2.0, 0, 2.9, 8), 0.03)
  onFace(door, F.N, roundArch(tc[0], 1.5, 0, 3.1, 8), 0.07)
  spire(roof, tc, 2.75, TT, 42.0)
  box(trim, tc[0] - 0.13, tc[0] + 0.13, tc[1] - 0.13, tc[1] + 0.13, 41.6, 44.2, trim, 0.03)
  box(trim, tc[0] - 0.6, tc[0] + 0.6, tc[1] - 0.13, tc[1] + 0.13, 43.0, 43.3, trim, 0.03)
}

// ── The friary (plain, at lidar heights) and the cloister walks ──
box(trim, NX1, 29.6, -15.6, -2.5, 0, 10.5, null, 0)
hipRoof(roof, NX1, 29.6, -15.6, -2.5, 10.5, 14.0, 0.35)
for (const xc of [5.5, 15.3, 24.7]) gableRoof(roof, trim, xc - 1.0, xc + 1.0, -15.6, -9.0, 10.5, 15.0, 'y', 0.2, 0.15)
box(trim, 22.5, 29.6, -2.6, 0, 0, 6.0, roof, 0.2)
prism(trim, ccw([[9.5, -2.6], [17.75, -2.6], [17.78, 3.78], [15.86, 6.5], [11.55, 6.5], [9.5, 3.74]]), 0, 10.5, null, 0)
hipRoof(roof, 9.5, 17.78, -2.6, 6.5, 10.5, 13.5, 0.35)
{
  // the friary chapel's apse
  const C: XY = [29.6, -7.05]
  const ring: XY[] = Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 8) * Math.PI
    return [C[0] + 4.0 * Math.cos(a), C[1] + 4.0 * Math.sin(a)] as XY
  })
  prism(trim, ccw(ring), 0, 6.0, null, 0)
  for (let i = 0; i < 8; i++) roof.tri([ring[i][0], ring[i][1], 6.0], [ring[i + 1][0], ring[i + 1][1], 6.0], [C[0], C[1], 7.4])
  const F = faces(NX1, 29.6, -15.6, -2.5)
  for (let x = 1.5; x < 28; x += 3.2) for (const z of [2.0, 5.6]) onFace(win, F.S, rectShape(x - 0.6, x + 0.6, z, z + 1.8), 0.06)
  for (let x = 1.5; x < 9; x += 3.2) for (const z of [2.0, 5.6]) onFace(win, F.N, rectShape(x - 0.6, x + 0.6, z, z + 1.8), 0.06)
}
// cloister walks: a roof on posts along the courtyard's curved edges
const walks: XY[][] = [
  [[0.5, 4.1], [1.4, 2.6], [2.6, 1.3], [4.0, 0.3], [5.3, -0.3], [6.6, -0.8], [8.1, -1.0], [9.5, -1.0], [9.5, 2.1], [8.8, 2.2], [7.7, 2.4], [6.6, 2.8], [5.6, 3.4], [4.6, 4.3], [3.7, 5.4], [3.1, 6.6], [2.6, 7.8], [2.4, 9.2], [2.4, 10.5], [2.6, 13.2], [2.7, 14.4], [-0.4, 14.5], [-0.6, 9.2], [-0.5, 7.4], [-0.2, 5.7]],
  [[23.2, 0.6], [24.1, 1.2], [24.7, 1.6], [25.9, 2.8], [26.9, 4.2], [27.7, 5.8], [28.1, 7.5], [28.3, 9.3], [28.3, 14.7], [25.2, 14.7], [25.3, 13.6], [25.3, 10.7], [25.2, 9.4], [25.0, 8.1], [24.4, 6.8], [23.7, 5.7], [22.9, 4.6], [21.8, 3.8], [20.7, 3.1], [19.5, 2.7], [18.6, 2.6], [17.8, 2.6], [17.8, -0.8], [19.2, -0.6], [20.6, -0.4], [21.9, 0.0]],
]
for (const w of walks) {
  prism(roof, ccw(w), 3.3, 4.2, roof, 0.15, true)
  // posts on the courtyard side (the second half of each ring)
  const inner = w === walks[0] ? w.slice(9, 21) : w.slice(10, 22)
  for (const [x, y] of inner.filter((_, i) => i % 2 === 0)) box(trim, x - 0.18, x + 0.18, y - 0.18, y + 0.18, 0, 3.3, null, 0)
}
void onWall

const lit = (p: V3, n: V3) => (p[1] > 16.5 && p[0] < -1 ? (n[2] > 0.9 ? 0.2 : 0.75) : 0)
await save('den-st-elizabeth-of-hungary', 'St. Elizabeth of Hungary Church', [
  { part: stone, material: { ...finish('stelizabeth-rhyolite', 0xb39484), floodlight: lit } },
  { part: trim, material: { ...finish('stelizabeth-trim', 0xdccbbd), floodlight: lit } },
  { part: roof, material: finish('stelizabeth-slate', 0x6c7278) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('stelizabeth-recess', 0x5a5654) },
  { part: door, material: finish('stelizabeth-door', 0x7a5a3e) },
], { height: 44.2, anchor: [39.7426901, -105.0021517], bearing: 60.6 })
