/**
 * Delta Center (1991, formerly the Delta Center / EnergySolutions Arena /
 * Vivint Arena), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-delta-center.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, built square to the arena and placed at
 * bearing 45: model +y (north) is real north-east, the main front with the
 * big entrance canopy on the plaza at South Temple and 300 West; model +x is
 * real south-east (300 West side). Origin: the centre of the main block of
 * OSM way/23335190 (-111.901113, 40.768258). y = 0 is the lowest ground the
 * footprint touches: the service pit on the south-west (model south) side.
 *
 * Form (OSM building:parts, NAIP, photos): a 107 x 119 m flat-topped box of
 * pale grey precast (10 levels); on each face a central block 9 m deep and
 * one storey lower carrying the facade (9 levels); the box's corner bays are
 * blue-green curtain glass from the plaza up to about 23 m; the central
 * blocks have a tall recessed glass entrance storey, two horizontal glass
 * bands and a solid precast top band with two dark screen panels; low glass
 * vestibules in the middle of the north-west and south-east faces, a low
 * service block on the south-west; a small raised lantern in the middle of
 * the roof, which is covered in solar panels in four quadrants round a
 * cross of walkways; and on the north-east front the big flat white canopy
 * (2023) over the plaza entrance, 67 x 24.5 m.
 *
 * Sources
 * - OSM (ODbL): way/23335190 (outline, Delta Center, Q82294) and its parts
 *   way/735253949 (main, 10 levels), 735253950-953 (9-level front blocks),
 *   735253954-956 (1-level blocks), 735253957 (the canopy, levels 2-3),
 *   735253958 (11 levels, the roof lantern).
 * - USGS NAIP (public domain): roof plan, solar panel quadrants, lantern,
 *   the canopy's outline.
 * - Mapterhorn terrain: the plaza on the north-west, north-east and south-east
 *   sides about 9 m above the service pit by the south-west face.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Eyezak mad, "Delta Center with Arena Station.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Delta_Center_with_Arena_Station.jpg
 *     (drone from the north-east: canopy, front block, glass corners, solar roof, lantern);
 *   Another Believer, "Salt Lake City - Vivint arena.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Salt_Lake_City_-_Vivint_arena.jpg
 *     (north-east front square on before the canopy: band heights, panels);
 *   Tamanoeconomico, "Vivint Smart Home Arena (1).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Vivint_Smart_Home_Arena_(1).jpg
 *     (north-east front from 300 West and South Temple, before the canopy);
 *   Lomrjyo, "Delta Center 2023.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Delta_Center_2023.jpg
 *     (north-west face from South Temple: precast colour, glass band).
 * Estimated: the parapet 34 m above the plaza (scaled from Another
 *   Believer's square-on photo against OSM's 107 m face); front blocks 31 m;
 *   band heights from the same photo; canopy underside 11.5 m (photo);
 *   lantern 4 m over the roof. The plaza level 9 m above y = 0 is from the
 *   map's terrain. No lidar used.
 * Left out: lettering of the signs, the screen art, the bollards and plaza.
 * Doubts: the south-west (service) and south-east (300 West side) faces are
 *   in no photo used; they are drawn like the north-west face (solid precast,
 *   one glass band), plain precast below the plaza level. The south-east
 *   vestibule is from OSM and NAIP only.
 * Night: glass is `window` (the concourses are lit); the canopy is trim.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const HX = 53.5, HY = 59.5 // the main box's half-widths
const P = 9 // plaza level above y = 0
const TOP = P + 34, FB = P + 31 // main parapet, front blocks

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), solar = new Part()

  // ------------------------------------------------------------ massing
  prism(stone, roof, chamfer(rect(-HX, -HY, HX, HY), 0.8), 0, TOP)
  // a low parapet lip
  prism(trim, trim, chamfer(rect(-HX - 0.3, -HY - 0.3, HX + 0.3, HY + 0.3), 0.9), TOP - 0.6, TOP + 0.4)
  const fronts: { r: XY[]; f: Face; half: number }[] = [
    { r: rect(-33.5, HY - 1, 33.5, 68.9), f: { o: [0, 68.9, 0], n: [0, 1] }, half: 33.5 },
    { r: rect(-33.2, -68.0, 33.2, -HY + 1), f: { o: [0, -68.0, 0], n: [0, -1] }, half: 33.2 },
    { r: rect(HX - 1, -38.2, 62.6, 38.6), f: { o: [62.6, 0.2, 0], n: [1, 0] }, half: 38.4 },
    { r: rect(-62.7, -37.6, -HX + 1, 37.6), f: { o: [-62.7, 0, 0], n: [-1, 0] }, half: 37.6 },
  ]
  for (const { r } of fronts) {
    prism(stone, roof, chamfer(r, 0.6), 0, FB)
    prism(trim, trim, chamfer(r.map(([x, y]) => [x + Math.sign(x) * 0.25, y + Math.sign(y) * 0.25] as XY), 0.7), FB - 0.5, FB + 0.3)
  }

  // ------------------------------------------------------------ front-block facades
  // the north-east front (photos from 300 West and the drone) is glazed; the north-west
  // face (South Temple, Lomrjyo's photo) is solid precast with one glass band, and
  // the unphotographed south-west and south-east faces are drawn like it.
  fronts.forEach(({ f, half }, k) => {
    const glazed = k === 0
    const h = (z: number) => P + z
    // the tall recessed entrance storey: glass between precast piers
    const n = Math.round((half * 2) / 8.4), w = (half * 2) / n
    for (let i = 0; i < n && glazed; i++) {
      const s0 = -half + i * w + 0.7, s1 = -half + (i + 1) * w - 0.7
      flatShape(win, f, rect(s0, h(0), s1, h(10.5)), 0.04)
    }
    if (glazed) extrudeShape(trim, f, rect(-half, h(11.3), half, h(13.3)), 0, 0.7) // the band over the entrance storey
    // two glass bands in three runs, with precast piers between
    const runs: [number, number][] = [[-half + 1.2, -half * 0.62], [-half * 0.56, half * 0.56], [half * 0.62, half - 1.2]]
    for (const [a, b] of runs) {
      if (glazed) {
        flatShape(win, f, rect(a, h(14.2), b, h(20.6)), 0.04)
        extrudeShape(trim, f, rect(a, h(17.3), b, h(17.6)), 0, 0.08) // a pale mullion line
      }
      flatShape(win, f, rect(a, h(22.0), b, h(25.6)), 0.04)
    }
    // the dark screen panels in the top band
    for (const e of [-1, 1]) flatShape(roof, f, rect(e * half * 0.43 - 3.6, h(26.6), e * half * 0.43 + 3.6, h(29.8)), 0.04)
  })

  // ------------------------------------------------------------ corner bays: curtain glass
  const sides: { f: Face; half: number; lo: number }[] = [
    { f: { o: [0, HY, 0], n: [0, 1] }, half: HX, lo: 33.5 },
    { f: { o: [0, -HY, 0], n: [0, -1] }, half: HX, lo: 33.2 },
    { f: { o: [HX, 0, 0], n: [1, 0] }, half: HY, lo: 38.6 },
    { f: { o: [-HX, 0, 0], n: [-1, 0] }, half: HY, lo: 37.6 },
  ]
  for (const { f, half, lo } of sides) {
    for (const e of [-1, 1]) {
      const a = e < 0 ? -half + 1.2 : lo + 0.6, b = e < 0 ? -lo - 0.6 : half - 1.2
      flatShape(win, f, rect(a, P, b, P + 23), 0.04)
      for (const z of [P + 7.6, P + 15.3]) extrudeShape(trim, f, rect(a, z, b, z + 0.35), 0, 0.08)
      const m = (a + b) / 2
      extrudeShape(trim, f, rect(m - 0.2, P, m + 0.2, P + 23), 0, 0.08)
    }
  }

  // ------------------------------------------------------------ low blocks
  // glass vestibules on the north-west and south-east faces
  for (const e of [-1, 1]) {
    const x0 = e > 0 ? 62.0 : -74.6, x1 = e > 0 ? 74.2 : -62.0
    prism(trim, roof, chamfer(rect(x0, -11.8, x1, 11.8), 0.4), 0, P + 6.5)
    const f: Face = { o: [e * 74.4, 0, 0], n: [e, 0] }
    flatShape(win, f, rect(-10.8, P, 10.8, P + 5.3), 0.02)
    for (const s of [-1, 1]) flatShape(win, { o: [(x0 + x1) / 2, s * 11.8, 0], n: [0, s] }, rect(-5.2, P, 5.2, P + 5.3), 0.02)
  }
  // the low service block on the south-west, down in the pit
  {
    const ys = [-77.9, -68]
    prism(stone, roof, chamfer(rect(-33.2, ys[0], 33.2, ys[1] + 0.5), 0.4), 0, P + 4)
    const f: Face = { o: [0, -77.9, 0], n: [0, -1] }
    for (const s of [-24, -12, 0, 12, 24]) flatShape(roof, f, rect(s - 2.6, 0.3, s + 2.6, 5.0), 0.04) // loading doors
  }

  // ------------------------------------------------------------ the entrance canopy
  {
    const r = rect(-33.6, 68.9, 33.6, 93.4)
    prism(trim, trim, chamfer(r, 0.5), P + 11.5, P + 13.6)
    capRing(trim, chamfer(r, 0.5), P + 11.5, false)
  }

  // ------------------------------------------------------------ roof: lantern and solar quadrants
  prism(trim, roof, chamfer(rect(-6.0, -6.9, 5.0, 6.4), 0.4), TOP - 1, TOP + 4)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const R = (x0: number, y0: number, x1: number, y1: number) => {
      const a = [sx * x0, sx * x1].sort((p, q) => p - q), b = [sy * y0, sy * y1].sort((p, q) => p - q)
      prism(solar, solar, rect(a[0], b[0], a[1], b[1]), TOP + 0.4, TOP + 0.85)
    }
    R(9, 31, 49, 55)
    R(9, 9, 26, 27)
    R(30, 9, 49, 27)
  }

  return finishGlb('Delta Center', [
    { part: stone, material: finish('slc-arena-precast', 0xd3d3cf) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: { name: 'window', color: 0x7f9aaa, roughness: 0.35 } },
    { part: solar, material: finish('slc-arena-solar', 0x7b8794) },
  ], { bearing: 45, height: TOP + 4, replaces: ['way/23335190'] }, 5000)
}

if (import.meta.main) await writeModel('slc-delta-center', build())
