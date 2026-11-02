/**
 * Apple Fifth Avenue (Bohlin Cywinski Jackson 2006; cube rebuilt with 15
 * panels 2011; store and plaza rebuilt by Foster + Partners 2017-19), the
 * glass cube on the General Motors Building plaza, 767 Fifth Avenue,
 * Manhattan. Procedural, CC0-1.0.
 *   bun generators/nyc-apple-fifth-avenue.ts
 *
 * The first model here with translucent glass (STYLE.md, "Translucent
 * glass"): the cube is `glass` at opacity 0.28, double-sided, so the map
 * draws what stands inside it. An empty glass box reads as nothing, so the
 * cube carries what is really seen through it.
 *
 * What makes it itself, and the photo each comes from:
 * 1. a clear glass cube, 32 ft on a side, of three full-height panels a
 *    wall and three on the roof, on a pale stone plaza in front of the GM
 *    Building (a, t, v);
 * 2. the Apple logo hanging in the upper middle of the cube, facing Fifth
 *    Avenue (a, t, v, c);
 * 3. the mirror-steel cylinder of the lift at the centre, the spiral stair
 *    round it going down into the store (a, n, t);
 * 4. the glass entrance vestibule on the Fifth Avenue face (a, t, v);
 * 5. the plaza: eighteen round mirror-steel "sky lenses" in two 3 x 3
 *    groups north and south of the cube, flush round skylights, steps down
 *    to the Fifth Avenue sidewalk, and the planters round the secondary
 *    stairs at the ends (n, t, v, OSM).
 *
 * Frame: authored x east, y north, z up, metres (mesh.ts converts), turned
 * to the Manhattan grid: model north is up Fifth Avenue, bearing 29. In
 * that frame OSM's cube, plaza, lenses and planters all fall on the axes.
 * Origin: the centre of the cube (the centroid of OSM way/156958129),
 * -73.9729641, 40.7638426, on the sidewalk's level; the plaza deck is
 * H_P = 0.6 m above it.
 *
 * Published (Wikipedia, "Apple Fifth Avenue", citing the NYT, Foster +
 * Partners and Apple; https://en.wikipedia.org/wiki/Apple_Fifth_Avenue):
 * - cube 32 ft (9.75 m) on each side; 15 glass panels since 2011,
 *   unchanged in 2017-19: three a wall and three on the roof, so each wall
 *   shows two vertical joints and no horizontal ones (photos a, t agree);
 * - a mirrored stainless-steel cylinder holding the lift, 43 cantilevered
 *   steps round it, short glass walls on the steps;
 * - 18 sky lenses (reflective steel shells with glass tops, used as seats),
 *   nine each side of the entrance in three rows of three;
 * - 62 circular frosted skylights flush with the plaza's stone floor.
 * OSM (ODbL; https://www.openstreetmap.org, fetched 2026-11-02):
 * - cube way/156958129 (9.1 m square; the published 9.75 m is used);
 * - plaza multipolygon relation/17344272 and its outer way/1262390676: the
 *   Fifth Avenue edge at x = -12.4, the GM Building's face at x = 16.6,
 *   wider ends to x = 22.6, y from -30.6 to 30.1;
 * - the 18 sky lenses, way/1262390689-1262390706 (`window=skylight`),
 *   2.06 m across, centres used as mapped;
 * - steps down to the sidewalk: 2 (north), 3 (middle), 4 (south) steps
 *   over 1.3 m, way/1262390688, 1262390709, 1262390686, so the deck is
 *   about 0.6 m above the sidewalk; drawn as three 0.2 m steps along the
 *   whole edge, as photos t and a show;
 * - the secondary stairs and their 1 m retaining walls and planters,
 *   way/1262390669-1262390683.
 * Measured from photos, scaled by the cube's 9.75 m:
 * - logo 1.7 m wide and 2.2 m tall, its centre 6.0 m above the floor, at
 *   the cube's centre (a, with the perspective of the cube's back edges);
 * - lift cylinder 2.6 m across, standing 2.9 m above the floor (a);
 * - vestibule 3.4 m wide, 3.5 m tall, projecting 1.5 m (a: its underside
 *   shows as a 0.1 m band from the street; t);
 * - sky lenses about 0.45 m tall (n); flush skylights about 1.5 m across
 *   on a pitch of about 3.8 m (a: the row in front of the cube).
 * Estimated or invented:
 * - the flush skylights' layout: 51 discs on a 3.8 m grid clear of the
 *   cube and lenses, where the real 62 are spread over the plaza (n, t
 *   show rows of them; no plan was found);
 * - the stairwell: 3.4 m opening radius, treads 1.35-3.2 m from the
 *   centre, and its direction of turn. The real stair drops 7 m to the
 *   store; the model can't go below the street, so one turn of treads is
 *   drawn falling through the 0.6 m deck over the store's lit floor, which
 *   reads as a stair going down from above;
 * - the frame: the real cube is all but frameless (silicone joints, glass
 *   fins, small steel fittings). STYLE.md asks for a solid frame to carry
 *   the outline, so the edges and the joints are thin pale steel bars;
 * - the logo's outline (circles and a lens leaf, not traced) and its
 *   thickness (0.12 m, a: the lit edge shows);
 * - the planters' tops, drawn as plain stone (they hold honey locusts).
 * Left out: the honey locusts and benches in the groves at the ends, the
 *   glass fins and roof beams, the doors, the balustrades round the stair,
 *   the GM Building itself (not replaced).
 *
 * Night (n, 2021): the cube is clear and dark, its inside lit: the steel
 * cylinder and the floor round it shine, the glass edges glow, the flush
 * skylights and the lens tops glow white from the store below. So the
 * steel and stone inside the cube carry `floodlight`, the skylights and
 * lens tops are `window`, the store floor seen down the stairwell is
 * `entrance`, the logo is `neon-apple`, and the glass stays `glass`.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - a "Apple Fifth Avenue (51396585920).jpg", ajay_suresh, CC BY 2.0,
 *   2021-08-21: the Fifth Avenue (west) face, square on.
 *   https://commons.wikimedia.org/wiki/File:Apple_Fifth_Avenue_(51396585920).jpg
 * - t "Apple Store 5th Avenue.jpg" and "Apple Store 5th Avenue
 *   (vertical).jpg", Filip Troníček, CC BY-SA 4.0, 2023-04-30: from the
 *   south-west; the joints, the vestibule, the steps, the skylights.
 *   https://commons.wikimedia.org/wiki/File:Apple_Store_5th_Avenue.jpg
 *   https://commons.wikimedia.org/wiki/File:Apple_Store_5th_Avenue_(vertical).jpg
 * - v "View of Apple Fifth Avenue from Central Park.jpg", Filip Troníček,
 *   CC BY-SA 4.0, 2023: from the north-west, far.
 *   https://commons.wikimedia.org/wiki/File:View_of_Apple_Fifth_Avenue_from_Central_Park.jpg
 * - c "Apple Store Fifth Avenue 001.jpg", Kidfly182, CC BY-SA 4.0,
 *   2021-08-21: from the north-west, low.
 *   https://commons.wikimedia.org/wiki/File:Apple_Store_Fifth_Avenue_001.jpg
 * - n "Apple Fifth Avenue at night.jpg", Ɱ, CC BY-SA 4.0, 2021-06-02: from
 *   the east, at night, sky lenses in front.
 *   https://commons.wikimedia.org/wiki/File:Apple_Fifth_Avenue_at_night.jpg
 * - o "Apple Fifth through an oculus.jpg", Ɱ, CC BY-SA 4.0, 2021: down
 *   through a sky lens; the lens's steel shell and glass top.
 *   https://commons.wikimedia.org/wiki/File:Apple_Fifth_through_an_oculus.jpg
 * - g "Grand Army Plaza Dec 2020 11.jpg", Epicgenius, CC BY-SA 4.0: from
 *   the north up Fifth Avenue, far.
 *   https://commons.wikimedia.org/wiki/File:Grand_Army_Plaza_Dec_2020_11.jpg
 * The NAIP orthophoto was tried and is useless here: the GM Building leans
 * over the plaza.
 *
 * Doubts: whether a second logo faces north and south (a shows a thin
 * edge-on sliver north of centre, t a faint second apple, either a
 * reflection or another logo; one logo, lit both sides, is drawn); the
 * logo's depth in the cube (centre assumed); the skylight layout; the
 * stair's turn; the plaza's height varies 0.3-0.65 m along the sidewalk.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'

const glass = new Part(), steel = new Part(), logo = new Part(), stone = new Part(), lights = new Part(), store = new Part()

// ------------------------------------------------------------ dimensions
const H_P = 0.6 // plaza deck above the sidewalk
const S = 9.75 / 2 // the cube's half side
const H_C = H_P + 9.75 // the cube's top
const R_OPEN = 3.4 // stairwell opening
const R_CYL = 1.3 // lift cylinder
const R_STEP = 3.2 // treads' outer edge
const N = 24 // segments round the stairwell (corners of the cube's floor fall on them)

// ------------------------------------------------------------ helpers
/** An axis-aligned box; `bottom` adds the underside. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  p.quad(c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1))
  if (bottom) p.quad(c(x0, y0, z0), c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0))
  p.quad(c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1))
  p.quad(c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1))
  p.quad(c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1))
  p.quad(c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1))
}
const ring = (cx: number, cy: number, r: number, z: number, n: number, a0 = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
/** A flat disc facing up. */
const disc = (p: Part, cx: number, cy: number, r: number, z: number, n: number) => p.cap(ring(cx, cy, r, z, n), true)

// ------------------------------------------------------------ the plaza deck
// Stone boxes from the sidewalk to the deck, tiled round the cube's square
// and the two secondary stairwells (way/1262390669-1262390683).
const X_W = -11.1, X_E = 16.6, X_END = 22.6
const Y_S = -30.64, Y_N = 30.11
const slots = [
  { x0: 6.07, x1: 13.63, y0: 25.39, y1: 27.32, wall: 25.39, side: 1 }, // north
  { x0: 6.1, x1: 13.65, y0: -27.85, y1: -25.95, wall: -25.95, side: -1 }, // south
]
box(stone, X_W, Y_S, 0, -S, Y_N, H_P) // west of the cube
box(stone, -S, Y_S, 0, S, -S, H_P) // south of the cube
box(stone, -S, S, 0, S, Y_N, H_P) // north of the cube
box(stone, S, slots[1].y1, 0, X_E, slots[0].y0, H_P) // east of the cube, between the stairwells
for (const s of slots) {
  const [ya, yb] = s.side > 0 ? [s.y1, Y_N] : [Y_S, s.y0]
  box(stone, S, ya, 0, X_E, yb, H_P) // beyond the stairwell
  box(stone, S, s.y0, 0, s.x0, s.y1, H_P) // west of it
  box(stone, s.x1, s.y0, 0, X_E, s.y1, H_P) // east of it
  // the wide end of the plaza, out to the GM Building's wings
  const [e0, e1] = s.side > 0 ? [15.08, Y_N] : [Y_S, -15.54]
  box(stone, X_E, e0, 0, X_END, e1, H_P)
  // the stairwell: steps down westward to the store's door, its floor lit
  for (let k = 0; k < 4; k++) {
    const x1 = s.x1 - k * ((s.x1 - s.x0) / 4)
    box(stone, x1 - (s.x1 - s.x0) / 4, s.y0, 0, x1, s.y1, H_P * (1 - (k + 1) / 5))
  }
  // a 1 m parapet on its plaza side and the planter beyond (OSM: retaining walls, height 1)
  box(stone, s.x0, s.wall - (s.side > 0 ? 0.3 : 0), H_P, s.x1, s.wall + (s.side > 0 ? 0 : 0.3), H_P + 1.0)
  box(stone, s.x1 - 0.3, s.y0, H_P, s.x1, s.y1, H_P + 1.0)
  const [p0, p1] = s.side > 0 ? [s.y1, Y_N] : [Y_S, s.y0]
  box(stone, 4.04, p0, H_P, 14.6, p1, H_P + 1.0)
}
// three risers down to the Fifth Avenue sidewalk along the whole edge
for (let k = 0; k < 2; k++) box(stone, X_W - (k + 1) * 0.43, Y_S, 0, X_W - k * 0.43, Y_N, H_P - (k + 1) * 0.2)

// ------------------------------------------------------------ the cube's floor, stairwell and lift
// The floor inside the cube: its square, less the round stairwell. With
// N = 24 starting at 45 degrees, the square's corners fall on the rays.
{
  const sq = (a: number): V3 => {
    const c = Math.cos(a), s = Math.sin(a), t = S / Math.max(Math.abs(c), Math.abs(s))
    return [c * t, s * t, H_P]
  }
  for (let i = 0; i < N; i++) {
    const a0 = Math.PI / 4 + (i / N) * Math.PI * 2, a1 = Math.PI / 4 + ((i + 1) / N) * Math.PI * 2
    const i0: V3 = [R_OPEN * Math.cos(a0), R_OPEN * Math.sin(a0), H_P], i1: V3 = [R_OPEN * Math.cos(a1), R_OPEN * Math.sin(a1), H_P]
    stone.quad(i0, sq(a0), sq(a1), i1)
    // the stairwell's wall, facing in, down to the store
    stone.quad([i1[0], i1[1], 0], [i0[0], i0[1], 0], i0, i1)
  }
  // the store's lit floor at the bottom of the well
  disc(store, 0, 0, R_OPEN, 0.02, N)
}
// The lift: a mirror-steel cylinder from the store to 2.9 m above the floor.
{
  const lo = ring(0, 0, R_CYL, 0, 16), hi = ring(0, 0, R_CYL, H_P + 2.9, 16)
  steel.loft([lo, hi])
  steel.cap(hi, true)
}
// The stair: one turn of cantilevered treads round the lift, falling from
// the floor to the store (compressed; see the header). It starts at the
// west, by the door, and turns anticlockwise seen from above.
{
  const TREADS = 24, PITCH = (Math.PI * 2) / TREADS, ARC = PITCH * 0.72, T = 0.07
  for (let k = 0; k < TREADS; k++) {
    const a0 = Math.PI + k * PITCH + PITCH * 0.14, a1 = a0 + ARC
    const z1 = H_P - 0.03 - (k / TREADS) * (H_P - 0.12), z0 = z1 - T
    const pt = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    const top = [pt(R_CYL, a0, z1), pt(R_STEP, a0, z1), pt(R_STEP, a1, z1), pt(R_CYL, a1, z1)]
    const bot = [pt(R_CYL, a0, z0), pt(R_STEP, a0, z0), pt(R_STEP, a1, z0), pt(R_CYL, a1, z0)]
    steel.quad(top[0], top[1], top[2], top[3])
    steel.quad(bot[0], bot[3], bot[2], bot[1])
    steel.quad(bot[1], bot[2], top[2], top[1]) // outer edge
    steel.quad(bot[0], bot[1], top[1], top[0]) // leading edge
    steel.quad(bot[2], bot[3], top[3], top[2]) // trailing edge
  }
}

// ------------------------------------------------------------ the glass cube
// Outward-wound walls and roof, double-sided in the material.
{
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  glass.quad(c(-S, -S, H_P), c(S, -S, H_P), c(S, -S, H_C), c(-S, -S, H_C)) // south
  glass.quad(c(S, S, H_P), c(-S, S, H_P), c(-S, S, H_C), c(S, S, H_C)) // north
  glass.quad(c(S, -S, H_P), c(S, S, H_P), c(S, S, H_C), c(S, -S, H_C)) // east
  // the west wall, round the vestibule's opening
  const VW = 1.7, VH = H_P + 3.5, VD = 1.5
  glass.quad(c(-S, S, H_P), c(-S, VW, H_P), c(-S, VW, H_C), c(-S, S, H_C))
  glass.quad(c(-S, -VW, H_P), c(-S, -S, H_P), c(-S, -S, H_C), c(-S, -VW, H_C))
  glass.quad(c(-S, VW, VH), c(-S, -VW, VH), c(-S, -VW, H_C), c(-S, VW, H_C))
  glass.quad(c(-S, -S, H_C), c(S, -S, H_C), c(S, S, H_C), c(-S, S, H_C)) // roof
  // the vestibule: a glass box on the Fifth Avenue face
  const X = -S - VD
  glass.quad(c(X, VW, H_P), c(X, -VW, H_P), c(X, -VW, VH), c(X, VW, VH))
  glass.quad(c(X, -VW, H_P), c(-S, -VW, H_P), c(-S, -VW, VH), c(X, -VW, VH))
  glass.quad(c(-S, VW, H_P), c(X, VW, H_P), c(X, VW, VH), c(-S, VW, VH))
  glass.quad(c(X, -VW, VH), c(-S, -VW, VH), c(-S, VW, VH), c(X, VW, VH))
  // the frame: corners, eaves, sills and the panel joints, thin pale steel
  const F = 0.09, J = 0.05
  for (const [x, y] of [[-S, -S], [S, -S], [S, S], [-S, S]]) box(steel, x - F, y - F, H_P, x + F, y + F, H_C + F)
  box(steel, -S - F, -S - F, H_C - F, S + F, -S + F, H_C + F)
  box(steel, -S - F, S - F, H_C - F, S + F, S + F, H_C + F)
  box(steel, -S - F, -S + F, H_C - F, -S + F, S - F, H_C + F)
  box(steel, S - F, -S + F, H_C - F, S + F, S - F, H_C + F)
  box(steel, -S - F, -S - F, H_P, S + F, -S + F, H_P + 0.1)
  box(steel, -S - F, S - F, H_P, S + F, S + F, H_P + 0.1)
  box(steel, S - F, -S + F, H_P, S + F, S - F, H_P + 0.1)
  box(steel, -S - F, VW, H_P, -S + F, S - F, H_P + 0.1)
  box(steel, -S - F, -S + F, H_P, -S + F, -VW, H_P + 0.1)
  for (const t of [-S / 3, S / 3].map((v) => v * 2)) {
    box(steel, t - J, -S - J, H_P, t + J, -S + J, H_C) // south joints
    box(steel, t - J, S - J, H_P, t + J, S + J, H_C) // north joints
    box(steel, S - J, t - J, H_P, S + J, t + J, H_C) // east joints
    box(steel, -S - J, t - J, VH, -S + J, t + J, H_C) // west joints, over the vestibule
    box(steel, t - J, -S + F, H_C - J, t + J, S - F, H_C + J) // roof joints, east-west panels
  }
  // the vestibule's edges
  for (const y of [-VW, VW]) {
    box(steel, X - J, y - J, H_P, X + J, y + J, VH)
    box(steel, X - J, y - J, VH - J, -S, y + J, VH + J)
  }
  box(steel, X - J, -VW + J, VH - J, X + J, VW - J, VH + J)
  box(steel, -S - J, -VW, VH - J, -S + J, VW, VH + J)
}

// ------------------------------------------------------------ the logo
// A flat apple, 0.12 m thick, hanging at the cube's centre and facing
// Fifth Avenue (west); both faces lit. Unit outline, x right and y up as
// seen from the street, the body 1 wide: a Catmull-Rom curve through the
// lobes and the dips top and bottom, from the bite's upper corner round
// the left to its lower corner, then the bite as a circular arc; plus a
// leaf. Drawn from the logo's familiar proportions, not traced.
{
  type P2 = [number, number]
  const knots: P2[] = [
    [0.535, 0.307], [0.45, 0.39], [0.33, 0.455], [0.2, 0.47], [0.09, 0.445], [0, 0.405], [-0.1, 0.445], [-0.22, 0.47],
    [-0.36, 0.43], [-0.46, 0.31], [-0.505, 0.15], [-0.5, -0.02], [-0.46, -0.2], [-0.38, -0.36], [-0.27, -0.47],
    [-0.15, -0.51], [-0.05, -0.49], [0, -0.47], [0.06, -0.49], [0.17, -0.51], [0.29, -0.46], [0.4, -0.36], [0.48, -0.25],
    [0.535, -0.127],
  ]
  const body: P2[] = []
  for (let i = 0; i < knots.length - 1; i++) {
    const p0 = knots[Math.max(0, i - 1)], p1 = knots[i], p2 = knots[i + 1], p3 = knots[Math.min(knots.length - 1, i + 2)]
    for (let k = 0; k < 3; k++) {
      const t = k / 3, t2 = t * t, t3 = t2 * t
      const f = (j: 0 | 1) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)
      body.push([f(0), f(1)])
    }
  }
  // the bite: an arc of a circle round (0.66, 0.09), from the lower corner back up to the upper
  for (let k = 0; k < 7; k++) {
    const a = ((240 - k * 20) * Math.PI) / 180
    body.push([0.66 + 0.25 * Math.cos(a), 0.09 + 0.25 * Math.sin(a)])
  }
  const ccw = (poly: P2[]) => {
    let s = 0
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length]
      s += a[0] * b[1] - b[0] * a[1]
    }
    return s > 0 ? poly : poly.reverse()
  }
  const leaf: [number, number][] = []
  const A = [0.02, 0.5], B = [0.24, 0.8], L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], pp = [-u[1], u[0]]
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, w = 0.085 * Math.sin(Math.PI * t)
    leaf.push([A[0] + u[0] * L * t + pp[0] * w, A[1] + u[1] * L * t + pp[1] * w])
  }
  for (let i = 7; i >= 1; i--) {
    const t = i / 8, w = 0.085 * Math.sin(Math.PI * t)
    leaf.push([A[0] + u[0] * L * t - pp[0] * w, A[1] + u[1] * L * t - pp[1] * w])
  }
  const SC = 2.2 / 1.3, Z0 = H_P + 6.0 - 0.15 * SC, D = 0.06
  // unit (right, up) seen from the west -> model (-y, z)
  const at = (q: [number, number], x: number): V3 => [x, -q[0] * SC, Z0 + q[1] * SC]
  const slab = (poly: P2[], centre: [number, number]) => {
    const n = poly.length
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n]
      // a counter-clockwise outline maps to a face looking west
      logo.tri(at(centre, -D), at(a, -D), at(b, -D)) // west face
      logo.tri(at(centre, D), at(b, D), at(a, D)) // east face
      logo.quad(at(a, D), at(b, D), at(b, -D), at(a, -D)) // edge
    }
  }
  slab(ccw(body), [0, 0])
  slab(ccw(leaf), [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2])
}

// ------------------------------------------------------------ sky lenses and skylights
// The 18 sky lenses where OSM maps them: low mirror-steel shells, 2.06 m
// across and about 0.45 m tall, their glass tops glowing from the store.
const LENSES: [number, number][] = [
  [2.86, -12.41], [2.85, -15.48], [2.84, -18.6], [-0.14, -18.63], [-0.14, -15.51], [-0.12, -12.44],
  [-3.16, -18.63], [-3.15, -15.51], [-3.14, -12.45], [-3.0, 14.75], [-2.99, 17.82], [-3.01, 11.63],
  [0.01, 11.63], [0.02, 14.75], [0.03, 17.82], [3.02, 17.85], [3.0, 14.78], [3.0, 11.66],
]
for (const [x, y] of LENSES) {
  const n = 12, base = ring(x, y, 0.82, H_P, n), rim = ring(x, y, 1.03, H_P + 0.4, n), lip = ring(x, y, 0.92, H_P + 0.45, n)
  steel.loft([base, rim, lip])
  disc(lights, x, y, 0.92, H_P + 0.45, n)
}
// Flush skylights, ~1.5 m discs on an estimated 3.8 m grid clear of the
// cube, the lenses and the groves at the ends.
let skylights = 0
for (let j = -6; j <= 6; j++) {
  const y = j * 3.8
  for (const x of [-8.6, -4.8, 0, 4.8, 8.6, 12.4]) {
    if (Math.abs(x) < 6.5 && Math.abs(y) < 6.6) continue
    if (Math.abs(x) < 5 && Math.abs(y) > 9.8 && Math.abs(y) < 19.8) continue
    disc(lights, x, y, 0.7, H_P + 0.012, 12)
    skylights++
  }
}

// ------------------------------------------------------------ write
// Night: the steel inside the cube (lift, treads, frame, vestibule) and the
// floor inside it are floodlit; the deck's own corners sit on the cube's
// edge, so the stone's test is strictly inside, to keep the wash in.
const inCube = (p: V3) => Math.abs(p[1]) < S + 0.3 && p[0] > -S - 1.8 && p[0] < S + 0.3
const parts = [
  { part: glass, material: { ...PALETTE.glass, opacity: 0.25, doubleSided: true } },
  { part: steel, material: { ...finish('steel', 0xc9d0d5, 0.35), floodlight: (p: V3) => (inCube(p) ? 0.9 : 0) } },
  { part: logo, material: { ...finish('neon-apple', 0xf3e9c6), doubleSided: false } },
  { part: stone, material: { ...finish('plaza-granite', 0xc3c6c1), floodlight: (p: V3) => (Math.abs(p[0]) < S - 0.01 && Math.abs(p[1]) < S - 0.01 ? 0.7 : 0) } },
  { part: lights, material: windowVariant(2, 0xa7b1b8) },
  { part: store, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Apple Fifth Avenue', parts, {
  license: 'CC0-1.0', bearing: 29, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/156958129'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-apple-fifth-avenue.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles (${skylights} skylights), ${glb.length} bytes, ${top.toFixed(1)} m`)
