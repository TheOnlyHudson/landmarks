/**
 * Indianapolis Union Station (head house 1886-1888, Thomas Rodd; train shed
 * 1915-1922), 39 Jackson Place, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-union-station.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin (the
 * anchor) is (-86.16009, 39.76258), near the outline's centroid on the
 * train shed; OSM draws the head house and the
 * shed as one outline (way/340480894, building=train_station), so both are
 * modelled: the head house on Jackson Place (x 20.3..65.6, y 31..78.4), its
 * wheel-window gable facing north and the clock tower on its north-west
 * corner, and the long elevated train shed behind it (x -142..141,
 * y -61..31), with Illinois Street passing under it at x -10..2.
 *
 * z = 0 is the street (lidar ground_min + 1.2 m; the site is flat).
 *
 * Identity (photos below): Richardsonian Romanesque in red brick on a rough
 * pink-grey granite base; the big wheel window in a granite arch in the
 * central gable; rows of round-arched windows; the square clock tower
 * (clock faces, belfry louvres, corner turrets, a steep slate pyramid);
 * a steep pyramid-roofed east pavilion with round corner turrets; the
 * dark slate roofs; the long pale marquee across the front.
 *
 * Heights: lidar (USGS_LPC_IN_Central_MarionCo_2016_LAS_2018, flown 2016,
 *   1 m grid): tower top 55.3; head house ridge 26.5-27, eaves 21-22;
 *   marquee 4-5; shed roof 12.5 with monitor ridges at 14.5 every ~8 m, the
 *   south bay's roof 15.8. Photo-scaled from the north front (lemay-c3,
 *   against the 45.3 m OSM width): wheel window centre 13.5 m, radius 3.0,
 *   granite arch radius 5.7; belfry cornice 36.5, clock stage 40-49; east
 *   pavilion eaves 20.5, apex 25.6; window rows.
 * Estimated: the roof's hips and cross gables (lidar shows a N-S ridge over
 *   the hall), the east and south sides of the head house, the shed's
 *   window bays, the underpass opening (Illinois St, NAIP).
 *
 * Sources
 * - OSM (ODbL): way/340480894 (building=train_station, head house + shed).
 * - USGS NAIP orthophoto (public domain): the plan, the grey shed roof with
 *   its red monitor stripes and red south bay, the dark head-house roof.
 * - Photos (Wikimedia Commons):
 *   "Head House, Indianapolis Union Station, Louisiana Street and Illinois
 *   Street, Indianapolis, IN.jpg" and "... IN - 54378416643.jpg" (w_lemay,
 *   CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Head_House,_Indianapolis_Union_Station,_Louisiana_Street_and_Illinois_Street,_Indianapolis,_IN.jpg
 *   and https://commons.wikimedia.org/wiki/File:Head_House,_Indianapolis_Union_Station,_Louisiana_Street_and_Illinois_Street,_Indianapolis,_IN_-_54378416643.jpg),
 *   the north front head on;
 *   "Indianapolis Union Railroad Station.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Union_Railroad_Station.jpg),
 *   the front and the west side from the north-west;
 *   "Train Shed, Indianapolis Union Station, Louisiana Street and Illinois
 *   Street, Indianapolis, IN.jpg" (w_lemay, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Train_Shed,_Indianapolis_Union_Station,_Louisiana_Street_and_Illinois_Street,_Indianapolis,_IN.jpg),
 *   the shed's buff-brick north wall east of the head house.
 * Left out: the granite arcade detail, the carved gable panel, chimneys,
 *   the glass canopies along the shed's north wall, the tracks.
 * Night: the brick and granite of the head house and tower are floodlit;
 *   windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, flatShape, extrudeShape, archShape, archBand, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { poly, gable, spire, drum, ringOnFace, bar, lit } from './indy-st-john-the-evangelist'

const brick = new Part(), granite = new Part(), slate = new Part(), buff = new Part(), pale = new Part(), win = new Part()

// ---------------------------------------------------------------- the head house
const X0 = 20.3, X1 = 65.6, YB = 31.0, YF = 78.4
const EAVE = 20.5, RIDGE = 26.8
const TX0 = X0, TX1 = 28.9, TY0 = 69.8 // the tower
const PX0 = 56.0 // the east pavilion
const GX0 = 34.5, GX1 = 52.5, GC = (GX0 + GX1) / 2 // the wheel-window gable

// walls, on a granite base course
prism(granite, null, rect(X0 - 0.2, YB, X1 + 0.2, YF + 0.2), 0, 3.0)
prism(brick, null, rect(X0, YB, X1, YF), 3.0, EAVE)
prism(granite, null, rect(X0 - 0.15, YB, X1 + 0.15, YF + 0.15), EAVE - 0.6, EAVE)
// the main roof: a hip over the hall, ridge north-south
{
  const z = EAVE, o = 0.5
  const a: V3 = [X0 - o, YB, z], b: V3 = [X1 + o, YB, z], c: V3 = [X1 + o, YF + o, z], d: V3 = [X0 - o, YF + o, z]
  const r0: V3 = [(X0 + X1) / 2, YB + 6, RIDGE], r1: V3 = [(X0 + X1) / 2, YF - 6, RIDGE]
  poly(slate, [a, b, r0], [0, -1, 1])
  poly(slate, [b, c, r1, r0], [1, 0, 1])
  poly(slate, [c, d, r1], [0, 1, 1])
  poly(slate, [d, a, r0, r1], [-1, 0, 1])
  poly(slate, [a, d, c, b], [0, 0, -1])
}
// the wheel-window gable: a cross gable running back from the front
gable(brick, slate, GC, YF - 7, 14.4, GX1 - GX0, 90, EAVE, 28.0, 0.4, [false, true])
prism(brick, null, rect(GX0, YF - 0.6, GX1, YF + 0.6), 3.0, EAVE)
// turrets flanking the gable
for (const x of [GX0, GX1]) {
  drum(brick, null, x, YF + 0.4, 1.0, 3.0, EAVE + 1.5, 8, 22.5)
  spire(slate, x, YF + 0.4, 1.15, EAVE + 1.5, EAVE + 4.5, 8, 22.5)
}
// the east pavilion: a steep pyramid with round corner turrets
{
  const py0 = YF - 10
  prism(brick, null, rect(PX0, py0, X1 + 0.3, YF + 0.3), 3.0, EAVE)
  const cx = (PX0 + X1 + 0.3) / 2, cy = (py0 + YF + 0.3) / 2
  const hw = (X1 + 0.3 - PX0) / 2 + 0.4, hd = (YF + 0.3 - py0) / 2 + 0.4
  const ap: V3 = [cx, cy, 30.5]
  const cs: V3[] = [[cx - hw, cy - hd, EAVE], [cx + hw, cy - hd, EAVE], [cx + hw, cy + hd, EAVE], [cx - hw, cy + hd, EAVE]]
  for (let i = 0; i < 4; i++) poly(slate, [cs[i], cs[(i + 1) % 4], ap], [(cs[i][0] + cs[(i + 1) % 4][0]) / 2 - cx, (cs[i][1] + cs[(i + 1) % 4][1]) / 2 - cy, 1])
  for (const [x, y] of [[PX0, YF + 0.3], [X1 + 0.3, YF + 0.3], [X1 + 0.3, py0]]) {
    drum(brick, null, x, y, 1.4, 3.0, EAVE + 1.0, 8, 22.5)
    spire(slate, x, y, 1.6, EAVE + 1.0, EAVE + 5.2, 8, 22.5)
  }
}

// north front windows
{
  const f: Face = { o: [GC, YF + 0.6, 0], n: [0, 1] }
  // the wheel window in its granite arch
  extrudeShape(granite, f, archBand(0, 13.5, 3.3, 5.7, 7.5, 14), 0, 0.25)
  flatShape(win, f, arc(0, 13.5, 3.3, 0, 360, 18).slice(0, -1), 0.08)
  ringOnFace(granite, f, 0, 13.5, 1.0, 1.4, 10, 0.12)
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    bar(granite, f, 1.2 * Math.cos(a), 13.5 + 1.2 * Math.sin(a), 3.3 * Math.cos(a), 13.5 + 3.3 * Math.sin(a), 0.22, 0.12)
  }
  flatShape(win, f, rect(-4.5, 7.8, 4.5, 9.6), 0.08)
  // the gable's little window group
  for (const s of [-1.1, 0, 1.1]) flatShape(win, f, archShape(s, 0.8, 22.0, 23.4, 5), 0.08)
}
const front: Face = { o: [0, YF, 0], n: [0, 1] } // s = -x
for (const [xa, xb] of [[TX1 + 0.8, GX0 - 1.2], [GX1 + 1.2, PX0 - 0.6]]) {
  const n = 3, w = (xb - xa) / n
  for (let i = 0; i < n; i++) {
    const xc = xa + w * (i + 0.5)
    flatShape(win, front, archShape(-xc, w * 0.62, 12.6, 14.6, 6), 0.06)
    flatShape(win, front, rect(-xc - w * 0.3, 8.0, -xc + w * 0.3, 10.8), 0.06)
  }
}
{
  const pf: Face = { o: [(PX0 + X1) / 2, YF + 0.3, 0], n: [0, 1] }
  for (const s of [-1.6, 1.6]) {
    flatShape(win, pf, archShape(s, 1.8, 12.6, 14.8, 6), 0.06)
    flatShape(win, pf, rect(s - 0.9, 8.0, s + 0.9, 10.8), 0.06)
  }
  flatShape(win, pf, archShape(0, 4.4, 15.8, 17.4, 6), 0.06)
}
// the side walls: round-arched windows over square ones, in bays
for (const [x, sg] of [[X0, -1], [X1, 1]] as [number, number][]) {
  const f: Face = { o: [x, 0, 0], n: [sg, 0] } // s = y * sg
  for (let y = YB + 4; y < (sg < 0 ? TY0 - 2 : YF - 12); y += 4.4) {
    flatShape(win, f, archShape(y * sg, 2.2, 12.6, 14.6, 6), 0.06)
    flatShape(win, f, rect(y * sg - 1.1, 8.0, y * sg + 1.1, 10.8), 0.06)
    flatShape(win, f, archShape(y * sg, 2.2, 3.4, 5.4, 6), 0.06)
  }
}
// a cross gable on the west (Illinois Street) side
gable(brick, slate, X0 + 4, 52, 14, 8, 0, EAVE, 26.0, 0.4, [true, false])

// the marquee across the front
{
  const y0 = YF, y1 = 83.5, x0 = 27.7 + 1.2, x1 = 59.9
  box(pale, pale, x0, y0, x1, y1, 4.6, 5.8)
  for (const x of [x0 + 0.3, (x0 + x1) / 2 - 6, (x0 + x1) / 2 + 6, x1 - 0.3]) box(granite, null, x - 0.3, y1 - 0.7, x + 0.3, y1 - 0.1, 0, 4.6)
  const f: Face = { o: [0, YF, 0], n: [0, 1] }
  flatShape(win, f, rect(-x1 + 1, 0.4, -x0 - 1, 4.4), 0.06)
}

// the clock tower
{
  const cx = (TX0 + TX1) / 2, cy = (TY0 + YF + 0.6) / 2, H = (TX1 - TX0) / 2
  const x0 = TX0 - 0.4, x1 = TX1 + 0.2, y0 = TY0, y1 = YF + 0.8
  box(granite, null, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, 0, 10.5)
  box(brick, null, x0, y0, x1, y1, 10.5, 36.0)
  box(granite, null, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, 36.0, 36.8)
  box(brick, null, x0 + 0.1, y0 + 0.1, x1 - 0.1, y1 - 0.1, 36.8, 48.4)
  box(granite, slate, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, 48.4, 49.2)
  spire(slate, cx, cy, (H + 0.7) * Math.SQRT2, 49.2, 55.3, 4, 45)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = sx < 0 ? x0 : x1, py = sy < 0 ? y0 : y1
    drum(brick, null, px, py, 0.75, 46.0, 50.8, 8, 22.5)
    spire(slate, px, py, 0.85, 50.8, 53.0, 8, 22.5)
  }
  const faces: Face[] = [
    { o: [cx, y1, 0], n: [0, 1] }, { o: [x1, cy, 0], n: [1, 0] }, { o: [cx, y0, 0], n: [0, -1] }, { o: [x0, cy, 0], n: [-1, 0] },
  ]
  for (const f of faces) {
    // the clock: a pale dial in a granite ring
    ringOnFace(granite, f, 0, 44.6, 1.6, 2.0, 14, 0.1)
    flatShape(pale, f, arc(0, 44.6, 1.6, 0, 360, 14).slice(0, -1), 0.08)
    bar(slate, f, 0, 44.6, 0, 45.8, 0.16, 0.12)
    bar(slate, f, 0, 44.6, 0.9, 44.6, 0.16, 0.12)
    // the belfry louvres
    for (const s of [-2.0, 0, 2.0]) flatShape(win, f, archShape(s, 1.4, 38.0, 41.0, 5), 0.08)
    // slit windows up the shaft
    for (const z of [15, 21, 27]) flatShape(win, f, rect(-0.4, z, 0.4, z + 2.2), 0.06)
    flatShape(win, f, archShape(0, 2.0, 31.0, 33.4, 6), 0.06)
  }
}

// ---------------------------------------------------------------- the train shed
{
  const SX0 = -142.5, SX1 = 141.0, SY0 = -61.0, SY1 = 31.0, H = 12.3
  const UX0 = -10.0, UX1 = 2.0, UZ = 5.5 // the Illinois Street underpass
  for (const [a, b] of [[SX0, UX0], [UX1, SX1]]) prism(buff, null, rect(a, SY0, b, SY1), 0, H)
  prism(buff, null, rect(UX0, SY0, UX1, SY1), UZ, H)
  poly(pale, [[UX0, SY0, UZ], [UX1, SY0, UZ], [UX1, SY1, UZ], [UX0, SY1, UZ]], [0, 0, -1])
  // the cornice and the roof plate
  prism(pale, pale, rect(SX0 - 0.3, SY0 - 0.3, SX1 + 0.3, SY1 + 0.3), H, H + 0.4)
  // the monitor ridges every 8 m (pale, with thin red-brown glazing lines in NAIP), and the higher red south bay
  for (let y = SY1 - 6; y > -42; y -= 8.2) gable(null, pale, (SX0 + SX1) / 2, y, SX1 - SX0 - 2, 2.6, 0, H + 0.4, H + 2.1, 0.1)
  prism(buff, null, rect(SX0 + 1, -59.5, SX1 - 1, -44.5), H + 0.4, 14.5)
  gable(null, brick, (SX0 + SX1) / 2, -52, SX1 - SX0 - 1, 16.4, 0, 14.5, 15.8, 0.3)
  // window bays: grouped panels on the long walls and ends
  for (const [y, sg] of [[SY1, 1], [SY0, -1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sg] }
    for (let x = SX0 + 6; x < SX1 - 4; x += 9) {
      if (x > UX0 - 3 && x < UX1 + 3) continue
      if (sg > 0 && x > X0 - 2 && x < X1 + 2) continue
      const s = -x * sg
      flatShape(win, f, rect(s - 3.0, 6.6, s + 3.0, 10.6), 0.06)
      flatShape(win, f, rect(s - 3.0, 1.2, s + 3.0, 4.4), 0.06)
    }
  }
  for (const [x, sg] of [[SX0, -1], [SX1, 1]] as [number, number][]) {
    const f: Face = { o: [x, 0, 0], n: [sg, 0] }
    for (let y = SY0 + 6; y < SY1 - 4; y += 9) flatShape(win, f, rect(y * sg - 3, 6.6, y * sg + 3, 10.6), 0.06)
  }
  // the arched centre bay of the shed's north wall east of the head house (photo)
  const nf: Face = { o: [0, SY1, 0], n: [0, 1] }
  extrudeShape(buff, nf, rect(-98, 0, -88, H + 1.2), 0, 0.5)
  flatShape(win, { o: [0, SY1 + 0.5, 0], n: [0, 1] }, archShape(-93, 6, 6.5, 9.0, 8), 0.06)
}

const brickM = { ...finish('indy-us-brick', 0xb05e48), floodlight: (p: V3, n: V3) => (p[1] > 30 ? lit(p, n) : 0) }
const graniteM = { ...finish('indy-us-granite', 0xc2aa9c), floodlight: (p: V3, n: V3) => (p[1] > 30 ? lit(p, n) : 0) }
const built = finishGlb('Indianapolis Union Station', [
  { part: brick, material: brickM },
  { part: granite, material: graniteM },
  { part: slate, material: finish('indy-us-slate', 0x7f838b) },
  { part: buff, material: finish('indy-us-buff', 0xd9c7a3) },
  { part: pale, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { bearing: 0, height: 55.3, replaces: ['way/340480894'] }, 5000)
await writeModel('indy-union-station', built)
