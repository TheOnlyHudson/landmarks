/**
 * Interstate Bridge (1917; twin 1958; Waddell & Harrington), I-5 over the
 * Columbia River between Portland (Hayden Island) and Vancouver, Washington:
 * procedural, CC0-1.0, no textures.
 * bun generators/pdx-interstate-bridge.ts
 *
 * Twin parallel steel bridges, each of thirteen Parker through-truss spans
 * (ten of 265 ft, three of 275 ft), painted pale green. Near the Vancouver
 * end each has a 275 ft vertical-lift span between two tall lattice towers:
 * an inner leg plumb at the span's end, an outer leg leaning in from the
 * pier, X-braced, the concrete counterweights hanging high in the towers
 * (the span is down), sheave housings on the crowns. The 1958 rebuild gave
 * both bridges the "humpback": the roadway climbs from the island to a crest
 * over the main channel mid-river (72 ft clearance) and falls back to the
 * lift span. Each bridge carries three lanes between its trusses and a
 * sidewalk cantilevered outside, on the outer side. Drawn closed.
 *
 * Writes a low model (truss planes as solid bands with a few overhead
 * struts) and a detail model (open trusses), as the other Portland river
 * bridges do. Imports the movable-bridge kit in pdx-hawthorne-bridge.ts.
 *
 * Frame: x across (toward 112.85), y along the bridges (bearing 22.85,
 * toward Vancouver), z up, metres. Origin midway between the two bridges'
 * centre lines, halfway along the man_made=bridge outline (relation/6262670),
 * at -122.675751, 45.617237. The east (northbound, 1917) bridge's centre line
 * is x = +13.35, the west (southbound, 1958) one's x = -13.35 (OSM outline,
 * 26.7 m apart). z = 0 is the river in the map's terrain (Mapterhorn,
 * 1.75 m NAVD88). elevation 0.
 *
 * OSM (© OpenStreetMap contributors): relation/6262670, the outline over
 * both bridges, y = -536 (Hayden Island) to +537 (Vancouver); the two
 * bridges are joined over y = 268..446, the lift span's piers (holes between
 * them split at y = 354). Pier lines from there and the published spans:
 * the lift span y = 354..437, the fixed 275 ft spans 270..354 and 185..270,
 * nine 265 ft spans from 185 south to the island end, one north to 518 and a
 * short girder to the Vancouver end.
 *
 * Lidar (measured): tools/bridge_ele.py measure 30374523 and 99028700 (the
 * northbound carriageway, USGS 3DEP OR_OLCMetro_2019, flown 2019), readings
 * with a spread under 1 m, NAVD88 minus 1.75 m: 14.0 m on the island
 * (y = -536..-386), 21.25 at y = -106, 23.6 at -56, 25.3 at -6 (the crest
 * about 25.5 near y = 30), 23.9 at 106, 20.0 at 186, 16.8 at 255, 16.2 at
 * 271, 14.65 at 333, the lift span 14.45 (estimated from the grade into it).
 * The Vancouver end (14.45 to 13.3 m) and the southbound bridge are assumed
 * to follow the same profile.
 *
 * Published (Wikipedia "Interstate Bridge"; ODOT): 3,538 ft (1,078 m) long;
 * thirteen spans, three of 275 ft (84 m) and ten of 265 ft (81 m); towers
 * 190 ft (58 m) above the roadway; the lift 136 ft, 176 ft clear when open;
 * the hump 72 ft clear; roadway 38 ft (11.6 m), a 5 ft sidewalk.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - SounderBruce, "Interstate Bridge from northeast side.jpg", CC BY-SA 4.0:
 *   both bridges' towers from the Vancouver shore, the frames and the
 *   counterweights, the colour;
 *   https://commons.wikimedia.org/wiki/File:Interstate_Bridge_from_northeast_side.jpg
 * - Steve Morgan, "Interstate Bridge lift span, from east.jpg",
 *   CC BY-SA 3.0: the lift span and both towers side-on, the lift span's
 *   polygonal top chord, the tower pier;
 *   https://commons.wikimedia.org/wiki/File:Interstate_Bridge_lift_span,_from_east.jpg
 * - Steve Morgan, "Interstate Bridge.jpg", CC BY-SA 3.0: from the Vancouver
 *   shore down the bridge, the curved Parker tops, the separate pier shafts,
 *   the sidewalk outside the truss.
 *   https://commons.wikimedia.org/wiki/File:Interstate_Bridge.jpg
 *
 * Estimated: truss planes at +-6.3 m from each centre line; Parker depths
 * (9 m at the first panel points, 13.5 m at mid-span; the lift span 10.5 m
 * at its ends and 13 m mid-span); panel counts (8 a span); the towers'
 * outer legs (19 m out at the roadway, 8.5 m at the top, from the side
 * photo); counterweights (3.6 x 6.4 x 12 m in each side frame); piers (6 m shafts, 16 m across, tower
 * piers 17 m long); the sidewalks (2 m, outside the outer truss).
 * Colour: the paint sage green #8fae94 in sun, pulled to #8dab92;
 * counterweights grey concrete; piers #c9c3b8.
 *
 * Night: street lamps and the towers' aircraft lights only; nothing
 * floodlit.
 *
 * Doubts: the southbound bridge's profile and the Vancouver end are assumed;
 * pier positions south of y = 185 are spaced by the published span, not
 * measured; the map's terrain is coarse (40 m) at the banks.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { chamferedRect, face, footedLoft, piecewise, stations, strip, merged, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { CONCRETE, beam, box, deckBand, drumX, groundOf, throughTruss, type TrussSpec } from './pdx-hawthorne-bridge'

// Map terrain (Mapterhorn) minus 1.75 m, 40 m apart along y (x = -40, 0, 40).
const GROUND: GroundGrid = {
  y0: -560, x0: -40, step: 40, z: [
    [13.4, 13.8, 7.5], [8.4, 7.6, 7.7], [7.7, 7.8, 8.2], [8.3, 7.5, 8.4], [8.2, 7.3, 8.5], [8.2, 0.8, 8.1], [6.5, 0, 0],
    ...Array.from({ length: 19 }, () => [0, 0, 0]),
    [0, 0, 0], [6.4, 6.4, 6.3], [9.6, 9.9, 9.6],
  ],
}
const gnd = groundOf(GROUND)

const YS = -536, YN = 537
const LS = 354, LN = 437                    // the lift span's ends
const PIERS = [YS, ...Array.from({ length: 9 }, (_, k) => YS + ((185 - YS) * (k + 1)) / 9), 270, LS, LN, 518]
const XT = 6.3, OFF = 13.35
const ROAD = piecewise([[-536, 14.0], [-386, 14.1], [-106, 21.25], [-56, 23.6], [-6, 25.3], [30, 25.5], [106, 23.9],
  [186, 20.0], [255, 16.8], [271, 16.2], [333, 14.65], [LS, 14.45], [LN, 14.45], [YN, 13.3]])
const BOT = (y: number) => ROAD(y) - 0.6
const TOWER_TOP = 14.45 + 58

const parker = (y0: number, y1: number, e: number, rise: number) => (y: number) => {
  const t = (y - y0) / (y1 - y0)
  return ROAD(y) + e + (rise - e) * Math.pow(Math.sin(Math.PI * t), 0.55)
}

/** A river pier as the kit's `pier`, its edges split only every `seg` metres (the river bed is flat). */
function pier(p: Part, g: (x: number, y: number) => number, yc: number, hy: number, hx: number, top: number, cap: number, over: number, seg = 20) {
  const plan = (o: number) => chamferedRect(-hx - o, hx + o, yc - hy - o, yc + hy + o, (hy + o) * 0.85)
  footedLoft(p, g, [{ plan: plan(0), z: 'ground' }, { plan: plan(0), z: top - cap }, { plan: plan(over), z: top - cap }, { plan: plan(over), z: top }], seg)
}
function block(p: Part, g: (x: number, y: number) => number, x0: number, x1: number, y0: number, y1: number, top: number) {
  footedLoft(p, g, [{ plan: chamferedRect(x0, x1, y0, y1, 0), z: 'ground' }, { plan: chamferedRect(x0, x1, y0, y1, 0), z: top }], 6)
}

type Set = { steel: Part; cw: Part; conc: Part; walk: Part }

/** Truss planes as solid bands between the chords (the low model). */
function solidTruss(p: Part, t: TrussSpec) {
  const ys = stations(t.y0, t.y1, (t.y1 - t.y0) / t.panels), inc = (t.ends ?? 'inclined') === 'inclined'
  const topAt = (i: number) => (inc && (i === 0 || i === ys.length - 1) ? t.bot(ys[i]) + 0.4 : t.top(ys[i]) + 0.3)
  for (const x of [-t.x, t.x]) for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    face(p, [x, a, t.bot(a) - 0.4], [x, b, t.bot(b) - 0.4], [x, b, topAt(i + 1)], [x, a, topAt(i)], [Math.sign(x), 0, 0])
  }
  for (let i = inc ? 1 : 0; i <= (inc ? ys.length - 2 : ys.length - 1); i += 3) beam(p, [-t.x, ys[i], t.top(ys[i])], [t.x, ys[i], t.top(ys[i])], 0.5, 0.6)
}

/** One bridge, built about its own centre line; `side` is the sidewalk's side (+1 east). */
function bridge(detail: boolean, side: number, off: number): Set {
  const S: Set = { steel: new Part(), cw: new Part(), conc: new Part(), walk: new Part() }
  const g = (x: number, y: number) => gnd(x + off, y)
  const truss = (t: TrussSpec) => (detail ? throughTruss(S.steel, t) : solidTruss(S.steel, t))

  // Fixed Parker spans.
  for (let k = 0; k < PIERS.length - 1; k++) {
    const a = PIERS[k], b = PIERS[k + 1]
    if (a === LS) continue
    const L = b - a
    truss({ x: XT, y0: a + 0.8, y1: b - 0.8, panels: 8, bot: BOT, top: parker(a, b, 9, L > 82 ? 13.8 : 13.5) })
  }
  // The lift span: vertical end posts, a polygonal top chord.
  const LC = (LS + LN) / 2
  const liftTop = (y: number) => ROAD(y) + 10.5 + 2.5 * (1 - Math.abs((y - LC) / ((LN - LS) / 2))) ** 0.7
  truss({ x: XT, y0: LS + 0.5, y1: LN - 0.5, panels: 8, bot: BOT, top: liftTop, ends: 'vertical' })

  // The short girder span at the Vancouver end.
  for (const s of [-1, 1]) beam(S.steel, [s * XT, 518.5, BOT(518.5) - 0.4], [s * XT, YN, BOT(YN) - 0.4], 0.6, 1.6, true)

  // Towers.
  for (const [yi, s] of [[LS, -1], [LN, 1]] as [number, number][]) {
    const zb = ROAD(yi) - 3, yo = yi + s * 19, yt = yi + s * 8.5
    const outer = (z: number) => yo + (yt - yo) * (z - zb) / (TOWER_TOP - zb)
    const levels = [zb, ROAD(yi) + 13.5, 34, 44, 54, 63, TOWER_TOP - 0.5]
    for (const x of [-XT, XT]) {
      beam(S.steel, [x, yi, zb], [x, yi, TOWER_TOP], 1.1, 1.1)
      beam(S.steel, [x, yo, zb], [x, yt, TOWER_TOP], 1.1, 1.1)
      for (let k = 1; k < levels.length; k++) {
        const z = levels[k], za = levels[k - 1]
        beam(S.steel, [x, yi, z], [x, outer(z), z], 0.5, 0.6)
        strip(S.steel, [x, yi, za + 0.4], [x, outer(z), z - 0.4], 0.5, [1, 0, 0])
        strip(S.steel, [x, outer(za), za + 0.4], [x, yi, z - 0.4], 0.5, [1, 0, 0])
      }
      // The counterweight hanging high in the frame, the sheave housing on the crown.
      const ya = yi + s * 1.2, yb = yi + s * 7.6
      box(S.cw, x - 1.8, x + 1.8, Math.min(ya, yb), Math.max(ya, yb), 57, 69, true)
      drumX(S.steel, x - 0.7, x + 0.7, yi + s * 4.3, TOWER_TOP + 1.3, 1.9, detail ? 12 : 6)
    }
    for (const z of [ROAD(yi) + 13.5, 44, TOWER_TOP - 0.5]) {
      beam(S.steel, [-XT, yi, z], [XT, yi, z], 0.6, 0.8)
      beam(S.steel, [-XT, outer(z), z], [XT, outer(z), z], 0.6, 0.8)
    }
    box(S.steel, -XT - 0.8, XT + 0.8, Math.min(yi, yt) - 0.4, Math.max(yi, yt) + 0.4, TOWER_TOP - 0.7, TOWER_TOP)
  }

  // Piers: tower piers under each tower, a shaft at every other pier line, abutments at the ends.
  const PTOP = (y: number) => BOT(y) - 0.8
  for (const y of PIERS) {
    if (y === YS) continue   // the island end is at grade (lidar: road 14.0 m, ground 14.0 m): no abutment shows
    if (y === LS || y === LN) {
      const yc = y + (y === LS ? -6.5 : 6.5)
      pier(S.conc, g, yc, 8, 8.2, PTOP(y) - 2.2, 1.6, 0.6); continue
    }
    pier(S.conc, g, y, 3, 8.2, PTOP(y), 1.2, 0.5)
  }
  block(S.conc, g, -8, 8, YN - 4, YN, PTOP(YN - 2))

  // The deck's underside and fascias, the sidewalk outside the outer truss with its railing.
  const ALL = stations(YS, YN, detail ? 13 : 26)
  deckBand(S.conc, ALL, ROAD, 7.0, 1.6, true, 0.15)
  for (let i = 0; i < ALL.length - 1; i++) {
    const a = ALL[i], b = ALL[i + 1], x0 = side * 7.0, x1 = side * 9.0, up = 0.2
    face(S.walk, [x0, a, ROAD(a) + up], [x1, a, ROAD(a) + up], [x1, b, ROAD(b) + up], [x0, b, ROAD(b) + up], [0, 0, 1])
    if (detail) face(S.walk, [x0, a, ROAD(a) - 0.5], [x1, a, ROAD(a) - 0.5], [x1, b, ROAD(b) - 0.5], [x0, b, ROAD(b) - 0.5], [0, 0, -1])
    face(S.walk, [x1, a, ROAD(a) - 0.5], [x1, b, ROAD(b) - 0.5], [x1, b, ROAD(b) + up], [x1, a, ROAD(a) + up], [side, 0, 0])
    strip(S.steel, [x1, a, ROAD(a) + up + 0.55], [x1, b, ROAD(b) + up + 0.55], 1.1, [side, 0, 0])
  }
  // Shift the whole bridge to its centre line.
  for (const p of Object.values(S)) for (let i = 0; i < p.pos.length; i += 3) p.pos[i] += off
  return S
}

const STEEL: MaterialSpec = { ...finish('interstate-green', 0x8dab92), doubleSided: true }
const CW: MaterialSpec = finish('counterweight-concrete', 0xb4b5ad)
const WALK: MaterialSpec = finish('sidewalk', 0xbdb8ae)

async function write(detail: boolean) {
  const E = bridge(detail, 1, OFF), W = bridge(detail, -1, -OFF)
  const parts = [
    { part: merged(E.steel, W.steel), material: STEEL },
    { part: merged(E.cw, W.cw), material: CW },
    { part: merged(E.conc, W.conc), material: CONCRETE },
    { part: merged(E.walk, W.walk), material: WALK },
  ]
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  const name = detail ? 'pdx-interstate-bridge.detail.glb' : 'pdx-interstate-bridge.glb'
  const glb = writeGlb('Interstate Bridge', parts, {
    license: 'CC0-1.0',
    frame: 'Y up, -Z north, +X east, metres; origin between the two bridges, halfway along relation/6262670, on the river (1.75 m NAVD88)',
    bearing: 22.85, elevation: 0, height: TOWER_TOP + 3.2,
  })
  if (tris > (detail ? 40000 : 6500) || glb.length > (detail ? 1536 : 250) * 1024) throw new Error(`${name} over budget: ${tris} tris, ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${name}`, import.meta.url), glb)
  console.log(`${name}: ${tris} triangles, ${glb.length} bytes`)
}
await write(false)
await write(true)
void ([] as V3[])
