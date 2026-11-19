/**
 * The Spirit of Detroit, Coleman A. Young Municipal Center, Woodward Avenue
 * (1958; Marshall Fredericks): procedural, CC0-1.0, no textures.
 * bun generators/det-spirit-of-detroit.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: OSM node/1293799469 (tourism=artwork, Q7765934), which
 * falls between the statue and the wall in the lidar. Placed at bearing 56:
 * the curved marble wall's chord runs along the model's x (146 deg) and the
 * statue faces the model's -y (236 deg, SW, toward Woodward and Spirit
 * Plaza). OSM maps no building here (the Municipal Center's outline,
 * way/69000343, starts 5 m behind the wall): replaces [].
 *
 * Identity, in order: the seated, cross-legged green-bronze giant, arms
 * spread, a gilt sphere with rays held high in his left hand and a small
 * gilt family group on his right palm, his head bowed toward it; the tall
 * curved white marble wall behind him, concave toward him, with the city
 * and county seals; the low marble plinth.
 *
 * Evidence
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m
 *   grid. The wall: 13.4 m over the plaza, chord ~10.8 m from x -4.2 to
 *   6.6, its middle ~1.2 m further back than its ends, ~0.9 m thick. The
 *   bronze: returns up to 5.3 m over the plaza, centred about x 1.8,
 *   y -1.5; the sphere hand's returns at x ~4.
 * - Published: Wikipedia "The Spirit of Detroit": bronze with green patina,
 *   gilt sphere (God) in the left hand and gilt family (man, woman, child)
 *   in the right; marble base and a curved white marble wall 36 x 45 ft
 *   (11 x 13.7 m, matching the lidar); figure height given as 26 ft
 *   (7.9 m) and width 22 ft (6.7 m, "disputed").
 * - Photos (Wikimedia Commons, all evidence), in
 *   SCRATCH/work/det-spirit-of-detroit/photos:
 *   - "The Spirit of Detroit.jpg", JJonahJackalope, CC BY-SA 4.0, face-on
 *     from the front, low: the pose, both hands, the wall's seals
 *     https://commons.wikimedia.org/wiki/File:The_Spirit_of_Detroit.jpg
 *   - "Spirit of Detroit and the Renaissance Center.jpg", Mbrickn,
 *     CC BY-SA 4.0, from the front-left (S): the wall's curve and end
 *     https://commons.wikimedia.org/wiki/File:Spirit_of_Detroit_and_the_Renaissance_Center.jpg
 *   - "The Spirit of Detroit at night, wide angle.jpg", 42-BRT, public
 *     domain, distant front view: overall proportions against the wall,
 *     the floodlit night look
 *     https://commons.wikimedia.org/wiki/File:The_Spirit_of_Detroit_at_night,_wide_angle.jpg
 *   - "Spirit Plaza Drone 4.jpg", City of Detroit, public domain: from
 *     above and behind-right, the wall's plan and thickness
 *     https://commons.wikimedia.org/wiki/File:Spirit_Plaza_Drone_4.jpg
 *
 * Numbers. Measured: the wall (13.4 m, 10.8 m chord, 1.2 m sag, 0.9 m
 * thick) and the statue's position. Estimated by scaling the distant night
 * photo against the 13.4 m wall (and checked against the lidar's 5.3 m
 * bronze returns): plinth 0.8 m, the head's top 5.5 m over the plaza, the
 * sphere's centre 5.9 m (its hand raised above the head, as in every
 * photo) and its rays to ~7.7 m, knees ~5.4 m apart, hands ~7.7 m apart (70% of the wall's width in
 * the distant photo); plinth 5.6 x 3.4 m. These
 * fall short of the published 26 ft; neither the lidar nor any photo
 * supports a 7.9 m figure here, so the measurements win (doubt). The pose
 * is simplified from the photos: limbs as tapered tubes, the cloth as one
 * draped mass over the lap. Left out: the inscription (gilt letters), the
 * stars along the wall's top, the seal reliefs' figures (the seals are
 * raised discs), the band round the sphere (it read as a box at map size).
 *
 * Colours: bronze patina #3f5a52 (overcast) / #4f7a6c (sun) -> #5e8677,
 * kept darker than the palette as it is the landmark's silhouette; gilt
 * #d9b45a; marble #e9e6df. Night: the wall and statue are floodlit (night
 * photo).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, face, add, mul } from './nyc-columbus-monument'

const bronze = new Part(), gilt = new Part(), marble = new Part(), seal = new Part()

function build() {
  // --- The wall: an arc in plan, concave toward the statue (-y), rounded ends. ---
  const WX0 = -4.2, WX1 = 6.6, WC = (WX0 + WX1) / 2, HALF = (WX1 - WX0) / 2, SAG = 1.2, YE = 0.6, T = 0.9, WH = 13.4
  const R = (HALF * HALF + SAG * SAG) / (2 * SAG)          // arc radius through the ends and the sag
  const cy = YE + SAG - R                                  // its centre, far out in front (on the statue's side)
  const a0 = Math.asin(HALF / R), N = 12
  const ring = (r: number, k: number): V3 => {
    const a = -a0 + (2 * a0 * k) / N
    return [WC + r * Math.sin(a), cy + r * Math.cos(a), 0]
  }
  smooth(marble, (q) => {
    // Front (concave) face, back face, top, as strips; split vertically in two so the drape keeps it.
    for (let k = 0; k < N; k++) {
      const f0 = ring(R, k), f1 = ring(R, k + 1), b0 = ring(R + T, k), b1 = ring(R + T, k + 1)
      const up = (p: V3, z: number): V3 => [p[0], p[1], z]
      const m = ring(R + T / 2, k + 0.5)
      for (const [z0, z1] of [[0, WH / 2], [WH / 2, WH]]) {
        face(q, up(f0, z0), up(f1, z0), up(f1, z1), up(f0, z1), up(m, (z0 + z1) / 2))
        face(q, up(b0, z0), up(b1, z0), up(b1, z1), up(b0, z1), up(m, (z0 + z1) / 2))
      }
      face(q, up(f0, WH), up(f1, WH), up(b1, WH), up(b0, WH), up(m, WH - 1))
    }
    // Rounded (bullnosed) ends.
    for (const k of [0, N]) {
      const f = ring(R, k), b = ring(R + T, k), c: V3 = [(f[0] + b[0]) / 2, (f[1] + b[1]) / 2, 0]
      const out = k === 0 ? -1 : 1
      const ax: V3 = [b[0] - f[0], b[1] - f[1], 0], al = Math.hypot(ax[0], ax[1])
      const u: V3 = [ax[0] / al, ax[1] / al, 0], n: V3 = [u[1] * out, -u[0] * out, 0]
      const pts: V3[] = []
      for (let i = 0; i <= 6; i++) {
        const t = Math.PI - (i * Math.PI) / 6
        pts.push(add(c, add(mul(u, (T / 2) * Math.cos(t)), mul(n, (T / 2) * Math.sin(t)))))
      }
      for (let i = 0; i < 6; i++) {
        for (const [z0, z1] of [[0, WH / 2], [WH / 2, WH]])
          face(q, [pts[i][0], pts[i][1], z0], [pts[i + 1][0], pts[i + 1][1], z0], [pts[i + 1][0], pts[i + 1][1], z1], [pts[i][0], pts[i][1], z1], [c[0], c[1], (z0 + z1) / 2])
        face(q, [c[0], c[1], WH], [pts[i][0], pts[i][1], WH], [pts[i + 1][0], pts[i + 1][1], WH], [c[0], c[1], WH], [c[0], c[1], WH - 1])
      }
    }
  }, 40)
  // The two seals: raised discs on the concave face, the city's lower left, the county's upper right
  // (centres and size scaled from the distant night photo).
  for (const [k, z, r] of [[4.05, 8.4, 1.6], [7.95, 9.9, 1.6]] as [number, number, number][]) {
    const a = -a0 + (2 * a0 * k) / N, nx = Math.sin(a), ny = Math.cos(a)
    const c: V3 = [WC + (R - 0.02) * nx, cy + (R - 0.02) * ny, z]
    const u: V3 = [ny, -nx, 0]                             // along the wall
    const toward: V3 = [-nx, -ny, 0]                        // out of the face, toward the statue
    const pts = Array.from({ length: 16 }, (_, i): V3 => add(c, add(mul(u, r * Math.cos((i * TAU) / 16)), [0, 0, r * Math.sin((i * TAU) / 16)])))
    const front = pts.map((p) => add(p, mul(toward, 0.14)))
    const fc = add(c, mul(toward, 0.14))
    for (let i = 0; i < 16; i++) {
      const j = (i + 1) % 16
      face(seal, pts[i], pts[j], front[j], front[i], c)
      const n = [front[i], front[j], fc]
      const g = [n[1][0] - n[0][0], n[1][1] - n[0][1], n[1][2] - n[0][2]], h = [n[2][0] - n[0][0], n[2][1] - n[0][1], n[2][2] - n[0][2]]
      const cr = [g[1] * h[2] - g[2] * h[1], g[2] * h[0] - g[0] * h[2], g[0] * h[1] - g[1] * h[0]]
      if (cr[0] * toward[0] + cr[1] * toward[1] >= 0) seal.tri(front[i], front[j], fc); else seal.tri(front[j], front[i], fc)
    }
  }

  // --- The plinth: a low marble block, its long faces split for the drape. ---
  const SX = 1.8, SY = -1.7, PZ = 0.8
  {
    const x0 = SX - 2.8, x1 = SX + 2.8, y0 = SY - 1.9, y1 = SY + 1.5, c: V3 = [SX, SY, PZ / 2]
    const xs = [x0, x0 + 1.9, x0 + 3.7, x1]
    for (let i = 0; i < 3; i++) {
      face(marble, [xs[i], y0, 0], [xs[i + 1], y0, 0], [xs[i + 1], y0, PZ], [xs[i], y0, PZ], c)
      face(marble, [xs[i], y1, 0], [xs[i + 1], y1, 0], [xs[i + 1], y1, PZ], [xs[i], y1, PZ], c)
      face(marble, [xs[i], y0, PZ], [xs[i + 1], y0, PZ], [xs[i + 1], y1, PZ], [xs[i], y1, PZ], [SX, SY, 0])
    }
    for (const x of [x0, x1]) face(marble, [x, y0, 0], [x, y1, 0], [x, y1, PZ], [x, y0, PZ], c)
  }

  // --- The figure, seated cross-legged facing -y. His right is -x. ---
  const B = (x: number, y: number, z: number): V3 => [SX + x, SY + y, PZ + z]
  smooth(bronze, (q) => {
    // Thighs out to the knees, shins crossing in front, feet tucked.
    tube(q, [B(-0.45, 0.35, 0.55), B(-1.4, -0.15, 0.55), B(-2.3, -0.55, 0.5)], [0.6, 0.55, 0.45], 8)
    tube(q, [B(0.45, 0.35, 0.55), B(1.4, -0.15, 0.55), B(2.3, -0.55, 0.5)], [0.6, 0.55, 0.45], 8)
    ellipsoid(q, B(-2.3, -0.6, 0.5), [0.5, 0.5, 0.46], 8, 4)
    ellipsoid(q, B(2.3, -0.6, 0.5), [0.5, 0.5, 0.46], 8, 4)
    tube(q, [B(-2.2, -0.85, 0.35), B(-0.9, -1.35, 0.3), B(0.6, -1.25, 0.3)], [0.38, 0.32, 0.26], 7)
    tube(q, [B(2.2, -0.85, 0.42), B(0.9, -1.15, 0.55), B(-0.5, -1.0, 0.45)], [0.38, 0.32, 0.26], 7)
    ellipsoid(q, B(0.85, -1.2, 0.22), [0.42, 0.22, 0.2], 6, 3, -0.3)
    ellipsoid(q, B(-0.75, -0.95, 0.5), [0.42, 0.22, 0.2], 6, 3, 0.3)
    // The cloth: one draped mass over the lap, from the hips down between the knees.
    solid(q, [
      [[-0.9, 0.6, 0.0], [0.9, 0.6, 0.0], [1.0, -0.6, 0.0], [0, -1.15, 0.0], [-1.0, -0.6, 0.0]],
      [[-0.95, 0.6, 1.0], [0.95, 0.6, 1.0], [1.0, -0.4, 0.95], [0, -0.95, 0.75], [-1.0, -0.4, 0.95]],
      [[-0.8, 0.45, 1.4], [0.8, 0.45, 1.4], [0.85, -0.15, 1.4], [0, -0.4, 1.35], [-0.85, -0.15, 1.4]],
    ].map((r) => r.map(([x, y, z]) => B(x, y, z))))
    // Torso, leaning a little forward, broad shoulders.
    const torso = (z: number, rx: number, ry: number, dy: number) => Array.from({ length: 12 }, (_, i): V3 => B(rx * Math.cos((i * TAU) / 12), dy + ry * Math.sin((i * TAU) / 12), z))
    solid(q, [torso(1.25, 0.85, 0.55, 0.25), torso(2.0, 0.8, 0.55, 0.1), torso(2.7, 1.02, 0.62, -0.08), torso(3.15, 1.12, 0.58, -0.18), torso(3.45, 0.6, 0.42, -0.22)])
    // Neck and the head, bowed and turned to his right, toward the family.
    tube(q, [B(0, -0.2, 3.35), B(-0.1, -0.4, 3.85)], [0.32, 0.29], 7)
    ellipsoid(q, B(-0.2, -0.55, 4.15), [0.42, 0.46, 0.52], 10, 5, -0.5, 0.35)
    ellipsoid(q, B(-0.12, -0.42, 4.42), [0.4, 0.44, 0.26], 8, 3)     // the swept hair
    // Right arm out to the side and forward, palm up (the family).
    tube(q, [B(-1.0, -0.1, 3.15), B(-2.05, -0.5, 2.6), B(-3.1, -0.95, 2.5), B(-3.65, -1.05, 2.55)], [0.38, 0.3, 0.22, 0.18], 7)
    ellipsoid(q, B(-3.85, -1.05, 2.6), [0.32, 0.22, 0.09], 6, 3)
    // Left arm: upper arm out and down, forearm raised high (the sphere).
    tube(q, [B(1.0, -0.1, 3.2), B(2.15, -0.4, 2.85), B(3.05, -0.65, 3.85), B(3.35, -0.72, 4.5)], [0.38, 0.3, 0.22, 0.18], 7)
    ellipsoid(q, B(3.45, -0.75, 4.62), [0.3, 0.24, 0.1], 6, 3)
  }, 80)

  // --- Gilt: the sphere and its rays, and the family group. ---
  const S = B(3.5, -0.78, 5.08)
  smooth(gilt, (q) => ellipsoid(q, S, [0.45, 0.45, 0.45], 12, 6), 70)
  for (let i = 0; i < 14; i++) {
    // Rays fan out in the plane facing front, longer to the sides, in two lengths.
    const a = (i * TAU) / 14 + 0.12, L = i % 2 ? 1.25 : 1.85
    const d: V3 = [Math.cos(a), -0.15 * Math.sin(a), Math.sin(a)]
    const p0 = add(S, mul(d, 0.45)), p1 = add(S, mul(d, L))
    if (p1[2] < PZ + 2.6) continue
    tube(gilt, [p0, p1], [0.07, 0.04], 3)
  }
  smooth(gilt, (q) => {
    const F = (x: number, y: number, z: number): V3 => B(-3.85 + x, -1.05 + y, 2.65 + z)
    // Man, woman, child: three slim figures, the parents' arms raised.
    for (const [x, h, r] of [[-0.14, 0.95, 0.11], [0.12, 0.88, 0.1], [0.32, 0.5, 0.08]] as [number, number, number][]) {
      solid(q, [0, 0.55, 0.85].map((t) => Array.from({ length: 6 }, (_, i): V3 => F(x + r * (1 - t * 0.3) * Math.cos((i * TAU) / 6), r * 0.8 * Math.sin((i * TAU) / 6), t * h))))
      ellipsoid(q, F(x, 0, h + 0.07), [0.07, 0.07, 0.08], 5, 3)
    }
    tube(q, [F(-0.14, 0, 0.8), F(-0.2, 0, 1.25)], [0.04, 0.03], 3)
    tube(q, [F(0.12, 0, 0.75), F(0.2, 0, 1.18)], [0.04, 0.03], 3)
  }, 60)

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.9)
  finishModel('The Spirit of Detroit', 'det-spirit-of-detroit', [
    { part: bronze, material: { name: 'bronze-patina', color: 0x5e8677, roughness: 0.5, floodlight: flood } },
    { part: gilt, material: { name: 'gilt', color: 0xd9b45a, roughness: 0.4 } },
    { part: marble, material: { name: 'marble', color: 0xe9e6df, roughness: 0.85, floodlight: flood } },
    { part: seal, material: { name: 'marble-seals', color: 0xf3efe6, roughness: 0.85, floodlight: flood } },
  ], { bearing: 56, osm: 'node/1293799469', height: 13.4 }, 5000)
}

if (import.meta.main) build()
