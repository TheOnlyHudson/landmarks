/**
 * Cathedral of SS. Peter and Paul (1906–1907, William Renwick; portico
 * 1936), 1347 North Meridian Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-ss-peter-and-paul-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/307816632 (-86.1567859, 39.7852931); the plan is
 * turned 1.7 degrees clockwise from true north (the outline's long walls
 * agree), so the church is drawn square, its west front on Meridian Street
 * at x = -39.6, and placed at bearing 1.7. y = 0 is the sidewalk at the
 * front (lidar ground 0.6 m over the grid minimum; 1.0 m at the east end).
 *
 * Identity (from the photos below):
 *  1. The pale limestone west front: four giant fluted Corinthian columns
 *     under a low pediment with a cross, flanked by square corner
 *     pavilions with giant pilasters and a balustraded parapet. (W, SW)
 *  2. The broad steps up to three bronze doors behind the columns, a tall
 *     window over the middle door.                                     (SW)
 *  3. Behind it a tall buff-brick basilica: a nave under a low slate gable,
 *     round-headed windows in two rows, a stone string course; a
 *     cross-gabled transept whose gables are pediments with an oculus;
 *     a lower east end.                                         (SW, N)
 *  No dome: the crossing is just the two roofs meeting.
 *
 * Sources
 * - OSM (ODbL): way/307816632 (building=cathedral, "Saints Peter & Paul
 *   Cathedral"): the front block x -37.2..-26.6, y -11.0..19.8; the
 *   portico x -39.6..-37.2, y -5.7..14.3; the nave y -8.1..17.1; the
 *   transept x 2.9..18.8, y -9.0..17.8; the east end x 18.8..29.1,
 *   y -3.0..11.9.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame (tools/lidar_frame.py).
 *   Measured (above the front sidewalk): the nave eaves 21.7 m, ridge
 *   27.6 m on y 4.4; the transept ridge about 26.6 m on x 10.5; the corner
 *   pavilions' parapets 23.7 m; the pediment's apex 25.5 m; the east end
 *   17 m at its walls to 21 m.
 * - Published (Wikipedia "Cathedral of Saints Peter and Paul
 *   (Indianapolis)"; NRHP): 1906–07, Italian Renaissance Revival; the
 *   limestone portico and front were completed in 1936.
 * - Photos (Wikimedia Commons, Farragutful, CC BY-SA 4.0):
 *   "Saints Peter and Paul Cathedral - Indianapolis 01.jpg"
 *   (https://commons.wikimedia.org/wiki/File:Saints_Peter_and_Paul_Cathedral_-_Indianapolis_01.jpg),
 *   the front and south side from the south-west;
 *   "Saints Peter and Paul Cathedral - Indianapolis 02.jpg"
 *   (https://commons.wikimedia.org/wiki/File:Saints_Peter_and_Paul_Cathedral_-_Indianapolis_02.jpg),
 *   the north side: the transept pediment and oculus, the clerestory, the
 *   east end;
 *   "Saints Peter and Paul Cathedral - Indianapolis 03.jpg"
 *   (https://commons.wikimedia.org/wiki/File:Saints_Peter_and_Paul_Cathedral_-_Indianapolis_03.jpg),
 *   the pediment and capitals close up.
 *
 * Estimated (from the photos against the lidar heights): the columns
 *   1.5..16.5 m, 1.6 m thick, 6 m apart; the entablature 16.5..22.6 m; the
 *   string course 9.5 m; every window's size; five nave bays. The north
 *   aisle, sacristies and the rectory are in the neighbouring OSM way
 *   1465808025 and are not drawn.
 * Left out: the capitals' carving, the roundels and dentils, the
 *   balusters (a solid parapet), the inscriptions, the handrails.
 * Night: the limestone front is floodlit; windows glow; doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, chamfer, flatShape, extrudeShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { gable, bar, ringOnFace } from './indy-st-john-the-evangelist'
import { column, stairs, box, ringBand, wallLit } from './indy-world-war-memorial'

const stone = new Part(), brick = new Part(), roof = new Part(), win = new Part(), door = new Part()

const YC = 4.4 // the church's axis
const FX0 = -37.2, FX1 = -26.6, FY0 = -11.0, FY1 = 19.8 // the front block
const PX0 = -39.6, PY0 = -5.7, PY1 = 14.3 // the portico
const NY0 = -8.1, NY1 = 17.1, TX0 = 2.9, TX1 = 18.8, TY0 = -9.0, TY1 = 17.8
const EAVE = 21.7, RIDGE = 27.6, TRIDGE = 26.9
const CORN = 22.6, PAR = 23.7, PED = 25.5

// ---------------------------------------------------- the front block
box(stone, roof, FX0, FY0, FX1, FY1, 0, CORN)
prism(stone, null, chamfer(rect(FX0 - 0.35, FY0 - 0.35, FX1, FY1 + 0.35), 0.3), CORN - 1.4, CORN)
prism(stone, null, rect(FX0 - 0.2, FY0 - 0.2, FX1, FY1 + 0.2), 0, 1.5)
// the corner pavilions' balustraded parapets, with corner blocks
for (const [y0, y1] of [[FY0, PY0], [PY1, FY1]]) {
  ringBand(stone, FX0 - 0.2, y0 - (y0 === FY0 ? 0.2 : 0), FX1, y1 + (y1 === FY1 ? 0.2 : 0), CORN, PAR, 0.5)
  for (const [x, y] of [[FX0 + 0.5, y0 + 0.6], [FX0 + 0.5, y1 - 0.6], [FX1 - 0.7, y0 + 0.6], [FX1 - 0.7, y1 - 0.6]]) box(stone, stone, x - 0.7, y - 0.7, x + 0.7, y + 0.7, CORN, PAR + 0.5)
}
// giant pilasters on the pavilions (front and sides)
for (const y of [FY0 + 0.9, PY0 - 0.9, PY1 + 0.9, FY1 - 0.9]) box(stone, null, FX0 - 0.45, y - 0.8, FX0, y + 0.8, 1.5, CORN - 1.4, 0.15)
for (const [y, sg] of [[FY0, -1], [FY1, 1]] as [number, number][]) {
  for (const x of [FX0 + 1.0, FX1 - 1.2]) box(stone, null, x - 0.8, sg < 0 ? y - 0.45 : y, x + 0.8, sg < 0 ? y : y + 0.45, 1.5, CORN - 1.4, 0.15)
  const f: Face = { o: [0, y, 0], n: [0, sg] }
  const S = (x: number) => (sg < 0 ? x : -x)
  const xc = (FX0 + FX1) / 2
  for (const [z0, z1] of [[4.0, 7.0], [11.0, 14.5], [17.0, 19.0]]) flatShape(win, f, rect(S(xc) - 0.8, z0, S(xc) + 0.8, z1), 0.06)
}
{
  // the pavilions' fronts: a tall niche and a small window each
  const f: Face = { o: [FX0, 0, 0], n: [-1, 0] }
  for (const y of [(FY0 + PY0) / 2, (PY1 + FY1) / 2]) {
    flatShape(win, f, archShape(-y, 1.3, 9.0, 12.4, 6), 0.06)
    flatShape(win, f, rect(-y - 0.6, 3.5, -y + 0.6, 6.0), 0.06)
  }
}

// ---------------------------------------------------- the portico
{
  // the podium, the steps out to the sidewalk
  box(stone, stone, PX0, PY0, FX0, PY1, 0, 1.5)
  stairs(stone, PX0 - 2.4, PY0 + 1.6, PX0, PY1 - 1.6, 'w', 0, 1.5, 5)
  // the entablature, the cornice and the pediment's roof
  box(stone, null, PX0, PY0, FX0, PY1, 16.5, CORN)
  prism(stone, null, chamfer(rect(PX0 - 0.35, PY0 - 0.35, FX0, PY1 + 0.35), 0.3), CORN - 1.2, CORN)
  prism(stone, null, rect(PX0 - 0.1, PY0 - 0.1, FX0, PY1 + 0.1), 17.8, 18.1)
  gable(stone, roof, (PX0 - 0.35 + FX1) / 2, YC + 0.0, FX1 - PX0 + 0.35, PY1 - PY0 + 0.7, 0, CORN, PED, 0.35, [true, false])
  // the pediment's raking cornices and its roundel
  const f: Face = { o: [PX0 - 0.35, YC, 0], n: [-1, 0] }
  const W = (PY1 - PY0) / 2 + 0.7
  bar(stone, f, -W, CORN + 0.2, 0, PED + 0.25, 0.55, 0.3)
  bar(stone, f, W, CORN + 0.2, 0, PED + 0.25, 0.55, 0.3)
  ringOnFace(stone, f, 0, CORN + 1.1, 0.6, 0.85, 12, 0.12)
  // the cross on the apex
  box(stone, stone, PX0 - 0.3, YC - 0.15, PX0 + 0.1, YC + 0.15, PED - 0.2, PED + 2.2)
  box(stone, stone, PX0 - 0.3, YC - 0.65, PX0 + 0.1, YC + 0.65, PED + 1.2, PED + 1.55)
  // four giant columns, and pilasters behind them on the wall
  for (const dy of [-9.0, -3.0, 3.0, 9.0]) {
    column(stone, PX0 + 1.0, YC + dy, 1.5, 16.5, 0.78, 10, 1.4)
    box(stone, null, FX0 - 0.35, YC + dy - 0.75, FX0, YC + dy + 0.75, 1.5, 16.5)
  }
  // three bronze doors, a tall window over the middle one, side niches
  const w: Face = { o: [FX0, YC, 0], n: [-1, 0] }
  for (const s of [-6.0, 0, 6.0]) {
    extrudeShape(stone, w, rect(s - 1.5, 1.5, s + 1.5, 7.4), 0, 0.12)
    flatShape(door, w, rect(s - 1.0, 1.5, s + 1.0, 6.6), 0.16)
  }
  flatShape(win, w, rect(-1.0, 9.6, 1.0, 15.4), 0.06)
  for (const s of [-6.0, 6.0]) flatShape(win, w, archShape(s, 1.3, 10.6, 13.6, 6), 0.06)
}

// ---------------------------------------------------- the nave (its west gable, over the front, faced in stone)
const NX0 = FX1, NX1 = TX0
prism(brick, null, rect(NX0, NY0, TX1, NY1), 0, EAVE)
prism(stone, null, rect(NX0, NY0 - 0.2, TX0, NY1 + 0.2), 9.2, 9.7)
prism(stone, null, chamfer(rect(NX0, NY0 - 0.45, TX0, NY1 + 0.45), 0.3), EAVE - 0.9, EAVE)
gable(stone, roof, (NX0 + 10.85) / 2, YC + 0.1, 10.85 - NX0, NY1 - NY0, 0, EAVE, RIDGE, 0.5, [true, false])
{
  const NB = 5, BAY = (NX1 - NX0) / NB
  for (const [y, sg] of [[NY0, -1], [NY1, 1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, sg] }
    const S = (x: number) => (sg < 0 ? x : -x)
    for (let k = 0; k < NB; k++) {
      const xc = NX0 + (k + 0.5) * BAY
      flatShape(win, f, archShape(S(xc), 2.4, 12.6, 17.2, 8), 0.06)
      flatShape(win, f, archShape(S(xc), 1.4, 3.4, 6.6, 6), 0.06)
    }
    for (let k = 1; k < NB; k++) {
      const x = NX0 + k * BAY
      box(brick, null, x - 0.5, sg < 0 ? y - 0.35 : y, x + 0.5, sg < 0 ? y : y + 0.35, 0, EAVE - 0.9)
    }
  }
}

// ---------------------------------------------------- the transept
{
  prism(brick, null, rect(TX0, TY0, TX1, TY1), 0, EAVE)
  prism(stone, null, rect(TX0 - 0.2, TY0 - 0.2, TX1 + 0.2, TY1 + 0.2), 9.2, 9.7)
  prism(stone, null, chamfer(rect(TX0 - 0.45, TY0 - 0.45, TX1 + 0.45, TY1 + 0.45), 0.3), EAVE - 0.9, EAVE)
  const cx = (TX0 + TX1) / 2, W = (TX1 - TX0) / 2
  gable(brick, roof, cx, (TY0 + TY1) / 2, TY1 - TY0, TX1 - TX0, 90, EAVE, TRIDGE, 0.5)
  for (const [y, sg] of [[TY0, -1], [TY1, 1]] as [number, number][]) {
    const f: Face = { o: [cx, y, 0], n: [0, sg] }
    const fo: Face = { o: [cx, y + sg * 0.45, 0], n: [0, sg] }
    // the pediment: raking cornices, and the oculus
    bar(stone, fo, -W - 0.6, EAVE - 0.1, 0, TRIDGE + 0.3, 0.6, 0.3)
    bar(stone, fo, W + 0.6, EAVE - 0.1, 0, TRIDGE + 0.3, 0.6, 0.3)
    ringOnFace(stone, f, 0, EAVE + 2.0, 0.85, 1.15, 12, 0.1)
    flatShape(win, f, arc(0, EAVE + 2.0, 0.88, 0, 360, 12).slice(0, -1), 0.06)
    // the great round-headed window, two below
    flatShape(win, f, archShape(0, 3.2, 12.2, 18.0, 10), 0.06)
    for (const s of [-3.6, 3.6]) flatShape(win, f, archShape(s, 1.4, 3.4, 6.6, 6), 0.06)
    // brick pilasters at the corners, stone consoles under the cornice
    for (const x of [TX0 + 0.8, TX1 - 0.8]) {
      const ya = sg < 0 ? y - 0.5 : y, yb = sg < 0 ? y : y + 0.5
      box(brick, null, x - 0.8, ya, x + 0.8, yb, 0, EAVE - 0.9)
      box(stone, null, x - 0.5, ya - (sg < 0 ? 0.2 : 0), x + 0.5, yb + (sg > 0 ? 0.2 : 0), EAVE - 2.4, EAVE - 0.9)
    }
  }
  // east face of the transept above the east end, round-headed windows
  const fe: Face = { o: [TX1, YC, 0], n: [1, 0] }
  for (const s of [-9.5, 9.5]) flatShape(win, fe, archShape(s, 1.8, 12.6, 16.6, 8), 0.06)
}

// ---------------------------------------------------- the east end
{
  const EX0 = TX1, EX1 = 29.1, EY0 = -3.0, EY1 = 11.9, EH = 16.6
  const ring: XY[] = [[EX0, EY0], [26.0, EY0], [EX1, EY0 + 3.1], [EX1, EY1 - 3.1], [26.0, EY1], [EX0, EY1]]
  prism(brick, null, ring, 0, EH, 1)
  prism(stone, null, [[EX0, EY0 - 0.3], [26.1, EY0 - 0.3], [EX1 + 0.3, EY0 + 3.0], [EX1 + 0.3, EY1 - 3.0], [26.1, EY1 + 0.3], [EX0, EY1 + 0.3]], EH - 0.7, EH, 1)
  // a hipped roof over the half-hexagon end
  const z = EH, R = 21.0, my = (EY0 + EY1) / 2
  const A: V3 = [EX0, EY0 - 0.3, z], B: V3 = [26.1, EY0 - 0.3, z], C: V3 = [EX1 + 0.3, EY0 + 3.0, z], D: V3 = [EX1 + 0.3, EY1 - 3.0, z], E: V3 = [26.1, EY1 + 0.3, z], F: V3 = [EX0, EY1 + 0.3, z]
  const top: V3 = [24.0, my, R], back: V3 = [EX0, my, R]
  roofTri(roof, [A, B, top, back], [0, -1, 1])
  roofTri(roof, [E, F, back, top], [0, 1, 1])
  roofTri(roof, [B, C, top], [1, -1, 1])
  roofTri(roof, [C, D, top], [1, 0, 1])
  roofTri(roof, [D, E, top], [1, 1, 1])
  for (const [y, sg] of [[EY0, -1], [EY1, 1]] as [number, number][]) {
    const f: Face = { o: [(EX0 + 26.0) / 2, y, 0], n: [0, sg] }
    flatShape(win, f, archShape(0, 1.8, 9.0, 13.0, 8), 0.06)
    flatShape(win, f, archShape(0, 1.2, 3.0, 5.6, 6), 0.06)
  }
}
function roofTri(part: Part, pts: V3[], hint: V3) {
  const [a, b, c] = pts
  const n: V3 = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i + 1 < p.length; i++) part.tri(p[0], p[i], p[i + 1])
}

const frontLit = (p: V3, n: V3) => (p[0] < FX1 + 0.1 ? wallLit(p, n) : 0)
const limestone = { ...finish('indy-sspp-limestone', 0xe7dec9), floodlight: frontLit }
const built = finishGlb('Cathedral of SS. Peter and Paul', [
  { part: stone, material: limestone },
  { part: brick, material: finish('indy-sspp-brick', 0xc9ad80) },
  { part: roof, material: finish('indy-sspp-slate', 0x80868d) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('entrance', 0xa8884e) },
], { bearing: 1.7, height: RIDGE, replaces: ['way/307816632'] }, 5000)
await writeModel('indy-ss-peter-and-paul-cathedral', built)
