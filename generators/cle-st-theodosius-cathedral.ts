/**
 * St. Theodosius Orthodox Cathedral (Frederick C. Baird architect, 1911-12,
 * per Wikipedia "St. Theodosius Russian Orthodox Cathedral"), 733
 * Starkweather Avenue, Tremont, Cleveland. Procedural, CC0-1.0.
 * bun generators/cle-st-theodosius-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 359 (the
 * walls run a degree off north). The front with the portal faces
 * Starkweather Avenue (+y), the apse is at -y. Origin at the area centroid
 * of OSM way/552484156 (-81.6817038, 41.4772974); the crossing's centre is
 * at (0.5, 0.5). z = 0 is the ground, flat round the church (lidar and
 * Mapterhorn agree within 0.2 m). Elevation 0.
 *
 * Identity, in order: the big pale-green copper onion dome on its windowed
 * drum over a copper-clad square base; the four smaller onions on open
 * octagonal lanterns round it; the eight little onions on square copper
 * pedestals at the corners of the arm ends; the cream brick Greek cross
 * with a round-topped (kokoshnik) gable and a rose window on each arm end;
 * two storeys of round-headed windows; the arched stone portal and its
 * gable; the low corner blocks with small glass domes; the slate apse.
 *
 * Evidence:
 *  - plan: OSM way/552484156 (building=yes, wikidata Q2028251), one
 *    outline (19 x 25 m and the apse); the cross is read from the lidar:
 *    the north-south arm x -6.3..7.3, the east-west arm y -6.5..7.5, the
 *    corner blocks between them, the apse y -12.4..-17.5.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    0.5 m grid, read with tools/lidar_frame.py at bearing 359: arm eaves
 *    11.2, arm roof ridges 14.3 (hipped, light grey in the NAIP); corner
 *    blocks ~6.0, their glass domes ~7.9; apse walls ~8.5, its roof 10.7;
 *    main onion top 33.3 (the cross's foot; bulb tip drawn 30.2, cross to ~34), bulb ~8.6 m across; medium onions
 *    22.5-23.9 at (0.5 +- 4.8, 0.5 +- 4.8); small onions ~14-16 at the
 *    corners of the four arm ends.
 *  - estimated from w_lemay's square-on front photo, scaled to the lidar
 *    eaves (66 px/m): the kokoshnik gable 6.4 m wide to 13.4; the rose
 *    window (3.7 m frame, centre 8.9); the windows (1.45 m wide, lower
 *    2.1-5.0, upper 6.8-9.4); the portal (2.2 m doors to 3.2, arch to 4.3,
 *    gable to 6.2); pedestals of the little onions 11.2-13.4, bulbs to
 *    15.8, crosses to 17.2; the onion profiles and the drums, lanterns and
 *    the copper base from the photos.
 *  - colour: cream-buff brick, buff sandstone dressings, pale green
 *    copper on every dome and pedestal, grey slate and roofs, oak doors.
 *
 * Photos (Wikimedia Commons, w_lemay, CC BY-SA 2.0, all EVIDENCE):
 *  - https://commons.wikimedia.org/wiki/File:St._Theodosius_Russian_Orthodox_Cathedral,_Tremont,_Cleveland,_OH_-_52048996115.jpg (front, square on)
 *  - https://commons.wikimedia.org/wiki/File:St._Theodosius_Russian_Orthodox_Cathedral,_Tremont,_Cleveland,_OH.jpg (from the north-west)
 *  - https://commons.wikimedia.org/wiki/File:St._Theodosius_Russian_Orthodox_Cathedral,_Tremont,_Cleveland,_OH_-_52048491676.jpg (west side)
 *  - https://commons.wikimedia.org/wiki/File:St._Theodosius_Russian_Orthodox_Cathedral,_Tremont,_Cleveland,_OH_-_52048721949.jpg (rear: apse, lanterns)
 *  - https://commons.wikimedia.org/wiki/File:St._Theodosius_Russian_Orthodox_Cathedral,_Tremont,_Cleveland,_OH_-_52048534443.jpg (from the north-east)
 *  - USGS NAIP orthophoto (public domain): roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Left out: the diamond scale pattern on the onions, the brick dentil
 * bands, window tracery and the crosses' small bars beyond one crossbar.
 * Doubts: the east side and the rear corner blocks are seen only at a
 * distance; all four corner blocks are drawn alike (the rear ones are a
 * little lower in the lidar, ~4.6-5.8). The night look is windows only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, walls, cap, block, panel, onWall, lathe, save } from './chi-field-museum'
import { band, hipRoof, poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { disc } from './cle-garfield-memorial'
import { inset } from './chi-field-museum'

/** A round-headed window panel on wall a→b: jambs s0..s1 from z0 to the springing zs. */
function roundWin(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 6) {
  const { P, n } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  const pts: V3[] = [P(s0, z0, out), P(s1, z0, out)]
  for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; pts.push(P(c + r * Math.cos(t), zs + r * Math.sin(t), out)) }
  poly(p, pts, [n[0], n[1], 0])
}

/** An onion dome from a list of (radius, z), with a ball and an Orthodox cross on top. */
function onion(cu: Part, cross: Part, cx: number, cy: number, prof: XY[], crossH: number, seg = 12) {
  lathe(cu, cx, cy, prof, seg)
  const top = prof[prof.length - 1][1]
  const s = crossH / 2.2
  lathe(cross, cx, cy, [[0.01, top - 0.05], [0.22 * s, top + 0.1 * s], [0.22 * s, top + 0.3 * s], [0.01, top + 0.42 * s]], 6)
  const z0 = top + 0.4 * s, t = 0.09 * s
  block(cross, cross, rect(cx - t, cy - t, cx + t, cy + t), z0, z0 + 1.8 * s, 0)
  block(cross, cross, rect(cx - 0.5 * s, cy - t, cx + 0.5 * s, cy + t), z0 + 1.15 * s, z0 + 1.15 * s + 2 * t, 0)
  block(cross, cross, rect(cx - t, cy - 0.5 * s, cx + t, cy + 0.5 * s), z0 + 1.15 * s, z0 + 1.15 * s + 2 * t, 0)
}

function build() {
  const brick = new Part(), sand = new Part(), cu = new Part(), roof = new Part(), win = new Part(), oak = new Part()
  const EAVE = 11.2, RIDGE = 14.3
  const CX = 0.5, CY = 0.5

  // ------------------------------------------------------------ the cross
  const NS: [number, number, number, number] = [-6.3, -12.4, 7.3, 13.4]
  const EW: [number, number, number, number] = [-9.6, -6.5, 9.9, 7.5]
  // the cross as one ring, counter-clockwise
  const cross: XY[] = [[NS[0], NS[1]], [NS[2], NS[1]], [NS[2], EW[1]], [EW[2], EW[1]], [EW[2], EW[3]], [NS[2], EW[3]], [NS[2], NS[3]],
    [NS[0], NS[3]], [NS[0], EW[3]], [EW[0], EW[3]], [EW[0], EW[1]], [NS[0], EW[1]]]
  wallsSplit(brick, cross, 0, EAVE - 0.8, 5)
  band(sand, cross, inset(cross, -0.12), 0, 0.9, 0.08)
  band(sand, cross, inset(cross, -0.4), EAVE - 0.8, EAVE, 0.3)
  hipRoof(roof, NS, EAVE, RIDGE, 0.35)
  hipRoof(roof, EW, EAVE, RIDGE, 0.35)

  // Corner blocks in the re-entrant angles, each with a small glass dome.
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const x0 = sx < 0 ? -9.4 : NS[2], x1 = sx < 0 ? NS[0] : 9.7
    const y0 = sy < 0 ? -11.2 : EW[3], y1 = sy < 0 ? EW[1] : 12.8
    const r = rect(x0, y0, x1, y1)
    wallsSplit(brick, r, 0, 5.4, 5)
    band(sand, r, inset(r, -0.3), 5.4, 6.0, 0.2)
    cap(roof, inset(r, -0.3), 6.0)
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
    lathe(roof, mx, my, [[1.5, 6.0], [1.45, 6.6], [1.1, 7.4], [0.55, 7.8], [0, 7.95]], 10)
    // windows on the two outer faces
    const faces: [XY, XY][] = [
      sy > 0 ? [[x1, y1], [x0, y1]] : [[x0, y0], [x1, y0]],
      sx > 0 ? [[x1, y0], [x1, y1]] : [[x0, y1], [x0, y0]],
    ]
    for (const [a, b] of faces) {
      const { L } = onWall(a, b)
      roundWin(win, a, b, L / 2 - 0.6, L / 2 + 0.6, 1.4, 3.6, 0.06)
    }
  }

  // ------------------------------------------------------------ the arm ends and sides
  type Face = { a: XY; b: XY; rose: boolean; door: boolean; apse: boolean }
  const ends: Face[] = [
    { a: [NS[2], NS[3]], b: [NS[0], NS[3]], rose: true, door: true, apse: false }, // north front
    { a: [EW[2], EW[1]], b: [EW[2], EW[3]], rose: true, door: false, apse: false }, // east
    { a: [EW[0], EW[3]], b: [EW[0], EW[1]], rose: true, door: false, apse: false }, // west
    { a: [NS[0], NS[1]], b: [NS[2], NS[1]], rose: false, door: false, apse: true }, // south
  ]
  for (const f of ends) {
    const { L, P, n, u } = onWall(f.a, f.b)
    const m = L / 2
    // the kokoshnik: a round-topped gable 6.4 m wide over the centre bay, with a stone rim
    const gw = 3.2, gz = EAVE, gt = 13.4
    const R = (gw * gw + (gt - gz) ** 2) / (2 * (gt - gz))
    const gzAt = (d: number) => gt - R + Math.sqrt(Math.max(0, R * R - d * d))
    const N = 10
    const gpts = (inn: number, out: number): V3[] => {
      const pts: V3[] = [P(m - gw, gz - 0.8, out), P(m + gw, gz - 0.8, out)]
      for (let i = 0; i <= N; i++) { const d = gw - (2 * gw * i) / N; pts.push(P(m + d, gzAt(d) - inn, out)) }
      return pts
    }
    // a slab: front face, back face, top rim
    const front = gpts(0, 0.25), back = gpts(0, -1.2)
    poly(brick, front, [n[0], n[1], 0])
    poly(brick, back, [-n[0], -n[1], 0])
    for (let i = 2; i < front.length - 1; i++) {
      const a = front[i], b = front[i + 1], c = back[i + 1], d = back[i]
      poly(sand, [a, b, c, d], [0, 0, 1])
    }
    for (const [i, j] of [[0, 2], [1, front.length - 1]]) poly(brick, [front[i], front[j], back[j], back[i]], i === 0 ? [-u[0], -u[1], 0] : [u[0], u[1], 0])
    // the gable's stone rim drawn on its face
    for (let i = 0; i < N; i++) {
      const d0 = gw - (2 * gw * i) / N, d1 = gw - (2 * gw * (i + 1)) / N
      poly(sand, [P(m + d0, gzAt(d0) - 0.45, 0.3), P(m + d1, gzAt(d1) - 0.45, 0.3), P(m + d1, gzAt(d1), 0.3), P(m + d0, gzAt(d0), 0.3)], [n[0], n[1], 0])
    }
    // stone cross on the gable
    panel(sand, f.a, f.b, m - 0.09, m + 0.09, 10.3, 12.2, 0.3)
    panel(sand, f.a, f.b, m - 0.45, m + 0.45, 11.5, 11.68, 0.3)
    if (f.rose) {
      disc(sand, f.a, f.b, m, 8.9, 1.85, 0.06, 8)
      disc(win, f.a, f.b, m, 8.9, 1.35, 0.1, 14)
      panel(sand, f.a, f.b, m - 0.1, m + 0.1, 7.55, 10.25, 0.13)
      panel(sand, f.a, f.b, m - 1.35, m + 1.35, 8.8, 9.0, 0.13)
    }
    // round-headed windows either side of the centre bay, two storeys
    for (const d of [-4.7, 4.7]) {
      if (Math.abs(d) + 0.8 > m) continue
      for (const [z0, zs] of [[2.1, 4.3], [6.8, 8.7]]) {
        roundWin(sand, f.a, f.b, m + d - 0.95, m + d + 0.95, z0 - 0.25, zs, 0.04)
        roundWin(win, f.a, f.b, m + d - 0.72, m + d + 0.72, z0, zs, 0.08)
      }
    }
    if (f.door) {
      // the portal: projecting stone frame, round arch over the oak doors, a pointed gable
      const s0 = m - 2.3, s1 = m + 2.3, d = 0.9
      const fr: V3[] = [P(s0, 0, d), P(s1, 0, d), P(s1, 4.6, d), P(m, 6.2, d), P(s0, 4.6, d)]
      poly(sand, fr, [n[0], n[1], 0])
      poly(sand, [P(s0, 0, 0), P(s0, 0, d), P(s0, 4.6, d), P(s0, 4.6, 0)], [-u[0], -u[1], 0])
      poly(sand, [P(s1, 0, d), P(s1, 0, 0), P(s1, 4.6, 0), P(s1, 4.6, d)], [u[0], u[1], 0])
      poly(roof, [P(s0 - 0.15, 4.5, d + 0.15), P(m, 6.3, d + 0.15), P(m, 6.3, 0), P(s0 - 0.15, 4.5, 0)], [-u[0] * 0.7, -u[1] * 0.7, 1])
      poly(roof, [P(m, 6.3, d + 0.15), P(s1 + 0.15, 4.5, d + 0.15), P(s1 + 0.15, 4.5, 0), P(m, 6.3, 0)], [u[0] * 0.7, u[1] * 0.7, 1])
      roundWin(oak, f.a, f.b, m - 1.1, m + 1.1, 0.6, 3.2, d + 0.05)
      // the steps
      block(sand, sand, rect(-1.5, NS[3] + d, 2.5, NS[3] + d + 1.4), 0, 0.6, 0)
    }
  }
  // side walls of the arms above the corner blocks: upper windows
  const sideWalls: [XY, XY][] = [
    [[NS[2], EW[3]], [NS[2], NS[3]]], [[NS[0], NS[3]], [NS[0], EW[3]]], // north arm, east and west sides
    [[NS[2], NS[1]], [NS[2], EW[1]]], [[NS[0], EW[1]], [NS[0], NS[1]]], // south arm
    [[EW[2], EW[3]], [NS[2], EW[3]]], [[NS[0], EW[3]], [EW[0], EW[3]]], // east and west arms, north sides
    [[NS[2], EW[1]], [EW[2], EW[1]]], [[EW[0], EW[1]], [NS[0], EW[1]]], // south sides
  ]
  for (const [a, b] of sideWalls) {
    const { L } = onWall(a, b)
    for (const s of L > 5 ? [L / 2 - 1.3, L / 2 + 1.3] : [L / 2]) {
      roundWin(sand, a, b, s - 0.85, s + 0.85, 6.55, 8.7, 0.04)
      roundWin(win, a, b, s - 0.62, s + 0.62, 6.8, 8.7, 0.08)
    }
  }

  // ------------------------------------------------------------ the apse
  {
    const yb = NS[1], cxA = CX, r = 4.6
    const ring: XY[] = []
    for (let i = 0; i <= 4; i++) { const t = Math.PI + (i * Math.PI) / 4; ring.push([cxA + r * Math.cos(t), yb + 0.2 + r * Math.sin(t) * 1.1]) }
    const full: XY[] = [...ring.slice(0, 5)]
    const apse = full.concat([[cxA + r, yb + 0.4], [cxA - r, yb + 0.4]])
    wallsSplit(brick, apse, 0, 8.0, 5)
    band(sand, apse, inset(apse, -0.3), 8.0, 8.5, 0.2)
    // its slate half-cone
    const top: V3 = [cxA, yb + 0.4, 10.7]
    const o = inset(apse, -0.3)
    for (let i = 0; i < 4; i++) poly(roof, [[o[i][0], o[i][1], 8.5], [o[i + 1][0], o[i + 1][1], 8.5], top], [((o[i][0] + o[i + 1][0]) / 2 - cxA), ((o[i][1] + o[i + 1][1]) / 2 - yb), 1])
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[i + 1], { L } = onWall(a, b)
      if (i === 0 || i === 3) continue
      roundWin(win, a, b, L / 2 - 0.55, L / 2 + 0.55, 2.0, 6.6, 0.06)
    }
  }

  // ------------------------------------------------------------ the domes
  // central square base, copper clad, with a hipped skirt; the windowed drum; the great onion
  block(cu, null, rect(CX - 4.3, CY - 4.3, CX + 4.3, CY + 4.3), 12.0, 16.0, 0)
  const sk = rect(CX - 4.6, CY - 4.6, CX + 4.6, CY + 4.6)
  walls(cu, sk, 16.0, 17.0, rect(CX - 3.7, CY - 3.7, CX + 3.7, CY + 3.7))
  lathe(cu, CX, CY, [[3.7, 16.9], [3.7, 21.0], [3.95, 21.0], [3.95, 21.4]], 8, Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const t0 = Math.PI / 8 + (k * Math.PI) / 4, t1 = t0 + Math.PI / 4
    const a: XY = [CX + 3.7 * Math.cos(t0), CY + 3.7 * Math.sin(t0)], b: XY = [CX + 3.7 * Math.cos(t1), CY + 3.7 * Math.sin(t1)]
    const { L } = onWall(b, a)
    roundWin(win, b, a, L / 2 - 0.55, L / 2 + 0.55, 18.0, 19.8, 0.04, 4)
  }
  onion(cu, roof, CX, CY, [[3.6, 21.4], [4.1, 21.8], [4.35, 22.7], [4.3, 23.8], [3.95, 25.0], [3.2, 26.2], [2.2, 27.2], [1.2, 28.0], [0.5, 28.9], [0.12, 30.2]], 3.2, 16)

  // four medium onions on square copper bases and open octagonal lanterns
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const mx = CX + sx * 4.8, my = CY + sy * 4.8
    block(cu, cu, rect(mx - 1.45, my - 1.45, mx + 1.45, my + 1.45), 12.5, 15.9, 0.25)
    lathe(cu, mx, my, [[1.45, 15.9], [1.45, 18.3], [1.85, 18.3], [1.85, 18.6]], 8, Math.PI / 8)
    for (let k = 0; k < 8; k++) {
      const t0 = Math.PI / 8 + (k * Math.PI) / 4, t1 = t0 + Math.PI / 4
      const a: XY = [mx + 1.45 * Math.cos(t0), my + 1.45 * Math.sin(t0)], b: XY = [mx + 1.45 * Math.cos(t1), my + 1.45 * Math.sin(t1)]
      const { L } = onWall(b, a)
      roundWin(win, b, a, L / 2 - 0.3, L / 2 + 0.3, 16.4, 17.6, 0.03, 4)
    }
    onion(cu, roof, mx, my, [[1.5, 18.6], [1.95, 19.0], [2.15, 19.7], [2.05, 20.4], [1.6, 21.1], [0.9, 21.7], [0.3, 22.3], [0.08, 22.9]], 2.0)
  }

  // eight little onions on two-stage square pedestals at the corners of the arm ends
  const smalls: XY[] = [
    [NS[0] + 0.9, NS[3] - 0.9], [NS[2] - 0.9, NS[3] - 0.9], [NS[0] + 0.9, NS[1] + 0.9], [NS[2] - 0.9, NS[1] + 0.9],
    [EW[0] + 0.9, EW[3] - 0.9], [EW[0] + 0.9, EW[1] + 0.9], [EW[2] - 0.9, EW[3] - 0.9], [EW[2] - 0.9, EW[1] + 0.9],
  ]
  for (const [x, y] of smalls) {
    block(cu, cu, rect(x - 0.85, y - 0.85, x + 0.85, y + 0.85), EAVE - 0.3, 12.5, 0.15)
    block(cu, cu, rect(x - 0.6, y - 0.6, x + 0.6, y + 0.6), 12.5, 13.4, 0.1)
    onion(cu, roof, x, y, [[0.55, 13.4], [0.8, 13.8], [0.85, 14.3], [0.7, 14.8], [0.4, 15.3], [0.1, 15.8]], 1.3, 10)
  }

  return [
    { part: brick, material: finish('cle-theodosius-brick', 0xe6d6b0) },
    { part: sand, material: finish('cle-theodosius-sandstone', 0xcdb58c) },
    { part: cu, material: finish('cle-theodosius-copper', 0x95bba2) },
    { part: roof, material: finish('cle-theodosius-slate', 0x8c939a) },
    { part: win, material: PALETTE.window },
    { part: oak, material: finish('cle-theodosius-oak', 0x9a6d42) },
  ]
}

if (import.meta.main) await save('cle-st-theodosius-cathedral', 'St. Theodosius Orthodox Cathedral', [41.4772974, -81.6817038], 359, build(), 6500)
