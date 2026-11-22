/**
 * Acosta Bridge (St. Elmo W. Acosta Bridge), Jacksonville (1994) —
 * procedural, CC0-1.0, no textures.
 * bun generators/jax-acosta-bridge.ts
 *
 * The concrete segmental box-girder bridge carrying SR 13 (six lanes, two
 * sidewalks) over the St. Johns River from Southbank to downtown, with the
 * JTA Skyway's two guideway beams in its median. One placement for the
 * structure inside the OSM outline relation/9494151: the two box girders
 * (one under each carriageway, an open slot between them where the outline
 * has its inner ring), their parapets and sidewalks' outer walls, the
 * haunched main span over the channel, the paired pier walls and pile caps,
 * and the Skyway beams standing on the girders' inner edges. No road
 * surfaces: a closing plate sits 0.3 m under the map's roadway.
 *
 * Also exports the girder and pier helpers that jax-fuller-warren-bridge.ts
 * builds with (merge this generator first).
 *
 * Frame: x across (+x to the ENE, downstream), y along the bridge toward
 * downtown (bearing 330.7, the outline's long axis), z up, metres. Anchor
 * -81.664165, 30.321715, the area centroid of the outline (outer minus
 * inner ring). z = 0 is the map's water (Mapterhorn, -0.63 m NAVD88); the
 * lidar's water reads +0.03 m NAVD88, so lidar heights are used +0.5 m.
 *
 * Roadway built to (lidar, FL_Peninsular_FDEM_Duval_2018, the carriageway
 * at x = -12, +0.5 m): 15.0 m at the Southbank end (y = -344), 22.8 at
 * y = -200, 28.0 at -104, crest 31.0 m at y = 0..30, 30.0 at 100, 25.4 at
 * 196, 19.6 at 292, 16.7 m at the downtown end (y = 340); grades about
 * 5.2 % south and 5.7 % north. Both ends are in the air; the approaches
 * continue outside the outline.
 *
 * Replaces: the outline relation/9494151 (man_made=bridge; no building or
 * building:part under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline relation/9494151
 *   (outer way 684236915, inner way 1427835025 = the open median slot,
 *   y = -230..273), the carriageways and the JTA Skyway ways in the median.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   1 m grid): the roadway profile above; deck edges at x = ±24 (46.1 m
 *   published), widening to the outline's -35..31 at the downtown end
 *   where the ramps join; the Skyway beams at x = ±4, 1.3 m above the
 *   road, with water seen between them (the slot).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 330.7):
 *   water from y = -290 to 265 under the bridge; Southbank 2.6 m, downtown
 *   2.3 m.
 * - NAIP 2022 (USGS, public domain): plan; the two main piers' pile caps
 *   beside the deck at y = -38 and 150 (scaled from the FEC bascule's
 *   OSM length), a third cap near the Southbank shore (y = -245).
 * - Published (Wikipedia, "Acosta Bridge"): opened August 1994; continuous
 *   prestressed concrete segmental box girder; 1,645 ft (501 m) long,
 *   151.3 ft (46.1 m) wide; longest span 630 ft (190 m; 188 m between the
 *   NAIP pile caps); clearance 81 ft (25 m); its blue neon lights replaced
 *   by LEDs in 2019–2020.
 * Photos (evidence, Wikimedia Commons):
 * - Mark Kortum, "Downtown Jacksonville, New Acosta Bridge.jpg",
 *   CC BY-SA 2.0 (from the west: the haunched main span, the wide pier
 *   walls, pale concrete, the blue light line on the parapet):
 *   https://commons.wikimedia.org/wiki/File:Downtown_Jacksonville,_New_Acosta_Bridge.jpg
 * - Michael Rivera, "Acosta Bridge from Jacksonville Landing.JPG",
 *   CC BY-SA 3.0 (from the north-east: the whole profile, the paired
 *   piers, span rhythm):
 *   https://commons.wikimedia.org/wiki/File:Acosta_Bridge_from_Jacksonville_Landing.JPG
 * - Gregory Urbano, "Acosta Bridge (39527390202).jpg", CC BY 2.0 (night,
 *   from the south-west: the piers lit warm, the lamps):
 *   https://commons.wikimedia.org/wiki/File:Acosta_Bridge_(39527390202).jpg
 * - PicoOrdinalo, "St. Elmo W. Acosta Bridge 1.jpg", CC BY-SA 4.0 (under
 *   the downtown approach: the box sections and overhangs):
 *   https://commons.wikimedia.org/wiki/File:St._Elmo_W._Acosta_Bridge_1.jpg
 *
 * Numbers
 * - Piers at y = -320 (land), -245, -140, -38 and 150 (main), 222, 290
 *   (land): the main pair and -245 from NAIP; the others estimated from the
 *   Landing photo's span rhythm.
 * - Box depth 12.5 m at the main piers (Kortum photo: the girder at the
 *   pier is about 0.8 of the column's height over the pile cap), 4.2 m mid
 *   main span (photo-scaled; the 25 m clearance with the 30.4 m road
 *   agrees), easing to 4.0 m in the side spans over 80 m (Kortum: the side
 *   span's soffit is still about half depth some 70 m out); overhangs
 *   4.5 m, fascia 1.1 m (photo).
 * - Main pier columns near square, 11.5 m across by 9 m along under each
 *   girder, on a pile cap 1.5 m over the water and 14 m along (Kortum,
 *   scaled from the 23 m between the two columns); other piers 7 × 3.2 m
 *   on caps 2.5 m over the water (photo-estimated).
 * - Parapets 1.0 m; Skyway beams 1.0 m wide, top 1.3 m over the road
 *   (lidar).
 * - Colour: pale concrete #dcd8cd, its undersides a shade darker (photos).
 * - Night: the blue LED line along both outer parapets (`neon`, the
 *   bridge's blue); the piers and soffit floodlit warm (Urbano photo).
 *
 * Doubts
 * - Pier positions other than the NAIP three are estimated, and the photos
 *   can't settle the side spans' haunches; drawn as gentle haunches.
 * - Since 2020 the LEDs can show other colours; drawn in their blue.
 * - Light poles and the median barriers are left out.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face, footedLoft, chamferedRect, piecewise, stations } from './bridge-kit'

// ---- Shared helpers (also used by jax-fuller-warren-bridge.ts) --------------

export type GirderParts = { concrete: Part; shade: Part; deck: Part; neon?: Part }

/**
 * One box girder between plan edges xl(y) < xr(y), hung from the roadway
 * road(y): a closing plate 0.3 m under the road, and on each side asked for
 * a parapet with the fascia under it, the overhang's underside and the web;
 * a side not asked for is a plain wall (an inner edge beside a slot or a
 * neighbouring girder). The soffit runs between the webs at road - depth.
 */
export type Girder = {
  ys: number[]
  xl: (y: number) => number
  xr: (y: number) => number
  road: (y: number) => number
  depth: (y: number) => number
  sides: [boolean, boolean] // parapet + overhang on the left (xl) and right (xr) edges
  over?: number // overhang reach
  fascia?: number
  parapet?: number // height over the road
  neon?: boolean
  ends?: [boolean, boolean]
}

export function girder(k: GirderParts, g: Girder) {
  const ys = [...g.ys].sort((a, b) => a - b)
  if (ys.length < 2) return
  const over = g.over ?? 4.5, F = g.fascia ?? 1.1, PH = g.parapet ?? 1.0, PW = 0.45
  const R = g.road
  const edge = (side: number) => (side < 0 ? g.xl : g.xr)
  const web = (side: number, y: number) => edge(side)(y) - side * (g.sides[side < 0 ? 0 : 1] ? over : 0)
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    for (const side of [-1, 1]) {
      const n: V3 = [side, 0, 0], e = edge(side)
      if (g.sides[side < 0 ? 0 : 1]) {
        // parapet: outer face from the fascia's foot to its top, top, inner face
        face(k.concrete, [e(a), a, R(a) - F], [e(b), b, R(b) - F], [e(b), b, R(b) + PH], [e(a), a, R(a) + PH], n)
        face(k.concrete, [e(a), a, R(a) + PH], [e(b), b, R(b) + PH], [e(b) - side * PW, b, R(b) + PH], [e(a) - side * PW, a, R(a) + PH], [0, 0, 1])
        face(k.concrete, [e(a) - side * PW, a, R(a) - 0.3], [e(b) - side * PW, b, R(b) - 0.3], [e(b) - side * PW, b, R(b) + PH], [e(a) - side * PW, a, R(a) + PH], [-side, 0, 0])
        if (g.neon && k.neon) {
          const xo = (y: number) => e(y) + side * 0.03
          face(k.neon, [xo(a), a, R(a) + PH - 0.35], [xo(b), b, R(b) + PH - 0.35], [xo(b), b, R(b) + PH - 0.1], [xo(a), a, R(a) + PH - 0.1], n)
        }
        // overhang underside, sloping down to the web
        face(k.shade, [e(a), a, R(a) - F], [e(b), b, R(b) - F], [web(side, b), b, R(b) - F - 0.5], [web(side, a), a, R(a) - F - 0.5], [side * 0.1, 0, -1])
        face(k.concrete, [web(side, a), a, R(a) - F - 0.5], [web(side, b), b, R(b) - F - 0.5], [web(side, b), b, R(b) - g.depth(b)], [web(side, a), a, R(a) - g.depth(a)], n)
      } else {
        face(k.concrete, [e(a), a, R(a) - 0.3], [e(b), b, R(b) - 0.3], [e(b), b, R(b) - g.depth(b)], [e(a), a, R(a) - g.depth(a)], n)
      }
    }
    face(k.shade, [web(-1, a), a, R(a) - g.depth(a)], [web(1, a), a, R(a) - g.depth(a)], [web(1, b), b, R(b) - g.depth(b)], [web(-1, b), b, R(b) - g.depth(b)], [0, 0, -1])
    const il = (y: number) => g.xl(y) + (g.sides[0] ? PW : 0), ir = (y: number) => g.xr(y) - (g.sides[1] ? PW : 0)
    face(k.deck, [il(a), a, R(a) - 0.3], [ir(a), a, R(a) - 0.3], [ir(b), b, R(b) - 0.3], [il(b), b, R(b) - 0.3], [0, 0, 1])
  }
  // closed ends
  const ends = g.ends ?? [true, true]
  for (const [y, s, on] of [[ys[0], -1, ends[0]], [ys[ys.length - 1], 1, ends[1]]] as [number, number, boolean][]) {
    if (!on) continue
    const n: V3 = [0, s, 0], r = R(y)
    face(k.concrete, [web(-1, y), y, r - g.depth(y)], [web(1, y), y, r - g.depth(y)], [web(1, y), y, r - 0.3], [web(-1, y), y, r - 0.3], n)
    for (const side of [-1, 1]) if (g.sides[side < 0 ? 0 : 1]) {
      const e = edge(side)(y), w = web(side, y)
      face(k.concrete, [e, y, r - F], [w, y, r - F - 0.5], [w, y, r - 0.3], [e, y, r + PH], n)
    }
  }
}

/**
 * A pier: a pile cap from the ground (or the water) to `capTop` (none when
 * capTop is 0 or less), then columns (centre x, width across, depth along)
 * up to `top`, each a chamfered box whose foot follows the terrain.
 */
export function pier(
  p: Part, ground: (x: number, y: number) => number, y: number,
  cols: { x: number; w: number; d: number }[], top: number,
  cap?: { x0: number; x1: number; d: number; top: number },
) {
  let foot: number | 'ground' = 'ground'
  if (cap && cap.top > 0) {
    footedLoft(p, ground, [
      { plan: chamferedRect(cap.x0, cap.x1, y - cap.d / 2, y + cap.d / 2, 0.8), z: 'ground' },
      { plan: chamferedRect(cap.x0, cap.x1, y - cap.d / 2, y + cap.d / 2, 0.8), z: cap.top },
    ], 6)
    foot = cap.top
  }
  for (const c of cols) {
    const plan = chamferedRect(c.x - c.w / 2, c.x + c.w / 2, y - c.d / 2, y + c.d / 2, Math.min(c.w, c.d) * 0.15)
    footedLoft(p, ground, [{ plan, z: foot }, { plan, z: top }], 6, false)
  }
}

/** Stations from a to b: `fine` apart inside the given zones, `coarse` elsewhere, plus extra points. */
export function stationList(a: number, b: number, coarse: number, zones: [number, number, number][] = [], extra: number[] = []) {
  const out = new Set<number>(stations(a, b, coarse).map((v) => Math.round(v * 100) / 100))
  for (const [z0, z1, step] of zones) for (const v of stations(Math.max(a, z0), Math.min(b, z1), step)) out.add(Math.round(v * 100) / 100)
  for (const v of extra) if (v >= a && v <= b) out.add(v)
  return [...out].sort((p, q) => p - q)
}

// ---- Acosta ------------------------------------------------------------------

const Y0 = -346, Y1 = 330 // the outline's ends
const LIFT = 0.5 // lidar to map water

const road = (() => {
  const f = piecewise([
    [-344, 14.5], [-284, 17.7], [-200, 22.3], [-152, 24.9], [-104, 27.5], [-56, 29.4], [-20, 30.2],
    [10, 30.5], [40, 30.4], [64, 30.15], [100, 29.5], [148, 27.6], [196, 24.9], [244, 22.1], [292, 19.1], [340, 16.2],
  ])
  return (y: number) => f(y) + LIFT
})()

// deck edges (lidar ±24; the outline's widening at the ends)
const XL = piecewise([[-346, -27], [-300, -23], [-229, -22.5], [190, -26.5], [250, -27.5], [300, -31], [330, -35]])
const XR = piecewise([[-346, 30], [-267, 27], [194, 23.5], [250, 26.5], [300, 29], [330, 31]])
const SLOT: [number, number] = [-230, 273] // the open median (the outline's inner ring)
const SLOT_X = 2.4

const MAIN = [-38, 150]
const PIERS = [-320, -245, -140, ...MAIN, 222, 290]
const ground = (_x: number, y: number) => piecewise([[-310, 2.6], [-290, 0], [262, 0], [275, 2.3]])(y)

function depth(y: number): number {
  const [a, b] = MAIN
  if (y > a && y < b) {
    const t = (y - (a + b) / 2) / ((b - a) / 2) // -1..1
    return MID_D + (PIER_D - MID_D) * t * t
  }
  const d = Math.min(Math.abs(y - a), Math.abs(y - b))
  return d < SIDE_HAUNCH ? 4.0 + (PIER_D - 4.0) * (1 - d / SIDE_HAUNCH) ** 2 : 4.0
}
const PIER_D = 12.5, MID_D = 4.2, SIDE_HAUNCH = 80 // Kortum photo: depth at the pier ~0.9 of the column's height over the cap

const CONCRETE: MaterialSpec = { ...finish('acosta-concrete', 0xdcd8cd), floodlight: (p, n) => (n[2] < -0.5 ? 0.6 : p[2] < 18 ? 0.5 : 0.15) }
const SHADE: MaterialSpec = { ...finish('acosta-concrete-shade', 0xbdb9ae), floodlight: () => 0.55 }
const DECK: MaterialSpec = PALETTE.roof
const NEON: MaterialSpec = finish('neon-acosta-blue', 0x3f7fe0, 0.5)
const BEAM: MaterialSpec = finish('skyway-beam', 0xcfcabd)

function build() {
  const k = { concrete: new Part(), shade: new Part(), deck: new Part(), neon: new Part(), beam: new Part() }
  const zones: [number, number, number][] = [[MAIN[0] - 80, MAIN[1] + 80, 9], [-300, -100, 25], [200, 330, 20]]
  const ys = stationList(Y0, Y1, 30, zones, [SLOT[0], SLOT[1], ...PIERS])
  const inSlot = (y: number) => y >= SLOT[0] && y <= SLOT[1]
  // the two girders beside the slot, and one girder past its ends
  const slotYs = ys.filter(inSlot)
  for (const side of [-1, 1]) {
    girder(k, {
      ys: slotYs, road, depth,
      xl: side < 0 ? XL : () => SLOT_X, xr: side < 0 ? () => -SLOT_X : XR,
      sides: side < 0 ? [true, false] : [false, true], neon: true, ends: [false, false],
    })
  }
  girder(k, { ys: ys.filter((y) => y <= SLOT[0]), road, depth, xl: XL, xr: XR, sides: [true, true], neon: true })
  girder(k, { ys: ys.filter((y) => y >= SLOT[1]), road, depth, xl: XL, xr: XR, sides: [true, true], neon: true })

  // Skyway guideway beams on the girders' inner edges (lidar x = ±4, 1.3 m over the road)
  const bys = stationList(Y0, Y1, 30, zones)
  for (const xc of [-3.9, 3.9]) {
    for (let i = 0; i < bys.length - 1; i++) {
      const a = bys[i], b = bys[i + 1]
      const t = (y: number) => road(y) + 1.3, bo = (y: number) => road(y) - 0.3
      for (const s of [-1, 1]) face(k.beam, [xc + s * 0.5, a, bo(a)], [xc + s * 0.5, b, bo(b)], [xc + s * 0.5, b, t(b)], [xc + s * 0.5, a, t(a)], [s, 0, 0])
      face(k.beam, [xc - 0.5, a, t(a)], [xc + 0.5, a, t(a)], [xc + 0.5, b, t(b)], [xc - 0.5, b, t(b)], [0, 0, 1])
    }
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][])
      face(k.beam, [xc - 0.5, y, road(y) - 0.3], [xc + 0.5, y, road(y) - 0.3], [xc + 0.5, y, road(y) + 1.3], [xc - 0.5, y, road(y) + 1.3], [0, s, 0])
  }

  // piers: two walls per line, one under each girder
  for (const y of PIERS) {
    const main = MAIN.includes(y)
    const top = road(y) - depth(y) + 0.05
    const xl = XL(y), xr = XR(y)
    const cx = [(xl + 4.5 + -SLOT_X) / 2, (SLOT_X + xr - 4.5) / 2]
    const water = ground(0, y) < 0.5
    const cols = cx.map((x) => (main ? { x, w: 11.5, d: 9 } : { x, w: 7, d: 3.2 }))
    pier(k.concrete, ground, y, cols, top, water ? { x0: xl + 2, x1: xr - 2, d: main ? 14 : 6, top: main ? 1.5 : 2.5 } : undefined)
  }
  return k
}

if (import.meta.main) {
  const k = build()
  const list = [
    { part: k.concrete, material: CONCRETE }, { part: k.shade, material: SHADE }, { part: k.deck, material: DECK },
    { part: k.neon, material: NEON }, { part: k.beam, material: BEAM },
  ].filter((p) => p.part.triangles > 0)
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Acosta Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, at the map water',
    bearing: 330.7, roadway: { southEnd: road(-344), crest: road(20), crestAt: 20, downtownEnd: road(330) },
  })
  console.log(`jax-acosta-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-acosta-bridge.glb', import.meta.url), glb)
}
