/**
 * Gordie Howe International Bridge, Detroit–Windsor (2018–2026; AECOM,
 * architect Erik Behrens; Bridging North America) — procedural, CC0-1.0.
 * bun generators/det-gordie-howe-bridge.ts
 *
 * The cable-stayed unit as one placement, as completed (structurally complete
 * early 2026, opened 27 July 2026; the photos used run from June 2025, deck
 * closed and towers finished, to July 2026): the two A-shaped concrete
 * towers, one on each bank, their legs straddling the deck and joining into
 * a single shaft that carries the stays; the stays in two inclined planes
 * from the shaft to the deck edges; the deck's edge girders, parapets and
 * underside; and the back-span piers, from the end of the straight back span
 * on the Detroit side to the one on the Windsor side. Writes a low model
 * (towers, deck, piers, the stay fans as faint veils with every third stay
 * drawn) and a detail model (all 216 stays), which a map draws from
 * detailZoom up. The curved approach viaducts beyond the straight back spans
 * are left to the map.
 *
 * Frame: x across the bridge (+x toward the south-west, downstream), y along
 * it toward Windsor, z up, metres; origin midway between the two pylons' OSM
 * centroids, on the river. Placed at bearing 132.16°, the line from the US
 * pylon's OSM centroid to the Canadian one's (847.7 m apart; published main
 * span 853 m). The map owns the roadway: the edge girders and parapets stand
 * beside it, the underside hangs below it, nothing here is a slab at road
 * level.
 *
 * Height. z = 0 is the river: Mapterhorn's water reading here, 174.76 m.
 * The 2017 lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018) predates the bridge, so
 * nothing below is lidar:
 * - roadway (estimated): 49 m at midspan (published 46 m clearance at the
 *   highest point plus a 3 m deck), a parabola to 42 m at the towers (photo-
 *   scaled from Woodrich's broadside, the deck at the near tower 73 px of a
 *   383 px / 220 m tower), then straight at the parabola's 3.3 % end grade
 *   down both back spans to 31.6 m at the Detroit end (y = -740) and 30.5 m
 *   at the Windsor end (y = +772). These are the roadway heights the model
 *   is built to; OSM carries no `ele` or `height` on the deck, so the map's
 *   deck may sit off them until someone tags it (docs/bridge-heights.md;
 *   needs a post-2026 survey).
 * - towers: 220 m (published), standing on the banks (Mapterhorn 2-3.5 m
 *   above the water at the feet).
 * - ground under the towers and piers: Mapterhorn (tools/terrain.ts grid,
 *   bearing 132), 10 m tables above the water (US_GROUND, CA_GROUND).
 *
 * Published (Wikipedia "Gordie Howe International Bridge"; WDBA "By the
 * Numbers", gordiehoweinternationalbridge.com/project/statistics/, archived
 * 2025-08-15): cable-stayed, main span 853 m, total length 2.5 km, two
 * A-shaped towers 220 m "designed to resemble hockey sticks when swung for a
 * slapshot", 216 stays, clearance 46 m, width 37.5 m, six lanes and a
 * multi-use path, no piers in the water; "white to dark grey in colour";
 * architectural LED lighting ("Shimmer", Douglas Coupland).
 *
 * OSM: the bridge outline way/1272925228 (man_made=bridge, construction=
 * bridge, Q5266001) runs the whole 2.5 km, the curved approaches included
 * (y = -1175…+1144 in this frame); its straight part ends at y = -735 and
 * +772, where the roadway (way/168055476, way/1545225837) starts to curve.
 * The pylons are mapped as way/1323474509 (US) and way/1323474508 (Canada),
 * building=service, bridge:support=pylon, height 220, 63 x 10 m each.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - "Gordie Howe International Bridge - July 2026", WMrapids, CC0: the US
 *   tower from the air, three-quarter: the A, the legs meeting about 61 % up
 *   (133 m), the single shaft above (about 10 m across at the top), the
 *   back-span piers, the pale deck.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_-_July_2026.jpg
 * - "Aerial Tour of Gordie Howe Bridge - 54603187901", DHS, public domain:
 *   the Canadian tower from the air over the river (from the north-west):
 *   the two stay planes from the shaft to the deck edges, the back span.
 *   https://commons.wikimedia.org/wiki/File:Aerial_Tour_of_Gordie_Howe_Bridge_-_54603187901.jpg
 * - "Gordie Howe International Bridge from Black Oak Park, Windsor, Ontario,
 *   2025-06-07 02" and "04", Chris Woodrich, CC BY-SA 4.0: broadside from the
 *   Windsor bank downstream (south-west); tower and deck heights, stay
 *   anchorage zone on the shaft (about 140–215 m), the shaft's depth along
 *   the bridge (about 10 m at the top).
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_from_Black_Oak_Park,_Windsor,_Ontario,_2025-06-07_02.jpg
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_from_Black_Oak_Park,_Windsor,_Ontario,_2025-06-07_04.jpg
 * - "Gordie Howe International Bridge 2026-04-21 1052", TheWxResearcher,
 *   CC0: from the Detroit bank, the main span's sag and both towers.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_2026-04-21_1052.jpg
 * - "Gordie Howe International Bridge during clear morning 2025-09-30" and
 *   "2026-06-10 1013", TheWxResearcher, CC0: the US tower from below on the
 *   A's axis: straight legs, the notch where they meet, the outer edges
 *   flaring into the shaft (the "hockey stick"), the deck's pale underside.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_during_clear_morning_2025-09-30.jpg
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_2026-06-10_1013.jpg
 * - "Gordie Howe Bridge 2025d", Antony-22, CC BY-SA 4.0: broadside from
 *   Belanger Park, River Rouge (south-west): the back stays reach almost as
 *   far as the main-span ones.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_Bridge_2025d.jpg
 * - Night: "Gordie Howe International Bridge at night 2026-05-16",
 *   TheWxResearcher, CC0: towers floodlit warm white, stays lit, a lit line
 *   along the deck edge.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_at_night_2026-05-16.jpg
 *
 * Estimated (from the photos, scaled by the published 220 m and 37.5 m):
 * - legs: feet 32 m either side of the axis (the OSM pylon is 63 m long; the
 *   legs must clear the 37.5 m deck), 9 m across and 12 m along the bridge at
 *   the foot, 6.5 x 9 m where they meet at 133 m; a 2.5 m plinth under each;
 * - shaft: 17.4 m across where the legs join, flaring in to 12 m at 158 m
 *   and 10 m at the 220 m top, 9.5 to 8 m along the bridge;
 * - stays: 27 per plane per side per tower (216 / 8), anchored on the shaft
 *   from 147 to 214 m, on the deck edges from 28 m off the tower to 12 m
 *   short of midspan and of the back spans' ends, evenly spaced (the real
 *   spacing is not measured). Drawn 0.6 m thick in the detail model, about
 *   three times the real ones;
 * - deck: edge girders 2.8 m deep, parapets 1.1 m, underside 1.6 m below
 *   the road; the back spans' piers four spans each (79 m Detroit side,
 *   87 m Windsor side), two 4.5 m columns under a cap beam, at y = -503,
 *   -582, -661, -740 and +511, +598, +685, +772. The real pier stations
 *   were not measured (the 2022 NAIP shows construction).
 *
 * Doubts:
 * - replaces lists the two pylons only. The man_made=bridge outline covers
 *   2.5 km including about 1 km of curved approach viaduct this model doesn't
 *   draw, so listing it would strip the map's piers from those approaches;
 *   without it the map may also draw its own piers and parapets under the
 *   cable-stayed unit. The outline is still tagged construction=bridge.
 * - The roadway heights are estimated, not measured; the map's deck may sit
 *   a few metres off the parapets until the deck is tagged.
 * - The towers' grey gradient ("white to dark grey") is drawn as one pale
 *   grey; the legs' slight curvature is drawn as straight legs plus the
 *   flare into the shaft.
 * - Back-span pier count and spacing are estimated.
 *
 * Night: the towers are floodlit (_FLOODLIGHT on the concrete, faces looking
 * up dimmer); the stays carry it too; `lamp` beads along both parapets stand
 * for the lit deck edge.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, footedLoft, groundAt, rod, stations, bead, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -------------------------------------------------------------

const T = 423.9                     // towers at y = ±T
const US_END = -740, CA_END = 772   // the straight back spans' ends
const HALF = 18.75                  // half the deck's width
const CREST = 49, AT_TOWER = 42, K = (CREST - AT_TOWER) / (T * T)
const GRADE = 2 * K * T
/** The roadway above the river (estimated, see header). */
const road = (y: number): number => Math.abs(y) <= T ? CREST - K * y * y : AT_TOWER - GRADE * (Math.abs(y) - T)

// Mapterhorn ground above the river (174.76 m), 10 m apart across (x -50…50)
// and 20 m along y. Water between the tables.
const US_GROUND: GroundGrid = { y0: -800, x0: -50, step: 10, z: [
  [4.9, 4.8, 4.7, 4.8, 4.6, 4.5, 4.4, 4.3, 4.1, 4.3, 4.6], [4.0, 4.2, 4.3, 4.4, 4.2, 4.0, 4.0, 3.9, 4.0, 4.0, 3.9], [4.2, 4.4, 4.5, 4.5, 4.3, 4.2, 4.1, 4.1, 4.0, 4.0, 3.9], [3.8, 4.0, 4.3, 4.3, 4.4, 4.4, 4.3, 4.2, 4.1, 4.1, 4.0],
  [3.4, 3.5, 3.7, 4.0, 4.1, 4.3, 4.3, 4.2, 4.1, 4.1, 4.0], [3.4, 3.4, 3.4, 3.6, 4.0, 4.0, 4.0, 4.0, 4.1, 4.1, 4.0], [3.6, 3.7, 3.7, 3.7, 3.7, 3.8, 3.7, 3.6, 3.6, 3.8, 3.7], [3.5, 3.4, 3.4, 3.4, 3.5, 3.6, 3.4, 3.4, 3.4, 3.5, 3.5],
  [4.0, 3.9, 3.8, 3.6, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.4], [4.1, 4.1, 4.2, 4.3, 4.2, 4.3, 4.3, 4.3, 4.3, 4.2, 4.2], [4.2, 4.2, 4.2, 4.3, 4.5, 4.4, 4.2, 4.3, 4.2, 4.1, 4.2], [4.2, 4.3, 4.2, 4.2, 4.1, 3.9, 3.7, 3.7, 3.7, 3.5, 3.6],
  [3.7, 3.6, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.4, 3.3, 3.4], [3.5, 3.5, 3.5, 3.4, 3.4, 3.4, 3.5, 3.4, 3.4, 3.4, 3.5], [3.3, 3.4, 3.5, 3.5, 3.7, 3.5, 3.5, 3.4, 3.4, 3.5, 3.6], [3.5, 3.5, 3.6, 3.6, 3.7, 3.6, 3.6, 3.6, 3.5, 3.4, 3.2],
  [3.3, 3.5, 3.4, 3.6, 3.6, 3.6, 3.6, 3.4, 3.5, 3.2, 2.9], [3.3, 3.3, 3.2, 3.4, 3.4, 3.4, 3.3, 3.2, 3.1, 2.8, 2.8], [3.3, 3.3, 3.5, 3.3, 3.5, 3.2, 3.0, 2.8, 2.7, 2.4, 2.7], [2.8, 2.7, 2.8, 3.0, 2.9, 2.9, 2.8, 2.6, 2.4, 2.2, 2.4],
  [0.0, 0.0, 0.1, 0.7, 2.1, 2.4, 2.5, 2.2, 2.1, 2.2, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
] }
const CA_GROUND: GroundGrid = { y0: 360, x0: -50, step: 10, z: [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.9, 1.8, 1.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [2.2, 2.2, 2.0, 2.2, 2.1, 2.0, 1.8, 0.6, 0.0, 0.0, 0.0], [2.2, 2.2, 2.2, 2.2, 2.3, 2.2, 2.2, 1.9, 1.6, 1.6, 1.5],
  [2.3, 2.3, 2.3, 2.1, 2.3, 2.2, 2.2, 1.7, 1.6, 1.6, 1.6], [2.4, 2.3, 2.3, 2.3, 2.4, 2.4, 2.4, 2.3, 2.3, 2.1, 1.6], [2.9, 2.9, 3.1, 3.0, 2.9, 2.9, 2.8, 2.9, 2.6, 2.5, 1.9], [2.8, 2.9, 2.9, 2.9, 3.1, 3.2, 3.2, 3.0, 2.9, 2.8, 2.7],
  [3.1, 3.2, 3.1, 3.0, 3.2, 3.4, 3.5, 3.2, 2.7, 2.7, 2.7], [3.1, 3.4, 3.4, 3.3, 3.5, 3.3, 3.1, 3.0, 2.9, 2.9, 2.7], [3.4, 3.3, 3.5, 3.6, 3.6, 3.5, 3.4, 3.3, 3.5, 3.1, 2.7], [3.6, 3.6, 3.5, 3.5, 3.5, 3.7, 3.6, 3.6, 3.7, 3.4, 3.4],
  [3.2, 3.3, 3.3, 3.4, 3.5, 3.4, 3.0, 3.0, 3.1, 3.0, 3.1], [1.2, 1.7, 3.0, 3.2, 3.4, 3.4, 3.2, 3.1, 3.0, 3.0, 3.1], [3.6, 3.6, 3.6, 3.6, 2.6, 2.5, 4.6, 5.0, 5.0, 4.7, 4.1], [3.2, 3.2, 3.3, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 3.5, 2.5],
  [3.0, 3.2, 3.2, 3.2, 3.2, 3.2, 3.3, 3.6, 3.7, 3.7, 3.9], [3.2, 3.2, 3.2, 3.2, 3.1, 3.3, 3.3, 3.5, 3.8, 3.9, 4.1], [3.4, 3.4, 3.4, 3.2, 3.3, 3.4, 3.3, 3.5, 3.8, 3.9, 4.0], [3.2, 3.2, 3.3, 3.3, 3.4, 3.4, 3.4, 3.4, 3.6, 3.6, 3.8],
  [3.3, 3.3, 3.2, 3.2, 3.2, 3.3, 3.2, 3.3, 3.4, 3.4, 3.5], [3.2, 3.2, 3.1, 3.2, 3.2, 3.2, 3.3, 3.4, 3.4, 3.4, 3.5], [3.1, 3.2, 3.2, 3.2, 3.3, 3.2, 3.3, 3.3, 3.3, 3.4, 3.7],
] }
/** The map's ground under (x, y), metres above the river. */
const ground = (x: number, y: number): number =>
  y <= -360 ? groundAt(US_GROUND, x, y) : y >= 360 ? groundAt(CA_GROUND, x, y) : 0

// ---- Parts ---------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { concrete: Part; deck: Part; under: Part; stays: Part; veil: Part; lamp: Part }
const newKit = (): Kit => ({ concrete: new Part(), deck: new Part(), under: new Part(), stays: new Part(), veil: new Part(), lamp: new Part() })

/** A rectangle centred on (cx, cy), half-sizes hx, hy, with chamfered corners r, at height z; CCW from above. */
function ring(cx: number, cy: number, hx: number, hy: number, z: number, r: number): V3[] {
  return ([[cx - hx + r, cy - hy], [cx + hx - r, cy - hy], [cx + hx, cy - hy + r], [cx + hx, cy + hy - r],
    [cx + hx - r, cy + hy], [cx - hx + r, cy + hy], [cx - hx, cy + hy - r], [cx - hx, cy - hy + r]] as [number, number][])
    .map(([x, y]) => [x, y, z] as V3)
}

// ---- Towers --------------------------------------------------------------------

const TOP = 220, JOIN = 133
const FOOT_X = 32, LEG_HX0 = 4.5, LEG_HY0 = 6, LEG_HX1 = 3.25, LEG_HY1 = 4.5
const SHAFT_HY = (z: number) => 4.75 - (0.75 * (z - JOIN)) / (TOP - JOIN)
/** The shaft's half-width across at height z: the flare where the legs join, then a gentle taper. */
const SHAFT_HX = (z: number) => z < 158 ? 8.7 - (2.7 * (z - (JOIN - 10))) / (158 - (JOIN - 10)) : 6 - (1 * (z - 158)) / (TOP - 158)

function tower(k: Kit, ty: number) {
  const C = one(k.concrete)
  for (const s of [-1, 1]) {
    const fx = s * FOOT_X
    // The plinth under the leg, on the bank.
    const g = Math.min(...[-5, 5].flatMap((dx) => [-7, 7].map((dy) => ground(fx + dx, ty + dy))))
    const plan: [number, number][] = [[fx - 5, ty - 7.5], [fx + 5, ty - 7.5], [fx + 5, ty + 7.5], [fx - 5, ty + 7.5]]
    footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: g + 2.5 }], 3)
    // The leg, straight from the plinth to where it joins its twin.
    const jx = s * LEG_HX1
    loftSolid(C, [ring(fx, ty, LEG_HX0, LEG_HY0, g + 2.4, 0.6), ring(jx, ty, LEG_HX1, LEG_HY1, JOIN + 4, 0.5)], [false, false])
  }
  // The shaft: from just below the join, flaring in, up to the top.
  const zs = [JOIN - 10, JOIN + 5, 158, 185, TOP - 1.2]
  const rings = zs.map((z) => ring(0, ty, SHAFT_HX(z), SHAFT_HY(z), z, 0.6))
  rings.push(ring(0, ty, SHAFT_HX(TOP) - 0.6, SHAFT_HY(TOP) - 0.6, TOP, 0.3))
  loftSolid(C, rings, [true, true])
}

// ---- Stays ---------------------------------------------------------------------

const N_STAYS = 27, Z_LOW = 147, Z_HIGH = 214, NEAR = 28

function stays(k: Kit, ty: number, lod: Lod) {
  const st = Math.sign(ty)
  const end = st < 0 ? US_END : CA_END
  for (const s of [-1, 1])
    for (const [dir, far] of [[-st, T - 12], [st, Math.abs(end) - T - 12]] as [number, number][]) {
      const lines: [V3, V3][] = []
      for (let i = 0; i < N_STAYS; i++) {
        const t = i / (N_STAYS - 1)
        const z = Z_LOW + (Z_HIGH - Z_LOW) * t
        const top: V3 = [s * (SHAFT_HX(z) - 2.2), ty + dir * (SHAFT_HY(z) - 0.6), z]
        const y = ty + dir * (NEAR + (far - NEAR) * t)
        lines.push([top, [s * (HALF + 0.2), y, road(y) - 0.4]])
      }
      if (lod === 'detail') for (const [a, b] of lines) rod(k.stays, a, b, 0.3, 4)
      else {
        for (let i = 0; i < N_STAYS; i += 3) rod(k.stays, lines[i][0], lines[i][1], 0.5, 3)
        rod(k.stays, lines[N_STAYS - 1][0], lines[N_STAYS - 1][1], 0.5, 3)
        // The fan between the stays, a faint double-sided veil.
        for (let i = 0; i < N_STAYS - 1; i++) {
          const [t0, d0] = lines[i], [t1, d1] = lines[i + 1]
          k.veil.tri(t0, d0, d1); k.veil.tri(t0, d1, t1)
        }
      }
    }
}

// ---- Deck ----------------------------------------------------------------------

/** Deck stations: denser over the main span's curve, the towers and the ends included. */
function deckStations(step: number): number[] {
  return [...stations(US_END, -T, step), ...stations(-T, T, step).slice(1), ...stations(T, CA_END, step).slice(1)]
}

function deck(k: Kit, lod: Lod) {
  const ys = deckStations(lod === 'low' ? 32 : 16)
  for (const s of [-1, 1]) {
    // Edge girder with its pale fascia, and the parapet on it beside the roadway.
    band(k.deck, s * (HALF - 1.0), s * HALF, ys, (y) => road(y) - 0.2, (y) => road(y) - 3.0, { out: true, in: true, bottom: true, ends: true })
    band(k.deck, s * (HALF - 0.5), s * HALF, ys, (y) => road(y) + 1.1, (y) => road(y) - 0.2, { out: true, in: true, top: true, ends: true })
    // The lit deck edge at night: beads on the parapet.
    for (const y of stations(US_END + 10, CA_END - 10, lod === 'low' ? 40 : 20))
      bead(k.lamp, [s * (HALF + 0.15), y, road(y) + 0.3], lod === 'low' ? 0.6 : 0.35, lod === 'low')
  }
  // The floor's underside between the girders, facing down.
  band(k.under, -HALF + 1.0, HALF - 1.0, ys, (y) => road(y) - 1.0, (y) => road(y) - 1.6, { bottom: true })
}

// ---- Back-span piers -----------------------------------------------------------

const PIERS = [...stations(-T, US_END, (T + US_END) / -4).slice(1), ...stations(T, CA_END, (CA_END - T) / 4).slice(1)]

function piers(k: Kit) {
  for (const y of PIERS) {
    const capTop = road(y) - 3.0, capBot = capTop - 2.2
    box(one(k.concrete), -HALF + 0.5, HALF - 0.5, y - 2.0, y + 2.0, capBot, capTop, { r: 0.4 })
    for (const s of [-1, 1]) {
      const x = s * 11
      const plan: [number, number][] = [[x - 2.25, y - 2.25], [x + 2.25, y - 2.25], [x + 2.25, y + 2.25], [x - 2.25, y + 2.25]]
      footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: capBot + 0.1 }], 2.5, false)
    }
  }
}

// ---- Build -----------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  for (const ty of [-T, T]) { tower(k, ty); stays(k, ty, lod) }
  deck(k, lod)
  piers(k)
  return k
}

if (import.meta.main) {
  // Floodlit from below: every side face lit, faces looking up barely.
  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1)
  // Colours from the 2025–2026 daylight photos: the towers' pale grey
  // concrete, the deck's white fascias and parapets, its grey steel
  // underside, the white stays.
  const CONCRETE = { ...finish('tower-concrete', 0xa9adb1), floodlight: flood }
  const DECK = finish('deck-white', 0xd3d5d5)
  const UNDER = finish('deck-underside', 0x8f959a)
  const STAY = { ...finish('stay-white', 0xf3f3ef), floodlight: () => 0.7 }
  const VEIL = { ...finish('stay-fan', 0xf3f3ef), opacity: 0.3, doubleSided: true }
  const LAMP = { name: 'lamp', color: 0xd6d6d0 }
  const low = build('low'), detail = build('detail')
  const lowList = [
    { part: low.concrete, material: CONCRETE }, { part: low.deck, material: DECK }, { part: low.under, material: UNDER },
    { part: low.stays, material: STAY }, { part: low.veil, material: VEIL }, { part: low.lamp, material: LAMP },
  ]
  const detailList = [
    { part: detail.concrete, material: CONCRETE }, { part: detail.deck, material: DECK }, { part: detail.under, material: UNDER },
    { part: detail.stays, material: STAY }, { part: detail.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the pylons, on the river',
    bearing: 132.16, elevation: 0, towers: [-T, T], ends: [US_END, CA_END],
    roadwayMidspan: road(0), roadwayAtTowers: road(T), roadwayEnds: [road(US_END), road(CA_END)],
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['det-gordie-howe-bridge.glb', lowList, 5000, 250 * 1024],
    ['det-gordie-howe-bridge.detail.glb', detailList, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Gordie Howe International Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
