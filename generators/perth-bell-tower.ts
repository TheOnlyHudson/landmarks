/**
 * The Bell Tower (Swan Bells), Barrack Square, Perth: procedural, CC0-1.0.
 * bun generators/perth-bell-tower.ts
 *
 * Builds with the kit exported by generators/sydney-tower-eye.ts; merge that
 * file first.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 20 (the
 * outline's long axis runs NNE). Origin at the centroid of OSM's outline
 * way/147704624 (115.858221, -31.958975). y = 0 is Barrack Square.
 *
 * Designed by Hames Sharley (structure Arup), completed 2000. A six-storey
 * concrete bell chamber enclosed in glass and wrapped by two copper sails,
 * and a glass-clad spire with a steel crown rising from its north end.
 *
 * Published (Wikipedia "Swan Bells"): 82.5 m to the top; 30 m copper sails;
 * a six-storey bell chamber. OSM's height=52.4 is not the top and is not
 * used.
 * Plan (OSM way/147704624, turned into the frame): a teardrop 13.8 m wide
 * and 21 m long, from the bow at y -10.5 to the round north end, an arc of
 * r 4.4 about (0, 5) that is the glass column of the spire; the two sails'
 * trailing ends run on as horns to y 14.5 either side of it.
 * Photo-scaled:
 * - b7 (from the north-east, distant), hung from the published 82.5 m top
 *   at 12.5 px/m: the crown's foot (top of the glass) 64 m, the crown's tip
 *   76.8 m, the sail tips 34 m and 32 m (the published 30 m reads as the
 *   sails' height above the square around them; the tips are followed);
 *   the glass spire about 5.6 m across where it leaves the sails, 2.4 m at
 *   the crown.
 * - b2 (side-on): the glass column 9.6 m across, its floor rings about 4 m
 *   apart, the observation ring at 28.5 m and a little wider; the sails'
 *   leading edges rise from the bow in a convex curve to tips just south of
 *   the column, and their trailing edges drop near-vertically to the horns.
 * - b10 (from the south): the sails lean in toward each other as they rise,
 *   from 13.8 m apart at the ground to tips about 5 m apart, bellying out at
 *   mid height, and sweep south over the bow, away from the column (b2), so
 *   from the south they read as one broad pointed copper front (b10); pierced
 *   openings (louvred slots) high on the copper.
 * - the round balconies stacked on the column's north side (b7, b10): four,
 *   17-27 m.
 * Estimated: the sails' lean and curve between the photographed sides; the
 *   size and pattern of the openings; the inner glass body's form, seen only
 *   through the gaps.
 * Left out: the pool and fountains around the base (water is the map's),
 *   the entrance canopy, the glazing bars.
 *
 * Colours from daylight photos: copper sunlit #ae6645 and #905136 (b2),
 *   #906357 (b7), dark brown overcast (b10) -> copper-sail 0xa8644a; spire
 *   glass teal #377c8f (b7), #568279 (b2) -> 0x4f969b; column glass darker
 *   teal-slate (b2 #3c4a3f) -> window 0x50767a; crown pale steel.
 * Night (b1, b8): the glass spire glows in coloured light (green in both),
 *   the steel crown and the spire's frame rings shine white (`neon-crown-white`),
 *   the bell chamber is lit, the sails are floodlit red-brown -> the spire is
 *   `neon-spire-glass` (its teal), the column `window`, the sails carry
 *   _FLOODLIGHT.
 *
 * LODs: one model (5,848 triangles, the complex budget); the sails are real
 *   shells 0.35 m thick with real holes; the glass column and taper carry a
 *   lattice of thin steel frame lines (16 mullions and rings every 2 m on the
 *   column, 12 corner mullions and rings every 3 m on the taper), lit white
 *   at night with the crown (b1).
 *
 * Photos (Wikimedia Commons; all evidence):
 * - b1 "Perth (AU), The Bell Tower -- 2019 -- 0320-4.jpg", Dietmar Rabich, CC BY-SA 4.0 (night)
 * - b2 "00 1633 Swan Bell Tower in Perth, Australia.jpg", W. Bulach, CC BY-SA 4.0
 * - b3 "AUS Perth, Central Business District, The Bell Tower 001.jpg", -wuppertaler, CC BY 4.0
 * - b6 "Swan Bell Tower and West Perth hillside.JPG", JarrahTree, CC BY 2.5 AU
 * - b7 "Perth Bell Tower (3327605785).jpg", Andy Mitchell, CC BY-SA 2.0
 * - b8 "Night 230620 gnangarra-120.jpg", Gnangarra, CC BY 2.5 AU (night)
 * - b10 "Swan Bell Tower.jpg", EurovisionNim, CC BY-SA 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { lathe, face, box, tube, saveLods, type Layer, type XY } from './sydney-tower-eye'

const SPIRE: XY = [0, 5]
const COL_R = 4.2, DECK = 28.5, GLASS_TOP = 64, CROWN_TOP = 76.8, TOP = 82.5

// East sail's plan from the bow to its horn (frame metres); the west sail mirrors it.
const PLAN: XY[] = [[-3.6, -10.2], [-1.6, -10.85], [0.5, -10.95], [2.6, -10.4], [4.4, -8.8], [5.7, -6.7], [6.6, -3.1], [6.9, 0.6], [6.8, 3.4], [6.2, 6.4], [5.2, 9.4], [3.9, 12.0], [2.3, 14.5]]

/** A point along the plan polyline at arc fraction s. */
function planAt(s: number): XY {
  const seg = PLAN.slice(1).map((p, i) => Math.hypot(p[0] - PLAN[i][0], p[1] - PLAN[i][1]))
  const L = seg.reduce((a, b) => a + b, 0)
  let d = s * L
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const t = Math.min(1, d / seg[i])
      return [PLAN[i][0] + (PLAN[i + 1][0] - PLAN[i][0]) * t, PLAN[i][1] + (PLAN[i + 1][1] - PLAN[i][1]) * t]
    }
    d -= seg[i]
  }
  return PLAN[PLAN.length - 1]
}

const S_APEX = 0.52 // the tips stand over the middle of the plan (b10 sees them centred; b2 a little south of the column)
type Sail = { side: 1 | -1; hmax: number; apex: number; tipY: number }
// tips at different points along the plan, so they stand apart (b7, b10)
const SAILS: Sail[] = [{ side: 1, hmax: 34, apex: 0.46, tipY: -7.5 }, { side: -1, hmax: 32, apex: 0.64, tipY: -5 }]
// the sails lean in part way (tips about 5 m apart) and sweep south over the bow, away from the column, as they rise (b2), so from the south they read as one pointed copper front (b10)
const LEAN = 0.62, SWEEP_K = 0.95, BELLY = 0.12

/** Height of the sail's top edge at s: a convex leading edge up from the bow, a steep trailing edge down to the horn. */
function edgeH(s: number, hmax: number, apex = S_APEX) {
  if (s <= apex) return hmax * Math.pow(s / apex, 0.35)
  const u = (s - apex) / (1 - apex)
  return hmax * (1 - Math.pow(u, 0.55))
}

/** The sail surface: plan point lifted to height z, leaning in toward the axis and toward the tip as it rises. */
function sailPt(sl: Sail, s: number, f: number, off = 0): V3 {
  const z = f * edgeH(s, sl.hmax, sl.apex)
  const k = Math.pow(z / 34, 1.6)
  const grow = sl.side < 0 ? 1.045 : 1 // the west sail runs outside the east one across the bow
  const p0 = planAt(s), p1 = planAt(Math.max(0, s - 0.01)), p2 = planAt(Math.min(1, s + 0.01))
  const tx = p2[0] - p1[0], ty = p2[1] - p1[1], tl = Math.hypot(tx, ty) || 1
  const p: XY = [p0[0] * grow + (ty / tl) * off, p0[1] * grow - (tx / tl) * off]
  const tipY = sl.tipY
  // a sail's belly: bulging out at mid height
  const x = p[0] * (1 - LEAN * k) * (1 + BELLY * Math.sin(Math.PI * Math.min(1, z / 34)))
  const y = p[1] + (tipY - p[1]) * SWEEP_K * Math.pow(z / 34, 1.6)
  return [sl.side * x, y, z]
}

const cop = new Part(), win = new Part(), spire = new Part(), steel = new Part(), crown = new Part()

// ---- Sails: shells 0.35 m thick over an (s, f) grid; some cells left open --------------------
const NS = 26, NF = 12, T = 0.35
for (const sl of SAILS) {
  // which cells are open: a glazed slot near the column, and louvred openings high up
  const open = (i: number, j: number) => {
    const s = (i + 0.5) / NS, f = (j + 0.5) / NF
    if (s > 0.7 && s < 0.78 && f < 0.82) return true // the glazed slot by the column (b10, b7)
    if (j === 8 && (i === 11 || i === 13)) return true
    if (j === 9 && (i === 12 || i === 14)) return true
    if (j === 10 && i === 13) return true
    return false
  }
  const O = (i: number, j: number) => sailPt(sl, i / NS, j / NF, T)
  const I = (i: number, j: number) => sailPt(sl, i / NS, j / NF, 0)
  const flip = sl.side < 0
  const q = (a: V3, b: V3, c: V3, d: V3) => (flip ? cop.quad(a, d, c, b) : cop.quad(a, b, c, d))
  const isOpen = (i: number, j: number) => i < 0 || j < 0 || i >= NS || j >= NF || open(i, j)
  // smooth normals on the two faces of the shell, from the grid's neighbours
  const nAt = (i: number, j: number): V3 => {
    const a = O(Math.min(NS, i + 1), j), b = O(Math.max(0, i - 1), j)
    const c = O(i, Math.min(NF, j + 1)), d = O(i, Math.max(0, j - 1))
    const u: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (j === NF) n = [u[1], -u[0], 0].map((x) => x * sl.side) as V3 // the tip row collapses: fall back to plan normal
    if (flip) n = n.map((x) => -x) as V3
    const l = Math.hypot(...n) || 1
    return n.map((x) => x / l) as V3
  }
  const neg = (n: V3): V3 => [-n[0], -n[1], -n[2]]
  const sm = (pts: V3[], ns: V3[]) => {
    cop.tri(pts[0], pts[1], pts[2], undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
    cop.tri(pts[0], pts[2], pts[3], undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
  }
  for (let i = 0; i < NS; i++)
    for (let j = 0; j < NF; j++) {
      if (open(i, j)) continue
      const cells: [number, number][] = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]
      sm(cells.map(([a, b]) => O(a, b)), cells.map(([a, b]) => nAt(a, b)))
      sm([...cells].reverse().map(([a, b]) => I(a, b)), [...cells].reverse().map(([a, b]) => neg(nAt(a, b))))
      // edges and reveals wherever a neighbour is open or missing
      if (isOpen(i - 1, j)) q(I(i, j), O(i, j), O(i, j + 1), I(i, j + 1))
      if (isOpen(i + 1, j)) q(O(i + 1, j), I(i + 1, j), I(i + 1, j + 1), O(i + 1, j + 1))
      if (isOpen(i, j + 1)) q(O(i, j + 1), O(i + 1, j + 1), I(i + 1, j + 1), I(i, j + 1))
      if (isOpen(i, j - 1) && j > 0) q(I(i, j), I(i + 1, j), O(i + 1, j), O(i, j))
    }
}

// ---- Inner glass body: the bell chamber's glazing, seen through the gaps -------------------------
{
  const half: XY[] = [[0, -10.3], [2.5, -9.8], [4.2, -8.4], [5.4, -6.4], [6.2, -3.0], [6.5, 0.6], [6.4, 3.4], [5.8, 6.2], [4.3, 8.3], [2.4, 9.0], [0, 9.1]]
  const plan: XY[] = [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [-x, y] as XY)]
  const tipY = -6
  const H = 21
  const ring = (z: number): V3[] => plan.map(([x, y]) => {
    const k = Math.pow(z / 34, 1.6)
    return [x * (1 - LEAN * k) * (1 + BELLY * Math.sin(Math.PI * Math.min(1, z / 34))) * 0.9, y + (tipY - y) * SWEEP_K * Math.pow(z / 34, 1.6), z]
  })
  const R = [0, 6, 12, 17, 21, H].map(ring)
  const n = plan.length
  const cx = (r: V3[]) => [r.reduce((t, q) => t + q[0], 0) / n, r.reduce((t, q) => t + q[1], 0) / n] as XY
  for (let k = 0; k < R.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const c = cx(R[k])
      const nr = (q: V3): V3 => { const dx = q[0] - c[0], dy = q[1] - c[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l, 0.4] }
      const P = [R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]]
      win.tri(P[0], P[1], P[2], undefined, undefined, undefined, [nr(P[0]), nr(P[1]), nr(P[2])])
      win.tri(P[0], P[2], P[3], undefined, undefined, undefined, [nr(P[0]), nr(P[2]), nr(P[3])])
    }
  const top = R[R.length - 1], c = cx(top)
  for (let i = 0; i < n; i++) face(win, [[c[0], c[1], H], top[i], top[(i + 1) % n]], [0, 0, 1])
}

// ---- Spire: glass column with floor rings, observation ring, balconies, glass taper, steel crown --
lathe(win, SPIRE, [[COL_R, 0], [COL_R, DECK]], 20)
// the column's steel frame: thin floor rings every 2 m and vertical mullions, a lattice over the glass (b2, b1)
for (let z = 2; z < DECK - 0.5; z += 2) lathe(crown, SPIRE, [[COL_R, z - 0.1], [COL_R + 0.18, z - 0.08], [COL_R + 0.18, z + 0.08], [COL_R, z + 0.1]], 16, { crease: 30 })
for (let i = 0; i < 16; i++) {
  const t = (i / 16) * Math.PI * 2 + Math.PI / 16
  const c: XY = [SPIRE[0] + Math.cos(t) * (COL_R + 0.06), SPIRE[1] + Math.sin(t) * (COL_R + 0.06)]
  box(crown, c, 0.09, 0.07, 0, DECK - 0.5, t)
}
lathe(steel, SPIRE, [[COL_R, DECK - 0.5], [5.4, DECK - 0.3], [5.4, DECK + 0.4], [3.0, DECK + 0.5]], 20, { crease: 30 })
for (const z of [17.5, 20.8, 24.1]) {
  const c: XY = [SPIRE[0], SPIRE[1] + COL_R + 0.9]
  lathe(steel, c, [[0.01, z - 0.25], [1.7, z - 0.2], [1.7, z + 0.2], [0.01, z + 0.25]], 12, { crease: 30 })
}
lathe(spire, SPIRE, [[3.0, DECK + 0.5], [2.75, 36], [1.9, 52], [1.2, GLASS_TOP]], 12, { crease: 30 })
lathe(crown, SPIRE, [[1.35, GLASS_TOP - 0.3], [1.35, GLASS_TOP + 0.4], [0.75, 70], [0.32, CROWN_TOP]], 12, { crease: 25 })
lathe(crown, SPIRE, [[0.32, CROWN_TOP], [0.16, CROWN_TOP + 0.2], [0.1, TOP]], 6, { crease: 25, top: true })
// the taper's steel frame: a mullion on each of its 12 corners and thin rings every 3 m
const taperR = (z: number) => (z < 36 ? 3.0 + ((2.75 - 3.0) * (z - DECK - 0.5)) / (36 - DECK - 0.5) : z < 52 ? 2.75 + ((1.9 - 2.75) * (z - 36)) / 16 : 1.9 + ((1.2 - 1.9) * (z - 52)) / 12)
for (let i = 0; i < 12; i++) {
  const t = (i / 12) * Math.PI * 2
  const P = (z: number): V3 => [SPIRE[0] + Math.cos(t) * (taperR(z) + 0.04), SPIRE[1] + Math.sin(t) * (taperR(z) + 0.04), z]
  tube(crown, [P(DECK + 0.5), P(36), P(52), P(GLASS_TOP - 0.3)], 0.07, 3)
}
for (let z = 32; z < GLASS_TOP - 1; z += 3) {
  const r = taperR(z)
  lathe(crown, SPIRE, [[r - 0.02, z - 0.09], [r + 0.09, z - 0.06], [r + 0.09, z + 0.06], [r - 0.02, z + 0.09]], 12, { crease: 30 })
}

// ---- Materials and output ----------------------------------------------------------------------------
const COPPER: MaterialSpec = { ...finish('copper-sail', 0xa8644a), doubleSided: false, floodlight: (_p, n) => (n[2] > 0.7 ? 0.3 : 0.8) }
const WIN: MaterialSpec = { name: 'window', color: 0x50767a, roughness: 0.35 }
const SPIRE_GLASS: MaterialSpec = finish('neon-spire-glass', 0x4f969b, 0.3)
const STEEL: MaterialSpec = finish('steel', 0xc3ccd3, 0.5)
// the crown and the spire's frame rings are lit white after dark (b1)
const CROWN: MaterialSpec = finish('neon-crown-white', 0xc9d1d8, 0.5)
const layers: Layer[] = [
  { part: cop, material: COPPER },
  { part: win, material: WIN },
  { part: spire, material: SPIRE_GLASS },
  { part: steel, material: STEEL },
  { part: crown, material: CROWN },
]

if (import.meta.main) {
  await saveLods('perth-bell-tower', 'The Bell Tower', layers, null, {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid on Barrack Square',
    bearing: 20, height: TOP,
  }, 6500)
}
