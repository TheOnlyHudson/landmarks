/**
 * U.S. Bancorp Tower ("Big Pink", 111 SW Fifth Avenue, 1983, Skidmore,
 * Owings & Merrill with Pietro Belluschi), Portland, Oregon, with the
 * seven-storey U.S. Bank Plaza (1974) that shares its OSM outline. Original
 * procedural geometry, CC0-1.0.
 * bun generators/pdx-us-bancorp-tower.ts
 *
 * This file also exports the small kit the other pdx- towers of this batch
 * build with (Wells Fargo Center, Fox Tower, KOIN Tower, PacWest Center), on
 * top of the polygon kit in chi-aon-center.ts. Big Pink is only written when
 * this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/1227505777,
 * 45.5223138, -122.6761858. The tower's long faces run true east-west and its
 * ends follow the street grid (21° east of north), so the catalog bearing is
 * 0 and every ring below is the OSM ring in local metres.
 *
 * Identity, in order: the pink colour; the tall parallelogram slab, long
 * faces east-west and ends slanted to the grid; the stepped pattern on each
 * face, where the upper floors are all pink glass and the lower floors pink
 * granite with ribbon windows, the boundary stepping down across the face in
 * storey-high jumps; the flat top.
 *
 * Evidence:
 *  - plan: OSM tower part way/1227505778, a parallelogram 49.6 m east-west
 *    by 36.5 m north-south with ends at 21° (measured from OSM). Plaza
 *    building way/31732578 (30 m, 7 levels) and its two roof blocks
 *    way/1227505776 (34 m) and way/1227505775 (40 m): OSM.
 *  - height: 163.4 m, 42 storeys (published, Wikipedia; OSM 162/163). Storey
 *    3.89 m = height / 42.
 *  - roof: penthouse plan from OSM way/1567208928; its 3 m height is
 *    estimated from the 2016 aerial (Pdx.rollingthunder).
 *  - the glass/granite steps: from M.O. Stevens' view from Burnside (north
 *    face): three steps across the face, the glass reaching about 6, 10 and
 *    14 storeys down from the top, deepest at the west end. The south face
 *    is taken as its 180° twin. The ends are seen only edge-on and in the
 *    aerial: two steps (15 and 8 storeys), deepest next to the deep end of
 *    the long face (estimated).
 *  - ribbon windows in the granite: Another Believer's view up the facade
 *    and the Burnside view; drawn as one panel per two storeys per bay.
 *  - colour: granite reads warm taupe-pink and the glass rose-lavender in
 *    every daylight photo; both pulled to the palette's lightness.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - US_Bancorp_Tower_from_Burnside_-_Portland,_Oregon.JPG, M.O. Stevens,
 *    CC BY-SA 3.0
 *  - US_Bancorp_Tower_2011.jpg, Another Believer, CC BY-SA 3.0
 *  - Aerial_of_U.S._Bancorp_Tower_(2016).jpg, Pdx.rollingthunder,
 *    CC BY-SA 4.0
 * No lidar was needed. No commercial imagery.
 *
 * Doubts: the step pattern on the south face and the two ends is inferred,
 * not photographed square-on; the plaza building's facade is simplified to
 * ribbon panels; the small 35 m roof boxes on the plaza (way/1567208929-31)
 * are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, onWall, panel, parapetRoof, rows, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Kit, shared by the pdx- towers of this batch.

export type { XY }

/** Signed area; positive for a counter-clockwise ring. */
const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** The ring counter-clockwise, without a repeated closing point. */
export function ccw(r: XY[]): XY[] {
  const o = r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r.slice(0, -1) : r
  return signedArea(o) < 0 ? [...o].reverse() : o
}

/** Round every convex corner of a counter-clockwise ring with radius `rad`, `seg` segments. */
export function roundCorners(r: XY[], rad: number, seg = 4): XY[] {
  const out: XY[] = []
  r.forEach((c, i) => {
    const p = r[(i - 1 + r.length) % r.length], n = r[(i + 1) % r.length]
    const cr = (c[0] - p[0]) * (n[1] - c[1]) - (c[1] - p[1]) * (n[0] - c[0])
    const lp = Math.hypot(c[0] - p[0], c[1] - p[1]), ln = Math.hypot(n[0] - c[0], n[1] - c[1])
    if (cr <= 1e-9) { out.push(c); return }
    const u1: XY = [(c[0] - p[0]) / lp, (c[1] - p[1]) / lp], u2: XY = [(n[0] - c[0]) / ln, (n[1] - c[1]) / ln]
    const turnA = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])))
    const t = Math.min(rad * Math.tan(turnA / 2), lp / 2.05, ln / 2.05)
    const R = t / Math.tan(turnA / 2)
    const s: XY = [c[0] - u1[0] * t, c[1] - u1[1] * t]
    const ctr: XY = [s[0] - u1[1] * R, s[1] + u1[0] * R] // left of the edge = inside
    const a0 = Math.atan2(s[1] - ctr[1], s[0] - ctr[0])
    for (let k = 0; k <= seg; k++) {
      const a = a0 + (turnA * k) / seg
      out.push([ctr[0] + R * Math.cos(a), ctr[1] + R * Math.sin(a)])
    }
  })
  return out
}

/**
 * Horizontal bands of window panels on every wall of a ring: one panel per
 * wall segment per row, so the bands wrap round curves and rounded corners.
 * Walls shorter than `minLen` are skipped; `end` keeps a margin at each end
 * of a wall (0 for curves, so neighbouring panels meet).
 */
export function ribbons(p: Part, r: XY[], bands: [number, number][], o: { minLen?: number; end?: number; out?: number } = {}) {
  const minLen = o.minLen ?? 0, end = o.end ?? 0, out = o.out ?? 0.05
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < Math.max(minLen, 2 * end + 0.3)) continue
    for (const [z0, z1] of bands) panel(p, a, b, end, L - end, z0, z1, out)
  }
}

/** Repeating bands from z0 to z1: each `period` tall, the panel `h` of it, starting `lift` up the period. */
export function bandRows(z0: number, z1: number, period: number, h: number, lift = 0): [number, number][] {
  const out: [number, number][] = []
  for (let z = z0; z + lift + h <= z1 + 1e-6; z += period) out.push([z + lift, z + lift + h])
  return out
}

/** A closed prism with no bottom, flat top. */
export function prism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number) {
  walls(wall, r, z0, z1)
  if (top) cap(top, r, z1)
}

/** A small solid bead (octahedron) at p, for lamps. */
export function bead(p: Part, c: V3, s: number) {
  const [x, y, z] = c
  const v: V3[] = [[x + s, y, z], [x, y + s, z], [x - s, y, z], [x, y - s, z]]
  const top: V3 = [x, y, z + s], bot: V3 = [x, y, z - s]
  for (let i = 0; i < 4; i++) {
    const a = v[i], b = v[(i + 1) % 4]
    p.tri(a, b, top)
    p.tri(b, a, bot)
  }
}

export { onWall, panel, rows, block, walls, cap, parapetRoof, save }

// ---------------------------------------------------------------------------
// Big Pink

const H = 163.4, FL = H / 42
// Tower, counter-clockwise from the south-west corner (OSM way/1227505778).
const TOWER: XY[] = [[-13.3, 28.9], [36.3, 29.4], [50.1, 65.9], [0.5, 65.6]]
// Plaza building (OSM way/31732578), and its roof blocks.
const PLAZA: XY[] = ccw([[-13.3, 28.9], [-14.6, 25.5], [-15.8, 22.1], [-26.2, 22.0], [-49.0, -36.5], [-31.1, -54.2], [-4.6, -78.7], [19.5, -14.8], [33.7, 22.6], [35.0, 26.0], [36.3, 29.4]])
const ROOF34: XY[] = ccw([[-21.2, 5.8], [-34.6, -28.6], [-5.4, -55.1], [16.0, 0.5], [18.2, 6.2]])
const ROOF40: XY[] = ccw([[-11.1, -37.1], [1.8, -3.3], [-11.0, -3.2], [-20.8, -28.6]])
const PENT: XY[] = ccw([[29.9, 40.7], [29.9, 50.2], [28.7, 50.2], [28.7, 54.0], [27.8, 54.0], [27.8, 56.6], [2.0, 56.5], [2.1, 42.9], [5.3, 43.0], [5.4, 40.6]])

function build() {
  const granite = new Part(), glass = new Part(), roof = new Part(), ribbon = glass

  // --- tower body
  parapetRoof(granite, roof, TOWER, H, 0.6, 3.0)
  walls(granite, TOWER, 0, H)
  block(granite, roof, PENT, H - 3.0, H - 0.2, 0.3)

  // Steps: storeys of glass below the top, per segment of each face, a→b.
  const steps = [[6, 10, 14], [15, 8], [6, 10, 14], [15, 8]]
  const PIER = 0.7, BAY = 8.0
  for (let f = 0; f < 4; f++) {
    const a = TOWER[f], b = TOWER[(f + 1) % 4]
    const { L } = onWall(a, b)
    const seg = steps[f], n = seg.length
    // Bays across the face, snapped so the step lines fall on piers.
    const perSeg = Math.max(1, Math.round(L / n / BAY))
    const k = perSeg * n, w = (L - (k + 1) * PIER) / k
    for (let q = 0; q < k; q++) {
      const s0 = PIER + q * (w + PIER), s1 = s0 + w
      const zg = H - seg[Math.floor(q / perSeg)] * FL // bottom of the glass zone here
      // Glass: one panel per three storeys, with a thin granite grid line.
      for (let z = zg; z < H - 0.7 - 0.5; z += 3 * FL) panel(glass, a, b, s0 - PIER / 2 + 0.15, s1 + PIER / 2 - 0.15, z + 0.12, Math.min(z + 3 * FL - 0.12, H - 0.7), 0.05)
      // Granite below with ribbon windows, two storeys a panel; lobby at the foot.
      const z0 = f === 0 ? 30 : 0 // the south face meets the plaza roof
      if (f !== 0) panel(ribbon, a, b, s0, s1, 0.4, 2 * FL - 0.6, 0.05)
      for (let z = Math.max(z0, 2 * FL); z + 2 * FL <= zg + 0.01; z += 2 * FL) panel(ribbon, a, b, s0, s1, z + 1.05, z + 2 * FL - 1.05, 0.05)
    }
  }

  // --- the plaza building, seven storeys, with its two roof blocks
  const PH = 30, pf = PH / 7
  block(granite, roof, PLAZA, 0, PH, 0.5)
  for (let i = 0; i < PLAZA.length; i++) {
    const a = PLAZA[i], b = PLAZA[(i + 1) % PLAZA.length]
    const { L } = onWall(a, b)
    // Skip the wall shared with the tower, and the short jogs.
    if (L < 6 || (Math.abs(a[1] - 28.9) < 1 && Math.abs(b[1] - 29.4) < 1) || (Math.abs(b[1] - 28.9) < 1 && Math.abs(a[1] - 29.4) < 1)) continue
    const k = Math.max(1, Math.round(L / 9)), w = (L - (k + 1) * 0.8) / k
    for (let q = 0; q < k; q++) {
      const s0 = 0.8 + q * (w + 0.8)
      panel(ribbon, a, b, s0, s0 + w, 0.4, pf - 0.4, 0.05)
      for (let z = pf; z + 2 * pf <= PH - 1; z += 2 * pf) panel(ribbon, a, b, s0, s0 + w, z + 0.9, z + 2 * pf - 0.9, 0.05)
    }
  }
  block(granite, roof, ROOF34, PH - 0.5, 34, 0.4)
  block(granite, roof, ROOF40, PH - 0.5, 40, 0.4)

  return [
    { part: granite, material: finish('big-pink-granite', 0xdcb8b0) },
    { part: glass, material: { name: 'window', color: 0xc996a5, roughness: 0.35 } },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pdx-us-bancorp-tower', 'U.S. Bancorp Tower', [45.5223138, -122.6761858], 0, build())
