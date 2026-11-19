/**
 * Point State Park Fountain (1974; rebuilt 2009–2013) — procedural, CC0-1.0,
 * no textures. bun generators/pit-point-state-park-fountain.ts
 *
 * The fountain at the Point, where the Allegheny and the Monongahela meet:
 * a round basin with a broad pale granite rim, a low inner ring curb, a
 * dark flared bowl on a low drum at the centre, the single tall jet and the
 * crown of angled jets round the bowl. The water surface is the map's (OSM
 * draws the basin as natural=water); the model draws the rim, the ring, the
 * bowl and the water in the air.
 *
 * The jet and the spray are translucent (STYLE.md "Translucent glass"): a
 * bold pale column at opacity 0.55, the spray crown at 0.22, both
 * double-sided. They are named `neon-…` because the jet is floodlit white
 * at night (f2, f8) and glows in its own colour; that is the one lit thing
 * here. A reader without blending draws them as solid pale shapes.
 *
 * Frame: x east, y north, z up, metres; bearing 0 (it is round). Anchor
 * -80.0127764, 40.4418162: the centroid of the OSM basin, way/1037461399;
 * the lidar rings are centred on it within 0.5 m.
 *
 * Height. y = 0 is the basin's water (lidar 217.94 m NAVD88), the lowest
 * ground the map shows under the model (Mapterhorn reads the basin 0.2 m
 * below the plaza). The curbs stand on it. Elevation 0. `terrain.ts check`:
 * ok.
 *
 * Sources:
 * - OSM: way/1037461399 (amenity=fountain, natural=water; its outline
 *   r 26–29 m). `replaces` is empty: the basin is water, not a building, and
 *   the map should keep drawing it. The Fountain Pump House, way/349279596,
 *   is 45 m away and not drawn.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 0.5 m grid,
 *   azimuth-averaged in rings: the water at 0; the rim r 27.4–29.6, top
 *   0.88 (the plaza outside 0.23); the inner ring r 22.45–23.65, top 1.15;
 *   the central drum to r 4.2 at 0.78 and the bowl's lip, r 3.2, at 2.1;
 *   scattered spray returns at r 8.5–11.5. The jet was off (no returns over
 *   the bowl).
 * - Published (Pennsylvania DCNR, Point State Park; Wikipedia "Point State
 *   Park"): opened 1974, rebuilt 2009–2013; the jet reaches up to 150 ft
 *   (46 m). Not re-fetched for this model: the lead's brief gives
 *   the 46 m; the dates should be checked against the DCNR page.
 * - Photos (Wikimedia Commons, all CC0 unless noted):
 *   - f9 "Point Fountain, 2024-09-11", f3 "Point Fountain, 2026-10-22", f5
 *     "Point Fountain, 2026-10-22-3", f6 "Point Fountain, 2026-10-22-2", f4
 *     "Point Fountain, 2021-07-03, 01", f7 "Point Fountain and Heinz Field,
 *     2022-06-04", f1 "Point Fountain from the portal, Point State Park,
 *     2024-09-11" (Cbaile19): the jet, its width and height against the
 *     bowl, the crown of side jets, the dark bowl, the pale rim;
 *   - f2 "Point State Park Fountain at Night, 2015-11-03, 03", f8 "Point
 *     Fountain from the North Shore, 2023-09-20, 01" (Cbaile19): the lit jet
 *     at night;
 *   - f10 "Point-state-park-fountain.jpg" (MartinThoma, CC0): the basin from
 *     the plaza;
 *   - f11 "Duquesne Incline - view from the top - 4.jpg" (APK,
 *     CC BY-SA 4.0): the basin from above: rim, inner ring, bowl, jet.
 *
 * Estimated: the jet's height, 30 m: the height it shows in f9 (about 27 m
 * over the bowl, scaled by the bowl's 8 m) and f11; it runs at many heights,
 * up to the published 46 m. Its width (3.8–5.8 m, from f9); the spray
 * crown's reach (11 m, lidar spray) and height (8.6 m, f9); the bowl's
 * profile (f9).
 * Doubts: the spray crown is drawn as one continuous bell; in f9 it reads
 * as separate plumes. The rim's lights (f2) are not drawn.
 * Colour: the granite rim and ring pale grey #d6d5cf with a lighter coping
 * #e6e4dd (f9, f10); the bowl dark bronze-grey #5d5a55 (f9); the water
 * white #f2f6f8.
 *
 * No commercial imagery was used for this model.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

/** Surface of revolution through profile points (r, z), `n` segments, smooth-shaded around. */
function lathe(p: Part, prof: [number, number][], n: number, outward = true) {
  for (let i = 0; i + 1 < prof.length; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    // Profile normal (in r, z), pointing out of the solid for an outward profile.
    let nr = z1 - z0, nz = -(r1 - r0)
    if (!outward) { nr = -nr; nz = -nz }
    const l = Math.hypot(nr, nz) || 1
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n, b = (2 * Math.PI * (k + 1)) / n
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b)
      const A: V3 = [r0 * ca, r0 * sa, z0], B: V3 = [r0 * cb, r0 * sb, z0], C: V3 = [r1 * cb, r1 * sb, z1], D: V3 = [r1 * ca, r1 * sa, z1]
      const na: V3 = [(nr / l) * ca, (nr / l) * sa, nz / l], nb: V3 = [(nr / l) * cb, (nr / l) * sb, nz / l]
      if (r0 > 1e-4) p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
      if (r1 > 1e-4) p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
    }
  }
}

// Heights in metres above the basin's water (lidar 217.94 m NAVD88): y = 0 is the lowest ground
// the map shows under the basin.
const N = 48                    // segments around the basin (3.9 m a side at the rim)
const PLAZA = 0.23              // the plaza outside the rim (lidar)
const RIM = { r0: 27.4, r1: 29.6, top: 0.88 }
const RING = { r0: 22.45, r1: 23.65, top: 1.15 }
const JET = 30.0                // the jet's top as photographed (f9, the APK view); published up to 46 m

const MATS = {
  stone: finish('granite-grey', 0xd6d5cf),
  trim: finish('granite-coping', 0xe6e4dd),
  bowl: finish('bowl-bronze', 0x5d5a55),
  jet: { name: 'neon-fountain-jet', color: 0xf2f6f8, roughness: 0.4, opacity: 0.55, doubleSided: true },
  spray: { name: 'neon-fountain-spray', color: 0xe8f0f4, roughness: 0.4, opacity: 0.22, doubleSided: true },
} satisfies Record<string, MaterialSpec>

async function build() {
  const stone = new Part(), trim = new Part(), bowl = new Part(), jet = new Part(), spray = new Part()

  // The rim: a broad pale granite curb, 0.65 m over the plaza, 0.88 m over the water, with a
  // rounded coping (0.3 m) on both edges.
  const { r0, r1, top } = RIM
  lathe(stone, [[r1, 0], [r1, top - 0.25], [r1 - 0.12, top - 0.08], [r1 - 0.35, top]], N)
  lathe(trim, [[r1 - 0.35, top], [r0 + 0.35, top]], N)
  lathe(stone, [[r0 + 0.35, top], [r0 + 0.12, top - 0.08], [r0, top - 0.25], [r0, 0]], N)

  // The inner ring at r ≈ 23 (lidar, the APK view): a low pale curb standing out of the water.
  lathe(stone, [[RING.r1, 0], [RING.r1, RING.top]], N)
  lathe(trim, [[RING.r1, RING.top], [RING.r0, RING.top]], N)
  lathe(stone, [[RING.r0, RING.top], [RING.r0, 0]], N)

  // The central pedestal (lidar: a 0.78 m step to r 4.2, the bowl's lip 2.1 m at r 3.2): a low drum
  // and the dark flared bowl the jet rises from (f9).
  lathe(stone, [[4.3, 0], [4.3, 0.78], [3.0, 0.78]], 24)
  lathe(bowl, [[3.0, 0.78], [2.7, 1.2], [3.3, 1.8], [3.7, 2.1], [3.3, 2.15], [0, 2.15]], 24)

  // The jet: one bold pale column, a little wider toward the top where it breaks into spray, with a
  // rounded head (f3, f9).
  lathe(jet, [[1.9, 2.1], [2.1, 10], [2.5, 20], [2.9, JET - 3.5], [2.4, JET - 1.0], [1.3, JET - 0.15], [0, JET]], 16)
  // The crown of angled jets round the bowl, landing about 10 m out (f9; lidar's spray returns at
  // r 8.5–11.5): a fainter bell, drawn from both sides.
  lathe(spray, [[3.6, 2.1], [5.0, 6.5], [7.2, 8.6], [9.2, 7.0], [10.6, 3.5], [11.2, 0.4]], 24)
  lathe(spray, [[11.2, 0.4], [10.6, 3.5], [9.2, 7.0], [7.2, 8.6], [5.0, 6.5], [3.6, 2.1]], 24)

  const list = [
    { part: stone, material: MATS.stone }, { part: trim, material: MATS.trim }, { part: bowl, material: MATS.bowl },
    { part: jet, material: MATS.jet }, { part: spray, material: MATS.spray },
  ]
  // Lowest point at 0: the feet of the curbs stand on the water line (the map's lowest ground here).
  let lo = Infinity
  for (const l of list) for (let i = 1; i < l.part.pos.length; i += 3) lo = Math.min(lo, l.part.pos[i])
  for (const l of list) for (let i = 1; i < l.part.pos.length; i += 3) l.part.pos[i] -= lo
  const tris = list.reduce((n, l) => n + l.part.triangles, 0)
  const glb = writeGlb('Point State Park Fountain', list, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the basin centre', bearing: 0, elevation: 0 })
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  await Bun.write(new URL('../models/pit-point-state-park-fountain.glb', import.meta.url), glb)
  console.log(`pit-point-state-park-fountain.glb: ${tris} triangles, ${glb.length} bytes; dropped ${lo.toFixed(2)} m`)
}

if (import.meta.main) await build()
