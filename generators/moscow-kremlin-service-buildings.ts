/**
 * Kremlin service buildings by the Borovitskaya Tower, Moscow Kremlin:
 * procedural, CC0-1.0.
 * bun generators/moscow-kremlin-service-buildings.ts
 *
 * The low service buildings in the Kremlin's south-west corner, between
 * the Borovitskaya and Vodovzvodnaya towers and the river wall, and two
 * guard booths by the Armoury: one model for a group of small, unnamed
 * buildings.
 * - way/247986327: the stable (building=stable), a long one-storey block
 *   by the river wall, 5 m with a 2 m gabled roof; OSM building:colour
 *   #eac18f, roof:colour #1a5947.
 * - relation/3341858: a low block of three parts (4-7 m), building:colour
 *   #b1ccbd (a pale grey-green), brick, roof #1a5947.
 * - relation/3341881: a one-storey brick service building (4 m, flat
 *   roof, building:colour #ec8859).
 * - way/1204092263, relation/16446014, way/247986321, way/248468851: sheds
 *   (2-3.3 m); way/248844324 and way/248844325: booths (3 m) by the
 *   Armoury.
 *
 * Built with the OSM-mass kit in moscow-senate.ts: each part to its OSM
 * height and roof shape. relation/3341930, a part tagged 8.5-8.8 m over
 * the 4 m brick building, is left out: a slab floating 4.5 m over the roof
 * matches nothing in the photos, and it is listed in replaces so the map
 * doesn't draw it either.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the outlines, 37.6142468, 55.7486495.
 *
 * Evidence: OSM (API map call, 2026-11-18) for every outline, height and
 * colour; ITAR-TASS, "Kremlin birds eye view-1.jpg", CC BY 4.0 (from the
 * south-west, 1990s) shows the pale block with its grey roof among the
 * trees inside the river wall. No licensed photo shows the stable or the
 * sheds; they are drawn plain from OSM's tags. Windows (one row, 3.6 m
 * bays) are estimated.
 *
 * Materials (five): ochre (the stable, the sheds), the pale grey-green,
 * Kremlin brick, roof, window.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { KREMLIN, osmMass, osmWindows, save, type OsmBuilding } from './moscow-senate'

const DATA = {"anchor":[37.6142468,55.7486495],"origin":[-203.58,-316.96],"buildings":[{"id":"relation/3341858","outer":[[[30.86,34.07],[27.3,43.08],[-5.46,30.11],[-2.94,23.74],[-10.21,24.09],[-10.47,19.26],[-0.96,18.75],[-0.15,18.86],[29.19,30.47],[31.87,31.52]]],"inner":[],"parts":[{"id":"relation/3890234","rings":[[[-1.9,21.1],[-0.96,18.75],[-0.15,18.86],[29.19,30.47],[31.87,31.52],[30.86,34.07]]],"holes":[],"h":5.0,"min":0,"roof":"skillion","rh":2.0,"dir":157.5,"or":null,"mat":"brick","col":"#b1ccbd"},{"id":"relation/3890235","rings":[[[-0.96,18.75],[-10.47,19.26],[-10.21,24.09],[-2.94,23.74],[-1.9,21.1]]],"holes":[],"h":4.0,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":"brick","col":"#b1ccbd"},{"id":"relation/3890236","rings":[[[-1.9,21.1],[30.86,34.07],[27.3,43.08],[-5.46,30.11],[-2.94,23.74]]],"holes":[],"h":7.0,"min":0,"roof":"skillion","rh":1.0,"dir":157.5,"or":null,"mat":"brick","col":"#b1ccbd"}]},{"id":"relation/3341881","outer":[[[-36.77,-27.82],[-45.48,-21.35],[-32.25,-3.57],[-23.55,-10.04],[-25.51,-12.68],[-28.62,-16.87],[-31.74,-21.06],[-34.86,-25.25]]],"inner":[],"parts":[{"id":"relation/3341881","rings":[[[-36.77,-27.82],[-45.48,-21.35],[-32.25,-3.57],[-23.55,-10.04],[-25.51,-12.68],[-28.62,-16.87],[-31.74,-21.06],[-34.86,-25.25]]],"holes":[],"h":4.0,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":"brick","col":"#ec8859"},{"id":"relation/3341930","rings":[[[52.92,3.61],[-40.35,-56.26],[-55.03,-36.74],[-87.21,3.53],[-98.74,22.94],[-98.31,23.19],[-86.79,3.81],[-54.61,-36.43],[-40.12,-55.13],[52.49,4.29]]],"holes":[],"h":8.8,"min":8.5,"roof":"flat","rh":0,"dir":null,"or":null,"mat":"brick","col":"#ec8859"}]},{"id":"way/247986327","outer":[[[-24.04,-28.47],[-21.47,-32.55],[-18.89,-36.64],[36.66,-1.63],[34.09,2.46],[31.51,6.54]]],"inner":[],"parts":[{"id":"way/247986327","rings":[[[-24.04,-28.47],[-21.47,-32.55],[-18.89,-36.64],[36.66,-1.63],[34.09,2.46],[31.51,6.54]]],"holes":[],"h":5.0,"min":0,"roof":"gabled","rh":2.0,"dir":null,"or":"along","mat":null,"col":"#eac18f"}]},{"id":"way/1204092263","outer":[[[-20.0,-38.02],[-26.84,-42.97],[-28.56,-40.6],[-21.72,-35.65]]],"inner":[],"parts":[{"id":"way/1204092263","rings":[[[-20.0,-38.02],[-26.84,-42.97],[-28.56,-40.6],[-21.72,-35.65]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"relation/16446014","outer":[[[-16.98,-14.82],[-13.86,-14.02],[-15.15,-9.01],[-18.26,-9.81],[-17.62,-12.31]]],"inner":[],"parts":[{"id":"relation/16446014","rings":[[[-16.98,-14.82],[-13.86,-14.02],[-15.15,-9.01],[-18.26,-9.81],[-17.62,-12.31]]],"holes":[],"h":3.0,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/247986321","outer":[[[7.13,-1.31],[6.09,0.5],[3.58,-0.92],[4.6,-2.74]]],"inner":[],"parts":[{"id":"way/247986321","rings":[[[7.13,-1.31],[6.09,0.5],[3.58,-0.92],[4.6,-2.74]]],"holes":[],"h":2.0,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]},{"id":"way/248468851","outer":[[[-102.85,35.04],[-100.82,35.39],[-100.48,33.52],[-102.52,33.17]]],"inner":[],"parts":[{"id":"way/248468851","rings":[[[-102.85,35.04],[-100.82,35.39],[-100.48,33.52],[-102.52,33.17]]],"holes":[],"h":3.0,"min":0,"roof":"gabled","rh":0.5,"dir":null,"or":"along","mat":null,"col":null}]},{"id":"way/248844324","outer":[[[25.4,101.68],[25.19,103.32],[27.08,103.57],[27.28,101.92]]],"inner":[],"parts":[{"id":"way/248844324","rings":[[[25.4,101.68],[25.19,103.32],[27.08,103.57],[27.28,101.92]]],"holes":[],"h":3.0,"min":0,"roof":"gabled","rh":0.5,"dir":null,"or":"along","mat":null,"col":null}]},{"id":"way/248844325","outer":[[[-15.4,106.05],[-15.11,107.68],[-13.24,107.36],[-13.52,105.73]]],"inner":[],"parts":[{"id":"way/248844325","rings":[[[-15.4,106.05],[-15.11,107.68],[-13.24,107.36],[-13.52,105.73]]],"holes":[],"h":3.0,"min":0,"roof":"gabled","rh":0.5,"dir":null,"or":"along","mat":null,"col":null}]}]} as unknown as { anchor: [number, number]; buildings: OsmBuilding[] }

const ochre = new Part(), pale = new Part(), brick = new Part(), roof = new Part(), win = new Part()
for (const b of DATA.buildings) {
  for (const p of b.parts) {
    if (p.id === 'relation/3341930') continue
    const wall = p.col === '#b1ccbd' ? pale : p.col === '#ec8859' ? brick : ochre
    osmMass({ wall, roof }, p)
  }
  if (b.parts.some((p) => p.h >= 4)) osmWindows(win, b, { sill0: 0.9, wh: 1.5, w: 1.2, headroom: 0.4 })
}

await save('moscow-kremlin-service-buildings.glb', 'Kremlin service buildings by the Borovitskaya Tower', [
  { part: ochre, material: finish('kremlin-ochre', KREMLIN.ochre) },
  { part: pale, material: finish('kremlin-pale-green', 0xc9d8cd) },
  { part: brick, material: finish('kremlin-brick', 0xc8705a) },
  { part: roof, material: finish('kremlin-roof', KREMLIN.roof) },
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, height: 7 })
