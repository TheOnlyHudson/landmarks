/**
 * Midtown Exchange (the former Sears, Roebuck and Co. building, 1928, by
 * Nimmons, Carr & Wright), 2929 Chicago Avenue / Lake Street, Minneapolis:
 * procedural, CC0-1.0.
 * bun generators/msp-midtown-exchange.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the walls run
 * north-south and east-west). Origin at the area centroid of OSM
 * way/62260813 (-93.260778, 44.949375). y = 0 is the street and plaza
 * level round the building (lidar 262.5 m); the site is flat.
 *
 * Form: a long buff-brick Art Deco block running north from Lake Street:
 * an 11-storey middle section with the tower on its west front (toward the
 * Chicago Avenue plaza), a 9-storey north block, and the 4-storey Midtown
 * Global Market range along Lake Street; lower 3-storey strips along the
 * west and east sides. The tower projects from the west front: a stage to
 * 52 m whose side buttresses step back, then the 16-storey shaft to 75 m
 * with a stepped crown and the lit MIDTOWN sign on top, over a stone
 * entrance portal. Windows are punched in vertical bays between brick
 * piers, drawn as panels grouped by three storeys.
 *
 * Sources
 * - OSM (ODbL): way/62260813 "Midtown Exchange" (building=apartments, 11
 *   levels, building:colour #c4a18a, old_name Sears Tower) and the
 *   building:parts inside it: way/1548869099 (the tower, 16 levels, height
 *   64), way/1549183516, way/1549183517, way/1549183518, way/1548869091,
 *   way/1548869092, way/1548869093-1548869098. All are drawn over by the
 *   model and listed in `replaces`. Several parts' levels (2 on the
 *   9-storey north block) disagree with lidar; the model follows lidar.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 1 m grid with
 *   class 18 kept (work/_towers/lidar18.py), heights above the street: the
 *   tower 75 (Wikipedia's 73 m is the roof; the crown and sign stand above
 *   it), its 52 m stage, the middle block 47 with a 42 m west front strip
 *   and penthouses to 51-60, the north block 36.5, the Lake Street range 18,
 *   the side strips 10-14. An isolated 8 x 8 m return at 74-79 m over the
 *   north block's middle (y 52-56) shows in no photo and is ignored as noise.
 * - USGS NAIP (public domain): plan, pale gravel roofs, the tower's top.
 * - Photos (Wikimedia Commons, evidence): McGhiever, "Midtown Exchange.jpg",
 *   CC BY-SA 4.0 (the west front, frontal: the tower's stages, the stepped
 *   wings, windows and the sign); Fibonacci Blue, "Minneapolis neighborhood
 *   Midtown Phillips (52238229167).jpg", CC BY 2.0 (the tower from the
 *   south-west); Tony Webster, "Midtown Exchange Building, Minneapolis
 *   (48660624678).jpg", CC BY-SA 2.0 (the tower at dusk), "Midtown Exchange
 *   (2510090993).jpg", CC BY 2.0 (the crown and sign); August Schwerdfeger,
 *   "Midtown Exchange from Riverside Plaza 2014-08-26.jpg", CC BY 4.0 (from
 *   the north-east: the massing behind the tower); Heritage Preservation
 *   Department - MNHS, "1000 East Lake Street-Midtown Exchange-2007.jpg" and
 *   "2929 Chicago Avenue-Midtown Exchange main entrance.jpg", CC BY-SA 2.0;
 *   Loveoflanguage, "Midtown Exchange2020.jpg", CC BY-SA 4.0.
 * - Published: built 1928 for Sears, Roebuck; 16-storey tower; renovated
 *   2005-06 as Midtown Exchange (Wikipedia, "Midtown Exchange").
 * Measured (lidar): all heights and the plan of each section.
 * Estimated from the photos: the storey height (4.2 m), the bay widths,
 *   the window groups, the portal (8 m), the crown's piers and the sign's
 *   size (16 x 3 m).
 * Doubts: the east and north sides have no close licensed photo; the north
 *   block's east and north walls are kept blank with pilasters, as the
 *   distant photo from the east shows, the middle section's get windows; the
 *   rear of the Lake Street range is kept plain. The sign is a plain lit
 *   panel, not lettered.
 * Night: windows glow; the sign is `neon-midtown`; the tower is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'

export function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), sign = new Part()
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = roof, c = 0.4) =>
    prism(p, top, c > 0 ? chamfer(rect(x0, y0, x1, y1), c) : rect(x0, y0, x1, y1), z0, z1)
  // a parapet coping band round a block's top
  const coping = (x0: number, y0: number, x1: number, y1: number, z: number) => box(stone, x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25, z - 0.7, z, roof, 0.2)
  // window bays on a face: bays of width `bay` across [s0, s1], panels grouped by three storeys
  const grid = (f: Face, s0: number, s1: number, bay: number, z0: number, z1: number, storey = 4.2, per = 3) => {
    const n = Math.max(1, Math.round((s1 - s0) / bay)), w = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const c = s0 + w * (i + 0.5)
      for (let z = z0; z + storey * 0.6 < z1; z += storey * per) {
        const top = Math.min(z1, z + storey * per) - 1.0
        flatShape(win, f, rect(c - w * 0.3, z + 0.9, c + w * 0.3, top), 0.06)
      }
    }
  }
  const W = (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] })
  const E = (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] })
  const S = (y: number): Face => ({ o: [0, y, 0], n: [0, -1] })
  const N = (y: number): Face => ({ o: [0, y, 0], n: [0, 1] })
  // s on a face: west face s = -y; east face s = y; south face s = x; north face s = -x

  // ---- the Lake Street range (Midtown Global Market), 4 storeys, and its low south edge
  box(brick, -30, -92, 37, -41, 0, 18)
  coping(-30, -92, 37, -41, 18.4)
  box(brick, -30, -97, 37, -92, 0, 11)
  coping(-30, -97, 37, -92, 11.4)
  grid(S(-97), -27, 34, 6, 0.6, 11, 4.6, 2)
  grid(W(-30), 44, 89, 6, 0.6, 18, 4.4, 2)
  grid(E(37), -89, -44, 6, 0.6, 18, 4.4, 2)

  // ---- the middle section: 11 storeys, a lower west front strip, penthouses; a low east strip
  box(brick, -24, -40, 30, 33, 0, 47)
  coping(-24, -40, 30, 33, 47.4)
  box(brick, -28, -40, -24, 33, 0, 42)
  coping(-28, -40, -24, 33, 42.4)
  box(brick, 4, 12, 16, 32, 47, 60)
  coping(4, 12, 16, 32, 60.3)
  box(brick, 16, 20, 26, 32, 47, 51)
  box(brick, 18, -36, 29, -24, 47, 54)
  coping(18, -36, 29, -24, 54.3)
  box(brick, 30, -40, 39, 33, 0, 12)
  coping(30, -40, 39, 33, 12.4)
  // west front windows either side of the tower; south and north ends
  grid(W(-28), -33, -10, 3.2, 0.4, 42) // north wing (s = -y: y 10..33)
  grid(W(-28), 18, 40, 3.2, 0.4, 42) // south wing (y -40..-18)
  grid(S(-40), -22, 29, 3.4, 18.4, 47)
  grid(N(33), -29, 22, 3.4, 36.6, 47)
  grid(E(39), -38, 31, 4, 0.4, 12, 4, 3)
  grid(E(30), -38, 31, 3.4, 12.4, 47)

  // ---- the north block: 9 storeys, low strips on its west and north sides
  box(brick, -28, 33, 33, 84, 0, 36.5)
  coping(-28, 33, 33, 84, 36.9)
  box(brick, -38, 33, -28, 93, 0, 11)
  coping(-38, 33, -28, 93, 11.4)
  box(brick, -28, 84, 33, 93, 0, 11)
  coping(-28, 84, 33, 93, 11.4)
  box(brick, 33, 33, 40, 70, 0, 14)
  coping(33, 33, 40, 70, 14.4)
  grid(W(-28), -82, -35, 3.2, 11.4, 36.5)
  // its east and north walls are blank warehouse brick with shallow pilasters (photo from the east)
  for (const y of [42, 55, 68, 80]) box(brick, 33, y - 1, 33.6, y + 1, 14, 36.5, null, 0.15)
  for (const x of [-16, 0, 16]) box(brick, x - 1, 84, x + 1, 84.6, 11, 36.5, null, 0.15)
  grid(W(-38), -91, -35, 4, 0.4, 11, 4, 3)
  grid(N(93), -31, 26, 4, 0.4, 11, 4, 3)

  // ---- the tower
  const TX0 = -33, TX1 = -16, TY0 = -14, TY1 = 2 // the shaft (75 m)
  const CY = (TY0 + TY1) / 2 // its axis, the west front's centre
  // the 52 m stage: the shaft's side buttresses and the block behind
  box(brick, -32, -18, -12, 8, 0, 52)
  coping(-32, -18, -12, 8, 52.4)
  // the shaft, a step at 66 m, and the crown
  box(brick, TX0, TY0, TX1, TY1, 0, 75)
  box(stone, TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3, 74.2, 75.4, roof, 0.2)
  // the stepped crown: corner piers rising over the parapet, a narrower top stage
  for (const [x, y] of [[TX0, TY0], [TX0, TY1], [TX1, TY0], [TX1, TY1]] as [number, number][])
    box(brick, x - (x === TX0 ? 0 : 2.4), y - (y === TY0 ? 0 : 2.4), x + (x === TX0 ? 2.4 : 0), y + (y === TY0 ? 2.4 : 0), 75, 78.2, stone, 0.25)
  box(brick, TX0 + 3.5, TY0 + 3.5, TX1 - 3.5, TY1 - 3.5, 75, 77.2, roof, 0.3)
  // vertical brick piers down the shaft's west face, either side of the window strip
  const TW = W(TX0)
  for (const dy of [-4.6, 4.6]) box(brick, TX0 - 0.6, CY + dy - 0.9, TX0 + 0.2, CY + dy + 0.9, 8, 74.2, null, 0.2)
  // the shaft's windows: a central strip of two bays and one bay each side, grouped
  for (const [s0, s1, bay] of [[-CY - 3.6, -CY + 3.6, 3.6], [-CY - 7.4, -CY - 5.6, 1.8], [-CY + 5.6, -CY + 7.4, 1.8]] as number[][]) grid(TW, s0, s1, bay, 9, 73.5)
  grid(S(TY0), TX0 + 2, TX1 - 2, 3.3, 52.4, 73.5)
  grid(N(TY1), -TX1 + 2, -TX0 - 2, 3.3, 52.4, 73.5)
  grid(E(TX1), TY0 + 2, TY1 - 2, 3.2, 52.4, 73.5)
  // the stage's west faces beside the shaft
  grid(W(-32), -8, -2.4, 2.8, 0.4, 51.5)
  grid(W(-32), 14.4, 18, 1.8, 0.4, 51.5)
  // the entrance portal: a stone frame projecting from the shaft's foot, glazed doors and transom
  box(stone, -37.5, CY - 6, TX0, CY + 6, 0, 8.2, roof, 0.3)
  box(stone, TX0 - 0.4, CY - 7, TX0 + 0.2, CY + 7, 0, 14, null, 0.2)
  flatShape(win, W(-37.5), rect(-CY - 3.2, 0, -CY + 3.2, 6.8), 0.06)
  // the MIDTOWN sign on the crown, facing west and east: a lit panel on a frame
  box(sign, TX0 + 4.6, CY - 7.5, TX0 + 5.2, CY + 7.5, 78.2, 81.4, sign, 0.1)
  for (const dy of [-6, 0, 6]) box(roof, TX0 + 5.2, CY + dy - 0.15, TX0 + 5.6, CY + dy + 0.15, 77.2, 81.4, roof, 0)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[0] < -10 && p[1] > -20 && p[1] < 10 && p[2] > 40 ? 0.8 : 0)
  return finishGlb('msp-midtown-exchange', [
    { part: brick, material: { ...finish('midtown-brick', 0xd8c3a2), floodlight: lit } },
    { part: stone, material: { ...finish('midtown-stone', 0xece2cd), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: sign, material: finish('neon-midtown', 0xf4f1ea) },
  ], { name: 'Midtown Exchange' }, 6500)
}

if (import.meta.main) await writeModel('msp-midtown-exchange', build())
