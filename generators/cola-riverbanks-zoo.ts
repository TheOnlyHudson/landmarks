/**
 * Riverbanks Zoo and Garden, Columbia: the Susan F. Boyd Aquarium & Reptile
 * Conservation Center (the ARC), the zoo's largest exhibit building, on the
 * main loop south of the entrance plaza.
 *
 * Why this building: a zoo is not one building, and the user asked for the
 * zoo. Of its OSM buildings (relation/5776239 holds about eighty, all
 * untagged for height), the ARC is the biggest and the one the zoo names as
 * its signature indoor exhibit; the entrance is a plain ticket kiosk and a
 * sign (Commons, 2004), with nothing to model. No licensed photo of the
 * ARC's outside was found (Commons, Openverse; Mapillary needs a token this
 * host lacks), so this is a PLAIN version from OSM, lidar and NAIP only,
 * and is flagged as such.
 *
 * Frame: north-up (bearing 0); origin at the outline's centroid.
 *
 * Sources
 * - OSM way/561364255 (building=commercial, tourism=aquarium): the outline.
 * - USGS 3DEP lidar SC_SavannahPeeDee_2_2019 (2019), 1 m grid: the west
 *   part's flat roof about 5.9 m over y = 0, the east exhibit hall's
 *   8.5 m, the glazed conservatory on the south rising to about 9 m; ground
 *   about 2 m (south) to 3.8 m (north) above the lowest point.
 * - USGS NAIP orthophoto (public domain): pale grey flat roofs with rooftop
 *   plant, the dark glass roof of the conservatory on the south side.
 * - Commons "Riverbanks Zoo -South Carolina -USA-29July2004.jpg" (Carlo
 *   Giovannetti, CC BY-SA 3.0)
 *   shows only the entrance kiosk and sign, which decided against the
 *   entrance. https://commons.wikimedia.org/wiki/File:Riverbanks_Zoo_-South_Carolina_-USA-29July2004.jpg
 *
 * Numbers
 * - Measured: plan (OSM); roof heights (lidar).
 * - Invented: the walls' colour (a warm tan render, not photographed
 *   here) and the conservatory's hipped glass form. No doors or windows
 *   are drawn, since no evidence shows where they are.
 * - Doubts: everything about the elevations. Treat the model as massing.
 *
 * Night: nothing glows; the conservatory's glass stays dark.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, grow, hip, panel, rect } from './dc-white-house'
import { pslab, saveModel, type XY } from './dc-nga-west'

const RENDER = finish('arc-render', 0xd9c7a8)
const ROOF = finish('arc-roof', 0xc4c6c3)

const OUTLINE: XY[] = [[2.8, -31.0], [13.2, -11.3], [25.4, -17.7], [33.5, -2.5], [10.7, 9.5], [5.5, 27.2], [-2.1, 24.9], [-2.9, 27.6],
  [-15.7, 23.9], [-16.5, 26.7], [-20.7, 25.5], [-23.8, 24.6], [-22.3, 19.4], [-25.0, 18.6], [-20.7, 4.0], [-14.8, -16.1], [-17.2, -20.5]]

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), glass = new Part()

  // the low body over the whole outline, with a pale parapet
  pslab(wall, OUTLINE, 0, 5.3, 0, false)
  pslab(trim, OUTLINE, 5.3, 5.9, 0.2, roof)

  // the taller exhibit hall (lidar 8.5 m)
  const hall = rect(0, 15, -9, 15)
  cbox(wall, hall, 5.9, 7.9, { top: false })
  cbox(trim, grow(hall, 0.15), 7.9, 8.5, { b: 0.15, top: roof })

  // the conservatory on the south: glass walls under a hipped glass roof
  const cons = rect(-7, 5, -25, -16)
  cbox(trim, cons, 0, 5.9, { top: false })
  for (const s of ['s', 'e', 'w'] as const) {
    const at = s === 's' ? cons.y0 : s === 'e' ? cons.x1 : cons.x0
    const [a0, a1] = s === 's' ? [cons.x0 + 0.4, cons.x1 - 0.4] : [cons.y0 + 0.4, cons.y1 - 0.4]
    panel(glass, s, at, a0, a1, 0.6, 5.5, 0.05)
  }
  hip(glass, grow(cons, 0.2), 5.9, 9.2, 4.0)

  return [
    { part: wall, material: RENDER },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: ROOF },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) {
  await saveModel('cola-riverbanks-zoo', 'Riverbanks Zoo — Aquarium & Reptile Conservation Center', build(), { source: 'generators/cola-riverbanks-zoo.ts' }, 5000)
}
