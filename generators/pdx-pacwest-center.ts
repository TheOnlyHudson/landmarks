/**
 * PacWest Center (1211 SW Fifth Avenue, 1984, Hugh Stubbins & Associates),
 * Portland, Oregon. Original procedural geometry, CC0-1.0.
 * bun generators/pdx-pacwest-center.ts
 *
 * Built with the kit in pdx-us-bancorp-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground, turned to the street grid. Anchor = area centroid of the OSM
 * outline way/141453087, 45.5152931, -122.6801335; bearing 21 (the grid,
 * measured from the OSM edges).
 *
 * Identity, in order: bold horizontal stripes of dark glass and silver
 * aluminium wrapping round rounded corners; two slabs side by side, a full
 * height one and a lower one stepping down at the 22nd floor; the slabs
 * lifted over a recessed, columned base; a plain silver band at the top.
 *
 * Evidence:
 *  - plan: OSM parts way/1291892524 (tall slab, 127 m, 29 levels) and
 *    way/1291892521 (lower slab, 85 m, 22 levels) in this frame: the tall
 *    slab 34.0 x 45.8 m, the low one an L, 32.4 x 8.6 m along the south
 *    face plus a 2.8 m strip down the east face. The OSM corners are only
 *    slightly rounded; the photos show a radius of about 3 m, used here.
 *    The two-storey base way/1291892523 (8 m) and the glass-roofed hall
 *    way/1291892520 (10 m): OSM.
 *  - height: 127.4 m, 30 storeys (published, Wikipedia); the low slab 85 m
 *    (OSM), which agrees with 22 of 30 storeys in M.O. Stevens' photo.
 *  - the undercut: the slabs start about three storeys up, over a recessed
 *    base with silver columns (Cacophony's corner photo). Depth 3.5 m and
 *    12.5 m height estimated from it.
 *  - stripes: each storey is a dark glass band and a taller silver band.
 *    Grouped here two storeys to a stripe (3.6 m glass, 4.9 m silver), so
 *    the stripes stay bold at map distance rather than turning to
 *    pinstripes. The top storey is plain silver (Steve Morgan's photo).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - PacWestCenterPortland.jpg, Cacophony, CC BY 3.0
 *  - PacWest_Center_full.JPG, M.O. Stevens, public domain
 *  - Pacwest_Center_upper_portion_with_tree_growing_on_24th_floor_terrace
 *    _(2013).jpg, Steve Morgan, CC BY-SA 4.0
 * No lidar was needed. No commercial imagery.
 *
 * Doubts: the low slab's L plan is OSM's and only its south face is well
 * photographed; the base and the columns are simplified; the terrace
 * garden on the low slab is drawn as plain roof.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { bandRows, cap, ccw, ribbons, roundCorners, save, walls, type XY } from './pdx-us-bancorp-tower'
import { block, inset, rect } from './chi-aon-center'

const TALL = roundCorners(ccw(rect(-20.0, -16.6, 14.0, 29.2)), 3.0, 4)
const LOW = roundCorners(ccw([[-15.6, -25.2], [16.8, -25.2], [16.8, 12.5], [14.0, 12.5], [14.0, -16.6], [-15.6, -16.6]]), 3.0, 4)
const BASE = ccw([[-17.9, -29.2], [-17.3, -30.1], [-16.5, -30.7], [-12.7, -30.7], [29.2, -30.4], [30.6, -29.7], [31.9, -28.9], [33.2, -27.7], [34.4, -26.2], [34.3, -16.0], [33.1, -16.1], [31.9, -15.4], [31.4, -14.4], [31.4, -12.1], [31.3, 7.4], [31.3, 10.6], [31.9, 11.6], [32.6, 12.3], [33.5, 12.5], [34.5, 12.5], [34.5, 18.5], [34.5, 24.7], [33.8, 25.9], [32.4, 26.7], [31.2, 27.0], [13.9, 26.9], [14.0, 12.5], [14.0, 7.3], [14.0, -12.2], [14.0, -15.6], [13.8, -16.1], [13.2, -16.5], [-15.6, -16.6], [-16.9, -16.6], [-17.9, -16.6]])
const HALL = ccw([[31.4, -12.1], [31.3, 7.4], [14.0, 7.3], [14.0, -12.2]])

const TOP = 127.4, LOW_TOP = 85, LIFT = 12.5, FL = TOP / 30

export function build() {
  const silver = new Part(), win = new Part(), roof = new Part(), glass = new Part()

  // The slabs, lifted over the recessed base.
  block(silver, roof, TALL, LIFT, TOP, 0.4)
  block(silver, roof, LOW, 8, LOW_TOP, 0.4)
  cap(silver, TALL, LIFT, false) // soffit of the overhang
  // Stripes: two storeys to a stripe, glass low in each; silver top storey.
  const stripes = (z0: number, z1: number) => bandRows(z0, z1, 2 * FL, 3.6, 1.6)
  ribbons(win, TALL, stripes(LIFT, TOP - FL))
  ribbons(win, LOW, stripes(LIFT, LOW_TOP - 2.5))

  // Recessed base under the tall slab: dark lobby glass behind columns.
  const core = inset(TALL, 3.5)
  walls(win, core, 0, LIFT)
  const colRing = inset(ccw(rect(-20.0, -16.6, 14.0, 29.2)), 1.4)
  for (let i = 0; i < 4; i++) {
    const a = colRing[i], b = colRing[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / 9))
    for (let k = 0; k < n; k++) {
      const t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
      walls(silver, ccw(rect(x - 0.6, y - 0.6, x + 0.6, y + 0.6)), 0, LIFT)
    }
  }

  // Two-storey base and the glass-roofed hall.
  block(silver, roof, BASE, 0, 8, 0.3)
  ribbons(win, BASE, [[0.6, 4.2]], { minLen: 4, end: 0.6 })
  block(silver, glass, HALL, 7.5, 10, 0.3)

  return [
    { part: silver, material: finish('pacwest-silver', 0xdadde0) },
    { part: win, material: { name: 'window', color: 0x56636e, roughness: 0.35 } },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('pdx-pacwest-center', 'PacWest Center', [45.5152931, -122.6801335], 21, build())
