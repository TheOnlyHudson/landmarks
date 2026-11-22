/**
 * George S. and Dolores Doré Eccles Theater (2016, HGA / Pelli Clarke
 * Pelli), 131 S Main Street, Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-eccles-theater.ts   (kit: slc-wells-fargo-center.ts)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/537033478 (-111.890246, 40.766334). y = 0 is the
 * lowest ground under the outline.
 *
 * Form: on Main Street (west), a 48 m white front: a glazed ground storey
 * behind a white sign band, a three-storey glass galleria between slim
 * white fins, then a recessed terrace storey under a thin white roof slab
 * that cantilevers out over it on round columns, its soffit warm wood. Behind
 * the front, the white auditorium block, and east of it the taller fly
 * tower; lower back-of-house blocks fill the rest of the outline to Regent
 * Street, including the southern lobe. 111 Main (separate model,
 * slc-111-main) stands just north; OSM's outlines only touch there, and
 * every volume here stays inside this outline, so the two don't overlap.
 *
 * OSM: way/537033478 outline (Q28448378), no heights or parts.
 * Heights estimated from photos (the 2013 lidar predates the building):
 * front 27 m to the slab top, the ground storey 6.5 m, sign band to 9 m,
 * galleria to 20.5 m, terrace storey to 24.5 m, slab 2.5 m (p1, p2); the
 * auditorium 30 m and fly tower 38 m (p1, where the fly tower shows over
 * the slab; typical of a 2,500-seat house), its position over the
 * stage east of the auditorium read from the NAIP roofs; back of house 22 m
 * and the south lobe 18 m (NAIP shadows, roughly).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Eccles_Theater_-_Salt_Lake_City,_Utah_-_13_April_2025.jpg
 *     Beneathtimp, CC0 (the Main Street front from the south-west)
 *  p2 https://commons.wikimedia.org/wiki/File:George_S._and_Dolores_Doré_Eccles_Theater.jpg
 *     EWS23, CC BY-SA 4.0 (the front at night, from the north-west)
 * NAIP (USGS, public domain) for the roofs.
 * Doubts: no licensed photo of the Regent Street (east) side or the fly
 * tower close up; its height and the back-of-house blocks are estimates.
 * The front's lettering is left out (a long thin band that won't read).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, edges, edgeNormal, bays, boxOn, rect, cap, panel, cylinder, save } from './slc-wells-fargo-center'

const white = new Part(), win = new Part(), lobby = new Part(), wood = new Part(), roof = new Part()

const OUT: XY[] = [[-1.3, -14.6], [-1.5, -38.6], [6.1, -38.6], [6.1, -41.0], [19.6, -41.1], [19.6, -38.5], [26.9, -38.5], [26.9, -40.3],
  [32.1, -40.3], [32.3, -16.0], [30.1, -16.0], [30.1, -7.7], [30.7, -7.7], [30.7, -6.4], [32.8, -6.4], [32.8, 4.2], [30.5, 4.2],
  [30.6, 33.0], [15.1, 33.1], [15.0, 30.7], [2.5, 30.8], [2.5, 34.0], [-5.5, 34.0], [-51.8, 34.2], [-52.1, -14.3]]

// Back of house over the whole outline east of the front, then the auditorium and fly tower.
const BACK: XY[] = OUT.map(([x, y]) => [Math.max(x, -32), y] as XY).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1])
prism(white, BACK, 0, 18)
prism(white, [[-32, -14.3], [12, -14.4], [12, 33.6], [-32, 34.0]], 18, 22)
prism(white, [[12, -16], [30.3, -16], [30.3, 33], [12, 33.1]], 18, 22)
prism(white, rect(-30, -11, 0, 31.5), 22, 30)
prism(white, rect(0, -8, 20, 30), 22, 38)
for (const [a, b] of edges(rect(0, -8, 20, 30))) bays(roof, a, b, 4, 0.9, [[36.6, 37.6]]) // the fly tower's louvre band
cap(roof, rect(-29, -10, -1, 30.5), 30.05, true)

// The Main Street front: x -52 to -32 between y -14.3 and 34.1.
const W0 = -52.0, S0 = -14.3, N0 = 34.1, E0 = -32
const front: XY = [W0, N0], frontS: XY = [W0, S0] // the west face runs north to south (outward = west)
// ground storey: glazed lobby set 0.6 m back behind the white piers
prism(lobby, [[W0 + 0.6, S0 + 1], [E0, S0 + 1], [E0, N0 - 1], [W0 + 0.6, N0 - 1]], 0, 6.5, false)
// the front's solid ends and back
prism(white, [[W0, S0], [W0 + 20, S0], [W0 + 20, S0 + 1], [W0, S0 + 1]], 0, 24.5)
prism(white, [[W0, N0 - 1], [W0 + 20, N0 - 1], [W0 + 20, N0], [W0, N0]], 0, 24.5)
// sign band and galleria
prism(white, [[W0, S0], [E0, S0], [E0, N0], [W0, N0]], 6.5, 9)
prism(win, [[W0 + 0.3, S0 + 1], [E0, S0 + 1], [E0, N0 - 1], [W0 + 0.3, N0 - 1]], 9, 20.5, false)
prism(white, [[W0, S0], [E0, S0], [E0, N0], [W0, N0]], 20.5, 21.3)
// the fins in front of the galleria glass
const L = N0 - S0
for (let s = 3; s < L - 2; s += 2.9) boxOn(white, front, frontS, s - 0.2, s + 0.2, 9, 20.5, 0.6, 0.3)
// terrace storey, recessed 3.5 m, glazed, with round columns under the slab
prism(win, [[W0 + 3.5, S0 + 1], [E0, S0 + 1], [E0, N0 - 1], [W0 + 3.5, N0 - 1]], 21.3, 24.5, false)
for (let s = 4; s < L - 2; s += 5.6) cylinder(white, [W0 + 1.6, N0 - s], 0.45, 21.3, 24.5, 8, false)
// the roof slab: white edge, wood soffit, a few skylight openings drawn as glass
prism(white, [[W0 - 1.5, S0 - 0.5], [E0, S0 - 0.5], [E0, N0 + 0.0], [W0 - 1.5, N0 + 0.0]], 25.2, 27, true)
cap(wood, [[W0 - 1.5, S0 - 0.5], [E0, S0 - 0.5], [E0, N0], [W0 - 1.5, N0]], 25.2, false)
prism(wood, [[W0 - 1.5, S0 - 0.5], [E0, S0 - 0.5], [E0, N0], [W0 - 1.5, N0]], 24.5, 25.2, false)
// doors under the sign band
for (const s of [12, 24, 36]) panel(lobby, front, frontS, s - 1.8, s + 1.8, 0.2, 4.2, -0.55)
// the back's punched windows on Regent Street and the south lobe: a few office strips
for (const [a, b] of edges(BACK)) {
  const n = edgeNormal(a, b)
  if (n[0] > 0.9 || n[1] < -0.9) bays(win, a, b, 6, 0.7, [[11, 13.5]])
}

save('slc-eccles-theater', 'Eccles Theater', [
  // Cool white panels and fins (p1); the galleria and terrace glass, pale and reflective;
  // the lobby glows at night (p2); the slab's warm wood soffit (p1, p2).
  { part: white, material: finish('eccles-white', 0xedebe6) },
  { part: win, material: { name: 'window', color: 0x8ea5b6, roughness: 0.3 } },
  { part: lobby, material: { name: 'entrance', color: 0x9db0bd, roughness: 0.3 } },
  { part: wood, material: finish('eccles-wood', 0xc58f5e) },
  { part: roof, material: PALETTE.roof },
], 38)
