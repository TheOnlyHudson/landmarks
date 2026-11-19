/**
 * Andy Warhol Bridge (Seventh Street Bridge, 1926; Allegheny County
 * Department of Public Works; American Bridge Co.) — procedural, CC0-1.0,
 * no textures.
 * bun generators/pit-andy-warhol-bridge.ts
 *
 * The second of the Three Sisters, built with the shared geometry in
 * pit-roberto-clemente-bridge.ts (`buildSister`; its header describes the
 * form, the frame, the estimates and the colours). Only this bridge's own
 * measurements are here. Writes models/pit-andy-warhol-bridge.glb and
 * .detail.glb (detailZoom 16).
 *
 * How it differs from the Clemente, all from lidar: the longest main span
 * of the three (135 m against 131 m) and tallest towers (32.85 m against
 * 32.35 m); a longer north approach (33 m from the end pier to the North
 * Shore abutment, against 20 m), so the deck runs on down to the street there
 * (8.25 m in the model, 224.3 m NAVD88);
 * kiosk lanterns at 13.5 m (4.5 m above the roadway, against 8 m on the
 * Clemente).
 *
 * Frame: x across (+x upstream), y along toward the North Shore, z up,
 * metres; origin midway between the towers, on the water; bearing 344.715°
 * (the line through the two chain planes' centres in lidar).
 *
 * Roadway heights built to (lidar along OSM way/28388921, measured every
 * 4 m in November 2026, fitted within 0.09 m), in lidar heights above the
 * lidar water: road(y) = 14.0 − 8.75e-4·y² for |y| ≤ 24, then 13.5 −
 * 0.042·(|y| − 24). The shared generator adds `DATUM` (0.53 m, the lidar
 * water above the map's river), so in the model 14.53 m at midspan,
 * 12.2 m at the towers (y = ±67.5), 9.45 m at the end piers, 8.47 m at the
 * south abutment (y = −156.4) and 8.25 m at the north one (+167.6, where
 * the deck follows the map's terrain); NAVD88 230.7 m at midspan, 224.7 m
 * at the south end, 224.3 m at the north end, where the road lands on
 * Sandusky Street at the outline's end (lidar bare earth 224.30 m). The
 * crest was 14.05 m before (0.05 m high), and the whole model stood
 * 0.53 m low in the map; see the November 2026 fix in the Clemente header.
 * OSM `ele` for the roadway: ~/landmarks-scratch/osm-ele/pit-andy-warhol-
 * bridge.md.
 *
 * Sources:
 * - OSM: outline way/642309567 (man_made=bridge, bridge:structure=
 *   suspension, layer 1; wikidata Q4761451), x ±10, y = −156.4 to +167.6;
 *   piers way/824705035 (south end), 824705036 and 1478475436 (towers),
 *   824705041 (north end), bridge:support=pier. No building or
 *   building:part inside the outline.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (2019), 0.5 m grid over the whole
 *   bridge, heights above the water (216.72 m NAVD88): towers at ±67.5,
 *   leg tops 32.85 m, portal 31.6 m; chain top 15.9 m at midspan; side
 *   chains 19.8/19.45 m at 24.5 m from the towers and 11.65/11.3 m at
 *   48.5 m; end piers at y = −133.5 and +134.7; kiosk lanterns 13.5 m.
 * - Published (Wikipedia "Andy Warhol Bridge"): opened 1926, main span
 *   442 ft (135 m), self-anchored eyebar-chain suspension; renamed 2005.
 * - Photos (Wikimedia Commons): "Andy Warhol Bridge, Pittsburgh,
 *   2024-06-02" (Cbaile19, CC0; the whole downstream elevation, pale ashlar
 *   piers, kiosks); "Andy Warhol Bridge - 2" (APK, CC BY-SA 4.0; upstream
 *   elevation); "Andy Warhol Bridge and Alcoa Corporate Center, 2024-06-08"
 *   (Cbaile19, CC0) and "Andy Warhol Bridge, 2023-06-10, 01" (Cbaile19,
 *   CC0): towers and colour.
 * - Night: "Andy Warhol (Seventh Street) Bridge at night, 2024-04-02"
 *   (Cbaile19, CC0): towers floodlit, violet-blue lights at the chain pins
 *   and on the suspenders and legs, white sidewalk lamps. The pin lights
 *   are drawn as `lamp` beads, as on the Clemente; the violet strips on
 *   the legs and suspenders are not drawn.
 * - Map terrain under the end piers and abutments (Mapterhorn above its
 *   own river reading, 216.19 m), `GROUND`.
 *
 * Doubts: the Warhol's crest sits within a metre of the anchor; OSM maps
 * no pier between the north end pier and the abutment and none is drawn:
 * the girders span the 33 m to the abutment unbroken (no photo here shows
 * that span from below).
 */
import { buildSister, type SisterSpec } from './pit-roberto-clemente-bridge'

const GROUND = {"south":{"y0":-176.0,"x0":-16.0,"step":4.0,"z":[[7.7,7.7,7.7,7.7,7.7,7.7,7.6,7.6,7.5],[7.8,7.8,7.8,7.8,7.8,7.8,7.8,7.7,7.7],[8.2,8.0,7.9,7.9,7.9,7.9,7.9,7.9,7.9],[8.2,8.2,8.2,8.1,8.1,8.1,8.0,8.1,8.2],[8.1,8.3,8.3,8.3,8.2,8.2,8.3,8.3,8.2],[2.9,3.6,4.4,4.9,5.2,5.6,5.9,6.2,7.8],[2.2,2.2,2.2,2.2,2.3,2.3,2.3,2.4,2.8],[2.1,2.1,2.1,2.1,2.1,2.2,2.2,2.2,2.2],[2.0,2.0,2.0,2.0,2.1,2.1,2.1,2.1,2.1],[1.7,1.8,1.8,1.9,1.9,1.8,1.8,2.0,2.0],[1.3,1.4,1.4,1.3,1.3,1.3,1.4,1.6,1.7],[1.0,1.1,1.0,0.8,0.7,0.8,1.1,1.3,1.3],[0.1,0.2,0.3,0.2,0.2,0.3,0.7,1.0,1.1],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.1],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]]},"north":{"y0":112.0,"x0":-16.0,"step":4.0,"z":[[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[2.0,1.6,1.2,0.8,0.6,0.6,0.7,1.1,1.0],[3.4,3.1,2.6,1.9,1.9,1.8,1.8,2.3,2.3],[3.7,3.5,3.1,3.0,2.9,2.9,2.8,2.8,2.7],[3.9,3.8,3.6,3.5,3.4,3.3,3.1,3.2,3.6],[4.3,4.2,4.1,4.0,3.9,3.8,3.7,3.7,3.9],[4.6,4.3,4.2,4.2,4.1,4.0,3.9,3.9,3.9],[4.8,4.6,4.4,4.3,4.2,4.1,4.0,4.1,4.2],[5.9,5.5,4.8,4.8,4.8,4.8,4.7,5.0,5.8],[6.2,5.7,5.3,5.3,5.3,5.4,5.4,5.7,6.4],[5.1,5.1,5.6,5.6,5.7,5.7,5.7,6.1,6.6],[4.5,4.4,5.8,6.3,6.4,6.4,6.4,6.4,6.8],[4.3,4.5,6.3,7.1,7.4,7.3,7.1,6.8,7.0],[4.5,5.0,8.0,8.0,8.0,8.1,8.1,7.9,7.3],[4.9,5.5,8.0,7.9,7.9,7.9,8.1,8.0,7.5],[5.4,5.7,7.9,7.7,7.8,7.7,7.9,7.9,7.7]]}}

export const WARHOL: SisterSpec = {
  id: 'pit-andy-warhol-bridge',
  name: 'Andy Warhol Bridge',
  bearing: 344.715,
  T: 67.5,
  endPier: [133.5, 134.7],
  ends: [156.4, 167.6],
  top: 32.85,
  low: 15.9,
  side: [[19.8, 11.65], [19.45, 11.3]],
  road: { R0: 14.0, yc: 0, Lc: 24, g: 0.042 },
  kioskTop: 13.5,
  ground: GROUND,
}

if (import.meta.main) await buildSister(WARHOL)
