/**
 * Roberto Clemente Bridge (Sixth Street Bridge, 1928; Allegheny County
 * Department of Public Works, T. J. Wilkerson; American Bridge Co.) —
 * procedural, CC0-1.0, no textures.
 * bun generators/pit-roberto-clemente-bridge.ts
 *
 * This file also holds the shared Three Sisters geometry (`buildSister`),
 * which pit-andy-warhol-bridge.ts and pit-rachel-carson-bridge.ts import
 * with their own measured spans and heights. Merge this file first.
 *
 * The three are near-identical self-anchored eyebar-chain suspension
 * bridges over the Allegheny: two steel portal towers (legs either side of
 * the chain plane joined by a plate spandrel with a tall elliptical arch
 * and a row of five openings over it) on stone piers; two eyebar chains
 * that drop from the tower tops to the stiffening plate girders at midspan
 * and to the girders' ends over the end piers, where they are anchored (no
 * ground anchorages); solid riveted plate girders standing about 1.3 m
 * above the roadway between the roadway and the cantilevered sidewalks;
 * short approach spans to the abutments; stone kiosks with lanterns on the
 * corners of the end piers; all steel painted Aztec Gold.
 *
 * The whole bridge is one placement, abutment to abutment, which is what
 * the OSM outline covers. Writes a low model (towers, piers, chains as
 * solid polygonal bands, girders and sidewalk fascias, soffit, kiosks,
 * lamp points) and a detail model (adds the paired suspenders, chain pin
 * plates, floor beams, sidewalk brackets, the outer railing and lamp
 * posts), which a map draws from detailZoom 16.
 *
 * Frame: x across the bridge (+x upstream, east-north-east), y along it
 * toward the North Shore, z up, metres; origin midway between the towers,
 * on the water. Placed at the bearing of the line through the two chain
 * planes' centres in lidar (344.044° here).
 *
 * Height. z = 0 is the map's river: the map stands the model on the
 * lowest Mapterhorn reading under its footprint, 216.16-216.19 m NAVD88
 * on the Allegheny (`bun tools/terrain.ts check`). Structure heights were
 * read in lidar above the lidar's own water returns (216.72 m NAVD88 in
 * PA_WesternPA_2_2019), and `buildSister` adds the 0.53 m between the two
 * (`DATUM`), so every part stands at its true NAVD88 height in the map.
 * Ground under the end piers and abutments is the map's terrain above its
 * river reading (216.19 m), from 4 m tables taken in this frame
 * (`GROUND`), so the feet land on the terrain the map draws; the tower
 * piers stand in the water at z = 0.
 *
 * Roadway heights the girders, sidewalks and soffit are built around (no
 * road surface is drawn; the map draws the roadway between the girders).
 * Lidar roadway along OSM way/11713124 (tools/bridge_ele.py measure, every
 * 4 m, lower quartile across the lanes), fitted within 0.06 m: a 4.2 %
 * grade up from each end into a crest curve 48 m long, in lidar heights
 * above the lidar water road(y) = 13.9 − 8.75e-4·y² for |y| ≤ 24, then
 * 13.4 − 0.042·(|y| − 24); in the model (+0.53 m) 14.43 m at midspan,
 * 12.18 m at the towers, 9.45 m at the end piers, 8.6 m at the abutments;
 * in NAVD88 230.6 m at midspan, 228.4 m at the towers, 224.7 m at both
 * abutments. Beyond the end piers, where the deck lands, the deck follows
 * the map's terrain (its highest reading across the deck, plus 0.15 m at
 * the sidewalk tops) wherever that stands above the lidar roadway; with
 * the datum fixed that is only the last few metres of the North Shore end.
 * The deck heights at the abutments as built (model z, south/north):
 * Clemente 8.55/8.61 m, Warhol 8.47/8.25 m, Carson 8.65/8.45 m.
 *
 * Fix, November 2026. The models were built with z = 0 at the lidar's
 * water but are placed on the map's river, 0.53 m lower, so the whole
 * structure stood 0.5 m below the true roadway (and below the `ele` now
 * proposed for OSM, ~/landmarks-scratch/osm-ele/<id>.md); the deck only
 * met the streets because the ends were raised to the terrain. All lidar
 * heights now get `DATUM`, and the three roadway profiles were refitted to
 * a fresh 4 m measurement (Clemente crest 13.95 → 13.9, Warhol 14.05 →
 * 14.0, Carson crest moved from y = −3 to 0 at 13.85 with a 4.3 % grade,
 * which had read 0.3 m high over its south side span). Ends checked: the
 * OSM bridge=yes carriageway and sidewalk ways end at the outline ends on
 * all three, and the model's deck, girders and sidewalks run to those ends
 * onto the abutments (4 m end blocks, solid down to the map's terrain).
 * On the downtown side the abutment is the retaining wall over the 10th
 * Street Bypass (OSM barrier=retaining_wall way/824705027-29), and the
 * deck meets Fort Duquesne Boulevard there. On the North Shore, lidar bare
 * earth shows the road landing at the outline end on the Warhol, about
 * 6-10 m past it on the Carson and about 19 m past it on the Clemente,
 * where Federal Street runs on between walled fill (barrier=wall
 * way/546243714). The fill is not part of the bridge in OSM, so the
 * models end at the abutment face. The approach spans (end pier to
 * abutment, 20-33 m) have no intermediate piers in OSM, and the photos show
 * none.
 *
 * Sources (Clemente):
 * - OSM: outline way/642309565 (man_made=bridge, bridge:structure=
 *   suspension, layer 1; wikidata Q7351643), 20 m wide (x ±10), y = −152
 *   (Fort Duquesne Boulevard abutment, where it flares) to +150.6 (North
 *   Shore abutment); piers way/824705033 (south end), 824705040 and
 *   824705039 (towers), 824705038 (north end), all bridge:support=pier, no
 *   buildings. No building or building:part lies inside the outline.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 0.5 m grid over the
 *   whole bridge: towers at y = ±65.5 (131 m apart); leg tops (with the
 *   chain saddles) 32.35 m, the portal top 31.2 m; legs at |x| 5.5–7.5 in
 *   the top returns, about 2.5 m along the bridge, the portal about 2 m;
 *   chains in planes 12.8 m apart (x ±6.4); chain top 15.85 m at midspan,
 *   a parabola to the tower tops checked within 0.2 m at y = −34 and +50;
 *   side-span chains 19.35/19.25 m at 24.5 m from the towers and
 *   11.3/11.2 m at 48.5 m, reaching the girder top (road + 1.3) about 12 m
 *   short of the end piers and lying on it from there; end piers at
 *   y = −130.5 and +131; sidewalks at |x| 7–10, 0.2 m above the roadway,
 *   railings 1.5 m above them; stone kiosks at x ≈ ±12 on all four end-pier
 *   corners, lanterns topping out at 17.0 m.
 * - Published (Wikipedia "Roberto Clemente Bridge"; HAER PA-490-A): opened
 *   1928, main span 430 ft (131 m), self-anchored suspension with eyebar
 *   chains, painted Aztec Gold, the first of the three identical sisters;
 *   renamed 1998.
 * - Photos (Wikimedia Commons):
 *   - "PNC Park with Roberto Clemente Bridge May 2018" (Y2kcrazyjoker4,
 *     CC BY-SA 4.0): the whole bridge from above, towers, piers, chain,
 *     girder band, lamp posts;
 *   - "Pittsburgh, Pennsylvania (8482456911)" (Doug Kerr, CC BY-SA 2.0):
 *     side elevation from upstream, suspender spacing (16 panels main span,
 *     8 per side span), pier proportions;
 *   - "Pgh 20080621 2778 (2631836173)" (Christopher Lancaster, CC BY-SA
 *     2.0): the portal face from the roadway: arch shape and the five
 *     spandrel openings, read as fractions of the tower's height above the
 *     road (springing 0.33, crown 0.72, openings 0.67–0.785 up to 0.875);
 *   - "Fort Duquesne Boulevard looking at Roberto Clemente Bridge, August 8
 *     2025, Downtown Pittsburgh, Pennsylvania 06" (Deans Charbal, CC BY-SA
 *     4.0): the stone kiosks with lanterns at the downtown end;
 *   - "Cityscape and view of north tower, looking south" HAER PA,2-PITBU,
 *     78A-2 and "HAER PBG 6thStreet 361497cv" (Jet Lowe, 1999, public
 *     domain): the plate girder above the roadway, paired suspenders, pins.
 *   - "EM ROBERTO CLEMENTE BRIDGE (2441699323)" (Eddie Maloney, CC BY-SA
 *     2.0) and "PNC park with 6th street bridge and Pittsburgh skyline"
 *     (JMTEH, CC BY-SA 4.0): colour, the towers from the side.
 * - Night: "Roberto Clemente (Sixth Street) Bridge at night, 2024-04-02,
 *   02" (Cbaile19, CC0): towers floodlit gold, blue lights at the chain's
 *   pin joints, white light on the suspenders, white lamp posts on the
 *   sidewalks. So: `_FLOODLIGHT` on the towers (full) and on the rest of
 *   the steel (partial, from the deck lamps); light beads at the pins; `lamp` beads on the lamp posts and kiosk lanterns.
 *   The pin lights are blue in the photo; they are drawn as `lamp` beads
 *   (warm white at night, not drawn by day in Parchment) rather than
 *   `neon`, which would put blue dots on the gold chain by day.
 *
 * Estimated: the girder's depth below the roadway (1.5 m; the underside is
 * not in lidar), the sidewalk slab's depth, the stone piers' height (9.2 m
 * at the towers, 1 m under the girders, from the aerial and night photos) and plan (OSM's extent, battered
 * 0.4–0.5 m), the end piers' and abutments' tops (just under the girders
 * and the map's roadway), the kiosks' size (2.4 m square), the lamp-post
 * spacing (16 m), the chain's section (1.2 × 0.8 m, from the Carson portal photo; 1.5 × 1.2 m in the low model so it reads at phone size), the suspender pairs
 * (0.2 m rods, 0.5 m apart), the floor beams. The arch is drawn as a half
 * ellipse to the photo's springing and crown; the real soffit eases into
 * the legs a little more.
 * Colour: Aztec Gold from sunlit photos (#e3cf6a), pulled to #d8c062; the
 * undersides a shade darker; the piers' and kiosks' grey-buff ashlar (#b9b2a4 in sun on the
 * Warhol and Carson photos; darker where weathered) pulled to #c6bdab.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, face, footedLoft, groundAt, merged, parabola, rod, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

export type SisterSpec = {
  id: string
  name: string
  bearing: number
  /** Towers at y = ±T. */
  T: number
  /** End piers' centres, |y|, south and north. */
  endPier: [number, number]
  /** Outline ends (abutment faces), |y|, south and north. */
  ends: [number, number]
  /** Leg tops (chain saddles), above the water. */
  top: number
  /** Chain top at midspan. */
  low: number
  /** Side-span chain tops at 24.5 and 48.5 m from each tower: south, north. */
  side: [[number, number], [number, number]]
  /** Roadway: crest height, crest position, crest curve half-length, grade. */
  road: { R0: number; yc: number; Lc: number; g: number }
  /** Kiosk lantern tops, above the water. */
  kioskTop: number
  ground: { south: GroundGrid; north: GroundGrid }
  sources?: Record<string, unknown>
}

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

const XG = 6.4          // chain and girder planes
const GW = 0.8          // girder thickness
const G_UP = 1.3, G_DOWN = 1.5
const WALK_OUT = 10.0, WALK_UP = 0.25, WALK_DOWN = 0.75
const SOFFIT = 1.0
const CH_W = 0.8, CH_H = 1.2
const LEG_IN = 5.25, LEG_OUT = 7.75, LEG_D = 1.25
const PORTAL_D = 0.8
/** Lidar water (216.72 m NAVD88) above the map's river (216.19 m). */
export const DATUM = 0.53
const PIER_TOP = 9.2 + DATUM

/** An upright box, all six faces unless told otherwise. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** An upright prism over a convex plan (CCW from above), capped on top. */
function prism(p: Part, plan: [number, number][], z0: number, z1: number) {
  for (let i = 0; i < plan.length; i++) {
    const [ax, ay] = plan[i], [bx, by] = plan[(i + 1) % plan.length]
    face(p, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], norm([by - ay, -(bx - ax), 0]))
  }
  const n: V3 = [0, 0, 1]
  for (let i = 1; i < plan.length - 1; i++)
    p.tri([plan[0][0], plan[0][1], z1], [plan[i][0], plan[i][1], z1], [plan[i + 1][0], plan[i + 1][1], z1], undefined, undefined, undefined, [n, n, n])
}

/** A rectangular band (w across x, h perpendicular in the y-z plane) along a polyline, mitred at the nodes. */
function chainBand(p: Part, path: V3[], w: number, h: number) {
  const X: V3 = [1, 0, 0]
  const rings = path.map((c, i) => {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const U = norm(cross(X, t))
    const s = 1
    const hu = mul(U, (h / 2) * s), wx = mul(X, w / 2)
    return { U, pts: [sub(sub(c, wx), hu), sub(add(c, wx), hu), add(add(c, wx), hu), add(sub(c, wx), hu)] as V3[] }
  })
  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i].pts, b = rings[i + 1].pts, U = norm(add(rings[i].U, rings[i + 1].U))
    face(p, a[3], a[2], b[2], b[3], U)              // top
    face(p, a[0], a[1], b[1], b[0], mul(U, -1))     // bottom
    face(p, a[1], a[2], b[2], b[1], X)              // +x side
    face(p, a[0], a[3], b[3], b[0], [-1, 0, 0])     // -x side
  }
}

/** Builds one sister and writes its low and detail GLBs. */
export async function buildSister(spec: SisterSpec) {
  // Lidar heights are taken above the lidar's water (216.72 m NAVD88); the
  // map stands z = 0 on its own river reading (Mapterhorn 216.16-216.19 m),
  // so every lidar height goes up by the difference to sit at its true
  // NAVD88 height in the map, where the roadway's `ele` puts the deck.
  const S: SisterSpec = {
    ...spec,
    top: spec.top + DATUM, low: spec.low + DATUM, kioskTop: spec.kioskTop + DATUM,
    side: spec.side.map(([a, b]) => [a + DATUM, b + DATUM]) as SisterSpec['side'],
    road: { ...spec.road, R0: spec.road.R0 + DATUM },
  }
  const { T, top } = S
  const [EPS, EPN] = S.endPier, [ENDS, ENDN] = S.ends
  const k = S.road.g / (2 * S.road.Lc)
  const ground = (x: number, y: number) => (Math.abs(y) < 100 ? 0 : Math.max(0, groundAt(y < 0 ? S.ground.south : S.ground.north, x, y)))
  const lidarRoad = (y: number) => {
    const d = Math.abs(y - S.road.yc)
    return d <= S.road.Lc ? S.road.R0 - k * d * d : S.road.R0 - k * S.road.Lc ** 2 - S.road.g * (d - S.road.Lc)
  }
  // Where the deck lands on an abutment the map eases its roadway onto its
  // terrain, so beyond the end piers the deck rises to the terrain (less the
  // sidewalk's step) wherever that stands above the lidar roadway.
  const road = (y: number) => {
    const r = lidarRoad(y)
    if (Math.abs(y) < (y < 0 ? EPS : EPN) + 4) return r
    let g = 0
    for (let x = -12; x <= 12; x += 2) for (const dy of [0, 2, 4]) g = Math.max(g, ground(x, y + Math.sign(y) * dy))
    return Math.max(r, g - WALK_UP + 0.4)
  }
  const gTop = (y: number) => road(y) + G_UP
  const gBot = (y: number) => road(y) - G_DOWN

  // Chain centre lines.
  const C = CH_H / 2
  const main = (y: number) => (S.low - C) + (top - S.low) * (y / T) ** 2
  const sideFn = (sd: [number, number]) => {
    const f = parabola([T, top - C], [T + 24.5, sd[0] - C], [T + 48.5, sd[1] - C])
    // Hold the vertex: past it the chain lies on the girder.
    let vy = T, vz = top
    for (let a = T; a <= T + 80; a += 0.5) if (f(a) < vz) { vz = f(a); vy = a }
    return (a: number) => (a > vy ? vz : f(a))
  }
  const sideS = sideFn(S.side[0]), sideN = sideFn(S.side[1])
  const chainZ = (y: number) => {
    const a = Math.abs(y)
    const z = a <= T ? main(y) : (y < 0 ? sideS(a) : sideN(a))
    return Math.max(z, gTop(y) + C - 0.05)
  }
  const nodes = [
    ...stations(-EPS, -T, (EPS - T) / 8),
    ...stations(-T, T, (2 * T) / 16).slice(1, -1),
    ...stations(T, EPN, (EPN - T) / 8),
  ]
  const isTower = (y: number) => Math.abs(Math.abs(y) - T) < 0.01

  const goldLow = new Part(), goldDet = new Part(), shadeLow = new Part(), shadeDet = new Part()
  const stone = new Part(), towers = new Part(), lampsLow = new Part(), lampsDet = new Part()
  const wires = new Part()
  const both = (f: (p: Part) => void, ...ps: Part[]) => ps.forEach(f)

  // ---- Deck: girders, sidewalks, soffit -------------------------------------
  const ys = stations(-ENDS, ENDN, 4)
  for (const s of [-1, 1]) {
    const x0 = s * (XG - GW / 2), x1 = s * (XG + GW / 2)
    both((p) => band(p, x0, x1, ys, gTop, gBot), goldLow, goldDet)
    // Sidewalk: walking surface, outer fascia, underside.
    const w0 = s * (XG + GW / 2), w1 = s * WALK_OUT
    both((p) => band(p, w0, w1, ys, (y) => road(y) + WALK_UP, (y) => road(y) - WALK_DOWN, { top: true, out: true, ends: true }), goldLow, goldDet)
    both((p) => band(p, w0, w1, ys, (y) => road(y) + WALK_UP, (y) => road(y) - WALK_DOWN, { bottom: true }), shadeLow, shadeDet)
    // Detail: the outer railing (top and bottom rails on posts).
    band(goldDet, s * (WALK_OUT - 0.18), s * (WALK_OUT - 0.02), ys, (y) => road(y) + 1.4, (y) => road(y) + 1.22)
    band(goldDet, s * (WALK_OUT - 0.16), s * (WALK_OUT - 0.04), ys, (y) => road(y) + 0.5, (y) => road(y) + 0.38)
    for (const y of stations(-ENDS, ENDN, 2.4)) rod(goldDet, [s * (WALK_OUT - 0.1), y, road(y) + WALK_UP], [s * (WALK_OUT - 0.1), y, road(y) + 1.3], 0.07, 3)
  }
  const sx = XG - GW / 2
  both((p) => band(p, -sx, sx, ys, (y) => road(y) - SOFFIT + 0.1, (y) => road(y) - SOFFIT, { bottom: true }), shadeLow, shadeDet)
  // Detail: floor beams at the panel points, sidewalk brackets.
  for (const y of stations(-ENDS, ENDN, 8.15)) {
    band(shadeDet, -sx, sx, [y - 0.25, y + 0.25], () => road(y) - SOFFIT, () => road(y) - SOFFIT - 0.7, { bottom: true, ends: true, in: true, out: true })
    for (const s of [-1, 1]) {
      const a = s * (XG + GW / 2), b = s * (WALK_OUT - 1.2)
      box(shadeDet, Math.min(a, b), Math.max(a, b), y - 0.15, y + 0.15, road(y) - WALK_DOWN - 0.8, road(y) - WALK_DOWN, true)
    }
  }

  // ---- Chains, suspenders, pins ------------------------------------------------
  for (const s of [-1, 1]) {
    const path: V3[] = nodes.map((y) => [s * XG, y, isTower(y) ? top - C : chainZ(y)])
    chainBand(goldDet, path, CH_W, CH_H)
    // The far view's chain is drawn about 1.7 times its real section, so it reads at phone size.
    chainBand(goldLow, path.map(([x, y, z]) => [x, y, z + 0.25] as V3), 1.2, 1.5)
    for (const y of nodes) {
      if (isTower(y)) continue
      const zc = chainZ(y), clear = zc - C - gTop(y)
      const pin: V3 = [s * XG, y, zc + C + 0.35]
      if (Math.abs(y) < EPS - 0.5 && Math.abs(y) < EPN - 0.5) {
        bead(lampsDet, pin, 0.32)
        bead(lampsLow, [s * XG, y, zc + C + 0.45], 0.6, true)
      }
      if (clear < 0.8) continue
      // Pin plate and the suspender pair.
      box(goldDet, s * XG - 0.45, s * XG + 0.45, y - 0.5, y + 0.5, zc - 0.75, zc + 0.75)
      for (const dy of [-0.28, 0.28]) rod(wires, [s * XG, y + dy, gTop(y)], [s * XG, y + dy, zc - 0.7], 0.11, 4)
    }
  }

  // ---- Towers and their piers ------------------------------------------------------
  for (const yT of [-T, T]) {
    const rT = road(yT), H = top - rT
    const pTop = top - 1.15
    for (const s of [-1, 1]) {
      const [a, b] = s > 0 ? [LEG_IN, LEG_OUT] : [-LEG_OUT, -LEG_IN]
      prism(towers, chamferedRect(a, b, yT - LEG_D, yT + LEG_D, 0.25), PIER_TOP + 0.7, top - 0.3)
      prism(towers, chamferedRect(a - 0.15, b + 0.15, yT - LEG_D - 0.15, yT + LEG_D + 0.15, 0.3), top - 0.3, top)
      prism(towers, chamferedRect(a - 0.6, b + 0.6, yT - LEG_D - 0.6, yT + LEG_D + 0.6, 0.3), PIER_TOP, PIER_TOP + 0.7)
    }
    // Portal plate: elliptical arch, five openings in the spandrel.
    const spring = rT + 0.33 * H, crown = rT + 0.72 * H
    const arch = (x: number) => spring + (crown - spring) * Math.sqrt(Math.max(0, 1 - (x / LEG_IN) ** 2))
    const opens: [number, number, number, number][] = (
      [[-4.35, 0.55, 0.67], [-2.25, 0.55, 0.76], [0, 0.78, 0.785], [2.25, 0.55, 0.76], [4.35, 0.55, 0.67]] as const
    ).map(([c, hw, b]) => [c - hw, c + hw, rT + b * H, rT + 0.875 * H])
    const xsSet = new Set<number>()
    for (let i = 0; i <= 14; i++) xsSet.add(+(-LEG_IN * Math.cos((Math.PI * i) / 14)).toFixed(4))
    for (const [l, r] of opens) { xsSet.add(l); xsSet.add(r) }
    const xs = [...xsSet].sort((p, q) => p - q)
    const d0 = yT - PORTAL_D, d1 = yT + PORTAL_D
    const quadFB = (xa: number, xb: number, la: number, lb: number, ha: number, hb: number) => {
      face(towers, [xa, d0, la], [xb, d0, lb], [xb, d0, hb], [xa, d0, ha], [0, -1, 0])
      face(towers, [xa, d1, la], [xb, d1, lb], [xb, d1, hb], [xa, d1, ha], [0, 1, 0])
    }
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i], xb = xs[i + 1], xm = (xa + xb) / 2
      const za = arch(xa), zb = arch(xb)
      const op = opens.find(([l, r]) => xm > l && xm < r)
      const hiTop = pTop
      // Arch soffit.
      face(towers, [xa, d0, za], [xb, d0, zb], [xb, d1, zb], [xa, d1, za], norm([zb - za, 0, -(xb - xa)]))
      face(towers, [xa, d0, hiTop], [xb, d0, hiTop], [xb, d1, hiTop], [xa, d1, hiTop], [0, 0, 1])
      if (!op) { quadFB(xa, xb, za, zb, hiTop, hiTop); continue }
      quadFB(xa, xb, za, zb, op[2], op[2])
      quadFB(xa, xb, op[3], op[3], hiTop, hiTop)
      face(towers, [xa, d0, op[2]], [xb, d0, op[2]], [xb, d1, op[2]], [xa, d1, op[2]], [0, 0, 1])
      face(towers, [xa, d0, op[3]], [xb, d0, op[3]], [xb, d1, op[3]], [xa, d1, op[3]], [0, 0, -1])
    }
    for (const [l, r, ob, ot] of opens) {
      face(towers, [l, d0, ob], [l, d1, ob], [l, d1, ot], [l, d0, ot], [1, 0, 0])
      face(towers, [r, d0, ob], [r, d1, ob], [r, d1, ot], [r, d0, ot], [-1, 0, 0])
    }
    // Stone pier, battered, with a coping.
    footedLoft(stone, ground, [
      { plan: chamferedRect(-13, 13, yT - 3.4, yT + 3.4, 2.0), z: 'ground' },
      { plan: chamferedRect(-12.5, 12.5, yT - 2.9, yT + 2.9, 1.8), z: PIER_TOP - 0.5 },
      { plan: chamferedRect(-12.8, 12.8, yT - 3.2, yT + 3.2, 1.9), z: PIER_TOP - 0.5 },
      { plan: chamferedRect(-12.8, 12.8, yT - 3.2, yT + 3.2, 1.9), z: PIER_TOP },
    ], 3)
  }

  // ---- End piers, kiosks, abutments ---------------------------------------------
  for (const yE of [-EPS, EPN]) {
    const top0 = gBot(yE) - 0.3
    footedLoft(stone, ground, [
      { plan: chamferedRect(-13, 13, yE - 3.2, yE + 3.2, 1.8), z: 'ground' },
      { plan: chamferedRect(-12.6, 12.6, yE - 2.8, yE + 2.8, 1.6), z: top0 },
    ], 3)
    const r = road(yE)
    for (const s of [-1, 1]) {
      const x = s * 11.6
      box(stone, x - 1.2, x + 1.2, yE - 1.2, yE + 1.2, top0, r + 3.6, false)
      box(stone, x - 1.45, x + 1.45, yE - 1.45, yE + 1.45, r + 3.6, r + 4.1)
      prism(stone, chamferedRect(x - 0.8, x + 0.8, yE - 0.8, yE + 0.8, 0.3), r + 4.1, r + 4.5)
      const lantern: V3 = [x, yE, S.kioskTop - 0.6]
      if (S.kioskTop - 0.6 > r + 5.2) rod(goldDet, [x, yE, r + 4.5], [x, yE, S.kioskTop - 1.1], 0.12, 4)
      bead(lampsDet, lantern, 0.5)
      bead(lampsLow, lantern, 0.9, true)
    }
  }
  for (const [yA, dir] of [[-ENDS, 1], [ENDN, -1]] as [number, number][]) {
    const t = road(yA) - 0.4
    const [y0, y1] = dir > 0 ? [yA, yA + 4] : [yA - 4, yA]
    footedLoft(stone, ground, [
      { plan: chamferedRect(-10.2, 10.2, y0, y1, 0), z: 'ground' },
      { plan: chamferedRect(-10.2, 10.2, y0, y1, 0), z: t },
    ], 3, false) // no top: it sits under the map's roadway, where the North Shore bank rises to it
  }

  // ---- Lamp posts on the sidewalks -------------------------------------------------
  for (const y of stations(-ENDS + 12, ENDN - 12, 16.3)) {
    if (Math.abs(Math.abs(y) - T) < 5 || Math.abs(y + EPS) < 4 || Math.abs(y - EPN) < 4) continue
    for (const s of [-1, 1]) {
      const x = s * (WALK_OUT - 0.4), z = road(y) + WALK_UP
      rod(goldDet, [x, y, z], [x, y, z + 6.2], 0.1, 4)
      bead(lampsDet, [x, y, z + 6.5], 0.35)
      bead(lampsLow, [x, y, z + 6.5], 0.7, true)
    }
  }

  // ---- Materials ------------------------------------------------------------------------
  // Towers floodlit from the deck and piers; the rest of the steel catches
  // the deck lamps; faces looking up catch little.
  const lit = (p: V3, n: V3): number => {
    const nearTower = Math.abs(Math.abs(p[1]) - T) < 3 && Math.abs(p[0]) < 9
    const up = n[2] > 0.7 ? 0.35 : 1
    if (nearTower) return (p[2] > road(p[1]) ? 1 : 0.6) * up
    return 0.4 * up
  }
  const pierLit = (p: V3, n: V3): number => (Math.abs(Math.abs(p[1]) - T) < 5 ? 0.7 : 0.3) * (n[2] > 0.7 ? 0.4 : 1)
  const GOLD: MaterialSpec = { ...finish('aztec-gold', 0xd8c062), floodlight: lit }
  const SHADE: MaterialSpec = { ...finish('aztec-gold-shade', 0xb09b4f), floodlight: lit }
  const STONE: MaterialSpec = { ...finish('pier-sandstone', 0xc6bdab), floodlight: pierLit }
  const LAMP: MaterialSpec = { name: 'lamp', color: 0xe6e0cf }

  const low = [
    { part: merged(towers, goldLow), material: GOLD },
    { part: shadeLow, material: SHADE },
    { part: stone, material: STONE },
    { part: lampsLow, material: LAMP },
  ]
  const detail = [
    { part: merged(towers, goldDet, wires), material: GOLD },
    { part: shadeDet, material: SHADE },
    { part: stone, material: STONE },
    { part: lampsDet, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: S.bearing, elevation: 0, towers: [-T, T], endPiers: [-EPS, EPN], ends: [-ENDS, ENDN],
    roadwayMidspan: +road(0).toFixed(2), roadwayAtTowers: +road(T).toFixed(2), roadwayEndPiers: [+road(-EPS).toFixed(2), +road(EPN).toFixed(2)],
    roadwayEnds: [+road(-ENDS).toFixed(2), +road(ENDN).toFixed(2)], zeroNAVD88: 216.19, lidarWaterNAVD88: 216.72,
  }
  const count = (l: { part: Part }[]) => l.reduce((n, { part }) => n + part.triangles, 0)
  for (const [file, list, maxTris, maxBytes] of [
    [`${S.id}.glb`, low, 6500, 250 * 1024],
    [`${S.id}.detail.glb`, detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = count([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb(S.name, [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}

// Map terrain (Mapterhorn) above its river reading, 4 m apart in this frame.
const GROUND = {"south":{"y0":-176.0,"x0":-16.0,"step":4.0,"z":[[7.6,7.7,7.7,7.7,7.8,7.8,7.7,7.7,7.7],[7.8,7.8,7.8,7.9,7.9,7.9,7.9,7.8,7.8],[7.9,7.9,8.0,8.0,8.0,8.0,8.0,7.9,7.9],[8.1,8.1,8.1,8.1,8.1,8.1,8.1,8.0,8.0],[8.3,8.2,8.2,8.2,8.2,8.2,8.3,8.3,8.3],[8.3,8.3,8.4,8.4,8.4,8.4,8.4,8.4,8.4],[3.4,4.1,5.0,5.5,5.8,5.9,6.2,6.2,5.8],[2.2,2.2,2.9,3.6,3.7,3.6,3.3,2.3,2.2],[2.1,2.1,2.4,2.6,2.6,2.5,2.4,2.1,2.1],[2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0],[1.9,1.9,1.8,1.8,1.8,1.8,1.9,1.9,1.9],[1.9,1.6,1.1,0.9,0.9,1.0,1.3,1.6,1.9],[0.4,0.2,0.1,0.1,0.1,0.2,0.3,0.4,0.9],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]]},"north":{"y0":112.0,"x0":-16.0,"step":4.0,"z":[[2.3,1.6,0.3,0.1,0.0,0.0,0.0,0.0,0.0],[2.5,1.5,0.7,0.6,0.3,0.0,0.0,0.0,0.0],[2.6,2.1,1.6,1.2,0.8,0.5,0.2,0.0,0.0],[2.8,2.5,2.1,1.8,1.5,1.5,1.4,1.1,1.1],[3.0,2.8,2.7,2.6,2.5,2.4,2.3,2.1,2.0],[3.3,3.2,3.2,3.1,3.0,3.0,2.9,2.9,3.0],[3.7,4.3,3.5,3.3,3.2,3.1,3.1,3.1,3.1],[7.7,5.9,4.8,3.9,3.4,3.2,3.1,3.1,3.2],[8.7,7.3,6.4,5.5,4.6,3.7,3.3,3.2,3.3],[8.9,8.2,7.3,6.5,5.7,4.8,3.9,3.5,3.7],[8.7,8.2,7.4,6.7,5.9,5.1,4.5,4.4,4.7],[8.6,8.5,7.9,7.2,6.4,5.7,5.6,5.6,5.7],[8.4,8.5,8.3,7.6,7.0,6.8,6.7,6.5,6.3],[8.2,8.3,8.3,8.0,7.9,7.9,7.9,7.4,7.0],[8.1,8.1,8.1,8.0,8.0,8.0,8.0,7.9,7.4],[7.9,8.0,7.9,7.8,7.9,7.8,7.8,7.9,7.7],[7.9,7.9,7.8,7.7,7.7,7.7,7.7,7.7,7.7]]}}

export const CLEMENTE: SisterSpec = {
  id: 'pit-roberto-clemente-bridge',
  name: 'Roberto Clemente Bridge',
  bearing: 344.044,
  T: 65.5,
  endPier: [130.5, 131],
  ends: [152, 150.6],
  top: 32.35,
  low: 15.85,
  side: [[19.35, 11.3], [19.25, 11.2]],
  road: { R0: 13.9, yc: 0, Lc: 24, g: 0.042 },
  kioskTop: 17.0,
  ground: GROUND,
}

if (import.meta.main) await buildSister(CLEMENTE)
