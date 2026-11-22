/**
 * Multnomah Falls Lodge (1925, A.E. Doyle), Columbia River Gorge, Oregon:
 * procedural, CC0-1.0, no textures.
 * bun generators/pdx-multnomah-falls-lodge.ts
 *
 * The Cascadian-style lodge at the foot of Multnomah Falls, between the
 * Historic Columbia River Highway and the falls: walls of rough dark basalt
 * laid in pale mortar under big steep roofs of weathered cedar shingle. A
 * long main block runs east-west under a high hipped roof; its east end
 * steps down under a lower hip; at the west end a short wing comes forward
 * to the highway under its own hipped gable; the upper floor's long white
 * dormer bay looks north over the forecourt; two tall stone chimneys stand
 * through the roofs. Behind, toward the falls, the dining room wing runs
 * south under a gabled roof with skylights. Not modelled: the falls, the
 * rock, the forecourt, planters and lamps (the map's or not the lodge).
 *
 * Frame: x east-ish, y north-ish, z up, metres, turned to bearing 348.4
 * (the outline's edges run 348.4 / 78.4), so +x runs along the highway
 * (78.4) and +y toward it (348.4). Origin: the area centroid of OSM
 * way/66744522. z = 0 is the forecourt along the front (Mapterhorn 0.6-1 m
 * over the lowest point in a 30 m box). elevation 0.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/66744522, the outline, which
 *   gives the plan in this frame: the main block x -17.6..14.7,
 *   y -5.2..11.6; the north wing x -12..-4.2 to y 14.5; the dining wing
 *   x -1.5..10.9 to y -18.3. Architect A.E. Doyle, 1925 (OSM tags, the
 *   bronze plaque by the door).
 * - Photos (EVIDENCE):
 *   - Steven Pavlov, "Multnomah Falls Lodge (2017-05-29).jpg", CC BY-SA 4.0,
 *     the north front from the highway: every height below is scaled from
 *     it (the 32 m front); roof shapes, dormer bay, chimneys, colours:
 *     https://commons.wikimedia.org/wiki/File:Multnomah_Falls_Lodge_(2017-05-29).jpg
 *   - Tamanoeconomico, "Multnomah Falls Lodge (Columbia Gorge).jpg",
 *     CC BY-SA 4.0, from the north-east along the highway: the east end's
 *     lower hips, the chimney over the east roof:
 *     https://commons.wikimedia.org/wiki/File:Multnomah_Falls_Lodge_(Columbia_Gorge).jpg
 *   - Ian Poellet, "Multnomah Falls Lodge - Oregon.jpg", CC BY-SA 3.0, from
 *     the north-west with the falls behind: the west wing and its chimney:
 *     https://commons.wikimedia.org/wiki/File:Multnomah_Falls_Lodge_-_Oregon.jpg
 *   - Forest Service Pacific Northwest Region, "Columbia River Gorge NSA-
 *     Multnomah Falls Lodge.jpg" (public domain, US government): the dining
 *     room inside, its glazed roof and tall windows:
 *     https://commons.wikimedia.org/wiki/File:Columbia_River_Gorge_NSA-_Multnomah_Falls_Lodge.jpg
 *
 * Numbers (estimated from the front photo, scaled to the outline)
 * - Main block: eaves 5.0 m, ridge 13.0 m (the slopes about 50 degrees as
 *   photographed); the east step-down eaves 4.0 m, ridge 7.6 m; the north
 *   wing eaves 4.9 m, ridge 10.2 m; the dining wing
 *   eaves 4.6 m, ridge 8.6 m; the chimneys to 14.65 and 14.25 m; the dormer
 *   bay 3.9-6.4 m, 9 m wide.
 * - The dining wing has no photo from outside; its gabled roof and skylight
 *   are drawn from the interior photo.
 * - Colour: basalt and mortar average #7c7a76, pulled to #96938d (kept darker
 *   than the roof, as photographed); shingles silver-brown #a9a191 pulled
 *   to #bbb4a4; white trim.
 *
 * Night: the windows glow; the entrance glows.
 *
 * Doubts
 * - The map's terrain climbs steeply behind the front (5 m at the main
 *   block's back wall, 10 m at the dining wing's end), smoothing the cliff
 *   foot; the real ground behind is probably lower, so the back of the model
 *   sinks further into the terrain than the real building into its slope.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, panel, poly, prism, seg, slabOn, type XY } from './pdx-vista-house'

/** A hipped roof over x0..x1, y0..y1, eaves ze (with overhang ov), ridge zr; hips at 45 degrees in plan. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, ov = 0.5, hipEnds = [true, true]) {
  x0 -= ov; y0 -= ov; x1 += ov; y1 += ov
  const alongX = x1 - x0 >= y1 - y0
  if (!alongX) {
    // swap axes by building in a rotated helper
    const d = (x1 - x0) / 2, xm = (x0 + x1) / 2
    const a = hipEnds[0] ? y0 + d : y0, b = hipEnds[1] ? y1 - d : y1
    const A: V3 = [xm, a, zr], B: V3 = [xm, b, zr]
    poly(p, [[x1, y0, ze], [x1, y1, ze], B, A], [1, 0, 1])
    poly(p, [[x0, y1, ze], [x0, y0, ze], A, B], [-1, 0, 1])
    if (hipEnds[0]) poly(p, [[x0, y0, ze], [x1, y0, ze], A], [0, -1, 1])
    else poly(p, [[x0, y0, ze], [x1, y0, ze], A], [0, -1, 0])
    if (hipEnds[1]) poly(p, [[x1, y1, ze], [x0, y1, ze], B], [0, 1, 1])
    else poly(p, [[x1, y1, ze], [x0, y1, ze], B], [0, 1, 0])
    poly(p, [[x0, y0, ze], [x1, y0, ze], [x1, y1, ze], [x0, y1, ze]], [0, 0, -1])
    return
  }
  const d = (y1 - y0) / 2, ym = (y0 + y1) / 2
  const a = hipEnds[0] ? x0 + d : x0, b = hipEnds[1] ? x1 - d : x1
  const A: V3 = [a, ym, zr], B: V3 = [b, ym, zr]
  poly(p, [[x0, y0, ze], [x1, y0, ze], B, A], [0, -1, 1])
  poly(p, [[x1, y1, ze], [x0, y1, ze], A, B], [0, 1, 1])
  poly(p, [[x1, y0, ze], [x1, y1, ze], B], [1, 0, hipEnds[1] ? 1 : 0])
  poly(p, [[x0, y1, ze], [x0, y0, ze], A], [-1, 0, hipEnds[0] ? 1 : 0])
  poly(p, [[x0, y0, ze], [x1, y0, ze], [x1, y1, ze], [x0, y1, ze]], [0, 0, -1])
}

const stone = new Part(), roof = new Part(), trim = new Part(), win = new Part(), glass = new Part(), door = new Part()

// --- walls (the plan from OSM)
const MX0 = -17.6, MX1 = 14.7, MY0 = -5.2, MY1 = 11.6
const EX = 8.6                                  // where the east end steps down
box(stone, MX0, MY0, EX, MY1, 0, 5.0, 0.15)
box(stone, EX - 0.1, MY0, MX1, MY1, 0, 4.0, 0.15)
box(stone, -12.0, MY1 - 0.5, -4.2, 14.5, 0, 4.9, 0.15)        // north wing
box(stone, -1.5, -18.3, 10.9, MY0 + 0.5, 0, 4.6, 0.15)        // dining wing

// --- roofs
hip(roof, MX0, MY0, EX, MY1, 5.0, 13.0, 0.55)
hip(roof, EX, MY0, MX1, MY1, 4.0, 7.6, 0.5, [false, true])
hip(roof, -12.0, MY1 - 2, -4.2, 14.5, 4.9, 10.2, 0.5, [false, true])
hip(roof, -1.5, -18.3, 10.9, MY0 + 0.5, 4.6, 8.6, 0.45, [false, false])
// The dining wing's gable ends (stone) and its skylight strips.
for (const y of [-18.3 - 0.45]) poly(stone, [[-1.5, y + 0.4, 4.6], [10.9, y + 0.4, 4.6], [4.7, y + 0.4, 8.5]], [0, -1, 0])
{
  const xm = 4.7, half = 6.2 + 0.45, rise = 8.6 - 4.6
  for (const s of [-1, 1]) {
    const P = (u: number, y: number): V3 => [xm + s * half * u, y, 8.6 - rise * u + 0.06]
    poly(glass, [P(0.15, -16.8), P(0.15, -7.0), P(0.6, -7.0), P(0.6, -16.8)], [s, 0, 1.5])
  }
}

// facing +y (north): runs east to west, s measured from the west end x0
const front = (x0: number, x1: number, y: number) => { const g = seg([x1, y], [x0, y]); return { ...g, at: (s: number) => g.at(g.L - s) } }

// --- the upper floor's white dormer bay over the front
{
  const x0 = -3.4, x1 = 5.6, y1 = MY1 + 0.7
  box(trim, x0, MY1 - 2.5, x1, y1, 3.8, 6.4, 0.1)
  box(roof, x0 - 0.25, MY1 - 2.5, x1 + 0.25, y1 + 0.3, 6.4, 6.65, 0)
  const w = front(x0, x1, y1)
  for (const s of [1.6, 4.5, 7.4]) panel(win, w.at(s), w.t, w.n, 2.3, 5.0, 6.1, 0, 0.04)
  for (const s of [1.6, 4.5, 7.4]) panel(stone, w.at(s), w.t, w.n, 2.3, 4.15, 4.85, 0, 0.03) // balustrade panels (shadowed)
}

// --- chimneys: one by the north wing's east side, one through the main roof's back near the east end
box(stone, -4.2, MY1 - 0.6, -2.4, MY1 + 1.0, 0, 14.4, 0.12)
box(stone, -4.35, MY1 - 0.75, -2.25, MY1 + 1.15, 14.4, 14.65, 0.05)
box(stone, 5.6, -1.6, 7.4, 0.2, 4.0, 14.0, 0.12)
box(stone, 5.45, -1.75, 7.55, 0.35, 14.0, 14.25, 0.05)

// --- ground-floor windows and doors
{
  const w = front(-4.2, EX, MY1)
  for (const s of [1.6, 3.3]) panel(win, w.at(s), w.t, w.n, 1.4, 0.9, 2.9, 0, 0.05)
  // the main entrance under the dormer
  panel(trim, w.at(6.2), w.t, w.n, 2.6, 0, 3.2, 0, 0.03)
  panel(door, w.at(6.2), w.t, w.n, 2.0, 0, 2.9, 0, 0.06)
  for (const s of [9.2, 11.0]) panel(win, w.at(s), w.t, w.n, 1.4, 0.9, 2.9, 0, 0.05)
  const e = front(EX, MX1, MY1)
  panel(win, e.at(3.0), e.t, e.n, 3.2, 0.9, 2.7, 0, 0.05)
  const wf = front(-12.0, -4.2, 14.5)
  panel(trim, wf.at(3.9), wf.t, wf.n, 2.8, 0.8, 3.2, 0, 0.03)
  panel(win, wf.at(3.9), wf.t, wf.n, 2.4, 1.0, 3.0, 0, 0.05)
  const ww = front(MX0, -12.0, MY1)
  panel(win, ww.at(2.8), ww.t, ww.n, 2.4, 0.9, 2.9, 0, 0.05)
}
// East and west ends, the dining wing's long sides: tall windows.
{
  const east = seg([MX1, MY0], [MX1, MY1])
  for (const s of [5, 11.5]) panel(win, east.at(s), east.t, east.n, 1.8, 0.9, 2.8, 0, 0.05)
  const west = seg([MX0, MY1], [MX0, MY0])
  for (const s of [4.5, 11.5]) panel(win, west.at(s), west.t, west.n, 1.8, 0.9, 2.9, 0, 0.05)
  const de = seg([10.9, -18.3], [10.9, MY0])
  const dw = seg([-1.5, MY0], [-1.5, -18.3])
  for (const w of [de, dw]) for (let k = 0; k < 4; k++) panel(win, w.at(1.8 + k * 3.0), w.t, w.n, 2.0, 0.8, 3.9, 0, 0.05)
  const back = seg([MX0, MY0], [-1.5, MY0])
  for (const s of [4, 10]) panel(win, back.at(s), back.t, back.n, 1.6, 1.0, 2.8, 0, 0.05)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: stone, material: finish('mfl-basalt', 0x96938d) },
  { part: roof, material: finish('mfl-shingle', 0xbbb4a4) },
  { part: trim, material: finish('mfl-white-trim', 0xeeeae1) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Multnomah Falls Lodge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/66744522, on the forecourt',
  bearing: 348.4, elevation: 0, height: 14.65,
})
await Bun.write(new URL('../models/pdx-multnomah-falls-lodge.glb', import.meta.url), glb)
console.log(`pdx-multnomah-falls-lodge.glb: ${triangles} triangles, ${glb.length} bytes`)
void prism; void slabOn
