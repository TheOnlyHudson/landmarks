/**
 * 200 Public Square (the BP Building, 1985, Hellmuth, Obata & Kassabaum),
 * Cleveland: procedural, CC0-1.0.
 * bun generators/cle-200-public-square.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 0. The origin
 * is the OSM outline's area centroid (-81.6918107, 41.5000140); z = 0 is the
 * lowest ground under the footprint (lidar ground_min 198.35 m NAVD88; the
 * streets round the block lie 0-2 m above it).
 *
 * Form: a 45-storey office slab of pinkish-tan granite with punched windows,
 * bent in plan: its southern half runs on Euclid Avenue's grid (bearing
 * 349.5), its northern half turns 23.5 degrees onto Public Square's grid
 * (bearing 326), so the long west and east faces each break in a shallow V
 * (the "V" seen from the square). Each half is 43 m wide; its narrow end is
 * stepped back in four steps to a 14 m centre bay, and the steps run the
 * whole height (the stepped corners). At the top the slab steps in four
 * tiers of three storeys, the end bays rising with them, so both the long
 * and the short faces end in stepped shoulders. At its foot on the west, a
 * terraced granite podium of six to ten storeys wraps a stepped glass atrium
 * that faces the square.
 *
 * Sources
 * - OSM (ODbL): outline way/112985831 (height 201, 45 levels, Q2814434);
 *   parts way/333522136 (191), way/333522137 (154), way/333522134 (38),
 *   way/333522135 (33), way/333522138 and way/333522139 (no height), all
 *   replaced. The podium's plan is OSM's; the tower's is the lidar's (the
 *   OSM part heights are rough).
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m surface grid. Read in two frames turned to bearings
 *   349.5 and 326, the two halves have the same section, centred 25.5 m east
 *   of the anchor's axis line: tiers 43 / 33 / 23 / 14.5 m wide with tops
 *   162.5 / 174.5 / 187.5 / 199.5 m (parapet 201-202); the ends reach 29 m
 *   from the bend at full width, then step to 32, 36 and 41 m. The podium
 *   terraces step 28-31, 33-35, 37-39, 41-43 m, the atrium top 43-46 m.
 * - Published: 658 ft (201 m), 45 storeys (Wikipedia "200 Public Square";
 *   Emporis/CTBUH). The lidar top agrees.
 * - Photos (Wikimedia Commons, evidence): EurekaLott, "200 Public Square"
 *   (CC BY-SA 3.0, from the square, west: the slab, its stepped top, the
 *   glass atrium on its podium); Karla Kaulfuss, "BP Tower" (CC BY 2.0, from
 *   the square: the bent face, stepped shoulders, the big top windows);
 *   Erik Drost, "BP Building (7382095642)" (CC BY 2.0, from the south-east:
 *   the podium's south front and atrium glazing); Erik Drost, "Downtown
 *   Cleveland - Key Tower, BP Building, and May Company Building" (CC BY 2.0,
 *   from the south); Erik Drost, "200 Public Square (13484245195)" (CC BY
 *   2.0, the granite and windows from below); Cards84664, "200 Public Square
 *   (2)" (CC BY-SA 4.0, the atrium's stepped glass roof from inside).
 * - USGS NAIP orthophoto (public domain): the podium's terraces and the
 *   atrium's glass in plan.
 * Estimated: storey height (4.06 m, three storeys a panel group), the bay
 *   rhythm (3.6 m with 1.3 m piers, from the photos' window columns), the
 *   podium's terraces simplified to four (30, 34.5, 39, 44 m), the atrium's
 *   extent (from NAIP and lidar), the glass on the podium's west front.
 * Colours: the granite is a warm pinkish tan in sunlit photos, pulled to the
 *   palette's lightness.
 * Left out: the Huntington signs, the lobby canopies, rooftop equipment,
 *   the small ledges in the crown's stepped corners (166-196 m).
 * Doubts: the bend's exact line (taken as the bisector where the two halves'
 *   lidar centrelines cross); the podium's east side under the tower.
 * Night: office windows glow; the atrium glass stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, ccw, capRing, edgeBase, outward, finishGlb, type Prism } from './sea-columbia-center'

// ================================================================ shared helpers (also used by other cle- models of mine)

/** A point in a frame turned to `bearing` (its +y), about the anchor, in east/north metres. */
export function framed(bearing: number) {
  const b = (bearing * Math.PI) / 180
  return (x: number, y: number): XY => [x * Math.cos(b) + y * Math.sin(b), -x * Math.sin(b) + y * Math.cos(b)]
}

/** Inset a simple ring (counter-clockwise) by d, mitring each corner. */
export function inset(r: XY[], d: number): XY[] {
  const n = r.length, lines: [XY, XY][] = []
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n], o = outward(a, b)
    lines.push([[a[0] - o[0] * d, a[1] - o[1] * d], [b[0] - a[0], b[1] - a[1]]])
  }
  return lines.map((l, i) => {
    const p = lines[(i - 1 + n) % n]
    const [p0, pd] = p, [q0, qd] = l
    const den = pd[0] * qd[1] - pd[1] * qd[0]
    if (Math.abs(den) < 1e-9) return q0
    const t = ((q0[0] - p0[0]) * qd[1] - (q0[1] - p0[1]) * qd[0]) / den
    return [p0[0] + pd[0] * t, p0[1] + pd[1] * t] as XY
  })
}

export type Grid = {
  /** bay width and pier between panels */ bay: number; pier: number
  /** storey group height and the spandrel between groups */ group: number; spandrel: number
  /** groups counted from this height */ from?: number
  /** keep panels this far from the face's ends */ edge?: number
  /** keep panels this far below the top */ head?: number
  /** keep panels this far above the face's foot */ foot?: number
}

/**
 * Window panels over a→b (a counter-clockwise edge) between z0 and z1:
 * bays between piers, storey groups with spandrels, set 0.06 m proud.
 */
export function panels(part: Part, a: XY, b: XY, z0: number, z1: number, g: Grid) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const edge = g.edge ?? 0.9
  if (L < 2 * edge + 1.2) return
  const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], d = 0.06
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  const k = Math.max(1, Math.round((L - 2 * edge + g.pier) / (g.bay + g.pier)))
  const w = (L - 2 * edge - (k - 1) * g.pier) / k
  if (w < 0.8) return
  const from = g.from ?? 0, lo0 = z0 + (g.foot ?? 0.8), hi0 = z1 - (g.head ?? 1.5)
  for (let j = Math.floor((lo0 - from) / g.group); from + j * g.group < hi0; j++) {
    const lo = Math.max(from + j * g.group + g.spandrel / 2, lo0), hi = Math.min(from + (j + 1) * g.group - g.spandrel / 2, hi0)
    if (hi - lo < 1.5) continue
    for (let i = 0; i < k; i++) {
      const s0 = edge + i * (w + g.pier), s1 = s0 + w
      part.quad(P(s0, lo), P(s1, lo), P(s1, hi), P(s0, hi))
    }
  }
}

/** A wall quad over a→b, split into pieces ≤ 5 m long below `low` for the terrain. */
export function wallQuad(part: Part, a: XY, b: XY, z0: number, z1: number, low = 6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 0.01 || z1 <= z0) return
  const at = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
  const zs = Math.min(z1, Math.max(z0, low))
  if (z0 < low) {
    const m = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < m; k++) part.quad(at(k / m, z0), at((k + 1) / m, z0), at((k + 1) / m, zs), at(k / m, zs))
  }
  if (z1 > zs + 0.01) part.quad(at(0, zs), at(1, zs), at(1, z1), at(0, z1))
}

export type Block = Prism & { grid?: Grid | null; wallPart?: Part; panelPart?: Part; /** draw every wall, even where a neighbour covers it */ solid?: boolean }

/** Walls (hidden where a neighbour covers them), panels and roof caps for a set of prisms. */
export function buildBlocks(blocks: Block[], win: Part) {
  for (const B of blocks) {
    const r = B.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = B.solid ? (B.z0 ?? 0) : edgeBase(blocks, B, i)
      if (z0 >= B.z1 - 0.01) continue
      const a = r[i], b = r[(i + 1) % r.length]
      wallQuad(B.wallPart ?? B.wall, a, b, z0, B.z1)
      if (B.grid) panels(B.panelPart ?? win, a, b, z0, B.z1, B.grid)
    }
    capRing(B.roof, r, B.z1)
  }
}

export async function writeModel(id: string, built: { glb: Uint8Array; triangles: number }) {
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, built.glb)
  console.log(`${out}: ${built.triangles} triangles, ${built.glb.length} bytes (${(built.glb.length / 1024).toFixed(1)} KiB)`)
}

export type { XY, Swatch }

// ================================================================ the model

const A = framed(349.5), B = framed(326) // the southern and northern halves' frames
const XC = 25.5 // both halves' centrelines, east of the anchor in their own frames
const T1 = 162.5, T2 = 174.5, T3 = 187.5, T4 = 199.5, TOP = 201
const STOREY = 4.06, GROUP = 3 * STOREY

/**
 * The plan of the bent slab at one tier: each half is a stack of
 * rectangles [half-width, reach from the bend], widest first, drawn as one
 * stepped outline; the halves are mitred on the bend so they meet exactly.
 */
function slab(profile: [number, number][]): XY[] {
  const m = Math.tan((11.75 * Math.PI) / 180)
  // south half in frame A (bend at y = +5.3, running to -y), north half in
  // frame B (bend at y = -5.3, running to +y); the convex side is +x (east)
  const side = (north: boolean): XY[] => {
    const F = north ? B : A, yb = north ? -5.3 : 5.3, dir = north ? 1 : -1
    const pts: XY[] = []
    // up the east side from the bend to the end, across, and back down the west
    const w0 = profile[0][0]
    pts.push([XC + w0, yb - dir * w0 * m])
    profile.forEach(([w, u], k) => {
      if (k) pts.push([XC + w, yb + dir * profile[k - 1][1]])
      pts.push([XC + w, yb + dir * u])
    })
    for (let k = profile.length - 1; k >= 0; k--) {
      const [w, u] = profile[k]
      pts.push([XC - w, yb + dir * u])
      if (k) pts.push([XC - w, yb + dir * profile[k - 1][1]])
    }
    pts.push([XC - w0, yb + dir * w0 * m])
    return pts.map(([x, y]) => F(x, y))
  }
  const s = side(false), n = side(true)
  // south: east-bend → … → west-bend; north: east-bend → … → west-bend; join east-bend(s) … west-bend(s), west-bend(n) … east-bend(n)
  return ccw([...s, ...n.reverse()])
}

function build() {
  const granite = new Part(), base = new Part(), win = new Part(), glass = new Part(), roof = new Part()

  const shaft: Grid = { bay: 2.6, pier: 2.2, group: GROUP, spandrel: 3.4, from: 0, edge: 0.8, head: 1.6 }
  const crown: Grid = { bay: 2.8, pier: 2.0, group: 13, spandrel: 0, from: 0, edge: 0.8, head: 2.2, foot: 1.8 }
  const blocks: Block[] = []
  const add = (ring: XY[], z0: number, z1: number, kind: string, grid: Grid | null, wall = granite, top = roof, panelPart = win) =>
    blocks.push({ ring, z0, z1, wall, roof: top, kind, grid, panelPart })

  // [half-width, reach from the bend] per tier, from the lidar
  add(slab([[21.5, 29], [16, 32], [11.5, 36], [7, 41]]), 0, T1, 'tower', shaft)
  add(slab([[16.5, 29], [11.5, 36], [7, 41]]), T1, T2, 'tower', crown)
  add(slab([[11.5, 29], [7, 33]]), T2, T3, 'tower', crown)
  add(slab([[7, 29]]), T3, T4, 'tower', crown)
  add(slab([[5.5, 26]]), T4, TOP, 'parapet', null)

  // ------------------------------------------------------------ the podium and atrium
  // OSM's outline on the west, closed inside the tower
  const P1: XY[] = ccw([[-56.3, 3.4], [-42.0, -17.2], [-37.8, -41.8], [-5.6, -35.9], [20.6, -31.0], [18, -12], [18, 15], [-7.0, 36.8]])
  const podGrid: Grid = { bay: 3.4, pier: 1.2, group: 2 * STOREY, spandrel: 1.6, from: 0, edge: 1.0, head: 1.4 }
  add(P1, 0, 30, 'podium', podGrid)
  const P2 = inset(P1, 5), P3 = inset(P1, 10), P4 = inset(P1, 15)
  // the terraces: granite on the north-west wing and the south, glass where the atrium faces the square
  add(P2, 30, 34.5, 'terrace', null, granite, roof)
  add(P3, 34.5, 39, 'terrace', null, glass, glass)
  add(P4, 39, 44, 'atrium', null, glass, glass)
  for (const b of blocks.slice(-3)) b.solid = true

  buildBlocks(blocks, win)

  // the atrium's glass front on the square: the podium's two west faces, between granite ends
  const front = (a: XY, b: XY, s0: number, s1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.08, a[1] + t[1] * s + n[1] * 0.08, z]
    glass.quad(P(s0, 0.5), P(s1, 0.5), P(s1, 26), P(s0, 26))
  }
  front([-42.0, -17.2], [-37.8, -41.8], 4, 20)
  front([-56.3, 3.4], [-42.0, -17.2], 9, 25)

  return finishGlb('cle-200-public-square', '200 Public Square', [
    { part: granite, material: finish('bp-granite', 0xcfb4a5) },
    { part: base, material: finish('bp-granite-base', 0xb59d90) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 0, height: TOP, replaces: ['way/112985831'] }, 6500)
}

if (import.meta.main) await writeModel('cle-200-public-square', build())
