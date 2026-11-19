/**
 * Christ Church Cathedral (Episcopal), 900 Broadway, Nashville (1892–94,
 * Francis Hatch Kimball; tower finished 1947) — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-christ-church-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 152, so +y
 * points out of the Broadway front (south-south-east) along the nave, and
 * +x is the west (parking-lot) side; the tower stands at the front's
 * east corner (-x). Anchor = area centroid of OSM way/465437389,
 * 36.158798, -86.783154. y = 0 is the lowest ground under the footprint
 * (the rear, lidar 1.0 m above the box's ground_min); the Broadway
 * pavement is 0.7 m higher.
 *
 * Identity, in order: the square corner bell tower, rough buff stone below
 * and pale limestone in the belfry stage, with angle buttresses, a pair of
 * tall traceried belfry openings on every face, an openwork parapet and
 * corner turrets, the one by the nave taller (the stair turret); the steep
 * front gable on Broadway with its great pointed window, a rose in its
 * head over a row of six lancets, a band and an arcade of four small
 * round-headed windows below, three small lancets in the gable; the
 * pointed, gable-hooded door in the tower and the small gabled porch at
 * the west corner; the steep dark slate roofs; the aisles with cross
 * gables each holding a rose window over two round-headed lights; the
 * clerestory of round-headed triplets under a corbel table.
 *
 * Evidence:
 *  - plan: OSM way/465437389 (traced from Bing by a mapper, crude: it
 *    leaves out the tower's east side) gives the front line (y 17) and the
 *    west wall (x 13); the tower, the nave and the transepts are placed on
 *    the lidar: nave walls x -6.2 / 6.8 (ridge at x 0.3), tower 8.4 m
 *    square at x -12.9..-4.5, y 10.4..18.8, belfry 6.6 m square, aisles
 *    out to x -13.5 and 13.2, transept y -9.5..-15, chancel to y -17.2.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid in the
 *    model frame. Above y = 0: nave ridge 21.7 (roof ~54°, eaves 13.3);
 *    tower parapet 27.9, stair turret 31.5, other turrets 29.2; the ledge
 *    under the belfry 15.6–16.1; aisle cross-gable ridges ~8.5–9;
 *    transept ridge ~11; chancel ridge 18.3. Measured.
 *  - front: window, rose, lancet, arcade and door sizes from LeMay's
 *    square-on photo (54384286131), scaled by the 14 m nave front and
 *    corrected to the lidar ridge (estimated).
 *  - west side: cross gables, rose windows, clerestory triplets and the
 *    corbel table from LeMay's west view (54384482434) (estimated).
 *  - colours: buff rough-faced sandstone (sampled #b59d7d, pulled light),
 *    pale limestone belfry and dressings, grey slate (#445264 in shade,
 *    #a3a392 in sun; drawn #767d86), dark oak doors.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Christ Church Episcopal Cathedral, Broadway and 9th Avenue,
 *    Nashville, TN (54384286131), (54384482434), (54384667970),
 *    (54384668225), Warren LeMay, CC BY-SA 2.0 (front square on, west
 *    side, tower from the east, tower)
 *    https://commons.wikimedia.org/wiki/File:Christ_Church_Episcopal_Cathedral,_Broadway_and_9th_Avenue,_Nashville,_TN_(54384286131).jpg
 *    https://commons.wikimedia.org/wiki/File:Christ_Church_Episcopal_Cathedral,_Broadway_and_9th_Avenue,_Nashville,_TN_(54384482434).jpg
 *  - Christ Church Cathedral, Nashville.jpg, Esrever, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_Nashville.jpg
 *  - Christ Church Cathedral Nashville 01.jpg / 02.jpg, Cheryl A. Austin,
 *    CC BY-SA 4.0 (front, night)
 *    https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral_Nashville_01.jpg
 *  - USGS NAIP (public domain): plan.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the doors are `entrance`; the front and the tower
 * carry floodlight, as in Austin's night photo.
 *
 * Left out: the quatrefoil band, cusps and the rose's tracery beyond six
 * spokes, the crockets, the ridge cresting, the chimney, the cross finials,
 * the parapet's openwork (drawn solid), the parish buildings behind
 * (way/465437407, way/465437387).
 *
 * Doubts: the east aisle is drawn like the west one (only seen past the
 * tower); the transept and chancel are seen only from a distance, drawn
 * plain to their lidar heights; OSM's outline is rough, so the model
 * stands up to ~2 m outside it on the east (the tower) and at the rear.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, save, type XY } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, prismV, block, quadH, type Face } from './nash-ryman-auditorium'
import { wf, rect, chamfered, taper, type Side } from './nash-downtown-presbyterian'

const circ = (c: number, z: number, r: number, n = 14): XY[] => Array.from({ length: n }, (_, i) => [c + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as XY)
/** A ring (annulus) on a face, as quads. */
function ring(p: Part, f: Face, c: number, z: number, r0: number, r1: number, out: number, n = 16) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 1) / n) * Math.PI * 2
    p.quad(f.P(c + r0 * Math.cos(a), z + r0 * Math.sin(a), out), f.P(c + r1 * Math.cos(a), z + r1 * Math.sin(a), out), f.P(c + r1 * Math.cos(b), z + r1 * Math.sin(b), out), f.P(c + r0 * Math.cos(b), z + r0 * Math.sin(b), out))
  }
}
/** A window in a pale surround. */
function lit(trim: Part, win: Part, f: Face, s: number, w: number, z0: number, zs: number, head: 'round' | 'pointed', sur = 0.22) {
  shape(trim, f, opening(s, w + 2 * sur, z0 - 0.12, zs, head, 8), 0.04)
  shape(win, f, opening(s, w, z0, zs, head, 8), 0.08)
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part(), lime = new Part()

  const ST = 0.7 // Broadway pavement
  const NX0 = -6.2, NX1 = 6.8, NC = 0.3, YF = 18.6, YX = -9.5 // nave walls, ridge line, front, crossing
  const EAVE = 13.3, RIDGE = 21.7
  const AX0 = -13.5, AX1 = 13.2, AE = 5.5, AI = 8.6 // aisles: outer walls, eaves, height at the clerestory
  const TX0 = -12.9, TX1 = -4.5, TY0 = 10.4, TY1 = 18.8, T1 = 16.1 // tower lower stage
  const BX0 = -11.9, BX1 = -5.5, BY0 = 11.4, BY1 = 17.8, T2 = 26.6, T3 = 27.9 // belfry stage, parapet

  // ── Nave: walls to the eaves, steep slate roof, front gable ──
  prism(stone, rect(NX0, YX, NX1, YF), 0, EAVE, stone, 0.01)
  prismV(stone, [[NX0 - 0.45, EAVE - 0.3], [NX1 + 0.45, EAVE - 0.3], [NC, RIDGE]], [1, 0], [0, 0], YX, YF - 0.5, slate)
  // the front gable wall stands proud of the roof, with a pale coping
  prismV(stone, [[NX0 - 0.55, EAVE - 0.35], [NX1 + 0.55, EAVE - 0.35], [NC, RIDGE + 0.55]], [1, 0], [0, 0], YF - 0.6, YF)
  for (const s of [-1, 1]) {
    const xe = s < 0 ? NX0 - 0.6 : NX1 + 0.6, k = 0.4
    const a: V3 = [xe, YF + 0.06, EAVE - 0.3], b: V3 = [NC, YF + 0.06, RIDGE + 0.62]
    const g = (t: number, y: number, dz: number): V3 => [a[0] + (b[0] - a[0]) * t, y, a[2] + (b[2] - a[2]) * t + dz]
    quadH(trim, g(0, YF + 0.06, 0), g(1, YF + 0.06, 0), g(1, YF - 0.7, 0), g(0, YF - 0.7, 0), [s * 0.8, 0, 0.6])
    quadH(trim, g(0, YF + 0.06, -k), g(1, YF + 0.06, -k), g(1, YF + 0.06, 0), g(0, YF + 0.06, 0), [0, 1, 0])
  }
  // corbel band under the eaves of the clerestory
  for (const [dir, X] of [['E', NX1], ['W', NX0]] as [Side, number][]) {
    const { f } = wf(dir, X, YX, YF)
    band(trim, f, 0, f.L, EAVE - 0.75, EAVE - 0.35, 0.22)
  }

  // ── Front (Broadway) ──
  const { f: F, s: fs } = wf('N', YF, NX0, NX1)
  const c = fs(NC)
  // buttress at the west corner, with pale set-offs
  block(stone, NX1 - 0.2, NX1 + 0.9, YF - 1.0, YF + 0.5, 0, 12.0)
  for (const z of [4.5, 8.5, 12.0]) block(trim, NX1 - 0.25, NX1 + 0.95, YF - 1.0, YF + 0.55, z - 0.3, z)
  // the great window: pointed, pale surround, rose in its head over six lancets
  shape(trim, F, opening(c, 7.6, 6.5, 12.0, 'pointed', 12), 0.04)
  shape(stone, F, opening(c, 6.3, 6.8, 12.0, 'pointed', 12), 0.07) // the stone field of the arch
  rectOn(trim, F, c - 3.0, c + 3.0, 6.8, 7.5, 0.11) // sill band
  rectOn(trim, F, c - 3.0, c + 3.0, 10.25, 10.55, 0.11) // band under the rose
  for (let i = 0; i < 6; i++) { const s = c - 2.5 + i; shape(trim, F, opening(s, 0.88, 7.62, 9.8, 'round', 8), 0.085); shape(win, F, opening(s, 0.62, 7.75, 9.8, 'round', 8), 0.1) }
  shape(win, F, circ(c, 13.4, 1.75, 16), 0.1)
  ring(trim, F, c, 13.4, 1.75, 2.1, 0.11)
  shape(trim, F, circ(c, 13.4, 0.4, 10), 0.12)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6, ca = Math.cos(a), sa = Math.sin(a), px = -sa * 0.08, pz = ca * 0.08
    trim.quad(F.P(c + 0.4 * ca - px, 13.4 + 0.4 * sa - pz, 0.115), F.P(c + 1.75 * ca - px, 13.4 + 1.75 * sa - pz, 0.115), F.P(c + 1.75 * ca + px, 13.4 + 1.75 * sa + pz, 0.115), F.P(c + 0.4 * ca + px, 13.4 + 0.4 * sa + pz, 0.115))
  }
  // band and the arcade of four small round-headed windows
  band(trim, F, c - 3.6, c + 3.6, 5.8, 6.4, 0.12)
  rectOn(trim, F, c - 3.5, c + 3.5, 3.1, 5.8, 0.04)
  for (const d of [-2.7, -1.0, 1.0, 2.7]) shape(win, F, opening(c + d, 0.85, 3.4, 5.0, 'round', 8), 0.08)
  band(trim, F, 0, F.L, ST + 0.6, ST + 0.9, 0.1)
  // three small lancets in the gable
  for (const [d, h] of [[-0.75, 20.0], [0, 20.5], [0.75, 20.0]] as [number, number][]) lit(trim, win, F, c + d, 0.45, 18.9, h, 'pointed', 0.12)

  // ── West porch at the front corner ──
  {
    const x0 = NX1 + 0.9, x1 = AX1, y0 = 12.6, y1 = YF + 0.2, xc = (x0 + x1) / 2
    prism(stone, rect(x0, y0, x1, y1), 0, 5.0, stone, 0.01)
    prismV(stone, [[x0 - 0.3, 4.8], [x1 + 0.3, 4.8], [xc, 9.0]], [1, 0], [0, 0], y0, y1 - 0.3, slate)
    prismV(stone, [[x0, 4.8], [x1, 4.8], [xc, 9.25]], [1, 0], [0, 0], y1 - 0.3, y1)
    const { f, s } = wf('N', y1, x0, x1)
    shape(trim, f, opening(s(xc), 3.4, ST, 3.9, 'pointed', 10), 0.05)
    rectOn(door, f, s(xc) - 1.0, s(xc) + 1.0, ST + 0.3, 3.7, 0.09)
    shape(trim, f, opening(s(xc), 2.3, 3.7, 3.75, 'pointed', 8), 0.08)
    ring(trim, f, s(xc), 7.0, 0.35, 0.5, 0.06, 10)
  }

  // ── Aisles: lean-to roofs, cross gables with roses over two round-headed lights ──
  const aisle = (side: 1 | -1) => {
    const xo = side > 0 ? AX1 : AX0, xi = side > 0 ? NX1 : NX0
    const y0 = YX, y1 = side > 0 ? 12.6 : TY0
    const xa = Math.min(xo, xi), xb = Math.max(xo, xi)
    prism(stone, rect(xa, y0, xb, y1), 0, AE, stone, 0.01)
    prismV(stone, side > 0 ? [[xi, AE], [xo + 0.3, AE - 0.2], [xi, AI]] : [[xo - 0.3, AE - 0.2], [xi, AE], [xi, AI]], [1, 0], [0, 0], y0, y1, slate)
    const gables = side > 0 ? [5.6, -1.4] : [3.6, -3.4]
    const { f, s } = wf(side > 0 ? 'E' : 'W', xo, y0, y1)
    for (const yc of gables) {
      // cross gable: profile in the y–z plane, ridge running out to the aisle wall
      prismV(stone, [[yc - 3.1, AE - 0.2], [yc + 3.1, AE - 0.2], [yc, 9.4]], [0, 1], [0, 0], side > 0 ? -xo - 0.15 : -xi, side > 0 ? -xi : -xo + 0.15, slate)
      ring(trim, f, s(yc), 6.9, 0.95, 1.3, 0.06 + 0.15, 14)
      shape(win, f, circ(s(yc), 6.9, 0.95, 12), 0.2)
      for (const d of [-0.85, 0.85]) lit(trim, win, f, s(yc) + d * (side > 0 ? 1 : -1), 0.75, 2.2, 4.4, 'round', 0.18)
    }
    // plain round-headed lights in the other bays
    for (const yc of [9.5, -6.8]) if (yc < y1 - 1) lit(trim, win, f, s(yc), 0.75, 2.2, 4.4, 'round', 0.18)
    band(trim, f, 0, f.L, AE - 0.45, AE - 0.2, 0.15)
    // clerestory triplets
    const { f: C, s: cs } = wf(side > 0 ? 'E' : 'W', xi, YX, YF)
    for (const yc of [8.2, 2.0, -4.2, 14.4]) {
      if (side < 0 && yc > 9) continue
      lit(trim, win, C, cs(yc), 0.85, 9.6, 11.6, 'round', 0.2)
      for (const d of [-1.05, 1.05]) lit(trim, win, C, cs(yc) + d, 0.6, 9.6, 11.0, 'round', 0.18)
    }
  }
  aisle(1)
  aisle(-1)

  // ── Transepts and chancel ──
  {
    const y0 = -15.0, y1 = YX
    prism(stone, rect(AX0, y0, AX1, y1), 0, 7.0, stone, 0.01)
    // ridge along x: profile in the y–z plane
    prismV(stone, [[y0 - 0.3, 6.8], [y1 + 0.3, 6.8], [(y0 + y1) / 2, 11.2]], [0, 1], [0, 0], -AX1, -AX0, slate)
    for (const [dir, X] of [['E', AX1], ['W', AX0]] as [Side, number][]) {
      const { f, s } = wf(dir, X, y0, y1)
      ring(trim, f, s((y0 + y1) / 2), 8.0, 0.8, 1.1, 0.06, 12)
      shape(win, f, circ(s((y0 + y1) / 2), 8.0, 0.8, 10), 0.08)
      for (const d of [-1.0, 1.0]) lit(trim, win, f, s((y0 + y1) / 2) + d, 0.7, 2.4, 5.0, 'round', 0.18)
    }
    prism(stone, rect(-4.0, -17.2, 4.6, y0 + 0.2), 0, 12.0, stone, 0.01)
    prismV(stone, [[-4.4, 11.8], [5.0, 11.8], [0.3, 18.3]], [1, 0], [0, 0], -17.2, YX, slate)
  }

  // ── The tower ──
  {
    const cx = (TX0 + TX1) / 2, cy = (TY0 + TY1) / 2
    prism(stone, rect(TX0, TY0, TX1, TY1), 0, T1 - 0.5, stone, 0.01)
    block(trim, TX0 - 0.15, TX1 + 0.15, TY0 - 0.15, TY1 + 0.15, T1 - 0.5, T1)
    // angle buttresses at the four corners, set off twice
    for (const [x, y] of [[TX0, TY0], [TX0, TY1], [TX1, TY0], [TX1, TY1]] as XY[]) {
      const sx = x < cx ? -1 : 1, sy = y < cy ? -1 : 1
      for (const [d, z0, z1] of [[0.7, 0, 6.0], [0.5, 6.0, 11.0], [0.3, 11.0, T1 - 0.5]] as [number, number, number][]) {
        // one on each face at the corner
        block(stone, sx > 0 ? x - 1.1 : x, sx > 0 ? x : x + 1.1, sy > 0 ? y : y - d, sy > 0 ? y + d : y, z0, z1)
        block(stone, sx > 0 ? x : x - d, sx > 0 ? x + d : x, sy > 0 ? y - 1.1 : y, sy > 0 ? y : y + 1.1, z0, z1)
        block(trim, sx > 0 ? x - 1.15 : x - 0.05, sx > 0 ? x + 0.05 : x + 1.15, sy > 0 ? y : y - d - 0.06, sy > 0 ? y + d + 0.06 : y, z1 - 0.25, z1)
        block(trim, sx > 0 ? x : x - d - 0.06, sx > 0 ? x + d + 0.06 : x, sy > 0 ? y - 1.15 : y - 0.05, sy > 0 ? y + 0.05 : y + 1.15, z1 - 0.25, z1)
      }
    }
    // front door: pointed, with a gabled hood
    const { f: TF, s: ts } = wf('N', TY1, TX0, TX1)
    const dc = ts(cx)
    shape(trim, TF, opening(dc, 3.2, ST, 4.4, 'pointed', 10), 0.05)
    rectOn(door, TF, dc - 1.0, dc + 1.0, ST + 0.4, 4.2, 0.09)
    shape(trim, TF, opening(dc, 2.2, 4.2, 4.3, 'pointed', 8), 0.08)
    prismV(trim, [[cx - 2.2, 5.6], [cx + 2.2, 5.6], [cx, 9.6]], [1, 0], [0, 0], TY1, TY1 + 0.5)
    prismV(stone, [[cx - 1.8, 5.8], [cx + 1.8, 5.8], [cx, 9.1]], [1, 0], [0, 0], TY1 + 0.45, TY1 + 0.55)
    // the two round-headed lights over it, and on the east face
    for (const d of [-0.9, 0.9]) lit(trim, win, TF, dc + d, 0.55, 10.6, 13.0, 'round', 0.18)
    {
      const { f, s } = wf('W', TX0, TY0, TY1)
      for (const d of [-0.9, 0.9]) lit(trim, win, f, s(cy) + d, 0.55, 10.6, 13.0, 'round', 0.18)
      for (const d of [-0.9, 0.9]) lit(trim, win, f, s(cy) + d, 0.55, 5.0, 7.4, 'round', 0.18)
    }
    // belfry stage: pale limestone, corner buttresses, paired traceried openings on every face
    prism(lime, rect(BX0, BY0, BX1, BY1), T1, T2, lime, 0.01)
    const bcx = (BX0 + BX1) / 2, bcy = (BY0 + BY1) / 2
    for (const [x, y] of [[BX0, BY0], [BX0, BY1], [BX1, BY0], [BX1, BY1]] as XY[]) {
      const sx = x < bcx ? -1 : 1, sy = y < bcy ? -1 : 1
      block(lime, x - 0.45 * (sx < 0 ? 1 : 0) - 0.5 * (sx > 0 ? 1 : 0) + (sx > 0 ? 0 : 0), x + (sx > 0 ? 0.45 : 0.5), y - (sy < 0 ? 0.45 : 0.5), y + (sy > 0 ? 0.45 : 0.5), T1, T2 - 0.3)
    }
    for (const [dir, cc, lo, hi] of [['N', BY1, BX0, BX1], ['S', BY0, BX0, BX1], ['E', BX1, BY0, BY1], ['W', BX0, BY0, BY1]] as [Side, number, number, number][]) {
      const { f } = wf(dir, cc, lo, hi)
      const m = f.L / 2
      for (const d of [-0.95, 0.95]) {
        shape(trim, f, opening(m + d, 1.4, 19.6, 23.2, 'pointed', 8), 0.04)
        shape(win, f, opening(m + d, 1.1, 19.8, 23.2, 'pointed', 8), 0.08)
        rectOn(lime, f, m + d - 0.08, m + d + 0.08, 19.8, 22.4, 0.1) // mullion
        rectOn(lime, f, m + d - 0.55, m + d + 0.55, 22.25, 22.45, 0.1) // transom
        rectOn(win, f, m + d - 0.25, m + d + 0.25, 17.3, 18.5, 0.08) // small light below
      }
      band(trim, f, -0.1, f.L + 0.1, 25.8, 26.2, 0.18)
    }
    // parapet and corner turrets; the one by the nave (front, +x) is the tall stair turret
    prism(lime, rect(BX0 - 0.1, BY0 - 0.1, BX1 + 0.1, BY1 + 0.1), T2, T3, lime, 0.08)
    for (const [x, y] of [[BX0, BY0], [BX0, BY1], [BX1, BY0], [BX1, BY1]] as XY[]) {
      const tall = x === BX1 && y === BY1
      const top = tall ? 30.6 : 28.6, r = tall ? 0.75 : 0.6
      taper(lime, chamfered(x, y, r, r, r * 0.6), chamfered(x, y, r, r, r * 0.6), tall ? 22.0 : T2 - 0.3, top, null)
      taper(lime, chamfered(x, y, r + 0.08, r + 0.08, (r + 0.08) * 0.6), chamfered(x, y, 0.05, 0.05, 0.02), top, top + (tall ? 0.9 : 0.6))
    }
    capPoly(lime, rect(BX0 + 0.3, BY0 + 0.3, BX1 - 0.3, BY1 - 0.3), T3 - 0.6, true)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : n[1] > 0.6 && p[1] > 10 ? 0.8 : p[0] < -4 && p[1] > 9 ? 0.7 : 0)
  return [
    { part: stone, material: { ...finish('ccc-sandstone', 0xc4ad8f), floodlight: flood } },
    { part: trim, material: { ...finish('ccc-limestone-trim', 0xe9e1d0), floodlight: flood } },
    { part: lime, material: { ...finish('ccc-belfry-limestone', 0xd6cbb6), floodlight: flood } },
    { part: slate, material: finish('ccc-slate', 0x767d86) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x7d6a52 } },
  ]
}

if (import.meta.main) {
  await save('nash-christ-church-cathedral', 'Christ Church Cathedral', build(), { height: 31.5, anchor: [36.158798, -86.783154], bearing: 152 })
}
