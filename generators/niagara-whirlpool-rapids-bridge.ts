/**
 * Whirlpool Rapids Bridge (Lower Steel Arch Bridge, 1897; Leffert L. Buck)
 * — procedural, CC0-1.0, no textures.
 * bun generators/niagara-whirlpool-rapids-bridge.ts
 *
 * The whole bridge inside its OSM outline as one placement: the two-hinged
 * spandrel-braced steel arch over the Whirlpool Rapids (two truss planes,
 * each a curved arch chord with posts and diagonals up to a straight top
 * chord), the heavy end posts on the hinges, the deck trusses of the two
 * approach spans out to the rims, the masonry abutments at each rim; the
 * upper deck's plate girders and its rail bed (single track, Amtrak's Maple
 * Leaf), the lower road deck's floor system and the walkways cantilevered
 * outside the trusses; and past each rim the rail deck's girders over the
 * plaza roads on stone walls. The map draws the lower deck's roadway.
 *
 * Also exports `spandrelArch`, the spandrel-braced arch kit the Michigan
 * Central Railway Bridge next door is built with.
 *
 * Frame: x across (+x to the south, upstream), y along the bridge toward
 * the United States (bearing 79.9°, the rail and road ways' axis), z up,
 * metres; origin at the outline's centroid (-79.058294, 43.109217). The
 * deck is centred at x = -4.6 (`XC`): rail at -5.0, road at -4.7, the
 * outline's edges at -12 and +3.6, the footways at -10.7 and +2.0.
 *
 * Height. Built in a frame with z = 0 on the river (90.80 m NAVD88, the
 * lidar's bare-earth reading over the rapids; Mapterhorn's 90.81), then
 * moved down so the lowest foot (a skewback on the gorge wall) stands at
 * the model's y = 0; the GLB's extras give that drop (`riverBelowOrigin`).
 * Feet follow the map's terrain (`GROUND`, 5 m table in this frame).
 * elevation 0.
 *
 * Deck heights built to (tools/bridge_ele.py measure 26675211 1274430543
 * --every 40, USGS 3DEP NY_FEMAR2_Central_B1_2018, lidar lower quartile,
 * spread 0.02-0.12 m; NAVD88 = value + 90.80): the rail deck 83.36 m at the
 * Canadian end (node 61235240, y = -168.8, on the bare earth), 83.41 at
 * y = -89, 83.62 at y = -9, 83.66 at y = +79, 83.74 at node 11833209173
 * (y = +117.4). The road deck under it can't be seen by lidar: built 6.3 m
 * under the rail (77.1-77.4 m), where both carriageway ends (nodes
 * 9934185362 at y = -121.8 and 292556934 at y = +118.1) meet the rim's
 * terrain (77.4 and 77.1 m), leaving the published 3.96 m (13 ft) of
 * headroom under the upper deck's floor. None of the ways carries ele.
 *
 * Sources:
 * - OSM: outline way/987726054 (man_made=bridge, bridge:structure=truss),
 *   y = -169 to +161 (wide from -122 to +118, narrower over the plazas);
 *   rail 26675211 / 1274430543 (layer 2), road 1508801865 / 37005157,
 *   footways 1039869112 / 1039869113. No building or building:part lies
 *   under the model.
 * - Lidar: the deck heights above.
 * - Map terrain (Mapterhorn): the river from y = -35 to +50, rims 77 m up
 *   at y = -117 and +118, the hinges' slopes 30-35 m up.
 * - Published (Wikipedia "Whirlpool Rapids Bridge"): 1896-97, L. L. Buck;
 *   329 m long, arch span 167.6 m (550 ft), two-hinged spandrel-braced
 *   riveted arch; upper deck rail (one track since 1963), 10 m wide; lower
 *   deck road, 16.9 m wide; 3.96 m headroom on the lower deck; 68.6 m
 *   clearance below.
 * - Photos (Wikimedia Commons):
 *   - "Whirlpool Rapids Bridge 2023a.jpg" (Antony-22, CC BY-SA 4.0): the
 *     Canadian approach span and arch from the north bank: the upper deck's
 *     plate girders, the open truss below, the lower deck's lattice-railed
 *     walkways outside the trusses, the grey paint;
 *   - "Whirlpool Rapids Bridge and Michigan Central Railway Bridge 2023.jpg"
 *     (Antony-22, CC BY-SA 4.0): the arch's curve and end posts beside the
 *     Michigan Central;
 *   - "Whirlpool Rapids Bridge 2.jpg" (Detroit Publishing Co., public
 *     domain, c. 1900): the full downstream elevation: arch rise, panel
 *     count (about 18 on the arch), the end-post towers on the hinges, the
 *     approach trusses to the rims;
 *   - "Whirlpool Rapids Bridge 2023b.jpg" (Antony-22, CC BY-SA 4.0): the
 *     Canadian plaza: the rail deck carried over the plaza road on a girder.
 *
 * Estimated: hinges 35 m over the river at y = ±84 (photos, terrain), the
 * arch rib 2.6 m deep with its crown just under the lower deck, 18 arch
 * panels, truss planes 10 m apart (the upper deck's width), approach
 * trusses 8 m deep, the plate girders 3.3 m deep, the walkways out to
 * 8.45 m (half the lower deck's 16.9 m), the abutments' size. Colours from
 * daylight photos: steel blue-grey (#aab3b8), stone (#cfc8b8), the rail
 * bed (#7d776f).
 *
 * Doubts: the lower deck's height (from the ends and published headroom,
 * not measured); the walkways' railings and the trusses' lateral bracing are
 * not drawn in this low model; the plaza ends are simplified to walls.
 */
import { Part, writeGlb, type MaterialSpec } from './mesh'
import { band, chamferedRect, footedLoft, groundAt, parabola, piecewise, stations, strip, truss, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { column, flat, settle, wallBand } from './niagara-rainbow-bridge'

// ---- The spandrel-braced arch kit (shared with niagara-michigan-central-railway-bridge) -----------

export type SpandrelSpec = {
  tx: number                              // truss planes at x = ±tx
  ya: number; yb: number                  // the hinges
  zs: number                              // arch chord's underside at the hinges
  crown: number                           // arch chord's underside at the crown
  ribD: number                            // arch chord depth
  top: (y: number) => number              // top chord's top
  topD: number                            // top chord depth
  panels: number                          // panels across the arch
  gnd: (x: number, y: number) => number
  endPost?: number                        // end post size
}

/**
 * A spandrel-braced arch: in each truss plane a curved arch chord, a straight
 * top chord, a post at every panel point and a diagonal in each panel; heavy
 * end posts on the hinges, concrete or masonry skewbacks under them, and a
 * cross strut between the planes at every panel point of the arch chord.
 * Returns the arch chord's underside as a function of y.
 */
export function spandrelArch(s: SpandrelSpec, steel: Part, conc: Part) {
  const { tx, ya, yb, zs, crown, ribD, top, topD, panels, gnd } = s
  const ym = (ya + yb) / 2
  const bot = parabola([ya, zs], [ym, crown], [yb, zs])
  const ys = stations(ya, yb, (yb - ya) / panels)
  const curve = stations(ya, yb, (yb - ya) / Math.max(panels, 24))
  for (const sd of [-1, 1]) {
    truss(steel, steel, sd * tx, ys, top, bot, { chordW: 0.9, topD, botD: ribD, member: 0.45, post: 0.6, curve, minWeb: 0.8 })
    for (const y of [ya, yb]) column(steel, sd * tx, y, zs - 0.5, top(y), s.endPost ?? 1.6, s.endPost ?? 1.6)
  }
  // Cross struts on the arch chord and under the top chord.
  ys.forEach((y, i) => {
    if (i === 0 || i === ys.length - 1) return
    const z = bot(y) + ribD / 2
    strip(steel, [-tx, y, z], [tx, y, z], 0.6, [0, 0, 1])
  })
  // Skewbacks under the hinges.
  for (const [y0, sgn] of [[ya, -1], [yb, 1]] as [number, number][]) {
    const y1 = y0 - sgn * 2.5, y2 = y0 + sgn * 4, xo = tx + 1.8
    const zTop = Math.max(zs - 0.4, ...[-xo, 0, xo].flatMap((x) => [y1, y0, y2].map((y) => gnd(x, y) + 0.6)))
    const plan = chamferedRect(-xo, xo, Math.min(y1, y2), Math.max(y1, y2), 0.4)
    footedLoft(conc, gnd, [{ plan, z: 'ground' }, { plan, z: zTop }], 3)
  }
  return bot
}

/** A two-legged steel bent from the ground up to z = top at y, its legs at x = ±tx, with struts. */
export function bent(steel: Part, gnd: (x: number, y: number) => number, y: number, tx: number, top: number, leg = 1.0, every = 10) {
  for (const sd of [-1, 1]) {
    const x = sd * tx, plan = chamferedRect(x - leg / 2, x + leg / 2, y - leg / 2, y + leg / 2, 0)
    footedLoft(steel, gnd, [{ plan, z: 'ground' }, { plan, z: top }], 50, false)
  }
  const base = Math.max(gnd(-tx, y), gnd(tx, y))
  for (let z = top - 1.2; z > base + 2; z -= every) band(steel, -tx + leg / 2, tx - leg / 2, [y - 0.3, y + 0.3], () => z + 0.35, () => z - 0.35)
}

// ---- The Whirlpool Rapids Bridge -------------------------------------------------------------------

// Map terrain (Mapterhorn) minus the river's reading (90.81 m), 5 m apart in the anchor's frame
// (x across from -20 to +15, y along from -175 to +170).
const GROUND: GroundGrid = {"y0":-175,"x0":-20,"step":5,"z":[[78.4,78.4,83.0,83.3,83.3,80.4,78.3,78.3],[78.2,78.3,82.8,83.4,83.4,79.6,78.1,78.1],[78.2,78.2,80.6,80.9,81.4,78.7,77.8,77.9],[77.7,77.6,77.6,77.6,77.6,77.6,77.6,77.7],[77.3,77.3,77.4,77.4,77.4,77.5,77.6,77.6],[77.5,77.5,77.6,77.6,77.6,77.5,77.6,77.6],[77.4,77.4,77.4,77.4,77.4,77.4,77.5,77.5],[77.4,77.4,77.4,77.4,77.4,77.4,77.4,77.6],[77.4,77.4,77.5,77.5,77.4,77.4,77.4,77.6],[77.5,77.4,77.5,77.5,77.4,77.4,77.4,77.5],[77.4,77.4,77.4,77.4,77.4,77.6,77.6,77.7],[77.2,77.4,77.4,77.4,77.4,77.5,77.6,77.7],[61.3,63.2,70.0,73.2,75.9,77.1,77.6,77.7],[52.8,53.6,55.0,58.7,62.3,64.2,66.5,70.8],[48.8,48.6,47.9,49.1,51.0,52.3,53.0,54.0],[45.0,44.7,43.3,44.1,45.2,46.0,47.2,48.2],[41.6,40.6,39.5,40.4,40.8,41.5,43.1,44.5],[38.7,37.4,36.7,36.8,37.4,38.1,38.8,39.9],[35.8,34.8,34.0,34.1,34.5,35.1,35.8,36.5],[32.5,32.6,32.5,32.5,32.7,33.0,33.2,33.5],[29.0,29.7,30.0,30.4,30.6,30.7,30.6,30.5],[25.8,27.2,26.8,27.9,27.9,28.0,27.3,27.2],[22.3,23.0,22.5,24.0,23.9,23.8,23.5,23.2],[18.6,18.7,18.4,19.3,19.2,19.0,18.7,18.8],[14.4,14.2,14.5,15.0,15.2,14.9,14.7,14.9],[11.1,11.5,12.0,12.1,12.3,12.5,11.8,11.8],[9.6,10.0,10.2,10.4,10.4,10.4,10.5,10.2],[7.5,8.5,8.5,8.7,8.5,8.4,8.3,7.2],[0,0.1,0.1,0.2,0.1,0.2,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[3.4,5.1,3.6,2.3,0.1,0,0,0],[8.5,8.4,8.3,8.0,6.7,4.1,0.3,0.1],[9.7,9.5,9.2,9.0,9.0,9.1,9.4,9.5],[12.9,11.1,11.1,10.3,10.0,10.0,10.2,10.6],[18.1,17.9,16.3,14.1,12.9,13.4,13.2,12.1],[20.5,20.2,19.7,18.7,18.7,18.5,18.5,18.8],[27.8,29.3,28.7,28.5,27.5,26.2,24.5,22.8],[33.4,33.1,33.6,33.7,33.5,31.9,30.7,30.6],[42.6,40.2,39.8,40.4,38.9,37.8,37.8,36.0],[46.7,45.3,45.2,44.7,43.8,43.0,43.6,41.7],[51.3,51.0,50.6,49.7,48.7,47.9,47.7,45.6],[56.2,56.8,55.8,54.4,53.4,52.4,52.0,49.9],[66.6,68.3,66.1,63.3,59.5,56.9,56.2,54.2],[74.6,74.6,76.0,74.7,69.9,67.2,63.3,59.1],[75.2,77.2,77.3,77.2,77.0,76.9,75.2,67.9],[75.9,77.3,77.1,77.1,77.1,77.3,76.9,73.8],[77.1,77.1,77.1,77.1,77.1,77.1,77.2,77.2],[77.3,77.2,77.1,77.1,77.1,77.1,77.1,77.3],[77.2,77.2,77.2,77.1,77.2,77.2,77.2,77.2],[77.2,77.2,77.2,77.2,77.2,77.2,77.2,77.2],[77.4,77.3,77.3,77.3,77.3,77.3,77.3,77.3],[77.5,77.5,77.4,77.4,77.4,77.4,77.4,77.3],[77.7,77.7,77.6,77.6,77.5,77.5,77.5,77.4],[77.9,77.9,77.9,77.9,77.8,77.7,77.6,77.6],[78.1,78.2,78.3,78.2,78.1,78.0,77.8,77.7]]}
const XC = -4.6
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))

// Rail deck (bridge_ele.py measure; NAVD88 − 90.80), and the road deck 6.3 m under it.
const rail = piecewise([[-168.8, 83.36], [-128.8, 83.4], [-88.8, 83.41], [-48.8, 83.55], [-8.8, 83.62], [79.2, 83.66], [117.4, 83.74], [161, 83.75]])
const road = (y: number) => rail(y) - 6.3

const ENDS: [number, number] = [-168.5, 161]
const RIMS: [number, number] = [-122, 118]      // the abutments, where the road deck lands
const TX = 5.0, WALK = 8.45, GIRDER = 3.3

if (import.meta.main) {
  const steel = new Part(), stone = new Part(), bed = new Part()
  const topChord = (y: number) => rail(y) - GIRDER

  // The arch and its spandrel bracing up to the top chord under the plate girders.
  spandrelArch({ tx: TX, ya: -84, yb: 84, zs: 35, crown: road(0) - 1.5 - 2.6, ribD: 2.6, top: topChord, topD: 0.7, panels: 18, gnd, endPost: 1.8 }, steel, stone)

  // Approach spans: deck trusses 8 m deep from the end posts to the rims.
  for (const [a, b] of [[RIMS[0], -84], [84, RIMS[1]]]) {
    const ys = stations(a, b, (b - a) / 4)
    for (const sd of [-1, 1]) truss(steel, steel, sd * TX, ys, topChord, (y) => topChord(y) - 8, { chordW: 0.9, topD: 0.7, botD: 0.8, member: 0.45, post: 0.6 })
  }

  // Upper deck: the plate girders over the whole length, the rail bed between them.
  const ysAll = stations(ENDS[0], ENDS[1], 10)
  for (const sd of [-1, 1]) band(steel, sd * (TX - 0.35), sd * (TX + 0.35), ysAll, (y) => rail(y) + 0.9, topChord)
  flat(bed, -TX + 0.35, TX - 0.35, ysAll, (y) => rail(y) - 0.25, true)
  flat(steel, -TX, TX, ysAll, topChord, false)

  // Lower deck between the rims: the floor system's underside, the walkways outside the trusses.
  const ysLow = stations(RIMS[0], RIMS[1], 10)
  flat(steel, -WALK, WALK, ysLow, (y) => road(y) - 1.5, false)
  for (const sd of [-1, 1]) {
    flat(bed, sd * (TX + 0.45), sd * WALK, ysLow, (y) => road(y) + 0.1, true)
    wallBand(steel, sd * WALK, ysLow, (y) => road(y) + 1.1, (y) => road(y) - 1.5)
  }

  // Masonry abutments at the rims: a pier under each truss line, down the gorge wall to the terrain.
  for (const r of RIMS) for (const sd of [-1, 1]) {
    const plan = chamferedRect(Math.min(sd * 3.6, sd * (WALK + 0.4)), Math.max(sd * 3.6, sd * (WALK + 0.4)), r - 5, r + 5, 0.4)
    footedLoft(stone, gnd, [{ plan, z: 'ground' }, { plan, z: road(r) - 1.6 }], 3)
  }

  // Past the rims, over the plazas: the rail girders on stone walls outside the road, a soffit between.
  for (const [a, b] of [[ENDS[0], RIMS[0] - 5], [RIMS[1] + 5, ENDS[1]]]) {
    for (const sd of [-1, 1]) {
      const plan = chamferedRect(Math.min(sd * WALK, sd * (WALK + 1.2)), Math.max(sd * WALK, sd * (WALK + 1.2)), a, b, 0.3)
      footedLoft(stone, gnd, [{ plan, z: 'ground' }, { plan, z: topChord((a + b) / 2) }], 4)
    }
    flat(steel, -WALK, WALK, stations(a, b, 10), topChord, false)
  }

  const all = [steel, stone, bed]
  const DROP = settle(all, XC)
  const STEEL: MaterialSpec = { ...finish('arch-steel', 0xaab3b8), doubleSided: true }
  const STONE: MaterialSpec = { ...finish('abutment-stone', 0xcfc8b8), doubleSided: true }
  const BED: MaterialSpec = { ...finish('rail-bed', 0x7d776f), doubleSided: true }
  const parts = [{ part: steel, material: STEEL }, { part: stone, material: STONE }, { part: bed, material: BED }]
  console.log(parts.map((q) => `${q.material.name} ${q.part.triangles}`).join(', '))
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  const glb = writeGlb('Whirlpool Rapids Bridge', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the lowest foot',
    bearing: 79.9, elevation: 0, deckCentre: XC, riverBelowOrigin: DROP,
    railDeck: { canadianEnd: rail(ENDS[0]), mid: rail(0), usEnd: rail(ENDS[1]) }, roadDeck: { canadianRim: road(RIMS[0]), usRim: road(RIMS[1]) },
  })
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  await Bun.write(new URL('../models/niagara-whirlpool-rapids-bridge.glb', import.meta.url), glb)
  console.log(`niagara-whirlpool-rapids-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
}
