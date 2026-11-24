/**
 * Brooklyn Army Terminal, Buildings A and B, Sunset Park: procedural,
 * CC0-1.0.
 * bun generators/nyc-brooklyn-army-terminal.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 38.1° (the
 * long sides of both warehouses and of the atrium in OSM). The origin is
 * the centre of the two buildings' combined extents in that frame; y = 0
 * is the ground on the waterfront (west) side, 3.5 m below the street
 * between the buildings (lidar 2.7 m and 6.2 m), so the street side sinks
 * into the map's terrain, which rises the same way.
 *
 * The buildings. Cass Gilbert's 1918–19 Army supply base: two enormous
 * eight-storey reinforced-concrete warehouses side by side, Building A on
 * the waterfront and Building B inland, joined by enclosed bridges across
 * the rail street between them. Plain cream concrete walls in a regular
 * grid of big industrial windows, stair and elevator towers rising above
 * the roofs. Building B is hollowed by a 200 m long atrium under a gabled
 * glass skylight, where freight trains ran in between staggered concrete
 * loading balconies (Wikipedia, "Brooklyn Army Terminal"; NYC LPC
 * designation, 1983/2010).
 *
 * Numbers (lidar: USGS NY_NewYorkCity, 2017; heights above the waterfront
 * ground, 2.7 m above the box's lowest return):
 *   plans: OSM way/245576807 (A, 61.5 x 310 m) and relation/10061916 (B,
 *     96 x 300 m; its inner way is the atrium, 21 x 222 m).
 *   A roof 32.3 m, B roof 34.3 m: measured. The transverse penthouse
 *     strips on both roofs (~3 m higher), the elevator towers to 48 m and
 *     the raised strip on B's west side to 42 m: measured, simplified.
 *   atrium skylight: a glass gable over the atrium, eaves 37.5 m, ridge
 *     42.3 m: measured (the lidar hits the skylight's steel at 40–45 m).
 *   bridges: three, 11 m wide, from OSM ways 245576842/43/47; top 16.3 m
 *     measured (lidar 19.0), 6 m deep: estimated.
 *   storeys ~3.9 m; windows grouped in two tall panels per 6 m bay (three to four storeys each):
 *     estimated from "Brooklyn Army Terminal water side jeh".
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Brooklyn Army Terminal water side jeh", Jim.henderson, public domain
 *     (Building A from the pier, west)
 *   "Brooklyn Army Terminal as seen from ferry terminal, Sunset Park",
 *     Andre Carrotflower, CC BY-SA 4.0
 *   "Brooklyn Army Terminal November 2022", Kidfly182, CC BY-SA 4.0
 *     (a corner tower with the sign)
 *   "Brooklyn Army Terminal November 2024", Kidfly182, CC BY 4.0
 *   "Atrium, Brooklyn Army Terminal, Oct 2012", Atomox, CC BY-SA 3.0
 *   "Brooklyn Army Terminal Atrium Building B2", Timothy Vogel, CC BY 2.0
 *   "Brooklyn Army Terminal from south end", Ian Bartlett, CC BY-SA 4.0
 *     (the atrium and its skylight)
 *   USGS NAIP orthophoto (public domain): the roofs and the skylight.
 * Look-only: none.
 *
 * The atrium's balconies and tracks are inside and can't be seen from the
 * map; the skylight is drawn as an opaque `glass` gable so the atrium reads
 * from above. Night: the windows glow; the skylight stays dark.
 *
 * Doubts: the many roof structures are simplified to a few strips and
 * towers; the bridges' depth; the low docks along B's east side are left
 * to the map.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, prism, type Facade, type XY } from './nyc-570-lexington'

const concrete = new Part(), win = new Part(), roof = new Part(), glass = new Part()
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

const A = { x0: -99, x1: -37.5, y0: -155, y1: 155, top: 32.3 }
const B = { x0: 4, x1: 100, y0: -145, y1: 155, top: 34.3 }
// Tall panels spanning three or four storeys per 6 m bay, cream piers between
// and a spandrel band between the two groups (lead review: no dot grid).
const facade: Facade = { bay: 6.0, ratio: 0.6, floor: 3.9, group: 3, spandrel: 2.4, sill: 1.8, head: 2.0, ground: 4.5, minLength: 5, margin: 1.5 }

massing({
  wall: concrete, win, roof, facade, bevel: 0.5,
  boxes: [
    // Building A, its penthouse strips and elevator towers
    [A.x0, A.y0, A.x1, A.y1, A.top],
    [A.x0 + 3, 96, A.x1 - 3, 102, A.top + 3],
    [A.x0 + 3, -3, A.x1 - 3, 3, A.top + 3],
    [A.x0 + 3, -102, A.x1 - 3, -96, A.top + 3],
    [-85, 53, -77, 61, 48],
    [-85, -49, -77, -41, 48],
    // Building B, its penthouse strips, the raised west strip and towers
    [B.x0, B.y0, B.x1, B.y1, B.top],
    [B.x0 + 3, -144, B.x1 - 3, -138, B.top + 3.5],
    [B.x0 + 3, 96, 38, 102, B.top + 4],
    [64, 96, B.x1 - 3, 102, B.top + 4],
    [64, 4, B.x1 - 3, 10, B.top + 4],
    [64, -102, B.x1 - 3, -96, B.top + 4],
    [15, 24, 33, 72, 42.3],
    [20, -49, 28, -41, 48.3],
  ],
})

// The atrium skylight: a glass gable on low clerestory walls over the atrium.
{
  const x0 = 40, x1 = 62, y0 = -108, y1 = 114, eave = 37.5, ridge = 42.3, xm = (x0 + x1) / 2
  prism({ wall: concrete, win: null, roof: null, ring: rect(x0, y0, x1, y1), z0: B.top - 0.2, z1: eave, facade: null, bevel: 0.2 })
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  glass.quad(P(x0, y0, eave), P(xm, y0, ridge), P(xm, y1, ridge), P(x0, y1, eave))
  glass.quad(P(xm, y0, ridge), P(x1, y0, eave), P(x1, y1, eave), P(xm, y1, ridge))
  glass.tri(P(x0, y0, eave), P(x1, y0, eave), P(xm, y0, ridge))
  glass.tri(P(x1, y1, eave), P(x0, y1, eave), P(xm, y1, ridge))
  // the skylight's main ribs, every 12 m, so the long glass roof reads as framed
  for (let y = y0 + 12; y < y1 - 6; y += 12) {
    concrete.quad(P(x0, y - 0.3, eave + 0.05), P(xm, y - 0.3, ridge + 0.05), P(xm, y + 0.3, ridge + 0.05), P(x0, y + 0.3, eave + 0.05))
    concrete.quad(P(xm, y - 0.3, ridge + 0.05), P(x1, y - 0.3, eave + 0.05), P(x1, y + 0.3, eave + 0.05), P(xm, y + 0.3, ridge + 0.05))
  }
}

// The three enclosed bridges across the rail street.
const bridgeFacade: Facade = { bay: 4, ratio: 0.6, floor: 3, group: 1, spandrel: 0, sill: 1.2, head: 1.2, minLength: 8, margin: 1 }
for (const [y0, y1] of [[-88.3, -77.2], [9.1, 20.4], [106.4, 117.9]])
  prism({ wall: concrete, win, roof, ring: rect(A.x1 - 0.5, y0, B.x0 + 0.5, y1), z0: 10.3, z1: 16.3, facade: bridgeFacade, bevel: 0.3 })

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: concrete, material: finish('bat-concrete', 0xe6dcc6) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
]
finishModel('Brooklyn Army Terminal', 'nyc-brooklyn-army-terminal', parts, {
  bearing: 38.1, elevation: 0, height: 48.3, osm: 'way/245576807 relation/10061916',
})
