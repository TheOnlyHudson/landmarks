/**
 * Alamodome, San Antonio, Texas (multi-purpose domed stadium, opened 1993,
 * Marmon Mok with HOK Sport) — procedural, CC0-1.0, no textures.
 * bun generators/sat-alamodome.ts
 *
 * Map frame: bearing 0. The OSM outline (way/154823003) is drawn square to
 * north within about 0.3°: its long walls run north–south. +y is north,
 * +x east. Anchor: the outline's area centroid. The plan is drawn
 * symmetric about both axes (OSM's and the lidar's quadrants agree within
 * about 1 m).
 *
 * z = 0 is the plaza round the building (lidar ground 6.7–6.9 m above the
 * box's lowest return, which is the I-37 frontage road to the west). The
 * roof is closed, so nothing inside shows and `elevation` stays 0.
 *
 * Identity (from the photos below):
 *  1. The four tall concrete towers, one at each inner corner of the plan,
 *     with their fans of white stay cables and the blue steel outrigger
 *     trusses they hold up along the roof edge, tied down to the ground by
 *     white hangers at the truss tips.          (aerial, greverod, barera, nick)
 *  2. The cross-shaped hipped roof: four pale grey slopes round a flat white
 *     top, notched at the corners, with the backstay cables landing on the
 *     corners of the flat top.                              (aerial, NAIP, lidar)
 *  3. The tan precast walls with reddish-brown bands, round porthole
 *     windows and the white triangulated truss band under the eaves.
 *                                                        (closeup, barera)
 *  4. The teal glass drums: three on each long side, a broad one at each
 *     end and big round ones at the four corners, banded in white.
 *                                                     (aerial, closeup, nick)
 *
 * Heights, measured from USGS lidar USGS_LPC_TX_Central_B2_2017_LAS_2019
 * (flown 2017, 1 m grid), above the plaza:
 *   - roof eave 35.3 (long sides x ±88, ends y ±113);
 *   - flat roof top 48.2, over |x| ≤ 29, |y| ≤ 54; the four slopes fall
 *     0.215 m per m from it to the eaves (measured on both axes);
 *   - corner blocks (the notches) 20.0; long-side and end drums 20.0;
 *   - a low strip along each long side 9.0;
 *   - tower tops 91.8 (peak returns 98.4–99.8 above the box's lowest point),
 *     tower centres at x ±58.5, y ±84;
 *   - outrigger truss tips: along y at x ±96, 34 m up; along x at y ±121,
 *     33.5 m up (where the stay cables end in the lidar).
 *
 * Evidence
 * - OSM (ODbL): outline way/154823003 (building=yes, leisure=stadium,
 *   wikidata Q1618347). No building:parts. The two small round buildings
 *   south of it (way/370814078, way/370814079) are separate and not drawn.
 * - USGS NAIP orthophoto: plan, the white flat top with its vents, the
 *   hips running to the towers, the grey slopes.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Alamodome from the Tower of the Americas IMG 4600.JPG", Billy Hathorn
 *     (CC BY 3.0) https://commons.wikimedia.org/wiki/File:Alamodome_from_the_Tower_of_the_Americas_IMG_4600.JPG
 *     — the west side and roof from the WNW: towers, cables, trusses,
 *     drums, roof slopes and flat top.
 *   - "Alamodome, San Antonio.jpg", Greverod (CC BY-SA 3.0)
 *     https://commons.wikimedia.org/wiki/File:Alamodome,_San_Antonio.jpg
 *     — the same view in summer.
 *   - "Alamodome from Tower of the Americas.jpg", Runner1928 (CC BY-SA 3.0)
 *     https://commons.wikimedia.org/wiki/File:Alamodome_from_Tower_of_the_Americas.jpg
 *   - "Gfp-texas-san-antonio-large-complex (1).jpg", Yinan Chen (public
 *     domain) https://commons.wikimedia.org/wiki/File:Gfp-texas-san-antonio-large-complex_(1).jpg
 *   - "San Antonio May 2018 5 (Alamodome).jpg", Michael Barera (CC BY-SA 4.0)
 *     https://commons.wikimedia.org/wiki/File:San_Antonio_May_2018_5_(Alamodome).jpg
 *     — a long side and an end from street level.
 *   - "Alamo Dome CIMG7791.JPG", Nick81aku (CC BY-SA 3.0)
 *     https://commons.wikimedia.org/wiki/File:Alamo_Dome_CIMG7791.JPG
 *     — the tower crowns, the end wall, the truss band.
 *   - "Closeup of The Alamodome, San Antonio, TX IMG 7604.JPG", Billy
 *     Hathorn (public domain)
 *     https://commons.wikimedia.org/wiki/File:Closeup_of_The_Alamodome,_San_Antonio,_TX_IMG_7604.JPG
 *     — a corner drum, the precast bands, portholes and truss band.
 * Estimated (from the photos, scaled against the lidar): tower section
 * (drawn 8 m at the base, 6.4 m at the top, a little bolder than the
 * photos' 6–7 m so the towers survive at phone size) and its crown; the drums'
 * radii (OSM bulges); the brown bands, portholes and louvres; the depth of
 * the truss band (6.8 m). Cables are drawn two per fan, thicker than real.
 * Not drawn: the roof vents, the roof's standing seams, signs, the field.
 * Night: no openly licensed night photo was found; the glass drums glow as
 * windows and nothing else is lit.
 * Doubts: OSM puts the long walls at x ±85, the lidar's eave at ±88 and a
 * 9 m strip out to ±94. Photos show only a shallow low strip at the foot
 * of the long walls, so it is drawn 4.5 m deep.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const precast = new Part() // tan precast walls, towers
const band = new Part() // reddish-brown bands
const trim = new Part() // white truss band, flat roof top, cables, glass mullion bands
const roof = new Part() // grey roof slopes, portholes, louvres, low roofs
const win = new Part() // teal glass drums
const blue = new Part() // blue steel outrigger trusses

// ---------------------------------------------------------------------------
// Dimensions (see header)
const E = 35.3 // eave height
const TOP = 48.2 // flat top
const S = 0.215 // roof slope
const EX = 88, EY = 113 // eave lines
const NX = 60, NY = 85 // notch eave lines (the corner notches)
const WX = 85.5, WY = 111 // walls
const MX = 58, MY = 83 // notch walls
const BAND = 6.8 // depth of the truss band under the eave
const CORNER = 20 // corner blocks and drums
const TX = 58.5, TY = 84 // tower centres
const TH = 91.8 // tower top

const roofH = (x: number, y: number) => Math.min(TOP, E + S * (EX - Math.abs(x)), E + S * (EY - Math.abs(y)))

// ---------------------------------------------------------------------------
// helpers
/** Signed area, positive for counter-clockwise. */
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Vertical walls of a counter-clockwise ring between per-vertex heights. */
function walls(p: Part, ring: XY[], z0: (q: XY) => number, z1: (q: XY) => number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0(a)], [b[0], b[1], z0(b)], [b[0], b[1], z1(b)], [a[0], a[1], z1(a)])
  }
}
/** Ear-clip a simple counter-clockwise polygon into triangles. */
function triangulate(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cr(a, b, c) <= 1e-9) continue
      const inside = idx.some((j) => j !== i0 && j !== i1 && j !== i2 &&
        cr(a, b, ring[j]) >= 0 && cr(b, c, ring[j]) >= 0 && cr(c, a, ring[j]) >= 0)
      if (inside) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function capPoly(p: Part, ring: XY[], z: (q: XY) => number, up = true) {
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [ring[a][0], ring[a][1], z(ring[a])], B: V3 = [ring[b][0], ring[b][1], z(ring[b])], C: V3 = [ring[c][0], ring[c][1], z(ring[c])]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  if (area(ring) < 0) ring = [...ring].reverse()
  walls(p, ring, () => z0, () => z1)
  if (top) capPoly(p, ring, () => z1)
}
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY })
/** Mirror one quadrant's helper into all four (sx, sy = ±1). */
const QUADS: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
/** A box beam between two points, w wide and h deep, its section kept vertical. */
function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(d[0], d[1]) || 1
  const side: V3 = [(-d[1] / L) * w / 2, (d[0] / L) * w / 2, 0]
  const sec = (c: V3): V3[] => [
    [c[0] - side[0], c[1] - side[1], c[2] - h / 2], [c[0] + side[0], c[1] + side[1], c[2] - h / 2],
    [c[0] + side[0], c[1] + side[1], c[2] + h / 2], [c[0] - side[0], c[1] - side[1], c[2] + h / 2],
  ]
  const s0 = sec(a), s1 = sec(b)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(s0[i], s0[j], s1[j], s1[i]) }
  p.quad(s0[3], s0[2], s0[1], s0[0]); p.quad(s1[0], s1[1], s1[2], s1[3])
}
/** A thin straight member (cable, hanger) of square section t between two points. */
function rod(p: Part, a: V3, b: V3, t: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const c1: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const l1 = Math.hypot(...c1); const e1: V3 = [c1[0] / l1 * t / 2, c1[1] / l1 * t / 2, c1[2] / l1 * t / 2]
  const c2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
  const l2 = Math.hypot(...c2); const e2: V3 = [c2[0] / l2 * t / 2, c2[1] / l2 * t / 2, c2[2] / l2 * t / 2]
  const sec = (c: V3): V3[] => [
    [c[0] - e1[0] - e2[0], c[1] - e1[1] - e2[1], c[2] - e1[2] - e2[2]],
    [c[0] + e1[0] - e2[0], c[1] + e1[1] - e2[1], c[2] + e1[2] - e2[2]],
    [c[0] + e1[0] + e2[0], c[1] + e1[1] + e2[1], c[2] + e1[2] + e2[2]],
    [c[0] - e1[0] + e2[0], c[1] - e1[1] + e2[1], c[2] - e1[2] + e2[2]],
  ]
  const s0 = sec(a), s1 = sec(b)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(s0[i], s0[j], s1[j], s1[i]) }
}
/** A flat panel on a vertical wall from a to b (counter-clockwise ring edge), offset outward. */
function panel(p: Part, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [e[1], -e[0]]
  const q = (u: number, z: number): V3 => [a[0] + e[0] * u + n[0] * off, a[1] + e[1] * u + n[1] * off, z]
  p.quad(q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1))
}
/** A round disc on a wall facing outward normal n (unit XY), centre c at height z. */
function disc(p: Part, c: XY, n: XY, z: number, r: number, seg = 10) {
  const e: XY = [-n[1], n[0]]
  const pt = (k: number): V3 => { const a = (2 * Math.PI * k) / seg; return [c[0] + n[0] * 0.08 + e[0] * r * Math.cos(a), c[1] + n[1] * 0.08 + e[1] * r * Math.cos(a), z + r * Math.sin(a)] }
  const ctr: V3 = [c[0] + n[0] * 0.08, c[1] + n[1] * 0.08, z]
  for (let k = 0; k < seg; k++) p.tri(ctr, pt(k), pt(k + 1))
}

/** A glass drum wall face: a precast plinth, then three glass storeys between white bands. */
const DRUM_LV = [0, 1.2, 6.2, 7.0, 12.4, 13.2, 18.8, 20]
const DRUM_MAT = [precast, win, trim, win, trim, win, trim]
function bandedFace(a: XY, b: XY) {
  for (let k = 0; k < DRUM_LV.length - 1; k++)
    DRUM_MAT[k].quad([a[0], a[1], DRUM_LV[k]], [b[0], b[1], DRUM_LV[k]], [b[0], b[1], DRUM_LV[k + 1]], [a[0], a[1], DRUM_LV[k + 1]])
}

// ---------------------------------------------------------------------------
// 1. Main body: a cross-shaped plan, tan precast up to the truss band.
const body: XY[] = [
  [WX, -MY], [WX, MY], [MX, MY], [MX, WY], [-MX, WY], [-MX, MY], [-WX, MY], [-WX, -MY],
  [-MX, -MY], [-MX, -WY], [MX, -WY], [MX, -MY],
]
const eave: XY[] = [
  [EX, -NY], [EX, NY], [NX, NY], [NX, EY], [-NX, EY], [-NX, NY], [-EX, NY], [-EX, -NY],
  [-NX, -NY], [-NX, -EY], [NX, -EY], [NX, -NY],
]
const eaveZ = (i: number) => roofH(eave[i][0], eave[i][1])
// the walls stop BAND below the eave above them
walls(precast, body, () => 0, (q) => { const i = body.indexOf(q); return eaveZ(i) - BAND })
// truss band: sloping out from the wall head to the eave
for (let i = 0; i < body.length; i++) {
  const j = (i + 1) % body.length
  const a = body[i], b = body[j], A = eave[i], B = eave[j]
  trim.quad([a[0], a[1], eaveZ(i) - BAND], [b[0], b[1], eaveZ(j) - BAND], [B[0], B[1], eaveZ(j)], [A[0], A[1], eaveZ(i)])
  // the triangulated truss: beige infill triangles leave white diagonals between them
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(2, Math.round(L / 4.6))
  const on = (u: number, v: number): V3 => {
    // point at fraction u along the band, v up it, nudged 0.08 m off the sloped face
    const lo: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, eaveZ(i) - BAND + (eaveZ(j) - eaveZ(i)) * u]
    const hi: V3 = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, eaveZ(i) + (eaveZ(j) - eaveZ(i)) * u]
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    return [lo[0] + (hi[0] - lo[0]) * v + nx * 0.08, lo[1] + (hi[1] - lo[1]) * v + ny * 0.08, lo[2] + (hi[2] - lo[2]) * v]
  }
  const m = 0.75 / L, vm = 0.14
  for (let k = 0; k < n; k++) {
    const u0 = k / n, u1 = (k + 1) / n, um = (u0 + u1) / 2
    // up-pointing triangle, then the down-pointing one to its right
    precast.tri(on(u0 + 2 * m, vm), on(u1 - 2 * m, vm), on(um, 1 - vm))
    if (k < n - 1) { const u2 = (k + 1.5) / n; precast.tri(on(um + 2 * m, 1 - vm), on(u1, vm + 0.12), on(u2 - 2 * m, 1 - vm)) }
  }
}

// 2. Roof: flat top and four hipped slopes, each a convex hexagon.
const FX = EX - (TOP - E) / S, FY = EY - (TOP - E) / S
capPoly(trim, [[-FX, -FY], [FX, -FY], [FX, FY], [-FX, FY]], () => TOP)
const slopes: XY[][] = [
  [[FX, -FY], [NX, -NY], [EX, -NY], [EX, NY], [NX, NY], [FX, FY]], // east
  [[-FX, FY], [-NX, NY], [-EX, NY], [-EX, -NY], [-NX, -NY], [-FX, -FY]], // west
  [[-FX, FY], [FX, FY], [NX, NY], [NX, EY], [-NX, EY], [-NX, NY]], // north
  [[FX, -FY], [-FX, -FY], [-NX, -NY], [-NX, -EY], [NX, -EY], [NX, -NY]], // south
]
for (const s of slopes) capPoly(roof, area(s) < 0 ? [...s].reverse() : s, (q) => roofH(q[0], q[1]))
// standing-seam ribs: low ridges down each long slope, every 12 m, bold enough for a phone
for (const sx of [1, -1]) for (let y = -75; y <= 75; y += 15) {
  const xs = Math.abs(y) <= FY ? FX : Math.abs(y) - (EY - EX)
  const a: V3 = [sx * xs, y, roofH(sx * xs, y) + 0.25], b: V3 = [sx * EX, y, E + 0.25]
  beam(roof, a, b, 0.9, 0.7)
}
for (const sy of [1, -1]) for (let x = -45; x <= 45; x += 15) {
  const ys = Math.abs(x) <= FX ? FY : Math.abs(x) + (EY - EX)
  const a: V3 = [x, sy * ys, roofH(x, sy * ys) + 0.25], b: V3 = [x, sy * EY, E + 0.25]
  beam(roof, a, b, 0.9, 0.7)
}

// 3. Corner blocks: the notches, 20 m, with a big round glass drum on the outer corner.
const CR = 15 // corner drum radius (OSM's rounded corners)
for (const [sx, sy] of QUADS) {
  const x1 = 86.5, y1 = 113.5
  // plan, NE quadrant, counter-clockwise: straight walls, then the drum on the corner
  const ring: XY[] = [
    [MX - 1, MY - 1], [x1, MY - 1], [x1, y1 - CR],
    ...arc(x1 - CR, y1 - CR, CR, 0, Math.PI / 2, 8).slice(1, -1),
    [x1 - CR, y1], [MX - 1, y1],
  ]
  const r = ring.map(([x, y]) => [x * sx, y * sy] as XY)
  const rr = area(r) < 0 ? [...r].reverse() : r
  // the drum walls: glass with white floor bands; the straight walls precast
  for (let i = 0; i < rr.length; i++) {
    const a = rr[i], b = rr[(i + 1) % rr.length]
    const onDrum = Math.hypot(a[0] - sx * (x1 - CR), a[1] - sy * (y1 - CR)) > CR - 0.1 && Math.hypot(b[0] - sx * (x1 - CR), b[1] - sy * (y1 - CR)) > CR - 0.1
    if (onDrum) bandedFace(a, b)
    else precast.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], CORNER], [a[0], a[1], CORNER])
  }
  capPoly(roof, rr, () => CORNER)
}

// 4. Drums on the long sides (three each) and the ends (one each).
function drum(cx: number, cy: number, dir: XY, half: number, out: number, z1: number) {
  // circular segment standing on the wall: chord 2·half, protruding `out`
  const R = (half * half + out * out) / (2 * out)
  const c: XY = [cx - dir[0] * (R - out), cy - dir[1] * (R - out)]
  const a0 = Math.atan2(dir[1], dir[0]), da = Math.asin(half / R)
  const pts = arc(c[0], c[1], R, a0 - da, a0 + da, 12)
  for (let i = 0; i < pts.length - 1; i++) bandedFace(pts[i], pts[i + 1])
  const ring = [...pts]
  capPoly(roof, area(ring) < 0 ? [...ring].reverse() : ring, () => z1)
}
for (const sx of [1, -1]) for (const y of [-38, 0, 38]) drum(sx * WX, y, [sx, 0], 10, 5.5, CORNER)
for (const sy of [1, -1]) drum(0, sy * WY, [0, sy], 32, 13, CORNER)

// 5. The low strip along each long side (9 m), between the corner blocks.
for (const sx of [1, -1]) {
  const x0 = sx * WX, x1 = sx * (WX + 4.5)
  prism(precast, [[Math.min(x0, x1), -(MY - 1)], [Math.max(x0, x1), -(MY - 1)], [Math.max(x0, x1), MY - 1], [Math.min(x0, x1), MY - 1]], 0, 9)
  // dark entrance band along its foot
  const a: XY = sx > 0 ? [x1, -(MY - 1)] : [x1, MY - 1], b: XY = sx > 0 ? [x1, MY - 1] : [x1, -(MY - 1)]
  panel(roof, a, b, 1, 2 * (MY - 1) - 1, 1.2, 4.4)
}

// 6. Facade: reddish-brown bands, portholes and louvres on the main walls.
for (let i = 0; i < body.length; i++) {
  const a = body[i], b = body[(i + 1) % body.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const top = Math.min(eaveZ(i), eaveZ((i + 1) % body.length)) - BAND
  for (const z of [13.2, 26.2]) if (z + 1.3 < top) panel(band, a, b, 0, L, z, z + 1.3)
}
for (const sx of [1, -1]) {
  const x = sx * WX
  const n: XY = [sx, 0]
  const a: XY = sx > 0 ? [x, -MY] : [x, MY], b: XY = sx > 0 ? [x, MY] : [x, -MY]
  for (const yc of [-57, -19, 19, 57]) {
    // a louvre panel between the drums, and a pair of portholes above it
    const u = sx > 0 ? yc + MY : MY - yc
    panel(roof, a, b, u - 3.5, u + 3.5, 16, 24.5)
    for (const dy of [-8.5, 8.5]) disc(roof, [x, yc + dy], n, 22.5, 2.2)
  }
  for (const yc of [-38, 0, 38]) disc(roof, [x, yc], n, 23.2, 2.2)
}
// the ends: portholes in a row over the end drum
for (const sy of [1, -1]) for (const x of [-40, -24, 24, 40]) disc(roof, [x, sy * WY], [0, sy], 24.5, 1.8)

// 7. Towers: tapered concrete shafts with a collar and a small lantern crown.
function oct(cx: number, cy: number, h: number, z: number): V3[] {
  const c = h * 0.32
  return ([[h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h], [h - c, -h]] as XY[])
    .map(([x, y]) => [cx + x, cy + y, z] as V3)
}
for (const [sx, sy] of QUADS) {
  const cx = sx * TX, cy = sy * TY
  const rings = [oct(cx, cy, 4.0, 0), oct(cx, cy, 3.2, TH - 6)]
  trim.loft(rings)
  const col = [oct(cx, cy, 3.8, TH - 6), oct(cx, cy, 3.8, TH - 4.5)]
  trim.loft([rings[1], col[0]]); trim.loft(col)
  trim.cap(col[1], true)
  // lantern: a narrower drum and a low pyramid cap
  const lan = [oct(cx, cy, 2.6, TH - 4.5), oct(cx, cy, 2.6, TH - 1.5)]
  trim.loft(lan)
  const apex: V3 = [cx, cy, TH + 0.8]
  for (let i = 0; i < 8; i++) trim.tri(lan[1][i], lan[1][(i + 1) % 8], apex)
}

// 8. Outrigger trusses, stay cables and tie-down hangers.
for (const [sx, sy] of QUADS) {
  const T: V3 = [sx * TX, sy * TY, TH - 5]
  // truss along y = ±84 out past the long wall, and along x = ±58.5 out past the end
  const a1: V3 = [sx * (TX + 3.6), sy * TY, 37.5], b1: V3 = [sx * 96, sy * TY, 34]
  const a2: V3 = [sx * TX, sy * (TY + 3.6), 37.5], b2: V3 = [sx * TX, sy * 121, 33.5]
  beam(blue, a1, b1, 1.6, 2.6)
  beam(blue, a2, b2, 1.6, 2.6)
  // truss heads: small blue blocks at the tips
  for (const b of [b1, b2]) beam(blue, [b[0], b[1], b[2] - 1.8], [b[0], b[1], b[2] + 1.8], 2.4, 2.4)
  // stays: a fan of three from the tower head to the truss (tip, two-thirds, one-third)
  for (const [a, b] of [[a1, b1], [a2, b2]] as [V3, V3][]) {
    for (const [t, dz] of [[1, 1.5], [0.66, 0], [0.33, -1.5]]) {
      const m: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t + 1.3]
      rod(trim, [T[0], T[1], T[2] + dz], m, 0.9)
    }
  }
  // backstays into the roof, landing at the corner of the flat top
  for (const [d, dz] of [[0, 1.5], [5, 0], [10, -1.5]]) {
    const x = FX + d, y = FY + d
    rod(trim, [T[0], T[1], T[2] + dz], [sx * x, sy * y, roofH(x, y) + 0.3], 0.9)
  }
  // tie-down hangers from the truss tips to the ground
  for (const b of [b1, b2]) for (const d of [-0.9, 0.9]) {
    const off: XY = b === b1 ? [0, d] : [d, 0]
    rod(trim, [b[0] + off[0], b[1] + off[1], b[2] - 1.8], [b[0] + off[0], b[1] + off[1], 0], 0.45)
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: precast, material: finish('alamodome-precast', 0xe2d2bb) },
  { part: band, material: finish('alamodome-band', 0xb08878) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('alamodome-roof', 0xc3c6c7) },
  { part: win, material: { name: 'window', color: 0x6f9c9c, roughness: 0.35 } },
  { part: blue, material: finish('alamodome-blue', 0x4a5d96) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Alamodome', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/154823003', height: TH + 0.8,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/sat-alamodome.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
