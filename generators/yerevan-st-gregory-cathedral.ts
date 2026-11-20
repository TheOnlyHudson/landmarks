/**
 * Saint Gregory the Illuminator Cathedral (Սուրբ Գրիգոր Լուսավորիչ մայր
 * եկեղեցի), Yerevan: procedural, CC0-1.0, no textures.
 *   bun generators/yerevan-st-gregory-cathedral.ts
 * Writes models/yerevan-st-gregory-cathedral.glb and a detail model
 * (.detail.glb: the archivolts' inner faces, rounder arches).
 *
 * Built 1997-2001 to Stepan Kurkchyan's design for the 1700th anniversary
 * of Christianity in Armenia: the cathedral with its great drum, the two
 * chapels of Saint Tiridates and Saint Ashkhen flanking the entrance, and
 * the belfry over the west portal.
 *
 * Frame: x east, y north, z up, metres, bearing 1.5 (the OSM walls run 1.5
 * deg clockwise of the cardinal lines). Origin at the area centroid of the
 * outline way/31622320, OSM-local (-0.65, -5.66) m from 44.5169, 40.1721:
 * anchor 44.516892, 40.172049. The church axis runs along y = -6.5
 * (OSM-local), the altar to the east.
 *
 * Identity: a cross-in-square church of apricot tuff, its four arms under
 * steep gables, the corner bays under lower hipped roofs, and over the
 * crossing a tall octagonal drum with two round-headed windows a face and
 * an "umbrella" cone, a gable over every face; two small chapels with their
 * own octagonal drums and umbrella cones flank the west front; between
 * them the projecting entrance block with three deep arches (the portal
 * in the middle, the tallest) and the square belfry with paired arched
 * openings on top; a big relief cross on the west gable; blind arches and
 * round-headed windows in relief round the walls; a polygonal apse east.
 *
 * Evidence
 * - OSM (ODbL): way/31622320 (building=church, 99 x 63 m: the main body
 *   x -14..41 with its arms and chamfered corners, the east apse bump, the
 *   two chapel blocks x -41..-19, the entrance block's bump x -52..-41),
 *   the approach steps on the west (way/1305634591, way/1365847018).
 * - Published: Wikipedia "Saint Gregory the Illuminator Cathedral,
 *   Yerevan": 54 m to the top of the cross; three churches (cathedral 1700
 *   seats, the two chapels 150); the belfry at the entrance; 3,822 m2.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "2025-05-17 Saint Gregory the Illuminator Cathedral, Yerevan.jpg",
 *     Alexkom000, CC BY 4.0: the west front by telephoto, scaled at
 *     0.0744 m/px to the 54 m: drum 17.9 m across its flats (an octagon:
 *     its middle face is 0.42 of its width), drum walls to 38.9, its gables
 *     42.6, cone 49; chapel drums 9 m, walls to 27.4, cones 31.5, crosses
 *     35.6; chapel eaves 17.7; arm eaves 23.7, ridge 29.6; entrance block
 *     18.5, belfry 26.6; the arches. Colours.
 *     https://commons.wikimedia.org/wiki/File:2025-05-17_Saint_Gregory_the_Illuminator_Cathedral,_Yerevan.jpg
 *   - "Saint Gregory the Illuminator Cathedral from air, April 2019.jpg",
 *     Aleksey Chalabyan (Xelgen), CC BY-SA 4.0: from the south-west above:
 *     the roofs, the gabled drum, the south chapel, the belfry block
 *     https://commons.wikimedia.org/wiki/File:Saint_Gregory_the_Illuminator_Cathedral_from_air,_April_2019.jpg
 *   - "2014 Erywań, Katedra św. Grzegorza Oświeciciela (05)", "(10)" and
 *     "(18).jpg", Marcin Konsek, CC BY-SA 4.0: the west front, the belfry
 *     block and the south side
 *     https://commons.wikimedia.org/wiki/File:2014_Erywa%C5%84,_Katedra_%C5%9Bw._Grzegorza_O%C5%9Bwieciciela_(10).jpg
 *   - "Saint Gregory the Illuminator Cathedral, Yerevan-8.jpg" and "-5.jpg",
 *     Pandukht, public domain: the entrance block and belfry close up
 *     https://commons.wikimedia.org/wiki/File:Saint_Gregory_the_Illuminator_Cathedral,_Yerevan-8.jpg
 *   - "Saint Gregory the Illuminator Cathedral from air at night, April
 *     2019.jpg", Aleksey Chalabyan, CC BY-SA 4.0: floodlit at night
 *     https://commons.wikimedia.org/wiki/File:Saint_Gregory_the_Illuminator_Cathedral_from_air_at_night,_April_2019.jpg
 *
 * Numbers: plan measured from OSM (the chapels made symmetric about the
 * axis); heights scaled from the telephoto west front against the
 * published 54 m; the core's corner eaves 17 m and the apse 17 m
 * estimated from the aerial. Colours sampled: sunlit tuff #c9a583 ..
 * #d1a882, shade #836850; roofs (tuff slabs) #a48469 .. #947d71 in shade, drawn as the walls'
 * apricot tuff a little darker (#b8977a).
 *
 * Doubts and terrain: the north and south arms are drawn lower than the
 * nave (eaves 17.5, ridge 24): from the west nothing of them shows beside
 * the west gable, and in the aerial the south gable sits under the nave's
 * eaves; their true heights are not measured. The east end and the north side are seen only in the
 * aerial and at a distance; window counts there are estimates. The church
 * stands on a terrace with retaining walls (OSM barrier=retaining_wall);
 * Mapterhorn here is z12 and shows the building as a 6 m bump.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, offset, ccw, type XY } from './sf-de-young'
import { quadOut, triOut, beam } from './moscow-church-kit'
import { gabled, hipApse, faceOf, holedWall, archRing, blindArch, win, writeModel, shift, type Face } from './tbilisi-holy-trinity-cathedral'

const OX = -0.65, OY = -5.66 // the outline's centroid in OSM-local metres
const AY = -6.5 // the church's axis
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/**
 * An octagonal drum with an umbrella roof: walls from z0 to the gables'
 * springing zs, a pediment on each face rising to zg, the roof folding from
 * the corners (valleys) and the gables (ridges) to the apex za; a cross on
 * top. Two (or one) round-headed windows a face in blind arches.
 */
function drum(o: { wall: Part; trim: Part; roof: Part; glaze: Part; metal: Part; c: XY; ap: number; z0: number; zs: number; zg: number; za: number; cross: number; wins: 1 | 2; a0?: number; seg: number }) {
  const { wall, trim, roof, glaze, metal, c, ap, z0, zs, zg, za } = o
  const n = 8, R = ap / Math.cos(Math.PI / n), a0 = o.a0 ?? Math.PI / n
  const corner = (k: number, r = R): XY => [c[0] + r * Math.cos(a0 + (2 * Math.PI * k) / n), c[1] + r * Math.sin(a0 + (2 * Math.PI * k) / n)]
  const ring = Array.from({ length: n }, (_, k) => corner(k))
  prism(wall, ring, z0, zs, null)
  const ov = 0.45, Ro = R + ov / Math.cos(Math.PI / n)
  for (let k = 0; k < n; k++) {
    const a = corner(k), b = corner(k + 1), m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const nrm: V3 = unit([m[0] - c[0], m[1] - c[1], 0])
    // the pediment wall
    triOut(wall, [a[0], a[1], zs], [b[0], b[1], zs], [m[0], m[1], zg], nrm)
    // the roof: two planes from the corners to the gable's apex and on to the cone's apex
    const A = corner(k, Ro), B = corner(k + 1, Ro), M: XY = [m[0] + nrm[0] * ov, m[1] + nrm[1] * ov]
    const apex: V3 = [c[0], c[1], za]
    triOut(roof, [A[0], A[1], zs - 0.15], [M[0], M[1], zg + 0.15], apex, [nrm[0], nrm[1], 1])
    triOut(roof, [M[0], M[1], zg + 0.15], [B[0], B[1], zs - 0.15], apex, [nrm[0], nrm[1], 1])
    // the eaves' edge, a thin fascia under the roof
    quadOut(roof, [A[0], A[1], zs - 0.55], [M[0], M[1], zg - 0.25], [M[0], M[1], zg + 0.15], [A[0], A[1], zs - 0.15], nrm)
    quadOut(roof, [M[0], M[1], zg - 0.25], [B[0], B[1], zs - 0.55], [B[0], B[1], zs - 0.15], [M[0], M[1], zg + 0.15], nrm)
    quadOut(roof, [A[0], A[1], zs - 0.55], [M[0], M[1], zg - 0.25], [m[0], m[1], zg - 0.25], [a[0], a[1], zs - 0.55], [0, 0, -1])
    quadOut(roof, [M[0], M[1], zg - 0.25], [B[0], B[1], zs - 0.55], [b[0], b[1], zs - 0.55], [m[0], m[1], zg - 0.25], [0, 0, -1])
    // windows in a blind arch on the face
    const f: Face = faceOf(a, b), side = Math.hypot(b[0] - a[0], b[1] - a[1])
    const h = zs - z0
    if (o.wins === 2) {
      // tall narrow paired windows (5.4 x 0.95 m in the telephoto), each in its own deep reveal
      const ww = side * 0.13, sill = z0 + h * 0.47, wh = h * 0.44
      for (const s of [side * 0.37, side * 0.63]) {
        win(glaze, f, s, sill, ww, wh, o.seg)
        blindArch(trim, f, s, sill - 0.25, sill + wh - ww / 2, ww / 2 + 0.04, { band: 0.3, d: 0.4, seg: o.seg })
      }
    } else if (k % 2 === 0) {
      const ww = side * 0.22, sill = z0 + h * 0.32, wh = h * 0.48
      win(glaze, f, side / 2, sill, ww, wh, o.seg)
      blindArch(trim, f, side / 2, z0 + h * 0.2, sill + wh - ww / 2 - 0.05, ww / 2 + 0.25, { band: 0.3, d: 0.18, seg: o.seg })
    }
  }
  // a cornice ring at the springing
  const cr = Array.from({ length: n }, (_, k) => corner(k, R + 0.25))
  prism(trim, cr, zs - 0.6, zs - 0.15, null)
  // the cross
  const ct = za + o.cross
  beam(metal, [c[0], c[1], za - 0.3], [c[0], c[1], ct], 0.3, 0.3)
  beam(metal, [c[0] - o.cross * 0.28, c[1], ct - o.cross * 0.3], [c[0] + o.cross * 0.28, c[1], ct - o.cross * 0.3], 0.26, 0.26)
}

/** A hipped roof (a frustum) over a convex ring from the eaves ze up to a flat top inset by `inset`, `ov` past the walls. */
function hipRing(roof: Part, ring0: XY[], ze: number, zt: number, inset: number, ov = 0.5) {
  const ring = ccw(ring0), lo = offset(ring, ov), hi = offset(ring, -inset), n = ring.length
  const cx = ring.reduce((t, q) => t + q[0], 0) / n, cy = ring.reduce((t, q) => t + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, m: V3 = [(lo[i][0] + lo[j][0]) / 2 - cx, (lo[i][1] + lo[j][1]) / 2 - cy, 0]
    const up: V3 = [m[0], m[1], Math.hypot(m[0], m[1])]
    quadOut(roof, [lo[i][0], lo[i][1], ze - 0.3], [lo[j][0], lo[j][1], ze - 0.3], [hi[j][0], hi[j][1], zt], [hi[i][0], hi[i][1], zt], up)
    quadOut(roof, [lo[i][0], lo[i][1], ze - 0.3], [lo[j][0], lo[j][1], ze - 0.3], [lo[j][0], lo[j][1], ze], [lo[i][0], lo[i][1], ze], m)
    quadOut(roof, [lo[i][0], lo[i][1], ze - 0.3], [lo[j][0], lo[j][1], ze - 0.3], [ring[j][0], ring[j][1], ze - 0.3], [ring[i][0], ring[i][1], ze - 0.3], [0, 0, -1])
  }
  roof.cap(hi.map(([x, y]) => [x, y, zt] as V3), true)
}
const hip = (roof: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zt: number, inset: number, ov = 0.5) =>
  hipRing(roof, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], ze, zt, inset, ov)

export function build(detail: boolean) {
  const wall = new Part(), trim = new Part(), roof = new Part(), glaze = new Part(), door = new Part(), metal = new Part()
  const SEG = detail ? 10 : 6

  // ---- The main church ------------------------------------------------
  // the core with chamfered corners, eaves 17, under a hipped roof
  const X0 = -14, X1 = 41, Y0 = -31, Y1 = 19, CH = 6, ZC = 17
  const core: XY[] = [[X0, Y0 + CH], [X0 + CH, Y0], [X1 - CH, Y0], [X1, Y0 + CH], [X1, Y1 - CH], [X1 - CH, Y1], [X0 + CH, Y1], [X0, Y1 - CH]]
  prism(wall, core, 0, ZC, null)
  hipRing(roof, core, ZC, 21.0, 7.0)
  prism(trim, core.map(([x, y]) => [x + Math.sign(x - 13.5) * 0.3, y + Math.sign(y - AY) * 0.3] as XY), ZC - 0.7, ZC - 0.1, null)
  // the cross arms, gabled: N-S and E-W, eaves 23.7, ridge 29.6
  const DC: XY = [13.5, AY] // the crossing
  const AW = 15.5 // half width of an arm: the west gable's eaves are 31 m apart in the telephoto
  // the north and south arms are lower than the nave: their gables sit under the nave's eaves in the aerial,
  // and from the west nothing of them shows beside the west gable
  const SW = 12
  gabled({ wall, roof, x0: DC[0] - SW, x1: DC[0] + SW, y0: Y0, y1: Y1, ze: 17.5, zr: 24.0, axis: 'y', ov: 0.5 })
  gabled({ wall, roof, x0: X0, x1: X1, y0: AY - AW, y1: AY + AW, ze: 23.7, zr: 29.6, axis: 'x', ov: 0.5 })
  // the lower porches projecting from the north and south arms (the OSM bumps, 16 m wide)
  const PW = 8
  gabled({ wall, roof, x0: DC[0] - PW, x1: DC[0] + PW, y0: Y1 - 1, y1: 25, ze: 12.5, zr: 17.5, axis: 'y', ov: 0.4 })
  gabled({ wall, roof, x0: DC[0] - PW, x1: DC[0] + PW, y0: -37, y1: Y0 + 1, ze: 12.5, zr: 17.5, axis: 'y', ov: 0.4 })
  for (const f of [faceOf([DC[0] - PW, -37], [DC[0] + PW, -37]), faceOf([DC[0] + PW, 25], [DC[0] - PW, 25])]) {
    blindArch(trim, f, PW, 0, 6.0, 3.0, { band: 0.6, d: 0.4, seg: SEG + 2, inner: true })
    win(door, f, PW, 0.1, 2.6, 4.6, SEG)
    win(glaze, f, PW, 10.0, 1.2, 2.8, SEG)
  }
  // the east apse, a half octagon
  {
    const r = 7.5, ring: XY[] = []
    for (let k = 0; k <= 4; k++) { const t = -Math.PI / 2 + (Math.PI * k) / 4; ring.push([X1 + r * Math.cos(t) * 0.8, AY + r * Math.sin(t)]) }
    hipApse(wall, roof, ring, 17, [X1, AY, 22], [3], 0, 0.5)
    for (let k = 0; k < 4; k++) {
      const a = ring[k], b = ring[k + 1], f = faceOf(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
      win(glaze, f, L / 2, 6.5, 1.3, 5.0, SEG)
      blindArch(trim, f, L / 2, 1.5, 10.9, 1.3, { band: 0.45, d: 0.25, seg: SEG, inner: detail })
    }
  }
  // the drum over the crossing
  drum({ wall, trim, roof, glaze, metal, c: DC, ap: 8.95, z0: 26.5, zs: 38.9, zg: 42.6, za: 49.0, cross: 5.0, wins: 2, seg: SEG })

  // the arms' end faces: a great blind arch with a tall window, and a round window in the gable
  const armEnds: Array<[Face, number]> = [
    [faceOf([X1, AY - AW], [X1, AY + AW]), 2 * AW], // east, over the apse
  ]
  for (const f of [faceOf([DC[0] - SW, Y0], [DC[0] + SW, Y0]), faceOf([DC[0] + SW, Y1], [DC[0] - SW, Y1])]) {
    blindArch(trim, f, SW, 7.2, 13.4, 3.6, { band: 0.55, d: 0.3, seg: SEG + 2, inner: detail })
    win(glaze, f, SW, 8.2, 2.2, 6.6, SEG)
    win(glaze, f, SW, 19.6, 1.0, 2.2, SEG)
  }
  for (const [f, L] of armEnds) {
    blindArch(trim, f, L / 2, 14.0, 19.8, 4.4, { band: 0.6, d: 0.3, seg: SEG + 2, inner: detail })
    win(glaze, f, L / 2, 15.2, 2.4, 7.4, SEG)
    win(glaze, f, L / 2, 25.6, 1.2, 2.4, SEG)
    for (const s of [L / 2 - 10, L / 2 + 10]) { win(glaze, f, s, 17.6, 1.1, 3.6, SEG); blindArch(trim, f, s, 16.2, 20.6, 1.3, { band: 0.35, d: 0.22, seg: SEG, inner: detail }) }
  }
  // the west gable over the entrance block: the big relief cross
  {
    const f = faceOf([X0, AY + AW], [X0, AY - AW]), s = AW
    const P = (ds: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * (s + ds) + f.n[0] * d, f.o[1] + f.u[1] * (s + ds), z]
    // it stands on the gable and rises over its apex, in front of the drum (telephoto: 28-33 m)
    beam(trim, P(0, 25.0, 0.4), P(0, 33.3, 0.4), 0.9, 0.8)
    beam(trim, P(-1.9, 31.0, 0.4), P(1.9, 31.0, 0.4), 0.9, 0.8)
  }
  // the core's side bays: paired round-headed windows in blind arches
  const bays: Array<[XY, XY, number[]]> = [
    [[X0 + CH, Y0], [X1 - CH, Y0], [3.0, 40.0]], // south wall, either side of the south arm
    [[X1 - CH, Y1], [X0 + CH, Y1], [3.0, 40.0]], // north wall
  ]
  for (const [a, b, ss] of bays) {
    const f = faceOf(a, b)
    for (const s of ss) {
      if (s < 0) continue
      win(glaze, f, s, 6.0, 1.1, 4.6, SEG)
      blindArch(trim, f, s, 1.0, 10.0, 1.3, { band: 0.45, d: 0.25, seg: SEG, inner: detail })
      win(glaze, f, s, 12.0, 0.9, 2.2, SEG)
    }
  }
  // the chamfered corners: a tall niche each
  for (let k = 0; k < 8; k += 2) {
    const a = core[k], b = core[(k + 1) % 8], f = faceOf(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    blindArch(trim, f, L / 2, 0.5, 11.5, 2.2, { band: 0.5, d: 0.3, seg: SEG, inner: detail })
    win(glaze, f, L / 2, 6.0, 1.2, 4.6, SEG)
  }

  // ---- The chapels of Tiridates (north) and Ashkhen (south) ------------
  for (const cy of [AY + 20, AY - 20]) {
    const x0 = -41, x1 = -19, y0 = cy - 8.5, y1 = cy + 8.5, ze = 17.7
    prism(wall, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, ze, null)
    prism(trim, [[x0 - 0.3, y0 - 0.3], [x1 + 0.3, y0 - 0.3], [x1 + 0.3, y1 + 0.3], [x0 - 0.3, y1 + 0.3]], ze - 0.7, ze - 0.1, null)
    hip(roof, x0, y0, x1, y1, ze, 20.4, 5.2)
    drum({ wall, trim, roof, glaze, metal, c: [(x0 + x1) / 2, cy], ap: 4.5, z0: 19.6, zs: 27.4, zg: 28.9, za: 31.5, cross: 4.0, wins: 1, a0: Math.PI / 8, seg: SEG })
    // the west face: a deep arched niche over a door, a window above
    const fw = faceOf([x0, y1], [x0, y0])
    blindArch(trim, fw, 8.5, 0.0, 6.8, 2.9, { band: 0.6, d: 0.45, seg: SEG + 2, inner: true })
    win(door, fw, 8.5, 0.1, 2.2, 4.0, SEG)
    win(glaze, fw, 8.5, 11.0, 1.1, 3.0, SEG)
    // the outer face (north or south): two windows in blind arches
    const fo = cy > AY ? faceOf([x0, y1], [x1, y1]).u[0] > 0 ? faceOf([x1, y1], [x0, y1]) : faceOf([x0, y1], [x1, y1]) : faceOf([x0, y0], [x1, y0])
    for (const s of [6.5, 15.5]) {
      win(glaze, fo, s, 5.5, 1.3, 4.0, SEG)
      blindArch(trim, fo, s, 0.8, 9.0, 1.5, { band: 0.4, d: 0.25, seg: SEG, inner: detail })
    }
  }

  // ---- The entrance block and the belfry -------------------------------
  {
    const x0 = -52, x1 = -19, y0 = -17, y1 = 4, ze = 18.5, ym = (y0 + y1) / 2
    // its west face: three deep arches in a holed wall, the rest of the block a prism behind
    const T = 3.0 // the arches are deep: the doors and windows stand 3 m back
    prism(wall, [[x0 + T, y0], [x1, y0], [x1, y1], [x0 + T, y1]], 0, ze, roof)
    prism(trim, [[x0 - 0.3, y0 - 0.3], [x1, y0 - 0.3], [x1, y1 + 0.3], [x0 - 0.3, y1 + 0.3]], ze - 0.8, ze, roof)
    const fw = faceOf([x0, y1], [x0, y0]), W = y1 - y0
    // three tall round arches: the portal 7.4 m wide to 12.1 m, the side ones 5.1 m wide to 14.4 m (telephoto)
    const holes = [archRing(W / 2, 0, 7.4, 8.4, SEG + 2), archRing(W / 2 - 6.9, 1.0, 5.1, 10.8, SEG + 2), archRing(W / 2 + 6.9, 1.0, 5.1, 10.8, SEG + 2)]
    holedWall(wall, fw, [[0, 0], [W, 0], [W, ze - 0.8], [0, ze - 0.8]], holes, T)
    // the portal's archivolts, stepping in
    for (const [r, w, d] of [[3.7, 0.4, 0.5], [4.1, 0.35, 0.25]] as const) blindArch(trim, fw, W / 2, 0, 8.4, r, { band: w, d, seg: SEG + 2, pil: false, inner: true })
    // what shows in the openings: the doors, and windows in the side niches
    const back = faceOf([x0 + T, y1], [x0 + T, y0])
    win(door, back, W / 2, 0.05, 7.3, 12.0, SEG + 2)
    for (const s of [W / 2 - 6.9, W / 2 + 6.9]) { win(glaze, back, s, 5.0, 4.0, 9.0, SEG + 2); win(door, back, s, 0.05, 2.8, 3.8, SEG) }
    // the side faces: a tall arch niche each
    for (const f of [faceOf([x0, y0], [x0 + 11, y0]), faceOf([x0 + 11, y1], [x0, y1])]) {
      blindArch(trim, f, 5.5, 0.0, 9.0, 2.6, { band: 0.55, d: 0.4, seg: SEG + 2, inner: true })
      win(door, f, 5.5, 0.1, 2.4, 3.4, SEG)
      win(glaze, f, 5.5, 4.4, 2.2, 6.2, SEG)
    }
    // the stepped shoulders of the front, rising to the belfry
    prism(wall, [[x0, ym - 6.5], [x0 + 10.5, ym - 6.5], [x0 + 10.5, ym + 6.5], [x0, ym + 6.5]], ze - 0.1, ze + 1.4, roof)
    // the belfry: a square stage with paired arched openings, open through
    const bx0 = x0 + 1.0, bx1 = x0 + 9.0, by0 = ym - 4.0, by1 = ym + 4.0, bz0 = ze + 1.4, bz1 = 27.4
    const BT = 0.75
    const faces: Array<[XY, XY]> = [[[bx0, by1], [bx0, by0]], [[bx0, by0], [bx1, by0]], [[bx1, by0], [bx1, by1]], [[bx1, by1], [bx0, by1]]]
    for (const [a, b] of faces) {
      const f = faceOf(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const outl: XY[] = [[0, 0], [L, 0], [L, bz1 - bz0], [0, bz1 - bz0]].map(([s, z]) => [s, z + bz0] as XY)
      holedWall(wall, f, outl, [archRing(L / 2 - 1.3, bz0 + 1.4, 1.5, 4.0, SEG), archRing(L / 2 + 1.3, bz0 + 1.4, 1.5, 4.0, SEG)], BT)
    }
    prism(trim, [[bx0 - 0.35, by0 - 0.35], [bx1 + 0.35, by0 - 0.35], [bx1 + 0.35, by1 + 0.35], [bx0 - 0.35, by1 + 0.35]], bz1, bz1 + 0.6, null)
    hip(roof, bx0, by0, bx1, by1, bz1 + 0.6, bz1 + 1.6, 3.5, 0.35)
    // the stone cross on top
    { const cx = (bx0 + bx1) / 2; beam(trim, [cx, ym, bz1 + 1.4], [cx, ym, bz1 + 5.2], 0.7, 0.7); beam(trim, [cx, ym - 1.3, bz1 + 4.0], [cx, ym + 1.3, bz1 + 4.0], 0.7, 0.7) }
    // the shadowed belfry chamber and its bells, seen dark through the openings
    beam(metal, [(bx0 + bx1) / 2, ym, bz0 + 0.6], [(bx0 + bx1) / 2, ym, bz0 + 6.6], 8 - 2 * BT - 0.1, 8 - 2 * BT - 0.1)
    // the narthex behind the entrance block, up to the west gable
    prism(wall, [[x0 + 11, y0], [-14, y0], [-14, y1], [x0 + 11, y1]], ze, 21.0, roof)
  }

  shift([wall, trim, roof, glaze, door, metal], OX, OY)
  return { wall, trim, roof, glaze, door, metal }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.9)
    return [
      { part: p.wall, material: { ...finish('st-gregory-tuff', 0xd5ae88), floodlight: lit } },
      { part: p.trim, material: { ...finish('st-gregory-tuff-light', 0xe0bf98), floodlight: lit } },
      { part: p.roof, material: { ...finish('st-gregory-roof', 0xb8977a), floodlight: (_q: V3, n: V3) => (n[2] > 0.5 ? 0.3 : 0.6) } },
      { part: p.glaze, material: PALETTE.window },
      { part: p.door, material: { ...PALETTE.entrance, color: 0x7a5a44, name: 'entrance' } },
      { part: p.metal, material: finish('st-gregory-cross', 0x4f4a45, 0.6) },
    ]
  }
  const meta = { bearing: 1.5, osm: 'way/31622320', height: 54 }
  await writeModel('yerevan-st-gregory-cathedral.glb', 'Saint Gregory the Illuminator Cathedral', make(false), meta, 6500, 250 * 1024)
  await writeModel('yerevan-st-gregory-cathedral.detail.glb', 'Saint Gregory the Illuminator Cathedral', make(true), meta, 40000, 1536 * 1024)
}
