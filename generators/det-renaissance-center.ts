/**
 * Renaissance Center, Detroit (1977, John Portman & Associates; Towers 500
 * and 600 1981; Wintergarden and riverfront podium 2004) — original
 * procedural geometry, CC0-1.0.
 * bun generators/det-renaissance-center.ts
 *
 * The shared kit (round walls, caps, grouped window panels, bevelled
 * prisms, the GLB writer with budget checks) is imported from
 * atl-westin-peachtree-plaza.ts, already on main.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the complex's OSM multipolygon
 * relation/10011997 (outer ways 107606561, the main podium, and 105530713,
 * the podium of Towers 500 and 600): 42.329203, -83.039539. Bearing 0: the
 * plan is built straight from OSM coordinates, so its own axes (the towers'
 * chamfered squares, the podium at bearings 60/150) are drawn turned.
 *
 * Identity: a cluster of dark bronze glass towers on a podium by the river.
 *  1. the 73-storey central glass cylinder (Detroit Marriott), silver
 *     glass, with a slim lift shaft on its river side that rises above the
 *     roof, a ring band under the top floors and GM signs on the crown;
 *  2. four 39-storey office towers (100–400) round it, chamfered squares in
 *     dark bronze glass, each with a tall silver round shaft on its outer
 *     chamfer, open in a white slot on its lower part, and a short shaft on
 *     its inner chamfer; a blue rim at the top of each;
 *  3. the two 21-storey octagonal Towers 500 and 600 to the north-east, with
 *     pale penthouses;
 *  4. the green glass Wintergarden (2004) widening to the river between
 *     Towers 300 and 400;
 *  5. the pale concrete podium with a glazed band.
 * Towers 500 and 600 are in: their podium way/105530713 is an outer way of
 * the Renaissance Center relation itself, and OSM names them "Renaissance
 * Center Tower 500/600" (built 1981 as the complex's second phase).
 *
 * Evidence:
 *  - plan: OSM, every building:part of the relation (fetched 2026-11-18):
 *    central cylinder way/30258238 (r 19.6), crown way/419447166 (r 12.5),
 *    lift shaft way/107546101 (r 4.0, bearing 152° off the centre);
 *    office towers ways 419447153/154/155, 107550563 (chamfered squares
 *    r 23.4, faces centred on bearings 15 + 90k, chamfers 29° wide);
 *    their shafts ways 419447157–164 (r 5.6, 28.2 m out on bearings 150 and
 *    330); penthouses 419447167–170 (r 7.4); Towers 500/600 ways 107551662
 *    and 56019569 (octagons r 24.2), penthouses 419448687/688 (r 8.7);
 *    Wintergarden way/419447156 (the wedge); hotel drum way/419447165
 *    (r 37.6); podium ways 107606561 / 1307210646 and 105530713. The
 *    lidar footprints match OSM to about 1 m.
 *  - heights: USGS 3DEP lidar USGS_LPC_MI_WayneCo_2017_LAS_2018 (2017
 *    flight), 1 m grid, ground_min 173.25 m. The map's lowest ground under
 *    the footprint is 174.9 m (terrain check; the service drive by Tower
 *    500), so model z = lidar height above ground_min − 1.2; Jefferson
 *    Avenue and the plaza are at z ≈ 7.6 and the river walk at ≈ 5.
 *    Measured (model z): central glass rim 223.8, roof deck 221.8, raised
 *    roof drum 226.4, lift shaft top 228.1 (≈ 219–220 m above Jefferson;
 *    published 221.5 m / 727 ft, 73 floors, Wikipedia and CTBUH); office
 *    tower roofs 157.3, penthouses 162.2, tall shafts 164.3, short shafts
 *    99.4 (published 159 m / 522 ft, 39 floors, to the shaft tops above the
 *    river walk); Towers 500/600 roofs 91.5, penthouses 102.6 (21 floors);
 *    hotel drum 31.6; podium 19.5 (lidar 19–22), the raised podium blocks
 *    31.5, 26.8 and 24; Towers 500/600 podium 14.4; Wintergarden 26 at its
 *    inner end to 35 at the river.
 *  - estimated from photos: the ring band under the crown floors 17 m below
 *    the rim (Crisco 1492 2014, scaled from the tower's width); the GM signs
 *    ≈ 7 × 7 m; the white slots on the tall shafts up to z ≈ 75 (≈ 40 % of
 *    the tower, Crisco 1492 2014); the Wintergarden's section (vertical
 *    sides to about half its height, then round), from Ken Lund's crop and
 *    the 2014 front view; the podium's glazed band from the same crop.
 *  - colour: the office towers are dark bronze glass in daylight (Lund 2014
 *    from Woodward, Crisco 2014 and 2025 from Windsor), blue-grey in some
 *    light (Lemay 2024, Woodrich 2025); drawn as warm dark panels (window-3
 *    #58524d) between lighter bronze piers (#7a6a58), pulled up from the
 *    near-black of the photos as STYLE.md asks, and still the darkest thing
 *    in the set. The central cylinder and the shafts are silver mirror glass
 *    (window-2 #a3aaaf). The Wintergarden is pale green glass (window-4
 *    #b0d8d0) with bold silver ribs (transverse arches, crown, front
 *    mullions). The rims and the GM signs are blue (#3f6fc6) in every photo
 *    since 2014. The podium (review round 1) is a low mid-grey band: walls
 *    and roofs in palette `roof` grey with a continuous dark glazing band
 *    (window-3) in broad panels between slim piers.
 *  - six-material budget: bronze, window-3, window-2, window-4, neon and
 *    one concrete slot leave no room for a separate pale concrete or a lawn
 *    green, so the podium walls, podium roofs, tower roofs and penthouses
 *    are all `roof` grey (the real tower roofs and penthouses are paler),
 *    the podium's lawn terraces are grey, and the inner face of each
 *    shaft's open slot (white concrete, lit at night in Barera 2023) shares
 *    the Wintergarden's pale green-white window-4 so it still reads against
 *    the silver shaft and glows at night.
 *
 * Night (Barera 2023, Crisco 1492 2025 fireworks): the blue rims and the GM
 * sign glow blue (neon-rencen-blue); office, hotel and podium windows and
 * the shafts glow as windows; the Wintergarden is lit gold from inside in
 * both night photos, so it is a window variant (window-4) rather than dark
 * glass. The red lights on the penthouses of Towers 500/600 are left out
 * (a seventh material).
 *
 * Photos (all EVIDENCE):
 *  - Renaissance Center, Detroit, Michigan from S 2014-12-07.jpg, Crisco
 *    1492, public domain (from Windsor, along the Wintergarden's axis)
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Center,_Detroit,_Michigan_from_S_2014-12-07.jpg
 *  - Renaissance Centre from Windsor, Ontario, 2025-05-30.jpg, Crisco 1492,
 *    CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Centre_from_Windsor,_Ontario,_2025-05-30.jpg
 *  - Renaissance Centre viewed from Walker Road, Walkerville, Windsor,
 *    Ontario, 2025-09-01.jpg, Chris Woodrich (Crisco 1492), CC BY-SA 4.0
 *    (from the east-south-east)
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Centre_viewed_from_Walker_Road,_Walkerville,_Windsor,_Ontario,_2025-09-01.jpg
 *  - Aerial View of Renaissance Center.jpg, Robert Thompson, CC BY-SA 4.0
 *    (2008, from the east, high)
 *    https://commons.wikimedia.org/wiki/File:Aerial_View_of_Renaissance_Center.jpg
 *  - Renaissance Center, Detroit, Michigan (14180762106), Ken Lund, CC BY-SA
 *    2.0 (from Woodward and Jefferson, the west; bronze colour, crown)
 *    https://www.flickr.com/photos/75683070@N00/14180762106
 *  - Renaissance Center, Downtown Detroit, Michigan from Windsor, Ontario
 *    (21782135551) (Wintergarden).jpg, Ken Lund, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Center,_Downtown_Detroit,_Michigan_from_Windsor,_Ontario_(21782135551)_(Wintergarden).jpg
 *  - Renaissance Center, Jefferson Avenue, Detroit, MI - 54219138759.jpg and
 *    - 54217977917.jpg, w_lemay, CC BY-SA 2.0 (2024, from Jefferson and
 *    from the Wintergarden: shafts, slots, crown)
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Center,_Jefferson_Avenue,_Detroit,_MI_-_54219138759.jpg
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Center,_Jefferson_Avenue,_Detroit,_MI_-_54217977917.jpg
 *  - Renaissance Center (23 April 2017).jpg, Notorious4life, CC0
 *    https://commons.wikimedia.org/wiki/File:Renaissance_Center_(23_April_2017).jpg
 *  - Ren Cen Towers 500 and 600.jpg, Local hero, public domain
 *    https://commons.wikimedia.org/wiki/File:Ren_Cen_Towers_500_and_600.jpg
 *  - Windsor December 2023 07 (Renaissance Center).jpg, Michael Barera,
 *    CC BY-SA 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Windsor_December_2023_07_(Renaissance_Center).jpg
 *  - Ford Fireworks from Riverside near Pierre, Windsor, Ontario,
 *    2025-06-23 26.jpg, Crisco 1492, CC BY-SA 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Ford_Fireworks_from_Riverside_near_Pierre,_Windsor,_Ontario,_2025-06-23_26.jpg
 * Map terrain: Mapterhorn. No look-only sources. No commercial imagery.
 *
 * Doubts:
 *  - the podium is simplified to one roof at 19.5 m with four raised blocks
 *    read from lidar; its lawns, ramps, the glass entrance pavilion on
 *    Jefferson (lidar ≈ 24, drawn at the podium's 19.5) and the old berms
 *    are left out, and its roof is the same grey as its walls;
 *  - the north (Jefferson) faces are seen only from close below (Lemay
 *    2024); the podium's north elevation is generic;
 *  - the ring band and the rims change colour with the lighting scheme (red
 *    in some 2014 photos, black in 2014 daylight); drawn blue, the colour
 *    in most photos and the night photos;
 *  - the GM signs are plain boxes (STYLE.md: other signs are plain boxes),
 *    on the four faces along the towers' axes; the real logo is a blue
 *    rounded square with white letters; in 2025 the crown carried a
 *    temporary Chevrolet wrap;
 *  - the lidar is from 2017; the photos to 2025 show no change to the
 *    towers since. GM moved its headquarters out in 2025 and the owner has
 *    proposed taking down two towers; this model is the complex as it
 *    stands in the 2025 photos and in OSM.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import {
  type XY, TAU, circle, at, wall, smoothWall, fan, capPoly, offset, prism, edgePanels, ccw, save,
} from './atl-westin-peachtree-plaza'

// ───────────────────────────── frame helpers ─────────────────────────────

const rad = (d: number) => (d * Math.PI) / 180
/** A plan point at compass bearing `b` (degrees) and distance `r` from `c`. */
const polar = (c: XY, r: number, b: number): XY => [c[0] + r * Math.sin(rad(b)), c[1] + r * Math.cos(rad(b))]
/** The podium's own axes: u along bearing 150 (towards the river), v along bearing 60. */
const uv = (u: number, v: number): XY => [0.5 * u + 0.866 * v, -0.866 * u + 0.5 * v]
/** A polygon from compass bearings of its corners, counter-clockwise from above. */
const poly = (c: XY, r: number, bearings: number[]): XY[] => ccw([...bearings].sort((a, b) => b - a).map((b) => polar(c, r, b)))

/** A vertical quad from plan a to b, its outside to the right of a→b. */
function vface(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}
/** Both windings: for small returns and soffits seen from either side. */
function both(p: Part, a: V3, b: V3, c: V3, d: V3) {
  p.quad(a, b, c, d)
  p.quad(a, d, c, b)
}
/** Long low faces split into ≤ 5 m pieces so they follow the terrain. */
const split = (ring: XY[], step = 5): XY[] => ring.flatMap((a, i) => {
  const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})
/** A podium block: walls from z0 (split when they stand on the ground), a bevelled top edge, the roof capped over the unsplit ring. */
function block(walls: Part, roof: Part, ring: XY[], z0: number, z1: number, bev = 0.5, onGround = true) {
  wall(walls, onGround ? split(ring) : ring, z0, z1 - bev)
  walls.loft([at(ring, z1 - bev), at(offset(ring, -bev), z1)])
  capPoly(roof, offset(ring, -bev), z1, true)
}

// ─────────────────────────────── the model ───────────────────────────────

if (import.meta.main) {
  const bronze = new Part() // office tower walls: piers and spandrels
  const win = new Part() // office and podium windows
  const silver = new Part() // the central cylinder and every round shaft
  const concrete = new Part() // podium, roofs, penthouses, the shafts' open slots
  const glass = new Part() // the Wintergarden
  const neon = new Part() // blue crown rims and the GM signs

  // Heights are metres above the lowest map ground under the footprint
  // (≈ 174.4 m, the service drive by Tower 500); lidar heights above its
  // ground_min (173.25 m) less 1.2. Jefferson Avenue and the plaza ≈ 7.6.
  const PODIUM = 19.5

  // ── Podium: OSM way/107606561, the Wintergarden's wedge cut out of it. ──
  const outline: XY[] = ccw([[-76.7, 60.5], [-79.2, 65.1], [-82.3, 64.4], [-85.8, 64.0], [-89.5, 64.6], [-87.5, 68.4], [-85.3, 71.4], [-83.4, 73.5], [-85.2, 76.8], [-75.2, 82.6], [-73.1, 79.2], [-70.6, 79.8], [-67.9, 80.0], [-65.4, 80.3], [-63.0, 79.8], [-64.2, 77.3], [-65.4, 75.4], [-66.9, 73.2], [-68.8, 71.1], [-66.1, 66.6], [-29.2, 87.7], [12.5, 111.7], [16.7, 105.4], [19.2, 106.8], [21.2, 108.0], [45.5, 67.3], [57.2, 45.8], [68.0, 27.6], [92.2, -14.3], [113.6, -49.9], [112.3, -50.7], [108.5, -53.0], [111.2, -57.9], [48.6, -94.7], [12.0, -60.2], [-4.0, -69.2], [7.0, -118.0], [-46.9, -150.0], [-50.2, -144.7], [-55.7, -148.0], [-69.5, -124.7], [-76.8, -112.4], [-87.5, -94.4], [-89.9, -95.5], [-92.1, -91.6], [-113.7, -54.3], [-115.8, -50.7], [-113.0, -49.2], [-147.6, 10.3], [-142.7, 13.3], [-146.3, 19.8], [-113.1, 39.6], [-111.3, 40.6], [-109.0, 41.9]])
  block(concrete, concrete, outline, 0, PODIUM)
  // A continuous two-storey glazed band round the podium (the 2004
  // riverfront glass), broad panels between slim piers, over a plinth.
  for (let i = 0; i < outline.length; i++)
    edgePanels(win, outline[i], outline[(i + 1) % outline.length], 9, 17.6, { group: 8.6, gap: 0, bay: 13, pier: 0.7, margin: 0.4, min: 4 })

  // Raised podium blocks (lidar, read in the podium's own axes).
  const rect = (u0: number, u1: number, v0: number, v1: number): XY[] => ccw([uv(u0, v0), uv(u1, v0), uv(u1, v1), uv(u0, v1)])
  block(concrete, concrete, rect(-88, -42, -72, 14), PODIUM - 1, 31.5, 0.5, false) // the hotel block on the Jefferson side
  block(concrete, concrete, rect(-42, -14, -38, -16), PODIUM - 1, 31.5, 0.5, false)
  block(concrete, concrete, rect(-16, 34, 44, 70), PODIUM - 1, 26.8, 0.5, false)
  block(concrete, concrete, rect(-14, 48, -104, -84), PODIUM - 1, 24, 0.5, false)
  edgePanels(win, uv(-88, 14), uv(-88, -72), 21.5, 30, { group: 8.5, gap: 0, bay: 13, pier: 0.7, margin: 0.6, min: 9 })

  // ── Towers 500 and 600 podium: OSM way/105530713. ──
  const east: XY[] = ccw([[36.7, 102.3], [134.9, 159.8], [166.8, 106.5], [68.6, 50.6], [66.7, 49.5]])
  block(concrete, concrete, east, 0, 14.4)
  for (let i = 0; i < east.length; i++)
    edgePanels(win, east[i], east[(i + 1) % east.length], 7.5, 13, { group: 5.5, gap: 0, bay: 13, pier: 0.7, margin: 0.4, min: 4 })

  // ── The central tower: the Marriott, 73 storeys. ──
  const C0: XY = [-18.07, -24.27]
  const R0 = 19.6, N0 = 32
  const BAND = 205.6, RIM = 223.8
  smoothWall(concrete, circle(C0, 37.6, N0), PODIUM - 1, 31.6) // the hotel's drum round the foot
  fan(concrete, circle(C0, 37.6, N0), 31.6, true, C0)
  smoothWall(silver, circle(C0, R0, N0), 31.6, BAND)
  smoothWall(neon, circle(C0, R0 + 0.12, N0), BAND, BAND + 1.6) // the ring under the crown floors
  smoothWall(silver, circle(C0, R0, N0), BAND + 1.6, RIM - 1.4)
  smoothWall(neon, circle(C0, R0 + 0.12, N0), RIM - 1.4, RIM) // the crown rim
  fan(concrete, circle(C0, R0 + 0.12, N0), RIM, true, C0)
  smoothWall(concrete, circle(C0, 13.5, 20), RIM, 226.4) // raised roof drum
  fan(concrete, circle(C0, 13.5, 20), 226.4, true, C0)
  // The GM signs: plain boxes on four sides of the crown floors.
  for (const b of [16.7, 106.7, 196.7, 286.7]) {
    const n: XY = [Math.sin(rad(b)), Math.cos(rad(b))], t: XY = [-n[1], n[0]]
    const c = polar(C0, R0 - 0.6, b), w = 3.6, d = 1.3
    const ring: XY[] = [
      [c[0] - t[0] * w, c[1] - t[1] * w], [c[0] + t[0] * w, c[1] + t[1] * w],
      [c[0] + t[0] * w + n[0] * d, c[1] + t[1] * w + n[1] * d], [c[0] - t[0] * w + n[0] * d, c[1] - t[1] * w + n[1] * d],
    ]
    prism(neon, ccw(ring), 211, 218.2, neon, 0.2)
  }
  // The lift shaft on the river side, to 228 m.
  const S0: XY = [-6.97, -44.87]
  smoothWall(silver, circle(S0, 4.0, 14), 30, 228.1)
  fan(concrete, circle(S0, 4.0, 14), 228.1, true, S0)

  // ── The four 39-storey office towers (100–400). ──
  // Plan: OSM's chamfered squares, r 23.4, square faces centred on bearings
  // 15 + 90k, chamfers 29° wide; a tall round shaft on the outer chamfer
  // (the one facing away from the centre) and a short one on the inner.
  const OFFICE = [-15.5, 45.5, 74.5, 135.5, 164.5, 225.5, 254.5, 315.5]
  const PENT = [358.5, 32.9, 88.3, 122.9, 178.5, 213.5, 268.9, 302.8]
  const ROOF = 157.3, CAP = 162.2, TALL = 164.3, SHORT = 99.4, SLOT = 75
  const towers: Array<{ c: XY; tall: number }> = [
    { c: [-82.35, -4.66], tall: 330 }, // 100
    { c: [-1.28, 39.98], tall: 330 }, // 200
    { c: [46.22, -41.38], tall: 150 }, // 300
    { c: [-36.55, -87.36], tall: 150 }, // 400
  ]
  const officePanels = { group: 11.25, gap: 1.3, bay: 7.6, pier: 0.9, margin: 0.8 }
  for (const { c, tall } of towers) {
    const ring = poly(c, 23.4, OFFICE)
    prism(bronze, ring, PODIUM - 1, ROOF, concrete, 0.45)
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
      const brg = (Math.atan2(m[0], m[1]) * 180 / Math.PI + 360) % 360
      if (Math.abs(((brg - 150 + 540) % 180) - 0) < 10 || Math.abs(((brg - 150 + 540) % 180) - 180) < 10) continue // shafts
      edgePanels(win, a, b, PODIUM + 0.5, 154.4, officePanels)
    }
    // Blue rim round the top (lit blue at night).
    wall(neon, offset(ring, 0.12), 154.9, 156.6)
    // Penthouse.
    prism(concrete, poly(c, 7.4, PENT), ROOF - 0.5, CAP, concrete, 0.3)

    // Tall shaft, with the open white slot on its outer face up to ~75 m.
    const sc = polar(c, 28.2, tall), N = 20, r = 5.6
    const outA = rad(90 - tall)
    const ring2 = circle(sc, r, N, outA - (0.5 * TAU) / N)
    smoothWall(silver, ring2.slice(2), PODIUM - 1, SLOT, false)
    smoothWall(silver, ring2, SLOT, TALL - 0.3)
    fan(concrete, ring2, TALL - 0.3, true, sc)
    const inset = (q: XY, d: number): XY => [q[0] - Math.cos(outA) * d, q[1] - Math.sin(outA) * d]
    const A = ring2[N - 1], B = ring2[2], A2 = inset(A, 0.9), B2 = inset(B, 0.9)
    vface(glass, A2, B2, PODIUM - 1, SLOT) // the open slot's lit inner face
    both(concrete, [A[0], A[1], PODIUM - 1], [A2[0], A2[1], PODIUM - 1], [A2[0], A2[1], SLOT], [A[0], A[1], SLOT])
    both(concrete, [B2[0], B2[1], PODIUM - 1], [B[0], B[1], PODIUM - 1], [B[0], B[1], SLOT], [B2[0], B2[1], SLOT])
    // Soffit over the slot, seen from below and above.
    const lid: XY[] = [A2, B2, ring2[2], ring2[1], ring2[0], ring2[N - 1]]
    for (let k = 1; k < lid.length - 1; k++) {
      const P = (q: XY): V3 => [q[0], q[1], SLOT]
      concrete.tri(P(lid[0]), P(lid[k]), P(lid[k + 1]))
      concrete.tri(P(lid[0]), P(lid[k + 1]), P(lid[k]))
    }

    // Short shaft on the inner chamfer, to ~99 m.
    const ss = polar(c, 28.2, (tall + 180) % 360), ring3 = circle(ss, r, 16)
    smoothWall(silver, ring3, PODIUM - 1, SHORT)
    fan(concrete, ring3, SHORT, true, ss)
  }

  // ── Towers 500 and 600: 21 storeys, octagons r 24.2, penthouse to ~103 m. ──
  const EASTT = [340.4, 47.6, 70.4, 137.6, 160.4, 227.6, 250.4, 317.6]
  for (const c of [[76.57, 85.93], [126.14, 114.33]] as XY[]) {
    const ring = poly(c, 24.2, EASTT)
    prism(bronze, ring, 13.5, 91.5, concrete, 0.45)
    for (let i = 0; i < ring.length; i++)
      edgePanels(win, ring[i], ring[(i + 1) % ring.length], 17.5, 90, { group: 12.1, gap: 1.2, bay: 6.6, pier: 0.8, margin: 0.7 })
    prism(concrete, poly(c, 8.7, PENT), 91, 102.6, concrete, 0.3)
  }

  // ── The Wintergarden (2004): a glass vault widening to the river. ──
  {
    const Pi: XY = [4.0, -64.7], Po: XY = [27.8, -106.35]
    const L = Math.hypot(Po[0] - Pi[0], Po[1] - Pi[1])
    const ax: XY = [(Po[0] - Pi[0]) / L, (Po[1] - Pi[1]) / L], px: XY = [-ax[1], ax[0]]
    const K = 6, M = 10, Z0 = 4
    const sect: V3[][] = []
    for (let k = 0; k <= K; k++) {
      const t = k / K
      const cx = Pi[0] + ax[0] * L * t, cy = Pi[1] + ax[1] * L * t
      const w = 9.2 + (23.8 - 9.2) * t, h = 26 + (35 - 26) * Math.sin((t * Math.PI) / 2), zs = Z0 + 0.45 * (h - Z0)
      const row: V3[] = [[cx + px[0] * w, cy + px[1] * w, Z0]]
      for (let j = 0; j <= M; j++) {
        const th = (j / M) * Math.PI
        row.push([cx + px[0] * w * Math.cos(th), cy + px[1] * w * Math.cos(th), zs + (h - zs) * Math.sin(th)])
      }
      row.push([cx - px[0] * w, cy - px[1] * w, Z0])
      sect.push(row)
    }
    const mid: V3 = [(Pi[0] + Po[0]) / 2, (Pi[1] + Po[1]) / 2, Z0 + 8]
    const outq = (a: V3, b: V3, c: V3, d: V3) => {
      const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
      const m = [(a[0] + c[0]) / 2 - mid[0], (a[1] + c[1]) / 2 - mid[1], (a[2] + c[2]) / 2 - mid[2]]
      if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) glass.quad(a, b, c, d)
      else glass.quad(a, d, c, b)
    }
    for (let k = 0; k < K; k++)
      for (let j = 0; j < sect[k].length - 1; j++) outq(sect[k][j], sect[k][j + 1], sect[k + 1][j + 1], sect[k + 1][j])
    // The front, facing the river: a fan over the last section.
    const f = sect[K], fc: V3 = [(f[0][0] + f[f.length - 1][0]) / 2, (f[0][1] + f[f.length - 1][1]) / 2, Z0]
    for (let j = 0; j < f.length - 1; j++) {
      const a = f[j], b = f[j + 1]
      const n = [(a[1] - fc[1]) * (b[2] - fc[2]) - (a[2] - fc[2]) * (b[1] - fc[1]), (a[2] - fc[2]) * (b[0] - fc[0]) - (a[0] - fc[0]) * (b[2] - fc[2])]
      if (n[0] * ax[0] + n[1] * ax[1] >= 0) glass.tri(fc, a, b)
      else glass.tri(fc, b, a)
    }
    // Silver mullions on the river front: four uprights and a transom.
    for (const j of [2, 4, 6, 8]) {
      const top = f[1 + j], base: V3 = [top[0], top[1], Z0], e = 0.35
      const q = (p: V3, s: number): V3 => [p[0] + px[0] * s + ax[0] * 0.15, p[1] + px[1] * s + ax[1] * 0.15, p[2]]
      both(silver, q(base, -e), q(base, e), q(top, e), q(top, -e))
    }
    {
      const zt = Z0 + 0.55 * (f[1 + M / 2][2] - Z0), wt = 23.8 * Math.sqrt(Math.max(0, 1 - ((zt - (Z0 + 0.45 * (35 - Z0))) / (35 - (Z0 + 0.45 * (35 - Z0)))) ** 2))
      const c: V3 = [fc[0] + ax[0] * 0.15, fc[1] + ax[1] * 0.15, zt]
      both(silver, [c[0] - px[0] * wt, c[1] - px[1] * wt, zt - 0.35], [c[0] + px[0] * wt, c[1] + px[1] * wt, zt - 0.35], [c[0] + px[0] * wt, c[1] + px[1] * wt, zt + 0.35], [c[0] - px[0] * wt, c[1] - px[1] * wt, zt + 0.35])
    }
    // Bold silver ribs: a transverse arch at every section, and the crown.
    for (let k = 1; k <= K; k++) {
      const row = sect[k], h = 0.45
      for (let j = 0; j < row.length - 1; j++) {
        const a = row[j], b = row[j + 1]
        const o = (q: V3, s: number, up: number): V3 => {
          const dx = q[0] - (Pi[0] + ax[0] * L * (k / K)), dy = q[1] - (Pi[1] + ax[1] * L * (k / K))
          const dl = Math.hypot(dx, dy) || 1, f = 0.18
          return [q[0] + ax[0] * s + (dx / dl) * f * up, q[1] + ax[1] * s + (dy / dl) * f * up, q[2] + f * up]
        }
        both(silver, o(a, -h, 1), o(b, -h, 1), o(b, h, 1), o(a, h, 1))
      }
    }
    for (let k = 0; k < K; k++) {
      const a = sect[k][1 + M / 2], b = sect[k + 1][1 + M / 2]
      both(silver, [a[0] - px[0] * 0.5, a[1] - px[1] * 0.5, a[2] + 0.15], [a[0] + px[0] * 0.5, a[1] + px[1] * 0.5, a[2] + 0.15], [b[0] + px[0] * 0.5, b[1] + px[1] * 0.5, b[2] + 0.15], [b[0] - px[0] * 0.5, b[1] - px[1] * 0.5, b[2] + 0.15])
    }
  }

  await save('det-renaissance-center', 'Renaissance Center', [
    { part: bronze, material: finish('rencen-bronze', 0x7a6a58) },
    { part: win, material: windowVariant(3, 0x58524d) },
    { part: silver, material: windowVariant(2, 0xa3aaaf) },
    { part: concrete, material: PALETTE.roof },
    { part: glass, material: windowVariant(4, 0xb0d8d0) },
    { part: neon, material: finish('neon-rencen-blue', 0x3f6fc6) },
  ], { height: 228.1, anchor: [42.329203, -83.039539], bearing: 0 }, 6500)
}
