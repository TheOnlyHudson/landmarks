/**
 * Kremlin pavilions, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-pavilions.ts
 *
 * The small modern one-storey pavilions on the Kremlin's central squares:
 * one model for a group of unnamed buildings, none a landmark on its own.
 * - way/534437577: the grey stone pavilion with a glazed front before the
 *   Senate's south-east front (it shows in Miklashevsky's and Suicasmo's
 *   Senate photos).
 * - way/534095307-534095313: the pavilions in the garden on the site of
 *   the demolished Building 14, Ivanovskaya Square (Gennady Grachev's
 *   photo across the garden shows grey and glazed pavilions).
 * - way/535145289 (the museum shop) and way/1214065860: the pavilions
 *   between the Patriarch's Palace and the State Kremlin Palace.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the outlines, 37.6188106, 55.7520562.
 *
 * Evidence: OSM (API map call, 2026-11-18): outlines only, no heights
 * (building:levels 1 on way/1214065860). Photos (Wikimedia Commons,
 * EVIDENCE): Angel Miklashevsky, "Kremlin Senate 02.jpg", CC BY-SA 4.0;
 * Suicasmo, "Kremlin Senate 20190430.jpg", CC BY-SA 4.0; Gennady Grachev,
 * "Moscow Kremlin, site of recently demolished Block 14 building
 * (31356625280).jpg", CC BY 2.0.
 *
 * Estimated: every height. The pavilions are drawn 4.0 m, grey stone with
 * a glazed band, from the Senate photos (the pavilion before the Senate is
 * about a fifth of its 20 m eave). The Ivanovskaya pavilions are drawn
 * alike, though some are glass sheds with pitched roofs in Grachev's photo,
 * and the museum-shop pair is unphotographed and drawn the same way.
 *
 * Materials (two): grey stone, glass.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, ccw, edges, panel, save, walls, type OsmBuilding } from './moscow-senate'

const DATA = {"anchor":[37.6188106,55.7520562],"origin":[82.01,61.85],"buildings":[{"id":"way/534095307","outer":[[[59.72,46.39],[64.9,52.28],[68.44,49.17],[63.27,43.27]]],"inner":[],"parts":[{"id":"way/534095307","rings":[[[59.72,46.39],[64.9,52.28],[68.44,49.17],[63.27,43.27]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095308","outer":[[[44.0,-27.37],[41.0,-24.29],[45.08,-20.33],[44.37,-19.61],[47.29,-16.78],[50.99,-20.6]]],"inner":[],"parts":[{"id":"way/534095308","rings":[[[44.0,-27.37],[41.0,-24.29],[45.08,-20.33],[44.37,-19.61],[47.29,-16.78],[50.99,-20.6]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095309","outer":[[[39.82,13.32],[43.25,16.46],[46.95,12.42],[43.53,9.28]]],"inner":[],"parts":[{"id":"way/534095309","rings":[[[39.82,13.32],[43.25,16.46],[46.95,12.42],[43.53,9.28]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095310","outer":[[[53.48,27.05],[60.46,34.17],[63.6,31.08],[61.61,29.05],[64.21,26.51],[61.05,23.28],[58.45,25.84],[56.61,23.96]]],"inner":[],"parts":[{"id":"way/534095310","rings":[[[53.48,27.05],[60.46,34.17],[63.6,31.08],[61.61,29.05],[64.21,26.51],[61.05,23.28],[58.45,25.84],[56.61,23.96]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095311","outer":[[[19.58,34.08],[23.32,37.73],[26.8,34.16],[23.06,30.51]]],"inner":[],"parts":[{"id":"way/534095311","rings":[[[19.58,34.08],[23.32,37.73],[26.8,34.16],[23.06,30.51]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095312","outer":[[[127.81,39.09],[134.01,44.66],[137.08,41.25],[130.88,35.68]]],"inner":[],"parts":[{"id":"way/534095312","rings":[[[127.81,39.09],[134.01,44.66],[137.08,41.25],[130.88,35.68]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534095313","outer":[[[105.86,37.69],[112.17,44.95],[114.93,42.54],[108.62,35.29]]],"inner":[],"parts":[{"id":"way/534095313","rings":[[[105.86,37.69],[112.17,44.95],[114.93,42.54],[108.62,35.29]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/534437577","outer":[[[-20.18,30.61],[-18.15,32.5],[-16.57,33.97],[-14.69,31.95],[-11.78,34.66],[-7.75,30.32],[-14.28,24.26]]],"inner":[],"parts":[{"id":"way/534437577","rings":[[[-20.18,30.61],[-18.15,32.5],[-16.57,33.97],[-14.69,31.95],[-11.78,34.66],[-7.75,30.32],[-14.28,24.26]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/1214065860","outer":[[[-114.07,-62.41],[-105.18,-58.75],[-108.71,-50.19],[-117.6,-53.84]]],"inner":[],"parts":[{"id":"way/1214065860","rings":[[[-114.07,-62.41],[-105.18,-58.75],[-108.71,-50.19],[-117.6,-53.84]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/535145289","outer":[[[-137.96,-56.15],[-123.4,-59.26],[-124.24,-63.22],[-138.8,-60.09]]],"inner":[],"parts":[{"id":"way/535145289","rings":[[[-137.96,-56.15],[-123.4,-59.26],[-124.24,-63.22],[-138.8,-60.09]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]}]} as unknown as { anchor: [number, number]; buildings: OsmBuilding[] }

const stone = new Part(), glass = new Part()
for (const b of DATA.buildings) for (const p of b.parts) for (const r of p.rings) {
  // a grey stone box, a glazed band round it under a stone fascia
  const ring = ccw(r)
  walls(stone, ring, 0, 4.0)
  for (const e of edges(ring)) if (e.L > 1.2) panel(glass, e, 0.3, e.L - 0.3, 0.6, 3.2, 0.03)
  cap(stone, ring, [], 4.0)
}

await save('moscow-kremlin-pavilions.glb', 'Kremlin pavilions', [
  { part: stone, material: finish('kremlin-granite', 0xc4c0b8) },
  { part: glass, material: PALETTE.glass },
], { bearing: 0, elevation: 0, height: 4 })
