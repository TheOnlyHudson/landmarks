/**
 * Inscope Arch, Central Park, under East Drive near the Pond (Calvert Vaux
 * and Jacob Wrey Mould, 1875) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-inscope-arch.ts
 *
 * Built with the arch kit in generators/nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): x across the path (bearing 156°, along East
 * Drive), y along the path through the arch (bearing 66°: the placement's
 * bearing), z up, metres; z = 0 is the path. Anchor: the middle of OSM
 * way/427087524 (footway, tunnel=yes, "Inscope Arch"). No bridge outline or
 * building is mapped here, so `replaces` is empty.
 *
 * Evidence
 * - OSM (ODbL): the path through way/427087524, 30.2 m long (East Drive,
 *   its parallel carriageway and the bridle path all pass over it).
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-inscope-arch/photos):
 *   Jim.henderson, "Inscope Arch E62 gloomy jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Inscope_Arch_E62_gloomy_jeh.jpg
 *     (the portal square on, people for scale: every proportion below);
 *   Diego Torres Silvestre, "Inscope Arch (161072974).jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Inscope_Arch_(161072974).jpg
 *     (the same portal at night: the lit tunnel);
 *   bikesharedude, "Inscope Arch (Central Park) after snow", public domain,
 *     https://commons.wikimedia.org/wiki/File:Inscope_Arch_(Central_Park)_after_snow_-_Flickr_id_40249839424.jpg
 *     (the other portal from inside: grey granite voussoirs and jambs, brick
 *     lining).
 * - Estimated from the square-on photo, scaled by the people at the mouth
 *   (~1.75 m): a semicircular arch 4.0 m wide springing at 1.3 m from grey
 *   granite jambs with impost blocks, voussoirs 0.85 m deep; a spandrel of
 *   pink (rose) granite ashlar 10.8 m wide whose top is a segmental arc
 *   from 3.5 m at the ends to 5.1 m at the crown, under a moulded coping
 *   0.8 m deep. The hillside covers the rest; nothing stands on top.
 * - Published (Central Park Conservancy): rose granite and grey granite
 *   facing, brick-lined, one of the longest of the park's arches.
 *
 * The tunnel's lining is lit warm at night in the photos; it is drawn in
 * brick, unlit (the model has no `window`/`lamp` surfaces).
 *
 * Review: only 3 m of barrel and infill are drawn behind each portal (the
 * terrain covers the middle); the infill top is a neutral roadbed grey.
 *
 * Doubts: dimensions are photo-scaled (no lidar or published span); the
 * second portal is drawn as a mirror of the first; the infill over the
 * barrel stops at 3.7 m and is assumed to sit under the hill.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archBlock, band, steps } from './nyc-greyshot-arch'

const pink = new Part(), bed = new Part(), grey = new Part(), brick = new Part()
const D = 30.2, half = D / 2, W = 5.4, A = 2.0, SPRING = 1.3
const CROWN = 5.1, END = 3.5
const RT = (W * W + (CROWN - END) ** 2) / (2 * (CROWN - END))
const top = (x: number) => CROWN - RT + Math.sqrt(RT * RT - x * x)
const xsTop = steps(-W, W, 16)

archBlock({ D, W, top, fill: 3.7, F: A + 0.9, t: 1.0, kind: 'ellipse', a: A, rise: A, spring: SPRING, ring: 0.85, proud: 0.08, jambs: true, xsTop, n: 14, portal: 3 },
  { face: pink, ring: grey, barrel: brick, fill: bed })

for (const s of [-1, 1]) {
  // the coping following the arc of the wall top, a little wider than it
  const xc = steps(-W - 0.2, W + 0.2, 18)
  band(grey, s, half, 0.3, xc, (x) => top(Math.max(-W, Math.min(W, x))) - 0.7, (x) => top(Math.max(-W, Math.min(W, x))) + 0.1)
  // impost blocks at the springing, and a plinth course
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -(A + 1.05) : A - 0.1, x1 = sx < 0 ? -(A - 0.1) : A + 1.05
    band(grey, s, half, 0.16, [x0, x1], () => SPRING - 0.3, () => SPRING)
    band(grey, s, half, 0.05, sx < 0 ? [-W, -(A + 0.85)] : [A + 0.85, W], () => 0, () => 0.35)
  }
}

finishModel('Inscope Arch', 'nyc-inscope-arch', [
  { part: bed, material: { name: 'roadbed', color: 0xa9a7a1, roughness: 0.95 } },
  { part: pink, material: { name: 'rose-granite', color: 0xc29d8c, roughness: 0.9 } },
  { part: grey, material: { name: 'granite', color: 0xaeaca6, roughness: 0.85 } },
  { part: brick, material: { name: 'brick', color: 0xa2654f, roughness: 0.9 } },
], { bearing: 66, height: CROWN + 0.1 }, 5000)
