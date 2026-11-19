/**
 * Chalmette Monument, Chalmette Battlefield (Jean Lafitte National
 * Historical Park), Chalmette, Louisiana (1855-1908) — procedural, CC0-1.0,
 * no textures. bun generators/nola-chalmette-monument.ts
 *
 * The 100 ft (30.6 m) marble obelisk marking the Battle of New Orleans
 * (8 January 1815): a stepped pyramid base of about eight marble steps, a
 * slightly wider base course with its door, the long gently tapering square
 * shaft, three slit openings near the top of each face and a short
 * pyramidion.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * area centroid of OSM way/608485395 (−89.9941365, 29.9424491). Placed at
 * bearing 28.6, the outline's own axes (sides at 28.6° and 118.2°): model −y
 * faces compass 208.6°, toward the visitor centre.
 *
 * Evidence
 * - OSM way/608485395 (building=yes, man_made=obelisk, historic=monument):
 *   a 12.2 × 12.6 m square, the footprint of the stepped base.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame: ground +1.0 over the grid minimum all
 *   round; the steps rise from ±6 m to a platform ~2.1 m up at about ±3.5;
 *   the shaft about 5 m square at its foot, centred ~0.5 m east of the
 *   centroid (drawn centred); top returns 28.9-29.0 above ground (the
 *   pyramidion's tip falls between returns).
 * - Published: National Park Service and Wikipedia ("Chalmette Monument"):
 *   100 ft (30.6 m) tall, begun 1855, completed 1908, marble.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Chalmette Battlefield Monument.jpg", Peter Flass, CC BY 4.0: face-on,
 *     the door, the base course, the slits, the taper
 *     https://commons.wikimedia.org/wiki/File:Chalmette_Battlefield_Monument.jpg
 *   - "Chalmette Battlefield Monument, January 2018.jpg", The ed17,
 *     CC BY-SA 4.0: the steps and whole height at an angle
 *     https://commons.wikimedia.org/wiki/File:Chalmette_Battlefield_Monument,_January_2018.jpg
 *   - "Chalmette Battlefield obelisk Chalmette LA.jpg", NastyCanasta,
 *     CC BY-SA 4.0: with the visitor centre
 *     https://commons.wikimedia.org/wiki/File:Chalmette_Battlefield_obelisk_Chalmette_LA.jpg
 *   - "Battle of New Orleans Monument.jpg", Molly Sweeney, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Battle_of_New_Orleans_Monument.jpg
 *   - "ChalmetteMonumentRangerStairs.jpg", Infrogmation, CC BY 2.5: the door,
 *     the plaque, the steps from the front
 *     https://commons.wikimedia.org/wiki/File:ChalmetteMonumentRangerStairs.jpg
 *
 * Measured (lidar): the base's plan and height, the shaft's width at its
 * foot. Published: the 30.6 m total. Estimated from the photos against
 * those: eight steps of 0.27 m, the base course (5.6 m square to 6.0 m),
 * the shaft's taper (4.9 → 3.7 m), the pyramidion (2.0 m), the slits
 * (0.3 × 2.0 m, three a face, 2.6 m under the shaft top), the door
 * (1.5 × 2.9 m, battered, one on each face) and its lintel.
 *
 * Doubts: the photos show a doorway on each face they see; the two faces no
 * photo shows face-on are drawn the same. The plaque is put on the face
 * toward the visitor centre.
 *
 * Night: floodlit from the ground (`floodlight`), brightest low on the shaft.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, band } from './nyc-city-hall'
import { rect, rectRing, quad } from './nola-st-patricks-church'

function build() {
  const marble = new Part(), steps = new Part(), dark = new Part()

  // Stepped base: eight steps from ±6.05 at the ground to the platform at 2.16.
  const N = 8, RISE = 0.27, H0 = 6.05, H1 = 3.45
  for (let i = 0; i < N; i++) {
    const h = H0 - ((H0 - H1) * i) / (N - 1)
    block(steps, -h, -h, h, h, i * RISE, (i + 1) * RISE)
  }
  const P = N * RISE // 2.16

  // Base course with the door, a cornice band over it.
  const B = 2.8, BT = 6.0
  prism({ wall: marble, win: null, roof: marble, ring: rectRing(-B, -B, B, B), z0: P, z1: BT, facade: null, bevel: 0.12 })
  band(marble, rectRing(-B, -B, B, B), BT - 0.45, BT - 0.05, 0.12)

  // The shaft: a tapering square, then the pyramidion.
  const S0 = 2.45, S1 = 1.85, ST = 28.6, TOP = 30.6
  const ring = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  marble.loft([ring(S0, BT), ring(S1, ST)])
  const apex: V3 = [0, 0, TOP]
  const r = ring(S1, ST)
  for (let i = 0; i < 4; i++) marble.tri(r[i], r[(i + 1) % 4], apex)

  // Three slits near the top of each face, on the tapered face.
  const slope = (S0 - S1) / (ST - BT)
  const half = (z: number) => S0 - slope * (z - BT)
  for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
    for (const s of [-0.75, 0, 0.75]) {
      const za = ST - 2.7, zb = ST - 0.7, w = 0.16, d = 0.04
      const at = (t: number, z: number): V3 => {
        const h = half(z) + d
        return nx !== 0 ? [nx * h, -nx * t, z] : [ny * t, ny * h, z]
      }
      quad(dark, at(s - w, za), at(s + w, za), at(s + w, zb), at(s - w, zb), [nx, ny, slope])
    }
  }

  // A doorway on each face of the base course (the photos show one on every
  // face seen): a battered dark opening under a lintel; the plaque on −y.
  for (let k = 0; k < 4; k++) {
    const c = Math.cos((k * Math.PI) / 2), s = Math.sin((k * Math.PI) / 2)
    const R = (x: number, y: number, z: number): V3 => [x * c - y * s, x * s + y * c, z]
    const y = -B - 0.03
    quad(dark, R(-0.78, y, P), R(0.78, y, P), R(0.66, y, P + 2.9), R(-0.66, y, P + 2.9), R(0, -1, 0))
    const a = R(-1.1, -B - 0.25, 0), b = R(1.1, -B + 0.1, 0)
    block(marble, Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]), P + 2.9, P + 3.35)
  }
  rect(dark, 'front', -B, 1.6, 0.7, P + 0.9, P + 1.8, 0.04)   // the bronze plaque

  const lit = (p: V3, n: V3): number => (n[2] > 0.6 ? 0.25 : Math.max(0.35, 1 - p[2] / 45))
  finishModel('Chalmette Monument', 'nola-chalmette-monument', [
    { part: marble, material: { ...finish('chalmette-marble', 0xe6e0d3), floodlight: lit } },
    { part: steps, material: { ...finish('marble-steps', 0xdcd8cf), floodlight: lit } },
    { part: dark, material: finish('opening', 0x4f555c) },
  ], { bearing: 28.6, osm: 'way/608485395', height: TOP }, 5000)
}

if (import.meta.main) build()
