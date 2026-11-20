/**
 * Capella Tower (225 South Sixth, formerly First Bank Place, 1992, Pei Cobb
 * Freed & Partners), Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-capella-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 31°: the model's +y runs north-north-east along
 * 2nd Avenue South). Origin at the anchor, the area centroid of the OSM
 * outline way/115559604 (-93.2683018, 44.9759952), on the lowest ground under
 * it.
 *
 * Form: a square tower of blue glass in a rose-granite grid, 51 x 48 m, to
 * 152 m. A glass drum tangent to its west and south faces rises out of it to
 * 205 m (its arc is already the tower's north-west corner from the ground),
 * then a narrower drum to 226 m, crowned by the "halo": a flared open ring,
 * lit blue at night, to 237 m. East of the tower a 60 m block wraps a round
 * glass rotunda (35-40 m); to the south-east a curved 74-84 m block of blue
 * glass steps down to a 55 m wing.
 *
 * Sources
 * - OSM: outline way/115559604 (height 237, 56 levels); parts way/1558948714
 *   (the square tower, 216), way/1558948712 (the drum's top, 216-231),
 *   way/300522150 (east block, 60), way/300522151 and way/300522152 (the
 *   rotunda, 35 and 40), way/461219671 (curved south block, 84),
 *   way/461219674 (its 74 m crescent), way/461219673 (the 13-level wing).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022; tall
 *   tops are high-noise class 18 in this dataset and were read with it
 *   kept; street ~2 m above the box's ground_min): halo ring ~234-238 m
 *   with the drum roof ~222-230 m inside it, the ring about 45 m across; east
 *   block 55-68 m; south block 80-100 m, crescent 70-80 m. The lidar of the
 *   ring is smeared (scan angle), so the drum's plan is taken from OSM.
 * - Published: 237 m (776 ft), 56 storeys, 1992 (Wikipedia, "Capella Tower").
 * - Photos (Wikimedia Commons, all evidence):
 *   McGhiever, "Capella Tower.jpg", CC BY 4.0 (from the south-east):
 *     drum, square, rotunda block. https://commons.wikimedia.org/wiki/File:Capella_Tower.jpg
 *   Michael Barera, "Minneapolis April 2025 50 (Capella Tower).jpg" and
 *     "... 51 ...", CC BY-SA 4.0 (from the plaza, south): the curved south
 *     block, the drum. https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_50_(Capella_Tower).jpg
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_51_(Capella_Tower).jpg
 *   Jim Winstead Jr., "225 South Sixth-Minneapolis-20050927.jpg", CC BY 2.0
 *     (from a tower to the north-west): the square's top, the two drum stages
 *     and the halo's proportions.
 *     https://commons.wikimedia.org/wiki/File:225_South_Sixth-Minneapolis-20050927.jpg
 *   Jazelle Henry, "Blue Capella (17026079201).jpg", CC BY-SA 2.0: the halo lit
 *     blue at night. https://commons.wikimedia.org/wiki/File:Blue_Capella_(17026079201).jpg
 *   Bobak Ha'Eri, "051207-MPLS-004CapellaHQ.jpg", CC BY 3.0: the entrance.
 *
 * Measured: the overall and block heights (lidar), plans (OSM).
 * Estimated from Winstead's photo, scaled to 237 m: the square's top
 * (152 m), the lower drum's top (205 m) and the upper drum (r 16 m, to
 * 226 m), the halo's flare (r 16.3 -> 22.5 m over 229-236 m, with a 1 m rim). The rotunda is
 * kept at OSM's 35/40 m where it bulges out of the east block.
 *
 * Night: the halo is lit blue (Henry's photo), drawn as a neon material in a
 * light blue that reads as a pale ring by day; the glass glows as windows.
 *
 * Doubts: lidar shows something at ~214-218 m over the square's north-east
 * part (behind the drum) that no photo shows clearly; the square is kept at
 * one height. The halo is an open lattice drawn as a thin solid flare.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, edgePanels, finishGlb } from './sea-rainier-square-tower'

const DC: XY = [-33.5, 12.8], DR = 21.5 // the drum, tangent to the west and south faces
const Z = { square: 152, drum: 205, upper: 226, halo: 237, east: 60 }

function circle(c: XY, r: number, n = 24, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, i) => { const a = a0 + (2 * Math.PI * i) / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })
}

function build() {
  const granite = new Part(), win = new Part(), drumGlass = new Part(), roof = new Part(), halo = new Part()

  // ---- the square tower, its north-west corner cut by the drum's arc
  const arc: XY[] = []
  { const yA = DC[1] + Math.sqrt(DR * DR - (-31 - DC[0]) ** 2), a1 = Math.atan2(yA - DC[1], -31 - DC[0])
    for (let i = 0; i <= 6; i++) { const a = a1 + ((Math.PI - a1) * i) / 6; arc.push([DC[0] + DR * Math.cos(a), DC[1] + DR * Math.sin(a)]) } }
  const square: XY[] = ccw([[-55, -8.8], [-3.7, -8.8], [-3.7, 39.6], [-31, 39.6], ...arc])

  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string, z0 = 0) => prisms.push({ ring: chamfer(ring, 0.45), z1, z0, wall: granite, roof, kind })
  add(square, Z.square, 'tower')
  // east block, rotunda, south blocks (OSM)
  add(ccw([[-3.7, -8.8], [43.2, -8.8], [43.4, 15.9], [34.5, 16.0], [33.7, 18.9], [27.7, 18.8], [27.0, 20.8], [25.5, 23.2], [23.9, 24.5], [21.3, 25.5], [19.0, 26.4], [21.0, 32.5], [19.0, 33.1], [19.1, 39.7], [-3.5, 39.7]]), Z.east, 'block')
  add(circle([17.1, 15.3], 17.6, 16), 35, 'rotunda')
  add(circle([17.1, 15.3], 8.7, 12), 40, 'rotunda')
  add(ccw([[13.9, -54.1], [13.9, -14.9], [18.5, -15.1], [28.5, -16.9], [33.1, -20.5], [36.7, -25.7], [38.0, -36.1], [36.0, -44.2], [28.9, -51.4], [20.5, -54.5]]), 84, 'curve')
  add(ccw([[13.9, -59.8], [20.2, -58.1], [29.7, -56.8], [35.5, -52.4], [41.0, -45.1], [43.0, -39.2], [43.1, -32.4], [39.7, -23.4], [34.5, -16.3], [28.3, -12.6], [19.4, -11.6], [18.5, -15.1], [13.9, -14.9]]), 74, 'curve')
  add(ccw([[13.9, -59.8], [42.9, -59.8], [43.2, -8.8], [14.0, -8.9]]), 55, 'wing')

  const grid = { group: 2 * 4.0, spandrel: 1.2, pier: 1.0, bayW: 4.4, head: 1.4, foot: 1.2, inset: 1.0 }
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      const curved = Q.kind === 'rotunda' || Q.kind === 'curve'
      if (curved) {
        // curved blue glass with granite floor lines
        wallEdge(drumGlass, r, i, z0, Q.z1)
      } else {
        wallEdge(granite, r, i, z0, Q.z1)
        const L = Math.hypot(r[(i + 1) % r.length][0] - r[i][0], r[(i + 1) % r.length][1] - r[i][1])
        edgePanels(win, r, i, z0, Q.z1, grid, L < 6)
      }
    }
    capRing(roof, r, Q.z1)
  }

  // ---- granite floor lines on the curved glass: thin rings standing proud
  const lines = (ring: XY[], c: XY, z0: number, z1: number, step: number, part = granite) => {
    for (let z = z0 + step; z < z1 - 1; z += step) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length]
        const o = (p: XY): XY => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * 0.18, p[1] + (dy / l) * 0.18] }
        const A = o(a), B = o(b)
        part.quad([A[0], A[1], z - 0.5], [B[0], B[1], z - 0.5], [B[0], B[1], z + 0.5], [A[0], A[1], z + 0.5])
      }
    }
  }

  // ---- the drum, above the square, and the upper drum
  const drum = circle(DC, DR, 24, Math.PI / 24)
  for (let i = 0; i < drum.length; i++) wallEdge(drumGlass, drum, i, Z.square, Z.drum, 20)
  lines(drum, DC, Z.square, Z.drum, 9)
  capRing(roof, drum, Z.drum)
  const upper = circle(DC, 16, 20)
  for (let i = 0; i < upper.length; i++) wallEdge(drumGlass, upper, i, Z.drum, Z.upper + 3.5, 20)
  lines(upper, DC, Z.drum, Z.upper, 7)
  capRing(roof, upper, Z.upper + 3.5)
  // a granite band where each drum starts
  for (const [ring, z] of [[drum, Z.square], [upper, Z.drum]] as [XY[], number][]) {
    const o = ring.map(([x, y]): XY => { const dx = x - DC[0], dy = y - DC[1], l = Math.hypot(dx, dy); return [x + (dx / l) * 0.3, y + (dy / l) * 0.3] })
    for (let i = 0; i < o.length; i++) wallEdge(granite, o, i, z, z + 1.6, 20)
    capRing(granite, o, z + 1.6)
  }

  // ---- the halo: a flared ring on the upper drum, open in the middle
  { const n = 24, r0 = 16.3, r1 = 22.5, z0 = Z.upper + 3, z1 = Z.halo - 1.0
    const P = (r: number, a: number, z: number): V3 => [DC[0] + r * Math.cos(a), DC[1] + r * Math.sin(a), z]
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n, b = (2 * Math.PI * (i + 1)) / n
      // outer (underside) and inner (top) faces of the flare
      halo.quad(P(r0, a, z0), P(r0, b, z0), P(r1, b, z1), P(r1, a, z1))
      halo.quad(P(r1, a, z1), P(r1, b, z1), P(r0, b, z0), P(r0, a, z0))
      // the rim: a short upright band round the top
      halo.quad(P(r1, a, z1), P(r1, b, z1), P(r1, b, Z.halo), P(r1, a, Z.halo))
      halo.quad(P(r1 - 0.5, b, z1), P(r1 - 0.5, a, z1), P(r1 - 0.5, a, Z.halo), P(r1 - 0.5, b, Z.halo))
      halo.quad(P(r1 - 0.5, a, Z.halo), P(r1 - 0.5, b, Z.halo), P(r1, b, Z.halo), P(r1, a, Z.halo))
    }
  }

  return finishGlb('msp-capella-tower', 'Capella Tower', [
    { part: granite, material: finish('capella-granite', 0xd4c1b8) },
    { part: win, material: { ...PALETTE.window, color: 0x667f9e } },
    { part: drumGlass, material: windowVariant(2, 0x7c99bd) },
    { part: roof, material: { ...PALETTE.roof, color: 0xaeb0b2 } },
    { part: halo, material: finish('neon-capella-halo', 0xc6d9ec) },
  ], {
    bearing: 31, height: Z.halo,
    replaces: ['way/115559604', 'way/1558948714', 'way/1558948712', 'way/300522150', 'way/300522151', 'way/300522152', 'way/461219671', 'way/461219674', 'way/461219673'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-capella-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
