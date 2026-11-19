/**
 * Belle Isle Aquarium, Detroit (1904, Albert Kahn): procedural, CC0-1.0.
 * bun generators/det-belle-isle-aquarium.ts
 *
 * Map frame: x, y, z up, metres, turned to the building: +y runs along
 * bearing 342 (north-north-west, the long hall's axis), +x along 72. The
 * anchor is the centroid of the OSM outline way/107227742 (42.3362917,
 * -82.9851673). The entrance front faces +y (north-north-west); the square
 * central pavilion's -x side meets the conservatory's Show House.
 *
 * Identity, in order: a low red-brown brick building with pale limestone
 * quoins, plinth and cornice and grey-green metal hipped roofs; the carved
 * Baroque limestone frontispiece on the north front (a round-arched doorway
 * between banded columns, an entablature, a segmental pediment and a big
 * cartouche over the eaves), a large window either side of it; the long
 * hall behind (the green-tiled vault inside is not drawn), the taller square
 * central pavilion with its skylight, and the service block at the south.
 *
 * Evidence:
 *  - plan: OSM way/107227742 (Belle Isle Aquarium, building=public, brick,
 *    Q4883644). No building:part ways.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame. y = 0 is the ground at the south end; the north front's
 *    ground is ~0.6 m higher. Heights over y = 0: front block eaves ~6.4,
 *    ridge ~8.6; hall eaves ~5.7, ridge ~8.5; central pavilion eaves ~7.6,
 *    apex ~13.0 (its skylight lantern; the roof drawn to 11.4 under it); east annexe ~6.5; south block ~10.8 at its north ridge,
 *    ~5.0-7.0 to the south; its side wings ~2.5.
 *  - published: 1904, Albert Kahn; the oldest public aquarium building in
 *    the US; reopened 2012 (Wikipedia, "Belle Isle Aquarium").
 *  - photos: the front, frontispiece, windows, quoins and colours.
 *  Estimated: the frontispiece's proportions, the window sizes, the roof
 *  pitches between lidar points, the south block's roof split.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Belle_Isle_Aquarium_exterior.jpg, Rmhermen at English Wikipedia, CC
 *    BY-SA 3.0 (the north front, 2005)
 *  - The_Aquarium,_Belle_Isle_Park_(NBY_7732).jpg, Detroit Publishing Co.,
 *    public domain (the north front, 1908, before the roof was re-clad)
 *  - Front_View_of_Conservatory.JPG, JLHA3050, CC BY-SA 3.0 (the
 *    aquarium's west side and green roofs at the left of the frame)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only the north front is well photographed. The hall walls, the
 * east and south sides and the service block are drawn plain (brick, a
 * stone plinth and cornice), with no windows: none are shown in the
 * evidence. The roof colour follows the 2005 photo (pale green-grey metal);
 * the 1908 postcard shows red tile. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc } from './sea-tacoma-union-station'

/** A hipped roof over an axis-aligned plan from eave z0 to ridge z1, with overhang ov. */
function hip(roof: Part, soffit: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ov = 0.5) {
  const X0 = x0 - ov, X1 = x1 + ov, Y0 = y0 - ov, Y1 = y1 + ov
  const h = Math.min(X1 - X0, Y1 - Y0) / 2, cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2
  const rx = (X1 - X0) / 2 - h, ry = (Y1 - Y0) / 2 - h
  const a: V3 = [cx - rx, cy - ry, z1], b: V3 = [cx + rx, cy - ry, z1], c: V3 = [cx + rx, cy + ry, z1], d: V3 = [cx - rx, cy + ry, z1]
  const p0: V3 = [X0, Y0, z0], p1: V3 = [X1, Y0, z0], p2: V3 = [X1, Y1, z0], p3: V3 = [X0, Y1, z0]
  const face = (q: V3[]) => { if (Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1]) < 1e-3) roof.tri(q[0], q[1], q[2]); else roof.quad(q[0], q[1], q[2], q[3]) }
  face([p0, p1, b, a]); face([p1, p2, c, b]); face([p2, p3, d, c]); face([p3, p0, a, d])
  // the soffit under the overhang, and a fascia
  cap(soffit, rect(X0, Y0, X1, Y1), z0, false)
  walls(soffit, rect(X0, Y0, X1, Y1), z0 - 0.25, z0)
}

/** A brick block with a stone plinth and cornice band. */
function block(brick: Part, stone: Part, x0: number, y0: number, x1: number, y1: number, g: number, eave: number) {
  const r = rect(x0, y0, x1, y1)
  walls(stone, rect(x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1), 0, g + 0.8)
  walls(brick, r, g + 0.8, eave - 0.7)
  walls(stone, rect(x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12), eave - 0.7, eave)
}

/** Pale stone quoins up a corner: alternating long and short blocks on both faces. */
function quoins(stone: Part, x: number, y: number, sx: number, sy: number, z0: number, z1: number) {
  const n = Math.floor((z1 - z0) / 0.6)
  for (let k = 0; k < n; k++) {
    const za = z0 + k * 0.6 + 0.04, zb = za + 0.52, L = k % 2 ? 0.55 : 0.95
    // face along x (normal sy), and face along y (normal sx)
    const fy: Face = { o: [x, y, 0], n: [0, sy] }, fx: Face = { o: [x, y, 0], n: [sx, 0] }
    const sAlongFy = sx * sy // s runs (-n[1], n[0]); inward along x is -sx
    const sAlongFx = -sx * sy
    const ra: XY[] = [[0, za], [sAlongFy * L, za], [sAlongFy * L, zb], [0, zb]]
    const rb: XY[] = [[0, za], [sAlongFx * L, za], [sAlongFx * L, zb], [0, zb]]
    extrudeShape(stone, fy, ra, 0, 0.05, false)
    extrudeShape(stone, fx, rb, 0, 0.05, false)
  }
}

const archR = (sc: number, w: number, z0: number, zs: number, segs = 10): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()
  const FG = 0.6 // the north front's ground over y = 0

  // ------------------------------------------------ the north entrance block
  const FX0 = -8.1, FX1 = 6.4, FY0 = 32.0, FY1 = 40.7, FE = 6.4
  block(brick, stone, FX0, FY0, FX1, FY1, FG, FE)
  hip(roof, stone, FX0, FY0, FX1, FY1, FE, 8.6, 0.55)
  for (const [x, sx] of [[FX0, -1], [FX1, 1]] as [number, number][]) quoins(stone, x, FY1, sx, 1, FG + 0.8, FE - 0.7)
  const front: Face = { o: [0, FY1, 0], n: [0, 1] } // s = -x
  const C = -(FX0 + FX1) / 2 // the front's middle, in s
  // windows either side: big, with a stone sill and lintel
  for (const d of [-4.6, 4.6]) {
    flatShape(stone, front, [[C + d - 1.55, FG + 1.75], [C + d + 1.55, FG + 1.75], [C + d + 1.55, FG + 4.5], [C + d - 1.55, FG + 4.5]], 0.03)
    flatShape(win, front, [[C + d - 1.35, FG + 1.95], [C + d + 1.35, FG + 1.95], [C + d + 1.35, FG + 4.3], [C + d - 1.35, FG + 4.3]], 0.06)
  }
  // the frontispiece: a projecting stone frame, columns, arch, entablature, pediment, cartouche
  const P = 0.9, fW = 3.3, pf: Face = { o: [0, FY1 + P, 0], n: [0, 1] }
  extrudeShape(stone, front, [[C - fW, FG], [C + fW, FG], [C + fW, FE + 0.2], [C - fW, FE + 0.2]], 0, P)
  // the door in a round arch, with a deep pale reveal and voussoirs
  flatShape(stone, pf, archR(C, 3.5, FG, FG + 3.0, 10), 0.03)
  flatShape(door, pf, archR(C, 2.6, FG, FG + 3.0, 10), 0.07)
  // banded columns either side of the arch
  for (const d of [-2.55, 2.55]) {
    extrudeShape(stone, pf, [[C + d - 0.4, FG], [C + d + 0.4, FG], [C + d + 0.4, FE - 0.6], [C + d - 0.4, FE - 0.6]], 0, 0.35)
    for (let k = 0; k < 6; k++) {
      const z = FG + 0.6 + k * 0.75
      extrudeShape(stone, pf, [[C + d - 0.5, z], [C + d + 0.5, z], [C + d + 0.5, z + 0.28], [C + d - 0.5, z + 0.28]], 0.35, 0.45)
    }
  }
  // entablature and segmental pediment over the eaves
  extrudeShape(stone, pf, [[C - fW - 0.2, FE - 0.6], [C + fW + 0.2, FE - 0.6], [C + fW + 0.2, FE + 0.2], [C - fW - 0.2, FE + 0.2]], 0, 0.4)
  const R = 4.6, zc = FE + 0.2 - Math.sqrt(R * R - (fW + 0.2) ** 2)
  const a0 = (Math.acos((fW + 0.2) / R) * 180) / Math.PI
  const pedOuter: XY[] = [[C - fW - 0.2, FE + 0.2], [C + fW + 0.2, FE + 0.2], ...arc(C, zc, R, a0, 180 - a0, 8).slice(1, -1)]
  extrudeShape(stone, front, pedOuter, 0, P + 0.3)
  // the cartouche
  extrudeShape(stone, pf, [[C - 0.8, FE + 0.6], [C + 0.8, FE + 0.6], [C + 0.6, FE + 2.5], [C, FE + 2.9], [C - 0.6, FE + 2.5]], 0.3, 0.75)
  // the pediment's slopes and the frontispiece's sides back into the roof are covered by the extrusion

  // ------------------------------------------------ the long halls (north and south of the pavilion)
  const HX0 = -7.3, HX1 = 5.6
  for (const [y0, y1, g] of [[14.9, 32.2, FG], [-21.05, -3.6, 0.2]] as [number, number, number][]) {
    block(brick, stone, HX0, y0, HX1, y1, g, 5.7)
    hip(roof, stone, HX0, y0 - 0.6, HX1, y1 + 0.6, 5.7, 8.5, 0.45)
  }

  // ------------------------------------------------ the square central pavilion
  {
    const r: XY[] = [[-7.95, -3.55], [6.1, -4.1], [8.35, -2.2], [8.33, 12.6], [6.06, 14.94], [-7.97, 14.9], [-10.1, 12.62], [-10.15, -1.2]]
    walls(stone, r, 0, 1.2)
    walls(brick, r, 1.2, 6.9)
    walls(stone, r.map(([x, y]) => [x + (x > -1 ? 0.12 : -0.12), y + (y > 5.6 ? 0.12 : -0.12)] as XY), 6.9, 7.6)
    hip(roof, stone, -10.15, -4.1, 8.35, 14.94, 7.6, 11.4, 0.5)
    // the skylight lantern on the apex
    const cx = -0.9, cy = 5.4
    walls(stone, rect(cx - 1.8, cy - 1.8, cx + 1.8, cy + 1.8), 10.6, 12.4)
    walls(win, rect(cx - 1.65, cy - 1.65, cx + 1.65, cy + 1.65).map(([x, y]) => [x + Math.sign(x - cx) * 0.2, y + Math.sign(y - cy) * 0.2] as XY), 11.5, 12.25)
    hip(roof, stone, cx - 1.8, cy - 1.8, cx + 1.8, cy + 1.8, 12.4, 13.0, 0.25)
  }
  // the east annexe beside the pavilion
  block(brick, stone, 8.3, -1.05, 13.65, 12.6, 0.4, 5.5)
  hip(roof, stone, 8.3, -1.05, 13.65, 12.6, 5.5, 7.0, 0.4)

  // ------------------------------------------------ the south service block
  block(brick, stone, -8.5, -27.0, 7.5, -21.0, 0, 7.4)
  hip(roof, stone, -8.5, -27.0, 7.5, -21.0, 7.4, 10.8, 0.45)
  block(brick, stone, -8.5, -36.7, 7.5, -27.0, 0, 5.0)
  hip(roof, stone, -8.5, -36.7, 7.5, -27.0, 5.0, 7.2, 0.45)
  for (const [x0, x1] of [[-11.8, -8.5], [7.5, 11.12]]) {
    block(brick, stone, x0, -31.4, x1, -21.07, 0, 2.6)
    cap(roof, rect(x0, -31.4, x1, -21.07), 2.6)
  }

  return [
    { part: brick, material: finish('aquarium-brick', 0xa9705c) },
    { part: stone, material: finish('aquarium-limestone', 0xe3d8c2) },
    { part: roof, material: finish('aquarium-roof', 0x93a89d) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-belle-isle-aquarium', 'Belle Isle Aquarium', [42.3362917, -82.9851673], 342, build(), 5000)
