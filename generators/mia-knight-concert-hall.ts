/**
 * John S. and James L. Knight Concert Hall (2006, César Pelli), the
 * Adrienne Arsht Center's concert hall on the east side of Biscayne
 * Boulevard, Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-knight-concert-hall.ts [out.glb]
 *
 * Uses the Arsht materials and sloped-roof prism exported by
 * mia-arsht-center.ts (merge that first), so the two halls match.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/316752905,
 * 25.7876538, -80.1885596. Bearing 0 (the main walls run within 2° of the
 * compass axes).
 *
 * Identity: a pale stone hall whose roof rises to the south-east, stepped
 * stone tiers with ribbon windows on the south-west, and the great glass
 * lobby wall on the north front, leaning out over the marquee with the
 * hall's name, with a tapered glass stair prism at its east end.
 *
 * Sources:
 *  - OSM: outline way/316752905 (46.4 m) and the hall part way/468023522
 *    (no tags beyond building:part).
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid, above the street (ground_min + 0.5 m): hall roof a
 *    plane rising from 28 at the north-west to 44.3 at the south-east
 *    (measured), east blocks 30.5 and 18.5 (measured), south-west tiers
 *    10.6 and 18.5 (measured), west block 15.5 (measured), plinth/arcade
 *    6.6 (measured).
 *  - Estimated from the photos: the glass wall's lean (4.5 m out at the
 *    top), marquee depth, the stair prism (8 m square at the foot, 10 m at
 *    the top, 28 m tall), ribbon windows.
 *  - Colours: the same pale stone and green-blue glass as the Ziff.
 *
 * Photos (Wikimedia Commons):
 *  - Adrienne_Arsht_Center_for_the_Performing_Arts_of_Miami-Dade_County_-_Flickr_-_Phillip_Pessar.jpg,
 *    Phillip Pessar, CC BY 2.0 — the glass wall and stone hall from the
 *    north-west;
 *  - Knightconcerthall.jpg, Averette, CC BY 3.0 — the leaning glass wall
 *    and the stair prism from the street;
 *  - John_S._and_James_L._Knight_Concert_Hall_Miami_2008_HPIM2830.jpg,
 *    Mary Mark Ockerbloom, CC BY-SA 4.0 — night: the lit glass lobby and the
 *    marquee;
 *  - Knight_Concert_Hall.jpg, Robin Hill for the Knight Foundation,
 *    CC BY-SA 2.0 — the glazed entrance tower;
 *  - Adrienne_Arsht_Center_for_Performing_Arts_20100203.jpg, Averette,
 *    CC BY 3.0 — aerial from the north.
 * No commercial imagery or 3D tiles. No look-only sources.
 *
 * Doubts: the folded gable planes of the roof are drawn as one plane; the
 * east (service) side is seen only from above; the entrance tower of the
 * Knight Foundation photo is not placed with certainty and is left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { type XY, ccw, walls, capRing, face, build, panels } from './mia-panorama-tower'
import { ARSHT, slopedPrism, tier } from './mia-arsht-center'

const stone = new Part(), win = new Part(), glass = new Part(), roof = new Part(), neon = new Part()

const OUTLINE: XY[] = [[39.3, 33.6], [41.4, -33.9], [32.4, -38.5], [33.6, -40.9], [23.2, -46.2], [22.0, -43.9], [3.5, -53.4], [-27.0, -54.2], [-37.1, -37.3], [-37.4, -17.6], [-40.3, -17.6], [-40.3, -12.4], [-29.1, 6.9], [-37.2, 27.6], [-37.9, 29.5], [-32.9, 29.5], [-39.8, 42.7], [-40.0, 54.0], [-15.7, 54.9], [-15.6, 49.8], [20.6, 50.7], [22.5, 47.2], [26.1, 42.4], [30.5, 38.4], [35.6, 35.2]]
const PL = 6.6

// plinth and arcade, with the ground-floor glazing
{
  const p = ccw(OUTLINE)
  walls(p, [[0, PL, stone]])
  capRing(roof, p, PL)
  panels(glass, p, 0.4, 4.6, { bay: 9, pier: 1.4, rowH: 4.2, spandrel: 0.2, minEdge: 8 })
}
// tiers
tier(stone, win, roof, [[-36, -50], [6, -51], [6, -42], [-8, -36], [-14, -10], [-30, -6], [-35, -30]], PL, 10.6, false)
tier(stone, win, roof, [[-14, -41], [4, -43], [-3, -30], [-9, -8], [-18, -5]], PL, 18.5)
tier(stone, win, roof, [[-40, -13], [-29, -13], [-29, 24], [-37, 24]], PL, 15.5)
tier(stone, win, roof, [[22, 2], [34, 2], [34, 26], [22, 26]], PL, 18.5)
tier(stone, win, roof, [[34, -30], [40, -30], [40, 12], [34, 12]], PL, 18.5)
tier(stone, win, roof, [[24, -34], [36, -34], [36, 2], [24, 2]], PL, 30.5)
// the hall: roof rising to the south-east
const HALL: XY[] = [[-36, 44], [12, 44], [20, 28], [27, 6], [27, -38], [0, -41], [-6, -30], [-12, -10], [-24, 8], [-32, 24]]
const zr = (x: number, y: number) => 37.6 + 0.09 * x - 0.16 * y
slopedPrism(stone, roof, ccw(HALL), PL, zr)
panels(win, ccw(HALL), 21, 23.6, { bay: 9, pier: 2.6, rowH: 2.6, spandrel: 0, minEdge: 10 })

// the leaning glass lobby wall on the north front
{
  const x0 = -30, x1 = 12, yb = 44.2, yt = 48.7, zb = PL, zt = 29.5
  const n: V3 = [0, 0.98, 0.2]
  face(glass, [[x1, yb, zb], [x0, yb, zb], [x0, yt, zt], [x1, yt, zt]].map((p) => p as V3).reverse(), n)
  face(glass, [[x0, yb, zb], [x0, yt, zt], [x0, 44, zt]], [-1, 0, 0])
  face(glass, [[x1, yb, zb], [x1, 44, zt], [x1, yt, zt]], [1, 0, 0])
  face(roof, [[x0, 44, zt], [x0, yt, zt], [x1, yt, zt], [x1, 44, zt]], [0, 0, 1])
  // mullion lines on the glass, every ~9 m, a few floor lines (pale trim in stone)
  for (let k = 1; k < 5; k++) {
    const x = x0 + ((x1 - x0) * k) / 5
    face(stone, [[x - 0.35, yb + 0.06, zb], [x + 0.35, yb + 0.06, zb], [x + 0.35, yt + 0.06, zt], [x - 0.35, yt + 0.06, zt]], n)
  }
  // marquee with the hall's name over the doors
  const m: XY[] = [[x0 + 4, 44], [x1 - 2, 44], [x1 - 2, 51], [x0 + 4, 51]]
  walls(ccw(m), [[PL, PL + 1.4, neon]])
  capRing(roof, ccw(m), PL + 1.4)
  capRing(stone, ccw(m), PL, false)
}
// the tapered glass stair prism at the wall's east end (east in the photos from the north)
{
  const foot: XY[] = [[12.5, 41.5], [20, 41.5], [20, 49], [12.5, 49]], head: XY[] = [[12, 40.5], [21, 40.5], [21, 49.5], [12, 49.5]]
  const R0 = foot.map(([x, y]) => [x, y, 0] as V3), R1 = head.map(([x, y]) => [x, y, 28] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const a = R0[i], b = R0[j]
    const nn: V3 = [b[1] - a[1], -(b[0] - a[0]), 0.1]; const l = Math.hypot(...nn)
    face(glass, [R0[i], R0[j], R1[j], R1[i]], [nn[0] / l, nn[1] / l, nn[2] / l])
  }
  face(roof, R1, [0, 0, 1])
}

if (import.meta.main) {
  await build('Knight Concert Hall', 'mia-knight-concert-hall', [
    { part: stone, material: ARSHT.stone },
    { part: win, material: ARSHT.band },
    { part: glass, material: ARSHT.glass },
    { part: roof, material: ARSHT.roof },
    { part: neon, material: finish('neon-knight-marquee', 0xf3ead6) },
  ], { bearing: 0, elevation: 0, height: 44.3, replaces: ['way/316752905', 'way/468023522'] }, process.argv[2], 6500)
}
