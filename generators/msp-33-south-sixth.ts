/**
 * 33 South Sixth (Multifoods Tower, 1983, Skidmore, Owings & Merrill),
 * Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-33-south-sixth.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 31°). Origin at the anchor, the area centroid of
 * the OSM outline way/27346721 (-93.2728110, 44.9781208), on the lowest
 * ground under it.
 *
 * Form: a plain, flat-topped slab, 66 x 38 m, of beige precast panels with a
 * dense grid of punched windows, to 197 m; a two-storey band of dark louvre
 * slots runs round the top, and a penthouse stands in the middle of the
 * roof. Not glass: the "silver-blue glass, angled crown" in the brief does
 * not match any photo of this building (it fits its neighbours, such as the
 * Marriott City Center's dark glass wedge).
 *
 * City Center: the mall podium is its own OSM building (way/27346720,
 * "City Center") around and under the tower's west side and is not part of
 * this model; the tower is drawn from the ground within its own outline.
 *
 * Sources
 * - OSM: outline way/27346721 (height 204, 52 levels).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022; the
 *   tower top is high-noise class 18 in this dataset, read with it kept):
 *   the slab's plan (66 x 38 m, matching OSM), roof 195-200 m, penthouse
 *   200-205 m over 26 x 14 m in the middle; the podium round it 15-40 m.
 * - Published: 204 m (668 ft), 52 storeys, 1983 (Wikipedia, "33 South Sixth").
 * - Photos (Wikimedia Commons, evidence):
 *   AlexiusHoratius, "33 South Sixth Minneapolis 1.jpg", CC BY-SA 3.0 (from
 *     the south-west, over the Orpheum on Hennepin): colour, window grid,
 *     louvre band, flat top.
 *     https://commons.wikimedia.org/wiki/File:33_South_Sixth_Minneapolis_1.jpg
 *   Greg Gjerdingen, "Downtown Minneapolis (9139807920).jpg", CC BY 2.0
 *     (the tower over the Marriott, from the south-east).
 *     https://commons.wikimedia.org/wiki/File:Downtown_Minneapolis_(9139807920).jpg
 *   AlexiusHoratius, "Marriott Hotel City Center Minneapolis 1.jpg",
 *     CC BY-SA 3.0 (its neighbour, for identity).
 *     https://commons.wikimedia.org/wiki/File:Marriott_Hotel_City_Center_Minneapolis_1.jpg
 *
 * Measured: plan, roof and penthouse heights.
 * Estimated: the window grid, grouped two storeys a panel (3.85 m storeys),
 * 3.3 m bays; the louvre band's depth (2 storeys).
 *
 * Doubts: only the south-west and south-east sides are photographed; the
 * others are assumed the same. The roof is drawn at the lidar's 197 m; the
 * published 204 m includes the penthouse and parapet.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, chamfer, capRing, wallEdge, edgePanels, finishGlb } from './sea-rainier-square-tower'

function build() {
  const wall = new Part(), win = new Part(), roof = new Part(), louvre = new Part()
  const H = 197, PH = 202.5
  const slab: XY[] = chamfer(ccw([[-34.5, -19.2], [31.3, -18.9], [31.3, 19.4], [-34.4, 19.1]]), 0.5)
  for (let i = 0; i < slab.length; i++) {
    wallEdge(wall, slab, i, 0, H)
    // the punched-window grid, two storeys a panel, under the louvre band
    edgePanels(win, slab, i, 0, H - 8.6, { group: 2 * 3.85, spandrel: 2.6, pier: 1.5, bayW: 3.3, head: 0.4, foot: 4.5, inset: 1.2 }, false)
    // the louvre band: tall dark slots, one per two bays
    edgePanels(louvre, slab, i, H - 7.9, H, { group: 7.9, spandrel: 0.0, pier: 2.6, bayW: 4.4, head: 1.2, foot: 0.4, inset: 1.6 }, false)
  }
  capRing(roof, slab, H)
  // parapet coping, just proud
  { const o = chamfer(ccw([[-34.75, -19.45], [31.55, -19.15], [31.55, 19.65], [-34.65, 19.35]]), 0.5)
    for (let i = 0; i < o.length; i++) wallEdge(wall, o, i, H - 0.9, H + 0.3)
    capRing(wall, o, H + 0.3) }
  // the penthouse
  const ph: XY[] = chamfer(ccw([[-14.6, -7], [11.4, -7], [11.4, 7], [-14.6, 7]]), 0.4)
  for (let i = 0; i < ph.length; i++) wallEdge(wall, ph, i, H, PH)
  capRing(roof, ph, PH)

  return finishGlb('msp-33-south-sixth', '33 South Sixth', [
    { part: wall, material: finish('s6-precast', 0xdccab6) },
    { part: win, material: { ...PALETTE.window, color: 0x5f6f7f } },
    { part: louvre, material: finish('s6-louvre', 0x7e7d79) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 31, height: PH, replaces: ['way/27346721'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-33-south-sixth.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
