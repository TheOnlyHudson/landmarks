/**
 * Sacred Heart Cathedral (now Sacred Heart Church), Raleigh: granite Gothic
 * church, cornerstone 1922, dedicated 1924: procedural, CC0-1.0.
 * bun generators/ral-sacred-heart-cathedral.ts [out.glb]
 *
 * Identity: OSM's wikidata/wikipedia tags (Q7397114) sit on way/47759887,
 * which is the stone four-square rectory north of the church (photo 09 and
 * NAIP: a hipped roof, no cross plan). The church itself is the unnamed
 * WakeGIS way/47776428 at the corner of Hillsborough and McDowell Streets
 * (226 Hillsborough St): NAIP shows its slate gable roof, cross gables and the
 * round corner tower, and every photo matches its plan. The model replaces
 * way/47776428 only; the lead should move the tags in OSM or say so.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 2.5 (the outline's
 * walls). Origin: the area centroid of way/47776428 (-78.6419497, 35.7808214).
 * Plan (OSM, model frame): main body x -6.95 … 6.95, y -12.6 … 13.2; the
 * entrance block x -4.4 … 3.0 out to y -14.3; the octagonal tower x 3.0 … 7.6,
 * y -15.5 … -11.5 (SE corner); cross-gable arms x -9.55 … -6.95, y 0.4 … 10.6
 * (west) and x 6.95 … 9.4, y 0.2 … 8.9 (east). Read with the photos as: a
 * nave x -6.95 … 3.0 (10 m wide) with a lean-to aisle x 3.0 … 6.95 on its
 * east side, crossed by a transept gable at y ~0 … 10.
 *
 * Ground: Mapterhorn z13 (z14/15 missing) falls ~1 m west to east under the
 * footprint; the lowest point (east arm) is y = 0, the façade's ground
 * G = 0.8. Walls run down to 0. Elevation 0.
 *
 * Heights (estimated, no lidar over Wake County, no published figures): from
 * photo 04's side door (taken as 2.1 m) and the stone courses, and photo 02
 * (the façade, near frontal): nave eaves G + 6.8, ridge G + 12.0 (steep,
 * ~50°, as every photo shows); the full-width north block's ridge the same;
 * east transept eaves G + 5.8, ridge G + 10.6; the low west wing eaves
 * G + 3.6, ridge G + 7.4 (photo 01); aisle lean-to G + 3.4 … 6.2; entrance
 * block G + 5.0; round battered tower (radius 2.55 at the foot, 2.2 at the
 * top) to its cornice at G + 12.6, slate cone to G + 19.2, cross to ~G + 21.
 * Tower-to-gable proportions from photos 01, 02, 03 and LeMay 28221488178.
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/ral-sacred-heart-cathedral):
 *  01 "Sacred Heart Cathedral - Raleigh.JPG", Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Sacred_Heart_Cathedral_-_Raleigh.JPG
 *     — façade and west side from the SW: tall round-arched nave windows.
 *  02 "Sacred Heart Cathedral - Raleigh 02.JPG", Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Sacred_Heart_Cathedral_-_Raleigh_02.JPG
 *     — the façade: entrance block, arched door, three round-arched windows.
 *  03 "Sacred Heart Cathedral - Raleigh 03.JPG", Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Sacred_Heart_Cathedral_-_Raleigh_03.JPG
 *     — tower and east side from the SE corner.
 *  04 "Sacred Heart Cathedral - Raleigh 04.JPG", Farragutful, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Sacred_Heart_Cathedral_-_Raleigh_04.JPG
 *     — the north gable, chimney, east transept gable and the aisle.
 *  w  "Sacred Heart Cathedreal Raleigh North Carolina.jpg", Willthacheerleader18,
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Sacred_Heart_Cathedreal_Raleigh_North_Carolina.jpg
 *     — the gable's three windows and the statue.
 *  l2 "Sacred Heart Church, Raleigh, NC (28221488178).jpg", Warren LeMay, CC0,
 *     https://commons.wikimedia.org/wiki/File:Sacred_Heart_Church,_Raleigh,_NC_(28221488178).jpg
 *     — the east side along McDowell Street.
 * Aerial: USGS NAIP (public domain): plan, slate roofs.
 * Look-only: none.
 *
 * Left out: the Sacred Heart statue on the gable (a small pale block stands
 * for it), railings, steps, the window tracery, the stone coursing, the
 * garden wall on the north-east.
 * Doubts: all heights are photo estimates (±1 m); the north wall's
 * windows and the west arm's exact form (one photo each, partly in trees);
 * the tower's octagon (OSM's rounded outline; the photos read it as a
 * round drum, drawn with 14 sides); whether the aisle's windows are
 * square-headed all along (photo 03) or pointed further north (photo 04).
 * Night: windows are `window` (lit for evening services); no floodlighting.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, flatShape, lathe, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY, cross } from './ral-holy-name-of-jesus-cathedral'
import { lancetShape } from './ral-christ-church'

const G = 0.8
const NX0 = -6.95, NX1 = 3.0, NXC = (NX0 + NX1) / 2, NHW = (NX1 - NX0) / 2 // nave
const AX1 = 6.95 // aisle's outer wall
const YF = -12.6, YB = 13.2 // façade and north end
const EA = G + 6.8, RN = G + 12.0
const TY0 = 0.3, TY1 = 9.6, TYC = (TY0 + TY1) / 2, THW = (TY1 - TY0) / 2 // transept
const TE = G + 5.8, TR = G + 10.6
const AL = G + 3.4, AH = G + 6.2 // aisle lean-to, outer and inner heights
const TX = 5.3, TYw = -13.5, TRB = 2.55, TRT = 2.2 // tower centre; the drum's radius at its foot and top (battered)
const TTOP = G + 12.6, SPT = G + 19.2

function build() {
  const stone = new Part(), slate = new Part(), win = new Part(), door = new Part(), pale = new Part()
  const gableSec = (a0: number, a1: number, ze: number, zr: number): XY[] => [[a0, 0], [a1, 0], [a1, ze - 0.15], [(a0 + a1) / 2, zr - 0.15], [a0, ze - 0.15]]

  // ============================================================ nave, aisle, transept
  prismY(stone, YF, TYC, gableSec(NX0, NX1, EA, RN))
  roofY(slate, YF - 0.35, TYC, NXC, NHW, EA, RN, 0.4, 0.3)
  // north of the transept the church is full width and full height (photo 04)
  const NB = (NX0 + AX1) / 2, NBW = (AX1 - NX0) / 2, RB = RN
  prismY(stone, TYC, YB, gableSec(NX0, AX1, EA, RB), false)
  // its north end in stone; its south end, where it rises past the nave's
  // roof, closed in slate like a hip so no wall shows above the nave
  flatShape(stone, { o: [NB, YB, 0], n: [0, 1] }, gableSec(-NBW, NBW, EA, RB), 0)
  flatShape(slate, { o: [NB, TYC, 0], n: [0, -1] }, [[-NBW - 0.4, EA - 0.4], [NBW + 0.4, EA - 0.4], [0, RB]], 0)
  roofY(slate, TYC, YB + 0.35, NB, NBW, EA, RB, 0.4, 0.3)
  // the east aisle under a lean-to
  prismY(stone, YF, TY0, [[NX1 - 0.1, 0], [AX1, 0], [AX1, AL], [NX1 - 0.1, AH]])
  const k = (AH - AL) / (AX1 - NX1)
  for (const [y0, y1] of [[YF + 0.2, TY0]]) {
    prismY(slate, y0, y1, [[NX1 - 0.05, AH + 0.05], [AX1 + 0.4, AL - 0.4 * k], [AX1 + 0.4, AL - 0.4 * k - 0.25], [NX1 - 0.05, AH - 0.2]])
  }
  // the transept: a cross gable over nave and aisle, its ends just past the arms
  const WX = -9.55, EX = 9.4
  prismX(stone, NXC, EX, gableSec(TY0, TY1, TE, TR))
  roofX(slate, NXC, EX + 0.35, TYC, THW, TE, TR, 0.4, 0.3)
  // the west arm: a low gabled wing, eaves under the nave's (photo 01)
  const WY0 = 0.4, WY1 = 10.6, WE = G + 3.6, WR = G + 7.4
  prismX(stone, WX, NX0 + 0.2, gableSec(WY0, WY1, WE, WR))
  roofX(slate, WX - 0.35, NX0 + 0.2, (WY0 + WY1) / 2, (WY1 - WY0) / 2, WE, WR, 0.4, 0.3)
  // chimney on the north gable's east shoulder (photo 04)
  box(stone, AX1 - 0.3, YB - 2.2, AX1 + 1.1, YB - 0.7, 0, RB + 0.2, stone, 0.12)

  // ============================================================ windows
  const roundWin = (f: Face, s: number, w: number, z0: number, zs: number) => {
    flatShape(pale, f, archShape(s, w + 0.5, z0 - 0.25, zs, 10), 0.04)
    flatShape(win, f, archShape(s, w, z0, zs, 10), 0.08)
  }
  const pointWin = (f: Face, s: number, w: number, z0: number, z1: number) => {
    flatShape(pale, f, lancetShape(s, w + 0.45, z0 - 0.2, z1 + 0.3), 0.04)
    flatShape(win, f, lancetShape(s, w, z0, z1), 0.08)
  }
  // west nave wall: three tall round-arched windows (photo 01)
  for (const y of [-9.4, -5.6, -1.8]) roundWin({ o: [NX0, y, 0], n: [-1, 0] }, 0, 1.45, G + 2.2, G + 5.6)
  // aisle: pointed lancets between buttresses (photos 04, l2)
  // aisle: square-headed two-light windows between buttresses (photo 03)
  for (const y of [-8.6, -4.6]) {
    const f: Face = { o: [AX1, y, 0], n: [1, 0] }
    flatShape(pale, f, [[-0.85, G + 0.9], [0.85, G + 0.9], [0.85, G + 2.9], [-0.85, G + 2.9]], 0.04)
    flatShape(win, f, [[-0.65, G + 1.1], [0.65, G + 1.1], [0.65, G + 2.7], [-0.65, G + 2.7]], 0.08)
  }
  for (const y of [-6.6, -2.6, 0.0]) box(stone, AX1, y - 0.35, AX1 + 0.6, y + 0.35, 0, AL - 0.3, stone, 0.1)
  // east wall north of the transept: a tall lancet and the side door (photo 04)
  pointWin({ o: [AX1, 12.0, 0], n: [1, 0] }, 0, 1.05, G + 2.0, G + 5.6)
  flatShape(door, { o: [AX1, 10.5, 0], n: [1, 0] }, [[-0.5, G], [0.5, G], [0.5, G + 2.2], [-0.5, G + 2.2]], 0.08)
  // transept ends: a big round-headed window in a pointed relieving arch (photo 04)
  {
    const f: Face = { o: [EX, TYC, 0], n: [1, 0] }
    flatShape(pale, f, lancetShape(0, 3.4, G + 1.3, G + 7.2), 0.03)
    flatShape(stone, f, lancetShape(0, 2.8, G + 1.6, G + 6.7), 0.05)
    roundWin(f, 0, 1.55, G + 1.9, G + 5.0)
  }
  // the west wing: a pair of square-headed windows (photo 01)
  for (const s of [-2.2, 2.2]) {
    const f: Face = { o: [WX, 5.5, 0], n: [-1, 0] }
    flatShape(pale, f, [[s - 0.75, G + 0.9], [s + 0.75, G + 0.9], [s + 0.75, G + 2.7], [s - 0.75, G + 2.7]], 0.04)
    flatShape(win, f, [[s - 0.55, G + 1.1], [s + 0.55, G + 1.1], [s + 0.55, G + 2.5], [s - 0.55, G + 2.5]], 0.08)
  }
  // north gable: three stepped round-arched lights (photo 04)
  {
    const f: Face = { o: [NXC, YB, 0], n: [0, 1] }
    const f2: Face = { o: [NB, YB, 0], n: [0, 1] }
    roundWin(f2, 0, 0.85, G + 6.3, G + 8.8)
    for (const s of [-1.5, 1.5]) roundWin(f2, s, 0.8, G + 6.0, G + 8.0)
  }

  // ============================================================ the façade
  {
    const f: Face = { o: [NXC, YF, 0], n: [0, -1] } // s runs east
    // three round-arched windows over the entrance block; the centre one taller
    roundWin(f, 0, 1.4, G + 6.4, G + 8.6)
    for (const s of [-1.9, 1.9]) roundWin(f, s, 1.0, G + 6.6, G + 8.3)
    // the statue on its pedestal before the centre window, a pale block
    box(pale, NXC - 0.45, YF - 0.8, NXC + 0.45, YF - 0.05, G + 5.2, G + 6.0)
    box(pale, NXC - 0.3, YF - 0.65, NXC + 0.3, YF - 0.15, G + 6.0, G + 7.9)
    // small relief cross high in the gable
    flatShape(pale, f, [[-0.1, G + 10.6], [0.1, G + 10.6], [0.1, G + 11.4], [-0.1, G + 11.4]], 0.05)
    flatShape(pale, f, [[-0.32, G + 11.0], [0.32, G + 11.0], [0.32, G + 11.18], [-0.32, G + 11.18]], 0.05)
    // corner buttresses, stepped
    for (const x of [NX0]) {
      box(stone, x - 0.3, YF - 1.2, x + 1.0, YF, 0, G + 3.6, stone, 0.12)
      box(stone, x - 0.15, YF - 0.75, x + 0.85, YF, G + 3.6, G + 6.6, stone, 0.12)
    }
    // the entrance block, its parapet a little raised at the ends
    const ex0 = -4.4, ex1 = 3.0, ey = -14.3
    box(stone, ex0, ey, ex1, YF + 0.1, 0, G + 5.0, stone, 0.12)
    for (const x of [ex0, ex1 - 1.0]) box(stone, x, ey, x + 1.0, YF, G + 5.0, G + 5.6, stone, 0.1)
    box(pale, ex0 - 0.05, ey - 0.05, ex1 + 0.05, YF + 0.1, G + 4.9, G + 5.15)
    const fe: Face = { o: [NXC, ey, 0], n: [0, -1] }
    // the portal: a pale arch ring round a pointed opening, double doors
    flatShape(pale, fe, lancetShape(0, 3.3, G - 0.1, G + 4.6, 7), 0.04)
    flatShape(door, fe, lancetShape(0, 2.3, G, G + 3.9, 7), 0.08)
    // the entrance block's small windows either side (photo 02)
    for (const s of [-2.8, 2.3]) flatShape(win, fe, [[s - 0.3, G + 1.6], [s + 0.3, G + 1.6], [s + 0.3, G + 2.9], [s - 0.3, G + 2.9]], 0.06)
  }

  // ============================================================ the tower and its spire
  {
    // a round, battered drum (photo 03), a corbelled cornice
    lathe(stone, TX, TYw, [[TRB, 0], [TRT, TTOP - 0.9]], 14)
    lathe(stone, TX, TYw, [[TRT, TTOP - 0.9], [TRT + 0.32, TTOP - 0.35], [TRT + 0.32, TTOP], [TRT - 0.2, TTOP + 0.01]], 14)
    // the slate cone, flared at its foot, with a ball and cross
    lathe(slate, TX, TYw, [[TRT + 0.45, TTOP - 0.05], [TRT - 0.1, TTOP + 0.9], [0, SPT]], 14)
    const ap = TRT + 0.02
    lathe(pale, TX, TYw, [[0, SPT - 0.3], [0.28, SPT], [0, SPT + 0.4]], 8)
    cross(pale, TX, TYw, SPT + 0.3, 1.8, 0.95, 0.2, true)
    // small windows on the tower's south and east faces: two low, one high
    for (const n of [[0, -1], [1, 0], [Math.SQRT1_2, -Math.SQRT1_2]] as XY[]) {
      const f: Face = { o: [TX + n[0] * (ap + 0.1), TYw + n[1] * (ap + 0.1), 0], n }
      flatShape(win, f, [[-0.3, G + 8.4], [0.3, G + 8.4], [0.3, G + 9.6], [-0.3, G + 9.6]], 0.06)
      if (n[0] !== 1) flatShape(win, f, [[-0.28, G + 2.0], [0.28, G + 2.0], [0.28, G + 3.3], [-0.28, G + 3.3]], 0.15)
    }
  }

  // a cross on the crossing (photo 04)
  cross(pale, NB, TYC, TR - 0.2, 1.4, 0.8, 0.18, false)

  return finishGlb('Sacred Heart Cathedral', [
    { part: stone, material: finish('shc-granite', 0xbfb4a0) },
    { part: slate, material: finish('shc-slate', 0x8e8d8b) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('shc-oak', 0x5a3d30) },
    { part: pale, material: finish('shc-dressing', 0xe2d8c6) },
  ], { bearing: 2.5, height: SPT + 2.1, replaces: ['way/47776428'] }, 5000)
}

if (import.meta.main) await writeModel('ral-sacred-heart-cathedral', build())
