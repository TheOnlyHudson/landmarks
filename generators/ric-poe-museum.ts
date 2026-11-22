/**
 * The Old Stone House of the Edgar Allan Poe Museum, 1914–1916 East Main
 * Street, Shockoe Bottom, Richmond, Virginia (c. 1740s, Richmond's oldest
 * standing house; Poe Museum since 1922) — original procedural geometry,
 * CC0-1.0.
 * bun generators/ric-poe-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 37.87: the short sides of OSM way/365615571 run at 37.9°,
 * so x runs along East Main Street (to the south-east) and the street front
 * is the -y face, looking south-west. Anchor = the outline's centroid,
 * -77.4260371, 37.5320968.
 *
 * Identity (from the photos below): a small one-and-a-half-storey house of
 * brown rubble fieldstone, its long side on Main Street, with a steep
 * wood-shingle gable roof, three white gabled dormers on the street slope,
 * brick chimneys at the two ends of the ridge, a door with a white frame
 * just right of centre, two shuttered windows.
 *
 * Plan: OSM way/365615571 (building=house, building:material=stone), a
 * 10.0 × 8.2 m rectangle, x -5.0..5.0, y -4.1..4.1.
 *
 * Heights: estimated from the Albrecht Conz photo, scaled by the 10.0 m OSM
 * front (66.5 px/m): eaves 3.3, ridge 7.0, the left chimney 8.1, the right
 * 7.6; the door 1.2 × 2.1 on a 0.3 sill; windows 1.05 wide, 1.3–2.9; the
 * dormers 1.1 wide, sills 4.4, peaks 6.2. The 1865 photo agrees (three
 * dormers, the door and two windows in the same places). No lidar used: a
 * one-and-a-half-storey house is settled by the photos.
 *
 * Ground: flat along Main Street; elevation 0.
 *
 * Night: windows glow (the museum is lit inside); no floodlighting.
 *
 * Photos (all EVIDENCE):
 *  - Poe museum800px.jpg, Albrecht Conz, CC BY-SA 3.0 (the Main Street
 *    front) https://commons.wikimedia.org/wiki/File:Poe_museum800px.jpg
 *  - Richmond, Va. The Old Stone House.jpg, 1865, Library of Congress
 *    Civil War glass negatives, public domain (front from the west)
 *    https://commons.wikimedia.org/wiki/File:Richmond,_Va._The_Old_Stone_House.jpg
 *  - USGS NAIP orthoimagery (public domain): the roof.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the rear (garden) slope and the gable ends are not in the photos
 * used; the rear slope is drawn plain and the gable ends as stone up to the
 * ridge. The museum's other buildings (the garden, the shrine, the
 * neighbouring houses on the block) are separate and not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { gableRoof, onWall, rectShape, type XY } from './atl-tech-tower'
import { box, save } from './atl-flatiron-building'

const stone = new Part(), roof = new Part(), white = new Part(), win = new Part(), dark = new Part(), brick = new Part()

const X0 = -5.0, X1 = 5.0, Y0 = -4.1, Y1 = 4.1, EAVE = 3.3, RIDGE = 7.0
type F = [XY, XY]
const FRONT: F = [[X0, Y0], [X1, Y0]], BACK: F = [[X1, Y1], [X0, Y1]]

box(stone, X0, X1, Y0, Y1, 0, EAVE, null, 0)
gableRoof(roof, stone, X0, X1, Y0, Y1, EAVE, RIDGE, 'x', 0.3, 0.12)
box(white, X0 - 0.12, X1 + 0.12, Y0 - 0.12, Y1 + 0.12, EAVE - 0.25, EAVE, null, 0) // the boxed eave

// chimneys at the ridge ends
box(brick, -4.85, -4.25, -0.45, 0.45, 5.5, 8.1, brick, 0.05)
box(brick, 3.1, 3.7, -0.45, 0.45, 5.5, 7.6, brick, 0.05)

const s = (x: number) => x - X0
// door
onWall(white, FRONT[0], FRONT[1], rectShape(s(0.34) - 0.75, s(0.34) + 0.75, 0.15, 2.55), 0.04)
onWall(dark, FRONT[0], FRONT[1], rectShape(s(0.34) - 0.55, s(0.34) + 0.55, 0.3, 2.4), 0.08)
onWall(win, FRONT[0], FRONT[1], rectShape(s(0.34) - 0.38, s(0.34) + 0.38, 1.25, 2.2), 0.1)
box(stone, -0.6, 1.3, Y0 - 0.45, Y0, 0, 0.18, stone, 0.03) // step
// two shuttered windows, framed white
for (const x of [-2.74, 2.97]) {
  onWall(white, FRONT[0], FRONT[1], rectShape(s(x) - 0.62, s(x) + 0.62, 1.15, 3.0), 0.04)
  onWall(dark, FRONT[0], FRONT[1], rectShape(s(x) - 0.48, s(x) + 0.48, 1.3, 2.88), 0.08)
}
// back: a door and two windows (unphotographed; kept plain)
for (const x of [-2.6, 2.6]) {
  onWall(white, BACK[0], BACK[1], rectShape(5 - x - 0.6, 5 - x + 0.6, 1.15, 3.0), 0.04)
  onWall(win, BACK[0], BACK[1], rectShape(5 - x - 0.45, 5 - x + 0.45, 1.3, 2.85), 0.08)
}

/** A convex planar polygon, wound to face `out`. */
function face(p: Part, pts: V3[], out: V3) {
  const a = pts[0], b = pts[1], c = pts[2]
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const q = g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

// three white gabled dormers on the street slope
{
  const slope = (RIDGE - EAVE) / (Y1 - 0) // rise per metre inward from the front wall
  const z0 = 4.25, z1 = 5.55, w = 1.15, zr = 6.2
  for (const x of [-2.74, 0.86, 2.67]) {
    const yf = Y0 + (z0 - EAVE) / slope + 0.1 // front face where the roof reaches the sill
    const yb = Y0 + (zr - EAVE) / slope + 0.3
    const h = w / 2
    const P = (dx: number, y: number, z: number): V3 => [x + dx, y, z]
    face(white, [P(-h, yf, z0), P(h, yf, z0), P(h, yf, z1), P(-h, yf, z1)], [0, -1, 0])
    face(white, [P(-h, yf, z1), P(h, yf, z1), P(0, yf, zr)], [0, -1, 0])
    for (const k of [-1, 1]) face(white, [P(k * h, yf, z0), P(k * h, yb, z0), P(k * h, yb, z1), P(k * h, yf, z1)], [k, 0, 0])
    for (const k of [-1, 1]) face(roof, [P(k * (h + 0.12), yf - 0.1, z1 - 0.08), P(0, yf - 0.1, zr + 0.05), P(0, yb, zr + 0.05), P(k * (h + 0.12), yb, z1 - 0.08)], [k, 0, 1])
    face(win, [P(-0.36, yf - 0.05, z0 + 0.15), P(0.36, yf - 0.05, z0 + 0.15), P(0.36, yf - 0.05, z1 - 0.1), P(-0.36, yf - 0.05, z1 - 0.1)], [0, -1, 0])
  }
}

await save('ric-poe-museum', 'Edgar Allan Poe Museum (Old Stone House)', [
  { part: stone, material: finish('osh-fieldstone', 0xa8927b) },
  { part: roof, material: finish('osh-shingle', 0x7c746c) },
  { part: white, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('osh-shutter', 0x4a5a52) },
  { part: brick, material: finish('osh-brick', 0xa9634e) },
], { height: 8.1, anchor: [37.5320968, -77.4260371], bearing: 37.87 })
