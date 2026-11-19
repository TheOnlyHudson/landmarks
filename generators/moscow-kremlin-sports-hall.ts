/**
 * Kremlin sports hall, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-sports-hall.ts
 *
 * The one-storey sports hall in the Tainitsky Garden, inside the Kremlin's
 * river wall (OSM relation/16454316, building=sports_hall, operator:type
 * government, flat tar-paper roof; parts relation/16454313-16454315). Kept
 * apart from the hilltop pavilions because it stands on the garden's
 * slope, well below them.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the outline, 37.6218412, 55.7503364.
 *
 * Evidence: OSM only (outline, one storey, flat roof). No licensed photo
 * shows it: the garden's trees hide it from the river in every Commons
 * view checked (Юрий Д.К., "Moscow - Taynitsky Garden.jpg", "Moscow -
 * Summer view of the Kremlin and Tainitsky Garden.jpg", CC BY 4.0).
 * Estimated: the 7 m height, ochre walls (the Kremlin's service-building
 * colour), a band of 2.4 m windows on a 4 m bay. A plain placeholder that
 * keeps the map from drawing a box here; its real look is unknown.
 *
 * Materials (three): ochre, the grey tar-paper roof (OSM roof:material
 * tar_paper), window.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { KREMLIN, cap, ccw, osmWindows, save, walls, type OsmBuilding } from './moscow-senate'

const DATA = {"anchor":[37.6218412,55.7503364],"origin":[271.67,-129.38],"buildings":[{"id":"relation/16454316","outer":[[[33.96,6.33],[34.11,6.01],[29.97,4.11],[29.68,4.74],[28.26,4.09],[28.41,3.76],[6.23,-6.41],[6.5,-7.02],[1.31,-9.4],[1.03,-8.79],[-21.26,-19.02],[-21.41,-18.7],[-22.83,-19.34],[-22.54,-19.97],[-26.67,-21.86],[-26.82,-21.53],[-29.93,-22.97],[-36.93,-7.7],[-33.82,-6.27],[-34.03,-5.82],[-29.9,-3.92],[-29.51,-4.79],[-28.09,-4.13],[-28.31,-3.65],[21.37,19.12],[21.59,18.64],[23.01,19.3],[22.79,19.78],[22.61,20.15],[26.76,22.05],[26.97,21.6],[29.93,22.96],[33.46,15.26],[36.93,7.7]]],"inner":[],"parts":[{"id":"relation/16454313","rings":[[[-33.82,-6.27],[-34.03,-5.82],[-29.9,-3.92],[-29.51,-4.79],[-28.09,-4.13],[-28.31,-3.65],[21.37,19.12],[21.59,18.64],[23.01,19.3],[22.79,19.78],[22.61,20.15],[26.76,22.05],[26.97,21.6],[33.96,6.33],[34.11,6.01],[29.97,4.11],[29.68,4.74],[28.26,4.09],[28.41,3.76],[6.23,-6.41],[6.5,-7.02],[1.31,-9.4],[1.03,-8.79],[-21.26,-19.02],[-21.41,-18.7],[-22.83,-19.34],[-22.54,-19.97],[-26.67,-21.86],[-26.82,-21.53]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null},{"id":"relation/16454314","rings":[[[-26.82,-21.53],[-29.93,-22.97],[-36.93,-7.7],[-33.82,-6.27]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null},{"id":"relation/16454315","rings":[[[26.97,21.6],[33.96,6.33],[36.93,7.7],[33.46,15.26],[29.93,22.96]]],"holes":[],"h":3.3,"min":0,"roof":"flat","rh":0,"dir":null,"or":null,"mat":null,"col":null}]}]} as unknown as { anchor: [number, number]; buildings: OsmBuilding[] }
const H = 7

const ochre = new Part(), roof = new Part(), win = new Part()
for (const b of DATA.buildings) {
  for (const p of b.parts) for (const r of p.rings) {
    walls(ochre, ccw(r), 0, H)
    cap(roof, ccw(r), [], H)
  }
  osmWindows(win, { ...b, parts: b.parts.map((p) => ({ ...p, h: H })) }, { sill0: 2.2, wh: 3.0, w: 2.4, pitch: 4.0, headroom: 0.8 })
}

await save('moscow-kremlin-sports-hall.glb', 'Kremlin sports hall', [
  { part: ochre, material: finish('kremlin-ochre', KREMLIN.ochre) },
  { part: roof, material: PALETTE.roof }, // tar paper, not the painted green metal
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, height: H })
