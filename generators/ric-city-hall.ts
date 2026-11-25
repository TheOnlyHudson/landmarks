/**
 * Richmond City Hall, 900 East Broad Street, Richmond, Virginia (1971,
 * Vincent G. Kling & Associates; modernist office slab, observation deck
 * on the top floor) — original procedural geometry, CC0-1.0.
 * bun generators/ric-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 37.10: the long sides of OSM way/113029199 run at
 * 37.1°, so +y runs north-east toward Marshall Street and -y faces Broad
 * Street. Anchor = the outline's centroid, -77.4329612, 37.5409883.
 *
 * Identity (from the photos below):
 *  1. A pale concrete slab tower on a dark base: a deep egg-crate facade of
 *     projecting vertical fins at every bay and horizontal sunshade ledges,
 *     the glazing set well back between them.
 *  2. The top floor (the public observation deck) glazed all round in dark
 *     recessed glass, under a thin roof slab that overhangs on all four
 *     sides, with a mechanical penthouse and a mast above.
 *  3. A two-storey podium filling the block, its top a raised plaza, with a
 *     lower pavilion on the Marshall Street side.
 *
 * Plan: OSM way/113029199 (the block-filling podium, x -31..31,
 * y -38.7..38.7) and its tower part way/365155733 (height 96.3), x -17.7..
 * 15.7, y -26.3..27.0; the lidar roof edge is 1–1.5 m wider on every side,
 * which is the roof slab's overhang.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 1 m grid, read in this frame. y = 0 is the lowest ground (the east
 * corner); the ground rises 2.8 m to the west corner. Measured above y = 0:
 * the plaza deck 8.3, its parapets 9.6; the roof slab 85.3; the penthouse
 * 94.2 (x -8..8, y -16..16); an upper machine room 104 (8 m square); the
 * mast tip 133.6; the Marshall Street pavilion 19.0 (x -12..12, y 30..).
 * OSM's 96.3 is the penthouse. Estimated from the photos: 18 storeys
 * (shaft 8.3–81.5 at 4.07 m), 14 bays on the long faces and 8 on the short,
 * the fin and ledge depths, the observation storey 81.5–84.4.
 *
 * Facade: the real ledges run at every floor; they are drawn every second
 * floor (STYLE.md: no per-floor pinstripes), with the fins at every bay,
 * so the egg-crate reads without shimmering.
 *
 * Ground: Mapterhorn is within 3 m across the block; elevation 0.
 *
 * Night: the office windows and the observation deck glow.
 *
 * Rework after review (2026-11): white concrete (#f3f1eb) for the fins,
 * ledges and wall; the glazing darker (#535e6a) as recessed panels behind
 * the white frame, two storeys per panel; the observation storey now dark
 * recessed glass (was pale sky-blue) set 1.6 m in under a thicker (1.4 m)
 * overhanging roof slab. Massing, penthouse and mast unchanged.
 *
 * Photos (all EVIDENCE):
 *  - Richmond City Hall, taberandrew (Taber Andrew Bain), CC BY 2.0 (the
 *    tower from below, two faces) https://www.flickr.com/photos/88442983@N00/4192168845
 *  - Richmond City Hall, taberandrew, CC BY 2.0 (the crown and roof slab)
 *    https://www.flickr.com/photos/88442983@N00/2988924475
 *  - USGS NAIP orthoimagery (public domain): roof, penthouse, plaza.
 * No look-only sources. No commercial imagery. (Two Openverse hits for
 * "Richmond City Hall" were of Richmond, British Columbia and not used.)
 *
 * Doubts: no photo of the podium and plaza from the street was used; the
 * podium is drawn as a dark glazed base with a paved deck, the planters and
 * stairs left out. The bay counts are from one oblique photo.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { edgePanels, revolve, type XY } from './atl-tech-tower'
import { at, box, ccw, offset, save, wall } from './atl-flatiron-building'

const conc = new Part(), base = new Part(), win = new Part(), plaza = new Part()

// ── Podium and plaza ──
const PX0 = -31.0, PX1 = 31.0, PY0 = -38.5, PY1 = 38.5, PZ = 8.3
box(base, PX0, PX1, PY0, PY1, 0, PZ, plaza, 0)
for (const [a, b, c, d] of [[PX0, PX1, PY0, PY0 + 0.4], [PX0, PX1, PY1 - 0.4, PY1], [PX0, PX0 + 0.4, PY0, PY1], [PX1 - 0.4, PX1, PY0, PY1]]) box(conc, a, b, c, d, PZ, 9.6, conc, 0.08)
box(conc, PX0 - 0.2, PX1 + 0.2, PY0 - 0.2, PY1 + 0.2, PZ - 0.9, PZ, null, 0) // the deck's fascia
{
  const P: XY[] = ccw([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]])
  for (let i = 0; i < 4; i++) edgePanels(win, P[i], P[(i + 1) % 4], 1.0, PZ - 1.4, { group: 6, gap: 0.6, bay: 4.2, pier: 0.7, margin: 1.2, out: 0.06 })
}
// the Marshall Street pavilion on the deck
box(conc, -12, 12, 29.5, PY1, PZ, 19.0, plaza, 0.3)
{
  const P: XY[] = ccw([[-12, 29.5], [12, 29.5], [12, PY1], [-12, PY1]])
  for (let i = 0; i < 4; i++) edgePanels(win, P[i], P[(i + 1) % 4], PZ + 1.0, 18.0, { group: 4.5, gap: 0.8, bay: 3.0, pier: 0.6, margin: 0.8, out: 0.06 })
}

// ── Tower ──
const TX0 = -17.6, TX1 = 15.6, TY0 = -26.3, TY1 = 26.9
const S0 = PZ, S1 = 81.5, OBS = 84.4, ROOF = 85.3
const FL = (S1 - S0) / 18
const T: XY[] = ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]])
// the glazed wall set back behind the fins
const Ti = offset(T, -0.9)
wall(conc, Ti, S0, S1)
// glazing: one panel a bay, two storeys tall, between the fins
for (let i = 0; i < 4; i++) {
  const a = Ti[i], b = Ti[(i + 1) % 4]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = L > 40 ? 14 : 8
  edgePanels(win, a, b, S0 + 0.3, S0 + FL * 18 - 0.2, { group: FL * 2, gap: 1.3, bay: L / n, pier: 0.8, margin: 0.0, out: 0.06 })
}
// vertical fins at every bay, standing out to the tower's outline
for (let i = 0; i < 4; i++) {
  const a = T[i], b = T[(i + 1) % 4]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = L > 40 ? 14 : 8
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  for (let k = 0; k <= n; k++) {
    const s = (k * L) / n
    const c: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
    const p0: XY = [c[0] - nn[0] * 0.95 - t[0] * 0.36, c[1] - nn[1] * 0.95 - t[1] * 0.36]
    const p1: XY = [c[0] + t[0] * 0.36, c[1] + t[1] * 0.36]
    box(conc, Math.min(p0[0], p1[0]), Math.max(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[1], p1[1]), S0, S1, conc, 0)
  }
}
// horizontal sunshade ledges every second storey
for (let f = 0; f <= 18; f += 2) {
  const z = S0 + f * FL - 0.6
  const o = offset(T, 0.2)
  wall(conc, o, z, z + 0.6)
  conc.loft([at(o, z + 0.6), at(Ti, z + 0.6)])
  conc.loft([at(Ti, z), at(o, z)])
}
// observation storey: dark recessed glass all round, under the broad overhanging slab
{
  const g = offset(T, -1.6)
  wall(win, g, S1, OBS)
  box(conc, TX0 - 1.5, TX1 + 1.5, TY0 - 1.5, TY1 + 1.5, OBS - 0.5, ROOF, plaza, 0.25, true)
}
// penthouse, machine room, mast
box(conc, -9.0, 7.0, -16.0, 16.0, ROOF, 94.2, plaza, 0.3)
box(conc, -5.0, 3.0, -4.0, 4.0, 94.2, 104.0, plaza, 0.3)
revolve(base, [-1.0, 0.0], [[0.45, 104.0], [0.3, 112.0], [0.12, 133.6], [0, 133.8]], 6, 0, true, false)

await save('ric-city-hall', 'Richmond City Hall', [
  { part: conc, material: finish('rch-concrete', 0xf3f1eb) },
  { part: base, material: finish('rch-base', 0x7a736c) },
  { part: win, material: { ...PALETTE.window, color: 0x535e6a } },
  { part: plaza, material: PALETTE.roof },
], { height: 133.8, anchor: [37.5409883, -77.4329612], bearing: 37.1 })
