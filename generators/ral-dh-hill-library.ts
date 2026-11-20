/**
 * D. H. Hill Jr. Library, NC State University, Raleigh (1953; bookstack
 * tower and front 1971; Erdahl-Cloyd Wing): procedural, CC0-1.0.
 * bun generators/ral-dh-hill-library.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 15 (every
 * OSM wall here runs at 15°/105°). Origin: the lead's anchor
 * (-78.670275, 35.787316), on the stack tower's south front, so the
 * model sits on the Brickyard side; the OSM rings below are in this frame.
 * y = 0 is the lowest ground under the footprint, the Brickyard at the
 * south front. Mapterhorn (z13; z14–15 missing here) rises ~3 m to the
 * north side; walls run down to y = 0 and sink into it. Elevation 0.
 *
 * OSM (all replaced):
 *  relation/21814620 "D. H. Hill Library" (levels "11;3"), outers
 *    way/234727994 (the stack tower x −8.7..38.4, y 1.8..21, and the
 *    banded west block x −8.7..13.3, y 21..59) and way/242881686 (the east
 *    wing, x 13.3..95.4, y 21..62, a bay to y 68.5);
 *  way/242881687 (levels 6): the projecting front block on the Brickyard,
 *    x −15.5..13.2, y −3.7..1.8;
 *  way/47732447 "Erdahl Cloyd Wing" (levels 3): x −66..−8.6, y 14.5..57,
 *    with the stair shaft's notch at x −14.3..−8.6, y 21.3..28.4.
 * No lidar covers Wake County. Heights are estimated:
 *  - the stack tower 49 m: h01 (zoomed) shows about 11½ storeys of the
 *    front block's storey height (~4.25 m: the front is 6.7 such storeys)
 *    from the Brickyard to the tower's parapet, so 1.7 × the front block
 *    (OSM levels 11). NAIP's shadow on the Erdahl-Cloyd roof (~25–30 m
 *    long; the Memorial Belltower, 35 m published, casts 0.9 × its height
 *    on the same flight) fits 40–50 m; raised from 44 m in review;
 *  - the front block 28.5 m: a two-storey open base on piers (h01) and
 *    five 4 m storeys of deep windows with tan sills;
 *  - the stair shaft 46 m, a little under the tower (h01, h07);
 *  - the banded west block 34 m, nine storeys of pale bands (h01, h02);
 *  - the east wing 16 m (h05: about a third of the tower);
 *  - Erdahl-Cloyd 12.5 m over its ground (three levels, OSM; h03).
 *  - the antenna mast on the tower's west end, ~14 m with a dish (h01,
 *    h02, h06, h07).
 *
 * Photos (evidence):
 *  h01 "DH Hill Library.JPG", Bmclayto, CC BY-SA 4.0 (from the Brickyard, SW)
 *      https://commons.wikimedia.org/wiki/File:DH_Hill_Library.JPG
 *  h02 "D.H. Hill Library.JPG", Surrahwall, CC BY-SA 3.0 (from the SW)
 *      https://commons.wikimedia.org/wiki/File:D.H._Hill_Library.JPG
 *  h03 "D.H. Hill terrace.jpg", Jbrubins, CC BY-SA 3.0 (Erdahl-Cloyd's glazed front)
 *      https://commons.wikimedia.org/wiki/File:D.H._Hill_terrace.jpg
 *  h05 "NCSU campus 064.JPG", Haruhide000, CC BY-SA 3.0 (from the east lawn)
 *      https://commons.wikimedia.org/wiki/File:NCSU_campus_064.JPG
 *  h06 "D.H. Hill Library", Skakerman (Archive), CC BY 2.0 (the top, mast)
 *      https://www.flickr.com/photos/27482959@N08/2968578025
 *  h07, h08 "NCSU Libraries - D.H. Hill Library", orionpozo, CC BY 2.0
 *      https://www.flickr.com/photos/65168863@N00/3621272957
 *      https://www.flickr.com/photos/65168863@N00/3621271799
 *  h10 "NCSU DH HILL Library.png", Thunder8, public domain
 *      https://commons.wikimedia.org/wiki/File:NCSU_DH_HILL_Library.png
 * Aerial: USGS NAIP (public domain): plan, roofs (the tower's dark
 * membrane, drawn dark so the tower reads from above at phone size; the
 * west block's white roof and red parapet), shadows.
 * Look-only (CC BY-NC-ND, not used for shape): jdbradway "dh hill from
 * the north", Flickr 3536468432.
 *
 * Colours: a dull orange-red brick (h01, h02), pulled light; tan cast
 * stone sills and pale concrete bands; slate windows.
 * Invented: the north and east sides of the east wing and the north side
 * of the west block (no licensed photo): grouped windows like the photographed
 * sides. The bay rhythm of the east wing.
 * Doubts: the split between the tower and the west block comes from NAIP
 * roof colours and h01; every height is estimated.
 * Left out: the Brickyard stairs and ramps, rooftop plant, the dish's
 * lattice (drawn solid).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, rect, prism, capRing, lathe, outward, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const TOWER = 49, FRONT = 28.5, SHAFT = 46, WEST = 34, EAST = 16, ERD = 12.5
const ground = (y: number) => 0.2 + 0.045 * Math.max(0, y)

const T = rect(-8.7, 1.8, 38.4, 21)
const W = rect(-8.7, 21, 13.3, 58.9)
const E: XY[] = [[13.3, 21], [95.4, 21], [95.4, 62.4], [40.1, 62.4], [40.1, 68.5], [32.4, 68.5], [32.4, 61.7], [18.7, 61.7], [18.7, 49.8], [13.3, 49.8]]
const F = rect(-15.5, -3.7, 13.2, 1.8)
const S = rect(-14.3, 21.3, -8.6, 28.4)
const C: XY[] = [[-8.6, 28.4], [-8.6, 50.3], [-14.2, 50.3], [-14.2, 56.9], [-66.1, 56.9], [-66.1, 21.5], [-53.1, 21.5], [-53.1, 14.5], [-27.2, 14.6], [-27.2, 21.2], [-14.3, 21.3], [-14.3, 28.4]]

/** Every edge of a ring as a face, with its length and mid-point. */
function edges(r: XY[]) {
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return { f: { o: [a[0], a[1], 0], n: outward(a, b) } as Face, L, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as XY }
  })
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), metal = new Part(), membrane = new Part()

  // ------------------------------------------------------------ the stack tower
  prism(brick, membrane, T, 0, TOWER) // NAIP: the tower's dark membrane roof
  for (const { f, L, m } of edges(T)) {
    panel(stone, f, L / 2, L, TOWER - 0.7, TOWER, 0.06)
    // bays of horizontal windows, two stack levels to a panel, a tan sill band under each
    const bays = Math.max(1, Math.round(L / 6.6)), bw = L / bays
    const z0 = m[1] > 15 ? WEST + 1 : 3.5 // the north face shows over the west block only
    for (let z = 6; z + 2.4 < TOWER - 1.5; z += 6) {
      if (z < z0) continue
      panel(stone, f, L / 2, L - 1.2, z - 0.6, z, 0.05)
      for (let k = 0; k < bays; k++) panel(win, f, bw * (k + 0.5), bw - 2.2, z + 0.4, z + 2.6, 0.06)
    }
  }
  // the antenna mast at the west end, with its dish
  box(metal, -7.2, 15.5, -6.2, 16.5, TOWER, TOWER + 13, null, 0)
  lathe(metal, -6.7, 16, [[0.001, TOWER + 13], [0.9, TOWER + 13.2], [1.1, TOWER + 14], [0.9, TOWER + 14.8], [0.001, TOWER + 15]], 10)
  box(metal, -6.5, 17.5, -5.5, 18.5, TOWER, TOWER + 3, metal, 0)

  // ------------------------------------------------------------ the front block on piers
  const F0 = 7.6 // its underside over the open base
  prism(brick, roof, F, F0, FRONT)
  capRing(brick, F, F0, false)
  for (const { f, L, m } of edges(F)) {
    panel(stone, f, L / 2, L, FRONT - 0.7, FRONT, 0.06)
    if (m[1] > 0) continue // the back is against the tower
    const bays = Math.max(1, Math.round(L / 7.2)), bw = L / bays
    for (let k = 0; k < bays; k++) {
      const s = bw * (k + 0.5)
      for (let z = F0 + 1.4; z + 2.4 < FRONT - 1; z += 4) {
        panel(stone, f, s, bw - 1.4, z - 1.2, z, 0.1) // the deep tan sill
        panel(win, f, s, bw - 1.4, z, z + 2.0, 0.04)
        panel(stone, f, s, bw - 1.4, z + 2.0, z + 2.4, 0.06) // and its head
      }
    }
  }
  // piers down to the Brickyard, and the glazed entrance wall behind them
  for (const x of [-15.5, -8.3, -1.1, 6.1, 13.2]) {
    const x0 = Math.max(-15.5, x - 0.6), x1 = Math.min(13.2, x + 0.6)
    box(brick, x0, -3.7, x1, -2.5, 0, F0, null, 0)
  }
  panel(win, { o: [-8.7, 1.8, 0], n: [0, -1] }, 9, 16, 1.0, F0 - 0.8, 0.05)

  // ------------------------------------------------------------ the stair shaft
  prism(brick, roof, S, 0, SHAFT)
  for (const { f, L } of edges(S)) panel(stone, f, L / 2, L, SHAFT - 0.5, SHAFT, 0.05)

  // ------------------------------------------------------------ the banded west block
  prism(brick, stone, W, 0, WEST) // NAIP: a white roof
  for (const { f, L, m } of edges(W)) {
    panel(stone, f, L / 2, L, WEST - 0.8, WEST, 0.06)
    if (m[0] > 10 && m[1] < 50) continue // against the east wing
    const g = ground(m[1])
    for (let z = Math.max(g + 4.4, 7.4); z + 1 < WEST - 2; z += 3.4) panel(stone, f, L / 2, L, z, z + 1.1, 0.06)
    // narrow windows between the bands, grouped in bays
    const bays = Math.max(1, Math.round(L / 6)), bw = L / bays
    for (let k = 0; k < bays; k++) {
      for (let z = Math.max(g + 5.5, 8.5); z + 2.3 < WEST - 2; z += 3.4) panel(win, f, bw * (k + 0.5), bw - 2.6, z + 0.15, z + 2.15, 0.04)
    }
  }

  // ------------------------------------------------------------ the east wing
  prism(brick, roof, E, 0, EAST)
  for (const { f, L, m } of edges(E)) {
    panel(stone, f, L / 2, L, EAST - 0.7, EAST, 0.06)
    if (L < 6 || (m[0] < 14 && m[1] < 50)) continue
    const g = ground(m[1])
    const bays = Math.max(1, Math.round(L / 6.5)), bw = L / bays
    for (let k = 0; k < bays; k++) {
      const s = bw * (k + 0.5)
      panel(win, f, s, bw - 2, g + 1.2, g + 6.2, 0.05)
      panel(win, f, s, bw - 2, g + 7.6, EAST - 1.6, 0.05)
    }
    panel(stone, f, L / 2, L, g + 6.5, g + 7.3, 0.06)
  }

  // ------------------------------------------------------------ Erdahl-Cloyd
  const cTop = (y: number) => ground(y) + ERD
  const ERDTOP = ground(35) + ERD
  prism(brick, roof, C, 0, ERDTOP)
  for (const { f, L, m } of edges(C)) {
    if (L < 5 || m[0] > -9) continue
    const g = ground(m[1]), top = cTop(m[1])
    // concrete fascias and two glazed storeys (h03)
    panel(stone, f, L / 2, L, Math.min(top, ERDTOP) - 1.4, ERDTOP, 0.06)
    panel(win, f, L / 2, L - 0.8, g + 5.0, Math.min(top, ERDTOP) - 1.6, 0.05)
    panel(stone, f, L / 2, L, g + 4.0, g + 4.9, 0.06)
    panel(win, f, L / 2, L - 0.8, Math.max(g + 0.4, 0.4), g + 3.6, 0.05)
    for (let s = 3; s < L - 1; s += 3) panel(stone, f, s, 0.3, g + 5.0, Math.min(top, ERDTOP) - 1.6, 0.08)
  }

  return finishGlb('D. H. Hill Library', [
    { part: brick, material: finish('dh-brick', 0xb87560) },
    { part: stone, material: finish('dh-cast-stone', 0xe8dcc2) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: PALETTE.metal },
    { part: membrane, material: finish('dh-membrane', 0x5f6468) },
  ], { bearing: 15, height: TOWER + 15, replaces: ['relation/21814620', 'way/242881687', 'way/47732447'] }, 5000)
}

if (import.meta.main) await writeModel('ral-dh-hill-library', build())
