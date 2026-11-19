/**
 * The National WWII Museum, New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-national-wwii-museum.ts
 *
 * What this model is: the museum's main campus block between Camp and
 * Magazine Streets, south of Andrew Higgins Drive, under the Bollinger
 * Canopy of Peace (Voorsanger Architects, 2019): the canopy itself, a long
 * white steel wing floating about 38-46 m over the campus, and the four
 * pavilions it spans:
 *  - Campaigns of Courage (OSM way/328026344), the faceted silver
 *    metal-panelled block at the Camp Street / Andrew Higgins corner;
 *  - the Liberation Pavilion (opened 2023,
 *    unmapped in OSM), the block between Campaigns of Courage and the U.S.
 *    Freedom Pavilion, in the 2021 photos still a steel frame;
 *  - the U.S. Freedom Pavilion: The Boeing Center (OSM way/328026280), the
 *    tall pale aircraft hall at the south end;
 *  - the Louisiana Memorial Pavilion (OSM way/328026368), the original
 *    museum building on Magazine Street, with its glass entrance walls and
 *    white truss beams.
 * Left out: the buildings north of Andrew Higgins Drive (the Solomon
 * Victory Theater complex, way/712410871) and across Magazine Street (the
 * Higgins Hotel), and the small building way/328026279, which the canopy
 * does not cover; the American Spirit skybridge.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the canopy runs
 * oblique to the street grid, so the model keeps north up). Anchor: the
 * area centroid of the campus outline way/712410870 (outer of the museum's
 * relation/12598945).
 *
 * Evidence
 * - OSM: ways 328026344 ("Campaigns of Courage", height 21),
 *   328026280 ("US Freedom Pavilion", height 29.4), 328026368 (height 16.8),
 *   712410870 (the campus area).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid about the anchor; heights from the street ground (+1.1 over
 *   the box's ground_min). The canopy: a y-monotone wing from its south tip
 *   (-6, -67) to its north point (15, 87), its east edge almost straight,
 *   its west edge straight from the north point to the west corner (-36,
 *   -25) and curving back to the south tip. Its top surface fits
 *   z = 38.83 + 0.0107x - 0.0266y + 0.00437x^2 + 0.00305xy - 0.0002y^2
 *   (rms 0.7 m): 38-40 along the east edge, 45 at the west corner.
 *   Campaigns of Courage: roof 18, raked parapets 20-21. Liberation
 *   Pavilion: 26 (west), 22 (east), its outline read from the lidar (y -9..
 *   27, x -52..-20); a 6 m link to Campaigns of Courage. U.S. Freedom
 *   Pavilion: 27-31 west of x -4, 18-21 east of it, 11-16 at the south-east.
 *   Louisiana Memorial Pavilion: 17-18 north of y 33, 11 south of it.
 * - NAIP (USGS, public domain): the canopy's white ribbed top, the plan.
 * - Terrain: flat (street ground within 0.4 m). elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "The National WWII Museum (55152081455).jpg", ajay_suresh, CC BY 4.0
 *     (2026): Campaigns of Courage from Camp Street with the canopy's point
 *     https://commons.wikimedia.org/wiki/File:The_National_WWII_Museum_(55152081455).jpg
 *   - "Camp Street, New Orleans Central Business District, 16 September
 *     2021 - 01.jpg", Infrogmation of New Orleans, CC BY-SA 4.0: the
 *     faceted block, the canopy, the Liberation Pavilion's steel frame
 *     https://commons.wikimedia.org/wiki/File:Camp_Street,_New_Orleans_Central_Business_District,_16_September_2021_-_01.jpg
 *   - "Tivoli Circle, New Orleans, 16 September 2021 - 02.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: from the north-west, the
 *     canopy over the frame and the U.S. Freedom Pavilion beyond
 *     https://commons.wikimedia.org/wiki/File:Tivoli_Circle,_New_Orleans,_16_September_2021_-_02.jpg
 *   - "Magazine Street, New Orleans CBD 1 May 2025 - National WWII Museum
 *     visitors.jpg", Infrogmation, CC BY-SA 4.0: Andrew Higgins Drive, the
 *     canopy over the street front
 *     https://commons.wikimedia.org/wiki/File:Magazine_Street,_New_Orleans_CBD_1_May_2025_-_National_WWII_Museum_visitors.jpg
 *   - "National World War II Museum, New Orleans, 14 November 2024 - 01,
 *     05, 06, 11, 17, 21.jpg", dwhartwig, CC BY 2.0: the canopy's tube
 *     struts and fan columns, the glass atria between stone walls, the
 *     Louisiana Memorial Pavilion's white truss and cream cornice
 *     https://commons.wikimedia.org/wiki/Category:National_World_War_II_Museum,_November_2024
 *   - "Louisiana Memorial Pavillion at WWII Museum.jpg" and "Main entrance
 *     to the National World War II Museum.jpg", Nolabob, CC BY-SA 3.0
 *     (2011): the pavilion's glass walls, white columns and truss
 *     https://commons.wikimedia.org/wiki/File:Louisiana_Memorial_Pavillion_at_WWII_Museum.jpg
 *     https://commons.wikimedia.org/wiki/File:Main_entrance_to_the_National_World_War_II_Museum.jpg
 *   - "New Orleans May 2017 - National WWII Museum.jpg", xiquinhosilva,
 *     CC BY 2.0: the Louisiana Memorial Pavilion's glass front and skybridge
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_May_2017_-_National_WWII_Museum.jpg
 * - Published: Wikipedia "The National WWII Museum" (the campus and its
 *   pavilions; the Bollinger Canopy of Peace, 2019). No height is taken
 *   from it: every height here is the lidar's.
 *
 * Measured (lidar/OSM): every outline and roof height, the canopy's outline
 * and surface. Estimated: the canopy's depth (2.4 m, from the photos'
 * edge truss), the positions of its three fan columns (the photos show
 * white tube clusters in the plazas; none is measured), the glass walls'
 * extent, the faceting of Campaigns of Courage (its walls lean out above a
 * recessed ground storey, as in the photos), the Liberation Pavilion's
 * east side (under the canopy, not seen by the lidar; it was a frame in the
 * 2021 photos, so its cladding is drawn like its neighbours').
 * Doubts: OSM's name for way/328026280 was checked against the 2021
 * photos (the frame stands between Campaigns of Courage and the tall hall,
 * so the tall south hall is the U.S. Freedom Pavilion); the canopy's
 * columns and the struts are placed, not measured; no licensed photo shows
 * the south (Calliope) side.
 * Left out: the lettering, the fan struts' fine members, the skybridge.
 *
 * Night: the canopy is lit from below (floodlight on its underside and
 * columns); the glass walls glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, ccw, offset, save, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, fblock, tf, qf, earclip, type Face } from './nola-gallier-hall'

const white = new Part(), metal = new Part(), stone = new Part(), beige = new Part(), win = new Part(), roof = new Part()

// ───────────────────────────── helpers ─────────────────────────────

/** The face of `ring` (ccw) whose midpoint is nearest to `pt`. */
function faceNear(ring: XY[], pt: XY): Face {
  const R = ccw(ring)
  let best = 0, bd = 1e9
  R.forEach((a, i) => {
    const b = R[(i + 1) % R.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const d = Math.hypot(m[0] - pt[0], m[1] - pt[1])
    if (d < bd) { bd = d; best = i }
  })
  return faceOf(R[best], R[(best + 1) % R.length])
}

/** A round tube from a to b (sides only), radius r. */
function tube(p: Part, a: V3, b: V3, r: number, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const h: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u: V3 = [t[1] * h[2] - t[2] * h[1], t[2] * h[0] - t[0] * h[2], t[0] * h[1] - t[1] * h[0]]
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
  const ring = (c: V3) => Array.from({ length: n }, (_, k) => {
    const an = (k / n) * 2 * Math.PI, cs = Math.cos(an) * r, sn = Math.sin(an) * r
    return [c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn] as V3
  })
  const A = ring(a), B = ring(b)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n, an = ((k + 0.5) / n) * 2 * Math.PI
    const out: V3 = [u[0] * Math.cos(an) + v[0] * Math.sin(an), u[1] * Math.cos(an) + v[1] * Math.sin(an), u[2] * Math.cos(an) + v[2] * Math.sin(an)]
    qf(p, A[k], A[l], B[l], B[k], out)
  }
}

/** Clip a ccw polygon to the half plane y >= c (keep = 1) or y <= c (keep = -1). */
function clipY(ring: XY[], c: number, keep: 1 | -1): XY[] {
  const inside = (q: XY) => (q[1] - c) * keep >= 0, out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) { const t = (c - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, c]) }
  }
  return out
}

// ───────────────────────────── the canopy ─────────────────────────────

const zTop = (x: number, y: number) => Math.min(45.5, 38.83 + 0.0107 * x - 0.0266 * y + 0.00437 * x * x + 0.00305 * x * y - 0.0002 * y * y)
const DEPTH = 2.4
// east chain (right edge) and west chain (left edge), both from the south tip to the north point
const EAST: XY[] = [[-6, -67], [0, -50], [2.5, -38], [5, -22], [7.5, -8], [10, 8], [12, 20], [14, 35], [15.5, 55], [16.5, 72], [15, 87]]
const WEST: XY[] = [[-6, -67], [-16, -60], [-24, -52], [-31, -42], [-35.5, -33], [-36, -25], [-23.25, 3], [-10.5, 31], [2.25, 59], [15, 87]]
const xAt = (chain: XY[], y: number) => {
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i], b = chain[i + 1]
    if (y >= a[1] - 1e-9 && y <= b[1] + 1e-9) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1] || 1)
  }
  return chain[y < chain[0][1] ? 0 : chain.length - 1][0]
}
{
  const ys = [...new Set([...EAST, ...WEST].map((q) => q[1]))].sort((a, b) => a - b)
  // refine: at most 7 m between stations
  const st: number[] = []
  for (let i = 0; i < ys.length - 1; i++) {
    const k = Math.max(1, Math.ceil((ys[i + 1] - ys[i]) / 7))
    for (let j = 0; j < k; j++) st.push(ys[i] + ((ys[i + 1] - ys[i]) * j) / k)
  }
  st.push(ys[ys.length - 1])
  const NX = 4
  const dep = (y: number) => 1.3 + 1.9 * Math.min(1, (xAt(EAST, y) - xAt(WEST, y)) / 30)
  const P = (y: number, j: number, under = false): V3 => {
    const xl = xAt(WEST, y), xr = xAt(EAST, y), x = xl + ((xr - xl) * j) / NX
    return [x, y, zTop(x, y) - (under ? dep(y) : 0)]
  }
  for (let i = 0; i < st.length - 1; i++) {
    for (let j = 0; j < NX; j++) {
      qf(white, P(st[i], j), P(st[i], j + 1), P(st[i + 1], j + 1), P(st[i + 1], j), [0, 0, 1])
      qf(white, P(st[i], j, true), P(st[i], j + 1, true), P(st[i + 1], j + 1, true), P(st[i + 1], j, true), [0, 0, -1])
    }
    // the edge trusses: the west (j = 0) and east (j = NX) fascias
    const a0 = P(st[i], 0), a1 = P(st[i + 1], 0), b0 = P(st[i], NX), b1 = P(st[i + 1], NX)
    const dn = (q: V3): V3 => [q[0], q[1], q[2] - dep(q[1])]
    qf(white, a0, a1, dn(a1), dn(a0), [-(a1[1] - a0[1]), a1[0] - a0[0], 0])
    qf(white, b0, b1, dn(b1), dn(b0), [b1[1] - b0[1], -(b1[0] - b0[0]), 0])
    // transverse ribs under the deck, every other station, read from below
    if (i % 2 === 1 && i < st.length - 2) {
      const y = st[i], l = P(y, 0, true), r = P(y, NX, true)
      for (const s of [-0.3, 0.3]) {
        const L1: V3 = [l[0], y + s, zTop(l[0], y + s) - dep(y)], R1: V3 = [r[0], y + s, zTop(r[0], y + s) - dep(y)]
        qf(white, L1, R1, [R1[0], R1[1], R1[2] - 1.0], [L1[0], L1[1], L1[2] - 1.0], [0, s, 0])
      }
    }
  }
  // a spine truss along the long axis, under the deck
  for (let i = 0; i < st.length - 1; i++) {
    const m0 = P(st[i], NX / 2, true), m1 = P(st[i + 1], NX / 2, true)
    for (const s of [-0.35, 0.35]) {
      const a: V3 = [m0[0] + s, m0[1], m0[2]], b: V3 = [m1[0] + s, m1[1], m1[2]]
      qf(white, a, b, [b[0], b[1], b[2] - 1.4], [a[0], a[1], a[2] - 1.4], [s, 0, 0])
    }
  }
}

// three fan columns of white tubes standing in the plazas
for (const [cx, cy, rx, ry] of [[-12, -27, 8, 7], [-5, 18, 8, 9], [4, 54, 5, 9]] as [number, number, number, number][]) {
  const top: V3 = [cx, cy, 8]
  tube(white, [cx, cy, 0], top, 0.75, 8)
  for (let k = 0; k < 6; k++) {
    const an = (k / 6) * 2 * Math.PI + 0.3, x = cx + Math.cos(an) * rx, y = cy + Math.sin(an) * ry
    tube(white, top, [x, y, zTop(x, y) - DEPTH - 0.6], 0.32, 5)
  }
  tube(white, [cx, cy, 8], [cx, cy, zTop(cx, cy) - DEPTH - 0.6], 0.4, 6)
}

// ───────────────────────────── Campaigns of Courage ─────────────────────────────

{
  const R: XY[] = ccw([[-42.7, 40.8], [-31.0, 77.9], [-3.8, 64.2], [-5.2, 61.6], [-5.2, 45.2], [0.2, 42.4], [0.3, 28.6], [-42.8, 34.8]])
  const top = (q: XY) => (q[0] < -40 ? 21 : q[1] > 75 ? 21.5 : q[1] < 30 ? 20 : 19)
  // the recessed ground storey
  prism(metal, offset(R, -1.3), 0, 4.6, null, 0)
  // the upper body leans out to a crease and back: big faceted planes
  const R1 = offset(R, 0.9)
  const n = R.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = R[i], b = R[j], a1 = R1[i], b1 = R1[j]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    // the crease runs diagonally across each face, low at one corner and high at the next
    const za = i % 2 ? 13.5 : 8, zb = j % 2 ? 13.5 : 8
    qf(metal, [a[0], a[1], 4.6], [b[0], b[1], 4.6], [b1[0], b1[1], zb], [a1[0], a1[1], za], [out[0], out[1], -0.25])
    qf(metal, [a1[0], a1[1], za], [b1[0], b1[1], zb], [b[0], b[1], top(b)], [a[0], a[1], top(a)], [out[0], out[1], 0.12])
  }
  // soffit under the overhang (from the recess out to the wall line)
  const Ri = offset(R, -1.3)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    qf(metal, [Ri[i][0], Ri[i][1], 4.6], [R[i][0], R[i][1], 4.6], [R[j][0], R[j][1], 4.6], [Ri[j][0], Ri[j][1], 4.6], [0, 0, -1])
  }
  for (const [a, b, c] of earclip(R)) tf(roof, [R[a][0], R[a][1], top(R[a])], [R[b][0], R[b][1], top(R[b])], [R[c][0], R[c][1], top(R[c])], [0, 0, 1])
  // glass: the entrance wall on the plaza (east) side and a slot on the south
  const E = faceNear(R, [-5.2, 53])
  fpanel(win, E, 1.2, E.L - 1.2, 0.3, 4.4, -1.25)
  fpanel(win, E, 2.0, E.L - 2.0, 6.0, 15.5, 0.12)
  const S = faceNear(R, [-20, 31.7])
  fpanel(win, S, 3, S.L - 3, 0.3, 4.4, -1.25)
  // the dark recessed ground storey glazing on the Camp Street side
  const W = faceNear(R, [-37, 59])
  fpanel(win, W, 6, W.L - 8, 0.3, 4.2, -1.25)
}

// link from Campaigns of Courage to the Liberation Pavilion
prism(metal, [[-44, 26.5], [-27, 26.5], [-27, 31.2], [-43.6, 33.6]], 0, 6, roof, 0.2)

// ───────────────────────────── Liberation Pavilion ─────────────────────────────

{
  const west: XY[] = [[-52, -9], [-37, -9.5], [-37, 27], [-46, 27]]
  const east: XY[] = [[-37, -9.5], [-22, -3], [-20, 27], [-37, 27]]
  prism(metal, west, 0, 26, roof, 0.3)
  prism(metal, east, 0, 22, roof, 0.3)
  // the glass front on the plaza (east), between solid end piers
  const E = faceOf([-22, -3], [-20, 27])
  fpanel(win, E, 2.5, E.L - 2.5, 0.3, 19.5)
  for (const s of [E.L * 0.36, E.L * 0.68]) fblock(metal, E, s - 0.7, s + 0.7, 0, 22, 0.5)
  // a glazed band on the north (link side) and the west face
  const W = faceOf([-46, 27], [-52, -9])
  fpanel(win, W, 4, W.L - 4, 15, 22.5)
  const N = faceOf([-20, 27], [-37, 27])
  fpanel(win, N, 2, N.L - 2, 8, 19)
}

// ───────────────────────────── U.S. Freedom Pavilion ─────────────────────────────

{
  const tall: XY[] = [[-53.2, -22.8], [-38.6, -13.2], [-36.8, -12.4], [-27.3, -25.7], [-22.5, -33.7], [-5.0, -37.6], [-3.5, -37.3], [-3.5, -62], [-2.0, -74.0],
    [-10.3, -71.8], [-14.5, -74.6], [-29.8, -67.7], [-31.5, -67.8], [-42.6, -49.9], [-44.6, -53.4]]
  const mid: XY[] = [[-3.5, -37.3], [2.1, -37.2], [2.2, -49.9], [-2.1, -57.4], [29.9, -65.5], [28.5, -70.5], [-3.5, -62]]
  const se: XY[] = [[-3.5, -62], [28.5, -70.5], [26.0, -79.0], [8.6, -86.7], [-3.8, -79.2], [-2.0, -74.0]]
  prism(stone, ccw(tall), 0, 29, roof, 0.35)
  prism(stone, ccw(mid), 0, 19.5, roof, 0.3)
  prism(stone, ccw(se), 0, 14, roof, 0.3)
  // the tall block's raised clerestory box, as the lidar's 31 m patch
  prism(stone, [[-40, -58], [-27, -63], [-22, -47], [-35, -43]], 29, 31.2, roof, 0.3)
  // the glass atrium wall on the plaza (east) side under the canopy
  const T = ccw(tall)
  const E = faceNear(T, [-3.5, -50])
  fpanel(win, E, 1.5, E.L - 1.5, 0.3, 27.5)
  // glass on the court (north) faces
  const N1 = faceNear(T, [-14, -35.6])
  fpanel(win, N1, 2, N1.L - 2, 0.3, 26)
  const N2 = faceNear(T, [-45.9, -18])
  fpanel(win, N2, 2, N2.L - 2, 16, 27)
  // the lower wings: a band of glazing
  const M = ccw(mid)
  const Me = faceNear(M, [29.2, -68])
  void Me
  const Mn = faceNear(M, [14, -61.5])
  fpanel(win, Mn, 3, Mn.L - 3, 9, 16)
}

// ───────────────────────────── Louisiana Memorial Pavilion ─────────────────────────────

{
  const R = ccw([[50.0, 8.0], [44.6, -12.5], [30.0, -8.5], [26.5, -20.7], [41.4, -24.5], [39.2, -32.4], [15.4, -26.5], [17.3, -19.6], [1.0, -15.1], [6.9, -2.6],
    [5.8, 2.4], [8.2, 2.9], [10.1, 16.6], [8.4, 17.8], [10.7, 41.0], [13.8, 44.9], [14.4, 46.2], [14.3, 51.6], [10.3, 50.6], [16.2, 65.8],
    [22.8, 65.3], [58.1, 62.6], [61.6, 57.2], [61.8, 53.2], [54.6, 22.6], [51.2, 7.7]])
  const north = clipY(R, 33, 1), south = clipY(R, 33, -1)
  prism(beige, north, 0, 18, roof, 0.3)
  prism(beige, south, 0, 11.5, roof, 0.3)
  // cream cornice band round the high block
  const Nr = ccw(north)
  for (let i = 0; i < Nr.length; i++) {
    const F = faceOf(Nr[i], Nr[(i + 1) % Nr.length])
    if (F.L < 1.5 || Math.abs(Nr[i][1] - 33) + Math.abs(Nr[(i + 1) % Nr.length][1] - 33) < 0.1) continue
    fblock(white, F, 0, F.L, 15.4, 17.2, 0.25)
  }
  // the glass front on Andrew Higgins Drive: curtain wall, white truss beam, round columns
  const F = faceOf([58.1, 62.6], [22.8, 65.3])
  fpanel(win, F, 2.5, F.L - 2.5, 0.3, 13.6)
  fblock(white, F, 0.8, F.L - 0.8, 13.6, 15.4, 0.9)
  for (const s of [1.2, F.L * 0.5, F.L - 1.2]) {
    const c: XY = [F.o[0] + F.t[0] * s + F.n[0] * 1.3, F.o[1] + F.t[1] * s + F.n[1] * 1.3]
    tube(white, [c[0], c[1], 0], [c[0], c[1], 15.4], 0.55, 8)
  }
  // the Magazine Street glass entrance (the original main door)
  const M = faceOf([54.6, 22.6], [61.8, 53.2])
  fpanel(win, M, 3, M.L - 3, 0.3, 12.8)
  fblock(white, M, 1.5, M.L - 1.5, 12.8, 14.6, 0.8)
  const M2 = faceOf([51.2, 7.7], [54.6, 22.6])
  fpanel(win, M2, 1.5, M2.L - 1.5, 3, 9)
  // the west side toward the plaza: glazing under the canopy
  const Wp = faceOf([10.3, 50.6], [14.3, 51.6])
  void Wp
  const Wq = faceOf([8.4, 17.8], [10.1, 16.6])
  void Wq
  const Wg = faceOf([10.7, 41.0], [8.4, 17.8])
  fpanel(win, Wg, 2, Wg.L - 2, 0.3, 10.5)
}

const canopyLit = (p: V3, n: V3) => (p[2] > 30 && n[2] < -0.3 ? 0.9 : p[2] > 30 ? 0.35 : p[2] > 6 ? 0.5 : 0.2)

await save('nola-national-wwii-museum', 'The National WWII Museum', [
  { part: white, material: { ...finish('canopy-white', 0xf0f0ec), floodlight: canopyLit } },
  { part: metal, material: finish('wwii-metal', 0xc8cbce) },
  { part: stone, material: finish('wwii-stone', 0xd9d5cc) },
  { part: beige, material: finish('wwii-beige', 0xd9cba9) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, osm: 'way/328026344', height: 46 }, 6500)
