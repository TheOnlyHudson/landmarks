/**
 * United Office Building (1929; now The Giacomo hotel), 222 First Street,
 * Niagara Falls, New York: procedural, CC0-1.0.
 * bun generators/niagara-united-office-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation (the plan is turned 3 degrees anticlockwise, with the street
 * grid). Anchor = centroid of the OSM outline way/393289058,
 * 43.085391, -79.061843.
 *
 * Identity: a slender brown-brick Art Deco / Mayan Revival tower in three
 * setback tiers, each crowned by a pale cast-stone frieze band of carved
 * panels between stepped piers that rise above the parapet like
 * battlements; paired windows in four bays a face between brick
 * pilasters; a darker red-brown base; a mast on top.
 *
 * Evidence:
 * - plan and heights: OSM building parts, concentric: way/981021780 (15
 *   levels, 53.5 m, 18.9 x 21.9 m), way/981021778 (17 levels, 60.8 m,
 *   14.8 x 17.5 m), way/981021779 (20 levels, 71.5 m, 9.5 x 11.0 m). The
 *   tiers' proportions in the Kenneth C. Zirkel photo (frontal) agree to
 *   within 1.5 m (53.5 / 63 / 71.5 m against the photo's 54 / 63 / 71.5).
 * - main entrance: OSM node/9074642725 (entrance=main), centre of the east
 *   face, on First Street.
 * - frieze bands about 2.1 m deep; piers about 1.1 m wide rising 1.5 m
 *   (drawn 2.2 m, bolder for phone size)
 *   over them, five across each face of the lower two tiers, three on the
 *   top tier; the mast about 6 m (to about 79 m): scaled from the
 *   Zirkel photo, +-0.5 m.
 * - colours: daylight photos, pulled to the palette (red-brown brick, a
 *   red-brown base for the lowest four floors (the real one fades upward), cream stone).
 * - published: 20 storeys, 1929, NRHP (Wikipedia, "United Office
 *   Building").
 * No lidar used: OSM's tagged part heights agree with the photo.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "The Giacomo, aka United Office Building, Niagara Falls, New York.jpg",
 *   Kenneth C. Zirkel, CC BY-SA 4.0 (from the east, street, frontal)
 *   https://commons.wikimedia.org/wiki/File:The_Giacomo,_aka_United_Office_Building,_Niagara_Falls,_New_York.jpg
 * - "United Office Building Jun 09.JPG", Pubdog, public domain (from the
 *   south-west, street)
 *   https://commons.wikimedia.org/wiki/File:United_Office_Building_Jun_09.JPG
 * No commercial imagery.
 *
 * Simplified: the carved frieze panels are plain cream bands; the stepped
 * piers are two-stage blocks; the base's colour gradient is one band; the
 * paired windows are one panel per bay per storey group. The north and
 * west faces have no close photo and repeat the east and south.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, shift, turn, walls, type XY } from './chi-aon-center'

const ROT = 3.0
const C: XY = [-1.95, -0.1] // the tiers' common centre, from the anchor
const place = (r: XY[]) => shift(turn(r, ROT), C[0], C[1])

const FRIEZE = 2.1, PIER = 1.1, PIER_UP = 2.2

function build() {
  const brick = new Part(), base = new Part(), stone = new Part(), win = new Part(), roof = new Part(), door = new Part()

  /** One tier: walls from z0 to z1, its frieze and piers, windows in `bays` bays. */
  function tier(hx: number, hy: number, z0: number, z1: number, piers: number, groups: [number, number][]) {
    const ring = place(rect(-hx, -hy, hx, hy))
    walls(brick, ring, z0, z1 - FRIEZE)
    // the frieze, a little proud, then the parapet's coping
    const out = inset(ring, -0.15)
    walls(stone, ring, z1 - FRIEZE, z1 - FRIEZE, out)
    walls(stone, out, z1 - FRIEZE, z1)
    const lip = inset(out, 0.5)
    walls(stone, out, z1, z1, lip)
    walls(stone, lip.slice().reverse(), z1 - 0.8, z1)
    cap(roof, lip, z1 - 0.8)
    for (let f = 0; f < 4; f++) {
      const a = ring[f], b = ring[(f + 1) % 4]
      const { L, P } = onWall(a, b)
      const pitch = (L - PIER) / (piers - 1)
      for (let k = 0; k < piers; k++) {
        const s = PIER / 2 + k * pitch
        // the stepped pier over the frieze: wide stage, then a narrower cap
        const box = (w: number, d0: number, d1: number, zA: number, zB: number) => {
          const r = [P(s - w / 2, 0, d1), P(s + w / 2, 0, d1), P(s + w / 2, 0, d0), P(s - w / 2, 0, d0)].map((q) => [q[0], q[1]] as XY)
          block(stone, stone, r, zA, zB, 0.12)
        }
        box(PIER, -0.6, 0.35, z1 - FRIEZE - 0.6, z1 + PIER_UP * 0.6)
        box(PIER * 0.65, -0.4, 0.25, z1 + PIER_UP * 0.6, z1 + PIER_UP)
        // brick pilasters down the shaft between the bays (not at corners)
        if (k > 0 && k < piers - 1) {
          const r = [P(s - 0.4, 0, 0.14), P(s + 0.4, 0, 0.14), P(s + 0.4, 0, -0.2), P(s - 0.4, 0, -0.2)].map((q) => [q[0], q[1]] as XY)
          walls(brick, r, z0, z1 - FRIEZE)
        }
      }
      // one window panel per bay per storey group, spanning the pair
      for (let k = 0; k < piers - 1; k++) {
        const s0 = PIER / 2 + k * pitch, s1 = s0 + pitch
        for (const [g0, g1] of groups) panel(win, a, b, s0 + 1.3, s1 - 1.3, g0, g1, 0.05)
      }
    }
    return ring
  }

  // the base tier, the red-brown lower floors, the entrance
  const ring = tier(9.45, 10.95, 0, 53.5, 5, [[14.6, 23.4], [25.0, 33.8], [35.4, 44.2], [45.8, 50.4]])
  const lower = inset(ring, -0.08)
  walls(base, lower, 0, 13.6)
  walls(base, lower, 13.6, 13.6, ring)
  for (let f = 0; f < 4; f++) {
    const a = ring[f], b = ring[(f + 1) % 4]
    const { L } = onWall(a, b)
    const pitch = (L - PIER) / 4
    for (let k = 0; k < 4; k++) {
      const s0 = PIER / 2 + k * pitch, s1 = s0 + pitch
      if (f === 1 && (k === 1 || k === 2)) continue // the portal takes the middle
      panel(win, a, b, s0 + 1.1, s1 - 1.1, 1.4, 4.6, 0.13)
      panel(win, a, b, s0 + 1.3, s1 - 1.3, 6.0, 12.6, 0.13)
    }
  }
  {
    // main entrance: centre of the east face (OSM entrance=main)
    const a = ring[1], b = ring[2]
    const { L } = onWall(a, b)
    panel(stone, a, b, L / 2 - 3.0, L / 2 + 3.0, 0, 7.6, 0.14)
    panel(door, a, b, L / 2 - 2.0, L / 2 + 2.0, 0, 5.6, 0.18)
  }
  tier(7.4, 8.75, 53.5, 60.8, 5, [[54.6, 58.2]])
  tier(4.75, 5.5, 60.8, 71.5, 3, [[61.9, 68.8]])
  // the mast
  const m = place(rect(-0.18, -0.18, 0.18, 0.18))
  walls(roof, m, 70.7, 79)
  cap(roof, m, 79)

  return [
    { part: brick, material: finish('uob-brick', 0xb47a56) },
    { part: base, material: finish('uob-base', 0x9a614d) },
    { part: stone, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('niagara-united-office-building', 'United Office Building', [43.085391, -79.061843], 0, build())
