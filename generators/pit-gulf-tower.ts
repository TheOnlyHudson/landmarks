/**
 * Gulf Tower, Pittsburgh (Trowbridge & Livingston, 1932)
 * — original procedural geometry, CC0-1.0.
 * bun generators/pit-gulf-tower.ts
 *
 * Map frame turned to the building: +y along bearing 27.1 (along Grant
 * Street), +x along 117.1, z up, metres. BEARING 27.1: the OSM outline's edges
 * run at 27.1/116.3/206.9/296.0°. Origin = centroid of the OSM outline
 * way/276176765, 40.442601, -79.995213. Grant Street is the +x face, Seventh
 * Avenue the -y face.
 *
 * Identity, in order: the stepped pyramid crown (modelled on the Mausoleum of
 * Halicarnassus) — a set-back block over the shaft's terrace, seven even
 * steps, a square lantern and a ball finial; the pale granite shaft with
 * strong continuous piers; the lit weather beacon on the steps at night; the
 * broad lower base.
 *
 * Evidence
 * - OSM way/276176765 (height 177.5, 44 levels; the whole lot), part
 *   way/665326393 (the tower, no tags), wikidata Q5617541.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid read in this
 *   frame (SCRATCH/work/pit-gulf-tower/lidar.json), read cell by cell along
 *   both axes. Heights above the lowest ground under the footprint (the site
 *   falls ≈ 3 m to the north-west): base 33 m over most of the lot, its west
 *   and east ends 25 m; the shaft 35 m square to a ledge at 44 m, then 34 m
 *   square (OSM's part reads 43 × 30; lidar followed) to a 1 m terrace at
 *   126.5 m; a block (half-width 16) to 145 m; steps at half-widths 14.5
 *   (drawn 13.6 so it nests inside the block's stepped corners),
 *   12.5, 10.2, 8.6, 7, 5.5, 4 m with tops at 151, 155, 158, 162, 165, 168,
 *   171 m; the lantern ≈ 5 m square; the ball's top 179 m (published 177.5;
 *   the model follows lidar).
 * - Published: 582 ft (177.5 m), 44 floors, granite, the pyramid crown after
 *   the Mausoleum at Halicarnassus, its neon a weather beacon since 1956
 *   (Wikipedia "Gulf Tower"). The model's ball top is at 178 m.
 * - Photos (Wikimedia Commons):
 *   "Pittsburgh-gulf-tower-2007.jpg" (Derek Jensen (Tysto), public domain) —
 *   from above: the set-back block of four storeys over the terrace, the
 *   steps, the lantern and ball, the piers;
 *   "Top of the Gulf Tower, 2023-06-10, 01.jpg" (Cbaile19, CC0) — the crown
 *   face on: terrace railing, step count, the lantern's window and the ball;
 *   "Gulf Tower from Frank Curto Park.jpg" (Cbaile19, CC0) and
 *   "Koppers and Gulf Towers, 2015-06-20. 01.jpg" (Cbaile19, CC0) — whole
 *   tower from the east and south-east, proportions, pier rhythm;
 *   "Gulf and Koppers Buildings from Spring Hill, 2026-06-23.jpg" (Cbaile19,
 *   CC0) — from the north; "GulfBuildingPittsburgh.jpg" (Dr EG, CC BY 2.0) —
 *   the Seventh Avenue portal;
 *   "DowntownPittsburghNightSceneGulfBuilding.jpg" (Don Burkett, CC BY-SA 2.0)
 *   — at night: the lower steps lit in coloured neon, the crown floodlit.
 *   No commercial imagery.
 *
 * Review round 2 (photos p3, p4, p5): the shaft's corners step back twice
 * (at ≈ 105 and 119.5 m, 2.2 then 3.2 m notches) and the block over the
 * terrace steps in at 137 m, all with the inner corners on one line, so the
 * taper starts at the shaft's corner shoulders as in the photos; each lidar
 * step is drawn as two shallow courses (14 in all; photo p3 shows two to
 * three courses a step). Corner-setback heights are estimated from storey
 * counts in p3 and p5; lidar (1 m) can't resolve them.
 * Estimated: the panels, each standing for a pair of window columns (bays
 * ≈ 5.6 m, five to a face) grouped three storeys a row;
 * the corner notches (1.2 m); the lantern's proportions and the ball (from
 * the 2023 photo); the portal's
 * size (8 × 14 m) from the 2007 street photo; the granite colour from the
 * daylight photos. Left out: the step ornaments, the terrace railing.
 *
 * Night: windows are `window`; the risers of the three lowest pyramid steps
 * (six courses) are `neon-gulf-beacon` — the night photo shows exactly these
 * lit (violet, teal, violet), the lantern and upper steps only floodlit. By
 * day the neon tubes are invisible against the stone, so its colour is the
 * granite with a faint cool cast (review round 2: a violet day colour read as
 * a stripe); the crown granite carries `_FLOODLIGHT`; the portal glass is
 * `entrance`.
 *
 * Doubts: the base's north and west faces are seen in no photo, drawn like
 * the others; the beacon colour by day is a soft violet, so it glows violet at night (the
 * real neon changes colour with the forecast; the night photo shows violet
 * and teal).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, panel, rect, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-gulf-tower'
const ANCHOR: [number, number] = [40.442601, -79.995213]
const BEARING = 27.1

const CX = -0.25, CY = -2 // tower centre from lidar
const box = (hx: number, hy: number): XY[] => rect(CX - hx, CY - hy, CX + hx, CY + hy)
/** A square ring with each corner notched n × n (the shaft's re-entrant corners). */
const notched = (h: number, n: number): XY[] => {
  const q: XY[] = [[h, -h + n], [h, h - n], [h - n, h - n], [h - n, h], [-h + n, h], [-h + n, h - n], [-h, h - n], [-h, -h + n], [-h + n, -h + n], [-h + n, -h], [h - n, -h], [h - n, -h + n]]
  return q.map(([x, y]) => [x + CX, y + CY] as XY)
}

/** Panels on every edge of a ring: bays of about `bay` m, grouped in rows. */
function facade(win: Part, r: XY[], rows: [number, number][], bay = 3.6, pier = 1.1, end = 1.6) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * end + bay * 0.8) continue
    const k = Math.max(1, Math.round((L - 2 * end) / bay)), w = (L - 2 * end) / k
    for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(win, a, b, end + q * w + pier / 2, end + (q + 1) * w - pier / 2, z0, z1)
  }
}
const rowsOf = (z0: number, z1: number, n: number, gap: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2])

/** The flat ring between two concentric rings at height z, facing up. */
function tread(p: Part, o: XY[], n: XY[], z: number) {
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    p.quad([o[i][0], o[i][1], z], [o[j][0], o[j][1], z], [n[j][0], n[j][1], z], [n[i][0], n[i][1], z])
  }
}

function build() {
  const granite = new Part(), win = new Part(), roof = new Part(), neon = new Part(), door = new Part()

  // --- Base: 33 m over the lot between the lower 25 m ends. ---
  const low = rect(-30.2, -23.3, 30.1, 22.8)
  const mid = rect(-20.5, -23.3, 22.5, 22.8)
  block(granite, roof, low, 0, 25, 0.4)
  block(granite, roof, mid, 25, 33, 0.4)
  facade(win, low, rowsOf(4, 24, 3, 2.6), 3.6, 1.6)
  facade(win, [mid[0], mid[1]], rowsOf(25, 32, 1, 1.6), 3.6, 1.6)
  facade(win, [mid[2], mid[3]], rowsOf(25, 32, 1, 1.6), 3.6, 1.6)

  // Seventh Avenue portal on the -y face: a tall frame round the glass
  {
    const a = low[0], b = low[1], s = CX - a[0]
    panel(door, a, b, s - 4, s + 4, 0, 14, 0.05)
    panel(granite, a, b, s - 5.2, s - 4, 0, 15.2, 0.25)
    panel(granite, a, b, s + 4, s + 5.2, 0, 15.2, 0.25)
    panel(granite, a, b, s - 5.2, s + 5.2, 14, 15.2, 0.25)
  }

  // --- Shaft: 35 m to a ledge at 44, then 34 m with notched corners to the
  // terrace at 126.5, then the set-back block to 145. ---
  const lower = notched(17.6, 1.4), shaft = notched(17, 1.2)
  // The upper shaft's corners step back twice before the terrace (photos p3,
  // p4, p5: the corner shoulders), and the four-storey block over the terrace
  // has deep stepped corners, so the taper reads from ≈ 105 m up.
  const sh1 = notched(17, 2.2), sh2 = notched(17, 3.2)
  const block1 = notched(16, 2.2), block2 = notched(15, 1.2) // inner corners all at 13.8: each ring nests in the one below
  walls(granite, lower, 33, 44)
  tread(granite, lower, shaft, 44)
  walls(granite, shaft, 44, 105)
  tread(granite, shaft, sh1, 105)
  walls(granite, sh1, 105, 119.5)
  tread(granite, sh1, sh2, 119.5)
  walls(granite, sh2, 119.5, 126.5)
  tread(roof, sh2, block1, 126.5)
  walls(granite, block1, 126.5, 137)
  tread(granite, block1, block2, 137)
  walls(granite, block2, 137, 145.5)
  facade(win, lower, rowsOf(34, 43, 1, 2.2), 5.6, 2.6, 1.5)
  facade(win, shaft, rowsOf(44.5, 104.5, 5, 1.8), 5.6, 2.6, 1.2)
  facade(win, sh1, rowsOf(105.6, 125.8, 1, 1.4).flatMap(([a, b]) => [[a, (a + b) / 2 - 0.7], [(a + b) / 2 + 0.7, b]] as [number, number][]), 5.6, 2.6, 1.0)
  facade(win, block1, rowsOf(128, 136.5, 1, 1.2), 5.6, 2.6, 0.8)
  facade(win, block2, rowsOf(137.8, 145, 1, 1.2), 5.6, 2.6, 0.8)

  // --- The steps (lidar half-widths and tops), the lantern, the ball. ---
  // Each lidar step (half-widths 14.5 … 4 m, tops 151 … 171 m) is drawn as
  // two shallow courses, as the photos show them (p3: two to three courses a
  // step), so the pyramid rises in many small steps.
  const steps: [number, number][] = [[13.6, 151], [12.3, 155], [10.2, 158], [8.6, 162], [7, 165], [5.5, 168], [4, 171]]
  let prev = block2, z = 145.5, ph = 13.8
  steps.forEach(([h, top], s) => {
    const zm = (z + top) / 2, hm = (ph + h) / 2
    // the beacon neon: the risers of the three lowest steps (night photo p7)
    const m = s <= 2 ? neon : granite
    const r1 = box(hm, hm), r2 = box(h, h)
    if (s === 0) cap(granite, block2, z); else tread(granite, prev, r1, z)
    walls(m, r1, z, zm)
    tread(granite, r1, r2, zm)
    walls(m, r2, zm, top)
    prev = r2; z = top; ph = h
  })
  const lan = box(2.5, 2.5)
  tread(granite, prev, lan, z)
  walls(granite, lan, z, 176.4)
  for (let i = 0; i < 4; i++) panel(win, lan[i], lan[(i + 1) % 4], 1.4, 3.6, z + 1.2, 175.4, 0.04)
  const capr = box(2.9, 2.9)
  walls(granite, capr, 176.4, 177)
  cap(granite, capr, 177)
  tread(granite, lan, capr, 176.4) // soffit under the cap, facing down
  // ball finial, 2.2 m across, top at 179 (lidar)
  const seg = 10, rB = 1.1, zc = 177.9
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
    const ring = (lat: number, a: number): V3 => [CX + rB * Math.cos(lat) * Math.cos(a), CY + rB * Math.cos(lat) * Math.sin(a), zc + rB * Math.sin(lat)]
    const lats = [-Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2]
    for (let l = 0; l < lats.length - 1; l++) {
      const A = ring(lats[l], a0), B = ring(lats[l], a1), C = ring(lats[l + 1], a1), D = ring(lats[l + 1], a0)
      if (l > 0) granite.tri(A, B, C)
      if (l < lats.length - 2) granite.tri(A, C, D)
    }
  }

  const lit = (p: V3) => (p[2] > 126 ? 0.85 : 0)
  return [
    { part: granite, material: { ...finish('gulf-granite', 0xe2d9c9), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: { ...PALETTE.roof, color: 0xb9b5ac } },
    { part: neon, material: finish('neon-gulf-beacon', 0xdcd5d8, 0.6) },
    { part: door, material: { ...PALETTE.entrance, color: 0x6e7f73 } },
  ]
}

if (import.meta.main) await save(ID, 'Gulf Tower', ANCHOR, BEARING, build(), 5000)
