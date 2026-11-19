/**
 * Ogden Museum of Southern Art, Camp Street at Andrew Higgins Drive, New
 * Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-ogden-museum.ts
 *
 * What this model is: the museum's two buildings on Camp Street, as one
 * model: the Howard Memorial Library (H. H. Richardson's last design,
 * built 1888-89 by Shepley, Rutan & Coolidge; now the Patrick F. Taylor
 * Library), on the corner of Andrew Higgins Drive, and the Stephen Goldring
 * Hall (2003), the tall orange block north of it. Memorial Hall stands
 * between the two at the street (nola-memorial-hall, merged first: this
 * model imports its roof kit), so the model is two masses with that hall's
 * gap between them. Why one model: the museum is both buildings, joined
 * behind Memorial Hall, and every photo of the block shows them together;
 * Goldring Hall alone is a plain modern box and the library alone is not
 * the museum. The low building west of them (way/1173549558) is left to the
 * map.
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing 14.5
 * (the library's long axis, compass 104.5, along x; Camp Street along y),
 * so model +x faces Camp Street. Anchor: the middle of the two buildings'
 * OSM parts. y = 0 is the Camp Street sidewalk in front of Goldring Hall;
 * the library's lawn stands about 0.9 m higher and its walls run down to
 * the sidewalk datum.
 *
 * Evidence
 * - OSM: the library's part way/1391223539 (with its round west end) and
 *   its turrets ways 1391223536 and 1391223537 inside the outline
 *   way/328848201 (wikidata Q117486905, Howard Library, shared with
 *   Memorial Hall); Goldring Hall way/427521132 (height 21.6, 5 levels).
 *   The OSM node/4146220592 (the museum) stands in Goldring Hall.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame, heights above the sidewalk (0.6 over
 *   the box's minimum). Library: ridge 15.1 on y -22.5 from the round end to
 *   Camp Street; eaves 9.6; the Camp Street turrets about 10 at their cone
 *   feet; behind it to the north flat pale blocks at 14.2 (x -16..-3), 9.7
 *   (x -3..1.8), 12.8 (x 1.8..5.4) and 8.8 (x 5.4..12). Goldring Hall: the Camp Street block
 *   17.0, the rest 23.1, the north-west core 28.4 with a 30.5 penthouse.
 * - Terrain: flat but for the library's raised lawn. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Howard Library Building, Camp Street, New Orleans, January 2023.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the Camp Street gable, its
 *     grid window and the two round turrets
 *     https://commons.wikimedia.org/wiki/File:Howard_Library_Building,_Camp_Street,_New_Orleans,_January_2023.jpg
 *   - "Old Howard Library Building, New Orleans November 2024.jpg", Daniel
 *     Hartwig, CC BY 2.0: the same from the north-east, the tile roof
 *     https://commons.wikimedia.org/wiki/File:Old_Howard_Library_Building,_New_Orleans_November_2024.jpg
 *   - "LeeCircle30Nov07HowardRiverward.jpg", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the round west end from Lee Circle
 *     https://commons.wikimedia.org/wiki/File:LeeCircle30Nov07HowardRiverward.jpg
 *   - "Howard Library Camp Higgins Museums NOLA Nov 2011.JPG",
 *     Infrogmation of New Orleans, CC BY-SA 3.0: the long south side, the
 *     round end and Goldring Hall behind
 *     https://commons.wikimedia.org/wiki/File:Howard_Library_Camp_Higgins_Museums_NOLA_Nov_2011.JPG
 *   - "Camp Street, New Orleans Central Business District, 12 March 2024 -
 *     Howard Library, Confederate Hall, Ogden Museum.jpg", Infrogmation,
 *     CC BY-SA 4.0: the block from Andrew Higgins Drive and Camp Street
 *     https://commons.wikimedia.org/wiki/File:Camp_Street,_New_Orleans_Central_Business_District,_12_March_2024_-_Howard_Library,_Confederate_Hall,_Ogden_Museum.jpg
 *   - "Ogden Museum and Confederate Museum, Camp Street, New Orleans,
 *     January 2023.jpg", Infrogmation of New Orleans, CC BY-SA 4.0:
 *     Goldring Hall's Camp Street front: the sandstone base, the glass-block
 *     tower, the orange walls and the window cross
 *     https://commons.wikimedia.org/wiki/File:Ogden_Museum_and_Confederate_Museum,_Camp_Street,_New_Orleans,_January_2023.jpg
 * - Published: Wikipedia "Ogden Museum of Southern Art" (Goldring Hall,
 *   2003) and "Howard Memorial Library" (1888-89, Richardson's design).
 *
 * Measured (lidar/OSM): plans, the library's ridge and eaves, the turrets'
 * cone feet, Goldring Hall's heights. Estimated from the photos: the round
 * end's cone (rising to the ridge), the turrets' cones (to 13.6), the grid
 * window (3 x 3 lights), the south side's two tiers of windows and its
 * arched door in the round entrance turret (OSM's half-round bay on the south
 * side), the two wall dormers, Goldring Hall's sandstone base (5.0) and its glass-block
 * extent, the window cross. The library's north side (behind Memorial Hall)
 * and Goldring Hall's west side are not photographed and are kept plain.
 * Left out: the banners, the lettering, the lawn's retaining wall.
 *
 * Night: the library's windows and Goldring Hall's glass block glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, circle, save, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, farch, fblock, fprism, tf } from './nola-gallier-hall'
import { gable, spire } from './nola-memorial-hall'

const sand = new Part(), tile = new Part(), orange = new Part(), pale = new Part(), win = new Part(), block = new Part()

// ───────────────────────────── Howard Memorial Library ─────────────────────────────

const EAVE = 9.6, RIDGE = 15.1
const HX0 = -22.9, HX1 = 14.3, HY0 = -28.7, HY1 = -17.3, YM = (HY0 + HY1) / 2
{
  const hall: XY[] = [[HX0, HY0], [HX1, HY0], [HX1, HY1], [HX0, HY1]]
  prism(sand, hall, 0, EAVE, null, 0)
  gable(tile, sand, HX0, HX1, HY0, HY1, EAVE, RIDGE, 0.45, 0)
  // the Camp Street gable's coping, standing proud of the tiles
  const east = faceOf([HX1, HY0], [HX1, HY1]), W = HY1 - HY0
  fprism(sand, east, [[-0.2, EAVE - 0.2], [0.4, EAVE - 0.2], [W / 2, RIDGE - 0.4], [W - 0.4, EAVE - 0.2], [W + 0.2, EAVE - 0.2], [W + 0.2, EAVE + 0.45], [W / 2, RIDGE + 0.5], [-0.2, EAVE + 0.45]], -0.6, 0.15, true)
  // the great grid window, 3 x 3 lights between stone mullions and transoms
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const s0 = W / 2 - 2.0 + i * 1.4, z0 = 3.6 + j * 1.9
    fpanel(win, east, s0 + 0.12, s0 + 1.28, z0, z0 + 1.65)
  }
  fblock(sand, east, W / 2 - 2.3, W / 2 + 2.3, 3.2, 3.6, 0.15) // sill
  // two tiers of windows on the south (Andrew Higgins Drive) side, grouped,
  // and the reading room's great grid window toward Camp Street
  const south = faceOf([HX0, HY0], [HX1, HY0])
  for (let k = 0; k < 6; k++) {
    const s = 12.5 + k * 3.6
    fpanel(win, south, s - 1.2, s - 0.12, 6.4, 8.7)
    fpanel(win, south, s + 0.12, s + 1.2, 6.4, 8.7)
  }
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const s0 = 30.3 + i * 1.35, z0 = 2.6 + j * 1.75
    fpanel(win, south, s0 + 0.12, s0 + 1.23, z0, z0 + 1.5)
  }
  fblock(sand, south, 8, south.L, 6.1, 6.4, 0.12) // string course under the upper band
  // two gabled wall dormers on the south slope near the round end
  for (const s of [3.8, 13.2]) {
    fprism(sand, south, [[s - 1.7, EAVE - 0.5], [s + 1.7, EAVE - 0.5], [s + 1.7, EAVE + 1.0], [s, EAVE + 3.0], [s - 1.7, EAVE + 1.0]], -3.0, 0.05, true)
    fprism(sand, south, [[s - 1.95, EAVE + 0.85], [s, EAVE + 3.25], [s + 1.95, EAVE + 0.85], [s + 1.95, EAVE + 1.25], [s, EAVE + 3.65], [s - 1.95, EAVE + 1.25]], -3.0, 0.2, true)
    farch(win, south, s, 1.4, EAVE - 0.2, EAVE + 1.9, 0.1)
  }
  // the entrance turret: a round bay on the south side with the arched door, under a cone
  {
    const c: XY = [-13.55, -29.6], ring = circle(c, 2.3, 12)
    prism(sand, ring, 0, 8.2, null, 0)
    prism(sand, circle(c, 2.5, 12), 8.0, 8.4, null, 0.1)
    spire(tile, c, 2.6, 8.3, 12.2, 12, 0)
    const F = faceOf(ring[8], ring[9]), G = faceOf(ring[9], ring[10])
    void G
    const s = F.L / 2, w = 1.5, top = 3.6, r = w / 2, spring = top - r, rr: XY[] = []
    for (let i = 0; i <= 8; i++) { const a = Math.PI * (i / 8); rr.push([s + (r + 0.3) * Math.cos(a), spring + (r + 0.3) * Math.sin(a)]) }
    for (let i = 8; i >= 0; i--) { const a = Math.PI * (i / 8); rr.push([s + r * Math.cos(a), spring + r * Math.sin(a)]) }
    fprism(sand, F, rr, -0.05, 0.2)
    farch(win, F, s, w, 1.0, top, 0.08)
    for (const k of [2, 4, 6]) fpanel(win, faceOf(ring[k + 6 > 11 ? k + 6 - 12 : k + 6], ring[(k + 7) % 12]), 0.25, 0.95, 5.0, 7.0)
  }
  // a low rock-faced base course all round (darker stone reads as a plinth line)
  for (const F of [south, east]) fblock(sand, F, 0, F.L, 0, 1.6, 0.18)

  // the round west end: a half drum under a half cone that rises to the ridge
  const C: XY = [HX0, YM], R = 6.0, n = 12
  const arc: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI / 2 + (Math.PI * i) / n
    return [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)] as XY
  })
  for (let i = 0; i < n; i++) {
    const a = arc[i], b = arc[i + 1], m = Math.PI / 2 + (Math.PI * (i + 0.5)) / n
    const o: V3 = [Math.cos(m), Math.sin(m), 0]
    tf(sand, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], o)
    tf(sand, [a[0], a[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE], o)
    // the cone, from an eave ring with its overhang to the apex on the ridge
    const ra = R + 0.45, zo = EAVE - 0.45 * ((RIDGE - EAVE) / R)
    const A: V3 = [C[0] + ra * Math.cos(m - Math.PI / (2 * n)), C[1] + ra * Math.sin(m - Math.PI / (2 * n)), zo]
    const B: V3 = [C[0] + ra * Math.cos(m + Math.PI / (2 * n)), C[1] + ra * Math.sin(m + Math.PI / (2 * n)), zo]
    tf(tile, A, B, [C[0], C[1], RIDGE], [o[0], o[1], 1])
    // windows round the drum: a tall pair of lights in every other bay
    if (i % 2 === 1) fpanel(win, faceOf(a, b), 0.6, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.6, 5.2, 8.4)
  }

  // the two round turrets on the Camp Street corners, cones over a ledge
  for (const c of [[14.0, -16.6], [14.0, -28.5]] as XY[]) {
    const ring = circle(c, 2.2, 12)
    prism(sand, ring, 0, 9.8, null, 0)
    prism(sand, circle(c, 2.4, 12), 9.6, 10.0, null, 0.1)
    spire(tile, c, 2.5, 9.9, 13.6, 12, 0)
    // a slit window high in each, toward the street
    fpanel(win, faceOf(ring[0], ring[1]), 0.15, 0.95, 6.6, 8.4)
  }

  // the block behind, between the library and Memorial Hall (flat roofs)
  // (pale ashlar in the Camp Street photos, beside the turret)
  prism(pale, [[-16, HY1], [-3, HY1], [-3, -10.4], [-16, -10.4]], 0, 14.2, pale, 0.25)
  prism(pale, [[-3, HY1], [1.8, HY1], [1.8, -10.4], [-3, -10.4]], 0, 9.7, pale, 0.25)
  prism(pale, [[1.8, HY1], [5.4, HY1], [5.4, -10.4], [1.8, -10.4]], 0, 12.8, pale, 0.25)
  prism(pale, [[5.4, HY1], [12.1, HY1], [12.1, -10.2], [5.4, -10.2]], 0, 8.8, pale, 0.25)
}

// ───────────────────────────── Stephen Goldring Hall ─────────────────────────────

{
  const BASE = 5.0
  const A: XY[] = [[-16, 1.8], [-5, 1.8], [-5, 19], [-16, 19]]
  const B: XY[] = [[-5, 1.8], [12.7, 1.9], [12.7, 12], [-5, 12]]
  const D2: XY[] = [[-5, 12], [16.4, 12], [16.4, 12.8], [19.7, 12.9], [19.7, 16.3], [22.6, 16.3], [22.6, 28.8], [9, 28.8], [9, 19], [-5, 19]]
  const D1: XY[] = [[-16, 19], [9, 19], [9, 28.7], [-16, 28.7]]
  prism(orange, A, 0, 23.1, pale, 0.3)
  prism(orange, B, 0, 17.0, pale, 0.3)
  prism(orange, D2, 0, 23.1, pale, 0.3)
  prism(orange, D1, 0, 28.4, pale, 0.3)
  prism(orange, [[-12, 22], [-4, 22], [-4, 27], [-12, 27]], 28.4, 30.5, pale, 0.2)
  // the pale sandstone ground storey on the street faces
  const street: [XY, XY][] = [[[12.7, 1.9], [12.7, 12]], [[12.7, 12], [16.4, 12]], [[16.4, 12.8], [19.7, 12.9]], [[19.7, 12.9], [19.7, 16.3]], [[19.7, 16.3], [22.6, 16.3]], [[22.6, 16.3], [22.6, 28.8]], [[22.6, 28.8], [9, 28.8]], [[9, 28.7], [-16, 28.7]]]
  for (const [a, b] of street) {
    const F = faceOf(a, b)
    fblock(pale, F, -0.02, F.L + 0.02, 0, BASE, 0.12)
    fblock(pale, F, -0.02, F.L + 0.02, BASE, BASE + 0.35, 0.3)
  }
  // shop-front glazing in the base on Camp Street
  const Bf = faceOf([12.7, 1.9], [12.7, 12])
  fpanel(win, Bf, 1.2, Bf.L - 1.2, 0.4, 3.4, 0.16)
  const Df = faceOf([22.6, 16.3], [22.6, 28.8])
  fpanel(win, Df, 1.0, 5.5, 0.4, 3.4, 0.16)
  // the glass-block tower on the Camp Street block and its returns
  fpanel(block, Bf, 0.6, Bf.L - 0.6, BASE + 0.6, 16.3)
  const r1 = faceOf([12.7, 12], [16.4, 12]), r2 = faceOf([19.7, 12.9], [19.7, 16.3])
  fpanel(block, r1, 0.4, r1.L - 0.4, BASE + 0.6, 21.8)
  fpanel(block, r2, 0.4, r2.L - 0.4, BASE + 0.6, 21.8)
  // a glass-block strip on Goldring Hall's south face, over Memorial Hall
  const As = faceOf([-16, 1.8], [-5, 1.8])
  fpanel(block, As, 2.0, As.L - 2.0, 9.0, 21.5)
  // the window cross high on the Camp Street wall: four square lights
  for (const [s, z] of [[Df.L - 4.2, 18.0], [Df.L - 2.6, 18.0], [Df.L - 4.2, 19.6], [Df.L - 2.6, 19.6]] as [number, number][]) fpanel(win, Df, s - 0.65, s + 0.65, z - 0.65, z + 0.65)
  fblock(pale, Df, Df.L - 5.1, Df.L - 1.7, 18.7, 18.9, 0.08)
}

const glow = (p: V3, n: V3) => (p[0] > 10 && n[0] > 0.5 ? 0.7 : p[1] < -16 && n[1] < -0.5 ? 0.6 : 0.1)
await save('nola-ogden-museum', 'Ogden Museum of Southern Art', [
  { part: sand, material: { ...finish('howard-sandstone', 0xa66b52), floodlight: glow } },
  { part: tile, material: finish('howard-tile', 0x8c5246) },
  { part: orange, material: finish('ogden-orange', 0xd26a4c) },
  { part: pale, material: { ...PALETTE.stone, color: 0xe2d6bf } },
  { part: win, material: PALETTE.window },
  { part: block, material: windowVariant(2, 0xc9d4d0) },
], { bearing: 14.5, osm: 'way/1391223539', height: 30.5 }, 5000)
