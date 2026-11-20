/**
 * The Bass (Bass Museum of Art), 2100 Collins Park, Miami Beach — the 1930
 * Art Deco building (Russell Pancoast, built as the Miami Beach Library and
 * Art Center) with its 2001 extension (Arata Isozaki) as enlarged in 2017
 * (David Gauld with arquitectonica) — original procedural geometry, CC0-1.0.
 * bun generators/mia-bass-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/483322279
 * (25.7975837, -80.1300881). The building runs 20° east of north, so the
 * catalog bearing is 20 and every coordinate below is in that turned frame
 * (+x is toward Collins Park, the 1930 front).
 *
 * Identity: the pale coral-stone (keystone) Art Deco front on Collins Park
 * — two projecting pavilions, each with one tall window, flanking a
 * recessed centre with three tall doors under carved relief panels, a
 * taller attic block behind, lower wings either side — and behind it the
 * plain white boxes of the extension, the tallest a long slab on the west.
 *
 * Sources:
 *  - OSM: way/483322279 (building=yes, height 16.4, name Bass Museum of
 *    Art, wikidata Q4867942); plan of every block from its points.
 *  - Lidar: NOAA Digital Coast EPT 10338 (2021 Florida coastal topobathy,
 *    public domain; FL_TopobathyFLKeysNOAA_Hydroflattened_2019 has no
 *    points on Miami Beach here), 0.5 m grid, read in this frame. Heights
 *    above the ground round it (lidar 0.6 m over ground_min): west slab
 *    14.6; central block 11.5; south-west wing 12.3; 1930 pavilions 10.5,
 *    its attic 11, its recessed centre's front 7.5, its wings 7.0–7.5; the
 *    low court block 7.0; north link 4.5 and 9; front steps 1.6. Measured.
 *    OSM's 16.4 is above all returns (likely a parapet or mast): not used.
 *  - Estimated from the photos below: door, window and relief-panel sizes
 *    and positions, pavilion projection (~1.8 m, also in the lidar).
 *  - Colours: keystone cream-grey for the 1930 building, bright white for
 *    the extension, dark window glass, pale carved panels, dark doors.
 *  - Night: the 1930 front is floodlit (`_FLOODLIGHT`), doors `entrance`,
 *    windows `window`. Estimate: no licensed night photo was found.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Miami_Beach_-_Bass_Museum_of_Art_entrance.jpg, P. Hughes, CC BY 4.0;
 *  - Miami_Beach_-_Bass_Museum_of_Art_Building.jpg, P. Hughes, CC BY 4.0
 *    — the front from the park (east): pavilions, doors, reliefs, attic;
 *  - Bass_Museum.jpg, Tamanoeconomico, CC BY-SA 4.0 — the front and the
 *    white extension behind, from the park;
 *  - The_Bass,_Collins_Park,_Miami_Beach,_Florida.jpg, Ken Lund,
 *    CC BY-SA 2.0 — from down the park's axis;
 *  - Bass_Museum_South_Beach_(12956989905).jpg, Phillip Pessar, CC BY 2.0
 *    — the full front with both wings.
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: no photo of the west (extension) side or the north link was
 * found; those are plain white boxes at their lidar heights. The OSM
 * outline omits the south pavilion's projection, which lidar shows; the
 * model follows the lidar. The carved reliefs are drawn as plain proud
 * panels.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, walls, capRing, face, build, outward } from './mia-panorama-tower'

const stone = new Part(), white = new Part(), win = new Part(), door = new Part(), roof = new Part(), relief = new Part()

/** A prism from a ring: walls in `wall`, flat roof. */
function block(r: XY[], z: number, wall: Part, z0 = 0) {
  const R = ccw(r)
  walls(R, [[z0, z, wall]])
  capRing(roof, R, z)
  return R
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flush panel on the wall facing +x at x, from y0..y1, z0..z1. */
const onEast = (part: Part, x: number, y0: number, y1: number, z0: number, z1: number, proud = 0.06) =>
  face(part, [[x + proud, y0, z0], [x + proud, y1, z0], [x + proud, y1, z1], [x + proud, y0, z1]], [1, 0, 0])
/** Window panels along every edge of a ring longer than 5 m, one per `bay`. */
function ringWindows(r: XY[], z0: number, z1: number, bay: number, w: number, keep: (o: XY, m: XY) => boolean = () => true) {
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 5) return
    const o = outward(a, b), m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (!keep(o, m)) return
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = Math.max(1, Math.floor(L / bay)), step = L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * step
      const P = (s: number, z: number): V3 => [a[0] + t[0] * s + o[0] * 0.06, a[1] + t[1] * s + o[1] * 0.06, z]
      face(win, [P(c - w / 2, z0), P(c + w / 2, z0), P(c + w / 2, z1), P(c - w / 2, z1)], [o[0], o[1], 0])
    }
  })
}

// ======================= the extension (white) =======================
const WEST = block([[-20.1, -1.9], [-12.1, -0.6], [-12.5, 20.9], [-16.0, 38.7], [-27.8, 36.3]], 14.6, white)
block(rect(-12.1, 13.6, -7.4, 20.0), 11.5, white)
block(rect(-29.5, 1.2, -16.0, -7.4), 12.3, white)
block(rect(0.7, 13.6, -22.6, -7.4), 7.0, white)
block([[-12.5, 20.9], [1.0, 21.4], [1.0, 31.7], [-14.5, 31.0]], 9.0, white)
block([[1.0, 20.0], [7.0, 20.0], [6.8, 31.9], [1.0, 31.7]], 4.5, white)
// a few tall slot windows on the extension's long faces (Tamanoeconomico: plain white boxes)
ringWindows(WEST, 3, 12, 9, 1.2, (o) => Math.abs(o[0]) > 0.8)

// ======================= the 1930 building (keystone) =======================
const PAV = 10.5, CTR_FRONT = 7.5, ATTIC = 11.0, WING = 7.0
const FX = 24.6, PX = 26.6                 // the centre's front, the pavilions' fronts
// wings
const SWING = block(rect(13.6, 23.0, -41.5, -24.5), WING, stone)
const NWING = block(rect(13.6, 23.5, 0, 17.8), 7.5, stone)
// pavilions
const PS = block(rect(13.6, PX, -24.5, -18.5), PAV, stone)
const PN = block(rect(13.6, PX, -6.0, 0), PAV, stone)
// recessed centre: a low front range and the attic behind it
block(rect(20.5, FX, -18.5, -6.0), CTR_FRONT, stone)
block(rect(13.6, 20.5, -18.5, -6.0), ATTIC, stone)
// parapet caps: a slightly proud lip on the pavilions and the attic (Art Deco stepped tops)
for (const [x0, x1, y0, y1, z] of [[13.4, PX + 0.25, -24.75, -18.25, PAV], [13.4, PX + 0.25, -6.25, 0.25, PAV], [13.4, 20.7, -18.7, -5.8, ATTIC]] as number[][]) {
  const r = ccw(rect(x0, x1, y0, y1)); walls(r, [[z - 0.6, z + 0.4, stone]]); capRing(roof, r, z + 0.4); capRing(stone, r, z - 0.6, false)
}

// the three doors under carved panels, in the recessed centre
for (const yc of [-15.5, -12.25, -9.0]) {
  onEast(door, FX, yc - 1.0, yc + 1.0, 1.6, 5.4)
  onEast(relief, FX, yc - 1.2, yc + 1.2, 5.8, 7.0, 0.12)
}
// a wide relief band over the attic's front
onEast(relief, 20.5, -17.8, -6.7, 8.4, 10.2, 0.1)
// one tall window in each pavilion's front, a relief plaque over it
for (const yc of [-21.5, -3.0]) {
  onEast(win, PX, yc - 0.9, yc + 0.9, 2.6, 7.6)
  onEast(relief, PX, yc - 1.2, yc + 1.2, 8.2, 9.4, 0.1)
}
// wing windows: tall, regular, on the front and the ends
// two rows on the wings, as the photos show (a tall lower light, a shorter upper one)
for (const [z0, z1] of [[1.4, 3.6], [4.3, 5.9]]) {
  ringWindows(ccw(SWING), z0, z1, 4.0, 1.5, (o) => o[0] > 0.8 || o[1] < -0.8)
  ringWindows(ccw(NWING), z0, z1, 4.0, 1.5, (o) => o[0] > 0.8 || o[1] > 0.8)
}
ringWindows(ccw(PS), 2.6, 7.6, 7, 1.6, (o) => o[1] < -0.8)
ringWindows(ccw(PN), 2.6, 7.6, 7, 1.6, (o) => o[1] > 0.8)

// the front steps up to the doors (lidar 1.6 m): three broad treads
for (let k = 0; k < 3; k++) {
  const x1 = FX + 2.9 - k * 0.95, z = 0.55 * (k + 1)
  const r = ccw(rect(FX - 0.2, x1, -18.4, -6.1)); walls(r, [[0, z, stone]]); capRing(stone, r, z)
}

const lit = (p: V3, n: V3) => (n[0] > 0.7 && p[0] > 20 && p[2] > 0.3 ? 0.85 : 0)
if (import.meta.main) {
  await build('The Bass', 'mia-bass-museum', [
    { part: stone, material: { ...finish('bass-keystone', 0xebe6da), floodlight: lit } },
    { part: white, material: finish('bass-white', 0xf3f2ee) },
    { part: win, material: { ...PALETTE.window, color: 0x6c7e8c } },
    { part: door, material: { ...PALETTE.entrance, color: 0x6b5a4c } },
    { part: roof, material: PALETTE.roof },
    { part: relief, material: { ...finish('bass-relief', 0xf6f1e4), floodlight: lit } },
  ], { bearing: 20, elevation: 0, height: 14.6, replaces: ['way/483322279'] }, process.argv[2], 5000)
}
