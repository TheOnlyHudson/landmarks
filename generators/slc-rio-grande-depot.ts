/**
 * Rio Grande Depot (Denver & Rio Grande Western station, 1910, Henry J.
 * Schlacks), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-rio-grande-depot.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The depot stands
 * across the west end of 300 South; its main front faces east up the street,
 * the track side faces west. Origin: the centre of the tall central block of
 * OSM way/33148441 (-111.904607, 40.762817). y = 0 is the ground (flat site).
 *
 * Form: a Beaux-Arts block 33.8 x 50.3 m, cream stone with dark brick panels
 * set between the piers, under a red tile hipped roof (to 28 m) with wide
 * eaves and a dark green soffit. Each long face (east and west) has three
 * huge round-arched windows over balustrades, between stone piers carrying
 * tall brick panels; a stone ground storey with three doors at each end and
 * three grilled windows in the middle; a stone frieze. On the roof the "Rio
 * Grande" sign on its open steel frame. Two-storey brick wings run north and
 * south (16 m, hipped tile roofs), set in from the central block. A flat
 * canopy on posts shelters the west (track) side of the central block.
 *
 * Sources
 * - OSM (ODbL): way/33148441 (outline, Rio Grande Depot, height 28,
 *   Q5259810) and parts way/1434218629-1434218638 (wings 16 m and 2 levels,
 *   central block 28 m and 3 levels), way/1434218628 (building=roof, 4 m:
 *   the west canopy).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Ron Reiring, "Salt Lake City D&RGW station.jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Salt_Lake_City_D%26RGW_station.jpg
 *     (east front square on: arches, piers, eave and roof proportions, sign);
 *   vxla, "Denver & Rio Grande Western Depot in SLC - Feb 3, 2011.jpg",
 *     CC BY 2.0, https://commons.wikimedia.org/wiki/File:Denver_%26_Rio_Grande_Western_Depot_in_SLC_-_Feb_3,_2011.jpg
 *     (east front close: doors, grilles, balustrades, colours);
 *   ATHNTKPhotography, "Denver and Rio Grande Western Depot (Salt Lake City)
 *     in June 2026 Right.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Denver_and_Rio_Grande_Western_Depot_(Salt_Lake_City)_in_June_2026_Right.jpg
 *     (west side from the plaza: the canopy, the same three arches, a wing).
 * Estimated from the photos (scaled to the 50.3 m front): eave 22 m, roof
 *   rise 6 m, arch windows 7.6 m wide from 8 to 17.9 m, ground storey 6.8 m;
 *   the sign frame 27 m wide and 4 m tall; wing eaves 11 m.
 * Left out: the inscription plinths, the flagpole, lamp posts. The sign's
 *   script letters are drawn as a plain gold board on the frame (not a
 *   traced script).
 * Doubts: the north and south ends of the central block (above the wings)
 *   and the wings' ends are in no photo used; drawn with the same piers and
 *   panels, without windows on the central block's ends.
 * Night: windows `window`; the sign board is `neon-rgd-gold` (lit).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, flatShape, extrudeShape, archShape, capRing, ccw, finishGlb, writeModel } from './sea-tacoma-union-station'

const HX = 16.9, HY = 25.15 // the central block
const EAVE = 22, TOPZ = 28

function hipRoof(part: Part, soffit: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, over: number) {
  const o = rect(x0 - over, y0 - over, x1 + over, y1 + over)
  prism(soffit, null, o, z - 0.5, z)
  capRing(soffit, o, z - 0.5, false)
  const hw = (x1 - x0) / 2 + over, cx = (x0 + x1) / 2
  const ridge: V3[] = [[cx - 0.05, y0 - over + hw, z + rise], [cx + 0.05, y0 - over + hw, z + rise], [cx + 0.05, y1 + over - hw, z + rise], [cx - 0.05, y1 + over - hw, z + rise]]
  part.loft([o.map(([x, y]) => [x, y, z] as V3), ridge])
}

function build() {
  const stone = new Part(), brick = new Part(), tile = new Part(), win = new Part(), dark = new Part(), gold = new Part()

  // ------------------------------------------------------------ central block
  prism(stone, null, rect(-HX, -HY, HX, HY), 0, EAVE)
  prism(stone, null, rect(-HX - 0.3, -HY - 0.3, HX + 0.3, HY + 0.3), 19.8, 21.6) // the frieze and cornice
  prism(stone, null, rect(-HX - 0.15, -HY - 0.15, HX + 0.15, HY + 0.15), 0, 0.9) // plinth
  hipRoof(tile, dark, -HX, -HY, HX, HY, EAVE, TOPZ - EAVE, 2.0)

  // long faces: east (s = y) and west (s = -y)
  for (const nx of [1, -1]) {
    const f: Face = { o: [nx * HX, 0, 0], n: [nx, 0] }
    const arches = [-15.65, 0, 15.65]
    for (const c of arches) {
      extrudeShape(stone, f, archShape(c, 8.8, 7.8, 14.1, 12), 0, 0.12) // the stone surround
      flatShape(win, f, archShape(c, 7.6, 8.1, 14.1, 12), 0.16)
      // a few bold glazing bars: two mullions and a transom
      for (const s of [c - 1.3, c + 1.3]) flatShape(stone, f, rect(s - 0.12, 8.1, s + 0.12, 17.4), 0.2)
      flatShape(stone, f, rect(c - 3.8, 13.9, c + 3.8, 14.15), 0.2)
      extrudeShape(stone, f, rect(c - 4.4, 6.8, c + 4.4, 8.1), 0, 0.45) // balustrade
      // the dark brick "zipper" strips flanking the arch
      for (const d of [-5.2, 5.2]) extrudeShape(brick, f, rect(c + d - 0.22, 7.0, c + d + 0.22, 19.4), 0, 0.05)
    }
    // brick panels on the piers
    for (const s of [-7.8, 7.8]) extrudeShape(brick, f, rect(s - 1.25, 8.2, s + 1.25, 19.4), 0, 0.06)
    for (const s of [-22.9, 22.9]) extrudeShape(brick, f, rect(s - 0.9, 8.2, s + 0.9, 19.4), 0, 0.06)
    // small windows on the inner piers
    for (const s of [-7.8, 7.8]) flatShape(win, f, rect(s - 0.6, 9.0, s + 0.6, 10.8), 0.1)
    // ground storey: three doors under each outer arch, three grilles under the middle one
    for (const c of [-15.65, 15.65]) {
      for (const d of [-2.9, 0, 2.9]) {
        flatShape(brick, f, rect(c + d - 1.0, 0.9, c + d + 1.0, 3.9), 0.06) // wooden doors
        flatShape(win, f, rect(c + d - 1.0, 4.1, c + d + 1.0, 5.6), 0.06)
      }
    }
    for (const d of [-3.2, 0, 3.2]) flatShape(win, f, rect(d - 1.2, 2.0, d + 1.2, 5.2), 0.06)
    extrudeShape(stone, f, rect(-HY, 6.3, HY, 6.8), 0, 0.3) // the string course
  }
  // the short ends, above and beside the wings: piers and brick panels
  for (const ny of [1, -1]) {
    const f: Face = { o: [0, ny * HY, 0], n: [0, ny] }
    for (const s of [-11.5, -3.8, 3.8, 11.5]) extrudeShape(brick, f, rect(s - 1.2, 8.2, s + 1.2, 19.4), 0, 0.06)
  }

  // ------------------------------------------------------------ the sign on the roof
  {
    const x0 = -1.4, x1 = 1.4, y0 = -13.5, y1 = 13.5, z0 = TOPZ - 0.6, z1 = TOPZ + 3.8, b = 0.22
    const bar = (a: XY, c: XY, za: number, zb: number) => prism(dark, dark, ccw(rect(Math.min(a[0], c[0]) - b, Math.min(a[1], c[1]) - b, Math.max(a[0], c[0]) + b, Math.max(a[1], c[1]) + b)), za, zb)
    for (const y of [y0, -6.75, 0, 6.75, y1]) for (const x of [x0, x1]) bar([x, y], [x, y], z0 - 1.5, z1)
    for (const z of [z0 + 0.6, z1 - b * 2]) {
      for (const x of [x0, x1]) bar([x, y0], [x, y1], z, z + b * 2)
      for (const y of [y0, y1]) bar([x0, y], [x1, y], z, z + b * 2)
    }
    // the letters, as a gold board on the frame's east face
    prism(gold, gold, rect(x1 + 0.1, -12.2, x1 + 0.35, 12.2), z1 + 0.2, z1 + 2.2)
  }

  // ------------------------------------------------------------ the wings
  for (const e of [-1, 1]) {
    const [x0, x1] = e > 0 ? [-10.8, 11.3] : [-11.8, 12.1]
    const y0 = e > 0 ? HY : -64.75, y1 = e > 0 ? 64.15 : -HY
    prism(brick, null, rect(x0, y0, x1, y1), 0, 11)
    prism(stone, null, rect(x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12), 0, 1.2)
    prism(stone, null, rect(x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25), 10.4, 11.0)
    prism(stone, null, rect(x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1), 5.3, 5.8)
    // hipped at the far end; the near end runs into the central block
    const over = 1.2
    const yn0 = e > 0 ? y0 - 6 : y0, yn1 = e > 0 ? y1 : y1 + 6
    hipRoof(tile, dark, x0, yn0, x1, yn1, 11, 5, over)
    const len = y1 - y0, n = 8
    for (const [fx, nx] of [[x1, 1], [x0, -1]] as [number, number][]) {
      const f: Face = { o: [fx, (y0 + y1) / 2, 0], n: [nx, 0] }
      for (let i = 0; i < n; i++) {
        const s = (-len / 2 + (len / n) * (i + 0.5)) * nx
        for (const [z0, z1] of [[1.8, 4.7], [6.4, 9.6]]) {
          extrudeShape(stone, f, rect(s - 1.05, z0 - 0.25, s + 1.05, z1 + 0.25), 0, 0.06)
          flatShape(win, f, rect(s - 0.8, z0, s + 0.8, z1), 0.09)
        }
      }
    }
    const far = e > 0 ? y1 : y0
    const fe: Face = { o: [(x0 + x1) / 2, far, 0], n: [0, e] }
    for (const s of [-6.6, -2.2, 2.2, 6.6]) for (const [z0, z1] of [[1.8, 4.7], [6.4, 9.6]]) {
      extrudeShape(stone, fe, rect(s - 1.05, z0 - 0.25, s + 1.05, z1 + 0.25), 0, 0.06)
      flatShape(win, fe, rect(s - 0.8, z0, s + 0.8, z1), 0.09)
    }
  }

  // ------------------------------------------------------------ the west canopy on posts
  {
    const r = rect(-29.3, -24.6, -HX, 24.6)
    prism(dark, tile, r, 4.0, 5.1)
    capRing(dark, r, 4.0, false)
    for (let y = -21.0; y <= 21.1; y += 6.0) prism(dark, null, rect(-29.0, y - 0.25, -28.5, y + 0.25), 0, 4.0)
  }

  return finishGlb('Rio Grande Depot', [
    { part: stone, material: finish('slc-rgd-stone', 0xece4d4) },
    { part: brick, material: finish('slc-rgd-brick', 0x925548) },
    { part: tile, material: finish('slc-rgd-tile', 0xbd6f55) },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('slc-rgd-soffit', 0x5e6b62) },
    { part: gold, material: finish('neon-rgd-gold', 0xd9b24a) },
  ], { bearing: 0, height: TOPZ + 5.4, replaces: ['way/33148441'] }, 5000)
}

if (import.meta.main) await writeModel('slc-rio-grande-depot', build())
