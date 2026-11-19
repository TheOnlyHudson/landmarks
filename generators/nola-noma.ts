/**
 * New Orleans Museum of Art, City Park (the Isaac Delgado Museum of Art,
 * Samuel Marx, 1911; wings 1971; rear addition 1993) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nola-noma.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 308, so model -y is the front,
 * facing compass 128 down Collins Diboll Circle to Lelong Drive and the
 * Esplanade; the OSM outline's walls run at 38/128.
 * Anchor: the area centroid of OSM way/325825515.
 *
 * Identity: the pale limestone temple front: a deep portico of four Ionic
 * columns in antis between two broad solid end bays (each with a sculpted
 * relief panel over a framed blind window), a full entablature with the
 * inscription frieze and a white antefix cresting, a low green-tiled hipped
 * roof with a little square lantern and eagle on each corner, a broad flight
 * of steps with two urns; the plain grey concrete 1971 wings stretching out
 * either side, lower than the temple, ending in rounded bays glazed with
 * tall glass-block windows; the taller 1993 block rising behind, its top
 * storey glazed.
 *
 * Evidence
 * - OSM way/325825515 (building=yes, 2 levels, the whole museum) and
 *   way/1345290804 (building:part, 3 levels): the plan. The temple 34.9 m
 *   wide, its portico recess 17.9 m; the wings out to x = +-46 with rounded
 *   front corners; the stepped back corners; the curved rear wall.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground 3.0 above the grid minimum (a
 *   lagoon) and flat. Above that ground: the temple's cornice about 14.3
 *   at the front, the roof's ridge 15.5-16, the lanterns 16.8; the wings
 *   10.0-11.8; the rounded end bays 12.0; the stepped back blocks 13.7; the
 *   high 1993 block 18.9 (17.6 over its front strip); the curved rear 17
 *   at the sides, 12.3 in the middle; the front steps 1.4 a row out from
 *   the portico, 0.5 at y = -40.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - NAIP (USGS, public domain): the plan, the green temple roof, pale flat
 *   roofs behind, the round fountain in front (not modelled: it is ground).
 * - Photos (Wikimedia Commons, all evidence):
 *   - "City Park New Orleans November 2017 04 NOMA Front.jpg", Infrogmation
 *     of New Orleans, CC BY-SA 4.0: front and the west wing from the
 *     south-west (columns, end bays, roof, lanterns, steps, urns)
 *     https://commons.wikimedia.org/wiki/File:City_Park_New_Orleans_November_2017_04_NOMA_Front.jpg
 *   - "New Orleans City Park 2 Nov 2017 NOMA Front.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: the front face on (proportions, column
 *     spacing, the wings' height)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_City_Park_2_Nov_2017_NOMA_Front.jpg
 *   - "City Park New Orleans November 2017 NOMA Corner.jpg", Infrogmation
 *     of New Orleans, CC BY-SA 4.0: the rounded west end bay with its
 *     glass-block windows and dark coping
 *     https://commons.wikimedia.org/wiki/File:City_Park_New_Orleans_November_2017_NOMA_Corner.jpg
 *   - "Foggy Museum, New Orleans October 2022.jpg", Bart Everson, CC BY 4.0:
 *     the front from the south (roof tiles, cresting, lanterns, the glazed
 *     top storey of the 1993 block behind)
 *     https://commons.wikimedia.org/wiki/File:Foggy_Museum,_New_Orleans_October_2022.jpg
 *   - "City Park, New Orleans 19 Feb 2026 - NOMA and ducks.jpg",
 *     Infrogmation, CC BY-SA 4.0: the whole from the south-west, far off
 *     https://commons.wikimedia.org/wiki/File:City_Park,_New_Orleans_19_Feb_2026_-_NOMA_and_ducks.jpg
 *   - "City Park, New Orleans 2019 - Behind NOMA.jpg", William Marnoch,
 *     CC BY 2.0: the rear (pale upper block, glazing low in the middle)
 *     https://commons.wikimedia.org/wiki/File:City_Park,_New_Orleans_2019_-_Behind_NOMA.jpg
 * - Published: Wikipedia "New Orleans Museum of Art": opened 1911 as the
 *   Isaac Delgado Museum of Art, Samuel A. Marx, "Beaux-Arts"; expanded 1971
 *   and 1993.
 *
 * Measured (lidar/OSM): plan, every height above. Estimated from the front
 * photo scaled to the lidar's cornice: the podium 1.6, the columns 2.0-10.1
 * (r 0.6), the entablature 10.1-12.8, the cornice 12.8-13.5, the cresting
 * 0.6 tall, the roof's ridge 16.0, the relief panels and blind windows of the end bays, the door,
 * the grilles over the portico wall, the urns. The lanterns are 2.6 m square
 * (from the photos). The rear and the stepped back corners are only seen
 * far off; their glazing is estimated.
 * Left out: the inscription lettering, the relief sculpture (a plain proud
 * panel), the banners, the wings' panel joints, the sculpture garden.
 *
 * The portico's back wall is drawn in the roof grey: it reads as the deep
 * shade behind the columns in every photo.
 *
 * Night: the temple front is floodlit; the windows and door glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, circle, ccw, type XY } from './atl-flatiron-building'
import { faceOf, fblock, fpanel, fprism, ionic, qf, tf, type Face } from './nola-gallier-hall'

// ─────────────────────────────── helpers ───────────────────────────────

/** A hipped roof over a rectangle, eaves at z0 and the ridge at zr (along the longer side). */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, zr: number) {
  const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  if (w >= d) {
    const h = d / 2, ra: V3 = [x0 + h, cy, zr], rb: V3 = [x1 - h, cy, zr]
    qf(p, [x0, y0, z0], [x1, y0, z0], rb, ra, [0, -1, 2])
    qf(p, [x1, y1, z0], [x0, y1, z0], ra, rb, [0, 1, 2])
    tf(p, [x0, y1, z0], [x0, y0, z0], ra, [-1, 0, 2])
    tf(p, [x1, y0, z0], [x1, y1, z0], rb, [1, 0, 2])
  } else {
    const h = w / 2, ra: V3 = [cx, y0 + h, zr], rb: V3 = [cx, y1 - h, zr]
    qf(p, [x1, y0, z0], [x1, y1, z0], rb, ra, [1, 0, 2])
    qf(p, [x0, y1, z0], [x0, y0, z0], ra, rb, [-1, 0, 2])
    tf(p, [x0, y0, z0], [x1, y0, z0], ra, [0, -1, 2])
    tf(p, [x1, y1, z0], [x0, y1, z0], rb, [0, 1, 2])
  }
}
/** A pyramid cap over a square centred at (x, y). */
export function pyramid(p: Part, x: number, y: number, h: number, z0: number, z1: number) {
  const a: V3 = [x - h, y - h, z0], b: V3 = [x + h, y - h, z0], c: V3 = [x + h, y + h, z0], d: V3 = [x - h, y + h, z0], t: V3 = [x, y, z1]
  tf(p, a, b, t, [0, -1, 1]); tf(p, b, c, t, [1, 0, 1]); tf(p, c, d, t, [0, 1, 1]); tf(p, d, a, t, [-1, 0, 1])
}
/** A turned solid (urn, finial) from a profile of [radius, z] pairs, bottom to top. */
export function lathe(p: Part, x: number, y: number, prof: [number, number][], n = 10) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const A = circle([x, y], Math.max(r0, 0.001), n), B = circle([x, y], Math.max(r1, 0.001), n)
    const dz = z1 - z0, dr = r0 - r1
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nm = (q: XY): V3 => { const ux = q[0] - x, uy = q[1] - y, l = Math.hypot(ux, uy) || 1; const L = Math.hypot(dz, dr) || 1; return [(ux / l) * dz / L, (uy / l) * dz / L, dr / L] }
      if (r0 > 0.002) p.tri([A[i][0], A[i][1], z0], [A[j][0], A[j][1], z0], [B[j][0], B[j][1], z1], undefined, undefined, undefined, [nm(A[i]), nm(A[j]), nm(A[j])])
      if (r1 > 0.002) p.tri([A[i][0], A[i][1], z0], [B[j][0], B[j][1], z1], [B[i][0], B[i][1], z1], undefined, undefined, undefined, [nm(A[i]), nm(A[j]), nm(A[i])])
    }
  }
  const top = prof[prof.length - 1]
  if (top[0] > 0.002) p.cap(circle([x, y], top[0], n).map(([a, b]) => [a, b, top[1]] as V3), true)
}
/** A row of antefixes (small pointed palmettes) along a face at height z. */
export function cresting(p: Part, F: Face, z: number, step: number, w: number, h: number, d0 = -0.15, d1 = 0.12) {
  const n = Math.max(1, Math.round(F.L / step))
  for (let k = 0; k < n; k++) {
    const s = (F.L * (k + 0.5)) / n
    fprism(p, F, [[s - w / 2, z], [s + w / 2, z], [s + w * 0.3, z + h * 0.6], [s, z + h], [s - w * 0.3, z + h * 0.6]], d0, d1)
  }
}

// ─────────────────────────────── the museum ───────────────────────────────

if (import.meta.main) {
  const lime = new Part(), conc = new Part(), white = new Part(), tile = new Part(), roof = new Part(), win = new Part()

  // ── the 1911 temple ──
  const XC = -0.3, HW = 17.45, X0 = XC - HW, X1 = XC + HW
  const YF = -29.8, YB = -3.0
  const POD = 1.6, COLTOP = 10.1, ARCH = 11.0, FRIEZE = 12.8, CORN = 13.5, RIDGE = 16.0
  const PH = 8.95 // half-width of the portico recess
  const YW = -26.6 // the portico's back wall

  // body: two solid end bays reaching the front, the middle stepped back to the portico wall
  const temple: XY[] = ccw([[X0, YF], [XC - PH, YF], [XC - PH, YW], [XC + PH, YW], [XC + PH, YF], [X1, YF], [X1, YB], [X0, YB]])
  prism(lime, temple, 0, FRIEZE, null, 0.0)
  // a plain base course (the podium) round the visible walls
  for (const [a, b] of [[[X0, YB], [X0, YF]], [[X0, YF], [XC - PH, YF]], [[XC + PH, YF], [X1, YF]], [[X1, YF], [X1, YB]]] as [XY, XY][]) {
    const F = faceOf(a, b)
    fblock(white, F, 0, F.L, 0, POD, 0.12)
    fblock(white, F, 0, F.L, POD, POD + 0.35, 0.18)
  }
  // portico floor
  box(lime, XC - PH, XC + PH, YF, YW + 0.1, 0, POD, white, 0.05)
  // entablature over the portico, closing the front between the end bays
  box(lime, XC - PH - 0.1, XC + PH + 0.1, YF, YW + 0.2, COLTOP, FRIEZE, null, 0.0, true)
  // architrave band (proud), the frieze band, and the cornice all round
  const fr = faceOf([X0, YF], [X1, YF]), sw = faceOf([X0, YB], [X0, YF]), se = faceOf([X1, YF], [X1, YB])
  for (const F of [fr, sw, se]) {
    fblock(white, F, -0.0, F.L, COLTOP, ARCH, 0.1)
    fblock(white, F, -0.0, F.L, FRIEZE - 0.25, FRIEZE, 0.2)
  }
  box(white, X0 - 0.55, X1 + 0.55, YF - 0.55, YB, FRIEZE, CORN, null, 0.18)
  // the white cresting on the cornice (front and sides)
  const cr = (a: XY, b: XY) => faceOf(a, b)
  cresting(white, cr([X0 - 0.4, YF - 0.4], [X1 + 0.4, YF - 0.4]), CORN, 1.25, 0.55, 0.6)
  cresting(white, cr([X0 - 0.4, YB], [X0 - 0.4, YF - 0.4]), CORN, 1.25, 0.55, 0.6)
  cresting(white, cr([X1 + 0.4, YF - 0.4], [X1 + 0.4, YB]), CORN, 1.25, 0.55, 0.6)
  // the green-tiled hipped roof, with the four corner lanterns
  hipRoof(tile, X0 - 0.2, X1 + 0.2, YF - 0.2, YB + 1.5, CORN, RIDGE)
  for (const [lx, ly] of [[X0 + 1.5, YF + 1.5], [X1 - 1.5, YF + 1.5], [X0 + 1.5, YB - 1.0], [X1 - 1.5, YB - 1.0]] as XY[]) {
    box(white, lx - 1.5, lx + 1.5, ly - 1.5, ly + 1.5, CORN, CORN + 1.9, null, 0.08)
    box(white, lx - 1.75, lx + 1.75, ly - 1.75, ly + 1.75, CORN + 1.75, CORN + 2.15, null, 0.08)
    pyramid(tile, lx, ly, 1.65, CORN + 2.15, CORN + 3.45)
    // the gilt eagle on a short post: a bold little bird with raised wings
    box(white, lx - 0.2, lx + 0.2, ly - 0.2, ly + 0.2, CORN + 3.2, CORN + 3.6, white, 0.04)
    const E = faceOf([lx - 1, ly], [lx + 1, ly])
    fprism(white, E, [[0.5, CORN + 3.55], [1.5, CORN + 3.55], [1.65, CORN + 4.35], [1.15, CORN + 3.95], [1.0, CORN + 4.45], [0.85, CORN + 3.95], [0.35, CORN + 4.35]], -0.22, 0.22, true)
  }

  // ── the portico: four Ionic columns in antis ──
  const colX = [-5.7, -1.9, 1.9, 5.7].map((x) => XC + x)
  for (const x of colX) {
    box(white, x - 0.85, x + 0.85, YF + 0.65 - 0.85, YF + 0.65 + 0.85, POD, POD + 0.4, white, 0.06)
    ionic(white, x, YF + 0.65, 0.6, POD + 0.4, COLTOP)
  }
  // the antae: pilasters on the end bays' inner corners, and on their faces
  for (const sg of [-1, 1]) {
    const xa = XC + sg * PH
    box(white, Math.min(xa, xa - sg * 0.9), Math.max(xa, xa - sg * 0.9), YF - 0.25, YF + 0.9, POD, COLTOP, null, 0.06)
    const xo = sg < 0 ? X0 : X1
    box(white, Math.min(xo, xo - sg * 1.1), Math.max(xo, xo - sg * 1.1), YF - 0.25, YF + 0.9, POD, COLTOP, null, 0.06)
  }
  // the portico's back wall: the door and the three bronze grilles high up
  const pw = faceOf([XC - PH, YW], [XC + PH, YW])
  // the back wall reads dark in the portico's shade
  fblock(roof, pw, 0, pw.L, POD, COLTOP, 0.03, -0.02)
  fblock(white, pw, PH - 1.9, PH + 1.9, POD, POD + 5.6, 0.12)
  fpanel(win, pw, PH - 1.35, PH + 1.35, POD, POD + 4.9, 0.17)
  for (const s of [PH - 3.8, PH, PH + 3.8]) fpanel(win, pw, s - 1.15, s + 1.15, 7.1, 9.2, 0.06)
  for (const s of [PH - 7.6, PH + 7.6]) fpanel(win, pw, s - 0.7, s + 0.7, POD + 0.6, POD + 4.9, 0.06)

  // the end bays: a relief panel over a framed blind window, front and side
  const bay = (F: Face, s: number) => {
    fblock(lime, F, s - 2.6, s + 2.6, 8.0, 9.6, 0.22) // the relief panel
    fblock(white, F, s - 2.8, s + 2.8, 7.75, 8.0, 0.25)
    // the blind window's frame: jambs, head and sill, the wall showing inside
    fblock(white, F, s - 1.7, s - 1.35, 2.6, 7.2, 0.16)
    fblock(white, F, s + 1.35, s + 1.7, 2.6, 7.2, 0.16)
    fblock(white, F, s - 1.9, s + 1.9, 7.2, 7.6, 0.22)
    fblock(white, F, s - 1.9, s + 1.9, 2.3, 2.6, 0.2)
  }
  bay(fr, 4.35)
  bay(fr, fr.L - 4.35)
  bay(sw, sw.L - 4.0)
  bay(se, 4.0)

  // the front steps, across the portico and the end bays, with the urns on their cheek blocks
  const SF = faceOf([XC - 13.0, YF], [XC + 13.0, YF])
  const nSt = 6
  for (let k = 0; k < nSt; k++) {
    const d = 6.0 - (k * 6.0) / nSt
    fblock(lime, SF, 0, SF.L, 0, (POD * (k + 1)) / nSt, d, -0.6)
  }
  for (const sg of [-1, 1]) {
    const x = XC + sg * 14.3
    box(white, x - 1.2, x + 1.2, YF - 3.2, YF - 0.6, 0, POD + 1.0, white, 0.1)
    lathe(white, x, YF - 1.9, [[0.35, POD + 1.0], [0.25, POD + 1.25], [0.25, POD + 1.4], [0.75, POD + 1.75], [0.8, POD + 2.2], [0.6, POD + 2.55], [0.85, POD + 2.65], [0, POD + 2.75]], 10)
  }

  // ── the 1971 wings, the 1993 blocks behind ──
  const wingL: XY[] = [[-38.7, -21.7], [X0, -21.7], [X0, -2], [-38.7, -2]]
  const wingR: XY[] = [[X1, -21.9], [37.6, -21.9], [37.6, -2], [X1, -2]]
  const endL: XY[] = [[-38.7, -24.4], [-38.7, -2], [-43.2, -2], [-43.2, -10.1], [-46.2, -10.1], [-46.2, -15.6], [-45.3, -20.1], [-43.9, -24.6]]
  const endR: XY[] = [[37.6, -24.6], [43.7, -25.0], [44.3, -23.8], [45.2, -20.6], [45.9, -16.8], [46.1, -14.4], [46.4, -10.4], [42.7, -10.4], [42.7, -2], [37.6, -2]]
  const backL: XY[] = [[-43.3, -2], [-25.0, -2], [-25.0, 24.3], [-30.9, 24.3], [-30.9, 17.9], [-36.7, 17.9], [-36.6, 11.6], [-40.6, 11.6], [-40.6, 5.4], [-43.3, 5.4]]
  const backR: XY[] = [[24.9, -2], [43.4, -2], [43.4, 4.9], [40.7, 4.9], [40.7, 11.4], [36.6, 11.4], [36.6, 17.9], [30.7, 17.9], [30.7, 23.7], [24.9, 23.7]]
  const WING = 10.8, END = 12.0, BACK = 13.7, HIGH = 18.9, HIGHF = 17.6
  const coping = (ring: XY[], z: number) => {
    prism(conc, ccw(ring), 0, z, null, 0.0)
    prism(conc, ccw(ring), z - 0.0, z + 0.45, roof, 0.12)
  }
  coping(wingL, WING); coping(wingR, WING)
  coping(endL, END); coping(endR, END)
  coping(backL, BACK); coping(backR, BACK)
  // the high block: its front strip a little lower; its top storey glazed
  coping([[-25.0, YB], [24.9, YB], [24.9, 4.5], [-25.0, 4.5]], HIGHF)
  coping([[-25.0, 4.5], [24.9, 4.5], [24.8, 23.7], [-25.0, 24.3]], HIGH)
  const rear: XY[] = [[-25.0, 24.3], [24.8, 23.7], [24.9, 26.2], [22.6, 27.6], [18.7, 29.9], [15.2, 31.3], [9.8, 33.0], [5.5, 31.6], [-1.4, 31.9], [-10.1, 32.5], [-16.2, 30.9], [-19.7, 29.5], [-24.7, 27.0]]
  coping(rear, 16.0)
  // the glazed top storey of the high block (sides and front above the wings)
  const hs = [faceOf([-25.0, 24.3], [-25.0, 4.5]), faceOf([24.9, 4.5], [24.8, 23.7])]
  for (const F of hs) for (let k = 0; k < 4; k++) fpanel(win, F, 0.8 + k * 4.85, 0.8 + k * 4.85 + 4.0, BACK + 1.2, HIGH - 0.9)
  const hf = faceOf([-25.0, 4.5], [24.9, 4.5])
  for (const [s0, s1] of [[0.6, 6.6], [43.3, 49.3]]) fpanel(win, hf, s0, s1, BACK + 1.0, HIGHF - 0.4 + 0.0, 0.05)
  const hf2 = faceOf([-25.0, YB], [24.9, YB])
  for (const [s0, s1] of [[0.8, 7.2], [42.7, 49.1]]) fpanel(win, hf2, s0, s1, WING + 1.2, HIGHF - 0.8)
  // the rear: glazing low in the middle of the curve
  for (let i = 4; i < 8; i++) {
    const F = faceOf(rear[i], rear[(i + 1) % rear.length])
    fpanel(win, F, 0.5, F.L - 0.5, 1.0, 7.0)
  }
  // the rounded end bays' tall glass-block windows, on the curve
  for (const [ring, i0, i1] of [[endL, 5, 7], [endR, 1, 5]] as [XY[], number, number][]) {
    const R = ccw(ring)
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length]
      const F = faceOf(a, b)
      // curved corner segments: those not axis-aligned
      if (Math.abs(a[0] - b[0]) < 0.2 || Math.abs(a[1] - b[1]) < 0.2) continue
      const w = Math.min(1.6, F.L * 0.4)
      fpanel(win, F, F.L / 2 - w / 2, F.L / 2 + w / 2, 1.4, END - 1.6)
    }
    void i0; void i1
  }
  // the end bays' front faces: a plain pier; the wing fronts: a dark base band (the hedge line is ground)

  const front = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < YF + 4 && Math.abs(p[0] - XC) < HW + 1 ? 0.9 : p[1] < YB && Math.abs(p[0] - XC) < HW + 1 ? 0.6 : 0)
  await save('nola-noma', 'New Orleans Museum of Art', [
    { part: lime, material: { ...finish('noma-limestone', 0xe4ddcf), floodlight: front } },
    { part: white, material: { ...finish('noma-white', 0xf4f0e8), floodlight: front } },
    { part: conc, material: finish('noma-concrete', 0xd9d6ce) },
    { part: tile, material: finish('noma-roof-tile', 0x6a877c) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ], { bearing: 308, osm: 'way/325825515', height: HIGH + 0.45 }, 6500)
}
