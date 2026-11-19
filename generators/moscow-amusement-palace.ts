/**
 * Amusement Palace (Poteshny Dvorets), Moscow Kremlin: procedural, CC0-1.0,
 * no textures.
 * bun generators/moscow-amusement-palace.ts
 *
 * The boyar Miloslavsky's palace of 1651 against the Kremlin's west wall,
 * the court theatre of Tsar Alexei: a salmon-pink block with white trim
 * whose tall west range rises over the wall above the Alexander Garden, and
 * its house Church of the Praise of the Virgin with three gilt onions on
 * tall drums in a row, and a fourth, smaller one on a turret. Kit from
 * moscow-grand-kremlin-palace.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 17, the direction of the outline's long west wall (compass 17.2).
 * Anchor: area centroid of the OSM outline relation/1359337 (37.6144140,
 * 55.7512412). Built flat; the map drapes it on its terrain (Mapterhorn z12).
 *
 * Evidence
 * - OSM relation/1359337 (outline about 28 x 27 m) and its parts: the west
 *   range 3427919 (16 m, roofs 3427821/840/852 to 18 m); the east block
 *   3427800 (11 m, four levels) under skillion roofs to 13-14 m
 *   (3427789/941/933/846/898/904/909/881/813/864/889); the church's base
 *   3427797 (11-14 m), its nave 3427799 (14-17 m, gabled) and the three
 *   onions 255904761/766/777 (20-24/21-25 m) on drums 248844356/357/359
 *   and 255904782/785/794 (16-21 m), with cross shafts to 26-27 m; the
 *   turret 3427838 (11-18 m) with its small onion 255904772 (21-23 m).
 *   Colour #fdbf97, roofs #5a7364 (OSM tags).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Ludvig14, "MoscowKremlin AmusementPalace.JPG", CC BY-SA 3.0: the west
 *     range and the church over the wall, the pink and the white trim.
 *     https://commons.wikimedia.org/wiki/File:MoscowKremlin_AmusementPalace.JPG
 *   - Александровы АГ, "7358.1. Amusement Palace in Moscow Kremlin.jpg", CC
 *     BY-SA 4.0: from the west over the wall, the roofs.
 *     https://commons.wikimedia.org/wiki/File:7358.1._Amusement_Palace_in_Moscow_Kremlin.jpg
 *   - Юрий Д.К., "Moscow - 2026 - Amusement Palace, Church of the Praise of
 *     the Virgin Mary, view from Alexander Garden.jpg", CC BY 4.0.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_2026_-_Amusement_Palace,_Church_of_the_Praise_of_the_Virgin_Mary,_view_from_Alexander_Garden.jpg
 *   - shakko, "Amusement Palace (view from Manege, winter 2013) by shakko
 *     01.jpg" and "Amusement Palace and Dvortsovaya street by shakko 03.jpg",
 *     CC BY-SA 3.0: from the west, and the church's east end down the street.
 *     https://commons.wikimedia.org/wiki/File:Amusement_Palace_(view_from_Manege,_winter_2013)_by_shakko_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Amusement_Palace_and_Dvortsovaya_street_by_shakko_03.jpg
 *   - Юрий Д.К., "Moscow - State Kremlin Palace, the Church of Praise of the
 *     Blessed Virgin Mary in the Amusement Palace.jpg", CC BY 4.0.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_State_Kremlin_Palace,_the_Church_of_Praise_of_the_Blessed_Virgin_Mary_in_the_Amusement_Palace.jpg
 *
 * Heights are OSM's, but the turret's drum and onion, which Ludvig14's and
 * Юрий Д.К.'s photos show as the highest of the four, are raised 1 m. Window rows on the west range (three storeys above the
 * wall, the top one round-headed in white frames, the middle under
 * pediments) and the drums' proportions are read off Ludvig14's photo.
 *
 * Estimated or simplified: the courtyard (east) faces and the church's
 * north and south walls have no close licensed photo and are drawn with
 * plain windows; the many small roofs of the east block are drawn as three
 * low hips; the drums' tiled bands and kokoshnik gables, the crosses and
 * the chimneys are left out (a thin gilt shaft stands for each cross).
 *
 * Materials (six): pink, white trim, window, green roof, gold, and the
 * Kremlin-wall red is not used (the wall is another model).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel } from './nyc-570-lexington'
import { band } from './nyc-city-hall'
import { slab, hipRing, bayWall, drum, lathe, rect, ccw, type Row, type XY } from './moscow-grand-kremlin-palace'

const pink = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part()

// ------------------------------------------------------------ plan (OSM, model frame)
const W0 = -14.3, W1 = -7.3, S0 = -9.2, N0 = 12.7
// The west range, tall along the wall.
const west = rect(W0, S0, W1, N0)
slab(pink, west, 0, 16, null)
band(trim, ccw(west), 15.5, 16, 0.3)
band(trim, ccw(west), 10.5, 10.9, 0.18)
hipRing(roof, west, 16, 1.6, 3.2)
// The east block at 11 m.
const east: XY[] = [[-7.3, -13.9], [-1.8, -13.9], [-1.8, -9.2], [4.6, -9.2], [5.0, -15.7], [13.2, -15.2], [12.8, -7.5], [14.1, -7.4], [13.3, 5.7], [12.2, 5.6], [11.8, 12.7], [W1, N0]]
slab(pink, east, 0, 11, roof)
band(trim, ccw(east), 10.6, 11, 0.25)
band(trim, ccw(east), 0, 0.8, 0.1)
hipRing(roof, rect(4.8, -15.5, 13.1, -7.6), 11, 2, 3.4)
hipRing(roof, rect(-7.3, -9.2, 2.6, 12.7), 11, 3, 4.6)
hipRing(roof, rect(3.1, 5.6, 12.0, 12.7), 11, 2, 3.2)
hipRing(roof, rect(-7.3, -13.9, -1.8, -9.2), 11, 1.5, 2.0)

// ------------------------------------------------------------ the church
// Its base to 14 m, the nave to 16.3 m under a gable to 17.3, three drums
// and onions in a row, and the turret with the small fourth onion.
const base = rect(2.6, -8.0, 14.0, 5.7)
slab(pink, base, 11, 14, null)
band(trim, ccw(base), 13.6, 14, 0.2)
hipRing(roof, base, 14, 1.0, 2.8, 0.2)
const nave = rect(5.9, -7.8, 10.7, 5.4)
slab(pink, nave, 14, 16.2, null)
band(trim, ccw(nave), 15.8, 16.2, 0.2)
hipRing(roof, nave, 16.2, 1.2, 2.3, 0.2)
for (const [x, y, z0] of [[8.55, -5.5, 16.6], [8.3, -1.1, 17.4], [8.1, 3.4, 16.6]] as [number, number, number][]) {
  drum(pink, x, y, 1.0, 15.8, z0 + 3.6, 8, false)
  for (const zz of [z0 + 0.6, z0 + 3.1]) band(trim, ccw(Array.from({ length: 8 }, (_, i) => [x + 1.0 * Math.cos((i + 0.5) * Math.PI / 4), y + 1.0 * Math.sin((i + 0.5) * Math.PI / 4)] as XY)), zz, zz + 0.5, 0.12)
  const zb = z0 + 3.6
  lathe(gold, x, y, [[1.05, zb], [1.35, zb + 0.75], [1.12, zb + 1.6], [0.38, zb + 2.4], [0.09, zb + 3.0], [0, zb + 5.0]], 8)
}
const turret = rect(-5.1, 1.5, -0.9, 5.7)
slab(pink, turret, 11, 18.5, null)
band(trim, ccw(turret), 18.1, 18.5, 0.15)
drum(pink, -3.0, 3.6, 0.85, 18.5, 22.0, 8, false)
lathe(gold, -3.0, 3.6, [[0.9, 22.0], [1.12, 22.6], [0.92, 23.4], [0.3, 24.1], [0.08, 24.6], [0, 26.2]], 8)

// ------------------------------------------------------------ facades
// West front over the wall (Ludvig14): three storeys of windows above the
// wall, white pilasters between bays.
const westRows: Row[] = [
  { z0: 4.4, z1: 6.6, w: 1.3, head: 'rect', frame: 0.2 },
  { z0: 8.0, z1: 10.0, w: 1.4, head: 'rect', frame: 0.25, ped: 'tri', pedH: 0.7 },
  { z0: 11.8, z1: 14.4, w: 1.5, head: 'round', frame: 0.3 },
]
bayWall({ win, trim, a: [W0, N0], b: [W0, S0], bays: 5, margin: 0.8, rows: westRows, pil: [0, 15.5, 0.55] })
bayWall({ win, trim, a: [W1, N0], b: [W0, N0], bays: 2, margin: 0.6, rows: westRows, pil: [0, 15.5, 0.5] })
bayWall({ win, trim, a: [W0, S0], b: [W1, S0], bays: 2, margin: 0.6, rows: westRows, pil: [0, 15.5, 0.5] })
// the west range's east face above the low block
bayWall({ win, trim, a: [W1, S0], b: [W1, N0], bays: 4, margin: 0.8, rows: [{ z0: 12.0, z1: 14.4, w: 1.4, head: 'round' }] })
// East block, two storeys of plain windows.
const lowRows: Row[] = [
  { z0: 2.2, z1: 4.4, w: 1.3, head: 'rect', frame: 0.15 },
  { z0: 6.6, z1: 9.2, w: 1.4, head: 'rect', frame: 0.2, ped: 'tri', pedH: 0.6 },
]
bayWall({ win, trim, a: [11.8, N0], b: [W1, N0], bays: 5, margin: 0.8, rows: lowRows, pil: [0, 10.6, 0.5] })
bayWall({ win, trim, a: [14.1, -7.4], b: [13.3, 5.7], bays: 3, margin: 0.6, rows: lowRows, pil: [0, 10.6, 0.5] })
bayWall({ win, trim, a: [12.2, 5.6], b: [11.8, 12.7], bays: 2, margin: 0.6, rows: lowRows })
bayWall({ win, trim, a: [5.0, -15.7], b: [13.2, -15.2], bays: 2, margin: 0.6, rows: lowRows })
bayWall({ win, trim, a: [13.2, -15.2], b: [12.8, -7.5], bays: 2, margin: 0.6, rows: lowRows })
bayWall({ win, trim, a: [-1.8, -9.2], b: [4.6, -9.2], bays: 1, margin: 0.6, rows: lowRows })
// The church: arched windows on the nave's east end and sides.
const naveRow: Row[] = [{ z0: 14.4, z1: 15.6, w: 0.8, head: 'round' }]
bayWall({ win, trim, a: [10.7, -7.8], b: [10.7, 5.4], bays: 3, margin: 0.8, rows: naveRow })
bayWall({ win, trim, a: [5.9, 5.4], b: [5.9, -7.8], bays: 3, margin: 0.8, rows: naveRow })
bayWall({ win, trim, a: [14.0, -8.0], b: [14.0, 5.7], bays: 3, margin: 1.0, rows: [{ z0: 11.8, z1: 13.4, w: 1.1, head: 'round', frame: 0.2 }] })

// ------------------------------------------------------------ write
// At night the west range and the church are floodlit from the garden.
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.1 : p[2] > 14 ? 0.9 : n[0] < -0.5 ? 0.8 : 0.4)
const parts: { part: Part; material: MaterialSpec }[] = [
  { part: pink, material: { ...finish('poteshny-pink', 0xd9948a), floodlight: lit } },
  { part: trim, material: { ...finish('gkp-white', 0xf6f0e4), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('gkp-green-roof', 0x86ad98) },
  { part: gold, material: { ...finish('gkp-gold', 0xd9b552), floodlight: () => 0.8 } },
]
finishModel('Amusement Palace', 'moscow-amusement-palace', parts, { bearing: 17, osm: 'relation/1359337', height: 27 }, 5000)
