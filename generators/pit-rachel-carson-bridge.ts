/**
 * Rachel Carson Bridge (Ninth Street Bridge, 1927; Allegheny County
 * Department of Public Works; American Bridge Co.) — procedural, CC0-1.0,
 * no textures.
 * bun generators/pit-rachel-carson-bridge.ts
 *
 * The third of the Three Sisters, built with the shared geometry in
 * pit-roberto-clemente-bridge.ts (`buildSister`; its header describes the
 * form, the frame, the estimates and the colours). Only this bridge's own
 * measurements are here. Writes models/pit-rachel-carson-bridge.glb and
 * .detail.glb (detailZoom 16).
 *
 * How it differs from the Clemente, all from lidar: main span 132 m
 * (Clemente 131, Warhol 135); towers 32.5 m; a slightly steeper deck (4.3 %
 * against 4.2 %); the chain hangs a little higher (16.1 m at midspan); a bearing
 * 4.7° further west than its sisters (339.3°), as the Ninth Street grid
 * turns; kiosk lanterns at 13.65 m.
 *
 * Frame: x across (+x upstream), y along toward the North Shore, z up,
 * metres; origin midway between the towers, on the water; bearing 339.295°.
 *
 * Roadway heights built to (lidar along OSM way/55178637, measured every
 * 4 m in November 2026, fitted within 0.08 m), in lidar heights above the
 * lidar water: road(y) = 13.85 − 8.96e-4·y² for |y| ≤ 24, then 13.33 −
 * 0.043·(|y| − 24). The shared generator adds `DATUM` (0.53 m, the lidar
 * water above the map's river), so in the model 14.38 m at midspan,
 * 12.1 m at the towers (y = ±66), 9.3 m at the end piers, 8.65/8.45 m at the
 * abutments; NAVD88 230.6 m at the crest, 224.5 m at the downtown end and
 * 224.9 m 4 m in from the North Shore end. Before November 2026 the crest
 * was put 3 m south of midspan at 13.95 m with a 4.2 % grade, which read
 * 0.3 m high over the whole south side span, and the model stood 0.53 m
 * low in the map; see the fix in the Clemente header. The road lands
 * about 7 m past the downtown outline end (Fort Duquesne Boulevard) and
 * 6-10 m past the North Shore one (Anderson Street, with steps down beside
 * the abutment, way/545394693); the model ends at the abutment faces.
 * OSM `ele` for the roadway: ~/landmarks-scratch/osm-ele/pit-rachel-
 * carson-bridge.md.
 *
 * Sources:
 * - OSM: outline way/642309568 (man_made=bridge, bridge:structure=
 *   suspension, layer 1; wikidata Q7279183), x ±10, y = −152 to +149.8;
 *   piers way/824705045 (south end), 824705044 and 824705043 (towers),
 *   824705042 (north end), bridge:support=pier. No building or
 *   building:part inside the outline.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (2019), 0.5 m grids (the anchor
 *   grid's lowest return is 216.51 m; heights here are taken above the
 *   river's 216.72 m, as on the sisters): towers at ±66, leg tops 32.5 m;
 *   chain top 16.1 m at midspan; side chains 19.95/19.3 m at 24 m from the
 *   towers and 11.75/11.35 m at 48 m; end piers at y = −130.7 and +130.2;
 *   kiosk lanterns 13.65 m.
 * - Published (Wikipedia "Rachel Carson Bridge"): opened 1927, main span
 *   430 ft (131 m), self-anchored eyebar-chain suspension; renamed 2006.
 * - Photos (Wikimedia Commons): "Rachel Carson Bridge from the north",
 *   "from the south" and "from North Shore Trail, 2010-06-12" (Sage Ross,
 *   CC BY-SA 3.0; portal, elevation, piers); "Entrance to the Rachel Carson
 *   Bridge, 2024-06-02" (Cbaile19, CC0; the ashlar kiosk with its cap and
 *   lantern); "Rachel Carson Bridge, 2023-06-10, 02" (Cbaile19, CC0).
 * - Night: "Rachel Carson Bridge Lights (32657554172)" (Nick Amoscato,
 *   2017, CC BY 2.0; LED strips on the suspenders and tower legs) and
 *   "Pittsburgh, City of the bridges at night (6369657701)" (daveynin,
 *   2011, CC BY 2.0; lamps along the sidewalks, the steel lit gold). The
 *   strips are not drawn; the pins, lamps and floodlit towers are as on
 *   the Clemente.
 * - Map terrain under the end piers and abutments (Mapterhorn above its
 *   own river reading, 216.19 m), `GROUND`.
 *
 * Doubts: whether the 2017 LED installation is still lit; the 0.2 m datum
 * difference between the two lidar grids over this bridge.
 */
import { buildSister, type SisterSpec } from './pit-roberto-clemente-bridge'

const GROUND = {"south":{"y0":-176.0,"x0":-16.0,"step":4.0,"z":[[7.6,7.7,7.7,7.7,7.8,7.7,7.6,7.5,7.3],[7.8,7.8,7.9,7.9,7.9,7.8,7.7,7.6,7.4],[7.9,7.9,7.9,8.0,8.0,8.0,7.9,7.7,7.4],[8.1,8.2,8.1,8.1,8.1,8.1,8.0,7.8,7.8],[8.3,8.3,8.4,8.3,8.3,8.2,8.1,8.2,8.2],[8.1,8.3,8.5,8.3,8.2,8.1,8.3,8.4,8.4],[3.1,3.4,3.4,3.6,3.8,4.0,4.0,4.0,4.4],[2.2,2.2,2.4,2.5,2.6,2.6,2.4,2.5,2.6],[2.1,2.1,2.2,2.3,2.4,2.4,2.4,2.5,2.6],[2.0,2.0,2.0,2.0,2.0,2.1,2.3,2.5,2.6],[2.0,2.0,1.5,1.0,1.0,1.6,2.3,2.4,2.4],[1.7,0.5,0.3,0.1,0.1,0.2,0.4,0.4,1.8],[0.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1]]},"north":{"y0":112.0,"x0":-16.0,"step":4.0,"z":[[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[1.4,1.4,0.8,0.4,0.3,0.3,0.4,0.2,0.1],[2.3,2.3,1.7,1.3,1.0,1.3,2.0,2.3,2.1],[2.6,2.6,2.3,2.0,1.7,2.0,2.7,2.9,2.9],[3.6,3.4,2.9,2.7,2.5,2.6,3.1,3.3,3.0],[3.9,3.9,3.4,3.3,3.1,3.1,3.3,3.3,3.1],[3.8,3.8,3.7,3.5,3.3,3.1,3.1,3.1,3.1],[4.3,4.0,3.7,3.5,3.3,3.2,3.1,3.2,3.1],[4.7,4.1,3.8,3.6,3.5,3.5,3.9,4.1,4.1],[5.2,4.6,4.7,4.8,4.9,4.9,5.0,5.2,5.3],[5.6,5.7,6.6,6.7,6.7,6.7,6.7,6.5,6.6],[5.9,6.4,8.2,8.2,8.3,8.2,8.3,8.2,7.1],[6.3,6.7,8.3,8.2,8.2,8.1,8.3,8.3,7.4],[7.4,7.6,8.2,8.0,8.0,7.9,8.1,8.1,7.9],[7.6,7.6,8.0,7.8,7.9,7.8,7.9,7.9,7.8],[7.6,7.7,7.8,7.7,7.7,7.6,7.7,7.8,7.6],[7.6,7.6,7.6,7.5,7.5,7.5,7.4,7.5,7.3]]}}

export const CARSON: SisterSpec = {
  id: 'pit-rachel-carson-bridge',
  name: 'Rachel Carson Bridge',
  bearing: 339.295,
  T: 66,
  endPier: [130.7, 130.2],
  ends: [152, 149.8],
  top: 32.5,
  low: 16.1,
  side: [[19.95, 11.75], [19.3, 11.35]],
  road: { R0: 13.85, yc: 0, Lc: 24, g: 0.043 },
  kioskTop: 13.65,
  ground: GROUND,
}

if (import.meta.main) await buildSister(CARSON)
