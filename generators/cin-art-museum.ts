/**
 * Cincinnati Art Museum, 953 Eden Park Drive, Eden Park, Cincinnati —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-art-museum.ts
 *
 * The museum grew round a courtyard: the 1886 Romanesque building (James
 * W. McLaughlin) of rough grey stone with its campanile and green copper
 * roofs; the 1907 Schmidlapp wing with the Doric temple-front entrance on
 * the north (Daniel Burnham); the 1910 Ropes wing and the 1930 Herbert
 * Greer French building in smooth limestone along the north front, with an
 * Ionic loggia between; and the 1930s–1960s galleries round the south.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 4.6 (the building's grid). Anchor = centroid of
 * OSM relation/1338829, -84.497038, 39.113985.
 *
 * Identity (from the photos below):
 *  1. The temple front facing the drive: four big fluted columns in antis
 *     on a stepped podium, a full entablature and a low pediment.
 *  2. The long smooth-limestone north front west of it: the Ionic loggia
 *     (four columns between pylons, attic over) and the tall plain block
 *     of the French building beyond.
 *  3. The campanile of the 1886 building rising behind, rough stone with
 *     paired arched openings and a low copper cap.
 *  4. The big green copper hipped and pyramidal roofs of the 1886 core;
 *     flat roofs on the later wings round the courtyard.
 *
 * Plan: OSM relation/1338829 (outer way/46648749, inner court way/91071807)
 * and its 37 building:part ways, read in the turned frame; each part is
 * drawn as its ring (flat) or its ring's bounding rectangle (pitched
 * roofs). The west block (x < -35.5, with the rounded west end) has no
 * parts in OSM and is drawn from the relation's outer ring.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 1 m grid read per part in this frame (median for flat
 * roofs, the 1.5 m edge band for eaves, the 95th percentile for ridges).
 * y = 0 is the lowest ground under the footprint, the south side (lidar
 * ground_min + 7.5); the north front stands on ground about 6 m higher.
 * Measured: north front 19–21, French building 24–25.6, south galleries
 * 19.5–23.5, the copper pyramid 36.0, campanile 42.8 at its cap.
 * Estimated from the head-on photo (scaled by the lidar): the portico's
 * podium (2.4 m), columns (7.6 m), entablature and pediment; the loggia;
 * windows and doors.
 *
 * Ground: Mapterhorn and lidar both show the site falling about 6 m from
 * the north drive to the south side; elevation 0.
 *
 * Night: the windows and the entrance doors glow.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Cincinnati Art Museum, Eden Park.jpg, Greg Hume (Greg5030),
 *    CC BY-SA 3.0 (the north front: temple, loggia, French building,
 *    campanile behind) https://commons.wikimedia.org/wiki/File:Cincinnati_Art_Museum,_Eden_Park.jpg
 *  - Cincinnati Art Museum 2015.jpg, 5chw4r7z, CC BY-SA 2.0 (the temple
 *    front from the north-west) https://commons.wikimedia.org/wiki/File:Cincinnati_Art_Museum_2015.jpg
 *  - Cincinnati Art Museum front facade, January 2019 (3).jpg, Jason
 *    Zhang, CC BY-SA 3.0 (portico columns and door)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Art_Museum_front_facade,_January_2019_(3).jpg
 *  - Cincinnati Art Museum exterior from library balcony.jpg, Jason Zhang,
 *    CC BY-SA 3.0 (the 1886 rough-stone range and copper roofs)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Art_Museum_exterior_from_library_balcony.jpg
 *  - Cincinnati Art Museum, Cincinnati, Ohio.jpg, Detroit Publishing
 *    Company, public domain (the 1886 building with its campanile)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Art_Museum,_Cincinnati,_Ohio.jpg
 * Aerial: USGS NAIP (public domain) for plan and roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south and east sides are not in the photos used; their
 * walls are plain with a few window groups. The west block's use is not
 * known; it is drawn as plain limestone. Pitched roofs over irregular
 * rings use the bounding rectangle.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, capPoly, cornice, gableRoof, hipRoof, onWall, prism, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'

type P = { id: string; roof: string; wall: number; top: number; rough: boolean; cu: boolean; ring: XY[] }
// rings in this frame and lidar heights (wall: eave band; top: ridge) — see header
const PARTS: P[] = [
  { id: 'way/1454674690', roof: 'flat', wall: 19.9, top: 24.4, rough: false, cu: false, ring: [[-1.1,34.1],[-1.2,36.5],[-19.2,36.5],[-19.2,34.1]] },
  { id: 'way/1454674691', roof: 'flat', wall: 19.3, top: 24.4, rough: false, cu: false, ring: [[-19.2,49.2],[-19.2,45.8],[-15.4,45.8],[-15.4,49.2]] },
  { id: 'way/1454674692', roof: 'flat', wall: 13.6, top: 18.9, rough: false, cu: false, ring: [[-1.2,46.1],[-4.6,46.1],[-4.6,49.1],[-1.3,49.1]] },
  { id: 'way/1454674693', roof: 'flat', wall: 20.4, top: 20.9, rough: false, cu: false, ring: [[-15.4,49.2],[-4.6,49.1],[-4.6,46.1],[-1.2,46.1],[-1.2,36.5],[-19.2,36.5],[-19.2,45.8],[-15.4,45.8]] },
  { id: 'way/1454674694', roof: 'gabled', wall: 20.3, top: 20.9, rough: false, cu: false, ring: [[-18.1,44.9],[-18.2,37.3],[-2.3,37.3],[-2.4,45.0]] },
  { id: 'way/1454674695', roof: 'flat', wall: 20.0, top: 20.5, rough: false, cu: false, ring: [[9.7,25.3],[9.4,-3.0],[19.3,-3.0],[19.8,22.5],[19.9,25.4]] },
  { id: 'way/1454674696', roof: 'flat', wall: 18.1, top: 18.7, rough: false, cu: false, ring: [[31.3,33.0],[34.9,33.3],[34.7,22.3],[19.8,22.5],[19.9,25.4],[23.3,25.4],[23.3,32.9]] },
  { id: 'way/1454674697', roof: 'flat', wall: 10.2, top: 20.0, rough: false, cu: false, ring: [[19.8,22.5],[19.3,-3.0],[22.8,-3.1],[28.7,-3.1],[28.7,-3.5],[32.4,-3.5],[34.3,-3.5],[34.7,22.3]] },
  { id: 'way/1454675350', roof: 'gabled', wall: 19.1, top: 20.7, rough: false, cu: true, ring: [[5.8,57.4],[14.8,57.4],[23.1,57.5],[23.2,49.8],[23.3,32.9],[23.3,25.4],[19.9,25.4],[9.7,25.3],[6.0,25.2],[6.0,32.8],[5.8,49.6]] },
  { id: 'way/1454675351', roof: 'gabled', wall: 19.3, top: 21.1, rough: false, cu: true, ring: [[-1.3,49.5],[-1.3,49.1],[-1.2,46.1],[-1.2,36.5],[-1.1,34.1],[-1.1,32.7],[6.0,32.8],[23.3,32.9],[31.3,33.0],[31.1,49.9],[23.2,49.8],[5.8,49.6]] },
  { id: 'way/1454676033', roof: 'flat', wall: 19.8, top: 22.2, rough: false, cu: false, ring: [[-32.1,-33.8],[-32.1,-37.2],[-38.2,-37.1],[-38.3,-41.9],[-32.0,-41.9],[-32.0,-44.7],[-32.1,-53.7],[60.1,-54.0],[60.2,-35.0],[50.6,-35.0],[50.7,-42.9],[28.7,-42.9],[1.1,-42.8],[1.0,-33.1],[1.0,-31.8],[-20.8,-31.6],[-20.8,-33.9],[-26.5,-33.9]] },
  { id: 'way/1454676034', roof: 'flat', wall: 23.5, top: 23.6, rough: false, cu: false, ring: [[1.0,-33.1],[6.1,-33.1],[6.1,-35.3],[23.1,-35.2],[23.1,-33.4],[28.8,-33.5],[28.7,-42.9],[1.1,-42.8]] },
  { id: 'way/1454676035', roof: 'flat', wall: 20.7, top: 21.4, rough: false, cu: false, ring: [[28.8,-33.5],[28.7,-32.0],[50.1,-32.3],[50.1,-34.9],[50.6,-35.0],[50.7,-42.9],[28.7,-42.9]] },
  { id: 'way/1454676036', roof: 'gabled', wall: 21.6, top: 21.8, rough: false, cu: true, ring: [[11.7,-44.9],[11.8,-50.9],[17.7,-50.8],[17.6,-44.9]] },
  { id: 'way/1454677559', roof: 'flat', wall: 9.1, top: 25.7, rough: false, cu: false, ring: [[32.4,-3.5],[32.4,-7.8],[28.7,-7.8],[28.6,-14.2],[41.7,-14.1],[41.8,-3.6]] },
  { id: 'way/1454677560', roof: 'pyramidal', wall: 26.5, top: 27.2, rough: false, cu: false, ring: [[28.7,-3.5],[28.7,-7.8],[32.4,-7.8],[32.4,-3.5]] },
  { id: 'way/1454677561', roof: 'flat', wall: 21.6, top: 24.0, rough: false, cu: false, ring: [[-35.5,29.2],[-35.5,32.9],[-20.5,32.9],[-20.6,2.6],[-20.7,-1.9],[-32.5,-1.9],[-35.7,-1.8]] },
  { id: 'way/1454677562', roof: 'flat', wall: 22.2, top: 22.6, rough: false, cu: false, ring: [[-19.8,49.8],[-19.8,54.5],[-35.5,54.5],[-35.5,53.7],[-35.5,49.7]] },
  { id: 'way/1454677563', roof: 'flat', wall: 24.4, top: 25.3, rough: false, cu: false, ring: [[-35.5,49.7],[-36.3,49.7],[-36.3,48.8],[-36.2,45.9],[-36.2,36.9],[-36.2,33.5],[-36.2,32.9],[-35.5,32.9],[-20.5,32.9],[-19.2,32.9],[-19.2,34.1],[-19.2,36.5],[-19.2,45.8],[-19.2,49.2],[-19.2,49.8],[-19.8,49.8]] },
  { id: 'way/1454677564', roof: 'hipped', wall: 22.1, top: 23.9, rough: false, cu: false, ring: [[-34.0,31.9],[-34.1,-0.5],[-21.9,-0.5],[-21.8,31.9]] },
  { id: 'way/1454677565', roof: 'hipped', wall: 24.0, top: 25.6, rough: false, cu: false, ring: [[-33.4,47.9],[-33.4,34.6],[-21.0,34.6],[-21.0,47.9]] },
  { id: 'way/1454682944', roof: 'flat', wall: 10.8, top: 10.9, rough: false, cu: true, ring: [[-18.2,2.6],[2.1,2.5],[2.0,-2.9],[1.2,-2.9],[-2.7,-2.9],[-18.2,-2.9]] },
  { id: 'way/1454684290', roof: 'pyramidal', wall: 41.6, top: 42.8, rough: true, cu: true, ring: [[2.0,-2.9],[2.0,-7.8],[1.2,-7.8],[-2.8,-7.7],[-2.7,-4.8],[-2.7,-2.9],[1.2,-2.9]] },
  { id: 'way/1454684291', roof: 'flat', wall: 21.9, top: 24.9, rough: false, cu: false, ring: [[28.6,-14.2],[41.7,-14.1],[61.2,-14.1],[61.2,-34.9],[60.2,-35.0],[50.6,-35.0],[50.1,-34.9],[50.1,-32.3],[51.1,-32.3],[51.1,-29.5],[51.1,-26.6],[51.1,-23.5],[28.5,-23.5]] },
  { id: 'way/1454684292', roof: 'flat', wall: 22.3, top: 24.5, rough: false, cu: false, ring: [[-20.7,-2.8],[-20.7,-4.7],[-20.7,-13.1],[-20.8,-23.4],[1.1,-23.5],[1.1,-21.8],[-4.1,-21.7],[-4.1,-13.9],[-2.7,-13.9],[-2.7,-13.2],[-2.8,-7.7],[-2.7,-4.8],[-2.7,-2.9]] },
  { id: 'way/1454684968', roof: 'gabled', wall: 21.7, top: 22.2, rough: false, cu: false, ring: [[31.0,-16.3],[30.9,-22.4],[49.1,-22.6],[49.1,-16.5]] },
  { id: 'way/1454684969', roof: 'gabled', wall: 22.2, top: 23.2, rough: false, cu: false, ring: [[-20.7,-4.7],[-20.7,-13.1],[-2.7,-13.2],[-2.8,-7.7],[-2.7,-4.8]] },
  { id: 'way/1454684970', roof: 'hipped', wall: 22.7, top: 25.0, rough: false, cu: false, ring: [[51.1,-23.5],[51.0,-15.3],[60.0,-15.3],[60.1,-33.6],[51.1,-33.7],[51.1,-32.3],[51.1,-29.5],[51.1,-26.6]] },
  { id: 'way/1454685730', roof: 'gabled', wall: 24.9, top: 26.3, rough: false, cu: false, ring: [[28.5,-23.5],[28.5,-26.5],[28.5,-29.5],[51.1,-29.5],[55.6,-29.5],[55.6,-23.5],[51.1,-23.5]] },
  { id: 'way/1454687972', roof: 'gabled', wall: 25.5, top: 26.3, rough: false, cu: false, ring: [[-20.8,-23.4],[-20.8,-26.5],[-20.8,-29.2],[1.0,-29.2],[1.0,-26.5],[1.1,-23.5]] },
  { id: 'way/1454687973', roof: 'pyramidal', wall: 29.6, top: 36.0, rough: true, cu: true, ring: [[5.0,-9.3],[5.0,-14.0],[5.0,-21.8],[5.0,-26.5],[24.6,-26.5],[24.5,-9.2],[22.8,-9.3],[6.6,-9.2]] },
  { id: 'way/1454688525', roof: 'flat', wall: 28.2, top: 41.2, rough: true, cu: false, ring: [[-2.8,-7.7],[-2.7,-13.2],[-2.7,-13.9],[-4.1,-13.9],[-4.1,-21.7],[1.1,-21.8],[5.0,-21.8],[5.0,-14.0],[1.1,-14.0],[1.2,-7.8]] },
  { id: 'way/1454689350', roof: 'pyramidal', wall: 24.1, top: 36.0, rough: true, cu: true, ring: [[2.0,-2.9],[6.6,-3.0],[9.4,-3.0],[19.3,-3.0],[22.8,-3.1],[28.7,-3.1],[28.7,-3.5],[28.7,-7.8],[28.6,-14.2],[28.5,-23.5],[28.5,-26.5],[28.5,-29.5],[28.5,-32.0],[1.0,-31.8],[1.0,-29.2],[1.0,-26.5],[1.1,-23.5],[1.1,-21.8],[1.1,-14.0],[1.2,-7.8],[1.2,-2.9]] },
  { id: 'way/1454689850', roof: 'gabled', wall: 26.2, top: 36.7, rough: true, cu: true, ring: [[6.6,-3.0],[6.6,-9.2],[22.8,-9.3],[22.8,-3.1],[19.3,-3.0],[9.4,-3.0]] },
  { id: 'way/1454689851', roof: 'hipped', wall: 35.4, top: 36.8, rough: true, cu: false, ring: [[10.8,-15.0],[10.8,-20.5],[18.8,-20.4],[18.7,-15.0]] },
  { id: 'way/1454691966', roof: 'skillion', wall: 24.4, top: 28.2, rough: false, cu: true, ring: [[-25.9,-31.6],[-25.9,-26.5],[-20.8,-26.5],[1.0,-26.5],[5.0,-26.5],[24.6,-26.5],[28.5,-26.5],[51.1,-26.6],[51.1,-29.5],[51.1,-32.3],[50.1,-32.3],[28.7,-32.0],[28.8,-33.5],[23.1,-33.4],[23.1,-35.2],[6.1,-35.3],[6.1,-33.1],[1.0,-33.1],[1.0,-31.8],[-20.8,-31.6]] },
  { id: 'way/1454693683', roof: 'hipped', wall: 28.3, top: 33.4, rough: true, cu: true, ring: [[6.1,-33.1],[6.1,-35.3],[23.1,-35.2],[23.1,-33.4],[23.1,-20.4],[18.8,-20.4],[10.8,-20.5],[6.1,-20.5]] },
]

/** A four-sided pyramid over a rectangle. */
function rectPyramid(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0], t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
  p.tri(a, b, t); p.tri(b, c, t); p.tri(c, d, t); p.tri(d, a, t)
}
/** A frustum (mansard) from one rectangle at z0 to an inner one at z1, capped. */
function frustum(p: Part, o: number[], i: number[], z0: number, z1: number, cap = true) {
  const R = (r: number[], z: number): V3[] => [[r[0], r[2], z], [r[1], r[2], z], [r[1], r[3], z], [r[0], r[3], z]]
  p.loft([R(o, z0), R(i, z1)])
  if (cap) p.cap(R(i, z1), true)
}
const bb = (r: XY[]) => [Math.min(...r.map((q) => q[0])), Math.max(...r.map((q) => q[0])), Math.min(...r.map((q) => q[1])), Math.max(...r.map((q) => q[1]))]

if (import.meta.main) {
  const stone = new Part(), rough = new Part(), trim = new Part(), win = new Part(), cu = new Part(), roof = new Part()
  const byId = Object.fromEntries(PARTS.map((p) => [p.id, p]))
  const special = new Set(['way/1454687973', 'way/1454689350', 'way/1454684290', 'way/1454689851', 'way/1454675350', 'way/1454674693', 'way/1454674691', 'way/1454674692'])

  for (const p of PARTS) {
    if (special.has(p.id)) continue
    const walls = p.rough ? rough : stone, top = p.cu ? cu : roof
    const [x0, x1, y0, y1] = bb(p.ring)
    if (p.roof === 'flat' || p.roof === 'skillion' || p.roof === 'None') {
      prism(walls, p.ring, 0, p.wall - 0.7, null, 0)
      // the limestone cornice that caps every block
      cornice(walls === stone ? trim : walls, p.ring, p.wall - 0.7, 0.7, 0.3, roof)
      continue
    }
    const eave = p.wall, ridge = Math.max(p.top, eave + 1.5)
    box(walls, x0, x1, y0, y1, 0, eave, null, 0)
    if (p.roof === 'gabled') gableRoof(top, walls, x0, x1, y0, y1, eave, ridge, x1 - x0 >= y1 - y0 ? 'x' : 'y', 0.3, 0.2)
    else if (p.roof === 'hipped') hipRoof(top, x0, x1, y0, y1, eave, ridge, 0.3)
    else rectPyramid(top, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, eave, ridge)
  }

  // ── the west block (no OSM parts): main body, the lower north strip, the rounded west end ──
  {
    box(stone, -67.0, -35.5, 29.2, 50.0, 0, 21.8, null, 0)
    cornice(trim, [[-67.0, 29.2], [-35.5, 29.2], [-35.5, 50.0], [-67.0, 50.0]], 21.8, 0.7, 0.3, roof)
    box(stone, -66.9, -35.5, 50.0, 53.8, 0, 16.0, roof, 0.3)
    // counter-clockwise: west along the north side, round the west end, back east
    const apse: XY[] = [[-66.0, 51.0], [-67.0, 51.0], [-70.1, 50.5], [-73.0, 49.3], [-75.3, 47.2], [-76.8, 44.5], [-77.4, 41.5], [-77.0, 38.4], [-75.5, 35.6], [-73.3, 33.5], [-70.5, 32.1], [-67.2, 31.7], [-66.0, 31.7]]
    prism(stone, apse, 0, 16.0, roof, 0.3)
    // tall narrow windows in groups on its north face
    for (const s of [6, 10, 22, 26]) onWall(win, [-35.5, 53.8], [-66.9, 53.8], rectShape(s - 0.7, s + 0.7, 8.5, 14.0), 0.06)
  }

  // ── the copper core of the 1886 building: walls, a mansard stage, the pyramid and its lantern ──
  {
    const A = byId['way/1454689350'], B = byId['way/1454687973'], L = byId['way/1454689851']
    const a = bb(A.ring), b = bb(B.ring), l = bb(L.ring)
    prism(rough, A.ring, 0, 24.1, null, 0)
    frustum(cu, [a[0] - 0.3, a[1] + 0.3, a[2] - 0.3, a[3] + 0.3], b, 24.1, 29.6, false)
    // the cap of the mansard ring between the two outlines is covered by the frustum; fill the top
    rectPyramid(cu, b[0], b[1], b[2], b[3], 29.6, 36.0)
    box(rough, l[0] + 1.5, l[1] - 1.5, l[2] + 1.0, l[3] - 1.0, 33.0, 35.4, null, 0)
    hipRoof(cu, l[0] + 1.5, l[1] - 1.5, l[2] + 1.0, l[3] - 1.0, 35.4, 36.8, 0.2)
  }

  // ── the campanile ──
  {
    const T = byId['way/1454684290'], [x0, x1, y0, y1] = bb(T.ring)
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = 2.45
    box(rough, cx - h, cx + h, cy - h, cy + h, 0, 40.4, null, 0)
    cornice(trim, [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], 33.6, 0.6, 0.25, trim)
    cornice(trim, [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], 40.0, 0.7, 0.35, null)
    rectPyramid(cu, cx - h - 0.4, cx + h + 0.4, cy - h - 0.4, cy + h + 0.4, 40.7, 42.8)
    const fs: [XY, XY][] = [[[cx - h, cy - h], [cx + h, cy - h]], [[cx + h, cy - h], [cx + h, cy + h]], [[cx + h, cy + h], [cx - h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]]]
    for (const [a, b] of fs) for (const s of [h - 0.85, h + 0.85]) onWall(win, a, b, archShape(s, 1.1, 35.0, 38.6, 6), 0.06)
  }

  // ── the temple front (way/1454675350): podium, columns in antis, entablature, pediment ──
  {
    const X0 = 5.8, X1 = 23.2, Y0 = 25.3, YF = 57.4, YB = 50.0, G = 6.0 // G: the drive's ground here
    const ZP = G + 2.4, ZC = ZP + 7.6, ZE = ZC + 2.3, ZR = 20.9
    // the hall behind the porch
    box(stone, X0, X1, Y0, YB, 0, ZE, null, 0)
    // antae (side walls of the porch)
    box(stone, X0, X0 + 1.7, YB, YF, 0, ZE, null, 0)
    box(stone, X1 - 1.7, X1, YB, YF, 0, ZE, null, 0)
    // podium and steps
    box(trim, X0 + 1.7, X1 - 1.7, YB, YF - 0.6, 0, ZP, trim, 0.1)
    for (let k = 0; k < 4; k++) box(trim, X0 + 1.2, X1 - 1.2, YF - 0.6 + k * 0.9, YF + 0.3 + k * 0.9, 0, ZP - k * 0.6, trim, 0.05)
    // four fluted (16-sided) columns
    const cy = YF - 1.2
    for (let k = 0; k < 4; k++) {
      const cx = X0 + 3.3 + k * ((X1 - X0 - 6.6) / 3)
      revolve(trim, [cx, cy], [[0.8, ZP], [0.8, ZP + 0.3], [0.68, ZP + 0.35], [0.6, ZC - 0.6], [0.85, ZC - 0.2], [0.95, ZC]], 12, 0, false, false)
    }
    // the door and the windows behind the columns
    onWall(win, [X1 - 1.7, YB], [X0 + 1.7, YB], rectShape(5.6, 8.2, ZP, ZP + 4.8), 0.06)
    // entablature over the porch and the hall
    box(trim, X0 - 0.2, X1 + 0.2, YB - 0.2, YF + 0.2, ZC, ZE, null, 0)
    capPoly(trim, [[X0 - 0.2, YB], [X1 + 0.2, YB], [X1 + 0.2, YF + 0.2], [X0 - 0.2, YF + 0.2]], ZC, false)
    // pediment roof along y, over the whole wing
    gableRoof(cu, trim, X0 - 0.2, X1 + 0.2, Y0, YF + 0.2, ZE, ZR, 'y', 0.35, 0.35)
    // the pediment's raking cornice
    for (const sx of [-1, 1]) {
      const xm = (X0 + X1) / 2, xe = sx < 0 ? X0 - 0.55 : X1 + 0.55
      const sec = (x: number, z: number): V3[] => [[x, YF + 0.75, z], [x, YF + 0.75, z - 0.55], [x, YF + 0.1, z - 0.55], [x, YF + 0.1, z]]
      trim.sweep([sec(xe, ZE + 0.25), sec(xm, ZR + 0.25)])
    }
    // the acroterion over the peak
    box(trim, (X0 + X1) / 2 - 0.5, (X0 + X1) / 2 + 0.5, YF - 0.3, YF + 0.3, ZR - 0.2, ZR + 1.3, trim, 0.2)
  }

  // ── the Ionic loggia on the north front (way/1454674693 with the pylons /1454674691, /1454674692) ──
  {
    const YN = 49.2, XA = -19.2, XB = -1.2, XL0 = -15.4, XL1 = -4.6, G = 6.0
    const Z1 = G + 7.2, ZA = 18.6, ZT = 21.6
    box(stone, XA, XB, 36.5, YN, 0, Z1, null, 0)
    box(stone, XA, XL0, 36.5, YN, Z1, ZT, roof, 0.3)
    box(stone, XL1, XB, 36.5, YN, Z1, ZT, roof, 0.3)
    box(stone, XL0, XL1, 36.5, YN - 2.2, Z1, ZT, roof, 0.3)
    box(stone, XL0, XL1, YN - 2.2, YN, ZA, ZT, roof, 0.3)
    capPoly(stone, [[XL0, YN - 2.2], [XL1, YN - 2.2], [XL1, YN], [XL0, YN]], ZA, false)
    capPoly(roof, [[XL0, YN - 2.2], [XL1, YN - 2.2], [XL1, YN], [XL0, YN]], Z1, true)
    // shadowed back wall of the loggia
    onWall(win, [XL1, YN - 2.2], [XL0, YN - 2.2], rectShape(0.6, XL1 - XL0 - 0.6, Z1 + 0.4, ZA - 0.3), 0.04)
    for (let k = 0; k < 4; k++) {
      const cx = XL0 + 1.6 + k * ((XL1 - XL0 - 3.2) / 3)
      revolve(trim, [cx, YN - 0.9], [[0.5, Z1], [0.42, Z1 + 0.2], [0.42, ZA - 0.5], [0.6, ZA - 0.2], [0.6, ZA]], 10, 0, false, false)
    }
    // the base storey's tall grilled windows, a cornice line
    const f: [XY, XY] = [[XB, YN], [XA, YN]]
    for (const s of [5.2, 9.0, 12.8]) onWall(win, f[0], f[1], rectShape(s - 0.8, s + 0.8, G + 1.4, G + 5.8), 0.06)
    for (const s of [1.6, 16.4]) onWall(win, f[0], f[1], rectShape(s - 0.6, s + 0.6, G + 2.6, G + 4.6), 0.06)
    box(trim, XA - 0.15, XB + 0.15, YN - 0.2, YN + 0.35, Z1 - 0.5, Z1, trim, 0.1)
  }

  // ── a few window groups on the other fronts ──
  {
    // west front of the west range (way/1454677561)
    for (const s of [6, 10, 14, 18, 22, 26]) onWall(win, [-35.6, 32.9], [-35.6, -1.9], rectShape(s - 0.8, s + 0.8, 9.5, 15.0), 0.06)
    // the 1886 range's arched windows (south face of the copper core)
    for (const s of [3, 7, 11, 15, 19, 23]) onWall(win, [1.0, -32.0], [28.7, -32.0], archShape(s, 1.8, 13.0, 17.5, 6), 0.06)
    // east front (way/1454674697 / 1454674695)
    for (const s of [4, 8, 12, 16, 20]) onWall(win, [34.8, -3.5], [34.8, 22.6], rectShape(s - 0.7, s + 0.7, 3.0, 7.5), 0.06)
  }

  await save('cin-art-museum', 'Cincinnati Art Museum', [
    { part: stone, material: finish('cam-limestone', 0xece3d2) },
    { part: rough, material: finish('cam-rough-stone', 0xcfc7b8) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: cu, material: PALETTE.copper },
    { part: roof, material: PALETTE.roof },
  ], { height: 42.8, anchor: [39.113985, -84.497038], bearing: 4.6 }, 6500)
}
