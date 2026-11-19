/**
 * Algiers Courthouse, 225 Morgan Street, Algiers Point, New Orleans (1896) —
 * procedural, CC0-1.0, no textures. bun generators/nola-algiers-courthouse.ts
 *
 * Identity, in order: the two square corner towers on the levee front, the
 * taller one (north-east of the pair, model −x) with its clock faces under a
 * corbelled, crenellated top, the shorter one with the same top a stage lower;
 * the two-storey block between them with paired round-arched windows; the
 * columned entrance portico with its balcony; the "COURT HOUSE" frontispiece
 * on the hipped slate roof; the rose-red paint (2024-25; beige before).
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * area centroid of OSM way/339457542 (−90.0540391, 29.9536572). Placed at
 * bearing 144.3: the front (model −y) faces compass 324.3°, Morgan Street and
 * the levee; the clock tower stands at model −x (compass 234.3° side).
 *
 * Evidence
 * - OSM way/339457542 (building=yes, building:colour=#a4827b, 2 levels,
 *   roof:shape=hipped), the courthouse with its rear annex. (Not named in
 *   OSM; identified by the photos, its towers in the NAIP and the lidar.)
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame, ground ≈ +0.5 over the grid minimum
 *   (heights below are above ground): main block x −14.2..14.2,
 *   y −9.2..6.8, walls to 11.2, hipped roof to 14.7 (drawn 14.1: the photo's ridge sits lower;
 *   the lidar top includes the frontispiece; ridge along x at
 *   y ≈ −1); clock tower x −15..−9.4, y −10.2..−4.2, top 22.2; second tower
 *   x 9.4..15.4, top 17.6; portico ~5.5 at the front; rear annex
 *   x −5..4.5, y 6.8..15, flat roof 8.6.
 * - NAIP (USGS, public domain): the plan, the slate roof, the light roof of
 *   the annex.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Algiers Courthouse, New Orleans 2025-05-08.jpg", Schwerdf, CC BY 4.0:
 *     the front face-on from across the river — every stage line, window,
 *     the portico, frontispiece and tower tops (scaled to the lidar's 22.2)
 *     https://commons.wikimedia.org/wiki/File:Algiers_Courthouse,_New_Orleans_2025-05-08.jpg
 *   - "Algiers Courthouse, New Orleans October 2024.jpg" and "... October
 *     2024 2.jpg", lukeharold, CC0: the front at an angle, colours
 *     https://commons.wikimedia.org/wiki/File:Algiers_Courthouse,_New_Orleans_October_2024.jpg
 *   - "Old Algiers Courthouse, New Orleans March 2013.jpg", Owen Allen,
 *     CC BY 2.0: the front and the clock tower's side (beige then)
 *     https://commons.wikimedia.org/wiki/File:Old_Algiers_Courthouse,_New_Orleans_March_2013.jpg
 *   - "AlgiersNOLACourthouseBack.JPG", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the plain stucco rear annex
 *     https://commons.wikimedia.org/wiki/File:AlgiersNOLACourthouseBack.JPG
 *   - "Algiers Point Sept2015 Courthouse HardyHouse From Levee.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: from the levee
 *     https://commons.wikimedia.org/wiki/File:Algiers_Point_Sept2015_Courthouse_HardyHouse_From_Levee.jpg
 * - Published: Wikipedia, "Algiers Courthouse": 1896, Romanesque/Italianate,
 *   on the site of an earlier courthouse.
 *
 * Measured (lidar): the plan, wall, roof and tower heights. Estimated from the
 * face-on photo scaled to the lidar: string course 5.0, windows (ground
 * 1.0-3.6, upper 5.7-8.7, tower stage 10.9-13.4), the clock (centre 16.9,
 * r 1.05), the corbelled tops, the portico (5.6 wide, balcony at 4.6-5.6),
 * the frontispiece (8.2 wide, apex 13.75). Window bays on the sides and the
 * annex's openings are estimated from the oblique photos.
 *
 * Doubts: the annex's present colour (beige in 2010 photos) and the sides'
 * window count; the tower plans are drawn symmetric about the centre line
 * (the lidar has the second tower ~0.4 m further in).
 *
 * Night: windows glow; the clock faces are lit, so they are a white
 * `window-2` material and glow too.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, box, hipRoof, band, column } from './nyc-city-hall'
import { slabY, arch, rect, disc, rectRing, merlons, type Side } from './nola-st-patricks-church'

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), white = new Part(), clock = new Part()

  const MX = 14.2, MY0 = -9.2, MY1 = 6.8, EAVE = 11.2, RIDGE = 14.1, SC = 5.0
  const TW0 = 9.6, TW1 = 15.3, TY0 = -10.2, TY1 = -4.4

  // ---- Main block ----
  prism({ wall, win: null, roof: null, ring: rectRing(-MX, MY0, MX, MY1), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
  band(trim, rectRing(-MX, MY0, MX, MY1), EAVE - 0.6, EAVE, 0.35)
  band(trim, rectRing(-MX, MY0, MX, MY1), SC - 0.15, SC + 0.2, 0.12)
  band(trim, rectRing(-MX, MY0, MX, MY1), 0, 0.8, 0.1)
  hipRoof(roof, -MX - 0.3, MY0 - 0.3, MX + 0.3, MY1 + 0.3, EAVE, RIDGE - EAVE)

  /** A pair of round-arched windows with a shared surround. */
  const pair = (side: Side, c: number, t: number, z0: number, z1: number, n = 2) => {
    const w = 1.0, gap = 0.25, span = n * w + (n - 1) * gap
    arch(trim, side, c, t, span + 0.6, z0 - 0.25, z1 + 0.35, 0.05)
    for (let i = 0; i < n; i++) arch(win, side, c, t - span / 2 + w / 2 + i * (w + gap), w, z0, z1, 0.09)
  }
  // Front between the towers.
  for (const x of [-7.9, -4.3, 4.3, 7.9]) { pair('front', MY0, x, 1.0, 3.6); pair('front', MY0, x, 5.7, 8.7) }
  pair('front', MY0, 0, 5.7, 8.9, 3)
  // Sides and rear.
  for (const y of [-1.6, 2.4]) for (const [side, c] of [['west', -MX], ['east', MX]] as [Side, number][]) {
    pair(side, c, y, 1.0, 3.6); pair(side, c, y, 5.7, 8.7)
  }
  for (const x of [-11.0, -7.4, 7.4, 11.0]) { pair('rear', MY1, x, 1.0, 3.6); pair('rear', MY1, x, 5.7, 8.7) }

  // ---- Portico and balcony ----
  {
    const x0 = -2.8, x1 = 2.8, y0 = -11.4
    for (const x of [-2.45, -1.75, 1.75, 2.45]) column(trim, x, y0 + 0.4, 0.22, 0.8, 4.4, { n: 8 })
    block(trim, x0, y0, x1, MY0, 4.4, 5.0)               // entablature / balcony floor
    block(trim, x0, y0, x1, y0 + 0.25, 5.0, 5.9)         // balustrade (front)
    for (const x of [x0, x1]) block(trim, x - 0.0 + (x < 0 ? 0 : -0.25), y0, x + (x < 0 ? 0.25 : 0), MY0, 5.0, 5.9)
    for (const x of [x0 + 0.15, -0.9, 0.9, x1 - 0.15]) block(trim, x - 0.17, y0 - 0.02, x + 0.17, y0 + 0.3, 5.9, 6.5)   // finials
    block(white, x0 - 0.6, y0 - 1.6, x1 + 0.6, MY0, 0, 0.4)   // steps
    block(white, x0 - 0.3, y0 - 0.8, x1 + 0.3, MY0, 0.4, 0.8)
    arch(win, 'front', MY0, 0, 2.4, 0.8, 4.0, 0.06)        // the arched entrance
  }

  // ---- Frontispiece on the roof: "COURT HOUSE" panel under a pediment ----
  {
    const y0 = MY0 + 0.1, y1 = MY0 + 0.7
    slabY(wall, [[-4.1, EAVE - 0.1], [4.1, EAVE - 0.1], [4.1, 12.6], [3.0, 12.6], [0, 13.75], [-3.0, 12.6], [-4.1, 12.6]], y0, y1, [0, 12])
    slabY(trim, [[-3.3, 12.5], [3.3, 12.5], [0, 13.95]], y0 - 0.25, y0 + 0.1)
    rect(white, 'front', y0, 0, 4.4, 11.6, 12.3, 0.05)   // the lettered panel
    for (const x of [-4.1, 4.1]) block(trim, x - 0.25, y0 - 0.1, x + 0.25, y0 + 0.4, 12.6, 13.4)
  }

  // ---- Towers ----
  const tower = (x0: number, x1: number, top: number, clockTower: boolean) => {
    const ring = rectRing(x0, TY0, x1, TY1)
    const corb = top - 1.6   // corbel course under the crenellations
    prism({ wall, win: null, roof: wall, ring, z0: 0, z1: corb, facade: null, bevel: 0.15 })
    band(trim, ring, 0, 0.8, 0.12)
    band(trim, ring, SC - 0.15, SC + 0.2, 0.15)
    band(trim, ring, EAVE - 0.6, EAVE, 0.4)
    if (clockTower) band(trim, ring, 14.5, 14.9, 0.2)
    // the corbelled cornice stepping out, then the parapet and merlons
    band(trim, ring, corb - 0.9, corb - 0.5, 0.2)
    band(trim, ring, corb - 0.5, corb, 0.38)
    const outer = rectRing(x0 - 0.5, TY0 - 0.5, x1 + 0.5, TY1 + 0.5)
    prism({ wall: trim, win: null, roof: roof, ring: outer, z0: corb, z1: corb + 0.75, facade: null, bevel: 0.08 })
    // a low crenellated parapet: small merlons along the edge
    const z0 = corb + 0.75, z1 = top, t = 0.3, w = 0.42
    merlons(trim, [x0 - 0.35, TY0 - 0.35], [x1 + 0.35, TY0 - 0.35], z0, z1, 8, w, t)
    merlons(trim, [x0 - 0.35, TY1 + 0.35], [x1 + 0.35, TY1 + 0.35], z0, z1, 8, w, t)
    merlons(trim, [x0 - 0.35, TY0 + 0.3], [x0 - 0.35, TY1 - 0.3], z0, z1, 6, w, t)
    merlons(trim, [x1 + 0.35, TY0 + 0.3], [x1 + 0.35, TY1 - 0.3], z0, z1, 6, w, t)
    const xc = (x0 + x1) / 2, yc = (TY0 + TY1) / 2
    const outerSide: Side = x0 < 0 ? 'west' : 'east', outerX = x0 < 0 ? x0 : x1
    // windows: ground, upper, the stage over the main cornice
    for (const [z0w, z1w] of [[1.0, 3.6], [5.7, 8.7], [11.6, 13.9]]) {
      pair('front', TY0, xc, z0w, z1w)
      pair(outerSide, outerX, yc, z0w, z1w)
      if (z0w > 10) { pair('rear', TY1, xc, z0w, z1w); pair(x0 < 0 ? 'east' : 'west', x0 < 0 ? x1 : x0, yc, z0w, z1w) }
    }
    if (clockTower) {
      for (const [side, c, t] of [['front', TY0, xc], [outerSide, outerX, yc], ['rear', TY1, xc], ['east', x1, yc]] as [Side, number, number][]) {
        disc(trim, side, c, t, 16.9, 1.3, 0.06, 16)
        disc(clock, side, c, t, 16.9, 1.05, 0.1, 16)
        rect(roof, side, c, t, 0.12, 16.85, 17.75, 0.14)
        rect(roof, side, c, t + 0.3, 0.6, 16.83, 16.97, 0.14)
      }
    }
  }
  tower(-TW1, -TW0, 22.2, true)
  tower(TW0, TW1, 17.6, false)

  // ---- Rear annex (plain stucco, flat roof) ----
  box(white, roof, -5.0, MY1 - 0.2, 4.5, 15.0, 0, 8.6, 0.25)
  for (const y of [9.0, 12.5]) for (const z of [1.2, 5.2]) { rect(win, 'west', -5.0, y, 1.1, z, z + 1.9, 0.05); rect(win, 'east', 4.5, y, 1.1, z, z + 1.9, 0.05) }
  for (const x of [-2.5, 0, 2.5]) for (const z of [1.2, 5.2]) rect(win, 'rear', 15.0, x, 1.1, z, z + 1.9, 0.05)

  finishModel('Algiers Courthouse', 'nola-algiers-courthouse', [
    { part: wall, material: finish('courthouse-red', 0xb9776b) },
    { part: trim, material: finish('courthouse-trim', 0xc98e82) },
    { part: roof, material: finish('slate', 0x5f646a) },
    { part: win, material: PALETTE.window },
    { part: white, material: finish('stucco-light', 0xe6dfd2) },
    { part: clock, material: windowVariant(2, 0xf3efe6) },
  ], { bearing: 144.3, osm: 'way/339457542', height: 22.2 }, 5000)
}

if (import.meta.main) build()
