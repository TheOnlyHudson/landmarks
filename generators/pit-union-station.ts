/**
 * Pittsburgh Union Station (Pennsylvania Station, now The Pennsylvanian),
 * 1898-1903, D. H. Burnham & Co., Liberty Avenue and Grant Street —
 * original procedural geometry, CC0-1.0.
 * bun generators/pit-union-station.ts
 *
 * Frame: x, y, z up, metres; origin at the anchor on the lowest ground
 * under the footprint (the busway cutting on the west side, ~1 m above
 * lidar ground_min 224.75 m NAVD88). The street on the east and in front
 * (Grant Street / the drive) is 4.5 m higher; facade detail starts there.
 * Anchor = area centroid of the office block's OSM outline (relation
 * 10505870, outer way/664644571), -79.9920286 40.4443245. Bearing 51: the
 * block's long axis; model -y faces SW to the rotunda and the drive, +y
 * NE to the old station building and the tracks.
 *
 * Identity, in order: the domed rotunda carriage porch at the front — a
 * square of four corner pavilions with three great flattened arches
 * between them under curved parapets, and a low dome in the middle; the
 * tall 12-storey tawny brick and terracotta block behind it, five bays on
 * its narrow front, with its row of round-headed windows under a two-
 * storey attic and a heavy cornice; string courses dividing base, shaft
 * and top; the light court in the middle of the block.
 *
 * Evidence:
 *  - plan: OSM relation/10505870 (The Pennsylvanian Apartments: outer
 *    way/664644571 41.8 x 69 m, inner court way/759337132 20 x 47 m);
 *    way/664644572 (building=roof, the rotunda, 40 x 37 m);
 *    way/664644570 (the old station building behind, to the NE).
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, in this frame: tower roof 65.6, parapet 66.3, a machine
 *    room to 74; court floor 20.5; rotunda corner pavilions 16.5, arch
 *    crowns 16.2, the vault roofs ~13.5-14, dome rising from ~17 to 21;
 *    station building behind 12.9, its middle to 15.6.
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    p2 "Union Station, Pittsburgh, 2024-05-28-3.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Station,_Pittsburgh,_2024-05-28-3.jpg
 *      Cbaile19, CC0 — head-on from the drive: the rotunda's front arch,
 *      corner pavilions, the five-bay front, the attic and cornice.
 *    p3 "Union Station, Pittsburgh, 2024-05-28.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Station,_Pittsburgh,_2024-05-28.jpg
 *      Cbaile19, CC0 — from the south: rotunda side arches, long side.
 *    p4 "Union Station, Pittsburgh, 2024-05-28-4.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Station,_Pittsburgh,_2024-05-28-4.jpg
 *      Cbaile19, CC0 — the front with the drive.
 *    p5 "Union Station, Pittsburgh, 2024-05-28-1.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Station,_Pittsburgh,_2024-05-28-1.jpg
 *      Cbaile19, CC0 — the rotunda from the side.
 *    p1 "Pittsburgh Union Station Wide 2900px.jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh_Union_Station_Wide_2900px.jpg
 *      Derek Ramsey, CC BY-SA 2.5 — the rotunda close up from the corner.
 *    p7 "Union Station, Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Station,_Pittsburgh.jpg
 *      pedrik, CC BY 2.0 — from above (the hill): the block, court, rotunda.
 *    USGS NAIP (public domain): plan, the green dome, the dark court.
 *  - published: 1903, D. H. Burnham & Co.; rotunda carriage porch; 12
 *    storeys (Wikipedia, "Pennsylvanian (building)"; OSM building:levels).
 *  - colour: tawny buff brick and terracotta from the daylight photos,
 *    lightened to the palette; dome copper-green (NAIP, photo p2).
 * Estimated: the rotunda arches' span (19 m front, 16 m sides) and rise
 *   (springing 5.7, crown 12.5: a flattened, basket arch as photographed),
 *   the pavilions' small arches, the curved parapets, the storey groups
 *   and string course heights (from photo p2 scaled to the lidar roof),
 *   the bay counts on the long sides (9).
 * Doubts: the long sides' bays are counted from oblique photos only. OSM
 *   way/320912260 (named Pittsburgh Union Station) is the Amtrak platform
 *   shed to the north-east, not this building; it is not modelled and not
 *   replaced.
 * Left out: carving, cartouches beyond the parapet blocks, the clock, the
 *   lamp posts, railings, the busway ramps.
 *
 * Night: the windows glow; the rotunda's arches glow (`entrance`: its
 * vaults are lit by rings of bulbs).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow } from './pit-allegheny-county-courthouse'

const ST = 4.5 // street level on the front and east
type R4 = [number, number, number, number]

/** A wall face a→b (outward to the right) with a flattened arch opening and a recess. */
function archScreen(wall: Part, trim: Part, dark: Part, a: XY, b: XY, open0: number, open1: number, zs: number, rise: number, top: (t: number) => number, depth: number, n = 12) {
  const { L, P } = onWall(a, b)
  const c = (open0 + open1) / 2, hw = (open1 - open0) / 2
  const za = (s: number) => (Math.abs(s - c) >= hw ? zs : zs + rise * Math.sqrt(1 - ((s - c) / hw) ** 2))
  const ss: number[] = [0, open0]
  for (let i = 1; i < n; i++) ss.push(open0 + ((open1 - open0) * i) / n)
  ss.push(open1, L)
  for (let i = 0; i < ss.length - 1; i++) {
    const s0 = ss[i], s1 = ss[i + 1], inside = s0 >= open0 - 1e-6 && s1 <= open1 + 1e-6
    const b0 = inside ? za(s0) : 0, b1 = inside ? za(s1) : 0
    wall.quad(P(s0, b0), P(s1, b1), P(s1, top(s1 / L)), P(s0, top(s0 / L)))
    if (inside) {
      // soffit, facing down into the opening, and the dark recess behind
      trim.quad(P(s1, b1), P(s0, b0), P(s0, b0, -depth), P(s1, b1, -depth))
      dark.quad(P(s0, 0, -depth), P(s1, 0, -depth), P(s1, b1, -depth), P(s0, b0, -depth))
    }
  }
  // jambs
  trim.quad(P(open0, 0), P(open0, 0, -depth), P(open0, zs, -depth), P(open0, zs))
  trim.quad(P(open1, 0, -depth), P(open1, 0), P(open1, zs), P(open1, zs, -depth))
  // the archivolt: a bold band round the opening
  for (let i = 0; i < n; i++) {
    const s0 = open0 + ((open1 - open0) * i) / n, s1 = open0 + ((open1 - open0) * (i + 1)) / n
    trim.quad(P(s0, za(s0), 0.12), P(s1, za(s1), 0.12), P(s1, za(s1) + 1.1, 0.12), P(s0, za(s0) + 1.1, 0.12))
  }
}

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dome = new Part(), dark = new Part()

  // ---- the office block
  const T: R4 = [-22, -35, 20, 34]
  const COURT: R4 = [-11, -24, 9, 23.5]
  const CORN = 61.5, ROOF = 65.6, PAR = 66.3
  walls(brick, rect(...T), 0, CORN)
  band(trim, rect(...T), grow(T, 1.3), CORN, CORN + 1.4, 0.5) // the cornice
  walls(brick, rect(...T), CORN + 1.4, PAR)
  // parapet coping and the roof inside it, around the court
  const tIn = grow(T, -0.6) as XY[]
  const tOut = rect(...T)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; trim.quad([tOut[i][0], tOut[i][1], PAR], [tOut[j][0], tOut[j][1], PAR], [tIn[j][0], tIn[j][1], PAR], [tIn[i][0], tIn[i][1], PAR]) }
  walls(brick, [...tIn].reverse(), ROOF, PAR)
  {
    const o = tIn, c = rect(...COURT)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; roof.quad([o[i][0], o[i][1], ROOF], [o[j][0], o[j][1], ROOF], [c[j][0], c[j][1], ROOF], [c[i][0], c[i][1], ROOF]) }
    walls(brick, [...c].reverse(), 20.5, ROOF)
    cap(roof, c, 20.5)
    // court windows, broad and grouped
    for (let i = 0; i < 4; i++) {
      const a = c[(i + 1) % 4], b = c[i]
      const { L } = onWall(a, b)
      const k = Math.max(2, Math.round(L / 6.5)), w = (L - 2) / k
      for (let q = 0; q < k; q++) for (const [z0, z1] of [[23, 33], [35.5, 45.5], [48, 58]]) panel(win, a, b, 1 + q * w + 0.6, 1 + (q + 1) * w - 0.6, z0, z1)
    }
  }
  // the machine room on the roof (lidar 74)
  walls(brick, rect(-19.5, -23, -13, -13), ROOF, 73.5); cap(roof, rect(-19.5, -23, -13, -13), 73.5)
  // corner blocks on the parapet
  for (const [x, y] of rect(...T)) {
    const r = rect(x - 1.0, y - 1.0, x + 1.0, y + 1.0)
    walls(trim, r, PAR, PAR + 2.0); cap(trim, r, PAR + 2.0)
  }
  // string courses
  for (const [z0, z1] of [[15.6, 16.6], [43.6, 44.5], [50.4, 51.1]]) band(trim, rect(...T), grow(T, 0.35), z0, z1, 0.15)
  // corner quoin piers
  for (const [x, y] of rect(...T)) {
    const sx = x < 0 ? 1 : -1, sy = y < 0 ? 1 : -1
    const r: R4 = [Math.min(x - 0.3 * sx, x + 2.6 * sx), Math.min(y - 0.3 * sy, y + 2.6 * sy), Math.max(x - 0.3 * sx, x + 2.6 * sx), Math.max(y - 0.3 * sy, y + 2.6 * sy)]
    walls(brick, rect(...r), 0, CORN)
  }

  // windows: five bays on the narrow faces, nine on the long ones
  const faces: [XY, XY, number, number][] = [
    [[T[0], T[1]], [T[2], T[1]], 5, 17.5], // front, above the rotunda
    [[T[2], T[1]], [T[2], T[3]], 9, ST + 1.8], // east (Grant Street)
    [[T[2], T[3]], [T[0], T[3]], 5, 16.6], // back, above the station building
    [[T[0], T[3]], [T[0], T[1]], 9, ST + 1.8], // west
  ]
  for (const [a, b, n, zb] of faces) {
    const { L } = onWall(a, b)
    const corner = 3.0, pier = n === 5 ? 2.4 : 2.2
    const bw = (L - 2 * corner - (n - 1) * pier) / n
    for (let q = 0; q < n; q++) {
      const s0 = corner + q * (bw + pier) + 0.3, s1 = s0 + bw - 0.6
      const rows: [number, number][] = [[18.2, 25.6], [27.2, 34.6], [36.2, 42.8], [51.8, 59.6]]
      if (zb < 15) rows.unshift([zb, 14.4])
      for (const [z0, z1] of rows) if (z0 >= zb - 0.01) panel(win, a, b, s0, s1, z0, z1)
      arch(win, a, b, s0, s1, 45.2, 49.6 - (s1 - s0) / 2, 0.05, 8)
    }
  }

  // ---- the station building behind (way/664644570)
  {
    const S: R4 = [-27.7, 34, 20.3, 66]
    walls(brick, rect(...S), 0, 12.9); cap(roof, rect(...S), 12.9)
    band(trim, rect(...S), grow(S, 0.4), 12.3, 13.3, 0.2)
    const M: R4 = [-18, 39, 18, 48]
    walls(brick, rect(...M), 12.9, 15.6); cap(roof, rect(...M), 15.6)
    for (const [a, b] of [[[S[2], S[1]], [S[2], S[3]]], [[S[2], S[3]], [S[0], S[3]]]] as [XY, XY][]) {
      const { L } = onWall(a, b)
      const k = Math.round(L / 6), w = (L - 2) / k
      for (let q = 0; q < k; q++) arch(win, a, b, 1 + q * w + 0.8, 1 + (q + 1) * w - 0.8, ST + 1.5, 9.5, 0.05, 6)
    }
  }

  // ---- the rotunda carriage porch
  const RX0 = -21, RX1 = 19, RY0 = -72, RY1 = -35, PV = 9, PH = 16.5, VAULT = 14.0
  const cx = (RX0 + RX1) / 2, cy = -53.5
  // corner pavilions with small arches and a cornice
  const pav: R4[] = [[RX0, RY0, RX0 + PV, RY0 + PV], [RX1 - PV, RY0, RX1, RY0 + PV], [RX1 - PV, RY1 - PV + 0, RX1, RY1], [RX0, RY1 - PV, RX0 + PV, RY1]]
  for (const r of pav) {
    walls(brick, rect(...r), 0, PH)
    band(trim, rect(...r), grow(r, 0.5), 12.4, 13.2, 0.2)
    cap(roof, rect(...r), PH)
    band(trim, rect(...r), grow(r, 0.3), PH - 0.5, PH, 0.15)
    // an urn-like block on top
    const m: XY = [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2]
    walls(trim, rect(m[0] - 1.1, m[1] - 1.1, m[0] + 1.1, m[1] + 1.1), PH, PH + 1.6); cap(trim, rect(m[0] - 1.1, m[1] - 1.1, m[0] + 1.1, m[1] + 1.1), PH + 1.6)
    // small round arches on the outer faces that face the street
    const q = rect(...r)
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4]
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
      const outer = (Math.abs(mx - RX0) < 0.1 || Math.abs(mx - RX1) < 0.1 || Math.abs(my - RY0) < 0.1)
      if (!outer) continue
      arch(dark, a, b, 2.4, 6.6, 0, ST + 3.6, 0.06, 8)
    }
  }
  // the arch bays: front, west, east; the back bay against the tower is plain
  const crown = (t: number) => 12.7 + 3.5 * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2))
  const bays: [R4, XY, XY][] = [
    [[RX0 + PV, RY0, RX1 - PV, RY0 + PV], [RX0 + PV, RY0], [RX1 - PV, RY0]],
    [[RX0, RY0 + PV, RX0 + PV, RY1 - PV], [RX0, RY1 - PV], [RX0, RY0 + PV]],
    [[RX1 - PV, RY0 + PV, RX1, RY1 - PV], [RX1, RY0 + PV], [RX1, RY1 - PV]],
  ]
  for (const [r, a, b] of bays) {
    const { L, P, n } = onWall(a, b)
    archScreen(brick, trim, dark, a, b, 1.5, L - 1.5, ST + 1.2, 6.8, crown, 2.6)
    // the parapet's back above the vault, and the vault roof
    for (let i = 0; i < 12; i++) {
      const s0 = (L * i) / 12, s1 = (L * (i + 1)) / 12
      brick.quad(P(s1, VAULT, -0.8), P(s0, VAULT, -0.8), P(s0, crown(s0 / L), -0.8), P(s1, crown(s1 / L), -0.8))
      trim.quad(P(s0, crown(s0 / L)), P(s1, crown(s1 / L)), P(s1, crown(s1 / L), -0.8), P(s0, crown(s0 / L), -0.8))
    }
    void n
    cap(roof, rect(...r), VAULT)
  }
  {
    const back: R4 = [RX0 + PV, RY1 - PV, RX1 - PV, RY1]
    cap(roof, rect(...back), VAULT)
  }
  // the central square under the dome
  {
    const C: R4 = [RX0 + PV, RY0 + PV, RX1 - PV, RY1 - PV]
    cap(roof, rect(...C), VAULT)
    // a drum and the low dome (lidar 17 -> 21)
    lathe(trim, cx, cy, [[9.0, VAULT], [9.0, 16.2], [8.4, 16.2]], 16)
    lathe(dome, cx, cy, [[8.4, 16.2], [7.2, 17.6], [5.4, 19.0], [3.2, 20.3], [0.01, 21.0]], 16)
  }

  const lit = (p: V3, nn: V3) => (nn[2] > 0.6 ? 0.05 : p[2] < 20 && p[1] < -34 ? 0.6 : 0.3)
  return [
    { part: brick, material: { ...finish('buff-brick', 0xd8ab8b), floodlight: lit } },
    { part: trim, material: { ...finish('terracotta-trim', 0xe9cbab), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dome, material: PALETTE.patina },
    { part: dark, material: finish('entrance', 0x6e5c50) },
  ]
}

if (import.meta.main) await save('pit-union-station', 'Pittsburgh Union Station', [40.4443245, -79.9920286], 51, build() as any, 6500)
