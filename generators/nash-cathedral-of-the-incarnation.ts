/**
 * Cathedral of the Incarnation, 2001 West End Avenue, Nashville (1914,
 * Fred Asmus; Italian Romanesque / Renaissance basilica with a Lombard
 * campanile): procedural, CC0-1.0.
 * bun generators/nash-cathedral-of-the-incarnation.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 329.2: +y is
 * the nave's axis pointing at the West End Avenue front (NNW), +x is the
 * campanile side (ENE). Anchor -86.7996199, 36.1508398: on the nave's
 * centre line, 3.2 m from the centroid of OSM way/543962489 (Q4457185),
 * so the basilica front is symmetric about x = 0.
 * y = 0 is the lowest ground under the footprint (lidar 152.2 m, the ENE
 * corner); the street at the facade's centre is 0.75 m higher and the WSW
 * side 1.7 m higher, so the walls on that side sink into the slope.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022 (2022), 0.5 m grid,
 * read with tools/lidar_frame.py at bearing 329.2, above y = 0:
 * nave 15.4 m wide, eaves 17.7, ridge 20.55; facade pediment base 17.3,
 * apex 21.1; facade lower storey top 10.7, 27.7 m wide; aisles 6.1 m wide,
 * lean-to roofs 9.5 (outer wall) to 10.6 (nave wall); sanctuary behind the
 * nave 13.3–15.2; flat-roofed sacristy annex beside the tower 10.8; the
 * one-storey link on the ENE front 5.3 (parapet 6.3); campanile 7.0 m
 * shaft (9 m over its 1 m eaves, c03), eaves 35.5, hip roof apex 38.5.
 * The campanile reaches 2.5 m past OSM's rear edge (lidar), and is drawn
 * where the lidar puts it.
 *
 * Photos (EVIDENCE, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-cathedral-of-the-incarnation/photos):
 *  c2b "Cathedral of the Incarnation Nashville 2023b.jpg", Antony-22,
 *      CC BY-SA 4.0 — the facade square on: every pilaster, door, window
 *      and the scrolls were placed from it, scaled to the lidar widths.
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Incarnation_Nashville_2023b.jpg
 *  c2a, c2c "... Nashville 2023a.jpg", "... 2023c.jpg", Antony-22, CC BY-SA 4.0
 *      (front with both neighbours; from the ENE with the side and tower)
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Incarnation_Nashville_2023a.jpg
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Incarnation_Nashville_2023c.jpg
 *  c01 "Cathedral of the Incarnation (Nashville, Tennessee) - exterior.jpg",
 *      Nheyob, CC BY-SA 3.0 (from the WSW at dusk: tower tiers, clerestory)
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Incarnation_(Nashville,_Tennessee)_-_exterior.jpg
 *  c03 "... - exterior, bell tower and roof line.jpg", Nheyob, CC BY-SA 3.0
 *      (belfry: open triple arcades, red brick, red tile hip roof, cross)
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Incarnation_(Nashville,_Tennessee)_-_exterior,_bell_tower_and_roof_line.jpg
 *  c05 "Nashville cathedral.jpg", User:Diezba, CC BY-SA 3.0 (daylight colour
 *      of the stucco and the tower)
 *      https://commons.wikimedia.org/wiki/File:Nashville_cathedral.jpg
 *  USGS NAIP (public domain): plan, red tile roofs.
 * No look-only sources. No commercial imagery.
 *
 * The brief said "tetrastyle portico": no photo shows one. The front is a
 * two-storey pilastered facade (six pilasters below, four above) with
 * three doors, concave scrolls joining the storeys, and a pediment; the
 * photos win.
 * Estimated (from c2b and c01, scaled to the lidar): pilaster, door and
 * window sizes and heights; clerestory and aisle windows (seven bays a
 * side, from c01); the campanile's five arcade tiers (c01) and their
 * heights; the scroll curve. Doubts: the rear and the WSW aisle wall are
 * seen only from afar; the sanctuary roof form is read from lidar alone.
 * Left out: the pediment roundel's carving, capitals' carving, the lamp
 * post, the neighbouring rectory and hall (separate OSM buildings).
 * Night: the facade and the tower are floodlit (c2a, c2b, c01); the
 * arcades of the tower glow, so they are `window`; the doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, capRing, lathe, flatShape, extrudeShape, archShape, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO, gable } from './nash-tennessee-state-capitol'

// Plan (OSM + lidar, model frame).
const FY = 23.7 // facade face
const NW = 7.7, AW = 13.85 // nave and aisle half widths
const RY = -19.5 // nave rear wall
// Heights above y = 0.
const ST = 0.75 // street at the facade
const NE = 17.7, NR = 20.55 // nave eaves, ridge
const AO = 9.5, AI = 10.6 // aisle roof, outer and inner
const LOW = 10.7 // facade lower storey top
const PB = 17.3, PA = 21.1 // pediment base, apex
const TX = 11.2, TY = -22.0, TH = 3.5, TE = 35.5, TA = 38.5 // campanile

/** Walls round a ring between z0 and z1, split into ≤ 5 m panels (for the terrain). */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const out: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0], m = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < m; k++) {
      const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
      quadO(p, P(k / m, z0), P((k + 1) / m, z0), P((k + 1) / m, z1), P(k / m, z1), out)
    }
  }
}
const arch = (p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.06) => flatShape(p, f, archShape(s, w, z0, z1 - w / 2, 8), d)

function build() {
  const wall = new Part(), trim = new Part(), brick = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---------------------------------------------------------- nave, aisles, sanctuary
  walls(wall, rect(-NW, RY, NW, FY - 1.5), 0, NE)
  gable(roof, trim, wall, NW + 0.4, RY - 0.4, FY - 1.5, NE, NR, [-1, 1], 0.45, 0.3)
  // left aisle runs to the back; the right one stops at the sacristy
  walls(wall, rect(-AW, -24.0, -NW, FY - 1.5), 0, AO)
  walls(wall, rect(NW, -12.6, AW, FY - 1.5), 0, AO)
  for (const [x0, x1, y0] of [[-AW - 0.3, -NW, -24.3], [NW, AW + 0.3, -12.6]] as [number, number, number][]) {
    const o = x0 < 0 ? x0 : x1, sx = x0 < 0 ? -1 : 1
    quadO(roof, [o, y0, AO], [o, FY - 1.5, AO], [sx * NW, FY - 1.5, AI], [sx * NW, y0, AI], [sx * (AI - AO), 0, Math.abs(o) - NW])
    // closing triangle at the back of the lean-to
    triO(wall, [sx * AW, y0 + 0.3, AO], [sx * NW, y0 + 0.3, AI], [sx * NW, y0 + 0.3, AO], [0, -1, 0])
  }
  prism(trim, null, chamfer(rect(-AW - 0.3, -24.3, -NW, FY - 1.5), 0.2), AO - 0.4, AO)
  prism(trim, null, chamfer(rect(NW, -12.6, AW + 0.3, FY - 1.5), 0.2), AO - 0.4, AO)
  // sanctuary behind the nave: hipped against the nave's end wall
  walls(wall, rect(-6.8, -25.3, 6.8, RY), 0, 13.3)
  quadO(roof, [-7.1, -25.6, 13.3], [7.1, -25.6, 13.3], [5.0, RY, 15.2], [-5.0, RY, 15.2], [0, -1, 3])
  triO(roof, [-7.1, -25.6, 13.3], [-5.0, RY, 15.2], [-7.1, RY, 13.3], [-1, 0, 1])
  triO(roof, [7.1, -25.6, 13.3], [7.1, RY, 13.3], [5.0, RY, 15.2], [1, 0, 1])
  // sacristy annex (flat) and the low link on the ENE front
  walls(wall, rect(NW, -23.8, 22.0, -12.6), 0, 10.8)
  capRing(wall, rect(NW, -23.8, 22.0, -12.6), 10.8)
  walls(wall, rect(AW, 6.2, 23.6, 21.7), 0, 6.3)
  capRing(roof, rect(AW, 6.2, 23.6, 21.7), 5.3)
  walls(trim, rect(AW + 0.4, 6.6, 23.2, 21.3).reverse(), 5.3, 6.3)
  // its tall dark windows (c01): along the ENE side and the street end
  for (let k = 0; k < 3; k++) {
    const y = 9.0 + k * 4.6
    flatShape(win, { o: [23.6, 0, 0], n: [1, 0] }, rect(y - 1.5, 1.2, y + 1.5, 4.4), 0.05)
  }
  flatShape(win, { o: [0, 21.7, 0], n: [0, 1] }, rect(-21.5, 1.2, -16.5, 4.4), 0.05)

  // clerestory and aisle windows, seven bays a side
  for (const sx of [-1, 1]) {
    const fN: Face = { o: [sx * NW, 0, 0], n: [sx, 0] }, fA: Face = { o: [sx * AW, 0, 0], n: [sx, 0] }
    for (let k = 0; k < 7; k++) {
      const y = -16.0 + k * 5.4, s = sx * y
      arch(win, fN, s, 1.7, 12.0, 15.6)
      if (sx < 0 || y > -12) arch(win, fA, s, 1.3, 3.6, 7.2)
    }
  }

  // ---------------------------------------------------------- the facade
  const F: Face = { o: [0, FY, 0], n: [0, 1] } // s runs toward -x (seen from the street, s right)
  // lower storey block, cornice and attic
  walls(wall, rect(-AW, FY - 1.5, AW, FY), 0, LOW)
  prism(trim, trim, chamfer(rect(-AW - 0.35, FY - 1.9, AW + 0.35, FY + 0.35), 0.2), 8.8, 9.3)
  prism(wall, wall, rect(-AW + 0.1, FY - 1.6, AW - 0.1, FY - 0.1), 9.3, LOW)
  prism(trim, trim, chamfer(rect(-AW, FY - 1.7, AW, FY), 0.15), LOW - 0.25, LOW)
  // grey plinth and the entablature band
  extrudeShape(trim, F, [[-AW, 0], [AW, 0], [AW, 1.9], [-AW, 1.9]], 0, 0.15)
  extrudeShape(trim, F, [[-AW, 7.6], [AW, 7.6], [AW, 8.8], [-AW, 8.8]], 0, 0.2)
  // six pilasters
  for (const s of [-12.3, -6.7, -2.6, 2.6, 6.7, 12.3]) {
    extrudeShape(trim, F, [[s - 0.7, 1.9], [s + 0.7, 1.9], [s + 0.7, 7.6], [s - 0.7, 7.6]], 0, 0.3)
    extrudeShape(trim, F, [[s - 0.85, 7.0], [s + 0.85, 7.0], [s + 0.85, 7.6], [s - 0.85, 7.6]], 0.3, 0.42)
  }
  // central door: flat-headed surround, oak leaves, glazed transom
  extrudeShape(trim, F, [[-1.75, ST], [1.75, ST], [1.75, 6.0], [-1.75, 6.0]], 0, 0.12)
  extrudeShape(trim, F, [[-2.0, 6.0], [2.0, 6.0], [2.0, 6.4], [-2.0, 6.4]], 0, 0.3)
  flatShape(door, F, [[-1.05, ST], [1.05, ST], [1.05, 4.6], [-1.05, 4.6]], 0.18)
  flatShape(win, F, [[-1.05, 4.75], [1.05, 4.75], [1.05, 5.5], [-1.05, 5.5]], 0.18)
  // side doors under small pediments
  for (const s of [-9.8, 9.8]) {
    extrudeShape(trim, F, [[s - 1.2, ST + 0.2], [s + 1.2, ST + 0.2], [s + 1.2, 4.6], [s - 1.2, 4.6]], 0, 0.1)
    flatShape(door, F, [[s - 0.75, ST + 0.2], [s + 0.75, ST + 0.2], [s + 0.75, 3.7], [s - 0.75, 3.7]], 0.14)
    flatShape(win, F, [[s - 0.75, 3.8], [s + 0.75, 3.8], [s + 0.75, 4.35], [s - 0.75, 4.35]], 0.14)
    extrudeShape(trim, F, [[s - 1.45, 4.6], [s + 1.45, 4.6], [s, 5.7]], 0, 0.3)
  }
  // round-headed windows beside the central door
  for (const s of [-4.7, 4.7]) {
    flatShape(trim, F, archShape(s, 1.9, 2.4, 4.75, 8), 0.06)
    arch(win, F, s, 1.4, 2.6, 5.45, 0.1)
  }
  // upper storey
  const UW = 8.0
  walls(wall, rect(-UW, FY - 1.6, UW, FY - 0.15), LOW, PB)
  for (const s of [-7.3, -2.9, 2.9, 7.3]) {
    extrudeShape(trim, { o: [0, FY - 0.15, 0], n: [0, 1] }, [[s - 0.6, LOW], [s + 0.6, LOW], [s + 0.6, 15.6], [s - 0.6, 15.6]], 0, 0.25)
  }
  const FU: Face = { o: [0, FY - 0.15, 0], n: [0, 1] }
  extrudeShape(trim, FU, [[-UW, 15.6], [UW, 15.6], [UW, 16.6], [-UW, 16.6]], 0, 0.3)
  extrudeShape(trim, FU, [[-UW - 0.3, 16.6], [UW + 0.3, 16.6], [UW + 0.3, PB], [-UW - 0.3, PB]], 0, 0.55)
  for (const s of [-5.1, 5.1]) { flatShape(trim, FU, archShape(s, 2.0, 11.6, 14.0, 8), 0.06); arch(win, FU, s, 1.5, 11.8, 14.9, 0.1) }
  flatShape(trim, FU, archShape(0, 2.3, 10.8, 13.25, 8), 0.06)
  arch(win, FU, 0, 1.8, 11.0, 14.3, 0.1)
  extrudeShape(trim, FU, [[-1.4, 14.6], [1.4, 14.6], [1.4, 14.95], [-1.4, 14.95]], 0, 0.25)
  // the pediment: raking cornice and tympanum, a roundel, the cross
  {
    const w = UW + 0.3, zr = PA, ze = PB, yE = FY + 0.4
    for (const sx of [-1, 1]) {
      quadO(trim, [sx * w, yE, ze], [0, yE, zr], [0, yE, zr - 0.55], [sx * w, yE, ze - 0.55], [0, 1, 0])
      quadO(trim, [sx * w, yE, ze], [0, yE, zr], [0, FY - 1.6, zr], [sx * w, FY - 1.6, ze], [sx * (zr - ze), 0, w])
      quadO(trim, [sx * w, yE, ze - 0.55], [0, yE, zr - 0.55], [0, FY - 0.15, zr - 0.55], [sx * w, FY - 0.15, ze - 0.55], [0, 0, -1])
    }
    const xi = w - 0.55 * (w / (zr - ze))
    triO(wall, [-xi, FY - 0.15, ze], [xi, FY - 0.15, ze], [0, FY - 0.15, zr - 0.55], [0, 1, 0])
    flatShape(trim, FU, arc(0, 18.55, 0.85, 0, 360, 12).slice(0, -1), 0.1)
    box(trim, -0.25, FY - 0.6, 0.25, FY - 0.1, zr - 0.2, zr + 0.6, trim)
    box(trim, -0.12, FY - 0.47, 0.12, FY - 0.23, zr + 0.6, zr + 2.6, trim)
    box(trim, -0.6, FY - 0.47, 0.6, FY - 0.23, zr + 1.75, zr + 2.0, trim)
  }
  // the concave scrolls from the upper storey down to the attic
  for (const sx of [-1, 1]) {
    const pts: XY[] = [[UW, LOW]]
    for (let k = 0; k <= 8; k++) {
      const t = (k / 8) * (Math.PI / 2)
      pts.push([12.4 - 4.4 * Math.cos(t), 16.2 - 5.5 * Math.sin(t)])
    }
    pts.reverse() // (12.4, LOW) ... (UW, 16.2), (UW, LOW)
    const shape: XY[] = pts.map(([u, z]) => [-sx * u, z] as XY) // s = -x on the front face
    extrudeShape(trim, { o: [0, FY - 0.15, 0], n: [0, 1] }, shape, -1.2, 0.05)
    extrudeShape(trim, { o: [0, FY - 1.35, 0], n: [0, -1] }, pts.map(([u, z]) => [sx * u, z] as XY), 0, 0.01, false)
  }

  // ---------------------------------------------------------- the campanile
  const T = rect(TX - TH, TY - TH, TX + TH, TY + TH)
  walls(brick, T, 0, TE)
  const tiers: [number, number][] = [[13.0, 17.4], [17.6, 21.9], [22.1, 26.4], [26.6, 30.9], [31.1, 35.0]]
  for (const [z0, z1] of tiers.slice(0, -1)) prism(trim, null, chamfer(rect(TX - TH - 0.15, TY - TH - 0.15, TX + TH + 0.15, TY + TH + 0.15), 0.1), z1, z1 + 0.25)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const f: Face = { o: [TX + nx * TH, TY + ny * TH, 0], n: [nx, ny] }
    for (const [z0, z1] of tiers) {
      const w = z1 > 34 ? 1.8 : 1.7
      for (const s of [-2.1, 0, 2.1]) arch(win, f, s, w, z0 + 0.4, z1 - 0.3, 0.06)
    }
  }
  // eaves cornice and the red tile hip roof, the cross
  const ec = chamfer(rect(TX - TH - 1.0, TY - TH - 1.0, TX + TH + 1.0, TY + TH + 1.0), 0.15)
  prism(trim, trim, ec, TE - 0.5, TE)
  capRing(trim, ec, TE - 0.5, false)
  const R = TH + 1.0
  for (const [a, b, n] of [[[-1, -1], [1, -1], [0, -1]], [[1, -1], [1, 1], [1, 0]], [[1, 1], [-1, 1], [0, 1]], [[-1, 1], [-1, -1], [-1, 0]]] as [XY, XY, XY][]) {
    triO(roof, [TX + a[0] * R, TY + a[1] * R, TE], [TX + b[0] * R, TY + b[1] * R, TE], [TX, TY, TA], [n[0] * (TA - TE), n[1] * (TA - TE), R])
  }
  box(trim, TX - 0.13, TY - 0.13, TX + 0.13, TY + 0.13, TA - 0.3, TA + 2.4, trim)
  box(trim, TX - 0.65, TY - 0.13, TX + 0.65, TY + 0.13, TA + 1.5, TA + 1.75, trim)

  // ---------------------------------------------------------- materials and night
  const front = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] > FY - 2.5 && n[1] > 0.3 ? 1 : 0)
  const tower = (p: V3, n: V3) => (Math.abs(p[0] - TX) < TH + 1 && Math.abs(p[1] - TY) < TH + 1 && n[2] < 0.7 ? 0.9 : 0)
  const lit = (p: V3, n: V3) => Math.max(front(p, n), tower(p, n))
  return finishGlb('Cathedral of the Incarnation', [
    { part: wall, material: { ...finish('incarnation-stucco', 0xe0cc9e), floodlight: lit } },
    { part: trim, material: { ...finish('incarnation-trim', 0xf0e4c8), floodlight: lit } },
    { part: brick, material: { ...finish('incarnation-brick', 0xc98f70), floodlight: lit } },
    { part: roof, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: door, material: { name: 'entrance', color: 0x7c5f45, roughness: 0.7 } },
  ], { bearing: 329.2, height: TA + 2.4, replaces: ['way/543962489'] }, 5000)
}

if (import.meta.main) await writeModel('nash-cathedral-of-the-incarnation', build())
