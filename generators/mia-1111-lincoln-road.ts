/**
 * 1111 Lincoln Road garage, Miami Beach (2010, Herzog & de Meuron) —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-1111-lincoln-road.ts
 *
 * Map frame: x east, y north (turned to bearing 359, the OSM walls' axis),
 * metres, origin at the anchor on the ground. Anchor = centroid of the OSM
 * outline way/297682282, 25.7908098, -80.1408174. Lincoln Road is to the
 * south (−y), Alton Road to the west (−x).
 *
 * Identity, in order: an open concrete skeleton with no walls — thin
 * cantilevered slabs at irregular heights (four close parking decks, then
 * two very tall levels at the top), each slab tapering to a knife edge;
 * the angled, wedge-shaped blade columns standing in from the edges,
 * leaning one way on one level and the other on the next; the glazed shops
 * on the ground floor; the glass boutique box hung in the fifth level near
 * the south-west corner; the rooftop pavilion.
 *
 * Night: the slab undersides and blades are lit by downlights
 * (`_FLOODLIGHT` on the concrete, strongest on faces looking down); the
 * shops and the boutique box glow (`window`).
 *
 * Evidence:
 *  - plan: OSM way/297682282 (51.6 x 45.8 m); the slabs cantilever a
 *    little past it to the south, as the lidar shows (roof slab
 *    x −26..26, y −26.5..22.5).
 *  - heights: lidar, USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019
 *    (flown 2019), 0.5 m grid: roof slab 38.3 above the ground; the shops'
 *    canopy slab 5.3–5.7; a rooftop pavilion x −22..−8, y −10..2 to ~43.6;
 *    a sunken garden x −4..22, y −8..−2 about 4 m below the roof. OSM
 *    building:levels = 8 (shops, six decks, roof).
 *  - the intermediate slab heights (9.6, 12.7, 15.8, 19.0, 27.8): estimated
 *    from the photos below, the tall top two levels scaled between the
 *    measured roof and the decks below; the blade layout follows the
 *    photos' rhythm (about 9 m apart, 3–4 m in from the edges) rather than
 *    a surveyed plan.
 *  - colours: pale board-formed concrete; glass (photos).
 *
 * Photos:
 *  - Modern Parking Garage Lincoln Road Mall South Beach (Phillip Pessar,
 *    CC BY 2.0, flickr.com/photos/25955895@N03/8091783726): daylight from
 *    the south-west, the corner of Lincoln and Alton Roads
 *  - Herzog & de Meuron - Miami 1111 Lincoln Road Parking (Forgemind
 *    ArchiMedia, CC BY 2.0, flickr.com/photos/44343967@N00/5449150347,
 *    5449150801, 5449151771, 5449759512): dusk, from the south-west and
 *    south
 *  - 1111_Lincoln_Road_-_Flickr_-_paologmb.jpg and
 *    111_Lincoln_Road_Parking_(51067696598).jpg (Paolo Gamba, CC BY 2.0,
 *    Commons): the blades and slab undersides from inside
 *  - Parkhaus_Lincoln_Road.jpg (Gofrege, CC BY-SA 3.0, Commons)
 *  - 1111_Lincoln_Road_at_night.jpg (Jonathan Schilling, CC BY-SA 3.0)
 * No look-only sources. No commercial imagery.
 *
 * Left out: the cable railings, the stair and the ramps (no evidence for
 * where they run), parked cars, the planting on the slab edges.
 *
 * Doubts: the core at the north-east (stairs and lifts against the
 * neighbouring office tower) is placed from its absence in every
 * south and west photo, not from a plan. No licensed photo of the north
 * and east sides; the blades there repeat the south and west rhythm.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { box, quadF } from './mia-miami-beach-post-office'

/** A slab with a flat top at z, a 0.3 m edge, its underside thickening to `t` over `taper` m inward. */
function slab(top: Part, under: Part, r: XY[], z: number, t = 0.75, taper = 4) {
  const i = inset(r, taper)
  cap(top, r, z)
  walls(under, r, z - 0.3, z)
  // Underside: from the edge (z − 0.3) up-in to the thicker middle, facing down.
  const V = (q: XY, zz: number): V3 => [q[0], q[1], zz]
  for (let k = 0; k < r.length; k++) {
    const l = (k + 1) % r.length
    quadF(under, V(r[k], z - 0.3), V(r[l], z - 0.3), V(i[l], z - t), V(i[k], z - t), [0, 0, -1])
  }
  cap(under, i, z - t, false)
}

/**
 * A wedge blade between z0 and z1: a slab of thickness `th` in the vertical
 * plane through (cx, cy) along direction d, wb wide at its foot and wt at its
 * head, the foot shifted `lean` along d.
 */
function blade(p: Part, cx: number, cy: number, d: XY, z0: number, z1: number, wb: number, wt: number, lean: number, th = 0.55) {
  const n: XY = [-d[1], d[0]]
  const at = (s: number, o: number, z: number): V3 => [cx + d[0] * s + n[0] * o, cy + d[1] * s + n[1] * o, z]
  const b0 = lean - wb / 2, b1 = lean + wb / 2, t0 = -wt / 2, t1 = wt / 2, h = th / 2
  quadF(p, at(b0, h, z0), at(b1, h, z0), at(t1, h, z1), at(t0, h, z1), [n[0], n[1], 0])
  quadF(p, at(b0, -h, z0), at(b1, -h, z0), at(t1, -h, z1), at(t0, -h, z1), [-n[0], -n[1], 0])
  quadF(p, at(b1, -h, z0), at(b1, h, z0), at(t1, h, z1), at(t1, -h, z1), [d[0], d[1], 0])
  quadF(p, at(b0, -h, z0), at(b0, h, z0), at(t0, h, z1), at(t0, -h, z1), [-d[0], -d[1], 0])
  quadF(p, at(t0, -h, z1), at(t1, -h, z1), at(t1, h, z1), at(t0, h, z1), [0, 0, 1])
}

function build() {
  const conc = new Part(), under = new Part(), roof = new Part(), win = new Part(), garden = new Part()

  // Slab tops and their plans (x0, y0, x1, y1): the roof slab is the widest.
  const Z = [5.6, 9.6, 12.7, 15.8, 19.0, 27.8, 38.3]
  const plans: [number, number, number, number][] = [
    [-25.6, -26.0, 25.2, 22.0],
    [-26.4, -25.0, 25.4, 22.6],
    [-25.4, -26.2, 24.6, 22.2],
    [-26.6, -25.4, 25.4, 22.8],
    [-25.8, -26.6, 25.2, 22.0],
    [-26.8, -25.8, 25.6, 22.9],
    [-26.4, -26.6, 25.8, 22.6],
  ]
  plans.forEach((q, k) => slab(k === Z.length - 1 ? roof : conc, under, rect(q[0], q[1], q[2], q[3]), Z[k]))

  // Ground floor shops, glazed, set in under the first slab, with a few piers.
  const shop = rect(-24.2, -23.4, 23.6, 21.0)
  walls(win, shop, 0, Z[0] - 0.7)
  for (const [x, y] of [[-24.2, -23.4], [23.6, -23.4], [23.6, 21.0], [-24.2, 21.0], [0, -23.4], [-24.2, 0]] as XY[])
    box(conc, [x - 0.5, y], [x + 0.5, y], 0, 1.0, -0.5, 0.5, 0, Z[0] - 0.7)

  // Core at the north-east, against the neighbouring tower.
  const core = rect(15.0, 11.0, 23.0, 20.5)
  walls(conc, core, 0, Z[6] - 0.75)

  // Blades, storey by storey: along each side 3.6 m in from the slab edge,
  // about 9 m apart, leaning alternately; a few in the middle.
  let seed = 7
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  for (let k = 0; k < Z.length - 1; k++) {
    const z0 = Z[k], z1 = Z[k + 1] - 0.75, h = z1 - z0
    const q = plans[k + 1], m = 3.6
    const wt = Math.min(3.4, 1.4 + h * 0.2), wb = 1.1, sgn = k % 2 ? 1 : -1
    const sides: [XY, XY][] = [[[q[0] + m, q[1] + m], [q[2] - m, q[1] + m]], [[q[2] - m, q[1] + m], [q[2] - m, q[3] - m]], [[q[2] - m, q[3] - m], [q[0] + m, q[3] - m]], [[q[0] + m, q[3] - m], [q[0] + m, q[1] + m]]]
    sides.forEach(([a, b], si) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const n = Math.round(L / 11.5), off = (k % 2) * 2.2 + si * 0.9
      for (let i = 0; i < n; i++) {
        const s = Math.min(L - 1.5, 2.5 + off + (i * (L - 4)) / n)
        const cx = a[0] + d[0] * s, cy = a[1] + d[1] * s
        if (cx > 13.5 && cy > 9.5) continue // inside the core
        const lean = sgn * (i % 2 ? 1 : -1) * (0.6 + h * 0.18 + rnd() * 0.6)
        // Every other blade stands across the edge rather than along it.
        const dd: XY = (i + k) % 2 ? d : [-d[1], d[0]]
        blade(conc, cx, cy, dd, z0, z1, wb, wt, lean)
      }
    })
    for (const [cx, cy] of [[-9, -8], [6, -9], [-8, 8], [5, 6]] as XY[])
      blade(conc, cx + (k % 2) * 2, cy, k % 2 ? [1, 0] : [0, 1], z0, z1, wb, wt * 0.8, sgn * (0.8 + h * 0.12))
  }

  // The glass boutique box in the fifth level, near the south-west corner.
  const bq = rect(-23.6, -22.0, -13.0, -9.0)
  walls(win, bq, Z[4], Z[5] - 1.4)
  cap(conc, bq, Z[5] - 1.4)

  // Rooftop pavilion and the sunken garden.
  const pv = rect(-22.0, -10.0, -8.0, 2.0)
  walls(win, pv, Z[6], Z[6] + 3.6)
  slab(roof, under, rect(-22.8, -10.8, -7.2, 2.8), Z[6] + 4.9, 0.6, 1.2)
  cap(garden, rect(-4.0, -8.0, 22.0, -2.0), Z[6] + 0.04)

  const lit = (_p: V3, n: V3) => (n[2] < -0.5 ? 0.7 : n[2] > 0.5 ? 0.05 : 0.35)
  return [
    { part: conc, material: { ...finish('ll-concrete', 0xd9d6cf), floodlight: lit } },
    { part: under, material: { ...finish('ll-concrete-under', 0xc2beb6), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: windowVariant(2, 0x9fb6c9) },
    { part: garden, material: finish('ll-garden', 0x8fa883) },
  ]
}

if (import.meta.main) await save('mia-1111-lincoln-road', '1111 Lincoln Road', [25.7908098, -80.1408174], 359, build(), 6500)
