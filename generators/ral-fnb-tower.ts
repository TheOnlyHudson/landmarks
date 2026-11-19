/**
 * FNB Tower (Charter Square North), Raleigh (2020) — original procedural
 * geometry, CC0-1.0. bun generators/ral-fnb-tower.ts [out.glb]
 *
 * Not the FNB Tower in Charlotte. OSM names this building Charter Square
 * North (way/268758828); TastyPoutine's Commons photo "FNB Tower -
 * Raleigh.jpg" shows the same building at 501 Fayetteville Street. Its
 * neighbour Charter Square South Tower (way/454126369) is a separate model
 * and is not drawn here.
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/268758828, 35.773812,
 * -78.638924. Bearing 2 (the downtown grid, from the outline's edges).
 *
 * Identity (photos below): a 22-storey glass slab running east–west. Its
 * west end on Fayetteville Street is a stack of glass boxes: a two-storey
 * colonnade of round columns, a darker glass block that stands out from
 * the face, a recessed terrace storey with columns, and a lighter upper
 * block, capped by a white parapet with a row of fins. The long north face
 * is glass behind close-set pale aluminium fins. A seven-storey wing on
 * the south side has a sandstone base and a pool deck on its roof. A red
 * FNB sign on the parapet at the north-west corner, drawn as `neon`.
 *
 * Evidence:
 *  - plan: OSM way/268758828 and its parts way/1563063472 (22 levels) and
 *    way/1563063473 (7 levels), turned 2° and squared up: the slab
 *    x −32…32, y −9.7…17.3; the wing y −17.1…−9.7.
 *  - heights: OSM has no height. 22 levels (OSM); roof 90 m and parapet
 *    95 m, estimated from storeys (ground 6 m, then 4.0 m) and checked
 *    against the roof's lean in USGS NAIP (about 34 m east, which at the
 *    0.37 m per metre measured on Wells Fargo Capitol Center's published
 *    height in the same image gives about 93 m). Wing 30 m (7 levels).
 *    The west end's storeys (colonnade 0–12 m, lower block 12–52 m,
 *    terrace 52–56 m, upper block 56–90 m): counted in TastyPoutine's and
 *    City Dweller 2's photos. No lidar covers Raleigh.
 *  - colours: lower block dark blue-green glass (palette window), upper
 *    block and long faces lighter sky grey-blue glass, aluminium fins and
 *    parapet pale grey, sandstone base, red sign; all from the photos.
 *  - y = 0 is Fayetteville Street; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - FNB Tower - Raleigh.jpg, TastyPoutine, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:FNB_Tower_-_Raleigh.jpg
 *    (from the west: the stacked west end, the finned north face, the wing)
 *  - FNB Tower December 2023.jpg, City Dweller 2, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:FNB_Tower_December_2023.jpg
 *    (from the north-west: the terrace storey, the sign, the parapet fins)
 *  - Charter Square December 2023.jpg, City Dweller 2, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Charter_Square_December_2023.jpg
 *    (from the south in fog: the tower behind Charter Square South)
 * Not used: "FNB Tower November 2023.jpg" (City Dweller 2) shows the
 * Charlotte FNB Tower (Residence Inn and Truist Field in front), not this one.
 * USGS NAIP for the plan, the wing's pool deck and the height check. No
 * look-only sources. No commercial imagery.
 *
 * Doubts: the height is an estimate (no published figure found); no clear
 * photo shows the east end or the south face above the wing, both drawn
 * as plain curtain wall; OSM's slab outline has a shallow V on its south
 * side that is squared off here; no night photo was found, so the night
 * look (lit offices, lit sign) is assumed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, rect, ringFaces, face, curtain, coping, plate, cap, write } from './ral-wells-fargo-capitol-center'

const dark = new Part(), light = new Part(), alu = new Part(), sand = new Part(), roof = new Part(), red = new Part()

const X0 = -32, X1 = 32, Y0 = -9.7, Y1 = 17.3, YW = -17.1
const ROOF = 90, PARAPET = 95.3, WING = 30
const FLOOR = 4.0, G0 = 6

/** A round column. */
function column(p: Part, c: XY, r: number, z0: number, z1: number, segs = 12) {
  const ring: XY[] = Array.from({ length: segs }, (_, i) => {
    const a = (i / segs) * 2 * Math.PI
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
  for (const f of ringFaces(ring, z0, z1)) plate(p, f, 0, f.len, z0, z1, 0, 0)
}

/** A parapet ring: outer and inner walls and a top, `t` thick. */
function parapet(p: Part, ring: XY[], z0: number, z1: number, t: number) {
  for (const f of ringFaces(ring, z0, z1)) {
    plate(p, f, 0, f.len, z0, z1, 0, 0)
    const ia: XY = [f.a[0] - f.n[0] * t, f.a[1] - f.n[1] * t], ib: XY = [f.b[0] - f.n[0] * t, f.b[1] - f.n[1] * t]
    // inner wall faces inward (reverse direction); the top joins them
    const inner = face(ib, ia, z0, z1)
    plate(p, inner, 0, inner.len, z0, z1, 0, 0)
    p.quad([f.a[0], f.a[1], z1], [f.b[0], f.b[1], z1], [ib[0], ib[1], z1], [ia[0], ia[1], z1])
  }
}

const bands = { floor: FLOOR, every: 3, origin: G0, band: 0.45 }

// ── the slab: north, south (above the wing) and east faces ──
{
  const north = face([X1, Y1], [X0, Y1], 0, ROOF)
  curtain(light, alu, north, { ...bands })
  // close-set aluminium fins over the whole north face
  for (let s = 1.5; s < north.len - 1; s += 3.2) plate(alu, north, s - 0.18, s + 0.18, 12, ROOF, 0.6, 0.6)
  curtain(light, alu, face([X0, Y0], [X1, Y0], WING, ROOF), { ...bands, mullion: 8 })
  curtain(light, alu, face([X1, Y0], [X1, Y1], 0, ROOF), { ...bands, mullion: 9 })
  cap(roof, rect(X0, Y0, X1, Y1), ROOF)
  parapet(alu, rect(X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3), ROOF - 0.6, PARAPET - 0.8, 0.6)
  // the parapet's fins: a row of short white blades along each long side
  for (const f of [face([X1 + 0.3, Y1 + 0.3], [X0 - 0.3, Y1 + 0.3], 0, 0), face([X0 - 0.3, Y0 - 0.3], [X1 + 0.3, Y0 - 0.3], 0, 0)]) {
    for (let s = 2; s < f.len - 1; s += 3.2) plate(alu, f, s - 0.2, s + 0.2, PARAPET - 3.5, PARAPET + 0.6, 0.5, 0.5)
  }
  // the FNB sign on the parapet at the north-west corner
  const nf = face([X0 + 12, Y1 + 0.3], [X0 - 0.3, Y1 + 0.3], 0, 0)
  plate(red, nf, 2.5, 10.5, PARAPET - 4.2, PARAPET - 1.2, 0.35, 0.3)
}

// ── the west end: colonnade, lower block, terrace, upper block ──
{
  // colonnade: glazed lobby set back 2.4 m behind round columns
  const XL = X0 + 2.4
  curtain(dark, alu, face([XL, Y1], [XL, Y0], 0, 12), { floor: 6, every: 1, mullion: 4 })
  for (const y of [Y0 + 2, (Y0 + Y1) / 2 - 3.5, (Y0 + Y1) / 2 + 3.5, Y1 - 2]) column(alu, [X0 - 0.4, y], 0.8, 0, 12)
  // the soffit over the colonnade
  roof.quad([X0 - 1.2, Y0, 12], [X0 - 1.2, Y1, 12], [XL, Y1, 12], [XL, Y0, 12])
  // lower block, standing 1.2 m proud of the face
  const XB = X0 - 1.2
  // it runs 5 m further south than the slab, out over the wing
  const lower = rect(XB, Y0 - 5, X0 + 6, Y1 + 0.6)
  for (const f of ringFaces(lower, 12, 52)) {
    if (f.n[0] < -0.5) curtain(dark, alu, f, { ...bands, mullion: 6 })
    else if (f.n[1] < -0.5) curtain(dark, alu, f, { ...bands })
    else if (f.n[1] > 0.5) plate(dark, f, 0, f.len, 12, 52, 0, 0)
  }
  // its frame: a pale edge round the block's face
  const wf = face([XB, Y1 + 0.6], [XB, Y0 - 5], 12, 52)
  plate(alu, wf, -0.05, 0.6, 12, 52, 0.12, 0.2)
  plate(alu, wf, wf.len - 0.6, wf.len + 0.05, 12, 52, 0.12, 0.2)
  plate(alu, wf, -0.05, wf.len + 0.05, 51.2, 52.4, 0.12, 0.3)
  plate(alu, wf, -0.05, wf.len + 0.05, 11.6, 12.6, 0.12, 0.3)
  cap(roof, lower, 52)
  // terrace storey: set back 3 m, two columns
  const XT = X0 + 3
  curtain(light, alu, face([XT, Y1], [XT, Y0], 52, 56), { floor: 4, every: 1, mullion: 4 })
  for (const y of [Y0 + 4, Y1 - 4]) column(alu, [X0 + 0.6, y], 0.7, 52, 56)
  roof.quad([XT, Y1, 56], [XT, Y0, 56], [X0, Y0, 56], [X0, Y1, 56]) // its ceiling (underside of the upper block)
  // upper block
  const up = face([X0, Y1], [X0, Y0], 56, ROOF)
  curtain(light, alu, up, { ...bands, origin: 56, mullion: 5 })
  plate(alu, up, -0.05, 0.6, 56, ROOF, 0.12, 0.2)
  plate(alu, up, up.len - 0.6, up.len + 0.05, 56, ROOF, 0.12, 0.2)
  plate(alu, up, -0.05, up.len + 0.05, 55.6, 56.6, 0.12, 0.3)
}

// ── the south wing: sandstone base, glass above, pool deck ──
{
  const wing = rect(X0, YW, X1, Y0)
  for (const f of ringFaces(wing, 0, WING)) {
    if (f.n[1] > 0.5) continue // inside the slab
    plate(sand, f, 0, f.len, 0, 14, 0, 0)
    // shopfronts in the sandstone: one tall panel per bay
    const bays = Math.max(1, Math.round(f.len / 6))
    for (let k = 0; k < bays; k++) {
      const s0 = (k * f.len) / bays + 1.1, s1 = ((k + 1) * f.len) / bays - 1.1
      if (s1 > s0) plate(dark, f, s0, s1, 1, 12.5, 0.05)
    }
    coping(sand, { ...f, z1: 14 } as Face, 0.8, 0.25)
    curtain(dark, alu, { ...f, z0: 14 } as Face, { floor: FLOOR, every: 2, origin: 14, mullion: 6 })
  }
  cap(roof, wing, WING)
  parapet(alu, rect(X0, YW - 0.1, X1 + 0.1, Y0), WING, WING + 1.1, 0.3)
}

const lit = (p: V3) => (p[2] > ROOF - 2 ? 0.6 : 0)
await write('ral-fnb-tower', 'FNB Tower', [
  { part: light, material: windowVariant(2, 0x93abbe) },
  { part: dark, material: PALETTE.window },
  { part: alu, material: { ...finish('fnb-aluminium', 0xdfe2e4), floodlight: lit } },
  { part: sand, material: finish('fnb-sandstone', 0xdccaa9) },
  { part: roof, material: PALETTE.roof },
  { part: red, material: finish('neon-fnb-red', 0xcf3b38, 0.5) },
], { bearing: 2, elevation: 0, height: PARAPET + 0.6, replaces: ['way/268758828', 'way/1563063472', 'way/1563063473'] })
