/**
 * Main Street Bridge (John T. Alsop Jr. Bridge), Jacksonville (1941) —
 * procedural, CC0-1.0, no textures.
 * bun generators/jax-main-street-bridge.ts
 *
 * The blue vertical-lift bridge carrying US 1 / US 90 Alternate (Main Street)
 * over the St. Johns River from Southbank to downtown. One placement for the
 * whole structure inside the OSM outline: the two steel lift towers with
 * their counterweight housings, the lift span (a through truss with a gently
 * arched top chord), the two side spans (through trusses whose top chords
 * fall to the deck at their outer ends), the plate-girder approach over the
 * water on the Southbank side, the concrete piers, the sidewalks outside the
 * trusses (the model's own walkways) and their railings. No road surface:
 * the map draws Main Street's carriageways between the trusses.
 *
 * Frame: x across (+x to the ESE, the downstream side), y along the bridge
 * toward downtown (bearing 4.7, the outline's long edges), z up, metres.
 * Anchor -81.65866, 30.32184: the area centroid of the outline way/590221019
 * (the lead's point, -81.65859 30.32258, is 82 m north of it, at mid-river).
 * z = 0 is the map's water (Mapterhorn, -0.63 m NAVD88); the lidar's water
 * reads -0.12 m, so lidar heights are used +0.5 m.
 *
 * Roadway built to (lidar, FL_Peninsular_FDEM_Duval_2018, 10th percentile
 * of the deck across ±6 m, +0.5 m to the map's water): 2.4 m on the
 * Southbank land, 3.4 m at the south bank (y = -120), climbing at 5.0 % to
 * 13.2 m at the south tower (y = 76), 13.7 m at the lift span's ends,
 * cresting at 14.8 m mid-lift-span (y = 137), then down at 5.0 % from the
 * north tower to 9.6 m at the downtown end (y = 268), which is in the air
 * (the map's terrain there is 2 m; the approach continues past the outline).
 * The bridge is symmetric about y = 137 (towers at 77.5 and 196.5).
 *
 * Replaces: the man_made=bridge outline way/590221019 (bridge:structure=truss;
 * no building or building:part under it). The Southbank Riverwalk's bridge
 * outlines beside it (ways 1376883498, 1427207321, 1433700579, ...) are
 * separate structures and are left to the map.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/590221019
 *   (Q6736098), 511 m long and 20 m wide.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   1 m grid over the whole bridge): tower tops 63 m over the water, the
 *   housings 17 m across the bridge by 6 m along it, at y = 74.5–80.5 and
 *   193.5–199.5; lift-span top chord 26 m at the towers, 29 m mid-span;
 *   side-span top chords 25 m at the towers falling to 17 m 4–6 m inside the
 *   ends (y = 6 and 268); trusses at x ≈ ±8, sidewalks outside them to ±10.5;
 *   the roadway profile above.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 4.7, 10 m):
 *   water from y = -150 to 240; Southbank 0.7–1.2 m under the bridge, 2 m to
 *   the sides; the downtown bank 2 m from y = 250.
 * - NAIP 2022 (USGS, public domain): plan, the approach over the water, the
 *   bank lines.
 * - Published (Wikipedia, "Main Street Bridge (Jacksonville)"): opened July
 *   1941; 1,680 ft (512 m) long, 58 ft (18 m) wide; longest span 365 ft
 *   (111 m; the lift span, 113 m between the tower faces here); clearance
 *   35 ft closed, 135 ft open.
 * Photos (evidence, Wikimedia Commons):
 * - DXR, "John T. Alsop Jr. Bridge, Jacksonville FL, Southwest view
 *   20160706 1.jpg", CC BY-SA 4.0 (the towers' faces: counterweight housing
 *   with vertical openings, two X-braced bays under it, braced legs under the
 *   deck, the tower piers; the truss pattern; the approach pier):
 *   https://commons.wikimedia.org/wiki/File:John_T._Alsop_Jr._Bridge,_Jacksonville_FL,_Southwest_view_20160706_1.jpg
 * - Bubba73 (Jud McCranie), "Main Street Bridge, Jacksonville, FL, US.jpg",
 *   CC BY-SA 4.0 (from the Southbank to the east: the whole bridge, the
 *   girder approach and its piers):
 *   https://commons.wikimedia.org/wiki/File:Main_Street_Bridge,_Jacksonville,_FL,_US.jpg
 * - Jonathan Zander (Digon3), "Main St Bridge, Jacksonville FL Pano.jpg",
 *   CC BY-SA 3.0 (from the Southbank: colour, truss panels):
 *   https://commons.wikimedia.org/wiki/File:Main_St_Bridge,_Jacksonville_FL_Pano.jpg
 *
 * Numbers
 * - Towers: four legs 1.3 m square at x = ±8, 5.2 m apart along the bridge;
 *   the housing from 43 m to the top (photo-scaled from the 63.6 m lidar
 *   top: housing about a third of the height), pale grey-blue (#9db3c8,
 *   the DXR photo) in a blue corner frame; on each across face six tall
 *   dark slots (46–56 m) and a row of six short openings under the top
 *   (58–62 m), photo-scaled; two X-braced bays between 26 and
 *   43 m on every face, one braced bay under the deck (photo).
 * - Truss panels: lift span 12 of 9.3 m, side spans a 6 m end panel and 7 of
 *   8.9 m (estimated from the photos); chords 0.8 m wide, members 0.5 m.
 * - Approach: plate girders 2.2 m deep under the road (photo), wall piers at
 *   y = -128, -96, -64, -32 (estimated from the photo's pier rhythm; NAIP
 *   can't see under the deck), the south abutment at -150 where the deck
 *   meets the bank.
 * - Tower piers 26 × 14 m, 3 m over the water; side-span end piers 4 m thick
 *   (photo-scaled).
 * - Colour: the bridge's sky blue from the daylight photos, #5b8fcc; the
 *   housing openings and undersides a dark blue-grey; concrete piers.
 * - Night: the bridge is lit blue (its towers and trusses are floodlit): the
 *   blue steel carries `_FLOODLIGHT`, strongest on the towers.
 *
 * Doubts
 * - Truss panel counts and the Parker sub-diagonals are simplified to a
 *   Warren truss with verticals; the approach pier positions are estimated.
 * - No detail model: the low model already draws the trusses open.
 * - The south end of the outline (y < -150) runs 90 m over Southbank land
 *   where the road is about on the ground; only the sidewalks and railings
 *   are drawn there.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { band, chamferedRect, face, footedLoft, parabola, piecewise, rod, stations, truss } from './bridge-kit'

// ---- Ground (map terrain, metres above the map's water) --------------------
const groundY = piecewise([[-240, 2.0], [-232, 0.9], [-162, 0.9], [-150, 0], [242, 0], [252, 2.0], [280, 2.0]])
const ground = (_x: number, y: number) => groundY(y)

// ---- Roadway (lidar +0.5) ----------------------------------------------------
const lift = parabola([84, 13.7], [137, 14.8], [190, 13.7])
const road = (y: number): number => {
  if (y < -150) return 2.4
  if (y < -120) return 2.4 + ((y + 150) / 30) * 1.0
  if (y <= 77.5) return 3.4 + 0.05 * (y + 120)
  if (y < 196.5) return Math.max(lift(y), 13.2)
  return 13.0 - 0.05 * (y - 196.5)
}
const walk = (y: number) => road(y) + 0.15

// ---- Plan --------------------------------------------------------------------
const Y_S = -240, Y_N = 271 // the outline's ends
const Y_ABUT = -150 // south abutment: the deck meets the bank
const TOWERS = [77.5, 196.5]
const T_HALF = 3 // the housing's half-length along the bridge (lidar 6 m)
const TX = 8 // truss and tower-leg planes
const WALK_IN = 8.5, WALK_OUT = 10.4 // sidewalks outside the trusses
const SIDE_S: [number, number] = [6, TOWERS[0] - T_HALF]
const LIFT: [number, number] = [TOWERS[0] + T_HALF + 0.5, TOWERS[1] - T_HALF - 0.5]
const SIDE_N: [number, number] = [TOWERS[1] + T_HALF, 268]
const APPROACH_PIERS = [-128, -96, -64, -32]

// ---- Materials ---------------------------------------------------------------
const flood = (p: V3, n: V3) => {
  const onTower = TOWERS.some((t) => Math.abs(p[1] - t) < T_HALF + 1)
  const up = n[2] > 0.7 ? 0.35 : 1
  return (onTower ? 1 : 0.65) * up
}
const BLUE: MaterialSpec = { ...finish('main-street-blue', 0x5b8fcc), doubleSided: true, floodlight: flood }
const SHADE: MaterialSpec = finish('main-street-blue-shade', 0x3e5670)
const CONCRETE: MaterialSpec = finish('concrete', 0xd6d3cb)
const WALK: MaterialSpec = finish('concrete-walk', 0xc9c5bc)
const PALE: MaterialSpec = { ...finish('main-street-housing', 0x9db3c8), floodlight: () => 0.8 }
type Kit = { blue: Part; shade: Part; concrete: Part; walk: Part; pale: Part }

/** A box x0..x1, y0..y1, z0..z1 (z0 'ground' or clamped to it). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, r = 0) {
  footedLoft(p, ground, [
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z0 },
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z1 },
  ], 400)
}
/** A steel member between two points: a square rod. */
const member = (p: Part, a: V3, b: V3, w: number) => rod(p, a, b, w * 0.7071, 4)

// ---- Trusses -------------------------------------------------------------------
function sideTop(ys: [number, number], south: boolean) {
  // top chord: the end post rises over the 6 m end panel, then a polygon to the tower (lidar)
  const pts: [number, number][] = [[6, road(6) + 0.9], [12, 17.6], [30, 20.6], [50, 23.1], [74.5, 25.8]]
  const f = piecewise(pts)
  return (y: number) => (south ? f(y) : f(274 - y))
}
function trusses(k: Kit) {
  const opts = { chordW: 0.8, topD: 0.8, botD: 0.9, member: 0.55, post: 0.55 }
  const bot = (y: number) => road(y) - 0.5
  const liftTop = parabola([LIFT[0], 26.4], [137, 29.6], [LIFT[1], 26.4])
  const sideS = [6, ...stations(12, SIDE_S[1], 8.95)]
  const sideN = sideS.map((y) => 274 - y).reverse()
  const spans: [number[], (y: number) => number][] = [
    [sideS, sideTop(SIDE_S, true)],
    [stations(LIFT[0], LIFT[1], 9.4), liftTop],
    [sideN, sideTop(SIDE_N, false)],
  ]
  for (const [ys, top] of spans) {
    const curve = [...new Set([...ys, ...stations(ys[0], ys[ys.length - 1], 9.5)])].sort((a, b) => a - b)
    for (const s of [-1, 1]) truss(k.blue, k.blue, s * TX, ys, top, bot, { ...opts, curve, flip: s < 0 ? false : false, minWeb: 0.8 })
    // top struts between the trusses at each panel point, and the portal at the lift span's ends
    for (const y of ys.slice(1, -1)) if (top(y) - bot(y) > 4)
      box(k.blue, -TX, TX, y - 0.3, y + 0.3, top(y) - 0.7, top(y) - 0.1)
    // the floor system under the roadway: a fascia between the trusses and its underside
    band(k.shade, -TX, TX, curve, (y) => road(y) - 0.6, (y) => road(y) - 1.8, { bottom: true, ends: true })
  }
}

// ---- Towers -------------------------------------------------------------------
function towers(k: Kit) {
  const TOP = 63.6, HOUSE = 43, BRACE0 = 26
  for (const yc of TOWERS) {
    const y0 = yc - T_HALF + 0.4, y1 = yc + T_HALF - 0.4
    // the pier in the river
    box(k.concrete, -13, 13, yc - 7, yc + 7, 'ground', 3.0, 1.2)
    // four legs from the pier to the housing
    for (const sx of [-1, 1]) for (const y of [y0, y1])
      box(k.blue, sx * TX - 0.65, sx * TX + 0.65, y - 0.65, y + 0.65, 3.0, HOUSE)
    // the counterweight housing: a box with dark openings on its across faces and a pale band under them
    const hx = TX + 0.9
    box(k.pale, -hx, hx, yc - T_HALF, yc + T_HALF, HOUSE, TOP, 0.3)
    box(k.blue, -hx - 0.3, hx + 0.3, yc - T_HALF - 0.3, yc + T_HALF + 0.3, TOP - 0.6, TOP)
    // corner posts of the housing frame, in the bridge's blue
    for (const sx of [-1, 1]) for (const sy of [-1, 1])
      box(k.blue, sx * hx - 0.45, sx * hx + 0.45, yc + sy * T_HALF - 0.45, yc + sy * T_HALF + 0.45, HOUSE - 0.5, TOP - 0.6)
    for (const sy of [-1, 1]) {
      const yf = yc + sy * (T_HALF + 0.02), n: V3 = [0, sy, 0]
      // a row of short openings under the top, then tall slots over a pale band (photo)
      for (let i = 0; i < 6; i++) {
        const xa = -7.4 + i * 2.6, xb = xa + 1.6
        face(k.shade, [xa, yf, 46.2], [xb, yf, 46.2], [xb, yf, 55.6], [xa, yf, 55.6], n)
        face(k.shade, [xa, yf, 58.4], [xb, yf, 58.4], [xb, yf, 61.8], [xa, yf, 61.8], n)
      }
      // two openings on the along faces
      const xf = sy * (hx + 0.02)
      for (const [ya, yb] of [[yc - 2.3, yc - 0.4], [yc + 0.4, yc + 2.3]]) {
        face(k.shade, [xf, ya, 46.2], [xf, yb, 46.2], [xf, yb, 55.6], [xf, ya, 55.6], [sy, 0, 0])
        face(k.shade, [xf, ya, 58.4], [xf, yb, 58.4], [xf, yb, 61.8], [xf, ya, 61.8], [sy, 0, 0])
      }
    }
    // X-braced bays between the lift span's top and the housing, on all four faces; struts at the bay lines
    const bays = [[BRACE0, 34.5], [34.5, HOUSE]]
    for (const [za, zb] of bays) {
      for (const y of [y0, y1]) {
        member(k.blue, [-TX, y, za], [TX, y, zb], 0.5)
        member(k.blue, [TX, y, za], [-TX, y, zb], 0.5)
        box(k.blue, -TX, TX, y - 0.35, y + 0.35, za - 0.4, za + 0.4)
      }
      for (const sx of [-1, 1]) {
        member(k.blue, [sx * TX, y0, za], [sx * TX, y1, zb], 0.45)
        member(k.blue, [sx * TX, y1, za], [sx * TX, y0, zb], 0.45)
      }
    }
    // under the deck: one braced bay on the along faces, a strut under the floor
    const zd = road(yc) - 1.9
    for (const sx of [-1, 1]) {
      member(k.blue, [sx * TX, y0, 3.2], [sx * TX, y1, zd], 0.45)
      member(k.blue, [sx * TX, y1, 3.2], [sx * TX, y0, zd], 0.45)
    }
    for (const y of [y0, y1]) box(k.blue, -TX, TX, y - 0.4, y + 0.4, zd - 0.8, zd)
    // the deck through the tower: floor fascia
    band(k.shade, -TX, TX, [y0 - 0.4, y1 + 0.4], (y) => road(y) - 0.6, (y) => road(y) - 1.8, { bottom: true, out: true, in: true })
  }
}

// ---- Approach, piers, sidewalks, railings --------------------------------------
function approach(k: Kit) {
  const ys = [...new Set([...stations(Y_ABUT, 6, 8), ...APPROACH_PIERS])].sort((a, b) => a - b)
  for (const s of [-1, 1]) {
    // plate girders at the deck edge, from the walk down 2.2 m
    band(k.blue, s * (WALK_OUT - 0.3), s * WALK_OUT, ys, (y) => walk(y) + 0.05, (y) => road(y) - 2.2, { out: true, in: true, bottom: true })
  }
  band(k.shade, -WALK_OUT + 0.3, WALK_OUT - 0.3, ys, (y) => road(y) - 0.5, (y) => road(y) - 1.9, { bottom: true })
  for (const y of APPROACH_PIERS) {
    box(k.concrete, -9.5, 9.5, y - 1.0, y + 1.0, 'ground', road(y) - 2.2, 0.4)
    box(k.concrete, -10.6, 10.6, y - 1.3, y + 1.3, road(y) - 3.2, road(y) - 2.2, 0.3)
  }
  // end piers of the side spans, and the south abutment
  for (const y of [5, 269]) box(k.concrete, -11, 11, y - 2, y + 2, 'ground', road(y) - 1.9, 0.5)
  box(k.concrete, -WALK_OUT, WALK_OUT, Y_ABUT - 3, Y_ABUT, 'ground', road(Y_ABUT) - 0.5, 0)
}
function sidewalks(k: Kit) {
  const ys = [...new Set([...stations(Y_S, Y_N, 12), ...TOWERS.flatMap((t) => [t - T_HALF, t + T_HALF])])].sort((a, b) => a - b)
  const wz = (y: number) => Math.max(walk(y), groundY(y) + 0.3)
  for (const s of [-1, 1]) {
    // the walk slab (the model's walkway), its edge fascia down 0.5 m
    band(k.walk, s * WALK_IN, s * WALK_OUT, ys, wz, (y) => wz(y) - 0.5, { top: true, bottom: true, out: false, in: true, ends: true })
    // the railing: a solid band 1.1 m at the outer edge
    band(k.blue, s * (WALK_OUT - 0.25), s * WALK_OUT, ys, (y) => wz(y) + 1.1, (y) => wz(y) - 0.5, { out: true, in: true, top: true, ends: true })
  }
  // on Southbank land the walls run down to the ground under the road edge
  const land = ys.filter((y) => y <= Y_ABUT)
  for (const s of [-1, 1]) band(k.concrete, s * (WALK_OUT - 0.3), s * WALK_OUT, land, (y) => wz(y) - 0.5, (y) => groundY(y), { out: true, in: false })
}

function build(): Kit {
  const k: Kit = { blue: new Part(), shade: new Part(), concrete: new Part(), walk: new Part(), pale: new Part() }
  trusses(k)
  towers(k)
  approach(k)
  sidewalks(k)
  return k
}

if (import.meta.main) {
  const k = build()
  const list = [
    { part: k.blue, material: BLUE }, { part: k.shade, material: SHADE },
    { part: k.concrete, material: CONCRETE }, { part: k.walk, material: WALK },
    { part: k.pale, material: PALE },
  ]
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Main Street Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, at the map water',
    bearing: 4.7, roadway: { southBank: road(-120), southTower: road(TOWERS[0]), liftCrest: road(137), northTower: road(TOWERS[1]), northEnd: road(268) },
  })
  console.log(`jax-main-street-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-main-street-bridge.glb', import.meta.url), glb)
}
