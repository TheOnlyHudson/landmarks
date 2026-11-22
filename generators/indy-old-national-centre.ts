/**
 * Old National Centre (the Murat Shrine Temple, 1909–1910, Oscar D. Bohlen;
 * the north wing with the Egyptian Room, 1922), 502 North New Jersey Street,
 * Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-old-national-centre.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/339829532 (-86.15105, 39.7744916); the plan is
 * turned 1.5 degrees clockwise with the downtown grid (the lidar walls run
 * square at 1.5), placed at bearing 1.5. The main front is the east wall on
 * New Jersey Street (x = 28.4); the long south wall is on Michigan Street;
 * the minaret stands on the south-east corner by Massachusetts Avenue.
 *
 * Identity (from the photos below):
 *  1. The tall minaret on the south-east corner: a square striped base with
 *     a corbelled balcony, an octagonal stage with arched windows, a second
 *     balcony, a round striped shaft, a third balcony, and a small green
 *     dome with a crescent finial.                              (S, SE)
 *  2. Walls of cream brick with darker grey-tan bands all the way up (the
 *     "striped" walls), pale terracotta trim.                    (all)
 *  3. Two green copper domes on the New Jersey Street front, the southern
 *     one on a raised square pavilion, plus a small corner minaret at the
 *     north end of the 1909 front.                        (E, NAIP, lidar)
 *  4. On the east front, two entrance bays with a big round-arched window
 *     in a square terracotta frame, doors under it, three arched windows
 *     and oculi over it and a raised parapet (one reads "MURAT").     (E)
 *  5. On the south wall, the raised "A.A.O.N.M.S." parapet over a five-arch
 *     arcade, paired windows, round windows, and the tall stage house at
 *     the west end.                                                  (S)
 *
 * Sources
 * - OSM (ODbL): way/339829532 (building=civic, "Old National Centre"), the
 *   whole complex including the 1922 north wing; no parts, no heights.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid, read in this frame (heights above the lowest ground,
 *   the site is flat to ±0.6 m). The lidar sits about 0.8 m east of the OSM
 *   outline; positions below are moved onto OSM. Measured: the south half of
 *   the hall (y -46..-12) roof 19.0..20.0; the north half 18.2..18.7; the
 *   east front range (x 20..28.4) 19.6..19.8 with its parapet at 21.0..21.3;
 *   the stage house (x -33..-18.5, y -46..-12) 26.6..27.3, its east edge
 *   28.5; the north wing (x -15..29, y 21..50) 13.3..13.6; its stair block
 *   (x -19..-15, y 21..28) 24.4..25.2; the low annex (x 15..23, y 50..63)
 *   4.4..5.3; the minaret: base 11 m square to the balcony at 23.8..24.0,
 *   second balcony 41.6..42.3 (radius 4.5..5), round shaft 6 m across to
 *   50.7..51.7, dome cells 52.5..56.9, finial 61.8..62.0; dome B
 *   (y -17) on a 8 m square pavilion to 23.9, dome 7.6 m across to 31.7;
 *   dome A (y 3.5) 8 m across, base ring 22.5..23.0, top 25.5, finial 28.9;
 *   the north-east corner minaret 4 m square, 35.1..35.3, its finial 42.4;
 *   the raised south parapet 22.3..22.9.
 * - USGS NAIP orthophoto (public domain): the plan, the three green domes
 *   along the east front, the dark brown stage-house roof.
 * - Photos (Wikimedia Commons):
 *   "Murat Shrine, Indianápolis, Estados Unidos, 2012-10-22, DD 01.jpg"
 *   (Diego Delso, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Murat_Shrine,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_01.jpg),
 *   the whole south wall and the minaret: the window layout, the stage
 *   house, the stages of the minaret (scaled against the lidar balconies);
 *   "Murat Shrine Temple (Old National Centre), New Jersey Street and
 *   Massachusetts Avenue, Indianapolis, IN - 54378175001.jpg" (w_lemay,
 *   CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Murat_Shrine_Temple_(Old_National_Centre),_New_Jersey_Street_and_Massachusetts_Avenue,_Indianapolis,_IN_-_54378175001.jpg),
 *   the east front from the north: the entrance bay, the domes;
 *   "... IN - 54378414683.jpg" (w_lemay, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Murat_Shrine_Temple_(Old_National_Centre),_New_Jersey_Street_and_Massachusetts_Avenue,_Indianapolis,_IN_-_54378414683.jpg),
 *   the minaret and the east front from the south-east;
 *   "... IN - 54378575745.jpg" (w_lemay, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Murat_Shrine_Temple_(Old_National_Centre),_New_Jersey_Street_and_Massachusetts_Avenue,_Indianapolis,_IN_-_54378575745.jpg),
 *   the MURAT bay close up: the arched window and its frame, the three
 *   arches and oculi over it.
 *
 * Estimated: every window's size and spacing (from the photos, against the
 *   lidar heights); the minaret's stage heights between the measured
 *   balconies (photo-scaled); the bands, drawn at half their real density
 *   (1.6 m apart instead of about 0.8 m) so they read at map distance.
 * Doubts: the west and north walls and the 1922 north wing are
 *   unphotographed and drawn as plain banded brick with a few windows; the
 *   bit of the outline west of the stair block (x -33..-19, y 21..35) reads
 *   as ground in the lidar (a service yard) and is left empty; the exact
 *   position of the north entrance bay (the MURAT bay) along the front.
 * Left out: the crenellated cresting, the terracotta carving, the downpipes,
 *   the marquee.
 * Night: the minaret and domes are floodlit; windows glow; doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, archShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, ringBand } from './indy-world-war-memorial'
import { drum } from './indy-st-john-the-evangelist'

const wall = new Part(), band = new Part(), trim = new Part(), green = new Part(), win = new Part(), door = new Part()

// ---------------------------------------------------------------- helpers
const PERIOD = 1.6, BAND = 0.7
/** Dark brick bands on a wall from a to b (outward to the right of a→b), z0..z1. */
function bandsOn(a: XY, b: XY, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const f: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }
  for (let z = z0 + 0.9; z + BAND <= z1 - 0.6; z += PERIOD) flatShape(band, f, rect(-L / 2, z, L / 2, z + BAND), 0.025)
}
/** A banded block over a rectangle, with a pale coping, flat roof in `band`. */
function block(x0: number, y0: number, x1: number, y1: number, h: number, sides = [true, true, true, true], cope = 0.5) {
  box(wall, band, x0, y0, x1, y1, 0, h)
  const r = rect(x0, y0, x1, y1)
  for (let i = 0; i < 4; i++) if (sides[i]) bandsOn(r[i], r[(i + 1) % 4], 0, h - cope)
  if (cope > 0) ringBand(trim, x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12, h - cope, h + 0.15, 0.5)
}
/** Banded rings round a lathe drum of radius r (n sides). */
function ringBands(cx: number, cy: number, r: number, z0: number, z1: number, n: number, rot = 0) {
  for (let z = z0 + 0.5; z + BAND <= z1 - 0.3; z += PERIOD) drum(band, null, cx, cy, r + 0.04, z, z + BAND, n, rot)
}
const S: Face = { o: [0, -46, 0], n: [0, -1] } // south wall: s = x
const E: Face = { o: [28.4, 0, 0], n: [1, 0] } // east front: s = y
const N: Face = { o: [0, 49.6, 0], n: [0, 1] } // north wing: s = -x
const W: Face = { o: [-33.3, 0, 0], n: [-1, 0] } // west wall: s = -y
const winRect = (f: Face, s: number, w: number, z0: number, z1: number) => flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.06)
const winArch = (f: Face, s: number, w: number, z0: number, zs: number) => flatShape(win, f, archShape(s, w, z0, zs, 8), 0.06)
const oculus = (f: Face, s: number, z: number, r: number) => {
  flatShape(trim, f, arc(s, z, r + 0.25, 0, 360, 12).slice(0, -1), 0.045)
  flatShape(win, f, arc(s, z, r, 0, 360, 12).slice(0, -1), 0.06)
}
/** A pale surround behind a window group. */
const surround = (f: Face, s0: number, z0: number, s1: number, z1: number) => flatShape(trim, f, rect(s0, z0, s1, z1), 0.045)

// ---------------------------------------------------------------- massing
// The hall: south half (y -46..-12) and north half (y -12..21), x -18.5..20.5
block(-18.5, -46, 20.5, -12, 19.6, [true, false, false, false])
block(-33.3, -12, 20.5, 21, 18.6, [false, false, true, true])
// the stage house at the west end
block(-33.3, -46, -18.5, -12, 27.3, [true, true, true, true], 0.6)
// the east front range on New Jersey Street, to its parapet
block(20.5, -37.6, 28.4, 21, 21.2, [false, true, true, false], 0.7)
block(20.5, -46, 28.4, -37.6, 19.6, [false, false, false, false]) // behind the minaret
// the raised A.A.O.N.M.S. parapet over the south arcade
block(-7.0, -46.0, 5.6, -44.6, 22.6, [true, false, false, false], 0.7)
// the 1922 north wing (Egyptian Room), its stair block and the low annex
block(-14.7, 21, 28.8, 49.6, 13.5, [false, true, true, true])
block(-18.6, 28, -14.7, 35.5, 13.5, [false, false, true, true])
block(-18.6, 21, -14.7, 28, 24.8, [true, false, true, true], 0.6)
block(15.0, 49.6, 23.3, 63.1, 5.0, [false, true, true, true], 0.4)

// ---------------------------------------------------------------- the minaret (south-east corner)
const TX = 23.0, TY = -43.2
{
  const base = chamfer(rect(TX - 5.3, TY - 5.3, TX + 5.3, TY + 5.3), 1.0)
  prism(wall, null, base, 0, 22.4)
  for (let i = 0; i < base.length; i++) bandsOn(base[i], base[(i + 1) % base.length], 0, 22.4)
  // corbelled balcony and its rail
  prism(trim, trim, chamfer(rect(TX - 5.7, TY - 5.7, TX + 5.7, TY + 5.7), 1.1), 22.4, 23.6)
  prism(green, green, chamfer(rect(TX - 5.6, TY - 5.6, TX + 5.6, TY + 5.6), 1.1), 23.6, 24.2)
  // windows on the base, south and east faces: paired, grouped two storeys
  for (const f of [{ o: [TX, TY - 5.3, 0], n: [0, -1] }, { o: [TX + 5.3, TY, 0], n: [1, 0] }] as Face[]) {
    for (const [z0, z1] of [[1.2, 6.0], [8.0, 13.6], [15.2, 19.8]]) {
      surround(f, -2.0, z0 - 0.3, 2.0, z1 + 0.3)
      winRect(f, -0.85, 1.3, z0, z1)
      winRect(f, 0.85, 1.3, z0, z1)
    }
  }
  // the sloped transition from the square to the octagon
  lathe(wall, TX, TY, [[5.9, 24.2], [5.0, 28.6]], 8, 22.5, 382.5)
  // octagonal stage with arched windows, to the second balcony
  drum(wall, null, TX, TY, 5.0, 28.6, 41.0, 8, 22.5)
  ringBands(TX, TY, 5.0, 28.6, 33.6, 8, 22.5)
  const apo = 5.0 * Math.cos(Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const a = (k * 45 * Math.PI) / 180
    const f: Face = { o: [TX + apo * Math.cos(a), TY + apo * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] }
    surround(f, -1.25, 34.2, 1.25, 40.2)
    winArch(f, 0, 1.4, 34.8, 37.6)
    flatShape(trim, f, rect(-1.6, 33.6, 1.6, 34.2), 0.05)
  }
  prism(trim, trim, arc(TX, TY, 5.5, 22.5, 382.5, 8).slice(0, -1), 41.0, 41.7)
  drum(green, green, TX, TY, 5.4, 41.7, 42.3, 8, 22.5)
  // the round striped shaft, the third balcony, the neck, the dome, the finial
  lathe(wall, TX, TY, [[3.1, 42.3], [2.95, 50.0]], 14)
  ringBands(TX, TY, 3.05, 42.3, 50.0, 14)
  lathe(trim, TX, TY, [[2.9, 49.8], [3.5, 50.4], [3.5, 50.7], [0.01, 50.7]], 14)
  lathe(green, TX, TY, [[3.4, 50.7], [3.4, 51.3], [0.01, 51.3]], 14)
  lathe(wall, TX, TY, [[1.1, 51.3], [1.1, 52.8], [0.01, 52.8]], 10)
  lathe(green, TX, TY, [[1.55, 52.8], [1.75, 53.7], [1.6, 54.6], [1.1, 55.6], [0.45, 56.3], [0.18, 56.8], [0.01, 57.0]], 10)
  lathe(green, TX, TY, [[0.16, 56.8], [0.12, 61.5], [0.01, 61.6]], 4)
  box(green, green, TX - 0.08, TY - 0.7, TX + 0.08, TY + 0.7, 60.0, 60.4)
}

// ---------------------------------------------------------------- domes on the east front
function dome(cx: number, cy: number, half: number, zBase: number, zDrum: number, r: number, zTop: number, finial: number) {
  // a square pavilion (chamfered) up to zDrum, then the dome
  const sq = chamfer(rect(cx - half, cy - half, cx + half, cy + half), 0.8)
  prism(wall, null, sq, zBase, zDrum)
  for (let i = 0; i < sq.length; i++) bandsOn(sq[i], sq[(i + 1) % sq.length], zBase, zDrum)
  prism(trim, trim, chamfer(rect(cx - half - 0.2, cy - half - 0.2, cx + half + 0.2, cy + half + 0.2), 0.9), zDrum - 0.6, zDrum + 0.1)
  drum(trim, trim, cx, cy, r + 0.3, zDrum + 0.1, zDrum + 0.6, 12)
  const h = zTop - zDrum - 0.6
  const prof: [number, number][] = [[r, 0], [r * 1.04, 0.22], [r * 0.98, 0.45], [r * 0.82, 0.68], [r * 0.55, 0.86], [r * 0.25, 0.96], [0.01, 1.0]]
  lathe(green, cx, cy, prof.map(([q, t]) => [q, zDrum + 0.6 + t * h] as [number, number]), 14)
  lathe(green, cx, cy, [[0.18, zTop - 0.1], [0.1, finial], [0.01, finial + 0.1]], 4)
}
dome(23.4, -17.0, 4.0, 0, 23.9, 3.7, 31.6, 33.6) // dome B, on its pavilion
dome(23.4, 3.5, 3.9, 19.0, 22.0, 3.6, 25.8, 28.8) // dome A
// the small minaret at the north end of the 1909 front
{
  const cx = 28.0, cy = 16.0
  box(wall, null, cx - 2.1, cy - 2.1, cx + 2.1, cy + 2.1, 0, 32.6)
  const sq = rect(cx - 2.1, cy - 2.1, cx + 2.1, cy + 2.1)
  for (let i = 0; i < 4; i++) bandsOn(sq[i], sq[(i + 1) % 4], 0, 32.6)
  prism(trim, trim, rect(cx - 2.4, cy - 2.4, cx + 2.4, cy + 2.4), 32.6, 33.2)
  drum(wall, null, cx, cy, 1.9, 33.2, 35.3, 8, 22.5)
  drum(green, green, cx, cy, 2.15, 35.3, 35.7, 8, 22.5)
  lathe(green, cx, cy, [[1.7, 35.7], [1.75, 36.5], [1.3, 37.6], [0.5, 38.4], [0.01, 38.6]], 10)
  lathe(green, cx, cy, [[0.12, 38.5], [0.08, 42.4], [0.01, 42.5]], 4)
  const f: Face = { o: [cx + 2.1, cy, 0], n: [1, 0] }
  for (const z of [6, 14, 22]) winRect(f, 0, 1.0, z, z + 3.0)
  for (let k = 0; k < 8; k += 2) {
    const a = ((k * 45) * Math.PI) / 180, ap = 1.9 * Math.cos(Math.PI / 8)
    winArch({ o: [cx + ap * Math.cos(a), cy + ap * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] }, 0, 0.7, 33.6, 34.6)
  }
}

// ---------------------------------------------------------------- the south wall (Michigan Street)
{
  // paired windows: lower storey, round windows, two upper storeys grouped
  for (const x of [-16.2, -12.0, -7.9, 7.4, 11.6, 15.6]) {
    for (const s of [x - 0.85, x + 0.85]) {
      winRect(S, s, 1.1, 1.0, 3.4)
      winRect(S, s, 1.1, 10.8, 15.2)
    }
    surround(S, x - 1.7, 10.4, x + 1.7, 15.6)
    oculus(S, x, 7.3, 0.45)
  }
  // the five-arch arcade under the raised parapet
  surround(S, -6.4, 10.2, 5.0, 16.6)
  for (let k = 0; k < 5; k++) {
    const x = -4.9 + k * 2.1
    winArch(S, x, 1.3, 10.8, 14.6)
    winRect(S, x, 1.1, 1.0, 3.4)
  }
  oculus(S, -0.7, 7.3, 0.45)
  surround(S, -5.0, 18.2, 3.6, 20.6) // the inscription panel
  // the stage house: a stack of paired windows and two small arches at the top
  const sx = -28.3
  for (const [z0, z1] of [[1.0, 3.6], [6.0, 10.6], [12.4, 17.0]]) {
    surround(S, sx - 1.8, z0 - 0.3, sx + 1.8, z1 + 0.3)
    winRect(S, sx - 0.8, 1.2, z0, z1)
    winRect(S, sx + 0.8, 1.2, z0, z1)
  }
  winArch(S, sx - 0.9, 0.9, 23.0, 24.0)
  winArch(S, sx + 0.9, 0.9, 23.0, 24.0)
}

// ---------------------------------------------------------------- the east front (New Jersey Street)
{
  /** An entrance bay centred at y: raised parapet, framed arched window, doors, arcade, oculi. */
  const entrance = (y: number) => {
    box(wall, null, 28.4, y - 4.2, 28.9, y + 4.2, 0, 22.4)
    const f: Face = { o: [28.9, y, 0], n: [1, 0] }
    for (let z = 0.9; z + BAND <= 21.6; z += PERIOD) flatShape(band, f, rect(-4.2, z, 4.2, z + BAND), 0.025)
    prism(trim, trim, rect(28.3, y - 4.4, 29.1, y + 4.4), 22.0, 23.2)
    surround(f, -3.4, 3.4, 3.4, 10.0) // the square terracotta frame
    winArch(f, 0, 4.6, 4.4, 6.9)
    flatShape(door, f, rect(-1.9, 0, 1.9, 3.3), 0.06)
    surround(f, -2.9, 11.0, 2.9, 15.6)
    for (const s of [-1.8, 0, 1.8]) winArch(f, s, 1.2, 11.5, 14.3)
    for (const s of [-1.8, 0, 1.8]) oculus(f, s, 17.0, 0.4)
    surround(f, -2.6, 18.6, 2.6, 20.6)
  }
  entrance(-29.6)
  entrance(8.6)
  // ordinary bays between: a window under each oculus, two tall upper windows
  for (const y of [-23.6, -16.2, -10.0, -5.4, -0.8, 3.6]) {
    winRect(E, y, 1.2, 1.0, 3.6)
    surround(E, y - 0.95, 5.4, y + 0.95, 15.4)
    winRect(E, y, 1.3, 5.8, 9.6)
    winRect(E, y, 1.3, 11.0, 15.0)
  }
}

// ---------------------------------------------------------------- the north wing and the plain walls
{
  for (const y of [25, 30, 35, 40, 45]) {
    winRect(E, y + 0.4, 1.3, 1.2, 4.2)
    winRect(E, y + 0.4, 1.3, 6.4, 11.2)
  }
  for (let x = -11; x <= 25; x += 4.5) {
    winRect(N, -x, 1.3, 1.2, 4.2)
    winRect(N, -x, 1.3, 6.4, 11.2)
  }
  for (const y of [-4, 4, 12]) winRect(W, -y, 1.2, 6.0, 12.0)
  // the annex doors
  flatShape(door, { o: [23.3, 56.3, 0], n: [1, 0] }, rect(-1.2, 0, 1.2, 2.8), 0.06)
}

const towerLit = (p: V3, n: V3) => (p[0] > 18 && (p[1] < -36 || p[2] > 21) ? (n[2] > 0.7 ? 0.2 : 0.85) : 0)
const wallM = { ...finish('indy-onc-cream-brick', 0xe4d3a7), floodlight: towerLit }
const bandM = { ...finish('indy-onc-banded-brick', 0xa9a091), floodlight: towerLit }
const trimM = { ...finish('indy-onc-terracotta', 0xf1e8d8), floodlight: towerLit }
const greenM = { ...finish('indy-onc-copper', 0x7db5a1), floodlight: (_p: V3, _n: V3) => 0.7 }
const built = finishGlb('Old National Centre', [
  { part: wall, material: wallM },
  { part: band, material: bandM },
  { part: trim, material: trimM },
  { part: green, material: greenM },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('entrance', 0x7a5a3c) },
], { bearing: 1.5, height: 61.6, replaces: ['way/339829532'] }, 6500)
await writeModel('indy-old-national-centre', built)
