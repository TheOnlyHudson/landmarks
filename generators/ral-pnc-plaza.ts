/**
 * PNC Plaza (formerly RBC Plaza; 2008, Smallwood, Reynolds, Stewart,
 * Stewart), 301 Fayetteville Street, Raleigh — original procedural geometry,
 * CC0-1.0.
 * bun generators/ral-pnc-plaza.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * outline's centroid (-78.6387854, 35.7765852). Placed at bearing 2°: the
 * block's edges run 2° clockwise of the compass, so they are square to this
 * frame. The outline is a clean 64.2 × 51.2 m rectangle in it.
 *
 * Plan and heights (OSM way/268750429 and its building:parts, re-projected
 * into this frame):
 * - a granite podium over the whole block, 0–18 m (OSM: 3–4 levels;
 *   estimated 18 m from the photos, ground storey plus three rows of square
 *   windows);
 * - a 10-storey glass block on the south side, x −28…28, y −15…−10, to
 *   36 m (way/310454535, 10 levels × ~3.6 m: estimated);
 * - the glass hotel/office block, y −10…+3.6, to 87 m with a pool deck
 *   (way/310454536, height=87; photo-checked: Oakcitydylan's aerial puts it
 *   at ~0.62 of the main roof, ≈83 m);
 * - the north slab, y +3.6…+25, whose south face bows out in a shallow
 *   curve between x −19 and +21 (way/310454537, 130 m; way/310454538,
 *   133 m);
 * - the slim shaft at the north-west corner, 15 × 16.5 m, to 142 m
 *   (way/310454539, 142 m), carrying the crown.
 * The tall parts' glass stands 0.5 m in from the podium face (photos).
 *
 * The crown, 142–164 m (164 m published total height, Wikipedia /
 * CTBUH; the split is photo-scaled from Nctennishco12's and
 * Willthacheerleader18's photos, using the 15–16.5 m shaft as the scale):
 * the shaft's two granite pilasters on each face rise past the roof as posts
 * to a broad flat square table (≈18.8 m, 145.5–147.5 m) that overhangs the
 * shaft; between roof and table the lantern is open and lit. On the table
 * stands a white steel lattice pyramid (base ≈9.6 m, ≈9.3 m tall), a small
 * collar, and a needle mast to 164 m. Drawn bolder than real: the pyramid
 * as solid pale faces with white lattice bars proud of them.
 *
 * What makes it recognisable, each as plain geometry:
 * - the slim stone-pilastered shaft at the Fayetteville/Martin corner,
 *   standing above the slab, with the table-and-pyramid crown and mast;
 * - the long north face (Martin St) with eight stacks of white balconies
 *   over the residential floors (≈88–128 m), the PNC sign at the top of
 *   the shaft; balconies also on the curved south face over the pool deck;
 * - the stepped massing down to the south: 142 / 133 / 130 / 87 / 36 m;
 * - pale sky-blue reflective curtain wall on a pale granite podium.
 *
 * Facade: glass is the `window` material in a light sky blue (STYLE.md:
 * light reflective curtain walls use a lighter window colour), with pale
 * trim floor lines every three storeys and mullion lines about every 8 m.
 * Balcony slabs drawn about every 1.3 floors (under the real density), 0.9 m
 * thick so they read.
 *
 * Night: the curtain wall is `window` (lit offices and flats); the lantern
 * core and the pyramid are `neon-pnc-crown` (the crown is floodlit, white
 * or coloured, in Oakcitydylan's dusk photo); the sign is `neon-pnc-sign`.
 *
 * Elevation 0: the site is flat (3DEP DEM: ~1.5 m fall to the south-east
 * across the block).
 *
 * Evidence (all Wikimedia Commons):
 * - "PNC Plaza Raleigh.JPG", Alexisrael, CC BY-SA 3.0 (from the north-west,
 *   below) https://commons.wikimedia.org/wiki/File:PNC_Plaza_Raleigh.JPG
 * - "PNC Plaza - Raleigh, NC.jpg", Melizabethi123, CC BY-SA 3.0 (podium
 *   granite and sign) https://commons.wikimedia.org/wiki/File:PNC_Plaza_-_Raleigh,_NC.jpg
 * - "PNC DTR-Raleigh 2.png" and "PNC DTR-Raleigh 3.png", Oakcitydylan,
 *   CC BY-SA 4.0 (aerials from the north-east by day and the east at dusk)
 *   https://commons.wikimedia.org/wiki/File:PNC_DTR-Raleigh_2.png
 *   https://commons.wikimedia.org/wiki/File:PNC_DTR-Raleigh_3.png
 * - "Raleigh May 2025 (3).jpg", Raskuly, CC BY 4.0 (north face from
 *   Fayetteville St) https://commons.wikimedia.org/wiki/File:Raleigh_May_2025_(3).jpg
 * - "RBC Plaza, Raleigh, NC.jpg", Nctennishco12, CC BY-SA 3.0 (west face
 *   and crown) https://commons.wikimedia.org/wiki/File:RBC_Plaza,_Raleigh,_NC.jpg
 * - "Rbcplaza.JPG", Willthacheerleader18, public domain (west face, crown,
 *   south-face balconies) https://commons.wikimedia.org/wiki/File:Rbcplaza.JPG
 * - "Rbc - panoramio.jpg", Scott Thompson, CC BY 3.0 (from the north-east,
 *   balcony stacks) https://commons.wikimedia.org/wiki/File:Rbc_-_panoramio.jpg
 * - "Downtown Raleigh, North Carolina, including the city's new tallest
 *   building - RBC Plaza.jpg", Bz3rk, CC BY-SA 3.0 (crown)
 * - USGS NAIP orthophoto (public domain): plan, pool deck on the 87 m roof.
 * - OSM ways 268750429, 310454532–310454539 (ODbL), heights as above.
 * No look-only references were used. No lidar covers Wake County (3DEP).
 *
 * Doubts: the re-entrant glass notches at the shaft's outer corners are
 * left out; the podium's punched windows are grouped per bay; the east and
 * south faces are seen only in aerials, so their pilaster positions are
 * estimated; the 36 m south block is from OSM levels and one aerial.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const stone = new Part(), glass = new Part(), trim = new Part(), roof = new Part()
const crown = new Part(), sign = new Part()

// ---------- helpers ----------

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Outward normal of an edge of a counter-clockwise ring. */
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])

/** A planar convex polygon, wound to face `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const [a, b, c] = pts
  const n = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

/** A wall over edge a→b (ring counter-clockwise), facing out. */
function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  const n = outward(a, b)
  poly(part, [at(a, z0), at(b, z0), at(b, z1), at(a, z1)], [n[0], n[1], 0])
}

/**
 * A prism over a counter-clockwise ring that is star-shaped about `c`:
 * walls, and a top cap fanned from `c`.
 */
function prism(walls: Part, top: Part | null, ring: XY[], z0: number, z1: number, c?: XY) {
  ring.forEach((a, i) => wall(walls, a, ring[(i + 1) % ring.length], z0, z1))
  if (!top) return
  const k = c ?? [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length]
  ring.forEach((a, i) => poly(top, [at(k, z1), at(a, z1), at(ring[(i + 1) % ring.length], z1)], [0, 0, 1]))
}

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A closed box, all six faces. */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = part) {
  prism(part, top, rect(x0, x1, y0, y1), z0, z1)
  poly(part, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
}

/** A flat strip on the wall a→b from t0 to t1 along it, standing `proud` off it. */
function strip(part: Part, a: XY, b: XY, t0: number, t1: number, z0: number, z1: number, proud = .06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b)
  const p: XY = [a[0] + d[0] * t0 + n[0] * proud, a[1] + d[1] * t0 + n[1] * proud]
  const q: XY = [a[0] + d[0] * t1 + n[0] * proud, a[1] + d[1] * t1 + n[1] * proud]
  wall(part, p, q, z0, z1)
}

/** A block standing on the wall a→b, `w` wide at `t` along it, `d` deep. */
function pier(part: Part, a: XY, b: XY, t: number, w: number, d: number, z0: number, z1: number, top = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b)
  const P = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  // counter-clockwise from above: back along the wall, then out
  const ring = [P(t + w / 2, -.05), P(t - w / 2, -.05), P(t - w / 2, d), P(t + w / 2, d)]
  prism(part, top ? part : null, ring, z0, z1)
  if (z0 > 0) poly(part, ring.map((p) => at(p, z0)), [0, 0, -1])
}

// ---------- curtain wall lines ----------

const PODIUM = 18
const FLOOR = 3.9, BAND = 3 * FLOOR // trim floor line every three storeys

/**
 * Pale trim lines on a glass wall a→b: a floor line every three storeys and a
 * mullion line every ~8 m. Each sits just proud of the glass.
 */
function curtain(a: XY, b: XY, z0: number, z1: number, mullion = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let z = PODIUM + BAND; z < z1 - 2; z += BAND) if (z > z0 + 1) strip(trim, a, b, 0, L, z - .25, z + .25)
  const k = Math.round(L / mullion)
  for (let i = 1; i < k; i++) strip(trim, a, b, i * L / k - .2, i * L / k + .2, z0, z1, .08)
}

/** A glass prism with its curtain lines on every edge. */
function glassMass(ring: XY[], z0: number, z1: number, c?: XY, skip: (a: XY, b: XY) => boolean = () => false) {
  prism(glass, roof, ring, z0, z1, c)
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    if (!skip(a, b) && Math.hypot(b[0] - a[0], b[1] - a[1]) > 3) curtain(a, b, z0, z1)
  })
}

// ---------- podium, 0–18 m ----------
// Pale granite with tall glazed bays at the ground and a row of grouped
// square windows above (one panel per bay, two rows of windows each).
const X = 32.1, YS = -25.6, YN = 25.6
{
  const ring = rect(-X, X, YS, YN)
  prism(stone, roof, ring, 0, PODIUM, [0, 0])
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = Math.round(L / 6.4), bay = L / bays
    for (let k = 0; k < bays; k++) {
      strip(glass, a, b, k * bay + .9, (k + 1) * bay - .9, .4, 7.2)
      strip(glass, a, b, k * bay + 2, (k + 1) * bay - 2, 10.2, 15.8)
    }
    // the cornice: a slim ledge round the podium top
    strip(trim, a, b, 0, L, PODIUM - .9, PODIUM, .25)
  })
}

// ---------- the glass masses ----------
const W = 31.6, N = 25.1           // glass faces 0.5 m in from the podium
const SX0 = -W, SX1 = -16.9         // shaft, x
const SY0 = 9.1                     // shaft and 133 m slab, south edge
// the slab's bowed south face (OSM way/310454537), west to east
const CURVE: XY[] = [[-19.4, 2.0], [-13.0, .9], [-5.0, .2], [3.9, -.4], [11.4, -.7], [17.5, -.85], [20.8, -.8]]

// south block, 10 storeys
glassMass(rect(-28, 27.9, -15, -10.1), PODIUM, 36)
// the 87 m block, to the slab's south face
{
  const ring: XY[] = [[-W, -10.1], [W, -10.1], [W, 3.7], [20.8, 3.5], ...[...CURVE].reverse(), [-19.4, 3.8], [-W, 3.6]]
  glassMass(ring, PODIUM, 87, [0, -5], (a, b) => a[1] > -5 && b[1] > -5)
}
// the slab, to 130 m (the 537 part's height), then the 133 m part
{
  const ring: XY[] = [[-W, 3.6], [-19.4, 3.8], ...CURVE, [20.8, 3.5], [W, 3.7], [W, N], [-W, N]]
  prism(glass, roof, ring, PODIUM, 130, [0, 12])
  // the south-facing walls show only above the 87 m block
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 3) return
    const south = a[1] < 5 && b[1] < 5
    curtain(a, b, south ? 87 : PODIUM, 130)
  })
  glassMass(rect(SX1, W, SY0, N), 130, 133)
}
// the shaft, to 142 m
glassMass(rect(SX0, SX1, SY0, N), 130, 142)

// ---------- granite pilasters ----------
const PW = 1.9, PD = .8, LANTERN = 145.5, TABLE = 147.5
const shaftW: [XY, XY] = [[SX0, N], [SX0, SY0]]    // west face, north→south
const shaftN: [XY, XY] = [[SX1, N], [SX0, N]]      // north face, east→west
const shaftE: [XY, XY] = [[SX1, SY0], [SX1, N]]
const shaftS: [XY, XY] = [[SX0, SY0], [SX1, SY0]]
const SL = N - SY0, SWd = SX1 - SX0
// two per face, a third of the way in from each corner (Nctennishco12,
// Willthacheerleader18): full height on the street faces, posts above the
// slab roofs on the others
// (west face); on the north face they frame the shaft's edges, the sign
// between them (Raskuly, Scott Thompson)
for (const t of [.25, .75]) pier(stone, ...shaftW, t * SL, PW, PD, PODIUM, LANTERN)
for (const t of [PW / 2 / SWd, 1 - PW / 2 / SWd]) pier(stone, ...shaftN, t * SWd, PW, PD, PODIUM, LANTERN)
for (const t of [.25, .75]) {
  pier(stone, ...shaftE, t * SL, PW, PD, 133, LANTERN)
  pier(stone, ...shaftS, t * SWd, PW, PD, 130, LANTERN)
}
// the east face's pair (Oakcitydylan's dusk aerial), full height of the slab
pier(stone, [W, 3.7], [W, N], 3, PW, PD, PODIUM, 130)
pier(stone, [W, 3.7], [W, N], 18.4, PW, PD, PODIUM, 133)

// ---------- balconies ----------
// Eight stacks on the north face and six on the curved south face, every
// 4.4 m (the real ones are every 3.3 m floor) from 88 to 128 m.
const BAL_Z = [88.6, 93, 97.4, 101.8, 106.2, 110.6, 115, 119.4, 123.8]
{
  const a: XY = [W, N], b: XY = [SX1, N], L = W - SX1, col = L / 8
  for (let i = 0; i < 8; i++) for (const z of BAL_Z) pier(trim, a, b, (i + .5) * col, 4.4, 1.8, z, z + .9)
  // south face: one stack per curve segment
  for (let i = 0; i < CURVE.length - 1; i++) {
    const p = CURVE[i], q = CURVE[i + 1], l = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (l < 4) continue
    for (const z of BAL_Z) pier(trim, p, q, l / 2, Math.min(4.4, l - 1.5), 1.8, z, z + .9)
  }
}

// ---------- the PNC sign, top of the shaft's north face ----------
{
  // its edges, so it reads as a panel
  const [a, b] = shaftN, L = SWd
  pier(sign, a, b, L / 2, 6, .3, 130, 139.2)
}

// ---------- the crown ----------
const CX = (SX0 + SX1) / 2, CY = (SY0 + N) / 2
// the lit lantern core between the posts
box(crown, CX - 5.6, CX + 5.6, CY - 6.4, CY + 6.4, 142, LANTERN)
// the table: a broad flat slab overhanging the shaft
const T = 9.4
box(stone, CX - T, CX + T, CY - T, CY + T, LANTERN, TABLE)
// the lattice pyramid: pale lit faces, white bars proud of them
const PB = 5.6, PT = 1.0, PZ = 156.8
{
  const base: XY[] = rect(CX - PB, CX + PB, CY - PB, CY + PB), tip: XY[] = rect(CX - PT, CX + PT, CY - PT, CY + PT)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, n = outward(base[i], base[j])
    poly(crown, [at(base[i], TABLE), at(base[j], TABLE), at(tip[j], PZ), at(tip[i], PZ)], [n[0], n[1], .5])
  }
  // bars: corner legs, a central rib, two rails per face
  const lerp2 = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, n = outward(base[i], base[j])
    const off = (p: XY, k: number): XY => [p[0] + n[0] * k, p[1] + n[1] * k]
    const along = (s: number, z: number, w: number) => {
      // a point on the face at fraction s across, height z, pushed out by w
      const f = (z - TABLE) / (PZ - TABLE)
      const l = lerp2(base[i], tip[i], f), r = lerp2(base[j], tip[j], f)
      return at(off(lerp2(l, r, s), w), z)
    }
    const bar = (s0: number, s1: number, z0: number, z1: number) => {
      const q = [along(s0, z0, .15), along(s1, z0, .15), along(s1, z1, .15), along(s0, z1, .15)]
      poly(trim, q, [n[0], n[1], .5])
    }
    // legs at the corners and a central rib
    for (const s of [0, .5, 1]) {
      const w = s === .5 ? .05 : .07
      for (let k = 0; k < 4; k++) {
        const z0 = TABLE + (PZ - TABLE) * k / 4, z1 = TABLE + (PZ - TABLE) * (k + 1) / 4
        bar(Math.max(0, s - w), Math.min(1, s + w), z0, z1)
      }
    }
    // rails, and diagonals as stepped bars between them
    for (const z of [TABLE + 3.1, TABLE + 6.2]) bar(0, 1, z - .3, z + .3)
    for (const [s0, s1] of [[.08, .45], [.55, .92]]) {
      const steps = 4
      for (let k = 0; k < steps; k++) {
        const z0 = TABLE + .2 + 2.9 * k / steps, z1 = TABLE + .2 + 2.9 * (k + 1) / steps
        const sa = s0 + (s1 - s0) * k / steps, sb = s0 + (s1 - s0) * (k + 1) / steps
        bar(Math.min(sa, sb) , Math.max(sa, sb), z0, z1)
      }
    }
  }
}
// collar and needle mast
box(stone, CX - 1.15, CX + 1.15, CY - 1.15, CY + 1.15, PZ, PZ + 1.2)
{
  const r = 1.0, z0 = PZ + 1.2, z1 = 164
  const ring: XY[] = rect(CX - r, CX + r, CY - r, CY + r)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, n = outward(ring[i], ring[j])
    poly(trim, [at(ring[i], z0), at(ring[j], z0), [CX, CY, z1]], [n[0], n[1], .1])
  }
}

// ---------- write ----------
const parts = [
  { part: stone, material: finish('pnc-granite', 0xe2dbcf) },
  { part: glass, material: { ...PALETTE.window, color: 0x9cb5ca } },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: crown, material: finish('neon-pnc-crown', 0xb7c6d6, .5) },
  { part: sign, material: finish('neon-pnc-sign', 0x3a5684, .5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('PNC Plaza', parts, {
  license: 'CC0-1.0', bearing: 2, elevation: 0, height: 164,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/268750429', 'way/310454532', 'way/310454533', 'way/310454534', 'way/310454535', 'way/310454536', 'way/310454537', 'way/310454538', 'way/310454539'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/ral-pnc-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
