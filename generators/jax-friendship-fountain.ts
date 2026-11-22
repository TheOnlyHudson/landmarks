/**
 * Friendship Fountain, Southbank Riverwalk, Jacksonville, FL (1965;
 * renovated 2011 and 2020–2024): procedural, CC0-1.0, no textures.
 * bun generators/jax-friendship-fountain.ts [out.glb]
 *
 * The round basin on the St. Johns River's south bank: a low pale concrete
 * rim, six light pylons round it, and the water in the air drawn as simple
 * pale forms: the tall central column (flaring into its splash at the foot), the middle ring of vertical plumes
 * and the outer ring's curtain of inward-arching jets. The water surface is
 * the map's; it is not modelled.
 *
 * Identity and plan: OSM way/348479221 (amenity=fountain, water=pond,
 * "Friendship Fountain", wikidata Q5504395), a 19-sided ring of radius
 * 30.5 m about its centroid (-81.659809, 30.320012), the anchor. Round, so
 * bearing 0. `replaces` is empty: the basin is not a building.
 *
 * Published (Wikipedia, "Friendship Fountain"): basin 200 ft (61 m)
 * across; 63 nozzles in three rings: an outer ring of 36 angled inward at
 * 45° rising 35 ft (11 m), a middle ring 120 ft (36.6 m) across of 18
 * vertical nozzles rising 40 ft (12 m), and a centre ring 15 ft (4.6 m)
 * across of 9 nozzles rising up to 120 ft (37 m), capped at 70 ft / 50 ft
 * in wind.
 *
 * Estimated: the rim 0.9 m high and 0.7 m wide, the pylons 6 m (photos p1,
 * p2 against the 1 m railing); the display as drawn, a static mid-range
 * pose: central column 18 m (photos show 10–15 m, published up to 37 m),
 * middle plumes 6 m, outer arcs cresting at 4.5 m and landing at r 23
 * (p2). The pylons' even 60° spacing is invented (photos show only some).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/jax/work/jax-friendship-fountain/photos):
 *  p1 "Jax Friendship Fountain 2012.jpg", Mgreason, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Jax_Friendship_Fountain_2012.jpg
 *  p2 "FFountainJax2011.jpg", Excel23, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:FFountainJax2011.jpg
 *  p3 "Jacksonville Friendship Fountain.jpg", Jonathan Zander (Digon3),
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Jacksonville_Friendship_Fountain.jpg
 *
 * Left out: the railing on the rim, nozzles, lights in the basin. Doubts:
 * the photos predate the 2020–2024 renovation; the pylons may have
 * changed. The water is lit in changing colours at night, so the jets are
 * `neon-*` (white).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './nash-tennessee-state-capitol'

/** Surface of revolution about (cx, cy) through profile points (r, z), smooth around. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number) {
  for (let i = 0; i + 1 < prof.length; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    const nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n, b = (2 * Math.PI * (k + 1)) / n
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b)
      const A: V3 = [cx + r0 * ca, cy + r0 * sa, z0], B: V3 = [cx + r0 * cb, cy + r0 * sb, z0], C: V3 = [cx + r1 * cb, cy + r1 * sb, z1], D: V3 = [cx + r1 * ca, cy + r1 * sa, z1]
      const na: V3 = [(nr / l) * ca, (nr / l) * sa, nz / l], nb: V3 = [(nr / l) * cb, (nr / l) * sb, nz / l]
      if (r0 > 1e-4) p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
      if (r1 > 1e-4) p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
    }
  }
}

const N = 48
const R1 = 30.5, R0 = 29.8, TOP = 0.9 // the rim
const JET = 18.0

const MATS = {
  rim: finish('ff-concrete', 0xe2d6c2),
  cope: finish('ff-coping', 0xf0e8da),
  pylon: finish('ff-pylon', 0xe9e1d2),
  jet: { name: 'neon-fountain-jet', color: 0xf2f6f8, roughness: 0.4 },
  spray: { name: 'neon-fountain-spray', color: 0xe6f0f5, roughness: 0.4, opacity: 0.65, doubleSided: true },
} satisfies Record<string, MaterialSpec>

function build() {
  const rim = new Part(), cope = new Part(), pylon = new Part(), jet = new Part(), spray = new Part()

  // the rim: a low wall with a rounded coping, the basin's inner face below it
  lathe(rim, 0, 0, [[R1, 0], [R1, TOP - 0.15], [R1 - 0.1, TOP]], N)
  lathe(cope, 0, 0, [[R1 - 0.1, TOP], [R0 + 0.1, TOP]], N)
  lathe(rim, 0, 0, [[R0 + 0.1, TOP], [R0, TOP - 0.15], [R0, 0]], N)

  // six light pylons on the rim: square shafts with a lantern head
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3 + Math.PI / 6, x = Math.cos(a) * (R1 - 0.35), y = Math.sin(a) * (R1 - 0.35)
    box(pylon, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, 5.2, pylon, 0.1)
    box(pylon, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 5.2, 5.5, pylon, 0.1)
    box(pylon, x - 0.35, y - 0.35, x + 0.35, y + 0.35, 5.5, 6.2, pylon, 0.08)
  }

  // the central column: nine jets read as one bold pale column, flaring where it breaks
  lathe(jet, 0, 0, [[4.6, 0], [3.2, 1.0], [2.3, 3.5], [2.0, 9], [2.3, JET - 4], [2.5, JET - 1.8], [1.6, JET - 0.5], [0, JET]], 16)
  // the middle ring: eighteen vertical plumes, r 18.3
  for (let k = 0; k < 18; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / 18
    lathe(jet, Math.cos(a) * 18.3, Math.sin(a) * 18.3, [[1.3, 0], [0.6, 1.0], [0.45, 3.5], [0.4, 5.2], [0, 6.2]], 8)
  }
  // the outer ring: 36 jets arching inward from the rim, drawn as one curtain, both sides
  const arc: [number, number][] = [[R0 - 0.4, 0], [R0 - 1.2, 2.6], [R0 - 2.6, 4.2], [R0 - 4.2, 4.5], [R0 - 5.6, 3.3], [R0 - 6.6, 0]]
  lathe(spray, 0, 0, arc, N)
  lathe(spray, 0, 0, [...arc].reverse(), N)

  return finishGlb('Friendship Fountain', [
    { part: rim, material: MATS.rim },
    { part: cope, material: MATS.cope },
    { part: pylon, material: MATS.pylon },
    { part: jet, material: MATS.jet },
    { part: spray, material: MATS.spray },
  ], { bearing: 0, height: JET, replaces: [] })
}

if (import.meta.main) await writeModel('jax-friendship-fountain', build())
