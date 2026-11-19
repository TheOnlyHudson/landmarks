/**
 * Aspire Tower ("The Torch"), Aspire Zone, Al Rayyan, Doha (Hadi Simaan with
 * Arup, 2007) — original procedural geometry, CC0-1.0.
 * bun generators/doha-aspire-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/doha-aspire-tower.glb (low, ≤ 6,500 triangles);
 * - models/doha-aspire-tower.detail.glb (from zoom 16, ≤ 40,000).
 *
 * Frame: map frame (bearing 0; the tower is round). Origin = centre of the
 * OSM outline way/770633250 (51.4447440, 25.2625125).
 *
 * What it is: a slim concrete core; the floors hang off it in stacked
 * cantilevered pods (glazed drums) with the core showing between them; the
 * whole is wrapped in a net of steel members that flares out to a wide
 * skirt at the foot and opens into the torch's cup at the top, round the
 * white bowl of the flame; a sphere is cantilevered from the shaft about a
 * third of the way up. The net is modelled as real tubes: meridian ribs that
 * follow the profile and horizontal rings.
 *
 * Evidence
 * - OSM way/770633250 "Aspire Tower" (height 318, 36 levels): a circle
 *   70 m across — the foot of the skirt.
 * - Published (Wikipedia "Aspire Tower"; CTBUH): 300 m, completed 2007 for
 *   the 2006 Asian Games; core about 18 m across.
 *   OSM's 318 is not used; the published 300 m is.
 * - Photos (EVIDENCE):
 *   ianmunroe, "Torch." (CC BY 2.0) — the whole tower face on from Al Waab
 *     Street, little perspective: the profile, pods, sphere, cup and flame
 *     bowl; https://www.flickr.com/photos/ianmunroe/3383344007 (live.staticflickr.com/3625/3383344007_19e03877b5_b.jpg)
 *   Nayaab Shaikh, "Aspire tower" (CC BY 2.0) — the slanted rim of the cup;
 *     live.staticflickr.com/2643/4120231826_8b39f0ed39_b.jpg
 *   Doha Stadium Plus, "ASPIRE Tower" (CC BY 2.0) — with the stadium:
 *     live.staticflickr.com/6219/6376487897_525744dffa_b.jpg
 *   jikatu, "The Torch Doha" (CC BY-SA 2.0) — night, lit gold:
 *     live.staticflickr.com/8477/8172078593_4b800f856d_b.jpg
 *   nasimo87, "THE TORCH DOHA" (CC BY 2.0) — the net against the sky:
 *     live.staticflickr.com/65535/53953578041_6f79ac8319_b.jpg
 *
 * Profile (measured in ianmunroe's photo, 0.42 m a pixel at 300 m): radius
 * 35 m at the foot (= OSM), 30 at 21 m, 20.4 at 73 m, 16.4 at 99 m, the
 * waist 13.7 at 175 m, 15.8 at 221, 17 at 251, the cup flaring to 20 m at
 * its rim, which slants from 246 m on the south side to 300 m on the north
 * (Shaikh's photo from Aspire Park, west, shows the high side to the north). Pods: glazed
 * drums 14 m tall every ~24 m from 105 to 242 m (bands in the photo); the
 * lower skirt is filled to 95 m by the glazed body under the net. The
 * sphere: 14 m across, at 95 m, on the east-south-east side (ianmunroe's
 * photo, taken from Al Waab Street to the south, shows it on the right; the
 * exact bearing, 121°, is estimated).
 * Colour: the net and pods read warm grey under haze (#7b796d backlit);
 * drawn steel #b3aa95, glazing warm grey #7f7c74, the core concrete #e6e0d4, the flame
 * bowl white.
 *
 * Doubts: the sphere's exact bearing; the pods' exact count and heights; the net
 * is drawn at about half the real member density (STYLE: thin members).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, tube, writeModel, type Mat } from './doha-museum-of-islamic-art'

const ANCHOR = { lng: 51.444744, lat: 25.2625125 }
const PROFILE: [number, number][] = [[0, 35], [21, 30], [45, 24.6], [73, 20.4], [99, 16.4], [130, 14.8], [175, 13.7], [221, 15.8], [251, 17], [263, 18.6], [280, 19.6], [300, 20.2]]
function R(h: number) {
  for (let i = 0; i + 1 < PROFILE.length; i++) {
    const [h0, r0] = PROFILE[i], [h1, r1] = PROFILE[i + 1]
    if (h <= h1) { const t = (h - h0) / (h1 - h0); return r0 + (r1 - r0) * t }
  }
  return PROFILE[PROFILE.length - 1][1]
}
/** Top of the net at angle a: the cup's rim slants from 246 m (south) to 300 m (north). */
const rimZ = (a: number) => 273 + 27 * Math.cos(a - Math.PI / 2)

function build(detail: boolean): Mat[] {
  const steel = new Part(), glass = new Part(), core = new Part(), white = new Part()
  const SEG = detail ? 24 : 14

  // the core
  lathe(core, 0, 0, [[9, 0], [9, 250], [0, 250]], detail ? 20 : 12, true)
  // the glazed body inside the skirt, to 95 m
  const body: [number, number][] = []
  for (let h = 0; h <= 95; h += detail ? 5 : 12) body.push([R(h) - 1.6, h])
  body.push([9.5, 97])
  lathe(glass, 0, 0, body, SEG, true)
  // the pods: glazed drums with their floor and roof slabs
  for (let h = 105; h < 230; h += 24.5) {
    const r = R(h + 7) - 1.5
    lathe(glass, 0, 0, [[r, h + 1], [r, h + 13]], SEG, true)
    lathe(core, 0, 0, [[0, h], [r + 0.6, h], [r + 0.6, h + 1], [r + 0.3, h + 1]], SEG, true)
    lathe(core, 0, 0, [[r + 0.3, h + 13], [r + 0.6, h + 13], [r + 0.6, h + 14], [0, h + 14]], SEG, true)
  }
  // the cup's floor and the white flame bowl rising out of it
  lathe(core, 0, 0, [[0, 249], [16.2, 249], [16.2, 250.5], [0, 250.5]], SEG, true)
  lathe(white, 0, 0, [[2.5, 250.5], [4.5, 259], [7, 270], [7.4, 273], [6.2, 274], [0, 274]], detail ? 16 : 10, true)
  // the sphere
  {
    const a = (Math.PI / 180) * (90 - 121), d = R(95) + 2, cx = d * Math.cos(a), cy = d * Math.sin(a)
    const prof: [number, number][] = []
    const n = detail ? 10 : 6
    for (let k = 0; k <= n; k++) { const t = -Math.PI / 2 + (Math.PI * k) / n; prof.push([Math.max(0, 7 * Math.cos(t)), 95 + 7 * Math.sin(t)]) }
    lathe(glass, cx, cy, prof, detail ? 16 : 10, true)
  }

  // the net: meridian ribs following the profile out to the cup's slanted rim…
  const ribs = detail ? 32 : 16, rr = detail ? 0.45 : 0.7, sides = detail ? 6 : 3
  const out = 0.6 // the net stands this far outside the pods
  for (let i = 0; i < ribs; i++) {
    const a = (2 * Math.PI * i) / ribs, top = rimZ(a)
    const pts: V3[] = []
    const steps = detail ? 40 : 18
    for (let k = 0; k <= steps; k++) { const h = (top * k) / steps; const r = R(h) + out; pts.push([r * Math.cos(a), r * Math.sin(a), Math.max(h, rr)]) }
    tube(steel, pts, rr, sides)
  }
  // …and horizontal rings, closer together low down where the skirt is dense
  const rings: number[] = []
  for (let h = 1; h < 95; h += detail ? 6 : 12) rings.push(h)
  for (let h = 99; h < 290; h += detail ? 12 : 24.5) rings.push(h)
  const around = detail ? 48 : 24
  for (const h of rings) {
    // only the part of a ring under the cup's slanted rim
    const r = R(h) + out
    let run: V3[] = []
    for (let k = 0; k <= around; k++) {
      const a = (2 * Math.PI * k) / around
      if (rimZ(a) > h + 1) run.push([r * Math.cos(a), r * Math.sin(a), h])
      else { if (run.length > 1) tube(steel, run, rr, sides); run = [] }
    }
    if (run.length > 1) tube(steel, run, rr, sides)
  }
  // the cup's rim: a ring that follows the slant
  {
    const pts: V3[] = []
    for (let k = 0; k <= around; k++) { const a = (2 * Math.PI * k) / around, r = R(rimZ(a)) + out; pts.push([r * Math.cos(a), r * Math.sin(a), rimZ(a)]) }
    tube(steel, pts, rr * 1.6, sides)
  }

  return [
    { part: steel, material: { ...finish('aspire-steel', 0xb3aa95, 0.5), floodlight: () => 0.6 } },
    { part: glass, material: { ...PALETTE.window, color: 0x7f7c74 } },
    { part: core, material: finish('aspire-concrete', 0xe6e0d4) },
    { part: white, material: { ...finish('neon-aspire-flame', 0xf2efe6, 0.6) } },
  ]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0, height: 300 }
  await writeModel('doha-aspire-tower.glb', 'Aspire Tower', build(false), 6500, 250 * 1024, extras)
  await writeModel('doha-aspire-tower.detail.glb', 'Aspire Tower', build(true), 40000, 1536 * 1024, extras)
}
