/**
 * Transcending (the Michigan Labor Legacy Landmark), Hart Plaza, Detroit
 * (dedicated 2003; David Barr and Sergio De Giusti): procedural, CC0-1.0,
 * no textures.
 * bun generators/det-transcending.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: OSM node/4634212769 (historic=monument, tourism=artwork),
 * on the ring's centre in the lidar. Placed at bearing 333, so the ring's
 * plane runs along the model's x (+x = 63 deg, ENE), measured from the
 * lidar's line of top returns. OSM maps no building here: replaces [].
 *
 * Identity, in order: the huge stainless steel ring standing on edge, wider
 * than it is tall because its bottom is sunk below the plaza, broken by a
 * narrow gap at the top into two arcs; the left (WSW) arc a plain band that
 * broadens toward its foot, the right (ENE) arc with its inner edge cut in
 * steps; the low round granite platform; the ring of rough dark boulders.
 *
 * Evidence
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m
 *   grid, read along the ring's plane. The platform 0.45 m over the ground
 *   round it (radius ~11 m); the ring's top returns 18.3 m over the
 *   platform at the centre, 17.3 at +-4.5 m, 15.7 at +-7 m along the
 *   plane, which a circle of outer radius 10.7 m centred 7.6 m over the
 *   platform fits; returns at 4-7 m high near +-9.5-10 m; boulders 1.5-2 m
 *   tall scattered round the ring.
 * - Published: the brief gives 63 ft (19.2-19.8 m) for the arc; the lidar's
 *   18.75 m over the street (18.3 over the platform) is built.
 * - Photos (all evidence), in SCRATCH/work/det-transcending/photos:
 *   - "Transcending, Hart Plaza, Detroit, Michigan", Ken Lund, CC BY-SA 2.0
 *     (Flickr via Openverse), two views: the whole ring face-on from
 *     Jefferson, the stepped right arc, the platform, the boulders
 *     https://www.flickr.com/photos/75683070@N00/14017265690
 *     https://www.flickr.com/photos/75683070@N00/21515063708
 *   - "The Michigan Labor Legacy Landmark.jpg", Mikerussell, CC BY-SA 3.0,
 *     close under the ring: the gap, the arcs' widths, the steps
 *     https://commons.wikimedia.org/wiki/File:The_Michigan_Labor_Legacy_Landmark.jpg
 *   - "Michigan Labor Legacy Landmark.jpg", Flavinista, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Michigan_Labor_Legacy_Landmark.jpg
 *   - "Transcending Sculpture", cletch, CC BY 2.0 (Flickr via Openverse)
 *     https://www.flickr.com/photos/26542961@N07/3434748947
 *
 * Numbers. Measured: the circle (outer radius 10.7, centre 7.6 m up, so the
 * feet stand 6.6 m either side of the centre and the ring is widest, 21.4
 * m, at mid-height), the platform, the bearing. Estimated from the photos:
 * the band's radial width (1.7 m at the left arc's foot narrowing to 1.1 at
 * the top; 1.3 m for the right arc, its inner edge in 14 steps), its depth
 * through the plane (1.2 m at the feet to 0.9 m at the top), the gap (drawn
 * 0.8 m, about twice the real one, so it shows at map size), the boulders'
 * sizes; their positions are spread round the ring in the lidar's pattern,
 * not one by one. Which arc carries the steps (ENE) follows the sunlit Ken
 * Lund view; a doubt.
 *
 * Colours: brushed stainless #c4c6c4 -> #d3d5d4; the platform's granite
 * #c8c2b8 -> #ddd8cf; the boulders #4e4c4a -> #77736e. Night: nothing
 * marked lit (no night photo found).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, face } from './nyc-columbus-monument'

const steel = new Part(), granite = new Part(), rock = new Part()

const ZP = 0.45, ZC = ZP + 7.6, RO = 10.7

/**
 * One arc of the ring, in the x-z plane, from angle a0 to a1 (radians, 0 = +x, pi/2 = up),
 * with radial width and depth given as functions of the angle; `inner` may step.
 */
function arc(a0: number, a1: number, n: number, width: (a: number) => number, depth: (a: number) => number, stepInner?: number) {
  const secs: V3[][] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    let w = width(a)
    if (stepInner) {
      // 14 straight blocks, each a little deeper at its top end: the stepped inner edge.
      const k = ((i % (n / stepInner)) / (n / stepInner))
      w += 0.35 * k
    }
    const d = depth(a) / 2, ro = RO, ri = RO - w
    const c = Math.cos(a), s = Math.sin(a)
    // Below the platform's top the band is cut flat (clamped), so each foot sits on a level base.
    const zo = Math.max(ZP - 0.05, ZC + ro * s), zi = Math.max(ZP - 0.05, ZC + ri * s)
    secs.push([[ro * c, -d, zo], [ro * c, d, zo], [ri * c, d, zi], [ri * c, -d, zi]])
  }
  // The ring's surfaces: outer, inner, both faces; capped ends. Flat faces, smooth along the arc.
  smooth(steel, (q) => {
    for (let i = 0; i < n; i++) {
      const A = secs[i], B = secs[i + 1]
      const m = (k: number): V3 => [(A[k][0] + B[k][0]) / 2, (A[k][1] + B[k][1]) / 2, (A[k][2] + B[k][2]) / 2]
      const ctr: V3 = [(m(0)[0] + m(2)[0]) / 2, 0, (m(0)[2] + m(2)[2]) / 2]
      face(q, A[0], B[0], B[1], A[1], ctr) // outer
      face(q, A[3], B[3], B[2], A[2], ctr) // inner
      face(q, A[1], B[1], B[2], A[2], ctr) // +y face
      face(q, A[0], B[0], B[3], A[3], ctr) // -y face
    }
    for (const [S, other] of [[secs[0], secs[1]], [secs[n], secs[n - 1]]]) {
      const inward: V3 = [(other[0][0] + other[2][0]) / 2, 0, (other[0][2] + other[2][2]) / 2]
      face(q, S[0], S[1], S[2], S[3], inward)
    }
  }, 35)
}

function build() {
  // --- The platform: a low granite disc, r 11.3, in pie pieces for the drape. ---
  {
    const N = 24, R = 11.3
    const P = (i: number, r: number, z: number): V3 => [r * Math.cos((i * TAU) / N), r * Math.sin((i * TAU) / N), z]
    for (let i = 0; i < N; i++) {
      face(granite, P(i, R, 0), P(i + 1, R, 0), P(i + 1, R, ZP), P(i, R, ZP), [0, 0, ZP / 2])
      // Top in two rings so no face runs longer than ~5 m.
      face(granite, P(i, R, ZP), P(i + 1, R, ZP), P(i + 1, R / 2, ZP), P(i, R / 2, ZP), [0, 0, 0])
      granite.tri([0, 0, ZP], P(i, R / 2, ZP), P(i + 1, R / 2, ZP))
    }
  }

  // --- The ring: the centreline meets the platform where sin(a) = -7.6 / 10.05. ---
  // Each arc runs down until its inner edge reaches the platform; the clamp flattens the rest.
  const footL = Math.asin((ZP - 0.05 - ZC) / (RO - 1.7)), footR = Math.asin((ZP - 0.05 - ZC) / (RO - 1.5))
  const foot = Math.asin(-7.6 / (RO - 0.65))           // the centreline's foot, ~ -49 deg (for the tapers)
  const gapHalf = 0.4 / RO                              // a 0.8 m gap at the top...
  const gapAt = Math.PI / 2 - 0.05                      // ...a little to the right (ENE) of the top
  // Left (WSW) arc: from the top gap round to the left foot, broadening toward it.
  arc(gapAt + gapHalf, Math.PI - footL, 40,
    (a) => 1.1 + 0.6 * Math.max(0, (a - Math.PI / 2) / (Math.PI / 2 - foot)),
    (a) => 0.9 + 0.3 * Math.max(0, (a - Math.PI / 2) / (Math.PI / 2 - foot)))
  // Right (ENE) arc: from the right foot up to the gap, its inner edge in 14 steps.
  arc(footR, gapAt - gapHalf, 42, () => 1.15, (a) => 0.9 + 0.3 * Math.max(0, (Math.PI / 2 - a) / (Math.PI / 2 - foot)), 14)

  // --- The boulders: rough dark granite stones round the ring, both sides of it. ---
  const stones: [number, number, number, number][] = [
    [-5.0, -4.6, 1.8, 0.0], [-1.5, -6.2, 2.0, 0.7], [2.6, -6.4, 1.7, 1.4], [6.2, -4.2, 1.9, 2.1],
    [-5.6, 4.2, 1.9, 2.8], [-1.8, 6.4, 1.6, 3.5], [2.2, 6.0, 2.0, 4.2], [6.0, 4.4, 1.7, 4.9],
  ]
  for (const [x, y, h, seed] of stones) {
    smooth(rock, (q) => {
      const n = 7
      const ring = (r: number, z: number, j: number) => Array.from({ length: n }, (_, i): V3 => {
        const a = (i * TAU) / n + seed, rr = r * (0.8 + 0.35 * Math.abs(Math.sin(i * 2.3 + seed + j)))
        return [x + rr * Math.cos(a) * 1.2, y + rr * Math.sin(a) * 0.8, z]
      })
      const rings = [ring(0.55, ZP - 0.05, 0), ring(0.6, ZP + h * 0.45, 1), ring(0.35, ZP + h, 2)]
      q.loft(rings)
      q.cap(rings[2], true)
    }, 30)
  }

  finishModel('Transcending', 'det-transcending', [
    { part: steel, material: { name: 'stainless-steel', color: 0xd3d5d4, roughness: 0.35 } },
    { part: granite, material: { name: 'granite', color: 0xddd8cf, roughness: 0.85 } },
    { part: rock, material: { name: 'dark-granite', color: 0x77736e, roughness: 0.9 } },
  ], { bearing: 333, osm: 'node/4634212769', height: ZC + RO }, 5000)
}

if (import.meta.main) build()
