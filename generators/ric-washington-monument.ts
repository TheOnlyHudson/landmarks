/**
 * Virginia Washington Monument, Capitol Square, Richmond, Virginia (Thomas
 * Crawford, completed by Randolph Rogers; equestrian statue erected 1858,
 * finished 1869) — original procedural geometry, CC0-1.0.
 * bun generators/ric-washington-monument.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 40: +y is the way
 * Washington's horse faces (about 40°, north-east; from the lidar, below).
 * Anchor = the centroid of OSM way/658621480 (the round railed enclosure,
 * tourism=artwork, no building), -77.4339706, 37.5395160.
 *
 * Identity (from the photos below):
 *  1. A bronze Washington on a striding horse (near fore-leg raised, head
 *     up, tail streaming), right arm out, in a tricorne, on a tall pale
 *     granite pedestal: a hexagonal shaft, a broad moulded cornice, and a
 *     narrower top stage (the one with the three stars).
 *  2. Six standing bronze Virginians (Henry, Jefferson, Marshall, Mason,
 *     Nelson, Lewis) on round drums at the corners of a hexagonal block
 *     round the shaft's foot.
 *  3. Six lower square pedestals on the points of a star-shaped granite
 *     base, carrying the bronze allegories, with flights of steps between
 *     the points.
 *
 * Sculpture rules (STYLE.md, "Small, famous objects"): bold simple masses
 * at the real size and pose; no lettering, stars, wreaths or the railing.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid: the ground inside the railing is level (within 0.3 m); the
 * granite platform 1.6 above it, reaching about 6.5–7 m from the centre;
 * the highest return (Washington's hat) 17.4. Published: the equestrian
 * statue is 21 ft (6.4 m) tall (Wikipedia). Estimated from the HABS and
 * Falbisoner photos (side-on, scaled to the lidar's total height): the
 * pedestal stages (block to 4.4, drums to 5.5, shaft to 10.3, cornice to
 * 10.95, top stage to 11.8), the standing figures (about 3.6 m), the outer
 * pedestals (to 3.05, their groups to about 4.5) and the radii. The horse
 * and rider are drawn at 1.42x a horse-and-rider of simple masses, so the
 * hat reaches 17.2 and the horse is about 4.2 m chest to rump, as in the
 * photos.
 *
 * Heading: the lidar's top returns make a line from the rider's head
 * (17.4, near the centre) to a second high cluster (16.0–16.3) 3.5 m to
 * the north-east, which can only be the horse's raised head; so the horse
 * faces about 40°. The pedestal's hexagon is set with a corner forward,
 * as the side-on photos (three faces seen, figures in pairs) show.
 *
 * Photos (EVIDENCE):
 *  - Washington Monument Richmond.JPG, Martin Falbisoner, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Washington_Monument_Richmond.JPG
 *  - Washington Monument, Richmond-1.jpg, Smash the Iron Cage, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Washington_Monument,_Richmond-1.jpg
 *  - Washington Monument at the Virginia State Capitol, in Richmond,
 *    Virginia.jpg, Historic American Buildings Survey, public domain
 *    https://commons.wikimedia.org/wiki/File:Washington_Monument_at_the_Virginia_State_Capitol,_in_Richmond,_Virginia.jpg
 * Facts: Wikipedia, "Virginia Washington Monument" (statue 21 ft, 18,000 lb;
 * the six figures). No look-only sources. No commercial imagery.
 *
 * Doubts: all three photos look from about the same side (the horse's
 * left); the far side repeats it. The heading rests on lidar alone. The
 * allegories are drawn as plain bronze lumps.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { revolve, type XY } from './atl-tech-tower'
import { prism, save } from './atl-flatiron-building'
import { ellipsoid, limb } from './ric-capitol-bell-tower'

const granite = new Part(), shade = new Part(), bronze = new Part()

/** A regular polygon of circumradius r with a corner at angle a0 (radians from +y, clockwise). */
const poly = (r: number, n: number, a0 = 0, c: XY = [0, 0]): XY[] =>
  Array.from({ length: n }, (_, i) => { const a = a0 - (i / n) * Math.PI * 2; return [c[0] + r * Math.sin(a), c[1] + r * Math.cos(a)] as XY })
const hex = (apothem: number, cornerAt = 0) => poly(apothem / Math.cos(Math.PI / 6), 6, cornerAt)
const dir = (a: number): XY => [Math.sin(a), Math.cos(a)]
const PI3 = Math.PI / 3

// ── the star-shaped base: steps between six points ──
const PLAT = 1.6
const steps = [8.3, 7.7, 7.1, 6.5]
steps.forEach((ap, i) => prism(i % 2 ? granite : shade, hex(ap), i * 0.4, (i + 1) * 0.4, i % 2 ? granite : shade, 0.06))
for (let k = 0; k < 6; k++) {
  const a = k * PI3, [ux, uy] = dir(a), [vx, vy] = [uy, -ux]
  const arm = (r0: number, r1: number, w: number): XY[] => [
    [ux * r0 - vx * w, uy * r0 - vy * w], [ux * r1 - vx * w, uy * r1 - vy * w], [ux * r1 + vx * w, uy * r1 + vy * w], [ux * r0 + vx * w, uy * r0 + vy * w],
  ]
  const ccwR = (r: XY[]) => { const ar = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0); return ar < 0 ? [...r].reverse() : r }
  // the point of the star, and its pedestal for an allegory
  prism(granite, ccwR(arm(5.5, 9.0, 1.35)), 0, PLAT, granite, 0.1)
  prism(granite, ccwR(arm(6.55, 8.35, 0.9)), PLAT, PLAT + 0.35, granite, 0.08)
  prism(granite, ccwR(arm(6.7, 8.2, 0.75)), PLAT + 0.35, 2.75, null, 0)
  prism(granite, ccwR(arm(6.6, 8.3, 0.85)), 2.75, 3.05, granite, 0.1)
  // the allegory: a seated bronze group
  const c: V3 = [ux * 7.45, uy * 7.45, 0]
  ellipsoid(bronze, [c[0], c[1], 3.6], [0.6, 0.5, 0.6], a, 0, 8, 5)
  ellipsoid(bronze, [c[0] + ux * 0.1, c[1] + uy * 0.1, 4.3], [0.2, 0.2, 0.25], a, 0, 6, 4)
  limb(bronze, [c[0] - vx * 0.45, c[1] - vy * 0.45, 3.05], [c[0] - vx * 0.5 + ux * 0.25, c[1] - vy * 0.5 + uy * 0.25, 4.2], 0.34, 0.27, 6)
}

// ── the central block, drums and standing figures ──
const BLK = 4.4, DRUM = 5.5
prism(granite, hex(4.2 * Math.cos(Math.PI / 6)), PLAT, BLK, granite, 0.12)
prism(shade, hex(3.3 * Math.cos(Math.PI / 6)), BLK, DRUM, shade, 0.1)
for (let k = 0; k < 6; k++) {
  const a = k * PI3, [ux, uy] = dir(a), c: XY = [ux * 3.75, uy * 3.75]
  revolve(granite, c, [[0.85, BLK], [0.85, BLK + 0.15], [0.72, BLK + 0.25], [0.72, DRUM - 0.2], [0.85, DRUM - 0.12], [0.85, DRUM]], 12, 0, false, true)
  // a standing figure facing out, about 3.6 m
  const fx = (r: number, h: number, side = 0): V3 => [c[0] + ux * r + uy * side, c[1] + uy * r - ux * side, h]
  limb(bronze, fx(0, DRUM), fx(0.05, DRUM + 2.6), 0.5, 0.33, 8)
  ellipsoid(bronze, fx(0.05, DRUM + 2.75), [0.4, 0.28, 0.27], a, 0, 8, 4)
  ellipsoid(bronze, fx(0.08, DRUM + 3.25), [0.21, 0.23, 0.28], a, 0, 8, 5)
  limb(bronze, fx(0.05, DRUM + 2.7, 0.4), fx(0.35, DRUM + 1.6, 0.45), 0.14, 0.11, 5)
  limb(bronze, fx(0.05, DRUM + 2.7, -0.4), fx(0.18, DRUM + 1.4, -0.42), 0.14, 0.11, 5)
}

// ── the shaft, cornice and top stage ──
prism(granite, hex(2.3 * Math.cos(Math.PI / 6)), DRUM, 10.3, null, 0)
prism(granite, hex(2.5 * Math.cos(Math.PI / 6)), DRUM, DRUM + 0.45, null, 0) // a base moulding
prism(granite, hex(2.55 * Math.cos(Math.PI / 6)), 10.1, 10.35, null, 0)
prism(granite, hex(2.9 * Math.cos(Math.PI / 6)), 10.35, 10.95, granite, 0.28)
prism(granite, hex(2.05 * Math.cos(Math.PI / 6)), 10.95, 11.5, null, 0)
prism(granite, hex(2.3 * Math.cos(Math.PI / 6)), 11.5, 11.8, granite, 0.12)

// ── Washington on horseback, 1.42× simple masses, facing +y ──
{
  const S = 1.42, Z = 11.8
  const P = (x: number, y: number, z: number): V3 => [x * S, y * S, Z + z * S]
  const E = (c: V3, r: V3, yaw = 0, pitch = 0, nu = 10, nv = 6) => ellipsoid(bronze, P(...c), [r[0] * S, r[1] * S, r[2] * S], yaw, pitch, nu, nv)
  const L = (pts: V3[], r0: number, r1: number, n = 6) => { for (let i = 0; i < pts.length - 1; i++) limb(bronze, P(...pts[i]), P(...pts[i + 1]), r0 + (r1 - r0) * (i / (pts.length - 1)), r0 + (r1 - r0) * ((i + 1) / (pts.length - 1)), n) }
  // the bronze plinth plate
  prism(bronze, poly(0.62 * S, 4, Math.PI / 4).map(([x, y]) => [x * 0.75, y * 2.0] as XY), Z, Z + 0.12, bronze, 0.03)
  // horse: a deep barrel on short legs, the neck high and the head up
  E([0, 0, 1.5], [0.56, 1.3, 0.62], 0, 0.06)
  E([0, 0.85, 1.62], [0.54, 0.6, 0.66])
  E([0, -0.85, 1.55], [0.58, 0.66, 0.62])
  L([[0, 1.0, 1.85], [0, 1.45, 2.95]], 0.46, 0.3, 8)
  L([[0, 1.45, 3.05], [0, 1.95, 2.6]], 0.24, 0.15, 6)
  for (const sx of [-1, 1]) L([[sx * 0.28, -1.0, 1.35], [sx * 0.28, -1.3, 0.6], [sx * 0.28, -1.1, 0.0]], 0.18, 0.11)
  L([[0.28, 0.95, 1.3], [0.28, 1.0, 0.55], [0.28, 0.98, 0.0]], 0.17, 0.11)
  L([[-0.28, 0.95, 1.3], [-0.28, 1.5, 0.95], [-0.28, 1.35, 0.5]], 0.17, 0.11)
  L([[0, -1.4, 1.85], [0, -2.0, 1.75], [0, -2.4, 1.1]], 0.17, 0.22)
  // rider
  E([0, -0.15, 2.1], [0.4, 0.4, 0.26])
  E([0, -0.45, 2.0], [0.56, 0.45, 0.14])
  L([[0, -0.15, 2.05], [0, -0.05, 3.15]], 0.33, 0.3, 8)
  E([0, -0.02, 3.4], [0.19, 0.21, 0.23], 0, 0, 8, 5)
  L([[0, -0.02, 3.58], [0, -0.02, 3.8]], 0.35, 0.3, 8)
  L([[0.32, -0.05, 3.05], [0.52, 0.35, 3.1], [0.64, 0.8, 3.3]], 0.12, 0.1, 5)
  L([[-0.32, -0.05, 3.05], [-0.37, 0.25, 2.6], [-0.2, 0.55, 2.45]], 0.12, 0.1, 5)
  for (const sx of [-1, 1]) L([[sx * 0.3, -0.1, 2.1], [sx * 0.52, 0.25, 1.75], [sx * 0.5, 0.12, 1.2]], 0.15, 0.11)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.85)
await save('ric-washington-monument', 'Virginia Washington Monument', [
  { part: granite, material: { ...finish('washington-granite', 0xe8e5de), floodlight: lit } },
  { part: shade, material: { ...finish('washington-granite-shade', 0xd9d5cc), floodlight: lit } },
  { part: bronze, material: { ...finish('washington-bronze', 0x6b5a48, 0.5), floodlight: () => 0.5 } },
], { height: 17.2, anchor: [37.539516, -77.4339706], bearing: 40 })
