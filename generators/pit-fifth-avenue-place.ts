/**
 * Fifth Avenue Place (Highmark Place), Pittsburgh (Stubbins Associates, 1988)
 * — original procedural geometry, CC0-1.0.
 * bun generators/pit-fifth-avenue-place.ts
 *
 * Map frame turned to the building: +y along bearing 341.5 (toward Liberty
 * Avenue), +x along 71.5, z up, metres. BEARING 341.5: the OSM edges run at
 * 71.6/161.3/251.5/341.3°. Origin = centroid of the OSM outline way/648621433
 * (tower and podium), 40.442012, -80.003390. The tower stands off-centre in
 * it, centred at (-9.1, -13.3), the podium wrapping its north and east sides.
 *
 * Identity, in order: the pale pink granite tower with punched windows; the
 * tall recessed blue-glass slot up the middle of every face, narrowing at the
 * setback into the slot between four corner pavilions; the crown — a square
 * granite block with a steep pyramid split into quarters by a cross-shaped
 * slot — and the white mast rising out of the split; the low podium.
 *
 * Evidence
 * - OSM relation/4436575 (Highmark Place), outline way/648621433 (31 levels,
 *   height 188), tower part way/648621434 (height 188), mast part
 *   way/319359371 (min_height 152, height 206 — the 206 looks wrong: lidar
 *   and the published height put the mast tip at 188). wikidata Q3050814.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 0.5 m grid read in this
 *   frame (SCRATCH/work/pit-fifth-avenue-place/lidar.json). Ground is flat
 *   (within 1 m); heights above the lowest ground: podium 14.5 m; lower block
 *   47.5 × 47.5 m to 92.5 m with its corners stepped back at 84 m; upper block
 *   43 m square to 127.5 m, each face slotted 8.5 m wide and 4.5 m deep down
 *   to a sloped glass roof at ~93-100 m; crown block 30 m square, walls to
 *   ~140 m, pyramid apex 163.5 m, its cross slot ~2.5 m wide down to ~141 m;
 *   mast tip 188.3 m.
 * - Published: 616 ft (188 m) to the mast, 31 floors (Wikipedia "Fifth
 *   Avenue Place (Pittsburgh)").
 * - Photos (Wikimedia Commons): "Fifth Avenue Place, 2021-07-03.jpg" and
 *   "Fifth Avenue Place from Liberty Avenue at Commonwealth Place.jpg"
 *   (Cbaile19, CC0) — one face square on: slot widths (37% of the lower face,
 *   24% of the upper), window bays ~2.5 m, the crown; "Highmark Insurance
 *   Headquarters.jpg" (Nyttend, public domain) — the corner view, the split
 *   pyramid; "Fifth-Avenue-Place.jpg" (MartinThoma, CC0) — from Fifth Avenue;
 *   "Top of Fifth Avenue Place, 2023-09-20, 01.jpg" (Cbaile19, CC0) — the
 *   crown and mast lit at night. USGS NAIP for the plan. No commercial imagery.
 *
 * Estimated: the lower slot's recess (1.5 m) and its foot (12 m) and head
 * (77 m, from the photo); windows drawn as panels two storeys tall and two 2.5 m bays wide;
 * granite colour pulled from the daylight photos; the mast's thickness
 * (2 m, a little bold). Left out: the HIGHMARK signs, the podium's entrances and glazed
 * canopy, the slot mullions.
 *
 * Night: the crown and mast are lit (blue in reality); they carry
 * `_FLOODLIGHT` on the granite above 127 m and on the mast. Office windows
 * are `window`, the slot glass `window-2`.
 *
 * Doubts: the podium's height is lidar's, its facade invented plain (granite
 * with a glazed shopfront band). The crown pyramid's slope is fitted to the
 * lidar apex and edge, not measured on a drawing.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, rows, save, walls, type XY } from './chi-aon-center'
import { octagon, rotXY } from './pit-ppg-place'

const ID = 'pit-fifth-avenue-place'
const ANCHOR: [number, number] = [40.442012, -80.00339]
const BEARING = 341.5

function build() {
  const granite = new Part(), win = new Part(), slot = new Part(), roof = new Part(), mast = new Part()
  const C: XY = [-9.1, -13.3]
  const at = (p: XY): XY => [p[0] + C[0], p[1] + C[1]]
  const v = (p: XY, z: number): V3 => [p[0], p[1], z]

  // --- Podium: the OSM outline, 14.5 m. ---
  const podium: XY[] = ([[-24.6, 33.9], [-5.7, 33.8], [34.4, 33.8], [34.7, -31.2], [16.2, -31.2], [16.2, -36.1], [-33.4, -36.1], [-33.6, 14.8], [-24.6, 14.8]] as XY[]).reverse()
  walls(granite, podium, 0, 14.5)
  cap(roof, podium, 14.5)
  for (let i = 0; i < podium.length; i++) {
    const a = podium[i], b = podium[(i + 1) % podium.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 6) panel(win, a, b, 1.5, L - 1.5, 3.5, 10.5)
  }

  /** The ring of one face turned k × 90°, from the +y face's points (going -x). */
  const ringOf = (face: XY[]): XY[] => [0, 1, 2, 3].flatMap(k => face.map(p => at(rotXY(p, k * 90))))

  // --- Lower block: 47.5 m square, slotted 12-77 m, corners stepped at 84. ---
  const H = 23.75, SW = 8.5, SD = 1.5
  const sq = ringOf([[H, H]])
  const slotted = ringOf([[H, H], [SW, H], [SW, H - SD], [-SW, H - SD], [-SW, H]])
  const notched = ringOf([[H, H - 2.5], [H - 2.5, H - 2.5], [H - 2.5, H]])
  walls(granite, sq, 0, 12)
  walls(granite, slotted, 12, 77)
  walls(granite, sq, 77, 84)
  walls(granite, notched, 84, 92.5)
  cap(roof, notched, 92.5)
  for (let k = 0; k < 4; k++) {
    const R = (p: XY) => at(rotXY(p, k * 90))
    // slot soffit and sill
    const s = [R([SW, H]), R([SW, H - SD]), R([-SW, H - SD]), R([-SW, H])]
    granite.quad(v(s[0], 12), v(s[3], 12), v(s[2], 12), v(s[1], 12))
    granite.quad(v(s[0], 77), v(s[1], 77), v(s[2], 77), v(s[3], 77))
    // slot glass on its back wall, with a pale transom every three floors
    panel(slot, R([SW, H - SD]), R([-SW, H - SD]), 0, 2 * SW, 12, 77, 0.05)
    // corner step ledges
    const c = [R([H - 2.5, H - 2.5]), R([H, H - 2.5]), R([H, H]), R([H - 2.5, H])]
    granite.quad(v(c[0], 84), v(c[1], 84), v(c[2], 84), v(c[3], 84))
    // punched windows, two storeys a panel, on the flanks
    const a = R([H, H]), b = R([-H, H])
    for (const [z0, z1] of rows(14.5, 84, 8, 2.0)) {
      for (const [s0, s1] of [[1.2, H - SW - 0.6], [H + SW + 0.6, 2 * H - 1.2]]) {
        const n = Math.round((s1 - s0) / 5), w = (s1 - s0) / n
        for (let j = 0; j < n; j++) panel(win, a, b, s0 + j * w + 0.5, s0 + (j + 1) * w - 0.5, z0, z1)
      }
    }
    // below the slot on the street faces, a row of windows too
    for (let j = 0; j < 6; j++) panel(win, a, b, H - SW + 0.5 + j * (2 * SW - 1) / 6 + 0.4, H - SW + 0.5 + (j + 1) * (2 * SW - 1) / 6 - 0.4, 4, 10.5)
  }

  // --- Upper block: four corner pavilions round a cross of slots, 92.5-127.5. ---
  const U = 21.5, US = 4.25, UD = 4.5
  const upper = ringOf([[U, U], [US, U], [US, U - UD], [-US, U - UD], [-US, U]])
  walls(granite, upper, 92.5, 127.5)
  cap(roof, upper, 127.5)
  for (let k = 0; k < 4; k++) {
    const R = (p: XY) => at(rotXY(p, k * 90))
    // slot back wall in glass, from the sloped glass roof up into the crown
    panel(slot, R([US, U - UD]), R([-US, U - UD]), 0, 2 * US, 99, 127.5, 0.05)
    // sloped glass roof at the slot's foot
    const p0 = R([US, U]), p1 = R([-US, U]), p2 = R([-US, U - UD]), p3 = R([US, U - UD])
    slot.quad(v(p0, 93), v(p1, 93), v(p2, 99.5), v(p3, 99.5))
    // windows on the pavilions' outer faces
    const a = R([U, U]), b = R([-U, U])
    for (const [z0, z1] of rows(93, 127, 4, 2.0)) {
      for (const [s0, s1] of [[1.0, U - US - 0.8], [U + US + 0.8, 2 * U - 1.0]]) {
        const n = Math.round((s1 - s0) / 5), w = (s1 - s0) / n
        for (let j = 0; j < n; j++) panel(win, a, b, s0 + j * w + 0.5, s0 + (j + 1) * w - 0.5, z0, z1)
      }
    }
  }

  // --- Crown: 30 m block to 140 m, a pyramid in four quarters, the mast. ---
  const K = 15, KZ = 140, APEX = 163.5, G = 1.25
  const crown = ringOf([[K, K]])
  walls(granite, crown, 127.5, KZ)
  cap(roof, crown, KZ)
  const zAt = (m: number) => KZ + (K - m) * (APEX - KZ) / K
  for (let k = 0; k < 4; k++) {
    const R = (p: XY) => at(rotXY(p, k * 90))
    panel(slot, R([K, K]), R([-K, K]), K - US, K + US, 128.5, KZ - 0.6, 0.05)
    // quarter of the pyramid in the +x+y quadrant, turned
    const A = v(R([G, G]), zAt(G)), B = v(R([K, G]), KZ), Cc = v(R([K, K]), KZ), D = v(R([G, K]), KZ)
    granite.tri(A, B, Cc) // +x face
    granite.tri(A, Cc, D) // +y face
    // the slot's side walls
    granite.tri(v(R([G, G]), KZ), A, D)
    granite.tri(v(R([G, G]), KZ), B, A)
  }
  {
    const r = octagon(C[0], C[1], 1.0, 0.4)
    walls(mast, r, KZ, 186.8)
    for (let i = 0; i < r.length; i++) mast.tri(v(r[i], 186.8), v(r[(i + 1) % r.length], 186.8), [C[0], C[1], 188.3])
  }

  const lit = (p: V3) => (p[2] > 127 ? Math.min(1, 0.5 + (p[2] - 127) / 40) : 0)
  return [
    { part: granite, material: { ...finish('fap-granite', 0xe6d5ca), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: slot, material: windowVariant(2, 0x6d8ca6) },
    { part: roof, material: PALETTE.roof },
    { part: mast, material: { ...finish('fap-mast', 0xf0ede8, 0.6), floodlight: () => 0.9 } },
  ]
}

if (import.meta.main) await save(ID, 'Fifth Avenue Place', ANCHOR, BEARING, build(), 6500)
