/**
 * Kearns Building (1911, Parkinson & Bergstrom), 136 S Main Street, Salt
 * Lake City: procedural, CC0-1.0.
 * bun generators/slc-kearns-building.ts   (kit: slc-wells-fargo-center.ts)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/143796147 (-111.891671, 40.766203). y = 0 is the
 * lowest ground under the outline.
 *
 * Form: a ten-storey U-plan office block, its light court open to the
 * south above a two-storey infill (the 1911 floor plan, p4, and NAIP). The
 * Main Street (east) front is white terra cotta, Sullivanesque: a two-storey
 * grey granite base with the round-arched entrance portal in the middle,
 * eight storeys of paired windows between plain piers, round-arched windows
 * in the top storey and a heavy bracketed cornice. The other walls are buff
 * brick with the same window rhythm and arched top storey under the
 * cornice, which runs round the north face too. A plant penthouse sits on
 * the roof behind the front.
 *
 * OSM: way/143796147 outline (10 levels, Q65069559); parts way/1437049425
 * (10 levels) and way/1437049426 (the 2-level court infill).
 * Lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013), above the
 * street: roof 44.5–46 m, the north parapet 46 m (drawn: cornice top 45.8),
 * the court infill 8.5 m, the penthouse 50.8 m. The lidar outline sits about
 * 3 m east of OSM's on the west wall; OSM's is kept.
 * Estimated from photos: base 9 m (p1, p2); seven bays on Main Street, the
 * windows paired (p1, p3); top storey 41–44 m with arched heads (p1);
 * cornice 1.2 m proud; the portal 5 m wide, 8 m to its crown (p2), its
 * position in the middle of the front estimated.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Kearns_Building,_SLC_(4).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the Main Street front and the north wall, from the north-east)
 *  p2 https://commons.wikimedia.org/wiki/File:Kearns_Building,_SLC_(2).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the entrance portal)
 *  p3 https://commons.wikimedia.org/wiki/File:Kearns_Building,_SLC_(6).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the terra cotta of the lower floors)
 *  p4 https://commons.wikimedia.org/wiki/File:Kearns_Building_(2).jpg
 *     Parkinson and Bergstrom, public domain (a 1911 floor plan)
 * NAIP (USGS, public domain) for the court and the penthouse.
 * Doubts: the south and west walls are unphotographed (drawn as brick with
 * the north wall's rhythm); the KEARNS BUILDING sign panel over the portal
 * is left out (too small to read).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, edges, edgeNormal, boxOn, rect, save } from './slc-wells-fargo-center'

const brick = new Part(), tc = new Part(), win = new Part(), granite = new Part(), roof = new Part()

const U: XY[] = [[-19.8, -18.5], [-3.0, -18.3], [-3.0, -1.5], [10.6, -1.5], [10.7, -18.2], [28.7, -18.1], [28.4, 14.3], [-19.5, 14.0]]
const COURT: XY[] = [[-3.0, -18.3], [10.7, -18.2], [10.6, -1.5], [-3.0, -1.5]]
const Z_BASE = 9, Z_TOPF = 41, Z_CORN = 44, Z_TOP = 45.8

prism(brick, U, 0, Z_CORN)
prism(roof, COURT, 0, 8.5)
prism(brick, rect(-0.5, 1, 10, 13.5), Z_CORN, 50.8)

/** A window panel with a semicircular head: jambs s0..s1 from z0 to the springing zs. */
function arched(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2, seg = 8
  for (let i = 0; i < seg; i++) {
    const a0 = (Math.PI * i) / seg, a1 = (Math.PI * (i + 1)) / seg
    p.tri(P(c, zs), P(c + r * Math.cos(a0), zs + r * Math.sin(a0)), P(c + r * Math.cos(a1), zs + r * Math.sin(a1)))
  }
}

/** Paired windows two storeys to a panel, arched top storey, along one wall. */
function facade(a: XY, b: XY, pitch: number, out: number, zFrom: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nb = Math.max(1, Math.round(L / pitch)), step = L / nb
  for (let i = 0; i < nb; i++) {
    const c = step * (i + 0.5), hw = step * 0.3
    const lifts: [number, number][] = []
    for (let z = zFrom; z < Z_TOPF - 2; z += 8) lifts.push([z + 0.8, Math.min(z + 7.2, Z_TOPF - 0.8)])
    for (const [z0, z1] of lifts) {
      // two lights per bay, a narrow mullion pier between
      win.quad(...quadOn(a, b, c - hw, c - 0.18, z0, z1, out))
      win.quad(...quadOn(a, b, c + 0.18, c + hw, z0, z1, out))
    }
    arched(win, a, b, c - hw, c - 0.18, Z_TOPF + 0.5, Z_CORN - 0.6 - (hw - 0.18) / 2, out)
    arched(win, a, b, c + 0.18, c + hw, Z_TOPF + 0.5, Z_CORN - 0.6 - (hw - 0.18) / 2, out)
  }
}
function quadOn(a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number): [V3, V3, V3, V3] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  return [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)]
}

for (const [a, b] of edges(U)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = edgeNormal(a, b)
  const east = n[0] > 0.9 && L > 25
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  const inCourt = mx > -3.1 && mx < 10.8 && my > -18.4 && my < -1.4
  // the cornice, round every face
  boxOn(tc, a, b, -1.2, L + 1.2, Z_CORN, Z_TOP, 1.2)
  boxOn(tc, a, b, -0.4, L + 0.4, Z_TOPF - 0.4, Z_TOPF + 0.2, 0.35)
  if (east) {
    // Main Street: white terra cotta skin, granite base, the arched portal.
    boxOn(tc, a, b, 0, L, Z_BASE, Z_CORN, 0.3)
    boxOn(granite, a, b, -0.2, L + 0.2, 0, Z_BASE, 0.45)
    facade(a, b, L / 7, 0.35, Z_BASE)
    const c = L / 2
    boxOn(granite, a, b, c - 4, c + 4, 0, Z_BASE + 0.8, 0.8)
    arched(win, a, b, c - 2.5, c + 2.5, 0.2, 5.5, 0.85)
    // shopfronts either side
    for (const [s0, s1] of [[1.2, c - 4.6], [c + 4.6, L - 1.2]] as [number, number][])
      win.quad(...quadOn(a, b, s0, s1, 0.4, Z_BASE - 1.6, 0.5))
  } else {
    // Brick walls: the court sides start above the infill.
    facade(a, b, 3.9, 0.06, inCourt ? 8.5 : Z_BASE)
    if (!inCourt) win.quad(...quadOn(a, b, 1, L - 1, 0.6, Z_BASE - 1.4, 0.06))
  }
}

save('slc-kearns-building', 'Kearns Building', [
  // Buff brick (p1); white terra cotta front and cornice (p1, p3); grey granite base (p2).
  { part: brick, material: finish('kearns-brick', 0xd8c6a2) },
  { part: tc, material: PALETTE.trim },
  { part: granite, material: finish('kearns-granite', 0xa4a4a2) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], 50.8)
