/**
 * Union Pacific Depot (1909, D. J. Patterson; now the Asher Adams hotel),
 * Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-union-pacific-depot.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The depot faces east
 * down South Temple from the west side of 400 West. Origin: the centre of the
 * historic depot's building:parts (-111.903027, 40.769345), the middle of the
 * main hall. y = 0 is the ground; the site is flat (Mapterhorn, +-0.3 m).
 *
 * Form: a French Second Empire depot. A central hall (22.5 x 42.6 m) with
 * brick walls to 12 m and a tall, steep slate mansard to 21 m with a low
 * hipped top to 22 m; two square corner pavilions on the east front (9 x
 * 10.7 m, 9 m forward of the hall) with steep slate mansards to 18.8 m and
 * iron cresting; between them the entrance block, its upper storey of brick
 * with three tall round-arched windows, a stone entablature and balustrade,
 * a marquee canopy over the doors, and over it all the illuminated Union
 * Pacific shield on the roof. Two-storey wings run north and south (22.6 x
 * 39 m), sandstone ground storey and brick above, with low hipped slate
 * roofs and oculus dormers.
 *
 * Sources
 * - OSM (ODbL): the depot's building:parts with heights and roof shapes,
 *   way/1434756618, 1434756622-1434756646, 1434789543-1434789548, in the
 *   outline of relation/19669121 (Asher Adams, Q7405879), way/33148078.
 *   Heights used as tagged: hall walls 12, mansard 21, top 22; pavilions
 *   12 / 18.8; entrance block 12; canopy 5.5; wings 9 / 11.5 / 12.5.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Eric Pancer, "Salt Lake Union Pacific Railroad Station, South Temple at
 *     400 West ...jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Salt_Lake_Union_Pacific_Railroad_Station,_South_Temple_at_400_West,_Central_City_West,_Salt_Lake_City,_UT,_USA.jpg
 *     (east front: the pavilions, arched windows, shield, colours);
 *   SounderBruce, "Salt Lake City Union Pacific Depot (22260341348).jpg",
 *     CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Union_Pacific_Depot_(22260341348).jpg
 *     (east front square on: storey lines, the marquee, the wings);
 *   Jordan W., "Union Pacific Depot seen from LDS Church Office Building -
 *     panoramio.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Union_Pacific_Depot_seen_from_LDS_Church_Office_Building_-_panoramio.jpg
 *     (from the east, high: roof shapes and colours of hall and wings);
 *   HABS UT-38-2, "NORTH AND WEST SIDES - Union Passenger Station", public
 *     domain, https://commons.wikimedia.org/wiki/File:NORTH_AND_WEST_SIDES_-_Union_Passenger_Station,_Third_West_and_South_Temple,_Salt_Lake_City,_Salt_Lake_County,_UT_HABS_UTAH,18-SAlCI,25-2.tif
 *     (the north wing's hipped end and dormers, the west side).
 * Estimated from the photos: storey lines (sandstone ground storey to 4.5 m,
 *   wing cornice 8.4-9), window sizes and spacing, the shield (5.4 x 6.4 m),
 *   dormer sizes.
 * Left out: the "UNION PACIFIC" letters (a plain sign band), chimneys, the
 *   flagpole, the platform canopies on the west, the new hotel tower behind.
 * Doubts: the west side is from the HABS photo of the 1970s-80s only; the
 *   hotel conversion may have changed it.
 * Night: windows `window`; the shield is `neon-up-red` (it is lit).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, flatShape, extrudeShape, archShape, capRing, ccw, finishGlb, writeModel } from './sea-tacoma-union-station'

const GS = 4.5 // sandstone ground storey

/** A roof from an outer ring at z0 to an inner ring at z1 (both CCW, same corner count), capped. */
function hip(part: Part, outer: XY[], inner: XY[], z0: number, z1: number, cap = true) {
  part.loft([outer.map(([x, y]) => [x, y, z0] as V3), inner.map(([x, y]) => [x, y, z1] as V3)])
  if (cap) capRing(part, inner, z1)
}
const inset = (r: XY[], d: number): XY[] => {
  const xs = r.map((p) => p[0]), ys = r.map((p) => p[1])
  return rect(Math.min(...xs) + d, Math.min(...ys) + d, Math.max(...xs) - d, Math.max(...ys) - d)
}

function build() {
  const brick = new Part(), sand = new Part(), slate = new Part(), win = new Part(), red = new Part(), roofP = new Part()

  /** A window on a face: a stone sill and head, a glass panel; round-arched if `arched`. */
  const W = (f: Face, s: number, w: number, z0: number, z1: number, arched = false) => {
    if (arched) {
      flatShape(sand, f, archShape(s, w + 0.6, z0 - 0.2, z1 - w / 2, 10), 0.03)
      flatShape(win, f, archShape(s, w, z0, z1 - w / 2, 10), 0.07)
    } else {
      extrudeShape(sand, f, rect(s - w / 2 - 0.15, z0 - 0.3, s + w / 2 + 0.15, z0), 0, 0.12)
      extrudeShape(sand, f, rect(s - w / 2 - 0.2, z1, s + w / 2 + 0.2, z1 + 0.35), 0, 0.12)
      flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.05)
    }
  }
  /** An oculus dormer standing on a slope at (x, y), facing along n. */
  const dormer = (x: number, y: number, n: XY, z0: number, h: number, w = 1.8) => {
    const t: XY = [-n[1], n[0]], d = 1.6
    const c = (a: number, b: number): XY => [x + t[0] * a + n[0] * b, y + t[1] * a + n[1] * b]
    const r = [c(-w / 2, -d), c(w / 2, -d), c(w / 2, 0), c(-w / 2, 0)]
    const ring = ccw(r)
    prism(sand, null, ring, z0, z0 + h)
    hip(slate, ring, inset(ring, w / 2 - 0.05), z0 + h, z0 + h + 0.7)
    const f: Face = { o: [x, y, 0], n }
    flatShape(win, f, arc(0, z0 + h / 2 + 0.1, 0.55, 0, 360, 12).slice(0, -1).map(([a, b]) => [a, b] as XY), 0.04)
  }

  // ------------------------------------------------------------ central hall
  const hall = rect(-11.3, -21.3, 11.2, 21.3)
  prism(brick, null, hall, 0, 11.2)
  prism(sand, null, inset(hall, -0.08), 0, GS)
  prism(sand, null, inset(hall, -0.35), 11.0, 12.0) // the entablature
  hip(slate, inset(hall, -0.35), inset(hall, 4.2), 12.0, 21.0, false)
  {
    const top = inset(hall, 4.2) // x -7.1..7.0, y -17.1..17.1
    slate.loft([top.map(([x, y]) => [x, y, 21] as V3), [[-0.05, -10.1, 22], [0.05, -10.1, 22], [0.05, 10.1, 22], [-0.05, 10.1, 22]] as V3[]])
  }
  // west face of the hall (track side): tall arched windows
  for (const s of [-12, -6, 0, 6, 12]) W({ o: [-11.3, 0, 0], n: [-1, 0] }, s, 2.6, 5.6, 10.2, true)
  for (const s of [-12, -6, 0, 6, 12]) W({ o: [-11.3, 0, 0], n: [-1, 0] }, s, 2.2, 1.2, 3.8)
  // dormers on the hall's mansard: east over the sign band is the shield; west, north, south oculi
  for (const y of [-10, 0, 10]) dormer(-9.0, y, [-1, 0], 14.2, 2.0)
  for (const e of [-1, 1]) dormer(0, e * 19.0, [0, e], 14.2, 2.0)

  // ------------------------------------------------------------ east pavilions
  for (const e of [-1, 1]) {
    const y0 = e < 0 ? -21.3 : 10.5, y1 = e < 0 ? -10.6 : 21.3
    const pv = rect(11.1, y0, 20.1, y1)
    prism(brick, null, pv, 0, 11.2)
    prism(sand, null, inset(pv, -0.08), 0, GS)
    prism(sand, sand, inset(pv, -0.6), 11.0, 12.2)
    hip(slate, inset(pv, -0.35), inset(pv, 1.6), 12.2, 15.5, false)
    hip(slate, inset(pv, 1.6), inset(pv, 2.5), 15.5, 18.8)
    // iron cresting: a dark open crown on the flat top
    prism(slate, slate, inset(pv, 2.7), 18.8, 19.9)
    prism(slate, slate, inset(pv, 3.6), 19.9, 20.5)
    const ym = (y0 + y1) / 2
    const east: Face = { o: [20.1, ym, 0], n: [1, 0] }
    W(east, 0, 2.9, 5.6, 10.3)
    W(east, 0, 2.4, 1.0, 3.8)
    // sandstone quoins
    for (const s of [-5.1, 4.7]) extrudeShape(sand, east, rect(s, GS, s + 0.4, 11.0), 0, 0.1)
    // side faces of the pavilion: one window each storey
    const side: Face = { o: [15.6, e < 0 ? y0 : y1, 0], n: [0, e] }
    W(side, 0, 2.2, 5.6, 10.0)
    W(side, 0, 2.2, 1.0, 3.8)
    dormer(18.3, ym, [1, 0], 14.0, 2.0)
  }

  // ------------------------------------------------------------ entrance block between the pavilions
  {
    const eb = rect(11.1, -10.6, 17.9, 10.5)
    prism(brick, slate, eb, 0, 12.0)
    prism(sand, null, inset(eb, -0.08), 0, GS)
    prism(sand, null, inset(eb, -0.35), 10.8, 12.0)
    const f: Face = { o: [17.9, 0, 0], n: [1, 0] }
    for (const s of [-6.5, 0, 6.5]) W(f, s, 3.7, 5.8, 10.3, true)
    // the balustrade (solid) and the sign band over the entablature
    extrudeShape(sand, f, rect(-10.6, 12.0, 10.6, 13.2), -0.3, 0.05)
    extrudeShape(slate, f, rect(-8.5, 13.3, 8.5, 14.3), -0.5, -0.3) // the "UNION PACIFIC" sign band, set back
    // doors under the marquee
    for (const s of [-6.5, 0, 6.5]) flatShape(win, f, rect(s - 1.6, 0, s + 1.6, 3.6), 0.05)
    // the marquee canopy on brackets
    prism(sand, sand, rect(17.9, -10.2, 21.4, 10.2), 4.5, 5.5)
    capRing(sand, rect(17.9, -10.2, 21.4, 10.2), 4.5, false)
  }
  // the illuminated shield, standing over the balustrade in front of the mansard
  {
    const f: Face = { o: [12.2, 0, 0], n: [1, 0] }
    const sh: XY[] = [[-3.2, 21.2], [3.2, 21.2], [3.2, 17.0], [2.6, 15.4], [1.4, 14.3], [0, 13.6], [-1.4, 14.3], [-2.6, 15.4], [-3.2, 17.0]]
    extrudeShape(sand, f, sh, -0.5, 0.0)
    flatShape(red, f, sh.map(([a, b]) => [a * 0.9, 17.4 + (b - 17.4) * 0.92] as XY), 0.03)
    for (const s of [-1.9, -0.65, 0.65, 1.9]) flatShape(sand, f, rect(s - 0.3, 14.6, s + 0.3, 18.5), 0.06)
    flatShape(slate, f, rect(-2.8, 18.8, 2.8, 20.6), 0.06)
  }

  // ------------------------------------------------------------ wings
  for (const e of [-1, 1]) {
    const y0 = e < 0 ? -59.3 : 20.4, y1 = e < 0 ? -20.5 : 59.3
    const wg = rect(-11.3, y0, 11.3, y1)
    prism(brick, null, wg, 0, 8.4)
    prism(sand, null, inset(wg, -0.08), 0, 3.8)
    prism(sand, null, inset(wg, -0.3), 8.4, 9.0)
    // hipped at the far end, butting the hall at the near end
    const far = e < 0 ? y0 : y1, near = e < 0 ? y1 : y0
    const o: XY[] = e < 0 ? rect(-11.6, far - 0.3, 11.6, near) : rect(-11.6, near, 11.6, far + 0.3)
    const iy0 = e < 0 ? far + 5.0 : near, iy1 = e < 0 ? near : far - 5.0
    hip(roofP, o, rect(-6.3, iy0, 6.3, iy1), 9.0, 11.5, false)
    const jy0 = e < 0 ? far + 11.3 : near, jy1 = e < 0 ? near : far - 11.3
    roofP.loft([rect(-6.3, iy0, 6.3, iy1).map(([x, y]) => [x, y, 11.5] as V3), rect(-0.05, jy0, 0.05, jy1).map(([x, y]) => [x, y, 12.5] as V3)])
    // windows: east and west, seven bays; the far end, three bays
    const n = 7, len = y1 - y0
    for (const [fx, nx] of [[11.3, 1], [-11.3, -1]] as [number, number][]) {
      const f: Face = { o: [fx, (y0 + y1) / 2, 0], n: [nx, 0] }
      for (let i = 0; i < n; i++) {
        const s = (-len / 2 + (len / n) * (i + 0.5)) * nx
        W(f, s, 2.0, 4.6, 7.8)
        W(f, s, 2.0, 0.9, 3.0)
      }
      for (const k of [-1, 0, 1]) dormer(fx - nx * 2.8, (y0 + y1) / 2 + k * len * 0.28, [nx, 0], 9.8, 1.7, 1.6)
    }
    const fe: Face = { o: [0, far, 0], n: [0, e] }
    for (const s of [-6.5, 0, 6.5]) { W(fe, s, 2.0, 4.6, 7.8); W(fe, s, 2.0, 0.9, 3.0) }
    for (const s of [-4, 4]) dormer(s, far - e * 2.8, [0, e], 9.8, 1.7, 1.6)
  }

  return finishGlb('Union Pacific Depot', [
    { part: brick, material: finish('slc-up-brick', 0xb87561) },
    { part: sand, material: finish('slc-up-sandstone', 0xe3d6bd) },
    { part: slate, material: finish('slc-up-slate', 0x80837a) },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('neon-up-red', 0xc0443c) },
    { part: roofP, material: finish('slc-up-green-slate', 0x88a294) },
  ], { bearing: 0, height: 22, replaces: [] }, 5000)
}

if (import.meta.main) await writeModel('slc-union-pacific-depot', build())
