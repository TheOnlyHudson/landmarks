/**
 * Terminal Tower (1927-30, Graham, Anderson, Probst & White), Public Square,
 * Cleveland, with the Tower City podium OSM ties into its outline:
 * procedural, CC0-1.0.
 * bun generators/cle-terminal-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the tower's own axes:
 * placed at bearing 4.5 (the lidar's walls; OSM's run 3.6-5.2). The origin
 * is the tower's axis (-81.693901, 41.498271); z = 0 is Public Square in
 * front of the north entrance (200.7 m NAVD88), the lowest ground the
 * outline touches. Huron Road behind is about 4 m higher.
 *
 * Form: a 52-storey Beaux-Arts tower of buff limestone, square in plan,
 * rising from a fourteen-storey podium (the old Union Terminal office
 * block, now Tower City Center) that wraps its east, west and south sides.
 * The shaft rises sheer to the 34th floor; then a square setback stage with
 * an obelisk at each corner; a narrower, chamfered square stage ringed with
 * columns, a balustrade and corner urns; a round drum with oculi, a round
 * colonnade (the peristyle), a drum with small round windows, a pointed
 * dome, and a gilded lantern and spire. On Public Square the low entrance
 * block with its three great arches; behind the tower, a lower court whose
 * glass dome lights the old concourse.
 *
 * Sources
 * - OSM (ODbL): outline way/333475727; parts way/333475728 (shaft),
 *   way/1534906094 (setback stage), way/333475732 and way/333475733
 *   (round top stages), way/333475730 (podium, 60 m), way/333475729 (south
 *   court, 15 m), way/333475731 (its glass dome), way/333475734 (Public
 *   Square entrance block, 20 m). The plans of the podium, court and
 *   entrance block are OSM's, turned into the model frame.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain),
 *   1 m and 0.5 m surface grids, heights above Public Square: podium roof
 *   60.5-65 (61.5 used); entrance block 16.9; south court 16.2-19; shaft
 *   31 x 30 m to 132.6 (parapet 134); setback stage 25.5 m square to 145.3,
 *   with corner obelisks to 153-158; the colonnaded stage 16.5 m square to
 *   173.9, urns to 175-178; the round stages 10.5 m across to 193.5; the
 *   dome's drum to ~200, the lantern ~208-211; the spire 222.9; a lone
 *   return at 229.9 is the flagpole.
 * - Published: 52 storeys, 708 ft (215.8 m) roof, 771 ft to the antenna;
 *   floodlights on the 44th, 48th and 52nd floors (Wikipedia "Terminal
 *   Tower"; CTBUH). The lidar spire stands ~7 m higher than the published
 *   roof; the model follows the lidar.
 * - Photos (Wikimedia Commons): Michael Barera 2015 (from Public Square,
 *   north), Erik Drost "Terminal Tower Blue Skies" (the top stages, from the
 *   north-east, above the podium), Chris Light (from the Federal Building,
 *   above, south-east), Cards84664 (the Public Square arches), Chris Gent
 *   (the lantern), Erik Drost (the gilded dome, sunset from the west), Chris
 *   Light (from the river, the podium's west side). Credits in the catalog.
 * Estimated: the column and window rhythms of the top stages (four columns
 *   a face, sixteen round the peristyle), the dome's ogee profile between
 *   the lidar rings, the shaft's bay count (seven a face, three storeys a
 *   panel), the podium's windows; the obelisks' taper.
 * Left out: the podium's light courts (OSM maps it solid), the arched
 *   window band at the shaft's top, the clock, lettering, the flagpole and
 *   antenna, the low ramps in the outline's south-west corner (lidar shows
 *   them at street level, so nothing is drawn there).
 * Night: floodlit white from the 44th, 48th and 52nd floors: the top
 *   stages brightest, the shaft washed more faintly downwards, the podium
 *   left to its windows. (The crown is sometimes lit in colours; this is the
 *   everyday white.)
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, type Grid, ccw, capRing, chamfer, edgeBase, edgePanels, wallEdge, finishGlb } from './sea-columbia-center'
import { prism, rect, lathe, disc } from './sea-tacoma-union-station'

const PODIUM = 61.5, SHAFT = 132.6, S2 = 145.3, S3 = 173.9, S4 = 193.5

// OSM rings in the model frame (metres), from the ways named above.
const PODIUM_RING: XY[] = [[14.4, -15.6], [-15.1, -15.3], [-14.7, -48.5], [-34.8, -48.3], [-34.5, -18.5], [-32.3, -18.5], [-32.2, -13.0], [-31.6, 22.9], [-42.0, 36.0], [-33.4, 41.9], [-23.2, 28.3], [-23.0, 15.2], [-15.6, 15.2], [-1.0, 15.3], [13.7, 15.3], [23.8, 14.5], [23.7, 28.0], [36.7, 38.7], [53.3, 19.4], [44.2, 12.1], [46.9, 9.0], [46.6, -0.4], [45.9, -20.3], [45.0, -48.8], [33.0, -48.9], [13.9, -48.8]]
const COURT: XY[] = [[-15.1, -15.3], [-14.7, -48.5], [13.9, -48.8], [14.4, -15.6]]
const ENTRY: XY[] = [[-23.2, 28.3], [-23.0, 15.2], [-15.6, 15.2], [13.7, 15.3], [23.8, 14.5], [23.7, 28.0]]
const DOME = { x: -1.2, y: -27.6, r: 8.8 }

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part(), glass = new Part()
  const sq = (h: number, c = 0.5) => chamfer(rect(-h, -h, h, h), c)
  const prisms: Prism[] = [
    { ring: ccw(PODIUM_RING), z1: PODIUM, wall: stone, roof, kind: 'podium' },
    { ring: ccw(COURT), z1: 16.5, wall: stone, roof, kind: 'low' },
    { ring: ccw(ENTRY), z1: 17.0, wall: stone, roof, kind: 'entry' },
    { ring: ccw(sq(15.0)), z1: SHAFT - 1.4, wall: stone, roof, kind: 'shaft' },
    { ring: ccw(sq(15.4)), z0: SHAFT - 1.4, z1: SHAFT, wall: trim, roof, kind: 'cornice' },
    { ring: ccw(sq(12.75)), z0: SHAFT, z1: S2 - 1.2, wall: stone, roof, kind: 'stage2' },
    { ring: ccw(sq(13.1)), z0: S2 - 1.2, z1: S2, wall: trim, roof, kind: 'cornice' },
  ]
  // A storey is ~3.7 m; one panel spans three storeys between broad piers,
  // so the shaft reads as the tall vertical bays of the photos.
  const shaftGrid: Grid = { group: 3 * 3.7, spandrel: 2.6, pier: 2.5, bayW: 4.2, head: 2.5, foot: 2, inset: 1.4 }
  const podGrid: Grid = { group: 3 * 3.7, spandrel: 2.8, pier: 2.6, bayW: 4.4, head: 2.2, foot: 5, inset: 1.2 }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(P.wall, r, i, z0, P.z1)
      if (P.kind === 'shaft' || P.kind === 'stage2') edgePanels(win, r, i, z0, P.z1, shaftGrid, false)
      if (P.kind === 'podium') edgePanels(win, r, i, z0, P.z1, podGrid, false)
    }
    capRing(P.roof, r, P.z1)
  }
  // the podium's cornice and the entrance block's three great arches
  const pc = ccw(PODIUM_RING)
  for (let i = 0; i < pc.length; i++) {
    const a = pc[i], b = pc[(i + 1) % pc.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.5) continue
    const n: XY = [(b[1] - a[1]) / L, -(a[0] - b[0]) / L]
    const o = (p: XY, d: number): XY => [p[0] + n[0] * d, p[1] + n[1] * d]
    const A = o(a, 0.35), B = o(b, 0.35)
    if (edgeBase(prisms, prisms[0], i) < PODIUM - 2) trim.quad([A[0], A[1], PODIUM - 1.6], [B[0], B[1], PODIUM - 1.6], [B[0], B[1], PODIUM], [A[0], A[1], PODIUM])
  }
  for (const x of [-9.5, 0, 9.5]) {
    const y = 28.3 + 0.07, w = 3.4, z0 = 1.0, zs = 9.5
    const pts: V3[] = [[x + w, y, z0], [x - w, y, z0]]
    for (let k = 0; k <= 10; k++) { const t = Math.PI * (k / 10); pts.push([x - w * Math.cos(t), y, zs + w * Math.sin(t)]) }
    for (let k = 1; k < pts.length - 1; k++) win.tri(pts[0], pts[k], pts[k + 1])
  }
  // the south court's glass dome over the concourse
  lathe(glass, DOME.x, DOME.y, [[DOME.r, 16.5], [DOME.r * 0.8, 18.3], [DOME.r * 0.4, 19.2], [0.01, 19.4]], 16)

  // ------------------------------------------------------------ the setback: corner obelisks
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * 10.6, cy = sy * 10.6
    prism(trim, trim, rect(cx - 1.3, cy - 1.3, cx + 1.3, cy + 1.3), S2, S2 + 2.2)
    const b = 0.95, t = 0.35, z0 = S2 + 2.2, z1 = 156.5
    const B: V3[] = [[cx - b, cy - b, z0], [cx + b, cy - b, z0], [cx + b, cy + b, z0], [cx - b, cy + b, z0]]
    const T: V3[] = B.map(([x, y]) => [cx + (x - cx) * (t / b), cy + (y - cy) * (t / b), z1])
    for (let i = 0; i < 4; i++) trim.quad(B[i], B[(i + 1) % 4], T[(i + 1) % 4], T[i])
    for (let i = 0; i < 4; i++) trim.tri(T[i], T[(i + 1) % 4], [cx, cy, z1 + 1.5])
  }

  // ------------------------------------------------------------ the colonnaded square stage
  const C3 = chamfer(rect(-7.0, -7.0, 7.0, 7.0), 1.8)
  prism(stone, null, C3, S2, S3 - 2.4)
  for (let f = 0; f < 4; f++) {
    const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
    for (const u of [-4.5, -1.5, 1.5, 4.5]) {
      const x = c * 7.9 - s * u, y = s * 7.9 + c * u
      lathe(trim, x, y, [[0.5, S2 + 0.8], [0.42, S3 - 2.4]], 8)
      // a tall window between each pair of columns
      if (u < 4) {
        const um = u + 1.5, w = 0.6, d = 7.06
        const P = (uu: number, z: number): V3 => [c * d - s * uu, s * d + c * uu, z]
        win.quad(P(um - w, S2 + 3), P(um + w, S2 + 3), P(um + w, S3 - 4.5), P(um - w, S3 - 4.5))
      }
    }
  }
  prism(stone, null, rect(-8.5, -8.5, 8.5, 8.5), S2, S2 + 0.8)
  capRing(roof, rect(-8.5, -8.5, 8.5, 8.5), S2 + 0.8)
  prism(trim, roof, chamfer(rect(-8.45, -8.45, 8.45, 8.45), 1.2), S3 - 2.4, S3)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) lathe(trim, sx * 7.4, sy * 7.4, [[0.55, S3], [0.6, S3 + 0.8], [0.3, S3 + 1.4], [0.45, S3 + 2.3], [0.01, S3 + 3.2]], 8)

  // ------------------------------------------------------------ the round stages, dome, lantern and spire
  const SEG = 24
  lathe(stone, 0, 0, [[5.5, S3], [5.5, 180.6]], SEG)
  lathe(trim, 0, 0, [[5.5, 180.6], [5.75, 180.8], [5.75, 181.4], [4.4, 181.4]], SEG)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), r = 5.56
    const P = (w: number, z: number): V3 => [c * r - s * w, s * r + c * w, z]
    win.quad(P(-0.55, 176.2), P(0.55, 176.2), P(0.55, 178.6), P(-0.55, 178.6))
  }
  lathe(stone, 0, 0, [[4.4, 181.4], [4.4, 191.4]], SEG)
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI
    lathe(trim, Math.cos(a) * 5.15, Math.sin(a) * 5.15, [[0.36, 181.4], [0.3, 191.4]], 6)
    const am = ((k + 0.5) / 16) * 2 * Math.PI, c = Math.cos(am), s = Math.sin(am), r = 4.46
    const P = (w: number, z: number): V3 => [c * r - s * w, s * r + c * w, z]
    win.quad(P(-0.45, 182.4), P(0.45, 182.4), P(0.45, 190.2), P(-0.45, 190.2))
  }
  lathe(trim, 0, 0, [[4.4, 191.4], [5.7, 191.6], [5.7, 192.5], [5.4, 192.6], [5.4, S4], [4.3, S4]], SEG)
  lathe(stone, 0, 0, [[4.25, S4], [4.25, 199.3]], SEG)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), r = 4.31
    const P = (w: number, z: number): V3 => [c * r - s * w, s * r + c * w, z]
    win.quad(P(-0.45, 195.6), P(0.45, 195.6), P(0.45, 196.7), P(-0.45, 196.7))
  }
  lathe(trim, 0, 0, [[4.25, 199.3], [4.6, 199.5], [4.6, 200.0], [4.1, 200.1], [3.5, 202.2], [2.6, 204.6], [1.7, 206.6], [1.3, 207.6]], SEG)
  lathe(gold, 0, 0, [[1.3, 207.6], [1.3, 210.4], [1.6, 210.6], [1.6, 211.0], [1.0, 211.4], [0.75, 214.0], [0.5, 214.6], [0.2, 219.0], [0.06, 222.9]], 12)
  disc(gold, 0, 0, 1.3, 207.6, 12, false)

  // ------------------------------------------------------------ night
  // Floodlights on the 44th, 48th and 52nd floors: the top stages bright,
  // the shaft washed fainter downwards, the podium and court unlit.
  const lit = (p: V3, n: V3): number => {
    const up = n[2] > 0.7 ? 0.25 : 1
    if (p[2] > SHAFT - 1.5) return up
    if (Math.abs(p[0]) < 15.6 && Math.abs(p[1]) < 15.6 && p[2] > PODIUM) return up * (0.35 + 0.45 * ((p[2] - PODIUM) / (SHAFT - PODIUM)))
    return 0
  }
  // Named first: `finishGlb` takes plain swatches, and a floodlight rides along.
  const limestone = { ...finish('terminal-limestone', 0xe3d7c0), floodlight: lit }
  const limestoneTrim = { ...finish('terminal-limestone-trim', 0xf0e6d2), floodlight: lit }
  const gilt = { ...finish('terminal-gold', 0xd6b35c), floodlight: (_p: V3, n: V3) => (n[2] > 0.9 ? 0.4 : 1) }
  return finishGlb('cle-terminal-tower', 'Terminal Tower', [
    { part: stone, material: limestone },
    { part: trim, material: limestoneTrim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: gold, material: gilt },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 4.5, height: 222.9, replaces: ['way/333475727'] }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/cle-terminal-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
