/**
 * Fisher Building (3011 West Grand Boulevard, New Center, Detroit, 1928,
 * Albert Kahn) — original procedural geometry, CC0-1.0.
 * bun generators/det-fisher-building.ts
 *
 * Map frame: x, y, z up, metres, turned to the building's walls: +x runs
 * along bearing 63 (east-north-east, along West Grand Boulevard), +y along
 * 333 (away from the boulevard). The anchor is the centroid of the OSM
 * outline way/112057847 (42.3694784, -83.0773572); the catalog bearing is
 * 333. The boulevard front is the -y face.
 *
 * Identity, in order: the 28-storey stepped tower at the corner of the
 * boulevard, pale marble with tall vertical window strips, its sides
 * stepping in through four tiers to the shaft; the steep green-and-gold
 * tiled hipped roof with its finial and mast (floodlit gold at night);
 * the two 11-storey wings, one along the boulevard and one north along
 * the east side, with stepped piers along their parapets; the dark granite
 * three-storey base with the round-arched arcade and the arched main
 * entrance under the tower.
 *
 * Evidence:
 *  - plan: OSM outline way/112057847 (Fisher Building, Q933431, the wings,
 *    the theatre block and the low west annex) and its tower parts
 *    way/769476105 (90 m), way/780568670 (100 m), way/780568671 (110 m),
 *    way/780568672 (126 m, hipped). Kahn's 1928 first-floor plan
 *    (Commons, public domain) confirms the L of office wings along the
 *    boulevard and the east side, the theatre inside the L, the tower over
 *    the main lobby at the corner, and the garage (way/112057850, a
 *    separate building, not modelled) behind.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, read
 *    in this frame; ground is flat (terrain within 1.5 m over the site).
 *    Heights above the street: wings 46.5 m roof (piers to ~49); tower
 *    tiers, symmetric about x = 18.5: x -8.5..45.5 to 60.5, x -3.5..40.5
 *    to 85, x 1.5..35.5 to 100, the shaft x 5..32 to 110.6; the shaft is
 *    24 m deep (y -43.5..-19.5) with a rear bay to 85 m at y -17.
 *    The hipped roof rises to a short ridge at ~128 m (x 12..26) with the
 *    finial return at 139.4 and the mast
 *    to ~146. Theatre block 31.5 m; the strip behind the boulevard wing
 *    15.5 m; the theatre lobby block 21 m; the east wing's penthouse 59 m;
 *    the west annex 9 m.
 *  - published: 30 storeys (28 in the tower), 134 m (441 ft) roof
 *    (Wikipedia "Fisher Building"; NRHP 80001921); 1928, Albert Kahn,
 *    Art Deco; the roof was gold leaf, re-tiled in green-gold glazed tile.
 *  - photos: the tiers, the window rhythm (narrow tall strips, arched heads
 *    at the top of each stage), the granite base with its arches, the roof
 *    pitch and colour. Colours: marble pale warm grey-tan
 *    (`fisher-marble`), granite base a deeper grey-brown (`fisher-granite`),
 *    roof tile green with gold (`fisher-tile`), pulled to the palette's
 *    lightness.
 *  Estimated: window sizes and pitch, stage heights of the arched windows,
 *  the arcade's arch sizes, from the photos scaled to the lidar.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_December_2021_12_(Fisher_Building).jpg, Michael Barera,
 *    CC BY-SA 4.0 (tower and east wing from the north-east, Second Ave)
 *  - Fisher_Building_as_seen_from_West_Grand_Boulevard_in_front_of_
 *    Cadillac_Place,_..._20201215.jpg, Andre Carrotflower, CC BY-SA 4.0
 *    (from the south-east: tower, both wings, the arcaded base)
 *  - Fisher_Building_as_seen_from_2nd_Avenue_in_front_of_the_Argonaut_
 *    Building,_..._20201215.jpg, Andre Carrotflower, CC BY-SA 4.0 (the
 *    boulevard face from the south, main entrance arch)
 *  - Fisher_Building_in_Detroit's_New_Center_Neighborhood_2025-09-11.jpg,
 *    TheWxResearcher, CC0 (the tower's tiers and roof in clear light)
 *  - KahnFisherBuildingsDetroit.jpg, Andrew Jameson, CC BY-SA 3.0
 *  - FisherBldgDetroit.jpg, Mikerussell, CC BY-SA 3.0
 *  - Fisher_Building_First_Floor_Plan.png, Albert Kahn Inc., public domain
 *  - Fisher_Building_at_night,_..._(62451).jpg, Tichnor Brothers postcard,
 *    public domain (the floodlit crown)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north faces of the wings and the theatre's roof are drawn
 * from lidar and the plan only. The tower's carved pier tops, finials and
 * corner pinnacles are drawn as plain stepped piers; the theatre marquee
 * and the skywalk to New Center One (way/1045971393) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel } from './det-book-tower'

const G = 13 // top of the granite base
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** Walls of a ring from z0 to z1, granite below G and marble above. */
function body(marble: Part, granite: Part, r: XY[], z0: number, z1: number) {
  if (z0 < G) walls(granite, r, z0, Math.min(G, z1))
  if (z1 > G) walls(marble, r, Math.max(G, z0), z1)
}

/** Window strips on wall a→b: columns at `pitch`, `w` wide, grouped storeys between z0 and z1, an arched head on the top group. */
function strips(win: Part, a: XY, b: XY, z0: number, z1: number, o: { pitch?: number; w?: number; group?: number; end?: number; arch?: boolean; s0?: number; s1?: number } = {}) {
  const pitch = o.pitch ?? 3.3, w = o.w ?? 1.5, group = o.group ?? 12, end = o.end ?? 1.6
  const s0 = o.s0 ?? 0, s1 = o.s1 ?? L(a, b)
  const use = s1 - s0 - 2 * end
  if (use < w) return
  const n = Math.max(1, Math.round(use / pitch)), p = use / n
  const ng = Math.max(1, Math.round((z1 - z0) / group)), gh = (z1 - z0) / ng
  for (let k = 0; k < n; k++) {
    const c = s0 + end + p * (k + 0.5)
    for (let g = 0; g < ng; g++) {
      const zb = z0 + g * gh + 0.5, zt = z0 + (g + 1) * gh - 0.5
      if (o.arch && g === ng - 1) archPanel(win, a, b, c - w / 2, c + w / 2, zb, zt - w / 2, 0.05, 4)
      else panel(win, a, b, c - w / 2, c + w / 2, zb, zt, 0.05)
    }
  }
}

/** Stepped piers along the top of every wall of a ring: blocks `w` wide every `pitch`, rising `h` over z. */
function merlons(p: Part, r: XY[], z: number, h: number, pitch = 4.2, w = 1.4, d = 0.9, skip: (m: XY) => boolean = () => false) {
  for (const [a, b] of edges(r)) {
    const l = L(a, b), n = Math.max(1, Math.round(l / pitch)), u: XY = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn: XY = [u[1], -u[0]]
    for (let k = 0; k <= n; k++) {
      const s = Math.min(l - w / 2, Math.max(w / 2, (k * l) / n))
      const at = (ds: number, dn: number): XY => [a[0] + u[0] * (s + ds) + nn[0] * dn, a[1] + u[1] * (s + ds) + nn[1] * dn]
      if (skip(at(0, 0))) continue
      const ring: XY[] = [at(-w / 2, 0.1), at(w / 2, 0.1), at(w / 2, -d), at(-w / 2, -d)]
      const ar = ring.reduce((acc, q, i) => { const t = ring[(i + 1) % 4]; return acc + q[0] * t[1] - t[0] * q[1] }, 0)
      block(p, p, ar > 0 ? ring : [...ring].reverse(), z - 0.5, z + h, 0)
    }
  }
}

function build() {
  const marble = new Part(), granite = new Part(), win = new Part(), roof = new Part(), tile = new Part(), door = new Part()

  // ---- low blocks behind the wings (flat roofs)
  const flat = (r: XY[], h: number) => { body(marble, granite, r, 0, h - 0.4); walls(marble, r, h - 0.4, h, inset(r, 0.4)); cap(roof, inset(r, 0.4), h) }
  flat(rect(-53.5, -26, -9.5, -14), 15.5) // strip behind the boulevard wing
  flat(rect(-53.5, -14, 3, 25), 31.5) // the theatre
  flat(rect(3, -17, 29, 23), 21) // theatre lobby and foyer
  flat(rect(-61, -23, -53.5, 9), 9) // west annex
  // theatre walls: a few tall panels on the exposed west and north faces
  strips(win, [-53.5, 25], [-53.5, -14], 17, 29, { pitch: 7, w: 2.2, group: 12 })

  // ---- the boulevard wing (x -53.5..-8.5) and the east wing (x 29..46)
  const WR = 46.5
  const wingB = rect(-53.5, -41.6, -8.5, -26)
  const wingE = rect(29, -19.5, 46, 72)
  for (const r of [wingB, wingE]) {
    body(marble, granite, r, 0, WR - 0.5)
    walls(marble, r, WR - 0.5, WR, inset(r, 0.4))
    cap(roof, inset(r, 0.4), WR)
  }
  // stepped piers along the parapets (not where the tower stands against them)
  const inTower = (m: XY) => m[0] > -9 && m[0] < 46 && m[1] < -19
  merlons(marble, wingB, WR, 2.6, 5.2, 1.4, 0.9, inTower)
  merlons(marble, wingE, WR, 2.6, 5.2, 1.4, 0.9, inTower)
  // the east wing's penthouse
  block(marble, roof, rect(30.5, 14, 37.5, 37), WR, 59, 0.4)

  // wing windows: strips over the marble storeys, arched heads at the top
  const wingWin = (a: XY, b: XY, o: { s0?: number; s1?: number } = {}) => strips(win, a, b, G + 0.5, WR - 2.2, { pitch: 4.2, w: 2.4, group: 11, arch: true, ...o })
  wingWin([-53.5, -41.6], [-8.5, -41.6]) // boulevard face
  wingWin([-8.5, -26], [-53.5, -26]) // its back, above the low strip
  wingWin([-53.5, -26], [-53.5, -41.6]) // west end
  wingWin([46, -19.5], [46, 72]) // Second Avenue face
  wingWin([46, 72], [29, 72]) // north end
  wingWin([29, 72], [29, 23], {}) // inner face over the garage court
  strips(win, [29, 23], [29, -17], 21.5, WR - 2.2, { pitch: 3.4, w: 1.6, group: 11, arch: true }) // over the lobby block

  // ---- the tower: four tiers symmetric about x = 18.5, then the shaft
  const Y0 = -43.5, Y1 = -19.5, CX = 18.5
  const tiers: [number, number, number][] = [[27, 0, 48.5], [27, 48.5, 60.5], [22, 60.5, 85], [17, 85, 100], [13.5, 100, 110.6]]
  tiers.forEach(([hw, z0, z1], i) => {
    const r = rect(CX - hw, Y0, CX + hw, Y1)
    body(marble, granite, r, z0, z1 - 0.4)
    walls(marble, r, z1 - 0.4, z1, inset(r, 0.3))
    cap(roof, inset(r, 0.3), z1)
    if (i === 0) return
    // stepped piers along the tier's side and front edges
    const next = tiers[i + 1]
    const skip = (m: XY) => (next ? Math.abs(m[0] - CX) < next[0] + 0.5 : false) || m[1] > Y1 - 0.5
    merlons(marble, r, z1, i === tiers.length - 1 ? 3.4 : 2.8, 3.6, 1.3, 0.9, skip)
    // windows on the tier's exposed walls
    const fz0 = i === 1 ? G + 0.5 : z0 + 0.5
    const zTop = z1 - 2.0
    const front: [XY, XY] = [[CX - hw, Y0], [CX + hw, Y0]], back: [XY, XY] = [[CX + hw, Y1], [CX - hw, Y1]]
        // front and back: the strips of this tier outside the next tier
    for (const [a, b] of [front, back]) strips(win, a, b, z0 + 0.5, zTop, { pitch: 3.4, w: 2.0, group: 12, arch: true, end: 1.0 })
    // the sides, from the tier below up
    strips(win, [CX + hw, Y0], [CX + hw, Y1], i === 1 ? WR + 1 : z0 + 0.5, zTop, { pitch: 3.4, w: 2.0, group: 12, arch: true })
    strips(win, [CX - hw, Y1], [CX - hw, Y0], i === 1 ? WR + 1 : z0 + 0.5, zTop, { pitch: 3.4, w: 2.0, group: 12, arch: true })
  })
  // tower front below the first setback: strips over the full 54 m face above the base
  strips(win, [CX - 27, Y0], [CX + 27, Y0], G + 0.5, 46.5, { pitch: 3.4, w: 2.0, group: 11, arch: true, s0: 0, s1: 54 })
  // the rear bay to 85 m
  block(marble, roof, rect(4, Y1 - 0.2, 33, -17), WR, 85, 0.4)
  strips(win, [33, -17], [4, -17], WR + 1, 83, { pitch: 3.4, w: 2.0, group: 12, arch: true })
  // the great arched windows at the top of the shaft's front and back: three tall lights
  for (const [a, b] of [[[CX - 13.5, Y0], [CX + 13.5, Y0]], [[CX + 13.5, Y1], [CX - 13.5, Y1]]] as [XY, XY][])
    for (const s of [9.5, 13.5, 17.5]) archPanel(win, a, b, s - 1.4, s + 1.4, 101, 107.2, 0.08, 8)

  // ---- the roof: a steep hipped roof in green-gold tile inside the parapet
  const RZ = 110.6, RX0 = 6, RX1 = 31, RY0 = -42.2, RY1 = -20.8, APEX = 128
  const ridge = 4
  const sw: V3 = [RX0, RY0, RZ], se: V3 = [RX1, RY0, RZ], ne: V3 = [RX1, RY1, RZ], nw: V3 = [RX0, RY1, RZ]
  const A: V3 = [CX - ridge, (RY0 + RY1) / 2, APEX], B: V3 = [CX + ridge, (RY0 + RY1) / 2, APEX]
  tile.quad(sw, se, B, A); tile.quad(ne, nw, A, B); tile.tri(se, ne, B); tile.tri(nw, sw, A)
  // corner turrets standing at the roof's foot
  for (const [x, y] of [[CX - 13.5, Y0], [CX + 13.5, Y0], [CX + 13.5, Y1], [CX - 13.5, Y1]] as XY[]) {
    const sx = Math.sign(CX - x), sy = Math.sign((Y0 + Y1) / 2 - y)
    const r = rect(Math.min(x, x + sx * 2.4), Math.min(y, y + sy * 2.4), Math.max(x, x + sx * 2.4), Math.max(y, y + sy * 2.4))
    block(marble, marble, r, RZ, 117, 0.3)
    block(tile, tile, inset(r, 0.5), 117, 119, 0.4)
  }
  // finial and mast
  block(tile, tile, rect(CX - 0.9, -32.4, CX + 0.9, -30.6), APEX - 1, 139.4, 0.4)
  block(tile, null, rect(CX - 0.25, -31.75, CX + 0.25, -31.25), 139.4, 146, 0)

  // ---- the granite base: the arcade and the entrances
  // boulevard face of the wing and tower: round-arched windows two storeys tall
  const arcade = (a: XY, b: XY, s0: number, s1: number, pitch = 6.2, w = 3.6) => {
    const n = Math.round((s1 - s0) / pitch), p = (s1 - s0) / n
    for (let k = 0; k < n; k++) { const c = s0 + p * (k + 0.5); archPanel(win, a, b, c - w / 2, c + w / 2, 1.2, 9.4 - w / 2, 0.06, 8) }
  }
  arcade([-53.5, -41.6], [-8.5, -41.6], 0, 45)
  arcade([46, -19.5], [46, 72], 0, 91.5)
  // tower base: the main entrance arch on the boulevard at the centre, arcades either side
  const tf: [XY, XY] = [[CX - 27, Y0], [CX + 27, Y0]]
  arcade(tf[0], tf[1], 0, 20)
  arcade(tf[0], tf[1], 34, 54)
  archPanel(granite, tf[0], tf[1], 27 - 5.2, 27 + 5.2, 0, 11.2, 0.12, 10) // stone surround, standing proud
  archPanel(win, tf[0], tf[1], 27 - 4.2, 27 + 4.2, 4.2, 11.2, 0.2, 10)
  panel(door, tf[0], tf[1], 27 - 3.4, 27 + 3.4, 0, 4.2, 0.22)
  // east side of the tower base and the Second Avenue entrance
  arcade([CX + 27, Y0], [CX + 27, Y1], 0, 24, 6, 3.4)
  panel(door, [46, -19.5], [46, 72], 44, 48, 0, 4, 0.08)
  // granite string course at the top of the base on the street faces
  for (const [a, b] of [[[-53.5, -41.6], [-8.5, -41.6]], [[46, -19.5], [46, 72]], [[CX - 27, Y0], [CX + 27, Y0]], [[CX + 27, Y0], [CX + 27, Y1]]] as [XY, XY][]) panel(granite, a, b, 0, L(a, b), G - 0.6, G, 0.12)

  // Night: the roof is floodlit gold; the tower's upper stages catch the light.
  const roofFlood = (p: V3, n: V3) => (p[2] > 105 ? 1 : 0)
  const towerFlood = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : Math.max(0, Math.min(1, (p[2] - 70) / 40)) * 0.8)
  return [
    { part: marble, material: { ...finish('fisher-marble', 0xe5d8c4), floodlight: towerFlood } },
    { part: granite, material: finish('fisher-granite', 0xb9aa98) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: tile, material: { ...finish('fisher-tile', 0x92b08a), floodlight: roofFlood } },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + " " + x.part.triangles).join(", ")); await save("det-fisher-building", 'Fisher Building', [42.3694784, -83.0773572], 333, b, 6500) }
