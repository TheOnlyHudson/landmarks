/**
 * Horace E. Dodge and Son Memorial Fountain, Hart Plaza, Detroit (designed
 * 1978, built 1981; Isamu Noguchi with Walter Budd): procedural, CC0-1.0, no
 * textures.
 * bun generators/det-dodge-fountain.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: OSM node/1215294644 (amenity=fountain), which sits on the
 * ring's centre in the lidar. Placed at bearing 330, so the model's x runs
 * along the two legs (+x = 60 deg, NE; the legs splay NE and SW in the
 * lidar). OSM maps no building here: replaces [].
 *
 * Identity, in order: the big stainless steel ring (a fat torus) held high
 * on two straight round legs that splay out at about 45 degrees to the
 * plaza, the ring's underside perforated with jets; the red granite drum of
 * the pool under it. Water and the plaza's paving (a shallow dish with
 * concentric rings) are not modelled; the pool's drum stands above the
 * plaza and is.
 *
 * Evidence
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m
 *   grid, read at 1 m in the model's frame. The plaza dishes down from
 *   ~0.9 m (x = +-14) to ~0.1 m at the drum (y = 0 here). The ring's top
 *   returns, 8.2-8.7 m, fall on a circle of radius ~3.2-4.1 m round the
 *   anchor; the drum's top ~1.3-1.5 m inside radius ~3.8 m; the legs show
 *   as faint lines NE and SW in the shaded image but give no clean
 *   returns (steel, steep), so their reach is taken from the photos.
 * - Published: Wikipedia "Horace E. Dodge and Son Memorial Fountain":
 *   stainless steel, the ring 30 ft (9.1 m) over the pool, a circular
 *   granite pool, 300 jets and 300 lights.
 * - Photos (all evidence), in SCRATCH/work/det-dodge-fountain/photos:
 *   - "Dodge Fountain in Hart Plaza - front.jpg", Al R, CC BY-SA 2.0,
 *     face-on across the legs: the leg angle, ring and drum proportions
 *     https://commons.wikimedia.org/wiki/File:Dodge_Fountain_in_Hart_Plaza_-_front.jpg
 *   - "Dodge Fountain in Hart Plaza in the evening with lights.jpg", Al R,
 *     CC BY-SA 2.0: the red granite drum, the lit ring underside
 *     https://commons.wikimedia.org/wiki/File:Dodge_Fountain_in_Hart_Plaza_in_the_evening_with_lights.jpg
 *   - "Horace E. Dodge and Son Memorial Fountain, Hart Plaza", Ken Lund,
 *     CC BY-SA 2.0 (Flickr via Openverse), oblique, the fountain dry
 *     https://www.flickr.com/photos/75683070@N00/14180768706
 *   - "Noguchi Dodge fountain.jpg", Mikerussell, CC BY-SA 3.0, along the axis
 *     https://commons.wikimedia.org/wiki/File:Noguchi_Dodge_fountain.jpg
 *
 * Numbers. Measured: the ring's centreline radius 3.6 m and its top 8.45 m
 * over the drum's foot, the drum's top radius ~3.9-4.1; its height 1.6 m (the lidar's 1.3 m
 * over the dish, raised a little as the dry Ken Lund photo shows it taller).
 * Estimated from the photos (the dry Ken Lund view more than the
 * wide-angle front one): the ring's tube 1.9 x 2.0 m (outer diameter
 * ~9.1 m), legs 1.7 m thick meeting the ring at its two ends, the feet
 * ~13.3 m out (the feet span about three ring diameters), so the legs
 * slope ~40 deg; the drum widening to radius 4.3 at its foot. The 30 ft in Wikipedia
 * is read as the ring's height over the plaza (8.4 m measured to its top
 * over the lowest ground; the plaza at the feet is 0.6 m higher). The
 * perforations are left out (too fine).
 *
 * Doubts: every photo shows the drum a little wider than the ring
 * (~1.15x) and taller relative to it than the lidar allows; the photos are
 * low and close, so the lidar's heights and the ring's measured radius
 * were kept and the drum sized between the two. The legs' reach rests on
 * the photos alone.
 *
 * Colours: brushed stainless #b9bcbd -> #cdd0d1; the drum's red granite
 * #7a4a3c in the evening photo -> #b07c69. Night: the fountain's lights sit
 * under the ring and at the legs' feet; the steel carries a _FLOODLIGHT
 * wash, strongest on its underside.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, tube } from './nyc-columbus-monument'

const steel = new Part(), granite = new Part()

function build() {
  // --- The ring: a torus, centreline radius R, tube half-sizes a (radial) and b (vertical). ---
  const R = 3.6, A = 0.95, B = 1.0, ZR = 7.45, NU = 28, NV = 12
  smooth(steel, (q) => {
    const P = (u: number, v: number): V3 => {
      const r = R + A * Math.cos(v)
      return [r * Math.cos(u), r * Math.sin(u), ZR + B * Math.sin(v)]
    }
    for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
      const u0 = (i * TAU) / NU, u1 = ((i + 1) * TAU) / NU, v0 = (j * TAU) / NV, v1 = ((j + 1) * TAU) / NV
      q.quad(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1))
    }
  }, 50)

  // --- The two legs, from the ring's ends down to the plaza, splayed ~45 deg. ---
  for (const s of [-1, 1]) {
    const top: V3 = [s * (R + 0.15), 0, ZR - 0.2], foot: V3 = [s * 12.75, 0, 0.67]   // the cap's lowest edge on y = 0
    smooth(steel, (q) => tube(q, [top, [(top[0] + foot[0]) / 2, 0, (top[2] + foot[2]) / 2], foot], [0.85, 0.85, 0.85], 14), 50)
  }

  // --- The pool's red granite drum, slightly tapered, its wall split for the drape. ---
  smooth(granite, (q) => {
    const N = 20, r0 = 4.3, r1 = 3.95, H = 1.6
    const ring = (r: number, z: number) => Array.from({ length: N }, (_, i): V3 => [r * Math.cos((i * TAU) / N), r * Math.sin((i * TAU) / N), z])
    q.loft([ring(r0, 0), ring(r0 - 0.15, H / 2), ring(r1, H)])
    // The top: a rim ring 0.4 m wide (the water inside is the map's to leave out).
    const inner = ring(r1 - 0.4, H - 0.05), outer = ring(r1, H)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      q.quad(outer[i], outer[j], inner[j], inner[i])
    }
    // The inner face, down to the water line.
    q.loft([ring(r1 - 0.4, H - 0.05), ring(r1 - 0.4, H - 0.6)].map((r) => [...r].reverse()))
  }, 40)

  const flood = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.9 : 0.35)
  finishModel('Horace E. Dodge and Son Memorial Fountain', 'det-dodge-fountain', [
    { part: steel, material: { name: 'stainless-steel', color: 0xcdd0d1, roughness: 0.35, floodlight: flood } },
    { part: granite, material: { name: 'red-granite', color: 0xb07c69, roughness: 0.7 } },
  ], { bearing: 330, osm: 'node/1215294644', height: ZR + B }, 5000)
}

if (import.meta.main) build()
