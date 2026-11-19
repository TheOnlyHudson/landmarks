/**
 * Monument to Joe Louis ("The Fist"), Jefferson Avenue at Woodward, Detroit
 * (1986; Robert Graham, cast by Rolf Kriken): procedural, CC0-1.0, no
 * textures.
 * bun generators/det-joe-louis-fist.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: OSM node/1216215953 (historic=memorial, Q6906877). Placed
 * at bearing 236, so the model's x runs along the arm (+x = 326 deg, NNW,
 * up Woodward) and the fist, at -x, points 146 deg (SSE), toward the river
 * and Canada as Wikipedia says; the Detroit Golfer photo, taken in front of
 * the fist with One Detroit Center behind it, confirms it. OSM maps no
 * building here: replaces [].
 *
 * Identity, in order: the huge dark bronze forearm and clenched fist hanging
 * level in the air, knuckles forward and the thumb tucked under; the tall,
 * narrow four-legged pyramid of square bronze bars over it, the arm hung
 * from its apex and legs by cables; the low concrete base.
 *
 * Evidence
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m
 *   grid. The base: 0.8 m over the road, ~8.2 x 5.2 m, its long side on the
 *   arm's axis. Arm returns along a line at bearing 146/326, tops 3.0 m
 *   over the road at the SE (fist) end rising to 3.9 m at the NW (elbow)
 *   end; the frame's apex 8.15 m over the road (7.35 m over the base).
 * - Published: Wikipedia "Monument to Joe Louis": bronze, arm 24 ft
 *   (7.3 m) long, frame 24 ft (7.3 m) high, overall 24 x 11.5 x 24 ft; the
 *   fist alone 5,000 lb; the fist points toward Canada.
 * - Photos, in SCRATCH/work/det-joe-louis-fist/photos (all evidence):
 *   - "Monument to Joe Louis, Detroit, Michigan", Ken Lund, CC BY-SA 2.0
 *     (Flickr, via Openverse), side view: the frame's legs, the base, the
 *     arm's droop toward the fist
 *     https://www.flickr.com/photos/75683070@N00/14180763926
 *   - "Joe Louis Fist", Detroit Golfer, CC BY 2.0 (Flickr, via Openverse),
 *     end-on in front of the fist: the knuckles and thumb, the apex cables
 *     https://www.flickr.com/photos/152135786@N05/49878482137
 *   - "Fist of a Champion – Detroit's Monument to Joe Louis - panoramio.jpg",
 *     Walter Powers, CC BY 3.0, the fist close up with its cables
 *     https://commons.wikimedia.org/wiki/File:Fist_of_a_Champion_%E2%80%93_Detroit%27s_Monument_to_Joe_Louis_-_panoramio.jpg
 *   - "Monument to Joe Louis--.jpg", Flavinista, CC BY-SA 4.0, under the fist
 *     https://commons.wikimedia.org/wiki/File:Monument_to_Joe_Louis--.jpg
 *   - "Transcending Wheel ^ Joe Louis's Fist Statue - panoramio.jpg",
 *     ohcuma.chengi, CC BY 3.0, the whole group from across Jefferson
 *     https://commons.wikimedia.org/wiki/File:Transcending_Wheel_%5E_Joe_Louis%27s_Fist_Statue_-_panoramio.jpg
 *
 * Numbers. Measured: base (0.8 m, 8.2 x 5.2), apex 8.15, arm heights.
 * Published: arm 7.3 m, frame 7.3 m high. Estimated from the Ken Lund side
 * view, scaled by the frame's 7.35 m height (its four feet project at
 * -3.1, -1.1, +1.5, +2.9 m from the apex, which a near-square footprint
 * seen ~20 deg off square fits) and the end-on Golfer view: feet 4.8 m
 * apart along the arm and 4.6 m across (wider than the published
 * 11.5 ft, which may be another measure: doubt); legs 0.34 m square bars; the arm's axis 3.4 m over the road at the elbow
 * end, the fist's centre 2.6 m; forearm ~1.1 m across, the fist ~1.5 m tall
 * and 1.25 m wide (half again the forearm, as in the photos). Cables are drawn as 0.1 m rods, thicker than real, two
 * from the apex and four from the legs; their attachment points follow the
 * photos loosely.
 *
 * Doubt: the ohcuma.chengi view is hard to orient and could be read as the
 * fist pointing NNW; the lidar (the arm's top 0.9 m higher at the NW end,
 * as the Ken Lund photo shows it drooping toward the fist), the Golfer
 * photo and Wikipedia all put the fist at the SSE end, and that is built.
 *
 * Colours: the arm's bronze is near black (#3c3b39 in the photos), pulled
 * to #5c5952 (dark, as the silhouette is the landmark; above the charcoal
 * floor); the frame a weathered greenish bronze (#3b423f) -> #59615c; the
 * base's exposed-aggregate concrete #c9c1b2 -> #d9d3c7. Night: no lighting
 * of note in the photos; the base and arm are lit from the street only
 * (nothing marked lit).
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, face } from './nyc-columbus-monument'

const arm = new Part(), frame = new Part(), base = new Part()

function build() {
  // --- Base: 8.2 x 5.2 x 0.8 m, its faces split so the drape keeps it. ---
  const BX = -0.9, BY = 0.3, BZ = 0.8
  prism({ wall: base, win: null, roof: base, ring: chamferRect(BX - 4.1, BY - 2.6, BX + 4.1, BY + 2.6, 0.3), z0: 0, z1: BZ, facade: null, bevel: 0.08 })

  // --- The frame: four square bars from the base to the apex. ---
  const AX = BX, AY = BY, AZ = 8.15, FA = 2.4, FB = 2.3, W = 0.17
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const foot: V3 = [AX + sx * FA, AY + sy * FB, BZ], top: V3 = [AX + sx * 0.12, AY + sy * 0.1, AZ]
    // A square section, its sides parallel to the model's axes.
    const sec = (c: V3): V3[] => [[c[0] - W, c[1] - W, c[2]], [c[0] + W, c[1] - W, c[2]], [c[0] + W, c[1] + W, c[2]], [c[0] - W, c[1] + W, c[2]]]
    solid(frame, [sec(foot), sec([(foot[0] + top[0]) / 2, (foot[1] + top[1]) / 2, (BZ + AZ) / 2]), sec(top)])
  }
  // The cap where the bars meet.
  prism({ wall: frame, win: null, roof: frame, ring: chamferRect(AX - 0.4, AY - 0.4, AX + 0.4, AY + 0.4, 0.05), z0: AZ - 0.5, z1: AZ + 0.05, facade: null, bevel: 0.06 })

  // --- The arm: elbow end at +x, fist at -x, drooping a little toward the fist. ---
  const XE = BX + 3.65, XW = BX - 2.35                 // elbow end, wrist (the fist reaches BX - 3.65)
  const zAt = (x: number) => 2.85 + ((x - XW) / (XE - XW)) * (3.4 - 2.85)
  smooth(arm, (q) => {
    // Forearm: an oval section, wider than tall, swelling toward the elbow.
    const ring = (x: number, w: number, h: number): V3[] => Array.from({ length: 12 }, (_, i) => {
      const t = (i * TAU) / 12
      return [x, BY + w * Math.cos(t), zAt(x) + h * Math.sin(t)] as V3
    })
    const rings = [ring(XE, 0.35, 0.3), ring(XE - 0.25, 0.55, 0.47), ring(XE - 1.2, 0.6, 0.52), ring(XE - 3.0, 0.55, 0.48), ring(XW + 0.3, 0.47, 0.42), ring(XW, 0.45, 0.42)]
    // Loft along -x: rings must run counter-clockwise seen from the far end; let solid handle caps.
    q.loft(rings.map((r) => [...r].reverse()))
    q.cap([...rings[0]].reverse(), false)
    q.cap([...rings[rings.length - 1]].reverse(), true)
    // The fist: a rounded block, knuckles forward (-x), the four curled fingers across its front,
    // the thumb tucked under them.
    const FX = XW - 0.62, FZ = 2.6
    ellipsoid(q, [FX, BY, FZ + 0.05], [0.78, 0.62, 0.72], 10, 5)
    for (let k = 0; k < 4; k++) {
      const y = BY - 0.45 + k * 0.3
      tube(q, [[FX - 0.5, y, FZ + 0.5], [FX - 0.8, y, FZ + 0.25], [FX - 0.8, y, FZ - 0.2], [FX - 0.5, y, FZ - 0.42]], [0.18, 0.18, 0.18, 0.16], 6)
    }
    tube(q, [[FX + 0.1, BY + 0.5, FZ - 0.5], [FX - 0.4, BY + 0.2, FZ - 0.6], [FX - 0.7, BY - 0.2, FZ - 0.5]], [0.2, 0.19, 0.17], 6)
  }, 70)

  // --- Cables (drawn as 0.1 m rods): two from the apex, four from the legs. ---
  const cable = (a: V3, b: V3) => tube(frame, [a, b], [0.05, 0.05], 4)
  cable([AX - 0.1, AY, AZ - 0.5], [XW + 0.25, BY, zAt(XW + 0.25) + 0.42])
  cable([AX + 0.1, AY, AZ - 0.5], [XW + 2.2, BY, zAt(XW + 2.2) + 0.47])
  for (const sy of [-1, 1]) {
    const legAt = (sx: number, t: number): V3 => [AX + sx * FA * (1 - t), AY + sy * FB * (1 - t), BZ + (AZ - BZ) * t]
    cable(legAt(-1, 0.42), [XW + 0.1, BY + sy * 0.4, zAt(XW + 0.1)])
    cable(legAt(1, 0.42), [XE - 1.4, BY + sy * 0.55, zAt(XE - 1.4)])
  }

  finishModel('Monument to Joe Louis', 'det-joe-louis-fist', [
    { part: arm, material: { name: 'bronze', color: 0x5c5952, roughness: 0.5 } },
    { part: frame, material: { name: 'bronze-frame', color: 0x59615c, roughness: 0.6 } },
    { part: base, material: { name: 'concrete', color: 0xd9d3c7, roughness: 0.9 } },
  ], { bearing: 236, osm: 'node/1216215953', height: AZ + 0.05 }, 5000)
}

if (import.meta.main) build()
