/**
 * City-County Building (Edward B. Lee with Palmer & Hornbostel, 1915-1917),
 * 414 Grant Street, downtown Pittsburgh — original procedural geometry,
 * CC0-1.0.
 * bun generators/pit-city-county-building.ts
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint (the Grant/Fourth corner, ~234.4 m
 * NAVD88; Ross Street is ~1.4 m higher). Anchor = area centroid of the OSM
 * outline way/203411124, -79.9968533 40.4381097. The block runs on the
 * downtown grid, so the catalog bearing is 26.4: -x is the Grant Street
 * front, +x Ross Street, +y Forbes Avenue, -y Fourth Avenue.
 *
 * Identity, in order: the Grant Street front — three great round arches
 * over the entrance loggia, the carved frieze over them, a mezzanine of
 * square piers, the giant order of eight Doric columns in antis across the
 * upper storeys with dark windows behind, the solid end bays; the deep
 * crowning cornice over a plain attic; a pale grey granite box with
 * regular grouped windows on the long sides; the glass-roofed hall in the
 * light court.
 *
 * Evidence:
 *  - plan: OSM way/203411124 (94 x 58 m) and building:part way/759668754
 *    (the light court, x -23.9..14.5, y -8..9 here), turned into this frame.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, above the base: roof 45.2, parapet and cornice 46.4 (OSM
 *    says 43.9, the roof slab below the cornice); the penthouse behind the
 *    Grant attic 50.6 (x -38..-30, y -24..24); the Ross-side mechanical
 *    block 48.2 (x 34..42, y -16..16); the light court x -20..18, y
 *    -10..10, its glass roof at 16.4-17.
 *  - Grant front proportions: scaled from the frontal photo (Dllu) to the
 *    lidar cornice: arches 9.3 m wide at 13.4 m centres, crowns 15.8; frieze
 *    18-21; mezzanine 21.3-25.5; columns 27.2-38.9 at 4.4 m centres; attic
 *    40.2-43.8; cornice 43.8-46.4 projecting 1.5 m; end bays 9.8 m.
 *  - published: completed 1917 (Wikipedia, "City-County Building
 *    (Pittsburgh)"; Pittsburgh History & Landmarks Foundation).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Pittsburgh City-County Building in 2016.jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh_City-County_Building_in_2016.jpg
 *      Dllu, CC BY-SA 4.0 — the Grant front head-on.
 *    "City-County Building, 2025-05-24.jpg"
 *      https://commons.wikimedia.org/wiki/File:City-County_Building,_2025-05-24.jpg
 *      Cbaile19, CC0 — the Grant front.
 *    "PittsburghCity-CountyBuilding2.jpg"
 *      https://commons.wikimedia.org/wiki/File:PittsburghCity-CountyBuilding2.jpg
 *      Lee Paxton, CC BY-SA 4.0 — Grant front and Fourth Avenue side from
 *      the south-west.
 *    "City-County Building, 2023-04-21, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:City-County_Building,_2023-04-21,_01.jpg
 *      Cbaile19, CC0 — the Forbes side and the Ross end.
 *    "Forbes St. elevation, looking west", "Fourth Ave. elevation, looking
 *    west", "Ross St. elevation, looking north" (HABS PA-1235, 1981,
 *    public domain) — the long sides and the Ross end with its arch.
 *      https://commons.wikimedia.org/wiki/Category:Pittsburgh_City-County_Building
 *  - colour: pale grey granite (palette stone, cooled slightly); the
 *    loggia windows read dark.
 * Estimated: the window grouping on the long sides (from the HABS views),
 * the Ross entrance arch, the court's inner walls.
 *
 * Left out: the frieze sculpture and lettering, lamp standards, the
 * window mullions, rooftop railings.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, wallsSplit } from './pit-allegheny-county-courthouse'

function build() {
  const stone = new Part(), col = new Part(), win = new Part(), roof = new Part(), door = new Part(), glass = new Part()
  const X0 = -47, X1 = 47, Y0 = -29, Y1 = 29, ROOF = 45.2, TOP = 46.4
  const R: [number, number, number, number] = [X0, Y0, X1, Y1]
  const CR: [number, number, number, number] = [-20, -10, 18, 10] // light court

  // ---- the block, plinth, belt courses, attic and the crowning cornice
  wallsSplit(stone, rect(...R), 0, 43.8, 6)
  band(stone, rect(...R), grow(R, 0.3), 0, 1.6, 0.01)
  band(stone, rect(...R), grow(R, 0.3), 10.2, 11.0)
  band(stone, rect(...R), grow(R, 0.35), 26.2, 27.2)
  band(stone, rect(...R), grow(R, 0.3), 39.0, 40.2)
  // cornice: corbelled out 1.5 m, then a thin blocking course
  walls(stone, rect(...R), 43.8, 45.2, grow(R, 1.5))
  walls(stone, grow(R, 1.5), 45.2, 46.0)
  walls(stone, grow(R, 1.5), 46.0, TOP, grow(R, 1.2))
  {
    const o = grow(R, 1.2), i = grow(R, 0.4)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; stone.quad([o[k][0], o[k][1], TOP], [o[j][0], o[j][1], TOP], [i[j][0], i[j][1], TOP], [i[k][0], i[k][1], TOP]) }
    walls(stone, [...i].reverse(), ROOF, TOP)
  }
  // roof ring round the court, the court's walls and its glass roof
  {
    const o = grow(R, 0.4), c = rect(...CR)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; roof.quad([c[k][0], c[k][1], ROOF], [c[j][0], c[j][1], ROOF], [o[j][0], o[j][1], ROOF], [o[k][0], o[k][1], ROOF]) }
    wallsSplit(stone, [...c].reverse(), 16.4, ROOF, 8)
    cap(glass, c, 16.6)
    const cf: [XY, XY][] = [[[CR[2], CR[1]], [CR[0], CR[1]]], [[CR[0], CR[1]], [CR[0], CR[3]]], [[CR[0], CR[3]], [CR[2], CR[3]]], [[CR[2], CR[3]], [CR[2], CR[1]]]]
    for (const [a, b] of cf) {
      const { L } = onWall(a, b), n = Math.floor(L / 3.6)
      for (let i = 0; i < n; i++) { const s = (L - n * 3.6) / 2 + (i + 0.5) * 3.6; for (const [z0, z1] of [[19, 27], [29, 37], [38.5, 43.5]]) panel(win, a, b, s - 1.1, s + 1.1, z0, z1) }
    }
  }
  // penthouse behind the Grant attic and the Ross-side mechanical block
  for (const [r, z] of [[[-38, -24, -30, 24], 50.6], [[34, -16, 42, 16], 48.2]] as [[number, number, number, number], number][]) {
    walls(stone, rect(...r), ROOF, z); cap(roof, rect(...r), z)
  }

  // ---- long sides (Forbes +y, Fourth -y) and the Ross end: grouped windows
  const side = (a: XY, b: XY, endBay: number, skip?: [number, number]) => {
    const { L } = onWall(a, b), use = L - 2 * endBay, n = Math.round(use / 4.4), pitch = use / n
    for (let i = 0; i < n; i++) {
      const s = endBay + (i + 0.5) * pitch
      if (skip && s > skip[0] && s < skip[1]) continue
      panel(win, a, b, s - 1.5, s + 1.5, 3.0, 4.6)
      panel(win, a, b, s - 1.5, s + 1.5, 6.2, 9.4)
      for (const [z0, z1] of [[12.0, 17.8], [19.4, 25.2], [28.0, 32.6], [34.0, 38.4], [41.0, 43.2]]) panel(win, a, b, s - 1.5, s + 1.5, z0, z1)
    }
    // the end bays: a narrow window column each
    for (const s of [endBay / 2, L - endBay / 2]) for (const [z0, z1] of [[3, 9.4], [12, 17.8], [19.4, 25.2], [28, 32.6], [34, 38.4], [41, 43.2]]) panel(win, a, b, s - 1.4, s + 1.4, z0, z1)
  }
  side([X0, Y0], [X1, Y0], 9.8)
  side([X1, Y1], [X0, Y1], 9.8)
  const ross: [XY, XY] = [[X1, Y0], [X1, Y1]]
  side(ross[0], ross[1], 9.8, [29 - 5, 29 + 5])
  arch(door, ross[0], ross[1], 29 - 2.4, 29 + 2.4, 1.4, 7.5, 0.06, 10)
  arch(win, ross[0], ross[1], 29 - 1.4, 29 + 1.4, 12, 22, 0.05, 8)

  // ---- the Grant Street front (x = X0, facing -x; s runs from y = Y1 to Y0)
  const ga: XY = [X0, Y1], gb: XY = [X0, Y0], { P } = onWall(ga, gb)
  const C = (Y1 - Y0) / 2
  // end bays
  for (const s of [4.9, 58 - 4.9]) for (const k of [-1.3, 1.3]) for (const [z0, z1] of [[3, 9.4], [12, 25.4], [28.4, 38.4], [41, 43.2]]) panel(win, ga, gb, s + k - 0.7, s + k + 0.7, z0, z1)
  // the central base projects 0.5 m: arcade wall with the three great arches
  {
    const s0 = C - 19.85, s1 = C + 19.85, d = 0.5
    const q = (s: number, z: number, o: number) => P(s, z, o)
    stone.quad(q(s0, 0, d), q(s1, 0, d), q(s1, 18, d), q(s0, 18, d))
    stone.quad(q(s0, 0, 0), q(s0, 0, d), q(s0, 18, d), q(s0, 18, 0))
    stone.quad(q(s1, 0, d), q(s1, 0, 0), q(s1, 18, 0), q(s1, 18, d))
    // the frieze over the arches, projecting further
    const f0 = s0 - 1.5, f1 = s1 + 1.5, fd = 1.0
    stone.quad(q(f0, 18, fd), q(f1, 18, fd), q(f1, 21, fd), q(f0, 21, fd))
    stone.quad(q(f0, 18, 0), q(f1, 18, 0), q(f1, 18, fd), q(f0, 18, fd))
    stone.quad(q(f0, 21, fd), q(f1, 21, fd), q(f1, 21, 0), q(f0, 21, 0))
    stone.quad(q(f0, 18, 0), q(f0, 18, fd), q(f0, 21, fd), q(f0, 21, 0))
    stone.quad(q(f1, 18, fd), q(f1, 18, 0), q(f1, 21, 0), q(f1, 21, fd))
    for (const k of [-1, 0, 1]) {
      const c = C + k * 13.4
      arch(win, ga, gb, c - 4.65, c + 4.65, 0.4, 11.15, d + 0.06, 10) // the deep loggia reads dark
      arch(door, ga, gb, c - 1.6, c + 1.6, 0.4, 3.6, d + 0.1, 6)
    }
  }
  // mezzanine: square piers with dark openings between
  {
    const s0 = C - 19.85, s1 = C + 19.85, n = 9, w = (s1 - s0) / n
    for (let i = 0; i < n; i++) panel(win, ga, gb, s0 + i * w + 0.55, s0 + (i + 1) * w - 0.55, 21.6, 25.3)
  }
  // the loggia behind the columns: recessed dark wall, then eight columns in antis
  {
    const s0 = C - 19.85, s1 = C + 19.85
    // the dark loggia windows on the face, the columns standing in front of
    // them under a projecting entablature (the real columns stand in antis
    // in front of a recessed wall; drawn forward instead of cutting the wall)
    const q = (s: number, z: number, o: number) => P(s, z, o)
    win.quad(q(s0, 27.2, 0.05), q(s1, 27.2, 0.05), q(s1, 38.9, 0.05), q(s0, 38.9, 0.05))
    const e0 = s0 - 0.6, e1 = s1 + 0.6, ed = 2.0
    stone.quad(q(e0, 38.9, ed), q(e1, 38.9, ed), q(e1, 40.2, ed), q(e0, 40.2, ed))
    stone.quad(q(e1, 38.9, 0), q(e0, 38.9, 0), q(e0, 38.9, ed), q(e1, 38.9, ed))
    stone.quad(q(e0, 40.2, ed), q(e1, 40.2, ed), q(e1, 40.2, 0), q(e0, 40.2, 0))
    stone.quad(q(e0, 38.9, 0), q(e0, 38.9, ed), q(e0, 40.2, ed), q(e0, 40.2, 0))
    stone.quad(q(e1, 38.9, ed), q(e1, 38.9, 0), q(e1, 40.2, 0), q(e1, 40.2, ed))
    // the antae: flat pilasters at the ends
    for (const sa of [s0 + 0.5, s1 - 0.5]) {
      stone.quad(q(sa - 0.7, 27.2, 1.0), q(sa + 0.7, 27.2, 1.0), q(sa + 0.7, 38.9, 1.0), q(sa - 0.7, 38.9, 1.0))
      stone.quad(q(sa - 0.7, 27.2, 0), q(sa - 0.7, 27.2, 1.0), q(sa - 0.7, 38.9, 1.0), q(sa - 0.7, 38.9, 0))
      stone.quad(q(sa + 0.7, 27.2, 1.0), q(sa + 0.7, 27.2, 0), q(sa + 0.7, 38.9, 0), q(sa + 0.7, 38.9, 1.0))
    }
    for (let i = 0; i < 8; i++) {
      const s = C + (i - 3.5) * 4.4, r = 0.9, seg = 10
      // fluted Doric shaft drawn as a 10-sided column, centre 0.9 m inside the face
      for (let k = 0; k < seg; k++) {
        const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
        const A = q(s + r * Math.cos(t0), 27.2, 1.0 + r * Math.sin(t0)), B = q(s + r * Math.cos(t1), 27.2, 1.0 + r * Math.sin(t1))
        const A1 = q(s + r * 0.88 * Math.cos(t0), 38.3, 1.0 + r * 0.88 * Math.sin(t0)), B1 = q(s + r * 0.88 * Math.cos(t1), 38.3, 1.0 + r * 0.88 * Math.sin(t1))
        const m: V3 = [(A[0] + B[0]) / 2 - q(s, 27.2, 1)[0], (A[1] + B[1]) / 2 - q(s, 27.2, 1)[1], 0]
        const quadOut = (pts: V3[]) => {
          const n = [(pts[1][1] - pts[0][1]) * (pts[2][2] - pts[0][2]) - (pts[1][2] - pts[0][2]) * (pts[2][1] - pts[0][1]), (pts[1][2] - pts[0][2]) * (pts[2][0] - pts[0][0]) - (pts[1][0] - pts[0][0]) * (pts[2][2] - pts[0][2])]
          if (n[0] * m[0] + n[1] * m[1] >= 0) col.quad(pts[0], pts[1], pts[2], pts[3]); else col.quad(pts[0], pts[3], pts[2], pts[1])
        }
        quadOut([A, B, B1, A1])
      }
      // square abacus
      const ab: XY[] = [[s - 0.95, 0.05], [s + 0.95, 0.05], [s + 0.95, 1.95], [s - 0.95, 1.95]].map(([ss, o]) => { const p = q(ss, 0, o); return [p[0], p[1]] as XY })
      const ccw = (ab[1][0] - ab[0][0]) * (ab[2][1] - ab[0][1]) - (ab[1][1] - ab[0][1]) * (ab[2][0] - ab[0][0]) > 0 ? ab : [...ab].reverse()
      walls(stone, ccw, 38.3, 38.9)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : n[0] < -0.7 ? 0.55 : 0.2)
  return [
    { part: stone, material: { ...finish('ccb-granite', 0xe2ddd3), floodlight: lit } },
    { part: col, material: { ...PALETTE.trim, floodlight: () => 0.6 } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('pit-city-county-building', 'City-County Building', [40.4381097, -79.9968533], 26.4, build() as any, 5000)
