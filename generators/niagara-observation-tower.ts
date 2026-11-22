/**
 * Prospect Point Observation Tower (1961; reclad 1990s), Niagara Falls
 * State Park, Niagara Falls, New York: procedural, CC0-1.0.
 * bun generators/niagara-observation-tower.ts
 *
 * Map frame: x towards the cliff (bearing 122, east-south-east), y along
 * the gorge (bearing 32), z up, metres, turned to bearing 32, the sides of
 * the OSM outline way/241500748. Anchor = that outline's centroid,
 * 43.086938, -79.068807. y = 0 is the lowest ground under the plan: the
 * talus at the gorge bottom under the platform's tip, G = 4.5 m above
 * the river; every height below is written above the river and drawn
 * G lower.
 *
 * Identity: a slender green glass elevator shaft with stepped corners on
 * a stone plinth, standing at the foot of the American gorge wall beside
 * the American Falls; at the top a steel platform cantilevered out over
 * the river, and a steel walkway bridge on a haunched girder back to the
 * cliff top in Prospect Point park.
 *
 * Evidence:
 * - plan: OSM way/241500748 (height=86; a stepped cross, 17 x 13 m),
 *   drawn as the stone plinth's outline; the glass shaft is that cross
 *   at 0.7 scale (12 x 9.4 m), as the photos show it slender (about 1:6)
 *   and the lidar top is about 10 m across.
 * - heights: USGS 3DEP lidar NY_3County_2019 (2019 flight), a 100 m crop
 *   at 0.5 m read in this frame: the platform and walkway at 68.8 m above
 *   the river, 12 m wide, from x -28 over the gorge to past x 28; the
 *   shaft's top 78.8 m over its middle (about 10 x 10 m); the ground at
 *   the shaft's foot 8.5-13 m, under the platform's tip 4.6 m. Mapterhorn
 *   puts the cliff top at x 40-45, 62-65 m. OSM's 86 m is not borne out
 *   (the lidar top is 78.8 m above the river, 70 m above the foot).
 * - photos (Wikimedia Commons), EVIDENCE:
 *   - "Prospect Point Observation Tower - Niagra Falls.jpg", APK, CC BY-SA
 *     4.0 (from the river, west)
 *   - "Prospect Point Observation Tower.jpg", Buffalutheran, CC0 (from
 *     the north, the platform and the walkway)
 *   - "Prospect Point Park observation tower in 2011.jpg", High Contrast,
 *     CC BY 3.0 de (from the cliff, the girders under the walkway)
 *   - "Niagara Falls observatory tower.JPG", Don-vip, CC BY-SA 3.0 (from
 *     the river)
 *
 * Estimated: the plinth (about 4 m over the foot, from the photos), the girders' depth (8 m
 * at the shaft), the platform's taper, the walkway's landing on the cliff
 * top (a pier at x 45). Left out: railings, the glazing grid, the
 * elevator machinery, the stair and the Maid of the Mist landing.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, walls, save, type XY } from './chi-aon-center'
import { densify, rect } from './niagara-table-rock-centre'

const G = 4.5 // the lowest ground under the plan, above the river

/** A deck slab from x0 to x1, half-width w0 at x0 and w1 at x1, top at z, `t` thick. */
function slab(p: Part, top: Part, x0: number, x1: number, w0: number, w1: number, z: number, t: number) {
  const r: XY[] = [[x0, -w0], [x1, -w1], [x1, w1], [x0, w0]]
  walls(p, r, z - t, z)
  cap(top, r, z)
  cap(p, r, z - t, false)
}

/**
 * A haunched girder under a deck, from x0 (at the shaft, depth d0) to x1
 * (depth d1), half-width w, its soffit curved; top at z.
 */
function girder(p: Part, x0: number, x1: number, w: number, z: number, d0: number, d1: number, n = 8) {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    return [x0 + (x1 - x0) * t, z - (d1 + (d0 - d1) * (1 - t) * (1 - t))] as [number, number]
  })
  const dir = x1 > x0 ? 1 : -1
  for (let i = 0; i < n; i++) {
    const [xa, za] = pts[i], [xb, zb] = pts[i + 1]
    // the two sides and the soffit
    const s1: V3[] = [[xa, -w, za], [xb, -w, zb], [xb, -w, z], [xa, -w, z]]
    const s2: V3[] = [[xb, w, zb], [xa, w, za], [xa, w, z], [xb, w, z]]
    if (dir > 0) { p.quad(s1[0], s1[1], s1[2], s1[3]); p.quad(s2[0], s2[1], s2[2], s2[3]) } else { p.quad(s1[1], s1[0], s1[3], s1[2]); p.quad(s2[1], s2[0], s2[3], s2[2]) }
    const so: V3[] = [[xa, w, za], [xb, w, zb], [xb, -w, zb], [xa, -w, za]]
    if (dir > 0) p.quad(so[0], so[1], so[2], so[3]); else p.quad(so[1], so[0], so[3], so[2])
  }
  // the end face at x1
  const [xe, ze] = pts[n]
  const e: V3[] = [[xe, -w, ze], [xe, w, ze], [xe, w, z], [xe, -w, z]]
  if (dir > 0) p.quad(e[0], e[1], e[2], e[3]); else p.quad(e[1], e[0], e[3], e[2])
}

function build() {
  const glass = new Part(), stone = new Part(), steel = new Part(), deck = new Part(), trim = new Part()
  const z = (h: number) => h - G

  // --- the shaft: OSM's stepped cross, counter-clockwise
  const cross: XY[] = ([
    [-2.8, 6.4], [3.3, 6.4], [3.3, 4.9], [5.9, 4.9], [5.9, 3.1], [8.5, 3.1], [8.5, -2.9], [5.9, -2.9], [5.9, -4.7],
    [3.3, -4.7], [3.3, -6.5], [-2.8, -6.5], [-2.8, -4.8], [-5.6, -4.8], [-5.6, -3.0], [-8.3, -3.0], [-8.3, 3.0], [-5.6, 3.0], [-5.6, 4.8], [-2.8, 4.8],
  ] as XY[]).reverse().map(([x, y]) => [x * 0.7, y * 0.72] as XY) // the glass shaft, inside the plinth's outline
  // the stone plinth to about 4 m over the foot (14 m above the river)
  const plinth = chamfer(rect(-8.4, -6.5, 8.6, 6.4), 1.0) // OSM's outline
  block(stone, stone, densify(plinth, 5), 0, z(14), 0.4)
  // the glass shaft; its stepped arms stop a storey over the walkway, the core runs on to the top
  walls(glass, cross, z(14), z(71.5))
  const core = rect(-3.9, -3.5, 4.1, 3.5)
  cap(trim, cross, z(71.5))
  walls(glass, core, z(71.5), z(78.2))
  block(trim, trim, core, z(78.2), z(78.8), 0.2)

  // --- the platform cantilevered over the river and the walkway bridge to the cliff top
  const D = 68.8
  slab(steel, deck, -28, -5.8, 3.6, 6, z(D), 1.2) // tapering to the tip
  slab(steel, deck, 6, 45, 5, 5, z(D), 1.2)
  girder(steel, -5.8, -27, 2.4, z(D - 1.2), 7, 0.6)
  girder(steel, 6, 44, 2.4, z(D - 1.2), 8, 0.8)
  // low parapets along the edges, pale
  for (const [x0, x1, w0, w1] of [[-28, -5.8, 3.6, 6], [6, 45, 5, 5]] as [number, number, number, number][]) {
    for (const s of [-1, 1]) {
      const a: V3 = [x0, s * w0, z(D)], b: V3 = [x1, s * w1, z(D)]
      const A: V3 = [a[0], a[1], z(D + 1.1)], B: V3 = [b[0], b[1], z(D + 1.1)]
      trim.quad(a, b, B, A); trim.quad(b, a, A, B)
    }
  }
  // the landing pier on the cliff top
  block(stone, stone, rect(43, -5.5, 48, 5.5), z(52), z(D - 1.2), 0.3)

  return [
    { part: glass, material: finish('window', 0x6c9e95) },
    { part: stone, material: finish('tower-stone', 0xd8cbbd) },
    { part: steel, material: finish('tower-steel', 0x8d9a98) },
    { part: deck, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('niagara-observation-tower', 'Prospect Point Observation Tower', [43.086938, -79.068807], 32, build())
