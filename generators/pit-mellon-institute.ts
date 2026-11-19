/**
 * Mellon Institute of Industrial Research (Janssen & Cocken, 1931-1937),
 * 4400 Fifth Avenue, Oakland, Pittsburgh — original procedural geometry,
 * CC0-1.0. bun generators/pit-mellon-institute.ts
 *
 * Imports `column` and the box helper from pit-soldiers-and-sailors.ts and
 * `band` from pit-allegheny-county-courthouse.ts; merge those first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/25795368, -79.9510530 40.4461160. The Fifth Avenue front runs
 * at 77.3°, so the catalog bearing is 347.3: model +y is the Fifth Avenue
 * front (north-north-west), -y the back, -x the Bellefield side, +x the
 * Thackeray side. The block is a trapezoid (its west wall runs at 340.5°,
 * the east at 354.6°), drawn from the outline as it is.
 *
 * Identity, in order: the long unbroken ring of 62 monolithic Ionic
 * columns standing in front of a shadowed recessed wall on all four sides,
 * between solid chamfered corner pavilions; the deep plain entablature and
 * low attic over them; the granite base it all stands on, with the broad
 * flight of steps up from Fifth Avenue; the low hipped roof behind the
 * attic, pale limestone everywhere else.
 *
 * Evidence:
 *  - plan: OSM outline way/25795368, the outer way of multipolygon
 *    relation/20147694 (whose two inner ways are the light courts), and
 *    the two building:parts way/1472093013 and way/1472093014, the low
 *    infill in the courts (the column line and pavilions; the chamfered
 *    corners as mapped). The colonnade recess depth (4.2 m) and
 *    the two light courts and penthouse from the lidar.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, above the lowest ground (south-west corner, 278.6 m NAVD88;
 *    the ground rises ~2 m to Fifth Avenue on the north and ~2 m to the
 *    east): colonnade floor (granite base) 4.6; entablature 22.5; the hip
 *    rises from behind a 1.7 m attic step (photo) to 26.5-27; flat roofs 27; the central
 *    mechanical penthouse 33-35.5; the two light courts drop below the
 *    street, with low roofs at ~11-15 in their middles (drawn as a floor
 *    at 13).
 *  - published: 62 monolithic Ionic columns, 1937 (Wikipedia, "Mellon
 *    Institute of Industrial Research"; Carnegie Mellon University).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Mellon Institute, Oakland, Pittsburgh, 2019-09-30, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Mellon_Institute,_Oakland,_Pittsburgh,_2019-09-30,_02.jpg
 *      Cbaile19, CC0 — the Fifth Avenue front head-on: 16 columns between
 *      the pavilions, the steps, the storey heights.
 *    "Mellon Institute, Oakland, Pittsburgh, 2019-09-30, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Mellon_Institute,_Oakland,_Pittsburgh,_2019-09-30,_01.jpg
 *      Cbaile19, CC0 — the front and the corner pavilion obliquely, the
 *      granite base.
 *    "Mellon-Institute.jpg"
 *      https://commons.wikimedia.org/wiki/File:Mellon-Institute.jpg
 *      MartinThoma, CC0 — the steps and columns close up.
 *    "Mellon Institute 01.JPG", "Mellon Institute 02.JPG"
 *      https://commons.wikimedia.org/wiki/File:Mellon_Institute_01.JPG
 *      https://commons.wikimedia.org/wiki/File:Mellon_Institute_02.JPG
 *      Piotrus, CC BY-SA 3.0 — the sides and corners from the streets.
 *    "Mellon Institute entrance at twilight, 2022-12-07, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Mellon_Institute_entrance_at_twilight,_2022-12-07,_01.jpg
 *      Cbaile19, CC0 — the colonnade lit from below at night.
 *    USGS NAIP orthophoto (public domain): plan, the brown hip band, the
 *    grey flat roofs and courts.
 *  - colour: pale grey-buff limestone; pinkish-grey granite base; the
 *    hip band brown in NAIP (the 1930s postcard shows it red: tile or old
 *    copper), so a muted brown, not the green the brief expected.
 * Estimated: the column count per face (16 on the front from the photo;
 * 12 on the short south face and 17 on each side to make the published
 * 62), the columns' diameter (1.9 m) and capitals, the windows in the
 * recess, the bronze doors' positions, the pavilion widths (4 m beside the
 * chamfers), the front steps (outside the outline, ~1.6 m high).
 * Doubts: the back (south) face is seen only at a distance; its column
 * count is derived, not counted.
 *
 * Left out: flutes (the shafts are plain on the real building too),
 * volutes (drawn as a wide abacus), the inscription, lamps, the courts'
 * inner facades (drawn plain).
 *
 * Night: the recessed wall behind the columns is lit from below
 * (`floodlight` on the limestone in the colonnade), the doors glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { band } from './pit-allegheny-county-courthouse'
import { column } from './pit-soldiers-and-sailors'

/** Keep the part of a convex ring on the side of x = k given by `keepLess`. */
function clipX(r: XY[], k: number, keepLess: boolean): XY[] {
  const inside = (p: XY) => (keepLess ? p[0] <= k : p[0] >= k)
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) { const t = (k - a[0]) / (b[0] - a[0]); out.push([k, a[1] + t * (b[1] - a[1])]) }
  }
  return out
}

function build() {
  const stone = new Part(), granite = new Part(), win = new Part(), hip = new Part(), roof = new Part(), door = new Part()

  // OSM outline, counter-clockwise from the north-west chamfer
  const O: XY[] = [[-36.2, 40.5], [-42.1, 34.8], [-33.5, -37.3], [-27.3, -43.8], [27.3, -43.9], [33.1, -39.2], [42.3, 32.8], [36.0, 39.6]]
  const BASE = 4.6, CAPZ = 17.3, ENT = 22.5, RIDGE = 27, REC = 4.2, PAV = 4.0
  // the four long faces (W, S, E, N) with their column counts
  const faces: { a: XY; b: XY; n: number }[] = [
    { a: O[1], b: O[2], n: 17 }, { a: O[3], b: O[4], n: 12 }, { a: O[5], b: O[6], n: 17 }, { a: O[7], b: O[0], n: 16 },
  ]

  // ---- granite base under everything
  walls(granite, O, 0, BASE)
  band(granite, O, inset(O, -0.3), BASE - 0.5, BASE, 0.2)

  // ---- the core: out to the outline at the pavilions, recessed behind the columns
  const ring: XY[] = []
  for (const f of faces) {
    const { L, u, n } = onWall(f.a, f.b)
    const at = (s: number, o: number): XY => [f.a[0] + u[0] * s + n[0] * o, f.a[1] + u[1] * s + n[1] * o]
    ring.push(at(0, 0), at(PAV, 0), at(PAV, -REC), at(L - PAV, -REC), at(L - PAV, 0), at(L, 0))
  }
  // the recessed walls behind the columns read dark in every photo (deep
  // shadow and weathering): drawn in the granite base's darker tone
  for (let k = 0; k < ring.length; k++) {
    const p = ring[k], q = ring[(k + 1) % ring.length]
    const recessed = k % 6 === 2
    ;(recessed ? granite : stone).quad([p[0], p[1], BASE], [q[0], q[1], BASE], [q[0], q[1], CAPZ], [p[0], p[1], CAPZ])
  }
  // entablature, attic, cornice
  walls(stone, O, CAPZ, ENT - 1.0)
  band(stone, O, inset(O, -0.6), ENT - 1.0, ENT, 0.4)
  for (const f of faces) {
    const { L, P } = onWall(f.a, f.b)
    // the colonnade floor and the soffit over it
    granite.quad(P(PAV, BASE, -REC), P(PAV, BASE, 0), P(L - PAV, BASE, 0), P(L - PAV, BASE, -REC))
    stone.quad(P(PAV, CAPZ, -REC), P(L - PAV, CAPZ, -REC), P(L - PAV, CAPZ, 0), P(PAV, CAPZ, 0))
    // columns, 1.6 m in from the outline, and windows on the recessed wall
    const pitch = (L - 2 * PAV) / f.n
    for (let i = 0; i < f.n; i++) {
      const s = PAV + (i + 0.5) * pitch, c = P(s, 0, -1.7)
      column(stone, stone, c[0], c[1], 0.95, BASE, CAPZ, { base: 0.6, cap: 0.75, seg: 10 })
      if (i < f.n - 1) {
        const sw = s + pitch / 2, mid = Math.abs(sw - L / 2) < pitch * 1.6 && f.n === 16
        const part = mid ? door : win
        part.quad(P(sw - 0.85, BASE + 1.2, -REC + 0.05), P(sw + 0.85, BASE + 1.2, -REC + 0.05), P(sw + 0.85, mid ? 12.5 : 15.6, -REC + 0.05), P(sw - 0.85, mid ? 12.5 : 15.6, -REC + 0.05))
      }
    }
  }

  // ---- roofs: a narrow ledge, the hip band, the flat roof with two courts
  // the plain attic step over the cornice hides the roof from the street
  const r1 = inset(O, 1.2), r2 = inset(O, 2.0), r5 = inset(O, 5.5), ATT = 24.2
  walls(stone, r1, ENT, ATT)
  walls(stone, r1, ATT, ATT, r2)
  walls(stone, [...r2].reverse(), ATT - 0.4, ATT)
  for (let k = 0; k < O.length; k++) {
    const j = (k + 1) % O.length
    stone.quad([O[k][0], O[k][1], ENT], [O[j][0], O[j][1], ENT], [r1[j][0], r1[j][1], ENT], [r1[k][0], r1[k][1], ENT])
    hip.quad([r2[k][0], r2[k][1], ATT - 0.4], [r2[j][0], r2[j][1], ATT - 0.4], [r5[j][0], r5[j][1], RIDGE], [r5[k][0], r5[k][1], RIDGE])
  }
  const CW: [number, number] = [-20.5, -10.5], CE: [number, number] = [10, 22], CY0 = -27, CY1 = 24
  const yTop = 34.5, yBot = -37.8
  cap(roof, clipX(r5, CW[0], true), RIDGE)
  cap(roof, clipX(r5, CE[1], false), RIDGE)
  for (const [x0, x1] of [CW, CE]) { cap(roof, rect(x0, yBot, x1, CY0), RIDGE); cap(roof, rect(x0, CY1, x1, yTop), RIDGE) }
  cap(roof, rect(CW[1], yBot, CE[0], yTop), RIDGE)
  // the light courts: inner walls down to a low floor
  for (const [x0, x1] of [CW, CE]) {
    walls(stone, [...rect(x0, CY0, x1, CY1)].reverse(), 13, RIDGE)
    cap(granite, rect(x0, CY0, x1, CY1), 13)
  }
  // the mechanical penthouse on the spine
  walls(stone, rect(-8, -16, -1, 4), RIDGE, 34.5)
  cap(roof, rect(-8, -16, -1, 4), 34.5)
  walls(stone, rect(-1, -13, 6, 2), RIDGE, 31)
  cap(roof, rect(-1, -13, 6, 2), 31)

  // ---- the broad steps up from Fifth Avenue (outside the outline)
  {
    const f = faces[3], { L, P } = onWall(f.a, f.b)
    for (let i = 0; i < 6; i++) {
      const o = 4.2 - i * 0.7, z = 3.0 + (i + 1) * (BASE - 3.0) / 6
      const q = [P(PAV + 2, 0, o), P(L - PAV - 2, 0, o), P(L - PAV - 2, 0, 0), P(PAV + 2, 0, 0)]
      const r: XY[] = q.map((p) => [p[0], p[1]] as XY)
      const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0 ? r : [...r].reverse()
      walls(granite, ccw, 0, z)
      cap(granite, ccw, z)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0.05 : p[2] > BASE && p[2] < CAPZ + 1 ? 0.8 : 0.15)
  return [
    { part: stone, material: { ...finish('mellon-limestone', 0xe2dacb), floodlight: lit } },
    { part: granite, material: finish('mellon-granite', 0xafa298) },
    { part: win, material: PALETTE.window },
    { part: hip, material: finish('mellon-hip', 0xa58c7c) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('pit-mellon-institute', 'Mellon Institute', [40.446116, -79.951053], 347.3, build() as any, 6500)
