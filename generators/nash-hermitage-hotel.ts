/**
 * The Hermitage Hotel, 231 6th Avenue North at Union Street, Nashville
 * (1910, J. E. R. Carpenter; Beaux-Arts) — original procedural geometry,
 * CC0-1.0.
 * bun generators/nash-hermitage-hotel.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the long arcaded street front (the face with the awnings
 * and the canopy) and -x is the second street front; the U's light court
 * opens to the rear (-y). Anchor = area centroid of OSM way/465282548,
 * 36.163695, -86.782468. y = 0 is the lowest ground under the footprint
 * (the east side, lidar -0.7 m against the box's ground_min); the street
 * at the west corner is 2.9 m higher.
 *
 * Identity, in order: a ten-storey U-shaped block of buff brick; the
 * two-storey cream terra-cotta base on the main front, an arcade of tall
 * round-arched windows between paired columns under a deep entablature
 * with a balcony band; on the second street front tall round-arched
 * windows in cream surrounds over a cream ground storey; the plain brick
 * shaft of punched windows; the cream top storeys with their ornament
 * band and the big projecting cornice; rooftop penthouses.
 *
 * Evidence:
 *  - plan: OSM way/465282548 (U plan, 41.2 x 32 m, court x -7.3..7.1 to
 *    y 0), matching the lidar. The OSM part way/465282566 ("dome") is
 *    ~60 m away on another building; not part of the hotel.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 1 m grid in the
 *    model frame. Above y = 0: main roof 38.7, cornice line 39.3; light
 *    court filled at ~11.5; penthouse 43.8 (x 2..12, y -2..8); the west
 *    rear block rising to 45.5 (x -19..-8, y -18..-3). OSM height 39 —
 *    agrees. Measured.
 *  - storeys and bays from LeMay's corner view (54385284053) and his
 *    arcade view (54384172342), scaled to the lidar (estimated): base
 *    arcade to 11.4 above the street, shaft to ~31, cream top to 37.6.
 *  - colours: buff brick (sampled #c4ab82 sunlit, #afa48a shade, pulled
 *    light), cream terra cotta, grey roof.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The Hermitage Hotel, 6th Avenue and Union Street, Nashville, TN
 *    (54385284053), (54384172342), (54385052706), (54385059461),
 *    (54385058911), (54385290068), Warren LeMay, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:The_Hermitage_Hotel,_6th_Avenue_and_Union_Street,_Nashville,_TN_(54385284053).jpg
 *    https://commons.wikimedia.org/wiki/File:The_Hermitage_Hotel,_6th_Avenue_and_Union_Street,_Nashville,_TN_(54384172342).jpg
 *  - HermitageHotelNashville.jpg, Andrew Jameson, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:HermitageHotelNashville.jpg
 *  - Facade of Hermitage Hotel - Nashville - Tennessee - USA
 *    (10234071866).jpg, Adam Jones, CC BY-SA 2.0 (the arcade close up)
 *    https://commons.wikimedia.org/wiki/File:Facade_of_Hermitage_Hotel_-_Nashville_-_Tennessee_-_USA_(10234071866).jpg
 *  - USGS NAIP (public domain): plan.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the arcade and the entrance canopy are lit
 * (`entrance` doors, floodlit cream base).
 *
 * Left out: the balconettes, window surrounds and pediments on the shaft,
 * the diamond pattern in the top band, awnings, the marquee lettering,
 * the column capitals.
 *
 * Doubts: which street each front faces is read from the lidar canopy and
 * photos; the rear faces and the court are only seen in the lidar (drawn
 * plain brick with punched windows); bay counts are from oblique photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, save, type XY } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, block } from './nash-ryman-auditorium'
import { wf, rect, cavetto, type Side } from './nash-downtown-presbyterian'

function build() {
  const brick = new Part(), cream = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const X0 = -20.6, X1 = 20.6, Y0 = -17.7, Y1 = 14.3, CX0 = -7.3, CX1 = 7.1, CY = 0
  const TOP = 37.6, ROOF = 38.7
  const ST = 2.9 // street at the west corner; ~1.5 mid-front
  // the U, counter-clockwise from above
  const U: XY[] = [[X0, Y0], [CX0, Y0], [CX0, CY], [CX1, CY], [CX1, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]

  // ── Massing ──
  prism(cream, U, 0, 3.6, cream, 0.02) // cream ground storey all round
  prism(brick, U, 3.6, TOP, roof, 0.01)
  cavetto(cream, U, TOP, ROOF, 0.9, roof)
  // light court filled at the lower storeys
  prism(brick, rect(CX0, Y0, CX1, CY), 0, 11.5, roof, 0.1)
  // penthouse and the higher rear block
  prism(cream, rect(2, -2, 12, 8), ROOF, 43.8, roof, 0.15)
  prism(cream, rect(-19, -17.2, -8, -3), ROOF, 45.5, roof, 0.15)
  block(cream, -19.3, -7.7, -17.5, -2.7, 44.9, 45.5)

  // cream top storeys: a band at the top of the shaft and an ornament frieze under the cornice
  const faces: [Side, number, number, number][] = [['N', Y1, X0, X1], ['W', X0, Y0, Y1], ['E', X1, Y0, Y1], ['S', Y0, X0, CX0], ['S', Y0, CX1, X1]]
  for (const [dir, c, lo, hi] of faces) {
    const { f } = wf(dir, c, lo, hi)
    band(cream, f, 0, f.L, 30.8, 31.5, 0.18)
    rectOn(cream, f, 0, f.L, 35.8, TOP, 0.05)
    band(cream, f, 0, f.L, 12.6, 13.2, 0.15)
  }

  // ── Main front (+y): the arcade between paired columns, nine bays ──
  {
    const { f, s } = wf('N', Y1, X0, X1)
    const n = 9, bw = (X1 - X0) / n
    rectOn(cream, f, 0, f.L, 0, 11.4, 0.05) // the terra-cotta base
    band(cream, f, 0, f.L, 10.6, 11.6, 0.45) // entablature / balcony
    for (let i = 0; i < n; i++) {
      const x = X0 + bw * (i + 0.5)
      // arched window
      shape(win, f, opening(s(x), 2.6, 3.2, 8.0, 'round', 10), 0.1)
      // paired columns at each pier
      if (i > 0) for (const d of [-0.45, 0.45]) {
        const px = X0 + bw * i + d
        block(cream, px - 0.28, px + 0.28, Y1, Y1 + 0.55, 1.4, 10.6)
      }
    }
    // the entrance canopy (lidar: ~4.5 m) over the middle bays, doors under it
    block(roof, X0 + bw * 3, X0 + bw * 6, Y1 + 0.6, Y1 + 3.4, 4.4, 4.9)
    for (const k of [3.5, 4.5, 5.5]) rectOn(door, f, s(X0 + bw * k) - 0.9, s(X0 + bw * k) + 0.9, 1.5, 3.2, 0.12)
  }
  // ── Second street front (-x): arched windows in cream surrounds ──
  {
    const { f, s } = wf('W', X0, Y0, Y1)
    const n = 7, bw = (Y1 - Y0) / n
    for (let i = 0; i < n; i++) {
      const y = Y0 + bw * (i + 0.5)
      shape(cream, f, opening(s(y), 3.0, 3.8, 9.0, 'round', 10), 0.05)
      shape(win, f, opening(s(y), 2.3, 4.0, 9.0, 'round', 10), 0.09)
      rectOn(win, f, s(y) - 1.1, s(y) + 1.1, ST + 0.6, 3.4, 0.08)
    }
  }
  // ── Shaft windows: one column per bay on every face, grouped two storeys to a panel ──
  const shaftRows: [number, number][] = [[14.0, 18.8], [20.4, 25.2], [26.8, 30.2], [32.2, 35.2]]
  const column = (dir: Side, c: number, lo: number, hi: number, n: number, w: number) => {
    const { f } = wf(dir, c, lo, hi)
    const bw = f.L / n
    for (let i = 0; i < n; i++) {
      const sc = bw * (i + 0.5)
      for (const [z0, z1] of shaftRows) rectOn(win, f, sc - w / 2, sc + w / 2, z0, z1, 0.1)
    }
  }
  column('N', Y1, X0, X1, 11, 1.7)
  column('W', X0, Y0, Y1, 8, 1.7)
  column('E', X1, Y0, Y1, 8, 1.7)
  column('S', Y0, X0, CX0, 3, 1.7)
  column('S', Y0, CX1, X1, 3, 1.7)
  // court faces: plain punched windows above the court roof
  for (const [dir, c, lo, hi] of [['E', CX0, Y0, CY], ['W', CX1, Y0, CY], ['S', CY, CX0, CX1]] as [Side, number, number, number][]) {
    const { f } = wf(dir, c, lo, hi)
    const n = Math.max(2, Math.round(f.L / 3.6)), bw = f.L / n
    for (let i = 0; i < n; i++) for (const [z0, z1] of shaftRows.slice(0, 3)) rectOn(win, f, bw * (i + 0.5) - 0.6, bw * (i + 0.5) + 0.6, z0, z1, 0.08)
  }
  // lower storeys on the east and rear faces
  for (const [dir, c, lo, hi, n] of [['E', X1, Y0, Y1, 8], ['S', Y0, X0, CX0, 3], ['S', Y0, CX1, X1, 3]] as [Side, number, number, number, number][]) {
    const { f } = wf(dir, c, lo, hi)
    const bw = f.L / n
    for (let i = 0; i < n; i++) rectOn(win, f, bw * (i + 0.5) - 0.62, bw * (i + 0.5) + 0.62, 5.0, 11.8, 0.08)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[2] < 12 && (n[1] > 0.5 || n[0] < -0.5) ? 0.8 : 0)
  return [
    { part: brick, material: finish('hermitage-brick', 0xd4c19e) },
    { part: cream, material: { ...finish('hermitage-terracotta', 0xede5d3), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: { ...PALETTE.entrance, color: 0x7a5a44 } },
  ]
}

if (import.meta.main) {
  await save('nash-hermitage-hotel', 'The Hermitage Hotel', build(), { height: 45.5, anchor: [36.163695, -86.782468], bearing: 332 })
}
