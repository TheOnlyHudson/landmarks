/**
 * Koppers Tower (Koppers Building), Pittsburgh (Graham, Anderson, Probst &
 * White, 1929) — original procedural geometry, CC0-1.0.
 * bun generators/pit-koppers-tower.ts
 *
 * Map frame turned to the building: +y along bearing 27.3 (toward Seventh
 * Avenue), +x along 117.3 (toward Grant Street), z up, metres. BEARING 27.3:
 * the OSM outline's edges run at 27.6/117.1/207.8/297.5°. Origin = centroid of
 * the OSM outline way/294826450, 40.442108, -79.995543.
 *
 * Identity, in order: the steep green copper roof — a truncated hip with a
 * narrow flat top — on the central tower; the symmetric Art Deco setbacks
 * stepping down to each side (125, 113 and 82 m); the pale limestone with
 * continuous piers and tall window strips, the top storey of each stage
 * round-headed; the U plan with a light court open to Seventh Avenue.
 *
 * Evidence
 * - OSM way/294826450 (height 145, 34 levels), wikidata Q6431177. No
 *   building:parts.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid read in this
 *   frame (SCRATCH/work/pit-koppers-tower/lidar.json), heights above the
 *   lowest ground under the footprint (the north-west corner; the site rises
 *   ≈ 4 m to the south-east): the lot 60 × 31 m; a light court x ±12,
 *   y 5..15.4 over a 24 m base; the 82 m block round it; the 113 m block
 *   x ±25, y -15.4..9.5; the tower stage x -21.5..22.5, y -15.4..4 to a
 *   ledge at 126 m; the core x -17.5..18.5, y -14.4..2.5 to ≈ 134 m; the
 *   roof rising steeply from there to a narrow flat top at 146 m.
 * - Published: 475 ft (145 m), 34 floors, Indiana limestone over granite,
 *   copper chateau roof (Wikipedia "Koppers Tower"; the Commons floor plans
 *   "Koppers Building 11th to 20th floor plan.png", public domain, confirm the
 *   U plan round a court).
 * - Photos (Wikimedia Commons): "Kopperside.jpg" (Mr. Vitale, public domain)
 *   — the long face square on: the stepped stages, round-headed top storeys,
 *   piers; "Koppers and Gulf Towers, 2015-06-20. 01.jpg" and "Gulf and Koppers
 *   Towers, 2013-11-18, 03.jpg" (Cbaile19, CC0) — the roof from the south-east
 *   and east, its slope and flat top, the colours; "Koppers Building, 7th
 *   Avenue and Grant Street, Pittsburgh, PA.jpg" and "… - 53613143574.jpg"
 *   (w_lemay, CC BY-SA 2.0) — the Grant Street corner and the Seventh Avenue
 *   portal; night: "DowntownPittsburghNightSceneGulfBuilding.jpg" (Don
 *   Burkett, CC BY-SA 2.0) — the roof and the top stage floodlit.
 *   No commercial imagery.
 *
 * Estimated: the panels, each standing for a pair of window columns (bays
 * ≈ 5.2 m) grouped three storeys a row; the arch heads
 * on the top row of each stage; the portal (6 × 12 m) from the w_lemay photo;
 * the colours from the daylight photos (limestone a little greyer than the
 * palette's stone; the roof the palette's copper). Left out: the KOPPERS
 * signs, the roof's cresting and corner finials, the small pinnacles on the
 * setbacks.
 *
 * Night: windows are `window`, the portal `entrance`; the roof and the top
 * stage carry `_FLOODLIGHT`.
 *
 * Doubts: the court face and the north wings are seen in no photo and are
 * drawn like the street faces; the roof's south slope reads 2-3 m high in
 * lidar (probably a dormer or the cresting) and is drawn even.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, panel, rect, save, walls, onWall, type XY } from './chi-aon-center'

const ID = 'pit-koppers-tower'
const ANCHOR: [number, number] = [40.442108, -79.995543]
const BEARING = 27.3

const rowsOf = (z0: number, z1: number, n: number, gap: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2])

/** A round-headed panel: jambs to `zs`, a semicircle above. */
function arched(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.04, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    p.tri(P(c, zs, out), P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** Window strips on one wall: bays about `bay` wide, three-storey rows, the last row round-headed. */
function strips(win: Part, a: XY, b: XY, z0: number, z1: number, rows: number, bay = 5.2, end = 1.5, pier = 1.5, gap = 1.8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * end + bay) return
  const k = Math.round((L - 2 * end) / bay), w = (L - 2 * end) / k
  const rs = rowsOf(z0, z1, rows, gap)
  for (let q = 0; q < k; q++) {
    const s0 = end + q * w + pier / 2, s1 = end + (q + 1) * w - pier / 2
    rs.forEach(([za, zb], i) => {
      if (i === rs.length - 1) arched(win, a, b, s0, s1, za, zb - (s1 - s0) / 2)
      else panel(win, a, b, s0, s1, za, zb)
    })
  }
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), copper = new Part(), door = new Part()
  const v = (p: XY, z: number): V3 => [p[0], p[1], z]
  const X0 = -29.9, X1 = 29.9, Y0 = -15.4, Y1 = 15.4

  // --- Base over the whole lot, 24 m; the court's floor is its roof. ---
  const lot = rect(X0, Y0, X1, Y1)
  walls(stone, lot, 0, 24)
  const court = rect(-12, 5, 12, Y1)
  cap(roof, court, 24)
  for (const [a, b] of [[lot[0], lot[1]], [lot[1], lot[2]], [lot[3], lot[0]]] as [XY, XY][]) strips(win, a, b, 3, 23, 2)
  strips(win, [X1, Y1], [12, Y1], 3, 23, 2)
  strips(win, [-12, Y1], [X0, Y1], 3, 23, 2)
  // street front of the base between the arms, with the portal
  strips(win, [12, Y1], [-12, Y1], 14, 23, 1)
  panel(door, [12, Y1], [-12, Y1], 9, 15, 0, 12, 0.05)
  panel(stone, [12, Y1], [-12, Y1], 8, 9, 0, 13, 0.25)
  panel(stone, [12, Y1], [-12, Y1], 15, 16, 0, 13, 0.25)
  panel(stone, [12, Y1], [-12, Y1], 8, 16, 12, 13, 0.25)
  for (const s of [3, 18]) panel(win, [12, Y1], [-12, Y1], s, s + 3, 3, 11)

  // --- The 82 m U round the court. ---
  const U: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [12, Y1], [12, 5], [-12, 5], [-12, Y1], [X0, Y1]]
  walls(stone, U, 24, 82)
  for (let i = 0; i < U.length; i++) strips(win, U[i], U[(i + 1) % U.length], 25, 81, 6)

  // --- The 113 m block (its court side follows the court). ---
  const B: XY[] = [[-25, Y0], [25, Y0], [25, 9.5], [12, 9.5], [12, 5], [-12, 5], [-12, 9.5], [-25, 9.5]]
  const Utop: XY[] = U
  cap(roof, Utop, 82) // the U's roof; the block above hides its middle
  walls(stone, B, 82, 113)
  for (let i = 0; i < B.length; i++) strips(win, B[i], B[(i + 1) % B.length], 83, 112, 3)

  // --- The tower stage to a ledge at 126, the core to 134, then the copper roof. ---
  const T = rect(-21.5, Y0, 22.5, 4)
  cap(roof, B, 113)
  walls(stone, T, 113, 126)
  for (let i = 0; i < 4; i++) strips(win, T[i], T[(i + 1) % 4], 114, 125.5, 1)
  const C = rect(-17.5, Y0 + 1, 18.5, 2.5)
  const ring = (r: XY[], o: XY[], z: number) => {
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      stone.quad(v(r[i], z), v(r[j], z), v(o[j], z), v(o[i], z))
    }
  }
  ring(T, C, 126)
  const Cb = block(stone, null, C, 126, 134.4, 0.4)
  for (let i = 0; i < 4; i++) strips(win, C[i], C[(i + 1) % 4], 126.8, 133.4, 1, 5.2, 1.6)
  // truncated hip, steep, from just inside the cornice to a flat top
  const e = rect(-17.1, Y0 + 1.4, 18.1, 2.1)
  ring(Cb, e, 134.4)
  const top = rect(-10, -7.4, 11, -4.1)
  walls(copper, e, 134.4, 146, top)
  cap(copper, top, 146)

  const lit = (p: V3) => (p[2] > 112 ? 0.8 : 0)
  return [
    { part: stone, material: { ...finish('koppers-limestone', 0xd8c8b2), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: { ...PALETTE.copper, floodlight: () => 0.8 } },
    { part: door, material: { ...PALETTE.entrance, color: 0x6c7a80 } },
  ]
}

if (import.meta.main) await save(ID, 'Koppers Tower', ANCHOR, BEARING, build(), 5000)
