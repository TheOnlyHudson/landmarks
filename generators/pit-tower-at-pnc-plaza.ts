/**
 * The Tower at PNC Plaza, Pittsburgh (Gensler, 2015) — original procedural
 * geometry, CC0-1.0.
 * bun generators/pit-tower-at-pnc-plaza.ts
 *
 * Map frame turned to the building: +y along bearing 27.5 (Fifth Avenue
 * front, north-north-east), +x along 117.5, z up, metres. BEARING 27.5: the
 * OSM edges run at 27.5/117.7/206.1/297.4°. Origin = centroid of the OSM
 * outline way/313513478, 40.440281, -80.000244.
 *
 * Identity, in order: the double-skin glass tower with a rounded corner at
 * Fifth and Wood; its dark louvred crown (the solar chimney) under a roof
 * that slopes down from that corner, highest at the north-west; the tall
 * glass sky-garden atrium just under the crown; the lower flat-topped slabs
 * stepping down on the east and south; the dark podium on the south-east.
 *
 * Evidence
 * - OSM way/313513478 (33 levels, height 166, material glass). wikidata
 *   Q7829752. Its footprint is the whole site, podium included.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019, after completion),
 *   0.5 m grid read in this frame (SCRATCH/work/pit-tower-at-pnc-plaza/
 *   lidar.json). Ground flat within 1 m. Measured above it: the main mass's
 *   roof a plane falling from ~166 m at the north-west corner to ~147 m at
 *   the east and ~146 m at its south-east edge; the east and south slabs flat
 *   at 136.5 m; a further strip on the south-west at 113.5 m; the podium
 *   14 m. The steps between them run on a diagonal (~23° off the grid), and
 *   the lidar east face sits ~3 m inside the OSM one (the model follows the
 *   lidar).
 * - Published: 545 ft (166 m), 33 floors (Wikipedia "Tower at PNC Plaza").
 * - Photos (Wikimedia Commons): "Tower at PNC Plaza as seen at Fifth at Wood
 *   in 2016.jpg" (Dllu, CC BY-SA 4.0) — the rounded corner and the sweep of
 *   the crown; "Pittsburgh-Downtown-2019-06-13-Tower-at-PNC-Plaza-01.jpg" and
 *   "Tower at PNC Plaza, 2020-10-08.jpg" (Cbaile19, CC0) — from Market
 *   Square: the louvred crown over the atrium, the lower slab beside it;
 *   "Tower at PNC Plaza, Pittsburgh, 2019-05-06.jpg" (Cbaile19, CC0) — from
 *   across the Monongahela: the sloping glazed roof and the steps;
 *   "Tower at PNC Plaza, 2020-11-12.jpg" (Cbaile19, CC0). No commercial
 *   imagery.
 *
 * Estimated: the atrium (102-128.5 m, on the west face) and the dark crown
 * (128.5 m to the roof) from the Market Square photos scaled by the 166 m
 * height; the west face's
 * gentle bulge (1.5 m) and the corner radius (6 m) from the OSM nodes and
 * the Dllu photo; trim lines every three floors standing for the mullions.
 * Left out: the louvre fins, the double skin's vent openings, the lobby
 * canopy.
 *
 * Night: office glass `window` (lower) and `window-3` (upper, lighter, from
 * 105 m), the atrium `window-2`, the sloped roof light silvery glass/metal, the crown louvres
 * stay dark (charcoal finish).
 *
 * Doubts: the south slabs' plan comes from lidar alone; no licensed photo
 * shows the south side close up.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-tower-at-pnc-plaza'
const ANCHOR: [number, number] = [40.440281, -80.000244]
const BEARING = 27.5

function build() {
  const glass = new Part(), upper = new Part(), atrium = new Part(), trim = new Part(), crown = new Part(), roof = new Part()
  const v = (p: XY, z: number): V3 => [p[0], p[1], z]

  // --- Plans (counter-clockwise). ---
  // Main mass: west face bulging gently, rounded north-west corner.
  const main: XY[] = [[-12.8, -15.1], [13, -4.5], [13, 26.5]]
  {
    const R = 6, c: XY = [-17.9 + R * 0, 26.5 - R] // corner centre below the north edge
    // north edge to the corner arc
    const cx = -16.5, cy = 20.5
    for (let i = 0; i <= 6; i++) {
      const a = Math.PI / 2 + (i / 6) * (Math.PI / 2 - 0.32)
      main.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
    }
    void c
    // west face: from the arc's end down to (-12.8,-15.1), bowed out 1.5 m
    const p0 = main[main.length - 1], p1: XY = [-12.8, -15.1]
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), n: XY = [dy / L, -dx / L]
    for (let i = 1; i < 6; i++) {
      const t = i / 6, b = 1.5 * Math.sin(Math.PI * t)
      main.push([p0[0] + dx * t + n[0] * b, p0[1] + dy * t + n[1] * b])
    }
  }
  const slab: XY[] = [[-12.8, -15.1], [-8, -23], [24, -9], [24.5, 26.5], [13, 26.5], [13, -4.5]]
  const strip: XY[] = [[-19, -18.3], [-12.8, -30.2], [-6.4, -26.9], [22, -12], [24, -9], [-8, -23], [-12.8, -15.1]]
  const podium: XY[] = [[-6.4, -26.9], [-3.5, -31.8], [26, -31.7], [26.2, -9], [24, -9], [22, -12]]

  const roofZ = (p: XY) => 167 - 0.54 * (p[0] + 22) - 0.3 * (25 - p[1])
  const ATRIUM0 = 102, CROWN0 = 128.5

  // --- Main mass: glass to 126, atrium band to 136, louvred crown to the sloping roof. ---
  // the upper third's glass reads lighter than the lower in every photo
  const UPPER0 = 105
  walls(glass, main, 0, ATRIUM0)
  // the sky-garden atrium glass on the Wood Street (west) face, plain glass elsewhere
  const WEST0 = 9 // main[9] is the arc's end; edges 9…last run down the west face
  for (let i = 0; i < main.length; i++) {
    const a = main[i], b = main[(i + 1) % main.length]
    ;(i >= WEST0 ? atrium : upper).quad(v(a, ATRIUM0), v(b, ATRIUM0), v(b, CROWN0), v(a, CROWN0))
  }
  for (let i = 0; i < main.length; i++) {
    const a = main[i], b = main[(i + 1) % main.length]
    crown.quad(v(a, CROWN0), v(b, CROWN0), v(b, roofZ(b)), v(a, roofZ(a)))
  }
  // sloping roof, inset under a 0.6 m lip so its edge reads
  {
    const ins = inset(main, 0.6)
    for (let i = 0; i < main.length; i++) {
      const a = main[i], b = main[(i + 1) % main.length], ia = ins[i], ib = ins[(i + 1) % main.length]
      crown.quad(v(a, roofZ(a)), v(b, roofZ(b)), v(ib, roofZ(ib) - 0.4), v(ia, roofZ(ia) - 0.4))
    }
    // fan from the centroid (the inset ring is star-shaped about it)
    const c: XY = [ins.reduce((s, p) => s + p[0], 0) / ins.length, ins.reduce((s, p) => s + p[1], 0) / ins.length]
    for (let i = 0; i < ins.length; i++) {
      const a = ins[i], b = ins[(i + 1) % ins.length]
      roof.tri(v(c, roofZ(c) - 0.4), v(a, roofZ(a) - 0.4), v(b, roofZ(b) - 0.4))
    }
  }

  // --- Lower slabs and podium. ---
  walls(glass, slab, 0, UPPER0)
  walls(upper, slab, UPPER0, 136.5)
  cap(roof, slab, 136.5)
  walls(glass, strip, 0, UPPER0)
  walls(upper, strip, UPPER0, 113.5)
  cap(roof, strip, 113.5)
  walls(crown, podium, 0, 14)
  cap(roof, podium, 14)

  // --- Trim: a pale line every three floors on every glass wall. ---
  const storey = 4.1
  const lines = (r: XY[], z0: number, z1: number) => {
    for (let z = z0 + 3 * storey; z < z1 - 1; z += 3 * storey) {
      for (let i = 0; i < r.length; i++) {
        const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L < 2) continue
        const n: XY = [(b[1] - a[1]) / L * 0.04, -(b[0] - a[0]) / L * 0.04]
        const A: XY = [a[0] + n[0], a[1] + n[1]], B: XY = [b[0] + n[0], b[1] + n[1]]
        trim.quad(v(A, z - 0.18), v(B, z - 0.18), v(B, z + 0.18), v(A, z + 0.18))
      }
    }
  }
  lines(main, 0, ATRIUM0)
  lines(slab, 0, 136.5)
  lines(strip, 0, 113.5)
  // a heavier frame line at the foot of the crown and of the atrium
  for (const z of [ATRIUM0]) {
    for (let i = 0; i < main.length; i++) {
      const a = main[i], b = main[(i + 1) % main.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [(b[1] - a[1]) / L * 0.05, -(b[0] - a[0]) / L * 0.05]
      const A: XY = [a[0] + n[0], a[1] + n[1]], B: XY = [b[0] + n[0], b[1] + n[1]]
      trim.quad(v(A, z - 0.4), v(B, z - 0.4), v(B, z + 0.4), v(A, z + 0.4))
    }
  }

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x7d95a9 } },
    { part: upper, material: windowVariant(3, 0xa9bfd1) },
    { part: atrium, material: windowVariant(2, 0xc3d2de) },
    { part: trim, material: finish('pnc-mullion', 0xd5dbe0, 0.5) },
    { part: crown, material: finish('pnc-louvre', 0x555c64) },
    { part: roof, material: { ...PALETTE.roof, color: 0xc8d2da } },
  ]
}

if (import.meta.main) await save(ID, 'The Tower at PNC Plaza', ANCHOR, BEARING, build(), 6500)
