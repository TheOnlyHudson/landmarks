/**
 * Dock 72, Brooklyn Navy Yard: procedural, CC0-1.0.
 * bun generators/nyc-dock-72.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 138.8° (the
 * OSM outline's long sides), so +y runs along the building to its
 * south-east end. The origin is the centroid of OSM way/700015265
 * ("Dock 72", building=office, 17 levels), on the pier. The pier is level
 * (Mapterhorn 3.1–3.4 m across the footprint), so elevation 0.
 *
 * The building. S9 Architecture's 2018 office block on the pier between
 * dry docks: a long narrow slab of glass in a grey frame grid, lifted a
 * double storey on a row of V-shaped steel columns over a recessed glass
 * lobby, and stepped back in terraces at its north-west end (toward
 * Manhattan), so that from the side its profile climbs like a ziggurat to
 * a vertical south-east end with a dark mechanical penthouse (Wikipedia,
 * "Dock 72"; S9 Architecture project page).
 *
 * Numbers:
 *   plan 27 x 162 m: OSM.
 *   height 82 m to the penthouse, 16 storeys: published (Wikipedia; the
 *     building post-dates the 2017 lidar flight, so nothing is measured).
 *   stilts 9 m (the V columns, two storeys); storeys 4.2 m; the base box
 *     to 30 m and four terraces of three storeys stepping back 11 m each at
 *     the north-west end; penthouse 8 m tall on the south-east half:
 *     estimated from "Dock 72 from Building 131 at Brooklyn Navy Yard 01"
 *     and "03" (the base box about a third of the height, four steps).
 *   V columns every 10 m along both long sides: estimated, same photos.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Dock 72 from Building 131 at Brooklyn Navy Yard 01" and "03",
 *     DutchTreat, CC BY-SA 4.0 (the long side and the stepped end)
 *   "Brooklyn Navy Yard crane with Dock 72", DutchTreat, CC BY-SA 4.0
 *   "Brooklyn Navy Yard - WeWork (North Side)", "(South Side)",
 *     Professorcornbread, CC BY-SA 4.0 (the stepped profile from the
 *     water; the V columns, close)
 *   "Brooklyn Navy Yard - WeWork", Professorcornbread, CC BY-SA 4.0
 * Look-only: none.
 *
 * Style: a glass curtain wall drawn as a light sky-glass `window-2` wall in
 * a grey frame grid grouped two storeys a cell, not a dark slab. The thin
 * red spandrel accents are left out. Night: the curtain wall and the lobby
 * glow.
 *
 * Doubts: which end steps (the terraces are drawn at the north-west end,
 * facing Manhattan, from the photos' backgrounds and S9's description;
 * not certain); the exact terrace setbacks; the published height.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, type Facade, type XY } from './nyc-570-lexington'

const HX = 13.5, Y0 = -81, Y1 = 81, STILT = 9, FL = 4.2
const frame = new Part(), glass = new Part(), roof = new Part(), lobby = new Part(), dark = new Part()
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// The glass curtain wall in its grey frame grid, two storeys a cell.
const curtain: Facade = { bay: 6.8, ratio: 0.84, floor: FL, group: 2, spandrel: 0.9, sill: 0.5, head: 0.7, minLength: 5, margin: 0.4 }

// The recessed lobby under the stilts and its soffit.
prism({ wall: lobby, win: null, roof: null, ring: rect(-HX + 3, Y0 + 3, HX - 3, Y1 - 3), z0: 0, z1: STILT, facade: null, bevel: 0.2 })

// The base box and the terraces: each tier three storeys, stepping back 11 m
// at the north-west end (y = Y0); the south-east end stays vertical.
const tiers: [number, number, number][] = [
  [STILT, STILT + 5 * FL, Y0],                       // the base box, to 30 m
  [STILT + 5 * FL, STILT + 8 * FL, Y0 + 11],
  [STILT + 8 * FL, STILT + 11 * FL, Y0 + 22],
  [STILT + 11 * FL, STILT + 14 * FL, Y0 + 33],
  [STILT + 14 * FL, STILT + 16 * FL, Y0 + 44],
]
for (const [z0, z1, y0] of tiers)
  prism({ wall: frame, win: glass, roof, ring: rect(-HX, y0, HX, Y1), z0, z1, facade: curtain, bevel: 0.35 })
// The soffit under the base box, between the lobby and the edges.
{
  const z = STILT
  frame.quad([-HX, Y1, z], [HX, Y1, z], [HX, Y0, z], [-HX, Y0, z])
}
// The dark mechanical penthouse on the south-east half.
const TOPZ = STILT + 16 * FL
prism({ wall: dark, win: null, roof, ring: rect(-HX + 2, 10, HX - 2, Y1 - 1.5), z0: TOPZ, z1: 82, facade: null, bevel: 0.3 })

// V columns along both long sides: two legs from one foot to the soffit.
function leg(p: Part, x: number, yb: number, yt: number, t: number) {
  const P = (yy: number, z: number, dx: number, dy: number): V3 => [x + dx, yy + dy, z]
  const b0 = P(yb, 0, -t, -t), b1 = P(yb, 0, t, -t), b2 = P(yb, 0, t, t), b3 = P(yb, 0, -t, t)
  const t0 = P(yt, STILT, -t, -t), t1 = P(yt, STILT, t, -t), t2 = P(yt, STILT, t, t), t3 = P(yt, STILT, -t, t)
  p.quad(b0, b1, t1, t0); p.quad(b1, b2, t2, t1); p.quad(b2, b3, t3, t2); p.quad(b3, b0, t0, t3)
}
for (const x of [-HX + 0.8, HX - 0.8])
  for (let y = Y0 + 6; y <= Y1 - 5; y += 10) { leg(frame, x, y, y - 3.5, 0.35); leg(frame, x, y, y + 3.5, 0.35) }

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: frame, material: finish('dock72-frame', 0x80868c) },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: PALETTE.window },
  { part: dark, material: finish('dock72-penthouse', 0x55595f) },
]
finishModel('Dock 72', 'nyc-dock-72', parts, { bearing: 138.8, elevation: 0, height: 82, osm: 'way/700015265' })
