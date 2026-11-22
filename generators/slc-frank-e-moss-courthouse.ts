/**
 * Frank E. Moss United States Courthouse (1905 post office by James Knox
 * Taylor, rebuilt and extended 1932 by James A. Wetmore), 350 S Main
 * Street, Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-frank-e-moss-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM way/33193718 (-111.8916783, 40.7612694), a 55 x 81 m
 * rectangle; the plan is written in a frame 5.2 m west and 7.8 m north of
 * it and shifted at the end. y = 0 is the lowest ground, at the south-east
 * corner (lidar); the ground rises about 2 m to the north.
 *
 * Form (lidar plan, photos): a granite block with a flat roof behind an
 * attic, two light courts roofed over at the first floor; along Main Street
 * (east) a giant colonnade of fluted columns on a rusticated base between
 * two solid corner pavilions, its entablature carrying a balustrade, the
 * wall behind it glazed in tall two-storey windows with ornamental
 * spandrels; the side and back walls with tall windows in pairs over a
 * ground-floor band; a mechanical penthouse at the south-west.
 *
 * Heights, lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013), above
 * the south-east ground: main roof and attic 21-23 (measured, 21 drawn with
 * a parapet to 22.4); the colonnade's balustrade 17-18 (measured); light
 * court roofs 9 (measured); penthouse 28 and stair tower 25 (measured).
 * Estimated from t and p3: the base 4.3, columns 4.3-16.0 with capitals to
 * 16.8, the entablature to 17.2; about 15 bays at 4.4 m.
 * Left out: the flutes, the Ionic volutes, the carved spandrel panels'
 * detail and the inscriptions.
 *
 * Photos (EVIDENCE):
 *  t  https://commons.wikimedia.org/wiki/File:TRAX_courthouse.jpg
 *     Cool Hand Luke (Wikimedia Commons uploader), CC BY-SA 3.0 (the Main Street colonnade, from Main Street)
 *  p3 https://commons.wikimedia.org/wiki/File:Frank_E._Moss_Federal_Courthouse_(3).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the colonnade and a corner pavilion, from the sidewalk)
 *  p1 https://commons.wikimedia.org/wiki/File:Frank_E._Moss_Federal_Courthouse_(1).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the base and the column feet along Main Street)
 * Doubts: the west and north faces are unphotographed (drawn like the
 * south one); the courts' exact outlines are from the 1 m lidar grid.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { poly, rect, prism, box, opening, ngon, bar, type XY } from './slc-cathedral-of-the-madeleine'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
const X0 = -22.3, X1 = 31.0, XC = 35.3, Y0 = -48.4, Y1 = 32.8
const Z_ROOF = 21.0, Z_PAR = 22.4

// ------------------------------------------------- the main block ---
prism(stone, rect(X0, Y0, X1, Y1), 0, Z_ROOF, false)
// roof tiles round the two light courts (x -2..16 y 8..19, x -2..13 y -25..-11)
const C1 = [-2.0, 8.0, 16.0, 19.0], C2 = [-2.0, -25.0, 13.0, -11.0]
const tile = (x0: number, y0: number, x1: number, y1: number) => poly(roof, rect(x0, y0, x1, y1).map(([x, y]) => [x, y, Z_ROOF] as V3), [0, 0, 1])
tile(X0, Y0, -2.0, Y1); tile(16.0, Y0, X1, Y1)
tile(-2.0, 19.0, 16.0, Y1); tile(-2.0, -11.0, 16.0, 8.0); tile(-2.0, Y0, 16.0, -25.0); tile(13.0, -25.0, 16.0, -11.0)
for (const [x0, y0, x1, y1] of [C1, C2]) {
  // inward-facing court walls and the low roof
  const r = rect(x0, y0, x1, y1)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    poly(stone, [[a[0], a[1], 9.0], [b[0], b[1], 9.0], [b[0], b[1], Z_ROOF], [a[0], a[1], Z_ROOF]], [-(b[1] - a[1]), b[0] - a[0], 0])
  }
  poly(roof, r.map(([x, y]) => [x, y, 9.0] as V3), [0, 0, 1])
}
// the attic parapet and cornice
prism(trim, rect(X0 - 0.4, Y0 - 0.4, X1 + 0.4, Y1 + 0.4), Z_ROOF - 1.4, Z_ROOF - 0.8, true, true)
for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const d = 0.5
  poly(trim, [[a[0], a[1], Z_ROOF], [b[0], b[1], Z_ROOF], [b[0], b[1], Z_PAR], [a[0], a[1], Z_PAR]], [n[0], n[1], 0])
  poly(trim, [[a[0] - n[0] * d, a[1] - n[1] * d, Z_PAR], [b[0] - n[0] * d, b[1] - n[1] * d, Z_PAR], [b[0] - n[0] * d, b[1] - n[1] * d, Z_ROOF], [a[0] - n[0] * d, a[1] - n[1] * d, Z_ROOF]], [-n[0], -n[1], 0])
  poly(trim, [[a[0], a[1], Z_PAR], [b[0], b[1], Z_PAR], [b[0] - n[0] * d, b[1] - n[1] * d, Z_PAR], [a[0] - n[0] * d, a[1] - n[1] * d, Z_PAR]], [0, 0, 1])
}
// a ground-floor band and string course on every face
box(trim, (X0 + X1) / 2, (Y0 + Y1) / 2, (X1 - X0) / 2 + 0.15, (Y1 - Y0) / 2 + 0.15, 4.0, 4.5, false)

/** Tall paired windows over ground-floor ones along a face. */
function sideWindows(a: XY, b: XY, bay: number, skip0 = 0, skip1 = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const k = Math.floor((L - skip0 - skip1) / bay), s0 = skip0 + (L - skip0 - skip1 - k * bay) / 2
  for (let j = 0; j < k; j++) {
    const o: XY = [a[0] + t[0] * (s0 + (j + 0.5) * bay), a[1] + t[1] * (s0 + (j + 0.5) * bay)]
    opening(win, o, t, n, bay * 0.45, 5.4, 15.4, 'flat', 0.05)
    opening(trim, o, t, n, bay * 0.45 + 0.1, 9.9, 10.9, 'flat', 0.07)
    opening(win, o, t, n, bay * 0.4, 1.4, 3.4, 'flat', 0.05)
  }
}
sideWindows([X0, Y0], [X1, Y0], 4.4, 1.5, 3.0)
sideWindows([X1, Y1], [X0, Y1], 4.4, 3.0, 1.5)
sideWindows([X0, Y1], [X0, Y0], 4.4, 2.0, 2.0)

// ------------------------------------------- the Main Street front ---
const CY0 = -40.0, CY1 = 25.6
// corner pavilions, flush with the colonnade's front
for (const [y0, y1] of [[Y0, CY0], [CY1, Y1]]) {
  prism(stone, rect(X1 - 0.1, y0, XC, y1), 0, Z_ROOF, false)
  poly(roof, rect(X1 - 0.1, y0, XC, y1).map(([x, y]) => [x, y, Z_ROOF] as V3), [0, 0, 1])
  prism(trim, rect(X1, y0 - 0.4, XC + 0.4, y1 + 0.4), Z_ROOF - 1.4, Z_ROOF - 0.8, true, true)
  prism(trim, rect(X1, y0, XC, y1), Z_ROOF, Z_PAR, true)
  const o: XY = [XC, (y0 + y1) / 2]
  opening(trim, o, [0, 1], [1, 0], 3.4, 5.2, 15.8, 'flat', 0.04)
  opening(win, o, [0, 1], [1, 0], 2.6, 5.6, 9.8, 'flat', 0.07)
  opening(win, o, [0, 1], [1, 0], 2.6, 11.0, 15.4, 'flat', 0.07)
  opening(door, o, [0, 1], [1, 0], 2.4, 0.8, 3.8, 'flat', 0.07)
  // the end bays' columns in antis and round-headed windows on the side faces
  for (const [yy, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    if ((s < 0 && y0 !== Y0) || (s > 0 && y1 !== Y1)) continue
    const oo: XY = [(X1 + XC) / 2 - 1.2, yy]
    opening(win, oo, [s < 0 ? 1 : -1, 0], [0, s], 2.2, 5.6, 15.0, 'round', 0.05)
  }
}
// the rusticated base, the wall behind the columns, columns, entablature, balustrade
prism(stone, rect(X1, CY0, XC + 0.6, CY1), 0, 4.3, true)
{
  const n = 15, bay = (CY1 - CY0) / n
  for (let j = 0; j < n; j++) {
    const yc = CY0 + (j + 0.5) * bay
    // tall windows with an ornamental spandrel between the two storeys
    opening(win, [X1, yc], [0, 1], [1, 0], bay * 0.55, 5.2, 9.6, 'flat', 0.05)
    opening(trim, [X1, yc], [0, 1], [1, 0], bay * 0.55, 9.6, 11.0, 'flat', 0.05)
    opening(win, [X1, yc], [0, 1], [1, 0], bay * 0.55, 11.0, 15.4, 'flat', 0.05)
    if (j > 0) {
      const y = CY0 + j * bay, cx = XC - 0.9
      trim.loft([ngon(cx, y, 0.85, 4.3, 12, 0), ngon(cx, y, 0.85, 4.7, 12, 0), ngon(cx, y, 0.72, 4.7, 12, 0), ngon(cx, y, 0.66, 16.0, 12, 0)])
      box(trim, cx, y, 0.95, 0.95, 16.0, 16.8, false)
    }
  }
  box(trim, (X1 + XC) / 2, (CY0 + CY1) / 2, (XC - X1) / 2, (CY1 - CY0) / 2, 16.8, 17.4, true)
  poly(trim, [[XC + 0.05, CY0, 16.8], [XC + 0.05, CY1, 16.8], [XC + 0.05, CY1, 17.4], [XC + 0.05, CY0, 17.4]], [1, 0, 0])
  // balustrade: a rail on posts, drawn as a band with dark gaps between dies
  prism(trim, rect(XC - 0.4, CY0, XC, CY1), 17.4, 18.6, true)
  for (let y = CY0 + bay; y < CY1 - 0.1; y += bay) box(trim, XC - 0.2, y, 0.3, 0.35, 17.4, 18.9)
  for (let j = 0; j < n; j++) {
    const yc = CY0 + (j + 0.5) * bay
    bar(roof, [XC, yc], [0, 1], [1, 0], -bay * 0.3, 17.75, bay * 0.3, 17.75, 0.35, 0.03)
  }
  // a doorway in the middle bay
  opening(door, [X1, CY0 + 7.5 * bay], [0, 1], [1, 0], 2.6, 4.3, 8.2, 'flat', 0.08)
}

// ------------------------------------------- penthouse and tower ---
prism(stone, rect(13.0, -45.0, 25.0, -36.0), Z_ROOF, 28.0, false)
poly(roof, rect(13.0, -45.0, 25.0, -36.0).map(([x, y]) => [x, y, 28.0] as V3), [0, 0, 1])
prism(stone, rect(19.5, 27.0, 25.0, 32.0), Z_ROOF, 25.5, false)
poly(roof, rect(19.5, 27.0, 25.0, 32.0).map(([x, y]) => [x, y, 25.5] as V3), [0, 0, 1])

// ---------------------------------------------------- shift and output ---
const parts = [stone, trim, roof, win, door]
for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= 5.2; p.pos[i + 2] -= 7.8 }
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : n[0] > 0.5 ? 0.8 : 0.3)
const out = [
  { part: stone, material: { ...finish('moss-granite', 0xd4d5d0), floodlight: flood } },
  { part: trim, material: { ...finish('moss-granite-light', 0xeaeae5), floodlight: flood } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('moss-bronze-door', 0x8a7a62) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Frank E. Moss United States Courthouse', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 28.0,
})
await Bun.write(new URL('../models/slc-frank-e-moss-courthouse.glb', import.meta.url), glb)
console.log(`slc-frank-e-moss-courthouse.glb: ${triangles} triangles, ${glb.length} bytes`)
