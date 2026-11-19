/**
 * Ryman Auditorium (1892 as the Union Gospel Tabernacle, Hugh C. Thompson;
 * the 1897 balcony; the 2015 lobby addition and PNC Plaza pavilion on the
 * east) — original procedural geometry, CC0-1.0.
 * bun generators/nash-ryman-auditorium.ts
 *
 * Also exports the small helpers the other nash- models by the same builder
 * use (wall frames, arched panels, prisms with outward winding); the Ryman
 * is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +x
 * runs along the hall's long axis toward 4th Avenue (compass 62°) and the
 * 5th Avenue front is the -x face. Anchor = centroid of OSM way/130905906,
 * 36.161247, -86.778496. y = 0 is the lowest ground under the footprint,
 * 134.8 m (the 5th Avenue / alley corner at the south-west and the 4th
 * Avenue edge of the pavilion).
 *
 * Identity, in order: the steep red-brick gable on 5th Avenue with its big
 * round-headed traceried window, a row of small lancets and two louvred
 * vents; the two-storey front block in front of it, its pavilions of
 * paired pointed lancets with white hoods, the corner buttresses with
 * white caps, the two big round-arched doors at the centre under a small
 * stone-coped gable; the long dark slate roof; the long sides of two
 * storeys of tall round-headed windows over a grey rusticated limestone
 * base; the two chimneys at the rear; and on the east the 2015 brick lobby
 * block and the black PNC Plaza canopy over a glass shop.
 *
 * Evidence:
 *  - plan: OSM way/130905906 (hall, 50.1 x 34.3 m), way/464659484 (the
 *    2015 lobby addition), way/683968785 (the PNC Plaza pavilion and
 *    canopy). Lidar footprints agree with OSM to under a metre.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight), 0.5 m
 *    grid, read in the model frame. Over the 134.8 m base: ridge 32.6
 *    (flat along the whole hall), eaves 16.0 (roof 23.2 at 7.6 m in, so
 *    the slope is ~43°), front block 16.9, chimneys 22.7, lobby block
 *    14.9 with a 16.1 strip against the hall, canopy top 8.5, the plaza
 *    under it 3.2, the north lawn 3.1. Measured.
 *  - front: bay widths and window rhythm from Warren LeMay's square-on
 *    view (54383413407), scaled by the 34.3 m OSM width (28 px/m):
 *    corner buttresses 1.4 m, pavilions of four lancets 1.2 m wide at
 *    1.8 m, doors 3.6 m wide with their centres 3.4 m off the axis, three
 *    lancets either side of a central niche above. Storey heights from
 *    the same photo, corrected toward lidar at the top (estimated).
 *  - gable: big window 6 m wide, sill 20, springing 23.3 (semicircle);
 *    four small lancets under it; louvred vents 4.7 m off the axis;
 *    estimated from the same photo at the gable's plane.
 *  - sides: thirteen bays of round-headed windows in two storeys behind a
 *    10 m front return, counted on Daniel Schwen's north-west view and
 *    LeMay's south-west view (estimated).
 *  - lobby and pavilion: brick block, perforated-metal panel, glass shop
 *    under the canopy, from LeMay's annex photos (54384296426,
 *    54384675125).
 *  - colours: red brick (sampled, pulled light), white painted stone
 *    trim, dark grey slate, grey limestone base.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Ryman Auditorium.jpg, Daniel Schwen, CC BY-SA 4.0 (north-west)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium.jpg
 *  - Ryman Auditorium, 5th Avenue, Nashville, TN (54383413407).jpg, Warren
 *    LeMay, CC BY-SA 2.0 (the front square on)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium,_5th_Avenue,_Nashville,_TN_(54383413407).jpg
 *  - Ryman Auditorium, 5th Avenue, Nashville, TN (54384487379).jpg, Warren
 *    LeMay, CC BY-SA 2.0 (south-west, the alley side and base)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium,_5th_Avenue,_Nashville,_TN_(54384487379).jpg
 *  - Ryman Auditorium, 5th Avenue, Nashville, TN (54384293066).jpg, Warren
 *    LeMay, CC BY-SA 2.0 (the gable close up)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium,_5th_Avenue,_Nashville,_TN_(54384293066).jpg
 *  - Annex, Ryman Auditorium, 5th Avenue, Nashville, TN (54384296426).jpg
 *    and (54384675125).jpg, Warren LeMay, CC BY-SA 2.0 (the rear gable,
 *    lobby block and PNC Plaza)
 *    https://commons.wikimedia.org/wiki/File:Annex,_Ryman_Auditorium,_5th_Avenue,_Nashville,_TN_(54384296426).jpg
 *    https://commons.wikimedia.org/wiki/File:Annex,_Ryman_Auditorium,_5th_Avenue,_Nashville,_TN_(54384675125).jpg
 *  - Ryman Auditorium - West front and south side (cropped).tif, HABS,
 *    public domain (1970s, the same massing)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium_-_West_front_and_south_side_(cropped).tif
 *  - Ryman Auditorium 116 5th Avenue North downtown Nashville TN 31
 *    December 2024 01.jpg, Artaxerxes, CC BY 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Ryman_Auditorium_116_5th_Avenue_North_downtown_Nashville_TN_31_December_2024_01.jpg
 *  - USGS NAIP (public domain): plan only.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow (`window`), the front and side doors are `entrance`;
 * the brick and trim of the front and the first bays of the sides carry
 * floodlight, as in the night photo.
 *
 * Left out: the corbel tables (drawn as plain brick between white bands),
 * pilaster strips between the side bays, the pinnacle crockets, signs,
 * the LED band on the canopy, the plaza steps and retaining walls (ground).
 *
 * Doubts: the rear gable is plain brick here (one photo shows a blind
 * pointed arch in it); the side windows are counted from oblique views, so
 * the bay count (13) may be off by one; the lobby block's east face is
 * only seen behind the canopy.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, prism, save, type XY } from './atl-westin-peachtree-plaza'

// ───────────────────────── helpers shared by the nash- models ─────────────────────────

/** A point set on a vertical wall face a→b, `s` metres along it, `out` off it. */
export type Face = { P: (s: number, z: number, out?: number) => V3; L: number; n: XY; t: XY }

/** The face of a wall running a→b on a counter-clockwise ring; its outside is to the right. */
export function face(a: XY, b: XY): Face {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  return { L, t, n, P: (s, z, out = 0) => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z] }
}

/** Outline (s, z), counter-clockwise seen from outside, of a window: `head` round, pointed or flat. */
export function opening(sc: number, w: number, z0: number, zs: number, head: 'round' | 'pointed' | 'flat' = 'round', seg = 8): XY[] {
  const h = w / 2, pts: XY[] = [[sc - h, z0], [sc + h, z0], [sc + h, zs]]
  if (head === 'round') for (let i = 1; i < seg; i++) { const a = (Math.PI * i) / seg; pts.push([sc + h * Math.cos(a), zs + h * Math.sin(a)]) }
  else if (head === 'pointed') {
    const k = Math.max(2, seg / 2)
    for (let i = 1; i <= k; i++) { const a = (Math.PI / 3) * (i / k); pts.push([sc - h + w * Math.cos(a), zs + w * Math.sin(a)]) }
    for (let i = 1; i < k; i++) { const a = Math.PI - (Math.PI / 3) * (1 - i / k); pts.push([sc + h + w * Math.cos(a), zs + w * Math.sin(a)]) }
  }
  pts.push([sc - h, zs])
  return pts
}

/** A flat convex shape (s, z outline) on a face, fanned from its centroid. */
export function shape(p: Part, f: Face, outline: XY[], out = 0.06) {
  const c = outline.reduce<XY>((m, q) => [m[0] + q[0] / outline.length, m[1] + q[1] / outline.length], [0, 0])
  const C = f.P(c[0], c[1], out)
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length]
    p.tri(C, f.P(a[0], a[1], out), f.P(b[0], b[1], out))
  }
}

/** A flat rectangle on a face. */
export function rectOn(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  p.quad(f.P(s0, z0, out), f.P(s1, z0, out), f.P(s1, z1, out), f.P(s0, z1, out))
}

/** A band standing proud of a face by `d` (a string course or pilaster): front and the four edges. */
export function band(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const A = (s: number, z: number, o: number) => f.P(s, z, o)
  p.quad(A(s0, z0, d), A(s1, z0, d), A(s1, z1, d), A(s0, z1, d))
  p.quad(A(s0, z1, d), A(s1, z1, d), A(s1, z1, 0), A(s0, z1, 0)) // top
  p.quad(A(s0, z0, 0), A(s1, z0, 0), A(s1, z0, d), A(s0, z0, d)) // soffit
  p.quad(A(s0, z0, 0), A(s0, z0, d), A(s0, z1, d), A(s0, z1, 0)) // start end
  p.quad(A(s1, z0, d), A(s1, z0, 0), A(s1, z1, 0), A(s1, z1, d)) // finish end
}

/** A triangle, flipped if needed so its normal points along `hint`. */
export function triH(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
export function quadH(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  triH(p, a, b, c, hint)
  triH(p, a, c, d, hint)
}

/**
 * A prism whose convex profile lies in a vertical plane: `prof` is (u, z)
 * with u along `axis` (unit XY in plan), extruded across it from w0 to w1
 * along the axis's left normal. For gables, gabled porches and roofs.
 */
export function prismV(p: Part, prof: XY[], axis: XY, origin: XY, w0: number, w1: number, top: Part = p) {
  const nx: XY = [-axis[1], axis[0]]
  const P = (u: number, z: number, w: number): V3 => [origin[0] + axis[0] * u + nx[0] * w, origin[1] + axis[1] * u + nx[1] * w, z]
  const c = prof.reduce<XY>((m, q) => [m[0] + q[0] / prof.length, m[1] + q[1] / prof.length], [0, 0])
  for (let i = 0; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    // Outward in the profile plane.
    let du = b[1] - a[1], dz = -(b[0] - a[0])
    const mu = (a[0] + b[0]) / 2 - c[0], mz = (a[1] + b[1]) / 2 - c[1]
    if (du * mu + dz * mz < 0) { du = -du; dz = -dz }
    const hint: V3 = [axis[0] * du, axis[1] * du, dz]
    quadH(dz > 0.3 ? top : p, P(a[0], a[1], w0), P(b[0], b[1], w0), P(b[0], b[1], w1), P(a[0], a[1], w1), hint)
  }
  for (const [w, s] of [[w0, -1], [w1, 1]] as [number, number][]) {
    const hint: V3 = [nx[0] * s, nx[1] * s, 0]
    for (let i = 1; i < prof.length - 1; i++) triH(p, P(prof[0][0], prof[0][1], w), P(prof[i][0], prof[i][1], w), P(prof[i + 1][0], prof[i + 1][1], w), hint)
  }
}

/** A box with no bevel, all six faces (for small blocks: caps, copings). */
export function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  prismV(p, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], [1, 0], [0, 0], y0, y1)
}

// ───────────────────────── the Ryman ─────────────────────────

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), slate = new Part(), lime = new Part(), door = new Part()

  const X0 = -25, X1 = 25, HW = 17.15
  const EAVE = 16.0, RIDGE = 32.6, FB = 16.9, GX = -23 // gable face
  const BASE = 2.6
  const hall: XY[] = [[X0, -HW], [X1, -HW], [X1, HW], [X0, HW]]
  const S = face(hall[0], hall[1]), E = face(hall[1], hall[2]), N = face(hall[2], hall[3]), W = face(hall[3], hall[0])

  // ── Massing ──
  // Limestone base, a little proud, then the brick walls to the eaves.
  prism(lime, [[X0 - 0.12, -HW - 0.12], [X1 + 0.12, -HW - 0.12], [X1 + 0.12, HW + 0.12], [X0 - 0.12, HW + 0.12]], 0, BASE, lime, 0.1)
  prism(brick, hall, BASE, EAVE, slate, 0.01)
  // The front block: to 16.9 across the front, with parapets on its 10 m returns.
  box(brick, X0, GX, -HW, HW, EAVE - 0.5, FB, slate, 0.3)
  for (const s of [-1, 1]) box(brick, GX - 0.1, -14.3, s > 0 ? HW - 0.6 : -HW, s > 0 ? HW : -HW + 0.6, EAVE - 0.5, FB, brick, 0.15)
  // Gables, front and rear: brick triangles standing 0.35 m proud of the roof.
  const slope = (RIDGE - EAVE) / (HW + 0.45)
  const gTop = (y: number) => RIDGE + 0.35 - slope * Math.abs(y)
  const gprof: XY[] = [[-HW, EAVE - 0.6], [HW, EAVE - 0.6], [HW, gTop(HW)], [0, gTop(0)], [-HW, gTop(HW)]]
  // prismV's profile u runs along the axis; here the axis is +y and w runs along -x.
  prismV(brick, gprof, [0, 1], [0, 0], -GX - 1.0, -GX, brick) // front gable x -23..-22
  prismV(brick, gprof, [0, 1], [0, 0], -X1, -X1 + 0.8, brick) // rear gable x 24.2..25
  // Raking copings on both gables.
  for (const [xa, xb] of [[GX - 0.08, GX + 1.0], [X1 - 0.8, X1 + 0.08]]) {
    for (const s of [-1, 1]) {
      const ya = s * (HW + 0.05), yb = 0
      const za = gTop(ya), zb = gTop(0)
      const a0: V3 = [xa, ya, za - 0.45], a1: V3 = [xa, ya, za + 0.12], b0: V3 = [xa, yb, zb - 0.45], b1: V3 = [xa, yb, zb + 0.12]
      const c0: V3 = [xb, ya, za - 0.45], c1: V3 = [xb, ya, za + 0.12], d0: V3 = [xb, yb, zb - 0.45], d1: V3 = [xb, yb, zb + 0.12]
      quadH(trim, a1, b1, d1, c1, [0, s * 0.7, 0.7])
      quadH(trim, a0, b0, b1, a1, [-1, 0, 0])
      quadH(trim, c0, d0, d1, c1, [1, 0, 0])
      quadH(trim, a0, a1, c1, c0, [0, s, 0])
    }
  }
  // The roof: two slate slopes from the eave trim to the ridge.
  {
    const xa = GX + 1.0, xb = X1 - 0.8, ye = HW + 0.45
    for (const s of [-1, 1]) {
      quadH(slate, [xa, s * ye, EAVE], [xb, s * ye, EAVE], [xb, 0, RIDGE], [xa, 0, RIDGE], [0, s, 1])
      quadH(slate, [xa, s * ye, EAVE - 0.35], [xb, s * ye, EAVE - 0.35], [xb, s * ye, EAVE], [xa, s * ye, EAVE], [0, s, 0])
      quadH(slate, [xa, s * HW, EAVE - 0.35], [xb, s * HW, EAVE - 0.35], [xb, s * ye, EAVE - 0.35], [xa, s * ye, EAVE - 0.35], [0, 0, -1])
    }
  }
  // Eave cornice: a white band under the eaves along both sides, behind the front returns.
  for (const f of [S, N]) {
    const s0 = f === S ? 25 + -14.3 : 0, s1 = f === S ? 50 : 50 - 10.7
    band(trim, f, s0, s1, EAVE - 0.7, EAVE - 0.35, 0.3)
  }
  // Chimneys at the rear corners.
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? HW - 0.6 : -HW - 1.2, y1 = s > 0 ? HW + 1.2 : -HW + 0.6
    box(brick, 24.2, 26.0, y0, y1, BASE, 22.2, brick, 0.15)
    block(trim, 24.0, 26.2, y0 - 0.2, y1 + 0.2, 22.2, 22.7)
  }

  // ── Front (5th Avenue) ──
  const fW = (y: number) => HW - y // W face runs from y = +HW to -HW
  // Buttresses: corners and either side of the centre, with white gabled caps.
  for (const yc of [-16.45, -7.4, 7.4, 16.45]) {
    const w = 1.4, y0 = yc - w / 2, y1 = yc + w / 2
    box(brick, X0 - 0.45, X0 + 0.1, y0, y1, 0, FB + 0.15, brick, 0.15)
    block(lime, X0 - 0.57, X0 + 0.1, y0 - 0.12, y1 + 0.12, 0, BASE)
    // White cap: a block with a little gable on its face.
    block(trim, X0 - 0.65, X0 + 0.1, y0 - 0.1, y1 + 0.1, 9.3, 10.6)
    prismV(trim, [[y0 - 0.1, 10.6], [y1 + 0.1, 10.6], [yc, 11.5]], [0, 1], [0, 0], -(X0 + 0.1), -(X0 - 0.65))
  }
  // Corner buttresses return onto the sides.
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? HW - 0.1 : -HW - 0.45, y1 = s > 0 ? HW + 0.45 : -HW + 0.1
    box(brick, X0 - 0.45, X0 + 1.4, y0, y1, 0, FB + 0.15, brick, 0.15)
  }
  // Pier between the front return and the hall's side, with its white cap.
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? HW - 0.1 : -HW - 0.45, y1 = s > 0 ? HW + 0.45 : -HW + 0.1
    box(brick, -15.7, -14.3, y0, y1, 0, FB + 0.15, brick, 0.15)
    block(trim, -15.8, -14.2, s > 0 ? y0 : y0 - 0.2, s > 0 ? y1 + 0.2 : y1, 9.3, 10.6)
  }
  // String courses (white): over the base, at the upper sills, under the cornice; coping on top.
  for (const [z0, z1, d] of [[BASE, BASE + 0.3, 0.14], [9.3, 9.6, 0.12], [14.6, 14.9, 0.14]] as [number, number, number][]) {
    band(trim, W, 0, 2 * HW, z0, z1, d)
    for (const [f, s0, s1] of [[S, 0, 10.7], [N, 50 - 10.7, 50]] as [Face, number, number][]) band(trim, f, s0, s1, z0, z1, d)
  }
  block(trim, X0 - 0.3, X0 + 0.6, -HW - 0.3, HW + 0.3, FB - 0.45, FB)
  for (const s of [-1, 1]) block(trim, GX - 0.05, -14.3, s > 0 ? HW - 0.6 : -HW - 0.3, s > 0 ? HW + 0.3 : -HW + 0.6, FB - 0.45, FB)
  // Side string courses along the hall.
  for (const f of [S, N]) {
    const s0 = f === S ? 10.7 : 0, s1 = f === S ? 50 : 50 - 10.7
    band(trim, f, s0, s1, BASE, BASE + 0.3, 0.14)
    band(trim, f, s0, s1, 9.3, 9.6, 0.12)
  }
  band(trim, E, 0, 2 * HW, BASE, BASE + 0.3, 0.14)

  /** A lancet with a white hood: trim shape behind, glass in front. */
  const lancet = (f: Face, sc: number, w: number, z0: number, zs: number, head: 'round' | 'pointed' = 'pointed', hood = 0.28) => {
    shape(trim, f, opening(sc, w + 2 * hood, z0 - 0.15, zs, head, 8), 0.04)
    shape(win, f, opening(sc, w, z0, zs, head, 8), 0.08)
  }
  // Pavilions: four lancets per storey, in pairs.
  for (const yc of [-12, 12]) {
    for (const d of [-2.7, -0.9, 0.9, 2.7]) {
      lancet(W, fW(yc + d), 1.2, 3.6, 7.0)
      lancet(W, fW(yc + d), 1.15, 10.0, 12.4)
    }
  }
  // Centre: two round-arched doors with white voussoir rings and fanlights.
  for (const yc of [-3.4, 3.4]) {
    const s = fW(yc)
    shape(trim, W, opening(s, 4.6, 2.5, 5.9, 'round', 10), 0.04)
    shape(brick, W, opening(s, 3.6, 2.5, 5.9, 'round', 10), 0.06)
    rectOn(door, W, s - 1.5, s + 1.5, 2.7, 4.7, 0.1)
    shape(win, W, opening(s, 3.0, 4.75, 5.9, 'round', 10), 0.1)
  }
  lancet(W, fW(0), 0.8, 4.0, 5.9, 'pointed', 0.2)
  // Upper centre: three lancets either side of a white niche.
  for (const yc of [-3.6, 3.6]) for (const d of [-1.45, 0, 1.45]) lancet(W, fW(yc + d), 1.0, 10.0, 12.6, 'pointed', 0.22)
  shape(trim, W, opening(fW(0), 1.5, 9.6, 12.8, 'pointed', 8), 0.14)
  // The small central gable on the front block, with its three lancets.
  prismV(brick, [[-4.3, FB - 0.4], [4.3, FB - 0.4], [0, FB + 2.6]], [0, 1], [0, 0], -(X0 + 0.7), -(X0 - 0.02))
  for (const s of [-1, 1]) {
    const a: V3 = [X0 - 0.15, s * 4.6, FB - 0.2], b: V3 = [X0 - 0.15, 0, FB + 2.9]
    const a2: V3 = [X0 + 0.8, s * 4.6, FB - 0.2], b2: V3 = [X0 + 0.8, 0, FB + 2.9]
    quadH(trim, a, b, b2, a2, [0, s * 0.6, 0.8])
    const a3: V3 = [X0 - 0.15, s * 4.6, FB - 0.6], b3: V3 = [X0 - 0.15, 0, FB + 2.5]
    quadH(trim, a3, b3, b, a, [-1, 0, 0])
  }
  for (const d of [-0.8, 0, 0.8]) shape(win, W, opening(fW(d), 0.5, FB - 0.2, FB + (d ? 0.6 : 1.0), 'pointed', 6), 0.1)

  // ── The gable (face at x = -23) ──
  const G = face([GX, HW], [GX, -HW])
  // White band across the gable's foot, carrying on from the eaves.
  band(trim, G, 0, 2 * HW, 17.3, 17.7, 0.25)
  // The big round-headed window, with a white surround and bold tracery.
  shape(trim, G, opening(HW, 7.0, 19.6, 23.3, 'round', 12), 0.04)
  shape(win, G, opening(HW, 6.0, 20.0, 23.3, 'round', 12), 0.08)
  for (const d of [-1.5, 0, 1.5]) rectOn(trim, G, HW + d - 0.09, HW + d + 0.09, 20.0, d ? 23.3 + Math.sqrt(9 - d * d) - 0.1 : 26.2, 0.12)
  rectOn(trim, G, HW - 3, HW + 3, 22.2, 22.38, 0.12)
  // Four small lancets under it.
  for (const d of [-2.25, -0.75, 0.75, 2.25]) shape(win, G, opening(HW + d, 0.9, 17.9, 19.0, 'pointed', 6), 0.08)
  // The louvred vents: white frame, dark louvres.
  for (const d of [-4.8, 4.8]) {
    rectOn(trim, G, HW + d - 1.2, HW + d + 1.2, 18.0, 20.9, 0.04)
    rectOn(slate, G, HW + d - 0.9, HW + d + 0.9, 18.3, 20.4, 0.08)
  }

  // ── Sides ──
  for (const f of [S, N]) {
    const fromFront = (x: number) => (f === S ? x - X0 : X1 - x) // distance along the face
    // Front return: four lancets upstairs, three down.
    for (const d of [-2.7, -0.9, 0.9, 2.7]) lancet(f, fromFront(-19.8 + d), 1.15, 10.0, 12.4)
    for (const d of [-2.0, 0, 2.0]) lancet(f, fromFront(-19.8 + d), 1.2, 3.6, 7.0)
    // The hall: thirteen bays of round-headed windows, two storeys; a door in the second bay.
    const xa = -14.3, xb = 24.2, n = 13, bw = (xb - xa) / n
    for (let i = 0; i < n; i++) {
      const xc = xa + bw * (i + 0.5), s = fromFront(xc)
      if (i === 1) {
        shape(trim, f, opening(s, 2.0, 2.7, 6.0, 'round', 8), 0.04)
        rectOn(door, f, s - 0.75, s + 0.75, 2.7, 5.4, 0.08)
        shape(win, f, opening(s, 1.5, 5.45, 6.0, 'round', 8), 0.08)
      } else lancet(f, s, 1.3, 3.6, 7.3, 'round', 0.2)
      lancet(f, s, 1.25, 10.0, 13.0, 'round', 0.2)
    }
    // A second buttress with a white cap after the third bay.
    const xp = xa + bw * 3
    const sgn = f === N ? 1 : -1
    const y0 = sgn > 0 ? HW - 0.1 : -HW - 0.4, y1 = sgn > 0 ? HW + 0.4 : -HW + 0.1
    box(brick, xp - 0.5, xp + 0.5, y0, y1, 0, EAVE - 0.7, brick, 0.12)
    block(trim, xp - 0.6, xp + 0.6, sgn > 0 ? y0 : y0 - 0.2, sgn > 0 ? y1 + 0.2 : y1, 9.3, 10.6)
  }

  // ── The 2015 lobby block (way/464659484) ──
  const lob: XY[] = [[25.0, -8.0], [30.6, -7.9], [30.7, -14.0], [61.2, -13.8], [60.7, 11.4], [24.9, 11.0]]
  const LOB = 14.9
  prism(brick, lob, 0, LOB, lime, 0.3)
  box(brick, 24.9, 28.0, -8.0, 11.0, LOB - 1, 16.1, lime, 0.3)
  box(slate, 44, 52, -12.5, -3.5, LOB - 0.5, 17.4, slate, 0.2) // rooftop plant
  {
    const Nf = face([60.7, 11.4], [24.9, 11.0]), Ef = face([61.2, -13.8], [60.7, 11.4]), Sf = face([30.7, -14.0], [61.2, -13.8])
    // Perforated metal screen on the north face, a slightly proud panel.
    band(brick, Nf, 14, 28, 6.0, LOB - 0.6, 0.35)
    // Glass shopfront along the plaza (north) and the canopy side (east).
    rectOn(win, Nf, 1.0, 34.0, 3.3, 7.3, 0.06)
    rectOn(win, Ef, 1.0, 24.2, 3.3, 7.3, 0.06)
    // Upper windows: a few broad panels (photos show tall glazed slots).
    for (const s0 of [3, 9]) rectOn(win, Ef, s0, s0 + 4, 8.8, 13.2, 0.06)
    // The south (alley) face: a service wall with a stone plinth.
    band(lime, Sf, 0, Sf.L, 0, 1.4, 0.08)
  }
  // ── The PNC Plaza pavilion (way/683968785): a glass shop under a deep black canopy. ──
  {
    const PX0 = 61.0, PX1 = 81.9, PY0 = -13.4, PY1 = -0.3, CAN = 7.3, TOP = 8.5
    box(lime, PX0 + 1, PX1 - 1.8, PY0 + 1.6, PY1 - 1.6, 0, 3.3, lime, 0.1)
    box(win, PX0 + 1, PX1 - 1.8, PY0 + 1.6, PY1 - 1.6, 3.3, CAN, win, 0.01)
    box(slate, PX0, PX1, PY0, PY1, CAN, TOP, slate, 0.12)
  }

  const brickM = { ...finish('ryman-brick', 0xa95b48), floodlight: (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[0] < -21 ? 0.85 : p[0] < -5 && Math.abs(n[1]) > 0.7 ? 0.5 : 0) }
  const trimM = { ...PALETTE.trim, floodlight: (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[0] < -21 ? 0.85 : 0) }
  return [
    { part: brick, material: brickM },
    { part: trim, material: trimM },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('ryman-slate', 0x5d636a) },
    { part: lime, material: finish('ryman-limestone', 0xcdc6b8) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await save('nash-ryman-auditorium', 'Ryman Auditorium', build(), { height: 32.95, anchor: [36.161247, -86.778496], bearing: 332 })
}
