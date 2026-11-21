/**
 * Wells Fargo Center (formerly First National Bank Tower, 1972, Charles
 * Luckman and Associates), Portland, Oregon: the tallest building in Oregon.
 * Original procedural geometry, CC0-1.0.
 * bun generators/pdx-wells-fargo-center.ts
 *
 * Built with the kit in pdx-us-bancorp-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground, turned to the street grid. Anchor = area centroid of the OSM
 * outline way/331780190, 45.5143542, -122.6794511; bearing 21 (the grid,
 * measured from the OSM edges), so the tower is square to this frame.
 *
 * Identity, in order: the plain square white shaft with cut corners,
 * nothing but height; the close-set white marble fins running unbroken from
 * the plaza to the top, nine bays to a face, with dark bronze glass between;
 * the solid white cut corners; the fins standing a little proud of the flat
 * roof, with floodlights on the four corners at night.
 *
 * Evidence:
 *  - plan: lidar (USGS 3DEP OR_OLCMetro_2019, flight 2019) shows the shaft
 *    about 43.3 m square, x -13.8..29.5 and y -22.8..20.6 in this frame,
 *    about 2 m inside the OSM outline on every side (the OSM outline takes
 *    in the plaza steps). The corner cut, 3.5 m along each face, is
 *    measured from the OSM outline's chamfers and the lidar corners.
 *  - height: 166 m, 40 storeys (published, Wikipedia, 546 ft); lidar reads
 *    the parapet 166.5-168 m above the lowest ground in the crop. Roof
 *    penthouse plan from OSM way/1525632008 (OSM 167 m).
 *  - fins: nine bays a face, counted on Steve Morgan's photo from 6th &
 *    Columbia; fin width 1.1 m and depth 1.0 m estimated from it. The fins
 *    rise about 1.4 m above the glass (same photo).
 *  - materials: "columns of bronze-tinted glass, white Italian marble, and
 *    anodized aluminum" (Wikipedia). The glass is the palette window pulled
 *    warm; the anodized wall between the glass groups is a muted bronze.
 *  - night: Visitor7's night photo shows lit windows and four floodlights
 *    on the corners of the roof (lamps here).
 *  - no antenna mast: none of the photos shows one above the parapet, so
 *    none is modelled.
 *
 * Facade note: the real glass strips run unbroken from bottom to top. Here
 * each strip is cut into three-storey panels with a thin bronze spandrel, so
 * it reads as fins and glass without a full-height dark stripe.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Wells_Fargo_Center_from_6th_&_Columbia_-_Portland,_Oregon_(2014).jpg,
 *    Steve Morgan, CC BY-SA 3.0
 *  - Wells_Fargo_Center_(Portland,_Oregon).jpg, Visitor7, CC BY-SA 3.0
 *  - PortlandWellsFargoCenter.jpg, Cacophony, CC BY-SA 3.0
 * No commercial imagery.
 *
 * Doubts: the glazed lobby at the foot is simplified to the same panels;
 * the five-storey Data Processing Building next door is a separate OSM
 * building and is not part of this model.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { bead, cap, ccw, onWall, panel, save, walls, type XY } from './pdx-us-bancorp-tower'
import { chamfer, inset } from './chi-aon-center'

const X0 = -13.8, X1 = 29.5, Y0 = -22.8, Y1 = 20.6
const CUT = 3.5, FIN_D = 1.0, FIN_W = 1.1, BAYS = 9
const TOP = 166.0, GLASS_TOP = 164.6, FL = TOP / 40

export function build() {
  const marble = new Part(), bronze = new Part(), win = new Part(), roof = new Part(), lamp = new Part()

  const outer: XY[] = chamfer(ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]), CUT)
  const core = inset(outer, FIN_D)
  // Core walls in anodized bronze, its roof just under the fin tops.
  walls(bronze, core, 0, GLASS_TOP + 0.4)
  walls(marble, core, GLASS_TOP + 0.4, TOP - 0.6)
  cap(roof, core, TOP - 0.6)

  for (let i = 0; i < 8; i++) {
    const a = outer[i], b = outer[(i + 1) % 8]
    const ca = core[i], cb = core[(i + 1) % 8]
    if (i % 2 === 0) {
      // A cut corner: a solid marble pier, the face of the corner.
      const r = ccw([a, b, cb, ca])
      walls(marble, r, 0, TOP)
      cap(roof, r, TOP)
      // Floodlight on the corner.
      bead(lamp, [(a[0] + b[0] + ca[0] + cb[0]) / 4, (a[1] + b[1] + ca[1] + cb[1]) / 4, TOP + 0.9], 0.6)
      continue
    }
    // A main face: fins from the core to the outer line, glass between.
    const w = onWall(ca, cb)
    const L = w.L, pitch = (L - FIN_W) / BAYS
    for (let k = 0; k <= BAYS; k++) {
      const s = k * pitch // fin from s to s+FIN_W along the core wall
      const p0 = w.P(s, 0), p1 = w.P(s + FIN_W, 0)
      const q0 = w.P(s, 0, FIN_D), q1 = w.P(s + FIN_W, 0, FIN_D)
      const fin = ccw([[p0[0], p0[1]], [p1[0], p1[1]], [q1[0], q1[1]], [q0[0], q0[1]]])
      walls(marble, fin, 0, TOP)
      cap(roof, fin, TOP)
    }
    for (let k = 0; k < BAYS; k++) {
      const s0 = k * pitch + FIN_W, s1 = (k + 1) * pitch
      // Lobby glass at the foot, then three-storey groups to the top.
      panel(win, ca, cb, s0, s1, 0.3, 2 * FL - 0.4, 0.04)
      for (let z = 2 * FL; z < GLASS_TOP - 1; z += 3 * FL) panel(win, ca, cb, s0, s1, z + 0.35, Math.min(z + 3 * FL - 0.35, GLASS_TOP), 0.04)
    }
  }

  // Roof penthouse (OSM way/1525632008).
  const pent: XY[] = ccw([[16.6, -4.9], [16.5, 8.2], [-2.2, 8.1], [-2.1, -5.0]])
  walls(marble, pent, TOP - 0.6, TOP + 2.0)
  cap(roof, pent, TOP + 2.0)

  return [
    { part: marble, material: finish('wf-marble', 0xf2eee7) },
    { part: bronze, material: finish('wf-bronze', 0x9a8670) },
    { part: win, material: { name: 'window', color: 0x625d58, roughness: 0.35 } },
    { part: roof, material: PALETTE.roof },
    { part: lamp, material: { name: 'lamp', color: 0xd8d4cc, roughness: 0.6 } },
  ]
}

if (import.meta.main) await save('pdx-wells-fargo-center', 'Wells Fargo Center', [45.5143542, -122.6794511], 21, build())
