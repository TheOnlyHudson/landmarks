/**
 * Hudson's Detroit (1208 Woodward Avenue, Detroit, completed 2025, SHoP
 * Architects with Hamilton Anderson for Bedrock) — original procedural
 * geometry, CC0-1.0.
 * bun generators/det-hudsons-detroit.ts
 *
 * One model for the whole project: the tower on the former Hudson's
 * department-store site and the 12-storey "block" building across the
 * alley to its north. Both are named Hudson's Detroit in OSM and carry the
 * same Wikidata item (Q106201548); one placement covers both cleanly, as
 * they share the same street grid and bearing.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the tower's OSM outline way/1105871812,
 * 42.3333873,-83.0474364. Bearing 330 (the Woodward grid): the tower is
 * 67.0 × 30.6 m (x -33.5..33.5, y -15.3..15.3); the block is 67.5 × 80 m
 * at y 31.7..111.7.
 *
 * `replaces`: way/1105871812 (tower, 208.9 m), its part way/1565621013
 * (the east podium, 50 m) and way/1105871813 (the block, 70.7 m).
 *
 * Identity, in order: the tower as a cluster of interlocking glass slabs
 * stepping up to the tallest, with two dark louvre bands near its top and
 * its fins running on past the roof as a comb that is lit at night
 * (`neon-hudsons-crown`, champagne by day; the LEDs change colour); the
 * light, sky-reflecting glass with pale metal fins on the finned slabs;
 * the low east podium; the big block with its striped glass body, a
 * recessed glass storey and the dark box on top.
 *
 * Evidence:
 *  - LIDAR IS NOT EVIDENCE HERE: the only flight
 *    (USGS_LPC_MI_WayneCo_2017_LAS_2018, flown 2017) predates construction
 *    and shows an empty lot. Every height is published or photo-scaled.
 *  - published / OSM: tower 208.9 m, 49 levels (OSM, from published
 *    ~685 ft), taken here as the top of the crown fins; the core's roof
 *    behind them estimated ~198 m from the photos; east podium part 50 m, 10 levels (OSM); block 70.7 m,
 *    12 levels (OSM).
 *  - photo-scaled (estimated), from TheWxResearcher's two views from the
 *    north, scaled between the podium top (50 m) and the roof (208.9 m):
 *    slab tops ~178 m (west of the tallest), ~153 m (east, finned),
 *    ~111 m (far west) and ~94 m (the front slab on the north face); the
 *    slab widths along the north face from the same photos. Slab depths
 *    north-south are estimated from the two street photos and are the
 *    least certain numbers here.
 *  - the block: lower striped body to ~52 m, a recessed glass storey,
 *    the dark top box from ~58 m (photo-scaled from TheWxResearcher's
 *    2026 view); OSM building:colour #5d676e for the block's top, #7297b3
 *    for the tower glass.
 *  - colour: the glass reads light blue-grey in daylight, as
 *    `window-2` (#a9bfd1 family); the fins a pale champagne metal.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hudson’s_Detroit_Building_2026-01-01.jpg, TheWxResearcher, CC0 (tower
 *    and block from the north)
 *  - Hudson’s_Detroit_Building_(August_2025).jpg, TheWxResearcher, CC0
 *    (tower from the north, slab steps)
 *  - Detroit_August_2025_16_(Hudson's_Detroit).jpg, Michael Barera,
 *    CC BY-SA 4.0 (finned faces and recessed glass base from the street)
 *  - Pinnacles_of_Guardian_Building,_One_Woodward_Avenue,_and_Hudson's_
 *    Detroit,_Detroit,_Michigan,_2025-08-01.jpg, Chris Woodrich
 *    (Crisco 1492), CC BY-SA 4.0
 *  - Hudson's_Detroit_on_a_snowy_night,_from_One_Campus_Martius_Garage.jpg,
 *    42-BRT, CC BY-SA 4.0 (from the south at night: the fins running past
 *    the core's roof as a lit comb, red in this photo; the finned south
 *    slab; the block's lit glass under its dark top)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: which faces carry the crown comb: the night photo shows it on
 * the face towards Campus Martius, the daylight view from the south-east
 * shows flat tops; it is drawn on the south and west faces. The slab plan is reconstructed from photos taken from the north
 * and one street view; the south and west faces' slab edges are inferred.
 * Slab heights other than the roof are photo-scaled (±8 m). The block's
 * facade pattern is simplified to grouped vertical fins.
 *
 * Left out: the patterned frit of the block, signage, the skybridge-level
 * details, rooftop plant.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, panel, rect, save, walls, type XY } from './chi-aon-center'
import { pier } from './det-book-tower'

/** A glass slab box with pale floor lines and optional fins; returns nothing. */
function slab(glass: Part, trim: Part, roof: Part, fins: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o: { finEvery?: number; lineEvery?: number; finFaces?: number[] } = {}) {
  const r = rect(x0, y0, x1, y1)
  walls(glass, r, z0, z1)
  // a pale coping
  walls(trim, inset(r, -0.15), z1 - 0.6, z1 + 0.3)
  cap(trim, inset(r, -0.15), z1 + 0.3)
  void roof
  const lineEvery = o.lineEvery ?? 16
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let z = z0 + lineEvery; z < z1 - 4; z += lineEvery) panel(trim, a, b, 0, L, z, z + 0.45, 0.04)
    if (fins && (o.finFaces ?? [0, 1, 2, 3]).includes(i)) {
      const n = Math.max(2, Math.round(L / (o.finEvery ?? 3.2)))
      for (let k = 1; k < n; k++) pier(fins, a, b, (k * L) / n - 0.14, (k * L) / n + 0.14, z0, z1 + 0.3, 0.45)
    }
  }
}

function build() {
  const glass = new Part(), fin = new Part(), crown = new Part(), trim = fin, dark = new Part(), roof = new Part(), lobby = new Part()

  // ---------------- the tower
  const LOBBY = 8.5
  // recessed glass lobby under the whole tower outline
  walls(lobby, rect(-32, -13.8, 32, 13.8), 0, LOBBY)
  {
    const s = rect(-33.5, -15.3, 33.5, 15.3)
    cap(trim, s, LOBBY, false) // the soffit over the recessed lobby
  }
  // east podium (OSM part, 50 m), finned
  slab(glass, trim, roof, fin, 17.2, -15.3, 33.5, 15.2, LOBBY, 50, { finEvery: 2.6 })
  // the slabs, west to east: [x0, x1, y0, y1, top, finned]
  const slabs: [number, number, number, number, number, boolean][] = [
    [-33.5, -24, -12, 15.3, 111, false], // far west
    [-24, -14.6, -15.3, 12, 178, false], // west of the tallest
    [-14.6, 7, -15.3, 8, 198, false], // the tallest (core); its fins run on to 208.9
    [-15, -5, 0, 15.3, 94, false], // front slab on the north face
    [-5.6, 17.2, -15.3, 15.3, 153, true], // east, finned
  ]
  for (const [x0, x1, y0, y1, top, finned] of slabs) {
    slab(glass, trim, roof, finned ? fin : null, x0, y0, x1, y1, LOBBY, top, { finEvery: 2.6, finFaces: finned ? [0, 1, 2, 3] : [] })
  }
  // the core's top: two dark louvre bands on all faces
  {
    const r = rect(-14.6, -15.3, 7, 8)
    for (const [z0, z1] of [[186, 191.5], [174, 179.5]]) walls(dark, inset(r, -0.06), z0, z1)
    // the crown: the fins run on past the roof as a lit comb, on the south
    // and west faces only (Woodrich's daylight view shows the other faces
    // ending flat with plant on the roof)
    for (const i of [0, 3]) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 2.6)
      for (let k = 1; k < n; k++) pier(crown, a, b, (k * L) / n - 0.3, (k * L) / n + 0.3, 192, 208.9, 0.7)
    }
  }
  // the west slab (178 m) carries fins on its west and south faces in the photos
  {
    const r = rect(-24, -15.3, -14.6, 12)
    for (const i of [0, 3]) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 2.6)
      for (let k = 1; k < n; k++) pier(fin, a, b, (k * L) / n - 0.14, (k * L) / n + 0.14, LOBBY, 178.3, 0.45)
    }
  }

  // ---------------- the block
  const B = rect(-34.0, 31.7, 33.7, 111.7)
  const BODY = 52, GAP = 58, TOP = 70.7
  walls(lobby, inset(B, 1.2), 0, 6)
  cap(trim, B, 6, false)
  walls(glass, B, 6, BODY)
  walls(trim, inset(B, -0.2), BODY - 0.6, BODY + 0.2)
  cap(roof, inset(B, -0.2), BODY + 0.2)
  for (let i = 0; i < 4; i++) {
    const a = B[i], b = B[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // grouped vertical fins, the block's striped look: pairs every 6 m
    const n = Math.round(L / 6)
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * (L / n)
      pier(fin, a, b, s - 1.2, s - 0.85, 6, BODY - 0.6, 0.4)
      pier(fin, a, b, s + 0.85, s + 1.2, 6, BODY - 0.6, 0.4)
    }
    for (let z = 6 + 11.5; z < BODY - 4; z += 11.5) panel(trim, a, b, 0, L, z, z + 0.45, 0.04)
  }
  const Bg = inset(B, 2.0)
  walls(glass, Bg, BODY + 0.2, GAP)
  const Bd = inset(B, 1.0)
  cap(dark, Bd, GAP, false)
  walls(dark, Bd, GAP, TOP - 0.5)
  walls(dark, Bd, TOP - 0.5, TOP, inset(Bd, 0.4))
  cap(roof, inset(Bd, 0.4), TOP)

  // Night: the office glass glows as windows; the louvres and the dark box stay dark.
  return [
    { part: glass, material: windowVariant(2, 0xa7bdd0) },
    { part: fin, material: finish('hudsons-fin', 0xd2c7b5) },
    { part: crown, material: finish('neon-hudsons-crown', 0xd8cdbb) },
    { part: dark, material: finish('hudsons-dark', 0x6f767d) },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-hudsons-detroit', "Hudson's Detroit", [42.3333873, -83.0474364], 330, build(), 6500)
