/**
 * Wells Fargo Center (Norwest Center, 1988, Cesar Pelli), Minneapolis —
 * original procedural geometry, CC0-1.0.
 * bun generators/msp-wells-fargo-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +y runs up Marquette Avenue,
 * north-north-east). Origin at the anchor, the area centroid of the OSM
 * outline way/41763762 (-93.2707238, 44.9768987), on the lowest ground under
 * it.
 *
 * Form: a slab of warm Kasota stone, 34 x 52 m, with dense vertical piers
 * between bronze-glass bays. Its corners notch in and the top steps up in a
 * wedding-cake crown — a ring at 187 m, a cross of wings at 199 and 215 m, a
 * broad tier at 224 m, a long ridge at 231 m and the top at 236 m — lit gold
 * at night. A 144-148 m wing stands against the north end and an 88-96 m
 * wing against the south; low 21-28 m blocks (the rotunda lobby) fill the
 * rest of the outline to the west and north.
 *
 * Sources
 * - OSM: outline way/41763762 (4 levels); part way/461224213 (the tower and
 *   its two wings, height 236, 56 levels).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, above
 *   ground 259.2 m NAVD88; the tower's upper half is classified as high
 *   noise, class 18, in this dataset and was read with class 18 kept): every
 *   tier's extent and height as listed in TIERS below, the north wing 144 m
 *   (148 m over its middle), the south wing 88 m (96 m middle), the low
 *   blocks 21 m and 28 m and the rotunda's raised roof ~28 m.
 * - Published: 236 m (775 ft), 57 storeys, 1988, Cesar Pelli & Associates,
 *   Kasota stone (Wikipedia, "Wells Fargo Center (Minneapolis)").
 * - Photos (Wikimedia Commons, all evidence):
 *   "Wells Fargo Center from Foshay.jpg", public domain (Mulad, from the
 *     Foshay deck, south-west): the setbacks, wings, colours.
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_from_Foshay.jpg
 *   DeltaMSP, "Wells Fargo Center of Minneapolis, 2021.jpg", CC BY-SA 4.0
 *     (from the east): the stepped crown and its pale fins.
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_of_Minneapolis,_2021.jpg
 *   Michael Barera, "Minneapolis April 2025 01 (Wells Fargo Center).jpg"
 *     (night, from the south on Marquette) and "... 06 ..." (day), CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_01_(Wells_Fargo_Center).jpg
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_06_(Wells_Fargo_Center).jpg
 *   AlexiusHoratius, "Wells Fargo Center Minneapolis night 1.jpg", CC BY-SA 3.0:
 *     the gold-lit crown. https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_Minneapolis_night_1.jpg
 *   Gabriel Vanslette, "Wells Fargo Center (Minneapolis) - panoramio.jpg",
 *     CC BY 3.0: the piers and bronze glass up close.
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_(Minneapolis)_-_panoramio.jpg
 *
 * Measured: all heights and tier plans (lidar, made symmetric about the
 * slab's centre lines, which they are to within a metre).
 * Photos: each face has a pale central band of silver glass between white
 * fins, full height, drawn as the pale window colour over the middle bays.
 * Estimated: the bay width (3.4 m) and three-storey panel groups; colours
 * from the daylight photos; the rotunda drawn as a low glass hip roof.
 *
 * Night: the crown from the 187 m ring up is lit gold: its stone carries a
 * floodlight wash, and its pale fin-and-glass bays are a gold neon material
 * (pale gold by day), as in the night photos.
 *
 * Doubts: a lower strip across the top ridge (~231 m inside the 236 m top)
 * is left out; the low blocks' facades are plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, edgePanels, finishGlb } from './sea-rainier-square-tower'

const CX = -7.5, CY = -13.5
/** A rectangle, or a cross: the wide x span over the middle y span and the narrow x span over the full y span. Half sizes about the slab centre. */
function cross(ax: number, ay: number, bx = ax, by = ay): XY[] {
  // ax, ay: the narrow x half and full y half; bx, by: the wide x half and middle y half
  if (bx <= ax) return ccw([[CX - ax, CY - ay], [CX + ax, CY - ay], [CX + ax, CY + ay], [CX - ax, CY + ay]])
  return ccw([
    [CX - ax, CY - ay], [CX + ax, CY - ay], [CX + ax, CY - by], [CX + bx, CY - by], [CX + bx, CY + by], [CX + ax, CY + by],
    [CX + ax, CY + ay], [CX - ax, CY + ay], [CX - ax, CY + by], [CX - bx, CY + by], [CX - bx, CY - by], [CX - ax, CY - by],
  ])
}

const CROWN = 183 // floodlit above

type G = { group: number; spandrel: number; pier: number; bayW: number; head: number; foot: number; inset: number }
/** Bay panels on edge i (as edgePanels), each bay's part chosen by where its centre falls along the edge (0-1). */
function bayPanels(r: XY[], i: number, z0: number, z1: number, g: G, pick: (t: number, L: number) => Part) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * g.inset + 1.2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]], o = 0.05
  const bays = Math.max(1, Math.round((L - 2 * g.inset) / g.bayW)), w = (L - 2 * g.inset) / bays
  const lo0 = z0 + g.foot, hi0 = z1 - g.head
  for (let k = 0; k < bays; k++) {
    const s = g.inset + k * w + (k ? g.pier / 2 : 0), e = g.inset + (k + 1) * w - (k < bays - 1 ? g.pier / 2 : 0)
    const part = pick((s + e) / 2 / L, L)
    const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * o, a[1] + t[1] * u + n[1] * o, z]
    for (let m = Math.floor(lo0 / g.group); m * g.group < hi0; m++) {
      const lo = Math.max(m * g.group + g.spandrel / 2, lo0), hi = Math.min((m + 1) * g.group - g.spandrel / 2, hi0)
      if (hi - lo < 2.5) continue
      part.quad(P(s, lo), P(e, lo), P(e, hi), P(s, hi))
    }
  }
}

function build() {
  const stone = new Part(), win = new Part(), paleWin = new Part(), crownGold = new Part(), roof = new Part(), glass = new Part(), low = stone
  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string, wall = stone, z0 = 0) => prisms.push({ ring: chamfer(ring, 0.45), z1, z0, wall, roof, kind })
  // ---- the tower's tiers (lidar)
  add(cross(15.5, 26, 17, 24.5), 187, 'tower') // the shaft, its corners notched 1.5 m
  add(cross(12, 26, 17, 16), 199, 'tower', stone, 187)
  add(cross(9, 26), 203, 'tower', stone, 187)
  add(cross(12, 22, 15, 16), 215, 'tower', stone, 187)
  add(cross(13, 17.5), 224, 'tower', stone, 187)
  add(cross(8, 22.75), 231, 'tower', stone, 187)
  add(cross(6, 21.5), 236, 'tower', stone, 187)
  // ---- the wings against the ends
  add(ccw([[-24.5, 12.5], [9.5, 12.5], [9.5, 24.5], [-24.5, 24.5]]), 144, 'wing')
  add(ccw([[-14.5, 12.5], [-0.5, 12.5], [-0.5, 24.5], [-14.5, 24.5]]), 148, 'wing')
  add(ccw([[-24.4, -48.5], [9.8, -48.2], [9.6, -39.5], [-24.5, -39.5]]), 88, 'wing')
  add(ccw([[-15.5, -48.4], [0.5, -48.3], [0.5, -39.5], [-15.5, -39.5]]), 96, 'wing')
  // ---- low blocks in the rest of the outline
  add(ccw([[-31.6, -36.9], [-24.4, -37.4], [-24.5, 24.5], [-30.7, 24.5]]), 28, 'low', low)
  add(ccw([[-30.7, 24.5], [9.6, 24.5], [8.7, 49.0], [-30.4, 48.3]]), 21, 'low', low)

  const grid = { group: 3 * 4.05, spandrel: 1.4, pier: 1.6, bayW: 3.3, head: 1.6, foot: 1.0, inset: 0.9 }
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      // split the wall at the crown line so the floodlight wash starts there
      if (z0 < CROWN && Q.z1 > CROWN) { wallEdge(Q.wall, r, i, z0, CROWN); wallEdge(Q.wall, r, i, CROWN, Q.z1) }
      else wallEdge(Q.wall, r, i, z0, Q.z1)
      if (Q.kind === 'low') { edgePanels(win, r, i, z0, Q.z1, { group: 5.5, spandrel: 2.2, pier: 1.2, bayW: 6, head: 2, foot: 1.2 }, false); continue }
      // the pale central band of silver glass on each face of the shaft and wings
      const pick = (lo: number) => (t: number, L: number) => lo >= CROWN ? crownGold : L > 20 && Math.abs(t - 0.5) < 0.19 ? paleWin : win
      if (Q.z1 > CROWN && z0 < CROWN) {
        bayPanels(r, i, z0, CROWN, grid, pick(z0))
        bayPanels(r, i, CROWN, Q.z1, grid, pick(CROWN))
      } else bayPanels(r, i, z0, Q.z1, grid, pick(z0))
    }
    if (!(Q.kind === 'low' && Q.z1 === 21)) capRing(Q.roof, r, Q.z1)
  }
  // the north block's roof, with the rotunda's raised glass hip over its middle
  capRing(roof, prisms[prisms.length - 1].ring, 21)
  { const x0 = -17, x1 = -5, y0 = 28.5, y1 = 44.5, zr = 28.5, zb = 21.02
    const A: V3 = [x0, y0, zb], B: V3 = [x1, y0, zb], C: V3 = [x1, y1, zb], D: V3 = [x0, y1, zb]
    const P: V3 = [(x0 + x1) / 2, y0 + 5, zr], Q: V3 = [(x0 + x1) / 2, y1 - 5, zr]
    glass.tri(A, B, P); glass.quad(B, C, Q, P); glass.tri(C, D, Q); glass.quad(D, A, P, Q) }

  const crownLit = (p: V3, n: V3) => (p[2] < CROWN - 0.1 ? 0 : n[2] > 0.8 ? 0.35 : 1)
  const KASOTA = { ...finish('wfc-kasota', 0xe2c9a2), floodlight: crownLit }
  return finishGlb('msp-wells-fargo-center', 'Wells Fargo Center', [
    { part: stone, material: KASOTA },
    { part: win, material: { ...PALETTE.window, color: 0x6b7480 } },
    { part: paleWin, material: windowVariant(2, 0xb9bfc0) },
    { part: crownGold, material: finish('neon-wfc-crown', 0xebd396) },
    { part: roof, material: { ...PALETTE.roof, color: 0xcabfae } },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 30.5, height: 236, replaces: ['way/41763762', 'way/461224213'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-wells-fargo-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
