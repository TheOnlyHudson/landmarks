/**
 * GE Chandelier, Playhouse Square, Cleveland (2014; the largest permanent
 * outdoor chandelier in North America): procedural, CC0-1.0.
 * bun generators/cle-playhouse-square-chandelier.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the hub over
 * the Euclid Avenue / East 14th Street intersection where the arches meet
 * and the chandelier hangs, at street level.
 *
 * Identity, in order: the tiered crystal chandelier itself (a gold crown, a
 * wide crystal bell to a broad gold ring, then two smaller crystal tiers and
 * rings and a short pendant), hung high over the street; the three bronze
 * arches that rise from three tall bronze posts on the corners and meet over
 * it; the posts' paired bars, their scrollwork brackets and dark stone
 * plinths. It hangs over a street, so it replaces nothing.
 *
 * Evidence:
 *  - OSM node/8450388474 ("Playhouse Square Chandelier"), the street ways
 *    (Euclid Avenue, East 14th Street). No building.
 *  - lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019), 0.5 m grid
 *    centred on the OSM node. It shows three arms, not two: north to a post
 *    on Euclid's north side, south-west and south-east to posts on the two
 *    south corners. Measured above the street: the hub 13.7, the arms falling
 *    in a curve to the post tops at 10.0-10.2 (12.9 at the north arm's
 *    middle); the chandelier's broad ring ~5 m across at ~9.8. Post
 *    positions (from the hub): N (-1.3, 12.5), SW (-13.3, -13.9),
 *    SE (18.1, -10.5). The hub is 0.5 m east and 0.3 m south of the OSM node.
 *  - USGS NAIP (public domain): the Y of three bronze arms and the
 *    chandelier's shadow.
 *  - published (Playhouse Square, press at the 2014 unveiling): 20 ft (6.1 m)
 *    tall, 4,200 crystals, its foot 24 ft (7.3 m) above the street.
 *  - photos: the chandelier's tiers and rings (traced from Erik Drost's
 *    25889709683, scaled to the published 6.1 m), the posts, plinths,
 *    brackets and the arches' bronze.
 *  Estimated: post section 1.6 m, plinth 2.5 m tall, the arch band (0.85 x 0.4 m),
 *  the brackets.
 *
 * Photos (Wikimedia Commons, all EVIDENCE, Erik Drost, CC BY 2.0):
 *  - Playhouse_Square_Chandelier_(25889709683).jpg (from the east along
 *    Euclid: chandelier, two south posts and the north post)
 *  - Playhouse_Square_Chandelier_(32155831485).jpg (from the west along
 *    Euclid)
 *  - Playhouse_Square_Chandelier_(27682171933).jpg, (27682174713).jpg
 *    (from the west, farther)
 *  - Playhouse_Square_Chandelier_(27682226733).jpg (from high up to the west)
 *  - Cleveland_Playhouse_Square_Chandelier_(14101109562).jpg (night)
 * No look-only sources. No commercial imagery.
 *
 * Night: the crystal tiers are `neon-chandelier` (they glow in their own
 * warm champagne colour, as the LED-lit crystals do); the bronze near the
 * chandelier carries `_FLOODLIGHT`, lit by it. The posts stay dark.
 * Doubts: the scrollwork is a flat bracket plate; the crystal tiers are
 * smooth solids; the posts' bar layout is simplified.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, rect, save, walls, circle, type XY } from './chi-aon-center'

const SEG = 20

/** A faceted surface of revolution about the z axis, (r, z) top to bottom or bottom to top. */
function lathe(p: Part, prof: XY[], seg = SEG, cx = 0, cy = 0) {
  // order bottom → top so the outside faces out
  const pr = prof[0][1] > prof[prof.length - 1][1] ? [...prof].reverse() : prof
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: XY, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    for (let i = 0; i < pr.length - 1; i++) {
      const A = P(pr[i], a), B = P(pr[i], b), C = P(pr[i + 1], b), D = P(pr[i + 1], a)
      if (pr[i][0] > 1e-6) p.tri(A, B, C)
      if (pr[i + 1][0] > 1e-6) p.tri(A, C, D)
    }
  }
}
/** A short drum with both caps. */
function ring(p: Part, r: number, z0: number, z1: number, seg = SEG) {
  const c = circle(0, 0, r, seg)
  walls(p, c, z0, z1); cap(p, c, z1); cap(p, c, z0, false)
}
/** A box. */
function box(p: Part, r: XY[], z0: number, z1: number) {
  walls(p, r, z0, z1); cap(p, r, z1); cap(p, r, z0, false)
}

function build() {
  const crystal = new Part(), bronze = new Part(), stone = new Part()

  // ------------------------------------------------ the chandelier (foot 7.3 m, top 13.4 m)
  // crown
  ring(bronze, 0.55, 12.9, 13.4)
  ring(bronze, 0.2, 13.4, 13.75, 8)
  // the crystal bell down to the broad ring
  lathe(crystal, [[0.5, 12.9], [0.85, 12.6], [1.25, 12.1], [1.6, 11.6], [1.95, 11.1], [2.3, 10.7]])
  cap(crystal, circle(0, 0, 2.3, SEG), 10.7, false)
  ring(bronze, 2.45, 10.1, 10.7)
  // second tier
  lathe(crystal, [[2.3, 10.1], [2.15, 9.8], [1.85, 9.5], [1.5, 9.3]])
  ring(bronze, 1.55, 8.8, 9.3)
  // third tier
  lathe(crystal, [[1.35, 8.8], [1.15, 8.6], [0.75, 8.37]])
  ring(bronze, 0.6, 8.0, 8.37)
  // the pendant
  lathe(crystal, [[0.45, 8.0], [0.42, 7.75], [0.3, 7.5], [0.0, 7.3]], 12)

  // ------------------------------------------------ the three posts and their arches
  const HUB = 13.85, TOP = 10.1
  const posts: XY[] = [[-1.3, 12.5], [-13.3, -13.9], [18.1, -10.5]]
  for (const [px, py] of posts) {
    const L = Math.hypot(px, py), u: XY = [-px / L, -py / L] // towards the hub
    const v: XY = [-u[1], u[0]] // across the arch
    const at = (s: number, w: number): XY => [px + u[0] * s + v[0] * w, py + u[1] * s + v[1] * w]
    // plinth: dark stone, 1.5 m square, 2.5 m tall
    const H = 0.75
    box(stone, [at(-H, -H), at(H, -H), at(H, H), at(-H, H)], 0, 2.5)
    // the post: four corner bars on a 1.3 m square, tied at three levels
    const B = 0.62, b = 0.2
    for (const [s, w] of [[-B, -B], [B, -B], [B, B], [-B, B]] as XY[]) {
      box(bronze, [at(s - b, w - b), at(s + b, w - b), at(s + b, w + b), at(s - b, w + b)], 2.5, TOP)
    }
    for (const z of [4.8, 7.6]) box(bronze, [at(-B - b, -B - b), at(B + b, -B - b), at(B + b, B + b), at(-B - b, B + b)], z, z + 0.3)
    // a centre bar
    box(bronze, [at(-0.1, -0.1), at(0.1, -0.1), at(0.1, 0.1), at(-0.1, 0.1)], 2.5, TOP)
    // the scrollwork bracket: a flat quarter-plate in the arch's plane, under its spring
    {
      const pts: XY[] = [] // (s, z)
      for (let k = 0; k <= 6; k++) { const a = (k / 6) * Math.PI / 2; pts.push([B + b + 2.4 * (1 - Math.cos(a)), TOP - 3.2 * (1 - Math.sin(a))]) }
      const t = 0.05
      for (const sg of [-1, 1]) {
        const P = ([s, z]: XY): V3 => { const q = at(s, sg * t); return [q[0], q[1], z] }
        const c0: V3 = P([B + b, TOP])
        for (let k = 0; k < pts.length - 1; k++) {
          if (sg > 0) bronze.tri(c0, P(pts[k]), P(pts[k + 1])); else bronze.tri(c0, P(pts[k + 1]), P(pts[k]))
        }
      }
    }
    // the arch: a flat band 0.7 deep, 0.35 wide, from a short stub beyond the post,
    // rising in a curve to the hub
    const N = 14, D = 0.85, W = 0.2
    const sec = (s: number, z: number): V3[] => {
      const a = at(s, -W), c = at(s, W)
      return [[a[0], a[1], z], [c[0], c[1], z], [c[0], c[1], z + D], [a[0], a[1], z + D]]
    }
    const span = L - 0.5
    const rings: V3[][] = [sec(-1.2, TOP - 0.1)]
    for (let k = 0; k <= N; k++) {
      const t = k / N
      rings.push(sec(t * span, TOP - 0.1 + (HUB - 0.35 - TOP + 0.1) * Math.sin(t * Math.PI / 2)))
    }
    for (let k = 0; k < rings.length - 1; k++) {
      const r0 = rings[k], r1 = rings[k + 1]
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        bronze.quad(r0[i], r0[j], r1[j], r1[i])
      }
    }
    // end cap at the stub
    const e = rings[0]
    bronze.quad(e[3], e[2], e[1], e[0])
  }
  // the hub where the arches meet
  ring(bronze, 0.8, HUB - 0.45, HUB + 0.45, 12)

  // the chandelier's light falls on the bronze rings and the hub
  const lit = (p: V3) => {
    const r = Math.hypot(p[0], p[1])
    return p[2] > 7 && r < 3.2 ? 1 - Math.max(0, r - 1.5) / 2.5 : 0
  }
  return [
    { part: crystal, material: finish('neon-chandelier', 0xf0e4cc, 0.3) },
    { part: bronze, material: { ...finish('chandelier-bronze', 0xc68b47, 0.5), floodlight: lit } },
    { part: stone, material: finish('chandelier-plinth', 0x5e5148) },
  ]
}

if (import.meta.main) await save('cle-playhouse-square-chandelier', 'GE Chandelier, Playhouse Square', [41.5009036, -81.681821], 0, build(), 5000)
