/**
 * Tyler Davidson Fountain ("The Genius of Water"; August von Kreling,
 * cast by Ferdinand von Miller in Munich, dedicated 1871), Fountain
 * Square, Cincinnati — original procedural geometry, CC0-1.0.
 * bun generators/cin-tyler-davidson-fountain.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the fountain's
 * centre (-84.51246, 39.10162) on the plaza. Bearing 0. The Genius faces
 * west (toward Vine Street), her arms spread north and south.
 *
 * Form, from the ground up: a low granite step and the pool's granite rim
 * (the water is the map's); four granite pedestals with seated bronze
 * figures at the rim's diagonals; in the pool a round granite basin; the
 * wide bronze lower bowl; the central pier with four standing figures
 * round it; the scalloped upper bowl; a pedestal; and the 9 ft Genius of
 * Water with her arms spread, water falling from her hands (not drawn).
 *
 * Sources
 * - OSM: pool outline way/109078597 (amenity=fountain, natural=water;
 *   radius 5.4-6.0 m); the granite basin way/270847449 (building, granite,
 *   5 m, radius 3.3 m) and the central pier way/271753029 (building:part,
 *   granite, 10 m, about 1.7 m across). Both are replaced; the pool is
 *   water, not a building, and is left to the map.
 * - Published: overall about 43 ft (13.1 m); the Genius 9 ft (2.7 m)
 *   (Wikipedia, "Tyler Davidson Fountain"; the 1871 E. & H.T. Anthony
 *   stereograph caption "Genius of Water, 9 feet high").
 * - Photos (Wikimedia Commons):
 *   Warren LeMay, "Tyler Davidson Fountain, Fountain Square, Cincinnati, OH
 *   (28224119028)" (CC0; from the west, the whole fountain and pool)
 *   https://commons.wikimedia.org/wiki/File:Tyler_Davidson_Fountain,_Fountain_Square,_Cincinnati,_OH_(28224119028).jpg
 *   Hhelvey, "Cincinnati Tyler Davidson Fountain Genius of Water.jpg" (CC
 *   BY-SA 4.0; close, from below: the bowls, the pier figures)
 *   https://commons.wikimedia.org/wiki/File:Cincinnati_Tyler_Davidson_Fountain_Genius_of_Water.jpg
 *   Niagara66, "Tyler Davidson Fountain 1.jpg" (CC BY-SA 4.0; from the
 *   south-west: the pool, the corner pedestals, the step)
 *   https://commons.wikimedia.org/wiki/File:Tyler_Davidson_Fountain_1.jpg
 * Estimated from the photos, scaled by the published heights and OSM
 *   radii: the step (7.6 m, 0.3 m), the rim (6.3 m, 0.75 m), the bowls'
 *   radii and heights (lower 3.7 m at 3.0 m; upper 2.0 m at 7.6 m), the
 *   pedestal, the figures' proportions. The figures are drawn as bold
 *   robed forms, not sculpted: the pose (arms spread, standing figures
 *   round the pier) is kept, the detail is not.
 * Night: the fountain is floodlit from the pool; the bronze carries
 *   _FLOODLIGHT, strongest low and on faces turned outward.
 */
import { Part, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { finishGlb, emit } from './sea-two-union-square'
import { tube } from './cin-great-american-tower'

/** A surface of revolution about (cx, cy): profile [r, z] pairs, `n` sides. */
function lathe(part: Part, prof: [number, number][], n: number, cx = 0, cy = 0, a0 = 0) {
  const P = (r: number, z: number, k: number): V3 => {
    const a = a0 + (2 * Math.PI * k) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  }
  for (let i = 0; i < prof.length - 1; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    for (let k = 0; k < n; k++) {
      const A = P(r0, z0, k), B = P(r0, z0, k + 1), C = P(r1, z1, k + 1), D = P(r1, z1, k)
      if (r0 < 1e-3) part.tri(A, C, D)
      else if (r1 < 1e-3) part.tri(A, B, C)
      else part.quad(A, B, C, D)
    }
  }
}

/** A robed standing figure: body and head, `h` tall, base at z. */
function figure(part: Part, x: number, y: number, z: number, h: number, n: number) {
  const s = h / 2.7
  lathe(part, [[0, z], [0.46 * s, z], [0.5 * s, z + 0.4 * s], [0.4 * s, z + 1.4 * s], [0.34 * s, z + 1.95 * s], [0.2 * s, z + 2.12 * s], [0, z + 2.16 * s]], n, x, y)
  lathe(part, [[0, z + 2.1 * s], [0.17 * s, z + 2.2 * s], [0.21 * s, z + 2.38 * s], [0.17 * s, z + 2.56 * s], [0, z + 2.7 * s]], n, x, y)
}

function build() {
  const granite = new Part(), bronze = new Part()

  // ---- granite: the step, the pool rim, the corner pedestals, the inner basin
  lathe(granite, [[7.6, 0], [7.6, 0.3], [6.3, 0.3]], 24)
  lathe(granite, [[6.3, 0.3], [6.3, 0.75], [5.8, 0.75], [5.8, 0]], 24)
  for (const a of [45, 135, 225, 315]) {
    const t = (a * Math.PI) / 180, x = 6.95 * Math.cos(t), y = 6.95 * Math.sin(t)
    lathe(granite, [[0.85, 0], [0.85, 1.4], [0.7, 1.55], [0, 1.55]], 4, x, y, Math.PI / 4)
    // a seated bronze figure on each
    lathe(bronze, [[0, 1.55], [0.55, 1.55], [0.55, 2.0], [0.36, 2.55], [0, 2.62]], 10, x, y)
    lathe(bronze, [[0, 2.55], [0.2, 2.67], [0.21, 2.85], [0, 3.02]], 10, x, y)
  }
  lathe(granite, [[3.3, 0], [3.3, 0.95], [3.05, 1.05], [2.9, 1.05], [2.9, 0.5], [1.2, 0.5]], 20)

  // ---- bronze: lower bowl, pier, upper bowl, pedestal
  lathe(bronze, [[1.2, 0.5], [1.1, 1.6], [1.7, 2.0], [3.0, 2.5], [3.7, 2.85], [3.7, 3.05], [3.4, 3.05], [1.0, 2.6]], 20)
  lathe(bronze, [[0.9, 2.6], [0.9, 6.2], [0.65, 6.6], [0.5, 6.85]], 8, 0, 0, Math.PI / 8)
  lathe(bronze, [[0.5, 6.85], [1.2, 7.05], [2.0, 7.45], [2.05, 7.7], [1.8, 7.7], [0.6, 7.45]], 16)
  lathe(bronze, [[0.6, 7.45], [0.6, 8.6], [0.8, 8.9], [0.8, 9.3], [0.62, 9.55], [0, 9.6]], 10)
  // the four standing figures round the pier, on a plinth over the bowl's floor
  lathe(bronze, [[1.95, 2.75], [1.95, 3.0], [0.9, 3.0]], 16)
  for (const a of [45, 135, 225, 315]) {
    const t = (a * Math.PI) / 180
    figure(bronze, 1.35 * Math.cos(t), 1.35 * Math.sin(t), 3.0, 2.9, 10)
  }

  // ---- the Genius of Water, facing west, arms spread north and south
  figure(bronze, 0, 0, 9.6, 2.74, 12)
  for (const sy of [-1, 1]) {
    const sh: V3 = [0, sy * 0.28, 11.45]
    tube(bronze, [sh, [-0.05, sy * 0.8, 11.6], [-0.15, sy * 1.4, 11.85]], 0.26, 0.26)
  }

  const flood = (p: V3, n: V3) => {
    const out = Math.hypot(n[0], n[1])
    return Math.max(0, Math.min(1, 0.35 + 0.55 * out - 0.03 * p[2]))
  }
  return finishGlb('Tyler Davidson Fountain', [
    { part: granite, material: finish('fountain-granite', 0xa4a8a3) },
    { part: bronze, material: { ...finish('fountain-bronze', 0x5f5447, 0.6), floodlight: flood } as Swatch },
  ], { bearing: 0, height: 12.34, replaces: REPLACES })
}

const REPLACES = ['way/270847449', 'way/271753029']

if (import.meta.main) await emit('cin-tyler-davidson-fountain', build())
