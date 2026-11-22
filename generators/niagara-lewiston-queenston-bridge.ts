/**
 * Lewiston–Queenston Bridge (1962; Hardesty & Hanover, Bethlehem Steel) —
 * procedural, CC0-1.0, no textures.
 * bun generators/niagara-lewiston-queenston-bridge.ts
 *
 * The bridge inside its OSM man_made=bridge outline as one placement: the
 * fixed steel deck arch over the Niagara gorge below the escarpment, two
 * parallel box ribs with lattice bracing between them on concrete
 * skewbacks, the paired steel spandrel columns on the ribs and down the
 * gorge's slopes (the tallest braced by struts), the deck girder, the
 * concrete end walls at the outline's ends, and the lane-control sign
 * gantries over the five reversible lanes. The approach viaducts beyond the
 * outline (the US side runs on for some 500 m) are the map's. Built with
 * `deckArch` from niagara-rainbow-bridge.ts (merge that generator first).
 *
 * Frame: x across (+x to the south, upstream), y along the bridge toward
 * the United States (bearing 98.6°, the outline's axis; the deck ways lie on
 * it within 0.5 m), z up, metres; origin at the outline's centroid
 * (-79.044397, 43.152974). The deck is centred at x = +0.5 (`XC`).
 *
 * Height. Built in a frame with z = 0 on the river (74.75 m NAVD88, the
 * lidar's bare-earth reading over the water; Mapterhorn's 74.75), then
 * moved down so the lowest foot (a column or skewback on the gorge slope)
 * stands at the model's y = 0; the GLB's extras give that drop
 * (`riverBelowOrigin`). Feet follow the map's terrain (`GROUND`, 5 m table
 * in this frame) vertex by vertex. elevation 0.
 *
 * Roadway heights built to (tools/bridge_ele.py measure 77453613 77453614
 * --every 40, USGS 3DEP NY_FEMAR2_Central_B1_2018, lidar lower quartile,
 * spread 0.02-0.08 m; NAVD88 = value + 74.75): 110.76 m at the east node
 * 911615581 (y = +240.5, 6.5 m over the bare earth), a sag of 110.41 at
 * y = +160 to +200, rising to the crest 111.91 at node 911615582 (y = -1.5),
 * down to 110.94 at node 911615587 (y = -126.5) and 110.43 at node
 * 911675720 (y = -183.5); held at 110.3 to the west end (y = -245, no lidar
 * road reading past -183.5). Published clearance 370 ft (113 m) agrees.
 * None of the ways carries ele.
 *
 * Sources:
 * - OSM: outline way/368215007 (man_made=bridge, wikidata Q6537419),
 *   y = -246 to +245, about 21 m wide; carriageways 77453613 and 77453614
 *   (x = -0.7); gantries 1366725465-68 (man_made=gantry). No building or
 *   building:part lies under the model.
 * - Lidar: the roadway heights above.
 * - Map terrain (Mapterhorn): the river from y = -85 to +50, rims 97-103 m
 *   up at y = -205 and +185.
 * - Published (Wikipedia "Lewiston–Queenston Bridge"): opened 1 November
 *   1962, 1,594 ft (486 m) long, 1,000 ft (305 m) main span, clearance 370
 *   ft (113 m), five reversible lanes with lane-control gantries, design by
 *   Hardesty & Hanover, similar to the Rainbow Bridge.
 * - Photos (Wikimedia Commons):
 *   - "Lewiston-Queenston Bridge from Niagara Gorge.jpg" (Wilson44691, CC0):
 *     the whole span from the gorge: the twin ribs and their lattice, the
 *     white concrete skewbacks, paired columns about 12.5 m apart, the
 *     struts on the tall columns, the gantries;
 *   - "Queenston Lewiston Bridge UpStream.jpg" (Sloan Kelly, CC BY 2.0): the
 *     upstream face: the rib's depth, the crown meeting the deck, the
 *     concrete pier at the rim, the silver-grey paint.
 *
 * Estimated: the springing height (52 m over the river, on the skewbacks,
 * from the photos), rib depth 4.5 m and width 2.4 m, rib planes 15 m apart,
 * columns 1.1 x 0.9 m, deck girder 2.2 m under the road, end walls 4 m
 * thick, gantries 7 m over the road. Colours from daylight photos: steel
 * silver-grey (#bcc3c7), concrete pale (#dcd7cc).
 *
 * Doubts: the west end's roadway past y = -183.5; the column positions on
 * the approaches inside the outline (spaced as on the arch); the gantries'
 * posts (drawn as plain posts at the deck edges).
 */
import { Part, writeGlb, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, footedLoft, groundAt, piecewise, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { deckArch, column, settle } from './niagara-rainbow-bridge'

// Map terrain (Mapterhorn) minus the river's reading (74.75 m), 5 m apart in the anchor's frame
// (x across from -20 to +20, y along from -250 to +250).
const GROUND: GroundGrid = {"y0":-250,"x0":-20,"step":5,"z":[[106.2,106.7,107.6,108.0,107.8,107.5,107.1,106.7,105.7],[103.8,104.0,105.1,105.2,105.0,104.8,104.4,104.4,104.1],[102.9,103.0,103.1,103.1,103.1,103.1,103.2,103.2,103.0],[102.9,102.9,102.9,102.9,102.9,102.9,102.8,102.8,102.6],[102.7,102.7,102.8,102.8,102.8,102.8,102.8,102.8,102.6],[102.0,102.2,102.3,102.4,102.5,102.6,102.6,102.6,102.5],[101.0,101.1,101.3,101.5,101.7,101.9,102.1,102.2,102.2],[100.5,100.5,100.6,100.6,100.6,100.6,100.7,101.0,101.3],[100.2,100.3,100.2,100.3,100.3,100.3,100.4,100.4,100.4],[95.5,94.8,94.5,95.9,97.2,98.6,99.7,100.1,100.2],[87.6,87.9,89.2,91.3,93.2,94.9,96.9,99.0,99.4],[83.3,82.3,83.5,84.6,85.6,86.7,87.7,89.6,90.2],[78.9,77.4,77.6,78.4,79.1,79.9,81.0,81.9,82.4],[73.2,72.9,72.7,73.2,73.6,73.9,74.7,75.2,76.6],[66.9,64.8,65.6,65.6,65.5,65.3,65.7,67.8,70.3],[62.6,59.7,59.7,59.8,60.0,60.1,60.0,62.1,62.9],[54.9,54.9,55.2,55.3,55.4,55.4,55.2,55.5,55.8],[49.6,50.6,50.8,50.8,50.7,50.7,50.7,50.1,49.2],[46.8,47.2,47.1,47.0,46.9,46.8,46.7,46.2,45.8],[43.3,43.3,43.1,43.0,42.9,42.8,42.8,42.6,42.2],[39.8,39.6,39.3,39.3,39.1,39.0,39.0,38.8,38.3],[36.0,35.5,35.2,34.9,34.7,34.5,34.3,34.2,33.9],[31.2,31.1,30.9,30.5,30.2,29.9,29.6,29.8,30.0],[27.6,27.5,27.3,26.9,26.5,26.1,25.7,26.2,26.3],[23.9,24.0,23.7,23.3,23.0,22.7,22.4,22.7,22.6],[20.1,20.2,20.1,19.8,19.5,19.3,19.0,19.1,19.1],[16.7,17.1,17.2,16.8,16.5,16.1,15.6,15.6,15.5],[15.1,15.2,15.3,15.1,15.0,14.8,14.6,14.6,14.6],[14.7,14.9,14.9,14.7,14.6,14.5,14.4,14.2,14.1],[13.7,13.9,14.0,14.1,14.2,14.2,14.1,14.0,13.7],[10.4,10.7,11.2,11.6,12.0,12.3,12.6,11.8,12.0],[6.3,7.0,7.2,7.4,7.8,8.4,8.6,7.4,7.1],[1.2,1.6,3.1,2.7,3.0,3.7,3.7,2.8,2.0],[0,0.0,0,0.0,0,0.0,0.1,0.1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0.0,0.0,0,0,0,0,0,0,0],[3.5,2.6,0.6,0.0,0,0,0,0,0],[6.8,6.4,3.9,2.1,0.7,0.0,0,0,0],[9.1,7.7,6.7,5.7,4.9,2.5,0.5,0.1,0],[11.4,10.4,9.4,8.5,7.6,6.5,5.4,3.4,1.7],[14.0,13.0,12.2,10.8,9.3,8.2,8.0,7.7,6.9],[16.1,15.7,14.5,12.8,11.3,10.4,9.9,9.5,9.5],[17.8,16.7,15.5,14.4,13.2,12.2,11.0,11.2,11.3],[19.7,18.1,17.2,15.9,14.4,13.0,12.5,12.2,11.5],[21.1,19.7,18.5,17.2,15.9,14.9,13.8,12.9,12.9],[24.4,22.7,21.0,19.3,17.5,15.9,14.6,13.5,13.2],[26.5,24.9,23.0,21.3,19.6,18.3,17.4,16.7,16.3],[28.3,26.8,24.7,23.2,21.6,20.2,19.8,19.2,18.8],[33.0,32.3,28.4,26.3,24.1,22.2,21.6,20.9,20.4],[37.1,37.3,35.8,32.2,28.6,25.2,23.6,22.4,22.2],[41.2,41.5,39.6,35.8,32.1,28.4,26.1,24.8,24.5],[45.0,44.9,42.6,39.5,36.5,33.7,30.5,27.6,26.8],[45.4,45.4,44.4,42.1,40.5,39.0,36.6,32.6,29.8],[46.6,46.5,45.8,45.4,45.0,44.0,39.9,36.7,35.3],[50.4,49.6,48.0,46.8,45.8,44.8,42.5,40.4,38.7],[52.8,51.2,49.7,48.6,47.4,46.2,44.9,44.3,42.5],[55.4,53.7,52.7,51.9,51.1,50.4,49.9,46.7,45.5],[61.1,57.1,56.5,55.8,55.2,54.6,54.5,53.2,49.3],[63.6,60.1,59.3,58.5,58.1,58.3,58.6,56.3,53.2],[67.6,63.2,62.3,61.8,61.3,60.6,60.3,58.7,56.0],[79.3,75.2,74.3,72.8,70.7,68.3,65.1,62.0,59.3],[88.4,85.6,84.8,82.4,80.0,77.4,73.8,69.6,64.4],[95.9,94.6,92.6,89.7,86.7,83.7,79.8,78.3,73.4],[101.1,100.0,98.0,94.7,91.7,89.2,85.1,83.8,80.5],[101.7,101.9,101.1,100.5,99.3,97.9,96.5,92.2,86.5],[101.6,101.6,101.6,101.2,100.8,100.4,100.7,101.0,98.6],[101.5,101.6,101.7,101.8,101.9,102.0,102.0,102.0,101.8],[101.2,101.4,101.5,101.6,101.7,101.8,101.9,102.1,102.1],[101.0,101.2,101.3,101.4,101.6,101.7,101.8,101.9,102.0],[100.6,100.9,101.2,101.3,101.4,101.6,101.7,101.8,101.8],[100.6,100.7,100.9,101.0,101.2,101.3,101.4,101.6,101.8],[100.9,100.6,100.7,100.9,101.0,101.2,101.2,101.4,101.5],[102.4,101.5,100.8,100.8,100.8,100.9,101.2,101.2,101.3],[103.4,102.7,102.1,101.6,101.3,100.9,100.8,101.0,101.2],[104.0,104.1,103.5,102.7,101.9,101.1,100.7,100.7,100.9],[105.5,106.2,106.0,104.6,103.2,101.7,100.6,100.5,100.5],[107.1,108.8,108.5,106.8,105.0,103.1,101.8,100.5,100.4],[108.2,110.6,110.6,109.2,107.3,105.3,104.0,102.5,100.4]]}
const XC = 0.5
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))

// Roadway on the centre line (bridge_ele.py measure; NAVD88 − 74.75).
const road = piecewise([
  [-250, 110.3], [-183.5, 110.43], [-166.5, 110.53], [-126.5, 110.94], [-121.5, 110.99], [-81.5, 111.41], [-41.5, 111.81],
  [-1.5, 111.91], [0.5, 111.89], [40.5, 111.65], [80.5, 111.21], [120.5, 110.81], [160.5, 110.41], [200.5, 110.41], [240.5, 110.76], [250, 110.85],
])

const ENDS: [number, number] = [-245, 240]
const HW = 10.3
const GANTRIES = [-200.8, -87, 65.1, 208.8] // OSM man_made=gantry ways 1366725465-68

const steel = new Part(), conc = new Part(), lamps = new Part()
deckArch({
  road, gnd, ends: ENDS, hw: HW, fd: 2.2, yc: -9.5, half: 152.5, zs: 52, depth: 4.5, rw: 1.2, ax: 7.5, colStep: 12.5,
  noColumns: (y) => y < ENDS[0] + 5 || y > ENDS[1] - 5, struts: 22,
}, steel, conc)

// Concrete end walls at the outline's ends, from the ground to just under the roadway.
for (const [a, b] of [[ENDS[0], ENDS[0] + 4], [ENDS[1] - 4, ENDS[1]]]) {
  footedLoft(conc, gnd, [
    { plan: chamferedRect(-HW - 0.2, HW + 0.2, a, b, 0.4), z: 'ground' },
    { plan: chamferedRect(-HW - 0.2, HW + 0.2, a, b, 0.4), z: road((a + b) / 2) - 0.4 },
  ], 4)
}

// Lane-control gantries: a deep sign beam across the deck on a post at each edge.
for (const y of GANTRIES) {
  const z = road(y) + 7
  for (const sd of [-1, 1]) column(steel, sd * (HW - 0.4), y, road(y) + 1.1, z + 1.6, 0.5, 0.5)
  band(steel, -HW, HW, [y - 0.4, y + 0.4], () => z + 1.6, () => z, { out: true, in: true, top: true, bottom: true, ends: true })
}

// Street lights along both parapets.
for (const y of stations(-225, 225, 30)) for (const sd of [-1, 1]) bead(lamps, [sd * (HW - 0.4), y, road(y) + 9.5], 0.6, true)

const DROP = settle([steel, conc, lamps], XC)
const STEEL: MaterialSpec = { ...finish('arch-steel', 0xbcc3c7), doubleSided: true }
const CONC: MaterialSpec = { ...finish('pier-concrete', 0xdcd7cc), doubleSided: true }
const LAMP: MaterialSpec = { name: 'lamp', color: 0x9aa3a8 }
const parts = [{ part: steel, material: STEEL }, { part: conc, material: CONC }, { part: lamps, material: LAMP }]
console.log(parts.map((q) => `${q.material.name} ${q.part.triangles}`).join(', '))
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Lewiston–Queenston Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the lowest foot',
  bearing: 98.6, elevation: 0, deckCentre: XC, riverBelowOrigin: DROP, roadway: { west: road(ENDS[0]), crest: road(-1.5), east: road(ENDS[1]) },
})
if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
await Bun.write(new URL('../models/niagara-lewiston-queenston-bridge.glb', import.meta.url), glb)
console.log(`niagara-lewiston-queenston-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
