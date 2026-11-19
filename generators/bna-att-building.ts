/**
 * AT&T Building ("Batman Building", 1994, Earl Swensson Associates), 333
 * Commerce Street, Nashville — original procedural geometry, CC0-1.0.
 * bun generators/bna-att-building.ts [out.glb]
 *
 * Map frame: x and y in the tower's own grid, z up, metres. The model's y
 * runs at bearing 17.1° (north-north-east), so the crown's wall and its two
 * spires run along x (bearing 107.1°) and the sloped glass hoods face
 * north-north-east and south-south-west, toward Broadway. The anchor is the
 * tower's centre, between the spires, on the lowest ground under the
 * footprint (its north corner, ~2 m above the lidar's ground minimum;
 * Commerce Street on the south side is ~9 m higher).
 *
 * Form: a blue glass slab, its front and back faces 26 m wide, flanked on
 * each side by three pale warm grey-beige granite stages that step back, out and up toward
 * the ends (the "stacked" corners). Over the glass, a steep shed of dark
 * glass (the hood) rises from each face to a pale crown wall 59 m wide that
 * stands across the top; a segmental arch is cut through the wall above the
 * hoods, and from its ends rise the two stepped spires, the "ears". A brick
 * podium with a glass-gabled atrium runs south to Commerce Street.
 *
 * Sources
 * - OSM: outline way/130910785; tower part way/465454851; spires
 *   way/1307887852, way/1307887853; crown way/1311381715; podium
 *   way/591973495, way/591983690, way/1311381711–1311381714. OSM puts the
 *   spires 3 m in from the lidar's; the lidar wins.
 * - Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, heights above the
 *   lowest ground under the tower: glass slab faces 26 m wide at y = ±18.7,
 *   eaves 118 m; hood rising to 141 m at the crown wall (about 58°); granite
 *   stages 96.5 m (x 13–20.5, y ±18.5), 108.5 m (x 17–27, y ±14.5) and
 *   122 m (x 23–31, y ±9.5); crown wall 59 x 9 m, 156 m; east spire 181 m
 *   at a point below its tip; atrium eaves 18 m, ridge 31 m; podium 19.5–
 *   28 m (it stands on Commerce Street, ~9 m up). Points at 175–180 m over
 *   the south hood are a 2022 crane or rigging and are ignored.
 * - Published: 617 ft (188 m) to the spire tips, 33 floors (Wikipedia, "AT&T
 *   Building (Nashville)"; CTBUH). Taken from Commerce Street, ~9 m over
 *   the model's base, the tips stand at 197 m here; the Highsmith photo's
 *   proportions (spires 41–42 m over the 156 m crown wall) agree.
 * - Photos (Wikimedia Commons): EvanSheppard (CC0) from Broadway and 5th;
 *   Kaldari (CC0) from the south-east; Lchader (CC BY-SA 4.0) the crown;
 *   Carol M. Highsmith (public domain) over the Ryman; Michael Rivera (CC
 *   BY-SA 4.0) from 3rd and 4th Avenues; Louis Chader (CC BY-SA 4.0);
 *   Tabitha Kaylee Hawk (CC BY 2.0) and Cessna86 (public domain) at night.
 * - Night: the crown wall and spires are floodlit pale, the hoods stay
 *   dark, the office floors are lit.
 * Estimated: the spire stages (from the photos' proportions between the
 * crown wall's top and the tip: pier to 166 m, shaft to 182 m, needle),
 * the tip's datum (if 617 ft is from the lowest grade it is 188 m, 9 m
 * lower), the arch (28 m chord, 5.5 m rise, from the Highsmith and
 * Lchader photos), the window grouping (two storeys of ~4.4 m on
 * the granite, one panel per bay), the mullion spacing on the glass.
 * Left out: the AT&T globe and lettering (removed with the 2022–2024
 * re-signing as 333 Commerce), the crown wall's panel grid, the setback
 * notches on the granite corners, the porte-cochère.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, type Grid, ccw, capRing, chamfer, edgeBase, edgePanels, finishGlb, wallEdge } from './sea-columbia-center'

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A closed box from z0 to z1 over a counter-clockwise ring (convex top). */
function box(part: Part, r: XY[], z0: number, z1: number, cap = true) {
  for (let i = 0; i < r.length; i++) wallEdge(part, r, i, z0, z1, 0)
  if (cap) capRing(part, r, z1)
}

function build() {
  const granite = new Part(), win = new Part(), curtain = new Part(), dark = new Part(), crown = new Part(), brick = new Part()

  // --- the podium on Commerce Street (south), in OSM's outlines
  const podium: Prism[] = [
    { ring: ccw([[13.6, -54.0], [26.9, -67.9], [-6.3, -101.4], [-13.2, -94.6], [-16.4, -97.9], [-37.3, -76.4], [-16.0, -53.6], [-13.2, -53.7], [-11.2, -55.9], [-11.2, -62.3], [-5.5, -67.9], [2.7, -67.9], [9.0, -62.1], [9.1, -55.9], [10.9, -54.1]]), z1: 19.5, wall: brick, roof: crown, kind: 'podium' },
    { ring: ccw([[-16.0, -53.6], [-13.2, -53.7], [-11.2, -55.9], [-11.2, -62.3], [-5.5, -67.9], [2.7, -67.9], [9.0, -62.1], [9.1, -55.9], [10.9, -54.1], [13.6, -54.0], [7.7, -47.6], [-9.8, -47.6]]), z1: 24, wall: brick, roof: crown, kind: 'podium' },
    { ring: ccw([[-16.1, -41.1], [-22.6, -47.3], [-16.0, -53.6], [-9.8, -47.6]]), z1: 28, wall: brick, roof: crown, kind: 'podium' },
    { ring: ccw([[7.7, -47.6], [13.6, -54.0], [19.9, -47.7], [14.0, -41.5]]), z1: 28, wall: brick, roof: crown, kind: 'podium' },
    { ring: ccw(rect(-15.6, 14.4, -47.6, -18.7)), z1: 18, wall: brick, roof: crown, kind: 'atrium' },
  ]
  // --- the granite stages, mirrored about x = 0
  const stages: Prism[] = []
  for (const s of [1, -1]) {
    const R = (x0: number, x1: number, y: number): XY[] => (s > 0 ? rect(x0, x1, -y, y) : rect(-x1, -x0, -y, y))
    stages.push(
      { ring: chamfer(ccw(R(13, 20.5, 18.5)), 1.4), z1: 96.5, wall: granite, roof: crown, kind: 'stage' },
      { ring: chamfer(ccw(R(17, 27, 14.5)), 1.4), z1: 108.5, wall: granite, roof: crown, kind: 'stage' },
      { ring: chamfer(ccw(R(23, 31.2, 9.5)), 1.4), z1: 122, wall: granite, roof: crown, kind: 'stage' },
    )
  }
  const prisms = [...podium, ...stages]
  const stageGrid: Grid = { group: 2 * 4.4, spandrel: 2.2, pier: 1.3, bayW: 3.2, head: 2.5, foot: 4, inset: 1.2 }
  const podiumGrid: Grid = { group: 4.5, spandrel: 1.8, pier: 1.6, bayW: 3.6, head: 2, foot: 10, inset: 1.2 }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(P.wall, r, i, z0, P.z1)
      if (P.kind !== 'atrium') edgePanels(win, r, i, z0, P.z1, P.kind === 'stage' ? stageGrid : podiumGrid, false)
    }
    if (P.kind !== 'atrium') capRing(P.roof, r, P.z1)
  }
  // The atrium's glass gable, ridge north-south at x = -0.5.
  {
    const x0 = -15.6, x1 = 14.4, xr = -0.5, y0 = -47.6, y1 = -18.7, ze = 18, zr = 31
    dark.quad([x0, y0, ze], [xr, y0, zr], [xr, y1, zr], [x0, y1, ze])
    dark.quad([xr, y0, zr], [x1, y0, ze], [x1, y1, ze], [xr, y1, zr])
    brick.tri([x0, y0, ze], [x1, y0, ze], [xr, y0, zr])
  }

  // --- the glass slab: an octagon in plan whose top follows the hoods
  const EAVE = 118, HOOD_TOP = 141, YF = 18.7, YW = 4.5, XF = 13, XW = 25
  const zTop = (y: number) => (Math.abs(y) <= YW ? HOOD_TOP : EAVE + ((YF - Math.abs(y)) / (YF - YW)) * (HOOD_TOP - EAVE))
  const CORE: XY[] = [[-XF, -YF], [XF, -YF], [XW, -YW], [XW, YW], [XF, YF], [-XF, YF], [-XW, YW], [-XW, -YW]]
  for (let i = 0; i < CORE.length; i++) {
    const a = CORE[i], b = CORE[(i + 1) % CORE.length]
    curtain.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zTop(b[1])], [a[0], a[1], zTop(a[1])])
  }
  // White mullion fins up the glass faces, about every 3.25 m.
  for (const s of [1, -1]) {
    for (let k = -3; k <= 3; k++) {
      const x = k * 3.25, w = 0.28, y = s * (YF + 0.08)
      const A: V3 = [x - w, y, 0], B: V3 = [x + w, y, 0], C: V3 = [x + w, y, EAVE - 0.6], D: V3 = [x - w, y, EAVE - 0.6]
      if (s < 0) crown.quad(A, B, C, D)
      else crown.quad(B, A, D, C)
    }
  }
  // The hoods: dark glass sheds from the eaves to the crown wall.
  dark.quad([-XF, -YF, EAVE], [XF, -YF, EAVE], [XW, -YW, HOOD_TOP], [-XW, -YW, HOOD_TOP])
  dark.quad([XF, YF, EAVE], [-XF, YF, EAVE], [-XW, YW, HOOD_TOP], [XW, YW, HOOD_TOP])

  // --- the crown wall across the top, its arch, and the spires
  const HEAD_TOP = 156, HX = 29.5, TIP = 197
  box(crown, chamfer(ccw(rect(-HX, HX, -YW, YW)), 0.4), 118, HEAD_TOP)
  for (const s of [1, -1]) {
    // a segmental arch cut into each face above the hood, drawn as a dark
    // flush panel: 28 m chord at the hood's top, 5.5 m rise
    const chord = 14, rise = 5.5, R = (chord * chord + rise * rise) / (2 * rise), zc = HOOD_TOP + rise - R
    const y = s * (YW + 0.06), N = 12
    const pts: V3[] = []
    for (let k = 0; k <= N; k++) {
      const x = -chord + (2 * chord * k) / N
      pts.push([x, y, zc + Math.sqrt(R * R - x * x)])
    }
    for (let k = 0; k < N; k++) {
      const a = pts[k], b = pts[k + 1], a0: V3 = [a[0], y, HOOD_TOP - 0.5], b0: V3 = [b[0], y, HOOD_TOP - 0.5]
      if (s < 0) dark.quad(a0, b0, b, a)
      else dark.quad(b0, a0, a, b)
    }
  }
  for (const s of [1, -1]) {
    const cx = s * 27.8
    const sq = (h: number): XY[] => ccw(rect(cx - h, cx + h, -h, h))
    box(crown, chamfer(sq(2.4), 0.4), 122, 166) // the corner pier, proud of the wall's end
    box(crown, chamfer(sq(1.9), 0.3), 166, 171)
    box(crown, chamfer(sq(1.35), 0.25), 171, 182)
    // the needle, to 617 ft over Commerce Street
    const base = sq(0.75).map(([x, y]): V3 => [x, y, 182]), tip: V3 = [cx, 0, TIP]
    for (let i = 0; i < 4; i++) crown.tri(base[i], base[(i + 1) % 4], tip)
  }

  const crownLit: MaterialSpec = { ...finish('att-crown', 0xe7e6e1), floodlight: (p: V3, n: V3) => (p[2] < 120 ? 0 : n[2] > 0.7 ? 0.3 : 1) }
  return finishGlb('bna-att-building', 'AT&T Building', [
    { part: granite, material: finish('att-granite', 0xdcd2c6) },
    { part: win, material: PALETTE.window },
    { part: curtain, material: windowVariant(2, 0x87a4c9) },
    { part: dark, material: finish('glass', 0x56698a, 0.3) },
    { part: crown, material: crownLit },
    { part: brick, material: finish('att-podium-brick', 0xc29482) },
  ], {
    bearing: 17.1,
    height: TIP,
    replaces: ['way/130910785', 'way/465454851', 'way/591973495', 'way/591983690', 'way/1307887852', 'way/1307887853', 'way/1311381711', 'way/1311381712', 'way/1311381713', 'way/1311381714', 'way/1311381715'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/bna-att-building.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
