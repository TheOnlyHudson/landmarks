/**
 * Fuller Warren Bridge, Jacksonville (2002) — procedural, CC0-1.0, no
 * textures.
 * bun generators/jax-fuller-warren-bridge.ts
 *
 * I-95's high-level concrete bridge over the St. Johns River, with the
 * shared-use path (opened 2023) along its south side. One placement for
 * the structure inside the OSM outline relation/19627685, which covers the
 * river crossing and both ends' splits into ramps: the Riverside end
 * (y < -305), where the carriageways and their links fan out over land,
 * and the San Marco end (y > 336), where the outline divides into four
 * fingers (the northbound link to the left, the two I-95 carriageways
 * together, the path, and the southbound link). The model draws every
 * finger inside the outline as its own girder, so the outline can be
 * listed: the box girders with their parapets and overhangs, the path's
 * girder, the hammerhead piers (one column under each girder) and pile
 * caps in the water. No road surfaces: a closing plate sits 0.3 m under
 * the map's roadways.
 *
 * Built with the girder and pier helpers from jax-acosta-bridge.ts.
 *
 * Frame: x across (+x to the SSW, the path's side), y along the bridge
 * toward San Marco (bearing 105.7, the outline's long axis), z up, metres.
 * Anchor -81.670114, 30.314987, the area centroid of the outline's main
 * ring. z = 0 is the map's water (Mapterhorn, -0.63 m NAVD88); lidar
 * heights +0.5 m.
 *
 * Roadway built to (lidar, southbound carriageway, map heights): 23.0 m at
 * the Riverside end (y = -600), 25.9 at -420, crest 27.7 m at y = -240..-180,
 * 26.2 at 0, 23.7 at 120, 21.7 at 240, 19.9 at 330 (grades about 1.0 %
 * west and 1.7 % east of the crest); the northbound carriageway 0.4 m lower
 * (1 m past y = 300). Both ends are in the air; the approaches continue
 * outside the outline.
 *
 * Replaces: the outline relation/19627685 (man_made=bridge; no building or
 * building:part under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline relation/19627685 and
 *   its fingers, the I-95 carriageways (ways 1107096448, 561639046,
 *   47248148), the links and the shared-use path.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   2 m grid; the lowest return across each carriageway every 30 m): the
 *   roadway profiles above and the San Marco fingers' drops. The path
 *   (opened 2023) postdates the flight; it is built level with the road
 *   (it runs beside the barrier at road level) and drops at an estimated
 *   2.5 % past the split.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 105.7): the
 *   banks under both ends, which decide which piers stand on pile caps.
 * - NAIP 2022 (USGS, public domain): plan, the path on the south side, and
 *   the channel piers at y = -300 and -246, from the fender dolphins and
 *   the piers' shadow lines.
 * - Published (Wikipedia, "Fuller Warren Bridge"): opened 2002, I-95, 75 ft
 *   (23 m) vertical clearance; the shared-use path opened 2023.
 * Photos (evidence, Wikimedia Commons):
 * - Jonathan Zander (Digon3), "Fuller Warren Bridge, Jacksonville FL 1
 *   Panorama.jpg", CC BY-SA 3.0 (from the south-west, before the path: the
 *   paired hammerhead piers with wide flared caps, the haunched channel
 *   spans, pale concrete):
 *   https://commons.wikimedia.org/wiki/File:Fuller_Warren_Bridge,_Jacksonville_FL_1_Panorama.jpg
 * - Bubba73 (Jud McCranie), "FullerWarrenBridge.jpg", CC BY-SA 3.0 (from
 *   the Riverside bank: the pier rhythm, the deck's shallow girders):
 *   https://commons.wikimedia.org/wiki/File:FullerWarrenBridge.jpg
 * - Bubba73, "Fuller Warren Bridge, Jacksonville, FL, US.jpg",
 *   CC BY-SA 3.0 (the whole length from the side):
 *   https://commons.wikimedia.org/wiki/File:Fuller_Warren_Bridge,_Jacksonville,_FL,_US.jpg
 *
 * Numbers
 * - Piers: the channel pair from NAIP; the others about 46 m apart
 *   (photo rhythm), estimated.
 * - Girder depth 6.5 m at the channel piers, 3.4 m mid channel span,
 *   2.8 m elsewhere (photo-estimated); the path's girder 1.8 m.
 * - Hammerheads: column 4.2 m across by 2.6 m, flaring over about a third
 *   of its height into a cap 1.5 m narrower than its girder (Zander photo);
 *   pile caps 1.5 m over the water.
 * - Colour: pale concrete #d9d4c6, undersides a shade darker (photos).
 * - Night: the path's lamps (`lamp`); the bridge itself is not floodlit.
 *
 * Doubts
 * - Pier spacing away from the channel is estimated; NAIP shows no piers
 *   under the deck.
 * - The path's railings are galvanised steel lattice on the real bridge,
 *   drawn as a plain parapet; its lamp posts are closer than the 60 m
 *   drawn, and its overlooks are left out.
 * - The San Marco fingers' heights past y = 480 are from a few lidar
 *   samples; the path's end slope is estimated.
 */
import { Part, writeGlb, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'
import { bead, chamferedRect, face, footedLoft, piecewise } from './bridge-kit'
import { girder, pier, stationList } from './jax-acosta-bridge'

// ---- Ground (Mapterhorn, metres above the map's water) ------------------------
// Riverside (west) land from y ≈ -440 (x < -40) / -470 (x > -20); San Marco (east)
// land from y ≈ 420 at x < -45, 545 at x ≈ -20; water under the rest of the fingers.
const ground = (x: number, y: number) => {
  if (y < 0) {
    const bank = x < -30 ? -430 : -465
    return y < bank - 10 ? piecewise([[-620, 5.8], [-540, 3.6], [-480, 2.0]])(y) : y < bank ? 1.0 : 0
  }
  // tools/terrain.ts grid: the bank runs diagonally under the San Marco fingers
  const bank = x < -45 ? 418 : x < -35 ? 428 : x < -25 ? 438 : x < -15 ? 545 : 1e9
  return y > bank + 10 ? piecewise([[-60, 3.6], [-40, 3.0], [-30, 1.8], [-20, 0.8]])(x) : y > bank ? 0.8 : 0
}

// ---- Roadways ------------------------------------------------------------------
// Lidar (FL_Peninsular_FDEM_Duval_2018, 2 m grid; the lowest return across each
// carriageway every 30 m, so cars and barriers drop out), +0.5 m to the map's water.
// ROAD is the southbound carriageway (x > 0, B); the northbound one (A, x < 0) reads
// about 0.4 m lower along the river (cross-fall), 1 m lower past y = 300.
const LIFT = 0.5
const ROAD_B = piecewise([
  [-600, 22.5], [-570, 23.3], [-540, 23.8], [-510, 24.2], [-480, 24.8], [-450, 25.0], [-420, 25.4], [-390, 26.1], [-360, 26.2],
  [-330, 26.5], [-300, 26.7], [-270, 26.9], [-240, 27.2], [-210, 27.2], [-180, 27.2], [-150, 27.1], [-120, 26.9], [-90, 26.7],
  [-60, 26.4], [-30, 26.2], [0, 25.7], [30, 25.3], [60, 24.8], [90, 24.3], [120, 23.7], [150, 23.2], [180, 22.4], [210, 21.8],
  [240, 21.2], [270, 20.6], [300, 20.0], [330, 19.4], [360, 18.9], [400, 18.4],
])
const road = (y: number) => ROAD_B(y) + LIFT
const roadA = (y: number) => road(y) - piecewise([[-600, 0.4], [250, 0.4], [330, 1.0]])(y)
const CREST = -210
// The San Marco fingers drop away from where they leave the main deck (y = 336):
// lidar along each (F1 x ≈ -40, F2 x ≈ -24, F4 x ≈ 22 then 10); the path (F3, built
// 2021–23, after the flight) estimated at 2.5 %.
const finger = (base: (y: number) => number, drop: [number, number][]) => {
  const f = piecewise(drop)
  return (y: number) => base(336) + f(y)
}
const roadF1 = finger(roadA, [[336, 0], [420, -1.5], [480, -3.0], [576, -3.8]])
const roadF2 = finger(roadA, [[336, 0], [400, -1.3], [440, -2.6], [480, -3.4], [520, -3.8], [592, -4.5]])
const roadF2b = finger(road, [[336, 0], [400, -1.3], [440, -2.6], [480, -3.4], [520, -3.8], [592, -4.5]])
const roadF4 = finger(road, [[336, 0], [380, -1.0], [420, -2.6], [460, -4.6], [510, -7.8], [595, -10]])
const roadPath = finger(road, [[336, 0], [546, -5.2]])

// ---- Plan (OSM outline, in the frame) --------------------------------------------
const Y_W = -584, Y_E = 595
const L_EDGE = piecewise([[-574, -57], [-528, -46], [-513, -42], [-482, -37], [-443, -31], [-394, -26], [-311, -21], [-245, -20], [-159, -19],
  [-78, -18], [201, -18], [249, -19], [274, -21], [297, -23], [320, -26], [334, -28]])
const PATH_R = piecewise([[-439, 37], [-394, 36], [-325, 36], [69, 36], [141, 37], [206, 39], [250, 41], [338, 43]])
const PATH_W = 6.5 // the path's deck, 4.3 m path plus railings and its barrier
const PATH_L = (y: number) => PATH_R(y) - PATH_W
const W_RIGHT = piecewise([[-584, -0.5], [-520, 11], [-495, 15], [-470, 18], [-439, 21]]) // the roads' right edge west of the path
// carriageway centrelines (OSM ways 1107096448/561639046 and 47248148), split midway between them
const A_C = piecewise([[-578, -32], [-520, -22], [-499, -19], [-451, -13], [-403, -9], [-305, -4], [334, -4]])
const B_C = piecewise([[-581, -14], [-540, -7], [-492, 0], [-444, 5], [-393, 10], [-345, 12], [-296, 13], [334, 14]])
const SPLIT = (y: number) => (A_C(y) + B_C(y)) / 2
const GAP = 0.6
// the San Marco fingers (outline edges)
const F1L = piecewise([[334, -28], [343, -30], [354, -32], [365, -34], [377, -36], [388, -39], [576, -82]])
const F1R = piecewise([[334, -19], [348, -21], [360, -23], [373, -26], [385, -28], [578, -73]])
const F2L = F1R
const F2R = piecewise([[336, 23], [350, 21], [363, 20], [377, 19], [393, 17], [408, 15], [423, 13], [440, 10], [455, 7], [470, 4], [482, 2], [498, -2], [513, -5], [527, -9], [592, -28]])
const F2L_ = piecewise([[334, -19], [351, -18], [369, -20], [386, -22], [402, -24], [417, -26], [431, -28], [446, -31], [462, -34], [476, -37], [490, -40], [504, -44], [518, -47], [533, -51], [581, -65]])
const F4L = piecewise([[336, 25], [352, 24], [366, 23], [379, 22], [390, 21], [400, 20], [409, 19], [421, 17], [431, 15], [446, 12], [462, 9], [478, 5], [592, -27]])
const F4R = piecewise([[337, 38], [350, 38], [359, 37], [369, 37], [378, 36], [388, 35], [397, 34], [407, 33], [416, 31], [426, 30], [436, 28], [447, 25], [458, 23], [468, 20], [595, -16]])
const F3L = piecewise([[337, 39], [355, 39], [366, 38], [377, 38], [388, 37], [399, 35], [409, 34], [420, 32], [431, 31], [441, 28], [452, 26], [463, 23], [546, -1]])
const F3R = piecewise([[338, 43], [347, 43], [357, 43], [368, 42], [379, 42], [389, 41], [401, 39], [411, 38], [422, 36], [433, 34], [443, 32], [454, 30], [465, 27], [547, 3]])
void F2L

// ---- Spans -----------------------------------------------------------------------
// The haunched channel unit (the photos' three deep spans), then prestressed girder
// spans of about 46 m (photo rhythm) toward both ends.
// The channel piers from NAIP: the fender dolphins and the piers' shadow lines at
// y ≈ -300 and -246.
const MAIN: [number, number] = [-300, -246]
const PIERS = [
  -538, -492, -446, -396, -348, MAIN[0], MAIN[1], -190,
  ...Array.from({ length: 17 }, (_, i) => -144 + 46 * i), // -144 .. 592
].filter((y) => y > Y_W + 5 && y < Y_E - 5)
const depth = (y: number) => {
  const [a, b] = MAIN
  if (y > a && y < b) { const t = (y - (a + b) / 2) / ((b - a) / 2); return 3.4 + (6.5 - 3.4) * t * t }
  const d = Math.min(Math.abs(y - a), Math.abs(y - b))
  return d < 40 ? 2.8 + (6.5 - 2.8) * (1 - d / 40) ** 2 : 2.8
}

// ---- Materials ---------------------------------------------------------------------
const CONCRETE: MaterialSpec = finish('fuller-warren-concrete', 0xd9d4c6)
const SHADE: MaterialSpec = finish('fuller-warren-concrete-shade', 0xbab5a8)
const DECK: MaterialSpec = PALETTE.roof
const POLE: MaterialSpec = finish('fuller-warren-pole', 0x3a3f44)
const LAMP: MaterialSpec = { name: 'lamp', color: 0x9aa0a6, roughness: 0.6 }

type K = { concrete: Part; shade: Part; deck: Part; pole: Part; lamp: Part }

/** A hammerhead pier: a column (w × d) from the ground or a pile cap, flaring into a cap `capW` wide under the girder. */
function hammerhead(k: K, y: number, x: number, w: number, capW: number, top: number) {
  const water = [x - w / 2 - 2, x, x + w / 2 + 2].every((xx) => ground(xx, y) < 0.5) // a pile cap only wholly in the water
  const g = (xx: number, yy: number) => ground(xx, yy)
  let foot: number | 'ground' = 'ground'
  if (water) {
    footedLoft(k.concrete, g, [
      { plan: chamferedRect(x - w / 2 - 2, x + w / 2 + 2, y - 4, y + 4, 0), z: 'ground' },
      { plan: chamferedRect(x - w / 2 - 2, x + w / 2 + 2, y - 4, y + 4, 0), z: 1.5 },
    ], 50)
    foot = 1.5
  }
  const d = 2.6
  const col = chamferedRect(x - w / 2, x + w / 2, y - d / 2, y + d / 2, 0)
  const cap = chamferedRect(x - capW / 2, x + capW / 2, y - d / 2 - 0.2, y + d / 2 + 0.2, 0)
  const flare = Math.min(4.5, Math.max(1.5, (top - (typeof foot === 'number' ? foot : 0)) * 0.3))
  footedLoft(k.concrete, g, [
    { plan: col, z: foot }, { plan: col, z: top - flare - 1.2 }, { plan: cap, z: top - 1.2 }, { plan: cap, z: top },
  ], 50, true)
}

export function build(): K {
  const k: K = { concrete: new Part(), shade: new Part(), deck: new Part(), pole: new Part(), lamp: new Part() }
  const zones: [number, number, number][] = [[MAIN[0] - 40, MAIN[1] + 40, 12]]
  const all = stationList(Y_W, Y_E, 46, zones, [-439, -305, 334, 336, ...PIERS])
  const seg = (a: number, b: number) => all.filter((y) => y >= a && y <= b)
  const c = (v: number) => () => v
  // Riverside end: two road girders (the path joins at -439)
  girder(k, { ys: seg(Y_W, -305), road: roadA, depth, xl: L_EDGE, xr: (y) => SPLIT(y) - GAP, sides: [true, false] })
  girder(k, { ys: seg(Y_W, -439), road, depth, xl: (y) => SPLIT(y) + GAP, xr: W_RIGHT, sides: [false, true] })
  girder(k, { ys: seg(-439, -305), road, depth, xl: (y) => SPLIT(y) + GAP, xr: (y) => PATH_L(y) - 0.3, sides: [false, true], ends: [false, true] })
  // the river: two road girders and the path
  girder(k, { ys: seg(-305, 334), road: roadA, depth, xl: L_EDGE, xr: (y) => SPLIT(y) - GAP, sides: [true, false], ends: [false, false] })
  girder(k, { ys: seg(-305, 336), road, depth, xl: (y) => SPLIT(y) + GAP, xr: (y) => PATH_L(y) - 0.3, sides: [false, true], ends: [false, false] })
  girder(k, { ys: seg(-439, 338), road, depth: c(1.8), xl: PATH_L, xr: PATH_R, sides: [false, true], over: 1.5, fascia: 0.9, parapet: 1.2 })
  // San Marco fingers
  const fy = (a: number, b: number) => [...new Set([...seg(a, b), b])].sort((p, q) => p - q)
  girder(k, { ys: fy(334, 576), road: roadF1, depth, xl: F1L, xr: F1R, sides: [true, true], ends: [false, true] })
  const f2mid = (y: number) => (F2L_(y) + F2R(y)) / 2
  girder(k, { ys: fy(334, 581), road: roadF2, depth, xl: F2L_, xr: (y) => f2mid(y) - GAP, sides: [true, false], ends: [true, true] })
  girder(k, { ys: fy(336, 592), road: roadF2b, depth, xl: (y) => f2mid(y) + GAP, xr: F2R, sides: [false, true], ends: [true, true] })
  girder(k, { ys: fy(337, 546), road: roadPath, depth: c(1.8), xl: F3L, xr: F3R, sides: [false, true], over: 1.5, fascia: 0.9, parapet: 1.2, ends: [false, true] })
  girder(k, { ys: fy(336, 592), road: roadF4, depth, xl: F4L, xr: F4R, sides: [true, true], ends: [true, true] })

  // piers: a hammerhead under each road girder (and each finger past the split)
  for (const y of PIERS) {
    const top = (r: (y: number) => number) => r(y) - depth(y)
    const spans: [number, number, (y: number) => number][] = []
    if (y < -305) {
      spans.push([L_EDGE(y), SPLIT(y), roadA], [SPLIT(y), y < -439 ? W_RIGHT(y) : PATH_R(y), road])
    } else if (y < 334) {
      spans.push([L_EDGE(y), SPLIT(y), roadA], [SPLIT(y), PATH_R(y), road])
    } else {
      spans.push([F1L(y), F1R(y), roadF1], [F2L_(y), (F2L_(y) + F2R(y)) / 2, roadF2], [(F2L_(y) + F2R(y)) / 2, F2R(y), roadF2b], [F4L(y), F4R(y), roadF4], [F3L(y), F3R(y), roadPath])
    }
    for (const [x0, x1, r] of spans) {
      const wid = x1 - x0
      if (wid < 4) continue
      hammerhead(k, y, (x0 + x1) / 2, Math.min(4.2, wid * 0.3), Math.max(4, wid - 1.5), top(r) + 0.05)
    }
  }

  // the path's lamp posts, every 60 m on its outer railing
  for (let y = -420; y < 330; y += 60) {
    const x = PATH_R(y) - 0.4, z = road(y)
    face(k.pole, [x - 0.12, y, z], [x + 0.12, y, z], [x + 0.12, y, z + 5.5], [x - 0.12, y, z + 5.5], [0, -1, 0])
    face(k.pole, [x, y - 0.12, z], [x, y + 0.12, z], [x, y + 0.12, z + 5.5], [x, y - 0.12, z + 5.5], [1, 0, 0])
    bead(k.lamp, [x - 0.8, y, z + 5.4], 0.45, true)
  }
  return k
}

if (import.meta.main) {
  const k = build()
  const list = [
    { part: k.concrete, material: CONCRETE }, { part: k.shade, material: SHADE }, { part: k.deck, material: DECK },
    { part: k.pole, material: POLE }, { part: k.lamp, material: LAMP },
  ].filter((p) => p.part.triangles > 0)
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Fuller Warren Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, at the map water',
    bearing: 105.7, roadway: { crest: road(CREST), crestAt: CREST, riversideEnd: road(Y_W), sanMarcoEnd: road(Y_E) },
  })
  console.log(`jax-fuller-warren-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-fuller-warren-bridge.glb', import.meta.url), glb)
}
