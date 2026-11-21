/**
 * The Matenadaran (Mesrop Mashtots Institute of Ancient Manuscripts),
 * Yerevan: Mark Grigorian's grey basalt manuscript house (designed
 * 1939-44, built 1945-1957) at the head of Mashtots Avenue, with Ghukas
 * Chubaryan's statue of Mesrop Mashtots and his disciple Koryun (1962,
 * basalt 1967) at the foot of its terrace wall, six standing medieval
 * scholars along the facade (1963-67), and Arthur Meschian's new building
 * (2011) behind it on the hill. Procedural, CC0-1.0, no textures.
 *   bun generators/yerevan-matenadaran.ts
 * Writes models/yerevan-matenadaran.glb and a detail model
 * models/yerevan-matenadaran.detail.glb (finer statues, the portal's
 * carved archivolt, the new building's arcade at closer pitch).
 *
 * Frame: x along the facade (to the right seen from the front), y into the
 * hill, z up, metres, in the model's turned frame: the facade faces -y.
 * Origin at the area centroid of the old building's outer way/48277829
 * (anchor 44.521041, 40.192130); bearing 44, so the facade faces 224 deg,
 * down Mashtots Avenue (the outline's front runs 44 deg from east).
 *
 * Identity: a tall, nearly cubic grey basalt block under a heavy flat
 * cornice; on its front a recessed field with a great round-arched portal of
 * nested arches over a tall grilled window and the door, flanked on each
 * side by two tall narrow round-headed niches in raised frames; six
 * standing scholars on pedestals along its foot; a high terrace wall below
 * with the seated Mashtots raising his right hand, the kneeling Koryun at
 * his side and the alphabet stele; behind, the long new building with its
 * top-floor arcade and a glazed rotunda, stepping along the hill.
 *
 * The site follows the map's terrain, as yerevan-cascade does: the
 * Mapterhorn DEM at z12 (the only zoom here) is baked below from
 * `bun tools/terrain.ts grid 44.521041 40.192130 175 5 --bearing 44 --zoom 12`
 * and every wall stands on it. y = 0 is the lowest DEM point under the
 * outlines. The z12 DEM is a smoothed surface (the buildings show in it);
 * heights are set from photos and published figures above the ground in
 * front, not from it.
 *
 * Evidence
 * - OSM (ODbL): relation/20960090 (building=government, tourism=museum,
 *   architect Mark Grigorian, building:levels 5;4), outers way/48277829
 *   (the old building with its terrace and side wings) and way/168360076
 *   (the new building); the main entrance node/626148432; the six scholar
 *   statues node/8221914960-8221914965. No building:part inside.
 * - Published: Wikipedia "Matenadaran": "a simple cube faced with local gray
 *   basalt", 22.4 m tall, rising 18 m above its terrace; the central arched
 *   portal flanked on each side by two tall narrow niches, modelled on the
 *   gavit of the Holy Apostles at Ani; Mashtots and Koryun by Ghukas
 *   Chubaryan; six scholars (Toros Roslin, Grigor Tatevatsi, Anania
 *   Shirakatsi, Movses Khorenatsi, Mkhitar Gosh, Frik); the new building by
 *   Arthur Meschian, 2011, five storeys https://en.wikipedia.org/wiki/Matenadaran
 * - Photos (all evidence):
 *   - "Matenadaran Yerevan Armenia msu-2018-2506.jpg", Matthias
 *     Süßen, CC BY-SA 4.0, face on (0.0414 m/px from the scholars' OSM
 *     spacing, heights over the terrace, found 1.7 m under the scholars'
 *     feet: facade 37.9 m wide, 19.9 m to the cornice top, the field
 *     recessed from 3.2 m in, its head at 17.0; the portal's outer arch
 *     9.1 m wide springing at 8.9; the window 4.2 m wide from 4.0 to 10.6;
 *     the niches 1.9 m wide, crowns at 13.5, at 7.6 and 11.8 m either side
 *     of the axis)
 *     https://commons.wikimedia.org/wiki/File:Matenadaran_Yerevan_Armenia_msu-2018-2506.jpg
 *   - "2014 Erywań, Matenadaran (13).jpg", Marcin Konsek, CC BY-SA 4.0: the
 *     terrace wall and the statue group with people for scale (0.019 m/px:
 *     the wall 7.2 m, Mashtots 6.0 m to the head, Koryun 3.7 m, the stele)
 *     https://commons.wikimedia.org/wiki/File:2014_Erywa%C5%84,_Matenadaran_(13).jpg
 *   - "2014 Erywań, Matenadaran (16).jpg", Marcin Konsek, CC BY-SA 4.0: the
 *     statue group close
 *   - "Yerevan, Matenadaran, Armenia.jpg", Vyacheslav Argenberg, CC BY 4.0:
 *     face on, the wall and statues
 *     https://commons.wikimedia.org/wiki/File:Yerevan,_Matenadaran,_Armenia.jpg
 *   - "Facade of Matenadaran building, Yerevan.jpg", Rita Willaert, CC BY
 *     2.0: the portal and the scholars from the side
 *     https://commons.wikimedia.org/wiki/File:Facade_of_Matenadaran_building,_Yerevan.jpg
 *   - "Matenadaran, statues 01.jpg", ՀայԿ, CC BY-SA 4.0: three scholars on
 *     their pedestals
 *   - "Matenadaran (2024).jpg", ASFINAG AT, CC BY 4.0: the side, the hill
 *   - "Matenadaran, Yerevan, Armenia (Մատենադարանб, 2026).jpg", Petar
 *     Milošević, CC BY-SA 4.0: face on, the comparison render
 *   - "New building of Matenadaran shot from air.jpg", Aleksey Chalabyan,
 *     CC BY-SA 4.0: the new building's length, arcade and rotunda
 *     https://commons.wikimedia.org/wiki/File:New_building_of_Matenadaran_shot_from_air.jpg
 *   - "Matenadaran, 2014, ArmAg (30).jpg", Armineaghayan, CC BY-SA 4.0: the
 *     rotunda's columns and glazing
 *
 * Numbers: plan from OSM; the facade and statue sizes measured on the
 * photos as above; the new building's roof (38 m over the DEM's lowest
 * point; its wing next to the old building 30) estimated from the aerial
 * photo and OSM's five levels. Colours sampled on msu-2018-2506 and
 * Konsek 13: basalt #b4b3b8-#bfbdbf sunlit, #7c7a73-#89847a in shade,
 * statues a little lighter.
 *
 * Doubts: the scholars are standing figures (the photos show them
 * standing, not seated); their poses are simplified to robes and a book or
 * scroll; the inscriptions and the eagle relief on the wall are left off;
 * the old building's back and sides, set into the hill, are plain; the new
 * building's plan comes from OSM only, its facades from one aerial photo
 * and two close views, so its window rhythm is approximate.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import clipping from 'polygon-clipping'
import { smooth, ellipsoid, solid, slab } from './nyc-columbus-monument'
import { polyTris, fquad, ftri } from './berlin-oberbaum-bridge'
import { writeModel } from './tbilisi-holy-trinity-cathedral'
import { groundWall, flatPoly, archOutline, ccwRing, pieces, pairs, type XY } from './yerevan-cascade'
import { limb } from './yerevan-mother-armenia'

// ---------------------------------------------------------------------------
// The ground: Mapterhorn z12 in this frame, rows from y = -45 north every
// 5 m, columns x = -45 to 90 every 5 m.
const DEM_X0 = -45, DEM_Y0 = -45, DEM_STEP = 5
const DEM: number[][] = [
  [8.4,7.1,5.8,4.7,3.6,2.8,1.9,1.3,0.9,0.7,0.4,0.2,0.1,0,-0.1,-0.2,-0.3,-0.4,-0.5,-0.7,-0.9,-1.1,-1.2,-1.3,-1.5,-1.9,-2.3,-2.8],
  [9.6,8.2,6.9,5.6,4.7,3.9,3,2.2,1.9,1.7,1.5,1.2,1,1,0.9,0.7,0.5,0.4,0.3,0.2,0.1,-0.1,-0.2,-0.3,-0.4,-0.9,-1.4,-1.8],
  [10.7,9.4,8,6.9,5.9,5,4.2,3.6,3.1,2.9,2.6,2.4,2.2,2,1.9,1.7,1.5,1.3,1.2,1,0.9,0.8,0.7,0.6,0.4,0.1,-0.4,-1.1],
  [12,10.5,9.4,8.3,7.2,6.2,5.5,5,4.5,4.1,3.8,3.6,3.4,3.2,2.9,2.7,2.4,2.2,2,1.9,1.8,1.7,1.6,1.4,1.2,0.9,0.4,-0.4],
  [13.4,12,10.8,9.7,8.6,7.7,6.9,6.3,5.8,5.4,5.1,4.8,4.6,4.3,4,3.6,3.4,3.2,3,2.8,2.6,2.5,2.4,2.3,2.1,1.6,0.9,0.2],
  [14.9,13.6,12.3,11,10.1,9.2,8.4,7.6,7.1,6.7,6.3,6.1,5.7,5.4,5.1,4.7,4.4,4.2,3.9,3.7,3.4,3.3,3.1,3.1,2.8,2,1.2,0.6],
  [16.4,15,13.7,12.6,11.5,10.6,9.8,9.1,8.4,7.9,7.5,7.2,6.9,6.5,6.2,5.8,5.5,5.1,4.9,4.6,4.2,3.9,3.8,3.6,3,2.3,1.6,0.8],
  [18,16.4,15.3,14.2,13.1,12.1,11.3,10.6,9.8,9.1,8.7,8.4,8.1,7.7,7.3,6.9,6.6,6.2,5.8,5.4,5,4.7,4.3,3.8,3.2,2.6,1.7,0.7],
  [19.6,18.2,16.9,15.8,14.7,13.7,12.8,12,11.3,10.6,10.1,9.7,9.3,8.9,8.4,8,7.7,7.2,6.6,6.1,5.7,5.3,4.6,4.1,3.5,2.7,1.6,0.5],
  [21.4,20.1,18.7,17.4,16.4,15.4,14.4,13.5,12.8,12.2,11.6,11,10.6,10.1,9.7,9.2,8.6,8,7.4,6.8,6.2,5.6,4.9,4.4,3.7,2.5,1.4,0.3],
  [23.2,21.9,20.6,19.3,18,16.9,16,15.1,14.3,13.6,13,12.5,11.9,11.3,10.9,10.3,9.5,8.7,8.1,7.4,6.6,5.8,5.2,4.5,3.3,2.3,1.2,0],
  [25.1,23.8,22.4,21,19.7,18.5,17.6,16.7,15.9,15.1,14.4,13.8,13.2,12.6,12,11.2,10.3,9.5,8.6,7.7,6.8,6,5.2,4,2.9,1.8,0.8,-0.5],
  [27,25.6,24.1,22.8,21.5,20.3,19.2,18.3,17.5,16.7,15.9,15.2,14.6,13.9,13,12,11.2,10.3,9.1,7.9,7.1,6.2,4.9,3.5,2.4,1.3,0.1,-1.1],
  [28.8,27.4,25.9,24.4,23.2,22.1,21,20,19.1,18.4,17.5,16.6,15.9,15,14,13,12,10.8,9.6,8.4,7.2,6,4.6,3.3,1.9,0.7,-0.5,-1.7],
  [30.6,29.2,27.8,26.3,25,24,22.9,21.8,20.9,20.1,19.3,18.3,17.1,16.1,15.2,14.1,12.7,11.3,10.1,8.9,7.3,5.8,4.5,3.1,1.6,0.2,-1,-2.3],
  [32.5,31.2,29.7,28.4,27.1,25.8,24.7,23.7,22.8,21.9,21,19.8,18.6,17.4,16.3,15,13.5,12,10.6,9.1,7.5,5.9,4.3,3,1.5,0,-1.5,-2.5],
  [34.4,33,31.7,30.3,29,27.8,26.6,25.6,24.6,23.7,22.5,21.3,20.1,18.9,17.3,15.8,14.4,12.9,11.2,9.4,7.8,6.2,4.6,2.9,1.5,0,-1.4,-2.7],
  [36.2,34.9,33.5,32.2,30.9,29.7,28.5,27.4,26.4,25.2,24,22.8,21.6,20,18.5,16.9,15.4,13.7,12,10.1,8.2,6.7,5,3.3,1.4,0.2,-1.1,-2.5],
  [38,36.7,35.4,34.1,32.8,31.5,30.3,29.2,27.9,26.7,25.5,24.3,22.7,21.1,19.6,18,16.4,14.7,12.9,11,9.1,7.2,5.6,3.8,2.2,0.5,-0.8,-2.2],
  [39.7,38.6,37.2,35.9,34.6,33.3,32.1,30.8,29.5,28.2,26.9,25.5,23.9,22.3,20.7,19.1,17.4,15.7,13.9,12.1,10.2,8.2,6.3,4.7,3,1.3,-0.5,-1.6],
  [41.3,40.2,39,37.6,36.3,35,33.7,32.4,31.1,29.8,28.2,26.7,25.2,23.6,21.9,20.2,18.6,16.9,15.1,13.2,11.3,9.4,7.4,5.6,3.9,2.2,0.5,-1],
  [42.9,41.7,40.5,39.3,38,36.6,35.3,34,32.7,31.2,29.6,28,26.5,24.8,23.1,21.5,19.8,18.1,16.3,14.4,12.5,10.6,8.7,6.8,4.9,3.2,1.6,0],
  [44.3,43.1,41.9,40.8,39.6,38.2,36.9,35.6,34.1,32.5,31,29.4,27.8,26.1,24.4,22.7,21,19.3,17.5,15.7,13.8,11.9,9.9,8,6.1,4.2,2.6,1],
  [45.8,44.6,43.4,42.2,41,39.8,38.5,37,35.5,33.9,32.3,30.6,28.9,27.3,25.6,23.9,22.2,20.5,18.9,16.9,15,13.1,11.2,9.2,7.3,5.3,3.5,2],
  [47.3,46.1,44.9,43.7,42.5,41.3,39.9,38.4,36.8,35.3,33.5,31.8,30.1,28.4,26.8,25,23.3,21.7,19.9,18.1,16.1,14.2,12.3,10.3,8.4,6.5,4.7,3],
  [48.8,47.5,46.3,45.2,44,42.6,41.2,39.8,38.2,36.5,34.7,32.9,31.1,29.5,27.8,26.1,24.4,22.7,20.9,19.1,17.2,15.3,13.4,11.4,9.4,7.6,5.9,4.2],
  [50.2,48.9,47.7,46.6,45.3,43.9,42.4,41,39.4,37.6,35.8,34,32.2,30.5,28.8,27.1,25.4,23.7,21.9,20.1,18.2,16.4,14.5,12.6,10.6,8.7,7,5.3],
  [51.5,50.2,49,47.8,46.5,45.1,43.7,42.1,40.4,38.7,36.9,35,33.2,31.5,29.8,28,26.3,24.6,23,21.1,19.2,17.5,15.7,13.7,11.7,9.8,8,6.3],
  [52.8,51.6,50.3,49,47.7,46.4,44.8,43.1,41.4,39.7,37.9,36,34.1,32.3,30.6,28.8,27,25.4,23.8,22,20.1,18.3,16.6,14.7,12.7,10.8,9,7.2],
  [54.2,53,51.6,50.3,49,47.5,45.8,44.1,42.4,40.6,38.7,36.8,34.9,33.1,31.3,29.5,27.7,26,24.3,22.6,20.9,19.1,17.3,15.5,13.6,11.7,9.9,8.1],
  [55.6,54.3,53,51.7,50.2,48.6,47,45.2,43.4,41.5,39.6,37.6,35.6,33.7,31.9,30.1,28.3,26.5,24.8,23.1,21.5,19.9,18.1,16.3,14.4,12.6,10.8,9],
  [56.8,55.7,54.4,52.9,51.4,49.8,48.1,46.3,44.4,42.5,40.6,38.5,36.5,34.4,32.6,30.7,28.9,27.1,25.4,23.7,22.1,20.5,18.9,17.1,15.2,13.4,11.7,9.9],
  [58.1,56.9,55.6,54.1,52.5,50.9,49.3,47.3,45.4,43.5,41.5,39.3,37.2,35.2,33.2,31.3,29.4,27.6,25.9,24.2,22.6,21,19.5,17.7,15.8,14,12.3,10.6],
  [59.3,58.1,56.7,55.2,53.6,52,50.2,48.4,46.4,44.4,42.3,40.1,38,35.9,33.8,31.8,29.9,28.1,26.3,24.7,23.1,21.5,19.8,18.1,16.3,14.5,12.9,11.2],
  [60.6,59.2,57.8,56.3,54.7,53.1,51.3,49.5,47.4,45.3,43.2,41,38.7,36.5,34.4,32.3,30.3,28.5,26.8,25.1,23.5,21.9,20.2,18.5,16.8,15.1,13.4,11.7],
  [61.6,60.4,58.9,57.4,55.9,54.3,52.5,50.6,48.4,46.3,44.1,41.9,39.5,37.1,34.8,32.8,30.9,28.9,27.1,25.4,23.9,22.3,20.7,19,17.2,15.5,13.9,12.2],
  [62.6,61.5,60.2,58.7,57.1,55.5,53.8,51.6,49.5,47.3,45.1,42.8,40.4,37.9,35.4,33.3,31.4,29.5,27.5,25.8,24.3,22.7,21.1,19.4,17.6,15.9,14.3,12.6],
  [63.8,62.6,61.3,59.9,58.4,56.8,54.8,52.6,50.5,48.3,46.1,43.7,41.3,38.9,36.5,34.1,31.9,30,28.2,26.4,24.7,23.1,21.4,19.7,18,16.3,14.6,12.9],
  [65.1,63.7,62.4,61.1,59.7,57.8,55.8,53.7,51.5,49.4,47.2,44.8,42.4,40,37.6,35.2,32.7,30.6,28.8,27,25.2,23.4,21.7,20,18.3,16.6,14.9,13.2],
  [65.9,64.9,63.5,62.2,60.7,59,57,54.9,52.8,50.6,48.4,46,43.6,41.2,38.8,36.4,33.9,31.5,29.5,27.7,25.8,23.8,21.9,20.2,18.6,16.9,15.2,13.5],
  [66.8,65.8,64.7,63.2,61.6,60,58.4,56.2,54,51.9,49.7,47.3,44.9,42.5,40.1,37.6,35.1,32.7,30.4,28.3,26.4,24.5,22.5,20.5,18.8,17.1,15.4,13.8],
  [67.7,66.7,65.5,64.2,62.7,61.1,59.3,57.5,55.3,53.1,50.9,48.6,46.2,43.7,41.3,38.7,36.2,33.8,31.5,29.2,27.1,25.2,23.2,21.1,19.1,17.4,15.8,14.3],
  [68.6,67.6,66.4,65.2,63.8,62.1,60.4,58.5,56.5,54.4,52.1,49.8,47.4,45,42.5,40,37.3,34.9,32.6,30.3,28.1,25.9,23.9,21.9,19.7,17.8,16.3,14.8],
  [69.7,68.6,67.5,66.2,64.8,63.3,61.6,59.7,57.7,55.6,53.4,51.1,48.7,46.3,43.8,41.3,38.7,36.2,33.8,31.5,29.2,26.9,24.7,22.7,20.6,18.7,16.9,15.3]]
const dem = (x: number, y: number) => {
  const fx = Math.max(0, Math.min(DEM[0].length - 1.001, (x - DEM_X0) / DEM_STEP))
  const fy = Math.max(0, Math.min(DEM.length - 1.001, (y - DEM_Y0) / DEM_STEP))
  const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j
  return (DEM[j][i] * (1 - u) + DEM[j][i + 1] * u) * (1 - v) + (DEM[j + 1][i] * (1 - u) + DEM[j + 1][i + 1] * u) * v
}
const demMax = (r: XY[]) => {
  const xs = r.map((p) => p[0]), ys = r.map((p) => p[1])
  let m = -Infinity
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 2) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 2) m = Math.max(m, dem(x, y))
  return m
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A terrain-footed block over a ring: walls from the ground to `top`, the top on `roof`. */
function block(wall: Part, roof: Part | null, ring0: XY[], top: number, skip: (a: XY, b: XY) => boolean = () => false) {
  const ring = ccwRing(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (!skip(a, b)) groundWall(wall, a, b, () => top, dem, 6)
  }
  if (roof) flatPoly(roof, ring, [], top)
}
/** A box standing on a level (not the ground): walls, top. */
function box(p: Part, top: Part | null, r: XY[], z0: number, z1: number) {
  const ring = ccwRing(r)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n: V3 = [b[1] - a[1], a[0] - b[0], 0], l = Math.hypot(n[0], n[1])
    fquad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [n[0] / l, n[1] / l, 0])
  }
  if (top) flatPoly(top, ring, [], z1)
}

// A wall plane y = const facing -y: helpers in (x, z).
const Fq = (p: Part, y: number, x0: number, z0: number, x1: number, z1: number, n: V3 = [0, -1, 0]) => fquad(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], n)
function planePoly(p: Part, y: number, outline: XY[], holes: XY[][], n: V3 = [0, -1, 0]) {
  for (const [a, b, c] of polyTris(outline, holes)) ftri(p, [a[0], y, a[1]], [b[0], y, b[1]], [c[0], y, c[1]], n)
}
/** Reveals round a hole in the plane y0, running back (+y) to y1. */
function reveals(p: Part, hole: XY[], y0: number, y1: number) {
  const h = ccwRing(hole)
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length]
    const e: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(e[0], e[1]) || 1
    fquad(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [-e[1] / L, 0, e[0] / L])
  }
}
/** A semicircular arch band (jambs and head) flat in the plane y, between half-widths r0 and r1. */
function archBand(p: Part, y: number, cx: number, zb: number, zs: number, r0: number, r1: number, seg: number) {
  Fq(p, y, cx - r1, zb, cx - r0, zs); Fq(p, y, cx + r0, zb, cx + r1, zs)
  for (let k = 0; k < seg; k++) {
    const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg
    const P = (t: number, r: number): V3 => [cx + r * Math.cos(t), y, zs + r * Math.sin(t)]
    fquad(p, P(a, r0), P(a, r1), P(b, r1), P(b, r0), [0, -1, 0])
  }
}

// ---------------------------------------------------------------------------
// Statues: built in their own frame (facing -y, feet at the origin), then
// turned and set in place.

function place(dst: Part, src: Part, at: V3, yaw: number, k = 1) {
  const c = Math.cos(yaw), s = Math.sin(yaw)
  for (let i = 0; i < src.pos.length; i += 3) {
    // Part stores glTF (x, z, -y): map x = X, y = -Z
    const X = src.pos[i] * k, Y = src.pos[i + 1] * k, Z = src.pos[i + 2] * k
    const x = X * c + Z * s, y = -(-X * s + Z * c) // turned map (x, y)
    dst.pos.push(x + at[0], Y + at[2], -(y + at[1]))
    const nx = src.nrm[i], ny = src.nrm[i + 1], nz = src.nrm[i + 2]
    dst.nrm.push(nx * c + nz * s, ny, -nx * s + nz * c)
    dst.uv.push(0, 0)
  }
}

type Ring = [z: number, a: number, b: number, dy?: number]
const ringsOf = (rows: Ring[], n: number): V3[][] => rows.map(([z, a, b, dy = 0]) => Array.from({ length: n }, (_, i) => {
  const t = (2 * Math.PI * i) / n
  return [a * Math.cos(t), dy + b * Math.sin(t), z] as V3
}))

/** A standing robed scholar, `h` tall, holding a book (0), a scroll (1) or with a hand on his breast (2). */
export function scholar(detail: boolean, h: number, pose: number, beard = true) {
  const q0 = new Part()
  const n = detail ? 16 : 8, AS = detail ? 10 : 5, SUB = detail ? 4 : 1
  const k = h / 3.4
  smooth(q0, (q) => {
    // the robe, a long tapered loft, the cloak's breadth at the shoulders
    solid(q, ringsOf([[0, 0.5, 0.42], [0.3, 0.48, 0.4], [1.2, 0.44, 0.34], [2.0, 0.45, 0.32], [2.55, 0.52, 0.33], [2.78, 0.5, 0.3], [2.88, 0.32, 0.24], [2.96, 0.14, 0.13]].map(([z, a, b]) => [z * k, a * k, b * k]), n))
    ellipsoid(q, [0, -0.02 * k, 3.15 * k], [0.16 * k, 0.19 * k, 0.24 * k], detail ? 10 : 6, detail ? 6 : 3)
    if (beard) ellipsoid(q, [0, -0.12 * k, 2.95 * k], [0.13 * k, 0.1 * k, 0.17 * k], detail ? 8 : 5, detail ? 4 : 3)
    // arms: from the shoulders, bent forward to the hands at the chest
    const hands: [V3, V3] = pose === 0 ? [[-0.22, -0.42, 2.15], [0.22, -0.42, 2.15]] : pose === 1 ? [[-0.25, -0.38, 2.3], [0.3, -0.36, 1.85]] : [[-0.12, -0.4, 2.5], [0.4, -0.15, 1.55]]
    for (const [s, hnd] of [[-1, hands[0]], [1, hands[1]]] as const) {
      limb(q, [[s * 0.25 * k, 0, 2.82 * k], [s * 0.48 * k, 0, 2.72 * k], [s * 0.53 * k, -0.06 * k, 2.3 * k], [s * 0.45 * k, -0.25 * k, (hnd[2] - 0.05) * k], [hnd[0] * k, hnd[1] * k, hnd[2] * k]], [0.12 * k, 0.13 * k, 0.12 * k, 0.1 * k, 0.09 * k], AS, SUB)
    }
  }, 60)
  if (pose === 0) slab(q0, [0, -0.5 * k, 2.12 * k], [1, 0, 0], [0, 0.3, 1], [[-0.26 * k, -0.2 * k], [0.26 * k, -0.2 * k], [0.26 * k, 0.2 * k], [-0.26 * k, 0.2 * k]], 0.12 * k)
  if (pose === 1) slab(q0, [0.03 * k, -0.42 * k, 2.08 * k], [0.25, 0, 1], [1, 0, 0], [[-0.32 * k, -0.07 * k], [0.32 * k, -0.07 * k], [0.32 * k, 0.07 * k], [-0.32 * k, 0.07 * k]], 0.14 * k)
  return q0
}

/** Mesrop Mashtots seated, his right hand raised, his left arm held out; feet at the origin, facing -y. */
export function mashtots(detail: boolean) {
  const q0 = new Part()
  const n = detail ? 18 : 10, AS = detail ? 12 : 6, SUB = detail ? 4 : 1
  smooth(q0, (q) => {
    // the torso and shoulders in a heavy robe, from the seat up
    solid(q, ringsOf([[2.05, 0.95, 0.75, 0.2], [2.6, 0.9, 0.62, 0.15], [3.4, 0.88, 0.55, 0.1], [4.15, 0.98, 0.55, 0.05], [4.55, 0.95, 0.5, 0.05], [4.75, 0.6, 0.38, 0.05], [4.88, 0.25, 0.22, 0.05]], n))
    // the head, the hair, the long beard
    ellipsoid(q, [0, -0.05, 5.4], [0.32, 0.36, 0.45], detail ? 12 : 8, detail ? 7 : 5)
    ellipsoid(q, [0, 0.08, 5.5], [0.35, 0.34, 0.42], detail ? 12 : 8, detail ? 6 : 4)
    ellipsoid(q, [0, -0.28, 5.0], [0.3, 0.2, 0.42], 8, 4)
    // the lap and the robe falling from the knees to the ground, wide and heavy
    solid(q, ringsOf([[0.05, 1.25, 0.8, -0.95], [0.9, 1.18, 0.75, -0.92], [1.8, 1.12, 0.78, -0.85], [2.3, 1.05, 0.95, -0.55], [2.55, 0.95, 0.95, -0.35]], n))
    // the knees showing through it
    for (const s of [-1, 1]) limb(q, [[s * 0.45, 0.2, 2.25], [s * 0.52, -0.6, 2.35], [s * 0.58, -1.3, 2.3], [s * 0.62, -1.55, 1.9]], [0.42, 0.42, 0.38, 0.32], AS, SUB)
    // his right arm raised, the hand open beside his head
    limb(q, [[-0.55, 0.05, 4.6], [-0.95, 0.0, 4.55], [-1.3, -0.15, 4.2], [-1.65, -0.4, 4.15], [-1.82, -0.5, 4.75], [-1.85, -0.5, 5.35]], [0.3, 0.32, 0.29, 0.25, 0.21, 0.18], AS, SUB)
    ellipsoid(q, [-1.86, -0.5, 5.6], [0.18, 0.1, 0.3], 8, 4)
    // his left arm held out over Koryun, the palm up
    limb(q, [[0.55, 0.05, 4.6], [0.95, 0.0, 4.5], [1.3, -0.2, 4.15], [1.7, -0.6, 4.05], [2.05, -0.9, 4.2], [2.3, -1.0, 4.3]], [0.3, 0.32, 0.29, 0.24, 0.2, 0.17], AS, SUB)
    ellipsoid(q, [2.5, -1.05, 4.32], [0.28, 0.18, 0.08], 8, 4)
  }, 60)
  return q0
}

/** Koryun kneeling, looking up; feet (knees) at the origin, facing -y. */
export function koryun(detail: boolean) {
  const q0 = new Part()
  const n = detail ? 16 : 8, AS = detail ? 10 : 5, SUB = detail ? 4 : 1
  smooth(q0, (q) => {
    // the robe from the ground: the folded legs behind, the body upright
    solid(q, ringsOf([[0, 0.6, 0.85, 0.3], [0.5, 0.58, 0.8, 0.25], [1.1, 0.5, 0.45, 0.05], [2.0, 0.48, 0.36], [2.6, 0.55, 0.36], [2.85, 0.4, 0.3], [2.98, 0.17, 0.15]], n))
    ellipsoid(q, [0, -0.05, 3.25], [0.22, 0.25, 0.3], detail ? 10 : 8, detail ? 6 : 4)
    // the hands raised together before the chest
    for (const s of [-1, 1]) limb(q, [[s * 0.3, 0, 2.85], [s * 0.55, 0, 2.7], [s * 0.55, -0.15, 2.25], [s * 0.25, -0.45, 2.35], [s * 0.06, -0.55, 2.5]], [0.15, 0.17, 0.15, 0.13, 0.11], AS, SUB)
  }, 60)
  return q0
}

// ---------------------------------------------------------------------------

export function build(detail: boolean) {
  const basalt = new Part(), roof = new Part(), win = new Part(), stoneS = new Part(), door = new Part()
  const seg = detail ? 14 : 8

  // ---- Levels, from the ground in front of the terrace wall ----
  const XC = -0.9 // the facade's axis
  const P = demMax(rect(-6.5, -21.2, 5.0, -16.0)) + 0.3 // the statue plaza: the ground at the wall's foot
  const T = P + 7.2 // the terrace
  const TOP = T + 19.9 // the cornice's top
  const XL = XC - 18.95, XR = XC + 18.95, YF = -12.0, YB = 21.5

  // ---- Terrace, its wall and the side wings (way/48277829) ----
  block(basalt, roof, rect(-27.2, -16, 22.8, YF), T, (a, b) => a[1] === YF && b[1] === YF)
  // the side wings a step lower, but never under the hill beside them
  const wing = (r: XY[]) => block(basalt, roof, r, Math.max(T - 1.4, demMax(r) + 0.7))
  wing(rect(-32.1, -25.9, -27.2, -8.4))
  wing(rect(22.8, -25.7, 30.4, -6.4))
  wing(rect(-32.1, -8.4, XL, YF + 3.6))
  wing(rect(XR, -6.4, 30.4, YF + 5.6))
  // the parapet and its cornice along the wall's top
  box(basalt, roof, rect(-27.2, -16.0, 22.8, -15.5), T, T + 1.1)
  box(basalt, roof, rect(-27.5, -16.35, 23.1, -15.4), T + 1.1, T + 1.5)
  

  // ---- The cube ----
  // sides and back from the ground (set into the hill)
  groundWall(basalt, [XR, YB], [XL, YB], () => TOP - 1.5, dem, 6)
  // the sides: three tall round-headed niches in each, as on the front
  for (const [x, out] of [[XL, -1], [XR, 1]] as const) {
    // plane x = const, coordinates (y, z); outward normal (out, 0, 0)
    const holes = [-6, 0, 6].map((y) => archOutline(y, Math.max(T + 1.5, dem(x, y) + 1.0), 1.9, T + 12.55, seg >> 1))
    const bottom = pieces(YF, YB, 6).map((y) => [y, Math.min(dem(x, y), T)] as XY)
    const outline: XY[] = [...bottom, [YB, TOP - 1.5], [YF, TOP - 1.5]]
    const W3 = (q: XY, d = 0): V3 => [x + out * d, q[0], q[1]]
    for (const [a, b, c] of polyTris(outline, holes)) ftri(basalt, W3(a), W3(b), W3(c), [out, 0, 0])
    for (const h of holes) {
      const H = ccwRing(h)
      for (let i = 0; i < H.length; i++) {
        const a = H[i], b = H[(i + 1) % H.length], e: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(e[0], e[1]) || 1
        fquad(basalt, W3(a), W3(b), W3(b, -0.9), W3(a, -0.9), [0, -e[1] / L, e[0] / L])
      }
      for (const [a, b, c] of polyTris(H, [])) ftri(roof, W3(a, -0.9), W3(b, -0.9), W3(c, -0.9), [out, 0, 0])
    }
  }
  // the flat cornice: a slab 1.45 m deep overhanging 0.75 all round, the roof inside it
  const C = 0.75
  box(basalt, null, rect(XL - C, YF - C, XR + C, YB + C), TOP - 1.45, TOP)
  flatPoly(basalt, rect(XL - C, YF - C, XR + C, YB + C), [], TOP - 1.45, false)
  flatPoly(roof, rect(XL - C, YF - C, XR + C, YB + C), [], TOP)
  box(basalt, null, rect(XL - 0.35, YF - 0.35, XR + 0.35, YB + 0.35), TOP - 2.0, TOP - 1.45) // the bed moulding under it

  // the front: border (proud) round a recessed field
  const FD = 0.45 // the field's depth
  const fx0 = XC - 15.75, fx1 = XC + 15.75, fz1 = T + 17.0
  // the outer frame, the niche frames and the archivolt are the pale, sunlit stone of the photos
  planePoly(stoneS, YF, [[XL, T], [XR, T], [XR, TOP - 2.0], [XL, TOP - 2.0]], [[[fx0, T + 0.0001], [fx1, T + 0.0001], [fx1, fz1], [fx0, fz1]]])
  // the field's reveals (sides and head; open at the foot)
  fquad(basalt, [fx0, YF, T], [fx0, YF, fz1], [fx0, YF + FD, fz1], [fx0, YF + FD, T], [1, 0, 0])
  fquad(basalt, [fx1, YF, T], [fx1, YF + FD, T], [fx1, YF + FD, fz1], [fx1, YF, fz1], [-1, 0, 0])
  fquad(basalt, [fx0, YF, fz1], [fx1, YF, fz1], [fx1, YF + FD, fz1], [fx0, YF + FD, fz1], [0, 0, -1])
  // a second step: the field's inner panel set back another 0.55 m, 0.9 m in from the first
  const g0 = fx0 + 0.9, g1 = fx1 - 0.9, gz = fz1 - 0.9, FD2 = 0.55
  const yfi = YF + FD + FD2
  planePoly(basalt, YF + FD, [[fx0, T], [fx1, T], [fx1, fz1], [fx0, fz1]], [[[g0, T + 0.0001], [g1, T + 0.0001], [g1, gz], [g0, gz]]])
  fquad(basalt, [g0, YF + FD, T], [g0, YF + FD, gz], [g0, yfi, gz], [g0, yfi, T], [1, 0, 0])
  fquad(basalt, [g1, YF + FD, T], [g1, yfi, T], [g1, yfi, gz], [g1, YF + FD, gz], [-1, 0, 0])
  fquad(basalt, [g0, YF + FD, gz], [g1, YF + FD, gz], [g1, yfi, gz], [g0, yfi, gz], [0, 0, -1])
  // the niches: tall round-headed recesses in raised frames
  const niches = [-11.8, -7.6, 7.6, 11.8].map((d) => XC + d)
  const nicheHoles = niches.map((x) => archOutline(x, T + 0.25, 1.9, T + 12.55, seg >> 1))
  for (const [i, x] of niches.entries()) {
    reveals(basalt, nicheHoles[i], yfi, yfi + 0.9)
    planePoly(roof, yfi + 0.9, nicheHoles[i], []) // in shadow, as the photos show it
    // the frame: a flat raised rectangle round the niche
    const fy = yfi - 0.15
    for (const [x0, z0, x1, z1] of [[x - 1.45, T, x - 0.95, T + 14.3], [x + 0.95, T, x + 1.45, T + 14.3], [x - 1.45, T + 13.8, x + 1.45, T + 14.3]] as const)
      box(stoneS, null, [[x0, fy], [x1, fy], [x1, yfi], [x0, yfi]], z0, z1)
  }
  // the portal: an outer arch 9.1 m wide stepping in three times to the back plane
  const R0 = 5.2, ZS = T + 10.0, steps = [R0, 4.5, 3.8, 3.1], depth = [0, 0.6, 1.2, 1.8]
  const portalHole = archOutline(XC, T + 0.0001, 2 * R0, ZS, seg)
  for (let k = 0; k < steps.length; k++) {
    const y = yfi + depth[k]
    const hole = archOutline(XC, T + 0.0001, 2 * steps[k], ZS, seg)
    reveals(basalt, hole, y, y + 0.6)
    if (k + 1 < steps.length) archBand(basalt, y + 0.6, XC, T, ZS, steps[k + 1], steps[k], seg)
  }
  // the back plane: the window (grille) and the door below it
  const yb = yfi + depth[3] + 0.6
  const winHole = archOutline(XC, T + 4.0, 4.6, T + 9.6, seg)
  planePoly(basalt, yb, archOutline(XC, T + 0.0001, 2 * steps[3], ZS, seg), [winHole])
  reveals(basalt, winHole, yb, yb + 0.35)
  planePoly(win, yb + 0.35, winHole, [])
  box(door, null, [[XC - 1.25, yb - 0.06], [XC + 1.25, yb - 0.06], [XC + 1.25, yb], [XC - 1.25, yb]], T, T + 3.5)
  box(basalt, null, [[XC - 1.7, yb - 0.25], [XC + 1.7, yb - 0.25], [XC + 1.7, yb], [XC - 1.7, yb]], T + 3.5, T + 3.95) // the lintel band
  // the carved archivolt round the outer arch
  {
    const P2 = (t: number, r: number, d: number): V3 => [XC + r * Math.cos(t), yfi - d, ZS + r * Math.sin(t)]
    for (let k = 0; k < seg; k++) {
      const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg, m = (a + b) / 2
      fquad(stoneS, P2(a, R0, 0.25), P2(b, R0, 0.25), P2(b, R0 + 0.6, 0.25), P2(a, R0 + 0.6, 0.25), [0, -1, 0])
      fquad(stoneS, P2(a, R0 + 0.6, 0), P2(b, R0 + 0.6, 0), P2(b, R0 + 0.6, 0.25), P2(a, R0 + 0.6, 0.25), [Math.cos(m), 0, Math.sin(m)])
      fquad(stoneS, P2(a, R0, 0), P2(b, R0, 0), P2(b, R0, 0.25), P2(a, R0, 0.25), [-Math.cos(m), 0, -Math.sin(m)])
    }
    for (const s of [-1, 1]) box(stoneS, null, [[XC + s * R0, yfi - 0.3], [XC + s * (R0 + 0.65), yfi - 0.3], [XC + s * (R0 + 0.65), yfi], [XC + s * R0, yfi]], ZS - 0.5, ZS) // the imposts
  }
  // the field's back plane, pierced by the niches and the portal
  planePoly(basalt, yfi, [[g0, T], [g1, T], [g1, gz], [g0, gz]], [...nicheHoles, portalHole])

  // ---- The six scholars on their pedestals (node/8221914960-65) ----
  const sx = [-16.0, -12.2, -8.7, 5.6, 9.5, 12.9]
  sx.forEach((x, i) => {
    box(basalt, roof, rect(x - 0.75, -14.4, x + 0.75, YF), T, T + 1.7)
    place(stoneS, scholar(detail, 3.4, i % 3, i !== 2), [x, -13.3, T + 1.7], 0)
  })

  // ---- Mashtots, Koryun and the alphabet stele before the terrace wall ----
  box(basalt, roof, rect(-7.5, -23.0, 6.5, -16.0), P - 0.6, P + 0.3) // the low platform
  box(basalt, null, rect(-1.9, -18.4, 1.1, -16.0), P + 0.3, P + 2.85) // his seat
  // scaled 1.25 to the photo: seated, he reaches four-fifths of the wall's height
  place(stoneS, mashtots(detail), [-0.4, -17.4, P + 0.3], 0, 1.25)
  place(stoneS, koryun(detail), [2.6, -19.6, P + 0.3], -0.9, 1.2)
  box(stoneS, stoneS, rect(-4.4, -16.6, -2.4, -16.0), P + 0.3, P + 7.6) // the stele with the alphabet
  if (detail) {
    // the letters, as rows of small raised blocks
    for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) {
      const x = -4.2 + c * 0.44, z = P + 7.2 - r * 0.68
      box(stoneS, null, rect(x, -16.68, x + 0.26, -16.6), z - 0.36, z)
    }
  }

  // ---- The new building (way/168360076) ----
  const annex: XY[] = [[48.1, 151.5], [51.2, 162.7], [62.1, 159.7], [60.8, 155.4], [72.7, 152.6], [71.5, 147.6], [77.1, 146.3], [76.0, 141.8], [73.5, 142.4], [60.4, 87.0], [65.4, 85.4], [66.3, 83.9], [67.0, 81.6], [66.9, 79.2], [66.2, 76.4], [65.4, 74.6], [63.6, 72.2], [61.8, 70.3], [59.5, 69.1], [57.5, 68.7], [55.3, 68.5], [52.6, 68.5], [18.7, 34.3], [27.6, 33.5], [47.6, 53.7], [55.6, 45.7], [34.6, 24.4], [4.0, 25.6], [4.4, 35.4], [30.6, 61.9], [30.2, 62.6], [28.9, 65.4], [28.1, 67.8], [27.5, 70.2], [27.0, 72.5], [27.0, 74.7], [22.6, 75.1], [22.5, 79.7], [23.1, 84.5], [23.9, 88.2], [25.0, 92.4], [26.7, 96.7], [32.6, 95.1], [46.1, 152.1]]
  const close = (r: XY[]) => [...r, r[0]] as [number, number][]
  const cut = (y0: number, y1: number) => clipping.intersection([close(annex)], [close(rect(-50, y0, 120, y1))]).map((poly) => poly[0].slice(0, -1) as XY[])
  const wings: Array<[XY[], number]> = [...cut(-50, 63).map((r) => [r, T + 15.0] as [XY[], number]), ...cut(63, 200).map((r) => [r, T + 23.0] as [XY[], number])]
  for (const [r0, top] of wings) {
    const ring = ccwRing(r0)
    const z = Math.max(top, demMax(ring) + 1.0)
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      // an edge shared with the other piece is inside the building
      if (Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(a[1] - 63) < 1e-6) {
        // the step between the two roofs
        const lo = Math.min(...wings.map(([, t]) => t)), hi = Math.max(...wings.map(([, t]) => t))
        if (z > lo + 0.1) fquad(basalt, [a[0], a[1], lo], [b[0], b[1], lo], [b[0], b[1], hi], [a[0], a[1], hi], [0, a[0] < b[0] ? -1 : 1, 0])
        continue
      }
      facade(a, b, z)
    }
    flatPoly(roof, ring, [], z)
    // a parapet cap round the roof
  }
  /**
   * The new building's face a->b, ground to `top`: on the long faces a
   * top-floor arcade of round-headed recesses (real depth, glazed at the
   * back) between piers, and below it window panels two storeys high
   * between stone piers and spandrels; the rotunda's narrow facets glazed.
   */
  function facade(a: XY, b: XY, top: number) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const P3 = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
    const ga = dem(a[0], a[1]), gb = dem(b[0], b[1]), g = Math.max(ga, gb)
    const pitch = detail ? 3.4 : 4.4
    const arcade = L >= 18 && top - g > 9
    const zb = top - 5.0, zs = zb + 2.1
    // the plain wall, from the ground to the arcade's sill (or the top)
    groundWall(basalt, a, b, () => (arcade ? zb : top), dem, 6)
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    if (Math.hypot(mx - 60.5, my - 77.5) < 9.5) { // a facet of the rotunda: glazed in two bands, a stone floor band between
      const zm = (g + 1.0 + top - 1.6) / 2
      if (top - g > 6) for (const [z0, z1] of [[g + 1.0, zm - 0.6], [zm + 0.6, top - 1.6]]) fquad(win, P3(0, z0, 0.05), P3(L, z0, 0.05), P3(L, z1, 0.05), P3(0, z1, 0.05), n)
      return
    }
    if (L < 7) return
    if (!arcade) return
    const nA = Math.max(1, Math.floor((L - 1.5) / pitch)), s0 = (L - nA * pitch) / 2
    const holes: XY[][] = []
    for (let k = 0; k < nA; k++) {
      const c = s0 + (k + 0.5) * pitch
      const hole = ccwRing(archOutline(c, zb + 0.5, pitch * 0.62, zs, detail ? 6 : 4))
      holes.push(hole)
      for (let i = 0; i < hole.length; i++) {
        const p = hole[i], q = hole[(i + 1) % hole.length]
        const e: XY = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(e[0], e[1]) || 1
        const ni: XY = [-e[1] / l, e[0] / l]
        fquad(basalt, P3(p[0], p[1], 0), P3(q[0], q[1], 0), P3(q[0], q[1], -0.8), P3(p[0], p[1], -0.8), [u[0] * ni[0], u[1] * ni[0], ni[1]])
      }
      for (const [p, q, r] of polyTris(hole, [])) ftri(win, P3(p[0], p[1], -0.8), P3(q[0], q[1], -0.8), P3(r[0], r[1], -0.8), n)
    }
    // the arcade storey's face, pierced, and the cornice band over it
    for (const [p, q, r] of polyTris([[0, zb], [L, zb], [L, top], [0, top]], holes)) ftri(basalt, P3(p[0], p[1]), P3(q[0], q[1]), P3(r[0], r[1]), n)
    // the storeys below: broad glass panels three bays wide and two storeys high, piers and spandrels between
    for (let z1 = zb - 1.0; z1 - 7.4 > g + 0.8; z1 -= 8.6) {
      const z0 = z1 - 7.4
      for (let k = 0; k + 3 <= nA; k += 3) {
        const c0 = s0 + k * pitch + 0.6, c1 = s0 + (k + 3) * pitch - 0.6
        fquad(win, P3(c0, z0, 0.05), P3(c1, z0, 0.05), P3(c1, z1, 0.05), P3(c0, z1, 0.05), n)
      }
    }
  }

  // y = 0 on the lowest ground (Part stores glTF: index 1 is up)
  const all = [basalt, roof, win, stoneS, door]
  let lo = Infinity
  for (const p of all) for (let i = 1; i < p.pos.length; i += 3) lo = Math.min(lo, p.pos[i])
  for (const p of all) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= lo
  return { basalt, roof, win, stoneS, door }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.basalt, material: { ...finish('matenadaran-basalt', 0xa9a6a1), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.25 : 0.7) } },
      { part: p.roof, material: finish('matenadaran-roof', 0x6a6e73) },
      { part: p.win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
      { part: p.stoneS, material: { ...finish('matenadaran-statues', 0xb9b7b2), floodlight: () => 0.8 } },
      { part: p.door, material: { name: 'entrance', color: 0x8a6f52, roughness: 0.6 } },
    ]
  }
  const meta = { bearing: 44, osm: 'relation/20960090' }
  await writeModel('yerevan-matenadaran.glb', 'Matenadaran', make(false), meta, 6500, 250 * 1024)
  await writeModel('yerevan-matenadaran.detail.glb', 'Matenadaran', make(true), meta, 40000, 1536 * 1024)
}
