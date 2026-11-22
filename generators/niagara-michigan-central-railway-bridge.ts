/**
 * Michigan Central Railway Bridge (1925; William Perry Taylor, J. L.
 * Delming, Olaf Hoff) — procedural, CC0-1.0, no textures.
 * bun generators/niagara-michigan-central-railway-bridge.ts
 *
 * The disused single-track bridge inside its OSM outline as one placement:
 * the steel spandrel-braced deck arch over the Whirlpool Rapids gorge (two
 * truss planes, each a deep curved arch chord with posts and diagonals up
 * to the deck girders), the heavy end posts and skewbacks on the gorge
 * walls, the deck plate girders and the rail bed (its track lifted), and
 * the steel trestle bents and concrete piers of the approaches out to the
 * outline's ends. Unpainted for decades: the steel reads rust brown. Built
 * with `spandrelArch` and `bent` from niagara-whirlpool-rapids-bridge.ts
 * (merge that generator first).
 *
 * Frame: x across (+x to the south-south-east, upstream), y along the
 * bridge toward the United States (bearing 70.8°, the rail way's axis), z
 * up, metres; origin at the outline's centroid (-79.058233, 43.108603). The
 * deck is centred at x = +2.5 (`XC`): the old track at +1.9, the outline's
 * edges at -2.1 and +7.2.
 *
 * Height. Built in a frame with z = 0 on the river (90.80 m NAVD88, the
 * lidar's bare-earth reading over the rapids; Mapterhorn's 90.81), then
 * moved down so the lowest foot stands at the model's y = 0; the GLB's
 * extras give that drop (`riverBelowOrigin`). Feet follow the map's
 * terrain (`GROUND`, 5 m table in this frame). elevation 0.
 *
 * Deck height built to (tools/bridge_ele.py measure 53192312 --every 40,
 * USGS 3DEP NY_FEMAR2_Central_B1_2018, lidar lower quartile, spread
 * 0.03-0.13 m where the deck was read): 176.26-176.33 m NAVD88 from end to
 * end, 85.5 m over the river, level. The rail bed is the model's (the map
 * draws no railway surface; the way is railway=abandoned).
 *
 * Sources:
 * - OSM: outline way/937900550 (man_made=bridge, bridge=abandoned,
 *   bridge:structure=arch, wikidata Q6837479), y = -148 to +151, 9.3 m
 *   wide; the abandoned rail way/53192312. No building or building:part
 *   lies under the model.
 * - Lidar: the deck height above.
 * - Map terrain (Mapterhorn): the river from y = -30 to +60, rims 77 m up
 *   at y = -112 and +150.
 * - Published (Wikipedia "Michigan Central Railway Bridge"): 1924-25, 863 ft
 *   (263 m) long, 640 ft (195 m) arch span, steel open-spandrel deck arch,
 *   single track, closed 2001, tracks removed.
 * - Photos (Wikimedia Commons):
 *   - "Michigan Central Railway Bridge 2023a.jpg" (Antony-22, CC BY-SA 4.0):
 *     the downstream elevation: arch rise, the end posts, about 14 panels,
 *     the deck girder, the rusted brown steel;
 *   - "Michigan Central Railway Bridge Niagara Falls 1.jpg" (Balcer, CC BY
 *     2.5): the Canadian half close up: the deep arch chord, posts and
 *     diagonals, the concrete pier and steel bents at the Canadian rim;
 *   - "Whirlpool Rapids Bridge and Michigan Central Railway Bridge 2023.jpg"
 *     (Antony-22, CC BY-SA 4.0): the arch beside the Whirlpool Rapids
 *     Bridge from the north-west.
 *
 * Estimated: the hinges (y = -83 and +117, 41 m over the river, centred on
 * the gorge: photos and terrain), the arch chord 2.4 m deep with its crown
 * 4.5 m under the deck, 14 panels, truss planes 6.4 m apart, deck girders
 * 3 m deep, the bents' and piers' positions. Colour from daylight photos:
 * rust brown (#7a5644), pulled to the palette's lightness; the rail bed
 * (#7d776f).
 *
 * Doubts: the approach supports' exact positions; the barbed-wire wall at
 * mid-span and the railings are not drawn.
 */
import { Part, writeGlb, type MaterialSpec } from './mesh'
import { band, chamferedRect, footedLoft, groundAt, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { flat, settle } from './niagara-rainbow-bridge'
import { bent, spandrelArch } from './niagara-whirlpool-rapids-bridge'

// Map terrain (Mapterhorn) minus the river's reading (90.81 m), 5 m apart in the anchor's frame
// (x across from -10 to +15, y along from -155 to +160).
const GROUND: GroundGrid = {"y0":-155,"x0":-10,"step":5,"z":[[80.1,83.2,85.3,85.2,85.2,83.5],[79.5,83.0,85.2,85.3,84.8,81.3],[77.8,78.2,80.0,82.3,78.6,77.7],[77.7,77.7,77.7,77.7,77.6,77.7],[77.7,77.8,77.9,77.9,77.8,77.7],[77.7,77.6,77.7,77.6,77.6,77.6],[77.7,77.7,77.7,77.7,77.7,77.8],[77.8,77.8,77.8,77.8,77.8,77.4],[77.8,77.7,77.3,77.1,75.9,70.1],[77.5,76.8,75.7,72.7,66.5,55.3],[75.8,72.0,62.2,56.3,53.6,51.2],[60.9,54.5,52.1,49.9,47.6,46.8],[50.8,47.8,47.1,46.1,45.1,44.6],[46.7,44.8,43.6,42.7,42.7,42.9],[43.5,42.4,40.1,39.3,38.8,38.7],[40.6,38.4,37.4,36.7,36.1,35.4],[38.2,37.4,36.5,36.0,34.3,32.7],[36.4,36.1,35.4,34.9,32.3,30.2],[33.9,34.0,34.0,32.6,30.2,27.9],[30.3,30.5,30.3,29.0,27.1,24.7],[26.4,26.3,26.5,25.5,24.2,21.8],[22.0,21.8,22.3,22.0,20.7,19.1],[16.7,17.2,17.6,17.4,16.8,15.6],[12.2,12.3,12.6,12.6,12.3,11.8],[9.7,9.1,8.5,8.4,5.7,4.6],[1.5,0.0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0.0,0,0,0],[2.0,3.8,8.4,7.1,5.5,3.9],[9.6,9.2,10.1,10.9,11.0,10.8],[11.5,11.4,12.2,13.9,14.7,15.2],[17.9,18.7,18.9,18.5,18.9,19.3],[19.5,19.3,19.8,20.4,21.0,21.6],[23.7,25.0,26.0,26.6,27.2,27.1],[27.2,29.2,29.1,29.0,29.0,28.7],[30.8,31.1,30.5,30.3,30.7,30.8],[33.2,33.0,32.8,33.1,33.1,33.3],[36.3,35.6,35.8,35.8,36.4,35.9],[40.9,39.7,38.8,38.9,41.1,40.9],[44.8,43.8,42.3,42.4,43.9,44.1],[48.5,46.9,45.8,45.3,45.2,45.2],[52.6,50.5,49.2,48.6,48.0,48.2],[58.7,55.3,53.9,53.2,53.1,52.6],[71.4,65.1,62.0,61.2,61.3,60.9],[76.0,72.1,71.7,70.4,71.2,70.7],[76.5,75.9,75.5,75.2,76.2,76.4],[77.0,76.7,77.0,77.1,77.2,77.3],[77.4,77.2,77.5,77.7,77.7,77.7]]}
const XC = 2.5
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))

const DECK = 85.5

const ENDS: [number, number] = [-148, 151]
const TX = 3.2, EDGE = 4.4, GIRDER = 3.0
const topChord = () => DECK - GIRDER

const steel = new Part(), conc = new Part(), bed = new Part()
spandrelArch({ tx: TX, ya: -83, yb: 117, zs: 41, crown: DECK - 4.5 - 2.4, ribD: 2.4, top: topChord, topD: 0.7, panels: 14, gnd, endPost: 1.6 }, steel, conc)

// Approaches: steel bents on the slopes, a concrete pier at each rim.
for (const y of [-96, -124, -136, 129, 140]) bent(steel, gnd, y, TX, topChord(), 1.0, 10)
for (const y of [-112, 150]) {
  const plan = chamferedRect(-EDGE, EDGE, y - 1.5, y + 1.5, 0.3)
  footedLoft(conc, gnd, [{ plan, z: 'ground' }, { plan, z: topChord() }], 3)
}

// Deck: plate girders on both truss lines, the rail bed between, the soffit.
const ys = stations(ENDS[0], ENDS[1], 15)
for (const sd of [-1, 1]) band(steel, sd * (TX - 0.35), sd * (TX + 0.35), ys, () => DECK + 1.0, topChord)
flat(bed, -EDGE, EDGE, ys, () => DECK - 0.25, true)
flat(steel, -EDGE, EDGE, ys, () => DECK - 0.6, false)
for (const sd of [-1, 1]) band(steel, sd * (EDGE - 0.25), sd * EDGE, ys, () => DECK + 0.3, () => DECK - 0.6)


const DROP = settle([steel, conc, bed], XC)
const STEEL: MaterialSpec = { ...finish('rusted-steel', 0x7a5644), doubleSided: true }
const CONC: MaterialSpec = { ...finish('pier-concrete', 0xd2cbbd), doubleSided: true }
const BED: MaterialSpec = { ...finish('rail-bed', 0x7d776f), doubleSided: true }
const parts = [{ part: steel, material: STEEL }, { part: conc, material: CONC }, { part: bed, material: BED }]
console.log(parts.map((q) => `${q.material.name} ${q.part.triangles}`).join(', '))
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Michigan Central Railway Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the lowest foot',
  bearing: 70.8, elevation: 0, deckCentre: XC, riverBelowOrigin: DROP, deckOverRiver: DECK,
})
if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
await Bun.write(new URL('../models/niagara-michigan-central-railway-bridge.glb', import.meta.url), glb)
console.log(`niagara-michigan-central-railway-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
