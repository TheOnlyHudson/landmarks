/**
 * Bibi-Heybat Mosque (Bibiheybət məscidi), on the shore road south of Baku:
 * procedural, CC0-1.0.
 *   bun generators/baku-bibi-heybat-mosque.ts   (writes the low and the detail model)
 *
 * The mosque over the shrine of Ukeyma Khanum, destroyed in 1936 and
 * rebuilt 1997-2008. Identity, in order: the two tall minarets at the
 * hall's ends, square at the foot, round above, a stalactite corbel under a
 * railed balcony, a slimmer top and a ribbed cap; the three ribbed stone
 * domes in a row on drums ringed with arched windows; the long cream
 * hall with its tall pointed windows, a stalactite cornice and the deep
 * carved portal on its east front; all in pale cream limestone, the domes
 * a shade greyer.
 *
 * Map frame: x across the hall (compass 102.6, east-south-east), y along
 * it (compass 12.6, north-north-east), z up, metres; placed at bearing
 * 12.6. Origin: the area centroid of OSM way/291299394, at 49.820266,
 * 40.308693. y = 0 is the lowest ground under the footprint.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): the hall way/291299394 (levels 4), 48.6 x
 *   17.1 m; the domes way/291299398, way/291299402, way/291299404 (circles
 *   9.3 m across); the minarets way/291299399 and way/291299401 (circles
 *   4 m across, levels 10) at the hall's south-east and north-east
 *   corners; the place of worship node/2947442051 (wikidata Q856262). The
 *   courtyard buildings way/291299391 and way/291299396 are not modelled.
 * - Photos (Wikimedia Commons, evidence):
 *   p1 Petar Milošević, CC BY-SA 4.0, "Bibi-Heybat Mosque, Baku,
 *      Azerbaijan (Мечеть Биби-Эйбат, 2026).jpg": from above the road on
 *      the west: the hall, its windows and cornice, the domes and drums,
 *      both minarets; heights scaled from it (the near minaret's shaft
 *      4 m, 0.06 m/px)
 *      https://commons.wikimedia.org/wiki/File:Bibi-Heybat_Mosque,_Baku,_Azerbaijan_(%D0%9C%D0%B5%D1%87%D0%B5%D1%82%D1%8C_%D0%91%D0%B8%D0%B1%D0%B8-%D0%AD%D0%B9%D0%B1%D0%B0%D1%82,_2026).jpg
 *   p3 Ludvig14, CC BY-SA 4.0, "Baku Bibi-EybatMosque 004 8797.jpg": the
 *      east front square on: the carved portal, six tall windows, the three
 *      domes; the hall's height scaled from its 48 m width (0.037 m/px)
 *      https://commons.wikimedia.org/wiki/File:Baku_Bibi-EybatMosque_004_8797.jpg
 *   p4 Faik Nagiyev, CC BY-SA 4.0, "Bibi Heybet Moscue (Baku).jpg": from
 *      the south: both minarets, the domes, the south front
 *      https://commons.wikimedia.org/wiki/File:Bibi_Heybet_Moscue_(Baku).jpg
 *   p2 Ludvig14, CC BY-SA 4.0, "Baku Bibi-EybatMosque 004 8626.JPG"
 *      https://commons.wikimedia.org/wiki/File:Baku_Bibi-EybatMosque_004_8626.JPG
 * - Look-only: none.
 *
 * Numbers (estimated from p1 and p3)
 * - The hall 14.5 m to its parapet; the stalactite cornice 12.6 to 13.8;
 *   windows 2.8 m wide, sill 0.8, 10.5 m to their points; the east portal
 *   15.5 m wide and 18.6 high (above the 14.5 m parapet), projecting 1.6 m, its niche 7 m wide and 1.6 m deep;
 *   the west front's middle
 *   bay a smaller portal, 8 m wide and 17 high.
 * - The domes 9.2 m across on drums 3.1 m high with twelve arched windows,
 *   rising 6.3 m, crowns at 24.0 and finials to 25.6; spaced 12 m along the
 *   hall from its south end (OSM places them 10.6 and 14 m apart; the
 *   photos show them evenly spaced).
 * - The minarets: square bases 5 m to the hall's top, the shaft 4 m across
 *   to 32.7, the corbel to 35.4 and 2.8 m out, the railing to 36.5, the top
 *   3 m across to 41.5, the cap to 43.5 and the finial to 44.8.
 * - Colours: the walls #e3ce97 (p3, overcast) and #e5d1bb (p1, sun): drawn
 *   #e8d3ac (warmed after review); the domes #d2be90 and #e6ceb5: drawn
 *   #dac299, a shade darker
 *   than the walls as in both photos; the glazing dark, its frames brown.
 *
 * Doubts
 * - No published heights; all from photo scaling.
 * - The domes' even spacing follows the photos, not OSM.
 * - The courtyard buildings round the mosque (way/291299391, 2 levels) are
 *   left to the map; the minarets stand at their corner.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { flat, lathe, type XY } from './sf-de-young'
import { wallPlate, pointedArch, polyTris } from './berlin-oberbaum-bridge'
import { writeModel } from './baku-maiden-tower'

const X0 = -8.53, X1 = 8.53, Y0 = -24.3, Y1 = 24.3
const H = 14.5
const DOMES: XY[] = [[-1.5, -18.0], [-1.5, -6.0], [-1.5, 6.0]]
const MINARETS: XY[] = [[6.65, -26.6], [6.9, 27.9]]

type Face = { A: XY; u: XY; n: XY; L: number }
const faceOf = (A: XY, B: XY): Face => {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  return { A, u, n: [u[1], -u[0]], L }
}
const on = (f: Face, s: number, w: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.n[0] * w, f.A[1] + f.u[1] * s + f.n[1] * w, z]
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { p.tri(a, b, c, undefined, undefined, undefined, [n, n, n]); p.tri(a, c, d, undefined, undefined, undefined, [n, n, n]) }

/** A flat polygon (s, z) on a face, `w` out from it. */
function facePoly(p: Part, f: Face, pts: XY[], w: number) {
  const n: V3 = [f.n[0], f.n[1], 0]
  for (const [a, b, c] of polyTris(pts)) p.tri(on(f, a[0], w, a[1]), on(f, b[0], w, b[1]), on(f, c[0], w, c[1]), undefined, undefined, undefined, [n, n, n])
}

/** A ribbed dome: `ribs` gores bulging out `bulge`, a slightly pointed profile, from z0 at radius r rising `rise`. */
function ribbedDome(p: Part, c: XY, z0: number, r: number, rise: number, ribs: number, rows: number, bulge: number) {
  const NA = ribs * 2
  const prof = Array.from({ length: rows + 1 }, (_, k) => {
    const a = (k / rows) * (Math.PI / 2)
    return [r * Math.cos(a) * (1 - 0.12 * Math.sin(a) ** 4), z0 + rise * Math.sin(a) + (k === rows ? rise * 0.06 : 0)] as XY
  })
  const P = (k: number, i: number): V3 => {
    const t = (i / NA) * 2 * Math.PI, crest = i % 2 === 0 ? 1 : 0
    const rr = prof[k][0] * (1 + bulge * crest * (1 - k / rows))
    return [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t), prof[k][1]]
  }
  for (let k = 0; k < rows; k++) for (let i = 0; i < NA; i++) {
    const a = P(k, i), b = P(k, i + 1), cc = P(k + 1, i + 1), d = P(k + 1, i)
    const u: V3 = [cc[0] - a[0], cc[1] - a[1], cc[2] - a[2]], v: V3 = [d[0] - b[0], d[1] - b[1], d[2] - b[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const out = (a[0] - c[0]) * n[0] + (a[1] - c[1]) * n[1] + (a[2] - z0) * n[2] * 0.01
    if (out < 0) n = [-n[0], -n[1], -n[2]]
    p.tri(a, b, cc, undefined, undefined, undefined, [n, n, n])
    if (k < rows - 1 || true) p.tri(a, cc, d, undefined, undefined, undefined, [n, n, n])
  }
  return prof[rows][1]
}

function build(detail: boolean) {
  const stone = new Part(), dome = new Part(), glass = new Part(), frame = new Part(), metal = new Part(), roof = new Part()
  const SEG = detail ? 7 : 3

  // ---- the hall: four fronts as slabs with tall pointed windows cut through ----
  const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  const T = 0.9
  const win = (s: number, w: number, sill: number, zs: number) => pointedArch(s - w / 2, s + w / 2, sill, zs, SEG, 0.72)
  const faces = [0, 1, 2, 3].map((e) => faceOf(ring[e], ring[(e + 1) % 4]))
  // the windows of each front: east (1) and west (3) long fronts, south (0) and north (2) short ones
  const layout: Record<number, number[]> = {
    1: [5.0, 9.2, 13.4, 35.2, 39.4, 43.6],
    3: [5.0, 9.2, 13.4, 17.6, 31.0, 35.2, 39.4, 43.6],
    0: [3.5, 7.3, 11.1],
    2: [5.6, 9.4, 13.2],
  }
  for (let e = 0; e < 4; e++) {
    const f = faces[e]
    const holes = layout[e].map((s) => win(s, 2.8, 0.8, 8.6))
    wallPlate(stone, [[0, 0], [f.L, 0], [f.L, H], [0, H]], holes, T, (s, w, z) => on(f, s, w - T / 2, z), [f.n[0], f.n[1], 0])
    for (const s of layout[e]) {
      // the glazing, set back in the opening, with a bold frame cross
      facePoly(glass, f, win(s, 2.8, 0.8, 8.6), -T + 0.05)
      quad(frame, on(f, s - 0.1, -T + 0.1, 0.8), on(f, s + 0.1, -T + 0.1, 0.8), on(f, s + 0.1, -T + 0.1, 9.6), on(f, s - 0.1, -T + 0.1, 9.6), [f.n[0], f.n[1], 0])
      if (detail) for (const z of [2.4, 6.2]) quad(frame, on(f, s - 1.4, -T + 0.1, z), on(f, s + 1.4, -T + 0.1, z), on(f, s + 1.4, -T + 0.1, z + 0.18), on(f, s - 1.4, -T + 0.1, z + 0.18), [f.n[0], f.n[1], 0])
    }
    // the stalactite cornice: three corbelled courses stepping out, and the parapet
    const steps = detail ? [[12.4, 12.8, 0.15], [12.8, 13.2, 0.3], [13.2, 13.8, 0.45]] : [[12.6, 13.8, 0.35]]
    for (const [z0, z1, d] of steps) {
      quad(stone, on(f, -d, d, z0), on(f, f.L + d, d, z0), on(f, f.L + d, d, z1), on(f, -d, d, z1), [f.n[0], f.n[1], 0])
      quad(stone, on(f, -d, 0, z0), on(f, f.L + d, 0, z0), on(f, f.L + d, d, z0), on(f, -d, d, z0), [0, 0, -1])
      quad(stone, on(f, -d, d, z1), on(f, f.L + d, d, z1), on(f, f.L + d, 0, z1), on(f, -d, 0, z1), [0, 0, 1])
    }
    if (detail) {
      // the stalactite niches: a row of small pointed hoods under the cornice
      const n = Math.floor(f.L / 0.9)
      for (let i = 0; i < n; i++) {
        const s = (i + 0.5) * (f.L / n)
        facePoly(stone, f, [[s - 0.3, 12.0], [s + 0.3, 12.0], [s + 0.3, 12.25], [s, 12.4], [s - 0.3, 12.25]], 0.12)
      }
    }
  }
  flat(roof, [[X0 + 0.9, Y0 + 0.9], [X1 - 0.9, Y0 + 0.9], [X1 - 0.9, Y1 - 0.9], [X0 + 0.9, Y1 - 0.9]], H - 0.6)
  // the parapet's top
  for (const f of faces) quad(stone, on(f, -0.45, 0.45, H), on(f, f.L + 0.45, 0.45, H), on(f, f.L + 0.45, -T, H), on(f, -0.45, -T, H), [0, 0, 1])
  for (const f of faces) quad(stone, on(f, -0.45, 0.45, 13.8), on(f, f.L + 0.45, 0.45, 13.8), on(f, f.L + 0.45, 0.45, H), on(f, -0.45, 0.45, H), [f.n[0], f.n[1], 0])

  // ---- the portals: the carved east portal, and a smaller one on the west ----
  for (const [e, w, top, aw, zs] of [[1, 15.5, 18.6, 7.0, 10.5], [3, 8.0, 17.0, 4.2, 9.0]] as Array<[number, number, number, number, number]>) {
    const f = faces[e], s = f.L / 2, proj = e === 1 ? 1.6 : 1.2
    const arch = pointedArch(s - aw / 2, s + aw / 2, 0.8, zs, SEG + 2, 0.72)
    wallPlate(stone, [[s - w / 2, 0], [s + w / 2, 0], [s + w / 2, top], [s - w / 2, top]], [arch], proj, (ss, ww, z) => on(f, ss, ww + proj / 2, z), [f.n[0], f.n[1], 0])
    // the niche's back: its window and door, and a hood over them
    facePoly(glass, f, pointedArch(s - aw / 2 + 0.9, s + aw / 2 - 0.9, 0.8, zs - 0.6, SEG + 1, 0.72), 0.04)
    quad(frame, on(f, s - 0.1, 0.07, 0.8), on(f, s + 0.1, 0.07, 0.8), on(f, s + 0.1, 0.07, zs + 1.5), on(f, s - 0.1, 0.07, zs + 1.5), [f.n[0], f.n[1], 0])
    if (detail) {
      // the carved frame: bands round the niche, and the outer border
      const bands: Array<[number, number]> = [[0.5, 0.15], [1.1, 0.1]]
      for (const [inset, d] of bands) {
        const outer: XY[] = [[s - w / 2 + inset, 0.8], [s + w / 2 - inset, 0.8], [s + w / 2 - inset, top - inset - 0.4], [s - w / 2 + inset, top - inset - 0.4]]
        const inner: XY[] = [[s - w / 2 + inset + 0.35, 0.8], [s + w / 2 - inset - 0.35, 0.8], [s + w / 2 - inset - 0.35, top - inset - 0.75], [s - w / 2 + inset + 0.35, top - inset - 0.75]]
        const loop = [...outer, outer[0]]
        for (let k = 1; k < 4; k++) {
          const a = outer[k - 1], b = outer[k], c = inner[k], dd = inner[k - 1]
          quad(stone, on(f, a[0], proj + d, a[1]), on(f, b[0], proj + d, b[1]), on(f, c[0], proj + d, c[1]), on(f, dd[0], proj + d, dd[1]), [f.n[0], f.n[1], 0])
        }
        void loop
      }
      // the arch's moulding: a band round the niche's head
      const ring2 = pointedArch(s - aw / 2 - 0.5, s + aw / 2 + 0.5, 0.8, zs, SEG + 2, 0.72).slice(2)
      const ring1 = pointedArch(s - aw / 2, s + aw / 2, 0.8, zs, SEG + 2, 0.72).slice(2)
      for (let k = 0; k < ring1.length - 1; k++) quad(stone, on(f, ring1[k][0], proj + 0.12, ring1[k][1]), on(f, ring1[k + 1][0], proj + 0.12, ring1[k + 1][1]), on(f, ring2[k + 1][0], proj + 0.12, ring2[k + 1][1]), on(f, ring2[k][0], proj + 0.12, ring2[k][1]), [f.n[0], f.n[1], 0])
      // stalactite tiers in the niche's head
      const rise = (aw / 2) * Math.sqrt((0.72 * 2) ** 2 - (0.72 * 2 - 1) ** 2)
      for (let k = 0; k < 3; k++) {
        const z = zs + 0.2 + k * rise * 0.24, half = aw / 2 - 0.25 - k * aw * 0.12, n = 6 - k
        for (let i = 0; i < n; i++) {
          const c = s - half + ((i + 0.5) * 2 * half) / n, hw = half / n - 0.05
          wallPlate(stone, [[c - hw, z], [c + hw, z], [c + hw, z + rise * 0.2], [c - hw, z + rise * 0.2]], [], 0.3 + k * 0.25, (ss, ww, zz) => on(f, ss, ww + (0.3 + k * 0.25) / 2, zz), [f.n[0], f.n[1], 0])
        }
      }
    }
  }

  // ---- the domes on their drums ----
  for (const c of DOMES) {
    const r = 4.6, NDr = detail ? 24 : 10
    const z0 = H - 0.6, z1 = z0 + 3.1
    // the drum: a ring of faces, each with an arched window cut in
    for (let i = 0; i < NDr; i++) {
      const a0 = (i / NDr) * 2 * Math.PI, a1 = ((i + 1) / NDr) * 2 * Math.PI
      const A: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)], B: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)]
      const f = faceOf(B, A)
      const ff = f.n[0] * Math.cos((a0 + a1) / 2) + f.n[1] * Math.sin((a0 + a1) / 2) > 0 ? f : faceOf(A, B)
      const hasWin = detail ? i % 2 === 0 : true
      const ww = detail ? 0.8 : 1.0
      const holes = hasWin ? [pointedArch(ff.L / 2 - ww / 2, ff.L / 2 + ww / 2, z0 + 0.7, z1 - 1.1, detail ? 4 : 2, 0.72)] : []
      wallPlate(stone, [[0, z0], [ff.L, z0], [ff.L, z1], [0, z1]], holes, 0.5, (s, w, z) => on(ff, s, w - 0.25, z), [ff.n[0], ff.n[1], 0])
      if (hasWin) facePoly(glass, ff, holes[0], -0.45)
    }
    // a cornice ring and the ribbed dome
    lathe(stone, [[r - 0.2, z1], [r + 0.25, z1], [r + 0.25, z1 + 0.35], [r - 0.05, z1 + 0.45]], detail ? 24 : 12, c, 0, false)
    const top = ribbedDome(dome, c, z1 + 0.45, r - 0.05, 6.3, detail ? 24 : 12, detail ? 9 : 4, detail ? 0.06 : 0.08)
    lathe(stone, [[0.22, top - 0.1], [0.22, top + 0.7], [0.32, top + 0.9], [0.05, top + 1.6], [0, top + 1.6]], 6, c, 0, false)
  }

  // ---- the minarets ----
  for (const m of MINARETS) {
    const NM = detail ? 20 : 10
    const hs = 2.5
    const sq: XY[] = [[m[0] - hs, m[1] - hs], [m[0] + hs, m[1] - hs], [m[0] + hs, m[1] + hs], [m[0] - hs, m[1] + hs]]
    // the square base, chamfered into an octagon above the hall's top
    for (let k = 0; k < 4; k++) {
      const f = faceOf(sq[k], sq[(k + 1) % 4])
      quad(stone, on(f, 0, 0, 0), on(f, f.L, 0, 0), on(f, f.L, 0, H + 0.6), on(f, 0, 0, H + 0.6), [f.n[0], f.n[1], 0])
      // a tall narrow window up each face
      quad(glass, on(f, f.L / 2 - 0.35, 0.03, 4.0), on(f, f.L / 2 + 0.35, 0.03, 4.0), on(f, f.L / 2 + 0.35, 0.03, 9.0), on(f, f.L / 2 - 0.35, 0.03, 9.0), [f.n[0], f.n[1], 0])
    }
    lathe(stone, [[hs * Math.SQRT2, H + 0.6], [2.25, H + 2.0], [2.0, H + 2.4], [2.0, 32.7], [2.12, 32.7], [2.12, 33.3], [2.0, 33.3]], 8, m, Math.PI / 4, false)
    // the stalactite corbel: tiers stepping out to the balcony
    const tiers = detail ? 4 : 2, zc0 = 33.3, zc1 = 35.4
    const prof: XY[] = []
    for (let k = 0; k < tiers; k++) {
      const z = zc0 + ((zc1 - zc0) * k) / tiers, r0 = 2.0 + (0.8 * k) / tiers, r1 = 2.0 + (0.8 * (k + 1)) / tiers
      prof.push([r0, z], [r1 - 0.05, z + (zc1 - zc0) / tiers - 0.1], [r1, z + (zc1 - zc0) / tiers])
    }
    lathe(stone, [...prof, [2.85, zc1], [2.85, zc1 + 0.25], [1.5, zc1 + 0.25]], NM, m, 0, false)
    // the railing: a top rail on posts
    lathe(metal, [[2.78, zc1 + 1.0], [2.78, zc1 + 1.15], [2.7, zc1 + 1.15]], NM, m, 0, false)
    for (let i = 0; i < (detail ? NM : 0); i += 1) {
      const a = (i / NM) * 2 * Math.PI, p: XY = [m[0] + 2.74 * Math.cos(a), m[1] + 2.74 * Math.sin(a)]
      lathe(metal, [[0.05, zc1 + 0.25], [0.05, zc1 + 1.0], [0, zc1 + 1.0]], 4, p, 0, false)
    }
    // the slimmer top with its small windows, the ribbed cap and finial
    lathe(stone, [[1.5, zc1 + 0.25], [1.5, 41.3], [1.62, 41.3], [1.62, 41.6], [1.5, 41.6]], NM, m, 0, true)
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * 2 * Math.PI + Math.PI / 4
      const A: XY = [m[0] + 1.52 * Math.cos(a) - 0.25 * Math.sin(a), m[1] + 1.52 * Math.sin(a) + 0.25 * Math.cos(a)], B: XY = [m[0] + 1.52 * Math.cos(a) + 0.25 * Math.sin(a), m[1] + 1.52 * Math.sin(a) - 0.25 * Math.cos(a)]
      const f = faceOf(A, B), ff = f.n[0] * Math.cos(a) + f.n[1] * Math.sin(a) > 0 ? f : faceOf(B, A)
      facePoly(glass, ff, pointedArch(0, 0.5, 38.0, 39.4, 2, 0.72), 0.0)
    }
    const top = ribbedDome(dome, m, 41.6, 1.5, 1.9, detail ? 16 : 8, detail ? 6 : 4, 0.05)
    lathe(stone, [[0.12, top - 0.1], [0.12, top + 0.6], [0.2, top + 0.75], [0, top + 1.3]], 6, m, 0, false)
  }
  return { stone, dome, glass, frame, metal, roof }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.9)
    return [
      { part: p.stone, material: { ...finish('bibiheybat-stone', 0xe8d3ac), floodlight: lit } },
      { part: p.dome, material: { ...finish('bibiheybat-dome', 0xdac299), floodlight: (_q: V3, n: V3) => (n[2] > 0.85 ? 0.4 : 0.8) } },
      { part: p.glass, material: PALETTE.window },
      { part: p.frame, material: { ...finish('bibiheybat-frame', 0x8a5a36) } },
      { part: p.metal, material: { ...finish('bibiheybat-railing', 0x4a4744, 0.6) } },
      { part: p.roof, material: { ...finish('bibiheybat-roof', 0xc9bba0) } },
    ]
  }
  const meta = { bearing: 12.6, osm: 'way/291299394', height: 44.8 }
  await writeModel('baku-bibi-heybat-mosque.glb', 'Bibi-Heybat Mosque', make(false), meta, 6500, 250 * 1024)
  await writeModel('baku-bibi-heybat-mosque.detail.glb', 'Bibi-Heybat Mosque', make(true), meta, 40000, 1536 * 1024)
}
