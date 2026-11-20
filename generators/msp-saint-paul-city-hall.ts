/**
 * Saint Paul City Hall and Ramsey County Courthouse (1932, Holabird & Root
 * with Ellerbe) — original procedural geometry, CC0-1.0.
 * bun generators/msp-saint-paul-city-hall.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned by the placement bearing 326.6 deg
 * (the downtown grid): +y runs north-west toward 4th Street, -y faces
 * Kellogg Boulevard and the river. Origin at the area centroid of the OSM
 * outline way/45827120 (-93.0939747, 44.9442741), on the ground (the site
 * falls under 1 m).
 *
 * Form: an Art Deco limestone tower, 35 x 31 m, rising from Kellogg Blvd to
 * 66 m, with central bays projecting on its Kellogg and 4th Street faces,
 * stepping in to 77 m and 81 m; dark recessed window strips between broad
 * piers. A 15 m base block with an 11 m ring and 6 m outer bands fills the
 * block; a 17.5 m entry block on 4th Street and a 16 m glazed entrance on
 * Kellogg.
 *
 * Sources
 * - OSM: outline way/45827120 (no heights). The City Hall Annex
 *   (way/265528956) is a separate building across the alley, left out.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_5_B22, flown ~2022, class
 *   18 kept): every tier's plan and height: tower 66 / 77 / 81 m (a small
 *   83 m rooftop element left out), base 15 m, ring 11 m, outer bands 6-7 m
 *   along both long sides, entry block 17-18 m.
 * - Published: 1932, Holabird & Root with Ellerbe & Co., 20 storeys,
 *   Indiana limestone (Wikipedia, "Saint Paul City Hall and Ramsey County
 *   Courthouse").
 * - Photos (all evidence):
 *   McGhiever, "St Paul City Hall & Ramsey County Courthouse.jpg", CC BY-SA 3.0
 *     (Kellogg side): https://commons.wikimedia.org/wiki/File:St_Paul_City_Hall_%26_Ramsey_County_Courthouse.jpg
 *   Mulad, "Saint Paul City Hall.jpg", public domain:
 *     https://commons.wikimedia.org/wiki/File:Saint_Paul_City_Hall.jpg
 *   RamseyCountyMN, "Saint Paul City Hall - Ramsey County Courthouse exterior.jpg"
 *     CC BY-SA 2.0 (from Kellogg Blvd): https://commons.wikimedia.org/wiki/File:Saint_Paul_City_Hall_-_Ramsey_County_Courthouse_exterior.jpg
 *   MCAD Library, postcard "St. Paul City Hall and Ramsey County Court House", CC BY 2.0:
 *     https://www.flickr.com/photos/mcadlibrary/10676291664
 *
 * Estimated: window strip widths (1.55 m on a 3.3 m bay), three-storey
 * groups, base window rows; the Kellogg glazing's width and position
 * (the photos show it off-centre in its block, drawn centred). Colours from
 * the daylight photos.
 *
 * Night: windows glow; the glazed entrances are window-2. No night photo
 * was checked, so no floodlight.
 *
 * Doubts: the 6 m bands along the long sides are from lidar only, no photo
 * shows them; the 4th Street side is not photographed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, outward, finishGlb } from './sea-rainier-square-tower'

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

/**
 * Tall window strips on edge i of ring r: bays of about `bay` m, each a
 * panel `w` wide, grouped by `group` m storeys with a stone spandrel `sp`
 * between groups, from z0 + foot to z1 - head.
 */
function strips(part: Part, r: XY[], i: number, z0: number, z1: number, o: { bay: number; w: number; group: number; sp: number; foot: number; head: number; inset: number; zRef?: number }) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * o.inset + o.w) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b), pr = 0.06
  const k = Math.max(1, Math.round((L - 2 * o.inset) / o.bay)), step = (L - 2 * o.inset) / k
  const lo0 = z0 + o.foot, hi0 = z1 - o.head, ref = o.zRef ?? 0
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * pr, a[1] + t[1] * u + n[1] * pr, z]
  for (let m = Math.floor((lo0 - ref) / o.group); ref + m * o.group < hi0; m++) {
    const lo = Math.max(ref + m * o.group + o.sp / 2, lo0), hi = Math.min(ref + (m + 1) * o.group - o.sp / 2, hi0)
    if (hi - lo < 1.5) continue
    for (let j = 0; j < k; j++) {
      const c = o.inset + (j + 0.5) * step
      part.quad(P(c - o.w / 2, lo), P(c + o.w / 2, lo), P(c + o.w / 2, hi), P(c - o.w / 2, hi))
    }
  }
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), glassBay = new Part()
  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string, bev = 0.45) => prisms.push({ ring: chamfer(ring, bev), z1, wall: stone, roof, kind })

  // ---- the base (lidar): an outer 6 m band, the 11 m ring, the 15 m block, the 4th Street entry block
  add(ccw([[-38.8, -29], [42.4, -29], [42.4, 27.5], [8.6, 27.5], [8.6, 22], [-5.6, 22], [-5.6, 27.5], [-38.8, 27.5]]), 6, 'low', 0.3)
  add(rect(-34, -30, 38, 22.5), 11, 'base')
  add(rect(-26, -35, 30, 14), 15, 'base')
  add(rect(-5.6, 8, 8.6, 22), 17.5, 'entry')
  // ---- the tower: a square shaft with central bays on its Kellogg and 4th Street faces, then two setbacks
  add(rect(-15.5, -37.5, 19.5, -10.5), 66, 'tower')
  add(rect(-10, -40.5, 14, -37.5), 66, 'tower')
  add(rect(-4.5, -42.6, 8.5, -40.5), 16, 'porch')
  add(rect(-10, -10.5, 14, -6.5), 66, 'tower')
  add(rect(-11.5, -37.5, 15.5, -10.5), 77, 'tower')
  add(rect(-6.5, -32.5, 10.5, -15.5), 81, 'tower')

  const tower = { bay: 3.3, w: 1.55, group: 11.7, sp: 1.3, foot: 0.8, head: 1.8, inset: 1.2, zRef: 5.4 }
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(stone, r, i, z0, Q.z1)
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 3) continue
      if (Q.kind === 'tower') strips(win, r, i, Math.max(z0, 5.4), Q.z1, tower)
      else if (Q.kind === 'base' || Q.kind === 'low') strips(win, r, i, z0, Q.z1, { bay: 3.6, w: 2.2, group: 5, sp: 1.4, foot: 0.8, head: 1.2, inset: 1.6, zRef: 0 })
      else if (Q.kind === 'entry') {
        const n = outward(a, b)
        if (n[1] > 0.5) { // the tall glazed bay on 4th Street
          const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * 0.06, a[1] + t[1] * u + n[1] * 0.06, z]
          glassBay.quad(P(L / 2 - 3.6, 0.3), P(L / 2 + 3.6, 0.3), P(L / 2 + 3.6, 15.6), P(L / 2 - 3.6, 15.6))
        } else strips(win, r, i, z0, Q.z1, { bay: 3.5, w: 2, group: 6, sp: 1.4, foot: 0.8, head: 1.4, inset: 1.5 })
      }
    }
    capRing(roof, r, Q.z1)
  }
  // the Kellogg entrance block: its tall glazed bay and a plain stone pier
  { const a: XY = [-4.5, -42.6], P = (u: number, z: number): V3 => [a[0] + u, a[1] - 0.06, z]
    glassBay.quad(P(1.2, 0.3), P(7.4, 0.3), P(7.4, 14.6), P(1.2, 14.6)) }

  return finishGlb('msp-saint-paul-city-hall', 'Saint Paul City Hall and Ramsey County Courthouse', [
    { part: stone, material: finish('sp-limestone', 0xe3d7c3) },
    { part: roof, material: { ...PALETTE.roof, color: 0xb9b5ad } },
    { part: win, material: { ...PALETTE.window, color: 0x5f6b77 } },
    { part: glassBay, material: windowVariant(2, 0x9ec4c2) },
  ], { bearing: 326.6, height: 81, replaces: ['way/45827120'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-saint-paul-city-hall.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
