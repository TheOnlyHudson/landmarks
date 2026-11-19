/**
 * Andrew Jackson, equestrian statue (Clark Mills, cast 1856), Jackson
 * Square, New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-andrew-jackson-statue.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor (OSM node/331257382, tourism=artwork) on the ground. Placed at
 * bearing 37, the square's cross axis (parallel to Chartres Street and the
 * cathedral front): model −y is the horse's head, which points compass 217°
 * toward the Cabildo side; the long sides of the pedestal face the
 * cathedral and the river. OSM maps no building here: replaces [].
 * The lidar puts the pedestal's centre 0.7 m model-east and 0.1 m
 * model-north of the OSM node, so the group is drawn about (PX, PY).
 *
 * Identity: the bronze horse rearing on its hind legs alone, forelegs
 * tucked high, tail streaming; Jackson upright in the saddle raising his
 * bicorne high in his right hand; the rough rock it stands on; the tall
 * pale granite pedestal of two blocks on a base course.
 *
 * Evidence
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (flown 2021-22), all classes, raw
 *   points within 9 m. Ground 3.38 m (NAVD-ish) round the fenced bed; the
 *   bed itself (hedges, flowers) reads ~0.45 m up with planting to 1.5 m.
 *   The pedestal top (with its rock) at 3.5-3.7 m over the ground, a
 *   4.3 x 2.0 m patch, long axis about compass 40-50°. As with the
 *   cathedral's slate spires, the dark bronze returns no points at all, so
 *   the statue is scaled from photos against the pedestal.
 * - Published: Wikipedia, "Equestrian statue of Andrew Jackson (Washington,
 *   D.C.)" (the New Orleans statue is a second casting, dedicated February
 *   1856): the first equestrian statue balanced on the hind legs alone, no
 *   tail support; about a third larger than life; about 15 tons. OSM tags:
 *   granite plinth, bronze statue.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Andrew Jackson NO.jpg", Ianaré Sévi, CC BY-SA 3.0, the left side
 *     in profile against the cathedral: the whole pose, scaled at 5.4 mm/px
 *     from the 4.4 m pedestal top
 *     https://commons.wikimedia.org/wiki/File:Andrew_Jackson_NO.jpg
 *   - "Andrew Jackson NO oblique.jpg", Ianaré Sévi, CC BY-SA 3.0, from
 *     below at the front left (the tucked forelegs, the reins hand)
 *     https://commons.wikimedia.org/wiki/File:Andrew_Jackson_NO_oblique.jpg
 *   - "Andrew Jackson statue, New Orleans October 2024.jpg", lukeharold,
 *     CC0, head-on from the front right: the hat in the right hand, the
 *     two-block granite pedestal, its colours
 *     https://commons.wikimedia.org/wiki/File:Andrew_Jackson_statue,_New_Orleans_October_2024.jpg
 *   - "Jackson Square New Orleans - General Jackson statue - 20 Feb
 *     2022.jpg", 2C2K Photography, CC BY 2.0 (left side, the rock top)
 *     https://commons.wikimedia.org/wiki/File:Jackson_Square_New_Orleans_-_General_Jackson_statue_-_20_Feb_2022.jpg
 *   - "Jackson Square Aerial Photo.jpg", Jordon Dopp, CC BY-SA 4.0 (from
 *     above the river side: the orientation, the pedestal in its fenced bed)
 *     https://commons.wikimedia.org/wiki/File:Jackson_Square_Aerial_Photo.jpg
 *   - "St. Louis Cathedral, Jackson Square, French Quarter, New Orleans,
 *     Louisiana 2.jpg", Ken Lund, CC BY-SA 2.0 (night: the statue lit
 *     from the beds below)
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral,_Jackson_Square,_French_Quarter,_New_Orleans,_Louisiana_2.jpg
 *
 * Measured: the pedestal top (3.6 m with the rock) and its plan (4.4 x 2.1
 * m top block). Estimated from the photos against it: the base course and
 * the two blocks' split, the rock, the statue, traced from the left-profile photo at 8.7 mm/px
 * (rock to hat 3.8 m, ears 3.6 m; the body reared ~26°, a long back with
 * high hindquarters, long hind legs angled forward to the hooves, a thick
 * arched neck, the head forward and down at the rider's chest height, a
 * long thin tail hanging nearly to the rock, the rider's leg, boot and
 * sword down the flank; the rock a low mound about 1.2 x 2.3 m;
 * forehooves to tail tip 4.0 m), every limb.
 * The fenced bed, hedges and inscriptions are left out (ground and fine
 * detail). The bronze is drawn as a dark green-brown patina, pulled to
 * charcoal's lightness at the darkest.
 *
 * Doubts: the brief's "statue about 4 m on a 4-5 m pedestal" is larger than
 * the lidar pedestal (3.6 m) and the photo ratios give; the measured
 * pedestal is used. The bearing (37) follows the square; the sparse lidar
 * patch reads nearer 45°.
 *
 * Night: lit from the beds (`floodlight`): the granite well, the bronze
 * softly, so it still reads dark against the floodlit cathedral.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { smooth, solid, tube, ellipsoid, slab } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

const PX = 0.7, PY = 0.1

/** A tube along a Catmull-Rom curve through `pts`, radii eased between them, so limbs bend smoothly. */
function stube(q: Part, pts: V3[], radii: number[], sides: number, sub = 3) {
  if (pts.length < 3) return tube(q, pts, radii, sides)
  const path: V3[] = [], rad: number[] = []
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    for (let k = 0; k < sub; k++) {
      const t = k / sub, t2 = t * t, t3 = t2 * t
      path.push([0, 1, 2].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as V3)
      const e = (1 - Math.cos(t * Math.PI)) / 2
      rad.push(radii[i] + (radii[i + 1] - radii[i]) * e)
    }
  }
  path.push(pts[pts.length - 1]); rad.push(radii[radii.length - 1])
  tube(q, path, rad, sides)
}
const granite = new Part(), rock = new Part(), bronze = new Part()

// --- The pedestal: base course, the tall lower block, the upper block. ---
const blk = (p: Part, hx: number, hy: number, z0: number, z1: number, bevel: number) =>
  prism({ wall: p, win: null, roof: p, ring: chamferRect(PX - hx, PY - hy, PX + hx, PY + hy, 0), z0, z1, facade: null, bevel })
blk(granite, 1.5, 2.6, 0, 0.5, 0.08)
blk(granite, 1.28, 2.38, 0.5, 2.75, 0.05)
blk(granite, 1.05, 2.15, 2.75, 3.35, 0.06)

// --- The rough rock: a low lumpy mound in the middle of the top block. ---
const ZR = 3.6
{
  const z0 = 3.35, n = 18
  const jag = (i: number, k: number) => 1 + 0.1 * Math.sin(i * 2.7 + k * 1.3) + 0.07 * Math.cos(i * 5.1 + k * 2.2)
  const ring = (rx: number, ry: number, z: number, k: number): V3[] =>
    ell(PX, PY + 0.1, z, rx, ry, n).map(([x, y, zz], i) => [PX + (x - PX) * jag(i, k), PY + 0.1 + (y - PY - 0.1) * jag(i, k), zz + 0.03 * Math.sin(i * 3.3 + k)] as V3)
  smooth(rock, q => {
    solid(q, [ring(0.6, 1.15, z0, 0), ring(0.58, 1.12, z0 + 0.1, 1), ring(0.46, 0.92, z0 + 0.2, 2), ring(0.26, 0.55, ZR - 0.02, 3)])
    const lumps: [number, number, number][] = [[0.3, -0.6, 0.16], [-0.32, -0.3, 0.17], [0.3, 0.55, 0.15], [-0.28, 0.75, 0.16], [0.05, -0.95, 0.13]]
    for (const [x, y, r] of lumps) ellipsoid(q, [PX + x, PY + 0.1 + y, z0 + 0.12], [r, r * 1.2, r * 0.6], 8, 3)
  }, 70)
}

// --- Horse and rider, traced from the left-profile photo at 8.7 mm/px
// (y along the horse, −y the head; z from the rock top at 3.6 m). ---
const P = (x: number, y: number, z: number): V3 => [PX + x, PY + y, z]
const DEG = Math.PI / 180
smooth(bronze, q => {
  // Body: a long back rising ~26° from high hindquarters to a deep chest.
  ellipsoid(q, P(0, -0.05, 5.3), [1.05, 0.42, 0.47], 18, 9, 90 * DEG, -26 * DEG)
  ellipsoid(q, P(0, -0.88, 5.75), [0.4, 0.4, 0.5], 14, 7, 90 * DEG, -26 * DEG)
  for (const sx of [-1, 1]) ellipsoid(q, P(sx * 0.17, 0.78, 5.1), [0.42, 0.25, 0.46], 14, 7, 90 * DEG, -15 * DEG)
  // Long hind legs: thigh forward to the stifle, gaskin down to the hock,
  // the cannon angled forward to hooves planted under the belly.
  for (const [sx, hy] of [[1, -0.12], [-1, 0.3]] as [number, number][])
    stube(q, [P(sx * 0.22, 0.86, 5.05), P(sx * 0.24, 0.52, 4.6), P(sx * 0.23, 0.62, 4.08), P(sx * 0.22, hy + 0.12, 3.74), P(sx * 0.22, hy, ZR + 0.06)], [0.26, 0.18, 0.11, 0.085, 0.1], 10)
  // A thick arched neck; the big wedge head forward and down at the rider's chest height.
  stube(q, [P(0, -0.82, 5.95), P(0, -1.02, 6.35), P(0, -0.98, 6.72), P(0, -0.86, 6.9)], [0.42, 0.34, 0.26, 0.2], 12)
  stube(q, [P(0, -0.88, 6.94), P(0, -1.12, 6.76), P(0, -1.32, 6.56), P(0, -1.44, 6.45)], [0.21, 0.18, 0.14, 0.11], 10)
  for (const sx of [-1, 1]) stube(q, [P(sx * 0.08, -0.8, 7.02), P(sx * 0.09, -0.77, 7.2)], [0.055, 0.015], 6)
  // Forelegs: forearms reaching forward, cannons hanging, hooves curled.
  stube(q, [P(0.2, -0.95, 5.6), P(0.2, -1.12, 5.38), P(0.21, -1.82, 5.32), P(0.21, -2.02, 4.66)], [0.17, 0.13, 0.09, 0.1], 10)
  stube(q, [P(-0.2, -0.95, 5.5), P(-0.2, -1.06, 5.12), P(-0.2, -1.58, 5.02), P(-0.2, -1.67, 4.4)], [0.17, 0.13, 0.09, 0.1], 10)
  // The tail: thinner, long, hanging down and back nearly to the rock, wavy.
  stube(q, [P(0, 1.14, 5.22), P(0.03, 1.5, 5.0), P(-0.04, 1.72, 4.62), P(0.04, 1.9, 4.25), P(0, 2.0, 3.92)], [0.09, 0.13, 0.13, 0.11, 0.05], 8)

  // Jackson upright in the saddle: torso, shoulders, head, coat skirts.
  stube(q, [P(0, -0.2, 5.72), P(0, -0.1, 6.18), P(0, 0.02, 6.6)], [0.25, 0.24, 0.22], 10)
  ellipsoid(q, P(0, 0.02, 6.56), [0.31, 0.16, 0.14], 12, 6)
  stube(q, [P(0, 0.08, 6.64), P(0, 0.12, 6.78)], [0.08, 0.08], 8)
  ellipsoid(q, P(0, 0.17, 6.92), [0.13, 0.14, 0.16], 12, 6)
  ellipsoid(q, P(0, 0.05, 5.82), [0.3, 0.27, 0.16], 12, 5)
  // His legs down the flanks, boots in the stirrups below the belly line.
  for (const sx of [-1, 1]) stube(q, [P(sx * 0.3, -0.22, 5.72), P(sx * 0.47, -0.6, 5.3), P(sx * 0.47, -0.72, 4.76), P(sx * 0.47, -0.9, 4.68)], [0.13, 0.11, 0.09, 0.08], 8)
  // The sword hanging at his left side, down the flank.
  stube(q, [P(0.4, -0.05, 5.78), P(0.44, 0.1, 5.3), P(0.45, 0.22, 4.82)], [0.045, 0.04, 0.03], 6)
  // Right arm raised with the bicorne high; the left holds the reins.
  stube(q, [P(-0.27, 0.02, 6.55), P(-0.36, -0.2, 6.68), P(-0.32, -0.3, 6.95)], [0.09, 0.08, 0.07], 8)
  slab(q, P(-0.32, -0.24, 6.97), [0, 1, 0], [0, 0, 1], [[-0.36, 0], [0.36, 0], [0.3, 0.18], [0.1, 0.4], [-0.1, 0.4], [-0.3, 0.18]], 0.16)
  stube(q, [P(0.27, 0.02, 6.55), P(0.36, -0.05, 6.2), P(0.18, -0.35, 6.1)], [0.09, 0.08, 0.07], 8)
  tube(q, [P(0.18, -0.35, 6.1), P(0.13, -0.95, 6.35), P(0.1, -1.38, 6.52)], [0.03, 0.03, 0.03], 5)
}, 60)

// Lit from the bed below: the granite well, the bronze only softly (at
// night it reads dark against the floodlit cathedral, Ken Lund's photo);
// faces looking straight up catch least.
const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.75)
const litBronze = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.4)
finishModel('Andrew Jackson', 'nola-andrew-jackson-statue', [
  { part: granite, material: { ...finish('ajs-granite', 0xd9d6cf), floodlight: lit } },
  { part: rock, material: { ...finish('ajs-rock', 0xbdb4a4), floodlight: lit } },
  { part: bronze, material: { ...finish('ajs-bronze', 0x625c4c, 0.6), floodlight: litBronze } },
], { bearing: 37, osm: 'node/331257382', height: 7.4 }, 5000)
