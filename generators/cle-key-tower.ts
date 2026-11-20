/**
 * Key Tower (1988-91, Cesar Pelli & Associates), Public Square, Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-key-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the tower's own axes:
 * placed at bearing 326.2 (OSM's walls run 326.2 / 56.2), so the model's
 * south face (-y) looks south-east over Public Square, its east face (+x)
 * north-east along the Mall. The origin is the OSM outline's centroid
 * (-81.693815, 41.501018); the tower's axis is 3.4 m north of it (model y).
 * z = 0 is the street around the tower (lidar ground 199.0 m NAVD88; it
 * varies by under a metre round the footprint).
 *
 * Form: a 57-storey office tower of warm grey granite with stainless
 * mullions. A square shaft, 41 m across, whose every face has a 20 m centre
 * bay standing a little proud of its flanks; the corners are notched. On the
 * north and south faces the shaft is buttressed by stepped wings, each in
 * the same two widths: the centre bay steps 199 / 112 / 25 m, the flanks
 * 187 / 72 / 48 m, so the broad east and west faces read as a stepped
 * silhouette and the narrow ones as a slab with shoulders. The top storeys of
 * each block are glass (the "glass corners" of the photos). The shaft ends
 * at 228 m on the flanks and 233 m on a cross of the centre bays; on it
 * stands the stepped crown of silver metal, three stages of tiers with
 * stepped corners, the lowest a vertical band carrying a red Key logo on each face,
 * and a short spire. A low block on the west ties the tower to the Society
 * for Savings Building (part of the Key Tower outline in OSM).
 *
 * Sources
 * - OSM (ODbL): outline way/122844679 (height 289, 57 levels, Q684027);
 *   parts way/1521965452 (shaft, 248), way/1521958776 and way/1521958775
 *   (264), way/333475670 (272), way/1521958005 (277), way/1521958777 (289,
 *   spire), way/1521965448..1521965451 (pyramid strips, 256). Used for the
 *   placement and the bearing; the plan and heights come from the lidar,
 *   which sits ~1.5 m south of the OSM outline's south edge.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 0.5 m surface grid, heights above the street: shaft
 *   41.0 x 39.6 m; flank roofs 228.4, centre-bay cross 233.0 (inner square
 *   35 m); wings to y' = +-26.0 (centre 199.1, flanks 186.6), +-30.4 (centre
 *   111.6, flanks 71.9), +-33.0 (centre 24.6, flanks 48.0), centre bays
 *   20.6 m wide (17.2 m in the outermost step); the west link 48.0. The
 *   pyramid's tiers (half-width, top): 16.2 / 241.2, 14.3 / 244.0, 13.2 /
 *   250.3, 9.4 / 253.4, 8.2 / 257.0, 7.2 / 261.0, 4.4 / 264.6, 3.3 / 268.3,
 *   2.1 / 271.0, apex 272.4.
 * - Published: 947 ft (289 m) to the spire, 888 ft (271 m) roof, 57 floors;
 *   four 15 ft (4.6 m) illuminated Key logos at the base of the pyramid
 *   (Wikipedia, "Key Tower"). The lidar apex (272.4) agrees with the roof
 *   figure; the spire, too thin for the lidar, is built to the published
 *   289 m.
 * - Photos (Wikimedia Commons, evidence): Michael Barera, "Cleveland August
 *   2015 13 (Key Tower)" (CC BY-SA 4.0, from the Mall, north-east);
 *   Cards84664, "Key Tower 2022" (CC BY-SA 4.0, from the Terminal Tower,
 *   south, above: the crown, the logos, the wings and colours); Mike Russell,
 *   "Cleveland Key Tower from St. Clair Ave." (CC BY-SA 3.0, the stepped
 *   crown and logo, sunlit); Erik Drost, "Key Tower (23232436903)" (CC BY
 *   2.0, from the Terminal Tower concourse, west); Erik Drost, "Lake Erie
 *   Terminal Tower Skyscraper Skyline Key Tower" (CC BY 2.0, skyline from the
 *   west across the Cuyahoga); Warren LeMay, "Key Center, Cleveland, OH
 *   (27732080467)" (CC0, the granite, mullions and a wing from below).
 * Estimated: the storey height (4.1 m, three storeys a panel group), the
 *   bay width, the glazed top storeys of each block (three storeys, from the
 *   photos), the corner notches (1.2 m), the 0.6 m projection of the centre
 *   bays, the dark granite base (two to three storeys, from Barera's photo),
 *   the logo's size (10.9 m long, 4.6 m high, scaled from the Cards84664
 *   photo, where each spans about a third of its face; the published
 *   "15 ft" reads as their height or is out of date) and shape (bow, shank,
 *   two bits; the bow's cross-shaped hole drawn round), the spire's taper.
 * Colours: granite pulled from the photos' warm taupe grey to the palette's
 *   lightness; the crown is a pale silver.
 * Left out: the stainless mullions (the panel grid stands for them), the
 *   lobby canopies, the rooftop equipment on the pyramid's terraces, the
 *   Marriott hotel (way/122844681, its own building, left to the map), the
 *   small ledge on the east and west flanks at ~200 m.
 * Night: the pyramid is floodlit and the four logos glow red.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, capRing, edgeBase, outward, finishGlb } from './sea-columbia-center'
import { lathe } from './sea-tacoma-union-station'

const CY = 3.4 // the tower's axis, north of the outline centroid
const STOREY = 4.1, GROUP = 3 * STOREY
const FLANK = 228.4, CROSS = 233.0, APEX = 272.4, SPIRE = 289
const BASE_TOP = 10.5 // the dark granite base

const T = (r: XY[]): XY[] => r.map(([x, y]) => [x, y + CY])
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * A square of half-width r whose corners are cut back by n in a staircase
 * of k steps (k = 1: a plain notch), counter-clockwise from above.
 */
function stepped(r: number, n: number, k = 1): XY[] {
  if (n <= 0) return rect(-r, -r, r, r)
  const out: XY[] = []
  for (let q = 0; q < 4; q++) {
    // the corner at (+r, -r) turned by q quarter turns: from the south face onto the east face
    const c = Math.cos((q * Math.PI) / 2), sn = Math.sin((q * Math.PI) / 2)
    const R = (x: number, y: number): XY => [x * c - y * sn, x * sn + y * c]
    out.push(R(r - n, -r))
    for (let i = 1; i <= k; i++) {
      const y = -r + (n * i) / k // up a riser, then along a tread
      out.push(R(r - n + (n * (i - 1)) / k, y), R(r - n + (n * i) / k, y))
    }
  }
  return out
}

function build() {
  const granite = new Part(), base = new Part(), win = new Part(), glass = new Part(), crown = new Part(), neon = new Part()

  // ------------------------------------------------------------ massing (tower-centred, then shifted by CY)
  const WX = 19.9, BX = 20.5, CB = 10.3, NO = 1.2 // flank face, centre-bay face, centre-bay half-width, corner notch
  const SY = 19.8
  // the shaft: E/W centre bays 0.6 m proud of the flanks, notched corners
  const SHAFT: XY[] = [
    [WX - NO, -SY], [WX - NO, -SY + NO], [WX, -SY + NO], [WX, -10], [BX, -10], [BX, 10], [WX, 10], [WX, SY - NO], [WX - NO, SY - NO], [WX - NO, SY],
    [CB, SY], [-CB, SY],
    [-WX + NO, SY], [-WX + NO, SY - NO], [-WX, SY - NO], [-WX, 10], [-BX, 10], [-BX, -10], [-WX, -10], [-WX, -SY + NO], [-WX + NO, -SY + NO], [-WX + NO, -SY],
    [-CB, -SY], [CB, -SY],
  ]
  // the cross of centre bays and the inner square, above the flanks' roof
  const IN = 17.5
  const CROSSR: XY[] = [
    [BX, -10], [BX, 10], [IN, 10], [IN, IN], [CB, IN], [CB, SY], [-CB, SY], [-CB, IN], [-IN, IN], [-IN, 10], [-BX, 10], [-BX, -10],
    [-IN, -10], [-IN, -IN], [-CB, -IN], [-CB, -SY], [CB, -SY], [CB, -IN], [IN, -IN], [IN, -10],
  ]
  type Block = Prism & { glassTop: boolean; base: boolean }
  const blocks: Block[] = []
  const add = (ring: XY[], z1: number, kind: string, z0 = 0, glassTop = true, isBase = true) =>
    blocks.push({ ring: ccw(T(ring)), z0, z1, wall: granite, roof: crown, kind, glassTop, base: isBase })
  add(SHAFT, FLANK, 'shaft')
  add(CROSSR, CROSS, 'cross', FLANK, true, false)
  for (const s of [1, -1]) {
    const y = (a: number, b: number): [number, number] => (s > 0 ? [a, b] : [-b, -a])
    const [a0, a1] = y(SY, 26.0), [b0, b1] = y(26.0, 30.4), [c0, c1] = y(30.4, 33.0)
    add(rect(-CB, a0, CB, a1), 199.1, 'wing')
    add(rect(CB, a0, WX, a1), 186.6, 'wing')
    add(rect(-WX, a0, -CB, a1), 186.6, 'wing')
    add(rect(-CB, b0, CB, b1), 111.6, 'wing')
    add(rect(CB, b0, WX, b1), 71.9, 'wing')
    add(rect(-WX, b0, -CB, b1), 71.9, 'wing')
    add(rect(-8.6, c0, 8.6, c1), 24.6, 'porch', 0, false)
    add(rect(8.6, c0, WX, c1), 48.0, 'wing')
    add(rect(-WX, c0, -8.6, c1), 48.0, 'wing')
  }
  // the link to the Society for Savings Building, inside Key Tower's outline
  blocks.push({ ring: ccw(rect(-24.9, -21.0, -WX, 5.7)), z0: 0, z1: 48.0, wall: granite, roof: crown, kind: 'link', glassTop: false, base: true })

  for (const B of blocks) {
    const r = B.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(blocks, B, i)
      if (z0 >= B.z1 - 0.01) continue
      const a = r[i], b = r[(i + 1) % r.length]
      wall(a, b, z0, B.z1, B.base)
      panels(a, b, z0, B.z1, B.glassTop, B.kind === 'porch')
    }
    capRing(B.roof, r, B.z1)
  }

  /** A wall over a→b, the dark base below BASE_TOP; low faces split ≤ 5 m for the terrain. */
  function wall(a: XY, b: XY, z0: number, z1: number, hasBase: boolean) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.01) return
    const at = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
    let zb = z0
    if (hasBase && z0 < BASE_TOP) {
      zb = Math.min(BASE_TOP, z1)
      const n = Math.max(1, Math.ceil(L / 5))
      for (let k = 0; k < n; k++) base.quad(at(k / n, z0), at((k + 1) / n, z0), at((k + 1) / n, zb), at(k / n, zb))
    }
    if (z1 > zb + 0.01) granite.quad(at(0, zb), at(1, zb), at(1, z1), at(0, z1))
  }

  /**
   * Window panels on a wall: bays of ~4 m between granite piers, three
   * storeys a panel with spandrels between, counted from the street so they
   * line up across blocks. The top group of a block is glass (window-2) with
   * slimmer piers. The base gets tall shopfront panels.
   */
  function panels(a: XY, b: XY, z0: number, z1: number, glassTop: boolean, porch: boolean) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) return
    const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], d = 0.06
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
    const quad = (part: Part, s0: number, s1: number, lo: number, hi: number) => part.quad(P(s0, lo), P(s1, lo), P(s1, hi), P(s0, hi))
    const bays = (bayW: number, pier: number, inset: number): [number, number][] => {
      const k = Math.max(1, Math.round((L - 2 * inset) / bayW)), w = (L - 2 * inset) / k, out: [number, number][] = []
      for (let i = 0; i < k; i++) out.push([inset + i * w + pier / 2, inset + (i + 1) * w - pier / 2])
      return out
    }
    if (porch) {
      // the entrance front: one tall glazed opening between granite piers
      for (const [s0, s1] of bays(5.6, 1.4, 1.0)) quad(glass, s0, s1, 1.0, z1 - 4)
      return
    }
    // a wing's narrow return walls are glazed over their top three groups
    // (the glass corners of the photos), the broad faces over the top group
    const ret = glassTop && L < 7.5 && z1 - z0 > 4 * GROUP
    const top = ret ? z1 - 3 * GROUP + 1.0 : glassTop ? z1 - GROUP + 1.0 : z1
    if (z0 < BASE_TOP - 1) for (const [s0, s1] of bays(5.2, 1.7, 1.2)) quad(win, s0, s1, Math.max(z0, 0) + 1.0, BASE_TOP - 1.6)
    const regular = bays(3.7, 0.95, 1.0)
    for (let k = 1; BASE_TOP + (k - 1) * GROUP < top; k++) {
      const g0 = BASE_TOP + (k - 1) * GROUP + 0.9, g1 = BASE_TOP + k * GROUP - 0.9
      if (g0 < z0 + 0.5 || g1 > top - 0.3) continue
      for (const [s0, s1] of regular) quad(win, s0, s1, g0, g1)
    }
    if (ret) for (const [s0, s1] of bays(L, 0, 0.7)) quad(glass, s0, s1, z1 - 3 * GROUP + 1.6, z1 - 1.2)
    else if (glassTop && z1 - z0 > GROUP + 2) {
      for (const [s0, s1] of bays(6.0, 0.7, 0.8)) quad(glass, s0, s1, z1 - GROUP + 1.6, z1 - 1.2)
    }
  }

  // ------------------------------------------------------------ the crown: stepped pyramid, logos, spire
  // [half-width, top, corner cut, steps]. The corners stand well below the
  // face centres in the lidar, so each tier is a cross with stepped corners;
  // the photos show three stages above the logo band.
  const tiers: [number, number, number, number][] = [
    [16.2, 241.2, 1.7, 2], // the logo band
    [13.6, 243.0, 0.4, 1], [13.4, 245.5, 1.2, 2], [13.3, 248.0, 2.2, 2], [13.2, 250.3, 3.2, 2], // the lower stage
    [9.4, 253.4, 0.9, 1], [8.8, 256.4, 1.8, 2], [8.2, 258.8, 2.3, 2], [7.6, 261.0, 2.6, 2], // the middle stage
    [4.4, 264.6, 0.3, 1], [3.6, 267.0, 0.8, 1], [2.6, 269.5, 0.6, 1], [1.6, 271.2, 0, 1], [1.0, APEX, 0, 1], // the top
  ]
  let z = CROSS
  for (const [r, top, cut, k] of tiers) {
    const ring = ccw(T(stepped(r, cut, k)))
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      crown.quad([a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], top], [a[0], a[1], top])
    }
    capRing(crown, ring, top)
    z = top
  }
  lathe(crown, 0, CY, [[0.95, APEX], [0.75, APEX + 2.5], [0.55, APEX + 3.0], [0.4, 281], [0.16, SPIRE]], 8)

  // the Key logo on each face of the lowest tier: bow, shank, two bits
  const LR = 16.2, LZ = 237.5
  for (let f = 0; f < 4; f++) {
    const ang = (f * Math.PI) / 2
    const nx = Math.cos(ang), ny = Math.sin(ang), tx = -ny, ty = nx // outward normal, rightward seen from outside
    const P = (s: number, zz: number): V3 => [nx * (LR + 0.07) + tx * s, ny * (LR + 0.07) + ty * s + CY, zz]
    const N: V3 = [nx, ny, 0]
    const tri = (p: V3, q: V3, r: V3) => neon.tri(p, q, r, undefined, undefined, undefined, [N, N, N])
    const box = (s0: number, s1: number, z0: number, z1: number) => { tri(P(s0, z0), P(s1, z0), P(s1, z1)); tri(P(s0, z0), P(s1, z1), P(s0, z1)) }
    const bs = -3.3, ro = 2.3, ri = 1.0, seg = 16
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
      const o0 = P(bs + ro * Math.cos(a0), LZ + ro * Math.sin(a0)), o1 = P(bs + ro * Math.cos(a1), LZ + ro * Math.sin(a1))
      const i0 = P(bs + ri * Math.cos(a0), LZ + ri * Math.sin(a0)), i1 = P(bs + ri * Math.cos(a1), LZ + ri * Math.sin(a1))
      tri(o0, o1, i1); tri(o0, i1, i0)
    }
    box(bs + ro - 0.2, 5.3, LZ - 0.55, LZ + 0.55) // shank
    box(2.9, 3.8, LZ - 2.0, LZ - 0.55) // bits
    box(4.4, 5.3, LZ - 2.0, LZ - 0.55)
  }

  // ------------------------------------------------------------ materials and night
  // The pyramid is floodlit; faces looking up catch less.
  const lit = (_p: V3, nn: V3) => (nn[2] > 0.7 ? 0.35 : 1)
  const crownMat = { ...finish('key-crown', 0xd6dadb), floodlight: (p: V3, nn: V3) => (p[2] > CROSS - 0.5 ? lit(p, nn) : 0) }
  return finishGlb('cle-key-tower', 'Key Tower', [
    { part: granite, material: finish('key-granite', 0xc8bdae) },
    { part: base, material: finish('key-granite-base', 0xb19f91) },
    { part: win, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0xa9bfd1) },
    { part: crown, material: crownMat },
    { part: neon, material: finish('neon-key-red', 0xc8333b) },
  ], { bearing: 326.2, height: SPIRE, replaces: ['way/122844679'] }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/cle-key-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
