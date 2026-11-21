/**
 * Township Auditorium (1930, Lafaye & Lafaye; Georgian Revival; National
 * Register 2005; renovated 2010 with a glass stair addition), 1703 Taylor
 * Street, Columbia SC. Procedural, CC0-1.0, no textures.
 *   bun generators/cola-township-auditorium.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 340, the
 * building's long axis: model +y runs from the Taylor Street front (at
 * y = -38) back to the stage house. Anchor: area centroid of
 * way/545587531 (-81.027717, 34.009724).
 *
 * Form: a three-storey front block of red brick on a rusticated limestone
 * ground floor, with a recessed two-storey portico of four columns between
 * stone antae over a five-arch entrance arcade, a stone entablature (the
 * "Columbia Township Auditorium" frieze) and a low attic; brick end bays
 * with stacked windows; on the west front corner the 2010 glass stair
 * addition; behind, the brick hall under a low gabled roof, the taller
 * stage fly tower, and a low rear service wing.
 *
 * Sources
 * - OSM way/545587531 (building=civic, 4 levels): the outline, used as
 *   drawn (front block, corner pieces, hall, stage, rear wing).
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019), 0.5 m grid, read in
 *   this frame. y = 0 is the lowest ground at the walls (0.9 m above the
 *   tile's ground_min, the sides and rear); the Taylor Street pavement in
 *   front is 1.4 m higher. Measured above y = 0: front block 15.3 (attic
 *   bits to 16.9); hall eaves 18.6, ridge 22.5 on the axis; fly tower 25.0
 *   (x -14..7, y 17..28); stage side wings 10.0; rear wing 7.5.
 * - NAIP orthophoto (USGS): pale flat and low-pitched roofs, the brick
 *   fly tower top.
 * - Photo (EVIDENCE): Eastward Gypsy, "Columbia Township Auditorium front"
 *   (front and west corner from Taylor Street: portico, arcade, end bays,
 *   glass addition), CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Columbia_Township_Auditorium_front.jpg
 * - Published (Wikipedia, "Township Auditorium"): 1930, Lafaye & Lafaye,
 *   National Register 2005, 2010 renovation; context only.
 *
 * Estimated from the photo, scaled to the 15.3 m front: the ground floor
 * height (5.2), the column height (7.2) and entablature (1.9), the portico
 * recess (2.6 m), the arch and window sizes and spacing. Window panels on
 * the hall's long sides are estimated from the brick west wall glimpsed in
 * the photo (three tall bays); the east and rear sides are unphotographed.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, cylinder, prism, quad, triangulate, type XY } from './dc-nationals-park'

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), curtain = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, side: Part, top: Part | null = roof) =>
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, side, top)

// Flat panel on a wall facing n ([0,-1] front, [-1,0] west, [1,0] east),
// at wall coordinate w (x for front faces, y for side faces), offset 0.06.
function panel(p: Part, n: XY, wall: number, w0: number, w1: number, z0: number, z1: number) {
  const P = (w: number, z: number): V3 => n[1] !== 0 ? [w, wall + n[1] * 0.06, z] : [wall + n[0] * 0.06, w, z]
  quad(p, [P(w0, z0), P(w1, z0), P(w1, z1), P(w0, z1)], [n[0], n[1], 0])
}
// Round-headed opening on a front face: a rectangle and a real semicircle.
function arch(p: Part, wall: number, xc: number, w: number, z0: number, zs: number) {
  const r = w / 2, pts: XY[] = [[-r, z0], [r, z0], [r, zs]]
  for (let k = 1; k < 8; k++) { const a = (k / 8) * Math.PI; pts.push([r * Math.cos(a), zs + r * Math.sin(a)]) }
  pts.push([-r, zs])
  const P = pts.map(([o, z]): V3 => [xc + o, wall - 0.06, z])
  for (const [i, j, k] of triangulate(pts)) quad(p, [P[i], P[j], P[k], P[k]], [0, -1, 0])
}

// ---------------------------------------------------------------------------
// Front block: x -14.1..13.4, front face y -38.1.
const FX0 = -14.1, FX1 = 13.4, FY = -38.1, BACK = -27.8
const BASE = 5.2, COLTOP = 12.4, ENT = 14.3, TOP = 15.3
const PX0 = -8.3, PX1 = 7.6, RECESS = FY + 2.6, PC = (PX0 + PX1) / 2
rect(FX0, FX1, FY, BACK, 0, BASE, stone, stone) // rusticated ground floor, balcony on top
rect(FX0, PX0, FY, BACK, BASE, COLTOP, brick, null) // west end bay
rect(PX1, FX1, FY, BACK, BASE, COLTOP, brick, null) // east end bay
rect(PX0, PX1, RECESS, BACK, BASE, COLTOP, brick, null) // recessed portico wall
rect(FX0 - 0.3, FX1 + 0.3, FY - 0.35, BACK, COLTOP, ENT, stone, stone) // entablature and cornice
rect(FX0 + 0.8, FX1 - 0.8, FY + 0.8, BACK, ENT, TOP, stone, roof) // attic
// stone quoin piers at the outer corners and the antae
for (const [x0, x1] of [[FX0, FX0 + 1.0], [PX0 - 0.1, PX0 + 0.9], [PX1 - 0.9, PX1 + 0.1], [FX1 - 1.0, FX1]])
  rect(x0, x1, FY - 0.12, FY + 1.0, BASE, COLTOP, stone, null)
// four columns, on square plinths, under square capitals
const step = (PX1 - PX0 - 1.8) / 5
for (let k = 1; k <= 4; k++) {
  const x = PX0 + 0.9 + step * k, y = FY + 0.7
  cylinder(stone, [x, y], 0.5, BASE + 0.4, COLTOP - 0.4, 12, null)
  box(stone, [x, y, BASE + 0.2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.62, 0.62, 0.2])
  box(stone, [x, y, COLTOP - 0.2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.66, 0.66, 0.2])
}
// arcade: five round-headed doorways at the top of the front steps (1.4)
for (let k = -2; k <= 2; k++) arch(win, FY, PC + k * 3.0, 2.0, 2.4, 4.0)
// portico wall windows: tall second-floor doors, shorter third-floor
for (let k = -2; k <= 2; k++) {
  const x = PC + k * step
  panel(win, [0, -1], RECESS, x - 0.6, x + 0.6, 5.9, 9.0)
  panel(win, [0, -1], RECESS, x - 0.55, x + 0.55, 9.9, 11.6)
}
// end bays: one window per floor
for (const x of [(FX0 + 1 + PX0 - 0.1) / 2, (PX1 + 0.1 + FX1 - 1) / 2]) {
  panel(win, [0, -1], FY, x - 0.8, x + 0.8, 2.4, 4.4)
  panel(win, [0, -1], FY, x - 0.8, x + 0.8, 6.0, 9.4)
  panel(win, [0, -1], FY, x - 0.7, x + 0.7, 10.2, 11.8)
}

// West corner: the 2010 glass stair addition, stone base, glass curtain.
rect(-20.1, FX0, -35.1, BACK, 0, BASE, stone, null)
rect(-20.1, FX0, -35.1, BACK, BASE, 14.2, curtain, null)
rect(-20.4, FX0, -35.4, BACK, 14.2, 15.0, stone, roof)
rect(-22.2, -20.0, -27.8, -20.7, 0, 15.0, brick, roof)
// East corner: brick on the stone base.
rect(FX1, 19.9, -34.5, BACK, 0, BASE, stone, null)
rect(FX1, 19.9, -34.5, BACK, BASE, TOP - 0.4, brick, roof)
rect(19.3, 21.2, -27.1, -20.5, 0, TOP - 0.4, brick, roof)

// ---------------------------------------------------------------------------
// Hall: brick walls to the eaves, a low gabled roof, ridge on x = -0.4.
const HX0 = -20.0, HX1 = 19.3, HY0 = BACK, HY1 = 18.4, EAVE = 18.6, RIDGE = 22.5, RX = -0.4
rect(HX0, HX1, HY0, HY1, 0, 1.6, stone, null)
rect(HX0, HX1, HY0, HY1, 1.6, EAVE, brick, null)
for (const [x0, x1] of [[-22.5, HX0], [HX1, 21.2]]) rect(x0, x1, 11.1, 18.4, 0, EAVE - 1, brick, roof) // stair towers
quad(roof, [[HX0 - 0.4, HY0 - 0.3, EAVE], [HX0 - 0.4, HY1 + 0.3, EAVE], [RX, HY1 + 0.3, RIDGE], [RX, HY0 - 0.3, RIDGE]], [-0.5, 0, 1])
quad(roof, [[RX, HY0 - 0.3, RIDGE], [RX, HY1 + 0.3, RIDGE], [HX1 + 0.4, HY1 + 0.3, EAVE], [HX1 + 0.4, HY0 - 0.3, EAVE]], [0.5, 0, 1])
// front gable end (seen above the front block), brick
quad(brick, [[HX0, HY0, EAVE], [HX1, HY0, EAVE], [RX, HY0, RIDGE], [RX, HY0, RIDGE]], [0, -1, 0])
// long-side windows: three tall bays a side, two tiers
for (const [wall, n] of [[HX0, [-1, 0]], [HX1, [1, 0]]] as [number, XY][])
  for (const y of [-18, -6, 6]) {
    panel(win, n, wall, y - 1.1, y + 1.1, 3.2, 7.6)
    panel(win, n, wall, y - 1.1, y + 1.1, 9.6, 15.6)
  }

// Stage house: side wings at 10.0, the fly tower at 25.0 with a stone cap.
rect(-20.8, 18.4, HY1, 28.4, 0, 10.0, brick)
rect(-14, 7, 17, 28.4, 0, 24.3, brick, null)
rect(-14.3, 7.3, 16.7, 28.7, 24.3, 25.0, stone)
// Rear service wing.
rect(-15.6, 13.9, 28.4, 31.2, 0, 7.5, brick)
rect(-2.0, 13.9, 31.2, 46.2, 0, 7.5, brick)

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('township-brick', 0xa65a4a) },
  { part: stone, material: finish('township-limestone', 0xece4d2) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: curtain, material: windowVariant(2, 0xa9bfd1) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Township Auditorium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 340, osm: 'way/545587531', height: 25,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cola-township-auditorium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
