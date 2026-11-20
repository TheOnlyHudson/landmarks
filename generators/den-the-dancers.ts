/**
 * The Dancers, Jonathan Borofsky, 2003, Denver Performing Arts Complex
 * (Speer Boulevard and Arapahoe Street) — original procedural geometry,
 * CC0-1.0.
 * bun generators/den-the-dancers.ts
 *
 * Two 60 ft white fibreglass figures dancing hand in hand on a round
 * concrete pad.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor -104.9992565,
 * 39.7430418, the centre of OSM way/317470129 (tourism=artwork, the round
 * pad, radius about 8 m). The pad itself is ground and not modelled.
 *
 * Identity (from the photos below):
 *  1. Two very tall, thin, featureless white figures with egg heads and
 *     long necks.                                         (bon2, daq, joel)
 *  2. They hold hands low between them, each with the other arm flung up
 *     high, hand above its head.                          (bon2, daq, pdubs)
 *  3. Wide, kicking strides: the west figure on a long split between two
 *     feet; the east figure on one leg slanting out east, the other leg
 *     swung back and up behind it.                        (bon2, joel, daq)
 *  4. Long, tapering limbs with small mitten hands and long pointed feet,
 *     all smooth and white.                                   (all)
 *
 * Pose: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, 13 m
 * box; ground 0.2-0.3 m. The figures show as sparse returns, enough to fix
 * every joint to about half a metre: the west figure's head at (-3.3, 0)
 * with its top at 16 m, its raised hand at (-0.8, -4.1) and 18.4 m; the
 * east figure's head at (3.2, 0.5), 16 m, its raised hand at (5.3, 4.7)
 * and 18.6 m; the joined hands at (0.1, 2.8), 9.5-10 m; the east figure's
 * swung leg reaching back to (3.4, -6), 4-5 m up; the west figure's legs
 * down to the north-west and the south-west, the east figure's standing
 * leg out to the east. Published height 60 ft (18.3 m).
 * Measured (lidar): every joint position and the head and hand heights.
 * Estimated from the photos: limb thicknesses (thigh 0.9 m, arm 0.6 m),
 * head size (2.2 m tall), torso widths, hands and feet.
 *
 * Photos (evidence):
 *  bon2    "Dancers", bonjourpeewee, CC BY-SA 2.0,
 *          https://www.flickr.com/photos/70316967@N00/2212676347 (from the
 *          north: east figure on the left)
 *  daq     "The Dancers", Daquella manera, CC0,
 *          https://www.flickr.com/photos/62518311@N00/8387605963 (far view)
 *  joel    "DSCF0967", joelogon, CC BY-SA 2.0,
 *          https://www.flickr.com/photos/87957708@N00/445663918 (close,
 *          swung leg in profile)
 *  bon1    "Dancers", bonjourpeewee, CC BY-SA 2.0,
 *          https://www.flickr.com/photos/70316967@N00/2213467754 (from below)
 *  pdubs   "Dancers Borofsky Sculpture, Denver.jpg", Pdubs.94, CC BY 4.0,
 *          https://commons.wikimedia.org/wiki/File:Dancers_Borofsky_Sculpture,_Denver.jpg
 *  jpeg    "Dancers by Jonathan Borofsky, 2024.jpg", JPEGtheCreator, CC0,
 *          https://commons.wikimedia.org/wiki/File:Dancers_by_Jonathan_Borofsky,_2024.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: which way daq and joel were taken from is not certain; the pose
 * rests on the lidar and bon2. The figures' faces, fingers and toes are
 * left out. Limbs are drawn a little thicker than they are, so they read
 * at phone size.
 *
 * Night: the figures are floodlit from the pad; they carry _FLOODLIGHT,
 * strongest low down.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-flatiron-building'
import { blob, ground, tube, type Sink } from './den-blue-bear'

// lidar grid → this frame (the grid was centred 0.3 m west, 0.2 m south)
const P = (x: number, y: number, z: number): V3 => [x - 0.3, y - 0.2, z]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

type Figure = {
  head: V3; neck: V3; chest: V3; pelvis: V3
  sh: [V3, V3]; hip: [V3, V3]
  arms: [V3[], V3[]]; legs: [V3[], V3[]]
  hands: [V3, V3]; feet: [V3, V3]
  tilt: V3
}

function figure(S: Sink, f: Figure, seed: number) {
  const across = sub3(f.sh[1], f.sh[0])
  // head: an egg, narrow at the chin
  blob(S, f.head, 0.72, 0.64, 1.15, 10, { tilt: f.tilt, seed })
  tube(S, [lerp3(f.neck, f.head, -0.3), f.neck, lerp3(f.neck, f.head, 0.55)], [[0.36, 0.33], [0.32, 0.3], [0.36, 0.33]], across, 8, { capA: 0, capB: 0 })
  // torso: shoulders, chest, waist, hips
  const sm = lerp3(f.sh[0], f.sh[1], 0.5), hm = lerp3(f.hip[0], f.hip[1], 0.5)
  tube(S, [lerp3(sm, f.neck, 0.15), f.chest, lerp3(f.chest, hm, 0.55), hm],
    [[0.86, 0.46], [0.76, 0.48], [0.54, 0.42], [0.68, 0.46]], across, 10, { capA: 0.5, capB: 0.6 })
  for (let k = 0; k < 2; k++) {
    const a = f.arms[k], l = f.legs[k]
    tube(S, a, a.map((_, i) => { const r = 0.4 - (0.14 * i) / (a.length - 1); return [r, r] as [number, number] }), [0, 0, 1], 8, { capA: 0.9, capB: 0.5 })
    blob(S, f.hands[k], 0.36, 0.24, 0.6, 8, { tilt: sub3(f.hands[k], a[a.length - 1]) })
    tube(S, l, l.map((_, i) => { const r = 0.6 - (0.29 * i) / (l.length - 1); return [r, r] as [number, number] }), [1, 0, 0], 8, { capA: 0.6, capB: 0.6 })
    blob(S, f.feet[k], 0.33, 0.33, 0.95, 8, { tilt: sub3(f.feet[k], l[l.length - 1]) })
  }
}

if (import.meta.main) {
  const white = new Part(), shade = new Part()
  // the second tone: faces turned down or away to the north-east, so the
  // white forms keep their roundness against a pale map
  const S: Sink = { pick: (n) => (n[2] < -0.25 || n[0] + n[1] > 0.5 ? shade : white), smooth: true }

  // the west figure: faces east, joined (left) hand to the north-east, right
  // hand flung up to the south-east; feet split north-west and south-west
  figure(S, {
    head: P(-3.15, 0.05, 15.05), neck: P(-3.05, 0.1, 13.6), chest: P(-3.1, 0.05, 12.0), pelvis: P(-3.4, -0.4, 8.4),
    sh: [P(-3.15, 1.05, 12.9), P(-2.95, -0.95, 13.05)], hip: [P(-3.6, 0.15, 8.4), P(-3.3, -0.85, 8.4)],
    arms: [[P(-3.15, 1.05, 12.9), P(-1.9, 1.95, 11.2), P(-0.25, 2.8, 9.85)], [P(-2.95, -0.95, 13.05), P(-2.0, -2.55, 15.5), P(-1.05, -3.75, 17.15)]],
    hands: [P(0.1, 2.85, 9.65), P(-0.85, -4.05, 17.55)],
    legs: [[P(-3.6, 0.15, 8.4), P(-4.35, 1.4, 4.9), P(-4.5, 2.25, 1.0)], [P(-3.3, -0.85, 8.4), P(-3.85, -2.7, 4.7), P(-3.55, -4.9, 0.9)]],
    feet: [P(-4.55, 2.75, 0.32), P(-3.45, -5.5, 0.32)],
    tilt: [0.15, 0, 1],
  }, 1)
  // the east figure: faces north, joined (left) hand to the west, right hand
  // flung up to the north-east; stands on its east leg, the other swung back
  figure(S, {
    head: P(3.2, 0.45, 14.95), neck: P(3.35, 0.4, 13.55), chest: P(3.5, 0.2, 12.0), pelvis: P(3.75, -0.5, 8.4),
    sh: [P(2.55, 0.6, 13.0), P(4.45, 0.3, 13.35)], hip: [P(3.3, -0.6, 8.35), P(4.25, -0.45, 8.45)],
    arms: [[P(2.55, 0.6, 13.0), P(1.25, 1.35, 10.75), P(0.45, 2.55, 9.95)], [P(4.45, 0.3, 13.35), P(5.85, 2.0, 15.75), P(5.4, 4.1, 17.2)]],
    hands: [P(0.15, 2.85, 9.75), P(5.3, 4.65, 17.6)],
    legs: [[P(3.3, -0.6, 8.35), P(2.65, -1.95, 6.35), P(3.35, -5.35, 4.75)], [P(4.25, -0.45, 8.45), P(5.95, -0.6, 4.4), P(7.3, -0.5, 0.95)]],
    feet: [P(3.45, -6.3, 4.25), P(7.75, -0.15, 0.32)],
    tilt: [-0.1, 0.05, 1],
  }, 2)

  ground([white, shade])
  const flood = (p: V3) => Math.max(0.25, 1 - p[2] / 22)
  await save('den-the-dancers', 'The Dancers', [
    { part: white, material: { ...finish('fibreglass-white', 0xf3f1ec), floodlight: flood } },
    { part: shade, material: { ...finish('fibreglass-shade', 0xc3c0b8), floodlight: flood } },
  ], {}, 5000)
}
