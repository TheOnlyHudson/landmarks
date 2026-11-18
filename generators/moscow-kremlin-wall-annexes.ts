/**
 * Brick annexes by the Kremlin wall's gate towers, Moscow Kremlin:
 * procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-annexes.ts
 *
 * Small red-brick buildings built against the inside of the Kremlin wall
 * at its gate towers: one model for a group of unnamed buildings, spread
 * along the wall. The wall and the towers themselves are another model's.
 * - relation/1360650 and relation/1360646: the guard buildings inside the
 *   Trinity Gate (16 m and 8 m, skillion roofs falling toward the wall,
 *   brick #ec8859; addr Manezhnaya 2A).
 * - relation/1360662: the annex inside the Nikolskaya Gate (8 m, skillion).
 * - relation/1360670: the one-storey annex by the Senate Tower.
 * - relation/1360694: the brick base by the Constantine and Helen Tower.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the five outlines, 37.6157047, 55.7527563.
 *
 * Evidence: OSM (API map call, 2026-11-18): outlines, heights, roof shapes
 * and directions, colour; the three without a height are drawn 3.3 m (one
 * storey; building:levels 1 on relation/1360670) and the Constantine and
 * Helen base 6 m (estimated: it reaches about half the wall's height in
 * the 1990s ITAR-TASS aerial "Kremlin birds eye view-3.jpg", CC BY 4.0).
 * Юрий Д.К., "Moscow - 2026 - Amusement Palace, Church of the Praise of
 * the Virgin Mary, view from Alexander Garden.jpg", CC BY 4.0, shows the
 * red-brick block inside the Trinity Gate over the wall. Windows (one per
 * 3.6 m bay and 3.8 m storey) are estimated.
 *
 * Materials (four): Kremlin brick, white trim, roof, window.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { KREMLIN, osmMass, osmWindows, save, type OsmBuilding } from './moscow-senate'

const DATA = {"anchor":[37.6157047,55.7527563],"origin":[-112.35,139.7],"buildings":[{"id":"relation/1360646","outer":[[[-94.03,-42.54],[-87.09,-44.41],[-86.38,-41.93],[-86.73,-41.83],[-86.37,-40.63],[-84.94,-41.04],[-85.07,-41.48],[-77.61,-43.64],[-77.49,-43.24],[-76.36,-43.56],[-75.99,-42.25],[-74.65,-37.4],[-85.68,-33.98],[-83.65,-27.88],[-88.65,-26.33]]],"inner":[],"parts":[{"id":"relation/1360646","rings":[[[-94.03,-42.54],[-87.09,-44.41],[-86.38,-41.93],[-86.73,-41.83],[-86.37,-40.63],[-84.94,-41.04],[-85.07,-41.48],[-77.61,-43.64],[-77.49,-43.24],[-76.36,-43.56],[-75.99,-42.25],[-74.65,-37.4],[-85.68,-33.98],[-83.65,-27.88],[-88.65,-26.33]]],"holes":[],"h":8.0,"min":0,"roof":"skillion","rh":3.0,"dir":288.4,"or":null,"mat":null,"col":null}]},{"id":"relation/1360650","outer":[[[-52.86,-14.64],[-76.49,-6.09],[-83.65,-27.88],[-85.68,-33.98],[-74.65,-37.4],[-75.99,-42.25],[-74.12,-42.79],[-74.2,-43.09],[-64.73,-45.83],[-64.37,-44.58],[-63.36,-44.87],[-58.43,-29.61],[-55.61,-22.01]]],"inner":[],"parts":[{"id":"relation/1360650","rings":[[[-52.86,-14.64],[-76.49,-6.09],[-83.65,-27.88],[-85.68,-33.98],[-74.65,-37.4],[-75.99,-42.25],[-74.12,-42.79],[-74.2,-43.09],[-64.73,-45.83],[-64.37,-44.58],[-63.36,-44.87],[-58.43,-29.61],[-55.61,-22.01]]],"holes":[],"h":16.0,"min":0,"roof":"skillion","rh":7.0,"dir":288.4,"or":null,"mat":"brick","col":"#ec8859"}]},{"id":"relation/1360662","outer":[[[116.2,199.2],[120.72,194.65],[127.48,201.46],[127.26,201.68],[128.52,202.95],[129.38,202.1],[135.71,208.5],[135.45,208.74],[130.51,213.64]]],"inner":[],"parts":[{"id":"relation/1360662","rings":[[[116.2,199.2],[120.72,194.65],[127.48,201.46],[127.26,201.68],[128.52,202.95],[129.38,202.1],[135.71,208.5],[135.45,208.74],[130.51,213.64]]],"holes":[],"h":8.0,"min":0,"roof":"skillion","rh":2.0,"dir":314.6,"or":null,"mat":"brick","col":"#ec8859"}]},{"id":"relation/1360670","outer":[[[241.39,77.41],[235.15,83.16],[235.86,83.91],[219.84,98.86],[217.39,96.21],[234.67,80.27],[233.51,79.01],[238.57,74.34]]],"inner":[],"parts":[{"id":"relation/1360670","rings":[[[241.39,77.41],[235.15,83.16],[235.86,83.91],[219.84,98.86],[217.39,96.21],[234.67,80.27],[233.51,79.01],[238.57,74.34]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"relation/1360694","outer":[[[409.92,-184.61],[404.67,-172.75],[400.11,-174.76],[405.41,-186.62]]],"inner":[],"parts":[{"id":"relation/1360694","rings":[[[409.92,-184.61],[404.67,-172.75],[400.11,-174.76],[405.41,-186.62]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":"brick","col":"#ec8859"}]}]} as unknown as { anchor: [number, number]; buildings: OsmBuilding[] }

const brick = new Part(), white = new Part(), roof = new Part(), win = new Part()
for (const b of DATA.buildings) {
  if (b.id === 'relation/1360694') b.parts.forEach((p) => { p.h = 6 })
  for (const p of b.parts) osmMass({ wall: brick, roof, trim: white }, p)
  osmWindows(win, b, { sill0: 1.4, wh: 1.8, w: 1.2, headroom: 0.6 })
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.7)
await save('moscow-kremlin-wall-annexes.glb', 'Brick annexes by the Kremlin gate towers', [
  { part: brick, material: { ...finish('kremlin-brick', 0xbd5a46), floodlight: lit } },
  { part: white, material: { ...PALETTE.trim, color: KREMLIN.white, floodlight: lit } },
  { part: roof, material: finish('kremlin-roof', KREMLIN.roof) },
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, height: 16 })
