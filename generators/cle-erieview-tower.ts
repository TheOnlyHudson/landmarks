/**
 * The Tower at Erieview (Erieview Tower, 1964, Harrison & Abramovitz),
 * Cleveland: procedural, CC0-1.0.
 * bun generators/cle-erieview-tower.ts [out.glb]
 *
 * Map frame: x across the slab (toward bearing 56), y along it (toward
 * bearing 326, north-west), z up, metres; placed at bearing 326. The origin
 * is the OSM outline's centroid (-81.6886456, 41.5053195); z = 0 is the
 * ground under the tower (lidar: the plaza and E 9th Street lie within 1 m
 * of ground_min 194.9 m NAVD88).
 *
 * Form: a plain 40-storey slab, 60 x 31 m, in a dark bronze curtain wall
 * with pale green punched windows. Bold piers divide each long face into
 * seven bays and each end into three, running unbroken from the ground to
 * the roof. Two dark mechanical bands cross every face, about three storeys
 * at the top and two storeys at about 40 % of the height, and the lobby
 * storeys at the foot are darker glass. A small penthouse stands on the
 * flat roof.
 *
 * Sources
 * - OSM (ODbL): way/371234478 (height 161, 40 levels, building:colour black,
 *   Q5388371), the plan. The Galleria at Erieview (way/140019104), the
 *   1987 glass-vaulted mall against the south-west face, is a separate
 *   building and not drawn.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 0.5 m grid read in the slab's frame: roof 160.0 m, parapet
 *   161 m, penthouse about 16 x 14 m, centred, 164-166 m (164.5 drawn). The
 *   lidar outline is the OSM rectangle within a metre.
 * - Published: 529 ft (161 m), 40 storeys (Wikipedia "Erieview Tower";
 *   Emporis/CTBUH).
 * - Photos (Wikimedia Commons, evidence): Geowizical, "Erieview Tower
 *   2023.jpg" (CC BY-SA 4.0: an end and a long face, the three end bays, both
 *   dark bands, the dark lobby storeys); Aivazovsky, "Erieviewtower.jpg"
 *   (CC BY-SA 3.0: a long face nearly square on, its seven bays, the band
 *   heights counted in storeys); Aivazovsky, "Erieview-complex.jpg" (public
 *   domain: the slab over the plaza).
 *   Look-only: the Library of Congress/DPLA photos "Erieview Tower,
 *   Cleveland, Ohio" and "Erieview Tower at night" (marked look-only by the
 *   photo tool; used only to confirm the lit windows at night).
 * Estimated: the storey height (3.79 m, from 40 storeys in 161 m with a tall
 *   lobby); the bands, counted in storeys on the near-square photo: top band
 *   148.5-160 m, middle band 62-69.5 m; the lobby (8 m); the bay piers
 *   (0.9 m wide, 0.35 m proud); three-storey window groups.
 * Colours: the bay piers are a lighter bronze than the frame; the bronze frame is near black in the photos, drawn at the
 *   palette's charcoal limit with a green cast; the glass reads pale
 *   sea-green against it. (The batch notes describe a white mullion grid;
 *   the photos show the opposite, a dark frame with pale glass.)
 * Doubts: the band heights are counted from photos, not lidar (the lidar
 *   sees only the roof); no photo of the north-east face, drawn like the
 *   south-west one.
 * Night: windows glow (window-2), the lobby glass glows (window), the bands
 *   and frame stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, outward, finishGlb } from './sea-columbia-center'
import { wallQuad, panels, type Grid, writeModel } from './cle-200-public-square'

const HX = 15.4, HY = 30.15 // half the slab, across and along
const ROOF = 161, PH = 164.5
const LOBBY = 8, MID0 = 62, MID1 = 69.5, TOP0 = 148.5
const STOREY = 3.79
const PIER = 0.9, PROUD = 0.35

const wall = new Part(), pierP = new Part(), win = new Part(), lobby = new Part(), roof = new Part()

/** A pier box on face a→b at distance s along it, from z0 to z1. */
function pier(a: XY, b: XY, s: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b)
  const at = (u: number, d: number, z: number): V3 => [a[0] + t[0] * u + n[0] * d, a[1] + t[1] * u + n[1] * d, z]
  const u0 = s - PIER / 2, u1 = s + PIER / 2
  // front, two sides, top; split low for the terrain
  const zs = [z0, 5, z1]
  for (let k = 0; k < 2; k++) {
    pierP.quad(at(u0, PROUD, zs[k]), at(u1, PROUD, zs[k]), at(u1, PROUD, zs[k + 1]), at(u0, PROUD, zs[k + 1]))
    pierP.quad(at(u1, PROUD, zs[k]), at(u1, 0, zs[k]), at(u1, 0, zs[k + 1]), at(u1, PROUD, zs[k + 1]))
    pierP.quad(at(u0, 0, zs[k]), at(u0, PROUD, zs[k]), at(u0, PROUD, zs[k + 1]), at(u0, 0, zs[k + 1]))
  }
  pierP.quad(at(u0, 0, z1), at(u0, PROUD, z1), at(u1, PROUD, z1), at(u1, 0, z1))
}

function build() {
  const ring: XY[] = ccw([[-HX, -HY], [HX, -HY], [HX, HY], [-HX, HY]])
  const office: Grid = { bay: 2.5, pier: 1.5, group: 3 * STOREY, spandrel: 1.9, from: LOBBY, edge: 0.95, head: 0.4, foot: 0.4 }
  const lobbyGrid: Grid = { bay: 1.9, pier: 0.35, group: LOBBY, spandrel: 0, from: 0, edge: 0.6, head: 0.9, foot: 0.3 }
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = L > 40 ? 7 : 3
    wallQuad(wall, a, b, 0, ROOF)
    const w = L / bays
    for (let k = 0; k < bays; k++) {
      // one major bay: its own stretch of the face between piers
      const t0 = (k * w + (k ? PIER / 2 : 0.6)) / L, t1 = ((k + 1) * w - (k < bays - 1 ? PIER / 2 : 0.6)) / L
      const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
      const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      panels(lobby, A, B, 0, LOBBY, lobbyGrid)
      panels(win, A, B, LOBBY, MID0, office)
      panels(win, A, B, MID1, TOP0, { ...office, from: MID1 })
    }
    for (let k = 1; k < bays; k++) pier(a, b, k * w, 0, ROOF)
  }
  capRing(roof, ring, ROOF)

  // the penthouse
  const ph: XY[] = ccw([[-8, -7], [8, -7], [8, 7], [-8, 7]])
  for (let i = 0; i < 4; i++) wallQuad(wall, ph[i], ph[(i + 1) % 4], ROOF, PH)
  capRing(roof, ph, PH)

  return finishGlb('cle-erieview-tower', 'Tower at Erieview', [
    { part: wall, material: finish('erieview-bronze', 0x4d5653) },
    { part: pierP, material: finish('erieview-pier', 0x6e665d) },
    { part: win, material: windowVariant(2, 0x9dbfb4) },
    { part: lobby, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 326, height: PH, replaces: ['way/371234478'] })
}

if (import.meta.main) await writeModel('cle-erieview-tower', build())
