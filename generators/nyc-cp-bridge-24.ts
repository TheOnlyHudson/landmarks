/**
 * Bridge No. 24, Central Park, over the bridle path by the Reservoir's
 * south-east corner (Calvert Vaux and Jacob Wrey Mould, about 1864) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-cp-bridge-24.ts
 *
 * Frame (mesh.ts map frame): x along the bridge (bearing 29.9°, NNE), y
 * across it (the placement's bearing, 299.9°, along the bridle path below),
 * z up, metres; z = 0 is the bridle path under the span. Anchor: the middle
 * of OSM way/387346301 (footway, bridge=yes, surface=wood, "Bridge No. 24"),
 * 17.1 m end to end. OSM maps no man_made=bridge outline or building here,
 * so `replaces` is empty. The walkway is the model's (a footbridge).
 *
 * Evidence
 * - OSM (ODbL): the footway on the bridge way/387346301.
 * - Map terrain (Mapterhorn z15, `bun tools/terrain.ts grid`, bearing 299.9):
 *   the bridle path under the span at 0–0.2 m, the banks 3–3.5 m up 10 m
 *   out on both sides.
 * - HAER NY-192 (Library of Congress, public domain), "Central Park
 *   Bridges, Bridge No. 24":
 *   "View looking north", https://commons.wikimedia.org/wiki/File:View_looking_north_-_Central_Park_Bridges,_Bridge_No._24,_Central_Park,_Southwest_of_Reservoir,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,153E-1.tif
 *   "View looking north, closer up", https://commons.wikimedia.org/wiki/File:View_looking_north,_closer_up_-_Central_Park_Bridges,_Bridge_No._24,_Central_Park,_Southwest_of_Reservoir,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,153E-2.tif
 *   (square-on: the shallow segmental iron arch between rock-faced stone
 *   abutments, the openwork corner spandrels with roundels, the abutments'
 *   curved copings sweeping down into the banks).
 * - Photo: Jim.henderson, "SE Reservoir Bridge 24 CP jeh.jpg", CC0,
 *   https://commons.wikimedia.org/wiki/File:SE_Reservoir_Bridge_24_CP_jeh.jpg
 *   (today's colours: pale grey-green ironwork, the restored looped railing,
 *   grey granite abutments; copy in
 *   landmarks-scratch/nyc-parks-2/work/nyc-cp-bridge-24/photos).
 * - Estimated from that photo, scaled by its span (11.4 m between the abutment faces): railing 1.0 m
 *   (65 px against the 690 px span here, 50 against 655 in HAER 153E-1: 0.08–0.09
 *   of the span), walkway 3.8 m
 *   above the path, fascia 0.55 m, span between the abutment faces 11.4 m, a
 *   segmental arch springing 0.9 m up with its intrados crown at 3.0 m, rib
 *   0.35 m; abutments 2.9 m long to the deck's ends; walkway 4.0 m wide.
 *
 * Simplified: the spandrels' scrolls are a dark panel with one cream roundel
 * in each corner; the railing's loops are a band with a row of dark
 * openings; the abutments' rock-faced coursing is plain.
 *
 * Doubts: dimensions are photo-scaled; HAER's drawings weren't found
 * online, and no lidar was read. The HAER caption's "southwest of
 * Reservoir" is HAER's own location label; OSM, the Conservancy and the
 * Commons category put No. 24 at the south-east, and the photos match it.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { box, profile, qn, steps } from './nyc-greyshot-arch'
import { curveBand, flatStrip, ironRailing, strip } from './nyc-gothic-bridge'

const paint = new Part(), dark = new Part(), stone = new Part(), wood = new Part()
const HALF = 8.6, DECK_MID = 3.8, DECK_END = 3.7, RAIL = 1.0, FASCIA = 0.55
const deck = (x: number) => DECK_END + (DECK_MID - DECK_END) * (1 - (x / HALF) ** 2)
const FB = (x: number) => deck(x) - FASCIA
const A = 5.7, SPRING = 0.9, RISE = 2.1, RIB = 0.35
const FY = 2.3, PY = 2.2, HW = 2.0, FF = 2.36, SW = 2.9 // rib face, panel, railing, fascia face, stone face

const pr = profile('segment', A, RISE, SPRING, 16)
const Rc = (A * A + RISE * RISE) / (2 * RISE), ZC = SPRING + RISE - Rc
const nrm = pr.map(([x, z]): [number, number] => [x / Rc, (z - ZC) / Rc])
const outer = pr.map(([x, z], i): [number, number] => [x + nrm[i][0] * RIB, z + nrm[i][1] * RIB])
const intr = (x: number) => ZC + Math.sqrt(Rc * Rc - x * x)
const M = steps(-A, A, 16), all = steps(-HALF, HALF, 16)

/** A flat n-gon disc on y = yy facing ny. */
function disc(p: Part, x: number, yy: number, z: number, r: number, ny: number, n = 12) {
  for (let k = 0; k < n; k++) {
    const t0 = (2 * Math.PI * k) / n, t1 = (2 * Math.PI * (k + 1)) / n
    const b: [number, number, number] = [x + r * Math.cos(t0), yy, z + r * Math.sin(t0)], c: [number, number, number] = [x + r * Math.cos(t1), yy, z + r * Math.sin(t1)]
    if (ny > 0) p.tri([x, yy, z], c, b); else p.tri([x, yy, z], b, c)
  }
}

for (const s of [-1, 1]) {
  // the spandrels' openwork behind the rib, and the rib
  strip(dark, s, PY, M, intr, FB)
  curveBand(paint, s, PY, FY, pr, outer)
  // the iron posts standing on the abutments at the arch's ends
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -A - 0.15 : A - 0.2, x1 = sx < 0 ? -A + 0.2 : A + 0.15
    box(paint, x0, x1, s < 0 ? -FY : PY, s < 0 ? -PY : FY, SPRING - 0.1, FB(A))
    // a roundel in each corner spandrel
    disc(paint, sx * 4.75, s * (PY + 0.04), FB(4.75) - 0.5, 0.42, s)
    disc(dark, sx * 4.75, s * (PY + 0.06), FB(4.75) - 0.5, 0.26, s)
  }
  // the fascia, with a moulding at its top
  strip(paint, s, FF, all, FB, deck)
  flatStrip(paint, s, PY, FF, all, FB, false)
  flatStrip(paint, s, HW, FF + 0.07, all, deck, true)
  strip(paint, s, FF + 0.07, all, (x) => deck(x) - 0.16, deck)
  flatStrip(paint, s, FF, FF + 0.07, all, (x) => deck(x) - 0.16, false)
}
// the soffit under the arch, across the width
for (let i = 0; i + 1 < pr.length; i++) {
  const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
  qn(dark, [x0, -PY, z0], [x1, -PY, z1], [x1, PY, z1], [x0, PY, z0], [-(nrm[i][0] + nrm[i + 1][0]), 0, -(nrm[i][1] + nrm[i + 1][1])])
}
// the walkway and the deck's end faces
flatStrip(wood, 1, -HW, HW, all, deck, true)
for (const sx of [-1, 1]) {
  const x = sx * HALF
  qn(paint, [x, -FF, FB(x)], [x, FF, FB(x)], [x, FF, deck(x)], [x, -FF, deck(x)], [sx, 0, 0])
}
// the stone abutments: from the arch's springing out to the deck's ends,
// up to the fascia, with curved wing walls sweeping down into the banks
for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -HALF : A, x1 = sx < 0 ? -A : HALF
  box(stone, x0, x1, -SW, SW, 0, FB(HALF) - 0.02)
  const ws = steps(0, 1, 6).map((u) => sx * (HALF + 1.5 * u))
  const top = (x: number) => {
    const u = (Math.abs(x) - HALF) / 1.5
    return 2.6 + (FB(HALF) + 0.25 - 2.6) * Math.sqrt(Math.max(0, 1 - u * u))
  }
  const xs = sx < 0 ? ws.slice().reverse() : ws
  for (const s of [-1, 1]) {
    strip(stone, s, SW, xs, () => 0, top)
    strip(stone, s, SW - 0.7, xs, () => 0, top, -1)
    flatStrip(stone, s, SW - 0.7, SW + 0.08, xs, top, true)
    const xe = sx * (HALF + 1.5)
    qn(stone, [xe, s * (SW - 0.7), 0], [xe, s * SW, 0], [xe, s * SW, top(xe)], [xe, s * (SW - 0.7), top(xe)], [sx, 0, 0])
  }
}
const posts = [-HALF + 0.15, -A, -2.85, 0, 2.85, A, HALF - 0.15]
ironRailing(paint, dark, { half: HALF, hw: HW, deck, height: RAIL, posts, pitch: 0.62, r: 0.3 })

finishModel('Bridge No. 24', 'nyc-cp-bridge-24', [
  { part: paint, material: { name: 'cast-iron-grey', color: 0xbcc0b4, roughness: 0.7 } },
  { part: dark, material: { name: 'openwork', color: 0x7f8279, roughness: 0.9 } },
  { part: stone, material: { name: 'stone', color: 0x948f85, roughness: 0.9 } },
  { part: wood, material: { name: 'walkway', color: 0x9a8670, roughness: 0.9 } },
], { bearing: 299.9, height: DECK_MID + RAIL + 0.36 }, 5000)
