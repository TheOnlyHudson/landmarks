/**
 * U.S. Bancorp Center (800 Nicollet Mall, 2000), Minneapolis — original
 * procedural geometry, CC0-1.0.
 * bun generators/msp-us-bancorp-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +y runs along Nicollet Mall
 * toward the river). Origin at the anchor, the area centroid of the OSM
 * outline way/461224219 (-93.2738890, 44.9756484), on the lowest ground
 * under it (~259 m NAVD88).
 *
 * Form: a 32-storey white tower, 41 x 66 m, to 143 m, with blue ribbon
 * windows and a crown of white piers framing dark recessed bays in its top
 * floors. At its south end (8th Street) a 15-storey block of the same white
 * cladding with punched windows rises to 64 m; a low strip on the west side
 * and a two-storey corner unit at the south-west fill the rest of the lot.
 *
 * Identity: the assignment described pink granite and a stepped crown. The
 * licensed photos of the building at 800 Nicollet Mall (Horatius, Gjerdingen)
 * show white cladding, blue glass and a flat, open-framed crown, and the
 * lidar shows a flat top; the model follows the photos and lidar. The OSM
 * parts way/460870584, 460870588, 460870589 (900-920 2nd Avenue South) and
 * way/461224210 (~90 m east) are other buildings and are not replaced.
 *
 * Sources
 * - OSM: outline way/461224219 (height 142); parts way/461224215 (tower, 32
 *   levels, 142), way/1393991636 (south block), way/1393991638 (west strip),
 *   way/1393991637 (corner shop, "Boost Mobile").
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, class
 *   18 kept; heights above 259 m): tower roof 143 (crown recess 139 over a
 *   strip near y -7); south block 64; west strip 13-20; corner shop 20-21.
 * - Photos (Wikimedia Commons, all evidence):
 *   AlexiusHoratius, "US Bancorp Center Minneapolis 1.jpg", CC BY-SA 3.0
 *     (from Nicollet Mall, south): base block, ribbon windows, crown.
 *     https://commons.wikimedia.org/wiki/File:US_Bancorp_Center_Minneapolis_1.jpg
 *   Greg Gjerdingen, "DSC07244 (25676704531).jpg" and "DSC07242
 *     (25141345594).jpg", CC BY 2.0 (from the west, elevated): the tower's
 *     long face and the crown's recessed bays.
 *     https://commons.wikimedia.org/wiki/File:DSC07244_(25676704531).jpg
 *     https://commons.wikimedia.org/wiki/File:DSC07242_(25141345594).jpg
 *   Bobak Ha'Eri, "051907-004-NicolletMall.jpg", CC BY 3.0: street context.
 *     https://commons.wikimedia.org/wiki/File:051907-004-NicolletMall.jpg
 *
 * Estimated: storey height 4.2 m, panels two floors to a group, bay widths
 * (13 m on the tower, so the ribbons read; 3.4 m on the base), the crown's bays (~4.5 m, 6 m deep).
 *
 * Night: windows glow; the crown's recessed bays are drawn as a second
 * window colour so they read lit (no licensed night photo was found).
 *
 * Doubts: the north and east faces are seen only obliquely in the photos;
 * the crown's corner treatment is simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, edgePanels, outward, finishGlb } from './sea-rainier-square-tower'

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const Z = { tower: 143, crown: 136.5, base: 64, strip: 17, shop: 20 }

function build() {
  const white = new Part(), win = new Part(), crown = new Part(), roof = new Part()

  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string) => prisms.push({ ring: ccw(chamfer(ring, 0.5)), z1, wall: white, roof, kind })
  add(rect(-18.3, -17.0, 23.0, 48.9), Z.tower, 'tower')
  add(rect(-18.3, -49.0, 25.8, -17.0), Z.base, 'base')
  add(rect(-24.8, -34.7, -18.3, 48.7), Z.strip, 'strip')
  add(rect(-19.0, -49.0, -12.4, -34.8), Z.shop, 'shop')

  const towerGrid = { group: 8.4, spandrel: 2.6, pier: 1.2, bayW: 13, head: Z.tower - Z.crown + 1, foot: 2, inset: 1.2 }
  const baseGrid = { group: 8.4, spandrel: 3.2, pier: 1.4, bayW: 3.4, head: 2.5, foot: 1.2, inset: 1.0 }
  const lowGrid = { group: 8.4, spandrel: 2.6, pier: 1.0, bayW: 4, head: 1.5, foot: 0.8, inset: 0.8 }
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(white, r, i, z0, Q.z1)
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 3) continue
      edgePanels(win, r, i, z0, Q.z1, Q.kind === 'tower' ? towerGrid : Q.kind === 'base' ? baseGrid : lowGrid, false)
    }
    capRing(roof, r, Q.z1)
  }

  // ---------------------------------------------------------------- the crown: white piers, dark recessed bays
  {
    const r = prisms[0].ring
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const bays = Math.max(1, Math.round((L - 2) / 4.6)), w = (L - 2) / bays, o = 0.07
      for (let k = 0; k < bays; k++) {
        const s0 = 1 + k * w + 0.6, s1 = 1 + (k + 1) * w - 0.6
        const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
        crown.quad(P(s0, Z.crown), P(s1, Z.crown), P(s1, Z.tower - 1.2), P(s0, Z.tower - 1.2))
      }
    }
    // a slightly raised white coping
    const r2 = ccw(chamfer(rect(-18.6, -17.3, 23.3, 49.2), 0.6))
    for (let i = 0; i < r2.length; i++) wallEdge(white, r2, i, Z.tower - 1.2, Z.tower + 0.5)
    capRing(roof, r2, Z.tower + 0.5)
  }

  return finishGlb('msp-us-bancorp-center', 'U.S. Bancorp Center', [
    { part: white, material: finish('usb-white', 0xeceae5) },
    { part: win, material: { ...PALETTE.window, color: 0x6c8cab } },
    { part: crown, material: windowVariant(2, 0x56677a) },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 30.5, height: Z.tower + 0.5,
    replaces: ['way/461224219', 'way/461224215', 'way/1393991636', 'way/1393991637', 'way/1393991638'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-us-bancorp-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
