/**
 * Hamerschlag Hall (Machinery Hall; Palmer & Hornbostel, 1912), Carnegie
 * Mellon University, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-hamerschlag-hall.ts
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/27551077, -79.946710 40.442356. The walls run at 15° / 105°,
 * so the catalog bearing is 15: model +x (east-south-east) is the temple
 * front facing the campus lawn, -x the tower over Junction Hollow, +y the
 * north wing, -y the south wing.
 *
 * Identity, in order: the round open colonnade drum of twelve tall arches
 * with its white cornice, balustrade and the chimney cap rising out of it
 * (the tower is the boiler-house stack dressed as a monument); the tall
 * octagonal base block under it with the great arched window over the
 * hollow; the temple-fronted east pavilion with its low copper-edged
 * pediment and the deep round-arched portal (herringbone terracotta
 * tympanum); the long gabled hall between them with tall narrow windows;
 * the low hipped north and south wings with rows of round-arched windows;
 * buff (yellow) brick with white terracotta trim and green copper cornices.
 * At night the colonnade and the tower are floodlit (CMU Hamerschlag at
 * night.jpg, Dllu): `floodlight` on the tower's brick and trim.
 *
 * Evidence:
 *  - plan: OSM way/27551077 for the hall and pavilion (x -9.5..34.5); the
 *    tower and wings follow the lidar, which puts the base block's west
 *    face 3 m and the wings' west walls 5 m further west than the OSM
 *    outline (the light well between them and Roberts Engineering Hall
 *    shows clearly at x -30..-33). Doubt: OSM's west edge may be drawn to
 *    Roberts Hall's line.
 *  - HABS PA-1174 "Machinery Hall Tower" (S. M. Pozar, R. G. Neher, 1966,
 *    public domain), sheets 2-4: plan at the base of the tower 65 ft
 *    octagon, the stepped octagon 47 ft, the colonnade drum 33 ft across
 *    with 12 piers and the stack inside, west/east/north elevations
 *    (the stages' proportions).
 *    https://commons.wikimedia.org/wiki/File:Carnegie_Institute_of_Technology,_Machinery_Hall_Tower,_Carnegie_Mellon_University_Campus,_Pittsburgh,_Allegheny_County,_PA_HABS_PA,2-PITBU,24A-_(sheet_2_of_6).png
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid. y = 0 is the light well on the west side (273.5 m NAVD88);
 *    the campus lawn on the east is 13.5 m higher. Hall eaves 25.6, ridge
 *    30.1; pavilion pediment apex 30.1; wing eaves 21.7, ridges 24.5; base
 *    block 30.4; stepped octagon 33.2; colonnade drum parapet 44.6; stack
 *    cap 47.5 (the highest return).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Hamerschlag Hall, Carnegie Mellon University, 2023-04-27, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall,_Carnegie_Mellon_University,_2023-04-27,_01.jpg
 *      Cbaile19, CC0 — the east front, wings and tower from the lawn.
 *    "Hamerschlag Hall, Carnegie Mellon University, 2023-04-27, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall,_Carnegie_Mellon_University,_2023-04-27,_02.jpg
 *      Cbaile19, CC0 — pavilion and colonnade close up.
 *    "Hamerschlag Hall, Carnegie Mellon University, 2023-04-27, 03.jpg"
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall,_Carnegie_Mellon_University,_2023-04-27,_03.jpg
 *      Cbaile19, CC0 — the hall's north side windows from the north-east.
 *    "Hamerschlag Hall 1.JPG", "Hamerschlag Hall 2.JPG"
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall_1.JPG
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall_2.JPG
 *      Piotrus, CC BY-SA 3.0 — the west side over the hollow: base block,
 *      great arch, medallion, wings.
 *    "Hamerschlag Hall at Carnegie Mellon University.jpg"
 *      https://commons.wikimedia.org/wiki/File:Hamerschlag_Hall_at_Carnegie_Mellon_University.jpg
 *      Jiuguang Wang, CC BY-SA 2.0 — pavilion and hall side from the south-east.
 *    "Carnegie Mellon Hamerschlag Hall and Scott Hall.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Mellon_Hamerschlag_Hall_and_Scott_Hall.jpg
 *      Dllu, CC BY-SA 4.0 — west side from the hollow.
 *  - colour: buff yellow brick pulled to the palette's lightness; white
 *    terracotta trim; light grey metal roofs; green copper cornices.
 * Estimated (from the photos scaled to the lidar heights): window sizes and
 * counts, the portal (6.4 m opening, springing 8 m over the lawn), the
 * pilasters, the colonnade's arch springing, the medallion.
 *
 * Left out: the frieze's X pattern, the balustrade's balusters (a solid
 * low parapet), the pediment's recessed panels, the steps and terraces
 * round the pavilion, the glass pavilion at the hall's south-east corner
 * (later), the masts on the cap.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, hipRoof, poly } from './pit-allegheny-county-courthouse'
import { pier } from './pit-heinz-chapel'

/** A regular octagon of half-width h with corner legs c, centred (cx, cy), counter-clockwise. */
function octagon(cx: number, cy: number, h: number, c: number): XY[] {
  return [[cx - h + c, cy - h], [cx + h - c, cy - h], [cx + h, cy - h + c], [cx + h, cy + h - c],
    [cx + h - c, cy + h], [cx - h + c, cy + h], [cx - h, cy + h - c], [cx - h, cy - h + c]]
}

/** Outward-offset ring (for bands): each vertex moved out by d from the centre, mitred by the inset helper's inverse. */
function grow(r: XY[], cx: number, cy: number, d: number): XY[] {
  return r.map(([x, y]) => {
    const l = Math.hypot(x - cx, y - cy)
    return [x + ((x - cx) / l) * d * 1.08, y + ((y - cy) / l) * d * 1.08] as XY
  })
}

/** A smooth vertical cylinder wall (or a cone frustum) between z0 r0 and z1 r1, seg sides from angle a0..a1. */
export function drum(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number, seg = 24, a0 = 0, a1 = 2 * Math.PI, inward = false) {
  const nz = (r0 - r1) / Math.max(1e-6, z1 - z0)
  for (let i = 0; i < seg; i++) {
    const t0 = a0 + ((a1 - a0) * i) / seg, t1 = a0 + ((a1 - a0) * (i + 1)) / seg
    const A: V3 = [cx + r0 * Math.cos(t0), cy + r0 * Math.sin(t0), z0], B: V3 = [cx + r0 * Math.cos(t1), cy + r0 * Math.sin(t1), z0]
    const C: V3 = [cx + r1 * Math.cos(t1), cy + r1 * Math.sin(t1), z1], D: V3 = [cx + r1 * Math.cos(t0), cy + r1 * Math.sin(t0), z1]
    const s = inward ? -1 : 1
    const n0: V3 = [s * Math.cos(t0), s * Math.sin(t0), s * nz], n1: V3 = [s * Math.cos(t1), s * Math.sin(t1), s * nz]
    p.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
  }
}

/** A flat annulus (or disc when ri = 0) at height z, facing up or down. */
export function ring(p: Part, cx: number, cy: number, ro: number, ri: number, z: number, up: boolean, seg = 24) {
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    const o0: V3 = [cx + ro * Math.cos(t0), cy + ro * Math.sin(t0), z], o1: V3 = [cx + ro * Math.cos(t1), cy + ro * Math.sin(t1), z]
    if (ri <= 0) { up ? p.tri([cx, cy, z], o0, o1) : p.tri([cx, cy, z], o1, o0); continue }
    const i0: V3 = [cx + ri * Math.cos(t0), cy + ri * Math.sin(t0), z], i1: V3 = [cx + ri * Math.cos(t1), cy + ri * Math.sin(t1), z]
    if (up) p.quad(i0, o0, o1, i1); else p.quad(i0, i1, o1, o0)
  }
}

/**
 * The open colonnade: `n` piers between outer radius R and inner Ri from z0
 * to the arch crown, round-arched openings `w` wide (true semicircles on the
 * outer face) springing at zs.
 */
function colonnade(p: Part, cx: number, cy: number, R: number, Ri: number, n: number, w: number, z0: number, zs: number) {
  const r = w / 2, crown = zs + r, half = r / R // opening half-angle
  const P = (rad: number, t: number, z: number): V3 => [cx + rad * Math.cos(t), cy + rad * Math.sin(t), z]
  const N = (t: number, s = 1): V3 => [s * Math.cos(t), s * Math.sin(t), 0]
  const seg = 6
  for (let k = 0; k < n; k++) {
    const c = (k / n) * 2 * Math.PI + Math.PI / n // opening centre
    const nx = ((k + 1) / n) * 2 * Math.PI + Math.PI / n
    // pier between this opening and the next
    const p0 = c + half, p1 = nx - half
    for (const [rad, s] of [[R, 1], [Ri, -1]] as [number, number][]) {
      for (let j = 0; j < 2; j++) {
        const t0 = p0 + ((p1 - p0) * j) / 2, t1 = p0 + ((p1 - p0) * (j + 1)) / 2
        p.tri(P(rad, t0, z0), P(rad, t1, z0), P(rad, t1, crown), undefined, undefined, undefined, [N(t0, s), N(t1, s), N(t1, s)])
        p.tri(P(rad, t0, z0), P(rad, t1, crown), P(rad, t0, crown), undefined, undefined, undefined, [N(t0, s), N(t1, s), N(t0, s)])
      }
    }
    // pier sides (the opening's jambs), radial
    poly(p, [P(Ri, p0, z0), P(R, p0, z0), P(R, p0, zs), P(Ri, p0, zs)], N(p0 + Math.PI / 2))
    poly(p, [P(Ri, p1, z0), P(R, p1, z0), P(R, p1, zs), P(Ri, p1, zs)], N(p1 - Math.PI / 2))
    // the arch: spandrels on both faces and the soffit
    const arc = (rad: number) => Array.from({ length: seg + 1 }, (_, i) => {
      const a = Math.PI - (Math.PI * i) / seg // from the left springing over the crown
      const s = r * Math.cos(a), z = zs + r * Math.sin(a)
      return { t: c + s / R, z }
    })
    const pts = arc(R)
    for (const [rad, s] of [[R, 1], [Ri, -1]] as [number, number][]) {
      const L = P(rad, c - half, crown), Rr = P(rad, c + half, crown)
      for (let i = 0; i < seg; i++) {
        const a = pts[i], b = pts[i + 1], corner = i < seg / 2 ? L : Rr
        poly(p, [corner, P(rad, a.t, a.z), P(rad, b.t, b.z)], N(c, s))
      }
      poly(p, [L, P(rad, pts[seg / 2].t, pts[seg / 2].z), Rr], N(c, s))
    }
    for (let i = 0; i < seg; i++) {
      const a = pts[i], b = pts[i + 1]
      const mt = (a.t + b.t) / 2 - c, mz = (a.z + b.z) / 2 - zs
      // soffit faces the opening's axis: down and in toward the arch centre
      poly(p, [P(Ri, a.t, a.z), P(R, a.t, a.z), P(R, b.t, b.z), P(Ri, b.t, b.z)],
        [-Math.sin(c) * -mt, Math.cos(c) * -mt, -mz] as V3)
    }
  }
  return crown
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), cu = new Part(), win = new Part(), tc = new Part()

  const TY = 0.7 // the building's axis
  const LAWN = 13.5 // the campus lawn and terraces, above the west light well
  // ---- the tower: base block, stepped octagon, colonnade drum, stack cap
  const TX = -19.5, BH = 10, BTOP = 30.4
  const base = octagon(TX, TY, BH, 4.2)
  walls(brick, base, 0, BTOP - 2.2)
  walls(trim, base, BTOP - 2.2, BTOP - 0.6)
  band(trim, base, grow(base, TX, TY, 0.45), BTOP - 0.6, BTOP, 0.25)
  cap(roof, base, BTOP - 0.05)
  // the west face over the hollow: great arched window, medallion, narrow lights
  {
    const fa: XY = base[6], fb: XY = base[7] // edge 6→7 is the west face (y+ to y-)
    const { L } = onWall(fa, fb)
    const c = L / 2
    arch(trim, fa, fb, c - 2.3, c + 2.3, 12.6, 21.5, 0.05, 10)
    arch(win, fa, fb, c - 1.8, c + 1.8, 13.0, 21.5, 0.09, 10)
    for (const sg of [-1, 1]) panel(win, fa, fb, c + sg * 4.4 - 0.45, c + sg * 4.4 + 0.45, 14.5, 22.5, 0.05)
    for (const s of [c - 2.6, c, c + 2.6]) panel(win, fa, fb, s - 0.6, s + 0.6, 4.0, 11.5, 0.05)
    // the round medallion in the attic
    const { P } = onWall(fa, fb)
    const ctr = P(c, 25.4, 0.08)
    for (let i = 0; i < 14; i++) {
      const t0 = (i / 14) * 2 * Math.PI, t1 = ((i + 1) / 14) * 2 * Math.PI
      trim.tri(ctr, P(c + 1.3 * Math.cos(t0), 25.4 + 1.3 * Math.sin(t0), 0.08), P(c + 1.3 * Math.cos(t1), 25.4 + 1.3 * Math.sin(t1), 0.08))
    }
  }
  // the east, north and south faces above the hall and wing roofs, and the chamfers
  for (const k of [0, 2, 4]) {
    const fa = base[k], fb = base[(k + 1) % 8], { L } = onWall(fa, fb)
    for (const s of [L / 2 - 2.6, L / 2, L / 2 + 2.6]) panel(win, fa, fb, s - 0.55, s + 0.55, 25.0, 27.6, 0.05)
  }
  for (const k of [1, 3, 5, 7]) {
    const fa = base[k], fb = base[(k + 1) % 8], { L } = onWall(fa, fb)
    panel(win, fa, fb, L / 2 - 0.5, L / 2 + 0.5, 14.5, 22.5, 0.05)
    panel(win, fa, fb, L / 2 - 0.5, L / 2 + 0.5, 25.0, 27.6, 0.05)
  }

  // stepped octagon (47 ft) and the drum's plinth
  const oct2 = octagon(TX, TY, 7.15, 2.3)
  walls(trim, grow(oct2, TX, TY, 0.6), BTOP, BTOP + 0.8)
  cap(trim, grow(oct2, TX, TY, 0.6), BTOP + 0.8)
  walls(trim, oct2, BTOP + 0.8, 32.4)
  for (let k = 0; k < 8; k += 2) {
    const fa = oct2[k], fb = oct2[(k + 1) % 8], { L } = onWall(fa, fb)
    for (const s of [L / 2 - 2.6, L / 2 - 0.9, L / 2 + 0.9, L / 2 + 2.6]) panel(win, fa, fb, s - 0.4, s + 0.4, 31.2, 32.1, 0.04)
  }
  band(trim, oct2, grow(oct2, TX, TY, 0.35), 32.4, 33.2, 0.25)
  cap(roof, grow(oct2, TX, TY, 0.35), 33.15)
  const R = 5.0, RI = 4.2, Z0 = 34.4, ZS = 39.9
  drum(trim, TX, TY, R + 0.35, 33.2, R + 0.35, Z0, 24)
  ring(trim, TX, TY, R + 0.35, 0, Z0, true, 24)
  // the colonnade
  const crown = colonnade(brick, TX, TY, R, RI, 12, 1.62, Z0, ZS)
  // entablature (buff frieze), white cornice, balustraded parapet
  drum(brick, TX, TY, R, crown, R, 42.6, 24)
  drum(brick, TX, TY, RI, crown, RI, 42.6, 24, 0, 2 * Math.PI, true)
  ring(brick, TX, TY, R, RI, crown, false, 24)
  drum(trim, TX, TY, R, 41.0, R + 0.12, 41.4, 24) // white band over the arches
  drum(trim, TX, TY, R, 42.6, R + 0.5, 43.2, 24)
  drum(trim, TX, TY, R + 0.5, 43.2, R + 0.5, 43.6, 24)
  ring(trim, TX, TY, R + 0.5, R - 0.1, 43.6, true, 24)
  drum(trim, TX, TY, R - 0.1, 43.6, R - 0.1, 44.6, 24)
  drum(trim, TX, TY, R - 0.4, 43.6, R - 0.4, 44.6, 24, 0, 2 * Math.PI, true)
  ring(trim, TX, TY, R - 0.1, R - 0.4, 44.6, true, 24)
  ring(roof, TX, TY, R - 0.4, 2.6, 43.4, true, 24)
  // the stack inside, rising through the drum to its cap
  drum(brick, TX, TY, 2.3, 33.2, 2.3, 44.0, 16)
  drum(trim, TX, TY, 2.6, 43.4, 2.6, 46.6, 16)
  drum(trim, TX, TY, 2.6, 46.6, 2.95, 47.0, 16)
  drum(trim, TX, TY, 2.95, 47.0, 2.95, 47.3, 16)
  ring(trim, TX, TY, 2.95, 1.6, 47.3, true, 16)
  drum(brick, TX, TY, 1.6, 47.3, 1.6, 47.0, 16, 0, 2 * Math.PI, true)
  ring(roof, TX, TY, 1.6, 0, 47.0, true, 16)
  // the cap's four small arched openings (HABS: an arch on each face)
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2 + Math.PI / 12
    const a: XY = [TX + 2.62 * Math.cos(t - 0.3), TY + 2.62 * Math.sin(t - 0.3)], b: XY = [TX + 2.62 * Math.cos(t + 0.3), TY + 2.62 * Math.sin(t + 0.3)]
    const { L } = onWall(a, b)
    arch(win, a, b, L / 2 - 0.45, L / 2 + 0.45, 44.8, 45.7, 0.06, 6)
  }

  // ---- the hall: gabled, from the tower block to the pavilion
  const HX0 = -9.5, HX1 = 29.5, HW = 9.0, EAVE = 25.6, RIDGE = 30.1
  const hall = rect(HX0, TY - HW, HX1, TY + HW)
  walls(brick, hall, 0, EAVE - 0.6)
  band(cu, hall, rect(HX0 - 0.01, TY - HW - 0.45, HX1, TY + HW + 0.45), EAVE - 0.6, EAVE, 0.3)
  poly(roof, [[HX0, TY - HW - 0.45, EAVE], [HX1, TY - HW - 0.45, EAVE], [HX1, TY, RIDGE], [HX0, TY, RIDGE]], [0, -1, 2])
  poly(roof, [[HX0, TY + HW + 0.45, EAVE], [HX1, TY + HW + 0.45, EAVE], [HX1, TY, RIDGE], [HX0, TY, RIDGE]], [0, 1, 2])
  // side walls over the terraces: a low storey, then tall narrow windows
  for (const [fa, fb] of [[[HX0, TY - HW], [HX1, TY - HW]], [[HX1, TY + HW], [HX0, TY + HW]]] as [XY, XY][]) {
    const { L } = onWall(fa, fb)
    const nb = 11, pitch = (L - 2.4) / nb
    for (let i = 0; i < nb; i++) {
      const s = 1.2 + pitch * (i + 0.5)
      panel(win, fa, fb, s - 0.6, s + 0.6, LAWN + 0.9, LAWN + 2.5, 0.05)
      panel(win, fa, fb, s - 0.55, s + 0.55, LAWN + 3.4, EAVE - 2.0, 0.05)
    }
  }

  // ---- the east pavilion: temple front, pediment, portal
  const PX0 = HX1, PX1 = 34.5, PW = 9.4, PEAVE = 25.3
  const pav = rect(PX0, TY - PW, PX1, TY + PW)
  walls(brick, pav, 0, PEAVE - 0.7)
  band(trim, pav, rect(PX0, TY - PW - 0.3, PX1 + 0.3, TY + PW + 0.3), PEAVE - 0.7, PEAVE, 0.25)
  // pediment: brick tympanum, copper raking cornices and roof
  const ap = RIDGE + 0.1
  poly(brick, [[PX1, TY - PW, PEAVE], [PX1, TY + PW, PEAVE], [PX1, TY, ap]], [1, 0, 0])
  poly(roof, [[PX0, TY - PW - 0.3, PEAVE], [PX1 + 0.6, TY - PW - 0.3, PEAVE], [PX1 + 0.6, TY, ap + 0.2], [PX0, TY, ap + 0.2]], [0, -1, 2])
  poly(roof, [[PX0, TY + PW + 0.3, PEAVE], [PX1 + 0.6, TY + PW + 0.3, PEAVE], [PX1 + 0.6, TY, ap + 0.2], [PX0, TY, ap + 0.2]], [0, 1, 2])
  for (const sg of [-1, 1]) {
    // the raking cornice: a copper band along each slope, on the gable face
    const e: XY = [PX1, TY + sg * (PW + 0.3)]
    const A: V3 = [PX1 + 0.62, e[1], PEAVE - 0.05], B: V3 = [PX1 + 0.62, TY, ap + 0.15]
    const A1: V3 = [PX1 + 0.62, e[1], PEAVE + 0.85], B1: V3 = [PX1 + 0.62, TY, ap + 1.05]
    poly(cu, [A, B, B1, A1], [1, 0, 0])
    poly(cu, [[PX0, e[1], PEAVE], [PX1 + 0.62, e[1], PEAVE], [PX1 + 0.62, e[1], PEAVE + 0.55], [PX0, e[1], PEAVE + 0.55]], [0, sg, 0])
    // a copper strip along the rake, lying on the roof slope
    const k = 0.9 / (PW + 0.3)
    poly(cu, [[PX1 + 0.62, e[1], PEAVE + 0.02], [PX1 + 0.62, TY, ap + 0.22], [PX1 - 0.4, TY, ap + 0.22], [PX1 - 0.4, e[1], PEAVE + 0.02]], [0, sg, 3])
    void k
  }
  poly(cu, [[PX1 + 0.62, TY - PW - 0.3, PEAVE - 0.05], [PX1 + 0.62, TY + PW + 0.3, PEAVE - 0.05], [PX1 + 0.62, TY + PW + 0.3, PEAVE + 0.4], [PX1 + 0.62, TY - PW - 0.3, PEAVE + 0.4]], [1, 0, 0])
  {
    const fa: XY = [PX1, TY - PW], fb: XY = [PX1, TY + PW], { L } = onWall(fa, fb), c = L / 2
    // broad pilasters, two each side of the portal
    for (const s of [1.0, 3.6, L - 3.6, L - 1.0]) pier(brick, fa, fb, s, 1.5, LAWN, PEAVE - 0.7, 0.3)
    // the portal: a white moulded arch, herringbone terracotta inside, lunette and doors
    arch(trim, fa, fb, c - 3.9, c + 3.9, LAWN, LAWN + 8.0, 0.06, 12)
    arch(tc, fa, fb, c - 3.2, c + 3.2, LAWN + 0.9, LAWN + 8.0, 0.1, 12)
    arch(win, fa, fb, c - 1.7, c + 1.7, LAWN + 6.6, LAWN + 8.0, 0.13, 8)
    panel(trim, fa, fb, c - 1.9, c + 1.9, LAWN + 0.9, LAWN + 6.1, 0.12)
    panel(win, fa, fb, c - 1.15, c + 1.15, LAWN + 0.9, LAWN + 5.2, 0.15)
    for (const sg of [-1, 1]) panel(win, fa, fb, c + sg * 2.55 - 0.35, c + sg * 2.55 + 0.35, LAWN + 2.6, LAWN + 5.0, 0.13)
    // steps up to the portal
    for (let i = 0; i < 3; i++) {
      const r: XY[] = rect(PX1, TY - 3.6, PX1 + 3.0 - i * 1.0, TY + 3.6)
      walls(trim, r, LAWN - 0.6, LAWN + 0.3 * (i + 1))
      cap(trim, r, LAWN + 0.3 * (i + 1))
    }
  }
  // the pavilion's sides: one tall window each
  for (const [fa, fb] of [[[PX0, TY - PW], [PX1, TY - PW]], [[PX1, TY + PW], [PX0, TY + PW]]] as [XY, XY][]) {
    const { L } = onWall(fa, fb)
    panel(win, fa, fb, L / 2 - 0.6, L / 2 + 0.6, LAWN + 3.4, PEAVE - 2.4, 0.05)
  }

  // ---- the north and south wings: low hipped ranges with round-arched windows
  const WX0 = -27.5, WX1 = -11.5, WE = 21.7, WR = 24.5
  for (const [y0, y1] of [[TY + BH - 0.2, 37.5], [-35.5, TY - BH + 0.2]]) {
    const w = rect(WX0, y0, WX1, y1)
    walls(brick, w, 0, WE - 0.6)
    band(cu, w, rect(WX0 - 0.4, y0 - 0.4, WX1 + 0.4, y1 + 0.4), WE - 0.6, WE, 0.3)
    hipRoof(roof, [WX0, y0, WX1, y1], WE, WR, 0.4, 1)
    const outer = y0 > 0 ? [y1, 1] : [y0, -1]
    // east face over the terrace, west face over the hollow
    for (const [fa, fb, lo] of [[[WX1, y0], [WX1, y1], LAWN + 1.4], [[WX0, y1], [WX0, y0], LAWN + 0.6]] as [XY, XY, number][]) {
      const { L } = onWall(fa, fb)
      const n = 7, pitch = (L - 1.6) / n
      for (let i = 0; i < n; i++) {
        const s = 0.8 + pitch * (i + 0.5)
        if (y0 > 0 ? (fa[0] === WX1 ? s < 1.5 : s > L - 1.5) : false) continue
        arch(trim, fa, fb, s - 1.25, s + 1.25, lo - 0.3, WE - 2.95, 0.04, 8)
        arch(win, fa, fb, s - 1.05, s + 1.05, lo, WE - 2.95, 0.07, 8)
        if (fa[0] === WX0) for (const z of [[3.5, 6.5], [8.0, 11.5]]) panel(win, fa, fb, s - 0.95, s + 0.95, z[0], z[1], 0.05)
      }
    }
    // the outer end
    {
      const fa: XY = outer[1] > 0 ? [WX1, y1] : [WX0, y0], fb: XY = outer[1] > 0 ? [WX0, y1] : [WX1, y0]
      const { L } = onWall(fa, fb)
      for (const s of [L / 2 - 4.6, L / 2, L / 2 + 4.6]) {
        arch(trim, fa, fb, s - 1.25, s + 1.25, LAWN + 0.6, WE - 2.95, 0.04, 8)
        arch(win, fa, fb, s - 1.05, s + 1.05, LAWN + 0.9, WE - 2.95, 0.07, 8)
        for (const z of [[3.5, 6.5], [8.0, 11.5]]) panel(win, fa, fb, s - 0.95, s + 0.95, z[0], z[1], 0.05)
      }
    }
  }

  // night: the tower and colonnade are floodlit; the hall and wings faintly
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[0] < -8 && p[2] > 28 ? 0.9 : p[0] > 30 ? 0.45 : 0.15)
  return [
    { part: brick, material: { ...finish('buff-brick', 0xe3d6b4), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: roof, material: finish('metal-roof', 0xa9adab) },
    { part: cu, material: PALETTE.patina },
    { part: win, material: finish('window', 0x5f7a72) },
    { part: tc, material: PALETTE.terracotta },
  ]
}

if (import.meta.main) await save('pit-hamerschlag-hall', 'Hamerschlag Hall', [40.442356, -79.94671], 15, build() as any, 6500)
