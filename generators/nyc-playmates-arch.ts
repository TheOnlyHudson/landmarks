/**
 * Playmates Arch, Central Park, under Center Drive by the Carousel (Calvert
 * Vaux and Jacob Wrey Mould, 1863) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-playmates-arch.ts
 *
 * Built with the arch kit in generators/nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): x along Center Drive (bearing 42°), y along the
 * path through the arch (bearing 312°: the placement's bearing), z up,
 * metres; z = 0 is the path. Anchor: the middle of OSM way/45782067
 * (footway, tunnel=yes, "Playmates Arch"). No bridge outline or building is
 * mapped over it (the Chess and Checkers House is 45 m south), so
 * `replaces` is empty.
 *
 * Evidence
 * - OSM (ODbL): the path through way/45782067, 22.1 m, bearing 312°; Center
 *   Drive way/46613713 (width 10) over it at bearing ~41°.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-playmates-arch/photos):
 *   G. Edward Johnson, "Centralpark 20040520 121402 1.1504.jpg",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Centralpark_20040520_121402_1.1504.jpg
 *     (a portal square on, people for scale: every proportion below);
 *   Epicgenius, "Central Park Jul 2019 03.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Jul_2019_03.jpg
 *     (the portal at an angle, the railing and the wall's extent);
 *   Jim.henderson, "CP Carousel tunnel jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:CP_Carousel_tunnel_jeh.jpg
 *     (inside: granite voussoirs, buff brick lining with red stripes).
 *   Look-only (Flickr, NC/ND; not used for shape): MichaelTapp, gigi_nyc,
 *   B.C. Angell, IslesPunkFan, mokolabs "Playmates Arch" photos.
 * - Estimated from the square-on photo scaled by the people (~1.7 m): an
 *   opening 4.9 m wide, a segmental arch springing at 1.1 m with its crown
 *   at 2.5 m, grey granite voussoirs 0.65 m deep carried down the jambs;
 *   a buff brick face 12 m long banded with red brick courses; a granite
 *   cornice 0.35 m with its top at 3.65 m (taken as the roadway); a dark
 *   iron railing 0.95 m on top with posts about 2 m apart.
 *
 * Review: only 3 m of barrel and infill are drawn behind each portal (the
 * terrain covers the middle); the infill top is a neutral roadbed grey.
 *
 * Doubts: no lidar or published dimensions; the roadway height and span are
 * photo-scaled. The number and spacing of the red courses are simplified.
 * The second portal mirrors the first.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archBlock, band, box, steps } from './nyc-greyshot-arch'

const buff = new Part(), bed = new Part(), red = new Part(), granite = new Part(), iron = new Part()
const ROAD = 3.65, D = 22.1, half = D / 2, W = 6.0, A = 2.45, SPRING = 1.1, RISE = 1.4
const RING = 0.65

const { outer } = archBlock({ D, W, top: () => ROAD, fill: ROAD - 0.3, F: W, t: 0.8, kind: 'segment', a: A, rise: RISE, spring: SPRING, ring: RING, proud: 0.07, jambs: true, n: 12, portal: 3 },
  { face: buff, ring: granite, barrel: buff, fill: bed })

// the ring's outer curve as z(x), to stop the red courses at the voussoirs
const outerZ = (x: number) => {
  if (Math.abs(x) >= A + RING) return -1
  if (Math.abs(x) <= outer[0][0] * -1 && Math.abs(x) >= A) return 99
  for (let i = 0; i + 1 < outer.length; i++) {
    const [x0, z0] = outer[i], [x1, z1] = outer[i + 1]
    if (x >= x0 && x <= x1) return z0 + ((z1 - z0) * (x - x0)) / Math.max(x1 - x0, 1e-9)
  }
  return 99
}

for (const s of [-1, 1]) {
  band(granite, s, half, 0.16, [-W, W], () => ROAD - 0.35, () => ROAD)
  // red brick courses across the face, clear of the voussoirs
  for (let z = 0.9; z < ROAD - 0.45; z += 0.4) {
    const xs = steps(-W, W, 48)
    for (let i = 0; i < 48; i++) {
      const p = xs[i], q = xs[i + 1]
      const clear = (x: number) => Math.abs(x) >= A + RING || (outerZ(x) < z - 0.02 && outerZ(x) >= 0)
      if (!clear(p) || !clear(q)) continue
      band(red, s, half, 0.02, [p, q], () => z, () => z + 0.12, false)
    }
  }
  // the iron railing: posts, top and bottom rails, sparse bars
  const yb = s * (half - 0.2)
  for (const x of steps(-W + 0.1, W - 0.1, 6)) box(iron, x - 0.06, x + 0.06, yb - 0.06, yb + 0.06, ROAD, ROAD + 1.0)
  box(iron, -W + 0.1, W - 0.1, yb - 0.04, yb + 0.04, ROAD + 0.88, ROAD + 0.95)
  box(iron, -W + 0.1, W - 0.1, yb - 0.04, yb + 0.04, ROAD + 0.1, ROAD + 0.16)
  for (const x of steps(-W + 0.1, W - 0.1, 30)) box(iron, x - 0.025, x + 0.025, yb - 0.025, yb + 0.025, ROAD + 0.16, ROAD + 0.88)
}

finishModel('Playmates Arch', 'nyc-playmates-arch', [
  { part: bed, material: { name: 'roadbed', color: 0xa9a7a1, roughness: 0.95 } },
  { part: buff, material: { name: 'buff-brick', color: 0xd3c197, roughness: 0.9 } },
  { part: red, material: { name: 'red-brick', color: 0xb5644d, roughness: 0.9 } },
  { part: granite, material: { name: 'granite', color: 0xb6b4ad, roughness: 0.85 } },
  { part: iron, material: { name: 'iron', color: 0x4a4f57, roughness: 0.6 } },
], { bearing: 312, height: ROAD + 1.0 }, 5000)
