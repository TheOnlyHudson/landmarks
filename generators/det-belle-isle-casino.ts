/**
 * Belle Isle Casino, Detroit (1907-08, Van Leyen & Schilling): procedural,
 * CC0-1.0.
 * bun generators/det-belle-isle-casino.ts
 *
 * Map frame: x, y, z up, metres, turned to the building: +y runs along
 * bearing 77 (east-north-east, the long axis), +x along 167 (towards the
 * Detroit River). The anchor is the centroid of OSM way/106948123
 * (42.3345998, -82.9954649). The land front, with the two towers and the
 * eleven-arch arcade, faces -x (north-north-west); the river front faces +x.
 *
 * Identity, in order: a long two-storey buff brick pavilion under a red
 * tile hipped roof; the two square corner towers on the land front rising
 * over the eaves, each with a balustraded platform and a belvedere under a
 * flared pyramidal tile roof with a clock gable; the round-arched arcade of
 * the ground floor on both long fronts, with paired windows above; the
 * two-storey corner pavilions and the centre bay on the river front, over
 * an exposed basement.
 *
 * Evidence:
 *  - plan: OSM way/106948123 (Belle Isle Casino, building=public, 2
 *    levels). No building:part ways.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame. y = 0 is the ground on the river side; the land front's
 *    ground is 1.3 m higher. Over y = 0: main eaves ~10.6, ridge 14.3 (along
 *    x = -1); towers' roofs to 18.2 with belvedere eaves ~16 (sparse returns; drawn to 18.9 with eaves at 16.7, as the land-front photo shows the towers standing about twice the eave height); the river
 *    corner pavilions ~10.8 to 13.1; the river centre bay ~11.
 *  - published: 1907-08, Van Leyen & Schilling (Wikipedia, "Belle Isle
 *    Casino"; NRHP Belle Isle historic district).
 *  - photos: the bays, arches, windows, towers and colours.
 *  Estimated: arch and window sizes, the towers' stages between the lidar
 *  heights, the balustrades.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_Belle_Isle_Casino_front_entrance.jpg, Mikerussell, CC BY-SA 3.0
 *    (the land front, square on)
 *  - Detroit_old_Belle_Isle_Casino_facing_Detroit_River.jpg, Mikerussell,
 *    CC BY-SA 3.0 (the river front, oblique)
 *  - Belle_Isle_Casino.jpg, Drklinkert, CC BY-SA 4.0 (the land front and an
 *    end, at dusk)
 *  - Belleisledetroit.jpg, Mikerussell, CC BY-SA 3.0 (from the river: the
 *    two towers stand on the far, land side)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the brief said four corner towers; the photos and the lidar show
 * two tall towers (on the land front) and two lower two-storey corner
 * pavilions on the river front, which is what is drawn. The ends are drawn
 * from the oblique photos only. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc } from './sea-tacoma-union-station'

/** A hipped roof over an axis-aligned plan from eave z0 to ridge z1, with overhang ov and a soffit. */
function hip(roof: Part, soffit: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ov = 0.6, flare = 0) {
  const X0 = x0 - ov, X1 = x1 + ov, Y0 = y0 - ov, Y1 = y1 + ov
  const h = Math.min(X1 - X0, Y1 - Y0) / 2, cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2
  const rx = (X1 - X0) / 2 - h, ry = (Y1 - Y0) / 2 - h
  const ring0: V3[] = [[X0, Y0, z0], [X1, Y0, z0], [X1, Y1, z0], [X0, Y1, z0]]
  const top: V3[] = [[cx - rx, cy - ry, z1], [cx + rx, cy - ry, z1], [cx + rx, cy + ry, z1], [cx - rx, cy + ry, z1]]
  // an optional flare: a flatter skirt at the eaves
  let lo = ring0
  if (flare > 0) {
    const f = 0.28, mid: V3[] = ring0.map((p, i) => [p[0] + (top[i][0] - p[0]) * f, p[1] + (top[i][1] - p[1]) * f, z0 + flare] as V3)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; roof.quad(ring0[i], ring0[j], mid[j], mid[i]) }
    lo = mid
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    if (Math.hypot(top[i][0] - top[j][0], top[i][1] - top[j][1]) < 1e-3) roof.tri(lo[i], lo[j], top[j])
    else roof.quad(lo[i], lo[j], top[j], top[i])
  }
  cap(soffit, rect(X0, Y0, X1, Y1), z0, false)
  walls(soffit, rect(X0, Y0, X1, Y1), z0 - 0.3, z0)
}

const archR = (sc: number, w: number, z0: number, zs: number, segs = 8): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()
  const LG = 1.3 // the land front's ground over y = 0
  const MX0 = -14.8, MX1 = 12.7, MY0 = -25.0, MY1 = 25.2, EAVE = 10.6, RIDGE = 14.3
  const FLOOR2 = LG + 4.9

  // ------------------------------------------------ the main block
  walls(stone, rect(MX0 - 0.1, MY0 - 0.1, MX1 + 0.1, MY1 + 0.1), 0, LG + 0.5)
  walls(brick, rect(MX0, MY0, MX1, MY1), LG + 0.5, EAVE - 0.8)
  walls(stone, rect(MX0 - 0.15, MY0 - 0.15, MX1 + 0.15, MY1 + 0.15), EAVE - 0.8, EAVE)
  walls(stone, rect(MX0 - 0.1, MY0 - 0.1, MX1 + 0.1, MY1 + 0.1), FLOOR2 - 0.25, FLOOR2 + 0.15) // the string course
  hip(roof, stone, MX0, MY0, MX1, MY1, EAVE, RIDGE, 0.9)

  // the land front: eleven arches on piers, paired windows above
  {
    const f: Face = { o: [MX0, 0, 0], n: [-1, 0] } // s = -y
    const s0 = -19.3, s1 = 17.3, n = 11, bay = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const c = s0 + (k + 0.5) * bay
      flatShape(stone, f, archR(c, bay - 0.65, LG + 0.5, LG + 3.0), 0.03)
      flatShape(win, f, archR(c, bay - 1.15, LG + 0.5, LG + 3.0), 0.06)
      flatShape(stone, f, R(c - 1.35, FLOOR2 + 0.45, c + 1.35, FLOOR2 + 3.05), 0.03)
      flatShape(win, f, R(c - 1.2, FLOOR2 + 0.6, c + 1.2, FLOOR2 + 2.9), 0.06)
    }
    // the doors behind the middle arch
    const cm = s0 + 5.5 * bay
    flatShape(door, f, R(cm - 0.9, LG + 0.5, cm + 0.9, LG + 2.7), 0.08)
  }
  // the river front: arches over the basement, windows above
  {
    const f: Face = { o: [MX1, 0, 0], n: [1, 0] } // s = y
    for (const [s0, s1, n] of [[-21.5, -6.4, 5], [6.8, 21.6, 5]] as [number, number, number][]) {
      const bay = (s1 - s0) / n
      for (let k = 0; k < n; k++) {
        const c = s0 + (k + 0.5) * bay
        flatShape(win, f, R(c - 0.8, 0.8, c + 0.8, 1.9), 0.06) // basement
        flatShape(stone, f, archR(c, bay - 0.55, 2.4, 5.0), 0.03)
        flatShape(win, f, archR(c, bay - 1.05, 2.4, 5.0), 0.06)
        flatShape(win, f, R(c - 1.1, FLOOR2 + 0.6, c + 1.1, FLOOR2 + 2.9), 0.06)
      }
    }
  }
  // the ends: two rows of windows
  for (const [y, sgn] of [[MY0, -1], [MY1, 1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sgn] } // s = -sgn * x
    for (const x of [-5.0, -1.0, 3.0]) {
      const c = -sgn * x
      flatShape(win, f, archR(c, 1.9, LG + 0.6, LG + 2.9), 0.06)
      flatShape(win, f, R(c - 0.85, FLOOR2 + 0.7, c + 0.85, FLOOR2 + 2.6), 0.06)
    }
  }

  // ------------------------------------------------ the river-front corner pavilions and centre bay
  for (const [y0, y1] of [[-29.2, -21.97], [22.0, 29.3]]) {
    walls(stone, rect(5.3, y0, 15.95, y1), 0, 1.9)
    walls(brick, rect(5.3, y0, 15.95, y1), 1.9, 10.0)
    walls(stone, rect(5.15, y0 - 0.15, 16.1, y1 + 0.15), 10.0, 10.8)
    hip(roof, stone, 5.3, y0, 15.95, y1, 10.8, 13.2, 0.7)
    for (const [f, cs] of [[{ o: [15.95, 0, 0], n: [1, 0] } as Face, (y0 + y1) / 2], [{ o: [0, y0 < 0 ? y0 : y1, 0], n: [0, y0 < 0 ? -1 : 1] } as Face, y0 < 0 ? 10.6 : -10.6]] as [Face, number][]) {
      for (const d of [-2.0, 2.0]) {
        flatShape(win, f, archR(cs + d, 1.7, 2.6, 4.9), 0.06)
        flatShape(win, f, R(cs + d - 0.8, FLOOR2 + 0.7, cs + d + 0.8, FLOOR2 + 2.6), 0.06)
      }
    }
  }
  {
    walls(stone, rect(12.6, -6.0, 16.05, 6.36), 0, 1.9)
    walls(brick, rect(12.6, -6.0, 16.05, 6.36), 1.9, 10.0)
    walls(stone, rect(12.45, -6.15, 16.2, 6.5), 10.0, 10.9)
    cap(roof, rect(12.45, -6.15, 16.2, 6.5), 10.9)
    const f: Face = { o: [16.05, 0, 0], n: [1, 0] }
    for (const d of [-3.6, 0, 3.6]) {
      flatShape(stone, f, archR(d, 2.7, 2.4, 5.0), 0.03)
      flatShape(win, f, archR(d, 2.2, 2.4, 5.0), 0.06)
      flatShape(win, f, R(d - 0.9, FLOOR2 + 0.7, d + 0.9, FLOOR2 + 2.6), 0.06)
    }
  }

  // ------------------------------------------------ the two towers on the land front
  for (const [y0, y1] of [[-25.94, -17.6], [19.58, 26.2]]) {
    const x0 = -16.1, x1 = -9.1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    const TT = EAVE + 2.9 // the shaft's top, under the balustrade
    walls(stone, rect(x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1), LG - 0.4, LG + 0.5)
    walls(brick, rect(x0, y0, x1, y1), LG + 0.5, TT - 0.6)
    walls(stone, rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2), TT - 0.6, TT)
    cap(roof, rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2), TT)
    // balustrade round the platform
    const bal = rect(x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1), bin = rect(x0 + 0.15, y0 + 0.15, x1 - 0.15, y1 - 0.15)
    walls(stone, bal, TT, TT + 0.95); walls(stone, [...bin].reverse(), TT, TT + 0.95)
    for (let i = 0; i < 4; i++) {
      const a = bal[i], b = bal[(i + 1) % 4], c = bin[(i + 1) % 4], d = bin[i]
      stone.quad([a[0], a[1], TT + 0.95], [b[0], b[1], TT + 0.95], [c[0], c[1], TT + 0.95], [d[0], d[1], TT + 0.95])
    }
    // the belvedere: a smaller square stage with three openings a face
    const bx0 = cx - 2.3, bx1 = cx + 2.3, by0 = cy - 2.3, by1 = cy + 2.3, BE = 16.7
    walls(brick, rect(bx0, by0, bx1, by1), TT, BE - 0.5)
    walls(stone, rect(bx0 - 0.15, by0 - 0.15, bx1 + 0.15, by1 + 0.15), BE - 0.5, BE)
    hip(roof, stone, bx0, by0, bx1, by1, BE, 18.9, 1.0, 0.45)
    const faces: Face[] = [{ o: [bx0, 0, 0], n: [-1, 0] }, { o: [bx1, 0, 0], n: [1, 0] }, { o: [0, by0, 0], n: [0, -1] }, { o: [0, by1, 0], n: [0, 1] }]
    for (const f of faces) {
      const c = f.n[0] !== 0 ? (f.n[0] < 0 ? -cy : cy) : (f.n[1] < 0 ? cx : -cx)
      for (const d of [-1.35, 0, 1.35]) flatShape(win, f, R(c + d - 0.45, TT + 1.0, c + d + 0.45, BE - 0.9), 0.06)
      // the clock gable over the eaves: a stone disc on a little pediment
      extrudeShape(stone, f, [[c - 1.1, BE - 0.1], [c + 1.1, BE - 0.1], [c + 1.1, BE + 0.9], [c, BE + 1.6], [c - 1.1, BE + 0.9]], 0.6, 1.1)
      flatShape(stone, { o: [f.o[0] + f.n[0] * 1.1, f.o[1] + f.n[1] * 1.1, 0], n: f.n }, arc(c, BE + 0.75, 0.5, 0, 360, 10).slice(0, 10), 0.03)
    }
    // the tower's own windows below: one arch at the arcade level and a window above, on the front and the outer end
    const tf: Face[] = [{ o: [x0, 0, 0], n: [-1, 0] }, { o: [0, y0 < 0 ? y0 : y1, 0], n: [0, y0 < 0 ? -1 : 1] }]
    for (const f of tf) {
      const c = f.n[0] !== 0 ? -cy : (f.n[1] < 0 ? cx : -cx)
      flatShape(stone, f, archR(c, 2.9, LG + 0.5, LG + 3.0), 0.03)
      flatShape(win, f, archR(c, 2.3, LG + 0.5, LG + 3.0), 0.06)
      flatShape(win, f, R(c - 1.0, FLOOR2 + 0.7, c + 1.0, FLOOR2 + 2.7), 0.06)
    }
  }

  return [
    { part: brick, material: finish('casino-brick', 0xd8c49c) },
    { part: stone, material: finish('casino-stone', 0xe8dcc4) },
    { part: roof, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-belle-isle-casino', 'Belle Isle Casino', [42.3345998, -82.9954649], 77, build(), 5000)
